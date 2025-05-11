// // // /**
// // //  * Classe utilitaire pour gérer les noms et la disponibilité des périodes
// // //  */
// // // export class PeriodeNameGenerator {
// // //     /**
// // //      * Génère des noms formatés pour les périodes d'un exercice
// // //      * @param periodes Liste des périodes
// // //      * @returns Map avec les IDs de période en clé et les noms formatés en valeur
// // //      */
// // //     static getPeriodeNamesForExercice(periodes: Periode[]): Map<number, string> {
// // //         const periodeNames = new Map<number, string>();


// // //         periodes.forEach(periode => {
// // //             const annee = new Date(periode.date_debut).getFullYear();
// // //             let nom = '';

// // //             switch (periode.type_periode.toLowerCase()) {
// // //                 case 'mensuel':
// // //                     { const mois = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
// // //                                 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
// // //                     const moisIndex = new Date(periode.date_debut).getMonth();
// // //                     nom = `${mois[moisIndex]} ${annee}`;
// // //                     break; }

// // //                 case 'trimestriel':
// // //                     { const trimestre = Math.floor(new Date(periode.date_debut).getMonth() / 3) + 1;
// // //                     nom = `T${trimestre} ${annee}`;
// // //                     break; }

// // //                 case 'semestriel':
// // //                     { const semestre = Math.floor(new Date(periode.date_debut).getMonth() / 6) + 1;
// // //                     nom = `S${semestre} ${annee}`;
// // //                     break; }

// // //                 case 'annuel':
// // //                     nom = `Annuel ${annee}`;
// // //                     break;

// // //                 case 'occasionnel':
// // //                     nom = `Occasionnel ${annee}`;
// // //                     break;

// // //                 default:
// // //                     nom = `${periode.type_periode} ${annee}`;
// // //             }

// // //             periodeNames.set(periode.id, nom);
// // //         });

// // //         return periodeNames;
// // //     }

// // //     /**
// // //      * Filtre les périodes déjà utilisées dans les collectes
// // //      * @param periodes Liste complète des périodes
// // //      * @param existingCollectes Liste des collectes existantes
// // //      * @returns Liste des périodes disponibles (non utilisées)
// // //      */
// // //     static filterAvailablePeriodes(periodes: Periode[], existingCollectes: any[]): Periode[] {
// // //         // Créer un ensemble des périodes déjà utilisées
// // //         const usedPeriodeIds = new Set(existingCollectes.map(c => c.periode_id));

// // //         // Filtrer les périodes qui ne sont pas encore utilisées
// // //         return periodes.filter(periode => !usedPeriodeIds.has(periode.id));
// // //     }

// // //     /**
// // //      * Vérifie si une période est disponible pour une entreprise
// // //      * @param periodeId ID de la période à vérifier
// // //      * @param entrepriseId ID de l'entreprise
// // //      * @param collectes Liste des collectes existantes
// // //      */
// // //     static isPeriodeAvailableForEntreprise(periodeId: number, entrepriseId: number, collectes: any[]): boolean {
// // //         return !collectes.some(c =>
// // //             c.periode_id === periodeId &&
// // //             c.entreprise_id === entrepriseId
// // //         );
// // //     }

// // //     /**
// // //      * Obtient les détails d'une période par son ID
// // //      * @param periodeId ID de la période
// // //      * @param periodes Liste des périodes
// // //      */
// // //     static getPeriodeDetails(periodeId: number, periodes: Periode[]): Periode | undefined {
// // //         return periodes.find(p => p.id === periodeId);
// // //     }
// // // }

// // // /**
// // //  * Interface pour les périodes
// // //  */
// // // export interface Periode {
// // //     id: number;
// // //     type_periode: string;
// // //     exercice_id: number;
// // //     date_debut: string;
// // //     date_fin: string;
// // // }

// // // /**
// // //  * Interface pour les détails d'une période
// // //  */
// // // export interface PeriodeDetails {
// // //     id: number;
// // //     nom: string;
// // //     typePeriode: string;
// // //     dateDebut: string;
// // //     dateFin: string;
// // //     disponible: boolean;
// // // }
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { toast } from 'sonner';
// import {  XIcon, LoaderIcon } from 'lucide-react';

// interface Periode {
//   id: number;
//   type_periode: string;
//   exercice_id: number;
//   nom?: string;
//   date_debut: string;
//   date_fin: string;
// }

// interface PeriodeSelectorProps {
//   entrepriseId: string;
//   exerciceId: string;
//   value: string;
//   onChange: (periodeId: string) => void;
//   className?: string;
//   error?: string;
//   disabled?: boolean;
// }

// const PeriodeSelector: React.FC<PeriodeSelectorProps> = ({
//   entrepriseId,
//   exerciceId,
//   value,
//   onChange,
//   className = '',
//   error,
//   disabled = false
// }) => {
//   const [periodes, setPeriodes] = useState<Periode[]>([]);
//   const [utilizadaPeriodes, setUtilizadaPeriodes] = useState<number[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error404, setError404] = useState(false);

