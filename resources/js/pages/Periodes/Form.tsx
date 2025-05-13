// import AppLayout from '@/layouts/app-layout';
// import { Head, useForm } from '@inertiajs/react';
// import React, { useEffect, useState } from 'react';

// interface PeriodeFormProps {
//     exercices: Array<{
//         id: number;
//         annee: number;
//     }>;
//     typesPeriodes: {
//         [key: string]: string;
//     };
//     periode?: {
//         id: number;
//         exercice_id: number;
//         code: string;
//         nom: string;
//         type_periode: string;
//         numero: number;
//         date_debut: string;
//         date_fin: string;
//         cloturee: boolean;
//     };
//     periodesExistantes?: Array<{
//         id: number;
//         exercice_id: number;
//         type_periode: string;
//         numero: number;
//         nom: string;
//     }>;
// }

// export default function Form({ exercices, typesPeriodes, periode, periodesExistantes = [] }: PeriodeFormProps) {
//     const [numeroOptions, setNumeroOptions] = useState<{ value: number; label: string; disabled: boolean; tooltip?: string }[]>([]);
//     const [infoMessage, setInfoMessage] = useState<string>('');

//     const { data, setData, post, put, processing, errors } = useForm({
//         exercice_id: periode?.exercice_id || '',
//         code: periode?.code || '',
//         nom: periode?.nom || '',
//         type_periode: periode?.type_periode || '',
//         numero: periode?.numero || 1,
//         date_debut: periode?.date_debut || '',
//         date_fin: periode?.date_fin || '',
//     });

//     const isEdit = !!periode;

//     // Mettre à jour les options de numéro quand le type de période ou l'exercice change
//     useEffect(() => {
//         if (data.type_periode && data.exercice_id) {
//             const exerciceSelectionne = exercices.find(e => e.id.toString() === data.exercice_id.toString());
//             const numeroUtilises = periodesExistantes
//                 .filter((p) =>
//                     p.exercice_id === Number(data.exercice_id) &&
//                     p.type_periode === data.type_periode &&
//                     (!isEdit || p.id !== periode?.id)
//                 )
//                 .map((p) => p.numero);

//             let options: { value: number; label: string; disabled: boolean; tooltip?: string }[] = [];
//             let message = '';

