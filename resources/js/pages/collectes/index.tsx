// // import React from 'react';
// // import { Head, Link } from '@inertiajs/react';
// // import { PageProps } from '@/types';
// // import AppLayout from '@/layouts/app-layout';

// // interface Collecte {
// //   id: number;
// //   entreprise: {
// //     id: number;
// //     nom_entreprise: string;
// //   };
// //   exercice: {
// //     id: number;
// //     annee: string;
// //   };
// //   periode: {
// //     id: number;
// //     nom: string;
// //   };
// //   indicateur: {
// //     id: number;
// //     nom: string;
// //     categorie: string;
// //   };
// //   date_collecte: string;
// //   user?: {
// //     id: number;
// //     name: string;
// //   };
// // }

// // interface IndexProps extends PageProps {
// //   collectes: {
// //     data: Collecte[];
// //     links: any[];
// //     from: number;
// //     to: number;
// //     total: number;
// //   };
// // }

// // export default function Index({ collectes }: IndexProps) {
// //   return (
// //     <>
// //       <Head title="Liste des collectes" />
// //       <div className="py-12">
// //         <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
// //           <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
// //             <div className="p-6 bg-white border-b border-gray-200">
// //               <div className="flex justify-between items-center mb-6">
// //                 <h1 className="text-2xl font-semibold">Liste des collectes</h1>
// //                 <Link
// //                   href={route('collectes.create')}
// //                   className="px-4 py-2 bg-blue-600 text-white rounded-md"
// //                 >
// //                   Nouvelle collecte
// //                 </Link>
// //               </div>

// //               <div className="overflow-x-auto">
// //                 <table className="min-w-full divide-y divide-gray-200">
// //                   <thead className="bg-gray-50">
// //                     <tr>
// //                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                         ID
// //                       </th>
// //                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                         Entreprise
// //                       </th>
// //                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                         Exercice
// //                       </th>
// //                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                         Période
// //                       </th>
// //                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                         Indicateur
// //                       </th>
// //                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                         Date collecte
// //                       </th>
// //                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                         Actions
// //                       </th>
// //                     </tr>
// //                   </thead>
// //                   <tbody className="bg-white divide-y divide-gray-200">
// //                     {collectes.data.map((collecte) => (
// //                       <tr key={collecte.id}>
// //                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
// //                           {collecte.id}
// //                         </td>
// //                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// //                           {collecte.entreprise.nom_entreprise}
// //                         </td>
// //                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// //                           {collecte.exercice.annee}
// //                         </td>
// //                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// //                           {collecte.periode.nom}
// //                         </td>
// //                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// //                           {collecte.indicateur.nom}
// //                         </td>
// //                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// //                           {new Date(collecte.date_collecte).toLocaleDateString()}
// //                         </td>
// //                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
// //                           <div className="flex space-x-2">
// //                             <Link
// //                               href={route('collectes.show', collecte.id)}
// //                               className="text-blue-600 hover:text-blue-900"
// //                             >
// //                               Voir
// //                             </Link>
// //                             <Link
// //                               href={route('collectes.edit', collecte.id)}
// //                               className="text-indigo-600 hover:text-indigo-900"
// //                             >
// //                               Modifier
// //                             </Link>
// //                             <Link
// //                               href={route('collectes.destroy', collecte.id)}
// //                               method="delete"
// //                               as="button"
// //                               type="button"
// //                               className="text-red-600 hover:text-red-900"
// //                               onBefore={() => confirm('Êtes-vous sûr de vouloir supprimer cette collecte ?')}
// //                             >
// //                               Supprimer
// //                             </Link>
// //                           </div>
// //                         </td>
// //                       </tr>
// //                     ))}
// //                   </tbody>
// //                 </table>
// //               </div>

// //               {/* Pagination */}
// //               <div className="mt-6">
// //                 <nav className="flex items-center justify-between">
// //                   <div className="text-sm text-gray-700">
// //                     Affichage <span className="font-medium">{collectes.from}</span> à{' '}
// //                     <span className="font-medium">{collectes.to}</span> sur{' '}
// //                     <span className="font-medium">{collectes.total}</span> résultats
// //                   </div>
// //                   <div className="flex-1 flex justify-between sm:justify-end">
// //                     {collectes.links.map((link, index) => (
// //                       <Link
// //                         key={index}
// //                         href={link.url || '#'}
// //                         className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md mx-1 ${
// //                           link.url
// //                             ? link.active
// //                               ? 'bg-blue-50 border-blue-500 text-blue-600'
// //                               : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
// //                             : 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
// //                         }`}
// //                         dangerouslySetInnerHTML={{ __html: link.label }}
// //                       />
// //                     ))}
// //                   </div>
// //                 </nav>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </>
// //   );
// // }

