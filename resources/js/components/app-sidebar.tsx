import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, UserRoundSearch, Building2, Landmark, Wallet,  Database, BarChart, PieChart, TrendingUp, Clock, List, Plus, ClipboardCheck, FilePlus, DollarSign,  ShoppingCart } from 'lucide-react';
import AppLogo from './app-logo';

// Créer un type pour les items avec sous-menus
type NavItemWithSubmenu = NavItem & {
    children?: NavItem[];
};

// Définir le menu principal avec le sous-menu Analyses
const mainNavItems: NavItemWithSubmenu[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
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
        title: 'Indicateurs Financiers',
        href: route('rapports.edit', {
            tab: 'financiers'
        }),
        icon: DollarSign,
    },
    {
        title: 'Indicateurs Commerciaux',
        href: route('rapports.edit', {
            tab: 'commerciaux'
        }),
        icon: ShoppingCart,
    },

    {
        title: 'Collecte de Données',
        icon: ClipboardCheck,
        href: '#',
        children: [
            {
                title: 'Nouveau rapport',
                href: '/Rapports', // Créer une route pour ça
                icon: FilePlus,
            },
            {
                title: 'Mes rapports',
                href: '/rapports', // Liste tous les rapports
                icon: Database,
            }
        ]
    },

    // Menu Analyses avec ses sous-menus
    {
        title: 'Analyses',
        icon: BarChart,
        href: '#',
        children: [

            {
                title: 'Nouveaux rapports',
                href: '/rapports/create', // Cette route devrait être adaptée à votre système
                icon: Plus,
            },
            {
                title: 'Mes rapports récents',
                href: '/rapports/recent', // Cette route devrait être adaptée à votre système
                icon: Clock,
            },
            {
                title: 'Tous les rapports',
                href: '/rapports', // Une page qui liste tous les rapports
                icon: List,
            },

            {
                title: 'Par secteur',
                href: '/analyses/secteurs',
                icon: PieChart,
            },
            {
                title: 'Comparaison',
                href: '/analyses/comparaison',
                icon: BarChart,
            },
            {
                title: 'Tendances',
                href: '/analyses/tendances',
                icon: TrendingUp,
            }
        ]
    }
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits',
        icon: BookOpen,
    },
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
