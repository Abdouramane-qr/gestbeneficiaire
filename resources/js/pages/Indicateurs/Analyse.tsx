// // // resources/js/Pages/Indicateurs/Analyse.tsx
// // import React, { useState, useEffect, useMemo } from 'react';
// // import { Head } from '@inertiajs/react';
// // import {
// //   LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
// //   Tooltip, Legend, ResponsiveContainer
// // } from 'recharts';
// // import axios from 'axios';

// // // Composants d'interface utilisateur
// // import { PageProps } from '@/types';

// // // Icônes pour l'interface (utilise Lucide React)
// // import {
// //   Download, FileSpreadsheet,  ChevronDown,
// //   ChevronUp, Info, Eye,  X, RefreshCw as Refresh,
// // } from 'lucide-react';
// // import AppLayout from '@/layouts/app-layout';

// // // Types pour les données d'indicateurs
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
// // interface AnalyseProps extends PageProps {
// //   exercices: Exercice[];
// //   entreprises: Entreprise[];
// //   defaultExerciceId: number | null;
// //   defaultPeriodeType: string;
// //   periodes: string[];
// // }

// // // Constantes pour les couleurs
// // const COLORS = {
// //   primary: '#3498db',
// //   secondary: '#2ecc71',
// //   tertiary: '#e74c3c',
// //   dark: '#2c3e50',
// //   light: '#ecf0f1',
// //   warning: '#f39c12',
// //   success: '#27ae60'
// // };

// // const Analyse: React.FC<AnalyseProps> = ({
// //   auth,
// //   exercices,
// //   entreprises,
// //   defaultExerciceId,
// //   defaultPeriodeType,
// //   periodes
// // }) => {
// //   // États
// //   const [activeTab, setActiveTab] = useState<'analysis' | 'calculations'>('analysis');
// //   const [activePeriode, setActivePeriode] = useState<string>(defaultPeriodeType);
// //   const [activeCategorie, setActiveCategorie] = useState<string>('');
// //   const [selectedExerciceId, setSelectedExerciceId] = useState<number | null>(defaultExerciceId);
// //   const [selectedEntrepriseId, setSelectedEntrepriseId] = useState<number | null>(null);
// //   const [indicateursData, setIndicateursData] = useState<IndicateursParCategorie>({});
// //   const [isLoading, setIsLoading] = useState<boolean>(true);
// //   const [error, setError] = useState<string | null>(null);
// //   const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
// //   const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
// //   const [visibleColumns, setVisibleColumns] = useState({
// //     valeur: true,
// //     cible: true,
// //     evolution: true,
// //     definition: true
// //   });

// //   // Fonction pour formater les nombres avec séparateurs de milliers
// //   const formatNumber = (num: number): string => {
// //     if (typeof num !== 'number') return String(num);
// //     return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
// //   };

// //   // Effet pour charger les données des indicateurs
// //   useEffect(() => {
// //     fetchIndicateursData();
// //   }, [activePeriode, selectedExerciceId, selectedEntrepriseId]);

// //  // Fonction complète fetchIndicateursData pour Analyse.tsx

// // const fetchIndicateursData = async () => {
// //     try {
// //       setIsLoading(true);
// //       setError(null);

// //       // S'assurer que activePeriode a toujours une valeur
// //       const periodeToUse = activePeriode || 'Trimestrielle';

// //       console.log('Envoi des paramètres:', {
// //         periode_type: periodeToUse,
// //         exercice_id: selectedExerciceId,
// //         entreprise_id: selectedEntrepriseId
// //       });

// //       // Assurez-vous que l'URL commence par /api/
// //       const response = await axios.get('/api/indicateurs/analyse', {
// //         params: {
// //           periode_type: periodeToUse,
// //           exercice_id: selectedExerciceId,
// //           entreprise_id: selectedEntrepriseId
// //         },
// //         headers: {
// //           // Indique explicitement que nous attendons une réponse JSON
// //           'Accept': 'application/json',
// //           'X-Requested-With': 'XMLHttpRequest'
// //         }
// //       });

// //       if (response.data.success) {
// //         setIndicateursData(response.data.data);
// //         setLastUpdate(new Date());

// //         // Si aucune catégorie n'est sélectionnée, sélectionner la première
// //         const categories = Object.keys(response.data.data);
// //         if (categories.length > 0 && (!activeCategorie || !categories.includes(activeCategorie))) {
// //           setActiveCategorie(categories[0]);
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

// //   // Récupérer les catégories disponibles pour la période active
// //   const categoriesDisponibles = useMemo(() => {
// //     return Object.keys(indicateursData);
// //   }, [indicateursData]);

// //   // Récupérer les indicateurs pour la catégorie active
// //   const indicateursActifs = useMemo(() => {
// //     if (!activeCategorie || !indicateursData[activeCategorie]) return [];
// //     return indicateursData[activeCategorie];
// //   }, [indicateursData, activeCategorie]);

// //   // Méthode pour exporter les données au format Excel
// //   const exportToExcel = (categorie: string) => {
// //     const params = new URLSearchParams({
// //       periode_type: activePeriode,
// //       categorie: categorie
// //     });

// //     if (selectedExerciceId) {
// //       params.append('exercice_id', selectedExerciceId.toString());
// //     }

// //     if (selectedEntrepriseId) {
// //       params.append('entreprise_id', selectedEntrepriseId.toString());
// //     }

// //     window.location.href = `/api/indicateurs/export-excel?${params.toString()}`;
// //   };

// //   // Méthode pour exporter toutes les données
// //   const exportAllToExcel = () => {
// //     const params = new URLSearchParams({
// //       periode_type: activePeriode
// //     });

// //     if (selectedExerciceId) {
// //       params.append('exercice_id', selectedExerciceId.toString());
// //     }

// //     if (selectedEntrepriseId) {
// //       params.append('entreprise_id', selectedEntrepriseId.toString());
// //     }

// //     window.location.href = `/api/indicateurs/export-excel?${params.toString()}`;
// //   };

// //   // Gérer l'expansion/réduction des catégories dans la vue détaillée
// //   const toggleCategoryExpand = (categorie: string) => {
// //     setExpandedCategories(prev => ({
// //       ...prev,
// //       [categorie]: !prev[categorie]
// //     }));
// //   };

// //   // Générer des données simulées pour les graphiques
// //   const generateChartData = (indicateur: Indicateur) => {
// //     // Dans une application réelle, ces données viendraient d'une API
// //     const baseValue = indicateur.value * 0.7;

// //     return [
// //       { name: 'P1', value: Math.round(baseValue) },
// //       { name: 'P2', value: Math.round(baseValue * 1.2) },
// //       { name: 'P3', value: Math.round(baseValue * 1.3) },
// //       { name: 'P4', value: indicateur.value }
// //     ];
// //   };

// //   // Générer des données pour le graphique de synthèse
// //   const generateSummaryChartData = () => {
// //     if (!indicateursActifs.length) return [];

// //     // Limiter à 8 indicateurs pour la lisibilité
// //     const limitedIndicateurs = indicateursActifs.slice(0, 8);

// //     // Formater pour le graphique de comparaison
// //     return limitedIndicateurs.map(ind => ({
// //       name: ind.label.length > 20 ? ind.label.substring(0, 20) + '...' : ind.label,
// //       valeur: ind.value,
// //       cible: ind.target
// //     }));
// //   };

// //   // Déterminer la classe CSS pour l'évolution
// //   const getEvolutionClass = (evolution: string) => {
// //     if (!evolution) return 'neutral';
// //     if (evolution.startsWith('+')) return 'positive';
// //     if (evolution.startsWith('-')) return 'negative';
// //     return 'neutral';
// //   };

// //   // Voir les détails d'un indicateur
// //   const viewIndicateurDetails = (indicateurId: string) => {
// //     const params = new URLSearchParams({
// //       categorie: activeCategorie,
// //       periode_type: activePeriode
// //     });

// //     if (selectedExerciceId) {
// //       params.append('exercice_id', selectedExerciceId.toString());
// //     }

// //     window.location.href = `/indicateurs/detail/${indicateurId}?${params.toString()}`;
// //   };

// //   return (
// //     <AppLayout
// //       title="Tableau de Bord des Indicateurs"
// //       user={auth.user}
// //       header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Tableau de Bord des Indicateurs</h2>}
// //     >
// //       <Head title="Analyse des Indicateurs" />

// //       <div className="py-6">
// //         <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
// //           <div className="bg-white rounded-lg shadow-md overflow-hidden">
// //             {/* En-tête */}
// //             <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white p-4 md:p-6">
// //               <div className="flex justify-between items-center">
// //                 <div>
// //                   <h1 className="text-xl md:text-2xl font-bold">Tableau de Bord des Indicateurs</h1>
// //                   <p className="text-sm md:text-base mt-1 opacity-80">Analyse des performances et export des données</p>
// //                 </div>
// //                 <div className="flex gap-2">
// //                   <button
// //                     onClick={() => fetchIndicateursData()}
// //                     className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-md text-sm transition-colors"
// //                   >
// //                     <Refresh size={16} />
// //                     <span className="hidden md:inline">Actualiser</span>
// //                   </button>
// //                 </div>
// //               </div>
// //             </div>

