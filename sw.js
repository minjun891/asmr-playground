// 오프라인에서도 열리게 파일을 저장해 둔다. 인터넷이 되면 항상 최신 파일을 먼저 받아 오므로
// 게임을 고쳐서 올리면 다음에 열 때 바로 반영된다. (네트워크 우선, 실패하면 저장본)
const CACHE = 'asmr-v1';
const ASSETS = ['./', 'index.html', 'keysamples.js', 'leafsample.js', 'manifest.webmanifest',
  'icon-192.png', 'icon-512.png', 'apple-touch-icon.png', 'favicon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return res; })
      .catch(() => caches.match(e.request).then(r => r || caches.match('index.html')))
  );
});
