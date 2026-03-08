const CACHE_NAME = "daily-challenge-v1";

const urlsToCache = [
  "/",
  "/index.html",
  "/dashboard.html",
  "/app.css",
  "/app.mjs",
  "/auth.mjs",
  "/dashboard.mjs",
  "/locales/en.json",
  "/locales/no.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caching files");
      return cache.addAll(urlsToCache);
    }),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }),
  );
});
