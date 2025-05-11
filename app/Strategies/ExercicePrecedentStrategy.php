<?php

namespace App\Strategies;

use App\Models\Collecte;
use App\Models\Exercice;

class ExercicePrecedentStrategy extends AbstractPeriodeStrategy
{
    public function getValeurPrecedente(string $indicateurId, int $exerciceId, ?int $entrepriseId): ?float
    {
        // Trouver l'exercice précédent
        $exerciceActuel = Exercice::find($exerciceId);
        if (!$exerciceActuel) {
            return null;
        }

        $exercicePrecedent = Exercice::where('annee', '<', $exerciceActuel->annee)
            ->latest('annee')
            ->first();

        if (!$exercicePrecedent) {
            return null;
        }

        // Chercher la collecte annuelle de l'exercice précédent
        $collectePrecedente = Collecte::where('exercice_id', $exercicePrecedent->id)
            ->when($entrepriseId, fn($q) => $q->where('entreprise_id', $entrepriseId))
            ->where('periode', 'like', '%Annuelle%')
            ->latest('date_collecte')
            ->first();

        return $this->extraireValeurIndicateur($collectePrecedente, $indicateurId);
    }
}
