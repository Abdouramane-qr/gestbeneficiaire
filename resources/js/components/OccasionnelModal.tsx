// import React, { useState, useEffect } from 'react';
// import { Dialog, Transition } from '@headlessui/react';
// import { Fragment } from 'react';
// import { useForm } from '@inertiajs/react';
// import { toast } from 'sonner';
// import { useOfflineStorage } from '@/hooks/useOfflineStorage';
// import { WifiOffIcon, WifiIcon, SaveIcon } from 'lucide-react';

// // Définition des types
// interface Beneficiaire {
//   id: number;
//   nom: string;
//   prenom: string;
// }

// interface FormulaireExceptionnelData {
//   beneficiaires_id: number | string;
//   type_collecte: string;

//   // Onglet 1: Occasionnel
//   formation_technique_recu: boolean;
//   formations_techniques: string[];
//   formation_entrepreneuriat_recu: boolean;
//   formations_entrepreneuriat: string[];

//   // Onglet 2: Démarrage JEMII
//   appreciation_organisation_interne_demarrage: number;
//   appreciation_services_adherents_demarrage: number;
//   appreciation_relations_externes_demarrage: number;
//   est_bancarise_demarrage: boolean;

//   // Onglet 3: Fin JEMII
//   appreciation_organisation_interne_fin: number;
//   appreciation_services_adherents_fin: number;
//   appreciation_relations_externes_fin: number;
//   est_bancarise_fin: boolean;
// }

// interface FormulaireExceptionnelModalProps {
//   isOpen: boolean;
//   closeModal: () => void;
//   collecte?: any;
//   exercices?: any;
//   formulaireData?: any;
//   beneficiaires: Beneficiaire[];
//   mode?: 'create' | 'edit';
// }

// // Options pour les formations
// const optionsFormationsTechniques = [
//   "Gestion de la qualité",
//   "Techniques de production",
//   "Gestion de l'approvisionnement",
//   "Techniques de transformation",
//   "Contrôle de la qualité",
//   "Normes et certification"
// ];

// const optionsFormationsEntrepreneuriat = [
//   "Gestion d'entreprise",
//   "Marketing et vente",
//   "Comptabilité de base",
//   "Planification financière",
//   "Plan d'affaires",
//   "Leadership et gestion d'équipe"
// ];

// const FormulaireExceptionnelModal = ({
//   isOpen,
//   closeModal,
//   collecte,
//   formulaireData,
//   beneficiaires,
//   mode = 'create'
// }: FormulaireExceptionnelModalProps) => {
//   const isEdit = mode === 'edit';
//   const [activeTab, setActiveTab] = useState("occasionnel");
//   const [isOnline, setIsOnline] = useState(navigator.onLine);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Utiliser notre hook de stockage hors ligne
//   const { saveOffline, pendingUploads, syncData } = useOfflineStorage();

//   // Surveiller l'état de la connexion
//   useEffect(() => {
//     const handleOnlineStatus = () => {
//       setIsOnline(navigator.onLine);
//     };

//     window.addEventListener('online', handleOnlineStatus);
//     window.addEventListener('offline', handleOnlineStatus);
//     return () => {
//       window.removeEventListener('online', handleOnlineStatus);
//       window.removeEventListener('offline', handleOnlineStatus);
//     };
//   }, []);

//   // Extraire les données du formulaire si elles existent
//   const initialData = formulaireData
//     ? {
//         beneficiaires_id: formulaireData.beneficiaires_id || '',
//         type_collecte: collecte?.type_collecte || 'standard',

//         // Onglet 1: Occasionnel
//         formation_technique_recu: formulaireData.formation_technique_recu ?? false,
//         formations_techniques: formulaireData.formations_techniques ?? [],
//         formation_entrepreneuriat_recu: formulaireData.formation_entrepreneuriat_recu ?? false,
//         formations_entrepreneuriat: formulaireData.formations_entrepreneuriat ?? [],

//         // Onglet 2: Démarrage JEMII
//         appreciation_organisation_interne_demarrage: formulaireData.appreciation_organisation_interne_demarrage ?? null,
//         appreciation_services_adherents_demarrage: formulaireData.appreciation_services_adherents_demarrage ?? null,
//         appreciation_relations_externes_demarrage: formulaireData.appreciation_relations_externes_demarrage ?? null,
//         est_bancarise_demarrage: formulaireData.est_bancarise_demarrage ?? false,

//         // Onglet 3: Fin JEMII
//         appreciation_organisation_interne_fin: formulaireData.appreciation_organisation_interne_fin ?? null,
//         appreciation_services_adherents_fin: formulaireData.appreciation_services_adherents_fin ?? null,
//         appreciation_relations_externes_fin: formulaireData.appreciation_relations_externes_fin ?? null,
//         est_bancarise_fin: formulaireData.est_bancarise_fin ?? false,
//       }
//     : {
//         beneficiaires_id: '',
//         type_collecte: 'standard',

//         // Onglet 1: Occasionnel
//         formation_technique_recu: false,
//         formations_techniques: [],
//         formation_entrepreneuriat_recu: false,
//         formations_entrepreneuriat: [],

//         // Onglet 2: Démarrage JEMII - Utiliser des valeurs par défaut nulles
//         appreciation_organisation_interne_demarrage: null,
//         appreciation_services_adherents_demarrage: null,
//         appreciation_relations_externes_demarrage: null,
//         est_bancarise_demarrage: false,

//         // Onglet 3: Fin JEMII - Utiliser des valeurs par défaut nulles
//         appreciation_organisation_interne_fin: null,
//         appreciation_services_adherents_fin: null,
//         appreciation_relations_externes_fin: null,
//         est_bancarise_fin: false,
//       };

//   const { data, setData, post, put, errors, processing, reset } = useForm<FormulaireExceptionnelData>(initialData);

//   // Gestion des formations techniques
//   const [selectedFormationsTechniques, setSelectedFormationsTechniques] = useState<string[]>(
//     initialData.formations_techniques || []
//   );

//   // Gestion des formations entrepreneuriat
//   const [selectedFormationsEntrepreneuriat, setSelectedFormationsEntrepreneuriat] = useState<string[]>(
//     initialData.formations_entrepreneuriat || []
//   );

