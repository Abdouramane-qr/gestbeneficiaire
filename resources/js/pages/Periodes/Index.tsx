// // import React, { useState } from 'react';
// // import { Head, Link, router } from '@inertiajs/react';
// // import { PageProps } from '@/types';
// // import AppLayout from '@/layouts/app-layout';
// // import { Toaster } from 'sonner';

// // interface Periode {
// //     id: number;
// //     exercice_id: number;
// //     exercice: {
// //         id: number;
// //         annee: number;
// //     };
// //     code: string;
// //     nom: string;
// //     type_periode: string;
// //     numero: number;
// //     date_debut: string;
// //     date_fin: string;
// //     cloturee: boolean;
// // }

// // interface Exercice {
// //     id: number;
// //     annee: number;
// //     actif: boolean;
// // }

// // interface PeriodeIndexProps extends PageProps {
// //     periodes: {
// //         data: Periode[];
// //         links: any[];
// //         current_page: number;
// //         last_page: number;
// //     };
// //     exercices: Exercice[];
// // }

// // export default function Index({ periodes }: PeriodeIndexProps) {
// //     const [deleteModalOpen, setDeleteModalOpen] = useState(false);
// //     const [periodeToDelete, setPeriodeToDelete] = useState<number | null>(null);

// //     const formatDate = (dateString: string) => {
// //         const date = new Date(dateString);
// //         return date.toLocaleDateString('fr-FR');
// //     };

// //     const confirmDelete = (id: number) => {
// //         setPeriodeToDelete(id);
// //         setDeleteModalOpen(true);
// //     };

// //     const deletePeriode = () => {
// //         if (periodeToDelete) {
// //             router.delete(route('periodes.destroy', periodeToDelete), {
// //                 onSuccess: () => {
// //                     setDeleteModalOpen(false);
// //                     setPeriodeToDelete(null);
// //                 },
// //             });
// //         }
// //     };

// //     const cloturer = (id: number) => {
// //         router.patch(route('periodes.cloture', id));
// //     };

// //     const rouvrir = (id: number) => {
// //         router.patch(route('periodes.reouverture', id));
// //     };

// //     return (
// //         <AppLayout  title='Gestion des périodes'>
// //             <Head title="Gestion des périodes" />
// //       <Toaster position="top-right" richColors />

// //             <div className="py-12">
// //                 <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
// //                     <div className="flex justify-between items-center mb-6">
// //                         <h1 className="text-2xl font-semibold text-gray-900">Périodes</h1>
// //                         <Link
// //                             href={route('periodes.create')}
// //                             className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
// //                         >
// //                             Nouvelle période
// //                         </Link>
// //                     </div>

// //                     <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg">
// //                         <div className="overflow-x-auto">
// //                             <table className="min-w-full divide-y divide-gray-200">
// //                                 <thead className="bg-gray-50">
// //                                     <tr>
// //                                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                                             Exercice
// //                                         </th>
// //                                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                                             Code
// //                                         </th>
// //                                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                                             Nom
// //                                         </th>
// //                                         {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                                             Type
// //                                         </th> */}
// //                                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                                             Dates
// //                                         </th>
// //                                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                                             Statut
// //                                         </th>
// //                                         <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                                             Actions
// //                                         </th>
// //                                     </tr>
// //                                 </thead>
// //                                 <tbody className="bg-white divide-y divide-gray-200">
// //                                     {periodes.data.map((periode) => (
// //                                         <tr key={periode.id}>
// //                                             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
// //                                                 {periode.exercice.annee}
// //                                             </td>
// //                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// //                                                 {periode.code}
// //                                             </td>
// //                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// //                                                 {periode.nom}
// //                                             </td>
// //                                             {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// //                                                 {getTypePeriodeLabel(periode.type_periode)} {periode.numero}
// //                                             </td> */}
// //                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// //                                                 Du {formatDate(periode.date_debut)} au {formatDate(periode.date_fin)}
// //                                             </td>
// //                                             <td className="px-6 py-4 whitespace-nowrap">
// //                                                 <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${periode.cloturee ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
// //                                                     {periode.cloturee ? 'Clôturée' : 'En cours'}
// //                                                 </span>
// //                                             </td>
// //                                             <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
// //                                                 <div className="flex justify-end space-x-2">
// //                                                     {!periode.cloturee ? (
// //                                                         <button
// //                                                             onClick={() => cloturer(periode.id)}
// //                                                             className="text-indigo-600 hover:text-indigo-900"
// //                                                             title="Clôturer"
// //                                                         >
// //                                                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
// //                                                                 <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
// //                                                             </svg>
// //                                                         </button>
// //                                                     ) : (
// //                                                         <button
// //                                                             onClick={() => rouvrir(periode.id)}
// //                                                             className="text-green-600 hover:text-green-900"
// //                                                             title="Réouvrir"
// //                                                         >
// //                                                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
// //                                                                 <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
// //                                                             </svg>
// //                                                         </button>
// //                                                     )}

