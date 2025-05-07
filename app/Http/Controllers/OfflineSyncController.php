<?php

namespace App\Http\Controllers;

use App\Models\Collecte;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OfflineSyncController extends Controller
{
    /**
     * Nettoyer un tableau récursivement pour éliminer les valeurs nulles, vides, etc.
     */
    private function cleanupArray($array) {
        if (!is_array($array)) {
            return $array;
        }

        $result = [];

        foreach ($array as $key => $value) {
            // Ignorer les valeurs nulles/vides
            if ($value === null || $value === "" || (is_array($value) && count($value) === 0)) {
                continue;
            }

            // Traiter récursivement les tableaux
            if (is_array($value)) {
                $cleaned = $this->cleanupArray($value);
                if (!empty($cleaned)) {
                    $result[$key] = $cleaned;
                }
            } else {
                $result[$key] = $value;
            }
        }

        return $result;
    }

    /**
     * Valider et préparer les données avant traitement
     */
    private function prepareData(&$data) {
        Log::info('Préparation des données pour la collecte #' . $data['id']);

        // Définir les tailles maximales en fonction de votre schéma de BD
        $maxJsonSize = 65000; // Taille réelle de votre colonne en BD

        // S'assurer que donnees est un tableau
        if (!is_array($data['donnees'])) {
            // Si c'est une chaîne JSON, tenter de la décoder
            if (is_string($data['donnees']) && $decoded = json_decode($data['donnees'], true)) {
                $data['donnees'] = $decoded;
                Log::info('Données converties de JSON à tableau pour collecte #' . $data['id']);
            } else {
                // Sinon, encapsuler dans un tableau avec une clé 'data'
                $data['donnees'] = ['data' => $data['donnees']];
                Log::info('Données encapsulées dans un tableau pour collecte #' . $data['id']);
            }
        }

        // Nettoyer les données pour réduire la taille
        $originalSize = strlen(json_encode($data['donnees']));
        $data['donnees'] = $this->cleanupArray($data['donnees']);
        $cleanedSize = strlen(json_encode($data['donnees']));

        Log::info("Collecte #{$data['id']}: Taille originale: {$originalSize}, après nettoyage: {$cleanedSize}");

        // Vérifier la taille finale après nettoyage
        $jsonData = json_encode($data['donnees']);
        $jsonSize = strlen($jsonData);

        // Si les données dépassent la taille maximale
        if ($jsonSize > $maxJsonSize) {
            Log::warning("Données trop volumineuses pour la collecte #{$data['id']} : {$jsonSize} octets");

            try {
                // Essayer la compression
                $compressedData = gzcompress($jsonData, 9);
                $compressedSize = strlen($compressedData);

                Log::info("Taille après compression: {$compressedSize} octets (réduction de " .
                    round(($jsonSize - $compressedSize) / $jsonSize * 100, 2) . "%)");

                // Même compressées, si elles dépassent la limite
                if ($compressedSize > $maxJsonSize) {
                    // Créer un objet simplifié qui tient dans la BD
                    $data['donnees'] = [
                        'warning' => 'Données trop volumineuses',
                        'size' => $jsonSize,
                        'compressed_size' => $compressedSize,
                        'timestamp' => time()
                    ];

                    Log::warning("Données simplifiées pour la collecte #{$data['id']} car même compressées elles sont trop volumineuses");
                } else {
                    // Stocker en format base64 les données compressées
                    $data['donnees'] = [
                        'compressed' => true,
                        'data' => base64_encode($compressedData)
                    ];

                    Log::info("Données compressées stockées en base64 pour la collecte #{$data['id']}");
                }
            } catch (\Exception $e) {
                Log::error("Erreur de compression pour la collecte #{$data['id']}: " . $e->getMessage());

                // En cas d'échec de compression, simplifier drastiquement
                $data['donnees'] = [
                    'error' => 'Échec de compression',
                    'message' => 'Les données étaient trop volumineuses et n\'ont pas pu être compressées',
                    'timestamp' => time()
                ];
            }
        }

        return true;
    }

    /**
     * Synchroniser les données collectées hors ligne
     */
    public function syncOfflineData(Request $request)
    {
        try {
            Log::info('Début de la synchronisation des données hors ligne');

            // Validation plus flexible pour gérer différents types de données
            $validated = $request->validate([
                'synced_data' => 'required|array',
                'synced_data.*.entreprise_id' => 'required|exists:entreprises,id',
                'synced_data.*.exercice_id' => 'required|exists:exercices,id',
                'synced_data.*.periode_id' => 'required', // Peut être 'exceptionnel' ou un ID
                'synced_data.*.date_collecte' => 'required|date',
                'synced_data.*.donnees' => 'required', // On retire array ici
                'synced_data.*.type_collecte' => 'required|in:standard,brouillon',
                'synced_data.*.id' => 'required|integer', // ID local pour suivi
            ]);

            $syncedData = $validated['synced_data'];
            $results = [];
            $errors = [];

            Log::info('Début de la transaction avec ' . count($syncedData) . ' éléments');
            DB::beginTransaction();

            foreach ($syncedData as $index => $data) {
                try {
                    // Préparer et valider les données
                    $this->prepareData($data);

                    // Vérifier s'il s'agit d'une collecte exceptionnelle
                    $isExceptionnel = is_string($data['periode_id']) &&
                        (strtolower($data['periode_id']) === 'exceptionnel' ||
                         strtolower($data['periode_id']) === 'occasionnel');

                    // Vérifier si nous devons créer ou mettre à jour
                    $existingCollecte = null;

                    if (!$isExceptionnel && $data['type_collecte'] === 'standard') {
                        // Vérifier si une collecte standard existe déjà pour cette entreprise/période
                        $existingCollecte = Collecte::where('entreprise_id', $data['entreprise_id'])
                            ->where('periode_id', $data['periode_id'])
                            ->where('type_collecte', 'standard')
                            ->first();
                    }

                    // Traitement des collectes exceptionnelles
                    if ($isExceptionnel) {
                        // Pour les collectes exceptionnelles, toujours créer une nouvelle
                        Log::info("Création d'une collecte exceptionnelle pour #{$data['id']}");
                        $collecte = new Collecte([
                            'entreprise_id' => $data['entreprise_id'],
                            'exercice_id' => $data['exercice_id'],
                            // Pour la periode_id, utiliser null ou un code spécial selon votre modèle
                            'periode_id' => null, // ou une valeur spéciale comme -1
                            'date_collecte' => Carbon::parse($data['date_collecte']),
                            'donnees' => $data['donnees'],
                            'type_collecte' => $data['type_collecte'],
                            'is_exceptionnel' => true, // Marquer comme exceptionnelle
                            'user_id' => Auth::id(),
                        ]);

                        $collecte->save();
                        Log::info("Collecte exceptionnelle #{$data['id']} sauvegardée avec ID: {$collecte->id}");

                        $results[] = [
                            'local_id' => $data['id'],
                            'remote_id' => $collecte->id,
                            'status' => 'created',
                            'type' => 'exceptionnel'
                        ];
                    }
                    // Si une collecte existe, la mettre à jour, sinon en créer une nouvelle
                    else if ($existingCollecte) {
                        // Mettre à jour la collecte existante
                        Log::info("Mise à jour de la collecte existante #{$existingCollecte->id} pour collecte locale #{$data['id']}");
                        $existingCollecte->update([
                            'exercice_id' => $data['exercice_id'],
                            'date_collecte' => Carbon::parse($data['date_collecte']),
                            'donnees' => $data['donnees'],
                            'user_id' => Auth::id(),
                        ]);
                        Log::info("Collecte #{$existingCollecte->id} mise à jour");

                        $results[] = [
                            'local_id' => $data['id'],
                            'remote_id' => $existingCollecte->id,
                            'status' => 'updated'
                        ];
                    } else {
                        // Créer une nouvelle collecte
                        Log::info("Création d'une nouvelle collecte standard pour #{$data['id']}");
                        $collecte = Collecte::create([
                            'entreprise_id' => $data['entreprise_id'],
                            'exercice_id' => $data['exercice_id'],
                            'periode_id' => $data['periode_id'],
                            'date_collecte' => Carbon::parse($data['date_collecte']),
                            'donnees' => $data['donnees'],
                            'type_collecte' => $data['type_collecte'],
                            'user_id' => Auth::id(),
                        ]);
                        Log::info("Collecte standard #{$data['id']} créée avec ID: {$collecte->id}");

                        $results[] = [
                            'local_id' => $data['id'],
                            'remote_id' => $collecte->id,
                            'status' => 'created'
                        ];
                    }
                } catch (\Exception $e) {
                    // Capturer l'erreur pour cet élément spécifique
                    $errorMsg = 'Erreur lors de la synchronisation de la collecte #' . ($index + 1) . ': ' . $e->getMessage();
                    Log::error($errorMsg);
                    Log::error('Trace: ' . $e->getTraceAsString());

                    $errors[$data['id']] = $e->getMessage();

                    // Si c'est une erreur de validation, ajouter plus de détails
                    if ($e instanceof ValidationException) {
                        Log::error('Erreurs de validation: ' . json_encode($e->errors()));
                    }
                }
            }

            Log::info('Commit de la transaction');
            DB::commit();
            Log::info('Transaction validée avec succès');

            return response()->json([
                'success' => count($results) > 0,
                'message' => count($results) . ' collecte(s) synchronisée(s) avec succès',
                'results' => $results,
                'errors' => $errors
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur globale de synchronisation: ' . $e->getMessage());
            Log::error('Trace: ' . $e->getTraceAsString());

            if ($e instanceof ValidationException) {
                Log::error('Erreurs de validation: ' . json_encode($e->errors()));
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur de validation lors de la synchronisation',
                    'errors' => $e->errors()
                ], 422);
            }

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la synchronisation: ' . $e->getMessage(),
                'errors' => ['general' => $e->getMessage()]
            ], 500);
        }
    }

    /**
     * Vérifier si une collecte existe en base de données
     */
    public function verify($id)
    {
        $exists = Collecte::where('id', $id)->exists();
        return response()->json(['exists' => $exists]);
    }
}
