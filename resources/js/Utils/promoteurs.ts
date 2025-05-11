/**
 * Utilitaires pour la gestion et le formatage des dates
 */

/**
 * Formate une date en format français (DD/MM/YYYY)
 * @param dateString - Chaîne de date à formater (format ISO ou timestamp)
 * @returns Chaîne formatée ou "Non spécifié" si null/invalide
 */
export const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'Non spécifié';

    try {
        const date = new Date(dateString);

        // Vérifier que la date est valide
        if (isNaN(date.getTime())) {
            return 'Date invalide';
        }

        return new Intl.DateTimeFormat('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(date);
    } catch (error) {
        console.error('Erreur lors du formatage de la date:', error);
        return 'Erreur de format';
    }
};

/**
 * Formate une date avec l'heure (DD/MM/YYYY HH:MM)
 * @param dateString - Chaîne de date à formater
 * @returns Chaîne formatée avec heure ou "Non spécifié" si null/invalide
 */
export const formatDateWithTime = (dateString: string | null): string => {
    if (!dateString) return 'Non spécifié';

    try {
        const date = new Date(dateString);

        // Vérifier que la date est valide
        if (isNaN(date.getTime())) {
            return 'Date invalide';
        }

        return new Intl.DateTimeFormat('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    } catch (error) {
        console.error('Erreur lors du formatage de la date avec heure:', error);
        return 'Erreur de format';
    }
};

/**
 * Convertit une date au format ISO YYYY-MM-DD pour les inputs de type date
 * @param dateString - Chaîne de date à convertir
 * @returns Format YYYY-MM-DD ou chaîne vide si invalide
 */
export const formatDateForInput = (dateString: string | null): string => {
    if (!dateString) return '';

    try {
        const date = new Date(dateString);

        // Vérifier que la date est valide
        if (isNaN(date.getTime())) {
            return '';
        }

        return date.toISOString().split('T')[0];
    } catch (error) {
        console.error('Erreur lors du formatage de la date pour input:', error);
        return '';
    }
};

/**
 * Calcule l'âge d'une personne à partir de sa date de naissance
 * @param birthDateString - Date de naissance au format string
 * @returns Âge en années ou null si date invalide
 */
export const calculateAge = (birthDateString: string | null): number | null => {
    if (!birthDateString) return null;

    try {
        const birthDate = new Date(birthDateString);

        // Vérifier que la date est valide
        if (isNaN(birthDate.getTime())) {
            return null;
        }

        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();

        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    } catch (error) {
        console.error('Erreur lors du calcul de l\'âge:', error);
        return null;
    }
};

/**
 * Détermine si une date est dans le futur
 * @param dateString - Date à vérifier
 * @returns true si la date est dans le futur, false sinon
 */
export const isFutureDate = (dateString: string | null): boolean => {
    if (!dateString) return false;

    try {
        const date = new Date(dateString);
        const now = new Date();

        // Comparer uniquement les dates sans l'heure
        const dateWithoutTime = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const nowWithoutTime = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        return dateWithoutTime > nowWithoutTime;
    } catch (error) {
        console.error('Erreur lors de la vérification de date future:', error);
        return false;
    }
};
