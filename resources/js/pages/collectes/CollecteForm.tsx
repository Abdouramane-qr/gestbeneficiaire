

// import React, { useState, useEffect, useMemo, useCallback } from 'react';
// import { Link, router, useForm } from '@inertiajs/react';
// import { toast } from 'sonner';
// import { useOfflineStorage } from '@/hooks/useOfflineStorage';

// import { IndicateurCalculator, PeriodeName } from '@/Utils/IndicateurCalculator';
// import { ArrowLeftIcon, SaveIcon, WifiOffIcon, RefreshCcw, MoonIcon, SunIcon, CalculatorIcon, LockIcon, AlertCircleIcon, CheckCircleIcon } from 'lucide-react';
// import { PeriodeNameGenerator } from '@/Utils/PeriodeNameGenerator';
// import { Periode } from '@/Utils/periodeTypes';

// interface Entreprise {
//     id: number;
//     nom_entreprise: string;
// }

// interface Exercice {
//     id: number;
//     annee: number;
//     date_debut: string;
//     date_fin: string;
//     actif: boolean;
// }

// interface Promoteur {
//     id: number;
//     nom: string;
//     prenom: string;
//     contact: string;
// }

// interface ONG {
//     id: number;
//     nom: string;
//     sigle: string;
// }

// interface CollecteFormProps {
//     entreprises: Entreprise[];
//     exercices: Exercice[];
//     periodes: Periode[];
//     collectes?: { periode_id: number }[];
//     promoteurs?: Promoteur[];
//     ong?: ONG;
//     userType?: 'admin' | 'ong' | 'coach';
//     collecte?: {
//         id?: number;
//         entreprise_id: number;
//         exercice_id: number;
//         periode_id: number;
//         date_collecte: string;
//         donnees: Record<string, any> | string;
//         type_collecte: 'standard' | 'brouillon';
//         promoteur_id?: number;
//         ong_id?: number;
//     };
//     isEditing?: boolean;
//     preselectedPeriode?: number;
//     dependenciesData?: Record<string, Record<string, Record<string, any>>>;
// }

// const CollecteForm: React.FC<CollecteFormProps> = ({
//     entreprises,
//     exercices,
//     periodes,
//     collectes = [],
//     promoteurs = [],
//     ong = undefined,
//     userType = 'admin',
//     collecte,
//     isEditing = false,
//     preselectedPeriode,
//     dependenciesData = {},
// }) => {
//     // State initialization
//     const [isDraft, setIsDraft] = useState(isEditing && collecte?.type_collecte === 'brouillon');
//     const [step, setStep] = useState(1);
//     const [activeCategory, setActiveCategory] = useState('');
//     const [selectedPeriodeType, setSelectedPeriodeType] = useState('');
//     const [isOnline, setIsOnline] = useState(navigator.onLine);
//     const [availableCategories, setAvailableCategories] = useState<{id: string, label: string}[]>([]);
//     const [darkMode, setDarkMode] = useState(() => {
//         const saved = localStorage.getItem('darkMode');
//         return saved ? JSON.parse(saved) : false;
//     });
//     const { saveOffline, pendingUploads, syncData } = useOfflineStorage();
//     const [allData] = useState<Record<string, Record<string, Record<string, any>>>>(dependenciesData);

//     const canAutoCalculate = (indicator: any): boolean => {
//         if (!indicator.isCalculated || !indicator.dependencies) return false;
//         return IndicateurCalculator.checkDependenciesAvailability(indicator, allData);
//     };

//     // Form initialization
//     const initialDonnees = useMemo(() => {
//         return isEditing && collecte?.donnees
//             ? typeof collecte.donnees === 'string'
//                 ? JSON.parse(collecte.donnees)
//                 : collecte.donnees
//             : {};
//     }, [collecte, isEditing]);

//     const { data, setData, post, put, processing, errors, reset } = useForm({
//         entreprise_id: isEditing && collecte ? collecte.entreprise_id.toString() : '',
//         exercice_id: isEditing && collecte ? collecte.exercice_id.toString() : '',
//         periode_id: isEditing && collecte ? collecte.periode_id.toString() : preselectedPeriode ? preselectedPeriode.toString() : '',
//         date_collecte: isEditing && collecte ? collecte.date_collecte : new Date().toISOString().split('T')[0],
//         donnees: initialDonnees,
//         type_collecte: isEditing && collecte ? collecte.type_collecte : 'standard',
//         promoteur_id: isEditing && collecte && collecte.promoteur_id ? collecte.promoteur_id.toString() : '',
//         ong_id: ong ? ong.id.toString() : (isEditing && collecte && collecte.ong_id ? collecte.ong_id.toString() : ''),
//     });

//     // Memoized derived state
//     const availablePeriodes = useMemo(() => {
//         return PeriodeNameGenerator.filterAvailablePeriodes(periodes, collectes);
//     }, [periodes, collectes]);

//     const periodeNames = useMemo(() => {
//         return PeriodeNameGenerator.getPeriodeNamesForExercice(availablePeriodes);
//     }, [availablePeriodes]);

//     const periodeFiltrees = useMemo(() => {
//         if (!data.exercice_id) return [];
//         const exerciceId = parseInt(data.exercice_id);
//         return availablePeriodes.filter(p => p.exercice_id === exerciceId);
//     }, [data.exercice_id, availablePeriodes]);

//     const entreprisesFiltrees = useMemo(() => {
//         return entreprises; // Add filtering logic if needed
//     }, [entreprises]);

//     // Effects
//     useEffect(() => {
//         localStorage.setItem('darkMode', JSON.stringify(darkMode));
//         document.documentElement.classList.toggle('dark', darkMode);
//     }, [darkMode]);

//     useEffect(() => {
//         const handleOnlineStatus = () => {
//             setIsOnline(navigator.onLine);
//             toast[navigator.onLine ? 'info' : 'warning'](
//                 navigator.onLine
//                     ? "Vous êtes de retour en ligne. Synchronisation des données possible."
//                     : "Vous êtes hors ligne. Les données seront sauvegardées localement."
//             );
//         };

//         window.addEventListener('online', handleOnlineStatus);
//         window.addEventListener('offline', handleOnlineStatus);
//         return () => {
//             window.removeEventListener('online', handleOnlineStatus);
//             window.removeEventListener('offline', handleOnlineStatus);
//         };
//     }, []);

//     useEffect(() => {
//         if (data.periode_id) {
//             const periodeObj = periodes.find(p => p.id.toString() === data.periode_id);
//             if (periodeObj) {
//                 const typePeriode = mapTypePeriode(periodeObj.type_periode);
//                 setSelectedPeriodeType(typePeriode);
//                 updateAvailableCategories(typePeriode);
//             }
//         } else {
//             setSelectedPeriodeType('');
//             updateAvailableCategories('');
//         }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [data.periode_id, periodes]);

//     // Callbacks
//     const updateAvailableCategories = useCallback((periodeType: string) => {
//         if (!periodeType) {
//             updateAvailableCategories([]);
//             return;
//         }

//         const categoriesForPeriode = IndicateurCalculator.getCategoriesForPeriode(periodeType as PeriodeName);
//         const categoriesWithLabels = categoriesForPeriode.map(cat => ({
//             id: cat,
//             label: cat
//         }));

//         setAvailableCategories(categoriesWithLabels);

//         if (categoriesWithLabels.length > 0 && !categoriesWithLabels.some(cat => cat.id === activeCategory)) {
//             setActiveCategory(categoriesWithLabels[0].id);
//         }
//     }, [activeCategory]);

//     const handleIndicateurChange = useCallback((fieldId: string, value: string) => {
//         if (!selectedPeriodeType || !activeCategory) return;

//         setData('donnees', {
//             ...data.donnees,
//             [activeCategory]: {
//                 ...data.donnees[activeCategory],
//                 [fieldId]: value
//             }
//         });
//     }, [selectedPeriodeType, activeCategory, data.donnees, setData]);

