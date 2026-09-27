import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const out=path.join(root,'www');
const entries=['index.html','styles.css','manifest.webmanifest','sw.js','js','assets'];
fs.rmSync(out,{recursive:true,force:true});
fs.mkdirSync(out,{recursive:true});
for(const entry of entries){
  const src=path.join(root,entry);
  if(!fs.existsSync(src)) throw new Error(`Missing web asset: ${entry}`);
  fs.cpSync(src,path.join(out,entry),{recursive:true});
}
console.log(`Prepared Capacitor web bundle in ${out}`);
