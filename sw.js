const CACHE_NAME = "mindmap-v18-4-2-static-1";
const CORE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./workers/storage-worker.js",
  "./vendor/pdf.mjs",
  "./vendor/pdf.worker.mjs",
  "./vendor/zip.min.mjs"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
  self.clients.claim();
});

function isNavigation(request) {
  return request.mode === "navigate" || request.destination === "document";
}

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;

  if (isNavigation(request)) {
    event.respondWith(
      fetch(request).then(response => {
        if (response.ok) {
          caches.open(CACHE_NAME).then(cache =>
            cache.put("./index.html", response.clone())
          );
        }
        return response;
      }).catch(() => caches.match("./index.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => cached || fetch(request).then(response => {
      if (response.ok) {
        caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()));
      }
      return response;
    }))
  );
});
