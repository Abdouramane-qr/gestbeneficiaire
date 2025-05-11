// // // hooks/useOfflineStorage.js
// // import { useState, useEffect } from 'react';
// // import { toast } from 'sonner';
// // import axios from 'axios';
// // import { route } from 'ziggy-js';

// // const DB_NAME = 'suivi_pme_offline';
// // const DB_VERSION = 4;
// // const COLLECTE_STORE = 'collectes';
// // const SYNC_QUEUE_STORE = 'sync_queue';
// // const FAILED_SYNC_STORE = 'failed_sync';

// // export const useOfflineStorage = () => {
// //   const [db, setDb] = useState(null);
// //   const [pendingUploads, setPendingUploads] = useState(0);
// //   const [isInitialized, setIsInitialized] = useState(false);
// //   const [isSyncInProgress, setIsSyncInProgress] = useState(false);

// //   // Initialisation de la base de données IndexedDB
// //   useEffect(() => {
// //     const initDB = () => {
// //       const request = indexedDB.open(DB_NAME, DB_VERSION);

// //       request.onerror = (event) => {
// //         console.error('Erreur d\'ouverture de la base de données IndexedDB:', event.target.error);
// //         toast.error('Impossible d\'initialiser le stockage local');
// //       };

// //       request.onupgradeneeded = (event) => {
// //         const db = event.target.result;

// //         // Store pour les collectes de données
// //         if (!db.objectStoreNames.contains(COLLECTE_STORE)) {
// //           const collecteStore = db.createObjectStore(COLLECTE_STORE, { keyPath: 'id', autoIncrement: true });
// //           collecteStore.createIndex('entreprise_periode', ['entreprise_id', 'periode_id'], { unique: false });
// //           collecteStore.createIndex('timestamp', 'timestamp', { unique: false });
// //           collecteStore.createIndex('synced', 'synced', { unique: false });
// //         }

// //         // Ensure existing stores have required indexes
// //         if (event.oldVersion < DB_VERSION) {
// //           const collecteStore = event.target.transaction.objectStore(COLLECTE_STORE);
// //           if (!collecteStore.indexNames.contains('synced')) {
// //             collecteStore.createIndex('synced', 'synced', { unique: false });
// //           }
// //         }

// //         // Store pour la file d'attente de synchronisation
// //         if (!db.objectStoreNames.contains(SYNC_QUEUE_STORE)) {
// //           const syncStore = db.createObjectStore(SYNC_QUEUE_STORE, { keyPath: 'id', autoIncrement: true });
// //           syncStore.createIndex('collecteId', 'collecteId', { unique: false });
// //           syncStore.createIndex('timestamp', 'timestamp', { unique: false });
// //         }

// //         // Store pour les synchronisations échouées
// //         if (!db.objectStoreNames.contains(FAILED_SYNC_STORE)) {
// //           const failedStore = db.createObjectStore(FAILED_SYNC_STORE, { keyPath: 'id', autoIncrement: true });
// //           failedStore.createIndex('collecteId', 'collecteId', { unique: false });
// //           failedStore.createIndex('timestamp', 'timestamp', { unique: false });
// //           failedStore.createIndex('attempts', 'attempts', { unique: false });
// //         }
// //       };

// //       request.onsuccess = (event) => {
// //         const db = event.target.result;
// //         setDb(db);
// //         setIsInitialized(true);

// //         // Compter les éléments en attente de synchronisation
// //         countPendingUploads(db);
// //       };
// //     };

// //     initDB();

// //     return () => {
// //       if (db) {
// //         db.close();
// //       }
// //     };
// //   }, []);

// //   // Compter les éléments en attente
// //   const countPendingUploads = (database = db) => {
// //     if (!database) return;

// //     const transaction = database.transaction([COLLECTE_STORE], 'readonly');
// //     const store = transaction.objectStore(COLLECTE_STORE);
// //     const index = store.index('synced');
// //     const countRequest = index.count(IDBKeyRange.only(false));

// //     countRequest.onsuccess = () => {
// //       setPendingUploads(countRequest.result);
// //     };
// //   };

// //   /**
// //    * Sauvegarder les données en mode offline
// //    */
// //   const saveOffline = async (entreprise_id, exercice_id, periode_id, donnees, isDraft = false) => {
// //     if (!db) {
// //       toast.error('Base de données locale non initialisée');
// //       return false;
// //     }

// //     return new Promise((resolve, reject) => {
// //       // Créer l'objet de collecte
// //       const timestamp = Date.now();
// //       const collecte = {
// //         entreprise_id,
// //         exercice_id,
// //         periode_id,
// //         donnees,
// //         date_collecte: new Date().toISOString().split('T')[0],
// //         is_draft: isDraft,
// //         timestamp,
// //         synced: false
// //       };

// //       // Transaction pour sauvegarder la collecte
// //       const transaction = db.transaction([COLLECTE_STORE], 'readwrite');

// //       transaction.onerror = (event) => {
// //         console.error('Erreur de transaction:', event.target.error);
// //         toast.error('Erreur lors de la sauvegarde locale');
// //         reject(event.target.error);
// //       };

// //       // Sauvegarder dans le store des collectes
// //       const collecteStore = transaction.objectStore(COLLECTE_STORE);
// //       const request = collecteStore.add(collecte);

// //       request.onsuccess = (event) => {
// //         const collecteId = event.target.result;

// //         // Ajouter à la file d'attente de synchronisation à part
// //         addToSyncQueue(collecteId, isDraft).then(() => {
// //           const message = isDraft
// //             ? 'Brouillon sauvegardé localement en attente de synchronisation'
// //             : 'Données sauvegardées localement en attente de synchronisation';
// //           toast.success(message);
// //           countPendingUploads();
// //           resolve(collecteId);
// //         }).catch(reject);
// //       };

// //       request.onerror = (event) => {
// //         toast.error('Erreur lors de la sauvegarde locale');
// //         reject(event.target.error);
// //       };
// //     });
// //   };

// //   /**
// //    * Ajouter une collecte à la file d'attente de synchronisation
// //    */
// //   const addToSyncQueue = async (collecteId, isDraft) => {
// //     return new Promise((resolve, reject) => {
// //       if (!db) {
// //         reject(new Error('Base de données non initialisée'));
// //         return;
// //       }

// //       const transaction = db.transaction([SYNC_QUEUE_STORE, COLLECTE_STORE], 'readwrite');
// //       const syncStore = transaction.objectStore(SYNC_QUEUE_STORE);
// //       const collecteStore = transaction.objectStore(COLLECTE_STORE);

// //       // D'abord, récupérer la collecte
// //       const getRequest = collecteStore.get(collecteId);

// //       getRequest.onsuccess = (event) => {
// //         const collecte = event.target.result;
// //         if (!collecte) {
// //           reject(new Error(`Collecte ${collecteId} non trouvée`));
// //           return;
// //         }

// //         // Ajouter à la file d'attente
// //         const syncItem = {
// //           collecteId,
// //           route: isDraft ? 'collectes.draft' : 'collectes.store',
// //           timestamp: Date.now(),
// //           attempts: 0
// //         };

// //         const addRequest = syncStore.add(syncItem);

// //         addRequest.onsuccess = () => {
// //           resolve(true);
// //         };

// //         addRequest.onerror = (e) => {
// //           reject(e.target.error);
// //         };
// //       };

// //       getRequest.onerror = (event) => {
// //         reject(event.target.error);
// //       };
// //     });
// //   };

// //   /**
// //    * Récupérer toutes les collectes locales
// //    */
// //   const getAllLocalCollectes = async () => {
// //     if (!db) return [];

// //     return new Promise((resolve, reject) => {
// //       const transaction = db.transaction(COLLECTE_STORE, 'readonly');
// //       const store = transaction.objectStore(COLLECTE_STORE);
// //       const request = store.getAll();

// //       request.onsuccess = () => {
// //         resolve(request.result || []);
// //       };

// //       request.onerror = (event) => {
// //         reject(event.target.error);
// //       };
// //     });
// //   };

// //   /**
// //    * Récupérer les items en échec de synchronisation
// //    */
// //   const getFailedSyncItems = async () => {
// //     if (!db) return [];

// //     return new Promise((resolve, reject) => {
// //       const transaction = db.transaction(FAILED_SYNC_STORE, 'readonly');
// //       const store = transaction.objectStore(FAILED_SYNC_STORE);
// //       const request = store.getAll();

// //       request.onsuccess = () => {
// //         resolve(request.result || []);
// //       };

// //       request.onerror = (event) => {
// //         reject(event.target.error);
// //       };
// //     });
// //   };

// //   /**
// //    * Réessayer les items en échec
// //    */
// //   const retryFailedSyncItems = async () => {
// //     if (!db) return 0;

// //     return new Promise((resolve, reject) => {
// //       const transaction = db.transaction([FAILED_SYNC_STORE, SYNC_QUEUE_STORE], 'readwrite');
// //       const failedStore = transaction.objectStore(FAILED_SYNC_STORE);
// //       const syncStore = transaction.objectStore(SYNC_QUEUE_STORE);

// //       const getRequest = failedStore.getAll();

// //       getRequest.onsuccess = () => {
// //         const failedItems = getRequest.result || [];
// //         let movedCount = 0;

// //         if (failedItems.length === 0) {
// //           resolve(0);
// //           return;
// //         }

// //         // Pour chaque élément en échec, le déplacer vers la file d'attente
// //         const moveNextItem = (index) => {
// //           if (index >= failedItems.length) {
// //             // Tous les éléments ont été traités
// //             countPendingUploads();
// //             resolve(movedCount);
// //             return;
// //           }

// //           const item = failedItems[index];

// //           // Incrémenter le nombre de tentatives
// //           item.attempts = (item.attempts || 0) + 1;
// //           item.timestamp = Date.now();

// //           // Ajouter à la file d'attente de synchronisation
// //           const addRequest = syncStore.add(item);

// //           addRequest.onsuccess = () => {
// //             // Supprimer de la liste des échecs
// //             const deleteRequest = failedStore.delete(item.id);

// //             deleteRequest.onsuccess = () => {
// //               movedCount++;
// //               moveNextItem(index + 1);
// //             };

// //             deleteRequest.onerror = (e) => {
// //               console.error('Erreur lors de la suppression de l\'item en échec:', e.target.error);
// //               moveNextItem(index + 1);
// //             };
// //           };

// //           addRequest.onerror = (e) => {
// //             console.error('Erreur lors de l\'ajout à la file d\'attente:', e.target.error);
// //             moveNextItem(index + 1);
// //           };
// //         };

// //         // Démarrer le traitement du premier élément
// //         moveNextItem(0);
// //       };

// //       getRequest.onerror = (event) => {
// //         reject(event.target.error);
// //       };
// //     });
// //   };

