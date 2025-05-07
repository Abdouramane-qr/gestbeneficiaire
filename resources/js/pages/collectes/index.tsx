
// import FormulaireExceptionnelButton from '@/components/FormulaireExceptionnelButton';
// import OccasionnelModal from '@/components/OccasionnelModal';
// import { Toaster } from '@/components/ui/sonner';
// import AppLayout from '@/layouts/app-layout';
// import { Beneficiaire } from '@/types';
// import { Head, Link, router } from '@inertiajs/react';
// import {
//     CheckCircleIcon,
//     ChevronsUpDownIcon,
//     FileSpreadsheetIcon,
//     FileTextIcon,
//     FilterIcon,
//     MoonIcon,
//     PencilIcon,
//     PlusIcon,
//     PrinterIcon,
//     SearchIcon,
//     SlidersIcon,
//     SunIcon,
//     TrashIcon,
//     XIcon,
// } from 'lucide-react';
// import { Method } from 'node_modules/@inertiajs/core/types/types';
// import React, { useEffect, useState } from 'react';
// import { toast } from 'sonner';
// import OfflineManager from '@/components/OfflineManager';
// import { useOfflineStorage } from '@/hooks/useOfflineStorage';

// // Types
// interface Collecte {
//     id: number;
//     entreprise: {
//         id: number;
//         nom_entreprise: string;
//     };
//     exercice: {
//         id: number;
//         annee: number;
//     };
//     periode:
//         | {
//               id: number;
//               type_periode: string;
//               nom?: string;
//           }
//         | string; // Peut être un objet ou une chaîne "Occasionnelle"
//     date_collecte: string;
//     type_collecte: string; // 'standard' ou 'brouillon'
//     status?: string;
//     donnees: Record<string, any>;
//     created_at: string;
//     user: {
//         id: number;
//         name: string;
//     };
//     selected?: boolean; // Pour la sélection multiple
//     is_local?: boolean; // Pour les collectes stockées localement
// }

// interface Entreprise {
//     id: number;
//     nom_entreprise: string;
// }

// interface Exercice {
//     id: number;
//     annee: number;
// }

// interface Periode {
//     id: number;
//     type_periode: string;
//     nom?: string;
// }

// interface CollectesPageProps {
//     collectes: {
//         data: Collecte[];
//         links: any[];
//         from: number;
//         to: number;
//         total: number;
//     };
//     entreprises: Entreprise[];
//     exercices: Exercice[];
//     beneficiaires: Beneficiaire[];
//     periodes: Periode[];
//     filters?: Record<string, any>;
//     auth: any;
// }

// const formatDateTime = (dateInput: Date | string | null) => {
//     if (!dateInput) return 'Non définie';

//     const date = dateInput instanceof Date ? dateInput : new Date(dateInput);

//     // Vérification pour une date invalide
//     if (isNaN(date.getTime())) return 'Date invalide';

//     // Ajuster le fuseau horaire au Burkina Faso (Africa/Ouagadougou, UTC+0)
//     const adjustedDate = new Date(date.toLocaleString('en-US', { timeZone: 'Africa/Ouagadougou' }));

//     return new Intl.DateTimeFormat('fr-FR', {
//         day: '2-digit',
//         month: '2-digit',
//         year: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit',
//         hour12: false, // Pour avoir un format 24h
//     }).format(adjustedDate);
// };

// const CollectesIndex = ({ collectes, entreprises, exercices, periodes, filters = {}, beneficiaires = [] }: CollectesPageProps) => {
//     // État pour la gestion des filtres, recherche et sélection
//     const [searchTerm, setSearchTerm] = useState(filters.search || '');
//     const [selectedCollectes, setSelectedCollectes] = useState<number[]>([]);
//     const [showFilters, setShowFilters] = useState(false);
//     const [activeFilters, setActiveFilters] = useState({
//         entreprise_id: filters.entreprise_id || '',
//         exercice_id: filters.exercice_id || '',
//         periode_id: filters.periode_id || '',
//         type_collecte: filters.type_collecte || '',
//         occasionnel: filters.occasionnel || '',
//     });
//     const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
//     const [isProcessing, setIsProcessing] = useState(false);
//     const [visibleColumns] = useState({
//         entreprise: true,
//         exercice: true,
//         periode: true,
//         date: true,
//         status: true,
//         actions: true,
//         user: true,
//         created_at: true,
//     });
//     const [showOccasionnelModal, setShowOccasionnelModal] = useState(false);
//     const [isOnline, setIsOnline] = useState(navigator.onLine);

//     // État pour le mode sombre
//     const [darkMode, setDarkMode] = useState(() => {
//         const savedMode = localStorage.getItem('darkMode');
//         return savedMode !== null ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
//     });

//     // Hook de gestion des données offline
//     const { pendingUploads, getAllLocalCollectes, syncData } = useOfflineStorage();
//     const [localCollectes, setLocalCollectes] = useState<Collecte[]>([]);
//     const [mergedCollectes, setMergedCollectes] = useState<Collecte[]>(collectes.data);

//     // Chargement des collectes locales lors du montage
//     useEffect(() => {
//         if (isOnline) {
//             loadLocalCollectes();
//         }
//     }, []);

//     // Fonction pour charger les collectes stockées localement
//     const loadLocalCollectes = async () => {
//         try {
//             const offlineCollectes = await getAllLocalCollectes();

//             // Conversion des collectes locales au format compatible
//             const formattedLocalCollectes = offlineCollectes.map(local => {
//                 // Rechercher les objets correspondants
//                 const entrepriseObj = entreprises.find(e => e.id === parseInt(local.entreprise_id));
//                 const exerciceObj = exercices.find(e => e.id === parseInt(local.exercice_id));
//                 const periodeObj = periodes.find(p => p.id === parseInt(local.periode_id));

//                 return {
//                     id: local.id,
//                     entreprise: {
//                         id: parseInt(local.entreprise_id),
//                         nom_entreprise: entrepriseObj?.nom_entreprise || `Entreprise #${local.entreprise_id}`
//                     },
//                     exercice: {
//                         id: parseInt(local.exercice_id),
//                         annee: exerciceObj?.annee || new Date().getFullYear()
//                     },
//                     periode: periodeObj || `Période #${local.periode_id}`,
//                     date_collecte: local.date_collecte,
//                     type_collecte: local.is_draft ? 'brouillon' : 'standard',
//                     donnees: local.donnees,
//                     created_at: new Date(local.timestamp).toISOString(),
//                     user: {
//                         id: 0,
//                         name: 'Utilisateur local'
//                     },
//                     is_local: true,
//                     synced: local.synced
//                 };
//             });

//             setLocalCollectes(formattedLocalCollectes);

//             // Fusionner avec les collectes du serveur en excluant les doublons
//             mergeCollectes(collectes.data, formattedLocalCollectes);
//         } catch (error) {
//             console.error('Erreur lors du chargement des collectes locales:', error);
//         }
//     };

//     // Fusionner les collectes du serveur avec les collectes locales non synchronisées
//     const mergeCollectes = (serverCollectes: Collecte[], localCollectes: Collecte[]) => {
//         // Ne garder que les collectes locales non synchronisées
//         const nonSyncedCollectes = localCollectes.filter(local => !local.synced);

//         // Fusionner les deux listes et trier par date de création (plus récente en premier)
//         const mergedItems = [...serverCollectes, ...nonSyncedCollectes].sort((a, b) => {
//             return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
//         });

//         setMergedCollectes(mergedItems);
//     };

//     // Mettre à jour les collectes fusionnées lorsque les collectes du serveur changent
//     useEffect(() => {
//         mergeCollectes(collectes.data, localCollectes);
//     }, [collectes.data, localCollectes]);

//     // Gestion du changement de connectivité
//     useEffect(() => {
//         const handleOnlineStatus = () => {
//             const currentlyOnline = navigator.onLine;

//             // Ne mettre à jour que si l'état a changé
//             if (currentlyOnline !== isOnline) {
//                 setIsOnline(currentlyOnline);

//                 if (currentlyOnline) {
//                     // Tenter de synchroniser automatiquement en revenant en ligne
//                     if (pendingUploads > 0) {
//                         toast.info('Connexion rétablie. Tentative de synchronisation des données locales...');
//                         handleSync();
//                     }
//                 }
//             }
//         };

//         window.addEventListener('online', handleOnlineStatus);
//         window.addEventListener('offline', handleOnlineStatus);

//         return () => {
//             window.removeEventListener('online', handleOnlineStatus);
//             window.removeEventListener('offline', handleOnlineStatus);
//         };
//     }, [isOnline, pendingUploads]);

//     // Sauvegarder la préférence de mode sombre
//     useEffect(() => {
//         localStorage.setItem('darkMode', JSON.stringify(darkMode));
//         if (darkMode) {
//             document.documentElement.classList.add('dark');
//         } else {
//             document.documentElement.classList.remove('dark');
//         }
//     }, [darkMode]);

//     // Fonction pour synchroniser les données
//     const handleSync = async () => {
//         if (!isOnline) {
//             toast.error('Vous êtes hors ligne. Impossible de synchroniser.');
//             return;
//         }

//         try {
//             setIsProcessing(true);
//             toast.loading('Synchronisation en cours...');

//             await syncData();

//             toast.dismiss();
//             toast.success('Synchronisation terminée');

//             // Actualiser la page pour afficher les données synchronisées
//             router.reload();
//         } catch (error) {
//             toast.dismiss();
//             toast.error('Erreur lors de la synchronisation');
//             console.error('Erreur de synchronisation:', error);
//         } finally {
//             setIsProcessing(false);
//         }
//     };

//     // Basculer le mode sombre
//     const toggleDarkMode = () => {
//         setDarkMode(!darkMode);
//     };

//     // Fonction pour appliquer les filtres
//     const applyFilters = () => {
//         type FilterParams = typeof activeFilters & { search?: string };
//         const queryParams: FilterParams = { ...activeFilters };
//         if (searchTerm) queryParams.search = searchTerm;

//         (Object.keys(queryParams) as Array<keyof FilterParams>).forEach((key) => {
//             if (!queryParams[key]) delete queryParams[key];
//         });

//         router.get(route('collectes.index'), queryParams, {
//             preserveState: true,
//             replace: true,
//         });
//     };

//     // Réinitialiser les filtres
//     const resetFilters = () => {
//         setActiveFilters({
//             entreprise_id: '',
//             exercice_id: '',
//             periode_id: '',
//             type_collecte: '',
//             occasionnel: '',
//         });
//         setSearchTerm('');
//         router.get(
//             route('collectes.index'),
//             {},
//             {
//                 preserveState: true,
//                 replace: true,
//             },
//         );
//     };

