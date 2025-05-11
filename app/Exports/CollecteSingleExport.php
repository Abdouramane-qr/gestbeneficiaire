<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class CollecteSingleExport implements FromArray, WithHeadings, WithStyles, WithTitle, ShouldAutoSize
{
    protected $collecte;
    protected $categories;

    public function __construct($collecte, $categories)
    {
        $this->collecte = $collecte;
        $this->categories = $categories;
    }

    public function array(): array
    {
        $data = [];

        foreach ($this->categories as $categorie) {
            $data[] = [
                'Catégorie' => $categorie->nom,
                'Valeur' => $this->collecte[$categorie->slug] ?? 'N/A',
            ];
        }

        return $data;
    }

    public function headings(): array
    {
        return ['Catégorie', 'Valeur'];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => [ // Ligne d'en-tête
                'font' => ['bold' => true],
                'alignment' => ['horizontal' => 'center'],
            ],
        ];
    }

    public function title(): string
    {
        return 'Données collecte';
    }
}
