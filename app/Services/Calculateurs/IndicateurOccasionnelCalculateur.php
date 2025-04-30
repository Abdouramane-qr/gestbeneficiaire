<?php

namespace App\Services\Calculateurs;

use App\Models\Collecte;
use Illuminate\Support\Facades\Log;

class IndicateurOccasionnelCalculateur extends IndicateurCalculateurBase
{
    /**
     * Définition des indicateurs occasionnels avec leurs formules et dépendances
     */
    protected function getDefinitionsIndicateurs(): array
    {
        return [
            // Indicateurs de performance Projet - Formation
            'Indicateurs de performance Projet' => [
                'nbr_formation_entrepreneuriat_h' => [
                    'libelle' => 'Formés en entrepreneuriat (H)',
                    'definition' => 'Nombre d\'hommes formés en entrepreneuriat',
                    'unite' => '',
                    'valeur_cible' => 'Promoteurs',
                    'formule' => null,
                    'dependances' => []
                ],
                'nbr_formation_entrepreneuriat_f' => [
                    'libelle' => 'Formés en entrepreneuriat (F)',
                    'definition' => 'Nombre de femmes formées en entrepreneuriat',
                    'unite' => '',
                    'valeur_cible' => 'Promoteurs',
                    'formule' => null,
                    'dependances' => []
                ],
                'nbr_former_technique_typeactivite' => [
                    'libelle' => 'Formés techniquement (par activité)',
                    'definition' => 'Nombre de jeunes qui participent aux sessions de formation techniques, par type d\'activité',
                    'unite' => '',
                    'valeur_cible' => 'Promoteurs',
                    'formule' => null,
                    'dependances' => []
                ],
                'nbr_former_technique_typebenef' => [
                    'libelle' => 'Formés techniquement (par bénéficiaire)',
                    'definition' => 'Nombre de jeunes qui participent aux sessions de formation techniques, par type de bénéficiaire',
                    'unite' => '',
                    'valeur_cible' => 'Promoteurs',
                    'formule' => null,
                    'dependances' => []
                ],
                'nbr_bancarisation_h' => [
                    'libelle' => 'Bancarisés (H)',
                    'definition' => 'Nombre de promoteurs hommes qui disposent de compte bancaires',
                    'unite' => '',
                    'valeur_cible' => 'Promoteurs',
                    'formule' => null,
                    'dependances' => []
                ],
                'nbr_bancarisation_f' => [
                    'libelle' => 'Bancarisés (F)',
                    'definition' => 'Nombre de promoteurs femmes qui disposent de compte bancaires',
                    'unite' => '',
                    'valeur_cible' => 'Promoteurs',
                    'formule' => null,
                    'dependances' => []
                ],
                'nbr_bancarisation_individuelle' => [
                    'libelle' => 'Bancarisations individuelles',
                    'definition' => 'Nombre de promoteurs individuels qui disposent de compte bancaires',
                    'unite' => '',
                    'valeur_cible' => 'Promoteurs',
                    'formule' => null,
                    'dependances' => []
                ],
                'nbr_bancarisation_cooperative' => [
                    'libelle' => 'Bancarisations de coopératives',
                    'definition' => 'Nombre de coopératives qui disposent de compte bancaires',
                    'unite' => '',
                    'valeur_cible' => 'Promoteurs',
                    'formule' => null,
                    'dependances' => []
                ],
                'appreciation_ong' => [
                    'libelle' => 'Appréciation de l\'organisation interne',
                    'definition' => '% des entreprises/coopératives qui enregistrent un score moyen de 3/3 suivant l\'appréciation de leur organisations internes, des services fournies et de leurs relations externes',
                    'unite' => '/3',
                    'valeur_cible' => 'Promoteurs',
                    'formule' => null,
                    'dependances' => []
                ],
                // Indicateurs calculés
                'total_formes_entrepreneuriat' => [
                    'libelle' => 'Total formés en entrepreneuriat',
                    'definition' => 'Nombre total de personnes formées en entrepreneuriat',
                    'unite' => '',
                    'valeur_cible' => '',
                    'formule' => 'nbr_formation_entrepreneuriat_h + nbr_formation_entrepreneuriat_f',
                    'dependances' => [
                        'nbr_formation_entrepreneuriat_h',
                        'nbr_formation_entrepreneuriat_f'
                    ]
                ],
                'total_bancarises' => [
                    'libelle' => 'Total bancarisés',
                    'definition' => 'Nombre total de promoteurs bancarisés',
                    'unite' => '',
                    'valeur_cible' => '',
                    'formule' => 'nbr_bancarisation_h + nbr_bancarisation_f',
                    'dependances' => [
                        'nbr_bancarisation_h',
                        'nbr_bancarisation_f'
                    ]
                ],
                'pourcentage_femmes_entrepreneuriat' => [
                    'libelle' => 'Pourcentage de femmes formées',
                    'definition' => 'Pourcentage de femmes parmi les personnes formées en entrepreneuriat',
                    'unite' => '%',
                    'valeur_cible' => '',
                    'formule' => '(nbr_formation_entrepreneuriat_h + nbr_formation_entrepreneuriat_f) > 0 ? (nbr_formation_entrepreneuriat_f / (nbr_formation_entrepreneuriat_h + nbr_formation_entrepreneuriat_f)) * 100 : 0',
                    'dependances' => [
                        'nbr_formation_entrepreneuriat_h',
                        'nbr_formation_entrepreneuriat_f'
                    ]
                ],
                'pourcentage_femmes_bancarisees' => [
                    'libelle' => 'Pourcentage de femmes bancarisées',
                    'definition' => 'Pourcentage de femmes parmi les promoteurs bancarisés',
                    'unite' => '%',
                    'valeur_cible' => '',
                    'formule' => '(nbr_bancarisation_h + nbr_bancarisation_f) > 0 ? (nbr_bancarisation_f / (nbr_bancarisation_h + nbr_bancarisation_f)) * 100 : 0',
                    'dependances' => [
                        'nbr_bancarisation_h',
                        'nbr_bancarisation_f'
                    ]
                ],
                'ratio_bancarisation_individuelle' => [
                    'libelle' => 'Ratio de bancarisation individuelle',
                    'definition' => 'Pourcentage de bancarisations individuelles par rapport au total',
                    'unite' => '%',
                    'valeur_cible' => '',
                    'formule' => '(nbr_bancarisation_individuelle + nbr_bancarisation_cooperative) > 0 ? (nbr_bancarisation_individuelle / (nbr_bancarisation_individuelle + nbr_bancarisation_cooperative)) * 100 : 0',
                    'dependances' => [
                        'nbr_bancarisation_individuelle',
                        'nbr_bancarisation_cooperative'
                    ]
                ],
            ],

            // Appréciation au démarrage JEMII
            'Appréciation au démarrage JEMII' => [
                'appreciation_organisation_interne_demarrage' => [
                    'libelle' => 'Organisation interne (démarrage)',
                    'definition' => 'Appréciation de l\'organisation interne au démarrage du projet',
                    'unite' => '/3',
                    'valeur_cible' => '',
                    'formule' => null,
                    'dependances' => []
                ],
                'appreciation_services_adherents_demarrage' => [
                    'libelle' => 'Services aux adhérents (démarrage)',
                    'definition' => 'Appréciation des services fournis aux adhérents au démarrage du projet',
                    'unite' => '/3',
                    'valeur_cible' => '',
                    'formule' => null,
                    'dependances' => []
                ],
                'appreciation_relations_externes_demarrage' => [
                    'libelle' => 'Relations externes (démarrage)',
                    'definition' => 'Appréciation des relations externes au démarrage du projet',
                    'unite' => '/3',
                    'valeur_cible' => '',
                    'formule' => null,
                    'dependances' => []
                ],
                'est_bancarise_demarrage' => [
                    'libelle' => 'Bancarisé au démarrage',
                    'definition' => 'Le bénéficiaire était bancarisé au démarrage du projet',
                    'unite' => '',
                    'valeur_cible' => '',
                    'formule' => null,
                    'dependances' => []
                ],
                'score_moyen_demarrage' => [
                    'libelle' => 'Score moyen au démarrage',
                    'definition' => 'Score moyen d\'appréciation au démarrage du projet',
                    'unite' => '/3',
                    'valeur_cible' => '',
                    'formule' => '(appreciation_organisation_interne_demarrage + appreciation_services_adherents_demarrage + appreciation_relations_externes_demarrage) / 3',
                    'dependances' => [
                        'appreciation_organisation_interne_demarrage',
                        'appreciation_services_adherents_demarrage',
                        'appreciation_relations_externes_demarrage'
                    ]
                ]
            ],

            // Appréciation à la fin JEMII
            'Appréciation à la fin JEMII' => [
                'appreciation_organisation_interne_fin' => [
                    'libelle' => 'Organisation interne (fin)',
                    'definition' => 'Appréciation de l\'organisation interne à la fin du projet',
                    'unite' => '/3',
                    'valeur_cible' => '',
                    'formule' => null,
                    'dependances' => []
                ],
                'appreciation_services_adherents_fin' => [
                    'libelle' => 'Services aux adhérents (fin)',
                    'definition' => 'Appréciation des services fournis aux adhérents à la fin du projet',
                    'unite' => '/3',
                    'valeur_cible' => '',
                    'formule' => null,
                    'dependances' => []
                ],
                'appreciation_relations_externes_fin' => [
                    'libelle' => 'Relations externes (fin)',
                    'definition' => 'Appréciation des relations externes à la fin du projet',
                    'unite' => '/3',
                    'valeur_cible' => '',
                    'formule' => null,
                    'dependances' => []
                ],
                'est_bancarise_fin' => [
                    'libelle' => 'Bancarisé à la fin',
                    'definition' => 'Le bénéficiaire est bancarisé à la fin du projet',
                    'unite' => '',
                    'valeur_cible' => '',
                    'formule' => null,
                    'dependances' => []
                ],
                'score_moyen_fin' => [
                    'libelle' => 'Score moyen à la fin',
                    'definition' => 'Score moyen d\'appréciation à la fin du projet',
                    'unite' => '/3',
                    'valeur_cible' => '',
                    'formule' => '(appreciation_organisation_interne_fin + appreciation_services_adherents_fin + appreciation_relations_externes_fin) / 3',
                    'dependances' => [
                        'appreciation_organisation_interne_fin',
                        'appreciation_services_adherents_fin',
                        'appreciation_relations_externes_fin'
                    ]
                ],
                'evolution_score' => [
                    'libelle' => 'Évolution du score',
                    'definition' => 'Évolution du score moyen entre le démarrage et la fin du projet',
                    'unite' => '',
                    'valeur_cible' => '',
                    'formule' => 'score_moyen_fin - score_moyen_demarrage',
                    'dependances' => [
                        'score_moyen_fin',
                        'score_moyen_demarrage'
                    ]
                ],
                'evolution_score_pourcentage' => [
                    'libelle' => 'Évolution du score (%)',
                    'definition' => 'Pourcentage d\'évolution du score moyen entre le démarrage et la fin du projet',
                    'unite' => '%',
                    'valeur_cible' => '',
                    'formule' => 'score_moyen_demarrage > 0 ? ((score_moyen_fin - score_moyen_demarrage) / score_moyen_demarrage) * 100 : 0',
                    'dependances' => [
                        'score_moyen_fin',
                        'score_moyen_demarrage'
                    ]
                ],
                'evolution_bancarisation' => [
                    'libelle' => 'Évolution de la bancarisation',
                    'definition' => 'Indique si le bénéficiaire a été bancarisé grâce au projet',
                    'unite' => '',
                    'valeur_cible' => '',
                    'formule' => 'est_bancarise_fin && !est_bancarise_demarrage ? 1 : 0',
                    'dependances' => [
                        'est_bancarise_fin',
                        'est_bancarise_demarrage'
                    ]
                ]
            ],

            // Comparaison démarrage/fin
            'Comparaison démarrage/fin' => [
                'delta_organisation_interne' => [
                    'libelle' => 'Évolution organisation interne',
                    'definition' => 'Évolution de l\'appréciation de l\'organisation interne',
                    'unite' => '',
                    'valeur_cible' => '',
                    'formule' => 'appreciation_organisation_interne_fin - appreciation_organisation_interne_demarrage',
                    'dependances' => [
                        'appreciation_organisation_interne_fin',
                        'appreciation_organisation_interne_demarrage'
                    ]
                ],
                'delta_services_adherents' => [
                    'libelle' => 'Évolution services aux adhérents',
                    'definition' => 'Évolution de l\'appréciation des services fournis aux adhérents',
                    'unite' => '',
                    'valeur_cible' => '',
                    'formule' => 'appreciation_services_adherents_fin - appreciation_services_adherents_demarrage',
                    'dependances' => [
                        'appreciation_services_adherents_fin',
                        'appreciation_services_adherents_demarrage'
                    ]
                ],
                'delta_relations_externes' => [
                    'libelle' => 'Évolution relations externes',
                    'definition' => 'Évolution de l\'appréciation des relations externes',
                    'unite' => '',
                    'valeur_cible' => '',
                    'formule' => 'appreciation_relations_externes_fin - appreciation_relations_externes_demarrage',
                    'dependances' => [
                        'appreciation_relations_externes_fin',
                        'appreciation_relations_externes_demarrage'
                    ]
                ],
                'pourcentage_progression_globale' => [
                    'libelle' => 'Progression globale (%)',
                    'definition' => 'Pourcentage de progression globale entre le démarrage et la fin du projet',
                    'unite' => '%',
                    'valeur_cible' => '',
                    'formule' => '((appreciation_organisation_interne_fin + appreciation_services_adherents_fin + appreciation_relations_externes_fin) - (appreciation_organisation_interne_demarrage + appreciation_services_adherents_demarrage + appreciation_relations_externes_demarrage)) / (appreciation_organisation_interne_demarrage + appreciation_services_adherents_demarrage + appreciation_relations_externes_demarrage) * 100',
                    'dependances' => [
                        'appreciation_organisation_interne_fin',
                        'appreciation_services_adherents_fin',
                        'appreciation_relations_externes_fin',
                        'appreciation_organisation_interne_demarrage',
                        'appreciation_services_adherents_demarrage',
                        'appreciation_relations_externes_demarrage'
                    ]
                ],
            ],
        ];
    }

