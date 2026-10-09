const CACHE_ADI = "karne-cache-v6";
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

/* ---- push bildirimleri göster ---- */
self.addEventListener("push", (e) => {
  let veri = { title: "Karne", body: "Yeni bir bildirim var." };
  try{ if(e.data) veri = e.data.json(); }catch(err){}
  e.waitUntil(
    self.registration.showNotification(veri.title || "Karne", {
      body: veri.body || "",
      icon: "./icon-192.png",
      badge: "./icon-192.png"
    })
  );
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({type:"window"}).then((clientList) => {
      for (const c of clientList) { if ("focus" in c) return c.focus(); }
      if (self.clients.openWindow) return self.clients.openWindow("./");
    })
  );
});
