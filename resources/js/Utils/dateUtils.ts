
export const formatDate = (dateString: string | number | Date): string => {
    if (!dateString) return 'Non spécifié';

    try {
        const date = typeof dateString === 'string' || typeof dateString === 'number'
            ? new Date(dateString)
            : dateString;

        if (isNaN(date.getTime())) {
            return 'Date invalide';
        }

        return new Intl.DateTimeFormat('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(date);
    } catch (e) {
        console.error('Erreur de formatage de date:', e);
        return String(dateString);
    }
};
