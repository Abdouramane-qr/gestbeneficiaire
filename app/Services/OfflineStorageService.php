<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;

class OfflineStorageService
{
    private const DB_NAME = 'suivi_pme_offline';
    private const DB_VERSION = 1;
    private const COLLECTE_STORE = 'collectes';
    private const SYNC_QUEUE_STORE = 'sync_queue';

    private $db;

    public function __construct()
    {
        $this->initDB();
    }

    private function initDB()
    {
        try {
            $this->db = new \IDB\Database(self::DB_NAME, self::DB_VERSION);

            // Création des stores
            $this->db->createObjectStore(self::COLLECTE_STORE, ['keyPath' => 'id']);
            $this->db->createObjectStore(self::SYNC_QUEUE_STORE, ['keyPath' => 'id']);

            return true;
        } catch (\Exception $e) {
            Log::error('Erreur initialisation DB offline: ' . $e->getMessage());
            return false;
        }
    }

    public function saveCollecte($data)
    {
        try {
            // Sauvegarder dans le store des collectes
            $result = $this->db->transaction(self::COLLECTE_STORE, 'readwrite')
                ->objectStore(self::COLLECTE_STORE)
                ->add($data);

            // Ajouter à la file de synchro
            $syncItem = [
                'id' => uniqid(),
                'collecte_id' => $data['id'],
                'data' => $data,
                'status' => 'pending',
                'created_at' => now()
            ];

            $this->db->transaction(self::SYNC_QUEUE_STORE, 'readwrite')
                ->objectStore(self::SYNC_QUEUE_STORE)
                ->add($syncItem);

            return $result;
        } catch (\Exception $e) {
            Log::error('Erreur sauvegarde offline: ' . $e->getMessage());
            return false;
        }
    }

    public function getCollectes()
    {
        try {
            return $this->db->transaction(self::COLLECTE_STORE)
                ->objectStore(self::COLLECTE_STORE)
                ->getAll();
        } catch (\Exception $e) {
            Log::error('Erreur récupération collectes: ' . $e->getMessage());
            return [];
        }
    }

    public function getPendingSyncs()
    {
        try {
            return $this->db->transaction(self::SYNC_QUEUE_STORE)
                ->objectStore(self::SYNC_QUEUE_STORE)
                ->index('status')
                ->getAll('pending');
        } catch (\Exception $e) {
            Log::error('Erreur récupération syncs: ' . $e->getMessage());
            return [];
        }
    }

    public function updateSyncStatus($id, $status)
    {
        try {
            $store = $this->db->transaction(self::SYNC_QUEUE_STORE, 'readwrite')
                ->objectStore(self::SYNC_QUEUE_STORE);

            $item = $store->get($id);
            if ($item) {
                $item->status = $status;
                $item->updated_at = now();
                $store->put($item);
                return true;
            }
            return false;
        } catch (\Exception $e) {
            Log::error('Erreur mise à jour sync: ' . $e->getMessage());
            return false;
        }
    }
}
