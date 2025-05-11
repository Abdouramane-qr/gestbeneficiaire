// import { Head, Link } from '@inertiajs/react';
// import axios from 'axios';
// import React, { useEffect, useMemo, useState } from 'react';
// import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
// import AppLayout from '@/layouts/app-layout';
// import { AlertCircle, ChevronDown, ChevronUp, Download, FileSpreadsheet, Info, Moon, RefreshCw as Refresh, Sun, X, Layers, Building2, MapPin, Users, Filter, Tag } from 'lucide-react';
// import { initDarkMode, listenForThemeChanges, toggleDarkMode } from '@/Utils/darkMode';
// import { PageProps } from '@/types';

// // Interfaces pour les données
// interface Indicateur {
//     id: string;
//     label: string;
//     value: number;
//     target: number;
//     unite: string;
//     definition: string;
//     is_calculated?: boolean;
//     metadata?: {
//         entreprise_ids: number[];
//         collecte_ids: number[];
//         nombre_points_donnees: number;
//         previous_value?: number;
//     };
// }

// interface IndicateursParCategorie {
//     [categorie: string]: Indicateur[];
// }

// interface Exercice {
//     id: number;
//     annee: number;
//     date_debut: string;
//     date_fin: string;
//     actif: boolean;
// }

// interface Entreprise {
//     id: number;
//     nom_entreprise: string;
//     secteur_activite: string;
//     ville?: string;
//     commune?: string;
// }

// interface Beneficiaire {
//     id: number;
//     nom: string;
//     prenom: string;
//     type_beneficiaire?: string;
// }

// interface AnalyseProps extends PageProps {
//     exercices: Exercice[];
//     entreprises: Entreprise[];
//     defaultExerciceId: number | null;
//     defaultPeriodeType: string;
//     periodes: string[];
//     beneficiaires?: Beneficiaire[];
// }

// const COLORS = {
//     primary: '#3498db',
//     secondary: '#2ecc71',
//     tertiary: '#e74c3c',
//     dark: '#2c3e50',
//     light: '#ecf0f1',
//     warning: '#f39c12',
//     success: '#27ae60',
// };

// const NoDataMessage: React.FC<{ periodeName?: string }> = ({ periodeName = '' }) => {
//     return (
//         <div className="mb-6 rounded-lg border-l-4 border-yellow-400 bg-yellow-50 p-6 shadow-sm dark:border-yellow-600 dark:bg-yellow-900/20">
//             <div className="flex flex-col sm:flex-row">
//                 <div className="mb-4 flex-shrink-0 sm:mr-4 sm:mb-0">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400 dark:text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//                     </svg>
//                 </div>
//                 <div>
//                     <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-300">Aucune donnée disponible</h3>
//                     <div className="mt-2 text-yellow-700 dark:text-yellow-400">
//                         <p>Aucune donnée n'a été trouvée pour les critères sélectionnés. Veuillez vérifier que:</p>
//                         <ul className="mt-1 ml-5 list-disc">
//                             <li>Des collectes de données ont été effectuées pour cette période</li>
//                             {periodeName === 'Occasionnelle' ? (
//                                 <li>Le bénéficiaire sélectionné a des données associées</li>
//                             ) : (
//                                 <li>L'entreprise sélectionnée a des données associées</li>
//                             )}
//                             <li>L'exercice choisi contient des données pour cette période</li>
//                         </ul>
//                         <p className="mt-2">Essayez de modifier les filtres ou d'effectuer une nouvelle collecte de données.</p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// const Analyse: React.FC<AnalyseProps> = ({ auth, exercices, entreprises, defaultExerciceId, defaultPeriodeType, periodes, beneficiaires = [] }) => {
//     // États pour le thème
//     const [isDarkMode, setIsDarkMode] = useState<boolean>(() => initDarkMode());

//     // États principaux
//     const [activeTab, setActiveTab] = useState<'analysis' | 'calculations'>('analysis');
//     const [activePeriode, setActivePeriode] = useState<string>(defaultPeriodeType);
//     const [activeCategorie, setActiveCategorie] = useState<string>('');
//     const [selectedExerciceId, setSelectedExerciceId] = useState<number | null>(defaultExerciceId);
//     const [selectedEntrepriseId, setSelectedEntrepriseId] = useState<number | null>(null);
//     const [selectedBeneficiaireId, setSelectedBeneficiaireId] = useState<number | null>(null);
//     const [selectedRegion, setSelectedRegion] = useState<string>('');
//     const [selectedCommune, setSelectedCommune] = useState<string>('');
//     const [selectedSecteur, setSelectedSecteur] = useState<string>('');
//     const [selectedBeneficiaireType, setSelectedBeneficiaireType] = useState<string>('');
//     const [indicateursData, setIndicateursData] = useState<IndicateursParCategorie>({});
//     const [isLoading, setIsLoading] = useState<boolean>(true);
//     const [error, setError] = useState<string | null>(null);
//     const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
//     const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
//     const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);
//     const [visibleColumns, setVisibleColumns] = useState({
//         valeur: true,
//         cible: true,
//         evolution: false,
//         definition: true,
//     });

//     // Vérifier si on est en mode occasionnelle
//     const isOccasionnelle = useMemo(() => {
//         return activePeriode === 'Occasionnelle';
//     }, [activePeriode]);

//     // Extraction des valeurs uniques pour les filtres
//     const regions = useMemo(() => {
//         const uniqueRegions = Array.from(new Set(entreprises.map(e => e.ville).filter(Boolean)));
//         return uniqueRegions;
//     }, [entreprises]);

//     const communes = useMemo(() => {
//         const uniqueCommunes = Array.from(new Set(entreprises.map(e => e.commune).filter(Boolean)));
//         return uniqueCommunes;
//     }, [entreprises]);

//     const secteurs = useMemo(() => {
//         const uniqueSecteurs = Array.from(new Set(entreprises.map(e => e.secteur_activite).filter(Boolean)));
//         return uniqueSecteurs;
//     }, [entreprises]);

//     const beneficiaireTypes = useMemo(() => {
//         const uniqueTypes = Array.from(new Set(beneficiaires.map(b => b.type_beneficiaire).filter(Boolean)));
//         return uniqueTypes;
//     }, [beneficiaires]);

//     // Écouter les changements de préférence système pour le mode sombre
//     useEffect(() => {
//         listenForThemeChanges((isDark) => {
//             setIsDarkMode(isDark);
//         });
//     }, []);

//     // Fonction pour basculer le mode sombre
//     const handleToggleDarkMode = () => {
//         const newDarkMode = !isDarkMode;
//         toggleDarkMode(newDarkMode);
//         setIsDarkMode(newDarkMode);
//     };

//     // Fonction pour formater des nombres
//     const formatNumber = (num: number): string => {
//         if (typeof num !== 'number') return String(num);
//         return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
//     };

//     // Récupérer les données quand les filtres changent
//     useEffect(() => {
//         fetchIndicateursData();
//     }, [activePeriode, selectedExerciceId, selectedEntrepriseId, selectedBeneficiaireId, selectedRegion, selectedCommune, selectedSecteur, selectedBeneficiaireType]);

//     // Fonction pour récupérer les données
//     const fetchIndicateursData = async () => {
//         try {
//             setIsLoading(true);
//             setError(null);

//             const params: any = {
//                 periode_type: activePeriode,
//                 exercice_id: selectedExerciceId,
//             };

//             // Pour les collectes occasionnelles, utiliser beneficiaire_id au lieu d'entreprise_id
//             if (isOccasionnelle) {
//                 if (selectedBeneficiaireId) {
//                     params.beneficiaire_id = selectedBeneficiaireId;
//                 }
//             } else {
//                 if (selectedEntrepriseId) {
//                     params.entreprise_id = selectedEntrepriseId;
//                 }
//             }

//             // Ajouter les filtres avancés s'ils sont sélectionnés
//             if (selectedRegion) params.region = selectedRegion;
//             if (selectedCommune) params.commune = selectedCommune;
//             if (selectedSecteur) params.secteur = selectedSecteur;
//             if (selectedBeneficiaireType) params.beneficiaire_type = selectedBeneficiaireType;

//             const response = await axios.get('/api/indicateurs/analyse', {
//                 params,
//                 headers: {
//                     Accept: 'application/json',
//                     'X-Requested-With': 'XMLHttpRequest',
//                 },
//             });

//             if (response.data.success) {
//                 if (response.data.no_data) {
//                     setIndicateursData({});
//                 } else {
//                     setIndicateursData(response.data.data);
//                 }

//                 setLastUpdate(new Date());

//                 const categories = Object.keys(response.data.data || {});
//                 if (categories.length > 0 && (!activeCategorie || !categories.includes(activeCategorie))) {
//                     setActiveCategorie(categories[0]);
//                 } else if (categories.length === 0) {
//                     setActiveCategorie('');
//                 }
//             } else {
//                 setError('Échec de la récupération des données');
//             }
//         } catch (err) {
//             console.error('Erreur lors de la récupération des données:', err);
//             setError('Une erreur est survenue lors de la récupération des données');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // Calcul des catégories et indicateurs disponibles
//     const categoriesDisponibles = useMemo(() => {
//         return Object.keys(indicateursData);
//     }, [indicateursData]);

//     const indicateursActifs = useMemo(() => {
//         if (!activeCategorie || !indicateursData[activeCategorie]) return [];
//         return indicateursData[activeCategorie];
//     }, [indicateursData, activeCategorie]);

//     // Fonction pour exporter vers Excel
//     const exportToExcel = (categorie: string) => {
//         const params = new URLSearchParams({
//             periode_type: activePeriode,
//             categorie: categorie,
//         });

//         if (selectedExerciceId) params.append('exercice_id', selectedExerciceId.toString());

//         // Pour les collectes occasionnelles, utiliser beneficiaire_id
//         if (isOccasionnelle) {
//             if (selectedBeneficiaireId) params.append('beneficiaire_id', selectedBeneficiaireId.toString());
//         } else {
//             if (selectedEntrepriseId) params.append('entreprise_id', selectedEntrepriseId.toString());
//         }

