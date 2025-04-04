// resources/js/types.d.ts

declare module '@/types' {
    export interface Beneficiaire {
      id: number;
      nom: string;
      prenom: string;
      regions: string;
      provinces: string;
      communes: string;
      village?: string;
      type_beneficiaire: string;
      date_de_naissance: string;
      genre: 'Homme' | 'Femme';
      handicap: boolean;
      contact: string;
      email?: string;
      niveau_instruction: string;
      activite: string;
      domaine_activite: string;
      niveau_mise_en_oeuvre: string;
      date_inscription: string;
      statut_actuel?: string;
      ong?: {
        id: number;
        nom: string;
      };
      institutionFinanciere?: {
        id: number;
        nom: string;
      };
      entreprise?: {
        id: number;
        nom_entreprise: string;
        secteur_activite: string;
      };
      created_at: string;
      updated_at: string;
    }

    export interface Indicateur {
      id: number;
      beneficiaire_id: number;
      created_at: string;
      updated_at: string;
      [key: string]: any;
    }
  }
  export interface NavItem {
    title: string;
    href: string;
    icon?: React.ElementType; // Type pour une icône React

}

import { ReactNode } from 'react';

// Base Page Properties
export interface PageProps {
  auth?: {
    user: {
      id: number;
      name: string;
      email: string;
      [key: string]: any;
    };
  };
  errors?: Record<string, string>;
  flash?: {
    message?: string;
    success?: string;
    error?: string;
  };
}

// Rapport-specific Properties
export interface RapportProps extends PageProps {
  rapport?: {
    id: number;
    titre: string;
    description?: string;
    date?: string;
    [key: string]: any;
  };
}

// Edit Rapport Properties with Nested Errors
export interface RapportEditProps extends RapportProps {
  errors?: {
    [key: string]: string | Record<string, string>;
  };
}

// Component Props with Children
export interface LayoutProps extends PageProps {
  children: ReactNode;
  title?: string;
}

// Navigation Item Type
export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{className?: string}>;
  active?: boolean;
}

// Form Field Properties
export interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  value?: string | number;
  error?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

// Alert Component Properties
export interface AlertProps {
  variant?: 'default' | 'destructive';
  title?: string;
  description?: string;
  className?: string;
}

// Utility type to make properties optional
export type Nullable<T> = {
  [P in keyof T]?: T[P] | null
};

// Generic API Response
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: 'success' | 'error';
}
// types/index.ts
export interface NavItem {
    title: string;
    href: string;
    icon?: React.ComponentType<any>;
    children?: NavItem[]; // Ajoutez cette ligne
}
