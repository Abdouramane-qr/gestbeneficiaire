<?php

namespace App\Services\Calculateurs;

use App\Models\Collecte;
use Illuminate\Support\Facades\Log;

class IndicateurAnnuelCalculateur extends IndicateurCalculateurBase
{
    /**
     * Définition des indicateurs annuels avec leurs formules et dépendances
     */
    protected function getDefinitionsIndicateurs(): array
    {
        return [
            // Ratios de Rentabilité et de solvabilité de l'entreprise
            'Ratios de Rentabilité et de solvabilité de l\'entreprise' => [
                'r_n_exploitation_aimp' => [
                    'libelle' => 'Rendement des fonds propres (ROE)',
                    'definition' => 'Résultat net d\'exploitation après impôts / Moyenne des capitaux propres',
                    'unite' => '%',
                    'valeur_cible' => '10% min',
                    'formule' => 'r_n_exploitation_aimp / moyenne_capitaux_propre * 100',
                    'dependances' => [
                        'r_n_exploitation_aimp',
                        'moyenne_capitaux_propre'
                    ]
                ],
                'autosuffisance' => [
                    'libelle' => 'Autosuffisance opérationnelle',
                    'definition' => 'Produits d\'exploitation / (Charges financières + Charges d\'exploitation)',
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
                    'libelle' => 'Marge bénéficiaire',
                    'definition' => 'Résultat net d\'exploitation / Produits d\'exploitation',
                    'unite' => '%',
                    'valeur_cible' => '0,2',
                    'formule' => 'resultat_net_exploitation / produit_exploitation * 100',
                    'dependances' => [
                        'resultat_net_exploitation',
                        'produit_exploitation'
                    ]
                ],
                'ratio_charges_financieres' => [
                    'libelle' => 'Ratio de charges financières',
                    'definition' => 'Intérêts et frais financiers / dettes de financement',
                    'unite' => '%',
                    'valeur_cible' => '12% max',
                    'formule' => 'charges_financières / dette_financement * 100',
                    'dependances' => [
                        'charges_financières',
                        'dette_financement'
                    ]
                ],
                'charges_financières' => [
                    'libelle' => 'Charges financières',
                    'definition' => 'Montant des intérêts et frais financiers',
                    'unite' => 'FCFA',
                    'valeur_cible' => '',
                    'formule' => null,
                    'dependances' => []
                ],
                'dette_financement' => [
                    'libelle' => 'Dettes de financement',
                    'definition' => 'Montant total des dettes de financement',
                    'unite' => 'FCFA',
                    'valeur_cible' => '',
                    'formule' => null,
                    'dependances' => []
                ],
                'moyenne_capitaux_propre' => [
                    'libelle' => 'Moyenne des capitaux propres',
                    'definition' => 'Moyenne des capitaux propres sur la période',
                    'unite' => 'FCFA',
                    'valeur_cible' => '',
                    'formule' => null,
                    'dependances' => []
                ],
                'produit_exploitation' => [
                    'libelle' => 'Produits d\'exploitation',
                    'definition' => 'Montant total des produits d\'exploitation',
                    'unite' => 'FCFA',
                    'valeur_cible' => '',
                    'formule' => null,
                    'dependances' => []
                ],
                'charges_exploitation' => [
                    'libelle' => 'Charges d\'exploitation',
                    'definition' => 'Montant total des charges d\'exploitation',
                    'unite' => 'FCFA',
                    'valeur_cible' => '',
                    'formule' => null,
                    'dependances' => []
                ],
                'resultat_net_exploitation' => [
                    'libelle' => 'Résultat net d\'exploitation',
                    'definition' => 'Résultat net d\'exploitation',
                    'unite' => 'FCFA',
                    'valeur_cible' => '',
                    'formule' => null,
                    'dependances' => []
                ],
            ],

            // Indicateurs de trésorerie de l'entreprise du promoteur
            'Indicateurs de trésorerie de l\'entreprise du promoteur' => [
                'nombres_credits' => [
                    'libelle' => 'Nombre de crédits reçus',
                    'definition' => 'Nombre de crédits reçus au cours de l\'année N-1',
                    'unite' => '',
                    'valeur_cible' => '',
                    'formule' => null,
                    'dependances' => []
                ],
                'montant_credit' => [
                    'libelle' => 'Montant cumulé des crédits reçus',
                    'definition' => 'Montant total des crédits reçus au cours de l\'année N-1',
                    'unite' => 'FCFA',
                    'valeur_cible' => '',
                    'formule' => null,
                    'dependances' => []
                ],
            ],

            // Indicateurs de performance Projet
            'Indicateurs de performance Projet' => [
                'prop_revenu_accru_h' => [
                    'libelle' => 'Proportion d\'hommes avec revenus accrus',
                    'definition' => 'Proportion des jeunes hommes bénéficiaires qui ont augmenté leurs revenus grâce au projet',
                    'unite' => '%',
                    'valeur_cible' => 'Promoteurs',
                    'formule' => null,
                    'dependances' => []
                ],
                'prop_revenu_accru_f' => [
                    'libelle' => 'Proportion de femmes avec revenus accrus',
                    'definition' => 'Proportion des jeunes femmes bénéficiaires qui ont augmenté leurs revenus grâce au projet',
                    'unite' => '%',
                    'valeur_cible' => 'Promoteurs',
                    'formule' => null,
                    'dependances' => []
                ],
                'acces_financement' => [
                    'libelle' => 'Nombre de promoteurs bénéficiaires de crédit',
                    'definition' => 'Nombre de promoteurs qui ont accès à un crédit grâce au projet',
                    'unite' => '',
                    'valeur_cible' => 'Promoteurs',
                    'formule' => null,
                    'dependances' => []
                ],
            ],
        ];
    }

