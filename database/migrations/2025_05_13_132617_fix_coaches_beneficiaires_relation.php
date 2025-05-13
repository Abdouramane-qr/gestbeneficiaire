<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\Beneficiaire;
use App\Models\Coach;

class FixCoachesBeneficiairesRelation extends Migration
{
    public function up()
    {
        // Créer une solution temporaire pour identifier les bénéficiaires problématiques
        $beneficiaires = Beneficiaire::all();
        $problematicCount = 0;

        foreach ($beneficiaires as $beneficiaire) {
            try {
                $coaches = $beneficiaire->coaches;

                // Si coaches est un entier ou un nombre, le convertir en relation
                if (is_int($coaches) || is_numeric($coaches)) {
                    $coachId = (int)$coaches;

                    // Vérifier si le coach existe
                    $coachExists = Coach::where('id', $coachId)->exists();

                    if ($coachExists) {
                        // Vérifier si la relation existe déjà
                        $relationExists = DB::table('coach_beneficiaires')
                            ->where('coach_id', $coachId)
                            ->where('beneficiaires_id', $beneficiaire->id)
                            ->exists();

                        if (!$relationExists) {
                            // Ajouter la relation
                            DB::table('coach_beneficiaires')->insert([
                                'coach_id' => $coachId,
                                'beneficiaires_id' => $beneficiaire->id,
                                'date_affectation' => now(),
                                'est_actif' => true,
                                'created_at' => now(),
                                'updated_at' => now()
                            ]);

                            $problematicCount++;
                        }
                    }
                }
            } catch (\Exception $e) {
                Log::error('Erreur lors du traitement du bénéficiaire ' . $beneficiaire->id, [
                    'message' => $e->getMessage()
                ]);
            }
        }

        Log::info("{$problematicCount} relations coach-bénéficiaire ont été corrigées");
        echo "{$problematicCount} relations coach-bénéficiaire ont été corrigées" . PHP_EOL;
    }

    public function down()
    {
        // Rien à annuler
    }
}