// //   /**
// //    * Synchroniser les données avec le serveur
// //    */
// //   const syncData = async () => {
// //     if (!db || !navigator.onLine) {
// //       if (!navigator.onLine) {
// //         toast.error('Impossible de synchroniser les données: vous êtes hors ligne');
// //       }
// //       return 0;
// //     }

// //     if (isSyncInProgress) {
// //       toast.info('Synchronisation déjà en cours...');
// //       return 0;
// //     }

// //     setIsSyncInProgress(true);

// //     try {
// //       // Récupérer les éléments à synchroniser
// //       const syncItems = await getSyncQueueItems();

// //       if (syncItems.length === 0) {
// //         setIsSyncInProgress(false);
// //         return 0;
// //       }

// //       // Regrouper les collectes par lot pour éviter les requêtes trop volumineuses
// //       const batchSize = 5;
// //       let syncedCount = 0;

// //       for (let i = 0; i < syncItems.length; i += batchSize) {
// //         const batch = syncItems.slice(i, i + batchSize);
// //         const batchResult = await processSyncBatch(batch);
// //         syncedCount += batchResult;
// //       }

// //       // Mettre à jour le compteur
// //       countPendingUploads();

// //       setIsSyncInProgress(false);
// //       return syncedCount;
// //     } catch (error) {
// //       console.error('Erreur de synchronisation:', error);
// //       setIsSyncInProgress(false);
// //       throw error;
// //     }
// //   };

// //   /**
// //    * Récupérer les éléments à synchroniser
// //    */
// //   const getSyncQueueItems = async () => {
// //     if (!db) return [];

// //     return new Promise((resolve, reject) => {
// //       const transaction = db.transaction([SYNC_QUEUE_STORE, COLLECTE_STORE], 'readonly');
// //       const syncStore = transaction.objectStore(SYNC_QUEUE_STORE);
// //       const collecteStore = transaction.objectStore(COLLECTE_STORE);

// //       const request = syncStore.getAll();

// //       request.onsuccess = async () => {
// //         const items = request.result || [];
// //         const syncItems = [];

// //         // Pour chaque élément de la file, récupérer les données complètes de la collecte
// //         for (const item of items) {
// //           const collecteRequest = collecteStore.get(item.collecteId);

// //           // Utiliser une promesse pour gérer l'asynchronicité
// //           const collecte = await new Promise((resolveCollecte, rejectCollecte) => {
// //             collecteRequest.onsuccess = () => resolveCollecte(collecteRequest.result);
// //             collecteRequest.onerror = (e) => rejectCollecte(e.target.error);
// //           });

// //           if (collecte) {
// //             syncItems.push({
// //               ...item,
// //               collecte
// //             });
// //           }
// //         }

// //         resolve(syncItems);
// //       };

// //       request.onerror = (event) => {
// //         reject(event.target.error);
// //       };
// //     });
// //   };

// //   /**
// //    * Traiter un lot d'éléments à synchroniser
// //    */
// //   const processSyncBatch = async (batch) => {
// //     if (batch.length === 0) return 0;

// //     try {
// //       // Préparer les données pour l'envoi
// //       const syncData = batch.map(item => ({
// //         id: item.collecte.id, // ID local pour le suivi
// //         entreprise_id: item.collecte.entreprise_id,
// //         exercice_id: item.collecte.exercice_id,
// //         periode_id: item.collecte.periode_id,
// //         date_collecte: item.collecte.date_collecte,
// //         donnees: item.collecte.donnees,
// //         type_collecte: item.collecte.is_draft ? 'brouillon' : 'standard'
// //       }));

// //       // Envoi des données au serveur
// //       const response = await axios.post(route('collectes.sync-offline-data'), {
// //         synced_data: syncData
// //       });

// //       if (response.data.success) {
// //         // Marquer les collectes comme synchronisées
// //         await updateSyncedStatus(batch, response.data.results);

// //         // Supprimer les éléments synchronisés de la file d'attente
// //         await removeFromSyncQueue(batch.map(item => item.id));

// //         return response.data.results.length;
// //       } else {
// //         // Gérer les échecs de synchronisation
// //         await handleSyncFailures(batch, response.data.errors || {});
// //         return 0;
// //       }
// //     } catch (error) {
// //       console.error('Erreur lors de la synchronisation du lot:', error);

// //       // Marquer tous les éléments du lot comme en échec
// //       await handleSyncFailures(batch, { general: error.message });

// //       throw error;
// //     }
// //   };

// //   /**
// //    * Mettre à jour le statut de synchronisation des collectes
// //    */
// //   const updateSyncedStatus = async (batch, results) => {
// //     if (!db || batch.length === 0) return;

// //     return new Promise((resolve, reject) => {
// //       const transaction = db.transaction(COLLECTE_STORE, 'readwrite');
// //       const store = transaction.objectStore(COLLECTE_STORE);

// //       transaction.onerror = (event) => {
// //         reject(new Error('Transaction failed: ' + event.target.error));
// //       };

// //       let completed = 0;

// //       // Pour chaque élément synchronisé avec succès
// //       for (const result of results) {
// //         // Trouver l'élément correspondant dans le lot
// //         const batchItem = batch.find(item => item.collecte.id === result.local_id);

// //         if (batchItem) {
// //           const updateRequest = store.get(batchItem.collecte.id);

// //           updateRequest.onsuccess = () => {
// //             const collecte = updateRequest.result;
// //             if (collecte) {
// //               collecte.synced = true;
// //               collecte.syncedAt = Date.now();
// //               collecte.remote_id = result.remote_id; // ID sur le serveur

// //               const putRequest = store.put(collecte);

// //               putRequest.onsuccess = () => {
// //                 completed++;
// //                 if (completed === results.length) {
// //                   resolve();
// //                 }
// //               };

// //               putRequest.onerror = (e) => {
// //                 console.error('Erreur lors de la mise à jour du statut:', e.target.error);
// //                 completed++;
// //                 if (completed === results.length) {
// //                   resolve();
// //                 }
// //               };
// //             }
// //           };

// //           updateRequest.onerror = (e) => {
// //             console.error('Erreur lors de la récupération de la collecte:', e.target.error);
// //             completed++;
// //             if (completed === results.length) {
// //               resolve();
// //             }
// //           };
// //         }
// //       }

// //       // Si aucun élément n'a été traité
// //       if (results.length === 0) {
// //         resolve();
// //       }
// //     });
// //   };

// //   /**
// //    * Supprimer des éléments de la file d'attente de synchronisation
// //    */
// //   const removeFromSyncQueue = async (ids) => {
// //     if (!db || ids.length === 0) return;

// //     return new Promise((resolve, reject) => {
// //       const transaction = db.transaction(SYNC_QUEUE_STORE, 'readwrite');
// //       const store = transaction.objectStore(SYNC_QUEUE_STORE);

// //       let completed = 0;

// //       for (const id of ids) {
// //         const request = store.delete(id);

// //         request.onsuccess = () => {
// //           completed++;
// //           if (completed === ids.length) {
// //             resolve();
// //           }
// //         };

// //         request.onerror = (e) => {
// //           console.error('Erreur lors de la suppression de la file d\'attente:', e.target.error);
// //           completed++;
// //           if (completed === ids.length) {
// //             resolve();
// //           }
// //         };
// //       }

// //       // Si aucun élément n'a été traité
// //       if (ids.length === 0) {
// //         resolve();
// //       }
// //     });
// //   };

// //   /**
// //    * Gérer les échecs de synchronisation
// //    */
// //   const handleSyncFailures = async (batch, errors) => {
// //     if (!db || batch.length === 0) return;

// //     return new Promise((resolve, reject) => {
// //       const transaction = db.transaction([SYNC_QUEUE_STORE, FAILED_SYNC_STORE], 'readwrite');
// //       const syncStore = transaction.objectStore(SYNC_QUEUE_STORE);
// //       const failedStore = transaction.objectStore(FAILED_SYNC_STORE);

// //       let completed = 0;

// //       for (const item of batch) {
// //         // Supprimer de la file d'attente
// //         const deleteRequest = syncStore.delete(item.id);

// //         deleteRequest.onsuccess = () => {
// //           // Ajouter aux éléments en échec
// //           const failedItem = {
// //             collecteId: item.collecteId,
// //             route: item.route,
// //             timestamp: Date.now(),
// //             attempts: (item.attempts || 0) + 1,
// //             error: errors[item.collecteId] || errors.general || 'Erreur inconnue'
// //           };

// //           const addRequest = failedStore.add(failedItem);

// //           addRequest.onsuccess = () => {
// //             completed++;
// //             if (completed === batch.length) {
// //               resolve();
// //             }
// //           };

// //           addRequest.onerror = (e) => {
// //             console.error('Erreur lors de l\'ajout aux échecs:', e.target.error);
// //             completed++;
// //             if (completed === batch.length) {
// //               resolve();
// //             }
// //           };
// //         };

// //         deleteRequest.onerror = (e) => {
// //           console.error('Erreur lors de la suppression de la file d\'attente:', e.target.error);
// //           completed++;
// //           if (completed === batch.length) {
// //             resolve();
// //           }
// //         };
// //       }

// //       // Si aucun élément n'a été traité
// //       if (batch.length === 0) {
// //         resolve();
// //       }
// //     });
// //   };

// //   /**
// //    * Vider la file d'attente de synchronisation
// //    */
// //   const clearSyncQueue = async () => {
// //     if (!db) return false;

// //     return new Promise((resolve, reject) => {
// //       const transaction = db.transaction([SYNC_QUEUE_STORE, FAILED_SYNC_STORE], 'readwrite');
// //       const syncStore = transaction.objectStore(SYNC_QUEUE_STORE);
// //       const failedStore = transaction.objectStore(FAILED_SYNC_STORE);

// //       // Vider les deux stores
// //       const syncRequest = syncStore.clear();
// //       const failedRequest = failedStore.clear();

// //       let completed = 0;
// //       const total = 2;

// //       syncRequest.onsuccess = () => {
// //         completed++;
// //         if (completed === total) {
// //           countPendingUploads();
// //           resolve(true);
// //         }
// //       };

// //       failedRequest.onsuccess = () => {
// //         completed++;
// //         if (completed === total) {
// //           countPendingUploads();
// //           resolve(true);
// //         }
// //       };

// //       syncRequest.onerror = (e) => {
// //         console.error('Erreur lors du vidage de la file d\'attente:', e.target.error);
// //         reject(e.target.error);
// //       };

// //       failedRequest.onerror = (e) => {
// //         console.error('Erreur lors du vidage des échecs:', e.target.error);
// //         reject(e.target.error);
// //       };
// //     });
// //   };

