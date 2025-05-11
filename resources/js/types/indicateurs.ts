export interface IndicateurField {
    id: string;
    label: string;
    type: 'text' | 'number' | 'calculated';
    required: boolean;
  }

  export interface Indicateur {
    id: number;
    nom: string;
    categorie: string;
    description?: string;
    fields: IndicateurField[];
  }

  // Types pour les indicateurs spécifiques

  export interface IndicateurFinancier extends Indicateur {
    categorie: 'financier';
    fields: IndicateurField[]; // Champs spécifiques aux indicateurs financiers
  }

  export interface IndicateurCommercial extends Indicateur {
    categorie: 'commercial';
    fields: IndicateurField[]; // Champs spécifiques aux indicateurs commerciaux
  }

  export interface IndicateurProduction extends Indicateur {
    categorie: 'production';
    fields: IndicateurField[]; // Champs spécifiques aux indicateurs de production
  }

  export interface IndicateurRH extends Indicateur {
    categorie: 'rh';
    fields: IndicateurField[]; // Champs spécifiques aux indicateurs RH
  }

  export interface IndicateurTresorerie extends Indicateur {
    categorie: 'tresorerie';
    fields: IndicateurField[]; // Champs spécifiques aux indicateurs de trésorerie
  }

  export interface IndicateurDeveloppementPersonnel extends Indicateur {
    categorie: 'developpement_personnel';
    fields: IndicateurField[]; // Champs spécifiques aux indicateurs de développement personnel
  }

  export interface IndicateurPerformanceProjet extends Indicateur {
    categorie: 'performance_projet';
    fields: IndicateurField[]; // Champs spécifiques aux indicateurs de performance de projet
  }

  // Type de collecte
  export interface CollecteData {
    id: number;
    entreprise_id: number;
    exercice_id: number;
    periode_id: number;
    indicateur_id: number;
    user_id?: number;
    date_collecte: string;
    type_collecte: string;
    periode: string;
    donnees: Record<string, string>;
    created_at: string;
    updated_at: string;
  }
