import React from 'react';
import { Head } from '@inertiajs/react';
import CollecteForm from './CollecteForm';

interface Entreprise {
  id: number;
  nom_entreprise: string;
}

interface Exercice {
  id: number;
  annee: number;
  date_debut: string;
  date_fin: string;
  actif: boolean;
}

interface Periode {
  id: number;
  type_periode: string;
}

interface CreateProps {
  entreprises: Entreprise[];
  exercices: Exercice[];
  periodes: Periode[];
  auth: any;
  errors: Record<string, string>;
  flash: Record<string, string>;
}

const Create: React.FC<CreateProps> = ({
  entreprises,
  exercices,
  periodes}) => {
  return (
    <>
      <Head title="Nouvelle collecte" />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">Nouvelle collecte d'indicateurs</h1>
          </div>

          <CollecteForm
            entreprises={entreprises}
            exercices={exercices}
            periodes={periodes}
            isEditing={false}
          />
        </div>
      </div>
    </>
  );
};

// Définition du layout

export default Create;
