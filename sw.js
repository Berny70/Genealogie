self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("gene-pwa").then(c =>
      c.addAll([
        "./",
        "./index.html",
        "./style.css",
        "./app.js",
        "./gene.json"
      ])
    )
  );
});

