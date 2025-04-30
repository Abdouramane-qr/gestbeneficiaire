import React from 'react';
import { FilterIcon, RefreshCw, FileDown } from 'lucide-react';

interface IndicateurFiltersProps {
  categories: string[];
  selectedCategorie: string;
  periodes: string[];
  selectedPeriode: string;
  annees: number[];
  selectedAnnee: number;
  onCategorieChange: (categorie: string) => void;
  onPeriodeChange: (periode: string) => void;
  onAnneeChange: (annee: number) => void;
  onExport?: () => void;
  onRefresh?: () => void;
}

/**
 * Composant de filtres pour les indicateurs
 */
const IndicateurFilters: React.FC<IndicateurFiltersProps> = ({
  categories,
  selectedCategorie,
  periodes,
  selectedPeriode,
  annees,
  selectedAnnee,
  onCategorieChange,
  onPeriodeChange,
  onAnneeChange,
  onExport,
  onRefresh
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="flex items-center space-x-2">
          <FilterIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Filtres</h3>
        </div>

        <div className="flex flex-wrap gap-4">
          {/* Sélecteur de catégorie */}
          <div className="min-w-[200px]">
            <label htmlFor="categorie-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Catégorie
            </label>
            <select
              id="categorie-filter"
              value={selectedCategorie}
              onChange={(e) => onCategorieChange(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Toutes les catégories</option>
              {categories.map((categorie) => (
                <option key={categorie} value={categorie}>
                  {categorie}
                </option>
              ))}
            </select>
          </div>

          {/* Sélecteur de période */}
          <div className="min-w-[200px]">
            <label htmlFor="periode-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Période
            </label>
            <select
              id="periode-filter"
              value={selectedPeriode}
              onChange={(e) => onPeriodeChange(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Toutes les périodes</option>
              {periodes.map((periode) => (
                <option key={periode} value={periode}>
                  {periode}
                </option>
              ))}
            </select>
          </div>

          {/* Sélecteur d'année */}
          <div className="min-w-[200px]">
            <label htmlFor="annee-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Année
            </label>
            <select
              id="annee-filter"
              value={selectedAnnee}
              onChange={(e) => onAnneeChange(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Toutes les années</option>
              {annees.map((annee) => (
                <option key={annee} value={annee}>
                  {annee}
                </option>
              ))}
            </select>
          </div>

          {/* Boutons d'action */}
          <div className="flex items-end space-x-2">
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="p-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                title="Rafraîchir les données"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            )}

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
    </div>
  );
};

export default IndicateurFilters;
          