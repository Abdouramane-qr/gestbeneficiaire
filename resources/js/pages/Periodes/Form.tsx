import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface PeriodeFormProps {
    exercices: Array<{
        id: number;
        annee: number;
    }>;
    typesPeriodes: {
        [key: string]: string;
    };
    periode?: {
        id: number;
        exercice_id: number;
        code: string;
        nom: string;
        type_periode: string;
        numero: number;
        date_debut: string;
        date_fin: string;
        cloturee: boolean;
    };
}

export default function Form({ exercices, typesPeriodes, periode }: PeriodeFormProps) {
    const { data, setData, post, put, processing, errors } = useForm({
        exercice_id: periode?.exercice_id || '',
        code: periode?.code || '',
        nom: periode?.nom || '',
        type_periode: periode?.type_periode || '',
        numero: periode?.numero || 1,
        date_debut: periode?.date_debut || '',
        date_fin: periode?.date_fin || '',
    });

    const isEdit = !!periode;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit) {
            put(route('periodes.update', periode.id), {
                preserveScroll: true
            });
        } else {
            post(route('periodes.store'), {
                preserveScroll: true
            });
        }
    };

    return (
        <AppLayout>
            <Head title={isEdit ? 'Modifier une période' : 'Créer une période'} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900">
                            {isEdit ? 'Modifier une période' : 'Créer une période'}
                        </h1>

                        <a
                            href={route('periodes.index')}
                            className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition"
                        >
                            Retour
                        </a>
                    </div>

                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg p-6">
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {!isEdit && (
                                    <div className="col-span-1">
                                        <label htmlFor="exercice_id" className="block text-sm font-medium text-gray-700">
                                            Exercice
                                        </label>
                                        <select
                                            id="exercice_id"
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            value={data.exercice_id}
                                            onChange={(e) => setData('exercice_id', e.target.value)}
                                            disabled={isEdit}
                                        >
                                            <option value="">Sélectionner un exercice</option>
                                            {exercices.map((exercice) => (
                                                <option key={exercice.id} value={exercice.id}>
                                                    {exercice.annee}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.exercice_id && (
                                            <p className="mt-1 text-sm text-red-600">{errors.exercice_id}</p>
                                        )}
                                    </div>
                                )}

                                {isEdit && (
                                    <div className="col-span-1">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Exercice
                                        </label>
                                        <div className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md">
                                            {exercices.find(e => e.id === periode.exercice_id)?.annee}
                                        </div>
                                    </div>
                                )}

                                <div className="col-span-1">
                                    <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                                        Code
                                    </label>
                                    <input
                                        type="text"
                                        id="code"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        value={data.code}
                                        onChange={(e) => setData('code', e.target.value)}
                                    />
                                    {errors.code && (
                                        <p className="mt-1 text-sm text-red-600">{errors.code}</p>
                                    )}
                                </div>

                                <div className="col-span-1">
                                    <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                                        Nom
                                    </label>
                                    <input
                                        type="text"
                                        id="nom"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        value={data.nom}
                                        onChange={(e) => setData('nom', e.target.value)}
                                    />
                                    {errors.nom && (
                                        <p className="mt-1 text-sm text-red-600">{errors.nom}</p>
                                    )}
                                </div>

                                {!isEdit && (
                                    <>
                                        <div className="col-span-1">
                                            <label htmlFor="type_periode" className="block text-sm font-medium text-gray-700">
                                                Type de période
                                            </label>
                                            <select
                                                id="type_periode"
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                value={data.type_periode}
                                                onChange={(e) => setData('type_periode', e.target.value)}
                                            >
                                                <option value="">Sélectionner un type</option>
                                                {Object.entries(typesPeriodes).map(([value, label]) => (
                                                    <option key={value} value={value}>
                                                        {label}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.type_periode && (
                                                <p className="mt-1 text-sm text-red-600">{errors.type_periode}</p>
                                            )}
                                        </div>

                                        <div className="col-span-1">
                                            <label htmlFor="numero" className="block text-sm font-medium text-gray-700">
                                                Numéro
                                            </label>
                                            <input
                                                type="number"
                                                id="numero"
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                value={data.numero}
                                                onChange={(e) => setData('numero', Number(e.target.value))}
                                                min="1"
                                            />
                                            {errors.numero && (
                                                <p className="mt-1 text-sm text-red-600">{errors.numero}</p>
                                            )}
                                        </div>
                                    </>
                                )}

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
                                    href={route('periodes.index')}
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
