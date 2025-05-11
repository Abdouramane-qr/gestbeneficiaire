import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Edit, Eye, Key, Search, Trash2, UserPlus } from 'lucide-react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';

interface User {
  id: number;
  name: string;
  email: string;
  type?: string;
  role?: {
    name: string;
    permissions?: {
      utilisateurs?: string[];
    };
  };
}

interface Props {
  auth: {
    user: User;
  };
  users: User[];
  flash: {
    success?: string;
    error?: string;
  };
}

export default function Index({ auth, users, flash }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteUser = (userId: number) => {
    if (userId === auth.user.id) {
      toast.error("Vous ne pouvez pas supprimer votre propre compte.");
      return;
    }

    if (confirmDelete === userId) {
      router.delete(route('users.destroy', userId), {
        onSuccess: () => {
          toast.success('Utilisateur supprimé avec succès');
          setConfirmDelete(null);
        },
        onError: (errors) => {
          toast.error(errors.message || 'Une erreur est survenue lors de la suppression');
        }
      });
    } else {
      setConfirmDelete(userId);
    }
  };

  return (
    <AuthenticatedLayout
      title="Gestion des Utilisateurs"
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Gestion des Utilisateurs
        </h2>
      }
    >
      <Head title="Gestion des Utilisateurs" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {flash.success && (
            <div className="mb-4 p-4 bg-green-100 border border-green-300 text-green-800 rounded">
              {flash.success}
            </div>
          )}

          {flash.error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-300 text-red-800 rounded">
              {flash.error}
            </div>
          )}

          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white">
              <div className="flex justify-between items-center mb-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {auth.user.role?.permissions?.utilisateurs?.includes('create') && (
                  <Link
                    href={route('users.create')}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700"
                  >
                    <UserPlus size={16} className="mr-2" />
                    Nouvel Utilisateur
                  </Link>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nom
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rôle
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map(user => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {user.type ? (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                  {user.type}
                                </span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {user.role ? (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  {user.role.name}
                                </span>
                              ) : (
                                <span className="text-gray-400">Non défini</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <Link
                                href={route('users.show', user.id)}
                                className="text-indigo-600 hover:text-indigo-900"
                                title="Voir les détails"
                              >
                                <Eye size={18} />
                              </Link>

                              {auth.user.role?.permissions?.utilisateurs?.includes('edit') && (
                                <>
                                  <Link
                                    href={route('users.edit', user.id)}
                                    className="text-blue-600 hover:text-blue-900"
                                    title="Modifier"
                                  >
                                    <Edit size={18} />
                                  </Link>

                                  <Link
                                    href={route('users.edit.password', user.id)}
                                    className="text-yellow-600 hover:text-yellow-900"
                                    title="Changer le mot de passe"
                                  >
                                    <Key size={18} />
                                  </Link>
                                </>
                              )}

                              {auth.user.role?.permissions?.utilisateurs?.includes('delete') && (
                                <button
                                  onClick={() => handleDeleteUser(user.id)}
                                  className={`${confirmDelete === user.id ? 'text-red-600' : 'text-gray-400'} hover:text-red-900`}
                                  title={confirmDelete === user.id ? "Confirmer la suppression" : "Supprimer"}
                                >
                                  <Trash2 size={18} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                          Aucun utilisateur trouvé
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
