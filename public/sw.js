const CACHE_NAME = "choma-zone-v2";

const urlsToCache = [
  "/",
  "/login",
  "/dashboard",

  "/dashboard/pos",
  "/dashboard/sales",
  "/dashboard/stock",

  "/dashboard/expenses",
  "/dashboard/payroll",

  "/dashboard/profit",
  "/dashboard/analytics",

  "/dashboard/users",
];

self.addEventListener(
  "install",
  (event) => {

    event.waitUntil(
      caches.open(
        CACHE_NAME
      ).then((cache) => {
        return cache.addAll(
          urlsToCache
        );
      })
    );

  }
);

self.addEventListener(
  "fetch",
  (event) => {

    event.respondWith(

      caches.match(
        event.request
      ).then((response) => {

        return (
  response ||
  fetch(event.request).catch(() => {

    return caches.match(
      "/dashboard"
    );

  })
);

      })

    );

  }
);