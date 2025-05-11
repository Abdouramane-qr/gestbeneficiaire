
// import React, { useState, useEffect } from 'react';
// import { toast } from 'sonner';
// import { useOfflineStorage } from '@/hooks/useOfflineStorage';

// /**
//  * Higher-Order Component pour ajouter le support hors ligne à un formulaire
//  * @param {React.ComponentType} WrappedComponent - Le composant de formulaire à améliorer
//  * @returns {React.ComponentType} - Le composant amélioré avec support hors ligne
//  */
// export const withOfflineSupport = (WrappedComponent) => {
//   return function WithOfflineSupport(props) {
//     const [isOnline, setIsOnline] = useState(navigator.onLine);
//     const { saveOffline, syncData, pendingUploads, isInitialized } = useOfflineStorage();
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     // Surveiller les changements de connectivité
//     useEffect(() => {
//       const handleOnlineStatus = () => {
//         const wasOffline = !isOnline;
//         const nowOnline = navigator.onLine;

//         setIsOnline(nowOnline);

//         // Si on revient en ligne et qu'il y a des données en attente, proposer de synchroniser
//         if (wasOffline && nowOnline && pendingUploads > 0) {
//           toast.info(
//             'Vous êtes de nouveau en ligne. Voulez-vous synchroniser vos données?',
//             {
//               action: {
//                 label: 'Synchroniser',
//                 onClick: () => handleSync(),
//               },
//               duration: 8000,
//             }
//           );
//         } else if (!nowOnline) {
//           toast.warning('Vous êtes hors ligne. Les données seront sauvegardées localement.');
//         }
//       };

//       window.addEventListener('online', handleOnlineStatus);
//       window.addEventListener('offline', handleOnlineStatus);

//       return () => {
//         window.removeEventListener('online', handleOnlineStatus);
//         window.removeEventListener('offline', handleOnlineStatus);
//       };
//     }, [isOnline, pendingUploads]);

//     // Fonction pour synchroniser les données
//     const handleSync = async () => {
//       if (!isOnline) {
//         toast.error('Vous êtes hors ligne. Impossible de synchroniser.');
//         return;
//       }

//       if (!isInitialized) {
//         toast.error('Le stockage local n\'est pas encore initialisé. Veuillez patienter...');
//         return;
//       }

//       try {
//         setIsSubmitting(true);
//         toast.loading('Synchronisation en cours...');

//         const count = await syncData();

//         toast.dismiss();
//         if (count > 0) {
//           toast.success(`${count} collecte(s) synchronisée(s) avec succès`);
//         } else {
//           toast.info('Aucune donnée à synchroniser');
//         }
//       } catch (error) {
//         toast.dismiss();
//         console.error('Erreur de synchronisation:', error);
//         toast.error('Erreur lors de la synchronisation');
//       } finally {
//         setIsSubmitting(false);
//       }
//     };

//     // Fonction pour sauvegarder les données hors ligne
//     const handleOfflineSave = async (data, formType = 'standard') => {
//       try {
//         setIsSubmitting(true);

//         if (!isInitialized) {
//           toast.error('Le stockage local n\'est pas encore initialisé. Veuillez patienter...');
//           return false;
//         }

//         const {
//           beneficiaires_id,
//           entreprise_id,
//           exercice_id,
//           periode_id,
//           ...otherData
//         } = data;

//         // Déterminer l'ID de l'entreprise - soit directement fourni, soit via le bénéficiaire
//         const finalEntrepriseId = entreprise_id || beneficiaires_id;

//         if (!finalEntrepriseId) {
//           toast.error('Veuillez sélectionner une entreprise ou un promoteur');
//           return false;
//         }

//         if (!exercice_id) {
//           toast.error('Veuillez sélectionner un exercice');
//           return false;
//         }

//         // Pour les formulaires exceptionnels, periode_id peut être une chaîne spéciale
//         const finalPeriodeId = periode_id || (formType === 'exceptionnel' ? 'exceptionnel' : null);

//         if (!finalPeriodeId) {
//           toast.error('Veuillez sélectionner une période');
//           return false;
//         }

//         // Déterminer si c'est un brouillon
//         const isDraft = data.type_collecte === 'brouillon';

//         // Ajouter le type de formulaire aux données
//         const formattedData = {
//           ...otherData,
//           formType: formType // Ajouter explicitement le type de formulaire
//         };

//         console.log(`Sauvegarde offline - Entreprise: ${finalEntrepriseId}, Type: ${formType}, Période: ${finalPeriodeId}`);

//         // Sauvegarder hors ligne
//         await saveOffline(
//           finalEntrepriseId,
//           exercice_id,
//           finalPeriodeId,
//           formattedData,
//           isDraft
//         );

//         return true;
//       } catch (error) {
//         console.error('Erreur lors de la sauvegarde hors ligne:', error);
//         toast.error('Erreur lors de la sauvegarde locale');
//         return false;
//       } finally {
//         setIsSubmitting(false);
//       }
//     };