//   // Charger les périodes disponibles quand l'entreprise ou l'exercice change
//   useEffect(() => {
//     if (!entrepriseId || !exerciceId) {
//       setPeriodes([]);
//       return;
//     }

//     setLoading(true);
//     setError404(false);

//     axios.get(route('collectes.periodes-disponibles'), {
//       params: { entreprise_id: entrepriseId, exercice_id: exerciceId }
//     })
//       .then(response => {
//         setPeriodes(response.data.periodes || []);
//         setUtilizadaPeriodes(response.data.periodes_utilisees || []);
//       })
//       .catch(error => {
//         console.error('Erreur lors du chargement des périodes', error);
//         if (error.response && error.response.status === 404) {
//           setError404(true);
//         } else {
//           toast.error("Erreur lors du chargement des périodes disponibles");
//         }
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   }, [entrepriseId, exerciceId]);

//   // Si la période sélectionnée n'est plus disponible, réinitialiser
//   useEffect(() => {
//     if (value && periodes.length > 0) {
//       const periodeExiste = periodes.some(p => p.id.toString() === value);
//       if (!periodeExiste) {
//         onChange('');
//       }
//     }
//   }, [periodes, value, onChange]);

//   // Formater le nom de la période pour l'affichage
//   const formatPeriodeName = (periode: Periode): string => {
//     // Si un nom formaté existe, l'utiliser
//     if (periode.nom) return periode.nom;

//     // Sinon, formater selon le type
//     switch (periode.type_periode.toLowerCase()) {
//       case 'mensuel':
//         return `Mensuel`;
//       case 'trimestriel':
//         return `Trimestre`;
//       case 'semestriel':
//         return `Semestre`;
//       case 'annuel':
//         return `Annuel`;
//       default:
//         return periode.type_periode;
//     }
//   };

//   return (
//     <div>
//       <select
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         disabled={disabled || loading || periodes.length === 0}
//         className={`w-full rounded-lg border-2 shadow-sm ${
//           error
//             ? 'border-red-500 dark:border-red-400'
//             : 'border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400'
//         } py-3 px-4 dark:bg-gray-700 dark:text-white ${className}`}
//       >
//         <option value="">Sélectionner une période</option>

//         {periodes.map(periode => (
//           <option
//             key={periode.id}
//             value={periode.id.toString()}
//             disabled={utilizadaPeriodes.includes(periode.id)}
//           >
//             {formatPeriodeName(periode)}
//             {utilizadaPeriodes.includes(periode.id) ? ' (Déjà utilisée)' : ''}
//           </option>
//         ))}

//         {/* Option pour les collectes occasionnelles */}
//         <option
//           value="occasionnelle"
//           className="font-medium text-indigo-600 dark:text-indigo-400"
//         >
//           Collecte Occasionnelle (sans période)
//         </option>
//       </select>

//       {loading && (
//         <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
//           <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
//           Chargement des périodes...
//         </div>
//       )}

//       {error404 && (
//         <div className="mt-2 flex items-center text-sm text-yellow-500 dark:text-yellow-400">
//           <XIcon className="w-4 h-4 mr-2" />
//           Impossible de charger les périodes
//         </div>
//       )}

//       {periodes.length === 0 && !loading && !error404 && exerciceId && (
//         <div className="mt-2 flex items-center text-sm text-amber-500 dark:text-amber-400">
//           <XIcon className="w-4 h-4 mr-2" />
//           Aucune période disponible pour cet exercice
//         </div>
//       )}

//       {error && (
//         <p className="mt-1 text-sm text-red-500 dark:text-red-400">{error}</p>
//       )}
//     </div>
//   );
// };

// export default PeriodeSelector;

// export class PeriodeNameGenerator {
//     static getPeriodeNamesForExercice(periodes: Periode[]): Map<number, string> {
//         const periodeNames = new Map<number, string>();

//         periodes.forEach(periode => {
//             const annee = new Date(periode.date_debut).getFullYear();
//             let nom = '';

//             switch (periode.type_periode.toLowerCase()) {
//                 case 'mensuel':
//                 case 'mensuelle': {
//                     const mois = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
//                                 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
//                     const moisIndex = new Date(periode.date_debut).getMonth();
//                     nom = `${mois[moisIndex]} ${annee}`;
//                     break;
//                 }

//                 case 'trimestriel':
//                 case 'trimestrielle': {
//                     const trimestre = Math.floor(new Date(periode.date_debut).getMonth() / 3) + 1;
//                     nom = `T${trimestre} ${annee}`;
//                     break;
//                 }

//                 case 'semestriel':
//                 case 'semestrielle': {
//                     const semestre = Math.floor(new Date(periode.date_debut).getMonth() / 6) + 1;
//                     nom = `S${semestre} ${annee}`;
//                     break;
//                 }

//                 case 'annuel':
//                 case 'annuelle':
//                     nom = `Annuel ${annee}`;
//                     break;