//         if (selectedRegion) params.append('region', selectedRegion);
//         if (selectedCommune) params.append('commune', selectedCommune);
//         if (selectedSecteur) params.append('secteur', selectedSecteur);
//         if (selectedBeneficiaireType) params.append('beneficiaire_type', selectedBeneficiaireType);

//         window.location.href = `/api/indicateurs/export-excel?${params.toString()}`;
//     };

//     // Fonction pour exporter tous les indicateurs
//     const exportAllToExcel = () => {
//         const params = new URLSearchParams({
//             periode_type: activePeriode,
//         });

//         if (selectedExerciceId) params.append('exercice_id', selectedExerciceId.toString());

//         // Pour les collectes occasionnelles, utiliser beneficiaire_id
//         if (isOccasionnelle) {
//             if (selectedBeneficiaireId) params.append('beneficiaire_id', selectedBeneficiaireId.toString());
//         } else {
//             if (selectedEntrepriseId) params.append('entreprise_id', selectedEntrepriseId.toString());
//         }

//         if (selectedRegion) params.append('region', selectedRegion);
//         if (selectedCommune) params.append('commune', selectedCommune);
//         if (selectedSecteur) params.append('secteur', selectedSecteur);
//         if (selectedBeneficiaireType) params.append('beneficiaire_type', selectedBeneficiaireType);

//         window.location.href = `/api/indicateurs/export-excel?${params.toString()}`;
//     };

//     // Fonction pour basculer l'expansion des catégories
//     const toggleCategoryExpand = (categorie: string) => {
//         setExpandedCategories((prev) => ({
//             ...prev,
//             [categorie]: !prev[categorie],
//         }));
//     };

//     // Générer les données pour les graphiques
//     const generateChartData = (indicateur: Indicateur) => {
//         const baseValue = indicateur.value * 0.7;
//         return [
//             { name: 'P1', value: Math.round(baseValue) },
//             { name: 'P2', value: Math.round(baseValue * 1.2) },
//             { name: 'P3', value: Math.round(baseValue * 1.3) },
//             { name: 'P4', value: indicateur.value },
//         ];
//     };

//     // Générer les données pour le graphique de synthèse
//     const generateSummaryChartData = () => {
//         if (!indicateursActifs.length) return [];
//         const limitedIndicateurs = indicateursActifs.slice(0, 8);
//         return limitedIndicateurs.map((ind) => ({
//             name: ind.label.length > 20 ? ind.label.substring(0, 20) + '...' : ind.label,
//             valeur: ind.value,
//             cible: ind.target,
//         }));
//     };

//     // Calculer l'évolution d'un indicateur
//     const calculateEvolution = (currentValue: number, previousValue?: number): string => {
//         if (previousValue === undefined || previousValue === 0) {
//             // Si nous n'avons pas de valeur précédente, retourner N/A
//             return 'N/A';
//         }

//         const evolution = ((currentValue - previousValue) / previousValue) * 100;
//         const sign = evolution >= 0 ? '+' : '';
//         return `${sign}${evolution.toFixed(1)}%`;
//     };

//     // Déterminer la classe CSS pour l'évolution
//     const getEvolutionClass = (evolutionText: string) => {
//         if (evolutionText === 'N/A') return 'neutral';
//         const evolutionValue = parseFloat(evolutionText.replace('+', '').replace('%', ''));

//         if (evolutionValue > 0) return 'positive';
//         if (evolutionValue < 0) return 'negative';
//         return 'neutral';
//     };

//     // Fonction pour déterminer l'état d'un indicateur vs sa cible
//     const getIndicatorTargetClass = (value: number, target: number) => {
//         if (target === 0) return 'neutral';
//         const evolution = ((value - target) / target) * 100;
//         if (evolution >= 0) return 'positive';
//         if (evolution < -10) return 'negative';
//         return 'neutral';
//     };

//     // Réinitialiser les filtres
//     const resetFilters = () => {
//         setSelectedExerciceId(null);
//         setSelectedEntrepriseId(null);
//         setSelectedBeneficiaireId(null);
//         setSelectedRegion('');
//         setSelectedCommune('');
//         setSelectedSecteur('');
//         setSelectedBeneficiaireType('');
//     };

//     // Réinitialiser les filtres spécifiques quand on change de période
//     useEffect(() => {
//         if (!isOccasionnelle) {
//             setSelectedBeneficiaireId(null);
//         } else {
//             setSelectedEntrepriseId(null);
//         }
//     }, [isOccasionnelle]);

//     // Vue des détails d'un indicateur
//     const viewIndicateurDetails = (indicateur: Indicateur) => {
//         const params = new URLSearchParams({
//             categorie: activeCategorie,
//             periode_type: activePeriode
//         });

//         if (selectedExerciceId) {
//             params.append('exercice_id', selectedExerciceId.toString());
//         }

//         // Ajouter le bon ID selon la période
//         if (isOccasionnelle) {
//             if (selectedBeneficiaireId) {
//                 params.append('beneficiaire_id', selectedBeneficiaireId.toString());
//             }
//         } else {
//             if (selectedEntrepriseId) {
//                 params.append('entreprise_id', selectedEntrepriseId.toString());
//             }
//         }

//         window.location.href = `/indicateurs/detail/${indicateur.id}?${params.toString()}`;
//     };

//     return (
//         <AppLayout
//             title="Tableau de Bord des Indicateurs"
//             user={auth.user}
//             header={
//                 <div className="flex items-center justify-between">
//                     <h2 className="text-xl leading-tight font-semibold text-gray-800 dark:text-gray-100">Tableau de Bord des Indicateurs</h2>
//                     <button
//                         onClick={handleToggleDarkMode}
//                         className="rounded-full bg-gray-200 p-2 text-gray-800 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
//                         aria-label={isDarkMode ? 'Passer au mode clair' : 'Passer au mode sombre'}
//                     >
//                         {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
//                     </button>
//                 </div>
//             }
//         >
//             <Head title="Analyse des Indicateurs" />

//             {/* En-tête principal */}
//             <div className="bg-gradient-to-r from-blue-800 to-blue-600 p-4 text-white md:p-6 dark:from-blue-900 dark:to-blue-700">
//                 <div className="flex items-center justify-between">
//                     <div>
//                         <h1 className="text-xl font-bold md:text-2xl">Tableau de Bord des Indicateurs</h1>
//                         <p className="mt-1 text-sm opacity-80 md:text-base">Analyse des performances et export des données</p>
//                     </div>
//                     <div className="flex gap-2">
//                         <Link
//                             href={route('indicateurs.analyse-integree')}
//                             className="flex items-center gap-2 rounded-md bg-white/20 px-3 py-2 text-sm text-white transition-colors hover:bg-white/30"
//                         >
//                             <Layers size={16} />
//                             <span className="hidden md:inline">Interface avancée</span>
//                         </Link>
//                         <button
//                             onClick={() => fetchIndicateursData()}
//                             className="flex items-center gap-2 rounded-md bg-white/20 px-3 py-2 text-sm text-white transition-colors hover:bg-white/30"
//                             aria-label="Actualiser les données"
//                         >
//                             <Refresh size={16} className={isLoading ? 'animate-spin' : ''} />
//                             <span className="hidden md:inline">Actualiser</span>
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* Filtres principaux */}
//             <div className="border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
//                 <div className="flex flex-wrap items-center gap-4">
//                     {/* Sélecteur d'exercice */}
//                     <div className="w-full md:w-auto">
//                         <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Exercice</label>
//                         <select
//                             value={selectedExerciceId || ''}
//                             onChange={(e) => setSelectedExerciceId(e.target.value ? parseInt(e.target.value) : null)}
//                             className="block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
//                         >
//                             <option value="">Tous les exercices</option>
//                             {exercices.map((exercice) => (
//                                 <option key={exercice.id} value={exercice.id}>
//                                     {exercice.annee} {exercice.actif && '(Actif)'}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     {/* Sélecteur d'entreprise OU bénéficiaire selon la période */}
//                     <div className="w-full md:w-auto">
//                         <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
//                             {isOccasionnelle ? 'Bénéficiaire' : 'Entreprise'}
//                         </label>

//                         {isOccasionnelle ? (
//                             <select
//                                 value={selectedBeneficiaireId || ''}
//                                 onChange={(e) => setSelectedBeneficiaireId(e.target.value ? parseInt(e.target.value) : null)}
//                                 className="block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
//                             >
//                                 <option value="">Tous les bénéficiaires</option>
//                                 {beneficiaires.map((beneficiaire) => (
//                                     <option key={beneficiaire.id} value={beneficiaire.id}>
//                                         {beneficiaire.nom} {beneficiaire.prenom}
//                                     </option>
//                                 ))}
//                             </select>
//                         ) : (
//                             <select
//                                 value={selectedEntrepriseId || ''}
//                                 onChange={(e) => setSelectedEntrepriseId(e.target.value ? parseInt(e.target.value) : null)}
//                                 className="block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
//                             >
//                                 <option value="">Toutes les entreprises</option>
//                                 {entreprises.map((entreprise) => (
//                                     <option key={entreprise.id} value={entreprise.id}>
//                                         {entreprise.nom_entreprise}
//                                     </option>
//                                 ))}
//                             </select>
//                         )}
//                     </div>

//                     {/* Bouton filtres avancés */}
//                     <div className="ml-auto">
//                         <button
//                             onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
//                             className="flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm text-white transition-colors hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
//                         >
//                             <Filter size={16} />
//                             <span>Filtres avancés</span>
//                             {showAdvancedFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//                         </button>
//                     </div>
//                 </div>

//                 {/* Filtres avancés */}
//                 {showAdvancedFilters && (
//                     <div className="mt-4 grid grid-cols-1 gap-4 border-t border-gray-200 pt-4 dark:border-gray-700 md:grid-cols-2 lg:grid-cols-4">
//                         {/* Filtre Région */}
//                         <div>
//                             <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
//                                 <MapPin className="inline mr-1 h-4 w-4" />
//                                 Région / Ville
//                             </label>
//                             <select
//                                 value={selectedRegion}
//                                 onChange={(e) => setSelectedRegion(e.target.value)}
//                                 className="block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
//                             >
//                                 <option value="">Toutes les régions</option>
//                                 {regions.map((region) => (
//                                     <option key={region} value={region}>
//                                         {region}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>

