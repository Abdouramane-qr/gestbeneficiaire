

// import React, { useState } from 'react';
// import {
//   Activity,
//   TrendingUp,
//   ShoppingBag,
//   Users,
//   LineChart,
//   MapPin,
//   Building2,
//   ChevronDown,
//   Home,
//   Settings
// } from 'lucide-react';

// // Types et interfaces
// interface Indicateur {
//   id: string;
//   nom: string;
//   valeur: number;
//   categorie: string;
//   region?: string;
//   province?: string;
//   commune?: string;
//   typeBeneficiaire?: string;
//   genre?: string;
//   handicap?: boolean;
//   niveauInstruction?: string;
//   typeActivite?: string;
//   niveauDeveloppement?: string;
//   tendance?: 'hausse' | 'baisse' | 'stable';
// }

// // Données de mock
// const donneesIndicateurs: Indicateur[] = [
//   // Indicateurs d'activités
//   {
//     id: '1',
//     nom: 'Taux de réalisation des activités',
//     valeur: 85,
//     categorie: 'activites_entreprise',
//     region: 'Centre',
//     province: 'Kadiogo',
//     commune: 'Ouagadougou',
//     typeBeneficiaire: 'Individuel',
//     genre: 'Homme',
//     handicap: false,
//     niveauInstruction: 'BAC',
//     typeActivite: 'Commerce',
//     niveauDeveloppement: 'Renforcement',
//     tendance: 'hausse'
//   },
//   {
//     id: '2',
//     nom: 'Chiffre d\'affaires',
//     valeur: 75,
//     categorie: 'commerciaux',
//     region: 'Hauts-Bassins',
//     province: 'Houet',
//     commune: 'Bobo-Dioulasso',
//     typeBeneficiaire: 'Coopérative',
//     genre: 'Femme',
//     handicap: false,
//     niveauInstruction: 'Universitaire',
//     typeActivite: 'Agriculture',
//     niveauDeveloppement: 'Création',
//     tendance: 'stable'
//   }
// ];

// // Catégories d'indicateurs
// const categories = [
//   {
//     id: 'activites_entreprise',
//     nom: "Indicateurs d'activités de l'entreprise du promoteur",
//     icone: Activity,
//     couleur: 'text-blue-600'
//   },
//   {
//     id: 'ratios_rentabilite',
//     nom: 'Ratios de Rentabilité et de solvabilité de l\'entreprise',
//     icone: TrendingUp,
//     couleur: 'text-green-600'
//   },
//   {
//     id: 'rentabilite_promoteur',
//     nom: 'Indicateurs de Rentabilité et de solvabilité de l\'entreprise du promoteur',
//     icone: Building2,
//     couleur: 'text-yellow-600'
//   },
//   {
//     id: 'commerciaux',
//     nom: 'Indicateurs commerciaux de l\'entreprise du promoteur',
//     icone: ShoppingBag,
//     couleur: 'text-purple-600'
//   },
//   {
//     id: 'sociaux_rh',
//     nom: 'Indicateurs Sociaux et ressources humaines de l\'entreprise du promoteur',
//     icone: Users,
//     couleur: 'text-orange-600'
//   },
//   {
//     id: 'performance_projet',
//     nom: 'Indicateurs de performance Projet',
//     icone: LineChart,
//     couleur: 'text-indigo-600'
//   }
// ];

