// import React, { useState, useEffect } from 'react';
// import { Inertia } from '@inertiajs/inertia';
// import { usePage } from '@inertiajs/react';
// import { PlusCircle, Edit2, Trash2, Save, X, User } from 'lucide-react';
// import { toast } from 'sonner';
// import AppLayout from '@/layouts/app-layout';

// interface User {
//   id: number;
//   name: string;
// }

// interface Formation {
//   id: number;
//   type: 'technique' | 'entrepreneuriat';
//   libelle: string;
//   actif: boolean;
//   ordre: number;
//   user_id: number | null;
//   user?: User;
// }

// interface PageProps {
//   formations: Formation[];
//   success?: string;
//   error?: string;
// }

// const FormationsIndex = () => {
//   const { props } = usePage<{ props: PageProps }>();
//   const { formations, success, error } = props;

//   const [newFormation, setNewFormation] = useState({
//     type: 'technique' as 'technique' | 'entrepreneuriat',
//     libelle: '',
//   });

//   const [editingId, setEditingId] = useState<number | null>(null);
//   const [editFormationValue, setEditFormationValue] = useState('');

//   // Afficher les messages de succès/erreur
//   useEffect(() => {
//     if (success) toast.success(success);
//     if (error) toast.error(error);
//   }, [success, error]);

//   const handleAddFormation = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!newFormation.libelle.trim()) return;

//     Inertia.post('formations.index', newFormation, {
//       preserveScroll: true,
//       onSuccess: () => {
//         setNewFormation({
//           type: 'technique',
//           libelle: ''
//         });
//       },
//     });
//   };

//   const startEdit = (formation: Formation) => {
//     setEditingId(formation.id);
//     setEditFormationValue(formation.libelle);
//   };

//   const cancelEdit = () => {
//     setEditingId(null);
//     setEditFormationValue('');
//   };

//   const saveEdit = (id: number) => {
//     if (!editFormationValue.trim()) return;

//     Inertia.put(`/formations/${id}`, {
//       libelle: editFormationValue
//     }, {
//       preserveScroll: true,
//       onSuccess: () => setEditingId(null),
//     });
//   };

//   const deleteFormation = (id: number) => {
//     if (confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) {
//       Inertia.delete(`/formations/${id}`, {
//         preserveScroll: true,
//       });
//     }
//   };

//   // Filtrer les formations actives par type
//   const techniqueFormations = formations.filter(f => f.type === 'technique');
//   const entrepreneuriatFormations = formations.filter(f => f.type === 'entrepreneuriat');

//   return (
//     <AppLayout title="Gestion des Formations">
//       <div className="py-6 md:py-12 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-7xl mx-auto">
//           <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
//             <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
//               <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 md:mb-0">
//                 Gestion des Formations
//               </h1>

//               {/* Formulaire d'ajout - Version mobile */}
//               <div className="md:hidden bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
//                 <form onSubmit={handleAddFormation} className="space-y-3">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                       Type de formation
//                     </label>
//                     <select
//                       value={newFormation.type}
//                       onChange={(e) => setNewFormation({
//                         ...newFormation,
//                         type: e.target.value as 'technique' | 'entrepreneuriat'
//                       })}
//                       className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                     >
//                       <option value="technique">Technique</option>
//                       <option value="entrepreneuriat">Entrepreneuriat</option>
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                       Intitulé
//                     </label>
//                     <div className="flex gap-2">
//                       <input
//                         type="text"
//                         value={newFormation.libelle}
//                         onChange={(e) => setNewFormation({
//                           ...newFormation,
//                           libelle: e.target.value
//                         })}
//                         className="flex-1 rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                         placeholder="Nouvelle formation..."
//                       />
//                       <button
//                         type="submit"
//                         disabled={!newFormation.libelle.trim()}
//                         className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
//                       >
//                         <PlusCircle className="h-5 w-5" />
//                       </button>
//                     </div>
//                   </div>
//                 </form>
//               </div>

