<?php

namespace App\Services;

use App\Models\Collect;
use App\Models\Indicator;

class CollectService
{
    public function createFromIndicator(Indicator $indicator, array $data): Collect
    {
        return $indicator->collects()->create([
            'entreprise_id' => $indicator->entreprise_id,
            'frequency_id' => $indicator->frequency_id,
            'data' => $data['data'],
            'status' => $data['status']
        ]);
    }

    public function updateCollectData(Collect $collect, array $data): Collect
    {
        $collect->update($data);
        return $collect->fresh();
    }

    public function getDefaultDataForType(string $type): array
    {
        return match($type) {
            Indicator::TYPE_ACTIVITY => [
                'nombre_cycles_production' => 0,
                'nombre_clients' => 0,
                'quantite_produite' => 0,
                'heures_travail' => 0
            ],
            
            default => []
        };
    }
}
