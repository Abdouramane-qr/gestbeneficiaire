
// import React, { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
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
// import IndicateursList from '@/components/Analyse/IndicateursList';
// import IndicateurDetailModal from '@/components/Analyse/IndicateurDetailModal';
// // Types et interfaces
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
//   actif: boolean;
// }

// interface Periode {
//   id: number;
//   nom: string;
//   exercice_id: number;
// }

// interface IndicateurDB {
//   id: number;
//   nom: string;
//   categorie: string;
//   description: string;
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
//   exerciceActif: Exercice;
//   exercices: Exercice[];
//   periodes: Periode[];
//   indicateurs: IndicateurDB[];
//   filtres: Filtres;
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
//     id: 'tresorerie',
//     nom: 'Indicateurs de trésorerie',
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
//   },

//   {
//     id: 'financier',
//     nom: 'Indicateurs financiers',
//     icone: <BarChart className="h-5 w-5" />,
//     couleur: 'purple'
//   },
//   {
//     id: 'rentabilite',
//     nom: 'Indicateurs de rentabilité',
//     icone: <Users className="h-5 w-5" />,
//     couleur: 'orange'
//   }
// ];

// // Composant principal pour l'analyse des indicateurs
// export default function AnalyseIndicateurs({
//   exerciceActif,
//   exercices,
//   periodes,
//   filtres
// }: AnalyseProps) {
//   // États
//   const [donnees, setDonnees] = useState<Indicateur[]>([]);
//   const [filtreCategorie, setFiltreCategorie] = useState<string>('all');
//   const [filtreExercice, setFiltreExercice] = useState<string>(exerciceActif.id.toString());
//   const [filtrePeriode, setFiltrePeriode] = useState<string>('all');
//   const [recherche, setRecherche] = useState<string>('');
//   const [filtresAvances, setFiltresAvances] = useState<boolean>(false);
//   const [filtreRegion, setFiltreRegion] = useState<string>('all');
//   const [filtreProvince, setFiltreProvince] = useState<string>('all');
//   const [filtreCommune, setFiltreCommune] = useState<string>('all');
//   const [filtreSecteur, setFiltreSecteur] = useState<string>('all');
//   const [filtreTypeBeneficiaire, setFiltreTypeBeneficiaire] = useState<string>('all');
//   const [filtreGenre, setFiltreGenre] = useState<string>('all');

//   const [indicateurSelectionne, setIndicateurSelectionne] = useState<Indicateur | null>(null);
//   const [modal, setModal] = useState<boolean>(false);
//   const [isLoading, setIsLoading] = useState<boolean>(true);

//   // Chargement des données au démarrage et lorsque les filtres changent
//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true);
//       try {
//         const response = await axios.get(route('analyse.donnees'), {
//           exercice_id: filtreExercice !== 'all' ? filtreExercice : null,
//           periode_id: filtrePeriode !== 'all' ? filtrePeriode : null,
//           categorie: filtreCategorie !== 'all' ? filtreCategorie : null,
//           region: filtreRegion !== 'all' ? filtreRegion : null,
//           province: filtreProvince !== 'all' ? filtreProvince : null,
//           commune: filtreCommune !== 'all' ? filtreCommune : null,
//           secteur_activite: filtreSecteur !== 'all' ? filtreSecteur : null,
//           type_beneficiaire: filtreTypeBeneficiaire !== 'all' ? filtreTypeBeneficiaire : null,
//           genre: filtreGenre !== 'all' ? filtreGenre : null
//         });
//         setDonnees(response.data.donneesIndicateurs);
//       } catch (error) {
//         console.error('Erreur lors du chargement des données:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [
//     filtreExercice,
//     filtrePeriode,
//     filtreCategorie,
//     filtreRegion,
//     filtreProvince,
//     filtreCommune,
//     filtreSecteur,
//     filtreTypeBeneficiaire,
//     filtreGenre
//   ]);

//   // Sauvegarder les filtres dans le localStorage
//   useEffect(() => {
//     localStorage.setItem('analyse-filtres', JSON.stringify({
//       categorie: filtreCategorie,
//       exercice: filtreExercice,
//       periode: filtrePeriode,
//       region: filtreRegion,
//       province: filtreProvince,
//       commune: filtreCommune,
//       secteur: filtreSecteur,
//       typeBeneficiaire: filtreTypeBeneficiaire,
//       genre: filtreGenre,
//       recherche: recherche
//     }));
//   }, [
//     filtreCategorie,
//     filtreExercice,
//     filtrePeriode,
//     filtreRegion,
//     filtreProvince,
//     filtreCommune,
//     filtreSecteur,
//     filtreTypeBeneficiaire,
//     filtreGenre,
//     recherche
//   ]);

//   // Récupérer les filtres du localStorage au chargement
//   useEffect(() => {
//     try {
//       const savedFilters = localStorage.getItem('analyse-filtres');
//       if (savedFilters) {
//         const parsedFilters = JSON.parse(savedFilters);
//         // Appliquer les filtres sauvegardés
//         if (parsedFilters.categorie) setFiltreCategorie(parsedFilters.categorie);
//         if (parsedFilters.exercice) setFiltreExercice(parsedFilters.exercice);
//         if (parsedFilters.periode) setFiltrePeriode(parsedFilters.periode);
//         if (parsedFilters.region) setFiltreRegion(parsedFilters.region);
//         if (parsedFilters.province) setFiltreProvince(parsedFilters.province);
//         if (parsedFilters.commune) setFiltreCommune(parsedFilters.commune);
//         if (parsedFilters.secteur) setFiltreSecteur(parsedFilters.secteur);
//         if (parsedFilters.typeBeneficiaire) setFiltreTypeBeneficiaire(parsedFilters.typeBeneficiaire);
//         if (parsedFilters.genre) setFiltreGenre(parsedFilters.genre);
//         if (parsedFilters.recherche) setRecherche(parsedFilters.recherche);
//       }
//     } catch (e) {
//       console.error('Erreur lors de la récupération des filtres sauvegardés:', e);
//     }
//   }, []);

//   // Logique de filtrage global
//   const indicateursFiltres = donnees.filter(indicateur => {
//     // Filtre par recherche globale
//     const matchRecherche = recherche === '' ||
//       indicateur.nom.toLowerCase().includes(recherche.toLowerCase()) ||
//       indicateur.entreprise_nom.toLowerCase().includes(recherche.toLowerCase()) ||
//       (indicateur.region && indicateur.region.toLowerCase().includes(recherche.toLowerCase()));

//     // Combiner tous les filtres
//     return matchRecherche;
//   });

//   // Grouper par catégorie
//   const indicateursParCategorie = categories.map(categorie => {
//     return {
//       ...categorie,
//       indicateurs: indicateursFiltres.filter(ind => ind.categorie === categorie.id)
//     };
//   });

//   // Gestion des événements
//   const handleIndicateurClick = useCallback((indicateur: Indicateur) => {
//     setIndicateurSelectionne(indicateur);
//     setModal(true);
//   }, []);

//   const handleExporterExcel = useCallback(() => {
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
//     const exerciceInput = document.createElement('input');
//     exerciceInput.type = 'hidden';
//     exerciceInput.name = 'exercice_id';
//     exerciceInput.value = filtreExercice;
//     form.appendChild(exerciceInput);

//     if (filtrePeriode !== 'all') {
//       const periodeInput = document.createElement('input');
//       periodeInput.type = 'hidden';
//       periodeInput.name = 'periode_id';
//       periodeInput.value = filtrePeriode;
//       form.appendChild(periodeInput);
//     }

//     // Ajouter les catégories sélectionnées
//     const categoriesInput = document.createElement('input');
//     categoriesInput.type = 'hidden';
//     categoriesInput.name = 'categories';
//     categoriesInput.value = JSON.stringify(filtreCategorie === 'all'
//       ? categories.map(c => c.id)
//       : [filtreCategorie]);
//     form.appendChild(categoriesInput);

//     // Ajouter le format d'export
//     const formatInput = document.createElement('input');
//     formatInput.type = 'hidden';
//     formatInput.name = 'format';
//     formatInput.value = 'excel';
//     form.appendChild(formatInput);

//     // Soumettre le formulaire
//     document.body.appendChild(form);
//     form.submit();
//     document.body.removeChild(form);
//   }, [filtreCategorie, filtreExercice, filtrePeriode]);

//   const handleGenererRapport = useCallback(() => {
//     // Créer un formulaire pour soumettre les paramètres du rapport
//     const form = document.createElement('form');
//     form.method = 'POST';
//     form.action = route('analyse.rapport');

//     // Ajouter le token CSRF
//     const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
//     const csrfInput = document.createElement('input');
//     csrfInput.type = 'hidden';
//     csrfInput.name = '_token';
//     csrfInput.value = csrfToken || '';
//     form.appendChild(csrfInput);

//     // Ajouter les filtres
//     const exerciceInput = document.createElement('input');
//     exerciceInput.type = 'hidden';
//     exerciceInput.name = 'exercice_id';
//     exerciceInput.value = filtreExercice;
//     form.appendChild(exerciceInput);

