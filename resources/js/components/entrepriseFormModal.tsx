// // import React, { useEffect } from 'react';
// // import { Dialog, Transition } from '@headlessui/react';
// // import { Fragment } from 'react';
// // import { useForm } from '@inertiajs/react';
// // import { toast } from 'sonner';

// // // Définition des types
// // interface Beneficiaire {
// //   id: number;
// //   nom: string;
// //   prenom: string;
// // }

// // interface ONG {
// //   id: number;
// //   nom: string;
// //   sigle?: string;
// // }

// // interface InstitutionFinanciere {
// //   id: number;
// //   nom: string;
// // }

// // interface EntrepriseFormData {
// //   id?: number;
// //   beneficiaires_id: number | string;
// //   nom_entreprise: string;
// //   secteur_activite: string;
// //   date_creation: string;
// //   statut_juridique: string;
// //   adresse?: string;
// //   ville: string;
// //   pays: string;
// //   description?: string;
// //   domaine_activite?: string;
// //   niveau_mise_en_oeuvre?: string;
// //   ong_id?: number | string;
// //   institution_financiere_id?: number | string;
// // }

// // interface EntrepriseFormModalProps {
// //   isOpen: boolean;
// //   closeModal: () => void;
// //   entreprise?: Partial<EntrepriseFormData>;
// //   beneficiaires: Beneficiaire[];
// //   ongs: ONG[];
// //   institutionsFinancieres: InstitutionFinanciere[];
// // }

// // // Fonction pour formater la date au format `yyyy-MM-dd`
// // const formatDateForInput = (dateString: string) => {
// //   if (!dateString) return '';
// //   try {
// //     const date = new Date(dateString);
// //     return date.toISOString().split('T')[0];
// //   } catch (e) {
// //     console.error('Erreur lors du formatage de la date:', e);
// //     return '';
// //   }
// // };

// // // Fonction utilitaire pour les données initiales
// // const getInitialData = (entreprise?: Partial<EntrepriseFormData>): EntrepriseFormData => {
// //     console.log('Données reçues dans getInitialData:', entreprise);

// //     return {
// //       beneficiaires_id: entreprise?.beneficiaires_id || '',
// //       nom_entreprise: entreprise?.nom_entreprise || '',
// //       secteur_activite: entreprise?.secteur_activite || '',
// //       date_creation: entreprise?.date_creation ? formatDateForInput(entreprise.date_creation) : '',
// //       statut_juridique: entreprise?.statut_juridique || '',
// //       adresse: entreprise?.adresse || '',
// //       ville: entreprise?.ville || '',
// //       pays: entreprise?.pays || '',
// //       description: entreprise?.description || '',
// //       domaine_activite: entreprise?.domaine_activite || '',
// //       niveau_mise_en_oeuvre: entreprise?.niveau_mise_en_oeuvre || '',
// //       ong_id: entreprise?.ong_id || '',
// //       institution_financiere_id: entreprise?.institution_financiere_id || '',
// //     };
// //   };

// // const EntrepriseFormModal = ({
// //   isOpen,
// //   closeModal,
// //   entreprise,
// //   beneficiaires,
// //   ongs,
// //   institutionsFinancieres
// // }: EntrepriseFormModalProps) => {
// //   // Initialiser le formulaire avec le typage correct
// //   const { data, setData, post, put, errors, processing, reset } = useForm<EntrepriseFormData>(
// //     getInitialData(entreprise)
// //   );

// //   // Fonction de mise à jour typée
// //   const updateField = <K extends keyof EntrepriseFormData>(field: K, value: EntrepriseFormData[K]) => {
// //     setData(field, value);
// //   };

// //   // Mettre à jour les données du formulaire lorsque l'entreprise change
// //   useEffect(() => {
// //     return reset(getInitialData(entreprise));
// //   }, [entreprise, isOpen, reset]);

// //   const handleSubmit = (e: React.FormEvent) => {
// //     e.preventDefault();
// //     const successMessage = entreprise?.id
// //       ? 'Entreprise mise à jour avec succès.'
// //       : 'Entreprise ajoutée avec succès.';
// //     const errorMessage = entreprise?.id
// //       ? 'Échec de la mise à jour de l\'entreprise.'
// //       : 'Échec de l\'ajout de l\'entreprise.';

// //     if (entreprise?.id) {
// //       put(route('entreprises.update', entreprise.id), {
// //         onSuccess: () => {
// //           toast.success(successMessage);
// //           closeModal();
// //           reset();
// //         },
// //         onError: () => {
// //           toast.error(errorMessage);
// //         },
// //       });
// //     } else {
// //       post(route('entreprises.store'), {
// //         onSuccess: () => {
// //           toast.success(successMessage);
// //           closeModal();
// //           reset();
// //         },
// //         onError: () => {
// //           toast.error(errorMessage);
// //         },
// //       });
// //     }
// //   };

// //   return (
// //     <Transition appear show={isOpen} as={Fragment}>
// //       <Dialog as="div" className="relative z-10" onClose={closeModal}>
// //         <Transition.Child
// //           as={Fragment}
// //           enter="ease-out duration-300"
// //           enterFrom="opacity-0"
// //           enterTo="opacity-100"
// //           leave="ease-in duration-200"
// //           leaveFrom="opacity-100"
// //           leaveTo="opacity-0"
// //         >
// //           <div className="fixed inset-0 bg-black bg-opacity-30" />
// //         </Transition.Child>

