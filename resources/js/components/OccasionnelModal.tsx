// import React, { useState, useEffect } from 'react';
// import { Dialog, Transition } from '@headlessui/react';
// import { Fragment } from 'react';
// import { useForm } from '@inertiajs/react';
// import { toast } from 'sonner';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// // Définition des types
// interface Beneficiaire {
//   id: number;
//   nom: string;
//   prenom: string;
// }

// interface Exercice {
//   id: number;
//   annee: number;
// }

// interface FormulaireExceptionnelData {
//   beneficiaires_id: number | string;
//   exercice_id: number | string;
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
//   formulaireData?: any;
//   beneficiaires: Beneficiaire[];
//   exercices: Exercice[];
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
//   exercices,
//   mode = 'create'
// }: FormulaireExceptionnelModalProps) => {
//   const isEdit = mode === 'edit';
//   const [activeTab, setActiveTab] = useState("occasionnel");

//   // Extraire les données du formulaire si elles existent
//   const initialData = formulaireData
//     ? {
//         beneficiaires_id: formulaireData.beneficiaires_id || '',
//         exercice_id: collecte?.exercice_id || '',
//         type_collecte: collecte?.type_collecte || 'standard',

//         // Onglet 1: Occasionnel
//         formation_technique_recu: formulaireData.formation_technique_recu || false,
//         formations_techniques: formulaireData.formations_techniques || [],
//         formation_entrepreneuriat_recu: formulaireData.formation_entrepreneuriat_recu || false,
//         formations_entrepreneuriat: formulaireData.formations_entrepreneuriat || [],

//         // Onglet 2: Démarrage JEMII
//         appreciation_organisation_interne_demarrage: formulaireData.appreciation_organisation_interne_demarrage || 0,
//         appreciation_services_adherents_demarrage: formulaireData.appreciation_services_adherents_demarrage || 0,
//         appreciation_relations_externes_demarrage: formulaireData.appreciation_relations_externes_demarrage || 0,
//         est_bancarise_demarrage: formulaireData.est_bancarise_demarrage || false,

//         // Onglet 3: Fin JEMII
//         appreciation_organisation_interne_fin: formulaireData.appreciation_organisation_interne_fin || 0,
//         appreciation_services_adherents_fin: formulaireData.appreciation_services_adherents_fin || 0,
//         appreciation_relations_externes_fin: formulaireData.appreciation_relations_externes_fin || 0,
//         est_bancarise_fin: formulaireData.est_bancarise_fin || false,
//       }
//     : {
//         beneficiaires_id: '',
//         exercice_id: '',
//         type_collecte: 'standard',

//         // Onglet 1: Occasionnel
//         formation_technique_recu: false,
//         formations_techniques: [],
//         formation_entrepreneuriat_recu: false,
//         formations_entrepreneuriat: [],

//         // Onglet 2: Démarrage JEMII
//         appreciation_organisation_interne_demarrage: 0,
//         appreciation_services_adherents_demarrage: 0,
//         appreciation_relations_externes_demarrage: 0,
//         est_bancarise_demarrage: false,

//         // Onglet 3: Fin JEMII
//         appreciation_organisation_interne_fin: 0,
//         appreciation_services_adherents_fin: 0,
//         appreciation_relations_externes_fin: 0,
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

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     const url = isEdit
//       ? route('formulaires.exceptionnels.update', collecte.id)
//       : route('formulaires.exceptionnels.store');

//     const successMessage = isEdit
//       ? 'Formulaire exceptionnel mis à jour avec succès'
//       : 'Formulaire exceptionnel ajouté avec succès';

//     const errorMessage = isEdit
//       ? 'Échec de la mise à jour du formulaire exceptionnel'
//       : 'Échec de l\'ajout du formulaire exceptionnel';