//     if (filtrePeriode !== 'all') {
//       const periodeInput = document.createElement('input');
//       periodeInput.type = 'hidden';
//       periodeInput.name = 'periode_id';
//       periodeInput.value = filtrePeriode;
//       form.appendChild(periodeInput);
//     }

//     // Ajouter les catégories sélectionnées
//     const categoriesInput = document.createElement('input');
//     categoriesInput.type = 'hidden';
//     categoriesInput.name = 'categories';
//     categoriesInput.value = JSON.stringify(filtreCategorie === 'all'
//       ? categories.map(c => c.id)
//       : [filtreCategorie]);
//     form.appendChild(categoriesInput);

//     // Ajouter les filtres géographiques et démographiques
//     if (filtreRegion !== 'all') {
//       const regionInput = document.createElement('input');
//       regionInput.type = 'hidden';
//       regionInput.name = 'region';
//       regionInput.value = filtreRegion;
//       form.appendChild(regionInput);
//     }

//     if (filtreProvince !== 'all') {
//       const provinceInput = document.createElement('input');
//       provinceInput.type = 'hidden';
//       provinceInput.name = 'province';
//       provinceInput.value = filtreProvince;
//       form.appendChild(provinceInput);
//     }

//     if (filtreCommune !== 'all') {
//       const communeInput = document.createElement('input');
//       communeInput.type = 'hidden';
//       communeInput.name = 'commune';
//       communeInput.value = filtreCommune;
//       form.appendChild(communeInput);
//     }

//     if (filtreSecteur !== 'all') {
//       const secteurInput = document.createElement('input');
//       secteurInput.type = 'hidden';
//       secteurInput.name = 'secteur_activite';
//       secteurInput.value = filtreSecteur;
//       form.appendChild(secteurInput);
//     }

//     if (filtreTypeBeneficiaire !== 'all') {
//       const typeBeneficiaireInput = document.createElement('input');
//       typeBeneficiaireInput.type = 'hidden';
//       typeBeneficiaireInput.name = 'type_beneficiaire';
//       typeBeneficiaireInput.value = filtreTypeBeneficiaire;
//       form.appendChild(typeBeneficiaireInput);
//     }

//     if (filtreGenre !== 'all') {
//       const genreInput = document.createElement('input');
//       genreInput.type = 'hidden';
//       genreInput.name = 'genre';
//       genreInput.value = filtreGenre;
//       form.appendChild(genreInput);
//     }

//     // Soumettre le formulaire
//     document.body.appendChild(form);
//     form.submit();
//     document.body.removeChild(form);
//   }, [filtreCategorie, filtreExercice, filtrePeriode, filtreRegion, filtreProvince, filtreCommune, filtreSecteur, filtreTypeBeneficiaire, filtreGenre]);

//   const reinitialiserFiltres = useCallback(() => {
//     setFiltreCategorie('all');
//     setFiltreExercice(exerciceActif.id.toString());
//     setFiltrePeriode('all');
//     setRecherche('');
//     setFiltreRegion('all');
//     setFiltreProvince('all');
//     setFiltreCommune('all');
//     setFiltreSecteur('all');
//     setFiltreTypeBeneficiaire('all');
//     setFiltreGenre('all');
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
//             <select
//               value={filtreRegion}
//               onChange={(e) => setFiltreRegion(e.target.value)}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
//             >
//               <option value="all">Toutes les régions</option>
//               {filtres.regions.map(region => (
//                 <option key={region} value={region}>{region}</option>
//               ))}
//             </select>
//           </div>

//           {/* Filtre par province */}
//           <div className="flex flex-col">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
//             <select
//               value={filtreProvince}
//               onChange={(e) => setFiltreProvince(e.target.value)}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
//             >
//               <option value="all">Toutes les provinces</option>
//               {filtres.provinces.map(province => (
//                 <option key={province} value={province}>{province}</option>
//               ))}
//             </select>
//           </div>

//           {/* Filtre par commune */}
//           <div className="flex flex-col">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Commune</label>
//             <select
//               value={filtreCommune}
//               onChange={(e) => setFiltreCommune(e.target.value)}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
//             >
//               <option value="all">Toutes les communes</option>
//               {filtres.communes.map(commune => (
//                 <option key={commune} value={commune}>{commune}</option>
//               ))}
//             </select>
//           </div>

//           {/* Filtre par secteur d'activité */}
//           <div className="flex flex-col">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Secteur d'activité</label>
//             <select
//               value={filtreSecteur}
//               onChange={(e) => setFiltreSecteur(e.target.value)}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
//             >
//               <option value="all">Tous les secteurs</option>
//               {filtres.secteursActivite.map(secteur => (
//                 <option key={secteur} value={secteur}>{secteur}</option>
//               ))}
//             </select>
//           </div>

//           {/* Filtre par type de bénéficiaire */}
//           <div className="flex flex-col">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Type de bénéficiaire</label>
//             <select
//               value={filtreTypeBeneficiaire}
//               onChange={(e) => setFiltreTypeBeneficiaire(e.target.value)}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
//             >
//               <option value="all">Tous les types</option>
//               {filtres.typesBeneficiaires.map(type => (
//                 <option key={type} value={type}>{type}</option>
//               ))}
//             </select>
//           </div>

//           {/* Filtre par genre */}
//           <div className="flex flex-col">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
//             <select
//               value={filtreGenre}
//               onChange={(e) => setFiltreGenre(e.target.value)}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
//             >
//               <option value="all">Tous les genres</option>
//               {filtres.genres.map(genre => (
//                 <option key={genre} value={genre}>{genre}</option>
//               ))}
//             </select>
//           </div>

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

// //   return (
// //     <div className="py-6">
// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// //         {/* Barre de recherche globale */}
// //         <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
// //           <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-end">
// //             <div className="w-full md:flex-grow">
// //               <div className="relative">
// //                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
// //                 <Search className="h-5 w-5 text-gray-400" />
// //                 </div>
// //                 <input
// //                   type="text"
// //                   placeholder="Recherche globale..."
// //                   value={recherche}
// //                   onChange={(e) => setRecherche(e.target.value)}
// //                   className="pl-10 pr-10 py-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 block w-full rounded-md"
// //                 />
// //                 {recherche && (
// //                   <button
// //                     className="absolute inset-y-0 right-0 pr-3 flex items-center"
// //                     onClick={() => setRecherche('')}
// //                   >
// //                     <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
// //                   </button>
// //                 )}
// //               </div>
// //             </div>

// //             <div className="grid grid-cols-3 gap-4">
// //               {/* Filtre par catégorie */}
// //               <div>
// //                 <select
// //                   value={filtreCategorie}
// //                   onChange={(e) => setFiltreCategorie(e.target.value)}
// //                   className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
// //                 >
// //                   <option value="all">Toutes les catégories</option>
// //                   {categories.map((cat) => (
// //                     <option key={cat.id} value={cat.id}>{cat.nom}</option>
// //                   ))}
// //                 </select>
// //               </div>

// //               {/* Filtre par exercice */}
// //               <div>
// //                 <select
// //                   value={filtreExercice}
// //                   onChange={(e) => setFiltreExercice(e.target.value)}
// //                   className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
// //                 >
// //                   {exercices.map((ex) => (
// //                     <option key={ex.id} value={ex.id.toString()}>{ex.annee}</option>
// //                   ))}
// //                 </select>
// //               </div>

// //               {/* Filtre par période */}
// //               <div>
// //                 <select
// //                   value={filtrePeriode}
// //                   onChange={(e) => setFiltrePeriode(e.target.value)}
// //                   className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
// //                 >
// //                   <option value="all">Toutes les périodes</option>
// //                   {periodes
// //                     .filter(p => filtreExercice === 'all' || p.exercice_id.toString() === filtreExercice)
// //                     .map((p) => (
// //                       <option key={p.id} value={p.id.toString()}>{p.nom}</option>
// //                     ))
// //                   }
// //                 </select>
// //               </div>
// //             </div>
// //           </div>

// //           <div className="flex justify-end mt-4">
// //             <button
// //               onClick={() => setFiltresAvances(!filtresAvances)}
// //               className="bg-blue-50 text-blue-500 border border-blue-200 hover:bg-blue-100 transition-colors px-4 py-2 rounded-md text-sm flex items-center gap-2"
// //             >
// //               <Sliders className="h-4 w-4" />
// //               <span>
// //                 {filtresAvances ? 'Masquer les filtres avancés' : 'Afficher les filtres avancés'}
// //               </span>
// //               <ChevronDown className={`h-4 w-4 transition-transform ${filtresAvances ? 'rotate-180' : ''}`} />
// //             </button>
// //           </div>

// //           {/* Filtres avancés (conditionnels) */}
// //           <FiltresAvances />
// //         </div>

// //         {/* Barre d'actions */}
// //         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
// //           <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 text-sm text-gray-700">
// //             <span className="font-medium mr-1">{indicateursFiltres.length}</span>
// //             indicateurs trouvés {recherche && <span>pour "<span className="italic">{recherche}</span>"</span>}
// //           </div>

