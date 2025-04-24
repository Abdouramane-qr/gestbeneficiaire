import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Save, X } from 'lucide-react';
import { Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';

interface Props {
  auth: {
    user: any;
  };
  user: {
    name: string;
    email: string;
  };
}

export default function Edit({ auth, user }: Props) {
  const { data, setData, put, processing, errors } = useForm({
    name: user.name,
    email: user.email,
  });

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    put(route('profile.update'));
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      title="Modifier mon profil"
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Modifier mon profil
        </h2>
      }
    >
      <Head title="Modifier mon profil" />

      <div className="py-12">
        <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white border-b border-gray-200">
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nom
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

                <div className="flex items-center justify-end">
                  <Link
                    href={route('profile.show')}
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
                    {processing ? 'Enregistrement...' : 'Enregistrer'}
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
