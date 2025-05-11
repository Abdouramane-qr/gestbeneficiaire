<?php

namespace App\Services\Calculateurs;

use App\Models\Collecte;
use Illuminate\Support\Facades\Log;

class IndicateurSemestrielCalculateur extends IndicateurCalculateurBase
{
    /**
     * Définition des indicateurs semestriels avec leurs formules et dépendances
     * avec des libellés plus clairs pour l'UX
     */
    protected function getDefinitionsIndicateurs(): array
    {
        return [
            // Indicateurs d'activité semestriels
            'Performance Opérationnelle' => [
                'nbr_cycle_production' => [
                    'libelle' => 'Cycles de Production Réalisés',
                    'definition' => 'Nombre de cycles complets de production sur le semestre',
                    'unite' => '',
                    'valeur_cible' => '25 min',
                    'formule' => null,
                    'dependances' => []
                ],
                'nbr_clients' => [
                    'libelle' => 'Clients Réguliers',
                    'definition' => 'Nombre de clients ayant effectué plusieurs achats',
                    'unite' => '',
                    'valeur_cible' => '40 min',
                    'formule' => null,
                    'dependances' => []
                ],
                'chiffre_affaire' => [
                    'libelle' => 'Chiffre d\'Affaires Semestriel',
                    'definition' => 'Revenus totaux générés sur le semestre',
                    'unite' => 'FCFA',
                    'valeur_cible' => '30000000 min',
                    'formule' => null,
                    'dependances' => []
                ],
                'taux_croissance_ca' => [
                    'libelle' => 'Croissance du Chiffre d\'Affaires',
                    'definition' => 'Evolution du CA par rapport au semestre précédent',
                    'unite' => '%',
                    'valeur_cible' => '10% min',
                    'formule' => null, // Nécessite les données du semestre précédent
                    'dependances' => []
                ],
                // Indicateurs calculés
                'ca_moyen_par_client' => [
                    'libelle' => 'Chiffre d\'Affaires Moyen par Client',
                    'definition' => 'Valeur moyenne des achats par client',
                    'unite' => 'FCFA',
                    'valeur_cible' => '750000 min',
                    'formule' => 'nbr_clients > 0 ? chiffre_affaire / nbr_clients : 0',
                    'dependances' => [
                        'chiffre_affaire',
                        'nbr_clients'
                    ]
                ],
                'productivite_cycles' => [
                    'libelle' => 'Productivité par Cycle',
                    'definition' => 'Chiffre d\'affaires généré par cycle de production',
                    'unite' => 'FCFA',
                    'valeur_cible' => '1200000 min',
                    'formule' => 'nbr_cycle_production > 0 ? chiffre_affaire / nbr_cycle_production : 0',
                    'dependances' => [
                        'chiffre_affaire',
                        'nbr_cycle_production'
                    ]
                ],
                'frequence_achat_client' => [
                    'libelle' => 'Fréquence d\'Achat Moyenne',
                    'definition' => 'Nombre d\'achats moyens par client',
                    'unite' => 'fois',
                    'valeur_cible' => '3 min',
                    'formule' => null, // Nécessite des données détaillées des transactions
                    'dependances' => []
                ],
            ],

            // Indicateurs de rentabilité et solvabilité
            'Rentabilité et Structure des Coûts' => [
                'cout_matiere_premiere' => [
                    'libelle' => 'Coût Total des Matières Premières',
                    'definition' => 'Dépenses totales en approvisionnements',
                    'unite' => 'FCFA',
                    'valeur_cible' => '',
                    'formule' => null,
                    'dependances' => []
                ],
                'cout_main_oeuvre' => [
                    'libelle' => 'Coût de la Main-d\'Œuvre',
                    'definition' => 'Salaires et charges directes de personnel',
                    'unite' => 'FCFA',
                    'valeur_cible' => '',
                    'formule' => null,
                    'dependances' => []
                ],
                'cout_frais_generaux' => [
                    'libelle' => 'Frais Généraux',
                    'definition' => 'Charges administratives et générales',
                    'unite' => 'FCFA',
                    'valeur_cible' => '',
                    'formule' => null,
                    'dependances' => []
                ],
                // Indicateurs calculés
                'cout_total_production' => [
                    'libelle' => 'Coût Total de Production',
                    'definition' => 'Ensemble des coûts directs et indirects',
                    'unite' => 'FCFA',
                    'valeur_cible' => '',
                    'formule' => 'cout_matiere_premiere + cout_main_oeuvre + cout_frais_generaux',
                    'dependances' => [
                        'cout_matiere_premiere',
                        'cout_main_oeuvre',
                        'cout_frais_generaux'
                    ]
                ],
                'marge_brute' => [
                    'libelle' => 'Marge Brute',
                    'definition' => 'Différence entre le CA et les coûts directs',
                    'unite' => 'FCFA',
                    'valeur_cible' => '',
                    'formule' => 'chiffre_affaire - cout_total_production',
                    'dependances' => [
                        'chiffre_affaire',
                        'cout_total_production'
                    ]
                ],
                'taux_marge_brute' => [
                    'libelle' => 'Taux de Marge Brute',
                    'definition' => 'Pourcentage de marge sur le chiffre d\'affaires',
                    'unite' => '%',
                    'valeur_cible' => '35% min',
                    'formule' => 'chiffre_affaire > 0 ? (marge_brute / chiffre_affaire) * 100 : 0',
                    'dependances' => [
                        'marge_brute',
                        'chiffre_affaire'
                    ]
                ],
                'cout_unitaire_production' => [
                    'libelle' => 'Coût Unitaire de Production',
                    'definition' => 'Coût moyen par unité produite',
                    'unite' => 'FCFA',
                    'valeur_cible' => '',
                    'formule' => 'nbr_cycle_production > 0 ? cout_total_production / nbr_cycle_production : 0',
                    'dependances' => [
                        'cout_total_production',
                        'nbr_cycle_production'
                    ]
                ],
                'ratio_couts_structure' => [
                    'libelle' => 'Répartition des Coûts',
                    'definition' => 'Proportion des différents types de coûts',
                    'unite' => '%',
                    'valeur_cible' => '',
                    'formule' => 'cout_total_production > 0 ? (cout_matiere_premiere / cout_total_production) * 100 : 0',
                    'dependances' => [
                        'cout_matiere_premiere',
                        'cout_total_production'
                    ]
                ],
                // Nouveaux ratios de rentabilité
                'rendement_capitaux_employes' => [
                    'libelle' => 'Rendement des Capitaux Employés',
                    'definition' => 'Efficiency des capitaux investis dans la production',
                    'unite' => '%',
                    'valeur_cible' => '15% min',
                    'formule' => null, // Nécessite données des capitaux
                    'dependances' => []
                ],
                'rotation_stocks' => [
                    'libelle' => 'Rotation des Stocks',
                    'definition' => 'Nombre de fois où les stocks sont renouvelés',
                    'unite' => 'fois',
                    'valeur_cible' => '6 min',
                    'formule' => null, // Nécessite données des stocks
                    'dependances' => []
                ],
            ],

            // Indicateurs de performance projet
            'Impact du Projet Semestriel' => [
                'total_autres_revenus' => [
                    'libelle' => 'Revenus Annexes',
                    'definition' => 'Revenus hors activité principale',
                    'unite' => 'FCFA',
                    'valeur_cible' => '5000000 min',
                    'formule' => null,
                    'dependances' => []
                ],
                'nombre_formations_realisees' => [
                    'libelle' => 'Formations Dispensées',
                    'definition' => 'Nombre de formations données aux bénéficiaires',
                    'unite' => '',
                    'valeur_cible' => '6 min',
                    'formule' => null,
                    'dependances' => []
                ],
                'nombre_participants_formations' => [
                    'libelle' => 'Participants aux Formations',
                    'definition' => 'Total des participants formés',
                    'unite' => '',
                    'valeur_cible' => '100 min',
                    'formule' => null,
                    'dependances' => []
                ],
                // Indicateurs calculés
                'revenu_total_semestriel' => [
                    'libelle' => 'Revenus Totaux',
                    'definition' => 'Somme de tous les revenus du semestre',
                    'unite' => 'FCFA',
                    'valeur_cible' => '',
                    'formule' => 'chiffre_affaire + total_autres_revenus',
                    'dependances' => [
                        'chiffre_affaire',
                        'total_autres_revenus'
                    ]
                ],
                'taux_participation_formations' => [
                    'libelle' => 'Taux de Participation aux Formations',
                    'definition' => 'Pourcentage de la cible atteinte en formation',
                    'unite' => '%',
                    'valeur_cible' => '85% min',
                    'formule' => null, // Nécessite la cible totale de participants
                    'dependances' => []
                ],
                'impact_socio_economique' => [
                    'libelle' => 'Score d\'Impact Socio-économique',
                    'definition' => 'Indicateur composite d\'impact du projet',
                    'unite' => '/10',
                    'valeur_cible' => '7/10 min',
                    'formule' => '((nbr_clients/50) + (nombre_participants_formations/100)) * 5',
                    'dependances' => [
                        'nbr_clients',
                        'nombre_participants_formations'
                    ]
                ],
                'productivite_globale' => [
                    'libelle' => 'Productivité Globale',
                    'definition' => 'Ratio entre la valeur produite et les ressources consommées',
                    'unite' => '',
                    'valeur_cible' => '1.5 min',
                    'formule' => 'revenu_total_semestriel / cout_total_production',
                    'dependances' => [
                        'revenu_total_semestriel',
                        'cout_total_production'
                    ]
                ],
                'efficacite_formations' => [
                    'libelle' => 'Efficacité des Formations',
                    'definition' => 'Ratio participants par session de formation',
                    'unite' => 'participants/session',
                    'valeur_cible' => '15 min',
                    'formule' => 'nombre_formations_realisees > 0 ? nombre_participants_formations / nombre_formations_realisees : 0',
                    'dependances' => [
                        'nombre_participants_formations',
                        'nombre_formations_realisees'
                    ]
                ],
            ],

            // Indicateurs de qualité et service client
            'Qualité et Service Client' => [
                'taux_satisfaction_clients' => [
                    'libelle' => 'Taux de Satisfaction Client',
                    'definition' => 'Pourcentage de clients satisfaits',
                    'unite' => '%',
                    'valeur_cible' => '85% min',
                    'formule' => null,
                    'dependances' => []
                ],
                'nombre_reclamations' => [
                    'libelle' => 'Réclamations Clients',
                    'definition' => 'Nombre de réclamations reçues',
                    'unite' => '',
                    'valeur_cible' => '10 max',
                    'formule' => null,
                    'dependances' => []
                ],
                'taux_fidelisation' => [
                    'libelle' => 'Taux de Fidélisation',
                    'definition' => 'Pourcentage de clients ayant renouvelé leurs achats',
                    'unite' => '%',
                    'valeur_cible' => '70% min',
                    'formule' => null,
                    'dependances' => []
                ],
                // Indicateurs calculés
                'score_qualite_global' => [
                    'libelle' => 'Score Qualité Global',
                    'definition' => 'Indicateur composite de la qualité perçue',
                    'unite' => '/100',
                    'valeur_cible' => '80/100 min',
                    'formule' => '(taux_satisfaction_clients * 0.6) + ((100 - (nombre_reclamations/nbr_clients * 100)) * 0.4)',
                    'dependances' => [
                        'taux_satisfaction_clients',
                        'nombre_reclamations',
                        'nbr_clients'
                    ]
                ],
                'indice_service_client' => [
                    'libelle' => 'Indice Service Client',
                    'definition' => 'Performance globale du service client',
                    'unite' => '/10',
                    'valeur_cible' => '8/10 min',
                    'formule' => '(taux_satisfaction_clients/10) * (taux_fidelisation/10)',
                    'dependances' => [
                        'taux_satisfaction_clients',
                        'taux_fidelisation'
                    ]
                ],
            ],
        ];
    }

