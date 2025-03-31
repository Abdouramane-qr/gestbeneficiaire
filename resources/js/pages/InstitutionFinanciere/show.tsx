
import React from "react";

interface Institution {
    id: number;
    nom: string;
    adresse: string;
    ville: string;
    description: string;
    contact: string;
    email: string;
    date_creation: string;
    statut_juridique: string;
    pays: string;
}

const InstitutionDetail: React.FC<{ institution: Institution }> = ({ institution }) => {
    const formatDate = (dateString: string) => {
        if (!dateString) return 'Non spécifié';
        try {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat('fr-FR').format(date);
        } catch (e) {
            console.log(e);
            return dateString;
        }
    };

    return (
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
                            <p className="flex items-start">
                                <span className="font-medium w-40 inline-block text-gray-700 dark:text-gray-300">Pays :</span>
                                <span className="text-gray-900 dark:text-gray-100">{institution.pays}</span>
                            </p>
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">Coordonnées</h2>
                        <div className="space-y-2">
                            <p className="flex items-start">
                                <span className="font-medium w-40 inline-block text-gray-700 dark:text-gray-300">Contact :</span>
                                <span className="text-gray-900 dark:text-gray-100">{institution.contact}</span>
                            </p>
                            <p className="flex items-start">
                                <span className="font-medium w-40 inline-block text-gray-700 dark:text-gray-300">Email :</span>
                                <span className="text-gray-900 dark:text-gray-100">{institution.email}</span>
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

                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">Statut et création</h2>
                        <div className="space-y-2">
                            <p className="flex items-start">
                                <span className="font-medium w-40 inline-block text-gray-700 dark:text-gray-300">Statut juridique :</span>
                                <span className="text-gray-900 dark:text-gray-100">{institution.statut_juridique}</span>
                            </p>
                            <p className="flex items-start">
                                <span className="font-medium w-40 inline-block text-gray-700 dark:text-gray-300">Date de création :</span>
                                <span className="text-gray-900 dark:text-gray-100">{formatDate(institution.date_creation)}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstitutionDetail;
