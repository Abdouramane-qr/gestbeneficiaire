

// // export default IndicateursList;
// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import {
//   ChevronDown,
//   Search,
//   ArrowUpRight,
//   ArrowRight,
//   Download,
//   FileText,
//   X
// } from 'lucide-react';
// import { Tooltip } from '@/components/ui/tooltip';

// // Type pour les indicateurs - compatible avec celui d'AnalyseIndicateurs
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

// interface IndicateursListProps {
//   titre: string;
//   icone: React.ReactNode;
//   couleur: string;
//   indicateurs: Indicateur[];
//   onIndicateurClick?: (indicateur: Indicateur) => void;
//   filtrerParTendance?: boolean;
// }

// const IndicateursList: React.FC<IndicateursListProps> = ({
//   titre,
//   icone,
//   couleur,
//   indicateurs,
//   onIndicateurClick,
//   filtrerParTendance = false
// }) => {
//   // État local
//   const [estOuvert, setEstOuvert] = useState(() => {
//     // Récupérer l'état sauvegardé si disponible
//     const saved = localStorage.getItem(`categorie-${titre}-ouvert`);
//     return saved ? saved === 'true' : true;
//   });
//   const [recherche, setRecherche] = useState('');
//   const [page, setPage] = useState(1);
//   const [tendanceFiltre, setTendanceFiltre] = useState<'toutes' | 'hausse' | 'baisse' | 'stable'>('toutes');
//   const [itemsParPage, setItemsParPage] = useState(5);
//   const [isHovering, setIsHovering] = useState<string | null>(null);

//   // Sauvegarder l'état ouvert/fermé
//   const toggleOuvert = useCallback(() => {
//     const nouvelEtat = !estOuvert;
//     setEstOuvert(nouvelEtat);
//     localStorage.setItem(`categorie-${titre}-ouvert`, String(nouvelEtat));
//   }, [estOuvert, titre]);

//   // Filtrer les indicateurs en fonction de la recherche et de la tendance
//   const indicateursFiltres = useMemo(() => {
//     return indicateurs.filter(ind => {
//       const matchRecherche =
//         ind.nom.toLowerCase().includes(recherche.toLowerCase()) ||
//         ind.entite.toLowerCase().includes(recherche.toLowerCase());

//       const matchTendance =
//         tendanceFiltre === 'toutes' ||
//         ind.tendance === tendanceFiltre;

//       return matchRecherche && matchTendance;
//     });
//   }, [indicateurs, recherche, tendanceFiltre]);

//   // Calculer les pages
//   const totalPages = Math.ceil(indicateursFiltres.length / itemsParPage);
//   const indicateursAffiches = useMemo(() => {
//     return indicateursFiltres.slice(
//       (page - 1) * itemsParPage,
//       page * itemsParPage
//     );
//   }, [indicateursFiltres, page, itemsParPage]);

//   // Reset la page quand la recherche ou le filtre tendance change
//   useEffect(() => {
//     setPage(1);
//   }, [recherche, tendanceFiltre]);

//   // Obtenir la couleur de tendance
//   const obtenirCouleurTendance = (tendance?: 'hausse' | 'baisse' | 'stable') => {
//     switch (tendance) {
//       case 'hausse': return 'text-green-500';
//       case 'baisse': return 'text-red-500';
//       default: return 'text-gray-500';
//     }
//   };

//   // Obtenir l'icône de tendance
//   const obtenirIconeTendance = (tendance?: 'hausse' | 'baisse' | 'stable') => {
//     switch (tendance) {
//       case 'hausse': return <ArrowUpRight className="h-4 w-4" />;
//       case 'baisse': return <ArrowRight className="h-4 w-4 rotate-45" />;
//       default: return <ArrowRight className="h-4 w-4" />;
//     }
//   };

//   // Exporter cette catégorie en CSV
//   const exporterCSV = useCallback(() => {
//     // Préparer les en-têtes
//     const headers = ['ID', 'Indicateur', 'Entité', 'Valeur', 'Unité', 'Tendance'];

//     // Préparer les données
//     const data = indicateursFiltres.map(ind => [
//       ind.id,
//       ind.nom,
//       ind.entite,
//       ind.valeur,
//       ind.unite || '',
//       ind.tendance || 'stable'
//     ]);

//     // Générer le CSV
//     const csvContent =
//       headers.join(',') + '\n' +
//       data.map(row => row.join(',')).join('\n');

