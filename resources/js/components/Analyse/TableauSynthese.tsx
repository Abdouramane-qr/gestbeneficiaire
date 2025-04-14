// import React, { useState, useMemo } from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LabelList } from 'recharts';
// import { Download } from 'lucide-react';

// // Type pour les indicateurs - compatible avec celui d'AnalyseIndicateurs
// interface Indicateur {
//   id: number;
//   indicateur_id: number;
//   nom: string;
//   valeur: number;
//   categorie: string;
//   region?: string;
//   province?: string;
//   commune?: string;
//   secteur_activite?: string;
//   typeBeneficiaire?: string;
//   genre?: string;
//   tendance?: 'hausse' | 'baisse' | 'stable';
//   entreprise_id: number;
//   entreprise_nom: string;
//   exercice_id: number;
//   periode_id: number;
// }

// interface GroupeDonnees {
//   nom: string;
//   count: number;
//   valeurTotale: number;
//   valeurMoyenne: number;
//   indicateurs: Record<string, {
//     somme: number;
//     moyenne: number;
//     count: number;
//     min: number;
//     max: number;
//   }>;
// }

// interface TableauSyntheseProps {
//   indicateurs: Indicateur[];
//   filtres: any;
//   onFiltrageChange?: (filtres: any) => void;
// }

// // Couleurs pour les graphiques - palette améliorée pour une meilleure lisibilité
// const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#6366f1'];

// // Custom tooltip plus lisible
// const CustomTooltip = ({ active, payload, label }: any) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="bg-white p-3 border border-gray-200 rounded shadow-lg text-sm">
//         <p className="font-medium text-gray-800">{label}</p>
//         {payload.map((entry: any, index: number) => (
//           <p key={`item-${index}`} style={{ color: entry.color }}>
//             {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString('fr-FR', {
//               maximumFractionDigits: 2
//             }) : entry.value}
//           </p>
//         ))}
//       </div>
//     );
//   }
//   return null;
// };

// // Composant pour le rendu du label personnalisé dans le PieChart
// const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
//   const RADIAN = Math.PI / 180;
//   const radius = outerRadius * 1.1;
//   const x = cx + radius * Math.cos(-midAngle * RADIAN);
//   const y = cy + radius * Math.sin(-midAngle * RADIAN);

//   if (percent < 0.05) return null; // Ne pas afficher les labels pour les petites portions

//   return (
//     <text
//       x={x}
//       y={y}
//       fill={COLORS[index % COLORS.length]}
//       textAnchor={x > cx ? 'start' : 'end'}
//       dominantBaseline="central"
//       fontSize={12}
//       fontWeight="bold"
//     >
//       {`${name} (${(percent * 100).toFixed(0)}%)`}
//     </text>
//   );
// };

// const TableauSynthese: React.FC<TableauSyntheseProps> = ({ indicateurs }) => {
//   // État pour le groupe de regroupement sélectionné
//   const [critereRegroupement, setCritereRegroupement] = useState<string>('region');
//   const [critereValeur, setCritereValeur] = useState<string>('sum'); // 'sum', 'avg', 'count'
//   const [indicateurSpecifique, setIndicateurSpecifique] = useState<string>('tous');
//   const [categorieFiltre, setCategorieFiltre] = useState<string>('tous');

//   // Obtenir la liste unique des noms d'indicateurs
//   const nomsIndicateurs = useMemo(() => {
//     const noms = new Set<string>();
//     indicateurs.forEach(ind => noms.add(ind.nom));
//     return Array.from(noms);
//   }, [indicateurs]);

//   // Filtrage des indicateurs basé sur la catégorie sélectionnée
//   const indicateursFiltres = useMemo(() => {
//     return indicateurs.filter(ind => {
//       if (categorieFiltre !== 'tous' && ind.categorie !== categorieFiltre) return false;
//       if (indicateurSpecifique !== 'tous' && ind.nom !== indicateurSpecifique) return false;
//       return true;
//     });
//   }, [indicateurs, categorieFiltre, indicateurSpecifique]);

//   // Calculer les données regroupées
//   const donneesRegroupees = useMemo<GroupeDonnees[]>(() => {
//     // Regrouper les données selon le critère sélectionné
//     const groupes = new Map<string, {
//       nom: string;
//       count: number;
//       valeurTotale: number;
//       indicateurs: Map<string, {
//         count: number;
//         somme: number;
//         min: number;
//         max: number;
//       }>;
//     }>();

//     indicateursFiltres.forEach(ind => {
//       const cleGroupe = (ind[critereRegroupement as keyof Indicateur] as string) || 'Non spécifié';

//       if (!groupes.has(cleGroupe)) {
//         groupes.set(cleGroupe, {
//           nom: cleGroupe,
//           count: 0,
//           valeurTotale: 0,
//           indicateurs: new Map()
//         });
//       }

//       const groupe = groupes.get(cleGroupe)!;
//       groupe.count += 1;
//       // S'assurer que la valeur est un nombre
//       const valeur = typeof ind.valeur === 'number' ? ind.valeur : 0;
//       groupe.valeurTotale += valeur;

//       // Regrouper par nom d'indicateur à l'intérieur de chaque groupe
//       if (!groupe.indicateurs.has(ind.nom)) {
//         groupe.indicateurs.set(ind.nom, {
//           count: 0,
//           somme: 0,
//           min: Infinity,
//           max: -Infinity
//         });
//       }