// //           <div className="flex gap-2">
// //             <button
// //               onClick={handleGenererRapport}
// //               className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2 transition-colors"
// //             >
// //               <FileText className="h-4 w-4" />
// //               <span className="hidden sm:inline">Générer un rapport</span>
// //               <span className="inline sm:hidden">Rapport</span>
// //             </button>

// //             <button
// //               onClick={handleExporterExcel}
// //               className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2 transition-colors"
// //             >
// //               <Download className="h-4 w-4" />
// //               <span className="hidden sm:inline">Exporter (Excel)</span>
// //               <span className="inline sm:hidden">Exporter</span>
// //             </button>
// //           </div>
// //         </div>

// //         {/* État de chargement */}
// //         {isLoading ? (
// //           <div className="flex justify-center items-center py-12">
// //             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
// //           </div>
// //         ) : (
// //           <>
// //             {/* Message d'alerte si aucun indicateur */}
// //             {indicateursFiltres.length === 0 && (
// //               <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
// //                 <div className="flex">
// //                   <div className="flex-shrink-0">
// //                     <AlertCircle className="h-5 w-5 text-yellow-400" />
// //                   </div>
// //                   <div className="ml-3">
// //                     <p className="text-sm text-yellow-700">
// //                       Aucun indicateur ne correspond à vos critères de recherche.
// //                     </p>
// //                   </div>
// //                 </div>
// //               </div>
// //             )}

// //             {/* Grille d'indicateurs */}
// //             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// //               {indicateursParCategorie.map(categorie => (
// //                 <IndicateursList
// //                   key={categorie.id}
// //                   titre={categorie.nom}
// //                   icone={categorie.icone}
// //                   couleur={categorie.couleur}
// //                   indicateurs={categorie.indicateurs}
// //                   onIndicateurClick={handleIndicateurClick}
// //                   filtrerParTendance={true}
// //                 />
// //               ))}
// //             </div>
// //           </>
// //         )}
// //       </div>

// //       {/* Modal de détail d'indicateur */}
// //       {indicateurSelectionne && (
// //         <IndicateurDetailModal
// //           isOpen={modal}
// //           onClose={() => setModal(false)}
// //           indicateur={indicateurSelectionne}
// //         />
// //       )}
// //     </div>
// //   );
// // }
// return (
//     <div className="py-6">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Barre de recherche globale */}
//         <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
//           <div className="flex flex-col gap-4">
//             {/* Barre de recherche */}
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Search className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Recherche globale..."
//                 value={recherche}
//                 onChange={(e) => setRecherche(e.target.value)}
//                 className="pl-10 pr-10 py-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 block w-full rounded-md"
//               />
//               {recherche && (
//                 <button
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                   onClick={() => setRecherche('')}
//                 >
//                   <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//                 </button>
//               )}
//             </div>

//             {/* Filtres de base sur une ligne */}
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
//               {/* Filtre par catégorie */}
//               <div>
//                 <select
//                   value={filtreCategorie}
//                   onChange={(e) => setFiltreCategorie(e.target.value)}
//                   className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
//                 >
//                   <option value="all">Toutes les catégories</option>
//                   {categories.map((cat) => (
//                     <option key={cat.id} value={cat.id}>{cat.nom}</option>
//                   ))}
//                 </select>
//               </div>

//               {/* Filtre par exercice */}
//               <div>
//                 <select
//                   value={filtreExercice}
//                   onChange={(e) => setFiltreExercice(e.target.value)}
//                   className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
//                 >
//                   {exercices.map((ex) => (
//                     <option key={ex.id} value={ex.id.toString()}>{ex.annee}</option>
//                   ))}
//                 </select>
//               </div>

//               {/* Filtre par période */}
//               <div>
//                 <select
//                   value={filtrePeriode}
//                   onChange={(e) => setFiltrePeriode(e.target.value)}
//                   className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
//                 >
//                   <option value="all">Toutes les périodes</option>
//                   {periodes
//                     .filter(p => filtreExercice === 'all' || p.exercice_id.toString() === filtreExercice)
//                     .map((p) => (
//                       <option key={p.id} value={p.id.toString()}>{p.nom}</option>
//                     ))
//                   }
//                 </select>
//               </div>
//             </div>

//             {/* Bouton filtres avancés */}
//             <div className="flex justify-end">
//               <button
//                 onClick={() => setFiltresAvances(!filtresAvances)}
//                 className="bg-blue-50 text-blue-500 border border-blue-200 hover:bg-blue-100 transition-colors px-4 py-2 rounded-md text-sm flex items-center gap-2"
//               >
//                 <Sliders className="h-4 w-4" />
//                 <span>
//                   {filtresAvances ? 'Masquer les filtres avancés' : 'Afficher les filtres avancés'}
//                 </span>
//                 <ChevronDown className={`h-4 w-4 transition-transform ${filtresAvances ? 'rotate-180' : ''}`} />
//               </button>
//             </div>

//             {/* Filtres avancés (conditionnels) */}
//             <FiltresAvances />
//           </div>
//         </div>

//         {/* Barre d'actions */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//           <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 text-sm text-gray-700">
//             <span className="font-medium mr-1">{indicateursFiltres.length}</span>
//             indicateurs trouvés {recherche && <span>pour "<span className="italic">{recherche}</span>"</span>}
//           </div>

//           <div className="flex gap-2">
//             <button
//               onClick={handleGenererRapport}
//               className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2 transition-colors"
//             >
//               <FileText className="h-4 w-4" />
//               <span className="hidden sm:inline">Générer un rapport</span>
//               <span className="inline sm:hidden">Rapport</span>
//             </button>

//             <button
//               onClick={handleExporterExcel}
//               className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2 transition-colors"
//             >
//               <Download className="h-4 w-4" />
//               <span className="hidden sm:inline">Exporter (Excel)</span>
//               <span className="inline sm:hidden">Exporter</span>
//             </button>
//           </div>
//         </div>

//         {/* État de chargement */}
//         {isLoading ? (
//           <div className="flex justify-center items-center py-12">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//           </div>
//         ) : (
//           <>
//             {/* Message d'alerte si aucun indicateur */}
//             {indicateursFiltres.length === 0 && (
//               <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
//                 <div className="flex">
//                   <div className="flex-shrink-0">
//                     <AlertCircle className="h-5 w-5 text-yellow-400" />
//                   </div>
//                   <div className="ml-3">
//                     <p className="text-sm text-yellow-700">
//                       Aucun indicateur ne correspond à vos critères de recherche.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Grille d'indicateurs */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               {indicateursParCategorie.map(categorie => (
//                 <IndicateursList
//                   key={categorie.id}
//                   titre={categorie.nom}
//                   icone={categorie.icone}
//                   couleur={categorie.couleur}
//                   indicateurs={categorie.indicateurs}
//                   onIndicateurClick={handleIndicateurClick}
//                   filtrerParTendance={true}
//                 />
//               ))}
//             </div>
//           </>
//         )}
//       </div>

//       {/* Modal de détail d'indicateur */}
//       {indicateurSelectionne && (
//         <IndicateurDetailModal
//           isOpen={modal}
//           onClose={() => setModal(false)}
//           indicateur={indicateurSelectionne}
//         />
//       )}
//     </div>
//   );
// }
// import React, { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
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
//   X,
//   PieChart,
//   BarChart2,
//   Filter,
//   RefreshCw
// } from 'lucide-react';
// import IndicateursList from '@/components/Analyse/IndicateursList';
// import IndicateurDetailModal from '@/components/Analyse/IndicateurDetailModal';

// // Types et interfaces
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
//   actif: boolean;
// }

// interface Periode {
//   id: number;
//   nom: string;
//   exercice_id: number;
// }

// interface IndicateurDB {
//   id: number;
//   nom: string;
//   categorie: string;
//   description: string;
// }

// interface Filtres {
//   regions: string[];
//   provinces: string[];
//   communes: string[];
//   typesBeneficiaires: string[];
//   genres: string[];
//   secteursActivite: string[];
//   handicaps: string[];
//   niveauxInstruction: string[];
//   descriptionsActivite: string[];
//   niveauxDeveloppement: string[];
// }

// interface AnalyseProps {
//   exerciceActif: Exercice;
//   exercices: Exercice[];
//   periodes: Periode[];
//   indicateurs: IndicateurDB[];
//   filtres: Filtres;
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
//     id: 'tresorerie',
//     nom: 'Indicateurs de trésorerie',
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
//   },
//   {
//     id: 'financier',
//     nom: 'Indicateurs financiers',
//     icone: <PieChart className="h-5 w-5" />,
//     couleur: 'indigo'
//   },
//   {
//     id: 'rentabilite',
//     nom: 'Indicateurs de rentabilité',
//     icone: <TrendingUp className="h-5 w-5" />,
//     couleur: 'red'
//   },
//   {
//     id: 'activite',
//     nom: "Indicateurs d'activité",
//     icone: <BarChart2 className="h-5 w-5" />,
//     couleur: 'amber'
//   },
//   {
//     id: 'performance',
//     nom: 'Indicateurs de performance',
//     icone: <BarChart className="h-5 w-5" />,
//     couleur: 'emerald'
//   }
// ];

