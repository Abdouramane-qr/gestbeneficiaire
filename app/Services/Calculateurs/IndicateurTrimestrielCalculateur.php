<?php

namespace App\Services\Calculateurs;

use App\Models\Collecte;
use Illuminate\Support\Facades\Log;

class IndicateurTrimestrielCalculateur extends IndicateurCalculateurBase
{
    /**
     * Définition des indicateurs trimestriels avec leurs formules et dépendances
     * avec des libellés plus clairs pour l'UX
     */
    protected function getDefinitionsIndicateurs(): array
    {
        return [
            // Indicateurs commerciaux
            'Performance Commerciale' => [
                'propects_grossites' => [
                    'libelle' => 'Prospects Grossistes Contactés',
                    'definition' => 'Nombre de grossistes approchés pendant le trimestre',
                    'unite' => '',
                    'valeur_cible' => 'Promoteurs',
                    'formule' => null,
                    'dependances' => []
                ],
                'prospects_detaillant' => [
                    'libelle' => 'Prospects Détaillants Contactés',
                    'definition' => 'Nombre de détaillants prospectés pendant le trimestre',
                    'unite' => '',
                    'valeur_cible' => 'Promoteurs',
                    'formule' => null,
                    'dependances' => []
                ],
                'clients_grossistes' => [
                    'libelle' => 'Nouveaux Clients Grossistes',
                    'definition' => 'Grossistes convertis en clients effectifs',
                    'unite' => '',
                    'valeur_cible' => 'Promoteurs',
                    'formule' => null,
                    'dependances' => []
                ],
                'clients_detaillant' => [
                    'libelle' => 'Nouveaux Clients Détaillants',
                    'definition' => 'Détaillants convertis en clients effectifs',
                    'unite' => '',
                    'valeur_cible' => 'Promoteurs',
                    'formule' => null,
                    'dependances' => []
                ],
                'nbr_contrat_conclu' => [
                    'libelle' => 'Contrats Signés',
                    'definition' => 'Nombre de contrats finalisés avec succès',
                    'unite' => '',
                    'valeur_cible' => 'Promoteurs',
                    'formule' => null,
                    'dependances' => []
                ],
                'nbr_contrat_encours' => [
                    'libelle' => 'Contrats en Négociation',
                    'definition' => 'Contrats encore en phase de discussion',
                    'unite' => '',
                    'valeur_cible' => 'Promoteurs',
                    'formule' => null,
                    'dependances' => []
                ],
                'nbr_contrat_perdu' => [
                    'libelle' => 'Contrats Non Aboutis',
                    'definition' => 'Contrats échoués ou annulés',
                    'unite' => '',
                    'valeur_cible' => 'Promoteurs',
                    'formule' => null,
                    'dependances' => []
                ],
                // Indicateurs calculés
                'taux_succes_contrats' => [
                    'libelle' => 'Taux de Réussite des Contrats',
                    'definition' => 'Pourcentage de contrats aboutissant avec succès',
                    'unite' => '%',
                    'valeur_cible' => '75% min',
                    'formule' => '(nbr_contrat_conclu + nbr_contrat_encours + nbr_contrat_perdu) > 0 ? (nbr_contrat_conclu / (nbr_contrat_conclu + nbr_contrat_encours + nbr_contrat_perdu)) * 100 : 0',
                    'dependances' => [
                        'nbr_contrat_conclu',
                        'nbr_contrat_encours',
                        'nbr_contrat_perdu'
                    ]
                ],
                'total_clients_prospectes' => [
                    'libelle' => 'Total Prospects Contactés',
                    'definition' => 'Ensemble des prospects approchés (grossistes + détaillants)',
                    'unite' => '',
                    'valeur_cible' => '',
                    'formule' => 'propects_grossites + prospects_detaillant',
                    'dependances' => [
                        'propects_grossites',
                        'prospects_detaillant'
                    ]
                ],
                'total_nouveaux_clients' => [
                    'libelle' => 'Total Nouveaux Clients',
                    'definition' => 'Ensemble des nouveaux clients acquis',
                    'unite' => '',
                    'valeur_cible' => '',
                    'formule' => 'clients_grossistes + clients_detaillant',
                    'dependances' => [
                        'clients_grossistes',
                        'clients_detaillant'
                    ]
                ],
                'taux_conversion_prospects' => [
                    'libelle' => 'Taux de Conversion Commercial',
                    'definition' => 'Efficacité de conversion des prospects en clients',
                    'unite' => '%',
                    'valeur_cible' => '30% min',
                    'formule' => 'total_clients_prospectes > 0 ? (total_nouveaux_clients / total_clients_prospectes) * 100 : 0',
                    'dependances' => [
                        'total_nouveaux_clients',
                        'total_clients_prospectes'
                    ]
                ],
                'ratio_client_type' => [
                    'libelle' => 'Ratio Grossistes/Détaillants',
                    'definition' => 'Répartition entre grossistes et détaillants',
                    'unite' => '',
                    'valeur_cible' => '1:3',
                    'formule' => 'clients_detaillant > 0 ? clients_grossistes / clients_detaillant : 0',
                    'dependances' => [
                        'clients_grossistes',
                        'clients_detaillant'
                    ]
                ],
                'pipeline_commercial' => [
                    'libelle' => 'Pipeline Commercial',
                    'definition' => 'Valeur totale des affaires en pipeline',
                    'unite' => '',
                    'valeur_cible' => '1.5 min',
                    'formule' => '(nbr_contrat_conclu + nbr_contrat_encours) / total_clients_prospectes',
                    'dependances' => [
                        'nbr_contrat_conclu',
                        'nbr_contrat_encours',
                        'total_clients_prospectes'
                    ]
                ],
                'efficacite_prospection' => [
                    'libelle' => 'Efficacité de la Prospection',
                    'definition' => 'Ratio de transformation des prospects',
                    'unite' => '',
                    'valeur_cible' => '0.4 min',
                    'formule' => 'total_clients_prospectes > 0 ? (nbr_contrat_conclu / total_clients_prospectes) : 0',
                    'dependances' => [
                        'nbr_contrat_conclu',
                        'total_clients_prospectes'
                    ]
                ],
            ],

            // Indicateurs de trésorerie
            'Gestion de la Trésorerie Trimestrielle' => [
                'nbr_creance_clients_12m' => [
                    'libelle' => 'Créances Irrécouvrables',
                    'definition' => 'Nombre de factures impayées depuis plus de 12 mois',
                    'unite' => '',
                    'valeur_cible' => '5 max',
                    'formule' => null,
                    'dependances' => []
                ],
                'montant_creance_clients_12m' => [
                    'libelle' => 'Valeur des Créances Irrécouvrables',
                    'definition' => 'Montant total des créances anciennes',
                    'unite' => 'FCFA',
                    'valeur_cible' => '',
                    'formule' => null,
                    'dependances' => []
                ],
                'montant_moyen_creance' => [
                    'libelle' => 'Créance Moyenne',
                    'definition' => 'Valeur moyenne des créances irrécouvrables',
                    'unite' => 'FCFA',
                    'valeur_cible' => '',
                    'formule' => 'nbr_creance_clients_12m > 0 ? montant_creance_clients_12m / nbr_creance_clients_12m : 0',
                    'dependances' => [
                        'nbr_creance_clients_12m',
                        'montant_creance_clients_12m'
                    ]
                ],
                'taux_creances_irrecouvrables' => [
                    'libelle' => 'Taux de Créances Irrécouvrables',
                    'definition' => 'Pourcentage des créances difficiles à recouvrer',
                    'unite' => '%',
                    'valeur_cible' => '5% max',
                    'formule' => null, // Nécessite le CA trimestriel pour calcul
                    'dependances' => []
                ],
                'encours_client_moyen' => [
                    'libelle' => 'Encours Client Moyen',
                    'definition' => 'Délai moyen de paiement des clients',
                    'unite' => 'jours',
                    'valeur_cible' => '45 max',
                    'formule' => null,
                    'dependances' => []
                ],
                'delai_paiement_fournisseurs' => [
                    'libelle' => 'Délai de Paiement Fournisseurs',
                    'definition' => 'Délai moyen de règlement des fournisseurs',
                    'unite' => 'jours',
                    'valeur_cible' => '60 max',
                    'formule' => null,
                    'dependances' => []
                ],
                // Nouveaux indicateurs calculés
                'ratio_liquidite_immediate' => [
                    'libelle' => 'Ratio de Liquidité Immédiate',
                    'definition' => 'Capacité de l\'entreprise à honorer ses dettes à court terme',
                    'unite' => '',
                    'valeur_cible' => '1 min',
                    'formule' => null, // Nécessite données de trésorerie et dettes
                    'dependances' => []
                ],
                'cycle_conversion_tresorerie' => [
                    'libelle' => 'Cycle de Conversion Trésorerie',
                    'definition' => 'Temps nécessaire pour convertir les investissements en liquidités',
                    'unite' => 'jours',
                    'valeur_cible' => '60 max',
                    'formule' => 'encours_client_moyen - delai_paiement_fournisseurs',
                    'dependances' => [
                        'encours_client_moyen',
                        'delai_paiement_fournisseurs'
                    ]
                ],
            ],

            // Indicateurs de performance projet
            'Impact Projet Trimestriel' => [
                'credit_rembourse' => [
                    'libelle' => 'Remboursements de Crédits',
                    'definition' => 'Montant total des remboursements effectués',
                    'unite' => 'FCFA',
                    'valeur_cible' => 'Promoteurs',
                    'formule' => null,
                    'dependances' => []
                ],
                'taux_insertion_professionnelle' => [
                    'libelle' => 'Taux d\'Insertion Professionnelle',
                    'definition' => 'Pourcentage de bénéficiaires ayant développé des initiatives',
                    'unite' => '%',
                    'valeur_cible' => '60% min',
                    'formule' => null,
                    'dependances' => []
                ],
                'nombre_beneficiaires_actifs' => [
                    'libelle' => 'Bénéficiaires Actifs',
                    'definition' => 'Nombre de bénéficiaires encore engagés dans le projet',
                    'unite' => '',
                    'valeur_cible' => '',
                    'formule' => null,
                    'dependances' => []
                ],
                'taux_remboursement_credits' => [
                    'libelle' => 'Taux de Remboursement des Crédits',
                    'definition' => 'Pourcentage des crédits remboursés dans les temps',
                    'unite' => '%',
                    'valeur_cible' => '90% min',
                    'formule' => null,
                    'dependances' => []
                ],
                // Indicateurs calculés
                'taux_performance_projet' => [
                    'libelle' => 'Performance Globale du Projet',
                    'definition' => 'Indicateur agrégé de performance',
                    'unite' => '/10',
                    'valeur_cible' => '7/10 min',
                    'formule' => '(taux_insertion_professionnelle/10 + taux_succes_contrats/10)/2',
                    'dependances' => [
                        'taux_insertion_professionnelle',
                        'taux_succes_contrats'
                    ]
                ],
                'impact_economique_moyen' => [
                    'libelle' => 'Impact Économique Moyen par Bénéficiaire',
                    'definition' => 'Valeur économique générée par bénéficiaire',
                    'unite' => 'FCFA',
                    'valeur_cible' => '500000 min',
                    'formule' => 'nombre_beneficiaires_actifs > 0 ? credit_rembourse / nombre_beneficiaires_actifs : 0',
                    'dependances' => [
                        'credit_rembourse',
                        'nombre_beneficiaires_actifs'
                    ]
                ],
                'suivi_engagement_beneficiaires' => [
                    'libelle' => 'Engagement des Bénéficiaires',
                    'definition' => 'Score d\'engagement des bénéficiaires dans le projet',
                    'unite' => '/100',
                    'valeur_cible' => '85/100 min',
                    'formule' => '(taux_remboursement_credits + taux_insertion_professionnelle) / 2',
                    'dependances' => [
                        'taux_remboursement_credits',
                        'taux_insertion_professionnelle'
                    ]
                ],
            ],

            // Indicateurs de suivi opérationnel
            'Suivi Opérationnel Trimestriel' => [
                'nombre_visites_terrain' => [
                    'libelle' => 'Visites de Terrain',
                    'definition' => 'Nombre de visites effectuées auprès des entreprises',
                    'unite' => '',
                    'valeur_cible' => '20 min',
                    'formule' => null,
                    'dependances' => []
                ],
                'nombre_ateliers_organises' => [
                    'libelle' => 'Ateliers Organisés',
                    'definition' => 'Nombre d\'ateliers ou formations organisés',
                    'unite' => '',
                    'valeur_cible' => '3 min',
                    'formule' => null,
                    'dependances' => []
                ],
                'taux_participation_ateliers' => [
                    'libelle' => 'Taux de Participation aux Ateliers',
                    'definition' => 'Pourcentage de participants aux ateliers',
                    'unite' => '%',
                    'valeur_cible' => '80% min',
                    'formule' => null,
                    'dependances' => []
                ],
                'temps_moyen_suivi' => [
                    'libelle' => 'Temps Moyen de Suivi',
                    'definition' => 'Temps consacré en moyenne par entreprise',
                    'unite' => 'heures',
                    'valeur_cible' => '8 min',
                    'formule' => null,
                    'dependances' => []
                ],
                // Indicateurs calculés
                'efficacite_interventions' => [
                    'libelle' => 'Efficacité des Interventions',
                    'definition' => 'Ratio interventions/résultats obtenus',
                    'unite' => '',
                    'valeur_cible' => '1.5 min',
                    'formule' => '(nombre_visites_terrain + nombre_ateliers_organises) > 0 ? (total_nouveaux_clients / (nombre_visites_terrain + nombre_ateliers_organises)) : 0',
                    'dependances' => [
                        'nombre_visites_terrain',
                        'nombre_ateliers_organises',
                        'total_nouveaux_clients'
                    ]
                ],
                'couverture_terrain' => [
                    'libelle' => 'Couverture Terrain',
                    'definition' => 'Étendue de la couverture des interventions',
                    'unite' => '',
                    'valeur_cible' => '0.8 min',
                    'formule' => 'nombre_beneficiaires_actifs > 0 ? nombre_visites_terrain / nombre_beneficiaires_actifs : 0',
                    'dependances' => [
                        'nombre_visites_terrain',
                        'nombre_beneficiaires_actifs'
                    ]
                ],
                'indice_satisfaction_activites' => [
                    'libelle' => 'Satisfaction des Activités',
                    'definition' => 'Indicateur de satisfaction des participants',
                    'unite' => '/10',
                    'valeur_cible' => '8/10 min',
                    'formule' => '(taux_participation_ateliers / 10) * (temps_moyen_suivi / 10)',
                    'dependances' => [
                        'taux_participation_ateliers',
                        'temps_moyen_suivi'
                    ]
                ],
            ],
        ];
    }

