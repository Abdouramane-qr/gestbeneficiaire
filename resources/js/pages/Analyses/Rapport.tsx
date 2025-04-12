// // resources/js/Pages/Analyse/Rapport.tsx

// import { Head } from '@inertiajs/react';
// import {  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { Download, Printer } from 'lucide-react';
// import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';

// interface RapportProps {
//   donnees: Record<string, any[]>;
//   exercice: {
//     id: number;
//     annee: number;
//   };
//   periode?: {
//     id: number;
//     nom: string;
//   };
//   statistiques: {
//     total_entreprises: number;
//     entreprises_analysees: number;
//   };
//   statistiquesRegions: Record<string, {
//     count: number;
//     valeurs: Record<string, Record<string, {
//       somme: number;
//       count: number;
//       moyenne: number;
//     }>>;
//   }>;
//   filtres: Record<string, any>;
//   auth: {
//     user: {
//       id: number;
//       name: string;
//       email: string;
//     }
//   };
// }

// // Couleurs pour les graphiques
// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

// export default function Rapport({
//   donnees,
//   exercice,
//   periode,
//   statistiques,
//   statistiquesRegions,
//   filtres,
//   auth
// }: RapportProps) {
//   // Préparation des données pour les graphiques par région
//   const donneesRegions = Object.entries(statistiquesRegions).map(([region, stats]) => ({
//     name: region,
//     value: stats.count,
//   }));

//   // Préparation des données pour les graphiques par catégorie
//   const donneesCategories = Object.entries(donnees).map(([categorie, items]) => ({
//     name: categorie,
//     value: items.length,
//   }));

//   // Fonction pour imprimer le rapport
//   const handlePrint = () => {
//     window.print();
//   };

//   // Fonction pour exporter en Excel
//   const handleExport = (format: 'excel' | 'csv') => {
//     // Créer un formulaire pour soumettre les paramètres d'export
//     const form = document.createElement('form');
//     form.method = 'POST';
//     form.action = route('analyse.export');

//     // Ajouter le token CSRF
//     const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
//     const csrfInput = document.createElement('input');
//     csrfInput.type = 'hidden';
//     csrfInput.name = '_token';
//     csrfInput.value = csrfToken || '';
//     form.appendChild(csrfInput);

//     // Ajouter les filtres
//     for (const [key, value] of Object.entries(filtres)) {
//       if (value !== null && value !== undefined) {
//         const input = document.createElement('input');
//         input.type = 'hidden';
//         input.name = key;
//         input.value = Array.isArray(value) ? JSON.stringify(value) : value.toString();
//         form.appendChild(input);
//       }
//     }

//     // Ajouter le format d'export
//     const formatInput = document.createElement('input');
//     formatInput.type = 'hidden';
//     formatInput.name = 'format';
//     formatInput.value = format;
//     form.appendChild(formatInput);

//     // Soumettre le formulaire
//     document.body.appendChild(form);
//     form.submit();
//     document.body.removeChild(form);
//   };

//   return (
//     <AuthenticatedLayout
//       user={auth.user}
//       header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Rapport d'analyse</h2>}
//     >
//       <Head title="Rapport d'analyse" />

//       <div className="py-12">
//         <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
//           <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
//             {/* En-tête du rapport */}
//             <div className="flex justify-between items-center mb-8 print:mb-4">
//               <div>
//                 <h1 className="text-2xl font-bold print:text-xl">Rapport d'analyse des indicateurs</h1>
//                 <p className="text-gray-600">
//                   Exercice: {exercice.annee}
//                   {periode ? ` - Période: ${periode.nom}` : ''}
//                 </p>
//                 <p className="text-gray-600">Date de génération: {new Date().toLocaleDateString()}</p>
//               </div>
//               <div className="flex space-x-2 print:hidden">
//                 <button
//                   onClick={handlePrint}
//                   className="flex items-center px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
//                 >
//                   <Printer className="w-4 h-4 mr-2" />
//                   Imprimer
//                 </button>
//                 <button
//                   onClick={() => handleExport('excel')}
//                   className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
//                 >
//                   <Download className="w-4 h-4 mr-2" />
//                   Excel
//                 </button>
//                 <button
//                   onClick={() => handleExport('csv')}
//                   className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//                 >
//                   <Download className="w-4 h-4 mr-2" />
//                   CSV
//                 </button>
//               </div>
//             </div>