// //                                                     <Link
// //                                                         href={route('periodes.edit', periode.id)}
// //                                                         className="text-blue-600 hover:text-blue-900"
// //                                                         title="Modifier"
// //                                                     >
// //                                                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
// //                                                             <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
// //                                                         </svg>
// //                                                     </Link>

// //                                                     <button
// //                                                         onClick={() => confirmDelete(periode.id)}
// //                                                         className="text-red-600 hover:text-red-900"
// //                                                         title="Supprimer"
// //                                                     >
// //                                                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
// //                                                             <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
// //                                                         </svg>
// //                                                     </button>
// //                                                 </div>
// //                                             </td>
// //                                         </tr>
// //                                     ))}
// //                                 </tbody>
// //                             </table>
// //                         </div>

// //                         {/* Pagination */}
// //                         <div className="px-6 py-4 bg-white border-t border-gray-200">
// //                             <nav className="flex items-center justify-between">
// //                                 <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
// //                                     <div>
// //                                         <p className="text-sm text-gray-700">
// //                                             Affichage de <span className="font-medium">{periodes.data.length}</span> périodes
// //                                         </p>
// //                                     </div>
// //                                     <div>
// //                                         <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
// //                                             {periodes.links && periodes.links.map((link, i) => (
// //                                                 <Link
// //                                                     key={i}
// //                                                     href={link.url || ''} // Fournir une chaîne vide si url est null
// //                                                     className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
// //                                                         link.active
// //                                                             ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
// //                                                             : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
// //                                                     } ${!link.url ? 'cursor-not-allowed' : ''}`}
// //                                                     dangerouslySetInnerHTML={{ __html: link.label }}
// //                                                 />
// //                                             ))}
// //                                         </nav>
// //                                     </div>
// //                                 </div>
// //                             </nav>
// //                         </div>
// //                     </div>
// //                 </div>
// //             </div>

// //             {/* Modal de confirmation de suppression */}
// //             {deleteModalOpen && (
// //                 <div className="fixed z-10 inset-0 overflow-y-auto">
// //                     <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
// //                         <div className="fixed inset-0 transition-opacity" aria-hidden="true">
// //                             <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
// //                         </div>

// //                         <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

// //                         <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
// //                             <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
// //                                 <div className="sm:flex sm:items-start">
// //                                     <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
// //                                         <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
// //                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
// //                                         </svg>
// //                                     </div>
// //                                     <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
// //                                         <h3 className="text-lg leading-6 font-medium text-gray-900">
// //                                             Confirmer la suppression
// //                                         </h3>
// //                                         <div className="mt-2">
// //                                             <p className="text-sm text-gray-500">
// //                                                 Êtes-vous sûr de vouloir supprimer cette période? Cette action est irréversible.
// //                                             </p>
// //                                         </div>
// //                                     </div>
// //                                 </div>
// //                             </div>
// //                             <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
// //                                 <button
// //                                     type="button"
// //                                     className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
// //                                     onClick={deletePeriode}
// //                                 >
// //                                     Supprimer
// //                                 </button>
// //                                 <button
// //                                     type="button"
// //                                     className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
// //                                     onClick={() => setDeleteModalOpen(false)}
// //                                 >
// //                                     Annuler
// //                                 </button>
// //                             </div>
// //                         </div>
// //                     </div>
// //                 </div>
// //             )}
// //         </AppLayout>
// //     );
// // }
// import AppLayout from '@/layouts/app-layout';
// import { PageProps } from '@/types';
// import { Head, Link, router } from '@inertiajs/react';
// import { useState } from 'react';
// import { Toaster } from 'sonner';

