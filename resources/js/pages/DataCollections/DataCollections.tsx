import React, { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { PlusIcon, PencilIcon, ArrowLeftIcon, Trash2Icon } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import ModalCollecte from '@/components/CollecteFormModal';

interface Frequence {
    id: number;
    nom: string;
    code: string;
}

interface IndicatorField {
    id: number;
    name: string;
    label: string;
    type: string;
    required: boolean;
    default_value?: any;
    options?: Record<string, string>;
}

interface Indicateur {
    id: number;
    nom: string;
    type: any;
    fields: IndicatorField[];
}

interface Entreprise {
    id: number;
    nom_entreprise: string;
}

interface Collecte {
    id: number;
    entreprise_id: number;
    frequence_id: number | null;
    indicateur_id: number;
    date_collecte: string;
    data?: Record<string, any>;
    status?: string;
    frequence?: Frequence;
    indicateur?: Indicateur;
    entreprise?: Entreprise;
    created_at?: string;
    updated_at?: string;
}

const DataCollectionsIndex = () => {
    const { collectes = [], frequences = [], indicateurs = [], entreprises = [] } = usePage().props as unknown as {
        collectes: Collecte[];
        frequences: Frequence[];
        indicateurs: Indicateur[];
        entreprises: Entreprise[];
    };

    const [collectesList, setCollectesList] = useState<Collecte[]>(collectes);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCollecte, setCurrentCollecte] = useState<Collecte | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDetailView, setShowDetailView] = useState(false);
    const [selectedCollecte, setSelectedCollecte] = useState<Collecte | null>(null);
    const [isConfirmDelete, setIsConfirmDelete] = useState(false);

    const fetchCollectes = () => {
        router.get(route("DataCollections.index"), {}, {
            preserveState: true,
            only: ["collectes"],
            onSuccess: (page) => {
                setCollectesList(page.props.collectes as Collecte[]);
            },
        });
    };

    const openModal = (collecte: Collecte | null = null) => {
        setCurrentCollecte(collecte);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentCollecte(null);
    };

    const handleRowClick = (collecte: Collecte) => {
        setSelectedCollecte(collecte);
        setShowDetailView(true);
    };

    const handleDelete = (collecte: Collecte) => {
        if (!isConfirmDelete) {
            setIsConfirmDelete(true);
            toast.warning("Cliquez à nouveau pour confirmer la suppression", {
                duration: 5000,
                action: {
                    label: "Annuler",
                    onClick: () => setIsConfirmDelete(false)
                }
            });
            return;
        }

        router.delete(route('DataCollections.destroy', collecte.id), {
            onSuccess: () => {
                toast.success("Collecte supprimée avec succès");
                fetchCollectes();
                if (showDetailView) {
                    setShowDetailView(false);
                }
                setIsConfirmDelete(false);
            },
            onError: () => {
                toast.error("Erreur lors de la suppression");
                setIsConfirmDelete(false);
            }
        });
    };

    const filteredCollectes = collectesList.data.filter((collecte) =>
        (collecte.indicateur?.nom?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (collecte.frequence?.nom?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (collecte.entreprise?.nom_entreprise?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (collecte.status?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    // Fonction pour formatter la date
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    // Fonction pour obtenir le statut avec une couleur
    const getStatusBadge = (status?: string) => {
        if (!status) return <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">N/A</span>;

        switch (status.toLowerCase()) {
            case 'completed':
            case 'terminé':
                return <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Terminé</span>;
            case 'pending':
            case 'en attente':
                return <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">En attente</span>;
            case 'processing':
            case 'en cours':
                return <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">En cours</span>;
            default:
                return <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">{status}</span>;
        }
    };

    if (showDetailView && selectedCollecte) {
        return (
            <>
                <Head title={`Détails de la collecte`} />
                <Toaster position="top-right" richColors />

                <div className="py-12">
                    <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <button
                                onClick={() => setShowDetailView(false)}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center transition"
                            >
                                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                                Retour à la liste
                            </button>

                            <h1 className="text-2xl font-semibold mt-4">Détails de la collecte</h1>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div>
                                    <p className="mb-2"><strong>Entreprise:</strong> {selectedCollecte.entreprise?.nom_entreprise || 'N/A'}</p>
                                    <p className="mb-2"><strong>Indicateur:</strong> {selectedCollecte.indicateur?.nom || 'N/A'}</p>
                                    <p className="mb-2"><strong>Fréquence:</strong> {selectedCollecte.frequence?.nom || 'N/A'}</p>
                                    <p className="mb-2"><strong>Date de collecte:</strong> {formatDate(selectedCollecte.date_collecte)}</p>
                                    <p className="mb-2"><strong>Statut:</strong> {getStatusBadge(selectedCollecte.status)}</p>
                                </div>
                                <div>
                                    <p className="mb-2"><strong>Créée le:</strong> {formatDate(selectedCollecte.created_at)}</p>
                                    <p className="mb-2"><strong>Modifiée le:</strong> {formatDate(selectedCollecte.updated_at)}</p>
                                </div>
                            </div>

                            {selectedCollecte.data && Object.keys(selectedCollecte.data).length > 0 && (
                                <div className="mt-6">
                                    <h2 className="text-lg font-medium">Données dynamiques collectées</h2>
                                    <div className="bg-gray-50 p-4 rounded-md mt-2 border">
                                        {Object.entries(selectedCollecte.data).map(([key, value]) => {
                                            const field = selectedCollecte.indicateur?.fields.find(f => f.id === parseInt(key));
                                            return (
                                                <div key={key} className="mb-2">
                                                    <strong>{field?.label || `Champ ${key}`}:</strong> {String(value)}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <div className="flex space-x-2 mt-6">
                                <button
                                    onClick={() => openModal(selectedCollecte)}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center transition"
                                >
                                    <PencilIcon className="w-4 h-4 mr-2" />
                                    Modifier
                                </button>
                                <button
                                    onClick={() => handleDelete(selectedCollecte)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center transition"
                                >
                                    <Trash2Icon className="w-4 h-4 mr-2" />
                                    {isConfirmDelete ? "Confirmer" : "Supprimer"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="Gestion des Collectes" />
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
                                Nouvelle Collecte
                            </button>
                        </div>

                        <div className="mb-6">
                            <h1 className="text-2xl font-semibold text-gray-800">Liste des Collectes</h1>
                            <input
                                type="text"
                                placeholder="Rechercher par entreprise, indicateur, fréquence ou statut..."
                                className="w-full p-2 border rounded-md mt-4"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entreprise</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Indicateur</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fréquence</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date collecte</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredCollectes.length > 0 ? (
                                        filteredCollectes.map((collecte) => (
                                            <tr
                                                key={collecte.id}
                                                onClick={() => handleRowClick(collecte)}
                                                className="cursor-pointer hover:bg-gray-50 transition"
                                            >
                                                <td className="px-6 py-4">{collecte.entreprise?.nom_entreprise || 'N/A'}</td>
                                                <td className="px-6 py-4">{collecte.indicateur?.nom || 'N/A'}</td>
                                                <td className="px-6 py-4">{collecte.frequence?.nom || 'N/A'}</td>
                                                <td className="px-6 py-4">{formatDate(collecte.date_collecte)}</td>
                                                <td className="px-6 py-4">{getStatusBadge(collecte.status)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openModal(collecte);
                                                            }}
                                                            className="text-indigo-600 hover:text-indigo-900 transition"
                                                            title="Modifier"
                                                        >
                                                            <PencilIcon className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDelete(collecte);
                                                            }}
                                                            className="text-red-600 hover:text-red-900 transition"
                                                            title="Supprimer"
                                                        >
                                                            <Trash2Icon className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                                                Aucune collecte trouvée
                                                {searchTerm && (
                                                    <>
                                                        {" "}pour la recherche "<strong>{searchTerm}</strong>"
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <ModalCollecte
                isOpen={isModalOpen}
                closeModal={closeModal}
                collecte={currentCollecte}
                frequences={frequences}
                indicateurs={indicateurs}
                entreprises={entreprises}
                onSuccess={fetchCollectes}
            />
        </>
    );
};

export default DataCollectionsIndex;