// //   /**
// //    * Supprimer une collecte locale
// //    */
// //   const deleteLocalCollecte = async (id) => {
// //     if (!db) return false;

// //     return new Promise((resolve, reject) => {
// //       const transaction = db.transaction([COLLECTE_STORE, SYNC_QUEUE_STORE, FAILED_SYNC_STORE], 'readwrite');
// //       const collecteStore = transaction.objectStore(COLLECTE_STORE);
// //       const syncStore = transaction.objectStore(SYNC_QUEUE_STORE);
// //       const failedStore = transaction.objectStore(FAILED_SYNC_STORE);

// //       // Supprimer la collecte
// //       const deleteRequest = collecteStore.delete(id);

// //       deleteRequest.onsuccess = () => {
// //         // Supprimer les éléments associés dans la file d'attente
// //         const syncIndex = syncStore.index('collecteId');
// //         const syncRequest = syncIndex.getAll(id);

// //         syncRequest.onsuccess = () => {
// //           const syncItems = syncRequest.result || [];

// //           // Supprimer chaque élément de la file d'attente
// //           let syncCompleted = 0;

// //           if (syncItems.length === 0) {
// //             // Passer à la suppression des échecs
// //             removeFailedItems();
// //             return;
// //           }

// //           syncItems.forEach(item => {
// //             const deleteSync = syncStore.delete(item.id);

// //             deleteSync.onsuccess = () => {
// //               syncCompleted++;
// //               if (syncCompleted === syncItems.length) {
// //                 // Passer à la suppression des échecs
// //                 removeFailedItems();
// //               }
// //             };

// //             deleteSync.onerror = (e) => {
// //               console.error('Erreur lors de la suppression de la file d\'attente:', e.target.error);
// //               syncCompleted++;
// //               if (syncCompleted === syncItems.length) {
// //                 removeFailedItems();
// //               }
// //             };
// //           });
// //         };

// //         // Fonction pour supprimer les éléments en échec
// //         const removeFailedItems = () => {
// //           const failedIndex = failedStore.index('collecteId');
// //           const failedRequest = failedIndex.getAll(id);

// //           failedRequest.onsuccess = () => {
// //             const failedItems = failedRequest.result || [];

// //             // Supprimer chaque élément en échec
// //             let failedCompleted = 0;

// //             if (failedItems.length === 0) {
// //               // Terminer la suppression
// //               countPendingUploads();
// //               resolve(true);
// //               return;
// //             }

// //             failedItems.forEach(item => {
// //               const deleteFailed = failedStore.delete(item.id);

// //               deleteFailed.onsuccess = () => {
// //                 failedCompleted++;
// //                 if (failedCompleted === failedItems.length) {
// //                   // Terminer la suppression
// //                   countPendingUploads();
// //                   resolve(true);
// //                 }
// //               };

// //               deleteFailed.onerror = (e) => {
// //                 console.error('Erreur lors de la suppression des échecs:', e.target.error);
// //                 failedCompleted++;
// //                 if (failedCompleted === failedItems.length) {
// //                   countPendingUploads();
// //                   resolve(true);
// //                 }
// //               };
// //             });
// //           };

// //           failedRequest.onerror = (e) => {
// //             console.error('Erreur lors de la récupération des échecs:', e.target.error);
// //             countPendingUploads();
// //             resolve(false);
// //           };
// //         };
// //       };

// //       deleteRequest.onerror = (e) => {
// //         console.error('Erreur lors de la suppression de la collecte:', e.target.error);
// //         reject(e.target.error);
// //       };
// //     });
// //   };

// //   /**
// //    * Récupérer les données sauvegardées localement pour une entreprise/période
// //    */
// //   const getSavedData = async (entreprise_id, exercice_id, periode_id) => {
// //     if (!db) return null;

// //     return new Promise((resolve, reject) => {
// //       const transaction = db.transaction(COLLECTE_STORE, 'readonly');
// //       const store = transaction.objectStore(COLLECTE_STORE);
// //       const index = store.index('entreprise_periode');

// //       // Chercher les collectes correspondant à entreprise_id et periode_id
// //       const request = index.getAll([parseInt(entreprise_id), parseInt(periode_id)]);

// //       request.onsuccess = () => {
// //         const collectes = request.result;

// //         if (collectes.length === 0) {
// //           resolve(null);
// //           return;
// //         }

// //         // Si plusieurs collectes correspondent, prendre la plus récente
// //         const latestCollecte = collectes.reduce((latest, current) => {
// //           return !latest || current.timestamp > latest.timestamp ? current : latest;
// //         }, null);

// //         resolve(latestCollecte);
// //       };

// //       request.onerror = (event) => {
// //         console.error('Erreur lors de la récupération des données:', event.target.error);
// //         reject(event.target.error);
// //       };
// //     });
// //   };

// //   return {
// //     saveOffline,
// //     getSavedData,
// //     syncData,
// //     pendingUploads,
// //     isInitialized,
// //     isSyncInProgress,
// //     getAllLocalCollectes,
// //     getFailedSyncItems,
// //     retryFailedSyncItems,
// //     clearSyncQueue,
// //     deleteLocalCollecte
// //   };
// // };
// // hooks/useOfflineStorage.js
// import { useState, useEffect } from 'react';
// import { toast } from 'sonner';
// import axios from 'axios';
// import { route } from 'ziggy-js';

// const DB_NAME = 'suivi_pme_offline';
// const DB_VERSION = 10;  // Incrémenté pour forcer la mise à jour de la structure
// const COLLECTE_STORE = 'collectes';
// const SYNC_QUEUE_STORE = 'sync_queue';
// const FAILED_SYNC_STORE = 'failed_sync';

// export const useOfflineStorage = () => {
//   const [db, setDb] = useState(null);
//   const [pendingUploads, setPendingUploads] = useState(0);
//   const [isInitialized, setIsInitialized] = useState(false);
//   const [isSyncInProgress, setIsSyncInProgress] = useState(false);

//   // Initialisation de la base de données IndexedDB
//   useEffect(() => {
//     const initDB = () => {
//       const request = indexedDB.open(DB_NAME, DB_VERSION);

//       request.onerror = (event) => {
//         console.error('Erreur d\'ouverture de la base de données IndexedDB:', event.target.error);
//         toast.error('Impossible d\'initialiser le stockage local');
//       };

//       request.onupgradeneeded = (event) => {
//         const db = event.target.result;
//         console.log('Mise à jour de la base de données à la version', DB_VERSION);

//         // Store pour les collectes de données
//         if (!db.objectStoreNames.contains(COLLECTE_STORE)) {
//           console.log('Création du store collectes');
//           const collecteStore = db.createObjectStore(COLLECTE_STORE, { keyPath: 'id', autoIncrement: true });
//           collecteStore.createIndex('entreprise_periode', ['entreprise_id', 'periode_id'], { unique: false });
//           collecteStore.createIndex('timestamp', 'timestamp', { unique: false });
//           collecteStore.createIndex('synced', 'synced', { unique: false });
//         } else {
//           // S'assurer que les indices existent
//           const transaction = event.target.transaction;
//           const collecteStore = transaction.objectStore(COLLECTE_STORE);

//           if (!collecteStore.indexNames.contains('synced')) {
//             console.log('Ajout de l\'index synced');
//             collecteStore.createIndex('synced', 'synced', { unique: false });
//           }

//           if (!collecteStore.indexNames.contains('timestamp')) {
//             console.log('Ajout de l\'index timestamp');
//             collecteStore.createIndex('timestamp', 'timestamp', { unique: false });
//           }

//           if (!collecteStore.indexNames.contains('entreprise_periode')) {
//             console.log('Ajout de l\'index entreprise_periode');
//             collecteStore.createIndex('entreprise_periode', ['entreprise_id', 'periode_id'], { unique: false });
//           }
//         }

//         // Store pour la file d'attente de synchronisation
//         if (!db.objectStoreNames.contains(SYNC_QUEUE_STORE)) {
//           console.log('Création du store sync_queue');
//           const syncStore = db.createObjectStore(SYNC_QUEUE_STORE, { keyPath: 'id', autoIncrement: true });
//           syncStore.createIndex('collecteId', 'collecteId', { unique: false });
//           syncStore.createIndex('timestamp', 'timestamp', { unique: false });
//         }

//         // Store pour les synchronisations échouées
//         if (!db.objectStoreNames.contains(FAILED_SYNC_STORE)) {
//           console.log('Création du store failed_sync');
//           const failedStore = db.createObjectStore(FAILED_SYNC_STORE, { keyPath: 'id', autoIncrement: true });
//           failedStore.createIndex('collecteId', 'collecteId', { unique: false });
//           failedStore.createIndex('timestamp', 'timestamp', { unique: false });
//           failedStore.createIndex('attempts', 'attempts', { unique: false });
//         }
//       };

//       request.onsuccess = (event) => {
//         const db = event.target.result;
//         console.log('Base de données ouverte avec succès');
//         setDb(db);
//         setIsInitialized(true);

//         // Compter les éléments en attente de synchronisation
//         try {
//           countPendingUploads(db);
//         } catch (error) {
//           console.error('Erreur lors du comptage des collectes en attente:', error);
//           setPendingUploads(0);
//         }
//       };
//     };

//     initDB();

//     return () => {
//       if (db) {
//         db.close();
//       }
//     };
//   }, []);

//   // Compter les éléments en attente
// //   const countPendingUploads = (database = db) => {
// //     if (!database) return;

// //     try {
// //       const transaction = database.transaction([COLLECTE_STORE], 'readonly');
// //       const store = transaction.objectStore(COLLECTE_STORE);

// //       if (!store.indexNames.contains('synced')) {
// //         console.warn('L\'index synced n\'existe pas encore, impossible de compter les éléments non synchronisés');
// //         setPendingUploads(0);
// //         return;
// //       }

// //       const index = store.index('synced');

// //       let range;
// //       try {
// //         range = IDBKeyRange.only(false);
// //       } catch (err) {
// //         console.error('Erreur création IDBKeyRange.only(false):', err);
// //         range = null;
// //       }

// //       const countRequest = range ? index.count(range) : store.count();

// //       countRequest.onsuccess = () => {
// //         setPendingUploads(countRequest.result);
// //       };

// //       countRequest.onerror = (error) => {
// //         console.error('Erreur lors du comptage des éléments en attente:', error);
// //         setPendingUploads(0);
// //       };
// //     } catch (error) {
// //       console.error('Erreur lors du comptage des collectes en attente:', error);
// //       setPendingUploads(0);
// //     }
// //   };
// // Compter les éléments en attente
// const countPendingUploads = (database = db) => {
//     if (!database) return;

//     try {
//       const transaction = database.transaction([COLLECTE_STORE], 'readonly');
//       const store = transaction.objectStore(COLLECTE_STORE);

