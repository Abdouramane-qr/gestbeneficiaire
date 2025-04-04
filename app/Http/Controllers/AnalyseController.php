<?php

namespace App\Http\Controllers;

use App\Models\Entreprise;
use App\Models\Rapport;
use App\Models\IndicateurFinancier;
use App\Models\IndicateurCommercial;
use App\Models\IndicateurRH;
use App\Models\IndicateurProduction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AnalyseController extends Controller
{
    /**
     * Affiche la page d'analyse par secteur d'activité.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function secteurs(Request $request)
    {
        // Paramètres de filtrage
        $annee = $request->input('annee', Carbon::now()->year);
        $secteur = $request->input('secteur', '');

        // Liste des secteurs disponibles
        $secteurs = Entreprise::select('secteur_activite')
            ->distinct()
            ->orderBy('secteur_activite')
            ->pluck('secteur_activite');

        // Statistiques par secteur
        $statistiquesParSecteur = [];

        if (!empty($secteur)) {
            // Récupérer toutes les entreprises du secteur sélectionné
            $entreprises = Entreprise::where('secteur_activite', $secteur)->get();
            $entreprisesIds = $entreprises->pluck('id')->toArray();

            // Récupérer les indicateurs financiers des entreprises du secteur pour l'année sélectionnée
            $indicateursFinanciers = IndicateurFinancier::whereHas('rapport', function ($query) use ($entreprisesIds, $annee) {
                $query->whereIn('entreprise_id', $entreprisesIds)
                    ->where('annee', $annee)
                    ->where('periode', 'Annuel');
            })->with('rapport.entreprise')->get();

            // Calculer les moyennes des indicateurs financiers
            $statistiquesParSecteur = $this->calculerMoyennesIndicateurs($indicateursFinanciers);

            // Récupérer les données pour le graphique d'évolution
            $evolutionSurAnnees = $this->getEvolutionSurAnnees($secteur, $annee);
            $statistiquesParSecteur['evolution'] = $evolutionSurAnnees;
        }

        // Liste des années disponibles
        $annees = Rapport::select('annee')
            ->distinct()
            ->orderBy('annee', 'desc')
            ->pluck('annee');

        return Inertia::render('Analyses/Secteurs', [
            'secteurs' => $secteurs,
            'secteurSelectionne' => $secteur,
            'annees' => $annees,
            'anneeSelectionnee' => $annee,
            'statistiques' => $statistiquesParSecteur
        ]);
    }

    /**
     * Affiche la page d'analyse comparative entre entreprises.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function comparaison(Request $request)
    {
        // Paramètres de filtrage
        $entreprise1Id = $request->input('entreprise1');
        $entreprise2Id = $request->input('entreprise2');
        $annee = $request->input('annee', Carbon::now()->year);

        // Liste des entreprises
        $entreprises = Entreprise::orderBy('nom_entreprise')->get();

        // Données de comparaison
        $donnees = [];

        if (!empty($entreprise1Id) && !empty($entreprise2Id)) {
            $entreprise1 = Entreprise::findOrFail($entreprise1Id);
            $entreprise2 = Entreprise::findOrFail($entreprise2Id);

            // Récupérer les derniers rapports annuels des deux entreprises
            $rapport1 = Rapport::where('entreprise_id', $entreprise1Id)
                ->where('periode', 'Annuel')
                ->where('annee', $annee)
                ->with(['indicateursFinanciers', 'indicateursCommerciaux', 'indicateursRH', 'indicateursProduction'])
                ->first();

            $rapport2 = Rapport::where('entreprise_id', $entreprise2Id)
                ->where('periode', 'Annuel')
                ->where('annee', $annee)
                ->with(['indicateursFinanciers', 'indicateursCommerciaux', 'indicateursRH', 'indicateursProduction'])
                ->first();

            if ($rapport1 && $rapport2) {
                $donnees = $this->prepareComparisonData($entreprise1, $rapport1, $entreprise2, $rapport2);
            }
        }

        // Liste des années disponibles
        $annees = Rapport::select('annee')
            ->distinct()
            ->orderBy('annee', 'desc')
            ->pluck('annee');

        return Inertia::render('Analyses/Comparaison', [
            'entreprises' => $entreprises,
            'entreprise1Id' => $entreprise1Id,
            'entreprise2Id' => $entreprise2Id,
            'annees' => $annees,
            'anneeSelectionnee' => $annee,
            'donnees' => $donnees
        ]);
    }

    /**
     * Affiche la page d'analyse de tendances sur plusieurs années.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function tendances(Request $request)
    {
        $entrepriseId = $request->input('entreprise');
        $indicateur = $request->input('indicateur', 'chiffre_affaires');

        // Liste des entreprises
        $entreprises = Entreprise::orderBy('nom_entreprise')->get();

        // Liste des indicateurs disponibles pour l'analyse
        $indicateursDisponibles = [
            'chiffre_affaires' => 'Chiffre d\'affaires',
            'marge_ebitda' => 'Marge EBITDA',
            'ratio_endettement' => 'Ratio d\'endettement',
            'nombre_clients' => 'Nombre de clients',
            'taux_retention' => 'Taux de rétention',
            'effectif_total' => 'Effectif total',
            'turnover' => 'Turnover',
            'taux_utilisation' => 'Taux d\'utilisation',
            'taux_rebut' => 'Taux de rebut'
        ];

        // Données de tendance
        $donneesTendance = [];

        if (!empty($entrepriseId)) {
            $entreprise = Entreprise::findOrFail($entrepriseId);

            // Déterminer le type d'indicateur (financier, commercial, RH, production)
            $typeIndicateur = $this->determinerTypeIndicateur($indicateur);

            // Récupérer les rapports annuels de l'entreprise sur les 5 dernières années
            $anneeActuelle = Carbon::now()->year;
            $rapports = Rapport::where('entreprise_id', $entrepriseId)
                ->where('periode', 'Annuel')
                ->whereBetween('annee', [$anneeActuelle - 5, $anneeActuelle])
                ->with([$typeIndicateur])
                ->orderBy('annee')
                ->get();

            if ($rapports->isNotEmpty()) {
                $donneesTendance = $this->prepareTendanceData($rapports, $indicateur, $typeIndicateur);
            }
        }

        return Inertia::render('Analyses/Tendances', [
            'entreprises' => $entreprises,
            'entrepriseId' => $entrepriseId,
            'indicateursDisponibles' => $indicateursDisponibles,
            'indicateurSelectionne' => $indicateur,
            'donneesTendance' => $donneesTendance
        ]);
    }

    /**
     * Calcule les moyennes des indicateurs financiers.
     *
     * @param  \Illuminate\Database\Eloquent\Collection  $indicateurs
     * @return array
     */
    private function calculerMoyennesIndicateurs($indicateurs)
    {
        if ($indicateurs->isEmpty()) {
            return [];
        }

        // Initialiser les compteurs
        $totaux = [
            'chiffre_affaires' => 0,
            'resultat_net' => 0,
            'ebitda' => 0,
            'marge_ebitda' => 0,
            'cash_flow' => 0,
            'ratio_dette_ebitda' => 0,
            'ratio_endettement' => 0,
            'entreprises_count' => 0
        ];

        // Pour chaque indicateur, ajouter les valeurs aux totaux
        foreach ($indicateurs as $indicateur) {
            $totaux['entreprises_count']++;

            foreach ($totaux as $key => $value) {
                if ($key !== 'entreprises_count' && isset($indicateur->$key) && $indicateur->$key !== null) {
                    $totaux[$key] += $indicateur->$key;
                }
            }
        }

        // Calculer les moyennes
        $moyennes = [];
        foreach ($totaux as $key => $value) {
            if ($key !== 'entreprises_count' && $totaux['entreprises_count'] > 0) {
                $moyennes[$key] = $value / $totaux['entreprises_count'];
            }
        }

        // Ajouter le nombre d'entreprises
        $moyennes['entreprises_count'] = $totaux['entreprises_count'];

        return $moyennes;
    }

    /**
     * Récupère l'évolution d'un secteur sur plusieurs années.
     *
     * @param  string  $secteur
     * @param  int  $anneeMax
     * @return array
     */
    private function getEvolutionSurAnnees($secteur, $anneeMax)
    {
        // Déterminer les années à analyser (5 dernières années)
        $annees = range($anneeMax - 4, $anneeMax);

        // Récupérer les entreprises du secteur
        $entreprisesIds = Entreprise::where('secteur_activite', $secteur)
            ->pluck('id')
            ->toArray();

        // Initialiser le tableau d'évolution
        $evolution = [];

        // Pour chaque année, récupérer les moyennes des indicateurs
        foreach ($annees as $annee) {
            $indicateursFinanciers = IndicateurFinancier::whereHas('rapport', function ($query) use ($entreprisesIds, $annee) {
                $query->whereIn('entreprise_id', $entreprisesIds)
                    ->where('annee', $annee)
                    ->where('periode', 'Annuel');
            })->get();

            $moyennes = $this->calculerMoyennesIndicateurs($indicateursFinanciers);

            $evolution[] = [
                'annee' => $annee,
                'chiffre_affaires' => $moyennes['chiffre_affaires'] ?? 0,
                'marge_ebitda' => $moyennes['marge_ebitda'] ?? 0,
                'ratio_endettement' => $moyennes['ratio_endettement'] ?? 0,
                'entreprises_count' => $moyennes['entreprises_count'] ?? 0
            ];
        }

        return $evolution;
    }

    /**
     * Prépare les données pour la comparaison entre deux entreprises.
     *
     * @param  \App\Models\Entreprise  $entreprise1
     * @param  \App\Models\Rapport  $rapport1
     * @param  \App\Models\Entreprise  $entreprise2
     * @param  \App\Models\Rapport  $rapport2
     * @return array
     */
    private function prepareComparisonData($entreprise1, $rapport1, $entreprise2, $rapport2)
    {
        // Récupérer les noms des entreprises
        $nomEntreprise1 = $entreprise1->nom;
        $nomEntreprise2 = $entreprise2->nom;

        // Préparer les données de comparaison
        $comparaison = [
            'financiers' => $this->compareIndicateurs(
                $rapport1->indicateursFinanciers,
                $rapport2->indicateursFinanciers,
                [
                    'chiffre_affaires' => 'Chiffre d\'affaires',
                    'resultat_net' => 'Résultat net',
                    'ebitda' => 'EBITDA',
                    'marge_ebitda' => 'Marge EBITDA',
                    'ratio_dette_ebitda' => 'Ratio dette/EBITDA',
                    'ratio_endettement' => 'Ratio d\'endettement'
                ],
                $nomEntreprise1,
                $nomEntreprise2
            ),

            'commerciaux' => $this->compareIndicateurs(
                $rapport1->indicateursCommerciaux,
                $rapport2->indicateursCommerciaux,
                [
                    'nombre_clients' => 'Nombre de clients',
                    'nouveaux_clients' => 'Nouveaux clients',
                    'taux_retention' => 'Taux de rétention',
                    'panier_moyen' => 'Panier moyen',
                    'export_pourcentage' => 'Export (%)'
                ],
                $nomEntreprise1,
                $nomEntreprise2
            ),

            'rh' => $this->compareIndicateurs(
                $rapport1->indicateursRH,
                $rapport2->indicateursRH,
                [
                    'effectif_total' => 'Effectif total',
                    'cadres_pourcentage' => 'Cadres (%)',
                    'turnover' => 'Turnover',
                    'absenteisme' => 'Absentéisme',
                    'masse_salariale' => 'Masse salariale'
                ],
                $nomEntreprise1,
                $nomEntreprise2
            ),

            'production' => $this->compareIndicateurs(
                $rapport1->indicateursProduction,
                $rapport2->indicateursProduction,
                [
                    'taux_utilisation' => 'Taux d\'utilisation',
                    'taux_rebut' => 'Taux de rebut',
                    'delai_production_moyen' => 'Délai de production',
                    'rotation_stocks' => 'Rotation des stocks'
                ],
                $nomEntreprise1,
                $nomEntreprise2
            ),

            'entreprises' => [
                'entreprise1' => [
                    'id' => $entreprise1->id,
                    'nom' => $nomEntreprise1,
                    'forme_juridique' => $entreprise1->forme_juridique,
                    'secteur_activite' => $entreprise1->secteur_activite,
                    'date_creation' => $entreprise1->date_creation
                ],
                'entreprise2' => [
                    'id' => $entreprise2->id,
                    'nom' => $nomEntreprise2,
                    'forme_juridique' => $entreprise2->forme_juridique,
                    'secteur_activite' => $entreprise2->secteur_activite,
                    'date_creation' => $entreprise2->date_creation
                ]
            ]
        ];

        return $comparaison;
    }

    /**
     * Compare les indicateurs entre deux entités.
     *
     * @param  object  $indicateurs1
     * @param  object  $indicateurs2
     * @param  array  $champsAComparer
     * @param  string  $nomEntite1
     * @param  string  $nomEntite2
     * @return array
     */
    private function compareIndicateurs($indicateurs1, $indicateurs2, $champsAComparer, $nomEntite1, $nomEntite2)
    {
        $comparaison = [];

        foreach ($champsAComparer as $champ => $label) {
            $valeur1 = $indicateurs1->$champ ?? null;
            $valeur2 = $indicateurs2->$champ ?? null;

            // Calculer la différence en pourcentage
            $difference = null;
            $differenceLabel = '';

            if ($valeur1 !== null && $valeur2 !== null && $valeur2 != 0) {
                $difference = (($valeur1 - $valeur2) / $valeur2) * 100;
                $differenceLabel = $difference > 0 ? '+' . number_format($difference, 2) . '%' : number_format($difference, 2) . '%';
            }

            $comparaison[] = [
                'label' => $label,
                'champ' => $champ,
                'valeur1' => $valeur1,
                'valeur2' => $valeur2,
                'difference' => $difference,
                'differenceLabel' => $differenceLabel
            ];
        }

        return [
            'indicateurs' => $comparaison,
            'entite1' => $nomEntite1,
            'entite2' => $nomEntite2
        ];
    }

    /**
     * Détermine le type d'indicateur à partir du nom d'un champ.
     *
     * @param  string  $indicateur
     * @return string
     */
    private function determinerTypeIndicateur($indicateur)
    {
        $typeParChamp = [
            // Financiers
            'chiffre_affaires' => 'indicateursFinanciers',
            'resultat_net' => 'indicateursFinanciers',
            'ebitda' => 'indicateursFinanciers',
            'marge_ebitda' => 'indicateursFinanciers',
            'cash_flow' => 'indicateursFinanciers',
            'dette_nette' => 'indicateursFinanciers',
            'ratio_dette_ebitda' => 'indicateursFinanciers',
            'ratio_endettement' => 'indicateursFinanciers',

            // Commerciaux
            'nombre_clients' => 'indicateursCommerciaux',
            'nouveaux_clients' => 'indicateursCommerciaux',
            'taux_retention' => 'indicateursCommerciaux',
            'panier_moyen' => 'indicateursCommerciaux',
            'export_pourcentage' => 'indicateursCommerciaux',

            // RH
            'effectif_total' => 'indicateursRH',
            'cadres_pourcentage' => 'indicateursRH',
            'turnover' => 'indicateursRH',
            'absenteisme' => 'indicateursRH',
            'masse_salariale' => 'indicateursRH',

            // Production
            'taux_utilisation' => 'indicateursProduction',
            'taux_rebut' => 'indicateursProduction',
            'delai_production_moyen' => 'indicateursProduction',
            'rotation_stocks' => 'indicateursProduction'
        ];

        return $typeParChamp[$indicateur] ?? 'indicateursFinanciers';
    }

    /**
     * Prépare les données pour l'analyse de tendances.
     *
     * @param  \Illuminate\Database\Eloquent\Collection  $rapports
     * @param  string  $indicateur
     * @param  string  $typeIndicateur
     * @return array
     */
    private function prepareTendanceData($rapports, $indicateur, $typeIndicateur)
    {
        $donneesGraphique = [];

        foreach ($rapports as $rapport) {
            if (isset($rapport->$typeIndicateur) && isset($rapport->$typeIndicateur->$indicateur)) {
                $donneesGraphique[] = [
                    'annee' => $rapport->annee,
                    'valeur' => $rapport->$typeIndicateur->$indicateur
                ];
            }
        }

        // Calculer les tendances (moyenne mobile, taux de croissance annuel moyen, etc.)
        $statistiques = $this->calculerStatistiquesTendance($donneesGraphique, $indicateur);

        return [
            'graphique' => $donneesGraphique,
            'statistiques' => $statistiques
        ];
    }

    /**
     * Calcule les statistiques de tendance.
     *
     * @param  array  $donnees
     * @param  string  $indicateur
     * @return array
     */
    private function calculerStatistiquesTendance($donnees, $indicateur)
    {
        if (empty($donnees)) {
            return [];
        }

        // Extraire les valeurs
        $valeurs = array_column($donnees, 'valeur');

        // Calculer la variation globale
        $premiereValeur = $valeurs[0] ?? null;
        $derniereValeur = end($valeurs) ?? null;

        $variationGlobale = null;
        if ($premiereValeur !== null && $derniereValeur !== null && $premiereValeur != 0) {
            $variationGlobale = (($derniereValeur - $premiereValeur) / $premiereValeur) * 100;
        }

        // Calculer le taux de croissance annuel moyen (TCAM)
        $tcam = null;
        $nombreAnnees = count($donnees) - 1;

        if ($nombreAnnees > 0 && $premiereValeur !== null && $derniereValeur !== null && $premiereValeur != 0) {
            $tcam = (pow(($derniereValeur / $premiereValeur), (1 / $nombreAnnees)) - 1) * 100;
        }

        // Calculer les variations annuelles
        $variationsAnnuelles = [];
        for ($i = 1; $i < count($valeurs); $i++) {
            if ($valeurs[$i-1] != 0) {
                $variation = (($valeurs[$i] - $valeurs[$i-1]) / $valeurs[$i-1]) * 100;
                $variationsAnnuelles[] = [
                    'annee' => $donnees[$i]['annee'],
                    'variation' => $variation
                ];
            }
        }

        return [
            'premiereAnnee' => $donnees[0]['annee'] ?? null,
            'derniereAnnee' => $donnees[count($donnees) - 1]['annee'] ?? null,
            'premiereValeur' => $premiereValeur,
            'derniereValeur' => $derniereValeur,
            'variationGlobale' => $variationGlobale,
            'tcam' => $tcam,
            'variationsAnnuelles' => $variationsAnnuelles,
            'min' => min($valeurs),
            'max' => max($valeurs),
            'moyenne' => array_sum($valeurs) / count($valeurs)
        ];
    }
}
