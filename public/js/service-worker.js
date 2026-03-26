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
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      for (const url of urlsToCache) {
        try {
          await cache.add(url);
        } catch (err) {
          console.error("Failed to cache:", url);
        }
      }
    }),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  const req = event.request;

  // API caching
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

  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).catch(() => {
        return caches.match("/dashboard.html") || caches.match("/index.html");
      }),
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((res) => {
      return res || fetch(req);
    }),
  );
});