    /**
     * Calculer les indicateurs spécifiques à la période semestrielle
     *
     * @param array $donneesCollecte Les données brutes de la collecte
     * @param array $donneesReference Données de référence
     * @return array Les données complétées avec les indicateurs calculés
     */
    public function calculerIndicateurs(array $donneesCollecte, array $donneesReference = []): array
    {
        $resultat = $donneesCollecte;
        $definitions = $this->getDefinitionsIndicateurs();

        // Parcourir les catégories et indicateurs pour effectuer les calculs
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
            // Récupérer le semestre précédent pour les calculs de croissance
            $periodePrecedente = $this->getSemestrePrecedent($exerciceId, $entrepriseId);

            if ($periodePrecedente) {
                return $periodePrecedente;
            }
        }

        return [];
    }

    /**
     * Récupérer les données du semestre précédent
     *
     * @param int $exerciceId
     * @param int|null $entrepriseId
     * @return array|null
     */
    private function getSemestrePrecedent(int $exerciceId, ?int $entrepriseId = null): ?array
    {
        // Trouver le semestre précédent dans le même exercice ou l'exercice précédent
        $exercice = \App\Models\Exercice::find($exerciceId);

        if (!$exercice) {
            return null;
        }

        // Construire la requête pour trouver le semestre précédent
        $query = Collecte::where('type_collecte', 'standard')
            ->where('periode', 'like', '%Semestriel%');

        if ($entrepriseId) {
            $query->where('entreprise_id', $entrepriseId);
        }

        // Chercher dans le même exercice d'abord
        $collecte = $query->where('exercice_id', $exerciceId)
            ->orderBy('date_collecte', 'desc')
            ->skip(1)
            ->take(1)
            ->first();

        if (!$collecte) {
            // Chercher dans l'exercice précédent
            $exercicePrecedent = \App\Models\Exercice::where('annee', $exercice->annee - 1)->first();

            if ($exercicePrecedent) {
                $collecte = $query->where('exercice_id', $exercicePrecedent->id)
                    ->orderBy('date_collecte', 'desc')
                    ->first();
            }
        }

        if ($collecte) {
            return is_array($collecte->donnees) ? $collecte->donnees : json_decode($collecte->donnees, true);
        }

        return null;
    }

    /**
     * Récupérer la liste des catégories d'indicateurs
     *
     * @return array
     */
    public function getCategoriesIndicateurs(): array
    {
        return array_keys($this->getDefinitionsIndicateurs());
    }

    /**
     * Vérifier si un indicateur est calculé
     *
     * @param string $categorie
     * @param string $indicateurId
     * @return bool
     */
    public function estIndicateurCalcule(string $categorie, string $indicateurId): bool
    {
        $definitions = $this->getDefinitionsIndicateurs();

        if (isset($definitions[$categorie][$indicateurId])) {
            return !empty($definitions[$categorie][$indicateurId]['formule']);
        }

        return false;
    }

    /**
     * Obtenir les métadonnées d'un indicateur
     *
     * @param string $categorie
     * @param string $indicateurId
     * @return array|null
     */
    public function getMetadataIndicateur(string $categorie, string $indicateurId): ?array
    {
        $definitions = $this->getDefinitionsIndicateurs();

        if (isset($definitions[$categorie][$indicateurId])) {
            return $definitions[$categorie][$indicateurId];
        }

        return null;
    }

    /**
     * Obtenir la liste des formules pour les indicateurs calculés
     *
     * @return array
     */
    public function getFormules(): array
    {
        $formules = [];
        $definitions = $this->getDefinitionsIndicateurs();

        foreach ($definitions as $categorie => $indicateurs) {
            foreach ($indicateurs as $id => $definition) {
                if (!empty($definition['formule'])) {
                    $formules[] = [
                        'id' => $id,
                        'categorie' => $categorie,
                        'expression' => $definition['formule'],
                        'dependances' => $definition['dependances']
                    ];
                }
            }
        }

        return $formules;
    }
}
