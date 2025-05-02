
// import React, { useState, useEffect } from 'react';
// import { Head, Link } from '@inertiajs/react';
// import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import axios from 'axios';
// import AppLayout from '@/layouts/app-layout';
// // Composants d'interface utilisateur
// import { PageProps } from '@/types';

// // Icônes
// import {
//   ArrowLeft,
//   Calendar,
//   Info,
//   BarChart2,
//   TrendingUp,
//   Activity,
//   RefreshCw,
//   FileSpreadsheet,
//   AlertCircle,
//   User,
//   Building
// } from 'lucide-react';

// // Types
// interface IndicateurDetail {
//   id: string;
//   label: string;
//   unite: string;
//   definition: string;
//   evolution_data: Array<{
//     date: string;
//     value: number;
//     entreprise: string;
//     exercice: string;
//     periode: string;
//   }>;
// }

// interface Exercice {
//   id: number;
//   annee: number;
//   date_debut: string;
//   date_fin: string;
//   actif: boolean;
// }

// interface Beneficiaire {
//   id: number;
//   nom: string;
//   prenom: string;
// }

// interface Entreprise {
//   id: number;
//   nom_entreprise: string;
// }

// interface DetailProps extends PageProps {
//   indicateur: IndicateurDetail;
//   exercices: Exercice[];
//   periodeType: string;
//   categorie: string;
//   exerciceId?: number;
//   entrepriseId?: number;
//   beneficiaireId?: number;
// }

// const Detail: React.FC<DetailProps> = ({
//   auth,
//   indicateur: initialIndicateur,
//   exercices,
//   periodeType,
//   categorie,
//   exerciceId,
//   entrepriseId,
//   beneficiaireId
// }) => {
//   // États
//   const [indicateur, setIndicateur] = useState<IndicateurDetail>(initialIndicateur);
//   const [selectedExerciceId, setSelectedExerciceId] = useState<number | undefined>(exerciceId);
//   const [selectedEntrepriseId, setSelectedEntrepriseId] = useState<number | undefined>(entrepriseId);
//   const [selectedBeneficiaireId, setSelectedBeneficiaireId] = useState<number | undefined>(beneficiaireId);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [chartType, setChartType] = useState<'line' | 'bar'>('line');
//   const [error, setError] = useState<string | null>(null);
//   const [noData, setNoData] = useState<boolean>(false);

//   // Liste des entreprises et bénéficiaires pour les filtres
//   const [entreprises, setEntreprises] = useState<Entreprise[]>([]);
//   const [beneficiaires, setBeneficiaires] = useState<Beneficiaire[]>([]);

//   // Déterminer si on doit afficher le filtre bénéficiaire
//   const isOccasionnellePeriode = periodeType.toLowerCase() === 'occasionnelle';

//   // Calculer des statistiques sur les données
//   const stats = React.useMemo(() => {
//     const values = indicateur.evolution_data.map(d => d.value);
//     if (values.length === 0) return { min: 0, max: 0, avg: 0, count: 0 };

//     return {
//       min: Math.min(...values),
//       max: Math.max(...values),
//       avg: values.reduce((sum, val) => sum + val, 0) / values.length,
//       count: values.length
//     };
//   }, [indicateur.evolution_data]);

//   // Formatter les données pour les graphiques (trier par date)
//   const chartData = React.useMemo(() => {
//     return [...indicateur.evolution_data].sort((a, b) =>
//       new Date(a.date).getTime() - new Date(b.date).getTime()
//     );
//   }, [indicateur.evolution_data]);

//   // Fonction pour formater les nombres
//   const formatNumber = (num: number): string => {
//     if (typeof num !== 'number') return String(num);
//     return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
//   };

//   // Effet pour charger les listes de filtres
//   useEffect(() => {
//     // Charger les entreprises
//     axios.get('/api/entreprises')
//       .then(response => {
//         if (response.data.success) {
//           setEntreprises(response.data.data);
//         }
//       })
//       .catch(err => console.error('Erreur lors du chargement des entreprises:', err));