//       // Vérifier si l'index existe
//       if (!store.indexNames.contains('synced')) {
//         console.warn('L\'index synced n\'existe pas encore, impossible de compter les éléments non synchronisés');
//         setPendingUploads(0);
//         return;
//       }


//       const getAllRequest = store.getAll();

//       getAllRequest.onsuccess = () => {
//         const allItems = getAllRequest.result || [];
//         // Compter les éléments où synced est exactement false (pas 0, pas null, pas undefined)
//         const notSyncedCount = allItems.filter(item => item.synced === false).length;
//         setPendingUploads(notSyncedCount);
//       };

//       getAllRequest.onerror = (error) => {
//         console.error('Erreur lors de la récupération des éléments:', error);
//         setPendingUploads(0);
//       };
//     } catch (error) {
//       console.error('Erreur lors du comptage des collectes en attente:', error);
//       setPendingUploads(0);
//     }
//   };
//   /**
//    * Sauvegarder les données en mode offline
//    */
//   const saveOffline = async (entreprise_id, exercice_id, periode_id, donnees, isDraft = false) => {
//     if (!db) {
//       toast.error('Base de données locale non initialisée');
//       return false;
//     }

//     return new Promise((resolve, reject) => {
//       try {
//         // Créer l'objet de collecte
//         const timestamp = Date.now();
//         const collecte = {
//           entreprise_id,
//           exercice_id,
//           periode_id,
//           donnees,
//           date_collecte: new Date().toISOString().split('T')[0],
//           is_draft: isDraft,
//           timestamp,
//           synced: false
//         };

//         // Transaction pour sauvegarder la collecte
//         const transaction = db.transaction([COLLECTE_STORE], 'readwrite');

//         transaction.onerror = (event) => {
//           console.error('Erreur de transaction:', event.target.error);
//           toast.error('Erreur lors de la sauvegarde locale');
//           reject(event.target.error);
//         };

//         // Sauvegarder dans le store des collectes
//         const collecteStore = transaction.objectStore(COLLECTE_STORE);
//         const request = collecteStore.add(collecte);

//         request.onsuccess = (event) => {
//           const collecteId = event.target.result;
//           console.log('Collecte sauvegardée avec ID:', collecteId);

//           // Ajouter à la file d'attente de synchronisation à part
//           addToSyncQueue(collecteId, isDraft).then(() => {
//             const message = isDraft
//               ? 'Brouillon sauvegardé localement en attente de synchronisation'
//               : 'Données sauvegardées localement en attente de synchronisation';
//             toast.success(message);
//             countPendingUploads();
//             resolve(collecteId);
//           }).catch(error => {
//             console.error('Erreur lors de l\'ajout à la file d\'attente:', error);
//             // Même si l'ajout à la file échoue, la collecte est enregistrée
//             resolve(collecteId);
//           });
//         };

//         request.onerror = (event) => {
//           console.error('Erreur lors de la sauvegarde:', event.target.error);
//           toast.error('Erreur lors de la sauvegarde locale');
//           reject(event.target.error);
//         };
//       } catch (error) {
//         console.error('Erreur critique lors de la sauvegarde:', error);
//         toast.error('Erreur critique lors de la sauvegarde locale');
//         reject(error);
//       }
//     });
//   };

//   /**
//    * Ajouter une collecte à la file d'attente de synchronisation
//    */
//   const addToSyncQueue = async (collecteId, isDraft) => {
//     return new Promise((resolve, reject) => {
//       if (!db) {
//         reject(new Error('Base de données non initialisée'));
//         return;
//       }

//       try {
//         const transaction = db.transaction([SYNC_QUEUE_STORE, COLLECTE_STORE], 'readwrite');
//         const syncStore = transaction.objectStore(SYNC_QUEUE_STORE);
//         const collecteStore = transaction.objectStore(COLLECTE_STORE);

//         // D'abord, récupérer la collecte
//         const getRequest = collecteStore.get(collecteId);

//         getRequest.onsuccess = (event) => {
//           const collecte = event.target.result;
//           if (!collecte) {
//             reject(new Error(`Collecte ${collecteId} non trouvée`));
//             return;
//           }

//           // Ajouter à la file d'attente
//           const syncItem = {
//             collecteId,
//             route: isDraft ? 'collectes.draft' : 'collectes.store',
//             timestamp: Date.now(),
//             attempts: 0
//           };

//           const addRequest = syncStore.add(syncItem);

//           addRequest.onsuccess = () => {
//             resolve(true);
//           };

//           addRequest.onerror = (e) => {
//             console.error('Erreur lors de l\'ajout à la file d\'attente:', e.target.error);
//             reject(e.target.error);
//           };
//         };

//         getRequest.onerror = (event) => {
//           console.error('Erreur lors de la récupération de la collecte:', event.target.error);
//           reject(event.target.error);
//         };
//       } catch (error) {
//         console.error('Erreur critique lors de l\'ajout à la file:', error);
//         reject(error);
//       }
//     });
//   };

//   /**
//    * Récupérer toutes les collectes locales
//    */
//   const getAllLocalCollectes = async () => {
//     if (!db) return [];

//     return new Promise((resolve, reject) => {
//       try {
//         const transaction = db.transaction(COLLECTE_STORE, 'readonly');
//         const store = transaction.objectStore(COLLECTE_STORE);
//         const request = store.getAll();

//         request.onsuccess = () => {
//           resolve(request.result || []);
//         };

//         request.onerror = (event) => {
//           console.error('Erreur lors de la récupération des collectes:', event.target.error);
//           reject(event.target.error);
//         };
//       } catch (error) {
//         console.error('Erreur critique lors de la récupération des collectes:', error);
//         reject(error);
//       }
//     });
//   };

//   /**
//    * Récupérer les items en échec de synchronisation
//    */
//   const getFailedSyncItems = async () => {
//     if (!db) return [];

//     return new Promise((resolve, reject) => {
//       try {
//         const transaction = db.transaction(FAILED_SYNC_STORE, 'readonly');
//         const store = transaction.objectStore(FAILED_SYNC_STORE);
//         const request = store.getAll();

//         request.onsuccess = () => {
//           resolve(request.result || []);
//         };

//         request.onerror = (event) => {
//           console.error('Erreur lors de la récupération des items en échec:', event.target.error);
//           reject(event.target.error);
//         };
//       } catch (error) {
//         console.error('Erreur critique lors de la récupération des items en échec:', error);
//         reject(error);
//       }
//     });
//   };

//   /**
//    * Réessayer les items en échec
//    */
//   const retryFailedSyncItems = async () => {
//     if (!db) return 0;

//     return new Promise((resolve, reject) => {
//       try {
//         const transaction = db.transaction([FAILED_SYNC_STORE, SYNC_QUEUE_STORE], 'readwrite');
//         const failedStore = transaction.objectStore(FAILED_SYNC_STORE);
//         const syncStore = transaction.objectStore(SYNC_QUEUE_STORE);

//         const getRequest = failedStore.getAll();

//         getRequest.onsuccess = () => {
//           const failedItems = getRequest.result || [];
//           let movedCount = 0;

//           if (failedItems.length === 0) {
//             resolve(0);
//             return;
//           }

//           // Pour chaque élément en échec, le déplacer vers la file d'attente
//           const moveNextItem = (index) => {
//             if (index >= failedItems.length) {
//               // Tous les éléments ont été traités
//               countPendingUploads();
//               resolve(movedCount);
//               return;
//             }

//             const item = failedItems[index];

//             // Incrémenter le nombre de tentatives
//             item.attempts = (item.attempts || 0) + 1;
//             item.timestamp = Date.now();

//             // Ajouter à la file d'attente de synchronisation
//             const addRequest = syncStore.add(item);

//             addRequest.onsuccess = () => {
//               // Supprimer de la liste des échecs
//               const deleteRequest = failedStore.delete(item.id);

//               deleteRequest.onsuccess = () => {
//                 movedCount++;
//                 moveNextItem(index + 1);
//               };

//               deleteRequest.onerror = (e) => {
//                 console.error('Erreur lors de la suppression de l\'item en échec:', e.target.error);
//                 moveNextItem(index + 1);
//               };
//             };

//             addRequest.onerror = (e) => {
//               console.error('Erreur lors de l\'ajout à la file d\'attente:', e.target.error);
//               moveNextItem(index + 1);
//             };
//           };

//           // Démarrer le traitement du premier élément
//           moveNextItem(0);
//         };

//         getRequest.onerror = (event) => {
//           console.error('Erreur lors de la récupération des items en échec:', event.target.error);
//           reject(event.target.error);
//         };
//       } catch (error) {
//         console.error('Erreur critique lors du réessai des items en échec:', error);
//         reject(error);
//       }
//     });
//   };

//   /**
//    * Synchroniser les données avec le serveur
//    */
//   const syncData = async () => {
//     if (!db || !navigator.onLine) {
//       if (!navigator.onLine) {
//         toast.error('Impossible de synchroniser les données: vous êtes hors ligne');
//       }
//       return 0;
//     }

//     if (isSyncInProgress) {
//       toast.info('Synchronisation déjà en cours...');
//       return 0;
//     }

//     setIsSyncInProgress(true);

//     try {
//       // Récupérer les éléments à synchroniser
//       const syncItems = await getSyncQueueItems();

//       if (syncItems.length === 0) {
//         setIsSyncInProgress(false);
//         return 0;
//       }

//       // Regrouper les collectes par lot pour éviter les requêtes trop volumineuses
//       const batchSize = 5;
//       let syncedCount = 0;

//       for (let i = 0; i < syncItems.length; i += batchSize) {
//         const batch = syncItems.slice(i, i + batchSize);
//         const batchResult = await processSyncBatch(batch);
//         syncedCount += batchResult;
//       }

//       // Mettre à jour le compteur
//       countPendingUploads();

//       setIsSyncInProgress(false);
//       return syncedCount;
//     } catch (error) {
//       console.error('Erreur de synchronisation:', error);
//       setIsSyncInProgress(false);
//       throw error;
//     }
//   };

//   /**
//    * Récupérer les éléments à synchroniser
//    */
// // Remplacer la fonction getSyncQueueItems par celle-ci
// const getSyncQueueItems = async () => {
//     if (!db) return [];

//     return new Promise((resolve, reject) => {
//       try {
//         // Modification majeure : aller directement chercher les collectes non synchronisées
//         // au lieu de passer par la table SYNC_QUEUE_STORE
//         const transaction = db.transaction([COLLECTE_STORE], 'readonly');
//         const collecteStore = transaction.objectStore(COLLECTE_STORE);

//         const request = collecteStore.getAll();

//         request.onsuccess = () => {
//           const allCollectes = request.result || [];

