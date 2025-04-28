<?php

namespace App\Services;

use App\Models\Collecte;
use Illuminate\Support\Facades\Log;
use App\Services\OfflineStorageService;

class CollecteSyncService
{
    private $offlineStorage;

    public function __construct(OfflineStorageService $offlineStorage)
    {
        $this->offlineStorage = $offlineStorage;
    }

    public function syncPendingCollectes()
    {
        try {
            $pendingSyncs = $this->offlineStorage->getPendingSyncs();
            $syncedCount = 0;

            foreach ($pendingSyncs as $sync) {
                try {
                    // Créer ou mettre à jour la collecte
                    $result = $this->syncCollecte($sync->data);

                    if ($result) {
                        $this->offlineStorage->updateSyncStatus($sync->id, 'completed');
                        $syncedCount++;
                    } else {
                        $this->offlineStorage->updateSyncStatus($sync->id, 'failed');
                    }
                } catch (\Exception $e) {
                    Log::error("Erreur sync collecte {$sync->id}: " . $e->getMessage());
                    $this->offlineStorage->updateSyncStatus($sync->id, 'failed');
                }
            }

            return $syncedCount;
        } catch (\Exception $e) {
            Log::error('Erreur synchronisation: ' . $e->getMessage());
            return 0;
        }
    }

    private function syncCollecte($data)
    {
        // Vérifier si la collecte existe déjà
        $collecte = Collecte::find($data['id'] ?? null);

        if ($collecte) {
            // Mise à jour
            return $collecte->update($data);
        } else {
            // Création
            return Collecte::create($data) !== null;
        }
    }

    public function hasConnectionToServer()
    {
        try {
            // Faire un ping simple au serveur
            $ch = curl_init(config('app.url') . '/api/ping');
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_TIMEOUT, 5);
            $result = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            return $httpCode === 200;
        } catch (\Exception $e) {
            Log::error('Erreur vérification connexion: ' . $e->getMessage());
            return false;
        }
    }
}