//               {/* Formulaire d'ajout - Version desktop */}
//               <div className="hidden md:block bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
//                 <form onSubmit={handleAddFormation} className="flex items-end gap-4">
//                   <div className="flex-1 min-w-[160px]">
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                       Type de formation
//                     </label>
//                     <select
//                       value={newFormation.type}
//                       onChange={(e) => setNewFormation({
//                         ...newFormation,
//                         type: e.target.value as 'technique' | 'entrepreneuriat'
//                       })}
//                       className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                     >
//                       <option value="technique">Technique</option>
//                       <option value="entrepreneuriat">Entrepreneuriat</option>
//                     </select>
//                   </div>

//                   <div className="flex-1">
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                       Intitulé de la formation
//                     </label>
//                     <input
//                       type="text"
//                       value={newFormation.libelle}
//                       onChange={(e) => setNewFormation({
//                         ...newFormation,
//                         libelle: e.target.value
//                       })}
//                       className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                       placeholder="Entrez le nom de la formation..."
//                     />
//                   </div>

//                   <button
//                     type="submit"
//                     disabled={!newFormation.libelle.trim()}
//                     className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center gap-2"
//                   >
//                     <PlusCircle className="h-5 w-5" />
//                     <span>Ajouter</span>
//                   </button>
//                 </form>
//               </div>
//             </div>

//             {/* Liste des formations */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               {/* Formations techniques */}
//               <div className="bg-white dark:bg-gray-700 rounded-lg shadow border border-gray-200 dark:border-gray-600">
//                 <div className="p-4 border-b border-gray-200 dark:border-gray-600">
//                   <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
//                     Formations techniques
//                   </h2>
//                 </div>

//                 <div className="p-4">
//                   {techniqueFormations.length > 0 ? (
//                     <ul className="space-y-3">
//                       {techniqueFormations.map((formation: Formation) => (
//                         <li
//                           key={formation.id}
//                           className="p-3 bg-gray-50 dark:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors"
//                         >
//                           {editingId === formation.id ? (
//                             <div className="space-y-3">
//                               <input
//                                 type="text"
//                                 value={editFormationValue}
//                                 onChange={(e) => setEditFormationValue(e.target.value)}
//                                 className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700 focus:ring-blue-500 focus:border-blue-500"
//                                 autoFocus
//                               />

//                               <div className="flex justify-end gap-2">
//                                 <button
//                                   onClick={() => saveEdit(formation.id)}
//                                   className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1"
//                                 >
//                                   <Save className="h-4 w-4" />
//                                   <span>Enregistrer</span>
//                                 </button>
//                                 <button
//                                   onClick={cancelEdit}
//                                   className="px-3 py-1 bg-gray-200 dark:bg-gray-500 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-400 flex items-center gap-1"
//                                 >
//                                   <X className="h-4 w-4" />
//                                   <span>Annuler</span>
//                                 </button>
//                               </div>
//                             </div>
//                           ) : (
//                             <div className="flex justify-between items-start">
//                               <div>
//                                 <p className="font-medium text-gray-800 dark:text-gray-200">
//                                   {formation.libelle}
//                                 </p>
//                                 {formation.user && (
//                                   <p className="text-xs text-gray-500 dark:text-gray-300 mt-1 flex items-center">
//                                     <User className="h-3 w-3 mr-1" />
//                                     Modifié par: {formation.user.name}
//                                   </p>
//                                 )}
//                               </div>