//                         {/* Filtre Commune */}
//                         <div>
//                             <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
//                                 <Building2 className="inline mr-1 h-4 w-4" />
//                                 Commune
//                             </label>
//                             <select
//                                 value={selectedCommune}
//                                 onChange={(e) => setSelectedCommune(e.target.value)}
//                                 className="block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
//                             >
//                                 <option value="">Toutes les communes</option>
//                                 {communes.map((commune) => (
//                                     <option key={commune} value={commune}>
//                                         {commune}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>

//                         {/* Filtre Secteur */}
//                         <div>
//                             <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
//                                 <Tag className="inline mr-1 h-4 w-4" />
//                                 Secteur d'activité
//                             </label>
//                             <select
//                                 value={selectedSecteur}
//                                 onChange={(e) => setSelectedSecteur(e.target.value)}
//                                 className="block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
//                             >
//                                 <option value="">Tous les secteurs</option>
//                                 {secteurs.map((secteur) => (
//                                     <option key={secteur} value={secteur}>
//                                         {secteur}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>

//                         {/* Filtre Type de bénéficiaire */}
//                         <div>
//                             <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
//                                 <Users className="inline mr-1 h-4 w-4" />
//                                 Type de bénéficiaire
//                             </label>
//                             <select
//                                 value={selectedBeneficiaireType}
//                                 onChange={(e) => setSelectedBeneficiaireType(e.target.value)}
//                                 className="block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
//                             >
//                                 <option value="">Tous les types</option>
//                                 {beneficiaireTypes.map((type) => (
//                                     <option key={type} value={type}>
//                                         {type}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                     </div>
//                 )}

//                 {/* Indicateur des filtres actifs et bouton reset */}
//                 {(selectedExerciceId || selectedEntrepriseId || selectedBeneficiaireId || selectedRegion || selectedCommune || selectedSecteur || selectedBeneficiaireType) && (
//                     <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
//                         <div className="flex flex-wrap gap-2">
//                             {selectedExerciceId && (
//                                 <span className="inline-flex items-center rounded-md bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
//                                     Exercice: {exercices.find(e => e.id === selectedExerciceId)?.annee}
//                                 </span>
//                             )}
//                             {selectedEntrepriseId && (
//                                 <span className="inline-flex items-center rounded-md bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
//                                     Entreprise: {entreprises.find(e => e.id === selectedEntrepriseId)?.nom_entreprise}
//                                 </span>
//                             )}
//                             {selectedBeneficiaireId && (
//                                 <span className="inline-flex items-center rounded-md bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
//                                     Bénéficiaire: {beneficiaires.find(b => b.id === selectedBeneficiaireId)?.nom} {beneficiaires.find(b => b.id === selectedBeneficiaireId)?.prenom}
//                                 </span>
//                             )}
//                             {selectedRegion && (
//                                 <span className="inline-flex items-center rounded-md bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-200">
//                                     Région: {selectedRegion}
//                                 </span>
//                             )}
//                             {selectedCommune && (
//                                 <span className="inline-flex items-center rounded-md bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800 dark:bg-orange-900 dark:text-orange-200">
//                                     Commune: {selectedCommune}
//                                 </span>
//                             )}
//                             {selectedSecteur && (
//                                 <span className="inline-flex items-center rounded-md bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
//                                     Secteur: {selectedSecteur}
//                                 </span>
//                             )}
//                             {selectedBeneficiaireType && (
//                                 <span className="inline-flex items-center rounded-md bg-pink-100 px-2.5 py-0.5 text-xs font-medium text-pink-800 dark:bg-pink-900 dark:text-pink-200">
//                                     Type: {selectedBeneficiaireType}
//                                 </span>
//                             )}
//                         </div>
//                         <button
//                             onClick={resetFilters}
//                             className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
//                         >
//                             <X size={14} />
//                             <span>Réinitialiser</span>
//                         </button>
//                     </div>
//                 )}
//             </div>

//             {/* Onglets */}
//             <div className="flex border-b border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
//                 <button
//                     className={`px-4 py-3 font-medium transition-colors ${activeTab === 'analysis' ? 'border-b-2 border-blue-600 bg-white text-blue-600 dark:border-blue-500 dark:bg-gray-900 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}
//                     onClick={() => setActiveTab('analysis')}
//                 >
//                     Analyse & Visualisation
//                 </button>
//                 <button
//                     className={`px-4 py-3 font-medium transition-colors ${activeTab === 'calculations' ? 'border-b-2 border-blue-600 bg-white text-blue-600 dark:border-blue-500 dark:bg-gray-900 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}
//                     onClick={() => setActiveTab('calculations')}
//                 >
//                     Détail des Indicateurs
//                 </button>
//             </div>

//             {/* État de chargement */}
//             {isLoading && (
//                 <div className="flex h-64 items-center justify-center">
//                     <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
//                 </div>
//             )}

//             {/* Affichage des erreurs */}
//             {error && !isLoading && (
//                 <div className="mx-4 my-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700 dark:border-red-600 dark:bg-red-900/20 dark:text-red-400">
//                     <p className="font-medium">Erreur</p>
//                     <p>{error}</p>
//                     <button
//                         onClick={fetchIndicateursData}
//                         className="mt-2 rounded bg-red-200 px-3 py-1 text-sm text-red-800 hover:bg-red-300 dark:bg-red-800 dark:text-red-200 dark:hover:bg-red-700"
//                     >
//                         Réessayer
//                     </button>
//                 </div>
//             )}

//             {/* Contenu de l'onglet d'analyse */}
//             {activeTab === 'analysis' && !isLoading && !error && (
//                 <div className="p-4 md:p-6">
//                     {/* Sélecteur de période */}
//                     <div className="mb-6">
//                         <h3 className="mb-2 font-medium text-gray-700 dark:text-gray-300">Période:</h3>
//                         <div className="flex flex-wrap gap-2">
//                             {periodes.map((periode) => (
//                                 <button
//                                     key={periode}
//                                     className={`rounded-md px-3 py-2 text-sm transition-colors ${
//                                         activePeriode === periode
//                                             ? 'bg-blue-600 text-white dark:bg-blue-500 dark:text-white'
//                                             : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
//                                     }`}
//                                     onClick={() => {
//                                         setActivePeriode(periode);
//                                         const newCategories = Object.keys(indicateursData);
//                                         if (newCategories.length > 0) {
//                                             setActiveCategorie(newCategories[0]);
//                                         }
//                                     }}
//                                 >
//                                     {periode}
//                                 </button>
//                             ))}
//                         </div>
//                     </div>

//                     {/* Sélecteur de catégorie */}
//                     {categoriesDisponibles.length > 0 ? (
//                         <div className="mb-6">
//                             <h3 className="mb-2 font-medium text-gray-700 dark:text-gray-300">Catégorie:</h3>
//                             <div className="flex flex-wrap gap-2">
//                                 {categoriesDisponibles.map((categorie) => (
//                                     <button
//                                         key={categorie}
//                                         className={`rounded-md px-3 py-2 text-sm transition-colors ${
//                                             activeCategorie === categorie
//                                                 ? 'bg-blue-600 text-white dark:bg-blue-500 dark:text-white'
//                                                 : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
//                                         }`}
//                                         onClick={() => setActiveCategorie(categorie)}
//                                     >
//                                         {categorie.length > 30 ? categorie.substring(0, 30) + '...' : categorie}
//                                     </button>
//                                 ))}
//                             </div>
//                         </div>
//                     ) : (
//                         <NoDataMessage periodeName={activePeriode} />
//                     )}

//                     {/* Contenu principal */}
//                     {!isLoading && !error && activeCategorie && indicateursActifs.length > 0 ? (
//                         <div>
//                             <div className="mb-4 flex items-center justify-between">
//                                 <h2 className="border-l-4 border-blue-500 pl-3 text-lg font-semibold text-gray-800 dark:text-gray-200">
//                                     {activeCategorie}
//                                 </h2>
//                                 <button
//                                     className="flex items-center gap-2 rounded-md bg-green-600 px-3 py-2 text-sm text-white transition-colors hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
//                                     onClick={() => exportToExcel(activeCategorie)}
//                                 >
//                                     <Download size={16} />
//                                     <span>Exporter Excel</span>
//                                 </button>
//                             </div>

//                             <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//                                 {indicateursActifs.length > 8 && (
//                                     <button
//                                         className="col-span-1 mb-4 flex items-center justify-center rounded-md bg-gray-200 px-3 py-2 text-sm text-gray-800 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
//                                         onClick={() => exportAllToExcel()}
//                                     >
//                                         <FileSpreadsheet size={16} />
//                                         <span className="ml-2">Exporter tous les indicateurs</span>
//                                     </button>
//                                 )}
//                                 {indicateursActifs.map((indicateur, index) => {
//                                     const evolution = calculateEvolution(indicateur.value, indicateur.metadata?.previous_value);
//                                     const evolutionClass = getEvolutionClass(evolution);

//                                     return (
//                                         <div
//                                             key={`${indicateur.id}-${indicateur.label}-${index}`}
//                                             className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
//                                         >
//                                             <div className="mb-3 flex items-center justify-between">
//                                                 <h3 className="font-medium text-gray-700 dark:text-gray-300" title={indicateur.label}>
//                                                     {indicateur.label.length > 25 ? indicateur.label.substring(0, 25) + '...' : indicateur.label}
//                                                 </h3>
//                                                 {evolution !== 'N/A' && (
//                                                     <span
//                                                         className={`rounded-full px-2 py-1 text-xs font-semibold ${
//                                                             evolutionClass === 'positive'
//                                                                 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
//                                                                 : evolutionClass === 'negative'
//                                                                   ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
//                                                                   : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
//                                                         }`}
//                                                     >
//                                                         {evolution}
//                                                     </span>
//                                                 )}
//                                             </div>

//                                             <div className="mb-2">
//                                                 <span className="text-lg font-bold text-gray-800 dark:text-gray-200">
//                                                     {formatNumber(indicateur.value)}
//                                                 </span>
//                                                 {indicateur.unite && (
//                                                     <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">{indicateur.unite}</span>
//                                                 )}
//                                             </div>

