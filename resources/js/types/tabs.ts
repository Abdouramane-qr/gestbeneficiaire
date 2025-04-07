export type TabType = 'entreprise' | 'exercice' | 'periode' | 'donnees';

export interface TabData {
  id: TabType;
  label: string;
  icon?: string;
  disabled?: boolean;
}

export const COLLECTE_TABS: TabData[] = [
  {
    id: 'entreprise',
    label: 'Entreprise',
  },
  {
    id: 'exercice',
    label: 'Exercice',
  },
  {
    id: 'periode',
    label: 'Période',
  },
  {
    id: 'donnees',
    label: 'Données',
  }
];

// Types pour les catégories d'indicateurs
export type IndicateurCategory =
  | 'financier'
  | 'commercial'
  | 'production'
  | 'rh'
  | 'tresorerie'
  | 'developpement_personnel'
  | 'performance_projet';

export interface IndicateurTabData {
  id: IndicateurCategory;
  label: string;
  description?: string;
}

export const INDICATEUR_TABS: IndicateurTabData[] = [
  {
    id: 'financier',
    label: 'Financiers',
    description: 'Indicateurs liés aux performances financières'
  },
  {
    id: 'commercial',
    label: 'Commerciaux',
    description: 'Indicateurs liés aux ventes et à la clientèle'
  },
  {
    id: 'production',
    label: 'Production',
    description: 'Indicateurs liés à la production et aux opérations'
  },
  {
    id: 'rh',
    label: 'RH',
    description: 'Indicateurs liés aux ressources humaines'
  },
  {
    id: 'tresorerie',
    label: 'Trésorerie',
    description: 'Indicateurs liés à la trésorerie et aux flux financiers'
  },
  {
    id: 'developpement_personnel',
    label: 'Développement Personnel',
    description: 'Indicateurs liés au développement des compétences'
  },
  {
    id: 'performance_projet',
    label: 'Performance Projet',
    description: 'Indicateurs liés à la performance des projets'
  }
];