//             switch (data.type_periode) {
//                 case 'mensuel':
//                     options = [
//                         { value: 1, label: 'Janvier', disabled: numeroUtilises.includes(1), tooltip: numeroUtilises.includes(1) ? `Déjà utilisé en ${exerciceSelectionne?.annee}` : undefined },
//                         { value: 2, label: 'Février', disabled: numeroUtilises.includes(2), tooltip: numeroUtilises.includes(2) ? `Déjà utilisé en ${exerciceSelectionne?.annee}` : undefined },
//                         { value: 3, label: 'Mars', disabled: numeroUtilises.includes(3), tooltip: numeroUtilises.includes(3) ? `Déjà utilisé en ${exerciceSelectionne?.annee}` : undefined },
//                         { value: 4, label: 'Avril', disabled: numeroUtilises.includes(4), tooltip: numeroUtilises.includes(4) ? `Déjà utilisé en ${exerciceSelectionne?.annee}` : undefined },
//                         { value: 5, label: 'Mai', disabled: numeroUtilises.includes(5), tooltip: numeroUtilises.includes(5) ? `Déjà utilisé en ${exerciceSelectionne?.annee}` : undefined },
//                         { value: 6, label: 'Juin', disabled: numeroUtilises.includes(6), tooltip: numeroUtilises.includes(6) ? `Déjà utilisé en ${exerciceSelectionne?.annee}` : undefined },
//                         { value: 7, label: 'Juillet', disabled: numeroUtilises.includes(7), tooltip: numeroUtilises.includes(7) ? `Déjà utilisé en ${exerciceSelectionne?.annee}` : undefined },
//                         { value: 8, label: 'Août', disabled: numeroUtilises.includes(8), tooltip: numeroUtilises.includes(8) ? `Déjà utilisé en ${exerciceSelectionne?.annee}` : undefined },
//                         { value: 9, label: 'Septembre', disabled: numeroUtilises.includes(9), tooltip: numeroUtilises.includes(9) ? `Déjà utilisé en ${exerciceSelectionne?.annee}` : undefined },
//                         { value: 10, label: 'Octobre', disabled: numeroUtilises.includes(10), tooltip: numeroUtilises.includes(10) ? `Déjà utilisé en ${exerciceSelectionne?.annee}` : undefined },
//                         { value: 11, label: 'Novembre', disabled: numeroUtilises.includes(11), tooltip: numeroUtilises.includes(11) ? `Déjà utilisé en ${exerciceSelectionne?.annee}` : undefined },
//                         { value: 12, label: 'Décembre', disabled: numeroUtilises.includes(12), tooltip: numeroUtilises.includes(12) ? `Déjà utilisé en ${exerciceSelectionne?.annee}` : undefined },
//                     ];
//                     message = `Les mois déjà utilisés pour l'année ${exerciceSelectionne?.annee} sont désactivés. Ils seront à nouveau disponibles pour l'année suivante.`;
//                     break;
//                 case 'trimestriel':
//                     options = [
//                         { value: 1, label: '1er Trimestre', disabled: numeroUtilises.includes(1), tooltip: numeroUtilises.includes(1) ? `Déjà utilisé en ${exerciceSelectionne?.annee}` : undefined },
//                         { value: 2, label: '2e Trimestre', disabled: numeroUtilises.includes(2), tooltip: numeroUtilises.includes(2) ? `Déjà utilisé en ${exerciceSelectionne?.annee}` : undefined },
//                         { value: 3, label: '3e Trimestre', disabled: numeroUtilises.includes(3), tooltip: numeroUtilises.includes(3) ? `Déjà utilisé en ${exerciceSelectionne?.annee}` : undefined },
//                         { value: 4, label: '4e Trimestre', disabled: numeroUtilises.includes(4), tooltip: numeroUtilises.includes(4) ? `Déjà utilisé en ${exerciceSelectionne?.annee}` : undefined },
//                     ];
//                     message = `Les trimestres déjà utilisés pour l'année ${exerciceSelectionne?.annee} sont désactivés. Ils seront à nouveau disponibles pour l'année suivante.`;
//                     break;
//                 case 'semestriel':
//                     options = [
//                         { value: 1, label: '1er Semestre', disabled: numeroUtilises.includes(1), tooltip: numeroUtilises.includes(1) ? `Déjà utilisé en ${exerciceSelectionne?.annee}` : undefined },
//                         { value: 2, label: '2e Semestre', disabled: numeroUtilises.includes(2), tooltip: numeroUtilises.includes(2) ? `Déjà utilisé en ${exerciceSelectionne?.annee}` : undefined },
//                     ];
//                     message = `Les semestres déjà utilisés pour l'année ${exerciceSelectionne?.annee} sont désactivés. Ils seront à nouveau disponibles pour l'année suivante.`;
//                     break;
//                 case 'annuel':
//                     options = [{ value: 1, label: 'Année', disabled: numeroUtilises.includes(1), tooltip: numeroUtilises.includes(1) ? `Déjà utilisé en ${exerciceSelectionne?.année}` : undefined }];
//                     message = `Une seule période annuelle est autorisée par exercice. Elle sera à nouveau disponible pour l'année suivante.`;
//                     break;
//                 default:
//                     options = [];
//                     message = '';
//             }

//             setNumeroOptions(options);
//             setInfoMessage(message);
//         }
//     }, [data.type_periode, data.exercice_id, periodesExistantes, exercices, isEdit, periode?.id]);

//     // Définir automatiquement le nom de la période
//     useEffect(() => {
//         if (data.type_periode && data.numero) {
//             const option = numeroOptions.find(opt => opt.value === Number(data.numero));
//             if (option) {
//                 setData('nom', option.label);
//             }
//         }
//     }, [data.type_periode, data.numero, numeroOptions]);

