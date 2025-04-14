import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';

import { PageProps } from '@/types';
import AppLayout from '@/layouts/app-layout';
import IndicateurFormModal from '@/components/IndicateurFormModal';

interface Field {
    id: string;
    name: string;
    type: string;
    required: boolean;
    options?: string[];
    formula?: string;
}

interface Indicateur {
    id: number;
    code: string;
    nom: string;
    description: string | null;
    fields: Field[];
    created_at: string;
    updated_at: string;
}

interface IndicateursIndexProps extends PageProps {
    indicateurs: {
        data: Indicateur[];
        links: any[];
        current_page: number;
        last_page: number;
    };
}

export default function Index({ indicateurs }: IndicateursIndexProps) {

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [indicateurToDelete, setIndicateurToDelete] = useState<number | null>(null);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editingIndicateur, setEditingIndicateur] = useState<Indicateur | null>(null);

    const confirmDelete = (id: number) => {
        setIndicateurToDelete(id);
        setDeleteModalOpen(true);
    };

    const deleteIndicateur = () => {
        if (indicateurToDelete) {
            router.delete(route('indicateurs.destroy', indicateurToDelete), {
                onSuccess: () => {
                    setDeleteModalOpen(false);
                    setIndicateurToDelete(null);
                },
            });
        }
    };


    const fetchIndicateurs = () => {
        router.get(route("indicateurs.index"), {}, {
            preserveState: true,
            only: ["indicateurs"], // Recharge uniquement les indicateurs
            onSuccess: () => {
                // Vérifie la structure de la réponse

            },
            onError: (errors) => {
                console.error("Erreur lors du chargement des indicateurs", errors);
                // Tu peux aussi afficher un message d'erreur via un toast, par exemple
            }
        });
    };


    const openCreateModal = () => {
        setEditingIndicateur(null);
        setCreateModalOpen(true);
    };

    const openEditModal = (indicateur: Indicateur) => {
        setEditingIndicateur(indicateur);
        setCreateModalOpen(true);
    };

    const closeModal = () => {
        setCreateModalOpen(false);
        setEditingIndicateur(null);
    };

    // Fonction pour afficher le type de champ
    // const getFieldTypeLabel = (type: string) => {
    //     const types: { [key: string]: string } = {
    //         'text': 'Texte',
    //         'number': 'Nombre',
    //         'boolean': 'Oui/Non',
    //         'select': 'Sélection',
    //         'date': 'Date',
    //         'calculated': 'Calculé'
    //     };
    //     return types[type] || type;
    // };

    return (
        <AppLayout title='Analyse'>
            <Head title="Gestion des indicateurs" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900">Indicateurs</h1>
                        <button
                            onClick={openCreateModal}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Nouvel indicateur
                        </button>
                    </div>

                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Code
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Nom
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Description
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Champs
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {indicateurs.data.map((indicateur) => (
                                        <tr key={indicateur.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {indicateur.code}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {indicateur.nom}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                                {indicateur.description || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {indicateur.fields?.length || 0} champ(s)
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end space-x-2">
                                                    <Link
                                                        href={route('indicateurs.show', indicateur.id)}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                        title="Détails"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </Link>

                                                    <button
                                                        onClick={() => openEditModal(indicateur)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                        title="Modifier"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                        </svg>
                                                    </button>

                                                    <button
                                                        onClick={() => confirmDelete(indicateur.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                        title="Supprimer"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="px-6 py-4 bg-white border-t border-gray-200">
                            <nav className="flex items-center justify-between">
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Affichage de <span className="font-medium">{indicateurs.data.length}</span> indicateurs
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                            {indicateurs.links && indicateurs.links.map((link, i) => (
                                                link.url ? (
                                                    <Link
                                                        key={i}
                                                        href={link.url}
                                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${link.active
                                                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                            }`}
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                ) : (
                                                    <span
                                                        key={i}
                                                        className="relative inline-flex items-center px-4 py-2 border text-sm font-medium bg-white border-gray-300 text-gray-400 cursor-not-allowed"
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                )
                                            ))}

                                        </nav>
                                    </div>
                                </div>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de création/édition */}
            {createModalOpen && (
                <IndicateurFormModal
                    isOpen={createModalOpen}
                    closeModal={closeModal}
                    indicateur={editingIndicateur}
                    onSuccess={fetchIndicateurs}


                />
            )}

            {/* Modal de confirmation de suppression */}
            {deleteModalOpen && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                                            Confirmer la suppression
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Êtes-vous sûr de vouloir supprimer cet indicateur ? Cette action est irréversible.
                                                <br />
                                                <strong className="text-red-500">Attention :</strong> Les collectes associées à cet indicateur seront également supprimées.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={deleteIndicateur}
                                >
                                    Supprimer
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={() => setDeleteModalOpen(false)}
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
