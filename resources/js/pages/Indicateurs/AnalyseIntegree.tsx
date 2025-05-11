// // // resources/js/Pages/Indicateurs/AnalyseIntegree.tsx
// // import React, { useState, useEffect, useMemo } from 'react';
// // import { Head, Link } from '@inertiajs/react';
// // import AppLayout from '@/layouts/app-layout';
// // import axios from 'axios';
// // import { PageProps } from '@/types';
// // import {
// //   BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
// //   CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
// // } from 'recharts';

// // // Types
// // interface Indicateur {
// //   id: string;
// //   label: string;
// //   value: number;
// //   target: number;
// //   evolution: string;
// //   unite: string;
// //   definition: string;
// //   is_calculated?: boolean;
// //   metadata?: {
// //     entreprise_ids: number[];
// //     collecte_ids: number[];
// //     periodes: string[];
// //     nombre_points_donnees: number;
// //     demo?: boolean;
// //   };
// // }

// // interface IndicateursParCategorie {
// //   [categorie: string]: Indicateur[];
// // }

// // interface Exercice {
// //   id: number;
// //   annee: number;
// //   date_debut: string;
// //   date_fin: string;
// //   actif: boolean;
// // }

// // interface Entreprise {
// //   id: number;
// //   nom_entreprise: string;
// //   secteur_activite: string;
// // }

// // // Props pour le composant
// // interface AnalyseIntegreeProps extends PageProps {
// //   exercices: Exercice[];
// //   entreprises: Entreprise[];
// //   defaultExerciceId: number | null;
// //   defaultPeriodeType: string;
// //   periodes: string[];
// // }

// // const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// // const AnalyseIntegree: React.FC<AnalyseIntegreeProps> = ({
// //   auth,
// //   exercices,
// //   entreprises,
// //   defaultExerciceId,
// //   defaultPeriodeType,
// //   periodes
// // }) => {
// //   // États pour les filtres
// //   const [selectedPeriode, setSelectedPeriode] = useState<string>(defaultPeriodeType);
// //   const [selectedExerciceId, setSelectedExerciceId] = useState<number | null>(defaultExerciceId);
// //   const [selectedEntrepriseId, setSelectedEntrepriseId] = useState<number | null>(null);
// //   const [selectedCategorie, setSelectedCategorie] = useState<string>('');

// //   // États pour les données
// //   const [indicateursData, setIndicateursData] = useState<IndicateursParCategorie>({});
// //   const [isLoading, setIsLoading] = useState<boolean>(true);
// //   const [error, setError] = useState<string | null>(null);
// //   const [isDemoData, setIsDemoData] = useState<boolean>(false);
// //   const [noData, setNoData] = useState<boolean>(false);

// //   // État pour la visualisation
// //   const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');

// //   // Effet pour charger les données initiales
// //   useEffect(() => {
// //     fetchIndicateursData();
// //   }, [selectedPeriode, selectedExerciceId, selectedEntrepriseId]);

// //   const fetchIndicateursData = async () => {
// //     try {
// //       setIsLoading(true);
// //       setError(null);
// //       setIsDemoData(false);
// //       setNoData(false);

// //       const response = await axios.get('/api/indicateurs/analyse', {
// //         params: {
// //           periode_type: selectedPeriode,
// //           exercice_id: selectedExerciceId,
// //           entreprise_id: selectedEntrepriseId
// //         },
// //         headers: {
// //           'Accept': 'application/json',
// //           'X-Requested-With': 'XMLHttpRequest'
// //         }
// //       });

// //       if (response.data.success) {
// //         if (response.data.no_data || Object.keys(response.data.data || {}).length === 0) {
// //           setNoData(true);
// //           setIndicateursData({});
// //         } else {
// //           setIndicateursData(response.data.data);
// //           setIsDemoData(response.data.demo_data || false);
// //         }

// //         const categories = Object.keys(response.data.data || {});
// //         if (categories.length > 0 && (!selectedCategorie || !categories.includes(selectedCategorie))) {
// //           setSelectedCategorie(categories[0]);
// //         } else if (categories.length === 0) {
// //           setSelectedCategorie('');
// //         }
// //       } else {
// //         setError('Échec de la récupération des données');
// //       }
// //     } catch (err) {
// //       console.error('Erreur lors de la récupération des données:', err);
// //       setError('Une erreur est survenue lors de la récupération des données');
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   const exportToExcel = () => {
// //     const params = new URLSearchParams({
// //       periode_type: selectedPeriode
// //     });

// //     if (selectedExerciceId) {
// //       params.append('exercice_id', selectedExerciceId.toString());
// //     }

// //     if (selectedEntrepriseId) {
// //       params.append('entreprise_id', selectedEntrepriseId.toString());
// //     }

// //     if (selectedCategorie) {
// //       params.append('categorie', selectedCategorie);
// //     }

// //     window.location.href = `/api/indicateurs/export-excel?${params.toString()}`;
// //   };

// //   const categoriesDisponibles = useMemo(() => {
// //     return Object.keys(indicateursData);
// //   }, [indicateursData]);

// //   const indicateursActifs = useMemo(() => {
// //     if (!selectedCategorie || !indicateursData[selectedCategorie]) return [];
// //     return indicateursData[selectedCategorie];
// //   }, [indicateursData, selectedCategorie]);


// //   const viewIndicateurDetails = (indicateur: any) => {
// //     const params = new URLSearchParams({
// //       categorie: selectedCategorie,
// //       periode_type: selectedPeriode
// //     });

// //     if (selectedExerciceId) {
// //       params.append('exercice_id', selectedExerciceId.toString());
// //     }

// //     window.location.href = `/indicateurs/detail/${indicateur.id}?${params.toString()}`;
// //   };

// //   const NoDataMessage = () => (
// //     <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg shadow-sm mb-6">
// //       <div className="flex">
// //         <div className="flex-shrink-0">
// //           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
// //           </svg>
// //         </div>
// //         <div className="ml-3">
// //           <h3 className="text-lg font-medium text-yellow-800">
// //             Aucune donnée disponible
// //           </h3>
// //           <div className="mt-2 text-yellow-700">
// //             <p>
// //               Aucune donnée n'a été trouvée pour les critères sélectionnés. Veuillez vérifier que:
// //             </p>
// //             <ul className="mt-1 ml-5 list-disc">
// //               <li>Des collectes de données ont été effectuées pour cette période</li>
// //               <li>L'entreprise sélectionnée a des données associées</li>
// //               <li>L'exercice choisi contient des données pour cette période</li>
// //             </ul>
// //             <p className="mt-2">
// //               Essayez de modifier les filtres ou d'effectuer une nouvelle collecte de données.
// //             </p>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );

// //   const renderChart = () => {
// //     const data = indicateursActifs.map(ind => ({
// //       name: ind.label.length > 20 ? ind.label.substring(0, 20) + '...' : ind.label,
// //       valeur: ind.value,
// //       cible: ind.target,
// //       unite: ind.unite
// //     }));

// //     switch (chartType) {
// //       case 'bar':
// //         return (
// //           <BarChart data={data}>
// //             <CartesianGrid strokeDasharray="3 3" />
// //             <XAxis dataKey="name" height={60} tick={{ fontSize: 12 }} tickLine={false} angle={-45} textAnchor="end" />
// //             <YAxis />
// //             <Tooltip
// //               formatter={(value: number) => [value.toLocaleString(), 'Valeur']}
// //               labelFormatter={(label) => label}
// //             />
// //             <Legend />
// //             <Bar dataKey="valeur" name="Valeur" fill="#3498db" />
// //             <Bar dataKey="cible" name="Cible" fill="#2ecc71" />
// //           </BarChart>
// //         );
// //       case 'line':
// //         return (
// //           <LineChart data={data}>
// //             <CartesianGrid strokeDasharray="3 3" />
// //             <XAxis dataKey="name" height={60} tick={{ fontSize: 12 }} tickLine={false} angle={-45} textAnchor="end" />
// //             <YAxis />
// //             <Tooltip
// //               formatter={(value: number) => [value.toLocaleString(), 'Valeur']}
// //               labelFormatter={(label) => label}
// //             />
// //             <Legend />
// //             <Line type="monotone" dataKey="valeur" name="Valeur" stroke="#3498db" />
// //             <Line type="monotone" dataKey="cible" name="Cible" stroke="#2ecc71" strokeDasharray="5 5" />
// //           </LineChart>
// //         );
// //       case 'pie':
// //         return (
// //           <PieChart>
// //             <Pie
// //               data={data}
// //               cx="50%"
// //               cy="50%"
// //               labelLine={false}
// //               outerRadius={80}
// //               fill="#8884d8"
// //               dataKey="valeur"
// //               nameKey="name"
// //               label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
// //             >
// //               {data.map((entry, index) => (
// //                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
// //               ))}
// //             </Pie>
// //             <Tooltip
// //               formatter={(value: number) => [value.toLocaleString(), 'Valeur']}
// //             />
// //             <Legend />
// //           </PieChart>
// //         );
// //       default:
// //         return null;
// //     }
// //   };

// //   return (
// //     <AppLayout
// //       title="Analyse Intégrée des Indicateurs"
// //       user={auth?.user}
// //       header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Analyse Intégrée des Indicateurs</h2>}
// //     >
// //       <Head title="Analyse Intégrée des Indicateurs" />

// //       <div className="py-6">
// //         <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
// //           {/* En-tête */}
// //           <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white p-4 md:p-6 mb-6 rounded-lg">
// //             <div className="flex justify-between items-center">
// //               <div>
// //                 <h1 className="text-xl md:text-2xl font-bold">Analyse Intégrée des Indicateurs</h1>
// //                 <p className="text-sm md:text-base mt-1 opacity-80">Interface avancée avec visualisations personnalisées</p>
// //               </div>
// //               <div className="flex gap-2">
// //                 <Link
// //                   href={route('indicateurs.analyse')}
// //                   className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-md text-sm transition-colors"
// //                 >
// //                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
// //                     <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
// //                   </svg>
// //                   <span className="hidden md:inline">Interface standard</span>
// //                 </Link>
// //                 <button
// //                   onClick={() => fetchIndicateursData()}
// //                   className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-md text-sm transition-colors"
// //                 >
// //                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
// //                     <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
// //                   </svg>
// //                   <span className="hidden md:inline">Actualiser</span>
// //                 </button>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Filtres intégrés */}
// //           <div className="mb-6">
// //             <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
// //               <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
// //                 <div className="flex items-center space-x-2">
// //                   <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
// //                   </svg>
// //                   <h3 className="text-lg font-medium text-gray-800">Filtres</h3>
// //                 </div>

// //                 <div className="flex flex-wrap gap-4">
// //                   {/* Sélecteur de période */}
// //                   <div className="min-w-[160px]">
// //                     <label className="block text-sm font-medium text-gray-700 mb-1">
// //                       Période
// //                     </label>
// //                     <div className="flex flex-wrap gap-2">
// //                       {periodes.map(periode => (
// //                         <button
// //                           key={periode}
// //                           className={`px-3 py-2 rounded-md text-sm ${
// //                             selectedPeriode === periode
// //                               ? 'bg-blue-600 text-white'
// //                               : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
// //                           }`}
// //                           onClick={() => setSelectedPeriode(periode)}
// //                         >
// //                           {periode}
// //                         </button>
// //                       ))}
// //                     </div>
// //                   </div>

// //                   {/* Sélecteur d'exercice */}
// //                   <div className="min-w-[160px]">
// //                     <label className="block text-sm font-medium text-gray-700 mb-1">
// //                       Exercice
// //                     </label>
// //                     <select
// //                       value={selectedExerciceId || ''}
// //                       onChange={(e) => setSelectedExerciceId(e.target.value ? parseInt(e.target.value) : null)}
// //                       className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
// //                     >
// //                       <option value="">Tous les exercices</option>
// //                       {exercices.map((exercice) => (
// //                         <option key={exercice.id} value={exercice.id}>
// //                           {exercice.annee} {exercice.actif && '(Actif)'}
// //                         </option>
// //                       ))}
// //                     </select>
// //                   </div>

// //                   {/* Sélecteur d'entreprise */}
// //                   <div className="min-w-[200px]">
// //                     <label className="block text-sm font-medium text-gray-700 mb-1">
// //                       Entreprise
// //                     </label>
// //                     <select
// //                       value={selectedEntrepriseId || ''}
// //                       onChange={(e) => setSelectedEntrepriseId(e.target.value ? parseInt(e.target.value) : null)}
// //                       className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
// //                     >
// //                       <option value="">Toutes les entreprises</option>
// //                       {entreprises.map((entreprise) => (
// //                         <option key={entreprise.id} value={entreprise.id}>
// //                           {entreprise.nom_entreprise}
// //                         </option>
// //                       ))}
// //                     </select>
// //                   </div>

// //                   {/* Bouton export */}
// //                   <div className="flex items-end space-x-2">
// //                     <button
// //                       onClick={exportToExcel}
// //                       className="p-2 text-white bg-green-600 border border-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
// //                       title="Exporter les données"
// //                     >
// //                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
// //                       </svg>
// //                     </button>
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* Réinitialiser les filtres */}
// //               {(selectedExerciceId || selectedEntrepriseId) && (
// //                 <div className="mt-4 flex justify-end">
// //                   <button
// //                     onClick={() => {
// //                       setSelectedExerciceId(null);
// //                       setSelectedEntrepriseId(null);
// //                     }}
// //                     className="text-sm text-red-600 hover:text-red-800"
// //                   >
// //                     Réinitialiser les filtres
// //                   </button>
// //                 </div>
// //               )}
// //             </div>
// //           </div>

