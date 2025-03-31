import React, { useEffect, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';

interface IndicateurFormModalProps {
    isOpen: boolean;
    closeModal: () => void;
    onSuccess: () => void;
    indicateur?: {
        id?: number;
        nom: string;
        code: string;
        categorie: string;
        description: string;
    } | null;
    entreprises: Array<{ id: number; name: string }>;
}

const IndicateurFormModal = ({ isOpen, closeModal, onSuccess, indicateur }: IndicateurFormModalProps) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, put, errors, processing, reset } = useForm({
        nom: '',
        code: '',
        categorie: '',
        description: '',
        entreprise_id: '',
    });

    useEffect(() => {
        if (indicateur) {
            setData({
                nom: indicateur.nom || '',
                code: indicateur.code || '',
                categorie: indicateur.categorie || '',
                description: indicateur.description || '',
            });
        } else {
            reset();
        }

        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [indicateur, isOpen, reset, setData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const successMessage = indicateur?.id ? "Indicateur mis à jour avec succès." : "Indicateur ajouté avec succès.";
        const errorMessage = indicateur?.id ? "Échec de la mise à jour de l'indicateur." : "Échec d'ajout de l'indicateur.";

        if (indicateur?.id) {
            put(route('Indicateurs.update', indicateur.id), {
                onSuccess: () => {
                    toast.success(successMessage);
                    closeModal();
                    reset();
                    onSuccess();
                },
                onError: () => {
                    toast.error(errorMessage);
                }
            });
        } else {
            post(route('Indicateurs.store'), {
                onSuccess: () => {
                    toast.success(successMessage);
                    closeModal();
                    reset();
                    onSuccess();
                },
                onError: () => {
                    toast.error(errorMessage);
                }
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
                            <Dialog.Title className="text-lg font-medium text-gray-900">
                                {indicateur?.id ? 'Modifier un Indicateur' : 'Ajouter un Indicateur'}
                            </Dialog.Title>

                            <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 gap-4">
                                {/* Nom */}
                                <div>
                                    <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                                        Nom de l'indicateur
                                    </label>
                                    <input
                                        type="text"
                                        id="nom"
                                        ref={inputRef}
                                        value={data.nom}
                                        onChange={(e) => setData('nom', e.target.value)}
                                        className="mt-1 p-2 w-full border rounded-md"
                                    />
                                    {errors.nom && <span className="text-red-500 text-sm">{errors.nom}</span>}
                                </div>

                                {/* Code */}
                                <div>
                                    <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                                        Code
                                    </label>
                                    <input
                                        type="text"
                                        id="code"
                                        value={data.code}
                                        onChange={(e) => setData('code', e.target.value)}
                                        className="mt-1 p-2 w-full border rounded-md"
                                    />
                                    {errors.code && <span className="text-red-500 text-sm">{errors.code}</span>}
                                </div>

                                {/* Catégorie */}
                                <div>
                                    <label htmlFor="categorie" className="block text-sm font-medium text-gray-700">
                                        Catégorie
                                    </label>
                                    <input
                                        type="text"
                                        id="categorie"
                                        value={data.categorie}
                                        onChange={(e) => setData('categorie', e.target.value)}
                                        className="mt-1 p-2 w-full border rounded-md"
                                    />
                                    {errors.categorie && <span className="text-red-500 text-sm">{errors.categorie}</span>}
                                </div>

                                {/* Description */}
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className="mt-1 p-2 w-full border rounded-md"
                                    />
                                    {errors.description && <span className="text-red-500 text-sm">{errors.description}</span>}
                                </div>


                                {/* Boutons */}
                                <div className="mt-6 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md mr-2"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md disabled:bg-gray-300"
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

export default IndicateurFormModal;