//                               <div className="flex gap-2">
//                                 <button
//                                   onClick={() => startEdit(formation)}
//                                   className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 p-1 rounded-full hover:bg-blue-50 dark:hover:bg-gray-500 transition-colors"
//                                   title="Modifier"
//                                 >
//                                   <Edit2 className="h-5 w-5" />
//                                 </button>
//                                 <button
//                                   onClick={() => deleteFormation(formation.id)}
//                                   className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 p-1 rounded-full hover:bg-red-50 dark:hover:bg-gray-500 transition-colors"
//                                   title="Supprimer"
//                                 >
//                                   <Trash2 className="h-5 w-5" />
//                                 </button>
//                               </div>
//                             </div>
//                           )}
//                         </li>
//                       ))}
//                     </ul>
//                   ) : (
//                     <div className="py-6 text-center">
//                       <p className="text-gray-500 dark:text-gray-400 italic">
//                         Aucune formation technique disponible
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Formations entrepreneuriat */}
//               <div className="bg-white dark:bg-gray-700 rounded-lg shadow border border-gray-200 dark:border-gray-600">
//                 <div className="p-4 border-b border-gray-200 dark:border-gray-600">
//                   <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
//                     Formations en entrepreneuriat
//                   </h2>
//                 </div>

//                 <div className="p-4">
//                   {entrepreneuriatFormations.length > 0 ? (
//                     <ul className="space-y-3">
//                       {entrepreneuriatFormations.map((formation: Formation) => (
//                         <li
//                           key={formation.id}
//                           className="p-3 bg-gray-50 dark:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors"
//                         >
//                           {editingId === formation.id ? (
//                             <div className="space-y-3">
//                               <input
//                                 type="text"
//                                 value={editFormationValue}
//                                 onChange={(e) => setEditFormationValue(e.target.value)}
//                                 className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700 focus:ring-blue-500 focus:border-blue-500"
//                                 autoFocus
//                               />

//                               <div className="flex justify-end gap-2">
//                                 <button
//                                   onClick={() => saveEdit(formation.id)}
//                                   className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1"
//                                 >
//                                   <Save className="h-4 w-4" />
//                                   <span>Enregistrer</span>
//                                 </button>
//                                 <button
//                                   onClick={cancelEdit}
//                                   className="px-3 py-1 bg-gray-200 dark:bg-gray-500 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-400 flex items-center gap-1"
//                                 >
//                                   <X className="h-4 w-4" />
//                                   <span>Annuler</span>
//                                 </button>
//                               </div>
//                             </div>
//                           ) : (
//                             <div className="flex justify-between items-start">
//                               <div>
//                                 <p className="font-medium text-gray-800 dark:text-gray-200">
//                                   {formation.libelle}
//                                 </p>
//                                 {formation.user && (
//                                   <p className="text-xs text-gray-500 dark:text-gray-300 mt-1 flex items-center">
//                                     <User className="h-3 w-3 mr-1" />
//                                     Modifié par: {formation.user.name}
//                                   </p>
//                                 )}
//                               </div>

//                               <div className="flex gap-2">
//                                 <button
//                                   onClick={() => startEdit(formation)}
//                                   className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 p-1 rounded-full hover:bg-blue-50 dark:hover:bg-gray-500 transition-colors"
//                                   title="Modifier"
//                                 >
//                                   <Edit2 className="h-5 w-5" />
//                                 </button>
//                                 <button
//                                   onClick={() => deleteFormation(formation.id)}
//                                   className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 p-1 rounded-full hover:bg-red-50 dark:hover:bg-gray-500 transition-colors"
//                                   title="Supprimer"
//                                 >
//                                   <Trash2 className="h-5 w-5" />
//                                 </button>
//                               </div>
//                             </div>
//                           )}
//                         </li>
//                       ))}
//                     </ul>
//                   ) : (
//                     <div className="py-6 text-center">
//                       <p className="text-gray-500 dark:text-gray-400 italic">
//                         Aucune formation en entrepreneuriat disponible
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </AppLayout>
//   );
// };

