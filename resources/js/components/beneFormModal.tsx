// /* eslint-disable @typescript-eslint/no-unused-vars */
// import React, { useEffect } from 'react';
// import { Dialog, Transition } from '@headlessui/react';
// import { Fragment } from 'react';
// import { router, useForm } from '@inertiajs/react';
// import { Toaster, toast } from 'sonner';


// interface BeneficiaireFormModalProps {
//   isOpen: boolean;
//   closeModal: () => void;
//   beneficiaire?: {
//     id?: number;
//     nom: string;
//     prenom: string;
//     date_de_naissance: string;
//     sexe: string;
//     contact: string;
//     email: string;
//     adresse: string;
//     niveau_education: string;
//     date_inscription: string;
//     statut_actuel: string;
//   };
// }

// const BeneficiaireFormModal = ({ isOpen, closeModal, beneficiaire }: BeneficiaireFormModalProps) => {
//   const { data, setData, post, put, errors, processing, reset } = useForm({
//     nom: beneficiaire?.nom || '',
//     prenom: beneficiaire?.prenom || '',
//     date_de_naissance: beneficiaire?.date_de_naissance || '',
//     sexe: beneficiaire?.sexe || '',
//     contact: beneficiaire?.contact || '',
//     email: beneficiaire?.email || '',
//     adresse: beneficiaire?.adresse || '',
//     niveau_education: beneficiaire?.niveau_education || '',
//     date_inscription: beneficiaire?.date_inscription || '',
//     statut_actuel: beneficiaire?.statut_actuel || '',
//   });

//   useEffect(() => {
//     if (beneficiaire) {
//       setData({
//         nom: beneficiaire.nom || '',
//         prenom: beneficiaire.prenom || '',
//         date_de_naissance: beneficiaire.date_de_naissance || '',
//         sexe: beneficiaire.sexe || '',
//         contact: beneficiaire.contact || '',
//         email: beneficiaire.email || '',
//         adresse: beneficiaire.adresse || '',
//         niveau_education: beneficiaire.niveau_education || '',
//         date_inscription: beneficiaire.date_inscription || '',
//         statut_actuel: beneficiaire.statut_actuel || '',
//       });
//     } else {
//       reset();
//     }
//   }, [beneficiaire, isOpen, reset, setData]);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
// const successMessage= beneficiaire?.id? "Bénéficiaire mis à jour avec succès.":"Bénéficiaire ajouté avec succès.";
// const ErrorMessage= beneficiaire?.id? "Echec du mis à jour du Bénéficiaire.":"Echec d'ajouté Bénéficiaire.";

//     if (beneficiaire?.id) {
//       put(route('beneficiaires.update', beneficiaire.id), {
//         onSuccess: () => {
//             toast.success(successMessage)
//           closeModal();
//           reset();
//         }
//       });
//     } else {
//       post(route('beneficiaires.store'), {
//         onSuccess: () => {
//             toast.success(successMessage)
//           closeModal();
//           reset();
//         }, onError:(errors)=>{
//             toast.success(ErrorMessage)

//         }
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

//           {/* This element is to trick the browser into centering the modal contents. */}
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
//             <Dialog.Panel className="inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
//               <Dialog.Title className="text-lg font-medium text-gray-900">
//                 {beneficiaire?.id ? 'Modifier un bénéficiaire' : 'Ajouter un bénéficiaire'}
//               </Dialog.Title>



//               <form onSubmit={handleSubmit}>
//                 {/* Nom */}
//                 <div className="mt-4">
//                   <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
//                     Nom
//                   </label>
//                   <input
//                     type="text"
//                     id="nom"
//                     value={data.nom}
//                     onChange={(e) => setData('nom', e.target.value)}
//                     className="mt-1 p-2 w-full border rounded-md"
//                   />
//                   {errors.nom && <span className="text-red-500 text-sm">{errors.nom}</span>}
//                 </div>

