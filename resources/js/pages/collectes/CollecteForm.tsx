import React, { useState, useEffect } from 'react';
import { Link, router, useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { IndicateurCalculator, CategorieName, PeriodeName } from '@/Utils/IndicateurCalculator';
import { ArrowLeftIcon } from 'lucide-react';

interface Entreprise {
    id: number;
    nom_entreprise: string;
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
    exercice_id: number;
}

interface CollecteFormProps {
    entreprises: Entreprise[];
    exercices: Exercice[];
    periodes: Periode[];
    collecte?: any;
    isEditing?: boolean;
    preselectedPeriode?: number;
}

const CollecteForm: React.FC<CollecteFormProps> = ({
    entreprises,
    exercices,
    periodes,
    collecte,
    isEditing = false,
    preselectedPeriode,
}) => {
    // État pour le suivi de l'étape actuelle et des onglets
    const [isDraft, setIsDraft] = useState(isEditing && collecte?.type_collecte === 'brouillon');
    const [step, setStep] = useState(1);
    const [activeTab, setActiveTab] = useState<CategorieName>('financier');
    const [selectedPeriodeType, setSelectedPeriodeType] = useState<PeriodeName | ''>('');
    const [availableCategories, setAvailableCategories] = useState<{ id: CategorieName, label: string }[]>([]);
    const [periodeFiltrees, setPeriodeFiltrees] = useState<Periode[]>(periodes);

    // Récupérer les données initiales si on est en mode édition
    const initialDonnees = isEditing && collecte?.donnees
        ? typeof collecte.donnees === 'string'
            ? JSON.parse(collecte.donnees)
            : collecte.donnees
        : {};

    // Configuration du formulaire
    const { data, setData, post, put, processing, errors, reset } = useForm({
        entreprise_id: isEditing && collecte ? collecte.entreprise_id.toString() : '',
        exercice_id: isEditing && collecte ? collecte.exercice_id.toString() : '',
        periode_id: isEditing && collecte ? collecte.periode_id.toString() : preselectedPeriode ? preselectedPeriode.toString() : '',
        date_collecte: isEditing && collecte ? collecte.date_collecte : new Date().toISOString().split('T')[0],
        donnees: initialDonnees,
        type_collecte: isEditing && collecte ? collecte.type_collecte : 'standard',
    });

    // Filtrer les périodes lorsque l'exercice change
    useEffect(() => {
        if (data.exercice_id) {
            const exerciceId = parseInt(data.exercice_id);
            const filtered = periodes.filter(p => p.exercice_id === exerciceId);
            setPeriodeFiltrees(filtered);

            // Si une période était déjà sélectionnée et qu'elle n'est plus disponible, la réinitialiser
            if (data.periode_id && !filtered.some(p => p.id.toString() === data.periode_id)) {
                setData('periode_id', '');
                setSelectedPeriodeType('');
            }
        } else {
            setPeriodeFiltrees([]);
            setData('periode_id', '');
            setSelectedPeriodeType('');
        }
    }, [data.exercice_id, data.periode_id, periodes, setData]);

    // Mettre à jour le type de période lorsque la période change
    useEffect(() => {
        if (data.periode_id) {
            const periodeObj = periodes.find(p => p.id.toString() === data.periode_id);
            if (periodeObj) {
                const typePeriode = mapTypePeriode(periodeObj.type_periode);
                setSelectedPeriodeType(typePeriode);
                updateAvailableCategories(typePeriode);
            }
        } else {
            setSelectedPeriodeType('');
            setAvailableCategories([]);
        }
    }, [data.periode_id, periodes]);

    // Fonction pour mapper le type de période de la BDD au type PeriodeName
    const mapTypePeriode = (typePeriode: string): PeriodeName | '' => {
        const typeMap: Record<string, PeriodeName> = {
            'Mensuel': 'Trimestrielle', // Fallback temporaire
            'mensuel': 'Trimestrielle', // Fallback temporaire
            'Trimestriel': 'Trimestrielle',
            'trimestriel': 'Trimestrielle',
            'Semestriel': 'Semestrielle',
            'semestriel': 'Semestrielle',
            'Annuel': 'Annuelle',
            'annuel': 'Annuelle',
            // Mappings directs
            'Trimestrielle': 'Trimestrielle',
            'Semestrielle': 'Semestrielle',
            'Annuelle': 'Annuelle',
        };

        return typeMap[typePeriode] || '';
    };

    // Fonction pour mettre à jour les catégories disponibles
    const updateAvailableCategories = (periodeType: PeriodeName | '') => {
        if (!periodeType) {
            setAvailableCategories([]);
            return;
        }

        const categoriesForPeriode = IndicateurCalculator.getCategoriesForPeriode(periodeType);

        // Mapper les catégories aux libellés
        const categoriesWithLabels = categoriesForPeriode.map(cat => {
            const labels: Record<string, string> = {
                'financier': 'Indicateurs Financiers',
                'commercial': 'Indicateurs Commerciaux',
                'production': 'Production',
                'rh': 'Ressources Humaines',
                'tresorerie': 'Trésorerie'
            };

            return {
                id: cat,
                label: labels[cat] || cat
            };
        });

        console.log(`Catégories disponibles pour la période ${periodeType}:`, categoriesWithLabels);
        setAvailableCategories(categoriesWithLabels);

        // Si aucune catégorie active n'est sélectionnée ou si elle n'est pas disponible
        if (categoriesWithLabels.length > 0 && !categoriesWithLabels.some(cat => cat.id === activeTab)) {
            setActiveTab(categoriesWithLabels[0].id);
        }
    };

    // Mise à jour d'un champ d'indicateur
    const handleIndicateurChange = (category: CategorieName, fieldId: string, value: string) => {
        // S'assurer que data.donnees[category] existe
        const currentCategoryData = data.donnees[category] || {};

        const updatedCategory = {
            ...currentCategoryData,
            [fieldId]: value,
        };

        // Calculer les indicateurs dérivés pour cette catégorie
        const calculatedData = IndicateurCalculator.calculateDerivedFields(
            category,
            updatedCategory
        );

        // Mettre à jour les données du formulaire
        setData('donnees', {
            ...data.donnees,
            [category]: calculatedData,
        });
    };

    // Fonction pour convertir un brouillon en standard
    const convertToStandard = () => {
        if (!collecte || !collecte.id) return;

        // Afficher un message de confirmation
        if (!confirm("Êtes-vous sûr de vouloir convertir ce brouillon en collecte standard? Cette action est irréversible.")) {
            return;
        }

        // Utiliser directement la route dédiée pour la conversion
        router.put(route('collectes.convert-to-standard', collecte.id), {}, {
            onSuccess: () => {
                toast.success('Brouillon converti avec succès en collecte standard');
                setTimeout(() => {
                    window.location.href = route('collectes.index');
                }, 1500);
            },
            onError: (errors) => {
                console.error('Erreurs lors de la conversion:', errors);
                if (errors.message) {
                    toast.error(errors.message);
                } else if (errors.general) {
                    toast.error(errors.general);
                } else {
                    toast.error('Erreur lors de la conversion du brouillon');
                }
            }
        });
    };

    // Fonction pour enregistrer comme brouillon
    const handleSaveAsDraft = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDraft(true);
        setData('type_collecte', 'brouillon'); // S'assurer que le type est défini

        post(route('collectes.draft'), {
            entreprise_id: data.entreprise_id,
            exercice_id: data.exercice_id,
            periode_id: data.periode_id,
            date_collecte: data.date_collecte,
            donnees: data.donnees,
            type_collecte: 'brouillon' // S'assurer d'envoyer le type
        }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Brouillon enregistré avec succès');
            },
            onError: (errors) => {
                console.error('Erreurs de validation:', errors);
                Object.entries(errors).forEach(([field, message]) =>
                    toast.error(`${field}: ${message as string}`)
                );
            }
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation(); // Arrête la propagation de l'événement

        // Détermine le type de collecte en fonction du statut actuel
        const typeCollecte = isEditing && collecte?.type_collecte === 'brouillon'
            ? 'standard'
            : (isDraft ? 'brouillon' : 'standard');

        // Forcer explicitement le type à 'standard' pour la conversion
        let updatedTypeCollecte = typeCollecte;

        // Si nous sommes en train de soumettre un brouillon édité, forcer à standard
        if (isEditing && collecte?.type_collecte === 'brouillon') {
            updatedTypeCollecte = 'standard';
        }

        const dataToSubmit = {
            entreprise_id: data.entreprise_id,
            exercice_id: data.exercice_id,
            periode_id: data.periode_id,
            date_collecte: data.date_collecte,
            donnees: data.donnees,
            type_collecte: updatedTypeCollecte,  // Utiliser la valeur forcée
            convertToStandard: isEditing && collecte?.type_collecte === 'brouillon' // Flag pour le backend
        };

        console.log('Données de soumission:', {
            isEditing,
            collecteCurrentType: collecte?.type_collecte,
            typeCollecte: updatedTypeCollecte,
            dataToSubmit
        });

        if (isEditing && collecte) {
            // Si nous convertissons un brouillon en standard, utiliser la route dédiée
            if (collecte.type_collecte === 'brouillon' && updatedTypeCollecte === 'standard') {
                // Option plus fiable: utiliser la route dédiée
                router.put(route('collectes.convert-to-standard', collecte.id), {}, {
                    onSuccess: () => {
                        toast.success('Brouillon converti en collecte standard');
                        setTimeout(() => {
                            window.location.href = route('collectes.index');
                        }, 1000);
                    },
                    onError: (errors) => {
                        console.error('Erreurs de conversion:', errors);
                        if (errors.message) {
                            toast.error(errors.message);
                        } else {
                            Object.entries(errors).forEach(([field, message]) =>
                                toast.error(`${field}: ${message as string}`)
                            );
                        }
                    }
                });
            } else {
                // Mise à jour normale
                put(route('collectes.update', collecte.id), dataToSubmit, {
                    onSuccess: () => {
                        toast.success('Collecte mise à jour avec succès');
                        setTimeout(() => {
                            window.location.href = route('collectes.index');
                        }, 1000);
                    },
                    onError: (errors) => {
                        console.error('Erreurs de mise à jour:', errors);
                        if (errors.message) {
                            toast.error(errors.message);
                        } else {
                            Object.entries(errors).forEach(([field, message]) =>
                                toast.error(`${field}: ${message as string}`)
                            );
                        }
                    }
                });
            }
        } else {
            // Logique de création similaire
            post(route('collectes.store'), dataToSubmit, {
                onSuccess: () => {
                    toast.success('Collecte enregistrée avec succès');
                    setTimeout(() => {
                        window.location.href = route('collectes.index');
                    }, 1000);
                },
                onError: (errors) => {
                    if (errors.message) {
                        toast.error(errors.message);
                    } else {
                        Object.entries(errors).forEach(([field, message]) =>
                            toast.error(`${field}: ${message as string}`)
                        );
                    }
                }
            });
        }
    };

    // Vérifier si on peut passer à l'étape suivante
    const canProceedToStep2 = data.entreprise_id && data.exercice_id && data.periode_id && data.date_collecte;

    // Filtrer les champs en fonction de la période sélectionnée
    const getFilteredFields = () => {
        if (!selectedPeriodeType) return [];

        return IndicateurCalculator.getFieldsByCategoryAndPeriode(activeTab, selectedPeriodeType);
    };

    return (
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white border-b border-gray-200">
                <h1 className="text-2xl font-semibold mb-6">
                    {isEditing ? "Modifier la collecte" : isDraft ? "Brouillon de collecte" : "Nouvelle collecte d'indicateurs"}
                </h1>
                {isEditing && collecte?.type_collecte === 'brouillon' && (
                    <div className="bg-amber-100 p-3 rounded-md mb-4 flex items-center justify-between">
                        <p className="text-amber-800">
                            Cette collecte est en mode brouillon et ne sera pas comptabilisée dans les analyses.
                        </p>
                        <button
                            type="button"
                            onClick={convertToStandard}
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        >
                            Convertir en collecte standard
                        </button>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Étape 1: Sélection de l'entreprise, période, exercice */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Sélection de l'entreprise */}
                                <div>
                                    <label htmlFor="entreprise_id" className="block text-sm font-medium text-gray-700">
                                        Entreprise
                                    </label>
                                    <select
                                        id="entreprise_id"
                                        name="entreprise_id"
                                        value={data.entreprise_id}
                                        onChange={e => setData('entreprise_id', e.target.value)}
                                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.entreprise_id ? 'border-red-500' : ''
                                            }`}
                                    >
                                        <option value="">Sélectionner une entreprise</option>
                                        {entreprises.map(entreprise => (
                                            <option key={entreprise.id} value={entreprise.id.toString()}>
                                                {entreprise.nom_entreprise}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.entreprise_id && (
                                        <p className="mt-1 text-sm text-red-500">{errors.entreprise_id}</p>
                                    )}
                                </div>

                                {/* Sélection de l'exercice */}
                                <div>
                                    <label htmlFor="exercice_id" className="block text-sm font-medium text-gray-700">
                                        Exercice
                                    </label>
                                    <select
                                        id="exercice_id"
                                        name="exercice_id"
                                        value={data.exercice_id}
                                        onChange={e => setData('exercice_id', e.target.value)}
                                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.exercice_id ? 'border-red-500' : ''
                                            }`}
                                    >
                                        <option value="">Sélectionner un exercice</option>
                                        {exercices.map(exercice => (
                                            <option key={exercice.id} value={exercice.id.toString()}>
                                                {exercice.annee} {exercice.actif ? '(Actif)' : ''}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.exercice_id && (
                                        <p className="mt-1 text-sm text-red-500">{errors.exercice_id}</p>
                                    )}
                                </div>

                                {/* Sélection de la période */}
                                <div>
                                    <label htmlFor="periode_id" className="block text-sm font-medium text-gray-700">
                                        Période
                                    </label>
                                    <select
                                        id="periode_id"
                                        name="periode_id"
                                        value={data.periode_id}
                                        onChange={e => setData('periode_id', e.target.value)}
                                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.periode_id ? 'border-red-500' : ''
                                            }`}
                                        disabled={periodeFiltrees.length === 0 || !!preselectedPeriode}
                                    >
                                        <option value="">Sélectionner une période</option>
                                        {periodeFiltrees.map(periode => (
                                            <option key={periode.id} value={periode.id.toString()}>
                                                {periode.type_periode}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.periode_id && (
                                        <p className="mt-1 text-sm text-red-500">{errors.periode_id}</p>
                                    )}
                                    {periodeFiltrees.length === 0 && data.exercice_id && (
                                        <p className="mt-1 text-sm text-amber-500">Veuillez d'abord sélectionner un exercice</p>
                                    )}
                                </div>

                                {/* Date de collecte */}
                                <div>
                                    <label htmlFor="date_collecte" className="block text-sm font-medium text-gray-700">
                                        Date de collecte
                                    </label>
                                    <input
                                        type="date"
                                        id="date_collecte"
                                        name="date_collecte"
                                        value={data.date_collecte}
                                        onChange={e => setData('date_collecte', e.target.value)}
                                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.date_collecte ? 'border-red-500' : ''
                                            }`}
                                    />
                                    {errors.date_collecte && (
                                        <p className="mt-1 text-sm text-red-500">{errors.date_collecte}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end mt-6">
                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    disabled={!canProceedToStep2}
                                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                                >
                                    Continuer
                                </button>
                            </div>
                        </div>
                    )}

{step === 2 && (
    <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
            <div className="flex space-x-2">
                <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex items-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Retour
                </button>

                <Link
                    href={route('collectes.index')}
                    className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
                >
                    <ArrowLeftIcon className="w-4 h-4 mr-2" />
                    Retour à la liste
                </Link>
            </div>

            <div>
                <span className="text-sm font-medium text-gray-500">
                    {isEditing ? "Modifier la collecte" : "Nouvelle collecte"} -
                    Entreprise: {entreprises.find(e => e.id.toString() === data.entreprise_id)?.nom_entreprise || ''} -
                    Période: {periodeFiltrees.find(p => p.id.toString() === data.periode_id)?.type_periode || ''}
                </span>
            </div>
        </div>

        {availableCategories.length > 0 ? (
            <>
                {/* Onglets des catégories */}
                <div>
                    <div className="sm:hidden">
                        <label htmlFor="tabs" className="sr-only">
                            Sélectionner une catégorie
                        </label>
                        <select
                            id="tabs"
                            name="tabs"
                            className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                            value={activeTab}
                            onChange={e => setActiveTab(e.target.value as CategorieName)}
                        >
                            {availableCategories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="hidden sm:block">
                        <nav className="flex space-x-4 flex-wrap" aria-label="Tabs">
                            {availableCategories.map(category => (
                                <button
                                    key={category.id}
                                    type="button"
                                    onClick={() => setActiveTab(category.id)}
                                    className={`
                                   px-3 py-2 text-sm font-medium rounded-md my-1
                                   ${activeTab === category.id
                                        ? 'bg-indigo-100 text-indigo-700'
                                        : 'text-gray-500 hover:text-gray-700'}
                                 `}
                                >
                                    {category.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Champs des indicateurs par catégorie */}
                <div className="mt-4 bg-gray-50 p-4 rounded-md">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        {availableCategories.find(category => category.id === activeTab)?.label}
                    </h3>

                    <div className="space-y-4 mb-4">
                        <p className="text-sm text-gray-600">
                            Période: <span className="font-medium">{selectedPeriodeType}</span>
                        </p>
                        <p className="text-sm text-gray-600">
                            Nombre d'indicateurs: <span className="font-medium">{getFilteredFields().length}</span>
                        </p>
                    </div>

                    {getFilteredFields().length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {getFilteredFields().map(field => {
                                const isCalculated = field.type === 'calculated';
                                const fieldValue = data.donnees[activeTab]?.[field.id] || '';
                                const fieldUnit = field.unite || '';

                                return (
                                    <div key={field.id} className="space-y-1">
                                        <label
                                            htmlFor={`${activeTab}_${field.id}`}
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            {field.label}
                                            {field.required && !isCalculated && (
                                                <span className="text-red-500 ml-1">*</span>
                                            )}
                                        </label>

                                        <div className="relative mt-1 rounded-md shadow-sm">
                                            <input
                                                type={isCalculated ? "text" : "number"}
                                                id={`${activeTab}_${field.id}`}
                                                name={`${activeTab}_${field.id}`}
                                                value={fieldValue}
                                                onChange={e => handleIndicateurChange(activeTab, field.id, e.target.value)}
                                                readOnly={isCalculated}
                                                disabled={isCalculated}
                                                className={`
                                           block w-full rounded-md sm:text-sm
                                           ${isCalculated
                                                ? 'bg-gray-50 text-gray-500'
                                                : 'bg-white text-gray-900'}
                                           ${fieldUnit ? 'pr-12' : 'pr-3'}
                                           pl-3 py-2 border border-gray-300
                                           focus:border-indigo-500 focus:ring-indigo-500
                                         `}
                                                placeholder={isCalculated ? 'Calculé automatiquement' : `Saisir ${field.label.toLowerCase()}`}
                                            />
                                            {fieldUnit && (
                                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                                    <span className="text-gray-500 sm:text-sm">
                                                        {fieldUnit}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {field.definition && !isCalculated && (
                                            <p className="mt-1 text-xs text-gray-500">
                                                Définition: {field.definition}
                                            </p>
                                        )}

                                        {isCalculated && field.description && (
                                            <p className="mt-1 text-xs text-gray-500">
                                                {field.description}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <p className="text-gray-500">
                                Aucun indicateur disponible pour cette catégorie et cette période.
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex justify-end pt-4 space-x-4 border-t border-gray-200 mt-6">
                    <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Retour
                    </button>

                    {/* Bouton Enregistrer comme brouillon - HORS DU FORMULAIRE */}
                    <div onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        // Utiliser setTimeout pour s'assurer que cette action
                        // s'exécute après la gestion de l'événement actuel
                        setTimeout(() => handleSaveAsDraft(e as any), 0);

                        // Empêcher la propagation vers le formulaire
                        return false;
                    }}>
                        <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                        >
                            Enregistrer comme brouillon
                        </button>
                    </div>

                    <button
                        type="button" // Changé de "submit" à "button" pour éviter la soumission automatique du formulaire
                        onClick={handleSubmit}
                        disabled={processing}
                        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                        {processing ? 'Enregistrement...' : (
                            isEditing ? (
                                collecte?.type_collecte === 'brouillon' ? 'Enregistrer comme standard' : 'Mettre à jour'
                            ) : 'Enregistrer'
                        )}
                    </button>
                </div>
            </>
        ) : (
            <div className="text-center py-10">
                <p className="text-gray-500 mb-4">
                    Aucune catégorie d'indicateurs disponible pour la période sélectionnée.
                </p>
                <div className="flex justify-center space-x-4">
                    {/* Même correction pour ce bouton */}
                    <div onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setTimeout(() => handleSaveAsDraft(e as any), 0);
                        return false;
                    }}>
                        <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                        >
                            Enregistrer comme brouillon
                        </button>
                    </div>

                    {isEditing && collecte?.type_collecte === 'brouillon' && (
                        <div className="bg-amber-100 px-4 py-2 rounded-md">
                            <p className="text-amber-800">
                                Cette collecte est en mode brouillon.
                                Vous pouvez l'enregistrer comme une collecte standard en cliquant sur "Enregistrer".
                            </p>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Retour
                    </button>
                </div>
            </div>
        )}
    </div>
)}
                </form>
            </div>
        </div>
    );
};

export default CollecteForm;