//                                             <div className="mb-3 text-sm text-gray-600 dark:text-gray-400">
//                                                 Cible: {formatNumber(indicateur.target)} {indicateur.unite}
//                                             </div>

//                                             <div className="mb-3 h-16">
//                                                 <ResponsiveContainer width="100%" height="100%">
//                                                     <LineChart data={generateChartData(indicateur)}>
//                                                         <Line
//                                                             type="monotone"
//                                                             dataKey="value"
//                                                             stroke={isDarkMode ? '#60a5fa' : COLORS.primary}
//                                                             strokeWidth={2}
//                                                             dot={false}
//                                                             isAnimationActive={false}
//                                                         />
//                                                     </LineChart>
//                                                 </ResponsiveContainer>
//                                             </div>

//                                             <div className="mt-2 flex items-center justify-between">
//                                                 <div className="group relative flex items-center text-xs text-gray-500 dark:text-gray-400">
//                                                     <Info size={14} className="mr-1" />
//                                                     <span className="max-w-[180px] truncate">{indicateur.definition.substring(0, 60)}</span>
//                                                     <div className="absolute bottom-full left-0 z-10 hidden w-64 rounded bg-gray-800 p-2 text-xs text-white shadow-lg group-hover:block dark:bg-gray-700 dark:text-gray-100">
//                                                         {indicateur.definition}
//                                                     </div>
//                                                 </div>
//                                                 <button
//                                                     onClick={() => viewIndicateurDetails(indicateur)}
//                                                     className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
//                                                 >
//                                                     Détails
//                                                 </button>
//                                             </div>

//                                             {indicateur.is_calculated && (
//                                                 <div className="absolute top-2 right-2">
//                                                     <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800 dark:bg-blue-800 dark:text-blue-200">
//                                                         Calculé
//                                                     </span>
//                                                 </div>
//                                             )}
//                                         </div>
//                                     );
//                                 })}
//                             </div>

//                             {indicateursActifs.length > 1 && (
//                                 <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
//                                     <h3 className="mb-4 font-medium text-gray-700 dark:text-gray-300">Synthèse des indicateurs</h3>
//                                     <div className="h-80">
//                                         <ResponsiveContainer width="100%" height="100%">
//                                             <BarChart data={generateSummaryChartData()} layout="vertical">
//                                                 <CartesianGrid
//                                                     strokeDasharray="3 3"
//                                                     stroke={isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}
//                                                 />
//                                                 <XAxis type="number" stroke={isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)'} />
//                                                 <YAxis
//                                                     dataKey="name"
//                                                     type="category"
//                                                     width={150}
//                                                     stroke={isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)'}
//                                                 />
//                                                 <Tooltip
//                                                     formatter={(value) => formatNumber(value as number)}
//                                                     labelFormatter={(label) => `Indicateur: ${label}`}
//                                                     contentStyle={{
//                                                         backgroundColor: isDarkMode ? '#1f2937' : '#fff',
//                                                         color: isDarkMode ? '#f3f4f6' : '#333',
//                                                         border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
//                                                     }}
//                                                 />
//                                                 <Legend wrapperStyle={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)' }} />
//                                                 <Bar dataKey="valeur" name="Valeur" fill={isDarkMode ? '#60a5fa' : COLORS.primary} barSize={20} />
//                                                 <Bar dataKey="cible" name="Cible" fill={isDarkMode ? '#34d399' : COLORS.secondary} barSize={20} />
//                                             </BarChart>
//                                         </ResponsiveContainer>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     ) : (
//                         !isLoading && !error && categoriesDisponibles.length === 0 && <NoDataMessage periodeName={activePeriode} />
//                     )}
//                 </div>
//             )}

//             {/* Contenu de l'onglet détail */}
//             {activeTab === 'calculations' && !isLoading && !error && (
//                 <div className="p-4 md:p-6">
//                     <div className="mb-6 flex items-center justify-between">
//                         <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Détail des Indicateurs</h2>
//                         <div className="text-sm text-gray-600 dark:text-gray-400">
//                             Dernière mise à jour: <span>{lastUpdate.toLocaleString()}</span>
//                         </div>
//                     </div>

//                     {/* Sélecteur de période */}
//                     <div className="mb-6">
//                         <h3 className="mb-2 font-medium text-gray-700 dark:text-gray-300">Période:</h3>
//                         <div className="flex flex-wrap gap-2">
//                             {periodes.map((periode) => (
//                                 <button
//                                     key={periode}
//                                     className={`rounded-md px-3 py-2 text-sm transition-colors ${
//                                         activePeriode === periode
//                                             ? 'bg-blue-600 text-white dark:bg-blue-500 dark:text-white'
//                                             : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
//                                     }`}
//                                     onClick={() => setActivePeriode(periode)}
//                                 >
//                                     {periode}
//                                 </button>
//                             ))}
//                         </div>
//                     </div>

//                     {/* Contrôles d'affichage */}
//                     <div className="mb-6 flex flex-wrap items-center gap-4">
//                         <div className="flex items-center gap-2">
//                             <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Colonnes:</span>
//                             <label className="flex items-center gap-1">
//                                 <input
//                                     type="checkbox"
//                                     checked={visibleColumns.valeur}
//                                     onChange={() => setVisibleColumns({ ...visibleColumns, valeur: !visibleColumns.valeur })}
//                                     className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
//                                 />
//                                 <span className="text-sm text-gray-600 dark:text-gray-400">Valeur</span>
//                             </label>
//                             <label className="flex items-center gap-1">
//                                 <input
//                                     type="checkbox"
//                                     checked={visibleColumns.cible}
//                                     onChange={() => setVisibleColumns({ ...visibleColumns, cible: !visibleColumns.cible })}
//                                     className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
//                                 />
//                                 <span className="text-sm text-gray-600 dark:text-gray-400">Cible</span>
//                             </label>
//                             <label className="flex items-center gap-1">
//                                 <input
//                                     type="checkbox"
//                                     checked={visibleColumns.evolution}
//                                     onChange={() => setVisibleColumns({ ...visibleColumns, evolution: !visibleColumns.evolution })}
//                                     className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
//                                 />
//                                 <span className="text-sm text-gray-600 dark:text-gray-400">Évolution</span>
//                             </label>
//                             <label className="flex items-center gap-1">
//                                 <input
//                                     type="checkbox"
//                                     checked={visibleColumns.definition}
//                                     onChange={() => setVisibleColumns({ ...visibleColumns, definition: !visibleColumns.definition })}
//                                     className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
//                                 />
//                                 <span className="text-sm text-gray-600 dark:text-gray-400">Définition</span>
//                             </label>
//                         </div>

//                         <button
//                             className="ml-auto flex items-center gap-2 rounded-md bg-green-600 px-3 py-2 text-sm text-white transition-colors hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
//                             onClick={exportAllToExcel}
//                         >
//                             <Download size={16} />
//                             <span>Exporter tout en Excel</span>
//                         </button>
//                     </div>

//                     {/* Tableau détaillé des indicateurs */}
//                     {categoriesDisponibles.length > 0 ? (
//                         <div className="space-y-6">
//                             {categoriesDisponibles.map((categorie) => (
//                                 <div
//                                     key={categorie}
//                                     className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
//                                 >
//                                     <div
//                                         className="flex cursor-pointer items-center justify-between bg-gray-50 px-4 py-3 dark:bg-gray-700"
//                                         onClick={() => toggleCategoryExpand(categorie)}
//                                     >
//                                         <h3 className="flex items-center gap-2 font-medium text-gray-800 dark:text-gray-200">
//                                             {expandedCategories[categorie] === false ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
//                                             {categorie}
//                                         </h3>
//                                         <button
//                                             className="flex items-center gap-2 text-sm text-green-700 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
//                                             onClick={(e) => {
//                                                 e.stopPropagation();
//                                                 exportToExcel(categorie);
//                                             }}
//                                         >
//                                             <FileSpreadsheet size={16} />
//                                             <span>Exporter</span>
//                                         </button>
//                                     </div>

//                                     {expandedCategories[categorie] !== false && (
//                                         <div className="overflow-x-auto">
//                                             <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//                                                 <thead className="bg-gray-50 dark:bg-gray-700">
//                                                     <tr>
//                                                         <th
//                                                             scope="col"
//                                                             className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
//                                                         >
//                                                             Indicateur
//                                                         </th>
//                                                         {visibleColumns.valeur && (
//                                                             <th
//                                                                 scope="col"
//                                                                 className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
//                                                             >
//                                                                 Valeur
//                                                             </th>
//                                                         )}
//                                                         {visibleColumns.cible && (
//                                                             <th
//                                                                 scope="col"
//                                                                 className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
//                                                             >
//                                                                 Cible
//                                                             </th>
//                                                         )}
//                                                         {visibleColumns.evolution && (
//                                                             <th
//                                                                 scope="col"
//                                                                 className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
//                                                             >
//                                                                 Évolution
//                                                             </th>
//                                                         )}
//                                                         {visibleColumns.definition && (
//                                                             <th
//                                                                 scope="col"
//                                                                 className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
//                                                             >
//                                                                 Définition
//                                                             </th>
//                                                         )}
//                                                         <th
//                                                             scope="col"
//                                                             className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
//                                                         >
//                                                             Actions
//                                                         </th>
//                                                     </tr>
//                                                 </thead>
//                                                 <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
//                                                     {indicateursData[categorie]?.map((indicateur) => {
//                                                         // Calculer l'évolution réelle
//                                                         const evolution = calculateEvolution(indicateur.value, indicateur.metadata?.previous_value);
//                                                         const evolutionClass = getEvolutionClass(evolution);

//                                                         // Déterminer si on affiche la cible
//                                                         const showTarget = activePeriode === 'Occasionnelle' && indicateur.target !== 0;

//                                                         return (
//                                                             <tr
//                                                                 key={indicateur.id}
//                                                                 className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
//                                                             >
//                                                                 <td
//                                                                     className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-white"
//                                                                     data-label="Indicateur"
//                                                                 >
//                                                                     {indicateur.label}
//                                                                     {indicateur.is_calculated && (
//                                                                         <span className="ml-2 inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-800 dark:text-blue-200">
//                                                                             Calculé
//                                                                         </span>
//                                                                     )}
//                                                                 </td>

