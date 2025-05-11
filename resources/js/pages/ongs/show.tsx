import React from "react";
import { PencilIcon, TrashIcon } from 'lucide-react';

interface ONG {
    id: number;
    nom: string;
    description: string;
    adresse: string;
}

interface ShowProps {
    ong: ONG;
    onEdit: () => void;
    onDelete: () => void;
}

const Show: React.FC<ShowProps> = ({ ong, onEdit, onDelete }) => {
    return (
        <div className="bg-white rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-md">
                        <h2 className="text-lg font-semibold text-gray-700 mb-3">Informations générales</h2>
                        <div className="space-y-2">
                            <p className="flex items-start">
                                <span className="font-medium w-40 inline-block text-gray-700">Nom :</span>
                                <span className="text-gray-900">{ong.nom}</span>
                            </p>
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-md">
                        <h2 className="text-lg font-semibold text-gray-700 mb-3">Description</h2>
                        <div className="space-y-2">
                            <p className="text-gray-900">{ong.description}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-md">
                        <h2 className="text-lg font-semibold text-gray-700 mb-3">Coordonnées</h2>
                        <div className="space-y-2">
                            <p className="flex items-start">
                                <span className="font-medium w-40 inline-block text-gray-700">Adresse :</span>
                                <span className="text-gray-900">{ong.adresse}</span>
                            </p>
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
    );
};

export default Show;
