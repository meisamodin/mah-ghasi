const C='mah-ghasi-v91',F=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
const sig=r=>r?(r.headers.get('etag')||r.headers.get('last-modified')||r.headers.get('content-length')||''):'';
// stale-while-revalidate: open instantly from cache, refresh in background, tell the page when a newer version arrived
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;
e.respondWith((async()=>{const c=await caches.open(C),old=await c.match(e.request,{ignoreSearch:false});
 const net=fetch(e.request,{cache:'no-cache'}).then(async r=>{if(r&&r.ok){const s0=sig(old),s1=sig(r);await c.put(e.request,r.clone());if(old&&s0!==s1&&(e.request.mode==='navigate'||/\.(js|html)(\?|$)/.test(e.request.url))){const cl=await self.clients.matchAll();cl.forEach(x=>x.postMessage({t:'upd'}))}}return r}).catch(()=>null);
 if(old){e.waitUntil(net);return old}
 const r=await net;return r||(e.request.mode==='navigate'?await c.match('index.html'):Response.error())})())});
