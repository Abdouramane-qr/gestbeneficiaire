import React, { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface CardMetriqueProps {
  titre: string;
  valeur: number;
  unite?: string;
  icon: ReactNode;
  couleur: 'blue' | 'green' | 'red' | 'orange' | 'purple' | 'indigo';
  tendance?: 'hausse' | 'baisse' | 'stable';
  pourcentage?: number;
}

const CardMetrique = ({
  titre,
  valeur,
  unite = '',
  icon,
  couleur = 'blue',
  tendance,
  pourcentage
}: CardMetriqueProps) => {
  // Couleurs pour les différents thèmes
  const couleursTheme: Record<string, { bg: string, border: string, icon: string, text: string }> = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'text-blue-500 bg-blue-100',
      text: 'text-blue-800'
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: 'text-green-500 bg-green-100',
      text: 'text-green-800'
    },
    red: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'text-red-500 bg-red-100',
      text: 'text-red-800'
    },
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      icon: 'text-orange-500 bg-orange-100',
      text: 'text-orange-800'
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      icon: 'text-purple-500 bg-purple-100',
      text: 'text-purple-800'
    },
    indigo: {
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      icon: 'text-indigo-500 bg-indigo-100',
      text: 'text-indigo-800'
    }
  };

  // Couleurs pour les tendances
  const couleursTendance: Record<string, string> = {
    hausse: 'text-green-600',
    baisse: 'text-red-600',
    stable: 'text-gray-600'
  };

  // Icônes pour les tendances
  const iconeTendance = () => {
    if (!tendance) return null;

    switch (tendance) {
      case 'hausse':
        return <TrendingUp className="h-4 w-4 mr-1" />;
      case 'baisse':
        return <TrendingDown className="h-4 w-4 mr-1" />;
      case 'stable':
        return <Minus className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  // Formater la valeur numérique
  const valeurFormatee = new Intl.NumberFormat('fr-FR').format(valeur);

  return (
    <div className={`p-5 rounded-lg shadow-sm border ${couleursTheme[couleur].border} ${couleursTheme[couleur].bg}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{titre}</p>
          <div className="flex items-baseline">
            <p className="text-2xl font-bold text-gray-900">
              {valeurFormatee}
              {unite && <span className="text-sm font-medium text-gray-600 ml-1">{unite}</span>}
            </p>
          </div>

          {/* Indicateur de tendance */}
          {tendance && (
            <div className={`mt-2 flex items-center ${couleursTendance[tendance]}`}>
              {iconeTendance()}
              <span className="text-sm font-medium">
                {pourcentage ? `${pourcentage > 0 ? '+' : ''}${pourcentage}%` : ''}
                {tendance === 'hausse' ? 'En hausse' : tendance === 'baisse' ? 'En baisse' : 'Stable'}
              </span>
            </div>
          )}
        </div>

        {/* Icône */}
        <div className={`p-2 rounded-md ${couleursTheme[couleur].icon}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default CardMetrique;
