import React from 'react';
import { Periode } from './periodeTypes';
import { PeriodeNameGenerator } from './PeriodeNameGenerator';

interface PeriodeBadgeProps {
  periode: Periode;
  className?: string;
}

const PeriodeBadge: React.FC<PeriodeBadgeProps> = ({ periode, className = '' }) => {
  const periodeName = PeriodeNameGenerator.getPeriodeNamesForExercice([periode]).get(periode.id) ||
                     periode.type_periode;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${className}`}>
      {periodeName}
    </span>
  );
};

export default PeriodeBadge;