//                                                                 {visibleColumns.valeur && (
//                                                                     <td
//                                                                         className="px-6 py-4 text-sm whitespace-nowrap text-gray-900 dark:text-white"
//                                                                         data-label="Valeur"
//                                                                     >
//                                                                         <span className="font-medium">{formatNumber(indicateur.value)}</span>
//                                                                         {indicateur.unite && (
//                                                                             <span className="ml-1 text-gray-500 dark:text-gray-400">
//                                                                                 {indicateur.unite}
//                                                                             </span>
//                                                                         )}
//                                                                     </td>
//                                                                 )}

//                                                                 {visibleColumns.cible && showTarget && (
//                                                                     <td
//                                                                         className="px-6 py-4 text-sm whitespace-nowrap text-gray-900 dark:text-white"
//                                                                         data-label="Cible"
//                                                                     >
//                                                                         <span className="font-medium">{formatNumber(indicateur.target)}</span>
//                                                                         {indicateur.unite && (
//                                                                             <span className="ml-1 text-gray-500 dark:text-gray-400">
//                                                                                 {indicateur.unite}
//                                                                             </span>
//                                                                         )}
//                                                                     </td>
//                                                                 )}

//                                                                 {visibleColumns.evolution && (
//                                                                     <td className="px-6 py-4 whitespace-nowrap" data-label="Évolution">
//                                                                         <span
//                                                                             className={`inline-flex rounded-full px-2 py-1 text-xs leading-5 font-semibold ${
//                                                                                 evolutionClass === 'positive'
//                                                                                     ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
//                                                                                     : evolutionClass === 'negative'
//                                                                                       ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
//                                                                                       : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
//                                                                             }`}
//                                                                         >
//                                                                             {evolution}
//                                                                         </span>
//                                                                     </td>
//                                                                 )}

//                                                                 {visibleColumns.definition && (
//                                                                     <td
//                                                                         className="max-w-md px-6 py-4 text-sm text-gray-500 dark:text-gray-400"
//                                                                         data-label="Définition"
//                                                                     >
//                                                                         <div className="group relative">
//                                                                             <div className="flex cursor-help items-center gap-1">
//                                                                                 <Info size={14} />
//                                                                                 <span className="max-w-[250px] truncate underline decoration-dotted">
//                                                                                     {indicateur.definition.length > 50
//                                                                                         ? indicateur.definition.substring(0, 50) + '...'
//                                                                                         : indicateur.definition}
//                                                                                 </span>
//                                                                             </div>
//                                                                             <div className="absolute z-10 hidden w-72 rounded bg-gray-800 p-2 text-xs text-white shadow-lg group-hover:block dark:bg-gray-700 dark:text-gray-100">
//                                                                                 {indicateur.definition}
//                                                                             </div>
//                                                                         </div>
//                                                                     </td>
//                                                                 )}

//                                                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                                                                     <button
//                                                                         onClick={() => viewIndicateurDetails(indicateur)}
//                                                                         className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
//                                                                     >
//                                                                         Détails
//                                                                     </button>
//                                                                 </td>
//                                                             </tr>
//                                                         );
//                                                     })}
//                                                 </tbody>
//                                             </table>
//                                         </div>
//                                     )}
//                                 </div>
//                             ))}
//                         </div>
//                     ) : (
//                         <NoDataMessage periodeName={activePeriode} />
//                     )}
//                 </div>
//             )}

//             {/* Pied de page avec information sur la version */}
//             <div className="mt-8 border-t border-gray-200 pt-4 dark:border-gray-700">
//                 <div className="flex flex-col items-center justify-between sm:flex-row">
//                     <div className="mb-4 text-sm text-gray-600 sm:mb-0 dark:text-gray-400">
//                         <p>© {new Date().getFullYear()} - Plateforme de Suivi des Indicateurs</p>
//                         <p className="text-xs">Version 3.0.0 - Interface scalable avec gestion dynamique des indicateurs</p>
//                     </div>
//                     <div className="flex items-center space-x-3">
//                         <span className="hidden text-xs text-gray-500 sm:inline-block dark:text-gray-400">Affichage:</span>
//                         <span className="inline-block rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800 sm:hidden dark:bg-blue-900 dark:text-blue-200">
//                             Mobile
//                         </span>
//                         <span className="hidden rounded-full bg-green-100 px-2 py-1 text-xs text-green-800 sm:inline-block md:hidden dark:bg-green-900 dark:text-green-200">
//                             Tablette
//                         </span>
//                         <span className="hidden rounded-full bg-purple-100 px-2 py-1 text-xs text-purple-800 md:inline-block lg:hidden dark:bg-purple-900 dark:text-purple-200">
//                             Portable
//                         </span>
//                         <span className="hidden rounded-full bg-indigo-100 px-2 py-1 text-xs text-indigo-800 lg:inline-block dark:bg-indigo-900 dark:text-indigo-200">
//                             Grand écran
//                         </span>
//                     </div>
//                 </div>
//             </div>
//         </AppLayout>
//     );
// };

// export default Analyse;





// Import des dépendances nécessaires
import React, { useState, useEffect, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import AppLayout from '@/layouts/app-layout';
import {
    AlertCircle, ChevronDown, ChevronUp, Download, FileSpreadsheet, Info,
    Moon, RefreshCw as Refresh, Sun, X, Layers, Building2, MapPin, Users,
    Filter, Tag, Eye, Calculator, Database, BarChart3, ToggleRight, ToggleLeft,
    ChevronLeft, ChevronRight
} from 'lucide-react';
import { initDarkMode, listenForThemeChanges, toggleDarkMode } from '@/Utils/darkMode';
import { PageProps } from '@/types';

// Interfaces pour les données
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
        collecte_ids: number[];
        nombre_points_donnees: number;
        previous_value?: number;
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
    ville?: string;
    commune?: string;
}

interface Beneficiaire {
    id: number;
    nom: string;
    prenom: string;
    type_beneficiaire?: string;
}

interface AnalyseProps extends PageProps {
    exercices: Exercice[];
    entreprises: Entreprise[];
    defaultExerciceId: number | null;
    defaultPeriodeType: string;
    periodes: string[];
    beneficiaires?: Beneficiaire[];
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
    calculated: '#9b59b6',
    basic: '#34495e'
};