// //             {/* Filtres */}
// //             <div className="bg-gray-50 border-b border-gray-200 p-4">
// //               <div className="flex flex-wrap gap-4 items-center">
// //                 {/* Sélecteur d'exercice */}
// //                 <div className="w-full md:w-auto">
// //                   <label className="block text-sm font-medium text-gray-700 mb-1">
// //                     Exercice
// //                   </label>
// //                   <select
// //                     value={selectedExerciceId || ''}
// //                     onChange={(e) => setSelectedExerciceId(e.target.value ? parseInt(e.target.value) : null)}
// //                     className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
// //                   >
// //                     <option value="">Tous les exercices</option>
// //                     {exercices.map((exercice) => (
// //                       <option key={exercice.id} value={exercice.id}>
// //                         {exercice.annee} {exercice.actif && '(Actif)'}
// //                       </option>
// //                     ))}
// //                   </select>
// //                 </div>

// //                 {/* Sélecteur d'entreprise */}
// //                 <div className="w-full md:w-auto">
// //                   <label className="block text-sm font-medium text-gray-700 mb-1">
// //                     Entreprise
// //                   </label>
// //                   <select
// //                     value={selectedEntrepriseId || ''}
// //                     onChange={(e) => setSelectedEntrepriseId(e.target.value ? parseInt(e.target.value) : null)}
// //                     className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
// //                   >
// //                     <option value="">Toutes les entreprises</option>
// //                     {entreprises.map((entreprise) => (
// //                       <option key={entreprise.id} value={entreprise.id}>
// //                         {entreprise.nom_entreprise}
// //                       </option>
// //                     ))}
// //                   </select>
// //                 </div>

// //                 {/* Filtres appliqués */}
// //                 {(selectedExerciceId || selectedEntrepriseId) && (
// //                   <div className="flex items-center gap-2 ml-auto">
// //                     <button
// //                       onClick={() => {
// //                         setSelectedExerciceId(null);
// //                         setSelectedEntrepriseId(null);
// //                       }}
// //                       className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
// //                     >
// //                       <X size={14} />
// //                       <span>Réinitialiser les filtres</span>
// //                     </button>
// //                   </div>
// //                 )}
// //               </div>
// //             </div>

// //             {/* Onglets */}
// //             <div className="flex bg-gray-100 border-b border-gray-200">
// //               <button
// //                 className={`px-4 py-3 font-medium ${activeTab === 'analysis' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
// //                 onClick={() => setActiveTab('analysis')}
// //               >
// //                 Analyse & Visualisation
// //               </button>
// //               <button
// //                 className={`px-4 py-3 font-medium ${activeTab === 'calculations' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
// //                 onClick={() => setActiveTab('calculations')}
// //               >
// //                 Détail des Indicateurs
// //               </button>
// //             </div>

// //             {/* État de chargement */}
// //             {isLoading && (
// //               <div className="flex items-center justify-center h-64">
// //                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
// //               </div>
// //             )}

// //             {/* Affichage des erreurs */}
// //             {error && !isLoading && (
// //               <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mx-4 my-4">
// //                 <p className="font-medium">Erreur</p>
// //                 <p>{error}</p>
// //                 <button
// //                   onClick={fetchIndicateursData}
// //                   className="mt-2 bg-red-200 hover:bg-red-300 text-red-800 px-3 py-1 rounded text-sm"
// //                 >
// //                   Réessayer
// //                 </button>
// //               </div>
// //             )}

// //             {/* Contenu de l'onglet d'analyse */}
// //             {activeTab === 'analysis' && !isLoading && !error && (
// //               <div className="p-4 md:p-6">
// //                 {/* Sélecteur de période */}
// //                 <div className="mb-6">
// //                   <h3 className="font-medium mb-2 text-gray-700">Période:</h3>
// //                   <div className="flex flex-wrap gap-2">
// //                     {periodes.map(periode => (
// //                       <button
// //                         key={periode}
// //                         className={`px-3 py-2 rounded-md text-sm ${
// //                           activePeriode === periode
// //                             ? 'bg-blue-600 text-white'
// //                             : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
// //                         }`}
// //                         onClick={() => {
// //                           setActivePeriode(periode);
// //                           // Réinitialiser la catégorie active si la période change
// //                           const newCategories = Object.keys(indicateursData);
// //                           if (newCategories.length > 0) {
// //                             setActiveCategorie(newCategories[0]);
// //                           }
// //                         }}
// //                       >
// //                         {periode}
// //                       </button>
// //                     ))}
// //                   </div>
// //                 </div>

// //                 {/* Sélecteur de catégorie */}
// //                 {categoriesDisponibles.length > 0 ? (
// //                   <div className="mb-6">
// //                     <h3 className="font-medium mb-2 text-gray-700">Catégorie:</h3>
// //                     <div className="flex flex-wrap gap-2">
// //                       {categoriesDisponibles.map(categorie => (
// //                         <button
// //                           key={categorie}
// //                           className={`px-3 py-2 rounded-md text-sm ${
// //                             activeCategorie === categorie
// //                               ? 'bg-blue-600 text-white'
// //                               : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
// //                           }`}
// //                           onClick={() => setActiveCategorie(categorie)}
// //                         >
// //                           {categorie.length > 30 ? categorie.substring(0, 30) + '...' : categorie}
// //                         </button>
// //                       ))}
// //                     </div>
// //                   </div>
// //                 ) : (
// //                   <div className="p-6 text-center text-gray-500">
// //                     <p>Aucune donnée disponible pour cette période</p>
// //                   </div>
// //                 )}

// //                 {/* Contenu principal */}
// //                 {activeCategorie && indicateursActifs.length > 0 && (
// //                   <div>
// //                     {/* Titre de section et bouton d'export */}
// //                     <div className="flex justify-between items-center mb-4">
// //                       <h2 className="text-lg font-semibold text-gray-800 border-l-4 border-blue-500 pl-3">
// //                         {activeCategorie}
// //                       </h2>
// //                       <button
// //                         className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-md text-sm hover:bg-green-700 transition-colors"
// //                         onClick={() => exportToExcel(activeCategorie)}
// //                       >
// //                         <Download size={16} />
// //                         <span>Exporter Excel</span>
// //                       </button>
// //                     </div>

// //                     {/* Cartes d'indicateurs */}
// //                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
// //                       {indicateursActifs.map(indicateur => (
// //                         <div key={indicateur.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
// //                           {/* En-tête de la carte */}
// //                           <div className="flex justify-between items-center mb-3">
// //                             <h3 className="font-medium text-gray-700" title={indicateur.label}>
// //                               {indicateur.label.length > 25 ? indicateur.label.substring(0, 25) + '...' : indicateur.label}
// //                             </h3>
// //                             <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
// //                               getEvolutionClass(indicateur.evolution) === 'positive' ? 'bg-green-100 text-green-800' :
// //                               getEvolutionClass(indicateur.evolution) === 'negative' ? 'bg-red-100 text-red-800' :
// //                               'bg-blue-100 text-blue-800'
// //                             }`}>
// //                               {indicateur.evolution}
// //                             </span>
// //                           </div>

// //                           {/* Valeur de l'indicateur */}
// //                           <div className="mb-2">
// //                             <span className="text-lg font-bold text-gray-800">{formatNumber(indicateur.value)}</span>
// //                             {indicateur.unite && (
// //                               <span className="ml-1 text-sm text-gray-500">{indicateur.unite}</span>
// //                             )}
// //                           </div>

// //                           {/* Cible */}
// //                           <div className="text-sm text-gray-600 mb-3">
// //                             Cible: {formatNumber(indicateur.target)} {indicateur.unite}
// //                           </div>

// //                           {/* Mini graphique */}
// //                           <div className="h-16 mb-3">
// //                             <ResponsiveContainer width="100%" height="100%">
// //                               <LineChart data={generateChartData(indicateur)}>
// //                                 <Line
// //                                   type="monotone"
// //                                   dataKey="value"
// //                                   stroke={COLORS.primary}
// //                                   strokeWidth={2}
// //                                   dot={false}
// //                                   isAnimationActive={false}
// //                                 />
// //                               </LineChart>
// //                             </ResponsiveContainer>
// //                           </div>

// //                           {/* Actions */}
// //                           <div className="mt-2 flex justify-between items-center">
// //                             {/* Définition/info */}
// //                             <div className="text-xs text-gray-500 flex items-center group relative">
// //                               <Info size={14} className="mr-1" />
// //                               <span className="truncate max-w-[180px]">{indicateur.definition.substring(0, 60)}</span>
// //                               <div className="hidden group-hover:block absolute z-10 bottom-full left-0 w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg">
// //                                 {indicateur.definition}
// //                               </div>
// //                             </div>

// //                             {/* Bouton voir détails */}
// //                             <button
// //                               onClick={() => viewIndicateurDetails(indicateur.id)}
// //                               className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
// //                             >
// //                               <Eye size={14} className="mr-1" />
// //                               <span>Détails</span>
// //                             </button>
// //                           </div>

// //                           {/* Badge calculé */}
// //                           {indicateur.is_calculated && (
// //                             <div className="absolute top-2 right-2">
// //                               <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
// //                                 Calculé
// //                               </span>
// //                             </div>
// //                           )}
// //                         </div>
// //                       ))}
// //                     </div>

// //                     {/* Graphique de synthèse */}
// //                     {indicateursActifs.length > 1 && (
// //                       <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-6">
// //                         <h3 className="font-medium text-gray-700 mb-4">Synthèse des indicateurs</h3>
// //                         <div className="h-80">
// //                           <ResponsiveContainer width="100%" height="100%">
// //                             <BarChart data={generateSummaryChartData()} layout="vertical">
// //                               <CartesianGrid strokeDasharray="3 3" />
// //                               <XAxis type="number" />
// //                               <YAxis dataKey="name" type="category" width={150} />
// //                               <Tooltip
// //                                 formatter={(value) => formatNumber(value as number)}
// //                                 labelFormatter={(label) => `Indicateur: ${label}`}
// //                               />
// //                               <Legend />
// //                               <Bar dataKey="valeur" name="Valeur" fill={COLORS.primary} barSize={20} />
// //                               <Bar dataKey="cible" name="Cible" fill={COLORS.secondary} barSize={20} />
// //                             </BarChart>
// //                           </ResponsiveContainer>
// //                         </div>
// //                       </div>
// //                     )}
// //                   </div>
// //                 )}
// //               </div>
// //             )}

