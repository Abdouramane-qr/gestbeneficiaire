// import React, { useState, useEffect } from 'react';
// import { Link, router } from '@inertiajs/react';
// import { toast } from 'sonner';
// import {
//   ArrowLeftIcon,
//   PencilIcon,
//   TrashIcon,
//   CheckCircleIcon,
//   PrinterIcon,
//   FileTextIcon,
//   MoonIcon,
//   SunIcon
// } from 'lucide-react';
// import { Head } from '@inertiajs/react';
// import { formatDate } from '@/Utils/dateUtils';
// import AppLayout from '@/layouts/app-layout';

// // Interfaces existantes...
// interface Entreprise {
//     id: number;
//     nom_entreprise: string;
//     secteur_activite?: string;
// }

// interface Exercice {
//     id: number;
//     annee: number;
//     date_debut?: string;
//     date_fin?: string;
//     actif?: boolean;
// }

// interface Periode {
//     id: number;
//     type_periode: string;
// }

// interface User {
//     id: number;
//     name: string;
// }

// interface Collecte {
//     id: number;
//     entreprise: Entreprise;
//     exercice: Exercice;
//     periode: Periode;
//     user?: User;
//     date_collecte: string;
//     type_collecte: string;
//     donnees: Record<string, Record<string, string | number>>;
//     created_at: string;
//     updated_at: string;
// }

// interface CollecteShowProps {
//     collecte: Collecte;
//     categoriesDisponibles: string[];
// }

// const CollecteShow: React.FC<CollecteShowProps> = ({ collecte, categoriesDisponibles }) => {
//     const [activeTab, setActiveTab] = useState<string>(categoriesDisponibles[0] || '');
//     const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
//     const [confirmConversion, setConfirmConversion] = useState<boolean>(false);
//     const [isConverting, setIsConverting] = useState<boolean>(false);

//     // État pour le mode sombre
//     const [darkMode, setDarkMode] = useState(() => {
//         // Récupérer la préférence de l'utilisateur depuis localStorage ou utiliser la préférence du système
//         const savedMode = localStorage.getItem('darkMode');
//         return savedMode !== null ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
//     });

//     const pageTitle = `Collecte - ${collecte.entreprise.nom_entreprise}`;

//     // Sauvegarder la préférence de mode sombre et appliquer les classes
//     useEffect(() => {
//         localStorage.setItem('darkMode', JSON.stringify(darkMode));
//         // Appliquer ou supprimer la classe dark sur le document
//         if (darkMode) {
//             document.documentElement.classList.add('dark');
//         } else {
//             document.documentElement.classList.remove('dark');
//         }
//     }, [darkMode]);

//     // Basculer le mode sombre
//     const toggleDarkMode = () => {
//         setDarkMode(!darkMode);
//     };

//     // Formatage des valeurs numériques
//     const formatValue = (value: string | number) => {
//         if (typeof value === 'number') {
//             return value.toLocaleString('fr-FR', {
//                 minimumFractionDigits: 2,
//                 maximumFractionDigits: 2
//             });
//         }
//         return value;
//     };

//     // Obtenir le libellé d'une catégorie
//     const getCategoryLabel = (categoryId: string): string => {
//         const categoryLabels: Record<string, string> = {
//             'financier': 'Indicateurs Financiers',
//             'commercial': 'Indicateurs Commerciaux',
//             'production': 'Production',
//             'rh': 'Ressources Humaines',
//             'tresorerie': 'Trésorerie'
//         };

//         return categoryLabels[categoryId] || categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
//     };

//     // Fonction pour gérer l'impression
//     const handlePrint = () => {
//         const printWindow = window.open('', '_blank');
//         if (!printWindow) {
//             toast.error("Impossible d'ouvrir la fenêtre d'impression. Veuillez vérifier vos paramètres de navigateur.");
//             return;
//         }

