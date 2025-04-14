import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface RegionalStatsProps {
  data: Array<{
    region: string;
    total: number;
    entreprises: number;
  }>;
}

export default function RegionalStats({ data }: RegionalStatsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Statistiques régionales</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          {data && data.length > 0 ? (
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4 text-left">Région</th>
                  <th className="py-2 px-4 text-left">Promoteurs</th>
                  <th className="py-2 px-4 text-left">Entreprises</th>
                  <th className="py-2 px-4 text-left">Ratio</th>
                </tr>
              </thead>
              <tbody>
                {data.map((region) => (
                  <tr key={region.region} className="border-b">
                    <td className="py-2 px-4">{region.region}</td>
                    <td className="py-2 px-4">{region.total}</td>
                    <td className="py-2 px-4">{region.entreprises}</td>
                    <td className="py-2 px-4">
                      {region.total > 0 ? ((region.entreprises / region.total) * 100).toFixed(1) + '%' : '0%'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center text-gray-500 py-10">Aucune donnée disponible</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