// // Filtres
// const filtres = {
//   regions: ['Centre', 'Hauts-Bassins', 'Nord', 'Sahel', 'Est', 'Centre-Est', 'Centre-Nord', 'Boucle du Mouhoun', 'Centre-Ouest', 'Centre-Sud', 'Plateau Central', 'Sud-Ouest', 'Cascades'],
//   provinces: ['Kadiogo', 'Houet', 'Yatenga', 'Soum', 'Gourma', 'Boulgou', 'Namentenga', 'Mouhoun', 'Boulkiemdé', 'Zoundwéogo', 'Ganzourgou', 'Poni', 'Comoé'],
//   communes: ['Ouagadougou', 'Bobo-Dioulasso', 'Koudougou', 'Banfora', 'Ouahigouya', 'Dédougou', 'Fada N\'Gourma', 'Tenkodogo', 'Kaya', 'Manga', 'Ziniaré', 'Gaoua', 'Dori'],
//   typesBeneficiaires: ['Individuel', 'Coopérative', 'Autre'],
//   genres: ['Homme', 'Femme'],
//   handicaps: ['Oui', 'Non'],
//   niveauxInstruction: ['Analphabète', 'Alphabétisé', 'Primaire', 'CEPE', 'BEPC', 'BAC', 'Universitaire'],
//   typesActivite: ['Agriculture', 'Artisanat', 'Commerce', 'Élevage', 'Environnement'],
//   niveauxDeveloppement: ['Création', 'Renforcement']
// };

// // Composant Dropdown personnalisé
// function Dropdown({
//   label,
//   options,
//   value,
//   onChange,
//   icone: Icone
// }: {
//   label: string;
//   options: string[];
//   value: string;
//   onChange: (value: string) => void;
//   icone?: React.ElementType
// }) {
//   const [estOuvert, setEstOuvert] = useState(false);

//   return (
//     <div className="relative">
//       <label className="block text-sm font-medium text-gray-700 mb-1">
//         {Icone && <Icone className="w-4 h-4 inline mr-1" />}
//         {label}
//       </label>
//       <button
//         onClick={() => setEstOuvert(!estOuvert)}
//         className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-left text-sm flex items-center justify-between hover:bg-gray-50"
//       >
//         <span>{value === 'all' ? `Tous${label === 'Région' || label === 'Province' || label === 'Commune' ? 'tes' : ''}` : value}</span>
//         <ChevronDown className="w-4 h-4 text-gray-400" />
//       </button>

//       {estOuvert && (
//         <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
//           <div className="max-h-60 overflow-auto py-1">
//             <button
//               onClick={() => {
//                 onChange('all');
//                 setEstOuvert(false);
//               }}
//               className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
//                 value === 'all' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
//               }`}
//             >
//               Tous{label === 'Région' || label === 'Province' || label === 'Commune' ? 'tes' : ''}
//             </button>
//             {options.map((option) => (
//               <button
//                 key={option}
//                 onClick={() => {
//                   onChange(option);
//                   setEstOuvert(false);
//                 }}
//                 className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
//                   value === option ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
//                 }`}
//               >
//                 {option}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // Composant Sidebar
// function BarreLatérale() {
//   return (
//     <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
//       <div className="flex flex-col h-full">
//         <div className="p-4 border-b border-gray-200">
//           <h2 className="text-xl font-bold text-gray-800">Tableau de Bord  Analyse</h2>
//         </div>
//         <nav className="flex-1 p-4 space-y-2">
//           <a href="/dashboard" className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
//             <Home className="w-5 h-5 mr-3" />
//             Accueil
//           </a>
//           <a href="#" className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
//             <Settings className="w-5 h-5 mr-3" />
//             Paramètres
//           </a>
//         </nav>
//       </div>
//     </div>
//   );
// }

// export default function AnalyseIndicateurs() {
//   // États pour les filtres
//   const [filtreCategorie, setFiltreCategorie] = useState<string>('all');
//   const [filtreRegion, setFiltreRegion] = useState<string>('all');
//   const [filtreProvince, setFiltreProvince] = useState<string>('all');
//   const [filtreCommune, setFiltreCommune] = useState<string>('all');
//   const [filtreTypeBeneficiaire, setFiltreTypeBeneficiaire] = useState<string>('all');
//   const [filtreGenre, setFiltreGenre] = useState<string>('all');
//   const [filtreHandicap, setFiltreHandicap] = useState<string>('all');
//   const [filtreNiveauInstruction, setFiltreNiveauInstruction] = useState<string>('all');
//   const [filtreTypeActivite, setFiltreTypeActivite] = useState<string>('all');
//   const [filtreNiveauDeveloppement, setFiltreNiveauDeveloppement] = useState<string>('all');