// interface Periode {
//     id: number;
//     exercice_id: number;
//     exercice: {
//         id: number;
//         annee: number;
//     };
//     code: string;
//     nom: string;
//     type_periode: string;
//     numero: number;
//     date_debut: string;
//     date_fin: string;
//     cloturee: boolean;
// }

// interface StatistiquesPeriodes {
//     totalPeriodes: number;
//     periodeCourante: Periode | null;
//     prochainesPeriodes: Periode[];
//     historique: {
//         annee: number;
//         count: number;
//         clotureCount: number;
//     }[];
// }

// interface PeriodeIndexProps extends PageProps {
//     periodes: {
//         data: Periode[];
//         links: any[];
//         current_page: number;
//         last_page: number;
//     };
//     exercices: Array<{
//         id: number;
//         annee: number;
//         actif: boolean;
//     }>;
//     statistiques: StatistiquesPeriodes;
// }

// export default function Index({ periodes, exercices, statistiques }: PeriodeIndexProps) {
//     const [selectedAnnee, setSelectedAnnee] = useState<number>(0);
//     const [selectedType, setSelectedType] = useState<string>('');
//     const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//     const [periodeToDelete, setPeriodeToDelete] = useState<number | null>(null);

//     const formatDate = (dateString: string) => {
//         const date = new Date(dateString);
//         return date.toLocaleDateString('fr-FR');
//     };

//     const confirmDelete = (id: number) => {
//         setPeriodeToDelete(id);
//         setDeleteModalOpen(true);
//     };

//     const deletePeriode = () => {
//         if (periodeToDelete) {
//             router.delete(route('periodes.destroy', periodeToDelete), {
//                 onSuccess: () => {
//                     setDeleteModalOpen(false);
//                     setPeriodeToDelete(null);
//                 },
//             });
//         }
//     };

//     const cloturer = (id: number) => {
//         router.patch(route('periodes.cloture', id));
//     };

//     const rouvrir = (id: number) => {
//         router.patch(route('periodes.reouverture', id));
//     };

//     // Filtrer les périodes selon les critères sélectionnés
//     const filteredPeriodes = periodes.data.filter((periode) => {
//         if (selectedAnnee && periode.exercice.annee !== selectedAnnee) return false;
//         if (selectedType && periode.type_periode !== selectedType) return false;
//         return true;
//     });

//     // Grouper les périodes par année pour l'affichage
//     const periodesByAnnee = filteredPeriodes.reduce(
//         (acc, periode) => {
//             const annee = periode.exercice.annee;
//             if (!acc[annee]) acc[annee] = [];
//             acc[annee].push(periode);
//             return acc;
//         },
//         {} as Record<number, Periode[]>,
//     );

//     return (
//         <AppLayout title="Gestion des périodes">
//             <Head title="Gestion des périodes" />
//             <Toaster position="top-right" richColors />

//             <div className="py-12">
//                 <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
//                     {/* Statistiques rapides */}
//                     <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
//                         <div className="overflow-hidden rounded-lg bg-white p-4 shadow-md">
//                             <div className="text-sm text-gray-500">Total des périodes</div>
//                             <div className="text-2xl font-bold">{statistiques?.totalPeriodes ?? 0}</div>
//                         </div>
//                         <div className="overflow-hidden rounded-lg bg-white p-4 shadow-md">
//                             <div className="text-sm text-gray-500">Période courante</div>
//                             <div className="text-lg font-semibold">
//   {statistiques?.periodeCourante
//     ? `${statistiques.periodeCourante.nom} ${statistiques.periodeCourante.exercice?.annee ?? ''}`
//     : 'Aucune'}
// </div>

//                         </div>
//                         <div className="overflow-hidden rounded-lg bg-white p-4 shadow-md">
//                             <div className="text-sm text-gray-500">Prochaines périodes</div>
// {statistiques && (
//   <div className="text-2xl font-bold">
//     {statistiques.prochainesPeriodes.length}
//   </div>
// )}
//                         </div>
//                         <div className="overflow-hidden rounded-lg bg-white p-4 shadow-md">
//                             <div className="text-sm text-gray-500">Historique par année</div>
//                             <div className="text-sm">
//                                 {statistiques?.historique?.length > 0 && (
//   <div className="text-sm">
//     {statistiques.historique.map((h) => (
//       <div key={h.annee} className="flex justify-between">
//         <span>{h.annee}:</span>
//         <span>
//           {h.clotureCount}/{h.count}
//         </span>
//       </div>
//     ))}
//   </div>
// )}

