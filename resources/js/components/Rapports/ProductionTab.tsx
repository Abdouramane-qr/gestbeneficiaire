import { IndicateurCalculator } from '@/Utils/IndicateurCalculator';
import React, { useEffect, useState } from 'react';

interface IndicateurProductionData {
  [key: string]: string;
}

interface ProductionTabProps {
  data: IndicateurProductionData;
  onChange: (data: IndicateurProductionData) => void;
  errors: string[];
}

const ProductionTab: React.FC<ProductionTabProps> = ({ data, onChange, errors }) => {
  // Obtenir la définition des champs pour les indicateurs de production
  const fields = IndicateurCalculator.getFieldsByCategory('production');

  // Suivi local des valeurs des champs
  const [values, setValues] = useState<IndicateurProductionData>(data);

  // Mettre à jour les valeurs locales lorsque les données externes changent
  useEffect(() => {
    setValues(data);
  }, [data]);

  // Gestionnaire de changement pour les champs de saisie
  const handleInputChange = (fieldId: string, value: string) => {
    // Mettre à jour l'état local
    const updatedValues = {
      ...values,
      [fieldId]: value
    };
    setValues(updatedValues);

    // Propager les changements vers le parent
    onChange(updatedValues);
  };

  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-blue-600 dark:text-blue-400">
          Indicateurs de production
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map((field) => {
          const isCalculated = field.type === 'calculated';
          const unit = field.unite || '';

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
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductionTab;
