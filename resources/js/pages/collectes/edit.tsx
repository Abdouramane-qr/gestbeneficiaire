// import React from 'react';
// import { Head, Link } from '@inertiajs/react';
// import { PageProps } from '@/types';
// import AppLayout from '@/layouts/app-layout';

// interface IndicateurField {
//   id: string;
//   label: string;
//   type: string;
//   required: boolean;
// }

// interface Collecte {
//   id: number;
//   entreprise: {
//     id: number;
//     nom_entreprise: string;
//   };
//   exercice: {
//     id: number;
//     annee: string;
//   };
//   periode: {
//     id: number;
//     nom: string;
//     date_debut: string;
//     date_fin: string;
//   };
//   indicateur: {
//     id: number;
//     nom: string;
//     categorie: string;
//     fields: IndicateurField[];
//   };
//   date_collecte: string;
//   donnees: Record<string, string>;
//   user?: {
//     id: number;
//     name: string;
//   };
// }

// interface ShowProps extends PageProps {
//   collecte: Collecte;
// }

// export default function Show({ collecte }: ShowProps) {
//   // Grouper les données par catégories
//   const categoriesMap: Record<string, string> = {
//     'financiers': 'Indicateurs Financiers',
//     'commerciaux': 'Indicateurs Commerciaux',
//     'production': 'Indicateurs de Production',
//     'rh': 'Ressources Humaines',
//     'tresorerie': 'Indicateurs de Trésorerie',
//     'developpement': 'Développement Personnel'
//   };

//   // Formatter la date
//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('fr-FR', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   return (
//     <>
//       <Head title={`Collecte #${collecte.id}`} />
//       <div className="py-12">
//         <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
//           <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
//             <div className="p-6 bg-white border-b border-gray-200">
//               <div className="flex justify-between items-center mb-6">
//                 <h1 className="text-2xl font-semibold">
//                   Détails de la collecte #{collecte.id}
//                 </h1>
//                 <div className="flex space-x-2">
//                   <Link
//                     href={route('collectes.edit', collecte.id)}
//                     className="px-4 py-2 bg-blue-600 text-white rounded-md"
//                   >
//                     Modifier
//                   </Link>
//                   <Link
//                     href={route('collectes.index')}
//                     className="px-4 py-2 bg-gray-600 text-white rounded-md"
//                   >
//                     Retour à la liste
//                   </Link>
//                 </div>
//               </div>

//               {/* Informations générales */}
//               <div className="bg-gray-50 p-4 rounded-md mb-6">
//                 <h2 className="text-lg font-medium mb-4">Informations générales</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-sm text-gray-500">Entreprise</p>
//                     <p className="font-medium">{collecte.entreprise.nom_entreprise}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500">Exercice</p>
//                     <p className="font-medium">{collecte.exercice.annee}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500">Période</p>
//                     <p className="font-medium">{collecte.periode.nom} ({formatDate(collecte.periode.date_debut)} - {formatDate(collecte.periode.date_fin)})</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500">Date de collecte</p>
//                     <p className="font-medium">{formatDate(collecte.date_collecte)}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500">Type d'indicateur</p>
//                     <p className="font-medium">{collecte.indicateur.nom} ({categoriesMap[collecte.indicateur.categorie] || collecte.indicateur.categorie})</p>
//                   </div>
//                   {collecte.user && (
//                     <div>
//                       <p className="text-sm text-gray-500">Collecté par</p>
//                       <p className="font-medium">{collecte.user.name}</p>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Données collectées */}
//               <div className="bg-gray-50 p-4 rounded-md">
//                 <h2 className="text-lg font-medium mb-4">Données collectées</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {collecte.indicateur.fields?.map((field) => {
//                     const value = collecte.donnees[field.id];
//                     return (
//                       <div key={field.id} className="border-b border-gray-200 pb-2">
//                         <p className="text-sm text-gray-500">{field.label}</p>
//                         <p className="font-medium">
//                           {value !== undefined && value !== ''
//                             ? `${value} ${field.id === 'ratio_endettement' ? '%' : field.type === 'number' ? 'FCFA' : ''}`
//                             : '-'}
//                         </p>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>

//               {/* Boutons d'actions supplémentaires */}
//               <div className="mt-6 flex justify-end">
//                 <Link
//                   href={route('collectes.index')}
//                   className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md mr-2"
//                 >
//                   Retour à la liste
//                 </Link>
//                 <Link
//                   href={route('collectes.edit', collecte.id)}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-md"
//                 >
//                   Modifier cette collecte
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// // Définition du layout
// Show.layout = (page: React.ReactNode) => <AppLayout children={page} />;
import React from 'react';
import { Head } from '@inertiajs/react';
import CollecteForm from './CollecteForm';
import AppLayout from '@/layouts/app-layout';

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
  exercice_id: number;
  date_debut: string;
  date_fin: string;
}

interface Collecte {
  id: number;
  entreprise_id: number;
  exercice_id: number;
  periode_id: number;
  date_collecte: string;
  donnees: Record<string, any>;
  type_collecte: 'standard' | 'brouillon';
  promoteur_id?: number;
  ong_id?: number;
}

interface EditProps {
  entreprises: Entreprise[];
  exercices: Exercice[];
  periodes: Periode[];
  collecte: Collecte;
  auth: any;
  errors: Record<string, string>;
  flash: Record<string, string>;
}

const Edit: React.FC<EditProps> = ({
  entreprises,
  exercices,
  periodes,
  collecte,

}) => {
    return (
        <AppLayout title={`Modifier la collecte #${collecte.id}`}>
          <Head title={`Modifier la collecte #${collecte.id}`} />
          <div className="py-12">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">
                  Modifier la collecte #{collecte.id}
                </h1>
              </div>

              <CollecteForm
                entreprises={entreprises}
                exercices={exercices}
                periodes={periodes}
                collecte={collecte}
                isEditing={true}
              />
            </div>
          </div>
        </AppLayout>

  );
};

export default Edit;