// //           {/* Indicateur de chargement */}
// //           {isLoading && (
// //             <div className="flex items-center justify-center h-64">
// //               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
// //             </div>
// //           )}

// //           {/* Message d'erreur */}
// //           {error && !isLoading && (
// //             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
// //               <p className="font-medium">Erreur</p>
// //               <p>{error}</p>
// //               <button
// //                 onClick={fetchIndicateursData}
// //                 className="mt-2 bg-red-200 hover:bg-red-300 text-red-800 px-3 py-1 rounded text-sm"
// //               >
// //                 Réessayer
// //               </button>
// //             </div>
// //           )}

// //           {/* Message d'absence de données */}
// //           {!isLoading && !error && noData && (
// //             <NoDataMessage />
// //           )}

// //           {/* Corps principal - sélection de catégorie et visualisations */}
// //           {!isLoading && !error && !noData && (
// //             <div className="space-y-6">
// //               {/* Sélection de catégorie */}
// //               {categoriesDisponibles.length > 0 && (
// //                 <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
// //                   <h3 className="font-medium mb-2 text-gray-700">Catégorie d'indicateurs:</h3>
// //                   <div className="flex flex-wrap gap-2">
// //                     {categoriesDisponibles.map(categorie => (
// //                       <button
// //                         key={categorie}
// //                         className={`px-3 py-2 rounded-md text-sm ${
// //                           selectedCategorie === categorie
// //                             ? 'bg-blue-600 text-white'
// //                             : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
// //                         }`}
// //                         onClick={() => setSelectedCategorie(categorie)}
// //                       >
// //                         {categorie.length > 30 ? categorie.substring(0, 30) + '...' : categorie}
// //                       </button>
// //                     ))}
// //                   </div>
// //                 </div>
// //               )}

// //               {/* Visualisation des données */}
// //               {selectedCategorie && indicateursActifs.length > 0 && (
// //                 <>
// //                   {/* Contrôles de graphique */}
// //                   <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
// //                     <h3 className="font-medium mb-2 text-gray-700">Type de graphique:</h3>
// //                     <div className="flex flex-wrap gap-2">
// //                       <button
// //                         className={`px-3 py-2 rounded-md text-sm ${
// //                           chartType === 'bar'
// //                             ? 'bg-blue-600 text-white'
// //                             : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
// //                         }`}
// //                         onClick={() => setChartType('bar')}
// //                       >
// //                         Barres
// //                       </button>
// //                       <button
// //                         className={`px-3 py-2 rounded-md text-sm ${
// //                           chartType === 'line'
// //                             ? 'bg-blue-600 text-white'
// //                             : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
// //                         }`}
// //                         onClick={() => setChartType('line')}
// //                       >
// //                         Ligne
// //                       </button>
// //                       <button
// //                         className={`px-3 py-2 rounded-md text-sm ${
// //                           chartType === 'pie'
// //                             ? 'bg-blue-600 text-white'
// //                             : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
// //                         }`}
// //                         onClick={() => setChartType('pie')}
// //                       >
// //                         Camembert
// //                       </button>
// //                     </div>
// //                   </div>

// //                   {/* Graphique */}
// //                   <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
// //                     <h3 className="font-medium mb-4 text-gray-700">Visualisation: {selectedCategorie}</h3>
// //                     <div className="h-80">
// //                       <ResponsiveContainer width="100%" height="100%">
// //                         {renderChart()}
// //                       </ResponsiveContainer>
// //                     </div>
// //                   </div>

// //                   {/* Tableau des données */}
// //                   <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
// //                     <h3 className="font-medium mb-4 text-gray-700">Détail des indicateurs</h3>
// //                     <div className="overflow-x-auto">
// //                       <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
// //                         <thead className="bg-gray-50 dark:bg-gray-700">
// //                           <tr>
// //                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
// //                               Libellé
// //                             </th>
// //                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
// //                               Valeur
// //                             </th>
// //                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
// //                               Valeur cible
// //                             </th>
// //                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
// //                               Écart
// //                             </th>
// //                             <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
// //                               Actions
// //                             </th>
// //                           </tr>
// //                         </thead>
// //                         <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
// //                           {indicateursActifs.map((ind) => {
// //                             const ecart = ind.value - ind.target;
// //                             const ecartClass = ecart >= 0 ? "text-green-600" : "text-red-600";
// //                             const ecartPercentage = ind.target !== 0 ? ((ecart / ind.target) * 100).toFixed(2) : 'N/A';

// //                             return (
// //                               <tr key={ind.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
// //                                 <td className="px-6 py-4 whitespace-nowrap">
// //                                   <div className="text-sm font-medium text-gray-900 dark:text-white">
// //                                     {ind.label}
// //                                     {ind.is_calculated && (
// //                                       <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
// //                                         Calculé
// //                                       </span>
// //                                     )}
// //                                     {ind.metadata?.demo && (
// //                                       <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
// //                                         Démo
// //                                       </span>
// //                                     )}
// //                                   </div>
// //                                   {ind.definition && (
// //                                     <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
// //                                       {ind.definition.substring(0, 60)}...
// //                                     </div>
// //                                   )}
// //                                 </td>
// //                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
// //                                   {ind.value.toLocaleString()} {ind.unite}
// //                                 </td>
// //                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
// //                                   {ind.target.toLocaleString()} {ind.unite}
// //                                 </td>
// //                                 <td className={`px-6 py-4 whitespace-nowrap text-sm ${ecartClass}`}>
// //                                   {ecart.toLocaleString()} {ind.unite} ({ecartPercentage}%)
// //                                 </td>
// //                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
// //                                   <button
// //                                     onClick={() => viewIndicateurDetails(ind)}
// //                                     className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
// //                                     title="Voir les détails"
// //                                   >
// //                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
// //                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
// //                                     </svg>
// //                                   </button>
// //                                 </td>
// //                               </tr>
// //                             );
// //                           })}
// //                         </tbody>
// //                       </table>
// //                     </div>
// //                   </div>
// //                 </>
// //               )}
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </AppLayout>
// //   );
// // };

// // export default AnalyseIntegree;
// import React, { useState, useEffect, useMemo } from 'react';
// import { Head, Link } from '@inertiajs/react';
// import AppLayout from '@/layouts/app-layout';
// import axios from 'axios';
// import { PageProps } from '@/types';
// import {
//   BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
//   CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
// } from 'recharts';

// // Types
// interface Indicateur {
//   id: string;
//   label: string;
//   value: number;
//   target: number;
//   evolution: string;
//   unite: string;
//   definition: string;
//   is_calculated?: boolean;
//   metadata?: {
//     entreprise_ids: number[];
//     beneficiaire_ids?: number[];
//     collecte_ids: number[];
//     periodes: string[];
//     nombre_points_donnees: number;
//   };
// }

// interface IndicateursParCategorie {
//   [categorie: string]: Indicateur[];
// }

// interface Exercice {
//   id: number;
//   annee: number;
//   date_debut: string;
//   date_fin: string;
//   actif: boolean;
// }

// interface Entreprise {
//   id: number;
//   nom_entreprise: string;
//   secteur_activite: string;
// }

// interface Beneficiaire {
//   id: number;
//   nom: string;
//   prenom: string;
// }

// // Props pour le composant
// interface AnalyseIntegreeProps extends PageProps {
//   exercices: Exercice[];
//   entreprises: Entreprise[];
//   beneficiaires?: Beneficiaire[];
//   defaultExerciceId: number | null;
//   defaultPeriodeType: string;
//   periodes: string[];
// }

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// const AnalyseIntegree: React.FC<AnalyseIntegreeProps> = ({
//   auth,
//   exercices,
//   entreprises,
//   beneficiaires = [],
//   defaultExerciceId,
//   defaultPeriodeType,
//   periodes
// }) => {
//   // États pour les filtres
//   const [selectedPeriode, setSelectedPeriode] = useState<string>(defaultPeriodeType);
//   const [selectedExerciceId, setSelectedExerciceId] = useState<number | null>(defaultExerciceId);
//   const [selectedEntrepriseId, setSelectedEntrepriseId] = useState<number | null>(null);
//   const [selectedBeneficiaireId, setSelectedBeneficiaireId] = useState<number | null>(null);
//   const [selectedCategorie, setSelectedCategorie] = useState<string>('');

//   // États pour les données
//   const [indicateursData, setIndicateursData] = useState<IndicateursParCategorie>({});
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [noData, setNoData] = useState<boolean>(false);

//   // État pour récupérer les bénéficiaires si nécessaire
//   const [availableBeneficiaires, setAvailableBeneficiaires] = useState<Beneficiaire[]>(beneficiaires);

//   // État pour la visualisation
//   const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');

//   // Déterminer si on doit afficher le filtre bénéficiaire au lieu d'entreprise
//   const isOccasionnellePeriode = useMemo(() => {
//     return selectedPeriode.toLowerCase() === 'occasionnelle';
//   }, [selectedPeriode]);

//   // Effet pour charger les bénéficiaires si nécessaire et s'il n'y en a pas encore
//   useEffect(() => {
//     if (isOccasionnellePeriode && availableBeneficiaires.length === 0) {
//       fetchBeneficiaires();
//     }
//   }, [isOccasionnellePeriode, availableBeneficiaires.length]);

//   // Effet pour charger les données initiales
//   useEffect(() => {
//     fetchIndicateursData();
//   }, [selectedPeriode, selectedExerciceId, selectedEntrepriseId, selectedBeneficiaireId]);

//   // Fonction pour récupérer la liste des bénéficiaires
//   const fetchBeneficiaires = async () => {
//     try {
//       const response = await axios.get('/api/beneficiaires', {
//         headers: {
//           'Accept': 'application/json',
//           'X-Requested-With': 'XMLHttpRequest'
//         }
//       });

//       if (response.data.success) {
//         setAvailableBeneficiaires(response.data.data);
//       }
//     } catch (err) {
//       console.error('Erreur lors de la récupération des bénéficiaires:', err);
//     }
//   };

//   const fetchIndicateursData = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       setNoData(false);

//       // Construire les paramètres de requête en fonction de la période
//       const params: any = {
//         periode_type: selectedPeriode,
//         exercice_id: selectedExerciceId
//       };

//       // Si période occasionnelle, utiliser bénéficiaire_id, sinon entreprise_id
//       if (isOccasionnellePeriode) {
//         if (selectedBeneficiaireId) {
//           params.beneficiaire_id = selectedBeneficiaireId;
//         }
//       } else {
//         if (selectedEntrepriseId) {
//           params.entreprise_id = selectedEntrepriseId;
//         }
//       }