//     // Toggle la sélection d'une collecte
//     const toggleSelect = (id: number) => {
//         setSelectedCollectes((prev) => {
//             if (prev.includes(id)) {
//                 return prev.filter((item) => item !== id);
//             } else {
//                 return [...prev, id];
//             }
//         });
//     };

//     // Sélectionner toutes les collectes brouillons
//     const selectAllDrafts = () => {
//         const draftIds = mergedCollectes.filter((c) => c.type_collecte === 'brouillon').map((c) => c.id);
//         setSelectedCollectes(draftIds);
//     };

//     // Désélectionner toutes les collectes
//     const deselectAll = () => {
//         setSelectedCollectes([]);
//     };

//     // Gestion de la suppression
//     const handleDelete = (id: number, e: React.MouseEvent, isLocal: boolean = false) => {
//         e.preventDefault();
//         e.stopPropagation();

//         if (confirmDelete === id) {
//             if (isLocal) {
//                 // Pour les collectes locales, utiliser notre hook
//                 deleteLocalCollecte(id);
//             } else {
//                 // Pour les collectes du serveur, utiliser l'API
//                 router.delete(route('collectes.destroy', id), {
//                     onSuccess: () => {
//                         toast.success('Collecte supprimée avec succès');
//                         setConfirmDelete(null);
//                     },
//                     onError: () => {
//                         toast.error('Échec de la suppression de la collecte');
//                         setConfirmDelete(null);
//                     },
//                 });
//             }
//         } else {
//             setConfirmDelete(id);
//             toast.info('Cliquez à nouveau pour confirmer la suppression');

//             setTimeout(() => {
//                 setConfirmDelete(null);
//             }, 3000);
//         }
//     };

//     // Suppression d'une collecte locale
//     const deleteLocalCollecte = async (id: number) => {
//         try {
//             // Importer dynamiquement pour éviter les problèmes de cycles
//             const { useOfflineStorage } = await import('@/hooks/useOfflineStorage');
//             const { deleteLocalCollecte } = useOfflineStorage();

//             await deleteLocalCollecte(id);

//             toast.success('Collecte locale supprimée avec succès');

//             // Mettre à jour la liste des collectes locales
//             loadLocalCollectes();

//             setConfirmDelete(null);
//         } catch (error) {
//             console.error('Erreur lors de la suppression de la collecte locale:', error);
//             toast.error('Échec de la suppression de la collecte locale');
//             setConfirmDelete(null);
//         }
//     };

//     // Valider les collectes sélectionnées
//     const validateSelectedCollectes = () => {
//         // Filtrer pour ne garder que les collectes du serveur
//         const serverCollecteIds = selectedCollectes.filter(
//             id => !mergedCollectes.find(c => c.id === id)?.is_local
//         );

//         if (serverCollecteIds.length === 0) {
//             toast.info('Aucune collecte serveur sélectionnée. Synchronisez d\'abord vos collectes locales.');
//             return;
//         }

//         if (!confirm(`Confirmer la validation de ${serverCollecteIds.length} collecte(s) ?`)) {
//             return;
//         }

//         setIsProcessing(true);

//         router.post(
//             route('collectes.validate-multiple'),
//             { collecte_ids: serverCollecteIds },
//             {
//                 onSuccess: () => {
//                     toast.success(`${serverCollecteIds.length} collecte(s) validée(s) avec succès`);
//                     setSelectedCollectes([]);
//                     setIsProcessing(false);
//                     router.reload();
//                 },
//                 onError: () => {
//                     toast.error('Une erreur est survenue lors de la validation des collectes');
//                     setIsProcessing(false);
//                 },
//             },
//         );
//     };

//     // Supprimer les collectes sélectionnées
//     const deleteSelectedCollectes = () => {
//         if (selectedCollectes.length === 0) {
//             toast.info('Veuillez sélectionner au moins une collecte à supprimer');
//             return;
//         }

//         // Séparer les collectes locales des collectes serveur
//         const localIds = selectedCollectes.filter(
//             id => mergedCollectes.find(c => c.id === id)?.is_local
//         );

//         const serverIds = selectedCollectes.filter(
//             id => !mergedCollectes.find(c => c.id === id)?.is_local
//         );

//         if (!confirm(`Confirmer la suppression de ${selectedCollectes.length} collecte(s) ?`)) {
//             return;
//         }

//         setIsProcessing(true);

//         // Supprimer les collectes locales d'abord
//         if (localIds.length > 0) {
//             Promise.all(localIds.map(id => deleteLocalCollecte(id)))
//                 .then(() => {
//                     // Puis supprimer les collectes du serveur
//                     if (serverIds.length > 0) {
//                         router.post(
//                             route('collectes.delete-multiple'),
//                             { collecte_ids: serverIds },
//                             {
//                                 onSuccess: () => {
//                                     toast.success(`${selectedCollectes.length} collecte(s) supprimée(s) avec succès`);
//                                     setSelectedCollectes([]);
//                                     setIsProcessing(false);
//                                     router.reload();
//                                 },
//                                 onError: () => {
//                                     toast.error('Une erreur est survenue lors de la suppression des collectes du serveur');
//                                     setIsProcessing(false);
//                                     // Recharger les collectes locales au cas où
//                                     loadLocalCollectes();
//                                 },
//                             },
//                         );
//                     } else {
//                         toast.success(`${localIds.length} collecte(s) locale(s) supprimée(s) avec succès`);
//                         setSelectedCollectes([]);
//                         setIsProcessing(false);
//                         loadLocalCollectes();
//                     }
//                 })
//                 .catch(error => {
//                     console.error('Erreur lors de la suppression des collectes locales:', error);
//                     toast.error('Une erreur est survenue lors de la suppression des collectes locales');
//                     setIsProcessing(false);
//                 });
//         } else if (serverIds.length > 0) {
//             // Si pas de collectes locales, supprimer uniquement les collectes du serveur
//             router.post(
//                 route('collectes.delete-multiple'),
//                 { collecte_ids: serverIds },
//                 {
//                     onSuccess: () => {
//                         toast.success(`${serverIds.length} collecte(s) supprimée(s) avec succès`);
//                         setSelectedCollectes([]);
//                         setIsProcessing(false);
//                         router.reload();
//                     },
//                     onError: () => {
//                         toast.error('Une erreur est survenue lors de la suppression des collectes');
//                         setIsProcessing(false);
//                     },
//                 },
//             );
//         }
//     };

//     // Exporter les données
//     const exportData = (format: 'pdf' | 'excel') => {
//         const queryParams = new URLSearchParams();

//         if (activeFilters.entreprise_id) queryParams.append('entreprise_id', activeFilters.entreprise_id);
//         if (activeFilters.exercice_id) queryParams.append('exercice_id', activeFilters.exercice_id);
//         if (activeFilters.periode_id) queryParams.append('periode_id', activeFilters.periode_id);
//         if (activeFilters.type_collecte) queryParams.append('type_collecte', activeFilters.type_collecte);
//         if (activeFilters.occasionnel) queryParams.append('occasionnel', activeFilters.occasionnel);

//         if (searchTerm) queryParams.append('search', searchTerm);
//         if (selectedCollectes.length > 0) {
//             // Ne prendre que les IDs des collectes serveur pour l'export
//             const serverIds = selectedCollectes.filter(
//                 id => !mergedCollectes.find(c => c.id === id)?.is_local
//             );
//             serverIds.forEach((id) => queryParams.append('collecte_ids[]', id.toString()));
//         }
//         queryParams.append('format', format);

//         const baseUrl = route('collectes.export');
//         window.location.href = `${baseUrl}?${queryParams.toString()}`;
//     };

//     // Impression
//     const printCollectes = () => {
//         const printWindow = window.open('', '_blank');
//         if (!printWindow) {
//             toast.error("Impossible d'ouvrir la fenêtre d'impression. Veuillez vérifier vos paramètres de navigateur.");
//             return;
//         }

//         // Filtrer les collectes à imprimer
//         const collectesToPrint = selectedCollectes.length > 0
//             ? mergedCollectes.filter((c) => selectedCollectes.includes(c.id))
//             : mergedCollectes;

//         let printContent = `
//       <html>
//         <head>
//           <title>Liste des collectes</title>
//           <style>
//             body { font-family: Arial, sans-serif; }
//             table { width: 100%; border-collapse: collapse; }
//             th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
//             th { background-color: #f2f2f2; }
//             .header { text-align: center; margin-bottom: 20px; }
//             .draft { color: #d97706; }
//             .standard { color: #059669; }
//             .local { font-style: italic; color: #6366f1; }
//             @media print {
//               .no-print { display: none; }
//               body { margin: 0; padding: 15px; }
//             }
//           </style>
//         </head>
//         <body>
//           <div class="header">
//             <h1>Liste des collectes</h1>
//             <p>Imprimé le ${new Date().toLocaleDateString('fr-FR')}</p>
//             ${pendingUploads > 0 ? `<p style="color: #6366f1;">Attention: ${pendingUploads} collecte(s) en attente de synchronisation</p>` : ''}
//           </div>
//           <table>
//             <thead>
//               <tr>
//                 ${visibleColumns.entreprise ? '<th>Entreprise</th>' : ''}
//                 ${visibleColumns.exercice ? '<th>Exercice</th>' : ''}
//                 ${visibleColumns.periode ? '<th>Période</th>' : ''}
//                 ${visibleColumns.date ? '<th>Date Collecte</th>' : ''}
//                 ${visibleColumns.status ? '<th>Statut</th>' : ''}
//                 ${visibleColumns.user ? '<th>Utilisateur</th>' : ''}
//                 ${visibleColumns.created_at ? '<th>Date de Création</th>' : ''}
//                 <th>Stockage</th>
//               </tr>
//             </thead>
//             <tbody>
//     `;