// //             {/* Contenu de l'onglet détail */}
// //             {activeTab === 'calculations' && !isLoading && !error && (
// //               <div className="p-4 md:p-6">
// //                 <div className="flex justify-between items-center mb-6">
// //                   <h2 className="text-lg font-semibold text-gray-800">Détail des Indicateurs</h2>
// //                   <div className="text-sm text-gray-600">
// //                     Dernière mise à jour: <span>{lastUpdate.toLocaleString()}</span>
// //                   </div>
// //                 </div>

// //                 {/* Sélecteur de période */}
// //                 <div className="mb-6">
// //                   <h3 className="font-medium mb-2 text-gray-700">Période:</h3>
// //                   <div className="flex flex-wrap gap-2">
// //                     {periodes.map(periode => (
// //                       <button
// //                         key={periode}
// //                         className={`px-3 py-2 rounded-md text-sm ${
// //                           activePeriode === periode
// //                             ? 'bg-blue-600 text-white'
// //                             : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
// //                         }`}
// //                         onClick={() => setActivePeriode(periode)}
// //                       >
// //                         {periode}
// //                       </button>
// //                     ))}
// //                   </div>
// //                 </div>

// //                 {/* Contrôles d'affichage */}
// //                 <div className="mb-6 flex flex-wrap gap-4 items-center">
// //                   <div className="flex items-center gap-2">
// //                     <span className="text-sm font-medium text-gray-700">Colonnes:</span>
// //                     <label className="flex items-center gap-1">
// //                       <input
// //                         type="checkbox"
// //                         checked={visibleColumns.valeur}
// //                         onChange={() => setVisibleColumns({...visibleColumns, valeur: !visibleColumns.valeur})}
// //                         className="rounded text-blue-600 focus:ring-blue-500"
// //                       />
// //                       <span className="text-sm text-gray-600">Valeur</span>
// //                     </label>
// //                     <label className="flex items-center gap-1">
// //                       <input
// //                         type="checkbox"
// //                         checked={visibleColumns.cible}
// //                         onChange={() => setVisibleColumns({...visibleColumns, cible: !visibleColumns.cible})}
// //                         className="rounded text-blue-600 focus:ring-blue-500"
// //                       />
// //                       <span className="text-sm text-gray-600">Cible</span>
// //                     </label>
// //                     <label className="flex items-center gap-1">
// //                       <input
// //                         type="checkbox"
// //                         checked={visibleColumns.evolution}
// //                         onChange={() => setVisibleColumns({...visibleColumns, evolution: !visibleColumns.evolution})}
// //                         className="rounded text-blue-600 focus:ring-blue-500"
// //                       />
// //                       <span className="text-sm text-gray-600">Évolution</span>
// //                     </label>
// //                     <label className="flex items-center gap-1">
// //                       <input
// //                         type="checkbox"
// //                         checked={visibleColumns.definition}
// //                         onChange={() => setVisibleColumns({...visibleColumns, definition: !visibleColumns.definition})}
// //                         className="rounded text-blue-600 focus:ring-blue-500"
// //                       />
// //                       <span className="text-sm text-gray-600">Définition</span>
// //                     </label>
// //                   </div>

// //                   <button
// //                     className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-md text-sm hover:bg-green-700 transition-colors ml-auto"
// //                     onClick={exportAllToExcel}
// //                   >
// //                     <Download size={16} />
// //                     <span>Exporter tout en Excel</span>
// //                   </button>
// //                 </div>

// //                 {/* Tableau détaillé des indicateurs */}
// //                 {categoriesDisponibles.length > 0 ? (
// //                   <div className="space-y-6">
// //                     {categoriesDisponibles.map(categorie => (
// //                       <div key={categorie} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
// //                         <div
// //                           className="flex justify-between items-center px-4 py-3 bg-gray-50 cursor-pointer"
// //                           onClick={() => toggleCategoryExpand(categorie)}
// //                         >
// //                           <h3 className="font-medium text-gray-800 flex items-center gap-2">
// //                             {expandedCategories[categorie] === false ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
// //                             {categorie}
// //                           </h3>
// //                           <button
// //                             className="flex items-center gap-2 text-sm text-green-700 hover:text-green-800"
// //                             onClick={(e) => {
// //                               e.stopPropagation();
// //                               exportToExcel(categorie);
// //                             }}
// //                           >
// //                             <FileSpreadsheet size={16} />
// //                             <span>Exporter</span>
// //                           </button>
// //                         </div>

// //                         {expandedCategories[categorie] !== false && (
// //                           <div className="overflow-x-auto">
// //                             <table className="min-w-full divide-y divide-gray-200">
// //                               <thead className="bg-gray-50">
// //                                 <tr>
// //                                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                                     Indicateur
// //                                   </th>
// //                                   {visibleColumns.valeur && (
// //                                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                                       Valeur
// //                                     </th>
// //                                   )}
// //                                   {visibleColumns.cible && (
// //                                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                                       Cible
// //                                     </th>
// //                                   )}
// //                                   {visibleColumns.evolution && (
// //                                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                                       Évolution
// //                                     </th>
// //                                   )}
// //                                   {visibleColumns.definition && (
// //                                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                                       Définition
// //                                     </th>
// //                                   )}
// //                                   <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                                     Actions
// //                                   </th>
// //                                 </tr>
// //                               </thead>
// //                               <tbody className="bg-white divide-y divide-gray-200">
// //                                 {indicateursData[categorie].map((indicateur) => (
// //                                   <tr key={indicateur.id} className="hover:bg-gray-50">
// //                                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
// //                                       {indicateur.label}
// //                                       {indicateur.is_calculated && (
// //                                         <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
// //                                           Calculé
// //                                         </span>
// //                                       )}
// //                                     </td>
// //                                     {visibleColumns.valeur && (
// //                                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
// //                                         <span className="font-medium">{formatNumber(indicateur.value)}</span>
// //                                         {indicateur.unite && (
// //                                           <span className="ml-1 text-gray-500">{indicateur.unite}</span>
// //                                         )}
// //                                       </td>
// //                                     )}
// //                                     {visibleColumns.cible && (
// //                                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
// //                                         <span className="font-medium">{formatNumber(indicateur.target)}</span>
// //                                         {indicateur.unite && (
// //                                           <span className="ml-1 text-gray-500">{indicateur.unite}</span>
// //                                         )}
// //                                       </td>
// //                                     )}
// //                                     {visibleColumns.evolution && (
// //                                       <td className="px-6 py-4 whitespace-nowrap">
// //                                         <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
// //                                           ${getEvolutionClass(indicateur.evolution) === 'positive' ? 'bg-green-100 text-green-800' :
// //                                           getEvolutionClass(indicateur.evolution) === 'negative' ? 'bg-red-100 text-red-800' :
// //                                           'bg-blue-100 text-blue-800'}`}
// //                                         >
// //                                           {indicateur.evolution}
// //                                         </span>
// //                                       </td>
// //                                     )}
// //                                     {visibleColumns.definition && (
// //                                       <td className="px-6 py-4 text-sm text-gray-500 max-w-md">
// //                                         <div className="group relative">
// //                                           <div className="flex items-center gap-1 cursor-help">
// //                                             <Info size={14} />
// //                                             <span className="underline decoration-dotted truncate max-w-[250px]">
// //                                               {indicateur.definition.length > 50
// //                                                 ? indicateur.definition.substring(0, 50) + '...'
// //                                                 : indicateur.definition}
// //                                             </span>
// //                                           </div>
// //                                           <div className="hidden group-hover:block absolute z-10 w-72 p-2 bg-gray-800 text-white text-xs rounded shadow-lg">
// //                                             {indicateur.definition}
// //                                           </div>
// //                                         </div>
// //                                       </td>
// //                                     )}
// //                                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
// //                                       <button
// //                                         onClick={() => viewIndicateurDetails(indicateur.id)}
// //                                         className="text-blue-600 hover:text-blue-800"
// //                                       >
// //                                         <Eye size={16} />
// //                                       </button>
// //                                     </td>
// //                                   </tr>
// //                                 ))}
// //                               </tbody>
// //                             </table>
// //                           </div>
// //                         )}
// //                       </div>
// //                     ))}
// //                   </div>
// //                 ) : (
// //                   <div className="p-6 text-center text-gray-500">
// //                     <p>Aucune donnée disponible pour cette période</p>
// //                   </div>
// //                 )}
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     </AppLayout>
// //   );
// // };

// // export default Analyse;
// // resources/js/Pages/Indicateurs/Analyse.tsx
// import React, { useState, useEffect, useMemo } from 'react';
// import { Head } from '@inertiajs/react';
// import {
//   LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
//   Tooltip, Legend, ResponsiveContainer
// } from 'recharts';
// import axios from 'axios';

// // Composants d'interface utilisateur
// import { PageProps } from '@/types';

// // Icônes pour l'interface (utilise Lucide React)
// import {
//   Download, FileSpreadsheet, ChevronDown,
//   ChevronUp, Info, Eye, X, RefreshCw as Refresh,
//   AlertCircle
// } from 'lucide-react';
// import AppLayout from '@/layouts/app-layout';

// // Types pour les données d'indicateurs
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
//     collecte_ids: number[];
//     periodes: string[];
//     nombre_points_donnees: number;
//     demo?: boolean; // Indique si ce sont des données de démo
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