//                 {/* Prénom */}
//                 <div className="mt-4">
//                   <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">
//                     Prénom
//                   </label>
//                   <input
//                     type="text"
//                     id="prenom"
//                     value={data.prenom}
//                     onChange={(e) => setData('prenom', e.target.value)}
//                     className="mt-1 p-2 w-full border rounded-md"
//                   />
//                   {errors.prenom && <span className="text-red-500 text-sm">{errors.prenom}</span>}
//                 </div>

//                 {/* Date de naissance */}
//                 <div className="mt-4">
//                   <label htmlFor="date_de_naissance" className="block text-sm font-medium text-gray-700">
//                     Date de naissance
//                   </label>
//                   <input
//                     type="date"
//                     id="date_de_naissance"
//                     value={data.date_de_naissance}
//                     onChange={(e) => setData('date_de_naissance', e.target.value)}
//                     className="mt-1 p-2 w-full border rounded-md"
//                   />
//                   {errors.date_de_naissance && (
//                     <span className="text-red-500 text-sm">{errors.date_de_naissance}</span>
//                   )}
//                 </div>

//                 {/* Sexe */}
//                 <div className="mt-4">
//                   <label htmlFor="sexe" className="block text-sm font-medium text-gray-700">
//                     Sexe
//                   </label>
//                   <select
//                     id="sexe"
//                     value={data.sexe}
//                     onChange={(e) => setData('sexe', e.target.value)}
//                     className="mt-1 p-2 w-full border rounded-md"
//                   >
//                     <option value="">Sélectionner</option>
//                     <option value="M">Masculin</option>
//                     <option value="F">Féminin</option>
//                   </select>
//                   {errors.sexe && <span className="text-red-500 text-sm">{errors.sexe}</span>}
//                 </div>

//                 {/* Contact */}
//                 <div className="mt-4">
//                   <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
//                     Contact
//                   </label>
//                   <input
//                     type="text"
//                     id="contact"
//                     value={data.contact}
//                     onChange={(e) => setData('contact', e.target.value)}
//                     className="mt-1 p-2 w-full border rounded-md"
//                   />
//                   {errors.contact && <span className="text-red-500 text-sm">{errors.contact}</span>}
//                 </div>

//                 {/* Email */}
//                 <div className="mt-4">
//                   <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                     Email
//                   </label>
//                   <input
//                     type="email"
//                     id="email"
//                     value={data.email}
//                     onChange={(e) => setData('email', e.target.value)}
//                     className="mt-1 p-2 w-full border rounded-md"
//                   />
//                   {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
//                 </div>

//                 {/* Adresse */}
//                 <div className="mt-4">
//                   <label htmlFor="adresse" className="block text-sm font-medium text-gray-700">
//                     Adresse
//                   </label>
//                   <textarea
//                     id="adresse"
//                     value={data.adresse}
//                     onChange={(e) => setData('adresse', e.target.value)}
//                     className="mt-1 p-2 w-full border rounded-md"
//                   />
//                   {errors.adresse && <span className="text-red-500 text-sm">{errors.adresse}</span>}
//                 </div>

//                 {/* Niveau d'éducation */}
//                 <div className="mt-4">
//                   <label htmlFor="niveau_education" className="block text-sm font-medium text-gray-700">
//                     Niveau d'éducation
//                   </label>
//                   <select
//                     id="niveau_education"
//                     value={data.niveau_education}
//                     onChange={(e) => setData('niveau_education', e.target.value)}
//                     className="mt-1 p-2 w-full border rounded-md"
//                   >
//                     <option value="">Sélectionner</option>
//                     <option value="Primaire">Primaire</option>
//                     <option value="Secondaire">Secondaire</option>
//                     <option value="Supérieur">Supérieur</option>
//                     <option value="Autre">Autre</option>
//                   </select>
//                   {errors.niveau_education && (
//                     <span className="text-red-500 text-sm">{errors.niveau_education}</span>
//                   )}
//                 </div>

