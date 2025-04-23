// components/Analyse/RapportComparatif.tsx
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartData } from 'chart.js';
import DataService from '../../Utils/services/services/DataService';
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface RapportComparatifProps {
  exerciceId: string;
  periodeId?: string;
  indicateurs: { id: string; nom: string; couleur: string }[];
  groupBy: 'regions' | 'provinces' | 'communes' | 'secteur_activite' | 'genre';
  titre: string;
}

const RapportComparatif = ({ exerciceId, periodeId, indicateurs, groupBy, titre }: RapportComparatifProps) => {
  const [donnees, setDonnees] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const params = {
          exercice_id: exerciceId,
          periode_id: periodeId || null,
          indicateurs: indicateurs.map(ind => ind.id),
          group_by: groupBy
        };

        const response = await DataService.getComparativeData(params);
        setDonnees(response.donnees || {});
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setError('Impossible de charger les données comparatives');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [exerciceId, periodeId, indicateurs, groupBy]);

  // Préparer les données pour le graphique
  const labels = Object.keys(donnees);

  const chartData: ChartData<'bar'> = {
    labels,
    datasets: indicateurs.map(indicateur => ({
      label: indicateur.nom,
      data: labels.map(label => donnees[label]?.indicateurs[indicateur.id] || 0),
      backgroundColor: indicateur.couleur,
    }))
  };

  // Options du graphique
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: titre
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
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
    <div className="bg-white p-5 rounded-lg shadow">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default RapportComparatif;
