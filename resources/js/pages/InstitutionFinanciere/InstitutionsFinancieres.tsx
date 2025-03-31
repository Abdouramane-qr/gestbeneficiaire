// import React, { useState } from 'react';
// import { Head, usePage, router } from '@inertiajs/react';
// import { PlusIcon, PencilIcon, TrashIcon, ArrowLeftIcon } from 'lucide-react';
// import { Toaster, toast } from 'sonner';
// import InsFinFormModal from '@/components/InsFinFormModal';

// interface Institution {
//   id: number;
//   nom: string;
//   adresse: string;
//   ville: string;
//   description: string;
// }

// const InstitutionsFinancieres = () => {
//   const { institutions } = usePage().props as unknown as { institutions: { data: Institution[] } };
//   console.log('institutions:', institutions); // Debugging: Log the data

//   const [institutionsList, setInstitutionsList] = useState(institutions.data || []);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [currentInstitution, setCurrentInstitution] = useState<Institution | null>(null);
//   const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showDetailView, setShowDetailView] = useState(false);
//   const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);

//   const fetchInstitutions = () => {
//     router.get(route("InstitutionFinanciere.index"), {}, {
//       preserveState: true,
//       only: ["institutions"],
//       onSuccess: (page) => {
//         setInstitutionsList(page.props.institutions.data as Institution[]);
//       },
//     });
//   };

//   const openModal = (institution: Institution | null = null) => {
//     setCurrentInstitution(institution);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setCurrentInstitution(null);
//   };

//   const handleDelete = (id: number, e: React.MouseEvent) => {
//     e.stopPropagation();

//     if (confirmDelete === id) {
//       router.delete(route('InstitutionFinanciere.destroy', id), {
//         onSuccess: () => {
//           toast.success("Institution supprimée avec succès");
//           setInstitutionsList(institutionsList.filter((institution) => institution.id !== id));
//           setConfirmDelete(null);
//           if (selectedInstitution && selectedInstitution.id === id) {
//             setShowDetailView(false);
//             setSelectedInstitution(null);
//           }
//         },
//         onError: () => toast.error("Échec de la suppression de l'institution"),
//       });
//     } else {
//       setConfirmDelete(id);
//       toast.info("Cliquez à nouveau pour confirmer la suppression");

//       setTimeout(() => {
//         if (confirmDelete === id) {
//           setConfirmDelete(null);
//         }
//       }, 3000);
//     }
//   };

//   const handleRowClick = (institution: Institution) => {
//     setSelectedInstitution(institution);
//     setShowDetailView(true);
//   };

//   const filteredInstitutions = Array.isArray(institutionsList)
//     ? institutionsList.filter((institution) =>
//         institution.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         institution.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         institution.adresse.toLowerCase().includes(searchTerm.toLowerCase())
//       )
//     : [];

//   return (
//     <>
//       <Head title="Gestion des Institutions Financières" />
//       <Toaster position="top-right" richColors />

//       <div className="py-12">
//         <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
//           <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
//             <div className="flex justify-between items-center mb-6">
//               <button
//                 onClick={() => router.visit('/dashboard')}
//                 className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
//               >
//                 ⬅ Retour au Dashboard
//               </button>
//               <button
//                 onClick={() => openModal(null)}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700 transition"
//               >
//                 <PlusIcon className="w-5 h-5 mr-2" />
//                 Ajouter une institution
//               </button>
//             </div>
//             <input
//               type="text"
//               placeholder="Rechercher une institution..."
//               className="w-full p-2 border rounded-md mb-4"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <table className="min-w-full divide-y divide-gray-300">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Adresse</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ville</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredInstitutions.length > 0 ? (
//                   filteredInstitutions.map((institution) => (
//                     <tr key={institution.id} onClick={() => handleRowClick(institution)} className="cursor-pointer hover:bg-gray-50">
//                       <td className="px-6 py-4">{institution.nom}</td>
//                       <td className="px-6 py-4">{institution.description}</td>
//                       <td className="px-6 py-4">{institution.adresse}</td>
//                       <td className="px-6 py-4">{institution.ville}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" onClick={(e) => e.stopPropagation()}>
//                         <div className="flex space-x-2">
//                           <button onClick={() => openModal(institution)} className="text-indigo-600 hover:text-indigo-900">
//                             <PencilIcon className="w-5 h-5" />
//                           </button>
//                           <button onClick={(e) => handleDelete(institution.id, e)} className="text-gray-500 hover:text-red-600">
//                             <TrashIcon className="w-5 h-5" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500">Aucune institution trouvée</td></tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       <InsFinFormModal isOpen={isModalOpen} closeModal={closeModal} institution={currentInstitution} onSuccess={fetchInstitutions} />
//     </>
//   );
// };

