import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join,extname} from 'node:path';

const root=fileURLToPath(new URL('.',import.meta.url));
const files=new Map([['/','index.html'],['/style.css','style.css'],['/src/app.js','src/app.js'],['/src/engine.js','src/engine.js'],['/src/characters.js','src/characters.js']]);
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.webp':'image/webp'};
const port=Number(process.env.PORT||4195);

async function avatar(raw,res){
 try{
  const target=new URL(raw||'');
  if(target.protocol!=='https:'||/^(localhost|[\d.]+|\[.*\])$/i.test(target.hostname))throw 0;
  const upstream=await fetch(target,{signal:AbortSignal.timeout(5000),redirect:'follow'});
  const type=upstream.headers.get('content-type')||'';
  if(!upstream.ok||!type.startsWith('image/'))throw 0;
  const data=Buffer.from(await upstream.arrayBuffer());
  if(data.length>3e6)throw 0;
  res.writeHead(200,{'Content-Type':type,'Cache-Control':'public, max-age=3600'});res.end(data);
 }catch{res.writeHead(404);res.end('Not found');}
}

createServer(async(req,res)=>{
 const url=new URL(req.url,'http://local'),path=url.pathname;
 if(path==='/avatar')return avatar(url.searchParams.get('u'),res);
 const file=files.get(path)||(/^\/images\/[a-z0-9-]+\.webp$/.test(path)?path.slice(1):null);
 if(!file){res.writeHead(404);res.end('Not found');return;}
 try{const data=await readFile(join(root,file));res.writeHead(200,{'Content-Type':mime[extname(file)],'Cache-Control':file.endsWith('.webp')?'public, max-age=86400':'no-store'});res.end(data);}
 catch{res.writeHead(404);res.end('Not found');}
}).listen(port,()=>console.log(`Sport Clash local: http://127.0.0.1:${port}/`));
