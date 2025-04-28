// // // // // import React, { useState, useEffect } from 'react';
// // // // // import { toast } from 'sonner';
// // // // // import { useOfflineStorage } from '@/hooks/useOfflineStorage';
// // // // // import {
// // // // //   WifiOffIcon,
// // // // //   WifiIcon,
// // // // //   RefreshCcw,
// // // // //   AlertTriangleIcon,
// // // // //   CheckCircleIcon,
// // // // //   CloudOffIcon,
// // // // //   Database,
// // // // //   Trash2Icon,
// // // // //   XCircleIcon,
// // // // //   ClockIcon
// // // // // } from 'lucide-react';

// // // // // interface OfflineManagerProps {
// // // // //   onSyncComplete?: () => void;
// // // // //   className?: string;
// // // // // }

// // // // // const OfflineManager: React.FC<OfflineManagerProps> = ({
// // // // //   onSyncComplete,
// // // // //   className = ''
// // // // // }) => {
// // // // //   const [isOnline, setIsOnline] = useState(navigator.onLine);
// // // // //   const [isOpen, setIsOpen] = useState(false);
// // // // //   const [failedItems, setFailedItems] = useState<any[]>([]);
// // // // //   const [localCollectes, setLocalCollectes] = useState<any[]>([]);
// // // // //   const [isLoading, setIsLoading] = useState(false);

// // // // //   const {
// // // // //     pendingUploads,
// // // // //     syncData,
// // // // //     isInitialized,
// // // // //     isSyncInProgress,
// // // // //     getAllLocalCollectes,
// // // // //     getFailedSyncItems,
// // // // //     retryFailedSyncItems,
// // // // //     clearSyncQueue,
// // // // //     deleteLocalCollecte
// // // // //   } = useOfflineStorage();

// // // // //   useEffect(() => {
// // // // //     const handleOnlineStatus = () => {
// // // // //       setIsOnline(navigator.onLine);
// // // // //     };

// // // // //     window.addEventListener('online', handleOnlineStatus);
// // // // //     window.addEventListener('offline', handleOnlineStatus);

// // // // //     return () => {
// // // // //       window.removeEventListener('online', handleOnlineStatus);
// // // // //       window.removeEventListener('offline', handleOnlineStatus);
// // // // //     };
// // // // //   }, []);

// // // // //   useEffect(() => {
// // // // //     if (isInitialized && isOpen) {
// // // // //       loadData();
// // // // //     }
// // // // //   }, [isInitialized, isOpen]);

// // // // //   // Dans OfflineManager.tsx, améliorez la gestion de loadData
// // // // // const loadData = async () => {
// // // // //     if (!isInitialized) {
// // // // //       console.warn('La base de données n\'est pas initialisée, impossible de charger les données');
// // // // //       return;
// // // // //     }

// // // // //     setIsLoading(true);
// // // // //     try {
// // // // //       // Ajoutez des délais entre les opérations pour éviter les conflits
// // // // //       const collectes = await getAllLocalCollectes();
// // // // //       setLocalCollectes(collectes || []);

// // // // //       // Petit délai pour éviter les opérations simultanées
// // // // //       await new Promise(resolve => setTimeout(resolve, 100));

// // // // //       const failed = await getFailedSyncItems();
// // // // //       setFailedItems(failed || []);
// // // // //     } catch (error) {
// // // // //       console.error('Erreur lors du chargement des données:', error);
// // // // //       toast.error('Erreur lors du chargement des données locales');
// // // // //     } finally {
// // // // //       setIsLoading(false);
// // // // //     }
// // // // //   };

// // // // //   const handleSync = async () => {
// // // // //     if (!isOnline) {
// // // // //       toast.error('Vous êtes hors ligne. Impossible de synchroniser.');
// // // // //       return;
// // // // //     }

// // // // //     if (!isInitialized) {
// // // // //       toast.error('La base de données n\'est pas prête. Veuillez réessayer.');
// // // // //       return;
// // // // //     }

// // // // //     try {
// // // // //       toast.loading('Synchronisation en cours...');
// // // // //       const syncResult = await syncData();
// // // // //       toast.dismiss();

// // // // //       if (syncResult > 0) {
// // // // //         toast.success(`Synchronisation réussie: ${syncResult} collecte(s) synchronisée(s)`);
// // // // //         // Attendez un moment avant de recharger les données
// // // // //         setTimeout(async () => {
// // // // //           if (onSyncComplete) {
// // // // //             onSyncComplete();
// // // // //           }
// // // // //           await loadData();
// // // // //         }, 300);
// // // // //       } else {
// // // // //         toast.info('Aucune donnée n\'a été synchronisée');
// // // // //         await loadData();
// // // // //       }
// // // // //     } catch (error) {
// // // // //       toast.dismiss();
// // // // //       console.error('Erreur lors de la synchronisation:', error);
// // // // //       toast.error('Erreur lors de la synchronisation');
// // // // //     }
// // // // //   };

// // // // //   const handleRetryFailed = async () => {
// // // // //     if (!isOnline) {
// // // // //       toast.error('Vous êtes hors ligne. Impossible de resynchroniser.');
// // // // //       return;
// // // // //     }

// // // // //     try {
// // // // //       const result = await retryFailedSyncItems();
// // // // //       if (result > 0) {
// // // // //         toast.success(`Resynchronisation réussie: ${result} collecte(s) synchronisée(s)`);
// // // // //         if (onSyncComplete) {
// // // // //           onSyncComplete();
// // // // //         }
// // // // //       } else {
// // // // //         toast.info('Aucune donnée n\'a été resynchronisée');
// // // // //       }

// // // // //       // Recharger les données après la synchronisation
// // // // //       await loadData();
// // // // //     } catch (error) {
// // // // //       console.error('Erreur lors de la resynchronisation:', error);
// // // // //       toast.error('Erreur lors de la resynchronisation');
// // // // //     }
// // // // //   };

// // // // //   const handleClearQueue = async () => {
// // // // //     if (!confirm('Êtes-vous sûr de vouloir vider la file d\'attente de synchronisation ? Cette action ne peut pas être annulée.')) {
// // // // //       return;
// // // // //     }

// // // // //     try {
// // // // //       await clearSyncQueue();
// // // // //       toast.success('File d\'attente de synchronisation vidée');

// // // // //       // Recharger les données
// // // // //       await loadData();
// // // // //     } catch (error) {
// // // // //       console.error('Erreur lors du vidage de la file:', error);
// // // // //       toast.error('Erreur lors du vidage de la file d\'attente');
// // // // //     }
// // // // //   };

// // // // //   const handleDeleteItem = async (id: number) => {
// // // // //     if (!confirm('Êtes-vous sûr de vouloir supprimer cette collecte locale ? Cette action ne peut pas être annulée.')) {
// // // // //       return;
// // // // //     }

// // // // //     try {
// // // // //       await deleteLocalCollecte(id);
// // // // //       toast.success('Collecte locale supprimée');

// // // // //       // Recharger les données
// // // // //       await loadData();
// // // // //     } catch (error) {
// // // // //       console.error('Erreur lors de la suppression:', error);
// // // // //       toast.error('Erreur lors de la suppression de la collecte');
// // // // //     }
// // // // //   };

// // // // //   const formatDate = (timestamp: number) => {
// // // // //     return new Date(timestamp).toLocaleString('fr-FR', {
// // // // //       day: '2-digit',
// // // // //       month: '2-digit',
// // // // //       year: 'numeric',
// // // // //       hour: '2-digit',
// // // // //       minute: '2-digit',
// // // // //     });
// // // // //   };

// // // // //   const formatCollecteName = (collecte: any) => {
// // // // //     const entreprise = collecte.entreprise_id;
// // // // //     const periodeId = collecte.periode_id;
// // // // //     const type = collecte.is_draft ? 'Brouillon' : 'Standard';

// // // // //     return `Collecte ${type} - Entreprise #${entreprise} - Période #${periodeId}`;
// // // // //   };

// // // // //   return (
// // // // //     <div className={`${className}`}>
// // // // //       {/* Indicateur de mode hors ligne */}
// // // // //       <div className="inline-flex items-center gap-2 rounded-lg border p-2 shadow-sm">
// // // // //         {isOnline ? (
// // // // //           <span className="flex items-center text-green-700 dark:text-green-400">
// // // // //             <WifiIcon className="mr-1 h-4 w-4" />
// // // // //             En ligne
// // // // //           </span>
// // // // //         ) : (
// // // // //           <span className="flex items-center text-yellow-700 dark:text-yellow-400">
// // // // //             <WifiOffIcon className="mr-1 h-4 w-4" />
// // // // //             Hors ligne
// // // // //           </span>
// // // // //         )}

// // // // //         {pendingUploads > 0 && (
// // // // //           <button
// // // // //             onClick={() => setIsOpen(!isOpen)}
// // // // //             className="ml-2 inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-500/30"
// // // // //           >
// // // // //             <Database className="mr-1 h-3 w-3" />
// // // // //             {pendingUploads} en attente
// // // // //           </button>
// // // // //         )}

// // // // //         {isOnline && pendingUploads > 0 && (
// // // // //           <button
// // // // //             onClick={handleSync}
// // // // //             disabled={isSyncInProgress}
// // // // //             className="ml-1 inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-600/20 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:ring-indigo-500/30 dark:hover:bg-indigo-800/40 disabled:opacity-50"
// // // // //           >
// // // // //             <RefreshCcw className={`mr-1 h-3 w-3 ${isSyncInProgress ? 'animate-spin' : ''}`} />
// // // // //             Synchroniser
// // // // //           </button>
// // // // //         )}
// // // // //       </div>

// // // // //       {/* Panel de gestion des données hors ligne */}
// // // // //       {isOpen && (
// // // // //         <div className="mt-4 rounded-lg border bg-white p-4 shadow dark:bg-gray-800 dark:border-gray-700">
// // // // //           <div className="flex justify-between items-center mb-4">
// // // // //             <h3 className="text-lg font-medium text-gray-900 dark:text-white">
// // // // //               Gestionnaire de données hors ligne
// // // // //             </h3>
// // // // //             <button
// // // // //               onClick={() => setIsOpen(false)}
// // // // //               className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300"
// // // // //             >
// // // // //               <XCircleIcon className="h-5 w-5" />
// // // // //             </button>
// // // // //           </div>

// // // // //           {isLoading ? (
// // // // //             <div className="flex justify-center py-4">
// // // // //               <ClockIcon className="h-8 w-8 animate-spin text-indigo-500" />
// // // // //             </div>
// // // // //           ) : (
// // // // //             <>
// // // // //               <div className="mb-4 rounded-md bg-blue-50 p-3 dark:bg-blue-900/30">
// // // // //                 <div className="flex">
// // // // //                   <div className="flex-shrink-0">
// // // // //                     <CloudOffIcon className="h-5 w-5 text-blue-400 dark:text-blue-300" />
// // // // //                   </div>
// // // // //                   <div className="ml-3 flex-1 md:flex md:justify-between">
// // // // //                     <p className="text-sm text-blue-700 dark:text-blue-300">
// // // // //                       {localCollectes.length} collecte(s) stockée(s) localement, dont {pendingUploads} en attente de synchronisation.
// // // // //                     </p>
// // // // //                     <div className="mt-3 flex space-x-2 md:ml-6 md:mt-0">
// // // // //                       {failedItems.length > 0 && (
// // // // //                         <button
// // // // //                           onClick={handleRetryFailed}
// // // // //                           disabled={!isOnline || isSyncInProgress}
// // // // //                           className="whitespace-nowrap rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-800 dark:text-blue-200 disabled:opacity-50"
// // // // //                         >
// // // // //                           Réessayer les échecs ({failedItems.length})
// // // // //                         </button>
// // // // //                       )}
// // // // //                       <button
// // // // //                         onClick={handleClearQueue}
// // // // //                         className="whitespace-nowrap rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-700 dark:bg-red-800 dark:text-red-200"
// // // // //                       >
// // // // //                         Vider la file
// // // // //                       </button>
// // // // //                       <button
// // // // //                         onClick={loadData}
// // // // //                         className="whitespace-nowrap rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-200"
// // // // //                       >
// // // // //                         Rafraîchir
// // // // //                       </button>
// // // // //                     </div>
// // // // //                   </div>
// // // // //                 </div>
// // // // //               </div>

// // // // //               {localCollectes.length > 0 ? (
// // // // //                 <div className="mt-4 max-h-60 overflow-y-auto rounded-md border dark:border-gray-700">
// // // // //                   <ul className="divide-y divide-gray-200 dark:divide-gray-700">
// // // // //                     {localCollectes.map((collecte) => {
// // // // //                       const isFailed = failedItems.some(item => item.collecteId === collecte.id);
// // // // //                       const isPending = !collecte.synced;

// // // // //                       return (
// // // // //                         <li key={collecte.id} className="relative flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700">
// // // // //                           <div className="min-w-0 flex-1">
// // // // //                             <div className="flex items-center">
// // // // //                               {isFailed ? (
// // // // //                                 <AlertTriangleIcon className="mr-2 h-4 w-4 text-red-500" />
// // // // //                               ) : isPending ? (
// // // // //                                 <ClockIcon className="mr-2 h-4 w-4 text-yellow-500" />
// // // // //                               ) : (
// // // // //                                 <CheckCircleIcon className="mr-2 h-4 w-4 text-green-500" />
// // // // //                               )}
// // // // //                               <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
// // // // //                                 {formatCollecteName(collecte)}
// // // // //                               </p>
// // // // //                             </div>
// // // // //                             <div className="mt-1">
// // // // //                               <p className="text-xs text-gray-500 dark:text-gray-400">
// // // // //                                 Créée le {formatDate(collecte.timestamp)}
// // // // //                               </p>
// // // // //                             </div>
// // // // //                           </div>
// // // // //                           <button
// // // // //                             onClick={() => handleDeleteItem(collecte.id)}
// // // // //                             className="ml-2 rounded-full p-1 text-gray-400 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/30 dark:hover:text-red-300"
// // // // //                           >
// // // // //                             <Trash2Icon className="h-4 w-4" />
// // // // //                           </button>
// // // // //                         </li>
// // // // //                       );
// // // // //                     })}
// // // // //                   </ul>
// // // // //                 </div>
// // // // //               ) : (
// // // // //                 <div className="mt-4 rounded-md bg-gray-50 p-4 text-center dark:bg-gray-700">
// // // // //                   <p className="text-sm text-gray-600 dark:text-gray-300">
// // // // //                     Aucune donnée locale stockée
// // // // //                   </p>
// // // // //                 </div>
// // // // //               )}
// // // // //             </>
// // // // //           )}
// // // // //         </div>
// // // // //       )}
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default OfflineManager;

// // // // // import React, { useState, useEffect } from 'react';
// // // // // import { toast } from 'sonner';
// // // // // import { useOfflineStorage } from '@/hooks/useOfflineStorage';
// // // // // import {
// // // // //   WifiOffIcon,
// // // // //   WifiIcon,
// // // // //   RefreshCcw,
// // // // //   AlertTriangleIcon,
// // // // //   CheckCircleIcon,
// // // // //   CloudOffIcon,
// // // // //   Database,
// // // // //   Trash2Icon,
// // // // //   XCircleIcon,
// // // // //   ClockIcon
// // // // // } from 'lucide-react';

// // // // // interface OfflineManagerProps {
// // // // //   onSyncComplete?: () => void;
// // // // //   className?: string;
// // // // // }

