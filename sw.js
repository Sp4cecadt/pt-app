// Offline support: app shell + demo media cached on install (versioned), stale-while-revalidate after.
// Bump V on every deploy so phones pick up new code.
const V = 'pt-app-v6';
const SHELL = ['./', 'index.html', 'app.css', 'app.js', 'manifest.json', 'js/data.js', 'js/db.js', 'js/backend.js',
  'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/maskable-512.png', 'icons/apple-touch-icon.png', 'icons/favicon-32.png',
  ...['back-squat', 'bench-press', 'overhead-press', 'barbell-row', 'romanian-deadlift', 'lat-pulldown', 'squats', 'deadlift', 'push-ups', 'plank'].flatMap(n => [`img/${n}.jpg`, `vid/${n}.mp4`]),
  'img/overhead-press-hero.jpg', ...[1, 2, 3, 4].map(n => `img/stills/still-${n}.jpg`)];
self.addEventListener('install', e => e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('pt-app-') && k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())));

// Safari asks for videos with Range headers; answer those from the cached copy with a 206.
async function rangeFrom(resp, range) {
  const buf = await resp.arrayBuffer();
  const m = /bytes=(\d*)-(\d*)/.exec(range) || [];
  const size = buf.byteLength, start = m[1] ? +m[1] : 0, end = m[2] ? Math.min(+m[2], size - 1) : size - 1;
  return new Response(buf.slice(start, end + 1), { status: 206, headers: { 'Content-Type': resp.headers.get('Content-Type') || 'video/mp4', 'Content-Range': `bytes ${start}-${end}/${size}`, 'Content-Length': String(end - start + 1), 'Accept-Ranges': 'bytes' } });
}
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  const range = e.request.headers.get('range');
  e.respondWith(caches.open(V).then(async c => {
    const key = u.pathname.endsWith('/') ? new Request(u.origin + u.pathname) : e.request;
    const hit = await c.match(key, { ignoreSearch: true });
    if (range) { if (hit) return rangeFrom(hit, range); return fetch(e.request); }
    const net = fetch(e.request).then(r => { if (r.ok && r.status === 200) c.put(e.request, r.clone()); return r; }).catch(() => null);
    return hit || (await net) || c.match('index.html');
  }));
});