//       const response = await axios.get('/api/indicateurs/analyse', {
//         params,
//         headers: {
//           'Accept': 'application/json',
//           'X-Requested-With': 'XMLHttpRequest'
//         }
//       });

//       if (response.data.success) {
//         if (response.data.no_data || Object.keys(response.data.data || {}).length === 0) {
//           setNoData(true);
//           setIndicateursData({});
//         } else {
//           setIndicateursData(response.data.data);
//         }

//         const categories = Object.keys(response.data.data || {});
//         if (categories.length > 0 && (!selectedCategorie || !categories.includes(selectedCategorie))) {
//           setSelectedCategorie(categories[0]);
//         } else if (categories.length === 0) {
//           setSelectedCategorie('');
//         }
//       } else {
//         setError('Échec de la récupération des données');
//       }
//     } catch (err) {
//       console.error('Erreur lors de la récupération des données:', err);
//       setError('Une erreur est survenue lors de la récupération des données');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const exportToExcel = () => {
//     const params = new URLSearchParams({
//       periode_type: selectedPeriode
//     });

//     if (selectedExerciceId) {
//       params.append('exercice_id', selectedExerciceId.toString());
//     }

//     // Exporter avec le bon ID selon la période
//     if (isOccasionnellePeriode) {
//       if (selectedBeneficiaireId) {
//         params.append('beneficiaire_id', selectedBeneficiaireId.toString());
//       }
//     } else {
//       if (selectedEntrepriseId) {
//         params.append('entreprise_id', selectedEntrepriseId.toString());
//       }
//     }

//     if (selectedCategorie) {
//       params.append('categorie', selectedCategorie);
//     }

//     window.location.href = `/api/indicateurs/export-excel?${params.toString()}`;
//   };

//   const categoriesDisponibles = useMemo(() => {
//     return Object.keys(indicateursData);
//   }, [indicateursData]);

//   const indicateursActifs = useMemo(() => {
//     if (!selectedCategorie || !indicateursData[selectedCategorie]) return [];
//     return indicateursData[selectedCategorie];
//   }, [indicateursData, selectedCategorie]);

//   const viewIndicateurDetails = (indicateur: any) => {
//     const params = new URLSearchParams({
//       categorie: selectedCategorie,
//       periode_type: selectedPeriode
//     });

//     if (selectedExerciceId) {
//       params.append('exercice_id', selectedExerciceId.toString());
//     }

//     // Ajouter le bon ID selon la période
//     if (isOccasionnellePeriode) {
//       if (selectedBeneficiaireId) {
//         params.append('beneficiaire_id', selectedBeneficiaireId.toString());
//       }
//     } else {
//       if (selectedEntrepriseId) {
//         params.append('entreprise_id', selectedEntrepriseId.toString());
//       }
//     }

//     window.location.href = `/indicateurs/detail/${indicateur.id}?${params.toString()}`;
//   };

//   const NoDataMessage = () => (
//     <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg shadow-sm mb-6">
//       <div className="flex">
//         <div className="flex-shrink-0">
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//           </svg>
//         </div>
//         <div className="ml-3">
//           <h3 className="text-lg font-medium text-yellow-800">
//             Aucune donnée disponible
//           </h3>
//           <div className="mt-2 text-yellow-700">
//             <p>
//               Aucune donnée n'a été trouvée pour les critères sélectionnés. Veuillez vérifier que:
//             </p>
//             <ul className="mt-1 ml-5 list-disc">
//               <li>Des collectes de données ont été effectuées pour cette période</li>
//               {isOccasionnellePeriode ? (
//                 <li>Le bénéficiaire sélectionné a des données associées</li>
//               ) : (
//                 <li>L'entreprise sélectionnée a des données associées</li>
//               )}
//               <li>L'exercice choisi contient des données pour cette période</li>
//             </ul>
//             <p className="mt-2">
//               Essayez de modifier les filtres ou d'effectuer une nouvelle collecte de données.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderChart = () => {
//     const data = indicateursActifs.map(ind => ({
//       name: ind.label.length > 20 ? ind.label.substring(0, 20) + '...' : ind.label,
//       valeur: ind.value,
//       cible: ind.target,
//       unite: ind.unite
//     }));

//     switch (chartType) {
//       case 'bar':
//         return (
//           <BarChart data={data}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="name" height={60} tick={{ fontSize: 12 }} tickLine={false} angle={-45} textAnchor="end" />
//             <YAxis />
//             <Tooltip
//               formatter={(value: number) => [value.toLocaleString(), 'Valeur']}
//               labelFormatter={(label) => label}
//             />
//             <Legend />
//             <Bar dataKey="valeur" name="Valeur" fill="#3498db" />
//             <Bar dataKey="cible" name="Cible" fill="#2ecc71" />
//           </BarChart>
//         );
//       case 'line':
//         return (
//           <LineChart data={data}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="name" height={60} tick={{ fontSize: 12 }} tickLine={false} angle={-45} textAnchor="end" />
//             <YAxis />
//             <Tooltip
//               formatter={(value: number) => [value.toLocaleString(), 'Valeur']}
//               labelFormatter={(label) => label}
//             />
//             <Legend />
//             <Line type="monotone" dataKey="valeur" name="Valeur" stroke="#3498db" />
//             <Line type="monotone" dataKey="cible" name="Cible" stroke="#2ecc71" strokeDasharray="5 5" />
//           </LineChart>
//         );
//       case 'pie':
//         return (
//           <PieChart>
//             <Pie
//               data={data}
//               cx="50%"
//               cy="50%"
//               labelLine={false}
//               outerRadius={80}
//               fill="#8884d8"
//               dataKey="valeur"
//               nameKey="name"
//               label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//             >
//               {data.map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//               ))}
//             </Pie>
//             <Tooltip
//               formatter={(value: number) => [value.toLocaleString(), 'Valeur']}
//             />
//             <Legend />
//           </PieChart>
//         );
//       default:
//         return null;
//     }
//   };

//   // Réinitialiser les filtres spécifiques quand on change de période
//   useEffect(() => {
//     setSelectedEntrepriseId(null);
//     setSelectedBeneficiaireId(null);
//   }, [selectedPeriode]);

//   return (
//     <AppLayout
//       title="Analyse Intégrée des Indicateurs"
//       user={auth?.user}
//       header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Analyse Intégrée des Indicateurs</h2>}
//     >
//       <Head title="Analyse Intégrée des Indicateurs" />

//       <div className="py-6">
//         <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
//           {/* En-tête */}
//           <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white p-4 md:p-6 mb-6 rounded-lg">
//             <div className="flex justify-between items-center">
//               <div>
//                 <h1 className="text-xl md:text-2xl font-bold">Analyse Intégrée des Indicateurs</h1>
//                 <p className="text-sm md:text-base mt-1 opacity-80">Interface avancée avec visualisations personnalisées</p>
//               </div>
//               <div className="flex gap-2">
//                 <Link
//                   href={route('indicateurs.analyse')}
//                   className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-md text-sm transition-colors"
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                     <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
//                   </svg>
//                   <span className="hidden md:inline">Interface standard</span>
//                 </Link>
//                 <button
//                   onClick={() => fetchIndicateursData()}
//                   className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-md text-sm transition-colors"
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                     <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
//                   </svg>
//                   <span className="hidden md:inline">Actualiser</span>
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Filtres intégrés */}
//           <div className="mb-6">
//             <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
//               <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
//                 <div className="flex items-center space-x-2">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
//                   </svg>
//                   <h3 className="text-lg font-medium text-gray-800">Filtres</h3>
//                 </div>

//                 <div className="flex flex-wrap gap-4">
//                   {/* Sélecteur de période */}
//                   <div className="min-w-[160px]">
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Période
//                     </label>
//                     <div className="flex flex-wrap gap-2">
//                       {periodes.map(periode => (
//                         <button
//                           key={periode}
//                           className={`px-3 py-2 rounded-md text-sm ${
//                             selectedPeriode === periode
//                               ? 'bg-blue-600 text-white'
//                               : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                           }`}
//                           onClick={() => setSelectedPeriode(periode)}
//                         >
//                           {periode}
//                         </button>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Sélecteur d'exercice */}
//                   <div className="min-w-[160px]">
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Exercice
//                     </label>
//                     <select
//                       value={selectedExerciceId || ''}
//                       onChange={(e) => setSelectedExerciceId(e.target.value ? parseInt(e.target.value) : null)}
//                       className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
//                     >
//                       <option value="">Tous les exercices</option>
//                       {exercices.map((exercice) => (
//                         <option key={exercice.id} value={exercice.id}>
//                           {exercice.annee} {exercice.actif && '(Actif)'}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   {/* Sélecteur d'entreprise OU bénéficiaire selon la période */}
//                   <div className="min-w-[200px]">
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       {isOccasionnellePeriode ? 'Bénéficiaire' : 'Entreprise'}
//                     </label>

//                     {isOccasionnellePeriode ? (
//                       <select
//                         value={selectedBeneficiaireId || ''}
//                         onChange={(e) => setSelectedBeneficiaireId(e.target.value ? parseInt(e.target.value) : null)}
//                         className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
//                       >
//                         <option value="">Tous les bénéficiaires</option>
//                         {availableBeneficiaires.map((beneficiaire) => (
//                           <option key={beneficiaire.id} value={beneficiaire.id}>
//                             {beneficiaire.nom} {beneficiaire.prenom}
//                           </option>
//                         ))}
//                       </select>
//                     ) : (
//                       <select
//                         value={selectedEntrepriseId || ''}
//                         onChange={(e) => setSelectedEntrepriseId(e.target.value ? parseInt(e.target.value) : null)}
//                         className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
//                       >
//                         <option value="">Toutes les entreprises</option>
//                         {entreprises.map((entreprise) => (
//                           <option key={entreprise.id} value={entreprise.id}>
//                             {entreprise.nom_entreprise}
//                           </option>
//                         ))}
//                       </select>
//                     )}
//                   </div>

//                   {/* Bouton export */}
//                   <div className="flex items-end space-x-2">
//                     <button
//                       onClick={exportToExcel}
//                       className="p-2 text-white bg-green-600 border border-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
//                       title="Exporter les données"
//                     >
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
//                       </svg>
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               {/* Réinitialiser les filtres */}
//               {(selectedExerciceId || selectedEntrepriseId || selectedBeneficiaireId) && (
//                 <div className="mt-4 flex justify-end">
//                   <button
//                     onClick={() => {
//                       setSelectedExerciceId(null);
//                       setSelectedEntrepriseId(null);
//                       setSelectedBeneficiaireId(null);
//                     }}
//                     className="text-sm text-red-600 hover:text-red-800"
//                   >
//                     Réinitialiser les filtres
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Indicateur de chargement */}
//           {isLoading && (
//             <div className="flex items-center justify-center h-64">
//               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//             </div>
//           )}

//           {/* Message d'erreur */}
//           {error && !isLoading && (
//             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
//               <p className="font-medium">Erreur</p>
//               <p>{error}</p>
//               <button
//                 onClick={fetchIndicateursData}
//                 className="mt-2 bg-red-200 hover:bg-red-300 text-red-800 px-3 py-1 rounded text-sm"
//               >
//                 Réessayer
//               </button>
//             </div>
//           )}

//           {/* Message d'absence de données */}
//           {!isLoading && !error && noData && (
//             <NoDataMessage />
//           )}

