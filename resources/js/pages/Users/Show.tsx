import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Edit, Key,  WifiOff } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  type?: string;
  role?: {
    id: number;
    name: string;
    description?: string;
  };
  created_at: string;
  updated_at: string;
}

interface ShowProps {
  auth: {
    user: {
      id: number;
      name: string;
      email: string;
      role?: {
        permissions?: Record<string, string[]>;
      };
    };
  };
  user: User;
  flash?: {
    success?: string;
    error?: string;
  };
}

export default function Show({ auth, user, flash }: ShowProps) {
  // État pour suivre la connectivité
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  // Gestionnaires d'événements pour suivre les changements de connectivité
  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return dateString;
    }
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      title={`Utilisateur: ${user.name}`}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Détails de l'utilisateur
        </h2>
      }
    >
      <Head title={`Utilisateur: ${user.name}`} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Indicateur de connectivité */}
          {!isOnline && (
            <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded flex items-center">
              <WifiOff size={18} className="mr-2" />
              <span>Mode hors ligne. Les modifications seront synchronisées lorsque vous serez à nouveau en ligne.</span>
            </div>
          )}

          {flash?.success && (
            <div className="mb-4 p-4 bg-green-100 border border-green-300 text-green-800 rounded">
              {flash.success}
            </div>
          )}

          {flash?.error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-300 text-red-800 rounded">
              {flash.error}
            </div>
          )}

          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Informations de l'utilisateur</h3>

                <div className="mt-4 sm:mt-0 flex space-x-2">
                  {auth.user.role?.permissions?.utilisateurs?.includes('edit') && (
                    <>
                      <Link
                        href={route('users.edit', user.id)}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700"
                      >
                        <Edit size={16} className="mr-2" />
                        Modifier
                      </Link>

                      <Link
                        href={route('users.edit.password', user.id)}
                        className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700"
                      >
                        <Key size={16} className="mr-2" />
                        Mot de passe
                      </Link>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">ID</label>
                    <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">{user.id}</div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Nom</label>
                    <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">{user.name}</div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">{user.email}</div>
                  </div>

                  {user.type && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">Type d'utilisateur</label>
                      <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50 flex items-center">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {user.type}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  {user.role && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">Rôle</label>
                      <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50 flex items-center">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {user.role.name}
                        </span>
                      </div>
                      {user.role.description && (
                        <p className="mt-1 text-sm text-gray-500">{user.role.description}</p>
                      )}
                    </div>
                  )}

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Date de création</label>
                    <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
                      {formatDate(user.created_at)}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Dernière modification</label>
                    <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
                      {formatDate(user.updated_at)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Link
              href={route('users.index')}
              className="inline-flex items-center px-4 py-2 bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-300"
            >
              Retour à la liste
            </Link>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
