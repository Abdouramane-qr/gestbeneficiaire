// resources/js/Components/FormationsSection.tsx
import React, { useState, useEffect } from 'react';
import { useFormations } from '@/hooks/useFormations';
import { PlusCircle, Edit2, Save, Trash2, X } from 'lucide-react';

interface FormationsSectionProps {
  formationRecu: boolean;
  setFormationRecu: (value: boolean) => void;
  selectedFormations: string[];
  setSelectedFormations: (formations: string[]) => void;
  formationType: 'technique' | 'entrepreneuriat';
  label?: string;
}

const FormationsSection: React.FC<FormationsSectionProps> = ({
  formationRecu,
  setFormationRecu,
  selectedFormations,
  setSelectedFormations,
  formationType,
  label
}) => {
  const {
    formations,
    loading,
    error,
    isOnline,
    pendingOperationsCount,

    addFormation,
    updateFormation,
    deleteFormation,
    reload,
    synchronize,
    clearError
  } = useFormations(formationType);

  const [newFormation, setNewFormation] = useState<string>('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editFormationValue, setEditFormationValue] = useState<string>('');

  // Effacer le message d'erreur au changement d'état
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  // Handler pour la sélection/désélection d'une formation
  const handleFormationSelect = (libelle: string) => {
    let updatedFormations: string[];

    if (selectedFormations.includes(libelle)) {
      updatedFormations = selectedFormations.filter(item => item !== libelle);
    } else {
      updatedFormations = [...selectedFormations, libelle];
    }

    setSelectedFormations(updatedFormations);
  };

  // Handler pour l'ajout d'une nouvelle formation - OPTIMISÉ
  const handleAddFormation = async () => {
    if (newFormation.trim() === '') return;

    const result = await addFormation(newFormation.trim());
    if (result) {
      // Vider le champ après l'ajout réussi
      setNewFormation('');

      // Auto-sélectionner la nouvelle formation ajoutée
      if (formationRecu) {
        setSelectedFormations([...selectedFormations, result.libelle]);
      }
    }
  };

  // Handler pour démarrer l'édition
  const startEditFormation = (id: number, libelle: string) => {
    setEditingId(id);
    setEditFormationValue(libelle);
  };

  // Handler pour terminer l'édition - OPTIMISÉ
  const finishEditFormation = async () => {
    if (!editingId || editFormationValue.trim() === '') return;

    const oldFormation = formations.find(f => f.id === editingId);
    if (!oldFormation) return;

    const result = await updateFormation(editingId, editFormationValue.trim());

    if (result) {
      // Mettre à jour les sélections si la formation éditée était sélectionnée
      if (selectedFormations.includes(oldFormation.libelle)) {
        setSelectedFormations(prevSelected =>
          prevSelected.map(item =>
            item === oldFormation.libelle ? result.libelle : item
          )
        );
      }
      setEditingId(null);
    }
  };

  // Handler pour la suppression - OPTIMISÉ
  const handleDeleteFormation = async (id: number) => {
    const formationToDelete = formations.find(f => f.id === id);
    if (!formationToDelete) return;

    // Vérifier si la formation est sélectionnée
    const isSelected = selectedFormations.includes(formationToDelete.libelle);

    if (isSelected) {
      if (!confirm('Cette formation est actuellement sélectionnée. Êtes-vous sûr de vouloir la supprimer ?')) {
        return;
      }

      // Supprimer de la sélection immédiatement
      setSelectedFormations(prevSelected =>
        prevSelected.filter(item => item !== formationToDelete.libelle)
      );
    }

    // Supprimer la formation
    await deleteFormation(id);
  };

  // Annuler l'édition
  const cancelEdit = () => {
    setEditingId(null);
  };

  // Gestion des touches clavier dans les inputs
  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  return (
    <div className="space-y-4">
      {/* Checkbox principal pour activer/désactiver la section */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id={`formation_${formationType}_recu`}
          checked={formationRecu}
          onChange={(e) => setFormationRecu(e.target.checked)}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
        />
        <label htmlFor={`formation_${formationType}_recu`} className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
          {label || (formationType === 'technique'
            ? "Avez-vous reçu des formations techniques dans le cadre du projet ?"
            : "Avez-vous reçu des formations en entrepreneuriat dans le cadre du projet ?")}
        </label>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="p-2 bg-red-100 text-red-700 rounded-md text-sm dark:bg-red-900/30 dark:text-red-400">
          {error}
        </div>
      )}

      {formationRecu && (
        <div className="ml-6 space-y-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {formationType === 'technique'
              ? "Sélectionnez les formations techniques reçues :"
              : "Sélectionnez les formations en entrepreneuriat reçues :"}
          </p>

          {/* État de chargement */}
          {loading ? (
            <div className="py-4 text-center text-gray-500 dark:text-gray-400">
              Chargement des formations...
            </div>
          ) : (
            <div>
              {/* Liste des formations disponibles */}
              {formations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {formations.map((formation) => (
                    <div
                      key={formation.id}
                      className="flex items-center justify-between border rounded-md p-2 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600"
                    >
                      <div className="flex items-center flex-grow overflow-hidden">
                        <input
                          type="checkbox"
                          id={`${formationType}-${formation.id}`}
                          checked={selectedFormations.includes(formation.libelle)}
                          onChange={() => handleFormationSelect(formation.libelle)}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                          disabled={editingId === formation.id}
                        />

                        {editingId === formation.id ? (
                          <div className="ml-2 flex-grow flex items-center">
                            <input
                              type="text"
                              value={editFormationValue}
                              onChange={(e) => setEditFormationValue(e.target.value)}
                              onKeyDown={(e) => handleKeyDown(e, finishEditFormation)}
                              className="p-1 text-sm border rounded w-full dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
                              autoFocus
                            />
                            <button
                              onClick={finishEditFormation}
                              className="text-green-600 hover:text-green-700 ml-1 dark:text-green-500 dark:hover:text-green-400"
                              title="Enregistrer"
                              type="button"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="text-red-600 hover:text-red-700 ml-1 dark:text-red-500 dark:hover:text-red-400"
                              title="Annuler"
                              type="button"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <label htmlFor={`${formationType}-${formation.id}`} className="ml-2 block text-sm text-gray-700 dark:text-gray-300 truncate">
                            {formation.libelle}
                          </label>
                        )}
                      </div>

                      {editingId !== formation.id && (
                        <div className="flex items-center space-x-1 ml-2">
                          <button
                            onClick={() => startEditFormation(formation.id, formation.libelle)}
                            className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                            title="Modifier"
                            type="button"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteFormation(formation.id)}
                            className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                            title="Supprimer"
                            type="button"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-4 text-center text-gray-500 dark:text-gray-400">
                  Aucune formation disponible. Ajoutez-en une ci-dessous.
                </div>
              )}

              {/* Ajout d'une nouvelle formation */}
              <div className="flex items-center mt-3">
                <input
                  type="text"
                  value={newFormation}
                  onChange={(e) => setNewFormation(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, handleAddFormation)}
                  placeholder={`Ajouter une nouvelle formation ${formationType === 'technique' ? 'technique' : 'en entrepreneuriat'}`}
                  className="flex-1 p-2 border rounded-l-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
                />
                <button
                  onClick={handleAddFormation}
                  disabled={newFormation.trim() === ''}
                  className="bg-blue-600 text-white p-2 rounded-r-md hover:bg-blue-700 disabled:bg-gray-400 dark:bg-blue-700 dark:hover:bg-blue-600 dark:disabled:bg-gray-600"
                  title="Ajouter"
                  type="button"
                >
                  <PlusCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FormationsSection;