// // Composant principal pour l'analyse des indicateurs
// export default function AnalyseIndicateurs({
//   exerciceActif,
//   exercices,
//   periodes,
//   filtres
// }: AnalyseProps) {
//   // États
//   const [donnees, setDonnees] = useState<Indicateur[]>([]);
//   const [filtreCategorie, setFiltreCategorie] = useState<string>('all');
//   const [filtreExercice, setFiltreExercice] = useState<string>(exerciceActif.id.toString());
//   const [filtrePeriode, setFiltrePeriode] = useState<string>('all');
//   const [recherche, setRecherche] = useState<string>('');
//   const [filtresAvances, setFiltresAvances] = useState<boolean>(false);
//   const [filtreRegion, setFiltreRegion] = useState<string>('all');
//   const [filtreProvince, setFiltreProvince] = useState<string>('all');
//   const [filtreCommune, setFiltreCommune] = useState<string>('all');
//   const [filtreSecteur, setFiltreSecteur] = useState<string>('all');
//   const [filtreTypeBeneficiaire, setFiltreTypeBeneficiaire] = useState<string>('all');
//   const [filtreGenre, setFiltreGenre] = useState<string>('all');
//   const [filtreHandicap, setFiltreHandicap] = useState<string>('all');
//   const [filtreNiveauInstruction, setFiltreNiveauInstruction] = useState<string>('all');

//   const [indicateurSelectionne, setIndicateurSelectionne] = useState<Indicateur | null>(null);
//   const [modal, setModal] = useState<boolean>(false);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [viewMode, setViewMode] = useState<'liste' | 'dashboard'>('liste');
//   const [filtresActifs, setFiltresActifs] = useState<number>(0);

//   // Chargement des données au démarrage et lorsque les filtres changent
//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true);
//       try {
//         const response = await axios.get(route('analyse.donnees'), {
//           params: {
//             exercice_id: filtreExercice !== 'all' ? filtreExercice : null,
//             periode_id: filtrePeriode !== 'all' ? filtrePeriode : null,
//             categorie: filtreCategorie !== 'all' ? filtreCategorie : null,
//             region: filtreRegion !== 'all' ? filtreRegion : null,
//             province: filtreProvince !== 'all' ? filtreProvince : null,
//             commune: filtreCommune !== 'all' ? filtreCommune : null,
//             secteur_activite: filtreSecteur !== 'all' ? filtreSecteur : null,
//             type_beneficiaire: filtreTypeBeneficiaire !== 'all' ? filtreTypeBeneficiaire : null,
//             genre: filtreGenre !== 'all' ? filtreGenre : null,
//             handicap: filtreHandicap !== 'all' ? filtreHandicap : null,
//             niveau_instruction: filtreNiveauInstruction !== 'all' ? filtreNiveauInstruction : null
//           }
//         });
//         setDonnees(response.data.donneesIndicateurs || []);
//       } catch (error) {
//         console.error('Erreur lors du chargement des données:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [
//     filtreExercice,
//     filtrePeriode,
//     filtreCategorie,
//     filtreRegion,
//     filtreProvince,
//     filtreCommune,
//     filtreSecteur,
//     filtreTypeBeneficiaire,
//     filtreGenre,
//     filtreHandicap,
//     filtreNiveauInstruction
//   ]);

//   // Compter les filtres actifs
//   useEffect(() => {
//     let count = 0;

//     if (filtreCategorie !== 'all') count++;
//     if (filtrePeriode !== 'all') count++;
//     if (filtreRegion !== 'all') count++;
//     if (filtreProvince !== 'all') count++;
//     if (filtreCommune !== 'all') count++;
//     if (filtreSecteur !== 'all') count++;
//     if (filtreTypeBeneficiaire !== 'all') count++;
//     if (filtreGenre !== 'all') count++;
//     if (filtreHandicap !== 'all') count++;
//     if (filtreNiveauInstruction !== 'all') count++;
//     if (recherche !== '') count++;

//     setFiltresActifs(count);
//   }, [
//     filtreCategorie,
//     filtrePeriode,
//     filtreRegion,
//     filtreProvince,
//     filtreCommune,
//     filtreSecteur,
//     filtreTypeBeneficiaire,
//     filtreGenre,
//     filtreHandicap,
//     filtreNiveauInstruction,
//     recherche
//   ]);

//   // Sauvegarder les filtres dans le localStorage
//   useEffect(() => {
//     localStorage.setItem('analyse-filtres', JSON.stringify({
//       categorie: filtreCategorie,
//       exercice: filtreExercice,
//       periode: filtrePeriode,
//       region: filtreRegion,
//       province: filtreProvince,
//       commune: filtreCommune,
//       secteur: filtreSecteur,
//       typeBeneficiaire: filtreTypeBeneficiaire,
//       genre: filtreGenre,
//       handicap: filtreHandicap,
//       niveauInstruction: filtreNiveauInstruction,
//       recherche: recherche,
//       viewMode: viewMode
//     }));
//   }, [
//     filtreCategorie,
//     filtreExercice,
//     filtrePeriode,
//     filtreRegion,
//     filtreProvince,
//     filtreCommune,
//     filtreSecteur,
//     filtreTypeBeneficiaire,
//     filtreGenre,
//     filtreHandicap,
//     filtreNiveauInstruction,
//     recherche,
//     viewMode
//   ]);

//   // Récupérer les filtres du localStorage au chargement
//   useEffect(() => {
//     try {
//       const savedFilters = localStorage.getItem('analyse-filtres');
//       if (savedFilters) {
//         const parsedFilters = JSON.parse(savedFilters);
//         // Appliquer les filtres sauvegardés
//         if (parsedFilters.categorie) setFiltreCategorie(parsedFilters.categorie);
//         if (parsedFilters.exercice) setFiltreExercice(parsedFilters.exercice);
//         if (parsedFilters.periode) setFiltrePeriode(parsedFilters.periode);
//         if (parsedFilters.region) setFiltreRegion(parsedFilters.region);
//         if (parsedFilters.province) setFiltreProvince(parsedFilters.province);
//         if (parsedFilters.commune) setFiltreCommune(parsedFilters.commune);
//         if (parsedFilters.secteur) setFiltreSecteur(parsedFilters.secteur);
//         if (parsedFilters.typeBeneficiaire) setFiltreTypeBeneficiaire(parsedFilters.typeBeneficiaire);
//         if (parsedFilters.genre) setFiltreGenre(parsedFilters.genre);
//         if (parsedFilters.handicap) setFiltreHandicap(parsedFilters.handicap);
//         if (parsedFilters.niveauInstruction) setFiltreNiveauInstruction(parsedFilters.niveauInstruction);
//         if (parsedFilters.recherche) setRecherche(parsedFilters.recherche);
//         if (parsedFilters.viewMode) setViewMode(parsedFilters.viewMode);
//       }
//     } catch (e) {
//       console.error('Erreur lors de la récupération des filtres sauvegardés:', e);
//     }
//   }, []);

//   // Logique de filtrage global
//   const indicateursFiltres = donnees.filter(indicateur => {
//     // Filtre par recherche globale
//     const matchRecherche = recherche === '' ||
//       indicateur.nom.toLowerCase().includes(recherche.toLowerCase()) ||
//       indicateur.entreprise_nom.toLowerCase().includes(recherche.toLowerCase()) ||
//       (indicateur.region && indicateur.region.toLowerCase().includes(recherche.toLowerCase()));

//     // Combiner tous les filtres
//     return matchRecherche;
//   });

//   // Grouper par catégorie
//   const indicateursParCategorie = categories.map(categorie => {
//     return {
//       ...categorie,
//       indicateurs: indicateursFiltres.filter(ind => ind.categorie === categorie.id)
//     };
//   });

//   // Gestion des événements
//   const handleIndicateurClick = useCallback((indicateur: Indicateur) => {
//     setIndicateurSelectionne(indicateur);
//     setModal(true);
//   }, []);

//   const handleExporterExcel = useCallback(() => {
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
//     const exerciceInput = document.createElement('input');
//     exerciceInput.type = 'hidden';
//     exerciceInput.name = 'exercice_id';
//     exerciceInput.value = filtreExercice;
//     form.appendChild(exerciceInput);

//     if (filtrePeriode !== 'all') {
//       const periodeInput = document.createElement('input');
//       periodeInput.type = 'hidden';
//       periodeInput.name = 'periode_id';
//       periodeInput.value = filtrePeriode;
//       form.appendChild(periodeInput);
//     }

//     // Ajouter les catégories sélectionnées
//     const categoriesInput = document.createElement('input');
//     categoriesInput.type = 'hidden';
//     categoriesInput.name = 'categories';
//     categoriesInput.value = JSON.stringify(filtreCategorie === 'all'
//       ? categories.map(c => c.id)
//       : [filtreCategorie]);
//     form.appendChild(categoriesInput);

