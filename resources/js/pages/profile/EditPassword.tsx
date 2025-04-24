import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Eye, EyeOff, Save, X } from 'lucide-react';
import { Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';

interface Props {
  auth: {
    user: {
      id: number;
      name: string;
      email: string;
      [key: string]: any;
    };
  };
}

export default function EditPassword({ auth }: Props) {
  const { data, setData, put, processing, errors, reset } = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    put(route('profile.update.password'), {
      onSuccess: () => {
        reset('current_password', 'password', 'password_confirmation');
      }
    });
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      title="Changer mon mot de passe"
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Changer mon mot de passe
        </h2>
      }
    >
      <Head title="Changer mon mot de passe" />

      <div className="py-12">
        <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white border-b border-gray-200">
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="current_password" className="block text-sm font-medium text-gray-700">
                    Mot de passe actuel
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="current_password"
                      type={showCurrentPassword ? 'text' : 'password'}
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      value={data.current_password}
                      onChange={(e) => setData('current_password', e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <EyeOff size={20} className="text-gray-500" />
                      ) : (
                        <Eye size={20} className="text-gray-500" />
                      )}
                    </button>
                  </div>
                  {errors.current_password && <div className="text-red-500 mt-1 text-sm">{errors.current_password}</div>}
                </div>

                <div className="mb-6">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Nouveau mot de passe
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="password"
                      type={showNewPassword ? 'text' : 'password'}
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      value={data.password}
                      onChange={(e) => setData('password', e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
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
                    Confirmer le nouveau mot de passe
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
                    {processing ? 'Modification...' : 'Changer le mot de passe'}
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
