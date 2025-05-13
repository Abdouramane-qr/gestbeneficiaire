<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Illuminate\Support\Facades\Log;

class MultiSheetIndicateursExport implements WithMultipleSheets
{
    protected $data;

    public function __construct(array $data)
    {
        $this->data = $data;
    }

    public function sheets(): array
    {
        $sheets = [];

        try {
            foreach ($this->data as $sheetName => $sheetData) {
                if (empty($sheetData['data'])) {
                    continue;
                }

                $sheets[] = new SimpleIndicateursExport(
                    $sheetData['data'],
                    $sheetData['headers'],
                    $sheetName
                );
            }

            // Assurer qu'il y a au moins une feuille
            if (empty($sheets)) {
                $sheets[] = new SimpleIndicateursExport(
                    [['message' => 'Aucune donnée disponible']],
                    ['Message'],
                    'Données vides'
                );
            }
        } catch (\Exception $e) {
            Log::error('Erreur dans MultiSheetIndicateursExport::sheets', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            $sheets[] = new SimpleIndicateursExport(
                [['erreur' => $e->getMessage(), 'timestamp' => now()->toDateTimeString()]],
                ['Erreur', 'Date et heure'],
                'Erreur'
            );
        }

        return $sheets;
    }
}
