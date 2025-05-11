

import React, { useEffect, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';

interface OngFormModalProps {
    isOpen: boolean;
    closeModal: () => void;
    onSuccess: () => void; // Fonction pour mettre à jour la liste sans rafraîchir la page

    ong?: {
        id?: number;
        nom: string;
        description: string;
        adresse: string;
    } | null;
}

const OngFormModal = ({ isOpen, closeModal, onSuccess, ong }: OngFormModalProps) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, put, errors, processing, reset } = useForm({
        nom: '',
        description: '',
        adresse: '',
    });

    useEffect(() => {
        if (ong) {
            setData({
                nom: ong.nom || '',
                description: ong.description || '',
                adresse: ong.adresse || '',
            });
        } else {
            reset();
        }

        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [ong, isOpen, reset, setData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const successMessage = ong?.id ? "ONG mise à jour avec succès." : "ONG ajoutée avec succès.";
        const errorMessage = ong?.id ? "Échec de la mise à jour de l'ONG." : "Échec d'ajout de l'ONG.";

        if (ong?.id) {
            put(route('ong.update', ong.id), {
                onSuccess: () => {
                    toast.success(successMessage);
                    closeModal();
                    reset();
                    onSuccess(); // Appel de la fonction onSuccess passée en prop
                },
                onError: () => {
                    toast.error(errorMessage);
                }
            });
        } else {
            post(route('ong.store'), {
                onSuccess: () => {
                    toast.success(successMessage);
                    closeModal();
                    reset();
                    onSuccess(); // Appel de la fonction onSuccess passée en prop
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
                                {ong?.id ? 'Modifier une ONG' : 'Ajouter une ONG'}
                            </Dialog.Title>

                            <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 gap-4">
                                {/* Nom */}
                                <div>
                                    <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                                        Nom de l'ONG
                                    </label>
                                    <input
                                        type="text"
                                        id="nom"
                                        ref={inputRef}
                                        value={data.nom}
                                        onChange={(e) => setData('nom', e.target.value)}
                                        className="mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                                    />
                                    {errors.nom && <span className="text-red-500 text-sm">{errors.nom}</span>}
                                </div>

                                {/* Description */}
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                        Description
                                    </label>
                                    <input
                                        type="text"
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className="mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                                    />
                                    {errors.description && <span className="text-red-500 text-sm">{errors.description}</span>}
                                </div>

                                {/* Adresse */}
                                <div>
                                    <label htmlFor="adresse" className="block text-sm font-medium text-gray-700">
                                        Adresse
                                    </label>
                                    <input
                                        type="text"
                                        id="adresse"
                                        value={data.adresse}
                                        onChange={(e) => setData('adresse', e.target.value)}
                                        className="mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                                    />
                                    {errors.adresse && <span className="text-red-500 text-sm">{errors.adresse}</span>}
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

export default OngFormModal;