//     // Ajouter le format d'export
//     const formatInput = document.createElement('input');
//     formatInput.type = 'hidden';
//     formatInput.name = 'format';
//     formatInput.value = 'excel';
//     form.appendChild(formatInput);

//     // Soumettre le formulaire
//     document.body.appendChild(form);
//     form.submit();
//     document.body.removeChild(form);
//   }, [filtreCategorie, filtreExercice, filtrePeriode]);

//   const handleGenererRapport = useCallback(() => {
//     // Créer un formulaire pour soumettre les paramètres du rapport
//     const form = document.createElement('form');
//     form.method = 'POST';
//     form.action = route('analyse.rapport');

//     // Ajouter le token CSRF
//     const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
//     const csrfInput = document.createElement('input');
//     csrfInput.type = 'hidden';
//     csrfInput.name = '_token';
//     csrfInput.value = csrfToken || '';
//     form.appendChild(csrfInput);

//     // Ajouter les filtres
//     const exerciceInput = document.createElement('input');
//     exerciceInput.type = 'hidden';
//     exerciceInput.name = 'exercice_id';
//     exerciceInput.value = filtreExercice;
//     form.appendChild(exerciceInput);

//     if (filtrePeriode !== 'all') {
//       const periodeInput = document.createElement('input');
//       periodeInput.type = 'hidden';
//       periodeInput.name = 'periode_id';
//       periodeInput.value = filtrePeriode;
//       form.appendChild(periodeInput);
//     }

//     // Ajouter les catégories sélectionnées
//     const categoriesInput = document.createElement('input');
//     categoriesInput.type = 'hidden';
//     categoriesInput.name = 'categories';
//     categoriesInput.value = JSON.stringify(filtreCategorie === 'all'
//       ? categories.map(c => c.id)
//       : [filtreCategorie]);
//     form.appendChild(categoriesInput);

//     // Ajouter les filtres géographiques et démographiques
//     if (filtreRegion !== 'all') {
//       const regionInput = document.createElement('input');
//       regionInput.type = 'hidden';
//       regionInput.name = 'region';
//       regionInput.value = filtreRegion;
//       form.appendChild(regionInput);
//     }

//     if (filtreProvince !== 'all') {
//       const provinceInput = document.createElement('input');
//       provinceInput.type = 'hidden';
//       provinceInput.name = 'province';
//       provinceInput.value = filtreProvince;
//       form.appendChild(provinceInput);
//     }

//     if (filtreCommune !== 'all') {
//       const communeInput = document.createElement('input');
//       communeInput.type = 'hidden';
//       communeInput.name = 'commune';
//       communeInput.value = filtreCommune;
//       form.appendChild(communeInput);
//     }

//     if (filtreSecteur !== 'all') {
//       const secteurInput = document.createElement('input');
//       secteurInput.type = 'hidden';
//       secteurInput.name = 'secteur_activite';
//       secteurInput.value = filtreSecteur;
//       form.appendChild(secteurInput);
//     }

//     if (filtreTypeBeneficiaire !== 'all') {
//       const typeBeneficiaireInput = document.createElement('input');
//       typeBeneficiaireInput.type = 'hidden';
//       typeBeneficiaireInput.name = 'type_beneficiaire';
//       typeBeneficiaireInput.value = filtreTypeBeneficiaire;
//       form.appendChild(typeBeneficiaireInput);
//     }

//     if (filtreGenre !== 'all') {
//       const genreInput = document.createElement('input');
//       genreInput.type = 'hidden';
//       genreInput.name = 'genre';
//       genreInput.value = filtreGenre;
//       form.appendChild(genreInput);
//     }

//     if (filtreHandicap !== 'all') {
//       const handicapInput = document.createElement('input');
//       handicapInput.type = 'hidden';
//       handicapInput.name = 'handicap';
//       handicapInput.value = filtreHandicap;
//       form.appendChild(handicapInput);
//     }

//     if (filtreNiveauInstruction !== 'all') {
//       const niveauInstructionInput = document.createElement('input');
//       niveauInstructionInput.type = 'hidden';
//       niveauInstructionInput.name = 'niveau_instruction';
//       niveauInstructionInput.value = filtreNiveauInstruction;
//       form.appendChild(niveauInstructionInput);
//     }

//     // Soumettre le formulaire
//     document.body.appendChild(form);
//     form.submit();
//     document.body.removeChild(form);
//   }, [
//     filtreCategorie,
//     filtreExercice,
//     filtrePeriode,
//     filtreRegion,
//     filtreProvince,
//     filtreCommune,
//     filtreSecteur,
//     filtreTypeBeneficiaire,
//     filtreGenre,
//     filtreHandicap,
//     filtreNiveauInstruction
//   ]);

//   const reinitialiserFiltres = useCallback(() => {
//     setFiltreCategorie('all');
//     setFiltreExercice(exerciceActif.id.toString());
//     setFiltrePeriode('all');
//     setRecherche('');
//     setFiltreRegion('all');
//     setFiltreProvince('all');
//     setFiltreCommune('all');
//     setFiltreSecteur('all');
//     setFiltreTypeBeneficiaire('all');
//     setFiltreGenre('all');
//     setFiltreHandicap('all');
//     setFiltreNiveauInstruction('all');
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
//         <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mt-4">
//           <div className="mb-4 flex justify-between items-center">
//             <h3 className="text-md font-semibold text-gray-700">Filtres avancés</h3>
//             <button
//               onClick={reinitialiserFiltres}
//               className="flex items-center gap-1 text-blue-500 hover:text-blue-700 text-sm"
//             >
//               <RefreshCw className="h-3.5 w-3.5" />
//               <span>Réinitialiser tous les filtres</span>
//             </button>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {/* Filtres géographiques */}
//             <div className="space-y-3">
//               <h4 className="text-sm font-medium text-gray-600 border-b pb-1">Localisation</h4>

//               {/* Filtre par région */}
//               <div className="flex flex-col">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Région</label>
//                 <select
//                   value={filtreRegion}
//                   onChange={(e) => setFiltreRegion(e.target.value)}
//                   className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
//                 >
//                   <option value="all">Toutes les régions</option>
//                   {filtres.regions.map(region => (
//                     <option key={region} value={region}>{region}</option>
//                   ))}
//                 </select>
//               </div>

//               {/* Filtre par province */}
//               <div className="flex flex-col">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
//                 <select
//                   value={filtreProvince}
//                   onChange={(e) => setFiltreProvince(e.target.value)}
//                   className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
//                 >
//                   <option value="all">Toutes les provinces</option>
//                   {filtres.provinces
//                     .filter(province => filtreRegion === 'all' ||
//                       // Ici, vous pourriez ajouter une logique pour filtrer les provinces en fonction de la région
//                       true)
//                     .map(province => (
//                       <option key={province} value={province}>{province}</option>
//                     ))
//                   }
//                 </select>
//               </div>

//               {/* Filtre par commune */}
//               <div className="flex flex-col">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Commune</label>
//                 <select
//                   value={filtreCommune}
//                   onChange={(e) => setFiltreCommune(e.target.value)}
//                   className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
//                 >
//                   <option value="all">Toutes les communes</option>
//                   {filtres.communes
//                     .filter(commune =>
//                       (filtreRegion === 'all' && filtreProvince === 'all') ||
//                       // Ici, vous pourriez ajouter une logique pour filtrer les communes en fonction de la province
//                       true)
//                     .map(commune => (
//                       <option key={commune} value={commune}>{commune}</option>
//                     ))
//                   }
//                 </select>
//               </div>
//             </div>

//             {/* Filtres activité */}
//             <div className="space-y-3">
//               <h4 className="text-sm font-medium text-gray-600 border-b pb-1">Activité</h4>

//               {/* Filtre par secteur d'activité */}
//               <div className="flex flex-col">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Secteur d'activité</label>
//                 <select
//                   value={filtreSecteur}
//                   onChange={(e) => setFiltreSecteur(e.target.value)}
//                   className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
//                 >
//                   <option value="all">Tous les secteurs</option>
//                   {filtres.secteursActivite.map(secteur => (
//                     <option key={secteur} value={secteur}>{secteur}</option>
//                   ))}
//                 </select>
//               </div>

//               {/* Niveau de développement */}
//               <div className="flex flex-col">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Niveau de développement</label>
//                 <select
//                   value={filtres.niveauxDeveloppement.length > 0 ? filtres.niveauxDeveloppement[0] : ''}
//                   onChange={(e) => {}}
//                   className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
//                   disabled={filtres.niveauxDeveloppement.length === 0}
//                 >
//                   <option value="all">Tous les niveaux</option>
//                   {filtres.niveauxDeveloppement.map(niveau => (
//                     <option key={niveau} value={niveau}>{niveau}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             {/* Filtres bénéficiaires */}
//             <div className="space-y-3">
//               <h4 className="text-sm font-medium text-gray-600 border-b pb-1">Bénéficiaires</h4>

