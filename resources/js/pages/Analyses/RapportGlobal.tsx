
// import React, { useState, useEffect, JSX } from 'react';
// import { Download, RefreshCw } from 'lucide-react';
// import FiltreDashboard from '@/components/Analyse/Fldsb';
// import RapportComparatif from '@/components/Analyse/RapportComparatif';
// import CardMetrique from '@/components/Analyse/cmd';
// import EvolutionTemporelle from '@/components/Analyse/EvolutionTemporelle';
// import DataService from '@/Utils/services/services/DataService';

// interface RapportGlobalProps {
//   exerciceActif: any;
//   exercices: any[];
//   periodes: any[];
//   filtres: any;
// }

// export default function RapportGlobal({ exerciceActif, exercices, periodes, filtres }: RapportGlobalProps): JSX.Element {
//   // États pour les filtres
//   const [filtreExercice, setFiltreExercice] = useState<string>(exerciceActif?.id?.toString() || '');
//   const [filtrePeriode, setFiltrePeriode] = useState<string>('all');
//   const [filtreRegion, setFiltreRegion] = useState<string>('all');
//   const [filtreProvince, setFiltreProvince] = useState<string>('all');
//   const [filtreCommune, setFiltreCommune] = useState<string>('all');
//   const [filtreSecteur, setFiltreSecteur] = useState<string>('all');
//   const [filtreGenre, setFiltreGenre] = useState<string>('all');
//   const [filtrePeriodicite, setFiltrePeriodicite] = useState<string>('all');
//   const [filtreCategorie, setFiltreCategorie] = useState<string>('all');

//   // États pour les données
//   const [donnees, setDonnees] = useState<any>({});
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   // Charger les données
//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true);
//       setError(null);
//       try {
//         const params = {
//           exercice_id: filtreExercice,
//           periode_id: filtrePeriode !== 'all' ? filtrePeriode : null,
//           region: filtreRegion !== 'all' ? filtreRegion : null,
//           province: filtreProvince !== 'all' ? filtreProvince : null,
//           commune: filtreCommune !== 'all' ? filtreCommune : null,
//           secteur_activite: filtreSecteur !== 'all' ? filtreSecteur : null,
//           genre: filtreGenre !== 'all' ? filtreGenre : null,
//           periodicite: filtrePeriodicite !== 'all' ? filtrePeriodicite : null,
//           categorie: filtreCategorie !== 'all' ? filtreCategorie : null,
//         };

//         const response = await DataService.getStatistiquesData(params);
//         setDonnees(response);
//       } catch (error) {
//         console.error('Erreur lors du chargement des données:', error);
//         setError('Impossible de charger les données du rapport. Veuillez réessayer plus tard.');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [
//     filtreExercice,
//     filtrePeriode,
//     filtreRegion,
//     filtreProvince,
//     filtreCommune,
//     filtreSecteur,
//     filtreGenre,
//     filtrePeriodicite,
//     filtreCategorie,
//   ]);

//   // Réinitialiser les filtres
//   const reinitialiserFiltres = () => {
//     setFiltreExercice(exerciceActif?.id?.toString() || '');
//     setFiltrePeriode('all');
//     setFiltreRegion('all');
//     setFiltreProvince('all');
//     setFiltreCommune('all');
//     setFiltreSecteur('all');
//     setFiltreGenre('all');
//     setFiltrePeriodicite('all');
//     setFiltreCategorie('all');
//   };

//   // Exporter le rapport en PDF
//   const exporterRapport = () => {
//     alert('Fonctionnalité d\'export en cours de développement');
//   };

//   // Définir les indicateurs clés à afficher
//   const indicateursCles = [
//     {
//       id: 'credit_rembourse',
//       titre: 'Crédits remboursés',
//       unite: 'FCFA',
//       couleur: 'orange' as const,
//       icon: <span className="text-xl">🏦</span>,
//     },
//     {
//       id: 'montant_creance_clients_12m',
//       titre: 'Créances clients (12 mois)',
//       unite: 'FCFA',
//       couleur: 'blue' as const,
//       icon: <span className="text-xl">💰</span>,
//     },
//     {
//       id: 'nbr_formation_entrepreneuriat_h',
//       titre: 'Formations (hommes)',
//       unite: '',
//       couleur: 'green' as const,
//       icon: <span className="text-xl">📚</span>,
//     },
//     {
//       id: 'nbr_formation_entrepreneuriat_f',
//       titre: 'Formations (femmes)',
//       unite: '',
//       couleur: 'purple' as const,
//       icon: <span className="text-xl">📚</span>,
//     },
//   ];