//   // Filtrage des données
//   const donneesFiltrees = donneesIndicateurs.filter(indicateur => {
//     const verifierFiltre = (valeurFiltre: string, valeurIndicateur: unknown) =>
//       valeurFiltre === 'all' || valeurFiltre === valeurIndicateur;

//     return (
//       verifierFiltre(filtreCategorie, indicateur.categorie) &&
//       verifierFiltre(filtreRegion, indicateur.region) &&
//       verifierFiltre(filtreProvince, indicateur.province) &&
//       verifierFiltre(filtreCommune, indicateur.commune) &&
//       verifierFiltre(filtreTypeBeneficiaire, indicateur.typeBeneficiaire) &&
//       verifierFiltre(filtreGenre, indicateur.genre) &&
//       verifierFiltre(filtreHandicap, indicateur.handicap ? 'Oui' : 'Non') &&
//       verifierFiltre(filtreNiveauInstruction, indicateur.niveauInstruction) &&
//       verifierFiltre(filtreTypeActivite, indicateur.typeActivite) &&
//       verifierFiltre(filtreNiveauDeveloppement, indicateur.niveauDeveloppement)
//     );
//   });

//   // Fonction pour obtenir la couleur de la tendance
//   const obtenirCouleurTendance = (tendance?: 'hausse' | 'baisse' | 'stable') => {
//     switch (tendance) {
//       case 'hausse': return 'text-green-500';
//       case 'baisse': return 'text-red-500';
//       default: return 'text-gray-500';
//     }
//   };

//   // Fonction pour obtenir l'icône de la tendance
//   const obtenirIconeTendance = (tendance?: 'hausse' | 'baisse' | 'stable') => {
//     switch (tendance) {
//       case 'hausse': return '↑';
//       case 'baisse': return '↓';
//       default: return '→';
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex">
//       <BarreLatérale />
//       <div className="flex-1 ml-64">
//         <header className="bg-white shadow-sm">
//           <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
//             <div className="flex flex-col space-y-4">
//               <div className="flex items-center justify-between">
//                 <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//                   <MapPin className="h-6 w-6" />
//                   Tableau de Bord Analytique
//                 </h1>
//               </div>

//               {/* Filtres */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">
//                 <Dropdown
//                   label="Catégorie"
//                   options={categories.map(c => c.nom)}
//                   value={filtreCategorie === 'all' ? 'all' : categories.find(c => c.id === filtreCategorie)?.nom || ''}
//                   onChange={(value) => {
//                     const categorie = categories.find(c => c.nom === value);
//                     setFiltreCategorie(categorie ? categorie.id : 'all');
//                   }}
//                   icone={MapPin}
//                 />

//                 <Dropdown
//                   label="Région"
//                   options={filtres.regions}
//                   value={filtreRegion}
//                   onChange={setFiltreRegion}
//                   icone={MapPin}
//                 />

//                 <Dropdown
//                   label="Province"
//                   options={filtres.provinces}
//                   value={filtreProvince}
//                   onChange={setFiltreProvince}
//                   icone={MapPin}
//                 />

//                 <Dropdown
//                   label="Commune"
//                   options={filtres.communes}
//                   value={filtreCommune}
//                   onChange={setFiltreCommune}
//                   icone={MapPin}
//                 />

//                 <Dropdown
//                   label="Type de bénéficiaire"
//                   options={filtres.typesBeneficiaires}
//                   value={filtreTypeBeneficiaire}
//                   onChange={setFiltreTypeBeneficiaire}
//                   icone={Users}
//                 />

//                 <Dropdown
//                   label="Genre"
//                   options={filtres.genres}
//                   value={filtreGenre}
//                   onChange={setFiltreGenre}
//                 />