//               {/* Filtre par type de bénéficiaire */}
//               <div className="flex flex-col">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Type de bénéficiaire</label>
//                 <select
//                   value={filtreTypeBeneficiaire}
//                   onChange={(e) => setFiltreTypeBeneficiaire(e.target.value)}
//                   className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
//                 >
//                   <option value="all">Tous les types</option>
//                   {filtres.typesBeneficiaires.map(type => (
//                     <option key={type} value={type}>{type}</option>
//                   ))}
//                 </select>
//               </div>

//               {/* Filtre par genre */}
//               <div className="flex flex-col">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
//                 <select
//                   value={filtreGenre}
//                   onChange={(e) => setFiltreGenre(e.target.value)}
//                   className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
//                 >
//                   <option value="all">Tous les genres</option>
//                   {filtres.genres.map(genre => (
//                     <option key={genre} value={genre}>{genre}</option>
//                   ))}
//                 </select>
//               </div>

//               {/* Filtre par handicap */}
//               <div className="flex flex-col">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Situation de handicap</label>
//                 <select
//                   value={filtreHandicap}
//                   onChange={(e) => setFiltreHandicap(e.target.value)}
//                   className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
//                 >
//                   <option value="all">Tous</option>
//                   {filtres.handicaps.map(handicap => (
//                     <option key={handicap} value={handicap}>{handicap === 'Oui' ? 'En situation de handicap' : 'Sans handicap'}</option>
//                   ))}
//                 </select>
//               </div>

//               {/* Filtre par niveau d'instruction */}
//               <div className="flex flex-col">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Niveau d'instruction</label>
//                 <select
//                   value={filtreNiveauInstruction}
//                   onChange={(e) => setFiltreNiveauInstruction(e.target.value)}
//                   className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
//                 >
//                   <option value="all">Tous les niveaux</option>
//                   {filtres.niveauxInstruction.map(niveau => (
//                     <option key={niveau} value={niveau}>{niveau}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );

//   return (
//     <div className="py-6">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Barre de recherche globale et filtres de base */}
//         <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 mb-6">
//           {/* En-tête avec le titre et le compteur de filtres */}
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
//             <h2 className="text-xl font-bold text-gray-800 mb-2 sm:mb-0">Analyse des indicateurs</h2>
//             {filtresActifs > 0 && (
//               <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
//                 <Filter className="h-3.5 w-3.5 mr-1" />
//                 {filtresActifs} {filtresActifs === 1 ? 'filtre actif' : 'filtres actifs'}
//               </span>
//             )}
//           </div>

//           {/* Barre de recherche */}
//           <div className="mb-4">
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Search className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Rechercher un indicateur, une entreprise, une région..."
//                 value={recherche}
//                 onChange={(e) => setRecherche(e.target.value)}
//                 className="pl-10 pr-10 py-3 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 block w-full rounded-md"
//               />
//               {recherche && (
//                 <button
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                   onClick={() => setRecherche('')}
//                 >
//                   <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* Filtres principaux sur une grille */}
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
//             {/* Filtre par exercice */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Exercice</label>
//               <select
//                 value={filtreExercice}
//                 onChange={(e) => setFiltreExercice(e.target.value)}
//                 className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
//               >
//                 {exercices.map((ex) => (
//                   <option key={ex.id} value={ex.id.toString()}>
//                     {ex.annee} {ex.actif ? '(Actif)' : ''}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Filtre par période */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Période</label>
//               <select
//                 value={filtrePeriode}
//                 onChange={(e) => setFiltrePeriode(e.target.value)}
//                 className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
//                 disabled={periodes.filter(p => filtreExercice !== 'all' && p.exercice_id.toString() === filtreExercice).length === 0}
//               >
//                 <option value="all">Toutes les périodes</option>
//                 {periodes
//                   .filter(p => filtreExercice === 'all' || p.exercice_id.toString() === filtreExercice)
//                   .map((p) => (
//                     <option key={p.id} value={p.id.toString()}>{p.nom}</option>
//                   ))
//                 }
//               </select>
//             </div>

//             {/* Filtre par catégorie */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie d'indicateurs</label>
//               <select
//                 value={filtreCategorie}
//                 onChange={(e) => setFiltreCategorie(e.target.value)}
//                 className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
//               >
//                 <option value="all">Toutes les catégories</option>
//                 {categories.map((cat) => (
//                   <option key={cat.id} value={cat.id}>{cat.nom}</option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Bouton filtres avancés */}
//           <div className="flex justify-end">
//             <button
//               onClick={() => setFiltresAvances(!filtresAvances)}
//               className={`bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 transition-colors px-4 py-2 rounded-md text-sm flex items-center gap-2 ${filtresActifs > 3 ? 'font-medium' : ''}`}
//             >
//               <Sliders className="h-4 w-4" />
//               <span>
//                 {filtresAvances ? 'Masquer les filtres avancés' : 'Afficher les filtres avancés'}
//               </span>
//               <ChevronDown className={`h-4 w-4 transition-transform ${filtresAvances ? 'rotate-180' : ''}`} />
//             </button>
//           </div>

//           {/* Filtres avancés (conditionnels) */}
//           <FiltresAvances />
//         </div>

//         {/* Barre d'actions et statistiques */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//           <div className="bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200 text-sm text-gray-700 flex items-center">
//             <span className="font-medium mr-1">{indicateursFiltres.length}</span>
//             indicateurs trouvés
//             {recherche && <span className="ml-1">pour "<span className="italic">{recherche}</span>"</span>}
//             {isLoading && (
//               <div className="ml-2 animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
//             )}
//           </div>

//           <div className="flex gap-2">
//             <button
//               onClick={handleGenererRapport}
//               className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2 transition-colors"
//             >
//               <FileText className="h-4 w-4" />
//               <span className="hidden sm:inline">Générer un rapport</span>
//               <span className="inline sm:hidden">Rapport</span>
//             </button>

//             <button
//               onClick={handleExporterExcel}
//               className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2 transition-colors"
//             >
//               <Download className="h-4 w-4" />
//               <span className="hidden sm:inline">Exporter (Excel)</span>
//               <span className="inline sm:hidden">Exporter</span>
//             </button>
//           </div>
//         </div>

//         {/* État de chargement */}
//         {isLoading ? (
//           <div className="flex justify-center items-center py-12">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//           </div>
//         ) : (
//           <>
//             {/* Message d'alerte si aucun indicateur */}
//             {indicateursFiltres.length === 0 && (
//               <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
//                 <div className="flex">
//                   <div className="flex-shrink-0">
//                     <AlertCircle className="h-5 w-5 text-yellow-400" />
//                   </div>
//                   <div className="ml-3">
//                     <p className="text-sm text-yellow-700">
//                       Aucun indicateur ne correspond à vos critères de recherche.
//                       {filtresActifs > 0 && (
//                         <button
//                           onClick={reinitialiserFiltres}
//                           className="ml-2 text-yellow-800 underline hover:text-yellow-900"
//                         >
//                           Réinitialiser tous les filtres
//                         </button>
//                       )}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Grille d'indicateurs */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               {indicateursParCategorie
//                 .filter(cat => filtreCategorie === 'all' || cat.id === filtreCategorie)
//                 .map(categorie => (
//                   <IndicateursList
//                     key={categorie.id}
//                     titre={categorie.nom}
//                     icone={categorie.icone}
//                     couleur={categorie.couleur}
//                     indicateurs={categorie.indicateurs}
//                     onIndicateurClick={handleIndicateurClick}
//                     filtrerParTendance={true}
//                   />
//                 ))}
//             </div>
//           </>
//         )}
//       </div>

//       {/* Modal de détail d'indicateur */}
//       {indicateurSelectionne && (
//         <IndicateurDetailModal
//           isOpen={modal}
//           onClose={() => setModal(false)}
//           indicateur={indicateurSelectionne}
//         />
//       )}
//     </div>
//   );
// }

// import { Dialog, Transition } from '@headlessui/react';
// const TransitionChild = Transition.Child;
// import { Fragment } from 'react';

// // Define the types for the indicators
// interface Indicateur {
//   id: number;
//   nom: string;
//   valeur: number;
//   categorie: string;
//   entreprise_nom: string;
//   tendance?: 'hausse' | 'baisse' | 'stable';
// }

// interface AnalyseIndicateurProps {
//   indicateurs: Indicateur[];
// }

// const AnalyseIndicateur: React.FC<AnalyseIndicateurProps> = ({ indicateurs }) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedIndicateur, setSelectedIndicateur] = useState<Indicateur | null>(null);

