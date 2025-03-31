import React, { useEffect, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { X } from 'lucide-react';

// Interfaces
interface IndicatorField {
    id: number;
    name: string;
    label: string;
    type: string;
    required: boolean;
    default_value?: any;
    options?: Record<string, string>;
}

interface Frequence {
    id: number;
    nom: string;
    code: string;
}

interface Indicateur {
    id: number;
    nom: string;
    type: any;
    fields: IndicatorField[];
}

interface Entreprise {
    id: number;
    nom_entreprise: string;
}

interface Collecte {
    id: number;
    entreprise_id: number;
    frequence_id: number | null;
    indicateur_id: number;
    date_collecte: string;
    collectable_type?: string;
    collectable_id?: number;
    data?: Record<string, any>;
    status?: string;
    frequence?: Frequence;
    indicateur?: Indicateur;
    created_at?: string;
    updated_at?: string;
}

interface ModalCollecteProps {
    isOpen: boolean;
    closeModal: () => void;
    collecte: Collecte | null;
    frequences: Frequence[];
    indicateurs: Indicateur[];
    entreprises: Entreprise[];
    onSuccess: () => void;
}

const ModalCollecte = ({
    isOpen,
    closeModal,
    collecte,
    frequences,
    indicateurs,
    entreprises,
    onSuccess,
}: ModalCollecteProps) => {
    const [selectedIndicateur, setSelectedIndicateur] = useState<Indicateur | null>(null);
    const indicateurRef = useRef<HTMLSelectElement>(null);

    // Helper function to render dynamic fields
    const renderField = (field: IndicatorField) => {
        switch (field.type) {
            case 'text':
                return (
                    <input
                        type="text"
                        id={`field-${field.id}`}
                        value={data.dynamicFields[field.id] || ''}
                        onChange={(e) => handleDynamicFieldChange(field.id, e.target.value)}
                        className="mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                        required={field.required}
                    />
                );
            case 'number':
                return (
                    <input
                        type="number"
                        id={`field-${field.id}`}
                        value={data.dynamicFields[field.id] || ''}
                        onChange={(e) => handleDynamicFieldChange(field.id, e.target.value)}
                        className="mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                        required={field.required}
                    />
                );
            case 'select':
                return (
                    <select
                        id={`field-${field.id}`}
                        value={data.dynamicFields[field.id] || ''}
                        onChange={(e) => handleDynamicFieldChange(field.id, e.target.value)}
                        className="mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                        required={field.required}
                    >
                        <option value="">Sélectionnez une option</option>
                        {field.options &&
                            Object.entries(field.options).map(([key, value]) => (
                                <option key={key} value={key}>
                                    {value}
                                </option>
                            ))}
                    </select>
                );
            case 'date':
                return (
                    <input
                        type="date"
                        id={`field-${field.id}`}
                        value={data.dynamicFields[field.id] || ''}
                        onChange={(e) => handleDynamicFieldChange(field.id, e.target.value)}
                        className="mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                        required={field.required}
                    />
                );
            default:
                return null;
        }
    };

    // Initialize form data with dynamic fields
    const { data, setData, post, put, errors, processing, reset } = useForm({
        entreprise_id: '',
        indicateur_id: '',
        frequence_id: '',
        date_collecte: new Date().toISOString().split('T')[0],
        dynamicFields: {} as Record<string, any>,
    });

    useEffect(() => {
        if (collecte) {
            console.log("Indicateurs reçus:", indicateurs);
            setData({
                entreprise_id: String(collecte.entreprise_id || ''),
                indicateur_id: String(collecte.indicateur_id || ''),
                frequence_id: collecte.frequence_id ? String(collecte.frequence_id) : '',
                date_collecte: collecte.date_collecte || new Date().toISOString().split('T')[0],
                dynamicFields: collecte.data || {},
            });
            const indicateur = indicateurs.find((ind) => ind.id === collecte.indicateur_id);
            setSelectedIndicateur(indicateur || null);
        } else {
            reset();
            setSelectedIndicateur(null);
        }
        if (isOpen && indicateurRef.current) {
            setTimeout(() => indicateurRef.current?.focus(), 100);
        }
    }, [collecte, isOpen, indicateurs, reset, setData]);

    const handleIndicateurChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const indicateurId = parseInt(e.target.value);
        setData('indicateur_id', e.target.value);
    
        const indicateur = indicateurs.find((ind) => ind.id === indicateurId);
        setSelectedIndicateur(indicateur || null);
    
        // Initialize dynamic fields with default values if available
        if (indicateur && indicateur.fields) {
            const initialDynamicFields = { ...data.dynamicFields };
            indicateur.fields.forEach(field => {
                if (field.default_value !== undefined && !initialDynamicFields[field.id]) {
                    initialDynamicFields[field.id] = field.default_value;
                }
            });
            setData('dynamicFields', initialDynamicFields);
        } else {
            console.warn("L'indicateur sélectionné n'a pas de champs définis");
        }
    };

    const handleDynamicFieldChange = (fieldId: number, value: any) => {
        setData('dynamicFields', {
            ...data.dynamicFields,
            [fieldId]: value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation des champs dynamiques requis
        let hasError = false;
        if (selectedIndicateur) {
            selectedIndicateur.fields.forEach(field => {
                if (field.required && (!data.dynamicFields[field.id] || data.dynamicFields[field.id] === '')) {
                    toast.error(`Le champ "${field.label}" est requis.`);
                    hasError = true;
                }
            });
        }

        if (hasError) return;

        const successMessage = collecte?.id
            ? "Collecte mise à jour avec succès."
            : "Collecte ajoutée avec succès.";
        const errorMessage = collecte?.id
            ? "Échec de la mise à jour de la collecte."
            : "Échec d'ajout de la collecte.";

        if (collecte?.id) {
            put(route('DataCollections.update', collecte.id), {
                onSuccess: () => {
                    toast.success(successMessage);
                    closeModal();
                    reset();
                    onSuccess();
                },
                onError: (errors) => {
                    console.error(errors);
                    toast.error(errorMessage);
                },
            });
        } else {
            post(route('DataCollections.store'), {
                onSuccess: () => {
                    toast.success(successMessage);
                    closeModal();
                    reset();
                    onSuccess();
                },
                onError: (errors) => {
                    console.error(errors);
                    toast.error(errorMessage);
                },
            });
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={closeModal}>
                <div className="min-h-screen px-4 text-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Panel className="fixed inset-0 bg-black bg-opacity-30" />
                    </Transition.Child>
                    <span className="inline-block h-screen align-middle" aria-hidden="true">
                        &#8203;
                    </span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
                            <div className="flex justify-between items-center">
                                <Dialog.Title className="text-lg font-medium text-gray-900">
                                    {collecte?.id ? 'Modifier une collecte' : 'Ajouter une collecte'}
                                </Dialog.Title>
                                <button onClick={closeModal} className="text-gray-400 hover:text-gray-500">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 gap-4">
                                {/* Entreprise */}
                                <div>
                                    <label htmlFor="entreprise_id" className="block text-sm font-medium text-gray-700">
                                        Entreprise <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="entreprise_id"
                                        value={data.entreprise_id}
                                        onChange={(e) => setData('entreprise_id', e.target.value)}
                                        className="mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                                        required
                                    >
                                        <option value="">Sélectionnez une entreprise</option>
                                        {entreprises.map((entreprise) => (
                                            <option key={entreprise.id} value={entreprise.id}>
                                                {entreprise.nom_entreprise}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.entreprise_id && (
                                        <span className="text-red-500 text-sm">{errors.entreprise_id}</span>
                                    )}
                                </div>

                                {/* Indicateur */}
                                <div>
                                    <label htmlFor="indicateur_id" className="block text-sm font-medium text-gray-700">
                                        Indicateur <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="indicateur_id"
                                        ref={indicateurRef}
                                        value={data.indicateur_id}
                                        onChange={handleIndicateurChange}
                                        className="mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                                        required
                                    >
                                        <option value="">Sélectionnez un indicateur</option>
                                        {indicateurs.map((indicateur) => (
                                            <option key={indicateur.id} value={indicateur.id}>
                                                {indicateur.nom}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.indicateur_id && (
                                        <span className="text-red-500 text-sm">{errors.indicateur_id}</span>
                                    )}
                                </div>

                                {/* Dynamic Fields */}
                                {selectedIndicateur && selectedIndicateur.fields && selectedIndicateur.fields.length > 0 && (
                                    <div className="border-t pt-4 mt-2">
                                        <h3 className="text-md font-medium text-gray-900 mb-2">Champs dynamiques</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {selectedIndicateur.fields.map((field) => (
                                                <div key={field.id} className="mb-2">
                                                    <label
                                                        htmlFor={`field-${field.id}`}
                                                        className="block text-sm font-medium text-gray-700"
                                                    >
                                                        {field.label}
                                                        {field.required && <span className="text-red-500">*</span>}
                                                    </label>
                                                    {renderField(field)}
                                                    {errors[`dynamicFields.${field.id}`] && (
                                                        <span className="text-red-500 text-sm">
                                                            {errors[`dynamicFields.${field.id}`]}
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                
                                {/* Date de collecte */}
                                <div>
                                    <label htmlFor="date_collecte" className="block text-sm font-medium text-gray-700">
                                        Date de collecte <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        id="date_collecte"
                                        value={data.date_collecte}
                                        onChange={(e) => setData('date_collecte', e.target.value)}
                                        className="mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                                        required
                                    />
                                    {errors.date_collecte && (
                                        <span className="text-red-500 text-sm">{errors.date_collecte}</span>
                                    )}
                                </div>

                                {/* Fréquence */}
                                <div>
                                    <label htmlFor="frequence_id" className="block text-sm font-medium text-gray-700">
                                        Fréquence
                                    </label>
                                    <select
                                        id="frequence_id"
                                        value={data.frequence_id}
                                        onChange={(e) => setData('frequence_id', e.target.value)}
                                        className="mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                                    >
                                        <option value="">Sélectionnez une fréquence</option>
                                        {frequences.map((frequence) => (
                                            <option key={frequence.id} value={frequence.id}>
                                                {frequence.nom}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.frequence_id && (
                                        <span className="text-red-500 text-sm">{errors.frequence_id}</span>
                                    )}
                                </div>

                                {/* Boutons */}
                                <div className="mt-6 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md mr-2 hover:bg-gray-300"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-300"
                                    >
                                        {processing ? 'Enregistrement...' : 'Enregistrer'}
                                    </button>
                                </div>
                            </form>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};

export default ModalCollecte;
