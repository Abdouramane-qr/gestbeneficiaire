import React, { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import EntrepriseFormModal from '@/components/entrepriseFormModal';
import { PlusIcon, PencilIcon, TrashIcon, ArrowLeftIcon } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import Show from './show';
import AppLayout from '@/layouts/app-layout';

interface Entreprise {
    id: number;
    nom_entreprise: string;
    secteur_activite: string;
    adresse: string;
    contact: string;
    email: string;
    date_creation: string;
    statut_juridique: string;
    description: string;
    ville: string;
    pays: string;
}

interface Beneficiaire {
    id: number;
    nom: string;
    prenom: string;
}

const Entreprises = () => {
    const { entreprises, beneficiaires } = usePage().props as unknown as {
        entreprises: Entreprise[];
        beneficiaires: Beneficiaire[];
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEntreprise, setCurrentEntreprise] = useState<Entreprise | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
    const [showDetailView, setShowDetailView] = useState(false);
    const [selectedEntreprise, setSelectedEntreprise] = useState<Entreprise | null>(null);

    const openModal = (entreprise: Entreprise | null = null) => {
        setCurrentEntreprise(entreprise);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentEntreprise(null);
    };

    const handleDelete = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();

        if (confirmDelete === id) {
            router.delete(route('entreprises.destroy', id), {
                onSuccess: () => {
                    toast.success("Entreprise supprimée avec succès");
                    setConfirmDelete(null);
                    if (selectedEntreprise && selectedEntreprise.id === id) {
                        setShowDetailView(false);
                        setSelectedEntreprise(null);
                    }
                },
                onError: () => {
                    toast.error("Échec de la suppression de l'entreprise");
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

    const handleRowClick = (entreprise: Entreprise) => {
        setSelectedEntreprise(entreprise);
        setShowDetailView(true);
    };

    const filteredEntreprises = entreprises.filter(
        (entreprise) =>
            entreprise.nom_entreprise.toLowerCase().includes(searchTerm.toLowerCase()) ||
            entreprise.secteur_activite.toLowerCase().includes(searchTerm.toLowerCase()) ||
            entreprise.date_creation.includes(searchTerm) ||
            (entreprise.email && entreprise.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (showDetailView && selectedEntreprise) {
        return (
            <AppLayout title='Liste des Entreprises'>
                <Head title={`Détails de ${selectedEntreprise.nom_entreprise}`} />
                <Toaster position='top-right' richColors />
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
                                        Détails de l'entreprise
                                    </h1>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => openModal(selectedEntreprise)}
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition flex items-center"
                                        >
                                            <PencilIcon className="w-4 h-4 mr-2" />
                                            Modifier
                                        </button>
                                        <button
                                            onClick={(e) => handleDelete(selectedEntreprise.id, e)}
                                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition flex items-center"
                                        >
                                            <TrashIcon className="w-4 h-4 mr-2" />
                                            Supprimer
                                        </button>
                                    </div>
                                </div>

                                <Show entreprise={selectedEntreprise} />
                            </div>
                        </div>
                    </div>
                </div>

                <EntrepriseFormModal
                    isOpen={isModalOpen}
                    closeModal={closeModal}
                    entreprise={currentEntreprise || undefined}
                    beneficiaires={beneficiaires}
                />
            </AppLayout>
        );
    }

    return (
        <AppLayout  title="Gestion des Entreprises" >
            <Head title="Gestion des Entreprises" />
            <Toaster position='top-right' richColors />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                              

                                <button
                                    onClick={() => openModal(null)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700 transition"
                                >
                                    <PlusIcon className="w-5 h-5 mr-2" />
                                    Ajouter une entreprise
                                </button>
                            </div>

                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-semibold text-gray-800">Liste des Entreprises</h1>
                            </div>

                            <div className="mb-4">
                                <input
                                    type="text"
                                    placeholder="Rechercher une entreprise (nom, secteur, contact...)..."
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
                                                Nom
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Secteur d'activité
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date de Creation
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Ville
                                            </th>

                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Adresse
                                            </th>

                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Statut juridique
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredEntreprises.length > 0 ? (
                                            filteredEntreprises.map((entreprise) => (
                                                <tr
                                                    key={entreprise.id}
                                                    onClick={() => handleRowClick(entreprise)}
                                                    className="cursor-pointer hover:bg-gray-50 transition"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {entreprise.nom_entreprise}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">{entreprise.secteur_activite}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">{entreprise.date_creation}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">{entreprise.ville}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">{entreprise.adresse}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${entreprise.statut_juridique === 'Actif'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : 'bg-red-100 text-red-800'
                                                                }`}
                                                        >
                                                            {entreprise.statut_juridique}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    openModal(entreprise);
                                                                }}
                                                                className="text-indigo-600 hover:text-indigo-900"
                                                            >
                                                                <PencilIcon className="w-5 h-5" />
                                                            </button>
                                                            <button
                                                                onClick={(e) => handleDelete(entreprise.id, e)}
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
                                                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                                    Aucune entreprise trouvée
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

            <EntrepriseFormModal
                isOpen={isModalOpen}
                closeModal={closeModal}
                entreprise={currentEntreprise || undefined}
                beneficiaires={beneficiaires}
            />
        </AppLayout>
    );
};

export default Entreprises;
