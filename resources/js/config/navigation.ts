// resources/js/config/navigation.ts
import {
    BarChart3,
    Building2,
    Users,
    Briefcase,
    FileText,
    UserCog,
    Settings,
    PieChart,
    Handshake
  } from 'lucide-react';

  export const mainNavigation = [
    {
      title: 'Tableau de bord',
      href: route('dashboard'),
      icon: BarChart3,
      module: 'dashboard'
    },
    {
      title: 'Entreprises',
      href: route('entreprises.index'),
      icon: Building2,
      module: 'entreprises'
    },
    {
      title: 'Promoteurs',
      href: route('beneficiaires.index'),
      icon: Users,
      module: 'promoteurs'
    },
    {
      title: 'Coachs',
      href: route('coaches.index'),
      icon: Handshake,
      module: 'coaches',
      requiredTypes: ['admin', 'ong'] // Visible uniquement pour admin et ONG
    },
    {
      title: 'ONGs',
      href: route('ongs.index'),
      icon: Briefcase,
      module: 'ongs',
      requiredTypes: ['admin', 'institution'] // Seuls admin et institution peuvent voir
    },
    {
      title: 'Institutions',
      href: route('institutions.index'),
      icon: Building2,
      module: 'institutions'
    },
    {
      title: 'Collectes',
      href: route('collectes.index'),
      icon: FileText,
      module: 'collectes'
    },
    {
      title: 'Rapports',
      href: route('rapports.index'),
      icon: PieChart,
      module: 'rapports'
    },
    {
      title: 'Administration',
      icon: Settings,
      module: 'parametres',
      children: [
        {
          title: 'Utilisateurs',
          href: route('users.index'),
          icon: UserCog,
          module: 'utilisateurs'
        },
        {
          title: 'Rôles et Permissions',
          href: route('roles.index'),
          icon: Settings,
          module: 'parametres',
          action: 'edit' // Nécessite des permissions d'édition
        }
      ]
    }
  ];
