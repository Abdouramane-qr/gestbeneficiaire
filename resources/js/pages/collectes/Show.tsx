import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { toast } from 'sonner';
import { ArrowLeftIcon, PencilIcon, TrashIcon, CheckCircleIcon } from 'lucide-react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { formatDate } from '@/Utils/dateUtils';

// Interfaces existantes...
interface Entreprise {
    id: number;
    nom_entreprise: string;
    secteur_activite?: string;
}

interface Exercice {
    id: number;
    annee: number;
    date_debut?: string;
    date_fin?: string;
    actif?: boolean;
}

interface Periode {
    id: number;
    type_periode: string;
}

interface User {
    id: number;
    name: string;
}

interface Collecte {
    id: number;
    entreprise: Entreprise;
    exercice: Exercice;
    periode: Periode;
    user?: User;
    date_collecte: string;
    type_collecte: string;
    donnees: Record<string, Record<string, string | number>>;
    created_at: string;
    updated_at: string;
}

interface CollecteShowProps {
    collecte: Collecte;
    categoriesDisponibles: string[];
}

const CollecteShow: React.FC<CollecteShowProps> = ({ collecte, categoriesDisponibles }) => {
    const [activeTab, setActiveTab] = useState<string>(categoriesDisponibles[0] || '');
    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
    const [confirmConversion, setConfirmConversion] = useState<boolean>(false);
    const [isConverting, setIsConverting] = useState<boolean>(false);

    const pageTitle = `Collecte - ${collecte.entreprise.nom_entreprise}`;

    // Formatage des valeurs numériques
    const formatValue = (value: string | number) => {
        if (typeof value === 'number') {
            return value.toLocaleString('fr-FR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        }
        return value;
    };

    // Obtenir le libellé d'une catégorie
    const getCategoryLabel = (categoryId: string): string => {
        const categoryLabels: Record<string, string> = {
            'financier': 'Indicateurs Financiers',
            'commercial': 'Indicateurs Commerciaux',
            'production': 'Production',
            'rh': 'Ressources Humaines',
            'tresorerie': 'Trésorerie'
        };

        return categoryLabels[categoryId] || categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
    };

    // Gestion de la suppression
    const handleDelete = () => {
        if (confirmDelete) {
            router.delete(route('collectes.destroy', collecte.id), {
                onSuccess: () => {
                    toast.success('Collecte supprimée avec succès');
                    router.visit(route('collectes.index'));
                },
                onError: () => {
                    toast.error("Échec de la suppression de la collecte");
                    setConfirmDelete(false);
                },
            });
        } else {
            setConfirmDelete(true);
            toast.info("Cliquez à nouveau pour confirmer la suppression");

            setTimeout(() => {
                setConfirmDelete(false);
            }, 3000);
        }
    };

    // Nouvelle fonction pour convertir un brouillon en collecte standard
    const handleConvertToStandard = () => {
        if (confirmConversion) {
            setIsConverting(true);

            router.put(route('collectes.convert-to-standard', collecte.id), {}, {
                onSuccess: () => {
                    toast.success('Brouillon converti en collecte standard avec succès');
                    // Rechargement de la page pour refléter le changement de statut
                    router.reload();
                },
                onError: (errors) => {
                    if (errors.general) {
                        toast.error(errors.general);
                    } else if (errors.message) {
                        toast.error(errors.message);
                    } else {
                        toast.error("Échec de la conversion du brouillon");
                    }
                    setIsConverting(false);
                    setConfirmConversion(false);
                },
                onFinish: () => {
                    setIsConverting(false);
                    setConfirmConversion(false);
                }
            });
        } else {
            setConfirmConversion(true);
            toast.info("Cliquez à nouveau pour confirmer la conversion en collecte standard");

            setTimeout(() => {
                setConfirmConversion(false);
            }, 3000);
        }
    };

    return (
        <AuthenticatedLayout title={pageTitle}>
            <Head title={pageTitle} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        {/* En-tête */}
                        <div className="border-b border-gray-200 px-4 py-4 sm:px-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-semibold text-gray-800">
                                    Détails de la collecte
                                    {collecte.type_collecte === 'brouillon' && (
                                        <span className="ml-2 px-2 py-1 text-xs bg-amber-100 text-amber-800 rounded-full">
                                            Brouillon
                                        </span>
                                    )}
                                </h2>
                                <div className="flex space-x-2">
                                    {/* Bouton de conversion pour les brouillons */}
                                    {collecte.type_collecte === 'brouillon' && (
                                        <button
                                            onClick={handleConvertToStandard}
                                            disabled={isConverting}
                                            className={`inline-flex items-center px-4 py-2 rounded-md text-white ${
                                                confirmConversion
                                                    ? 'bg-green-800 hover:bg-green-900'
                                                    : 'bg-green-600 hover:bg-green-700'
                                            } ${isConverting ? 'opacity-75 cursor-not-allowed' : ''}`}
                                        >
                                            <CheckCircleIcon className="w-4 h-4 mr-2" />
                                            {isConverting
                                                ? 'Conversion...'
                                                : confirmConversion
                                                    ? 'Confirmer'
                                                    : 'Convertir en standard'
                                            }
                                        </button>
                                    )}

                                    <Link
                                        href={route('collectes.edit', collecte.id)}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    >
                                        <PencilIcon className="w-4 h-4 mr-2" />
                                        Modifier
                                    </Link>
                                    <button
                                        onClick={handleDelete}
                                        className={`inline-flex items-center px-4 py-2 rounded-md text-white ${
                                            confirmDelete ? 'bg-red-800 hover:bg-red-900' : 'bg-red-600 hover:bg-red-700'
                                        }`}
                                    >
                                        <TrashIcon className="w-4 h-4 mr-2" />
                                        {confirmDelete ? 'Confirmer' : 'Supprimer'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            {/* Bouton retour */}
                            <div className="mb-6">
                                <Link
                                    href={route('collectes.index')}
                                    className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
                                >
                                    <ArrowLeftIcon className="w-4 h-4 mr-2" />
                                    Retour à la liste
                                </Link>
                            </div>

                            {/* Message de statut brouillon */}
                            {collecte.type_collecte === 'brouillon' && (
                                <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-amber-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-amber-800">
                                                Cette collecte est en mode brouillon
                                            </h3>
                                            <div className="mt-2 text-sm text-amber-700">
                                                <p>
                                                    Les collectes en mode brouillon ne sont pas comptabilisées dans les analyses.
                                                    Vous pouvez la convertir en collecte standard en utilisant le bouton "Convertir en standard".
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Informations générales */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                {/* Informations de la collecte */}
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold mb-4">Informations de la Collecte</h3>
                                    <dl className="grid grid-cols-1 gap-3">
                                        <div className="flex justify-between">
                                            <dt className="font-medium text-gray-500">Date de collecte</dt>
                                            <dd className="text-gray-900">{formatDate(collecte.date_collecte)}</dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="font-medium text-gray-500">Statut</dt>
                                            <dd className="text-gray-900">
                                                {collecte.type_collecte === 'brouillon'
                                                    ? <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs">Brouillon</span>
                                                    : <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Standard</span>
                                                }
                                            </dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="font-medium text-gray-500">Créée par</dt>
                                            <dd className="text-gray-900">{collecte.user?.name || 'Non spécifié'}</dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="font-medium text-gray-500">Créée le</dt>
                                            <dd className="text-gray-900">{formatDate(collecte.created_at)}</dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="font-medium text-gray-500">Dernière modification</dt>
                                            <dd className="text-gray-900">{formatDate(collecte.updated_at)}</dd>
                                        </div>
                                    </dl>
                                </div>

                                {/* Informations de l'entreprise */}
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold mb-4">Informations de l'Entreprise</h3>
                                    <dl className="grid grid-cols-1 gap-3">
                                        <div className="flex justify-between">
                                            <dt className="font-medium text-gray-500">Nom</dt>
                                            <dd>{collecte.entreprise.nom_entreprise}</dd>
                                        </div>
                                        {collecte.entreprise.secteur_activite && (
                                            <div className="flex justify-between">
                                                <dt className="font-medium text-gray-500">Secteur d'activité</dt>
                                                <dd>{collecte.entreprise.secteur_activite}</dd>
                                            </div>
                                        )}
                                    </dl>
                                </div>
                            </div>

                            {/* Données collectées */}
                            <div className="mt-8">
                                <h3 className="text-xl font-semibold mb-6">Données Collectées</h3>

                                {/* Onglets des catégories */}
                                <div className="border-b border-gray-200">
                                    <nav className="-mb-px flex space-x-8">
                                        {categoriesDisponibles.map(category => (
                                            <button
                                                key={category}
                                                onClick={() => setActiveTab(category)}
                                                className={`
                                                    py-4 px-1 border-b-2 font-medium text-sm
                                                    ${activeTab === category
                                                        ? 'border-blue-500 text-blue-600'
                                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                                                `}
                                            >
                                                {getCategoryLabel(category)}
                                            </button>
                                        ))}
                                    </nav>
                                </div>

                                {/* Contenu de l'onglet actif */}
                                <div className="mt-6">
                                    {collecte.donnees[activeTab] ? (
                                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Indicateur
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Valeur
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {Object.entries(collecte.donnees[activeTab]).map(([key, value]) => (
                                                        <tr key={key}>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                {key}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {formatValue(value)}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <p className="text-center text-gray-500 py-4">
                                            Aucune donnée disponible pour cette catégorie.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default CollecteShow;
