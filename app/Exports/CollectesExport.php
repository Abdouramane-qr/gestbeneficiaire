<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class CollectesExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithTitle, ShouldAutoSize
{
    protected $collectes;

    public function __construct($collectes)
    {
        $this->collectes = $collectes;
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return $this->collectes;
    }

    /**
     * @return array
     */
    public function headings(): array
    {
        return [
            'ID',
            'Entreprise',
            'Exercice',
            'Période',
            'Date de collecte',
            'Type',
            'Collecté par',
            'Date de création',
            'Dernière modification',
        ];
    }

    /**
     * @param mixed $row
     * @return array
     */
    public function map($collecte): array
    {
        return [
            $collecte->id,
            $collecte->entreprise->nom_entreprise,
            $collecte->exercice?->annee,
            $this->formatPeriode($collecte->periode), // Utilisation d'une méthode auxiliaire
            $collecte->date_collecte->format('d/m/Y'),
            $collecte->type_collecte === 'brouillon' ? 'Brouillon' : 'Standard',
            $collecte->user ? $collecte->user->name : 'Non spécifié',
            $collecte->created_at->format('d/m/Y H:i'),
            $collecte->updated_at->format('d/m/Y H:i'),
        ];
    }


    private function formatPeriode($periode)
{
    if (empty($periode)) {
        return 'Non spécifié';
    }

    if (is_string($periode)) {
        return $periode; // Retourne la chaîne telle quelle (ex: 'Occasionnelle')
    }

    // Si c'est un objet, accéder à ses propriétés
    if (is_object($periode)) {
        return $periode->nom ?? $periode->type_periode ?? 'Non spécifié';
    }

    return 'Non spécifié';
}
    /**
     * Styles pour le document Excel
     */
    public function styles(Worksheet $sheet)
    {
        return [
            // Style pour l'en-tête
            1 => [
                'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => ['fillType' => 'solid', 'color' => ['rgb' => '4F81BD']],
                'alignment' => ['horizontal' => 'center'],
            ],
            // Style alterné pour les lignes
            'A2:I'.$this->collectes->count()+1 => [
                'alignment' => ['horizontal' => 'left'],
            ],
        ];
    }

    /**
     * Titre de la feuille
     */
    public function title(): string
    {
        return 'Liste des collectes';
    }
}