// // Props pour le composant
// interface AnalyseProps extends PageProps {
//   exercices: Exercice[];
//   entreprises: Entreprise[];
//   defaultExerciceId: number | null;
//   defaultPeriodeType: string;
//   periodes: string[];
// }

// // Constantes pour les couleurs
// const COLORS = {
//   primary: '#3498db',
//   secondary: '#2ecc71',
//   tertiary: '#e74c3c',
//   dark: '#2c3e50',
//   light: '#ecf0f1',
//   warning: '#f39c12',
//   success: '#27ae60'
// };

// const Analyse: React.FC<AnalyseProps> = ({
//   auth,
//   exercices,
//   entreprises,
//   defaultExerciceId,
//   defaultPeriodeType,
//   periodes
// }) => {
//   // États
//     const [activeTab, setActiveTab] = useState<'analysis' | 'calculations'>('analysis');
//   const [activePeriode, setActivePeriode] = useState<string>(defaultPeriodeType);
//   const [activeCategorie, setActiveCategorie] = useState<string>('');
//   const [selectedExerciceId, setSelectedExerciceId] = useState<number | null>(defaultExerciceId);
//   const [selectedEntrepriseId, setSelectedEntrepriseId] = useState<number | null>(null);
//   const [indicateursData, setIndicateursData] = useState<IndicateursParCategorie>({});
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
//   const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
//   const [visibleColumns, setVisibleColumns] = useState({
//     valeur: true,
//     cible: true,
//     evolution: true,
//     definition: true
//   });
//   const [isDemoData, setIsDemoData] = useState<boolean>(false);

//   // Fonction pour formater les nombres avec séparateurs de milliers
//   const formatNumber = (num: number): string => {
//     if (typeof num !== 'number') return String(num);
//     return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
//   };

//   // Effet pour charger les données des indicateurs
//   useEffect(() => {
//     fetchIndicateursData();
//   }, [activePeriode, selectedExerciceId, selectedEntrepriseId]);

//   // Fonction complète fetchIndicateursData
// //   const fetchIndicateursData = async () => {
// //     try {
// //       setIsLoading(true);
// //       setError(null);
// //       setIsDemoData(false);

// //       // S'assurer que activePeriode a toujours une valeur
// //       const periodeToUse = activePeriode || 'Trimestrielle';

// //       console.log('Envoi des paramètres:', {
// //         periode_type: periodeToUse,
// //         exercice_id: selectedExerciceId,
// //         entreprise_id: selectedEntrepriseId
// //       });

// //       // Assurez-vous que l'URL commence par /api/
// //       const response = await axios.get('/api/indicateurs/analyse', {
// //         params: {
// //           periode_type: periodeToUse,
// //           exercice_id: selectedExerciceId,
// //           entreprise_id: selectedEntrepriseId
// //         },
// //         headers: {
// //           // Indique explicitement que nous attendons une réponse JSON
// //           'Accept': 'application/json',
// //           'X-Requested-With': 'XMLHttpRequest'
// //         }
// //       });

// //       if (response.data.success) {
// //         // Vérifier si ce sont des données de démo
// //         if (response.data.demo_data) {
// //           setIsDemoData(true);
// //         }

// //         setIndicateursData(response.data.data);
// //         setLastUpdate(new Date());

// //         // Si aucune catégorie n'est sélectionnée, sélectionner la première
// //         const categories = Object.keys(response.data.data);
// //         if (categories.length > 0 && (!activeCategorie || !categories.includes(activeCategorie))) {
// //           setActiveCategorie(categories[0]);
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

// const fetchIndicateursData = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       setIsDemoData(false);

//       // S'assurer que activePeriode a toujours une valeur
//       const periodeToUse = activePeriode || 'Trimestrielle';

//       console.log('Envoi des paramètres:', {
//         periode_type: periodeToUse,
//         exercice_id: selectedExerciceId,
//         entreprise_id: selectedEntrepriseId
//       });

//       // Assurez-vous que l'URL commence par /api/
//       const response = await axios.get('/api/indicateurs/analyse', {
//         params: {
//           periode_type: periodeToUse,
//           exercice_id: selectedExerciceId,
//           entreprise_id: selectedEntrepriseId
//         },
//         headers: {
//           // Indique explicitement que nous attendons une réponse JSON
//           'Accept': 'application/json',
//           'X-Requested-With': 'XMLHttpRequest'
//         }
//       });

//       if (response.data.success) {
//         // Vérifier si des données ont été retournées
//         if (response.data.no_data) {
//           // Cas où le backend indique explicitement qu'il n'y a pas de données
//           setIndicateursData({});
//         } else {
//           // Mettre à jour les données
//           setIndicateursData(response.data.data);

//           // Vérifier si ce sont des données de démo
//           setIsDemoData(response.data.demo_data || false);
//         }

//         setLastUpdate(new Date());

//         // Si aucune catégorie n'est sélectionnée, sélectionner la première
//         const categories = Object.keys(response.data.data || {});
//         if (categories.length > 0 && (!activeCategorie || !categories.includes(activeCategorie))) {
//           setActiveCategorie(categories[0]);
//         } else if (categories.length === 0) {
//           // Réinitialiser la catégorie active si aucune catégorie n'est disponible
//           setActiveCategorie('');
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

//   // Récupérer les catégories disponibles pour la période active
//   const categoriesDisponibles = useMemo(() => {
//     return Object.keys(indicateursData);
//   }, [indicateursData]);

//   // Récupérer les indicateurs pour la catégorie active
//   const indicateursActifs = useMemo(() => {
//     if (!activeCategorie || !indicateursData[activeCategorie]) return [];
//     return indicateursData[activeCategorie];
//   }, [indicateursData, activeCategorie]);

//   // Méthode pour exporter les données au format Excel
//   const exportToExcel = (categorie: string) => {
//     const params = new URLSearchParams({
//       periode_type: activePeriode,
//       categorie: categorie
//     });

//     if (selectedExerciceId) {
//       params.append('exercice_id', selectedExerciceId.toString());
//     }

//     if (selectedEntrepriseId) {
//       params.append('entreprise_id', selectedEntrepriseId.toString());
//     }

//     window.location.href = `/api/indicateurs/export-excel?${params.toString()}`;
//   };

//   // Méthode pour exporter toutes les données
//   const exportAllToExcel = () => {
//     const params = new URLSearchParams({
//       periode_type: activePeriode
//     });

//     if (selectedExerciceId) {
//       params.append('exercice_id', selectedExerciceId.toString());
//     }

//     if (selectedEntrepriseId) {
//       params.append('entreprise_id', selectedEntrepriseId.toString());
//     }

//     window.location.href = `/api/indicateurs/export-excel?${params.toString()}`;
//   };

//   // Gérer l'expansion/réduction des catégories dans la vue détaillée
//   const toggleCategoryExpand = (categorie: string) => {
//     setExpandedCategories(prev => ({
//       ...prev,
//       [categorie]: !prev[categorie]
//     }));
//   };

//   // Générer des données simulées pour les graphiques
//   const generateChartData = (indicateur: Indicateur) => {
//     // Dans une application réelle, ces données viendraient d'une API
//     const baseValue = indicateur.value * 0.7;

//     return [
//       { name: 'P1', value: Math.round(baseValue) },
//       { name: 'P2', value: Math.round(baseValue * 1.2) },
//       { name: 'P3', value: Math.round(baseValue * 1.3) },
//       { name: 'P4', value: indicateur.value }
//     ];
//   };

//   // Générer des données pour le graphique de synthèse
//   const generateSummaryChartData = () => {
//     if (!indicateursActifs.length) return [];

//     // Limiter à 8 indicateurs pour la lisibilité
//     const limitedIndicateurs = indicateursActifs.slice(0, 8);

//     // Formater pour le graphique de comparaison
//     return limitedIndicateurs.map(ind => ({
//       name: ind.label.length > 20 ? ind.label.substring(0, 20) + '...' : ind.label,
//       valeur: ind.value,
//       cible: ind.target
//     }));
//   };

//   // Déterminer la classe CSS pour l'évolution
//   const getEvolutionClass = (evolution: string) => {
//     if (!evolution) return 'neutral';
//     if (evolution.startsWith('+')) return 'positive';
//     if (evolution.startsWith('-')) return 'negative';
//     return 'neutral';
//   };

//   // Voir les détails d'un indicateur
//   const viewIndicateurDetails = (indicateurId: string) => {
//     const params = new URLSearchParams({
//       categorie: activeCategorie,
//       periode_type: activePeriode
//     });

//     if (selectedExerciceId) {
//       params.append('exercice_id', selectedExerciceId.toString());
//     }

//     window.location.href = `/indicateurs/detail/${indicateurId}?${params.toString()}`;
//   };

//   return (
//     <AppLayout
//       title="Tableau de Bord des Indicateurs"
//       user={auth.user}
//       header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Tableau de Bord des Indicateurs</h2>}
//     >
//       <Head title="Analyse des Indicateurs" />

//       <div className="py-6">
//         <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
//           <div className="bg-white rounded-lg shadow-md overflow-hidden">
//             {/* En-tête */}
//             <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white p-4 md:p-6">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <h1 className="text-xl md:text-2xl font-bold">Tableau de Bord des Indicateurs</h1>
//                   <p className="text-sm md:text-base mt-1 opacity-80">Analyse des performances et export des données</p>
//                 </div>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => fetchIndicateursData()}
//                     className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-md text-sm transition-colors"
//                   >
//                     <Refresh size={16} />
//                     <span className="hidden md:inline">Actualiser</span>
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Alerte pour les données de démo */}
//             {isDemoData && (
//               <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
//                 <div className="flex">
//                   <div className="flex-shrink-0">
//                     <AlertCircle className="h-5 w-5 text-yellow-400" />
//                   </div>
//                   <div className="ml-3">
//                     <p className="text-sm text-yellow-700">
//                       <span className="font-medium">Attention:</span> Aucune donnée réelle n'a été trouvée pour les critères sélectionnés. Des données de démonstration sont affichées à titre d'exemple.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}

