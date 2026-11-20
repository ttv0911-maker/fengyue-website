// Run on a COPY of the approved files, after deciding the final public host.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const value=process.argv[process.argv.indexOf('--site-url')+1];
if(!process.argv.includes('--site-url')||!value)throw new Error('Supply the final public base URL with --site-url.');
const url=new URL(value);if(!['http:','https:'].includes(url.protocol))throw new Error('Use an HTTP(S) public URL.');
const origin=url.href.replace(/\/$/,'');
const preview='https://fengyue-design-review-nov17.artifexvietnam.chatgpt.site';
// Catalog samples, product details, legal drafts and internal research stay noindex pending approval.
const approved=['index.html','about.html','why-fengyue.html','contact.html','faq.html'];
for(const name of (await fs.readdir(root)).filter(x=>x.endsWith('.html'))){
 const filename=path.join(root,name);let html=await fs.readFile(filename,'utf8');html=html.replaceAll(preview,origin);
 html=html.replace(/<link rel="canonical"[^>]*>/g,'');
 if(approved.includes(name))html=html.replace(/<meta name="robots" content="noindex, nofollow">/g,'<meta name="robots" content="index, follow">');
 html=html.replace('</head>',`<link rel="canonical" href="${origin}/${name==='index.html'?'':name}"></head>`);
 await fs.writeFile(filename,html);
}
const xml='<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+approved.map(name=>`<url><loc>${origin}/${name==='index.html'?'':name}</loc></url>`).join('')+'</urlset>';
await fs.writeFile(path.join(root,'sitemap.xml'),xml);
await fs.writeFile(path.join(root,'robots.txt'),`User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`);
console.log('Prepared public metadata for five approved content pages. Catalog, sample products, legal drafts and internal research remain noindex.');
