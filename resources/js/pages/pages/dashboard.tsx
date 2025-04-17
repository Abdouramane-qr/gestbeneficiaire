import { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DashboardProps } from '@/types/dasb';
import CollectionData from './collection-data';
import EvolutionChart from './evolution-chart';
import RegionalStats from './regional-stats';
import SectorDistribution from './sector-distribution';
import StatsCards from './stats-cards';

// Import des composants séparés
// types/dashboard.ts

// Types pour les statistiques de base
export interface StatsCardsProps {
    totalEntreprises: number;
    totalBeneficiaires: number;
    totalCollectes: number;
  }

  // Types pour l'évolution des entreprises par mois
  export interface EvolutionData {
    name: string;
    entreprises: number;
    beneficiaires: number;
  }

  // Types pour la distribution par secteur
  export interface SectorData {
    name: string;
    value: number;
  }

  // Types pour les statistiques régionales
  export interface RegionalData {
    region: string;
    total: number;
    entreprises: number;
  }

  // Types pour les données de collecte
  export interface CommercialData {
    prospects_total: number;
    clients_total: number;
    contrats_total: number;
  }

  export interface TresorerieData {
    montant_impayes: number;
    employes_total: number;
  }

  export interface CollecteData {
    periode: string;
    commercial: CommercialData;
    tresorerie: TresorerieData;
  }

  export interface CollecteStats {
    name: string;
    prospects: number;
    clients: number;
    contrats: number;
    employes: number;
  }

  // Types pour les indicateurs
  export interface IndicatorSummaryItem {
    period: string;
    category: string;
    count: number;
  }

  // Type principal pour les props du Dashboard


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

  return (
    <AppLayout title='Tableau de Board'>
      <Head title="Tableau de bord" />
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
