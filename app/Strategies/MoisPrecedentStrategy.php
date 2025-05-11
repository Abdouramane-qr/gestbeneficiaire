<?php

namespace App\Strategies;

use App\Models\Collecte;
use App\Models\Exercice;

class MoisPrecedentStrategy extends AbstractPeriodeStrategy
{
    private const MOIS_MAP = [
        'Janvier' => 'Décembre',
        'Février' => 'Janvier',
        'Mars' => 'Février',
        'Avril' => 'Mars',
        'Mai' => 'Avril',
        'Juin' => 'Mai',
        'Juillet' => 'Juin',
        'Août' => 'Juillet',
        'Septembre' => 'Août',
        'Octobre' => 'Septembre',
        'Novembre' => 'Octobre',
        'Décembre' => 'Novembre'
    ];

    public function getValeurPrecedente(string $indicateurId, int $exerciceId, ?int $entrepriseId): ?float
    {
        // Obtenir la collecte mensuelle actuelle
        $collecteActuelle = Collecte::where('exercice_id', $exerciceId)
            ->when($entrepriseId, fn($q) => $q->where('entreprise_id', $entrepriseId))
            ->where('periode', 'like', '%Mensuelle%')
            ->latest('date_collecte')
            ->first();

        if (!$collecteActuelle) {
            return null;
        }

        // Extraire le mois actuel de la période
        $moisActuel = $this->extraireMois($collecteActuelle->periode);
        if (!$moisActuel) {
            return null;
        }

        // Déterminer le mois précédent
        $moisPrecedent = self::MOIS_MAP[$moisActuel] ?? null;
        if (!$moisPrecedent) {
            return null;
        }

        // Si on est en janvier, chercher décembre de l'exercice précédent
        if ($moisActuel === 'Janvier') {
            $exercicePrecedent = Exercice::where('annee', '<', Exercice::find($exerciceId)?->annee)
                ->latest('annee')
                ->first();

            if (!$exercicePrecedent) {
                return null;
            }

            $collectePrecedente = Collecte::where('exercice_id', $exercicePrecedent->id)
                ->when($entrepriseId, fn($q) => $q->where('entreprise_id', $entrepriseId))
                ->where('periode', 'like', '%Décembre%')
                ->latest('date_collecte')
                ->first();
        } else {
            // Chercher le mois précédent dans le même exercice
            $collectePrecedente = Collecte::where('exercice_id', $exerciceId)
                ->when($entrepriseId, fn($q) => $q->where('entreprise_id', $entrepriseId))
                ->where('periode', 'like', '%' . $moisPrecedent . '%')
                ->latest('date_collecte')
                ->first();
        }

        return $this->extraireValeurIndicateur($collectePrecedente, $indicateurId);
    }

    private function extraireMois(string $periode): ?string
    {
        foreach (array_keys(self::MOIS_MAP) as $mois) {
            if (str_contains($periode, $mois)) {
                return $mois;
            }
        }
        return null;
    }
}