// //         <div className="fixed inset-0 overflow-y-auto">
// //           <div className="flex min-h-full items-center justify-center p-4 text-center">
// //             <Transition.Child
// //               as={Fragment}
// //               enter="ease-out duration-300"
// //               enterFrom="opacity-0 scale-95"
// //               enterTo="opacity-100 scale-100"
// //               leave="ease-in duration-200"
// //               leaveFrom="opacity-100 scale-100"
// //               leaveTo="opacity-0 scale-95"
// //             >
// //               <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left align-middle shadow-xl transition-all">
// //                 <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-white p-6 border-b border-gray-200 dark:border-gray-700">
// //                   {entreprise?.id ? 'Modifier une entreprise' : 'Ajouter une entreprise'}
// //                 </Dialog.Title>

// //                 <div className="max-h-[calc(100vh-200px)] overflow-y-auto p-6">
// //                   <form onSubmit={handleSubmit}>
// //                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
// //                       {/* Colonne de gauche */}
// //                       <div className="space-y-4">
// //                         {/* Promoteur (Bénéficiaire) associé */}
// //                         <div className="group">
// //                           <label htmlFor="beneficiaires_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
// //                             Promoteur associé <span className="text-red-500">*</span>
// //                           </label>
// //                           <select
// //                             id="beneficiaires_id"
// //                             value={data.beneficiaires_id}
// //                             onChange={(e) => updateField('beneficiaires_id', e.target.value)}
// //                             className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 rounded-md
// //                                     bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
// //                                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400"
// //                             required
// //                           >
// //                             <option value="">Sélectionnez un promoteur</option>
// //                             {beneficiaires.map((beneficiaire) => (
// //                               <option key={beneficiaire.id} value={beneficiaire.id}>
// //                                 {beneficiaire.nom} {beneficiaire.prenom}
// //                               </option>
// //                             ))}
// //                           </select>
// //                           {errors.beneficiaires_id && (
// //                             <span className="text-red-500 text-sm block mt-1">{errors.beneficiaires_id}</span>
// //                           )}
// //                         </div>

// //                         {/* Nom de l'entreprise */}
// //                         <div className="group">
// //                           <label htmlFor="nom_entreprise" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
// //                             Nom de l'entreprise <span className="text-red-500">*</span>
// //                           </label>
// //                           <input
// //                             type="text"
// //                             id="nom_entreprise"
// //                             value={data.nom_entreprise}
// //                             onChange={(e) => updateField('nom_entreprise', e.target.value)}
// //                             className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 rounded-md
// //                                     bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
// //                                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400"
// //                             required
// //                           />
// //                           {errors.nom_entreprise && (
// //                             <span className="text-red-500 text-sm block mt-1">{errors.nom_entreprise}</span>
// //                           )}
// //                         </div>

// //                         {/* Secteur d'activité */}
// //                         <div className="group">
// //                           <label htmlFor="secteur_activite" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
// //                             Secteur d'activité <span className="text-red-500">*</span>
// //                           </label>
// //                           <select
// //                             id="secteur_activite"
// //                             value={data.secteur_activite}
// //                             onChange={(e) => updateField('secteur_activite', e.target.value)}
// //                             className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 rounded-md
// //                                     bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
// //                                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400"
// //                             required
// //                           >
// //                             <option value="">Sélectionnez un secteur</option>
// //                             <option value="Agriculture">Agriculture</option>
// //                             <option value="Artisanat">Artisanat</option>
// //                             <option value="Commerce">Commerce</option>
// //                             <option value="Élevage">Élevage</option>
// //                             <option value="environnement">Environnement</option>
// //                           </select>
// //                           {errors.secteur_activite && (
// //                             <span className="text-red-500 text-sm block mt-1">{errors.secteur_activite}</span>
// //                           )}
// //                         </div>

// //                         {/* Date de création */}
// //                         <div className="group">
// //                           <label htmlFor="date_creation" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
// //                             Date de création <span className="text-red-500">*</span>
// //                           </label>
// //                           <input
// //                             type="date"
// //                             id="date_creation"
// //                             value={data.date_creation}
// //                             onChange={(e) => updateField('date_creation', e.target.value)}
// //                             className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 rounded-md
// //                                     bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
// //                                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400"
// //                             required
// //                           />
// //                           {errors.date_creation && (
// //                             <span className="text-red-500 text-sm block mt-1">{errors.date_creation}</span>
// //                           )}
// //                         </div>

// //                         {/* Statut juridique */}
// //                         <div className="group">
// //                           <label htmlFor="statut_juridique" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
// //                             Statut juridique <span className="text-red-500">*</span>
// //                           </label>
// //                           <select
// //                             id="statut_juridique"
// //                             value={data.statut_juridique}
// //                             onChange={(e) => updateField('statut_juridique', e.target.value)}
// //                             className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 rounded-md
// //                                     bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
// //                                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400"
// //                             required
// //                           >
// //                             <option value="">Sélectionnez un statut</option>
// //                             <option value="SARL">SARL</option>
// //                             <option value="SA">SA</option>
// //                             <option value="SAS">SAS</option>
// //                             <option value="SCS">SCS</option>
// //                             <option value="SNC">SNC</option>
// //                             <option value="GIE">GIE</option>
// //                             <option value="SCP">SCP</option>
// //                             <option value="SCI">SCI</option>
// //                             <option value="Auto-entrepreneur">Auto-entrepreneur</option>
// //                           </select>
// //                           {errors.statut_juridique && (
// //                             <span className="text-red-500 text-sm block mt-1">{errors.statut_juridique}</span>
// //                           )}
// //                         </div>

