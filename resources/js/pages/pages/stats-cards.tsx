import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface StatsCardsProps {
  totalEntreprises: number;
  totalBeneficiaires: number;
  totalCollectes: number;
}

export default function StatsCards({
  totalEntreprises,
  totalBeneficiaires,
  totalCollectes
}: StatsCardsProps) {
  return (
    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">
            Entreprises
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totalEntreprises}</div>
          <p className="text-sm text-gray-500">Total des entreprises</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">
            Promoteurs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totalBeneficiaires}</div>
          <p className="text-sm text-gray-500">Total des bénéficiaires</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">
            Collectes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totalCollectes}</div>
          <p className="text-sm text-gray-500">Total des collectes</p>
        </CardContent>
      </Card>
    </div>
  );
}