//     if (isEdit) {
//       put(url, {
//         onSuccess: () => {
//           toast.success(successMessage);
//           closeModal();
//         },
//         onError: () => {
//           toast.error(errorMessage);
//         },
//       });
//     } else {
//       post(url, {
//         onSuccess: () => {
//           toast.success(successMessage);
//           closeModal();
//         },
//         onError: () => {
//           toast.error(errorMessage);
//         },
//       });
//     }
//   };

//   // Changement d'onglet
//   const handleTabChange = (value: string) => {
//     setActiveTab(value);
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
//             <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />
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
//             <Dialog.Panel className="inline-block w-full max-w-5xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
//               <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
//                 {isEdit ? 'Modifier le formulaire exceptionnel' : 'Nouveau formulaire exceptionnel'}
//               </Dialog.Title>

//               <form onSubmit={handleSubmit}>
//                 {/* Section bénéficiaire et exercice */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//                   <div>
//                     <label htmlFor="beneficiaires_id" className="block text-sm font-medium text-gray-700 mb-1">
//                       Bénéficiaire *
//                     </label>
//                     <select
//                       id="beneficiaires_id"
//                       value={data.beneficiaires_id}
//                       onChange={(e) => setData('beneficiaires_id', e.target.value)}
//                       className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       required
//                     >
//                       <option value="">Sélectionnez un bénéficiaire</option>
//                       {beneficiaires.map((beneficiaire) => (
//                         <option key={beneficiaire.id} value={beneficiaire.id}>
//                           {beneficiaire.nom} {beneficiaire.prenom}
//                         </option>
//                       ))}
//                     </select>
//                     {errors.beneficiaires_id && (
//                       <p className="mt-1 text-sm text-red-600">{errors.beneficiaires_id}</p>
//                     )}
//                   </div>

//                   <div>
//                     <label htmlFor="exercice_id" className="block text-sm font-medium text-gray-700 mb-1">
//                       Exercice *
//                     </label>
//                     <select
//                       id="exercice_id"
//                       value={data.exercice_id}
//                       onChange={(e) => setData('exercice_id', e.target.value)}
//                       className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       required
//                     >
//                       <option value="">Sélectionnez un exercice</option>
//                       {exercices.map((exercice) => (
//                         <option key={exercice.id} value={exercice.id}>
//                           {exercice.annee}
//                         </option>
//                       ))}
//                     </select>
//                     {errors.exercice_id && (
//                       <p className="mt-1 text-sm text-red-600">{errors.exercice_id}</p>
//                     )}
//                   </div>
//                 </div>

//                 {/* Section type de collecte */}
//                 <div className="mb-6">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
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
//                         className="form-radio h-4 w-4 text-blue-600"
//                       />
//                       <span className="ml-2 text-sm text-gray-700">Standard</span>
//                     </label>
//                     <label className="inline-flex items-center">
//                       <input
//                         type="radio"
//                         name="type_collecte"
//                         value="brouillon"
//                         checked={data.type_collecte === 'brouillon'}
//                         onChange={() => setData('type_collecte', 'brouillon')}
//                         className="form-radio h-4 w-4 text-blue-600"
//                       />
//                       <span className="ml-2 text-sm text-gray-700">Brouillon</span>
//                     </label>
//                   </div>
//                   {errors.type_collecte && (
//                     <p className="mt-1 text-sm text-red-600">{errors.type_collecte}</p>
//                   )}
//                 </div>

//                 {/* Onglets */}
//                 <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
//                   <TabsList className="mb-4 grid w-full grid-cols-3">
//                     <TabsTrigger value="occasionnel">Occasionnel</TabsTrigger>
//                     <TabsTrigger value="demarrage">Démarrage JEMII</TabsTrigger>
//                     <TabsTrigger value="fin">Fin JEMII</TabsTrigger>
//                   </TabsList>

