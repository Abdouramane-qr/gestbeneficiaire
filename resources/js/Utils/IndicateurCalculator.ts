//import { SetStateAction } from 'react';

/**
 * Interface pour les champs d'indicateurs
 */
export interface IndicateurField {
    id: string;
    label: string;
    type: 'number' | 'text' | 'calculated';
    required?: boolean;
    unite?: string;
    formula?: string;
    description?: string;
    definition?: string; // Définition opérationnelle
    categorie?: string; // Catégorie de l'indicateur
    isCalculated?: boolean; // Indique si le champ est calculé
    // Nouvelles propriétés pour les dépendances
    dependencies?: {
        field: string;        // ID du champ dont dépend cet indicateur
        categorie?: string;   // Catégorie du champ (si différente)
        periode?: PeriodeName; // Période du champ (si différente)
    }[];
    calculMethod?: 'auto' | 'manual' | 'hybrid'; // Méthode de calcul
}

/**
 * Type pour les catégories
 */
export type CategorieName =
    'Indicateurs commerciaux de l\'entreprise du promoteur' |
    'Indicateurs d\'activités de l\'entreprise du promoteur' |
    'Ratios de Rentabilité et de solvabilité de l\'entreprise' |
    'Indicateurs de Rentabilité et de solvabilité de l\'entreprise du promoteur' |
    'Indicateurs Sociaux et ressources humaines de l\'entreprise du promoteur' |
    'Indicateurs de performance Projet';

/**
 * Type pour les périodes
 */
export type PeriodeName = 'Mensuelle' | 'Trimestrielle' | 'Semestrielle' | 'Annuelle' | 'Occasionnelle';

/**
 * Classe utilitaire pour gérer les indicateurs organisés par période
 */
export class IndicateurCalculator {
    static calculateFromDependencies(indicator: IndicateurField, allData: Record<string, Record<string, Record<string, any>>>) {
        throw new Error('Method not implemented.');
    }
    static checkDependenciesAvailability(indicator: any, allData: Record<string, Record<string, Record<string, any>>>): boolean {
        throw new Error('Method not implemented.');
    }
    // Mode debug
    static debug = false;

