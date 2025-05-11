<?php

namespace App\Services\Calculateurs;

use App\Models\Collecte;
use Illuminate\Support\Facades\Log;

class IndicateurAnnuelCalculateur extends IndicateurCalculateurBase
{
    /**
     * Définition des indicateurs annuels avec leurs formules et dépendances
     * avec des libellés plus clairs pour l'UX
     */
    protected function getDefinitionsIndicateurs(): array
    {
        return [
            // Ratios de rentabilité et solvabilité
            'Indicateurs Financiers et de Rentabilité' => [
                'r_n_exploitation_aimp' => [
                    'libelle' => 'Rentabilité des Fonds Propres (ROE)',
                    'definition' => 'Mesure la capacité de l\'entreprise à générer des profits à partir des fonds propres investis',
                    'unite' => '%',
                    'valeur_cible' => '10% min',
                    'formule' => 'r_n_exploitation_aimp / moyenne_capitaux_propre * 100',
                    'dependances' => [
                        'r_n_exploitation_aimp',
                        'moyenne_capitaux_propre'
                    ]
                ],
                'autosuffisance' => [
                    'libelle' => 'Niveau d\'Autosuffisance Opérationnelle',
                    'definition' => 'Capacité de l\'entreprise à couvrir ses charges par ses propres produits',
                    'unite' => '',
                    'valeur_cible' => '15% min',
                    'formule' => 'produit_exploitation / (charges_financières + charges_exploitation)',
                    'dependances' => [
                        'produit_exploitation',
                        'charges_financières',
                        'charges_exploitation'
                    ]
                ],
                'marge_beneficiaire' => [
                    'libelle' => 'Marge Bénéficiaire',
                    'definition' => 'Pourcentage de profit par rapport au chiffre d\'affaires',
                    'unite' => '%',
                    'valeur_cible' => '0,2',
                    'formule' => 'resultat_net_exploitation / produit_exploitation * 100',
                    'dependances' => [
                        'resultat_net_exploitation',
                        'produit_exploitation'
                    ]
                ],
                'ratio_charges_financieres' => [
                    'libelle' => 'Taux d\'Endettement',
                    'definition' => 'Ratio des charges financières par rapport aux dettes de financement',
                    'unite' => '%',
                    'valeur_cible' => '12% max',
                    'formule' => 'charges_financières / dette_financement * 100',
                    'dependances' => [
                        'charges_financières',
                        'dette_financement'
                    ]
                ],
                // Indicateurs bruts avec libellés améliorés
                'charges_financières' => [
                    'libelle' => 'Total des Charges Financières',
                    'definition' => 'Montant total des intérêts et frais financiers payés',
                    'unite' => 'FCFA',
                    'valeur_cible' => '',
                    'formule' => null,
                    'dependances' => []
                ],
                'dette_financement' => [
                    'libelle' => 'Total des Dettes de Financement',
                    'definition' => 'Ensemble des emprunts à long et moyen terme',
                    'unite' => 'FCFA',
                    'valeur_cible' => '',
                    'formule' => null,
                    'dependances' => []
                ],
                'moyenne_capitaux_propre' => [
                    'libelle' => 'Capitaux Propres Moyens',
                    'definition' => 'Moyenne annuelle des capitaux propres',
                    'unite' => 'FCFA',
                    'valeur_cible' => '',
                    'formule' => null,
                    'dependances' => []
                ],
                'produit_exploitation' => [
                    'libelle' => 'Chiffre d\'Affaires Total',
                    'definition' => 'Revenus totaux générés par l\'exploitation',
                    'unite' => 'FCFA',
                    'valeur_cible' => '',
                    'formule' => null,
                    'dependances' => []
                ],
                'charges_exploitation' => [
                    'libelle' => 'Total des Charges d\'Exploitation',
                    'definition' => 'Coûts directs liés à l\'activité principale',
                    'unite' => 'FCFA',
                    'valeur_cible' => '',
                    'formule' => null,
                    'dependances' => []
                ],
                'resultat_net_exploitation' => [
                    'libelle' => 'Bénéfice Net d\'Exploitation',
                    'definition' => 'Profit après déduction de toutes les charges',
                    'unite' => 'FCFA',
                    'valeur_cible' => '',
                    'formule' => null,
                    'dependances' => []
                ],
            ],

            // Indicateurs de trésorerie
            'Gestion de la Trésorerie et du Crédit' => [
                'nombres_credits' => [
                    'libelle' => 'Nombre de Crédits Obtenus',
                    'definition' => 'Nombre total de prêts accordés à l\'entreprise',
                    'unite' => '',
                    'valeur_cible' => '',
                    'formule' => null,
                    'dependances' => []
                ],
                'montant_credit' => [
                    'libelle' => 'Montant Total des Crédits',
                    'definition' => 'Somme cumulée de tous les crédits reçus',
                    'unite' => 'FCFA',
                    'valeur_cible' => '',
                    'formule' => null,
                    'dependances' => []
                ],
                'montant_moyen_credit' => [
                    'libelle' => 'Montant Moyen par Crédit',
                    'definition' => 'Valeur moyenne des crédits obtenus',
                    'unite' => 'FCFA',
                    'valeur_cible' => '',
                    'formule' => 'nombres_credits > 0 ? montant_credit / nombres_credits : 0',
                    'dependances' => [
                        'nombres_credits',
                        'montant_credit'
                    ]
                ],
                'taux_endettement' => [
                    'libelle' => 'Taux d\'Endettement Global',
                    'definition' => 'Ratio des dettes totales sur les capitaux propres',
                    'unite' => '%',
                    'valeur_cible' => '150% max',
                    'formule' => 'dette_financement / moyenne_capitaux_propre * 100',
                    'dependances' => [
                        'dette_financement',
                        'moyenne_capitaux_propre'
                    ]
                ],
            ],

            // Indicateurs de performance projet
            'Impact et Performance du Projet' => [
                'prop_revenu_accru_h' => [
                    'libelle' => 'Hommes avec Revenus Améliorés',
                    'definition' => 'Pourcentage de bénéficiaires masculins ayant augmenté leurs revenus',
                    'unite' => '%',
                    'valeur_cible' => 'Promoteurs',
                    'formule' => null,
                    'dependances' => []
                ],
                'prop_revenu_accru_f' => [
                    'libelle' => 'Femmes avec Revenus Améliorés',
                    'definition' => 'Pourcentage de bénéficiaires féminines ayant augmenté leurs revenus',
                    'unite' => '%',
                    'valeur_cible' => 'Promoteurs',
                    'formule' => null,
                    'dependances' => []
                ],
                'acces_financement' => [
                    'libelle' => 'Bénéficiaires ayant Accès au Crédit',
                    'definition' => 'Nombre de promoteurs qui ont obtenu un financement',
                    'unite' => '',
                    'valeur_cible' => 'Promoteurs',
                    'formule' => null,
                    'dependances' => []
                ],
                'taux_revenus_ameliores' => [
                    'libelle' => 'Taux Global d\'Amélioration des Revenus',
                    'definition' => 'Pourcentage total de bénéficiaires avec des revenus accrus',
                    'unite' => '%',
                    'valeur_cible' => '70% min',
                    'formule' => '(prop_revenu_accru_h + prop_revenu_accru_f) / 2',
                    'dependances' => [
                        'prop_revenu_accru_h',
                        'prop_revenu_accru_f'
                    ]
                ],
            ],
        ];
    }