//                   {/* Onglet 1: Occasionnel */}
//                   <TabsContent value="occasionnel">
//                     <div className="space-y-6">
//                       {/* Formations techniques */}
//                       <div className="space-y-4">
//                         <div className="flex items-center">
//                           <input
//                             type="checkbox"
//                             id="formation_technique_recu"
//                             checked={data.formation_technique_recu}
//                             onChange={handleFormationTechniqueChange}
//                             className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                           />
//                           <label htmlFor="formation_technique_recu" className="ml-2 block text-sm text-gray-700">
//                             Avez-vous reçu des formations techniques dans le cadre du projet ?
//                           </label>
//                         </div>

//                         {data.formation_technique_recu && (
//                           <div className="ml-6">
//                             <p className="text-sm font-medium text-gray-700 mb-2">
//                               Sélectionnez les formations techniques reçues :
//                             </p>
//                             <div className="space-y-2">
//                               {optionsFormationsTechniques.map((formation) => (
//                                 <div key={formation} className="flex items-center">
//                                   <input
//                                     type="checkbox"
//                                     id={`technique-${formation}`}
//                                     checked={selectedFormationsTechniques.includes(formation)}
//                                     onChange={() => handleFormationTechniqueSelect(formation)}
//                                     className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                                   />
//                                   <label htmlFor={`technique-${formation}`} className="ml-2 block text-sm text-gray-700">
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
//                             className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                           />
//                           <label htmlFor="formation_entrepreneuriat_recu" className="ml-2 block text-sm text-gray-700">
//                             Avez-vous reçu des formations en entrepreneuriat dans le cadre du projet ?
//                           </label>
//                         </div>

//                         {data.formation_entrepreneuriat_recu && (
//                           <div className="ml-6">
//                             <p className="text-sm font-medium text-gray-700 mb-2">
//                               Sélectionnez les formations en entrepreneuriat reçues :
//                             </p>
//                             <div className="space-y-2">
//                               {optionsFormationsEntrepreneuriat.map((formation) => (
//                                 <div key={formation} className="flex items-center">
//                                   <input
//                                     type="checkbox"
//                                     id={`entrepreneuriat-${formation}`}
//                                     checked={selectedFormationsEntrepreneuriat.includes(formation)}
//                                     onChange={() => handleFormationEntrepreneuriatSelect(formation)}
//                                     className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                                   />
//                                   <label htmlFor={`entrepreneuriat-${formation}`} className="ml-2 block text-sm text-gray-700">
//                                     {formation}
//                                   </label>
//                                 </div>
//                               ))}
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </TabsContent>
//                 </Tabs>

//                 {/* Boutons d'action */}
//                 <div className="mt-6 flex justify-end space-x-3">
//                   <button
//                     type="button"
//                     onClick={closeModal}
//                     className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                   >
//                     Annuler
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={processing}
//                     className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {processing ? 'Traitement en cours...' : isEdit ? 'Mettre à jour' : 'Enregistrer'}
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
// import React, { useState, useEffect } from 'react';
// import { Dialog, Transition } from '@headlessui/react';
// import { Fragment } from 'react';
// import { useForm } from '@inertiajs/react';
// import { toast } from 'sonner';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// // Définition des types
// interface Beneficiaire {
//   id: number;
//   nom: string;
//   prenom: string;
// }

// interface Exercice {
//   id: number;
//   annee: number;
// }

// interface FormulaireExceptionnelData {
//   beneficiaires_id: number | string;
//   exercice_id: number | string;
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
//   formulaireData?: any;
//   beneficiaires: Beneficiaire[];
//   exercices: Exercice[];
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
//   exercices,
//   mode = 'create'
// }: FormulaireExceptionnelModalProps) => {
//   const isEdit = mode === 'edit';
//   const [activeTab, setActiveTab] = useState("occasionnel");

//   // Extraire les données du formulaire si elles existent
//   const initialData = formulaireData
//     ? {
//         beneficiaires_id: formulaireData.beneficiaires_id || '',
//         exercice_id: collecte?.exercice_id || '',
//         type_collecte: collecte?.type_collecte || 'standard',

