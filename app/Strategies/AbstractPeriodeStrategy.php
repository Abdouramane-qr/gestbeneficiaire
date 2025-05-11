<?php

namespace App\Strategies;

use App\Models\Collecte;
use Illuminate\Support\Facades\Log;

abstract class AbstractPeriodeStrategy implements PeriodeStrategyInterface
{
    protected function extraireValeurIndicateur(?Collecte $collecte, string $indicateurId): ?float
    {
        if (!$collecte) {
            return null;
        }

        $donnees = $this->normaliseDonnees($collecte->donnees);

        // Chercher dans toutes les catégories
        foreach ($donnees as $categorie => $indicateurs) {
            if (isset($indicateurs[$indicateurId]) && is_numeric($indicateurs[$indicateurId])) {
                Log::info('Valeur trouvée', [
                    'collecte_id' => $collecte->id,
                    'indicateur' => $indicateurId,
                    'valeur' => $indicateurs[$indicateurId],
                    'categorie' => $categorie
                ]);
                return (float) $indicateurs[$indicateurId];
            }
        }

        return null;
    }

    protected function normaliseDonnees($donnees): array
    {
        if (is_string($donnees)) {
            try {
                return json_decode($donnees, true, 512, JSON_THROW_ON_ERROR);
            } catch (\JsonException $e) {
                Log::error('Erreur de décodage JSON', ['error' => $e->getMessage()]);
                return [];
            }
        }

        return is_array($donnees) ? $donnees : [];
    }
}
