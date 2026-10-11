import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile,readdir} from 'node:fs/promises';
import config from '../src/site.config.mjs';
const root=new URL('../',import.meta.url);
const read=path=>readFile(new URL(path,root),'utf8');
const pages=['index.html','en/index.html','contacto/index.html','en/contact/index.html','404.html'];
for(const file of pages){
 const html=await read('dist/'+file);
 const meta=html.match(/<meta http-equiv="Content-Security-Policy" content="([^"]+)">/);
 assert(meta,`${file}: missing CSP`);
 const policy=meta[1].replaceAll('&#39;',"'");
 for(const directive of ["default-src 'none'","script-src 'self'","script-src-attr 'none'","style-src 'self'","style-src-attr 'none'","base-uri 'none'","object-src 'none'","form-action 'none'"]){assert(policy.includes(directive),`${file}: ${directive}`);}
 assert(!policy.includes('unsafe-inline')&&!policy.includes('unsafe-eval'));
 assert(policy.includes('connect-src '+(config.contactEndpoint?new URL(config.contactEndpoint).origin:"'none'")));
 assert(html.includes('<meta name="referrer" content="no-referrer">'));
 assert(!/\sstyle\s*=|\son[a-z]+\s*=/i.test(html),`${file}: inline style/event handler`);
 for(const script of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)){
  assert(/src="(?:\.\.\/|\.\/)*assets\/app.js"/.test(script[1]));assert.equal(script[2],'');
 }
 for(const name of ['style.css',...(file==='404.html'?[]:['app.js'])]){
  const hash='sha384-'+createHash('sha384').update(await readFile(new URL('dist/assets/'+name,root))).digest('base64');
  assert(html.includes('integrity="'+hash+'"'),`${file}: invalid integrity for ${name}`);
 }
 if(file.includes('contact')&&!config.contactEndpoint){assert(html.includes('data-endpoint=""'));assert(html.includes('disabled aria-describedby="contact-pending"'));}
 console.log('PASS browser policy, integrity, no inline code:',file);
}
async function files(dir,prefix=''){
 const result=[];for(const item of await readdir(dir,{withFileTypes:true})){
  assert(!item.isSymbolicLink(),'Published artifact must not contain symlinks');
  const path=prefix+item.name;
  if(item.isDirectory())result.push(...await files(new URL(item.name+'/',dir),path+'/'));else result.push(path);
 }return result;
}
const allowed=new Set([...pages,'assets/style.css','assets/app.js','assets/favicon.svg','robots.txt','sitemap.xml','.nojekyll','_headers']);
for(const path of await files(new URL('dist/',root)))assert(allowed.has(path),'Unexpected public artifact: '+path);
const workflow=await read('.github/workflows/pages.yml');
const uses=[...workflow.matchAll(/uses:\s*([^\s]+)/g)];assert.equal(uses.length,5);
for(const [,action] of uses)assert(/^actions\/[a-z-]+@[0-9a-f]{40}$/.test(action),'Action must be pinned: '+action);
assert(workflow.includes('persist-credentials: false'));
assert(workflow.includes("if: github.ref == 'refs/heads/main'"));
const pkg=JSON.parse(await read('package.json'));assert.equal(Object.keys(pkg.dependencies||{}).length,0);
console.log('PASS publish allowlist and deployment boundaries');
