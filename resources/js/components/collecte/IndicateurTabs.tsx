// import React from 'react';
// import { IndicateurField } from '@/types/collecte';
// import { Entreprise, Periode } from '@/types/collecte';

// interface IndicateurTabsProps {
//     fieldsByCategory: Record<string, IndicateurField[]>;
//     dynamicFields: Record<string, string>;
//     onFieldChange: (fieldId: string, value: string) => void;
//     onSubmit: () => void;
//     onPrev: () => void;
//     selectedEntreprise: Entreprise | null;
//     selectedPeriode: Periode | null;
//     dateCollecte: string;
// }

// export function IndicateurTabs({
//     fieldsByCategory,
//     dynamicFields,
//     onFieldChange,
//     onSubmit,
//     onPrev,
//     selectedEntreprise,
//     selectedPeriode,
//     dateCollecte
// }: IndicateurTabsProps) {
//     const [activeTab, setActiveTab] = React.useState(Object.keys(fieldsByCategory)[0] || '');

//     return (
//         <div className="space-y-6">
//             <div className="bg-gray-50 p-6 rounded-lg mb-6">
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Entreprise</label>
//                         <div className="p-2 bg-white border border-gray-300 rounded-md">
//                             {selectedEntreprise?.nom_entreprise || "Non sélectionnée"}
//                         </div>
//                     </div>
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Période</label>
//                         <div className="p-2 bg-white border border-gray-300 rounded-md">
//                             {selectedPeriode?.nom || "Non sélectionnée"}
//                         </div>
//                     </div>
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Date collecte</label>
//                         <div className="p-2 bg-white border border-gray-300 rounded-md">
//                             {dateCollecte}
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <div className="border-b border-gray-200">
//                 <nav className="-mb-px flex space-x-8">
//                     {Object.keys(fieldsByCategory).map(category => (
//                         <button
//                             key={category}
//                             type="button"
//                             onClick={() => setActiveTab(category)}
//                             className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
//                                 activeTab === category
//                                     ? 'border-blue-600 text-blue-600'
//                                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                             }`}
//                         >
//                             {category}
//                         </button>
//                     ))}
//                 </nav>
//             </div>

//             <div className="bg-white p-4 rounded-md">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {fieldsByCategory[activeTab]?.map(field => (
//                         <div key={field.id} className="mb-4">
//                             <div className="flex justify-between">
//                                 <label className="block text-sm font-medium text-gray-700">
//                                     {field.label}
//                                     {field.required && <span className="text-red-500 ml-1">*</span>}
//                                 </label>
//                                 {field.unite && (
//                                     <span className="text-gray-500 text-sm">{field.unite}</span>
//                                 )}
//                             </div>
//                             <div className="mt-1">
//                                 <input
//                                     type={field.type === 'number' ? 'number' : 'text'}
//                                     className="p-2 w-full border border-gray-300 rounded-md"
//                                     value={dynamicFields[field.id] || ''}
//                                     onChange={(e) => onFieldChange(field.id, e.target.value)}
//                                     required={field.required}
//                                 />
//                                 {field.formula && (
//                                     <p className="mt-1 text-xs text-gray-500 italic">
//                                         {field.formula}
//                                     </p>
//                                 )}
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             <div className="flex justify-between pt-4">
//                 <button
//                     type="button"
//                     className="px-4 py-2 bg-gray-600 text-white rounded-md"
//                     onClick={onPrev}
//                 >
//                     Précédent
//                 </button>
//                 <button
//                     type="button"
//                     className="px-4 py-2 bg-blue-600 text-white rounded-md"
//                     onClick={onSubmit}
//                 >
//                     Enregistrer
//                 </button>
//             </div>
//         </div>
//     );
// }
import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { IndicateurCalculator } from '@/Utils/IndicateurCalculator';
import FinancierTab from '../Rapports/FinanciersTab';
import ProductionTab from '../Rapports/ProductionTab';
import CommerciauxTab from '../Rapports/CommerciauxTab';
import RHTab from '../Rapports/RHTab';
import TresorerieTab from '../Rapports/TresorerieTab';


interface IndicateursTabsProps {
  entrepriseId: number;
  periodeId: number;
  exerciceId: number;
  initialData?: Record<string, any>;
}