    /**
     * Calculer les indicateurs spécifiques à la période trimestrielle
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
     * Calcule l'évolution des indicateurs par rapport au trimestre précédent
     *
     * @param array $donneesActuelles Données du trimestre actuel
     * @param array $donneesPrecedentes Données du trimestre précédent
     * @return array Données d'évolution (en pourcentage)
     */
    public function calculerEvolution(array $donneesActuelles, array $donneesPrecedentes): array
    {
        $evolution = [];

        foreach ($donneesActuelles as $categorie => $indicateurs) {
            if (!isset($evolution[$categorie])) {
                $evolution[$categorie] = [];
            }

            foreach ($indicateurs as $id => $valeur) {
                // Vérifier si l'indicateur existait dans le trimestre précédent
                if (isset($donneesPrecedentes[$categorie][$id])) {
                    $valeurPrecedente = $donneesPrecedentes[$categorie][$id];

                    // Éviter la division par zéro
                    if ($valeurPrecedente != 0) {
                        $tauxEvolution = (($valeur - $valeurPrecedente) / abs($valeurPrecedente)) * 100;
                        $evolution[$categorie][$id] = round($tauxEvolution, 1);
                    } else if ($valeur > 0) {
                        $evolution[$categorie][$id] = 100; // +100%
                    } else if ($valeur < 0) {
                        $evolution[$categorie][$id] = -100; // -100%
                    } else {
                        $evolution[$categorie][$id] = 0; // 0%
                    }
                } else {
                    // Nouvel indicateur
                    $evolution[$categorie][$id] = null; // Pas d'évolution calculable
                }
            }
        }

        return $evolution;
    }

