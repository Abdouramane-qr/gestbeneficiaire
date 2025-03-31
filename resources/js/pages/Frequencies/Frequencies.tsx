// import React, { useState, useMemo } from 'react';
// import { Head, usePage, router } from '@inertiajs/react';
// import { PlusIcon, PencilIcon, TrashIcon, ArrowLeftIcon } from 'lucide-react';
// import { Toaster, toast } from 'sonner';
// import ModalFrequency from '@/components/ModalFrequency';

// interface Frequency {
//     id: number;
//     name: string;
//     code: string;
//     days_interval: number;
//     is_custom: boolean;
//     date_debut: string;
//     date_fin?: string;
//     schedule_type: string;
// }

// interface PageProps {
//     [key: string]: any;
//     auth?: {
//         user: any;
//     };
//     frequencies: Frequency[];
//     scheduleTypes: Record<string, string>;
// }

// const Frequencies: React.FC = () => {
//     const {
//         frequences : initialFrequencies,
//         //scheduleTypes
//     } = usePage<PageProps>().props;

//     const [frequenciesList, setFrequenciesList] = useState<Frequency[]>(
//         Array.isArray(initialFrequencies) ? initialFrequencies : []
//     );
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [currentFrequency, setCurrentFrequency] = useState<Frequency | null>(null);
//     const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [showDetailView, setShowDetailView] = useState(false);
//     const [selectedFrequency, setSelectedFrequency] = useState<Frequency | null>(null);

//     const fetchFrequencies = () => {
//         router.get(route("Frequencies.index"), {}, {
//             preserveState: true,
//             only: ["frequencies"],
//             onSuccess: (page) => {
//                 setFrequenciesList(page.props.Frequencies || []);
//             },
//         });
//     };

//     // Convert Frequency to the format expected by ModalFrequency
//     const mapFrequencyToModalFormat = (frequency: Frequency | null) => {
//         if (!frequency) return null;
//         return {
//             id: frequency.id,
//             nom: frequency.name,
//             code: frequency.code,
//             days_interval: frequency.days_interval,
//             date_debut: frequency.date_debut,
//             date_fin: frequency.date_fin || '',
//         };
//     };

//     const openModal = (frequency: Frequency | null = null) => {
//         setCurrentFrequency(frequency);
//         setIsModalOpen(true);
//     };

//     const closeModal = () => {
//         setIsModalOpen(false);
//         setCurrentFrequency(null);
//     };

//     const handleDelete = (id: number, e: React.MouseEvent) => {
//         e.stopPropagation();

//         if (confirmDelete === id) {
//             router.delete(route('Frequencies.destroy', id), {
//                 onSuccess: () => {
//                     toast.success("Fréquence supprimée avec succès");
//                     setFrequenciesList(frequenciesList.filter(f => f.id !== id));
//                     setConfirmDelete(null);
//                     if (selectedFrequency?.id === id) {
//                         setShowDetailView(false);
//                         setSelectedFrequency(null);
//                     }
//                 },
//                 onError: () => toast.error("Échec de la suppression de la fréquence"),
//             });
//         } else {
//             setConfirmDelete(id);
//             toast.info("Cliquez à nouveau pour confirmer la suppression");
//             setTimeout(() => setConfirmDelete(null), 3000);
//         }
//     };

//     const handleRowClick = (frequency: Frequency) => {
//         setSelectedFrequency(frequency);
//         setShowDetailView(true);
//     };

//     const filteredFrequencies = useMemo(() => {
//         return frequenciesList.filter(frequency =>
//             frequency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             frequency.code.toLowerCase().includes(searchTerm.toLowerCase())
//         );
//     }, [frequenciesList, searchTerm]);

//     if (showDetailView && selectedFrequency) {
//         return (
//             <div className="min-h-screen bg-gray-100">
//                 <Head title={`Détails de ${selectedFrequency.name}`} />
//                 <Toaster position="top-right" richColors />

//                 <div className="py-12">
//                     <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
//                         <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
//                             <button
//                                 onClick={() => setShowDetailView(false)}
//                                 className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center mb-4"
//                             >
//                                 <ArrowLeftIcon className="w-4 h-4 mr-2" />
//                                 Retour à la liste
//                             </button>

