import { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DashboardProps } from '@/types/dasb';
import CollectionData from './collection-data';
import EvolutionChart from './evolution-chart';
import RegionalStats from './regional-stats';
import SectorDistribution from './sector-distribution';
import StatsCards from './stats-cards';
import { AlertCircle, CheckCircle, Info } from 'lucide-react'; // Importez les icônes si nécessaire
import { toast, Toaster } from 'sonner';

// Types des props de la page incluant les messages flash
interface PageProps {
  flash: {
    error?: string;
    success?: string;
    message?: string;
    warning?: string;
  };
}

export default function Dashboard({
  totalEntreprises = 0,
  totalBeneficiaires = 0,
  totalCollectes = 0,
  entreprisesParMois = [],
  entreprisesParSecteur = [],
  beneficiairesParRegion = [],
  collectesStats = [],
  collectesParCategorie = [],
}: DashboardProps) {
  const [timeRange, setTimeRange] = useState('month');

  // Récupérer les messages flash depuis les props Inertia
  const { flash } = usePage().props as unknown as PageProps;

  // Afficher les messages flash lorsqu'ils sont présents
  useEffect(() => {
    if (flash.error) {
      toast.error(flash.error, {
        duration: 5000,
        icon: <AlertCircle className="h-5 w-5 text-red-500" />
      });
    }
    if (flash.success) {
      toast.success(flash.success, {
        duration: 4000,
        icon: <CheckCircle className="h-5 w-5 text-green-500" />
      });
    }
    if (flash.message) {
      toast.info(flash.message, {
        duration: 4000,
        icon: <Info className="h-5 w-5 text-blue-500" />
      });
    }
    if (flash.warning) {
      toast(
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          <span>{flash.warning}</span>
        </div>
      , { duration: 4000 });
    }
  }, [flash]);

  return (
    <AppLayout title='Tableau de Board'>
      <Head title="Tableau de bord" />

      {/* Toaster pour afficher les notifications */}
      <Toaster position="top-right" />

      <div className="flex h-full flex-1 flex-col gap-4 p-4">
        {/* En-tête avec filtres */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <h1 className="text-2xl font-bold">Tableau de bord JEM II OIM</h1>
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Semaine</SelectItem>
                <SelectItem value="month">Mois</SelectItem>
                <SelectItem value="quarter">Trimestre</SelectItem>
                <SelectItem value="year">Année</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Composants séparés */}
        <StatsCards
          totalEntreprises={totalEntreprises}
          totalBeneficiaires={totalBeneficiaires}
          totalCollectes={totalCollectes}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <EvolutionChart data={entreprisesParMois} />
          <SectorDistribution data={entreprisesParSecteur} />
        </div>

        <CollectionData
          collectesStats={collectesStats}
          collectesParCategorie={collectesParCategorie}
        />

        <RegionalStats data={beneficiairesParRegion} />
      </div>
    </AppLayout>
  );
}
