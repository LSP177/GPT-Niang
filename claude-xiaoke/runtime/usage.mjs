import fs from 'node:fs';
import path from 'node:path';
import {randomUUID} from 'node:crypto';

// Shared snapshot helpers. The Codex quota client was replaced by claude-usage.mjs.
export function atomicJson(file,data) {
  fs.mkdirSync(path.dirname(file),{recursive:true});
  const tmp=file+'.'+process.pid+'.'+randomUUID()+'.tmp';
  try{fs.writeFileSync(tmp,JSON.stringify(data,null,2)+'\n');fs.renameSync(tmp,file);}
  finally{try{fs.unlinkSync(tmp);}catch{}}
}

export function freshness(window,observedAt,now=Date.now()) {
  if(!window || !Number.isFinite(observedAt))return 'unavailable';
  if(Number.isFinite(window.resetsAt) && window.resetsAt>0 && window.resetsAt*1000<=now)return 'expired';
  return now-observedAt>180000?'stale':'fresh';
}
