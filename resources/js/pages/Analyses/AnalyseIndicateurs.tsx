// // resources/js/Components/Analyse/AnalyseIndicateurs.tsx
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//   Activity, TrendingUp, ShoppingBag, Users, LineChart,
//   MapPin, Building2, ChevronDown, Filter, Download, Book, Briefcase, UserCheck
// } from 'lucide-react';
// import IndicateurDetailModal from './IndicateurDetailModal';

// // Types et interfaces
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

// interface Indicateur {
//   id: number;
//   nom: string;
//   categorie: string;
//   description: string;
// }

// interface IndicateurDonnee {
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
//   indicateurs: Indicateur[];
//   filtres: Filtres;
// }

// // Catégories d'indicateurs
// const categories = [
//   {
//     id: 'commercial',
//     nom: 'Indicateurs commerciaux',
//     icone: ShoppingBag,
//     couleur: 'text-purple-600'
//   },
//   {
//     id: 'tresorerie',
//     nom: 'Indicateurs financiers',
//     icone: TrendingUp,
//     couleur: 'text-green-600'
//   },
//   {
//     id: 'production',
//     nom: 'Indicateurs de production',
//     icone: Activity,
//     couleur: 'text-blue-600'
//   },
//   {
//     id: 'rh',
//     nom: 'Indicateurs RH',
//     icone: Users,
//     couleur: 'text-orange-600'
//   }
// ];

// // Composant Dropdown
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
//   icone?: React.ElementType;
// }) {
//   const [estOuvert, setEstOuvert] = useState(false);

//   return (
//     <div className="relative">
//       <label className="block text-sm font-medium text-gray-700 mb-1">
//         {Icone && <Icone className="w-4 h-4 inline mr-1" />}
//         {label}
//       </label>
//       <button
//         type="button"
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
//               type="button"
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
//                 type="button"
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

// // Composant principal
// export default function AnalyseIndicateurs({
//   exerciceActif,
//   exercices,
//   periodes,
//   indicateurs,
//   filtres
// }: AnalyseProps) {
//   // États pour les données
//   const [donnees, setDonnees] = useState<IndicateurDonnee[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
//   const [selectedIndicateur, setSelectedIndicateur] = useState<IndicateurDonnee | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // États pour les filtres
//   const [filtreCategorie, setFiltreCategorie] = useState('all');
//   const [filtreExercice, setFiltreExercice] = useState(exerciceActif.id.toString());
//   const [filtrePeriode, setFiltrePeriode] = useState('all');
//   const [filtreRegion, setFiltreRegion] = useState('all');
//   const [filtreProvince, setFiltreProvince] = useState('all');
//   const [filtreCommune, setFiltreCommune] = useState('all');
//   const [filtreSecteur, setFiltreSecteur] = useState('all');
//   const [filtreTypeBeneficiaire, setFiltreTypeBeneficiaire] = useState('all');
//   const [filtreGenre, setFiltreGenre] = useState('all');
//   const [filtreHandicap, setFiltreHandicap] = useState('all');
//   const [filtreNiveauInstruction, setFiltreNiveauInstruction] = useState('all');
//   const [filtreDescriptionActivite, setFiltreDescriptionActivite] = useState('all');
//   const [filtreNiveauDeveloppement, setFiltreNiveauDeveloppement] = useState('all');

//   // Charger les données au chargement et quand les filtres changent
//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true);

