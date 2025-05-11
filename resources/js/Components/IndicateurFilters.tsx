// import React from 'react';
// import { FilterIcon, RefreshCw, FileDown } from 'lucide-react';

// interface IndicateurFiltersProps {
//   categories: string[];
//   selectedCategorie: string;
//   periodes: string[];
//   selectedPeriode: string;
//   annees: number[];
//   selectedAnnee: number;
//   onCategorieChange: (categorie: string) => void;
//   onPeriodeChange: (periode: string) => void;
//   onAnneeChange: (annee: number) => void;
//   onExport?: () => void;
//   onRefresh?: () => void;
// }

// /**
//  * Composant de filtres pour les indicateurs
//  */
// const IndicateurFilters: React.FC<IndicateurFiltersProps> = ({
//   categories,
//   selectedCategorie,
//   periodes,
//   selectedPeriode,
//   annees,
//   selectedAnnee,
//   onCategorieChange,
//   onPeriodeChange,
//   onAnneeChange,
//   onExport,
//   onRefresh
// }) => {
//   return (
//     <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
//         <div className="flex items-center space-x-2">
//           <FilterIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
//           <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Filtres</h3>
//         </div>

//         <div className="flex flex-wrap gap-4">
//           {/* Sélecteur de catégorie */}
//           <div className="min-w-[200px]">
//             <label htmlFor="categorie-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//               Catégorie
//             </label>
//             <select
//               id="categorie-filter"
//               value={selectedCategorie}
//               onChange={(e) => onCategorieChange(e.target.value)}
//               className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//             >
//               <option value="">Toutes les catégories</option>
//               {categories.map((categorie) => (
//                 <option key={categorie} value={categorie}>
//                   {categorie}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Sélecteur de période */}
//           <div className="min-w-[200px]">
//             <label htmlFor="periode-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//               Période
//             </label>
//             <select
//               id="periode-filter"
//               value={selectedPeriode}
//               onChange={(e) => onPeriodeChange(e.target.value)}
//               className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//             >
//               <option value="">Toutes les périodes</option>
//               {periodes.map((periode) => (
//                 <option key={periode} value={periode}>
//                   {periode}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Sélecteur d'année */}
//           <div className="min-w-[200px]">
//             <label htmlFor="annee-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//               Année
//             </label>
//             <select
//               id="annee-filter"
//               value={selectedAnnee}
//               onChange={(e) => onAnneeChange(Number(e.target.value))}
//               className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//             >
//               <option value="">Toutes les années</option>
//               {annees.map((annee) => (
//                 <option key={annee} value={annee}>
//                   {annee}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Boutons d'action */}
//           <div className="flex items-end space-x-2">
//             {onRefresh && (
//               <button
//                 onClick={onRefresh}
//                 className="p-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
//                 title="Rafraîchir les données"
//               >
//                 <RefreshCw className="w-5 h-5" />
//               </button>
//             )}

//             {onExport && (
//               <button
//                 onClick={onExport}
//                 className="p-2 text-white bg-green-600 border border-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-green-700 dark:hover:bg-green-600"
//                 title="Exporter les données"
//               >
//                 <FileDown className="w-5 h-5" />
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default IndicateurFilters;
import { FilterIcon, RefreshCw, FileDown, AlertCircle } from 'lucide-react';

interface IndicateurFiltersProps {
  // Propriétés pour les filtres
  periodes: string[];
  selectedPeriode: string;
  onPeriodeChange: (periode: string) => void;
  exercices: Array<{ id: number; annee: number; actif: boolean }>;
  selectedExerciceId: number | null;
  onExerciceChange: (exerciceId: number | null) => void;
  entreprises: Array<{ id: number; nom_entreprise: string }>;
  selectedEntrepriseId: number | null;
  onEntrepriseChange: (entrepriseId: number | null) => void;
  // Propriétés pour les actions
  onRefresh: () => void;
  onExport?: () => void;
  // État des données
  isLoading: boolean;
  isDemoData?: boolean;
}

/**
 * Composant de filtres pour les indicateurs avec notification pour les données de démo
 */
const IndicateurFilters: React.FC<IndicateurFiltersProps> = ({
  periodes,
  selectedPeriode,
  onPeriodeChange,
  exercices,
  selectedExerciceId,
  onExerciceChange,
  entreprises,
  selectedEntrepriseId,
  onEntrepriseChange,
  onRefresh,
  onExport,
  isLoading,
  isDemoData
}) => {
  return (
    <div className="space-y-4 mb-6">
      {/* Alerte pour les données de démo */}
      {isDemoData && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <span className="font-medium">Attention:</span> Aucune donnée réelle n'a été trouvée pour les critères sélectionnés. Des données de démonstration sont affichées à titre d'exemple.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filtres */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <FilterIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Filtres</h3>
          </div>

          <div className="flex flex-wrap gap-4">
            {/* Sélecteur de période */}
            <div className="min-w-[160px]">
              <label htmlFor="periode-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Période
              </label>
              <div className="flex flex-wrap gap-2">
                {periodes.map(periode => (
                  <button
                    key={periode}
                    className={`px-3 py-2 rounded-md text-sm ${
                      selectedPeriode === periode
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => onPeriodeChange(periode)}
                  >
                    {periode}
                  </button>
                ))}
              </div>
            </div>

            {/* Sélecteur d'exercice */}
            <div className="min-w-[160px]">
              <label htmlFor="exercice-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Exercice
              </label>
              <select
                id="exercice-filter"
                value={selectedExerciceId || ''}
                onChange={(e) => onExerciceChange(e.target.value ? parseInt(e.target.value) : null)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Tous les exercices</option>
                {exercices.map((exercice) => (
                  <option key={exercice.id} value={exercice.id}>
                    {exercice.annee} {exercice.actif && '(Actif)'}
                  </option>
                ))}
              </select>
            </div>

            {/* Sélecteur d'entreprise */}
            <div className="min-w-[200px]">
              <label htmlFor="entreprise-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Entreprise
              </label>
              <select
                id="entreprise-filter"
                value={selectedEntrepriseId || ''}
                onChange={(e) => onEntrepriseChange(e.target.value ? parseInt(e.target.value) : null)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Toutes les entreprises</option>
                {entreprises.map((entreprise) => (
                  <option key={entreprise.id} value={entreprise.id}>
                    {entreprise.nom_entreprise}
                  </option>
                ))}
              </select>
            </div>

            {/* Boutons d'action */}
            <div className="flex items-end space-x-2">
              <button
                onClick={onRefresh}
                disabled={isLoading}
                className="p-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 disabled:opacity-50"
                title="Rafraîchir les données"
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>

              {onExport && (
                <button
                  onClick={onExport}
                  className="p-2 text-white bg-green-600 border border-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-green-700 dark:hover:bg-green-600"
                  title="Exporter les données"
                >
                  <FileDown className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Réinitialiser les filtres */}
        {(selectedExerciceId || selectedEntrepriseId) && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                onExerciceChange(null);
                onEntrepriseChange(null);
              }}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default IndicateurFilters;
