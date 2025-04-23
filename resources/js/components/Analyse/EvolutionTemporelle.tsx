import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DataService from '@/Utils/services/services/DataService';

interface EvolutionTemporelleProps {
  exerciceId: string;
  indicateurId: string;
  titre: string;
  filtre?: {
    secteur_activite?: string;
  };
}

export default function EvolutionTemporelle({ exerciceId, indicateurId, titre, filtre = {} }: EvolutionTemporelleProps) {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Créer un objet de paramètres nettoyé - n'utiliser que les colonnes qui existent
        const params = {
          exercice_id: exerciceId,
          indicateur_id: indicateurId
        };

        // N'ajouter le filtre secteur_activite que s'il est défini et non 'all' ou 'undefined'
        if (filtre?.secteur_activite &&
            filtre.secteur_activite !== 'all' &&
            filtre.secteur_activite !== 'undefined') {
          params.secteur_activite = filtre.secteur_activite;
        }

        const response = await DataService.getTimeSeriesData(params);

        if (response && response.success) {
          setData(response.donnees || []);
        } else {
          setError(response.error || 'Impossible de charger les données d\'évolution');
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données d\'évolution:', error);
        setError('Une erreur est survenue lors du chargement des données');
      } finally {
        setIsLoading(false);
      }
    };

    if (exerciceId && indicateurId) {
      fetchData();
    }
  }, [exerciceId, indicateurId, filtre]);

  if (isLoading) {
    return <div className="h-64 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (error) {
    return <div className="bg-red-50 p-4 rounded-lg">
      <p className="text-sm text-red-600">{error}</p>
    </div>;
  }

  if (!data || data.length === 0) {
    return <div className="bg-yellow-50 p-4 rounded-lg">
      <p className="text-sm text-yellow-600">Aucune donnée disponible pour cet indicateur.</p>
    </div>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">{titre}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="periode" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="valeur"
              stroke="#3B82F6"
              activeDot={{ r: 8 }}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 text-xs text-gray-500 text-right">
        Nombre d'entrées: {data.reduce((sum, item) => sum + (item.count || 0), 0)}
      </div>
    </div>
  );
}