//                             </div>
//                         </div>
//                     </div>

//                     {/* En-tête et filtres */}
//                     <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
//                         <div className="mb-4 flex flex-col items-start justify-between md:flex-row md:items-center">
//                             <h1 className="mb-4 text-2xl font-semibold text-gray-900 md:mb-0">Périodes</h1>
//                             <Link
//                                 href={route('periodes.create')}
//                                 className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-xs font-semibold tracking-widest text-white uppercase hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none active:bg-blue-900"
//                             >
//                                 Nouvelle période
//                             </Link>
//                         </div>

//                         {/* Filtres */}
//                         <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
//                             <div>
//                                 <label htmlFor="filterAnnee" className="block text-sm font-medium text-gray-700">
//                                     Filtrer par année
//                                 </label>
//                                 <select
//                                     id="filterAnnee"
//                                     value={selectedAnnee}
//                                     onChange={(e) => setSelectedAnnee(Number(e.target.value))}
//                                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                                 >
//                                     <option value="">Toutes les années</option>
//                                     {exercices.map((exercice) => (
//                                         <option key={exercice.id} value={exercice.annee}>
//                                             {exercice.annee}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>

//                             <div>
//                                 <label htmlFor="filterType" className="block text-sm font-medium text-gray-700">
//                                     Filtrer par type
//                                 </label>
//                                 <select
//                                     id="filterType"
//                                     value={selectedType}
//                                     onChange={(e) => setSelectedType(e.target.value)}
//                                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                                 >
//                                     <option value="">Tous les types</option>
//                                     <option value="mensuel">Mensuel</option>
//                                     <option value="trimestriel">Trimestriel</option>
//                                     <option value="semestriel">Semestriel</option>
//                                     <option value="annuel">Annuel</option>
//                                 </select>
//                             </div>

//                             <div className="flex items-end">
//                                 <button
//                                     onClick={() => {
//                                         setSelectedAnnee(0);
//                                         setSelectedType('');
//                                     }}
//                                     className="inline-flex items-center rounded-md border border-transparent bg-gray-300 px-4 py-2 text-xs font-semibold tracking-widest text-gray-700 uppercase hover:bg-gray-400 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
//                                 >
//                                     Réinitialiser
//                                 </button>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Périodes groupées par année */}
//                     {Object.keys(periodesByAnnee).length > 0 ? (
//                         Object.entries(periodesByAnnee)
//                             .sort(([anneeA], [anneeB]) => Number(anneeB) - Number(anneeA))
//                             .map(([annee, periodes]) => (
//                                 <div key={annee} className="mb-8">
//                                     <div className="mb-4 flex items-center">
//                                         <h2 className="text-xl font-semibold text-gray-800">{annee}</h2>
//                                         <span className="ml-4 text-sm text-gray-500">{periodes.length} période(s)</span>
//                                     </div>

