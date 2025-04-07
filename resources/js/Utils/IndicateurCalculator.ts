import { SetStateAction } from 'react';

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
}

/**
 * Type pour les catégories
 */
export type CategorieName = 'financier' | 'commercial' | 'production' | 'rh' | 'tresorerie';

/**
 * Classe utilitaire pour calculer les indicateurs dérivés
 */
export class IndicateurCalculator {
    /**
     * Définition explicite des champs d'indicateurs par catégorie
     */
    static categoriesFields: Record<CategorieName, IndicateurField[]> = {
        'financier': [
            { id: 'resultat_net', label: 'Résultat net', type: 'number', required: true, unite: 'FCFA' },
            { id: 'chiffre_affaires', label: 'Chiffre d\'affaires', type: 'number', required: true, unite: 'FCFA' },
            { id: 'total_actif', label: 'Total Actif', type: 'number', required: true, unite: 'FCFA' },
            { id: 'capitaux_propres', label: 'Capitaux propres', type: 'number', required: false, unite: 'FCFA' },
            {
                id: 'rentabilite',
                label: 'Rentabilité',
                type: 'calculated',
                formula: 'resultat_net / chiffre_affaires * 100',
                unite: '%',
                description: 'Résultat net / Chiffre d\'affaires * 100'
            },
            {
                id: 'ratio_endettement',
                label: 'Ratio d\'endettement',
                type: 'calculated',
                formula: '(total_actif - capitaux_propres) / capitaux_propres * 100',
                unite: '%',
                description: '(Total Actif - Capitaux propres) / Capitaux propres * 100'
            }
        ],
        'commercial': [
            { id: 'nb_clients', label: 'Nombre de clients', type: 'number', required: true },
            { id: 'nb_clients_grossistes', label: 'Nombre de clients grossistes', type: 'number', required: false },
            { id: 'nb_clients_detaillants', label: 'Nombre de clients détaillants', type: 'number', required: false },
            { id: 'nb_commandes', label: 'Nombre de commandes', type: 'number', required: true },
            { id: 'valeur_commandes', label: 'Valeur des commandes', type: 'number', required: true, unite: 'FCFA' },
            {
                id: 'panier_moyen',
                label: 'Panier moyen',
                type: 'calculated',
                formula: 'valeur_commandes / nb_commandes',
                unite: 'FCFA',
                description: 'Valeur des commandes / Nombre de commandes'
            },
            {
                id: 'taux_conversion',
                label: 'Taux de conversion',
                type: 'calculated',
                formula: 'nb_commandes / nb_clients * 100',
                unite: '%',
                description: 'Nombre de commandes / Nombre de clients * 100'
            }
        ],
        'production': [
            { id: 'quantite_production_totale', label: 'Quantité de production totale', type: 'number', required: true },
            { id: 'quantite_production_premiere', label: 'Quantité de production première', type: 'number', required: false },
            { id: 'heures_travaillees', label: 'Heures travaillées', type: 'number', required: true },
            { id: 'cout_production', label: 'Coût de production', type: 'number', required: true, unite: 'FCFA' },
            {
                id: 'productivite',
                label: 'Productivité',
                type: 'calculated',
                formula: 'quantite_production_totale / heures_travaillees',
                description: 'Quantité de production totale / Heures travaillées'
            },
            {
                id: 'cout_production_unitaire',
                label: 'Coût de production unitaire',
                type: 'calculated',
                formula: 'cout_production / quantite_production_totale',
                unite: 'FCFA',
                description: 'Coût de production / Quantité de production totale'
            }
        ],
        'rh': [
            { id: 'effectif', label: 'Effectif total', type: 'number', required: true },
            { id: 'effectif_moyen', label: 'Effectif moyen', type: 'number', required: false },
            { id: 'masse_salariale', label: 'Masse salariale', type: 'number', required: true, unite: 'FCFA' },
            { id: 'heures_formation', label: 'Heures de formation', type: 'number', required: false },
            {
                id: 'cout_moyen_employe',
                label: 'Coût moyen par employé',
                type: 'calculated',
                formula: 'masse_salariale / effectif',
                unite: 'FCFA',
                description: 'Masse salariale / Effectif'
            },
            {
                id: 'ratio_formation',
                label: 'Ratio de formation',
                type: 'calculated',
                formula: 'heures_formation / effectif * 100',
                unite: '%',
                description: 'Heures de formation / Effectif * 100'
            }
        ],
        'tresorerie': [
            { id: 'fonds_roulement', label: 'Fonds de roulement', type: 'number', required: true, unite: 'FCFA' },
            { id: 'besoin_fonds_roulement', label: 'Besoin en fonds de roulement', type: 'number', required: true, unite: 'FCFA' },
            { id: 'credits_clients', label: 'Créances clients', type: 'number', required: false, unite: 'FCFA' },
            { id: 'dettes_fournisseurs', label: 'Dettes fournisseurs', type: 'number', required: false, unite: 'FCFA' },
            {
                id: 'tresorerie_nette',
                label: 'Trésorerie nette',
                type: 'calculated',
                formula: 'fonds_roulement - besoin_fonds_roulement',
                unite: 'FCFA',
                description: 'Fonds de roulement - Besoin en fonds de roulement'
            },
            {
                id: 'delai_clients',
                label: 'Délai moyen de règlement clients',
                type: 'calculated',
                formula: 'credits_clients / (chiffre_affaires / 365)',
                unite: 'jours',
                description: 'Créances clients / (Chiffre d\'affaires / 365)'
            },
            {
                id: 'delai_fournisseurs',
                label: 'Délai moyen de règlement fournisseurs',
                type: 'calculated',
                formula: 'dettes_fournisseurs / (cout_production / 365)',
                unite: 'jours',
                description: 'Dettes fournisseurs / (Coût de production / 365)'
            }
        ]
    };