    /**
     * Récupérer les données du trimestre précédent pour comparer
     *
     * @param int|null $exerciceId
     * @param int|null $entrepriseId
     * @param int|null $periodeId
     * @return array
     */
    public function getDonneesTrimestrePrecedent(?int $exerciceId, ?int $entrepriseId, ?int $periodeId): array
    {
        if (!$exerciceId || !$entrepriseId || !$periodeId) {
            return [];
        }

        // Récupérer la période actuelle pour connaître son numéro
        $periode = \App\Models\Periode::find($periodeId);

        if (!$periode || !isset($periode->numero)) {
            return [];
        }

        $numeroTrimestre = $periode->numero;
        $numeroTrimestrePrecedent = $numeroTrimestre - 1;

        // Si c'est le premier trimestre de l'exercice, regarder le dernier de l'exercice précédent
        if ($numeroTrimestrePrecedent < 1) {
            $exercicePrecedentId = $this->getExercicePrecedent($exerciceId);

            if (!$exercicePrecedentId) {
                return [];
            }

            // Chercher le dernier trimestre de l'exercice précédent
            $periodePrecedente = \App\Models\Periode::where('exercice_id', $exercicePrecedentId)
                ->where('type_periode', 'Trimestrielle')
                ->orderBy('numero', 'desc')
                ->first();
        } else {
            // Chercher le trimestre précédent dans le même exercice
            $periodePrecedente = \App\Models\Periode::where('exercice_id', $exerciceId)
                ->where('type_periode', 'Trimestrielle')
                ->where('numero', $numeroTrimestrePrecedent)
                ->first();
        }

        if (!$periodePrecedente) {
            return [];
        }

        // Récupérer la collecte du trimestre précédent
        $collecte = Collecte::where('entreprise_id', $entrepriseId)
            ->where('periode_id', $periodePrecedente->id)
            ->where('type_collecte', 'standard')
            ->first();

        if (!$collecte) {
            return [];
        }

        $donnees = $collecte->donnees;
        if (!is_array($donnees)) {
            $donnees = !is_null($donnees) ? json_decode((string) $donnees, true) : [];
        }

        return is_array($donnees) ? $donnees : [];
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