// // Index.layout = (page: React.ReactNode) => <AppLayout children={page} />;
// import React from 'react';
// import { Head, Link } from '@inertiajs/react';

// interface Entreprise {
//   id: number;
//   nom_entreprise: string;
// }

// interface Exercice {
//   id: number;
//   annee: string;
// }

// interface Periode {
//   id: number;
//   type_periode: string;
// }

// interface User {
//   id: number;
//   name: string;
// }

// interface Collecte {
//   id: number;
//   entreprise: Entreprise;
//   exercice: Exercice;
//   periode: Periode;
//   date_collecte: string;
//   user?: User;
//   statut: string;
// }

// interface IndexProps {
//   collectes: {
//     data: Collecte[];
//     links: any[];
//     from: number;
//     to: number;
//     total: number;
//   };
//   flash: Record<string, string>;
// }

// const Index: React.FC<IndexProps> = ({ collectes, flash }) => {
//   // Fonction pour formater la date
//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('fr-FR', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   return (
//     <>
//       <Head title="Liste des collectes" />
//       <div className="py-12">
//         <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
//           <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
//             <div className="p-6 bg-white border-b border-gray-200">
//               <div className="flex justify-between items-center mb-6">
//                 <h1 className="text-2xl font-semibold text-gray-800">Liste des collectes</h1>
//                 <Link
//                   href={route('collectes.create')}
//                   className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
//                 >
//                   Nouvelle collecte
//                 </Link>
//               </div>

//               {/* Message de succès */}
//               {flash?.success && (
//                 <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
//                   {flash.success}
//                 </div>
//               )}

