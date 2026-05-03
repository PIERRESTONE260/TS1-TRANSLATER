const CACHE_NAME = 'ts1-translater-v1';
const API_URL = 'https://api.mymemory.translated.net/get?q=hello%20world!&langpair=en|fr';
const name = 'TS1-Translater';

// Liste des fichiers indispensables pour que l'interface fonctionne
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './icon-192.png',
  './icon-512.png'
];

// 1. Installation : On met en cache le squelette de l'application
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('TS1 : Fichiers mis en cache avec succès.');
      return cache.addAll(ASSETS);
    })
  );
  // Force le service worker actuel à devenir actif immédiatement
  self.skipWaiting();
});

// 2. Activation : On supprime les anciens caches si la version change (Scalabilité)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('TS1 : Nettoyage de l\'ancien cache.');
            return caches.delete(cache);
          }
        })
      );
    })
  );
  // Permet au SW de prendre le contrôle des pages sans attendre leur rechargement
  self.clients.claim();
});

// 3. Récupération (Fetch) : Stratégie Réseau d'abord, sinon Cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      // Si le réseau échoue (mode hors-ligne), on cherche dans le cache
      return caches.match(event.request);
    })
  );
});