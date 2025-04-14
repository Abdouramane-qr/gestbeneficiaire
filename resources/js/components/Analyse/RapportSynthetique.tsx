// import React, { useMemo, useState } from 'react';
// import { Bar, BarChart, CartesianGrid, Legend,  ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
// import { BarChart2, FileText, Map, TrendingUp, Download, Filter } from 'lucide-react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// // Types adaptés au backend
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

// interface Exercice {
//   id: number;
//   annee: number;
//   date_debut: string;
//   date_fin: string;
//   actif: boolean;
// }

// interface Periode {
//   id: number;
//   nom: string;
//   exercice_id: number;
// }

// interface IndicateurDetail {
//   nom: string;
//   count: number;
//   somme: number;
//   moyenne: number;
//   min: number;
//   max: number;
//   nbEntreprises: number;
//   entreprises: Set<number>;
// }

// interface CategorieDetail {
//   nom: string;
//   count: number;
//   valeurTotale: number;
//   valeurMoyenne: number;
//   indicateursListe: IndicateurDetail[];
// }

// interface EntrepriseDetail {
//   id: number;
//   nom: string;
//   count: number;
//   valeurTotale: number;
//   valeurMoyenne: number;
//   indicateurs: Array<{
//     nom: string;
//     moyenne: number;
//   }>;
// }

// interface GroupeGeographique {
//   nom: string;
//   count: number;
//   valeurTotale: number;
//   valeurMoyenne: number;
//   indicateurs: Record<string, {
//     count: number;
//     somme: number;
//   }>;
// }

// interface RapportSynthetiqueProps {
//   exerciceActif: Exercice;
//   periodes: Periode[];
//   indicateurs: Indicateur[];
// }

// // Couleurs pour les graphiques
// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A259FF', '#4CAF50', '#F44336', '#9C27B0'];

// const RapportSynthetique: React.FC<RapportSynthetiqueProps> = ({
//   exerciceActif,
//   periodes,
//   indicateurs
// }) => {
//   const [activeTab, setActiveTab] = useState<string>('apercu');
//   const [categorieSelectionnee, setCategorieSelectionnee] = useState<string>('all');
//   const [periodeSelectionnee, setPeriodeSelectionnee] = useState<number | 'all'>(periodes.length > 0 ? periodes[0].id : 'all');

//   // Filtrer les indicateurs par catégorie et période
//   const indicateursFiltres = useMemo(() => {
//     return indicateurs.filter(ind => {
//       const matchCategorie = categorieSelectionnee === 'all' || ind.categorie === categorieSelectionnee;
//       const matchPeriode = periodeSelectionnee === 'all' || ind.periode_id === periodeSelectionnee;
//       return matchCategorie && matchPeriode;
//     });
//   }, [indicateurs, categorieSelectionnee, periodeSelectionnee]);

//   // Calculer les statistiques par tendance
//   const statistiquesTendances = useMemo(() => {
//     const tendances = {
//       hausse: indicateursFiltres.filter(ind => ind.tendance === 'hausse').length,
//       baisse: indicateursFiltres.filter(ind => ind.tendance === 'baisse').length,
//       stable: indicateursFiltres.filter(ind => ind.tendance === 'stable' || !ind.tendance).length
//     };

//     const total = tendances.hausse + tendances.baisse + tendances.stable;

//     return {
//       ...tendances,
//       total,
//       pourcentageHausse: total > 0 ? (tendances.hausse / total) * 100 : 0,
//       pourcentageBaisse: total > 0 ? (tendances.baisse / total) * 100 : 0,
//       pourcentageStable: total > 0 ? (tendances.stable / total) * 100 : 0
//     };
//   }, [indicateursFiltres]);

//   // Regrouper par entreprise pour la vue comparaison
//   const donneesParEntreprise = useMemo<EntrepriseDetail[]>(() => {
//     const entreprises = new Map<number, {
//       id: number,
//       nom: string,
//       count: number,
//       valeurTotale: number,
//       indicateursMoyenne: Record<string, {
//         somme: number,
//         count: number
//       }>
//     }>();

//     indicateursFiltres.forEach(ind => {
//       if (!entreprises.has(ind.entreprise_id)) {
//         entreprises.set(ind.entreprise_id, {
//           id: ind.entreprise_id,
//           nom: ind.entreprise_nom,
//           count: 0,
//           valeurTotale: 0,
//           indicateursMoyenne: {}
//         });
//       }

