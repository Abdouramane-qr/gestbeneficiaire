export interface Periode {
    id: number;
    type_periode: string;
    exercice_id: number;
    nom?: string;
    date_debut: string;
    date_fin: string;
  }

  export interface PeriodeSelectorProps {
    entrepriseId: string;
    exerciceId: string;
    value: string;
    onChange: (periodeId: string) => void;
    className?: string;
    error?: string;
    disabled?: boolean;
    periodes?: Periode[];
    usedPeriodIds?: number[];
  }
