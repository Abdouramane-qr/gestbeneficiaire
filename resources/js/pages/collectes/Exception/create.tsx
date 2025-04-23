import React, { useState } from 'react';
import { PlusIcon } from 'lucide-react';
import FormulaireExceptionnelModal from '@/components/OccasionnelModal';
interface Beneficiaire {
  id: number;
  nom: string;
  prenom: string;
}

interface Exercice {
  id: number;
  annee: number;
}

interface FormulaireExceptionnelButtonProps {
  beneficiaires: Beneficiaire[];
  exercices: Exercice[];
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Bouton qui ouvre un modal pour créer un formulaire exceptionnel
 * Peut être intégré à n'importe quelle page, notamment la page Collectes
 */
export const FormulaireExceptionnelButton: React.FC<FormulaireExceptionnelButtonProps> = ({
  beneficiaires,
  //exercices,
  variant = 'primary',
  size = 'md',
  className = '',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Styles selon la variante
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-green-600 hover:bg-green-700 text-white',
  };

  // Styles selon la taille
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-3 text-base',
  };

  return (
    <>
      <button
        onClick={openModal}
        className={`inline-flex items-center border border-transparent rounded-md font-semibold tracking-widest focus:outline-none focus:ring focus:ring-opacity-50 transition ease-in-out duration-150 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      >
        <PlusIcon className="w-4 h-4 mr-2" />
        Formulaire Exceptionnel
      </button>

      {isModalOpen && (
        <FormulaireExceptionnelModal
          isOpen={isModalOpen}
          closeModal={closeModal}
          beneficiaires={beneficiaires}
          //exercices={exercices}
        />
      )}
    </>
  );
};

export default FormulaireExceptionnelButton;