//   // Mise à jour des données lors de l'ouverture du modal
//   useEffect(() => {
//     if (formulaireData) {
//       setData({
//         ...initialData
//       });
//       setSelectedFormationsTechniques(initialData.formations_techniques);
//       setSelectedFormationsEntrepreneuriat(initialData.formations_entrepreneuriat);
//     } else {
//       reset();
//       setSelectedFormationsTechniques([]);
//       setSelectedFormationsEntrepreneuriat([]);
//     }
//   }, [formulaireData, isOpen]);

//   // Gestion des formations techniques
//   const handleFormationTechniqueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.checked;
//     setData('formation_technique_recu', value);

//     if (!value) {
//       setSelectedFormationsTechniques([]);
//       setData('formations_techniques', []);
//     }
//   };

//   const handleFormationTechniqueSelect = (formation: string) => {
//     let updatedFormations: string[];

//     if (selectedFormationsTechniques.includes(formation)) {
//       updatedFormations = selectedFormationsTechniques.filter(item => item !== formation);
//     } else {
//       updatedFormations = [...selectedFormationsTechniques, formation];
//     }

//     setSelectedFormationsTechniques(updatedFormations);
//     setData('formations_techniques', updatedFormations);
//   };

//   // Gestion des formations entrepreneuriat
//   const handleFormationEntrepreneuriatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.checked;
//     setData('formation_entrepreneuriat_recu', value);

//     if (!value) {
//       setSelectedFormationsEntrepreneuriat([]);
//       setData('formations_entrepreneuriat', []);
//     }
//   };

//   const handleFormationEntrepreneuriatSelect = (formation: string) => {
//     let updatedFormations: string[];

//     if (selectedFormationsEntrepreneuriat.includes(formation)) {
//       updatedFormations = selectedFormationsEntrepreneuriat.filter(item => item !== formation);
//     } else {
//       updatedFormations = [...selectedFormationsEntrepreneuriat, formation];
//     }

//     setSelectedFormationsEntrepreneuriat(updatedFormations);
//     setData('formations_entrepreneuriat', updatedFormations);
//   };

//   // Préparer les données pour la sauvegarde
//   const prepareDonnees = () => {
//     return {
//       formulaire_exceptionnel: {
//         // Informations du bénéficiaire
//         beneficiaires_id: data.beneficiaires_id,

//         // Onglet 1: Occasionnel
//         formation_technique_recu: data.formation_technique_recu,
//         formations_techniques: data.formations_techniques,
//         formation_entrepreneuriat_recu: data.formation_entrepreneuriat_recu,
//         formations_entrepreneuriat: data.formations_entrepreneuriat,

//         // Onglet 2: Démarrage JEMII
//         appreciation_organisation_interne_demarrage: data.appreciation_organisation_interne_demarrage,
//         appreciation_services_adherents_demarrage: data.appreciation_services_adherents_demarrage,
//         appreciation_relations_externes_demarrage: data.appreciation_relations_externes_demarrage,
//         est_bancarise_demarrage: data.est_bancarise_demarrage,

//         // Onglet 3: Fin JEMII
//         appreciation_organisation_interne_fin: data.appreciation_organisation_interne_fin,
//         appreciation_services_adherents_fin: data.appreciation_services_adherents_fin,
//         appreciation_relations_externes_fin: data.appreciation_relations_externes_fin,
//         est_bancarise_fin: data.est_bancarise_fin,
//       }
//     };
//   };

//   // Sauvegarde hors ligne
//   const saveOfflineData = async () => {
//     try {
//       // Récupérer le bénéficiaire sélectionné
//       const beneficiaireId = parseInt(data.beneficiaires_id.toString());
//       const beneficiaireInfo = beneficiaires.find(b => b.id === beneficiaireId);

//       if (!beneficiaireInfo) {
//         toast.error('Aucun bénéficiaire sélectionné');
//         return false;
//       }

//       // Convertir l'ID du bénéficiaire en "entreprise_id" pour le stockage
//       // Dans une vraie implémentation, il faudrait récupérer l'entreprise associée
//       const entrepriseId = beneficiaireId; // Simplification pour cet exemple

//       // Utiliser un exercice fictif
//       const exerciceId = 1;

//       // Utiliser une période spéciale pour les collectes exceptionnelles
//       // (habituellement nulle, mais on utilise une valeur spéciale pour IndexedDB)
//       const periodeId = "exceptionnel";

//       const donnees = prepareDonnees();
//       const isDraft = data.type_collecte === 'brouillon';

//       await saveOffline(
//         entrepriseId,
//         exerciceId,
//         periodeId,
//         donnees,
//         isDraft
//       );

//       return true;
//     } catch (error) {
//       console.error('Erreur lors de la sauvegarde hors ligne:', error);
//       return false;
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (isSubmitting) return;
//     setIsSubmitting(true);

//     // Validation de base côté client
//     if (!data.beneficiaires_id) {
//       toast.error('Veuillez sélectionner un promoteur');
//       setIsSubmitting(false);
//       return;
//     }

//     if (isOnline) {
//       // Mode en ligne - Soumettre au serveur
//       const url = isEdit
//         ? route('formulaires.exceptionnels.update', collecte.id)
//         : route('formulaires.exceptionnels.store');

//       const successMessage = isEdit
//         ? 'Formulaire exceptionnel mis à jour avec succès'
//         : 'Formulaire exceptionnel ajouté avec succès';

//       const errorMessage = isEdit
//         ? 'Échec de la mise à jour du formulaire exceptionnel'
//         : 'Échec de l\'ajout du formulaire exceptionnel';

//       if (isEdit) {
//         put(url, {
//           onSuccess: () => {
//             toast.success(successMessage);
//             setIsSubmitting(false);
//             closeModal();
//           },
//           onError: (errors) => {
//             console.error("Erreurs de validation:", errors);
//             toast.error(errorMessage);
//             setIsSubmitting(false);
//           },
//         });
//       } else {
//         post(url, {
//           onSuccess: () => {
//             toast.success(successMessage);
//             setIsSubmitting(false);
//             closeModal();
//           },
//           onError: (errors) => {
//             console.error("Erreurs de validation:", errors);
//             toast.error(errorMessage);
//             setIsSubmitting(false);
//           },
//         });
//       }
//     } else {
//       // Mode hors ligne - Sauvegarder dans IndexedDB
//       const result = await saveOfflineData();

//       if (result) {
//         toast.success('Formulaire exceptionnel sauvegardé localement. Il sera synchronisé une fois en ligne.');
//         closeModal();
//       } else {
//         toast.error('Échec de la sauvegarde locale. Veuillez réessayer.');
//       }

