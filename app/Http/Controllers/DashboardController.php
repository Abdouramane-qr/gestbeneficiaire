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
        \Log::info('==== TEST DASHBOARD CONTROLLER CORRIGÉ ====');

        // Statistiques de base
        $totalEntreprises = Entreprise::count();
        $totalBeneficiaires = Beneficiaire::count();
        $totalCollectes = Collecte::count();

        \Log::info('Statistiques de base', [
            'totalEntreprises' => $totalEntreprises,
            'totalBeneficiaires' => $totalBeneficiaires,
            'totalCollectes' => $totalCollectes
        ]);

        // Données des entreprises par mois (utilise la date de création)
        $entreprisesParMois = collect(range(1, 12))->map(function ($mois) {
            $date = Carbon::now()->setMonth($mois)->startOfMonth();
            $entreprisesCount = 0;
            $beneficiairesCount = 0;

            try {
                $entreprisesCount = Entreprise::whereMonth('created_at', $mois)
                    ->whereYear('created_at', Carbon::now()->year)
                    ->count();

                $beneficiairesCount = Beneficiaire::whereMonth('created_at', $mois)
                    ->whereYear('created_at', Carbon::now()->year)
                    ->count();
            } catch (\Exception $e) {
                \Log::error('Erreur dans le comptage par mois: ' . $e->getMessage());
            }

            return [
                'name' => $date->format('M'),
                'entreprises' => $entreprisesCount,
                'beneficiaires' => $beneficiairesCount
            ];
        })->values();

        \Log::info('Entreprises par mois', ['data' => $entreprisesParMois]);

        // Données des entreprises par secteur
        try {
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

            if ($entreprisesParSecteur->isEmpty()) {
                // Utiliser directement les entreprises si aucun groupement
                $entreprisesParSecteur = Entreprise::get()->map(function ($entreprise) {
                    return [
                        'name' => $entreprise->secteur_activite ?: 'Non spécifié',
                        'value' => 1
                    ];
                });
            }
        } catch (\Exception $e) {
            \Log::error('Erreur dans entreprisesParSecteur: ' . $e->getMessage());
            $entreprisesParSecteur = collect([]);
        }

        \Log::info('Entreprises par secteur', ['data' => $entreprisesParSecteur]);

        // Régions des bénéficiaires
        try {
            $beneficiairesParRegion = Beneficiaire::select('regions')
                ->selectRaw('COUNT(*) as total')
                ->groupBy('regions')
                ->get()
                ->map(function ($item) {
                    $entreprisesCount = 0;
                    try {
                        $entreprisesCount = Entreprise::whereHas('beneficiaire', function($query) use ($item) {
                            $query->where('regions', $item->regions);
                        })->count();
                    } catch (\Exception $e) {
                        \Log::error('Erreur dans le comptage des entreprises par région: ' . $e->getMessage());
                    }

                    return [
                        'region' => $item->regions ?: 'Non spécifié',
                        'total' => (int)$item->total,
                        'entreprises' => $entreprisesCount
                    ];
                });
        } catch (\Exception $e) {
            \Log::error('Erreur dans beneficiairesParRegion: ' . $e->getMessage());
            $beneficiairesParRegion = collect([]);
        }

        // IMPORTANT: Traitement des collectes avec données JSON
        $collectesParCategorie = collect([]);
        $collectesStats = collect([]);

        try {
            $collectes = Collecte::get();
            \Log::info('Nombre de collectes récupérées: ' . $collectes->count());

            $collectesParCategorie = $collectes->map(function ($collecte) {
                // S'assurer que donnees est décodé correctement
                $donnees = null;

                if (is_string($collecte->donnees)) {
                    try {
                        $donnees = json_decode($collecte->donnees, true);
                        \Log::info('Décodage JSON: ' . substr(json_encode($donnees), 0, 200) . '...');
                    } catch (\Exception $e) {
                        \Log::error('Erreur décodage JSON: ' . $e->getMessage());
                        $donnees = [];
                    }
                } else {
                    $donnees = $collecte->donnees ?: [];
                }

                if (!is_array($donnees)) {
                    \Log::warning('Données non valides pour la collecte ' . $collecte->id);
                    $donnees = [];
                }

                // Log pour déboguer
                \Log::info('Structure des données:', ['donnees' => $donnees]);

                // Données commerciales avec vérification robuste
                $commercial = $donnees['commercial'] ?? [];
                \Log::info('Données commerciales:', ['commercial' => $commercial]);

                $donneesCommerciales = [
                    'prospects_total' => intval($commercial['propects_grossites'] ?? 0) + intval($commercial['prospects_detaillant'] ?? 0),
                    'clients_total' => intval($commercial['clients_grossistes'] ?? 0) + intval($commercial['clients_detaillant'] ?? 0),
                    'contrats_total' => intval($commercial['nbr_contrat_conclu'] ?? 0) + intval($commercial['nbr_contrat_encours'] ?? 0),
                ];

                // Données trésorerie avec vérification robuste
                $tresorerie = $donnees['tresorerie'] ?? [];
                \Log::info('Données trésorerie:', ['tresorerie' => $tresorerie]);

                $donneesTresorerie = [
                    'montant_impayes' => floatval($tresorerie['montant_impaye_clients_12m'] ?? 0),
                    'employes_total' => intval($tresorerie['nbr_employes_remunerer_f'] ?? 0) + intval($tresorerie['nbr_employes_remunerer_h'] ?? 0),
                ];

                return [
                    'periode' => $collecte->periode ?: 'Non spécifié',
                    'commercial' => $donneesCommerciales,
                    'tresorerie' => $donneesTresorerie
                ];
            });

            // Correction pour les graphiques
            $collectesStats = $collectesParCategorie->map(function ($item) {
                return [
                    'name' => $item['periode'],
                    'prospects' => $item['commercial']['prospects_total'],
                    'clients' => $item['commercial']['clients_total'],
                    'contrats' => $item['commercial']['contrats_total'],
                    'employes' => $item['tresorerie']['employes_total'],
                ];
            })->values();

        } catch (\Exception $e) {
            \Log::error('Erreur globale dans le traitement des collectes: ' . $e->getMessage());
            \Log::error('Trace: ' . $e->getTraceAsString());
        }

        \Log::info('Collectes statistiques', ['collectesStats' => $collectesStats]);
        \Log::info('Collectes par catégorie', ['count' => $collectesParCategorie->count()]);

        // FALLBACKS pour les données vides
        if ($entreprisesParMois->isEmpty() && $totalEntreprises > 0) {
            // Créer des données par défaut si aucune donnée n'est disponible mais que des entreprises existent
            $entreprisesParMois = collect([
                ['name' => 'Jan', 'entreprises' => $totalEntreprises, 'beneficiaires' => $totalBeneficiaires]
            ]);
        }

        if ($entreprisesParSecteur->isEmpty() && $totalEntreprises > 0) {
            // Utiliser directement les entreprises comme données
            $entreprises = Entreprise::get();
            $entreprisesParSecteur = $entreprises->map(function ($entreprise) {
                return [
                    'name' => $entreprise->secteur_activite ?: 'Non spécifié',
                    'value' => 1
                ];
            });
        }

        // Log final
        \Log::info('Données finales du dashboard', [
            'totalEntreprises' => $totalEntreprises,
            'totalBeneficiaires' => $totalBeneficiaires,
            'totalCollectes' => $totalCollectes,
            'entreprisesParMois_count' => $entreprisesParMois->count(),
            'entreprisesParSecteur_count' => $entreprisesParSecteur->count(),
            'beneficiairesParRegion_count' => $beneficiairesParRegion->count(),
            'collectesStats_count' => $collectesStats->count(),
            'collectesParCategorie_count' => $collectesParCategorie->count()
        ]);

        return Inertia::render('pages/dashboard', [
            'totalEntreprises' => $totalEntreprises,
            'totalBeneficiaires' => $totalBeneficiaires,
            'totalCollectes' => $totalCollectes,
            'entreprisesParMois' => $entreprisesParMois,
            'entreprisesParSecteur' => $entreprisesParSecteur,
            'beneficiairesParRegion' => $beneficiairesParRegion,
            'collectesStats' => $collectesStats,
            'collectesParCategorie' => $collectesParCategorie
        ]);
    }
}