//       const entreprise = entreprises.get(ind.entreprise_id)!;
//       entreprise.count += 1;
//       entreprise.valeurTotale += ind.valeur;

//       // Stocker les valeurs par nom d'indicateur
//       if (!entreprise.indicateursMoyenne[ind.nom]) {
//         entreprise.indicateursMoyenne[ind.nom] = {
//           somme: 0,
//           count: 0
//         };
//       }

//       entreprise.indicateursMoyenne[ind.nom].somme += ind.valeur;
//       entreprise.indicateursMoyenne[ind.nom].count += 1;
//     });

//     // Convertir en tableau pour les graphiques
//     return Array.from(entreprises.values())
//       .map(ent => ({
//         ...ent,
//         valeurMoyenne: ent.count > 0 ? ent.valeurTotale / ent.count : 0,
//         // Calculer les moyennes par indicateur
//         indicateurs: Object.entries(ent.indicateursMoyenne).map(([nom, stats]) => ({
//           nom,
//           moyenne: stats.count > 0 ? stats.somme / stats.count : 0
//         }))
//       }))
//       .sort((a, b) => b.valeurTotale - a.valeurTotale);
//   }, [indicateursFiltres]);

//   // Fonction pour formater les grands nombres
//   const formatNumber = (number: number | null | undefined): string => {
//     // Vérification que la valeur est un nombre valide
//     if (number === null || number === undefined || isNaN(number)) {
//       return '0';
//     }

//     if (number >= 1000000) {
//       return (number / 1000000).toFixed(1) + 'M';
//     } else if (number >= 1000) {
//       return (number / 1000).toFixed(1) + 'k';
//     }
//     return number.toFixed(0);
//   };

//   // Fonction pour avoir le nom complet de la catégorie
//   const getNomCategorie = (categorie: string): string => {
//     const categories: Record<string, string> = {
//       'commercial': 'Indicateurs commerciaux',
//       'tresorerie': 'Indicateurs financiers',
//       'production': 'Indicateurs de production',
//       'rh': 'Indicateurs RH'
//     };
//     return categories[categorie] || categorie;
//   };

//   // Exporter les données au format CSV
//   const exporterDonnees = () => {
//     // Déterminer quel type de données exporter selon l'onglet actif
//     let csvContent = '';
//     let fileName = '';

//     if (activeTab === 'apercu') {
//       csvContent = "Catégorie,Nombre d'indicateurs,Valeur totale,Valeur moyenne\n";
//       fileName = 'synthese_par_categorie';

//       // Export des données par catégorie
//       // (implémentation à compléter selon vos besoins)
//     }
//     else if (activeTab === 'entreprises') {
//       csvContent = "Entreprise,Nombre d'indicateurs,Valeur totale,Valeur moyenne\n";
//       fileName = 'synthese_par_entreprise';

//       donneesParEntreprise.forEach(ent => {
//         csvContent += `"${ent.nom}",${ent.count},${ent.valeurTotale.toFixed(2)},${ent.valeurMoyenne.toFixed(2)}\n`;
//       });
//     }

//     // Déclencher le téléchargement
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.setAttribute('href', url);
//     link.setAttribute('download', `${fileName}_${new Date().toISOString().split('T')[0]}.csv`);
//     link.style.visibility = 'hidden';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-md overflow-hidden">
//       {/* En-tête avec titre et actions */}
//       <div className="p-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4">
//         <div>
//           <h2 className="text-xl font-bold text-gray-800">Rapport de synthèse des indicateurs</h2>
//           <p className="text-sm text-gray-500">{`Exercice ${exerciceActif.annee} - ${indicateursFiltres.length} indicateurs analysés`}</p>
//         </div>

//         <div className="flex flex-wrap gap-2">
//           {/* Sélection de catégorie */}
//           <div className="bg-gray-50 rounded-md border border-gray-200 px-3 py-2 flex items-center gap-2">
//             <Filter className="h-4 w-4 text-gray-500" />
//             <select
//               value={categorieSelectionnee}
//               onChange={(e) => setCategorieSelectionnee(e.target.value)}
//               className="border-0 bg-transparent text-gray-700 text-sm focus:ring-0"
//             >
//               <option value="all">Toutes catégories</option>
//               <option value="commercial">Indicateurs commerciaux</option>
//               <option value="tresorerie">Indicateurs financiers</option>
//               <option value="production">Indicateurs de production</option>
//               <option value="rh">Indicateurs RH</option>
//             </select>
//           </div>

