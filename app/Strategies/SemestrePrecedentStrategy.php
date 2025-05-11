<?php

namespace App\Strategies;

use App\Models\Collecte;
use App\Models\Exercice;
use Illuminate\Support\Facades\Log;

class SemestrePrecedentStrategy extends AbstractPeriodeStrategy
{
    public function getValeurPrecedente(string $indicateurId, int $exerciceId, ?int $entrepriseId): ?float
    {
        // Débug pour voir quelle collecte est actuellement traitée
        Log::info('SemestrePrecedentStrategy recherche valeur précédente', [
            'indicateur' => $indicateurId,
            'exercice_id' => $exerciceId,
            'entreprise_id' => $entrepriseId
        ]);

        // Obtenir la collecte semestrielle actuelle
        $query = Collecte::query()
            ->where('exercice_id', $exerciceId)
            ->when($entrepriseId, fn($q) => $q->where('entreprise_id', $entrepriseId));

        // Utiliser des wildcards correspondant à vos formats spécifiques
        $query->where(function($q) {
            $q->where('periode', 'like', '%Semestre%')
              ->orWhere('periode', 'like', '%semestre%')
              ->orWhere('periode', 'like', '%semestriel%')
              ->orWhere('periode', 'like', '%S1/%')
              ->orWhere('periode', 'like', '%S2/%')
              ->orWhere('type_periode', 'semestriel'); // Si vous avez une colonne type_periode
        });

        $collecteActuelle = $query->latest('date_collecte')->first();

        // Débug pour voir si on a trouvé une collecte actuelle
        Log::info('Collecte semestrielle actuelle', [
            'trouvée' => $collecteActuelle ? 'Oui' : 'Non',
            'id' => $collecteActuelle?->id,
            'periode' => $collecteActuelle?->periode,
            'date_collecte' => $collecteActuelle?->date_collecte
        ]);

        if (!$collecteActuelle) {
            return null;
        }

        // Extraire le semestre actuel - vérifier vos formats spécifiques
        $semestreActuel = $this->extraireSemestre($collecteActuelle->periode);

        Log::info('Semestre extrait', [
            'periode_originale' => $collecteActuelle->periode,
            'semestre_extrait' => $semestreActuel
        ]);

        if (!$semestreActuel) {
            // Tentative avec le numéro directement (si type_periode existe et que vous avez une colonne numero)
            if (isset($collecteActuelle->numero) && $collecteActuelle->numero) {
                $semestreActuel = (int) $collecteActuelle->numero;
                Log::info('Semestre extrait depuis numero', ['semestre' => $semestreActuel]);
            } else {
                return null;
            }
        }

        // Logique pour trouver le semestre précédent
        if ($semestreActuel === 1) {
            // Si S1, chercher S2 de l'exercice précédent
            $exercicePrecedent = Exercice::where('annee', '<', Exercice::find($exerciceId)?->annee)
                ->latest('annee')
                ->first();

            if (!$exercicePrecedent) {
                Log::warning('Pas d\'exercice précédent trouvé', [
                    'exercice_id_actuel' => $exerciceId
                ]);
                return null;
            }

            $collectePrecedenteQuery = Collecte::query()
                ->where('exercice_id', $exercicePrecedent->id)
                ->when($entrepriseId, fn($q) => $q->where('entreprise_id', $entrepriseId))
                ->where(function($q) {
                    $q->where('periode', 'like', '%S2/%')
                      ->orWhere('periode', 'like', '%Semestre 2%')
                      ->orWhere('periode', 'like', '%2e Semestre%')
                      ->orWhere('periode', 'like', '%2ème Semestre%');
                });

            // Si vous avez une colonne numero
            if (isset($collecteActuelle->numero)) {
                $collectePrecedenteQuery->orWhere(function($q) {
                    $q->where('type_periode', 'semestriel')
                      ->where('numero', 2);
                });
            }

            $collectePrecedente = $collectePrecedenteQuery->latest('date_collecte')->first();

            Log::info('Recherche de la collecte S2 de l\'exercice précédent', [
                'exercice_precedent_id' => $exercicePrecedent->id,
                'query_sql' => $collectePrecedenteQuery->toSql(),
                'query_bindings' => $collectePrecedenteQuery->getBindings(),
                'trouvee' => $collectePrecedente ? 'Oui' : 'Non'
            ]);
        } else {
            // Si S2, chercher S1 dans le même exercice
            $collectePrecedenteQuery = Collecte::query()
                ->where('exercice_id', $exerciceId)
                ->when($entrepriseId, fn($q) => $q->where('entreprise_id', $entrepriseId))
                ->where(function($q) {
                    $q->where('periode', 'like', '%S1/%')
                      ->orWhere('periode', 'like', '%Semestre 1%')
                      ->orWhere('periode', 'like', '%1er Semestre%');
                });

            // Si vous avez une colonne numero
            if (isset($collecteActuelle->numero)) {
                $collectePrecedenteQuery->orWhere(function($q) {
                    $q->where('type_periode', 'semestriel')
                      ->where('numero', 1);
                });
            }

            $collectePrecedente = $collectePrecedenteQuery->latest('date_collecte')->first();

            Log::info('Recherche de la collecte S1 du même exercice', [
                'exercice_id' => $exerciceId,
                'query_sql' => $collectePrecedenteQuery->toSql(),
                'query_bindings' => $collectePrecedenteQuery->getBindings(),
                'trouvee' => $collectePrecedente ? 'Oui' : 'Non'
            ]);
        }

        // Si toujours pas de collecte, essayer une approche plus directe par date
        if (!isset($collectePrecedente) || !$collectePrecedente) {
            Log::info('Pas de collecte précédente trouvée par période, essai par date');

            $collectePrecedente = Collecte::query()
                ->where('exercice_id', $exerciceId)
                ->when($entrepriseId, fn($q) => $q->where('entreprise_id', $entrepriseId))
                ->where('date_collecte', '<', $collecteActuelle->date_collecte)
                ->where(function($q) {
                    $q->where('periode', 'like', '%Semestre%')
                      ->orWhere('periode', 'like', '%semestre%')
                      ->orWhere('periode', 'like', '%semestriel%')
                      ->orWhere('periode', 'like', '%S1/%')
                      ->orWhere('periode', 'like', '%S2/%')
                      ->orWhere('type_periode', 'semestriel');
                })
                ->latest('date_collecte')
                ->first();

            if ($collectePrecedente) {
                Log::info('Collecte précédente trouvée par date', [
                    'id' => $collectePrecedente->id,
                    'periode' => $collectePrecedente->periode,
                    'date_collecte' => $collectePrecedente->date_collecte
                ]);
            }
        }

        $valeur = $this->extraireValeurIndicateur($collectePrecedente, $indicateurId);

        // Débug final pour voir quelle valeur on retourne
        Log::info('Valeur précédente pour semestre', [
            'trouvée' => $valeur !== null ? 'Oui' : 'Non',
            'valeur' => $valeur
        ]);

        return $valeur;
    }

    private function extraireSemestre(string $periode): ?int
    {
        // Format "S1/26" or "S2/26"
        if (preg_match('/\bS([1-2])\//i', $periode, $matches)) {
            return (int) $matches[1];
        }

        // Format "1er Semestre"
        if (preg_match('/\b1er\s+Semestre\b/i', $periode)) {
            return 1;
        }

        // Format "Semestre 1" ou "Semestre 2"
        if (preg_match('/\bSemestre\s+([1-2])\b/i', $periode, $matches)) {
            return (int) $matches[1];
        }

        // Si le texte contient "semestre" et "1" ou "2"
        if (stripos($periode, 'semestre') !== false) {
            if (strpos($periode, '1') !== false) {
                return 1;
            }
            if (strpos($periode, '2') !== false) {
                return 2;
            }
        }

        // Si le format contient simplement "S1" ou "S2"
        if (preg_match('/\bS([1-2])\b/i', $periode, $matches)) {
            return (int) $matches[1];
        }

        Log::warning("Impossible d'extraire le semestre de la période", [
            'periode' => $periode
        ]);

        return null;
    }
}