//             {/* Résumé des statistiques */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//               <div className="bg-blue-50 p-4 rounded-lg">
//                 <h3 className="text-lg font-medium text-blue-800">Entreprises</h3>
//                 <p className="text-3xl font-bold">{statistiques.entreprises_analysees} / {statistiques.total_entreprises}</p>
//                 <p className="text-sm text-gray-600">entreprises analysées</p>
//               </div>
//               <div className="bg-green-50 p-4 rounded-lg">
//                 <h3 className="text-lg font-medium text-green-800">Catégories</h3>
//                 <p className="text-3xl font-bold">{Object.keys(donnees).length}</p>
//                 <p className="text-sm text-gray-600">catégories d'indicateurs</p>
//               </div>
//               <div className="bg-yellow-50 p-4 rounded-lg">
//                 <h3 className="text-lg font-medium text-yellow-800">Régions</h3>
//                 <p className="text-3xl font-bold">{Object.keys(statistiquesRegions).length}</p>
//                 <p className="text-sm text-gray-600">régions concernées</p>
//               </div>
//               <div className="bg-purple-50 p-4 rounded-lg">
//                 <h3 className="text-lg font-medium text-purple-800">Indicateurs</h3>
//                 <p className="text-3xl font-bold">
//                   {Object.values(donnees).reduce((acc, items) => acc + items.length, 0)}
//                 </p>
//                 <p className="text-sm text-gray-600">indicateurs analysés</p>
//               </div>
//             </div>

//             {/* Graphiques */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
//               {/* Graphique par région */}
//               <div className="bg-white border border-gray-200 rounded-lg p-4">
//                 <h3 className="text-lg font-medium mb-4">Répartition par région</h3>
//                 <div className="h-64">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <PieChart>
//                       <Pie
//                         data={donneesRegions}
//                         cx="50%"
//                         cy="50%"
//                         labelLine={false}
//                         outerRadius={80}
//                         fill="#8884d8"
//                         dataKey="value"
//                         label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                       >
//                         {donneesRegions.map((entry, index) => (
//                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                         ))}
//                       </Pie>
//                       <Tooltip />
//                       <Legend />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </div>
//               </div>

//               {/* Graphique par catégorie */}
//               <div className="bg-white border border-gray-200 rounded-lg p-4">
//                 <h3 className="text-lg font-medium mb-4">Répartition par catégorie</h3>
//                 <div className="h-64">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <BarChart
//                       data={donneesCategories}
//                       margin={{
//                         top: 5,
//                         right: 30,
//                         left: 20,
//                         bottom: 5,
//                       }}
//                     >
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis dataKey="name" />
//                       <YAxis />
//                       <Tooltip />
//                       <Legend />
//                       <Bar dataKey="value" fill="#8884d8" />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </div>
//               </div>
//             </div>

//             {/* Tableaux des données par catégorie */}
//             <div className="space-y-8">
//               {Object.entries(donnees).map(([categorie, indicateurs]) => (
//                 <div key={categorie} className="bg-white border border-gray-200 rounded-lg p-4">
//                   <h3 className="text-lg font-medium mb-4 capitalize">{categorie}</h3>
//                   <div className="overflow-x-auto">
//                     <table className="min-w-full divide-y divide-gray-200">
//                       <thead className="bg-gray-50">
//                         <tr>
//                           <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Indicateur
//                           </th>
//                           <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Entreprise
//                           </th>
//                           <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Région
//                           </th>
//                           <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Valeur
//                           </th>
//                           <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Tendance
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody className="bg-white divide-y divide-gray-200">
//                         {indicateurs.map((indicateur) => (
//                           <tr key={indicateur.id}>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                               {indicateur.nom}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                               {indicateur.entreprise_nom}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                               {indicateur.region}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                               {indicateur.valeur}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm">
//                               <span className={`
//                                 ${indicateur.tendance === 'hausse' ? 'text-green-600' : ''}
//                                 ${indicateur.tendance === 'baisse' ? 'text-red-600' : ''}
//                                 ${indicateur.tendance === 'stable' ? 'text-gray-600' : ''}
//                               `}>
//                                 {indicateur.tendance === 'hausse' && '↑'}
//                                 {indicateur.tendance === 'baisse' && '↓'}
//                                 {indicateur.tendance === 'stable' && '→'}
//                                 {' '}
//                                 {indicateur.tendance}
//                               </span>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </AuthenticatedLayout>
//   );
// }