    /**
     * Calculer les indicateurs spécifiques à la période annuelle
     *
     * @param array $donneesCollecte Les données brutes de la collecte
     * @param array $donneesReference Données de référence
     * @return array Les données complétées avec les indicateurs calculés
     */
    public function calculerIndicateurs(array $donneesCollecte, array $donneesReference = []): array
    {
        $resultat = $donneesCollecte;
        $definitions = $this->getDefinitionsIndicateurs();

        foreach ($definitions as $categorie => $indicateurs) {
            if (!isset($resultat[$categorie])) {
                $resultat[$categorie] = [];
            }

            foreach ($indicateurs as $id => $definition) {
                // Si l'indicateur existe déjà dans les données saisies, on ne le recalcule pas
                if (isset($resultat[$categorie][$id]) || empty($definition['formule'])) {
                    continue;
                }

                // Vérifier si toutes les dépendances sont disponibles
                $dependancesDispo = true;
                $variablesValeurs = [];

                foreach ($definition['dependances'] as $dep) {
                    // Chercher dans la même catégorie d'abord
                    if (isset($resultat[$categorie][$dep])) {
                        $variablesValeurs[$dep] = $resultat[$categorie][$dep];
                    } else {
                        // Chercher dans d'autres catégories
                        $found = false;
                        foreach ($resultat as $cat => $inds) {
                            if (isset($inds[$dep])) {
                                $variablesValeurs[$dep] = $inds[$dep];
                                $found = true;
                                break;
                            }
                        }

                        if (!$found) {
                            $dependancesDispo = false;
                            Log::info("Dépendance manquante pour $id: $dep");
                            break;
                        }
                    }
                }

                // Si toutes les dépendances sont disponibles, calculer l'indicateur
                if ($dependancesDispo) {
                    try {
                        $valeur = $this->evaluerFormule($definition['formule'], $variablesValeurs);
                        $resultat[$categorie][$id] = $valeur;

                        // Log pour débogage
                        Log::info("Calculé $categorie.$id = $valeur", [
                            'formule' => $definition['formule'],
                            'variables' => $variablesValeurs
                        ]);
                    } catch (\Exception $e) {
                        Log::error("Erreur de calcul pour l'indicateur $id: " . $e->getMessage());
                    }
                }
            }
        }

        return $resultat;
    }

