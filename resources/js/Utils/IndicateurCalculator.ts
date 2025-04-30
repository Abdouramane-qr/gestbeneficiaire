/**
 * Interface pour les champs d'indicateurs
 */
export interface IndicateurField {
    id: string; // Identifiant technique (nom de colonne BD)
    label: string; // Libellé affiché à l'utilisateur
    type: 'number' | 'text' | 'calculated';
    required?: boolean;
    unite?: string; // Unité de mesure (FCFA, %, etc.)
    description?: string; // Description courte
    definition?: string; // Définition opérationnelle détaillée
    categorie?: string; // Catégorie de l'indicateur
    isCalculated?: boolean; // Indique si le champ est calculé
    dependencies?: {
        // Pour les indicateurs calculés
        field: string; // ID du champ dont dépend cet indicateur
        categorie?: string; // Catégorie du champ (si différente)
        periode?: PeriodeName; // Période du champ (si différente)
    }[];
    calculMethod?: 'auto' | 'manual' | 'hybrid'; // Méthode de calcul
}

/**
 * Type pour les catégories
 */
export type CategorieName =
    | "Indicateurs commerciaux de l'entreprise du promoteur"
    | "Indicateurs d'activités de l'entreprise du promoteur"
    | "Ratios de Rentabilité et de solvabilité de l'entreprise"
    | "Indicateurs de Rentabilité et de solvabilité de l'entreprise du promoteur"
    | "Indicateurs Sociaux et ressources humaines de l'entreprise du promoteur"
    | 'Indicateurs de performance Projet'
    | "Indicateurs de trésorerie de l'entreprise du promoteur"
    | 'Indicateurs de développement personnel du promoteur';

/**
 * Type pour les périodes
 */
export type PeriodeName = 'Trimestrielle' | 'Semestrielle' | 'Annuelle';

/**
 * Classe utilitaire pour gérer les indicateurs organisés par période
 */
export class IndicateurCalculator {
    // Mode debug
    static debug = false;

