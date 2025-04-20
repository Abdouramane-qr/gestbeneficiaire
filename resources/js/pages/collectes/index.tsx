// // import React, { useState, useEffect } from 'react';
// // import { Head, router, Link } from '@inertiajs/react';
// // import { toast } from 'sonner';
// // import {
// //   PlusIcon,
// //   PencilIcon,
// //   TrashIcon,
// //   CheckCircleIcon,
// //   FileTextIcon,
// //   FilterIcon,
// //   SearchIcon,
// //   SlidersIcon,
// //   XIcon,
// //   DownloadIcon,
// //   PrinterIcon,
// //   MoonIcon,
// //   SunIcon
// // } from 'lucide-react';
// // import AppLayout from '@/layouts/app-layout';
// // import { Method } from 'node_modules/@inertiajs/core/types/types';

// // // Types
// // interface Collecte {
// //   id: number;
// //   entreprise: {
// //     id: number;
// //     nom_entreprise: string;
// //   };
// //   exercice: {
// //     id: number;
// //     annee: number;
// //   };
// //   periode: {
// //     id: number;
// //     type_periode: string;
// //   };
// //   date_collecte: string;
// //   type_collecte: string; // 'standard' ou 'brouillon'
// //   status?: string;
// //   donnees: Record<string, any>;
// //   created_at: string;
// //   selected?: boolean; // Pour la sélection multiple
// // }

// // interface Entreprise {
// //   id: number;
// //   nom_entreprise: string;
// // }

// // interface Exercice {
// //   id: number;
// //   annee: number;
// // }

// // interface Periode {
// //   id: number;
// //   type_periode: string;
// // }

// // interface CollectesPageProps {
// //   collectes: {
// //     data: Collecte[];
// //     links: any[];
// //     from: number;
// //     to: number;
// //     total: number;
// //   };
// //   entreprises: Entreprise[];
// //   exercices: Exercice[];
// //   periodes: Periode[];
// //   filters?: Record<string, any>;
// //   auth: any;
// // }

// // const formatDate = (dateString) => {
// //   if (!dateString) return '';

// //   const date = new Date(dateString);
// //   return new Intl.DateTimeFormat('fr-FR', {
// //     day: '2-digit',
// //     month: '2-digit',
// //     year: 'numeric'
// //   }).format(date);
// // };

// // const CollectesIndex = ({ collectes, entreprises, exercices, periodes, filters = {} }) => {
// //   // État pour la gestion des filtres, recherche et sélection
// //   const [searchTerm, setSearchTerm] = useState(filters.search || '');
// //   const [selectedCollectes, setSelectedCollectes] = useState<number[]>([]);
// //   const [showFilters, setShowFilters] = useState(false);
// //   const [activeFilters, setActiveFilters] = useState({
// //     entreprise_id: filters.entreprise_id || '',
// //     exercice_id: filters.exercice_id || '',
// //     periode_id: filters.periode_id || '',
// //     type_collecte: filters.type_collecte || ''
// //   });
// //   const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
// //   const [isProcessing, setIsProcessing] = useState(false);
// //   const [visibleColumns, setVisibleColumns] = useState({
// //     entreprise: true,
// //     exercice: true,
// //     periode: true,
// //     date: true,
// //     status: true,
// //     actions: true
// //   });

// //   // État pour le mode sombre
// //   const [darkMode, setDarkMode] = useState(() => {
// //     // Récupérer la préférence de l'utilisateur depuis localStorage ou utiliser la préférence du système
// //     const savedMode = localStorage.getItem('darkMode');
// //     return savedMode !== null ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
// //   });

// //   // Sauvegarder la préférence de mode sombre
// //   useEffect(() => {
// //     localStorage.setItem('darkMode', JSON.stringify(darkMode));
// //     // Appliquer ou supprimer la classe dark sur le document
// //     if (darkMode) {
// //       document.documentElement.classList.add('dark');
// //     } else {
// //       document.documentElement.classList.remove('dark');
// //     }
// //   }, [darkMode]);

// //   // Basculer le mode sombre
// //   const toggleDarkMode = () => {
// //     setDarkMode(!darkMode);
// //   };

// //   // Fonction pour appliquer les filtres
// //   const applyFilters = () => {
// //     const queryParams = { ...activeFilters };
// //     if (searchTerm) queryParams.search = searchTerm;

// //     // Supprimer les filtres vides
// //     Object.keys(queryParams).forEach(key => {
// //       if (!queryParams[key]) delete queryParams[key];
// //     });

// //     router.get(route('collectes.index'), queryParams, {
// //       preserveState: true,
// //       replace: true
// //     });
// //   };

// //   // Réinitialiser les filtres
// //   const resetFilters = () => {
// //     setActiveFilters({
// //       entreprise_id: '',
// //       exercice_id: '',
// //       periode_id: '',
// //       type_collecte: ''
// //     });
// //     setSearchTerm('');
// //     router.get(route('collectes.index'), {}, {
// //       preserveState: true,
// //       replace: true
// //     });
// //   };

// //   // Toggle la sélection d'une collecte
// //   const toggleSelect = (id: number) => {
// //     setSelectedCollectes(prev => {
// //       if (prev.includes(id)) {
// //         return prev.filter(item => item !== id);
// //       } else {
// //         return [...prev, id];
// //       }
// //     });
// //   };

// //   // Sélectionner toutes les collectes brouillons
// //   const selectAllDrafts = () => {
// //     const draftIds = collectes.data
// //       .filter(c => c.type_collecte === 'brouillon')
// //       .map(c => c.id);
// //     setSelectedCollectes(draftIds);
// //   };

// //   // Désélectionner toutes les collectes
// //   const deselectAll = () => {
// //     setSelectedCollectes([]);
// //   };

// //   // Gestion de la suppression
// //   const handleDelete = (id: number, e: React.MouseEvent) => {
// //     e.preventDefault();
// //     e.stopPropagation();

// //     if (confirmDelete === id) {
// //       router.delete(route('collectes.destroy', id), {
// //         onSuccess: () => {
// //           toast.success('Collecte supprimée avec succès');
// //           setConfirmDelete(null);
// //         },
// //         onError: () => {
// //           toast.error("Échec de la suppression de la collecte");
// //           setConfirmDelete(null);
// //         },
// //       });
// //     } else {
// //       setConfirmDelete(id);
// //       toast.info("Cliquez à nouveau pour confirmer la suppression");

// //       setTimeout(() => {
// //         setConfirmDelete(null);
// //       }, 3000);
// //     }
// //   };

// //   // Valider les collectes sélectionnées
// //   const validateSelectedCollectes = () => {
// //     if (selectedCollectes.length === 0) {
// //       toast.info("Veuillez sélectionner au moins une collecte à valider");
// //       return;
// //     }

// //     if (!confirm(`Confirmer la validation de ${selectedCollectes.length} collecte(s) ?`)) {
// //       return;
// //     }

// //     setIsProcessing(true);

// //     router.post(route('collectes.validate-multiple'), { collecte_ids: selectedCollectes }, {
// //       onSuccess: () => {
// //         toast.success(`${selectedCollectes.length} collecte(s) validée(s) avec succès`);
// //         setSelectedCollectes([]);
// //         setIsProcessing(false);
// //         // Rafraîchir la page pour montrer les changements
// //         router.reload();
// //       },
// //       onError: () => {
// //         toast.error("Une erreur est survenue lors de la validation des collectes");
// //         setIsProcessing(false);
// //       }
// //     });
// //   };

// //   // Supprimer les collectes sélectionnées
// //   const deleteSelectedCollectes = () => {
// //     if (selectedCollectes.length === 0) {
// //       toast.info("Veuillez sélectionner au moins une collecte à supprimer");
// //       return;
// //     }

// //     if (!confirm(`Confirmer la suppression de ${selectedCollectes.length} collecte(s) ?`)) {
// //       return;
// //     }

// //     setIsProcessing(true);

// //     // Appel API pour supprimer en masse
// //     router.post(route('collectes.delete-multiple'), { collecte_ids: selectedCollectes }, {
// //       onSuccess: () => {
// //         toast.success(`${selectedCollectes.length} collecte(s) supprimée(s) avec succès`);
// //         setSelectedCollectes([]);
// //         setIsProcessing(false);
// //         router.reload();
// //       },
// //       onError: () => {
// //         toast.error("Une erreur est survenue lors de la suppression des collectes");
// //         setIsProcessing(false);
// //       }
// //     });
// //   };

// //   // Exporter les données
// //   const exportData = (format: 'pdf' | 'excel') => {
// //     const params = {
// //       ...activeFilters,
// //       search: searchTerm,
// //       collecte_ids: selectedCollectes.length > 0 ? selectedCollectes : undefined,
// //       format
// //     };

// //     // Nettoyer les paramètres vides
// //     Object.keys(params).forEach(key => {
// //       if (!params[key]) delete params[key];
// //     });

// //     // Redirection vers le endpoint d'export
// //     window.location.href = route('collectes.export', params);
// //   };

// //   // Impression
// //   const printCollectes = () => {
// //     // Configuration des colonnes pour l'impression
// //     const printWindow = window.open('', '_blank');
// //     if (!printWindow) {
// //       toast.error("Impossible d'ouvrir la fenêtre d'impression. Veuillez vérifier vos paramètres de navigateur.");
// //       return;
// //     }

// //     // Créer le contenu HTML pour l'impression
// //     let printContent = `
// //       <html>
// //         <head>
// //           <title>Liste des collectes</title>
// //           <style>
// //             body { font-family: Arial, sans-serif; }
// //             table { width: 100%; border-collapse: collapse; }
// //             th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
// //             th { background-color: #f2f2f2; }
// //             .header { text-align: center; margin-bottom: 20px; }
// //             .draft { color: #d97706; }
// //             .standard { color: #059669; }
// //             @media print {
// //               .no-print { display: none; }
// //               body { margin: 0; padding: 15px; }
// //             }
// //           </style>
// //         </head>
// //         <body>
// //           <div class="header">
// //             <h1>Liste des collectes</h1>
// //             <p>Imprimé le ${new Date().toLocaleDateString('fr-FR')}</p>
// //           </div>
// //           <table>
// //             <thead>
// //               <tr>
// //                 ${visibleColumns.entreprise ? '<th>Entreprise</th>' : ''}
// //                 ${visibleColumns.exercice ? '<th>Exercice</th>' : ''}
// //                 ${visibleColumns.periode ? '<th>Période</th>' : ''}
// //                 ${visibleColumns.date ? '<th>Date collecte</th>' : ''}
// //                 ${visibleColumns.status ? '<th>Statut</th>' : ''}
// //               </tr>
// //             </thead>
// //             <tbody>
// //     `;

// //     // Ajouter les lignes du tableau
// //     const filteredCollectes = selectedCollectes.length > 0
// //       ? collectes.data.filter(c => selectedCollectes.includes(c.id))
// //       : collectes.data;

// //     filteredCollectes.forEach(collecte => {
// //       printContent += `<tr>
// //         ${visibleColumns.entreprise ? `<td>${collecte.entreprise.nom_entreprise}</td>` : ''}
// //         ${visibleColumns.exercice ? `<td>${collecte.exercice.annee}</td>` : ''}
// //         ${visibleColumns.periode ? `<td>${collecte.periode.type_periode}</td>` : ''}
// //         ${visibleColumns.date ? `<td>${formatDate(collecte.date_collecte)}</td>` : ''}
// //         ${visibleColumns.status ? `<td class="${collecte.type_collecte === 'brouillon' ? 'draft' : 'standard'}">${collecte.type_collecte === 'brouillon' ? 'Brouillon' : 'Standard'}</td>` : ''}
// //       </tr>`;
// //     });

// //     printContent += `
// //             </tbody>
// //           </table>
// //           <div class="no-print" style="margin-top: 20px; text-align: center;">
// //             <button onclick="window.print()">Imprimer</button>
// //             <button onclick="window.close()">Fermer</button>
// //           </div>
// //         </body>
// //       </html>
// //     `;

// //     printWindow.document.open();
// //     printWindow.document.write(printContent);
// //     printWindow.document.close();
// //     printWindow.focus();
// //   };

// //   // Détermination du nombre de brouillons sélectionnés/disponibles
// //   const totalDrafts = collectes.data.filter(c => c.type_collecte === 'brouillon').length;
// //   const selectedDrafts = selectedCollectes.length > 0 ?
// //     collectes.data.filter(c => selectedCollectes.includes(c.id) && c.type_collecte === 'brouillon').length : 0;

// //   return (
// //     <AppLayout title="Liste des collectes">
// //       <Head title="Liste des collectes" />

// //       <div className={`py-12 transition-colors duration-200 ${darkMode ? 'dark' : ''}`}>
// //         <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
// //           <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg sm:rounded-xl p-6 transition-colors">
// //             {/* En-tête et actions principales */}
// //             <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 relative">
// //               <div>
// //                 <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Liste des Collectes</h1>
// //                 <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
// //                   Total: {collectes.total} collecte(s), dont {totalDrafts} brouillon(s)
// //                 </p>
// //               </div>

// //               {/* Bouton de basculement du mode sombre */}
// //               <button
// //                 onClick={toggleDarkMode}
// //                 className="absolute right-0 top-0 p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
// //                 aria-label={darkMode ? "Activer le mode clair" : "Activer le mode sombre"}
// //               >
// //                 {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
// //               </button>

// //               <div className="flex flex-wrap gap-2 mt-8 md:mt-0">
// //                 <Link
// //                   href={route('collectes.create')}
// //                   className="inline-flex items-center px-5 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg border-2 border-blue-600 dark:border-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 transition shadow-md"
// //                 >
// //                   <PlusIcon className="w-4 h-4 mr-2" />
// //                   Nouvelle Collecte
// //                 </Link>

// //                 <button
// //                   onClick={() => setShowFilters(!showFilters)}
// //                   className="inline-flex items-center px-5 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600 transition shadow-md"
// //                 >
// //                   <FilterIcon className="w-4 h-4 mr-2" />
// //                   {showFilters ? 'Masquer les filtres' : 'Filtres'}
// //                 </button>

// //                 <div className="relative">
// //                   <button
// //                     type="button"
// //                     className="inline-flex items-center px-5 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600 transition shadow-md"
// //                     onClick={() => exportData('excel')}
// //                   >
// //                     <DownloadIcon className="w-4 h-4 mr-2" />
// //                     Exporter en Excel
// //                   </button>
// //                 </div>

// //                 <button
// //                   onClick={() => exportData('pdf')}
// //                   className="inline-flex items-center px-5 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600 transition shadow-md"
// //                 >
// //                   <DownloadIcon className="w-4 h-4 mr-2" />
// //                   Exporter en PDF
// //                 </button>

// //                 <button
// //                   onClick={printCollectes}
// //                   className="inline-flex items-center px-5 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600 transition shadow-md"
// //                 >
// //                   <PrinterIcon className="w-4 h-4 mr-2" />
// //                   Imprimer
// //                 </button>
// //               </div>
// //             </div>

// //             {/* Filtres */}
// //             {showFilters && (
// //               <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg mb-6 shadow-inner border-2 border-gray-200 dark:border-gray-600">
// //                 <div className="flex justify-between items-center mb-4">
// //                   <h2 className="text-lg font-medium text-gray-800 dark:text-white">Filtres</h2>
// //                   <button
// //                     onClick={resetFilters}
// //                     className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
// //                   >
// //                     Réinitialiser
// //                   </button>
// //                 </div>