//         // Onglet 1: Occasionnel
//         formation_technique_recu: formulaireData.formation_technique_recu || false,
//         formations_techniques: formulaireData.formations_techniques || [],
//         formation_entrepreneuriat_recu: formulaireData.formation_entrepreneuriat_recu || false,
//         formations_entrepreneuriat: formulaireData.formations_entrepreneuriat || [],

//         // Onglet 2: Démarrage JEMII
//         appreciation_organisation_interne_demarrage: formulaireData.appreciation_organisation_interne_demarrage || 0,
//         appreciation_services_adherents_demarrage: formulaireData.appreciation_services_adherents_demarrage || 0,
//         appreciation_relations_externes_demarrage: formulaireData.appreciation_relations_externes_demarrage || 0,
//         est_bancarise_demarrage: formulaireData.est_bancarise_demarrage || false,

//         // Onglet 3: Fin JEMII
//         appreciation_organisation_interne_fin: formulaireData.appreciation_organisation_interne_fin || 0,
//         appreciation_services_adherents_fin: formulaireData.appreciation_services_adherents_fin || 0,
//         appreciation_relations_externes_fin: formulaireData.appreciation_relations_externes_fin || 0,
//         est_bancarise_fin: formulaireData.est_bancarise_fin || false,
//       }
//     : {
//         beneficiaires_id: '',
//         exercice_id: '',
//         type_collecte: 'standard',

//         // Onglet 1: Occasionnel
//         formation_technique_recu: false,
//         formations_techniques: [],
//         formation_entrepreneuriat_recu: false,
//         formations_entrepreneuriat: [],

//         // Onglet 2: Démarrage JEMII
//         appreciation_organisation_interne_demarrage: 0,
//         appreciation_services_adherents_demarrage: 0,
//         appreciation_relations_externes_demarrage: 0,
//         est_bancarise_demarrage: false,

//         // Onglet 3: Fin JEMII
//         appreciation_organisation_interne_fin: 0,
//         appreciation_services_adherents_fin: 0,
//         appreciation_relations_externes_fin: 0,
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

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     const url = isEdit
//       ? route('formulaires.exceptionnels.update', collecte.id)
//       : route('formulaires.exceptionnels.store');

//     const successMessage = isEdit
//       ? 'Formulaire exceptionnel mis à jour avec succès'
//       : 'Formulaire exceptionnel ajouté avec succès';

//     const errorMessage = isEdit
//       ? 'Échec de la mise à jour du formulaire exceptionnel'
//       : 'Échec de l\'ajout du formulaire exceptionnel';

//     if (isEdit) {
//       put(url, {
//         onSuccess: () => {
//           toast.success(successMessage);
//           closeModal();
//         },
//         onError: () => {
//           toast.error(errorMessage);
//         },
//       });
//     } else {
//       post(url, {
//         onSuccess: () => {
//           toast.success(successMessage);
//           closeModal();
//         },
//         onError: () => {
//           toast.error(errorMessage);
//         },
//       });
//     }
//   };

//   // Changement d'onglet
//   const handleTabChange = (value: string) => {
//     setActiveTab(value);
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
//             <Dialog.Panel className="inline-block w-full max-w-5xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
//               <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
//                 {isEdit ? 'Modifier le formulaire exceptionnel' : 'Nouveau formulaire exceptionnel'}
//               </Dialog.Title>

