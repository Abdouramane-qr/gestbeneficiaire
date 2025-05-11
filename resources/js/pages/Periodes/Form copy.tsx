import React, { useState, useEffect } from 'react';
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
    periodesExistantes?: Array<{
        id: number;
        type_periode: string;
        numero: number;
        nom: string;
    }>;
}

export default function Form({ exercices, typesPeriodes, periode, periodesExistantes = [] }: PeriodeFormProps) {
    const [moisOptions, setMoisOptions] = useState<{ value: string; label: string; disabled: boolean }[]>([]);
    const [selectedType, setSelectedType] = useState<string>(periode?.type_periode || '');
    const [numeroOptions, setNumeroOptions] = useState<{ value: number; label: string; disabled: boolean }[]>([]);

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

    // Liste des mois en français
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const moisFrancais = [
        { value: "janvier", label: "Janvier" },
        { value: "fevrier", label: "Février" },
        { value: "mars", label: "Mars" },
        { value: "avril", label: "Avril" },
        { value: "mai", label: "Mai" },
        { value: "juin", label: "Juin" },
        { value: "juillet", label: "Juillet" },
        { value: "aout", label: "Août" },
        { value: "septembre", label: "Septembre" },
        { value: "octobre", label: "Octobre" },
        { value: "novembre", label: "Novembre" },
        { value: "decembre", label: "Décembre" }
    ];

    // Mettre à jour les options de mois disponibles quand le type de période ou l'exercice change
    useEffect(() => {
        if (data.type_periode === 'mensuel' && data.exercice_id) {
            const moisUtilises = periodesExistantes
                .filter(p => p.type_periode === 'mensuel' && (!isEdit || p.id !== periode?.id))
                .map(p => p.nom.toLowerCase());

            const options = moisFrancais.map(mois => ({
                ...mois,
                disabled: moisUtilises.includes(mois.value.toLowerCase())
            }));

            setMoisOptions(options);
        }
    }, [data.type_periode, data.exercice_id, periodesExistantes]);

    // Mettre à jour les options de numéro quand le type de période change
    useEffect(() => {
        if (data.type_periode && data.exercice_id) {
            const numeroUtilises = periodesExistantes
                .filter(p => p.type_periode === data.type_periode && (!isEdit || p.id !== periode?.id))
                .map(p => p.numero);

            let maxNumero = 0;

            // Définir le nombre maximum d'options selon le type de période
            switch(data.type_periode) {
                case 'mensuel':
                    maxNumero = 12;
                    break;
                case 'trimestriel':
                    maxNumero = 4;
                    break;
                case 'semestriel':
                    maxNumero = 2;
                    break;
                case 'annuel':
                    maxNumero = 1;
                    break;
                default:
                    maxNumero = 0;
            }

            const options = Array.from({length: maxNumero}, (_, i) => i + 1).map(num => ({
                value: num,
                label: num.toString(),
                disabled: numeroUtilises.includes(num)
            }));

            setNumeroOptions(options);
        }
    }, [data.type_periode, data.exercice_id, periodesExistantes, isEdit, periode?.id]);

    // Définir automatiquement le nom de la période pour les périodes mensuelles
    useEffect(() => {
        if (data.type_periode === 'mensuel' && data.numero) {
            const moisIndex = (data.numero as number) - 1;
            if (moisIndex >= 0 && moisIndex < 12) {
                setData('nom', moisFrancais[moisIndex].label);
            }
        }
    }, [data.type_periode, data.numero, setData, moisFrancais]);

    // Définir automatiquement le code de la période
    useEffect(() => {
        if (data.type_periode && data.numero && !isEdit) {
            let prefix = '';
            switch(data.type_periode) {
                case 'mensuel':
                    prefix = 'M';
                    break;
                case 'trimestriel':
                    prefix = 'T';
                    break;
                case 'semestriel':
                    prefix = 'S';
                    break;
                case 'annuel':
                    prefix = 'A';
                    break;
            }

            const exercice = exercices.find(e => e.id.toString() === data.exercice_id.toString());
            const annee = exercice ? exercice.annee.toString().slice(-2) : '';

            setData('code', `${prefix}${data.numero}/${annee}`);
        }
    }, [data.type_periode, data.numero, data.exercice_id, isEdit, exercices, setData]);

    // Définir automatiquement les dates de début et fin
    useEffect(() => {
        if (data.exercice_id && data.type_periode && data.numero && !isEdit) {
            const exercice = exercices.find(e => e.id.toString() === data.exercice_id.toString());
            if (!exercice) return;

            // Créer une date à partir de l'année de l'exercice
            const annee = exercice.annee;
            let dateDebut = new Date(annee, 0, 1); // 1er janvier de l'année
            let dateFin = new Date(annee, 11, 31); // 31 décembre de l'année

            switch(data.type_periode) {
                case 'mensuel':
                    // Mois: de 1 à 12
                    dateDebut = new Date(annee, (data.numero as number) - 1, 1);
                    dateFin = new Date(annee, (data.numero as number), 0); // Dernier jour du mois
                    break;
                case 'trimestriel':
                    // Trimestre: de 1 à 4
                    dateDebut = new Date(annee, (data.numero as number - 1) * 3, 1);
                    dateFin = new Date(annee, (data.numero as number) * 3, 0);
                    break;
                case 'semestriel':
                    // Semestre: de 1 à 2
                    dateDebut = new Date(annee, (data.numero as number - 1) * 6, 1);
                    dateFin = new Date(annee, (data.numero as number) * 6, 0);
                    break;
                case 'annuel':
                    // Année: généralement 1 seule période
                    dateDebut = new Date(annee, 0, 1);
                    dateFin = new Date(annee, 11, 31);
                    break;
            }

            // Formatage des dates pour input type="date"
            const formatDate = (date: Date) => {
                return date.toISOString().split('T')[0];
            };

            setData('date_debut', formatDate(dateDebut));
            setData('date_fin', formatDate(dateFin));
        }
    }, [data.exercice_id, data.type_periode, data.numero, isEdit, exercices, setData]);

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
        <AppLayout title='Forme Periode'>
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
                                                onChange={(e) => {
                                                    setData('type_periode', e.target.value);
                                                    setSelectedType(e.target.value);
                                                    // Réinitialiser le numéro pour éviter des valeurs invalides
                                                    setData('numero', 1);
                                                }}
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
                                            <select
                                                id="numero"
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                value={data.numero}
                                                onChange={(e) => setData('numero', Number(e.target.value))}
                                                disabled={!data.type_periode || numeroOptions.length === 0}
                                            >
                                                <option value="">Sélectionner un numéro</option>
                                                {numeroOptions.map((option) => (
                                                    <option
                                                        key={option.value}
                                                        value={option.value}
                                                        disabled={option.disabled}
                                                    >
                                                        {option.label} {option.disabled ? '(déjà utilisé)' : ''}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.numero && (
                                                <p className="mt-1 text-sm text-red-600">{errors.numero}</p>
                                            )}
                                        </div>

                                        <div className="col-span-1">
                                            <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                                                Nom de la période
                                            </label>
                                            {data.type_periode === 'mensuel' ? (
                                                <div className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md">
                                                    {data.nom || "Sélectionnez un mois"}
                                                </div>
                                            ) : (
                                                <input
                                                    type="text"
                                                    id="nom"
                                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    value={data.nom}
                                                    onChange={(e) => setData('nom', e.target.value)}
                                                    placeholder={getDefaultNomPeriode(data.type_periode, data.numero)}
                                                />
                                            )}
                                            {errors.nom && (
                                                <p className="mt-1 text-sm text-red-600">{errors.nom}</p>
                                            )}
                                        </div>
                                    </>
                                )}

                                {isEdit && (
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

// Fonction pour générer un nom par défaut selon le type et le numéro de période
function getDefaultNomPeriode(typePeriode: string | number, numero: string | number): string {
    if (!typePeriode || !numero) return '';

    switch(typePeriode) {
        case 'trimestriel':
            return `Trimestre ${numero}`;
        case 'semestriel':
            return `Semestre ${numero}`;
        case 'annuel':
            return 'Année complète';
        default:
            return '';
    }
}