//     // Charger les bénéficiaires
//     if (isOccasionnellePeriode) {
//       axios.get('/api/beneficiaires')
//         .then(response => {
//           if (response.data.success) {
//             setBeneficiaires(response.data.data);
//           }
//         })
//         .catch(err => console.error('Erreur lors du chargement des bénéficiaires:', err));
//     }
//   }, [isOccasionnellePeriode]);

//   // Effet pour charger les données de l'indicateur
//   useEffect(() => {
//     if (selectedExerciceId !== exerciceId ||
//         selectedEntrepriseId !== entrepriseId ||
//         selectedBeneficiaireId !== beneficiaireId) {
//       fetchIndicateurData();
//     }
//   }, [exerciceId, selectedExerciceId, selectedEntrepriseId, selectedBeneficiaireId]);

//   // Fonction pour récupérer les données de l'indicateur
//   const fetchIndicateurData = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       setNoData(false);

//       // Préparer les paramètres
//       const params: any = {
//         indicateur_id: indicateur.id,
//         categorie: categorie,
//         periode_type: periodeType,
//         exercice_id: selectedExerciceId
//       };

//       // Ajouter le bon paramètre selon la période
//       if (isOccasionnellePeriode) {
//         if (selectedBeneficiaireId) {
//           params.beneficiaire_id = selectedBeneficiaireId;
//         }
//       } else {
//         if (selectedEntrepriseId) {
//           params.entreprise_id = selectedEntrepriseId;
//         }
//       }

//       const response = await axios.get('/api/indicateurs/evolution', {
//         params,
//         headers: {
//           'Accept': 'application/json',
//           'X-Requested-With': 'XMLHttpRequest'
//         }
//       });

//       if (response.data.success) {
//         if (response.data.data.evolution_data.length === 0) {
//           setNoData(true);
//         } else {
//           setIndicateur(response.data.data);
//         }
//       } else {
//         setError('Échec de la récupération des données');
//       }
//     } catch (err) {
//       console.error('Erreur lors de la récupération des données:', err);
//       setError('Une erreur est survenue lors de la récupération des données');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Fonction pour exporter les données au format Excel
//   const exportToExcel = () => {
//     const params = new URLSearchParams({
//       indicateur_id: indicateur.id,
//       categorie: categorie,
//       periode_type: periodeType
//     });

//     if (selectedExerciceId) {
//       params.append('exercice_id', selectedExerciceId.toString());
//     }

//     // Ajouter le paramètre approprié selon la période
//     if (isOccasionnellePeriode) {
//       if (selectedBeneficiaireId) {
//         params.append('beneficiaire_id', selectedBeneficiaireId.toString());
//       }
//     } else {
//       if (selectedEntrepriseId) {
//         params.append('entreprise_id', selectedEntrepriseId.toString());
//       }
//     }

//     window.location.href = `/api/indicateurs/export-excel/indicateur?${params.toString()}`;
//   };

//   return (
//     <AppLayout
//       title={`Indicateur - ${indicateur.label}`}
//       user={auth.user}
//       header={
//         <div className="flex justify-between items-center">
//           <h2 className="font-semibold text-xl text-gray-800 leading-tight">Détail de l'Indicateur</h2>
//           <Link
//             href={route('indicateurs.analyse', {
//               periode_type: periodeType,
//               exercice_id: selectedExerciceId
//             })}
//             className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
//           >
//             <ArrowLeft size={16} />
//             <span>Retour au tableau de bord</span>
//           </Link>
//         </div>
//       }
//     >
//       <Head title={`Indicateur - ${indicateur.label}`} />