//       const statsIndicateur = groupe.indicateurs.get(ind.nom)!;
//       statsIndicateur.count += 1;
//       statsIndicateur.somme += valeur;
//       statsIndicateur.min = Math.min(statsIndicateur.min, valeur);
//       statsIndicateur.max = Math.max(statsIndicateur.max, valeur);
//     });

//     // Convertir en tableau pour les graphiques
//     return Array.from(groupes.values()).map(groupe => {
//       // Calculer les moyennes pour chaque indicateur
//       const indicateursStats: Record<string, {
//         somme: number;
//         moyenne: number;
//         count: number;
//         min: number;
//         max: number;
//       }> = {};

//       groupe.indicateurs.forEach((stats, nomInd) => {
//         indicateursStats[nomInd] = {
//           somme: stats.somme,
//           moyenne: stats.count > 0 ? stats.somme / stats.count : 0,
//           count: stats.count,
//           min: stats.min === Infinity ? 0 : stats.min,
//           max: stats.max === -Infinity ? 0 : stats.max
//         };
//       });

//       const valeurTotale = Number(groupe.valeurTotale) || 0;
//       const count = Number(groupe.count) || 0;
//       const valeurMoyenne = count > 0 ? valeurTotale / count : 0;

//       return {
//         nom: groupe.nom,
//         count,
//         valeurTotale,
//         valeurMoyenne,
//         indicateurs: indicateursStats
//       };
//     }).sort((a, b) => {
//       // Tri par valeur décroissante selon le critère choisi
//       if (critereValeur === 'sum') return b.valeurTotale - a.valeurTotale;
//       if (critereValeur === 'avg') return b.valeurMoyenne - a.valeurMoyenne;
//       return b.count - a.count; // 'count'
//     }).slice(0, 10); // Limiter à 10 éléments pour une meilleure lisibilité
//   }, [indicateursFiltres, critereRegroupement, critereValeur]);

//   // Calculer les statistiques globales
//   const statistiquesGlobales = useMemo(() => {
//     if (indicateursFiltres.length === 0) return {
//       nombreTotal: 0,
//       valeurTotale: 0,
//       valeurMoyenne: 0,
//       hausse: 0,
//       baisse: 0,
//       stable: 0,
//       maxRegion: { nom: '-', valeur: 0 },
//       distribution: []
//     };

//     // Statistiques de base - s'assurer que les valeurs sont numériques
//     const total = indicateursFiltres.reduce((sum, ind) => {
//       const valeur = typeof ind.valeur === 'number' ? ind.valeur : 0;
//       return sum + valeur;
//     }, 0);
//     const moyenne = indicateursFiltres.length > 0 ? total / indicateursFiltres.length : 0;

//     // Tendances
//     const tendances = {
//       hausse: indicateursFiltres.filter(ind => ind.tendance === 'hausse').length,
//       baisse: indicateursFiltres.filter(ind => ind.tendance === 'baisse').length,
//       stable: indicateursFiltres.filter(ind => ind.tendance === 'stable' || !ind.tendance).length
//     };

//     // Région avec la valeur la plus élevée
//     const regionsMap = new Map<string, { nom: string; valeur: number }>();
//     indicateursFiltres.forEach(ind => {
//       const region = ind.region || 'Non spécifié';
//       if (!regionsMap.has(region)) {
//         regionsMap.set(region, { nom: region, valeur: 0 });
//       }
//       const regionData = regionsMap.get(region)!;
//       const valeur = typeof ind.valeur === 'number' ? ind.valeur : 0;
//       regionData.valeur += valeur;
//     });

//     const regions = Array.from(regionsMap.values());
//     const maxRegion = regions.length > 0
//       ? regions.reduce((max, r) => r.valeur > max.valeur ? r : max, { nom: '-', valeur: 0 })
//       : { nom: '-', valeur: 0 };

//     // Distribution par catégories
//     const categoriesMap = new Map<string, { name: string; value: number }>();
//     indicateursFiltres.forEach(ind => {
//       if (!categoriesMap.has(ind.categorie)) {
//         categoriesMap.set(ind.categorie, { name: ind.categorie, value: 0 });
//       }
//       const categorie = categoriesMap.get(ind.categorie)!;
//       categorie.value += 1;
//     });

//     return {
//       nombreTotal: indicateursFiltres.length,
//       valeurTotale: total,
//       valeurMoyenne: moyenne,
//       hausse: tendances.hausse,
//       baisse: tendances.baisse,
//       stable: tendances.stable,
//       maxRegion,
//       distribution: Array.from(categoriesMap.values())
//     };
//   }, [indicateursFiltres]);

//   // Fonction pour exporter les données regroupées au format CSV
//   const exporterDonnees = () => {
//     let csvContent = "Groupe,Nombre d'indicateurs,Valeur totale,Valeur moyenne\n";

//     donneesRegroupees.forEach(groupe => {
//       const valeurTotale = typeof groupe.valeurTotale === 'number' ? groupe.valeurTotale : 0;
//       const valeurMoyenne = typeof groupe.valeurMoyenne === 'number' ? groupe.valeurMoyenne : 0;

//       csvContent += `"${groupe.nom}",${groupe.count},${valeurTotale.toFixed(2)},${valeurMoyenne.toFixed(2)}\n`;
//     });

//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.setAttribute('href', url);
//     link.setAttribute('download', `synthese_${critereRegroupement}_${new Date().toISOString().split('T')[0]}.csv`);
//     link.style.visibility = 'hidden';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   // Obtenir le titre du graphique principal
//   const getGraphTitle = () => {
//     let titre = `Indicateurs par ${critereRegroupement}`;
//     if (indicateurSpecifique !== 'tous') {
//       titre += ` - ${indicateurSpecifique}`;
//     }
//     if (categorieFiltre !== 'tous') {
//       titre += ` (${categorieFiltre})`;
//     }
//     return titre;
//   };

