import React, { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { PlusIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import EntrepriseFormModal from '@/components/entrepriseFormModal';

interface Entreprise {
    id: number;
    beneficiaire_id?:number;
    nom_entreprise: string;
    secteur_activite: string;
    adresse: string;
    contact: string;
    email: string;
    date_creation: string;
    statut_actuel: string;
    description: string;
}

const Entreprises = () => {
    const { entreprises } = usePage().props as unknown as { entreprises: Entreprise[] };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEntreprise, setCurrentEntreprise] = useState<Entreprise | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

    const openModal = (entreprise: Entreprise | null = null) => {
        setCurrentEntreprise(entreprise);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentEntreprise(null);
    };

    const handleDelete = (id: number) => {
        if (confirmDelete === id) {
            router.delete(route('entreprises.destroy', id), {
                onSuccess: () => {
                    toast.success("Entreprise supprimée avec succès");
                    setConfirmDelete(null);
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

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('fr-FR').format(date);
    };

    const filteredEntreprises = entreprises.filter(
        (entreprise) =>
            entreprise.nom_entreprise.toLowerCase().includes(searchTerm.toLowerCase()) ||
            entreprise.secteur_activite.toLowerCase().includes(searchTerm.toLowerCase()) ||
            entreprise.contact.includes(searchTerm) ||
            entreprise.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <Head title="Gestion des Entreprises" />
            <Toaster position='top-right' richColors ></Toaster>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">

                            <div className="flex justify-between items-center mb-6">
                                {/* Bouton Retour au Dashboard */}
                                <button
                                    onClick={() => router.visit('/dashboard')}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                                >
                                    ⬅ Retour au Dashboard
                                </button>

                                {/* Bouton Ajouter une entreprise */}
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
                                    placeholder="Rechercher une entreprise..."
                                    className="w-full p-2 border rounded-md"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="overflow-x-auto ">
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
                                                Contact
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date de création
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
                                        {filteredEntreprises.length > 0 ? (
                                            filteredEntreprises.map((entreprise) => (
                                                <tr key={entreprise.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {entreprise.nom_entreprise}
                                                        </div>
                                                        <div className="text-sm text-gray-500">{entreprise.email}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">{entreprise.secteur_activite}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {entreprise.contact}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatDate(entreprise.date_creation)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${entreprise.statut_actuel === 'Active'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-red-100 text-red-800'
                                                                }`}
                                                        >
                                                            {entreprise.statut_actuel}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => openModal(entreprise)}
                                                                className="text-indigo-600 hover:text-indigo-900"
                                                            >
                                                                <PencilIcon className="w-5 h-5" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(entreprise.id)}
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

            <EntrepriseFormModal isOpen={isModalOpen} closeModal={closeModal} entreprise={currentEntreprise || undefined} />
        </>
    );
};

export default Entreprises;
