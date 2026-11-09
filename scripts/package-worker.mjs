import {readFileSync,readdirSync,mkdirSync,writeFileSync} from 'node:fs';
import {join,relative,extname} from 'node:path';
import {createHash} from 'node:crypto';
const root=process.cwd(),dist=join(root,'dist');
function walk(dir){return readdirSync(dir,{withFileTypes:true}).flatMap(d=>d.isDirectory()?walk(join(dir,d.name)):[join(dir,d.name)]);}
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml'};
const files=walk(dist).sort().map((path,i)=>{const bytes=readFileSync(path),url='/'+relative(dist,path).replaceAll('\\','/');return {varName:'asset'+i,name:'static/asset'+i+'.bin',path:url,mime:mime[extname(path)]||'application/octet-stream',base64:bytes.toString('base64'),hash:createHash('sha256').update(bytes).digest('hex')};});
const source=files.map(f=>`import ${f.varName} from './${f.name}';`).join('\n')+'\nconst files = new Map([\n'+files.map(f=>` [${JSON.stringify(f.path)}, {bytes:${f.varName}, type:${JSON.stringify(f.mime)}, etag:${JSON.stringify('"'+f.hash+'"')}}]`).join(',\n')+`\n]);
export default {
 async fetch(request) {
  if(request.method!=='GET' && request.method!=='HEAD')return new Response('Method not allowed',{status:405,headers:{Allow:'GET, HEAD'}});
  const url = new URL(request.url);
  const path = url.pathname === '/' ? '/index.html' : url.pathname;
  const file = files.get(path);
  if(!file)return new Response('Not found',{status:404,headers:{'Content-Type':'text/plain; charset=utf-8','X-Content-Type-Options':'nosniff'}});
  const headers = {'Content-Type':file.type,'Cache-Control':file.type.startsWith('image/')?'public, max-age=3600':'no-cache','ETag':file.etag,'X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin'};
  if(request.headers.get('If-None-Match')===file.etag)return new Response(null,{status:304,headers});
  return new Response(request.method==='HEAD'?null:file.bytes,{status:200,headers});
 }
};\n`;
const config=JSON.parse(readFileSync('cloudflare-deploy.json','utf8'));
const metadata={main_module:'worker.js',compatibility_date:config.compatibility_date,observability:config.observability};
const bundle={metadata,source,files};
mkdirSync('.cloudflare-generated',{recursive:true});
writeFileSync('.cloudflare-generated/bundle.json',JSON.stringify(bundle));
writeFileSync('.cloudflare-generated/worker.js',source);
console.log(JSON.stringify({files:files.length,bytes:files.reduce((s,f)=>s+Buffer.from(f.base64,'base64').length,0),output:'.cloudflare-generated/bundle.json'}));