// //                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
// //                   <div>
// //                     <label htmlFor="entreprise_filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
// //                       Entreprise
// //                     </label>
// //                     <select
// //                       id="entreprise_filter"
// //                       className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-md py-3 px-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:border-blue-500 dark:focus:border-blue-400 focus:ring focus:ring-blue-200 dark:focus:ring-blue-700 focus:ring-opacity-50"
// //                       value={activeFilters.entreprise_id}
// //                       onChange={(e) => setActiveFilters({...activeFilters, entreprise_id: e.target.value})}
// //                     >
// //                       <option value="">Toutes les entreprises</option>
// //                       {entreprises.map((entreprise) => (
// //                         <option key={entreprise.id} value={entreprise.id}>
// //                           {entreprise.nom_entreprise}
// //                         </option>
// //                       ))}
// //                     </select>
// //                   </div>

// //                   <div>
// //                     <label htmlFor="exercice_filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
// //                       Exercice
// //                     </label>
// //                     <select
// //                       id="exercice_filter"
// //                       className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-md py-3 px-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:border-blue-500 dark:focus:border-blue-400 focus:ring focus:ring-blue-200 dark:focus:ring-blue-700 focus:ring-opacity-50"
// //                       value={activeFilters.exercice_id}
// //                       onChange={(e) => setActiveFilters({...activeFilters, exercice_id: e.target.value})}
// //                     >
// //                       <option value="">Tous les exercices</option>
// //                       {exercices.map((exercice) => (
// //                         <option key={exercice.id} value={exercice.id}>
// //                           {exercice.annee}
// //                         </option>
// //                       ))}
// //                     </select>
// //                   </div>

// //                   <div>
// //                     <label htmlFor="periode_filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
// //                       Période
// //                     </label>
// //                     <select
// //                       id="periode_filter"
// //                       className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-md py-3 px-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:border-blue-500 dark:focus:border-blue-400 focus:ring focus:ring-blue-200 dark:focus:ring-blue-700 focus:ring-opacity-50"
// //                       value={activeFilters.periode_id}
// //                       onChange={(e) => setActiveFilters({...activeFilters, periode_id: e.target.value})}
// //                     >
// //                       <option value="">Toutes les périodes</option>
// //                       {periodes.map((periode) => (
// //                         <option key={periode.id} value={periode.id}>
// //                           {periode.nom}
// //                         </option>
// //                       ))}
// //                     </select>
// //                   </div>

// //                   <div>
// //                     <label htmlFor="type_filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
// //                       Type
// //                     </label>
// //                     <select
// //                       id="type_filter"
// //                       className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-md py-3 px-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:border-blue-500 dark:focus:border-blue-400 focus:ring focus:ring-blue-200 dark:focus:ring-blue-700 focus:ring-opacity-50"
// //                       value={activeFilters.type_collecte}
// //                       onChange={(e) => setActiveFilters({...activeFilters, type_collecte: e.target.value})}
// //                     >
// //                       <option value="">Tous les types</option>
// //                       <option value="standard">Standard</option>
// //                       <option value="brouillon">Brouillon</option>
// //                     </select>
// //                   </div>
// //                 </div>

// //                 <div className="mt-4 flex justify-end">
// //                   <button
// //                     onClick={applyFilters}
// //                     className="inline-flex items-center px-5 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg border-2 border-blue-600 dark:border-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 shadow-md"
// //                   >
// //                     Appliquer les filtres
// //                   </button>
// //                 </div>
// //               </div>
// //             )}

// //             {/* Barre de recherche et actions sur la sélection */}
// //             <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
// //               <div className="relative flex-grow max-w-lg">
// //                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
// //                   <SearchIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
// //                 </div>
// //                 <input
// //                   type="text"
// //                   placeholder="Rechercher une collecte..."
// //                   className="pl-10 w-full p-3 border-2 rounded-lg shadow-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
// //                   value={searchTerm}
// //                   onChange={(e) => setSearchTerm(e.target.value)}
// //                   onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
// //                 />
// //               </div>

// //               {selectedCollectes.length > 0 && (
// //                 <div className="flex items-center gap-2">
// //                   <span className="text-sm text-gray-600 dark:text-gray-400">
// //                     {selectedCollectes.length} collecte(s) sélectionnée(s)
// //                     {selectedDrafts > 0 && ` (${selectedDrafts} brouillon(s))`}
// //                   </span>

// //                   {selectedDrafts > 0 && (
// //                     <button
// //                       onClick={validateSelectedCollectes}
// //                       disabled={isProcessing}
// //                       className="inline-flex items-center px-4 py-2 bg-green-600 dark:bg-green-500 text-white text-sm rounded-lg border-2 border-green-600 dark:border-green-500 hover:bg-green-700 dark:hover:bg-green-600 disabled:bg-green-300 dark:disabled:bg-green-800 shadow-md"
// //                     >
// //                       <CheckCircleIcon className="w-4 h-4 mr-1" />
// //                       Valider
// //                     </button>
// //                   )}

// //                   <button
// //                     onClick={deleteSelectedCollectes}
// //                     disabled={isProcessing}
// //                     className="inline-flex items-center px-4 py-2 bg-red-600 dark:bg-red-500 text-white text-sm rounded-lg border-2 border-red-600 dark:border-red-500 hover:bg-red-700 dark:hover:bg-red-600 disabled:bg-red-300 dark:disabled:bg-red-800 shadow-md"
// //                   >
// //                     <TrashIcon className="w-4 h-4 mr-1" />
// //                     Supprimer
// //                   </button>

// //                   <button
// //                     onClick={deselectAll}
// //                     className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600 shadow-md"
// //                   >
// //                     <XIcon className="w-4 h-4 mr-1" />
// //                     Désélectionner
// //                   </button>
// //                 </div>
// //               )}

// //               {selectedCollectes.length === 0 && totalDrafts > 0 && (
// //                 <button
// //                   onClick={selectAllDrafts}
// //                   className="inline-flex items-center px-4 py-2 bg-amber-100 dark:bg-amber-800 text-amber-800 dark:text-amber-100 text-sm rounded-lg border-2 border-amber-200 dark:border-amber-700 hover:bg-amber-200 dark:hover:bg-amber-700 shadow-md"
// //                 >
// //                   <CheckCircleIcon className="w-4 h-4 mr-1" />
// //                   Sélectionner tous les brouillons ({totalDrafts})
// //                 </button>
// //               )}

// //               {/* Bouton pour gérer les colonnes visibles */}
// //               <div className="relative">
// //                 <button
// //                   className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600 shadow-md"
// //                   onClick={() => {
// //                     // Toggle dialog pour gérer les colonnes
// //                   }}
// //                 >
// //                   <SlidersIcon className="w-4 h-4 mr-1" />
// //                   Colonnes
// //                 </button>
// //               </div>
// //             </div>

// //             {/* Tableau des collectes */}
// //             {collectes.data.length > 0 ? (
// //               <div className="overflow-x-auto rounded-lg border-2 border-gray-200 dark:border-gray-700 shadow-lg">
// //                 <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-600">
// //                   <thead className="bg-gray-50 dark:bg-gray-700">
// //                     <tr>
// //                       <th className="w-10 px-2 py-3">
// //                         <input
// //                           type="checkbox"
// //                           className="rounded-md border-2 border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-500 shadow-sm focus:border-blue-300 dark:focus:border-blue-500 focus:ring focus:ring-blue-200 dark:focus:ring-blue-700 focus:ring-opacity-50"
// //                           checked={selectedCollectes.length > 0 && selectedCollectes.length === collectes.data.length}
// //                           onChange={(e) => {
// //                             if (e.target.checked) {
// //                               setSelectedCollectes(collectes.data.map(c => c.id));
// //                             } else {
// //                               setSelectedCollectes([]);
// //                             }
// //                           }}
// //                         />
// //                       </th>
// //                       {visibleColumns.entreprise && (
// //                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Entreprise</th>
// //                       )}
// //                       {visibleColumns.exercice && (
// //                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Exercice</th>
// //                       )}
// //                       {visibleColumns.periode && (
// //                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Période</th>
// //                       )}
// //                       {visibleColumns.date && (
// //                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Date Collecte</th>
// //                       )}
// //                       {visibleColumns.status && (
// //                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Statut</th>
// //                       )}
// //                       {visibleColumns.actions && (
// //                         <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
// //                       )}
// //                     </tr>
// //                   </thead>
// //                   <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
// //                     {collectes.data.map((collecte) => (
// //                       <tr
// //                         key={collecte.id}
// //                         className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 ${
// //                           selectedCollectes.includes(collecte.id) ? 'bg-blue-50 dark:bg-blue-900/30' : ''
// //                         }`}
// //                       >
// //                         <td className="px-2 py-4">
// //                           <input
// //                             type="checkbox"
// //                             className="rounded-md border-2 border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-500 shadow-sm focus:border-blue-300 dark:focus:border-blue-500 focus:ring focus:ring-blue-200 dark:focus:ring-blue-700 focus:ring-opacity-50"
// //                             checked={selectedCollectes.includes(collecte.id)}
// //                             onChange={() => toggleSelect(collecte.id)}
// //                             onClick={(e) => e.stopPropagation()}
// //                           />
// //                         </td>
// //                         {visibleColumns.entreprise && (
// //                           <td
// //                             className="px-6 py-4 cursor-pointer text-gray-900 dark:text-gray-200"
// //                             onClick={() => router.visit(route('collectes.show', collecte.id))}
// //                           >
// //                             {collecte.entreprise.nom_entreprise}
// //                           </td>
// //                         )}
// //                         {visibleColumns.exercice && (
// //                           <td
// //                             className="px-6 py-4 cursor-pointer text-gray-900 dark:text-gray-200"
// //                             onClick={() => router.visit(route('collectes.show', collecte.id))}
// //                           >
// //                             {collecte.exercice.annee}
// //                           </td>
// //                         )}
// //                         {visibleColumns.periode && (
// //                           <td
// //                             className="px-6 py-4 cursor-pointer text-gray-900 dark:text-gray-200"
// //                             onClick={() => router.visit(route('collectes.show', collecte.id))}
// //                           >
// //                             {collecte.periode.nom}
// //                           </td>
// //                         )}
// //                         {visibleColumns.date && (
// //                           <td
// //                             className="px-6 py-4 cursor-pointer text-gray-900 dark:text-gray-200"
// //                             onClick={() => router.visit(route('collectes.show', collecte.id))}
// //                           >
// //                             {formatDate(collecte.date_collecte)}
// //                           </td>
// //                         )}
// //                         {visibleColumns.status && (
// //                           <td
// //                             className="px-6 py-4 cursor-pointer"
// //                             onClick={() => router.visit(route('collectes.show', collecte.id))}
// //                           >
// //                             {collecte.type_collecte === 'brouillon' ? (
// //                               <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200">
// //                                 Brouillon
// //                               </span>
// //                             ) : (
// //                               <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
// //                                 Standard
// //                               </span>
// //                             )}
// //                           </td>
// //                         )}
// //                         {visibleColumns.actions && (
// //                           <td className="px-6 py-4 text-right space-x-2">
// //                             <div className="flex space-x-2 justify-end" onClick={e => e.stopPropagation()}>
// //                               <Link
// //                                 href={route('collectes.show', collecte.id)}
// //                                 className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
// //                                 title="Voir"
// //                               >
// //                                 <FileTextIcon className="w-5 h-5" />
// //                               </Link>

// //                               {/* Modifier - visible pour tous */}
// //                               <Link
// //                                 href={route('collectes.edit', collecte.id)}
// //                                 className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
// //                                 title="Modifier"
// //                               >
// //                                 <PencilIcon className="w-5 h-5" />
// //                               </Link>

// //                               {/* Convertir - visible uniquement pour les brouillons */}
// //                               {collecte.type_collecte === 'brouillon' && (
// //                                 <Link
// //                                   href={route('collectes.edit', collecte.id)}
// //                                   className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
// //                                   title="Convertir en standard"
// //                                 >
// //                                   <CheckCircleIcon className="w-5 h-5" />
// //                                 </Link>
// //                               )}

// //                               {/* Supprimer - visible pour tous */}
// //                               <button
// //                                 onClick={(e) => handleDelete(collecte.id, e)}
// //                                 className={`${
// //                                   confirmDelete === collecte.id
// //                                    ? 'text-red-600 dark:text-red-400'
// //                                    : 'text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400'
// //                                 }`}
// //                                 title={confirmDelete === collecte.id ? "Confirmer la suppression" : "Supprimer"}
// //                               >
// //                                 <TrashIcon className="w-5 h-5" />
// //                               </button>
// //                             </div>
// //                           </td>
// //                         )}
// //                       </tr>
// //                     ))}
// //                   </tbody>
// //                 </table>
// //               </div>
// //             ) : (
// //               <div className="text-center py-10 bg-gray-50 dark:bg-gray-700 rounded-lg">
// //                 <FileTextIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
// //                 <h3 className="text-lg font-medium text-gray-900 dark:text-white">Aucune collecte trouvée</h3>
// //                 <p className="mt-1 text-gray-500 dark:text-gray-400">
// //                   {searchTerm || Object.values(activeFilters).some(v => v)
// //                     ? "Aucun résultat ne correspond à vos critères de recherche."
// //                     : "Commencez par créer une nouvelle collecte."}
// //                 </p>
// //                 {(searchTerm || Object.values(activeFilters).some(v => v)) && (
// //                   <button
// //                     onClick={resetFilters}
// //                     className="mt-4 inline-flex items-center px-5 py-3 border-2 border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600"
// //                   >
// //                     Réinitialiser les filtres
// //                   </button>
// //                 )}
// //               </div>
// //             )}

// //             {/* Pagination */}
// //             {collectes.links && collectes.links.length > 3 && (
// //               <div className="mt-6">
// //                 <nav className="flex items-center justify-between">
// //                   <div className="text-sm text-gray-700 dark:text-gray-300">
// //                     Affichage <span className="font-medium">{collectes.from}</span> à{' '}
// //                     <span className="font-medium">{collectes.to}</span> sur{' '}
// //                     <span className="font-medium">{collectes.total}</span> résultats
// //                   </div>
// //                   <div className="flex-1 flex justify-end space-x-2">
// //                     {collectes.links.map((link: { url: string | { url: string; method: Method; }; active: any; label: any; }, index: React.Key | null | undefined) => (
// //                       link.url && (
// //                         <Link
// //                           key={index}
// //                           href={link.url}
// //                           className={`relative inline-flex items-center px-4 py-2 border-2 text-sm font-medium rounded-lg ${
// //                             link.active
// //                               ? 'bg-blue-50 dark:bg-blue-900 border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-300'
// //                               : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
// //                           }`}
// //                           dangerouslySetInnerHTML={{ __html: link.label }}
// //                         />
// //                       )
// //                     ))}
// //                   </div>
// //                 </nav>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     </AppLayout>
// //   );
// // };

// // export default CollectesIndex;
// import React, { useState, useEffect } from 'react';
// import { Head, router, Link } from '@inertiajs/react';
// import { toast } from 'sonner';
// import {
//   PlusIcon,
//   PencilIcon,
//   TrashIcon,
//   CheckCircleIcon,
//   FileTextIcon,
//   FilterIcon,
//   SearchIcon,
//   SlidersIcon,
//   XIcon,
//   DownloadIcon,
//   PrinterIcon,
//   MoonIcon,
//   SunIcon,
//   ChevronsUpDownIcon
// } from 'lucide-react';
// import AppLayout from '@/layouts/app-layout';
// import { Method } from 'node_modules/@inertiajs/core/types/types';
// import OccasionnelModal from '@/components/OccasionnelModal';

