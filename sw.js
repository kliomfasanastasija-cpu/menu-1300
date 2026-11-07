const CACHE='menu-1300-v1';
const FILES=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==CACHE).map(n=>caches.delete(n)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;
  const key=e.request.mode==='navigate'?'./':e.request;
  e.respondWith(caches.open(CACHE).then(async c=>{
    const hit=await c.match(key,{ignoreSearch:true});
    const net=fetch(e.request).then(r=>{if(r.ok)c.put(key,r.clone());return r});
    if(hit){net.catch(()=>{});return hit}
    return net;
  }));
});