//     const mapTypePeriode = (typePeriode: string): string => {
//         const typeMap: Record<string, string> = {
//             'Trimestriel': 'Trimestrielle',
//             'Mensuelle': 'Mensuelle',
//             'mensuelle': 'Mensuelle',
//             'trimestriel': 'Trimestrielle',
//             'Semestriel': 'Semestrielle',
//             'semestriel': 'Semestrielle',
//             'Annuel': 'Annuelle',
//             'annuel': 'Annuelle',
//             'Occasionnel': 'Occasionnelle',
//             'occasionnel': 'Occasionnelle',
//             'trimestrielle': 'Trimestrielle',
//             'semestrielle': 'Semestrielle',
//             'annuelle': 'Annuelle',
//             'occasionnelle': 'Occasionnelle'
//         };
//         return typeMap[typePeriode] || '';
//     };


//     const toggleDarkMode = () => setDarkMode(!darkMode);

//     const convertToStandard = () => {
//         if (!collecte?.id) return;
//         if (!confirm("Êtes-vous sûr de vouloir convertir ce brouillon en collecte standard? Cette action est irréversible.")) return;

//         router.put(route('collectes.convert-to-standard', collecte.id), {}, {
//             onSuccess: () => {
//                 toast.success('Brouillon converti avec succès en collecte standard');
//                 setTimeout(() => {
//                     window.location.href = route('collectes.index');
//                 }, 1500);
//             },
//             onError: (errors) => {
//                 console.error('Erreurs lors de la conversion:', errors);
//                 toast.error(errors.message || errors.general || 'Erreur lors de la conversion du brouillon');
//             }
//         });
//     };

//     const handleSaveAsDraft = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setIsDraft(true);
//         setData('type_collecte', 'brouillon');

//         if (isOnline) {
//             post(route('collectes.draft'), {
//                 preserveState: true,
//                 preserveScroll: true,
//                 onSuccess: () => toast.success('Brouillon enregistré avec succès'),
//                 onError: (errors) => {
//                     console.error('Erreurs de validation:', errors);
//                     Object.entries(errors).forEach(([field, message]) =>
//                         toast.error(`${field}: ${message}`)
//                     );
//                 }
//             });
//         } else {
//             try {
//                 await saveOffline(
//                     parseInt(data.entreprise_id),
//                     parseInt(data.exercice_id),
//                     data.periode_id,
//                     data.donnees,
//                     true
//                 );
//                 toast.success('Brouillon sauvegardé localement en attente de synchronisation');
//             } catch (error) {
//                 console.error('Erreur lors de la sauvegarde offline:', error);
//                 toast.error('Erreur lors de la sauvegarde locale');
//             }
//         }
//     };

//     const handleSync = async () => {
//         if (!isOnline) {
//             toast.error('Vous êtes hors ligne. Impossible de synchroniser.');
//             return;
//         }

//         try {
//             await syncData();
//         } catch (error) {
//             console.error('Erreur lors de la synchronisation:', error);
//             toast.error('Erreur lors de la synchronisation');
//         }
//     };

//     const canProceedToStep2 = (): boolean => {
//         let canProceed = !!data.entreprise_id && !!data.exercice_id && !!data.periode_id && !!data.date_collecte;
//         if (userType === 'coach') canProceed = canProceed && !!data.promoteur_id;
//         return canProceed;
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         const typeCollecte = isEditing && collecte?.type_collecte === 'brouillon'
//             ? 'standard'
//             : (isDraft ? 'brouillon' : 'standard');

//         const dataToSubmit = {
//             entreprise_id: data.entreprise_id,
//             exercice_id: data.exercice_id,
//             periode_id: data.periode_id,
//             date_collecte: data.date_collecte,
//             donnees: data.donnees,
//             type_collecte: typeCollecte,
//             promoteur_id: data.promoteur_id || null,
//             ong_id: data.ong_id || null,
//             convertToStandard: isEditing && collecte?.type_collecte === 'brouillon'
//         };

//         if (isOnline) {
//             if (isEditing && collecte) {
//                 if (collecte.type_collecte === 'brouillon' && typeCollecte === 'standard') {
//                     router.put(route('collectes.convert-to-standard', collecte.id), {}, {
//                         onSuccess: () => {
//                             toast.success('Brouillon converti en collecte standard');
//                             setTimeout(() => window.location.href = route('collectes.index'), 1000);
//                         },
//                         onError: (errors) => {
//                             console.error('Erreurs de conversion:', errors);
//                             toast.error(errors.message || Object.entries(errors).map(([field, message]) => `${field}: ${message}`).join(', '));
//                         }
//                     });
//                 } else {
//                     put(route('collectes.update', collecte.id), dataToSubmit, {
//                         onSuccess: () => {
//                             toast.success('Collecte mise à jour avec succès');
//                             setTimeout(() => window.location.href = route('collectes.index'), 1000);
//                         },
//                         onError: (errors) => {
//                             console.error('Erreurs de mise à jour:', errors);
//                             toast.error(errors.message || Object.entries(errors).map(([field, message]) => `${field}: ${message}`).join(', '));
//                         }
//                     });
//                 }
//             } else {
//                 post(route('collectes.store'), dataToSubmit, {
//                     onSuccess: () => {
//                         toast.success('Collecte enregistrée avec succès');
//                         setTimeout(() => window.location.href = route('collectes.index'), 1000);
//                     },
//                     onError: (errors) => {
//                         toast.error(errors.message || Object.entries(errors).map(([field, message]) => `${field}: ${message}`).join(', '));
//                     }
//                 });
//             }
//         } else {
//             try {
//                 await saveOffline(
//                     parseInt(data.entreprise_id),
//                     parseInt(data.exercice_id),
//                     data.periode_id,
//                     data.donnees,
//                     isDraft
//                 );
//                 toast.success('Données sauvegardées localement en attente de synchronisation');
//                 reset();
//             } catch (error) {
//                 console.error('Erreur lors de la sauvegarde offline:', error);
//                 toast.error('Erreur lors de la sauvegarde locale');
//             }
//         }
//     };

//     const getFilteredFields = () => {
//         if (!selectedPeriodeType || !activeCategory) return [];
//         return IndicateurCalculator.getIndicateursByPeriodeAndCategorie(selectedPeriodeType as PeriodeName, activeCategory);
//     };

//     const getInputFields = () => {
//         if (!selectedPeriodeType || !activeCategory) return [];
//         return IndicateurCalculator.getInputIndicateursByPeriodeAndCategorie(selectedPeriodeType  as PeriodeName, activeCategory);
//     };

//     const getCalculatedFields = () => {
//         if (!selectedPeriodeType || !activeCategory) return [];
//         return IndicateurCalculator.getCalculatedIndicateursByPeriodeAndCategorie(selectedPeriodeType  as PeriodeName, activeCategory);
//     };

//     const renderIndicateurField = (field: any) => {
//         const isCalculatedField = field.type === 'calculated' || field.isCalculated;
//         const isAutoCalculated = isCalculatedField && canAutoCalculate(field);
//         const isManualInput = !isCalculatedField || (isCalculatedField && !isAutoCalculated);

//         return (
//             <div key={field.id} className="space-y-1">
//                 <label htmlFor={`${activeCategory}_${field.id}`} className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
//                     <span className="flex-grow">{field.label}</span>
//                     {field.required && <span className="text-red-500 dark:text-red-400 ml-1">*</span>}
//                     {isCalculatedField && (
//                         <span className={`ml-2 px-2 py-0.5 text-xs rounded-full flex items-center ${
//                             isAutoCalculated
//                                 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
//                                 : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
//                         }`}>
//                             {isAutoCalculated ? (
//                                 <>
//                                     <CalculatorIcon className="w-3 h-3 mr-1" />
//                                     Auto-calculé
//                                 </>
//                             ) : (
//                                 <>
//                                     <AlertCircleIcon className="w-3 h-3 mr-1" />
//                                     En attente
//                                 </>
//                             )}
//                         </span>
//                     )}
//                 </label>