//   const handleIndicateurClick = (indicateur: Indicateur) => {
//     setSelectedIndicateur(indicateur);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedIndicateur(null);
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold text-gray-800 mb-6">Analyse des Indicateurs</h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {indicateurs.map((indicateur) => (
//           <div
//             key={indicateur.id}
//             className="p-4 border rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
//             onClick={() => handleIndicateurClick(indicateur)}
//           >
//             <h2 className="text-lg font-semibold">{indicateur.nom}</h2>
//             <p className="text-gray-600">Valeur: {indicateur.valeur}</p>
//             <p className={`text-sm ${indicateur.tendance === 'hausse' ? 'text-green-500' : indicateur.tendance === 'baisse' ? 'text-red-500' : 'text-gray-500'}`}>
//               Tendance: {indicateur.tendance || 'Non spécifiée'}
//             </p>
//             <p className="text-gray-500">Entreprise: {indicateur.entreprise_nom}</p>
//           </div>
//         ))}
//       </div>

//       {/* Modal for displaying indicator details */}
//       <Transition appear show={isModalOpen} as={Fragment}>
//         <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={closeModal}>
//           <div className="min-h-screen px-4 text-center">
//             <TransitionChild
//               as={Fragment}
//               enter="ease-out duration-300"
//               enterFrom="opacity-0"
//               enterTo="opacity-100"
//               leave="ease-in duration-200"
//               leaveFrom="opacity-100"
//               leaveTo="opacity-0"
//             >
//               <div className="fixed inset-0 bg-black bg-opacity-40" />
//             </TransitionChild>

//             <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>

//             <TransitionChild
//               as={Fragment}
//               enter="ease-out duration-300"
//               enterFrom="opacity-0 scale-95"
//               enterTo="opacity-100 scale-100"
//               leave="ease-in duration-200"
//               leaveFrom="opacity-100 scale-100"
//               leaveTo="opacity-0 scale-95"
//             >
//               <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
//                 {selectedIndicateur && (
//                   <IndicateurDetailModal
//                     isOpen={isModalOpen}
//                     onClose={closeModal}
//                     indicateur={selectedIndicateur}
//                   />
//                 )}
//               </div>
//             </TransitionChild>
//           </div>
//         </Dialog>
//       </Transition>
//     </div>
//   );
// };

// export default AnalyseIndicateur;

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  DollarSign,
  ShoppingBag,
  Users,
  Briefcase,
  TrendingUp,
  BarChart4,
  PieChart,
  Search,
  Filter,
  X,
  Download,
  RefreshCw
} from 'lucide-react';
import CardMetrique from '@/components/Analyse/cmd';

import { PeriodeName, IndicateurField } from '@/Utils/IndicateurCalculator';
import IndicateursList from '@/components/Analyse/IndicateursList';
import IndicateurDetailModal from '@/components/Analyse/IndicateurDetailModal';

// Types et interfaces
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
  description?: string;
}

interface Exercice {
  id: number;
  annee: number;
  actif: boolean;
}

interface Periode {
  id: number;
  nom: string;
  exercice_id: number;
}

interface Filtres {
  regions: string[];
  provinces: string[];
  communes: string[];
  typesBeneficiaires: string[];
  genres: string[];
  secteursActivite: string[];
  handicaps: string[];
  niveauxInstruction: string[];
  descriptionsActivite: string[];
  niveauxDeveloppement: string[];
}

interface AnalyseProps {
  exerciceActif: Exercice;
  exercices: Exercice[];
  periodes: Periode[];
  indicateurs: Indicateur[];
  filtres: Filtres;
  availablePeriodes: PeriodeName[];
  availableCategories: Record<PeriodeName, string[]>;
  availableIndicateurs: Record<PeriodeName, Record<string, IndicateurField[]>>;
}

