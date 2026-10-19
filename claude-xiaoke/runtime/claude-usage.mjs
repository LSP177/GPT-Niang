// Today's Claude ledger from local Claude Code transcripts (~/.claude/projects/**/*.jsonl),
// priced at API rates (assets/pricing.json). Ported from 小克 (xiaoke-cc usage.js).
// Claude exposes no public quota API, so instead of guessing limits the bubble shows two
// numbers that local files measure exactly: today's spend and the prompt-cache hit rate.
// Only local files are read; nothing is sent anywhere.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {atomicJson} from './usage.mjs';

const KEEP_DAYS=8;
const CHUNK=4*1024*1024;
const CACHE_VERSION=2;
const readJson=file=>{try{return JSON.parse(fs.readFileSync(file,'utf8').replace(/^﻿/,''));}catch{return null;}};
const localDate=ts=>{const d=new Date(ts);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};

function pricing(appDir){
  const p=readJson(path.join(appDir,'assets','pricing.json'))??{};
  return {models:p.models??{},family:p._family??{}};
}
function priceFor(p,model){
  if(p.models[model])return p.models[model];
  for(const fam of Object.keys(p.family))if(model?.includes(fam))return p.models[p.family[fam]];
  return null;
}
// Cost plus the token counts needed for the cache hit rate and what caching saved.
function measure(p,model,u){
  const cc=u.cache_creation??{};
  const w1h=cc.ephemeral_1h_input_tokens??0;
  let w5m=cc.ephemeral_5m_input_tokens??0;
  if(!w1h && !w5m)w5m=u.cache_creation_input_tokens??0;
  const input=u.input_tokens??0,read=u.cache_read_input_tokens??0,fast=u.speed==='fast'?2:1;
  const price=priceFor(p,model);
  const cost=price?fast*(input*price.input+(u.output_tokens??0)*price.output+w5m*price.cacheWrite5m+w1h*price.cacheWrite1h+read*price.cacheRead)/1e6:0;
  const saved=price?fast*read*(price.input-price.cacheRead)/1e6:0;
  return {c:cost,i:input,w:w5m+w1h,r:read,sv:saved};
}

function listFiles(root){
  const out=[],cutoff=Date.now()-KEEP_DAYS*86400e3;
  const walk=(dir,depth)=>{
    let items;try{items=fs.readdirSync(dir,{withFileTypes:true});}catch{return;}
    for(const it of items){
      const p=path.join(dir,it.name);
      if(it.isDirectory()){if(depth<6)walk(p,depth+1);}
      else if(it.name.endsWith('.jsonl')){try{const st=fs.statSync(p);if(st.mtimeMs>=cutoff)out.push({p,size:st.size});}catch{}}
    }
  };
  walk(root,0);
  return out;
}

// Incremental reader: remembers each file's byte offset; the same reply is written over
// several lines (same message.id + requestId), so the last line's usage wins.
function scan(cache,root,p){
  const list=listFiles(root);
  for(const f of list){
    const st=cache.files[f.p]??{offset:0};
    if(f.size<st.offset)st.offset=0;
    if(f.size===st.offset){cache.files[f.p]=st;continue;}
    let fd;
    try{
      fd=fs.openSync(f.p,'r');
      let pos=st.offset,rest='';
      const buf=Buffer.alloc(CHUNK);
      while(pos<f.size){
        const n=fs.readSync(fd,buf,0,Math.min(CHUNK,f.size-pos),pos);
        if(!n)break;
        pos+=n;
        const lines=(rest+buf.toString('utf8',0,n)).split('\n');
        rest=lines.pop();
        for(const line of lines){
          if(line.indexOf('"assistant"')<0 || line.indexOf('"usage"')<0)continue;
          let o;try{o=JSON.parse(line);}catch{continue;}
          const m=o?.message;
          if(o.type!=='assistant' || !m?.usage || m.model==='<synthetic>')continue;
          const t=Date.parse(o.timestamp)||Date.now();
          cache.entries[(m.id||o.uuid)+':'+(o.requestId||'')]={d:localDate(t),t,m:m.model,...measure(p,m.model,m.usage)};
        }
      }
      st.offset=pos-Buffer.byteLength(rest,'utf8');
      cache.files[f.p]=st;
    }catch{/* file is being written; read it next time */}
    finally{if(fd!==undefined)try{fs.closeSync(fd);}catch{}}
  }
  const alive=new Set(list.map(f=>f.p));
  for(const k of Object.keys(cache.files))if(!alive.has(k))delete cache.files[k];
  const cutoff=localDate(Date.now()-KEEP_DAYS*86400e3);
  for(const k of Object.keys(cache.entries))if(cache.entries[k].d<cutoff)delete cache.entries[k];
}