//       try {
//         const response = await axios.post(route('analyse.donnees'), {
//           exercice_id: filtreExercice !== 'all' ? filtreExercice : null,
//           periode_id: filtrePeriode !== 'all' ? filtrePeriode : null,
//           categorie: filtreCategorie !== 'all' ? filtreCategorie : null,
//           region: filtreRegion !== 'all' ? filtreRegion : null,
//           province: filtreProvince !== 'all' ? filtreProvince : null,
//           commune: filtreCommune !== 'all' ? filtreCommune : null,
//           secteur_activite: filtreSecteur !== 'all' ? filtreSecteur : null,
//           type_beneficiaire: filtreTypeBeneficiaire !== 'all' ? filtreTypeBeneficiaire : null,
//           genre: filtreGenre !== 'all' ? filtreGenre : null,
//           handicap: filtreHandicap !== 'all' ? filtreHandicap : null,
//           niveau_instruction: filtreNiveauInstruction !== 'all' ? filtreNiveauInstruction : null,
//           description_activite: filtreDescriptionActivite !== 'all' ? filtreDescriptionActivite : null,
//           niveau_developpement: filtreNiveauDeveloppement !== 'all' ? filtreNiveauDeveloppement : null
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
//     filtreGenre,
//     filtreHandicap,
//     filtreNiveauInstruction,
//     filtreDescriptionActivite,
//     filtreNiveauDeveloppement
//   ]);

//   // Filtrage des données (déjà filtré côté serveur)
//   const donneesFiltrees = donnees;

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

//   // Ouvrir le modal de détails
//   const openIndicateurDetails = (indicateur: IndicateurDonnee) => {
//     setSelectedIndicateur(indicateur);
//     setIsModalOpen(true);
//   };

//   // Fermer le modal
//   const closeModal = () => {
//     setIsModalOpen(false);
//   };

//   // Générer un rapport
//   const genererRapport = () => {
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

//     // Nouveaux filtres
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

//     if (filtreDescriptionActivite !== 'all') {
//       const descriptionActiviteInput = document.createElement('input');
//       descriptionActiviteInput.type = 'hidden';
//       descriptionActiviteInput.name = 'description_activite';
//       descriptionActiviteInput.value = filtreDescriptionActivite;
//       form.appendChild(descriptionActiviteInput);
//     }

//     if (filtreNiveauDeveloppement !== 'all') {
//       const niveauDeveloppementInput = document.createElement('input');
//       niveauDeveloppementInput.type = 'hidden';
//       niveauDeveloppementInput.name = 'niveau_developpement';
//       niveauDeveloppementInput.value = filtreNiveauDeveloppement;
//       form.appendChild(niveauDeveloppementInput);
//     }

//     // Soumettre le formulaire
//     document.body.appendChild(form);
//     form.submit();
//     document.body.removeChild(form);
//   };

//   return (
//     <div className="py-12">
//       <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
//         <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
//           {/* Filtres principaux */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//             <Dropdown
//               label="Catégorie"
//               options={categories.map(c => c.nom)}
//               value={filtreCategorie === 'all' ? 'all' : categories.find(c => c.id === filtreCategorie)?.nom || ''}
//               onChange={(value) => {
//                 const categorie = categories.find(c => c.nom === value);
//                 setFiltreCategorie(categorie ? categorie.id : 'all');
//               }}
//               icone={Filter}
//             />

//             <Dropdown
//               label="Exercice"
//               options={exercices.map(e => e.annee.toString())}
//               value={filtreExercice === 'all' ? 'all' : exercices.find(e => e.id.toString() === filtreExercice)?.annee.toString() || ''}
//               onChange={(value) => {
//                 const exercice = exercices.find(e => e.annee.toString() === value);
//                 setFiltreExercice(exercice ? exercice.id.toString() : 'all');
//               }}
//               icone={Activity}
//             />

//             <Dropdown
//               label="Période"
//               options={periodes.filter(p => filtreExercice === 'all' || p.exercice_id.toString() === filtreExercice).map(p => p.nom)}
//               value={filtrePeriode === 'all' ? 'all' : periodes.find(p => p.id.toString() === filtrePeriode)?.nom || ''}
//               onChange={(value) => {
//                 const periode = periodes.find(p => p.nom === value);
//                 setFiltrePeriode(periode ? periode.id.toString() : 'all');
//               }}
//               icone={Activity}
//             />

//             <div className="flex items-end">
//               <button
//                 type="button"
//                 className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//                 onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
//               >
//                 {showAdvancedFilters ? 'Masquer les filtres avancés' : 'Afficher les filtres avancés'}
//               </button>
//             </div>
//           </div>