// <Dropdown
//                   label="Situation de Handicap"
//                   options={filtres.handicaps}
//                   value={filtreHandicap}
//                   onChange={setFiltreHandicap}
//                 />

//                 <Dropdown
//                   label="Niveau d'instruction"
//                   options={filtres.niveauxInstruction}
//                   value={filtreNiveauInstruction}
//                   onChange={setFiltreNiveauInstruction}
//                 />

//                 <Dropdown
//                   label="Type d'activité"
//                   options={filtres.typesActivite}
//                   value={filtreTypeActivite}
//                   onChange={setFiltreTypeActivite}
//                 />

//                 <Dropdown
//                   label="Niveau de développement"
//                   options={filtres.niveauxDeveloppement}
//                   value={filtreNiveauDeveloppement}
//                   onChange={setFiltreNiveauDeveloppement}
//                 />
//               </div>
//             </div>
//           </div>
//         </header>

//         <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {categories.map(categorie => {
//               const donneesCategorie = donneesFiltrees.filter(indicateur =>
//                 indicateur.categorie === categorie.id
//               );

//               // Si un filtre de catégorie est actif et ne correspond pas, ne pas afficher
//               if (filtreCategorie !== 'all' && filtreCategorie !== categorie.id) return null;

//               const Icone = categorie.icone;

//               return (
//                 <div
//                   key={categorie.id}
//                   className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
//                 >
//                   <div className="flex items-center justify-between mb-4">
//                     <h3 className="text-lg font-medium text-gray-900">
//                       {categorie.nom}
//                     </h3>
//                     <Icone className={`h-5 w-5 ${categorie.couleur}`} />
//                   </div>

//                   <div className="space-y-4">
//                     {donneesCategorie.length > 0 ? (
//                       donneesCategorie.map(indicateur => (
//                         <div
//                           key={indicateur.id}
//                           className="flex justify-between items-center"
//                         >
//                           <div className="flex flex-col">
//                             <span className="text-gray-600 text-sm">
//                               {indicateur.nom}
//                             </span>
//                             <span className="text-xs text-gray-500">
//                               {indicateur.region} - {indicateur.commune}
//                             </span>
//                           </div>
//                           <div className="flex items-center gap-2">
//                             <span
//                               className={`font-medium ${obtenirCouleurTendance(indicateur.tendance)}`}
//                             >
//                               {indicateur.valeur}% {obtenirIconeTendance(indicateur.tendance)}
//                             </span>
//                           </div>
//                         </div>
//                       ))
//                     ) : (
//                       <p className="text-gray-500 text-sm italic text-center">
//                         Aucun indicateur disponible
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }
// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   ShoppingBag,
//   TrendingUp,
//   Users,
//   BarChart,
//   Sliders,
//   Download,
//   FileText,
//   AlertCircle,
//   ChevronDown,
//   Search,
//   X
// } from 'lucide-react';
// import { Head } from '@inertiajs/react';
// import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';

// import { Tooltip } from '@/components/ui/tooltip';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue
// } from '@/components/ui/select';
// import IndicateursList from '@/components/Analyse/IndicateursList';
// import IndicateurDetailModal from '@/components/Analyse/IndicateurDetailModal';

// // Types
// interface Indicateur {
//   id: string;
//   nom: string;
//   valeur: number;
//   unite?: string;
//   categorie: string;
//   entite: string;
//   region?: string;
//   province?: string;
//   commune?: string;
//   typeBeneficiaire?: string;
//   genre?: string;
//   handicap?: boolean;
//   niveauInstruction?: string;
//   typeActivite?: string;
//   niveauDeveloppement?: string;
//   tendance?: 'hausse' | 'baisse' | 'stable';
//   description?: string;
// }

// interface Exercice {
//   id: number;
//   annee: number;
//   actif: boolean;
// }

// interface Periode {
//   id: number;
//   nom: string;
//   exercice_id: number;
// }

// interface Filtres {
//   regions: string[];
//   provinces: string[];
//   communes: string[];
//   typesBeneficiaires: string[];
//   genres: string[];
//   secteursActivite: string[];
// }

