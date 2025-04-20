import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { XIcon, SaveIcon } from 'lucide-react';
import { IndicateurCalculator } from '@/Utils/IndicateurCalculator';

interface OccasionnelModalProps {
  isOpen: boolean;
  closeModal: () => void;
  entreprises: Array<{ id: number, nom_entreprise: string }>;
  exercices: Array<{ id: number, annee: string | number }>;
}

const OccasionnelModal: React.FC<OccasionnelModalProps> = ({
  isOpen,
  closeModal,
  entreprises,
  exercices
}) => {
  // Récupérer les indicateurs occasionnels de l'utilitaire IndicateurCalculator
  const [indicateurs, setIndicateurs] = useState<Array<{ id: string, label: string, unite?: string }>>([]);

  // Initialiser les données du formulaire
  const { data, setData, post, processing, errors, reset } = useForm<{
    entreprise_id: string;
    exercice_id: string;
    date_collecte: string;
    date_heure_collecte: string; // Nouveau champ pour stocker la date avec l'heure
    type_collecte: string;
    donnees: { 'Indicateurs de performance Projet': Record<string, string> };
  }>({
    entreprise_id: '',
    exercice_id: '',
    date_collecte: new Date().toISOString().split('T')[0],
    date_heure_collecte: new Date().toISOString().slice(0, 16), // Format YYYY-MM-DDThh:mm
    type_collecte: 'standard', // Par défaut 'standard', mais peut être modifié
    donnees: { 'Indicateurs de performance Projet': {} }
  });

  // Récupérer les indicateurs pour la période occasionnelle au chargement
  useEffect(() => {
    // Récupérer les indicateurs occasionnels depuis l'utilitaire
    const occasionnelCategories = IndicateurCalculator.getCategoriesForPeriode('Occasionnelle');
    const allIndicateurs = [];

    for (const categorie of occasionnelCategories) {
      const categorieIndicateurs = IndicateurCalculator.getIndicateursByPeriodeAndCategorie(
        'Occasionnelle',
        categorie
      );
      allIndicateurs.push(...categorieIndicateurs);
    }

    setIndicateurs(allIndicateurs);
  }, []);

  // Gérer les changements de champs d'indicateurs
  const handleIndicateurChange = (indicateurId: string, value: string) => {
    setData('donnees', {
      ...data.donnees,
      'Indicateurs de performance Projet': {
        ...data.donnees['Indicateurs de performance Projet'],
        [indicateurId]: value
      }
    });
  };

  // Gérer les changements de type de collecte (standard/brouillon)
  const handleTypeCollecteChange = (type: string) => {
    setData('type_collecte', type);
  };

  // Gérer la soumission du formulaire
  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    // Formater la date avec l'heure pour le backend
    const formattedDateTime = new Date(data.date_heure_collecte).toISOString();

    // Créer l'objet à soumettre avec la date formatée
    const submitData = {
      ...data,
      date_collecte: formattedDateTime, // Envoyer la date complète avec l'heure
    };

    interface ValidationErrors {
        [key: string]: string;
    }

    interface SubmitResponse {
        onSuccess: () => void;
        onError: (errors: ValidationErrors) => void;
    }

            post<SubmitResponse>(route('collectes.storeOccasionnel'), submitData, {
                onSuccess: (): void => {
                    const message: string = data.type_collecte === 'standard'
                        ? 'Collecte occasionnelle enregistrée avec succès'
                        : 'Brouillon de collecte occasionnelle enregistré avec succès';

                    toast.success(message);
                    closeModal();
                    reset();
                },
                onError: (errors: ValidationErrors): void => {
                    console.error('Erreurs de validation:', errors);
                    Object.entries(errors).forEach(([field, message]: [string, string]): void =>
                        toast.error(`${field}: ${message}`)
                    );
                }
            });
  };

  // Réinitialiser le formulaire à l'ouverture/fermeture du modal
  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={closeModal}>
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
            <Dialog className="fixed inset-0 bg-black/25 backdrop-blur-sm" onClose={closeModal} />
          </Transition.Child>

          {/* Astuce pour centrer le modal */}
          <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl relative">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                <XIcon className="w-5 h-5" />
              </button>

              <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Nouvelle collecte occasionnelle
              </Dialog.Title>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {/* Sélection du type de collecte (standard/brouillon) */}
                  <div>
                    <label htmlFor="type_collecte" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Type de collecte
                    </label>
                    <select
                      id="type_collecte"
                      value={data.type_collecte}
                      onChange={e => handleTypeCollecteChange(e.target.value)}
                      className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="standard">Standard</option>
                      <option value="brouillon">Brouillon</option>
                    </select>
                    {errors.type_collecte && (
                      <p className="text-red-500 text-xs mt-1">{errors.type_collecte}</p>
                    )}
                  </div>

                  {/* Sélection de l'entreprise */}
                  <div>
                    <label htmlFor="entreprise_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Entreprise
                    </label>
                    <select
                      id="entreprise_id"
                      value={data.entreprise_id}
                      onChange={e => setData('entreprise_id', e.target.value)}
                      className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    >
                      <option value="">Sélectionnez une entreprise</option>
                      {entreprises.map(entreprise => (
                        <option key={entreprise.id} value={entreprise.id}>
                          {entreprise.nom_entreprise}
                        </option>
                      ))}
                    </select>
                    {errors.entreprise_id && (
                      <p className="text-red-500 text-xs mt-1">{errors.entreprise_id}</p>
                    )}
                  </div>

                  {/* Sélection de l'exercice */}
                  <div>
                    <label htmlFor="exercice_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Exercice
                    </label>
                    <select
                      id="exercice_id"
                      value={data.exercice_id}
                      onChange={e => setData('exercice_id', e.target.value)}
                      className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    >
                      <option value="">Sélectionnez un exercice</option>
                      {exercices.map(exercice => (
                        <option key={exercice.id} value={exercice.id}>
                          {exercice.annee}
                        </option>
                      ))}
                    </select>
                    {errors.exercice_id && (
                      <p className="text-red-500 text-xs mt-1">{errors.exercice_id}</p>
                    )}
                  </div>

                  {/* Date et heure de collecte */}
                  <div className="md:col-span-3">
                    <label htmlFor="date_heure_collecte" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date et heure de collecte
                    </label>
                    <input
                      type="datetime-local"
                      id="date_heure_collecte"
                      value={data.date_heure_collecte}
                      onChange={e => setData('date_heure_collecte', e.target.value)}
                      className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                    {errors.date_collecte && (
                      <p className="text-red-500 text-xs mt-1">{errors.date_collecte}</p>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg mb-4">
                    <h3 className="font-medium text-lg mb-2 text-indigo-700 dark:text-indigo-300">
                      Indicateurs de performance Projet
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Les indicateurs ci-dessous sont facultatifs. Remplissez uniquement ceux qui sont pertinents pour votre collecte occasionnelle.
                    </p>
                  </div>

                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {indicateurs.map(indicateur => (
                      <div key={indicateur.id} className="grid grid-cols-3 gap-4 items-center border-b border-gray-200 dark:border-gray-700 pb-4">
                        <label className="col-span-2 text-sm text-gray-700 dark:text-gray-300">
                          {indicateur.label}
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            value={data.donnees['Indicateurs de performance Projet'][indicateur.id] || ''}
                            onChange={e => handleIndicateurChange(indicateur.id, e.target.value)}
                          />
                          {indicateur.unite && (
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <span className="text-gray-500 dark:text-gray-400 sm:text-sm">
                                {indicateur.unite}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={closeModal}
                  >
                    Annuler
                  </button>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 dark:bg-indigo-500 border border-transparent rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    disabled={processing}
                  >
                    {data.type_collecte === 'brouillon' && <SaveIcon className="w-4 h-4 mr-2" />}
                    {processing ? 'Enregistrement...' : data.type_collecte === 'standard' ? 'Enregistrer' : 'Enregistrer comme brouillon'}
                  </button>
                </div>
              </form>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default OccasionnelModal;