//           // Filtrer exactement comme dans countPendingUploads
//           const pendingCollectes = allCollectes.filter(item => item.synced === false);

//           // Transformer en format attendu par processSyncBatch
//           const syncItems = pendingCollectes.map(collecte => ({
//             collecteId: collecte.id,
//             id: collecte.id,  // Utiliser le même ID pour cohérence
//             route: collecte.is_draft ? 'collectes.draft' : 'collectes.store',
//             collecte: collecte
//           }));

//           resolve(syncItems);
//         };

//         request.onerror = (event) => {
//           console.error('Erreur lors de la récupération des items à synchroniser:', event.target.error);
//           reject(event.target.error);
//         };
//       } catch (error) {
//         console.error('Erreur critique lors de la récupération des items à synchroniser:', error);
//         reject(error);
//       }
//     });
//   };

//   /**
//    * Traiter un lot d'éléments à synchroniser
//    */
//   const processSyncBatch = async (batch) => {
//     if (batch.length === 0) return 0;

//     try {
//       // Préparer les données pour l'envoi
//       const syncData = batch.map(item => ({
//         id: item.collecte.id, // ID local pour le suivi
//         entreprise_id: item.collecte.entreprise_id,
//         exercice_id: item.collecte.exercice_id,
//         periode_id: item.collecte.periode_id,
//         date_collecte: item.collecte.date_collecte,
//         donnees: item.collecte.donnees,
//         type_collecte: item.collecte.is_draft ? 'brouillon' : 'standard'
//       }));

//       // Envoi des données au serveur
//       console.log('Envoi de données pour synchronisation:', syncData);
//       const response = await axios.post(route('collectes.sync-offline-data'), {
//         synced_data: syncData
//       });

//       if (response.data.success) {
//         // Marquer les collectes comme synchronisées
//         await updateSyncedStatus(batch, response.data.results);

//         // Supprimer les éléments synchronisés de la file d'attente
//         await removeFromSyncQueue(batch.map(item => item.id));

//         return response.data.results.length;
//       } else {
//         // Gérer les échecs de synchronisation
//         await handleSyncFailures(batch, response.data.errors || {});
//         return 0;
//       }
//     } catch (error) {
//       console.error('Erreur lors de la synchronisation du lot:', error);

//       // Marquer tous les éléments du lot comme en échec
//       await handleSyncFailures(batch, { general: error.message });

//       throw error;
//     }
//   };

//   /**
//    * Mettre à jour le statut de synchronisation des collectes
//    */
//   const updateSyncedStatus = async (batch, results) => {
//     if (!db || batch.length === 0) return;

//     return new Promise((resolve, reject) => {
//       try {
//         const transaction = db.transaction(COLLECTE_STORE, 'readwrite');
//         const store = transaction.objectStore(COLLECTE_STORE);

//         transaction.onerror = (event) => {
//           console.error('Transaction failed:', event.target.error);
//           reject(new Error('Transaction failed: ' + event.target.error));
//         };

//         let completed = 0;

//         // Pour chaque élément synchronisé avec succès
//         for (const result of results) {
//           // Trouver l'élément correspondant dans le lot
//           const batchItem = batch.find(item => item.collecte.id === result.local_id);

//           if (batchItem) {
//             const updateRequest = store.get(batchItem.collecte.id);

//             updateRequest.onsuccess = () => {
//               const collecte = updateRequest.result;
//               if (collecte) {
//                 collecte.synced = true;
//                 collecte.syncedAt = Date.now();
//                 collecte.remote_id = result.remote_id; // ID sur le serveur

//                 const putRequest = store.put(collecte);

//                 putRequest.onsuccess = () => {
//                   completed++;
//                   if (completed === results.length) {
//                     resolve();
//                   }
//                 };

//                 putRequest.onerror = (e) => {
//                   console.error('Erreur lors de la mise à jour du statut:', e.target.error);
//                   completed++;
//                   if (completed === results.length) {
//                     resolve();
//                   }
//                 };
//               } else {
//                 // La collecte n'a pas été trouvée, incrémenter quand même pour continuer
//                 completed++;
//                 if (completed === results.length) {
//                   resolve();
//                 }
//               }
//             };

//             updateRequest.onerror = (e) => {
//               console.error('Erreur lors de la récupération de la collecte:', e.target.error);
//               completed++;
//               if (completed === results.length) {
//                 resolve();
//               }
//             };
//           } else {
//             // L'élément n'a pas été trouvé dans le lot, incrémenter quand même pour continuer
//             completed++;
//             if (completed === results.length) {
//               resolve();
//             }
//           }
//         }

//         // Si aucun élément n'a été traité
//         if (results.length === 0) {
//           resolve();
//         }
//       } catch (error) {
//         console.error('Erreur critique lors de la mise à jour du statut:', error);
//         reject(error);
//       }
//     });
//   };

//   /**
//    * Supprimer des éléments de la file d'attente de synchronisation
//    */
//   const removeFromSyncQueue = async (ids) => {
//     if (!db || ids.length === 0) return;

//     return new Promise((resolve, reject) => {
//       try {
//         const transaction = db.transaction(SYNC_QUEUE_STORE, 'readwrite');
//         const store = transaction.objectStore(SYNC_QUEUE_STORE);

//         let completed = 0;

//         for (const id of ids) {
//           const request = store.delete(id);

//           request.onsuccess = () => {
//             completed++;
//             if (completed === ids.length) {
//               resolve();
//             }
//           };

//           request.onerror = (e) => {
//             console.error('Erreur lors de la suppression de la file d\'attente:', e.target.error);
//             completed++;
//             if (completed === ids.length) {
//               resolve();
//             }
//           };
//         }

//         // Si aucun élément n'a été traité
//         if (ids.length === 0) {
//           resolve();
//         }
//       } catch (error) {
//         console.error('Erreur critique lors de la suppression des éléments de la file d\'attente:', error);
//         reject(error);
//       }
//     });
//   };

//   /**
//    * Gérer les échecs de synchronisation
//    */
//   const handleSyncFailures = async (batch, errors) => {
//     if (!db || batch.length === 0) return;

//     return new Promise((resolve, reject) => {
//       try {
//         const transaction = db.transaction([SYNC_QUEUE_STORE, FAILED_SYNC_STORE], 'readwrite');
//         const syncStore = transaction.objectStore(SYNC_QUEUE_STORE);
//         const failedStore = transaction.objectStore(FAILED_SYNC_STORE);

//         let completed = 0;

//         for (const item of batch) {
//           // Supprimer de la file d'attente
//           const deleteRequest = syncStore.delete(item.id);

//           deleteRequest.onsuccess = () => {
//             // Ajouter aux éléments en échec
//             const failedItem = {
//               collecteId: item.collecteId,
//               route: item.route,
//               timestamp: Date.now(),
//               attempts: (item.attempts || 0) + 1,
//               error: errors[item.collecteId] || errors.general || 'Erreur inconnue'
//             };

//             const addRequest = failedStore.add(failedItem);

//             addRequest.onsuccess = () => {
//               completed++;
//               if (completed === batch.length) {
//                 resolve();
//               }
//             };

//             addRequest.onerror = (e) => {
//               console.error('Erreur lors de l\'ajout aux échecs:', e.target.error);
//               completed++;
//               if (completed === batch.length) {
//                 resolve();
//               }
//             };
//           };

//           deleteRequest.onerror = (e) => {
//             console.error('Erreur lors de la suppression de la file d\'attente:', e.target.error);
//             completed++;
//             if (completed === batch.length) {
//               resolve();
//             }
//           };
//         }

//         // Si aucun élément n'a été traité
//         if (batch.length === 0) {
//           resolve();
//         }
//       } catch (error) {
//         console.error('Erreur critique lors de la gestion des échecs de synchronisation:', error);
//         reject(error);
//       }
//     });
//   };

//   /**
//    * Vider la file d'attente de synchronisation
//    */
//   const clearSyncQueue = async () => {
//     if (!db) return false;

//     return new Promise((resolve, reject) => {
//       try {
//         const transaction = db.transaction([SYNC_QUEUE_STORE, FAILED_SYNC_STORE], 'readwrite');
//         const syncStore = transaction.objectStore(SYNC_QUEUE_STORE);
//         const failedStore = transaction.objectStore(FAILED_SYNC_STORE);

//         // Vider les deux stores
//         const syncRequest = syncStore.clear();
//         const failedRequest = failedStore.clear();

//         let completed = 0;
//         const total = 2;

//         syncRequest.onsuccess = () => {
//           completed++;
//           if (completed === total) {
//             countPendingUploads();
//             resolve(true);
//           }
//         };

//         failedRequest.onsuccess = () => {
//           completed++;
//           if (completed === total) {
//             countPendingUploads();
//             resolve(true);
//           }
//         };

//         syncRequest.onerror = (e) => {
//           console.error('Erreur lors du vidage de la file d\'attente:', e.target.error);
//           reject(e.target.error);
//         };

//         failedRequest.onerror = (e) => {
//           console.error('Erreur lors du vidage des échecs:', e.target.error);
//           reject(e.target.error);
//         };
//       } catch (error) {
//         console.error('Erreur critique lors du vidage de la file d\'attente:', error);
//         reject(error);
//       }
//     });
//   };

//   /**
//    * Supprimer une collecte locale
//    */
//   const deleteLocalCollecte = async (id) => {
//     if (!db) return false;

//     return new Promise((resolve, reject) => {
//       try {
//         const transaction = db.transaction([COLLECTE_STORE, SYNC_QUEUE_STORE, FAILED_SYNC_STORE], 'readwrite');
//         const collecteStore = transaction.objectStore(COLLECTE_STORE);
//         const syncStore = transaction.objectStore(SYNC_QUEUE_STORE);
//         const failedStore = transaction.objectStore(FAILED_SYNC_STORE);

//         // Supprimer la collecte
//         const deleteRequest = collecteStore.delete(id);

//         deleteRequest.onsuccess = () => {
//           // Rechercher et supprimer les éléments associés dans la file d'attente
//           // Plutôt que d'utiliser l'index qui pourrait ne pas exister, on récupère tous les éléments
//           // et on filtre par collecteId
//           const syncRequest = syncStore.getAll();

//           syncRequest.onsuccess = () => {
//             const syncItems = (syncRequest.result || []).filter(item => item.collecteId === id);

//             let syncCompleted = 0;
//             if (syncItems.length === 0) {
//               // Passer à la suppression des échecs
//               removeFailedItems();
//               return;
//             }

//             syncItems.forEach(item => {
//               const deleteSync = syncStore.delete(item.id);

//               deleteSync.onsuccess = () => {
//                 syncCompleted++;
//                 if (syncCompleted === syncItems.length) {
//                   // Passer à la suppression des échecs
//                   removeFailedItems();
//                 }
//               };

