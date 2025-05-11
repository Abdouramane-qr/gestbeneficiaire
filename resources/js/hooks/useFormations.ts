// // resources/js/hooks/useFormations.ts
// import { useState, useEffect } from 'react';
// import axios from 'axios';

// export interface Formation {
//   id: number;
//   type: 'technique' | 'entrepreneuriat';
//   libelle: string;
//   actif: boolean;
//   ordre: number;
//   created_at: string;
//   updated_at: string;
// }

// export function useFormations(type: 'technique' | 'entrepreneuriat') {
//   const [formations, setFormations] = useState<Formation[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   const loadFormations = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get<Formation[]>(`/formations/type/${type}`);
//       setFormations(response.data);
//       setError(null);
//     } catch (err) {
//       console.error('Erreur lors du chargement des formations:', err);
//       setError('Impossible de charger les formations. Veuillez réessayer.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addFormation = async (libelle: string): Promise<Formation | null> => {
//     try {
//       const response = await axios.post<Formation>('/formations', {
//         type,
//         libelle: libelle.trim()
//       });

//       // Mise à jour immédiate du state avec la nouvelle formation
//       setFormations(prev => [...prev, response.data].sort((a, b) => a.libelle.localeCompare(b.libelle)));
//       return response.data;
//     } catch (err: any) {
//       if (err.response?.data?.message) {
//         setError(err.response.data.message);
//       } else {
//         setError('Erreur lors de l\'ajout de la formation');
//       }
//       console.error('Erreur lors de l\'ajout de la formation:', err);
//       return null;
//     }
//   };

//   const updateFormation = async (id: number, libelle: string): Promise<Formation | null> => {
//     try {
//       const response = await axios.put<Formation>(`/formations/${id}`, {
//         libelle: libelle.trim()
//       });

//       // Mise à jour immédiate du state
//       setFormations(prev =>
//         prev.map(item => item.id === id ? response.data : item)
//           .sort((a, b) => a.libelle.localeCompare(b.libelle))
//       );
//       return response.data;
//     } catch (err: any) {
//       if (err.response?.data?.message) {
//         setError(err.response.data.message);
//       } else {
//         setError('Erreur lors de la mise à jour de la formation');
//       }
//       console.error('Erreur lors de la mise à jour de la formation:', err);
//       return null;
//     }
//   };

//   const deleteFormation = async (id: number): Promise<boolean> => {
//     try {
//       await axios.delete(`/formations/${id}`);
//       // Mise à jour immédiate du state en supprimant la formation
//       setFormations(prev => prev.filter(item => item.id !== id));
//       return true;
//     } catch (err) {
//       setError('Erreur lors de la suppression de la formation');
//       console.error('Erreur lors de la suppression de la formation:', err);
//       return false;
//     }
//   };

//   // Charger les formations au montage du composant
//   useEffect(() => {
//     loadFormations();
//   }, [type]);

//   return {
//     formations,
//     loading,
//     error,
//     addFormation,
//     updateFormation,
//     deleteFormation,
//     reload: loadFormations,
//     clearError: () => setError(null)
//   };
// }

// resources/js/hooks/useFormations.ts
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNetworkStatus } from './useNetworkStatus'; // À créer ou utiliser si existant

export interface Formation {
  id: number;
  type: 'technique' | 'entrepreneuriat';
  libelle: string;
  actif: boolean;
  ordre: number;
  created_at: string;
  updated_at: string;
  // Propriétés pour le suivi offline
  temp_id?: string;
  pending_operation?: 'create' | 'update' | 'delete';
  offline_created?: boolean;
}

interface OfflinePendingOperation {
  id: string;
  operation: 'create' | 'update' | 'delete';
  data: Formation;
  timestamp: number;
}

