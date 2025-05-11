import React, { useState, Fragment } from 'react';
import { usePage } from '@inertiajs/react';
import { Check, Edit, Plus, Trash2, X, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { router } from '@inertiajs/react';

// Composant Modal
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col">
        {children}
      </div>
    </div>
  );
};

// Composant Accordeon pour les modules dans le modal
const Accordion = ({ title, description, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border rounded-md mb-2 overflow-hidden">
      <div
        className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div>
          <h3 className="font-medium text-gray-800">{title}</h3>
          {description && <p className="text-xs text-gray-500">{description}</p>}
        </div>
        <ChevronDown
          size={20}
          className={`text-gray-500 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
        />
      </div>
      {isOpen && (
        <div className="p-3 border-t bg-white">
          {children}
        </div>
      )}
    </div>
  );
};

interface RolesPermissionsProps {
  roles: Array<any>;
  modules: Array<any>;
  actions: Array<any>;
}

export default function RolesPermissionsComponent({ roles, modules, actions }: RolesPermissionsProps) {
  const [selectedRoleId, setSelectedRoleId] = useState(roles[0]?.id || null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isAddingNewRole, setIsAddingNewRole] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    permissions: { [moduleId: number]: number[] };
  }>({
    name: '',
    description: '',
    permissions: {}
  });

  const selectedRole = roles.find(role => role.id === selectedRoleId);

interface Role {
    id: number;
    name: string;
    description: string;
    permissions: {
        [moduleId: number]: number[]
    }
}


const handleOpenEditModal = (role: Role): void => {
    setEditingRole(role);
    setFormData({
        name: role.name,
        description: role.description,
        permissions: { ...role.permissions }
    });
    setIsModalOpen(true);
    setConfirmDelete(false);
    setIsAddingNewRole(false);
};

  const handleAddNewRole = () => {
    setIsAddingNewRole(true);

    // Create empty permissions object
    const emptyPermissions = modules.reduce((acc, module) => {
      acc[module.id] = [];
      return acc;
    }, {});

    setEditingRole(null);
    setFormData({
      name: 'Nouveau rôle',
      description: 'Description du nouveau rôle',
      permissions: emptyPermissions
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRole(null);
    setIsAddingNewRole(false);
    setConfirmDelete(false);
  };

  const handlePermissionChange = (moduleId: number, actionId: number) => {
    setFormData(prevData => {
      const updatedPermissions = { ...prevData.permissions };

      if (updatedPermissions[moduleId]?.includes(actionId)) {
        // Remove permission
        updatedPermissions[moduleId] = updatedPermissions[moduleId].filter(a => a !== actionId);
      } else {
        // Add permission
        updatedPermissions[moduleId] = [...(updatedPermissions[moduleId] || []), actionId];
      }

      return {
        ...prevData,
        permissions: updatedPermissions
      };
    });
  };

  const handleSaveRole = () => {
    if (isAddingNewRole) {
      router.post(route('roles.store'), formData, {
        onSuccess: () => {
          toast.success('Rôle créé avec succès');
          handleCloseModal();
        }
      });
    } else {
      if (!editingRole) return;
      router.put(route('roles.update', editingRole.id), formData, {
        onSuccess: () => {
          toast.success('Rôle mis à jour avec succès');
          handleCloseModal();
        }
      });
    }
  };

  const handleDeleteRole = () => {
    if (confirmDelete) {
      router.delete(route('roles.destroy', editingRole.id), {
        onSuccess: () => {
          toast.success('Rôle supprimé avec succès');
          handleCloseModal();
          // Select first role if the selected role was deleted
          if (editingRole && selectedRoleId === editingRole.id && roles.length > 0) {
            setSelectedRoleId(roles[0].id);
          }
        }
      });
    } else {
      setConfirmDelete(true);
    }
  };

  // Helper function to determine if all actions for a module are selected
  const areAllActionsSelected = (moduleId: number) => {
    return actions.every(action =>
      formData.permissions[moduleId]?.includes(action.id)
    );
  };

  // Helper function to toggle all actions for a module
  const toggleAllActionsForModule = (moduleId: number) => {
    if (areAllActionsSelected(moduleId)) {
      // If all selected, deselect all
      setFormData(prevData => {
        const updatedPermissions = { ...prevData.permissions };
        updatedPermissions[moduleId] = [];
        return {
          ...prevData,
          permissions: updatedPermissions
        };
      });
    } else {
      // If not all selected, select all
      setFormData(prevData => {
        const updatedPermissions = { ...prevData.permissions };
        updatedPermissions[moduleId] = actions.map(action => action.id);
        return {
          ...prevData,
          permissions: updatedPermissions
        };
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">Gestion des Rôles et Accès</h1>
        <p className="text-sm text-blue-100">Configurez les permissions pour chaque rôle du système</p>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar with roles list */}
        <div className="w-64 bg-gray-100 border-r overflow-y-auto hidden md:block">
          <div className="p-4 flex justify-between items-center border-b">
            <h2 className="font-semibold text-gray-700">Rôles</h2>
            <button
              onClick={handleAddNewRole}
              className="p-1 rounded-full hover:bg-blue-100 text-blue-600"
              title="Ajouter un rôle"
            >
              <Plus size={20} />
            </button>
          </div>
          <div className="divide-y">
            {roles.map(role => (
              <div
                key={role.id}
                className={`p-3 cursor-pointer hover:bg-gray-200 ${selectedRoleId === role.id ? 'bg-blue-100 border-l-4 border-blue-600' : ''}`}
                onClick={() => setSelectedRoleId(role.id)}
              >
                <div className="font-medium">{role.name}</div>
                <div className="text-xs text-gray-500 truncate">{role.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile roles dropdown */}
          <div className="p-4 bg-gray-100 border-b md:hidden">
            <div className="flex justify-between items-center">
              <div>
                <label htmlFor="roleSelect" className="block text-sm font-medium text-gray-700">
                  Sélectionner un rôle
                </label>
                <select
                  id="roleSelect"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={selectedRoleId}
                  onChange={(e) => setSelectedRoleId(parseInt(e.target.value))}
                >
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleAddNewRole}
                className="p-2 rounded-full hover:bg-blue-100 text-blue-600"
                title="Ajouter un rôle"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          {/* Role detail header */}
          {selectedRole && (
            <>
              <div className="bg-white p-4 border-b flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">{selectedRole.name}</h2>
                  <p className="text-sm text-gray-600">{selectedRole.description}</p>
                </div>

                <button
                  onClick={() => handleOpenEditModal(selectedRole)}
                  className="flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  <Edit size={16} className="mr-1" />
                  Modifier
                </button>
              </div>

              {/* Permissions overview */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="shadow-md rounded-lg border overflow-hidden bg-white">
                  <div className="p-4 border-b bg-gray-50">
                    <h3 className="font-medium">Récapitulatif des permissions</h3>
                    <p className="text-sm text-gray-500">Cliquez sur "Modifier" pour changer les accès</p>
                  </div>

                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {modules.map(module => (
                      <div key={module.id} className="border rounded-md p-3 bg-gray-50">
                        <div className="font-medium">{module.name}</div>
                        <div className="text-xs text-gray-500 mb-2">{module.description}</div>

                        <div className="flex flex-wrap gap-1 mt-2">
                          {selectedRole.permissions[module.id]?.length > 0 ? (
                            selectedRole.permissions[module.id].map((actionId: React.Key | null | undefined) => {
                              const action = actions.find(a => a.id === actionId);
                              return (
                                <span key={actionId} className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                  {action?.name}
                                </span>
                              );
                            })
                          ) : (
                            <span className="text-xs text-gray-500">Aucun accès</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal for editing permissions */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {isAddingNewRole ? 'Ajouter un nouveau rôle' : `Modifier le rôle: ${editingRole?.name}`}
          </h2>
          <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[70vh]">
          {/* Role basic info */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom du rôle
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <h3 className="font-medium text-lg mb-3">Permissions</h3>

          {/* Modules accordions */}
          {modules.map(module => (
            <Accordion
              key={module.id}
              title={module.name}
              description={module.description}
              defaultOpen={modules.indexOf(module) === 0}
            >
              <div className="flex items-center mb-3 pb-2 border-b">
                <div className="flex-1">
                  <div className="font-medium">Toutes les permissions</div>
                  <div className="text-xs text-gray-500">Activer/désactiver toutes les actions pour ce module</div>
                </div>
                <div
                  className={`inline-flex items-center justify-center w-6 h-6 rounded-full cursor-pointer ${
                    areAllActionsSelected(module.id)
                      ? 'bg-green-100 text-green-600'
                      : 'bg-gray-100 text-gray-400'
                  } hover:bg-blue-100`}
                  onClick={() => toggleAllActionsForModule(module.id)}
                >
                  {areAllActionsSelected(module.id) ? <Check size={16} /> : <X size={16} />}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {actions.map(action => {
                  const hasPermission = formData.permissions[module.id]?.includes(action.id);

                  return (
                    <div
                      key={`${module.id}-${action.id}`}
                      className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer"
                      onClick={() => handlePermissionChange(module.id, action.id)}
                    >
                      <div
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full mr-3 ${
                          hasPermission
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {hasPermission ? <Check size={16} /> : <div className="w-4 h-4 rounded-full bg-gray-200"></div>}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{action.name}</div>
                        <div className="text-xs text-gray-500">{action.description}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Accordion>
          ))}
        </div>

        <div className="p-4 border-t bg-gray-50 flex justify-end space-x-2">
          {!isAddingNewRole && editingRole && editingRole.id !== 1 && (
            <button
              onClick={handleDeleteRole}
              className={`px-4 py-2 rounded ${confirmDelete ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              {confirmDelete ? 'Confirmer la suppression' : 'Supprimer'}
            </button>
          )}
          <button
            onClick={handleCloseModal}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded"
          >
            Annuler
          </button>
          <button
            onClick={handleSaveRole}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Enregistrer
          </button>
        </div>
      </Modal>
    </div>
  );
}
