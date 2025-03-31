import React from "react";

interface Entreprise {
    id: number;
    nom_entreprise: string;
    secteur_activite: string;
    adresse: string;
    contact: string;
    email: string;
    date_creation: string;
    statut_juridique: string;
    description: string;
    ville: string;
    pays: string;
}

const Show: React.FC<{ entreprise: Entreprise }> = ({ entreprise }) => {
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
                                <span className="text-gray-900 dark:text-gray-100">{entreprise.nom_entreprise}</span>
                            </p>
                            <p className="flex items-start">
                                <span className="font-medium w-40 inline-block text-gray-700 dark:text-gray-300">Secteur d'activité :</span>
                                <span className="text-gray-900 dark:text-gray-100">{entreprise.secteur_activite}</span>
                            </p>
                            <p className="flex items-start">
                                <span className="font-medium w-40 inline-block text-gray-700 dark:text-gray-300">Date de création :</span>
                                <span className="text-gray-900 dark:text-gray-100">{formatDate(entreprise.date_creation)}</span>
                            </p>
                            <p className="flex items-start">
                                <span className="font-medium w-40 inline-block text-gray-700 dark:text-gray-300">Statut juridique :</span>
                                <span className="text-gray-900 dark:text-gray-100">{entreprise.statut_juridique}</span>
                            </p>
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">Coordonnées</h2>
                        <div className="space-y-2">
                            <p className="flex items-start">
                                <span className="font-medium w-40 inline-block text-gray-700 dark:text-gray-300">Adresse :</span>
                                <span className="text-gray-900 dark:text-gray-100">{entreprise.adresse}</span>
                            </p>
                            <p className="flex items-start">
                                <span className="font-medium w-40 inline-block text-gray-700 dark:text-gray-300">Ville :</span>
                                <span className="text-gray-900 dark:text-gray-100">{entreprise.ville}</span>
                            </p>
                            <p className="flex items-start">
                                <span className="font-medium w-40 inline-block text-gray-700 dark:text-gray-300">Pays :</span>
                                <span className="text-gray-900 dark:text-gray-100">{entreprise.pays}</span>
                            </p>
                            <p className="flex items-start">
                                <span className="font-medium w-40 inline-block text-gray-700 dark:text-gray-300">Contact :</span>
                                <span className="text-gray-900 dark:text-gray-100">{entreprise.contact}</span>
                            </p>
                            <p className="flex items-start">
                                <span className="font-medium w-40 inline-block text-gray-700 dark:text-gray-300">Email :</span>
                                <span className="text-gray-900 dark:text-gray-100">{entreprise.email}</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">Description</h2>
                        <div className="space-y-2">
                            <p className="text-gray-900 dark:text-gray-100">{entreprise.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Show;
