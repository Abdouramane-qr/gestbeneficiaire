import React from 'react';
import { formatDate } from '@/Utils/dateUtils';

// Définition des interfaces pour les types
interface Entreprise {
    id: number;
    nom_entreprise: string;
    secteur_activite: string;
}

interface Exercice {
    id: number;
    annee: number;
    date_debut: string;
    date_fin: string;
    actif: boolean;
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
    donnees: Record<string, Record<string, string | number>>;
    user?: {
        name: string;
    };
}

const CollecteShow: React.FC<{ collecte: Collecte }> = ({ collecte }) => {
    // Fonction pour formater les valeurs numériques
    const formatValue = (value: string | number) => {
        if (typeof value === 'number') {
            return value.toLocaleString('fr-FR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        }
        return value;
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Informations de base */}
                <div className="space-y-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">
                            Informations de la Collecte
                        </h2>
                        <div className="space-y-2">
                            <p className="flex items-start">
                                <span className="font-medium w-40 inline-block text-gray-700 dark:text-gray-300">
                                    Date de collecte :
                                </span>
                                <span className="text-gray-900 dark:text-gray-100">
                                    {formatDate(collecte.date_collecte)}
                                </span>
                            </p>
                            <p className="flex items-start">
                                <span className="font-medium w-40 inline-block text-gray-700 dark:text-gray-300">
                                    Type de collecte :
                                </span>
                                <span className="text-gray-900 dark:text-gray-100">
                                    {collecte.type_collecte}
                                </span>
                            </p>
                            <p className="flex items-start">
                                <span className="font-medium w-40 inline-block text-gray-700 dark:text-gray-300">
                                    Collecté par :
                                </span>
                                <span className="text-gray-900 dark:text-gray-100">
                                    {collecte.user?.name || 'Non spécifié'}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Informations de l'entreprise */}
                <div className="space-y-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">
                            Entreprise
                        </h2>
                        <div className="space-y-2">
                            <p className="flex items-start">
                                <span className="font-medium w-40 inline-block text-gray-700 dark:text-gray-300">
                                    Nom :
                                </span>
                                <span className="text-gray-900 dark:text-gray-100">
                                    {collecte.entreprise.nom_entreprise}
                                </span>
                            </p>
                            <p className="flex items-start">
                                <span className="font-medium w-40 inline-block text-gray-700 dark:text-gray-300">
                                    Secteur d'activité :
                                </span>
                                <span className="text-gray-900 dark:text-gray-100">
                                    {collecte.entreprise.secteur_activite}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Exercice et Période */}
            <div className="mt-6 space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">
                        Exercice et Période
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="font-medium text-gray-700 dark:text-gray-300">
                                Exercice :
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                                {collecte.exercice.annee}
                                {collecte.exercice.actif ? ' (Actif)' : ''}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-500">
                                Du {formatDate(collecte.exercice.date_debut)}
                                au {formatDate(collecte.exercice.date_fin)}
                            </p>
                        </div>
                        <div>
                            <p className="font-medium text-gray-700 dark:text-gray-300">
                                Période :
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                                {collecte.periode.type_periode}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Données de la collecte */}
            {Object.entries(collecte.donnees || {}).map(([category, data]) => (
                <div key={category} className="mt-6 space-y-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Indicateur
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Valeur
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                                    {Object.entries(data).map(([key, value]) => (
                                        <tr key={key}>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                                {key}
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {formatValue(value)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CollecteShow;
