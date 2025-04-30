import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Indicateur } from '../Types/indicateurs';

interface IndicateursChartProps {
  indicateurs: Indicateur[];
  type?: 'bar' | 'line' | 'pie';
  height?: number;
  showTarget?: boolean;
  title?: string;
  categorie?: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

/**
 * Composant pour générer différents types de graphiques à partir des indicateurs
 */
const IndicateursChart: React.FC<IndicateursChartProps> = ({
  indicateurs,
  type = 'bar',
  height = 300,
  showTarget = true,
  title,
  categorie
}) => {
  const [chartData, setChartData] = useState<any[]>([]);

  // Préparation des données pour le graphique
  useEffect(() => {
    if (!indicateurs || indicateurs.length === 0) return;

    // Filtrer par catégorie si spécifiée
    const filteredIndicateurs = categorie
      ? indicateurs.filter(ind => ind.categorie === categorie)
      : indicateurs;

    // Préparer les données pour le graphique
    const formattedData = filteredIndicateurs.map(ind => ({
      name: ind.libelle,
      valeur: Number(ind.valeur) || 0,
      valeurCible: showTarget ? (Number(ind.valeur_cible) || 0) : undefined,
      fill: COLORS[Math.floor(Math.random() * COLORS.length)]
    }));

    setChartData(formattedData);
  }, [indicateurs, categorie, showTarget]);

  // Rendre le graphique en fonction du type spécifié
  const renderChart = () => {
    if (chartData.length === 0) {
      return <div className="flex justify-center items-center h-full text-gray-500">Aucune donnée disponible</div>;
    }

    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" height={60} tick={{ fontSize: 12 }} tickLine={false} angle={-45} textAnchor="end" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="valeur"
                name="Valeur actuelle"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
                isAnimationActive={true}
              />
              {showTarget && (
                <Line
                  type="monotone"
                  dataKey="valeurCible"
                  name="Valeur cible"
                  stroke="#82ca9d"
                  strokeDasharray="5 5"
                  isAnimationActive={true}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={80}
                fill="#8884d8"
                dataKey="valeur"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                isAnimationActive={true}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}`, 'Valeur']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'bar':
      default:
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 70 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" height={60} tick={{ fontSize: 12 }} tickLine={false} angle={-45} textAnchor="end" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="valeur" name="Valeur actuelle" fill="#8884d8" isAnimationActive={true} />
              {showTarget && (
                <Bar dataKey="valeurCible" name="Valeur cible" fill="#82ca9d" isAnimationActive={true} />
              )}
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      {title && (
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">{title}</h3>
      )}
      <div className="w-full" style={{ height: `${height}px` }}>
        {renderChart()}
      </div>
    </div>
  );
};

export default IndicateursChart;
