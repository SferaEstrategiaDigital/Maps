// Definindo os arquivos para armazenar em cache
const CACHE_NAME = "mnaps-cache-v1";
const urlsToCache = ["/", "logo.png"];

// Instalação do Service Worker
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Cache aberto");
            return cache.addAll(urlsToCache);
        })
    );
});

// Fetch para responder as requisições com os arquivos em cache quando disponíveis
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            if (response) {
                return response;
            }
            return fetch(event.request);
        })
    );
});