//     // Définir automatiquement le code de la période
//     useEffect(() => {
//         if (data.type_periode && data.numero && data.exercice_id && !isEdit) {
//             let prefix = '';
//             switch (data.type_periode) {
//                 case 'mensuel':
//                     prefix = 'M';
//                     break;
//                 case 'trimestriel':
//                     prefix = 'T';
//                     break;
//                 case 'semestriel':
//                     prefix = 'S';
//                     break;
//                 case 'annuel':
//                     prefix = 'A';
//                     break;
//             }

//             const exercice = exercices.find((e) => e.id.toString() === data.exercice_id.toString());
//             const annee = exercice ? exercice.annee.toString().slice(-2) : '';

//             setData('code', `${prefix}${data.numero}/${annee}`);
//         }
//     }, [data.type_periode, data.numero, data.exercice_id, isEdit, exercices]);

//     // Définir automatiquement les dates
//     useEffect(() => {
//         if (data.exercice_id && data.type_periode && data.numero && !isEdit) {
//             const exercice = exercices.find((e) => e.id.toString() === data.exercice_id.toString());
//             if (!exercice) return;

//             const annee = exercice.annee;
//             let dateDebut = new Date(annee, 0, 1);
//             let dateFin = new Date(annee, 11, 31);

//             switch (data.type_periode) {
//                 case 'mensuel':
//                     dateDebut = new Date(annee, (data.numero as number) - 1, 1);
//                     dateFin = new Date(annee, data.numero as number, 0);
//                     break;
//                 case 'trimestriel':
//                     dateDebut = new Date(annee, ((data.numero as number) - 1) * 3, 1);
//                     dateFin = new Date(annee, (data.numero as number) * 3, 0);
//                     break;
//                 case 'semestriel':
//                     dateDebut = new Date(annee, ((data.numero as number) - 1) * 6, 1);
//                     dateFin = new Date(annee, (data.numero as number) * 6, 0);
//                     break;
//                 case 'annuel':
//                     dateDebut = new Date(annee, 0, 1);
//                     dateFin = new Date(annee, 11, 31);
//                     break;
//             }

//             const formatDate = (date: Date) => {
//                 return date.toISOString().split('T')[0];
//             };

//             setData('date_debut', formatDate(dateDebut));
//             setData('date_fin', formatDate(dateFin));
//         }
//     }, [data.exercice_id, data.type_periode, data.numero, isEdit, exercices]);

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         console.log('Données envoyées : ', data);
//         if (isEdit) {
//             put(route('periodes.update', periode.id), {
//                 preserveScroll: true,
//                 onError: (errors) => console.log('Erreurs lors de la mise à jour : ', errors),
//             });
//         } else {
//             post(route('periodes.store'), {
//                 preserveScroll: true,
//                 onError: (errors) => console.log('Erreurs lors de la création : ', errors),
//             });
//         }
//     };

//     return (
//         <AppLayout title="Forme Periode">
//             <Head title={isEdit ? 'Modifier une période' : 'Créer une période'} />

//             <div className="py-12">
//                 <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
//                     <div className="mb-6 flex items-center justify-between">
//                         <h1 className="text-2xl font-semibold text-gray-900">{isEdit ? 'Modifier une période' : 'Créer une période'}</h1>

//                         <a
//                             href={route('periodes.index')}
//                             className="inline-flex items-center rounded-md border border-transparent bg-gray-800 px-4 py-2 text-xs font-semibold tracking-widest text-white uppercase ring-gray-300 transition hover:bg-gray-700 focus:border-gray-900 focus:ring focus:outline-none active:bg-gray-900 disabled:opacity-25"
//                         >
//                             Retour
//                         </a>
//                     </div>