//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <Transition appear show={isOpen} as={Fragment}>
//       <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={closeModal}>
//         <div className="min-h-screen px-4 text-center">
//           <Transition.Child
//             as={Fragment}
//             enter="ease-out duration-300"
//             enterFrom="opacity-0"
//             enterTo="opacity-100"
//             leave="ease-in duration-200"
//             leaveFrom="opacity-100"
//             leaveTo="opacity-0"
//           >
//             <div className="fixed inset-0 bg-black bg-opacity-30" />
//           </Transition.Child>

//           <span className="inline-block h-screen align-middle" aria-hidden="true">
//             &#8203;
//           </span>

//           <Transition.Child
//             as={Fragment}
//             enter="ease-out duration-300"
//             enterFrom="opacity-0 scale-95"
//             enterTo="opacity-100 scale-100"
//             leave="ease-in duration-200"
//             leaveFrom="opacity-100 scale-100"
//             leaveTo="opacity-0 scale-95"
//           >
//             <Dialog.Panel className="inline-block w-full max-w-5xl p-4 sm:p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-lg">
//               <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center justify-between">
//                 <span>{isEdit ? 'Modifier le formulaire exceptionnel' : 'Nouveau formulaire exceptionnel'}</span>
//                 <div className="text-sm font-normal flex items-center">
//                   {isOnline ? (
//                     <span className="inline-flex items-center text-green-600 dark:text-green-400">
//                       <WifiIcon className="w-4 h-4 mr-1" />
//                       En ligne
//                     </span>
//                   ) : (
//                     <span className="inline-flex items-center text-amber-600 dark:text-amber-400">
//                       <WifiOffIcon className="w-4 h-4 mr-1" />
//                       Hors ligne
//                     </span>
//                   )}
//                 </div>
//               </Dialog.Title>

//               <form onSubmit={handleSubmit} className="max-h-[calc(100vh-200px)] overflow-y-auto pr-1">
//                 {/* Section bénéficiaire */}
//                 <div className="mb-6">
//                   <label htmlFor="beneficiaires_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     Promoteurs *
//                   </label>
//                   <select
//                     id="beneficiaires_id"
//                     value={data.beneficiaires_id}
//                     onChange={(e) => setData('beneficiaires_id', e.target.value)}
//                     className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
//                     required
//                   >
//                     <option value="">Sélectionnez un Promoteurs</option>
//                     {beneficiaires.map((beneficiaire) => (
//                       <option key={beneficiaire.id} value={beneficiaire.id}>
//                         {beneficiaire.nom} {beneficiaire.prenom}
//                       </option>
//                     ))}
//                   </select>
//                   {errors.beneficiaires_id && (
//                     <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.beneficiaires_id}</p>
//                   )}
//                 </div>

//                 {/* Section type de collecte */}
//                 <div className="mb-6">
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     Type de collecte
//                   </label>
//                   <div className="flex space-x-4">
//                     <label className="inline-flex items-center">
//                       <input
//                         type="radio"
//                         name="type_collecte"
//                         value="standard"
//                         checked={data.type_collecte === 'standard'}
//                         onChange={() => setData('type_collecte', 'standard')}
//                         className="form-radio h-4 w-4 text-blue-600 dark:text-blue-400"
//                       />
//                       <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Standard</span>
//                     </label>
//                     <label className="inline-flex items-center">
//                       <input
//                         type="radio"
//                         name="type_collecte"
//                         value="brouillon"
//                         checked={data.type_collecte === 'brouillon'}
//                         onChange={() => setData('type_collecte', 'brouillon')}
//                         className="form-radio h-4 w-4 text-blue-600 dark:text-blue-400"
//                       />
//                       <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Brouillon</span>
//                     </label>
//                   </div>
//                   {errors.type_collecte && (
//                     <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.type_collecte}</p>
//                   )}
//                 </div>

//                 {/* Onglets manuels (sans utiliser la bibliothèque) */}
//                 <div className="w-full">
//                   <div className="mb-4 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
//                     <ul className="flex flex-wrap -mb-px">
//                       <li className="mr-2">
//                         <button
//                           type="button"
//                           onClick={() => setActiveTab("occasionnel")}
//                           className={`inline-block p-3 sm:p-4 rounded-t-lg text-sm ${
//                             activeTab === "occasionnel"
//                               ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-500 dark:border-blue-500"
//                               : "hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
//                           }`}
//                         >
//                           Exceptionnelle
//                         </button>
//                       </li>
//                       <li className="mr-2">
//                         <button
//                           type="button"
//                           onClick={() => setActiveTab("demarrage")}
//                           className={`inline-block p-3 sm:p-4 rounded-t-lg text-sm ${
//                             activeTab === "demarrage"
//                               ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-500 dark:border-blue-500"
//                               : "hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
//                           }`}
//                         >
//                           Démarrage JEMII
//                         </button>
//                       </li>
//                       <li>
//                         <button
//                           type="button"
//                           onClick={() => setActiveTab("fin")}
//                           className={`inline-block p-3 sm:p-4 rounded-t-lg text-sm ${
//                             activeTab === "fin"
//                               ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-500 dark:border-blue-500"
//                               : "hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
//                           }`}
//                         >
//                           Fin JEMII
//                         </button>
//                       </li>
//                     </ul>
//                   </div>

//                   {/* Contenu de l'onglet Occasionnel */}
//                   {activeTab === "occasionnel" && (
//                     <div className="space-y-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
//                       {/* Formations techniques */}
//                       <div className="space-y-4">
//                         <div className="flex items-center">
//                           <input
//                             type="checkbox"
//                             id="formation_technique_recu"
//                             checked={data.formation_technique_recu}
//                             onChange={handleFormationTechniqueChange}
//                             className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
//                           />
//                           <label htmlFor="formation_technique_recu" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
//                             Avez-vous reçu des formations techniques dans le cadre du projet ?
//                           </label>
//                         </div>

//                         {data.formation_technique_recu && (
//                           <div className="ml-6">
//                             <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                               Sélectionnez les formations techniques reçues :
//                             </p>
//                             <div className="space-y-2 grid grid-cols-1 md:grid-cols-2 gap-2">
//                               {optionsFormationsTechniques.map((formation) => (
//                                 <div key={formation} className="flex items-center">
//                                   <input
//                                     type="checkbox"
//                                     id={`technique-${formation}`}
//                                     checked={selectedFormationsTechniques.includes(formation)}
//                                     onChange={() => handleFormationTechniqueSelect(formation)}
//                                     className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
//                                   />
//                                   <label htmlFor={`technique-${formation}`} className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
//                                     {formation}
//                                   </label>
//                                 </div>
//                               ))}
//                             </div>
//                           </div>
//                         )}
//                       </div>

