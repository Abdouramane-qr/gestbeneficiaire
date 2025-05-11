import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Graphique from '../graphique ';

interface EvolutionChartProps {
  data: Array<{
    name: string;
    entreprises: number;
    beneficiaires: number;
  }>;
}

export default function EvolutionChart({ data }: EvolutionChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Évolution mensuelle</CardTitle>
      </CardHeader>
      <CardContent>
        {data && data.length > 0 ? (
          <Graphique
            data={data}
            type="line"
            dataKeys={['entreprises', 'beneficiaires']}
            colors={['#0088FE', '#00C49F']}
            title="Entreprises et Promoteurs"
          />
        ) : (
          <div className="text-center text-gray-500 py-10">Aucune donnée disponible</div>
        )}
      </CardContent>
    </Card>
  );
}