//               <form onSubmit={handleSubmit}>
//                 {/* Section bénéficiaire et exercice */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//                   <div>
//                     <label htmlFor="beneficiaires_id" className="block text-sm font-medium text-gray-700 mb-1">
//                       Bénéficiaire *
//                     </label>
//                     <select
//                       id="beneficiaires_id"
//                       value={data.beneficiaires_id}
//                       onChange={(e) => setData('beneficiaires_id', e.target.value)}
//                       className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       required
//                     >
//                       <option value="">Sélectionnez un bénéficiaire</option>
//                       {beneficiaires.map((beneficiaire) => (
//                         <option key={beneficiaire.id} value={beneficiaire.id}>
//                           {beneficiaire.nom} {beneficiaire.prenom}
//                         </option>
//                       ))}
//                     </select>
//                     {errors.beneficiaires_id && (
//                       <p className="mt-1 text-sm text-red-600">{errors.beneficiaires_id}</p>
//                     )}
//                   </div>

//                   <div>
//                     <label htmlFor="exercice_id" className="block text-sm font-medium text-gray-700 mb-1">
//                       Exercice *
//                     </label>
//                     <select
//                       id="exercice_id"
//                       value={data.exercice_id}
//                       onChange={(e) => setData('exercice_id', e.target.value)}
//                       className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       required
//                     >
//                       <option value="">Sélectionnez un exercice</option>
//                       {exercices.map((exercice) => (
//                         <option key={exercice.id} value={exercice.id}>
//                           {exercice.annee}
//                         </option>
//                       ))}
//                     </select>
//                     {errors.exercice_id && (
//                       <p className="mt-1 text-sm text-red-600">{errors.exercice_id}</p>
//                     )}
//                   </div>
//                 </div>

//                 {/* Section type de collecte */}
//                 <div className="mb-6">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
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
//                         className="form-radio h-4 w-4 text-blue-600"
//                       />
//                       <span className="ml-2 text-sm text-gray-700">Standard</span>
//                     </label>
//                     <label className="inline-flex items-center">
//                       <input
//                         type="radio"
//                         name="type_collecte"
//                         value="brouillon"
//                         checked={data.type_collecte === 'brouillon'}
//                         onChange={() => setData('type_collecte', 'brouillon')}
//                         className="form-radio h-4 w-4 text-blue-600"
//                       />
//                       <span className="ml-2 text-sm text-gray-700">Brouillon</span>
//                     </label>
//                   </div>
//                   {errors.type_collecte && (
//                     <p className="mt-1 text-sm text-red-600">{errors.type_collecte}</p>
//                   )}
//                 </div>

//                 {/* Onglets */}
//                 <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
//                   <TabsList className="mb-4 grid w-full grid-cols-3">
//                     <TabsTrigger value="occasionnel">Occasionnel</TabsTrigger>
//                     <TabsTrigger value="demarrage">Démarrage JEMII</TabsTrigger>
//                     <TabsTrigger value="fin">Fin JEMII</TabsTrigger>
//                   </TabsList>

//                   {/* Onglet 1: Occasionnel */}
//                   <TabsContent value="occasionnel">
//                     <div className="space-y-6">
//                       {/* Formations techniques */}
//                       <div className="space-y-4">
//                         <div className="flex items-center">
//                           <input
//                             type="checkbox"
//                             id="formation_technique_recu"
//                             checked={data.formation_technique_recu}
//                             onChange={handleFormationTechniqueChange}
//                             className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                           />
//                           <label htmlFor="formation_technique_recu" className="ml-2 block text-sm text-gray-700">
//                             Avez-vous reçu des formations techniques dans le cadre du projet ?
//                           </label>
//                         </div>

//                         {data.formation_technique_recu && (
//                           <div className="ml-6">
//                             <p className="text-sm font-medium text-gray-700 mb-2">
//                               Sélectionnez les formations techniques reçues :
//                             </p>
//                             <div className="space-y-2">
//                               {optionsFormationsTechniques.map((formation) => (
//                                 <div key={formation} className="flex items-center">
//                                   <input
//                                     type="checkbox"
//                                     id={`technique-${formation}`}
//                                     checked={selectedFormationsTechniques.includes(formation)}
//                                     onChange={() => handleFormationTechniqueSelect(formation)}
//                                     className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                                   />
//                                   <label htmlFor={`technique-${formation}`} className="ml-2 block text-sm text-gray-700">
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
//                             className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                           />
//                           <label htmlFor="formation_entrepreneuriat_recu" className="ml-2 block text-sm text-gray-700">
//                             Avez-vous reçu des formations en entrepreneuriat dans le cadre du projet ?
//                           </label>
//                         </div>