//   // Fonction pour formater les grands nombres - CORRIGÉE
//   const formatNumber = (numberValue: number | null | undefined): string => {
//     if (numberValue === null || numberValue === undefined || isNaN(Number(numberValue))) {
//       return '0';
//     }

//     // Convertir en nombre explicitement
//     const number = Number(numberValue);

//     if (number >= 1000000) {
//       return (number / 1000000).toFixed(1) + 'M';
//     } else if (number >= 1000) {
//       return (number / 1000).toFixed(1) + 'k';
//     }
//     return number.toFixed(0);
//   };

//   return (
//     <div className="bg-white rounded-lg shadow overflow-hidden">
//       {/* En-tête avec titre et contrôles */}
//       <div className="border-b border-gray-200 p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//         <div>
//           <h2 className="text-xl font-bold text-gray-800">Synthèse des indicateurs</h2>
//           <p className="text-sm text-gray-500">Analyse par regroupement</p>
//         </div>

//         <div className="flex flex-wrap gap-2">
//           {/* Contrôles de regroupement */}
//           <div className="flex items-center bg-gray-50 rounded-md p-1">
//             <select
//               value={categorieFiltre}
//               onChange={(e) => setCategorieFiltre(e.target.value)}
//               className="text-sm border-0 bg-transparent text-gray-700 pr-8 focus:ring-0"
//             >
//               <option value="tous">Toutes catégories</option>
//               <option value="commercial">Indicateurs commerciaux</option>
//               <option value="tresorerie">Indicateurs financiers</option>
//               <option value="production">Indicateurs de production</option>
//               <option value="rh">Indicateurs RH</option>
//             </select>
//           </div>

//           <div className="flex items-center bg-gray-50 rounded-md p-1">
//             <select
//               value={indicateurSpecifique}
//               onChange={(e) => setIndicateurSpecifique(e.target.value)}
//               className="text-sm border-0 bg-transparent text-gray-700 pr-8 focus:ring-0"
//             >
//               <option value="tous">Tous les indicateurs</option>
//               {nomsIndicateurs.map(nom => (
//                 <option key={nom} value={nom}>{nom}</option>
//               ))}
//             </select>
//           </div>

//           <div className="flex items-center bg-gray-50 rounded-md p-1 border border-gray-200">
//             <span className="px-2 text-xs text-gray-500">Regrouper par</span>
//             <select
//               value={critereRegroupement}
//               onChange={(e) => setCritereRegroupement(e.target.value)}
//               className="text-sm border-0 bg-transparent text-gray-700 pr-8 focus:ring-0"
//             >
//               <option value="region">Région</option>
//               <option value="province">Province</option>
//               <option value="commune">Commune</option>
//               <option value="secteur_activite">Secteur d'activité</option>
//               <option value="typeBeneficiaire">Type de bénéficiaire</option>
//               <option value="genre">Genre</option>
//               <option value="entreprise_nom">Entreprise</option>
//             </select>
//           </div>

//           <div className="flex items-center bg-gray-50 rounded-md p-1 border border-gray-200">
//             <span className="px-2 text-xs text-gray-500">Mesure</span>
//             <select
//               value={critereValeur}
//               onChange={(e) => setCritereValeur(e.target.value)}
//               className="text-sm border-0 bg-transparent text-gray-700 pr-8 focus:ring-0"
//             >
//               <option value="sum">Somme</option>
//               <option value="avg">Moyenne</option>
//               <option value="count">Nombre</option>
//             </select>
//           </div>

//           <button
//             onClick={exporterDonnees}
//             className="flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-md text-sm hover:bg-blue-100 transition-colors"
//           >
//             <Download className="h-4 w-4" />
//             <span>Exporter</span>
//           </button>
//         </div>
//       </div>

//       {/* Corps du tableau de bord */}
//       <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
//         {/* Première colonne: Cartes de statistiques */}
//         <div className="lg:col-span-1 space-y-4">
//           {/* Carte de statistiques globales */}
//           <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
//             <div className="p-4 border-b border-gray-200">
//               <h3 className="text-lg font-medium text-gray-800">Statistiques globales</h3>
//             </div>
//             <div className="p-4 space-y-4">
//               {/* KPIs */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="bg-blue-50 rounded-lg p-3">
//                   <p className="text-xs text-blue-500 mb-1">Nombre total</p>
//                   <p className="text-2xl font-bold text-blue-700">{statistiquesGlobales.nombreTotal}</p>
//                 </div>
//                 <div className="bg-green-50 rounded-lg p-3">
//                   <p className="text-xs text-green-500 mb-1">Valeur totale</p>
//                   <p className="text-2xl font-bold text-green-700">{formatNumber(statistiquesGlobales.valeurTotale)}</p>
//                 </div>
//                 <div className="bg-purple-50 rounded-lg p-3">
//                   <p className="text-xs text-purple-500 mb-1">Valeur moyenne</p>
//                   <p className="text-2xl font-bold text-purple-700">{formatNumber(statistiquesGlobales.valeurMoyenne)}</p>
//                 </div>
//                 <div className="bg-orange-50 rounded-lg p-3">
//                   <p className="text-xs text-orange-500 mb-1">Top {critereRegroupement}</p>
//                   <p className="text-base font-bold text-orange-700">{statistiquesGlobales.maxRegion.nom}</p>
//                   <p className="text-xs text-orange-500">{formatNumber(statistiquesGlobales.maxRegion.valeur)}</p>
//                 </div>
//               </div>

