import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Types pour les données
export type ChartDataPoint = {
  name: string;
  [key: string]: string | number;
};

export type PieChartDataPoint = {
  name: string;
  value: number;
};

interface GraphiqueProps {
  data: Array<ChartDataPoint | PieChartDataPoint>;
  title?: string;
  type?: 'line' | 'bar' | 'pie';
  dataKeys?: string[];
  colors?: string[];
  height?: number;
  showGrid?: boolean;
}

const DEFAULT_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Graphique: React.FC<GraphiqueProps> = ({
  data,
  title,
  type = 'line',
  dataKeys = ['value'],
  colors = DEFAULT_COLORS,
  height = 300,
  showGrid = true,
}) => {
  if (!data || data.length === 0) {
    return <div className="text-center text-gray-500">Aucune donnée disponible</div>;
  }

  // Transformation des données Entreprise en ChartDataPoint si nécessaire
  const transformedData = data.map(item => {
    // Si c'est déjà un objet avec name et value/autres propriétés, le retourner tel quel
    if ('name' in item) return item;

    // Sinon, le transformer en format compatible avec le graphique
    return {
      name: (item as any).nom_entreprise || (item as any).secteur_activite || 'Non spécifié',
      value: 1, // Pour le comptage
      // Ajouter d'autres propriétés si nécessaires
    };
  });

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart
              data={transformedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              {showGrid && <CartesianGrid strokeDasharray="3 3" opacity={0.2} />}
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                }}
              />
              <Legend />
              {dataKeys.map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[index % colors.length]}
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart
              data={transformedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              {showGrid && <CartesianGrid strokeDasharray="3 3" opacity={0.2} />}
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                }}
              />
              <Legend />
              {dataKeys.map((key, index) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={colors[index % colors.length]}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        {
          // S'assurer que chaque item a une propriété 'value'
          const pieData = transformedData.map(item => {
            if ('value' in item) return item;
            // Si l'élément n'a pas de valeur, utiliser 1 par défaut (pour le comptage)
            return { ...item, value: 1 };
          });

          return (
            <ResponsiveContainer width="100%" height={height}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[index % colors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          );
        }

      default:
        return <div>Type de graphique non supporté</div>;
    }
  };

  return (
    <div className="w-full h-full bg-white dark:bg-gray-800 rounded-lg">
      {title && (
        <h3 className="text-lg font-semibold text-center text-gray-800 dark:text-gray-200 mb-4 pt-4">
          {title}
        </h3>
      )}
      {renderChart()}
    </div>
  );
};

export default Graphique;
