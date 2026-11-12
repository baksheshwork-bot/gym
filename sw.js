// Offline cache for the gym app. The version changes whenever any file changes.
const V = "gym-56cf8c327d";
const FILES = ["./", "index.html", "fonts.css", "manifest.webmanifest", "icon-180.png", "icon-192.png", "icon-512.png", "fonts/f0.woff2", "fonts/f1.woff2", "fonts/f2.woff2", "fonts/f3.woff2", "fonts/f4.woff2", "fonts/f5.woff2", "fonts/f6.woff2", "fonts/f7.woff2", "fonts/f8.woff2", "fonts/f9.woff2", "fonts/f10.woff2", "fonts/f11.woff2", "fonts/f12.woff2", "fonts/f13.woff2", "fonts/f14.woff2"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin) return;  // MuscleWiki links etc. go straight to the network
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(hit => {
      const net = fetch(req).then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(V).then(c => c.put(req, copy)); }
        return res;
      }).catch(() => null);
      if (hit) return hit;
      return net.then(res => res || (req.mode === "navigate" ? caches.match("index.html") : Response.error()));
    })
  );
});
