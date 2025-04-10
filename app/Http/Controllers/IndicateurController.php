<?php

namespace App\Http\Controllers;

use App\Models\Beneficiaire;
use App\Models\Indicateur;
use App\Exports\IndicateursExport;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel;

class IndicateurController extends Controller
{
    /**
     * Page principale d'analyse des indicateurs
     */
    public function index()
    {
        // Préparer les données pour les filtres
        return Inertia::render('Analyses/Analyse', [
            'categories' => $this->getCategories(),
            'regions' => $this->getRegions(),
            'provinces' => $this->getProvinces(),
            'communes' => $this->getCommunes(),
            'typesBeneficiaires' => $this->getTypesBeneficiaires(),
            'genres' => $this->getGenres(),
            'niveauxInstruction' => $this->getNiveauxInstruction(),
            'typesActivite' => $this->getTypesActivite(),
            'niveauxDeveloppement' => $this->getNiveauxDeveloppement(),

            // Données initiales pour le graphique
            'donneesIndicateurs' => $this->getDonneesIndicateurs(),
        ]);
    }

    /**
     * Filtrer les indicateurs
     */
    public function filtrer(Request $request)
    {
        try {
            $filtres = $request->validate([
                'categorie' => 'nullable|string',
                'region' => 'nullable|string',
                'province' => 'nullable|string',
                'commune' => 'nullable|string',
                'typeBeneficiaire' => 'nullable|string',
                'genre' => 'nullable|string',
                'handicap' => 'nullable|boolean',
                'niveauInstruction' => 'nullable|string',
                'typeActivite' => 'nullable|string',
                'niveauDeveloppement' => 'nullable|string',
            ]);

            // Construire la requête de filtrage
            $query = Indicateur::query();

            // Si des filtres de bénéficiaires sont présents, joindre la table des bénéficiaires
            if (!empty(array_intersect_key($filtres, array_flip([
                'region', 'province', 'commune',
                'typeBeneficiaire', 'genre', 'handicap',
                'niveauInstruction', 'typeActivite',
                'niveauDeveloppement'
            ]))) ) {
                $query->whereHas('beneficiaire', function ($q) use ($filtres) {
                    foreach ($filtres as $key => $value) {
                        if ($value !== null && $value !== 'all') {
                            // Mapper les noms de colonnes si nécessaire
                            $columnMap = [
                                'typeBeneficiaire' => 'type_beneficiaire',
                                'niveauInstruction' => 'niveau_instruction',
                                'typeActivite' => 'domaine_activite',
                                'niveauDeveloppement' => 'niveau_mise_en_oeuvre'
                            ];

                            $column = $columnMap[$key] ?? $key;
                            $q->where($column, $value);
                        }
                    }
                });
            }

            // Filtrer par catégorie si spécifiée
            if (!empty($filtres['categorie']) && $filtres['categorie'] !== 'all') {
                $query->where('categorie', $filtres['categorie']);
            }

            $indicateurs = $query->with('beneficiaire')->get();

            return response()->json([
                'donneesIndicateurs' => $indicateurs,
                'statistiques' => $this->calculerStatistiques($indicateurs),
            ]);

        } catch (\Exception $e) {
            Log::error('Erreur lors du filtrage des indicateurs : ' . $e->getMessage());

            return response()->json([
                'error' => 'Erreur lors du filtrage des indicateurs',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Exporter les indicateurs
     */
    public function exporter(Request $request)
    {
        try {
            $filtres = $request->all();

            // Construire la requête de filtrage
            $query = Indicateur::query();

            // Si des filtres de bénéficiaires sont présents, joindre la table des bénéficiaires
            if (!empty(array_intersect_key($filtres, array_flip([
                'region', 'province', 'commune',
                'typeBeneficiaire', 'genre', 'handicap',
                'niveauInstruction', 'typeActivite',
                'niveauDeveloppement'
            ]))) ) {
                $query->whereHas('beneficiaire', function ($q) use ($filtres) {
                    foreach ($filtres as $key => $value) {
                        if ($value !== null && $value !== 'all') {
                            // Mapper les noms de colonnes si nécessaire
                            $columnMap = [
                                'typeBeneficiaire' => 'type_beneficiaire',
                                'niveauInstruction' => 'niveau_instruction',
                                'typeActivite' => 'domaine_activite',
                                'niveauDeveloppement' => 'niveau_mise_en_oeuvre'
                            ];

                            $column = $columnMap[$key] ?? $key;
                            $q->where($column, $value);
                        }
                    }
                });
            }

            // Filtrer par catégorie si spécifiée
            if (!empty($filtres['categorie']) && $filtres['categorie'] !== 'all') {
                $query->where('categorie', $filtres['categorie']);
            }

            $indicateurs = $query->with('beneficiaire')->get();

            // Générer un fichier Excel
            return Excel::download(new IndicateursExport($indicateurs), 'indicateurs_' . date('Y-m-d') . '.xlsx');

        } catch (\Exception $e) {
            Log::error('Erreur lors de l\'exportation des indicateurs : ' . $e->getMessage());

            return back()->withErrors([
                'export' => 'Impossible d\'exporter les indicateurs'
            ]);
        }
    }

    /**
     * Méthodes privées pour récupérer les données de filtrage
     */
    private function getCategories()
    {
        return [
            [
                'id' => 'activites_entreprise',
                'nom' => "Indicateurs d'activités de l'entreprise du promoteur",
            ],
            [
                'id' => 'ratios_rentabilite',
                'nom' => 'Ratios de Rentabilité et de solvabilité de l\'entreprise',
            ],
            [
                'id' => 'rentabilite_promoteur',
                'nom' => 'Indicateurs de Rentabilité et de solvabilité de l\'entreprise du promoteur',
            ],
            [
                'id' => 'commerciaux',
                'nom' => 'Indicateurs commerciaux de l\'entreprise du promoteur',
            ],
            [
                'id' => 'sociaux_rh',
                'nom' => 'Indicateurs Sociaux et ressources humaines de l\'entreprise du promoteur',
            ],
            [
                'id' => 'performance_projet',
                'nom' => 'Indicateurs de performance Projet',
            ]
        ];
    }

    private function getRegions()
    {
        return Beneficiaire::distinct('regions')->pluck('regions');
    }

    private function getProvinces()
    {
        return Beneficiaire::distinct('provinces')->pluck('provinces');
    }

    private function getCommunes()
    {
        return Beneficiaire::distinct('communes')->pluck('communes');
    }

    private function getTypesBeneficiaires()
    {
        return Beneficiaire::distinct('type_beneficiaire')->pluck('type_beneficiaire');
    }

    private function getGenres()
    {
        return Beneficiaire::distinct('genre')->pluck('genre');
    }

    private function getNiveauxInstruction()
    {
        return Beneficiaire::distinct('niveau_instruction')->pluck('niveau_instruction');
    }

    private function getTypesActivite()
    {
        return Beneficiaire::distinct('domaine_activite')->pluck('domaine_activite');
    }

    private function getNiveauxDeveloppement()
    {
        return Beneficiaire::distinct('niveau_mise_en_oeuvre')->pluck('niveau_mise_en_oeuvre');
    }

    /**
     * Récupérer les données initiales des indicateurs
     */
    private function getDonneesIndicateurs()
    {
        return Indicateur::with('beneficiaire')
            ->orderBy('created_at', 'desc')
            ->take(50)
            ->get();
    }

    /**
     * Calculer des statistiques sur les indicateurs filtrés
     */
    private function calculerStatistiques($indicateurs)
    {
        return [
            'total' => $indicateurs->count(),
            'moyenne' => $indicateurs->avg('valeur'),
            'min' => $indicateurs->min('valeur'),
            'max' => $indicateurs->max('valeur'),
            'distribution' => $indicateurs->groupBy('categorie')->map->count()
        ];
    }
}
