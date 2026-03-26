const CACHE_NAME = "daily-challenge-v2";

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
      return cache.addAll(urlsToCache);
    }),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
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

  event.respondWith(
    fetch(req)
      .then((res) => res)
      .catch(() => {
        return caches.match(req).then((res) => {
          return res || caches.match("/dashboard.html");
        });
      }),
  );
});