// //                         {/* Niveau de mise en œuvre */}
// //                         <div className="group">
// //                           <label htmlFor="niveau_mise_en_oeuvre" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
// //                             Niveau de mise en œuvre
// //                           </label>
// //                           <select
// //                             id="niveau_mise_en_oeuvre"
// //                             value={data.niveau_mise_en_oeuvre}
// //                             onChange={(e) => updateField('niveau_mise_en_oeuvre', e.target.value)}
// //                             className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 rounded-md
// //                                     bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
// //                                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400"
// //                           >
// //                             <option value="">Sélectionnez un niveau</option>
// //                             <option value="Création">Création</option>
// //                             <option value="Renforcement">Renforcement</option>
// //                           </select>
// //                           {errors.niveau_mise_en_oeuvre && (
// //                             <span className="text-red-500 text-sm block mt-1">{errors.niveau_mise_en_oeuvre}</span>
// //                           )}
// //                         </div>
// //                       </div>

// //                       {/* Colonne de droite */}
// //                       <div className="space-y-4">
// //                         {/* ONG d'appui */}
// //                         <div className="group">
// //                           <label htmlFor="ong_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
// //                             ONG d'appui
// //                           </label>
// //                           <select
// //                             id="ong_id"
// //                             value={data.ong_id}
// //                             onChange={(e) => updateField('ong_id', e.target.value)}
// //                             className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 rounded-md
// //                                     bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
// //                                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400"
// //                           >
// //                             <option value="">Sélectionnez une ONG</option>
// //                             {ongs.map((ong) => (
// //                               <option key={ong.id} value={ong.id}>
// //                                 {ong.nom} {ong.sigle ? `(${ong.sigle})` : ''}
// //                               </option>
// //                             ))}
// //                           </select>
// //                           {errors.ong_id && <span className="text-red-500 text-sm block mt-1">{errors.ong_id}</span>}
// //                         </div>

// //                         {/* Institution financière */}
// //                         <div className="group">
// //                           <label htmlFor="institution_financiere_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
// //                             Institution financière
// //                           </label>
// //                           <select
// //                             id="institution_financiere_id"
// //                             value={data.institution_financiere_id}
// //                             onChange={(e) => updateField('institution_financiere_id', e.target.value)}
// //                             className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 rounded-md
// //                                     bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
// //                                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400"
// //                           >
// //                             <option value="">Sélectionnez une institution</option>
// //                             {institutionsFinancieres.map((institution) => (
// //                               <option key={institution.id} value={institution.id}>
// //                                 {institution.nom}
// //                               </option>
// //                             ))}
// //                           </select>
// //                           {errors.institution_financiere_id && (
// //                             <span className="text-red-500 text-sm block mt-1">{errors.institution_financiere_id}</span>
// //                           )}
// //                         </div>

// //                         {/* Adresse */}
// //                         <div className="group">
// //                           <label htmlFor="adresse" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
// //                             Adresse
// //                           </label>
// //                           <input
// //                             type="text"
// //                             id="adresse"
// //                             value={data.adresse}
// //                             onChange={(e) => updateField('adresse', e.target.value)}
// //                             className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 rounded-md
// //                                     bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
// //                                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400"
// //                           />
// //                           {errors.adresse && <span className="text-red-500 text-sm block mt-1">{errors.adresse}</span>}
// //                         </div>

// //                         {/* Ville */}
// //                         <div className="group">
// //                           <label htmlFor="ville" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
// //                             Ville <span className="text-red-500">*</span>
// //                           </label>
// //                           <input
// //                             type="text"
// //                             id="ville"
// //                             value={data.ville}
// //                             onChange={(e) => updateField('ville', e.target.value)}
// //                             className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 rounded-md
// //                                     bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
// //                                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400"
// //                             required
// //                           />
// //                           {errors.ville && <span className="text-red-500 text-sm block mt-1">{errors.ville}</span>}
// //                         </div>

// //                         {/* Pays */}
// //                         <div className="group">
// //                           <label htmlFor="pays" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
// //                             Pays <span className="text-red-500">*</span>
// //                           </label>
// //                           <input
// //                             type="text"
// //                             id="pays"
// //                             value={data.pays}
// //                             onChange={(e) => updateField('pays', e.target.value)}
// //                             className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 rounded-md
// //                                     bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
// //                                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400"
// //                             required
// //                           />
// //                           {errors.pays && <span className="text-red-500 text-sm block mt-1">{errors.pays}</span>}
// //                         </div>
// //                       </div>
// //                     </div>

// //                     {/* Descriptions sur deux colonnes */}
// //                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mt-6">
// //                       {/* Description de l'entreprise */}
// //                       <div>
// //                         <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
// //                           Description de l'entreprise
// //                         </label>
// //                         <textarea
// //                           id="description"
// //                           value={data.description}
// //                           onChange={(e) => updateField('description', e.target.value)}
// //                           className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 rounded-md
// //                                   bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
// //                                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400"
// //                           rows={4}
// //                         />
// //                         {errors.description && (
// //                           <span className="text-red-500 text-sm block mt-1">{errors.description}</span>
// //                         )}
// //                       </div>

// //                       {/* Description du domaine d'activité */}
// //                       <div>
// //                         <label htmlFor="domaine_activite" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
// //                           Description du domaine d'activité
// //                         </label>
// //                         <textarea
// //                           id="domaine_activite"
// //                           value={data.domaine_activite}
// //                           onChange={(e) => updateField('domaine_activite', e.target.value)}
// //                           className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 rounded-md
// //                                   bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
// //                                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400"
// //                           rows={4}
// //                         />
// //                         {errors.domaine_activite && (
// //                           <span className="text-red-500 text-sm block mt-1">{errors.domaine_activite}</span>
// //                         )}
// //                       </div>
// //                     </div>
// //                   </form>
// //                 </div>