//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         ID
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Entreprise
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Exercice
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Période
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Date collecte
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Statut
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {collectes.data.map((collecte) => (
//                       <tr key={collecte.id}>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                           {collecte.id}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {collecte.entreprise.nom_entreprise}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {collecte.exercice.annee}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {collecte.periode.type_periode}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {formatDate(collecte.date_collecte)}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
//                             ${collecte.statut === 'validé' ? 'bg-green-100 text-green-800' :
//                               collecte.statut === 'brouillon' ? 'bg-gray-100 text-gray-800' :
//                               collecte.statut === 'soumis' ? 'bg-blue-100 text-blue-800' :
//                               collecte.statut === 'rejeté' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
//                             }`}>
//                             {collecte.statut}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                           <div className="flex space-x-2">
//                             <Link
//                               href={route('collectes.show', collecte.id)}
//                               className="text-indigo-600 hover:text-indigo-900"
//                             >
//                               Voir
//                             </Link>
//                             <Link
//                               href={route('collectes.edit', collecte.id)}
//                               className="text-blue-600 hover:text-blue-900"
//                             >
//                               Modifier
//                             </Link>
//                             <Link
//                               href={route('collectes.destroy', collecte.id)}
//                               method="delete"
//                               as="button"
//                               type="button"
//                               className="text-red-600 hover:text-red-900"
//                               onBefore={() => confirm('Êtes-vous sûr de vouloir supprimer cette collecte ?')}
//                             >
//                               Supprimer
//                             </Link>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Pagination */}
//               {collectes.links && collectes.links.length > 3 && (
//                 <div className="mt-6">
//                   <nav className="flex items-center justify-between">
//                     <div className="text-sm text-gray-700">
//                       Affichage <span className="font-medium">{collectes.from}</span> à{' '}
//                       <span className="font-medium">{collectes.to}</span> sur{' '}
//                       <span className="font-medium">{collectes.total}</span> résultats
//                     </div>
//                     <div className="flex-1 flex justify-between sm:justify-end">
//                       {collectes.links.map((link, index) => (
//                         <Link
//                           key={index}
//                           href={link.url || '#'}
//                           className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md mx-1 ${
//                             link.url
//                               ? link.active
//                                 ? 'bg-indigo-50 border-indigo-500 text-indigo-600'
//                                 : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
//                               : 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
//                           }`}
//                           dangerouslySetInnerHTML={{ __html: link.label }}
//                         />
//                       ))}
//                     </div>
//                   </nav>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };
import React, { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { formatDate } from '@/Utils/dateUtils';

interface Entreprise {
    id: number;
    nom_entreprise: string;
}

interface Exercice {
    id: number;
    annee: number;
}

interface Periode {
    id: number;
    type_periode: string;
}

interface Collecte {
    id: number;
    entreprise: Entreprise;
    exercice: Exercice;
    periode: Periode;
    date_collecte: string;
    type_collecte: string;
    donnees: Record<string, any>;
}

const CollectesIndex = () => {
    const { collectes } = usePage().props as unknown as { collectes: { data: Collecte[] } };

    const [collectesList, setCollectesList] = useState(collectes.data);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDetailView, setShowDetailView] = useState(false);
    const [selectedCollecte, setSelectedCollecte] = useState<Collecte | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

    const fetchCollectes = () => {
        router.get(route("collectes.index"), {}, {
            preserveState: true,
            only: ["collectes"],
            onSuccess: (page) => {
                setCollectesList(page.props.collectes.data);
            },
        });
    };

    const handleRowClick = (collecte: Collecte) => {
        setSelectedCollecte(collecte);
        setShowDetailView(true);
    };

    const handleDelete = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();

        if (confirmDelete === id) {
            router.delete(route('collectes.destroy', id), {
                onSuccess: () => {
                    // Toast notification
                    setCollectesList(collectesList.filter((collecte) => collecte.id !== id));
                    setConfirmDelete(null);

                    if (selectedCollecte && selectedCollecte.id === id) {
                        setShowDetailView(false);
                        setSelectedCollecte(null);
                    }
                },
                onError: () => {
                    // Toast error
                },
            });
        } else {
            setConfirmDelete(id);

            setTimeout(() => {
                if (confirmDelete === id) {
                    setConfirmDelete(null);
                }
            }, 3000);
        }
    };

    const filteredCollectes = collectesList.filter((collecte) =>
        collecte.entreprise.nom_entreprise.toLowerCase().includes(searchTerm.toLowerCase()) ||
        collecte.exercice.annee.toString().includes(searchTerm.toLowerCase()) ||
        collecte.periode.type_periode.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Vue détaill

// Vue détaillée d'une collecte
if (showDetailView && selectedCollecte) {
    return (
        <div className="py-12">
            <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                    <button
                        onClick={() => setShowDetailView(false)}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center mb-4"
                    >
                        ← Retour à la liste
                    </button>

                    <h1 className="text-2xl font-semibold mt-4">Détails de la Collecte</h1>

                    <div className="space-y-2">
                        <p><strong>Entreprise :</strong> {selectedCollecte.entreprise.nom_entreprise}</p>
                        <p><strong>Exercice :</strong> {selectedCollecte.exercice.annee}</p>
                        <p><strong>Période :</strong> {selectedCollecte.periode.type_periode}</p>
                        <p><strong>Date de Collecte :</strong> {formatDate(selectedCollecte.date_collecte)}</p>
                        <p><strong>Type de Collecte :</strong> {selectedCollecte.type_collecte}</p>
                    </div>

                    <div className="mt-4">
                        <h2 className="text-xl font-semibold mb-2">Données Collectées</h2>
                        {Object.entries(selectedCollecte.donnees || {}).map(([category, data]) => (
                            <div key={category} className="mb-3">
                                <h3 className="font-medium">{category.toUpperCase()}</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {Object.entries(data).map(([key, value]) => (
                                        <div key={key} className="text-sm">
                                            <span className="font-medium">{key}: </span>
                                            <span>{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex space-x-2 mt-4">
                        <button
                            onClick={() => router.visit(route('collectes.edit', selectedCollecte.id))}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        >
                            Modifier
                        </button>
                        <button
                            onClick={(e) => handleDelete(selectedCollecte.id, e)}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                            Supprimer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Vue liste des collectes
return (
    <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <button
                        onClick={() => router.visit('/dashboard')}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                    >
                        ⬅ Retour au Dashboard
                    </button>

                    <button
                        onClick={() => router.visit(route('collectes.create'))}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                        Nouvelle Collecte
                    </button>
                </div>

                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">Liste des Collectes</h1>
                </div>

                <input
                    type="text"
                    placeholder="Rechercher une collecte..."
                    className="w-full p-2 border rounded-md mb-4"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entreprise</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exercice</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Période</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date Collecte</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredCollectes.length > 0 ? (
                            filteredCollectes.map((collecte) => (
                                <tr
                                    key={collecte.id}
                                    onClick={() => handleRowClick(collecte)}
                                    className="cursor-pointer hover:bg-gray-50"
                                >
                                    <td className="px-6 py-4">{collecte.entreprise.nom_entreprise}</td>
                                    <td className="px-6 py-4">{collecte.exercice.annee}</td>
                                    <td className="px-6 py-4">{collecte.periode.type_periode}</td>
                                    <td className="px-6 py-4">{formatDate(collecte.date_collecte)}</td>
                                    <td
                                        className="px-6 py-4 whitespace-nowrap text-sm font-medium"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => router.visit(route('collectes.edit', collecte.id))}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                ✎
                                            </button>
                                            <button
                                                onClick={(e) => handleDelete(collecte.id, e)}
                                                className="text-gray-500 hover:text-red-600"
                                            >
                                                🗑
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                    Aucune collecte trouvée
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);
};

export default CollectesIndex;
