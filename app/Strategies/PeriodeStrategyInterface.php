<?php

namespace App\Strategies;

interface PeriodeStrategyInterface
{
    public function getValeurPrecedente(string $indicateurId, int $exerciceId, ?int $entrepriseId): ?float;
}