const IndicateursTabs: React.FC<IndicateursTabsProps> = ({
  entrepriseId,
  periodeId,
  exerciceId,
  initialData = {}
}) => {
  // État pour stocker toutes les valeurs des indicateurs
  const [indicateursData, setIndicateursData] = useState<Record<string, any>>({
    ...initialData,
    entreprise_id: entrepriseId,
    periode_id: periodeId,
    exercice_id: exerciceId
  });

  // État pour suivre les erreurs de validation
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  // État pour suivre l'onglet actif
  const [activeTab, setActiveTab] = useState(0);

  // Configuration du formulaire Inertia
  const { post, processing } = useForm();

  // Fonction pour mettre à jour les données d'indicateurs
  const updateIndicateursData = (category: string, data: Record<string, any>) => {
    setIndicateursData(prev => {
      const updated = {
        ...prev,
        [category]: {
          ...(prev[category] || {}),
          ...data
        }
      };

      // Si nous mettons à jour les indicateurs financiers, recalculer les indicateurs dépendants
      if (category === 'financier') {
        // Calculer les indicateurs dérivés pour la catégorie financière
        const calculatedFinanciers = IndicateurCalculator.calculateDerivedFields('financier', data);

        // Mettre à jour la trésorerie si certains champs financiers ont changé
        if (updated['tresorerie']) {
          const calculatedTresorerie = IndicateurCalculator.calculateDerivedFields('tresorerie', {
            ...updated['tresorerie'],
            chiffre_affaires: data.chiffre_affaires,
            cout_production: prev.production?.cout_production
          });

          updated['tresorerie'] = {
            ...updated['tresorerie'],
            ...calculatedTresorerie
          };
        }

        updated['financier'] = {
          ...data,
          ...calculatedFinanciers
        };
      }

      // Calculer les indicateurs dérivés pour la catégorie spécifique
      return IndicateurCalculator.calculateAll(updated);
    });
  };

  // Fonction pour valider tous les onglets
  const validateAllTabs = () => {
    const allErrors: Record<string, string[]> = {};

    // Valider chaque catégorie
    ['financier', 'commercial', 'production', 'rh', 'tresorerie'].forEach(category => {
      const categoryErrors = IndicateurCalculator.validateFields(
        indicateursData[category] || {},
        category as any
      );

      if (categoryErrors.length > 0) {
        allErrors[category] = categoryErrors;
      }
    });

    setErrors(allErrors);
    return Object.keys(allErrors).length === 0;
  };

  // Fonction pour soumettre les indicateurs
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAllTabs()) {
      toast.error("Veuillez corriger les erreurs avant de soumettre le formulaire");
      return;
    }

    // Soumettre les données à l'API
    post(route('collectes.store'), {
      data: indicateursData,
      onSuccess: () => {
        toast.success("Les indicateurs ont été enregistrés avec succès");
      },
      onError: (errors) => {
        setErrors(errors);
        toast.error("Erreur lors de l'enregistrement des indicateurs");
      }
    });
  };

  // Fonction pour enregistrer un brouillon
  const saveDraft = () => {
    post(route('collectes.draft'), {
      data: indicateursData,
      onSuccess: () => {
        toast.success("Le brouillon a été enregistré avec succès");
      },
      onError: () => {
        toast.error("Erreur lors de l'enregistrement du brouillon");
      }
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-5 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          COLLECTE DES INDICATEURS D'ENTREPRISE
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
          <Tab.List className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
            <Tab className={({ selected }) =>
              `py-3 px-4 text-sm font-medium text-center focus:outline-none ${
                selected
                  ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-500 dark:border-blue-500'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`
            }>
              Indicateurs Financiers
            </Tab>
            <Tab className={({ selected }) =>
              `py-3 px-4 text-sm font-medium text-center focus:outline-none ${
                selected
                  ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-500 dark:border-blue-500'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`
            }>
              Indicateurs Commerciaux
            </Tab>
            <Tab className={({ selected }) =>
              `py-3 px-4 text-sm font-medium text-center focus:outline-none ${
                selected
                  ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-500 dark:border-blue-500'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`
            }>
              Ressources Humaines
            </Tab>
            <Tab className={({ selected }) =>
              `py-3 px-4 text-sm font-medium text-center focus:outline-none ${
                selected
                  ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-500 dark:border-blue-500'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`
            }>
              Production
            </Tab>
            <Tab className={({ selected }) =>
              `py-3 px-4 text-sm font-medium text-center focus:outline-none ${
                selected
                  ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-500 dark:border-blue-500'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`
            }>
              Trésorerie
            </Tab>
          </Tab.List>

          <Tab.Panels className="p-4">
            <Tab.Panel>
              <FinancierTab
                data={indicateursData.financier || {}}
                onChange={(data) => updateIndicateursData('financier', data)}
                errors={errors.financier || []}
              />
            </Tab.Panel>
            <Tab.Panel>
              <CommerciauxTab
                data={indicateursData.commercial || {}}
                onChange={(data) => updateIndicateursData('commercial', data)}
                errors={errors.commercial || []}
              />
            </Tab.Panel>
            <Tab.Panel>
              <RHTab
                data={indicateursData.rh || {}}
                onChange={(data) => updateIndicateursData('rh', data)}
                errors={errors.rh || []}
              />
            </Tab.Panel>
            <Tab.Panel>
              <ProductionTab
                data={indicateursData.production || {}}
                onChange={(data) => updateIndicateursData('production', data)}
                errors={errors.production || []}
              />
            </Tab.Panel>
            <Tab.Panel>
              <TresorerieTab
                data={indicateursData.tresorerie || {}}
                onChange={(data) => updateIndicateursData('tresorerie', data)}
                errors={errors.tresorerie || []}
                // Passage des données financières pour les calculs dérivés
                financialData={indicateursData.financier || {}}
                productionData={indicateursData.production || {}}
              />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>

        <div className="flex justify-end space-x-4 p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={saveDraft}
            disabled={processing}
            className="px-4 py-2 text-sm font-medium text-blue-700 bg-white border border-blue-300 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Enregistrer brouillon
          </button>
          <button
            type="submit"
            disabled={processing}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Soumettre
          </button>
        </div>
      </form>
    </div>
  );
};

export default IndicateursTabs;
