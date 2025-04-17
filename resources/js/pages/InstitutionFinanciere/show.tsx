import React from "react";
import { PencilIcon, TrashIcon, ArrowLeftIcon } from "lucide-react";
import { router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";

interface Institution {
    id: number;
    nom: string;
    adresse: string;
    ville: string;
    pays: string;
    contact: string;
    email: string;
    description: string;
    statut_juridique: string;
    date_creation: string;
}

interface InstitutionDetailProps {
    institution: Institution;
    onEdit: () => void;
    onDelete: () => void;
}

const InstitutionDetail: React.FC<InstitutionDetailProps> = ({
    institution,
    onEdit,
    onDelete
}) => {

    return (
        <AppLayout
            title={`Détails de ${institution.nom}`}
            header={
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <button
                            onClick={() => router.visit('/institutions')}
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center mr-4"
                        >
                            <ArrowLeftIcon className="w-4 h-4 mr-2" />
                            Retour à la liste
                        </button>
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            Détails de l'institution
                        </h2>
                    </div>
                </div>
            }
        >
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">Informations générales</h2>
                            <div className="space-y-2">
                                <p className="flex items-start">
                                    <span className="font-medium w-40 inline-block text-gray-700 dark:text-gray-300">Nom :</span>
                                    <span className="text-gray-900 dark:text-gray-100">{institution.nom}</span>
                                </p>
                                <p className="flex items-start">
                                    <span className="font-medium w-40 inline-block text-gray-700 dark:text-gray-300">Adresse :</span>
                                    <span className="text-gray-900 dark:text-gray-100">{institution.adresse}</span>
                                </p>
                                <p className="flex items-start">
                                    <span className="font-medium w-40 inline-block text-gray-700 dark:text-gray-300">Ville :</span>
                                    <span className="text-gray-900 dark:text-gray-100">{institution.ville}</span>
                                </p>
                              
                            </div>
                        </div>


                    </div>

                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">Description</h2>
                            <div className="space-y-2">
                                <p className="text-gray-900 dark:text-gray-100">{institution.description}</p>
                            </div>
                        </div>


                    </div>
                </div>

                <div className="flex space-x-2 mt-4">
                    <button
                        onClick={onEdit}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
                    >
                        <PencilIcon className="w-4 h-4 mr-2" />
                        Modifier
                    </button>
                    <button
                        onClick={onDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                    >
                        <TrashIcon className="w-4 h-4 mr-2" />
                        Supprimer
                    </button>
                </div>
            </div>
        </AppLayout>
    );
};

export default InstitutionDetail;
