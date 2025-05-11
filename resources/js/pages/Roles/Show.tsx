import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Edit, Key } from 'lucide-react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { toast } from 'sonner';

interface ShowProps {
  auth: {
    user: {
      id: number;
      name: string;
      email: string;
    };
  };
  user: {
    name: string;
    email: string;
    type?: string;
    role?: {
      name: string;
    };
    created_at: string;
  };
  flash: {
    success?: string;
  };
}

export default function Show({ auth, user, flash }: ShowProps) {
  return (
    <AuthenticatedLayout
      user={auth.user}
      title="Mon Profil"
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Mon Profil
        </h2>
      }
    >
      <Head title="Mon Profil" />

      <div className="py-12">
        <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
          {flash.success && toast.success(flash.success)}

          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white border-b border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Informations du profil</h3>
                <Link
                  href={route('profile.edit')}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700"
                >
                  <Edit size={16} className="mr-2" />
                  Modifier
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
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
                      <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">{user.type}</div>
                    </div>
                  )}
                </div>

                <div>
                  {user.role && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">Rôle</label>
                      <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">{user.role.name}</div>
                    </div>
                  )}

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Membre depuis</label>
                    <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
                      {new Date(user.created_at).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Sécurité</h3>
                  <Link
                    href={route('profile.edit.password')}
                    className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700"
                  >
                    <Key size={16} className="mr-2" />
                    Changer le mot de passe
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
