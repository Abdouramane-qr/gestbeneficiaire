// resources/js/Pages/Indicateurs/AnalyseIntegree.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import axios from 'axios';
import { PageProps } from '@/types';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// Types
interface Indicateur {
  id: string;
  label: string;
  value: number;
  target: number;
  evolution: string;
  unite: string;
  definition: string;
  is_calculated?: boolean;
  metadata?: {
    entreprise_ids: number[];
    collecte_ids: number[];
    periodes: string[];
    nombre_points_donnees: number;
    demo?: boolean;
  };
}

interface IndicateursParCategorie {
  [categorie: string]: Indicateur[];
}

interface Exercice {
  id: number;
  annee: number;
  date_debut: string;
  date_fin: string;
  actif: boolean;
}

interface Entreprise {
  id: number;
  nom_entreprise: string;
  secteur_activite: string;
}

// Props pour le composant
interface AnalyseIntegreeProps extends PageProps {
  exercices: Exercice[];
  entreprises: Entreprise[];
  defaultExerciceId: number | null;
  defaultPeriodeType: string;
  periodes: string[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const AnalyseIntegree: React.FC<AnalyseIntegreeProps> = ({
  auth,
  exercices,
  entreprises,
  defaultExerciceId,
  defaultPeriodeType,
  periodes
}) => {
  // États pour les filtres
  const [selectedPeriode, setSelectedPeriode] = useState<string>(defaultPeriodeType);
  const [selectedExerciceId, setSelectedExerciceId] = useState<number | null>(defaultExerciceId);
  const [selectedEntrepriseId, setSelectedEntrepriseId] = useState<number | null>(null);
  const [selectedCategorie, setSelectedCategorie] = useState<string>('');

  // États pour les données
  const [indicateursData, setIndicateursData] = useState<IndicateursParCategorie>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemoData, setIsDemoData] = useState<boolean>(false);
  const [noData, setNoData] = useState<boolean>(false);

  // État pour la visualisation
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');

  // Effet pour charger les données initiales
  useEffect(() => {
    fetchIndicateursData();
  }, [selectedPeriode, selectedExerciceId, selectedEntrepriseId]);

  const fetchIndicateursData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setIsDemoData(false);
      setNoData(false);

      const response = await axios.get('/api/indicateurs/analyse', {
        params: {
          periode_type: selectedPeriode,
          exercice_id: selectedExerciceId,
          entreprise_id: selectedEntrepriseId
        },
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      if (response.data.success) {
        if (response.data.no_data || Object.keys(response.data.data || {}).length === 0) {
          setNoData(true);
          setIndicateursData({});
        } else {
          setIndicateursData(response.data.data);
          setIsDemoData(response.data.demo_data || false);
        }

        const categories = Object.keys(response.data.data || {});
        if (categories.length > 0 && (!selectedCategorie || !categories.includes(selectedCategorie))) {
          setSelectedCategorie(categories[0]);
        } else if (categories.length === 0) {
          setSelectedCategorie('');
        }
      } else {
        setError('Échec de la récupération des données');
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des données:', err);
      setError('Une erreur est survenue lors de la récupération des données');
    } finally {
      setIsLoading(false);
    }
  };

  const exportToExcel = () => {
    const params = new URLSearchParams({
      periode_type: selectedPeriode
    });

    if (selectedExerciceId) {
      params.append('exercice_id', selectedExerciceId.toString());
    }

    if (selectedEntrepriseId) {
      params.append('entreprise_id', selectedEntrepriseId.toString());
    }

    if (selectedCategorie) {
      params.append('categorie', selectedCategorie);
    }

    window.location.href = `/api/indicateurs/export-excel?${params.toString()}`;
  };

  const categoriesDisponibles = useMemo(() => {
    return Object.keys(indicateursData);
  }, [indicateursData]);

  const indicateursActifs = useMemo(() => {
    if (!selectedCategorie || !indicateursData[selectedCategorie]) return [];
    return indicateursData[selectedCategorie];
  }, [indicateursData, selectedCategorie]);


  const viewIndicateurDetails = (indicateur: any) => {
    const params = new URLSearchParams({
      categorie: selectedCategorie,
      periode_type: selectedPeriode
    });

    if (selectedExerciceId) {
      params.append('exercice_id', selectedExerciceId.toString());
    }

    window.location.href = `/indicateurs/detail/${indicateur.id}?${params.toString()}`;
  };

  const NoDataMessage = () => (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg shadow-sm mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-lg font-medium text-yellow-800">
            Aucune donnée disponible
          </h3>
          <div className="mt-2 text-yellow-700">
            <p>
              Aucune donnée n'a été trouvée pour les critères sélectionnés. Veuillez vérifier que:
            </p>
            <ul className="mt-1 ml-5 list-disc">
              <li>Des collectes de données ont été effectuées pour cette période</li>
              <li>L'entreprise sélectionnée a des données associées</li>
              <li>L'exercice choisi contient des données pour cette période</li>
            </ul>
            <p className="mt-2">
              Essayez de modifier les filtres ou d'effectuer une nouvelle collecte de données.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderChart = () => {
    const data = indicateursActifs.map(ind => ({
      name: ind.label.length > 20 ? ind.label.substring(0, 20) + '...' : ind.label,
      valeur: ind.value,
      cible: ind.target,
      unite: ind.unite
    }));

    switch (chartType) {
      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" height={60} tick={{ fontSize: 12 }} tickLine={false} angle={-45} textAnchor="end" />
            <YAxis />
            <Tooltip
              formatter={(value: number) => [value.toLocaleString(), 'Valeur']}
              labelFormatter={(label) => label}
            />
            <Legend />
            <Bar dataKey="valeur" name="Valeur" fill="#3498db" />
            <Bar dataKey="cible" name="Cible" fill="#2ecc71" />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" height={60} tick={{ fontSize: 12 }} tickLine={false} angle={-45} textAnchor="end" />
            <YAxis />
            <Tooltip
              formatter={(value: number) => [value.toLocaleString(), 'Valeur']}
              labelFormatter={(label) => label}
            />
            <Legend />
            <Line type="monotone" dataKey="valeur" name="Valeur" stroke="#3498db" />
            <Line type="monotone" dataKey="cible" name="Cible" stroke="#2ecc71" strokeDasharray="5 5" />
          </LineChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="valeur"
              nameKey="name"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [value.toLocaleString(), 'Valeur']}
            />
            <Legend />
          </PieChart>
        );
      default:
        return null;
    }
  };

