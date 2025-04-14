import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { UserRoundSearch, Building2, Landmark, Wallet,  Database,  ClipboardCheck, FilePlus, TrendingUp, Settings, UserRoundPen, ShieldCheck,  } from 'lucide-react';
import AppLogo from './app-logo';

// Créer un type pour les items avec sous-menus
type NavItemWithSubmenu = NavItem & {
    children?: NavItem[];
};

// Définir le menu principal avec le sous-menu Analyses
const mainNavItems: NavItemWithSubmenu[] = [

    {
        title: 'Dashboard',
        icon: ClipboardCheck,
        href: '/dashboard',
        children: [
          {
            title: 'Analyse des Indicateurs',  // Nouveau sous-menu
            href: '/analyse',
            icon: TrendingUp,  // Ou BarChart selon votre préférence
          },
          {
            title: 'Analyse',  // Nouveau sous-menu
            href: '/analyse/synthese',
            icon: TrendingUp,  // Ou BarChart selon votre préférence
          }
        ]

},
    {
        title: 'Entreprises',
        href: '/entreprises',
        icon: Building2,
    },
    {
        title: 'Promoteurs',
        href: '/beneficiaires',
        icon: UserRoundSearch,
    },
    {
        title: 'Ong',
        href: '/ong',
        icon: Landmark,
    },
    {
        title: 'Institution Financiere',
        href: '/InstitutionFinanciere',
        icon: Wallet,
    },



    {
        title: 'Collecte de Données',
        icon: ClipboardCheck,
        href: '#',
        children: [
            {
                title: 'Nouvelle collecte',
                href: 'collectes', // Utiliser la fonction route() d'Inertia
                icon: FilePlus,
            },
            {
                title: 'Liste des collectes',
                href: route('collectes.index'), // Liste toutes les collectes
                icon: Database,
            },
            {
                title: 'Periode Creation',
                href: route('periodes.create'), // Liste toutes les collectes
                icon: Database,
            },

            {
                title: 'Periode Liste',
                href: route('periodes.index'), // Liste toutes les collectes
                icon: Database,
            },

            {
                title: 'Exercies Creation',
                href: route('exercices.store'), // Liste toutes les collectes
                icon: Database,
            },

            {
                title: 'Exercies Liste',
                href: route('exercices.index'), // Liste toutes les collectes
                icon: Database,
            },
        ]
    },

    {
        title: 'Parametres',
        icon: Settings,
        href: '#',
        children: [
            {
                title: 'Profiles',
                href: 'collectes', // Utiliser la fonction route() d'Inertia
                icon: UserRoundPen ,
            },
            {
                title: 'Roles',
                href: 'Analyse/RapportSynthetique', // Liste toutes les collectes
                icon: ShieldCheck ,
            },

        ]
    },
];

const footerNavItems: NavItem[] = [
    // {
    //     title: 'Repository',
    //     href: 'https://github.com/laravel/react-starter-kit',
    //     icon: Folder,
    // },
    // {
    //     title: 'Documentation',
    //     href: 'https://laravel.com/docs/starter-kits',
    //     icon: BookOpen,
    // },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="floating">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
