import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import AppLayout from '@/layouts/app-layout';

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

interface IndicateurShowProps extends PageProps {
    indicateur: Indicateur;
    collectesCount: number;
}

export default function Show({ indicateur, collectesCount }: IndicateurShowProps) {
    // Fonction pour afficher le type de champ
    const getFieldTypeLabel = (type: string) => {
        const types: { [key: string]: string } = {
            'text': 'Texte',
            'number': 'Nombre',
            'boolean': 'Oui/Non',
            'select': 'Sélection',
            'date': 'Date',
            'calculated': 'Calculé'
        };
        return types[type] || type;
    };

    // Formatage de la date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AppLayout>
            <Head title={`Indicateur: ${indicateur.nom}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Indicateur: {indicateur.nom}
                        </h1>

                        <div className="flex space-x-2">
                            <Link
                                href={route('indicateurs.index')}
                                className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition"
                            >
                                Retour
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg p-6">
                        <div className="mb-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-2">Informations générales</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Code</p>
                                    <p className="text-base text-gray-900">{indicateur.code}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Nom</p>
                                    <p className="text-base text-gray-900">{indicateur.nom}</p>
                                </div>
                                <div className="md:col-span-2">
                                    <p className="text-sm font-medium text-gray-600">Description</p>
                                    <p className="text-base text-gray-900">{indicateur.description || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Créé le</p>
                                    <p className="text-base text-gray-900">{formatDate(indicateur.created_at)}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Dernière mise à jour</p>
                                    <p className="text-base text-gray-900">{formatDate(indicateur.updated_at)}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Nombre de collectes</p>
                                    <p className="text-base text-gray-900">{collectesCount}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Champs de l'indicateur</h2>
                            <div className="bg-gray-50 overflow-hidden border border-gray-200 sm:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                ID
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Nom du champ
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Type
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Obligatoire
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Détails
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {indicateur.fields && indicateur.fields.length > 0 ? (
                                            indicateur.fields.map((field, index) => (
                                                <tr key={field.id || index}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {field.id}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {field.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {getFieldTypeLabel(field.type)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {field.required ? (
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                                Oui
                                                            </span>
                                                        ) : (
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                                                Non
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">
                                                        {field.type === 'select' && field.options && (
                                                            <div>
                                                                <p className="font-medium">Options:</p>
                                                                <ul className="list-disc list-inside pl-2">
                                                                    {field.options.map((option, idx) => (
                                                                        <li key={idx}>{option}</li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}

                                                        {field.type === 'calculated' && field.formula && (
                                                            <div>
                                                                <p className="font-medium">Formule:</p>
                                                                <code className="bg-gray-100 p-1 rounded">{field.formula}</code>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                                                    Aucun champ défini pour cet indicateur
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="mt-6 border-t border-gray-200 pt-4">
                            <div className="flex justify-between">
                                <Link
                                    href={route('collectes.index', { indicateur_id: indicateur.id })}
                                    className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Voir les collectes associées
                                </Link>

                                <Link
                                    href={route('collectes.create', { indicateur_id: indicateur.id })}
                                    className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 active:bg-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    Nouvelle collecte avec cet indicateur
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