    /**
     * Structure des indicateurs par période puis par catégorie
     */
    static indicateursByPeriode: Record<PeriodeName, Record<string, IndicateurField[]>> = {
        Trimestrielle: {
            "Indicateurs commerciaux de l'entreprise du promoteur": [
                {
                    id: 'propects_grossites',
                    label: 'Nombre de clients prospectés (grossistes)',
                    type: 'number',
                    required: true,
                    definition: "Le nombre de clients potentiels prospectés par le promoteur grâce au coaching et l'appui conseil",
                },
                {
                    id: 'prospects_detaillant',
                    label: 'Nombre de clients prospectés (détaillants)',
                    type: 'number',
                    required: true,
                    definition: "Le nombre de clients potentiels prospectés par le promoteur grâce au coaching et l'appui conseil",
                },
                {
                    id: 'clients_grossistes',
                    label: 'Nombre de nouveaux clients (grossistes)',
                    type: 'number',
                    required: true,
                    definition: "Nombre de nouveau Clients obtenus grâce au coaching et l'appui conseil",
                },
                {
                    id: 'clients_detaillant',
                    label: 'Nombre de nouveaux clients (détaillants)',
                    type: 'number',
                    required: true,
                    definition: "Nombre de nouveau Clients obtenus grâce au coaching et l'appui conseil",
                },
                {
                    id: 'nbr_contrat_conclu',
                    label: 'Nombre de commandes/contrats obtenus',
                    type: 'number',
                    required: true,
                    definition: 'Nombre de commandes ou de contrats obtenus avec des grossistes ou des particuliers',
                },
                {
                    id: 'nbr_contrat_encours',
                    label: 'Nombre de commandes/contrats en cours',
                    type: 'number',
                    required: true,
                    definition: 'Nombre de commandes ou de contrats en cours de négociation avec des grossistes ou des particuliers',
                },
                {
                    id: 'nbr_contrat_perdu',
                    label: 'Nombre de commandes/contrats perdus',
                    type: 'number',
                    required: true,
                    definition: 'Nombre de commandes ou de contrats perdus ou non retenus avec des grossistes ou des particuliers',
                },
            ],
            'Indicateurs de performance Projet': [
                {
                    id: 'credit_rembourse',
                    label: 'Montants cumulés des remboursements',
                    type: 'number',
                    required: true,
                    unite: 'FCFA',
                    definition: 'Collecte des montants de crédits remboursés par les promoteurs et les coopératives pour le trimestre',
                },
            ],

            "Indicateurs de trésorerie de l'entreprise du promoteur": [
                {
                    id: 'montant_creance_clients_12m',
                    label: 'Montant des créances clients irrécouvrables',
                    type: 'number',
                    required: true,
                    unite: 'FCFA',
                    definition: 'Montant des créances clients irrécouvrables',
                },
                {
                    id: 'nbr_creance_clients_12m',
                    label: 'Nbre de créances clients irrécouvrables',
                    type: 'number',
                    required: true,
                    unite: 'FCFA',
                    definition: 'Nbre de créances clients irrécouvrables',
                },
            ],
        },
        // 'Semestrielle': {
        //     'Indicateurs d\'activités de l\'entreprise du promoteur': [
        //         {
        //             id: 'nbr_cycle_production',
        //             label: 'Nombre de cycles de production réalisés',
        //             type: 'number',
        //             required: true,
        //             definition: 'Définir le nombre de cycles de production réalisés par le promoteur au cours du semestre si applicable'
        //         },
        //         {
        //             id: 'nbr_clients',
        //             label: 'Nombre de clients fidélisés',
        //             type: 'number',
        //             required: true,
        //             definition: 'Compter le nombre de clients fidélisés'
        //         },
        //         // {
        //         //     id: 'taux_croissance',
        //         //     label: 'Taux de croissance des clients',
        //         //     type: 'number',
        //         //     required: true,
        //         //     unite: '%',
        //         //     definition: 'La différence entre le nombre de clients de l\'exercice N et celui de l\'exercice précédent ou N-1. Le résultat obtenu est ensuite divisé par le nombre de clients de N-1 avant d\'être multiplier par 100'
        //         // },
        //         {
        //             id: 'chiffre_affaire',
        //             label: 'Chiffre d\'affaires',
        //             type: 'number',
        //             required: true,
        //             unite: 'FCFA',
        //             definition: 'Montant cumulé des ventes réalisées par l\'entreprise sur une période donnée'
        //         },
        //         // {
        //         //     id: 'taux_croissance_ca',
        //         //     label: 'Taux de croissance du Chiffre d\'affaires',
        //         //     type: 'number',
        //         //     required: true,
        //         //     unite: '%',
        //         //     definition: '(Chiffre d\'affaires de l\'exercice N – le chiffre d\'affaire de l\'exercice N-1) X 100'
        //         // }
        //     ],
        //     'Indicateurs de Rentabilité et de solvabilité de l\'entreprise du promoteur': [
        //         {
        //             id: 'cout_matiere_premiere',
        //             label: 'Coût des matières premières',
        //             type: 'number',
        //             required: true,
        //             unite: 'FCFA',
        //             definition: 'Coût total des matières premières utilisées dans la production'
        //         },
        //         {
        //             id: 'cout_main_oeuvre',
        //             label: 'Coût de la main-d\'œuvre directe',
        //             type: 'number',
        //             required: true,
        //             unite: 'FCFA',
        //             definition: 'Coût total de la main-d\'œuvre directement impliquée dans la production'
        //         },
        //         {
        //             id: 'cout_frais_generaux',
        //             label: 'Coût des frais généraux',
        //             type: 'number',
        //             required: true,
        //             unite: 'FCFA',
        //             definition: 'Coût des frais généraux liés à la production'
        //         },
        //         {
        //             id: 'produit_exploitation',
        //             label: 'Produit d\'exploitation',
        //             type: 'number',
        //             required: true,
        //             unite: 'FCFA',
        //             definition: 'Montant total des charges d\'exploitation'
        //         },
        //         {
        //             id: 'engagement_projet',
        //             label: 'Montant des engagement(emprunts/dettes) liées au projet',
        //             type: 'number',
        //             required: true,
        //             unite: 'FCFA',
        //             definition: 'Montant des emprunts ou dettes contractées dans le cadre du projet'
        //         },
        //         {
        //             id: 'engagement_autre',
        //             label: 'Montant des engagement(emprunts/dettes) hors projet',
        //             type: 'number',
        //             required: true,
        //             unite: 'FCFA',
        //             definition: 'Montant des autres emprunts ou dettes contractées en dehors du projet'
        //         },
        //         {
        //             id: 'capital_social',
        //             label: 'Capital social',
        //             type: 'number',
        //             required: true,
        //             unite: 'FCFA',
        //             definition: 'Montant du capital social de l\'entreprise'
        //         },
        //         {
        //             id: 'reserves_social',
        //             label: 'Réserves sociales',
        //             type: 'number',
        //             required: true,
        //             unite: 'FCFA',
        //             definition: 'Montant des réserves sociales de l\'entreprise'
        //         },
        //         {
        //             id: 'report_a_nouveau',
        //             label: 'Report à nouveau',
        //             type: 'number',
        //             required: true,
        //             unite: 'FCFA',
        //             definition: 'Montant du report à nouveau'
        //         },
        //         {
        //             id: 'resultat_net_exercice',
        //             label: 'Résultat net de l\'exercice',
        //             type: 'number',
        //             required: true,
        //             unite: 'FCFA',
        //             definition: 'Résultat net de l\'exercice comptable'
        //         },
        //         {
        //             id: 'subvention_investissement',
        //             label: 'Subvention d\'investissement',
        //             type: 'number',
        //             required: true,
        //             unite: 'FCFA',
        //             definition: 'Montant de la subvention d\'investissement reçue'
        //         },
        //         {
        //             id: 'subvention_oim',
        //             label: 'Subvention OIM',
        //             type: 'number',
        //             required: true,
        //             unite: 'FCFA',
        //             definition: 'Montant de la subvention OIM reçue'
        //         },
        //         {
        //             id: 'subvention_autres',
        //             label: 'Autres subventions',
        //             type: 'number',
        //             required: true,
        //             unite: 'FCFA',
        //             definition: 'Montant des autres subventions reçues'
        //         },
        //         {
        //             id: 'total_actif',
        //             label: 'Total actif',
        //             type: 'number',
        //             required: true,
        //             unite: 'FCFA',
        //             definition: 'Montant total de l\'actif de l\'entreprise'
        //         },
        //         {
        //             id: 'capitaux_propres',
        //             label: 'Capitaux propres',
        //             type: 'number',
        //             required: true,
        //             unite: 'FCFA',
        //             definition: 'Montant total des capitaux propres'
        //         },
        //         {
        //             id: 'dettes_financieres',
        //             label: 'Dettes financières',
        //             type: 'number',
        //             required: true,
        //             unite: 'FCFA',
        //             definition: 'Montant total des dettes financières'
        //         },
        //         {
        //             id: 'resultat_net_exploitation',
        //             label: 'Résultat net d\'exploitation',
        //             type: 'number',
        //             required: true,
        //             unite: 'FCFA',
        //             definition: 'Résultat net d\'exploitation'
        //         },
        //         //-------------------------------------------------------------------------
        //         {
        //             id: 'chiffre_affaire',
        //             label: 'Chiffre d\'affaire',
        //             type: 'number',
        //             required: true,
        //             unite: 'FCFA',
        //             definition: 'Montant cumulé des ventes réalisées par l\'entreprise sur une période donnée'
        //         },
        //         {
        //             id: 'cout_production',
        //             label: 'Cout de production',
        //             type: 'number',
        //             required: true,
        //             unite: 'FCFA',
        //             definition: 'Marge commerciale ou de production'
        //         },
        //         {
        //             id: 'engagement_projet',
        //             label: 'Emprunt dans le cadre du projet',
        //             type: 'number',
        //             required: true,
        //             unite: 'FCFA',
        //             definition: 'Montant total des engagements financiers de l’entreprise dans le cadre du projet'
        //         },
        //         {
        //             id: 'engagement_autre',
        //             label: 'Autre emprunts ',
        //             type: 'number',
        //             required: true,
        //             unite: 'FCFA',
        //             definition: 'Montant total des engagements financiers de l’entreprise hors du projet'
        //         },

        //     ],
        //     'Indicateurs de trésorerie de l\'entreprise du promoteur': [

        //         {
        //             id: 'capitaux_propres',
        //             label: 'Capitaux Propres',
        //             type: 'number',
        //             required: true,
        //             definition: 'Fonds de roulement'
        //         },

        //         {
        //             id: 'stocks',
        //             label: 'Stocks',
        //             type: 'number',
        //             required: true,
        //             unite: 'FCFA',
        //             definition: 'Montant total des stocks'
        //         },
        //         {
        //             id: 'creances_clients',
        //             label: 'Créances clients',
        //             type: 'number',
        //             required: true,
        //             unite: 'FCFA',
        //             definition: 'Montant total des créances clients'
        //         },
        //         {
        //             id: 'creances_fiscales',
        //             label: 'Créances fiscales',
        //             type: 'number',
        //             required: true,
        //             unite: 'FCFA',
        //             definition: 'Montant total des créances fiscales'
        //         },
        //         {
        //             id: 'dettes_fournisseurs',
        //             label: 'Dettes fournisseurs',
        //             type: 'number',
        //             required: true,
        //             unite: 'FCFA',
        //             definition: 'Montant total des dettes fournisseurs'
        //         },
        //         {
        //             id: 'dettes_sociales',
        //             label: 'Dettes sociales',
        //             type: 'number',
        //             required: true,
        //             unite: 'FCFA',
        //             definition: 'Montant total des dettes sociales'
        //         },
        //         {
        //             id: 'dettes_fiscales',
        //             label: 'Dettes fiscales',
        //             type: 'number',
        //             required: true,
        //             unite: 'FCFA',
        //             definition: 'Montant total des dettes fiscales'
        //         },
        //         {
        //             id: 'nbr_jours_fact_client_paie',
        //             label: 'Nombre de jours moyen de règlement des clients',
        //             type: 'number',
        //             required: true,
        //             definition: 'Délai moyen de règlement des clients en jours'
        //         },
        //         {
        //             id: 'capital_echu',
        //             label: 'Capital échu',
        //             type: 'number',
        //             required: true,
        //             unite: 'FCFA',
        //             definition: 'Montant du capital échu'
        //         },
        //         {
        //             id: 'capital_rembourse',
        //             label: 'Capital remboursé',
        //             type: 'number',
        //             required: true,
        //             unite: 'FCFA',
        //             definition: 'Montant du capital remboursé'
        //         },
        //         {
        //             id: 'nbr_jours_fact_fournisseur_paie',
        //             label: 'Nombre de jours moyen de paiement des fournisseurs',
        //             type: 'number',
        //             required: true,
        //             definition: 'Délai moyen de paiement des fournisseurs en jours'
        //         },
        //         {
        //             id: 'nbr_factures_impayees_12m',
        //             label: 'Nombre de factures impayées de plus de 12 mois',
        //             type: 'number',
        //             required: true,
        //             definition: 'Nombre de factures impayées datant de plus de 12 mois'
        //         },
        //         {
        //             id: 'actifs_immobilises',
        //             label: 'Actifs immobilisés',
        //             type: 'number',
        //             required: true,
        //             unite: 'FCFA',
        //             definition: 'Montant total des actifs immobilisés'
        //         },
        //         {
        //             id: 'emprunts_moyen_terme',
        //             label: 'Emprunts à moyen terme',
        //             type: 'number',
        //             required: true,
        //             unite: 'FCFA',
        //             definition: 'Montant des emprunts à moyen terme'
        //         },
        //         {
        //             id: 'emprunts_long_terme',
        //             label: 'Emprunts à long terme',
        //             type: 'number',
        //             required: true,
        //             unite: 'FCFA',
        //             definition: 'Montant des emprunts à long terme'
        //         },
        //         {
        //             id: 'nbr_echeances_impayes',
        //             label: 'Nombre d\'échéances impayées',
        //             type: 'number',
        //             required: true,
        //             definition: 'Nombre d\'échéances de crédit impayées'
        //         },
        //         {
        //             id: 'nbr_echeances_aterme',
        //             label: 'Nombre  d\'échéances à terme',
        //             type: 'number',
        //             required: true,
        //             definition: 'Nombre total d\'échéances de crédit à terme'
        //         },
        //     ],
        //     'Indicateurs Sociaux et ressources humaines de l\'entreprise du promoteur': [
        //         {
        //             id: 'nbr_employes_non_remunerer_h',
        //             label: ' Nombre de personnel non rémunéré hommes',
        //             type: 'number',
        //             required: true,
        //             definition: 'Nombre de personnel non rémunéré au cours de l\'année N-1 (du 1er au 31 décembre)'
        //         },
        //         {
        //             id: 'nbr_employes_non_remunerer_f',
        //             label: ' Nombre de personnel non rémunéré femmes',
        //             type: 'number',
        //             required: true,
        //             definition: 'Nombre de personnel non rémunéré au cours de l\'année N-1 (du 1er au 31 décembre)'
        //         },
        //        // ----------------------------------------------------------------------------------------------------------

        //        {
        //         id: 'nbr_employes_non_remunerer_h',
        //         label: ' Nombre d\'employés de l\'entreprisen  rémunéré hommes',
        //         type: 'number',
        //         required: true,
        //         definition: 'Nombre de personnel non rémunéré au cours de l\'année N-1 (du 1er au 31 décembre)'
        //     },
        //     {
        //         id: 'nbr_employes_remunerer_f',
        //         label: ' Nombre Nombre d\'employés de l\'entreprisen rémunéré femmes',
        //         type: 'number',
        //         required: true,
        //         definition: 'Nombre de personnel non rémunéré au cours de l\'année N-1 (du 1er au 31 décembre)'
        //     },

        //         {
        //             id: 'nbr_depart_h',
        //             label: 'Nombre de départs hommes',
        //             type: 'number',
        //             required: true,
        //             definition: 'Nombre d\'employés hommes ayant quitté l\'entreprise'
        //         },
        //         {
        //             id: 'nbr_depart_f',
        //             label: 'Nombre de départs femmes',
        //             type: 'number',
        //             required: true,
        //             definition: 'Nombre d\'employées femmes ayant quitté l\'entreprise'
        //         },
        //         {
        //             id: 'nbr_nouveaux_recrus_h',
        //             label: 'Nombre de nouveaux recrutés hommes',
        //             type: 'number',
        //             required: true,
        //             definition: 'Nombre de nouveaux employés hommes recrutés'
        //         },
        //         {
        //             id: 'nbr_nouveaux_recrus_f',
        //             label: 'Nombre de nouvelles recrutées femmes',
        //             type: 'number',
        //             required: true,
        //             definition: 'Nombre de nouvelles employées femmes recrutées'
        //         },
        //         {
        //             id: 'effectif_moyen_h',
        //             label: 'Effectif moyen hommes',
        //             type: 'number',
        //             required: true,
        //             definition: 'Effectif moyen d\'employés hommes sur la période'
        //         },
        //         {
        //             id: 'effectif_moyen_f',
        //             label: 'Effectif moyen femmes',
        //             type: 'number',
        //             required: true,
        //             definition: 'Effectif moyen d\'employées femmes sur la période'
        //         }
        //     ],
        //     'Indicateurs de développement personnel du promoteur': [
        //         {
        //             id: 'nbr_initiatives_realises',
        //             label: 'Nombre d\'initiatives personnelles réalisées',
        //             type: 'number',
        //             required: true,
        //             definition: 'Le nombre d\'initiatives personnelles réalisées du promoteur ou de la coopérative grâce aux motivations du Coaching'
        //         },
        //         {
        //             id: 'nbr_initiatives_encours',
        //             label: 'Nombre d\'initiatives personnelles en cours',
        //             type: 'number',
        //             required: true,
        //             definition: 'Le nombre d\'initiatives personnelles en cours du promoteur ou de la coopérative grâce aux motivations du Coaching'
        //         },
        //         {
        //             id: 'nbr_initiatives_aboutis',
        //             label: 'Nombre d\'initiatives personnelles abouties',
        //             type: 'number',
        //             required: true,
        //             definition: 'Le nombre d\'initiatives personnelles ayant abouti'
        //         },
        //         {
        //             id: 'nbr_initiatives_abandonnees',
        //             label: 'Nombre d\'initiatives personnelles abandonnées',
        //             type: 'number',
        //             required: true,
        //             definition: 'Le nombre d\'initiatives personnelles abandonnées'
        //         },
        //         {
        //             id: 'nbr_objectifs_planifies',
        //             label: 'Nombre d\'objectifs personnels planifiés',
        //             type: 'number',
        //             required: true,
        //             definition: 'Le nombre d\'objectifs personnels planifiés par le promoteur'
        //         },
        //         {
        //             id: 'nbr_objectifs_realises',
        //             label: 'Nombre d\'objectifs personnels réalisés',
        //             type: 'number',
        //             required: true,
        //             definition: 'Le nombre d\'objectifs personnels réalisés par le promoteur'
        //         },
        //         {
        //             id: 'nbr_objectifs_aboutis',
        //             label: 'Nombre d\'objectifs personnels aboutis',
        //             type: 'number',
        //             required: true,
        //             definition: 'Le nombre d\'objectifs personnels ayant abouti'
        //         },
        //         {
        //             id: 'nbr_objectifs_abandonnees',
        //             label: 'Nombre d\'objectifs personnels abandonnés',
        //             type: 'number',
        //             required: true,
        //             definition: 'Le nombre d\'objectifs personnels abandonnés'
        //         }
        //     ],
        //     'Indicateurs de performance Projet': [
        //         {
        //             id: 'total_autres_revenus',
        //             label: 'Montant des revenus hors entreprise principale',
        //             type: 'number',
        //             required: true,
        //             unite: 'FCFA',
        //             definition: 'Recenser les autres revenus du promoteur en dehors des revenus issus de son entreprise bénéficiaire de l\'appui du projet'
        //         },
        //         {
        //             id: 'revenu_total',
        //             label: 'Montant total des revenus du promoteur',
        //             type: 'calculated',
        //             required: true,
        //             unite: 'FCFA',
        //             definition: 'Somme du chiffre d\'affaires et des revenus hors entreprise principale',
        //             isCalculated: true,
        //             dependencies: [
        //                 { field: 'chiffre_affaire' },
        //                 { field: 'total_autres_revenus' }
        //             ]
        //         }
        //     ]
        // },
        Semestrielle: {
            "Indicateurs d'activités de l'entreprise du promoteur": [
                {
                    id: 'nbr_cycle_production',
                    label: 'Nombre de cycles de production réalisés',
                    type: 'number',
                    required: true,
                    definition: 'Définir le nombre de cycles de production réalisés par le promoteur au cours du semestre si applicable',
                },
                {
                    id: 'nbr_clients',
                    label: 'Nombre de clients fidélisés',
                    type: 'number',
                    required: true,
                    definition: 'Compter le nombre de clients fidélisés',
                },
                {
                    id: 'chiffre_affaire',
                    label: "Chiffre d'affaires",
                    type: 'number',
                    required: true,
                    unite: 'FCFA',
                    definition: "Montant cumulé des ventes réalisées par l'entreprise sur une période donnée",
                },
                {
                    id: 'taux_croissance_ca',
                    label: "Taux de croissance du Chiffre d'affaires",
                    type: 'number',
                    required: true,
                    unite: '%',
                    definition: "(Chiffre d'affaires de l'exercice N – le chiffre d'affaires de l'exercice N-1) X 100",
                },
            ],
            'Indicateurs de Rentabilité et de solvabilité': [
                {
                    id: 'cout_matiere_premiere',
                    label: 'Coût des matières premières',
                    type: 'number',
                    required: true,
                    unite: '',
                    definition: 'Coût total des matières premières utilisées dans la production',
                },
                {
                    id: 'cout_main_oeuvre',
                    label: "Coût de la main d'œuvre directe",
                    type: 'number',
                    required: true,
                    unite: '',
                    definition: "Coût total de la main-d'œuvre directement impliquée dans la production",
                },
                {
                    id: 'cout_frais_generaux',
                    label: 'Coût des frais généraux',
                    type: 'number',
                    required: true,
                    unite: '',
                    definition: "Coût des frais généraux liés à l'exploitation",
                },
                {
                    id: 'produit_exploitation',
                    label: "Produits d'exploitation",
                    type: 'number',
                    required: true,
                    unite: '',
                    definition: "Montant total des produits d'exploitation",
                },
                {
                    id: 'cout_production',
                    label: 'Coût de production',
                    type: 'number',
                    required: true,
                    unite: '',
                    definition: 'Coût total de la production',
                },
                {
                    id: 'subvention_oim',
                    label: 'Subvention OIM',
                    type: 'number',
                    required: true,
                    unite: '',
                    definition: 'Montant de la subvention OIM reçue',
                },
                {
                    id: 'subvention_autres',
                    label: 'Autres subventions',
                    type: 'number',
                    required: true,
                    unite: '',
                    definition: 'Montant des autres subventions reçues',
                },
                {
                    id: 'subvention_investissement',
                    label: "Subventions d'investissement",
                    type: 'number',
                    required: true,
                    unite: '',
                    definition: "Montant des subventions d'investissement reçues",
                },
                {
                    id: 'total_actif',
                    label: 'Total des actifs',
                    type: 'number',
                    required: true,
                    unite: '',
                    definition: "Montant total des actifs de l'entreprise",
                },
                {
                    id: 'capital_social',
                    label: 'Capital social',
                    type: 'number',
                    required: true,
                    unite: '',
                    definition: "Montant du capital social de l'entreprise",
                },
                {
                    id: 'reserves_social',
                    label: 'Réserves sociales',
                    type: 'number',
                    required: true,
                    unite: '',
                    definition: "Montant des réserves sociales de l'entreprise",
                },
                {
                    id: 'report_a_nouveau',
                    label: 'Report à nouveau',
                    type: 'number',
                    required: true,
                    unite: '',
                    definition: 'Montant du report à nouveau',
                },
                {
                    id: 'resultat_net_exercice',
                    label: "Résultat net de l'exercice",
                    type: 'number',
                    required: true,
                    unite: '',
                    definition: "Résultat net de l'exercice comptable",
                },
                {
                    id: 'engagement_projet',
                    label: 'Emprunts liés au projet',
                    type: 'number',
                    required: true,
                    unite: '',
                    definition: 'Montant des emprunts contractés dans le cadre du projet',
                },
                {
                    id: 'engagement_autre',
                    label: 'Autres emprunts',
                    type: 'number',
                    required: true,
                    unite: '',
                    definition: 'Montant des autres emprunts contractés',
                },
                {
                    id: 'resultat_net_exploitation',
                    label: "Résultat net d'exploitation",
                    type: 'number',
                    required: true,
                    unite: '',
                    definition: "Résultat net d'exploitation",
                },
                {
                    id: 'capitaux_propres',
                    label: 'Capitaux propres',
                    type: 'number',
                    required: true,
                    unite: '',
                    definition: 'Montant total des capitaux propres',
                },
                {
                    id: 'dettes_financieres',
                    label: 'Dettes financières',
                    type: 'number',
                    required: true,
                    unite: '',
                    definition: 'Montant total des dettes financières',
                },
            ],
            'Indicateurs de trésorerie': [
                {
                    id: 'actifs_immobilises',
                    label: 'Actifs immobilisés',
                    type: 'number',
                    required: true,
                    unite: '',
                    definition: 'Montant total des actifs immobilisés',
                },
                {
                    id: 'stocks',
                    label: 'Stocks',
                    type: 'number',
                    required: true,
                    unite: '',
                    definition: 'Montant total des stocks',
                },
                {
                    id: 'creances_clients',
                    label: 'Créances clients',
                    type: 'number',
                    required: true,
                    unite: '',
                    definition: 'Montant total des créances clients',
                },
                {
                    id: 'creances_fiscales',
                    label: 'Créances fiscales',
                    type: 'number',
                    required: true,
                    unite: '',
                    definition: 'Montant total des créances fiscales',
                },
                {
                    id: 'dettes_fournisseurs',
                    label: 'Dettes fournisseurs',
                    type: 'number',
                    required: true,
                    unite: '',
                    definition: 'Montant total des dettes fournisseurs',
                },
                {
                    id: 'dettes_sociales',
                    label: 'Dettes sociales',
                    type: 'number',
                    required: true,
                    unite: '',
                    definition: 'Montant total des dettes sociales',
                },
                {
                    id: 'dettes_fiscales',
                    label: 'Dettes fiscales',
                    type: 'number',
                    required: true,
                    unite: '',
                    definition: 'Montant total des dettes fiscales',
                },
                {
                    id: 'nbr_echeances_impayes',
                    label: "Nombre d'échéances impayées",
                    type: 'number',
                    required: true,
                    definition: "Nombre d'échéances de crédit impayées",
                },
                {
                    id: 'nbr_echeances_aterme',
                    label: "Nombre d'échéances à terme",
                    type: 'number',
                    required: true,
                    definition: "Nombre total d'échéances de crédit à terme",
                },
                {
                    id: 'capital_rembourse',
                    label: 'Capital remboursé',
                    type: 'number',
                    required: true,
                    unite: '',
                    definition: 'Montant du capital remboursé',
                },
                {
                    id: 'capital_echu',
                    label: 'Capital échu',
                    type: 'number',
                    required: true,
                    unite: '',
                    definition: 'Montant du capital échu',
                },
                {
                    id: 'nbr_jours_fact_client_paie',
                    label: 'Délai moyen de paiement clients',
                    type: 'number',
                    required: true,
                    definition: 'Délai moyen de paiement des clients en jours',
                },
                {
                    id: 'nbr_jours_fact_fournisseur_paie',
                    label: 'Délai moyen de paiement fournisseurs',
                    type: 'number',
                    required: true,
                    definition: 'Délai moyen de paiement des fournisseurs en jours',
                },
                {
                    id: 'nbr_factures_impayees_12m',
                    label: 'Factures clients impayées (>12 mois)',
                    type: 'number',
                    required: true,
                    definition: 'Nombre de factures clients impayées datant de plus de 12 mois',
                },
                {
                    id: 'emprunts_moyen_terme',
                    label: 'Emprunts à moyen terme',
                    type: 'number',
                    required: true,
                    unite: 'FCFA',
                    definition: 'Montant des emprunts à moyen terme',
                },
                {
                    id: 'emprunts_long_terme',
                    label: 'Emprunts à long terme',
                    type: 'number',
                    required: true,
                    unite: 'FCFA',
                    definition: 'Montant des emprunts à long terme',
                },
            ],
            'Indicateurs Sociaux et RH': [
                {
                    id: 'nbr_employes_remunerer_h',
                    label: 'Employés rémunérés (hommes)',
                    type: 'number',
                    required: true,
                    definition: "Nombre d'employés hommes rémunérés au cours de l'année",
                },
                {
                    id: 'nbr_employes_remunerer_f',
                    label: 'Employés rémunérés (femmes)',
                    type: 'number',
                    required: true,
                    definition: "Nombre d'employées femmes rémunérées au cours de l'année",
                },
                {
                    id: 'nbr_employes_non_remunerer_h',
                    label: 'Employés non rémunérés (hommes)',
                    type: 'number',
                    required: true,
                    definition: "Nombre d'employés hommes non rémunérés au cours de l'année",
                },
                {
                    id: 'nbr_employes_non_remunerer_f',
                    label: 'Employés non rémunérés (femmes)',
                    type: 'number',
                    required: true,
                    definition: "Nombre d'employées femmes non rémunérées au cours de l'année",
                },
                {
                    id: 'nbr_nouveau_recru_h',
                    label: 'Nouveaux recrutés (hommes)',
                    type: 'number',
                    required: true,
                    definition: 'Nombre de nouveaux employés hommes recrutés',
                },
                {
                    id: 'nbr_nouveau_recru_f',
                    label: 'Nouveaux recrutés (femmes)',
                    type: 'number',
                    required: true,
                    definition: 'Nombre de nouvelles employées femmes recrutées',
                },
                {
                    id: 'nbr_depart_h',
                    label: 'Départs (hommes)',
                    type: 'number',
                    required: true,
                    definition: "Nombre d'employés hommes ayant quitté l'entreprise",
                },
                {
                    id: 'nbr_depart_f',
                    label: 'Départs (femmes)',
                    type: 'number',
                    required: true,
                    definition: "Nombre d'employées femmes ayant quitté l'entreprise",
                },
                {
                    id: 'effectif_moyen_h',
                    label: 'Effectif moyen (hommes)',
                    type: 'number',
                    required: true,
                    definition: "Effectif moyen d'employés hommes sur la période",
                },
                {
                    id: 'effectif_moyen_f',
                    label: 'Effectif moyen (femmes)',
                    type: 'number',
                    required: true,
                    definition: "Effectif moyen d'employées femmes sur la période",
                },
            ],
            'Indicateurs de développement personnel': [
                {
                    id: 'nbr_initiatives_realises',
                    label: 'Initiatives personnelles réalisées',
                    type: 'number',
                    required: true,
                    definition: "Nombre d'initiatives personnelles réalisées par le promoteur",
                },
                {
                    id: 'nbr_initiatives_encours',
                    label: 'Initiatives personnelles en cours',
                    type: 'number',
                    required: true,
                    definition: "Nombre d'initiatives personnelles en cours par le promoteur",
                },
                {
                    id: 'nbr_initiatives_abandonnees',
                    label: 'Initiatives personnelles abandonnées',
                    type: 'number',
                    required: true,
                    definition: "Nombre d'initiatives personnelles abandonnées par le promoteur",
                },
                {
                    id: 'nbr_initiatives_aboutis',
                    label: 'Initiatives personnelles abouties',
                    type: 'number',
                    required: true,
                    definition: "Nombre d'initiatives personnelles ayant abouti",
                },
                {
                    id: 'nbr_objectifs_planifies',
                    label: 'Objectifs personnels planifiés',
                    type: 'number',
                    required: true,
                    definition: "Nombre d'objectifs personnels planifiés par le promoteur",
                },
                {
                    id: 'nbr_objectifs_realises',
                    label: 'Objectifs personnels réalisés',
                    type: 'number',
                    required: true,
                    definition: "Nombre d'objectifs personnels réalisés par le promoteur",
                },
                {
                    id: 'nbr_objectifs_abandonnees',
                    label: 'Objectifs personnels abandonnés',
                    type: 'number',
                    required: true,
                    definition: "Nombre d'objectifs personnels abandonnés par le promoteur",
                },
                {
                    id: 'nbr_objectifs_aboutis',
                    label: 'Objectifs personnels aboutis',
                    type: 'number',
                    required: true,
                    definition: "Nombre d'objectifs personnels ayant abouti",
                },
            ],
            'Indicateurs de performance Projet': [
                {
                    id: 'total_autres_revenus',
                    label: 'Revenus hors entreprise principale',
                    type: 'number',
                    required: true,
                    unite: 'FCFA',
                    definition: "Montant des revenus du promoteur en dehors de l'entreprise principale",
                },
                {
                    id: 'chiffre_affaire',
                    label: "Chiffre d'affaires",
                    type: 'number',
                    required: true,
                    unite: '',
                    definition: "Montant cumulé des ventes réalisées par l'entreprise sur une période donnée",
                },
            ],
        },

        Annuelle: {
            "Ratios de Rentabilité et de solvabilité de l'entreprise": [
                {
                    id: 'charges_financières',
                    label: 'Charges financières (intérêts et frais)',
                    type: 'number',
                    required: true,
                    unite: '',
                    definition: 'Montant des intérêts et frais financiers',
                },
                {
                    id: 'dette_financement',
                    label: 'Dettes de financement',
                    type: 'number',
                    required: true,
                    unite: '',
                    definition: 'Montant total des dettes de financement',
                },
                {
                    id: 'moyenne_capitaux_propre',
                    label: 'Moyenne des capitaux propres',
                    type: 'number',
                    required: true,
                    unite: '',
                    definition: 'Moyenne des capitaux propres sur la période',
                },

                {
                    id: 'r_n_exploitation_aimp',
                    label: 'Résultat net d’exploitation après impôts',
                    type: 'number',
                    required: true,
                    unite: 'FCFA',
                    definition: 'Résultat net d’exploitation après impôts',
                },
                {
                    id: 'charges_exploitation',
                    label: "Charge d'exploitation",
                    type: 'number',
                    required: true,
                    unite: 'FCFA',
                    definition: 'Autosuffisance opérationnelle',
                },

                {
                    id: 'produit_exploitation',
                    label: "Produit d'exploitation",
                    type: 'number',
                    required: true,
                    unite: '',
                    definition: 'Autosuffisance opérationnelle',
                },
            ],
            "Indicateurs de trésorerie de l'entreprise du promoteur": [
                {
                    id: 'montant_credit',
                    label: 'Montant cumulé des crédits reçus',
                    type: 'number',
                    required: true,
                    unite: '',
                    definition: "Montant total des crédits reçus au cours de l'année N-1",
                },
                {
                    id: 'nombres_credits',
                    label: 'Nombre de crédits reçus',
                    type: 'number',
                    required: true,
                    definition: "Nombre de crédits reçus au cours de l'année N-1",
                },
            ],
            // 'Indicateurs de performance Projet': [
            //     {
            //         id: 'acces_financement',
            //         label: 'Nombre de promoteurs bénéficiaires de crédit grâce au projet',
            //         type: 'number',
            //         required: true,
            //         definition: 'Nombre de promoteurs qui ont accès à un crédit pour le financement de leurs entreprises grâce au projet'
            //     },
            //     // {
            //     //     id: 'montant_credit_projet',
            //     //     label: 'Montant des crédits octroyés aux jeunes dans le cadre du projet',
            //     //     type: 'number',
            //     //     required: true,
            //     //     unite: 'FCFA',
            //     //     definition: 'Montant total de crédit octroyé aux jeunes grâce à l\'appui du projet'
            //     // },
            //     {
            //         id: 'prop_revenu_accru_h',
            //         label: 'Proportion d\'hommes avec revenus accrus grâce au projet',
            //         type: 'number',
            //         required: true,
            //         unite: '%',
            //         definition: 'Proportion des jeunes hommes bénéficiaires des formations, du financement et de l\'appui conseil qui ont augmenté leurs revenus annuels grâce aux microentreprises qu\'ils ont créé avec l\'assistance du projet'
            //     },
            //     {
            //         id: 'prop_revenu_accru_f',
            //         label: 'Proportion de femmes avec revenus accrus grâce au projet',
            //         type: 'number',
            //         required: true,
            //         unite: '%',
            //         definition: 'Proportion des jeunes femmes bénéficiaires des formations, du financement et de l\'appui conseil qui ont augmenté leurs revenus annuels grâce aux microentreprises qu\'elles ont créé avec l\'assistance du projet'
            //     }
            // ]
        },
        // 'Occasionnelle': {
        //     'Indicateurs de performance Projet': [
        //         {
        //             id: 'nbr_formation_entrepreneuriat_h',
        //             label: 'Nombre d\'hommes formés en entrepreneuriat',
        //             type: 'number',
        //             required: true,
        //             definition: 'Nombre de jeunes hommes qui participent aux sessions de formation en entrepreneuriat organisées dans le cadre du projet'
        //         },
        //         {
        //             id: 'nbr_formation_entrepreneuriat_f',
        //             label: 'Nombre de femmes formées en entrepreneuriat',
        //             type: 'number',
        //             required: true,
        //             definition: 'Nombre de jeunes femmes qui participent aux sessions de formation en entrepreneuriat organisées dans le cadre du projet'
        //         },
        //         {
        //             id: 'nbr_former_technique_typeactivite',
        //             label: 'Nombre de jeunes formés techniquement par type d\'activité',
        //             type: 'number',
        //             required: true,
        //             definition: 'Nombre de jeunes qui participent aux sessions de formation techniques organisées dans le cadre du projet, ventilé par type d\'activité'
        //         },
        //         {
        //             id: 'nbr_former_technique_typebenef',
        //             label: 'Nombre de jeunes formés techniquement par type de bénéficiaire',
        //             type: 'number',
        //             required: true,
        //             definition: 'Nombre de jeunes qui participent aux sessions de formation techniques organisées dans le cadre du projet, ventilé par type de bénéficiaire'
        //         },
        //         {
        //             id: 'nbr_bancarisation_h',
        //             label: 'Nombre d\'hommes bancarisés',
        //             type: 'number',
        //             required: true,
        //             definition: 'Nombre de promoteurs hommes qui disposent de compte bancaires'
        //         },
        //         {
        //             id: 'nbr_bancarisation_f',
        //             label: 'Nombre de femmes bancarisées',
        //             type: 'number',
        //             required: true,
        //             definition: 'Nombre de promoteurs femmes qui disposent de compte bancaires'
        //         },
        //         {
        //             id: 'nbr_bancarisation_individuelle',
        //             label: 'Nombre de bancarisations individuelles',
        //             type: 'number',
        //             required: true,
        //             definition: 'Nombre de promoteurs individuels qui disposent de compte bancaires'
        //         },
        //         {
        //             id: 'nbr_bancarisation_cooperative',
        //             label: 'Nombre de bancarisations de coopératives',
        //             type: 'number',
        //             required: true,
        //             definition: 'Nombre de coopératives qui disposent de compte bancaires'
        //         },
        //         {
        //             id: 'appreciation_ong',
        //             label: 'Appréciation de l\'organisation interne',
        //             type: 'number',
        //             required: true,
        //             unite: '/3',
        //             definition: '% des entreprises/coopératives qui enregistrent un score moyen de 3/3 suivant l\'appréciation de leur organisations internes, des services fournies et de leurs relations externes'
        //         },
        //         {
        //             id: 'insertion_professionnelle',
        //             label: 'Pourcentage de jeunes formés/sensibilisés ayant développé des initiatives pour leur insertion professionnelle',
        //             type: 'number',
        //             required: true,
        //             unite: '%',
        //             definition: 'Proportion des jeunes sélectionnés au démarrage du projet qui mettent en œuvre leur idée de projet/participent aux activités des coopératives jusqu\'à la fin du projet'
        //         }
        //     ]
        // }
    };