const money=v=>'$'+(v>0 && v<0.01?'0.01':v<10?v.toFixed(2):v.toFixed(1));
const shortModel=m=>String(m).replace(/^claude-/,'').replace(/-\d{8}$/,'');

export async function readClaudeUsage(config,{now=Date.now(),root=path.join(os.homedir(),'.claude','projects')}={}){
  const cacheFile=path.join(config.dataDir,'usage-cache.json');
  let cache=readJson(cacheFile);
  if(cache?.v!==CACHE_VERSION)cache={v:CACHE_VERSION,files:{},entries:{}};
  scan(cache,root,pricing(config.appDir));
  try{atomicJson(cacheFile,cache);}catch{}

  const today=localDate(now);
  const past=new Set(Array.from({length:7},(_,i)=>localDate(now-(i+1)*86400e3)));
  const recent=new Set(Array.from({length:6},(_,i)=>localDate(now-(i+1)*86400e3)));
  const day={c:0,n:0,i:0,w:0,r:0,sv:0},byModel={};
  let pastCost=0,weekCost=0;
  for(const e of Object.values(cache.entries)){
    if(past.has(e.d))pastCost+=e.c;
    if(recent.has(e.d))weekCost+=e.c;
    if(e.d!==today)continue;
    weekCost+=e.c;
    day.c+=e.c;day.n++;day.i+=e.i;day.w+=e.w;day.r+=e.r;day.sv+=e.sv;
    byModel[shortModel(e.m)]=(byModel[shortModel(e.m)]??0)+e.c;
  }
  const average=pastCost/7;
  const ratio=average>0?day.c/average:0;
  const prompt=day.i+day.w+day.r;
  const hit=prompt>0?day.r/prompt*100:null;
  const models=Object.entries(byModel).sort((a,b)=>b[1]-a[1]).map(([m,v])=>`${m} ${money(v)}`).join(' · ');

  const todayRow={kind:'metric',key:'today',label:'今日',display:money(day.c),
    bar:average>0?Math.min(100,ratio*50):0,color:ratio>=2?'#C0453A':ratio>=1.5?'#D0A051':'#E0895E',
    sub:average>0?`${day.n} 次回复 · 日均 ${money(average)}`:`${day.n} 次回复`,
    tip:'进度条：今天花费相对过去 7 天日均（半满 = 日均，满 = 两倍）'+(models?'\n'+models:'')};
  const cacheRow={kind:'metric',key:'cache',label:'缓存命中',display:hit===null?'—':hit.toFixed(0)+'%',
    bar:hit??0,color:'#D4A256',
    sub:hit===null?'今天还没有对话':`省下 ${money(day.sv)}`,
    tip:'提示词缓存（prompt caching）命中率：命中的 token 按约一折计费'};
  return {ok:true,queryOk:true,source:'local-ledger',accountKey:'claude-local',observedAt:now,plan:'claude',
    planLabel:`近 7 天 ${money(weekCost)} · 按 API 价估算`,windows:[todayRow,cacheRow]};
}