//         const logoUrl = `${window.location.origin}/logo.png`;
//         // Contenu HTML à imprimer
//         let printContent = `
//         <html>
//          <head>
//         <title>Collecte - ${collecte.entreprise.nom_entreprise}</title>
//         <style>
//           body { font-family: Arial, sans-serif; margin: 20px; }
//           .header { display: flex; align-items: center; margin-bottom: 20px; }
//           .logo { width: 120px; height: auto; margin-right: 20px; }
//           .title-container { flex-grow: 1; }
//           h1 { color: #2c5282; font-size: 20px; margin: 0; }
//           .subtitle { color: #4a5568; font-size: 14px; margin-top: 5px; }
//           h2 { color: #4a5568; font-size: 16px; margin-top: 20px; }
//           .info-section { margin-bottom: 20px; border: 1px solid #e2e8f0; border-radius: 6px; padding: 15px; }
//           .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
//           .info-row { display: flex; justify-content: space-between; border-bottom: 1px solid #edf2f7; padding: 8px 0; }
//           .label { font-weight: bold; color: #4a5568; }
//           .value { text-align: right; }
//           table { width: 100%; border-collapse: collapse; margin-top: 20px; }
//           th { background-color: #4F81BD; color: white; text-align: left; padding: 8px; }
//           td { border-bottom: 1px solid #e2e8f0; padding: 8px; }
//           .brouillon { color: #d97706; font-style: italic; }
//           .standard { color: #059669; }
//           @media print {
//             .no-print { display: none; }
//             body { margin: 0; padding: 15px; }
//           }
//         </style>
//       </head>
//           <body>
//            <div class="header">
//           <img src="${logoUrl}" alt="Logo" class="logo" />
//           <div class="title-container">
//             <h1>Détails de la collecte - ${collecte.entreprise.nom_entreprise}</h1>
//             <div class="subtitle">Période: ${collecte.periode.type_periode} | Exercice: ${collecte.exercice.annee}</div>
//           </div>
//         </div>
//             <h1>Détails de la collecte - ${collecte.entreprise.nom_entreprise}</h1>
//             <div class="info-section">
//               <h2>Informations de la Collecte</h2>
//               <div class="info-grid">
//                 <div class="info-row">
//                   <span class="label">Date de collecte:</span>
//                   <span class="value">${formatDate(collecte.date_collecte)}</span>
//                 </div>
//                 <div class="info-row">
//                   <span class="label">Statut:</span>
//                   <span class="value ${collecte.type_collecte === 'brouillon' ? 'brouillon' : 'standard'}">
//                     ${collecte.type_collecte === 'brouillon' ? 'Brouillon' : 'Standard'}
//                   </span>
//                 </div>
//                 <div class="info-row">
//                   <span class="label">Créée par:</span>
//                   <span class="value">${collecte.user?.name || 'Non spécifié'}</span>
//                 </div>
//                 <div class="info-row">
//                   <span class="label">Créée le:</span>
//                   <span class="value">${formatDate(collecte.created_at)}</span>
//                 </div>
//               </div>
//             </div>

//             <div class="info-section">
//               <h2>Informations de l'Entreprise</h2>
//               <div class="info-grid">
//                 <div class="info-row">
//                   <span class="label">Nom:</span>
//                   <span class="value">${collecte.entreprise.nom_entreprise}</span>
//                 </div>
//                 ${collecte.entreprise.secteur_activite ? `
//                 <div class="info-row">
//                   <span class="label">Secteur d'activité:</span>
//                   <span class="value">${collecte.entreprise.secteur_activite}</span>
//                 </div>
//                 ` : ''}
//               </div>
//             </div>
//         `;

//         // Ajouter les données par catégorie
//         categoriesDisponibles.forEach(category => {
//             const categoryData = collecte.donnees[category];
//             if (categoryData && Object.keys(categoryData).length > 0) {
//                 printContent += `
//                 <h2>${getCategoryLabel(category)}</h2>
//                 <table>
//                   <thead>
//                     <tr>
//                       <th>Indicateur</th>
//                       <th>Valeur</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                 `;

//                 Object.entries(categoryData).forEach(([key, value]) => {
//                     printContent += `
//                     <tr>
//                       <td>${key}</td>
//                       <td>${formatValue(value)}</td>
//                     </tr>
//                     `;
//                 });

//                 printContent += `
//                   </tbody>
//                 </table>
//                 `;
//             }
//         });

//         // Fermer le document HTML
//         printContent += `
//             <div class="no-print" style="margin-top: 20px; text-align: center;">
//               <button onclick="window.print()">Imprimer</button>
//               <button onclick="window.close()">Fermer</button>
//             </div>
//           </body>
//         </html>
//         `;

//         printWindow.document.open();
//         printWindow.document.write(printContent);
//         printWindow.document.close();
//         printWindow.focus();
//     };

//     // Fonction pour exporter en PDF
//     const handleExportPDF = () => {
//         window.location.href = route('collectes.export', {
//             format: 'pdf',
//             collecte_ids: [collecte.id],
//             mode: 'detail' // Indique que c'est un export de détail
//         });
//     };

//     // Gestion de la suppression
//     const handleDelete = () => {
//         if (confirmDelete) {
//             router.delete(route('collectes.destroy', collecte.id), {
//                 onSuccess: () => {
//                     toast.success('Collecte supprimée avec succès');
//                     router.visit(route('collectes.index'));
//                 },
//                 onError: () => {
//                     toast.error("Échec de la suppression de la collecte");
//                     setConfirmDelete(false);
//                 },
//             });
//         } else {
//             setConfirmDelete(true);
//             toast.info("Cliquez à nouveau pour confirmer la suppression");

//             setTimeout(() => {
//                 setConfirmDelete(false);
//             }, 3000);
//         }
//     };

//     // Fonction pour convertir un brouillon en collecte standard
//     const handleConvertToStandard = () => {
//         if (confirmConversion) {
//             setIsConverting(true);

//             router.put(route('collectes.convert-to-standard', collecte.id), {}, {
//                 onSuccess: () => {
//                     toast.success('Brouillon converti en collecte standard avec succès');
//                     // Rechargement de la page pour refléter le changement de statut
//                     router.reload();
//                 },
//                 onError: (errors) => {
//                     if (errors.general) {
//                         toast.error(errors.general);
//                     } else if (errors.message) {
//                         toast.error(errors.message);
//                     } else {
//                         toast.error("Échec de la conversion du brouillon");
//                     }
//                     setIsConverting(false);
//                     setConfirmConversion(false);
//                 },
//                 onFinish: () => {
//                     setIsConverting(false);
//                     setConfirmConversion(false);
//                 }
//             });
//         } else {
//             setConfirmConversion(true);
//             toast.info("Cliquez à nouveau pour confirmer la conversion en collecte standard");

