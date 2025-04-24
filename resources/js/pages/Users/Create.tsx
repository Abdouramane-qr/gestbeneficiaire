import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Eye, EyeOff, Save, X } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface Role {
  id: number;
  name: string;
  description?: string;
}

interface UserType {
  id: string;
  name: string;
}

interface CreateProps {
  auth: {
    user: {
      id: number;
      name: string;
      email: string;
    };
  };
  roles: Role[];
  types: UserType[];
}

type UserFormData = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role_id: string;
  type: string;
};

export default function Create({ auth, roles, types }: CreateProps) {
  const { data, setData, post, processing, errors } = useForm<UserFormData>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role_id: '',
    type: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('users.store'));
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      title="Créer un utilisateur"
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Créer un nouvel utilisateur
        </h2>
      }
    >
      <Head title="Créer un utilisateur" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white border-b border-gray-200">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="mb-6">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Nom complet
                      </label>
                      <input
                        id="name"
                        type="text"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                      />
                      {errors.name && <div className="text-red-500 mt-1 text-sm">{errors.name}</div>}
                    </div>

                    <div className="mb-6">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                      />
                      {errors.email && <div className="text-red-500 mt-1 text-sm">{errors.email}</div>}
                    </div>

                    <div className="mb-6">
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Mot de passe
                      </label>
                      <div className="mt-1 relative">
                        <input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                          value={data.password}
                          onChange={(e) => setData('password', e.target.value)}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff size={20} className="text-gray-500" />
                          ) : (
                            <Eye size={20} className="text-gray-500" />
                          )}
                        </button>
                      </div>
                      {errors.password && <div className="text-red-500 mt-1 text-sm">{errors.password}</div>}
                    </div>

                    <div className="mb-6">
                      <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                        Confirmer le mot de passe
                      </label>
                      <div className="mt-1 relative">
                        <input
                          id="password_confirmation"
                          type={showConfirmPassword ? 'text' : 'password'}
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                          value={data.password_confirmation}
                          onChange={(e) => setData('password_confirmation', e.target.value)}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={20} className="text-gray-500" />
                          ) : (
                            <Eye size={20} className="text-gray-500" />
                          )}
                        </button>
                      </div>
                      {errors.password_confirmation && (
                        <div className="text-red-500 mt-1 text-sm">{errors.password_confirmation}</div>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="mb-6">
                      <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                        Type d'utilisateur
                      </label>
                      <select
                        id="type"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        value={data.type}
                        onChange={(e) => setData('type', e.target.value)}
                      >
                        <option value="">Sélectionner un type</option>
                        {types.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                      {errors.type && <div className="text-red-500 mt-1 text-sm">{errors.type}</div>}
                    </div>

                    <div className="mb-6">
                      <label htmlFor="role_id" className="block text-sm font-medium text-gray-700">
                        Rôle
                      </label>
                      <select
                        id="role_id"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        value={data.role_id}
                        onChange={(e) => setData('role_id', e.target.value)}
                      >
                        <option value="">Sélectionner un rôle</option>
                        {roles.map((role) => (
                          <option key={role.id} value={role.id.toString()}>
                            {role.name} - {role.description}
                          </option>
                        ))}
                      </select>
                      {errors.role_id && <div className="text-red-500 mt-1 text-sm">{errors.role_id}</div>}
                    </div>

                    <div className="mt-12 p-4 bg-blue-50 rounded-md">
                      <h3 className="font-medium text-blue-800 mb-2">Information importante</h3>
                      <p className="text-sm text-blue-700">
                        Les utilisateurs nouvellement créés auront accès au système selon leur rôle.
                        Assurez-vous d'attribuer le rôle approprié pour contrôler leurs permissions.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-end border-t pt-4">
                  <Link
                    href={route('users.index')}
                    className="inline-flex items-center px-4 py-2 bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-300 mr-2"
                  >
                    <X size={16} className="mr-2" />
                    Annuler
                  </Link>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700"
                    disabled={processing}
                  >
                    <Save size={16} className="mr-2" />
                    {processing ? 'Création...' : 'Créer l\'utilisateur'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
