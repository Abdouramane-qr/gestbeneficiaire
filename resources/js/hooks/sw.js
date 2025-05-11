// sw.js
const CACHE_NAME = 'suivi-pme-v1';
const STATIC_ASSETS = [
  '/',
  '/css/app.css',
  '/js/app.js',
  '/favicon.ico',
  '/offline.html',
  // Routes principales
  '/collectes',
  '/collectes/create',
  // Autres ressources statiques essentielles
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      })
  );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Stratégie pour les requêtes d'API : Réseau d'abord, puis cache
const apiStrategy = async (request) => {
  try {
    // Essayer le réseau d'abord
    const response = await fetch(request);

    // Si la requête réussit, mettre en cache une copie
    if (response.ok) {
      const responseClone = response.clone();
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, responseClone);
    }

    return response;
  } catch (error) {
    // Si le réseau échoue, essayer de récupérer depuis le cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Si pas de cache non plus, renvoyer une erreur
    throw error;
  }
};

// Stratégie pour les ressources statiques : Cache d'abord, puis réseau
const cacheFirstStrategy = async (request) => {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    // Si pas dans le cache, essayer le réseau
    const response = await fetch(request);

    // Mettre en cache la réponse
    if (response.ok) {
      const responseClone = response.clone();
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, responseClone);
    }

    return response;
  } catch (error) {
    // Si on demande une page HTML et qu'on est offline
    if (request.headers.get('Accept').includes('text/html')) {
      return caches.match('/offline.html');
    }

    // Sinon, propager l'erreur
    throw error;
  }
};

// Gestion des requêtes réseau
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Ne pas intercepter les requêtes de vérification du service worker
  if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') {
    return;
  }

  // Utiliser différentes stratégies selon le type de requête
  if (event.request.method === 'GET') {
    // Requêtes API
    if (url.pathname.includes('/api/')) {
      event.respondWith(apiStrategy(event.request));
    }
    // Requêtes de navigation et ressources statiques
    else {
      event.respondWith(cacheFirstStrategy(event.request));
    }
  }
});

// Écouter les messages de synchronisation en arrière-plan
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-collectes') {
    event.waitUntil(syncCollectes());
  }
});

// Fonction pour synchroniser les collectes en arrière-plan
async function syncCollectes() {
  try {
    // Dans un vrai scénario, vous récupéreriez les données à synchroniser depuis IndexedDB
    // et les enverriez au serveur

    // Exemple simplifié:
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_COMPLETE',
        message: 'Synchronisation en arrière-plan terminée avec succès'
      });
    });
  } catch (error) {
    console.error('Erreur de synchronisation en arrière-plan:', error);
  }
}
