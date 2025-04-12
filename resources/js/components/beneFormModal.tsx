
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
    "Boucle du Mouhoun": ["Balé", "Banwa", "Kossi", "Mouhoun", "Nayala", "Sourou"],
    "Cascades": ["Comoé", "Léraba"],
    "Centre": ["Kadiogo"],
    "Centre-Est": ["Boulgou", "Koulpélogo"],
    "Centre-Nord": ["Bam", "Namentenga", "Sanmatenga"],
    "Centre-Ouest": ["Boulkiemdé", "Sanguié", "Ziro", "Zoundwéogo"],
    "Centre-Sud": ["Bazèga", "Nahouri", "Zoundwéogo"],
    "Est": ["Gnagna", "Gourma", "Komondjari", "Kompienga", "Tapoa"],
    "Hauts-Bassins": ["Houet", "Kénédougou", "Tuy"],
    "Nord": ["Loroum", "Passoré", "Yatenga", "Zondoma"],
    "Plateau-Central": ["Ganzourgou", "Kourwéogo", "Oubritenga"],
    "Sahel": ["Oudalan", "Séno", "Soum", "Yagha"],
    "Sud-Ouest": ["Bougouriba", "Ioba", "Noumbiel", "Poni"],
};

type ProvincesCommunes = {
    [key: string]: string[];
};

const provincesCommunes: ProvincesCommunes = {
    "Balé": ["Bagassi", "Boromo", "Fara", "Pâ", "Pompoï", "Siby", "Yaho"],
    "Banwa": ["Balavé", "Kouka", "Sami", "Solenzo", "Tansila"],
    "Bam": ["Bourzanga", "Guibaré", "Kongoussi", "Nasséré", "Rollo", "Sabcé", "Tikaré"],
    "Bazèga": ["Combissiri", "Gaongo", "Ipelcé", "Kayao", "Kombissiri", "Saponé", "Toece"],
    "Bougouriba": ["Bondigui", "Diébougou", "Dolo", "Iolonioro", "Tiankoura"],
    "Boulgou": ["Bittou", "Boussouma", "Garango", "Komtoèga", "Niaogho", "Tenkodogo", "Zabré", "Zoaga"],
    "Boulkiemdé": ["Kokologho", "Koudougou", "Nanoro", "Nandiala", "Pella", "Poa", "Ramongo", "Sabou", "Siglé", "Soaw", "Sourgou", "Thyou"],
    "Comoé": ["Banfora", "Bérégadougou", "Mangodara", "Moussodougou", "Niangoloko", "Ouo", "Sidéradougou", "Soubakaniédougou"],
    "Ganzourgou": ["Zorgho", "Méguet", "Zam", "Zoungou", "Salogo", "Ziniaré"],
    "Gnagna": ["Bilanga", "Bogandé", "Coalla", "Liptougou", "Manni", "Piéla", "Thion"],
    "Gourma": ["Fada N'Gourma", "Diabo", "Matiacoali", "Tibga", "Yamba"],
    "Houet": ["Bobo-Dioulasso", "Dandé", "Faramana", "Karangasso-Vigué", "Koundougou", "Léna", "Padema", "Péni", "Soumbara", "Toussiana"],
    "Ioba": ["Dano", "Dissin", "Koper", "Niego", "Oronkua", "Ouessa"],
    "Kadiogo": ["Ouagadougou", "Komsilga", "Saaba", "Tanghin-Dassouri", "Pabré", "Koubri", "Loumbila"],
    "Kénédougou": ["Orodara", "Djigouéra", "Kourinion", "N'Dorola", "Samiéna", "Sidéradougou"],
    "Komondjari": ["Gayéri", "Bartiébougou", "Foutouri"],
    "Kompienga": ["Pama", "Kompienga", "Madjoari"],
    "Kossi": ["Nouna", "Bomborokuy", "Dokuy", "Doumbala", "Kombori", "Madouba", "Sono"],
    "Koulpélogo": ["Ouargaye", "Comin-Yanga", "Dounkou", "Lalgaye", "Sangha", "Yargatenga"],
    "Kouritenga": ["Koupéla", "Andemtenga", "Baskouré", "Dialgaye", "Gounghin", "Pouytenga", "Soudougui"],
    "Kourwéogo": ["Boussé", "Laye", "Niou", "Sourgoubila", "Toéghin"],
    "Léraba": ["Sindou", "Dakoro", "Kankalaba", "Loumana", "Niankorodougou", "Oueleni", "Sidéradougou", "Soubakaniédougou"],
    "Loroum": ["Titao", "Banh", "Boussouma", "Kalsaka", "Ouindigui"],
    "Mouhoun": ["Dédougou", "Bondokuy", "Douroula", "Kona", "Ouarkoye", "Safané", "Tchériba"],
    "Namentenga": ["Boulsa", "Bissiga", "Dargo", "Nagréongo", "Tougouri", "Zéguédéguin"],
    "Nahouri": ["Pô", "Béguédo", "Gogo", "Guiba", "Tiébélé", "Ziou"],
    "Nayala": ["Toma", "Gassan", "Gossina", "Kougny", "Ségénéga", "Yaba"],
};

