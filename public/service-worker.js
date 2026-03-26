const CACHE_NAME = "daily-challenge-v4";

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

  "/localization/en.json",
  "/localization/no.json",

  "/manifest.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    }),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        }),
      ),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;

  if (req.url.includes("/api/challenges")) {
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

  if (req.method !== "GET") return;

  if (req.url.includes("/api/")) {
    event.respondWith(fetch(req).catch(() => caches.match(req)));
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      return (
        cached ||
        fetch(req).catch(() => {
          return caches.match("/index.html");
        })
      );
    }),
  );
});