//             setTimeout(() => {
//                 setConfirmConversion(false);
//             }, 3000);
//         }
//     };

//     return (
//         <AppLayout title={pageTitle}>
//             <Head title={pageTitle} />

//             <div className={`py-12 transition-colors duration-200 ${darkMode ? 'dark' : ''}`}>
//                 <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
//                     <div className="bg-white dark:bg-gray-800 shadow-lg overflow-hidden sm:rounded-xl">
//                         {/* En-tête */}
//                         <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-5 relative">
//                             <div className="flex justify-between items-center">
//                                 <h2 className="text-2xl font-semibold text-gray-800 dark:text-white flex items-center">
//                                     Détails de la collecte
//                                     {collecte.type_collecte === 'brouillon' && (
//                                         <span className="ml-2 px-2.5 py-1 text-xs bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 rounded-full">
//                                             Brouillon
//                                         </span>
//                                     )}
//                                 </h2>

//                                 {/* Bouton de basculement du mode sombre */}
//                                 <button
//                                     onClick={toggleDarkMode}
//                                     className="absolute right-6 top-5 p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
//                                     aria-label={darkMode ? "Activer le mode clair" : "Activer le mode sombre"}
//                                 >
//                                     {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
//                                 </button>

//                                 <div className="flex space-x-2">
//                                     {/* Bouton d'impression */}
//                                     <button
//                                         onClick={handlePrint}
//                                         className="inline-flex items-center px-5 py-3 border-2 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 shadow-md transition-colors"
//                                     >
//                                         <PrinterIcon className="w-4 h-4 mr-2" />
//                                         Imprimer
//                                     </button>

//                                     {/* Bouton d'export PDF */}
//                                     <button
//                                         onClick={handleExportPDF}
//                                         className="inline-flex items-center px-5 py-3 border-2 border-gray-600 dark:border-gray-400 bg-gray-700 dark:bg-gray-600 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-500 shadow-md transition-colors"
//                                     >
//                                         <FileTextIcon className="w-4 h-4 mr-2" />
//                                         Exporter PDF
//                                     </button>

//                                     {/* Bouton de conversion pour les brouillons */}
//                                     {collecte.type_collecte === 'brouillon' && (
//                                         <button
//                                             onClick={handleConvertToStandard}
//                                             disabled={isConverting}
//                                             className={`inline-flex items-center px-5 py-3 rounded-lg border-2 shadow-md text-white
//                                                 ${confirmConversion
//                                                     ? 'bg-green-800 dark:bg-green-700 border-green-900 dark:border-green-600 hover:bg-green-900 dark:hover:bg-green-600'
//                                                     : 'bg-green-600 dark:bg-green-500 border-green-700 dark:border-green-400 hover:bg-green-700 dark:hover:bg-green-400'
//                                                 } ${isConverting ? 'opacity-75 cursor-not-allowed' : ''} transition-colors`}
//                                         >
//                                             <CheckCircleIcon className="w-4 h-4 mr-2" />
//                                             {isConverting
//                                                 ? 'Conversion...'
//                                                 : confirmConversion
//                                                     ? 'Confirmer'
//                                                     : 'Convertir en standard'
//                                             }
//                                         </button>
//                                     )}

//                                     <Link
//                                         href={route('collectes.edit', collecte.id)}
//                                         className="inline-flex items-center px-5 py-3 border-2 border-blue-600 dark:border-blue-400 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-400 shadow-md transition-colors"
//                                     >
//                                         <PencilIcon className="w-4 h-4 mr-2" />
//                                         Modifier
//                                     </Link>

//                                     <button
//                                         onClick={handleDelete}
//                                         className={`inline-flex items-center px-5 py-3 rounded-lg border-2 shadow-md text-white
//                                             ${confirmDelete
//                                                 ? 'bg-red-800 dark:bg-red-700 border-red-900 dark:border-red-600 hover:bg-red-900 dark:hover:bg-red-600'
//                                                 : 'bg-red-600 dark:bg-red-500 border-red-700 dark:border-red-400 hover:bg-red-700 dark:hover:bg-red-400'
//                                             } transition-colors`}
//                                     >
//                                         <TrashIcon className="w-4 h-4 mr-2" />
//                                         {confirmDelete ? 'Confirmer' : 'Supprimer'}
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="p-6">
//                             {/* Bouton retour */}
//                             <div className="mb-6">
//                                 <Link
//                                     href={route('collectes.index')}
//                                     className="inline-flex items-center px-5 py-3 bg-gray-800 dark:bg-gray-700 text-white border-2 border-gray-800 dark:border-gray-600 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 shadow-md transition-colors"
//                                 >
//                                     <ArrowLeftIcon className="w-4 h-4 mr-2" />
//                                     Retour à la liste
//                                 </Link>
//                             </div>

//                             {/* Message de statut brouillon */}
//                             {collecte.type_collecte === 'brouillon' && (
//                                 <div className="bg-amber-50 dark:bg-amber-900/30 border-2 border-amber-200 dark:border-amber-700 rounded-lg p-4 mb-6">
//                                     <div className="flex">
//                                         <div className="flex-shrink-0">
//                                             <svg className="h-5 w-5 text-amber-400 dark:text-amber-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                                                 <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                                             </svg>
//                                         </div>
//                                         <div className="ml-3">
//                                             <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300">
//                                                 Cette collecte est en mode brouillon
//                                             </h3>
//                                             <div className="mt-2 text-sm text-amber-700 dark:text-amber-400">
//                                                 <p>
//                                                     Les collectes en mode brouillon ne sont pas comptabilisées dans les analyses.
//                                                     Vous pouvez la convertir en collecte standard en utilisant le bouton "Convertir en standard".
//                                                 </p>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}