// // // // // const OfflineManager: React.FC<OfflineManagerProps> = ({
// // // // //   onSyncComplete,
// // // // //   className = ''
// // // // // }) => {
// // // // //   const [isOnline, setIsOnline] = useState(navigator.onLine);
// // // // //   const [isOpen, setIsOpen] = useState(false);
// // // // //   const [failedItems, setFailedItems] = useState<any[]>([]);
// // // // //   const [localCollectes, setLocalCollectes] = useState<any[]>([]);
// // // // //   const [isLoading, setIsLoading] = useState(false);

// // // // //   const {
// // // // //     pendingUploads,
// // // // //     syncData,
// // // // //     isInitialized,
// // // // //     isSyncInProgress,
// // // // //     getAllLocalCollectes,
// // // // //     getFailedSyncItems,
// // // // //     retryFailedSyncItems,
// // // // //     clearSyncQueue,
// // // // //     deleteLocalCollecte
// // // // //   } = useOfflineStorage();

// // // // //   // Surveillez les changements de connectivité
// // // // //   useEffect(() => {
// // // // //     const handleOnlineStatus = () => {
// // // // //       const currentlyOnline = navigator.onLine;
// // // // //       setIsOnline(currentlyOnline);

// // // // //       if (currentlyOnline !== isOnline) {
// // // // //         if (currentlyOnline) {
// // // // //           toast.info('Vous êtes de nouveau en ligne. Synchronisation possible.');
// // // // //           // Tenter de recharger les données après un court délai
// // // // //           setTimeout(() => {
// // // // //             if (isInitialized && isOpen) {
// // // // //               loadData().catch(err => console.error("Erreur lors du rechargement des données:", err));
// // // // //             }
// // // // //           }, 1000);
// // // // //         } else {
// // // // //           toast.warning('Vous êtes hors ligne. Les données seront sauvegardées localement.');
// // // // //         }
// // // // //       }
// // // // //     };

// // // // //     window.addEventListener('online', handleOnlineStatus);
// // // // //     window.addEventListener('offline', handleOnlineStatus);

// // // // //     return () => {
// // // // //       window.removeEventListener('online', handleOnlineStatus);
// // // // //       window.removeEventListener('offline', handleOnlineStatus);
// // // // //     };
// // // // //   }, [isOnline, isInitialized, isOpen]);

// // // // //   // Chargez les données quand le panneau est ouvert et que la base de données est initialisée
// // // // //   useEffect(() => {
// // // // //     if (isInitialized && isOpen) {
// // // // //       loadData();
// // // // //     }
// // // // //   }, [isInitialized, isOpen]);

// // // // //   // Fonction pour charger les données avec gestion améliorée des erreurs
// // // // //   const loadData = async () => {
// // // // //     if (!isInitialized) {
// // // // //       console.warn('La base de données n\'est pas initialisée, impossible de charger les données');
// // // // //       return;
// // // // //     }

// // // // //     setIsLoading(true);
// // // // //     try {
// // // // //       // Ajoutez un délai entre les opérations pour éviter les conflits
// // // // //       let collectes = [];
// // // // //       try {
// // // // //         collectes = await getAllLocalCollectes();
// // // // //         setLocalCollectes(collectes || []);
// // // // //       } catch (error) {
// // // // //         console.error('Erreur lors du chargement des collectes locales:', error);
// // // // //         setLocalCollectes([]);
// // // // //       }

// // // // //       // Petit délai pour éviter les opérations simultanées
// // // // //       await new Promise(resolve => setTimeout(resolve, 200));

// // // // //       let failed = [];
// // // // //       try {
// // // // //         failed = await getFailedSyncItems();
// // // // //         setFailedItems(failed || []);
// // // // //       } catch (error) {
// // // // //         console.error('Erreur lors du chargement des éléments en échec:', error);
// // // // //         setFailedItems([]);
// // // // //       }
// // // // //     } catch (error) {
// // // // //       console.error('Erreur globale lors du chargement des données:', error);
// // // // //       toast.error('Erreur lors du chargement des données locales');
// // // // //     } finally {
// // // // //       setIsLoading(false);
// // // // //     }
// // // // //   };

// // // // //   // Fonction de synchronisation améliorée avec gestion robuste des erreurs
// // // // //   const handleSync = async () => {
// // // // //     if (!isOnline) {
// // // // //       toast.error('Vous êtes hors ligne. Impossible de synchroniser.');
// // // // //       return;
// // // // //     }

// // // // //     if (!isInitialized) {
// // // // //       toast.error('La base de données n\'est pas prête. Veuillez réessayer.');
// // // // //       return;
// // // // //     }

// // // // //     // Éviter les multiples clics
// // // // //     if (isLoading || isSyncInProgress) {
// // // // //       return;
// // // // //     }

// // // // //     try {
// // // // //       setIsLoading(true);
// // // // //       toast.loading('Synchronisation en cours...');

// // // // //       const syncResult = await syncData();
// // // // //       toast.dismiss();

// // // // //       if (syncResult > 0) {
// // // // //         toast.success(`Synchronisation réussie: ${syncResult} collecte(s) synchronisée(s)`);
// // // // //         // Attendez un moment avant de recharger les données
// // // // //         setTimeout(() => {
// // // // //           if (onSyncComplete) {
// // // // //             try {
// // // // //               onSyncComplete();
// // // // //             } catch (error) {
// // // // //               console.error("Erreur lors de l'exécution de onSyncComplete:", error);
// // // // //             }
// // // // //           }

// // // // //           // Recharger les données après un délai
// // // // //           setTimeout(() => {
// // // // //             loadData().catch(err => console.error("Erreur lors du chargement des données:", err));
// // // // //           }, 500);
// // // // //         }, 500);
// // // // //       } else {
// // // // //         toast.info('Aucune donnée n\'a été synchronisée');

// // // // //         // Recharger les données après un délai
// // // // //         setTimeout(() => {
// // // // //           loadData().catch(err => console.error("Erreur lors du chargement des données:", err));
// // // // //         }, 300);
// // // // //       }
// // // // //     } catch (error) {
// // // // //       toast.dismiss();
// // // // //       console.error('Erreur lors de la synchronisation:', error);
// // // // //       toast.error('Erreur lors de la synchronisation. Veuillez réessayer.');
// // // // //     } finally {
// // // // //       setIsLoading(false);
// // // // //     }
// // // // //   };
// // // // //   // Fonction pour réessayer les synchronisations échouées
// // // // //   const handleRetryFailed = async () => {
// // // // //     if (!isOnline) {
// // // // //       toast.error('Vous êtes hors ligne. Impossible de resynchroniser.');
// // // // //       return;
// // // // //     }

// // // // //     try {
// // // // //       setIsLoading(true);
// // // // //       const result = await retryFailedSyncItems();

// // // // //       if (result > 0) {
// // // // //         toast.success(`Resynchronisation réussie: ${result} collecte(s) synchronisée(s)`);

// // // // //         // Délai avant de recharger et notifier
// // // // //         setTimeout(async () => {
// // // // //           try {
// // // // //             await loadData();
// // // // //             if (onSyncComplete) {
// // // // //               onSyncComplete();
// // // // //             }
// // // // //           } catch (error) {
// // // // //             console.error('Erreur après resynchronisation:', error);
// // // // //           }
// // // // //         }, 500);
// // // // //       } else {
// // // // //         toast.info('Aucune donnée n\'a été resynchronisée');
// // // // //         setTimeout(() => {
// // // // //           loadData().catch(err => {
// // // // //             console.error('Erreur de chargement après info:', err);
// // // // //           });
// // // // //         }, 300);
// // // // //       }
// // // // //     } catch (error) {
// // // // //       console.error('Erreur lors de la resynchronisation:', error);
// // // // //       toast.error('Erreur lors de la resynchronisation');
// // // // //     } finally {
// // // // //       setIsLoading(false);
// // // // //     }
// // // // //   };

// // // // //   // Fonction pour vider la file d'attente de synchronisation
// // // // //   const handleClearQueue = async () => {
// // // // //     if (!confirm('Êtes-vous sûr de vouloir vider la file d\'attente de synchronisation ? Cette action ne peut pas être annulée.')) {
// // // // //       return;
// // // // //     }

// // // // //     try {
// // // // //       setIsLoading(true);
// // // // //       await clearSyncQueue();
// // // // //       toast.success('File d\'attente de synchronisation vidée');

// // // // //       // Recharger les données après un court délai
// // // // //       setTimeout(() => {
// // // // //         loadData().catch(err => {
// // // // //           console.error('Erreur de chargement après vidage:', err);
// // // // //         });
// // // // //       }, 300);
// // // // //     } catch (error) {
// // // // //       console.error('Erreur lors du vidage de la file:', error);
// // // // //       toast.error('Erreur lors du vidage de la file d\'attente');
// // // // //     } finally {
// // // // //       setIsLoading(false);
// // // // //     }
// // // // //   };

// // // // //   // Fonction pour supprimer une collecte locale
// // // // //   const handleDeleteItem = async (id: number) => {
// // // // //     if (!confirm('Êtes-vous sûr de vouloir supprimer cette collecte locale ? Cette action ne peut pas être annulée.')) {
// // // // //       return;
// // // // //     }

// // // // //     try {
// // // // //       setIsLoading(true);
// // // // //       await deleteLocalCollecte(id);
// // // // //       toast.success('Collecte locale supprimée');

// // // // //       // Recharger les données après un court délai
// // // // //       setTimeout(() => {
// // // // //         loadData().catch(err => {
// // // // //           console.error('Erreur de chargement après suppression:', err);
// // // // //         });
// // // // //       }, 300);
// // // // //     } catch (error) {
// // // // //       console.error('Erreur lors de la suppression:', error);
// // // // //       toast.error('Erreur lors de la suppression de la collecte');
// // // // //     } finally {
// // // // //       setIsLoading(false);
// // // // //     }
// // // // //   };

// // // // //   // Fonction pour formater la date
// // // // //   const formatDate = (timestamp: number) => {
// // // // //     try {
// // // // //       return new Date(timestamp).toLocaleString('fr-FR', {
// // // // //         day: '2-digit',
// // // // //         month: '2-digit',
// // // // //         year: 'numeric',
// // // // //         hour: '2-digit',
// // // // //         minute: '2-digit',
// // // // //       });
// // // // //     } catch (error) {
// // // // //       console.error('Erreur de formatage de date:', error, timestamp);
// // // // //       return 'Date invalide';
// // // // //     }
// // // // //   };

// // // // //   // Fonction pour formater le nom de la collecte
// // // // //   const formatCollecteName = (collecte: any) => {
// // // // //     try {
// // // // //       const entreprise = collecte.entreprise_id || 'Inconnue';
// // // // //       const periodeId = collecte.periode_id || 'Inconnue';
// // // // //       const type = collecte.is_draft ? 'Brouillon' : 'Standard';

// // // // //       return `Collecte ${type} - Entreprise #${entreprise} - Période #${periodeId}`;
// // // // //     } catch (error) {
// // // // //       console.error('Erreur de formatage de nom:', error, collecte);
// // // // //       return 'Collecte sans nom';
// // // // //     }
// // // // //   };

// // // // //   return (
// // // // //     <div className={`${className}`}>
// // // // //       {/* Indicateur de mode hors ligne */}
// // // // //       <div className="inline-flex items-center gap-2 rounded-lg border p-2 shadow-sm">
// // // // //         {isOnline ? (
// // // // //           <span className="flex items-center text-green-700 dark:text-green-400">
// // // // //             <WifiIcon className="mr-1 h-4 w-4" />
// // // // //             En ligne
// // // // //           </span>
// // // // //         ) : (
// // // // //           <span className="flex items-center text-yellow-700 dark:text-yellow-400">
// // // // //             <WifiOffIcon className="mr-1 h-4 w-4" />
// // // // //             Hors ligne
// // // // //           </span>
// // // // //         )}

// // // // //         {typeof pendingUploads === 'number' && pendingUploads > 0 && (
// // // // //           <button
// // // // //             onClick={() => setIsOpen(!isOpen)}
// // // // //             className="ml-2 inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-500/30"
// // // // //           >
// // // // //             <Database className="mr-1 h-3 w-3" />
// // // // //             {pendingUploads} en attente
// // // // //           </button>
// // // // //         )}

// // // // //         {isOnline && typeof pendingUploads === 'number' && pendingUploads > 0 && (
// // // // //           <button
// // // // //             onClick={handleSync}
// // // // //             disabled={isSyncInProgress || isLoading}
// // // // //             className="ml-1 inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-600/20 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:ring-indigo-500/30 dark:hover:bg-indigo-800/40 disabled:opacity-50"
// // // // //           >
// // // // //             <RefreshCcw className={`mr-1 h-3 w-3 ${(isSyncInProgress || isLoading) ? 'animate-spin' : ''}`} />
// // // // //             Synchroniser
// // // // //           </button>
// // // // //         )}
// // // // //       </div>

// // // // //       {/* Panel de gestion des données hors ligne */}
// // // // //       {isOpen && (
// // // // //         <div className="mt-4 rounded-lg border bg-white p-4 shadow dark:bg-gray-800 dark:border-gray-700">
// // // // //           <div className="flex justify-between items-center mb-4">
// // // // //             <h3 className="text-lg font-medium text-gray-900 dark:text-white">
// // // // //               Gestionnaire de données hors ligne
// // // // //             </h3>
// // // // //             <button
// // // // //               onClick={() => setIsOpen(false)}
// // // // //               className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300"
// // // // //               aria-label="Fermer"
// // // // //             >
// // // // //               <XCircleIcon className="h-5 w-5" />
// // // // //             </button>
// // // // //           </div>

// // // // //           {isLoading ? (
// // // // //             <div className="flex justify-center py-4">
// // // // //               <ClockIcon className="h-8 w-8 animate-spin text-indigo-500" />
// // // // //             </div>
// // // // //           ) : (
// // // // //             <>
// // // // //               <div className="mb-4 rounded-md bg-blue-50 p-3 dark:bg-blue-900/30">
// // // // //                 <div className="flex">
// // // // //                   <div className="flex-shrink-0">
// // // // //                     <CloudOffIcon className="h-5 w-5 text-blue-400 dark:text-blue-300" />
// // // // //                   </div>
// // // // //                   <div className="ml-3 flex-1 md:flex md:justify-between">
// // // // //                     <p className="text-sm text-blue-700 dark:text-blue-300">
// // // // //                       {localCollectes.length} collecte(s) stockée(s) localement, dont {pendingUploads} en attente de synchronisation.
// // // // //                     </p>
// // // // //                     <div className="mt-3 flex flex-wrap gap-2 md:ml-6 md:mt-0">
// // // // //                       {failedItems.length > 0 && (
// // // // //                         <button
// // // // //                           onClick={handleRetryFailed}
// // // // //                           disabled={!isOnline || isSyncInProgress || isLoading}
// // // // //                           className="whitespace-nowrap rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-800 dark:text-blue-200 disabled:opacity-50"
// // // // //                         >
// // // // //                           Réessayer les échecs ({failedItems.length})
// // // // //                         </button>
// // // // //                       )}
// // // // //                       <button
// // // // //                         onClick={handleClearQueue}
// // // // //                         disabled={isLoading}
// // // // //                         className="whitespace-nowrap rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-700 dark:bg-red-800 dark:text-red-200 disabled:opacity-50"
// // // // //                       >
// // // // //                         Vider la file
// // // // //                       </button>
// // // // //                       <button
// // // // //                         onClick={loadData}
// // // // //                         disabled={isLoading}
// // // // //                         className="whitespace-nowrap rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-200 disabled:opacity-50"
// // // // //                       >
// // // // //                         Rafraîchir
// // // // //                       </button>
// // // // //                     </div>
// // // // //                   </div>
// // // // //                 </div>
// // // // //               </div>

