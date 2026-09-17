const CACHE_ADI = "karne-cache-v2";
const DOSYALAR = ["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_ADI).then((cache) => cache.addAll(DOSYALAR).catch(()=>{}))
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((isimler) =>
      Promise.all(isimler.filter((i) => i !== CACHE_ADI).map((i) => caches.delete(i)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((yanit) => yanit || fetch(e.request))
  );
});
