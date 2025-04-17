
// import React from 'react';
// import { Head } from '@inertiajs/react';
// import AnalyseIndicateurs from './AnalyseIndicateurs';
// import AppLayout from '@/layouts/app-layout';

// interface Indicateur {
//     id: number;
//     nom: string;
//     categorie: string;
//     description: string;
// }

// interface Exercice {
//     id: number;
//     annee: number;
//     actif: boolean;
// }

// interface Periode {
//     id: number;
//     nom: string;
//     exercice_id: number;
// }

// interface Filtres {
//     regions: string[];
//     provinces: string[];
//     communes: string[];
//     typesBeneficiaires: string[];
//     genres: string[];
//     secteursActivite: string[];
//     handicaps?: string[];
//     niveauxInstruction?: string[];
//     descriptionsActivite?: string[];
//     niveauxDeveloppement?: string[];
// }

// interface AnalyseProps {
//     exerciceActif: Exercice;
//     exercices: Exercice[];
//     periodes: Periode[];
//     indicateurs: Indicateur[];
//     filtres: Filtres;
//     error?: string;
//     auth: {
//         user: {
//             id: number;
//             name: string;
//             email: string;
//         }
//     }
// }

// export default function Index({
//     exerciceActif,
//     exercices,
//     periodes,
//     indicateurs,
//     filtres,
//     error,
//     auth
// }: AnalyseProps) {
//     return (
//         <AppLayout
//             user={auth.user}
//             title="Analyse des Indicateurs" // Add this line
//         >
//             <Head title="Analyse des Indicateurs" />
//             <h2 className="font-semibold text-xl text-gray-800 leading-tight">Analyse des Indicateurs</h2>
//             {error ? (
//                 <div className="py-12">
//                     <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
//                         <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
//                             <div className="p-6 text-red-500">
//                                 {error}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             ) : (
//                 <AnalyseIndicateurs
//                     exerciceActif={exerciceActif}
//                     exercices={exercices}
//                     periodes={periodes}
//                     indicateurs={indicateurs}
//                     filtres={filtres}
//                 />
//             )}
//         </AppLayout>
//     );
// }
// import React from 'react';
// import { Head } from '@inertiajs/react';
// import AnalyseIndicateurs from './AnalyseIndicateurs';
// import AppLayout from '@/layouts/app-layout';

// interface Indicateur {
//     id: number;
//     nom: string;
//     categorie: string;
//     description: string;
// }

// interface Exercice {
//     id: number;
//     annee: number;
//     actif: boolean;
// }

// interface Periode {
//     id: number;
//     nom: string;
//     exercice_id: number;
// }

// interface Filtres {
//     regions: string[];
//     provinces: string[];
//     communes: string[];
//     typesBeneficiaires: string[];
//     genres: string[];
//     secteursActivite: string[];
//     handicaps: string[];
//     niveauxInstruction: string[];
//     descriptionsActivite: string[];
//     niveauxDeveloppement: string[];
// }

// interface AnalyseProps {
//     exerciceActif: Exercice;
//     exercices: Exercice[];
//     periodes: Periode[];
//     indicateurs: Indicateur[];
//     filtres: Filtres;
//     error?: string;
//     auth: {
//         user: {
//             id: number;
//             name: string;
//             email: string;
//         }
//     }
// }

// export default function Index({
//     exerciceActif,
//     exercices,
//     periodes,
//     indicateurs,
//     filtres,
//     error,
//     auth
// }: AnalyseProps) {
//     return (
//         <AppLayout
//             user={auth.user}
//             title="Analyse des Indicateurs"
//         >
//             <Head title="Analyse des Indicateurs" />
//             <h2 className="font-semibold text-xl text-gray-800 leading-tight">Analyse des Indicateurs</h2>
//             {error ? (
//                 <div className="py-12">
//                     <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
//                         <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
//                             <div className="p-6 text-red-500">
//                                 {error}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             ) : (
//                 <AnalyseIndicateurs
//                     exerciceActif={exerciceActif}
//                     exercices={exercices}
//                     periodes={periodes}
//                     indicateurs={indicateurs}
//                     filtres={filtres}
//                 />
//             )}
//         </AppLayout>
//     );
// }
import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import IndicateurCalculator, { IndicateurField, PeriodeName } from '@/Utils/IndicateurCalculator';
import AnalyseIndicateurs from './AnalyseIndicateurs';
import Dashboard from './dbs';

interface Indicateur {
    indicateur_id: number;
    valeur: number;
    entreprise_nom: string;
    entreprise_id: number;
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
    handicaps: string[];
    niveauxInstruction: string[];
    descriptionsActivite: string[];
    niveauxDeveloppement: string[];
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
    const [viewMode, setViewMode] = useState<'analyse' | 'dashboard'>('analyse');
    const [availablePeriodes] = useState<PeriodeName[]>(IndicateurCalculator.getAvailablePeriodes());
    const [availableCategories, setAvailableCategories] = useState<Record<PeriodeName, string[]>>({} as Record<PeriodeName, string[]>);
    const [availableIndicateurs, setAvailableIndicateurs] = useState<Record<PeriodeName, Record<string, IndicateurField[]>>>({} as Record<PeriodeName, Record<string, IndicateurField[]>>);

    // Charger les catégories et indicateurs disponibles
    useEffect(() => {
        const categories: Record<PeriodeName, string[]> = {} as Record<PeriodeName, string[]>;
        const indicateursMap: Record<PeriodeName, Record<string, IndicateurField[]>> = {} as Record<PeriodeName, Record<string, IndicateurField[]>>;

        availablePeriodes.forEach(periode => {
            categories[periode] = IndicateurCalculator.getCategoriesForPeriode(periode);
            indicateursMap[periode] = IndicateurCalculator.getIndicateursByPeriode(periode);
        });

        setAvailableCategories(categories);
        setAvailableIndicateurs(indicateursMap);
    }, [availablePeriodes]);

    return (
        <AppLayout
            user={auth.user}
            title="Analyse des Indicateurs"
        >
            <Head title="Analyse des Indicateurs" />

            {/* Tabs pour choisir entre Analyse et Dashboard */}
            <div className="border-b border-gray-200 mb-4">
                <nav className="-mb-px flex">
                    <button
                        onClick={() => setViewMode('analyse')}
                        className={`${
                            viewMode === 'analyse'
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm focus:outline-none`}
                    >
                        Analyse des Indicateurs
                    </button>
                    <button
                        onClick={() => setViewMode('dashboard')}
                        className={`${
                            viewMode === 'dashboard'
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm focus:outline-none`}
                    >
                        Tableau de Bord
                    </button>
                </nav>
            </div>

            {/* Afficher le message d'erreur si présent */}
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
                <>
                    {viewMode === 'analyse' ? (
                        <AnalyseIndicateurs
                            exerciceActif={exerciceActif}
                            exercices={exercices}
                            periodes={periodes}
                            indicateurs={indicateurs}
                            filtres={filtres}
                            availablePeriodes={availablePeriodes}
                            availableCategories={availableCategories}
                            availableIndicateurs={availableIndicateurs}
                        />
                    ) : (
                        <Dashboard
                            exerciceActif={exerciceActif}
                            exercices={exercices}
                            periodes={periodes}
                            filtres={filtres}
                            availablePeriodes={availablePeriodes}
                            availableCategories={availableCategories}
                        />
                    )}
                </>
            )}
        </AppLayout>
    );
}
