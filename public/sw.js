/* RETRO CALC — minimal service worker for installability + offline shell.
   Does not touch app logic; only caches same-origin GET responses. */
const CACHE = "retro-calc-v1";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      const stale = [];
      for (const k of keys) {
        if (k !== CACHE) stale.push(caches.delete(k));
      }
      await Promise.all(stale);
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      const cached = await cache.match(request);

      const network = fetch(request)
        .then((response) => {
          if (response && response.status === 200 && response.type === "basic") {
            cache.put(request, response.clone());
          }
          return response;
        })
        .catch(() => undefined);

      if (request.mode === "navigate") {
        // network-first for pages, fall back to cache, then to "/"
        return (
          (await network) ||
          cached ||
          (await cache.match("/")) ||
          Response.error()
        );
      }

      // stale-while-revalidate for assets
      return cached || (await network) || Response.error();
    })(),
  );
});