//               deleteSync.onerror = (e) => {
//                 console.error('Erreur lors de la suppression de la file d\'attente:', e.target.error);
//                 syncCompleted++;
//                 if (syncCompleted === syncItems.length) {
//                   // Passer à la suppression des échecs
//                   removeFailedItems();
//                 }
//               };
//             });
//           };

//           // Fonction pour supprimer les éléments en échec
//           const removeFailedItems = () => {
//             // Même approche: récupérer tous les éléments et filtrer
//             const failedRequest = failedStore.getAll();

//             failedRequest.onsuccess = () => {
//               const failedItems = (failedRequest.result || []).filter(item => item.collecteId === id);

//               let failedCompleted = 0;
//               if (failedItems.length === 0) {
//                 // Terminer la suppression
//                 countPendingUploads();
//                 resolve(true);
//                 return;
//               }

//               failedItems.forEach(item => {
//                 const deleteFailed = failedStore.delete(item.id);

//                 deleteFailed.onsuccess = () => {
//                   failedCompleted++;
//                   if (failedCompleted === failedItems.length) {
//                     // Terminer la suppression
//                     countPendingUploads();
//                     resolve(true);
//                   }
//                 };

//                 deleteFailed.onerror = (e) => {
//                   console.error('Erreur lors de la suppression des échecs:', e.target.error);
//                   failedCompleted++;
//                   if (failedCompleted === failedItems.length) {
//                     countPendingUploads();
//                     resolve(true);
//                   }
//                 };
//               });
//             };

//             failedRequest.onerror = (e) => {
//               console.error('Erreur lors de la récupération des échecs:', e.target.error);
//               countPendingUploads();
//               resolve(false);
//             };
//           };
//         };

//         deleteRequest.onerror = (e) => {
//           console.error('Erreur lors de la suppression de la collecte:', e.target.error);
//           reject(e.target.error);
//         };
//       } catch (error) {
//         console.error('Erreur critique lors de la suppression de la collecte locale:', error);
//         reject(error);
//       }
//     });
//   };

//   /**
//    * Récupérer les données sauvegardées localement pour une entreprise/période
//    */
//   const getSavedData = async (entreprise_id, exercice_id, periode_id) => {
//     if (!db) return null;

//     return new Promise((resolve, reject) => {
//       try {
//         const transaction = db.transaction(COLLECTE_STORE, 'readonly');
//         const store = transaction.objectStore(COLLECTE_STORE);

//         // Au lieu d'utiliser l'index qui pourrait ne pas exister, récupérons toutes les collectes
//         // et filtrons manuellement
//         const request = store.getAll();

//         request.onsuccess = () => {
//           const allCollectes = request.result || [];

//           // Filtrer manuellement par entreprise_id et periode_id
//           const collectes = allCollectes.filter(
//             c => c.entreprise_id == entreprise_id && c.periode_id == periode_id
//           );

//           if (collectes.length === 0) {
//             resolve(null);
//             return;
//           }

//           // Si plusieurs collectes correspondent, prendre la plus récente
//           const latestCollecte = collectes.reduce((latest, current) => {
//             return !latest || current.timestamp > latest.timestamp ? current : latest;
//           }, null);

//           resolve(latestCollecte);
//         };

//         request.onerror = (event) => {
//           console.error('Erreur lors de la récupération des données:', event.target.error);
//           reject(event.target.error);
//         };
//       } catch (error) {
//         console.error('Erreur critique lors de la récupération des données:', error);
//         reject(error);
//       }
//     });
//   };

//   return {
//     saveOffline,
//     getSavedData,
//     syncData,
//     pendingUploads,
//     isInitialized,
//     isSyncInProgress,
//     getAllLocalCollectes,
//     getFailedSyncItems,
//     retryFailedSyncItems,
//     clearSyncQueue,
//     deleteLocalCollecte
//   };
// };
// hooks/useOfflineStorage.js
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import { route } from 'ziggy-js';

const DB_NAME = 'suivi_pme_offline';
const DB_VERSION = 11;  // Incrémenté pour forcer la mise à jour de la structure
const COLLECTE_STORE = 'collectes';
const SYNC_QUEUE_STORE = 'sync_queue';
const FAILED_SYNC_STORE = 'failed_sync';