// // export default InstitutionsFinancieres;
// import React, { useState } from 'react';
// import { Head, usePage, router } from '@inertiajs/react';
// import { PlusIcon, PencilIcon, TrashIcon } from 'lucide-react';
// import { Toaster, toast } from 'sonner';
// import InsFinFormModal from '@/components/InsFinFormModal';
// import InstitutionDetail from './show';

// interface Institution {
//   id: number;
//   nom: string;
//   adresse: string;
//   ville: string;
//   description: string;
// }

// const InstitutionsFinancieres = () => {
//   const { institutions } = usePage().props as unknown as { institutions: { data: Institution[] } };
//   console.log('institutions:', institutions); // Debugging: Log the data

//   const [institutionsList, setInstitutionsList] = useState(institutions.data || []);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [currentInstitution, setCurrentInstitution] = useState<Institution | null>(null);
//   const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showDetailView, setShowDetailView] = useState(false);
//   const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);

//   const fetchInstitutions = () => {
//     router.get(route("InstitutionFinanciere.index"), {}, {
//       preserveState: true,
//       only: ["institutions"],
//       onSuccess: (page) => {
//         setInstitutionsList(page.props.institutions.data as Institution[]);
//       },
//     });
//   };

//   const openModal = (institution: Institution | null = null) => {
//     setCurrentInstitution(institution);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setCurrentInstitution(null);
//   };

//   const handleDelete = (id: number, e: React.MouseEvent) => {
//     e.stopPropagation();

//     if (confirmDelete === id) {
//       router.delete(route('InstitutionFinanciere.destroy', id), {
//         onSuccess: () => {
//           toast.success("Institution supprimée avec succès");
//           setInstitutionsList(institutionsList.filter((institution) => institution.id !== id));
//           setConfirmDelete(null);
//           if (selectedInstitution && selectedInstitution.id === id) {
//             setShowDetailView(false);
//             setSelectedInstitution(null);
//           }
//         },
//         onError: () => toast.error("Échec de la suppression de l'institution"),
//       });
//     } else {
//       setConfirmDelete(id);
//       toast.info("Cliquez à nouveau pour confirmer la suppression");

//       setTimeout(() => {
//         if (confirmDelete === id) {
//           setConfirmDelete(null);
//         }
//       }, 3000);
//     }
//   };

//   const handleRowClick = (institution: Institution) => {
//     setSelectedInstitution(institution);
//     setShowDetailView(true);
//   };

//   const filteredInstitutions = Array.isArray(institutionsList)
//     ? institutionsList.filter((institution) =>
//         institution.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         institution.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         institution.adresse.toLowerCase().includes(searchTerm.toLowerCase())
//       )
//     : [];

//   return (
//     <>
//       <Head title="Gestion des Institutions Financières" />
//       <Toaster position="top-right" richColors />

//       <div className="py-12">
//         <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
//           <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
//             {showDetailView && selectedInstitution ? (
//               <>
//                 <button
//                   onClick={() => setShowDetailView(false)}
//                   className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition mb-6"
//                 >
//                   ⬅ Retour à la liste
//                 </button>
//                 <InstitutionDetail institution={selectedInstitution} />
//               </>
//             ) : (
//               <>
//                 <div className="flex justify-between items-center mb-6">
//                   <button
//                     onClick={() => router.visit('/dashboard')}
//                     className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
//                   >
//                     ⬅ Retour au Dashboard
//                   </button>
//                   <button
//                     onClick={() => openModal(null)}
//                     className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700 transition"
//                   >
//                     <PlusIcon className="w-5 h-5 mr-2" />
//                     Ajouter une institution
//                   </button>
//                 </div>
//                 <input
//                   type="text"
//                   placeholder="Rechercher une institution..."
//                   className="w-full p-2 border rounded-md mb-4"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//                 <table className="min-w-full divide-y divide-gray-300">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Adresse</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ville</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {filteredInstitutions.length > 0 ? (
//                       filteredInstitutions.map((institution) => (
//                         <tr key={institution.id} onClick={() => handleRowClick(institution)} className="cursor-pointer hover:bg-gray-50">
//                           <td className="px-6 py-4">{institution.nom}</td>
//                           <td className="px-6 py-4">{institution.description}</td>
//                           <td className="px-6 py-4">{institution.adresse}</td>
//                           <td className="px-6 py-4">{institution.ville}</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" onClick={(e) => e.stopPropagation()}>
//                             <div className="flex space-x-2">
//                               <button onClick={() => openModal(institution)} className="text-indigo-600 hover:text-indigo-900">
//                                 <PencilIcon className="w-5 h-5" />
//                               </button>
//                               <button onClick={(e) => handleDelete(institution.id, e)} className="text-gray-500 hover:text-red-600">
//                                 <TrashIcon className="w-5 h-5" />
//                               </button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500">Aucune institution trouvée</td></tr>
//                     )}
//                   </tbody>
//                 </table>
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       <InsFinFormModal isOpen={isModalOpen} closeModal={closeModal} institution={currentInstitution} onSuccess={fetchInstitutions} />
//     </>
//   );
// };