//                     {/* Zone d'information */}
//                     {infoMessage && (
//                         <div className="mb-6 rounded-md bg-blue-50 p-4">
//                             <div className="flex">
//                                 <div className="flex-shrink-0">
//                                     <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                                         <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//                                 </svg>
//                             </div>
//                             <div className="ml-3">
//                                 <p className="text-sm text-blue-700">{infoMessage}</p>
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                     <div className="overflow-hidden bg-white p-6 shadow-xl sm:rounded-lg">
//                         <form onSubmit={handleSubmit}>
//                             <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//                                 {!isEdit && (
//                                     <div className="col-span-1">
//                                         <label htmlFor="exercice_id" className="block text-sm font-medium text-gray-700">
//                                             Exercice
//                                         </label>
//                                         <select
//                                             id="exercice_id"
//                                             className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
//                                             value={data.exercice_id}
//                                             onChange={(e) => setData('exercice_id', e.target.value)}
//                                             disabled={isEdit}
//                                         >
//                                             <option value="">Sélectionner un exercice</option>
//                                             {exercices.map((exercice) => (
//                                                 <option key={exercice.id} value={exercice.id}>
//                                                     {exercice.annee}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                         {errors.exercice_id && <p className="mt-1 text-sm text-red-600">{errors.exercice_id}</p>}
//                                     </div>
//                                 )}

//                                 {isEdit && (
//                                     <div className="col-span-1">
//                                         <label className="block text-sm font-medium text-gray-700">Exercice</label>
//                                         <div className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2">
//                                             {exercices.find((e) => e.id === periode.exercice_id)?.annee}
//                                         </div>
//                                     </div>
//                                 )}

//                                 <div className="col-span-1">
//                                     <label htmlFor="code" className="block text-sm font-medium text-gray-700">
//                                         Code
//                                     </label>
//                                     <input
//                                         type="text"
//                                         id="code"
//                                         className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
//                                         value={data.code}
//                                         onChange={(e) => setData('code', e.target.value)}
//                                         readOnly={!isEdit}
//                                     />
//                                     {errors.code && <p className="mt-1 text-sm text-red-600">{errors.code}</p>}
//                                 </div>

//                                 {!isEdit && (
//                                     <>
//                                         <div className="col-span-1">
//                                             <label htmlFor="type_periode" className="block text-sm font-medium text-gray-700">
//                                                 Fréquence
//                                             </label>
//                                             <select
//                                                 id="type_periode"
//                                                 className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
//                                                 value={data.type_periode}
//                                                 onChange={(e) => {
//                                                     setData('type_periode', e.target.value);
//                                                     setData('numero', 1);
//                                                 }}
//                                             >
//                                                 <option value="">Sélectionner un type</option>
//                                                 {Object.entries(typesPeriodes).map(([value, label]) => (
//                                                     <option key={value} value={value}>
//                                                         {label}
//                                                     </option>
//                                                 ))}
//                                             </select>
//                                             {errors.type_periode && <p className="mt-1 text-sm text-red-600">{errors.type_periode}</p>}
//                                         </div>

//                                         <div className="col-span-1">
//                                             <label htmlFor="numero" className="block text-sm font-medium text-gray-700">
//                                                 Période
//                                             </label>
//                                             <select
//                                                 id="numero"
//                                                 className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
//                                                 value={data.numero}
//                                                 onChange={(e) => {
//                                                     setData('numero', Number(e.target.value));
//                                                 }}
//                                                 disabled={!data.type_periode || numeroOptions.length === 0}
//                                             >
//                                                 <option value="">Sélectionner une période</option>
//                                                 {numeroOptions.map((option) => (
//                                                     <option
//                                                         key={option.value}
//                                                         value={option.value}
//                                                         disabled={option.disabled}
//                                                         title={option.tooltip}
//                                                     >
//                                                         {option.label} {option.disabled ? '(utilisé)' : ''}
//                                                     </option>
//                                                 ))}
//                                             </select>
//                                             {errors.numero && <p className="mt-1 text-sm text-red-600">{errors.numero}</p>}
//                                         </div>

//                                         <div className="col-span-1">
//                                             <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
//                                                 Nom de la période
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 id="nom"
//                                                 className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
//                                                 value={data.nom}
//                                                 onChange={(e) => setData('nom', e.target.value)}
//                                                 readOnly
//                                             />
//                                             {errors.nom && <p className="mt-1 text-sm text-red-600">{errors.nom}</p>}
//                                         </div>
//                                     </>
//                                 )}

