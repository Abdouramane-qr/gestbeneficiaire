<?php

namespace App\Strategies;

use Illuminate\Support\Facades\Log;

class DefaultPeriodeStrategy extends AbstractPeriodeStrategy
{
    public function getValeurPrecedente(string $indicateurId, int $exerciceId, ?int $entrepriseId): ?float
    {
        Log::warning('Aucune stratégie spécifique pour la période, utilisation de la valeur par défaut');
        return null;
    }
}