// export default InstitutionsFinancieres;
import React, { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { PlusIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import InsFinFormModal from '@/components/InsFinFormModal';
import InstitutionDetail from './show';

interface Institution {
    id: number;
    nom: string;
    adresse: string;
    ville: string;
    description: string;
    contact: string;
    email: string;
    date_creation: string;
    statut_juridique: string;
    pays: string;
}

const InstitutionsFinancieres = () => {
    const { institutions } = usePage().props as unknown as { institutions: { data: Institution[] } };
    console.log('institutions:', institutions); // Debugging: Log the data

    const [institutionsList, setInstitutionsList] = useState(institutions.data || []);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentInstitution, setCurrentInstitution] = useState<Institution | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDetailView, setShowDetailView] = useState(false);
    const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);

    const fetchInstitutions = () => {
        router.get(route("InstitutionFinanciere.index"), {}, {
            preserveState: true,
            only: ["institutions"],
            onSuccess: (page) => {
                setInstitutionsList(page.props.institutions.data as Institution[]);
            },
        });
    };

    const openModal = (institution: Institution | null = null) => {
        setCurrentInstitution(institution);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentInstitution(null);
    };

    const handleDelete = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();

        if (confirmDelete === id) {
            router.delete(route('InstitutionFinanciere.destroy', id), {
                onSuccess: () => {
                    toast.success("Institution supprimée avec succès");
                    setInstitutionsList(institutionsList.filter((institution) => institution.id !== id));
                    setConfirmDelete(null);
                    if (selectedInstitution && selectedInstitution.id === id) {
                        setShowDetailView(false);
                        setSelectedInstitution(null);
                    }
                },
                onError: () => toast.error("Échec de la suppression de l'institution"),
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

    const handleRowClick = (institution: Institution) => {
        setSelectedInstitution(institution);
        setShowDetailView(true);
    };

    const filteredInstitutions = Array.isArray(institutionsList)
        ? institutionsList.filter((institution) =>
            institution.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            institution.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            institution.adresse.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : [];

    return (
        <>
            <Head title="Gestion des Institutions Financières" />
            <Toaster position="top-right" richColors />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        {showDetailView && selectedInstitution ? (
                            <>
                                <button
                                    onClick={() => setShowDetailView(false)}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition mb-6"
                                >
                                    ⬅ Retour à la liste
                                </button>
                                <InstitutionDetail institution={selectedInstitution} />
                            </>
                        ) : (
                            <>
                                <div className="flex justify-between items-center mb-6">
                                    <button
                                        onClick={() => router.visit('/dashboard')}
                                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                                    >
                                        ⬅ Retour au Dashboard
                                    </button>
                                    <button
                                        onClick={() => openModal(null)}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700 transition"
                                    >
                                        <PlusIcon className="w-5 h-5 mr-2" />
                                        Ajouter une institution
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Rechercher une institution..."
                                    className="w-full p-2 border rounded-md mb-4"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Adresse</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ville</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredInstitutions.length > 0 ? (
                                            filteredInstitutions.map((institution) => (
                                                <tr key={institution.id} onClick={() => handleRowClick(institution)} className="cursor-pointer hover:bg-gray-50">
                                                    <td className="px-6 py-4">{institution.nom}</td>
                                                    <td className="px-6 py-4">{institution.description}</td>
                                                    <td className="px-6 py-4">{institution.adresse}</td>
                                                    <td className="px-6 py-4">{institution.ville}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                                                        <div className="flex space-x-2">
                                                            <button onClick={() => openModal(institution)} className="text-indigo-600 hover:text-indigo-900">
                                                                <PencilIcon className="w-5 h-5" />
                                                            </button>
                                                            <button onClick={(e) => handleDelete(institution.id, e)} className="text-gray-500 hover:text-red-600">
                                                                <TrashIcon className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500">Aucune institution trouvée</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <InsFinFormModal isOpen={isModalOpen} closeModal={closeModal} institution={currentInstitution} onSuccess={fetchInstitutions} />
        </>
    );
};

export default InstitutionsFinancieres;