// interface AnalyseProps {
//   auth: {
//     user: {
//       id: number;
//       name: string;
//       email: string;
//     }
//   };
//   exerciceActif?: Exercice;
//   indicateurs?: Indicateur[];
//   filtres?: Filtres;
//   error?: string;
// }

// // Définition des catégories d'indicateurs
// const categories = [
//   {
//     id: 'commercial',
//     nom: "Indicateurs commerciaux",
//     icone: <ShoppingBag className="h-5 w-5" />,
//     couleur: 'blue'
//   },
//   {
//     id: 'financier',
//     nom: 'Indicateurs financiers',
//     icone: <TrendingUp className="h-5 w-5" />,
//     couleur: 'green'
//   },
//   {
//     id: 'production',
//     nom: 'Indicateurs de production',
//     icone: <BarChart className="h-5 w-5" />,
//     couleur: 'purple'
//   },
//   {
//     id: 'rh',
//     nom: 'Indicateurs RH',
//     icone: <Users className="h-5 w-5" />,
//     couleur: 'orange'
//   }
// ];

// // Données fictives pour l'exemple
// const exempleIndicateurs: Indicateur[] = [
//   {
//     id: '1',
//     nom: 'Prospects grossistes',
//     valeur: 20,
//     categorie: 'commercial',
//     entite: 'PAM - Cascades',
//     region: 'Cascades',
//     tendance: 'stable'
//   },
//   {
//     id: '2',
//     nom: 'Prospects détaillants',
//     valeur: 10,
//     categorie: 'commercial',
//     entite: 'PAM - Cascades',
//     region: 'Cascades',
//     tendance: 'stable'
//   },
//   {
//     id: '3',
//     nom: 'Clients grossistes',
//     valeur: 30,
//     categorie: 'commercial',
//     entite: 'PAM - Cascades',
//     region: 'Cascades',
//     tendance: 'hausse'
//   },
//   {
//     id: '4',
//     nom: 'Clients détaillants',
//     valeur: 10,
//     categorie: 'commercial',
//     entite: 'PAM - Cascades',
//     region: 'Cascades',
//     tendance: 'baisse'
//   },
//   {
//     id: '5',
//     nom: 'Montant impayés clients',
//     valeur: 210,
//     unite: '€',
//     categorie: 'financier',
//     entite: 'PAM - Cascades',
//     region: 'Cascades',
//     tendance: 'hausse'
//   },
//   {
//     id: '6',
//     nom: 'Employés (F)',
//     valeur: 41,
//     categorie: 'rh',
//     entite: 'PAM - Cascades',
//     region: 'Cascades',
//     tendance: 'stable'
//   },
//   {
//     id: '7',
//     nom: 'Employés (H)',
//     valeur: 30,
//     categorie: 'rh',
//     entite: 'PAM - Cascades',
//     region: 'Cascades',
//     tendance: 'stable'
//   }
// ];

// // Composant principal pour l'analyse des indicateurs
// const AnalysePage: React.FC<AnalyseProps> = ({
//   auth,
//   exerciceActif,
//   indicateurs: propIndicateurs,
//   filtres: propFiltres,
//   error
// }) => {
//   // États
//   const [indicateurs, setIndicateurs] = useState<Indicateur[]>([]);
//   const [filtreCategorie, setFiltreCategorie] = useState<string>('all');
//   const [filtreExercice, setFiltreExercice] = useState<string>(exerciceActif?.annee.toString() || '2025');
//   const [filtrePeriode, setFiltrePeriode] = useState<string>('all');
//   const [recherche, setRecherche] = useState<string>('');
//   const [filtresAvances, setFiltresAvances] = useState<boolean>(false);
//   const [filtreRegion, setFiltreRegion] = useState<string>('all');
//   const [filtreEntite, setFiltreEntite] = useState<string>('all');
//   const [indicateurSelectionne, setIndicateurSelectionne] = useState<Indicateur | null>(null);
//   const [modal, setModal] = useState<boolean>(false);
//   const [isLoading, setIsLoading] = useState<boolean>(true);