//                             {/* Informations générales */}
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//                                 {/* Informations de la collecte */}
//                                 <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border-2 border-gray-200 dark:border-gray-600 shadow-md">
//                                     <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Informations de la Collecte</h3>
//                                     <dl className="grid grid-cols-1 gap-3">
//                                         <div className="flex justify-between">
//                                             <dt className="font-medium text-gray-500 dark:text-gray-300">Date de collecte</dt>
//                                             <dd className="text-gray-900 dark:text-gray-100">{formatDate(collecte.date_collecte)}</dd>
//                                         </div>
//                                         <div className="flex justify-between">
//                                             <dt className="font-medium text-gray-500 dark:text-gray-300">Statut</dt>
//                                             <dd className="text-gray-900 dark:text-gray-100">
//                                                 {collecte.type_collecte === 'brouillon'
//                                                     ? <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 rounded-full text-xs">Brouillon</span>
//                                                     : <span className="px-2.5 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs">Standard</span>
//                                                 }
//                                             </dd>
//                                         </div>
//                                         <div className="flex justify-between">
//                                             <dt className="font-medium text-gray-500 dark:text-gray-300">Créée par</dt>
//                                             <dd className="text-gray-900 dark:text-gray-100">{collecte.user?.name || 'Non spécifié'}</dd>
//                                         </div>
//                                         <div className="flex justify-between">
//                                             <dt className="font-medium text-gray-500 dark:text-gray-300">Créée le</dt>
//                                             <dd className="text-gray-900 dark:text-gray-100">{formatDate(collecte.created_at)}</dd>
//                                         </div>
//                                         <div className="flex justify-between">
//                                             <dt className="font-medium text-gray-500 dark:text-gray-300">Dernière modification</dt>
//                                             <dd className="text-gray-900 dark:text-gray-100">{formatDate(collecte.updated_at)}</dd>
//                                         </div>
//                                     </dl>
//                                 </div>

//                                 {/* Informations de l'entreprise */}
//                                 <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border-2 border-gray-200 dark:border-gray-600 shadow-md">
//                                     <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Informations de l'Entreprise</h3>
//                                     <dl className="grid grid-cols-1 gap-3">
//                                         <div className="flex justify-between">
//                                             <dt className="font-medium text-gray-500 dark:text-gray-300">Nom</dt>
//                                             <dd className="text-gray-900 dark:text-gray-100">{collecte.entreprise.nom_entreprise}</dd>
//                                         </div>
//                                         {collecte.entreprise.secteur_activite && (
//                                             <div className="flex justify-between">
//                                                 <dt className="font-medium text-gray-500 dark:text-gray-300">Secteur d'activité</dt>
//                                                 <dd className="text-gray-900 dark:text-gray-100">{collecte.entreprise.secteur_activite}</dd>
//                                             </div>
//                                         )}
//                                     </dl>
//                                 </div>
//                             </div>

//                             {/* Données collectées */}
//                             <div className="mt-8">
//                                 <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Données Collectées</h3>

//                                 {/* Onglets des catégories */}
//                                 <div className="border-b border-gray-200 dark:border-gray-700">
//                                     <nav className="-mb-px flex flex-wrap space-x-4">
//                                         {categoriesDisponibles.map(category => (
//                                             <button
//                                                 key={category}
//                                                 onClick={() => setActiveTab(category)}
//                                                 className={`
//                                                     py-3 px-4 border-b-2 font-medium text-sm rounded-t-lg
//                                                     ${activeTab === category
//                                                         ? 'border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30'
//                                                         : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'}
//                                                 `}
//                                             >
//                                                 {getCategoryLabel(category)}
//                                             </button>
//                                         ))}
//                                     </nav>
//                                 </div>

//                                 {/* Contenu de l'onglet actif */}
//                                 <div className="mt-6">
//                                     {collecte.donnees[activeTab] ? (
//                                         <div className="bg-white dark:bg-gray-800 shadow-lg overflow-hidden sm:rounded-lg border-2 border-gray-200 dark:border-gray-700">
//                                             <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//                                                 <thead className="bg-gray-50 dark:bg-gray-700">
//                                                     <tr>
//                                                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                                                             Indicateur
//                                                         </th>
//                                                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                                                             Valeur
//                                                         </th>
//                                                     </tr>
//                                                 </thead>
//                                                 <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
//                                                     {Object.entries(collecte.donnees[activeTab]).map(([key, value]) => (
//                                                         <tr key={key} className="hover:bg-gray-50 dark:hover:bg-gray-700">
//                                                             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
//                                                                 {key}
//                                                             </td>
//                                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
//                                                                 {formatValue(value)}
//                                                             </td>
//                                                         </tr>
//                                                     ))}
//                                                 </tbody>
//                                             </table>
//                                         </div>
//                                     ) : (
//                                         <div className="text-center bg-gray-50 dark:bg-gray-700 rounded-lg p-8 border-2 border-gray-200 dark:border-gray-600">
//                                             <p className="text-gray-500 dark:text-gray-400">
//                                                 Aucune donnée disponible pour cette catégorie.
//                                             </p>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </AppLayout>
//     );
// };

