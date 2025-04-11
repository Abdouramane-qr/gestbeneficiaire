// resources/js/Components/Analyse/IndicateurDetailModal.jsx
import React from 'react';
import { X, Home } from 'lucide-react';
import { Link } from '@inertiajs/react';

const IndicateurDetailModal = ({ isOpen, onClose, indicateur }) => {
  if (!isOpen || !indicateur) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header amélioré avec titre et description */}
          <div className="bg-white px-4 pt-5 pb-4 sm:px-6 border-b">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  {indicateur.nom}
                </h3>
                {indicateur.description && (
                  <p className="mt-1 text-sm text-gray-500">
                    {indicateur.description || "Aucune description disponible"}
                  </p>
                )}
              </div>
              <button
                type="button"
                className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={onClose}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Tableau des données de l'indicateur */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Propriété
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valeur
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr className="bg-white">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Catégorie</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{indicateur.categorie}</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Valeur</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {indicateur.valeur}
                    <span className={
                      indicateur.tendance === 'hausse' ? 'text-green-600 ml-2' :
                      indicateur.tendance === 'baisse' ? 'text-red-600 ml-2' :
                      'text-gray-600 ml-2'
                    }>
                      {indicateur.tendance === 'hausse' && '↑ '}
                      {indicateur.tendance === 'baisse' && '↓ '}
                      {indicateur.tendance === 'stable' && '→ '}
                      {indicateur.tendance}
                    </span>
                  </td>
                </tr>
                <tr className="bg-white">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Entreprise</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{indicateur.entreprise_nom}</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Région</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{indicateur.region}</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Province</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{indicateur.province}</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Commune</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{indicateur.commune}</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Type de bénéficiaire</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{indicateur.typeBeneficiaire}</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Genre</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{indicateur.genre}</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Secteur d'activité</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{indicateur.secteur_activite}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footer avec boutons */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex justify-between">
            <Link
              href={route('dashboard')}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
            >
              <Home className="mr-2 h-4 w-4" />
              Accueil
            </Link>

            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none"
              onClick={onClose}
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndicateurDetailModal;