//                 <div className="relative mt-1 rounded-lg shadow-sm">
//                     <input
//                         type={isManualInput ? "number" : "text"}
//                         id={`${activeCategory}_${field.id}`}
//                         name={`${activeCategory}_${field.id}`}
//                         value={data.donnees[activeCategory]?.[field.id] || ''}
//                         onChange={e => isManualInput && handleIndicateurChange(field.id, e.target.value)}
//                         readOnly={!isManualInput}
//                         className={`block w-full rounded-lg border-2 py-3 px-4 sm:text-sm ${
//                             isCalculatedField && isAutoCalculated
//                                 ? 'bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600'
//                                 : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400'
//                         }`}
//                         placeholder={isManualInput ? `Saisir ${field.label.toLowerCase()}` : 'Calculé automatiquement'}
//                     />
//                     {isCalculatedField && isAutoCalculated && (
//                         <div className="absolute inset-y-0 left-0 flex items-center pl-3">
//                             <LockIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
//                         </div>
//                     )}
//                     {field.unite && (
//                         <div className="absolute inset-y-0 right-0 flex items-center pr-3">
//                             <span className="text-gray-500 dark:text-gray-400 sm:text-sm">{field.unite}</span>
//                         </div>
//                     )}
//                 </div>

//                 {field.definition && (
//                     <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
//                         Définition: {field.definition}
//                     </p>
//                 )}

//                 {field.isCalculated && !isAutoCalculated && field.dependencies && (
//                     <p className="mt-1 text-xs text-amber-500 dark:text-amber-400 flex items-start">
//                         <AlertCircleIcon className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
//                         <span>
//                             Ce champ sera automatiquement calculé lorsque toutes les données nécessaires seront disponibles.
//                             {field.formula && (
//                                 <span className="block mt-1">Formule: <code className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">{field.formula}</code></span>
//                             )}
//                         </span>
//                     </p>
//                 )}

//                 {field.isCalculated && isAutoCalculated && (
//                     <p className="mt-1 text-xs text-green-600 dark:text-green-400 flex items-start">
//                         <CalculatorIcon className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
//                         <span>Calculé automatiquement à partir des données existantes.</span>
//                     </p>
//                 )}
//             </div>
//         );
//     };

//     return (
//         <div className={`${darkMode ? 'dark' : ''} transition-colors duration-200`}>
//             <div className="bg-white dark:bg-gray-800 shadow-lg sm:rounded-xl overflow-hidden">
//                 <div className="p-6 border-b border-gray-200 dark:border-gray-700 relative">
//                     <button
//                         onClick={toggleDarkMode}
//                         className="absolute right-6 top-6 p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
//                         aria-label={darkMode ? "Activer le mode clair" : "Activer le mode sombre"}
//                     >
//                         {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
//                     </button>

//                     <h1 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
//                         {isEditing ? "Modifier la collecte" : isDraft ? "Brouillon de collecte" : "Nouvelle collecte d'indicateurs"}
//                     </h1>

//                     <div className="flex items-center gap-2 mb-4">
//                         {isOnline ? (
//                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100">
//                                 <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
//                                 En ligne
//                             </span>
//                         ) : (
//                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100">
//                                 <WifiOffIcon className="w-3 h-3 mr-1" />
//                                 Hors ligne
//                             </span>
//                         )}

//                         {pendingUploads > 0 && (
//                             <button
//                                 type="button"
//                                 onClick={handleSync}
//                                 disabled={!isOnline}
//                                 className="ml-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                             >
//                                 <RefreshCcw className="w-4 h-4 mr-1" />
//                                 Sync ({pendingUploads})
//                             </button>
//                         )}
//                     </div>

//                     {isEditing && collecte?.type_collecte === 'brouillon' && (
//                         <div className="bg-amber-100 dark:bg-amber-900 p-3 rounded-md mb-4 flex items-center justify-between">
//                             <p className="text-amber-800 dark:text-amber-100">
//                                 Cette collecte est en mode brouillon et ne sera pas comptabilisée dans les analyses.
//                             </p>
//                             <button
//                                 type="button"
//                                 onClick={convertToStandard}
//                                 className="inline-flex items-center px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-400"
//                             >
//                                 Convertir en collecte standard
//                             </button>
//                         </div>
//                     )}