//               {/* Tendances */}
//               <div className="bg-gray-50 rounded-lg p-3">
//                 <p className="text-xs text-gray-500 mb-2">Tendances</p>
//                 <div className="flex items-center gap-2 mt-1">
//                   <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
//                     <div
//                       className="h-full bg-green-500 rounded-full"
//                       style={{ width: `${statistiquesGlobales.nombreTotal ? (statistiquesGlobales.hausse / statistiquesGlobales.nombreTotal) * 100 : 0}%` }}
//                     />
//                   </div>
//                   <span className="text-xs text-gray-600 w-14 text-right">
//                     {statistiquesGlobales.hausse} hausse
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-2 mt-1">
//                   <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
//                     <div
//                       className="h-full bg-red-500 rounded-full"
//                       style={{ width: `${statistiquesGlobales.nombreTotal ? (statistiquesGlobales.baisse / statistiquesGlobales.nombreTotal) * 100 : 0}%` }}
//                     />
//                   </div>
//                   <span className="text-xs text-gray-600 w-14 text-right">
//                     {statistiquesGlobales.baisse} baisse
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-2 mt-1">
//                   <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
//                     <div
//                       className="h-full bg-gray-500 rounded-full"
//                       style={{ width: `${statistiquesGlobales.nombreTotal ? (statistiquesGlobales.stable / statistiquesGlobales.nombreTotal) * 100 : 0}%` }}
//                     />
//                   </div>
//                   <span className="text-xs text-gray-600 w-14 text-right">
//                     {statistiquesGlobales.stable} stable
//                   </span>
//                 </div>
//               </div>

//               {/* Distribution par catégorie */}
//               <div className="rounded-lg p-3 border border-gray-200">
//                 <p className="text-xs text-gray-500 mb-2">Distribution par catégorie</p>
//                 <div className="h-48">
//                   {statistiquesGlobales.distribution.length > 0 ? (
//                     <ResponsiveContainer width="100%" height="100%">
//                       <PieChart>
//                         <Pie
//                           data={statistiquesGlobales.distribution}
//                           cx="50%"
//                           cy="50%"
//                           labelLine={false}
//                           outerRadius={70}
//                           fill="#8884d8"
//                           dataKey="value"
//                           label={renderCustomizedLabel}
//                         >
//                           {statistiquesGlobales.distribution.map((entry, index) => (
//                             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                           ))}
//                         </Pie>
//                         <Tooltip
//                           formatter={(value) => [`${value} indicateurs`, "Nombre"]}
//                           labelFormatter={(label) => `Catégorie: ${label}`}
//                           contentStyle={{
//                             backgroundColor: 'white',
//                             borderRadius: '6px',
//                             boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
//                             padding: '10px'
//                           }}
//                         />
//                       </PieChart>
//                     </ResponsiveContainer>
//                   ) : (
//                     <div className="h-full flex items-center justify-center text-gray-400">
//                       Aucune donnée disponible
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Deuxième et troisième colonnes: Graphiques principaux */}
//         <div className="lg:col-span-2 space-y-4">
//           {/* Graphique principal: regroupement sélectionné */}
//           <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
//             <div className="p-4 border-b border-gray-200">
//               <h3 className="text-lg font-medium text-gray-800">{getGraphTitle()}</h3>
//               <p className="text-xs text-gray-500 mt-1">Top 10 résultats affichés pour une meilleure lisibilité</p>
//             </div>
//             <div className="p-4 h-80">
//               {donneesRegroupees.length > 0 ? (
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart
//                     data={donneesRegroupees}
//                     margin={{ top: 20, right: 30, left: 30, bottom: 60 }}
//                   >
//                     <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
//                     <XAxis
//                       dataKey="nom"
//                       angle={-45}
//                       textAnchor="end"
//                       height={80}
//                       tick={{ fontSize: 11 }}
//                       interval={0}
//                     />
//                     <YAxis
//                       tickFormatter={(value) => formatNumber(value)}
//                       tick={{ fontSize: 11 }}
//                     />
//                     <Tooltip content={<CustomTooltip />} />
//                     <Legend wrapperStyle={{ paddingTop: 10 }} />
//                     {critereValeur === 'sum' && (
//                       <Bar
//                         dataKey="valeurTotale"
//                         fill={COLORS[0]}
//                         name="Valeur totale"
//                         barSize={30}
//                       >
//                         <LabelList dataKey="valeurTotale" position="top" formatter={formatNumber} style={{ fontSize: '11px' }} />
//                       </Bar>
//                     )}
//                     {critereValeur === 'avg' && (
//                       <Bar
//                         dataKey="valeurMoyenne"
//                         fill={COLORS[1]}
//                         name="Moyenne"
//                         barSize={30}
//                       >
//                         <LabelList dataKey="valeurMoyenne" position="top" formatter={(value) => Number(value).toFixed(1)} style={{ fontSize: '11px' }} />
//                       </Bar>
//                     )}
//                     {critereValeur === 'count' && (
//                       <Bar
//                         dataKey="count"
//                         fill={COLORS[2]}
//                         name="Nombre"
//                         barSize={30}
//                       >
//                         <LabelList dataKey="count" position="top" style={{ fontSize: '11px' }} />
//                       </Bar>
//                     )}
//                   </BarChart>
//                 </ResponsiveContainer>
//               ) : (
//                 <div className="h-full flex items-center justify-center text-gray-400">
//                   Aucune donnée disponible
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Tableau détaillé */}
//           <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
//             <div className="p-4 border-b border-gray-200">
//               <h3 className="text-lg font-medium text-gray-800">Tableau détaillé</h3>
//             </div>
//             <div className="p-4 overflow-auto">
//               {donneesRegroupees.length > 0 ? (
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         {critereRegroupement}
//                       </th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Nombre
//                       </th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Valeur totale
//                       </th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Moyenne
//                       </th>
//                       {indicateurSpecifique !== 'tous' && (
//                         <>
//                           <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Min
//                           </th>
//                           <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Max
//                           </th>
//                         </>
//                       )}
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {donneesRegroupees.map((groupe, index) => (
//                       <tr key={`groupe-${index}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                           {groupe.nom}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {groupe.count}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {typeof groupe.valeurTotale === 'number' ? groupe.valeurTotale.toFixed(2) : '0.00'}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {typeof groupe.valeurMoyenne === 'number' ? groupe.valeurMoyenne.toFixed(2) : '0.00'}
//                         </td>
//                         {indicateurSpecifique !== 'tous' && (
//                           <>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                               {groupe.indicateurs[indicateurSpecifique] && typeof groupe.indicateurs[indicateurSpecifique].min === 'number'
//                                 ? groupe.indicateurs[indicateurSpecifique].min.toFixed(2)
//                                 : '-'}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                               {groupe.indicateurs[indicateurSpecifique] && typeof groupe.indicateurs[indicateurSpecifique].max === 'number'
//                                 ? groupe.indicateurs[indicateurSpecifique].max.toFixed(2)
//                                 : '-'}
//                             </td>
//                           </>
//                         )}
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               ) : (
//                 <div className="text-center py-10 text-gray-500">
//                   Aucune donnée disponible
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TableauSynthese;
import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LabelList } from 'recharts';
import { Download } from 'lucide-react';

// Type pour les indicateurs - compatible avec celui d'AnalyseIndicateurs
interface Indicateur {
  id: number;
  indicateur_id: number;
  nom: string;
  valeur: number;
  categorie: string;
  region?: string;
  province?: string;
  commune?: string;
  secteur_activite?: string;
  typeBeneficiaire?: string;
  genre?: string;
  tendance?: 'hausse' | 'baisse' | 'stable';
  entreprise_id: number;
  entreprise_nom: string;
  exercice_id: number;
  periode_id: number;
}

interface GroupeDonnees {
  nom: string;
  count: number;
  valeurTotale: number;
  valeurMoyenne: number;
  indicateurs: Record<string, {
    somme: number;
    moyenne: number;
    count: number;
    min: number;
    max: number;
  }>;
}

interface TableauSyntheseProps {
  indicateurs: Indicateur[];
  filtres: any;
  onFiltrageChange?: (filtres: any) => void;
}

// Couleurs pour les graphiques - palette améliorée pour une meilleure lisibilité
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#6366f1'];

// Custom tooltip plus lisible
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded shadow-lg text-sm">
        <p className="font-medium text-gray-800">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString('fr-FR', {
              maximumFractionDigits: 2
            }) : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Composant pour le rendu du label personnalisé dans le PieChart
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius * 1.1;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.05) return null; // Ne pas afficher les labels pour les petites portions

  return (
    <text
      x={x}
      y={y}
      fill={COLORS[index % COLORS.length]}
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize={12}
      fontWeight="bold"
    >
      {`${name} (${(percent * 100).toFixed(0)}%)`}
    </text>
  );
};