// // // // //               {localCollectes.length > 0 ? (
// // // // //                 <div className="mt-4 max-h-60 overflow-y-auto rounded-md border dark:border-gray-700">
// // // // //                   <ul className="divide-y divide-gray-200 dark:divide-gray-700">
// // // // //                     {localCollectes.map((collecte) => {
// // // // //                       // Vérifier que les propriétés nécessaires existent
// // // // //                       if (!collecte || typeof collecte.id === 'undefined') {
// // // // //                         return null;
// // // // //                       }

// // // // //                       const isFailed = failedItems.some(item => item.collecteId === collecte.id);
// // // // //                       const isPending = !collecte.synced;

// // // // //                       return (
// // // // //                         <li key={collecte.id} className="relative flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700">
// // // // //                           <div className="min-w-0 flex-1">
// // // // //                             <div className="flex items-center">
// // // // //                               {isFailed ? (
// // // // //                                 <AlertTriangleIcon className="mr-2 h-4 w-4 text-red-500" />
// // // // //                               ) : isPending ? (
// // // // //                                 <ClockIcon className="mr-2 h-4 w-4 text-yellow-500" />
// // // // //                               ) : (
// // // // //                                 <CheckCircleIcon className="mr-2 h-4 w-4 text-green-500" />
// // // // //                               )}
// // // // //                               <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
// // // // //                                 {formatCollecteName(collecte)}
// // // // //                               </p>
// // // // //                             </div>
// // // // //                             <div className="mt-1">
// // // // //                               <p className="text-xs text-gray-500 dark:text-gray-400">
// // // // //                                 Créée le {collecte.timestamp ? formatDate(collecte.timestamp) : 'Date inconnue'}
// // // // //                               </p>
// // // // //                               {isFailed && (
// // // // //                                 <p className="mt-1 text-xs text-red-500">
// // // // //                                   Échec de synchronisation - Vérifiez la connexion
// // // // //                                 </p>
// // // // //                               )}
// // // // //                             </div>
// // // // //                           </div>
// // // // //                           <button
// // // // //                             onClick={() => handleDeleteItem(collecte.id)}
// // // // //                             disabled={isLoading}
// // // // //                             className="ml-2 rounded-full p-1 text-gray-400 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/30 dark:hover:text-red-300 disabled:opacity-50"
// // // // //                             aria-label="Supprimer cette collecte"
// // // // //                           >
// // // // //                             <Trash2Icon className="h-4 w-4" />
// // // // //                           </button>
// // // // //                         </li>
// // // // //                       );
// // // // //                     })}
// // // // //                   </ul>
// // // // //                 </div>
// // // // //               ) : (
// // // // //                 <div className="mt-4 rounded-md bg-gray-50 p-4 text-center dark:bg-gray-700">
// // // // //                   <p className="text-sm text-gray-600 dark:text-gray-300">
// // // // //                     Aucune donnée locale stockée
// // // // //                   </p>
// // // // //                 </div>
// // // // //               )}

// // // // //               {/* Instructions d'utilisation */}
// // // // //               <div className="mt-4 rounded-md bg-gray-50 p-3 dark:bg-gray-700">
// // // // //                 <div className="flex">
// // // // //                   <div className="ml-3 flex-1">
// // // // //                     <h4 className="text-sm font-medium text-gray-900 dark:text-white">
// // // // //                       Comprendre le mode hors ligne
// // // // //                     </h4>
// // // // //                     <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
// // // // //                       <p className="mb-1">
// // // // //                         • Les <span className="font-medium text-yellow-600 dark:text-yellow-400">collectes en attente</span> sont enregistrées localement et seront envoyées au serveur lorsque vous serez en ligne.
// // // // //                       </p>
// // // // //                       <p className="mb-1">
// // // // //                         • Les <span className="font-medium text-red-600 dark:text-red-400">collectes en échec</span> n'ont pas pu être synchronisées. Réessayez lorsque votre connexion sera stable.
// // // // //                       </p>
// // // // //                       <p>
// // // // //                         • Les <span className="font-medium text-green-600 dark:text-green-400">collectes synchronisées</span> sont déjà sauvegardées sur le serveur.
// // // // //                       </p>
// // // // //                     </div>
// // // // //                   </div>
// // // // //                 </div>
// // // // //               </div>
// // // // //             </>
// // // // //           )}
// // // // //         </div>
// // // // //       )}
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default OfflineManager;
// // // // import React, { useState, useEffect, useRef } from 'react';
// // // // import { toast } from 'sonner';
// // // // import { useOfflineStorage } from '@/hooks/useOfflineStorage';
// // // // import {
// // // //   WifiOffIcon,
// // // //   WifiIcon,
// // // //   RefreshCcw,
// // // //   AlertTriangleIcon,
// // // //   CheckCircleIcon,
// // // //   CloudOffIcon,
// // // //   Database,
// // // //   Trash2Icon,
// // // //   XCircleIcon,
// // // //   ClockIcon,
// // // //   InfoIcon
// // // // } from 'lucide-react';

// // // // interface OfflineManagerProps {
// // // //   onSyncComplete?: () => void;
// // // //   className?: string;
// // // // }

// // // // const OfflineManager: React.FC<OfflineManagerProps> = ({
// // // //   onSyncComplete,
// // // //   className = ''
// // // // }) => {
// // // //   const [isOnline, setIsOnline] = useState(navigator.onLine);
// // // //   const [isOpen, setIsOpen] = useState(false);
// // // //   const [failedItems, setFailedItems] = useState<any[]>([]);
// // // //   const [localCollectes, setLocalCollectes] = useState<any[]>([]);
// // // //   const [isLoading, setIsLoading] = useState(false);
// // // //   const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

// // // //   // Utilisation d'une référence pour éviter des opérations multiples
// // // //   const loadDataTimeoutRef = useRef<NodeJS.Timeout | null>(null);
// // // //   const syncInProgressRef = useRef(false);

// // // //   const {
// // // //     pendingUploads,
// // // //     syncData,
// // // //     isInitialized,
// // // //     isSyncInProgress,
// // // //     getAllLocalCollectes,
// // // //     getFailedSyncItems,
// // // //     retryFailedSyncItems,
// // // //     clearSyncQueue,
// // // //     deleteLocalCollecte
// // // //   } = useOfflineStorage();

// // // //   // Nettoyer les timeouts lorsque le composant est démonté
// // // //   useEffect(() => {
// // // //     return () => {
// // // //       if (loadDataTimeoutRef.current) {
// // // //         clearTimeout(loadDataTimeoutRef.current);
// // // //       }
// // // //     };
// // // //   }, []);
// // // // // Dans le composant OfflineManager
// // // // useEffect(() => {
// // // //     if (isInitialized && isOpen) {
// // // //       loadData();
// // // //     } else if (!isInitialized) {
// // // //       // Afficher un message ou forcer l'initialisation
// // // //       toast.warning('Initialisation du stockage local en cours...');
// // // //     }
// // // //   }, [isInitialized, isOpen]);
// // // //   // Surveiller les changements de connectivité
// // // //   useEffect(() => {
// // // //     const handleOnlineStatus = () => {
// // // //       const currentlyOnline = navigator.onLine;

// // // //       // Ne mettre à jour que si l'état a changé
// // // //       if (currentlyOnline !== isOnline) {
// // // //         setIsOnline(currentlyOnline);

// // // //         if (currentlyOnline) {
// // // //           toast.info('Vous êtes de nouveau en ligne. Synchronisation possible.');

// // // //           // Tenter de recharger les données après un court délai
// // // //           if (isInitialized && isOpen) {
// // // //             if (loadDataTimeoutRef.current) {
// // // //               clearTimeout(loadDataTimeoutRef.current);
// // // //             }

// // // //             loadDataTimeoutRef.current = setTimeout(() => {
// // // //               loadData().catch(err => console.error("Erreur lors du rechargement des données:", err));

// // // //               // Synchroniser automatiquement après être revenu en ligne
// // // //               if (pendingUploads > 0) {
// // // //                 handleSync();
// // // //               }
// // // //             }, 1500);
// // // //           }
// // // //         } else {
// // // //           toast.warning('Vous êtes hors ligne. Les données seront sauvegardées localement.');
// // // //         }
// // // //       }
// // // //     };

// // // //     window.addEventListener('online', handleOnlineStatus);
// // // //     window.addEventListener('offline', handleOnlineStatus);

// // // //     return () => {
// // // //       window.removeEventListener('online', handleOnlineStatus);
// // // //       window.removeEventListener('offline', handleOnlineStatus);
// // // //     };
// // // //   }, [isOnline, isInitialized, isOpen, pendingUploads]);

// // // //   // Charger les données quand le panneau est ouvert et que la base de données est initialisée
// // // //   useEffect(() => {
// // // //     if (isInitialized && isOpen) {
// // // //       loadData();
// // // //     }
// // // //   }, [isInitialized, isOpen]);

// // // //   // Fonction pour charger les données avec gestion améliorée des erreurs
// // // //   const loadData = async () => {
// // // //     if (!isInitialized) {
// // // //       console.warn('La base de données n\'est pas initialisée, impossible de charger les données');
// // // //       return;
// // // //     }

// // // //     // Éviter les chargements multiples simultanés
// // // //     if (isLoading) {
// // // //       return;
// // // //     }

// // // //     setIsLoading(true);

// // // //     try {
// // // //       let collectes: any[] = [];
// // // //       try {
// // // //         collectes = await getAllLocalCollectes();
// // // //         setLocalCollectes(collectes || []);
// // // //       } catch (error) {
// // // //         console.error('Erreur lors du chargement des collectes locales:', error);
// // // //         setLocalCollectes([]);
// // // //       }

// // // //       // Petit délai pour éviter les opérations simultanées sur IndexedDB
// // // //       await new Promise(resolve => setTimeout(resolve, 300));

// // // //       let failed: any[] = [];
// // // //       try {
// // // //         failed = await getFailedSyncItems();
// // // //         setFailedItems(failed || []);
// // // //       } catch (error) {
// // // //         console.error('Erreur lors du chargement des éléments en échec:', error);
// // // //         setFailedItems([]);
// // // //       }
// // // //     } catch (error) {
// // // //       console.error('Erreur globale lors du chargement des données:', error);
// // // //       toast.error('Erreur lors du chargement des données locales');
// // // //     } finally {
// // // //       setIsLoading(false);
// // // //     }
// // // //   };

// // // //   // Fonction de synchronisation améliorée avec protection contre les appels multiples
// // // //   const handleSync = async () => {
// // // //     if (!isOnline) {
// // // //       toast.error('Vous êtes hors ligne. Impossible de synchroniser.');
// // // //       return;
// // // //     }

// // // //     if (!isInitialized) {
// // // //       toast.error('La base de données n\'est pas prête. Veuillez réessayer.');
// // // //       return;
// // // //     }

// // // //     // Éviter les multiples clics
// // // //     if (isLoading || isSyncInProgress || syncInProgressRef.current) {
// // // //       return;
// // // //     }

// // // //     syncInProgressRef.current = true;

// // // //     try {
// // // //       setIsLoading(true);
// // // //       toast.loading('Synchronisation en cours...');

// // // //       const syncResult = await syncData();
// // // //       toast.dismiss();

// // // //       if (syncResult > 0) {
// // // //         toast.success(`Synchronisation réussie: ${syncResult} collecte(s) synchronisée(s)`);
// // // //         setLastSyncTime(new Date());

// // // //         // Appeler le callback de synchronisation complète
// // // //         if (onSyncComplete) {
// // // //           try {
// // // //             onSyncComplete();
// // // //           } catch (error) {
// // // //             console.error("Erreur lors de l'exécution de onSyncComplete:", error);
// // // //           }
// // // //         }

// // // //         // Recharger les données après un délai pour éviter les problèmes de transaction
// // // //         if (loadDataTimeoutRef.current) {
// // // //           clearTimeout(loadDataTimeoutRef.current);
// // // //         }

// // // //         loadDataTimeoutRef.current = setTimeout(() => {
// // // //           loadData().catch(err => console.error("Erreur lors du chargement des données après synchronisation:", err));
// // // //         }, 800);
// // // //       } else {
// // // //         toast.info('Aucune donnée n\'a été synchronisée');

// // // //         // Recharger quand même les données pour s'assurer que l'UI est à jour
// // // //         if (loadDataTimeoutRef.current) {
// // // //           clearTimeout(loadDataTimeoutRef.current);
// // // //         }

// // // //         loadDataTimeoutRef.current = setTimeout(() => {
// // // //           loadData().catch(err => console.error("Erreur lors du chargement des données:", err));
// // // //         }, 500);
// // // //       }
// // // //     } catch (error) {
// // // //       toast.dismiss();
// // // //       console.error('Erreur lors de la synchronisation:', error);
// // // //       toast.error('Erreur lors de la synchronisation. Veuillez réessayer.');
// // // //     } finally {
// // // //       setIsLoading(false);
// // // //       syncInProgressRef.current = false;
// // // //     }
// // // //   };

// // // //   // Fonction pour réessayer les synchronisations échouées
// // // //   const handleRetryFailed = async () => {
// // // //     if (!isOnline) {
// // // //       toast.error('Vous êtes hors ligne. Impossible de resynchroniser.');
// // // //       return;
// // // //     }

// // // //     // Éviter les multiples clics
// // // //     if (isLoading || isSyncInProgress || syncInProgressRef.current) {
// // // //       return;
// // // //     }

// // // //     syncInProgressRef.current = true;

// // // //     try {
// // // //       setIsLoading(true);
// // // //       toast.loading('Réessai des synchronisations échouées...');

// // // //       const result = await retryFailedSyncItems();
// // // //       toast.dismiss();

// // // //       if (result > 0) {
// // // //         toast.success(`${result} élément(s) marqué(s) pour resynchronisation`);

// // // //         // Lancer la synchronisation après avoir réinitialisé les éléments
// // // //         if (isOnline) {
// // // //           const syncResult = await syncData();

// // // //           if (syncResult > 0) {
// // // //             toast.success(`Resynchronisation réussie: ${syncResult} collecte(s) synchronisée(s)`);
// // // //             setLastSyncTime(new Date());

// // // //             // Appeler le callback de synchronisation complète
// // // //             if (onSyncComplete) {
// // // //               onSyncComplete();
// // // //             }
// // // //           } else {
// // // //             toast.info('Aucune donnée n\'a été resynchronisée');
// // // //           }
// // // //         }

// // // //         // Recharger les données après un délai
// // // //         if (loadDataTimeoutRef.current) {
// // // //           clearTimeout(loadDataTimeoutRef.current);
// // // //         }

// // // //         loadDataTimeoutRef.current = setTimeout(() => {
// // // //           loadData().catch(err => console.error("Erreur lors du chargement des données après réessai:", err));
// // // //         }, 800);
// // // //       } else {
// // // //         toast.info('Aucun élément à resynchroniser');
// // // //       }
// // // //     } catch (error) {
// // // //       toast.dismiss();
// // // //       console.error('Erreur lors de la resynchronisation:', error);
// // // //       toast.error('Erreur lors de la resynchronisation');
// // // //     } finally {
// // // //       setIsLoading(false);
// // // //       syncInProgressRef.current = false;
// // // //     }
// // // //   };

// // // //   // Fonction pour vider la file d'attente de synchronisation
// // // //   const handleClearQueue = async () => {
// // // //     if (!confirm('Êtes-vous sûr de vouloir vider la file d\'attente de synchronisation ? Cette action ne peut pas être annulée.')) {
// // // //       return;
// // // //     }

// // // //     // Éviter les multiples clics
// // // //     if (isLoading) {
// // // //       return;
// // // //     }

// // // //     try {
// // // //       setIsLoading(true);
// // // //       const result = await clearSyncQueue();

// // // //       if (result) {
// // // //         toast.success('File d\'attente de synchronisation vidée');
// // // //       } else {
// // // //         toast.error('Échec du vidage de la file d\'attente');
// // // //       }