    /**
     * Grouper les indicateurs par catégorie
     * @param indicateurs Liste d'indicateurs
     * @returns Indicateurs regroupés par catégorie
     */
    static groupByCategory(indicateurs: any[]): Record<string, any[]> {
        const result: Record<string, any[]> = {};

        indicateurs.forEach(indicateur => {
            const categorie = indicateur.categorie || 'autre';
            if (!result[categorie]) {
                result[categorie] = [];
            }
            result[categorie].push(indicateur);
        });

        return result;
    }

    /**
     * Calculer tous les indicateurs dépendants
     * @param data Données complètes
     * @returns Données avec tous les champs calculés
     */
    static calculateAll(data: Record<string, any>): SetStateAction<Record<string, string>> {
        const result = { ...data };

        // Calculer les champs pour chaque catégorie
        Object.keys(this.categoriesFields).forEach(category => {
            if (data[category]) {
                result[category] = this.calculateDerivedFields(category as CategorieName, data[category]);
            }
        });

        // Gérer les dépendances entre catégories
        if (data.tresorerie && data.financier && data.production) {
            // Enrichir les données de trésorerie avec les données financières
            const tresorerieData = {
                ...data.tresorerie,
                chiffre_affaires: data.financier.chiffre_affaires,
                cout_production: data.production.cout_production
            };

            // Recalculer la trésorerie avec les données enrichies
            result.tresorerie = this.calculateDerivedFields('tresorerie', tresorerieData);
        }

        return result;
    }

    /**
     * Obtenir l'unité d'un champ spécifique
     * @param category Catégorie de l'indicateur
     * @param fieldId Identifiant du champ
     * @returns L'unité du champ
     */
    static getFieldUnit(category: CategorieName, fieldId: string): string {
        const categoryFields = this.categoriesFields[category] || [];
        const field = categoryFields.find(f => f.id === fieldId);
        return field?.unite || '';
    }

    /**
     * Obtenir la description d'un champ calculé
     * @param category Catégorie de l'indicateur
     * @param fieldId Identifiant du champ
     * @returns La description du champ
     */
    static getCalculatedFieldDescription(category: CategorieName, fieldId: string): string | undefined {
        const categoryFields = this.categoriesFields[category] || [];
        const field = categoryFields.find(f => f.id === fieldId && f.type === 'calculated');
        return field?.description;
    }

    /**
     * Calculer les champs dérivés pour une catégorie
     * @param category Catégorie des indicateurs
     * @param data Données existantes
     * @returns Données avec les calculs ajoutés
     */
    static calculateDerivedFields(
        category: CategorieName,
        data: Record<string, string>
    ): Record<string, string> {
        const results = { ...data };
        const categoryFields = this.categoriesFields[category] || [];

        // Plusieurs passes pour gérer les dépendances complexes
        for (let pass = 0; pass < 3; pass++) {
            categoryFields
                .filter((field: IndicateurField) => field.type === 'calculated')
                .forEach((field: IndicateurField) => {
                    if (field.formula) {
                        const calculatedValue = this.calculateFormula(field.formula, results);
                        if (calculatedValue !== null) {
                            results[field.id] = calculatedValue;
                        }
                    }
                });
        }

        return results;
    }

    /**
     * Calculer une valeur basée sur une formule
     * @param formula Formule à évaluer
     * @param data Données contenant les variables
     * @returns Valeur calculée ou null
     */
    // static calculateFormula(formula: string, data: Record<string, string>): string | null {
    //     // Extraire les variables de la formule
    //     const variables = formula.match(/[a-zA-Z_]+/g) || [];
    //     let calculableFormula = formula;
    //     let canCalculate = true;

    //     // Vérifier et remplacer chaque variable par sa valeur
    //     variables.forEach(variable => {
    //         if (!data[variable] || isNaN(parseFloat(data[variable]))) {
    //             canCalculate = false;
    //             return;
    //         }

    //         // Remplacer la variable par sa valeur numérique
    //         calculableFormula = calculableFormula.replace(
    //             new RegExp(variable, 'g'),
    //             data[variable]
    //         );
    //     });

    //     // Calculer si possible
    //     if (canCalculate) {
    //         try {
    //             // Évaluer la formule (avec précautions)
    //             const result = Function('"use strict"; return (' + calculableFormula + ')')();

    //             // Formater le résultat
    //             if (typeof result === 'number' && !isNaN(result)) {
    //                 return result.toFixed(2);
    //             }
    //         } catch (error) {
    //             console.error(`Erreur de calcul: ${error}`, { formula, data });
    //         }
    //     }

    //     return null;
    // }

    static calculateFormula(formula: string, data: Record<string, string>): string | null {
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
     * Valider les champs d'une catégorie
     * @param data Données à valider
     * @param category Catégorie à valider
     * @returns Liste des erreurs
     */
    static validateFields(data: Record<string, string>, category: CategorieName): string[] {
        const errors: string[] = [];
        const categoryFields = this.categoriesFields[category] || [];

        categoryFields
            .filter((field: IndicateurField) => field.required && field.type !== 'calculated')
            .forEach((field: IndicateurField) => {
                if (!data[field.id] || data[field.id].trim() === '') {
                    errors.push(`Le champ "${field.label}" est obligatoire`);
                }
            });

        return errors;
    }

    /**
     * Récupérer les champs d'une catégorie
     * @param category Catégorie des indicateurs
     * @returns Liste des champs
     */
    static getFieldsByCategory(category: CategorieName): IndicateurField[] {
        return this.categoriesFields[category] || [];
    }
}
