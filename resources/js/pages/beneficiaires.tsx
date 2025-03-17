import React, { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import BeneficiaireFormModal from '@/components/beneFormModal';
import { PlusIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { Toaster, toast } from 'sonner';

interface Beneficiaire {
  id: number;
  nom: string;
  prenom: string;
  date_de_naissance: string;
  sexe: string;
  contact: string;
  email: string;
  adresse: string;
  niveau_education: string;
  date_inscription: string;
  statut_actuel: string;
}

const Beneficiaires = () => {
  const { beneficiaires } = usePage().props as unknown as { beneficiaires: Beneficiaire[] };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBeneficiaire, setCurrentBeneficiaire] = useState<Beneficiaire | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const openModal = (beneficiaire: Beneficiaire | null = null) => {
    setCurrentBeneficiaire(beneficiaire);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentBeneficiaire(null);
  };

  const handleDelete = (id: number) => {
    if (confirmDelete === id) {
      router.delete(route('beneficiaires.destroy', id), {
        onSuccess: () => {
          toast.success("Bénéficiaire supprimé avec succès");
          setConfirmDelete(null);
        },
        onError: () => {
          toast.error("Échec de la suppression du bénéficiaire");
        },
      });
    } else {
      setConfirmDelete(id);
      toast.info("Cliquez à nouveau pour confirmer la suppression");

      setTimeout(() => {
        if (confirmDelete === id) {
          setConfirmDelete(null);
        }
      }, 3000);
    }
  };


  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR').format(date);
  };

  const filteredBeneficiaires = beneficiaires.filter(
    (beneficiaire) =>
      beneficiaire.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      beneficiaire.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      beneficiaire.contact.includes(searchTerm) ||
      beneficiaire.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Head title="Gestion des Bénéficiaires" />
<Toaster position='top-right' richColors ></Toaster>
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white border-b border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Liste des Bénéficiaires</h1>
                <button
                  onClick={() => openModal(null)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center"
                >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Ajouter un bénéficiaire
                </button>
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Rechercher un bénéficiaire..."
                  className="w-full p-2 border rounded-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nom & Prénom
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date de Naissance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Niveau d'éducation
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBeneficiaires.length > 0 ? (
                      filteredBeneficiaires.map((beneficiaire) => (
                        <tr key={beneficiaire.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {beneficiaire.nom} {beneficiaire.prenom}
                            </div>
                            <div className="text-sm text-gray-500">{beneficiaire.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{beneficiaire.contact}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatDate(beneficiaire.date_de_naissance)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {beneficiaire.niveau_education}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                beneficiaire.statut_actuel === 'Actif'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {beneficiaire.statut_actuel}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => openModal(beneficiaire)}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                <PencilIcon className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDelete(beneficiaire.id)}
                                className="text-gray-500 hover:text-red-600"
                              >
                                <TrashIcon className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                          Aucun bénéficiaire trouvé
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

      <BeneficiaireFormModal isOpen={isModalOpen} closeModal={closeModal} beneficiaire={currentBeneficiaire || undefined} />
    </>
  );
};

export default Beneficiaires;
