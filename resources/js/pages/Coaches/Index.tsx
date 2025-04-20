// resources/js/Pages/Coaches/Index.jsx
import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import CoachFormModal from '@/components/CoachFormModal';
import { EyeIcon, PencilIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { Toaster } from 'sonner';

interface Props {
  auth: {
    user: any; // Replace 'any' with your actual user type if available
  };
  coaches: any[]; // Replace 'any' with your actual coach type if available
  ongs: any[]; // Replace 'any' with your actual ong type if available
}

export default function Index({ auth, coaches, ongs }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<Coaches | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCoaches = coaches.filter(coach =>
    coach.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coach.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coach.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openCreateModal = () => {
    setSelectedCoach(null);
    setIsModalOpen(true);
  };

  const openEditModal = (coach: React.SetStateAction<null>) => {
    setSelectedCoach(coach);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <AppLayout title='Gestion des Coachs'
     user={auth.user}>
      <Head title="Gestion des Coachs" />
      <Toaster position="top-right" richColors />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Liste des Coachs</h2>
                <button
                  onClick={openCreateModal}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center"
                >
                  <PlusIcon className="h-5 w-5 mr-1" />
                  Ajouter un Coach
                </button>
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Rechercher un coach..."
                  className="w-full sm:w-96 p-2 border rounded-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-2 px-4 border-b text-left">Nom et Prénom</th>
                      <th className="py-2 px-4 border-b text-left">ONG</th>
                      <th className="py-2 px-4 border-b text-left">Email</th>
                      <th className="py-2 px-4 border-b text-left">Téléphone</th>
                      <th className="py-2 px-4 border-b text-center">Promoteurs</th>
                      <th className="py-2 px-4 border-b text-center">Statut</th>
                      <th className="py-2 px-4 border-b text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCoaches.length > 0 ? (
                      filteredCoaches.map((coach) => (
                        <tr key={coach.id} className="hover:bg-gray-50">
                          <td className="py-2 px-4 border-b">
                            {coach.nom} {coach.prenom}
                          </td>
                          <td className="py-2 px-4 border-b">{coach.ong?.nom || '-'}</td>
                          <td className="py-2 px-4 border-b">{coach.email}</td>
                          <td className="py-2 px-4 border-b">{coach.telephone || '-'}</td>
                          <td className="py-2 px-4 border-b text-center">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                              {coach.promoteurs_count} promoteur(s)
                            </span>
                          </td>
                          <td className="py-2 px-4 border-b text-center">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              coach.est_actif
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {coach.est_actif ? 'Actif' : 'Inactif'}
                            </span>
                          </td>
                          <td className="py-2 px-4 border-b">
                            <div className="flex justify-center space-x-2">
                              <Link href={route('coaches.show', coach.id)} className="text-blue-600 hover:text-blue-800">
                                <EyeIcon className="h-5 w-5" />
                              </Link>
                              <button onClick={() => openEditModal(coach)} className="text-yellow-600 hover:text-yellow-800">
                                <PencilIcon className="h-5 w-5" />
                              </button>
                              <Link
                                href={route('coaches.destroy', coach.id)}
                                method="delete"
                                as="button"
                                className="text-red-600 hover:text-red-800"
                                onClick={() => confirm('Êtes-vous sûr de vouloir supprimer ce coach?')}
                              >
                                <TrashIcon className="h-5 w-5" />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-4 text-center text-gray-500">
                          Aucun coach trouvé
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CoachFormModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        coach={selectedCoach}
        ongs={ongs}
      />
    </AppLayout>
  );
}