//                                 {isEdit && (
//                                     <div className="col-span-1">
//                                         <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
//                                             Nom
//                                         </label>
//                                         <input
//                                             type="text"
//                                             id="nom"
//                                             className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
//                                             value={data.nom}
//                                             onChange={(e) => setData('nom', e.target.value)}
//                                         />
//                                         {errors.nom && <p className="mt-1 text-sm text-red-600">{errors.nom}</p>}
//                                     </div>
//                                 )}

//                                 <div className="col-span-1">
//                                     <label htmlFor="date_debut" className="block text-sm font-medium text-gray-700">
//                                         Date de début
//                                     </label>
//                                     <input
//                                         type="date"
//                                         id="date_debut"
//                                         className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
//                                         value={data.date_debut}
//                                         onChange={(e) => setData('date_debut', e.target.value)}
//                                     />
//                                     {errors.date_debut && <p className="mt-1 text-sm text-red-600">{errors.date_debut}</p>}
//                                 </div>

//                                 <div className="col-span-1">
//                                     <label htmlFor="date_fin" className="block text-sm font-medium text-gray-700">
//                                         Date de fin
//                                     </label>
//                                     <input
//                                         type="date"
//                                         id="date_fin"
//                                         className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
//                                         value={data.date_fin}
//                                         onChange={(e) => setData('date_fin', e.target.value)}
//                                     />
//                                     {errors.date_fin && <p className="mt-1 text-sm text-red-600">{errors.date_fin}</p>}
//                                 </div>
//                             </div>

//                             <div className="mt-6 flex justify-end">
//                                 <a
//                                     href={route('periodes.index')}
//                                     className="mr-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
//                                 >
//                                     Annuler
//                                 </a>
//                                 <button
//                                     type="submit"
//                                     className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-xs font-semibold tracking-widest text-white uppercase hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none active:bg-blue-900"
//                                     disabled={processing}
//                                 >
//                                     {isEdit ? 'Mettre à jour' : 'Créer'}
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         </AppLayout>
//     );
// }



import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

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
        exercice_id: number;
        type_periode: string;
        numero: number;
        nom: string;
    }>;
}

