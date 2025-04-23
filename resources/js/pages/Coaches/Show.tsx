// resources/js/Pages/Coaches/Show.jsx
import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { toast } from 'sonner';
import AppLayout from '@/layouts/app-layout';
import { PhoneIcon, MailIcon, UserMinusIcon, LinkIcon } from 'lucide-react';
import AffectationPromoteursModal from '@/components/AffectationPromoteursModal';

interface Coach {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  specialite?: string;
  description?: string;
  date_debut?: string;
  fin_contrat?: string;
  est_actif: boolean;
  ong: { nom: string };
  beneficiaires: Array<{
    id: number;
    nom: string;
    prenom: string;
    contact?: string;
    pivot: {
      est_actif: boolean;
      date_affectation: string;
    }
  }>;
}

interface Auth {
  user: any;
}

export default function Show({ coach, auth }: { coach: Coach; auth: Auth }) {
  const [loadingPromoteurId, setLoadingPromoteurId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);


const handleDesaffecterPromoteur = (promoteurId: number) => {
  if (confirm('Êtes-vous sûr de vouloir désaffecter ce promoteur ?')) {
    setLoadingPromoteurId(promoteurId);

    router.delete(route('coaches.desaffecter-promoteur', [coach.id, promoteurId]), {
      onSuccess: () => {
        toast.success('Promoteur désaffecté avec succès');
        // Pas besoin de recharger la page, Inertia le fait automatiquement
      },
      onError: (errors: any) => {
        console.error('Erreur lors de la désaffectation du promoteur:', errors);
        toast.error('Une erreur est survenue lors de la désaffectation');
      },
      onFinish: () => {
        setLoadingPromoteurId(null);
      }
    });
  }
};

// Filtrer les promoteurs actifs
const promoteursActifs = coach.beneficiaires.filter(p => p.pivot.est_actif);

return (
<AppLayout title='Détails du Coach'

user={auth.user}>
<Head title={`Coach - ${coach.nom} ${coach.prenom}`} />

<div className="py-12">
  <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">{coach.nom} {coach.prenom}</h2>
            <p className="text-gray-600">Coach chez {coach.ong.nom}</p>
          </div>
          <div className="flex space-x-2">
            <Link
              href={route('coaches.index')}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Retour à la liste
            </Link>
            <button
              onClick={openModal}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Affecter des promoteurs
            </button>
          </div>
        </div>

        {/* Informations du coach */}
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Informations du coach</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center mb-3">
                <MailIcon className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-gray-600">Email: </span>
                <span className="ml-2 text-gray-900">{coach.email}</span>
              </div>
              <div className="flex items-center mb-3">
                <PhoneIcon className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-gray-600">Téléphone: </span>
                <span className="ml-2 text-gray-900">{coach.telephone || 'Non renseigné'}</span>
              </div>
              <div className="mb-3">
                <span className="text-gray-600">Spécialité: </span>
                <span className="text-gray-900">{coach.specialite || 'Non renseignée'}</span>
              </div>
            </div>
            <div>
              {/* <div className="mb-3">
                <span className="text-gray-600">Date de début: </span>
                <span className="text-gray-900">
                  {coach.date_debut ? new Date(coach.date_debut).toLocaleDateString() : 'Non renseignée'}
                </span>
              </div> */}
              {/* <div className="mb-3">
                <span className="text-gray-600">Fin de contrat: </span>
                <span className="text-gray-900">
                  {coach.fin_contrat ? new Date(coach.fin_contrat).toLocaleDateString() : 'Non renseignée'}
                </span>
              </div> */}
              <div className="mb-3">
                <span className="text-gray-600">Statut: </span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  coach.est_actif
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {coach.est_actif ? 'Actif' : 'Inactif'}
                </span>
              </div>
            </div>
          </div>
          {/* {coach.description && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
              <p className="text-gray-800">{coach.description}</p>
            </div>
          )} */}
        </div>

        {/* Liste des promoteurs */}
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Promoteurs suivis ({promoteursActifs.length})
        </h3>

        {promoteursActifs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-2 px-4 border-b text-left">Nom</th>
                  <th className="py-2 px-4 border-b text-left">Prénom</th>
                  <th className="py-2 px-4 border-b text-left">Contact</th>
                  <th className="py-2 px-4 border-b text-left">Date d'affectation</th>
                  <th className="py-2 px-4 border-b text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {promoteursActifs.map((promoteur) => (
                  <tr key={promoteur.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{promoteur.nom}</td>
                    <td className="py-2 px-4 border-b">{promoteur.prenom}</td>
                    <td className="py-2 px-4 border-b">{promoteur.contact || '-'}</td>
                    <td className="py-2 px-4 border-b">
                      {new Date(promoteur.pivot.date_affectation).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleDesaffecterPromoteur(promoteur.id)}
                          disabled={loadingPromoteurId === promoteur.id}
                          className="text-red-600 hover:text-red-800 disabled:opacity-50"
                          title="Désaffecter"
                        >
                          <UserMinusIcon className="h-5 w-5" />
                        </button>
                        <Link
                          href={route('beneficiaires.show', promoteur.id)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Voir le détail"
                        >
                          <LinkIcon className="h-5 w-5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-yellow-800">
            <p>Ce coach n'a aucun promoteur affecté actuellement.</p>
            <p className="mt-1">Cliquez sur "Affecter des promoteurs" pour lui attribuer des promoteurs.</p>
          </div>
        )}
      </div>
    </div>
  </div>
</div>

<AffectationPromoteursModal
  isOpen={isModalOpen}
  closeModal={closeModal}
  coach={coach}
/>
</AppLayout>
);
}
