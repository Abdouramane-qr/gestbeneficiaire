// resources/js/Components/AffectationPromoteursModal.jsx
import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useForm, router } from '@inertiajs/react';
import axios from 'axios';
import { toast } from 'sonner';

interface Beneficiaire {
  id: number;
  nom: string;
  prenom: string;
  contact?: string;
}

interface AffectationPromoteursModalProps {
  isOpen: boolean;
  closeModal: () => void;
  coach: { id: number; nom: string; prenom: string; };
}

export default function AffectationPromoteursModal({ isOpen, closeModal, coach }: AffectationPromoteursModalProps) {
  const [beneficiaires, setPromoteurs] = useState<Beneficiaire[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { data, setData, processing, errors, reset } = useForm({
    beneficiaires_id: [],
    date_affectation: new Date().toISOString().split('T')[0],
  });

  // Charger les promoteurs disponibles
  useEffect(() => {
    if (isOpen && coach) {
      setIsLoading(true);
      axios.get(route('coaches.promoteurs-disponibles', coach.id))
        .then(response => {
          setPromoteurs(response.data);
        })
        .catch(error => {
          console.error('Erreur lors du chargement des promoteurs:', error);
          toast.error('Erreur lors du chargement des promoteurs');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen, coach]);

  // Réinitialiser le formulaire à la fermeture
  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (data.beneficiaires_id.length === 0) {
      toast.error('Veuillez sélectionner au moins un promoteur');
      return;
    }

    // Utiliser router.post au lieu de post pour faciliter le rechargement complet
    router.post(route('coaches.affecter-promoteurs', coach.id), data, {
      onSuccess: () => {
        toast.success('Promoteurs affectés avec succès');
        closeModal();
      },
      onError: () => {
        toast.error('Erreur lors de l\'affectation des promoteurs');
      }
    });
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
            <div className="fixed inset-0 bg-black opacity-30" />
          </Transition.Child>

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
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                Affecter des promoteurs à {coach?.nom} {coach?.prenom}
              </Dialog.Title>

              <form onSubmit={handleSubmit} className="mt-4">
                {isLoading ? (
                  <div className="py-4 text-center">Chargement des promoteurs...</div>
                ) : (
                  <>
                    {/* Sélection des promoteurs */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Promoteurs disponibles*
                      </label>

                      {beneficiaires.length > 0 ? (
                        <div className="border border-gray-300 rounded-md p-2 max-h-60 overflow-y-auto">
                          {beneficiaires.map((beneficiaire) => (
                            <div key={beneficiaire.id} className="flex items-center py-1">
                              <input
                                type="checkbox"
                                id={`beneficiaire-${beneficiaire.id}`}
                                value={beneficiaire.id}
                                checked={data.beneficiaires_id.includes(beneficiaire.id)}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  setData('beneficiaires_id',
                                    checked
                                      ? [...data.beneficiaires_id, beneficiaire.id]
                                      : data.beneficiaires_id.filter(id => id !== beneficiaire.id)
                                  );
                                }}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded mr-2"
                              />
                              <label htmlFor={`beneficiaire-${beneficiaire.id}`} className="text-sm text-gray-700">
                                {beneficiaire.nom} {beneficiaire.prenom}
                                {beneficiaire.contact && ` - ${beneficiaire.contact}`}
                              </label>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-yellow-800">
                          <p>Aucun promoteur disponible pour l'affectation.</p>
                        </div>
                      )}

                      {errors.beneficiaires_id && (
                        <p className="text-red-500 text-xs mt-1">{errors.beneficiaires_id}</p>
                      )}
                    </div>

                    {/* Date d'affectation */}
                    <div className="mt-4">
                      <label htmlFor="date_affectation" className="block text-sm font-medium text-gray-700">
                        Date d'affectation*
                      </label>
                      <input
                        type="date"
                        id="date_affectation"
                        value={data.date_affectation}
                        onChange={(e) => setData('date_affectation', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        required
                      />
                      {errors.date_affectation && (
                        <p className="text-red-500 text-xs mt-1">{errors.date_affectation}</p>
                      )}
                    </div>
                  </>
                )}

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={processing || isLoading || beneficiaires.length === 0}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                  >
                    {processing ? 'Traitement...' : 'Affecter'}
                  </button>
                </div>
              </form>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
