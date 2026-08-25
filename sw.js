const CACHE_NAME = "dp700-exam-simulator-2026-08-v10";
const APP_SHELL = [
  "./",
  "./index.html",
  "./assets/css/styles.css?v=9",
  "./assets/js/app.js?v=10",
  "./assets/icon.svg",
  "./data/questions.js?v=9",
  "./data/dump.js?v=9",
  "./data/dump-interactions.js?v=9",
  "./data/visual-lessons.js?v=9",
  "./data/arabic-lessons.js?v=9",
  "./data/course.js?v=9",
  "./data/course-content.js?v=9",
  "./data/professional-path.js?v=9",
  "./important/DP700_Practice_Exam.html?v=9",
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
