import fs from 'node:fs';

// Version comes from package.json (the Codex plugin manifest is not shipped).
const manifest = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8').replace(/^\uFEFF/, ''));
export const pluginVersion = manifest.version;