// //                 {/* Boutons en bas du formulaire */}
// //                 <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-t border-gray-200 dark:border-gray-600 flex justify-end space-x-3">
// //                   <button
// //                     type="button"
// //                     onClick={closeModal}
// //                     className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600
// //                             rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition duration-150 ease-in-out"
// //                   >
// //                     Annuler
// //                   </button>
// //                   <button
// //                     type="submit"
// //                     disabled={processing}
// //                     onClick={handleSubmit}
// //                     className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md
// //                             hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600
// //                             transition duration-150 ease-in-out"
// //                   >
// //                     {processing ? 'Enregistrement...' : 'Enregistrer'}
// //                   </button>
// //                 </div>
// //               </Dialog.Panel>
// //             </Transition.Child>
// //           </div>
// //         </div>
// //       </Dialog>
// //     </Transition>
// //   );
// // };

// // export default EntrepriseFormModal;
// import React, { useEffect, useRef } from 'react';
// import { Dialog, Transition } from '@headlessui/react';
// import { Fragment } from 'react';
// import { useForm } from '@inertiajs/react';
// import { toast } from 'sonner';

// // Définition des types
// interface Beneficiaire {
//   id: number;
//   nom: string;
//   prenom: string;
// }

// interface ONG {
//   id: number;
//   nom: string;
//   sigle?: string;
// }

// interface InstitutionFinanciere {
//   id: number;
//   nom: string;
// }

// interface EntrepriseFormModalProps {
//   isOpen: boolean;
//   closeModal: () => void;
//   onSuccess: () => void; // Callback pour mettre à jour la liste sans rafraîchir la page
//   entreprise?: {
//     id?: number;
//     beneficiaires_id: string | number;
//     nom_entreprise: string;
//     secteur_activite: string;
//     date_creation: string;
//     statut_juridique: string;
//     adresse?: string;
//     ville: string;
//     pays: string;
//     description?: string;
//     domaine_activite?: string;
//     niveau_mise_en_oeuvre?: string;
//     ong_id?: string | number;
//     institution_financiere_id?: string | number;
//   } | null;
//   beneficiaires: Beneficiaire[];
//   ongs: ONG[];
//   institutionsFinancieres: InstitutionFinanciere[];
// }

// // Fonction pour formater la date au format `yyyy-MM-dd`
// const formatDateForInput = (dateString: string | undefined) => {
//   if (!dateString) return '';
//   try {
//     const date = new Date(dateString);
//     return date.toISOString().split('T')[0];
//   } catch (e) {
//     console.error('Erreur lors du formatage de la date:', e);
//     return '';
//   }
// };

// const EntrepriseFormModal = ({
//   isOpen,
//   closeModal,
//   onSuccess,
//   entreprise,
//   beneficiaires,
//   ongs,
//   institutionsFinancieres
// }: EntrepriseFormModalProps) => {
//   const inputRef = useRef<HTMLSelectElement>(null);

//   // Initialisation du formulaire avec useForm d'Inertia
//   const { data, setData, post, put, errors, processing, reset } = useForm({
//     beneficiaires_id: '',
//     nom_entreprise: '',
//     secteur_activite: '',
//     date_creation: '',
//     statut_juridique: '',
//     adresse: '',
//     ville: '',
//     pays: '',
//     description: '',
//     domaine_activite: '',
//     niveau_mise_en_oeuvre: '',
//     ong_id: '',
//     institution_financiere_id: '',
//   });

//   // Effet pour pré-remplir le formulaire si une entreprise existe
//   useEffect(() => {
//     if (entreprise) {
//       setData({
//         beneficiaires_id: entreprise.beneficiaires_id || '',
//         nom_entreprise: entreprise.nom_entreprise || '',
//         secteur_activite: entreprise.secteur_activite || '',
//         date_creation: formatDateForInput(entreprise.date_creation) || '',
//         statut_juridique: entreprise.statut_juridique || '',
//         adresse: entreprise.adresse || '',
//         ville: entreprise.ville || '',
//         pays: entreprise.pays || '',
//         description: entreprise.description || '',
//         domaine_activite: entreprise.domaine_activite || '',
//         niveau_mise_en_oeuvre: entreprise.niveau_mise_en_oeuvre || '',
//         ong_id: entreprise.ong_id || '',
//         institution_financiere_id: entreprise.institution_financiere_id || '',
//       });
//     } else {
//       reset();
//     }

//     // Focus sur le premier champ lorsque le modal s'ouvre
//     if (isOpen && inputRef.current) {
//       setTimeout(() => inputRef.current?.focus(), 100);
//     }
//   }, [entreprise, isOpen, reset, setData]);

//   // Soumission du formulaire
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     const successMessage = entreprise?.id
//       ? "Entreprise mise à jour avec succès."
//       : "Entreprise ajoutée avec succès.";
//     const errorMessage = entreprise?.id
//       ? "Échec de la mise à jour de l'entreprise."
//       : "Échec d'ajout de l'entreprise.";

//     if (entreprise?.id) {
//       // Mettre à jour une entreprise existante
//       put(route('entreprises.update', entreprise.id), {
//         onSuccess: () => {
//           toast.success(successMessage);
//           closeModal();
//           reset();
//           onSuccess(); // Notifier le composant parent
//         },
//         onError: () => {
//           toast.error(errorMessage);
//         },
//       });
//     } else {
//       // Créer une nouvelle entreprise
//       post(route('entreprises.store'), {
//         onSuccess: () => {
//           toast.success(successMessage);
//           closeModal();
//           reset();
//           onSuccess(); // Notifier le composant parent
//         },
//         onError: () => {
//           toast.error(errorMessage);
//         },
//       });
//     }
//   };

//   return (
//     <Transition appear show={isOpen} as={Fragment}>
//       <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={closeModal}>
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
//             <Dialog.Panel className="fixed inset-0 bg-black bg-opacity-30" />
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
//             <Dialog.Panel className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
//               <Dialog.Title className="text-lg font-medium text-gray-900">
//                 {entreprise?.id ? 'Modifier une entreprise' : 'Ajouter une entreprise'}
//               </Dialog.Title>