//         collectesToPrint.forEach((collecte) => {
//             printContent += `<tr ${collecte.is_local ? 'class="local"' : ''}>
//         ${visibleColumns.entreprise ? `<td>${collecte.entreprise.nom_entreprise}</td>` : ''}
//         ${visibleColumns.exercice ? `<td>${collecte.exercice?.annee}</td>` : ''}
//         ${
//             visibleColumns.periode
//                 ? `<td>${
//                       collecte.periode
//                           ? typeof collecte.periode === 'string'
//                               ? collecte.periode === 'Occasionnelle'
//                                   ? 'Occasionnelle'
//                                   : collecte.periode
//                               : collecte.periode.nom || collecte.periode.type_periode
//                           : 'Occasionnelle'
//                   }</td>`
//                 : ''
//         }
//         ${visibleColumns.date ? `<td>${formatDateTime(collecte.date_collecte)}</td>` : ''}
//         ${visibleColumns.status ? `<td class="${collecte.type_collecte === 'brouillon' ? 'draft' : 'standard'}">${collecte.type_collecte === 'brouillon' ? 'Brouillon' : 'Standard'}</td>` : ''}
//         ${visibleColumns.user ? `<td>${collecte.user ? collecte.user.name : 'N/A'}</td>` : ''}
//         ${visibleColumns.created_at ? `<td>${formatDateTime(collecte.created_at)}</td>` : ''}
//         <td>${collecte.is_local ? 'Local' : 'Serveur'}</td>
//       </tr>`;
//         });

//         printContent += `
//             </tbody>
//           </table>
//           <div class="no-print" style="margin-top: 20px; text-align: center;">
//             <button onclick="window.print()">Imprimer</button>
//             <button onclick="window.close()">Fermer</button>
//           </div>
//         </body>
//       </html>
//     `;

//         printWindow.document.open();
//         printWindow.document.write(printContent);
//         printWindow.document.close();
//         printWindow.focus();
//     };

//     // Détermination du nombre de brouillons sélectionnés/disponibles
//     const totalDrafts = mergedCollectes.filter((c) => c.type_collecte === 'brouillon').length;
//     const selectedDrafts =
//         selectedCollectes.length > 0 ? mergedCollectes.filter((c) => selectedCollectes.includes(c.id) && c.type_collecte === 'brouillon').length : 0;

//     // Nombre total de collectes en incluant celles en mémoire locale
//     const totalCollectes = collectes.total + localCollectes.filter(lc => !lc.synced).length;

//     // Nombre de collectes locales en attente
//     const pendingLocalCollectes = localCollectes.filter(c => !c.synced).length;

//     return (
//         <AppLayout title="Liste des collectes">
//             <Head title="Liste des collectes" />
//             <Toaster position="top-right" richColors />
//             <div className={`py-12 transition-colors duration-200 ${darkMode ? 'dark' : ''}`}>
//                 <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
//                     <div className="overflow-hidden bg-white p-6 shadow-lg transition-colors sm:rounded-xl dark:bg-gray-800">
//                         {/* En-tête et actions principales */}
//                         <div className="relative mb-6 flex flex-col gap-4">
//                             <div className="mb-2 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
//                                 <div>
//                                     <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Liste des Collectes</h1>
//                                     <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
//                                         Total: {totalCollectes} collecte(s), dont {totalDrafts} brouillon(s)
//                                         {pendingLocalCollectes > 0 && ` et ${pendingLocalCollectes} en attente de synchronisation`}
//                                     </p>
//                                 </div>

//                                 {/* Bouton de basculement du mode sombre */}
//                                 <button
//                                     onClick={toggleDarkMode}
//                                     className="absolute top-0 right-0 rounded-full bg-gray-100 p-2 text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
//                                     aria-label={darkMode ? 'Activer le mode clair' : 'Activer le mode sombre'}
//                                 >
//                                     {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
//                                 </button>
//                             </div>

//                             {/* Gestionnaire de mode hors ligne */}
//                             <OfflineManager
//                                 className="mb-4"
//                                 onSyncComplete={() => router.reload()}
//                             />

//                             {/* Première ligne : Boutons "Nouvelle Collecte" et "Collecte Occasionnelle" */}
//                             <div className="mb-2 flex flex-wrap gap-2">
//                                 <Link
//                                     href={route('collectes.create')}
//                                     className="inline-flex items-center rounded-lg border-2 border-blue-600 bg-blue-600 px-5 py-3 text-white shadow-md transition hover:bg-blue-700 dark:border-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
//                                 >
//                                     <PlusIcon className="mr-2 h-4 w-4" />
//                                     Nouvelle Collecte
//                                 </Link>

//                                 <FormulaireExceptionnelButton beneficiaires={beneficiaires} exercices={exercices} variant="secondary" />
//                             </div>

//                             {/* Deuxième ligne : Autres boutons */}
//                             <div className="flex flex-col sm:flex-row justify-end items-center mb-4 gap-4">
//                                 <button
//                                     onClick={() => setShowFilters(!showFilters)}
//                                     className="inline-flex items-center rounded-lg border-2 border-gray-300 bg-gray-200 px-5 py-3 text-gray-700 shadow-md transition hover:bg-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
//                                 >
//                                     <FilterIcon className="mr-2 h-4 w-4" />
//                                     {showFilters ? 'Masquer les filtres' : 'Filtres'}
//                                 </button>

//                                 <button
//                                     type="button"
//                                     onClick={() => exportData('excel')}
//                                     className="px-5 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition flex items-center shadow-md"
//                                 >
//                                     <FileSpreadsheetIcon className="w-5 h-5 mr-2" />
//                                     Excel
//                                 </button>

//                                 <button
//                                     onClick={() => exportData('pdf')}
//                                     className="px-5 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition flex items-center shadow-md"
//                                 >
//                                     <FileTextIcon className="w-5 h-5 mr-2" />
//                                     PDF
//                                 </button>

//                                 <button
//                                     onClick={printCollectes}
//                                     className="px-5 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center shadow-md"
//                                 >
//                                     <PrinterIcon className="w-5 h-5 mr-2" />
//                                     Imprimer
//                                 </button>
//                             </div>
//                         </div>

//                         {/* Filtres */}
//                         {showFilters && (
//                             <div className="mb-6 rounded-lg border-2 border-gray-200 bg-gray-50 p-6 shadow-inner dark:border-gray-600 dark:bg-gray-700">
//                                 <div className="mb-4 flex items-center justify-between">
//                                     <h2 className="text-lg font-medium text-gray-800 dark:text-white">Filtres</h2>
//                                     <button
//                                         onClick={resetFilters}
//                                         className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
//                                     >
//                                         Réinitialiser
//                                     </button>
//                                 </div>

//                                 <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
//                                     <div>
//                                         <label
//                                             htmlFor="entreprise_filter"
//                                             className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
//                                         >
//                                             Entreprise
//                                         </label>
//                                         <select
//                                             id="entreprise_filter"
//                                             className="focus:ring-opacity-50 w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-gray-700 shadow-md focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-blue-400 dark:focus:ring-blue-700"
//                                             value={activeFilters.entreprise_id}
//                                             onChange={(e) => setActiveFilters({ ...activeFilters, entreprise_id: e.target.value })}
//                                         >
//                                             <option value="">Toutes les entreprises</option>
//                                             {entreprises.map((entreprise) => (
//                                                 <option key={entreprise.id} value={entreprise.id}>
//                                                     {entreprise.nom_entreprise}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                     </div>

//                                     <div>
//                                         <label htmlFor="exercice_filter" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
//                                             Exercice
//                                         </label>
//                                         <select
//                                             id="exercice_filter"
//                                             className="focus:ring-opacity-50 w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-gray-700 shadow-md focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-blue-400 dark:focus:ring-blue-700"
//                                             value={activeFilters.exercice_id}
//                                             onChange={(e) => setActiveFilters({ ...activeFilters, exercice_id: e.target.value })}
//                                         >
//                                             <option value="">Tous les exercices</option>
//                                             {exercices.map((exercice) => (
//                                                 <option key={exercice.id} value={exercice.id}>
//                                                     {exercice?.annee}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                     </div>

//                                     <div>
//                                         <label htmlFor="periode_filter" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
//                                             Période
//                                         </label>
//                                         <select
//                                             id="periode_filter"
//                                             className="focus:ring-opacity-50 w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-gray-700 shadow-md focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-blue-400 dark:focus:ring-blue-700"
//                                             value={activeFilters.periode_id}
//                                             onChange={(e) => setActiveFilters({ ...activeFilters, periode_id: e.target.value })}
//                                         >
//                                             <option value="">Toutes les périodes</option>
//                                             {periodes.map((periode) => (
//                                                 <option key={periode.id} value={periode.id}>
//                                                     {periode.nom}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                     </div>

//                                     <div>
//                                         <label htmlFor="type_filter" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
//                                             Type
//                                         </label>
//                                         <select
//                                             id="type_filter"
//                                             className="focus:ring-opacity-50 w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-gray-700 shadow-md focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-blue-400 dark:focus:ring-blue-700"
//                                             value={activeFilters.type_collecte}
//                                             onChange={(e) => setActiveFilters({ ...activeFilters, type_collecte: e.target.value })}
//                                         >
//                                             <option value="">Tous les types</option>
//                                             <option value="standard">Standard</option>
//                                             <option value="brouillon">Brouillon</option>
//                                         </select>
//                                     </div>

//                                     <div>
//                                         <label
//                                             htmlFor="occasionnel_filter"
//                                             className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
//                                         >
//                                             Type de collectes
//                                         </label>
//                                         <div className="relative">
//                                             <select
//                                                 id="occasionnel_filter"
//                                                 className="focus:ring-opacity-50 w-full appearance-none rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-gray-700 shadow-md focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-blue-400 dark:focus:ring-blue-700"
//                                                 value={activeFilters.occasionnel || ''}
//                                                 onChange={(e) => setActiveFilters({ ...activeFilters, occasionnel: e.target.value })}
//                                             >
//                                                 <option value="">Tous les types</option>
//                                                 <option value="false">Collectes standard/périodiques</option>
//                                                 <option value="true">Collectes occasionnelles</option>
//                                             </select>
//                                             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
//                                                 <ChevronsUpDownIcon className="h-4 w-4" />
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="mt-4 flex justify-end">
//                                     <button
//                                         onClick={applyFilters}
//                                         className="inline-flex items-center rounded-lg border-2 border-blue-600 bg-blue-600 px-5 py-3 text-white shadow-md hover:bg-blue-700 dark:border-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
//                                     >
//                                         Appliquer les filtres
//                                     </button>
//                                 </div>
//                             </div>
//                         )}

//                         {/* Barre de recherche et actions sur la sélection */}
//                         <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row">
//                             <div className="relative max-w-lg flex-grow">
//                                 <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
//                                     <SearchIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
//                                 </div>
//                                 <input
//                                     type="text"
//                                     placeholder="Rechercher une collecte..."
//                                     className="w-full rounded-lg border-2 p-3 pl-10 shadow-md dark:border-gray-600 dark:bg-gray-700 dark:text-white"
//                                     value={searchTerm}
//                                     onChange={(e) => setSearchTerm(e.target.value)}
//                                     onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
//                                 />
//                             </div>

