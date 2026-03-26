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
  const req = event.request;

  if (req.url.includes("/api/challenges") && req.method === "GET") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(req, clone);
          });
          return res;
        })
        .catch(() => caches.match(req)),
    );
    return;
  }

  event.respondWith(caches.match(req).then((res) => res || fetch(req)));
});
