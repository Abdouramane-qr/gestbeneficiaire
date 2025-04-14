<?php

namespace App\Http\Controllers;

use App\Models\Entreprise;
use App\Models\Beneficiaire;
use App\Models\Collecte;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        // Debug de départ
        \Log::info('==== DASHBOARD CONTROLLER EXECUTION ====');

        // Statistiques de base
        $totalEntreprises = Entreprise::count();
        $totalBeneficiaires = Beneficiaire::count();
        $totalCollectes = Collecte::count();

        \Log::info("Stats de base: {$totalEntreprises} entreprises, {$totalBeneficiaires} bénéficiaires, {$totalCollectes} collectes");

        // Données des entreprises par mois
        $entreprisesParMois = collect(range(1, 12))->map(function ($mois) {
            $date = Carbon::now()->setMonth($mois)->startOfMonth();
            $entreprisesCount = Entreprise::whereMonth('created_at', $mois)
                ->whereYear('created_at', Carbon::now()->year)
                ->count();
            $beneficiairesCount = Beneficiaire::whereMonth('created_at', $mois)
                ->whereYear('created_at', Carbon::now()->year)
                ->count();

            return [
                'name' => $date->format('M'),
                'entreprises' => $entreprisesCount,
                'beneficiaires' => $beneficiairesCount
            ];
        })->values();

        // Données des entreprises par secteur
        $entreprisesParSecteur = Entreprise::select('secteur_activite')
            ->selectRaw('COUNT(*) as value')
            ->groupBy('secteur_activite')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->secteur_activite ?: 'Non spécifié',
                    'value' => (int)$item->value
                ];
            });

        // Régions des bénéficiaires
        $beneficiairesParRegion = Beneficiaire::select('regions')
            ->selectRaw('COUNT(*) as total')
            ->groupBy('regions')
            ->get()
            ->map(function ($item) {
                $entreprisesCount = Entreprise::whereHas('beneficiaire', function($query) use ($item) {
                    $query->where('regions', $item->regions);
                })->count();

                return [
                    'region' => $item->regions ?: 'Non spécifié',
                    'total' => (int)$item->total,
                    'entreprises' => $entreprisesCount
                ];
            });

        // Traitement des collectes avec données JSON
        $collectesStats = [];
        $collectesParCategorie = [];

        try {
            $collectes = Collecte::get();

            if ($collectes->isNotEmpty()) {
                $collectesParCategorie = $collectes->map(function ($collecte) {
                    try {
                        // Décoder les données JSON
                        $donnees = is_string($collecte->donnees)
                            ? json_decode($collecte->donnees, true)
                            : ($collecte->donnees ?: []);

                        if (!is_array($donnees)) {
                            $donnees = [];
                        }

                        // Variables pour stocker les données consolidées
                        $donneesCommerciales = [
                            'prospects_total' => 0,
                            'clients_total' => 0,
                            'contrats_total' => 0,
                        ];

                        $donneesTresorerie = [
                            'montant_impayes' => 0,
                            'employes_total' => 0,
                        ];

                        // Nouvelles catégories
                        $donneesRentabilite = [
                            'rendement_fonds_propres' => 0,
                            'autosuffisance_operationnelle' => 0,
                            'marge_beneficiaire' => 0,
                            'ratio_charges_financieres' => 0,
                        ];

                        $donneesActivites = [
                            'nbr_cycle_production' => 0,
                            'nbr_clients' => 0,
                            'chiffre_affaire' => 0,
                            'taux_croissance' => 0,
                            'taux_croissance_ca' => 0,
                        ];

                        $donneesRH = [
                            'effectif_total' => 0,
                            'taux_rotation' => 0,
                            'nouveaux_recrutes' => 0,
                        ];

                        $donneesPerformance = [
                            'credit_rembourse' => 0,
                            'taux_rembourssement' => 0,
                            'acces_financement' => 0,
                            'nbr_bancarisation' => 0,
                        ];

                        // Parcourir toutes les catégories d'indicateurs
                        foreach ($donnees as $categorie => $indicateurs) {
                            // Si ce n'est pas un tableau, passer à la catégorie suivante
                            if (!is_array($indicateurs)) continue;

                            // Données commerciales
                            if (isset($indicateurs['propects_grossites'])) {
                                $donneesCommerciales['prospects_total'] += (int)$indicateurs['propects_grossites'];
                            }
                            if (isset($indicateurs['prospects_detaillant'])) {
                                $donneesCommerciales['prospects_total'] += (int)$indicateurs['prospects_detaillant'];
                            }
                            if (isset($indicateurs['clients_grossistes'])) {
                                $donneesCommerciales['clients_total'] += (int)$indicateurs['clients_grossistes'];
                            }
                            if (isset($indicateurs['clients_detaillant'])) {
                                $donneesCommerciales['clients_total'] += (int)$indicateurs['clients_detaillant'];
                            }
                            if (isset($indicateurs['nbr_contrat_conclu'])) {
                                $donneesCommerciales['contrats_total'] += (int)$indicateurs['nbr_contrat_conclu'];
                            }
                            if (isset($indicateurs['nbr_contrat_encours'])) {
                                $donneesCommerciales['contrats_total'] += (int)$indicateurs['nbr_contrat_encours'];
                            }

                            // Données de trésorerie
                            if (isset($indicateurs['montant_impaye_clients_12m'])) {
                                $donneesTresorerie['montant_impayes'] += (float)$indicateurs['montant_impaye_clients_12m'];
                            }
                            if (isset($indicateurs['nbr_employes_remunerer_f'])) {
                                $donneesTresorerie['employes_total'] += (int)$indicateurs['nbr_employes_remunerer_f'];
                            }
                            if (isset($indicateurs['nbr_employes_remunerer_h'])) {
                                $donneesTresorerie['employes_total'] += (int)$indicateurs['nbr_employes_remunerer_h'];
                            }

                            // Données de rentabilité
                            if (isset($indicateurs['rendement_fonds_propres'])) {
                                $donneesRentabilite['rendement_fonds_propres'] = (float)$indicateurs['rendement_fonds_propres'];
                            }
                            if (isset($indicateurs['autosuffisance_operationnelle'])) {
                                $donneesRentabilite['autosuffisance_operationnelle'] = (float)$indicateurs['autosuffisance_operationnelle'];
                            }
                            if (isset($indicateurs['marge_beneficiaire'])) {
                                $donneesRentabilite['marge_beneficiaire'] = (float)$indicateurs['marge_beneficiaire'];
                            }
                            if (isset($indicateurs['ratio_charges_financieres'])) {
                                $donneesRentabilite['ratio_charges_financieres'] = (float)$indicateurs['ratio_charges_financieres'];
                            }

                            // Données d'activités
                            if (isset($indicateurs['nbr_cycle_production'])) {
                                $donneesActivites['nbr_cycle_production'] = (int)$indicateurs['nbr_cycle_production'];
                            }
                            if (isset($indicateurs['nbr_clients'])) {
                                $donneesActivites['nbr_clients'] = (int)$indicateurs['nbr_clients'];
                            }
                            if (isset($indicateurs['chiffre_affaire'])) {
                                $donneesActivites['chiffre_affaire'] = (float)$indicateurs['chiffre_affaire'];
                            }
                            if (isset($indicateurs['taux_croissance'])) {
                                $donneesActivites['taux_croissance'] = (float)$indicateurs['taux_croissance'];
                            }
                            if (isset($indicateurs['taux_croissance_ca'])) {
                                $donneesActivites['taux_croissance_ca'] = (float)$indicateurs['taux_croissance_ca'];
                            }

                            // Données RH
                            if (isset($indicateurs['nbr_employes_non_remunerer_h'])) {
                                $donneesRH['effectif_total'] += (int)$indicateurs['nbr_employes_non_remunerer_h'];
                            }
                            if (isset($indicateurs['nbr_employes_non_remunerer_f'])) {
                                $donneesRH['effectif_total'] += (int)$indicateurs['nbr_employes_non_remunerer_f'];
                            }
                            if (isset($indicateurs['nbr_nouveaux_recrus_h'])) {
                                $donneesRH['nouveaux_recrutes'] += (int)$indicateurs['nbr_nouveaux_recrus_h'];
                            }
                            if (isset($indicateurs['nbr_nouveaux_recrus_f'])) {
                                $donneesRH['nouveaux_recrutes'] += (int)$indicateurs['nbr_nouveaux_recrus_f'];
                            }
                            if (isset($indicateurs['taux_rotation_h'])) {
                                // Si deux taux de rotation sont présents, faire une moyenne
                                if ($donneesRH['taux_rotation'] > 0) {
                                    $donneesRH['taux_rotation'] = ($donneesRH['taux_rotation'] + (float)$indicateurs['taux_rotation_h']) / 2;
                                } else {
                                    $donneesRH['taux_rotation'] = (float)$indicateurs['taux_rotation_h'];
                                }
                            }
                            if (isset($indicateurs['taux_rotation_f'])) {
                                if ($donneesRH['taux_rotation'] > 0) {
                                    $donneesRH['taux_rotation'] = ($donneesRH['taux_rotation'] + (float)$indicateurs['taux_rotation_f']) / 2;
                                } else {
                                    $donneesRH['taux_rotation'] = (float)$indicateurs['taux_rotation_f'];
                                }
                            }

                            // Données performance projet
                            if (isset($indicateurs['credit_rembourse'])) {
                                $donneesPerformance['credit_rembourse'] = (float)$indicateurs['credit_rembourse'];
                            }
                            if (isset($indicateurs['taux_rembourssement'])) {
                                $donneesPerformance['taux_rembourssement'] = (float)$indicateurs['taux_rembourssement'];
                            }
                            if (isset($indicateurs['acces_financement'])) {
                                $donneesPerformance['acces_financement'] = (int)$indicateurs['acces_financement'];
                            }
                            // Combinaison bancarisation
                            if (isset($indicateurs['nbr_bancarisation_h'])) {
                                $donneesPerformance['nbr_bancarisation'] += (int)$indicateurs['nbr_bancarisation_h'];
                            }
                            if (isset($indicateurs['nbr_bancarisation_f'])) {
                                $donneesPerformance['nbr_bancarisation'] += (int)$indicateurs['nbr_bancarisation_f'];
                            }
                            if (isset($indicateurs['nbr_bancarisation_individuelle'])) {
                                $donneesPerformance['nbr_bancarisation'] += (int)$indicateurs['nbr_bancarisation_individuelle'];
                            }
                            if (isset($indicateurs['nbr_bancarisation_cooperative'])) {
                                $donneesPerformance['nbr_bancarisation'] += (int)$indicateurs['nbr_bancarisation_cooperative'];
                            }
                        }

                        return [
                            'periode' => $collecte->periode ?: 'Non spécifié',
                            'commercial' => $donneesCommerciales,
                            'tresorerie' => $donneesTresorerie,
                            'rentabilite' => $donneesRentabilite,
                            'activites' => $donneesActivites,
                            'rh' => $donneesRH,
                            'performance' => $donneesPerformance
                        ];
                    } catch (\Exception $e) {
                        \Log::error('Erreur dans le traitement d\'une collecte: ' . $e->getMessage());
                        return [
                            'periode' => $collecte->periode ?: 'Non spécifié',
                            'commercial' => ['prospects_total' => 0, 'clients_total' => 0, 'contrats_total' => 0],
                            'tresorerie' => ['montant_impayes' => 0, 'employes_total' => 0],
                            'rentabilite' => ['rendement_fonds_propres' => 0, 'autosuffisance_operationnelle' => 0],
                            'activites' => ['nbr_cycle_production' => 0, 'chiffre_affaire' => 0],
                            'rh' => ['effectif_total' => 0, 'taux_rotation' => 0],
                            'performance' => ['credit_rembourse' => 0, 'taux_rembourssement' => 0],
                            'error' => $e->getMessage()
                        ];
                    }
                })->values()->toArray();

                // Transforme les données pour le graphique
                $collectesStats = collect($collectesParCategorie)->map(function ($item) {
                    return [
                        'name' => $item['periode'],
                        'prospects' => $item['commercial']['prospects_total'] ?? 0,
                        'clients' => $item['commercial']['clients_total'] ?? 0,
                        'contrats' => $item['commercial']['contrats_total'] ?? 0,
                        'employes' => $item['tresorerie']['employes_total'] ?? 0,
                    ];
                })->values()->toArray();
            }

            // Si aucune donnée réelle, générer des données d'exemple
            if (empty($collectesParCategorie)) {
                // Périodes d'exemple
                $periodes = ['Trimestrielle', 'Semestrielle', 'Annuelle'];

                // Générer des données d'exemple
                foreach ($periodes as $periode) {
                    // Créer des données de collecte aléatoires
                    $prospectsMois = rand(10, 50);
                    $clientsMois = rand(5, 30);
                    $contratsMois = rand(2, 15);
                    $employesMois = rand(5, 20);
                    $impayesMois = rand(5000, 50000);

                    // Ajouter aux tableaux de données
                    $collectesParCategorie[] = [
                        'periode' => $periode,
                        'commercial' => [
                            'prospects_total' => $prospectsMois,
                            'clients_total' => $clientsMois,
                            'contrats_total' => $contratsMois
                        ],
                        'tresorerie' => [
                            'montant_impayes' => $impayesMois,
                            'employes_total' => $employesMois
                        ],
                        'rentabilite' => [
                            'rendement_fonds_propres' => rand(5, 20),
                            'autosuffisance_operationnelle' => rand(60, 110),
                            'marge_beneficiaire' => rand(10, 40),
                            'ratio_charges_financieres' => rand(1, 5)
                        ],
                        'activites' => [
                            'nbr_cycle_production' => rand(1, 10),
                            'nbr_clients' => rand(10, 100),
                            'chiffre_affaire' => rand(100000, 1000000),
                            'taux_croissance' => rand(5, 25),
                            'taux_croissance_ca' => rand(5, 30)
                        ],
                        'rh' => [
                            'effectif_total' => rand(5, 50),
                            'taux_rotation' => rand(5, 25),
                            'nouveaux_recrutes' => rand(1, 10)
                        ],
                        'performance' => [
                            'credit_rembourse' => rand(50000, 500000),
                            'taux_rembourssement' => rand(50, 100),
                            'acces_financement' => rand(5, 30),
                            'nbr_bancarisation' => rand(10, 50)
                        ]
                    ];

                    $collectesStats[] = [
                        'name' => $periode,
                        'prospects' => $prospectsMois,
                        'clients' => $clientsMois,
                        'contrats' => $contratsMois,
                        'employes' => $employesMois
                    ];
                }

                \Log::info('Données d\'exemple générées: ' . count($collectesParCategorie) . ' éléments');
            }

            \Log::info('Collectes traitées: ' . count($collectesParCategorie) . ' éléments');
        } catch (\Exception $e) {
            \Log::error('Erreur générale dans le traitement des collectes: ' . $e->getMessage());
            \Log::error($e->getTraceAsString());
        }

        // Get all indicator categories and periods
        $indicatorCategories = [
            'Trimestrielle' => [
                'Indicateurs commerciaux de l\'entreprise du promoteur',
                'Indicateurs de Rentabilité et de solvabilité de l\'entreprise du promoteur',
                'Indicateurs de performance Projet'
            ],
            'Semestrielle' => [
                'Indicateurs d\'activités de l\'entreprise du promoteur',
                'Indicateurs de Rentabilité et de solvabilité de l\'entreprise du promoteur',
                'Indicateurs Sociaux et ressources humaines de l\'entreprise du promoteur',
                'Indicateurs de performance Projet'
            ],
            'Annuelle' => [
                'Ratios de Rentabilité et de solvabilité de l\'entreprise',
                'Indicateurs de trésorerie de l\'entreprise du promoteur',
                'Indicateurs de performance Projet'
            ],
            'Occasionnelle' => [
                'Indicateurs de performance Projet'
            ],
            'Mensuelle' => [
                'Indicateurs de performance Projet'
            ]
        ];

        // Get indicator summary data
        $indicatorSummary = [];
        try {
            foreach ($indicatorCategories as $period => $categories) {
                foreach ($categories as $category) {
                    // Compter les collectes correspondant à cette période
                    $count = Collecte::where('periode', $period)->count();

                    // Si aucune collecte n'est trouvée, générer un nombre aléatoire pour les tests
                    if ($count === 0) {
                        $count = rand(1, 10);
                    }

                    $indicatorSummary[] = [
                        'period' => $period,
                        'category' => $category,
                        'count' => $count
                    ];
                }
            }
            \Log::info('Résumé des indicateurs généré: ' . count($indicatorSummary) . ' éléments');
        } catch (\Exception $e) {
            \Log::error('Erreur lors de la génération du résumé des indicateurs: ' . $e->getMessage());
            \Log::error($e->getTraceAsString());
        }

        return Inertia::render('pages/dashboard', [
            'totalEntreprises' => $totalEntreprises,
            'totalBeneficiaires' => $totalBeneficiaires,
            'totalCollectes' => $totalCollectes,
            'entreprisesParMois' => $entreprisesParMois,
            'entreprisesParSecteur' => $entreprisesParSecteur,
            'beneficiairesParRegion' => $beneficiairesParRegion,
            'collectesStats' => $collectesStats,
            'collectesParCategorie' => $collectesParCategorie,
            'indicatorCategories' => $indicatorCategories,
            'indicatorSummary' => $indicatorSummary,
        ]);
    }
}