// // // //       // Recharger les données après un court délai
// // // //       if (loadDataTimeoutRef.current) {
// // // //         clearTimeout(loadDataTimeoutRef.current);
// // // //       }

// // // //       loadDataTimeoutRef.current = setTimeout(() => {
// // // //         loadData().catch(err => {
// // // //           console.error('Erreur de chargement après vidage:', err);
// // // //         });
// // // //       }, 500);
// // // //     } catch (error) {
// // // //       console.error('Erreur lors du vidage de la file:', error);
// // // //       toast.error('Erreur lors du vidage de la file d\'attente');
// // // //     } finally {
// // // //       setIsLoading(false);
// // // //     }
// // // //   };

// // // //   // Fonction pour supprimer une collecte locale
// // // //   const handleDeleteItem = async (id: number) => {
// // // //     if (!confirm('Êtes-vous sûr de vouloir supprimer cette collecte locale ? Cette action ne peut pas être annulée.')) {
// // // //       return;
// // // //     }

// // // //     // Éviter les multiples clics
// // // //     if (isLoading) {
// // // //       return;
// // // //     }

// // // //     try {
// // // //       setIsLoading(true);
// // // //       const result = await deleteLocalCollecte(id);

// // // //       if (result) {
// // // //         toast.success('Collecte locale supprimée');

// // // //         // Mettre à jour l'interface immédiatement
// // // //         setLocalCollectes(prev => prev.filter(item => item.id !== id));
// // // //       } else {
// // // //         toast.error('Échec de la suppression de la collecte');
// // // //       }

// // // //       // Recharger les données complètes après un court délai
// // // //       if (loadDataTimeoutRef.current) {
// // // //         clearTimeout(loadDataTimeoutRef.current);
// // // //       }

// // // //       loadDataTimeoutRef.current = setTimeout(() => {
// // // //         loadData().catch(err => {
// // // //           console.error('Erreur de chargement après suppression:', err);
// // // //         });
// // // //       }, 500);
// // // //     } catch (error) {
// // // //       console.error('Erreur lors de la suppression:', error);
// // // //       toast.error('Erreur lors de la suppression de la collecte');
// // // //     } finally {
// // // //       setIsLoading(false);
// // // //     }
// // // //   };

// // // //   // Fonction pour formater la date
// // // //   const formatDate = (timestamp: number) => {
// // // //     try {
// // // //       return new Date(timestamp).toLocaleString('fr-FR', {
// // // //         day: '2-digit',
// // // //         month: '2-digit',
// // // //         year: 'numeric',
// // // //         hour: '2-digit',
// // // //         minute: '2-digit',
// // // //       });
// // // //     } catch (error) {
// // // //       console.error('Erreur de formatage de date:', error, timestamp);
// // // //       return 'Date invalide';
// // // //     }
// // // //   };

// // // //   // Fonction pour formater le nom de la collecte
// // // //   const formatCollecteName = (collecte: any) => {
// // // //     try {
// // // //       const entreprise = collecte.entreprise_id || 'Inconnue';
// // // //       const periodeId = collecte.periode_id || 'Inconnue';
// // // //       const type = collecte.is_draft ? 'Brouillon' : 'Standard';

// // // //       return `Collecte ${type} - Entreprise #${entreprise} - Période #${periodeId}`;
// // // //     } catch (error) {
// // // //       console.error('Erreur de formatage de nom:', error, collecte);
// // // //       return 'Collecte sans nom';
// // // //     }
// // // //   };

// // // //   return (
// // // //     <div className={`${className}`}>
// // // //       {/* Indicateur de mode hors ligne */}
// // // //       <div className="inline-flex items-center gap-2 rounded-lg border p-2 shadow-sm">
// // // //         {isOnline ? (
// // // //           <span className="flex items-center text-green-700 dark:text-green-400">
// // // //             <WifiIcon className="mr-1 h-4 w-4" />
// // // //             En ligne
// // // //           </span>
// // // //         ) : (
// // // //           <span className="flex items-center text-yellow-700 dark:text-yellow-400">
// // // //             <WifiOffIcon className="mr-1 h-4 w-4" />
// // // //             Hors ligne
// // // //           </span>
// // // //         )}

// // // //         {typeof pendingUploads === 'number' && pendingUploads > 0 && (
// // // //           <button
// // // //             onClick={() => setIsOpen(!isOpen)}
// // // //             className="ml-2 inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-500/30"
// // // //           >
// // // //             <Database className="mr-1 h-3 w-3" />
// // // //             {pendingUploads} en attente
// // // //           </button>
// // // //         )}

// // // //         {isOnline && typeof pendingUploads === 'number' && pendingUploads > 0 && (
// // // //           <button
// // // //             onClick={handleSync}
// // // //             disabled={isSyncInProgress || isLoading || syncInProgressRef.current}
// // // //             className="ml-1 inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-600/20 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:ring-indigo-500/30 dark:hover:bg-indigo-800/40 disabled:opacity-50"
// // // //           >
// // // //             <RefreshCcw className={`mr-1 h-3 w-3 ${(isSyncInProgress || isLoading || syncInProgressRef.current) ? 'animate-spin' : ''}`} />
// // // //             Synchroniser
// // // //           </button>
// // // //         )}

// // // //         {/* Indicateur de dernière synchronisation */}
// // // //         {lastSyncTime && (
// // // //           <span className="hidden sm:inline-flex items-center text-xs text-gray-500 dark:text-gray-400 ml-2">
// // // //             <ClockIcon className="mr-1 h-3 w-3" />
// // // //             Dernière sync: {lastSyncTime.toLocaleTimeString()}
// // // //           </span>
// // // //         )}
// // // //       </div>

// // // //       {/* Panel de gestion des données hors ligne */}
// // // //       {isOpen && (
// // // //         <div className="mt-4 rounded-lg border bg-white p-4 shadow dark:bg-gray-800 dark:border-gray-700">
// // // //           <div className="flex justify-between items-center mb-4">
// // // //             <h3 className="text-lg font-medium text-gray-900 dark:text-white">
// // // //               Gestionnaire de données hors ligne
// // // //             </h3>
// // // //             <button
// // // //               onClick={() => setIsOpen(false)}
// // // //               className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300"
// // // //               aria-label="Fermer"
// // // //             >
// // // //               <XCircleIcon className="h-5 w-5" />
// // // //             </button>
// // // //           </div>

// // // //           {isLoading ? (
// // // //             <div className="flex flex-col items-center justify-center py-6">
// // // // <ClockIcon className="h-10 w-10 animate-spin text-indigo-500 mb-3" />
// // // //               <p className="text-sm text-gray-600 dark:text-gray-300">
// // // //                 Chargement des données...
// // // //               </p>
// // // //             </div>
// // // //           ) : (
// // // //             <>
// // // //               <div className="mb-4 rounded-md bg-blue-50 p-3 dark:bg-blue-900/30">
// // // //                 <div className="flex">
// // // //                   <div className="flex-shrink-0">
// // // //                     <CloudOffIcon className="h-5 w-5 text-blue-400 dark:text-blue-300" />
// // // //                   </div>
// // // //                   <div className="ml-3 flex-1 md:flex md:justify-between">
// // // //                     <p className="text-sm text-blue-700 dark:text-blue-300">
// // // //                       {localCollectes.length} collecte(s) stockée(s) localement, dont {pendingUploads} en attente de synchronisation.
// // // //                     </p>
// // // //                     <div className="mt-3 flex flex-wrap gap-2 md:ml-6 md:mt-0">
// // // //                       {failedItems.length > 0 && (
// // // //                         <button
// // // //                           onClick={handleRetryFailed}
// // // //                           disabled={!isOnline || isSyncInProgress || isLoading || syncInProgressRef.current}
// // // //                           className="whitespace-nowrap rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-800 dark:text-blue-200 disabled:opacity-50"
// // // //                         >
// // // //                           Réessayer les échecs ({failedItems.length})
// // // //                         </button>
// // // //                       )}
// // // //                       <button
// // // //                         onClick={handleClearQueue}
// // // //                         disabled={isLoading || pendingUploads === 0}
// // // //                         className="whitespace-nowrap rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-700 dark:bg-red-800 dark:text-red-200 disabled:opacity-50"
// // // //                       >
// // // //                         Vider la file
// // // //                       </button>
// // // //                       <button
// // // //                         onClick={loadData}
// // // //                         disabled={isLoading}
// // // //                         className="whitespace-nowrap rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-200 disabled:opacity-50"
// // // //                       >
// // // //                         Rafraîchir
// // // //                       </button>
// // // //                     </div>
// // // //                   </div>
// // // //                 </div>
// // // //               </div>

// // // //               {localCollectes.length > 0 ? (
// // // //                 <div className="mt-4 max-h-60 overflow-y-auto rounded-md border dark:border-gray-700">
// // // //                   <ul className="divide-y divide-gray-200 dark:divide-gray-700">
// // // //                     {localCollectes.map((collecte) => {
// // // //                       // Vérifier que les propriétés nécessaires existent
// // // //                       if (!collecte || typeof collecte.id === 'undefined') {
// // // //                         return null;
// // // //                       }

// // // //                       const isFailed = failedItems.some(item => item.collecteId === collecte.id);
// // // //                       const isPending = !collecte.synced;

// // // //                       return (
// // // //                         <li key={collecte.id} className="relative flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700">
// // // //                           <div className="min-w-0 flex-1">
// // // //                             <div className="flex items-center">
// // // //                               {isFailed ? (
// // // //                                 <AlertTriangleIcon className="mr-2 h-4 w-4 text-red-500" />
// // // //                               ) : isPending ? (
// // // //                                 <ClockIcon className="mr-2 h-4 w-4 text-yellow-500" />
// // // //                               ) : (
// // // //                                 <CheckCircleIcon className="mr-2 h-4 w-4 text-green-500" />
// // // //                               )}
// // // //                               <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
// // // //                                 {formatCollecteName(collecte)}
// // // //                               </p>
// // // //                             </div>
// // // //                             <div className="mt-1">
// // // //                               <p className="text-xs text-gray-500 dark:text-gray-400">
// // // //                                 Créée le {collecte.timestamp ? formatDate(collecte.timestamp) : 'Date inconnue'}
// // // //                               </p>
// // // //                               {isFailed && (
// // // //                                 <p className="mt-1 text-xs text-red-500">
// // // //                                   Échec de synchronisation - Vérifiez la connexion
// // // //                                 </p>
// // // //                               )}
// // // //                               {isPending && !isFailed && (
// // // //                                 <p className="mt-1 text-xs text-yellow-500">
// // // //                                   En attente de synchronisation
// // // //                                 </p>
// // // //                               )}
// // // //                               {!isPending && !isFailed && collecte.syncedAt && (
// // // //                                 <p className="mt-1 text-xs text-green-500">
// // // //                                   Synchronisée le {formatDate(collecte.syncedAt)}
// // // //                                 </p>
// // // //                               )}
// // // //                             </div>
// // // //                           </div>
// // // //                           <button
// // // //                             onClick={() => handleDeleteItem(collecte.id)}
// // // //                             disabled={isLoading}
// // // //                             className="ml-2 rounded-full p-1 text-gray-400 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/30 dark:hover:text-red-300 disabled:opacity-50"
// // // //                             aria-label="Supprimer cette collecte"
// // // //                           >
// // // //                             <Trash2Icon className="h-4 w-4" />
// // // //                           </button>
// // // //                         </li>
// // // //                       );
// // // //                     })}
// // // //                   </ul>
// // // //                 </div>
// // // //               ) : (
// // // //                 <div className="mt-4 rounded-md bg-gray-50 p-4 text-center dark:bg-gray-700">
// // // //                   <p className="text-sm text-gray-600 dark:text-gray-300">
// // // //                     Aucune donnée locale stockée
// // // //                   </p>
// // // //                 </div>
// // // //               )}

// // // //               {/* Instructions d'utilisation */}
// // // //               <div className="mt-4 rounded-md bg-gray-50 p-3 dark:bg-gray-700">
// // // //                 <div className="flex">
// // // //                   <InfoIcon className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
// // // //                   <div className="flex-1">
// // // //                     <h4 className="text-sm font-medium text-gray-900 dark:text-white">
// // // //                       Comprendre le mode hors ligne
// // // //                     </h4>
// // // //                     <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
// // // //                       <p className="mb-1">
// // // //                         • Les <span className="font-medium text-yellow-600 dark:text-yellow-400">collectes en attente</span> sont enregistrées localement et seront envoyées au serveur lorsque vous serez en ligne.
// // // //                       </p>
// // // //                       <p className="mb-1">
// // // //                         • Les <span className="font-medium text-red-600 dark:text-red-400">collectes en échec</span> n'ont pas pu être synchronisées. Réessayez lorsque votre connexion sera stable.
// // // //                       </p>
// // // //                       <p>
// // // //                         • Les <span className="font-medium text-green-600 dark:text-green-400">collectes synchronisées</span> sont déjà sauvegardées sur le serveur.
// // // //                       </p>
// // // //                     </div>
// // // //                   </div>
// // // //                 </div>
// // // //               </div>
// // // //             </>
// // // //           )}
// // // //         </div>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // };

// // // // export default OfflineManager;
// // // import React, { useState, useEffect, useRef } from 'react';
// // // import { toast } from 'sonner';
// // // import { useOfflineStorage } from '@/hooks/useOfflineStorage';
// // // import {
// // //   WifiOffIcon,
// // //   WifiIcon,

// // // } from 'lucide-react';

// // // interface OfflineManagerProps {
// // //   onSyncComplete?: () => void;
// // //   className?: string;
// // // }

// // // const OfflineManager: React.FC<OfflineManagerProps> = ({
// // //   onSyncComplete,
// // //   className = '',
// // // }) => {
// // //   const [isOnline, setIsOnline] = useState(navigator.onLine);
// // //   // Removed unused state since the component no longer has an expandable panel
// // //   const [isOpen] = useState(false);
// // //   const [isLoading, setIsLoading] = useState(false);
// // //   const [localCollectes, setLocalCollectes] = useState<any[]>([]);
// // //   const [failedItems, setFailedItems] = useState<any[]>([]);
// // //   const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

// // //   // Utilisation d'une référence pour éviter des opérations multiples
// // //   const loadDataTimeoutRef = useRef<NodeJS.Timeout | null>(null);
// // //   const syncInProgressRef = useRef(false);

// // //   const {
// // //     pendingUploads,
// // //     syncData,
// // //     isInitialized,
// // //     isSyncInProgress,
// // //     getAllLocalCollectes,
// // //     getFailedSyncItems,
// // //   } = useOfflineStorage();

// // //   // Nettoyer les timeouts lorsque le composant est démonté
// // //   useEffect(() => {
// // //     return () => {
// // //       if (loadDataTimeoutRef.current) {
// // //         clearTimeout(loadDataTimeoutRef.current);
// // //       }
// // //     };
// // //   }, []);

// // //   // Surveiller les changements de connectivité
// // //   useEffect(() => {
// // //     const handleOnlineStatus = () => {
// // //       const currentlyOnline = navigator.onLine;
// // //       if (currentlyOnline !== isOnline) {
// // //         setIsOnline(currentlyOnline);
// // //         if (currentlyOnline) {
// // //           toast.info('Vous êtes de nouveau en ligne. Synchronisation possible.');
// // //           if (isInitialized && isOpen) {
// // //             if (loadDataTimeoutRef.current) {
// // //               clearTimeout(loadDataTimeoutRef.current);
// // //             }
// // //             loadDataTimeoutRef.current = setTimeout(() => {
// // //               loadData().catch((err) =>
// // //                 console.error('Erreur lors du rechargement des données:', err)
// // //               );
// // //               if (pendingUploads > 0) {
// // //                 handleSync();
// // //               }
// // //             }, 1500);
// // //           }
// // //         } else {
// // //           toast.warning(
// // //             'Vous êtes hors ligne. Les données seront sauvegardées localement.'
// // //           );
// // //         }
// // //       }
// // //     };