export function useFormations(type: 'technique' | 'entrepreneuriat') {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingOperations, setPendingOperations] = useState<OfflinePendingOperation[]>([]);

  // Utiliser un hook personnalisé pour surveiller l'état de la connexion
  const { isOnline } = useNetworkStatus();

  // Clés localStorage pour stocker les données en mode hors ligne
  const FORMATIONS_STORAGE_KEY = `formations_${type}`;
  const PENDING_OPS_STORAGE_KEY = `formations_pending_ops_${type}`;

  // Générer un ID temporaire pour les opérations hors ligne
  const generateTempId = () => `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Charger les formations depuis le serveur OU le stockage local
  const loadFormations = async () => {
    try {
      setLoading(true);

      if (isOnline) {
        // Mode en ligne - charger depuis le serveur
        const response = await axios.get<Formation[]>(`/formations/type/${type}`);

        // Fusionner avec les formations créées hors ligne qui n'ont pas encore été synchronisées
        const mergedFormations = mergeWithOfflineData(response.data);
        setFormations(mergedFormations);

        // Stocker dans localStorage pour un accès hors ligne ultérieur
        localStorage.setItem(FORMATIONS_STORAGE_KEY, JSON.stringify(mergedFormations));

        // Si nous sommes en ligne, tenter de synchroniser les opérations en attente
        synchronizePendingOperations();
      } else {
        // Mode hors ligne - charger depuis localStorage
        const storedFormations = localStorage.getItem(FORMATIONS_STORAGE_KEY);

        if (storedFormations) {
          setFormations(JSON.parse(storedFormations));
        } else {
          setError('Impossible de charger les formations. Aucune donnée en cache et vous êtes hors ligne.');
        }

        // Charger les opérations en attente
        const storedPendingOps = localStorage.getItem(PENDING_OPS_STORAGE_KEY);
        if (storedPendingOps) {
          setPendingOperations(JSON.parse(storedPendingOps));
        }
      }

    } catch (err) {
      console.error('Erreur lors du chargement des formations:', err);
      setError('Impossible de charger les formations. Veuillez réessayer.');

      // En cas d'erreur, essayer de charger depuis le cache
      const storedFormations = localStorage.getItem(FORMATIONS_STORAGE_KEY);
      if (storedFormations) {
        setFormations(JSON.parse(storedFormations));
      }
    } finally {
      setLoading(false);
    }
  };

  // Fusionner les données du serveur avec celles en mode hors ligne
  const mergeWithOfflineData = (serverFormations: Formation[]): Formation[] => {
    // Récupérer les opérations en attente
    const storedPendingOps = localStorage.getItem(PENDING_OPS_STORAGE_KEY);
    if (!storedPendingOps) return serverFormations;

    const pendingOps: OfflinePendingOperation[] = JSON.parse(storedPendingOps);
    let result = [...serverFormations];

    // Appliquer chaque opération en attente
    pendingOps.forEach(op => {
      if (op.operation === 'create') {
        // Ajouter les formations créées en mode hors ligne
        if (!result.some(f => f.libelle === op.data.libelle && f.type === type)) {
          result.push({
            ...op.data,
            pending_operation: 'create',
            offline_created: true
          });
        }
      } else if (op.operation === 'update') {
        // Appliquer les mises à jour
        const existingIndex = result.findIndex(f => f.id === op.data.id);
        if (existingIndex >= 0) {
          result[existingIndex] = {
            ...result[existingIndex],
            ...op.data,
            pending_operation: 'update'
          };
        }
      } else if (op.operation === 'delete') {
        // Supprimer les formations marquées pour suppression
        result = result.filter(f => f.id !== op.data.id);
      }
    });

    return result.sort((a, b) => a.libelle.localeCompare(b.libelle));
  };

  // Synchroniser les opérations en attente lorsque la connexion est rétablie
  const synchronizePendingOperations = async () => {
    if (!isOnline) return;

    const storedPendingOps = localStorage.getItem(PENDING_OPS_STORAGE_KEY);
    if (!storedPendingOps) return;

    const pendingOps: OfflinePendingOperation[] = JSON.parse(storedPendingOps);
    if (pendingOps.length === 0) return;

    // Copier les opérations pour pouvoir les modifier pendant le traitement
    const ops = [...pendingOps];
    const newPendingOps: OfflinePendingOperation[] = [];
    let needsRefresh = false;

    // Traiter chaque opération en attente
    for (const op of ops) {
      try {
        if (op.operation === 'create') {
          // Créer la formation sur le serveur
          await axios.post('/formations', {
            type,
            libelle: op.data.libelle.trim()
          });
        } else if (op.operation === 'update') {
          // Mettre à jour la formation sur le serveur
          await axios.put(`/formations/${op.data.id}`, {
            libelle: op.data.libelle.trim()
          });
        } else if (op.operation === 'delete') {
          // Supprimer la formation sur le serveur
          await axios.delete(`/formations/${op.data.id}`);
        }

        // Si l'opération réussit, ne pas la conserver dans les opérations en attente
        needsRefresh = true;
      } catch (err) {
        console.error(`Erreur lors de la synchronisation de l'opération ${op.operation}:`, err);
        // En cas d'erreur, conserver l'opération pour une tentative ultérieure
        newPendingOps.push(op);
      }
    }

    // Mettre à jour les opérations en attente
    setPendingOperations(newPendingOps);
    localStorage.setItem(PENDING_OPS_STORAGE_KEY, JSON.stringify(newPendingOps));

    // Si des opérations ont réussi, recharger les formations
    if (needsRefresh) {
      try {
        const response = await axios.get<Formation[]>(`/formations/type/${type}`);
        setFormations(response.data);
        localStorage.setItem(FORMATIONS_STORAGE_KEY, JSON.stringify(response.data));
      } catch (err) {
        console.error('Erreur lors du rechargement des formations après synchronisation:', err);
      }
    }
  };

  // Ajouter une formation (en ligne ou hors ligne)
  const addFormation = async (libelle: string): Promise<Formation | null> => {
    try {
      if (isOnline) {
        // Mode en ligne - ajouter sur le serveur
        const response = await axios.post<Formation>('/formations', {
          type,
          libelle: libelle.trim()
        });

        // Mise à jour immédiate du state
        setFormations(prev =>
          [...prev, response.data].sort((a, b) => a.libelle.localeCompare(b.libelle))
        );

        // Mettre à jour le cache local
        localStorage.setItem(FORMATIONS_STORAGE_KEY, JSON.stringify(formations));

        return response.data;
      } else {
        // Mode hors ligne - stocker localement
        const tempId = generateTempId();
        const newFormation: Formation = {
          id: -1,  // ID temporaire négatif
          temp_id: tempId,
          type,
          libelle: libelle.trim(),
          actif: true,
          ordre: Math.max(0, ...formations.map(f => f.ordre)) + 10,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          pending_operation: 'create',
          offline_created: true
        };

        // Ajouter à la liste des formations
        setFormations(prev =>
          [...prev, newFormation].sort((a, b) => a.libelle.localeCompare(b.libelle))
        );

        // Ajouter aux opérations en attente
        const newPendingOp: OfflinePendingOperation = {
          id: tempId,
          operation: 'create',
          data: newFormation,
          timestamp: Date.now()
        };

        const updatedPendingOps = [...pendingOperations, newPendingOp];
        setPendingOperations(updatedPendingOps);

        // Mettre à jour le stockage local
        localStorage.setItem(FORMATIONS_STORAGE_KEY, JSON.stringify([...formations, newFormation]));
        localStorage.setItem(PENDING_OPS_STORAGE_KEY, JSON.stringify(updatedPendingOps));

        return newFormation;
      }
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Erreur lors de l\'ajout de la formation');
      }
      console.error('Erreur lors de l\'ajout de la formation:', err);
      return null;
    }
  };

  // Mettre à jour une formation (en ligne ou hors ligne)
  const updateFormation = async (id: number, libelle: string): Promise<Formation | null> => {
    try {
      // Trouver la formation dans l'état actuel
      const formationToUpdate = formations.find(f => f.id === id);
      if (!formationToUpdate) return null;

      if (isOnline && !formationToUpdate.offline_created) {
        // Mode en ligne - mettre à jour sur le serveur
        const response = await axios.put<Formation>(`/formations/${id}`, {
          libelle: libelle.trim()
        });

        // Mise à jour immédiate du state
        const updatedFormations = formations.map(item =>
          item.id === id ? response.data : item
        ).sort((a, b) => a.libelle.localeCompare(b.libelle));

        setFormations(updatedFormations);
        localStorage.setItem(FORMATIONS_STORAGE_KEY, JSON.stringify(updatedFormations));

        return response.data;
      } else {
        // Mode hors ligne ou formation créée hors ligne
        const updatedFormation: Formation = {
          ...formationToUpdate,
          libelle: libelle.trim(),
          updated_at: new Date().toISOString(),
          pending_operation: 'update'
        };

        // Mettre à jour dans la liste des formations
        const updatedFormations = formations.map(item =>
          item.id === id ? updatedFormation : item
        ).sort((a, b) => a.libelle.localeCompare(b.libelle));

        setFormations(updatedFormations);

        // Si c'est une formation créée hors ligne, mettre à jour l'opération de création
        if (formationToUpdate.offline_created) {
          const updatedPendingOps = pendingOperations.map(op => {
            if (op.operation === 'create' && op.data.temp_id === formationToUpdate.temp_id) {
              return {
                ...op,
                data: {
                  ...op.data,
                  libelle: libelle.trim()
                }
              };
            }
            return op;
          });

          setPendingOperations(updatedPendingOps);
          localStorage.setItem(PENDING_OPS_STORAGE_KEY, JSON.stringify(updatedPendingOps));
        } else {
          // Sinon, ajouter une nouvelle opération de mise à jour
          const tempId = generateTempId();
          const newPendingOp: OfflinePendingOperation = {
            id: tempId,
            operation: 'update',
            data: updatedFormation,
            timestamp: Date.now()
          };

          const updatedPendingOps = [...pendingOperations, newPendingOp];
          setPendingOperations(updatedPendingOps);
          localStorage.setItem(PENDING_OPS_STORAGE_KEY, JSON.stringify(updatedPendingOps));
        }

        // Mettre à jour le stockage local
        localStorage.setItem(FORMATIONS_STORAGE_KEY, JSON.stringify(updatedFormations));

        return updatedFormation;
      }
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Erreur lors de la mise à jour de la formation');
      }
      console.error('Erreur lors de la mise à jour de la formation:', err);
      return null;
    }
  };

  // Supprimer une formation (en ligne ou hors ligne)
  const deleteFormation = async (id: number): Promise<boolean> => {
    try {
      // Trouver la formation dans l'état actuel
      const formationToDelete = formations.find(f => f.id === id);
      if (!formationToDelete) return false;

      if (isOnline && !formationToDelete.offline_created) {
        // Mode en ligne - supprimer sur le serveur
        await axios.delete(`/formations/${id}`);

        // Mise à jour immédiate du state
        const updatedFormations = formations.filter(item => item.id !== id);
        setFormations(updatedFormations);
        localStorage.setItem(FORMATIONS_STORAGE_KEY, JSON.stringify(updatedFormations));

        return true;
      } else {
        // Mode hors ligne ou formation créée hors ligne

        // Si c'est une formation créée hors ligne, supprimer l'opération de création
        if (formationToDelete.offline_created) {
          const updatedPendingOps = pendingOperations.filter(op =>
            !(op.operation === 'create' && op.data.temp_id === formationToDelete.temp_id)
          );

          setPendingOperations(updatedPendingOps);
          localStorage.setItem(PENDING_OPS_STORAGE_KEY, JSON.stringify(updatedPendingOps));
        } else {
          // Sinon, ajouter une opération de suppression
          const tempId = generateTempId();
          const newPendingOp: OfflinePendingOperation = {
            id: tempId,
            operation: 'delete',
            data: formationToDelete,
            timestamp: Date.now()
          };

          const updatedPendingOps = [...pendingOperations, newPendingOp];
          setPendingOperations(updatedPendingOps);
          localStorage.setItem(PENDING_OPS_STORAGE_KEY, JSON.stringify(updatedPendingOps));
        }

        // Mettre à jour la liste des formations et le stockage local
        const updatedFormations = formations.filter(item => item.id !== id);
        setFormations(updatedFormations);
        localStorage.setItem(FORMATIONS_STORAGE_KEY, JSON.stringify(updatedFormations));

        return true;
      }
    } catch (err) {
      setError('Erreur lors de la suppression de la formation');
      console.error('Erreur lors de la suppression de la formation:', err);
      return false;
    }
  };

  // Observer les changements d'état de la connexion
  useEffect(() => {
    if (isOnline) {
      // Tenter de synchroniser les opérations en attente lorsque la connexion est rétablie
      synchronizePendingOperations();
    }
  }, [isOnline]);

  // Charger les formations au montage du composant
  useEffect(() => {
    loadFormations();
  }, [type]);

  return {
    formations,
    loading,
    error,
    isOnline,
    pendingOperationsCount: pendingOperations.length,
    addFormation,
    updateFormation,
    deleteFormation,
    reload: loadFormations,
    synchronize: synchronizePendingOperations,
    clearError: () => setError(null)
  };
}