//     // Télécharger
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.setAttribute('href', url);
//     link.setAttribute('download', `${titre.replace(/\s+/g, '_')}_export.csv`);
//     link.style.visibility = 'hidden';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   }, [indicateursFiltres, titre]);

//   // Détermine la classe de couleur pour les différents éléments de l'UI
//   const couleurClasses = useMemo(() => {
//     switch (couleur) {
//       case 'blue':
//         return {
//           border: 'border-blue-100',
//           bg: 'bg-blue-50',
//           text: 'text-blue-500',
//           hoverBg: 'hover:bg-blue-50',
//           button: 'bg-blue-500 hover:bg-blue-600'
//         };
//       case 'green':
//         return {
//           border: 'border-green-100',
//           bg: 'bg-green-50',
//           text: 'text-green-500',
//           hoverBg: 'hover:bg-green-50',
//           button: 'bg-green-500 hover:bg-green-600'
//         };
//       case 'orange':
//         return {
//           border: 'border-orange-100',
//           bg: 'bg-orange-50',
//           text: 'text-orange-500',
//           hoverBg: 'hover:bg-orange-50',
//           button: 'bg-orange-500 hover:bg-orange-600'
//         };
//       case 'purple':
//         return {
//           border: 'border-purple-100',
//           bg: 'bg-purple-50',
//           text: 'text-purple-500',
//           hoverBg: 'hover:bg-purple-50',
//           button: 'bg-purple-500 hover:bg-purple-600'
//         };
//       default:
//         return {
//           border: 'border-gray-200',
//           bg: 'bg-gray-50',
//           text: 'text-gray-500',
//           hoverBg: 'hover:bg-gray-50',
//           button: 'bg-gray-500 hover:bg-gray-600'
//         };
//     }
//   }, [couleur]);

//   return (
//     <div
//       className={`bg-white rounded-lg shadow border ${couleurClasses.border} overflow-hidden transition-all duration-200`}
//       style={{ opacity: indicateurs.length === 0 ? 0.7 : 1 }}
//     >
//       {/* Header avec titre et icône */}
//       <div
//         className={`flex items-center justify-between p-4 cursor-pointer ${estOuvert ? 'border-b' : ''}`}
//         onClick={toggleOuvert}
//       >
//         <div className="flex items-center gap-2">
//           <div className={`p-2 rounded-md ${couleurClasses.bg} ${couleurClasses.text}`}>
//             {icone}
//           </div>
//           <h3 className="text-lg font-medium text-gray-900">{titre}</h3>
//           {!estOuvert && indicateurs.length > 0 && (
//             <span className="ml-2 px-2 py-1 bg-gray-100 text-xs rounded-full">
//               {indicateurs.length}
//             </span>
//           )}
//         </div>
//         <ChevronDown
//           className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${estOuvert ? 'rotate-180' : ''}`}
//         />
//       </div>

//       {/* Corps de la section (affichée uniquement si ouverte) */}
//       <div
//         className={`transition-all duration-300 ${estOuvert
//           ? 'max-h-[600px] opacity-100'
//           : 'max-h-0 opacity-0 overflow-hidden'
//         }`}
//       >
//         {/* Barre de recherche et filtres */}
//         <div className="p-3 border-b flex items-center gap-2">
//           <div className="relative flex-grow">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <Search className="h-4 w-4 text-gray-400" />
//             </div>
//             <input
//               type="text"
//               className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
//               placeholder="Rechercher un indicateur..."
//               value={recherche}
//               onChange={(e) => setRecherche(e.target.value)}
//             />
//             {recherche && (
//               <button
//                 className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                 onClick={() => setRecherche('')}
//               >
//                 <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
//               </button>
//             )}
//           </div>

//           {filtrerParTendance && (
//             <select
//               value={tendanceFiltre}
//               onChange={(e) => setTendanceFiltre(e.target.value as any)}
//               className="border border-gray-200 rounded-md px-2 py-2 text-sm"
//             >
//               <option value="toutes">Toutes</option>
//               <option value="hausse">Hausse</option>
//               <option value="baisse">Baisse</option>
//               <option value="stable">Stable</option>
//             </select>
//           )}
//         </div>