// // Types
// interface Collecte {
//   id: number;
//   entreprise: {
//     id: number;
//     nom_entreprise: string;
//   };
//   exercice: {
//     id: number;
//     annee: number;
//   };
//   periode: {
//     id: number;
//     type_periode: string;
//     nom?: string;
//   } | string; // Peut être un objet ou une chaîne "Occasionnelle"
//   date_collecte: string;
//   type_collecte: string; // 'standard' ou 'brouillon'
//   status?: string;
//   donnees: Record<string, any>;
//   created_at: string;
//   selected?: boolean; // Pour la sélection multiple
// }

// interface Entreprise {
//   id: number;
//   nom_entreprise: string;
// }

// interface Exercice {
//   id: number;
//   annee: number;
// }

// interface Periode {
//   id: number;
//   type_periode: string;
//   nom?: string;
// }

// interface CollectesPageProps {
//   collectes: {
//     data: Collecte[];
//     links: any[];
//     from: number;
//     to: number;
//     total: number;
//   };
//   entreprises: Entreprise[];
//   exercices: Exercice[];
//   periodes: Periode[];
//   filters?: Record<string, any>;
//   auth: any;
// }

// const formatDate = (dateString: string | number | Date) => {
//   if (!dateString) return '';

//   const date = new Date(dateString);
//   return new Intl.DateTimeFormat('fr-FR', {
//     day: '2-digit',
//     month: '2-digit',
//     year: 'numeric'
//   }).format(date);
// };

// const CollectesIndex = ({ collectes, entreprises, exercices, periodes, filters = {} }: CollectesPageProps) => {
//   // État pour la gestion des filtres, recherche et sélection
//   const [searchTerm, setSearchTerm] = useState(filters.search || '');
//   const [selectedCollectes, setSelectedCollectes] = useState<number[]>([]);
//   const [showFilters, setShowFilters] = useState(false);
//   const [activeFilters, setActiveFilters] = useState({
//     entreprise_id: filters.entreprise_id || '',
//     exercice_id: filters.exercice_id || '',
//     periode_id: filters.periode_id || '',
//     type_collecte: filters.type_collecte || '',
//     occasionnel: filters.occasionnel || ''
//   });
//   const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [visibleColumns, setVisibleColumns] = useState({
//     entreprise: true,
//     exercice: true,
//     periode: true,
//     date: true,
//     status: true,
//     actions: true
//   });
//   const [showOccasionnelModal, setShowOccasionnelModal] = useState(false);

//   // État pour le mode sombre
//   const [darkMode, setDarkMode] = useState(() => {
//     // Récupérer la préférence de l'utilisateur depuis localStorage ou utiliser la préférence du système
//     const savedMode = localStorage.getItem('darkMode');
//     return savedMode !== null ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
//   });

//   // Sauvegarder la préférence de mode sombre
//   useEffect(() => {
//     localStorage.setItem('darkMode', JSON.stringify(darkMode));
//     // Appliquer ou supprimer la classe dark sur le document
//     if (darkMode) {
//       document.documentElement.classList.add('dark');
//     } else {
//       document.documentElement.classList.remove('dark');
//     }
//   }, [darkMode]);

//   // Basculer le mode sombre
//   const toggleDarkMode = () => {
//     setDarkMode(!darkMode);
//   };

//   // Fonction pour appliquer les filtres
//   const applyFilters = () => {
//     const queryParams = { ...activeFilters };
//     if (searchTerm) queryParams.search = searchTerm;

//     // Supprimer les filtres vides
//     Object.keys(queryParams).forEach(key => {
//       if (!queryParams[key]) delete queryParams[key];
//     });

//     router.get(route('collectes.index'), queryParams, {
//       preserveState: true,
//       replace: true
//     });
//   };

//   // Réinitialiser les filtres
//   const resetFilters = () => {
//     setActiveFilters({
//       entreprise_id: '',
//       exercice_id: '',
//       periode_id: '',
//       type_collecte: '',
//       occasionnel: ''
//     });
//     setSearchTerm('');
//     router.get(route('collectes.index'), {}, {
//       preserveState: true,
//       replace: true
//     });
//   };

//   // Toggle la sélection d'une collecte
//   const toggleSelect = (id: number) => {
//     setSelectedCollectes(prev => {
//       if (prev.includes(id)) {
//         return prev.filter(item => item !== id);
//       } else {
//         return [...prev, id];
//       }
//     });
//   };

//   // Sélectionner toutes les collectes brouillons
//   const selectAllDrafts = () => {
//     const draftIds = collectes.data
//       .filter(c => c.type_collecte === 'brouillon')
//       .map(c => c.id);
//     setSelectedCollectes(draftIds);
//   };

//   // Désélectionner toutes les collectes
//   const deselectAll = () => {
//     setSelectedCollectes([]);
//   };

//   // Gestion de la suppression
//   const handleDelete = (id: number, e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();

//     if (confirmDelete === id) {
//       router.delete(route('collectes.destroy', id), {
//         onSuccess: () => {
//           toast.success('Collecte supprimée avec succès');
//           setConfirmDelete(null);
//         },
//         onError: () => {
//           toast.error("Échec de la suppression de la collecte");
//           setConfirmDelete(null);
//         },
//       });
//     } else {
//       setConfirmDelete(id);
//       toast.info("Cliquez à nouveau pour confirmer la suppression");

//       setTimeout(() => {
//         setConfirmDelete(null);
//       }, 3000);
//     }
//   };

//   // Valider les collectes sélectionnées
//   const validateSelectedCollectes = () => {
//     if (selectedCollectes.length === 0) {
//       toast.info("Veuillez sélectionner au moins une collecte à valider");
//       return;
//     }

//     if (!confirm(`Confirmer la validation de ${selectedCollectes.length} collecte(s) ?`)) {
//       return;
//     }

//     setIsProcessing(true);

//     router.post(route('collectes.validate-multiple'), { collecte_ids: selectedCollectes }, {
//       onSuccess: () => {
//         toast.success(`${selectedCollectes.length} collecte(s) validée(s) avec succès`);
//         setSelectedCollectes([]);
//         setIsProcessing(false);
//         // Rafraîchir la page pour montrer les changements
//         router.reload();
//       },
//       onError: () => {
//         toast.error("Une erreur est survenue lors de la validation des collectes");
//         setIsProcessing(false);
//       }
//     });
//   };

//   // Supprimer les collectes sélectionnées
//   const deleteSelectedCollectes = () => {
//     if (selectedCollectes.length === 0) {
//       toast.info("Veuillez sélectionner au moins une collecte à supprimer");
//       return;
//     }

//     if (!confirm(`Confirmer la suppression de ${selectedCollectes.length} collecte(s) ?`)) {
//       return;
//     }

//     setIsProcessing(true);

//     // Appel API pour supprimer en masse
//     router.post(route('collectes.delete-multiple'), { collecte_ids: selectedCollectes }, {
//       onSuccess: () => {
//         toast.success(`${selectedCollectes.length} collecte(s) supprimée(s) avec succès`);
//         setSelectedCollectes([]);
//         setIsProcessing(false);
//         router.reload();
//       },
//       onError: () => {
//         toast.error("Une erreur est survenue lors de la suppression des collectes");
//         setIsProcessing(false);
//       }
//     });
//   };

//   // Exporter les données
//   const exportData = (format: 'pdf' | 'excel') => {
//     const queryParams = new URLSearchParams();

//     // Ajouter les paramètres actifs
//     if (activeFilters.entreprise_id) queryParams.append('entreprise_id', activeFilters.entreprise_id);
//     if (activeFilters.exercice_id) queryParams.append('exercice_id', activeFilters.exercice_id);
//     if (activeFilters.periode_id) queryParams.append('periode_id', activeFilters.periode_id);
//     if (activeFilters.type_collecte) queryParams.append('type_collecte', activeFilters.type_collecte);
//     if (activeFilters.occasionnel) queryParams.append('occasionnel', activeFilters.occasionnel);

//     // Ajouter les autres paramètres
//     if (searchTerm) queryParams.append('search', searchTerm);
//     if (selectedCollectes.length > 0) {
//       selectedCollectes.forEach(id => queryParams.append('collecte_ids[]', id.toString()));
//     }
//     queryParams.append('format', format);

//     // Construire l'URL complète
//     const baseUrl = route('collectes.export');
//     window.location.href = `${baseUrl}?${queryParams.toString()}`;
//   };

//   // Impression
//   const printCollectes = () => {
//     // Configuration des colonnes pour l'impression
//     const printWindow = window.open('', '_blank');
//     if (!printWindow) {
//       toast.error("Impossible d'ouvrir la fenêtre d'impression. Veuillez vérifier vos paramètres de navigateur.");
//       return;
//     }

//     // Créer le contenu HTML pour l'impression
//     let printContent = `
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
//           </div>
//           <table>
//             <thead>
//               <tr>
//                 ${visibleColumns.entreprise ? '<th>Entreprise</th>' : ''}
//                 ${visibleColumns.exercice ? '<th>Exercice</th>' : ''}
//                 ${visibleColumns.periode ? '<th>Période</th>' : ''}
//                 ${visibleColumns.date ? '<th>Date collecte</th>' : ''}
//                 ${visibleColumns.status ? '<th>Statut</th>' : ''}
//               </tr>
//             </thead>
//             <tbody>
//     `;

//     // Ajouter les lignes du tableau
//     const filteredCollectes = selectedCollectes.length > 0
//       ? collectes.data.filter(c => selectedCollectes.includes(c.id))
//       : collectes.data;

//     filteredCollectes.forEach(collecte => {
//       printContent += `<tr>
//         ${visibleColumns.entreprise ? `<td>${collecte.entreprise.nom_entreprise}</td>` : ''}
//         ${visibleColumns.exercice ? `<td>${collecte.exercice.annee}</td>` : ''}
//         ${visibleColumns.periode ? `<td>${
//           collecte.periode ? (
//             typeof collecte.periode === 'string' ?
//               collecte.periode === 'Occasionnelle' ? 'Occasionnelle' : collecte.periode :
//               collecte.periode.nom || collecte.periode.type_periode
//           ) : (
//             'Occasionnelle'
//           )}</td>` : ''}
//         ${visibleColumns.date ? `<td>${formatDate(collecte.date_collecte)}</td>` : ''}
//         ${visibleColumns.status ? `<td class="${collecte.type_collecte === 'brouillon' ? 'draft' : 'standard'}">${collecte.type_collecte === 'brouillon' ? 'Brouillon' : 'Standard'}</td>` : ''}
//       </tr>`;
//     });

//     printContent += `
//             </tbody>
//           </table>
//           <div class="no-print" style="margin-top: 20px; text-align: center;">
//             <button onclick="window.print()">Imprimer</button>
//             <button onclick="window.close()">Fermer</button>
//           </div>
//         </body>
//       </html>
//     `;

//     printWindow.document.open();
//     printWindow.document.write(printContent);
//     printWindow.document.close();
//     printWindow.focus();
//   };

//   // Détermination du nombre de brouillons sélectionnés/disponibles
//   const totalDrafts = collectes.data.filter(c => c.type_collecte === 'brouillon').length;
//   const selectedDrafts = selectedCollectes.length > 0 ?
//     collectes.data.filter(c => selectedCollectes.includes(c.id) && c.type_collecte === 'brouillon').length : 0;

//   return (
//     <AppLayout title="Liste des collectes">
//       <Head title="Liste des collectes" />

//       <div className={`py-12 transition-colors duration-200 ${darkMode ? 'dark' : ''}`}>
//         <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
//           <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg sm:rounded-xl p-6 transition-colors">
//             {/* En-tête et actions principales */}
//             <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 relative">
//               <div>
//                 <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Liste des Collectes</h1>
//                 <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
//                   Total: {collectes.total} collecte(s), dont {totalDrafts} brouillon(s)
//                 </p>
//               </div>

//               {/* Bouton de basculement du mode sombre */}
//               <button
//                 onClick={toggleDarkMode}
//                 className="absolute right-0 top-0 p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
//                 aria-label={darkMode ? "Activer le mode clair" : "Activer le mode sombre"}
//               >
//                 {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
//               </button>

//               <div className="flex flex-wrap gap-2 mt-8 md:mt-0">
//                 <Link
//                   href={route('collectes.create')}
//                   className="inline-flex items-center px-5 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg border-2 border-blue-600 dark:border-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 transition shadow-md"
//                 >
//                   <PlusIcon className="w-4 h-4 mr-2" />
//                   Nouvelle Collecte
//                 </Link>

//                 <button
//                   onClick={() => setShowOccasionnelModal(true)}
//                   className="inline-flex items-center px-5 py-3 bg-green-600 dark:bg-green-500 text-white rounded-lg border-2 border-green-600 dark:border-green-500 hover:bg-green-700 dark:hover:bg-green-600 transition shadow-md"
//                 >
//                   <PlusIcon className="w-4 h-4 mr-2" />
//                   Collecte Occasionnelle
//                 </button>

//                 <button
//                   onClick={() => setShowFilters(!showFilters)}
//                   className="inline-flex items-center px-5 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600 transition shadow-md"
//                 >
//                   <FilterIcon className="w-4 h-4 mr-2" />
//                   {showFilters ? 'Masquer les filtres' : 'Filtres'}
//                 </button>

//                 <div className="relative">
//                   <button
//                     type="button"
//                     className="inline-flex items-center px-5 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600 transition shadow-md"
//                     onClick={() => exportData('excel')}
//                   >
//                     <DownloadIcon className="w-4 h-4 mr-2" />
//                     Exporter en Excel
//                   </button>
//                 </div>

//                 <button
//                   onClick={() => exportData('pdf')}
//                   className="inline-flex items-center px-5 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600 transition shadow-md"
//                 >
//                   <DownloadIcon className="w-4 h-4 mr-2" />
//                   Exporter en PDF
//                 </button>

//                 <button
//                   onClick={printCollectes}
//                   className="inline-flex items-center px-5 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600 transition shadow-md"
//                 >
//                   <PrinterIcon className="w-4 h-4 mr-2" />
//                   Imprimer
//                 </button>
//               </div>
//             </div>

