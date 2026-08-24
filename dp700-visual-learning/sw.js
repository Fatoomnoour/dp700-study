const CACHE_NAME = "dp700-visual-learning-2026-07-v5";
const APP_SHELL = [
  "./",
  "./index.html",
  "./assets/css/styles.css?v=5",
  "./assets/js/app.js?v=5",
  "./assets/icon.svg",
  "./data/questions.js?v=5",
  "./data/dump.js?v=5",
  "./data/dump-interactions.js?v=5",
  "./data/visual-lessons.js?v=5",
  "./important/DP700_Practice_Exam.html?v=5",
  "./manifest.webmanifest"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      const network = fetch(event.request).then(response => {
        if (response.ok) caches.open(CACHE_NAME).then(cache => cache.put(event.request, response.clone()));
        return response;
      });
      return cached || network.catch(() => caches.match("./index.html"));
    })
  );
});