//               <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {/* Promoteur (Bénéficiaire) associé */}
//                 <div>
//                   <label htmlFor="beneficiaires_id" className="block text-sm font-medium text-gray-700">
//                     Promoteur associé <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     id="beneficiaires_id"
//                     ref={inputRef}
//                     value={data.beneficiaires_id}
//                     onChange={(e) => setData('beneficiaires_id', e.target.value)}
//                     className="mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:text-gray-200"
//                     required
//                   >
//                     <option value="">-- Sélectionnez un promoteur --</option>
//                     {beneficiaires.map((beneficiaire) => (
//                       <option key={beneficiaire.id} value={beneficiaire.id}>
//                         {beneficiaire.nom} {beneficiaire.prenom}
//                       </option>
//                     ))}
//                   </select>
//                   {errors.beneficiaires_id && <span className="text-red-500 text-sm">{errors.beneficiaires_id}</span>}
//                 </div>

//                 {/* Nom de l'entreprise */}
//                 <div>
//                   <label htmlFor="nom_entreprise" className="block text-sm font-medium text-gray-700">
//                     Nom de l'entreprise <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     id="nom_entreprise"
//                     value={data.nom_entreprise}
//                     onChange={(e) => setData('nom_entreprise', e.target.value)}
//                     className="mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:text-gray-200"
//                     required
//                   />
//                   {errors.nom_entreprise && <span className="text-red-500 text-sm">{errors.nom_entreprise}</span>}
//                 </div>

//                 {/* Secteur d'activité */}
//                 <div>
//                   <label htmlFor="secteur_activite" className="block text-sm font-medium text-gray-700">
//                     Secteur d'activité <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     id="secteur_activite"
//                     value={data.secteur_activite}
//                     onChange={(e) => setData('secteur_activite', e.target.value)}
//                     className="mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:text-gray-200"
//                     required
//                   >
//                     <option value="">-- Sélectionnez un secteur --</option>
//                     <option value="Agriculture">Agriculture</option>
//                     <option value="Artisanat">Artisanat</option>
//                     <option value="Commerce">Commerce</option>
//                     <option value="Élevage">Élevage</option>
//                     <option value="Environnement">Environnement</option>
//                   </select>
//                   {errors.secteur_activite && <span className="text-red-500 text-sm">{errors.secteur_activite}</span>}
//                 </div>

//                 {/* Date de création */}
//                 <div>
//                   <label htmlFor="date_creation" className="block text-sm font-medium text-gray-700">
//                     Date de création <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="date"
//                     id="date_creation"
//                     value={data.date_creation}
//                     onChange={(e) => setData('date_creation', e.target.value)}
//                     className="mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:text-gray-200"
//                     required
//                   />
//                   {errors.date_creation && <span className="text-red-500 text-sm">{errors.date_creation}</span>}
//                 </div>

//                 {/* Statut juridique */}
//                 <div>
//                   <label htmlFor="statut_juridique" className="block text-sm font-medium text-gray-700">
//                     Statut juridique <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     id="statut_juridique"
//                     value={data.statut_juridique}
//                     onChange={(e) => setData('statut_juridique', e.target.value)}
//                     className="mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:text-gray-200"
//                     required
//                   >
//                     <option value="">-- Sélectionnez un statut --</option>
//                     <option value="SARL">SARL</option>
//                     <option value="SA">SA</option>
//                     <option value="SAS">SAS</option>
//                     <option value="SCS">SCS</option>
//                     <option value="SNC">SNC</option>
//                     <option value="GIE">GIE</option>
//                     <option value="SCP">SCP</option>
//                     <option value="SCI">SCI</option>
//                     <option value="Auto-entrepreneur">Auto-entrepreneur</option>
//                   </select>
//                   {errors.statut_juridique && <span className="text-red-500 text-sm">{errors.statut_juridique}</span>}
//                 </div>

//                 {/* Niveau de mise en œuvre */}
//                 <div>
//                   <label htmlFor="niveau_mise_en_oeuvre" className="block text-sm font-medium text-gray-700">
//                     Niveau de mise en œuvre
//                   </label>
//                   <select
//                     id="niveau_mise_en_oeuvre"
//                     value={data.niveau_mise_en_oeuvre}
//                     onChange={(e) => setData('niveau_mise_en_oeuvre', e.target.value)}
//                     className="mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:text-gray-200"
//                   >
//                     <option value="">-- Sélectionnez un niveau --</option>
//                     <option value="Création">Création</option>
//                     <option value="Renforcement">Renforcement</option>
//                   </select>
//                   {errors.niveau_mise_en_oeuvre && <span className="text-red-500 text-sm">{errors.niveau_mise_en_oeuvre}</span>}
//                 </div>

//                 {/* ONG d'appui */}
//                 <div>
//                   <label htmlFor="ong_id" className="block text-sm font-medium text-gray-700">
//                     ONG d'appui
//                   </label>
//                   <select
//                     id="ong_id"
//                     value={data.ong_id}
//                     onChange={(e) => setData('ong_id', e.target.value)}
//                     className="mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:text-gray-200"
//                   >
//                     <option value="">-- Sélectionnez une ONG --</option>
//                     {ongs.map((ong) => (
//                       <option key={ong.id} value={ong.id}>
//                         {ong.nom} {ong.sigle ? `(${ong.sigle})` : ''}
//                       </option>
//                     ))}
//                   </select>
//                   {errors.ong_id && <span className="text-red-500 text-sm">{errors.ong_id}</span>}
//                 </div>