    /**
     * Récupérer les données de référence pour les calculs
     *
     * @param int|null $exerciceId
     * @param int|null $entrepriseId
     * @return array
     */
    public function getDonneesReference(?int $exerciceId = null, ?int $entrepriseId = null): array
    {
        if ($exerciceId) {
            $exercicePrecedentId = $this->getExercicePrecedent($exerciceId);

            if ($exercicePrecedentId) {
                $collectes = Collecte::where('exercice_id', $exercicePrecedentId)
                    ->where('type_collecte', 'standard')
                    ->where('periode', 'Annuelle');

                if ($entrepriseId) {
                    $collectes->where('entreprise_id', $entrepriseId);
                }

                $donnees = [];

                foreach ($collectes->get() as $collecte) {
                    $donneesCollecte = is_array($collecte->donnees) ? $collecte->donnees : json_decode($collecte->donnees, true);

                    if (is_array($donneesCollecte)) {
                        foreach ($donneesCollecte as $categorie => $indicateurs) {
                            if (!isset($donnees[$categorie])) {
                                $donnees[$categorie] = [];
                            }

                            foreach ($indicateurs as $id => $valeur) {
                                if (!isset($donnees[$categorie][$id])) {
                                    $donnees[$categorie][$id] = $valeur;
                                }
                            }
                        }
                    }
                }

                return $donnees;
            }
        }

        return [];
    }

    /**
     * Récupérer l'ID de l'exercice précédent
     *
     * @param int $exerciceId
     * @return int|null
     */
    private function getExercicePrecedent(int $exerciceId): ?int
    {
        $exercice = \App\Models\Exercice::find($exerciceId);

        if (!$exercice) {
            return null;
        }

        $exercicePrecedent = \App\Models\Exercice::where('annee', $exercice->annee - 1)
            ->first();

        return $exercicePrecedent ? $exercicePrecedent->id : null;
    }
}