//           {/* Filtres avancés */}
//           {showAdvancedFilters && (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
//               <Dropdown
//                 label="Région"
//                 options={filtres.regions}
//                 value={filtreRegion}
//                 onChange={setFiltreRegion}
//                 icone={MapPin}
//               />

//               <Dropdown
//                 label="Province"
//                 options={filtres.provinces}
//                 value={filtreProvince}
//                 onChange={setFiltreProvince}
//                 icone={MapPin}
//               />

//               <Dropdown
//                 label="Commune"
//                 options={filtres.communes}
//                 value={filtreCommune}
//                 onChange={setFiltreCommune}
//                 icone={MapPin}
//               />

//               <Dropdown
//                 label="Secteur d'activité"
//                 options={filtres.secteursActivite}
//                 value={filtreSecteur}
//                 onChange={setFiltreSecteur}
//                 icone={Building2}
//               />

//               <Dropdown
//                 label="Type de bénéficiaire"
//                 options={filtres.typesBeneficiaires}
//                 value={filtreTypeBeneficiaire}
//                 onChange={setFiltreTypeBeneficiaire}
//                 icone={Users}
//               />

//               <Dropdown
//                 label="Genre"
//                 options={filtres.genres}
//                 value={filtreGenre}
//                 onChange={setFiltreGenre}
//                 icone={Users}
//               />

//               {/* Nouveaux filtres */}
//               <Dropdown
//                 label="Situation de Handicap"
//                 options={filtres.handicaps}
//                 value={filtreHandicap}
//                 onChange={setFiltreHandicap}
//                 icone={UserCheck}
//               />

//               <Dropdown
//                 label="Niveau d'instruction"
//                 options={filtres.niveauxInstruction}
//                 value={filtreNiveauInstruction}
//                 onChange={setFiltreNiveauInstruction}
//                 icone={Book}
//               />

//               <Dropdown
//                 label="Description de l'activité"
//                 options={filtres.descriptionsActivite}
//                 value={filtreDescriptionActivite}
//                 onChange={setFiltreDescriptionActivite}
//                 icone={Briefcase}
//               />

//               <Dropdown
//                 label="Niveau de développement"
//                 options={filtres.niveauxDeveloppement}
//                 value={filtreNiveauDeveloppement}
//                 onChange={setFiltreNiveauDeveloppement}
//                 icone={Activity}
//               />
//             </div>
//           )}

//           {/* Boutons d'action */}
//           <div className="flex justify-end mb-6">
//             <button
//               type="button"
//               onClick={genererRapport}
//               className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 ml-2"
//             >
//               <LineChart className="w-4 h-4 mr-2" />
//               Générer un rapport
//             </button>

//             <button
//               type="button"
//               onClick={() => {
//                 const form = document.createElement('form');
//                 form.method = 'POST';
//                 form.action = route('analyse.export');

//                 // Ajouter le token CSRF
//                 const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
//                 const csrfInput = document.createElement('input');
//                 csrfInput.type = 'hidden';
//                 csrfInput.name = '_token';
//                 csrfInput.value = csrfToken || '';
//                 form.appendChild(csrfInput);

//                 // Ajouter les mêmes filtres que pour le rapport
//                 const exerciceInput = document.createElement('input');
//                 exerciceInput.type = 'hidden';
//                 exerciceInput.name = 'exercice_id';
//                 exerciceInput.value = filtreExercice;
//                 form.appendChild(exerciceInput);

//                 // Ajouter le format d'export
//                 const formatInput = document.createElement('input');
//                 formatInput.type = 'hidden';
//                 formatInput.name = 'format';
//                 formatInput.value = 'excel';
//                 form.appendChild(formatInput);

//                 // Ajouter les catégories sélectionnées
//                 const categoriesInput = document.createElement('input');
//                 categoriesInput.type = 'hidden';
//                 categoriesInput.name = 'categories';
//                 categoriesInput.value = JSON.stringify(filtreCategorie === 'all'
//                     ? categories.map(c => c.id)
//                     : [filtreCategorie]);
//                   form.appendChild(categoriesInput);