//                 {/* Institution financière */}
//                 <div>
//                   <label htmlFor="institution_financiere_id" className="block text-sm font-medium text-gray-700">
//                     Institution financière
//                   </label>
//                   <select
//                     id="institution_financiere_id"
//                     value={data.institution_financiere_id}
//                     onChange={(e) => setData('institution_financiere_id', e.target.value)}
//                     className="mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:text-gray-200"
//                   >
//                     <option value="">-- Sélectionnez une institution --</option>
//                     {institutionsFinancieres.map((institution) => (
//                       <option key={institution.id} value={institution.id}>
//                         {institution.nom}
//                       </option>
//                     ))}
//                   </select>
//                   {errors.institution_financiere_id && <span className="text-red-500 text-sm">{errors.institution_financiere_id}</span>}
//                 </div>

//                 {/* Adresse */}
//                 <div>
//                   <label htmlFor="adresse" className="block text-sm font-medium text-gray-700">
//                     Adresse
//                   </label>
//                   <input
//                     type="text"
//                     id="adresse"
//                     value={data.adresse}
//                     onChange={(e) => setData('adresse', e.target.value)}
//                     className="mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:text-gray-200"
//                   />
//                   {errors.adresse && <span className="text-red-500 text-sm">{errors.adresse}</span>}
//                 </div>

//                 {/* Ville */}
//                 <div>
//                   <label htmlFor="ville" className="block text-sm font-medium text-gray-700">
//                     Ville <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     id="ville"
//                     value={data.ville}
//                     onChange={(e) => setData('ville', e.target.value)}
//                     className="mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:text-gray-200"
//                     required
//                   />
//                   {errors.ville && <span className="text-red-500 text-sm">{errors.ville}</span>}
//                 </div>

//                 {/* Pays */}
//                 <div>
//                   <label htmlFor="pays" className="block text-sm font-medium text-gray-700">
//                     Pays <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     id="pays"
//                     value={data.pays}
//                     onChange={(e) => setData('pays', e.target.value)}
//                     className="mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:text-gray-200"
//                     required
//                   />
//                   {errors.pays && <span className="text-red-500 text-sm">{errors.pays}</span>}
//                 </div>

//                 {/* Description sur deux colonnes */}
//                 <div className="col-span-1 md:col-span-2">
//                   <label htmlFor="description" className="block text-sm font-medium text-gray-700">
//                     Description
//                   </label>
//                   <textarea
//                     id="description"
//                     value={data.description}
//                     onChange={(e) => setData('description', e.target.value)}
//                     className="mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:text-gray-200"
//                     rows={3}
//                   />
//                   {errors.description && <span className="text-red-500 text-sm">{errors.description}</span>}
//                 </div>

//                 {/* Domaine d'activité sur deux colonnes */}
//                 <div className="col-span-1 md:col-span-2">
//                   <label htmlFor="domaine_activite" className="block text-sm font-medium text-gray-700">
//                     Domaine d'activité
//                   </label>
//                   <textarea
//                     id="domaine_activite"
//                     value={data.domaine_activite}
//                     onChange={(e) => setData('domaine_activite', e.target.value)}
//                     className="mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:text-gray-200"
//                     rows={3}
//                   />
//                   {errors.domaine_activite && <span className="text-red-500 text-sm">{errors.domaine_activite}</span>}
//                 </div>

//                 <div className="col-span-1 md:col-span-2 mt-6 flex justify-end">
//                   <button
//                     type="button"
//                     onClick={closeModal}
//                     className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md mr-2 hover:bg-gray-300"
//                   >
//                     Annuler
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
//                     disabled={processing}
//                   >
//                     {entreprise?.id ? 'Modifier' : 'Ajouter'}
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

// export default EntrepriseFormModal;
import React, { useEffect, useRef } from 'react';
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

interface ONG {
  id: number;
  nom: string;
  sigle?: string;
}

interface InstitutionFinanciere {
  id: number;
  nom: string;
}

interface EntrepriseFormModalProps {
  isOpen: boolean;
  closeModal: () => void;
  onSuccess: () => void; // Callback pour mettre à jour la liste sans rafraîchir la page
  entreprise?: {
    id?: number;
    beneficiaires_id: string | number;
    nom_entreprise: string;
    secteur_activite: string;
    date_creation: string;
    statut_juridique: string;
    adresse?: string;
    ville: string;
    pays: string;
    description?: string;
    domaine_activite?: string;
    niveau_mise_en_oeuvre?: string;
    ong_id?: string | number;
    institution_financiere_id?: string | number;
  } | null;
  beneficiaires: Beneficiaire[];
  ongs: ONG[];
  institutionsFinancieres: InstitutionFinanciere[];
}

// Fonction pour formater la date au format `yyyy-MM-dd`
const formatDateForInput = (dateString: string | undefined) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  } catch (e) {
    console.error('Erreur lors du formatage de la date:', e);
    return '';
  }
};