  return (
    <AppLayout
      title="Analyse Intégrée des Indicateurs"
      user={auth?.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Analyse Intégrée des Indicateurs</h2>}
    >
      <Head title="Analyse Intégrée des Indicateurs" />

      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* En-tête */}
          <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white p-4 md:p-6 mb-6 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-xl md:text-2xl font-bold">Analyse Intégrée des Indicateurs</h1>
                <p className="text-sm md:text-base mt-1 opacity-80">Interface avancée avec visualisations personnalisées</p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={route('indicateurs.analyse')}
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-md text-sm transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  <span className="hidden md:inline">Interface standard</span>
                </Link>
                <button
                  onClick={() => fetchIndicateursData()}
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-md text-sm transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  <span className="hidden md:inline">Actualiser</span>
                </button>
              </div>
            </div>
          </div>

          {/* Filtres intégrés */}
          <div className="mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-800">Filtres</h3>
                </div>

                <div className="flex flex-wrap gap-4">
                  {/* Sélecteur de période */}
                  <div className="min-w-[160px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                          onClick={() => setSelectedPeriode(periode)}
                        >
                          {periode}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sélecteur d'exercice */}
                  <div className="min-w-[160px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Exercice
                    </label>
                    <select
                      value={selectedExerciceId || ''}
                      onChange={(e) => setSelectedExerciceId(e.target.value ? parseInt(e.target.value) : null)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Entreprise
                    </label>
                    <select
                      value={selectedEntrepriseId || ''}
                      onChange={(e) => setSelectedEntrepriseId(e.target.value ? parseInt(e.target.value) : null)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="">Toutes les entreprises</option>
                      {entreprises.map((entreprise) => (
                        <option key={entreprise.id} value={entreprise.id}>
                          {entreprise.nom_entreprise}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Bouton export */}
                  <div className="flex items-end space-x-2">
                    <button
                      onClick={exportToExcel}
                      className="p-2 text-white bg-green-600 border border-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                      title="Exporter les données"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Réinitialiser les filtres */}
              {(selectedExerciceId || selectedEntrepriseId) && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => {
                      setSelectedExerciceId(null);
                      setSelectedEntrepriseId(null);
                    }}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Indicateur de chargement */}
          {isLoading && (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {/* Message d'erreur */}
          {error && !isLoading && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              <p className="font-medium">Erreur</p>
              <p>{error}</p>
              <button
                onClick={fetchIndicateursData}
                className="mt-2 bg-red-200 hover:bg-red-300 text-red-800 px-3 py-1 rounded text-sm"
              >
                Réessayer
              </button>
            </div>
          )}

          {/* Message d'absence de données */}
          {!isLoading && !error && noData && (
            <NoDataMessage />
          )}

          {/* Corps principal - sélection de catégorie et visualisations */}
          {!isLoading && !error && !noData && (
            <div className="space-y-6">
              {/* Sélection de catégorie */}
              {categoriesDisponibles.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                  <h3 className="font-medium mb-2 text-gray-700">Catégorie d'indicateurs:</h3>
                  <div className="flex flex-wrap gap-2">
                    {categoriesDisponibles.map(categorie => (
                      <button
                        key={categorie}
                        className={`px-3 py-2 rounded-md text-sm ${
                          selectedCategorie === categorie
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        onClick={() => setSelectedCategorie(categorie)}
                      >
                        {categorie.length > 30 ? categorie.substring(0, 30) + '...' : categorie}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Visualisation des données */}
              {selectedCategorie && indicateursActifs.length > 0 && (
                <>
                  {/* Contrôles de graphique */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                    <h3 className="font-medium mb-2 text-gray-700">Type de graphique:</h3>
                    <div className="flex flex-wrap gap-2">
                      <button
                        className={`px-3 py-2 rounded-md text-sm ${
                          chartType === 'bar'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        onClick={() => setChartType('bar')}
                      >
                        Barres
                      </button>
                      <button
                        className={`px-3 py-2 rounded-md text-sm ${
                          chartType === 'line'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        onClick={() => setChartType('line')}
                      >
                        Ligne
                      </button>
                      <button
                        className={`px-3 py-2 rounded-md text-sm ${
                          chartType === 'pie'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        onClick={() => setChartType('pie')}
                      >
                        Camembert
                      </button>
                    </div>
                  </div>

                  {/* Graphique */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                    <h3 className="font-medium mb-4 text-gray-700">Visualisation: {selectedCategorie}</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        {renderChart()}
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Tableau des données */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                    <h3 className="font-medium mb-4 text-gray-700">Détail des indicateurs</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Libellé
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Valeur
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Valeur cible
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Écart
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                          {indicateursActifs.map((ind) => {
                            const ecart = ind.value - ind.target;
                            const ecartClass = ecart >= 0 ? "text-green-600" : "text-red-600";
                            const ecartPercentage = ind.target !== 0 ? ((ecart / ind.target) * 100).toFixed(2) : 'N/A';

                            return (
                              <tr key={ind.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {ind.label}
                                    {ind.is_calculated && (
                                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                        Calculé
                                      </span>
                                    )}
                                    {ind.metadata?.demo && (
                                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                        Démo
                                      </span>
                                    )}
                                  </div>
                                  {ind.definition && (
                                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                      {ind.definition.substring(0, 60)}...
                                    </div>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                  {ind.value.toLocaleString()} {ind.unite}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                  {ind.target.toLocaleString()} {ind.unite}
                                </td>
                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${ecartClass}`}>
                                  {ecart.toLocaleString()} {ind.unite} ({ecartPercentage}%)
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                                  <button
                                    onClick={() => viewIndicateurDetails(ind)}
                                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                    title="Voir les détails"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default AnalyseIntegree;