//   // Initialisation des données
//   useEffect(() => {
//     // Simulation d'un chargement de données
//     setIsLoading(true);

//     setTimeout(() => {
//       setIndicateurs(propIndicateurs || exempleIndicateurs);
//       setIsLoading(false);
//     }, 500);
//   }, [propIndicateurs]);

//   // Sauvegarder les filtres dans le localStorage
//   useEffect(() => {
//     localStorage.setItem('analyse-filtres', JSON.stringify({
//       categorie: filtreCategorie,
//       exercice: filtreExercice,
//       periode: filtrePeriode,
//       region: filtreRegion,
//       entite: filtreEntite,
//       recherche: recherche
//     }));
//   }, [filtreCategorie, filtreExercice, filtrePeriode, filtreRegion, filtreEntite, recherche]);

//   // Récupérer les filtres du localStorage au chargement
//   useEffect(() => {
//     try {
//       const savedFilters = localStorage.getItem('analyse-filtres');
//       if (savedFilters) {
//         const parsedFilters = JSON.parse(savedFilters);
//         setFiltreCategorie(parsedFilters.categorie || 'all');
//         setFiltreExercice(parsedFilters.exercice || '2025');
//         setFiltrePeriode(parsedFilters.periode || 'all');
//         setFiltreRegion(parsedFilters.region || 'all');
//         setFiltreEntite(parsedFilters.entite || 'all');
//         setRecherche(parsedFilters.recherche || '');
//       }
//     } catch (e) {
//       console.error('Erreur lors de la récupération des filtres sauvegardés:', e);
//     }
//   }, []);

//   // Logique de filtrage global
//   const indicateursFiltres = indicateurs.filter(indicateur => {
//     // Filtre par recherche globale
//     const matchRecherche = recherche === '' ||
//       indicateur.nom.toLowerCase().includes(recherche.toLowerCase()) ||
//       indicateur.entite.toLowerCase().includes(recherche.toLowerCase());

//     // Filtre par catégorie
//     const matchCategorie = filtreCategorie === 'all' || indicateur.categorie === filtreCategorie;

//     // Filtre par région
//     const matchRegion = filtreRegion === 'all' || indicateur.region === filtreRegion;

//     // Filtre par entité
//     const matchEntite = filtreEntite === 'all' || indicateur.entite.includes(filtreEntite);

//     // Combiner tous les filtres
//     return matchRecherche && matchCategorie && matchRegion && matchEntite;
//   });

//   // Grouper par catégorie
//   const indicateursParCategorie = categories.map(categorie => {
//     return {
//       ...categorie,
//       indicateurs: indicateursFiltres.filter(ind => ind.categorie === categorie.id)
//     };
//   });

//   // Liste des entités et régions uniques pour les filtres
//   const entitesUniques = [...new Set(indicateurs.map(ind => ind.entite))];
//   const regionsUniques = [...new Set(indicateurs.filter(ind => ind.region).map(ind => ind.region as string))];

//   // Gestion des événements
//   const handleIndicateurClick = useCallback((indicateur: Indicateur) => {
//     setIndicateurSelectionne(indicateur);
//     setModal(true);
//   }, []);

//   const handleExporterExcel = useCallback(() => {
//     // Créer le contenu CSV
//     const headers = ['ID', 'Nom', 'Catégorie', 'Entité', 'Valeur', 'Unité', 'Tendance', 'Région'];
//     const rows = indicateursFiltres.map(ind => [
//       ind.id,
//       ind.nom,
//       ind.categorie,
//       ind.entite,
//       ind.valeur,
//       ind.unite || '',
//       ind.tendance || 'stable',
//       ind.region || ''
//     ]);

//     const csvContent =
//       headers.join(',') + '\n' +
//       rows.map(row => row.join(',')).join('\n');