//             {/* Filtres */}
//             {showFilters && (
//               <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg mb-6 shadow-inner border-2 border-gray-200 dark:border-gray-600">
//                 <div className="flex justify-between items-center mb-4">
//                   <h2 className="text-lg font-medium text-gray-800 dark:text-white">Filtres</h2>
//                   <button
//                     onClick={resetFilters}
//                     className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
//                   >
//                     Réinitialiser
//                   </button>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                   <div>
//                     <label htmlFor="entreprise_filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                       Entreprise
//                     </label>
//                     <select
//                       id="entreprise_filter"
//                       className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-md py-3 px-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:border-blue-500 dark:focus:border-blue-400 focus:ring focus:ring-blue-200 dark:focus:ring-blue-700 focus:ring-opacity-50"
//                       value={activeFilters.entreprise_id}
//                       onChange={(e) => setActiveFilters({...activeFilters, entreprise_id: e.target.value})}
//                     >
//                       <option value="">Toutes les entreprises</option>
//                       {entreprises.map((entreprise) => (
//                         <option key={entreprise.id} value={entreprise.id}>
//                           {entreprise.nom_entreprise}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label htmlFor="exercice_filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                       Exercice
//                     </label>
//                     <select
//                       id="exercice_filter"
//                       className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-md py-3 px-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:border-blue-500 dark:focus:border-blue-400 focus:ring focus:ring-blue-200 dark:focus:ring-blue-700 focus:ring-opacity-50"
//                       value={activeFilters.exercice_id}
//                       onChange={(e) => setActiveFilters({...activeFilters, exercice_id: e.target.value})}
//                     >
//                       <option value="">Tous les exercices</option>
//                       {exercices.map((exercice) => (
//                         <option key={exercice.id} value={exercice.id}>
//                           {exercice.annee}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label htmlFor="periode_filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                       Période
//                     </label>
//                     <select
//                       id="periode_filter"
//                       className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-md py-3 px-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:border-blue-500 dark:focus:border-blue-400 focus:ring focus:ring-blue-200 dark:focus:ring-blue-700 focus:ring-opacity-50"
//                       value={activeFilters.periode_id}
//                       onChange={(e) => setActiveFilters({...activeFilters, periode_id: e.target.value})}
//                     >
//                       <option value="">Toutes les périodes</option>
//                       {periodes.map((periode) => (
//                         <option key={periode.id} value={periode.id}>
//                           {periode.nom}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label htmlFor="type_filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                       Type
//                     </label>
//                     <select
//                       id="type_filter"
//                       className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-md py-3 px-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:border-blue-500 dark:focus:border-blue-400 focus:ring focus:ring-blue-200 dark:focus:ring-blue-700 focus:ring-opacity-50"
//                       value={activeFilters.type_collecte}
//                       onChange={(e) => setActiveFilters({...activeFilters, type_collecte: e.target.value})}
//                     >
//                       <option value="">Tous les types</option>
//                       <option value="standard">Standard</option>
//                       <option value="brouillon">Brouillon</option>
//                     </select>
//                   </div>

//                   <div>
//                     <label htmlFor="occasionnel_filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                       Type de collectes
//                     </label>
//                     <div className="relative">
//                       <select
//                         id="occasionnel_filter"
//                         className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-md py-3 px-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:border-blue-500 dark:focus:border-blue-400 focus:ring focus:ring-blue-200 dark:focus:ring-blue-700 focus:ring-opacity-50 appearance-none"
//                         value={activeFilters.occasionnel || ''}
//                         onChange={(e) => setActiveFilters({...activeFilters, occasionnel: e.target.value})}
//                       >
//                         <option value="">Tous les types</option>
//                         <option value="false">Collectes standard/périodiques</option>
//                         <option value="true">Collectes occasionnelles</option>
//                       </select>
//                       <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
//                         <ChevronsUpDownIcon className="h-4 w-4" />
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="mt-4 flex justify-end">
//                   <button
//                     onClick={applyFilters}
//                     className="inline-flex items-center px-5 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg border-2 border-blue-600 dark:border-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 shadow-md"
//                   >
//                     Appliquer les filtres
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* Barre de recherche et actions sur la sélection */}
//             <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
//               <div className="relative flex-grow max-w-lg">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <SearchIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
//                 </div>
//                 <input
//                   type="text"
//                   placeholder="Rechercher une collecte..."
//                   className="pl-10 w-full p-3 border-2 rounded-lg shadow-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
//                 />
//               </div>

//               {selectedCollectes.length > 0 && (
//                 <div className="flex items-center gap-2">
//                   <span className="text-sm text-gray-600 dark:text-gray-400">
//                     {selectedCollectes.length} collecte(s) sélectionnée(s)
//                     {selectedDrafts > 0 && ` (${selectedDrafts} brouillon(s))`}
//                   </span>

//                   {selectedDrafts > 0 && (
//                     <button
//                       onClick={validateSelectedCollectes}
//                       disabled={isProcessing}
//                       className="inline-flex items-center px-4 py-2 bg-green-600 dark:bg-green-500 text-white text-sm rounded-lg border-2 border-green-600 dark:border-green-500 hover:bg-green-700 dark:hover:bg-green-600 disabled:bg-green-300 dark:disabled:bg-green-800 shadow-md"
//                     >
//                       <CheckCircleIcon className="w-4 h-4 mr-1" />
//                       Valider
//                     </button>
//                   )}

//                   <button
//                     onClick={deleteSelectedCollectes}
//                     disabled={isProcessing}
//                     className="inline-flex items-center px-4 py-2 bg-red-600 dark:bg-red-500 text-white text-sm rounded-lg border-2 border-red-600 dark:border-red-500 hover:bg-red-700 dark:hover:bg-red-600 disabled:bg-red-300 dark:disabled:bg-red-800 shadow-md"
//                   >
//                     <TrashIcon className="w-4 h-4 mr-1" />
//                     Supprimer
//                   </button>

//                   <button
//                     onClick={deselectAll}
//                     className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600 shadow-md"
//                   >
//                     <XIcon className="w-4 h-4 mr-1" />
//                     Désélectionner
//                   </button>
//                 </div>
//               )}

//               {selectedCollectes.length === 0 && totalDrafts > 0 && (
//                 <button
//                   onClick={selectAllDrafts}
//                   className="inline-flex items-center px-4 py-2 bg-amber-100 dark:bg-amber-800 text-amber-800 dark:text-amber-100 text-sm rounded-lg border-2 border-amber-200 dark:border-amber-700 hover:bg-amber-200 dark:hover:bg-amber-700 shadow-md"
//                 >
//                   <CheckCircleIcon className="w-4 h-4 mr-1" />
//                   Sélectionner tous les brouillons ({totalDrafts})
//                 </button>
//               )}

//               {/* Bouton pour gérer les colonnes visibles */}
//               <div className="relative">
//                 <button
//                   className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600 shadow-md"
//                   onClick={() => {
//                     // Toggle dialog pour gérer les colonnes
//                   }}
//                 >
//                   <SlidersIcon className="w-4 h-4 mr-1" />
//                   Colonnes
//                 </button>
//               </div>
//             </div>

//             {/* Tableau des collectes */}
//             {collectes.data.length > 0 ? (
//               <div className="overflow-x-auto rounded-lg border-2 border-gray-200 dark:border-gray-700 shadow-lg">
//                 <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-600">
//                   <thead className="bg-gray-50 dark:bg-gray-700">
//                     <tr>
//                       <th className="w-10 px-2 py-3">
//                         <input
//                           type="checkbox"
//                           className="rounded-md border-2 border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-500 shadow-sm focus:border-blue-300 dark:focus:border-blue-500 focus:ring focus:ring-blue-200 dark:focus:ring-blue-700 focus:ring-opacity-50"
//                           checked={selectedCollectes.length > 0 && selectedCollectes.length === collectes.data.length}
//                           onChange={(e) => {
//                             if (e.target.checked) {
//                               setSelectedCollectes(collectes.data.map(c => c.id));
//                             } else {
//                               setSelectedCollectes([]);
//                             }
//                           }}
//                         />
//                       </th>
//                       {visibleColumns.entreprise && (
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Entreprise</th>
//                       )}
//                       {visibleColumns.exercice && (
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Exercice</th>
//                       )}
//                       {visibleColumns.periode && (
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Période</th>
//                       )}
//                       {visibleColumns.date && (
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Date Collecte</th>
//                       )}
//                       {visibleColumns.status && (
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Statut</th>
//                       )}
//                       {visibleColumns.actions && (
//                         <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
//                       )}
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
//                     {collectes.data.map((collecte) => (
//                       <tr
//                         key={collecte.id}
//                         className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 ${
//                           selectedCollectes.includes(collecte.id) ? 'bg-blue-50 dark:bg-blue-900/30' : ''
//                         }`}
//                       >
//                         <td className="px-2 py-4">
//                           <input
//                             type="checkbox"
//                             className="rounded-md border-2 border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-500 shadow-sm focus:border-blue-300 dark:focus:border-blue-500 focus:ring focus:ring-blue-200 dark:focus:ring-blue-700 focus:ring-opacity-50"
//                             checked={selectedCollectes.includes(collecte.id)}
//                             onChange={() => toggleSelect(collecte.id)}
//                             onClick={(e) => e.stopPropagation()}
//                           />
//                         </td>
//                         {visibleColumns.entreprise && (
//                           <td
//                             className="px-6 py-4 cursor-pointer text-gray-900 dark:text-gray-200"
//                             onClick={() => router.visit(route('collectes.show', collecte.id))}
//                           >
//                             {collecte.entreprise.nom_entreprise}
//                           </td>
//                         )}
//                         {visibleColumns.exercice && (
//                           <td
//                             className="px-6 py-4 cursor-pointer text-gray-900 dark:text-gray-200"
//                             onClick={() => router.visit(route('collectes.show', collecte.id))}
//                           >
//                             {collecte.exercice.annee}
//                           </td>
//                         )}
//                         {visibleColumns.periode && (
//                           <td
//                             className="px-6 py-4 cursor-pointer text-gray-900 dark:text-gray-200"
//                             onClick={() => router.visit(route('collectes.show', collecte.id))}
//                           >
//                             {collecte.periode ? (
//                               typeof collecte.periode === 'string' ?
//                                 collecte.periode === 'Occasionnelle' ? 'Occasionnelle' : collecte.periode :
//                                 collecte.periode.nom || collecte.periode.type_periode
//                             ) : (
//                               'Occasionnelle'
//                             )}
//                           </td>
//                         )}
//                         {visibleColumns.date && (
//                           <td
//                             className="px-6 py-4 cursor-pointer text-gray-900 dark:text-gray-200"
//                             onClick={() => router.visit(route('collectes.show', collecte.id))}
//                           >
//                             {formatDate(collecte.date_collecte)}
//                           </td>
//                         )}
//                         {visibleColumns.status && (
//                           <td
//                             className="px-6 py-4 cursor-pointer"
//                             onClick={() => router.visit(route('collectes.show', collecte.id))}
//                           >
//                             {collecte.type_collecte === 'brouillon' ? (
//                               <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200">
//                                 Brouillon
//                               </span>
//                             ) : (
//                               <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
//                                 Standard
//                               </span>
//                             )}
//                           </td>
//                         )}
//                         {visibleColumns.actions && (
//                           <td className="px-6 py-4 text-right space-x-2">
//                             <div className="flex space-x-2 justify-end" onClick={e => e.stopPropagation()}>
//                               <Link
//                                 href={route('collectes.show', collecte.id)}
//                                 className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
//                                 title="Voir"
//                               >
//                                 <FileTextIcon className="w-5 h-5" />
//                               </Link>

//                               {/* Modifier - visible pour tous */}
//                               <Link
//                                 href={route('collectes.edit', collecte.id)}
//                                 className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
//                                 title="Modifier"
//                               >
//                                 <PencilIcon className="w-5 h-5" />
//                               </Link>

//                               {/* Convertir - visible uniquement pour les brouillons */}
//                               {collecte.type_collecte === 'brouillon' && (
//                                 <Link
//                                   href={route('collectes.edit', collecte.id)}
//                                   className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
//                                   title="Convertir en standard"
//                                 >
//                                   <CheckCircleIcon className="w-5 h-5" />
//                                 </Link>
//                               )}