// export default CollecteShow;
import React, { useState, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import { toast } from 'sonner';
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  PrinterIcon,
  FileTextIcon,
  MoonIcon,
  SunIcon,
  WifiIcon,
  WifiOffIcon,
  RefreshCcw
} from 'lucide-react';
import { Head } from '@inertiajs/react';
import { formatDate } from '@/Utils/dateUtils';
import AppLayout from '@/layouts/app-layout';
import { useOfflineStorage } from '@/hooks/useOfflineStorage';

// Interfaces
interface Entreprise {
    id: number;
    nom_entreprise: string;
    secteur_activite?: string;
}

interface Exercice {
    id: number;
    annee: number;
    date_debut?: string;
    date_fin?: string;
    actif?: boolean;
}

interface Periode {
    id: number;
    type_periode: string;
}

interface User {
    id: number;
    name: string;
}

interface Collecte {
    id: number;
    entreprise: Entreprise;
    exercice: Exercice;
    periode: Periode;
    user?: User;
    date_collecte: string;
    type_collecte: string;
    donnees: Record<string, Record<string, string | number>>;
    created_at: string;
    updated_at: string;
}

interface CollecteShowProps {
    collecte: Collecte;
    categoriesDisponibles: string[];
}

const CollecteShow: React.FC<CollecteShowProps> = ({ collecte, categoriesDisponibles }) => {
    const [activeTab, setActiveTab] = useState<string>(categoriesDisponibles[0] || '');
    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
    const [confirmConversion, setConfirmConversion] = useState<boolean>(false);
    const [isConverting, setIsConverting] = useState<boolean>(false);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [isSyncing, setIsSyncing] = useState(false);

    // Utilisation du hook de stockage hors ligne
    const { pendingUploads, syncData, isInitialized } = useOfflineStorage();

    // État pour le mode sombre
    const [darkMode, setDarkMode] = useState(() => {
        // Récupérer la préférence de l'utilisateur depuis localStorage ou utiliser la préférence du système
        const savedMode = localStorage.getItem('darkMode');
        return savedMode !== null ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    const pageTitle = `Collecte - ${collecte.entreprise.nom_entreprise}`;

    // Surveiller les changements de connectivité
    useEffect(() => {
        const handleOnlineStatus = () => {
            setIsOnline(navigator.onLine);
            if (navigator.onLine && pendingUploads > 0) {
                toast.info('Vous êtes de nouveau en ligne. Synchronisation possible.', {
                    action: {
                        label: 'Synchroniser',
                        onClick: handleSync,
                    },
                    duration: 8000,
                });
            }
        };

        window.addEventListener('online', handleOnlineStatus);
        window.addEventListener('offline', handleOnlineStatus);

        return () => {
            window.removeEventListener('online', handleOnlineStatus);
            window.removeEventListener('offline', handleOnlineStatus);
        };
    }, [pendingUploads]);

    // Sauvegarder la préférence de mode sombre et appliquer les classes
    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
        // Appliquer ou supprimer la classe dark sur le document
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    // Fonction pour synchroniser les données
    const handleSync = async () => {
        if (!isOnline) {
            toast.error('Vous êtes hors ligne. Impossible de synchroniser.');
            return;
        }

        try {
            setIsSyncing(true);
            toast.loading('Synchronisation en cours...');
            const result = await syncData();
            toast.dismiss();

            if (result > 0) {
                toast.success(`${result} collecte(s) synchronisée(s) avec succès`);
                if (result > 0) {
                    // Recharger la page après synchronisation
                    setTimeout(() => router.reload(), 1500);
                }
            } else {
                toast.info('Aucune donnée à synchroniser');
            }
        } catch (error) {
            toast.dismiss();
            console.error('Erreur de synchronisation:', error);
            toast.error('Erreur lors de la synchronisation');
        } finally {
            setIsSyncing(false);
        }
    };

    // Basculer le mode sombre
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    // Formatage des valeurs numériques
    const formatValue = (value: string | number) => {
        if (typeof value === 'number') {
            return value.toLocaleString('fr-FR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        }
        return value;
    };

    // Obtenir le libellé d'une catégorie
    const getCategoryLabel = (categoryId: string): string => {
        const categoryLabels: Record<string, string> = {
            'financier': 'Indicateurs Financiers',
            'commercial': 'Indicateurs Commerciaux',
            'production': 'Production',
            'rh': 'Ressources Humaines',
            'tresorerie': 'Trésorerie'
        };

        return categoryLabels[categoryId] || categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
    };

    // Fonction pour gérer l'impression
    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            toast.error("Impossible d'ouvrir la fenêtre d'impression. Veuillez vérifier vos paramètres de navigateur.");
            return;
        }

        const logoUrl = `${window.location.origin}/logo.png`;
        // Contenu HTML à imprimer
        let printContent = `
        <html>
         <head>
        <title>Collecte - ${collecte.entreprise.nom_entreprise}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { display: flex; align-items: center; margin-bottom: 20px; }
          .logo { width: 120px; height: auto; margin-right: 20px; }
          .title-container { flex-grow: 1; }
          h1 { color: #2c5282; font-size: 20px; margin: 0; }
          .subtitle { color: #4a5568; font-size: 14px; margin-top: 5px; }
          h2 { color: #4a5568; font-size: 16px; margin-top: 20px; }
          .info-section { margin-bottom: 20px; border: 1px solid #e2e8f0; border-radius: 6px; padding: 15px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
          .info-row { display: flex; justify-content: space-between; border-bottom: 1px solid #edf2f7; padding: 8px 0; }
          .label { font-weight: bold; color: #4a5568; }
          .value { text-align: right; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background-color: #4F81BD; color: white; text-align: left; padding: 8px; }
          td { border-bottom: 1px solid #e2e8f0; padding: 8px; }
          .brouillon { color: #d97706; font-style: italic; }
          .standard { color: #059669; }
          @media print {
            .no-print { display: none; }
            body { margin: 0; padding: 15px; }
          }
        </style>
      </head>
          <body>
           <div class="header">
          <img src="${logoUrl}" alt="Logo" class="logo" />
          <div class="title-container">
            <h1>Détails de la collecte - ${collecte.entreprise.nom_entreprise}</h1>
            <div class="subtitle">Période: ${collecte.periode.type_periode} | Exercice: ${collecte.exercice.annee}</div>
          </div>
        </div>
            <h1>Détails de la collecte - ${collecte.entreprise.nom_entreprise}</h1>
            <div class="info-section">
              <h2>Informations de la Collecte</h2>
              <div class="info-grid">
                <div class="info-row">
                  <span class="label">Date de collecte:</span>
                  <span class="value">${formatDate(collecte.date_collecte)}</span>
                </div>
                <div class="info-row">
                  <span class="label">Statut:</span>
                  <span class="value ${collecte.type_collecte === 'brouillon' ? 'brouillon' : 'standard'}">
                    ${collecte.type_collecte === 'brouillon' ? 'Brouillon' : 'Standard'}
                  </span>
                </div>
                <div class="info-row">
                  <span class="label">Créée par:</span>
                  <span class="value">${collecte.user?.name || 'Non spécifié'}</span>
                </div>
                <div class="info-row">
                  <span class="label">Créée le:</span>
                  <span class="value">${formatDate(collecte.created_at)}</span>
                </div>
              </div>
            </div>

            <div class="info-section">
              <h2>Informations de l'Entreprise</h2>
              <div class="info-grid">
                <div class="info-row">
                  <span class="label">Nom:</span>
                  <span class="value">${collecte.entreprise.nom_entreprise}</span>
                </div>
                ${collecte.entreprise.secteur_activite ? `
                <div class="info-row">
                  <span class="label">Secteur d'activité:</span>
                  <span class="value">${collecte.entreprise.secteur_activite}</span>
                </div>
                ` : ''}
              </div>
            </div>
        `;

        // Ajouter les données par catégorie
        categoriesDisponibles.forEach(category => {
            const categoryData = collecte.donnees[category];
            if (categoryData && Object.keys(categoryData).length > 0) {
                printContent += `
                <h2>${getCategoryLabel(category)}</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Indicateur</th>
                      <th>Valeur</th>
                    </tr>
                  </thead>
                  <tbody>
                `;

                Object.entries(categoryData).forEach(([key, value]) => {
                    printContent += `
                    <tr>
                      <td>${key}</td>
                      <td>${formatValue(value)}</td>
                    </tr>
                    `;
                });

                printContent += `
                  </tbody>
                </table>
                `;
            }
        });

        // Fermer le document HTML
        printContent += `
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

    // Fonction pour exporter en PDF
    const handleExportPDF = () => {
        window.location.href = route('collectes.export', {
            format: 'pdf',
            collecte_ids: [collecte.id],
            mode: 'detail' // Indique que c'est un export de détail
        });
    };

    // Gestion de la suppression
    const handleDelete = () => {
        if (confirmDelete) {
            router.delete(route('collectes.destroy', collecte.id), {
                onSuccess: () => {
                    toast.success('Collecte supprimée avec succès');
                    router.visit(route('collectes.index'));
                },
                onError: () => {
                    toast.error("Échec de la suppression de la collecte");
                    setConfirmDelete(false);
                },
            });
        } else {
            setConfirmDelete(true);
            toast.info("Cliquez à nouveau pour confirmer la suppression");

            setTimeout(() => {
                setConfirmDelete(false);
            }, 3000);
        }
    };

    // Fonction pour convertir un brouillon en collecte standard
    const handleConvertToStandard = () => {
        if (confirmConversion) {
            setIsConverting(true);

            router.put(route('collectes.convert-to-standard', collecte.id), {}, {
                onSuccess: () => {
                    toast.success('Brouillon converti en collecte standard avec succès');
                    // Rechargement de la page pour refléter le changement de statut
                    router.reload();
                },
                onError: (errors) => {
                    if (errors.general) {
                        toast.error(errors.general);
                    } else if (errors.message) {
                        toast.error(errors.message);
                    } else {
                        toast.error("Échec de la conversion du brouillon");
                    }
                    setIsConverting(false);
                    setConfirmConversion(false);
                },
                onFinish: () => {
                    setIsConverting(false);
                    setConfirmConversion(false);
                }
            });
        } else {
            setConfirmConversion(true);
            toast.info("Cliquez à nouveau pour confirmer la conversion en collecte standard");

            setTimeout(() => {
                setConfirmConversion(false);
            }, 3000);
        }
    };

    return (
        <AppLayout title={pageTitle}>
            <Head title={pageTitle} />

            <div className={`py-12 transition-colors duration-200 ${darkMode ? 'dark' : ''}`}>
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 shadow-lg overflow-hidden sm:rounded-xl">
                        {/* En-tête */}
                        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-5 relative">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-3">
                                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white flex items-center">
                                        Détails de la collecte
                                        {collecte.type_collecte === 'brouillon' && (
                                            <span className="ml-2 px-2.5 py-1 text-xs bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 rounded-full">
                                                Brouillon
                                            </span>
                                        )}
                                    </h2>

                                    {/* Indicateur de connexion */}
                                    {isOnline ? (
                                        <span className="inline-flex items-center text-green-600 dark:text-green-400 text-sm">
                                            <WifiIcon className="w-4 h-4 mr-1" />
                                            En ligne
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center text-yellow-600 dark:text-yellow-400 text-sm">
                                            <WifiOffIcon className="w-4 h-4 mr-1" />
                                            Hors ligne
                                        </span>
                                    )}

                                    {/* Bouton de synchronisation */}
                                    {pendingUploads > 0 && isOnline && (
                                        <button
                                            onClick={handleSync}
                                            disabled={isSyncing || !isOnline}
                                            className="inline-flex items-center text-xs bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 text-white px-3 py-1 rounded-full disabled:opacity-50"
                                        >
                                            <RefreshCcw className={`w-3 h-3 mr-1 ${isSyncing ? 'animate-spin' : ''}`} />
                                            {isSyncing ? 'Synchronisation...' : `Synchroniser (${pendingUploads})`}
                                        </button>
                                    )}
                                </div>

                                {/* Bouton de basculement du mode sombre */}
                                <button
                                    onClick={toggleDarkMode}
                                    className="absolute right-6 top-5 p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                    aria-label={darkMode ? "Activer le mode clair" : "Activer le mode sombre"}
                                >
                                    {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                                </button>

                                <div className="flex space-x-2">
                                    {/* Bouton d'impression */}
                                    <button
                                        onClick={handlePrint}
                                        className="inline-flex items-center px-5 py-3 border-2 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 shadow-md transition-colors"
                                    >
                                        <PrinterIcon className="w-4 h-4 mr-2" />
                                        Imprimer
                                    </button>

                                    {/* Bouton d'export PDF */}
                                    <button
                                        onClick={handleExportPDF}
                                        className="inline-flex items-center px-5 py-3 border-2 border-gray-600 dark:border-gray-400 bg-gray-700 dark:bg-gray-600 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-500 shadow-md transition-colors"
                                    >
                                        <FileTextIcon className="w-4 h-4 mr-2" />
                                        Exporter PDF
                                    </button>

                                    {/* Bouton de conversion pour les brouillons */}
                                    {collecte.type_collecte === 'brouillon' && (
                                        <button
                                            onClick={handleConvertToStandard}
                                            disabled={isConverting || !isOnline}
                                            className={`inline-flex items-center px-5 py-3 rounded-lg border-2 shadow-md text-white
                                                ${confirmConversion
                                                    ? 'bg-green-800 dark:bg-green-700 border-green-900 dark:border-green-600 hover:bg-green-900 dark:hover:bg-green-600'
                                                    : 'bg-green-600 dark:bg-green-500 border-green-700 dark:border-green-400 hover:bg-green-700 dark:hover:bg-green-400'
                                                } ${(isConverting || !isOnline) ? 'opacity-75 cursor-not-allowed' : ''} transition-colors`}
                                        >
                                            <CheckCircleIcon className="w-4 h-4 mr-2" />
                                            {isConverting
                                                ? 'Conversion...'
                                                : confirmConversion
                                                    ? 'Confirmer'
                                                    : 'Convertir en standard'
                                            }
                                            {!isOnline && <WifiOffIcon className="w-3 h-3 ml-1 text-amber-300" />}
                                        </button>
                                    )}

                                    <Link
                                        href={route('collectes.edit', collecte.id)}
                                        className="inline-flex items-center px-5 py-3 border-2 border-blue-600 dark:border-blue-400 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-400 shadow-md transition-colors"
                                    >
                                        <PencilIcon className="w-4 h-4 mr-2" />
                                        Modifier
                                    </Link>

                                    <button
                                        onClick={handleDelete}
                                        disabled={!isOnline}
                                        className={`inline-flex items-center px-5 py-3 rounded-lg border-2 shadow-md text-white
                                            ${confirmDelete
                                                ? 'bg-red-800 dark:bg-red-700 border-red-900 dark:border-red-600 hover:bg-red-900 dark:hover:bg-red-600'
                                                : 'bg-red-600 dark:bg-red-500 border-red-700 dark:border-red-400 hover:bg-red-700 dark:hover:bg-red-400'
                                            } ${!isOnline ? 'opacity-75 cursor-not-allowed' : ''} transition-colors`}
                                    >
                                        <TrashIcon className="w-4 h-4 mr-2" />
                                        {confirmDelete ? 'Confirmer' : 'Supprimer'}
                                        {!isOnline && <WifiOffIcon className="w-3 h-3 ml-1 text-amber-300" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            {/* Bouton retour */}
                            <div className="mb-6">
                                <Link
                                    href={route('collectes.index')}
                                    className="inline-flex items-center px-5 py-3 bg-gray-800 dark:bg-gray-700 text-white border-2 border-gray-800 dark:border-gray-600 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 shadow-md transition-colors"
                                >
                                    <ArrowLeftIcon className="w-4 h-4 mr-2" />
                                    Retour à la liste
                                </Link>
                            </div>

                            {/* Message de statut brouillon */}
                            {collecte.type_collecte === 'brouillon' && (
                                <div className="bg-amber-50 dark:bg-amber-900/30 border-2 border-amber-200 dark:border-amber-700 rounded-lg p-4 mb-6">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-amber-400 dark:text-amber-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300">
                                                Cette collecte est en mode brouillon
                                            </h3>
                                            <div className="mt-2 text-sm text-amber-700 dark:text-amber-400">
                                                <p>
                                                    Les collectes en mode brouillon ne sont pas comptabilisées dans les analyses.
                                                    Vous pouvez la convertir en collecte standard en utilisant le bouton "Convertir en standard".
                                                    {!isOnline && (
                                                        <span className="block mt-2 text-amber-600 dark:text-amber-300 font-medium">
                                                            <WifiOffIcon className="w-3 h-3 inline-block mr-1" />
                                                            La conversion n'est pas disponible en mode hors ligne.
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Informations générales */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                {/* Informations de la collecte */}
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border-2 border-gray-200 dark:border-gray-600 shadow-md">
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Informations de la Collecte</h3>
                                    <dl className="grid grid-cols-1 gap-3">
                                        <div className="flex justify-between">
                                            <dt className="font-medium text-gray-500 dark:text-gray-300">Date de collecte</dt>
                                            <dd className="text-gray-900 dark:text-gray-100">{formatDate(collecte.date_collecte)}</dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="font-medium text-gray-500 dark:text-gray-300">Statut</dt>
                                            <dd className="text-gray-900 dark:text-gray-100">
                                                {collecte.type_collecte === 'brouillon'
                                                    ? <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 rounded-full text-xs">Brouillon</span>
                                                    : <span className="px-2.5 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs">Standard</span>
                                                }
                                            </dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="font-medium text-gray-500 dark:text-gray-300">Créée par</dt>
                                            <dd className="text-gray-900 dark:text-gray-100">{collecte.user?.name || 'Non spécifié'}</dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="font-medium text-gray-500 dark:text-gray-300">Créée le</dt>
                                            <dd className="text-gray-900 dark:text-gray-100">{formatDate(collecte.created_at)}</dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="font-medium text-gray-500 dark:text-gray-300">Dernière modification</dt>
                                            <dd className="text-gray-900 dark:text-gray-100">{formatDate(collecte.updated_at)}</dd>
                                        </div>
                                    </dl>
                                </div>

                                {/* Informations de l'entreprise */}
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border-2 border-gray-200 dark:border-gray-600 shadow-md">
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Informations de l'Entreprise</h3>
                                    <dl className="grid grid-cols-1 gap-3">
                                        <div className="flex justify-between">
                                            <dt className="font-medium text-gray-500 dark:text-gray-300">Nom</dt>
                                            <dd className="text-gray-900 dark:text-gray-100">{collecte.entreprise.nom_entreprise}</dd>
                                        </div>
                                        {collecte.entreprise.secteur_activite && (
                                            <div className="flex justify-between">
                                                <dt className="font-medium text-gray-500 dark:text-gray-300">Secteur d'activité</dt>
                                                <dd className="text-gray-900 dark:text-gray-100">{collecte.entreprise.secteur_activite}</dd>
                                            </div>
                                        )}
                                    </dl>
                                </div>
                            </div>

                            {/* Données collectées */}
                            <div className="mt-8">
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Données Collectées</h3>

                                {/* Onglets des catégories */}
                                <div className="border-b border-gray-200 dark:border-gray-700">
                                    <nav className="-mb-px flex flex-wrap space-x-4">
                                        {categoriesDisponibles.map(category => (
                                            <button
                                                key={category}
                                                onClick={() => setActiveTab(category)}
                                                className={`
                                                    py-3 px-4 border-b-2 font-medium text-sm rounded-t-lg
                                                    ${activeTab === category
                                                        ? 'border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30'
                                                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'}
                                                `}
                                            >
                                                {getCategoryLabel(category)}
                                            </button>
                                        ))}
                                    </nav>
                                </div>

                                {/* Contenu de l'onglet actif */}
                                <div className="mt-6">
                                    {collecte.donnees[activeTab] ? (
                                        <div className="bg-white dark:bg-gray-800 shadow-lg overflow-hidden sm:rounded-lg border-2 border-gray-200 dark:border-gray-700">
                                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                                <thead className="bg-gray-50 dark:bg-gray-700">
                                                    <tr>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                            Indicateur
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                            Valeur
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                    {Object.entries(collecte.donnees[activeTab]).map(([key, value]) => (
                                                        <tr key={key} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                                {key}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                                {formatValue(value)}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="text-center bg-gray-50 dark:bg-gray-700 rounded-lg p-8 border-2 border-gray-200 dark:border-gray-600">
                                            <p className="text-gray-500 dark:text-gray-400">
                                                Aucune donnée disponible pour cette catégorie.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default CollecteShow;