// // Déplacer cette définition avant le composant Analyse
// const NoDataMessage: React.FC = () => {
//   return (
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
//               <li>L'entreprise sélectionnée a des données associées</li>
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
// };

//             {/* Filtres */}
//             <div className="bg-gray-50 border-b border-gray-200 p-4">
//               <div className="flex flex-wrap gap-4 items-center">
//                 {/* Sélecteur d'exercice */}
//                 <div className="w-full md:w-auto">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Exercice
//                   </label>
//                   <select
//                     value={selectedExerciceId || ''}
//                     onChange={(e) => setSelectedExerciceId(e.target.value ? parseInt(e.target.value) : null)}
//                     className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
//                   >
//                     <option value="">Tous les exercices</option>
//                     {exercices.map((exercice) => (
//                       <option key={exercice.id} value={exercice.id}>
//                         {exercice.annee} {exercice.actif && '(Actif)'}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Sélecteur d'entreprise */}
//                 <div className="w-full md:w-auto">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Entreprise
//                   </label>
//                   <select
//                     value={selectedEntrepriseId || ''}
//                     onChange={(e) => setSelectedEntrepriseId(e.target.value ? parseInt(e.target.value) : null)}
//                     className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
//                   >
//                     <option value="">Toutes les entreprises</option>
//                     {entreprises.map((entreprise) => (
//                       <option key={entreprise.id} value={entreprise.id}>
//                         {entreprise.nom_entreprise}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Filtres appliqués */}
//                 {(selectedExerciceId || selectedEntrepriseId) && (
//                   <div className="flex items-center gap-2 ml-auto">
//                     <button
//                       onClick={() => {
//                         setSelectedExerciceId(null);
//                         setSelectedEntrepriseId(null);
//                       }}
//                       className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
//                     >
//                       <X size={14} />
//                       <span>Réinitialiser les filtres</span>
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Onglets */}
//             <div className="flex bg-gray-100 border-b border-gray-200">
//               <button
//                 className={`px-4 py-3 font-medium ${activeTab === 'analysis' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
//                 onClick={() => setActiveTab('analysis')}
//               >
//                 Analyse & Visualisation
//               </button>
//               <button
//                 className={`px-4 py-3 font-medium ${activeTab === 'calculations' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
//                 onClick={() => setActiveTab('calculations')}
//               >
//                 Détail des Indicateurs
//               </button>
//             </div>

//             {/* État de chargement */}
//             {isLoading && (
//               <div className="flex items-center justify-center h-64">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//               </div>
//             )}

//             {/* Affichage des erreurs */}
//             {error && !isLoading && (
//               <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mx-4 my-4">
//                 <p className="font-medium">Erreur</p>
//                 <p>{error}</p>
//                 <button
//                   onClick={fetchIndicateursData}
//                   className="mt-2 bg-red-200 hover:bg-red-300 text-red-800 px-3 py-1 rounded text-sm"
//                 >
//                   Réessayer
//                 </button>
//               </div>
//             )}

//             {/* Contenu de l'onglet d'analyse */}
//             {activeTab === 'analysis' && !isLoading && !error && (
//               <div className="p-4 md:p-6">
//                 {/* Sélecteur de période */}
//                 <div className="mb-6">
//                   <h3 className="font-medium mb-2 text-gray-700">Période:</h3>
//                   <div className="flex flex-wrap gap-2">
//                     {periodes.map(periode => (
//                       <button
//                         key={periode}
//                         className={`px-3 py-2 rounded-md text-sm ${
//                           activePeriode === periode
//                             ? 'bg-blue-600 text-white'
//                             : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                         }`}
//                         onClick={() => {
//                           setActivePeriode(periode);
//                           // Réinitialiser la catégorie active si la période change
//                           const newCategories = Object.keys(indicateursData);
//                           if (newCategories.length > 0) {
//                             setActiveCategorie(newCategories[0]);
//                           }
//                         }}
//                       >
//                         {periode}
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Sélecteur de catégorie */}
//                 {categoriesDisponibles.length > 0 ? (
//   <div className="mb-6">
//     <h3 className="font-medium mb-2 text-gray-700">Catégorie:</h3>
//     <div className="flex flex-wrap gap-2">
//       {categoriesDisponibles.map(categorie => (
//         <button
//           key={categorie}
//           className={`px-3 py-2 rounded-md text-sm ${
//             activeCategorie === categorie
//               ? 'bg-blue-600 text-white'
//               : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//           }`}
//           onClick={() => setActiveCategorie(categorie)}
//         >
//           {categorie.length > 30 ? categorie.substring(0, 30) + '...' : categorie}
//         </button>
//       ))}
//     </div>
//   </div>
// ) : (
//   <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
//     <div className="flex">
//       <div className="flex-shrink-0">
//         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
//           <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//         </svg>
//       </div>
//       <div className="ml-3">
//         <p className="text-sm text-yellow-700">
//           <span className="font-medium">Aucune donnée disponible!</span> Aucune donnée n'a été trouvée pour cette combinaison de filtres. Veuillez essayer d'autres critères de recherche ou vérifier que des données ont bien été collectées pour cette période.
//         </p>
//       </div>
//     </div>
//   </div>
// )}

//                 {/* Contenu principal */}
//                 {activeCategorie && indicateursActifs.length > 0 ? (
//   <div>
//     {/* Titre de section et bouton d'export */}
//     <div className="flex justify-between items-center mb-4">
//       <h2 className="text-lg font-semibold text-gray-800 border-l-4 border-blue-500 pl-3">
//         {activeCategorie}
//       </h2>
//       <button
//         className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-md text-sm hover:bg-green-700 transition-colors"
//         onClick={() => exportToExcel(activeCategorie)}
//       >
//         <Download size={16} />
//         <span>Exporter Excel</span>
//       </button>
//     </div>

//     {/* Cartes d'indicateurs */}
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
//       {indicateursActifs.map(indicateur => (
//         <div key={indicateur.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
//           {/* Contenu des cartes... (inchangé) */}
//         </div>
//       ))}
//     </div>

//     {/* Graphique de synthèse (inchangé) */}
//   </div>
// ) : (
//   <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 text-center">
//     <p className="text-yellow-800">
//       <strong>Aucune donnée disponible</strong>
//     </p>
//     <p className="text-yellow-700 mt-2">
//       Aucune donnée n'a été trouvée pour les critères sélectionnés. Veuillez vérifier que des données ont bien été collectées pour cette période et cette entreprise.
//     </p>
//   </div>
// )}
//             {/* Contenu de l'onglet détail */}
//             {activeTab === 'calculations' && !isLoading && !error && (
//               <div className="p-4 md:p-6">
//                 <div className="flex justify-between items-center mb-6">
//                   <h2 className="text-lg font-semibold text-gray-800">Détail des Indicateurs</h2>
//                   <div className="text-sm text-gray-600">
//                     Dernière mise à jour: <span>{lastUpdate.toLocaleString()}</span>
//                   </div>
//                 </div>

//                 {/* Sélecteur de période */}
//                 <div className="mb-6">
//                   <h3 className="font-medium mb-2 text-gray-700">Période:</h3>
//                   <div className="flex flex-wrap gap-2">
//                     {periodes.map(periode => (
//                       <button
//                         key={periode}
//                         className={`px-3 py-2 rounded-md text-sm ${
//                           activePeriode === periode
//                             ? 'bg-blue-600 text-white'
//                             : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                         }`}
//                         onClick={() => setActivePeriode(periode)}
//                       >
//                         {periode}
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Contrôles d'affichage */}
//                 <div className="mb-6 flex flex-wrap gap-4 items-center">
//                   <div className="flex items-center gap-2">
//                     <span className="text-sm font-medium text-gray-700">Colonnes:</span>
//                     <label className="flex items-center gap-1">
//                       <input
//                         type="checkbox"
//                         checked={visibleColumns.valeur}
//                         onChange={() => setVisibleColumns({...visibleColumns, valeur: !visibleColumns.valeur})}
//                         className="rounded text-blue-600 focus:ring-blue-500"
//                       />
//                       <span className="text-sm text-gray-600">Valeur</span>
//                     </label>
//                     <label className="flex items-center gap-1">
//                       <input
//                         type="checkbox"
//                         checked={visibleColumns.cible}
//                         onChange={() => setVisibleColumns({...visibleColumns, cible: !visibleColumns.cible})}
//                         className="rounded text-blue-600 focus:ring-blue-500"
//                       />
//                       <span className="text-sm text-gray-600">Cible</span>
//                     </label>
//                     <label className="flex items-center gap-1">
//                       <input
//                         type="checkbox"
//                         checked={visibleColumns.evolution}
//                         onChange={() => setVisibleColumns({...visibleColumns, evolution: !visibleColumns.evolution})}
//                         className="rounded text-blue-600 focus:ring-blue-500"
//                       />
//                       <span className="text-sm text-gray-600">Évolution</span>
//                     </label>
//                     <label className="flex items-center gap-1">
//                       <input
//                         type="checkbox"
//                         checked={visibleColumns.definition}
//                         onChange={() => setVisibleColumns({...visibleColumns, definition: !visibleColumns.definition})}
//                         className="rounded text-blue-600 focus:ring-blue-500"
//                       />
//                       <span className="text-sm text-gray-600">Définition</span>
//                     </label>
//                   </div>