//                       {/* Formations entrepreneuriat */}
//                       <div className="space-y-4">
//                         <div className="flex items-center">
//                           <input
//                             type="checkbox"
//                             id="formation_entrepreneuriat_recu"
//                             checked={data.formation_entrepreneuriat_recu}
//                             onChange={handleFormationEntrepreneuriatChange}
//                             className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
//                           />
//                           <label htmlFor="formation_entrepreneuriat_recu" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
//                             Avez-vous reçu des formations en entrepreneuriat dans le cadre du projet ?
//                           </label>
//                         </div>

//                         {data.formation_entrepreneuriat_recu && (
//                           <div className="ml-6">
//                             <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                               Sélectionnez les formations en entrepreneuriat reçues :
//                             </p>
//                             <div className="space-y-2 grid grid-cols-1 md:grid-cols-2 gap-2">
//                               {optionsFormationsEntrepreneuriat.map((formation) => (
//                                 <div key={formation} className="flex items-center">
//                                   <input
//                                     type="checkbox"
//                                     id={`entrepreneuriat-${formation}`}
//                                     checked={selectedFormationsEntrepreneuriat.includes(formation)}
//                                     onChange={() => handleFormationEntrepreneuriatSelect(formation)}
//                                     className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
//                                   />
//                                   <label htmlFor={`entrepreneuriat-${formation}`} className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
//                                     {formation}
//                                   </label>
//                                 </div>
//                               ))}
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   )}

//                   {/* Contenu de l'onglet Démarrage JEMII */}
//                   {activeTab === "demarrage" && (
//                     <div className="space-y-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
//                       <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-4">Questionnaire de démarrage JEMII</h3>

//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         {/* Appréciation Organisation Interne */}
//                         <div className="space-y-3">
//                           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                             Appréciation sur l'organisation interne de la coopérative
//                           </label>
//                           <select
//                             value={data.appreciation_organisation_interne_demarrage || ''}
//                             onChange={(e) => setData('appreciation_organisation_interne_demarrage', e.target.value ? parseInt(e.target.value) : null)}
//                             className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
//                           >
//                             <option value="">-- Sélectionnez une appréciation --</option>
//                             <option value="1">1 - Faible</option>
//                             <option value="2">2 - Moyen</option>
//                             <option value="3">3 - Bon</option>
//                           </select>
//                           {errors.appreciation_organisation_interne_demarrage && (
//                             <p className="text-sm text-red-600 dark:text-red-400">{errors.appreciation_organisation_interne_demarrage}</p>
//                           )}
//                         </div>

//                         {/* Appréciation Services aux Adhérents */}
//                         <div className="space-y-3">
//                           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                             Appréciation des services fournis aux adhérents
//                           </label>
//                           <select
//                             value={data.appreciation_services_adherents_demarrage || ''}
//                             onChange={(e) => setData('appreciation_services_adherents_demarrage', e.target.value ? parseInt(e.target.value) : null)}
//                             className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
//                           >
//                             <option value="">-- Sélectionnez une appréciation --</option>
//                             <option value="1">1 - Faible</option>
//                             <option value="2">2 - Moyen</option>
//                             <option value="3">3 - Bon</option>
//                           </select>
//                           {errors.appreciation_services_adherents_demarrage && (
//                             <p className="text-sm text-red-600 dark:text-red-400">{errors.appreciation_services_adherents_demarrage}</p>
//                           )}
//                         </div>

//                         {/* Appréciation Relations Externes */}
//                         <div className="space-y-3">
//                           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                             Appréciation des relations externes de la coopérative
//                           </label>
//                           <select
//                             value={data.appreciation_relations_externes_demarrage || ''}
//                             onChange={(e) => setData('appreciation_relations_externes_demarrage', e.target.value ? parseInt(e.target.value) : null)}
//                             className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
//                           >
//                             <option value="">-- Sélectionnez une appréciation --</option>
//                             <option value="1">1 - Faible</option>
//                             <option value="2">2 - Moyen</option>
//                             <option value="3">3 - Bon</option>
//                           </select>
//                           {errors.appreciation_relations_externes_demarrage && (
//                             <p className="text-sm text-red-600 dark:text-red-400">{errors.appreciation_relations_externes_demarrage}</p>
//                           )}
//                         </div>

//                         {/* Bancarisation */}
//                         <div className="space-y-2">
//                           <div className="flex items-center">
//                             <input
//                               type="checkbox"
//                               id="est_bancarise_demarrage"
//                               checked={data.est_bancarise_demarrage}
//                               onChange={(e) => setData('est_bancarise_demarrage', e.target.checked)}
//                               className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
//                             />
//                             <label htmlFor="est_bancarise_demarrage" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
//                               La coopérative est-elle bancarisée ?
//                             </label>
//                           </div>
//                           {errors.est_bancarise_demarrage && (
//                             <p className="text-sm text-red-600 dark:text-red-400">{errors.est_bancarise_demarrage}</p>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   {/* Contenu de l'onglet Fin JEMII */}
//                   {activeTab === "fin" && (
//                     <div className="space-y-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
//                       <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-4">Questionnaire de fin JEMII</h3>

//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         {/* Appréciation Organisation Interne */}
//                         <div className="space-y-3">
//                           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                             Appréciation sur l'organisation interne de la coopérative
//                           </label>
//                           <select
//                             value={data.appreciation_organisation_interne_fin || ''}
//                             onChange={(e) => setData('appreciation_organisation_interne_fin', e.target.value ? parseInt(e.target.value) : null)}
//                             className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
//                           >
//                             <option value="">-- Sélectionnez une appréciation --</option>
//                             <option value="1">1 - Faible</option>
//                             <option value="2">2 - Moyen</option>
//                             <option value="3">3 - Bon</option>
//                           </select>
//                           {errors.appreciation_organisation_interne_fin && (
//                             <p className="text-sm text-red-600 dark:text-red-400">{errors.appreciation_organisation_interne_fin}</p>
//                           )}
//                         </div>