//                 {/* Date d'inscription */}
//                 <div className="mt-4">
//                   <label htmlFor="date_inscription" className="block text-sm font-medium text-gray-700">
//                     Date d'inscription
//                   </label>
//                   <input
//                     type="date"
//                     id="date_inscription"
//                     value={data.date_inscription}
//                     onChange={(e) => setData('date_inscription', e.target.value)}
//                     className="mt-1 p-2 w-full border rounded-md"
//                   />
//                   {errors.date_inscription && (
//                     <span className="text-red-500 text-sm">{errors.date_inscription}</span>
//                   )}
//                 </div>

//                 {/* Statut actuel */}
//                 <div className="mt-4">
//                   <label htmlFor="statut_actuel" className="block text-sm font-medium text-gray-700">
//                     Statut actuel
//                   </label>
//                   <select
//                     id="statut_actuel"
//                     value={data.statut_actuel}
//                     onChange={(e) => setData('statut_actuel', e.target.value)}
//                     className="mt-1 p-2 w-full border rounded-md"
//                   >
//                     <option value="">Sélectionner</option>
//                     <option value="Actif">Actif</option>
//                     <option value="Inactif">Inactif</option>
//                     <option value="En attente">En attente</option>
//                   </select>
//                   {errors.statut_actuel && (
//                     <span className="text-red-500 text-sm">{errors.statut_actuel}</span>
//                   )}
//                 </div>

//                 <div className="mt-6 flex justify-end">
//                   <button
//                     type="button"
//                     onClick={closeModal}
//                     className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md mr-2"
//                   >
//                     Annuler
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={processing}
//                     className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md disabled:bg-gray-300"
//                   >
//                     {processing ? 'Enregistrement...' : 'Enregistrer'}
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

// export default BeneficiaireFormModal;
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { router, useForm } from '@inertiajs/react';
import { Toaster, toast } from 'sonner';


interface BeneficiaireFormModalProps {
    isOpen: boolean;
    closeModal: () => void;
    beneficiaire?: {
        id?: number;
        region: string;
        village: string;
        type_beneficiaire: string;
        nom: string;
        prenom: string;
        date_de_naissance: string;
        genre: string;
        handicap: boolean;
        contact: string;
        email: string;
        niveau_instruction: string;
        activite: string;
        domaine_activite: string;
        niveau_mise_en_oeuvre: string;
        ong_id: number | null;
        institution_financiere_id: number | null;
        date_inscription: string;
        statut_actuel: string;
    };
}