//     // Passer les props étendus au composant
//     return (
//       <WrappedComponent
//         {...props}
//         isOnline={isOnline}
//         isSubmitting={isSubmitting}
//         handleOfflineSave={handleOfflineSave}
//         handleSync={handleSync}
//         pendingUploads={pendingUploads}
//       />
//     );
//   };
// };
// resources/js/hooks/useFormations.ts
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useOfflineStorage } from '@/hooks/useOfflineStorage';

/**
 * Higher-Order Component pour ajouter le support hors ligne à un formulaire
 * @param {React.ComponentType} WrappedComponent - Le composant de formulaire à améliorer
 * @returns {React.ComponentType} - Le composant amélioré avec support hors ligne
 */
const withOfflineSupport = (WrappedComponent: React.ComponentType<any>) => {
  return function WithOfflineSupport(props: any) {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const { saveOffline, syncData, pendingUploads, isInitialized } = useOfflineStorage();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Surveiller les changements de connectivité
    useEffect(() => {
      const handleOnlineStatus = () => {
        const wasOffline = !isOnline;
        const nowOnline = navigator.onLine;

        setIsOnline(nowOnline);

        // Si on revient en ligne et qu'il y a des données en attente, proposer de synchroniser
        if (wasOffline && nowOnline && pendingUploads > 0) {
          toast.info(
            'Vous êtes de nouveau en ligne. Voulez-vous synchroniser vos données?',
            {
              action: {
                label: 'Synchroniser',
                onClick: () => handleSync(),
              },
              duration: 8000,
            }
          );
        } else if (!nowOnline) {
          toast.warning('Vous êtes hors ligne. Les données seront sauvegardées localement.');
        }
      };

      window.addEventListener('online', handleOnlineStatus);
      window.addEventListener('offline', handleOnlineStatus);

      return () => {
        window.removeEventListener('online', handleOnlineStatus);
        window.removeEventListener('offline', handleOnlineStatus);
      };
    }, [isOnline, pendingUploads]);

    // Fonction pour synchroniser les données
    const handleSync = async () => {
      if (!isOnline) {
        toast.error('Vous êtes hors ligne. Impossible de synchroniser.');
        return;
      }

      if (!isInitialized) {
        toast.error('Le stockage local n\'est pas encore initialisé. Veuillez patienter...');
        return;
      }

      try {
        setIsSubmitting(true);
        toast.loading('Synchronisation en cours...');

        const count = await syncData();

        toast.dismiss();
        if (count > 0) {
          toast.success(`${count} collecte(s) synchronisée(s) avec succès`);
        } else {
          toast.info('Aucune donnée à synchroniser');
        }
      } catch (error) {
        toast.dismiss();
        console.error('Erreur de synchronisation:', error);
        toast.error('Erreur lors de la synchronisation');
      } finally {
        setIsSubmitting(false);
      }
    };

    // Fonction pour sauvegarder les données hors ligne
    const handleOfflineSave = async (data: any, formType = 'standard') => {
      try {
        setIsSubmitting(true);

        if (!isInitialized) {
          toast.error('Le stockage local n\'est pas encore initialisé. Veuillez patienter...');
          return false;
        }

        const {
          beneficiaires_id,
          entreprise_id,
          exercice_id,
          periode_id,
          ...otherData
        } = data;

        // Déterminer l'ID de l'entreprise - soit directement fourni, soit via le bénéficiaire
        const finalEntrepriseId = entreprise_id || beneficiaires_id;

        if (!finalEntrepriseId) {
          toast.error('Veuillez sélectionner une entreprise ou un promoteur');
          return false;
        }

        if (!exercice_id) {
          toast.error('Veuillez sélectionner un exercice');
          return false;
        }

        // Pour les formulaires exceptionnels, periode_id peut être une chaîne spéciale
        const finalPeriodeId = periode_id || (formType === 'exceptionnel' ? 'exceptionnel' : null);

        if (!finalPeriodeId) {
          toast.error('Veuillez sélectionner une période');
          return false;
        }

        // Déterminer si c'est un brouillon
        const isDraft = data.type_collecte === 'brouillon';

        // Ajouter le type de formulaire aux données
        const formattedData = {
          ...otherData,
          formType: formType // Ajouter explicitement le type de formulaire
        };

        console.log(`Sauvegarde offline - Entreprise: ${finalEntrepriseId}, Type: ${formType}, Période: ${finalPeriodeId}`);

        // Sauvegarder hors ligne
        await saveOffline(
          finalEntrepriseId,
          exercice_id,
          finalPeriodeId,
          formattedData,
          isDraft
        );

        return true;
      } catch (error) {
        console.error('Erreur lors de la sauvegarde hors ligne:', error);
        toast.error('Erreur lors de la sauvegarde locale');
        return false;
      } finally {
        setIsSubmitting(false);
      }
    };

    // Passer les props étendus au composant
    return (
      <WrappedComponent
        {...props}
        isOnline={isOnline}
        isSubmitting={isSubmitting}
        handleOfflineSave={handleOfflineSave}
        handleSync={handleSync}
        pendingUploads={pendingUploads}
      />
    );
  };
};

export default withOfflineSupport;
