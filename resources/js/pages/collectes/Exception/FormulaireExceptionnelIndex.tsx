import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { PlusIcon, PencilIcon, EyeIcon, TrashIcon } from 'lucide-react';
import { toast } from 'sonner';
import AppLayout from '@/layouts/app-layout';
import FormulaireExceptionnelModal from '@/components/OccasionnelModal';

interface Beneficiaire {
  id: number;
  nom: string;
  prenom: string;
}

interface Entreprise {
  id: number;
  nom_entreprise: string;
}

interface Exercice {
  id: number;
  annee: number;
}

interface User {
  id: number;
  name: string;
}

interface Collecte {
  id: number;
  entreprise: Entreprise;
  exercice: Exercice;
  user: User;
  periode: string | null;
  type_collecte: string;
  date_collecte: string;
  donnees: {
    formulaire_exceptionnel: {
      beneficiaires_id: number;
      beneficiaire_nom: string;
      beneficiaire_prenom: string;
      formation_technique_recu: boolean;
      formations_techniques: string[];
      formation_entrepreneuriat_recu: boolean;
      formations_entrepreneuriat: string[];
      appreciation_organisation_interne_demarrage: number;
      appreciation_services_adherents_demarrage: number;
      appreciation_relations_externes_demarrage: number;
      est_bancarise_demarrage: boolean;
      appreciation_organisation_interne_fin: number;
      appreciation_services_adherents_fin: number;
      appreciation_relations_externes_fin: number;
      est_bancarise_fin: boolean;
    }
  };
  created_at: string;
  updated_at: string;
}

interface PageProps {
  collectes: {
    data: Collecte[];
    links: any[];
    current_page: number;
    from: number;
    to: number;
    total: number;
  };
  beneficiaires: Beneficiaire[];
  exercices?: Exercice[];
  auth: {
    user: User;
  };
}

const FormulaireExceptionnelIndex: React.FC<PageProps> = ({ collectes, beneficiaires, }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollecte, setEditingCollecte] = useState<Collecte | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  // Formatage de la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const openCreateModal = () => {
    setEditingCollecte(null);
    setIsModalOpen(true);
  };

  const openEditModal = (collecte: Collecte) => {
    setEditingCollecte(collecte);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCollecte(null);
  };

  const handleDelete = (id: number) => {
    if (confirmDelete === id) {
      // Exécution de la suppression
      router.delete(route('formulaires.exceptionnels.destroy', id), {
        onSuccess: () => {
          toast.success('Formulaire exceptionnel supprimé avec succès');
          setConfirmDelete(null);
        },
        onError: () => {
          toast.error('Erreur lors de la suppression du formulaire');
          setConfirmDelete(null);
        }
      });
    } else {
      // Demande de confirmation
      setConfirmDelete(id);
      toast.info('Cliquez à nouveau pour confirmer la suppression', {
        duration: 3000,
        onDismiss: () => setConfirmDelete(null)
      });
    }
  };

  return (
    <AppLayout
      title='Formulaires Exceptionnels'
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Formulaires Exceptionnels</h2>}
    >
      <Head title="Formulaires Exceptionnels" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
            {/* En-tête avec bouton d'ajout */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Liste des formulaires exceptionnels</h3>
              <button
                onClick={openCreateModal}
                className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900 focus:ring ring-blue-300 disabled:opacity-25 transition ease-in-out duration-150"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Nouveau formulaire
              </button>
            </div>

            {/* Tableau des formulaires */}
            {collectes.data.length > 0 ? (
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bénéficiaire
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Entreprise
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Exercice
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date de création
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Formations
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {collectes.data.map((collecte) => (
                      <tr key={collecte.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {collecte.donnees.formulaire_exceptionnel.beneficiaire_prenom} {collecte.donnees.formulaire_exceptionnel.beneficiaire_nom}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{collecte.entreprise.nom_entreprise}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{collecte.exercice.annee}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(collecte.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {collecte.type_collecte === 'brouillon' ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Brouillon
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Standard
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-1">
                            {collecte.donnees.formulaire_exceptionnel.formation_technique_recu && (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                Technique
                              </span>
                            )}
                            {collecte.donnees.formulaire_exceptionnel.formation_entrepreneuriat_recu && (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                Entrepreneuriat
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Link
                              href={route('formulaires.exceptionnels.show', collecte.id)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Voir"
                            >
                              <EyeIcon className="w-5 h-5" />
                            </Link>
                            <button
                              onClick={() => openEditModal(collecte)}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="Modifier"
                            >
                              <PencilIcon className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(collecte.id)}
                              className={`${
                                confirmDelete === collecte.id
                                  ? 'text-red-800'
                                  : 'text-red-600 hover:text-red-900'
                              }`}
                              title={confirmDelete === collecte.id ? "Confirmer la suppression" : "Supprimer"}
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-lg">
                <p className="text-gray-500">Aucun formulaire exceptionnel trouvé</p>
                <button
                  onClick={openCreateModal}
                  className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900 focus:ring ring-blue-300 disabled:opacity-25 transition"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Créer un formulaire
                </button>
              </div>
            )}

            {/* Pagination */}
            {collectes.links && collectes.links.length > 3 && (
              <div className="mt-4 flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Affichage de <span className="font-medium">{collectes.from}</span> à{' '}
                      <span className="font-medium">{collectes.to}</span> sur{' '}
                      <span className="font-medium">{collectes.total}</span> résultats
                    </p>
                  </div>
                  <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                      {collectes.links.map((link, i) => {
                        // Skip "prev" and "next" indicators
                        if (i === 0 || i === collectes.links.length - 1) return null;

                        return (
                          <Link
                            key={i}
                            href={link.url || '#'}
                            className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                              link.active
                                ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                                : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
                            } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                            aria-current={link.active ? 'page' : undefined}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                          />
                        );
                      })}
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de formulaire */}
      {isModalOpen && (
        <FormulaireExceptionnelModal
          isOpen={isModalOpen}
          closeModal={closeModal}
          beneficiaires={beneficiaires}
          collecte={editingCollecte}
          formulaireData={editingCollecte ? editingCollecte.donnees.formulaire_exceptionnel : null}
          mode={editingCollecte ? 'edit' : 'create'}
        />
      )}
    </AppLayout>
  );
};

export default FormulaireExceptionnelIndex;
