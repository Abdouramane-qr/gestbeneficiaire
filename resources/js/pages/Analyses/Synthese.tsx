import React, { useState,  } from 'react';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import AppLayout from '@/layouts/app-layout';
import TableauSynthese from '@/components/Analyse/TableauSynthese';
import RapportSynthetique from '@/components/Analyse/RapportSynthetique';
interface SyntheseProps extends PageProps {
  exerciceActif: {
    id: number;
    annee: number;
    date_debut: string;
    date_fin: string;
    actif: boolean;
  };
  periodes: Array<{
    id: number;
    nom: string;
    exercice_id: number;
  }>;
  indicateurs: Array<{
    id: number;
    indicateur_id: number;
    nom: string;
    valeur: number;
    categorie: string;
    region?: string;
    province?: string;
    commune?: string;
    secteur_activite?: string;
    typeBeneficiaire?: string;
    genre?: string;
    tendance?: 'hausse' | 'baisse' | 'stable';
    entreprise_id: number;
    entreprise_nom: string;
    exercice_id: number;
    periode_id: number;
  }>;
  error?: string;
}

export default function Synthese({  exerciceActif, periodes, indicateurs, error }: SyntheseProps) {
  // États locaux
  const [activeTab, setActiveTab] = useState<'tableau' | 'rapport'>('tableau');
  const [filtres, setFiltres] = useState({
    region: 'all',
    province: 'all',
    commune: 'all',
    secteur_activite: 'all',
    type_beneficiaire: 'all',
    genre: 'all'
  });

  const handleFiltrageChange = (nouveauxFiltres: React.SetStateAction<{ region: string; province: string; commune: string; secteur_activite: string; type_beneficiaire: string; genre: string; }>) => {
    setFiltres({ ...filtres, ...nouveauxFiltres });
  };

  return (
    <AppLayout title='Synthese'
      //user={auth.user}
      header={
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">
            Synthèse des indicateurs
          </h2>

          <div className="flex items-center space-x-4">
            <div className="flex rounded-md shadow-sm">
              <button
                type="button"
                className={`relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                  activeTab === 'tableau'
                  ? 'bg-blue-50 text-blue-700 border-blue-300 z-10'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('tableau')}
              >
                Tableau de bord
              </button>
              <button
                type="button"
                className={`relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                  activeTab === 'rapport'
                  ? 'bg-blue-50 text-blue-700 border-blue-300 z-10'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('rapport')}
              >
                Rapport synthétique
              </button>
            </div>
          </div>
        </div>
      }
    >
      <Head title="Synthèse des indicateurs" />

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {error ? (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-9v4a1 1 0 11-2 0v-4a1 1 0 112 0zm-1-5a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {activeTab === 'tableau' && (
                <TableauSynthese
                  indicateurs={indicateurs}
                  filtres={filtres}
                  onFiltrageChange={handleFiltrageChange}
                />
              )}

              {activeTab === 'rapport' && (
                <RapportSynthetique
                  exerciceActif={exerciceActif}
                  periodes={periodes}
                  indicateurs={indicateurs}
                />
              )}
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
