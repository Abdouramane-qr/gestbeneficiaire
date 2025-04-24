import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Eye, EyeOff, Save, X } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface User {
  id: number;
  name: string;
  email: string;
}

interface EditPasswordProps {
  auth: {
    user: {
      id: number;
      name: string;
      email: string;
    };
  };
  user: User;
}

type PasswordFormData = {
  password: string;
  password_confirmation: string;
};

export default function EditPassword({ auth, user }: EditPasswordProps) {
  const { data, setData, put, processing, errors, reset } = useForm<PasswordFormData>({
    password: '',
    password_confirmation: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // État pour suivre la connectivité
  const [isOnline, setIsOnline] = useState(navigator.onLine);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('users.update.password', user.id), {
      onSuccess: () => {
        reset('password', 'password_confirmation');
      }
    });
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      title={`Changer le mot de passe - ${user.name}`}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Changer le mot de passe de l'utilisateur
        </h2>
      }
    >
      <Head title={`Changer le mot de passe - ${user.name}`} />

      <div className="py-12">
        <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
          {/* Indicateur de connectivité */}
          {!isOnline && (
            <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded flex items-center">
              <span className="mr-2">⚠️</span>
              <span>Mode hors ligne. Les modifications seront synchronisées lorsque vous serez à nouveau en ligne.</span>
            </div>
          )}

          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white border-b border-gray-200">
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900">Réinitialisation du mot de passe</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Définissez un nouveau mot de passe pour {user.name} ({user.email}).
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Nouveau mot de passe
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
                  {errors.password_confirmation && (
                    <div className="text-red-500 mt-1 text-sm">{errors.password_confirmation}</div>
                  )}
                </div>

                <div className="p-4 mb-6 bg-amber-50 border border-amber-200 rounded-md">
                  <h4 className="text-sm font-medium text-amber-800">Important</h4>
                  <p className="text-sm text-amber-700 mt-1">
                    Après la réinitialisation du mot de passe, vous devrez communiquer le nouveau mot de passe à l'utilisateur de manière sécurisée.
                  </p>
                </div>

                <div className="flex items-center justify-end">
                  <Link
                    href={route('users.show', user.id)}
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
                    {processing ? 'Enregistrement...' : 'Réinitialiser le mot de passe'}
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
