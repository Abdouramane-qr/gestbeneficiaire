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
    entreprisesParMois: EntrepriseMensuelle[];
    entreprisesParSecteur: EntrepriseParSecteur[];
    beneficiairesParRegion: RegionStats[];
    collectesStats: CollecteStats[];
    collectesParCategorie: CollecteParCategorie[];
  }