//           {/* Corps principal - sélection de catégorie et visualisations */}
//           {!isLoading && !error && !noData && (
//             <div className="space-y-6">
//               {/* Sélection de catégorie */}
//               {categoriesDisponibles.length > 0 && (
//                 <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
//                   <h3 className="font-medium mb-2 text-gray-700">Catégorie d'indicateurs:</h3>
//                   <div className="flex flex-wrap gap-2">
//                     {categoriesDisponibles.map(categorie => (
//                       <button
//                         key={categorie}
//                         className={`px-3 py-2 rounded-md text-sm ${
//                           selectedCategorie === categorie
//                             ? 'bg-blue-600 text-white'
//                             : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                         }`}
//                         onClick={() => setSelectedCategorie(categorie)}
//                       >
//                         {categorie.length > 30 ? categorie.substring(0, 30) + '...' : categorie}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Visualisation des données */}
//               {selectedCategorie && indicateursActifs.length > 0 && (
//                 <>
//                   {/* Contrôles de graphique */}
//                   <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
//                     <h3 className="font-medium mb-2 text-gray-700">Type de graphique:</h3>
//                     <div className="flex flex-wrap gap-2">
//                       <button
//                         className={`px-3 py-2 rounded-md text-sm ${
//                           chartType === 'bar'
//                             ? 'bg-blue-600 text-white'
//                             : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                         }`}
//                         onClick={() => setChartType('bar')}
//                       >
//                         Barres
//                       </button>
//                       <button
//                         className={`px-3 py-2 rounded-md text-sm ${
//                           chartType === 'line'
//                             ? 'bg-blue-600 text-white'
//                             : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                         }`}
//                         onClick={() => setChartType('line')}
//                       >
//                         Ligne
//                       </button>
//                       <button
//                         className={`px-3 py-2 rounded-md text-sm ${
//                           chartType === 'pie'
//                             ? 'bg-blue-600 text-white'
//                             : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                         }`}
//                         onClick={() => setChartType('pie')}
//                       >
//                         Camembert
//                       </button>
//                     </div>
//                   </div>

//                   {/* Graphique */}
//                   <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
//                     <h3 className="font-medium mb-4 text-gray-700">Visualisation: {selectedCategorie}</h3>
//                     <div className="h-80">
//                       <ResponsiveContainer width="100%" height="100%">
//                         {renderChart()}
//                       </ResponsiveContainer>
//                     </div>
//                   </div>

//                   {/* Tableau des données */}
//                   <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
//                     <h3 className="font-medium mb-4 text-gray-700">Détail des indicateurs</h3>
//                     <div className="overflow-x-auto">
//                       <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//                         <thead className="bg-gray-50 dark:bg-gray-700">
//                           <tr>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                               Libellé
//                             </th>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                               Valeur
//                             </th>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                               Valeur cible
//                             </th>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                               Écart
//                             </th>
//                             <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                               Actions
//                             </th>
//                           </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
//                           {indicateursActifs.map((ind) => {
//                             const ecart = ind.value - ind.target;
//                             const ecartClass = ecart >= 0 ? "text-green-600" : "text-red-600";
//                             const ecartPercentage = ind.target !== 0 ? ((ecart / ind.target) * 100).toFixed(2) : 'N/A';

//                             return (
//                               <tr key={ind.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
//                                 <td className="px-6 py-4 whitespace-nowrap">
//                                   <div className="text-sm font-medium text-gray-900 dark:text-white">
//                                     {ind.label}
//                                     {ind.is_calculated && (
//                                       <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
//                                         Calculé
//                                       </span>
//                                     )}
//                                   </div>
//                                   {ind.definition && (
//                                     <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
//                                       {ind.definition.substring(0, 60)}...
//                                     </div>
//                                   )}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
//                                   {ind.value.toLocaleString()} {ind.unite}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
//                                   {ind.target.toLocaleString()} {ind.unite}
//                                 </td>
//                                 <td className={`px-6 py-4 whitespace-nowrap text-sm ${ecartClass}`}>
//                                   {ecart.toLocaleString()} {ind.unite} ({ecartPercentage}%)
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
//                                   <button
//                                     onClick={() => viewIndicateurDetails(ind)}
//                                     className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
//                                     title="Voir les détails"
//                                   >
//                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                                     </svg>
//                                   </button>
//                                 </td>
//                               </tr>
//                             );
//                           })}
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>
//                 </>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </AppLayout>
//   );
// };

// export default AnalyseIntegree;

// import React, { useState, useEffect, useMemo } from 'react';
// import { Head, Link } from '@inertiajs/react';
// import AppLayout from '@/layouts/app-layout';
// import axios from 'axios';
// import { PageProps } from '@/types';
// import {
//   BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
//   CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
// } from 'recharts';
// import {
//   Filter,
//   RotateCcw,
//   ArrowLeft,
//   Download,
//   ChevronDown,
//   Sun,
//   Moon,
//   BarChart as BarChartIcon,
//   LineChart as LineChartIcon,
//   PieChart as PieChartIcon,
//   Eye,
//   Menu,
//   X
// } from 'lucide-react';
// import { initDarkMode, listenForThemeChanges, toggleDarkMode } from '@/Utils/darkMode';

// // Import des utilitaires pour le mode sombre

// // Types
// interface Indicateur {
//   id: string;
//   label: string;
//   value: number;
//   target: number;
//   evolution: string;
//   unite: string;
//   definition: string;
//   is_calculated?: boolean;
//   metadata?: {
//     entreprise_ids: number[];
//     beneficiaire_ids?: number[];
//     collecte_ids: number[];
//     periodes: string[];
//     nombre_points_donnees: number;
//   };
// }

// interface IndicateursParCategorie {
//   [categorie: string]: Indicateur[];
// }

// interface Exercice {
//   id: number;
//   annee: number;
//   date_debut: string;
//   date_fin: string;
//   actif: boolean;
// }

// interface Entreprise {
//   id: number;
//   nom_entreprise: string;
//   secteur_activite: string;
// }

// interface Beneficiaire {
//   id: number;
//   nom: string;
//   prenom: string;
// }

// // Props pour le composant
// interface AnalyseIntegreeProps extends PageProps {
//   exercices: Exercice[];
//   entreprises: Entreprise[];
//   beneficiaires?: Beneficiaire[];
//   defaultExerciceId: number | null;
//   defaultPeriodeType: string;
//   periodes: string[];
// }

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// const AnalyseIntegree: React.FC<AnalyseIntegreeProps> = ({
//   auth,
//   exercices,
//   entreprises,
//   beneficiaires = [],
//   defaultExerciceId,
//   defaultPeriodeType,
//   periodes
// }) => {
//   // État pour le thème - initialisation avec la fonction importée
//   const [isDarkMode, setIsDarkMode] = useState<boolean>(() => initDarkMode());

//   // État pour le menu mobile et filtres
//   const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

//   // États pour les filtres
//   const [selectedPeriode, setSelectedPeriode] = useState<string>(defaultPeriodeType);
//   const [selectedExerciceId, setSelectedExerciceId] = useState<number | null>(defaultExerciceId);
//   const [selectedEntrepriseId, setSelectedEntrepriseId] = useState<number | null>(null);
//   const [selectedBeneficiaireId, setSelectedBeneficiaireId] = useState<number | null>(null);
//   const [selectedCategorie, setSelectedCategorie] = useState<string>('');

//   // États pour les données
//   const [indicateursData, setIndicateursData] = useState<IndicateursParCategorie>({});
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [noData, setNoData] = useState<boolean>(false);

//   // État pour récupérer les bénéficiaires si nécessaire
//   const [availableBeneficiaires, setAvailableBeneficiaires] = useState<Beneficiaire[]>(beneficiaires);

//   // État pour la visualisation
//   const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');

//   // État pour les colonnes visibles du tableau
//   const [visibleColumns, setVisibleColumns] = useState({
//     valeur: true,
//     cible: true,
//     evolution: true,
//     definition: true
//   });

//   // Déterminer si on doit afficher le filtre bénéficiaire au lieu d'entreprise
//   const isOccasionnellePeriode = useMemo(() => {
//     return selectedPeriode.toLowerCase() === 'occasionnelle';
//   }, [selectedPeriode]);

//   // Écouter les changements de préférence système pour le mode sombre
//   useEffect(() => {
//     // Écouter les changements de préférence système
//     listenForThemeChanges((isDark: boolean) => {
//       setIsDarkMode(isDark);
//     });
//   }, []);

//   // Effet pour détecter la taille de l'écran
//   useEffect(() => {
//     const handleResize = () => {
//       // Si l'écran est plus grand que md (768px), toujours afficher les filtres
//       if (window.innerWidth >= 768) {
//         setIsFilterOpen(true);
//       } else {
//         setIsFilterOpen(false);
//       }
//     };

//     // Initialiser
//     handleResize();

//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   // Effet pour charger les bénéficiaires si nécessaire et s'il n'y en a pas encore
//   useEffect(() => {
//     if (isOccasionnellePeriode && availableBeneficiaires.length === 0) {
//       fetchBeneficiaires();
//     }
//   }, [isOccasionnellePeriode, availableBeneficiaires.length]);

//   // Effet pour charger les données initiales
//   useEffect(() => {
//     fetchIndicateursData();
//   }, [selectedPeriode, selectedExerciceId, selectedEntrepriseId, selectedBeneficiaireId]);

//   // Fonction pour basculer le mode sombre - utilise la fonction importée
//   const handleToggleDarkMode = () => {
//     const newDarkMode = !isDarkMode;
//     toggleDarkMode(newDarkMode);
//     setIsDarkMode(newDarkMode);
//   };

//   // Fonction pour récupérer la liste des bénéficiaires
//   const fetchBeneficiaires = async () => {
//     try {
//       const response = await axios.get('/api/beneficiaires', {
//         headers: {
//           'Accept': 'application/json',
//           'X-Requested-With': 'XMLHttpRequest'
//         }
//       });

//       if (response.data.success) {
//         setAvailableBeneficiaires(response.data.data);
//       }
//     } catch (err) {
//       console.error('Erreur lors de la récupération des bénéficiaires:', err);
//     }
//   };

//   const fetchIndicateursData = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       setNoData(false);

//       // Construire les paramètres de requête en fonction de la période
//       const params: any = {
//         periode_type: selectedPeriode,
//         exercice_id: selectedExerciceId
//       };

//       // Si période occasionnelle, utiliser bénéficiaire_id, sinon entreprise_id
//       if (isOccasionnellePeriode) {
//         if (selectedBeneficiaireId) {
//           params.beneficiaire_id = selectedBeneficiaireId;
//         }
//       } else {
//         if (selectedEntrepriseId) {
//           params.entreprise_id = selectedEntrepriseId;
//         }
//       }

//       const response = await axios.get('/api/indicateurs/analyse', {
//         params,
//         headers: {
//           'Accept': 'application/json',
//           'X-Requested-With': 'XMLHttpRequest'
//         }
//       });

//       if (response.data.success) {
//         if (response.data.no_data || Object.keys(response.data.data || {}).length === 0) {
//           setNoData(true);
//           setIndicateursData({});
//         } else {
//           setIndicateursData(response.data.data);
//         }

//         const categories = Object.keys(response.data.data || {});
//         if (categories.length > 0 && (!selectedCategorie || !categories.includes(selectedCategorie))) {
//           setSelectedCategorie(categories[0]);
//         } else if (categories.length === 0) {
//           setSelectedCategorie('');
//         }
//       } else {
//         setError('Échec de la récupération des données');
//       }
//     } catch (err) {
//       console.error('Erreur lors de la récupération des données:', err);
//       setError('Une erreur est survenue lors de la récupération des données');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const exportToExcel = () => {
//     const params = new URLSearchParams({
//       periode_type: selectedPeriode
//     });

//     if (selectedExerciceId) {
//       params.append('exercice_id', selectedExerciceId.toString());
//     }

//     // Exporter avec le bon ID selon la période
//     if (isOccasionnellePeriode) {
//       if (selectedBeneficiaireId) {
//         params.append('beneficiaire_id', selectedBeneficiaireId.toString());
//       }
//     } else {
//       if (selectedEntrepriseId) {
//         params.append('entreprise_id', selectedEntrepriseId.toString());
//       }
//     }

//     if (selectedCategorie) {
//       params.append('categorie', selectedCategorie);
//     }

//     window.location.href = `/api/indicateurs/export-excel?${params.toString()}`;
//   };

//   const categoriesDisponibles = useMemo(() => {
//     return Object.keys(indicateursData);
//   }, [indicateursData]);

