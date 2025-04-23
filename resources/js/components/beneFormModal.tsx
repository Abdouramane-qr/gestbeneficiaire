
import React, { useEffect, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';

// Types pour les régions, provinces et communes
type RegionsProvinces = {
    [key: string]: string[];
};

const regionsProvinces: RegionsProvinces = {
    "Est": ["Gnagna", "Gourma", "Komondjari", "Kompienga", "Tapoa"],
    "Plateau Central": ["Ganzourgou", "Kourwéogo", "Oubritenga"],
    "Centre-Sud": ["Bazèga", "Nahouri", "Zoundwéogo"],
    "Centre-Est": ["Boulgou", "Koulpélogo", "Kouritenga"],
};

type ProvincesCommunes = {
    [key: string]: string[];
};

const provincesCommunes: ProvincesCommunes = {
    "Gnagna": ["Bilanga", "Bogandé", "Coalla", "Liptougou", "Manni", "Piéla", "Thion"],
    "Gourma": ["Fada N'Gourma", "Diabo", "Matiacoali", "Tibga", "Yamba"],
    "Komondjari": ["Gayéri", "Bartiébougou", "Foutouri"],
    "Kompienga": ["Pama", "Kompienga", "Madjoari"],
    "Tapoa": ["Diapaga", "Botou", "Kantchari", "Logobou", "Namounou", "Tambaga", "Tansarga", "Tiantiaka"],

    // Plateau Central
    "Ganzourgou": ["Zorgho", "Boudry", "Salogo", "Mogtédo", "Méguet", "Zam", "Zoungou"],
    "Kourwéogo": ["Boussé", "Laye", "Niou", "Sourgoubila", "Toéghin"],
    "Oubritenga": ["Ziniaré", "Dapelogo", "Loumbila", "Ourgou-Manéga", "Samorogouan"],

    // Centre-Sud
    "Bazèga": ["Kombissiri", "Doulougou", "Ipelcé", "Kayao", "Toécé"],
    "Nahouri": ["Pô", "Guiaro", "Tiébélé", "Ziou"],
    "Zoundwéogo": ["Manga", "Bindé", "Gogo", "Guiba", "Zabré", "Béré"],

    // Centre-Est
    "Boulgou": ["Tenkodogo", "Bagré", "Bittou", "Zabré", "Niaogho"],
    "Koulpélogo": ["Ouargaye", "Comin-Yanga", "Dourtenga", "Soudougui"],
    "Kouritenga": ["Koupéla", "Andemtenga", "Dialgaye", "Pouytenga", "Tensobentenga"],
};

interface BeneficiaireFormModalProps {
    isOpen: boolean;
    closeModal: () => void;
    onSuccess: () => void;
    beneficiaire?: {
        id?: number;
        regions: string;
        communes: string;
        provinces: string;
        village: string;
        type_beneficiaire: string;
        nom: string;
        prenom: string;
        date_de_naissance: string;
        genre: string;
        //handicap: boolean;
        contact: string;
        email: string;
        niveau_instruction: string;
    } | null;
}

// Formater la date pour l'élément <input type="date">
const formatDateForInput = (dateString: string | undefined) => {
    if (!dateString) return '';
    return dateString.split('T')[0];
}

const BeneficiaireFormModal = ({ isOpen, closeModal, onSuccess, beneficiaire }: BeneficiaireFormModalProps) => {
    const inputRef = useRef<HTMLSelectElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    // Initialisation du formulaire avec useForm d'Inertia
    const { data, setData, post, put, errors, processing, reset } = useForm({
        regions: '',
        provinces: '',
        communes: '',
        village: '',
        type_beneficiaire: '',
        nom: '',
        prenom: '',
        date_de_naissance: '',
        genre: '',
       // handicap: false,
        contact: '',
        email: '',
        niveau_instruction: '',
    });

    // États pour les listes dynamiques
    const [provincesList, setProvincesList] = useState<string[]>([]);
    const [communesList, setCommunesList] = useState<string[]>([]);

    // Effet pour pré-remplir le formulaire si un bénéficiaire existe
    useEffect(() => {
        if (beneficiaire) {
            setData({
                regions: beneficiaire.regions || '',
                provinces: beneficiaire.provinces || '',
                communes: beneficiaire.communes || '',
                village: beneficiaire.village || '',
                type_beneficiaire: beneficiaire.type_beneficiaire || '',
                nom: beneficiaire.nom || '',
                prenom: beneficiaire.prenom || '',
                date_de_naissance: beneficiaire.date_de_naissance || '',
                genre: beneficiaire.genre || '',
                //handicap: beneficiaire.handicap || false,
                contact: beneficiaire.contact || '',
                email: beneficiaire.email || '',
                niveau_instruction: beneficiaire.niveau_instruction || '',
            });

            // Mettre à jour les listes de provinces et communes
            if (beneficiaire.regions) {
                setProvincesList(regionsProvinces[beneficiaire.regions] || []);
            }
            if (beneficiaire.provinces) {
                setCommunesList(provincesCommunes[beneficiaire.provinces] || []);
            }
        } else {
            reset();
            setProvincesList([]);
            setCommunesList([]);
        }

        // Focus sur le premier champ lorsque le modal s'ouvre
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [beneficiaire, isOpen, reset, setData]);

    // Gestion du changement de région
    const handleRegionChange = (region: string) => {
        setData('regions', region);
        setData('provinces', ''); // Réinitialiser la province
        setData('communes', ''); // Réinitialiser la commune
        setProvincesList(regionsProvinces[region] || []);
        setCommunesList([]);
    };

    // Gestion du changement de province
    const handleProvinceChange = (province: string) => {
        setData('provinces', province);
        setData('communes', ''); // Réinitialiser la commune
        setCommunesList(provincesCommunes[province] || []);
    };

    // Soumission du formulaire
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const successMessage = beneficiaire?.id
            ? "Bénéficiaire mis à jour avec succès."
            : "Bénéficiaire ajouté avec succès.";
        const errorMessage = beneficiaire?.id
            ? "Échec de la mise à jour du bénéficiaire."
            : "Échec d'ajout du bénéficiaire.";

        if (beneficiaire?.id) {
            // Mettre à jour un bénéficiaire existant
            put(route('beneficiaires.update', beneficiaire.id), {
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
            // Créer un nouveau bénéficiaire
            post(route('beneficiaires.store'), {
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
                        <Dialog.Panel className="inline-block w-full max-w-3xl text-left align-middle transition-all transform bg-white shadow-xl rounded-lg relative max-h-[90vh] overflow-hidden">
                            {/* En-tête avec titre fixe */}
                            <div className="sticky top-0 z-10 bg-white border-b p-4">
                                <Dialog.Title className="text-lg font-medium text-gray-900">
                                    {beneficiaire?.id ? 'Modifier un Promoteur' : 'Ajouter un Promoteur'}
                                </Dialog.Title>
                            </div>

                            {/* Corps du formulaire avec défilement */}
                            <div className="overflow-y-auto p-4 max-h-[calc(90vh-120px)]">
                                <form ref={formRef} onSubmit={handleSubmit} id="beneficiaire-form" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {/* Région */}
                                    <div>
                                        <label htmlFor="regions" className="block text-sm font-medium text-gray-700">
                                            Région <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="regions"
                                            ref={inputRef}
                                            value={data.regions}
                                            onChange={(e) => handleRegionChange(e.target.value)}
                                            className="mt-1 p-2 w-full border rounded-md transition-colors focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">-- Sélectionnez une région --</option>
                                            {Object.keys(regionsProvinces).map((region) => (
                                                <option key={region} value={region}>
                                                    {region}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.regions && <span className="text-red-500 text-sm">{errors.regions}</span>}
                                    </div>

                                    {/* Province */}
                                    <div>
                                        <label htmlFor="provinces" className="block text-sm font-medium text-gray-700">
                                            Province <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="provinces"
                                            value={data.provinces}
                                            onChange={(e) => handleProvinceChange(e.target.value)}
                                            className="mt-1 p-2 w-full border rounded-md transition-colors focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">-- Sélectionnez une province --</option>
                                            {provincesList.map((province) => (
                                                <option key={province} value={province}>
                                                    {province}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.provinces && <span className="text-red-500 text-sm">{errors.provinces}</span>}
                                    </div>

                                    {/* Commune */}
                                    <div>
                                        <label htmlFor="communes" className="block text-sm font-medium text-gray-700">
                                            Commune <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="communes"
                                            value={data.communes}
                                            onChange={(e) => setData('communes', e.target.value)}
                                            className="mt-1 p-2 w-full border rounded-md transition-colors focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">-- Sélectionnez une commune --</option>
                                            {communesList.map((commune) => (
                                                <option key={commune} value={commune}>
                                                    {commune}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.communes && <span className="text-red-500 text-sm">{errors.communes}</span>}
                                    </div>

                                    {/* Village */}
                                    <div>
                                        <label htmlFor="village" className="block text-sm font-medium text-gray-700">
                                            Village <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="village"
                                            value={data.village}
                                            onChange={(e) => setData('village', e.target.value)}
                                            className="mt-1 p-2 w-full border rounded-md transition-colors focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        {errors.village && <span className="text-red-500 text-sm">{errors.village}</span>}
                                    </div>

                                    {/* Type de bénéficiaire */}
                                    <div>
                                        <label htmlFor="type_beneficiaire" className="block text-sm font-medium text-gray-700">
                                            Type de Promoteur <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="type_beneficiaire"
                                            value={data.type_beneficiaire}
                                            onChange={(e) => setData('type_beneficiaire', e.target.value)}
                                            className="mt-1 p-2 w-full border rounded-md transition-colors focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">-- Sélectionnez un type --</option>
                                            <option value="Individuel">Individuel</option>
                                            <option value="Coopérative">Coopérative</option>
                                            <option value="Autre">Autre</option>
                                        </select>
                                        {errors.type_beneficiaire && <span className="text-red-500 text-sm">{errors.type_beneficiaire}</span>}
                                    </div>

                                    {/* Niveau d'instruction */}
                                    <div>
                                        <label htmlFor="niveau_instruction" className="block text-sm font-medium text-gray-700">
                                            Niveau d'instruction <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="niveau_instruction"
                                            value={data.niveau_instruction}
                                            onChange={(e) => setData('niveau_instruction', e.target.value)}
                                            className="mt-1 p-2 w-full border rounded-md transition-colors focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">-- Sélectionnez un niveau --</option>
                                            <option value="Analphabète">Analphabète</option>
                                            <option value="Alphabétise">Alphabétise</option>
                                            <option value="Primaire">Primaire</option>
                                            <option value="CEP">CEP</option>
                                            <option value="BEPC">BEPC</option>
                                            <option value="Baccalauréat">Baccalauréat</option>
                                            <option value="Universitaire">Universitaire</option>
                                        </select>
                                        {errors.niveau_instruction && <span className="text-red-500 text-sm">{errors.niveau_instruction}</span>}
                                    </div>

                                    {/* Nom */}
                                    <div>
                                        <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                                            Nom <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="nom"
                                            value={data.nom}
                                            onChange={(e) => setData('nom', e.target.value)}
                                            className="mt-1 p-2 w-full border rounded-md transition-colors focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        {errors.nom && <span className="text-red-500 text-sm">{errors.nom}</span>}
                                    </div>

                                    {/* Prénom */}
                                    <div>
                                        <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">
                                            Prénom <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="prenom"
                                            value={data.prenom}
                                            onChange={(e) => setData('prenom', e.target.value)}
                                            className="mt-1 p-2 w-full border rounded-md transition-colors focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        {errors.prenom && <span className="text-red-500 text-sm">{errors.prenom}</span>}
                                    </div>

                                    {/* Date de naissance */}
                                    <div>
                                        <label htmlFor="date_de_naissance" className="block text-sm font-medium text-gray-700">
                                            Date de naissance <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            id="date_de_naissance"
                                            value={formatDateForInput(data.date_de_naissance)}
                                            onChange={(e) => setData('date_de_naissance', e.target.value)}
                                            className="mt-1 p-2 w-full border rounded-md transition-colors focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        {errors.date_de_naissance && <span className="text-red-500 text-sm">{errors.date_de_naissance}</span>}
                                    </div>

                                    {/* Genre */}
                                    <div>
                                        <label htmlFor="genre" className="block text-sm font-medium text-gray-700">
                                            Genre <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="genre"
                                            value={data.genre}
                                            onChange={(e) => setData('genre', e.target.value)}
                                            className="mt-1 p-2 w-full border rounded-md transition-colors focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">-- Sélectionnez un genre --</option>
                                            <option value="Homme">Homme</option>
                                            <option value="Femme">Femme</option>
                                        </select>
                                        {errors.genre && <span className="text-red-500 text-sm">{errors.genre}</span>}
                                    </div>

                                    {/* Contact */}
                                    <div>
                                        <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
                                            Contact <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="contact"
                                            value={data.contact}
                                            onChange={(e) => setData('contact', e.target.value)}
                                            className="mt-1 p-2 w-full border rounded-md transition-colors focus:ring-blue-500 focus:border-blue-500"
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
                                            value={data.email || ''}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="mt-1 p-2 w-full border rounded-md transition-colors focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
                                    </div>

                                  {/*   Handicap
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Handicap <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="handicap"
                                                checked={!!data.handicap}
                                                onChange={(e) => setData('handicap', e.target.checked)}
                                                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                            />
                                            <label htmlFor="handicap" className="ml-2 text-sm text-gray-700">
                                                Situation de handicap
                                            </label>
                                        </div>
                                        {errors.handicap && <span className="text-red-500 text-sm">{errors.handicap}</span>}
                                    </div> */}
                                </form>
                            </div>

                            {/* Pied de page fixe avec boutons */}
                            <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    form="beneficiaire-form"
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                                    disabled={processing}
                                >
                                    {processing ? 'Traitement...' : beneficiaire?.id ? 'Modifier' : 'Ajouter'}
                                </button>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};

export default BeneficiaireFormModal;