//                                     <div className="overflow-hidden rounded-lg bg-white shadow-md">
//                                         <table className="min-w-full divide-y divide-gray-200">
//                                             <thead className="bg-gray-50">
//                                                 <tr>
//                                                     <th
//                                                         scope="col"
//                                                         className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
//                                                     >
//                                                         Code
//                                                     </th>
//                                                     <th
//                                                         scope="col"
//                                                         className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
//                                                     >
//                                                         Nom
//                                                     </th>
//                                                     <th
//                                                         scope="col"
//                                                         className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
//                                                     >
//                                                         Type
//                                                     </th>
//                                                     <th
//                                                         scope="col"
//                                                         className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
//                                                     >
//                                                         Dates
//                                                     </th>
//                                                     <th
//                                                         scope="col"
//                                                         className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
//                                                     >
//                                                         Statut
//                                                     </th>
//                                                     <th
//                                                         scope="col"
//                                                         className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase"
//                                                     >
//                                                         Actions
//                                                     </th>
//                                                 </tr>
//                                             </thead>
//                                             <tbody className="divide-y divide-gray-200 bg-white">
//                                                 {periodes.map((periode) => (
//                                                     <tr key={periode.id}>
//                                                         <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
//                                                             {periode.code}
//                                                         </td>
//                                                         <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">{periode.nom}</td>
//                                                         <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">{periode.type_periode}</td>
//                                                         <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
//                                                             Du {formatDate(periode.date_debut)} au {formatDate(periode.date_fin)}
//                                                         </td>
//                                                         <td className="px-6 py-4 whitespace-nowrap">
//                                                             <span
//                                                                 className={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${periode.cloturee ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
//                                                             >
//                                                                 {periode.cloturee ? 'Clôturée' : 'En cours'}
//                                                             </span>
//                                                         </td>
//                                                         <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
//                                                             <div className="flex justify-end space-x-2">
//                                                                 {!periode.cloturee ? (
//                                                                     <button
//                                                                         onClick={() => cloturer(periode.id)}
//                                                                         className="text-indigo-600 hover:text-indigo-900"
//                                                                         title="Clôturer"
//                                                                     >
//                                                                         <svg
//                                                                             xmlns="http://www.w3.org/2000/svg"
//                                                                             className="h-5 w-5"
//                                                                             viewBox="0 0 20 20"
//                                                                             fill="currentColor"
//                                                                         >
//                                                                             <path
//                                                                                 fillRule="evenodd"
//                                                                                 d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
//                                                                                 clipRule="evenodd"
//                                                                             />
//                                                                         </svg>
//                                                                     </button>
//                                                                 ) : (
//                                                                     <button
//                                                                         onClick={() => rouvrir(periode.id)}
//                                                                         className="text-green-600 hover:text-green-900"
//                                                                         title="Réouvrir"
//                                                                     >
//                                                                         <svg
//                                                                             xmlns="http://www.w3.org/2000/svg"
//                                                                             className="h-5 w-5"
//                                                                             viewBox="0 0 20 20"
//                                                                             fill="currentColor"
//                                                                         >
//                                                                             <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
//                                                                         </svg>
//                                                                     </button>
//                                                                 )}

//                                                                 <Link
//                                                                     href={route('periodes.edit', periode.id)}
//                                                                     className="text-blue-600 hover:text-blue-900"
//                                                                     title="Modifier"
//                                                                 >
//                                                                     <svg
//                                                                         xmlns="http://www.w3.org/2000/svg"
//                                                                         className="h-5 w-5"
//                                                                         viewBox="0 0 20 20"
//                                                                         fill="currentColor"
//                                                                     >
//                                                                         <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
//                                                                     </svg>
//                                                                 </Link>

//                                                                 <button
//                                                                     onClick={() => confirmDelete(periode.id)}
//                                                                     className="text-red-600 hover:text-red-900"
//                                                                     title="Supprimer"
//                                                                 >
//                                                                     <svg
//                                                                         xmlns="http://www.w3.org/2000/svg"
//                                                                         className="h-5 w-5"
//                                                                         viewBox="0 0 20 20"
//                                                                         fill="currentColor"
//                                                                     >
//                                                                         <path
//                                                                             fillRule="evenodd"
//                                                                             d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
//                                                                             clipRule="evenodd"
//                                                                         />
//                                                                     </svg>
//                                                                 </button>
//                                                             </div>
//                                                         </td>
//                                                     </tr>
//                                                 ))}
//                                             </tbody>
//                                         </table>
//                                     </div>
//                                 </div>
//                             ))
//                     ) : (
//                         <div className="rounded-lg bg-gray-50 py-12 text-center">
//                             <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     strokeWidth={2}
//                                     d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C20.832 18.477 19.247 18 17.5 18c-1.746 0-3.332.477-4.5 1.253"
//                                 />
//                             </svg>
//                             <h3 className="mt-4 text-sm font-medium text-gray-900">Aucune période trouvée</h3>
//                             <p className="mt-1 text-sm text-gray-500">
//                                 {selectedAnnee || selectedType
//                                     ? 'Aucune période ne correspond aux filtres sélectionnés.'
//                                     : 'Commencez par créer votre première période.'}
//                             </p>
//                             {!selectedAnnee && !selectedType && (
//                                 <div className="mt-6">
//                                     <Link
//                                         href={route('periodes.create')}
//                                         className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
//                                     >
//                                         <svg
//                                             className="mr-2 -ml-1 h-5 w-5"
//                                             xmlns="http://www.w3.org/2000/svg"
//                                             viewBox="0 0 20 20"
//                                             fill="currentColor"
//                                         >
//                                             <path
//                                                 fillRule="evenodd"
//                                                 d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
//                                                 clipRule="evenodd"
//                                             />
//                                         </svg>
//                                         Nouvelle période
//                                     </Link>
//                                 </div>
//                             )}
//                         </div>
//                     )}

