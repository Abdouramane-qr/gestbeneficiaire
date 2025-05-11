// import React, { useState } from 'react';
// import { PlusIcon } from 'lucide-react';
// import FormulaireExceptionnelModal from '@/components/OccasionnelModal';
// interface Beneficiaire {
//   id: number;
//   nom: string;
//   prenom: string;
// }

// interface Exercice {
//   id: number;
//   annee: number;
// }

// interface FormulaireExceptionnelButtonProps {
//   beneficiaires: Beneficiaire[];
//   exercices: Exercice[];
//   variant?: 'primary' | 'secondary';
//   size?: 'sm' | 'md' | 'lg';
//   className?: string;
// }

// /**
//  * Bouton qui ouvre un modal pour créer un formulaire exceptionnel
//  * Peut être intégré à n'importe quelle page, notamment la page Collectes
//  */
// export const FormulaireExceptionnelButton: React.FC<FormulaireExceptionnelButtonProps> = ({
//   beneficiaires,
//   //exercices,
//   variant = 'primary',
//   size = 'md',
//   className = '',
// }) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const openModal = () => {
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//   };

//   // Styles selon la variante
//   const variantClasses = {
//     primary: 'bg-blue-600 hover:bg-blue-700 text-white',
//     secondary: 'bg-green-600 hover:bg-green-700 text-white',
//   };

//   // Styles selon la taille
//   const sizeClasses = {
//     sm: 'px-3 py-1.5 text-xs',
//     md: 'px-4 py-2 text-sm',
//     lg: 'px-5 py-3 text-base',
//   };

//   return (
//     <>
//       <button
//         onClick={openModal}
//         className={`inline-flex items-center border border-transparent rounded-md font-semibold tracking-widest focus:outline-none focus:ring focus:ring-opacity-50 transition ease-in-out duration-150 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
//       >
//         <PlusIcon className="w-4 h-4 mr-2" />
//         Formulaire Exceptionnel
//       </button>

//       {isModalOpen && (
//         <FormulaireExceptionnelModal
//           isOpen={isModalOpen}
//           closeModal={closeModal}
//           beneficiaires={beneficiaires}
//           //exercices={exercices}
//         />
//       )}
//     </>
//   );
// };

// export default FormulaireExceptionnelButton;
import React, { useState } from 'react';
import { useOfflineStorage } from '@/hooks/useOfflineStorage';
import { ClipboardIcon, WifiOffIcon, WifiIcon } from 'lucide-react';
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
  className?: string;
}

const FormulaireExceptionnelButton: React.FC<FormulaireExceptionnelButtonProps> = ({
  beneficiaires,
  exercices,
  variant = 'primary',
  className = '',
}) => {
  const [showModal, setShowModal] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Utiliser notre hook de stockage hors ligne
  const { } = useOfflineStorage();

  // Surveiller l'état de la connexion
  React.useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  // Classes pour les variantes de style
  const buttonClasses = variant === 'primary'
    ? "inline-flex items-center justify-center rounded-lg border-2 border-blue-600 bg-blue-600 px-5 py-3 text-white shadow-md hover:bg-blue-700 dark:border-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
    : "inline-flex items-center justify-center rounded-lg border-2 border-gray-300 bg-white px-5 py-3 text-gray-700 shadow-md hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600";

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className={`${buttonClasses} ${className} relative`}
      >
        <ClipboardIcon className="mr-2 h-4 w-4" />
        <span>Collecte exceptionnelle</span>

        {/* Indicateur de connexion (petit point) */}
        <span className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-amber-500'}`}></span>
      </button>

      {/* Modal */}
      <FormulaireExceptionnelModal
        isOpen={showModal}
        closeModal={() => setShowModal(false)}
        beneficiaires={beneficiaires}
        exercices={exercices}
      />
    </>
  );
};

export default FormulaireExceptionnelButton;
