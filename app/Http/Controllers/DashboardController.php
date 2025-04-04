<?php

namespace App\Http\Controllers;

use App\Models\Entreprise;
use App\Models\Rapport;
use App\Models\IndicateurFinancier;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Affiche le tableau de bord avec les statistiques générales.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        // Récupération des derniers rapports avec les entreprises associées
        $latestRapports = Rapport::with('entreprise')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // Comptage des entreprises et rapports
        $entreprisesCount = Entreprise::count();
        $rapportsCount = Rapport::count();

        // Rapports à valider (statut "soumis")
        $rapportsAValider = Rapport::where('statut', 'soumis')->count();

        // Statistiques financières globales pour les graphiques
        $statistiquesFinancieres = $this->getStatistiquesFinancieres();

        // Distribution des entreprises par secteur d'activité
        $entreprisesParSecteur = Entreprise::select('secteur_activite')
            ->selectRaw('count(*) as total')
            ->groupBy('secteur_activite')
            ->orderByDesc('total')
            ->get();

        return Inertia::render('Dashboard', [
            'latestRapports' => $latestRapports,
            'entreprisesCount' => $entreprisesCount,
            'rapportsCount' => $rapportsCount,
            'rapportsAValider' => $rapportsAValider,
            'statistiquesFinancieres' => $statistiquesFinancieres,
            'entreprisesParSecteur' => $entreprisesParSecteur
        ]);
    }

    /**
     * Récupère les statistiques financières pour les graphiques.
     *
     * @return array
     */
    private function getStatistiquesFinancieres()
    {
        // Obtenir l'année en cours
        $currentYear = Carbon::now()->year;

        // Récupérer les rapports de l'année en cours
        $rapportsAnnuels = Rapport::where('periode', 'Annuel')
            ->where('annee', $currentYear - 1)
            ->with('indicateursFinanciers')
            ->get();

        // Regrouper les rapports trimestriels par période
        $rapportsTrimestriels = Rapport::where('periode', 'Trimestriel')
            ->where('annee', $currentYear)
            ->with('indicateursFinanciers')
            ->get()
            ->groupBy('periode');

        // Calculer les moyennes des indicateurs financiers clés
        $moyenneChiffreAffaires = IndicateurFinancier::whereHas('rapport', function ($query) use ($currentYear) {
            $query->where('annee', $currentYear);
        })->avg('chiffre_affaires');

        $moyenneMargeEbitda = IndicateurFinancier::whereHas('rapport', function ($query) use ($currentYear) {
            $query->where('annee', $currentYear);
        })->avg('marge_ebitda');

        $moyenneRatioEndettement = IndicateurFinancier::whereHas('rapport', function ($query) use ($currentYear) {
            $query->where('annee', $currentYear);
        })->avg('ratio_endettement');

        // Préparer les données pour les graphiques
        $donneesGraphique = [];

        // Évolution du chiffre d'affaires sur les dernières années (simplifié pour l'exemple)
        $evolutionCA = [];
        for ($i = 2; $i >= 0; $i--) {
            $annee = $currentYear - $i;
            $ca = IndicateurFinancier::whereHas('rapport', function ($query) use ($annee) {
                $query->where('annee', $annee)->where('periode', 'Annuel');
            })->avg('chiffre_affaires') ?? 0;

            $evolutionCA[] = [
                'annee' => $annee,
                'valeur' => round($ca, 2)
            ];
        }
        $donneesGraphique['evolutionCA'] = $evolutionCA;

        return [
            'moyenneChiffreAffaires' => $moyenneChiffreAffaires,
            'moyenneMargeEbitda' => $moyenneMargeEbitda,
            'moyenneRatioEndettement' => $moyenneRatioEndettement,
            'graphiques' => $donneesGraphique
        ];
    }
}