// // //     window.addEventListener('online', handleOnlineStatus);
// // //     window.addEventListener('offline', handleOnlineStatus);

// // //     return () => {
// // //       window.removeEventListener('online', handleOnlineStatus);
// // //       window.removeEventListener('offline', handleOnlineStatus);
// // //     };
// // //   }, [isOnline, isInitialized, isOpen, pendingUploads]);

// // //   // Charger les données quand le panneau est ouvert et que la base de données est initialisée
// // //   useEffect(() => {
// // //     if (isInitialized && isOpen) {
// // //       loadData();
// // //     }
// // //   }, [isInitialized, isOpen]);

// // //   // Fonction pour charger les données avec gestion améliorée des erreurs
// // //   const loadData = async () => {
// // //     if (!isInitialized) {
// // //       console.warn("La base de données n'est pas initialisée");
// // //       return;
// // //     }

// // //     if (isLoading) {
// // //       return;
// // //     }

// // //     setIsLoading(true);

// // //     try {
// // //       const collectes = await getAllLocalCollectes();
// // //       setLocalCollectes(collectes || []);
// // //       await new Promise((resolve) => setTimeout(resolve, 300));
// // //       const failed = await getFailedSyncItems();
// // //       setFailedItems(failed || []);
// // //     } catch (error) {
// // //       console.error('Erreur globale lors du chargement des données:', error);
// // //       toast.error('Erreur lors du chargement des données locales');
// // //     } finally {
// // //       setIsLoading(false);
// // //     }
// // //   };

// // //   const handleSync = async () => {
// // //     if (!isOnline) {
// // //       toast.error('Vous êtes hors ligne. Impossible de synchroniser.');
// // //       return;
// // //     }

// // //     if (!isInitialized || !syncData) {
// // //       toast.error('La base de données ou la fonction de synchronisation n\'est pas prête.');
// // //       return;
// // //     }

// // //     if (isLoading || isSyncInProgress || syncInProgressRef.current) {
// // //       return;
// // //     }

// // //     syncInProgressRef.current = true;

// // //     try {
// // //       setIsLoading(true);
// // //       toast.loading('Synchronisation en cours...');
// // //       const syncResult = await syncData();
// // //       toast.dismiss();

// // //       if (syncResult > 0) {
// // //         toast.success(`Synchronisation réussie: ${syncResult} collecte(s) synchronisée(s)`);
// // //         setLastSyncTime(new Date());

// // //         if (onSyncComplete) {
// // //           onSyncComplete();
// // //         }

// // //         if (loadDataTimeoutRef.current) {
// // //           clearTimeout(loadDataTimeoutRef.current);
// // //         }

// // //         loadDataTimeoutRef.current = setTimeout(() => {
// // //           loadData().catch((err) =>
// // //             console.error('Erreur lors du chargement des données après synchronisation:', err)
// // //           );
// // //         }, 800);
// // //       } else {
// // //         toast.info('Aucune donnée n\'a été synchronisée');
// // //         if (loadDataTimeoutRef.current) {
// // //           clearTimeout(loadDataTimeoutRef.current);
// // //         }

// // //         loadDataTimeoutRef.current = setTimeout(() => {
// // //           loadData().catch((err) =>
// // //             console.error('Erreur lors du chargement des données:', err)
// // //           );
// // //         }, 500);
// // //       }
// // //     } catch (error) {
// // //       toast.dismiss();
// // //       console.error('Erreur lors de la synchronisation:', error);
// // //       toast.error('Erreur lors de la synchronisation. Veuillez réessayer.');
// // //     } finally {
// // //       setIsLoading(false);
// // //       syncInProgressRef.current = false;
// // //     }
// // //   };

// // //   return (
// // //     <div className={`${className}`}>
// // //       {/* Indicateur de mode hors ligne */}
// // //       <div className="inline-flex items-center gap-2 rounded-lg border p-2 shadow-sm">
// // //         {isOnline ? (
// // //           <>
// // //             <WifiIcon className="mr-1 h-4 w-4 text-green-700" />
// // //             En ligne
// // //           </>
// // //         ) : (
// // //           <>
// // //             <WifiOffIcon className="mr-1 h-4 w-4 text-yellow-700" />
// // //             Hors ligne
// // //           </>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // };

// // export default OfflineManager;
// // import React, { useState, useEffect, useRef } from 'react';
// // import { toast } from 'sonner';
// // import { useOfflineStorage } from '@/hooks/useOfflineStorage';
// // import {
// //   WifiOffIcon,
// //   WifiIcon,
// //   RefreshCcw,
// //   AlertTriangleIcon,
// //   CheckCircleIcon,
// //   CloudOffIcon,
// //   Database,
// //   Trash2Icon,
// //   XCircleIcon,
// //   ClockIcon,
// //   InfoIcon
// // } from 'lucide-react';

// // interface OfflineManagerProps {
// //   onSyncComplete?: () => void;
// //   className?: string;
// //   showPanel?: boolean;
// // }

// // const OfflineManager: React.FC<OfflineManagerProps> = ({
// //   onSyncComplete,
// //   className = '',
// //   showPanel = true
// // }) => {
// //   const [isOnline, setIsOnline] = useState(navigator.onLine);
// //   const [isOpen, setIsOpen] = useState(false);
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [localCollectes, setLocalCollectes] = useState<any[]>([]);
// //   const [failedItems, setFailedItems] = useState<any[]>([]);
// //   const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

// //   // Utilisation d'une référence pour éviter des opérations multiples
// //   const loadDataTimeoutRef = useRef<NodeJS.Timeout | null>(null);
// //   const syncInProgressRef = useRef(false);

// //   const {
// //     pendingUploads,
// //     syncData,
// //     isInitialized,
// //     isSyncInProgress,
// //     getAllLocalCollectes,
// //     getFailedSyncItems,
// //     retryFailedSyncItems,
// //     clearSyncQueue,
// //     deleteLocalCollecte
// //   } = useOfflineStorage();

// //   // Nettoyer les timeouts lorsque le composant est démonté
// //   useEffect(() => {
// //     return () => {
// //       if (loadDataTimeoutRef.current) {
// //         clearTimeout(loadDataTimeoutRef.current);
// //       }
// //     };
// //   }, []);

// //   // Surveiller les changements de connectivité
// //   useEffect(() => {
// //     const handleOnlineStatus = () => {
// //       const currentlyOnline = navigator.onLine;

// //       // Ne mettre à jour que si l'état a changé
// //       if (currentlyOnline !== isOnline) {
// //         setIsOnline(currentlyOnline);

// //         if (currentlyOnline) {
// //           toast.info('Vous êtes de nouveau en ligne. Synchronisation possible.');

// //           // Tenter de recharger les données après un court délai
// //           if (isInitialized && isOpen) {
// //             if (loadDataTimeoutRef.current) {
// //               clearTimeout(loadDataTimeoutRef.current);
// //             }

// //             loadDataTimeoutRef.current = setTimeout(() => {
// //               loadData().catch(err => console.error("Erreur lors du rechargement des données:", err));

// //               // Synchroniser automatiquement après être revenu en ligne
// //               if (pendingUploads > 0) {
// //                 handleSync();
// //               }
// //             }, 1500);
// //           }
// //         } else {
// //           toast.warning('Vous êtes hors ligne. Les données seront sauvegardées localement.');
// //         }
// //       }
// //     };

// //     window.addEventListener('online', handleOnlineStatus);
// //     window.addEventListener('offline', handleOnlineStatus);

// //     return () => {
// //       window.removeEventListener('online', handleOnlineStatus);
// //       window.removeEventListener('offline', handleOnlineStatus);
// //     };
// //   }, [isOnline, isInitialized, isOpen, pendingUploads]);

// //   // Charger les données quand le panneau est ouvert et que la base de données est initialisée
// //   useEffect(() => {
// //     if (isInitialized && isOpen) {
// //       loadData();
// //     }
// //   }, [isInitialized, isOpen]);

// //   // Fonction pour charger les données avec gestion améliorée des erreurs
// //   const loadData = async () => {
// //     if (!isInitialized) {
// //       console.warn('La base de données n\'est pas initialisée, impossible de charger les données');
// //       return;
// //     }

// //     // Éviter les chargements multiples simultanés
// //     if (isLoading) {
// //       return;
// //     }

// //     setIsLoading(true);

// //     try {
// //       let collectes: any[] = [];
// //       try {
// //         collectes = await getAllLocalCollectes();
// //         setLocalCollectes(collectes || []);
// //       } catch (error) {
// //         console.error('Erreur lors du chargement des collectes locales:', error);
// //         setLocalCollectes([]);
// //       }

// //       // Petit délai pour éviter les opérations simultanées sur IndexedDB
// //       await new Promise(resolve => setTimeout(resolve, 300));

// //       let failed: any[] = [];
// //       try {
// //         failed = await getFailedSyncItems();
// //         setFailedItems(failed || []);
// //       } catch (error) {
// //         console.error('Erreur lors du chargement des éléments en échec:', error);
// //         setFailedItems([]);
// //       }
// //     } catch (error) {
// //       console.error('Erreur globale lors du chargement des données:', error);
// //       toast.error('Erreur lors du chargement des données locales');
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   // Fonction de synchronisation améliorée avec protection contre les appels multiples
// //   const handleSync = async () => {
// //     if (!isOnline) {
// //       toast.error('Vous êtes hors ligne. Impossible de synchroniser.');
// //       return;
// //     }

// //     if (!isInitialized) {
// //       toast.error('La base de données n\'est pas prête. Veuillez réessayer.');
// //       return;
// //     }

// //     // Éviter les multiples clics
// //     if (isLoading || isSyncInProgress || syncInProgressRef.current) {
// //       return;
// //     }

// //     syncInProgressRef.current = true;

// //     try {
// //       setIsLoading(true);
// //       toast.loading('Synchronisation en cours...');

// //       const syncResult = await syncData();
// //       toast.dismiss();

// //       if (syncResult > 0) {
// //         toast.success(`Synchronisation réussie: ${syncResult} collecte(s) synchronisée(s)`);
// //         setLastSyncTime(new Date());

// //         // Appeler le callback de synchronisation complète
// //         if (onSyncComplete) {
// //           try {
// //             onSyncComplete();
// //           } catch (error) {
// //             console.error("Erreur lors de l'exécution de onSyncComplete:", error);
// //           }
// //         }

// //         // Recharger les données après un délai pour éviter les problèmes de transaction
// //         if (loadDataTimeoutRef.current) {
// //           clearTimeout(loadDataTimeoutRef.current);
// //         }

// //         loadDataTimeoutRef.current = setTimeout(() => {
// //           loadData().catch(err => console.error("Erreur lors du chargement des données après synchronisation:", err));
// //         }, 800);
// //       } else {
// //         toast.info('Aucune donnée n\'a été synchronisée');

// //         // Recharger quand même les données pour s'assurer que l'UI est à jour
// //         if (loadDataTimeoutRef.current) {
// //           clearTimeout(loadDataTimeoutRef.current);
// //         }

// //         loadDataTimeoutRef.current = setTimeout(() => {
// //           loadData().catch(err => console.error("Erreur lors du chargement des données:", err));
// //         }, 500);
// //       }
// //     } catch (error) {
// //       toast.dismiss();
// //       console.error('Erreur lors de la synchronisation:', error);
// //       toast.error('Erreur lors de la synchronisation. Veuillez réessayer.');
// //     } finally {
// //       setIsLoading(false);
// //       syncInProgressRef.current = false;
// //     }
// //   };

// //   // Fonction pour réessayer les synchronisations échouées
// //   const handleRetryFailed = async () => {
// //     if (!isOnline) {
// //       toast.error('Vous êtes hors ligne. Impossible de resynchroniser.');
// //       return;
// //     }

// //     // Éviter les multiples clics
// //     if (isLoading || isSyncInProgress || syncInProgressRef.current) {
// //       return;
// //     }

// //     syncInProgressRef.current = true;

// //     try {
// //       setIsLoading(true);
// //       toast.loading('Réessai des synchronisations échouées...');

// //       const result = await retryFailedSyncItems();
// //       toast.dismiss();

// //       if (result > 0) {
// //         toast.success(`${result} élément(s) marqué(s) pour resynchronisation`);

// //         // Lancer la synchronisation après avoir réinitialisé les éléments
// //         if (isOnline) {
// //           const syncResult = await syncData();

// //           if (syncResult > 0) {
// //             toast.success(`Resynchronisation réussie: ${syncResult} collecte(s) synchronisée(s)`);
// //             setLastSyncTime(new Date());

// //             // Appeler le callback de synchronisation complète
// //             if (onSyncComplete) {
// //               onSyncComplete();
// //             }
// //           } else {
// //             toast.info('Aucune donnée n\'a été resynchronisée');
// //           }
// //         }

// //         // Recharger les données après un délai
// //         if (loadDataTimeoutRef.current) {
// //           clearTimeout(loadDataTimeoutRef.current);
// //         }

// //         loadDataTimeoutRef.current = setTimeout(() => {
// //           loadData().catch(err => console.error("Erreur lors du chargement des données après réessai:", err));
// //         }, 800);
// //       } else {
// //         toast.info('Aucun élément à resynchroniser');
// //       }
// //     } catch (error) {
// //       toast.dismiss();
// //       console.error('Erreur lors de la resynchronisation:', error);
// //       toast.error('Erreur lors de la resynchronisation');
// //     } finally {
// //       setIsLoading(false);
// //       syncInProgressRef.current = false;
// //     }
// //   };

// //   // Fonction pour vider la file d'attente de synchronisation
// //   const handleClearQueue = async () => {
// //     if (!confirm('Êtes-vous sûr de vouloir vider la file d\'attente de synchronisation ? Cette action ne peut pas être annulée.')) {
// //       return;
// //     }

// //     // Éviter les multiples clics
// //     if (isLoading) {
// //       return;
// //     }

// //     try {
// //       setIsLoading(true);
// //       const result = await clearSyncQueue();

// //       if (result) {
// //         toast.success('File d\'attente de synchronisation vidée');
// //       } else {
// //         toast.error('Échec du vidage de la file d\'attente');
// //       }

// //       // Recharger les données après un court délai
// //       if (loadDataTimeoutRef.current) {
// //         clearTimeout(loadDataTimeoutRef.current);
// //       }

// //       loadDataTimeoutRef.current = setTimeout(() => {
// //         loadData().catch(err => {
// //           console.error('Erreur de chargement après vidage:', err);
// //         });
// //       }, 500);
// //     } catch (error) {
// //       console.error('Erreur lors du vidage de la file:', error);
// //       toast.error('Erreur lors du vidage de la file d\'attente');
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   // Fonction pour supprimer une collecte locale
// //   const handleDeleteItem = async (id: number) => {
// //     if (!confirm('Êtes-vous sûr de vouloir supprimer cette collecte locale ? Cette action ne peut pas être annulée.')) {
// //       return;
// //     }

// //     // Éviter les multiples clics
// //     if (isLoading) {
// //       return;
// //     }

// //     try {
// //       setIsLoading(true);
// //       const result = await deleteLocalCollecte(id);

// //       if (result) {
// //         toast.success('Collecte locale supprimée');

// //         // Mettre à jour l'interface immédiatement
// //         setLocalCollectes(prev => prev.filter(item => item.id !== id));
// //       } else {
// //         toast.error('Échec de la suppression de la collecte');
// //       }