//                               {/* Supprimer - visible pour tous */}
//                               <button
//                                 onClick={(e) => handleDelete(collecte.id, e)}
//                                 className={`${
//                                   confirmDelete === collecte.id
//                                    ? 'text-red-600 dark:text-red-400'
//                                    : 'text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400'
//                                 }`}
//                                 title={confirmDelete === collecte.id ? "Confirmer la suppression" : "Supprimer"}
//                               >
//                                 <TrashIcon className="w-5 h-5" />
//                               </button>
//                             </div>
//                           </td>
//                         )}
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             ) : (
//               <div className="text-center py-10 bg-gray-50 dark:bg-gray-700 rounded-lg">
//                 <FileTextIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
//                 <h3 className="text-lg font-medium text-gray-900 dark:text-white">Aucune collecte trouvée</h3>
//                 <p className="mt-1 text-gray-500 dark:text-gray-400">
//                   {searchTerm || Object.values(activeFilters).some(v => v)
//                     ? "Aucun résultat ne correspond à vos critères de recherche."
//                     : "Commencez par créer une nouvelle collecte."}
//                 </p>
//                 {(searchTerm || Object.values(activeFilters).some(v => v)) && (
//                   <button
//                     onClick={resetFilters}
//                     className="mt-4 inline-flex items-center px-5 py-3 border-2 border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600"
//                   >
//                     Réinitialiser les filtres
//                   </button>
//                 )}
//               </div>
//             )}

//             {/* Pagination */}
//             {collectes.links && collectes.links.length > 3 && (
//               <div className="mt-6">
//                 <nav className="flex items-center justify-between">
//                   <div className="text-sm text-gray-700 dark:text-gray-300">
//                     Affichage <span className="font-medium">{collectes.from}</span> à{' '}
//                     <span className="font-medium">{collectes.to}</span> sur{' '}
//                     <span className="font-medium">{collectes.total}</span> résultats
//                   </div>
//                   <div className="flex-1 flex justify-end space-x-2">
//                     {collectes.links.map((link: { url: string | { url: string; method: Method; }; active: any; label: any; }, index: React.Key | null | undefined) => (
//                       link.url && (
//                         <Link
//                           key={index}
//                           href={link.url}
//                           className={`relative inline-flex items-center px-4 py-2 border-2 text-sm font-medium rounded-lg ${
//                             link.active
//                               ? 'bg-blue-50 dark:bg-blue-900 border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-300'
//                               : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
//                           }`}
//                           dangerouslySetInnerHTML={{ __html: link.label }}
//                         />
//                       )
//                     ))}
//                   </div>
//                 </nav>
//               </div>
//             )}

//             {/* Modal pour collecte occasionnelle */}
//             {showOccasionnelModal && (
//               <OccasionnelModal
//                 isOpen={showOccasionnelModal}
//                 closeModal={() => setShowOccasionnelModal(false)}
//                 entreprises={entreprises}
//                 exercices={exercices}
//               />
//             )}
//           </div>
//         </div>
//       </div>
//     </AppLayout>
//   );
// };

// export default CollectesIndex;

// import OccasionnelModal from '@/components/OccasionnelModal';
// import AppLayout from '@/layouts/app-layout';
// import { Entreprise, Exercice, Periode } from '@/types/collecte';
// import { Head, Link, router } from '@inertiajs/react';
// import {
//     CheckCircleIcon,
//     ChevronsUpDownIcon,
//     DownloadIcon,
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
// import React, { useEffect, useState } from 'react';
// import { toast } from 'sonner';

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
//         | string;
//     date_collecte: string | Date;
//     type_collecte: string;
//     donnees: Record<string, any>;
//     created_at: string;
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
//     periodes: Periode[];
//     filters?: Record<string, any>;
//     visibleColumns?: {
//         entreprise: boolean;
//         exercice: boolean;
//         periode: boolean;
//         date: boolean;
//         status: boolean;
//         actions: boolean;
//     };
// }

// const formatDateTime = (dateInput: Date | string | null) => {
//     if (!dateInput) return 'Non définie';

//     const date = dateInput instanceof Date ? dateInput : new Date(dateInput);

//     // Vérification pour une date invalide
//     if (isNaN(date.getTime())) return 'Date invalide';

//     // Ajuster le fuseau horaire au fuseau du serveur (Europe/Paris)
//     const adjustedDate = new Date(date.toLocaleString('en-US', { timeZone: 'Europe/Paris' }));

//     return new Intl.DateTimeFormat('fr-FR', {
//         day: '2-digit',
//         month: '2-digit',
//         year: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit',
//         hour12: false, // Pour avoir un format 24h
//     }).format(adjustedDate);
// };

// const CollectesIndex = ({ collectes, entreprises, exercices, periodes, filters = {} , visibleColumns = {
//     entreprise: true,
//     exercice: true,
//     periode: true,
//     date: true,
//     status: true,
//     actions: true,
// },}: CollectesPageProps) => {
//     const [searchTerm, setSearchTerm] = useState(filters.search || '');
//     const [selectedCollectes, setSelectedCollectes] = useState<number[]>([]);
//     const [showFilters, setShowFilters] = useState(false);
//     const [showOccasionnelModal, setShowOccasionnelModal] = useState(false);
//     const [activeFilters, setActiveFilters] = useState({
//         entreprise_id: filters.entreprise_id || '',
//         exercice_id: filters.exercice_id || '',
//         periode_id: filters.periode_id || '',
//         type_collecte: filters.type_collecte || '',
//         occasionnel: filters.occasionnel || '',
//     });
//     const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
//     const [isProcessing, setIsProcessing] = useState(false);
//     // const [visibleColumns] = useState({
//     //     entreprise: true,
//     //     exercice: true,
//     //     periode: true,
//     //     date: true,
//     //     status: true,
//     //     actions: true,
//     // });
//     const [darkMode, setDarkMode] = useState(() => {
//         const savedMode = localStorage.getItem('darkMode');
//         return savedMode !== null ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
//     });

//     useEffect(() => {
//         localStorage.setItem('darkMode', JSON.stringify(darkMode));
//         document.documentElement.classList.toggle('dark', darkMode);
//     }, [darkMode]);

//     const toggleDarkMode = () => setDarkMode(!darkMode);

//     const applyFilters = () => {
//         const queryParams: Record<string, string> = { ...activeFilters };
//         if (searchTerm) queryParams.search = searchTerm;

//         Object.keys(queryParams).forEach((key) => {
//             if (!queryParams[key as keyof typeof queryParams]) delete queryParams[key as keyof typeof queryParams];
//         });

//         router.get(route('collectes.index'), queryParams, {
//             preserveState: true,
//             replace: true,
//         });
//     };

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

//     const toggleSelect = (id: number) => {
//         setSelectedCollectes((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
//     };

//     const selectAllDrafts = () => {
//         setSelectedCollectes(collectes.data.filter((c) => c.type_collecte === 'brouillon').map((c) => c.id));
//     };

//     const deselectAll = () => setSelectedCollectes([]);

//     const handleDelete = (id: number, e: React.MouseEvent) => {
//         e.preventDefault();
//         e.stopPropagation();

//         if (confirmDelete === id) {
//             router.delete(route('collectes.destroy', id), {
//                 onSuccess: () => toast.success('Collecte supprimée avec succès'),
//                 onError: () => toast.error('Échec de la suppression'),
//             });
//         } else {
//             setConfirmDelete(id);
//             toast.info('Cliquez à nouveau pour confirmer la suppression');
//             setTimeout(() => setConfirmDelete(null), 3000);
//         }
//     };

//     const validateSelectedCollectes = () => {
//         if (selectedCollectes.length === 0) {
//             toast.info('Veuillez sélectionner au moins une collecte');
//             return;
//         }

//         if (!confirm(`Confirmer la validation de ${selectedCollectes.length} collecte(s) ?`)) return;

//         setIsProcessing(true);
//         router.post(
//             route('collectes.validate-multiple'),
//             { collecte_ids: selectedCollectes },
//             {
//                 onSuccess: () => {
//                     toast.success(`${selectedCollectes.length} collecte(s) validée(s)`);
//                     setSelectedCollectes([]);
//                     setIsProcessing(false);
//                     router.reload();
//                 },
//                 onError: () => {
//                     toast.error('Erreur lors de la validation');
//                     setIsProcessing(false);
//                 },
//             },
//         );
//     };

//     const deleteSelectedCollectes = () => {
//         if (selectedCollectes.length === 0) {
//             toast.info('Veuillez sélectionner au moins une collecte');
//             return;
//         }

//         if (!confirm(`Confirmer la suppression de ${selectedCollectes.length} collecte(s) ?`)) return;

//         setIsProcessing(true);
//         router.post(
//             route('collectes.delete-multiple'),
//             { collecte_ids: selectedCollectes },
//             {
//                 onSuccess: () => {
//                     toast.success(`${selectedCollectes.length} collecte(s) supprimée(s)`);
//                     setSelectedCollectes([]);
//                     setIsProcessing(false);
//                     router.reload();
//                 },
//                 onError: () => {
//                     toast.error('Erreur lors de la suppression');
//                     setIsProcessing(false);
//                 },
//             },
//         );
//     };

//     const exportData = (format: 'pdf' | 'excel') => {
//         const queryParams = new URLSearchParams();

//         if (activeFilters.entreprise_id) queryParams.append('entreprise_id', activeFilters.entreprise_id);
//         if (activeFilters.exercice_id) queryParams.append('exercice_id', activeFilters.exercice_id);
//         if (activeFilters.periode_id) queryParams.append('periode_id', activeFilters.periode_id);
//         if (activeFilters.type_collecte) queryParams.append('type_collecte', activeFilters.type_collecte);
//         if (activeFilters.occasionnel) queryParams.append('occasionnel', activeFilters.occasionnel);
//         if (searchTerm) queryParams.append('search', searchTerm);
//         selectedCollectes.forEach((id) => queryParams.append('collecte_ids[]', id.toString()));
//         queryParams.append('format', format);

//         window.location.href = `${route('collectes.export')}?${queryParams.toString()}`;
//     };

//     const printCollectes = () => {
//         const printWindow = window.open('', '_blank');
//         if (!printWindow) {
//             toast.error("Impossible d'ouvrir la fenêtre d'impression");
//             return;
//         }

//         const filteredCollectes = selectedCollectes.length > 0 ? collectes.data.filter((c) => selectedCollectes.includes(c.id)) : collectes.data;

//         const printContent = `
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
//           </div>
//           <table>
//             <thead>
//               <tr>
//                 ${visibleColumns.entreprise ? '<th>Entreprise</th>' : ''}
//                 ${visibleColumns.exercice ? '<th>Exercice</th>' : ''}
//                 ${visibleColumns.periode ? '<th>Période</th>' : ''}
//                 ${visibleColumns.date ? '<th>Date collecte</th>' : ''}
//                 ${visibleColumns.status ? '<th>Statut</th>' : ''}
//               </tr>
//             </thead>
//             <tbody>
//               ${filteredCollectes
//                   .map(
//                       (collecte) => `
//                 <tr>
//                   ${visibleColumns.entreprise ? `<td>${collecte.entreprise.nom_entreprise}</td>` : ''}
//                   ${visibleColumns.exercice ? `<td>${collecte.exercice.annee}</td>` : ''}
//                   ${
//                       visibleColumns.periode
//                           ? `<td>${
//                                 collecte.periode
//                                     ? typeof collecte.periode === 'string'
//                                         ? collecte.periode === 'Occasionnelle'
//                                             ? 'Occasionnelle'
//                                             : collecte.periode
//                                         : collecte.periode.nom || collecte.periode.type_periode
//                                     : 'Occasionnelle'
//                             }</td>`
//                           : ''
//                   }
//                   ${visibleColumns.date ? `<td>${formatDateTime(collecte.date_collecte.toString())}</td>` : ''}
//                   ${
//                       visibleColumns.status
//                           ? `<td class="${collecte.type_collecte === 'brouillon' ? 'draft' : 'standard'}">${
//                                 collecte.type_collecte === 'brouillon' ? 'Brouillon' : 'Standard'
//                             }</td>`
//                           : ''
//                   }
//                 </tr>
//               `,
//                   )
//                   .join('')}
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

//     const totalDrafts = collectes.data.filter((c) => c.type_collecte === 'brouillon').length;
//     const selectedDrafts =
//         selectedCollectes.length > 0 ? collectes.data.filter((c) => selectedCollectes.includes(c.id) && c.type_collecte === 'brouillon').length : 0;

//     return (
//         <AppLayout title="Liste des collectes">
//             <Head title="Liste des collectes" />

//             <div className={`py-12 transition-colors duration-200 ${darkMode ? 'dark' : ''}`}>
//                 <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
//                     <div className="overflow-hidden bg-white p-6 shadow-lg transition-colors sm:rounded-xl dark:bg-gray-800">
//                         <div className="relative mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
//                             <div>
//                                 <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Liste des Collectes</h1>
//                                 <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
//                                     Total: {collectes.total} collecte(s), dont {totalDrafts} brouillon(s)
//                                 </p>
//                             </div>

//                             <button
//                                 onClick={toggleDarkMode}
//                                 className="absolute top-0 right-0 rounded-full bg-gray-100 p-2 text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
//                                 aria-label={darkMode ? 'Activer le mode clair' : 'Activer le mode sombre'}
//                             >
//                                 {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
//                             </button>

//                             <div className="mt-8 flex flex-wrap gap-2 md:mt-0">
//                                 <Link
//                                     href={route('collectes.create')}
//                                     className="inline-flex items-center rounded-lg border-2 border-blue-600 bg-blue-600 px-5 py-3 text-white shadow-md transition hover:bg-blue-700 dark:border-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
//                                 >
//                                     <PlusIcon className="mr-2 h-4 w-4" />
//                                     Nouvelle Collecte
//                                 </Link>

//                                 <button
//                                     onClick={() => setShowOccasionnelModal(true)}
//                                     className="inline-flex items-center rounded-lg border-2 border-green-600 bg-green-600 px-5 py-3 text-white shadow-md transition hover:bg-green-700 dark:border-green-500 dark:bg-green-500 dark:hover:bg-green-600"
//                                 >
//                                     <PlusIcon className="mr-2 h-4 w-4" />
//                                     Collecte Occasionnelle
//                                 </button>

//                                 <button
//                                     onClick={() => setShowFilters(!showFilters)}
//                                     className="inline-flex items-center rounded-lg border-2 border-gray-300 bg-gray-200 px-5 py-3 text-gray-700 shadow-md transition hover:bg-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
//                                 >
//                                     <FilterIcon className="mr-2 h-4 w-4" />
//                                     {showFilters ? 'Masquer les filtres' : 'Filtres'}
//                                 </button>

//                                 <button
//                                     onClick={() => exportData('excel')}
//                                     className="inline-flex items-center rounded-lg border-2 border-gray-300 bg-gray-200 px-5 py-3 text-gray-700 shadow-md transition hover:bg-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
//                                 >
//                                     <DownloadIcon className="mr-2 h-4 w-4" />
//                                     Exporter en Excel
//                                 </button>

//                                 <button
//                                     onClick={() => exportData('pdf')}
//                                     className="inline-flex items-center rounded-lg border-2 border-gray-300 bg-gray-200 px-5 py-3 text-gray-700 shadow-md transition hover:bg-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
//                                 >
//                                     <DownloadIcon className="mr-2 h-4 w-4" />
//                                     Exporter en PDF
//                                 </button>

//                                 <button
//                                     onClick={printCollectes}
//                                     className="inline-flex items-center rounded-lg border-2 border-gray-300 bg-gray-200 px-5 py-3 text-gray-700 shadow-md transition hover:bg-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
//                                 >
//                                     <PrinterIcon className="mr-2 h-4 w-4" />
//                                     Imprimer
//                                 </button>
//                             </div>
//                         </div>

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
//                                                     {exercice.annee}
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
//                                     onClick={() => {}}
//                                 >
//                                     <SlidersIcon className="mr-1 h-4 w-4" />
//                                     Colonnes
//                                 </button>
//                             </div>
//                         </div>

//                         {collectes.data.length > 0 ? (
//                             <div className="overflow-x-auto rounded-lg border-2 border-gray-200 shadow-lg dark:border-gray-700">
//                                 <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-600">
//                                     <thead className="bg-gray-50 dark:bg-gray-700">
//                                         <tr>
//                                             <th className="w-10 px-2 py-3">
//                                                 <input
//                                                     type="checkbox"
//                                                     className="focus:ring-opacity-50 rounded-md border-2 border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 dark:border-gray-600 dark:text-blue-500 dark:focus:border-blue-500 dark:focus:ring-blue-700"
//                                                     checked={selectedCollectes.length > 0 && selectedCollectes.length === collectes.data.length}
//                                                     onChange={(e) => {
//                                                         setSelectedCollectes(e.target.checked ? collectes.data.map((c) => c.id) : []);
//                                                     }}
//                                                 />
//                                             </th>
//                                             {visibleColumns.entreprise && (
//                                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-300">
//                                                     Entreprise
//                                                 </th>
//                                             )}
//                                             {visibleColumns.exercice && (
//                                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-300">
//                                                     Exercice
//                                                 </th>
//                                             )}
//                                             {visibleColumns.periode && (
//                                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-300">
//                                                     Période
//                                                 </th>
//                                             )}
//                                             {visibleColumns.date && (
//                                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-300">
//                                                     Date Collecte
//                                                 </th>
//                                             )}
//                                             {visibleColumns.status && (
//                                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-300">
//                                                     Statut
//                                                 </th>
//                                             )}
//                                             {visibleColumns.actions && (
//                                                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase dark:text-gray-300">
//                                                     Actions
//                                                 </th>
//                                             )}
//                                         </tr>
//                                     </thead>
//                                     <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
//                                         {collectes.data.map((collecte) => (
//                                             <tr
//                                                 key={collecte.id}
//                                                 className={`transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-700 ${
//                                                     selectedCollectes.includes(collecte.id) ? 'bg-blue-50 dark:bg-blue-900/30' : ''
//                                                 }`}
//                                             >
//                                                 <td className="px-2 py-4">
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
//                                                         className="cursor-pointer px-6 py-4 text-gray-900 dark:text-gray-200"
//                                                         onClick={() => router.visit(route('collectes.show', collecte.id))}
//                                                     >
//                                                         {collecte.entreprise.nom_entreprise}
//                                                     </td>
//                                                 )}
//                                                 {visibleColumns.exercice && (
//                                                     <td
//                                                         className="cursor-pointer px-6 py-4 text-gray-900 dark:text-gray-200"
//                                                         onClick={() => router.visit(route('collectes.show', collecte.id))}
//                                                     >
//                                                         {collecte.exercice.annee}
//                                                     </td>
//                                                 )}
//                                                 {visibleColumns.periode && (
//                                                     <td
//                                                         className="cursor-pointer px-6 py-4 text-gray-900 dark:text-gray-200"
//                                                         onClick={() => router.visit(route('collectes.show', collecte.id))}
//                                                     >
//                                                         {collecte.periode
//                                                             ? typeof collecte.periode === 'string'
//                                                                 ? collecte.periode === 'Occasionnelle'
//                                                                     ? 'Occasionnelle'
//                                                                     : collecte.periode
//                                                                 : collecte.periode.nom || collecte.periode.type_periode
//                                                             : 'Occasionnelle'}
//                                                     </td>
//                                                 )}




// {visibleColumns.date && (
//     <td
//         className="cursor-pointer px-6 py-4 text-gray-900 dark:text-gray-200"
//         onClick={() => router.visit(route('collectes.show', collecte.id))}
//     >
//         {formatDateTime(collecte.date_collecte)}
//     </td>
// )}
//                                                 {visibleColumns.status && (
//                                                     <td
//                                                         className="cursor-pointer px-6 py-4"
//                                                         onClick={() => router.visit(route('collectes.show', collecte.id))}
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
//                                                 {visibleColumns.actions && (
//                                                     <td className="space-x-2 px-6 py-4 text-right">
//                                                         <div className="flex justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
//                                                             <Link
//                                                                 href={route('collectes.show', collecte.id)}
//                                                                 className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
//                                                                 title="Voir"
//                                                             >
//                                                                 <FileTextIcon className="h-5 w-5" />
//                                                             </Link>

//                                                             <Link
//                                                                 href={route('collectes.edit', collecte.id)}
//                                                                 className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
//                                                                 title="Modifier"
//                                                             >
//                                                                 <PencilIcon className="h-5 w-5" />
//                                                             </Link>

//                                                             {collecte.type_collecte === 'brouillon' && (
//                                                                 <Link
//                                                                     href={route('collectes.edit', collecte.id)}
//                                                                     className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
//                                                                     title="Convertir en standard"
//                                                                 >
//                                                                     <CheckCircleIcon className="h-5 w-5" />
//                                                                 </Link>
//                                                             )}

//                                                             <button
//                                                                 onClick={(e) => handleDelete(collecte.id, e)}
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

//                         {collectes.links && collectes.links.length > 3 && (
//                             <div className="mt-6">
//                                 <nav className="flex items-center justify-between">
//                                     <div className="text-sm text-gray-700 dark:text-gray-300">
//                                         Affichage <span className="font-medium">{collectes.from}</span> à{' '}
//                                         <span className="font-medium">{collectes.to}</span> sur <span className="font-medium">{collectes.total}</span>{' '}
//                                         résultats
//                                     </div>
//                                     <div className="flex flex-1 justify-end space-x-2">
//                                         {collectes.links.map(
//                                             (link, index) =>
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

//                         {showOccasionnelModal && (
//                             <OccasionnelModal
//                                 isOpen={showOccasionnelModal}
//                                 closeModal={() => setShowOccasionnelModal(false)}
//                                 entreprises={entreprises}
//                                 exercices={exercices}
//                             />
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </AppLayout>
//     );
// };

// export default CollectesIndex;

// import OccasionnelModal from '@/components/OccasionnelModal';
// import AppLayout from '@/layouts/app-layout';
// import { Entreprise, Exercice, Periode } from '@/types/collecte';
// import { Head, Link, router } from '@inertiajs/react';
// import {
//     CheckCircleIcon,
//     ChevronsUpDownIcon,
//     DownloadIcon,
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
// import React, { useEffect, useState } from 'react';
// import { toast } from 'sonner';

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
//         | string;
//     date_collecte: string | Date;
//     type_collecte: string;
//     donnees: Record<string, any>;
//     created_at: string;
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
//     periodes: Periode[];
//     filters?: Record<string, any>;
//     visibleColumns?: {
//         entreprise: boolean;
//         exercice: boolean;
//         periode: boolean;
//         date: boolean;
//         status: boolean;
//         actions: boolean;
//     };
// }

// const formatDateTime = (dateInput: Date | string | null) => {
//     if (!dateInput) return 'Non définie';

//     const date = dateInput instanceof Date ? dateInput : new Date(dateInput);

//     // Vérification pour une date invalide
//     if (isNaN(date.getTime())) return 'Date invalide';

//     // Ajuster le fuseau horaire au fuseau du serveur (Europe/Paris)
//     const adjustedDate = new Date(date.toLocaleString('en-US', { timeZone: 'Europe/Paris' }));

//     return new Intl.DateTimeFormat('fr-FR', {
//         day: '2-digit',
//         month: '2-digit',
//         year: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit',
//         hour12: false, // Pour avoir un format 24h
//     }).format(adjustedDate);
// };

// const CollectesIndex = ({
//     collectes,
//     entreprises,
//     exercices,
//     periodes,
//     filters = {},
//     visibleColumns = {
//         entreprise: true,
//         exercice: true,
//         periode: true,
//         date: true,
//         status: true,
//         actions: true,
//     },
// }: CollectesPageProps) => {
//     console.log('Collectes reçues :', collectes);
//     console.log('Visible Columns :', visibleColumns);

//     const [searchTerm, setSearchTerm] = useState(filters.search || '');
//     const [selectedCollectes, setSelectedCollectes] = useState<number[]>([]);
//     const [showFilters, setShowFilters] = useState(false);
//     const [showOccasionnelModal, setShowOccasionnelModal] = useState(false);
//     const [activeFilters, setActiveFilters] = useState({
//         entreprise_id: filters.entreprise_id || '',
//         exercice_id: filters.exercice_id || '',
//         periode_id: filters.periode_id || '',
//         type_collecte: filters.type_collecte || '',
//         occasionnel: filters.occasionnel || '',
//     });
//     const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
//     const [isProcessing, setIsProcessing] = useState(false);
//     const [darkMode, setDarkMode] = useState(() => {
//         const savedMode = localStorage.getItem('darkMode');
//         return savedMode !== null ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
//     });

//     useEffect(() => {
//         localStorage.setItem('darkMode', JSON.stringify(darkMode));
//         document.documentElement.classList.toggle('dark', darkMode);
//     }, [darkMode]);

//     const toggleDarkMode = () => setDarkMode(!darkMode);

//     const applyFilters = () => {
//         const queryParams: Record<string, string> = { ...activeFilters };
//         if (searchTerm) queryParams.search = searchTerm;

//         Object.keys(queryParams).forEach((key) => {
//             if (!queryParams[key as keyof typeof queryParams]) delete queryParams[key as keyof typeof queryParams];
//         });

//         router.get(route('collectes.index'), queryParams, {
//             preserveState: true,
//             replace: true,
//         });
//     };

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

//     const toggleSelect = (id: number) => {
//         setSelectedCollectes((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
//     };

//     const selectAllDrafts = () => {
//         setSelectedCollectes(collectes.data.filter((c) => c.type_collecte === 'brouillon').map((c) => c.id));
//     };

//     const deselectAll = () => setSelectedCollectes([]);

//     const handleDelete = (id: number, e: React.MouseEvent) => {
//         e.preventDefault();
//         e.stopPropagation();

//         if (confirmDelete === id) {
//             router.delete(route('collectes.destroy', id), {
//                 onSuccess: () => toast.success('Collecte supprimée avec succès'),
//                 onError: () => toast.error('Échec de la suppression'),
//             });
//         } else {
//             setConfirmDelete(id);
//             toast.info('Cliquez à nouveau pour confirmer la suppression');
//             setTimeout(() => setConfirmDelete(null), 3000);
//         }
//     };

//     const validateSelectedCollectes = () => {
//         if (selectedCollectes.length === 0) {
//             toast.info('Veuillez sélectionner au moins une collecte');
//             return;
//         }

//         if (!confirm(`Confirmer la validation de ${selectedCollectes.length} collecte(s) ?`)) return;

//         setIsProcessing(true);
//         router.post(
//             route('collectes.validate-multiple'),
//             { collecte_ids: selectedCollectes },
//             {
//                 onSuccess: () => {
//                     toast.success(`${selectedCollectes.length} collecte(s) validée(s)`);
//                     setSelectedCollectes([]);
//                     setIsProcessing(false);
//                     router.reload();
//                 },
//                 onError: () => {
//                     toast.error('Erreur lors de la validation');
//                     setIsProcessing(false);
//                 },
//             },
//         );
//     };

//     const deleteSelectedCollectes = () => {
//         if (selectedCollectes.length === 0) {
//             toast.info('Veuillez sélectionner au moins une collecte');
//             return;
//         }

//         if (!confirm(`Confirmer la suppression de ${selectedCollectes.length} collecte(s) ?`)) return;

//         setIsProcessing(true);
//         router.post(
//             route('collectes.delete-multiple'),
//             { collecte_ids: selectedCollectes },
//             {
//                 onSuccess: () => {
//                     toast.success(`${selectedCollectes.length} collecte(s) supprimée(s)`);
//                     setSelectedCollectes([]);
//                     setIsProcessing(false);
//                     router.reload();
//                 },
//                 onError: () => {
//                     toast.error('Erreur lors de la suppression');
//                     setIsProcessing(false);
//                 },
//             },
//         );
//     };

//     const exportData = (format: 'pdf' | 'excel') => {
//         const queryParams = new URLSearchParams();

//         if (activeFilters.entreprise_id) queryParams.append('entreprise_id', activeFilters.entreprise_id);
//         if (activeFilters.exercice_id) queryParams.append('exercice_id', activeFilters.exercice_id);
//         if (activeFilters.periode_id) queryParams.append('periode_id', activeFilters.periode_id);
//         if (activeFilters.type_collecte) queryParams.append('type_collecte', activeFilters.type_collecte);
//         if (activeFilters.occasionnel) queryParams.append('occasionnel', activeFilters.occasionnel);
//         if (searchTerm) queryParams.append('search', searchTerm);
//         selectedCollectes.forEach((id) => queryParams.append('collecte_ids[]', id.toString()));
//         queryParams.append('format', format);

//         window.location.href = `${route('collectes.export')}?${queryParams.toString()}`;
//     };

//     const printCollectes = () => {
//         const printWindow = window.open('', '_blank');
//         if (!printWindow) {
//             toast.error("Impossible d'ouvrir la fenêtre d'impression");
//             return;
//         }

//         const filteredCollectes = selectedCollectes.length > 0 ? collectes.data.filter((c) => selectedCollectes.includes(c.id)) : collectes.data;

//         const printContent = `
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
//           </div>
//           <table>
//             <thead>
//               <tr>
//                 ${visibleColumns.entreprise ? '<th>Entreprise</th>' : ''}
//                 ${visibleColumns.exercice ? '<th>Exercice</th>' : ''}
//                 ${visibleColumns.periode ? '<th>Période</th>' : ''}
//                 ${visibleColumns.date ? '<th>Date collecte</th>' : ''}
//                 ${visibleColumns.status ? '<th>Statut</th>' : ''}
//               </tr>
//             </thead>
//             <tbody>
//               ${filteredCollectes
//                   .map(
//                       (collecte) => `
//                 <tr>
//                   ${visibleColumns.entreprise ? `<td>${collecte.entreprise.nom_entreprise}</td>` : ''}
//                   ${visibleColumns.exercice ? `<td>${collecte.exercice.annee}</td>` : ''}
//                   ${
//                       visibleColumns.periode
//                           ? `<td>${
//                                 collecte.periode
//                                     ? typeof collecte.periode === 'string'
//                                         ? collecte.periode === 'Occasionnelle'
//                                             ? 'Occasionnelle'
//                                             : collecte.periode
//                                         : collecte.periode.nom || collecte.periode.type_periode
//                                     : 'Occasionnelle'
//                             }</td>`
//                           : ''
//                   }
//                   ${visibleColumns.date ? `<td>${formatDateTime(collecte.date_collecte)}</td>` : ''}
//                   ${
//                       visibleColumns.status
//                           ? `<td class="${collecte.type_collecte === 'brouillon' ? 'draft' : 'standard'}">${
//                                 collecte.type_collecte === 'brouillon' ? 'Brouillon' : 'Standard'
//                             }</td>`
//                           : ''
//                   }
//                 </tr>
//               `,
//                   )
//                   .join('')}
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

//     const totalDrafts = collectes.data.filter((c) => c.type_collecte === 'brouillon').length;
//     const selectedDrafts =
//         selectedCollectes.length > 0 ? collectes.data.filter((c) => selectedCollectes.includes(c.id) && c.type_collecte === 'brouillon').length : 0;

//     return (
//         <AppLayout title="Liste des collectes">
//             <Head title="Liste des collectes" />

//             <div className={`py-12 transition-colors duration-200 ${darkMode ? 'dark' : ''}`}>
//                 <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
//                     <div className="overflow-hidden bg-white p-6 shadow-lg transition-colors sm:rounded-xl dark:bg-gray-800">
//                         <div className="relative mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
//                             <div>
//                                 <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Liste des Collectes</h1>
//                                 <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
//                                     Total: {collectes.total} collecte(s), dont {totalDrafts} brouillon(s)
//                                 </p>
//                             </div>

//                             <button
//                                 onClick={toggleDarkMode}
//                                 className="absolute top-0 right-0 rounded-full bg-gray-100 p-2 text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
//                                 aria-label={darkMode ? 'Activer le mode clair' : 'Activer le mode sombre'}
//                             >
//                                 {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
//                             </button>

//                             <div className="mt-8 flex flex-wrap gap-2 md:mt-0">
//                                 <Link
//                                     href={route('collectes.create')}
//                                     className="inline-flex items-center rounded-lg border-2 border-blue-600 bg-blue-600 px-5 py-3 text-white shadow-md transition hover:bg-blue-700 dark:border-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
//                                 >
//                                     <PlusIcon className="mr-2 h-4 w-4" />
//                                     Nouvelle Collecte
//                                 </Link>

//                                 <button
//                                     onClick={() => setShowOccasionnelModal(true)}
//                                     className="inline-flex items-center rounded-lg border-2 border-green-600 bg-green-600 px-5 py-3 text-white shadow-md transition hover:bg-green-700 dark:border-green-500 dark:bg-green-500 dark:hover:bg-green-600"
//                                 >
//                                     <PlusIcon className="mr-2 h-4 w-4" />
//                                     Collecte Occasionnelle
//                                 </button>

//                                 <button
//                                     onClick={() => setShowFilters(!showFilters)}
//                                     className="inline-flex items-center rounded-lg border-2 border-gray-300 bg-gray-200 px-5 py-3 text-gray-700 shadow-md transition hover:bg-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
//                                 >
//                                     <FilterIcon className="mr-2 h-4 w-4" />
//                                     {showFilters ? 'Masquer les filtres' : 'Filtres'}
//                                 </button>

//                                 <button
//                                     onClick={() => exportData('excel')}
//                                     className="inline-flex items-center rounded-lg border-2 border-gray-300 bg-gray-200 px-5 py-3 text-gray-700 shadow-md transition hover:bg-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
//                                 >
//                                     <DownloadIcon className="mr-2 h-4 w-4" />
//                                     Exporter en Excel
//                                 </button>

//                                 <button
//                                     onClick={() => exportData('pdf')}
//                                     className="inline-flex items-center rounded-lg border-2 border-gray-300 bg-gray-200 px-5 py-3 text-gray-700 shadow-md transition hover:bg-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
//                                 >
//                                     <DownloadIcon className="mr-2 h-4 w-4" />
//                                     Exporter en PDF
//                                 </button>

//                                 <button
//                                     onClick={printCollectes}
//                                     className="inline-flex items-center rounded-lg border-2 border-gray-300 bg-gray-200 px-5 py-3 text-gray-700 shadow-md transition hover:bg-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
//                                 >
//                                     <PrinterIcon className="mr-2 h-4 w-4" />
//                                     Imprimer
//                                 </button>
//                             </div>
//                         </div>

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
//                                                     {exercice.annee}
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
//                                     onClick={() => {}}
//                                 >
//                                     <SlidersIcon className="mr-1 h-4 w-4" />
//                                     Colonnes
//                                 </button>
//                             </div>
//                         </div>

//                         {collectes.data.length > 0 ? (
//                             <div className="overflow-x-auto rounded-lg border-2 border-gray-200 shadow-lg dark:border-gray-700">
//                                 <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-600">
//                                     <thead className="bg-gray-50 dark:bg-gray-700">
//                                         <tr>
//                                             <th className="w-10 px-2 py-3">
//                                                 <input
//                                                     type="checkbox"
//                                                     className="focus:ring-opacity-50 rounded-md border-2 border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 dark:border-gray-600 dark:text-blue-500 dark:focus:border-blue-500 dark:focus:ring-blue-700"
//                                                     checked={selectedCollectes.length > 0 && selectedCollectes.length === collectes.data.length}
//                                                     onChange={(e) => {
//                                                         setSelectedCollectes(e.target.checked ? collectes.data.map((c) => c.id) : []);
//                                                     }}
//                                                 />
//                                             </th>
//                                             {visibleColumns.entreprise && (
//                                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-300">
//                                                     Entreprise
//                                                 </th>
//                                             )}
//                                             {visibleColumns.exercice && (
//                                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-300">
//                                                     Exercice
//                                                 </th>
//                                             )}
//                                             {visibleColumns.periode && (
//                                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-300">
//                                                     Période
//                                                 </th>
//                                             )}
//                                             {visibleColumns.date && (
//                                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-300">
//                                                     Date Collecte
//                                                 </th>
//                                             )}
//                                             {visibleColumns.status && (
//                                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-300">
//                                                     Statut
//                                                 </th>
//                                             )}
//                                             {visibleColumns.actions && (
//                                                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase dark:text-gray-300">
//                                                     Actions
//                                                 </th>
//                                             )}
//                                         </tr>
//                                     </thead>
//                                     <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
//                                         {collectes.data.map((collecte) => {
//                                             console.log('Collecte ID:', collecte.id, 'Date Collecte:', collecte.date_collecte);
//                                             return (
//                                                 <tr
//                                                     key={collecte.id}
//                                                     className={`transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-700 ${
//                                                         selectedCollectes.includes(collecte.id) ? 'bg-blue-50 dark:bg-blue-900/30' : ''
//                                                     }`}
//                                                 >
//                                                     <td className="px-2 py-4">
//                                                         <input
//                                                             type="checkbox"
//                                                             className="focus:ring-opacity-50 rounded-md border-2 border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 dark:border-gray-600 dark:text-blue-500 dark:focus:border-blue-500 dark:focus:ring-blue-700"
//                                                             checked={selectedCollectes.includes(collecte.id)}
//                                                             onChange={() => toggleSelect(collecte.id)}
//                                                             onClick={(e) => e.stopPropagation()}
//                                                         />
//                                                     </td>
//                                                     {visibleColumns.entreprise && (
//                                                         <td
//                                                             className="cursor-pointer px-6 py-4 text-gray-900 dark:text-gray-200"
//                                                             onClick={() => router.visit(route('collectes.show', collecte.id))}
//                                                         >
//                                                             {collecte.entreprise.nom_entreprise}
//                                                         </td>
//                                                     )}
//                                                     {visibleColumns.exercice && (
//                                                         <td
//                                                             className="cursor-pointer px-6 py-4 text-gray-900 dark:text-gray-200"
//                                                             onClick={() => router.visit(route('collectes.show', collecte.id))}
//                                                         >
//                                                             {collecte.exercice.annee}
//                                                         </td>
//                                                     )}
//                                                     {visibleColumns.periode && (
//                                                         <td
//                                                             className="cursor-pointer px-6 py-4 text-gray-900 dark:text-gray-200"
//                                                             onClick={() => router.visit(route('collectes.show', collecte.id))}
//                                                         >
//                                                             {collecte.periode
//                                                                 ? typeof collecte.periode === 'string'
//                                                                     ? collecte.periode === 'Occasionnelle'
//                                                                         ? 'Occasionnelle'
//                                                                         : collecte.periode
//                                                                     : collecte.periode.nom || collecte.periode.type_periode
//                                                                 : 'Occasionnelle'}
//                                                         </td>
//                                                     )}
//                                                     {visibleColumns.date && (
//                                                         <td
//                                                             className="cursor-pointer px-6 py-4 text-gray-900 dark:text-gray-200"
//                                                             onClick={() => router.visit(route('collectes.show', collecte.id))}
//                                                         >
//                                                             {formatDateTime(collecte.date_collecte)}
//                                                         </td>
//                                                     )}
//                                                     {visibleColumns.status && (
//                                                         <td
//                                                             className="cursor-pointer px-6 py-4"
//                                                             onClick={() => router.visit(route('collectes.show', collecte.id))}
//                                                         >
//                                                             {collecte.type_collecte === 'brouillon' ? (
//                                                                 <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900 dark:text-amber-200">
//                                                                     Brouillon
//                                                                 </span>
//                                                             ) : (
//                                                                 <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
//                                                                     Standard
//                                                                 </span>
//                                                             )}
//                                                         </td>
//                                                     )}
//                                                     {visibleColumns.actions && (
//                                                         <td className="space-x-2 px-6 py-4 text-right">
//                                                             <div className="flex justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
//                                                                 <Link
//                                                                     href={route('collectes.show', collecte.id)}
//                                                                     className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
//                                                                     title="Voir"
//                                                                 >
//                                                                     <FileTextIcon className="h-5 w-5" />
//                                                                 </Link>

//                                                                 <Link
//                                                                     href={route('collectes.edit', collecte.id)}
//                                                                     className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
//                                                                     title="Modifier"
//                                                                 >
//                                                                     <PencilIcon className="h-5 w-5" />
//                                                                 </Link>

//                                                                 {collecte.type_collecte === 'brouillon' && (
//                                                                     <Link
//                                                                         href={route('collectes.edit', collecte.id)}
//                                                                         className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
//                                                                         title="Convertir en standard"
//                                                                     >
//                                                                         <CheckCircleIcon className="h-5 w-5" />
//                                                                     </Link>
//                                                                 )}

//                                                                 <button
//                                                                     onClick={(e) => handleDelete(collecte.id, e)}
//                                                                     className={`${
//                                                                         confirmDelete === collecte.id
//                                                                             ? 'text-red-600 dark:text-red-400'
//                                                                             : 'text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400'
//                                                                     }`}
//                                                                     title={confirmDelete === collecte.id ? 'Confirmer la suppression' : 'Supprimer'}
//                                                                 >
//                                                                     <TrashIcon className="h-5 w-5" />
//                                                                 </button>
//                                                             </div>
//                                                         </td>
//                                                     )}
//                                                 </tr>
//                                             );
//                                         })}
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

//                         {collectes.links && collectes.links.length > 3 && (
//                             <div className="mt-6">
//                                 <nav className="flex items-center justify-between">
//                                     <div className="text-sm text-gray-700 dark:text-gray-300">
//                                         Affichage <span className="font-medium">{collectes.from}</span> à{' '}
//                                         <span className="font-medium">{collectes.to}</span> sur <span className="font-medium">{collectes.total}</span>{' '}
//                                         résultats
//                                     </div>
//                                     <div className="flex flex-1 justify-end space-x-2">
//                                         {collectes.links.map(
//                                             (link, index) =>
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

//                         {showOccasionnelModal && (
//                             <OccasionnelModal
//                                 isOpen={showOccasionnelModal}
//                                 closeModal={() => setShowOccasionnelModal(false)}
//                                 entreprises={entreprises}
//                                 exercices={exercices}
//                             />
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </AppLayout>
//     );
// };

// export default CollectesIndex;
//---------------------------------------------



import React, { useState, useEffect } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import { toast } from 'sonner';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  FileTextIcon,
  FilterIcon,
  SearchIcon,
  SlidersIcon,
  XIcon,
  DownloadIcon,
  PrinterIcon,
  MoonIcon,
  SunIcon,
  ChevronsUpDownIcon
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Method } from 'node_modules/@inertiajs/core/types/types';
import OccasionnelModal from '@/components/OccasionnelModal';
import { Toaster } from '@/components/ui/sonner';

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
  periode: {
    id: number;
    type_periode: string;
    nom?: string;
  } | string; // Peut être un objet ou une chaîne "Occasionnelle"
  date_collecte: string;
  type_collecte: string; // 'standard' ou 'brouillon'
  status?: string;
  donnees: Record<string, any>;
  created_at: string;
  user: {
    id: number;
    name: string;
  };
  selected?: boolean; // Pour la sélection multiple
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
  periodes: Periode[];
  filters?: Record<string, any>;
  auth: any;
}

