// import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
// import { Entreprise, Exercice, Periode } from '@/types/collecte';

// interface EntiteTabsProps {
//     entreprises: Entreprise[];
//     exercices: Exercice[];
//     periodes: Periode[];
//     selectedEntreprise: Entreprise | null;
//     selectedExercice: Exercice | null;
//     selectedPeriode: Periode | null;
//     dateCollecte: string;
//     onEntrepriseChange: (entrepriseId: string) => void;
//     onExerciceChange: (exerciceId: string) => void;
//     onPeriodeChange: (periodeId: string) => void;
//     onDateCollecteChange: (date: string) => void;
//     onNext: () => void;
//     onPrev: () => void;
//     currentTab: string;
//     isEditing?: boolean;
// }

// export function EntiteTabs({
//     entreprises,
//     exercices,
//     periodes,
//     selectedEntreprise,
//     selectedExercice,
//     selectedPeriode,
//     dateCollecte,
//     onEntrepriseChange,
//     onExerciceChange,
//     onPeriodeChange,
//     onDateCollecteChange,
//     onNext,
//     onPrev,
//     currentTab,
//     isEditing = false
// }: EntiteTabsProps) {
//     return (
//         <Tabs value={currentTab} className="w-full">
//             <TabsList className="grid w-full grid-cols-4">
//                 <TabsTrigger value="entreprise">Entreprise</TabsTrigger>
//                 <TabsTrigger value="exercice" disabled={!selectedEntreprise}>
//                     Exercice
//                 </TabsTrigger>
//                 <TabsTrigger value="periode" disabled={!selectedExercice}>
//                     Période
//                 </TabsTrigger>
//                 <TabsTrigger value="donnees" disabled={!selectedPeriode}>
//                     Données
//                 </TabsTrigger>
//             </TabsList>

//             <TabsContent value="entreprise">
//                 <div className="space-y-4 mt-4">
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700">
//                             Sélectionner une entreprise
//                         </label>
//                         <select
//                             className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//                             value={selectedEntreprise?.id.toString() || ''}
//                             onChange={(e) => onEntrepriseChange(e.target.value)}
//                             disabled={isEditing}
//                         >
//                             <option value="">Sélectionner...</option>
//                             {entreprises.map((entreprise) => (
//                                 <option key={entreprise.id} value={entreprise.id.toString()}>
//                                     {entreprise.nom_entreprise}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>
//                     <div className="flex justify-end">
//                         <button
//                             type="button"
//                             className="px-4 py-2 bg-blue-600 text-white rounded-md"
//                             onClick={onNext}
//                             disabled={!selectedEntreprise}
//                         >
//                             Suivant
//                         </button>
//                     </div>
//                 </div>
//             </TabsContent>

//             <TabsContent value="exercice">
//                 <div className="space-y-4 mt-4">
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700">
//                             Sélectionner un exercice
//                         </label>
//                         <select
//                             className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//                             value={selectedExercice?.id.toString() || ''}
//                             onChange={(e) => onExerciceChange(e.target.value)}
//                             disabled={isEditing}
//                         >
//                             <option value="">Sélectionner...</option>
//                             {exercices.map((exercice) => (
//                                 <option key={exercice.id} value={exercice.id.toString()}>
//                                     {exercice.annee}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>
//                     <div className="flex justify-between">
//                         <button
//                             type="button"
//                             className="px-4 py-2 bg-gray-600 text-white rounded-md"
//                             onClick={onPrev}
//                         >
//                             Précédent
//                         </button>
//                         <button
//                             type="button"
//                             className="px-4 py-2 bg-blue-600 text-white rounded-md"
//                             onClick={onNext}
//                             disabled={!selectedExercice}
//                         >
//                             Suivant
//                         </button>
//                     </div>
//                 </div>
//             </TabsContent>

//             <TabsContent value="periode">
//                 <div className="space-y-4 mt-4">
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700">
//                             Sélectionner une période
//                         </label>
//                         <select
//                             className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//                             value={selectedPeriode?.id.toString() || ''}
//                             onChange={(e) => onPeriodeChange(e.target.value)}
//                             disabled={isEditing}
//                         >
//                             <option value="">Sélectionner...</option>
//                             {periodes
//                                 .filter(p => p.exercice_id === selectedExercice?.id)
//                                 .map((periode) => (
//                                     <option key={periode.id} value={periode.id.toString()}>
//                                         {periode.nom} ({periode.date_debut} - {periode.date_fin})
//                                     </option>
//                                 ))}
//                         </select>
//                     </div>
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700">
//                             Date de collecte
//                         </label>
//                         <input
//                             type="date"
//                             className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//                             value={dateCollecte}
//                             onChange={(e) => onDateCollecteChange(e.target.value)}
//                         />
//                     </div>
//                     <div className="flex justify-between">
//                         <button
//                             type="button"
//                             className="px-4 py-2 bg-gray-600 text-white rounded-md"
//                             onClick={onPrev}
//                         >
//                             Précédent
//                         </button>
//                         <button
//                             type="button"
//                             className="px-4 py-2 bg-blue-600 text-white rounded-md"
//                             onClick={onNext}
//                             disabled={!selectedPeriode}
//                         >
//                             Suivant
//                         </button>
//                     </div>
//                 </div>
//             </TabsContent>
//         </Tabs>
//     );
// }
import React, { useState} from 'react';