//   // Gestion des états de chargement, erreur et données vides
//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-50 border-l-4 border-red-400 p-4">
//         <div className="flex">
//           <div className="ml-3">
//             <p className="text-sm text-red-700">{error}</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!donnees.statistiques || Object.keys(donnees.statistiques).length === 0) {
//     return (
//       <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
//         <div className="flex">
//           <div className="ml-3">
//             <p className="text-sm text-yellow-700">
//               Aucune donnée disponible pour les filtres sélectionnés. Veuillez ajuster les filtres ou vérifier les données.
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       {/* En-tête */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Rapport de synthèse</h1>
//         <div className="flex gap-2">
//           <button
//             onClick={reinitialiserFiltres}
//             className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-2"
//           >
//             <RefreshCw className="h-4 w-4" />
//             Réinitialiser
//           </button>
//           <button
//             onClick={exporterRapport}
//             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
//           >
//             <Download className="h-4 w-4" />
//             Exporter PDF
//           </button>
//         </div>
//       </div>

//       {/* Filtres */}
//       <FiltreDashboard
//         exercices={exercices}
//         periodes={periodes}
//         filtres={filtres}
//         filtreExercice={filtreExercice}
//         filtrePeriode={filtrePeriode}
//         filtreRegion={filtreRegion}
//         filtreProvince={filtreProvince}
//         filtreCommune={filtreCommune}
//         filtreSecteur={filtreSecteur}
//         filtreGenre={filtreGenre}
//         filtrePeriodicite={filtrePeriodicite}
//         filtreCategorie={filtreCategorie}
//         filtresDisponibles={{ periodicites: [], categories: [] }}
//         setFiltreExercice={setFiltreExercice}
//         setFiltrePeriode={setFiltrePeriode}
//         setFiltreRegion={setFiltreRegion}
//         setFiltreProvince={setFiltreProvince}
//         setFiltreCommune={setFiltreCommune}
//         setFiltreSecteur={setFiltreSecteur}
//         setFiltreGenre={setFiltreGenre}
//         setFiltrePeriodicite={setFiltrePeriodicite}
//         setFiltreCategorie={setFiltreCategorie}
//         reinitialiserFiltres={reinitialiserFiltres}
//       />

//       {/* Section 1: Métriques clés */}
//       <div className="mt-8">
//         <h2 className="text-xl font-semibold text-gray-800 mb-4">Indicateurs clés de performance</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {indicateursCles.map((indicateur) => (
//             <CardMetrique
//               key={indicateur.id}
//               titre={indicateur.titre}
//               valeur={donnees.moyennes?.[indicateur.id] ?? 'N/A'}
//               unite={indicateur.unite}
//               icon={indicateur.icon}
//               couleur={indicateur.couleur}
//               tendance={donnees.tendances?.[indicateur.id] ?? 'stable'}
//               pourcentage={donnees.variations?.[indicateur.id] ?? 0}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Section 2: Évolution temporelle */}
//       <div className="mt-8">
//         <h2 className="text-xl font-semibold text-gray-800 mb-4">Évolution des indicateurs clés</h2>
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {indicateursCles.slice(0, 2).map((indicateur) => (
//             <EvolutionTemporelle
//               key={indicateur.id}
//               exerciceId={filtreExercice}
//               indicateurId={indicateur.id}
//               titre={`Évolution ${indicateur.titre.toLowerCase()}`}
//               filtre={{
//                 region: filtreRegion !== 'all' ? filtreRegion : undefined,
//               }}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Section 3: Rapports comparatifs */}
//       <div className="mt-8">
//         <h2 className="text-xl font-semibold text-gray-800 mb-4">Analyse comparative</h2>
//         <div className="grid grid-cols-1 gap-6">
//           <RapportComparatif
//             exerciceId={filtreExercice}
//             periodeId={filtrePeriode !== 'all' ? filtrePeriode : undefined}
//             indicateurs={indicateursCles.slice(0, 3).map((ind) => ({
//               id: ind.id,
//               nom: ind.titre,
//               couleur: ind.couleur,
//             }))}
//             groupBy="regions"
//             titre="Comparaison des indicateurs par région"
//           />
//           <RapportComparatif
//             exerciceId={filtreExercice}
//             periodeId={filtrePeriode !== 'all' ? filtrePeriode : undefined}
//             indicateurs={indicateursCles.slice(2, 4).map((ind) => ({
//               id: ind.id,
//               nom: ind.titre,
//               couleur: ind.couleur,
//             }))}
//             groupBy="secteur_activite"
//             titre="Comparaison des formations par secteur d'activité"
//           />
//         </div>
//       </div>

//       {/* Section 4: Tableau récapitulatif */}
//       <div className="mt-8">
//         <h2 className="text-xl font-semibold text-gray-800 mb-4">Tableau récapitulatif</h2>
//         <div className="bg-white rounded-lg shadow overflow-hidden">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th
//                   scope="col"
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Indicateur
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Valeur moyenne
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Valeur minimum
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Valeur maximum
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Tendance
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {Object.entries(donnees.statistiques || {}).map(([indicateurId, stats]: [string, any]) => (
//                 <tr key={indicateurId}>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                     {stats.nom || indicateurId}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {(stats.moyenne ?? 'N/A').toLocaleString('fr-FR')} {stats.unite || ''}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {(stats.min ?? 'N/A').toLocaleString('fr-FR')} {stats.unite || ''}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {(stats.max ?? 'N/A').toLocaleString('fr-FR')} {stats.unite || ''}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     <span
//                       className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                         stats.tendance === 'hausse'
//                           ? 'bg-green-100 text-green-800'
//                           : stats.tendance === 'baisse'
//                           ? 'bg-red-100 text-red-800'
//                           : 'bg-gray-100 text-gray-800'
//                       }`}
//                     >
//                       {stats.tendance === 'hausse'
//                         ? '↑ Hausse'
//                         : stats.tendance === 'baisse'
//                         ? '↓ Baisse'
//                         : '→ Stable'}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }
// import React, { useState, useEffect, JSX } from 'react';
// import { Download, RefreshCw } from 'lucide-react';
// import FiltreDashboard from '@/components/Analyse/Fldsb';
// import RapportComparatif from '@/components/Analyse/RapportComparatif';
// import CardMetrique from '@/components/Analyse/cmd';
// import EvolutionTemporelle from '@/components/Analyse/EvolutionTemporelle';
// import DataService from '@/Utils/services/services/DataService';

// interface RapportGlobalProps {
//   exerciceActif: any;
//   exercices: any[];
//   periodes: any[];
//   filtres: any;
// }

// export default function RapportGlobal({ exerciceActif, exercices, periodes, filtres }: RapportGlobalProps): JSX.Element {
//   // États pour les filtres
//   const [filtreExercice, setFiltreExercice] = useState<string>(exerciceActif?.id?.toString() || '');
//   const [filtrePeriode, setFiltrePeriode] = useState<string>('all');
//   const [filtreRegion, setFiltreRegion] = useState<string>('all');
//   const [filtreProvince, setFiltreProvince] = useState<string>('all');
//   const [filtreCommune, setFiltreCommune] = useState<string>('all');
//   const [filtreSecteur, setFiltreSecteur] = useState<string>('all');
//   const [filtreGenre, setFiltreGenre] = useState<string>('all');
//   const [filtrePeriodicite, setFiltrePeriodicite] = useState<string>('all');
//   const [filtreCategorie, setFiltreCategorie] = useState<string>('all');

//   // États pour les données
//   const [donnees, setDonnees] = useState<any>({});
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   // Charger les données
//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true);
//       setError(null);
//       try {
//         const params = {
//           exercice_id: filtreExercice,
//           periode_id: filtrePeriode !== 'all' ? filtrePeriode : null,
//           region: filtreRegion !== 'all' ? filtreRegion : null,
//           province: filtreProvince !== 'all' ? filtreProvince : null,
//           commune: filtreCommune !== 'all' ? filtreCommune : null,
//           secteur_activite: filtreSecteur !== 'all' ? filtreSecteur : null,
//           genre: filtreGenre !== 'all' ? filtreGenre : null,
//           periodicite: filtrePeriodicite !== 'all' ? filtrePeriodicite : null,
//           categorie: filtreCategorie !== 'all' ? filtreCategorie : null,
//         };

//         const response = await DataService.getStatistiquesData(params);
//         setDonnees(response);
//       } catch (error) {
//         console.error('Erreur lors du chargement des données:', error);
//         setError('Impossible de charger les données du rapport. Veuillez réessayer plus tard.');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [
//     filtreExercice,
//     filtrePeriode,
//     filtreRegion,
//     filtreProvince,
//     filtreCommune,
//     filtreSecteur,
//     filtreGenre,
//     filtrePeriodicite,
//     filtreCategorie,
//   ]);

//   // Réinitialiser les filtres
//   const reinitialiserFiltres = () => {
//     setFiltreExercice(exerciceActif?.id?.toString() || '');
//     setFiltrePeriode('all');
//     setFiltreRegion('all');
//     setFiltreProvince('all');
//     setFiltreCommune('all');
//     setFiltreSecteur('all');
//     setFiltreGenre('all');
//     setFiltrePeriodicite('all');
//     setFiltreCategorie('all');
//   };

//   // Exporter le rapport en PDF
//   const exporterRapport = () => {
//     alert("Fonctionnalité d'export en cours de développement");
//   };

//   // Définir les indicateurs clés à afficher
//   const indicateursCles = [
//     {
//       id: 'credit_rembourse',
//       titre: 'Crédits remboursés',
//       unite: 'FCFA',
//       couleur: 'orange' as const,
//       icon: <span className="text-xl">🏦</span>,
//     },
//     {
//       id: 'montant_creance_clients_12m',
//       titre: 'Créances clients (12 mois)',
//       unite: 'FCFA',
//       couleur: 'blue' as const,
//       icon: <span className="text-xl">💰</span>,
//     },
//     {
//       id: 'nbr_formation_entrepreneuriat_h',
//       titre: 'Formations (hommes)',
//       unite: '',
//       couleur: 'green' as const,
//       icon: <span className="text-xl">📚</span>,
//     },
//     {
//       id: 'nbr_formation_entrepreneuriat_f',
//       titre: 'Formations (femmes)',
//       unite: '',
//       couleur: 'purple' as const,
//       icon: <span className="text-xl">📚</span>,
//     },
//   ];

//   // Gestion des états de chargement, erreur et données vides
//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-50 border-l-4 border-red-400 p-4">
//         <div className="flex">
//           <div className="ml-3">
//             <p className="text-sm text-red-700">{error}</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!donnees.statistiques || Object.keys(donnees.statistiques).length === 0) {
//     return (
//       <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
//         <div className="flex">
//           <div className="ml-3">
//             <p className="text-sm text-yellow-700">
//               Aucune donnée disponible pour les filtres sélectionnés. Veuillez ajuster les filtres ou vérifier les données.
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       {/* En-tête */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Rapport de synthèse</h1>
//         <div className="flex gap-2">
//           <button
//             onClick={reinitialiserFiltres}
//             className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-2"
//           >
//             <RefreshCw className="h-4 w-4" />
//             Réinitialiser
//           </button>
//           <button
//             onClick={exporterRapport}
//             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
//           >
//             <Download className="h-4 w-4" />
//             Exporter PDF
//           </button>
//         </div>
//       </div>

//       {/* Filtres */}
//       <FiltreDashboard
//         exercices={exercices}
//         periodes={periodes}
//         filtres={filtres}
//         filtreExercice={filtreExercice}
//         filtrePeriode={filtrePeriode}
//         filtreRegion={filtreRegion}
//         filtreProvince={filtreProvince}
//         filtreCommune={filtreCommune}
//         filtreSecteur={filtreSecteur}
//         filtreGenre={filtreGenre}
//         filtrePeriodicite={filtrePeriodicite}
//         filtreCategorie={filtreCategorie}
//         filtresDisponibles={{ periodicites: [], categories: [] }}
//         setFiltreExercice={setFiltreExercice}
//         setFiltrePeriode={setFiltrePeriode}
//         setFiltreRegion={setFiltreRegion}
//         setFiltreProvince={setFiltreProvince}
//         setFiltreCommune={setFiltreCommune}
//         setFiltreSecteur={setFiltreSecteur}
//         setFiltreGenre={setFiltreGenre}
//         setFiltrePeriodicite={setFiltrePeriodicite}
//         setFiltreCategorie={setFiltreCategorie}
//         reinitialiserFiltres={reinitialiserFiltres}
//       />

//       {/* Section 1: Métriques clés */}
//       <div className="mt-8">
//         <h2 className="text-xl font-semibold text-gray-800 mb-4">Indicateurs clés de performance</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {indicateursCles.map((indicateur) => (
//             <CardMetrique
//               key={indicateur.id}
//               titre={indicateur.titre}
//               valeur={donnees.moyennes?.[indicateur.id] ?? 'N/A'}
//               unite={indicateur.unite}
//               icon={indicateur.icon}
//               couleur={indicateur.couleur}
//               tendance={donnees.tendances?.[indicateur.id] ?? 'stable'}
//               pourcentage={donnees.variations?.[indicateur.id] ?? 0}
//             />
//           ))}
//           {/* Ajouter une carte pour emplois_crees si pertinent */}
//           <CardMetrique
//             titre="Emplois créés"
//             valeur={donnees.totaux?.emplois_crees ?? 'N/A'}
//             unite=""
//             icon={<span className="text-xl">👥</span>}
//             couleur="purple"
//             tendance={donnees.tendances?.emplois_crees ?? 'stable'}
//             pourcentage={donnees.variations?.emplois_crees ?? 0}
//           />
//         </div>
//       </div>

//       {/* Section 2: Évolution temporelle */}
//       <div className="mt-8">
//         <h2 className="text-xl font-semibold text-gray-800 mb-4">Évolution des indicateurs clés</h2>
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {indicateursCles.slice(0, 2).map((indicateur) => (
//             <EvolutionTemporelle
//               key={indicateur.id}
//               exerciceId={filtreExercice}
//               indicateurId={indicateur.id}
//               titre={`Évolution ${indicateur.titre.toLowerCase()}`}
//               filtre={{
//                 region: filtreRegion !== 'all' ? filtreRegion : undefined,
//               }}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Section 3: Rapports comparatifs */}
//       <div className="mt-8">
//         <h2 className="text-xl font-semibold text-gray-800 mb-4">Analyse comparative</h2>
//         <div className="grid grid-cols-1 gap-6">
//           <RapportComparatif
//             exerciceId={filtreExercice}
//             periodeId={filtrePeriode !== 'all' ? filtrePeriode : undefined}
//             indicateurs={indicateursCles.slice(0, 3).map((ind) => ({
//               id: ind.id,
//               nom: ind.titre,
//               couleur: ind.couleur,
//             }))}
//             groupBy="regions"
//             titre="Comparaison des indicateurs par région"
//           />
//           <RapportComparatif
//             exerciceId={filtreExercice}
//             periodeId={filtrePeriode !== 'all' ? filtrePeriode : undefined}
//             indicateurs={indicateursCles.slice(2, 4).map((ind) => ({
//               id: ind.id,
//               nom: ind.titre,
//               couleur: ind.couleur,
//             }))}
//             groupBy="secteur_activite"
//             titre="Comparaison des formations par secteur d'activité"
//           />
//         </div>
//       </div>

//       {/* Section 4: Tableau récapitulatif */}
//       <div className="mt-8">
//         <h2 className="text-xl font-semibold text-gray-800 mb-4">Tableau récapitulatif</h2>
//         <div className="bg-white rounded-lg shadow overflow-hidden">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th
//                   scope="col"
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Indicateur
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Catégorie
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Valeur moyenne
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Valeur minimum
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Valeur maximum
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Tendance
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {Object.entries(donnees.statistiques || {}).map(([indicateurId, stats]: [string, any]) => (
//                 <tr key={indicateurId}>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                     {stats.nom || indicateurId}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {stats.categorie || 'N/A'}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {(stats.moyenne ?? 'N/A').toLocaleString('fr-FR')} {stats.unite || ''}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {(stats.min ?? 'N/A').toLocaleString('fr-FR')} {stats.unite || ''}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {(stats.max ?? 'N/A').toLocaleString('fr-FR')} {stats.unite || ''}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     <span
//                       className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                         stats.tendance === 'hausse'
//                           ? 'bg-green-100 text-green-800'
//                           : stats.tendance === 'baisse'
//                           ? 'bg-red-100 text-red-800'
//                           : 'bg-gray-100 text-gray-800'
//                       }`}
//                     >
//                       {stats.tendance === 'hausse'
//                         ? '↑ Hausse'
//                         : stats.tendance === 'baisse'
//                         ? '↓ Baisse'
//                         : '→ Stable'}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }
// import React, { useState, useEffect, JSX } from 'react';
// import { Download, RefreshCw } from 'lucide-react';
// import FiltreDashboard from '@/components/Analyse/Fldsb';
// import RapportComparatif from '@/components/Analyse/RapportComparatif';
// import CardMetrique from '@/components/Analyse/cmd';
// import EvolutionTemporelle from '@/components/Analyse/EvolutionTemporelle';
// import DataService from '@/Utils/services/services/DataService';

// interface RapportGlobalProps {
//   exerciceActif: any;
//   exercices: any[];
//   periodes: any[];
//   filtres: any;
//   error?: string;
// }

// export default function RapportGlobal({ exerciceActif, exercices, periodes, filtres, error: initialError }: RapportGlobalProps): JSX.Element {
//   // États pour les filtres
//   const [filtreExercice, setFiltreExercice] = useState<string>(exerciceActif?.id?.toString() || '');
//   const [filtrePeriode, setFiltrePeriode] = useState<string>('all');
//   const [filtreRegion, setFiltreRegion] = useState<string>('all');
//   const [filtreProvince, setFiltreProvince] = useState<string>('all');
//   const [filtreCommune, setFiltreCommune] = useState<string>('all');
//   const [filtreSecteur, setFiltreSecteur] = useState<string>('all');
//   const [filtreGenre, setFiltreGenre] = useState<string>('all');
//   const [filtrePeriodicite, setFiltrePeriodicite] = useState<string>('all');
//   const [filtreCategorie, setFiltreCategorie] = useState<string>('all');

//   // États pour les données
//   const [donnees, setDonnees] = useState<any>({});
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(initialError || null);

//   // Charger les données
//   useEffect(() => {
//     if (!filtreExercice) {
//       setIsLoading(false);
//       return;
//     }

//     const fetchData = async () => {
//       setIsLoading(true);
//       setError(null);
//       try {
//         const params = {
//           exercice_id: filtreExercice,
//           periode_id: filtrePeriode !== 'all' ? filtrePeriode : null,
//           region: filtreRegion !== 'all' ? filtreRegion : null,
//           province: filtreProvince !== 'all' ? filtreProvince : null,
//           commune: filtreCommune !== 'all' ? filtreCommune : null,
//           secteur_activite: filtreSecteur !== 'all' ? filtreSecteur : null,
//           genre: filtreGenre !== 'all' ? filtreGenre : null,
//           periodicite: filtrePeriodicite !== 'all' ? filtrePeriodicite : null,
//           categorie: filtreCategorie !== 'all' ? filtreCategorie : null,
//         };

//         console.log('Chargement des données avec les paramètres:', params);
//         const response = await DataService.getStatistiquesData(params);

//         if (response && response.success) {
//           console.log('Données reçues:', response);
//           setDonnees(response);
//         } else {
//           console.error('Réponse invalide:', response);
//           setError('Format de données invalide reçu du serveur.');
//         }
//       } catch (error) {
//         console.error('Erreur lors du chargement des données:', error);
//         setError('Impossible de charger les données du rapport. Veuillez réessayer plus tard.');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [
//     filtreExercice,
//     filtrePeriode,
//     filtreRegion,
//     filtreProvince,
//     filtreCommune,
//     filtreSecteur,
//     filtreGenre,
//     filtrePeriodicite,
//     filtreCategorie,
//   ]);

//   // Réinitialiser les filtres
//   const reinitialiserFiltres = () => {
//     setFiltreExercice(exerciceActif?.id?.toString() || '');
//     setFiltrePeriode('all');
//     setFiltreRegion('all');
//     setFiltreProvince('all');
//     setFiltreCommune('all');
//     setFiltreSecteur('all');
//     setFiltreGenre('all');
//     setFiltrePeriodicite('all');
//     setFiltreCategorie('all');
//   };

//   // Exporter le rapport en PDF
//   const exporterRapport = () => {
//     alert("Fonctionnalité d'export en cours de développement");
//   };

//   // Exporter les données en CSV
//   const exporterCSV = () => {
//     if (!donnees || !donnees.statistiques) {
//       alert("Aucune donnée à exporter");
//       return;
//     }

//     const csvContent = DataService.exportStatsToCsv(donnees.statistiques);
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.setAttribute('href', url);
//     link.setAttribute('download', `rapport-statistique-${new Date().toISOString().slice(0, 10)}.csv`);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   // Définir les indicateurs clés à afficher
//   const indicateursCles = [
//     {
//       id: 'credit_rembourse',
//       titre: 'Crédits remboursés',
//       unite: 'FCFA',
//       couleur: 'orange' as const,
//       icon: <span className="text-xl">🏦</span>,
//     },
//     {
//       id: 'montant_creance_clients_12m',
//       titre: 'Créances clients (12 mois)',
//       unite: 'FCFA',
//       couleur: 'blue' as const,
//       icon: <span className="text-xl">💰</span>,
//     },
//     {
//       id: 'nbr_formation_entrepreneuriat_h',
//       titre: 'Formations (hommes)',
//       unite: '',
//       couleur: 'green' as const,
//       icon: <span className="text-xl">📚</span>,
//     },
//     {
//       id: 'nbr_formation_entrepreneuriat_f',
//       titre: 'Formations (femmes)',
//       unite: '',
//       couleur: 'purple' as const,
//       icon: <span className="text-xl">📚</span>,
//     },
//   ];

//   // Gestion des états de chargement, erreur et données vides
//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-50 border-l-4 border-red-400 p-4">
//         <div className="flex">
//           <div className="ml-3">
//             <p className="text-sm text-red-700">{error}</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!donnees.statistiques || Object.keys(donnees.statistiques).length === 0) {
//     return (
//       <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
//         <div className="flex">
//           <div className="ml-3">
//             <p className="text-sm text-yellow-700">
//               Aucune donnée disponible pour les filtres sélectionnés. Veuillez ajuster les filtres ou vérifier les données.
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       {/* En-tête */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Rapport de synthèse</h1>
//         <div className="flex gap-2">
//           <button
//             onClick={reinitialiserFiltres}
//             className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-2"
//           >
//             <RefreshCw className="h-4 w-4" />
//             Réinitialiser
//           </button>
//           <button
//             onClick={exporterCSV}
//             className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-2"
//           >
//             <Download className="h-4 w-4" />
//             Exporter CSV
//           </button>
//           <button
//             onClick={exporterRapport}
//             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
//           >
//             <Download className="h-4 w-4" />
//             Exporter PDF
//           </button>
//         </div>
//       </div>

//       {/* Filtres */}
//       <FiltreDashboard
//         exercices={exercices}
//         periodes={periodes}
//         filtres={filtres}
//         filtreExercice={filtreExercice}
//         filtrePeriode={filtrePeriode}
//         filtreRegion={filtreRegion}
//         filtreProvince={filtreProvince}
//         filtreCommune={filtreCommune}
//         filtreSecteur={filtreSecteur}
//         filtreGenre={filtreGenre}
//         filtrePeriodicite={filtrePeriodicite}
//         filtreCategorie={filtreCategorie}
//         filtresDisponibles={{ periodicites: [], categories: [] }}
//         setFiltreExercice={setFiltreExercice}
//         setFiltrePeriode={setFiltrePeriode}
//         setFiltreRegion={setFiltreRegion}
//         setFiltreProvince={setFiltreProvince}
//         setFiltreCommune={setFiltreCommune}
//         setFiltreSecteur={setFiltreSecteur}
//         setFiltreGenre={setFiltreGenre}
//         setFiltrePeriodicite={setFiltrePeriodicite}
//         setFiltreCategorie={setFiltreCategorie}
//         reinitialiserFiltres={reinitialiserFiltres}
//       />

//       {/* Section 1: Métriques clés */}
//       <div className="mt-8">
//         <h2 className="text-xl font-semibold text-gray-800 mb-4">Indicateurs clés de performance</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {indicateursCles.map((indicateur) => (
//             <CardMetrique
//               key={indicateur.id}
//               titre={indicateur.titre}
//               valeur={donnees.moyennes?.[indicateur.id] ?? 'N/A'}
//               unite={indicateur.unite}
//               icon={indicateur.icon}
//               couleur={indicateur.couleur}
//               tendance={donnees.tendances?.[indicateur.id] ?? 'stable'}
//               pourcentage={donnees.variations?.[indicateur.id] ?? 0}
//             />
//           ))}
//           {/* Ajouter une carte pour emplois_crees si pertinent */}
//           <CardMetrique
//             titre="Emplois créés"
//             valeur={donnees.totaux?.emplois_crees ?? 'N/A'}
//             unite=""
//             icon={<span className="text-xl">👥</span>}
//             couleur="purple"
//             tendance={donnees.tendances?.emplois_crees ?? 'stable'}
//             pourcentage={donnees.variations?.emplois_crees ?? 0}
//           />
//         </div>
//       </div>

//       {/* Section 2: Évolution temporelle */}
//       <div className="mt-8">
//         <h2 className="text-xl font-semibold text-gray-800 mb-4">Évolution des indicateurs clés</h2>
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {indicateursCles.slice(0, 2).map((indicateur) => (
//             <EvolutionTemporelle
//               key={indicateur.id}
//               exerciceId={filtreExercice}
//               indicateurId={indicateur.id}
//               titre={`Évolution ${indicateur.titre.toLowerCase()}`}
//               filtre={{
//                 region: filtreRegion !== 'all' ? filtreRegion : undefined,
//               }}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Section 3: Rapports comparatifs */}
//       <div className="mt-8">
//         <h2 className="text-xl font-semibold text-gray-800 mb-4">Analyse comparative</h2>
//         <div className="grid grid-cols-1 gap-6">
//           <RapportComparatif
//             exerciceId={filtreExercice}
//             periodeId={filtrePeriode !== 'all' ? filtrePeriode : undefined}
//             indicateurs={indicateursCles.slice(0, 3).map((ind) => ({
//               id: ind.id,
//               nom: ind.titre,
//               couleur: ind.couleur,
//             }))}
//             groupBy="regions"
//             titre="Comparaison des indicateurs par région"
//           />
//           <RapportComparatif
//             exerciceId={filtreExercice}
//             periodeId={filtrePeriode !== 'all' ? filtrePeriode : undefined}
//             indicateurs={indicateursCles.slice(2, 4).map((ind) => ({
//               id: ind.id,
//               nom: ind.titre,
//               couleur: ind.couleur,
//             }))}
//             groupBy="secteur_activite"
//             titre="Comparaison des formations par secteur d'activité"
//           />
//         </div>
//       </div>

//       {/* Section 4: Tableau récapitulatif */}
//       <div className="mt-8">
//         <h2 className="text-xl font-semibold text-gray-800 mb-4">Tableau récapitulatif</h2>
//         <div className="bg-white rounded-lg shadow overflow-hidden">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th
//                   scope="col"
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Indicateur
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Catégorie
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Valeur moyenne
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Valeur minimum
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Valeur maximum
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Tendance
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {Object.entries(donnees.statistiques || {}).map(([indicateurId, stats]: [string, any]) => (
//                 <tr key={indicateurId}>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                     {stats.nom || indicateurId}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {stats.categorie || 'N/A'}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {typeof stats.moyenne === 'number'
//                       ? stats.moyenne.toLocaleString('fr-FR')
//                       : 'N/A'} {stats.unite || ''}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {typeof stats.min === 'number'
//                       ? stats.min.toLocaleString('fr-FR')
//                       : 'N/A'} {stats.unite || ''}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {typeof stats.max === 'number'
//                       ? stats.max.toLocaleString('fr-FR')
//                       : 'N/A'} {stats.unite || ''}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     <span
//                       className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                         stats.tendance === 'hausse'
//                           ? 'bg-green-100 text-green-800'
//                           : stats.tendance === 'baisse'
//                           ? 'bg-red-100 text-red-800'
//                           : 'bg-gray-100 text-gray-800'
//                       }`}
//                     >
//                       {stats.tendance === 'hausse'
//                         ? '↑ Hausse'
//                         : stats.tendance === 'baisse'
//                         ? '↓ Baisse'
//                         : '→ Stable'}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Section 5: Métadonnées et informations techniques */}
//       {donnees.meta && (
//         <div className="mt-8 bg-white rounded-lg shadow p-4">
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">Informations techniques</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             <div className="bg-gray-50 p-3 rounded">
//               <p className="text-sm font-medium text-gray-700">Total des collectes</p>
//               <p className="text-lg font-bold text-gray-900">{donnees.meta.total_collectes}</p>
//             </div>
//             <div className="bg-gray-50 p-3 rounded">
//               <p className="text-sm font-medium text-gray-700">Exercice</p>
//               <p className="text-lg font-bold text-gray-900">ID: {donnees.meta.exercice_id}</p>
//             </div>
//             {donnees.meta.filtres_appliques && Object.keys(donnees.meta.filtres_appliques).length > 0 && (
//               <div className="bg-gray-50 p-3 rounded">
//                 <p className="text-sm font-medium text-gray-700">Filtres appliqués</p>
//                 <div className="flex flex-wrap gap-1 mt-1">
//                   {Object.entries(donnees.meta.filtres_appliques).map(([key, value]) => (
//                     <span key={key} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
//                       {key}: {value as string}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             )}
//             {donnees.meta.request_hash && (
//               <div className="bg-gray-50 p-3 rounded">
//                 <p className="text-sm font-medium text-gray-700">Hash de requête (MD5)</p>
//                 <p className="text-xs font-mono text-gray-500">{donnees.meta.request_hash}</p>
//               </div>
//             )}
//             {donnees.meta.response_hash && (
//               <div className="bg-gray-50 p-3 rounded">
//                 <p className="text-sm font-medium text-gray-700">Hash de réponse (MD5)</p>
//                 <p className="text-xs font-mono text-gray-500">{donnees.meta.response_hash}</p>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useState, useEffect, JSX } from 'react';
import { Download, RefreshCw } from 'lucide-react';
import FiltreDashboard from '@/components/Analyse/Fldsb';
import RapportComparatif from '@/components/Analyse/RapportComparatif';
import CardMetrique from '@/components/Analyse/cmd';
import EvolutionTemporelle from '@/components/Analyse/EvolutionTemporelle';
import DataService from '@/Utils/services/services/DataService';

interface RapportGlobalProps {
  exerciceActif: any;
  exercices: any[];
  periodes: any[];
  filtres: any;
  error?: string;
}

export default function RapportGlobal({ exerciceActif, exercices, periodes, filtres, error: initialError }: RapportGlobalProps): JSX.Element {
  const [filtreExercice, setFiltreExercice] = useState<string>(exerciceActif?.id?.toString() || '');
  const [filtrePeriode, setFiltrePeriode] = useState<string>('all');
  const [filtreRegion, setFiltreRegion] = useState<string>('all');
  const [filtreProvince, setFiltreProvince] = useState<string>('all');
  const [filtreCommune, setFiltreCommune] = useState<string>('all');
  const [filtreSecteur, setFiltreSecteur] = useState<string>('all');
  const [filtreGenre, setFiltreGenre] = useState<string>('all');
  const [filtrePeriodicite, setFiltrePeriodicite] = useState<string>('all');
  const [filtreCategorie, setFiltreCategorie] = useState<string>('all');

  const [donnees, setDonnees] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(initialError || null);

  useEffect(() => {
    if (!filtreExercice) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Créer un objet de paramètres nettoyé
        const params: QueryParams = { exercice_id: filtreExercice };

        // Ajouter seulement les filtres non 'all'
        if (filtrePeriode !== 'all') params.periode_id = filtrePeriode;
        if (filtreRegion !== 'all') params.region = filtreRegion;
        if (filtreProvince !== 'all') params.province = filtreProvince;
        if (filtreCommune !== 'all') params.commune = filtreCommune;
        if (filtreSecteur !== 'all') params.secteur_activite = filtreSecteur;
        if (filtreGenre !== 'all') params.genre = filtreGenre;
        if (filtrePeriodicite !== 'all') params.periodicite = filtrePeriodicite;
        if (filtreCategorie !== 'all') params.categorie = filtreCategorie;

        const response = await DataService.getStatistiquesData(params);

        if (response && response.success) {
          setDonnees(response);
        } else {
          // Afficher l'erreur dans l'interface plutôt que de laisser remplacer la page
          setError(response.error || 'Format de données invalide reçu du serveur.');
        }
      } catch (error) {
        // Capture toutes les erreurs possibles
        console.error('Erreur lors du chargement des données:', error);
        setError('Impossible de charger les données du rapport. Veuillez réessayer plus tard.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [
    filtreExercice,
    filtrePeriode,
    filtreRegion,
    filtreProvince,
    filtreCommune,
    filtreSecteur,
    filtreGenre,
    filtrePeriodicite,
    filtreCategorie,
  ]);



  const reinitialiserFiltres = () => {
    setFiltreExercice(exerciceActif?.id?.toString() || '');
    setFiltrePeriode('all');
    setFiltreRegion('all');
    setFiltreProvince('all');
    setFiltreCommune('all');
    setFiltreSecteur('all');
    setFiltreGenre('all');
    setFiltrePeriodicite('all');
    setFiltreCategorie('all');
  };

  const exporterRapport = () => {
    alert("Fonctionnalité d'export en cours de développement");
  };

  const exporterCSV = () => {
    if (!donnees || !donnees.statistiques) {
      alert("Aucune donnée à exporter");
      return;
    }

    const csvContent = DataService.exportStatsToCsv(donnees.statistiques);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `rapport-statistique-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const indicateursCles = [
    { id: 'credit_rembourse', titre: 'Crédits remboursés', unite: 'FCFA', couleur: 'orange' as const, icon: <span className="text-xl">🏦</span> },
    { id: 'montant_creance_clients_12m', titre: 'Créances clients (12 mois)', unite: 'FCFA', couleur: 'blue' as const, icon: <span className="text-xl">💰</span> },
    { id: 'nbr_formation_entrepreneuriat_h', titre: 'Formations (hommes)', unite: '', couleur: 'green' as const, icon: <span className="text-xl">📚</span> },
    { id: 'nbr_formation_entrepreneuriat_f', titre: 'Formations (femmes)', unite: '', couleur: 'purple' as const, icon: <span className="text-xl">📚</span> },
  ];

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>;
  }

  if (error) {
    return <div className="bg-red-50 border-l-4 border-red-400 p-4"><p className="text-sm text-red-700">{error}</p></div>;
  }

  if (!donnees.statistiques || Object.keys(donnees.statistiques).length === 0) {
    return <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4"><p className="text-sm text-yellow-700">Aucune donnée disponible pour les filtres sélectionnés.</p></div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Rapport de synthèse</h1>
        <div className="flex gap-2">
          <button onClick={reinitialiserFiltres} className="btn-secondary"><RefreshCw className="h-4 w-4" />Réinitialiser</button>
          <button onClick={exporterCSV} className="btn-secondary"><Download className="h-4 w-4" />Exporter CSV</button>
          <button onClick={exporterRapport} className="btn-primary"><Download className="h-4 w-4" />Exporter PDF</button>
        </div>
      </div>

      <FiltreDashboard
        exercices={exercices}
        periodes={periodes}
        filtres={filtres}
        filtreExercice={filtreExercice}
        filtrePeriode={filtrePeriode}
        filtreRegion={filtreRegion}
        filtreProvince={filtreProvince}
        filtreCommune={filtreCommune}
        filtreSecteur={filtreSecteur}
        filtreGenre={filtreGenre}
        filtrePeriodicite={filtrePeriodicite}
        filtreCategorie={filtreCategorie}
        filtresDisponibles={{ periodicites: [], categories: [] }}
        setFiltreExercice={setFiltreExercice}
        setFiltrePeriode={setFiltrePeriode}
        setFiltreRegion={setFiltreRegion}
        setFiltreProvince={setFiltreProvince}
        setFiltreCommune={setFiltreCommune}
        setFiltreSecteur={setFiltreSecteur}
        setFiltreGenre={setFiltreGenre}
        setFiltrePeriodicite={setFiltrePeriodicite}
        setFiltreCategorie={setFiltreCategorie}
        reinitialiserFiltres={reinitialiserFiltres}
      />

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Indicateurs clés de performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {indicateursCles.map((indicateur) => (
            <CardMetrique
              key={indicateur.id}
              titre={indicateur.titre}
              valeur={donnees.moyennes?.[indicateur.id] ?? 'N/A'}
              unite={indicateur.unite}
              icon={indicateur.icon}
              couleur={indicateur.couleur}
              tendance={donnees.tendances?.[indicateur.id] ?? 'stable'}
              pourcentage={donnees.variations?.[indicateur.id] ?? 0}
            />
          ))}
          <CardMetrique
            titre="Emplois créés"
            valeur={donnees.totaux?.emplois_crees ?? 'N/A'}
            unite=""
            icon={<span className="text-xl">👥</span>}
            couleur="purple"
            tendance={donnees.tendances?.emplois_crees ?? 'stable'}
            pourcentage={donnees.variations?.emplois_crees ?? 0}
          />
        </div>
      </div>

      // Dans RapportGlobal.tsx, partie où vous rendez les composants EvolutionTemporelle
<div className="mt-8">
  <h2 className="text-xl font-semibold text-gray-800 mb-4">Evolution des indicateurs</h2>
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {indicateursCles.slice(0, 2).map((indicateur) => (
      <EvolutionTemporelle
        key={indicateur.id}
        exerciceId={filtreExercice}
        indicateurId={indicateur.id}
        titre={`Evolution ${indicateur.titre.toLowerCase()}`}
        filtre={{
          secteur_activite: filtreSecteur !== 'all' ? filtreSecteur : undefined
        }}
      />
    ))}
  </div>
</div>

<div className="mt-8">
  <h2 className="text-xl font-semibold text-gray-800 mb-4">Analyse comparative</h2>
  <div className="grid grid-cols-1 gap-6">
    <RapportComparatif
      exerciceId={filtreExercice}
      periodeId={filtrePeriode !== 'all' ? filtrePeriode : undefined}
      indicateurs={indicateursCles.slice(0, 3).map((ind) => ({ id: ind.id, nom: ind.titre, couleur: ind.couleur }))}
      groupBy="secteur_activite"
      titre="Comparaison des indicateurs par secteur d'activité"
    />
    <RapportComparatif
      exerciceId={filtreExercice}
      periodeId={filtrePeriode !== 'all' ? filtrePeriode : undefined}
      indicateurs={indicateursCles.slice(2, 4).map((ind) => ({ id: ind.id, nom: ind.titre, couleur: ind.couleur }))}
      groupBy="niveau_mise_en_oeuvre"
      titre="Comparaison des formations par niveau de mise en œuvre"
    />
  </div>

      </div>
    </div>
  );
}