//   const indicateursActifs = useMemo(() => {
//     if (!selectedCategorie || !indicateursData[selectedCategorie]) return [];
//     return indicateursData[selectedCategorie];
//   }, [indicateursData, selectedCategorie]);

//   const viewIndicateurDetails = (indicateur: any) => {
//     const params = new URLSearchParams({
//       categorie: selectedCategorie,
//       periode_type: selectedPeriode
//     });

//     if (selectedExerciceId) {
//       params.append('exercice_id', selectedExerciceId.toString());
//     }

//     // Ajouter le bon ID selon la période
//     if (isOccasionnellePeriode) {
//       if (selectedBeneficiaireId) {
//         params.append('beneficiaire_id', selectedBeneficiaireId.toString());
//       }
//     } else {
//       if (selectedEntrepriseId) {
//         params.append('entreprise_id', selectedEntrepriseId.toString());
//       }
//     }

//     window.location.href = `/indicateurs/detail/${indicateur.id}?${params.toString()}`;
//   };

//   // Fonction pour formater des nombres
//   const formatNumber = (num: number): string => {
//     if (typeof num !== 'number') return String(num);
//     return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
//   };


//   const NoDataMessage = () => (
//     <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600 p-4 sm:p-6 rounded-lg shadow-sm mb-6">
//       <div className="flex flex-col sm:flex-row">
//         <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-4">
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400 dark:text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//           </svg>
//         </div>
//         <div>
//           <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-300">
//             Aucune donnée disponible
//           </h3>
//           <div className="mt-2 text-yellow-700 dark:text-yellow-400">
//             <p>
//               Aucune donnée n'a été trouvée pour les critères sélectionnés. Veuillez vérifier que:
//             </p>
//             <ul className="mt-1 ml-5 list-disc">
//               <li>Des collectes de données ont été effectuées pour cette période</li>
//               {isOccasionnellePeriode ? (
//                 <li>Le bénéficiaire sélectionné a des données associées</li>
//               ) : (
//                 <li>L'entreprise sélectionnée a des données associées</li>
//               )}
//               <li>L'exercice choisi contient des données pour cette période</li>
//             </ul>
//             <p className="mt-2">
//               Essayez de modifier les filtres ou d'effectuer une nouvelle collecte de données.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderChart = (): React.ReactElement => {
//     const data = indicateursActifs.map(ind => ({
//       name: ind.label.length > 20 ? ind.label.substring(0, 20) + '...' : ind.label,
//       valeur: ind.value,
//       cible: ind.target,
//       unite: ind.unite
//     }));

//     // Couleurs adaptées au mode sombre/clair
//     const primaryColor = isDarkMode ? '#3b82f6' : '#3498db';
//     const secondaryColor = isDarkMode ? '#22c55e' : '#2ecc71';
//     const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
//     const textColor = isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)';

//     switch (chartType) {
//       case 'bar':
//         return (
//           <BarChart data={data}>
//             <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
//             <XAxis
//               dataKey="name"
//               height={60}
//               tick={{ fontSize: 12 }}
//               tickLine={false}
//               angle={-45}
//               textAnchor="end"
//               stroke={textColor}
//             />
//             <YAxis stroke={textColor} />
//             <Tooltip
//               formatter={(value: number) => [value.toLocaleString(), 'Valeur']}
//               labelFormatter={(label) => label}
//               contentStyle={{
//                 backgroundColor: isDarkMode ? '#1f2937' : '#fff',
//                 color: isDarkMode ? '#f3f4f6' : '#333',
//                 border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`
//               }}
//             />
//             <Legend
//               wrapperStyle={{
//                 color: textColor
//               }}
//             />
//             <Bar dataKey="valeur" name="Valeur" fill={primaryColor} />
//             <Bar dataKey="cible" name="Cible" fill={secondaryColor} />
//           </BarChart>
//         );
//       case 'line':
//         return (
//           <LineChart data={data}>
//             <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
//             <XAxis
//               dataKey="name"
//               height={60}
//               tick={{ fontSize: 12 }}
//               tickLine={false}
//               angle={-45}
//               textAnchor="end"
//               stroke={textColor}
//             />
//             <YAxis stroke={textColor} />
//             <Tooltip
//               formatter={(value: number) => [value.toLocaleString(), 'Valeur']}
//               labelFormatter={(label) => label}
//               contentStyle={{
//                 backgroundColor: isDarkMode ? '#1f2937' : '#fff',
//                 color: isDarkMode ? '#f3f4f6' : '#333',
//                 border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`
//               }}
//             />
//             <Legend
//               wrapperStyle={{
//                 color: textColor
//               }}
//             />
//             <Line type="monotone" dataKey="valeur" name="Valeur" stroke={primaryColor} />
//             <Line type="monotone" dataKey="cible" name="Cible" stroke={secondaryColor} strokeDasharray="5 5" />
//           </LineChart>
//         );
//       case 'pie':
//         return (
//           <PieChart>
//             <Pie
//               data={data}
//               cx="50%"
//               cy="50%"
//               labelLine={false}
//               outerRadius={80}
//               fill={primaryColor}
//               dataKey="valeur"
//               nameKey="name"
//               label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//             >
//               {data.map((entry, index) => (
//                 <Cell
//                   key={`cell-${index}`}
//                   fill={isDarkMode ?
//                     COLORS.map(color => color + '80')[index % COLORS.length] :
//                     COLORS[index % COLORS.length]}
//                 />
//               ))}
//             </Pie>
//             <Tooltip
//               formatter={(value: number) => [value.toLocaleString(), 'Valeur']}
//               contentStyle={{
//                 backgroundColor: isDarkMode ? '#1f2937' : '#fff',
//                 color: isDarkMode ? '#f3f4f6' : '#333',
//                 border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`
//               }}
//             />
//             <Legend
//               wrapperStyle={{
//                 color: textColor
//               }}
//             />
//           </PieChart>
//         );
//       default:
//         return <BarChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
//           <XAxis dataKey="name" stroke={textColor} />
//           <YAxis stroke={textColor} />
//           <Tooltip />
//           <Bar dataKey="valeur" fill={primaryColor} />
//         </BarChart>;
//     }
//   };

//   // Réinitialiser les filtres spécifiques quand on change de période
//   useEffect(() => {
//     setSelectedEntrepriseId(null);
//     setSelectedBeneficiaireId(null);
//   }, [selectedPeriode]);

//   return (
//     <AppLayout
//       title="Analyse Intégrée des Indicateurs"
//       user={auth?.user}
//       header={
//         <div className="flex justify-between items-center">
//           <div className="flex items-center">
//             <button
//               className="mr-2 md:hidden p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//               aria-expanded={isMobileMenuOpen}
//               aria-label="Menu principal"
//             >
//               {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
//             </button>
//             <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-100 leading-tight">Analyse Intégrée des Indicateurs</h2>
//           </div>
//           <div className="flex items-center gap-2">
//             <button
//               onClick={handleToggleDarkMode}
//               className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
//               aria-label={isDarkMode ? "Passer au mode clair" : "Passer au mode sombre"}
//             >
//               {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
//             </button>
//           </div>
//         </div>
//       }
//     >
//       <Head title="Analyse Intégrée des Indicateurs" />

//       {/* Menu mobile */}
//       <div className={`fixed inset-0 bg-gray-900/50 z-40 transition-opacity duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
//         <div className={`fixed top-0 left-0 w-64 h-full bg-white dark:bg-gray-800 shadow-lg transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
//           <div className="p-4">
//             <div className="flex justify-between items-center mb-6">
//               <h3 className="font-bold text-lg text-gray-800 dark:text-white">Menu</h3>
//               <button
//                 className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
//                 onClick={() => setIsMobileMenuOpen(false)}
//               >
//                 <X size={20} className="text-gray-700 dark:text-gray-300" />
//               </button>
//             </div>

//             <ul className="space-y-4">
//               <li>
//                 <Link
//                   href={route('indicateurs.analyse')}
//                   className="block py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
//                   onClick={() => setIsMobileMenuOpen(false)}
//                 >
//                   <ArrowLeft size={16} className="inline mr-2" />
//                   Interface standard
//                 </Link>
//               </li>
//               <li>
//                 <button
//                   onClick={() => {
//                     fetchIndicateursData();
//                     setIsMobileMenuOpen(false);
//                   }}
//                   className="block w-full text-left py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
//                 >
//                   <RotateCcw size={16} className="inline mr-2" />
//                   Actualiser
//                 </button>
//               </li>
//               <li className="pt-4 border-t border-gray-200 dark:border-gray-700">
//                 <button
//                   onClick={() => {
//                     setIsFilterOpen(!isFilterOpen);
//                     setIsMobileMenuOpen(false);
//                   }}
//                   className="block w-full text-left py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
//                 >
//                   <Filter size={16} className="inline mr-2" />
//                   Gérer les filtres
//                 </button>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </div>

//       <div className="py-6">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           {/* En-tête */}
//           <div className="bg-gradient-to-r from-blue-800 to-blue-600 dark:from-blue-900 dark:to-blue-700 text-white p-4 md:p-6 mb-6 rounded-lg shadow-lg">
//             <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
//               <div>
//                 <h1 className="text-xl md:text-2xl font-bold">Analyse Intégrée des Indicateurs</h1>
//                 <p className="text-sm md:text-base mt-1 opacity-80">Interface avancée avec visualisations personnalisées</p>
//               </div>
//               <div className="flex flex-wrap gap-2">
//                 <Link
//                   href={route('indicateurs.analyse')}
//                   className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-md text-sm transition-colors"
//                 >
//                   <ArrowLeft size={16} />
//                   <span className="hidden sm:inline">Interface standard</span>
//                 </Link>
//                 <button
//                   onClick={() => fetchIndicateursData()}
//                   className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-md text-sm transition-colors"
//                   aria-label="Actualiser les données"
//                 >
//                   <RotateCcw size={16} className={isLoading ? 'animate-spin' : ''} />
//                   <span className="hidden sm:inline">Actualiser</span>
//                 </button>
//                 <button
//                   className="md:hidden flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-md text-sm"
//                   onClick={() => setIsFilterOpen(!isFilterOpen)}
//                   aria-expanded={isFilterOpen}
//                   aria-controls="filter-panel"
//                 >
//                   <Filter size={16} />
//                   <span>Filtres</span>
//                   <ChevronDown size={16} className={`transform transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Filtres intégrés */}
//           <div className={`mb-6 transition-all duration-300 ${isFilterOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden md:max-h-screen md:opacity-100'}`} id="filter-panel">
//             <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
//               <div className="flex flex-col space-y-4">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-2">
//                     <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400" />
//                     <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Filtres</h3>
//                   </div>

