// resources/js/Pages/Indicateurs/Detail.tsx
import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import AppLayout from '@/layouts/app-layout';
// Composants d'interface utilisateur
import { PageProps } from '@/types';

// Icônes
import {
  ArrowLeft,
  Calendar,
  Info,
  BarChart2,
  TrendingUp,
  Activity,
  RefreshCw,
  FileSpreadsheet
} from 'lucide-react';

// Types
interface IndicateurDetail {
  id: string;
  label: string;
  unite: string;
  definition: string;
  evolution_data: Array<{
    date: string;
    value: number;
    entreprise: string;
    exercice: string;
    periode: string;
  }>;
}

interface Exercice {
  id: number;
  annee: number;
  date_debut: string;
  date_fin: string;
  actif: boolean;
}

interface DetailProps extends PageProps {
  indicateur: IndicateurDetail;
  exercices: Exercice[];
  periodeType: string;
  categorie: string;
  exerciceId?: number;
}

const Detail: React.FC<DetailProps> = ({
  auth,
  indicateur: initialIndicateur,
  exercices,
  periodeType,
  categorie,
  exerciceId
}) => {
  // États
  const [indicateur, setIndicateur] = useState<IndicateurDetail>(initialIndicateur);
  const [selectedExerciceId, setSelectedExerciceId] = useState<number | undefined>(exerciceId);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [error, setError] = useState<string | null>(null);

  // Calculer des statistiques sur les données
  const stats = React.useMemo(() => {
    const values = indicateur.evolution_data.map(d => d.value);
    if (values.length === 0) return { min: 0, max: 0, avg: 0, count: 0 };

    return {
      min: Math.min(...values),
      max: Math.max(...values),
      avg: values.reduce((sum, val) => sum + val, 0) / values.length,
      count: values.length
    };
  }, [indicateur.evolution_data]);

  // Formatter les données pour les graphiques (trier par date)
  const chartData = React.useMemo(() => {
    return [...indicateur.evolution_data].sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [indicateur.evolution_data]);

  // Fonction pour formater les nombres
  const formatNumber = (num: number): string => {
    if (typeof num !== 'number') return String(num);
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  // Effet pour charger les données de l'indicateur
  useEffect(() => {
    if (selectedExerciceId !== exerciceId) {
      fetchIndicateurData();
    }
  }, [selectedExerciceId]);

  // Fonction pour récupérer les données de l'indicateur
 // Correction de fetchIndicateurData dans Detail.tsx
const fetchIndicateurData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get('/api/indicateurs/evolution', {
        params: {
          indicateur_id: indicateur.id,
          categorie: categorie,
          periode_type: periodeType,
          exercice_id: selectedExerciceId
        },
        headers: {
          // Indique explicitement que nous attendons une réponse JSON
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      if (response.data.success) {
        setIndicateur(response.data.data);
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

  // Fonction pour exporter les données au format Excel
  const exportToExcel = () => {
    const params = new URLSearchParams({
      indicateur_id: indicateur.id,
      categorie: categorie,
      periode_type: periodeType
    });

    if (selectedExerciceId) {
      params.append('exercice_id', selectedExerciceId.toString());
    }

    window.location.href = `/api/indicateurs/export-excel/indicateur?${params.toString()}`;
  };

  return (
    <AppLayout
      title={`Indicateur - ${indicateur.label}`}
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">Détail de l'Indicateur</h2>
          <Link
            href={route('indicateurs.analyse', {
              periode_type: periodeType,
              exercice_id: selectedExerciceId
            })}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={16} />
            <span>Retour au tableau de bord</span>
          </Link>
        </div>
      }
    >
      <Head title={`Indicateur - ${indicateur.label}`} />

      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Carte principale d'information */}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{indicateur.label}</h1>

                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <Calendar size={16} className="mr-2" />
                    <span>Période: {periodeType}</span>
                  </div>

                  {indicateur.unite && (
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <Activity size={16} className="mr-2" />
                      <span>Unité: {indicateur.unite}</span>
                    </div>
                  )}

                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <Info size={16} className="mr-2" />
                    <span>Définition: {indicateur.definition}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={fetchIndicateurData}
                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-md text-sm"
                    disabled={isLoading}
                  >
                    <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                    <span>Actualiser</span>
                  </button>

                  <button
                    onClick={exportToExcel}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm"
                  >
                    <FileSpreadsheet size={16} />
                    <span>Exporter Excel</span>
                  </button>
                </div>
              </div>

              {/* Filtres */}
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <div className="flex flex-wrap gap-4 items-center">
                  {/* Sélecteur d'exercice */}
                  <div className="w-full md:w-auto">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Exercice
                    </label>
                    <select
                      value={selectedExerciceId}
                      onChange={(e) => setSelectedExerciceId(e.target.value ? parseInt(e.target.value) : undefined)}
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

                  {/* Sélecteur de type de graphique */}
                  <div className="w-full md:w-auto">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type de graphique
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setChartType('line')}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
                          chartType === 'line'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <TrendingUp size={16} />
                        <span>Ligne</span>
                      </button>
                      <button
                        onClick={() => setChartType('bar')}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
                          chartType === 'bar'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <BarChart2 size={16} />
                        <span>Barres</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-sm font-medium text-gray-500 mb-1">Nombre de points</h2>
                <p className="text-2xl font-bold">{stats.count}</p>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-sm font-medium text-gray-500 mb-1">Valeur moyenne</h2>
                <p className="text-2xl font-bold">
                  {formatNumber(Math.round(stats.avg * 100) / 100)}
                  {indicateur.unite && <span className="text-sm ml-1">{indicateur.unite}</span>}
                </p>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-sm font-medium text-gray-500 mb-1">Valeur minimum</h2>
                <p className="text-2xl font-bold">
                  {formatNumber(stats.min)}
                  {indicateur.unite && <span className="text-sm ml-1">{indicateur.unite}</span>}
                </p>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-sm font-medium text-gray-500 mb-1">Valeur maximum</h2>
                <p className="text-2xl font-bold">
                  {formatNumber(stats.max)}
                  {indicateur.unite && <span className="text-sm ml-1">{indicateur.unite}</span>}
                </p>
              </div>
            </div>
          </div>

          {/* Graphique principal */}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Évolution de l'indicateur</h2>

              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : error ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  <p className="font-medium">Erreur</p>
                  <p>{error}</p>
                </div>
              ) : chartData.length === 0 ? (
                <div className="flex items-center justify-center h-64 bg-gray-50 rounded">
                  <p className="text-gray-500">Aucune donnée disponible pour cet indicateur</p>
                </div>
              ) : (
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === 'line' ? (
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="date"
                          tickFormatter={(date) => new Date(date).toLocaleDateString()}
                        />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => [formatNumber(value as number), indicateur.label]}
                          labelFormatter={(date) => new Date(date as string).toLocaleDateString()}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="value"
                          name={indicateur.label}
                          stroke="#3498db"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    ) : (
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="date"
                          tickFormatter={(date) => new Date(date).toLocaleDateString()}
                        />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => [formatNumber(value as number), indicateur.label]}
                          labelFormatter={(date) => new Date(date as string).toLocaleDateString()}
                        />
                        <Legend />
                        <Bar
                          dataKey="value"
                          name={indicateur.label}
                          fill="#3498db"
                        />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          {/* Tableau des données */}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Détail des valeurs</h2>

              {chartData.length === 0 ? (
                <div className="p-4 bg-gray-50 rounded text-center text-gray-500">
                  Aucune donnée disponible pour cet indicateur
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Valeur
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Entreprise
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Exercice
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Période
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {chartData.map((point, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(point.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {formatNumber(point.value)} {indicateur.unite}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {point.entreprise}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {point.exercice}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {point.periode}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Detail;