    /**
     * Calculer un indicateur à partir de ses dépendances
     * @param indicator L'indicateur à calculer
     * @param allData Les données de tous les indicateurs
     * @returns La valeur calculée ou null en cas d'erreur
     */
    static calculateFromDependencies(indicator: IndicateurField, allData: Record<string, Record<string, Record<string, any>>>) {
        if (!indicator.dependencies || indicator.dependencies.length === 0) {
            return null;
        }

        // Cas particulier : somme des revenus (chiffre d'affaires + autres revenus)
        if (indicator.id === 'revenu_total') {
            const periode = 'Semestrielle';
            const ca = allData[periode]?.["Indicateurs d'activités de l'entreprise du promoteur"]?.['chiffre_affaire'] || 0;
            const autresRevenus = allData[periode]?.['Indicateurs de performance Projet']?.['total_autres_revenus'] || 0;
            return Number(ca) + Number(autresRevenus);
        }

        return null;
    }

    /**
     * Vérifie si toutes les dépendances d'un indicateur sont disponibles
     * @param indicator L'indicateur à vérifier
     * @param allData Les données de tous les indicateurs
     * @returns true si toutes les dépendances sont disponibles, false sinon
     */
    static checkDependenciesAvailability(indicator: IndicateurField, allData: Record<string, Record<string, Record<string, any>>>): boolean {
        if (!indicator.dependencies || indicator.dependencies.length === 0) {
            return true;
        }

        return indicator.dependencies.every((dep) => {
            const periode =
                dep.periode || indicator.categorie
                    ? Object.keys(this.indicateursByPeriode).find((p) =>
                          Object.keys(this.indicateursByPeriode[p as PeriodeName]).includes(indicator.categorie || ''),
                      )
                    : null;

            if (!periode) return false;

            const categorie = dep.categorie || indicator.categorie;
            if (!categorie) return false;

            return allData[periode]?.[categorie]?.[dep.field] !== undefined;
        });
    }