const AnalyseIndicateurs = ({
  exerciceActif,
  exercices,
  periodes,
  indicateurs,
  filtres,
  availablePeriodes,
  availableCategories,
  availableIndicateurs
}: AnalyseProps) => {
  // États pour les filtres
  const [filtreExercice, setFiltreExercice] = useState<string>(exerciceActif?.id?.toString() || '');
  const [filtrePeriode, setFiltrePeriode] = useState<string>('all');
  const [filtreRegion, setFiltreRegion] = useState<string>('all');
  const [filtreProvince, setFiltreProvince] = useState<string>('all');
  const [filtreCommune, setFiltreCommune] = useState<string>('all');
  const [filtreSecteur, setFiltreSecteur] = useState<string>('all');
  const [filtreGenre, setFiltreGenre] = useState<string>('all');
  const [filtreCategorie, setFiltreCategorie] = useState<string>('all');
  const [recherche, setRecherche] = useState<string>('');

  // États pour les données et l'UI
  const [donnees, setDonnees] = useState<Indicateur[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [indicateurSelectionne, setIndicateurSelectionne] = useState<Indicateur | null>(null);
  const [modalOuvert, setModalOuvert] = useState<boolean>(false);
  const [vueActuelle, setVueActuelle] = useState<'liste' | 'cartes'>('liste');

  // Chargement des données
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(route('analyse.donnees'), {
          params: {
            exercice_id: filtreExercice,
            periode_id: filtrePeriode !== 'all' ? filtrePeriode : null,
            region: filtreRegion !== 'all' ? filtreRegion : null,
            province: filtreProvince !== 'all' ? filtreProvince : null,
            commune: filtreCommune !== 'all' ? filtreCommune : null,
            secteur_activite: filtreSecteur !== 'all' ? filtreSecteur : null,
            genre: filtreGenre !== 'all' ? filtreGenre : null,
            categorie: filtreCategorie !== 'all' ? filtreCategorie : null
          }
        });
        setDonnees(response.data.donnees || []);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setError('Impossible de charger les données. Veuillez réessayer plus tard.');

        // En cas d'erreur, utiliser les indicateurs passés en props pour une expérience minimale
        if (indicateurs && indicateurs.length > 0) {
          setDonnees(indicateurs);
        }
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
    filtreCategorie,
    indicateurs
  ]);

  // Préparation des données pour les métriques clés
  const metriques = useMemo(() => {
    if (!donnees.length) return [];

    // Indicateurs commerciaux
    const chiffreAffaires = donnees.find(d => d.nom === "Chiffre d'affaires")?.valeur || 0;

    // Indicateurs financiers
    const resultatNet = donnees.find(d => d.nom === "Résultat net")?.valeur || 0;

    // Indicateurs RH
    const nombreEmployes = donnees.find(d => d.nom === "Nombre d'employés")?.valeur || 0;

    // Indicateurs de performance projet
    const nombrePromoteurs = donnees.find(d => d.nom === "Nombre de promoteurs accompagnés")?.valeur || 0;

    return [
      {
        titre: "Chiffre d'affaires",
        valeur: chiffreAffaires,
        unite: 'FCFA',
        icon: <ShoppingBag />,
        couleur: 'blue',
        tendance: 'hausse'
      },
      {
        titre: "Résultat net",
        valeur: resultatNet,
        unite: 'FCFA',
        icon: <DollarSign />,
        couleur: 'green',
        tendance: 'hausse'
      },
      {
        titre: "Nombre d'employés",
        valeur: nombreEmployes,
        unite: '',
        icon: <Users />,
        couleur: 'orange',
        tendance: 'stable'
      },
      {
        titre: "Promoteurs accompagnés",
        valeur: nombrePromoteurs,
        unite: '',
        icon: <Briefcase />,
        couleur: 'purple',
        tendance: 'hausse'
      }
    ];
  }, [donnees]);

  // Grouper les indicateurs par catégorie
  const indicateursParCategorie = useMemo(() => {
    const categories = new Map();

    donnees.forEach(ind => {
      if (!categories.has(ind.categorie)) {
        categories.set(ind.categorie, []);
      }
      categories.get(ind.categorie).push(ind);
    });

    return Array.from(categories.entries()).map(([categorie, indicateurs]) => ({
      categorie,
      indicateurs
    }));
  }, [donnees]);

  // Filtrer les indicateurs par la recherche
  const indicateursFiltres = useMemo(() => {
    if (!recherche.trim()) return indicateursParCategorie;

    return indicateursParCategorie.map(groupe => ({
      categorie: groupe.categorie,
      indicateurs: groupe.indicateurs.filter((ind: Indicateur) =>
        ind.nom.toLowerCase().includes(recherche.toLowerCase()) ||
        ind.entreprise_nom.toLowerCase().includes(recherche.toLowerCase()) ||
        (ind.region && ind.region.toLowerCase().includes(recherche.toLowerCase()))
      )
    })).filter(groupe => groupe.indicateurs.length > 0);
  }, [indicateursParCategorie, recherche]);

  // Ouvrir le modal de détail d'un indicateur
  const ouvrirDetailIndicateur = (indicateur: Indicateur) => {
    setIndicateurSelectionne(indicateur);
    setModalOuvert(true);
  };

  // Reinitialiser les filtres
  const reinitialiserFiltres = () => {
    setFiltreExercice(exerciceActif?.id?.toString() || '');
    setFiltrePeriode('all');
    setFiltreRegion('all');
    setFiltreProvince('all');
    setFiltreCommune('all');
    setFiltreSecteur('all');
    setFiltreGenre('all');
    setFiltreCategorie('all');
    setRecherche('');
  };

  // Obtenir l'icône pour une catégorie
  const getIconeCategorie = (categorie: string) => {
    const categoriesIcones: Record<string, React.ReactNode> = {
      'Indicateurs commerciaux': <ShoppingBag />,
      'Indicateurs financiers': <DollarSign />,
      'Indicateurs RH': <Users />,
      'Indicateurs de performance': <TrendingUp />,
      'Indicateurs de production': <BarChart4 />,
      'Indicateurs de rentabilité': <PieChart />
    };

    // Recherche partielle pour les catégories qui contiennent les mots-clés
    for (const [key, icon] of Object.entries(categoriesIcones)) {
      if (categorie.toLowerCase().includes(key.toLowerCase())) {
        return icon;
      }
    }

    return <BarChart4 />; // Icône par défaut
  };

  // Obtenir la couleur pour une catégorie
  const getCouleurCategorie = (categorie: string): 'blue' | 'green' | 'red' | 'orange' | 'purple' | 'indigo' => {
    const categoriesCouleurs: Record<string, 'blue' | 'green' | 'red' | 'orange' | 'purple' | 'indigo'> = {
      'Indicateurs commerciaux': 'blue',
      'Indicateurs financiers': 'green',
      'Indicateurs RH': 'orange',
      'Indicateurs de performance': 'purple',
      'Indicateurs de production': 'indigo',
      'Indicateurs de rentabilité': 'red'
    };

    // Recherche partielle pour les catégories qui contiennent les mots-clés
    for (const [key, couleur] of Object.entries(categoriesCouleurs)) {
      if (categorie.toLowerCase().includes(key.toLowerCase())) {
        return couleur;
      }
    }

    return 'blue'; // Couleur par défaut
  };

  // Exporter toutes les données en CSV
  const exporterToutesLesDonnees = () => {
    // Préparer les en-têtes
    const headers = ['ID', 'Indicateur', 'Catégorie', 'Entreprise', 'Valeur', 'Tendance', 'Région', 'Province', 'Commune', 'Secteur'];

    // Préparer les données
    const data = donnees.map(ind => [
      ind.id,
      ind.nom,
      ind.categorie,
      ind.entreprise_nom,
      ind.valeur,
      ind.tendance || 'stable',
      ind.region || '',
      ind.province || '',
      ind.commune || '',
      ind.secteur_activite || ''
    ]);

    // Générer le CSV
    const csvContent =
      headers.join(',') + '\n' +
      data.map(row => row.join(',')).join('\n');

    // Télécharger
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `analyse_indicateurs_export.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Gestion du chargement
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Gestion des erreurs
  if (error && donnees.length === 0) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Filtres et recherche */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="w-full md:w-1/4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Exercice
            </label>
            <select
              value={filtreExercice}
              onChange={(e) => setFiltreExercice(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              {exercices.map((exercice) => (
                <option key={exercice.id} value={exercice.id}>
                  {exercice.annee} {exercice.actif ? '(Actif)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-1/4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Période
            </label>
            <select
              value={filtrePeriode}
              onChange={(e) => setFiltrePeriode(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Toutes les périodes</option>
              {periodes.map((periode) => (
                <option key={periode.id} value={periode.id}>
                  {periode.nom}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-1/4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie
            </label>
            <select
              value={filtreCategorie}
              onChange={(e) => setFiltreCategorie(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Toutes les catégories</option>
              {availableCategories[availablePeriodes[0]]?.map((categorie) => (
                <option key={categorie} value={categorie}>
                  {categorie}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-1/4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Région
            </label>
            <select
              value={filtreRegion}
              onChange={(e) => setFiltreRegion(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Toutes les régions</option>
              {filtres.regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="w-full md:w-1/4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Province
            </label>
            <select
              value={filtreProvince}
              onChange={(e) => setFiltreProvince(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              disabled={filtreRegion === 'all'}
            >
              <option value="all">Toutes les provinces</option>
              {filtres.provinces
                .filter(p => filtreRegion === 'all' || p.startsWith(filtreRegion))
                .map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
            </select>
          </div>

          <div className="w-full md:w-1/4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Commune
            </label>
            <select
              value={filtreCommune}
              onChange={(e) => setFiltreCommune(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              disabled={filtreProvince === 'all'}
            >
              <option value="all">Toutes les communes</option>
              {filtres.communes
                .filter(c => filtreProvince === 'all' || c.startsWith(filtreProvince))
                .map((commune) => (
                  <option key={commune} value={commune}>
                    {commune}
                  </option>
                ))}
            </select>
          </div>

          <div className="w-full md:w-1/4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Secteur d'activité
            </label>
            <select
              value={filtreSecteur}
              onChange={(e) => setFiltreSecteur(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tous les secteurs</option>
              {filtres.secteursActivite.map((secteur) => (
                <option key={secteur} value={secteur}>
                  {secteur}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-1/4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Genre
            </label>
            <select
              value={filtreGenre}
              onChange={(e) => setFiltreGenre(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tous les genres</option>
              {filtres.genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-2/3 relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recherche
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Rechercher un indicateur, une entreprise..."
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
              />
              {recherche && (
                <button
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setRecherche('')}
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </div>

          <div className="w-full md:w-1/3 flex justify-end gap-2">
            <button
              onClick={reinitialiserFiltres}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Réinitialiser
            </button>
            <button
              onClick={exporterToutesLesDonnees}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Exporter
            </button>
            <button
              onClick={() => setVueActuelle(vueActuelle === 'liste' ? 'cartes' : 'liste')}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              {vueActuelle === 'liste' ? (
                <>
                  <BarChart4 className="h-4 w-4" />
                  Vue Cartes
                </>
              ) : (
                <>
                  <Filter className="h-4 w-4" />
                  Vue Liste
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Message d'erreur éventuel */}
      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Attention: {error} Certaines fonctionnalités peuvent être limitées.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Indicateurs clés */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {metriques.map((metrique, index) => (
          <CardMetrique
            key={index}
            titre={metrique.titre}
            valeur={metrique.valeur}
            unite={metrique.unite}
            icon={metrique.icon}
            couleur={metrique.couleur as 'blue' | 'green' | 'red' | 'orange' | 'purple' | 'indigo'}
            tendance={metrique.tendance as 'hausse' | 'baisse' | 'stable'}
          />
        ))}
      </div>

      {/* Vue principale */}
      {vueActuelle === 'liste' ? (
        // Vue liste par catégories
        <div className="space-y-6">
          {indicateursFiltres.length > 0 ? (
            indicateursFiltres.map((groupe) => (
              <IndicateursList
                key={groupe.categorie}
                titre={groupe.categorie}
                icone={getIconeCategorie(groupe.categorie)}
                couleur={getCouleurCategorie(groupe.categorie)}
                indicateurs={groupe.indicateurs as Indicateur[]}
                onIndicateurClick={ouvrirDetailIndicateur}
                filtrerParTendance={true}
              />
            ))
          ) : (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <p className="text-gray-500">
                {recherche ? 'Aucun résultat pour cette recherche.' : 'Aucun indicateur disponible.'}
              </p>
              {recherche && (
                <button
                  onClick={() => setRecherche('')}
                  className="mt-3 px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                >
                  Effacer la recherche
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        // Vue cartes
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {donnees.filter(ind => !recherche ||
            ind.nom.toLowerCase().includes(recherche.toLowerCase()) ||
            ind.entreprise_nom.toLowerCase().includes(recherche.toLowerCase())
          ).map(indicateur => (
            <div
              key={indicateur.id}
              className="bg-white p-5 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => ouvrirDetailIndicateur(indicateur)}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-medium text-lg text-gray-800">{indicateur.nom}</h3>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  indicateur.tendance === 'hausse' ? 'bg-green-100 text-green-800' :
                  indicateur.tendance === 'baisse' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {indicateur.tendance === 'hausse' ? (
                    <>
                      <TrendingUp className="h-3 w-3 inline mr-1" />
                      Hausse
                    </>
                  ) : indicateur.tendance === 'baisse' ? (
                    <>
                      <TrendingUp className="h-3 w-3 inline mr-1 transform rotate-180" />
                      Baisse
                    </>
                  ) : (
                    <>
                      <span className="h-3 w-3 inline-block border-t-2 border-gray-500 mr-1"></span>
                      Stable
                    </>
                  )}
                </div>
              </div>

              <div className="text-2xl font-bold mb-3">
                {new Intl.NumberFormat('fr-FR').format(indicateur.valeur)}
              </div>

              <div className="text-sm text-gray-500 mb-2">
                {indicateur.entreprise_nom}
              </div>

              <div className="flex flex-wrap gap-2">
                {indicateur.categorie && (
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                    {indicateur.categorie}
                  </span>
                )}
                {indicateur.region && (
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                    {indicateur.region}
                  </span>
                )}
                {indicateur.secteur_activite && (
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                    {indicateur.secteur_activite}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de détail d'indicateur */}
      {indicateurSelectionne && (
        <IndicateurDetailModal
          isOpen={modalOuvert}
          onClose={() => setModalOuvert(false)}
          indicateur={indicateurSelectionne}
        />
      )}
    </div>
  );
};

export default AnalyseIndicateurs;