//                     <form onSubmit={handleSubmit}>
//                         {step === 1 && (
//                             <div className="space-y-6">
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                     {userType === 'coach' && promoteurs.length > 0 && (
//                                         <div className="md:col-span-2">
//                                             <label htmlFor="promoteur_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                                                 Promoteur
//                                             </label>
//                                             <select
//                                                 id="promoteur_id"
//                                                 name="promoteur_id"
//                                                 value={data.promoteur_id}
//                                                 onChange={e => setData('promoteur_id', e.target.value)}
//                                                 className={`mt-1 block w-full rounded-lg border-2 shadow-sm dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
//                                                     errors.promoteur_id
//                                                     ? 'border-red-500 dark:border-red-400'
//                                                     : 'border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400'
//                                                 } py-3 px-4`}
//                                             >
//                                                 <option value="">Sélectionner un promoteur</option>
//                                                 {promoteurs.map(promoteur => (
//                                                     <option key={promoteur.id} value={promoteur.id.toString()}>
//                                                         {promoteur.prenom} {promoteur.nom} - {promoteur.contact}
//                                                     </option>
//                                                 ))}
//                                             </select>
//                                             {errors.promoteur_id && (
//                                                 <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.promoteur_id}</p>
//                                             )}
//                                         </div>
//                                     )}

//                                     <div>
//                                         <label htmlFor="entreprise_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                                             Entreprise
//                                         </label>
//                                         <select
//                                             id="entreprise_id"
//                                             name="entreprise_id"
//                                             value={data.entreprise_id}
//                                             onChange={e => setData('entreprise_id', e.target.value)}
//                                             className={`mt-1 block w-full rounded-lg border-2 shadow-sm dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
//                                                 errors.entreprise_id
//                                                 ? 'border-red-500 dark:border-red-400'
//                                                 : 'border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400'
//                                             } py-3 px-4`}
//                                             disabled={userType === 'coach' && !data.promoteur_id}
//                                         >
//                                             <option value="">Sélectionner une entreprise</option>
//                                             {entreprisesFiltrees.map(entreprise => (
//                                                 <option key={entreprise.id} value={entreprise.id.toString()}>
//                                                     {entreprise.nom_entreprise}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                         {errors.entreprise_id && (
//                                             <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.entreprise_id}</p>
//                                         )}
//                                         {userType === 'coach' && !data.promoteur_id && (
//                                             <p className="mt-1 text-sm text-amber-500 dark:text-amber-400">Veuillez d'abord sélectionner un promoteur</p>
//                                         )}
//                                     </div>

//                                     <div>
//                                         <label htmlFor="exercice_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                                             Exercice
//                                         </label>
//                                         <select
//                                             id="exercice_id"
//                                             name="exercice_id"
//                                             value={data.exercice_id}
//                                             onChange={e => setData('exercice_id', e.target.value)}
//                                             className={`mt-1 block w-full rounded-lg border-2 shadow-sm dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
//                                                 errors.exercice_id
//                                                 ? 'border-red-500 dark:border-red-400'
//                                                 : 'border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400'
//                                             } py-3 px-4`}
//                                         >
//                                             <option value="">Sélectionner un exercice</option>
//                                             {exercices.map(exercice => (
//                                                 <option key={exercice.id} value={exercice.id.toString()}>
//                                                     {exercice.annee} {exercice.actif ? '(Actif)' : ''}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                         {errors.exercice_id && (
//                                             <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.exercice_id}</p>
//                                         )}
//                                     </div>

//                                     <div>
//                                         <label htmlFor="periode_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                                             Période
//                                         </label>
//                                         <select
//                                             id="periode_id"
//                                             name="periode_id"
//                                             value={data.periode_id}
//                                             onChange={e => setData('periode_id', e.target.value)}
//                                             className={`mt-1 block w-full rounded-lg border-2 shadow-sm dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
//                                                 errors.periode_id
//                                                 ? 'border-red-500 dark:border-red-400'
//                                                 : 'border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400'
//                                             } py-3 px-4`}
//                                             disabled={periodeFiltrees.length === 0 || !!preselectedPeriode}
//                                         >
//                                             <option value="">Sélectionner une période</option>
//                                             {periodeFiltrees.map(periode => (
//                                                 <option key={periode.id} value={periode.id.toString()}>
//                                                     {periodeNames.get(periode.id) || periode.type_periode}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                         {errors.periode_id && (
//                                             <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.periode_id}</p>
//                                         )}
//                                         {periodeFiltrees.length === 0 && data.exercice_id && (
//                                             <p className="mt-1 text-sm text-amber-500 dark:text-amber-400">
//                                                 Toutes les périodes ont été utilisées pour cet exercice.
//                                             </p>
//                                         )}
//                                     </div>

//                                     <div>
//                                         <label htmlFor="date_collecte" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                                             Date de collecte
//                                         </label>
//                                         <input
//                                             type="date"
//                                             id="date_collecte"
//                                             name="date_collecte"
//                                             value={data.date_collecte}
//                                             onChange={e => setData('date_collecte', e.target.value)}
//                                             className={`mt-1 block w-full rounded-lg border-2 shadow-sm dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
//                                                 errors.date_collecte
//                                                 ? 'border-red-500 dark:border-red-400'
//                                                 : 'border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400'
//                                             } py-3 px-4`}
//                                         />
//                                         {errors.date_collecte && (
//                                             <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.date_collecte}</p>
//                                         )}
//                                     </div>
//                                 </div>

//                                 {data.entreprise_id && data.exercice_id && periodeFiltrees.length > 0 && (
//                                     <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mt-4">
//                                         <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                                             Périodes disponibles
//                                         </h3>
//                                         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
//                                             {periodeFiltrees.map(periode => (
//                                                 <div
//                                                     key={periode.id}
//                                                     className="flex items-center p-2 rounded-lg bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300"
//                                                 >
//                                                     <CheckCircleIcon className="w-4 h-4 mr-2 flex-shrink-0" />
//                                                     <span className="text-sm">
//                                                         {periodeNames.get(periode.id) || periode.type_periode}
//                                                     </span>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 )}

//                                 <div className="flex justify-end mt-6">
//                                     <button
//                                         type="button"
//                                         onClick={() => setStep(2)}
//                                         disabled={!canProceedToStep2()}
//                                         className="inline-flex justify-center rounded-lg border-2 border-transparent bg-indigo-600 dark:bg-indigo-500 py-3 px-6 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 dark:hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-2 disabled:opacity-50"
//                                     >
//                                         Continuer
//                                     </button>
//                                 </div>
//                             </div>
//                         )}

//                         {step === 2 && (
//                             <div className="space-y-6">
//                                 <div className="flex items-center justify-between mb-4">
//                                     <div className="flex space-x-2">
//                                         <button
//                                             type="button"
//                                             onClick={() => setStep(1)}
//                                             className="inline-flex items-center rounded-lg border-2 border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-2"
//                                         >
//                                             <ArrowLeftIcon className="w-4 h-4 mr-2" />
//                                             Retour
//                                         </button>

//                                         <Link
//                                             href={userType === 'coach' ? route('coach.collectes.index') : route('collectes.index')}
//                                             className="inline-flex items-center rounded-lg border-2 border-gray-800 dark:border-gray-300 bg-gray-800 dark:bg-gray-700 py-3 px-4 text-sm font-medium text-white dark:text-gray-300 shadow-sm hover:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:ring-offset-2"
//                                         >
//                                             <ArrowLeftIcon className="w-4 h-4 mr-2" />
//                                             Retour à la liste
//                                         </Link>
//                                     </div>

//                                     <div>
//                                         <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
//                                             {isEditing ? "Modifier la collecte" : "Nouvelle collecte"} -
//                                             Entreprise: {entreprisesFiltrees.find(e => e.id.toString() === data.entreprise_id)?.nom_entreprise || ''} -
//                                             Période: {periodeNames.get(parseInt(data.periode_id)) || periodeFiltrees.find(p => p.id.toString() === data.periode_id)?.type_periode || ''}
//                                         </span>
//                                     </div>
//                                 </div>

//                                 {availableCategories.length > 0 ? (
//                                     <>
//                                         <div>
//                                             <div className="sm:hidden">
//                                                 <label htmlFor="tabs" className="sr-only">
//                                                     Sélectionner une catégorie
//                                                 </label>
//                                                 <select
//                                                     id="tabs"
//                                                     name="tabs"
//                                                     className="block w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400 py-3 px-4"
//                                                     value={activeCategory}
//                                                     onChange={e => setActiveCategory(e.target.value)}
//                                                 >
//                                                     {availableCategories.map(category => (
//                                                         <option key={category.id} value={category.id}>
//                                                             {category.label}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                             </div>
//                                             <div className="hidden sm:block">
//                                                 <nav className="flex space-x-4 flex-wrap" aria-label="Tabs">
//                                                     {availableCategories.map(category => (
//                                                         <button
//                                                             key={category.id}
//                                                             type="button"
//                                                             onClick={() => setActiveCategory(category.id)}
//                                                             className={`px-4 py-3 text-sm font-medium rounded-lg border-2 my-1 ${
//                                                                 activeCategory === category.id
//                                                                     ? 'bg-indigo-100 text-indigo-700 border-indigo-300 dark:bg-indigo-900 dark:text-indigo-300 dark:border-indigo-700'
//                                                                     : 'text-gray-500 border-gray-200 hover:text-gray-700 dark:text-gray-400 dark:border-gray-700 dark:hover:text-gray-300'
//                                                             }`}
//                                                         >
//                                                             {category.label}
//                                                         </button>
//                                                     ))}
//                                                 </nav>
//                                             </div>
//                                         </div>

//                                         <div className="mt-4 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-inner">
//                                             <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
//                                                 {availableCategories.find(category => category.id === activeCategory)?.label}
//                                             </h3>

//                                             <div className="space-y-4 mb-4">
//                                                 <p className="text-sm text-gray-600 dark:text-gray-300">
//                                                     Période: <span className="font-medium">{periodeNames.get(parseInt(data.periode_id)) || selectedPeriodeType}</span>
//                                                 </p>
//                                                 <p className="text-sm text-gray-600 dark:text-gray-300">
//                                                     Nombre d'indicateurs: <span className="font-medium">{getFilteredFields().length}</span>
//                                                 </p>

//                                                 <div className="flex flex-wrap gap-4 mt-2">
//                                                     <div className="flex items-center">
//                                                         <span className="w-3 h-3 bg-green-100 dark:bg-green-900 rounded-full mr-2"></span>
//                                                         <span className="text-xs text-gray-600 dark:text-gray-300">Auto-calculé</span>
//                                                     </div>
//                                                     <div className="flex items-center">
//                                                         <span className="w-3 h-3 bg-yellow-100 dark:bg-yellow-900 rounded-full mr-2"></span>
//                                                         <span className="text-xs text-gray-600 dark:text-gray-300">En attente de données</span>
//                                                     </div>
//                                                 </div>
//                                             </div>

//                                             {getFilteredFields().length > 0 ? (
//                                                 <>
//                                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//                                                         {getInputFields().map(field => renderIndicateurField(field))}
//                                                     </div>

//                                                     {getCalculatedFields().length > 0 && (
//                                                         <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
//                                                             <h4 className="text-base font-medium text-gray-900 dark:text-white mb-4 flex items-center">
//                                                                 <CalculatorIcon className="w-4 h-4 mr-2" />
//                                                                 Indicateurs calculés
//                                                             </h4>
//                                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                                                 {getCalculatedFields().map(field => renderIndicateurField(field))}
//                                                             </div>
//                                                         </div>
//                                                     )}
//                                                 </>
//                                             ) : (
//                                                 <div className="text-center py-10">
//                                                     <p className="text-gray-500 dark:text-gray-400">
//                                                         Aucun indicateur disponible pour cette catégorie et cette période.
//                                                     </p>
//                                                 </div>
//                                             )}
//                                         </div>

//                                         <div className="flex justify-end space-x-4 mt-6">
//                                             <button
//                                                 type="button"
//                                                 onClick={handleSaveAsDraft}
//                                                 className="inline-flex items-center px-6 py-3 border-2 border-gray-300 dark:border-gray-600 shadow-lg text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
//                                             >
//                                                 <SaveIcon className="w-5 h-5 mr-2" />
//                                                 Enregistrer comme brouillon
//                                             </button>

//                                             <button
//                                                 type="submit"
//                                                 disabled={processing}
//                                                 className="inline-flex justify-center py-3 px-6 border-2 border-transparent shadow-lg text-sm font-medium rounded-lg text-white bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 disabled:opacity-50"
//                                             >
//                                                 {processing ? 'Traitement...' : (isEditing ? 'Mettre à jour' : 'Enregistrer')}
//                                             </button>
//                                         </div>
//                                     </>
//                                 ) : (
//                                     <div className="text-center py-10 bg-gray-50 dark:bg-gray-700 rounded-lg">
//                                         <p className="text-gray-500 dark:text-gray-400">
//                                             Aucune catégorie disponible pour cette période. Veuillez sélectionner une autre période.
//                                         </p>
//                                         <button
//                                             type="button"
//                                             onClick={() => setStep(1)}
//                                             className="mt-4 inline-flex items-center px-6 py-3 border-2 border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
//                                         >
//                                             <ArrowLeftIcon className="w-4 h-4 mr-2" />
//                                             Retour à la sélection
//                                         </button>
//                                     </div>
//                                 )}
//                             </div>
//                         )}
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default CollecteForm;
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Link, router, useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { useOfflineStorage } from '@/hooks/useOfflineStorage';

import { IndicateurCalculator, PeriodeName } from '@/Utils/IndicateurCalculator';
import { ArrowLeftIcon, SaveIcon, WifiOffIcon, RefreshCcw, MoonIcon, SunIcon, CalculatorIcon, LockIcon, AlertCircleIcon, CheckCircleIcon } from 'lucide-react';
import { PeriodeNameGenerator } from '@/Utils/PeriodeNameGenerator';
import { Periode } from '@/Utils/periodeTypes';

interface Entreprise {
    id: number;
    nom_entreprise: string;
}

interface Exercice {
    id: number;
    annee: number;
    date_debut: string;
    date_fin: string;
    actif: boolean;
}

interface Promoteur {
    id: number;
    nom: string;
    prenom: string;
    contact: string;
}

interface ONG {
    id: number;
    nom: string;
    sigle: string;
}

interface CollecteFormProps {
    entreprises: Entreprise[];
    exercices: Exercice[];
    periodes: Periode[];
    collectes?: { periode_id: number }[];
    promoteurs?: Promoteur[];
    ong?: ONG;
    userType?: 'admin' | 'ong' | 'coach';
    collecte?: {
        id?: number;
        entreprise_id: number;
        exercice_id: number;
        periode_id: number;
        date_collecte: string;
        donnees: Record<string, any> | string;
        type_collecte: 'standard' | 'brouillon';
        promoteur_id?: number;
        ong_id?: number;
    };
    isEditing?: boolean;
    preselectedPeriode?: number;
    dependenciesData?: Record<string, Record<string, Record<string, any>>>;
}

const CollecteForm: React.FC<CollecteFormProps> = ({
    entreprises,
    exercices,
    periodes,
    collectes = [],
    promoteurs = [],
    ong = undefined,
    userType = 'admin',
    collecte,
    isEditing = false,
    preselectedPeriode,
    dependenciesData = {},
}) => {
    // State initialization
    const [isDraft, setIsDraft] = useState(isEditing && collecte?.type_collecte === 'brouillon');
    const [step, setStep] = useState(1);
    const [activeCategory, setActiveCategory] = useState('');
    const [selectedPeriodeType, setSelectedPeriodeType] = useState('');
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [availableCategories, setAvailableCategories] = useState<{id: string, label: string}[]>([]);
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('darkMode');
        return saved ? JSON.parse(saved) : false;
    });
    const { saveOffline, pendingUploads, syncData, isInitialized } = useOfflineStorage();
    const [allData] = useState<Record<string, Record<string, Record<string, any>>>>(dependenciesData);
    const formRef = useRef<HTMLFormElement>(null);

    const canAutoCalculate = (indicator: any): boolean => {
        if (!indicator.isCalculated || !indicator.dependencies) return false;
        return IndicateurCalculator.checkDependenciesAvailability(indicator, allData);
    };

    // Form initialization
    const initialDonnees = useMemo(() => {
        return isEditing && collecte?.donnees
            ? typeof collecte.donnees === 'string'
                ? JSON.parse(collecte.donnees)
                : collecte.donnees
            : {};
    }, [collecte, isEditing]);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        entreprise_id: isEditing && collecte ? collecte.entreprise_id.toString() : '',
        exercice_id: isEditing && collecte ? collecte.exercice_id.toString() : '',
        periode_id: isEditing && collecte ? collecte.periode_id.toString() : preselectedPeriode ? preselectedPeriode.toString() : '',
        date_collecte: isEditing && collecte ? collecte.date_collecte : new Date().toISOString().split('T')[0],
        donnees: initialDonnees,
        type_collecte: isEditing && collecte ? collecte.type_collecte : 'standard',
        promoteur_id: isEditing && collecte && collecte.promoteur_id ? collecte.promoteur_id.toString() : '',
        ong_id: ong ? ong.id.toString() : (isEditing && collecte && collecte.ong_id ? collecte.ong_id.toString() : ''),
    });

    // Memoized derived state
    const availablePeriodes = useMemo(() => {
        return PeriodeNameGenerator.filterAvailablePeriodes(periodes, collectes);
    }, [periodes, collectes]);

    const periodeNames = useMemo(() => {
        return PeriodeNameGenerator.getPeriodeNamesForExercice(availablePeriodes);
    }, [availablePeriodes]);

    const periodeFiltrees = useMemo(() => {
        if (!data.exercice_id) return [];
        const exerciceId = parseInt(data.exercice_id);
        return availablePeriodes.filter(p => p.exercice_id === exerciceId);
    }, [data.exercice_id, availablePeriodes]);

    const entreprisesFiltrees = useMemo(() => {
        return entreprises; // Add filtering logic if needed
    }, [entreprises]);

    // Effects
    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
        document.documentElement.classList.toggle('dark', darkMode);
    }, [darkMode]);

    useEffect(() => {
        const handleOnlineStatus = () => {
            setIsOnline(navigator.onLine);
            toast[navigator.onLine ? 'info' : 'warning'](
                navigator.onLine
                    ? "Vous êtes de retour en ligne. Synchronisation des données possible."
                    : "Vous êtes hors ligne. Les données seront sauvegardées localement."
            );
        };

        window.addEventListener('online', handleOnlineStatus);
        window.addEventListener('offline', handleOnlineStatus);
        return () => {
            window.removeEventListener('online', handleOnlineStatus);
            window.removeEventListener('offline', handleOnlineStatus);
        };
    }, []);

    useEffect(() => {
        if (data.periode_id) {
            const periodeObj = periodes.find(p => p.id.toString() === data.periode_id);
            if (periodeObj) {
                const typePeriode = mapTypePeriode(periodeObj.type_periode);
                setSelectedPeriodeType(typePeriode);
                updateAvailableCategories(typePeriode);
            }
        } else {
            setSelectedPeriodeType('');
            setAvailableCategories([]);
        }
    }, [data.periode_id, periodes]);

    // Callbacks
    const updateAvailableCategories = useCallback((periodeType: string) => {
        if (!periodeType) {
            setAvailableCategories([]);
            return;
        }

        const categoriesForPeriode = IndicateurCalculator.getCategoriesForPeriode(periodeType as PeriodeName);
        const categoriesWithLabels = categoriesForPeriode.map(cat => ({
            id: cat,
            label: cat
        }));

        setAvailableCategories(categoriesWithLabels);

        if (categoriesWithLabels.length > 0 && !categoriesWithLabels.some(cat => cat.id === activeCategory)) {
            setActiveCategory(categoriesWithLabels[0].id);
        }
    }, [activeCategory]);

    const handleIndicateurChange = useCallback((fieldId: string, value: string) => {
        if (!selectedPeriodeType || !activeCategory) return;

        setData('donnees', {
            ...data.donnees,
            [activeCategory]: {
                ...data.donnees[activeCategory],
                [fieldId]: value
            }
        });
    }, [selectedPeriodeType, activeCategory, data.donnees, setData]);

    const mapTypePeriode = (typePeriode: string): string => {
        const typeMap: Record<string, string> = {
            'Trimestriel': 'Trimestrielle',
            'Mensuelle': 'Mensuelle',
            'mensuelle': 'Mensuelle',
            'trimestriel': 'Trimestrielle',
            'Semestriel': 'Semestrielle',
            'semestriel': 'Semestrielle',
            'Annuel': 'Annuelle',
            'annuel': 'Annuelle',
            'Occasionnel': 'Occasionnelle',
            'occasionnel': 'Occasionnelle',
            'trimestrielle': 'Trimestrielle',
            'semestrielle': 'Semestrielle',
            'annuelle': 'Annuelle',
            'occasionnelle': 'Occasionnelle'
        };
        return typeMap[typePeriode] || '';
    };

    const toggleDarkMode = () => setDarkMode(!darkMode);

    const convertToStandard = () => {
        if (!collecte?.id) return;
        if (!confirm("Êtes-vous sûr de vouloir convertir ce brouillon en collecte standard? Cette action est irréversible.")) return;

        router.put(route('collectes.convert-to-standard', collecte.id), {}, {
            onSuccess: () => {
                toast.success('Brouillon converti avec succès en collecte standard');
                setTimeout(() => {
                    window.location.href = route('collectes.index');
                }, 1500);
            },
            onError: (errors) => {
                console.error('Erreurs lors de la conversion:', errors);
                toast.error(errors.message || errors.general || 'Erreur lors de la conversion du brouillon');
            }
        });
    };

    const handleSaveAsDraft = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsDraft(true);
        setData('type_collecte', 'brouillon');

        if (isOnline) {
            post(route('collectes.draft'), {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => toast.success('Brouillon enregistré avec succès'),
                onError: (errors) => {
                    console.error('Erreurs de validation:', errors);
                    Object.entries(errors).forEach(([field, message]) =>
                        toast.error(`${field}: ${message}`)
                    );
                }
            });
        } else {
            try {
                setIsSubmitting(true);
                if (!isInitialized) {
                    toast.error('Le mode hors ligne n\'est pas encore initialisé. Veuillez patienter...');
                    setIsSubmitting(false);
                    return;
                }

                await saveOffline(
                    parseInt(data.entreprise_id),
                    parseInt(data.exercice_id),
                    data.periode_id,
                    data.donnees,
                    true
                );
                toast.success('Brouillon sauvegardé localement en attente de synchronisation');
                setIsSubmitting(false);
            } catch (error) {
                console.error('Erreur lors de la sauvegarde offline:', error);
                toast.error('Erreur lors de la sauvegarde locale');
                setIsSubmitting(false);
            }
        }
    };

    const handleSync = async () => {
        if (!isOnline) {
            toast.error('Vous êtes hors ligne. Impossible de synchroniser.');
            return;
        }

        try {
            setIsSubmitting(true);
            toast.loading('Synchronisation en cours...');
            const syncedCount = await syncData();
            toast.dismiss();

            if (syncedCount > 0) {
                toast.success(`${syncedCount} collecte(s) synchronisée(s) avec succès`);
                setTimeout(() => {
                    window.location.href = route('collectes.index');
                }, 1500);
            } else {
                toast.info('Aucune donnée n\'a été synchronisée');
            }
        } catch (error) {
            toast.dismiss();
            console.error('Erreur lors de la synchronisation:', error);
            toast.error('Erreur lors de la synchronisation');
        } finally {
            setIsSubmitting(false);
        }
    };

    const canProceedToStep2 = (): boolean => {
        let canProceed = !!data.entreprise_id && !!data.exercice_id && !!data.periode_id && !!data.date_collecte;
        if (userType === 'coach') canProceed = canProceed && !!data.promoteur_id;
        return canProceed;
    };

    const handleNextStep = () => {
        if (canProceedToStep2()) {
            setStep(2);
        } else {
            // Highlight validation errors
            if (!data.entreprise_id) toast.error('Veuillez sélectionner une entreprise');
            if (!data.exercice_id) toast.error('Veuillez sélectionner un exercice');
            if (!data.periode_id) toast.error('Veuillez sélectionner une période');
            if (!data.date_collecte) toast.error('Veuillez indiquer une date de collecte');
            if (userType === 'coach' && !data.promoteur_id) toast.error('Veuillez sélectionner un promoteur');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const typeCollecte = isEditing && collecte?.type_collecte === 'brouillon'
            ? 'standard'
            : (isDraft ? 'brouillon' : 'standard');

        const dataToSubmit = {
            entreprise_id: data.entreprise_id,
            exercice_id: data.exercice_id,
            periode_id: data.periode_id,
            date_collecte: data.date_collecte,
            donnees: data.donnees,
            type_collecte: typeCollecte,
            promoteur_id: data.promoteur_id || null,
            ong_id: data.ong_id || null,
            convertToStandard: isEditing && collecte?.type_collecte === 'brouillon'
        };

        if (isOnline) {
            if (isEditing && collecte) {
                if (collecte.type_collecte === 'brouillon' && typeCollecte === 'standard') {
                    router.put(route('collectes.convert-to-standard', collecte.id), {}, {
                        onSuccess: () => {
                            toast.success('Brouillon converti en collecte standard');
                            setTimeout(() => window.location.href = route('collectes.index'), 1000);
                        },
                        onError: (errors) => {
                            console.error('Erreurs de conversion:', errors);
                            toast.error(errors.message || Object.entries(errors).map(([field, message]) => `${field}: ${message}`).join(', '));
                            setIsSubmitting(false);
                        }
                    });
                } else {
                    put(route('collectes.update', collecte.id), dataToSubmit, {
                        onSuccess: () => {
                            toast.success('Collecte mise à jour avec succès');
                            setTimeout(() => window.location.href = route('collectes.index'), 1000);
                        },
                        onError: (errors) => {
                            console.error('Erreurs de mise à jour:', errors);
                            toast.error(errors.message || Object.entries(errors).map(([field, message]) => `${field}: ${message}`).join(', '));
                            setIsSubmitting(false);
                        }
                    });
                }
            } else {
                post(route('collectes.store'), dataToSubmit, {
                    onSuccess: () => {
                        toast.success('Collecte enregistrée avec succès');
                        setTimeout(() => window.location.href = route('collectes.index'), 1000);
                    },
                    onError: (errors) => {
                        toast.error(errors.message || Object.entries(errors).map(([field, message]) => `${field}: ${message}`).join(', '));
                        setIsSubmitting(false);
                    }
                });
            }
        } else {
            try {
                if (!isInitialized) {
                    toast.error('Le mode hors ligne n\'est pas encore initialisé. Veuillez patienter...');
                    setIsSubmitting(false);
                    return;
                }

                await saveOffline(
                    parseInt(data.entreprise_id),
                    parseInt(data.exercice_id),
                    data.periode_id,
                    data.donnees,
                    isDraft
                );
                toast.success('Données sauvegardées localement en attente de synchronisation');
                reset();
                setStep(1);
                setIsSubmitting(false);
            } catch (error) {
                console.error('Erreur lors de la sauvegarde offline:', error);
                toast.error('Erreur lors de la sauvegarde locale');
                setIsSubmitting(false);
            }
        }
    };

    const getFilteredFields = () => {
        if (!selectedPeriodeType || !activeCategory) return [];
        return IndicateurCalculator.getIndicateursByPeriodeAndCategorie(selectedPeriodeType as PeriodeName, activeCategory);
    };

    const getInputFields = () => {
        if (!selectedPeriodeType || !activeCategory) return [];
        return IndicateurCalculator.getInputIndicateursByPeriodeAndCategorie(selectedPeriodeType  as PeriodeName, activeCategory);
    };

    const getCalculatedFields = () => {
        if (!selectedPeriodeType || !activeCategory) return [];
        return IndicateurCalculator.getCalculatedIndicateursByPeriodeAndCategorie(selectedPeriodeType  as PeriodeName, activeCategory);
    };

    const renderIndicateurField = (field: any) => {
        const isCalculatedField = field.type === 'calculated' || field.isCalculated;
        const isAutoCalculated = isCalculatedField && canAutoCalculate(field);
        const isManualInput = !isCalculatedField || (isCalculatedField && !isAutoCalculated);

        return (
            <div key={field.id} className="space-y-1">
                <label htmlFor={`${activeCategory}_${field.id}`} className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                    <span className="flex-grow">{field.label}</span>
                    {field.required && <span className="text-red-500 dark:text-red-400 ml-1">*</span>}
                    {isCalculatedField && (
                        <span className={`ml-2 px-2 py-0.5 text-xs rounded-full flex items-center ${
                            isAutoCalculated
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                            {isAutoCalculated ? (
                                <>
                                    <CalculatorIcon className="w-3 h-3 mr-1" />
                                    Auto-calculé
                                </>
                            ) : (
                                <>
                                    <AlertCircleIcon className="w-3 h-3 mr-1" />
                                    En attente
                                </>
                            )}
                        </span>
                    )}
                </label>

                <div className="relative mt-1 rounded-lg shadow-sm">
                    <input
                        type={isManualInput ? "number" : "text"}
                        id={`${activeCategory}_${field.id}`}
                        name={`${activeCategory}_${field.id}`}
                        value={data.donnees[activeCategory]?.[field.id] || ''}
                        onChange={e => isManualInput && handleIndicateurChange(field.id, e.target.value)}
                        readOnly={!isManualInput}
                        className={`block w-full rounded-lg border-2 py-3 px-4 sm:text-sm ${
                            isCalculatedField && isAutoCalculated
                                ? 'bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600'
                                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400'
                        }`}
                        placeholder={isManualInput ? `Saisir ${field.label.toLowerCase()}` : 'Calculé automatiquement'}
                    />
                    {isCalculatedField && isAutoCalculated && (
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <LockIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        </div>
                    )}
                    {field.unite && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <span className="text-gray-500 dark:text-gray-400 sm:text-sm">{field.unite}</span>
                        </div>
                    )}
                </div>

                {field.definition && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Définition: {field.definition}
                    </p>
                )}

                {field.isCalculated && !isAutoCalculated && field.dependencies && (
                    <p className="mt-1 text-xs text-amber-500 dark:text-amber-400 flex items-start">
                        <AlertCircleIcon className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                        <span>
                            Ce champ sera automatiquement calculé lorsque toutes les données nécessaires seront disponibles.
                            {field.formula && (
                                <span className="block mt-1">Formule: <code className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">{field.formula}</code></span>
                            )}
                        </span>
                    </p>
                )}

                {field.isCalculated && isAutoCalculated && (
                    <p className="mt-1 text-xs text-green-600 dark:text-green-400 flex items-start">
                        <CalculatorIcon className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                        <span>Calculé automatiquement à partir des données existantes.</span>
                    </p>
                )}
            </div>
        );
    };

    return (
        <div className={`${darkMode ? 'dark' : ''} transition-colors duration-200`}>
            <div className="bg-white dark:bg-gray-800 shadow-lg sm:rounded-xl overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 relative">
                    <button
                        onClick={toggleDarkMode}
                        className="absolute right-6 top-6 p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        aria-label={darkMode ? "Activer le mode clair" : "Activer le mode sombre"}
                    >
                        {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                    </button>

                    <h1 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
                        {isEditing ? "Modifier la collecte" : isDraft ? "Brouillon de collecte" : "Nouvelle collecte d'indicateurs"}
                    </h1>

                    <div className="flex items-center gap-2 mb-4">
                        {isOnline ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100">
                                <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                                En ligne
                            </span>
                        ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100">
                                <WifiOffIcon className="w-3 h-3 mr-1" />
                                Hors ligne
                            </span>
                        )}

                        {pendingUploads > 0 && (
                            <button
                                type="button"
                                onClick={handleSync}
                                disabled={!isOnline || isSubmitting}
                                className="ml-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <RefreshCcw className={`w-4 h-4 mr-1 ${isSubmitting ? 'animate-spin' : ''}`} />
                                Sync ({pendingUploads})
                            </button>
                        )}
                    </div>

                    {isEditing && collecte?.type_collecte === 'brouillon' && (
                        <div className="bg-amber-100 dark:bg-amber-900 p-3 rounded-md mb-4 flex items-center justify-between">
                            <p className="text-amber-800 dark:text-amber-100">
                                Cette collecte est en mode brouillon et ne sera pas comptabilisée dans les analyses.
                            </p>
                            <button
                                type="button"
                                onClick={convertToStandard}
                                className="inline-flex items-center px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-400"
                            >
                                Convertir en collecte standard
                            </button>
                        </div>
                    )}

                    <form ref={formRef} onSubmit={handleSubmit}>
                        {step === 1 && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {userType === 'coach' && promoteurs.length > 0 && (
                                        <div className="md:col-span-2">
                                            <label htmlFor="promoteur_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Promoteur
                                            </label>
                                            <select
                                                id="promoteur_id"
                                                name="promoteur_id"
                                                value={data.promoteur_id}
                                                onChange={e => setData('promoteur_id', e.target.value)}
                                                className={`mt-1 block w-full rounded-lg border-2 shadow-sm dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                                                    errors.promoteur_id
                                                    ? 'border-red-500 dark:border-red-400'
                                                    : 'border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400'
                                                } py-3 px-4`}
                                            >
                                                <option value="">Sélectionner un promoteur</option>
                                                {promoteurs.map(promoteur => (
                                                    <option key={promoteur.id} value={promoteur.id.toString()}>
                                                        {promoteur.prenom} {promoteur.nom} - {promoteur.contact}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.promoteur_id && (
                                                <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.promoteur_id}</p>
                                            )}
                                        </div>
                                    )}

                                    <div>
                                        <label htmlFor="entreprise_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Entreprise
                                        </label>
                                        <select
                                            id="entreprise_id"
                                            name="entreprise_id"
                                            value={data.entreprise_id}
                                            onChange={e => setData('entreprise_id', e.target.value)}
                                            className={`mt-1 block w-full rounded-lg border-2 shadow-sm dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                                                errors.entreprise_id
                                                ? 'border-red-500 dark:border-red-400'
                                                : 'border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400'
                                            } py-3 px-4`}
                                            disabled={userType === 'coach' && !data.promoteur_id}
                                        >
                                            <option value="">Sélectionner une entreprise</option>
                                            {entreprisesFiltrees.map(entreprise => (
                                                <option key={entreprise.id} value={entreprise.id.toString()}>
                                                    {entreprise.nom_entreprise}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.entreprise_id && (
                                            <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.entreprise_id}</p>
                                        )}
                                        {userType === 'coach' && !data.promoteur_id && (
                                            <p className="mt-1 text-sm text-amber-500 dark:text-amber-400">Veuillez d'abord sélectionner un promoteur</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="exercice_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Exercice
                                        </label>
                                        <select
                                            id="exercice_id"
                                            name="exercice_id"
                                            value={data.exercice_id}
                                            onChange={e => setData('exercice_id', e.target.value)}
                                            className={`mt-1 block w-full rounded-lg border-2 shadow-sm dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                                                errors.exercice_id
                                                ? 'border-red-500 dark:border-red-400'
                                                : 'border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400'
                                            } py-3 px-4`}
                                        >
                                            <option value="">Sélectionner un exercice</option>
                                            {exercices.map(exercice => (
                                                <option key={exercice.id} value={exercice.id.toString()}>
                                                    {exercice.annee} {exercice.actif ? '(Actif)' : ''}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.exercice_id && (
                                            <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.exercice_id}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="periode_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Période
                                        </label>
                                        <select
                                            id="periode_id"
                                            name="periode_id"
                                            value={data.periode_id}
                                            onChange={e => setData('periode_id', e.target.value)}
                                            className={`mt-1 block w-full rounded-lg border-2 shadow-sm dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                                                errors.periode_id
                                                ? 'border-red-500 dark:border-red-400'
                                                : 'border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400'
                                            } py-3 px-4`}
                                            disabled={periodeFiltrees.length === 0 || !!preselectedPeriode}
                                        >
                                            <option value="">Sélectionner une période</option>
                                            {periodeFiltrees.map(periode => (
                                                <option key={periode.id} value={periode.id.toString()}>
                                                    {periodeNames.get(periode.id) || periode.type_periode}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.periode_id && (
                                            <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.periode_id}</p>
                                        )}
                                        {periodeFiltrees.length === 0 && data.exercice_id && (
                                            <p className="mt-1 text-sm text-amber-500 dark:text-amber-400">
                                                Toutes les périodes ont été utilisées pour cet exercice.
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="date_collecte" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Date de collecte
                                        </label>
                                        <input
                                            type="date"
                                            id="date_collecte"
                                            name="date_collecte"
                                            value={data.date_collecte}
                                            onChange={e => setData('date_collecte', e.target.value)}
                                            className={`mt-1 block w-full rounded-lg border-2 shadow-sm dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                                                errors.date_collecte
                                                ? 'border-red-500 dark:border-red-400'
                                                : 'border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400'
                                            } py-3 px-4`}
                                        />
                                        {errors.date_collecte && (
                                            <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.date_collecte}</p>
                                        )}
                                    </div>
                                </div>

                                {data.entreprise_id && data.exercice_id && periodeFiltrees.length > 0 && (
                                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mt-4">
                                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Périodes disponibles
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                            {periodeFiltrees.map(periode => (
                                                <div
                                                    key={periode.id}
                                                    className="flex items-center p-2 rounded-lg bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300"
                                                >
                                                    <CheckCircleIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                                                    <span className="text-sm">
                                                        {periodeNames.get(periode.id) || periode.type_periode}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end mt-6">
                                    <button
                                        type="button"
                                        onClick={handleNextStep}
                                        disabled={!canProceedToStep2() || isSubmitting}
                                        className="inline-flex justify-center rounded-lg border-2 border-transparent bg-indigo-600 dark:bg-indigo-500 py-3 px-6 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 dark:hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-2 disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Chargement...' : 'Continuer'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            disabled={isSubmitting}
                                            className="inline-flex items-center rounded-lg border-2 border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-2 disabled:opacity-50"
                                        >
                                            <ArrowLeftIcon className="w-4 h-4 mr-2" />
                                            Retour
                                        </button>

                                        <Link
                                            href={userType === 'coach' ? route('coach.collectes.index') : route('collectes.index')}
                                            className="inline-flex items-center rounded-lg border-2 border-gray-800 dark:border-gray-300 bg-gray-800 dark:bg-gray-700 py-3 px-4 text-sm font-medium text-white dark:text-gray-300 shadow-sm hover:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:ring-offset-2"
                                        >
                                            <ArrowLeftIcon className="w-4 h-4 mr-2" />
                                            Retour à la liste
                                        </Link>
                                    </div>

                                    <div>
                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            {isEditing ? "Modifier la collecte" : "Nouvelle collecte"} -
                                            Entreprise: {entreprisesFiltrees.find(e => e.id.toString() === data.entreprise_id)?.nom_entreprise || ''} -
                                            Période: {periodeNames.get(parseInt(data.periode_id)) || periodeFiltrees.find(p => p.id.toString() === data.periode_id)?.type_periode || ''}
                                        </span>
                                    </div>
                                </div>

                                {availableCategories.length > 0 ? (
                                    <>
                                        <div>
                                            <div className="sm:hidden">
                                                <label htmlFor="tabs" className="sr-only">
                                                    Sélectionner une catégorie
                                                </label>
                                                <select
                                                    id="tabs"
                                                    name="tabs"
                                                    className="block w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400 py-3 px-4"
                                                    value={activeCategory}
                                                    onChange={e => setActiveCategory(e.target.value)}
                                                >
                                                    {availableCategories.map(category => (
                                                        <option key={category.id} value={category.id}>
                                                            {category.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="hidden sm:block">
                                                <nav className="flex space-x-4 flex-wrap" aria-label="Tabs">
                                                    {availableCategories.map(category => (
                                                        <button
                                                            key={category.id}
                                                            type="button"
                                                            onClick={() => setActiveCategory(category.id)}
                                                            className={`px-4 py-3 text-sm font-medium rounded-lg border-2 my-1 ${
                                                                activeCategory === category.id
                                                                    ? 'bg-indigo-100 text-indigo-700 border-indigo-300 dark:bg-indigo-900 dark:text-indigo-300 dark:border-indigo-700'
                                                                    : 'text-gray-500 border-gray-200 hover:text-gray-700 dark:text-gray-400 dark:border-gray-700 dark:hover:text-gray-300'
                                                            }`}
                                                        >
                                                            {category.label}
                                                        </button>
                                                    ))}
                                                </nav>
                                            </div>
                                        </div>

                                        <div className="mt-4 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-inner">
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                                {availableCategories.find(category => category.id === activeCategory)?.label}
                                            </h3>

                                            <div className="space-y-4 mb-4">
                                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                                    Période: <span className="font-medium">{periodeNames.get(parseInt(data.periode_id)) || selectedPeriodeType}</span>
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                                    Nombre d'indicateurs: <span className="font-medium">{getFilteredFields().length}</span>
                                                </p>

                                                <div className="flex flex-wrap gap-4 mt-2">
                                                    <div className="flex items-center">
                                                        <span className="w-3 h-3 bg-green-100 dark:bg-green-900 rounded-full mr-2"></span>
                                                        <span className="text-xs text-gray-600 dark:text-gray-300">Auto-calculé</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <span className="w-3 h-3 bg-yellow-100 dark:bg-yellow-900 rounded-full mr-2"></span>
                                                        <span className="text-xs text-gray-600 dark:text-gray-300">En attente de données</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {getFilteredFields().length > 0 ? (
                                                <>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                                        {getInputFields().map(field => renderIndicateurField(field))}
                                                    </div>

                                                    {getCalculatedFields().length > 0 && (
                                                        <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
                                                            <h4 className="text-base font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                                                                <CalculatorIcon className="w-4 h-4 mr-2" />
                                                                Indicateurs calculés
                                                            </h4>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                {getCalculatedFields().map(field => renderIndicateurField(field))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <div className="text-center py-10">
                                                    <p className="text-gray-500 dark:text-gray-400">
                                                        Aucun indicateur disponible pour cette catégorie et cette période.
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex justify-end space-x-4 mt-6">
                                            <button
                                                type="button"
                                                onClick={handleSaveAsDraft}
                                                disabled={isSubmitting}
                                                className="inline-flex items-center px-6 py-3 border-2 border-gray-300 dark:border-gray-600 shadow-lg text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 disabled:opacity-50"
                                            >
                                                <SaveIcon className="w-5 h-5 mr-2" />
                                                {isSubmitting ? 'Enregistrement...' : 'Enregistrer comme brouillon'}
                                                {!isOnline && <WifiOffIcon className="w-4 h-4 ml-2 text-amber-500" />}
                                            </button>

                                            <button
                                                type="submit"
                                                disabled={processing || isSubmitting}
                                                className="inline-flex justify-center py-3 px-6 border-2 border-transparent shadow-lg text-sm font-medium rounded-lg text-white bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 disabled:opacity-50"
                                            >
                                                {(processing || isSubmitting) ? (
                                                    <>
                                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Traitement...
                                                    </>
                                                ) : (
                                                    <>
                                                        {isEditing ? 'Mettre à jour' : 'Enregistrer'}
                                                        {!isOnline && <WifiOffIcon className="w-4 h-4 ml-2 text-amber-500" />}
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-10 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <p className="text-gray-500 dark:text-gray-400">
                                            Aucune catégorie disponible pour cette période. Veuillez sélectionner une autre période.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="mt-4 inline-flex items-center px-6 py-3 border-2 border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                                        >
                                            <ArrowLeftIcon className="w-4 h-4 mr-2" />
                                            Retour à la sélection
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CollecteForm;
