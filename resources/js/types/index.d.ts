import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

// Types pour l'utilisateur
export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    role?: string;
  }

  // Types pour les entreprises
  export interface Entreprise {
    id: number;
    nom: string;
    forme_juridique: string;
    date_creation: string;
    secteur_activite: string;
    adresse: string;
    email: string;
    telephone: string;
    site_web?: string;
    description?: string;
    created_at?: string;
    updated_at?: string;
    rapports?: Rapport[];
    clientsPeriodePrecedente?: number; // Pour le calcul du taux de rétention
  }

  // Types pour les rapports
  export interface Rapport {
    id: number;
    entreprise_id: number;
    entreprise?: Entreprise;
    periode: string;
    annee: number;
    statut: 'brouillon' | 'soumis' | 'validé' | 'rejeté';
    date_soumission?: string;
    valide_par?: string;
    created_at?: string;
    updated_at?: string;
    indicateursFinanciers?: IndicateurFinancier;
    indicateursCommerciaux?: IndicateurCommercial;
    indicateursRH?: IndicateurRH;
    indicateursProduction?: IndicateurProduction;
  }

  // Types pour les indicateurs financiers
  export interface IndicateurFinancier {
    id?: number;
    rapport_id?: number;
    chiffre_affaires?: number;
    resultat_net?: number;
    ebitda?: number;
    marge_ebitda?: number;
    cash_flow?: number;
    dette_nette?: number;
    ratio_dette_ebitda?: number;
    fonds_propres?: number;
    ratio_endettement?: number;
    besoin_fonds_roulement?: number;
    tresorerie_nette?: number;
    investissements?: number;
    created_at?: string;
    updated_at?: string;
    [key: string]: any; // Pour l'accès dynamique aux propriétés
  }

  // Types pour les indicateurs commerciaux
  export interface IndicateurCommercial {
    id?: number;
    rapport_id?: number;
    nombre_clients?: number;
    nouveaux_clients?: number;
    taux_retention?: number;
    panier_moyen?: number;
    delai_paiement_moyen?: number;
    export_pourcentage?: number;
    top_5_clients_pourcentage?: number;
    backlog?: number;
    carnet_commandes?: number;
    created_at?: string;
    updated_at?: string;
    [key: string]: any; // Pour l'accès dynamique aux propriétés
  }

  // Types pour les indicateurs RH
  export interface IndicateurRH {
    id?: number;
    rapport_id?: number;
    effectif_total?: number;
    cadres_pourcentage?: number;
    turnover?: number;
    absenteisme?: number;
    masse_salariale?: number;
    cout_formation?: number;
    anciennete_moyenne?: number;
    accidents_travail?: number;
    index_egalite?: number;
    created_at?: string;
    updated_at?: string;
    [key: string]: any; // Pour l'accès dynamique aux propriétés
  }

  // Types pour les indicateurs de production
  export interface IndicateurProduction {
    id?: number;
    rapport_id?: number;
    taux_utilisation?: number;
    taux_rebut?: number;
    delai_production_moyen?: number;
    cout_production?: number;
    stock_matieres_premieres?: number;
    stock_produits_finis?: number;
    rotation_stocks?: number;
    incidents_qualite?: number;
    certifications?: string;
    created_at?: string;
    updated_at?: string;
    [key: string]: any; // Pour l'accès dynamique aux propriétés
  }

  // Type pour les propriétés de page communes
  export interface PageProps {
    auth: {
      user: User;
    };
    errors?: Record<string, string>;
    flash?: {
      success?: string;
      error?: string;
    };
  }

  // Type pour les données paginées
  export interface PaginatedData<T> {
    data: T[];
    links: {
      first: string | null;
      last: string | null;
      prev: string | null;
      next: string | null;
    };
    meta: {
      current_page: number;
      from: number;
      last_page: number;
      links: Array<{
        url: string | null;
        label: string;
        active: boolean;
      }>;
      path: string;
      per_page: number;
      to: number;
      total: number;
    };
  }

  // Types pour les périodes de rapports
  export type PeriodeRapport = 'Trimestriel' | 'Semestriel' | 'Annuel';

  // Types pour les statuts de rapports
  export type StatutRapport = 'brouillon' | 'soumis' | 'validé' | 'rejeté';