const TableauSynthese: React.FC<TableauSyntheseProps> = ({ indicateurs }) => {
  // État pour le groupe de regroupement sélectionné
  const [critereRegroupement, setCritereRegroupement] = useState<string>('region');
  const [critereValeur, setCritereValeur] = useState<string>('sum'); // 'sum', 'avg', 'count'
  const [indicateurSpecifique, setIndicateurSpecifique] = useState<string>('tous');
  const [categorieFiltre, setCategorieFiltre] = useState<string>('tous');

  // Obtenir la liste unique des noms d'indicateurs
  const nomsIndicateurs = useMemo(() => {
    const noms = new Set<string>();
    indicateurs.forEach(ind => noms.add(ind.nom));
    return Array.from(noms);
  }, [indicateurs]);

  // Obtenir la liste des catégories disponibles
  const categoriesDisponibles = useMemo(() => {
    const categories = new Set<string>();
    indicateurs.forEach(ind => categories.add(ind.categorie));
    return Array.from(categories);
  }, [indicateurs]);

  // Mapping des catégories pour affichage
  const categoriesMap = {
    'commercial': 'Indicateurs commerciaux',
    'financier': 'Indicateurs financiers',
    'production': 'Indicateurs de production',
    'rh': 'Indicateurs RH',
    'tresorerie': 'Indicateurs de trésorerie',
    'rentabilite': 'Indicateurs de rentabilité',
    'activite': 'Indicateurs d\'activité',
    'performance': 'Indicateurs de performance'
  };

  // Filtrage des indicateurs basé sur la catégorie sélectionnée
  const indicateursFiltres = useMemo(() => {
    return indicateurs.filter(ind => {
      if (categorieFiltre !== 'tous' && ind.categorie !== categorieFiltre) return false;
      if (indicateurSpecifique !== 'tous' && ind.nom !== indicateurSpecifique) return false;
      return true;
    });
  }, [indicateurs, categorieFiltre, indicateurSpecifique]);

  // Calculer les données regroupées
  const donneesRegroupees = useMemo<GroupeDonnees[]>(() => {
    // Regrouper les données selon le critère sélectionné
    const groupes = new Map<string, {
      nom: string;
      count: number;
      valeurTotale: number;
      indicateurs: Map<string, {
        count: number;
        somme: number;
        min: number;
        max: number;
      }>;
    }>();

    indicateursFiltres.forEach(ind => {
      const cleGroupe = (ind[critereRegroupement as keyof Indicateur] as string) || 'Non spécifié';

      if (!groupes.has(cleGroupe)) {
        groupes.set(cleGroupe, {
          nom: cleGroupe,
          count: 0,
          valeurTotale: 0,
          indicateurs: new Map()
        });
      }

      const groupe = groupes.get(cleGroupe)!;
      groupe.count += 1;
      // S'assurer que la valeur est un nombre
      const valeur = typeof ind.valeur === 'number' ? ind.valeur : 0;
      groupe.valeurTotale += valeur;

      // Regrouper par nom d'indicateur à l'intérieur de chaque groupe
      if (!groupe.indicateurs.has(ind.nom)) {
        groupe.indicateurs.set(ind.nom, {
          count: 0,
          somme: 0,
          min: Infinity,
          max: -Infinity
        });
      }

      const statsIndicateur = groupe.indicateurs.get(ind.nom)!;
      statsIndicateur.count += 1;
      statsIndicateur.somme += valeur;
      statsIndicateur.min = Math.min(statsIndicateur.min, valeur);
      statsIndicateur.max = Math.max(statsIndicateur.max, valeur);
    });

    // Convertir en tableau pour les graphiques
    return Array.from(groupes.values()).map(groupe => {
      // Calculer les moyennes pour chaque indicateur
      const indicateursStats: Record<string, {
        somme: number;
        moyenne: number;
        count: number;
        min: number;
        max: number;
      }> = {};

      groupe.indicateurs.forEach((stats, nomInd) => {
        indicateursStats[nomInd] = {
          somme: stats.somme,
          moyenne: stats.count > 0 ? stats.somme / stats.count : 0,
          count: stats.count,
          min: stats.min === Infinity ? 0 : stats.min,
          max: stats.max === -Infinity ? 0 : stats.max
        };
      });

      const valeurTotale = Number(groupe.valeurTotale) || 0;
      const count = Number(groupe.count) || 0;
      const valeurMoyenne = count > 0 ? valeurTotale / count : 0;

      return {
        nom: groupe.nom,
        count,
        valeurTotale,
        valeurMoyenne,
        indicateurs: indicateursStats
      };
    }).sort((a, b) => {
      // Tri par valeur décroissante selon le critère choisi
      if (critereValeur === 'sum') return b.valeurTotale - a.valeurTotale;
      if (critereValeur === 'avg') return b.valeurMoyenne - a.valeurMoyenne;
      return b.count - a.count; // 'count'
    }).slice(0, 10); // Limiter à 10 éléments pour une meilleure lisibilité
  }, [indicateursFiltres, critereRegroupement, critereValeur]);

  // Calculer les statistiques globales
  const statistiquesGlobales = useMemo(() => {
    if (indicateursFiltres.length === 0) return {
      nombreTotal: 0,
      valeurTotale: 0,
      valeurMoyenne: 0,
      hausse: 0,
      baisse: 0,
      stable: 0,
      maxRegion: { nom: '-', valeur: 0 },
      distribution: []
    };

    // Statistiques de base - s'assurer que les valeurs sont numériques
    const total = indicateursFiltres.reduce((sum, ind) => {
      const valeur = typeof ind.valeur === 'number' ? ind.valeur : 0;
      return sum + valeur;
    }, 0);
    const moyenne = indicateursFiltres.length > 0 ? total / indicateursFiltres.length : 0;

    // Tendances
    const tendances = {
      hausse: indicateursFiltres.filter(ind => ind.tendance === 'hausse').length,
      baisse: indicateursFiltres.filter(ind => ind.tendance === 'baisse').length,
      stable: indicateursFiltres.filter(ind => ind.tendance === 'stable' || !ind.tendance).length
    };

    // Région avec la valeur la plus élevée
    const regionsMap = new Map<string, { nom: string; valeur: number }>();
    indicateursFiltres.forEach(ind => {
      const region = ind.region || 'Non spécifié';
      if (!regionsMap.has(region)) {
        regionsMap.set(region, { nom: region, valeur: 0 });
      }
      const regionData = regionsMap.get(region)!;
      const valeur = typeof ind.valeur === 'number' ? ind.valeur : 0;
      regionData.valeur += valeur;
    });

    const regions = Array.from(regionsMap.values());
    const maxRegion = regions.length > 0
      ? regions.reduce((max, r) => r.valeur > max.valeur ? r : max, { nom: '-', valeur: 0 })
      : { nom: '-', valeur: 0 };

    // Distribution par catégories
    const categoriesMap = new Map<string, { name: string; value: number }>();
    indicateursFiltres.forEach(ind => {
      if (!categoriesMap.has(ind.categorie)) {
        categoriesMap.set(ind.categorie, { name: ind.categorie, value: 0 });
      }
      const categorie = categoriesMap.get(ind.categorie)!;
      categorie.value += 1;
    });

    return {
      nombreTotal: indicateursFiltres.length,
      valeurTotale: total,
      valeurMoyenne: moyenne,
      hausse: tendances.hausse,
      baisse: tendances.baisse,
      stable: tendances.stable,
      maxRegion,
      distribution: Array.from(categoriesMap.values())
    };
  }, [indicateursFiltres]);

  // Fonction pour exporter les données regroupées au format CSV
  const exporterDonnees = () => {
    let csvContent = "Groupe,Nombre d'indicateurs,Valeur totale,Valeur moyenne\n";

    donneesRegroupees.forEach(groupe => {
      const valeurTotale = typeof groupe.valeurTotale === 'number' ? groupe.valeurTotale : 0;
      const valeurMoyenne = typeof groupe.valeurMoyenne === 'number' ? groupe.valeurMoyenne : 0;

      csvContent += `"${groupe.nom}",${groupe.count},${valeurTotale.toFixed(2)},${valeurMoyenne.toFixed(2)}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `synthese_${critereRegroupement}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Obtenir le titre du graphique principal
  const getGraphTitle = () => {
    let titre = `Indicateurs par ${critereRegroupement}`;
    if (indicateurSpecifique !== 'tous') {
      titre += ` - ${indicateurSpecifique}`;
    }
    if (categorieFiltre !== 'tous') {
      titre += ` (${getCategoryDisplayName(categorieFiltre)})`;
    }
    return titre;
  };

  // Fonction pour formater les grands nombres - CORRIGÉE
  const formatNumber = (numberValue: number | null | undefined): string => {
    if (numberValue === null || numberValue === undefined || isNaN(Number(numberValue))) {
      return '0';
    }

    // Convertir en nombre explicitement
    const number = Number(numberValue);

    if (number >= 1000000) {
      return (number / 1000000).toFixed(1) + 'M';
    } else if (number >= 1000) {
      return (number / 1000).toFixed(1) + 'k';
    }
    return number.toFixed(0);
  };

  // Fonction pour obtenir le nom d'affichage d'une catégorie
  const getCategoryDisplayName = (categoryId: string) => {
    return categoriesMap[categoryId as keyof typeof categoriesMap] || categoryId;
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* En-tête avec titre et contrôles */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Synthèse des indicateurs</h2>
              <p className="text-sm text-gray-500">Analyse par regroupement</p>
            </div>
          </div>

          {/* Conteneur pour les filtres alignés horizontalement */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {/* Filtre par catégorie */}
            <div className="flex items-center bg-gray-50 rounded-md p-1 w-full">
              <select
                value={categorieFiltre}
                onChange={(e) => setCategorieFiltre(e.target.value)}
                className="text-sm border-0 bg-transparent text-gray-700 pr-8 focus:ring-0 w-full"
              >
                <option value="tous">Toutes catégories</option>
                {categoriesDisponibles.map(cat => (
                  <option key={cat} value={cat}>
                    {getCategoryDisplayName(cat)}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtre par indicateur */}
            <div className="flex items-center bg-gray-50 rounded-md p-1 w-full">
              <select
                value={indicateurSpecifique}
                onChange={(e) => setIndicateurSpecifique(e.target.value)}
                className="text-sm border-0 bg-transparent text-gray-700 pr-8 focus:ring-0 w-full"
              >
                <option value="tous">Tous les indicateurs</option>
                {nomsIndicateurs.map(nom => (
                  <option key={nom} value={nom}>{nom}</option>
                ))}
              </select>
            </div>

            {/* Critère de regroupement */}
            <div className="flex items-center bg-gray-50 rounded-md p-1 border border-gray-200 w-full">
              <span className="px-2 text-xs text-gray-500 whitespace-nowrap">Regrouper par</span>
              <select
                value={critereRegroupement}
                onChange={(e) => setCritereRegroupement(e.target.value)}
                className="text-sm border-0 bg-transparent text-gray-700 pr-8 focus:ring-0 w-full"
              >
                <option value="region">Région</option>
                <option value="province">Province</option>
                <option value="commune">Commune</option>
                <option value="secteur_activite">Secteur d'activité</option>
                <option value="typeBeneficiaire">Type de bénéficiaire</option>
                <option value="genre">Genre</option>
                <option value="entreprise_nom">Entreprise</option>
              </select>
            </div>

            {/* Critère de valeur */}
            <div className="flex items-center bg-gray-50 rounded-md p-1 border border-gray-200 w-full">
              <span className="px-2 text-xs text-gray-500 whitespace-nowrap">Mesure</span>
              <select
                value={critereValeur}
                onChange={(e) => setCritereValeur(e.target.value)}
                className="text-sm border-0 bg-transparent text-gray-700 pr-8 focus:ring-0 w-full"
              >
                <option value="sum">Somme</option>
                <option value="avg">Moyenne</option>
                <option value="count">Nombre</option>
              </select>
            </div>

            {/* Bouton d'export */}
            <button
              onClick={exporterDonnees}
              className="flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-md text-sm hover:bg-blue-100 transition-colors w-full justify-center"
            >
              <Download className="h-4 w-4" />
              <span>Exporter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Corps du tableau de bord */}
      <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Première colonne: Cartes de statistiques */}
        <div className="lg:col-span-1 space-y-4">
          {/* Carte de statistiques globales */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-800">Statistiques globales</h3>
            </div>
            <div className="p-4 space-y-4">
              {/* KPIs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-blue-500 mb-1">Nombre total</p>
                  <p className="text-2xl font-bold text-blue-700">{statistiquesGlobales.nombreTotal}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-xs text-green-500 mb-1">Valeur totale</p>
                  <p className="text-2xl font-bold text-green-700">{formatNumber(statistiquesGlobales.valeurTotale)}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <p className="text-xs text-purple-500 mb-1">Valeur moyenne</p>
                  <p className="text-2xl font-bold text-purple-700">{formatNumber(statistiquesGlobales.valeurMoyenne)}</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-3">
                  <p className="text-xs text-orange-500 mb-1">Top {critereRegroupement}</p>
                  <p className="text-base font-bold text-orange-700">{statistiquesGlobales.maxRegion.nom}</p>
                  <p className="text-xs text-orange-500">{formatNumber(statistiquesGlobales.maxRegion.valeur)}</p>
                </div>
              </div>

              {/* Tendances */}
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-2">Tendances</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${statistiquesGlobales.nombreTotal ? (statistiquesGlobales.hausse / statistiquesGlobales.nombreTotal) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600 w-14 text-right">
                    {statistiquesGlobales.hausse} hausse
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 rounded-full"
                      style={{ width: `${statistiquesGlobales.nombreTotal ? (statistiquesGlobales.baisse / statistiquesGlobales.nombreTotal) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600 w-14 text-right">
                    {statistiquesGlobales.baisse} baisse
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gray-500 rounded-full"
                      style={{ width: `${statistiquesGlobales.nombreTotal ? (statistiquesGlobales.stable / statistiquesGlobales.nombreTotal) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600 w-14 text-right">
                    {statistiquesGlobales.stable} stable
                  </span>
                </div>
              </div>

              {/* Distribution par catégorie */}
              <div className="rounded-lg p-3 border border-gray-200">
                <p className="text-xs text-gray-500 mb-2">Distribution par catégorie</p>
                <div className="h-48">
                  {statistiquesGlobales.distribution.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statistiquesGlobales.distribution.map(item => ({
                            ...item,
                            // Remplacer le nom de la catégorie par son nom d'affichage
                            name: getCategoryDisplayName(item.name)
                          }))}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={70}
                          fill="#8884d8"
                          dataKey="value"
                          label={renderCustomizedLabel}
                        >
                          {statistiquesGlobales.distribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [`${value} indicateurs`, "Nombre"]}
                          labelFormatter={(label) => `Catégorie: ${label}`}
                          contentStyle={{
                            backgroundColor: 'white',
                            borderRadius: '6px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            padding: '10px'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">
                      Aucune donnée disponible
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Deuxième et troisième colonnes: Graphiques principaux */}
        <div className="lg:col-span-2 space-y-4">
          {/* Graphique principal: regroupement sélectionné */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-800">{getGraphTitle()}</h3>
              <p className="text-xs text-gray-500 mt-1">Top 10 résultats affichés pour une meilleure lisibilité</p>
            </div>
            <div className="p-4 h-80">
              {donneesRegroupees.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={donneesRegroupees}
                    margin={{ top: 20, right: 30, left: 30, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis
                      dataKey="nom"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      tick={{ fontSize: 11 }}
                      interval={0}
                    />
                    <YAxis
                      tickFormatter={(value) => formatNumber(value)}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ paddingTop: 10 }} />
                    {critereValeur === 'sum' && (
                      <Bar
                        dataKey="valeurTotale"
                        fill={COLORS[0]}
                        name="Valeur totale"
                        barSize={30}
                      >
                        <LabelList dataKey="valeurTotale" position="top" formatter={formatNumber} style={{ fontSize: '11px' }} />
                      </Bar>
                    )}
                    {critereValeur === 'avg' && (
                      <Bar
                        dataKey="valeurMoyenne"
                        fill={COLORS[1]}
                        name="Moyenne"
                        barSize={30}
                      >
                        <LabelList dataKey="valeurMoyenne" position="top" formatter={(value: any) => Number(value).toFixed(1)} style={{ fontSize: '11px' }} />
                      </Bar>
                    )}
                    {critereValeur === 'count' && (
                      <Bar
                        dataKey="count"
                        fill={COLORS[2]}
                        name="Nombre"
                        barSize={30}
                      >
                        <LabelList dataKey="count" position="top" style={{ fontSize: '11px' }} />
                      </Bar>
                    )}
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  Aucune donnée disponible
                </div>
              )}
            </div>
          </div>

          {/* Tableau détaillé */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-800">Tableau détaillé</h3>
            </div>
            <div className="p-4 overflow-auto">
              {donneesRegroupees.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {critereRegroupement}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nombre
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Valeur totale
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Moyenne
                      </th>
                      {indicateurSpecifique !== 'tous' && (
                        <>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Min
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Max
                          </th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {donneesRegroupees.map((groupe, index) => (
                      <tr key={`groupe-${index}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {groupe.nom}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {groupe.count}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {typeof groupe.valeurTotale === 'number' ? groupe.valeurTotale.toFixed(2) : '0.00'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {typeof groupe.valeurMoyenne === 'number' ? groupe.valeurMoyenne.toFixed(2) : '0.00'}
                        </td>
                        {indicateurSpecifique !== 'tous' && (
                          <>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {groupe.indicateurs[indicateurSpecifique] && typeof groupe.indicateurs[indicateurSpecifique].min === 'number'
                                ? groupe.indicateurs[indicateurSpecifique].min.toFixed(2)
                                : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {groupe.indicateurs[indicateurSpecifique] && typeof groupe.indicateurs[indicateurSpecifique].max === 'number'
                                ? groupe.indicateurs[indicateurSpecifique].max.toFixed(2)
                                : '-'}
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  Aucune donnée disponible
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
  export default TableauSynthese;