//                     {/* Pagination */}
//                     {periodes.links && periodes.links.length > 3 && (
//                         <div className="rounded-lg border-t border-gray-200 bg-white px-6 py-4 shadow-md">
//                             <nav className="flex items-center justify-between">
//                                 <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
//                                     <div>
//                                         <p className="text-sm text-gray-700">
//                                             Affichage de <span className="font-medium">{periodes.data.length}</span> périodes
//                                         </p>
//                                     </div>
//                                     <div>
//                                         <nav className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
//                                             {periodes.links.map((link, i) => (
//                                                 <Link
//                                                     key={i}
//                                                     href={link.url || ''}
//                                                     className={`relative inline-flex items-center border px-4 py-2 text-sm font-medium ${
//                                                         link.active
//                                                             ? 'z-10 border-blue-500 bg-blue-50 text-blue-600'
//                                                             : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
//                                                     } ${!link.url ? 'cursor-not-allowed' : ''}`}
//                                                     dangerouslySetInnerHTML={{ __html: link.label }}
//                                                 />
//                                             ))}
//                                         </nav>
//                                     </div>
//                                 </div>
//                             </nav>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* Modal de confirmation de suppression */}
//             {deleteModalOpen && (
//                 <div className="fixed inset-0 z-10 overflow-y-auto">
//                     <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
//                         <div className="fixed inset-0 transition-opacity" aria-hidden="true">
//                             <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
//                         </div>

//                         <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
//                             &#8203;
//                         </span>

//                         <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
//                             <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//                                 <div className="sm:flex sm:items-start">
//                                     <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
//                                         <svg
//                                             className="h-6 w-6 text-red-600"
//                                             xmlns="http://www.w3.org/2000/svg"
//                                             fill="none"
//                                             viewBox="0 0 24 24"
//                                             stroke="currentColor"
//                                             aria-hidden="true"
//                                         >
//                                             <path
//                                                 strokeLinecap="round"
//                                                 strokeLinejoin="round"
//                                                 strokeWidth="2"
//                                                 d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
//                                             />
//                                         </svg>
//                                     </div>
//                                     <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
//                                         <h3 className="text-lg leading-6 font-medium text-gray-900">Confirmer la suppression</h3>
//                                         <div className="mt-2">
//                                             <p className="text-sm text-gray-500">
//                                                 Êtes-vous sûr de vouloir supprimer cette période? Cette action est irréversible.
//                                             </p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
//                                 <button
//                                     type="button"
//                                     className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
//                                     onClick={deletePeriode}
//                                 >
//                                     Supprimer
//                                 </button>
//                                 <button
//                                     type="button"
//                                     className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
//                                     onClick={() => setDeleteModalOpen(false)}
//                                 >
//                                     Annuler
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </AppLayout>
//     );
// }


import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Toaster } from 'sonner';

interface Periode {
    id: number;
    exercice_id: number;
    exercice: {
        id: number;
        annee: number;
    };
    code: string;
    nom: string;
    type_periode: string;
    numero: number;
    date_debut: string;
    date_fin: string;
    cloturee: boolean;
}

interface StatistiquesPeriodes {
    totalPeriodes: number;
    periodeCourante: Periode | null;
    prochainesPeriodes: Periode[];
    historique: {
        annee: number;
        count: number;
        clotureCount: number;
    }[];
}