//           {/* Sélection de période */}
//           <div className="bg-gray-50 rounded-md border border-gray-200 px-3 py-2 flex items-center gap-2">
//             <Filter className="h-4 w-4 text-gray-500" />
//             <select
//               value={periodeSelectionnee}
//               onChange={(e) => setPeriodeSelectionnee(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
//               className="border-0 bg-transparent text-gray-700 text-sm focus:ring-0"
//             >
//               <option value="all">Toutes périodes</option>
//               {periodes.map(p => (
//                 <option key={p.id} value={p.id}>{p.nom}</option>
//               ))}
//             </select>
//           </div>

//           {/* Bouton d'export */}
//           <button
//             onClick={exporterDonnees}
//             className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm flex items-center gap-1 hover:bg-blue-700 transition-colors"
//           >
//             <Download className="h-4 w-4" />
//             <span>Exporter</span>
//           </button>
//         </div>
//       </div>

//       {/* Onglets de navigation */}
//       <Tabs defaultValue="apercu" value={activeTab} onValueChange={setActiveTab} className="w-full">
//         <div className="px-4 pt-4 border-b border-gray-200">
//           <TabsList className="grid grid-cols-4 gap-4">
//             <TabsTrigger value="apercu" className="flex items-center gap-1 px-4 py-2">
//               <BarChart2 className="h-4 w-4" />
//               <span>Aperçu</span>
//             </TabsTrigger>
//             <TabsTrigger value="geographique" className="flex items-center gap-1 px-4 py-2">
//               <Map className="h-4 w-4" />
//               <span>Géographique</span>
//             </TabsTrigger>
//             <TabsTrigger value="detaille" className="flex items-center gap-1 px-4 py-2">
//               <FileText className="h-4 w-4" />
//               <span>Détaillé</span>
//             </TabsTrigger>
//             <TabsTrigger value="entreprises" className="flex items-center gap-1 px-4 py-2">
//               <TrendingUp className="h-4 w-4" />
//               <span>Entreprises</span>
//             </TabsTrigger>
//           </TabsList>
//         </div>

//         {/* Contenu des onglets */}
//         <div className="p-4">
//           {/* Onglet Entreprises */}
//           <TabsContent value="entreprises" className="mt-0">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {/* Graphique des top entreprises */}
//               <Card className="md:col-span-2">
//                 <CardHeader className="pb-2">
//                   <CardTitle className="text-lg">Top 10 entreprises par valeur totale</CardTitle>
//                   <CardDescription>Comparaison des entreprises les plus performantes</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="h-80">
//                     {donneesParEntreprise.length > 0 ? (
//                       <ResponsiveContainer width="100%" height="100%">
//                         <BarChart
//                           data={donneesParEntreprise.slice(0, 10)} // Top 10
//                           margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
//                         >
//                           <CartesianGrid strokeDasharray="3 3" />
//                           <XAxis dataKey="nom" angle={-45} textAnchor="end" height={80} />
//                           <YAxis />
//                           <Tooltip formatter={(value, name) => {
//                             if (name === 'valeurTotale') return [`${formatNumber(value as number)}`, 'Valeur totale'];
//                             if (name === 'valeurMoyenne') return [`${(value as number).toFixed(2)}`, 'Moyenne'];
//                             return [`${value}`, 'Nombre'];
//                           }} />
//                           <Legend />
//                           <Bar dataKey="valeurTotale" name="Valeur totale" fill="#0088FE" />
//                           <Bar dataKey="valeurMoyenne" name="Moyenne" fill="#00C49F" />
//                         </BarChart>
//                       </ResponsiveContainer>
//                     ) : (
//                       <div className="h-full flex items-center justify-center text-gray-400">
//                         Aucune donnée d'entreprise disponible
//                       </div>
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* Tableau des entreprises */}
//               <Card className="md:col-span-2">
//                 <CardHeader className="pb-2">
//                   <CardTitle className="text-lg">Classement des entreprises</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="overflow-auto">
//                     <table className="min-w-full divide-y divide-gray-200">
//                       <thead className="bg-gray-50">
//                         <tr>
//                           <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Rang
//                           </th>
//                           <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Entreprise
//                           </th>
//                           <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Nombre d'indicateurs
//                           </th>
//                           <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Valeur totale
//                           </th>
//                           <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Valeur moyenne
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody className="bg-white divide-y divide-gray-200">
//                         {donneesParEntreprise.map((entreprise, index) => (
//                           <tr key={`ent-${entreprise.id}-${index}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                               {index + 1}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                               {entreprise.nom}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                               {entreprise.count}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                               {Number(entreprise.valeurTotale || 0).toFixed(2)}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                               {Number(entreprise.valeurMoyenne || 0).toFixed(2)}
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </TabsContent>
//         </div>
//       </Tabs>
//     </div>
//   );
// };