export const useOfflineStorage = () => {
  const [db, setDb] = useState(null);
  const [pendingUploads, setPendingUploads] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSyncInProgress, setIsSyncInProgress] = useState(false);

  // Initialisation de la base de données IndexedDB
  useEffect(() => {
    const initDB = () => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = (event) => {
        console.error('Erreur d\'ouverture de la base de données IndexedDB:', event.target.error);
        toast.error('Impossible d\'initialiser le stockage local');
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        console.log('Mise à jour de la base de données à la version', DB_VERSION);

        // Store pour les collectes de données
        if (!db.objectStoreNames.contains(COLLECTE_STORE)) {
          console.log('Création du store collectes');
          const collecteStore = db.createObjectStore(COLLECTE_STORE, { keyPath: 'id', autoIncrement: true });
          collecteStore.createIndex('entreprise_periode', ['entreprise_id', 'periode_id'], { unique: false });
          collecteStore.createIndex('timestamp', 'timestamp', { unique: false });
          collecteStore.createIndex('synced', 'synced', { unique: false });
        } else {
          // S'assurer que les indices existent
          const transaction = event.target.transaction;
          const collecteStore = transaction.objectStore(COLLECTE_STORE);

          if (!collecteStore.indexNames.contains('synced')) {
            console.log('Ajout de l\'index synced');
            collecteStore.createIndex('synced', 'synced', { unique: false });
          }

          if (!collecteStore.indexNames.contains('timestamp')) {
            console.log('Ajout de l\'index timestamp');
            collecteStore.createIndex('timestamp', 'timestamp', { unique: false });
          }

          if (!collecteStore.indexNames.contains('entreprise_periode')) {
            console.log('Ajout de l\'index entreprise_periode');
            collecteStore.createIndex('entreprise_periode', ['entreprise_id', 'periode_id'], { unique: false });
          }
        }

        // Store pour la file d'attente de synchronisation
        if (!db.objectStoreNames.contains(SYNC_QUEUE_STORE)) {
          console.log('Création du store sync_queue');
          const syncStore = db.createObjectStore(SYNC_QUEUE_STORE, { keyPath: 'id', autoIncrement: true });
          syncStore.createIndex('collecteId', 'collecteId', { unique: false });
          syncStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Store pour les synchronisations échouées
        if (!db.objectStoreNames.contains(FAILED_SYNC_STORE)) {
          console.log('Création du store failed_sync');
          const failedStore = db.createObjectStore(FAILED_SYNC_STORE, { keyPath: 'id', autoIncrement: true });
          failedStore.createIndex('collecteId', 'collecteId', { unique: false });
          failedStore.createIndex('timestamp', 'timestamp', { unique: false });
          failedStore.createIndex('attempts', 'attempts', { unique: false });
        }
      };

      request.onsuccess = (event) => {
        const db = event.target.result;
        console.log('Base de données ouverte avec succès');
        setDb(db);
        setIsInitialized(true);

        // Compter les éléments en attente de synchronisation
        try {
          countPendingUploads(db);
        } catch (error) {
          console.error('Erreur lors du comptage des collectes en attente:', error);
          setPendingUploads(0);
        }
      };
    };

    initDB();

    return () => {
      if (db) {
        db.close();
      }
    };
  }, []);

  // Compter les éléments en attente
  const countPendingUploads = (database = db) => {
    if (!database) return;

    try {
      const transaction = database.transaction([COLLECTE_STORE], 'readonly');
      const store = transaction.objectStore(COLLECTE_STORE);

      // Vérifier si l'index existe
      if (!store.indexNames.contains('synced')) {
        console.warn('L\'index synced n\'existe pas encore, impossible de compter les éléments non synchronisés');
        setPendingUploads(0);
        return;
      }

      const getAllRequest = store.getAll();

      getAllRequest.onsuccess = () => {
        const allItems = getAllRequest.result || [];
        // Compter les éléments où synced est exactement false (pas 0, pas null, pas undefined)
        const notSyncedCount = allItems.filter(item => item.synced === false).length;
        setPendingUploads(notSyncedCount);
      };

      getAllRequest.onerror = (error) => {
        console.error('Erreur lors de la récupération des éléments:', error);
        setPendingUploads(0);
      };
    } catch (error) {
      console.error('Erreur lors du comptage des collectes en attente:', error);
      setPendingUploads(0);
    }
  };

  /**
   * Sauvegarder les données en mode offline
   */
  const saveOffline = async (entreprise_id, exercice_id, periode_id, donnees, isDraft = false) => {
    if (!db) {
      toast.error('Base de données locale non initialisée');
      return false;
    }

    return new Promise((resolve, reject) => {
      try {
        // Créer l'objet de collecte
        const timestamp = Date.now();

        // Déterminer si c'est une collecte exceptionnelle
        const isExceptionnel = periode_id === 'exceptionnel' ||
                               periode_id === 'occasionnel' ||
                               (donnees && donnees.formType === 'exceptionnel');

        console.log(`Sauvegarde offline - Type: ${isExceptionnel ? 'Exceptionnel' : 'Standard'}, Période: ${periode_id}`);

        const collecte = {
          entreprise_id,
          exercice_id,
          periode_id,
          donnees,
          date_collecte: new Date().toISOString().split('T')[0],
          is_draft: isDraft,
          timestamp,
          synced: false,
          is_exceptionnel: isExceptionnel
        };

        // Transaction pour sauvegarder la collecte
        const transaction = db.transaction([COLLECTE_STORE], 'readwrite');

        transaction.onerror = (event) => {
          console.error('Erreur de transaction:', event.target.error);
          toast.error('Erreur lors de la sauvegarde locale');
          reject(event.target.error);
        };

        // Sauvegarder dans le store des collectes
        const collecteStore = transaction.objectStore(COLLECTE_STORE);
        const request = collecteStore.add(collecte);

        request.onsuccess = (event) => {
          const collecteId = event.target.result;
          console.log('Collecte sauvegardée avec ID:', collecteId);

          // Ajouter à la file d'attente de synchronisation à part
          addToSyncQueue(collecteId, isDraft, isExceptionnel).then(() => {
            const message = isDraft
              ? 'Brouillon sauvegardé localement en attente de synchronisation'
              : 'Données sauvegardées localement en attente de synchronisation';
            toast.success(message);
            countPendingUploads();
            resolve(collecteId);
          }).catch(error => {
            console.error('Erreur lors de l\'ajout à la file d\'attente:', error);
            // Même si l'ajout à la file échoue, la collecte est enregistrée
            resolve(collecteId);
          });
        };

        request.onerror = (event) => {
          console.error('Erreur lors de la sauvegarde:', event.target.error);
          toast.error('Erreur lors de la sauvegarde locale');
          reject(event.target.error);
        };
      } catch (error) {
        console.error('Erreur critique lors de la sauvegarde:', error);
        toast.error('Erreur critique lors de la sauvegarde locale');
        reject(error);
      }
    });
  };

  /**
   * Ajouter une collecte à la file d'attente de synchronisation
   */
  const addToSyncQueue = async (collecteId, isDraft, isExceptionnel = false) => {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject(new Error('Base de données non initialisée'));
        return;
      }

      try {
        const transaction = db.transaction([SYNC_QUEUE_STORE, COLLECTE_STORE], 'readwrite');
        const syncStore = transaction.objectStore(SYNC_QUEUE_STORE);
        const collecteStore = transaction.objectStore(COLLECTE_STORE);

        // D'abord, récupérer la collecte
        const getRequest = collecteStore.get(collecteId);

        getRequest.onsuccess = (event) => {
          const collecte = event.target.result;
          if (!collecte) {
            reject(new Error(`Collecte ${collecteId} non trouvée`));
            return;
          }

          // Déterminer la route à utiliser
          let routeToUse = isDraft ? 'collectes.draft' : 'collectes.store';

          // Ajouter à la file d'attente
          const syncItem = {
            collecteId,
            route: routeToUse,
            timestamp: Date.now(),
            attempts: 0,
            isExceptionnel: isExceptionnel
          };

          const addRequest = syncStore.add(syncItem);

          addRequest.onsuccess = () => {
            resolve(true);
          };

          addRequest.onerror = (e) => {
            console.error('Erreur lors de l\'ajout à la file d\'attente:', e.target.error);
            reject(e.target.error);
          };
        };

        getRequest.onerror = (event) => {
          console.error('Erreur lors de la récupération de la collecte:', event.target.error);
          reject(event.target.error);
        };
      } catch (error) {
        console.error('Erreur critique lors de l\'ajout à la file:', error);
        reject(error);
      }
    });
  };

  /**
   * Récupérer toutes les collectes locales
   */
  const getAllLocalCollectes = async () => {
    if (!db) return [];

    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction(COLLECTE_STORE, 'readonly');
        const store = transaction.objectStore(COLLECTE_STORE);
        const request = store.getAll();

        request.onsuccess = () => {
          resolve(request.result || []);
        };

        request.onerror = (event) => {
          console.error('Erreur lors de la récupération des collectes:', event.target.error);
          reject(event.target.error);
        };
      } catch (error) {
        console.error('Erreur critique lors de la récupération des collectes:', error);
        reject(error);
      }
    });
  };

  /**
   * Récupérer les items en échec de synchronisation
   */
  const getFailedSyncItems = async () => {
    if (!db) return [];

    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction(FAILED_SYNC_STORE, 'readonly');
        const store = transaction.objectStore(FAILED_SYNC_STORE);
        const request = store.getAll();

        request.onsuccess = () => {
          resolve(request.result || []);
        };

        request.onerror = (event) => {
          console.error('Erreur lors de la récupération des items en échec:', event.target.error);
          reject(event.target.error);
        };
      } catch (error) {
        console.error('Erreur critique lors de la récupération des items en échec:', error);
        reject(error);
      }
    });
  };

  /**
   * Réessayer les items en échec
   */
  const retryFailedSyncItems = async () => {
    if (!db) return 0;

    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction([FAILED_SYNC_STORE, SYNC_QUEUE_STORE], 'readwrite');
        const failedStore = transaction.objectStore(FAILED_SYNC_STORE);
        const syncStore = transaction.objectStore(SYNC_QUEUE_STORE);

        const getRequest = failedStore.getAll();

        getRequest.onsuccess = () => {
          const failedItems = getRequest.result || [];
          let movedCount = 0;

          if (failedItems.length === 0) {
            resolve(0);
            return;
          }

          // Pour chaque élément en échec, le déplacer vers la file d'attente
          const moveNextItem = (index) => {
            if (index >= failedItems.length) {
              // Tous les éléments ont été traités
              countPendingUploads();
              resolve(movedCount);
              return;
            }

            const item = failedItems[index];

            // Incrémenter le nombre de tentatives
            item.attempts = (item.attempts || 0) + 1;
            item.timestamp = Date.now();

            // Ajouter à la file d'attente de synchronisation
            const addRequest = syncStore.add(item);

            addRequest.onsuccess = () => {
              // Supprimer de la liste des échecs
              const deleteRequest = failedStore.delete(item.id);

              deleteRequest.onsuccess = () => {
                movedCount++;
                moveNextItem(index + 1);
              };

              deleteRequest.onerror = (e) => {
                console.error('Erreur lors de la suppression de l\'item en échec:', e.target.error);
                moveNextItem(index + 1);
              };
            };

            addRequest.onerror = (e) => {
              console.error('Erreur lors de l\'ajout à la file d\'attente:', e.target.error);
              moveNextItem(index + 1);
            };
          };

          // Démarrer le traitement du premier élément
          moveNextItem(0);
        };

        getRequest.onerror = (event) => {
            console.error('Erreur lors de la récupération des items en échec:', event.target.error);
            reject(event.target.error);
          };
        } catch (error) {
          console.error('Erreur critique lors du réessai des items en échec:', error);
          reject(error);
        }
      });
    };

    /**
     * Synchroniser les données avec le serveur
     */
    const syncData = async () => {
      if (!db || !navigator.onLine) {
        if (!navigator.onLine) {
          toast.error('Impossible de synchroniser les données: vous êtes hors ligne');
        }
        return 0;
      }

      if (isSyncInProgress) {
        toast.info('Synchronisation déjà en cours...');
        return 0;
      }

      setIsSyncInProgress(true);

      try {
        // Récupérer les éléments à synchroniser
        const syncItems = await getSyncQueueItems();

        if (syncItems.length === 0) {
          setIsSyncInProgress(false);
          return 0;
        }

        console.log(`Synchronisation de ${syncItems.length} collectes...`, syncItems);

        // Regrouper les collectes par lot pour éviter les requêtes trop volumineuses
        const batchSize = 5;
        let syncedCount = 0;

        for (let i = 0; i < syncItems.length; i += batchSize) {
          const batch = syncItems.slice(i, i + batchSize);
          const batchResult = await processSyncBatch(batch);
          syncedCount += batchResult;
        }

        // Mettre à jour le compteur
        countPendingUploads();

        setIsSyncInProgress(false);
        return syncedCount;
      } catch (error) {
        console.error('Erreur de synchronisation:', error);
        setIsSyncInProgress(false);
        throw error;
      }
    };

    /**
     * Récupérer les éléments à synchroniser
     */
    const getSyncQueueItems = async () => {
      if (!db) return [];

      return new Promise((resolve, reject) => {
        try {
          // Récupérer directement les collectes non synchronisées
          const transaction = db.transaction([COLLECTE_STORE], 'readonly');
          const collecteStore = transaction.objectStore(COLLECTE_STORE);

          const request = collecteStore.getAll();

          request.onsuccess = () => {
            const allCollectes = request.result || [];

            // Filtrer exactement comme dans countPendingUploads
            const pendingCollectes = allCollectes.filter(item => item.synced === false);

            // Transformer en format attendu par processSyncBatch et ajouter les info de type exceptionnelle
            const syncItems = pendingCollectes.map(collecte => ({
              collecteId: collecte.id,
              id: collecte.id,
              route: collecte.is_draft ? 'collectes.draft' : 'collectes.store',
              collecte: collecte,
              isExceptionnel: collecte.is_exceptionnel ||
                             collecte.periode_id === 'exceptionnel' ||
                             collecte.periode_id === 'occasionnel' ||
                             (collecte.donnees && collecte.donnees.formType === 'exceptionnel')
            }));

            resolve(syncItems);
          };

          request.onerror = (event) => {
            console.error('Erreur lors de la récupération des items à synchroniser:', event.target.error);
            reject(event.target.error);
          };
        } catch (error) {
          console.error('Erreur critique lors de la récupération des items à synchroniser:', error);
          reject(error);
        }
      });
    };

    /**
     * Traiter un lot d'éléments à synchroniser
     */
    const processSyncBatch = async (batch) => {
      if (batch.length === 0) return 0;

      try {
        // Préparer les données pour l'envoi
        const syncData = batch.map(item => {
          // Préparation des données pour assurer la compatibilité avec le contrôleur
          const collecteData = {
            id: item.collecte.id, // ID local pour le suivi
            entreprise_id: item.collecte.entreprise_id,
            exercice_id: item.collecte.exercice_id,
            periode_id: item.collecte.periode_id,
            date_collecte: item.collecte.date_collecte,
            donnees: item.collecte.donnees,
            type_collecte: item.collecte.is_draft ? 'brouillon' : 'standard'
          };

          // Indiquer explicitement si c'est une collecte exceptionnelle
          if (item.isExceptionnel) {
            collecteData.is_exceptionnel = true;

            // S'assurer que formType est défini dans donnees pour les collectes exceptionnelles
            if (typeof collecteData.donnees === 'object' && !collecteData.donnees.formType) {
              collecteData.donnees.formType = 'exceptionnel';
            }
          }

          return collecteData;
        });

        // Envoi des données au serveur
        console.log('Envoi de données pour synchronisation:', syncData);
        const response = await axios.post(route('collectes.sync-offline-data'), {
          synced_data: syncData
        });

        if (response.data.success) {
          // Marquer les collectes comme synchronisées
          await updateSyncedStatus(batch, response.data.results);

          // Supprimer les éléments synchronisés de la file d'attente
          await removeFromSyncQueue(batch.map(item => item.id));

          return response.data.results.length;
        } else {
          // Gérer les échecs de synchronisation
          await handleSyncFailures(batch, response.data.errors || {});
          return 0;
        }
      } catch (error) {
        console.error('Erreur lors de la synchronisation du lot:', error);

        // Marquer tous les éléments du lot comme en échec
        await handleSyncFailures(batch, { general: error.message });

        throw error;
      }
    };

    /**
     * Mettre à jour le statut de synchronisation des collectes
     */
    const updateSyncedStatus = async (batch, results) => {
      if (!db || batch.length === 0) return;

      return new Promise((resolve, reject) => {
        try {
          const transaction = db.transaction(COLLECTE_STORE, 'readwrite');
          const store = transaction.objectStore(COLLECTE_STORE);

          transaction.onerror = (event) => {
            console.error('Transaction failed:', event.target.error);
            reject(new Error('Transaction failed: ' + event.target.error));
          };

          let completed = 0;

          // Pour chaque élément synchronisé avec succès
          for (const result of results) {
            // Trouver l'élément correspondant dans le lot
            const batchItem = batch.find(item => item.collecte.id === result.local_id);

            if (batchItem) {
              const updateRequest = store.get(batchItem.collecte.id);

              updateRequest.onsuccess = () => {
                const collecte = updateRequest.result;
                if (collecte) {
                  collecte.synced = true;
                  collecte.syncedAt = Date.now();
                  collecte.remote_id = result.remote_id; // ID sur le serveur

                  const putRequest = store.put(collecte);

                  putRequest.onsuccess = () => {
                    completed++;
                    if (completed === results.length) {
                      resolve();
                    }
                  };

                  putRequest.onerror = (e) => {
                    console.error('Erreur lors de la mise à jour du statut:', e.target.error);
                    completed++;
                    if (completed === results.length) {
                      resolve();
                    }
                  };
                } else {
                  // La collecte n'a pas été trouvée, incrémenter quand même pour continuer
                  completed++;
                  if (completed === results.length) {
                    resolve();
                  }
                }
              };

              updateRequest.onerror = (e) => {
                console.error('Erreur lors de la récupération de la collecte:', e.target.error);
                completed++;
                if (completed === results.length) {
                  resolve();
                }
              };
            } else {
              // L'élément n'a pas été trouvé dans le lot, incrémenter quand même pour continuer
              completed++;
              if (completed === results.length) {
                resolve();
              }
            }
          }

          // Si aucun élément n'a été traité
          if (results.length === 0) {
            resolve();
          }
        } catch (error) {
          console.error('Erreur critique lors de la mise à jour du statut:', error);
          reject(error);
        }
      });
    };

    /**
     * Supprimer des éléments de la file d'attente de synchronisation
     */
    const removeFromSyncQueue = async (ids) => {
      if (!db || ids.length === 0) return;

      return new Promise((resolve, reject) => {
        try {
          const transaction = db.transaction(SYNC_QUEUE_STORE, 'readwrite');
          const store = transaction.objectStore(SYNC_QUEUE_STORE);

          let completed = 0;

          for (const id of ids) {
            const request = store.delete(id);

            request.onsuccess = () => {
              completed++;
              if (completed === ids.length) {
                resolve();
              }
            };

            request.onerror = (e) => {
              console.error('Erreur lors de la suppression de la file d\'attente:', e.target.error);
              completed++;
              if (completed === ids.length) {
                resolve();
              }
            };
          }

          // Si aucun élément n'a été traité
          if (ids.length === 0) {
            resolve();
          }
        } catch (error) {
          console.error('Erreur critique lors de la suppression des éléments de la file d\'attente:', error);
          reject(error);
        }
      });
    };

    /**
     * Gérer les échecs de synchronisation
     */
    const handleSyncFailures = async (batch, errors) => {
      if (!db || batch.length === 0) return;

      return new Promise((resolve, reject) => {
        try {
          const transaction = db.transaction([SYNC_QUEUE_STORE, FAILED_SYNC_STORE], 'readwrite');
          const syncStore = transaction.objectStore(SYNC_QUEUE_STORE);
          const failedStore = transaction.objectStore(FAILED_SYNC_STORE);

          let completed = 0;

          for (const item of batch) {
            // Supprimer de la file d'attente
            const deleteRequest = syncStore.delete(item.id);

            deleteRequest.onsuccess = () => {
              // Ajouter aux éléments en échec
              const failedItem = {
                collecteId: item.collecteId,
                route: item.route,
                timestamp: Date.now(),
                attempts: (item.attempts || 0) + 1,
                error: errors[item.collecteId] || errors.general || 'Erreur inconnue',
                isExceptionnel: item.isExceptionnel
              };

              const addRequest = failedStore.add(failedItem);

              addRequest.onsuccess = () => {
                completed++;
                if (completed === batch.length) {
                  resolve();
                }
              };

              addRequest.onerror = (e) => {
                console.error('Erreur lors de l\'ajout aux échecs:', e.target.error);
                completed++;
                if (completed === batch.length) {
                  resolve();
                }
              };
            };

            deleteRequest.onerror = (e) => {
              console.error('Erreur lors de la suppression de la file d\'attente:', e.target.error);
              completed++;
              if (completed === batch.length) {
                resolve();
              }
            };
          }

          // Si aucun élément n'a été traité
          if (batch.length === 0) {
            resolve();
          }
        } catch (error) {
          console.error('Erreur critique lors de la gestion des échecs de synchronisation:', error);
          reject(error);
        }
      });
    };

    /**
     * Vider la file d'attente de synchronisation
     */
    const clearSyncQueue = async () => {
      if (!db) return false;

      return new Promise((resolve, reject) => {
        try {
          const transaction = db.transaction([SYNC_QUEUE_STORE, FAILED_SYNC_STORE], 'readwrite');
          const syncStore = transaction.objectStore(SYNC_QUEUE_STORE);
          const failedStore = transaction.objectStore(FAILED_SYNC_STORE);

          // Vider les deux stores
          const syncRequest = syncStore.clear();
          const failedRequest = failedStore.clear();

          let completed = 0;
          const total = 2;

          syncRequest.onsuccess = () => {
            completed++;
            if (completed === total) {
              countPendingUploads();
              resolve(true);
            }
          };

          failedRequest.onsuccess = () => {
            completed++;
            if (completed === total) {
              countPendingUploads();
              resolve(true);
            }
          };

          syncRequest.onerror = (e) => {
            console.error('Erreur lors du vidage de la file d\'attente:', e.target.error);
            reject(e.target.error);
          };

          failedRequest.onerror = (e) => {
            console.error('Erreur lors du vidage des échecs:', e.target.error);
            reject(e.target.error);
          };
        } catch (error) {
          console.error('Erreur critique lors du vidage de la file d\'attente:', error);
          reject(error);
        }
      });
    };

    /**
     * Supprimer une collecte locale
     */
    const deleteLocalCollecte = async (id) => {
      if (!db) return false;

      return new Promise((resolve, reject) => {
        try {
          const transaction = db.transaction([COLLECTE_STORE, SYNC_QUEUE_STORE, FAILED_SYNC_STORE], 'readwrite');
          const collecteStore = transaction.objectStore(COLLECTE_STORE);
          const syncStore = transaction.objectStore(SYNC_QUEUE_STORE);
          const failedStore = transaction.objectStore(FAILED_SYNC_STORE);

          // Supprimer la collecte
          const deleteRequest = collecteStore.delete(id);

          deleteRequest.onsuccess = () => {
            // Rechercher et supprimer les éléments associés dans la file d'attente
            // Plutôt que d'utiliser l'index qui pourrait ne pas exister, on récupère tous les éléments
            // et on filtre par collecteId
            const syncRequest = syncStore.getAll();

            syncRequest.onsuccess = () => {
              const syncItems = (syncRequest.result || []).filter(item => item.collecteId === id);

              let syncCompleted = 0;
              if (syncItems.length === 0) {
                // Passer à la suppression des échecs
                removeFailedItems();
                return;
              }

              syncItems.forEach(item => {
                const deleteSync = syncStore.delete(item.id);

                deleteSync.onsuccess = () => {
                  syncCompleted++;
                  if (syncCompleted === syncItems.length) {
                    // Passer à la suppression des échecs
                    removeFailedItems();
                  }
                };

                deleteSync.onerror = (e) => {
                  console.error('Erreur lors de la suppression de la file d\'attente:', e.target.error);
                  syncCompleted++;
                  if (syncCompleted === syncItems.length) {
                    // Passer à la suppression des échecs
                    removeFailedItems();
                  }
                };
              });
            };

            // Fonction pour supprimer les éléments en échec
            const removeFailedItems = () => {
              // Même approche: récupérer tous les éléments et filtrer
              const failedRequest = failedStore.getAll();

              failedRequest.onsuccess = () => {
                const failedItems = (failedRequest.result || []).filter(item => item.collecteId === id);

                let failedCompleted = 0;
                if (failedItems.length === 0) {
                  // Terminer la suppression
                  countPendingUploads();
                  resolve(true);
                  return;
                }

                failedItems.forEach(item => {
                  const deleteFailed = failedStore.delete(item.id);

                  deleteFailed.onsuccess = () => {
                    failedCompleted++;
                    if (failedCompleted === failedItems.length) {
                      // Terminer la suppression
                      countPendingUploads();
                      resolve(true);
                    }
                  };

                  deleteFailed.onerror = (e) => {
                    console.error('Erreur lors de la suppression des échecs:', e.target.error);
                    failedCompleted++;
                    if (failedCompleted === failedItems.length) {
                      countPendingUploads();
                      resolve(true);
                    }
                  };
                });
              };

              failedRequest.onerror = (e) => {
                console.error('Erreur lors de la récupération des échecs:', e.target.error);
                countPendingUploads();
                resolve(false);
              };
            };
          };

          deleteRequest.onerror = (e) => {
            console.error('Erreur lors de la suppression de la collecte:', e.target.error);
            reject(e.target.error);
          };
        } catch (error) {
          console.error('Erreur critique lors de la suppression de la collecte locale:', error);
          reject(error);
        }
      });
    };

    /**
     * Récupérer les données sauvegardées localement pour une entreprise/période
     */
    const getSavedData = async (entreprise_id, exercice_id, periode_id) => {
      if (!db) return null;

      return new Promise((resolve, reject) => {
        try {
          const transaction = db.transaction(COLLECTE_STORE, 'readonly');
          const store = transaction.objectStore(COLLECTE_STORE);

          // Récupérer toutes les collectes et filtrer manuellement
          const request = store.getAll();

          request.onsuccess = () => {
            const allCollectes = request.result || [];

            // Filtrer manuellement par entreprise_id et periode_id
            const collectes = allCollectes.filter(
              c => c.entreprise_id == entreprise_id &&
                  (c.periode_id == periode_id ||
                   (c.is_exceptionnel && ['exceptionnel', 'occasionnel'].includes(periode_id)))
            );

            if (collectes.length === 0) {
              resolve(null);
              return;
            }

            // Si plusieurs collectes correspondent, prendre la plus récente
            const latestCollecte = collectes.reduce((latest, current) => {
              return !latest || current.timestamp > latest.timestamp ? current : latest;
            }, null);

            resolve(latestCollecte);
          };

          request.onerror = (event) => {
            console.error('Erreur lors de la récupération des données:', event.target.error);
            reject(event.target.error);
          };
        } catch (error) {
          console.error('Erreur critique lors de la récupération des données:', error);
          reject(error);
        }
      });
    };

    return {
      saveOffline,
      getSavedData,
      syncData,
      pendingUploads,
      isInitialized,
      isSyncInProgress,
      getAllLocalCollectes,
      getFailedSyncItems,
      retryFailedSyncItems,
      clearSyncQueue,
      deleteLocalCollecte
    };
  };
