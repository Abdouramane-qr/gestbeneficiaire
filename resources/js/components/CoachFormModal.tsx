// resources/js/Components/Coaches/CoachFormModal.jsx
import React, { useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';

interface Coach {
  id?: number;
  nom?: string;
  prenom?: string;
  email?: string;
  telephone?: string;
  ong_id?: string;
  specialite?: string;
  est_actif?: boolean;
}

interface Ong {
  id: number;
  nom: string;
}

interface CoachFormModalProps {
  isOpen: boolean;
  closeModal: () => void;
  coach?: Coach;
  ongs: Ong[];
}

export default function CoachFormModal({ isOpen, closeModal, coach, ongs }: CoachFormModalProps) {
  const { data, setData, post, put, errors, processing, reset } = useForm({
    nom: coach?.nom || '',
    prenom: coach?.prenom || '',
    email: coach?.email || '',
    telephone: coach?.telephone || '',
    ong_id: coach?.ong_id || '',
    specialite: coach?.specialite || '',
   // description: coach?.description || '',
    est_actif: coach?.est_actif ?? true,
    // date_debut: coach?.date_debut || '',
    // fin_contrat: coach?.fin_contrat || ''
  });

  useEffect(() => {
    if (isOpen) {
      reset();
      if (coach) {
        setData({
          nom: coach.nom || '',
          prenom: coach.prenom || '',
          email: coach.email || '',
          telephone: coach.telephone || '',
          ong_id: coach.ong_id || '',
          specialite: coach.specialite || '',
        //  description: coach.description || '',
          est_actif: coach.est_actif ?? true,
        //   date_debut: coach.date_debut || '',
        //   fin_contrat: coach.fin_contrat || ''
        });
      }
    }
  }, [isOpen, coach, reset, setData]);

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (coach?.id) {
      put(route('coaches.update', coach.id), {
        onSuccess: () => {
          toast.success('Coach modifié avec succès');
          closeModal();
        }
      });
    } else {
      post(route('coaches.store'), {
        onSuccess: () => {
          toast.success('Coach ajouté avec succès');
          closeModal();
        }
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
            <div className="fixed inset-0 bg-black bg-opacity-30" />
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
                {coach ? 'Modifier le Coach' : 'Ajouter un Coach'}
              </Dialog.Title>

              <form onSubmit={handleSubmit} className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nom */}
                  <div>
                    <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                      Nom*
                    </label>
                    <input
                      type="text"
                      id="nom"
                      value={data.nom}
                      onChange={(e) => setData('nom', e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      required
                    />
                    {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom}</p>}
                  </div>

                  {/* Prénom */}
                  <div>
                    <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">
                      Prénom*
                    </label>
                    <input
                      type="text"
                      id="prenom"
                      value={data.prenom}
                      onChange={(e) => setData('prenom', e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      required
                    />
                    {errors.prenom && <p className="text-red-500 text-xs mt-1">{errors.prenom}</p>}
                  </div>
                </div>

                {/* Email */}
                <div className="mt-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email*
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                {/* Téléphone */}
                <div className="mt-4">
                  <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">
                    Téléphone
                  </label>
                  <input
                    type="text"
                    id="telephone"
                    value={data.telephone}
                    onChange={(e) => setData('telephone', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                  {errors.telephone && <p className="text-red-500 text-xs mt-1">{errors.telephone}</p>}
                </div>

                {/* ONG */}
                <div className="mt-4">
                  <label htmlFor="ong_id" className="block text-sm font-medium text-gray-700">
                    ONG*
                  </label>
                  <select
                    id="ong_id"
                    value={data.ong_id}
                    onChange={(e) => setData('ong_id', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  >
                    <option value="">Sélectionner une ONG</option>
                    {ongs.map((ong) => (
                      <option key={ong.id} value={ong.id}>
                        {ong.nom}
                      </option>
                    ))}
                  </select>
                  {errors.ong_id && <p className="text-red-500 text-xs mt-1">{errors.ong_id}</p>}
                </div>

                {/* Spécialité */}
                <div className="mt-4">
                  <label htmlFor="specialite" className="block text-sm font-medium text-gray-700">
                    Spécialité
                  </label>
                  <input
                    type="text"
                    id="specialite"
                    value={data.specialite}
                    onChange={(e) => setData('specialite', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>


                {/* Est actif */}
                <div className="mt-4">
                  <div className="flex items-center">
                    <input
                      id="est_actif"
                      name="est_actif"
                      type="checkbox"
                      checked={data.est_actif}
                      onChange={(e) => setData('est_actif', e.target.checked)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label htmlFor="est_actif" className="ml-2 block text-sm text-gray-700">
                      Coach actif
                    </label>
                  </div>
                </div>


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
                    disabled={processing}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                  >
                    {processing ? 'Traitement...' : coach ? 'Modifier' : 'Ajouter'}
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
