// Incrementar al publicar cambios en los archivos precacheados.
const CACHE_VERSION = "v2";
const PRECACHE = `dc-precache-${CACHE_VERSION}`;
const RUNTIME = `dc-runtime-${CACHE_VERSION}`;
const OFFLINE_URL = "offline.html";

const PRECACHE_URLS = [
  "./",
  "index.html",
  OFFLINE_URL,
  "css/styles.css",
  "js/scripts.js",
  "manifest.webmanifest",
  "img/icono.png",
  "img/logo_DC_conletra.png",
  "img/logo_DC_white.png",
  "img/logo-seguridad.png",
  "img/hero-respuesta-emergencias.png",
  "img/hero-prevencion-comunidad.png",
  "img/hero-brigada-forestal.png",
  "img/pwa/icon-192.png",
  "img/pwa/icon-512.png"
];

// Datos que cambian (por ejemplo la alerta vigente): nunca se sirven desde caché.
const NETWORK_ONLY = [/\/api\//];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(PRECACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS.map((url) => new Request(url, { cache: "reload" }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key !== PRECACHE && key !== RUNTIME)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

const networkFirstPage = async (request) => {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(RUNTIME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return (await caches.match(request, { ignoreSearch: true }))
      ?? (await caches.match(OFFLINE_URL));
  }
};

const staleWhileRevalidate = async (request) => {
  const cache = await caches.open(RUNTIME);
  const cached = await caches.match(request);
  const network = fetch(request)
    .then((response) => {
      if (response.ok || response.type === "opaque") cache.put(request, response.clone());
      return response;
    })
    .catch(() => cached);

  return cached ?? network;
};

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (!url.protocol.startsWith("http")) return;
  if (NETWORK_ONLY.some((pattern) => pattern.test(url.pathname))) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirstPage(request));
    return;
  }

  event.respondWith(staleWhileRevalidate(request));
});
