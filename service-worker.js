const CACHE = "genealogie-v1";
const ASSETS = [
  "/Genealogie/",
  "/Genealogie/index.html",
  "/Genealogie/app.js",
  "/Genealogie/genealogie.json",
  "/Genealogie/manifest.json"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});