    /**
     * Structure des indicateurs par période puis par catégorie
     */
    static indicateursByPeriode: Record<PeriodeName, Record<string, IndicateurField[]>> = {
        'Mensuelle': {
          'Indicateurs de performance Projet': [
            {
              id: 'creation_entreprise',
              label: 'Nombre de jeunes ayant démarré/renforcé une entreprise formelle',
              type: 'number',
              required: true,
              definition: 'Nombre de jeunes qui ont créé/renforcé leur entreprises individuelles/collectives formalisées grâce à l\'appui du projet'
            }
          ]
        },
        'Trimestrielle': {
          'Indicateurs commerciaux de l\'entreprise du promoteur': [
            {
              id: 'propects_grossites',
              label: 'Nombre de clients prospectés (grossistes)',
              type: 'number',
              required: true,
              definition: 'Le nombre de clients potentiels prospectés par le promoteur grâce au coaching et l\'appui conseil'
            },
            {
              id: 'prospects_detaillant',
              label: 'Nombre de clients prospectés (détaillants)',
              type: 'number',
              required: true,
              definition: 'Le nombre de clients potentiels prospectés par le promoteur grâce au coaching et l\'appui conseil'
            },
            {
              id: 'clients_grossistes',
              label: 'Nombre de nouveaux clients (grossistes)',
              type: 'number',
              required: true,
              definition: 'Nombre de nouveau Clients obtenus grâce au coaching et l\'appui conseil'
            },
            {
              id: 'clients_detaillant',
              label: 'Nombre de nouveaux clients (détaillants)',
              type: 'number',
              required: true,
              definition: 'Nombre de nouveau Clients obtenus grâce au coaching et l\'appui conseil'
            },
            {
              id: 'nbr_contrat_conclu',
              label: 'Nombre de commandes/contrats obtenus',
              type: 'number',
              required: true,
              definition: 'Nombre de commandes ou de contrats obtenus avec des grossistes ou des particuliers'
            },
            {
              id: 'nbr_contrat_encours',
              label: 'Nombre de commandes/contrats en cours',
              type: 'number',
              required: true,
              definition: 'Nombre de commandes ou de contrats obtenus avec des grossistes ou des particuliers'
            },
            {
              id: 'nbr_contrat_perdu',
              label: 'Nombre de commandes/contrats perdus',
              type: 'number',
              required: true,
              definition: 'Nombre de commandes ou de contrats obtenus avec des grossistes ou des particuliers'
            }
          ],
          'Indicateurs de trésorerie de l\'entreprise du promoteur': [
            {
              id: 'montant_impaye_clients_12m',
              label: 'Montant des créances clients irrécouvrables',
              type: 'number',
              required: true,
              unite: 'FCFA',
              definition: 'Montant impayé de + de 12 mois'
            },
            {
              id: 'nbr_employes_remunerer_h',
              label: 'Nombre d\'employés hommes rémunérés',
              type: 'number',
              required: true,
              definition: 'Nombre d\'employés rémunéré au cours de l\'année N-1(du 1er au 31 décembre)'
            },
            {
              id: 'nbr_employes_remunerer_f',
              label: 'Nombre d\'employés femmes rémunérées',
              type: 'number',
              required: true,
              definition: 'Nombre d\'employés rémunéré au cours de l\'année N-1(du 1er au 31 décembre)'
            }
          ],
          'Indicateurs de performance Projet': [
            {
              id: 'credit_rembourse',
              label: 'Montants cumulés des remboursements',
              type: 'number',
              required: true,
              unite: 'FCFA',
              definition: 'Collecte des montants de crédits remboursés par les promoteurs et les coopératives'
            },
            {
              id: 'taux_rembourssement',
              label: 'Taux de remboursement',
              type: 'number',
              required: true,
              unite: '%',
              definition: 'Calcul du taux de remboursement des crédits octroyés par institutions financières aux promoteurs et coopératives'
            }
          ]
        },
        'Semestrielle': {
          'Indicateurs d\'activités de l\'entreprise du promoteur': [
            {
              id: 'nbr_cycle_production',
              label: 'Nombre de cycles de production réalisés',
              type: 'number',
              required: true,
              definition: 'Définir le nombre de cycles de production réalisés par le promoteur au cours du semestre si applicable'
            },
            {
              id: 'nbr_clients',
              label: 'Nombre de clients',
              type: 'number',
              required: true,
              definition: 'Compter le nombre de clients fidélisés'
            },
            {
              id: 'taux_croissance',
              label: 'Taux de croissance des clients',
              type: 'number',
              required: true,
              unite: '%',
              definition: 'La différence entre le nombre de clients de l\'exercice N et celui de l\'exercice précédent ou N-1. Le résultat obtenu est ensuite divisé par le nombre de clients de N-1 avant d\'être multiplier par 100'
            },
            {
              id: 'chiffre_affaire',
              label: 'Chiffre d\'affaires',
              type: 'number',
              required: true,
              unite: 'FCFA',
              definition: 'Montant cumulé des ventes réalisées par l\'entreprise sur une période donnée'
            },
            {
              id: 'taux_croissance_ca',
              label: 'Taux de croissance du Chiffre d\'affaires',
              type: 'number',
              required: true,
              unite: '%',
              definition: '(Chiffre d\'affaires de l\'exercice N – le chiffre d\'affaire de l\'exercice N-1) X 100'
            }
          ],
          'Indicateurs de Rentabilité et de solvabilité de l\'entreprise du promoteur': [
            {
              id: 'cout_production',
              label: 'Coût de production',
              type: 'number',
              required: true,
              unite: 'FCFA',
              definition: 'Coût des matières premières + coût de la main-d\'œuvre directe + coût des frais généraux'
            },
            {
              id: 'marge_commerciale',
              label: 'Marge commerciale ou de production',
              type: 'number',
              required: true,
              unite: 'FCFA',
              definition: 'Chiffre d\'affaires - coût de production',
              isCalculated: true
            }
          ],
          'Indicateurs de trésorerie de l\'entreprise du promoteur': [
            {
              id: 'fond_roulement',
              label: 'Fonds de roulement',
              type: 'number',
              required: true,
              unite: 'FCFA',
              definition: '(capitaux propres + capitaux empruntés à moyen et long terme) – actif immobilisé',
              isCalculated: true
            },
            {
              id: 'bfr',
              label: 'Besoin en fonds de roulement',
              type: 'number',
              required: true,
              unite: 'FCFA',
              definition: 'BFR = (stocks + créances clients + créances fiscales) - (dettes fournisseurs + dettes sociales + dettes fiscales)',
              isCalculated: true
            }
          ],
          'Indicateurs Sociaux et ressources humaines de l\'entreprise du promoteur': [
            {
              id: 'nbr_employes_non_remunerer_h',
              label: 'Nombre de stagiaires/apprenants hommes',
              type: 'number',
              required: true,
              definition: 'Nombre de personnel non rémunéré au cours de l\'année N-1 (du 1er au 31 décembre)'
            },
            {
              id: 'nbr_employes_non_remunerer_f',
              label: 'Nombre de stagiaires/apprenants femmes',
              type: 'number',
              required: true,
              definition: 'Nombre de personnel non rémunéré au cours de l\'année N-1 (du 1er au 31 décembre)'
            }
          ],
          'Indicateurs de développement personnel du promoteur': [
            {
              id: 'nbr_initiatives_realises',
              label: 'Nombre d\'initiatives personnelles développées (réalisées)',
              type: 'number',
              required: true,
              definition: 'Le nombre et la nature des initiatives personnelles du promoteur ou de la coopérative grâce aux motivations du Coaching'
            },
            {
              id: 'nbr_initiatives_encours',
              label: 'Nombre d\'initiatives personnelles développées (en cours)',
              type: 'number',
              required: true,
              definition: 'Le nombre et la nature des initiatives personnelles du promoteur ou de la coopérative grâce aux motivations du Coaching'
            }
          ],
          'Indicateurs de performance Projet': [
            {
              id: 'total_autres_revenus',
              label: 'Montant des revenus hors entreprise principale',
              type: 'number',
              required: true,
              unite: 'FCFA',
              definition: 'Recenser les autres revenus du promoteur en dehors des revenus issus de son entreprise bénéficiaire de l\'appui du projet'
            }
          ]
        },
        'Annuelle': {
          'Ratios de Rentabilité et de solvabilité de l\'entreprise': [
            {
              id: 'r_n_exploitation_aimp',
              label: 'Rendement des fonds propres (ROE)',
              type: 'number',
              required: true,
              unite: '%',
              definition: 'Résultat net d\'exploitation après impôts / Moyenne des capitaux propres',
              isCalculated: true
            },
            {
              id: 'autosuffisance',
              label: 'Autosuffisance opérationnelle',
              type: 'number',
              required: true,
              definition: 'Produits d\'exploitation / (Charges financières + Charges d\'exploitation)',
              isCalculated: true
            },
            {
              id: 'marge_beneficiaire',
              label: 'Marge bénéficiaire',
              type: 'number',
              required: true,
              unite: '%',
              definition: 'Résultat net d\'exploitation / Produits d\'exploitation',
              isCalculated: true
            },
            {
              id: 'ratio_charges_financieres',
              label: 'Ratio de charges financières',
              type: 'number',
              required: true,
              unite: '%',
              definition: 'Intérêts et frais financiers / dettes de financement',
              isCalculated: true
            }
          ],
          'Indicateurs de trésorerie de l\'entreprise du promoteur': [
            {
              id: 'nombres_credits',
              label: 'Nombre de crédits reçus',
              type: 'number',
              required: true,
              definition: 'Nombre de crédits reçus au cours de l\'année N-1'
            },
            {
              id: 'montant_credit',
              label: 'Montant cumulé des crédits reçus',
              type: 'number',
              required: true,
              unite: 'FCFA',
              definition: 'Montant total des crédits reçus au cours de l\'année N-1'
            }
          ],
          'Indicateurs de performance Projet': [
            {
              id: 'prop_revenu_accru_h',
              label: 'Proportion d\'hommes avec revenus accrus',
              type: 'number',
              required: true,
              unite: '%',
              definition: 'Proportion des jeunes bénéficiaires des formations, du financement et de l\'appui conseil qui ont augmenté leurs revenus annuels grâce aux microentreprises qu\'ils ont créé avec l\'assistance du projet'
            },
            {
              id: 'prop_revenu_accru_f',
              label: 'Proportion de femmes avec revenus accrus',
              type: 'number',
              required: true,
              unite: '%',
              definition: 'Proportion des jeunes bénéficiaires des formations, du financement et de l\'appui conseil qui ont augmenté leurs revenus annuels grâce aux microentreprises qu\'ils ont créé avec l\'assistance du projet'
            },
            {
              id: 'acces_financement',
              label: 'Nombre de promoteurs bénéficiaires de crédit',
              type: 'number',
              required: true,
              definition: 'Nombre de promoteurs qui ont accès à un crédit pour le financement de leurs entreprises grâce au projet'
            },
            {
              id: 'montant_credit_projet',
              label: 'Montant des crédits octroyés',
              type: 'number',
              required: true,
              unite: 'FCFA',
              definition: 'Montant total de crédit octroyé aux jeunes grâce à l\'appui du projet'
            }
          ]
        },
        'Occasionnelle': {
          'Indicateurs de performance Projet': [
            {
              id: 'nbr_formation_entrepreneuriat_h',
              label: 'Nombre d\'hommes formés en entrepreneuriat',
              type: 'number',
              required: true,
              definition: 'Nombre de jeunes qui participent aux sessions de formation en entrepreneuriat organisées dans le cadre du projet'
            },
            {
              id: 'nbr_formation_entrepreneuriat_f',
              label: 'Nombre de femmes formées en entrepreneuriat',
              type: 'number',
              required: true,
              definition: 'Nombre de jeunes qui participent aux sessions de formation en entrepreneuriat organisées dans le cadre du projet'
            },
            {
              id: 'nbr_former_technique_typeactivite',
              label: 'Nombre de jeunes formés techniquement (par type d\'activité)',
              type: 'number',
              required: true,
              definition: 'Nombre de jeunes qui participent aux sessions de formation techniques organisées dans le cadre du projet'
            },
            {
              id: 'nbr_former_technique_typebenef',
              label: 'Nombre de jeunes formés techniquement (par type de bénéficiaire)',
              type: 'number',
              required: true,
              definition: 'Nombre de jeunes qui participent aux sessions de formation techniques organisées dans le cadre du projet'
            },
            {
              id: 'nbr_bancarisation_h',
              label: 'Nombre d\'hommes bancarisés',
              type: 'number',
              required: true,
              definition: 'Nombre de promoteurs qui disposent de compte bancaires'
            },
            {
              id: 'nbr_bancarisation_f',
              label: 'Nombre de femmes bancarisées',
              type: 'number',
              required: true,
              definition: 'Nombre de promoteurs qui disposent de compte bancaires'
            },
            {
              id: 'nbr_bancarisation_individuelle',
              label: 'Nombre de bancarisations individuelles',
              type: 'number',
              required: true,
              definition: 'Nombre de promoteurs qui disposent de compte bancaires'
            },
            {
              id: 'nbr_bancarisation_cooperative',
              label: 'Nombre de bancarisations de coopératives',
              type: 'number',
              required: true,
              definition: 'Nombre de promoteurs qui disposent de compte bancaires'
            },
            {
              id: 'appreciation_ong',
              label: 'Appréciation de l\'organisation interne',
              type: 'number',
              required: true,
              unite: '/3',
              definition: '% des entreprises/coopératives qui enregistrent un score moyen de 3/3 suivant l\'appréciation de leur organisations internes, des services fournies et de leurs relations externes'
            }
          ]
        }
      };






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
        return indicateurs.filter(ind => ind.type === 'calculated');
    }

    /**
     * Récupérer tous les indicateurs de saisie (non calculés) pour une période et catégorie
     * @param periode Période concernée
     * @param categorie Catégorie concernée
     * @returns Liste des indicateurs de saisie
     */
    static getInputIndicateursByPeriodeAndCategorie(periode: PeriodeName, categorie: string): IndicateurField[] {
        const indicateurs = this.getIndicateursByPeriodeAndCategorie(periode, categorie);
        return indicateurs.filter(ind => ind.type !== 'calculated');
    }

    /**
     * Calculer tous les indicateurs dérivés pour une période et catégorie
     * @param periode Période concernée
     * @param categorie Catégorie concernée
     * @param data Données saisies
     * @returns Données complétées avec les valeurs calculées
     */
    static calculateIndicateurs(periode: PeriodeName, categorie: string, data: Record<string, any>): Record<string, any> {
        const results = { ...data };
        const calculatedIndicateurs = this.getCalculatedIndicateursByPeriodeAndCategorie(periode, categorie);

        // Plusieurs passes pour gérer les dépendances entre indicateurs calculés
        for (let pass = 0; pass < 3; pass++) {
            calculatedIndicateurs.forEach(indicateur => {
                if (indicateur.formula) {
                    const calculatedValue = this.calculateFormula(indicateur.formula, results);
                    if (calculatedValue !== null) {
                        results[indicateur.id] = calculatedValue;
                    }
                }
            });
        }

        return results;
    }

    /**
     * Calculer une formule avec les données fournies
     * @param formula Formule à calculer
     * @param data Données pour le calcul
     * @returns Résultat du calcul ou null en cas d'erreur
     */
    static calculateFormula(formula: string, data: Record<string, any>): string | null {
        // Extraire les variables de la formule
        const variables = formula.match(/[a-zA-Z_][a-zA-Z0-9_]*/g) || [];
        let calculableFormula = formula;
        let canCalculate = true;

        // Vérifier et remplacer chaque variable par sa valeur
        variables.forEach(variable => {
            const value = data[variable];
            if (value === undefined || isNaN(parseFloat(value))) {
                canCalculate = false;
                return;
            }

            // Remplacer uniquement les occurrences exactes de la variable
            const regex = new RegExp(`\\b${variable}\\b`, 'g');
            calculableFormula = calculableFormula.replace(regex, value);
        });

        // Calculer si possible
        if (canCalculate) {
            try {
                const result = Function('"use strict"; return (' + calculableFormula + ')')();
                if (typeof result === 'number' && !isNaN(result)) {
                    return result.toFixed(2);
                }
            } catch (error) {
                console.error(`Erreur de calcul: ${error}`, { formula, data, calculableFormula });
            }
        }

        return null;
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
            .filter(ind => ind.required)
            .forEach(ind => {
                if (data[ind.id] === undefined || data[ind.id] === '' || data[ind.id] === null) {
                    errors.push(`Le champ "${ind.label}" est obligatoire.`);
                }
            });

        return errors;
    }
}

export default IndicateurCalculator;