//       <div className="py-6">
//         <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
//           {/* Message absence de données */}
//           {noData && (
//             <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
//               <div className="flex">
//                 <div className="flex-shrink-0">
//                   <AlertCircle className="h-5 w-5 text-yellow-400" />
//                 </div>
//                 <div className="ml-3">
//                   <p className="text-sm text-yellow-700">
//                     <span className="font-medium">Attention:</span> Aucune donnée n'a été trouvée pour cet indicateur avec les critères sélectionnés.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Carte principale d'information */}
//           <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
//             <div className="p-6 border-b border-gray-200">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <h1 className="text-2xl font-bold text-gray-900 mb-2">{indicateur.label}</h1>

//                   <div className="flex items-center text-sm text-gray-600 mb-1">
//                     <Calendar size={16} className="mr-2" />
//                     <span>Période: {periodeType}</span>
//                   </div>

//                   {indicateur.unite && (
//                     <div className="flex items-center text-sm text-gray-600 mb-1">
//                       <Activity size={16} className="mr-2" />
//                       <span>Unité: {indicateur.unite}</span>
//                     </div>
//                   )}

//                   <div className="flex items-center text-sm text-gray-600 mb-4">
//                     <Info size={16} className="mr-2" />
//                     <span>Définition: {indicateur.definition}</span>
//                   </div>
//                 </div>

//                 <div className="flex gap-2">
//                   <button
//                     onClick={fetchIndicateurData}
//                     className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-md text-sm"
//                     disabled={isLoading}
//                   >
//                     <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
//                     <span>Actualiser</span>
//                   </button>

//                   <button
//                     onClick={exportToExcel}
//                     className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm"
//                   >
//                     <FileSpreadsheet size={16} />
//                     <span>Exporter Excel</span>
//                   </button>
//                 </div>
//               </div>

//               {/* Filtres */}
//               <div className="mt-4 p-4 bg-gray-50 rounded-md">
//                 <div className="flex flex-wrap gap-4 items-center">
//                   {/* Sélecteur d'exercice */}
//                   <div className="w-full sm:w-auto">
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Exercice
//                     </label>
//                     <select
//                       value={selectedExerciceId || ''}
//                       onChange={(e) => setSelectedExerciceId(e.target.value ? parseInt(e.target.value) : undefined)}
//                       className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
//                     >
//                       <option value="">Tous les exercices</option>
//                       {exercices.map((exercice) => (
//                         <option key={exercice.id} value={exercice.id}>
//                           {exercice.annee} {exercice.actif && '(Actif)'}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   {/* Sélecteur d'entreprise OU bénéficiaire selon la période */}
//                   {isOccasionnellePeriode ? (
//                     <div className="w-full sm:w-auto">
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         <User size={16} className="inline mr-1" /> Bénéficiaire
//                       </label>
//                       <select
//                         value={selectedBeneficiaireId || ''}
//                         onChange={(e) => setSelectedBeneficiaireId(e.target.value ? parseInt(e.target.value) : undefined)}
//                         className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
//                       >
//                         <option value="">Tous les bénéficiaires</option>
//                         {beneficiaires.map((beneficiaire) => (
//                           <option key={beneficiaire.id} value={beneficiaire.id}>
//                             {beneficiaire.nom} {beneficiaire.prenom}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   ) : (
//                     <div className="w-full sm:w-auto">
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         <Building size={16} className="inline mr-1" /> Entreprise
//                       </label>
//                       <select
//                         value={selectedEntrepriseId || ''}
//                         onChange={(e) => setSelectedEntrepriseId(e.target.value ? parseInt(e.target.value) : undefined)}
//                         className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
//                       >
//                         <option value="">Toutes les entreprises</option>
//                         {entreprises.map((entreprise) => (
//                           <option key={entreprise.id} value={entreprise.id}>
//                             {entreprise.nom_entreprise}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   )}

