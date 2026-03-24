const CACHE_NAME = "daily-challenge-v1";

const urlsToCache = [
  "/",
  "/index.html",
  "/dashboard.html",

  "/css/app.css",
  "/css/dashboard.css",

  "/js/auth.js",
  "/js/dashboard.js",
  "/js/api/challengeapi.js",
  "/js/ui/calendar.js",
  "/js/utils/i18n.js",
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
