import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import RolesPermissionsManagement from '@/components/RolesPermissionsManagement';

interface Role {
  id: number;
  name: string;
  description: string;
  permissions: {
    [key: string]: string[];
  };
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
    };
  };
  roles: Role[];
  modules: Module[];
  actions: Action[];
}

export default function Index({ auth, roles, modules, actions }: Props) {
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
          <RolesPermissionsManagement roles={roles} modules={modules} actions={actions} />
        </div>
      </div>
    </AppLayout>
  );
}