//                   // Soumettre le formulaire
//                   document.body.appendChild(form);
//                   form.submit();
//                   document.body.removeChild(form);
//                 }}
//                 className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 ml-2"
//               >
//                 <Download className="w-4 h-4 mr-2" />
//                 Exporter (Excel)
//               </button>
//             </div>

//             {/* Contenu principal - Tableau de bord des indicateurs */}
//             {isLoading ? (
//               <div className="flex justify-center items-center h-64">
//                 <div className="text-center">
//                   <p className="text-lg text-gray-600">Chargement des données...</p>
//                 </div>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {categories.map(categorie => {
//                   const donneesCategorie = donneesFiltrees.filter(indicateur =>
//                     indicateur.categorie === categorie.id
//                   );

//                   // Si un filtre de catégorie est actif et ne correspond pas, ne pas afficher
//                   if (filtreCategorie !== 'all' && filtreCategorie !== categorie.id) return null;

//                   const Icone = categorie.icone;

//                   return (
//                     <div
//                       key={categorie.id}
//                       className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
//                     >
//                       <div className="flex items-center justify-between mb-4">
//                         <h3 className="text-lg font-medium text-gray-900">
//                           {categorie.nom}
//                         </h3>
//                         <Icone className={`h-5 w-5 ${categorie.couleur}`} />
//                       </div>

//                       <div className="space-y-4">
//                         {donneesCategorie.length > 0 ? (
//                           donneesCategorie.map(indicateur => (
//                             <div
//                               key={indicateur.id}
//                               className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
//                               onClick={() => openIndicateurDetails(indicateur)}
//                             >
//                               <div className="flex flex-col">
//                                 <span className="text-gray-600 text-sm">
//                                   {indicateur.nom}
//                                 </span>
//                                 <span className="text-xs text-gray-500">
//                                   {indicateur.entreprise_nom} - {indicateur.region}
//                                 </span>
//                               </div>
//                               <div className="flex items-center gap-2">
//                                 <span
//                                   className={`font-medium ${obtenirCouleurTendance(indicateur.tendance)}`}
//                                 >
//                                   {indicateur.valeur} {obtenirIconeTendance(indicateur.tendance)}
//                                 </span>
//                               </div>
//                             </div>
//                           ))
//                         ) : (
//                           <p className="text-gray-500 text-sm italic text-center">
//                             Aucun indicateur disponible
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}

//             {/* Importer le modal depuis un composant séparé */}
//             {selectedIndicateur && (
//               <IndicateurDetailModal
//                 isOpen={isModalOpen}
//                 onClose={closeModal}
//                 indicateur={selectedIndicateur}
//               />
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   }
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  ShoppingBag,
  TrendingUp,
  Users,
  BarChart,
  Sliders,
  Download,
  FileText,
  AlertCircle,
  ChevronDown,
  Search,
  X
} from 'lucide-react';
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

interface IndicateurDB {
  id: number;
  nom: string;
  categorie: string;
  description: string;
}

interface Filtres {
  regions: string[];
  provinces: string[];
  communes: string[];
  typesBeneficiaires: string[];
  genres: string[];
  secteursActivite: string[];
}

interface AnalyseProps {
  exerciceActif: Exercice;
  exercices: Exercice[];
  periodes: Periode[];
  indicateurs: IndicateurDB[];
  filtres: Filtres;
}

// Définition des catégories d'indicateurs
const categories = [
  {
    id: 'commercial',
    nom: "Indicateurs commerciaux",
    icone: <ShoppingBag className="h-5 w-5" />,
    couleur: 'blue'
  },
  {
    id: 'tresorerie',
    nom: 'Indicateurs financiers',
    icone: <TrendingUp className="h-5 w-5" />,
    couleur: 'green'
  },
  {
    id: 'production',
    nom: 'Indicateurs de production',
    icone: <BarChart className="h-5 w-5" />,
    couleur: 'purple'
  },
  {
    id: 'rh',
    nom: 'Indicateurs RH',
    icone: <Users className="h-5 w-5" />,
    couleur: 'orange'
  }
];

