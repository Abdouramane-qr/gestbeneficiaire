// Types pour les propriétés de page
export interface PageProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role?: string;
        };
    };
    errors: Record<string, string>;
    flash?: {
        success?: string;
        error?: string;
        warning?: string;
        info?: string;
    };
}

// Types pour les modèles
export interface Exercice {
    id: number;
    annee: number;
    date_debut: string;
    date_fin: string;
    description?: string;
    actif: boolean;
    created_at: string;
    updated_at: string;
}

export interface Periode {
    id: number;
    exercice_id: number;
    exercice?: Exercice;
    code: string;
    nom: string;
    type_periode: 'mensuel' | 'trimestriel' | 'semestriel' | 'annuel';
    numero: number;
    date_debut: string;
    date_fin: string;
    cloturee: boolean;
    created_at: string;
    updated_at: string;
}

// Interface pour les champs d'un indicateur
export interface IndicateurField {
    id: string;
    name: string;
    label: string;
    type: string;
    required: boolean;
    options?: string[];
    formula?: string;
}

// Interface pour les indicateurs
export interface Indicateur {
    id: number;
    code: string;
    nom: string;
    description?: string;
    categorie?: string;
    fields: IndicateurField[];
    type?: 'number' | 'boolean' | 'text' | 'select';
    options?: string[];
    unite?: string;
    created_at: string;
    updated_at: string;
}

// Mise à jour de l'interface Beneficiaire
export interface Beneficiaire {
    id: number;
    nom: string;
    prenom: string;
    adresse: string;
    contact: string;
    email?: string;
    type: string;
    created_at: string;
    updated_at: string;
}

// Mise à jour de l'interface Entreprise
export interface Entreprise {
    id: number;
    nom_entreprise: string;
    secteur_activite: string;
    adresse?: string;
    contact?: string;
    email?: string;
    date_creation: string;
    statut_juridique: string;
    description?: string;
    ville: string;
    pays: string;
    domaine_activite?: string;
    niveau_mise_en_oeuvre?: string;
    beneficiaire?: Beneficiaire | null;
    ongs?: ONG[] | null;
    institutionFinancieres?: InstitutionFinanciere[] | null;
    created_at: string;
    updated_at: string;
}

export interface Collecte {
    id: number;
    periode_id: number;
    periode?: Periode;
    indicateur_id: number;
    indicateur?: Indicateur;
    entreprise_id?: number;
    entreprise?: Entreprise;
    beneficiaire_id?: number;
    beneficiaire?: Beneficiaire;
    valeur: string;
    commentaire?: string;
    created_at: string;
    updated_at: string;
}

// Mise à jour de l'interface InstitutionFinanciere
export interface InstitutionFinanciere {
    id: number;
    nom: string;
    type: string;
    adresse: string;
    contact: string;
    email?: string;
    created_at: string;
    updated_at: string;
}

// Mise à jour de l'interface ONG
export interface ONG {
    id: number;
    nom: string;
    sigle?: string;
    adresse: string;
    contact: string;
    created_at: string;
    updated_at: string;
}

// Types pour la pagination
export interface PaginatedResponse<T> {
    data: T[];
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
}

// Types utilitaires pour les formulaires
export interface CollecteFormData {
    [x: string]: string | number | readonly string[] | undefined;
    periode_id: string;
    indicateur_id: string;
    entreprise_id?: string;
    beneficiaire_id?: string;
    valeur: string;
    commentaire?: string;
    dynamicFields?: Record<string, string>;
}

export type SetDataFunction = (data: Partial<CollecteFormData>) => void;

export type ErrorMap = {
    [key: string]: string | undefined;
};

export type BreadcrumbItem = {
    title: string;
    href?: string;
    disabled?: boolean;
};

// Nouvelles interfaces pour les composants Entreprise
export interface ShowProps {
    entreprise: Entreprise;
}

export interface EntreprisesPageProps extends PageProps {
    entreprises: Entreprise[];
    beneficiaires: Beneficiaire[];
    ongs: ONG[];
    institutionsFinancieres: InstitutionFinanciere[];
}

export interface EntrepriseFormModalProps {
    isOpen: boolean;
    closeModal: () => void;
    entreprise?: Entreprise;
    beneficiaires: Beneficiaire[];
    ongs: ONG[];
    institutionsFinancieres: InstitutionFinanciere[];
}

export interface EntrepriseFormData {
    nom_entreprise: string;
    secteur_activite: string;
    adresse?: string;
    contact?: string;
    email?: string;
    date_creation: string;
    statut_juridique: string;
    description?: string;
    ville: string;
    pays: string;
    domaine_activite?: string;
    niveau_mise_en_oeuvre?: string;
    beneficiaire_id?: number | null;
    ong_ids?: number[];
    institution_financiere_ids?: number[];
}



export interface SharedData {
    auth: {
        user: {
            name: string;
            email: string;
            email_verified_at: string | null;
        };
    };
}