//                             {selectedCollectes.length > 0 && (
//                                 <div className="flex items-center gap-2">
//                                     <span className="text-sm text-gray-600 dark:text-gray-400">
//                                         {selectedCollectes.length} collecte(s) sélectionnée(s)
//                                         {selectedDrafts > 0 && ` (${selectedDrafts} brouillon(s))`}
//                                     </span>

//                                     {selectedDrafts > 0 && (
//                                         <button
//                                             onClick={validateSelectedCollectes}
//                                             disabled={isProcessing}
//                                             className="inline-flex items-center rounded-lg border-2 border-green-600 bg-green-600 px-4 py-2 text-sm text-white shadow-md hover:bg-green-700 disabled:bg-green-300 dark:border-green-500 dark:bg-green-500 dark:hover:bg-green-600 dark:disabled:bg-green-800"
//                                         >
//                                             <CheckCircleIcon className="mr-1 h-4 w-4" />
//                                             Valider
//                                         </button>
//                                     )}

//                                     <button
//                                         onClick={deleteSelectedCollectes}
//                                         disabled={isProcessing}
//                                         className="inline-flex items-center rounded-lg border-2 border-red-600 bg-red-600 px-4 py-2 text-sm text-white shadow-md hover:bg-red-700 disabled:bg-red-300 dark:border-red-500 dark:bg-red-500 dark:hover:bg-red-600 dark:disabled:bg-red-800"
//                                     >
//                                         <TrashIcon className="mr-1 h-4 w-4" />
//                                         Supprimer
//                                     </button>

//                                     <button
//                                         onClick={deselectAll}
//                                         className="inline-flex items-center rounded-lg border-2 border-gray-300 bg-gray-200 px-4 py-2 text-sm text-gray-700 shadow-md hover:bg-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
//                                     >
//                                         <XIcon className="mr-1 h-4 w-4" />
//                                         Désélectionner
//                                     </button>
//                                 </div>
//                             )}

//                             {selectedCollectes.length === 0 && totalDrafts > 0 && (
//                                 <button
//                                     onClick={selectAllDrafts}
//                                     className="inline-flex items-center rounded-lg border-2 border-amber-200 bg-amber-100 px-4 py-2 text-sm text-amber-800 shadow-md hover:bg-amber-200 dark:border-amber-700 dark:bg-amber-800 dark:text-amber-100 dark:hover:bg-amber-700"
//                                 >
//                                     <CheckCircleIcon className="mr-1 h-4 w-4" />
//                                     Sélectionner tous les brouillons ({totalDrafts})
//                                 </button>
//                             )}

//                             <div className="relative">
//                                 <button
//                                     className="inline-flex items-center rounded-lg border-2 border-gray-300 bg-gray-200 px-4 py-2 text-sm text-gray-700 shadow-md hover:bg-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
//                                     onClick={() => {
//                                         // Toggle dialog pour gérer les colonnes
//                                     }}
//                                 >
//                                     <SlidersIcon className="mr-1 h-4 w-4" />
//                                     Colonnes
//                                 </button>
//                             </div>
//                         </div>

//                         {/* Tableau des collectes */}
//                         {mergedCollectes.length > 0 ? (
//                             <div className="overflow-x-auto rounded-lg border-2 border-gray-200 shadow-lg dark:border-gray-700">
//                                 <table className="w-full min-w-[1200px] divide-y divide-gray-300 dark:divide-gray-600">
//                                     <thead className="bg-gray-50 dark:bg-gray-700">
//                                         <tr>
//                                             <th className="w-10 px-4 py-3">
//                                                 <input
//                                                     type="checkbox"
//                                                     className="focus:ring-opacity-50 rounded-md border-2 border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 dark:border-gray-600 dark:text-blue-500 dark:focus:border-blue-500 dark:focus:ring-blue-700"
//                                                     checked={selectedCollectes.length > 0 && selectedCollectes.length === mergedCollectes.length}
//                                                     onChange={(e) => {
//                                                         if (e.target.checked) {
//                                                             setSelectedCollectes(mergedCollectes.map((c) => c.id));
//                                                         } else {
//                                                             setSelectedCollectes([]);
//                                                         }
//                                                     }}
//                                                 />
//                                             </th>
//                                             {visibleColumns.entreprise && (
//                                                 <th className="w-[15%] px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
//                                                     Entreprise
//                                                 </th>
//                                             )}
//                                             {visibleColumns.exercice && (
//                                                 <th className="w-[10%] px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
//                                                     Exercice
//                                                 </th>
//                                             )}
//                                             {visibleColumns.periode && (
//                                                 <th className="w-[15%] px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
//                                                     Période
//                                                 </th>
//                                             )}
//                                             {visibleColumns.date && (
//                                                 <th className="w-[15%] px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
//                                                     Date Collecte
//                                                 </th>
//                                             )}
//                                             {visibleColumns.status && (
//                                                 <th className="w-[10%] px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
//                                                     Statut
//                                                 </th>
//                                             )}
//                                             {visibleColumns.user && (
//                                                 <th className="w-[15%] px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
//                                                     Utilisateur
//                                                 </th>
//                                             )}
//                                             <th className="w-[5%] px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
//                                                 Stockage
//                                             </th>
//                                             {visibleColumns.actions && (
//                                                 <th className="w-[10%] px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
//                                                     Actions
//                                                 </th>
//                                             )}
//                                         </tr>
//                                     </thead>
//                                     <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
//                                         {mergedCollectes.map((collecte) => (
//                                             <tr
//                                                 key={collecte.id}
//                                                 className={`transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-700 ${
//                                                     selectedCollectes.includes(collecte.id) ? 'bg-blue-50 dark:bg-blue-900/30' : ''
//                                                 } ${
//                                                     collecte.is_local ? 'border-l-4 border-indigo-500 dark:border-indigo-400' : ''
//                                                 }`}
//                                             >
//                                                 <td className="px-4 py-4">
//                                                     <input
//                                                         type="checkbox"
//                                                         className="focus:ring-opacity-50 rounded-md border-2 border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 dark:border-gray-600 dark:text-blue-500 dark:focus:border-blue-500 dark:focus:ring-blue-700"
//                                                         checked={selectedCollectes.includes(collecte.id)}
//                                                         onChange={() => toggleSelect(collecte.id)}
//                                                         onClick={(e) => e.stopPropagation()}
//                                                     />
//                                                 </td>
//                                                 {visibleColumns.entreprise && (
//                                                     <td
//                                                         className="cursor-pointer truncate px-6 py-4 text-gray-900 dark:text-gray-200"
//                                                         onClick={() => !collecte.is_local && router.visit(route('collectes.show', collecte.id))}
//                                                     >
//                                                         {collecte.entreprise.nom_entreprise}
//                                                     </td>
//                                                 )}
//                                                 {visibleColumns.exercice && (
//                                                     <td
//                                                         className="cursor-pointer px-6 py-4 text-gray-900 dark:text-gray-200"
//                                                         onClick={() => !collecte.is_local && router.visit(route('collectes.show', collecte.id))}
//                                                     >
//                                                         {collecte.exercice?.annee}
//                                                     </td>
//                                                 )}
//                                                 {visibleColumns.periode && (
//                                                     <td
//                                                         className="cursor-pointer truncate px-6 py-4 text-gray-900 dark:text-gray-200"
//                                                         onClick={() => !collecte.is_local && router.visit(route('collectes.show', collecte.id))}
//                                                     >
//                                                         {collecte.periode
//                                                             ? typeof collecte.periode === 'string'
//                                                                 ? collecte.periode === 'Exceptionelle' || collecte.periode === 'Occasionnelle'
//                                                                     ? collecte.periode
//                                                                     : collecte.periode
//                                                                 : collecte.periode.nom || collecte.periode.type_periode
//                                                             : 'Occasionnelle'}
//                                                     </td>
//                                                 )}
//                                                 {visibleColumns.date && (
//                                                     <td
//                                                         className="cursor-pointer px-6 py-4 text-gray-900 dark:text-gray-200"
//                                                         onClick={() => !collecte.is_local && router.visit(route('collectes.show', collecte.id))}
//                                                     >
//                                                         {formatDateTime(collecte.created_at)}
//                                                     </td>
//                                                 )}
//                                                 {visibleColumns.status && (
//                                                     <td
//                                                         className="cursor-pointer px-6 py-4"
//                                                         onClick={() => !collecte.is_local && router.visit(route('collectes.show', collecte.id))}
//                                                     >
//                                                         {collecte.type_collecte === 'brouillon' ? (
//                                                             <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900 dark:text-amber-200">
//                                                                 Brouillon
//                                                             </span>
//                                                         ) : (
//                                                             <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
//                                                                 Standard
//                                                             </span>
//                                                         )}
//                                                     </td>
//                                                 )}
//                                                 {visibleColumns.user && (
//                                                     <td
//                                                         className="cursor-pointer truncate px-6 py-4 text-gray-900 dark:text-gray-200"
//                                                         onClick={() => !collecte.is_local && router.visit(route('collectes.show', collecte.id))}
//                                                     >
//                                                         {collecte.user ? collecte.user.name : 'N/A'}
//                                                     </td>
//                                                 )}

//                                                 <td className="px-6 py-4 text-xs">
//                                                     {collecte.is_local ? (
//                                                         <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300">
//                                                             Local
//                                                         </span>
//                                                     ) : (
//                                                         <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
//                                                             Serveur
//                                                         </span>
//                                                     )}
//                                                 </td>