//                         {/* Appréciation Services aux Adhérents */}
//                         <div className="space-y-3">
//                           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                             Appréciation des services fournis aux adhérents
//                           </label>
//                           <select
//                             value={data.appreciation_services_adherents_fin || ''}
//                             onChange={(e) => setData('appreciation_services_adherents_fin', e.target.value ? parseInt(e.target.value) : null)}
//                             className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
//                           >
//                             <option value="">-- Sélectionnez une appréciation --</option>
//                             <option value="1">1 - Faible</option>
//                             <option value="2">2 - Moyen</option>
//                             <option value="3">3 - Bon</option>
//                           </select>
//                           {errors.appreciation_services_adherents_fin && (
//                             <p className="text-sm text-red-600 dark:text-red-400">{errors.appreciation_services_adherents_fin}</p>
//                           )}
//                         </div>

//                         {/* Appréciation Relations Externes */}
//                         <div className="space-y-3">
//                           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                             Appréciation des relations externes de la coopérative
//                           </label>
//                           <select
//                             value={data.appreciation_relations_externes_fin || ''}
//                             onChange={(e) => setData('appreciation_relations_externes_fin', e.target.value ? parseInt(e.target.value) : null)}
//                             className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
//                           >
//                             <option value="">-- Sélectionnez une appréciation --</option>
//                             <option value="1">1 - Faible</option>
//                             <option value="2">2 - Moyen</option>
//                             <option value="3">3 - Bon</option>
//                           </select>
//                           {errors.appreciation_relations_externes_fin && (
//                             <p className="text-sm text-red-600 dark:text-red-400">{errors.appreciation_relations_externes_fin}</p>
//                           )}
//                         </div>

//                         {/* Bancarisation */}
//                         <div className="space-y-2">
//                           <div className="flex items-center">
//                             <input
//                               type="checkbox"
//                               id="est_bancarise_fin"
//                               checked={data.est_bancarise_fin}
//                               onChange={(e) => setData('est_bancarise_fin', e.target.checked)}
//                               className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
//                             />
//                             <label htmlFor="est_bancarise_fin" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
//                               La coopérative est-elle bancarisée ?
//                             </label>
//                           </div>
//                           {errors.est_bancarise_fin && (
//                             <p className="text-sm text-red-600 dark:text-red-400">{errors.est_bancarise_fin}</p>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Boutons d'action */}
//                 <div className="mt-6 flex justify-end space-x-3">
//                   <button
//                     type="button"
//                     onClick={closeModal}
//                     className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                   >
//                     Annuler
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={isSubmitting || processing}
//                     className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {isSubmitting || processing ? (
//                       <>
//                         <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                         </svg>
//                         Traitement...
//                       </>
//                     ) : (
//                       <>
//                         <SaveIcon className="w-4 h-4 mr-2" />
//                         {isEdit ? 'Mettre à jour' : 'Enregistrer'}
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </form>
//             </Dialog.Panel>
//           </Transition.Child>
//         </div>
//       </Dialog>
//     </Transition>
//   );
// };

// export default FormulaireExceptionnelModal;
import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { withOfflineSupport } from '@/components/withOfflineSupport';
import { WifiOffIcon, WifiIcon, SaveIcon } from 'lucide-react';

// Définition des types
interface Beneficiaire {
  id: number;
  nom: string;
  prenom: string;
}

interface FormulaireExceptionnelData {
  beneficiaires_id: number | string;
  type_collecte: string;

  // Onglet 1: Occasionnel
  formation_technique_recu: boolean;
  formations_techniques: string[];
  formation_entrepreneuriat_recu: boolean;
  formations_entrepreneuriat: string[];

  // Onglet 2: Démarrage JEMII
  appreciation_organisation_interne_demarrage: number;
  appreciation_services_adherents_demarrage: number;
  appreciation_relations_externes_demarrage: number;
  est_bancarise_demarrage: boolean;

  // Onglet 3: Fin JEMII
  appreciation_organisation_interne_fin: number;
  appreciation_services_adherents_fin: number;
  appreciation_relations_externes_fin: number;
  est_bancarise_fin: boolean;
}

interface FormulaireExceptionnelModalProps {
  isOpen: boolean;
  closeModal: () => void;
  collecte?: any;
  exercices?: any;
  formulaireData?: any;
  beneficiaires: Beneficiaire[];
  mode?: 'create' | 'edit';
  // Propriétés ajoutées par le HOC withOfflineSupport
  isOnline?: boolean;
  isSubmitting?: boolean;
  handleOfflineSave?: (data: any, formType: string) => Promise<boolean>;
  handleSync?: () => Promise<void>;
  pendingUploads?: number;
}

// Options pour les formations
const optionsFormationsTechniques = [
  "Gestion de la qualité",
  "Techniques de production",
  "Gestion de l'approvisionnement",
  "Techniques de transformation",
  "Contrôle de la qualité",
  "Normes et certification"
];

const optionsFormationsEntrepreneuriat = [
  "Gestion d'entreprise",
  "Marketing et vente",
  "Comptabilité de base",
  "Planification financière",
  "Plan d'affaires",
  "Leadership et gestion d'équipe"
];

