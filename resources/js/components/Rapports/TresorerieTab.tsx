import { IndicateurCalculator } from '@/Utils/IndicateurCalculator';
import React, { useEffect, useState } from 'react';

interface IndicateurTresorerieData {
  [key: string]: string;
}

interface TresorerieTabProps {
  data: IndicateurTresorerieData;
  onChange: (data: IndicateurTresorerieData) => void;
  errors: string[];
  financialData?: Record<string, string>; // Données financières pour les calculs dépendants
  productionData?: Record<string, string>; // Données de production pour les calculs dépendants
}

const TresorerieTab: React.FC<TresorerieTabProps> = ({
  data,
  onChange,
  errors,
  financialData = {},
  productionData = {}
}) => {
  // Obtenir la définition des champs pour les indicateurs de trésorerie
  const fields = IndicateurCalculator.getFieldsByCategory('tresorerie');

  // Suivi local des valeurs des champs
  const [values, setValues] = useState<IndicateurTresorerieData>(data);

  // Mettre à jour les valeurs locales lorsque les données externes changent
  useEffect(() => {
    setValues(data);
  }, [data]);

  // Mettre à jour les calculs dépendant des données financières
  useEffect(() => {
    if (Object.keys(financialData).length > 0 || Object.keys(productionData).length > 0) {
      // Mettre à jour les indicateurs calculés qui dépendent d'autres catégories
      const combinedData = {
        ...values,
        // Ajouter les champs nécessaires des données financières
        chiffre_affaires: financialData.chiffre_affaires,
        // Ajouter les champs nécessaires des données de production
        cout_production: productionData.cout_production
      };

      // Calculer les indicateurs dérivés
      const calculatedValues = IndicateurCalculator.calculateDerivedFields('tresorerie', combinedData);

      // Ne mettre à jour que si les valeurs calculées sont différentes
      if (JSON.stringify(calculatedValues) !== JSON.stringify(values)) {
        setValues(calculatedValues);
        onChange(calculatedValues);
      }
    }
  }, [financialData, productionData, values, onChange]);

  // Gestionnaire de changement pour les champs de saisie
  const handleInputChange = (fieldId: string, value: string) => {
    // Mettre à jour l'état local
    const updatedValues = {
      ...values,
      [fieldId]: value
    };

    // Ajouter les données financières et de production nécessaires pour les calculs
    const dataForCalculation = {
      ...updatedValues,
      chiffre_affaires: financialData.chiffre_affaires,
      cout_production: productionData.cout_production
    };

    // Calculer les champs dérivés
    const calculatedValues = IndicateurCalculator.calculateDerivedFields('tresorerie', dataForCalculation);

    setValues(calculatedValues);

    // Propager les changements vers le parent
    onChange(calculatedValues);
  };

  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-blue-600 dark:text-blue-400">
          Indicateurs de trésorerie
          <span className="ml-2 text-sm text-yellow-600 dark:text-yellow-400 font-normal">
            {fields.filter(field => field.required && field.type !== 'calculated').length} indicateurs requis
          </span>
        </h3>
      </div>

      {/* Afficher les erreurs s'il y en a */}
      {errors.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
          <ul className="list-disc pl-5 text-sm text-red-600 dark:text-red-400">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Avertissement si les données financières ou de production sont absentes */}
      {(!financialData.chiffre_affaires || !productionData.cout_production) && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md mb-4">
          <p className="text-sm text-yellow-600 dark:text-yellow-400">
            Certains indicateurs de trésorerie nécessitent des données financières et de production pour être calculés correctement.
            Veuillez remplir ces onglets pour des calculs précis.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map((field) => {
          const isCalculated = field.type === 'calculated';
          const unit = field.unite || '';

          // Vérifier si ce champ calculé dépend de données externes
          const dependsOnExternal = isCalculated && (
            field.formula?.includes('chiffre_affaires') ||
            field.formula?.includes('cout_production')
          );

          // Message d'avertissement pour les champs dépendants
          const warningMessage = dependsOnExternal && (!financialData.chiffre_affaires || !productionData.cout_production)
            ? "Nécessite des données des onglets Financiers et Production"
            : "";

          return (
            <div key={field.id} className="space-y-1">
              <div className="flex justify-between">
                <label
                  htmlFor={field.id}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {field.label}
                  {field.required && !isCalculated && (
                    <span className="ml-1 text-red-500">*</span>
                  )}
                </label>
                {isCalculated && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 italic">
                    Calculé automatiquement
                  </span>
                )}
              </div>

              <div className="relative mt-1 rounded-md shadow-sm">
                <input
                  type="text"
                  id={field.id}
                  name={field.id}
                  value={values[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  readOnly={isCalculated}
                  className={`
                    block w-full rounded-md sm:text-sm
                    ${isCalculated
                      ? 'bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'}
                    ${unit ? 'pr-12' : 'pr-3'}
                    pl-3 py-2 border
                    ${errors.length > 0
                      ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500 dark:focus:ring-red-700 dark:focus:border-red-700'
                      : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-700 dark:focus:border-blue-700'}
                  `}
                  placeholder={isCalculated ? 'Calculé' : `Saisir ${field.label.toLowerCase()}`}
                />
                {unit && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-500 dark:text-gray-400 sm:text-sm">
                      {unit}
                    </span>
                  </div>
                )}
              </div>

              {/* Afficher la formule de calcul pour les champs calculés */}
              {isCalculated && field.description && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {field.description}
                </p>
              )}

              {/* Afficher l'avertissement pour les champs dépendants */}
              {warningMessage && (
                <p className="mt-1 text-xs text-yellow-500 dark:text-yellow-400">
                  {warningMessage}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TresorerieTab;
