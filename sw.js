const CACHE_NAME = 'cool-cache-v2';

// Agrega 'sin conexión.html' a la lista de archivos precargados
const PRECACHE_ASSETS = [
    '/sin conexión.html',
    '/assets/',
    '/src/'
];

// Instalar y precargar recursos en la caché
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(PRECACHE_ASSETS);
        })
    );
});

// Activar y limpiar cachés antiguas
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Interceptar las solicitudes y servir desde la caché o la red
self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request).then(response => {
                return response || caches.match('/sin conexión.html');
            });
        })
    );
});