//                             <div className="space-y-4">
//                                 <h1 className="text-2xl font-semibold">{selectedFrequency.name}</h1>
//                                 <div className="grid grid-cols-2 gap-4">
//                                     <div>
//                                         <h3 className="text-sm font-medium text-gray-500">Code</h3>
//                                         <p>{selectedFrequency.code}</p>
//                                     </div>
//                                     <div>
//                                         <h3 className="text-sm font-medium text-gray-500">Intervalle</h3>
//                                         <p>{selectedFrequency.days_interval} jours</p>
//                                     </div>
//                                     <div>
//                                         <h3 className="text-sm font-medium text-gray-500">Personnalisé</h3>
//                                         <p>{selectedFrequency.is_custom ? 'Oui' : 'Non'}</p>
//                                     </div>
//                                     <div>
//                                         <h3 className="text-sm font-medium text-gray-500">Période</h3>
//                                         <p>
//                                             {new Date(selectedFrequency.date_debut).toLocaleDateString()}
//                                             {selectedFrequency.date_fin && ` - ${new Date(selectedFrequency.date_fin).toLocaleDateString()}`}
//                                         </p>
//                                     </div>
//                                 </div>

//                                 <div className="flex space-x-2 mt-6">
//                                     <button
//                                         onClick={() => openModal(selectedFrequency)}
//                                         className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
//                                     >
//                                         <PencilIcon className="w-4 h-4 mr-2" />
//                                         Modifier
//                                     </button>
//                                     <button
//                                         onClick={(e) => handleDelete(selectedFrequency.id, e)}
//                                         className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
//                                     >
//                                         <TrashIcon className="w-4 h-4 mr-2" />
//                                         Supprimer
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 <ModalFrequency
//                     isOpen={isModalOpen}
//                     closeModal={closeModal}
//                     frequence={mapFrequencyToModalFormat(currentFrequency)}
//                     onSuccess={fetchFrequencies}
//                 />
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gray-100">
//             <Head title="Fréquences" />
//             <Toaster position="top-right" richColors />

//             <div className="py-12">
//                 <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
//                     <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
//                         <div className="flex justify-between items-center mb-6">
//                             <button
//                                 onClick={() => router.visit('/dashboard')}
//                                 className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition flex items-center"
//                             >
//                                 <ArrowLeftIcon className="w-4 h-4 mr-2" />
//                                 Retour
//                             </button>

//                             <button
//                                 onClick={() => openModal()}
//                                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center"
//                             >
//                                 <PlusIcon className="w-4 h-4 mr-2" />
//                                 Ajouter
//                             </button>
//                         </div>

//                         <div className="mb-6">
//                             <h1 className="text-2xl font-semibold">Liste des Fréquences</h1>
//                             <div className="relative mt-2">
//                                 <input
//                                     type="text"
//                                     placeholder="Rechercher..."
//                                     className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                     value={searchTerm}
//                                     onChange={(e) => setSearchTerm(e.target.value)}
//                                 />
//                                 <div className="absolute left-3 top-2.5 text-gray-400">
//                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                                     </svg>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="overflow-x-auto">
//                             <table className="min-w-full divide-y divide-gray-200">
//                                 <thead className="bg-gray-50">
//                                     <tr>
//                                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
//                                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
//                                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Intervalle</th>
//                                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody className="bg-white divide-y divide-gray-200">
//                                     {filteredFrequencies.length > 0 ? (
//                                         filteredFrequencies.map((frequency) => (
//                                             <tr
//                                                 key={frequency.id}
//                                                 onClick={() => handleRowClick(frequency)}
//                                                 className="cursor-pointer hover:bg-gray-50"
//                                             >
//                                                 <td className="px-6 py-4 whitespace-nowrap">
//                                                     <div className="font-medium">{frequency.name}</div>
//                                                     <div className="text-sm text-gray-500">
//                                                         {frequency.is_custom ? 'Personnalisé' : 'Standard'}
//                                                     </div>
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                                     {frequency.code}
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap">
//                                                     <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
//                                                         {frequency.days_interval} jours
//                                                     </span>
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                                                     <div className="flex space-x-2 justify-end">
//                                                         <button
//                                                             onClick={(e) => {
//                                                                 e.stopPropagation();
//                                                                 openModal(frequency);
//                                                             }}
//                                                             className="text-indigo-600 hover:text-indigo-900"
//                                                         >
//                                                             <PencilIcon className="h-5 w-5" />
//                                                         </button>
//                                                         <button
//                                                             onClick={(e) => handleDelete(frequency.id, e)}
//                                                             className="text-red-600 hover:text-red-900"
//                                                         >
//                                                             <TrashIcon className="h-5 w-5" />
//                                                         </button>
//                                                     </div>
//                                                 </td>
//                                             </tr>
//                                         ))
//                                     ) : (
//                                         <tr>
//                                             <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
//                                                 Aucune fréquence trouvée
//                                             </td>
//                                         </tr>
//                                     )}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <ModalFrequency
//                 isOpen={isModalOpen}
//                 closeModal={closeModal}
//                 frequence={mapFrequencyToModalFormat(currentFrequency)}
//                 onSuccess={fetchFrequencies}
//                 scheduleTypes={scheduleTypes}

