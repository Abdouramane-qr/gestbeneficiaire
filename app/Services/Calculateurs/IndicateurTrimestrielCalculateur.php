<?php

namespace App\Services\Calculateurs;

use App\Models\Collecte;
use Illuminate\Support\Facades\Log;

class IndicateurTrimestrielCalculateur extends IndicateurCalculateurBase
{
    /**
     * Définition des indicateurs trimestriels avec leurs formules et dépendances
     */
    protected function getDefinitionsIndicateurs(): array
    {
        return [
            // Indicateurs commerciaux de l'entreprise du promoteur
            'Indicateurs commerciaux de l\'entreprise du promoteur' => [
                'propects_grossites' => [
                    'libelle' => 'Clients prospectés (grossistes)',
                    'definition' => 'Le nombre de clients potentiels prospectés par le promoteur grâce au coaching et l\'appui conseil',
                    'unite' => '',
                    'valeur_cible' => 'Promoteurs',
                    'formule' => null,
                    'dependances' => []
                ],
                'prospects_detaillant' => [
                    'libelle' => 'Clients prospectés (détaillants)',
                    'definition' => 'Le nombre de clients potentiels prospectés par le promoteur grâce au coaching et l\'appui conseil',
                    'unite' => '',
                    'valeur_cible' => 'Promoteurs',
                    'formule' => null,
                    'dependances' => []
                ],
                'clients_grossistes' => [
                    'libelle' => 'Nouveaux clients (grossistes)',
                    'definition' => 'Nombre de nouveau Clients obtenus grâce au coaching et l\'appui conseil',
                    'unite' => '',
                    'valeur_cible' => 'Promoteurs',
                    'formule' => null,
                    'dependances' => []
                ],
                'clients_detaillant' => [
                    'libelle' => 'Nouveaux clients (détaillants)',
                    'definition' => 'Nombre de nouveau Clients obtenus grâce au coaching et l\'appui conseil',
                    'unite' => '',
                    'valeur_cible' => 'Promoteurs',
                    'formule' => null,
                    'dependances' => []
                ],
                'nbr_contrat_conclu' => [
                    'libelle' => 'Contrats conclus',
                    'definition' => 'Nombre de commandes/contrats obtenus avec des grossistes ou des particuliers',
                    'unite' => '',
                    'valeur_cible' => 'Promoteurs',
                    'formule' => null,
                    'dependances' => []
                ],
                'nbr_contrat_encours' => [
                    'libelle' => 'Contrats en cours',
                    'definition' => 'Nombre de commandes/contrats en cours de négociation avec des grossistes ou des particuliers',
                    'unite' => '',
                    'valeur_cible' => 'Promoteurs',
                    'formule' => null,
                    'dependances' => []
                ],
                'nbr_contrat_perdu' => [
                    'libelle' => 'Contrats perdus',
                    'definition' => 'Nombre de commandes/contrats perdus ou non retenus avec des grossistes ou des particuliers',
                    'unite' => '',
                    'valeur_cible' => 'Promoteurs',
                    'formule' => null,
                    'dependances' => []
                ],
                'taux_succes_contrats' => [
                    'libelle' => 'Taux de succès des contrats',
                    'definition' => 'Pourcentage de contrats conclus par rapport au total des contrats',
                    'unite' => '%',
                    'valeur_cible' => '',
                    'formule' => '(nbr_contrat_conclu / (nbr_contrat_conclu + nbr_contrat_encours + nbr_contrat_perdu)) * 100',
                    'dependances' => [
                        'nbr_contrat_conclu',
                        'nbr_contrat_encours',
                        'nbr_contrat_perdu'
                    ]
                ],
                'total_clients_prospectes' => [
                    'libelle' => 'Total clients prospectés',
                    'definition' => 'Nombre total de clients prospectés (grossistes et détaillants)',
                    'unite' => '',
                    'valeur_cible' => '',
                    'formule' => 'propects_grossites + prospects_detaillant',
                    'dependances' => [
                        'propects_grossites',
                        'prospects_detaillant'
                    ]
                ],
                'total_nouveaux_clients' => [
                    'libelle' => 'Total nouveaux clients',
                    'definition' => 'Nombre total de nouveaux clients (grossistes et détaillants)',
                    'unite' => '',
                    'valeur_cible' => '',
                    'formule' => 'clients_grossistes + clients_detaillant',
                    'dependances' => [
                        'clients_grossistes',
                        'clients_detaillant'
                    ]
                ],
                'taux_conversion_prospects' => [
                    'libelle' => 'Taux de conversion des prospects',
                    'definition' => 'Pourcentage de prospects convertis en clients',
                    'unite' => '%',
                    'valeur_cible' => '',
                    'formule' => '(clients_grossistes + clients_detaillant) / (propects_grossites + prospects_detaillant) * 100',
                    'dependances' => [
                        'clients_grossistes',
                        'clients_detaillant',
                        'propects_grossites',
                        'prospects_detaillant'
                    ]
                ],
            ],

            // Indicateurs de trésorerie de l'entreprise du promoteur
            'Indicateurs de trésorerie de l\'entreprise du promoteur' => [
                'nbr_creance_clients_12m' => [
                    'libelle' => 'Nbre créances irrécouvrables',
                    'definition' => 'Nbre factures impayées par les clients de + de 12 mois',
                    'unite' => '',
                    'valeur_cible' => '',
                    'formule' => null,
                    'dependances' => []
                ],
                'montant_creance_clients_12m' => [
                    'libelle' => 'Créances irrécouvrables',
                    'definition' => 'Montant des créances clients irrécouvrables',
                    'unite' => 'FCFA',
                    'valeur_cible' => '',
                    'formule' => null,
                    'dependances' => []
                ],
                'montant_moyen_creance' => [
                    'libelle' => 'Montant moyen par créance',
                    'definition' => 'Montant moyen des créances irrécouvrables',
                    'unite' => 'FCFA',
                    'valeur_cible' => '',
                    'formule' => 'nbr_creance_clients_12m > 0 ? montant_creance_clients_12m / nbr_creance_clients_12m : 0',
                    'dependances' => [
                        'nbr_creance_clients_12m',
                        'montant_creance_clients_12m'
                    ]
                ],
            ],

            // Indicateurs de performance Projet
            'Indicateurs de performance Projet' => [
                'credit_rembourse' => [
                    'libelle' => 'Crédits remboursés',
                    'definition' => 'Montants cumulés des remboursements par les promoteurs et les coopératives',
                    'unite' => 'FCFA',
                    'valeur_cible' => 'Promoteurs',
                    'formule' => null,
                    'dependances' => []
                ],
                'taux_insertion_professionnelle' => [
                    'libelle' => 'Taux d\'insertion professionnelle',
                    'definition' => 'Pourcentage de jeunes formés/sensibilisés ayant développé des initiatives pour leur insertion professionnelle',
                    'unite' => '%',
                    'valeur_cible' => 'Promoteurs',
                    'formule' => null,
                    'dependances' => []
                ],
            ],
        ];
    }

    /**
     * Calculer les indicateurs spécifiques à la période trimestrielle
     *
     * @param array $donneesCollecte Les données brutes de la collecte
     * @param array $donneesReference Données de référence (autres périodes, exercices précédents, etc.)
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
                    if (isset($resultat[$categorie][$dep])) {
                        $variablesValeurs[$dep] = $resultat[$categorie][$dep];
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
                        // Si la valeur précédente était 0 et la valeur actuelle est positive
                        $evolution[$categorie][$id] = 100; // +100%
                    } else if ($valeur < 0) {
                        // Si la valeur précédente était 0 et la valeur actuelle est négative
                        $evolution[$categorie][$id] = -100; // -100%
                    } else {
                        // Si les deux valeurs sont 0
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
}