export default function Form({ exercices, typesPeriodes, periode, periodesExistantes = [] }: PeriodeFormProps) {
    const [numeroOptions, setNumeroOptions] = useState<{ value: number; label: string; disabled: boolean; tooltip?: string }[]>([]);
    const [infoMessage, setInfoMessage] = useState<string>('');

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

    // Mettre à jour les options de numéro et le message d'info
    useEffect(() => {
        if (data.type_periode && data.exercice_id) {
            const exerciceSelectionne = exercices.find(e => e.id.toString() === data.exercice_id.toString());
            const numeroUtilises = periodesExistantes
                .filter((p) =>
                    p.exercice_id === Number(data.exercice_id) &&
                    p.type_periode === data.type_periode &&
                    (!isEdit || p.id !== periode?.id)
                )
                .map((p) => p.numero);

            let options: { value: number; label: string; disabled: boolean; tooltip?: string }[] = [];
            let message = '';

            switch (data.type_periode) {
                case 'mensuel':
                    options = [
                        { value: 1, label: 'Janvier', disabled: numeroUtilises.includes(1), tooltip: numeroUtilises.includes(1) ? `Déjà utilisé en ${exerciceSelectionne?.annee}` : undefined },
                        { value: 2, label: 'Février', disabled: numeroUtilises.includes(2), tooltip: numeroUtilises.includes(2) ? `Déjà utilisé en ${exerciceSelectionne?.annee}` : undefined },
                        { value: 3, label: 'Mars', disabled: numeroUtilises.includes(3), tooltip: numeroUtilises.includes(3) ? `Déjà utilisé en ${exerciceSelectionne?.annee}` : undefined },
                        { value: 4, label: 'Avril', disabled: numeroUtilises.includes(4), tooltip: numeroUtilises.includes(4) ? `Déjà utilisé en ${exerciceSelectionne?.annee}` : undefined },
                        { value: 5, label: 'Mai', disabled: numeroUtilises.includes(5), tooltip: numeroUtilises.includes(5) ? `Déjà utilisé en ${exerciceSelectionne?.annee}` : undefined },
                        { value: 6, label: 'Juin', disabled: numeroUtilises.includes(6), tooltip: numeroUtilises.includes(6) ? `Déjà utilisé en ${exerciceSelectionne?.annee}` : undefined },
                        { value: 7, label: 'Juillet', disabled: numeroUtilises.includes(7), tooltip: numeroUtilises.includes(7) ? `Déjà utilisé en ${exerciceSelectionne?.annee}` : undefined },
                        { value: 8, label: 'Août', disabled: numeroUtilises.includes(8), tooltip: numeroUtilises.includes(8) ? `Déjà utilisé en ${exerciceSelectionne?.annee}` : undefined },
                        { value: 9, label: 'Septembre', disabled: numeroUtilises.includes(9), tooltip: numeroUtilises.includes(9) ? `Déjà utilisé en ${exerciceSelectionne?.annee}` : undefined },
                        { value: 10, label: 'Octobre', disabled: numeroUtilises.includes(10), tooltip: numeroUtilises.includes(10) ? `Déjà utilisé en ${exerciceSelectionne?.annee}` : undefined },
                        { value: 11, label: 'Novembre', disabled: numeroUtilises.includes(11), tooltip: numeroUtilises.includes(11) ? `Déjà utilisé en ${exerciceSelectionne?.annee}` : undefined },
                        { value: 12, label: 'Décembre', disabled: numeroUtilises.includes(12), tooltip: numeroUtilises.includes(12) ? `Déjà utilisé en ${exerciceSelectionne?.annee}` : undefined },
                    ];
                    message = `Les mois déjà utilisés pour l'année ${exerciceSelectionne?.annee} sont désactivés. Ils seront à nouveau disponibles pour l'année suivante.`;
                    break;
                case 'trimestriel':
                    options = [
                        { value: 1, label: '1er Trimestre', disabled: numeroUtilises.includes(1), tooltip: numeroUtilises.includes(1) ? `Déjà utilisé en ${exerciceSelectionne?.annee}` : undefined },
                        { value: 2, label: '2e Trimestre', disabled: numeroUtilises.includes(2), tooltip: numeroUtilises.includes(2) ? `Déjà utilisé en ${exerciceSelectionne?.annee}` : undefined },
                        { value: 3, label: '3e Trimestre', disabled: numeroUtilises.includes(3), tooltip: numeroUtilises.includes(3) ? `Déjà utilisé en ${exerciceSelectionne?.annee}` : undefined },
                        { value: 4, label: '4e Trimestre', disabled: numeroUtilises.includes(4), tooltip: numeroUtilises.includes(4) ? `Déjà utilisé en ${exerciceSelectionne?.annee}` : undefined },
                    ];
                    message = `Les trimestres déjà utilisés pour l'année ${exerciceSelectionne?.annee} sont désactivés. Ils seront à nouveau disponibles pour l'année suivante.`;
                    break;
                case 'semestriel':
                    options = [
                        { value: 1, label: '1er Semestre', disabled: numeroUtilises.includes(1), tooltip: numeroUtilises.includes(1) ? `Déjà utilisé en ${exerciceSelectionne?.annee}` : undefined },
                        { value: 2, label: '2e Semestre', disabled: numeroUtilises.includes(2), tooltip: numeroUtilises.includes(2) ? `Déjà utilisé en ${exerciceSelectionne?.annee}` : undefined },
                    ];
                    message = `Les semestres déjà utilisés pour l'année ${exerciceSelectionne?.annee} sont désactivés. Ils seront à nouveau disponibles pour l'année suivante.`;
                    break;
                case 'annuel':
                    options = [{ value: 1, label: 'Année', disabled: numeroUtilises.includes(1), tooltip: numeroUtilises.includes(1) ? `Déjà utilisé en ${exerciceSelectionne?.annee}` : undefined }];
                    message = `Une seule période annuelle est autorisée par exercice. Elle sera à nouveau disponible pour l'année suivante.`;
                    break;
                default:
                    options = [];
                    message = '';
            }

            setNumeroOptions(options);
            setInfoMessage(message);
        }
    }, [data.type_periode, data.exercice_id, periodesExistantes, exercices, isEdit, periode?.id]);

    // Définir automatiquement le nom de la période
    useEffect(() => {
        if (data.type_periode && data.numero) {
            const option = numeroOptions.find(opt => opt.value === Number(data.numero));
            if (option) {
                setData('nom', option.label);
            }
        }
    }, [data.type_periode, data.numero, numeroOptions]);

    // Définir automatiquement le code de la période
    useEffect(() => {
        if (data.type_periode && data.numero && data.exercice_id && !isEdit) {
            let prefix = '';
            switch (data.type_periode) {
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

            const exercice = exercices.find((e) => e.id.toString() === data.exercice_id.toString());
            const annee = exercice ? exercice.annee.toString().slice(-2) : '';

            setData('code', `${prefix}${data.numero}/${annee}`);
        }
    }, [data.type_periode, data.numero, data.exercice_id, isEdit, exercices]);

    // Définir automatiquement les dates (corrigé pour respecter l'exercice)
    useEffect(() => {
        if (data.exercice_id && data.type_periode && data.numero && !isEdit) {
            const exercice = exercices.find((e) => e.id.toString() === data.exercice_id.toString());
            if (!exercice) return;

            const annee = exercice.annee;
            let dateDebut: Date;
            let dateFin: Date;

            switch (data.type_periode) {
                case 'mensuel':
                    dateDebut = new Date(annee, (data.numero as number) - 1, 1);
                    dateFin = new Date(annee, data.numero as number, 0);
                    break;
                case 'trimestriel':
                    dateDebut = new Date(annee, ((data.numero as number) - 1) * 3, 1);
                    dateFin = new Date(annee, (data.numero as number) * 3, 0);
                    break;
                case 'semestriel':
                    dateDebut = new Date(annee, ((data.numero as number) - 1) * 6, 1);
                    dateFin = new Date(annee, (data.numero as number) * 6, 0);
                    break;
                case 'annuel':
                    dateDebut = new Date(annee, 0, 1);
                    dateFin = new Date(annee, 11, 31);
                    break;
                default:
                    return;
            }

            const formatDate = (date: Date) => {
                return date.toISOString().split('T')[0];
            };

            // Ne mettre à jour que si les dates sont vides
            if (!data.date_debut) {
                setData('date_debut', formatDate(dateDebut));
            }
            if (!data.date_fin) {
                setData('date_fin', formatDate(dateFin));
            }
        }
    }, [data.exercice_id, data.type_periode, data.numero, isEdit, exercices]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Données envoyées : ', data);
        if (isEdit) {
            put(route('periodes.update', periode.id), {
                preserveScroll: true,
                onError: (errors) => console.log('Erreurs lors de la mise à jour : ', errors),
            });
        } else {
            post(route('periodes.store'), {
                preserveScroll: true,
                onError: (errors) => console.log('Erreurs lors de la création : ', errors),
            });
        }
    };

    return (
        <AppLayout title="Forme Periode">
            <Head title={isEdit ? 'Modifier une période' : 'Créer une période'} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{isEdit ? 'Modifier une période' : 'Créer une période'}</h1>

                        <a
                            href={route('periodes.index')}
                            className="inline-flex items-center rounded-md border border-transparent bg-gray-800 px-4 py-2 text-xs font-semibold tracking-widest text-white uppercase ring-gray-300 transition hover:bg-gray-700 focus:border-gray-900 focus:ring focus:outline-none active:bg-gray-900 disabled:opacity-25 dark:bg-gray-700 dark:hover:bg-gray-600"
                        >
                            Retour
                        </a>
                    </div>

                    {/* Zone d'information */}
                    {infoMessage && (
                        <div className="mb-6 rounded-md bg-blue-50 dark:bg-blue-800/10 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-blue-700 dark:text-blue-300">{infoMessage}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="overflow-hidden bg-white dark:bg-gray-800 p-6 shadow-xl sm:rounded-lg">
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {!isEdit && (
                                    <div className="col-span-1">
                                        <label htmlFor="exercice_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Exercice
                                        </label>
                                        <select
                                            id="exercice_id"
                                            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
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
                                        {errors.exercice_id && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.exercice_id}</p>}
                                    </div>
                                )}

                                {isEdit && (
                                    <div className="col-span-1">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Exercice</label>
                                        <div className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100">
                                            {exercices.find((e) => e.id === periode.exercice_id)?.annee}
                                        </div>
                                    </div>
                                )}

                                <div className="col-span-1">
                                    <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Code
                                    </label>
                                    <input
                                        type="text"
                                        id="code"
                                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                                        value={data.code}
                                        onChange={(e) => setData('code', e.target.value)}
                                    />
                                    {errors.code && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.code}</p>}
                                </div>

                                {!isEdit && (
                                    <>
                                        <div className="col-span-1">
                                            <label htmlFor="type_periode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Fréquence
                                            </label>
                                            <select
                                                id="type_periode"
                                                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                                                value={data.type_periode}
                                                onChange={(e) => {
                                                    setData('type_periode', e.target.value);
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
                                            {errors.type_periode && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.type_periode}</p>}
                                        </div>

                                        <div className="col-span-1">
                                            <label htmlFor="numero" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Période
                                            </label>
                                            <select
                                                id="numero"
                                                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                                                value={data.numero}
                                                onChange={(e) => {
                                                    setData('numero', Number(e.target.value));
                                                }}
                                                disabled={!data.type_periode || numeroOptions.length === 0}
                                            >
                                                <option value="">Sélectionner une période</option>
                                                {numeroOptions.map((option) => (
                                                    <option
                                                        key={option.value}
                                                        value={option.value}
                                                        disabled={option.disabled}
                                                        title={option.tooltip}
                                                    >
                                                        {option.label} {option.disabled ? '(utilisé)' : ''}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.numero && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.numero}</p>}
                                        </div>

                                        <div className="col-span-1">
                                            <label htmlFor="nom" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Nom de la période
                                            </label>
                                            <input
                                                type="text"
                                                id="nom"
                                                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                                                value={data.nom}
                                                onChange={(e) => setData('nom', e.target.value)}
                                            />
                                            {errors.nom && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.nom}</p>}
                                        </div>
                                    </>
                                )}

                                {isEdit && (
                                    <div className="col-span-1">
                                        <label htmlFor="nom" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Nom
                                        </label>
                                        <input
                                            type="text"
                                            id="nom"
                                            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                                            value={data.nom}
                                            onChange={(e) => setData('nom', e.target.value)}
                                        />
                                        {errors.nom && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.nom}</p>}
                                    </div>
                                )}

                                <div className="col-span-1">
                                    <label htmlFor="date_debut" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Date de début
                                    </label>
                                    <input
                                        type="date"
                                        id="date_debut"
                                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                                        value={data.date_debut}
                                        onChange={(e) => setData('date_debut', e.target.value)}
                                    />
                                    {errors.date_debut && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.date_debut}</p>}
                                </div>

                                <div className="col-span-1">
                                    <label htmlFor="date_fin" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Date de fin
                                    </label>
                                    <input
                                        type="date"
                                        id="date_fin"
                                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                                        value={data.date_fin}
                                        onChange={(e) => setData('date_fin', e.target.value)}
                                    />
                                    {errors.date_fin && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.date_fin}</p>}
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <a
                                    href={route('periodes.index')}
                                    className="mr-3 inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                                >
                                    Annuler
                                </a>
                                <button
                                    type="submit"
                                    className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-xs font-semibold tracking-widest text-white uppercase hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none active:bg-blue-900 disabled:opacity-25"
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