//                 case 'occasionnel':
//                 case 'occasionnelle':
//                     nom = `Occasionnel ${annee}`;
//                     break;

//                 default:
//                     nom = `${periode.type_periode} ${annee}`;
//             }

//             periodeNames.set(periode.id, nom);
//         });

//         return periodeNames;
//     }

//     static filterAvailablePeriodes(periodes: Periode[], existingCollectes: any[]): Periode[] {
//         const usedPeriodeIds = new Set(existingCollectes.map(c => c.periode_id));
//         return periodes.filter(periode => !usedPeriodeIds.has(periode.id));
//     }
// }

// export function mapTypePeriode(typePeriode: string): string {
//     const typeMap: Record<string, string> = {
//         'Trimestriel': 'Trimestrielle',
//         'Mensuelle': 'Mensuelle',
//         'mensuelle': 'Mensuelle',
//         'trimestriel': 'Trimestrielle',
//         'Semestriel': 'Semestrielle',
//         'semestriel': 'Semestrielle',
//         'Annuel': 'Annuelle',
//         'annuel': 'Annuelle',
//         'Occasionnel': 'Occasionnelle',
//         'occasionnel': 'Occasionnelle',
//     };

//     return typeMap[typePeriode] || '';
// }
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { XIcon, LoaderIcon } from 'lucide-react';
import { PeriodeNameGenerator, mapTypePeriode } from './PeriodeNameGenerator';
import { Periode, PeriodeSelectorProps } from './periodeTypes';

const PeriodeSelector: React.FC<PeriodeSelectorProps> = ({
  entrepriseId,
  exerciceId,
  value,
  onChange,
  className = '',
  error,
  disabled = false,
  periodes: initialPeriodes = [],
  usedPeriodIds = []
}) => {
  const [periodes, setPeriodes] = useState<Periode[]>(initialPeriodes);
  const [loading, setLoading] = useState(false);
  const [error404, setError404] = useState(false);
  const [periodeNames, setPeriodeNames] = useState<Map<number, string>>(new Map());

  useEffect(() => {
    if (initialPeriodes.length > 0) {
      setPeriodes(initialPeriodes);
      setPeriodeNames(PeriodeNameGenerator.getPeriodeNamesForExercice(initialPeriodes));
      return;
    }

    if (!entrepriseId || !exerciceId) {
      setPeriodes([]);
      return;
    }

    setLoading(true);
    setError404(false);

    axios.get('/api/periodes-disponibles', {
      params: { entreprise_id: entrepriseId, exercice_id: exerciceId }
    })
      .then(response => {
        const availablePeriodes = PeriodeNameGenerator.filterAvailablePeriodes(
          response.data.periodes || [],
          response.data.periodes_utilisees || []
        );
        setPeriodes(availablePeriodes);
        setPeriodeNames(PeriodeNameGenerator.getPeriodeNamesForExercice(availablePeriodes));
      })
      .catch(error => {
        console.error('Error loading periods', error);
        if (error.response?.status === 404) {
          setError404(true);
        } else {
          toast.error("Error loading available periods");
        }
      })
      .finally(() => setLoading(false));
  }, [entrepriseId, exerciceId, initialPeriodes]);

  useEffect(() => {
    if (value && periodes.length > 0 && !periodes.some(p => p.id.toString() === value)) {
      onChange('');
    }
  }, [periodes, value, onChange]);

  const isPeriodUsed = (periodeId: number): boolean => usedPeriodIds.includes(periodeId);

  return (
    <div className="space-y-2">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || loading || periodes.length === 0}
        className={`w-full rounded-lg border-2 shadow-sm ${
          error
            ? 'border-red-500 dark:border-red-400'
            : 'border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400'
        } py-3 px-4 dark:bg-gray-700 dark:text-white ${className}`}
      >
        <option value="">Select a period</option>
        {periodes.map(periode => (
          <option
            key={periode.id}
            value={periode.id.toString()}
            disabled={isPeriodUsed(periode.id)}
            className={isPeriodUsed(periode.id) ? 'text-gray-400' : ''}
          >
            {periodeNames.get(periode.id) || mapTypePeriode(periode.type_periode)}
            {isPeriodUsed(periode.id) ? ' (Already used)' : ''}
          </option>
        ))}
        <option value="occasionnelle" className="font-medium text-indigo-600 dark:text-indigo-400">
          Occasional Collection (no period)
        </option>
      </select>

      {loading && (
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
          Loading periods...
        </div>
      )}

      {error404 && (
        <div className="flex items-center text-sm text-yellow-500 dark:text-yellow-400">
          <XIcon className="w-4 h-4 mr-2" />
          Unable to load periods
        </div>
      )}

      {periodes.length === 0 && !loading && !error404 && exerciceId && (
        <div className="flex items-center text-sm text-amber-500 dark:text-amber-400">
          <XIcon className="w-4 h-4 mr-2" />
          No available periods for this exercise
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default PeriodeSelector;