    /**
     * Calculer les indicateurs spécifiques à la période annuelle
     *
     * @param array $donneesCollecte Les données brutes de la collecte
     * @param array $donneesReference Données de référence (autres périodes, exercices précédents, etc.)
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
                if (isset($resultat[$categorie][$id])) {
                    continue;
                }

                // Si l'indicateur n'a pas de formule de calcul, on passe au suivant
                if (empty($definition['formule'])) {
                    continue;
                }

                // Vérifier si toutes les dépendances sont disponibles
                $dependancesDispo = true;
                $variablesValeurs = [];

                foreach ($definition['dependances'] as $dep) {
                    if (isset($resultat[$categorie][$dep])) {
                        $variablesValeurs[$dep] = $resultat[$categorie][$dep];
                    } elseif (isset($donneesReference[$categorie][$dep])) {
                        $variablesValeurs[$dep] = $donneesReference[$categorie][$dep];
                    } else {
                        $dependancesDispo = false;
                        break;
                    }
                }

                // Si toutes les dépendances sont disponibles, calculer l'indicateur
                if ($dependancesDispo) {
                    try {
                        $valeur = $this->evaluerFormule($definition['formule'], $variablesValeurs);
                        $resultat[$categorie][$id] = $valeur;
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
     * (Par exemple, données de l'exercice précédent pour calculer les évolutions)
     *
     * @param int|null $exerciceId
     * @param int|null $entrepriseId
     * @return array
     */
    public function getDonneesReference(?int $exerciceId = null, ?int $entrepriseId = null): array
    {
        // Récupérer les données de l'exercice précédent si nécessaire
        if ($exerciceId) {
            // Logique pour obtenir l'exercice précédent
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
                                } else {
                                    // Logique d'agrégation (moyenne, somme, dernier, etc.)
                                    // Pour l'exemple, on prend la dernière valeur
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
        // Cette méthode nécessiterait d'accéder à la table des exercices
        // Pour cet exemple, je l'implémente de manière simplifiée

        // Récupérer l'exercice actuel pour connaître son année
        $exercice = \App\Models\Exercice::find($exerciceId);

        if (!$exercice) {
            return null;
        }

        // Chercher un exercice avec une année précédente
        $exercicePrecedent = \App\Models\Exercice::where('annee', $exercice->annee - 1)
            ->first();

        return $exercicePrecedent ? $exercicePrecedent->id : null;
    }
}
