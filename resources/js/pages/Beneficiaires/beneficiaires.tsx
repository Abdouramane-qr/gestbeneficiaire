import React, { useState, useRef } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { PlusIcon, PencilIcon, TrashIcon, ArrowLeftIcon, PrinterIcon, FileSpreadsheetIcon, FileTextIcon } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import * as XLSX from 'xlsx';
import Show from './Show';
import BeneficiaireFormModal from '@/components/beneFormModal';
import AppLayout from '@/layouts/app-layout';

// Types pour les Promoteurs (Bénéficiaires)
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
}

const Promoteurs = () => {
    const { beneficiaires } = usePage().props as unknown as {
        beneficiaires: Beneficiaire[];
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentBeneficiaire, setCurrentBeneficiaire] = useState<Beneficiaire | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
    const [showDetailView, setShowDetailView] = useState(false);
    const [selectedBeneficiaire, setSelectedBeneficiaire] = useState<Beneficiaire | null>(null);

    const tableRef = useRef<HTMLDivElement>(null);
    const detailsRef = useRef<HTMLDivElement>(null);

    const openModal = (beneficiaire: Beneficiaire | null = null) => {
        setCurrentBeneficiaire(beneficiaire);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentBeneficiaire(null);
    };

    const onSuccess = () => {
        router.get(route('beneficiaires.index'), {
            onSuccess: () => toast.success("Liste des promoteurs mise à jour."),
            onError: () => toast.error("Échec de la mise à jour de la liste des promoteurs."),
        });
    };

    const handleDelete = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();

        if (confirmDelete === id) {
            router.delete(route('beneficiaires.destroy', id), {
                onSuccess: () => {
                    toast.success("Promoteur supprimé avec succès");
                    setConfirmDelete(null);
                    if (selectedBeneficiaire && selectedBeneficiaire.id === id) {
                        setShowDetailView(false);
                        setSelectedBeneficiaire(null);
                    }
                    onSuccess();
                },
                onError: () => toast.error("Échec de la suppression du promoteur"),
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

    // Impression
    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            toast.error("Impossible d'ouvrir la fenêtre d'impression");
            return;
        }

        const contentToPrint = showDetailView && selectedBeneficiaire 
            ? detailsRef.current 
            : tableRef.current;

        if (!contentToPrint) {
            toast.error("Contenu à imprimer non trouvé");
            return;
        }

        printWindow.document.write(`
            <html>
                <head>
                    <title>${showDetailView ? 'Détails Promoteur' : 'Liste des Promoteurs'}</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        table { width: 100%; border-collapse: collapse; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; }
                        .header { text-align: center; margin-bottom: 20px; }
                        @media print {
                            .no-print { display: none; }
                            body { margin: 0; }
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>${showDetailView ? 'Détails du Promoteur' : 'Liste des Promoteurs'}</h1>
                        <p>Imprimé le ${new Date().toLocaleDateString('fr-FR')}</p>
                    </div>
                    ${contentToPrint.innerHTML}
                    <div class="no-print" style="margin-top: 20px; text-align: center;">
                        <button onclick="window.print()">Imprimer</button>
                        <button onclick="window.close()">Fermer</button>
                    </div>
                </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.focus();
    };

    // Exportation PDF
    const exportToPDF = () => {
        const params = new URLSearchParams({
            format: 'pdf',
            mode: showDetailView ? 'detail' : 'list'
        });

        if (showDetailView && selectedBeneficiaire) {
            params.append('beneficiaire_ids[]', selectedBeneficiaire.id.toString());
        } else {
            filteredBeneficiaires.forEach(beneficiaire => {
                params.append('beneficiaire_ids[]', beneficiaire.id.toString());
            });
        }

        if (searchTerm) {
            params.append('search', searchTerm);
        }

        window.open(`${route('beneficiaires.export')}?${params.toString()}`, '_blank');
    };

    // Exportation Excel
    const exportToExcel = () => {
        try {
            const data = showDetailView && selectedBeneficiaire 
                ? [selectedBeneficiaire].map(b => ({
                    'Nom': b.nom,
                    'Prénom': b.prenom,
                    'Genre': b.genre,
                    'Date de naissance': b.date_de_naissance,
                    'Handicap': b.handicap ? 'Oui' : 'Non',
                    'Contact': b.contact,
                    'Email': b.email || 'Non spécifié',
                    'Région': b.regions,
                    'Province': b.provinces,
                    'Commune': b.communes,
                    'Village': b.village || 'Non spécifié',
                    'Type de promoteur': b.type_beneficiaire,
                    'Niveau d\'instruction': b.niveau_instruction,
                }))
                : filteredBeneficiaires.map(b => ({
                    'Nom': b.nom,
                    'Prénom': b.prenom,
                    'Genre': b.genre,
                    'Contact': b.contact,
                    'Email': b.email || 'Non spécifié',
                    'Région': b.regions,
                    'Village': b.village || 'Non spécifié',
                    'Type de promoteur': b.type_beneficiaire,
                    'Niveau d\'instruction': b.niveau_instruction,
                }));

            const worksheet = XLSX.utils.json_to_sheet(data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Promoteurs");

            const fileName = showDetailView && selectedBeneficiaire
                ? `promoteur_${selectedBeneficiaire.nom}_${selectedBeneficiaire.prenom}.xlsx`
                : 'liste_promoteurs.xlsx';

            XLSX.writeFile(workbook, fileName);
            toast.success("Document Excel exporté avec succès");
        } catch (error) {
            console.error("Erreur lors de l'exportation Excel:", error);
            toast.error("Erreur lors de l'exportation Excel");
        }
    };

    // Vue détaillée
    if (showDetailView && selectedBeneficiaire) {
        return (
            <AppLayout title='Détails du Promoteur'>
                <Head title={`Détails de ${selectedBeneficiaire.nom} ${selectedBeneficiaire.prenom}`} />
                <Toaster position='top-right' richColors />
                <div className="py-6 sm:py-12">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-4 sm:p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                                <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                                    <button
                                        onClick={() => setShowDetailView(false)}
                                        className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition flex items-center w-full sm:w-auto justify-center sm:justify-start"
                                    >
                                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                                        Retour à la liste
                                    </button>

                                    <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
                                        <button
                                            onClick={handlePrint}
                                            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center"
                                        >
                                            <PrinterIcon className="w-4 h-4 mr-2" />
                                            Imprimer
                                        </button>
                                        <button
                                            onClick={exportToExcel}
                                            className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition flex items-center"
                                        >
                                            <FileSpreadsheetIcon className="w-4 h-4 mr-2" />
                                            Excel
                                        </button>
                                        <button
                                            onClick={exportToPDF}
                                            className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition flex items-center"
                                        >
                                            <FileTextIcon className="w-4 h-4 mr-2" />
                                            PDF
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
                                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4 sm:mb-0">
                                        Détails du Promoteur
                                    </h1>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => openModal(selectedBeneficiaire)}
                                            className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition flex items-center"
                                        >
                                            <PencilIcon className="w-4 h-4 mr-2" />
                                            Modifier
                                        </button>
                                        <button
                                            onClick={(e) => handleDelete(selectedBeneficiaire.id, e)}
                                            className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition flex items-center"
                                        >
                                            <TrashIcon className="w-4 h-4 mr-2" />
                                            Supprimer
                                        </button>
                                    </div>
                                </div>

                                <div ref={detailsRef}>
                                    <Show beneficiaire={selectedBeneficiaire} />
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
                />
            </AppLayout>
        );
    }

    // Vue liste
    return (
        <AppLayout title="Gestion des Promoteurs">
            <Head title="Gestion des Promoteurs" />
            <Toaster position='top-right' richColors />
            <div className="py-6 sm:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-4 sm:p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                                <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100">
                                    Liste des Promoteurs
                                </h1>

                                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                                    <button
                                        onClick={() => openModal(null)}
                                        className="px-3 py-2 bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700 transition w-full sm:w-auto justify-center sm:justify-start"
                                    >
                                        <PlusIcon className="w-5 h-5 mr-2" />
                                        Ajouter un Promoteur
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                                <div className="w-full sm:w-1/2">
                                    <input
                                        type="text"
                                        placeholder="Rechercher un promoteur..."
                                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-wrap gap-2 justify-end w-full sm:w-auto">
                                    <button
                                        onClick={handlePrint}
                                        className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center"
                                    >
                                        <PrinterIcon className="w-4 h-4 mr-2" />
                                        Imprimer
                                    </button>
                                    <button
                                        onClick={exportToExcel}
                                        className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition flex items-center"
                                    >
                                        <FileSpreadsheetIcon className="w-4 h-4 mr-2" />
                                        Excel
                                    </button>
                                    <button
                                        onClick={exportToPDF}
                                        className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition flex items-center"
                                    >
                                        <FileTextIcon className="w-4 h-4 mr-2" />
                                        PDF
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto" ref={tableRef}>
                                <table className="min-w-full divide-y divide-gray-400 dark:divide-gray-600">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Nom & Prénom
                                            </th>
                                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Région
                                            </th>
                                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Contact
                                            </th>
                                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Type
                                            </th>
                                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Niveau d'instruction
                                            </th>
                                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {filteredBeneficiaires.length > 0 ? (
                                            filteredBeneficiaires.map((beneficiaire) => (
                                                <tr
                                                    key={beneficiaire.id}
                                                    onClick={() => handleRowClick(beneficiaire)}
                                                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                                                >
                                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900 dark:text-gray-100">
                                                            {beneficiaire.nom && beneficiaire.prenom
                                                                ? `${beneficiaire.nom} ${beneficiaire.prenom}`
                                                                : 'N/A'}
                                                        </div>
                                                    </td>

                                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900 dark:text-gray-100">{beneficiaire.regions}</div>
                                                    </td>
                                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                        {beneficiaire.contact}
                                                    </td>

                                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                        {beneficiaire.type_beneficiaire}
                                                    </td>

                                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                        {beneficiaire.niveau_instruction}
                                                    </td>
                                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    openModal(beneficiaire);
                                                                }}
                                                                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                            >
                                                                <PencilIcon className="w-5 h-5" />
                                                            </button>
                                                            <button
                                                                onClick={(e) => handleDelete(beneficiaire.id, e)}
                                                                className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                                                            >
                                                                <TrashIcon className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="px-4 sm:px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                                    Aucun promoteur trouvé
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
            />
        </AppLayout>
    );
};

export default Promoteurs;