//                   <button
//                     className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-md text-sm hover:bg-green-700 transition-colors ml-auto"
//                     onClick={exportAllToExcel}
//                   >
//                     <Download size={16} />
//                     <span>Exporter tout en Excel</span>
//                   </button>
//                 </div>

//                 {/* Tableau détaillé des indicateurs */}
//                 {categoriesDisponibles.length > 0 ? (
//                   <div className="space-y-6">
//                     {categoriesDisponibles.map(categorie => (
//                       <div key={categorie} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//                         <div
//                           className="flex justify-between items-center px-4 py-3 bg-gray-50 cursor-pointer"
//                           onClick={() => toggleCategoryExpand(categorie)}
//                         >
//                           <h3 className="font-medium text-gray-800 flex items-center gap-2">
//                             {expandedCategories[categorie] === false ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
//                             {categorie}
//                           </h3>
//                           <button
//                             className="flex items-center gap-2 text-sm text-green-700 hover:text-green-800"
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               exportToExcel(categorie);
//                             }}
//                           >
//                             <FileSpreadsheet size={16} />
//                             <span>Exporter</span>
//                           </button>
//                         </div>

//                         {expandedCategories[categorie] !== false && (
//                           <div className="overflow-x-auto">
//                             <table className="min-w-full divide-y divide-gray-200">
//                               <thead className="bg-gray-50">
//                                 <tr>
//                                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                     Indicateur
//                                   </th>
//                                   {visibleColumns.valeur && (
//                                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                       Valeur
//                                     </th>
//                                   )}
//                                   {visibleColumns.cible && (
//                                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                       Cible
//                                     </th>
//                                   )}
//                                   {visibleColumns.evolution && (
//                                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                       Évolution
//                                     </th>
//                                   )}
//                                   {visibleColumns.definition && (
//                                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                       Définition
//                                     </th>
//                                   )}
//                                   <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                     Actions
//                                   </th>
//                                 </tr>
//                               </thead>
//                               <tbody className="bg-white divide-y divide-gray-200">
//                                 {indicateursData[categorie].map((indicateur) => (
//                                   <tr key={indicateur.id} className="hover:bg-gray-50">
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                                       {indicateur.label}
//                                       {indicateur.is_calculated && (
//                                         <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                                           Calculé
//                                         </span>
//                                       )}
//                                       {indicateur.metadata?.demo && (
//                                         <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
//                                           Démo
//                                         </span>
//                                       )}
//                                     </td>
//                                     {visibleColumns.valeur && (
//                                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                         <span className="font-medium">{formatNumber(indicateur.value)}</span>
//                                         {indicateur.unite && (
//                                           <span className="ml-1 text-gray-500">{indicateur.unite}</span>
//                                         )}
//                                       </td>
//                                     )}
//                                     {visibleColumns.cible && (
//                                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                         <span className="font-medium">{formatNumber(indicateur.target)}</span>
//                                         {indicateur.unite && (
//                                           <span className="ml-1 text-gray-500">{indicateur.unite}</span>
//                                         )}
//                                       </td>
//                                     )}
//                                     {visibleColumns.evolution && (
//                                       <td className="px-6 py-4 whitespace-nowrap">
//                                         <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
//                                           ${getEvolutionClass(indicateur.evolution) === 'positive' ? 'bg-green-100 text-green-800' :
//                                           getEvolutionClass(indicateur.evolution) === 'negative' ? 'bg-red-100 text-red-800' :
//                                           'bg-blue-100 text-blue-800'}`}
//                                         >
//                                           {indicateur.evolution}
//                                         </span>
//                                       </td>
//                                     )}
//                                     {visibleColumns.definition && (
//                                       <td className="px-6 py-4 text-sm text-gray-500 max-w-md">
//                                         <div className="group relative">
//                                           <div className="flex items-center gap-1 cursor-help">
//                                             <Info size={14} />
//                                             <span className="underline decoration-dotted truncate max-w-[250px]">
//                                               {indicateur.definition.length > 50
//                                                 ? indicateur.definition.substring(0, 50) + '...'
//                                                 : indicateur.definition}
//                                             </span>
//                                           </div>
//                                           <div className="hidden group-hover:block absolute z-10 w-72 p-2 bg-gray-800 text-white text-xs rounded shadow-lg">
//                                             {indicateur.definition}
//                                           </div>
//                                         </div>
//                                       </td>
//                                     )}
//                                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                                       <button
//                                         onClick={() => viewIndicateurDetails(indicateur.id)}
//                                         className="text-blue-600 hover:text-blue-800"
//                                       >
//                                         <Eye size={16} />
//                                       </button>
//                                     </td>
//                                   </tr>
//                                 ))}
//                               </tbody>
//                             </table>
//                           </div>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="p-6 text-center text-gray-500">
//                     <p>Aucune donnée disponible pour cette période</p>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </AppLayout>
//   );
// };

// export default Analyse;
// resources/js/Pages/Indicateurs/Analyse.tsx
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// Composants d'interface utilisateur
import { PageProps } from '@/types';

// Icônes pour l'interface (utilise Lucide React)
import AppLayout from '@/layouts/app-layout';
import { AlertCircle, ChevronDown, ChevronUp, Download, Eye, FileSpreadsheet, Info, RefreshCw as Refresh, X } from 'lucide-react';

