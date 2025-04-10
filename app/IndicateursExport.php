<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class IndicateursExport implements FromCollection, WithHeadings, WithMapping
{
    protected $indicateurs;

    public function __construct($indicateurs)
    {
        $this->indicateurs = $indicateurs;
    }

    public function collection()
    {
        return $this->indicateurs;
    }

    public function headings(): array
    {
        return [
            'ID',
            'Catégorie',
            'Nom',
            'Valeur',
            'Région',
            'Province',
            'Commune',
            'Type de bénéficiaire',
            'Genre',
            'Niveau d\'instruction',
            'Type d\'activité',
            'Niveau de développement',
            'Créé le'
        ];
    }

    public function map($indicateur): array
    {
        return [
            $indicateur->id,
            $indicateur->categorie,
            $indicateur->nom,
            $indicateur->valeur,
            $indicateur->region,
            $indicateur->province,
            $indicateur->commune,
            $indicateur->type_beneficiaire,
            $indicateur->genre,
            $indicateur->niveau_instruction,
            $indicateur->type_activite,
            $indicateur->niveau_developpement,
            $indicateur->created_at
        ];
    }
}
