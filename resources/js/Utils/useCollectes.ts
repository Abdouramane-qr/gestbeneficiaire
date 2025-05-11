import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { useOfflineStorageContext } from '@/components/OfflineStorageProvider';

export const useCollectes = (initialCollectes: any[], filters = {}) => {
  const [combinedCollectes, setCombinedCollectes] = useState(initialCollectes);
  const [isLoading, setIsLoading] = useState(false);
  const {
    getAllLocalCollectes,
    isInitialized,
    syncData,
    deleteLocalCollecte,
    validateLocalCollecte,
  } = useOfflineStorageContext();

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Gérer le statut en ligne/hors ligne
  useEffect(() => {
    const handleOnlineStatus = () => {
      const online = navigator.onLine;
      setIsOnline(online);

      if (online) {
        toast.info('Connexion rétablie. Synchronisation possible.');
        syncData?.().catch(console.error);
      } else {
        toast.warning('Mode hors ligne activé. Les données seront enregistrées localement.');
      }
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, [syncData]);

  // Charger les collectes locales
  const loadLocalCollectes = async () => {
    if (!isInitialized) return;

    setIsLoading(true);
    try {
      const localData = await getAllLocalCollectes();
      const mergedCollectes = [...initialCollectes];

      localData.forEach(local => {
        if (!mergedCollectes.some(server => server.id === local.id)) {
          mergedCollectes.push({
            ...local,
            isLocal: true,
            entreprise: local.entreprise || { id: local.entreprise_id, nom_entreprise: `Entreprise #${local.entreprise_id}` }
          });
        }
      });

      // Appliquer les filtres
      const filteredCollectes = applyFilters(mergedCollectes, filters);
      setCombinedCollectes(filteredCollectes);
    } catch (error) {
      console.error('Erreur lors du chargement des collectes locales:', error);
      toast.error('Erreur lors du chargement des collectes locales');
    } finally {
      setIsLoading(false);
    }
  };

  // Appliquer les filtres aux collectes
  const applyFilters = (collectes: any[], currentFilters: any) => {
    return collectes.filter(collecte => {
      if (currentFilters.entreprise_id && collecte.entreprise_id.toString() !== currentFilters.entreprise_id.toString()) {
        return false;
      }
      if (currentFilters.exercice_id && collecte.exercice_id.toString() !== currentFilters.exercice_id.toString()) {
        return false;
      }
      if (currentFilters.periode_id && collecte.periode_id.toString() !== currentFilters.periode_id.toString()) {
        return false;
      }
      if (currentFilters.type_collecte && collecte.type_collecte !== currentFilters.type_collecte) {
        return false;
      }
      if (currentFilters.storage === 'local' && !collecte.isLocal) {
        return false;
      }
      if (currentFilters.storage === 'server' && collecte.isLocal) {
        return false;
      }
      if (currentFilters.search) {
        const searchTerm = currentFilters.search.toLowerCase();
        return (
          collecte.entreprise?.nom_entreprise?.toLowerCase().includes(searchTerm) ||
          collecte.exercice?.annee?.toString().includes(searchTerm)
        );
      }
      return true;
    });
  };

  // Actions sur les collectes
  const handleDelete = async (collecte: any) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette collecte ?')) {
      return;
    }

    if (collecte.isLocal) {
      try {
        await deleteLocalCollecte(collecte.id);
        toast.success('Collecte locale supprimée');
        loadLocalCollectes();
      } catch (error) {
        console.error('Erreur lors de la suppression locale:', error);
        toast.error('Erreur lors de la suppression de la collecte locale');
      }
    } else if (isOnline) {
      router.delete(route('collectes.destroy', collecte.id));
    } else {
      toast.error('Impossible de supprimer une collecte serveur en mode hors ligne');
    }
  };

  const handleValidate = async (collecte: any) => {
    if (!confirm('Voulez-vous valider cette collecte ?')) {
      return;
    }

    if (collecte.isLocal) {
      try {
        await validateLocalCollecte(collecte.id);
        toast.success('Collecte locale validée');
        loadLocalCollectes();
      } catch (error) {
        console.error('Erreur lors de la validation locale:', error);
        toast.error('Erreur lors de la validation de la collecte locale');
      }
    } else if (isOnline) {
      router.post(route('collectes.validate', collecte.id));
    } else {
      toast.error('Impossible de valider une collecte serveur en mode hors ligne');
    }
  };

  // Recharger les données quand nécessaire
  useEffect(() => {
    if (isInitialized) {
      loadLocalCollectes();
    }
  }, [isInitialized, initialCollectes, filters]);

  return {
    combinedCollectes,
    isLoading,
    isOnline,
    handleDelete,
    handleValidate,
    refreshData: loadLocalCollectes
  };
};
