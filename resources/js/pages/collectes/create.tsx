import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import CollecteForm from './CollecteForm';

const Create = ({ entreprises, exercices, periodes }) => {
  return (
    <AppLayout title="Nouvelle collecte">
      <Head title="Nouvelle collecte" />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">
              Nouvelle collecte d'indicateurs
            </h1>
          </div>

          <CollecteForm
            entreprises={entreprises}
            exercices={exercices}
            periodes={periodes}
            isEditing={false}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default Create;
