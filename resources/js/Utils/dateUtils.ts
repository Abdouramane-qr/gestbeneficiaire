export const formatDate = (dateString: string | number | Date) => {
    if (!dateString) return 'Non spécifié';

    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(date);
    } catch (e) {
      console.error('Erreur de formatage de date:', e);
      return dateString;
    }
  };
