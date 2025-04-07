import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface ExerciceFormProps {
    exercice?: {
        id: number;
        annee: number;
        date_debut: string;
        date_fin: string;
        description: string | null;
        actif: boolean;
    };
}

export default function Form({ exercice }: ExerciceFormProps) {
    const { data, setData, post, put, processing, errors } = useForm({
        annee: exercice?.annee || new Date().getFullYear(),
        date_debut: exercice?.date_debut || '',
        date_fin: exercice?.date_fin || '',
        description: exercice?.description || '',
    });

    const isEdit = !!exercice;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit) {
            put(route('exercices.update', exercice.id), {
                preserveScroll: true
            });
        } else {
            post(route('exercices.store'), {
                preserveScroll: true
            });
        }
    };

    return (
        <AppLayout>
            <Head title={isEdit ? 'Modifier un exercice' : 'Créer un exercice'} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900">
                            {isEdit ? 'Modifier un exercice' : 'Créer un exercice'}
                        </h1>

                        <a
                            href={route('exercices.index')}
                            className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition"
                        >
                            Retour
                        </a>
                    </div>

                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg p-6">
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-1">
                                    <label htmlFor="annee" className="block text-sm font-medium text-gray-700">
                                        Année
                                    </label>
                                    <input
                                        type="number"
                                        id="annee"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        value={data.annee}
                                        onChange={(e) => setData('annee', Number(e.target.value))}
                                        min="2000"
                                        max="2100"
                                    />
                                    {errors.annee && (
                                        <p className="mt-1 text-sm text-red-600">{errors.annee}</p>
                                    )}
                                </div>

                                <div className="col-span-1 md:col-span-2">
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                        Description (optionnelle)
                                    </label>
                                    <textarea
                                        id="description"
                                        rows={3}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                                    )}
                                </div>

                                <div className="col-span-1">
                                    <label htmlFor="date_debut" className="block text-sm font-medium text-gray-700">
                                        Date de début
                                    </label>
                                    <input
                                        type="date"
                                        id="date_debut"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        value={data.date_debut}
                                        onChange={(e) => setData('date_debut', e.target.value)}
                                    />
                                    {errors.date_debut && (
                                        <p className="mt-1 text-sm text-red-600">{errors.date_debut}</p>
                                    )}
                                </div>

                                <div className="col-span-1">
                                    <label htmlFor="date_fin" className="block text-sm font-medium text-gray-700">
                                        Date de fin
                                    </label>
                                    <input
                                        type="date"
                                        id="date_fin"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        value={data.date_fin}
                                        onChange={(e) => setData('date_fin', e.target.value)}
                                    />
                                    {errors.date_fin && (
                                        <p className="mt-1 text-sm text-red-600">{errors.date_fin}</p>
                                    )}
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <a
                                    href={route('exercices.index')}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
                                >
                                    Annuler
                                </a>
                                <button
                                    type="submit"
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    disabled={processing}
                                >
                                    {isEdit ? 'Mettre à jour' : 'Créer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
