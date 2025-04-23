import { Inertia } from '@inertiajs/inertia';
import CryptoJS from 'crypto-js';

export interface QueryParams {
  exercice_id: string;
  periode_id?: string | null;
  region?: string | null;
  province?: string | null;
  commune?: string | null;
  secteur_activite?: string | null;
  genre?: string | null;
  periodicite?: string | null;
  categorie?: string | null;
  indicateur_id?: string;
  [key: string]: any;
}

class DataService {
  /**
   * Génère un hash MD5 basé sur les données fournies
   */
  private hashData(data: any): string {
    return CryptoJS.MD5(JSON.stringify(data)).toString();
  }

  /**
   * Vérifie si les données correspondent bien au hash fourni
   */
  private verifyDataIntegrity(data: any, hash: string): boolean {
    return this.hashData(data) === hash;
  }

  /**
   * Fonction générique pour envoyer des requêtes Inertia avec gestion des erreurs
   */
  private async sendInertiaRequest(
    routeName: string,
    params: QueryParams,
    onlyProps: string[]
  ): Promise<any> {
    // Nettoyer les paramètres null ou 'all'
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) =>
        value !== null &&
        value !== undefined &&
        value !== 'all' &&
        value !== 'undefined'
      )
    );

    const secureParams = {
      ...cleanParams,
      request_hash: this.hashData(cleanParams),
    };

    try {
      const page = await Inertia.get(route(routeName), secureParams, {
        preserveState: true,
        preserveScroll: true,
        only: onlyProps,
      });
      return page.props;
    } catch (errors) {
      console.error(`Erreur lors de la récupération des données (${routeName}):`, errors);
      // Retourner un objet avec erreur plutôt que de laisser l'erreur se propager
      return {
        success: false,
        error: `Erreur lors de la récupération des données: ${errors.message || 'Erreur inconnue'}`
      };
    }
  }
/**
 * Récupère les données pour l'analyse comparative
 */
/**
 * Récupère les données pour l'analyse comparative
 */
async getComparativeData(params: QueryParams): Promise<any> {
    // Nettoyer les paramètres
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) =>
        value !== null &&
        value !== undefined &&
        value !== 'all' &&
        value !== 'undefined'
      )
    );

    // Renommer groupBy en group_by si présent
    if (cleanParams.groupBy) {
      cleanParams.group_by = cleanParams.groupBy;
      delete cleanParams.groupBy;
    }

    const secureParams = {
      ...cleanParams,
      request_hash: this.hashData(cleanParams),
    };

    try {
      const queryString = new URLSearchParams(secureParams as Record<string, string>).toString();
      const response = await fetch(`/analyse/comparative/donnees?${queryString}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erreur réponse API comparative:', response.status, errorText);
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Réponse non-JSON reçue:', await response.text());
        throw new Error('Format de réponse non valide');
      }

      const data = await response.json();

      if (data.hash && !this.verifyDataIntegrity(data.donnees, data.hash)) {
        console.warn('⚠️ Intégrité des données compromise dans getComparativeData');
      }

      return data;
    } catch (error) {
      console.error('Erreur données comparatives:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération des données comparatives',
      };
    }
  }


  /**
   * Récupère les données des indicateurs
   */
  async getIndicateursData(params: QueryParams): Promise<any> {
    return this.sendInertiaRequest('analyse.indicateurs.donnees', params, ['donnees']);
  }

  /**
   * Récupère les données pour le dashboard (moyennes, totaux, tendances, etc.)
   */
  async getDashboardData(params: QueryParams): Promise<any> {
    return this.sendInertiaRequest('analyse.dashboard.donnees', params, [
      'donnees',
      'moyennes',
      'totaux',
      'tendances',
      'variations',
      'statistiques',
    ]);
  }

  /**
   * Récupère les données de séries temporelles (avec vérification d'intégrité)
   */
  async getTimeSeriesData(params: QueryParams): Promise<any> {
    // Nettoyer les paramètres plus strictement
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) =>
        value !== null &&
        value !== undefined &&
        value !== 'all' &&
        value !== 'undefined'
      )
    );

    const secureParams = {
      ...cleanParams,
      request_hash: this.hashData(cleanParams),
    };

    try {
      // Utilisation de fetch au lieu d'Inertia pour éviter les problèmes de navigation
      const queryString = new URLSearchParams(secureParams as Record<string, string>).toString();
      const response = await fetch(`/analyse/timeseries/donnees?${queryString}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      });

      if (!response.ok) {
        // Gestion améliorée des erreurs
        const errorText = await response.text();
        console.error('Erreur réponse API:', response.status, errorText);
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Réponse non-JSON reçue:', await response.text());
        throw new Error('Format de réponse non valide');
      }

      const data = await response.json();

      if (data.hash && !this.verifyDataIntegrity(data.donnees, data.hash)) {
        console.warn('⚠️ Intégrité des données compromise dans getTimeSeriesData');
      }

      return data;
    } catch (error) {
      console.error('Erreur séries temporelles:', error);
      // Ne pas laisser l'erreur se propager
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération des données temporelles',
      };
    }
  }

  /**
   * Récupère les statistiques globales via une requête Fetch
   */
  async getStatistiquesData(params: QueryParams): Promise<any> {
    // Nettoyer les paramètres plus strictement
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) =>
        value !== null &&
        value !== undefined &&
        value !== 'all' &&
        value !== 'undefined'
      )
    );

    const secureParams = {
      ...cleanParams,
      request_hash: this.hashData(cleanParams),
    };

    try {
      const queryString = new URLSearchParams(secureParams as Record<string, string>).toString();
      // Utiliser une URL directe au lieu de route()
      const response = await fetch(`/analyse/analyse/rapport-global/donnees?${queryString}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      });

      if (!response.ok) {
        // Gestion améliorée des erreurs
        const errorText = await response.text();
        console.error('Erreur réponse API:', response.status, errorText);
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Réponse non-JSON reçue:', await response.text());
        throw new Error('Format de réponse non valide');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Erreur lors de la récupération des statistiques');
      }

      const { statistiques, meta } = data;
      if (meta?.response_hash && !this.verifyDataIntegrity(statistiques, meta.response_hash)) {
        console.warn('⚠️ Intégrité des données potentiellement compromise');
      }

      return data;
    } catch (error) {
      console.error('Erreur récupération statistiques:', error);
      // Ne pas laisser l'erreur se propager jusqu'à Inertia
      return {
        success: false,
        error: error.message || 'Une erreur est survenue lors de la récupération des données',
      };
    }
  }

  /**
   * Exporte les statistiques en format CSV
   */
  exportStatsToCsv(statistiques: any[]): string {
    const headers = [
      'Indicateur',
      'Catégorie',
      'Moyenne',
      'Minimum',
      'Maximum',
      'Tendance',
      'Variation (%)',
      'Unité',
    ];

    const rows = Object.entries(statistiques).map(([id, stat]: [string, any]) => [
      stat.nom || id,
      stat.categorie || 'N/A',
      typeof stat.moyenne === 'number' ? stat.moyenne.toLocaleString('fr-FR') : 'N/A',
      typeof stat.min === 'number' ? stat.min.toLocaleString('fr-FR') : 'N/A',
      typeof stat.max === 'number' ? stat.max.toLocaleString('fr-FR') : 'N/A',
      stat.tendance || 'stable',
      typeof stat.variation === 'number' ? stat.variation.toFixed(2) : '0.00',
      stat.unite || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row =>
        row.map(cell => (typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell)).join(',')
      ),
    ].join('\n');

    return csvContent;
  }
}

export default new DataService();
