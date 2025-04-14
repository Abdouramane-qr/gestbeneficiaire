import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface IndicatorSummaryProps {
  indicatorSummary: Array<{
    period: string;
    category: string;
    count: number;
  }>;
}

export default function IndicatorSummary({ indicatorSummary }: IndicatorSummaryProps) {
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    // Vérifier si les données sont disponibles
    console.log('IndicatorSummary received:', indicatorSummary);
    setHasData(Array.isArray(indicatorSummary) && indicatorSummary.length > 0);
  }, [indicatorSummary]);

  if (!hasData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Résumé des Indicateurs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-gray-500">
            Aucune donnée disponible pour les indicateurs
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Résumé des Indicateurs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-4 text-left">Période</th>
                <th className="py-2 px-4 text-left">Catégorie</th>
                <th className="py-2 px-4 text-right">Nombre</th>
              </tr>
            </thead>
            <tbody>
              {indicatorSummary.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{item.period || 'Non spécifié'}</td>
                  <td className="py-2 px-4">{item.category || 'Non spécifié'}</td>
                  <td className="py-2 px-4 text-right">{item.count || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