    /**
     * Récupérer toutes les périodes disponibles
     * @returns Liste des périodes
     */
    static getAvailablePeriodes(): PeriodeName[] {
        return Object.keys(this.indicateursByPeriode) as PeriodeName[];
    }

    /**
     * Récupérer toutes les catégories disponibles pour une période spécifique
     * @param periode Période concernée
     * @returns Liste des catégories disponibles pour cette période
     */
    static getCategoriesForPeriode(periode: PeriodeName): string[] {
        if (!this.indicateursByPeriode[periode]) {
            return [];
        }

        return Object.keys(this.indicateursByPeriode[periode]);
    }

    /**
     * Obtenir tous les indicateurs pour une période et catégorie spécifiques
     * @param periode Période concernée
     * @param categorie Catégorie concernée
     * @returns Liste des indicateurs
     */
    static getIndicateursByPeriodeAndCategorie(periode: PeriodeName, categorie: string): IndicateurField[] {
        if (!this.indicateursByPeriode[periode] || !this.indicateursByPeriode[periode][categorie]) {
            return [];
        }

        return this.indicateursByPeriode[periode][categorie];
    }

    /**
     * Obtenir tous les indicateurs pour une période
     * @param periode Période concernée
     * @returns Tous les indicateurs de cette période, regroupés par catégorie
     */
    static getIndicateursByPeriode(periode: PeriodeName): Record<string, IndicateurField[]> {
        return this.indicateursByPeriode[periode] || {};
    }