//     // Télécharger
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.setAttribute('href', url);
//     link.setAttribute('download', `indicateurs_export_${new Date().toISOString().slice(0, 10)}.csv`);
//     link.style.visibility = 'hidden';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   }, [indicateursFiltres]);

//   const handleGenererRapport = useCallback(() => {
//     // Logique pour générer un rapport
//     alert(`Génération d'un rapport pour ${indicateursFiltres.length} indicateurs...`);
//   }, [indicateursFiltres]);

//   const reinitialiserFiltres = useCallback(() => {
//     setFiltreCategorie('all');
//     setFiltreExercice(exerciceActif?.annee.toString() || '2025');
//     setFiltrePeriode('all');
//     setRecherche('');
//     setFiltreRegion('all');
//     setFiltreEntite('all');
//     setFiltresAvances(false);
//   }, [exerciceActif]);

//   // Composant pour les filtres avancés
//   const FiltresAvances = () => (
//     <div
//       className={`transition-all duration-300 overflow-hidden ${
//         filtresAvances ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
//       }`}
//     >
//       {filtresAvances && (
//         <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           {/* Filtre par région */}
//           <div className="flex flex-col">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Région</label>
//             <Select value={filtreRegion} onValueChange={setFiltreRegion}>
//               <SelectTrigger className="w-full">
//                 <SelectValue placeholder="Toutes les régions" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">Toutes les régions</SelectItem>
//                 {regionsUniques.map(region => (
//                   <SelectItem key={region} value={region}>{region}</SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Filtre par entité */}
//           <div className="flex flex-col">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Entité</label>
//             <Select value={filtreEntite} onValueChange={setFiltreEntite}>
//               <SelectTrigger className="w-full">
//                 <SelectValue placeholder="Toutes les entités" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">Toutes les entités</SelectItem>
//                 {entitesUniques.map(entite => (
//                   <SelectItem key={entite} value={entite}>{entite}</SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Autres filtres pourraient être ajoutés ici */}

//           {/* Bouton de réinitialisation */}
//           <div className="flex items-end">
//             <button
//               onClick={reinitialiserFiltres}
//               className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md text-sm"
//             >
//               Réinitialiser les filtres
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );

//   return (
//     <AuthenticatedLayout user={auth.user}>
//       <Head title="Analyse des Indicateurs" />

//       <div className="py-6">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           {error ? (
//             <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
//               <div className="flex">
//                 <div className="flex-shrink-0">
//                   <AlertCircle className="h-5 w-5 text-red-400" />
//                 </div>
//                 <div className="ml-3">
//                   <p className="text-sm text-red-700">{error}</p>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <>
//               {/* Barre de recherche globale */}
//               <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
//                 <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-end">
//                   <div className="w-full md:flex-grow">
//                     <div className="relative">
//                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                         <Search className="h-5 w-5 text-gray-400" />
//                       </div>
//                       <input
//                         type="text"
//                         placeholder="Recherche globale..."
//                         value={recherche}
//                         onChange={(e) => setRecherche(e.target.value)}
//                         className="pl-10 pr-10 py-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 block w-full rounded-md"
//                       />
//                       {recherche && (
//                         <button
//                           className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                           onClick={() => setRecherche('')}
//                         >
//                           <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//                         </button>
//                       )}
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-3 gap-4">
//                     {/* Filtre par catégorie */}
//                     <div>
//                       <Select value={filtreCategorie} onValueChange={setFiltreCategorie}>
//                         <SelectTrigger>
//                         <SelectValue placeholder="Catégorie" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="all">Toutes les catégories</SelectItem>
//                           {categories.map((cat) => (
//                             <SelectItem key={cat.id} value={cat.id}>{cat.nom}</SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>

//                     {/* Filtre par exercice */}
//                     <div>
//                       <Select value={filtreExercice} onValueChange={setFiltreExercice}>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Exercice" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="2025">2025</SelectItem>
//                           <SelectItem value="2024">2024</SelectItem>
//                           <SelectItem value="2023">2023</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>