const FormulaireExceptionnelModal = ({
  isOpen,
  closeModal,
  collecte,
  formulaireData,
  beneficiaires,
  exercices = [],
  mode = 'create',
  // Props du HOC
  isOnline = navigator.onLine,
  isSubmitting = false,
  handleOfflineSave,
  handleSync,
  pendingUploads = 0
}: FormulaireExceptionnelModalProps) => {
  const isEdit = mode === 'edit';
  const [activeTab, setActiveTab] = useState("occasionnel");
  const [submitting, setSubmitting] = useState(false);

  // Extraire les données du formulaire si elles existent
  const initialData = formulaireData
    ? {
        beneficiaires_id: formulaireData.beneficiaires_id || '',
        type_collecte: collecte?.type_collecte || 'standard',
        exercice_id: formulaireData.exercice_id || exercices[0]?.id || '',

        // Onglet 1: Occasionnel
        formation_technique_recu: formulaireData.formation_technique_recu ?? false,
        formations_techniques: formulaireData.formations_techniques ?? [],
        formation_entrepreneuriat_recu: formulaireData.formation_entrepreneuriat_recu ?? false,
        formations_entrepreneuriat: formulaireData.formations_entrepreneuriat ?? [],

        // Onglet 2: Démarrage JEMII
        appreciation_organisation_interne_demarrage: formulaireData.appreciation_organisation_interne_demarrage ?? null,
        appreciation_services_adherents_demarrage: formulaireData.appreciation_services_adherents_demarrage ?? null,
        appreciation_relations_externes_demarrage: formulaireData.appreciation_relations_externes_demarrage ?? null,
        est_bancarise_demarrage: formulaireData.est_bancarise_demarrage ?? false,

        // Onglet 3: Fin JEMII
        appreciation_organisation_interne_fin: formulaireData.appreciation_organisation_interne_fin ?? null,
        appreciation_services_adherents_fin: formulaireData.appreciation_services_adherents_fin ?? null,
        appreciation_relations_externes_fin: formulaireData.appreciation_relations_externes_fin ?? null,
        est_bancarise_fin: formulaireData.est_bancarise_fin ?? false,
      }
    : {
        beneficiaires_id: '',
        type_collecte: 'standard',
        exercice_id: exercices[0]?.id || '',

        // Onglet 1: Occasionnel
        formation_technique_recu: false,
        formations_techniques: [],
        formation_entrepreneuriat_recu: false,
        formations_entrepreneuriat: [],

        // Onglet 2: Démarrage JEMII
        appreciation_organisation_interne_demarrage: null,
        appreciation_services_adherents_demarrage: null,
        appreciation_relations_externes_demarrage: null,
        est_bancarise_demarrage: false,

        // Onglet 3: Fin JEMII
        appreciation_organisation_interne_fin: null,
        appreciation_services_adherents_fin: null,
        appreciation_relations_externes_fin: null,
        est_bancarise_fin: false,
      };

  const { data, setData, post, put, errors, processing, reset } = useForm<FormulaireExceptionnelData>(initialData);

  // Gestion des formations techniques
  const [selectedFormationsTechniques, setSelectedFormationsTechniques] = useState<string[]>(
    initialData.formations_techniques || []
  );

  // Gestion des formations entrepreneuriat
  const [selectedFormationsEntrepreneuriat, setSelectedFormationsEntrepreneuriat] = useState<string[]>(
    initialData.formations_entrepreneuriat || []
  );

  // Mise à jour des données lors de l'ouverture du modal
  useEffect(() => {
    if (formulaireData) {
      setData({
        ...initialData
      });
      setSelectedFormationsTechniques(initialData.formations_techniques);
      setSelectedFormationsEntrepreneuriat(initialData.formations_entrepreneuriat);
    } else {
      reset();
      setSelectedFormationsTechniques([]);
      setSelectedFormationsEntrepreneuriat([]);
    }
  }, [formulaireData, isOpen]);

  // Gestion des formations techniques
  const handleFormationTechniqueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.checked;
    setData('formation_technique_recu', value);

    if (!value) {
      setSelectedFormationsTechniques([]);
      setData('formations_techniques', []);
    }
  };

  const handleFormationTechniqueSelect = (formation: string) => {
    let updatedFormations: string[];

    if (selectedFormationsTechniques.includes(formation)) {
      updatedFormations = selectedFormationsTechniques.filter(item => item !== formation);
    } else {
      updatedFormations = [...selectedFormationsTechniques, formation];
    }

    setSelectedFormationsTechniques(updatedFormations);
    setData('formations_techniques', updatedFormations);
  };

  // Gestion des formations entrepreneuriat
  const handleFormationEntrepreneuriatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.checked;
    setData('formation_entrepreneuriat_recu', value);

    if (!value) {
      setSelectedFormationsEntrepreneuriat([]);
      setData('formations_entrepreneuriat', []);
    }
  };

  const handleFormationEntrepreneuriatSelect = (formation: string) => {
    let updatedFormations: string[];

    if (selectedFormationsEntrepreneuriat.includes(formation)) {
      updatedFormations = selectedFormationsEntrepreneuriat.filter(item => item !== formation);
    } else {
      updatedFormations = [...selectedFormationsEntrepreneuriat, formation];
    }

    setSelectedFormationsEntrepreneuriat(updatedFormations);
    setData('formations_entrepreneuriat', updatedFormations);
  };

  // Validation côté client avant soumission
  const validateForm = () => {
    // Validation de base côté client
    if (!data.beneficiaires_id) {
      toast.error('Veuillez sélectionner un promoteur');
      return false;
    }

    if (!data.exercice_id) {
      toast.error('Veuillez sélectionner un exercice');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (submitting || isSubmitting) return;
    if (!validateForm()) return;

    setSubmitting(true);

    try {
      if (isOnline) {
        // Mode en ligne - Soumettre au serveur
        const url = isEdit
          ? route('formulaires.exceptionnels.update', collecte.id)
          : route('formulaires.exceptionnels.store');

        const successMessage = isEdit
          ? 'Formulaire exceptionnel mis à jour avec succès'
          : 'Formulaire exceptionnel ajouté avec succès';

        const errorMessage = isEdit
          ? 'Échec de la mise à jour du formulaire exceptionnel'
          : 'Échec de l\'ajout du formulaire exceptionnel';

        if (isEdit) {
          put(url, {
            onSuccess: () => {
              toast.success(successMessage);
              setSubmitting(false);
              closeModal();
            },
            onError: (errors) => {
              console.error("Erreurs de validation:", errors);
              toast.error(errorMessage);
              setSubmitting(false);
            },
          });
        } else {
          post(url, {
            onSuccess: () => {
              toast.success(successMessage);
              setSubmitting(false);
              closeModal();
            },
            onError: (errors) => {
              console.error("Erreurs de validation:", errors);
              toast.error(errorMessage);
              setSubmitting(false);
            },
          });
        }
      } else {
        // Mode hors ligne - Sauvegarder dans IndexedDB
        if (handleOfflineSave) {
          const result = await handleOfflineSave(data, 'exceptionnel');

          if (result) {
            toast.success('Formulaire exceptionnel sauvegardé localement. Il sera synchronisé une fois en ligne.');
            closeModal();
          } else {
            toast.error('Échec de la sauvegarde locale. Veuillez réessayer.');
          }
        } else {
          toast.error('Le mode hors ligne n\'est pas disponible. Veuillez vous reconnecter.');
        }
      }
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      toast.error('Une erreur est survenue lors de la soumission du formulaire');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={closeModal}>
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-30" />
          </Transition.Child>

          <span className="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="inline-block w-full max-w-5xl p-4 sm:p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-lg">
              <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center justify-between">
                <span>{isEdit ? 'Modifier le formulaire exceptionnel' : 'Nouveau formulaire exceptionnel'}</span>
                <div className="text-sm font-normal flex items-center">
                  {isOnline ? (
                    <span className="inline-flex items-center text-green-600 dark:text-green-400">
                      <WifiIcon className="w-4 h-4 mr-1" />
                      En ligne
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-amber-600 dark:text-amber-400">
                      <WifiOffIcon className="w-4 h-4 mr-1" />
                      Hors ligne
                      {pendingUploads > 0 && (
                        <span className="ml-2 text-xs bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100 px-2 py-0.5 rounded-full">
                          {pendingUploads} en attente
                        </span>
                      )}
                    </span>
                  )}
                </div>
              </Dialog.Title>

              <form onSubmit={handleSubmit} className="max-h-[calc(100vh-200px)] overflow-y-auto pr-1">
                {/* Section bénéficiaire et exercice */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label htmlFor="beneficiaires_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Promoteurs *
                    </label>
                    <select
                      id="beneficiaires_id"
                      value={data.beneficiaires_id}
                      onChange={(e) => setData('beneficiaires_id', e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      required
                    >
                      <option value="">Sélectionnez un Promoteur</option>
                      {beneficiaires.map((beneficiaire) => (
                        <option key={beneficiaire.id} value={beneficiaire.id}>
                          {beneficiaire.nom} {beneficiaire.prenom}
                        </option>
                      ))}
                    </select>
                    {errors.beneficiaires_id && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.beneficiaires_id}</p>
                    )}
                  </div>

                  <div>
                    {/* <label htmlFor="exercice_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Exercice *
                    </label> */}
                    {/* <select
                      id="exercice_id"
                      value={data.exercice_id}
                      onChange={(e) => setData('exercice_id', e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      required
                    >
                      <option value="">Sélectionnez un exercice</option>
                      {exercices.map((exercice) => (
                        <option key={exercice?.id} value={exercice?.id}>
                          {exercice.annee}
                        </option>
                      ))}
                    </select> */}
                    {errors.exercice_id && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.exercice_id}</p>
                    )}
                  </div>
                </div>

                {/* Section type de collecte */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Type de collecte
                  </label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="type_collecte"
                        value="standard"
                        checked={data.type_collecte === 'standard'}
                        onChange={() => setData('type_collecte', 'standard')}
                        className="form-radio h-4 w-4 text-blue-600 dark:text-blue-400"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Standard</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="type_collecte"
                        value="brouillon"
                        checked={data.type_collecte === 'brouillon'}
                        onChange={() => setData('type_collecte', 'brouillon')}
                        className="form-radio h-4 w-4 text-blue-600 dark:text-blue-400"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Brouillon</span>
                    </label>
                  </div>
                  {errors.type_collecte && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.type_collecte}</p>
                  )}
                </div>

                {/* Onglets manuels (sans utiliser la bibliothèque) */}
                <div className="w-full">
                  <div className="mb-4 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                    <ul className="flex flex-wrap -mb-px">
                      <li className="mr-2">
                        <button
                          type="button"
                          onClick={() => setActiveTab("occasionnel")}
                          className={`inline-block p-3 sm:p-4 rounded-t-lg text-sm ${
                            activeTab === "occasionnel"
                              ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                              : "hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                          }`}
                        >
                          Exceptionnelle
                        </button>
                      </li>
                      <li className="mr-2">
                        <button
                          type="button"
                          onClick={() => setActiveTab("demarrage")}
                          className={`inline-block p-3 sm:p-4 rounded-t-lg text-sm ${
                            activeTab === "demarrage"
                              ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                              : "hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                          }`}
                        >
                          Démarrage JEMII
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          onClick={() => setActiveTab("fin")}
                          className={`inline-block p-3 sm:p-4 rounded-t-lg text-sm ${
                            activeTab === "fin"
                              ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                              : "hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                          }`}
                        >
                          Fin JEMII
                        </button>
                      </li>
                    </ul>
                  </div>

                  {/* Contenu de l'onglet Occasionnel */}
                  {activeTab === "occasionnel" && (
                    <div className="space-y-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                      {/* Formations techniques */}
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="formation_technique_recu"
                            checked={data.formation_technique_recu}
                            onChange={handleFormationTechniqueChange}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                          />
                          <label htmlFor="formation_technique_recu" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                            Avez-vous reçu des formations techniques dans le cadre du projet ?
                          </label>
                        </div>

                        {data.formation_technique_recu && (
                          <div className="ml-6">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Sélectionnez les formations techniques reçues :
                            </p>
                            <div className="space-y-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                              {optionsFormationsTechniques.map((formation) => (
                                <div key={formation} className="flex items-center">
                                  <input
                                    type="checkbox"
                                    id={`technique-${formation}`}
                                    checked={selectedFormationsTechniques.includes(formation)}
                                    onChange={() => handleFormationTechniqueSelect(formation)}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                                  />
                                  <label htmlFor={`technique-${formation}`} className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                    {formation}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Formations entrepreneuriat */}
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="formation_entrepreneuriat_recu"
                            checked={data.formation_entrepreneuriat_recu}
                            onChange={handleFormationEntrepreneuriatChange}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                          />
                          <label htmlFor="formation_entrepreneuriat_recu" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                            Avez-vous reçu des formations en entrepreneuriat dans le cadre du projet ?
                          </label>
                        </div>

                        {data.formation_entrepreneuriat_recu && (
                          <div className="ml-6">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Sélectionnez les formations en entrepreneuriat reçues :
                            </p>
                            <div className="space-y-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                              {optionsFormationsEntrepreneuriat.map((formation) => (
                                <div key={formation} className="flex items-center">
                                  <input
                                    type="checkbox"
                                    id={`entrepreneuriat-${formation}`}
                                    checked={selectedFormationsEntrepreneuriat.includes(formation)}
                                    onChange={() => handleFormationEntrepreneuriatSelect(formation)}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                                  />
                                  <label htmlFor={`entrepreneuriat-${formation}`} className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                    {formation}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Contenu de l'onglet Démarrage JEMII */}
                  {activeTab === "demarrage" && (
                    <div className="space-y-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                      <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-4">Questionnaire de démarrage JEMII</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Appréciation Organisation Interne */}
                        <div className="space-y-3">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Appréciation sur l'organisation interne de la coopérative
                          </label>
                          <select
                            value={data.appreciation_organisation_interne_demarrage || ''}
                            onChange={(e) => setData('appreciation_organisation_interne_demarrage', e.target.value ? parseInt(e.target.value) : null)}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          >
                            <option value="">-- Sélectionnez une appréciation --</option>
                            <option value="1">1 - Faible</option>
                            <option value="2">2 - Moyen</option>
                            <option value="3">3 - Bon</option>
                          </select>
                          {errors.appreciation_organisation_interne_demarrage && (
                            <p className="text-sm text-red-600 dark:text-red-400">{errors.appreciation_organisation_interne_demarrage}</p>
                          )}
                        </div>

                        {/* Appréciation Services aux Adhérents */}
                        <div className="space-y-3">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Appréciation des services fournis aux adhérents
                          </label>
                          <select
                            value={data.appreciation_services_adherents_demarrage || ''}
                            onChange={(e) => setData('appreciation_services_adherents_demarrage', e.target.value ? parseInt(e.target.value) : null)}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          >
                            <option value="">-- Sélectionnez une appréciation --</option>
                            <option value="1">1 - Faible</option>
                            <option value="2">2 - Moyen</option>
                            <option value="3">3 - Bon</option>
                          </select>
                          {errors.appreciation_services_adherents_demarrage && (
                            <p className="text-sm text-red-600 dark:text-red-400">{errors.appreciation_services_adherents_demarrage}</p>
                          )}
                        </div>

                        {/* Appréciation Relations Externes */}
                        <div className="space-y-3">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Appréciation des relations externes de la coopérative
                          </label>
                          <select
                            value={data.appreciation_relations_externes_demarrage || ''}
                            onChange={(e) => setData('appreciation_relations_externes_demarrage', e.target.value ? parseInt(e.target.value) : null)}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          >
                            <option value="">-- Sélectionnez une appréciation --</option>
                            <option value="1">1 - Faible</option>
                            <option value="2">2 - Moyen</option>
                            <option value="3">3 - Bon</option>
                          </select>
                          {errors.appreciation_relations_externes_demarrage && (
                            <p className="text-sm text-red-600 dark:text-red-400">{errors.appreciation_relations_externes_demarrage}</p>
                          )}
                        </div>

                        {/* Bancarisation */}
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="est_bancarise_demarrage"
                              checked={data.est_bancarise_demarrage}
                              onChange={(e) => setData('est_bancarise_demarrage', e.target.checked)}
                              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                            />
                            <label htmlFor="est_bancarise_demarrage" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                              La coopérative est-elle bancarisée ?
                            </label>
                          </div>
                          {errors.est_bancarise_demarrage && (
                            <p className="text-sm text-red-600 dark:text-red-400">{errors.est_bancarise_demarrage}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Contenu de l'onglet Fin JEMII */}
                  {activeTab === "fin" && (
                    <div className="space-y-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                      <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-4">Questionnaire de fin JEMII</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Appréciation Organisation Interne */}
                        <div className="space-y-3">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Appréciation sur l'organisation interne de la coopérative
                          </label>
                          <select
                            value={data.appreciation_organisation_interne_fin || ''}
                            onChange={(e) => setData('appreciation_organisation_interne_fin', e.target.value ? parseInt(e.target.value) : null)}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          >
                            <option value="">-- Sélectionnez une appréciation --</option>
                            <option value="1">1 - Faible</option>
                            <option value="2">2 - Moyen</option>
                            <option value="3">3 - Bon</option>
                          </select>
                          {errors.appreciation_organisation_interne_fin && (
                            <p className="text-sm text-red-600 dark:text-red-400">{errors.appreciation_organisation_interne_fin}</p>
                          )}
                        </div>

                        {/* Appréciation Services aux Adhérents */}
                        <div className="space-y-3">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Appréciation des services fournis aux adhérents
                          </label>
                          <select
                            value={data.appreciation_services_adherents_fin || ''}
                            onChange={(e) => setData('appreciation_services_adherents_fin', e.target.value ? parseInt(e.target.value) : null)}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          >
                            <option value="">-- Sélectionnez une appréciation --</option>
                            <option value="1">1 - Faible</option>
                            <option value="2">2 - Moyen</option>
                            <option value="3">3 - Bon</option>
                          </select>
                          {errors.appreciation_services_adherents_fin && (
                            <p className="text-sm text-red-600 dark:text-red-400">{errors.appreciation_services_adherents_fin}</p>
                          )}
                        </div>

                        {/* Appréciation Relations Externes */}
                        <div className="space-y-3">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Appréciation des relations externes de la coopérative
                          </label>
                          <select
                            value={data.appreciation_relations_externes_fin || ''}
                            onChange={(e) => setData('appreciation_relations_externes_fin', e.target.value ? parseInt(e.target.value) : null)}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          >
                            <option value="">-- Sélectionnez une appréciation --</option>
                            <option value="1">1 - Faible</option>
                            <option value="2">2 - Moyen</option>
                            <option value="3">3 - Bon</option>
                          </select>
                          {errors.appreciation_relations_externes_fin && (
                            <p className="text-sm text-red-600 dark:text-red-400">{errors.appreciation_relations_externes_fin}</p>
                          )}
                        </div>

                        {/* Bancarisation */}
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="est_bancarise_fin"
                              checked={data.est_bancarise_fin}
                              onChange={(e) => setData('est_bancarise_fin', e.target.checked)}
                              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                            />
                            <label htmlFor="est_bancarise_fin" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                              La coopérative est-elle bancarisée ?
                            </label>
                          </div>
                          {errors.est_bancarise_fin && (
                            <p className="text-sm text-red-600 dark:text-red-400">{errors.est_bancarise_fin}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Boutons d'action */}
                <div className="mt-6 flex justify-between space-x-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Annuler
                  </button>

                  <div className="flex space-x-2">
                    {!isOnline && pendingUploads > 0 && handleSync && (
                      <button
                        type="button"
                        onClick={handleSync}
                        disabled={submitting || isSubmitting}
                        className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-md shadow-sm text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <WifiIcon className="w-4 h-4 mr-2" />
                        Synchroniser ({pendingUploads})
                      </button>
                    )}

                    <button
                      type="submit"
                      disabled={submitting || isSubmitting || processing}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {(submitting || isSubmitting || processing) ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Traitement...
                        </>
                      ) : (
                        <>
                          <SaveIcon className="w-4 h-4 mr-2" />
                          {isEdit ? 'Mettre à jour' : 'Enregistrer'}
                          {!isOnline && " (hors ligne)"}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

// Exporter le composant enveloppé par le HOC pour le support hors ligne
export default withOfflineSupport(FormulaireExceptionnelModal);
