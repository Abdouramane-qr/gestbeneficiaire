import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import axios from 'axios';

const DB_NAME = 'suivi_pme_offline';
const DB_VERSION = 1;
const COLLECTE_STORE = 'collectes';
const SYNC_QUEUE_STORE = 'sync_queue';

/**
 * Hook pour gérer le stockage et la synchronisation des données en mode offline
 */
export const useOfflineStorage = () => {
  const [db, setDb] = useState(null);
  const [pendingUploads, setPendingUploads] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

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

        // Store pour les collectes de données
        if (!db.objectStoreNames.contains(COLLECTE_STORE)) {
          const collecteStore = db.createObjectStore(COLLECTE_STORE, { keyPath: 'id', autoIncrement: true });
          collecteStore.createIndex('entreprise_periode', ['entreprise_id', 'periode_id'], { unique: false });
          collecteStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Store pour la file d'attente de synchronisation
        if (!db.objectStoreNames.contains(SYNC_QUEUE_STORE)) {
          const syncStore = db.createObjectStore(SYNC_QUEUE_STORE, { keyPath: 'id', autoIncrement: true });
          syncStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };

      request.onsuccess = (event) => {
        const db = event.target.result;
        setDb(db);
        setIsInitialized(true);

        // Compter les éléments en attente de synchronisation
        countPendingUploads(db);
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

    const transaction = database.transaction(SYNC_QUEUE_STORE, 'readonly');
    const store = transaction.objectStore(SYNC_QUEUE_STORE);
    const countRequest = store.count();

    countRequest.onsuccess = () => {
      setPendingUploads(countRequest.result);
    };
  };

  /**
   * Sauvegarder les données en mode offline
   * @param {number} entreprise_id - ID de l'entreprise
   * @param {number} exercice_id - ID de l'exercice
   * @param {string} periode_id - ID de la période
   * @param {Object} donnees - Données à sauvegarder
   * @param {boolean} isDraft - Indique si c'est un brouillon
   */
  const saveOffline = async (entreprise_id, exercice_id, periode_id, donnees, isDraft = false)  => {
    if (!db) {
      toast.error('Base de données locale non initialisée');
      return false;
    }

    return new Promise((resolve, reject) => {
      // Créer l'objet de collecte
      const timestamp = Date.now();
      const collecte = {
        entreprise_id,
        exercice_id,
        periode_id,
        donnees,
        date_collecte: new Date().toISOString().split('T')[0],
        is_draft: isDraft,
        timestamp,
        synced: false
      };

      // Transaction pour sauvegarder la collecte et l'ajouter à la file de synchronisation
      const transaction = db.transaction([COLLECTE_STORE, SYNC_QUEUE_STORE], 'readwrite');

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

        // Ajouter à la file d'attente de synchronisation
        const syncQueueStore = transaction.objectStore(SYNC_QUEUE_STORE);
        const syncItem = {
          collecteId,
          route: isDraft ? 'collectes.draft' : 'collectes.store',
          data: collecte,
          timestamp
        };

        const syncRequest = syncQueueStore.add(syncItem);

        syncRequest.onsuccess = () => {
          const message = isDraft
            ? 'Brouillon sauvegardé localement en attente de synchronisation'
            : 'Données sauvegardées localement en attente de synchronisation';
          toast.success(message);
          countPendingUploads();
          resolve(true);
        };

        syncRequest.onerror = (event) => {
          toast.error('Erreur lors de l\'ajout à la file de synchronisation');
          reject(event.target.error);
        };
      };
    });
  };

  /**
   * Récupérer les données sauvegardées localement
   * @param {number} entreprise_id - ID de l'entreprise
   * @param {number} exercice_id - ID de l'exercice
   * @param {string} periode_id - ID de la période
   */
  const getSavedData = async (entreprise_id, exercice_id, periode_id) => {
    if (!db) return null;

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(COLLECTE_STORE, 'readonly');
      const store = transaction.objectStore(COLLECTE_STORE);
      const index = store.index('entreprise_periode');

      // Chercher les collectes correspondant à entreprise_id et periode_id
      const request = index.getAll([entreprise_id, periode_id]);

      request.onsuccess = () => {
        const collectes = request.result;

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
    });
  };

  /**
   * Synchroniser les données lorsque la connexion est rétablie
   */
  const syncData = async () => {
    if (!db || !navigator.onLine) {
      if (!navigator.onLine) {
        toast.error('Impossible de synchroniser les données: vous êtes hors ligne');
      }
      return false;
    }

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(SYNC_QUEUE_STORE, 'readonly');
      const store = transaction.objectStore(SYNC_QUEUE_STORE);
      const request = store.getAll();

      request.onsuccess = async () => {
        const items = request.result;

        if (items.length === 0) {
          toast.info('Aucune donnée à synchroniser');
          resolve(true);
          return;
        }

        toast.info(`Synchronisation de ${items.length} élément(s) en cours...`);

        try {
          // Préparation des données pour la synchronisation en lot
          const syncedData = items.map(item => ({
            entreprise_id: item.data.entreprise_id,
            exercice_id: item.data.exercice_id,
            periode_id: item.data.periode_id,
            date_collecte: item.data.date_collecte,
            donnees: item.data.donnees,
            is_draft: item.data.is_draft,
            timestamp: item.data.timestamp
          }));

          // Envoi des données au serveur
          // eslint-disable-next-line no-undef
          const response = await axios.post(route('collectes.sync-offline-data'), {
            synced_data: syncedData
          });

          if (response.data.success) {
            // Supprimer les éléments synchronisés de la file d'attente
            await clearSyncQueue();

            toast.success(response.data.message);
            countPendingUploads();
            resolve(true);
          } else {
            toast.error(response.data.message || 'Erreur lors de la synchronisation');
            resolve(false);
          }
        } catch (error) {
          console.error('Erreur de synchronisation:', error);
          toast.error('Erreur lors de la synchronisation: ' + (error.response?.data?.message || error.message));
          reject(error);
        }
      };

      request.onerror = (event) => {
        console.error('Erreur lors de la récupération de la file de synchronisation:', event.target.error);
        toast.error('Erreur lors de la synchronisation');
        reject(event.target.error);
      };
    });
  };

  /**
   * Vider la file d'attente de synchronisation
   */
  const clearSyncQueue = async () => {
    if (!db) return false;

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(SYNC_QUEUE_STORE, 'readwrite');
      const store = transaction.objectStore(SYNC_QUEUE_STORE);
      const request = store.clear();

      request.onsuccess = () => {
        resolve(true);
      };

      request.onerror = (event) => {
        console.error('Erreur lors de la suppression de la file de synchronisation:', event.target.error);
        reject(event.target.error);
      };
    });
  };

  return {
    saveOffline,
    getSavedData,
    syncData,
    pendingUploads,
    isInitialized
  };
};
