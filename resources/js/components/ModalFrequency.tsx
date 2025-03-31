// import React, { useEffect, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useRef } from 'react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';

interface FrequenceFormModalProps {
    isOpen: boolean;
    closeModal: () => void;
    onSuccess: () => void;
    frequence?: {
        id?: number;
        nom: string;
        code: string;
        days_interval: number;
        date_debut: string;
        date_fin: string;
    } | null;
}

const FrequenceFormModal = ({ isOpen, closeModal, onSuccess, frequence }: FrequenceFormModalProps) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, put, errors, processing, reset } = useForm({
        nom: '',
        code: '',
        days_interval: 0,
        date_debut: '',
        date_fin: '',
    });

    useEffect(() => {
        if (frequence) {
            setData({
                nom: frequence.nom || '',
                code: frequence.code || '',
                days_interval: frequence.days_interval || 0,
                date_debut: frequence.date_debut || '',
                date_fin: frequence.date_fin || '',
            });
        } else {
            reset();
        }

        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [frequence, isOpen, reset, setData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const successMessage = frequence?.id ? "Fréquence mise à jour avec succès." : "Fréquence ajoutée avec succès.";
        const errorMessage = frequence?.id ? "Échec de la mise à jour de la fréquence." : "Échec d'ajout de la fréquence.";

        if (frequence?.id) {
            put(route('Frequencies.update', frequence.id), {
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
            post(route('Frequencies.store'), {
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
                                {frequence?.id ? 'Modifier une Fréquence' : 'Ajouter une Fréquence'}
                            </Dialog.Title>

                            <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 gap-4">
                                {/* Nom */}
                                <div>
                                    <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                                        Nom de la Fréquence
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

                                {/* Interval de jours */}
                                <div>
                                    <label htmlFor="days_interval" className="block text-sm font-medium text-gray-700">
                                        Interval de jours
                                    </label>
                                    <input
                                        type="number"
                                        id="days_interval"
                                        value={data.days_interval}
                                        onChange={(e) => setData('days_interval', +e.target.value)}
                                        className="mt-1 p-2 w-full border rounded-md"
                                    />
                                    {errors.days_interval && <span className="text-red-500 text-sm">{errors.days_interval}</span>}
                                </div>

                                {/* Date de début */}
                                <div>
                                    <label htmlFor="date_debut" className="block text-sm font-medium text-gray-700">
                                        Date de début
                                    </label>
                                    <input
                                        type="date"
                                        id="date_debut"
                                        value={data.date_debut}
                                        onChange={(e) => setData('date_debut', e.target.value)}
                                        className="mt-1 p-2 w-full border rounded-md"
                                    />
                                    {errors.date_debut && <span className="text-red-500 text-sm">{errors.date_debut}</span>}
                                </div>

                                {/* Date de fin */}
                                <div>
                                    <label htmlFor="date_fin" className="block text-sm font-medium text-gray-700">
                                        Date de fin
                                    </label>
                                    <input
                                        type="date"
                                        id="date_fin"
                                        value={data.date_fin}
                                        onChange={(e) => setData('date_fin', e.target.value)}
                                        className="mt-1 p-2 w-full border rounded-md"
                                    />
                                    {errors.date_fin && <span className="text-red-500 text-sm">{errors.date_fin}</span>}
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

export default FrequenceFormModal;