//                                                 {visibleColumns.actions && (
//                                                     <td className="space-x-2 px-6 py-4 text-right">
//                                                         <div className="flex justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
//                                                             {!collecte.is_local && (
//                                                                 <>
//                                                                     <Link
//                                                                         href={route('collectes.show', collecte.id)}
//                                                                         className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
//                                                                         title="Voir"
//                                                                     >
//                                                                         <FileTextIcon className="h-5 w-5" />
//                                                                     </Link>
//                                                                     <Link
//                                                                         href={route('collectes.edit', collecte.id)}
//                                                                         className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
//                                                                         title="Modifier"
//                                                                     >
//                                                                         <PencilIcon className="h-5 w-5" />
//                                                                     </Link>
//                                                                     {collecte.type_collecte === 'brouillon' && (
//                                                                         <Link
//                                                                             href={route('collectes.edit', collecte.id)}
//                                                                             className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
//                                                                             title="Convertir en standard"
//                                                                         >
//                                                                             <CheckCircleIcon className="h-5 w-5" />
//                                                                         </Link>
//                                                                     )}
//                                                                 </>
//                                                             )}
//                                                             <button
//                                                                 onClick={(e) => handleDelete(collecte.id, e, collecte.is_local)}
//                                                                 className={`${
//                                                                     confirmDelete === collecte.id
//                                                                         ? 'text-red-600 dark:text-red-400'
//                                                                         : 'text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400'
//                                                                 }`}
//                                                                 title={confirmDelete === collecte.id ? 'Confirmer la suppression' : 'Supprimer'}
//                                                             >
//                                                                 <TrashIcon className="h-5 w-5" />
//                                                             </button>
//                                                         </div>
//                                                     </td>
//                                                 )}
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         ) : (
//                             <div className="rounded-lg bg-gray-50 py-10 text-center dark:bg-gray-700">
//                                 <FileTextIcon className="mx-auto mb-3 h-12 w-12 text-gray-400 dark:text-gray-500" />
//                                 <h3 className="text-lg font-medium text-gray-900 dark:text-white">Aucune collecte trouvée</h3>
//                                 <p className="mt-1 text-gray-500 dark:text-gray-400">
//                                     {searchTerm || Object.values(activeFilters).some((v) => v)
//                                         ? 'Aucun résultat ne correspond à vos critères de recherche.'
//                                         : 'Commencez par créer une nouvelle collecte.'}
//                                 </p>
//                                 {(searchTerm || Object.values(activeFilters).some((v) => v)) && (
//                                     <button
//                                         onClick={resetFilters}
//                                         className="mt-4 inline-flex items-center rounded-lg border-2 border-transparent bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
//                                     >
//                                         Réinitialiser les filtres
//                                     </button>
//                                 )}
//                             </div>
//                         )}

//                         {/* Pagination */}
//                         {collectes.links && collectes.links.length > 3 && (
//                             <div className="mt-6">
//                                 <nav className="flex items-center justify-between">
//                                     <div className="text-sm text-gray-700 dark:text-gray-300">
//                                         Affichage <span className="font-medium">{collectes.from}</span> à{' '}
//                                         <span className="font-medium">{collectes.to}</span> sur <span className="font-medium">{collectes.total}</span>{' '}
//                                         résultats
//                                         {pendingLocalCollectes > 0 && (
//                                             <span className="ml-2 text-indigo-600 dark:text-indigo-400">
//                                                 + {pendingLocalCollectes} collecte(s) locale(s)
//                                             </span>
//                                         )}
//                                     </div>
//                                     <div className="flex flex-1 justify-end space-x-2">
//                                         {collectes.links.map(
//                                             (
//                                                 link: { url: string | { url: string; method: Method }; active: any; label: any },
//                                                 index: React.Key | null | undefined,
//                                             ) =>
//                                                 link.url && (
//                                                     <Link
//                                                         key={index}
//                                                         href={link.url}
//                                                         className={`relative inline-flex items-center rounded-lg border-2 px-4 py-2 text-sm font-medium ${
//                                                             link.active
//                                                                 ? 'border-blue-500 bg-blue-50 text-blue-600 dark:border-blue-400 dark:bg-blue-900 dark:text-blue-300'
//                                                                 : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
//                                                         }`}
//                                                         dangerouslySetInnerHTML={{ __html: link.label }}
//                                                     />
//                                                 ),
//                                         )}
//                                     </div>
//                                 </nav>
//                             </div>
//                         )}

//                         {/* Modal pour collecte occasionnelle */}
//                         {showOccasionnelModal && (
//                             <OccasionnelModal
//                                 isOpen={showOccasionnelModal}
//                                 closeModal={() => setShowOccasionnelModal(false)}
//                                 exercices={exercices}
//                                 beneficiaires={beneficiaires}
//                             />
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </AppLayout>
//     );
// };

// export default CollectesIndex;

import FormulaireExceptionnelButton from '@/components/FormulaireExceptionnelButton';
import OccasionnelModal from '@/components/OccasionnelModal';
import { Toaster } from '@/components/ui/sonner';
import AppLayout from '@/layouts/app-layout';
import { Beneficiaire } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

import OfflineManager from '@/components/OfflineManager';
import PermissionGuard from '@/components/PermissionGuard';
import { useOfflineStorage } from '@/hooks/useOfflineStorage';
import {
    CheckCircleIcon,
    ChevronsUpDownIcon,
    EyeIcon,
    FileSpreadsheetIcon,
    FileTextIcon,
    FilterIcon,
    MoonIcon,
    PencilIcon,
    PlusIcon,
    PrinterIcon,
    SearchIcon,
    SlidersIcon,
    SunIcon,
    TrashIcon,
    XIcon,
} from 'lucide-react';
import { Method } from 'node_modules/@inertiajs/core/types/types';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

// Types
interface Collecte {
    id: number;
    entreprise: {
        id: number;
        nom_entreprise: string;
    };
    exercice: {
        id: number;
        annee: number;
    };
    periode:
        | {
              id: number;
              type_periode: string;
              nom?: string;
          }
        | string;
    date_collecte: string;
    type_collecte: string;
    status?: string;
    donnees: Record<string, any>;
    created_at: string;
    user: {
        id: number;
        name: string;
    };
    selected?: boolean;
    is_local?: boolean;
}

interface Entreprise {
    id: number;
    nom_entreprise: string;
}

interface Exercice {
    id: number;
    annee: number;
}

interface Periode {
    id: number;
    type_periode: string;
    nom?: string;
}

interface CollectesPageProps {
    collectes: {
        data: Collecte[];
        links: any[];
        from: number;
        to: number;
        total: number;
    };
    entreprises: Entreprise[];
    exercices: Exercice[];
    beneficiaires: Beneficiaire[];
    periodes: Periode[];
    filters?: Record<string, any>;
    auth: any;
}

const formatDateTime = (dateInput: Date | string | null) => {
    if (!dateInput) return 'Non définie';

    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    if (isNaN(date.getTime())) return 'Date invalide';

    const adjustedDate = new Date(date.toLocaleString('en-US', { timeZone: 'Africa/Ouagadougou' }));

    return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).format(adjustedDate);
};