//                   <button
//                     onClick={exportToExcel}
//                     className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm transition-colors"
//                     title="Exporter les données"
//                   >
//                     <Download size={16} />
//                     <span className="hidden sm:inline">Exporter</span>
//                   </button>
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                   {/* Sélecteur de période */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                       Période
//                     </label>
//                     <div className="flex flex-wrap gap-2">
//                       {periodes.map(periode => (
//                         <button
//                           key={periode}
//                           className={`px-3 py-2 rounded-md text-sm transition-colors ${
//                             selectedPeriode === periode
//                               ? 'bg-blue-600 text-white dark:bg-blue-500'
//                               : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
//                           }`}
//                           onClick={() => setSelectedPeriode(periode)}
//                         >
//                           {periode}
//                         </button>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Sélecteur d'exercice */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                       Exercice
//                     </label>
//                     <select
//                       value={selectedExerciceId || ''}
//                       onChange={(e) => setSelectedExerciceId(e.target.value ? parseInt(e.target.value) : null)}
//                       className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
//                     >
//                       <option value="">Tous les exercices</option>
//                       {exercices.map((exercice) => (
//                         <option key={exercice.id} value={exercice.id}>
//                           {exercice.annee} {exercice.actif && '(Actif)'}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   {/* Sélecteur d'entreprise OU bénéficiaire selon la période */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                       {isOccasionnellePeriode ? 'Bénéficiaire' : 'Entreprise'}
//                     </label>

//                     {isOccasionnellePeriode ? (
//                       <select
//                         value={selectedBeneficiaireId || ''}
//                         onChange={(e) => setSelectedBeneficiaireId(e.target.value ? parseInt(e.target.value) : null)}
//                         className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
//                       >
//                         <option value="">Tous les bénéficiaires</option>
//                         {availableBeneficiaires.map((beneficiaire) => (
//                           <option key={beneficiaire.id} value={beneficiaire.id}>
//                             {beneficiaire.nom} {beneficiaire.prenom}
//                           </option>
//                         ))}
//                       </select>
//                     ) : (
//                       <select
//                         value={selectedEntrepriseId || ''}
//                         onChange={(e) => setSelectedEntrepriseId(e.target.value ? parseInt(e.target.value) : null)}
//                         className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
//                       >
//                         <option value="">Toutes les entreprises</option>
//                         {entreprises.map((entreprise) => (
//                           <option key={entreprise.id} value={entreprise.id}>
//                             {entreprise.nom_entreprise}
//                           </option>
//                         ))}
//                       </select>
//                     )}
//                   </div>
//                 </div>

//                 {/* Réinitialiser les filtres */}
//                 {(selectedExerciceId || selectedEntrepriseId || selectedBeneficiaireId) && (
//                   <div className="flex justify-end">
//                     <button
//                       onClick={() => {
//                         setSelectedExerciceId(null);
//                         setSelectedEntrepriseId(null);
//                         setSelectedBeneficiaireId(null);
//                       }}
//                       className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
//                     >
//                       Réinitialiser les filtres
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Indicateur de chargement */}
//           {isLoading && (
//             <div className="flex items-center justify-center h-64">
//               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
//             </div>
//           )}

//           {/* Message d'erreur */}
//           {error && !isLoading && (
//             <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-6">
//               <p className="font-medium">Erreur</p>
//               <p>{error}</p>
//               <button
//                 onClick={fetchIndicateursData}
//                 className="mt-2 bg-red-200 hover:bg-red-300 dark:bg-red-800 dark:hover:bg-red-700 text-red-800 dark:text-red-200 px-3 py-1 rounded text-sm"
//               >
//                 Réessayer
//               </button>
//             </div>
//           )}

//           {/* Message d'absence de données */}
//           {!isLoading && !error && noData && (
//             <NoDataMessage />
//           )}

//           {/* Corps principal - sélection de catégorie et visualisations */}
//           {!isLoading && !error && !noData && (
//             <div className="space-y-6">
//               {/* Sélection de catégorie */}
//               {categoriesDisponibles.length > 0 && (
//                 <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
//                   <h3 className="font-medium mb-2 text-gray-700 dark:text-gray-300">Catégorie d'indicateurs:</h3>
//                   <div className="flex flex-wrap gap-2">
//                     {categoriesDisponibles.map(categorie => (
//                       <button
//                         key={categorie}
//                         className={`px-3 py-2 rounded-md text-sm transition-colors ${
//                           selectedCategorie === categorie
//                             ? 'bg-blue-600 text-white dark:bg-blue-500'
//                             : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
//                         }`}
//                         onClick={() => setSelectedCategorie(categorie)}
//                       >
//                         {categorie.length > 30 ? categorie.substring(0, 30) + '...' : categorie}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Visualisation des données */}
//               {selectedCategorie && indicateursActifs.length > 0 && (
//                 <>
//                   {/* Contrôles de graphique */}
//                   <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
//                     <h3 className="font-medium mb-2 text-gray-700 dark:text-gray-300">Type de graphique:</h3>
//                     <div className="flex flex-wrap gap-2">
//                       <button
//                         className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
//                           chartType === 'bar'
//                             ? 'bg-blue-600 text-white dark:bg-blue-500'
//                             : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
//                         }`}
//                         onClick={() => setChartType('bar')}
//                         aria-label="Graphique en barres"
//                       >
//                         <BarChartIcon size={16} />
//                         <span>Barres</span>
//                       </button>
//                       <button
//                         className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
//                           chartType === 'line'
//                             ? 'bg-blue-600 text-white dark:bg-blue-500'
//                             : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
//                         }`}
//                         onClick={() => setChartType('line')}
//                         aria-label="Graphique en ligne"
//                       >
//                         <LineChartIcon size={16} />
//                         <span>Ligne</span>
//                       </button>
//                       <button
//                         className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
//                           chartType === 'pie'
//                             ? 'bg-blue-600 text-white dark:bg-blue-500'
//                             : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
//                         }`}
//                         onClick={() => setChartType('pie')}
//                         aria-label="Graphique en camembert"
//                       >
//                         <PieChartIcon size={16} />
//                         <span>Camembert</span>
//                       </button>
//                     </div>
//                   </div>

//                   {/* Graphique */}
//                   <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
//                     <h3 className="font-medium mb-4 text-gray-700 dark:text-gray-300">Visualisation: {selectedCategorie}</h3>
//                     <div className="h-64 sm:h-80">
//                       <ResponsiveContainer width="100%" height="100%">
//                         {renderChart()}
//                       </ResponsiveContainer>
//                     </div>
//                   </div>

//                   {/* Contrôles du tableau */}
//                   <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
//                     <h3 className="font-medium mb-2 text-gray-700 dark:text-gray-300">Options du tableau:</h3>
//                     <div className="flex flex-wrap gap-4">
//                       <label className="flex items-center gap-1 cursor-pointer">
//                         <input
//                           type="checkbox"
//                           checked={visibleColumns.valeur}
//                           onChange={() => setVisibleColumns({...visibleColumns, valeur: !visibleColumns.valeur})}
//                           className="rounded text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
//                         />
//                         <span className="text-sm text-gray-700 dark:text-gray-300">Valeur</span>
//                       </label>
//                       <label className="flex items-center gap-1 cursor-pointer">
//                         <input
//                           type="checkbox"
//                           checked={visibleColumns.cible}
//                           onChange={() => setVisibleColumns({...visibleColumns, cible: !visibleColumns.cible})}
//                           className="rounded text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
//                         />
//                         <span className="text-sm text-gray-700 dark:text-gray-300">Cible</span>
//                       </label>
//                       <label className="flex items-center gap-1 cursor-pointer">
//                         <input
//                           type="checkbox"
//                           checked={visibleColumns.evolution}
//                           onChange={() => setVisibleColumns({...visibleColumns, evolution: !visibleColumns.evolution})}
//                           className="rounded text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
//                         />
//                         <span className="text-sm text-gray-700 dark:text-gray-300">Évolution</span>
//                       </label>
//                       <label className="flex items-center gap-1 cursor-pointer">
//                         <input
//                           type="checkbox"
//                           checked={visibleColumns.definition}
//                           onChange={() => setVisibleColumns({...visibleColumns, definition: !visibleColumns.definition})}
//                           className="rounded text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
//                         />
//                         <span className="text-sm text-gray-700 dark:text-gray-300">Définition</span>
//                       </label>
//                     </div>
//                   </div>

//                   {/* Tableau des données */}
//                   <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 overflow-hidden">
//                     <h3 className="font-medium mb-4 text-gray-700 dark:text-gray-300">Détail des indicateurs</h3>
//                     <div className="overflow-x-auto -mx-4 px-4">
//                       <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//                         <thead className="bg-gray-50 dark:bg-gray-700">
//                           <tr>
//                             <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                               Libellé
//                             </th>
//                             {visibleColumns.valeur && (
//                               <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                                 Valeur
//                               </th>
//                             )}
//                             {visibleColumns.cible && (
//                               <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                                 Cible
//                               </th>
//                             )}
//                             {visibleColumns.evolution && (
//                               <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                                 Écart
//                               </th>
//                             )}
//                             {visibleColumns.definition && (
//                               <th scope="col" className="hidden md:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                                 Définition
//                               </th>
//                             )}
//                             <th scope="col" className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                               Actions
//                             </th>
//                           </tr>
//                         </thead>
//                         <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
//                           {indicateursActifs.map((ind) => {
//                             const ecart = ind.value - ind.target;
//                             const ecartClass = ecart >= 0
//                               ? "text-green-600 dark:text-green-400"
//                               : "text-red-600 dark:text-red-400";
//                             const ecartPercentage = ind.target !== 0 ? ((ecart / ind.target) * 100).toFixed(2) : 'N/A';

//                             return (
//                               <tr key={ind.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
//                                 <td className="px-4 sm:px-6 py-4 whitespace-nowrap" data-label="Libellé">
//                                   <div className="text-sm font-medium text-gray-900 dark:text-white">
//                                     {ind.label}
//                                     {ind.is_calculated && (
//                                       <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200">
//                                         Calculé
//                                       </span>
//                                     )}
//                                   </div>
//                                   {visibleColumns.definition && !visibleColumns.definition && ind.definition && (
//                                     <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs md:hidden">
//                                       {ind.definition.substring(0, 60)}...
//                                     </div>
//                                   )}
//                                 </td>
//                                 {visibleColumns.valeur && (
//                                   <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white" data-label="Valeur">
//                                     {formatNumber(ind.value)} {ind.unite}
//                                   </td>
//                                 )}
//                                 {visibleColumns.cible && (
//                                   <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white" data-label="Cible">
//                                     {formatNumber(ind.target)} {ind.unite}
//                                   </td>
//                                 )}
//                                 {visibleColumns.evolution && (
//                                   <td className={`px-4 sm:px-6 py-4 whitespace-nowrap text-sm ${ecartClass}`} data-label="Écart">
//                                     {ecart.toLocaleString()} {ind.unite} <span className="whitespace-nowrap">({ecartPercentage}%)</span>
//                                   </td>
//                                 )}
//                                 {visibleColumns.definition && (
//                                   <td className="hidden md:table-cell px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400" data-label="Définition">
//                                     <div className="group relative max-w-xs">
//                                       <div className="truncate">
//                                         {ind.definition.length > 60 ? ind.definition.substring(0, 60) + '...' : ind.definition}
//                                       </div>
//                                       {ind.definition.length > 60 && (
//                                         <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute z-10 -mt-2 w-72 max-w-xs bg-gray-800 dark:bg-gray-700 text-white dark:text-gray-100 text-xs rounded py-2 px-3 right-0 top-full">
//                                           {ind.definition}
//                                         </div>
//                                       )}
//                                     </div>
//                                   </td>
//                                 )}
//                                 <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-right" data-label="Actions">
//                                   <button
//                                     onClick={() => viewIndicateurDetails(ind)}
//                                     className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
//                                     title="Voir les détails"
//                                     aria-label={`Voir les détails de l'indicateur ${ind.label}`}
//                                   >
//                                     <Eye size={18} />
//                                   </button>
//                                 </td>
//                               </tr>
//                             );
//                           })}
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>
//                 </>
//               )}
//             </div>
//           )}

//           {/* Pied de page avec information sur la version et les indicateurs de réactivité */}
//           <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
//             <div className="flex flex-col sm:flex-row items-center justify-between">
//               <div className="text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-0">
//                 <p>© {new Date().getFullYear()} - Plateforme de Suivi des Indicateurs</p>
//                 <p className="text-xs">Version 2.4.0 - Interface adaptative</p>
//               </div>
//               <div className="flex items-center space-x-3">
//                 <span className="hidden sm:inline-block text-xs text-gray-500 dark:text-gray-400">
//                   Affichage:
//                 </span>
//                 <span className="inline-block sm:hidden px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
//                   Mobile
//                 </span>
//                 <span className="hidden sm:inline-block md:hidden px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
//                   Tablette
//                 </span>
//                 <span className="hidden md:inline-block lg:hidden px-2 py-1 text-xs rounded-full bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
//                   Portable
//                 </span>
//                 <span className="hidden lg:inline-block px-2 py-1 text-xs rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
//                   Grand écran
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </AppLayout>
//   );
// };

// export default AnalyseIntegree;