const BeneficiaireFormModal = ({ isOpen, closeModal, beneficiaire }: BeneficiaireFormModalProps) => {
    const { data, setData, post, put, errors, processing, reset } = useForm({
        region: beneficiaire?.region || '',
        village: beneficiaire?.village || '',
        type_beneficiaire: beneficiaire?.type_beneficiaire || '',
        nom: beneficiaire?.nom || '',
        prenom: beneficiaire?.prenom || '',
        date_de_naissance: beneficiaire?.date_de_naissance || '',
        genre: beneficiaire?.genre || '',
        handicap: beneficiaire?.handicap || false,
        contact: beneficiaire?.contact || '',
        email: beneficiaire?.email || '',
        niveau_instruction: beneficiaire?.niveau_instruction || '',
        activite: beneficiaire?.activite || '',
        domaine_activite: beneficiaire?.domaine_activite || '',
        niveau_mise_en_oeuvre: beneficiaire?.niveau_mise_en_oeuvre || '',
        ong_id: beneficiaire?.ong_id || null,
        institution_financiere_id: beneficiaire?.institution_financiere_id || null,
        date_inscription: beneficiaire?.date_inscription || '',
        statut_actuel: beneficiaire?.statut_actuel || '',
    });

    useEffect(() => {
        if (beneficiaire) {
            setData({
                region: beneficiaire.region || '',
                village: beneficiaire.village || '',
                type_beneficiaire: beneficiaire.type_beneficiaire || '',
                nom: beneficiaire.nom || '',
                prenom: beneficiaire.prenom || '',
                date_de_naissance: beneficiaire.date_de_naissance || '',
                genre: beneficiaire.genre || '',
                handicap: beneficiaire.handicap || false,
                contact: beneficiaire.contact || '',
                email: beneficiaire.email || '',
                niveau_instruction: beneficiaire.niveau_instruction || '',
                activite: beneficiaire.activite || '',
                domaine_activite: beneficiaire.domaine_activite || '',
                niveau_mise_en_oeuvre: beneficiaire.niveau_mise_en_oeuvre || '',
                ong_id: beneficiaire.ong_id || null,
                institution_financiere_id: beneficiaire.institution_financiere_id || null,
                date_inscription: beneficiaire.date_inscription || '',
                statut_actuel: beneficiaire.statut_actuel || '',
            });
        } else {
            reset();
        }
    }, [beneficiaire, isOpen, reset, setData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const successMessage = beneficiaire?.id ? "Bénéficiaire mis à jour avec succès." : "Bénéficiaire ajouté avec succès.";
        const errorMessage = beneficiaire?.id ? "Echec de la mise à jour du Bénéficiaire." : "Echec d'ajout du Bénéficiaire.";

        if (beneficiaire?.id) {
            put(route('beneficiaires.update', beneficiaire.id), {
                onSuccess: () => {
                    toast.success(successMessage);
                    closeModal();
                    reset();
                },
                onError: () => {
                    toast.error(errorMessage);
                }
            });
        } else {
            post(route('beneficiaires.store'), {
                onSuccess: () => {
                    toast.success(successMessage);
                    closeModal();
                    reset();
                },
                onError: () => {
                    toast.error(errorMessage);
                }
            });
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={closeModal}>
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
                        <Dialog.Panel className="fixed inset-0 bg-black bg-opacity-30" />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
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
                        <Dialog.Panel className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
                            <Dialog.Title className="text-lg font-medium text-gray-900">
                                {beneficiaire?.id ? 'Modifier un bénéficiaire' : 'Ajouter un bénéficiaire'}
                            </Dialog.Title>

                            <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Région */}
                                <div>
                                    <label htmlFor="region" className="block text-sm font-medium text-gray-700">
                                        Région
                                    </label>
                                    <input
                                        type="text"
                                        id="region"
                                        value={data.region}
                                        onChange={(e) => setData('region', e.target.value)}
                                        className="mt-1 p-2 w-full border rounded-md"
                                    />
                                    {errors.region && <span className="text-red-500 text-sm">{errors.region}</span>}
                                </div>

                                {/* Village */}
                                <div>
                                    <label htmlFor="village" className="block text-sm font-medium text-gray-700">
                                        Village
                                    </label>
                                    <input
                                        type="text"
                                        id="village"
                                        value={data.village}
                                        onChange={(e) => setData('village', e.target.value)}
                                        className="mt-1 p-2 w-full border rounded-md"
                                    />
                                    {errors.village && <span className="text-red-500 text-sm">{errors.village}</span>}
                                </div>

                                {/* Type de bénéficiaire */}
                                <div>
                                    <label htmlFor="type_beneficiaire" className="block text-sm font-medium text-gray-700">
                                        Type de bénéficiaire
                                    </label>
                                    <select
                                        id="type_beneficiaire"
                                        value={data.type_beneficiaire}
                                        onChange={(e) => setData('type_beneficiaire', e.target.value)}
                                        className="mt-1 p-2 w-full border rounded-md"
                                    >
                                        <option value="">Sélectionner</option>
                                        <option value="Individuel">Individuel</option>
                                        <option value="Coopérative">Coopérative</option>
                                        <option value="Autre">Autre</option>
                                    </select>
                                    {errors.type_beneficiaire && <span className="text-red-500 text-sm">{errors.type_beneficiaire}</span>}
                                </div>

                                {/* Nom */}
                                <div>
                                    <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                                        Nom
                                    </label>
                                    <input
                                        type="text"
                                        id="nom"
                                        value={data.nom}
                                        onChange={(e) => setData('nom', e.target.value)}
                                        className="mt-1 p-2 w-full border rounded-md"
                                    />
                                    {errors.nom && <span className="text-red-500 text-sm">{errors.nom}</span>}
                                </div>

                                {/* Prénom */}
                                <div>
                                    <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">
                                        Prénom
                                    </label>
                                    <input
                                        type="text"
                                        id="prenom"
                                        value={data.prenom}
                                        onChange={(e) => setData('prenom', e.target.value)}
                                        className="mt-1 p-2 w-full border rounded-md"
                                    />
                                    {errors.prenom && <span className="text-red-500 text-sm">{errors.prenom}</span>}
                                </div>

                                {/* Date de naissance */}
                                <div>
                                    <label htmlFor="date_de_naissance" className="block text-sm font-medium text-gray-700">
                                        Date de naissance
                                    </label>
                                    <input
                                        type="date"
                                        id="date_de_naissance"
                                        value={data.date_de_naissance}
                                        onChange={(e) => setData('date_de_naissance', e.target.value)}
                                        className="mt-1 p-2 w-full border rounded-md"
                                    />
                                    {errors.date_de_naissance && (
                                        <span className="text-red-500 text-sm">{errors.date_de_naissance}</span>
                                    )}
                                </div>

                                {/* Genre */}
                                <div>
                                    <label htmlFor="genre" className="block text-sm font-medium text-gray-700">
                                        Genre
                                    </label>
                                    <select
                                        id="genre"
                                        value={data.genre}
                                        onChange={(e) => setData('genre', e.target.value)}
                                        className="mt-1 p-2 w-full border rounded-md"
                                    >
                                        <option value="">Sélectionner</option>
                                        <option value="Homme">Homme</option>
                                        <option value="Femme">Femme</option>
                                    </select>
                                    {errors.genre && <span className="text-red-500 text-sm">{errors.genre}</span>}
                                </div>

                                {/* Handicap */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Handicap
                                    </label>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="handicap"
                                            checked={data.handicap}
                                            onChange={(e) => setData('handicap', e.target.checked)}
                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                        />
                                        <label htmlFor="handicap" className="ml-2 text-sm text-gray-700">
                                            Personne en situation de handicap
                                        </label>
                                    </div>
                                    {errors.handicap && <span className="text-red-500 text-sm">{errors.handicap}</span>}
                                </div>

                                {/* Contact */}
                                <div>
                                    <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
                                        Contact
                                    </label>
                                    <input
                                        type="text"
                                        id="contact"
                                        value={data.contact}
                                        onChange={(e) => setData('contact', e.target.value)}
                                        className="mt-1 p-2 w-full border rounded-md"
                                    />
                                    {errors.contact && <span className="text-red-500 text-sm">{errors.contact}</span>}
                                </div>

                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="mt-1 p-2 w-full border rounded-md"
                                    />
                                    {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
                                </div>

                                {/* Niveau d'instruction */}
                                <div>
                                    <label htmlFor="niveau_instruction" className="block text-sm font-medium text-gray-700">
                                        Niveau d'instruction
                                    </label>
                                    <select
                                        id="niveau_instruction"
                                        value={data.niveau_instruction}
                                        onChange={(e) => setData('niveau_instruction', e.target.value)}
                                        className="mt-1 p-2 w-full border rounded-md"
                                    >
                                        <option value="">Sélectionner</option>
                                        <option value="Analphabète">Analphabète</option>
                                        <option value="Alphabétise">Alphabétise</option>
                                        <option value="Primaire">Primaire</option>
                                        <option value="CEPE">CEPE</option>
                                        <option value="BEPC">BEPC</option>
                                        <option value="Baccalauréat">Baccalauréat</option>
                                        <option value="Universitaire">Universitaire</option>
                                        <option value="Autre">Autre</option>
                                    </select>
                                    {errors.niveau_instruction && (
                                        <span className="text-red-500 text-sm">{errors.niveau_instruction}</span>
                                    )}
                                </div>

                                {/* Activité */}
                                <div>
                                    <label htmlFor="activite" className="block text-sm font-medium text-gray-700">
                                        Activité
                                    </label>
                                    <input
                                        type="text"
                                        id="activite"
                                        value={data.activite}
                                        onChange={(e) => setData('activite', e.target.value)}
                                        className="mt-1 p-2 w-full border rounded-md"
                                    />
                                    {errors.activite && <span className="text-red-500 text-sm">{errors.activite}</span>}
                                </div>

                                {/* Domaine d'activité */}
                                <div>
                                    <label htmlFor="domaine_activite" className="block text-sm font-medium text-gray-700">
                                        Domaine d'activité
                                    </label>
                                    <select
                                        id="domaine_activite"
                                        value={data.niveau_instruction}
                                        onChange={(e) => setData('domaine_activite', e.target.value)}
                                        className="mt-1 p-2 w-full border rounded-md"
                                    >
                                        <option value="">Sélectionner</option>
                                        <option value="Agriculture">Agriculture</option>
                                        <option value="Artisanat">Artisanat</option>
                                        <option value="Commerce">Commerce</option>
                                        <option value="Elevage">Elevage</option>
                                        <option value="Environnement">Environnement</option>
                                        <option value="Autre">Autre</option>
                                    </select>

                                    {errors.domaine_activite && <span className="text-red-500 text-sm">{errors.domaine_activite}</span>}
                                </div>

                                {/* Niveau mise en œuvre */}
                                <div>
                                    <label htmlFor="niveau_mise_en_oeuvre" className="block text-sm font-medium text-gray-700">
                                        Niveau de mise en œuvre
                                    </label>
                                    <select
                                        id="niveau_mise_en_oeuvre"
                                        value={data.niveau_mise_en_oeuvre}
                                        onChange={(e) => setData('niveau_mise_en_oeuvre', e.target.value)}
                                        className="mt-1 p-2 w-full border rounded-md"
                                    >
                                        <option value="">Sélectionner</option>
                                        <option value="Création">Création</option>
                                        <option value="Renforcement">Renforcement</option>
                                    </select>
                                    {errors.niveau_mise_en_oeuvre && (
                                        <span className="text-red-500 text-sm">{errors.niveau_mise_en_oeuvre}</span>
                                    )}
                                </div>

                                {/* Date d'inscription */}
                                <div>
                                    <label htmlFor="date_inscription" className="block text-sm font-medium text-gray-700">
                                        Date d'inscription
                                    </label>
                                    <input
                                        type="date"
                                        id="date_inscription"
                                        value={data.date_inscription}
                                        onChange={(e) => setData('date_inscription', e.target.value)}
                                        className="mt-1 p-2 w-full border rounded-md"
                                    />
                                    {errors.date_inscription && (
                                        <span className="text-red-500 text-sm">{errors.date_inscription}</span>
                                    )}
                                </div>





                                {/* Statut actuel */}
                                <div>
                                    <label htmlFor="statut_actuel" className="block text-sm font-medium text-gray-700">
                                        Statut actuel
                                    </label>
                                    <select
                                        id="statut_actuel"
                                        value={data.statut_actuel}
                                        onChange={(e) => setData('statut_actuel', e.target.value)}
                                        className="mt-1 p-2 w-full border rounded-md"
                                    >
                                        <option value="">Sélectionner</option>
                                        <option value="Actif">Actif</option>
                                        <option value="Inactif">Inactif</option>
                                        <option value="En attente">En attente</option>
                                    </select>
                                    {errors.statut_actuel && (
                                        <span className="text-red-500 text-sm">{errors.statut_actuel}</span>
                                    )}
                                </div>


                                <div className="col-span-1 md:col-span-2 mt-6 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md mr-2"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md disabled:bg-gray-300"
                                    >
                                        {processing ? 'Enregistrement...' : 'Enregistrer'}
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

export default BeneficiaireFormModal;
