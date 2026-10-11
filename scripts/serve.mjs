import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import './build.mjs';
const root = fileURLToPath(new URL('../dist/',import.meta.url));
const port = Number(process.env.PORT || 4173);
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.xml':'application/xml','.txt':'text/plain; charset=utf-8'};
http.createServer(async(req,res)=>{
 try {
  const path = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  let file = resolve(root,'.'+path);
  if(file !== resolve(root) && !file.startsWith(resolve(root)+sep)){res.writeHead(403);return res.end();}
  if((await stat(file)).isDirectory())file=resolve(file,'index.html');
  const data=await readFile(file);
  res.writeHead(200,{'Content-Type':mime[extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(data);
 }catch{res.writeHead(404,{'Content-Type':'text/plain'});res.end('Not found');}
}).listen(port,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${port}`));