//                   {/* Sélecteur de type de graphique */}
//                   <div className="w-full sm:w-auto">
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Type de graphique
//                     </label>
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() => setChartType('line')}
//                         className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
//                           chartType === 'line'
//                             ? 'bg-blue-600 text-white'
//                             : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                         }`}
//                       >
//                         <TrendingUp size={16} />
//                         <span>Ligne</span>
//                       </button>
//                       <button
//                         onClick={() => setChartType('bar')}
//                         className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
//                           chartType === 'bar'
//                             ? 'bg-blue-600 text-white'
//                             : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                         }`}
//                       >
//                         <BarChart2 size={16} />
//                         <span>Barres</span>
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Statistiques */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//             <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
//               <div className="p-4 border-b border-gray-200">
//                 <h2 className="text-sm font-medium text-gray-500 mb-1">Nombre de points</h2>
//                 <p className="text-2xl font-bold">{stats.count}</p>
//               </div>
//             </div>

//             <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
//               <div className="p-4 border-b border-gray-200">
//                 <h2 className="text-sm font-medium text-gray-500 mb-1">Valeur moyenne</h2>
//                 <p className="text-2xl font-bold">
//                   {formatNumber(Math.round(stats.avg * 100) / 100)}
//                   {indicateur.unite && <span className="text-sm ml-1">{indicateur.unite}</span>}
//                 </p>
//               </div>
//             </div>

//             <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
//               <div className="p-4 border-b border-gray-200">
//                 <h2 className="text-sm font-medium text-gray-500 mb-1">Valeur minimum</h2>
//                 <p className="text-2xl font-bold">
//                   {formatNumber(stats.min)}
//                   {indicateur.unite && <span className="text-sm ml-1">{indicateur.unite}</span>}
//                 </p>
//               </div>
//             </div>

//             <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
//               <div className="p-4 border-b border-gray-200">
//                 <h2 className="text-sm font-medium text-gray-500 mb-1">Valeur maximum</h2>
//                 <p className="text-2xl font-bold">
//                   {formatNumber(stats.max)}
//                   {indicateur.unite && <span className="text-sm ml-1">{indicateur.unite}</span>}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Graphique principal */}
//           <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
//             <div className="p-6 border-b border-gray-200">
//               <h2 className="text-lg font-medium text-gray-800 mb-4">Évolution de l'indicateur</h2>

//               {isLoading ? (
//                 <div className="flex items-center justify-center h-64">
//                   <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//                 </div>
//               ) : error ? (
//                 <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//                   <p className="font-medium">Erreur</p>
//                   <p>{error}</p>
//                 </div>
//               ) : chartData.length === 0 ? (
//                 <div className="flex items-center justify-center h-64 bg-gray-50 rounded">
//                   <p className="text-gray-500">Aucune donnée disponible pour cet indicateur</p>
//                 </div>
//               ) : (
//                 <div className="h-96">
//                   <ResponsiveContainer width="100%" height="100%">
//                     {chartType === 'line' ? (
//                       <LineChart data={chartData}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis
//                           dataKey="date"
//                           tickFormatter={(date) => new Date(date).toLocaleDateString()}
//                         />
//                         <YAxis />
//                         <Tooltip
//                           formatter={(value) => [formatNumber(value as number), indicateur.label]}
//                           labelFormatter={(date) => new Date(date as string).toLocaleDateString()}
//                         />
//                         <Legend />
//                         <Line
//                           type="monotone"
//                           dataKey="value"
//                           name={indicateur.label}
//                           stroke="#3498db"
//                           strokeWidth={2}
//                           dot={{ r: 4 }}
//                           activeDot={{ r: 6 }}
//                         />
//                       </LineChart>
//                     ) : (
//                       <BarChart data={chartData}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis
//                           dataKey="date"
//                           tickFormatter={(date) => new Date(date).toLocaleDateString()}
//                         />
//                         <YAxis />
//                         <Tooltip
//                           formatter={(value) => [formatNumber(value as number), indicateur.label]}
//                           labelFormatter={(date) => new Date(date as string).toLocaleDateString()}
//                         />
//                         <Legend />
//                         <Bar
//                           dataKey="value"
//                           name={indicateur.label}
//                           fill="#3498db"
//                         />
//                       </BarChart>
//                     )}
//                   </ResponsiveContainer>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Tableau des données */}
//           <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
//             <div className="p-6 border-b border-gray-200">
//               <h2 className="text-lg font-medium text-gray-800 mb-4">Détail des valeurs</h2>