import React, { useState, useEffect, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import axios from 'axios';
import { PageProps } from '@/types';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Filter,
  RotateCcw,
  ArrowLeft,
  Download,
  ChevronDown,
  Sun,
  Moon,
  BarChart as BarChartIcon,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Eye,
  Menu,
  X
} from 'lucide-react';
import { initDarkMode, listenForThemeChanges, toggleDarkMode } from '@/Utils/darkMode';

// Types
interface Indicateur {
  id: string;
  label: string;
  value: number;
  target: number;
  unite: string;
  definition: string;
  is_calculated?: boolean;
  metadata?: {
    entreprise_ids: number[];
    beneficiaire_ids?: number[];
    collecte_ids: number[];
    periodes: string[];
    nombre_points_donnees: number;
  };
}

interface IndicateursParCategorie {
  [categorie: string]: Indicateur[];
}

interface Exercice {
  id: number;
  annee: number;
  date_debut: string;
  date_fin: string;
  actif: boolean;
}

interface Entreprise {
  id: number;
  nom_entreprise: string;
  secteur_activite: string;
}

interface Beneficiaire {
  id: number;
  nom: string;
  prenom: string;
  type_beneficiaire?: string;
}

// Props pour le composant
interface AnalyseIntegreeProps extends PageProps {
  exercices: Exercice[];
  entreprises: Entreprise[];
  beneficiaires?: Beneficiaire[];
  defaultExerciceId: number | null;
  defaultPeriodeType: string;
  periodes: string[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const AnalyseIntegree: React.FC<AnalyseIntegreeProps> = ({
  auth,
  exercices,
  entreprises,
  beneficiaires = [],
  defaultExerciceId,
  defaultPeriodeType,
  periodes
}) => {
  // État pour le thème
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => initDarkMode());

  // État pour le menu mobile et filtres
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // États pour les filtres
  const [selectedPeriode, setSelectedPeriode] = useState<string>(defaultPeriodeType);
  const [selectedExerciceId, setSelectedExerciceId] = useState<number | null>(defaultExerciceId);
  const [selectedEntrepriseId, setSelectedEntrepriseId] = useState<number | null>(null);
  const [selectedBeneficiaireId, setSelectedBeneficiaireId] = useState<number | null>(null);
  const [selectedCategorie, setSelectedCategorie] = useState<string>('');

  // États pour les données
  const [indicateursData, setIndicateursData] = useState<IndicateursParCategorie>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [noData, setNoData] = useState<boolean>(false);

  // État pour récupérer les bénéficiaires si nécessaire
  const [availableBeneficiaires, setAvailableBeneficiaires] = useState<Beneficiaire[]>(beneficiaires);

  // État pour la visualisation
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');

  // État pour les colonnes visibles du tableau
  const [visibleColumns, setVisibleColumns] = useState({
    valeur: true,
    cible: true,
    evolution: true,
    definition: true
  });

  // Déterminer si on doit afficher le filtre bénéficiaire au lieu d'entreprise
  const isOccasionnellePeriode = useMemo(() => {
    return selectedPeriode.toLowerCase() === 'occasionnelle';
  }, [selectedPeriode]);

  // Écouter les changements de préférence système pour le mode sombre
  useEffect(() => {
    listenForThemeChanges((isDark: boolean) => {
      setIsDarkMode(isDark);
    });
  }, []);

  // Effet pour détecter la taille de l'écran
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsFilterOpen(true);
      } else {
        setIsFilterOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Effet pour charger les bénéficiaires si nécessaire
  useEffect(() => {
    if (isOccasionnellePeriode && availableBeneficiaires.length === 0) {
      fetchBeneficiaires();
    }
  }, [isOccasionnellePeriode, availableBeneficiaires.length]);

  // Effet pour charger les données initiales
  useEffect(() => {
    fetchIndicateursData();
  }, [selectedPeriode, selectedExerciceId, selectedEntrepriseId, selectedBeneficiaireId]);

  // Fonction pour basculer le mode sombre
  const handleToggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    toggleDarkMode(newDarkMode);
    setIsDarkMode(newDarkMode);
  };

