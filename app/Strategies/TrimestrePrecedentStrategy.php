<?php

namespace App\Strategies;

use App\Models\Collecte;
use App\Models\Exercice;
use Illuminate\Support\Facades\Log;

class TrimestrePrecedentStrategy extends AbstractPeriodeStrategy
{
    public function getValeurPrecedente(string $indicateurId, int $exerciceId, ?int $entrepriseId): ?float
    {
        // Débug pour voir quelle collecte est actuellement traitée
        Log::info('TrimestrePrecedentStrategy recherche valeur précédente', [
            'indicateur' => $indicateurId,
            'exercice_id' => $exerciceId,
            'entreprise_id' => $entrepriseId
        ]);

        // Obtenir la collecte trimestrielle actuelle
        $query = Collecte::query()
            ->where('exercice_id', $exerciceId)
            ->when($entrepriseId, fn($q) => $q->where('entreprise_id', $entrepriseId));

        // Utiliser des wildcards correspondant à vos formats spécifiques
        $query->where(function($q) {
            $q->where('periode', 'like', '%Trimestre%')
              ->orWhere('periode', 'like', '%trimestre%')
              ->orWhere('periode', 'like', '%trimestriel%')
              ->orWhere('periode', 'like', '%T1/%')
              ->orWhere('periode', 'like', '%T2/%')
              ->orWhere('periode', 'like', '%T3/%')
              ->orWhere('periode', 'like', '%T4/%')
              ->orWhere('type_periode', 'trimestriel'); // Si vous avez une colonne type_periode
        });

        $collecteActuelle = $query->latest('date_collecte')->first();

        // Débug pour voir si on a trouvé une collecte actuelle
        Log::info('Collecte trimestrielle actuelle', [
            'trouvée' => $collecteActuelle ? 'Oui' : 'Non',
            'id' => $collecteActuelle?->id,
            'periode' => $collecteActuelle?->periode,
            'date_collecte' => $collecteActuelle?->date_collecte
        ]);

        if (!$collecteActuelle) {
            return null;
        }

        // Extraire le trimestre actuel
        $trimestreActuel = $this->extraireTrimestre($collecteActuelle->periode);

        Log::info('Trimestre extrait', [
            'periode_originale' => $collecteActuelle->periode,
            'trimestre_extrait' => $trimestreActuel
        ]);

        if (!$trimestreActuel) {
            // Tentative avec le numéro directement (si type_periode existe et que vous avez une colonne numero)
            if (isset($collecteActuelle->numero) && $collecteActuelle->numero) {
                $trimestreActuel = (int) $collecteActuelle->numero;
                Log::info('Trimestre extrait depuis numero', ['trimestre' => $trimestreActuel]);
            } else {
                return null;
            }
        }

        // Logique pour trouver le trimestre précédent
        if ($trimestreActuel === 1) {
            // Si T1, chercher T4 de l'exercice précédent
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
                    $q->where('periode', 'like', '%T4/%')
                      ->orWhere('periode', 'like', '%Trimestre 4%')
                      ->orWhere('periode', 'like', '%4e Trimestre%')
                      ->orWhere('periode', 'like', '%4ème Trimestre%');
                });

            // Si vous avez une colonne numero
            if (isset($collecteActuelle->numero)) {
                $collectePrecedenteQuery->orWhere(function($q) {
                    $q->where('type_periode', 'trimestriel')
                      ->where('numero', 4);
                });
            }

            $collectePrecedente = $collectePrecedenteQuery->latest('date_collecte')->first();

            Log::info('Recherche de la collecte T4 de l\'exercice précédent', [
                'exercice_precedent_id' => $exercicePrecedent->id,
                'query_sql' => $collectePrecedenteQuery->toSql(),
                'query_bindings' => $collectePrecedenteQuery->getBindings(),
                'trouvee' => $collectePrecedente ? 'Oui' : 'Non'
            ]);
        } else {
            // Chercher le trimestre précédent dans le même exercice
            $trimestrePrecedent = $trimestreActuel - 1;

            $collectePrecedenteQuery = Collecte::query()
                ->where('exercice_id', $exerciceId)
                ->when($entrepriseId, fn($q) => $q->where('entreprise_id', $entrepriseId));

            // Construction des patterns de recherche
            $patterns = [
                'T' . $trimestrePrecedent . '/',
                'Trimestre ' . $trimestrePrecedent,
                $trimestrePrecedent . 'e Trimestre'
            ];

            $collectePrecedenteQuery->where(function($q) use ($patterns) {
                foreach ($patterns as $index => $pattern) {
                    if ($index === 0) {
                        $q->where('periode', 'like', '%' . $pattern . '%');
                    } else {
                        $q->orWhere('periode', 'like', '%' . $pattern . '%');
                    }
                }
            });

            // Si vous avez une colonne numero
            if (isset($collecteActuelle->numero)) {
                $collectePrecedenteQuery->orWhere(function($q) use ($trimestrePrecedent) {
                    $q->where('type_periode', 'trimestriel')
                      ->where('numero', $trimestrePrecedent);
                });
            }

            $collectePrecedente = $collectePrecedenteQuery->latest('date_collecte')->first();

            Log::info('Recherche de la collecte T' . $trimestrePrecedent . ' du même exercice', [
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
                    $q->where('periode', 'like', '%Trimestre%')
                      ->orWhere('periode', 'like', '%trimestre%')
                      ->orWhere('periode', 'like', '%trimestriel%')
                      ->orWhere('periode', 'like', '%T1/%')
                      ->orWhere('periode', 'like', '%T2/%')
                      ->orWhere('periode', 'like', '%T3/%')
                      ->orWhere('periode', 'like', '%T4/%')
                      ->orWhere('type_periode', 'trimestriel');
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
        Log::info('Valeur précédente pour trimestre', [
            'trouvée' => $valeur !== null ? 'Oui' : 'Non',
            'valeur' => $valeur
        ]);

        return $valeur;
    }

    private function extraireTrimestre(string $periode): ?int
    {
        // Format "T1/26" ou "T3/26"
        if (preg_match('/\bT([1-4])\//i', $periode, $matches)) {
            return (int) $matches[1];
        }

        // Format "3e Trimestre"
        if (preg_match('/\b([1-4])e\s+Trimestre\b/i', $periode, $matches)) {
            return (int) $matches[1];
        }

        // Format "Trimestre 3"
        if (preg_match('/\bTrimestre\s+([1-4])\b/i', $periode, $matches)) {
            return (int) $matches[1];
        }

        // Si le texte contient "trimestre" et un chiffre de 1 à 4
        if (stripos($periode, 'trimestre') !== false) {
            for ($i = 1; $i <= 4; $i++) {
                if (strpos($periode, (string)$i) !== false) {
                    return $i;
                }
            }
        }

        // Si le format contient simplement "T1", "T2", etc.
        if (preg_match('/\bT([1-4])\b/i', $periode, $matches)) {
            return (int) $matches[1];
        }

        Log::warning("Impossible d'extraire le trimestre de la période", [
            'periode' => $periode
        ]);

        return null;
    }
}
