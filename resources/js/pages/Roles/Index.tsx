// resources/js/Pages/Roles/Index.tsx
import React, { useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import RolesPermissionsManagement from '@/components/RolesPermissionsManagement';
import { usePermissions } from '@/hooks/usePermissions';
import { AlertCircle } from 'lucide-react';
import { useToast } from '@/components/useToast';

interface Role {
  id: number;
  name: string;
  description: string;
  permissions: Record<string, string[]>;
}

interface Module {
  id: string;
  name: string;
  description: string;
}

interface Action {
  id: string;
  name: string;
  description: string;
}

interface Props {
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
  roles: Role[];
  modules: Module[];
  actions: Action[];
}

export default function Index({ auth, roles, modules, actions }: Props) {
  const { hasPermission } = usePermissions();
  const toast = useToast();

  // Vérifier si l'utilisateur a la permission d'accéder à cette page
  useEffect(() => {
    if (!hasPermission('parametres', 'edit')) {
      toast.error('Vous n\'avez pas les permissions nécessaires pour accéder à cette page.');
      router.visit(route('dashboard'));
    }
  }, []);

  // Si l'utilisateur n'a pas la permission, afficher un message d'accès refusé
  if (!hasPermission('parametres', 'edit')) {
    return (
      <AppLayout
        title="Accès refusé"
        user={auth.user}
        header={
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">
            Accès refusé
          </h2>
        }
      >
        <Head title="Accès refusé" />

        <div className="py-12">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-md">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-amber-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-amber-800">Accès restreint</h3>
                  <div className="mt-2 text-sm text-amber-700">
                    <p>
                      Vous n'avez pas les permissions nécessaires pour gérer les rôles et les permissions.
                      Veuillez contacter un administrateur si vous pensez que cela est une erreur.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title="Gestion des Rôles"
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Gestion des Rôles et Permissions
        </h2>
      }
    >
      <Head title="Gestion des Rôles" />

      <div className="py-6">
        <div className="max-w-7xl mx-auto">
          <RolesPermissionsManagement
            roles={roles}
            modules={modules}
            actions={actions}
          />
        </div>
      </div>
    </AppLayout>
  );
}