//                     {/* Filtre par période */}
//                     <div>
//                       <Select value={filtrePeriode} onValueChange={setFiltrePeriode}>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Période" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="all">Toutes les périodes</SelectItem>
//                           <SelectItem value="T1">T1</SelectItem>
//                           <SelectItem value="T2">T2</SelectItem>
//                           <SelectItem value="T3">T3</SelectItem>
//                           <SelectItem value="T4">T4</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex justify-end mt-4">
//                   <button
//                     onClick={() => setFiltresAvances(!filtresAvances)}
//                     className="bg-blue-50 text-blue-500 border border-blue-200 hover:bg-blue-100 transition-colors px-4 py-2 rounded-md text-sm flex items-center gap-2"
//                   >
//                     <Sliders className="h-4 w-4" />
//                     <span>
//                       {filtresAvances ? 'Masquer les filtres avancés' : 'Afficher les filtres avancés'}
//                     </span>
//                     <ChevronDown className={`h-4 w-4 transition-transform ${filtresAvances ? 'rotate-180' : ''}`} />
//                   </button>
//                 </div>

//                 {/* Filtres avancés (conditionnels) */}
//                 <FiltresAvances />
//               </div>

//               {/* Barre d'actions */}
//               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//                 <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 text-sm text-gray-700">
//                   <span className="font-medium mr-1">{indicateursFiltres.length}</span>
//                   indicateurs trouvés {recherche && <span>pour "<span className="italic">{recherche}</span>"</span>}
//                 </div>

//                 <div className="flex gap-2">
//                   <Tooltip content="Générer un rapport PDF avec les indicateurs filtrés">
//                     <button
//                       onClick={handleGenererRapport}
//                       className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2 transition-colors"
//                     >
//                       <FileText className="h-4 w-4" />
//                       <span className="hidden sm:inline">Générer un rapport</span>
//                       <span className="inline sm:hidden">Rapport</span>
//                     </button>
//                   </Tooltip>

//                   <Tooltip content="Exporter les données au format CSV">
//                     <button
//                       onClick={handleExporterExcel}
//                       className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2 transition-colors"
//                     >
//                       <Download className="h-4 w-4" />
//                       <span className="hidden sm:inline">Exporter (CSV)</span>
//                       <span className="inline sm:hidden">Exporter</span>
//                     </button>
//                   </Tooltip>
//                 </div>
//               </div>

//               {/* État de chargement */}
//               {isLoading ? (
//                 <div className="flex justify-center items-center py-12">
//                   <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//                 </div>
//               ) : (
//                 <>
//                   {/* Message d'alerte si aucun indicateur */}
//                   {indicateursFiltres.length === 0 && (
//                     <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
//                       <div className="flex">
//                         <div className="flex-shrink-0">
//                           <AlertCircle className="h-5 w-5 text-yellow-400" />
//                         </div>
//                         <div className="ml-3">
//                           <p className="text-sm text-yellow-700">
//                             Aucun indicateur ne correspond à vos critères de recherche.
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   {/* Grille d'indicateurs */}
//                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                     {indicateursParCategorie.map(categorie => (
//                       <IndicateursList
//                         key={categorie.id}
//                         titre={categorie.nom}
//                         icone={categorie.icone}
//                         couleur={categorie.couleur}
//                         indicateurs={categorie.indicateurs}
//                         onIndicateurClick={handleIndicateurClick}
//                         filtrerParTendance={true}
//                       />
//                     ))}
//                   </div>
//                 </>
//               )}
//             </>
//           )}
//         </div>
//       </div>

//       {/* Modal de détail d'indicateur */}
//       {indicateurSelectionne && (
//         <IndicateurDetailModal
//           isOpen={modal}
//           onClose={() => setModal(false)}
//           indicateur={indicateurSelectionne}
//         />
//       )}
//     </AuthenticatedLayout>
//   );
// };

// export default AnalysePage;
