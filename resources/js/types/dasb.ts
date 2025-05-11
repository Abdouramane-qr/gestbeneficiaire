export interface CollecteCommerciale {
    prospects_total: number;
    clients_total: number;
    contrats_total: number;
  }

  export interface CollecteTresorerie {
    montant_impayes: number;
    employes_total: number;
  }

  export interface CollecteParCategorie {
    periode: string;
    commercial: CollecteCommerciale;
    tresorerie: CollecteTresorerie;
  }

  export interface CollecteStats {
    name: string;
    prospects: number;
    clients: number;
    contrats: number;
    employes: number;
  }

  export interface EntrepriseMensuelle {
    name: string;
    entreprises: number;
    beneficiaires: number;
  }

  export interface EntrepriseParSecteur {
    name: string;
    value: number;
  }

  export interface RegionStats {
    region: string;
    total: number;
    entreprises: number;
  }
  export interface DashboardProps {
    totalEntreprises: number;
    totalBeneficiaires: number;
    totalCollectes: number;
    entreprisesParMois: Array<{ name: string; entreprises: number; beneficiaires: number }>;
    entreprisesParSecteur: Array<{ name: string; value: number }>;
    beneficiairesParRegion: Array<{ region: string; total: number; entreprises: number }>;
    collectesStats: Array<any>; // Mettez à jour selon la structure finale
    collectesParCategorie: Array<any>; // Mettez à jour selon la structure finale
    indicatorCategories: Record<string, string[]>; // Nouveau champ
    indicatorSummary: Array<{ period: string; category: string; count: number }>; // Nouveau champ
  }
