/**
 * Définitions des types pour les indicateurs et données associées
 */

/**
 * Type pour un indicateur
 */
export interface Indicateur {
    id: number;
    libelle: string;
    categorie: string;
    description?: string;
    formule?: string;
    valeur: number | null;
    valeur_cible?: number | null;
    unite?: string;
    periode?: string;
    annee: number;
    date_calcul?: string;
    tendance?: number;  // -1: baisse, 0: stable, 1: hausse
    source?: string;
    frequence?: string;
  }

  /**
   * Type pour l'historique d'un indicateur
   */
  export interface IndicateurHistorique {
    id: number;
    indicateur_id: number;
    entreprise_id: number;
    valeur: number;
    periode: string;
    annee: number;
    date_calcul: string;
  }

  /**
   * Type pour l'évolution d'un indicateur (avec tendance)
   */
  export interface IndicateurEvolution {
    id: number;
    libelle: string;
    historique: {
      periode: string;
      annee: number;
      valeur: number;
      valeur_cible?: number;
      tendance: number;
    }[];
  }

  /**
   * Type pour les calculs d'analyse
   */
  export interface IndicateurAnalyse {
    moyenne: number;
    median: number;
    min: number;
    max: number;
    trend: 'up' | 'down' | 'stable';
    percentChange?: number;
    forecastNextPeriod?: number;
  }

  /**
   * Type pour les filtres d'indicateurs
   */
  export interface IndicateurFilters {
    categorie?: string;
    periode?: string;
    annee?: number;
    entreprise_id?: number;
  }

  /**
   * Type pour les données d'export
   */
  export interface IndicateurExportData {
    indicateurs: Indicateur[];
    filters: IndicateurFilters;
    metadata: {
      generated: string;
      user: string;
      entreprise: string;
    };
  }

  /**
   * Type pour les paramètres de formule de calcul
   */
  export interface FormuleCalculParameters {
    id: number;
    libelle: string;
    formule: string;
    dependances: number[];
    defaultValue?: number;
  }

  /**
   * Type pour les résultats de calcul d'indicateurs
   */
  export interface IndicateurCalculResult {
    success: boolean;
    indicateurs: Indicateur[];
    errors?: string[];
    warnings?: string[];
    nonCalculated?: number[];
  }
