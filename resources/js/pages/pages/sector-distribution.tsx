import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Graphique from '../graphique ';

interface SectorDistributionProps {
  data: Array<{
    name: string;
    value: number;
  }>;
}

export default function SectorDistribution({ data }: SectorDistributionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Distribution par secteur</CardTitle>
      </CardHeader>
      <CardContent>
        {data && data.length > 0 ? (
          <Graphique
            data={data}
            type="pie"
            title="Secteurs d'activité"
          />
        ) : (
          <div className="text-center text-gray-500 py-10">Aucune donnée disponible</div>
        )}
      </CardContent>
    </Card>
  );
}