const formatDateTime = (dateInput: Date | string | null) => {
  if (!dateInput) return 'Non définie';

  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);

  // Vérification pour une date invalide
  if (isNaN(date.getTime())) return 'Date invalide';

  // Ajuster le fuseau horaire au Burkina Faso (Africa/Ouagadougou, UTC+0)
  const adjustedDate = new Date(date.toLocaleString('en-US', { timeZone: 'Africa/Ouagadougou' }));

  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // Pour avoir un format 24h
  }).format(adjustedDate);
};

const CollectesIndex = ({ collectes, entreprises, exercices, periodes, filters = {} }: CollectesPageProps) => {
  // État pour la gestion des filtres, recherche et sélection
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [selectedCollectes, setSelectedCollectes] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    entreprise_id: filters.entreprise_id || '',
    exercice_id: filters.exercice_id || '',
    periode_id: filters.periode_id || '',
    type_collecte: filters.type_collecte || '',
    occasionnel: filters.occasionnel || ''
  });
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [visibleColumns] = useState({
    entreprise: true,
    exercice: true,
    periode: true,
    date: true,
    status: true,
    actions: true,
    user: true,
    created_at: true
  });
  const [showOccasionnelModal, setShowOccasionnelModal] = useState(false);

  // État pour le mode sombre
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode !== null ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Sauvegarder la préférence de mode sombre
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Basculer le mode sombre
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Fonction pour appliquer les filtres
  const applyFilters = () => {
    type FilterParams = typeof activeFilters & { search?: string };
    const queryParams: FilterParams = { ...activeFilters };
    if (searchTerm) queryParams.search = searchTerm;

    (Object.keys(queryParams) as Array<keyof FilterParams>).forEach(key => {
      if (!queryParams[key]) delete queryParams[key];
    });

    router.get(route('collectes.index'), queryParams, {
      preserveState: true,
      replace: true
    });
  };

  // Réinitialiser les filtres
  const resetFilters = () => {
    setActiveFilters({
      entreprise_id: '',
      exercice_id: '',
      periode_id: '',
      type_collecte: '',
      occasionnel: ''
    });
    setSearchTerm('');
    router.get(route('collectes.index'), {}, {
      preserveState: true,
      replace: true
    });
  };

  // Toggle la sélection d'une collecte
  const toggleSelect = (id: number) => {
    setSelectedCollectes(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Sélectionner toutes les collectes brouillons
  const selectAllDrafts = () => {
    const draftIds = collectes.data
      .filter(c => c.type_collecte === 'brouillon')
      .map(c => c.id);
    setSelectedCollectes(draftIds);
  };

  // Désélectionner toutes les collectes
  const deselectAll = () => {
    setSelectedCollectes([]);
  };

  // Gestion de la suppression
  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (confirmDelete === id) {
      router.delete(route('collectes.destroy', id), {
        onSuccess: () => {
          toast.success('Collecte supprimée avec succès');
          setConfirmDelete(null);
        },
        onError: () => {
          toast.error("Échec de la suppression de la collecte");
          setConfirmDelete(null);
        },
      });
    } else {
      setConfirmDelete(id);
      toast.info("Cliquez à nouveau pour confirmer la suppression");

      setTimeout(() => {
        setConfirmDelete(null);
      }, 3000);
    }
  };

  // Valider les collectes sélectionnées
  const validateSelectedCollectes = () => {
    if (selectedCollectes.length === 0) {
      toast.info("Veuillez sélectionner au moins une collecte à valider");
      return;
    }

    if (!confirm(`Confirmer la validation de ${selectedCollectes.length} collecte(s) ?`)) {
      return;
    }

    setIsProcessing(true);

    router.post(route('collectes.validate-multiple'), { collecte_ids: selectedCollectes }, {
      onSuccess: () => {
        toast.success(`${selectedCollectes.length} collecte(s) validée(s) avec succès`);
        setSelectedCollectes([]);
        setIsProcessing(false);
        router.reload();
      },
      onError: () => {
        toast.error("Une erreur est survenue lors de la validation des collectes");
        setIsProcessing(false);
      }
    });
  };

  // Supprimer les collectes sélectionnées
  const deleteSelectedCollectes = () => {
    if (selectedCollectes.length === 0) {
      toast.info("Veuillez sélectionner au moins une collecte à supprimer");
      return;
    }

    if (!confirm(`Confirmer la suppression de ${selectedCollectes.length} collecte(s) ?`)) {
      return;
    }

    setIsProcessing(true);

    router.post(route('collectes.delete-multiple'), { collecte_ids: selectedCollectes }, {
      onSuccess: () => {
        toast.success(`${selectedCollectes.length} collecte(s) supprimée(s) avec succès`);
        setSelectedCollectes([]);
        setIsProcessing(false);
        router.reload();
      },
      onError: () => {
        toast.error("Une erreur est survenue lors de la suppression des collectes");
        setIsProcessing(false);
      }
    });
  };

  // Exporter les données
  const exportData = (format: 'pdf' | 'excel') => {
    const queryParams = new URLSearchParams();

    if (activeFilters.entreprise_id) queryParams.append('entreprise_id', activeFilters.entreprise_id);
    if (activeFilters.exercice_id) queryParams.append('exercice_id', activeFilters.exercice_id);
    if (activeFilters.periode_id) queryParams.append('periode_id', activeFilters.periode_id);
    if (activeFilters.type_collecte) queryParams.append('type_collecte', activeFilters.type_collecte);
    if (activeFilters.occasionnel) queryParams.append('occasionnel', activeFilters.occasionnel);

    if (searchTerm) queryParams.append('search', searchTerm);
    if (selectedCollectes.length > 0) {
      selectedCollectes.forEach(id => queryParams.append('collecte_ids[]', id.toString()));
    }
    queryParams.append('format', format);

    const baseUrl = route('collectes.export');
    window.location.href = `${baseUrl}?${queryParams.toString()}`;
  };

  // Impression
  const printCollectes = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error("Impossible d'ouvrir la fenêtre d'impression. Veuillez vérifier vos paramètres de navigateur.");
      return;
    }

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
              </tr>
            </thead>
            <tbody>
    `;

    const filteredCollectes = selectedCollectes.length > 0
      ? collectes.data.filter(c => selectedCollectes.includes(c.id))
      : collectes.data;

    filteredCollectes.forEach(collecte => {
      printContent += `<tr>
        ${visibleColumns.entreprise ? `<td>${collecte.entreprise.nom_entreprise}</td>` : ''}
        ${visibleColumns.exercice ? `<td>${collecte.exercice.annee}</td>` : ''}
        ${visibleColumns.periode ? `<td>${
          collecte.periode ? (
            typeof collecte.periode === 'string' ?
              collecte.periode === 'Occasionnelle' ? 'Occasionnelle' : collecte.periode :
              collecte.periode.nom || collecte.periode.type_periode
          ) : (
            'Occasionnelle'
          )}</td>` : ''}
        ${visibleColumns.date ? `<td>${formatDateTime(collecte.date_collecte)}</td>` : ''}
        ${visibleColumns.status ? `<td class="${collecte.type_collecte === 'brouillon' ? 'draft' : 'standard'}">${collecte.type_collecte === 'brouillon' ? 'Brouillon' : 'Standard'}</td>` : ''}
        ${visibleColumns.user ? `<td>${collecte.user ? collecte.user.name : 'N/A'}</td>` : ''}
        ${visibleColumns.created_at ? `<td>${formatDateTime(collecte.created_at)}</td>` : ''}
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

  // Détermination du nombre de brouillons sélectionnés/disponibles
  const totalDrafts = collectes.data.filter(c => c.type_collecte === 'brouillon').length;
  const selectedDrafts = selectedCollectes.length > 0 ?
    collectes.data.filter(c => selectedCollectes.includes(c.id) && c.type_collecte === 'brouillon').length : 0;

  return (
    <AppLayout title="Liste des collectes">
      <Head title="Liste des collectes" />
      <Toaster position="top-right" richColors />
      <div className={`py-12 transition-colors duration-200 ${darkMode ? 'dark' : ''}`}>
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg sm:rounded-xl p-6 transition-colors">
            {/* En-tête et actions principales */}
            <div className="flex flex-col mb-6 gap-4 relative">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-4">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Liste des Collectes</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Total: {collectes.total} collecte(s), dont {totalDrafts} brouillon(s)
                  </p>
                </div>

                {/* Bouton de basculement du mode sombre */}
                <button
                  onClick={toggleDarkMode}
                  className="absolute right-0 top-0 p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  aria-label={darkMode ? "Activer le mode clair" : "Activer le mode sombre"}
                >
                  {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                </button>
              </div>

              {/* Première ligne : Boutons "Nouvelle Collecte" et "Collecte Occasionnelle" */}
              <div className="flex flex-wrap gap-2 mb-2">
                <Link
                  href={route('collectes.create')}
                  className="inline-flex items-center px-5 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg border-2 border-blue-600 dark:border-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 transition shadow-md"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Nouvelle Collecte
                </Link>

                <button
                  onClick={() => setShowOccasionnelModal(true)}
                  className="inline-flex items-center px-5 py-3 bg-green-600 dark:bg-green-500 text-white rounded-lg border-2 border-green-600 dark:border-green-500 hover:bg-green-700 dark:hover:bg-green-600 transition shadow-md"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Collecte Occasionnelle
                </button>
              </div>

              {/* Deuxième ligne : Autres boutons */}
              <div className="flex flex-wrap justify-end gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center px-5 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600 transition shadow-md"
                >
                  <FilterIcon className="w-4 h-4 mr-2" />
                  {showFilters ? 'Masquer les filtres' : 'Filtres'}
                </button>

                <button
                  type="button"
                  className="inline-flex items-center px-5 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600 transition shadow-md"
                  onClick={() => exportData('excel')}
                >
                  <DownloadIcon className="w-4 h-4 mr-2" />
                  Exporter en Excel
                </button>

                <button
                  onClick={() => exportData('pdf')}
                  className="inline-flex items-center px-5 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600 transition shadow-md"
                >
                  <DownloadIcon className="w-4 h-4 mr-2" />
                  Exporter en PDF
                </button>

                <button
                  onClick={printCollectes}
                  className="inline-flex items-center px-5 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600 transition shadow-md"
                >
                  <PrinterIcon className="w-4 h-4 mr-2" />
                  Imprimer
                </button>
              </div>
            </div>

            {/* Filtres */}
            {showFilters && (
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg mb-6 shadow-inner border-2 border-gray-200 dark:border-gray-600">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-800 dark:text-white">Filtres</h2>
                  <button
                    onClick={resetFilters}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    Réinitialiser
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label htmlFor="entreprise_filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Entreprise
                    </label>
                    <select
                      id="entreprise_filter"
                      className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-md py-3 px-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:border-blue-500 dark:focus:border-blue-400 focus:ring focus:ring-blue-200 dark:focus:ring-blue-700 focus:ring-opacity-50"
                      value={activeFilters.entreprise_id}
                      onChange={(e) => setActiveFilters({...activeFilters, entreprise_id: e.target.value})}
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
                    <label htmlFor="exercice_filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Exercice
                    </label>
                    <select
                      id="exercice_filter"
                      className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-md py-3 px-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:border-blue-500 dark:focus:border-blue-400 focus:ring focus:ring-blue-200 dark:focus:ring-blue-700 focus:ring-opacity-50"
                      value={activeFilters.exercice_id}
                      onChange={(e) => setActiveFilters({...activeFilters, exercice_id: e.target.value})}
                    >
                      <option value="">Tous les exercices</option>
                      {exercices.map((exercice) => (
                        <option key={exercice.id} value={exercice.id}>
                          {exercice.annee}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="periode_filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Période
                    </label>
                    <select
                      id="periode_filter"
                      className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-md py-3 px-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:border-blue-500 dark:focus:border-blue-400 focus:ring focus:ring-blue-200 dark:focus:ring-blue-700 focus:ring-opacity-50"
                      value={activeFilters.periode_id}
                      onChange={(e) => setActiveFilters({...activeFilters, periode_id: e.target.value})}
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
                    <label htmlFor="type_filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Type
                    </label>
                    <select
                      id="type_filter"
                      className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-md py-3 px-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:border-blue-500 dark:focus:border-blue-400 focus:ring focus:ring-blue-200 dark:focus:ring-blue-700 focus:ring-opacity-50"
                      value={activeFilters.type_collecte}
                      onChange={(e) => setActiveFilters({...activeFilters, type_collecte: e.target.value})}
                    >
                      <option value="">Tous les types</option>
                      <option value="standard">Standard</option>
                      <option value="brouillon">Brouillon</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="occasionnel_filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Type de collectes
                    </label>
                    <div className="relative">
                      <select
                        id="occasionnel_filter"
                        className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-md py-3 px-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:border-blue-500 dark:focus:border-blue-400 focus:ring focus:ring-blue-200 dark:focus:ring-blue-700 focus:ring-opacity-50 appearance-none"
                        value={activeFilters.occasionnel || ''}
                        onChange={(e) => setActiveFilters({...activeFilters, occasionnel: e.target.value})}
                      >
                        <option value="">Tous les types</option>
                        <option value="false">Collectes standard/périodiques</option>
                        <option value="true">Collectes occasionnelles</option>
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
                    className="inline-flex items-center px-5 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg border-2 border-blue-600 dark:border-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 shadow-md"
                  >
                    Appliquer les filtres
                  </button>
                </div>
              </div>
            )}

            {/* Barre de recherche et actions sur la sélection */}
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
              <div className="relative flex-grow max-w-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Rechercher une collecte..."
                  className="pl-10 w-full p-3 border-2 rounded-lg shadow-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                />
              </div>

              {selectedCollectes.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedCollectes.length} collecte(s) sélectionnée(s)
                    {selectedDrafts > 0 && ` (${selectedDrafts} brouillon(s))`}
                  </span>

                  {selectedDrafts > 0 && (
                    <button
                      onClick={validateSelectedCollectes}
                      disabled={isProcessing}
                      className="inline-flex items-center px-4 py-2 bg-green-600 dark:bg-green-500 text-white text-sm rounded-lg border-2 border-green-600 dark:border-green-500 hover:bg-green-700 dark:hover:bg-green-600 disabled:bg-green-300 dark:disabled:bg-green-800 shadow-md"
                    >
                      <CheckCircleIcon className="w-4 h-4 mr-1" />
                      Valider
                    </button>
                  )}

                  <button
                    onClick={deleteSelectedCollectes}
                    disabled={isProcessing}
                    className="inline-flex items-center px-4 py-2 bg-red-600 dark:bg-red-500 text-white text-sm rounded-lg border-2 border-red-600 dark:border-red-500 hover:bg-red-700 dark:hover:bg-red-600 disabled:bg-red-300 dark:disabled:bg-red-800 shadow-md"
                  >
                    <TrashIcon className="w-4 h-4 mr-1" />
                    Supprimer
                  </button>

                  <button
                    onClick={deselectAll}
                    className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600 shadow-md"
                  >
                    <XIcon className="w-4 h-4 mr-1" />
                    Désélectionner
                  </button>
                </div>
              )}

              {selectedCollectes.length === 0 && totalDrafts > 0 && (
                <button
                  onClick={selectAllDrafts}
                  className="inline-flex items-center px-4 py-2 bg-amber-100 dark:bg-amber-800 text-amber-800 dark:text-amber-100 text-sm rounded-lg border-2 border-amber-200 dark:border-amber-700 hover:bg-amber-200 dark:hover:bg-amber-700 shadow-md"
                >
                  <CheckCircleIcon className="w-4 h-4 mr-1" />
                  Sélectionner tous les brouillons ({totalDrafts})
                </button>
              )}

              <div className="relative">
                <button
                  className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600 shadow-md"
                  onClick={() => {
                    // Toggle dialog pour gérer les colonnes
                  }}
                >
                  <SlidersIcon className="w-4 h-4 mr-1" />
                  Colonnes
                </button>
              </div>
            </div>

            {/* Tableau des collectes */}
            {collectes.data.length > 0 ? (
              <div className="overflow-x-auto rounded-lg border-2 border-gray-200 dark:border-gray-700 shadow-lg">
                <table className="w-full min-w-[1200px] divide-y divide-gray-300 dark:divide-gray-600">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="w-10 px-4 py-3">
                        <input
                          type="checkbox"
                          className="rounded-md border-2 border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-500 shadow-sm focus:border-blue-300 dark:focus:border-blue-500 focus:ring focus:ring-blue-200 dark:focus:ring-blue-700 focus:ring-opacity-50"
                          checked={selectedCollectes.length > 0 && selectedCollectes.length === collectes.data.length}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCollectes(collectes.data.map(c => c.id));
                            } else {
                              setSelectedCollectes([]);
                            }
                          }}
                        />
                      </th>
                      {visibleColumns.entreprise && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[15%]">
                          Entreprise
                        </th>
                      )}
                      {visibleColumns.exercice && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[10%]">
                          Exercice
                        </th>
                      )}
                      {visibleColumns.periode && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[15%]">
                          Période
                        </th>
                      )}
                      {visibleColumns.date && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[15%]">
                          Date Collecte
                        </th>
                      )}
                      {visibleColumns.status && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[10%]">
                          Statut
                        </th>
                      )}
                      {visibleColumns.user && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[20%]">
                          Utilisateur
                        </th>
                      )}

                      {visibleColumns.actions && (
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[10%]">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {collectes.data.map((collecte) => (
                      <tr
                        key={collecte.id}
                        className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 ${
                          selectedCollectes.includes(collecte.id) ? 'bg-blue-50 dark:bg-blue-900/30' : ''
                        }`}
                      >
                        <td className="px-4 py-4">
                          <input
                            type="checkbox"
                            className="rounded-md border-2 border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-500 shadow-sm focus:border-blue-300 dark:focus:border-blue-500 focus:ring focus:ring-blue-200 dark:focus:ring-blue-700 focus:ring-opacity-50"
                            checked={selectedCollectes.includes(collecte.id)}
                            onChange={() => toggleSelect(collecte.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </td>
                        {visibleColumns.entreprise && (
                          <td
                            className="px-6 py-4 cursor-pointer text-gray-900 dark:text-gray-200 truncate"
                            onClick={() => router.visit(route('collectes.show', collecte.id))}
                          >
                            {collecte.entreprise.nom_entreprise}
                          </td>
                        )}
                        {visibleColumns.exercice && (
                          <td
                            className="px-6 py-4 cursor-pointer text-gray-900 dark:text-gray-200"
                            onClick={() => router.visit(route('collectes.show', collecte.id))}
                          >
                            {collecte.exercice.annee}
                          </td>
                        )}
                        {visibleColumns.periode && (
                          <td
                            className="px-6 py-4 cursor-pointer text-gray-900 dark:text-gray-200 truncate"
                            onClick={() => router.visit(route('collectes.show', collecte.id))}
                          >
                            {collecte.periode ? (
                              typeof collecte.periode === 'string' ?
                                collecte.periode === 'Occasionnelle' ? 'Occasionnelle' : collecte.periode :
                                collecte.periode.nom || collecte.periode.type_periode
                            ) : (
                              'Occasionnelle'
                            )}
                          </td>
                        )}
                        {visibleColumns.date && (
                          <td
                            className="px-6 py-4 cursor-pointer text-gray-900 dark:text-gray-200"
                            onClick={() => router.visit(route('collectes.show', collecte.id))}
                          >
                            {formatDateTime(collecte.date_collecte)}
                          </td>
                        )}
                        {visibleColumns.status && (
                          <td
                            className="px-6 py-4 cursor-pointer"
                            onClick={() => router.visit(route('collectes.show', collecte.id))}
                          >
                            {collecte.type_collecte === 'brouillon' ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200">
                                Brouillon
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                                Standard
                              </span>
                            )}
                          </td>
                        )}
                        {visibleColumns.user && (
                          <td
                            className="px-6 py-4 cursor-pointer text-gray-900 dark:text-gray-200 truncate"
                            onClick={() => router.visit(route('collectes.show', collecte.id))}
                          >
                            {collecte.user ? collecte.user.name : 'N/A'}
                          </td>
                        )}

                        {visibleColumns.actions && (
                          <td className="px-6 py-4 text-right space-x-2">
                            <div className="flex space-x-2 justify-end" onClick={e => e.stopPropagation()}>
                              <Link
                                href={route('collectes.show', collecte.id)}
                                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                title="Voir"
                              >
                                <FileTextIcon className="w-5 h-5" />
                              </Link>
                              <Link
                                href={route('collectes.edit', collecte.id)}
                                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                                title="Modifier"
                              >
                                <PencilIcon className="w-5 h-5" />
                              </Link>
                              {collecte.type_collecte === 'brouillon' && (
                                <Link
                                  href={route('collectes.edit', collecte.id)}
                                  className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
                                  title="Convertir en standard"
                                >
                                  <CheckCircleIcon className="w-5 h-5" />
                                </Link>
                              )}
                              <button
                                onClick={(e) => handleDelete(collecte.id, e)}
                                className={`${
                                  confirmDelete === collecte.id
                                   ? 'text-red-600 dark:text-red-400'
                                   : 'text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400'
                                }`}
                                title={confirmDelete === collecte.id ? "Confirmer la suppression" : "Supprimer"}
                              >
                                <TrashIcon className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <FileTextIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Aucune collecte trouvée</h3>
                <p className="mt-1 text-gray-500 dark:text-gray-400">
                  {searchTerm || Object.values(activeFilters).some(v => v)
                    ? "Aucun résultat ne correspond à vos critères de recherche."
                    : "Commencez par créer une nouvelle collecte."}
                </p>
                {(searchTerm || Object.values(activeFilters).some(v => v)) && (
                  <button
                    onClick={resetFilters}
                    className="mt-4 inline-flex items-center px-5 py-3 border-2 border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600"
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
                    <span className="font-medium">{collectes.to}</span> sur{' '}
                    <span className="font-medium">{collectes.total}</span> résultats
                  </div>
                  <div className="flex-1 flex justify-end space-x-2">
                    {collectes.links.map((link: { url: string | { url: string; method: Method; }; active: any; label: any; }, index: React.Key | null | undefined) => (
                      link.url && (
                        <Link
                          key={index}
                          href={link.url}
                          className={`relative inline-flex items-center px-4 py-2 border-2 text-sm font-medium rounded-lg ${
                            link.active
                              ? 'bg-blue-50 dark:bg-blue-900 border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-300'
                              : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                          dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                      )
                    ))}
                  </div>
                </nav>
              </div>
            )}

            {/* Modal pour collecte occasionnelle */}
            {showOccasionnelModal && (
              <OccasionnelModal
                isOpen={showOccasionnelModal}
                closeModal={() => setShowOccasionnelModal(false)}
                entreprises={entreprises}
                exercices={exercices}
              />
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default CollectesIndex;
