const CACHE_NAME = 'ts1-v1';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './logo.png'
];

// Installation du Service Worker et mise en cache des fichiers
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Stratégie : Réseau d'abord, sinon Cache (pour avoir toujours la traduction fraîche)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});