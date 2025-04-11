// resources/js/Pages/Analyse/Index.tsx

import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import AnalyseIndicateurs from './AnalyseIndicateurs';

interface Indicateur {
  id: number;
  nom: string;
  categorie: string;
  description: string;
}

interface Exercice {
  id: number;
  annee: number;
  actif: boolean;
}

interface Periode {
  id: number;
  nom: string;
  exercice_id: number;
}

interface Filtres {
  regions: string[];
  provinces: string[];
  communes: string[];
  typesBeneficiaires: string[];
  genres: string[];
  secteursActivite: string[];
}

interface AnalyseProps {
  exerciceActif: Exercice;
  exercices: Exercice[];
  periodes: Periode[];
  indicateurs: Indicateur[];
  filtres: Filtres;
  error?: string;
  auth: {
    user: {
      id: number;
      name: string;
      email: string;
    }
  }
}

export default function Index({
  exerciceActif,
  exercices,
  periodes,
  indicateurs,
  filtres,
  error,
  auth
}: AnalyseProps) {
  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Analyse des Indicateurs</h2>}
    >
      <Head title="Analyse des Indicateurs" />

      {error ? (
        <div className="py-12">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6 text-red-500">
                {error}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <AnalyseIndicateurs
          exerciceActif={exerciceActif}
          exercices={exercices}
          periodes={periodes}
          indicateurs={indicateurs}
          filtres={filtres}
        />
      )}
    </AuthenticatedLayout>
  );
}