const CollectesIndex = ({ collectes, entreprises, exercices, periodes, filters = {}, beneficiaires = [], auth }: CollectesPageProps) => {
    const { user } = auth;
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedCollectes, setSelectedCollectes] = useState<number[]>([]);
    const [showFilters, setShowFilters] = useState(false);
    const [activeFilters, setActiveFilters] = useState({
        entreprise_id: filters.entreprise_id || '',
        exercice_id: filters.exercice_id || '',
        periode_id: filters.periode_id || '',
        type_collecte: filters.type_collecte || '',
        occasionnel: filters.occasionnel || '',
    });
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [visibleColumns, setVisibleColumns] = useState({
        entreprise: true,
        exercice: true,
        periode: true,
        date: true,
        status: true,
        actions: true,
        user: true,
        created_at: true,
    });
    const [showOccasionnelModal, setShowOccasionnelModal] = useState(false);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [darkMode, setDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode !== null ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    // Gestion des colonnes
    const [isColumnMenuOpen, setIsColumnMenuOpen] = useState(false);
    const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);

    const { pendingUploads, getAllLocalCollectes, syncData, deleteLocalCollecte: removeLocalCollecte } = useOfflineStorage();
    const [localCollectes, setLocalCollectes] = useState<Collecte[]>([]);
    const [mergedCollectes, setMergedCollectes] = useState<Collecte[]>(collectes.data);

    // Charger les collectes locales
    useEffect(() => {
        if (isOnline) {
            loadLocalCollectes();
        }
    }, []);

    const loadLocalCollectes = async () => {
        try {
            const offlineCollectes = await getAllLocalCollectes();
            const formattedLocalCollectes = offlineCollectes.map((local) => {
                const entrepriseObj = entreprises.find((e) => e.id === parseInt(local.entreprise_id));
                const exerciceObj = exercices.find((e) => e.id === parseInt(local.exercice_id));
                const periodeObj = periodes.find((p) => p.id === parseInt(local.periode_id));

                return {
                    id: local.id,
                    entreprise: {
                        id: parseInt(local.entreprise_id),
                        nom_entreprise: entrepriseObj?.nom_entreprise || `Entreprise #${local.entreprise_id}`,
                    },
                    exercice: {
                        id: parseInt(local.exercice_id),
                        annee: exerciceObj?.annee || new Date().getFullYear(),
                    },
                    periode: periodeObj || `Période #${local.periode_id}`,
                    date_collecte: local.date_collecte,
                    type_collecte: local.is_draft ? 'brouillon' : 'standard',
                    donnees: local.donnees,
                    created_at: new Date(local.timestamp).toISOString(),
                    user: {
                        id: 0,
                        name: 'Utilisateur local',
                    },
                    is_local: true,
                    synced: local.synced,
                };
            });

            setLocalCollectes(formattedLocalCollectes);
            mergeCollectes(collectes.data, formattedLocalCollectes);
        } catch (error) {
            console.error('Erreur lors du chargement des collectes locales:', error);
        }
    };

    const mergeCollectes = (serverCollectes: Collecte[], localCollectes: Collecte[]) => {
        const nonSyncedCollectes = localCollectes.filter((local) => !local.synced);
        const mergedItems = [...serverCollectes, ...nonSyncedCollectes].sort((a, b) => {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        setMergedCollectes(mergedItems);
    };

    useEffect(() => {
        mergeCollectes(collectes.data, localCollectes);
    }, [collectes.data, localCollectes]);

    // Gestion de la connectivité
    useEffect(() => {
        const handleOnlineStatus = () => {
            const currentlyOnline = navigator.onLine;
            if (currentlyOnline !== isOnline) {
                setIsOnline(currentlyOnline);
                if (currentlyOnline && pendingUploads > 0) {
                    toast.info('Connexion rétablie. Tentative de synchronisation des données locales...');
                    handleSync();
                }
            }
        };

        window.addEventListener('online', handleOnlineStatus);
        window.addEventListener('offline', handleOnlineStatus);

        return () => {
            window.removeEventListener('online', handleOnlineStatus);
            window.removeEventListener('offline', handleOnlineStatus);
        };
    }, [isOnline, pendingUploads]);

    // Mode sombre
    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    // Fonctions principales
    const toggleColumn = (columnKey: string) => {
        setVisibleColumns((prev) => ({
            ...prev,
            [columnKey]: !prev[columnKey],
        }));
    };

    const handleSync = async () => {
        if (!isOnline) {
            toast.error('Vous êtes hors ligne. Impossible de synchroniser.');
            return;
        }

        try {
            setIsProcessing(true);
            toast.loading('Synchronisation en cours...');
            await syncData();
            toast.dismiss();
            toast.success('Synchronisation terminée');
            router.reload();
        } catch (error) {
            toast.dismiss();
            toast.error('Erreur lors de la synchronisation');
            console.error('Erreur de synchronisation:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const applyFilters = () => {
        type FilterParams = typeof activeFilters & { search?: string };
        const queryParams: FilterParams = { ...activeFilters };
        if (searchTerm) queryParams.search = searchTerm;

        (Object.keys(queryParams) as Array<keyof FilterParams>).forEach((key) => {
            if (!queryParams[key]) delete queryParams[key];
        });

        router.get(route('collectes.index'), queryParams, {
            preserveState: true,
            replace: true,
        });
    };

    const resetFilters = () => {
        setActiveFilters({
            entreprise_id: '',
            exercice_id: '',
            periode_id: '',
            type_collecte: '',
            occasionnel: '',
        });
        setSearchTerm('');
        router.get(route('collectes.index'), {}, { preserveState: true, replace: true });
    };

    const toggleSelect = (id: number) => {
        setSelectedCollectes((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const selectAllDrafts = () => {
        const draftIds = mergedCollectes.filter((c) => c.type_collecte === 'brouillon').map((c) => c.id);
        setSelectedCollectes(draftIds);
    };

    const deselectAll = () => {
        setSelectedCollectes([]);
    };

    const handleDeleteConfirmation = (id: number) => {
        if (confirmDeleteId === id) {
            handleDelete(id, new MouseEvent('click') as unknown as React.MouseEvent, false);
        } else {
            setConfirmDeleteId(id);
            toast.info('Cliquez à nouveau pour confirmer la suppression');
            setTimeout(() => setConfirmDeleteId(null), 3000);
        }
    };

    const handleDelete = (id: number, e: React.MouseEvent, isLocal: boolean = false) => {
        e.preventDefault();
        e.stopPropagation();

        if (isLocal) {
            deleteLocalCollecte(id);
        } else {
            router.delete(route('collectes.destroy', id), {
                onSuccess: () => {
                    toast.success('Collecte supprimée avec succès');
                    setConfirmDeleteId(null);
                },
                onError: () => {
                    toast.error('Échec de la suppression de la collecte');
                    setConfirmDeleteId(null);
                },
            });
        }
    };

    const deleteLocalCollecte = async (id: number) => {
        try {
            await removeLocalCollecte(id);
            toast.success('Collecte locale supprimée avec succès');
            loadLocalCollectes();
            setConfirmDeleteId(null);
        } catch (error) {
            console.error('Erreur lors de la suppression de la collecte locale:', error);
            toast.error('Échec de la suppression de la collecte locale');
            setConfirmDeleteId(null);
        }
    };

    const validateSelectedCollectes = () => {
        const serverCollecteIds = selectedCollectes.filter((id) => !mergedCollectes.find((c) => c.id === id)?.is_local);

        if (serverCollecteIds.length === 0) {
            toast.info("Aucune collecte serveur sélectionnée. Synchronisez d'abord vos collectes locales.");
            return;
        }

        if (!confirm(`Confirmer la validation de ${serverCollecteIds.length} collecte(s) ?`)) {
            return;
        }

        setIsProcessing(true);

        router.post(
            route('collectes.validate-multiple'),
            { collecte_ids: serverCollecteIds },
            {
                onSuccess: () => {
                    toast.success(`${serverCollecteIds.length} collecte(s) validée(s) avec succès`);
                    setSelectedCollectes([]);
                    setIsProcessing(false);
                    router.reload();
                },
                onError: () => {
                    toast.error('Une erreur est survenue lors de la validation des collectes');
                    setIsProcessing(false);
                },
            },
        );
    };

    const deleteSelectedCollectes = () => {
        if (selectedCollectes.length === 0) {
            toast.info('Veuillez sélectionner au moins une collecte à supprimer');
            return;
        }

        const localIds = selectedCollectes.filter((id) => mergedCollectes.find((c) => c.id === id)?.is_local);
        const serverIds = selectedCollectes.filter((id) => !mergedCollectes.find((c) => c.id === id)?.is_local);

        if (!confirm(`Confirmer la suppression de ${selectedCollectes.length} collecte(s) ?`)) {
            return;
        }

        setIsProcessing(true);

        if (localIds.length > 0) {
            Promise.all(localIds.map((id) => deleteLocalCollecte(id)))
                .then(() => {
                    if (serverIds.length > 0) {
                        router.post(
                            route('collectes.delete-multiple'),
                            { collecte_ids: serverIds },
                            {
                                onSuccess: () => {
                                    toast.success(`${selectedCollectes.length} collecte(s) supprimée(s) avec succès`);
                                    setSelectedCollectes([]);
                                    setIsProcessing(false);
                                    router.reload();
                                },
                                onError: () => {
                                    toast.error('Une erreur est survenue lors de la suppression des collectes du serveur');
                                    setIsProcessing(false);
                                    loadLocalCollectes();
                                },
                            },
                        );
                    } else {
                        toast.success(`${localIds.length} collecte(s) locale(s) supprimée(s) avec succès`);
                        setSelectedCollectes([]);
                        setIsProcessing(false);
                        loadLocalCollectes();
                    }
                })
                .catch((error) => {
                    console.error('Erreur lors de la suppression des collectes locales:', error);
                    toast.error('Une erreur est survenue lors de la suppression des collectes locales');
                    setIsProcessing(false);
                });
        } else if (serverIds.length > 0) {
            router.post(
                route('collectes.delete-multiple'),
                { collecte_ids: serverIds },
                {
                    onSuccess: () => {
                        toast.success(`${serverIds.length} collecte(s) supprimée(s) avec succès`);
                        setSelectedCollectes([]);
                        setIsProcessing(false);
                        router.reload();
                    },
                    onError: () => {
                        toast.error('Une erreur est survenue lors de la suppression des collectes');
                        setIsProcessing(false);
                    },
                },
            );
        }
    };

    const exportData = (format: 'pdf' | 'excel') => {
        const queryParams = new URLSearchParams();

        if (activeFilters.entreprise_id) queryParams.append('entreprise_id', activeFilters.entreprise_id);
        if (activeFilters.exercice_id) queryParams.append('exercice_id', activeFilters.exercice_id);
        if (activeFilters.periode_id) queryParams.append('periode_id', activeFilters.periode_id);
        if (activeFilters.type_collecte) queryParams.append('type_collecte', activeFilters.type_collecte);
        if (activeFilters.occasionnel) queryParams.append('occasionnel', activeFilters.occasionnel);

        if (searchTerm) queryParams.append('search', searchTerm);
        if (selectedCollectes.length > 0) {
            const serverIds = selectedCollectes.filter((id) => !mergedCollectes.find((c) => c.id === id)?.is_local);
            serverIds.forEach((id) => queryParams.append('collecte_ids[]', id.toString()));
        }
        queryParams.append('format', format);

        const baseUrl = route('collectes.export');
        window.location.href = `${baseUrl}?${queryParams.toString()}`;
    };

    const printCollectes = () => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            toast.error("Impossible d'ouvrir la fenêtre d'impression. Veuillez vérifier vos paramètres de navigateur.");
            return;
        }

        const collectesToPrint = selectedCollectes.length > 0
            ? mergedCollectes.filter((c) => selectedCollectes.includes(c.id))
            : mergedCollectes;

        let printContent = `
            <html>
                <head>
                    <title>Liste des collectes</title>
                    <style>
                        body { font-family: Arial, sans-serif; }
                        table { width: 100%; border-collapse: collapse; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; }
                        .header { text-align: center; margin-bottom: 20px; }
                        .draft { color: #d97706; }
                        .standard { color: #059669; }
                        .local { font-style: italic; color: #6366f1; }
                        @media print {
                            .no-print { display: none; }
                            body { margin: 0; padding: 15px; }
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>Liste des collectes</h1>
                        <p>Imprimé le ${new Date().toLocaleDateString('fr-FR')}</p>
                        ${pendingUploads > 0 ? `<p style="color: #6366f1;">Attention: ${pendingUploads} collecte(s) en attente de synchronisation</p>` : ''}
                    </div>
                    <table>
                        <thead>
                            <tr>
                                ${visibleColumns.entreprise ? '<th>Entreprise</th>' : ''}
                                ${visibleColumns.exercice ? '<th>Exercice</th>' : ''}
                                ${visibleColumns.periode ? '<th>Période</th>' : ''}
                                ${visibleColumns.date ? '<th>Date Collecte</th>' : ''}
                                ${visibleColumns.status ? '<th>Statut</th>' : ''}
                                ${visibleColumns.user ? '<th>Utilisateur</th>' : ''}
                                ${visibleColumns.created_at ? '<th>Date de Création</th>' : ''}
                                <th>Stockage</th>
                            </tr>
                        </thead>
                        <tbody>
        `;

        collectesToPrint.forEach((collecte) => {
            printContent += `<tr ${collecte.is_local ? 'class="local"' : ''}>
                ${visibleColumns.entreprise ? `<td>${collecte.entreprise.nom_entreprise}</td>` : ''}
                ${visibleColumns.exercice ? `<td>${collecte.exercice?.annee}</td>` : ''}
                ${
                    visibleColumns.periode
                        ? `<td>${
                              collecte.periode
                                  ? typeof collecte.periode === 'string'
                                      ? collecte.periode === 'Occasionnelle'
                                          ? 'Occasionnelle'
                                          : collecte.periode
                                      : collecte.periode.nom || collecte.periode.type_periode
                                  : 'Occasionnelle'
                          }</td>`
                        : ''
                }
                ${visibleColumns.date ? `<td>${formatDateTime(collecte.date_collecte)}</td>` : ''}
                ${visibleColumns.status ? `<td class="${collecte.type_collecte === 'brouillon' ? 'draft' : 'standard'}">${collecte.type_collecte === 'brouillon' ? 'Brouillon' : 'Standard'}</td>` : ''}
                ${visibleColumns.user ? `<td>${collecte.user ? collecte.user.name : 'N/A'}</td>` : ''}
                ${visibleColumns.created_at ? `<td>${formatDateTime(collecte.created_at)}</td>` : ''}
                <td>${collecte.is_local ? 'Local' : 'Serveur'}</td>
            </tr>`;
        });

        printContent += `
                        </tbody>
                    </table>
                    <div class="no-print" style="margin-top: 20px; text-align: center;">
                        <button onclick="window.print()">Imprimer</button>
                        <button onclick="window.close()">Fermer</button>
                    </div>
                </body>
            </html>
        `;

        printWindow.document.open();
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();
    };

    // Calculs pour l'affichage
    const totalDrafts = mergedCollectes.filter((c) => c.type_collecte === 'brouillon').length;
    const selectedDrafts = selectedCollectes.length > 0
        ? mergedCollectes.filter((c) => selectedCollectes.includes(c.id) && c.type_collecte === 'brouillon').length
        : 0;
    const totalCollectes = collectes.total + localCollectes.filter((lc) => !lc.synced).length;
    const pendingLocalCollectes = localCollectes.filter((c) => !c.synced).length;

    return (
        <AppLayout title="Liste des collectes">
            <Head title="Liste des collectes" />
            <Toaster position="top-right" richColors />
            <div className={`py-12 transition-colors duration-200 ${darkMode ? 'dark' : ''}`}>
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white p-6 shadow-lg transition-colors sm:rounded-xl dark:bg-gray-800">
                        {/* En-tête et actions principales */}
                        <div className="relative mb-6 flex flex-col gap-4">
                            <div className="mb-2 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                                <div>
                                    <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Liste des Collectes</h1>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        Total: {totalCollectes} collecte(s), dont {totalDrafts} brouillon(s)
                                        {pendingLocalCollectes > 0 && ` et ${pendingLocalCollectes} en attente de synchronisation`}
                                    </p>
                                </div>

                                <button
                                    onClick={toggleDarkMode}
                                    className="absolute top-0 right-0 rounded-full bg-gray-100 p-2 text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                    aria-label={darkMode ? 'Activer le mode clair' : 'Activer le mode sombre'}
                                >
                                    {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
                                </button>
                            </div>

                            <OfflineManager className="mb-4" onSyncComplete={() => router.reload()} />

                            <div className="mb-2 flex flex-wrap gap-2">
                                <Link
                                    href={route('collectes.create')}
                                    className="inline-flex items-center rounded-lg border-2 border-blue-600 bg-blue-600 px-5 py-3 text-white shadow-md transition hover:bg-blue-700 dark:border-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
                                >
                                    <PlusIcon className="mr-2 h-4 w-4" />
                                    Nouvelle Collecte
                                </Link>

                                <FormulaireExceptionnelButton beneficiaires={beneficiaires} exercices={exercices} variant="secondary" />
                            </div>

                            <div className="mb-4 flex flex-col items-center justify-end gap-4 sm:flex-row">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="inline-flex items-center rounded-lg border-2 border-gray-300 bg-gray-200 px-5 py-3 text-gray-700 shadow-md transition hover:bg-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                >
                                    <FilterIcon className="mr-2 h-4 w-4" />
                                    {showFilters ? 'Masquer les filtres' : 'Filtres'}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => exportData('excel')}
                                    className="flex items-center rounded-md bg-green-600 px-5 py-3 text-white shadow-md transition hover:bg-green-700"
                                >
                                    <FileSpreadsheetIcon className="mr-2 h-5 w-5" />
                                    Excel
                                </button>

                                <button
                                    onClick={() => exportData('pdf')}
                                    className="flex items-center rounded-md bg-red-600 px-5 py-3 text-white shadow-md transition hover:bg-red-700"
                                >
                                    <FileTextIcon className="mr-2 h-5 w-5" />
                                    PDF
                                </button>

                                <button
                                    onClick={printCollectes}
                                    className="flex items-center rounded-md bg-blue-600 px-5 py-3 text-white shadow-md transition hover:bg-blue-700"
                                >
                                    <PrinterIcon className="mr-2 h-5 w-5" />
                                    Imprimer
                                </button>
                            </div>
                        </div>

                        {/* Filtres */}
                        {showFilters && (
                            <div className="mb-6 rounded-lg border-2 border-gray-200 bg-gray-50 p-6 shadow-inner dark:border-gray-600 dark:bg-gray-700">
                                <div className="mb-4 flex items-center justify-between">
                                    <h2 className="text-lg font-medium text-gray-800 dark:text-white">Filtres</h2>
                                    <button
                                        onClick={resetFilters}
                                        className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                        Réinitialiser
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                                    <div>
                                        <label htmlFor="entreprise_filter" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Entreprise
                                        </label>
                                        <select
                                            id="entreprise_filter"
                                            className="focus:ring-opacity-50 w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-gray-700 shadow-md focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-blue-400 dark:focus:ring-blue-700"
                                            value={activeFilters.entreprise_id}
                                            onChange={(e) => setActiveFilters({ ...activeFilters, entreprise_id: e.target.value })}
                                        >
                                            <option value="">Toutes les entreprises</option>
                                            {entreprises.map((entreprise) => (
                                                <option key={entreprise.id} value={entreprise.id}>
                                                    {entreprise.nom_entreprise}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="exercice_filter" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Exercice
                                        </label>
                                        <select
                                            id="exercice_filter"
                                            className="focus:ring-opacity-50 w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-gray-700 shadow-md focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-blue-400 dark:focus:ring-blue-700"
                                            value={activeFilters.exercice_id}
                                            onChange={(e) => setActiveFilters({ ...activeFilters, exercice_id: e.target.value })}
                                        >
                                            <option value="">Tous les exercices</option>
                                            {exercices.map((exercice) => (
                                                <option key={exercice.id} value={exercice.id}>
                                                    {exercice?.annee}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="periode_filter" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Période
                                        </label>
                                        <select
                                            id="periode_filter"
                                            className="focus:ring-opacity-50 w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-gray-700 shadow-md focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-blue-400 dark:focus:ring-blue-700"
                                            value={activeFilters.periode_id}
                                            onChange={(e) => setActiveFilters({ ...activeFilters, periode_id: e.target.value })}
                                        >
                                            <option value="">Toutes les périodes</option>
                                            {periodes.map((periode) => (
                                                <option key={periode.id} value={periode.id}>
                                                    {periode.nom}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="type_filter" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Type
                                        </label>
                                        <select
                                            id="type_filter"
                                            className="focus:ring-opacity-50 w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-gray-700 shadow-md focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-blue-400 dark:focus:ring-blue-700"
                                            value={activeFilters.type_collecte}
                                            onChange={(e) => setActiveFilters({ ...activeFilters, type_collecte: e.target.value })}
                                        >
                                            <option value="">Tous les types</option>
                                            <option value="standard">Standard</option>
                                            <option value="brouillon">Brouillon</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="occasionnel_filter" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Type de collectes
                                        </label>
                                        <div className="relative">
                                            <select
                                                id="occasionnel_filter"
                                                className="focus:ring-opacity-50 w-full appearance-none rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-gray-700 shadow-md focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-blue-400 dark:focus:ring-blue-700"
                                                value={activeFilters.occasionnel || ''}
                                                onChange={(e) => setActiveFilters({ ...activeFilters, occasionnel: e.target.value })}
                                            >
                                                <option value="">Tous les types</option>
                                                <option value="false">Collectes standard/périodiques</option>
                                                <option value="true">Collectes Exceptionnelle</option>
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                                                <ChevronsUpDownIcon className="h-4 w-4" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={applyFilters}
                                        className="inline-flex items-center rounded-lg border-2 border-blue-600 bg-blue-600 px-5 py-3 text-white shadow-md hover:bg-blue-700 dark:border-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
                                    >
                                        Appliquer les filtres
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Barre de recherche et actions sur la sélection */}
                        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row">
                            <div className="relative max-w-lg flex-grow">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <SearchIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Rechercher une collecte..."
                                    className="w-full rounded-lg border-2 p-3 pl-10 shadow-md dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => {
                                            setSearchTerm('');
                                            applyFilters();
                                        }}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                                    >
                                        <XIcon className="h-5 w-5" />
                                    </button>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                {selectedCollectes.length > 0 ? (
                                    <>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {selectedCollectes.length} collecte(s) sélectionnée(s)
                                            {selectedDrafts > 0 && ` (${selectedDrafts} brouillon(s))`}
                                        </span>

                                        <div className="relative">
                                            <button
                                                onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
                                                className="inline-flex items-center rounded-lg border-2 border-gray-300 bg-gray-200 px-4 py-2 text-sm text-gray-700 shadow-md hover:bg-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                            >
                                                Actions
                                                <ChevronsUpDownIcon className="ml-1 h-4 w-4" />
                                            </button>

                                            {isActionMenuOpen && (
                                                <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-700">
                                                    <div className="py-1">
                                                        {selectedDrafts > 0 && (
                                                            <button
                                                                onClick={() => {
                                                                    validateSelectedCollectes();
                                                                    setIsActionMenuOpen(false);
                                                                }}
                                                                disabled={isProcessing}
                                                                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
                                                            >
                                                                <CheckCircleIcon className="mr-2 h-4 w-4" />
                                                                Valider les brouillons
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => {
                                                                deleteSelectedCollectes();
                                                                setIsActionMenuOpen(false);
                                                            }}
                                                            disabled={isProcessing}
                                                            className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-600"
                                                        >
                                                            <TrashIcon className="mr-2 h-4 w-4" />
                                                            Supprimer
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                ) : totalDrafts > 0 ? (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={selectAllDrafts}
                                            className="inline-flex items-center rounded-lg border-2 border-amber-200 bg-amber-100 px-4 py-2 text-sm text-amber-800 shadow-md hover:bg-amber-200 dark:border-amber-700 dark:bg-amber-800 dark:text-amber-100 dark:hover:bg-amber-700"
                                        >
                                            <CheckCircleIcon className="mr-1 h-4 w-4" />
                                            Sélectionner tous les brouillons ({totalDrafts})
                                        </button>
                                        <button
                                            onClick={deselectAll}
                                            className="inline-flex items-center rounded-lg border-2 border-gray-300 bg-gray-200 px-4 py-2 text-sm text-gray-700 shadow-md hover:bg-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                        >
                                            <XIcon className="mr-1 h-4 w-4" />
                                            Tout désélectionner
                                        </button>
                                    </div>
                                ) : null}

                                <div className="relative">
                                    <button
                                        className="inline-flex items-center rounded-lg border-2 border-gray-300 bg-gray-200 px-4 py-2 text-sm text-gray-700 shadow-md hover:bg-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                        onClick={() => setIsColumnMenuOpen(!isColumnMenuOpen)}
                                    >
                                        <SlidersIcon className="mr-1 h-4 w-4" />
                                        Colonnes
                                    </button>
                                    {isColumnMenuOpen && (
                                        <div className="absolute right-0 z-10 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-700">
                                            <div className="py-1">
                                                {Object.entries(visibleColumns).map(([key, value]) => (
                                                    <button
                                                        key={key}
                                                        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
                                                        onClick={() => toggleColumn(key)}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={value}
                                                            onChange={() => {}}
                                                            className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-700 dark:focus:ring-blue-600"
                                                        />
                                                        {key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Tableau des collectes */}
                        {mergedCollectes.length > 0 ? (
                            <div className="overflow-x-auto rounded-lg border-2 border-gray-200 shadow-lg dark:border-gray-700">
                                <table className="w-full min-w-[1200px] divide-y divide-gray-300 dark:divide-gray-600">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="w-10 px-4 py-3">
                                                <input
                                                    type="checkbox"
                                                    className="focus:ring-opacity-50 rounded-md border-2 border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 dark:border-gray-600 dark:text-blue-500 dark:focus:border-blue-500 dark:focus:ring-blue-700"
                                                    checked={selectedCollectes.length > 0 && selectedCollectes.length === mergedCollectes.length}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedCollectes(mergedCollectes.map((c) => c.id));
                                                        } else {
                                                            setSelectedCollectes([]);
                                                        }
                                                    }}
                                                />
                                            </th>
                                            {visibleColumns.entreprise && (
                                                <th className="w-[15%] px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                                    Entreprise
                                                </th>
                                            )}
                                            {visibleColumns.exercice && (
                                                <th className="w-[10%] px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                                    Exercice
                                                </th>
                                            )}
                                            {visibleColumns.periode && (
                                                <th className="w-[15%] px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                                    Période
                                                </th>
                                            )}
                                            {visibleColumns.date && (
                                                <th className="w-[15%] px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                                    Date Collecte
                                                </th>
                                            )}
                                            {visibleColumns.status && (
                                                <th className="w-[10%] px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                                    Statut
                                                </th>
                                            )}
                                            {visibleColumns.user && (
                                                <th className="w-[15%] px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                                    Utilisateur
                                                </th>
                                            )}
                                            <th className="w-[5%] px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                                Stockage
                                            </th>
                                            {visibleColumns.actions && (
                                                <th className="w-[10%] px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                                    Actions
                                                </th>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                                        {mergedCollectes.map((collecte) => (
                                            <tr
                                                key={collecte.id}
                                                className={`transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                                                    selectedCollectes.includes(collecte.id) ? 'bg-blue-50 dark:bg-blue-900/30' : ''
                                                } ${collecte.is_local ? 'border-l-4 border-indigo-500 dark:border-indigo-400' : ''}`}
                                            >
                                                <td className="px-4 py-4">
                                                    <input
                                                        type="checkbox"
                                                        className="focus:ring-opacity-50 rounded-md border-2 border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 dark:border-gray-600 dark:text-blue-500 dark:focus:border-blue-500 dark:focus:ring-blue-700"
                                                        checked={selectedCollectes.includes(collecte.id)}
                                                        onChange={() => toggleSelect(collecte.id)}
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                </td>
                                                {visibleColumns.entreprise && (
                                                    <td
                                                        className="cursor-pointer truncate px-6 py-4 text-gray-900 dark:text-gray-200"
                                                        onClick={() => !collecte.is_local && router.visit(route('collectes.show', collecte.id))}
                                                    >
                                                        {collecte.entreprise.nom_entreprise}
                                                    </td>
                                                )}
                                                {visibleColumns.exercice && (
                                                    <td
                                                        className="cursor-pointer px-6 py-4 text-gray-900 dark:text-gray-200"
                                                        onClick={() => !collecte.is_local && router.visit(route('collectes.show', collecte.id))}
                                                    >
                                                        {collecte.exercice?.annee}
                                                    </td>
                                                )}
                                                {visibleColumns.periode && (
                                                    <td
                                                        className="cursor-pointer truncate px-6 py-4 text-gray-900 dark:text-gray-200"
                                                        onClick={() => !collecte.is_local && router.visit(route('collectes.show', collecte.id))}
                                                    >
                                                        {collecte.periode
                                                            ? typeof collecte.periode === 'string'
                                                                ? collecte.periode === 'Exceptionelle' || collecte.periode === 'Occasionnelle'
                                                                    ? collecte.periode
                                                                    : collecte.periode
                                                                : collecte.periode.nom || collecte.periode.type_periode
                                                            : 'Exceptionelle'}
                                                    </td>
                                                )}
                                                {visibleColumns.date && (
                                                    <td
                                                        className="cursor-pointer px-6 py-4 text-gray-900 dark:text-gray-200"
                                                        onClick={() => !collecte.is_local && router.visit(route('collectes.show', collecte.id))}
                                                    >
                                                        {formatDateTime(collecte.created_at)}
                                                    </td>
                                                )}
                                                {visibleColumns.status && (
                                                    <td
                                                        className="cursor-pointer px-6 py-4"
                                                        onClick={() => !collecte.is_local && router.visit(route('collectes.show', collecte.id))}
                                                    >
                                                        {collecte.type_collecte === 'brouillon' ? (
                                                            <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                                                                Brouillon
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                                                                Standard
                                                            </span>
                                                        )}
                                                    </td>
                                                )}
                                                {visibleColumns.user && (
                                                    <td
                                                        className="cursor-pointer truncate px-6 py-4 text-gray-900 dark:text-gray-200"
                                                        onClick={() => !collecte.is_local && router.visit(route('collectes.show', collecte.id))}
                                                    >
                                                        {collecte.user ? collecte.user.name : 'N/A'}
                                                    </td>
                                                )}

                                                <td className="px-6 py-4 text-xs">
                                                    {collecte.is_local ? (
                                                        <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300">
                                                            Local
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                                                            Serveur
                                                        </span>
                                                    )}
                                                </td>

                                                {visibleColumns.actions && (
                                                    <td className="space-x-2 px-6 py-4 text-right">
                                                        <div className="flex justify-end space-x-2">
                                                            {/* Bouton Voir */}
                                                            <PermissionGuard module="collectes" action="view">
                                                                <Link
                                                                    href={route('collectes.show', collecte.id)}
                                                                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                                                    title="Voir les détails"
                                                                >
                                                                    <EyeIcon className="h-5 w-5" />
                                                                </Link>
                                                            </PermissionGuard>

                                                            {/* Bouton Modifier - Logique complexe intégrée */}
                                                            <PermissionGuard
                                                                module="collectes"
                                                                action="edit"
                                                                fallback={
                                                                    collecte.type_collecte === 'brouillon' && collecte.user.id === user.id ? (
                                                                        <Link
                                                                            href={route('collectes.edit', collecte.id)}
                                                                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                                            title="Modifier (vous êtes le créateur)"
                                                                        >
                                                                            <PencilIcon className="h-5 w-5" />
                                                                        </Link>
                                                                    ) : null
                                                                }
                                                            >
                                                                <Link
                                                                    href={route('collectes.edit', collecte.id)}
                                                                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                                    title="Modifier"
                                                                >
                                                                    <PencilIcon className="h-5 w-5" />
                                                                </Link>
                                                            </PermissionGuard>

                                                            {/* Bouton Valider */}
                                                            {collecte.type_collecte === 'brouillon' && (
                                                                <PermissionGuard module="collectes" action="validate">
                                                                    <Link
                                                                        href={route('collectes.convert-to-standard', collecte.id)}
                                                                        onClick={() => handleDeleteConfirmation(collecte.id)}
                                                                        className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                                                                        title="Valider la collecte"
                                                                        data-confirm="Êtes-vous sûr de vouloir convertir cette collecte en standard?"
                                                                    >
                                                                        <CheckCircleIcon className="h-5 w-5" />
                                                                    </Link>
                                                                </PermissionGuard>
                                                            )}

                                                            {/* Bouton Supprimer */}
                                                            <PermissionGuard module="collectes" action="delete">
                                                                <button
                                                                    onClick={() => handleDeleteConfirmation(collecte.id)}
                                                                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                                                    title="Supprimer"
                                                                >
                                                                    <TrashIcon className="h-5 w-5" />
                                                                </button>
                                                            </PermissionGuard>
                                                        </div>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="rounded-lg bg-gray-50 py-10 text-center dark:bg-gray-700">
                                <FileTextIcon className="mx-auto mb-3 h-12 w-12 text-gray-400 dark:text-gray-500" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Aucune collecte trouvée</h3>
                                <p className="mt-1 text-gray-500 dark:text-gray-400">
                                    {searchTerm || Object.values(activeFilters).some((v) => v)
                                        ? 'Aucun résultat ne correspond à vos critères de recherche.'
                                        : 'Commencez par créer une nouvelle collecte.'}
                                </p>
                                {(searchTerm || Object.values(activeFilters).some((v) => v)) && (
                                    <button
                                        onClick={resetFilters}
                                        className="mt-4 inline-flex items-center rounded-lg border-2 border-transparent bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                                    >
                                        Réinitialiser les filtres
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Pagination */}
                        {collectes.links && collectes.links.length > 3 && (
                            <div className="mt-6">
                                <nav className="flex items-center justify-between">
                                    <div className="text-sm text-gray-700 dark:text-gray-300">
                                        Affichage <span className="font-medium">{collectes.from}</span> à{' '}
                                        <span className="font-medium">{collectes.to}</span> sur <span className="font-medium">{collectes.total}</span>{' '}
                                        résultats
                                        {pendingLocalCollectes > 0 && (
                                            <span className="ml-2 text-indigo-600 dark:text-indigo-400">
                                                + {pendingLocalCollectes} collecte(s) locale(s)
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-1 justify-end space-x-2">
                                        {collectes.links.map(
                                            (
                                                link: { url: string | { url: string; method: Method }; active: any; label: any },
                                                index: React.Key | null | undefined,
                                            ) =>
                                                link.url && (
                                                    <Link
                                                        key={index}
                                                        href={link.url}
                                                        className={`relative inline-flex items-center rounded-lg border-2 px-4 py-2 text-sm font-medium ${
                                                            link.active
                                                                ? 'border-blue-500 bg-blue-50 text-blue-600 dark:border-blue-400 dark:bg-blue-900 dark:text-blue-300'
                                                                : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                                                        }`}
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                ),
                                        )}
                                    </div>
                                </nav>
                            </div>
                        )}

                        {/* Modal pour collecte occasionnelle */}
                        {showOccasionnelModal && (
                            <OccasionnelModal
                                isOpen={showOccasionnelModal}
                                closeModal={() => setShowOccasionnelModal(false)}
                                exercices={exercices}
                                beneficiaires={beneficiaires}
                            />
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default CollectesIndex;
