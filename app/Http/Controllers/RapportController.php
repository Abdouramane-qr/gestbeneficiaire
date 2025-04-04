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
use Illuminate\Support\Facades\Redirect;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class RapportController extends Controller
{
    /**
     * Affiche la liste des rapports d'une entreprise.
     *
     * @param  \App\Models\Entreprise  $entreprise
     * @return \Inertia\Response
     */
    /**
 * Affiche la liste de tous les rapports.
 */
public function index()
{
    $rapports = Rapport::with('entreprise')
        ->orderBy('updated_at', 'desc')
        ->paginate(15);

    return Inertia::render('Rapports/AllReports', [
        'rapports' => $rapports
    ]);
}

/**
 * Affiche le formulaire de création de rapport avec sélection d'entreprise.
 */
public function createGlobal()
{
    $entreprises = Entreprise::orderBy('nom')->get();

    return Inertia::render('Rapports/CreateGlobal', [
        'entreprises' => $entreprises
    ]);
}

    /**
     * Affiche le formulaire de création d'un rapport.
     *
     * @param  \App\Models\Entreprise  $entreprise
     * @return \Inertia\Response
     */
    public function create(Entreprise $entreprise)
    {
        // Liste des périodes disponibles
        $periodes = ['Trimestriel', 'Semestriel', 'Annuel'];

        // Liste des années (5 dernières années + année en cours + année suivante)
        $annees = range(Carbon::now()->year - 5, Carbon::now()->year + 1);

        // Récupérer les rapports existants pour éviter les doublons
        $rapportsExistants = $entreprise->rapports()
            ->select('periode', 'annee')
            ->get()
            ->map(function ($rapport) {
                return $rapport->periode . '-' . $rapport->annee;
            })
            ->toArray();

        return Inertia::render('Rapports/Create', [
            'entreprise' => $entreprise,
            'periodes' => $periodes,
            'annees' => $annees,
            'rapportsExistants' => $rapportsExistants
        ]);
    }

    /**
     * Enregistre un nouveau rapport.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Entreprise  $entreprise
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request, Entreprise $entreprise)
    {
        // Validation des données
        $validated = $request->validate([
            'periode' => 'required|string|in:Trimestriel,Semestriel,Annuel',
            'annee' => 'required|integer|min:2000|max:' . (Carbon::now()->year + 1),
        ]);

        // Vérifier si un rapport existe déjà pour cette période et cette année
        $existingRapport = Rapport::where('entreprise_id', $entreprise->id)
            ->where('periode', $validated['periode'])
            ->where('annee', $validated['annee'])
            ->first();

        if ($existingRapport) {
            return back()->withErrors([
                'general' => 'Un rapport existe déjà pour cette période et cette année.'
            ]);
        }

        // Ajouter l'entreprise_id aux données validées
        $validated['entreprise_id'] = $entreprise->id;

        // Création du rapport
        $rapport = Rapport::create($validated);

        // Créer les enregistrements vides pour chaque type d'indicateur
        IndicateurFinancier::create(['rapport_id' => $rapport->id]);
        IndicateurCommercial::create(['rapport_id' => $rapport->id]);
        IndicateurRH::create(['rapport_id' => $rapport->id]);
        IndicateurProduction::create(['rapport_id' => $rapport->id]);

        return Redirect::route('rapports.edit', [
            'entreprise' => $entreprise->id,
            'rapport' => $rapport->id
        ])->with('success', 'Rapport créé avec succès');
    }

    public function editTab($tab = 'financiers')
    {
        // Récupérer le dernier rapport ou un rapport par défaut
        $dernierRapport = Rapport::latest()->first();

        if (!$dernierRapport) {
            abort(404, 'Aucun rapport trouvé');
        }

        return Redirect::route('rapports.edit', [
            'entreprise' => $dernierRapport->entreprise_id,
            'rapport' => $dernierRapport->id,
            'tab' => $tab
        ]);
    }

    /**
     * Affiche le formulaire d'édition d'un rapport.
     *
     * @param  \App\Models\Entreprise  $entreprise
     * @param  \App\Models\Rapport  $rapport
     * @return \Inertia\Response
     */
    public function edit(Entreprise $entreprise, Rapport $rapport)
    {
        // Vérifier que le rapport appartient bien à l'entreprise
        if ($rapport->entreprise_id !== $entreprise->id) {
            abort(404);
        }

        // Charger tous les indicateurs liés au rapport
        $indicateursFinanciers = $rapport->indicateursFinanciers ?? new IndicateurFinancier();
        $indicateursCommerciaux = $rapport->indicateursCommerciaux ?? new IndicateurCommercial();
        $indicateursRH = $rapport->indicateursRH ?? new IndicateurRH();
        $indicateursProduction = $rapport->indicateursProduction ?? new IndicateurProduction();

        // Récupérer les données de la période précédente pour comparaison
        $periodesPrecedentes = $this->getPeriodesPrecedentes($entreprise, $rapport);

        // Récupérer les rapports précédents pour le même type de période
       // dd($rapport);
        $rapportPrecedent = Rapport::where('entreprise_id', $entreprise->id)
        ->where('periode', $rapport->periode)
        ->when(!is_null($rapport->annee), function ($query) use ($rapport) {
            $query->where('annee', '<', $rapport->annee)
                ->orWhere(function ($subQuery) use ($rapport) {
                    if (!is_null($rapport->id)) {
                        $subQuery->where('annee', '=', $rapport->annee)
                            ->where('id', '<', $rapport->id);
                    }
                });
        })
        ->orderBy('annee', 'desc')
        ->orderBy('id', 'desc')
        ->with(['indicateursFinanciers', 'indicateursCommerciaux', 'indicateursRH', 'indicateursProduction'])
        ->first();


        // Déterminer les droits de l'utilisateur pour les actions possibles
        $userRole = Auth::user()->role ?? 'utilisateur';
        $peutModifier = $rapport->statut !== 'validé' || $userRole === 'admin';
        $peutValider = $rapport->statut === 'soumis' && $userRole === 'admin';
        $peutRejeter = $rapport->statut === 'soumis' && $userRole === 'admin';
        $peutSoumettre = $rapport->statut === 'brouillon' || $rapport->statut === 'rejeté';

        return Inertia::render('Rapports/Edit', [
            'entreprise' => $entreprise,
            'rapport' => $rapport,
            'indicateursFinanciers' => $indicateursFinanciers,
            'indicateursCommerciaux' => $indicateursCommerciaux,
            'indicateursRH' => $indicateursRH,
            'indicateursProduction' => $indicateursProduction,
            'periodesPrecedentes' => $periodesPrecedentes,
            'rapportPrecedent' => $rapportPrecedent,
            'permissions' => [
                'peutModifier' => $peutModifier,
                'peutValider' => $peutValider,
                'peutRejeter' => $peutRejeter,
                'peutSoumettre' => $peutSoumettre
            ]
        ]);
    }

    /**
     * Met à jour un rapport spécifique.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Entreprise  $entreprise
     * @param  \App\Models\Rapport  $rapport
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, Entreprise $entreprise, Rapport $rapport)
    {
        // Vérifier que le rapport appartient bien à l'entreprise
        if ($rapport->entreprise_id !== $entreprise->id) {
            abort(404);
        }

        // Traitement selon l'action de soumission
        if ($request->has('submit_action')) {
            $action = $request->input('submit_action');

            // Vérifier les permissions selon le statut actuel et l'action demandée
            $userRole = Auth::user()->role ?? 'utilisateur';
            $peutModifierStatut = true;

            switch ($action) {
                case 'save_draft':
                    // Seulement si le rapport n'est pas validé ou si admin
                    $peutModifierStatut = $rapport->statut !== 'validé' || $userRole === 'admin';
                    $rapport->statut = 'brouillon';
                    break;

                case 'submit':
                    // Seulement si le rapport est en brouillon ou rejeté
                    $peutModifierStatut = $rapport->statut === 'brouillon' || $rapport->statut === 'rejeté';
                    $rapport->statut = 'soumis';
                    $rapport->date_soumission = now();
                    break;

                case 'validate':
                    // Seulement si admin et rapport est soumis
                    $peutModifierStatut = $userRole === 'admin' && $rapport->statut === 'soumis';
                    $rapport->statut = 'validé';
                    $rapport->valide_par = Auth::user()->name;
                    break;

                case 'reject':
                    // Seulement si admin et rapport est soumis
                    $peutModifierStatut = $userRole === 'admin' && $rapport->statut === 'soumis';
                    $rapport->statut = 'rejeté';
                    break;
            }

            if (!$peutModifierStatut) {
                return back()->withErrors([
                    'autorisation' => 'Vous n\'avez pas l\'autorisation d\'effectuer cette action.'
                ]);
            }

            // Sauvegarder les changements de statut
            $rapport->save();
        }

        // Mise à jour des indicateurs financiers
        if ($request->has('indicateurs_financiers')) {
            $this->updateIndicateursFinanciers($rapport, $request->input('indicateurs_financiers'));
        }

        // Mise à jour des indicateurs commerciaux
        if ($request->has('indicateurs_commerciaux')) {
            $this->updateIndicateursCommerciaux($rapport, $request->input('indicateurs_commerciaux'));
        }

        // Mise à jour des indicateurs RH
        if ($request->has('indicateurs_rh')) {
            $this->updateIndicateursRH($rapport, $request->input('indicateurs_rh'));
        }

        // Mise à jour des indicateurs de production
        if ($request->has('indicateurs_production')) {
            $this->updateIndicateursProduction($rapport, $request->input('indicateurs_production'));
        }

        return Redirect::route('rapports.edit', [
            'entreprise' => $entreprise->id,
            'rapport' => $rapport->id
        ])->with('success', 'Rapport mis à jour avec succès');
    }

    /**
     * Supprime un rapport spécifique.
     *
     * @param  \App\Models\Entreprise  $entreprise
     * @param  \App\Models\Rapport  $rapport
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Entreprise $entreprise, Rapport $rapport)
    {
        // Vérifier que le rapport appartient bien à l'entreprise
        if ($rapport->entreprise_id !== $entreprise->id) {
            abort(404);
        }

        // Vérifier si le rapport peut être supprimé
        if ($rapport->statut === 'validé') {
            return Redirect::back()->with('error', 'Impossible de supprimer un rapport validé.');
        }

        // Supprimer le rapport (les indicateurs associés seront supprimés automatiquement grâce aux contraintes onDelete('cascade'))
        $rapport->delete();

        return Redirect::route('rapports.edit', ['entreprise' => $entreprise->id])
            ->with('success', 'Rapport supprimé avec succès');
    }

    /**
     * Traite la soumission des indicateurs financiers.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Entreprise  $entreprise
     * @param  \App\Models\Rapport  $rapport
     * @return \Illuminate\Http\RedirectResponse
     */
    public function submitFinanciers(Request $request, Entreprise $entreprise, Rapport $rapport)
    {
        // Vérifier que le rapport appartient bien à l'entreprise
        if ($rapport->entreprise_id !== $entreprise->id) {
            abort(404);
        }

        // Valider les données
        $validated = $request->validate([
            'chiffre_affaires' => 'nullable|numeric|min:0',
            'resultat_net' => 'nullable|numeric',
            'ebitda' => 'nullable|numeric',
            'marge_ebitda' => 'nullable|numeric',
            'cash_flow' => 'nullable|numeric',
            'dette_nette' => 'nullable|numeric',
            'ratio_dette_ebitda' => 'nullable|numeric',
            'fonds_propres' => 'nullable|numeric',
            'ratio_endettement' => 'nullable|numeric',
            'besoin_fonds_roulement' => 'nullable|numeric',
            'tresorerie_nette' => 'nullable|numeric',
            'investissements' => 'nullable|numeric',
        ]);

        // Mettre à jour ou créer les indicateurs financiers
        $this->updateIndicateursFinanciers($rapport, $validated);

        return Redirect::back()->with('success', 'Indicateurs financiers enregistrés avec succès.');
    }

    /**
     * Traite la soumission des indicateurs commerciaux.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Entreprise  $entreprise
     * @param  \App\Models\Rapport  $rapport
     * @return \Illuminate\Http\RedirectResponse
     */
    public function submitCommerciaux(Request $request, Entreprise $entreprise, Rapport $rapport)
    {
        // Vérifier que le rapport appartient bien à l'entreprise
        if ($rapport->entreprise_id !== $entreprise->id) {
            abort(404);
        }

        // Valider les données
        $validated = $request->validate([
            'nombre_clients' => 'nullable|integer|min:0',
            'nouveaux_clients' => 'nullable|integer|min:0',
            'taux_retention' => 'nullable|numeric|min:0|max:100',
            'panier_moyen' => 'nullable|numeric|min:0',
            'delai_paiement_moyen' => 'nullable|integer|min:0',
            'export_pourcentage' => 'nullable|numeric|min:0|max:100',
            'top_5_clients_pourcentage' => 'nullable|numeric|min:0|max:100',
            'backlog' => 'nullable|numeric|min:0',
            'carnet_commandes' => 'nullable|numeric|min:0',
        ]);

        // Mettre à jour ou créer les indicateurs commerciaux
        $this->updateIndicateursCommerciaux($rapport, $validated);

        return Redirect::back()->with('success', 'Indicateurs commerciaux enregistrés avec succès.');
    }

    /**
     * Traite la soumission des indicateurs RH.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Entreprise  $entreprise
     * @param  \App\Models\Rapport  $rapport
     * @return \Illuminate\Http\RedirectResponse
     */
    public function submitRH(Request $request, Entreprise $entreprise, Rapport $rapport)
    {
        // Vérifier que le rapport appartient bien à l'entreprise
        if ($rapport->entreprise_id !== $entreprise->id) {
            abort(404);
        }

        // Valider les données
        $validated = $request->validate([
            'effectif_total' => 'nullable|integer|min:0',
            'cadres_pourcentage' => 'nullable|numeric|min:0|max:100',
            'turnover' => 'nullable|numeric|min:0|max:100',
            'absenteisme' => 'nullable|numeric|min:0|max:100',
            'masse_salariale' => 'nullable|numeric|min:0',
            'cout_formation' => 'nullable|numeric|min:0',
            'anciennete_moyenne' => 'nullable|numeric|min:0',
            'accidents_travail' => 'nullable|integer|min:0',
            'index_egalite' => 'nullable|numeric|min:0|max:100',
        ]);

        // Mettre à jour ou créer les indicateurs RH
        $this->updateIndicateursRH($rapport, $validated);

        return Redirect::back()->with('success', 'Indicateurs RH enregistrés avec succès.');
    }

    /**
     * Traite la soumission des indicateurs de production.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Entreprise  $entreprise
     * @param  \App\Models\Rapport  $rapport
     * @return \Illuminate\Http\RedirectResponse
     */
    public function submitProduction(Request $request, Entreprise $entreprise, Rapport $rapport)
    {
        // Vérifier que le rapport appartient bien à l'entreprise
        if ($rapport->entreprise_id !== $entreprise->id) {
            abort(404);
        }

        // Valider les données
        $validated = $request->validate([
            'taux_utilisation' => 'nullable|numeric|min:0|max:100',
            'taux_rebut' => 'nullable|numeric|min:0|max:100',
            'delai_production_moyen' => 'nullable|integer|min:0',
            'cout_production' => 'nullable|numeric|min:0',
            'stock_matieres_premieres' => 'nullable|numeric|min:0',
            'stock_produits_finis' => 'nullable|numeric|min:0',
            'rotation_stocks' => 'nullable|numeric|min:0',
            'incidents_qualite' => 'nullable|integer|min:0',
            'certifications' => 'nullable|string|max:255',
        ]);

        // Mettre à jour ou créer les indicateurs de production
        $this->updateIndicateursProduction($rapport, $validated);

        return Redirect::back()->with('success', 'Indicateurs de production enregistrés avec succès.');
    }

    /**
     * Met à jour les indicateurs financiers d'un rapport.
     *
     * @param  \App\Models\Rapport  $rapport
     * @param  array  $data
     * @return void
     */
    private function updateIndicateursFinanciers(Rapport $rapport, array $data)
    {
        // Récupérer l'indicateur existant ou en créer un nouveau
        $indicateur = $rapport->indicateursFinanciers;

        if (!$indicateur) {
            $data['rapport_id'] = $rapport->id;
            IndicateurFinancier::create($data);
        } else {
            $indicateur->update($data);
        }

        // Recalculer les champs dérivés
        $this->recalculateFinancialRatios($rapport);
    }

    /**
     * Met à jour les indicateurs commerciaux d'un rapport.
     *
     * @param  \App\Models\Rapport  $rapport
     * @param  array  $data
     * @return void
     */
    private function updateIndicateursCommerciaux(Rapport $rapport, array $data)
    {
        // Récupérer l'indicateur existant ou en créer un nouveau
        $indicateur = $rapport->indicateursCommerciaux;

        if (!$indicateur) {
            $data['rapport_id'] = $rapport->id;
            IndicateurCommercial::create($data);
        } else {
            $indicateur->update($data);
        }
    }

    /**
     * Met à jour les indicateurs RH d'un rapport.
     *
     * @param  \App\Models\Rapport  $rapport
     * @param  array  $data
     * @return void
     */
    private function updateIndicateursRH(Rapport $rapport, array $data)
    {
        // Récupérer l'indicateur existant ou en créer un nouveau
        $indicateur = $rapport->indicateursRH;

        if (!$indicateur) {
            $data['rapport_id'] = $rapport->id;
            IndicateurRH::create($data);
        } else {
            $indicateur->update($data);
        }
    }

    /**
     * Met à jour les indicateurs de production d'un rapport.
     *
     * @param  \App\Models\Rapport  $rapport
     * @param  array  $data
     * @return void
     */
    private function updateIndicateursProduction(Rapport $rapport, array $data)
    {
        // Récupérer l'indicateur existant ou en créer un nouveau
        $indicateur = $rapport->indicateursProduction;

        if (!$indicateur) {
            $data['rapport_id'] = $rapport->id;
            IndicateurProduction::create($data);
        } else {
            $indicateur->update($data);
        }
    }

    /**
     * Recalcule les ratios financiers automatiques.
     *
     * @param  \App\Models\Rapport  $rapport
     * @return void
     */
    private function recalculateFinancialRatios(Rapport $rapport)
    {
        $indicateur = $rapport->indicateursFinanciers;

        if (!$indicateur) {
            return;
        }

        // Recalculer la marge EBITDA
        if ($indicateur->chiffre_affaires > 0 && $indicateur->ebitda !== null) {
            $indicateur->marge_ebitda = ($indicateur->ebitda / $indicateur->chiffre_affaires) * 100;
        }

        // Recalculer le ratio dette/EBITDA
        if ($indicateur->ebitda > 0 && $indicateur->dette_nette !== null) {
            $indicateur->ratio_dette_ebitda = $indicateur->dette_nette / $indicateur->ebitda;
        }

        // Recalculer le ratio d'endettement
        if ($indicateur->fonds_propres > 0 && $indicateur->dette_nette !== null) {
            $indicateur->ratio_endettement = ($indicateur->dette_nette / $indicateur->fonds_propres) * 100;
        }

        $indicateur->save();
    }

    /**
     * Récupère les données des périodes précédentes pour comparaison.
     *
     * @param  \App\Models\Entreprise  $entreprise
     * @param  \App\Models\Rapport  $rapport
     * @return array
     */
    private function getPeriodesPrecedentes(Entreprise $entreprise, Rapport $rapport)
    {
        $periodesPrecedentes = [];

        // Récupérer le rapport de la même période de l'année précédente
        $rapportAnneePrecedente = Rapport::where('entreprise_id', $entreprise->id)
            ->where('periode', $rapport->periode)
            ->where('annee', $rapport->annee - 1)
            ->with(['indicateursFinanciers', 'indicateursCommerciaux', 'indicateursRH', 'indicateursProduction'])
            ->first();

        if ($rapportAnneePrecedente) {
            $periodesPrecedentes['anneePrecedente'] = [
                'rapport' => $rapportAnneePrecedente,
                'financiers' => $rapportAnneePrecedente->indicateursFinanciers,
                'commerciaux' => $rapportAnneePrecedente->indicateursCommerciaux,
                'rh' => $rapportAnneePrecedente->indicateursRH,
                'production' => $rapportAnneePrecedente->indicateursProduction,
            ];
        }

        // Pour les rapports trimestriels, récupérer le trimestre précédent
        if ($rapport->periode === 'Trimestriel') {
            // Déterminer le trimestre actuel et précédent
            $trimestre = $this->getTrimestre($rapport);
            $trimestrePrecedent = $trimestre - 1;
            $anneePrecedente = $rapport->annee;

            // Si on est au premier trimestre, le trimestre précédent est le 4ème de l'année précédente
            if ($trimestrePrecedent < 1) {
                $trimestrePrecedent = 4;
                $anneePrecedente = $rapport->annee - 1;
            }

            // Récupérer le rapport du trimestre précédent
            $rapportTrimestrePrecedent = Rapport::where('entreprise_id', $entreprise->id)
                ->where('periode', 'Trimestriel')
                ->where('annee', $anneePrecedente)
                ->whereRaw("SUBSTRING_INDEX(periode, ' ', -1) = ?", ["T{$trimestrePrecedent}"])
                ->with(['indicateursFinanciers', 'indicateursCommerciaux', 'indicateursRH', 'indicateursProduction'])
                ->first();

            if ($rapportTrimestrePrecedent) {
                $periodesPrecedentes['trimestrePrecedent'] = [
                    'rapport' => $rapportTrimestrePrecedent,
                    'financiers' => $rapportTrimestrePrecedent->indicateursFinanciers,
                    'commerciaux' => $rapportTrimestrePrecedent->indicateursCommerciaux,
                    'rh' => $rapportTrimestrePrecedent->indicateursRH,
                    'production' => $rapportTrimestrePrecedent->indicateursProduction,
                ];
            }
        }

        return $periodesPrecedentes;
    }

    /**
     * Détermine le numéro de trimestre à partir du rapport.
     *
     * @param  \App\Models\Rapport  $rapport
     * @return int
     */
    private function getTrimestre(Rapport $rapport)
    {
        if ($rapport->periode !== 'Trimestriel') {
            return 0;
        }

        // Si le format est "Trimestriel T1", "Trimestriel T2", etc.
        if (preg_match('/T(\d+)/', $rapport->periode, $matches)) {
            return (int) $matches[1];
        }

        // Sinon, essayer de déterminer à partir de la date de création
        $mois = Carbon::parse($rapport->created_at)->month;

        if ($mois <= 3) return 1;
        if ($mois <= 6) return 2;
        if ($mois <= 9) return 3;
        return 4;
    }
}
