import React, { useState } from 'react';
import { Head, usePage, router, Link } from '@inertiajs/react';
import { PageProps } from '@inertiajs/core';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { formatDate } from '@/Utils/dateUtils';
import { toast } from 'sonner';
import { PlusIcon, ArrowLeftIcon, EyeIcon, PencilIcon, TrashIcon } from 'lucide-react';

interface Entreprise {
    id: number;
    nom_entreprise: string;
}

interface Exercice {
    id: number;
    annee: number;
}

interface Periode {
    id: number;
    type_periode: string;
}

interface Collecte {
    id: number;
    entreprise: Entreprise;
    exercice: Exercice;
    periode: Periode;
    date_collecte: string;
    type_collecte: string;
    donnees: Record<string, any>;
}

interface CollectesPageProps extends PageProps {
    collectes: {
        data: Collecte[];
        links: any[];
        from: number;
        to: number;
        total: number;
    };
    auth: any;
}

const CollectesIndex = () => {
    const { collectes } = usePage<CollectesPageProps>().props;
    const [searchTerm, setSearchTerm] = useState('');
    const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

    const handleDelete = (id: number, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (confirmDelete === id) {
            router.delete(route('collectes.destroy', id), {
                onSuccess: () => {
                    toast.success('Collecte supprimée avec succès');
                },
                onError: () => {
                    toast.error("Échec de la suppression de la collecte");
                },
            });
            setConfirmDelete(null);
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

    const filteredCollectes = collectes.data.filter((collecte) =>
        collecte.entreprise.nom_entreprise.toLowerCase().includes(searchTerm.toLowerCase()) ||
        collecte.exercice.annee.toString().includes(searchTerm.toLowerCase()) ||
        collecte.periode.type_periode.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AuthenticatedLayout  title="Liste des collectes">
            <Head title="Liste des collectes" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <Link
                                href={route('dashboard')}
                                className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition"
                            >
                                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                                Retour au Dashboard
                            </Link>

                            <Link
                                href={route('collectes.create')}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                            >
                                <PlusIcon className="w-4 h-4 mr-2" />
                                Nouvelle Collecte
                            </Link>
                        </div>

                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-semibold text-gray-800">Liste des Collectes</h1>
                        </div>

                        <input
                            type="text"
                            placeholder="Rechercher une collecte..."
                            className="w-full p-2 border rounded-md mb-4"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

{filteredCollectes.length > 0 ? (
    <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
            <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entreprise</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exercice</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Période</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date Collecte</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
            {filteredCollectes.map((collecte) => (
                <tr
                    key={collecte.id}
                    onClick={() => router.visit(route('collectes.show', collecte.id))}
                    className="cursor-pointer hover:bg-gray-50 transition-colors duration-150"
                >
                    <td className="px-6 py-4">{collecte.entreprise.nom_entreprise}</td>
                    <td className="px-6 py-4">{collecte.exercice.annee}</td>
                    <td className="px-6 py-4">{collecte.periode.type_periode}</td>
                    <td className="px-6 py-4">{formatDate(collecte.date_collecte)}</td>
                    <td className="px-6 py-4">
                        <div className="flex space-x-2" onClick={e => e.stopPropagation()}>
                            <Link
                                href={route('collectes.edit', collecte.id)}
                                className="text-indigo-600 hover:text-indigo-900"
                                title="Modifier"
                            >
                                <PencilIcon className="w-5 h-5" />
                            </Link>
                            <button
                                onClick={(e) => handleDelete(collecte.id, e)}
                                className={`text-gray-500 hover:text-red-600 ${
                                    confirmDelete === collecte.id ? 'text-red-600' : ''
                                }`}
                                title={confirmDelete === collecte.id ? "Confirmer la suppression" : "Supprimer"}
                            >
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
) : (
    <div className="text-center py-4 text-gray-500">
        Aucune collecte trouvée
    </div>
)}

                        {/* Pagination */}
                        {collectes.links && collectes.links.length > 3 && (
                            <div className="mt-6">
                                <nav className="flex items-center justify-between">
                                    <div className="text-sm text-gray-700">
                                        Affichage <span className="font-medium">{collectes.from}</span> à{' '}
                                        <span className="font-medium">{collectes.to}</span> sur{' '}
                                        <span className="font-medium">{collectes.total}</span> résultats
                                    </div>
                                    <div className="flex-1 flex justify-end space-x-2">
                                        {collectes.links.map((link, index) => (
                                            link.url && (
                                                <Link
                                                    key={index}
                                                    href={link.url}
                                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md ${
                                                        link.active
                                                            ? 'bg-blue-50 border-blue-500 text-blue-600'
                                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                    }`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            )
                                        ))}
                                    </div>
                                </nav>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default CollectesIndex;