//                         {data.formation_entrepreneuriat_recu && (
//                           <div className="ml-6">
//                             <p className="text-sm font-medium text-gray-700 mb-2">
//                               Sélectionnez les formations en entrepreneuriat reçues :
//                             </p>
//                             <div className="space-y-2">
//                               {optionsFormationsEntrepreneuriat.map((formation) => (
//                                 <div key={formation} className="flex items-center">
//                                   <input
//                                     type="checkbox"
//                                     id={`entrepreneuriat-${formation}`}
//                                     checked={selectedFormationsEntrepreneuriat.includes(formation)}
//                                     onChange={() => handleFormationEntrepreneuriatSelect(formation)}
//                                     className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                                   />
//                                   <label htmlFor={`entrepreneuriat-${formation}`} className="ml-2 block text-sm text-gray-700">
//                                     {formation}
//                                   </label>
//                                 </div>
//                               ))}
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </TabsContent>
//                 </Tabs>

//                 {/* Boutons d'action */}
//                 <div className="mt-6 flex justify-end space-x-3">
//                   <button
//                     type="button"
//                     onClick={closeModal}
//                     className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                   >
//                     Annuler
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={processing}
//                     className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {processing ? 'Traitement en cours...' : isEdit ? 'Mettre à jour' : 'Enregistrer'}
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
  mode = 'create'
}: FormulaireExceptionnelModalProps) => {
  const isEdit = mode === 'edit';
  const [activeTab, setActiveTab] = useState("occasionnel");

  // Extraire les données du formulaire si elles existent
  const initialData = formulaireData
    ? {
        beneficiaires_id: formulaireData.beneficiaires_id || '',
        type_collecte: collecte?.type_collecte || 'standard',

        // Onglet 1: Occasionnel
        formation_technique_recu: formulaireData.formation_technique_recu ?? false,
        formations_techniques: formulaireData.formations_techniques ?? [],
        formation_entrepreneuriat_recu: formulaireData.formation_entrepreneuriat_recu ?? false,
        formations_entrepreneuriat: formulaireData.formations_entrepreneuriat ?? [],

       // Modifier ces lignes dans votre initialisation de formulaire
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

        // Onglet 1: Occasionnel
        formation_technique_recu: false,
        formations_techniques: [],
        formation_entrepreneuriat_recu: false,
        formations_entrepreneuriat: [],

        // Onglet 2: Démarrage JEMII - Utiliser des valeurs par défaut (1 = Faible)
        appreciation_organisation_interne_demarrage: '',
        appreciation_services_adherents_demarrage: '',
        appreciation_relations_externes_demarrage: '',
        est_bancarise_demarrage: false,

        // Onglet 3: Fin JEMII - Utiliser des valeurs par défaut (1 = Faible)
        appreciation_organisation_interne_fin: '',
        appreciation_services_adherents_fin: '',
        appreciation_relations_externes_fin: '',
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Afficher les données qui seront envoyées
    console.log("Données à envoyer:", data);

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
          closeModal();
        },
        onError: (errors) => {
          console.error("Erreurs de validation:", errors);
          toast.error(errorMessage);
        },
      });
    } else {
      post(url, {
        onSuccess: () => {
          toast.success(successMessage);
          closeModal();
        },
        onError: (errors) => {
          console.error("Erreurs de validation:", errors);
          toast.error(errorMessage);
        },
      });
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
            <Dialog.Panel className="inline-block w-full max-w-5xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-lg">
              <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                {isEdit ? 'Modifier le formulaire exceptionnel' : 'Nouveau formulaire exceptionnel'}
              </Dialog.Title>

              <form onSubmit={handleSubmit}>
                {/* Section bénéficiaire */}
                <div className="mb-6">
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
                    <option value="">Sélectionnez un Promoteurs</option>
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
                  <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
                    <ul className="flex flex-wrap -mb-px">
                      <li className="mr-2">
                        <button
                          type="button"
                          onClick={() => setActiveTab("occasionnel")}
                          className={`inline-block p-4 rounded-t-lg ${
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
                          className={`inline-block p-4 rounded-t-lg ${
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
                          className={`inline-block p-4 rounded-t-lg ${
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
                            <div className="space-y-2">
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
                            <div className="space-y-2">
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

                      {/* Appréciation Organisation Interne */}
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Appréciation sur l'organisation interne de la coopérative
                        </label>
                        <select
                          value={data.appreciation_organisation_interne_demarrage}
                          onChange={(e) => setData('appreciation_organisation_interne_demarrage', e.target.value ? parseInt(e.target.value) : 0)}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        >
                            <option value="">-- Sélectionnez une appréciation --</option>

                          <option value={1}>1 - Faible</option>
                          <option value={2}>2 - Moyen</option>
                          <option value={3}>3 - Bon</option>
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
                          value={data.appreciation_services_adherents_demarrage}
                          onChange={(e) => setData('appreciation_services_adherents_demarrage', e.target.value ? parseInt(e.target.value) : 0)}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        >
                            <option value="">-- Sélectionnez une appréciation --</option>

                          <option value={1}>1 - Faible</option>
                          <option value={2}>2 - Moyen</option>
                          <option value={3}>3 - Bon</option>
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
                          value={data.appreciation_relations_externes_demarrage}
                          onChange={(e) => setData('appreciation_relations_externes_demarrage', e.target.value ? parseInt(e.target.value) : 0)}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        >
                                                        <option value="">-- Sélectionnez une appréciation --</option>

                          <option value={1}>1 - Faible</option>
                          <option value={2}>2 - Moyen</option>
                          <option value={3}>3 - Bon</option>
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
                  )}

                  {/* Contenu de l'onglet Fin JEMII */}
                  {activeTab === "fin" && (
                    <div className="space-y-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                      <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-4">Questionnaire de fin JEMII</h3>

                      {/* Appréciation Organisation Interne */}
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Appréciation sur l'organisation interne de la coopérative
                        </label>
                        <select
                          value={data.appreciation_organisation_interne_fin}
                          onChange={(e) => setData('appreciation_organisation_interne_fin', e.target.value ? parseInt(e.target.value) : 0)}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        >
                            <option value="">-- Sélectionnez une appréciation --</option>
                          <option value={1}>1 - Faible</option>
                          <option value={2}>2 - Moyen</option>
                          <option value={3}>3 - Bon</option>
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
                          value={data.appreciation_services_adherents_fin}
                          onChange={(e) => setData('appreciation_services_adherents_fin',e.target.value ? parseInt(e.target.value) : 0)}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        >
                                                          <option value="">-- Sélectionnez une appréciation --</option>
                          <option value={1}>1 - Faible</option>
                          <option value={2}>2 - Moyen</option>
                          <option value={3}>3 - Bon</option>
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
                          value={data.appreciation_relations_externes_fin}
                          onChange={(e) => setData('appreciation_relations_externes_fin', e.target.value ? parseInt(e.target.value) : 0)}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        >
                              <option value="">-- Sélectionnez une appréciation --</option>

                          <option value={1}>1 - Faible</option>
                          <option value={2}>2 - Moyen</option>
                          <option value={3}>3 - Bon</option>
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
                  )}
                </div>

                {/* Boutons d'action */}
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={processing}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing ? 'Traitement en cours...' : isEdit ? 'Mettre à jour' : 'Enregistrer'}
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default FormulaireExceptionnelModal;