// export default FormationsIndex;
import React, { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { PlusIcon, PencilIcon, TrashIcon} from 'lucide-react';
import { Toaster, toast } from 'sonner';
import AppLayout from '@/layouts/app-layout';

interface User {
    id: number;
    name: string;
}

interface Formation {
    id: number;
    type: 'technique' | 'entrepreneuriat';
    libelle: string;
    actif: boolean;
    ordre: number;
    user_id: number | null;
    user?: User;
}

const Formations = () => {
    const { formations } = usePage().props as unknown as { formations: Formation[] };

    const [formationsList, setFormationsList] = useState<Formation[]>(formations);
    const [newFormation, setNewFormation] = useState({
        type: 'technique' as 'technique' | 'entrepreneuriat',
        libelle: '',
    });
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editFormationValue, setEditFormationValue] = useState('');
    const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

    const fetchFormations = () => {
        router.get(route("formations.index"), {}, {
            preserveState: true,
            only: ["formations"],
            onSuccess: (page) => {
                setFormationsList(page.props.formations as Formation[]);
            },
        });
    };

    const handleAddFormation = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newFormation.libelle.trim()) {
            toast.error("Veuillez entrer un libellé");
            return;
        }

        router.post(route('formations.store'), newFormation, {
            onSuccess: () => {
                toast.success("Formation ajoutée avec succès");
                setNewFormation({
                    type: 'technique',
                    libelle: ''
                });
                fetchFormations();
            },
            onError: () => toast.error("Échec de l'ajout de la formation"),
        });
    };

    const startEdit = (formation: Formation) => {
        setEditingId(formation.id);
        setEditFormationValue(formation.libelle);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditFormationValue('');
    };

    const saveEdit = (id: number) => {
        if (!editFormationValue.trim()) {
            toast.error("Veuillez entrer un libellé valide");
            return;
        }

        router.put(route('formations.update', id), {
            libelle: editFormationValue
        }, {
            onSuccess: () => {
                toast.success("Formation modifiée avec succès");
                setEditingId(null);
                fetchFormations();
            },
            onError: () => toast.error("Échec de la modification de la formation"),
        });
    };

    const handleDelete = (id: number) => {
        if (confirmDelete === id) {
            router.delete(route('formations.destroy', id), {
                onSuccess: () => {
                    toast.success("Formation supprimée avec succès");
                    setFormationsList(formationsList.filter((formation) => formation.id !== id));
                    setConfirmDelete(null);
                    if (selectedFormation && selectedFormation.id === id) {
                        setSelectedFormation(null);
                    }
                },
                onError: () => toast.error("Échec de la suppression de la formation"),
            });
        } else {
            setConfirmDelete(id);
            toast.info("Cliquez à nouveau pour confirmer la suppression");

            setTimeout(() => {
                if (confirmDelete === id) {
                    setConfirmDelete(null);
                }
            }, 3000);
        }
    };

    const handleRowClick = (formation: Formation) => {
        setSelectedFormation(formation);
    };



    // Filtrer les formations par type
    const techniqueFormations = formationsList.filter(f => f.type === 'technique');
    const entrepreneuriatFormations = formationsList.filter(f => f.type === 'entrepreneuriat');

    return (
        <AppLayout title="Gestion des Formations">
            <Head title="Gestion des Formations" />
            <Toaster position="top-right" richColors />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-semibold text-gray-800">Liste des formations</h1>

                            <form onSubmit={handleAddFormation} className="flex items-center gap-4">
                                <select
                                    value={newFormation.type}
                                    onChange={(e) => setNewFormation({
                                        ...newFormation,
                                        type: e.target.value as 'technique' | 'entrepreneuriat'
                                    })}
                                    className="rounded-lg border-gray-300 bg-white shadow-sm"
                                >
                                    <option value="technique">Technique</option>
                                    <option value="entrepreneuriat">Entrepreneuriat</option>
                                </select>

                                <input
                                    type="text"
                                    value={newFormation.libelle}
                                    onChange={(e) => setNewFormation({
                                        ...newFormation,
                                        libelle: e.target.value
                                    })}
                                    className="rounded-lg border-gray-300 bg-white shadow-sm"
                                    placeholder="Nouvelle formation..."
                                />

                                <button
                                    type="submit"
                                    disabled={!newFormation.libelle.trim()}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center disabled:opacity-50"
                                >
                                    <PlusIcon className="w-4 h-4 mr-2" />
                                    Ajouter
                                </button>
                            </form>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Formations techniques */}
                            <div className="bg-white rounded-lg shadow border border-gray-200">
                                <div className="p-4 border-b border-gray-200">
                                    <h2 className="text-lg font-semibold">Formations techniques</h2>
                                </div>

                                <div className="p-4">
                                    {techniqueFormations.length > 0 ? (
                                        <ul className="space-y-2">
                                            {techniqueFormations.map((formation) => (
                                                <li
                                                    key={formation.id}
                                                    onClick={() => handleRowClick(formation)}
                                                    className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer"
                                                >
                                                    {editingId === formation.id ? (
                                                        <div className="space-y-2">
                                                            <input
                                                                type="text"
                                                                value={editFormationValue}
                                                                onChange={(e) => setEditFormationValue(e.target.value)}
                                                                className="w-full p-2 border rounded"
                                                                autoFocus
                                                            />
                                                            <div className="flex justify-end gap-2">
                                                                <button
                                                                    onClick={() => saveEdit(formation.id)}
                                                                    className="px-3 py-1 bg-green-600 text-white rounded"
                                                                >
                                                                    Enregistrer
                                                                </button>
                                                                <button
                                                                    onClick={cancelEdit}
                                                                    className="px-3 py-1 bg-gray-200 rounded"
                                                                >
                                                                    Annuler
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex justify-between items-center">
                                                            <span>{formation.libelle}</span>
                                                            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                                                                <button
                                                                    onClick={() => startEdit(formation)}
                                                                    className="text-blue-600 hover:text-blue-800"
                                                                >
                                                                    <PencilIcon className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(formation.id)}
                                                                    className="text-red-600 hover:text-red-800"
                                                                >
                                                                    <TrashIcon className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-500 italic">Aucune formation technique</p>
                                    )}
                                </div>
                            </div>

                            {/* Formations entrepreneuriat */}
                            <div className="bg-white rounded-lg shadow border border-gray-200">
                                <div className="p-4 border-b border-gray-200">
                                    <h2 className="text-lg font-semibold">Formations en entrepreneuriat</h2>
                                </div>

                                <div className="p-4">
                                    {entrepreneuriatFormations.length > 0 ? (
                                        <ul className="space-y-2">
                                            {entrepreneuriatFormations.map((formation) => (
                                                <li
                                                    key={formation.id}
                                                    onClick={() => handleRowClick(formation)}
                                                    className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer"
                                                >
                                                    {editingId === formation.id ? (
                                                        <div className="space-y-2">
                                                            <input
                                                                type="text"
                                                                value={editFormationValue}
                                                                onChange={(e) => setEditFormationValue(e.target.value)}
                                                                className="w-full p-2 border rounded"
                                                                autoFocus
                                                            />
                                                            <div className="flex justify-end gap-2">
                                                                <button
                                                                    onClick={() => saveEdit(formation.id)}
                                                                    className="px-3 py-1 bg-green-600 text-white rounded"
                                                                >
                                                                    Enregistrer
                                                                </button>
                                                                <button
                                                                    onClick={cancelEdit}
                                                                    className="px-3 py-1 bg-gray-200 rounded"
                                                                >
                                                                    Annuler
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex justify-between items-center">
                                                            <span>{formation.libelle}</span>
                                                            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                                                                <button
                                                                    onClick={() => startEdit(formation)}
                                                                    className="text-blue-600 hover:text-blue-800"
                                                                >
                                                                    <PencilIcon className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(formation.id)}
                                                                    className="text-red-600 hover:text-red-800"
                                                                >
                                                                    <TrashIcon className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-500 italic">Aucune formation en entrepreneuriat</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Formations;