// //       // Recharger les données complètes après un court délai
// //       if (loadDataTimeoutRef.current) {
// //         clearTimeout(loadDataTimeoutRef.current);
// //       }

// //       loadDataTimeoutRef.current = setTimeout(() => {
// //         loadData().catch(err => {
// //           console.error('Erreur de chargement après suppression:', err);
// //         });
// //       }, 500);
// //     } catch (error) {
// //       console.error('Erreur lors de la suppression:', error);
// //       toast.error('Erreur lors de la suppression de la collecte');
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   // Fonction pour formater la date
// //   const formatDate = (timestamp: number) => {
// //     try {
// //       return new Date(timestamp).toLocaleString('fr-FR', {
// //         day: '2-digit',
// //         month: '2-digit',
// //         year: 'numeric',
// //         hour: '2-digit',
// //         minute: '2-digit',
// //       });
// //     } catch (error) {
// //       console.error('Erreur de formatage de date:', error, timestamp);
// //       return 'Date invalide';
// //     }
// //   };

// //   // Fonction pour formater le nom de la collecte
// //   const formatCollecteName = (collecte: any) => {
// //     try {
// //       const entreprise = collecte.entreprise_id || 'Inconnue';
// //       const periodeId = collecte.periode_id || 'Inconnue';
// //       const type = collecte.is_draft ? 'Brouillon' : 'Standard';

// //       return `Collecte ${type} - Entreprise #${entreprise} - Période #${periodeId}`;
// //     } catch (error) {
// //       console.error('Erreur de formatage de nom:', error, collecte);
// //       return 'Collecte sans nom';
// //     }
// //   };

// //   return (
// //     <div className={`${className}`}>
// //       {/* Indicateur de mode hors ligne */}
// //       <div className="inline-flex items-center gap-2 rounded-lg border p-2 shadow-sm">
// //         {isOnline ? (
// //           <span className="flex items-center text-green-700 dark:text-green-400">
// //             <WifiIcon className="mr-1 h-4 w-4" />
// //             En ligne
// //           </span>
// //         ) : (
// //           <span className="flex items-center text-yellow-700 dark:text-yellow-400">
// //             <WifiOffIcon className="mr-1 h-4 w-4" />
// //             Hors ligne
// //           </span>
// //         )}

// //         {typeof pendingUploads === 'number' && pendingUploads > 0 && (
// //           <button
// //             onClick={() => setIsOpen(!isOpen)}
// //             className="ml-2 inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-500/30"
// //           >
// //             <Database className="mr-1 h-3 w-3" />
// //             {pendingUploads} en attente
// //           </button>
// //         )}

// //         {isOnline && typeof pendingUploads === 'number' && pendingUploads > 0 && (
// //           <button
// //             onClick={handleSync}
// //             disabled={isSyncInProgress || isLoading || syncInProgressRef.current}
// //             className="ml-1 inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-600/20 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:ring-indigo-500/30 dark:hover:bg-indigo-800/40 disabled:opacity-50"
// //           >
// //             <RefreshCcw className={`mr-1 h-3 w-3 ${(isSyncInProgress || isLoading || syncInProgressRef.current) ? 'animate-spin' : ''}`} />
// //             Synchroniser
// //           </button>
// //         )}

// //         {/* Indicateur de dernière synchronisation */}
// //         {lastSyncTime && (
// //           <span className="hidden sm:inline-flex items-center text-xs text-gray-500 dark:text-gray-400 ml-2">
// //             <ClockIcon className="mr-1 h-3 w-3" />
// //             Dernière sync: {lastSyncTime.toLocaleTimeString()}
// //           </span>
// //         )}
// //       </div>

// //       {/* Panel de gestion des données hors ligne */}
// //       {isOpen && showPanel && (
// //         <div className="mt-4 rounded-lg border bg-white p-4 shadow dark:bg-gray-800 dark:border-gray-700">
// //           <div className="flex justify-between items-center mb-4">
// //             <h3 className="text-lg font-medium text-gray-900 dark:text-white">
// //               Gestionnaire de données hors ligne
// //             </h3>
// //             <button
// //               onClick={() => setIsOpen(false)}
// //               className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300"
// //               aria-label="Fermer"
// //             >
// //               <XCircleIcon className="h-5 w-5" />
// //             </button>
// //           </div>

// //           {isLoading ? (
// //             <div className="flex flex-col items-center justify-center py-6">
// //               <ClockIcon className="h-10 w-10 animate-spin text-indigo-500 mb-3" />
// //               <p className="text-sm text-gray-600 dark:text-gray-300">
// //                 Chargement des données...
// //               </p>
// //             </div>
// //           ) : (
// //             <>
// //               <div className="mb-4 rounded-md bg-blue-50 p-3 dark:bg-blue-900/30">
// //                 <div className="flex">
// //                   <div className="flex-shrink-0">
// //                     <CloudOffIcon className="h-5 w-5 text-blue-400 dark:text-blue-300" />
// //                   </div>
// //                   <div className="ml-3 flex-1 md:flex md:justify-between">
// //                     <p className="text-sm text-blue-700 dark:text-blue-300">
// //                       {localCollectes.length} collecte(s) stockée(s) localement, dont {pendingUploads} en attente de synchronisation.
// //                     </p>
// //                     <div className="mt-3 flex flex-wrap gap-2 md:ml-6 md:mt-0">
// //                       {failedItems.length > 0 && (
// //                         <button
// //                           onClick={handleRetryFailed}
// //                           disabled={!isOnline || isSyncInProgress || isLoading || syncInProgressRef.current}
// //                           className="whitespace-nowrap rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-800 dark:text-blue-200 disabled:opacity-50"
// //                         >
// //                           Réessayer les échecs ({failedItems.length})
// //                         </button>
// //                       )}
// //                       <button
// //                         onClick={handleClearQueue}
// //                         disabled={isLoading || pendingUploads === 0}
// //                         className="whitespace-nowrap rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-700 dark:bg-red-800 dark:text-red-200 disabled:opacity-50"
// //                       >
// //                         Vider la file
// //                       </button>
// //                       <button
// //                         onClick={loadData}
// //                         disabled={isLoading}
// //                         className="whitespace-nowrap rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-200 disabled:opacity-50"
// //                       >
// //                         Rafraîchir
// //                       </button>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>

// //               {localCollectes.length > 0 ? (
// //                 <div className="mt-4 max-h-60 overflow-y-auto rounded-md border dark:border-gray-700">
// //                   <ul className="divide-y divide-gray-200 dark:divide-gray-700">
// //                     {localCollectes.map((collecte) => {
// //                       // Vérifier que les propriétés nécessaires existent
// //                       if (!collecte || typeof collecte.id === 'undefined') {
// //                         return null;
// //                       }

// //                       const isFailed = failedItems.some(item => item.collecteId === collecte.id);
// //                       const isPending = !collecte.synced;

// //                       return (
// //                         <li key={collecte.id} className="relative flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700">
// //                           <div className="min-w-0 flex-1">
// //                             <div className="flex items-center">
// //                               {isFailed ? (
// //                                 <AlertTriangleIcon className="mr-2 h-4 w-4 text-red-500" />
// //                               ) : isPending ? (
// //                                 <ClockIcon className="mr-2 h-4 w-4 text-yellow-500" />
// //                               ) : (
// //                                 <CheckCircleIcon className="mr-2 h-4 w-4 text-green-500" />
// //                               )}
// //                               <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
// //                                 {formatCollecteName(collecte)}
// //                               </p>
// //                             </div>
// //                             <div className="mt-1">
// //                               <p className="text-xs text-gray-500 dark:text-gray-400">
// //                                 Créée le {collecte.timestamp ? formatDate(collecte.timestamp) : 'Date inconnue'}
// //                               </p>
// //                               {isFailed && (
// //                                 <p className="mt-1 text-xs text-red-500">
// //                                   Échec de synchronisation - Vérifiez la connexion
// //                                 </p>
// //                               )}
// //                               {isPending && !isFailed && (
// //                                 <p className="mt-1 text-xs text-yellow-500">
// //                                   En attente de synchronisation
// //                                 </p>
// //                               )}
// //                               {!isPending && !isFailed && collecte.syncedAt && (
// //                                 <p className="mt-1 text-xs text-green-500">
// //                                   Synchronisée le {formatDate(collecte.syncedAt)}
// //                                 </p>
// //                               )}
// //                             </div>
// //                           </div>
// //                           <button
// //                             onClick={() => handleDeleteItem(collecte.id)}
// //                             disabled={isLoading}
// //                             className="ml-2 rounded-full p-1 text-gray-400 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/30 dark:hover:text-red-300 disabled:opacity-50"
// //                             aria-label="Supprimer cette collecte"
// //                           >
// //                             <Trash2Icon className="h-4 w-4" />
// //                           </button>
// //                         </li>
// //                       );
// //                     })}
// //                   </ul>
// //                 </div>
// //               ) : (
// //                 <div className="mt-4 rounded-md bg-gray-50 p-4 text-center dark:bg-gray-700">
// //                   <p className="text-sm text-gray-600 dark:text-gray-300">
// //                     Aucune donnée locale stockée
// //                   </p>
// //                 </div>
// //               )}

// //               {/* Instructions d'utilisation */}
// //               <div className="mt-4 rounded-md bg-gray-50 p-3 dark:bg-gray-700">
// //                 <div className="flex">
// //                   <InfoIcon className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
// //                   <div className="flex-1">
// //                     <h4 className="text-sm font-medium text-gray-900 dark:text-white">
// //                       Comprendre le mode hors ligne
// //                     </h4>
// //                     <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
// //                       <p className="mb-1">
// //                         • Les <span className="font-medium text-yellow-600 dark:text-yellow-400">collectes en attente</span> sont enregistrées localement et seront envoyées au serveur lorsque vous serez en ligne.
// //                       </p>
// //                       <p className="mb-1">
// //                         • Les <span className="font-medium text-red-600 dark:text-red-400">collectes en échec</span> n'ont pas pu être synchronisées. Réessayez lorsque votre connexion sera stable.
// //                       </p>
// //                       <p>
// //                         • Les <span className="font-medium text-green-600 dark:text-green-400">collectes synchronisées</span> sont déjà sauvegardées sur le serveur.
// //                       </p>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             </>
// //           )}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default OfflineManager;

// // components/OfflineManager.jsx
// import React, { useState, useEffect, useRef } from 'react';
// import { toast } from 'sonner';
// import { useOfflineStorage } from '@/hooks/useOfflineStorage';
// import {
//   WifiOffIcon,
//   WifiIcon,
//   RefreshCcw,
//   AlertTriangleIcon,
//   CheckCircleIcon,
//   CloudOffIcon,
//   Database,
//   Trash2Icon,
//   XCircleIcon,
//   ClockIcon,
//   InfoIcon
// } from 'lucide-react';

// const OfflineManager = ({ onSyncComplete, className = '', showPanel = true }) => {
//   const [isOnline, setIsOnline] = useState(navigator.onLine);
//   const [isOpen, setIsOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [localCollectes, setLocalCollectes] = useState([]);
//   const [failedItems, setFailedItems] = useState([]);
//   const [lastSyncTime, setLastSyncTime] = useState(null);

//   // Référence pour éviter des opérations multiples
//   const loadDataTimeoutRef = useRef(null);
//   const syncInProgressRef = useRef(false);

//   const {
//     pendingUploads,
//     syncData,
//     isInitialized,
//     isSyncInProgress,
//     getAllLocalCollectes,
//     getFailedSyncItems,
//     retryFailedSyncItems,
//     clearSyncQueue,
//     deleteLocalCollecte
//   } = useOfflineStorage();

//   // Nettoyer les timeouts lors du démontage
//   useEffect(() => {
//     return () => {
//       if (loadDataTimeoutRef.current) {
//         clearTimeout(loadDataTimeoutRef.current);
//       }
//     };
//   }, []);

//   // components/OfflineManager.jsx (suite)

//   // Surveiller les changements de connectivité
//   useEffect(() => {
//     const handleOnlineStatus = () => {
//       const currentlyOnline = navigator.onLine;

//       // Ne mettre à jour que si l'état a changé
//       if (currentlyOnline !== isOnline) {
//         setIsOnline(currentlyOnline);

//         if (currentlyOnline) {
//           toast.info('Vous êtes de nouveau en ligne. Synchronisation possible.');

//           // Tenter de recharger les données après un court délai
//           if (isInitialized && isOpen) {
//             if (loadDataTimeoutRef.current) {
//               clearTimeout(loadDataTimeoutRef.current);
//             }

//             loadDataTimeoutRef.current = setTimeout(() => {
//               loadData().catch(err => console.error("Erreur lors du rechargement des données:", err));

//               // Synchroniser automatiquement après être revenu en ligne
//               if (pendingUploads > 0) {
//                 handleSync();
//               }
//             }, 1500);
//           }
//         } else {
//           toast.warning('Vous êtes hors ligne. Les données seront sauvegardées localement.');
//         }
//       }
//     };

//     window.addEventListener('online', handleOnlineStatus);
//     window.addEventListener('offline', handleOnlineStatus);

//     return () => {
//       window.removeEventListener('online', handleOnlineStatus);
//       window.removeEventListener('offline', handleOnlineStatus);
//     };
//   }, [isOnline, isInitialized, isOpen, pendingUploads]);

//   // Charger les données quand le panneau est ouvert et que la base de données est initialisée
//   useEffect(() => {
//     if (isInitialized && isOpen) {
//       loadData();
//     }
//   }, [isInitialized, isOpen]);

//   // Fonction pour charger les données avec gestion améliorée des erreurs
//   const loadData = async () => {
//     if (!isInitialized) {
//       console.warn('La base de données n\'est pas initialisée, impossible de charger les données');
//       return;
//     }

//     // Éviter les chargements multiples simultanés
//     if (isLoading) {
//       return;
//     }

//     setIsLoading(true);

//     try {
//       let collectes = [];
//       try {
//         collectes = await getAllLocalCollectes();
//         setLocalCollectes(collectes || []);
//       } catch (error) {
//         console.error('Erreur lors du chargement des collectes locales:', error);
//         setLocalCollectes([]);
//       }

//       // Petit délai pour éviter les opérations simultanées sur IndexedDB
//       await new Promise(resolve => setTimeout(resolve, 300));

//       let failed = [];
//       try {
//         failed = await getFailedSyncItems();
//         setFailedItems(failed || []);
//       } catch (error) {
//         console.error('Erreur lors du chargement des éléments en échec:', error);
//         setFailedItems([]);
//       }
//     } catch (error) {
//       console.error('Erreur globale lors du chargement des données:', error);
//       toast.error('Erreur lors du chargement des données locales');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Fonction de synchronisation améliorée avec protection contre les appels multiples
//   const handleSync = async () => {
//     if (!isOnline) {
//       toast.error('Vous êtes hors ligne. Impossible de synchroniser.');
//       return;
//     }

//     if (!isInitialized) {
//       toast.error('La base de données n\'est pas prête. Veuillez réessayer.');
//       return;
//     }

//     // Éviter les multiples clics
//     if (isLoading || isSyncInProgress || syncInProgressRef.current) {
//       return;
//     }

//     syncInProgressRef.current = true;

//     try {
//       setIsLoading(true);
//       toast.loading('Synchronisation en cours...');

//       const syncResult = await syncData();
//       toast.dismiss();

//       if (syncResult > 0) {
//         toast.success(`Synchronisation réussie: ${syncResult} collecte(s) synchronisée(s)`);
//         setLastSyncTime(new Date());

//         // Appeler le callback de synchronisation complète
//         if (onSyncComplete) {
//           try {
//             onSyncComplete();
//           } catch (error) {
//             console.error("Erreur lors de l'exécution de onSyncComplete:", error);
//           }
//         }