//             />
//         </div>
//     );
// };

// export default Frequencies;
import React, { useState, useMemo, useEffect } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { PlusIcon, PencilIcon, TrashIcon, ArrowLeftIcon } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import ModalFrequency from '@/components/ModalFrequency';

interface Frequency {
    id: number;
    nom: string;
    code: string;
    days_interval: number;
    is_custom: boolean;
    date_debut: string;
    date_fin?: string;
    schedule_type: string;
}

interface PageProps {
    [key: string]: any;
    auth?: {
        user: any;
    };
    frequencies: Frequency[];
    scheduleTypes: Record<string, string>;
}

const Frequencies: React.FC = () => {
    const { frequences: initialFrequencies } = usePage<PageProps>().props;

    // État local pour les fréquences
    const [frequenciesList, setFrequenciesList] = useState<Frequency[]>(
        Array.isArray(initialFrequencies) ? initialFrequencies : []
    );
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentFrequency, setCurrentFrequency] = useState<Frequency | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDetailView, setShowDetailView] = useState(false);
    const [selectedFrequency, setSelectedFrequency] = useState<Frequency | null>(null);

    // Récupérer les fréquences depuis le serveur
    // Remplace ton code actuel par ceci:
const fetchFrequencies = () => {
    router.get(
        route('Frequencies.index'),
        {},
        {
            preserveState: true,
            only: ['frequences'],
            onSuccess: (page) => {
                // Ajoute une vérification de sécurité
                console.log("Props reçues :", page?.props);
                if (!page || !page.props) {
                    console.error("La réponse ne contient pas de props:", page);
                    return;
                }

                if (!Array.isArray(page.props.frequences)) {
                    console.error("Les données des fréquences ne sont pas un tableau:", page.props.frequences);
                    setFrequenciesList([]);
                    return;
                }

                setFrequenciesList(page.props.frequences);
            },
            onError: (errors) => {
                console.error("Erreur lors de la récupération des fréquences:", errors);
                toast.error("Erreur lors de la récupération des données");
            }
        }
    );
};

    // Convertir une fréquence au format attendu par le modal
    const mapFrequencyToModalFormat = (frequency: Frequency | null) => {
        if (!frequency) return null;
        return {
            id: frequency.id,
            nom: frequency.nom,
            code: frequency.code,
            days_interval: frequency.days_interval,
            date_debut: frequency.date_debut,
            date_fin: frequency.date_fin || '',
        };
    };

    // Ouvrir le modal pour ajouter ou modifier une fréquence
    const openModal = (frequency: Frequency | null = null) => {
        setCurrentFrequency(frequency);
        setIsModalOpen(true);
    };

    // Fermer le modal
    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentFrequency(null);
    };

    // Gérer la suppression d'une fréquence
   // Pour handleDelete, par exemple:
const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirmDelete === id) {
        router.delete(route('Frequencies.destroy', id), {
            onSuccess: () => {
                console.log('Succès: ID supprimé =', id);
                toast.success('Fréquence supprimée avec succès');
                // Au lieu d'appeler fetchFrequencies(), mettre à jour l'état local:
                setFrequenciesList((prev) => prev.filter((f) => f.id !== id));
                setConfirmDelete(null);
                if (selectedFrequency?.id === id) {
                    setShowDetailView(false);
                    setSelectedFrequency(null);
                }
            },
            onError: (errors) => {
                console.error("Erreur lors de la suppression:", errors);
                toast.error("Échec de la suppression de la fréquence");
            },
        });
    } else {
        setConfirmDelete(id);
        toast.info('Cliquez à nouveau pour confirmer la suppression');
        setTimeout(() => setConfirmDelete(null), 3000);
    }
};

    // Gérer le clic sur une ligne pour afficher les détails
    const handleRowClick = (frequency: Frequency) => {
        setSelectedFrequency(frequency);
        setShowDetailView(true);
    };

    // Filtrer les fréquences en fonction du terme de recherche
    const filteredFrequencies = useMemo(() => {
        return frequenciesList.filter((frequency) =>
            frequency.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            frequency.code.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [frequenciesList, searchTerm]);

    // Rafraîchir les données au chargement initial
    useEffect(() => {
        fetchFrequencies();
    }, []);

    // Vue détaillée pour une fréquence sélectionnée
    if (showDetailView && selectedFrequency) {
        return (
            <div className="min-h-screen bg-gray-100">
                <Head title={`Détails de ${selectedFrequency.nom}`} />
                <Toaster position="top-right" richColors />
                <div className="py-12">
                    <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <button
                                onClick={() => setShowDetailView(false)}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center mb-4"
                            >
                                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                                Retour à la liste
                            </button>
                            <div className="space-y-4">
                                <h1 className="text-2xl font-semibold">{selectedFrequency.nom}</h1>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Code</h3>
                                        <p>{selectedFrequency.code}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Intervalle</h3>
                                        <p>{selectedFrequency.days_interval} jours</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Personnalisé</h3>
                                        <p>{selectedFrequency.is_custom ? 'Oui' : 'Non'}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Période</h3>
                                        <p>
                                            {new Date(selectedFrequency.date_debut).toLocaleDateString()}
                                            {selectedFrequency.date_fin &&
                                                ` - ${new Date(selectedFrequency.date_fin).toLocaleDateString()}`}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex space-x-2 mt-6">
                                    <button
                                        onClick={() => openModal(selectedFrequency)}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
                                    >
                                        <PencilIcon className="w-4 h-4 mr-2" />
                                        Modifier
                                    </button>
                                    <button
                                        onClick={(e) => handleDelete(selectedFrequency.id, e)}
                                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                                    >
                                        <TrashIcon className="w-4 h-4 mr-2" />
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ModalFrequency
                    isOpen={isModalOpen}
                    closeModal={closeModal}
                    frequence={mapFrequencyToModalFormat(currentFrequency)}
                    onSuccess={fetchFrequencies}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Head title="Fréquences" />
            <Toaster position="top-right" richColors />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <button
                                onClick={() => router.visit('/dashboard')}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition flex items-center"
                            >
                                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                                Retour
                            </button>
                            <button
                                onClick={() => openModal()}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center"
                            >
                                <PlusIcon className="w-4 h-4 mr-2" />
                                Ajouter
                            </button>
                        </div>
                        <div className="mb-6">
                            <h1 className="text-2xl font-semibold">Liste des Fréquences</h1>
                            <div className="relative mt-2">
                                <input
                                    type="text"
                                    placeholder="Rechercher..."
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <div className="absolute left-3 top-2.5 text-gray-400">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Nom
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Code
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Intervalle
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredFrequencies.length > 0 ? (
                                        filteredFrequencies.map((frequency) => (
                                            <tr
                                                key={frequency.id}
                                                onClick={() => handleRowClick(frequency)}
                                                className="cursor-pointer hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="font-medium">{frequency.nom}</div>
                                                    <div className="text-sm text-gray-500">
                                                        {frequency.is_custom ? 'Personnalisé' : 'Standard'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {frequency.code}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                        {frequency.days_interval} jours
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex space-x-2 justify-end">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openModal(frequency);
                                                            }}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            <PencilIcon className="h-5 w-5" />
                                                        </button>
                                                        <button
                                                            onClick={(e) => handleDelete(frequency.id, e)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            <TrashIcon className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                                                Aucune fréquence trouvée
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <ModalFrequency
                isOpen={isModalOpen}
                closeModal={closeModal}
                frequence={mapFrequencyToModalFormat(currentFrequency)}
                onSuccess={fetchFrequencies}
            />
        </div>
    );
};

export default Frequencies;