interface BeneficiaireFormModalProps {
    isOpen: boolean;
    closeModal: () => void;
    onSuccess: () => void; // Callback pour mettre à jour la liste sans rafraîchir la page
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
    } | null;
    ongs: { id: number; nom: string }[];
    institutions: { id: number; nom: string }[];
}


// Formater la date pour l'élément <input type="date">
const formatDateForInput = (dateString: string) => {
    return dateString ? dateString.split('T')[0] : '';
}

const BeneficiaireFormModal = ({ isOpen, closeModal, onSuccess, beneficiaire, ongs, institutions }: BeneficiaireFormModalProps) => {
    const inputRef = useRef<HTMLInputElement>(null);

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
        handicap: false,
        contact: '',
        email: '',
        niveau_instruction: '',
        activite: '',
        domaine_activite: '',
        niveau_mise_en_oeuvre: '',
        ong_id: null,
        institution_financiere_id: null,
        date_inscription: '',
        statut_actuel: '',
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
                handicap: beneficiaire.handicap,
                contact: beneficiaire.contact || '',
                email: beneficiaire.email || '',
                niveau_instruction: beneficiaire.niveau_instruction || '',
                activite: beneficiaire.activite || '',
                domaine_activite: beneficiaire.domaine_activite || '',
                niveau_mise_en_oeuvre: beneficiaire.niveau_mise_en_oeuvre || '',
                ong_id: beneficiaire.ong_id,
                institution_financiere_id: beneficiaire.institution_financiere_id ,
                date_inscription: beneficiaire.date_inscription || '',
                statut_actuel: beneficiaire.statut_actuel || '',
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
                        <Dialog.Panel className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
                            <Dialog.Title className="text-lg font-medium text-gray-900">
                                {beneficiaire?.id ? 'Modifier un bénéficiaire' : 'Ajouter un bénéficiaire'}
                            </Dialog.Title>

                            <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">

                                {/* Région */}
                                <div>
                                    <label htmlFor="regions" className="block text-sm font-medium text-gray-700">
                                        Région
                                    </label>
                                    <select
                                        id="regions"
                                     //   ref={inputRef}
                                        value={data.regions}
                                        onChange={(e) => handleRegionChange(e.target.value)}
                                        className="mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
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
                                        Province
                                    </label>
                                    <select
                                        id="provinces"
                                        value={data.provinces}
                                        onChange={(e) => handleProvinceChange(e.target.value)}
                                        className="mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
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
                                        Commune
                                    </label>
                                    <select
                                        id="communes"
                                        value={data.communes}
                                        onChange={(e) => setData('communes', e.target.value)}
                                        className="mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
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
                                        Village
                                    </label>
                                    <input
                                        type="text"
                                        id="village"
                                        value={data.village}
                                        onChange={(e) => setData('village', e.target.value)}
                                        className="mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
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
                                        className="mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                                    >
                                        <option value="">-- Sélectionnez un type --</option>
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
                                        className="mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
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
                                        className="mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
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
                                        value={formatDateForInput(data.date_de_naissance)}
                                        onChange={(e) => setData('date_de_naissance', e.target.value)}
                                        className="mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                                    />
                                    {errors.date_de_naissance && <span className="text-red-500 text-sm">{errors.date_de_naissance}</span>}
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
                                        className="mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                                    >
                                        <option value="">-- Sélectionnez un genre --</option>
                                        <option value="Homme">Homme</option>
                                        <option value="Femme">Femme</option>
                                    </select>
                                    {errors.genre && <span className="text-red-500 text-sm">{errors.genre}</span>}
                                </div>

                                {/* Handicap */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Handicap
                                    </label>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="handicap"
                                            checked={data.handicap}
                                            onChange={(e) => setData('handicap', e.target.checked)}
                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600"
                                        />
                                        <label htmlFor="handicap" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
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
                                        className="mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
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
                                        className="mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
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
                                        className="mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                                    >
                                        <option value="">-- Sélectionnez un niveau --</option>
                                        <option value="Analphabète">Analphabète</option>
                                        <option value="Alphabétise">Alphabétise</option>
                                        <option value="Primaire">Primaire</option>
                                        <option value="CEPE">CEPE</option>
                                        <option value="BEPC">BEPC</option>
                                        <option value="Baccalauréat">Baccalauréat</option>
                                        <option value="Universitaire">Universitaire</option>
                                        <option value="Autre">Autre</option>
                                    </select>
                                    {errors.niveau_instruction && <span className="text-red-500 text-sm">{errors.niveau_instruction}</span>}
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
                                        className="mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
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
                                        value={data.domaine_activite}
                                        onChange={(e) => setData('domaine_activite', e.target.value)}
                                        className="mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                                    >
                                        <option value="">-- Sélectionnez un domaine --</option>
                                        <option value="Agriculture">Agriculture</option>
                                        <option value="Artisanat">Artisanat</option>
                                        <option value="Commerce">Commerce</option>
                                        <option value="Élevage">Elevage</option>
                                        <option value="Environnement">Environnement</option>
                                        <option value="Autre">Autre</option>
                                    </select>
                                    {errors.domaine_activite && <span className="text-red-500 text-sm">{errors.domaine_activite}</span>}
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
                                        className="mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                                    >
                                        <option value="">-- Sélectionnez un niveau --</option>
                                        <option value="Création">Création</option>
                                        <option value="Renforcement">Renforcement</option>
                                    </select>
                                    {errors.niveau_mise_en_oeuvre && <span className="text-red-500 text-sm">{errors.niveau_mise_en_oeuvre}</span>}
                                </div>

                                {/* ONG en charge de l'appui conseil */}
                                <div>
                                    <label htmlFor="ong_id" className="block text-sm font-medium text-gray-700">
                                        ONG en charge de l'appui conseil
                                    </label>
                                    <select
                                        id="ong_id"
                                        value={data.ong_id??''}
                                        onChange={(e) => setData('ong_id', e.target.value ? parseInt(e.target.value) : null)}
                                        className="mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                                    >
                                        <option value="">-- Sélectionnez une ONG --</option>
                                        {ongs.map((ong) => (
                                            <option key={ong.id} value={ong.id}>
                                                {ong.nom}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.ong_id && <span className="text-red-500 text-sm">{errors.ong_id}</span>}
                                </div>

                                {/* Institution Financière */}
                                <div>
                                    <label htmlFor="institution_financiere_id" className="block text-sm font-medium text-gray-700">
                                        Institution Financière d'affiliation
                                    </label>
                                    <select
                                        id="institution_financiere_id"
                                        value={data.institution_financiere_id || ''}
                                        onChange={(e) => setData('institution_financiere_id', e.target.value ? parseInt(e.target.value) : null)}
                                        className="mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                                    >
                                        <option value="">-- Sélectionnez une institution --</option>
                                        {institutions.map((institution) => (
                                            <option key={institution.id} value={institution.id}>
                                                {institution.nom}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.institution_financiere_id && <span className="text-red-500 text-sm">{errors.institution_financiere_id}</span>}
                                </div>

                                {/* Date d'inscription */}
                                <div>
                                    <label htmlFor="date_inscription" className="block text-sm font-medium text-gray-700">
                                        Date d'inscription
                                    </label>
                                    <input
                                        type="date"
                                        id="date_inscription"
                                        value={formatDateForInput(data.date_inscription)}
                                        onChange={(e) => setData('date_inscription', e.target.value)}
                                        className="mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                                    />
                                    {errors.date_inscription && <span className="text-red-500 text-sm">{errors.date_inscription}</span>}
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
                                        className="mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                                    >
                                        <option value="">-- Sélectionnez un statut --</option>
                                        <option value="Actif">Actif</option>
                                        <option value="Inactif">Inactif</option>
                                        <option value="En attente">En attente</option>
                                    </select>
                                    {errors.statut_actuel && <span className="text-red-500 text-sm">{errors.statut_actuel}</span>}
                                </div>



                                <div className="col-span-1 md:col-span-2 mt-6 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md mr-2 hover:bg-gray-300"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                        disabled={processing}
                                    >
                                        {beneficiaire?.id ? 'Modifier' : 'Ajouter'}
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