// export default RapportSynthetique;
import React, { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { BarChart2, FileText, Map, TrendingUp, Download, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Types adaptés au backend
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

interface Exercice {
  id: number;
  annee: number;
  date_debut: string;
  date_fin: string;
  actif: boolean;
}

interface Periode {
  id: number;
  nom: string;
  exercice_id: number;
}

interface IndicateurDetail {
  nom: string;
  count: number;
  somme: number;
  moyenne: number;
  min: number;
  max: number;
  nbEntreprises: number;
  entreprises: Set<number>;
}

interface CategorieDetail {
  nom: string;
  count: number;
  valeurTotale: number;
  valeurMoyenne: number;
  indicateursListe: IndicateurDetail[];
}

interface EntrepriseDetail {
  id: number;
  nom: string;
  count: number;
  valeurTotale: number;
  valeurMoyenne: number;
  indicateurs: Array<{
    nom: string;
    moyenne: number;
  }>;
}

interface GroupeGeographique {
  nom: string;
  count: number;
  valeurTotale: number;
  valeurMoyenne: number;
  indicateurs: Record<string, {
    count: number;
    somme: number;
  }>;
}

interface RapportSynthetiqueProps {
  exerciceActif: Exercice;
  periodes: Periode[];
  indicateurs: Indicateur[];
}

// Couleurs pour les graphiques
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A259FF', '#4CAF50', '#F44336', '#9C27B0'];

const RapportSynthetique: React.FC<RapportSynthetiqueProps> = ({
  exerciceActif,
  periodes,
  indicateurs
}) => {
  const [activeTab, setActiveTab] = useState<string>('apercu');
  const [categorieSelectionnee, setCategorieSelectionnee] = useState<string>('all');
  const [periodeSelectionnee, setPeriodeSelectionnee] = useState<number | 'all'>(periodes.length > 0 ? periodes[0].id : 'all');

  // Obtenir toutes les catégories disponibles
  const categoriesDisponibles = useMemo(() => {
    const categories = new Set<string>();
    indicateurs.forEach(ind => categories.add(ind.categorie));
    return Array.from(categories);
  }, [indicateurs]);

  // Mapping des catégories pour l'affichage
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

  // Filtrer les indicateurs par catégorie et période
  const indicateursFiltres = useMemo(() => {
    return indicateurs.filter(ind => {
      const matchCategorie = categorieSelectionnee === 'all' || ind.categorie === categorieSelectionnee;
      const matchPeriode = periodeSelectionnee === 'all' || ind.periode_id === periodeSelectionnee;
      return matchCategorie && matchPeriode;
    });
  }, [indicateurs, categorieSelectionnee, periodeSelectionnee]);

  // Calculer les statistiques par tendance
  const statistiquesTendances = useMemo(() => {
    const tendances = {
      hausse: indicateursFiltres.filter(ind => ind.tendance === 'hausse').length,
      baisse: indicateursFiltres.filter(ind => ind.tendance === 'baisse').length,
      stable: indicateursFiltres.filter(ind => ind.tendance === 'stable' || !ind.tendance).length
    };

    const total = tendances.hausse + tendances.baisse + tendances.stable;

    return {
      ...tendances,
      total,
      pourcentageHausse: total > 0 ? (tendances.hausse / total) * 100 : 0,
      pourcentageBaisse: total > 0 ? (tendances.baisse / total) * 100 : 0,
      pourcentageStable: total > 0 ? (tendances.stable / total) * 100 : 0
    };
  }, [indicateursFiltres]);

  // Regrouper par entreprise pour la vue comparaison
  const donneesParEntreprise = useMemo<EntrepriseDetail[]>(() => {
    const entreprises = new Map<number, {
      id: number,
      nom: string,
      count: number,
      valeurTotale: number,
      indicateursMoyenne: Record<string, {
        somme: number,
        count: number
      }>
    }>();

    indicateursFiltres.forEach(ind => {
      if (!entreprises.has(ind.entreprise_id)) {
        entreprises.set(ind.entreprise_id, {
          id: ind.entreprise_id,
          nom: ind.entreprise_nom,
          count: 0,
          valeurTotale: 0,
          indicateursMoyenne: {}
        });
      }

      const entreprise = entreprises.get(ind.entreprise_id)!;
      entreprise.count += 1;
      entreprise.valeurTotale += ind.valeur;

      // Stocker les valeurs par nom d'indicateur
      if (!entreprise.indicateursMoyenne[ind.nom]) {
        entreprise.indicateursMoyenne[ind.nom] = {
          somme: 0,
          count: 0
        };
      }

      entreprise.indicateursMoyenne[ind.nom].somme += ind.valeur;
      entreprise.indicateursMoyenne[ind.nom].count += 1;
    });

    // Convertir en tableau pour les graphiques
    return Array.from(entreprises.values())
      .map(ent => ({
        ...ent,
        valeurMoyenne: ent.count > 0 ? ent.valeurTotale / ent.count : 0,
        // Calculer les moyennes par indicateur
        indicateurs: Object.entries(ent.indicateursMoyenne).map(([nom, stats]) => ({
          nom,
          moyenne: stats.count > 0 ? stats.somme / stats.count : 0
        }))
      }))
      .sort((a, b) => b.valeurTotale - a.valeurTotale);
  }, [indicateursFiltres]);

  // Fonction pour formater les grands nombres
  const formatNumber = (number: number | null | undefined): string => {
    // Vérification que la valeur est un nombre valide
    if (number === null || number === undefined || isNaN(number)) {
      return '0';
    }

    if (number >= 1000000) {
      return (number / 1000000).toFixed(1) + 'M';
    } else if (number >= 1000) {
      return (number / 1000).toFixed(1) + 'k';
    }
    return number.toFixed(0);
  };

  // Fonction pour avoir le nom complet de la catégorie
  const getCategoryDisplayName = (categoryId: string): string => {
    return categoriesMap[categoryId as keyof typeof categoriesMap] || categoryId;
  };

  // Exporter les données au format CSV
  const exporterDonnees = () => {
    // Déterminer quel type de données exporter selon l'onglet actif
    let csvContent = '';
    let fileName = '';

    if (activeTab === 'apercu') {
      csvContent = "Catégorie,Nombre d'indicateurs,Valeur totale,Valeur moyenne\n";
      fileName = 'synthese_par_categorie';

      // Export des données par catégorie
      // (implémentation à compléter selon vos besoins)
    }
    else if (activeTab === 'entreprises') {
      csvContent = "Entreprise,Nombre d'indicateurs,Valeur totale,Valeur moyenne\n";
      fileName = 'synthese_par_entreprise';

      donneesParEntreprise.forEach(ent => {
        csvContent += `"${ent.nom}",${ent.count},${ent.valeurTotale.toFixed(2)},${ent.valeurMoyenne.toFixed(2)}\n`;
      });
    }

    // Déclencher le téléchargement
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* En-tête avec titre et actions */}
      <div className="p-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Rapport de synthèse des indicateurs</h2>
          <p className="text-sm text-gray-500">{`Exercice ${exerciceActif.annee} - ${indicateursFiltres.length} indicateurs analysés`}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Sélection de catégorie */}
          <div className="bg-gray-50 rounded-md border border-gray-200 px-3 py-2 flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={categorieSelectionnee}
              onChange={(e) => setCategorieSelectionnee(e.target.value)}
              className="border-0 bg-transparent text-gray-700 text-sm focus:ring-0"
            >
              <option value="all">Toutes catégories</option>
              {categoriesDisponibles.map(cat => (
                <option key={cat} value={cat}>{getCategoryDisplayName(cat)}</option>
              ))}
            </select>
          </div>

          {/* Sélection de période */}
          <div className="bg-gray-50 rounded-md border border-gray-200 px-3 py-2 flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={periodeSelectionnee}
              onChange={(e) => setPeriodeSelectionnee(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
              className="border-0 bg-transparent text-gray-700 text-sm focus:ring-0"
            >
              <option value="all">Toutes périodes</option>
              {periodes.map(p => (
                <option key={p.id} value={p.id}>{p.nom}</option>
              ))}
            </select>
          </div>

          {/* Bouton d'export */}
          <button
            onClick={exporterDonnees}
            className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm flex items-center gap-1 hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Exporter</span>
          </button>
        </div>
      </div>

      {/* Onglets de navigation */}
      <Tabs defaultValue="apercu" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-4 pt-4 border-b border-gray-200">
          <TabsList className="grid grid-cols-4 gap-4">
            <TabsTrigger value="apercu" className="flex items-center gap-1 px-4 py-2">
              <BarChart2 className="h-4 w-4" />
              <span>Aperçu</span>
            </TabsTrigger>
            <TabsTrigger value="geographique" className="flex items-center gap-1 px-4 py-2">
              <Map className="h-4 w-4" />
              <span>Géographique</span>
            </TabsTrigger>
            <TabsTrigger value="detaille" className="flex items-center gap-1 px-4 py-2">
              <FileText className="h-4 w-4" />
              <span>Détaillé</span>
            </TabsTrigger>
            <TabsTrigger value="entreprises" className="flex items-center gap-1 px-4 py-2">
              <TrendingUp className="h-4 w-4" />
              <span>Entreprises</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Contenu des onglets */}
        <div className="p-4">
          {/* Onglet Entreprises */}
          <TabsContent value="entreprises" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Graphique des top entreprises */}
              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Top 10 entreprises par valeur totale</CardTitle>
                  <CardDescription>Comparaison des entreprises les plus performantes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    {donneesParEntreprise.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={donneesParEntreprise.slice(0, 10)} // Top 10
                          margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="nom" angle={-45} textAnchor="end" height={80} />
                          <YAxis />
                          <Tooltip formatter={(value, name) => {
                            if (name === 'valeurTotale') return [`${formatNumber(value as number)}`, 'Valeur totale'];
                            if (name === 'valeurMoyenne') return [`${(value as number).toFixed(2)}`, 'Moyenne'];
                            return [`${value}`, 'Nombre'];
                          }} />
                          <Legend />
                          <Bar dataKey="valeurTotale" name="Valeur totale" fill="#0088FE" />
                          <Bar dataKey="valeurMoyenne" name="Moyenne" fill="#00C49F" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-400">
                        Aucune donnée d'entreprise disponible
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Tableau des entreprises */}
              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Classement des entreprises</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Rang
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Entreprise
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nombre d'indicateurs
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Valeur totale
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Valeur moyenne
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {donneesParEntreprise.map((entreprise, index) => (
                          <tr key={`ent-${entreprise.id}-${index}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {index + 1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {entreprise.nom}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {entreprise.count}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {Number(entreprise.valeurTotale || 0).toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {Number(entreprise.valeurMoyenne || 0).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Onglet Aperçu (à compléter) */}
          <TabsContent value="apercu" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Aperçu des indicateurs par catégorie</CardTitle>
                  <CardDescription>Répartition et tendances des indicateurs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    {categoriesDisponibles.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={categoriesDisponibles.map(cat => {
                            const indicateursCategorie = indicateursFiltres.filter(ind => ind.categorie === cat);
                            const valeurTotale = indicateursCategorie.reduce((sum, ind) => sum + ind.valeur, 0);
                            const count = indicateursCategorie.length;

                            return {
                              categorie: getCategoryDisplayName(cat),
                              count,
                              valeurTotale,
                              valeurMoyenne: count > 0 ? valeurTotale / count : 0
                            };
                          })}
                          margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="categorie" angle={-45} textAnchor="end" height={80} />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="count" name="Nombre d'indicateurs" fill={COLORS[0]} />
                          <Bar dataKey="valeurTotale" name="Valeur totale" fill={COLORS[1]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-400">
                        Aucune donnée disponible
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Autres onglets à implémenter selon les besoins */}
        </div>
      </Tabs>
    </div>
  );
};

export default RapportSynthetique;
