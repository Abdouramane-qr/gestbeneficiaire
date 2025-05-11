import React, { useState, useEffect } from 'react';
import { Indicateur } from '../Types/indicateurs';
import {  ChevronUp, ChevronDown, FileDown, Eye } from 'lucide-react';

interface IndicateursTableProps {
  indicateurs: Indicateur[];
  categorie?: string;
  onViewDetails?: (indicateur: Indicateur) => void;
  onExport?: (indicateur: Indicateur) => void;
}

/**
 * Tableau pour afficher les indicateurs avec tri et filtrage
 */
const IndicateursTable: React.FC<IndicateursTableProps> = ({
  indicateurs,
  categorie,
  onViewDetails,
  onExport
}) => {
  const [filteredIndicateurs, setFilteredIndicateurs] = useState<Indicateur[]>([]);
  const [sortField, setSortField] = useState<string>('libelle');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Filtrer et trier les indicateurs
  useEffect(() => {
    let filtered = [...indicateurs];

    // Filtrer par catégorie si spécifiée
    if (categorie) {
      filtered = filtered.filter(ind => ind.categorie === categorie);
    }

    // Filtrer par terme de recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(ind =>
        ind.libelle?.toLowerCase().includes(term) ||
        ind.description?.toLowerCase().includes(term)
      );
    }

    // Trier les résultats
    filtered.sort((a: any, b: any) => {
      const valueA = a[sortField] !== null && a[sortField] !== undefined ? a[sortField] : '';
      const valueB = b[sortField] !== null && b[sortField] !== undefined ? b[sortField] : '';

      // Tri numérique pour les valeurs
      if (sortField === 'valeur' || sortField === 'valeur_cible') {
        const numA = parseFloat(valueA) || 0;
        const numB = parseFloat(valueB) || 0;
        return sortDirection === 'asc' ? numA - numB : numB - numA;
      }

      // Tri alphabétique pour le reste
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortDirection === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      return 0;
    });

    setFilteredIndicateurs(filtered);
  }, [indicateurs, categorie, sortField, sortDirection, searchTerm]);

  // Changer le champ de tri
  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Afficher l'icône de tri appropriée
  const renderSortIcon = (field: string) => {
    if (field !== sortField) {
      return <ChevronDown className="w-4 h-4 ml-1" />;
    }

    return sortDirection === 'asc'
      ? <ChevronUp className="w-4 h-4 ml-1" />
      : <ChevronDown className="w-4 h-4 ml-1" />;
  };

  // Formater la valeur d'un indicateur avec son unité
  const formatValue = (value: number | string | null | undefined, unite?: string) => {
    if (value === null || value === undefined) return '-';

    // Formater les nombres avec 2 décimales si nécessaire
    const formattedValue = typeof value === 'number'
      ? value % 1 !== 0 ? value.toFixed(2) : value.toString()
      : value;

    // Ajouter l'unité si présente
    return unite ? `${formattedValue} ${unite}` : formattedValue;
  };

  // Calculer l'écart entre la valeur actuelle et la cible
  const calculateEcart = (valeur: number | string | null | undefined, cible: number | string | null | undefined) => {
    if (valeur === null || valeur === undefined || cible === null || cible === undefined) {
      return '-';
    }

    const val = typeof valeur === 'string' ? parseFloat(valeur) : valeur;
    const target = typeof cible === 'string' ? parseFloat(cible) : cible;

    if (isNaN(val) || isNaN(target)) {
      return '-';
    }

    const ecart = val - target;
    return ecart.toFixed(2);
  };

  // Déterminer la classe CSS pour l'écart (positif/négatif)
  const getEcartClass = (ecart: string) => {
    if (ecart === '-') return '';

    const ecartValue = parseFloat(ecart);
    if (isNaN(ecartValue)) return '';

    return ecartValue >= 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md">
      {/* Barre de recherche */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <input
          type="text"
          placeholder="Rechercher par libellé ou description..."
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tableau des indicateurs */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('libelle')}
              >
                <div className="flex items-center">
                  Libellé {renderSortIcon('libelle')}
                </div>
              </th>
              {!categorie && (
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('categorie')}
                >
                  <div className="flex items-center">
                    Catégorie {renderSortIcon('categorie')}
                  </div>
                </th>
              )}
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('valeur')}
              >
                <div className="flex items-center">
                  Valeur {renderSortIcon('valeur')}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('valeur_cible')}
              >
                <div className="flex items-center">
                  Valeur cible {renderSortIcon('valeur_cible')}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Écart
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            {filteredIndicateurs.length > 0 ? (
              filteredIndicateurs.map((indicateur) => {
                const ecart = calculateEcart(indicateur.valeur, indicateur.valeur_cible);
                const ecartClass = getEcartClass(ecart);

                return (
                  <tr key={indicateur.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{indicateur.libelle}</div>
                      {indicateur.description && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
                          {indicateur.description}
                        </div>
                      )}
                    </td>
                    {!categorie && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                          {indicateur.categorie}
                        </span>
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatValue(indicateur.valeur, indicateur.unite)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatValue(indicateur.valeur_cible, indicateur.unite)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${ecartClass}`}>
                      {ecart !== '-' ? formatValue(ecart, indicateur.unite) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {onViewDetails && (
                          <button
                            onClick={() => onViewDetails(indicateur)}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                            title="Voir les détails"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                        )}
                        {onExport && (
                          <button
                            onClick={() => onExport(indicateur)}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                            title="Exporter"
                          >
                            <FileDown className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={categorie ? 5 : 6} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  Aucun indicateur trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IndicateursTable;