const Analyse: React.FC<AnalyseProps> = ({ auth, exercices, entreprises, defaultExerciceId, defaultPeriodeType, periodes, beneficiaires = [] }) => {
    // États pour le thème
    const [isDarkMode, setIsDarkMode] = useState<boolean>(() => initDarkMode());

    // États principaux
    const [activeTab, setActiveTab] = useState<'analysis' | 'allIndicators'>('analysis');
    const [activePeriode, setActivePeriode] = useState<string>(defaultPeriodeType);
    const [activeCategorie, setActiveCategorie] = useState<string>('');
    const [selectedExerciceId, setSelectedExerciceId] = useState<number | null>(defaultExerciceId);
    const [selectedEntrepriseId, setSelectedEntrepriseId] = useState<number | null>(null);
    const [selectedBeneficiaireId, setSelectedBeneficiaireId] = useState<number | null>(null);

    // Nouveaux états pour la vue complète des indicateurs
    const [showCalculatedOnly, setShowCalculatedOnly] = useState<boolean>(false);
    const [showBasicOnly, setShowBasicOnly] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [sortField, setSortField] = useState<'label' | 'value' | 'target' | 'evolution'>('label');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(20);

    // États existants
    const [selectedRegion, setSelectedRegion] = useState<string>('');
    const [selectedCommune, setSelectedCommune] = useState<string>('');
    const [selectedSecteur, setSelectedSecteur] = useState<string>('');
    const [selectedBeneficiaireType, setSelectedBeneficiaireType] = useState<string>('');
    const [indicateursData, setIndicateursData] = useState<IndicateursParCategorie>({});
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
    const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);
    const [visibleColumns, setVisibleColumns] = useState({
        valeur: true,
        cible: true,
        evolution: true,
        definition: true,
        calculated: true,
        actions: true
    });

    // Vérifier si on est en mode occasionnelle
    const isOccasionnelle = useMemo(() => {
        return activePeriode === 'Occasionnelle';
    }, [activePeriode]);

    // Extraction des valeurs uniques pour les filtres
    const regions = useMemo(() => {
        const uniqueRegions = Array.from(new Set(entreprises.map(e => e.ville).filter(Boolean)));
        return uniqueRegions;
    }, [entreprises]);

    const communes = useMemo(() => {
        const uniqueCommunes = Array.from(new Set(entreprises.map(e => e.commune).filter(Boolean)));
        return uniqueCommunes;
    }, [entreprises]);

    const secteurs = useMemo(() => {
        const uniqueSecteurs = Array.from(new Set(entreprises.map(e => e.secteur_activite).filter(Boolean)));
        return uniqueSecteurs;
    }, [entreprises]);

    const beneficiaireTypes = useMemo(() => {
        const uniqueTypes = Array.from(new Set(beneficiaires.map(b => b.type_beneficiaire).filter(Boolean)));
        return uniqueTypes;
    }, [beneficiaires]);

    // Écouter les changements de préférence système pour le mode sombre
    useEffect(() => {
        listenForThemeChanges((isDark) => {
            setIsDarkMode(isDark);
        });
    }, []);

    // Fonction pour basculer le mode sombre
    const handleToggleDarkMode = () => {
        const newDarkMode = !isDarkMode;
        toggleDarkMode(newDarkMode);
        setIsDarkMode(newDarkMode);
    };

    // Fonction pour formater des nombres
    const formatNumber = (num: number): string => {
        if (typeof num !== 'number') return String(num);
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    };

    // Récupérer les données quand les filtres changent
    useEffect(() => {
        fetchIndicateursData();
    }, [activePeriode, selectedExerciceId, selectedEntrepriseId, selectedBeneficiaireId, selectedRegion, selectedCommune, selectedSecteur, selectedBeneficiaireType]);

    // Fonction pour récupérer les données
    const fetchIndicateursData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const params: any = {
                periode_type: activePeriode,
                exercice_id: selectedExerciceId,
            };

            // Pour les collectes occasionnelles, utiliser beneficiaire_id au lieu d'entreprise_id
            if (isOccasionnelle) {
                if (selectedBeneficiaireId) {
                    params.beneficiaire_id = selectedBeneficiaireId;
                }
            } else {
                if (selectedEntrepriseId) {
                    params.entreprise_id = selectedEntrepriseId;
                }
            }

            // Ajouter les filtres avancés s'ils sont sélectionnés
            if (selectedRegion) params.region = selectedRegion;
            if (selectedCommune) params.commune = selectedCommune;
            if (selectedSecteur) params.secteur = selectedSecteur;
            if (selectedBeneficiaireType) params.beneficiaire_type = selectedBeneficiaireType;

            const response = await axios.get('/api/indicateurs/analyse', {
                params,
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

    // Calcul des catégories et indicateurs disponibles
    const categoriesDisponibles = useMemo(() => {
        return Object.keys(indicateursData);
    }, [indicateursData]);

    const indicateursActifs = useMemo(() => {
        if (!activeCategorie || !indicateursData[activeCategorie]) return [];
        return indicateursData[activeCategorie];
    }, [indicateursData, activeCategorie]);

    // Calcul de tous les indicateurs avec filtre et tri pour le nouvel onglet
    const allIndicatorsData = useMemo(() => {
        let indicators: (Indicateur & { categorie: string })[] = [];

        // Collecter tous les indicateurs de toutes les catégories
        Object.entries(indicateursData).forEach(([categorie, indicateurs]) => {
            indicateurs.forEach(indicateur => {
                indicators.push({
                    ...indicateur,
                    categorie
                });
            });
        });

        // Appliquer les filtres
        indicators = indicators.filter(ind => {
            if (showCalculatedOnly && !ind.is_calculated) return false;
            if (showBasicOnly && ind.is_calculated) return false;

            if (selectedCategory !== 'all' && ind.categorie !== selectedCategory) return false;

            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                return ind.label.toLowerCase().includes(term) ||
                       ind.definition.toLowerCase().includes(term) ||
                       ind.categorie.toLowerCase().includes(term);
            }

            return true;
        });

        // Appliquer le tri
        indicators.sort((a, b) => {
            let aVal: any, bVal: any;

            switch (sortField) {
                case 'label':
                    aVal = a.label.toLowerCase();
                    bVal = b.label.toLowerCase();
                    break;
                case 'value':
                    aVal = a.value;
                    bVal = b.value;
                    break;
                case 'target':
                    aVal = a.target;
                    bVal = b.target;
                    break;
                case 'evolution':
                    aVal = calculateEvolution(a.value, a.metadata?.previous_value);
                    bVal = calculateEvolution(b.value, b.metadata?.previous_value);
                    break;
                default:
                    aVal = 0;
                    bVal = 0;
            }

            if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        return indicators;
    }, [indicateursData, showCalculatedOnly, showBasicOnly, selectedCategory, searchTerm, sortField, sortDirection]);

    // Pagination pour le tableau de tous les indicateurs
    const paginatedIndicators = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return allIndicatorsData.slice(startIndex, startIndex + itemsPerPage);
    }, [allIndicatorsData, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(allIndicatorsData.length / itemsPerPage);

    // Fonction pour exporter vers Excel
    const exportToExcel = (categorie: string) => {
        const params = new URLSearchParams({
            periode_type: activePeriode,
            categorie: categorie,
        });

        if (selectedExerciceId) params.append('exercice_id', selectedExerciceId.toString());

        // Pour les collectes occasionnelles, utiliser beneficiaire_id
        if (isOccasionnelle) {
            if (selectedBeneficiaireId) params.append('beneficiaire_id', selectedBeneficiaireId.toString());
        } else {
            if (selectedEntrepriseId) params.append('entreprise_id', selectedEntrepriseId.toString());
        }

        if (selectedRegion) params.append('region', selectedRegion);
        if (selectedCommune) params.append('commune', selectedCommune);
        if (selectedSecteur) params.append('secteur', selectedSecteur);
        if (selectedBeneficiaireType) params.append('beneficiaire_type', selectedBeneficiaireType);

        window.location.href = `/api/indicateurs/export-excel?${params.toString()}`;
    };

    // Fonction pour basculer l'expansion des catégories
    const toggleCategoryExpand = (categorie: string) => {
        setExpandedCategories((prev) => ({
            ...prev,
            [categorie]: !prev[categorie],
        }));
    };

    // Calculer l'évolution d'un indicateur
    const calculateEvolution = (currentValue: number, previousValue?: number): string => {
        if (previousValue === undefined || previousValue === 0) {
            return 'N/A';
        }

        const evolution = ((currentValue - previousValue) / previousValue) * 100;
        const sign = evolution >= 0 ? '+' : '';
        return `${sign}${evolution.toFixed(1)}%`;
    };

    // Déterminer la classe CSS pour l'évolution
    const getEvolutionClass = (evolutionText: string) => {
        if (evolutionText === 'N/A') return 'text-gray-600 dark:text-gray-400';
        const evolutionValue = parseFloat(evolutionText.replace('+', '').replace('%', ''));

        if (evolutionValue > 0) return 'text-green-600 dark:text-green-400';
        if (evolutionValue < 0) return 'text-red-600 dark:text-red-400';
        return 'text-gray-600 dark:text-gray-400';
    };

    // Fonction pour voir les détails d'un indicateur
    const viewIndicateurDetails = (indicateur: Indicateur) => {
        // Ne montrer les détails que pour les indicateurs non calculés
        if (indicateur.is_calculated) {
            return;
        }

        const params = new URLSearchParams({
            categorie: activeCategorie,
            periode_type: activePeriode
        });

        if (selectedExerciceId) {
            params.append('exercice_id', selectedExerciceId.toString());
        }

        // Ajouter le bon ID selon la période
        if (isOccasionnelle) {
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

    // Réinitialiser les filtres
    const resetFilters = () => {
        setSelectedExerciceId(null);
        setSelectedEntrepriseId(null);
        setSelectedBeneficiaireId(null);
        setSelectedRegion('');
        setSelectedCommune('');
        setSelectedSecteur('');
        setSelectedBeneficiaireType('');
    };

    // Réinitialiser les filtres spécifiques quand on change de période
    useEffect(() => {
        if (!isOccasionnelle) {
            setSelectedBeneficiaireId(null);
        } else {
            setSelectedEntrepriseId(null);
        }
    }, [isOccasionnelle]);

    // Fonction pour gérer le tri
    const handleSort = (field: typeof sortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    return (
        <AppLayout
            title="Tableau de Bord des Indicateurs"
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl leading-tight font-semibold text-gray-800 dark:text-gray-100">Tableau de Bord des Indicateurs</h2>
                    <button
                        onClick={handleToggleDarkMode}
                        className="rounded-full bg-gray-200 p-2 text-gray-800 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                        aria-label={isDarkMode ? 'Passer au mode clair' : 'Passer au mode sombre'}
                    >
                        {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                </div>
            }
        >
            <Head title="Analyse des Indicateurs" />

            {/* En-tête principal */}
            <div className="bg-gradient-to-r from-blue-800 to-blue-600 p-4 text-white md:p-6 dark:from-blue-900 dark:to-blue-700">
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
                            <Layers size={16} />
                            <span className="hidden md:inline">Interface avancée</span>
                        </Link>
                        <button
                            onClick={() => fetchIndicateursData()}
                            className="flex items-center gap-2 rounded-md bg-white/20 px-3 py-2 text-sm text-white transition-colors hover:bg-white/30"
                            aria-label="Actualiser les données"
                        >
                            <Refresh size={16} className={isLoading ? 'animate-spin' : ''} />
                            <span className="hidden md:inline">Actualiser</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Filtres principaux */}
            <div className="border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                <div className="flex flex-wrap items-center gap-4">
                    {/* Sélecteur d'exercice */}
                    <div className="w-full md:w-auto">
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Exercice</label>
                        <select
                            value={selectedExerciceId || ''}
                            onChange={(e) => setSelectedExerciceId(e.target.value ? parseInt(e.target.value) : null)}
                            className="block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
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
                    <div className="w-full md:w-auto">
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {isOccasionnelle ? 'Bénéficiaire' : 'Entreprise'}
                        </label>

                        {isOccasionnelle ? (
                            <select
                                value={selectedBeneficiaireId || ''}
                                onChange={(e) => setSelectedBeneficiaireId(e.target.value ? parseInt(e.target.value) : null)}
                                className="block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                            >
                                <option value="">Tous les bénéficiaires</option>
                                {beneficiaires.map((beneficiaire) => (
                                    <option key={beneficiaire.id} value={beneficiaire.id}>
                                        {beneficiaire.nom} {beneficiaire.prenom}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <select
                                value={selectedEntrepriseId || ''}
                                onChange={(e) => setSelectedEntrepriseId(e.target.value ? parseInt(e.target.value) : null)}
                                className="block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
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

                    {/* Bouton filtres avancés */}
                    <div className="ml-auto">
                        <button
                            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                            className="flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm text-white transition-colors hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                        >
                            <Filter size={16} />
                            <span>Filtres avancés</span>
                            {showAdvancedFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                    </div>
                </div>

                {/* Filtres avancés */}
                {showAdvancedFilters && (
                    <div className="mt-4 grid grid-cols-1 gap-4 border-t border-gray-200 pt-4 dark:border-gray-700 md:grid-cols-2 lg:grid-cols-4">
                        {/* Filtre Région */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                <MapPin className="inline mr-1 h-4 w-4" />
                                Région / Ville
                            </label>
                            <select
                                value={selectedRegion}
                                onChange={(e) => setSelectedRegion(e.target.value)}
                                className="block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                            >
                                <option value="">Toutes les régions</option>
                                {regions.map((region) => (
                                    <option key={region} value={region}>
                                        {region}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Filtre Commune */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                <Building2 className="inline mr-1 h-4 w-4" />
                                Commune
                            </label>
                            <select
                                value={selectedCommune}
                                onChange={(e) => setSelectedCommune(e.target.value)}
                                className="block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                            >
                                <option value="">Toutes les communes</option>
                                {communes.map((commune) => (
                                    <option key={commune} value={commune}>
                                        {commune}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Filtre Secteur */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                <Tag className="inline mr-1 h-4 w-4" />
                                Secteur d'activité
                            </label>
                            <select
                                value={selectedSecteur}
                                onChange={(e) => setSelectedSecteur(e.target.value)}
                                className="block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                            >
                                <option value="">Tous les secteurs</option>
                                {secteurs.map((secteur) => (
                                    <option key={secteur} value={secteur}>
                                        {secteur}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Filtre Type de bénéficiaire */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                <Users className="inline mr-1 h-4 w-4" />
                                Type de bénéficiaire
                            </label>
                            <select
                                value={selectedBeneficiaireType}
                                onChange={(e) => setSelectedBeneficiaireType(e.target.value)}
                                className="block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                            >
                                <option value="">Tous les types</option>
                                {beneficiaireTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                {/* Indicateur des filtres actifs et bouton reset */}
                {(selectedExerciceId || selectedEntrepriseId || selectedBeneficiaireId || selectedRegion || selectedCommune || selectedSecteur || selectedBeneficiaireType) && (
                    <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
                        <div className="flex flex-wrap gap-2">
                            {selectedExerciceId && (
                                <span className="inline-flex items-center rounded-md bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                    Exercice: {exercices.find(e => e.id === selectedExerciceId)?.annee}
                                </span>
                            )}
                            {selectedEntrepriseId && (
                                <span className="inline-flex items-center rounded-md bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                                    Entreprise: {entreprises.find(e => e.id === selectedEntrepriseId)?.nom_entreprise}
                                </span>
                            )}
                            {selectedBeneficiaireId && (
                                <span className="inline-flex items-center rounded-md bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                                    Bénéficiaire: {beneficiaires.find(b => b.id === selectedBeneficiaireId)?.nom} {beneficiaires.find(b => b.id === selectedBeneficiaireId)?.prenom}
                                </span>
                            )}
                            {selectedRegion && (
                                <span className="inline-flex items-center rounded-md bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                    Région: {selectedRegion}
                                </span>
                            )}
                            {selectedCommune && (
                                <span className="inline-flex items-center rounded-md bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                                    Commune: {selectedCommune}
                                </span>
                            )}
                            {selectedSecteur && (
                                <span className="inline-flex items-center rounded-md bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                                    Secteur: {selectedSecteur}
                                </span>
                            )}
                            {selectedBeneficiaireType && (
                                <span className="inline-flex items-center rounded-md bg-pink-100 px-2.5 py-0.5 text-xs font-medium text-pink-800 dark:bg-pink-900 dark:text-pink-200">
                                    Type: {selectedBeneficiaireType}
                                </span>
                            )}
                        </div>
                        <button
                            onClick={resetFilters}
                            className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                            <X size={14} />
                            <span>Réinitialiser</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Onglets */}
            <div className="flex border-b border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
                <button
                    className={`px-4 py-3 font-medium transition-colors ${activeTab === 'analysis' ? 'border-b-2 border-blue-600 bg-white text-blue-600 dark:border-blue-500 dark:bg-gray-900 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}
                    onClick={() => setActiveTab('analysis')}
                >
                    <div className="flex items-center gap-2">
                        <BarChart3 size={16} />
                        Analyse & Visualisation
                    </div>
                </button>
                <button
                    className={`px-4 py-3 font-medium transition-colors ${activeTab === 'allIndicators' ? 'border-b-2 border-blue-600 bg-white text-blue-600 dark:border-blue-500 dark:bg-gray-900 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}
                    onClick={() => setActiveTab('allIndicators')}
                >
                    <div className="flex items-center gap-2">
                        <Database size={16} />
                        Tous les Indicateurs
                    </div>
                </button>
            </div>

            {/* État de chargement */}
            {isLoading && (
                <div className="flex h-64 items-center justify-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
                </div>
            )}

            {/* Affichage des erreurs */}
            {error && !isLoading && (
                <div className="mx-4 my-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700 dark:border-red-600 dark:bg-red-900/20 dark:text-red-400">
                    <p className="font-medium">Erreur</p>
                    <p>{error}</p>
                    <button
                        onClick={fetchIndicateursData}
                        className="mt-2 rounded bg-red-200 px-3 py-1 text-sm text-red-800 hover:bg-red-300 dark:bg-red-800 dark:text-red-200 dark:hover:bg-red-700"
                    >
                        Réessayer
                    </button>
                </div>
            )}

            {/* Contenu de l'onglet d'analyse */}
            {activeTab === 'analysis' && !isLoading && !error && (
                <div className="p-4 md:p-6">
                    {/* Sélecteur de période */}
                    <div className="mb-6">
                        <h3 className="mb-2 font-medium text-gray-700 dark:text-gray-300">Période:</h3>
                        <div className="flex flex-wrap gap-2">
                            {periodes.map((periode) => (
                                <button
                                    key={periode}
                                    className={`rounded-md px-3 py-2 text-sm transition-colors ${
                                        activePeriode === periode
                                            ? 'bg-blue-600 text-white dark:bg-blue-500 dark:text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
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
                            <h3 className="mb-2 font-medium text-gray-700 dark:text-gray-300">Catégorie:</h3>
                            <div className="flex flex-wrap gap-2">
                                {categoriesDisponibles.map((categorie) => (
                                    <button
                                        key={categorie}
                                        className={`rounded-md px-3 py-2 text-sm transition-colors ${
                                            activeCategorie === categorie
                                                ? 'bg-blue-600 text-white dark:bg-blue-500 dark:text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                        }`}
                                        onClick={() => setActiveCategorie(categorie)}
                                    >
                                        {categorie.length > 30 ? categorie.substring(0, 30) + '...' : categorie}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="mb-6 rounded-lg border-l-4 border-yellow-400 bg-yellow-50 p-6 shadow-sm dark:border-yellow-600 dark:bg-yellow-900/20">
                            <div className="flex flex-col sm:flex-row">
                                <div className="mb-4 flex-shrink-0 sm:mr-4 sm:mb-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400 dark:text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-300">Aucune donnée disponible</h3>
                                    <div className="mt-2 text-yellow-700 dark:text-yellow-400">
                                        <p>Aucune donnée n'a été trouvée pour les critères sélectionnés.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Contenu principal */}
                    {!isLoading && !error && activeCategorie && indicateursActifs.length > 0 && (
                        <div>
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="border-l-4 border-blue-500 pl-3 text-lg font-semibold text-gray-800 dark:text-gray-200">
                                    {activeCategorie}
                                </h2>
                                <button
                                    className="flex items-center gap-2 rounded-md bg-green-600 px-3 py-2 text-sm text-white transition-colors hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                                    onClick={() => exportToExcel(activeCategorie)}
                                >
                                    <Download size={16} />
                                    <span>Exporter Excel</span>
                                </button>
                            </div>

                            <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {indicateursActifs.map((indicateur, index) => {
                                    const evolution = calculateEvolution(indicateur.value, indicateur.metadata?.previous_value);
                                    const evolutionClass = getEvolutionClass(evolution);

                                    return (
                                        <div
                                            key={`${indicateur.id}-${indicateur.label}-${index}`}
                                            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                                        >
                                            <div className="mb-3 flex items-center justify-between">
                                                <h3 className="font-medium text-gray-700 dark:text-gray-300" title={indicateur.label}>
                                                    {indicateur.label.length > 25 ? indicateur.label.substring(0, 25) + '...' : indicateur.label}
                                                </h3>
                                                {evolution !== 'N/A' && (
                                                    <span
                                                        className={`rounded-full px-2 py-1 text-xs font-semibold ${evolutionClass}`}
                                                    >
                                                        {evolution}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="mb-2">
                                                <span className="text-lg font-bold text-gray-800 dark:text-gray-200">
                                                    {formatNumber(indicateur.value)}
                                                </span>
                                                {indicateur.unite && (
                                                    <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">{indicateur.unite}</span>
                                                )}
                                            </div>

                                            <div className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                                                Cible: {formatNumber(indicateur.target)} {indicateur.unite}
                                            </div>

                                            <div className="mb-3 h-16">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <LineChart data={[
                                                        { name: 'Baseline', value: indicateur.target * 0.8 },
                                                        { name: 'Cible', value: indicateur.target },
                                                        { name: 'Actuel', value: indicateur.value }
                                                    ]}>
                                                        <Line
                                                            type="monotone"
                                                            dataKey="value"
                                                            stroke={isDarkMode ? '#60a5fa' : COLORS.primary}
                                                            strokeWidth={2}
                                                            dot={false}
                                                            isAnimationActive={false}
                                                        />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>

                                            <div className="mt-2 flex items-center justify-between">
                                                <div className="group relative flex items-center text-xs text-gray-500 dark:text-gray-400">
                                                    <Info size={14} className="mr-1" />
                                                    <span className="max-w-[180px] truncate">{indicateur.definition.substring(0, 60)}</span>
                                                    <div className="absolute bottom-full left-0 z-10 hidden w-64 rounded bg-gray-800 p-2 text-xs text-white shadow-lg group-hover:block dark:bg-gray-700 dark:text-gray-100">
                                                        {indicateur.definition}
                                                    </div>
                                                </div>
                                                {!indicateur.is_calculated ? (
                                                    <button
                                                        onClick={() => viewIndicateurDetails(indicateur)}
                                                        className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                                    >
                                                        Détails
                                                    </button>
                                                ) : (
                                                    <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                                                        <Calculator size={10} />
                                                        Calculé
                                                    </span>
                                                )}
                                            </div>

                                            {indicateur.is_calculated && (
                                                <div className="absolute top-2 right-2">
                                                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800 dark:bg-blue-800 dark:text-blue-200">
                                                        Calculé
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Nouvel onglet pour tous les indicateurs */}
            {activeTab === 'allIndicators' && !isLoading && !error && (
                <div className="p-4 md:p-6">
                    {/* En-tête et contrôles */}
                    <div className="mb-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Tous les Indicateurs</h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Vue d'ensemble de tous les indicateurs disponibles
                                </p>
                            </div>
                            <div className="mt-4 sm:mt-0 flex items-center gap-2">
                                <button
                                    onClick={() => exportToExcel('')}
                                    className="flex items-center gap-2 rounded-md bg-green-600 px-3 py-2 text-sm text-white transition-colors hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                                >
                                    <Download size={16} />
                                    <span className="hidden sm:inline">Exporter tout</span>
                                    <span className="sm:hidden">Export</span>
                                </button>
                            </div>
                        </div>

                        {/* Filtres pour l'onglet tous les indicateurs */}
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Recherche */}
                                <div className="lg:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Rechercher
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Nom, définition ou catégorie..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Filtre de catégorie */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Catégorie
                                    </label>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="all">Toutes les catégories</option>
                                        {categoriesDisponibles.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat.length > 30 ? cat.substring(0, 30) + '...' : cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Filtre calculé/non calculé */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Type d'indicateur
                                    </label>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setShowCalculatedOnly(!showCalculatedOnly);
                                                setShowBasicOnly(false);
                                            }}
                                            className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-md text-xs transition-colors ${
                                                showCalculatedOnly
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                            }`}
                                        >
                                            <Calculator size={12} />
                                            Calculés
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowBasicOnly(!showBasicOnly);
                                                setShowCalculatedOnly(false);
                                            }}
                                            className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-md text-xs transition-colors ${
                                                showBasicOnly
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                            }`}
                                        >
                                            <Database size={12} />
                                            Saisis
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Statistiques */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                <div className="text-sm text-gray-600 dark:text-gray-400">Total indicateurs</div>
                                <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                    {allIndicatorsData.length}
                                </div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                <div className="text-sm text-gray-600 dark:text-gray-400">Indicateurs saisis</div>
                                <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                    {allIndicatorsData.filter(ind => !ind.is_calculated).length}
                                </div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                <div className="text-sm text-gray-600 dark:text-gray-400">Indicateurs calculés</div>
                                <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                    {allIndicatorsData.filter(ind => ind.is_calculated).length}
                                </div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                <div className="text-sm text-gray-600 dark:text-gray-400">Catégories</div>
                                <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                    {categoriesDisponibles.length}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tableau de tous les indicateurs */}
                    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th
                                            onClick={() => handleSort('label')}
                                            className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                        >
                                            <div className="flex items-center gap-1">
                                                Indicateur
                                                {sortField === 'label' && (
                                                    sortDirection === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                                                )}
                                            </div>
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                            Catégorie
                                        </th>
                                        <th
                                            onClick={() => handleSort('value')}
                                            className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                        >
                                            <div className="flex items-center gap-1">
                                                Valeur
                                                {sortField === 'value' && (
                                                    sortDirection === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                                                )}
                                            </div>
                                        </th>
                                        {visibleColumns.cible && (
                                            <th
                                                onClick={() => handleSort('target')}
                                                className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                            >
                                                <div className="flex items-center gap-1">
                                                    Cible
                                                    {sortField === 'target' && (
                                                        sortDirection === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                                                    )}
                                                </div>
                                            </th>
                                        )}
                                        {visibleColumns.evolution && (
                                            <th
                                                onClick={() => handleSort('evolution')}
                                                className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                            >
                                                <div className="flex items-center gap-1">
                                                    Évolution
                                                    {sortField === 'evolution' && (
                                                        sortDirection === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                                                    )}
                                                </div>
                                            </th>
                                        )}
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                            Type
                                        </th>
                                        {visibleColumns.definition && (
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                                Définition
                                            </th>
                                        )}
                                        {visibleColumns.actions && (
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                                Actions
                                            </th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                                    {paginatedIndicators.map((indicateur) => {
                                        const evolution = calculateEvolution(indicateur.value, indicateur.metadata?.previous_value);
                                        const evolutionClass = getEvolutionClass(evolution);

                                        return (
                                            <tr
                                                key={`${indicateur.id}-${indicateur.categorie}`}
                                                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                    <div className="flex items-center gap-2">
                                                        {indicateur.is_calculated && (
                                                            <Calculator size={14} className="text-blue-500 dark:text-blue-400" />
                                                        )}
                                                        {indicateur.label}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                    <span className="rounded-full bg-gray-100 dark:bg-gray-700 px-2 py-1 text-xs">
                                                        {indicateur.categorie.length > 30 ? indicateur.categorie.substring(0, 30) + '...' : indicateur.categorie}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                    <span className="font-medium">{formatNumber(indicateur.value)}</span>
                                                    {indicateur.unite && (
                                                        <span className="ml-1 text-gray-500 dark:text-gray-400">
                                                            {indicateur.unite}
                                                        </span>
                                                    )}
                                                </td>
                                                {visibleColumns.cible && (
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                        {indicateur.target !== 0 ? (
                                                            <>
                                                                <span className="font-medium">{formatNumber(indicateur.target)}</span>
                                                                {indicateur.unite && (
                                                                    <span className="ml-1 text-gray-500 dark:text-gray-400">
                                                                        {indicateur.unite}
                                                                    </span>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <span className="text-gray-400 dark:text-gray-500">N/D</span>
                                                        )}
                                                    </td>
                                                )}
                                                {visibleColumns.evolution && (
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex rounded-full px-2 py-1 text-xs leading-5 font-semibold ${evolutionClass}`}>
                                                            {evolution}
                                                        </span>
                                                    </td>
                                                )}
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                    {indicateur.is_calculated ? (
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 dark:bg-purple-900 px-2 py-1 text-xs font-medium text-purple-800 dark:text-purple-200">
                                                            <Calculator size={10} />
                                                            Calculé
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 dark:bg-green-900 px-2 py-1 text-xs font-medium text-green-800 dark:text-green-200">
                                                            <Database size={10} />
                                                            Saisi
                                                        </span>
                                                    )}
                                                </td>
                                                {visibleColumns.definition && (
                                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-md">
                                                        <div className="group relative">
                                                            <div className="cursor-help">
                                                                <span className="inline-block max-w-[200px] truncate">
                                                                    {indicateur.definition.length > 50
                                                                        ? indicateur.definition.substring(0, 50) + '...'
                                                                        : indicateur.definition}
                                                                </span>
                                                            </div>
                                                            <div className="absolute z-10 hidden w-72 rounded bg-gray-800 p-2 text-xs text-white shadow-lg group-hover:block dark:bg-gray-700 dark:text-gray-100 bottom-full left-1/2 transform -translate-x-1/2 mb-2">
                                                                {indicateur.definition}
                                                            </div>
                                                        </div>
                                                    </td>
                                                )}
                                                {visibleColumns.actions && (
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        {!indicateur.is_calculated ? (
                                                            <button
                                                                onClick={() => viewIndicateurDetails(indicateur)}
                                                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                                                            >
                                                                <Eye size={14} />
                                                                Détails
                                                            </button>
                                                        ) : (
                                                            <span className="text-gray-400 dark:text-gray-500">—</span>
                                                        )}
                                                    </td>
                                                )}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div className="text-sm text-gray-700 dark:text-gray-300">
                                        Affichage de {(currentPage - 1) * itemsPerPage + 1} à{' '}
                                        {Math.min(currentPage * itemsPerPage, allIndicatorsData.length)} sur{' '}
                                        {allIndicatorsData.length} résultat{allIndicatorsData.length > 1 ? 's' : ''}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1">
                                            <select
                                                value={itemsPerPage}
                                                onChange={(e) => {
                                                    setItemsPerPage(Number(e.target.value));
                                                    setCurrentPage(1);
                                                }}
                                                className="rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm focus:border-blue-500 focus:ring-blue-500"
                                            >
                                                <option value={10}>10</option>
                                                <option value={20}>20</option>
                                                <option value={50}>50</option>
                                                <option value={100}>100</option>
                                            </select>
                                            <span className="text-sm text-gray-700 dark:text-gray-300">par page</span>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                                disabled={currentPage === 1}
                                                className="p-2 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                <ChevronLeft size={16} />
                                            </button>

                                            <span className="text-sm text-gray-700 dark:text-gray-300 min-w-[120px] text-center">
                                                Page {currentPage} sur {totalPages}
                                            </span>

                                            <button
                                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                                disabled={currentPage === totalPages}
                                                className="p-2 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                <ChevronRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Contrôles des colonnes visibles */}
                    <div className="mt-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Colonnes visibles</h3>
                        <div className="flex flex-wrap gap-4">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={visibleColumns.cible}
                                    onChange={() => setVisibleColumns({...visibleColumns, cible: !visibleColumns.cible})}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                                />
                                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Cible</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={visibleColumns.evolution}
                                    onChange={() => setVisibleColumns({...visibleColumns, evolution: !visibleColumns.evolution})}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                                />
                                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Évolution</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={visibleColumns.definition}
                                    onChange={() => setVisibleColumns({...visibleColumns, definition: !visibleColumns.definition})}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                                />
                                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Définition</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={visibleColumns.actions}
                                    onChange={() => setVisibleColumns({...visibleColumns, actions: !visibleColumns.actions})}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                                />
                                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Actions</span>
                            </label>
                        </div>
                    </div>
                </div>
            )}

            {/* Pied de page avec information sur la version */}
            <div className="mt-8 border-t border-gray-200 pt-4 dark:border-gray-700">
                <div className="flex flex-col items-center justify-between sm:flex-row">
                    <div className="mb-4 text-sm text-gray-600 sm:mb-0 dark:text-gray-400">
                        <p>© {new Date().getFullYear()} - Plateforme de Suivi des Indicateurs</p>
                        <p className="text-xs">Version 3.1.0 - Vue complète des indicateurs avec filtres avancés</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <span className="hidden text-xs text-gray-500 sm:inline-block dark:text-gray-400">Affichage:</span>
                        <span className="inline-block rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800 sm:hidden dark:bg-blue-900 dark:text-blue-200">
                            Mobile
                        </span>
                        <span className="hidden rounded-full bg-green-100 px-2 py-1 text-xs text-green-800 sm:inline-block md:hidden dark:bg-green-900 dark:text-green-200">
                            Tablette
                        </span>
                        <span className="hidden rounded-full bg-purple-100 px-2 py-1 text-xs text-purple-800 md:inline-block lg:hidden dark:bg-purple-900 dark:text-purple-200">
                            Portable
                        </span>
                        <span className="hidden rounded-full bg-indigo-100 px-2 py-1 text-xs text-indigo-800 lg:inline-block dark:bg-indigo-900 dark:text-indigo-200">
                            Grand écran
                        </span>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Analyse;
