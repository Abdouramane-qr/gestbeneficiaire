import React, { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { PlusIcon, PencilIcon, TrashIcon, ArrowLeftIcon } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import IndicateurFormModal from '@/components/IndicateurFormModal';

interface Indicateur {
    id?: number;
    nom: string;
    code: string;
    categorie: string;
    description: string;
    entreprise_id: number;
}

interface PageProps {
    indicateurs: {
        data: Indicateur[];
        [key: string]: any;
    };
    [key: string]: any;
}

const Indicateurs = () => {
    const { props } = usePage<PageProps>();
    const { indicateurs } = props;

    const [indicateursList, setIndicateursList] = useState<Indicateur[]>(indicateurs?.data || []);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentIndicateur, setCurrentIndicateur] = useState<Indicateur | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDetailView, setShowDetailView] = useState(false);
    const [selectedIndicateur, setSelectedIndicateur] = useState<Indicateur | null>(null);

    const fetchIndicateurs = () => {
        router.get(route("Indicateur.index"), {}, {
            preserveState: true,
            only: ["indicateurs"],
            onSuccess: (page) => {
                setIndicateursList(page.props.indicateurs?.data || []);
            },
        });
    };

    const openModal = (indicateur: Indicateur | null = null) => {
        setCurrentIndicateur(indicateur);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentIndicateur(null);
    };

    const handleDelete = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();

        if (confirmDelete === id) {
            router.delete(route('Indicateurs.destroy', id), {
                onSuccess: () => {
                    toast.success("Indicateur supprimé avec succès");
                    setIndicateursList(indicateursList.filter((indicateur) => indicateur.id !== id));
                    setConfirmDelete(null);
                    if (selectedIndicateur && selectedIndicateur.id === id) {
                        setShowDetailView(false);
                        setSelectedIndicateur(null);
                    }
                },
                onError: () => toast.error("Échec de la suppression de l'indicateur"),
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

    const handleRowClick = (indicateur: Indicateur) => {
        setSelectedIndicateur(indicateur);
        setShowDetailView(true);
    };

    const filteredIndicateurs = indicateursList.filter((indicateur) =>
        indicateur.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        indicateur.categorie.toLowerCase().includes(searchTerm.toLowerCase()) ||
        indicateur.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (showDetailView && selectedIndicateur) {
        return (
            <>
                <Head title={`Détails de ${selectedIndicateur.nom}`} />
                <Toaster position="top-right" richColors />

                <div className="py-12">
                    <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <button
                                onClick={() => setShowDetailView(false)}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center"
                            >
                                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                                Retour à la liste
                            </button>

                            <h1 className="text-2xl font-semibold mt-4">Détails de l'indicateur</h1>
                            <p><strong>Nom :</strong> {selectedIndicateur.nom}</p>
                            <p><strong>Catégorie :</strong> {selectedIndicateur.categorie}</p>
                            <p><strong>Description :</strong> {selectedIndicateur.description}</p>

                            <div className="flex space-x-2 mt-4">
                                <button
                                    onClick={() => openModal(selectedIndicateur)}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
                                >
                                    <PencilIcon className="w-4 h-4 mr-2" />
                                    Modifier
                                </button>
                                <button
                                    onClick={(e) => handleDelete(selectedIndicateur.id ?? 0, e)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                                >
                                    <TrashIcon className="w-4 h-4 mr-2" />
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <IndicateurFormModal isOpen={isModalOpen} closeModal={closeModal} indicateur={currentIndicateur} onSuccess={fetchIndicateurs} entreprises={[]} />
            </>
        );
    }

    return (
        <>
            <Head title="Gestion des Indicateurs" />
            <Toaster position="top-right" richColors />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
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
                                Ajouter un Indicateur
                            </button>
                        </div>
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-semibold text-gray-800">Liste des Indicateurs</h1>
                        </div>
                        <input
                            type="text"
                            placeholder="Rechercher un indicateur..."
                            className="w-full p-2 border rounded-md mb-4"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catégorie</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredIndicateurs.length > 0 ? (
                                    filteredIndicateurs.map((indicateur) => (
                                        <tr key={indicateur.id} onClick={() => handleRowClick(indicateur)} className="cursor-pointer hover:bg-gray-50">
                                            <td className="px-6 py-4">{indicateur.nom}</td>
                                            <td className="px-6 py-4">{indicateur.categorie}</td>
                                            <td className="px-6 py-4">{indicateur.description}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex space-x-2">
                                                    <button onClick={() => openModal(indicateur)} className="text-indigo-600 hover:text-indigo-900">
                                                        <PencilIcon className="w-5 h-5" />
                                                    </button>
                                                    <button onClick={(e) => handleDelete(indicateur.id ?? 0, e)} className="text-red-600 hover:text-red-900">
                                                        <TrashIcon className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="text-center text-gray-500 py-4">Aucun indicateur trouvé</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <IndicateurFormModal isOpen={isModalOpen} closeModal={closeModal} indicateur={currentIndicateur} onSuccess={fetchIndicateurs} entreprises={[]} />
        </>
    );
};

export default Indicateurs;