//         {/* Liste des indicateurs */}
//         {indicateursAffiches.length > 0 ? (
//           <div className="divide-y divide-gray-100">
//             {indicateursAffiches.map((indicateur) => (
//               <div
//                 key={indicateur.id}
//                 className={`p-4 flex justify-between items-center cursor-pointer transition-colors ${
//                   isHovering === indicateur.id ? couleurClasses.hoverBg : ''
//                 }`}
//                 onClick={() => onIndicateurClick && onIndicateurClick(indicateur)}
//                 onMouseEnter={() => setIsHovering(indicateur.id)}
//                 onMouseLeave={() => setIsHovering(null)}
//               >
//                 <div className="flex flex-col">
//                   <span className="text-gray-700 font-medium">{indicateur.nom}</span>
//                   <span className="text-xs text-gray-500">{indicateur.entite}</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className={`font-medium ${obtenirCouleurTendance(indicateur.tendance)}`}>
//                     {indicateur.valeur}{indicateur.unite || ''}
//                   </span>
//                   <span className={`${obtenirCouleurTendance(indicateur.tendance)}`}>
//                     {obtenirIconeTendance(indicateur.tendance)}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="py-10 text-center text-gray-500">
//             {recherche ? 'Aucun résultat trouvé' : 'Aucun indicateur disponible'}
//           </div>
//         )}

//         {/* Pagination et contrôles */}
//         {indicateursFiltres.length > 0 && (
//           <div className="border-t">
//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div className="px-4 py-3 flex items-center justify-between">
//                 <button
//                   onClick={() => setPage(p => Math.max(1, p - 1))}
//                   disabled={page === 1}
//                   className={`px-3 py-1 text-sm rounded-md transition-colors ${
//                     page === 1
//                       ? 'text-gray-400 cursor-not-allowed'
//                       : `text-blue-600 ${couleurClasses.hoverBg}`
//                   }`}
//                 >
//                   Précédent
//                 </button>
//                 <span className="text-sm text-gray-500">
//                   Page {page} sur {totalPages}
//                 </span>
//                 <button
//                   onClick={() => setPage(p => Math.min(totalPages, p + 1))}
//                   disabled={page === totalPages}
//                   className={`px-3 py-1 text-sm rounded-md transition-colors ${
//                     page === totalPages
//                       ? 'text-gray-400 cursor-not-allowed'
//                       : `text-blue-600 ${couleurClasses.hoverBg}`
//                   }`}
//                 >
//                   Suivant
//                 </button>
//               </div>
//             )}

//             {/* Actions footer */}
//             <div className="flex justify-between items-center p-3 bg-gray-50">
//               <div className="text-xs text-gray-500">
//                 Affichant {indicateursAffiches.length} sur {indicateursFiltres.length} indicateurs
//               </div>

//               <div className="flex gap-2">
//                 <Tooltip content="Voir les détails">
//                   <button
//                     onClick={() => {
//                       if (indicateursAffiches.length > 0 && onIndicateurClick) {
//                         onIndicateurClick(indicateursAffiches[0]);
//                       }
//                     }}
//                     disabled={indicateursAffiches.length === 0}
//                     className={`px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-md flex items-center gap-1 ${
//                       indicateursAffiches.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
//                     }`}
//                   >
//                     <FileText className="h-4 w-4" />
//                     <span>Détails</span>
//                   </button>
//                 </Tooltip>

//                 <Tooltip content="Exporter en CSV">
//                   <button
//                     onClick={exporterCSV}
//                     className="px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-md flex items-center gap-1 hover:bg-gray-50"
//                   >
//                     <Download className="h-4 w-4" />
//                     <span>Exporter</span>
//                   </button>
//                 </Tooltip>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default IndicateursList;
import React, { useState, useEffect, useCallback } from 'react';
import {
  ChevronDown,
  Search,
  ArrowUpRight,
  ArrowRight,
  Download,
  FileText,
  X
} from 'lucide-react';

// Type adapté à votre backend
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

interface IndicateursListProps {
  titre: string;
  icone: React.ReactNode;
  couleur: string;
  indicateurs: Indicateur[];
  onIndicateurClick?: (indicateur: Indicateur) => void;
  filtrerParTendance?: boolean;
}