import { toast } from 'sonner';
import IndicateursTabs from './IndicateurTabs';

interface Entreprise {
  id: number;
  nom_entreprise: string;
}

interface Periode {
  id: number;
  type_periode: string;
}

interface Exercice {
  id: number;
  annee: number;
  date_debut: string;
  date_fin: string;
  actif: boolean;
}

interface EntiteTabsProps {
  entreprises: Entreprise[];
  periodes: Periode[];
  exercices: Exercice[];
  initialData?: Record<string, any>;
}

const EntiteTabs: React.FC<EntiteTabsProps> = ({
  entreprises,
  periodes,
  exercices,
  initialData = {}
}) => {
  // États pour les sélections
  const [selectedEntreprise, setSelectedEntreprise] = useState<number | null>(null);
  const [selectedPeriode, setSelectedPeriode] = useState<number | null>(null);
  const [selectedExercice, setSelectedExercice] = useState<number | null>(null);
  const [collecteDate, setCollecteDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // État pour afficher les indicateurs une fois les entités sélectionnées
  const [showIndicateurs, setShowIndicateurs] = useState<boolean>(false);

  // Validation des sélections
  const isSelectionComplete = () => {
    return selectedEntreprise !== null &&
           selectedPeriode !== null &&
           selectedExercice !== null &&
           collecteDate.trim() !== '';
  };

  // Gestionnaire pour passer à l'étape des indicateurs
  const handleContinue = () => {
    if (isSelectionComplete()) {
      setShowIndicateurs(true);
    } else {
      toast.error("Veuillez compléter toutes les sélections");
    }
  };

  // Gestionnaire pour revenir à la sélection des entités
  const handleBack = () => {
    setShowIndicateurs(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      {!showIndicateurs ? (
        <div>
          <div className="p-5 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              COLLECTE DES INDICATEURS D'ENTREPRISE
            </h2>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
                  Identification
                </h3>

                <div className="space-y-4">
                  {/* Sélection de l'entreprise */}
                  <div>
                    <label
                      htmlFor="entreprise"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Entreprise
                    </label>
                    <select
                      id="entreprise"
                      value={selectedEntreprise || ''}
                      onChange={(e) => setSelectedEntreprise(Number(e.target.value) || null)}
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="">Sélectionner une entreprise</option>
                      {entreprises.map((entreprise) => (
                        <option key={entreprise.id} value={entreprise.id}>
                          {entreprise.nom_entreprise}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sélection de la période */}
                  <div>
                    <label
                      htmlFor="periode"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Période de collecte
                    </label>
                    <select
                      id="periode"
                      value={selectedPeriode || ''}
                      onChange={(e) => setSelectedPeriode(Number(e.target.value) || null)}
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="">Sélectionner une période</option>
                      {periodes.map((periode) => (
                        <option key={periode.id} value={periode.id}>
                          {periode.type_periode}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sélection de l'exercice */}
                  <div>
                    <label
                      htmlFor="exercice"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Exercice
                    </label>
                    <select
                      id="exercice"
                      value={selectedExercice || ''}
                      onChange={(e) => setSelectedExercice(Number(e.target.value) || null)}
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="">Sélectionner un exercice</option>
                      {exercices.map((exercice) => (
                        <option key={exercice.id} value={exercice.id}>
                          {exercice.annee} ({exercice.actif ? 'Actif' : 'Inactif'})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date de collecte */}
                  <div>
                    <label
                      htmlFor="date_collecte"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Date de collecte
                    </label>
                    <input
                      type="date"
                      id="date_collecte"
                      value={collecteDate}
                      onChange={(e) => setCollecteDate(e.target.value)}
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleContinue}
                disabled={!isSelectionComplete()}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Continuer vers la saisie des indicateurs
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center p-5 border-b border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={handleBack}
              className="mr-3 p-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Saisie des indicateurs
            </h2>
          </div>

          {selectedEntreprise && selectedPeriode && selectedExercice && (
            <IndicateursTabs
              entrepriseId={selectedEntreprise}
              periodeId={selectedPeriode}
              exerciceId={selectedExercice}
              initialData={{
                ...initialData,
                date_collecte: collecteDate
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default EntiteTabs;
