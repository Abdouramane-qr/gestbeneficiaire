import React from 'react';
import { Periode } from './periodeTypes';
import { PeriodeNameGenerator } from './PeriodeNameGenerator';

interface PeriodeListProps {
  periodes: Periode[];
  selectedPeriodeId?: number;
  onSelect?: (periodeId: number) => void;
  usedPeriodIds?: number[];
}

const PeriodeList: React.FC<PeriodeListProps> = ({
  periodes,
  selectedPeriodeId,
  onSelect,
  usedPeriodIds = []
}) => {
  const periodeNames = PeriodeNameGenerator.getPeriodeNamesForExercice(periodes);

  return (
    <div className="space-y-2">
      {periodes.map(periode => {
        const isUsed = usedPeriodIds.includes(periode.id);
        const isSelected = selectedPeriodeId === periode.id;

        return (
          <div
            key={periode.id}
            onClick={() => !isUsed && onSelect?.(periode.id)}
            className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
              isUsed
                ? 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400 cursor-not-allowed'
                : isSelected
                  ? 'bg-indigo-50 dark:bg-indigo-900 border-indigo-300 dark:border-indigo-700'
                  : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">
                {periodeNames.get(periode.id) || periode.type_periode}
              </span>
              {isUsed && (
                <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
                  Used
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {new Date(periode.date_debut).toLocaleDateString()} - {new Date(periode.date_fin).toLocaleDateString()}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PeriodeList;