const IndicateursList: React.FC<IndicateursListProps> = ({
  titre,
  icone,
  couleur,
  indicateurs,
  onIndicateurClick,
  filtrerParTendance = false
}) => {
  // États
  const [estOuvert, setEstOuvert] = useState(() => {
    // Récupérer l'état sauvegardé si disponible
    const saved = localStorage.getItem(`categorie-${titre}-ouvert`);
    return saved ? saved === 'true' : true;
  });
  const [recherche, setRecherche] = useState('');
  const [page, setPage] = useState(1);
  const [tendanceFiltre, setTendanceFiltre] = useState<'toutes' | 'hausse' | 'baisse' | 'stable'>('toutes');
  const itemsParPage = 5;
  const [isHovering, setIsHovering] = useState<number | null>(null);

  // Sauvegarder l'état ouvert/fermé
  const toggleOuvert = useCallback(() => {
    const nouvelEtat = !estOuvert;
    setEstOuvert(nouvelEtat);
    localStorage.setItem(`categorie-${titre}-ouvert`, String(nouvelEtat));
  }, [estOuvert, titre]);

  // Filtrer les indicateurs en fonction de la recherche et de la tendance
  const indicateursFiltres = indicateurs.filter(ind => {
    const matchRecherche =
      ind.nom.toLowerCase().includes(recherche.toLowerCase()) ||
      ind.entreprise_nom.toLowerCase().includes(recherche.toLowerCase());

    const matchTendance =
      !filtrerParTendance ||
      tendanceFiltre === 'toutes' ||
      ind.tendance === tendanceFiltre;

    return matchRecherche && matchTendance;
  });

  // Calculer les pages
  const totalPages = Math.ceil(indicateursFiltres.length / itemsParPage);
  const indicateursAffiches = indicateursFiltres.slice(
    (page - 1) * itemsParPage,
    page * itemsParPage
  );

  // Reset la page quand la recherche ou le filtre tendance change
  useEffect(() => {
    setPage(1);
  }, [recherche, tendanceFiltre]);

  // Obtenir la couleur de tendance
  const obtenirCouleurTendance = (tendance?: 'hausse' | 'baisse' | 'stable') => {
    switch (tendance) {
      case 'hausse': return 'text-green-500';
      case 'baisse': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  // Obtenir l'icône de tendance
  const obtenirIconeTendance = (tendance?: 'hausse' | 'baisse' | 'stable') => {
    switch (tendance) {
      case 'hausse': return <ArrowUpRight className="h-4 w-4" />;
      case 'baisse': return <ArrowRight className="h-4 w-4 rotate-45" />;
      default: return <ArrowRight className="h-4 w-4" />;
    }
  };

  // Exporter cette catégorie en CSV
  const exporterCSV = useCallback(() => {
    // Préparer les en-têtes
    const headers = ['ID', 'Indicateur', 'Entreprise', 'Valeur', 'Tendance', 'Région'];

    // Préparer les données
    const data = indicateursFiltres.map(ind => [
      ind.id,
      ind.nom,
      ind.entreprise_nom,
      ind.valeur,
      ind.tendance || 'stable',
      ind.region || ''
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
    link.setAttribute('download', `${titre.replace(/\s+/g, '_')}_export.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [indicateursFiltres, titre]);

  // Détermine la classe de couleur pour les différents éléments de l'UI
  const couleurClasses = (() => {
    switch (couleur) {
      case 'blue':
        return {
          border: 'border-blue-100',
          bg: 'bg-blue-50',
          text: 'text-blue-500',
          hoverBg: 'hover:bg-blue-50',
          button: 'bg-blue-500 hover:bg-blue-600'
        };
      case 'green':
        return {
          border: 'border-green-100',
          bg: 'bg-green-50',
          text: 'text-green-500',
          hoverBg: 'hover:bg-green-50',
          button: 'bg-green-500 hover:bg-green-600'
        };
      case 'orange':
        return {
          border: 'border-orange-100',
          bg: 'bg-orange-50',
          text: 'text-orange-500',
          hoverBg: 'hover:bg-orange-50',
          button: 'bg-orange-500 hover:bg-orange-600'
        };
      case 'purple':
        return {
          border: 'border-purple-100',
          bg: 'bg-purple-50',
          text: 'text-purple-500',
          hoverBg: 'hover:bg-purple-50',
          button: 'bg-purple-500 hover:bg-purple-600'
        };
      default:
        return {
          border: 'border-gray-200',
          bg: 'bg-gray-50',
          text: 'text-gray-500',
          hoverBg: 'hover:bg-gray-50',
          button: 'bg-gray-500 hover:bg-gray-600'
        };
    }
  })();

  return (
    <div
      className={`bg-white rounded-lg shadow border ${couleurClasses.border} overflow-hidden transition-all duration-200`}
      style={{ opacity: indicateurs.length === 0 ? 0.7 : 1 }}
    >
      {/* Header avec titre et icône */}
      <div
        className={`flex items-center justify-between p-4 cursor-pointer ${estOuvert ? 'border-b' : ''}`}
        onClick={toggleOuvert}
      >
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-md ${couleurClasses.bg} ${couleurClasses.text}`}>
            {icone}
          </div>
          <h3 className="text-lg font-medium text-gray-900">{titre}</h3>
          {!estOuvert && indicateurs.length > 0 && (
            <span className="ml-2 px-2 py-1 bg-gray-100 text-xs rounded-full">
              {indicateurs.length}
            </span>
          )}
        </div>
        <ChevronDown
          className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${estOuvert ? 'rotate-180' : ''}`}
        />
      </div>

      {/* Corps de la section (affichée uniquement si ouverte) */}
      <div
        className={`transition-all duration-300 ${estOuvert
          ? 'max-h-[600px] opacity-100'
          : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        {/* Barre de recherche et filtres */}
        <div className="p-3 border-b flex items-center gap-2">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Rechercher un indicateur..."
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

          {filtrerParTendance && (
            <select
              value={tendanceFiltre}
              onChange={(e) => setTendanceFiltre(e.target.value as any)}
              className="border border-gray-200 rounded-md px-2 py-2 text-sm"
            >
              <option value="toutes">Toutes</option>
              <option value="hausse">Hausse</option>
              <option value="baisse">Baisse</option>
              <option value="stable">Stable</option>
            </select>
          )}
        </div>

        {/* Liste des indicateurs */}
        {indicateursAffiches.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {indicateursAffiches.map((indicateur) => (
              <div
                key={indicateur.id}
                className={`p-4 flex justify-between items-center cursor-pointer transition-colors ${
                  isHovering === indicateur.id ? couleurClasses.hoverBg : ''
                }`}
                onClick={() => onIndicateurClick && onIndicateurClick(indicateur)}
                onMouseEnter={() => setIsHovering(indicateur.id)}
                onMouseLeave={() => setIsHovering(null)}
              >
                <div className="flex flex-col">
                  <span className="text-gray-700 font-medium">{indicateur.nom}</span>
                  <span className="text-xs text-gray-500">{indicateur.entreprise_nom} {indicateur.region && `- ${indicateur.region}`}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-medium ${obtenirCouleurTendance(indicateur.tendance)}`}>
                    {indicateur.valeur}
                  </span>
                  <span className={`${obtenirCouleurTendance(indicateur.tendance)}`}>
                    {obtenirIconeTendance(indicateur.tendance)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center text-gray-500">
            {recherche ? 'Aucun résultat trouvé' : 'Aucun indicateur disponible'}
          </div>
        )}

        {/* Pagination et contrôles */}
        {indicateursFiltres.length > 0 && (
          <div className="border-t">
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 py-3 flex items-center justify-between">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    page === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : `text-blue-600 ${couleurClasses.hoverBg}`
                  }`}
                >
                  Précédent
                </button>
                <span className="text-sm text-gray-500">
                  Page {page} sur {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    page === totalPages
                      ? 'text-gray-400 cursor-not-allowed'
                      : `text-blue-600 ${couleurClasses.hoverBg}`
                  }`}
                >
                  Suivant
                </button>
              </div>
            )}

            {/* Actions footer */}
            <div className="flex justify-between items-center p-3 bg-gray-50">
              <div className="text-xs text-gray-500">
                Affichant {indicateursAffiches.length} sur {indicateursFiltres.length} indicateurs
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (indicateursAffiches.length > 0 && onIndicateurClick) {
                      onIndicateurClick(indicateursAffiches[0]);
                    }
                  }}
                  disabled={indicateursAffiches.length === 0}
                  className={`px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-md flex items-center gap-1 ${
                    indicateursAffiches.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  <span>Détails</span>
                </button>

                <button
                  onClick={exporterCSV}
                  className="px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-md flex items-center gap-1 hover:bg-gray-50"
                >
                  <Download className="h-4 w-4" />
                  <span>Exporter</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IndicateursList;
