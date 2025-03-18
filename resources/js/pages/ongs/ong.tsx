import React, { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { PlusIcon, PencilIcon, TrashIcon, ArrowLeftIcon } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import OngFormModal from '@/components/ongFormModal';

interface ONG {
    id: number;
    nom: string;
    description: string;
    adresse: string;
}

const Ongs = () => {
    const { ongs } = usePage().props as unknown as { ongs: ONG[] };

    const [ongsList, setOngsList] = useState(ongs);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentOng, setCurrentOng] = useState<ONG | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDetailView, setShowDetailView] = useState(false);
    const [selectedOng, setSelectedOng] = useState<ONG | null>(null);
   // const [ setOngs]=useState<ONG | null>(null);


   const fetchOngs = () => {
    router.get(route("ong.index"), {}, {
        preserveState: true,
        only: ["ongs"], // Recharge uniquement les ONGs
        onSuccess: (page) => {
            setOngsList(page.props.ongs as ONG[]); // ✅ Correction ici
        },
    });
};


    const openModal = (ong: ONG | null = null) => {
        setCurrentOng(ong);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentOng(null);
    };

    const handleDelete = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();

        if (confirmDelete === id) {
            router.delete(route('ong.destroy', id), {
                onSuccess: () => {
                    toast.success("ONG supprimée avec succès");
                    setOngsList(ongsList.filter((ong) => ong.id !== id));
                    setConfirmDelete(null);
                    if (selectedOng && selectedOng.id === id) {
                        setShowDetailView(false);
                        setSelectedOng(null);
                    }
                },
                onError: () => toast.error("Échec de la suppression de l'ONG"),
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

    const handleRowClick = (ong: ONG) => {
        setSelectedOng(ong);
        setShowDetailView(true);
    };

    const filteredOngs = ongsList.filter((ong) =>
        ong.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ong.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ong.adresse.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Vue détaillée d’une ONG
    if (showDetailView && selectedOng) {
        return (
            <>
                <Head title={`Détails de ${selectedOng.nom}`} />
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

                            <h1 className="text-2xl font-semibold mt-4">Détails de l’ONG</h1>
                            <p><strong>Nom :</strong> {selectedOng.nom}</p>
                            <p><strong>Description :</strong> {selectedOng.description}</p>
                            <p><strong>Adresse :</strong> {selectedOng.adresse}</p>

                            <div className="flex space-x-2 mt-4">
                                <button
                                    onClick={() => openModal(selectedOng)}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
                                >
                                    <PencilIcon className="w-4 h-4 mr-2" />
                                    Modifier
                                </button>
                                <button
                                    onClick={(e) => handleDelete(selectedOng.id, e)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                                >
                                    <TrashIcon className="w-4 h-4 mr-2" />
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <OngFormModal isOpen={isModalOpen} closeModal={closeModal} ong={currentOng }onSuccess={fetchOngs} />
            </>
        );
    }



    // Vue liste des ONG
    return (
        <>
            <Head title="Gestion des ONG" />
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
                                Ajouter une ONG
                            </button>
                        </div>
                        <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-semibold text-gray-800">Liste des ONG</h1>
                            </div>
                        <input
                            type="text"
                            placeholder="Rechercher une ONG..."
                            className="w-full p-2 border rounded-md mb-4"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Adresse</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredOngs.length > 0 ? (
                                    filteredOngs.map((ong) => (
                                        <tr key={ong.id} onClick={() => handleRowClick(ong)} className="cursor-pointer hover:bg-gray-50">
                                            <td className="px-6 py-4">{ong.nom}</td>
                                            <td className="px-6 py-4">{ong.description}</td>
                                            <td className="px-6 py-4">{ong.adresse}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex space-x-2">
                                                    <button onClick={() => openModal(ong)} className="text-indigo-600 hover:text-indigo-900">
                                                        <PencilIcon className="w-5 h-5" />
                                                    </button>
                                                    <button onClick={(e) => handleDelete(ong.id, e)} className="text-gray-500 hover:text-red-600">
                                                        <TrashIcon className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">Aucune ONG trouvée</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <OngFormModal isOpen={isModalOpen} closeModal={closeModal} ong={currentOng} onSuccess={fetchOngs}/>
        </>
    );
};

export default Ongs;