    /**
     * Calculer les indicateurs spécifiques à la période occasionnelle
     *
     * @param array $donneesCollecte Les données brutes de la collecte
     * @param array $donneesReference Données de référence
     * @return array Les données complétées avec les indicateurs calculés
     */
    public function calculerIndicateurs(array $donneesCollecte, array $donneesReference = []): array
    {
        $resultat = $donneesCollecte;
        $definitions = $this->getDefinitionsIndicateurs();

        // Si nous avons des données de démarrage et de fin du projet ensemble,
        // nous devons les organiser correctement
        $this->organiserDonneesComparaison($resultat);

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
                    $trouve = false;

                    // Chercher la dépendance dans toutes les catégories
                    foreach ($resultat as $cat => $inds) {
                        if (isset($inds[$dep])) {
                            $variablesValeurs[$dep] = $inds[$dep];
                            $trouve = true;
                            break;
                        }
                    }

                    if (!$trouve) {
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
     * Organise les données pour les comparaisons entre démarrage et fin de projet
     * Cela peut impliquer de déplacer des données entre catégories pour faciliter les calculs
     *
     * @param array &$donnees Données à organiser (par référence)
     */
    private function organiserDonneesComparaison(array &$donnees): void
    {
        // Si le formulaire exceptionnel contient des données de démarrage et de fin,
        // les répartir dans les bonnes catégories
        if (isset($donnees['formulaire_exceptionnel'])) {
            $exceptionnel = $donnees['formulaire_exceptionnel'];

            // Créer les catégories si elles n'existent pas
            if (!isset($donnees['Appréciation au démarrage JEMII'])) {
                $donnees['Appréciation au démarrage JEMII'] = [];
            }

            if (!isset($donnees['Appréciation à la fin JEMII'])) {
                $donnees['Appréciation à la fin JEMII'] = [];
            }

            // Déplacer les données de démarrage
            $this->deplacerDonneesSiExiste($exceptionnel, $donnees['Appréciation au démarrage JEMII'], 'appreciation_organisation_interne_demarrage');
            $this->deplacerDonneesSiExiste($exceptionnel, $donnees['Appréciation au démarrage JEMII'], 'appreciation_services_adherents_demarrage');
            $this->deplacerDonneesSiExiste($exceptionnel, $donnees['Appréciation au démarrage JEMII'], 'appreciation_relations_externes_demarrage');
            $this->deplacerDonneesSiExiste($exceptionnel, $donnees['Appréciation au démarrage JEMII'], 'est_bancarise_demarrage');

            // Déplacer les données de fin
            $this->deplacerDonneesSiExiste($exceptionnel, $donnees['Appréciation à la fin JEMII'], 'appreciation_organisation_interne_fin');
            $this->deplacerDonneesSiExiste($exceptionnel, $donnees['Appréciation à la fin JEMII'], 'appreciation_services_adherents_fin');
            $this->deplacerDonneesSiExiste($exceptionnel, $donnees['Appréciation à la fin JEMII'], 'appreciation_relations_externes_fin');
            $this->deplacerDonneesSiExiste($exceptionnel, $donnees['Appréciation à la fin JEMII'], 'est_bancarise_fin');
        }

        // Si nous avons des données de bancarisation dans Indicateurs de performance Projet
        if (isset($donnees['Indicateurs de performance Projet'])) {
            $performanceProjet = $donnees['Indicateurs de performance Projet'];

            // Créer la catégorie de comparaison si elle n'existe pas
            if (!isset($donnees['Comparaison démarrage/fin'])) {
                $donnees['Comparaison démarrage/fin'] = [];
            }

            // Déplacer les données de bancarisation pour comparaison
            if (isset($performanceProjet['nbr_bancarisation_h']) || isset($performanceProjet['nbr_bancarisation_f'])) {
                $donnees['Comparaison démarrage/fin']['bancarisation_projet'] = true;
            }
        }
    }

    /**
     * Déplace une donnée d'un tableau à un autre si elle existe
     *
     * @param array $source Tableau source
     * @param array &$destination Tableau destination (par référence)
     * @param string $cle Clé à déplacer
     */
    private function deplacerDonneesSiExiste(array $source, array &$destination, string $cle): void
    {
        if (isset($source[$cle])) {
            $destination[$cle] = $source[$cle];
        }
    }

    /**
     * Calcule la différence entre deux collectes occasionnelles (démarrage/fin)
     *
     * @param array $collecteFin Données de la collecte de fin
     * @param array $collecteDemarrage Données de la collecte de démarrage
     * @return array Données de différence
     */
    public function calculerDifference(array $collecteFin, array $collecteDemarrage): array
    {
        $difference = [
            'Comparaison démarrage/fin' => []
        ];

        // Comparer les appréciations
        if (isset($collecteFin['Appréciation à la fin JEMII']) && isset($collecteDemarrage['Appréciation au démarrage JEMII'])) {
            $fin = $collecteFin['Appréciation à la fin JEMII'];
            $demarrage = $collecteDemarrage['Appréciation au démarrage JEMII'];

            // Comparer l'organisation interne
            if (isset($fin['appreciation_organisation_interne_fin']) && isset($demarrage['appreciation_organisation_interne_demarrage'])) {
                $difference['Comparaison démarrage/fin']['delta_organisation_interne'] =
                    $fin['appreciation_organisation_interne_fin'] - $demarrage['appreciation_organisation_interne_demarrage'];
            }

            // Comparer les services aux adhérents
            if (isset($fin['appreciation_services_adherents_fin']) && isset($demarrage['appreciation_services_adherents_demarrage'])) {
                $difference['Comparaison démarrage/fin']['delta_services_adherents'] =
                    $fin['appreciation_services_adherents_fin'] - $demarrage['appreciation_services_adherents_demarrage'];
            }

            // Comparer les relations externes
            if (isset($fin['appreciation_relations_externes_fin']) && isset($demarrage['appreciation_relations_externes_demarrage'])) {
                $difference['Comparaison démarrage/fin']['delta_relations_externes'] =
                    $fin['appreciation_relations_externes_fin'] - $demarrage['appreciation_relations_externes_demarrage'];
            }

            // Comparer la bancarisation
            if (isset($fin['est_bancarise_fin']) && isset($demarrage['est_bancarise_demarrage'])) {
                $difference['Comparaison démarrage/fin']['evolution_bancarisation'] =
                    $fin['est_bancarise_fin'] && !$demarrage['est_bancarise_demarrage'] ? 1 : 0;
            }
        }

        return $difference;
    }

    /**
     * Récupère les collectes occasionnelles pour un bénéficiaire
     *
     * @param int $beneficiaireId
     * @return array Collectes occasionnelles trouvées
     */
    public function getCollectesOccasionnelles(int $beneficiaireId): array
    {
        // Récupérer l'entreprise associée au bénéficiaire
        $entreprise = \App\Models\Entreprise::where('beneficiaires_id', $beneficiaireId)->first();

        if (!$entreprise) {
            return [];
        }

        // Récupérer les collectes occasionnelles
        $collectes = Collecte::where('entreprise_id', $entreprise->id)
            ->whereNull('periode_id')
            ->where('periode', 'Occasionnelle')
            ->orderBy('date_collecte')
            ->get();

        $resultat = [
            'demarrage' => null,
            'fin' => null,
            'autres' => []
        ];

        foreach ($collectes as $collecte) {
            $donnees = is_array($collecte->donnees) ? $collecte->donnees : json_decode($collecte->donnees, true);

            // Vérifier si c'est une collecte de démarrage ou de fin
            if (isset($donnees['formulaire_exceptionnel'])) {
                // Si contient des données de démarrage
                if (isset($donnees['formulaire_exceptionnel']['appreciation_organisation_interne_demarrage'])) {
                    if (!$resultat['demarrage']) {
                        $resultat['demarrage'] = $collecte;
                    }
                }
                // Si contient des données de fin
                else if (isset($donnees['formulaire_exceptionnel']['appreciation_organisation_interne_fin'])) {
                    if (!$resultat['fin']) {
                        $resultat['fin'] = $collecte;
                    }
                }
                // Autre collecte occasionnelle
                else {
                    $resultat['autres'][] = $collecte;
                }
            } else {
                $resultat['autres'][] = $collecte;
            }
        }

        return $resultat;
    }
}
