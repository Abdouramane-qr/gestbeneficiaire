

// // export default EntrepriseFormModal;
import React, { useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';

// Définition des types
interface Beneficiaire {
  id: number;
  nom: string;
  prenom: string;
}

interface EntrepriseFormData {
  id?: number;
  beneficiaires_id?: number;
  nom_entreprise: string;
  secteur_activite: string;
  date_creation: string;
  statut_juridique: string;
  adresse: string;
  ville: string;
  pays: string;
  description: string;
}

interface EntrepriseFormModalProps {
  isOpen: boolean;
  closeModal: () => void;
  entreprise?: EntrepriseFormData;
  beneficiaires: Beneficiaire[]; // Liste des bénéficiaires passée en props
}

// Fonction pour formater la date au format `yyyy-MM-dd`
const formatDateForInput = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

const EntrepriseFormModal = ({ isOpen, closeModal, entreprise, beneficiaires }: EntrepriseFormModalProps) => {
  const { data, setData, post, put, errors, processing, reset } = useForm({
    beneficiaires_id: entreprise?.beneficiaires_id || '',
    nom_entreprise: entreprise?.nom_entreprise || '',
    secteur_activite: entreprise?.secteur_activite || '',
    date_creation: entreprise?.date_creation ? formatDateForInput(entreprise.date_creation) : '', // Utilisation de la fonction
    statut_juridique: entreprise?.statut_juridique || '',
    adresse: entreprise?.adresse || '',
    ville: entreprise?.ville || '',
    pays: entreprise?.pays || '',
    description: entreprise?.description || '',
  });

  useEffect(() => {
    if (entreprise) {
      setData({
        beneficiaires_id: entreprise.beneficiaires_id || '',
        nom_entreprise: entreprise.nom_entreprise || '',
        secteur_activite: entreprise.secteur_activite || '',
        date_creation: formatDateForInput(entreprise.date_creation), // Utilisation de la fonction
        statut_juridique: entreprise.statut_juridique || '',
        adresse: entreprise.adresse || '',
        ville: entreprise.ville || '',
        pays: entreprise.pays || '',
        description: entreprise.description || '',
      });
    } else {
      reset();
    }
  }, [entreprise, isOpen, reset, setData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const successMessage = entreprise?.id
      ? 'Entreprise mise à jour avec succès.'
      : 'Entreprise ajoutée avec succès.';
    const errorMessage = entreprise?.id
      ? 'Échec de la mise à jour de l\'entreprise.'
      : 'Échec de l\'ajout de l\'entreprise.';

    if (entreprise?.id) {
      put(route('entreprises.update', entreprise.id), {
        onSuccess: () => {
          toast.success(successMessage);
          closeModal();
          reset();
        },
        onError: () => {
          toast.error(errorMessage);
        },
      });
    } else {
      post(route('entreprises.store'), {
        onSuccess: () => {
          toast.success(successMessage);
          closeModal();
          reset();
        },
        onError: () => {
          toast.error(errorMessage);
        },
      });
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={closeModal}>
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Panel className="fixed inset-0 bg-black bg-opacity-30" />
          </Transition.Child>

          <span className="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
              <Dialog.Title className="text-lg font-medium text-gray-900">
                {entreprise?.id ? 'Modifier une entreprise' : 'Ajouter une entreprise'}
              </Dialog.Title>

              <form onSubmit={handleSubmit}>
                {/* Nom de l'entreprise */}
                <div className="mt-4">
                  <label htmlFor="nom_entreprise" className="block text-sm font-medium text-gray-700">
                    Nom de l'entreprise
                  </label>
                  <input
                    type="text"
                    id="nom_entreprise"
                    value={data.nom_entreprise}
                    onChange={(e) => setData('nom_entreprise', e.target.value)}
                    className="mt-1 p-2 w-full border rounded-md"
                  />
                  {errors.nom_entreprise && (
                    <span className="text-red-500 text-sm">{errors.nom_entreprise}</span>
                  )}
                </div>

                {/* Secteur d'activité */}
                <div className="mt-4">
                  <label htmlFor="secteur_activite" className="block text-sm font-medium text-gray-700">
                    Secteur d'activité
                  </label>
                  <input
                    type="text"
                    id="secteur_activite"
                    value={data.secteur_activite}
                    onChange={(e) => setData('secteur_activite', e.target.value)}
                    className="mt-1 p-2 w-full border rounded-md"
                  />
                  {errors.secteur_activite && (
                    <span className="text-red-500 text-sm">{errors.secteur_activite}</span>
                  )}
                </div>

                {/* Date de création */}
                <div className="mt-4">
                  <label htmlFor="date_creation" className="block text-sm font-medium text-gray-700">
                    Date de création
                  </label>
                  <input
                    type="date"
                    id="date_creation"
                    value={data.date_creation}
                    onChange={(e) => setData('date_creation', e.target.value)}
                    className="mt-1 p-2 w-full border rounded-md"
                  />
                  {errors.date_creation && (
                    <span className="text-red-500 text-sm">{errors.date_creation}</span>
                  )}
                </div>

                {/* Statut juridique */}
                <div className="mt-4">
                  <label htmlFor="statut_juridique" className="block text-sm font-medium text-gray-700">
                    Statut juridique
                  </label>
                  <input
                    type="text"
                    id="statut_juridique"
                    value={data.statut_juridique}
                    onChange={(e) => setData('statut_juridique', e.target.value)}
                    className="mt-1 p-2 w-full border rounded-md"
                  />
                  {errors.statut_juridique && (
                    <span className="text-red-500 text-sm">{errors.statut_juridique}</span>
                  )}
                </div>

                {/* Adresse */}
                <div className="mt-4">
                  <label htmlFor="adresse" className="block text-sm font-medium text-gray-700">
                    Adresse
                  </label>
                  <input
                    type="text"
                    id="adresse"
                    value={data.adresse}
                    onChange={(e) => setData('adresse', e.target.value)}
                    className="mt-1 p-2 w-full border rounded-md"
                  />
                  {errors.adresse && <span className="text-red-500 text-sm">{errors.adresse}</span>}
                </div>

                {/* Ville */}
                <div className="mt-4">
                  <label htmlFor="ville" className="block text-sm font-medium text-gray-700">
                    Ville
                  </label>
                  <input
                    type="text"
                    id="ville"
                    value={data.ville}
                    onChange={(e) => setData('ville', e.target.value)}
                    className="mt-1 p-2 w-full border rounded-md"
                  />
                  {errors.ville && <span className="text-red-500 text-sm">{errors.ville}</span>}
                </div>

                {/* Pays */}
                <div className="mt-4">
                  <label htmlFor="pays" className="block text-sm font-medium text-gray-700">
                    Pays
                  </label>
                  <input
                    type="text"
                    id="pays"
                    value={data.pays}
                    onChange={(e) => setData('pays', e.target.value)}
                    className="mt-1 p-2 w-full border rounded-md"
                  />
                  {errors.pays && <span className="text-red-500 text-sm">{errors.pays}</span>}
                </div>

                {/* Description */}
                <div className="mt-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    className="mt-1 p-2 w-full border rounded-md"
                  />
                  {errors.description && (
                    <span className="text-red-500 text-sm">{errors.description}</span>
                  )}
                </div>

                {/* Bénéficiaire associé */}
                <div className="mt-4">
                  <label htmlFor="beneficiaires_id" className="block text-sm font-medium text-gray-700">
                    Bénéficiaire associé
                  </label>
                  <select
                    id="beneficiaires_id"
                    value={data.beneficiaires_id}
                    onChange={(e) => setData('beneficiaires_id', e.target.value)}
                    className="mt-1 p-2 w-full border rounded-md"
                  >
                    <option value="">Sélectionnez un bénéficiaire</option>
                    {beneficiaires.map((beneficiaire) => (
                      <option key={beneficiaire.id} value={beneficiaire.id}>
                        {beneficiaire.nom} {beneficiaire.prenom}
                      </option>
                    ))}
                  </select>
                  {errors.beneficiaires_id && (
                    <span className="text-red-500 text-sm">{errors.beneficiaires_id}</span>
                  )}
                </div>

                {/* Boutons */}
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md mr-2"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={processing}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md disabled:bg-gray-300"
                  >
                    {processing ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EntrepriseFormModal;
