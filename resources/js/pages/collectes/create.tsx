// import React from 'react';
// import { Head } from '@inertiajs/react';
// import AppLayout from '@/layouts/app-layout';
// import CollecteForm from './CollecteForm';

// interface CreateProps {
//   entreprises: any[];
//   exercices: any[];
//   periodes: any[];
// }

// const Create = ({ entreprises, exercices, periodes }: CreateProps) => {
//   return (
//     <AppLayout title="Nouvelle collecte">
//       <Head title="Nouvelle collecte" />
//       <div className="py-12">
//         <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center mb-6">
//             <h1 className="text-2xl font-semibold text-gray-800">
//               Nouvelle collecte d'indicateurs
//             </h1>
//           </div>

//           <CollecteForm
//             entreprises={entreprises}
//             exercices={exercices}
//             periodes={periodes}
//             isEditing={false}
//           />
//         </div>
//       </div>
//     </AppLayout>
//   );
// };

// export default Create;
import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import CollecteForm from './CollecteForm';
import { WifiOffIcon, WifiIcon } from 'lucide-react';
import { useOfflineStorage } from '@/hooks/useOfflineStorage';

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

interface CreateProps {
  entreprises: Entreprise[];
  exercices: Exercice[];
  periodes: Periode[];
  promoteurs?: any[];
  ong?: any;
  userType?: 'admin' | 'ong' | 'coach';
  collectes?: { periode_id: number }[];
}

const Create = ({
  entreprises,
  exercices,
  periodes,
  promoteurs = [],
  ong,
  userType = 'admin',
  collectes = []
}: CreateProps) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { pendingUploads, syncData, isInitialized } = useOfflineStorage();
  const [isSyncing, setIsSyncing] = useState(false);

  // Surveiller les changements de connectivité
  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  const handleSync = async () => {
    if (!isOnline) return;

    try {
      setIsSyncing(true);
      await syncData();
    } catch (error) {
      console.error('Erreur de synchronisation:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <AppLayout title="Nouvelle collecte">
      <Head title="Nouvelle collecte" />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Nouvelle collecte d'indicateurs
            </h1>

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {isOnline ? (
                  <span className="flex items-center text-green-600 dark:text-green-400 text-sm">
                    <WifiIcon className="w-4 h-4 mr-1" />
                    En ligne
                  </span>
                ) : (
                  <span className="flex items-center text-yellow-600 dark:text-yellow-400 text-sm">
                    <WifiOffIcon className="w-4 h-4 mr-1" />
                    Hors ligne
                  </span>
                )}
              </div>

              {pendingUploads > 0 && isOnline && (
                <button
                  onClick={handleSync}
                  disabled={isSyncing || !isOnline}
                  className="text-xs bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 text-white px-3 py-1 rounded-full disabled:opacity-50"
                >
                  {isSyncing ? 'Synchronisation...' : `Synchroniser (${pendingUploads})`}
                </button>
              )}
            </div>
          </div>

          <CollecteForm
            entreprises={entreprises}
            exercices={exercices}
            periodes={periodes}
            collectes={collectes}
            promoteurs={promoteurs}
            ong={ong}
            userType={userType}
            isEditing={false}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default Create;
