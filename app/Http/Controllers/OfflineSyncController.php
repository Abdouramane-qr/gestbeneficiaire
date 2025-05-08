<?php

namespace App\Http\Controllers;

use App\Models\Collecte;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
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
        $maxJsonSize = 60000; // Légèrement inférieur à la taille maximale pour avoir une marge

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

        // Vérification du type de formulaire pour les données
        if (isset($data['donnees']['formType']) && $data['donnees']['formType'] === 'exceptionnel') {
            $data['is_exceptionnel'] = true;
        }

        return true;
    }

    /**
     * Synchroniser les données collectées hors ligne
     */
    public function syncOfflineData(Request $request)
    {
        try {
            // Générer un identifiant unique pour cette session de synchronisation
            $syncId = uniqid('sync_');
            Log::info("[SYNC:{$syncId}] Début de la synchronisation des données hors ligne");

            // Vérification de la structure de la table
            try {
                $columns = Schema::getColumnListing('collectes');
                Log::info("[SYNC:{$syncId}] Colonnes de la table collectes: " . implode(', ', $columns));
            } catch (\Exception $e) {
                Log::warning("[SYNC:{$syncId}] Impossible de vérifier la structure: " . $e->getMessage());
            }

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

            Log::info("[SYNC:{$syncId}] Début de la transaction avec " . count($syncedData) . " éléments");

            // Traiter chaque élément dans sa propre transaction pour éviter de tout perdre en cas d'erreur
            foreach ($syncedData as $index => $data) {
                $itemId = $data['id'];

                // Commencer une transaction pour cet élément uniquement
                DB::beginTransaction();

                try {
                    //Log::info("[SYNC:{$syncId}] Traitement de l'élément #{$itemId} ({$index+1}/{count($syncedData)})");

                    // Préparer et valider les données
                    $this->prepareData($data);

                    // Vérifier s'il s'agit d'une collecte exceptionnelle
                    $isExceptionnel = is_string($data['periode_id']) &&
                        (strtolower($data['periode_id']) === 'exceptionnel' ||
                         strtolower($data['periode_id']) === 'occasionnel') ||
                        (isset($data['is_exceptionnel']) && $data['is_exceptionnel'] === true) ||
                        (isset($data['donnees']['formType']) && $data['donnees']['formType'] === 'exceptionnel');

                    // Vérifier si nous devons créer ou mettre à jour
                    $existingCollecte = null;

                    if (!$isExceptionnel && $data['type_collecte'] === 'standard') {
                        // Vérifier si une collecte standard existe déjà pour cette entreprise/période

                        // Traiter periode_id pour la recherche
                        $periodeIdForSearch = $data['periode_id'];
                        if (is_string($periodeIdForSearch) && is_numeric($periodeIdForSearch)) {
                            $periodeIdForSearch = (int)$periodeIdForSearch;
                        }

                        $existingCollecte = Collecte::where('entreprise_id', $data['entreprise_id'])
                            ->where('periode_id', $periodeIdForSearch)
                            ->where('type_collecte', 'standard')
                            ->first();
                    }

                    // Traitement des collectes exceptionnelles
                    if ($isExceptionnel) {
                        // Pour les collectes exceptionnelles, toujours créer une nouvelle
                        Log::info("[SYNC:{$syncId}] Création d'une collecte exceptionnelle pour #{$itemId}");

                        $collecteData = [
                            'entreprise_id' => $data['entreprise_id'],
                            'exercice_id' => $data['exercice_id'],
                            // Pour la periode_id, utiliser null pour les collectes exceptionnelles
                            'periode_id' => null,
                            // Définir la période comme "Occasionnelle"
                            'periode' => 'Occasionnelle',
                            'date_collecte' => Carbon::parse($data['date_collecte']),
                            'donnees' => $data['donnees'],
                            'type_collecte' => $data['type_collecte'],
                            'user_id' => Auth::id(),
                        ];

                        // Ajouter is_exceptionnel seulement si la colonne existe
                        if (in_array('is_exceptionnel', $columns)) {
                            $collecteData['is_exceptionnel'] = true;
                        } else {
                            // Si la colonne n'existe pas, stocker cette info dans les données
                            if (is_array($collecteData['donnees'])) {
                                $collecteData['donnees']['_is_exceptionnel'] = true;
                            }
                        }

                        // Log complet pour débogage
                        Log::debug("[SYNC:{$syncId}] Données complètes pour la collecte exceptionnelle:", $collecteData);

                        $collecte = new Collecte($collecteData);
                        $collecte->save();

                        Log::info("[SYNC:{$syncId}] Collecte exceptionnelle #{$itemId} sauvegardée avec ID: {$collecte->id}");

                        $results[] = [
                            'local_id' => $itemId,
                            'remote_id' => $collecte->id,
                            'status' => 'created',
                            'type' => 'exceptionnel'
                        ];
                    }
                    // Si une collecte existe, la mettre à jour, sinon en créer une nouvelle
                    else if ($existingCollecte) {
                        // Mettre à jour la collecte existante
                        Log::info("[SYNC:{$syncId}] Mise à jour de la collecte existante #{$existingCollecte->id} pour collecte locale #{$itemId}");
                        $existingCollecte->update([
                            'exercice_id' => $data['exercice_id'],
                            'date_collecte' => Carbon::parse($data['date_collecte']),
                            'donnees' => $data['donnees'],
                            'user_id' => Auth::id(),
                        ]);
                        Log::info("[SYNC:{$syncId}] Collecte #{$existingCollecte->id} mise à jour");

                        $results[] = [
                            'local_id' => $itemId,
                            'remote_id' => $existingCollecte->id,
                            'status' => 'updated'
                        ];
                    } else {
                        // Créer une nouvelle collecte standard
                        Log::info("[SYNC:{$syncId}] Création d'une nouvelle collecte standard pour #{$itemId}");

                        // Log détaillé des données avant création
                        Log::debug("[SYNC:{$syncId}] Données pour collecte standard:", [
                            'periode_id_original' => $data['periode_id'],
                            'type' => gettype($data['periode_id']),
                            'taille_donnees' => strlen(json_encode($data['donnees']))
                        ]);

                        // Traitement du periode_id
                        $periodeId = null;
                        if (isset($data['periode_id'])) {
                            if (is_numeric($data['periode_id'])) {
                                // Conversion en entier
                                $periodeId = (int)$data['periode_id'];
                                Log::debug("[SYNC:{$syncId}] periode_id converti en entier: $periodeId");
                            } elseif (is_string($data['periode_id']) && !in_array(strtolower($data['periode_id']), ['exceptionnel', 'occasionnel'])) {
                                try {
                                    // Recherche par nom si c'est une chaîne non numérique
                                    $periode = DB::table('periodes')
                                        ->where('id', $data['periode_id'])
                                        ->orWhere('nom', 'like', '%' . $data['periode_id'] . '%')
                                        ->orWhere('type_periode', 'like', '%' . $data['periode_id'] . '%')
                                        ->first();

                                    if ($periode) {
                                        $periodeId = $periode->id;
                                        Log::debug("[SYNC:{$syncId}] periode_id trouvé par recherche: $periodeId");
                                    } else {
                                        Log::warning("[SYNC:{$syncId}] Période non trouvée, utilisation de null");
                                    }
                                } catch (\Exception $e) {
                                    Log::warning("[SYNC:{$syncId}] Erreur recherche période: " . $e->getMessage());
                                }
                            }
                        }

                        // Compression des données si nécessaire
                        $donnees = $data['donnees'];
                        $jsonData = json_encode($donnees);
                        $jsonSize = strlen($jsonData);

                        if ($jsonSize > 60000) {
                            Log::warning("[SYNC:{$syncId}] Données trop volumineuses ({$jsonSize} octets), compression automatique");
                            $compressed = gzcompress($jsonData, 9);
                            $donnees = [
                                'compressed' => true,
                                'data' => base64_encode($compressed)
                            ];
                            Log::info("[SYNC:{$syncId}] Taille après compression: " . strlen(json_encode($donnees)) . " octets");
                        }

                        // Création de la collecte
                        try {
                            $collecteData = [
                                'entreprise_id' => $data['entreprise_id'],
                                'exercice_id' => $data['exercice_id'],
                                'periode_id' => $periodeId,
                                'date_collecte' => Carbon::parse($data['date_collecte']),
                                'donnees' => $donnees,
                                'type_collecte' => $data['type_collecte'],
                                'user_id' => Auth::id(),
                            ];

                            // Ajouter periode seulement si nécessaire et si la colonne existe
                            if (in_array('periode', $columns)) {
                                $collecteData['periode'] = null; // Standard n'a pas besoin de periode
                            }

                            // Ajouter is_exceptionnel=false si la colonne existe
                            if (in_array('is_exceptionnel', $columns)) {
                                $collecteData['is_exceptionnel'] = false;
                            }

                            $collecte = Collecte::create($collecteData);

                            Log::info("[SYNC:{$syncId}] Collecte standard #{$itemId} créée avec ID: {$collecte->id}");

                            $results[] = [
                                'local_id' => $itemId,
                                'remote_id' => $collecte->id,
                                'status' => 'created'
                            ];
                        } catch (\Exception $e) {
                            Log::error("[SYNC:{$syncId}] Erreur création collecte standard: " . $e->getMessage());
                            Log::error("[SYNC:{$syncId}] Trace: " . $e->getTraceAsString());
                            throw $e;
                        }
                    }

                    // Si tout s'est bien passé, on commit cette transaction individuelle
                    DB::commit();
                    Log::info("[SYNC:{$syncId}] Élément #{$itemId} traité avec succès");

                } catch (\Exception $e) {
                    // Rollback uniquement pour cet élément
                    DB::rollBack();

                    // Capturer l'erreur pour cet élément spécifique
                    $errorMsg = "[SYNC:{$syncId}] Erreur lors de la synchronisation de l'élément #{$itemId}: " . $e->getMessage();
                    Log::error($errorMsg);
                    Log::error("[SYNC:{$syncId}] Trace: " . $e->getTraceAsString());

                    $errors[$itemId] = $e->getMessage();

                    // Si c'est une erreur de validation, ajouter plus de détails
                    if ($e instanceof ValidationException) {
                        Log::error("[SYNC:{$syncId}] Erreurs de validation: " . json_encode($e->errors()));
                    }
                }
            }

            Log::info("[SYNC:{$syncId}] Synchronisation terminée: " . count($results) . " succès, " . count($errors) . " échecs");

            return response()->json([
                'success' => count($results) > 0,
                'message' => count($results) . ' collecte(s) synchronisée(s) avec succès',
                'results' => $results,
                'errors' => $errors,
                'sync_id' => $syncId
            ]);

        } catch (\Exception $e) {
            $syncId = $syncId ?? uniqid('sync_error_');
            Log::error("[SYNC:{$syncId}] Erreur globale de synchronisation: " . $e->getMessage());
            Log::error("[SYNC:{$syncId}] Trace: " . $e->getTraceAsString());

            if ($e instanceof ValidationException) {
                Log::error("[SYNC:{$syncId}] Erreurs de validation: " . json_encode($e->errors()));
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur de validation lors de la synchronisation',
                    'errors' => $e->errors(),
                    'sync_id' => $syncId
                ], 422);
            }

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la synchronisation: ' . $e->getMessage(),
                'errors' => ['general' => $e->getMessage()],
                'sync_id' => $syncId
            ], 500);
        }
    }

    /**
     * Vérifier si une collecte existe en base de données
     */
    public function verify($id)
    {
        try {
            $exists = Collecte::where('id', $id)->exists();
            return response()->json(['exists' => $exists, 'status' => 'success']);
        } catch (\Exception $e) {
            Log::error("Erreur lors de la vérification de la collecte #{$id}: " . $e->getMessage());
            return response()->json([
                'exists' => false,
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Méthode helper pour récupérer les informations sur la table collectes
     */
    public function getTableInfo()
    {
        try {
            // Récupérer les noms des colonnes
            $columns = Schema::getColumnListing('collectes');

            // Récupérer les détails des colonnes via une requête directe
            $columnDetails = DB::select('SHOW COLUMNS FROM collectes');

            // Formater les informations
            $tableInfo = [
                'columns' => $columns,
                'details' => $columnDetails
            ];

            return response()->json([
                'status' => 'success',
                'table_info' => $tableInfo
            ]);
        } catch (\Exception $e) {
            Log::error("Erreur lors de la récupération des informations de la table collectes: " . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
