<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Illuminate\Support\Collection;

class CollecteIndicatorsExport implements FromCollection, WithHeadings, WithMapping
{
    protected $collectes;
    protected $categoriesDisponibles;

    public function __construct($collectes, $categoriesDisponibles = [])
    {
        $this->collectes = $collectes;
        $this->categoriesDisponibles = $categoriesDisponibles;
    }

    /**
     * Retourne la collection de données à exporter.
     */
    public function collection()
    {
        return $this->collectes instanceof Collection ? $this->collectes : collect($this->collectes);
    }

    /**
     * Définit les en-têtes des colonnes.
     */
    public function headings(): array
    {
        // En-têtes de base pour les informations de la collecte
        $baseHeadings = [
            'ID Collecte',
            'Entreprise',
            'Exercice',
            'Période',
            'Date Collecte',
            'Type Collecte',
            'Créée par',
            'Créée le',
        ];

        // Récupérer tous les indicateurs uniques à partir des catégories
        $indicateurs = [];
        foreach ($this->categoriesDisponibles as $category) {
            foreach ($this->collectes as $collecte) {
                if (isset($collecte->donnees[$category])) {
                    foreach ($collecte->donnees[$category] as $key => $value) {
                        // Ajouter l'indicateur avec la catégorie comme préfixe pour éviter les conflits
                        $indicateurLabel = "{$category}_{$key}";
                        if (!in_array($indicateurLabel, $indicateurs)) {
                            $indicateurs[] = $indicateurLabel;
                        }
                    }
                }
            }
        }

        return array_merge($baseHeadings, $indicateurs);
    }

    /**
     * Mappe chaque collecte à une ligne dans le fichier Excel.
     */
    public function map($collecte): array
    {
        // Données de base de la collecte
        $row = [
            $collecte->id,
            $collecte->entreprise->nom_entreprise ?? 'N/A',
            $collecte->exercice->annee ?? 'N/A',
            $collecte->periode->type_periode ?? 'N/A',
            $collecte->date_collecte ? \Carbon\Carbon::parse($collecte->date_collecte)->format('d/m/Y') : 'N/A',
            $collecte->type_collecte,
            $collecte->user->name ?? 'N/A',
            $collecte->created_at ? \Carbon\Carbon::parse($collecte->created_at)->format('d/m/Y H:i') : 'N/A',
        ];

        // Ajouter les valeurs des indicateurs
        $indicateurs = [];
        foreach ($this->categoriesDisponibles as $category) {
            foreach ($this->collectes as $c) {
                if (isset($c->donnees[$category])) {
                    foreach ($c->donnees[$category] as $key => $value) {
                        $indicateurLabel = "{$category}_{$key}";
                        if (!isset($indicateurs[$indicateurLabel])) {
                            $indicateurs[$indicateurLabel] = '';
                        }
                    }
                }
            }
        }

        // Remplir les valeurs pour la collecte actuelle
        foreach ($indicateurs as $indicateurLabel => $defaultValue) {
            $value = '';
            [$category, $key] = explode('_', $indicateurLabel, 2);
            if (isset($collecte->donnees[$category][$key])) {
                $value = is_numeric($collecte->donnees[$category][$key])
                    ? number_format($collecte->donnees[$category][$key], 2, ',', ' ')
                    : $collecte->donnees[$category][$key];
            }
            $row[] = $value;
        }

        return $row;
    }
}
