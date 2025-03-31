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

// Types pour les différents graphiques
type LineChartDataPoint = {
  name: string;
  [key: string]: string | number;
};

type PieChartDataPoint = {
  name: string;
  value: number;
};

interface GraphiqueProps {
  data: LineChartDataPoint[] | PieChartDataPoint[];
  title?: string;
  type?: 'line' | 'bar' | 'pie';
  dataKeys?: string[];
  colors?: string[];
}

const Graphique: React.FC<GraphiqueProps> = ({
  data,
  title,
  type = 'line',
  dataKeys = ['value'],
  colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c']
}) => {
  // Rendre le graphique en fonction du type spécifié
  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={data as LineChartDataPoint[]}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)'
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
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data as LineChartDataPoint[]}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)'
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
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data as PieChartDataPoint[]}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {(data as PieChartDataPoint[]).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return <div>Type de graphique non supporté</div>;
    }
  };

  return (
    <div className="w-full h-full p-4 bg-background dark:bg-background-dark rounded-lg">
      {/* Titre du graphique */}
      {title && (
        <h3 className="text-lg font-semibold text-center text-gray-800 dark:text-gray-200 mb-4">
          {title}
        </h3>
      )}

      {/* Rendu du graphique selon le type */}
      {renderChart()}
    </div>
  );
};

export default Graphique;