  // Fonction pour récupérer la liste des bénéficiaires
  const fetchBeneficiaires = async () => {
    try {
      const response = await axios.get('/api/beneficiaires', {
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      if (response.data.success) {
        setAvailableBeneficiaires(response.data.data);
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des bénéficiaires:', err);
    }
  };

  const fetchIndicateursData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setNoData(false);

      // Construire les paramètres de requête en fonction de la période
      const params: any = {
        periode_type: selectedPeriode,
        exercice_id: selectedExerciceId
      };

      // Si période occasionnelle, utiliser bénéficiaire_id, sinon entreprise_id
      if (isOccasionnellePeriode) {
        if (selectedBeneficiaireId) {
          params.beneficiaire_id = selectedBeneficiaireId;
        }
      } else {
        if (selectedEntrepriseId) {
          params.entreprise_id = selectedEntrepriseId;
        }
      }

      const response = await axios.get('/api/indicateurs/analyse', {
        params,
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      if (response.data.success) {
        if (response.data.no_data || Object.keys(response.data.data || {}).length === 0) {
          setNoData(true);
          setIndicateursData({});
        } else {
          setIndicateursData(response.data.data);
        }

        const categories = Object.keys(response.data.data || {});
        if (categories.length > 0 && (!selectedCategorie || !categories.includes(selectedCategorie))) {
          setSelectedCategorie(categories[0]);
        } else if (categories.length === 0) {
          setSelectedCategorie('');
        }
      } else {
        setError('Échec de la récupération des données');
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des données:', err);
      setError('Une erreur est survenue lors de la récupération des données');
    } finally {
      setIsLoading(false);
    }
  };

  const exportToExcel = () => {
    const params = new URLSearchParams({
      periode_type: selectedPeriode
    });

    if (selectedExerciceId) {
      params.append('exercice_id', selectedExerciceId.toString());
    }

    // Exporter avec le bon ID selon la période
    if (isOccasionnellePeriode) {
      if (selectedBeneficiaireId) {
        params.append('beneficiaire_id', selectedBeneficiaireId.toString());
      }
    } else {
      if (selectedEntrepriseId) {
        params.append('entreprise_id', selectedEntrepriseId.toString());
      }
    }

    if (selectedCategorie) {
      params.append('categorie', selectedCategorie);
    }

    window.location.href = `/api/indicateurs/export-excel?${params.toString()}`;
  };

  const categoriesDisponibles = useMemo(() => {
    return Object.keys(indicateursData);
  }, [indicateursData]);

  const indicateursActifs = useMemo(() => {
    if (!selectedCategorie || !indicateursData[selectedCategorie]) return [];
    return indicateursData[selectedCategorie];
  }, [indicateursData, selectedCategorie]);

  const viewIndicateurDetails = (indicateur: any) => {
    const params = new URLSearchParams({
      categorie: selectedCategorie,
      periode_type: selectedPeriode
    });

    if (selectedExerciceId) {
      params.append('exercice_id', selectedExerciceId.toString());
    }

    // Ajouter le bon ID selon la période
    if (isOccasionnellePeriode) {
      if (selectedBeneficiaireId) {
        params.append('beneficiaire_id', selectedBeneficiaireId.toString());
      }
    } else {
      if (selectedEntrepriseId) {
        params.append('entreprise_id', selectedEntrepriseId.toString());
      }
    }

    window.location.href = `/indicateurs/detail/${indicateur.id}?${params.toString()}`;
  };

  // Fonction pour formater des nombres
  const formatNumber = (num: number): string => {
    if (typeof num !== 'number') return String(num);
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  // Calculer l'évolution d'un indicateur
  const calculateEvolution = (value: number, target: number): string => {
    if (target === 0) return 'N/A';
    const evolution = ((value - target) / target) * 100;
    const sign = evolution >= 0 ? '+' : '';
    return `${sign}${evolution.toFixed(1)}%`;
  };

  const NoDataMessage = () => (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600 p-4 sm:p-6 rounded-lg shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row">
        <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400 dark:text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-300">
            Aucune donnée disponible
          </h3>
          <div className="mt-2 text-yellow-700 dark:text-yellow-400">
            <p>
              Aucune donnée n'a été trouvée pour les critères sélectionnés. Veuillez vérifier que:
            </p>
            <ul className="mt-1 ml-5 list-disc">
              <li>Des collectes de données ont été effectuées pour cette période</li>
              {isOccasionnellePeriode ? (
                <li>Le bénéficiaire sélectionné a des données associées</li>
              ) : (
                <li>L'entreprise sélectionnée a des données associées</li>
              )}
              <li>L'exercice choisi contient des données pour cette période</li>
            </ul>
            <p className="mt-2">
              Essayez de modifier les filtres ou d'effectuer une nouvelle collecte de données.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderChart = (): React.ReactElement => {
    const data = indicateursActifs.map(ind => ({
      name: ind.label.length > 20 ? ind.label.substring(0, 20) + '...' : ind.label,
      valeur: ind.value,
      cible: ind.target,
      unite: ind.unite
    }));

    // Couleurs adaptées au mode sombre/clair
    const primaryColor = isDarkMode ? '#3b82f6' : '#3498db';
    const secondaryColor = isDarkMode ? '#22c55e' : '#2ecc71';
    const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    const textColor = isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)';

    switch (chartType) {
      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              dataKey="name"
              height={60}
              tick={{ fontSize: 12 }}
              tickLine={false}
              angle={-45}
              textAnchor="end"
              stroke={textColor}
            />
            <YAxis stroke={textColor} />
            <Tooltip
              formatter={(value: number) => [value.toLocaleString(), 'Valeur']}
              labelFormatter={(label) => label}
              contentStyle={{
                backgroundColor: isDarkMode ? '#1f2937' : '#fff',
                color: isDarkMode ? '#f3f4f6' : '#333',
                border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`
              }}
            />
            <Legend
              wrapperStyle={{
                color: textColor
              }}
            />
            <Bar dataKey="valeur" name="Valeur" fill={primaryColor} />
            <Bar dataKey="cible" name="Cible" fill={secondaryColor} />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              dataKey="name"
              height={60}
              tick={{ fontSize: 12 }}
              tickLine={false}
              angle={-45}
              textAnchor="end"
              stroke={textColor}
            />
            <YAxis stroke={textColor} />
            <Tooltip
              formatter={(value: number) => [value.toLocaleString(), 'Valeur']}
              labelFormatter={(label) => label}
              contentStyle={{
                backgroundColor: isDarkMode ? '#1f2937' : '#fff',
                color: isDarkMode ? '#f3f4f6' : '#333',
                border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`
              }}
            />
            <Legend
              wrapperStyle={{
                color: textColor
              }}
            />
            <Line type="monotone" dataKey="valeur" name="Valeur" stroke={primaryColor} />
            <Line type="monotone" dataKey="cible" name="Cible" stroke={secondaryColor} strokeDasharray="5 5" />
          </LineChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill={primaryColor}
              dataKey="valeur"
              nameKey="name"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={isDarkMode ?
                    COLORS.map(color => color + '80')[index % COLORS.length] :
                    COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [value.toLocaleString(), 'Valeur']}
              contentStyle={{
                backgroundColor: isDarkMode ? '#1f2937' : '#fff',
                color: isDarkMode ? '#f3f4f6' : '#333',
                border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`
              }}
            />
            <Legend
              wrapperStyle={{
                color: textColor
              }}
            />
          </PieChart>
        );
      default:
        return <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="name" stroke={textColor} />
          <YAxis stroke={textColor} />
          <Tooltip />
          <Bar dataKey="valeur" fill={primaryColor} />
        </BarChart>;
    }
  };

  // Réinitialiser les filtres spécifiques quand on change de période
  useEffect(() => {
    setSelectedEntrepriseId(null);
    setSelectedBeneficiaireId(null);
  }, [selectedPeriode]);

  return (
    <AppLayout
      title="Analyse Intégrée des Indicateurs"
      user={auth?.user}
      header={
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <button
              className="mr-2 md:hidden p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-label="Menu principal"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-100 leading-tight">Analyse Intégrée des Indicateurs</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleDarkMode}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              aria-label={isDarkMode ? "Passer au mode clair" : "Passer au mode sombre"}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      }
    >
      <Head title="Analyse Intégrée des Indicateurs" />

      {/* Menu mobile */}
      <div className={`fixed inset-0 bg-gray-900/50 z-40 transition-opacity duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`fixed top-0 left-0 w-64 h-full bg-white dark:bg-gray-800 shadow-lg transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg text-gray-800 dark:text-white">Menu</h3>
              <button
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X size={20} className="text-gray-700 dark:text-gray-300" />
              </button>
            </div>

            <ul className="space-y-4">
              <li>
                <Link
                  href={route('indicateurs.analyse')}
                  className="block py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ArrowLeft size={16} className="inline mr-2" />
                  Interface standard
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    fetchIndicateursData();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  <RotateCcw size={16} className="inline mr-2" />
                  Actualiser
                </button>
              </li>
              <li className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    setIsFilterOpen(!isFilterOpen);
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  <Filter size={16} className="inline mr-2" />
                  Gérer les filtres
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* En-tête */}
          <div className="bg-gradient-to-r from-blue-800 to-blue-600 dark:from-blue-900 dark:to-blue-700 text-white p-4 md:p-6 mb-6 rounded-lg shadow-lg">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <h1 className="text-xl md:text-2xl font-bold">Analyse Intégrée des Indicateurs</h1>
                <p className="text-sm md:text-base mt-1 opacity-80">Interface avancée avec visualisations personnalisées</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={route('indicateurs.analyse')}
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-md text-sm transition-colors"
                >
                  <ArrowLeft size={16} />
                  <span className="hidden sm:inline">Interface standard</span>
                </Link>
                <button
                  onClick={() => fetchIndicateursData()}
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-md text-sm transition-colors"
                  aria-label="Actualiser les données"
                >
                  <RotateCcw size={16} className={isLoading ? 'animate-spin' : ''} />
                  <span className="hidden sm:inline">Actualiser</span>
                </button>
                <button
                  className="md:hidden flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-md text-sm"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  aria-expanded={isFilterOpen}
                  aria-controls="filter-panel"
                >
                  <Filter size={16} />
                  <span>Filtres</span>
                  <ChevronDown size={16} className={`transform transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Filtres intégrés */}
          <div className={`mb-6 transition-all duration-300 ${isFilterOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden md:max-h-screen md:opacity-100'}`} id="filter-panel">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Filtres</h3>
                  </div>

                  <button
                    onClick={exportToExcel}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm transition-colors"
                    title="Exporter les données"
                  >
                    <Download size={16} />
                    <span className="hidden sm:inline">Exporter</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Sélecteur de période */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Période
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {periodes.map(periode => (
                        <button
                          key={periode}
                          className={`px-3 py-2 rounded-md text-sm transition-colors ${
                            selectedPeriode === periode
                              ? 'bg-blue-600 text-white dark:bg-blue-500'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                          }`}
                          onClick={() => setSelectedPeriode(periode)}
                        >
                          {periode}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sélecteur d'exercice */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Exercice
                    </label>
                    <select
                      value={selectedExerciceId || ''}
                      onChange={(e) => setSelectedExerciceId(e.target.value ? parseInt(e.target.value) : null)}
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="">Tous les exercices</option>
                      {exercices.map((exercice) => (
                        <option key={exercice.id} value={exercice.id}>
                          {exercice.annee} {exercice.actif && '(Actif)'}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sélecteur d'entreprise OU bénéficiaire selon la période */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {isOccasionnellePeriode ? 'Bénéficiaire' : 'Entreprise'}
                    </label>

                    {isOccasionnellePeriode ? (
                      <select
                        value={selectedBeneficiaireId || ''}
                        onChange={(e) => setSelectedBeneficiaireId(e.target.value ? parseInt(e.target.value) : null)}
                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="">Tous les bénéficiaires</option>
                        {availableBeneficiaires.map((beneficiaire) => (
                          <option key={beneficiaire.id} value={beneficiaire.id}>
                            {beneficiaire.nom} {beneficiaire.prenom}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <select
                        value={selectedEntrepriseId || ''}
                        onChange={(e) => setSelectedEntrepriseId(e.target.value ? parseInt(e.target.value) : null)}
                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="">Toutes les entreprises</option>
                        {entreprises.map((entreprise) => (
                          <option key={entreprise.id} value={entreprise.id}>
                            {entreprise.nom_entreprise}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                {/* Réinitialiser les filtres */}
                {(selectedExerciceId || selectedEntrepriseId || selectedBeneficiaireId) && (
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        setSelectedExerciceId(null);
                        setSelectedEntrepriseId(null);
                        setSelectedBeneficiaireId(null);
                      }}
                      className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Réinitialiser les filtres
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Indicateur de chargement */}
          {isLoading && (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
            </div>
          )}

          {/* Message d'erreur */}
          {error && !isLoading && (
            <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-6">
              <p className="font-medium">Erreur</p>
              <p>{error}</p>
              <button
                onClick={fetchIndicateursData}
                className="mt-2 bg-red-200 hover:bg-red-300 dark:bg-red-800 dark:hover:bg-red-700 text-red-800 dark:text-red-200 px-3 py-1 rounded text-sm"
              >
                Réessayer
              </button>
            </div>
          )}

          {/* Message d'absence de données */}
          {!isLoading && !error && noData && (
            <NoDataMessage />
          )}

          {/* Corps principal - sélection de catégorie et visualisations */}
          {!isLoading && !error && !noData && (
            <div className="space-y-6">
              {/* Sélection de catégorie */}
              {categoriesDisponibles.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                  <h3 className="font-medium mb-2 text-gray-700 dark:text-gray-300">Catégorie d'indicateurs:</h3>
                  <div className="flex flex-wrap gap-2">
                    {categoriesDisponibles.map(categorie => (
                      <button
                        key={categorie}
                        className={`px-3 py-2 rounded-md text-sm transition-colors ${
                          selectedCategorie === categorie
                            ? 'bg-blue-600 text-white dark:bg-blue-500'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                        onClick={() => setSelectedCategorie(categorie)}
                      >
                        {categorie.length > 30 ? categorie.substring(0, 30) + '...' : categorie}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Visualisation des données */}
              {selectedCategorie && indicateursActifs.length > 0 && (
                <>
                  {/* Contrôles de graphique */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                    <h3 className="font-medium mb-2 text-gray-700 dark:text-gray-300">Type de graphique:</h3>
                    <div className="flex flex-wrap gap-2">
                      <button
                        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                          chartType === 'bar'
                            ? 'bg-blue-600 text-white dark:bg-blue-500'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                        onClick={() => setChartType('bar')}
                        aria-label="Graphique en barres"
                      >
                        <BarChartIcon size={16} />
                        <span>Barres</span>
                      </button>
                      <button
                        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                          chartType === 'line'
                            ? 'bg-blue-600 text-white dark:bg-blue-500'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                        onClick={() => setChartType('line')}
                        aria-label="Graphique en ligne"
                      >
                        <LineChartIcon size={16} />
                        <span>Ligne</span>
                      </button>
                      <button
                        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                          chartType === 'pie'
                            ? 'bg-blue-600 text-white dark:bg-blue-500'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                        onClick={() => setChartType('pie')}
                        aria-label="Graphique en camembert"
                      >
                        <PieChartIcon size={16} />
                        <span>Camembert</span>
                      </button>
                    </div>
                  </div>

                  {/* Graphique */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                    <h3 className="font-medium mb-4 text-gray-700 dark:text-gray-300">Visualisation: {selectedCategorie}</h3>
                    <div className="h-64 sm:h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        {renderChart()}
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Contrôles du tableau */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                    <h3 className="font-medium mb-2 text-gray-700 dark:text-gray-300">Options du tableau:</h3>
                    <div className="flex flex-wrap gap-4">
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={visibleColumns.valeur}
                          onChange={() => setVisibleColumns({...visibleColumns, valeur: !visibleColumns.valeur})}
                          className="rounded text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Valeur</span>
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={visibleColumns.cible}
                          onChange={() => setVisibleColumns({...visibleColumns, cible: !visibleColumns.cible})}
                          className="rounded text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Cible</span>
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={visibleColumns.evolution}
                          onChange={() => setVisibleColumns({...visibleColumns, evolution: !visibleColumns.evolution})}
                          className="rounded text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Évolution</span>
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={visibleColumns.definition}
                          onChange={() => setVisibleColumns({...visibleColumns, definition: !visibleColumns.definition})}
                          className="rounded text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Définition</span>
                      </label>
                    </div>
                  </div>

                  {/* Tableau des données */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 overflow-hidden">
                    <h3 className="font-medium mb-4 text-gray-700 dark:text-gray-300">Détail des indicateurs</h3>
                    <div className="overflow-x-auto -mx-4 px-4">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Libellé
                            </th>
                            {visibleColumns.valeur && (
                              <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Valeur
                              </th>
                            )}
                            {visibleColumns.cible && (
                              <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Cible
                              </th>
                            )}
                            {visibleColumns.evolution && (
                              <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Écart
                              </th>
                            )}
                            {visibleColumns.definition && (
                              <th scope="col" className="hidden md:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Définition
                              </th>
                            )}
                            <th scope="col" className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {indicateursActifs.map((ind) => {
                            const evolution = calculateEvolution(ind.value, ind.target);
                            const evolutionClass = evolution === 'N/A'
                              ? "text-gray-600 dark:text-gray-400"
                              : evolution.startsWith('+')
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400";

                            return (
                              <tr key={ind.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap" data-label="Libellé">
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {ind.label}
                                    {ind.is_calculated && (
                                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200">
                                        Calculé
                                      </span>
                                    )}
                                  </div>
                                  {visibleColumns.definition && !visibleColumns.definition && ind.definition && (
                                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs md:hidden">
                                      {ind.definition.substring(0, 60)}...
                                    </div>
                                  )}
                                </td>
                                {visibleColumns.valeur && (
                                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white" data-label="Valeur">
                                    {formatNumber(ind.value)} {ind.unite}
                                  </td>
                                )}
                                {visibleColumns.cible && (
                                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white" data-label="Cible">
                                    {formatNumber(ind.target)} {ind.unite}
                                  </td>
                                )}
                                {visibleColumns.evolution && (
                                  <td className={`px-4 sm:px-6 py-4 whitespace-nowrap text-sm ${evolutionClass}`} data-label="Écart">
                                    {evolution}
                                  </td>
                                )}
                                {visibleColumns.definition && (
                                  <td className="hidden md:table-cell px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400" data-label="Définition">
                                    <div className="group relative max-w-xs">
                                      <div className="truncate">
                                        {ind.definition.length > 60 ? ind.definition.substring(0, 60) + '...' : ind.definition}
                                      </div>
                                      {ind.definition.length > 60 && (
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute z-10 -mt-2 w-72 max-w-xs bg-gray-800 dark:bg-gray-700 text-white dark:text-gray-100 text-xs rounded py-2 px-3 right-0 top-full">
                                          {ind.definition}
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                )}
                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-right" data-label="Actions">
                                  <button
                                    onClick={() => viewIndicateurDetails(ind)}
                                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                                    title="Voir les détails"
                                    aria-label={`Voir les détails de l'indicateur ${ind.label}`}
                                  >
                                    <Eye size={18} />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Pied de page avec information sur la version et les indicateurs de réactivité */}
          <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-0">
                <p>© {new Date().getFullYear()} - Plateforme de Suivi des Indicateurs</p>
                <p className="text-xs">Version 3.0.0 - Interface adaptative avec calculs réels</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="hidden sm:inline-block text-xs text-gray-500 dark:text-gray-400">
                  Affichage:
                </span>
                <span className="inline-block sm:hidden px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                  Mobile
                </span>
                <span className="hidden sm:inline-block md:hidden px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                  Tablette
                </span>
                <span className="hidden md:inline-block lg:hidden px-2 py-1 text-xs rounded-full bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                  Portable
                </span>
                <span className="hidden lg:inline-block px-2 py-1 text-xs rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                  Grand écran
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AnalyseIntegree;