const EntrepriseFormModal = ({
  isOpen,
  closeModal,
  onSuccess,
  entreprise,
  beneficiaires,
  ongs,
  institutionsFinancieres
}: EntrepriseFormModalProps) => {
  const inputRef = useRef<HTMLSelectElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Initialisation du formulaire avec useForm d'Inertia
  const { data, setData, post, put, errors, processing, reset } = useForm({
    beneficiaires_id: '',
    nom_entreprise: '',
    secteur_activite: '',
    date_creation: '',
    statut_juridique: '',
    adresse: '',
    ville: '',
    pays: '',
    description: '',
    domaine_activite: '',
    niveau_mise_en_oeuvre: '',
    ong_id: '',
    institution_financiere_id: '',
  });

  // Effet pour pré-remplir le formulaire si une entreprise existe
  useEffect(() => {
    if (entreprise) {
      setData({
        beneficiaires_id: entreprise.beneficiaires_id || '',
        nom_entreprise: entreprise.nom_entreprise || '',
        secteur_activite: entreprise.secteur_activite || '',
        date_creation: formatDateForInput(entreprise.date_creation) || '',
        statut_juridique: entreprise.statut_juridique || '',
        adresse: entreprise.adresse || '',
        ville: entreprise.ville || '',
        pays: entreprise.pays || '',
        description: entreprise.description || '',
        domaine_activite: entreprise.domaine_activite || '',
        niveau_mise_en_oeuvre: entreprise.niveau_mise_en_oeuvre || '',
        ong_id: entreprise.ong_id || '',
        institution_financiere_id: entreprise.institution_financiere_id || '',
      });
    } else {
      reset();
    }

    // Focus sur le premier champ lorsque le modal s'ouvre
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [entreprise, isOpen, reset, setData]);

  // Soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const successMessage = entreprise?.id
      ? "Entreprise mise à jour avec succès."
      : "Entreprise ajoutée avec succès.";
    const errorMessage = entreprise?.id
      ? "Échec de la mise à jour de l'entreprise."
      : "Échec d'ajout de l'entreprise.";

    if (entreprise?.id) {
      // Mettre à jour une entreprise existante
      put(route('entreprises.update', entreprise.id), {
        onSuccess: () => {
          toast.success(successMessage);
          closeModal();
          reset();
          onSuccess(); // Notifier le composant parent
        },
        onError: () => {
          toast.error(errorMessage);
        },
      });
    } else {
      // Créer une nouvelle entreprise
      post(route('entreprises.store'), {
        onSuccess: () => {
          toast.success(successMessage);
          closeModal();
          reset();
          onSuccess(); // Notifier le composant parent
        },
        onError: () => {
          toast.error(errorMessage);
        },
      });
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={closeModal}>
        <div className="min-h-screen px-4 text-center">
          {/* Overlay de fond sombre */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Panel className="fixed inset-0 bg-black bg-opacity-30" />
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
            <Dialog.Panel className="inline-block w-full max-w-4xl text-left align-middle transition-all transform bg-white shadow-xl rounded-lg relative max-h-[90vh] overflow-hidden">
              {/* En-tête avec titre et bouton de fermeture */}
              <div className="sticky top-0 z-10 bg-white border-b p-4 flex justify-between items-center">
                <Dialog.Title className="text-lg font-medium text-gray-900">
                  {entreprise?.id ? 'Modifier une entreprise' : 'Ajouter une entreprise'}
                </Dialog.Title>
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <span className="sr-only">Fermer</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Corps du formulaire avec défilement */}
              <div className="overflow-y-auto p-4 max-h-[calc(90vh-130px)]">
                <form ref={formRef} id="entreprise-form" onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                  {/* Section: Information principale */}
                  <div className="col-span-full mb-2 border-b pb-2">
                    <h3 className="text-md font-medium text-gray-800">Informations principales</h3>
                  </div>

                  {/* Promoteur (Bénéficiaire) associé */}
                  <div>
                    <label htmlFor="beneficiaires_id" className="block text-sm font-medium text-gray-700">
                      Promoteur associé <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="beneficiaires_id"
                      ref={inputRef}
                      value={data.beneficiaires_id}
                      onChange={(e) => setData('beneficiaires_id', e.target.value)}
                      className="mt-1 p-2 w-full border rounded-md transition-colors focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">-- Sélectionnez un promoteur --</option>
                      {beneficiaires.map((beneficiaire) => (
                        <option key={beneficiaire.id} value={beneficiaire.id}>
                          {beneficiaire.nom} {beneficiaire.prenom}
                        </option>
                      ))}
                    </select>
                    {errors.beneficiaires_id && <span className="text-red-500 text-sm">{errors.beneficiaires_id}</span>}
                  </div>

                  {/* Nom de l'entreprise */}
                  <div>
                    <label htmlFor="nom_entreprise" className="block text-sm font-medium text-gray-700">
                      Nom de l'entreprise <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="nom_entreprise"
                      value={data.nom_entreprise}
                      onChange={(e) => setData('nom_entreprise', e.target.value)}
                      className="mt-1 p-2 w-full border rounded-md transition-colors focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    {errors.nom_entreprise && <span className="text-red-500 text-sm">{errors.nom_entreprise}</span>}
                  </div>

                  {/* Date de création */}
                  <div>
                    <label htmlFor="date_creation" className="block text-sm font-medium text-gray-700">
                      Date de création <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="date_creation"
                      value={data.date_creation}
                      onChange={(e) => setData('date_creation', e.target.value)}
                      className="mt-1 p-2 w-full border rounded-md transition-colors focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    {errors.date_creation && <span className="text-red-500 text-sm">{errors.date_creation}</span>}
                  </div>

                  {/* Secteur d'activité */}
                  <div>
                    <label htmlFor="secteur_activite" className="block text-sm font-medium text-gray-700">
                      Secteur d'activité <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="secteur_activite"
                      value={data.secteur_activite}
                      onChange={(e) => setData('secteur_activite', e.target.value)}
                      className="mt-1 p-2 w-full border rounded-md transition-colors focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">-- Sélectionnez un secteur --</option>
                      <option value="Agriculture">Agriculture</option>
                      <option value="Artisanat">Artisanat</option>
                      <option value="Commerce">Commerce</option>
                      <option value="Élevage">Élevage</option>
                      <option value="Environnement">Environnement</option>
                    </select>
                    {errors.secteur_activite && <span className="text-red-500 text-sm">{errors.secteur_activite}</span>}
                  </div>

                  {/* Statut juridique */}
                  <div>
                    <label htmlFor="statut_juridique" className="block text-sm font-medium text-gray-700">
                      Statut juridique <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="statut_juridique"
                      value={data.statut_juridique}
                      onChange={(e) => setData('statut_juridique', e.target.value)}
                      className="mt-1 p-2 w-full border rounded-md transition-colors focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">-- Sélectionnez un statut --</option>
                      <option value="SARL">SARL</option>
                      <option value="SA">SA</option>
                      <option value="SAS">SAS</option>
                      <option value="SCS">SCS</option>
                      <option value="SNC">SNC</option>
                      <option value="GIE">GIE</option>
                      <option value="SCP">SCP</option>
                      <option value="SCI">SCI</option>
                      <option value="Auto-entrepreneur">Auto-entrepreneur</option>
                    </select>
                    {errors.statut_juridique && <span className="text-red-500 text-sm">{errors.statut_juridique}</span>}
                  </div>

                  {/* Niveau de mise en œuvre */}
                  <div>
                    <label htmlFor="niveau_mise_en_oeuvre" className="block text-sm font-medium text-gray-700">
                      Niveau de mise en œuvre
                    </label>
                    <select
                      id="niveau_mise_en_oeuvre"
                      value={data.niveau_mise_en_oeuvre}
                      onChange={(e) => setData('niveau_mise_en_oeuvre', e.target.value)}
                      className="mt-1 p-2 w-full border rounded-md transition-colors focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">-- Sélectionnez un niveau --</option>
                      <option value="Création">Création</option>
                      <option value="Renforcement">Renforcement</option>
                    </select>
                    {errors.niveau_mise_en_oeuvre && <span className="text-red-500 text-sm">{errors.niveau_mise_en_oeuvre}</span>}
                  </div>

                  {/* Section: Localisation */}
                  <div className="col-span-full mt-4 mb-2 border-b pb-2">
                    <h3 className="text-md font-medium text-gray-800">Localisation</h3>
                  </div>

                  {/* Adresse */}
                  <div>
                    <label htmlFor="adresse" className="block text-sm font-medium text-gray-700">
                      Adresse
                    </label>
                    <input
                      type="text"
                      id="adresse"
                      value={data.adresse}
                      onChange={(e) => setData('adresse', e.target.value)}
                      className="mt-1 p-2 w-full border rounded-md transition-colors focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.adresse && <span className="text-red-500 text-sm">{errors.adresse}</span>}
                  </div>

                  {/* Ville */}
                  <div>
                    <label htmlFor="ville" className="block text-sm font-medium text-gray-700">
                      Ville <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="ville"
                      value={data.ville}
                      onChange={(e) => setData('ville', e.target.value)}
                      className="mt-1 p-2 w-full border rounded-md transition-colors focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    {errors.ville && <span className="text-red-500 text-sm">{errors.ville}</span>}
                  </div>

                  {/* Pays */}
                  <div>
                    <label htmlFor="pays" className="block text-sm font-medium text-gray-700">
                      Pays <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="pays"
                      value={data.pays}
                      onChange={(e) => setData('pays', e.target.value)}
                      className="mt-1 p-2 w-full border rounded-md transition-colors focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    {errors.pays && <span className="text-red-500 text-sm">{errors.pays}</span>}
                  </div>

                  {/* Section: Support et financement */}
                  <div className="col-span-full mt-4 mb-2 border-b pb-2">
                    <h3 className="text-md font-medium text-gray-800">Support et financement</h3>
                  </div>

                  {/* ONG d'appui */}
                  <div>
                    <label htmlFor="ong_id" className="block text-sm font-medium text-gray-700">
                      ONG d'appui
                    </label>
                    <select
                      id="ong_id"
                      value={data.ong_id}
                      onChange={(e) => setData('ong_id', e.target.value)}
                      className="mt-1 p-2 w-full border rounded-md transition-colors focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">-- Sélectionnez une ONG --</option>
                      {ongs.map((ong) => (
                        <option key={ong.id} value={ong.id}>
                          {ong.nom} {ong.sigle ? `(${ong.sigle})` : ''}
                        </option>
                      ))}
                    </select>
                    {errors.ong_id && <span className="text-red-500 text-sm">{errors.ong_id}</span>}
                  </div>

                  {/* Institution financière */}
                  <div>
                    <label htmlFor="institution_financiere_id" className="block text-sm font-medium text-gray-700">
                      Institution financière
                    </label>
                    <select
                      id="institution_financiere_id"
                      value={data.institution_financiere_id}
                      onChange={(e) => setData('institution_financiere_id', e.target.value)}
                      className="mt-1 p-2 w-full border rounded-md transition-colors focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">-- Sélectionnez une institution --</option>
                      {institutionsFinancieres.map((institution) => (
                        <option key={institution.id} value={institution.id}>
                          {institution.nom}
                        </option>
                      ))}
                    </select>
                    {errors.institution_financiere_id && <span className="text-red-500 text-sm">{errors.institution_financiere_id}</span>}
                  </div>

                  {/* Section: Détails */}
                  <div className="col-span-full mt-4 mb-2 border-b pb-2">
                    <h3 className="text-md font-medium text-gray-800">Détails</h3>
                  </div>

                  {/* Description sur deux colonnes */}
                  <div className="col-span-full sm:col-span-2 lg:col-span-3">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description de l'entreprise
                    </label>
                    <textarea
                      id="description"
                      value={data.description}
                      onChange={(e) => setData('description', e.target.value)}
                      className="mt-1 p-2 w-full border rounded-md transition-colors focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                    />
                    {errors.description && <span className="text-red-500 text-sm">{errors.description}</span>}
                  </div>

                
                </form>
              </div>

              {/* Pied de page fixe avec boutons */}
              <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end space-x-2 shadow-md">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  form="entreprise-form"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                  disabled={processing}
                >
                  {processing ? 'Traitement...' : entreprise?.id ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EntrepriseFormModal;