// Types pour les données d'indicateurs
interface Indicateur {
    id: string;
    label: string;
    value: number;
    target: number;
    evolution: string;
    unite: string;
    definition: string;
    is_calculated?: boolean;
    metadata?: {
        entreprise_ids: number[];
        collecte_ids: number[];
        periodes: string[];
        nombre_points_donnees: number;
        demo?: boolean;
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

// Props pour le composant
interface AnalyseProps extends PageProps {
    exercices: Exercice[];
    entreprises: Entreprise[];
    defaultExerciceId: number | null;
    defaultPeriodeType: string;
    periodes: string[];
}

// Constantes pour les couleurs
const COLORS = {
    primary: '#3498db',
    secondary: '#2ecc71',
    tertiary: '#e74c3c',
    dark: '#2c3e50',
    light: '#ecf0f1',
    warning: '#f39c12',
    success: '#27ae60',
};

const NoDataMessage: React.FC = () => {
    return (
        <div className="mb-6 rounded-lg border-l-4 border-yellow-400 bg-yellow-50 p-6 shadow-sm">
            <div className="flex">
                <div className="flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </div>
                <div className="ml-3">
                    <h3 className="text-lg font-medium text-yellow-800">Aucune donnée disponible</h3>
                    <div className="mt-2 text-yellow-700">
                        <p>Aucune donnée n'a été trouvée pour les critères sélectionnés. Veuillez vérifier que:</p>
                        <ul className="mt-1 ml-5 list-disc">
                            <li>Des collectes de données ont été effectuées pour cette période</li>
                            <li>L'entreprise sélectionnée a des données associées</li>
                            <li>L'exercice choisi contient des données pour cette période</li>
                        </ul>
                        <p className="mt-2">Essayez de modifier les filtres ou d'effectuer une nouvelle collecte de données.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Analyse: React.FC<AnalyseProps> = ({ auth, exercices, entreprises, defaultExerciceId, defaultPeriodeType, periodes }) => {
    // États
    const [activeTab, setActiveTab] = useState<'analysis' | 'calculations'>('analysis');
    const [activePeriode, setActivePeriode] = useState<string>(defaultPeriodeType);
    const [activeCategorie, setActiveCategorie] = useState<string>('');
    const [selectedExerciceId, setSelectedExerciceId] = useState<number | null>(defaultExerciceId);
    const [selectedEntrepriseId, setSelectedEntrepriseId] = useState<number | null>(null);
    const [indicateursData, setIndicateursData] = useState<IndicateursParCategorie>({});
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
    const [visibleColumns, setVisibleColumns] = useState({
        valeur: true,
        cible: true,
        evolution: true,
        definition: true,
    });
    const [isDemoData, setIsDemoData] = useState<boolean>(false);

    const formatNumber = (num: number): string => {
        if (typeof num !== 'number') return String(num);
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    };

    useEffect(() => {
        fetchIndicateursData();
    }, [activePeriode, selectedExerciceId, selectedEntrepriseId]);

    const fetchIndicateursData = async () => {
        try {
            setIsLoading(true);
            setError(null);
            setIsDemoData(false);

            const periodeToUse = activePeriode || 'Trimestrielle';

            console.log('Envoi des paramètres:', {
                periode_type: periodeToUse,
                exercice_id: selectedExerciceId,
                entreprise_id: selectedEntrepriseId,
            });

            const response = await axios.get('/api/indicateurs/analyse', {
                params: {
                    periode_type: periodeToUse,
                    exercice_id: selectedExerciceId,
                    entreprise_id: selectedEntrepriseId,
                },
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            if (response.data.success) {
                if (response.data.no_data) {
                    setIndicateursData({});
                } else {
                    setIndicateursData(response.data.data);
                    setIsDemoData(response.data.demo_data || false);
                }

                setLastUpdate(new Date());

                const categories = Object.keys(response.data.data || {});
                if (categories.length > 0 && (!activeCategorie || !categories.includes(activeCategorie))) {
                    setActiveCategorie(categories[0]);
                } else if (categories.length === 0) {
                    setActiveCategorie('');
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

    const categoriesDisponibles = useMemo(() => {
        return Object.keys(indicateursData);
    }, [indicateursData]);

    const indicateursActifs = useMemo(() => {
        if (!activeCategorie || !indicateursData[activeCategorie]) return [];
        return indicateursData[activeCategorie];
    }, [indicateursData, activeCategorie]);

    const exportToExcel = (categorie: string) => {
        const params = new URLSearchParams({
            periode_type: activePeriode,
            categorie: categorie,
        });

        if (selectedExerciceId) {
            params.append('exercice_id', selectedExerciceId.toString());
        }

        if (selectedEntrepriseId) {
            params.append('entreprise_id', selectedEntrepriseId.toString());
        }

        window.location.href = `/api/indicateurs/export-excel?${params.toString()}`;
    };

    const exportAllToExcel = () => {
        const params = new URLSearchParams({
            periode_type: activePeriode,
        });

        if (selectedExerciceId) {
            params.append('exercice_id', selectedExerciceId.toString());
        }

        if (selectedEntrepriseId) {
            params.append('entreprise_id', selectedEntrepriseId.toString());
        }

        window.location.href = `/api/indicateurs/export-excel?${params.toString()}`;
    };

    const toggleCategoryExpand = (categorie: string) => {
        setExpandedCategories((prev) => ({
            ...prev,
            [categorie]: !prev[categorie],
        }));
    };

    const generateChartData = (indicateur: Indicateur) => {
        const baseValue = indicateur.value * 0.7;
        return [
            { name: 'P1', value: Math.round(baseValue) },
            { name: 'P2', value: Math.round(baseValue * 1.2) },
            { name: 'P3', value: Math.round(baseValue * 1.3) },
            { name: 'P4', value: indicateur.value },
        ];
    };

    const generateSummaryChartData = () => {
        if (!indicateursActifs.length) return [];
        const limitedIndicateurs = indicateursActifs.slice(0, 8);
        return limitedIndicateurs.map((ind) => ({
            name: ind.label.length > 20 ? ind.label.substring(0, 20) + '...' : ind.label,
            valeur: ind.value,
            cible: ind.target,
        }));
    };

    const getEvolutionClass = (evolution: string) => {
        if (!evolution) return 'neutral';
        if (evolution.startsWith('+')) return 'positive';
        if (evolution.startsWith('-')) return 'negative';
        return 'neutral';
    };

    const viewIndicateurDetails = (indicateurId: string) => {
        const params = new URLSearchParams({
            categorie: activeCategorie,
            periode_type: activePeriode,
        });

        if (selectedExerciceId) {
            params.append('exercice_id', selectedExerciceId.toString());
        }

        window.location.href = `/indicateurs/detail/${indicateurId}?${params.toString()}`;
    };

    return (
        <AppLayout
            title="Tableau de Bord des Indicateurs"
            user={auth.user}
            header={<h2 className="text-xl leading-tight font-semibold text-gray-800">Tableau de Bord des Indicateurs</h2>}
        >
            <Head title="Analyse des Indicateurs" />

            <div className="bg-gradient-to-r from-blue-800 to-blue-600 p-4 text-white md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold md:text-2xl">Tableau de Bord des Indicateurs</h1>
                        <p className="mt-1 text-sm opacity-80 md:text-base">Analyse des performances et export des données</p>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            href={route('indicateurs.analyse-integree')}
                            className="flex items-center gap-2 rounded-md bg-white/20 px-3 py-2 text-sm text-white transition-colors hover:bg-white/30"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                    fillRule="evenodd"
                                    d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span className="hidden md:inline">Interface avancée</span>
                        </Link>
                        <button
                            onClick={() => fetchIndicateursData()}
                            className="flex items-center gap-2 rounded-md bg-white/20 px-3 py-2 text-sm text-white transition-colors hover:bg-white/30"
                        >
                            <Refresh size={16} />
                            <span className="hidden md:inline">Actualiser</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Alerte pour les données de démo */}
            {isDemoData && (
                <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <AlertCircle className="h-5 w-5 text-yellow-400" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                                <span className="font-medium">Attention:</span> Aucune donnée réelle n'a été trouvée pour les critères sélectionnés.
                                Des données de démonstration sont affichées à titre d'exemple.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Filtres */}
            <div className="border-b border-gray-200 bg-gray-50 p-4">
                <div className="flex flex-wrap items-center gap-4">
                    {/* Sélecteur d'exercice */}
                    <div className="w-full md:w-auto">
                        <label className="mb-1 block text-sm font-medium text-gray-700">Exercice</label>
                        <select
                            value={selectedExerciceId || ''}
                            onChange={(e) => setSelectedExerciceId(e.target.value ? parseInt(e.target.value) : null)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        >
                            <option value="">Tous les exercices</option>
                            {exercices.map((exercice) => (
                                <option key={exercice.id} value={exercice.id}>
                                    {exercice.annee} {exercice.actif && '(Actif)'}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Sélecteur d'entreprise */}
                    <div className="w-full md:w-auto">
                        <label className="mb-1 block text-sm font-medium text-gray-700">Entreprise</label>
                        <select
                            value={selectedEntrepriseId || ''}
                            onChange={(e) => setSelectedEntrepriseId(e.target.value ? parseInt(e.target.value) : null)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        >
                            <option value="">Toutes les entreprises</option>
                            {entreprises.map((entreprise) => (
                                <option key={entreprise.id} value={entreprise.id}>
                                    {entreprise.nom_entreprise}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Filtres appliqués */}
                    {(selectedExerciceId || selectedEntrepriseId) && (
                        <div className="ml-auto flex items-center gap-2">
                            <button
                                onClick={() => {
                                    setSelectedExerciceId(null);
                                    setSelectedEntrepriseId(null);
                                }}
                                className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
                            >
                                <X size={14} />
                                <span>Réinitialiser les filtres</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Onglets */}
            <div className="flex border-b border-gray-200 bg-gray-100">
                <button
                    className={`px-4 py-3 font-medium ${activeTab === 'analysis' ? 'border-b-2 border-blue-600 bg-white text-blue-600' : 'text-gray-600'}`}
                    onClick={() => setActiveTab('analysis')}
                >
                    Analyse & Visualisation
                </button>
                <button
                    className={`px-4 py-3 font-medium ${activeTab === 'calculations' ? 'border-b-2 border-blue-600 bg-white text-blue-600' : 'text-gray-600'}`}
                    onClick={() => setActiveTab('calculations')}
                >
                    Détail des Indicateurs
                </button>
            </div>

            {/* État de chargement */}
            {isLoading && (
                <div className="flex h-64 items-center justify-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
                </div>
            )}

            {/* Affichage des erreurs */}
            {error && !isLoading && (
                <div className="mx-4 my-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
                    <p className="font-medium">Erreur</p>
                    <p>{error}</p>
                    <button onClick={fetchIndicateursData} className="mt-2 rounded bg-red-200 px-3 py-1 text-sm text-red-800 hover:bg-red-300">
                        Réessayer
                    </button>
                </div>
            )}

            {/* Contenu de l'onglet d'analyse */}
            {activeTab === 'analysis' && !isLoading && !error && (
                <div className="p-4 md:p-6">
                    {/* Sélecteur de période */}
                    <div className="mb-6">
                        <h3 className="mb-2 font-medium text-gray-700">Période:</h3>
                        <div className="flex flex-wrap gap-2">
                            {periodes.map((periode) => (
                                <button
                                    key={periode}
                                    className={`rounded-md px-3 py-2 text-sm ${
                                        activePeriode === periode ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                    onClick={() => {
                                        setActivePeriode(periode);
                                        const newCategories = Object.keys(indicateursData);
                                        if (newCategories.length > 0) {
                                            setActiveCategorie(newCategories[0]);
                                        }
                                    }}
                                >
                                    {periode}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sélecteur de catégorie */}
                    {categoriesDisponibles.length > 0 ? (
                        <div className="mb-6">
                            <h3 className="mb-2 font-medium text-gray-700">Catégorie:</h3>
                            <div className="flex flex-wrap gap-2">
                                {categoriesDisponibles.map((categorie) => (
                                    <button
                                        key={categorie}
                                        className={`rounded-md px-3 py-2 text-sm ${
                                            activeCategorie === categorie ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                        onClick={() => setActiveCategorie(categorie)}
                                    >
                                        {categorie.length > 30 ? categorie.substring(0, 30) + '...' : categorie}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <NoDataMessage />
                    )}

                    {/* Contenu principal */}
                    {!isLoading && !error && activeCategorie && indicateursActifs.length > 0 ? (
                        <div>
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="border-l-4 border-blue-500 pl-3 text-lg font-semibold text-gray-800">{activeCategorie}</h2>
                                <button
                                    className="flex items-center gap-2 rounded-md bg-green-600 px-3 py-2 text-sm text-white transition-colors hover:bg-green-700"
                                    onClick={() => exportToExcel(activeCategorie)}
                                >
                                    <Download size={16} />
                                    <span>Exporter Excel</span>
                                </button>
                            </div>

                            <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {indicateursActifs.map((indicateur) => (
                                    <div
                                        key={indicateur.id}
                                        className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                                    >
                                        <div className="mb-3 flex items-center justify-between">
                                            <h3 className="font-medium text-gray-700" title={indicateur.label}>
                                                {indicateur.label.length > 25 ? indicateur.label.substring(0, 25) + '...' : indicateur.label}
                                            </h3>
                                            <span
                                                className={`rounded-full px-2 py-1 text-xs font-semibold ${
                                                    getEvolutionClass(indicateur.evolution) === 'positive'
                                                        ? 'bg-green-100 text-green-800'
                                                        : getEvolutionClass(indicateur.evolution) === 'negative'
                                                          ? 'bg-red-100 text-red-800'
                                                          : 'bg-blue-100 text-blue-800'
                                                }`}
                                            >
                                                {indicateur.evolution}
                                            </span>
                                        </div>

                                        <div className="mb-2">
                                            <span className="text-lg font-bold text-gray-800">{formatNumber(indicateur.value)}</span>
                                            {indicateur.unite && <span className="ml-1 text-sm text-gray-500">{indicateur.unite}</span>}
                                        </div>

                                        <div className="mb-3 text-sm text-gray-600">
                                            Cible: {formatNumber(indicateur.target)} {indicateur.unite}
                                        </div>

                                        <div className="mb-3 h-16">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={generateChartData(indicateur)}>
                                                    <Line
                                                        type="monotone"
                                                        dataKey="value"
                                                        stroke={COLORS.primary}
                                                        strokeWidth={2}
                                                        dot={false}
                                                        isAnimationActive={false}
                                                    />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>

                                        <div className="mt-2 flex items-center justify-between">
                                            <div className="group relative flex items-center text-xs text-gray-500">
                                                <Info size={14} className="mr-1" />
                                                <span className="max-w-[180px] truncate">{indicateur.definition.substring(0, 60)}</span>
                                                <div className="absolute bottom-full left-0 z-10 hidden w-64 rounded bg-gray-800 p-2 text-xs text-white shadow-lg group-hover:block">
                                                    {indicateur.definition}
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => viewIndicateurDetails(indicateur.id)}
                                                className="flex items-center text-xs text-blue-600 hover:text-blue-800"
                                            >
                                                <Eye size={14} className="mr-1" />
                                                <span>Détails</span>
                                            </button>
                                        </div>

                                        {indicateur.is_calculated && (
                                            <div className="absolute top-2 right-2">
                                                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800">Calculé</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {indicateursActifs.length > 1 && (
                                <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                                    <h3 className="mb-4 font-medium text-gray-700">Synthèse des indicateurs</h3>
                                    <div className="h-80">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={generateSummaryChartData()} layout="vertical">
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis type="number" />
                                                <YAxis dataKey="name" type="category" width={150} />
                                                <Tooltip
                                                    formatter={(value) => formatNumber(value as number)}
                                                    labelFormatter={(label) => `Indicateur: ${label}`}
                                                />
                                                <Legend />
                                                <Bar dataKey="valeur" name="Valeur" fill={COLORS.primary} barSize={20} />
                                                <Bar dataKey="cible" name="Cible" fill={COLORS.secondary} barSize={20} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        !isLoading && !error && categoriesDisponibles.length === 0 && <NoDataMessage />
                    )}
                </div>
            )}

            {/* Contenu de l'onglet détail */}
            {activeTab === 'calculations' && !isLoading && !error && (
                <div className="p-4 md:p-6">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-800">Détail des Indicateurs</h2>
                        <div className="text-sm text-gray-600">
                            Dernière mise à jour: <span>{lastUpdate.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Sélecteur de période */}
                    <div className="mb-6">
                        <h3 className="mb-2 font-medium text-gray-700">Période:</h3>
                        <div className="flex flex-wrap gap-2">
                            {periodes.map((periode) => (
                                <button
                                    key={periode}
                                    className={`rounded-md px-3 py-2 text-sm ${
                                        activePeriode === periode ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                    onClick={() => setActivePeriode(periode)}
                                >
                                    {periode}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Contrôles d'affichage */}
                    <div className="mb-6 flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700">Colonnes:</span>
                            <label className="flex items-center gap-1">
                                <input
                                    type="checkbox"
                                    checked={visibleColumns.valeur}
                                    onChange={() => setVisibleColumns({ ...visibleColumns, valeur: !visibleColumns.valeur })}
                                    className="rounded text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-600">Valeur</span>
                            </label>
                            <label className="flex items-center gap-1">
                                <input
                                    type="checkbox"
                                    checked={visibleColumns.cible}
                                    onChange={() => setVisibleColumns({ ...visibleColumns, cible: !visibleColumns.cible })}
                                    className="rounded text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-600">Cible</span>
                            </label>
                            <label className="flex items-center gap-1">
                                <input
                                    type="checkbox"
                                    checked={visibleColumns.evolution}
                                    onChange={() => setVisibleColumns({ ...visibleColumns, evolution: !visibleColumns.evolution })}
                                    className="rounded text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-600">Évolution</span>
                            </label>
                            <label className="flex items-center gap-1">
                                <input
                                    type="checkbox"
                                    checked={visibleColumns.definition}
                                    onChange={() => setVisibleColumns({ ...visibleColumns, definition: !visibleColumns.definition })}
                                    className="rounded text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-600">Définition</span>
                            </label>
                        </div>

                        <button
                            className="ml-auto flex items-center gap-2 rounded-md bg-green-600 px-3 py-2 text-sm text-white transition-colors hover:bg-green-700"
                            onClick={exportAllToExcel}
                        >
                            <Download size={16} />
                            <span>Exporter tout en Excel</span>
                        </button>
                    </div>

                    {/* Tableau détaillé des indicateurs */}
                    {categoriesDisponibles.length > 0 ? (
                        <div className="space-y-6">
                            {categoriesDisponibles.map((categorie) => (
                                <div key={categorie} className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                                    <div
                                        className="flex cursor-pointer items-center justify-between bg-gray-50 px-4 py-3"
                                        onClick={() => toggleCategoryExpand(categorie)}
                                    >
                                        <h3 className="flex items-center gap-2 font-medium text-gray-800">
                                            {expandedCategories[categorie] === false ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                                            {categorie}
                                        </h3>
                                        <button
                                            className="flex items-center gap-2 text-sm text-green-700 hover:text-green-800"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                exportToExcel(categorie);
                                            }}
                                        >
                                            <FileSpreadsheet size={16} />
                                            <span>Exporter</span>
                                        </button>
                                    </div>

                                    {expandedCategories[categorie] !== false && (
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th
                                                            scope="col"
                                                            className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                                                        >
                                                            Indicateur
                                                        </th>
                                                        {visibleColumns.valeur && (
                                                            <th
                                                                scope="col"
                                                                className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                                                            >
                                                                Valeur
                                                            </th>
                                                        )}
                                                        {visibleColumns.cible && (
                                                            <th
                                                                scope="col"
                                                                className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                                                            >
                                                                Cible
                                                            </th>
                                                        )}
                                                        {visibleColumns.evolution && (
                                                            <th
                                                                scope="col"
                                                                className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                                                            >
                                                                Évolution
                                                            </th>
                                                        )}
                                                        {visibleColumns.definition && (
                                                            <th
                                                                scope="col"
                                                                className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                                                            >
                                                                Définition
                                                            </th>
                                                        )}
                                                        <th
                                                            scope="col"
                                                            className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase"
                                                        >
                                                            Actions
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200 bg-white">
                                                    {indicateursData[categorie].map((indicateur) => (
                                                        <tr key={indicateur.id} className="hover:bg-gray-50">
                                                            <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                                                                {indicateur.label}
                                                                {indicateur.is_calculated && (
                                                                    <span className="ml-2 inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                                                        Calculé
                                                                    </span>
                                                                )}
                                                                {indicateur.metadata?.demo && (
                                                                    <span className="ml-2 inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                                                                        Démo
                                                                    </span>
                                                                )}
                                                            </td>
                                                            {visibleColumns.valeur && (
                                                                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                                                                    <span className="font-medium">{formatNumber(indicateur.value)}</span>
                                                                    {indicateur.unite && (
                                                                        <span className="ml-1 text-gray-500">{indicateur.unite}</span>
                                                                    )}
                                                                </td>
                                                            )}
                                                            {visibleColumns.cible && (
                                                                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                                                                    <span className="font-medium">{formatNumber(indicateur.target)}</span>
                                                                    {indicateur.unite && (
                                                                        <span className="ml-1 text-gray-500">{indicateur.unite}</span>
                                                                    )}
                                                                </td>
                                                            )}
                                                            {visibleColumns.evolution && (
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <span
                                                                        className={`inline-flex rounded-full px-2 py-1 text-xs leading-5 font-semibold ${
                                                                            getEvolutionClass(indicateur.evolution) === 'positive'
                                                                                ? 'bg-green-100 text-green-800'
                                                                                : getEvolutionClass(indicateur.evolution) === 'negative'
                                                                                  ? 'bg-red-100 text-red-800'
                                                                                  : 'bg-blue-100 text-blue-800'
                                                                        }`}
                                                                    >
                                                                        {indicateur.evolution}
                                                                    </span>
                                                                </td>
                                                            )}
                                                            {visibleColumns.definition && (
                                                                <td className="max-w-md px-6 py-4 text-sm text-gray-500">
                                                                    <div className="group relative">
                                                                        <div className="flex cursor-help items-center gap-1">
                                                                            <Info size={14} />
                                                                            <span className="max-w-[250px] truncate underline decoration-dotted">
                                                                                {indicateur.definition.length > 50
                                                                                    ? indicateur.definition.substring(0, 50) + '...'
                                                                                    : indicateur.definition}
                                                                            </span>
                                                                        </div>
                                                                        <div className="absolute z-10 hidden w-72 rounded bg-gray-800 p-2 text-xs text-white shadow-lg group-hover:block">
                                                                            {indicateur.definition}
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            )}
                                                            <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                                                                <button
                                                                    onClick={() => viewIndicateurDetails(indicateur.id)}
                                                                    className="text-blue-600 hover:text-blue-800"
                                                                >
                                                                    <Eye size={16} />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <NoDataMessage />
                    )}
                </div>
            )}
        </AppLayout>
    );
};

export default Analyse;
