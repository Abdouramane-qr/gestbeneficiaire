// Beneficiaires.tsx
import React, { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import BeneficiaireFormModal from '@/components/beneFormModal';
import { PlusIcon, PencilIcon, TrashIcon, ArrowLeftIcon } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import Show from './Show';

interface Entreprise {
    id: number;
    nom_entreprise: string;
    secteur_activite: string;
}

interface ONG {
    id: number;
    nom: string;
}

interface InstitutionFinanciere {
    id: number;
    nom: string;
}

interface Beneficiaire {
    id: number;
    regions: string;
    provinces: string;
    communes: string;
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
    ong?: ONG | null;
    institutionFinanciere?: InstitutionFinanciere | null;
    entreprises?: Entreprise[];
}

const Beneficiaires = () => {
    const { beneficiaires, ongs, institutions } = usePage().props as unknown as {
        beneficiaires: Beneficiaire[];
        ongs: { id: number; nom: string }[];
        institutions: { id: number; nom: string }[];
        regions: { id: number; nom: string }[];
        provinces: { id: number; nom: string; region_id: number }[];
        communes: { id: number; nom: string; province_id: number }[];
        entreprises: { id: number; nom_entreprise: string; secteur_activite: string }[];
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentBeneficiaire, setCurrentBeneficiaire] = useState<Beneficiaire | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
    const [showDetailView, setShowDetailView] = useState(false);
    const [selectedBeneficiaire, setSelectedBeneficiaire] = useState<Beneficiaire | null>(null);

    const openModal = (beneficiaire: Beneficiaire | null = null) => {
        setCurrentBeneficiaire(beneficiaire);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentBeneficiaire(null);
    };

    // Define the onSuccess function
    const onSuccess = () => {
        // Fetch the updated list of beneficiaries
        router.get(route('beneficiaires.index'), {
            onSuccess: () => {
                return toast.success("Liste des bénéficiaires mise à jour.");
            },
            onError: () => {
                return toast.error("Échec de la mise à jour de la liste des bénéficiaires.");
            },
        });
    };

    const handleDelete = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();

        if (confirmDelete === id) {
            router.delete(route('beneficiaires.destroy', id), {
                onSuccess: () => {
                    toast.success("Bénéficiaire supprimé avec succès");
                    setConfirmDelete(null);
                    if (selectedBeneficiaire && selectedBeneficiaire.id === id) {
                        setShowDetailView(false);
                        setSelectedBeneficiaire(null);
                    }
                    onSuccess(); // Call onSuccess to refresh the list of beneficiaries
                },
                onError: () => {
                    toast.error("Échec de la suppression du bénéficiaire");
                },
            });
        } else {
            setConfirmDelete(id);
            toast.info("Cliquez à nouveau pour confirmer la suppression");

            setTimeout(() => {
                if (confirmDelete === id) {
                    setConfirmDelete(null);
                }
            }, 3000);
        }
    };

    const handleRowClick = (beneficiaire: Beneficiaire) => {
        setSelectedBeneficiaire(beneficiaire);
        setShowDetailView(true);
    };

    const filteredBeneficiaires = beneficiaires.filter(
        (beneficiaire) =>
            beneficiaire.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            beneficiaire.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            beneficiaire.contact.includes(searchTerm) ||
            (beneficiaire.email && beneficiaire.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
            beneficiaire.regions.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (beneficiaire.village && beneficiaire.village.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (showDetailView && selectedBeneficiaire) {
        return (
            <>
                <Head title={`Détails de ${selectedBeneficiaire.nom} ${selectedBeneficiaire.prenom}`} />
                <Toaster position='top-right' richColors></Toaster>
                <div className="py-12">
                    <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 bg-white border-b border-gray-200">
                                <div className="mb-6">
                                    <button
                                        onClick={() => setShowDetailView(false)}
                                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition flex items-center"
                                    >
                                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                                        Retour à la liste
                                    </button>
                                </div>

                                <div className="flex justify-between items-center mb-6">
                                    <h1 className="text-2xl font-semibold text-gray-800">
                                        Détails du bénéficiaire
                                    </h1>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => openModal(selectedBeneficiaire)}
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition flex items-center"
                                        >
                                            <PencilIcon className="w-4 h-4 mr-2" />
                                            Modifier
                                        </button>
                                        <button
                                            onClick={(e) => handleDelete(selectedBeneficiaire.id, e)}
                                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition flex items-center"
                                        >
                                            <TrashIcon className="w-4 h-4 mr-2" />
                                            Supprimer
                                        </button>
                                    </div>
                                </div>

                                <Show beneficiaire={selectedBeneficiaire} />
                            </div>
                        </div>
                    </div>
                </div>

                <BeneficiaireFormModal
                    isOpen={isModalOpen}
                    closeModal={closeModal}
                    beneficiaire={currentBeneficiaire || undefined}
                    onSuccess={onSuccess}
                    ongs={ongs}
                    institutions={institutions}
                />
            </>
        );
    }

    return (
        <>
            <Head title="Gestion des Bénéficiaires" />
            <Toaster position='top-right' richColors></Toaster>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <button
                                    onClick={() => router.visit('/dashboard')}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                                >
                                    ⬅ Retour au Dashboard
                                </button>

                                <button
                                    onClick={() => openModal(null)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700 transition"
                                >
                                    <PlusIcon className="w-5 h-5 mr-2" />
                                    Ajouter un Promoteur
                                </button>
                            </div>

                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-semibold text-gray-800">Liste des Promoteurs</h1>
                            </div>

                            <div className="mb-4">
                                <input
                                    type="text"
                                    placeholder="Rechercher un bénéficiaire (nom, prénom, contact, région...)..."
                                    className="w-full p-2 border rounded-md"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full w-full divide-y divide-gray-400">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Nom & Prénom
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Région/Village
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Contact
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Type/Activité
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Niveau d'instruction
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Statut
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredBeneficiaires.length > 0 ? (
                                            filteredBeneficiaires.map((beneficiaire) => (
                                                <tr
                                                    key={beneficiaire.id}
                                                    onClick={() => handleRowClick(beneficiaire)}
                                                    className="cursor-pointer hover:bg-gray-50 transition"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {beneficiaire.nom} {beneficiaire.prenom}
                                                        </div>
                                                        <div className="text-sm text-gray-500">{beneficiaire.email}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">{beneficiaire.regions}</div>
                                                        <div className="text-sm text-gray-500">{beneficiaire.village}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">{beneficiaire.contact}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">{beneficiaire.type_beneficiaire}</div>
                                                        <div className="text-sm text-gray-500">{beneficiaire.activite}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {beneficiaire.niveau_instruction}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${beneficiaire.statut_actuel === 'Actif'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : beneficiaire.statut_actuel === 'En attente'
                                                                        ? 'bg-yellow-100 text-yellow-800'
                                                                        : 'bg-red-100 text-red-800'
                                                                }`}
                                                        >
                                                            {beneficiaire.statut_actuel}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    openModal(beneficiaire);
                                                                }}
                                                                className="text-indigo-600 hover:text-indigo-900"
                                                            >
                                                                <PencilIcon className="w-5 h-5" />
                                                            </button>
                                                            <button
                                                                onClick={(e) => handleDelete(beneficiaire.id, e)}
                                                                className="text-gray-500 hover:text-red-600"
                                                            >
                                                                <TrashIcon className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                                                    Aucun bénéficiaire trouvé
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <BeneficiaireFormModal
                isOpen={isModalOpen}
                closeModal={closeModal}
                beneficiaire={currentBeneficiaire || undefined}
                onSuccess={onSuccess}
                ongs={ongs}
                institutions={institutions}
            />
        </>
    );
};

export default Beneficiaires;