//               {chartData.length === 0 ? (
//                 <div className="p-4 bg-gray-50 rounded text-center text-gray-500">
//                   Aucune donnée disponible pour cet indicateur
//                 </div>
//               ) : (
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Date
//                         </th>
//                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Valeur
//                         </th>
//                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Entreprise
//                         </th>
//                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Exercice
//                         </th>
//                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Période
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {chartData.map((point, index) => (
//                         <tr key={index} className="hover:bg-gray-50">
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                             {new Date(point.date).toLocaleDateString()}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                             {formatNumber(point.value)} {indicateur.unite}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                             {point.entreprise}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                             {point.exercice}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                             {point.periode}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </AppLayout>
//   );
// };

// export default Detail;
import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import AppLayout from '@/layouts/app-layout';
// Composants d'interface utilisateur
import { PageProps } from '@/types';

// Icônes
import {
  ArrowLeft,
  Calendar,
  Info,
  BarChart2,
  TrendingUp,
  Activity,
  RefreshCw,
  FileSpreadsheet,
  AlertCircle,
  User,
  Building,
  Sun,
  Moon,
  ChevronDown,
  Filter
} from 'lucide-react';

// Types
interface IndicateurDetail {
  id: string;
  label: string;
  unite: string;
  definition: string;
  evolution_data: Array<{
    date: string;
    value: number;
    entreprise: string;
    exercice: string;
    periode: string;
  }>;
}

interface Exercice {
  id: number;
  annee: number;
  date_debut: string;
  date_fin: string;
  actif: boolean;
}

interface Beneficiaire {
  id: number;
  nom: string;
  prenom: string;
}

interface Entreprise {
  id: number;
  nom_entreprise: string;
}

interface DetailProps extends PageProps {
  indicateur: IndicateurDetail;
  exercices: Exercice[];
  periodeType: string;
  categorie: string;
  exerciceId?: number;
  entrepriseId?: number;
  beneficiaireId?: number;
}

const Detail: React.FC<DetailProps> = ({
  auth,
  indicateur: initialIndicateur,
  exercices,
  periodeType,
  categorie,
  exerciceId,
  entrepriseId,
  beneficiaireId
}) => {
  // État pour le thème
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // État pour le menu mobile
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  // États
  const [indicateur, setIndicateur] = useState<IndicateurDetail>(initialIndicateur);
  const [selectedExerciceId, setSelectedExerciceId] = useState<number | undefined>(exerciceId);
  const [selectedEntrepriseId, setSelectedEntrepriseId] = useState<number | undefined>(entrepriseId);
  const [selectedBeneficiaireId, setSelectedBeneficiaireId] = useState<number | undefined>(beneficiaireId);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [error, setError] = useState<string | null>(null);
  const [noData, setNoData] = useState<boolean>(false);

  // Liste des entreprises et bénéficiaires pour les filtres
  const [entreprises, setEntreprises] = useState<Entreprise[]>([]);
  const [beneficiaires, setBeneficiaires] = useState<Beneficiaire[]>([]);

  // Déterminer si on doit afficher le filtre bénéficiaire
  const isOccasionnellePeriode = periodeType.toLowerCase() === 'occasionnelle';

  // Vérifier le thème préféré du système
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener('change', handler);

    // Appliquer le thème
    if (mediaQuery.matches) {
      document.documentElement.classList.add('dark');
    }

    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Fonction pour basculer le mode sombre
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Calculer des statistiques sur les données
  const stats = React.useMemo(() => {
    const values = indicateur.evolution_data.map(d => d.value);
    if (values.length === 0) return { min: 0, max: 0, avg: 0, count: 0 };

    return {
      min: Math.min(...values),
      max: Math.max(...values),
      avg: values.reduce((sum, val) => sum + val, 0) / values.length,
      count: values.length
    };
  }, [indicateur.evolution_data]);

  // Formatter les données pour les graphiques (trier par date)
  const chartData = React.useMemo(() => {
    return [...indicateur.evolution_data].sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [indicateur.evolution_data]);

  // Fonction pour formater les nombres
  const formatNumber = (num: number): string => {
    if (typeof num !== 'number') return String(num);
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  // Effet pour charger les listes de filtres
  useEffect(() => {
    // Charger les entreprises
    axios.get('/api/indicateurs/entreprises')
      .then(response => {
        if (response.data.success) {
          setEntreprises(response.data.data);
        }
      })
      .catch(err => console.error('Erreur lors du chargement des entreprises:', err));

    // Charger les bénéficiaires
    if (isOccasionnellePeriode) {
      axios.get('/api/beneficiaires')
        .then(response => {
          if (response.data.success) {
            setBeneficiaires(response.data.data);
          }
        })
        .catch(err => console.error('Erreur lors du chargement des bénéficiaires:', err));
    }
  }, [isOccasionnellePeriode]);

  // Effet pour charger les données de l'indicateur
  useEffect(() => {
    if (selectedExerciceId !== exerciceId ||
        selectedEntrepriseId !== entrepriseId ||
        selectedBeneficiaireId !== beneficiaireId) {
      fetchIndicateurData();
    }
  }, [exerciceId, selectedExerciceId, selectedEntrepriseId, selectedBeneficiaireId]);

  // Fonction pour récupérer les données de l'indicateur
  const fetchIndicateurData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setNoData(false);

      // Préparer les paramètres
      const params: any = {
        indicateur_id: indicateur.id,
        categorie: categorie,
        periode_type: periodeType,
        exercice_id: selectedExerciceId
      };

      // Ajouter le bon paramètre selon la période
      if (isOccasionnellePeriode) {
        if (selectedBeneficiaireId) {
          params.beneficiaire_id = selectedBeneficiaireId;
        }
      } else {
        if (selectedEntrepriseId) {
          params.entreprise_id = selectedEntrepriseId;
        }
      }

      const response = await axios.get('/api/indicateurs/evolution', {
        params,
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      if (response.data.success) {
        if (response.data.data.evolution_data.length === 0) {
          setNoData(true);
        } else {
          setIndicateur(response.data.data);
        }
      } else {
        setError('Échec de la récupération des données');
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des données:', err);
      setError('Une erreur est survenue lors de la récupération des données');
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour exporter les données au format Excel
  const exportToExcel = () => {
    const params = new URLSearchParams({
      indicateur_id: indicateur.id,
      categorie: categorie,
      periode_type: periodeType
    });

    if (selectedExerciceId) {
      params.append('exercice_id', selectedExerciceId.toString());
    }

    // Ajouter le paramètre approprié selon la période
    if (isOccasionnellePeriode) {
      if (selectedBeneficiaireId) {
        params.append('beneficiaire_id', selectedBeneficiaireId.toString());
      }
    } else {
      if (selectedEntrepriseId) {
        params.append('entreprise_id', selectedEntrepriseId.toString());
      }
    }

    window.location.href = `/api/indicateurs/export-excel/indicateur?${params.toString()}`;
  };

  return (
    <AppLayout
      title={`Indicateur - ${indicateur.label}`}
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-100 leading-tight">Détail de l'Indicateur</h2>
          <div className="flex items-center gap-2">
            <Link
              href={route('indicateurs.analyse', {
                periode_type: periodeType,
                exercice_id: selectedExerciceId
              })}
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Retour au tableau de bord</span>
            </Link>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              aria-label={isDarkMode ? "Passer au mode clair" : "Passer au mode sombre"}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      }
    >
      <Head title={`Indicateur - ${indicateur.label}`} />

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Message absence de données */}
          {noData && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600 p-4 mb-6 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-yellow-400 dark:text-yellow-300" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    <span className="font-medium">Attention:</span> Aucune donnée n'a été trouvée pour cet indicateur avec les critères sélectionnés.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Carte principale d'information */}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mb-6">
            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">{indicateur.label}</h1>

                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <Calendar size={16} className="mr-2 flex-shrink-0" />
                    <span>Période: {periodeType}</span>
                  </div>

                  {indicateur.unite && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-1">
                      <Activity size={16} className="mr-2 flex-shrink-0" />
                      <span>Unité: {indicateur.unite}</span>
                    </div>
                  )}

                  <div className="flex items-start text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <Info size={16} className="mr-2 mt-1 flex-shrink-0" />
                    <span>Définition: {indicateur.definition}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-md text-sm transition-colors sm:hidden"
                    aria-expanded={isFilterOpen}
                    aria-controls="filter-panel"
                  >
                    <Filter size={16} />
                    <span>Filtres</span>
                    <ChevronDown size={16} className={`transform transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <button
                    onClick={fetchIndicateurData}
                    className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-md text-sm transition-colors"
                    disabled={isLoading}
                    aria-label="Actualiser les données"
                  >
                    <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                    <span className="hidden sm:inline">Actualiser</span>
                  </button>

                  <button
                    onClick={exportToExcel}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm transition-colors"
                    aria-label="Exporter au format Excel"
                  >
                    <FileSpreadsheet size={16} />
                    <span className="hidden sm:inline">Exporter Excel</span>
                  </button>
                </div>
              </div>

              {/* Filtres */}
              <div className={`mt-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-md ${isFilterOpen ? '' : 'hidden sm:block'}`} id="filter-panel">
                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4">
                  {/* Sélecteur d'exercice */}
                  <div className="w-full sm:w-auto">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Exercice
                    </label>
                    <select
                      value={selectedExerciceId || ''}
                      onChange={(e) => setSelectedExerciceId(e.target.value ? parseInt(e.target.value) : undefined)}
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="">Tous les exercices</option>
                      {exercices.map((exercice) => (
                        <option key={exercice.id} value={exercice.id}>
                          {exercice.annee} {exercice.actif && '(Actif)'}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sélecteur d'entreprise OU bénéficiaire selon la période */}
                  {isOccasionnellePeriode ? (
                    <div className="w-full sm:w-auto">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        <User size={16} className="inline mr-1" /> Bénéficiaire
                      </label>
                      <select
                        value={selectedBeneficiaireId || ''}
                        onChange={(e) => setSelectedBeneficiaireId(e.target.value ? parseInt(e.target.value) : undefined)}
                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="">Tous les bénéficiaires</option>
                        {beneficiaires.map((beneficiaire) => (
                          <option key={beneficiaire.id} value={beneficiaire.id}>
                            {beneficiaire.nom} {beneficiaire.prenom}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="w-full sm:w-auto">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        <Building size={16} className="inline mr-1" /> Entreprise
                      </label>
                      <select
                        value={selectedEntrepriseId || ''}
                        onChange={(e) => setSelectedEntrepriseId(e.target.value ? parseInt(e.target.value) : undefined)}
                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="">Toutes les entreprises</option>
                        {entreprises.map((entreprise) => (
                          <option key={entreprise.id} value={entreprise.id}>
                            {entreprise.nom_entreprise}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Sélecteur de type de graphique */}
                  <div className="w-full sm:w-auto">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Type de graphique
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setChartType('line')}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                          chartType === 'line'
                            ? 'bg-blue-600 text-white dark:bg-blue-500'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                        aria-label="Graphique en ligne"
                      >
                        <TrendingUp size={16} />
                        <span>Ligne</span>
                      </button>
                      <button
                        onClick={() => setChartType('bar')}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                          chartType === 'bar'
                            ? 'bg-blue-600 text-white dark:bg-blue-500'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                        aria-label="Graphique en barres"
                      >
                        <BarChart2 size={16} />
                        <span>Barres</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg">
              <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Nombre de points</h2>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{stats.count}</p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg">
              <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Valeur moyenne</h2>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {formatNumber(Math.round(stats.avg * 100) / 100)}
                  {indicateur.unite && <span className="text-xs sm:text-sm ml-1">{indicateur.unite}</span>}
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg">
              <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Valeur minimum</h2>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {formatNumber(stats.min)}
                  {indicateur.unite && <span className="text-xs sm:text-sm ml-1">{indicateur.unite}</span>}
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg">
              <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Valeur maximum</h2>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {formatNumber(stats.max)}
                  {indicateur.unite && <span className="text-xs sm:text-sm ml-1">{indicateur.unite}</span>}
                </p>
              </div>
            </div>
          </div>

          {/* Graphique principal */}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg mb-6">
            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">Évolution de l'indicateur</h2>

              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
                </div>
              ) : error ? (
                <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded">
                  <p className="font-medium">Erreur</p>
                  <p>{error}</p>
                </div>
              ) : chartData.length === 0 ? (
                <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-700/30 rounded">
                  <p className="text-gray-500 dark:text-gray-400">Aucune donnée disponible pour cet indicateur</p>
                </div>
              ) : (
                <div className="h-64 sm:h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === 'line' ? (
                      <LineChart data={chartData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}
                        />
                        <XAxis
                          dataKey="date"
                          tickFormatter={(date) => new Date(date).toLocaleDateString()}
                          stroke={isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'}
                        />
                        <YAxis
                          stroke={isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'}
                        />
                        <Tooltip
                          formatter={(value) => [formatNumber(value as number), indicateur.label]}
                          labelFormatter={(date) => new Date(date as string).toLocaleDateString()}
                          contentStyle={{
                            backgroundColor: isDarkMode ? '#1f2937' : '#fff',
                            color: isDarkMode ? '#f3f4f6' : '#333',
                            border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`
                          }}
                        />
                        <Legend
                          wrapperStyle={{
                            color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          name={indicateur.label}
                          stroke={isDarkMode ? '#3b82f6' : '#3498db'}
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    ) : (
                      <BarChart data={chartData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}
                        />
                        <XAxis
                          dataKey="date"
                          tickFormatter={(date) => new Date(date).toLocaleDateString()}
                          stroke={isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'}
                        />
                        <YAxis
                          stroke={isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'}
                        />
                        <Tooltip
                          formatter={(value) => [formatNumber(value as number), indicateur.label]}
                          labelFormatter={(date) => new Date(date as string).toLocaleDateString()}
                          contentStyle={{
                            backgroundColor: isDarkMode ? '#1f2937' : '#fff',
                            color: isDarkMode ? '#f3f4f6' : '#333',
                            border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`
                          }}
                        />
                        <Legend
                          wrapperStyle={{
                            color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
                          }}
                        />
                        <Bar
                          dataKey="value"
                          name={indicateur.label}
                          fill={isDarkMode ? '#3b82f6' : '#3498db'}
                        />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          {/* Tableau des données */}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg">
            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">Détail des valeurs</h2>

              {chartData.length === 0 ? (
                <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded text-center text-gray-500 dark:text-gray-400">
                  Aucune donnée disponible pour cet indicateur
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Valeur
                        </th>
                        <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Entreprise
                        </th>
                        <th scope="col" className="hidden md:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Exercice
                        </th>
                        <th scope="col" className="hidden lg:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Période
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {chartData.map((point, index) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 dark:text-gray-200">
                            {new Date(point.date).toLocaleDateString()}
                          </td>
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-200">
                            {formatNumber(point.value)} {indicateur.unite}
                          </td>
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            {point.entreprise}
                          </td>
                          <td className="hidden md:table-cell px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            {point.exercice}
                          </td>
                          <td className="hidden lg:table-cell px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            {point.periode}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Detail;
