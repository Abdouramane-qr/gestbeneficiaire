<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Illuminate\Support\Collection;

class CollecteDetailExport implements FromCollection, WithTitle, WithStyles, ShouldAutoSize
{
    protected $collecte;
    protected $categoriesDisponibles;

    public function __construct($collecte, $categoriesDisponibles)
    {
        $this->collecte = $collecte;
        $this->categoriesDisponibles = $categoriesDisponibles;
    }

    public function collection()
    {
        $data = collect();

        // Informations générales
        $data->push(['Détail de collecte']);
        $data->push(['']);
        $data->push(['Entreprise', $this->collecte->entreprise->nom_entreprise]);
        $data->push(['Exercice', $this->collecte->exercice->annee]);

        // Gestion de la période (objet ou chaîne)
        $periodeName = 'Non spécifié';
        if (is_object($this->collecte->periode)) {
            $periodeName = $this->collecte->periode->type_periode;
        } elseif (is_string($this->collecte->periode)) {
            $periodeName = $this->collecte->periode;
        }
        $data->push(['Période', $periodeName]);

        $data->push(['Date de collecte', $this->collecte->date_collecte->format('d/m/Y')]);
        $data->push(['Type', $this->collecte->type_collecte === 'brouillon' ? 'Brouillon' : 'Standard']);
        $data->push(['Créé par', $this->collecte->user ? $this->collecte->user->name : 'Non spécifié']);
        $data->push(['Créé le', $this->collecte->created_at->format('d/m/Y H:i')]);
        $data->push(['']);

        // Pour chaque catégorie, ajouter un titre et les données
        foreach ($this->categoriesDisponibles as $category) {
            if (isset($this->collecte->donnees[$category]) && count($this->collecte->donnees[$category]) > 0) {
                // Titre de la catégorie
                $categoryName = match($category) {
                    'financier' => 'Indicateurs Financiers',
                    'commercial' => 'Indicateurs Commerciaux',
                    'production' => 'Production',
                    'rh' => 'Ressources Humaines',
                    'tresorerie' => 'Trésorerie',
                    default => ucfirst($category)
                };

                $data->push([$categoryName]);
                $data->push(['Indicateur', 'Valeur']);

                // Données de la catégorie
                foreach ($this->collecte->donnees[$category] as $key => $value) {
                    // Formatage des valeurs numériques
                    if (is_numeric($value)) {
                        $formattedValue = number_format($value, 2, ',', ' ');
                    } else {
                        $formattedValue = $value;
                    }

                    $data->push([$key, $formattedValue]);
                }

                $data->push(['']); // Ligne vide entre les catégories
            }
        }

        return $data;
    }

    public function title(): string
    {
        return 'Détail de collecte';
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true, 'size' => 16]],
            3 => ['font' => ['bold' => true]], // Entreprise
            4 => ['font' => ['bold' => true]], // Exercice
            5 => ['font' => ['bold' => true]], // Période
            6 => ['font' => ['bold' => true]], // Date
            7 => ['font' => ['bold' => true]], // Type
            8 => ['font' => ['bold' => true]], // Créé par
            9 => ['font' => ['bold' => true]], // Créé le
        ];
    }
}
