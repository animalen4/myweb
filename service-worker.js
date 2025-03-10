// service-worker.js

// Cuando el Service Worker se instala
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('v1').then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/styles.css',
                '/script.js',
                '/manifest.json',
                '/icon-192x192.png',
                '/icon-512x512.png',
            ]);
        })
    );
});

// Cuando se activa el Service Worker
self.addEventListener('activate', (event) => {
    // Eliminar cachés antiguos si es necesario
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== 'v1') {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Cuando se hace una solicitud, devuelve la respuesta desde la caché si está disponible
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
