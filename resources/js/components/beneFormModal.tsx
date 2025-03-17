/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useForm } from '@inertiajs/react';
import { Toaster, toast } from 'sonner';


interface BeneficiaireFormModalProps {
  isOpen: boolean;
  closeModal: () => void;
  beneficiaire?: {
    id?: number;
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
  };
}

const BeneficiaireFormModal = ({ isOpen, closeModal, beneficiaire }: BeneficiaireFormModalProps) => {
  const { data, setData, post, put, errors, processing, reset } = useForm({
    nom: beneficiaire?.nom || '',
    prenom: beneficiaire?.prenom || '',
    date_de_naissance: beneficiaire?.date_de_naissance || '',
    sexe: beneficiaire?.sexe || '',
    contact: beneficiaire?.contact || '',
    email: beneficiaire?.email || '',
    adresse: beneficiaire?.adresse || '',
    niveau_education: beneficiaire?.niveau_education || '',
    date_inscription: beneficiaire?.date_inscription || '',
    statut_actuel: beneficiaire?.statut_actuel || '',
  });

  useEffect(() => {
    if (beneficiaire) {
      setData({
        nom: beneficiaire.nom || '',
        prenom: beneficiaire.prenom || '',
        date_de_naissance: beneficiaire.date_de_naissance || '',
        sexe: beneficiaire.sexe || '',
        contact: beneficiaire.contact || '',
        email: beneficiaire.email || '',
        adresse: beneficiaire.adresse || '',
        niveau_education: beneficiaire.niveau_education || '',
        date_inscription: beneficiaire.date_inscription || '',
        statut_actuel: beneficiaire.statut_actuel || '',
      });
    } else {
      reset();
    }
  }, [beneficiaire, isOpen, reset, setData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
const successMessage= beneficiaire?.id? "Bénéficiaire mis à jour avec succès.":"Bénéficiaire ajouté avec succès.";
const ErrorMessage= beneficiaire?.id? "Echec du mis à jour du Bénéficiaire.":"Echec d'ajouté Bénéficiaire.";

    if (beneficiaire?.id) {
      put(route('beneficiaires.update', beneficiaire.id), {
        onSuccess: () => {
            toast.success(successMessage)
          closeModal();
          reset();
        }
      });
    } else {
      post(route('beneficiaires.store'), {
        onSuccess: () => {
            toast.success(successMessage)
          closeModal();
          reset();
        }, onError:(errors)=>{
            toast.success(ErrorMessage)

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
            <Dialog.Panel className="fixed inset-0 bg-black bg-opacity-30" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
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
                {beneficiaire?.id ? 'Modifier un bénéficiaire' : 'Ajouter un bénéficiaire'}
              </Dialog.Title>

              <form onSubmit={handleSubmit}>
                {/* Nom */}
                <div className="mt-4">
                  <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                    Nom
                  </label>
                  <input
                    type="text"
                    id="nom"
                    value={data.nom}
                    onChange={(e) => setData('nom', e.target.value)}
                    className="mt-1 p-2 w-full border rounded-md"
                  />
                  {errors.nom && <span className="text-red-500 text-sm">{errors.nom}</span>}
                </div>

                {/* Prénom */}
                <div className="mt-4">
                  <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">
                    Prénom
                  </label>
                  <input
                    type="text"
                    id="prenom"
                    value={data.prenom}
                    onChange={(e) => setData('prenom', e.target.value)}
                    className="mt-1 p-2 w-full border rounded-md"
                  />
                  {errors.prenom && <span className="text-red-500 text-sm">{errors.prenom}</span>}
                </div>

                {/* Date de naissance */}
                <div className="mt-4">
                  <label htmlFor="date_de_naissance" className="block text-sm font-medium text-gray-700">
                    Date de naissance
                  </label>
                  <input
                    type="date"
                    id="date_de_naissance"
                    value={data.date_de_naissance}
                    onChange={(e) => setData('date_de_naissance', e.target.value)}
                    className="mt-1 p-2 w-full border rounded-md"
                  />
                  {errors.date_de_naissance && (
                    <span className="text-red-500 text-sm">{errors.date_de_naissance}</span>
                  )}
                </div>

                {/* Sexe */}
                <div className="mt-4">
                  <label htmlFor="sexe" className="block text-sm font-medium text-gray-700">
                    Sexe
                  </label>
                  <select
                    id="sexe"
                    value={data.sexe}
                    onChange={(e) => setData('sexe', e.target.value)}
                    className="mt-1 p-2 w-full border rounded-md"
                  >
                    <option value="">Sélectionner</option>
                    <option value="M">Masculin</option>
                    <option value="F">Féminin</option>
                  </select>
                  {errors.sexe && <span className="text-red-500 text-sm">{errors.sexe}</span>}
                </div>

                {/* Contact */}
                <div className="mt-4">
                  <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
                    Contact
                  </label>
                  <input
                    type="text"
                    id="contact"
                    value={data.contact}
                    onChange={(e) => setData('contact', e.target.value)}
                    className="mt-1 p-2 w-full border rounded-md"
                  />
                  {errors.contact && <span className="text-red-500 text-sm">{errors.contact}</span>}
                </div>

                {/* Email */}
                <div className="mt-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    className="mt-1 p-2 w-full border rounded-md"
                  />
                  {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
                </div>

                {/* Adresse */}
                <div className="mt-4">
                  <label htmlFor="adresse" className="block text-sm font-medium text-gray-700">
                    Adresse
                  </label>
                  <textarea
                    id="adresse"
                    value={data.adresse}
                    onChange={(e) => setData('adresse', e.target.value)}
                    className="mt-1 p-2 w-full border rounded-md"
                  />
                  {errors.adresse && <span className="text-red-500 text-sm">{errors.adresse}</span>}
                </div>

                {/* Niveau d'éducation */}
                <div className="mt-4">
                  <label htmlFor="niveau_education" className="block text-sm font-medium text-gray-700">
                    Niveau d'éducation
                  </label>
                  <select
                    id="niveau_education"
                    value={data.niveau_education}
                    onChange={(e) => setData('niveau_education', e.target.value)}
                    className="mt-1 p-2 w-full border rounded-md"
                  >
                    <option value="">Sélectionner</option>
                    <option value="Primaire">Primaire</option>
                    <option value="Secondaire">Secondaire</option>
                    <option value="Supérieur">Supérieur</option>
                    <option value="Autre">Autre</option>
                  </select>
                  {errors.niveau_education && (
                    <span className="text-red-500 text-sm">{errors.niveau_education}</span>
                  )}
                </div>

                {/* Date d'inscription */}
                <div className="mt-4">
                  <label htmlFor="date_inscription" className="block text-sm font-medium text-gray-700">
                    Date d'inscription
                  </label>
                  <input
                    type="date"
                    id="date_inscription"
                    value={data.date_inscription}
                    onChange={(e) => setData('date_inscription', e.target.value)}
                    className="mt-1 p-2 w-full border rounded-md"
                  />
                  {errors.date_inscription && (
                    <span className="text-red-500 text-sm">{errors.date_inscription}</span>
                  )}
                </div>

                {/* Statut actuel */}
                <div className="mt-4">
                  <label htmlFor="statut_actuel" className="block text-sm font-medium text-gray-700">
                    Statut actuel
                  </label>
                  <select
                    id="statut_actuel"
                    value={data.statut_actuel}
                    onChange={(e) => setData('statut_actuel', e.target.value)}
                    className="mt-1 p-2 w-full border rounded-md"
                  >
                    <option value="">Sélectionner</option>
                    <option value="Actif">Actif</option>
                    <option value="Inactif">Inactif</option>
                    <option value="En attente">En attente</option>
                  </select>
                  {errors.statut_actuel && (
                    <span className="text-red-500 text-sm">{errors.statut_actuel}</span>
                  )}
                </div>

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

export default BeneficiaireFormModal;