interface PeriodeIndexProps extends PageProps {
    periodes: {
        data: Periode[];
        links: any[];
        current_page: number;
        last_page: number;
    };
    exercices: Array<{
        id: number;
        annee: number;
        actif: boolean;
    }>;
    statistiques?: StatistiquesPeriodes;
}

export default function Index({ periodes, exercices, statistiques }: PeriodeIndexProps) {
    const [selectedAnnee, setSelectedAnnee] = useState<number>(0);
    const [selectedType, setSelectedType] = useState<string>('');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [periodeToDelete, setPeriodeToDelete] = useState<number | null>(null);

    // Vérifiez si les données sont vides

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR');
    };

    const confirmDelete = (id: number) => {
        setPeriodeToDelete(id);
        setDeleteModalOpen(true);
    };

    const deletePeriode = () => {
        if (periodeToDelete) {
            router.delete(route('periodes.destroy', periodeToDelete), {
                onSuccess: () => {
                    setDeleteModalOpen(false);
                    setPeriodeToDelete(null);
                },
            });
        }
    };

    const cloturer = (id: number) => {
        router.patch(route('periodes.cloture', id));
    };

    const rouvrir = (id: number) => {
        router.patch(route('periodes.reouverture', id));
    };

    // Filtrer les périodes selon les critères sélectionnés
    const filteredPeriodes = periodes?.data?.filter(periode => {
        if (selectedAnnee && periode.exercice.annee !== selectedAnnee) return false;
        if (selectedType && periode.type_periode !== selectedType) return false;
        return true;
    }) || [];

    // Grouper les périodes par année pour l'affichage
    const periodesByAnnee = filteredPeriodes.reduce((acc, periode) => {
        const annee = periode.exercice.annee;
        if (!acc[annee]) acc[annee] = [];
        acc[annee].push(periode);
        return acc;
    }, {} as Record<number, Periode[]>);

    return (
        <AppLayout title='Gestion des périodes'>
            <Head title="Gestion des périodes" />
            <Toaster position="top-right" richColors />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Statistiques rapides */}
                    {statistiques && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-md rounded-lg p-4">
                                <div className="text-sm text-gray-500 dark:text-gray-400">Total des périodes</div>
                                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{statistiques.totalPeriodes}</div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-md rounded-lg p-4">
                                <div className="text-sm text-gray-500 dark:text-gray-400">Période courante</div>
                                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    {statistiques.periodeCourante ?
                                        `${statistiques.periodeCourante.nom} ${statistiques.periodeCourante.exercice.annee}` :
                                        'Aucune'}
                                </div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-md rounded-lg p-4">
                                <div className="text-sm text-gray-500 dark:text-gray-400">Prochaines périodes</div>
                                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{statistiques.prochainesPeriodes.length}</div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-md rounded-lg p-4">
                                <div className="text-sm text-gray-500 dark:text-gray-400">Historique par année</div>
                                <div className="text-sm text-gray-700 dark:text-gray-300">
                                    {statistiques.historique.map(h => (
                                        <div key={h.annee} className="flex justify-between">
                                            <span>{h.annee}:</span>
                                            <span>{h.clotureCount}/{h.count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* En-tête et filtres */}
                    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4 sm:mb-0">Périodes</h1>
                            <Link
                                href={route('periodes.create')}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                            >
                                Nouvelle période
                            </Link>
                        </div>

                        {/* Filtres */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="filterAnnee" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Filtrer par année
                                </label>
                                <select
                                    id="filterAnnee"
                                    value={selectedAnnee}
                                    onChange={(e) => setSelectedAnnee(Number(e.target.value))}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="0">Toutes les années</option>
                                    {exercices.map(exercice => (
                                        <option key={exercice.id} value={exercice.annee}>
                                            {exercice.annee}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="filterType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Filtrer par type
                                </label>
                                <select
                                    id="filterType"
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="">Tous les types</option>
                                    <option value="mensuel">Mensuel</option>
                                    <option value="trimestriel">Trimestriel</option>
                                    <option value="semestriel">Semestriel</option>
                                    <option value="annuel">Annuel</option>
                                </select>
                            </div>

                            <div className="flex items-end">
                                <button
                                    onClick={() => {
                                        setSelectedAnnee(0);
                                        setSelectedType('');
                                    }}
                                    className="inline-flex items-center px-4 py-2 bg-gray-300 dark:bg-gray-600 border border-transparent rounded-md font-semibold text-xs text-gray-700 dark:text-gray-200 uppercase tracking-widest hover:bg-gray-400 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition"
                                >
                                    Réinitialiser
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Périodes groupées par année */}
                    {Object.keys(periodesByAnnee).length > 0 ? (
                        Object.entries(periodesByAnnee)
                            .sort(([anneeA], [anneeB]) => Number(anneeB) - Number(anneeA))
                            .map(([annee, periodes]) => (
                                <div key={annee} className="mb-8">
                                    <div className="flex items-center mb-4">
                                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{annee}</h2>
                                        <span className="ml-4 text-sm text-gray-500 dark:text-gray-400">
                                            {periodes.length} période(s)
                                        </span>
                                    </div>

                                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-md rounded-lg">
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                                <thead className="bg-gray-50 dark:bg-gray-700">
                                                    <tr>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                            Code
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                            Nom
                                                        </th>
                                                        <th scope="col" className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                            Type
                                                        </th>
                                                        <th scope="col" className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                            Dates
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                            Statut
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                            Actions
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                    {periodes.map((periode) => (
                                                        <tr key={periode.id}>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                                                {periode.code}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                {periode.nom}
                                                            </td>
                                                            <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                {periode.type_periode}
                                                            </td>
                                                            <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                Du {formatDate(periode.date_debut)} au {formatDate(periode.date_fin)}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${periode.cloturee ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200'}`}>
                                                                    {periode.cloturee ? 'Clôturée' : 'En cours'}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                <div className="flex justify-end space-x-2">
                                                                    {!periode.cloturee ? (
                                                                        <button
                                                                            onClick={() => cloturer(periode.id)}
                                                                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                                            title="Clôturer"
                                                                        >
                                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                                                            </svg>
                                                                        </button>
                                                                    ) : (
                                                                        <button
                                                                            onClick={() => rouvrir(periode.id)}
                                                                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                                                            title="Réouvrir"
                                                                        >
                                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                                <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
                                                                            </svg>
                                                                        </button>
                                                                    )}

                                                                    <Link
                                                                        href={route('periodes.edit', periode.id)}
                                                                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                                                        title="Modifier"
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                                        </svg>
                                                                    </Link>

                                                                    <button
                                                                        onClick={() => confirmDelete(periode.id)}
                                                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                                        title="Supprimer"
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            ))
                    ) : (
                        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C20.832 18.477 19.247 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <h3 className="mt-4 text-sm font-medium text-gray-900 dark:text-gray-100">Aucune période trouvée</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {selectedAnnee || selectedType ?
                                    'Aucune période ne correspond aux filtres sélectionnés.' :
                                    'Commencez par créer votre première période.'}
                            </p>
                            {!selectedAnnee && !selectedType && (
                                <div className="mt-6">
                                    <Link
                                        href={route('periodes.create')}
                                        className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
                                    >
                                        <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                        </svg>
                                        Nouvelle période
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Pagination */}
                    {periodes?.links && periodes.links.length > 3 && (
                        <div className="px-6 py-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 rounded-lg shadow-md">
                            <nav className="flex items-center justify-between">
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            Affichage de <span className="font-medium">{periodes.data.length}</span> périodes
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                            {periodes.links.map((link, i) => (
                                                <Link
                                                    key={i}
                                                    href={link.url || ''}
                                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition ${
                                                        link.active
                                                            ? 'z-10 bg-blue-50 dark:bg-blue-800 border-blue-500 dark:border-blue-600 text-blue-600 dark:text-blue-300'
                                                            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                                    } ${!link.url ? 'cursor-not-allowed' : ''}`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ))}
                                        </nav>
                                    </div>
                                </div>
                            </nav>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de confirmation de suppression */}
            {deleteModalOpen && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
                        </div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-800/20 sm:mx-0 sm:h-10 sm:w-10">
                                        <svg className="h-6 w-6 text-red-600 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                                            Confirmer la suppression
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Êtes-vous sûr de vouloir supprimer cette période? Cette action est irréversible.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm transition"
                                    onClick={deletePeriode}
                                >
                                    Supprimer
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition"
                                    onClick={() => setDeleteModalOpen(false)}
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
