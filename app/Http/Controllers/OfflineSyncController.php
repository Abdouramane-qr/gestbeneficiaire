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
     * Synchroniser les données collectées hors ligne
     */
    public function syncOfflineData(Request $request)
    {
        try {
            // Validation plus flexible pour gérer différents types de données
            $validated = $request->validate([
                'synced_data' => 'required|array',
                'synced_data.*.entreprise_id' => 'required|exists:entreprises,id',
                'synced_data.*.exercice_id' => 'required|exists:exercices,id',
                'synced_data.*.periode_id' => 'required', // Peut être 'exceptionnel' ou un ID
                'synced_data.*.date_collecte' => 'required|date',
                'synced_data.*.donnees' => 'required|array',
                'synced_data.*.type_collecte' => 'required|in:standard,brouillon',
                'synced_data.*.id' => 'required|integer', // ID local pour suivi
            ]);

            $syncedData = $validated['synced_data'];
            $results = [];
            $errors = [];

            DB::beginTransaction();

            foreach ($syncedData as $index => $data) {
                try {
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
                        $existingCollecte->update([
                            'exercice_id' => $data['exercice_id'],
                            'date_collecte' => Carbon::parse($data['date_collecte']),
                            'donnees' => $data['donnees'],
                            'user_id' => Auth::id(),
                        ]);

                        $results[] = [
                            'local_id' => $data['id'],
                            'remote_id' => $existingCollecte->id,
                            'status' => 'updated'
                        ];
                    } else {
                        // Créer une nouvelle collecte
                        $collecte = Collecte::create([
                            'entreprise_id' => $data['entreprise_id'],
                            'exercice_id' => $data['exercice_id'],
                            'periode_id' => $data['periode_id'],
                            'date_collecte' => Carbon::parse($data['date_collecte']),
                            'donnees' => $data['donnees'],
                            'type_collecte' => $data['type_collecte'],
                            'user_id' => Auth::id(),
                        ]);

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

                    $errors[$data['id']] = $e->getMessage();

                    // Si c'est une erreur de validation, ajouter plus de détails
                    if ($e instanceof ValidationException) {
                        Log::error('Erreurs de validation: ' . json_encode($e->errors()));
                    }
                }
            }

            DB::commit();

            return response()->json([
                'success' => count($results) > 0,
                'message' => count($results) . ' collecte(s) synchronisée(s) avec succès',
                'results' => $results,
                'errors' => $errors
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur globale de synchronisation: ' . $e->getMessage());

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
}