    /**
     * Obtenir tous les indicateurs calculés pour une période et catégorie
     * @param periode Période concernée
     * @param categorie Catégorie concernée
     * @returns Liste des indicateurs calculés
     */
    static getCalculatedIndicateursByPeriodeAndCategorie(periode: PeriodeName, categorie: string): IndicateurField[] {
        const indicateurs = this.getIndicateursByPeriodeAndCategorie(periode, categorie);
        return indicateurs.filter((ind) => ind.isCalculated === true || ind.type === 'calculated');
    }

    /**
     * Récupérer tous les indicateurs de saisie (non calculés) pour une période et catégorie
     * @param periode Période concernée
     * @param categorie Catégorie concernée
     * @returns Liste des indicateurs de saisie
     */
    static getInputIndicateursByPeriodeAndCategorie(periode: PeriodeName, categorie: string): IndicateurField[] {
        const indicateurs = this.getIndicateursByPeriodeAndCategorie(periode, categorie);
        return indicateurs.filter((ind) => !ind.isCalculated && ind.type !== 'calculated');
    }

    /**
     * Calculer tous les indicateurs dérivés pour une période et catégorie
     * @param periode Période concernée
     * @param categorie Catégorie concernée
     * @param data Données saisies
     * @param allData Toutes les données des autres périodes/catégories
     * @returns Données complétées avec les valeurs calculées
     */
    static calculateIndicateurs(
        periode: PeriodeName,
        categorie: string,
        data: Record<string, any>,
        allData?: Record<string, Record<string, Record<string, any>>>,
    ): Record<string, any> {
        const results = { ...data };
        const calculatedIndicateurs = this.getCalculatedIndicateursByPeriodeAndCategorie(periode, categorie);

        // Si on a toutes les données et des indicateurs calculés
        if (allData && calculatedIndicateurs.length > 0) {
            // Pour chaque indicateur calculé
            calculatedIndicateurs.forEach((indicator) => {
                // Si l'indicateur a des dépendances
                if (indicator.dependencies && indicator.dependencies.length > 0) {
                    // Vérifier si toutes les dépendances sont disponibles
                    if (this.checkDependenciesAvailability(indicator, allData)) {
                        // Calculer l'indicateur
                        const value = this.calculateFromDependencies(indicator, allData);
                        if (value !== null) {
                            results[indicator.id] = value;
                        }
                    }
                }
            });
        }

        return results;
    }

    /**
     * Valider les données saisies pour une période et catégorie
     * @param periode Période concernée
     * @param categorie Catégorie concernée
     * @param data Données à valider
     * @returns Liste des erreurs ou tableau vide si OK
     */
    static validateData(periode: PeriodeName, categorie: string, data: Record<string, any>): string[] {
        const errors: string[] = [];
        const indicateurs = this.getInputIndicateursByPeriodeAndCategorie(periode, categorie);

        indicateurs
            .filter((ind) => ind.required)
            .forEach((ind) => {
                if (data[ind.id] === undefined || data[ind.id] === '' || data[ind.id] === null) {
                    errors.push(`Le champ "${ind.label}" est obligatoire.`);
                }
            });

        return errors;
    }
}

export default IndicateurCalculator;
