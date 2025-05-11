// types/collecte.d.ts
export interface EntiteTabsProps {
    currentTab: string;
    entreprises: Entreprise[];
    exercices: Exercice[];
    periodes: Periode[];
    onNext: () => void;
    onPrev: () => void;
    isEditing?: boolean;
  }

  export interface IndicateurTabsProps {
    fieldsByCategory: Record<string, IndicateurField[]>;
    dynamicFields: Record<string, string>;
    onFieldChange: (fieldId: string, value: string) => void;
    onSubmit: () => void;
    onPrev: () => void;
    selectedEntreprise: { nom_entreprise: string } | null;
    selectedPeriode: { nom: string } | null;
    dateCollecte: string;
  }
  interface Entreprise {
    id: number;
    nom_entreprise: string;
  }

  interface Exercice {
    id: number;
    annee: string;
  }

  interface Periode {
    id: number;
    exercice_id: number;
    nom: string;
    date_debut: string;
    date_fin: string;
  }

  interface IndicateurField {
    id: string;
    label: string;
    type: 'number' | 'text' | 'calculated';
    required?: boolean;
    formula?: string;
    unite?: string;
    description?: string;
  }

  interface Indicateur {
    id: number;
    nom: string;
    categorie: string;
    fields: IndicateurField[];
  }

  interface CollecteExistante {
    id: number;
    entreprise_id: number;
    exercice_id: number;
    periode_id: number;
    date_collecte: string;
    donnees: Record<string, string>;
  }