//         // Recharger les données après un délai pour éviter les problèmes de transaction
//         if (loadDataTimeoutRef.current) {
//           clearTimeout(loadDataTimeoutRef.current);
//         }

//         loadDataTimeoutRef.current = setTimeout(() => {
//           loadData().catch(err => console.error("Erreur lors du chargement des données après synchronisation:", err));
//         }, 800);
//       } else {
//         toast.info('Aucune donnée n\'a été synchronisée');

//         // Recharger quand même les données pour s'assurer que l'UI est à jour
//         if (loadDataTimeoutRef.current) {
//           clearTimeout(loadDataTimeoutRef.current);
//         }

//         loadDataTimeoutRef.current = setTimeout(() => {
//           loadData().catch(err => console.error("Erreur lors du chargement des données:", err));
//         }, 500);
//       }
//     } catch (error) {
//       toast.dismiss();
//       console.error('Erreur lors de la synchronisation:', error);
//       toast.error('Erreur lors de la synchronisation. Veuillez réessayer.');
//     } finally {
//       setIsLoading(false);
//       syncInProgressRef.current = false;
//     }
//   };

//   // Fonction pour réessayer les synchronisations échouées
//   const handleRetryFailed = async () => {
//     if (!isOnline) {
//       toast.error('Vous êtes hors ligne. Impossible de resynchroniser.');
//       return;
//     }

//     // Éviter les multiples clics
//     if (isLoading || isSyncInProgress || syncInProgressRef.current) {
//       return;
//     }

//     syncInProgressRef.current = true;

//     try {
//       setIsLoading(true);
//       toast.loading('Réessai des synchronisations échouées...');

//       const result = await retryFailedSyncItems();
//       toast.dismiss();

//       if (result > 0) {
//         toast.success(`${result} élément(s) marqué(s) pour resynchronisation`);

//         // Lancer la synchronisation après avoir réinitialisé les éléments
//         if (isOnline) {
//           const syncResult = await syncData();

//           if (syncResult > 0) {
//             toast.success(`Resynchronisation réussie: ${syncResult} collecte(s) synchronisée(s)`);
//             setLastSyncTime(new Date());

//             // Appeler le callback de synchronisation complète
//             if (onSyncComplete) {
//               onSyncComplete();
//             }
//           } else {
//             toast.info('Aucune donnée n\'a été resynchronisée');
//           }
//         }

//         // Recharger les données après un délai
//         if (loadDataTimeoutRef.current) {
//           clearTimeout(loadDataTimeoutRef.current);
//         }

//         loadDataTimeoutRef.current = setTimeout(() => {
//           loadData().catch(err => console.error("Erreur lors du chargement des données après réessai:", err));
//         }, 800);
//       } else {
//         toast.info('Aucun élément à resynchroniser');
//       }
//     } catch (error) {
//       toast.dismiss();
//       console.error('Erreur lors de la resynchronisation:', error);
//       toast.error('Erreur lors de la resynchronisation');
//     } finally {
//       setIsLoading(false);
//       syncInProgressRef.current = false;
//     }
//   };

//   // Fonction pour vider la file d'attente de synchronisation
//   const handleClearQueue = async () => {
//     if (!confirm('Êtes-vous sûr de vouloir vider la file d\'attente de synchronisation ? Cette action ne peut pas être annulée.')) {
//       return;
//     }

//     // Éviter les multiples clics
//     if (isLoading) {
//       return;
//     }

//     try {
//       setIsLoading(true);
//       const result = await clearSyncQueue();

//       if (result) {
//         toast.success('File d\'attente de synchronisation vidée');
//       } else {
//         toast.error('Échec du vidage de la file d\'attente');
//       }

//       // Recharger les données après un court délai
//       if (loadDataTimeoutRef.current) {
//         clearTimeout(loadDataTimeoutRef.current);
//       }

//       loadDataTimeoutRef.current = setTimeout(() => {
//         loadData().catch(err => {
//           console.error('Erreur de chargement après vidage:', err);
//         });
//       }, 500);
//     } catch (error) {
//       console.error('Erreur lors du vidage de la file:', error);
//       toast.error('Erreur lors du vidage de la file d\'attente');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Fonction pour supprimer une collecte locale
//   const handleDeleteItem = async (id) => {
//     if (!confirm('Êtes-vous sûr de vouloir supprimer cette collecte locale ? Cette action ne peut pas être annulée.')) {
//       return;
//     }

//     // Éviter les multiples clics
//     if (isLoading) {
//       return;
//     }

//     try {
//       setIsLoading(true);
//       const result = await deleteLocalCollecte(id);

//       if (result) {
//         toast.success('Collecte locale supprimée');

//         // Mettre à jour l'interface immédiatement
//         setLocalCollectes(prev => prev.filter(item => item.id !== id));
//       } else {
//         toast.error('Échec de la suppression de la collecte');
//       }

//       // Recharger les données complètes après un court délai
//       if (loadDataTimeoutRef.current) {
//         clearTimeout(loadDataTimeoutRef.current);
//       }

//       loadDataTimeoutRef.current = setTimeout(() => {
//         loadData().catch(err => {
//           console.error('Erreur de chargement après suppression:', err);
//         });
//       }, 500);
//     } catch (error) {
//       console.error('Erreur lors de la suppression:', error);
//       toast.error('Erreur lors de la suppression de la collecte');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Fonction pour formater la date
//   const formatDate = (timestamp) => {
//     try {
//       return new Date(timestamp).toLocaleString('fr-FR', {
//         day: '2-digit',
//         month: '2-digit',
//         year: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit',
//       });
//     } catch (error) {
//       console.error('Erreur de formatage de date:', error, timestamp);
//       return 'Date invalide';
//     }
//   };

//   // Fonction pour formater le nom de la collecte
//   const formatCollecteName = (collecte) => {
//     try {
//       const entreprise = collecte.entreprise_id || 'Inconnue';
//       const periodeId = collecte.periode_id || 'Inconnue';
//       const type = collecte.is_draft ? 'Brouillon' : 'Standard';

//       return `Collecte ${type} - Entreprise #${entreprise} - Période #${periodeId}`;
//     } catch (error) {
//       console.error('Erreur de formatage de nom:', error, collecte);
//       return 'Collecte sans nom';
//     }
//   };

//   return (
//     <div className={`${className}`}>
//       {/* Indicateur de mode hors ligne */}
//       <div className="inline-flex items-center gap-2 rounded-lg border p-2 shadow-sm">
//         {isOnline ? (
//           <span className="flex items-center text-green-700 dark:text-green-400">
//             <WifiIcon className="mr-1 h-4 w-4" />
//             En ligne
//           </span>
//         ) : (
//           <span className="flex items-center text-yellow-700 dark:text-yellow-400">
//             <WifiOffIcon className="mr-1 h-4 w-4" />
//             Hors ligne
//           </span>
//         )}

//         {typeof pendingUploads === 'number' && pendingUploads > 0 && (
//           <button
//             onClick={() => setIsOpen(!isOpen)}
//             className="ml-2 inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-500/30"
//           >
//             <Database className="mr-1 h-3 w-3" />
//             {pendingUploads} en attente
//           </button>
//         )}

//         {isOnline && typeof pendingUploads === 'number' && pendingUploads > 0 && (
//           <button
//             onClick={handleSync}
//             disabled={isSyncInProgress || isLoading || syncInProgressRef.current}
//             className="ml-1 inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-600/20 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:ring-indigo-500/30 dark:hover:bg-indigo-800/40 disabled:opacity-50"
//           >
//             <RefreshCcw className={`mr-1 h-3 w-3 ${(isSyncInProgress || isLoading || syncInProgressRef.current) ? 'animate-spin' : ''}`} />
//             Synchroniser
//           </button>
//         )}

//         {/* Indicateur de dernière synchronisation */}
//         {lastSyncTime && (
//           <span className="hidden sm:inline-flex items-center text-xs text-gray-500 dark:text-gray-400 ml-2">
//             <ClockIcon className="mr-1 h-3 w-3" />
//             Dernière sync: {lastSyncTime.toLocaleTimeString()}
//           </span>
//         )}
//       </div>

//       {/* Panel de gestion des données hors ligne */}
//       {isOpen && showPanel && (
//         <div className="mt-4 rounded-lg border bg-white p-4 shadow dark:bg-gray-800 dark:border-gray-700">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-lg font-medium text-gray-900 dark:text-white">
//               Gestionnaire de données hors ligne
//             </h3>
//             <button
//               onClick={() => setIsOpen(false)}
//               className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300"
//               aria-label="Fermer"
//             >
//               <XCircleIcon className="h-5 w-5" />
//             </button>
//           </div>

