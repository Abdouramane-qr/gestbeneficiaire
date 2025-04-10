import React from 'react';
import { Head } from '@inertiajs/react';
import CollecteForm from './CollecteForm';
import { PageProps} from '@/types';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Entreprise, Exercice, Periode } from '@/types/index';

interface CreateProps extends PageProps {
    entreprises: Entreprise[];
    exercices: Exercice[];
    periodes: Periode[];
}

const Create: React.FC<CreateProps> = ({
    entreprises,
    exercices,
    periodes,
    //auth
}) => {
    return (
        <AuthenticatedLayout title="Nouvelle collecte">
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
        </AuthenticatedLayout>
    );
};

export default Create;
