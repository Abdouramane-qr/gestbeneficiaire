import React from 'react';
import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { Building, Users, FileText, Database, Briefcase, UserCheck, AlertTriangle } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface User {
  id: number;
  name: string;
  email: string;
  role?: {
    name: string;
    description: string;
    permissions: { [key: string]: string[] };
  };
}

interface Auth {
  user: User;
}

interface Stats {
  entreprises?: number;
  promoteurs?: number;
  ongs?: number;
  institutions?: number;
  collectes?: number;
  rapports?: number;
  users?: number;
}

export default function Dashboard({ auth, stats = {} }: { auth: Auth; stats?: Stats }) {
  const user = auth.user;
  const role = user.role || { permissions: {} as { [key: string]: string[] } };

  // Définition des cartes de modules avec les icônes et les routes
  const moduleCards = [
    {
      name: 'Entreprises',
      description: 'Gestion des entreprises bénéficiaires',
      icon: Building,
      color: 'bg-blue-600',
      count: stats.entreprises || 0,
      route: 'entreprises.index',
      permission: 'entreprises',
      action: 'view'
    },
    {
      name: 'Promoteurs',
      description: 'Gestion des promoteurs',
      icon: UserCheck,
      color: 'bg-green-600',
      count: stats.promoteurs || 0,
      route: 'beneficiaires.index',
      permission: 'promoteurs',
      action: 'view'
    },
    {
      name: 'ONGs',
      description: 'Gestion des organisations non gouvernementales',
      icon: Briefcase,
      color: 'bg-purple-600',
      count: stats.ongs || 0,
      route: 'ong.index',
      permission: 'ongs',
      action: 'view'
    },
    {
      name: 'Institutions',
      description: 'Gestion des institutions financières',
      icon: Building,
      color: 'bg-yellow-600',
      count: stats.institutions || 0,
      route: 'InstitutionFinanciere.index',
      permission: 'institutions',
      action: 'view'
    },
    {
      name: 'Collectes',
      description: 'Saisie et gestion des collectes de données',
      icon: Database,
      color: 'bg-red-600',
      count: stats.collectes || 0,
      route: 'collectes.index',
      permission: 'collectes',
      action: 'view'
    },
    {
      name: 'Rapports',
      description: 'Génération et consultation des rapports',
      icon: FileText,
      color: 'bg-indigo-600',
      count: stats.rapports || 0,
      route: 'synthese',
      permission: 'rapports',
      action: 'view'
    },
    {
      name: 'Utilisateurs',
      description: 'Gestion des utilisateurs du système',
      icon: Users,
      color: 'bg-gray-600',
      count: stats.users || 0,
      route: 'users.index',
      permission: 'utilisateurs',
      action: 'view'
    }
  ];

  // Filtrer les modules auxquels l'utilisateur a accès
  const accessibleModules = moduleCards.filter(module =>
    role.permissions[module.permission]?.includes(module.action)
  );

  return (
    <AppLayout title="Tableau de bord"
          user={auth.user}
          header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">
              Tableau de bord
          </h2>}
             >
      <Head title="Tableau de bord" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white border-b border-gray-200">
              <h1 className="text-2xl font-semibold mb-2">Bienvenue, {user.name}</h1>

              {user.role ? (
                <div className="mb-6 text-sm text-gray-600">
                  <span className="font-medium">Votre rôle :</span> {user.role.name} - {user.role.description}
                </div>
              ) : (
                <div className="mb-6 bg-yellow-50 p-4 rounded-md border border-yellow-100">
                  <div className="flex">
                    <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
                    <div>
                      <p className="text-sm text-yellow-700">
                        Vous n'avez pas encore de rôle attribué. Certaines fonctionnalités peuvent être limitées.
                        Veuillez contacter l'administrateur.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accessibleModules.map((module, index) => {
                  const IconComponent = module.icon;
                  return (
                    <Link
                      key={index}
                      href={route(module.route)}
                      className="block group"
                    >
                      <div className="bg-white border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                        <div className={`${module.color} p-4 flex justify-between items-center`}>
                          <span className="text-white font-medium">{module.name}</span>
                          <IconComponent className="text-white opacity-80" size={24} />
                        </div>
                        <div className="p-4">
                          <div className="text-3xl font-bold text-gray-800">{module.count}</div>
                          <div className="text-sm text-gray-500 mt-1">{module.description}</div>
                        </div>
                        <div className="px-4 py-2 bg-gray-50 text-sm text-blue-600 group-hover:text-blue-800 transition-colors flex justify-between items-center">
                          <span>Accéder</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {accessibleModules.length === 0 && (
                <div className="bg-yellow-50 p-4 rounded-md">
                  <div className="flex">
                    <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
                    <div>
                      <h3 className="text-sm font-medium text-yellow-800">Aucun module accessible</h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>
                          Vous n'avez pas encore accès aux modules du système. Veuillez contacter un administrateur
                          pour obtenir les permissions nécessaires.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