//           {isLoading ? (
//             <div className="flex flex-col items-center justify-center py-6">
//               <ClockIcon className="h-10 w-10 animate-spin text-indigo-500 mb-3" />
//               <p className="text-sm text-gray-600 dark:text-gray-300">
//                 Chargement des données...
//               </p>
//             </div>
//           ) : (
//             <>
//               <div className="mb-4 rounded-md bg-blue-50 p-3 dark:bg-blue-900/30">
//                 <div className="flex">
//                   <div className="flex-shrink-0">
//                     <CloudOffIcon className="h-5 w-5 text-blue-400 dark:text-blue-300" />
//                   </div>
//                   <div className="ml-3 flex-1 md:flex md:justify-between">
//                     <p className="text-sm text-blue-700 dark:text-blue-300">
//                       {localCollectes.length} collecte(s) stockée(s) localement, dont {pendingUploads} en attente de synchronisation.
//                     </p>
//                     <div className="mt-3 flex flex-wrap gap-2 md:ml-6 md:mt-0">
//                       {failedItems.length > 0 && (
//                         <button
//                           onClick={handleRetryFailed}
//                           disabled={!isOnline || isSyncInProgress || isLoading || syncInProgressRef.current}
//                           className="whitespace-nowrap rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-800 dark:text-blue-200 disabled:opacity-50"
//                         >
//                           Réessayer les échecs ({failedItems.length})
//                         </button>
//                       )}
//                       <button
//                         onClick={handleClearQueue}
//                         disabled={isLoading || pendingUploads === 0}
//                         className="whitespace-nowrap rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-700 dark:bg-red-800 dark:text-red-200 disabled:opacity-50"
//                       >
//                         Vider la file
//                       </button>
//                       <button
//                         onClick={loadData}
//                         disabled={isLoading}
//                         className="whitespace-nowrap rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-200 disabled:opacity-50"
//                       >
//                         Rafraîchir
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {localCollectes.length > 0 ? (
//                 <div className="mt-4 max-h-60 overflow-y-auto rounded-md border dark:border-gray-700">
//                   <ul className="divide-y divide-gray-200 dark:divide-gray-700">
//                     {localCollectes.map((collecte) => {
//                       // Vérifier que les propriétés nécessaires existent
//                       if (!collecte || typeof collecte.id === 'undefined') {
//                         return null;
//                       }

//                       const isFailed = failedItems.some(item => item.collecteId === collecte.id);
//                       const isPending = !collecte.synced;

//                       return (
//                         <li key={collecte.id} className="relative flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700">
//                           <div className="min-w-0 flex-1">
//                             <div className="flex items-center">
//                               {isFailed ? (
//                                 <AlertTriangleIcon className="mr-2 h-4 w-4 text-red-500" />
//                               ) : isPending ? (
//                                 <ClockIcon className="mr-2 h-4 w-4 text-yellow-500" />
//                               ) : (
//                                 <CheckCircleIcon className="mr-2 h-4 w-4 text-green-500" />
//                               )}
//                               <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
//                                 {formatCollecteName(collecte)}
//                               </p>
//                             </div>
//                             <div className="mt-1">
//                               <p className="text-xs text-gray-500 dark:text-gray-400">
//                                 Créée le {collecte.timestamp ? formatDate(collecte.timestamp) : 'Date inconnue'}
//                               </p>
//                               {isFailed && (
//                                 <p className="mt-1 text-xs text-red-500">
//                                   Échec de synchronisation - Vérifiez la connexion
//                                 </p>
//                               )}
//                               {isPending && !isFailed && (
//                                 <p className="mt-1 text-xs text-yellow-500">
//                                   En attente de synchronisation
//                                 </p>
//                               )}
//                               {!isPending && !isFailed && collecte.syncedAt && (
//                                 <p className="mt-1 text-xs text-green-500">
//                                   Synchronisée le {formatDate(collecte.syncedAt)}
//                                 </p>
//                               )}
//                             </div>
//                           </div>
//                           <button
//                             onClick={() => handleDeleteItem(collecte.id)}
//                             disabled={isLoading}
//                             className="ml-2 rounded-full p-1 text-gray-400 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/30 dark:hover:text-red-300 disabled:opacity-50"
//                             aria-label="Supprimer cette collecte"
//                           >
//                             <Trash2Icon className="h-4 w-4" />
//                           </button>
//                         </li>
//                       );
//                     })}
//                   </ul>
//                 </div>
//               ) : (
//                 <div className="mt-4 rounded-md bg-gray-50 p-4 text-center dark:bg-gray-700">
//                   <p className="text-sm text-gray-600 dark:text-gray-300">
//                     Aucune donnée locale stockée
//                   </p>
//                 </div>
//               )}

//               {/* Instructions d'utilisation */}
//               <div className="mt-4 rounded-md bg-gray-50 p-3 dark:bg-gray-700">
//                 <div className="flex">
//                   <InfoIcon className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
//                   <div className="flex-1">
//                     <h4 className="text-sm font-medium text-gray-900 dark:text-white">
//                       Comprendre le mode hors ligne
//                     </h4>
//                     <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
//                       <p className="mb-1">
//                         • Les <span className="font-medium text-yellow-600 dark:text-yellow-400">collectes en attente</span> sont enregistrées localement et seront envoyées au serveur lorsque vous serez en ligne.
//                       </p>
//                       <p className="mb-1">
//                         • Les <span className="font-medium text-red-600 dark:text-red-400">collectes en échec</span> n'ont pas pu être synchronisées. Réessayez lorsque votre connexion sera stable.
//                       </p>
//                       <p>
//                         • Les <span className="font-medium text-green-600 dark:text-green-400">collectes synchronisées</span> sont déjà sauvegardées sur le serveur.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default OfflineManager;


import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useOfflineStorage } from '@/hooks/useOfflineStorage';
import {
  WifiOffIcon,
  WifiIcon,
  RefreshCcw,
  AlertTriangleIcon,
  CheckCircleIcon,
  CloudOffIcon,
  Database,
  Trash2Icon,
  XCircleIcon,
  ClockIcon,
  InfoIcon
} from 'lucide-react';

interface OfflineManagerProps {
  onSyncComplete?: () => void;
  className?: string;
  showPanel?: boolean;
}

const OfflineManager: React.FC<OfflineManagerProps> = ({
  onSyncComplete,
  className = '',
  showPanel = true
}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localCollectes, setLocalCollectes] = useState([]);
  const [failedItems, setFailedItems] = useState([]);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [dbInitialized, setDbInitialized] = useState(false);

  // Référence pour éviter des opérations multiples
  const loadDataTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const syncInProgressRef = useRef(false);

  const {
    pendingUploads,
    syncData,
    isInitialized,
    isSyncInProgress,
    getAllLocalCollectes,
    getFailedSyncItems,
    retryFailedSyncItems,
    clearSyncQueue,
    deleteLocalCollecte
  } = useOfflineStorage();

  // Surveiller quand la BD est initialisée
  useEffect(() => {
    if (isInitialized) {
      setDbInitialized(true);
      // Charger les données automatiquement une fois la BD initialisée
      if (isOpen) {
        loadData().catch(err => console.error("Erreur lors du chargement initial des données:", err));
      }
    }
  }, [isInitialized, isOpen]);

  // Nettoyer les timeouts lors du démontage
  useEffect(() => {
    return () => {
      if (loadDataTimeoutRef.current) {
        clearTimeout(loadDataTimeoutRef.current);
      }
    };
  }, []);

  // Surveiller les changements de connectivité
  useEffect(() => {
    const handleOnlineStatus = () => {
      const currentlyOnline = navigator.onLine;

      // Ne mettre à jour que si l'état a changé
      if (currentlyOnline !== isOnline) {
        setIsOnline(currentlyOnline);

        if (currentlyOnline) {
          toast.info('Vous êtes de nouveau en ligne. Synchronisation possible.');

          // Tenter de recharger les données après un court délai
          if (dbInitialized && isOpen) {
            if (loadDataTimeoutRef.current) {
              clearTimeout(loadDataTimeoutRef.current);
            }

            loadDataTimeoutRef.current = setTimeout(() => {
              loadData().catch(err => console.error("Erreur lors du rechargement des données:", err));

              // Synchroniser automatiquement après être revenu en ligne
              if (pendingUploads > 0) {
                handleSync();
              }
            }, 1500);
          }
        } else {
          toast.warning('Vous êtes hors ligne. Les données seront sauvegardées localement.');
        }
      }
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, [isOnline, dbInitialized, isOpen, pendingUploads]);

  // Charger les données quand le panneau est ouvert et que la base de données est initialisée
  useEffect(() => {
    if (dbInitialized && isOpen) {
      loadData();
    }
  }, [dbInitialized, isOpen]);

  // Fonction pour charger les données avec gestion améliorée des erreurs
  const loadData = async () => {
    if (!dbInitialized) {
      console.warn('La base de données n\'est pas initialisée, impossible de charger les données');
      return;
    }

    // Éviter les chargements multiples simultanés
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      // Récupérer les collectes locales
      try {
        const collectes = await getAllLocalCollectes();
        setLocalCollectes(collectes || []);
      } catch (error) {
        console.error('Erreur lors du chargement des collectes locales:', error);
        setLocalCollectes([]);
      }

      // Petit délai pour éviter les opérations simultanées sur IndexedDB
      await new Promise(resolve => setTimeout(resolve, 300));

      // Récupérer les items en échec
      try {
        const failed = await getFailedSyncItems();
        setFailedItems(failed || []);
      } catch (error) {
        console.error('Erreur lors du chargement des éléments en échec:', error);
        setFailedItems([]);
      }
    } catch (error) {
      console.error('Erreur globale lors du chargement des données:', error);
      toast.error('Erreur lors du chargement des données locales');
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction de synchronisation améliorée avec protection contre les appels multiples
  const handleSync = async () => {
    if (!isOnline) {
      toast.error('Vous êtes hors ligne. Impossible de synchroniser.');
      return;
    }

    if (!dbInitialized) {
      toast.error('La base de données n\'est pas prête. Veuillez réessayer.');
      return;
    }

    // Éviter les multiples clics
    if (isLoading || isSyncInProgress || syncInProgressRef.current) {
      return;
    }

    syncInProgressRef.current = true;

    try {
      setIsLoading(true);
      toast.loading('Synchronisation en cours...');

      const syncResult = await syncData();
      toast.dismiss();

      if (syncResult > 0) {
        toast.success(`Synchronisation réussie: ${syncResult} collecte(s) synchronisée(s)`);
        setLastSyncTime(new Date());

        // Appeler le callback de synchronisation complète
        if (onSyncComplete) {
          try {
            onSyncComplete();
          } catch (error) {
            console.error("Erreur lors de l'exécution de onSyncComplete:", error);
          }
        }

        // Recharger les données après un délai pour éviter les problèmes de transaction
        if (loadDataTimeoutRef.current) {
          clearTimeout(loadDataTimeoutRef.current);
        }

        loadDataTimeoutRef.current = setTimeout(() => {
          loadData().catch(err => console.error("Erreur lors du chargement des données après synchronisation:", err));
        }, 800);
      } else {
        toast.info('Aucune donnée n\'a été synchronisée');

        // Recharger quand même les données pour s'assurer que l'UI est à jour
        if (loadDataTimeoutRef.current) {
          clearTimeout(loadDataTimeoutRef.current);
        }

        loadDataTimeoutRef.current = setTimeout(() => {
          loadData().catch(err => console.error("Erreur lors du chargement des données:", err));
        }, 500);
      }
    } catch (error) {
      toast.dismiss();
      console.error('Erreur lors de la synchronisation:', error);
      toast.error('Erreur lors de la synchronisation. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
      syncInProgressRef.current = false;
    }
  };

  // Fonction pour réessayer les synchronisations échouées
  const handleRetryFailed = async () => {
    if (!isOnline) {
      toast.error('Vous êtes hors ligne. Impossible de resynchroniser.');
      return;
    }

    // Éviter les multiples clics
    if (isLoading || isSyncInProgress || syncInProgressRef.current) {
      return;
    }

    syncInProgressRef.current = true;

    try {
      setIsLoading(true);
      toast.loading('Réessai des synchronisations échouées...');

      const result = await retryFailedSyncItems();
      toast.dismiss();

      if (result > 0) {
        toast.success(`${result} élément(s) marqué(s) pour resynchronisation`);

        // Lancer la synchronisation après avoir réinitialisé les éléments
        if (isOnline) {
          const syncResult = await syncData();

          if (syncResult > 0) {
            toast.success(`Resynchronisation réussie: ${syncResult} collecte(s) synchronisée(s)`);
            setLastSyncTime(new Date());

            // Appeler le callback de synchronisation complète
            if (onSyncComplete) {
              onSyncComplete();
            }
          } else {
            toast.info('Aucune donnée n\'a été resynchronisée');
          }
        }

        // Recharger les données après un délai
        if (loadDataTimeoutRef.current) {
          clearTimeout(loadDataTimeoutRef.current);
        }

        loadDataTimeoutRef.current = setTimeout(() => {
          loadData().catch(err => console.error("Erreur lors du chargement des données après réessai:", err));
        }, 800);
      } else {
        toast.info('Aucun élément à resynchroniser');
      }
    } catch (error) {
      toast.dismiss();
      console.error('Erreur lors de la resynchronisation:', error);
      toast.error('Erreur lors de la resynchronisation');
    } finally {
      setIsLoading(false);
      syncInProgressRef.current = false;
    }
  };

  // Fonction pour vider la file d'attente de synchronisation
  const handleClearQueue = async () => {
    if (!confirm('Êtes-vous sûr de vouloir vider la file d\'attente de synchronisation ? Cette action ne peut pas être annulée.')) {
      return;
    }

    // Éviter les multiples clics
    if (isLoading) {
      return;
    }

    try {
      setIsLoading(true);
      const result = await clearSyncQueue();

      if (result) {
        toast.success('File d\'attente de synchronisation vidée');
      } else {
        toast.error('Échec du vidage de la file d\'attente');
      }

      // Recharger les données après un court délai
      if (loadDataTimeoutRef.current) {
        clearTimeout(loadDataTimeoutRef.current);
      }

      loadDataTimeoutRef.current = setTimeout(() => {
        loadData().catch(err => {
          console.error('Erreur de chargement après vidage:', err);
        });
      }, 500);
    } catch (error) {
      console.error('Erreur lors du vidage de la file:', error);
      toast.error('Erreur lors du vidage de la file d\'attente');
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour supprimer une collecte locale
  const handleDeleteItem = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette collecte locale ? Cette action ne peut pas être annulée.')) {
      return;
    }

    // Éviter les multiples clics
    if (isLoading) {
      return;
    }

    try {
      setIsLoading(true);
      const result = await deleteLocalCollecte(id);

      if (result) {
        toast.success('Collecte locale supprimée');

        // Mettre à jour l'interface immédiatement
        setLocalCollectes(prev => prev.filter(item => item.id !== id));
      } else {
        toast.error('Échec de la suppression de la collecte');
      }

      // Recharger les données complètes après un court délai
      if (loadDataTimeoutRef.current) {
        clearTimeout(loadDataTimeoutRef.current);
      }

      loadDataTimeoutRef.current = setTimeout(() => {
        loadData().catch(err => {
          console.error('Erreur de chargement après suppression:', err);
        });
      }, 500);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression de la collecte');
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour formater la date
  const formatDate = (timestamp) => {
    try {
      if (!timestamp) return 'Date inconnue';
      return new Date(timestamp).toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      console.error('Erreur de formatage de date:', error, timestamp);
      return 'Date invalide';
    }
  };

  // Fonction pour formater le nom de la collecte
  const formatCollecteName = (collecte) => {
    try {
      if (!collecte) return 'Collecte inconnue';

      const entreprise = collecte.entreprise_id || 'Inconnue';
      const periodeId = collecte.periode_id || 'Inconnue';
      const type = collecte.is_draft ? 'Brouillon' : 'Standard';

      return `Collecte ${type} - Entreprise #${entreprise} - Période #${periodeId}`;
    } catch (error) {
      console.error('Erreur de formatage de nom:', error, collecte);
      return 'Collecte sans nom';
    }
  };

  return (
    <div className={`${className}`}>
      {/* Indicateur de mode hors ligne */}
      <div className="inline-flex items-center gap-2 rounded-lg border p-2 shadow-sm">
        {isOnline ? (
          <span className="flex items-center text-green-700 dark:text-green-400">
            <WifiIcon className="mr-1 h-4 w-4" />
            En ligne
          </span>
        ) : (
          <span className="flex items-center text-yellow-700 dark:text-yellow-400">
            <WifiOffIcon className="mr-1 h-4 w-4" />
            Hors ligne
          </span>
        )}

        {typeof pendingUploads === 'number' && pendingUploads > 0 && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="ml-2 inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-500/30"
          >
            <Database className="mr-1 h-3 w-3" />
            {pendingUploads} en attente
          </button>
        )}

        {isOnline && typeof pendingUploads === 'number' && pendingUploads > 0 && (
          <button
            onClick={handleSync}
            disabled={isSyncInProgress || isLoading || syncInProgressRef.current || !dbInitialized}
            className="ml-1 inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-600/20 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:ring-indigo-500/30 dark:hover:bg-indigo-800/40 disabled:opacity-50"
          >
            <RefreshCcw className={`mr-1 h-3 w-3 ${(isSyncInProgress || isLoading || syncInProgressRef.current) ? 'animate-spin' : ''}`} />
            Synchroniser
          </button>
        )}

        {/* Indicateur de dernière synchronisation */}
        {lastSyncTime && (
          <span className="hidden sm:inline-flex items-center text-xs text-gray-500 dark:text-gray-400 ml-2">
            <ClockIcon className="mr-1 h-3 w-3" />
            Dernière sync: {lastSyncTime.toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* Panel de gestion des données hors ligne */}
      {isOpen && showPanel && (
        <div className="mt-4 rounded-lg border bg-white p-4 shadow dark:bg-gray-800 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Gestionnaire de données hors ligne
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300"
              aria-label="Fermer"
            >
              <XCircleIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Message si la base de données n'est pas initialisée */}
          {!dbInitialized && (
            <div className="mb-4 rounded-md bg-yellow-50 p-3 dark:bg-yellow-900/30">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangleIcon className="h-5 w-5 text-yellow-400 dark:text-yellow-300" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Initialisation du mode hors ligne en cours. Veuillez patienter...
                  </p>
                </div>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-6">
              <ClockIcon className="h-10 w-10 animate-spin text-indigo-500 mb-3" />
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Chargement des données...
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4 rounded-md bg-blue-50 p-3 dark:bg-blue-900/30">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CloudOffIcon className="h-5 w-5 text-blue-400 dark:text-blue-300" />
                  </div>
                  <div className="ml-3 flex-1 md:flex md:justify-between">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      {localCollectes.length} collecte(s) stockée(s) localement, dont {pendingUploads} en attente de synchronisation.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 md:ml-6 md:mt-0">
                      {failedItems.length > 0 && (
                        <button
                          onClick={handleRetryFailed}
                          disabled={!isOnline || isSyncInProgress || isLoading || syncInProgressRef.current}
                          className="whitespace-nowrap rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-800 dark:text-blue-200 disabled:opacity-50"
                        >
                          Réessayer les échecs ({failedItems.length})
                        </button>
                      )}
                      <button
                        onClick={handleClearQueue}
                        disabled={isLoading || pendingUploads === 0}
                        className="whitespace-nowrap rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-700 dark:bg-red-800 dark:text-red-200 disabled:opacity-50"
                      >
                        Vider la file
                      </button>
                      <button
                        onClick={loadData}
                        disabled={isLoading}
                        className="whitespace-nowrap rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-200 disabled:opacity-50"
                      >
                        Rafraîchir
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {localCollectes.length > 0 ? (
                <div className="mt-4 max-h-60 overflow-y-auto rounded-md border dark:border-gray-700">
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {localCollectes.map((collecte) => {
                      // Vérifier que les propriétés nécessaires existent
                      if (!collecte || typeof collecte.id === 'undefined') {
                        return null;
                      }

                      const isFailed = failedItems.some(item => item.collecteId === collecte.id);
                      const isPending = !collecte.synced;

                      return (
                        <li key={collecte.id} className="relative flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center">
                              {isFailed ? (
                                <AlertTriangleIcon className="mr-2 h-4 w-4 text-red-500" />
                              ) : isPending ? (
                                <ClockIcon className="mr-2 h-4 w-4 text-yellow-500" />
                              ) : (
                                <CheckCircleIcon className="mr-2 h-4 w-4 text-green-500" />
                              )}
                              <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                {formatCollecteName(collecte)}
                              </p>
                            </div>
                            <div className="mt-1">
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Créée le {collecte.timestamp ? formatDate(collecte.timestamp) : 'Date inconnue'}
                              </p>
                              {isFailed && (
                                <p className="mt-1 text-xs text-red-500">
                                  Échec de synchronisation - Vérifiez la connexion
                                </p>
                              )}
                              {isPending && !isFailed && (
                                <p className="mt-1 text-xs text-yellow-500">
                                  En attente de synchronisation
                                </p>
                              )}
                              {!isPending && !isFailed && collecte.syncedAt && (
                                <p className="mt-1 text-xs text-green-500">
                                  Synchronisée le {formatDate(collecte.syncedAt)}
                                </p>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteItem(collecte.id)}
                            disabled={isLoading}
                            className="ml-2 rounded-full p-1 text-gray-400 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/30 dark:hover:text-red-300 disabled:opacity-50"
                            aria-label="Supprimer cette collecte"
                          >
                            <Trash2Icon className="h-4 w-4" />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : (
                <div className="mt-4 rounded-md bg-gray-50 p-4 text-center dark:bg-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Aucune donnée locale stockée
                  </p>
                </div>
              )}

              {/* Instructions d'utilisation */}
              <div className="mt-4 rounded-md bg-gray-50 p-3 dark:bg-gray-700">
                <div className="flex">
                  <InfoIcon className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      Comprendre le mode hors ligne
                    </h4>
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <p className="mb-1">
                        • Les <span className="font-medium text-yellow-600 dark:text-yellow-400">collectes en attente</span> sont enregistrées localement et seront envoyées au serveur lorsque vous serez en ligne.
                      </p>
                      <p className="mb-1">
                        • Les <span className="font-medium text-red-600 dark:text-red-400">collectes en échec</span> n'ont pas pu être synchronisées. Réessayez lorsque votre connexion sera stable.
                      </p>
                      <p>
                        • Les <span className="font-medium text-green-600 dark:text-green-400">collectes synchronisées</span> sont déjà sauvegardées sur le serveur.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default OfflineManager;