// Composant principal pour l'analyse des indicateurs
export default function AnalyseIndicateurs({
  exerciceActif,
  exercices,
  periodes,
  indicateurs,
  filtres
}: AnalyseProps) {
  // États
  const [donnees, setDonnees] = useState<Indicateur[]>([]);
  const [filtreCategorie, setFiltreCategorie] = useState<string>('all');
  const [filtreExercice, setFiltreExercice] = useState<string>(exerciceActif.id.toString());
  const [filtrePeriode, setFiltrePeriode] = useState<string>('all');
  const [recherche, setRecherche] = useState<string>('');
  const [filtresAvances, setFiltresAvances] = useState<boolean>(false);
  const [filtreRegion, setFiltreRegion] = useState<string>('all');
  const [filtreProvince, setFiltreProvince] = useState<string>('all');
  const [filtreCommune, setFiltreCommune] = useState<string>('all');
  const [filtreSecteur, setFiltreSecteur] = useState<string>('all');
  const [filtreTypeBeneficiaire, setFiltreTypeBeneficiaire] = useState<string>('all');
  const [filtreGenre, setFiltreGenre] = useState<string>('all');

  const [indicateurSelectionne, setIndicateurSelectionne] = useState<Indicateur | null>(null);
  const [modal, setModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Chargement des données au démarrage et lorsque les filtres changent
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.post(route('analyse.donnees'), {
          exercice_id: filtreExercice !== 'all' ? filtreExercice : null,
          periode_id: filtrePeriode !== 'all' ? filtrePeriode : null,
          categorie: filtreCategorie !== 'all' ? filtreCategorie : null,
          region: filtreRegion !== 'all' ? filtreRegion : null,
          province: filtreProvince !== 'all' ? filtreProvince : null,
          commune: filtreCommune !== 'all' ? filtreCommune : null,
          secteur_activite: filtreSecteur !== 'all' ? filtreSecteur : null,
          type_beneficiaire: filtreTypeBeneficiaire !== 'all' ? filtreTypeBeneficiaire : null,
          genre: filtreGenre !== 'all' ? filtreGenre : null
        });
        setDonnees(response.data.donneesIndicateurs);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [
    filtreExercice,
    filtrePeriode,
    filtreCategorie,
    filtreRegion,
    filtreProvince,
    filtreCommune,
    filtreSecteur,
    filtreTypeBeneficiaire,
    filtreGenre
  ]);

  // Sauvegarder les filtres dans le localStorage
  useEffect(() => {
    localStorage.setItem('analyse-filtres', JSON.stringify({
      categorie: filtreCategorie,
      exercice: filtreExercice,
      periode: filtrePeriode,
      region: filtreRegion,
      province: filtreProvince,
      commune: filtreCommune,
      secteur: filtreSecteur,
      typeBeneficiaire: filtreTypeBeneficiaire,
      genre: filtreGenre,
      recherche: recherche
    }));
  }, [
    filtreCategorie,
    filtreExercice,
    filtrePeriode,
    filtreRegion,
    filtreProvince,
    filtreCommune,
    filtreSecteur,
    filtreTypeBeneficiaire,
    filtreGenre,
    recherche
  ]);

  // Récupérer les filtres du localStorage au chargement
  useEffect(() => {
    try {
      const savedFilters = localStorage.getItem('analyse-filtres');
      if (savedFilters) {
        const parsedFilters = JSON.parse(savedFilters);
        // Appliquer les filtres sauvegardés
        if (parsedFilters.categorie) setFiltreCategorie(parsedFilters.categorie);
        if (parsedFilters.exercice) setFiltreExercice(parsedFilters.exercice);
        if (parsedFilters.periode) setFiltrePeriode(parsedFilters.periode);
        if (parsedFilters.region) setFiltreRegion(parsedFilters.region);
        if (parsedFilters.province) setFiltreProvince(parsedFilters.province);
        if (parsedFilters.commune) setFiltreCommune(parsedFilters.commune);
        if (parsedFilters.secteur) setFiltreSecteur(parsedFilters.secteur);
        if (parsedFilters.typeBeneficiaire) setFiltreTypeBeneficiaire(parsedFilters.typeBeneficiaire);
        if (parsedFilters.genre) setFiltreGenre(parsedFilters.genre);
        if (parsedFilters.recherche) setRecherche(parsedFilters.recherche);
      }
    } catch (e) {
      console.error('Erreur lors de la récupération des filtres sauvegardés:', e);
    }
  }, []);

  // Logique de filtrage global
  const indicateursFiltres = donnees.filter(indicateur => {
    // Filtre par recherche globale
    const matchRecherche = recherche === '' ||
      indicateur.nom.toLowerCase().includes(recherche.toLowerCase()) ||
      indicateur.entreprise_nom.toLowerCase().includes(recherche.toLowerCase()) ||
      (indicateur.region && indicateur.region.toLowerCase().includes(recherche.toLowerCase()));

    // Combiner tous les filtres
    return matchRecherche;
  });

  // Grouper par catégorie
  const indicateursParCategorie = categories.map(categorie => {
    return {
      ...categorie,
      indicateurs: indicateursFiltres.filter(ind => ind.categorie === categorie.id)
    };
  });

  // Gestion des événements
  const handleIndicateurClick = useCallback((indicateur: Indicateur) => {
    setIndicateurSelectionne(indicateur);
    setModal(true);
  }, []);

  const handleExporterExcel = useCallback(() => {
    // Créer un formulaire pour soumettre les paramètres d'export
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = route('analyse.export');

    // Ajouter le token CSRF
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    const csrfInput = document.createElement('input');
    csrfInput.type = 'hidden';
    csrfInput.name = '_token';
    csrfInput.value = csrfToken || '';
    form.appendChild(csrfInput);

    // Ajouter les filtres
    const exerciceInput = document.createElement('input');
    exerciceInput.type = 'hidden';
    exerciceInput.name = 'exercice_id';
    exerciceInput.value = filtreExercice;
    form.appendChild(exerciceInput);

    if (filtrePeriode !== 'all') {
      const periodeInput = document.createElement('input');
      periodeInput.type = 'hidden';
      periodeInput.name = 'periode_id';
      periodeInput.value = filtrePeriode;
      form.appendChild(periodeInput);
    }

    // Ajouter les catégories sélectionnées
    const categoriesInput = document.createElement('input');
    categoriesInput.type = 'hidden';
    categoriesInput.name = 'categories';
    categoriesInput.value = JSON.stringify(filtreCategorie === 'all'
      ? categories.map(c => c.id)
      : [filtreCategorie]);
    form.appendChild(categoriesInput);

    // Ajouter le format d'export
    const formatInput = document.createElement('input');
    formatInput.type = 'hidden';
    formatInput.name = 'format';
    formatInput.value = 'excel';
    form.appendChild(formatInput);

    // Soumettre le formulaire
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  }, [filtreCategorie, filtreExercice, filtrePeriode]);

  const handleGenererRapport = useCallback(() => {
    // Créer un formulaire pour soumettre les paramètres du rapport
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = route('analyse.rapport');

    // Ajouter le token CSRF
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    const csrfInput = document.createElement('input');
    csrfInput.type = 'hidden';
    csrfInput.name = '_token';
    csrfInput.value = csrfToken || '';
    form.appendChild(csrfInput);

    // Ajouter les filtres
    const exerciceInput = document.createElement('input');
    exerciceInput.type = 'hidden';
    exerciceInput.name = 'exercice_id';
    exerciceInput.value = filtreExercice;
    form.appendChild(exerciceInput);

    if (filtrePeriode !== 'all') {
      const periodeInput = document.createElement('input');
      periodeInput.type = 'hidden';
      periodeInput.name = 'periode_id';
      periodeInput.value = filtrePeriode;
      form.appendChild(periodeInput);
    }

    // Ajouter les catégories sélectionnées
    const categoriesInput = document.createElement('input');
    categoriesInput.type = 'hidden';
    categoriesInput.name = 'categories';
    categoriesInput.value = JSON.stringify(filtreCategorie === 'all'
      ? categories.map(c => c.id)
      : [filtreCategorie]);
    form.appendChild(categoriesInput);

    // Ajouter les filtres géographiques et démographiques
    if (filtreRegion !== 'all') {
      const regionInput = document.createElement('input');
      regionInput.type = 'hidden';
      regionInput.name = 'region';
      regionInput.value = filtreRegion;
      form.appendChild(regionInput);
    }

    if (filtreProvince !== 'all') {
      const provinceInput = document.createElement('input');
      provinceInput.type = 'hidden';
      provinceInput.name = 'province';
      provinceInput.value = filtreProvince;
      form.appendChild(provinceInput);
    }

    if (filtreCommune !== 'all') {
      const communeInput = document.createElement('input');
      communeInput.type = 'hidden';
      communeInput.name = 'commune';
      communeInput.value = filtreCommune;
      form.appendChild(communeInput);
    }

    if (filtreSecteur !== 'all') {
      const secteurInput = document.createElement('input');
      secteurInput.type = 'hidden';
      secteurInput.name = 'secteur_activite';
      secteurInput.value = filtreSecteur;
      form.appendChild(secteurInput);
    }

    if (filtreTypeBeneficiaire !== 'all') {
      const typeBeneficiaireInput = document.createElement('input');
      typeBeneficiaireInput.type = 'hidden';
      typeBeneficiaireInput.name = 'type_beneficiaire';
      typeBeneficiaireInput.value = filtreTypeBeneficiaire;
      form.appendChild(typeBeneficiaireInput);
    }

    if (filtreGenre !== 'all') {
      const genreInput = document.createElement('input');
      genreInput.type = 'hidden';
      genreInput.name = 'genre';
      genreInput.value = filtreGenre;
      form.appendChild(genreInput);
    }

    // Soumettre le formulaire
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  }, [filtreCategorie, filtreExercice, filtrePeriode, filtreRegion, filtreProvince, filtreCommune, filtreSecteur, filtreTypeBeneficiaire, filtreGenre]);

  const reinitialiserFiltres = useCallback(() => {
    setFiltreCategorie('all');
    setFiltreExercice(exerciceActif.id.toString());
    setFiltrePeriode('all');
    setRecherche('');
    setFiltreRegion('all');
    setFiltreProvince('all');
    setFiltreCommune('all');
    setFiltreSecteur('all');
    setFiltreTypeBeneficiaire('all');
    setFiltreGenre('all');
    setFiltresAvances(false);
  }, [exerciceActif]);

  // Composant pour les filtres avancés
  const FiltresAvances = () => (
    <div
      className={`transition-all duration-300 overflow-hidden ${
        filtresAvances ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}
    >
      {filtresAvances && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Filtre par région */}
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-700 mb-1">Région</label>
            <select
              value={filtreRegion}
              onChange={(e) => setFiltreRegion(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">Toutes les régions</option>
              {filtres.regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>

          {/* Filtre par province */}
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
            <select
              value={filtreProvince}
              onChange={(e) => setFiltreProvince(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">Toutes les provinces</option>
              {filtres.provinces.map(province => (
                <option key={province} value={province}>{province}</option>
              ))}
            </select>
          </div>

          {/* Filtre par commune */}
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-700 mb-1">Commune</label>
            <select
              value={filtreCommune}
              onChange={(e) => setFiltreCommune(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">Toutes les communes</option>
              {filtres.communes.map(commune => (
                <option key={commune} value={commune}>{commune}</option>
              ))}
            </select>
          </div>

          {/* Filtre par secteur d'activité */}
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-700 mb-1">Secteur d'activité</label>
            <select
              value={filtreSecteur}
              onChange={(e) => setFiltreSecteur(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">Tous les secteurs</option>
              {filtres.secteursActivite.map(secteur => (
                <option key={secteur} value={secteur}>{secteur}</option>
              ))}
            </select>
          </div>

          {/* Filtre par type de bénéficiaire */}
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-700 mb-1">Type de bénéficiaire</label>
            <select
              value={filtreTypeBeneficiaire}
              onChange={(e) => setFiltreTypeBeneficiaire(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">Tous les types</option>
              {filtres.typesBeneficiaires.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Filtre par genre */}
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
            <select
              value={filtreGenre}
              onChange={(e) => setFiltreGenre(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">Tous les genres</option>
              {filtres.genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>

          {/* Bouton de réinitialisation */}
          <div className="flex items-end">
            <button
              onClick={reinitialiserFiltres}
              className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md text-sm"
            >
              Réinitialiser les filtres
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Barre de recherche globale */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-end">
            <div className="w-full md:flex-grow">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Recherche globale..."
                  value={recherche}
                  onChange={(e) => setRecherche(e.target.value)}
                  className="pl-10 pr-10 py-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 block w-full rounded-md"
                />
                {recherche && (
                  <button
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setRecherche('')}
                  >
                    <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* Filtre par catégorie */}
              <div>
                <select
                  value={filtreCategorie}
                  onChange={(e) => setFiltreCategorie(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
                >
                  <option value="all">Toutes les catégories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.nom}</option>
                  ))}
                </select>
              </div>

              {/* Filtre par exercice */}
              <div>
                <select
                  value={filtreExercice}
                  onChange={(e) => setFiltreExercice(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
                >
                  {exercices.map((ex) => (
                    <option key={ex.id} value={ex.id.toString()}>{ex.annee}</option>
                  ))}
                </select>
              </div>

              {/* Filtre par période */}
              <div>
                <select
                  value={filtrePeriode}
                  onChange={(e) => setFiltrePeriode(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
                >
                  <option value="all">Toutes les périodes</option>
                  {periodes
                    .filter(p => filtreExercice === 'all' || p.exercice_id.toString() === filtreExercice)
                    .map((p) => (
                      <option key={p.id} value={p.id.toString()}>{p.nom}</option>
                    ))
                  }
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={() => setFiltresAvances(!filtresAvances)}
              className="bg-blue-50 text-blue-500 border border-blue-200 hover:bg-blue-100 transition-colors px-4 py-2 rounded-md text-sm flex items-center gap-2"
            >
              <Sliders className="h-4 w-4" />
              <span>
                {filtresAvances ? 'Masquer les filtres avancés' : 'Afficher les filtres avancés'}
              </span>
              <ChevronDown className={`h-4 w-4 transition-transform ${filtresAvances ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Filtres avancés (conditionnels) */}
          <FiltresAvances />
        </div>

        {/* Barre d'actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 text-sm text-gray-700">
            <span className="font-medium mr-1">{indicateursFiltres.length}</span>
            indicateurs trouvés {recherche && <span>pour "<span className="italic">{recherche}</span>"</span>}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleGenererRapport}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2 transition-colors"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Générer un rapport</span>
              <span className="inline sm:hidden">Rapport</span>
            </button>

            <button
              onClick={handleExporterExcel}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Exporter (Excel)</span>
              <span className="inline sm:hidden">Exporter</span>
            </button>
          </div>
        </div>

        {/* État de chargement */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Message d'alerte si aucun indicateur */}
            {indicateursFiltres.length === 0 && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Aucun indicateur ne correspond à vos critères de recherche.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Grille d'indicateurs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {indicateursParCategorie.map(categorie => (
                <IndicateursList
                  key={categorie.id}
                  titre={categorie.nom}
                  icone={categorie.icone}
                  couleur={categorie.couleur}
                  indicateurs={categorie.indicateurs}
                  onIndicateurClick={handleIndicateurClick}
                  filtrerParTendance={true}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal de détail d'indicateur */}
      {indicateurSelectionne && (
        <IndicateurDetailModal
          isOpen={modal}
          onClose={() => setModal(false)}
          indicateur={indicateurSelectionne}
        />
      )}
    </div>
  );
}
