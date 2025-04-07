import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { IndicateurCalculator } from '@/Utils/IndicateurCalculator';

interface Entreprise {
  id: number;
  nom_entreprise: string;
}

interface Exercice {
  id: number;
  annee: number;
  date_debut: string;
  date_fin: string;
  actif: boolean;
}

interface Periode {
  id: number;
  type_periode: string;
}

interface CollecteFormProps {
  entreprises: Entreprise[];
  exercices: Exercice[];
  periodes: Periode[];
  collecte?: any;
  isEditing?: boolean;
}

const CollecteForm: React.FC<CollecteFormProps> = ({
  entreprises,
  exercices,
  periodes,
  collecte,
  isEditing = false,
}) => {
  // État pour le suivi de l'étape actuelle
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState('financier');

  // Récupérer les données initiales si on est en mode édition
  const initialDonnees = isEditing && collecte?.donnees
    ? typeof collecte.donnees === 'string'
      ? JSON.parse(collecte.donnees)
      : collecte.donnees
    : {};

  // Configuration du formulaire
  const { data, setData, post, put, processing, errors } = useForm({
    entreprise_id: isEditing && collecte ? collecte.entreprise_id.toString() : '',
    exercice_id: isEditing && collecte ? collecte.exercice_id.toString() : '',
    periode_id: isEditing && collecte ? collecte.periode_id.toString() : '',
   // indicateur_id: isEditing && collecte ? collecte.indicateur_id.toString() : '1', // Utiliser l'ID d'un indicateur par défaut
    date_collecte: isEditing && collecte ? collecte.date_collecte : new Date().toISOString().split('T')[0],
    donnees: initialDonnees,
  });

  // Catégories d'indicateurs disponibles
  const categories = [
    { id: 'financier', label: 'Indicateurs Financiers' },
    { id: 'commercial', label: 'Indicateurs Commerciaux' },
    { id: 'production', label: 'Production' },
    { id: 'rh', label: 'Ressources Humaines' },
    { id: 'tresorerie', label: 'Trésorerie' },
  ];

  // Mise à jour d'un champ d'indicateur
  const handleIndicateurChange = (category: string, fieldId: string, value: string) => {
    const updatedCategory = {
      ...(data.donnees[category] || {}),
      [fieldId]: value,
    };

    // Calculer les indicateurs dérivés pour cette catégorie
    const calculatedData = IndicateurCalculator.calculateDerivedFields(
      category,
      updatedCategory
    );

    // Mettre à jour les données du formulaire
    setData('donnees', {
      ...data.donnees,
      [category]: calculatedData,
    });
  };

  // Soumettre le formulaire
  

    // Valider les champs obligatoires pour toutes les catégories
    const handleSubmit = (e) => {
        e.preventDefault();

        const dataToSubmit = {
          entreprise_id: data.entreprise_id,
          exercice_id: data.exercice_id,
          periode_id: data.periode_id,
          date_collecte: data.date_collecte,
          donnees: data.donnees
        };

        console.log("Formulaire soumis - données complètes:", dataToSubmit);

        if (isEditing && collecte) {
          put(route('collectes.update', collecte.id), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
              toast.success('Collecte mise à jour avec succès');
            },
            onError: (errors) => {
              console.error('Erreurs de validation:', errors);
              Object.values(errors).forEach(error => toast.error(error));
            }
          });
        } else {
          post(route('collectes.store'), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
              toast.success('Collecte enregistrée avec succès');
              // Réinitialiser le formulaire
              setData({
                entreprise_id: '',
                exercice_id: '',
                periode_id: '',
                date_collecte: new Date().toISOString().split('T')[0],
                donnees: {},
              });
              setStep(1);
            },
            onError: (errors) => {
              console.error('Erreurs de validation:', errors);
              Object.values(errors).forEach(error => toast.error(error));
            }
          });
        }
      };
  // Vérifier si on peut passer à l'étape suivante
  const canProceedToStep2 = data.entreprise_id && data.exercice_id && data.periode_id && data.date_collecte;

  return (
    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
      <div className="p-6 bg-white border-b border-gray-200">
        <h1 className="text-2xl font-semibold mb-6">
          {isEditing ? "Modifier la collecte" : "Nouvelle collecte d'indicateurs"}
        </h1>

        <form onSubmit={handleSubmit}>
          {/* Étape 1: Sélection de l'entreprise, période, exercice */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sélection de l'entreprise */}
                <div>
                  <label htmlFor="entreprise_id" className="block text-sm font-medium text-gray-700">
                    Entreprise
                  </label>
                  <select
                    id="entreprise_id"
                    name="entreprise_id"
                    value={data.entreprise_id}
                    onChange={e => setData('entreprise_id', e.target.value)}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                      errors.entreprise_id ? 'border-red-500' : ''
                    }`}
                  >
                    <option value="">Sélectionner une entreprise</option>
                    {entreprises.map(entreprise => (
                      <option key={entreprise.id} value={entreprise.id.toString()}>
                        {entreprise.nom_entreprise}
                      </option>
                    ))}
                  </select>
                  {errors.entreprise_id && (
                    <p className="mt-1 text-sm text-red-500">{errors.entreprise_id}</p>
                  )}
                </div>

                {/* Sélection de l'exercice */}
                <div>
                  <label htmlFor="exercice_id" className="block text-sm font-medium text-gray-700">
                    Exercice
                  </label>
                  <select
                    id="exercice_id"
                    name="exercice_id"
                    value={data.exercice_id}
                    onChange={e => setData('exercice_id', e.target.value)}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                      errors.exercice_id ? 'border-red-500' : ''
                    }`}
                  >
                    <option value="">Sélectionner un exercice</option>
                    {exercices.map(exercice => (
                      <option key={exercice.id} value={exercice.id.toString()}>
                        {exercice.annee} {exercice.actif ? '(Actif)' : ''}
                      </option>
                    ))}
                  </select>
                  {errors.exercice_id && (
                    <p className="mt-1 text-sm text-red-500">{errors.exercice_id}</p>
                  )}
                </div>




                {/* Sélection de la période */}
                <div>
                  <label htmlFor="periode_id" className="block text-sm font-medium text-gray-700">
                    Période
                  </label>
                  <select
                    id="periode_id"
                    name="periode_id"
                    value={data.periode_id}
                    onChange={e => setData('periode_id', e.target.value)}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                      errors.periode_id ? 'border-red-500' : ''
                    }`}
                  >
                    <option value="">Sélectionner une période</option>
                    {periodes.map(periode => (
                      <option key={periode.id} value={periode.id.toString()}>
                        {periode.type_periode}
                      </option>
                    ))}
                  </select>
                  {errors.periode_id && (
                    <p className="mt-1 text-sm text-red-500">{errors.periode_id}</p>
                  )}
                </div>

                {/* Date de collecte */}
                <div>
                  <label htmlFor="date_collecte" className="block text-sm font-medium text-gray-700">
                    Date de collecte
                  </label>
                  <input
                    type="date"
                    id="date_collecte"
                    name="date_collecte"
                    value={data.date_collecte}
                    onChange={e => setData('date_collecte', e.target.value)}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                      errors.date_collecte ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.date_collecte && (
                    <p className="mt-1 text-sm text-red-500">{errors.date_collecte}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!canProceedToStep2}
                  className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  Continuer
                </button>
              </div>
            </div>
          )}

          {/* Étape 2: Saisie des indicateurs */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Retour
                </button>

                <div>
                  <span className="text-sm font-medium text-gray-500">
                    {isEditing ? "Modifier la collecte" : "Nouvelle collecte"} -
                    Entreprise: {entreprises.find(e => e.id.toString() === data.entreprise_id)?.nom_entreprise || ''} -
                    Période: {periodes.find(p => p.id.toString() === data.periode_id)?.type_periode || ''}
                  </span>
                </div>
              </div>

              {/* Onglets des catégories */}
              <div>
                <div className="sm:hidden">
                  <label htmlFor="tabs" className="sr-only">
                    Sélectionner une catégorie
                  </label>
                  <select
                    id="tabs"
                    name="tabs"
                    className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    value={activeTab}
                    onChange={e => setActiveTab(e.target.value)}
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="hidden sm:block">
                  <nav className="flex space-x-4" aria-label="Tabs">
                    {categories.map(category => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => setActiveTab(category.id)}
                        className={`
                          px-3 py-2 text-sm font-medium rounded-md
                          ${activeTab === category.id
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'text-gray-500 hover:text-gray-700'}
                        `}
                      >
                        {category.label}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Champs des indicateurs par catégorie */}
              <div className="mt-4 bg-gray-50 p-4 rounded-md">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {categories.find(category => category.id === activeTab)?.label}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {IndicateurCalculator.getFieldsByCategory(activeTab).map(field => {
                    const isCalculated = field.type === 'calculated';
                    const fieldValue = data.donnees[activeTab]?.[field.id] || '';
                    const fieldUnit = field.unite || '';

                    return (
                      <div key={field.id} className="space-y-1">
                        <label
                          htmlFor={`${activeTab}_${field.id}`}
                          className="block text-sm font-medium text-gray-700"
                        >
                          {field.label}
                          {field.required && !isCalculated && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </label>

                        <div className="relative mt-1 rounded-md shadow-sm">
                          <input
                            type={isCalculated ? "text" : "number"}
                            id={`${activeTab}_${field.id}`}
                            name={`${activeTab}_${field.id}`}
                            value={fieldValue}
                            onChange={e => handleIndicateurChange(activeTab, field.id, e.target.value)}
                            readOnly={isCalculated}
                            disabled={isCalculated}
                            className={`
                              block w-full rounded-md sm:text-sm
                              ${isCalculated
                                ? 'bg-gray-50 text-gray-500'
                                : 'bg-white text-gray-900'}
                              ${fieldUnit ? 'pr-12' : 'pr-3'}
                              pl-3 py-2 border border-gray-300
                              focus:border-indigo-500 focus:ring-indigo-500
                            `}
                            placeholder={isCalculated ? 'Calculé automatiquement' : `Saisir ${field.label.toLowerCase()}`}
                          />
                          {fieldUnit && (
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                              <span className="text-gray-500 sm:text-sm">
                                {fieldUnit}
                              </span>
                            </div>
                          )}
                        </div>

                        {isCalculated && field.description && (
                          <p className="mt-1 text-xs text-gray-500">
                            {field.description}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end pt-4 space-x-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Retour
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {processing ? 'Enregistrement...' : (isEditing ? 'Mettre à jour' : 'Enregistrer')}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CollecteForm;
