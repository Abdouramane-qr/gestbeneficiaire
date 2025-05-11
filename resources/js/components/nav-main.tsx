// // // import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
// // // import { type NavItem } from '@/types';
// // // import { Link, usePage } from '@inertiajs/react';

// // // export function NavMain({ items = [] }: { items: NavItem[] }) {
// // //     const page = usePage();
// // //     return (
// // //         <SidebarGroup className="px-2 py-0">
// // //             <SidebarGroupLabel>Platform</SidebarGroupLabel>
// // //             <SidebarMenu>
// // //                 {items.map((item) => (
// // //                     <SidebarMenuItem key={item.title}>
// // //                         <SidebarMenuButton asChild isActive={item.href === page.url}>
// // //                             <Link href={item.href} prefetch>
// // //                                 {item.icon && <item.icon />}
// // //                                 <span>{item.title}</span>
// // //                             </Link>
// // //                         </SidebarMenuButton>
// // //                     </SidebarMenuItem>
// // //                 ))}
// // //             </SidebarMenu>
// // //         </SidebarGroup>
// // //     );
// // // }
// // import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
// // import { type NavItem } from '@/types';
// // import { Link, usePage } from '@inertiajs/react';
// // import { ChevronDown, ChevronUp } from 'lucide-react';
// // import { useState } from 'react';

// // // Étendre le type NavItem pour inclure les sous-menus
// // type NavItemWithSubmenu = NavItem & {
// //     children?: NavItem[];
// // };

// // export function NavMain({ items = [] }: { items: NavItemWithSubmenu[] }) {
// //     const page = usePage();
// //     const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

// //     const toggleSubmenu = (title: string) => {
// //         if (openSubmenu === title) {
// //             setOpenSubmenu(null);
// //         } else {
// //             setOpenSubmenu(title);
// //         }
// //     };

// //     return (
// //         <SidebarGroup className="px-2 py-0">
// //             <SidebarGroupLabel>Platform</SidebarGroupLabel>
// //             <SidebarMenu>
// //                 {items.map((item) => (
// //                     <SidebarMenuItem key={item.title}>
// //                         {item.children ? (
// //                             <>
// //                                 <SidebarMenuButton
// //                                     onClick={() => toggleSubmenu(item.title)}
// //                                     isActive={item.href === page.url || item.children.some(child => child.href === page.url)}
// //                                 >
// //                                     {item.icon && <item.icon />}
// //                                     <span className="flex-1">{item.title}</span>
// //                                     {openSubmenu === item.title ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
// //                                 </SidebarMenuButton>

// //                                 {openSubmenu === item.title && (
// //                                     <div className="pl-8 mt-1">
// //                                         <SidebarMenu>
// //                                             {item.children.map((subItem) => (
// //                                                 <SidebarMenuItem key={subItem.title}>
// //                                                     <SidebarMenuButton asChild isActive={subItem.href === page.url}>
// //                                                         <Link href={subItem.href} prefetch>
// //                                                             {subItem.icon && <subItem.icon />}
// //                                                             <span>{subItem.title}</span>
// //                                                         </Link>
// //                                                     </SidebarMenuButton>
// //                                                 </SidebarMenuItem>
// //                                             ))}
// //                                         </SidebarMenu>
// //                                     </div>
// //                                 )}
// //                             </>
// //                         ) : (
// //                             <SidebarMenuButton asChild isActive={item.href === page.url}>
// //                                 <Link href={item.href} prefetch>
// //                                     {item.icon && <item.icon />}
// //                                     <span>{item.title}</span>
// //                                 </Link>
// //                             </SidebarMenuButton>
// //                         )}
// //                     </SidebarMenuItem>
// //                 ))}
// //             </SidebarMenu>
// //         </SidebarGroup>
// //     );
// // }
// import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
// import { type NavItem } from '@/types';
// import { Link, usePage } from '@inertiajs/react';
// import { ChevronDown, ChevronUp } from 'lucide-react';
// import { useState } from 'react';

// // Étendre le type NavItem pour inclure les sous-menus et les permissions requises
// type NavItemWithSubmenu = NavItem & {
//     children?: NavItem[];
//     module?: string;  // Module de permission requis
//     action?: string;  // Action de permission requise (par défaut: 'view')
// };

// export function NavMain({ items = [] }: { items: NavItemWithSubmenu[] }) {
//     const { url, props } = usePage();
//     const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
//     const { auth } = props as any;
//     const user = auth.user;

//     const toggleSubmenu = (title: string) => {
//         if (openSubmenu === title) {
//             setOpenSubmenu(null);
//         } else {
//             setOpenSubmenu(title);
//         }
//     };

//     // Fonction pour vérifier si l'utilisateur a accès à cet élément de menu
//     const hasAccess = (item: NavItemWithSubmenu) => {
//         if (!item.module) return true; // Si aucun module requis, accès autorisé

//         // Vérifier l'accès au module depuis les permissions de l'utilisateur
//         return user?.role?.permissions?.[item.module]?.includes(item.action || 'view') || false;
//     };

//     // Filtrer les éléments du menu selon les permissions
//     const filteredItems = items.filter(item => hasAccess(item));

//     return (
//         <SidebarGroup className="px-2 py-0">
//             <SidebarGroupLabel>Platform</SidebarGroupLabel>
//             <SidebarMenu>
//                 {filteredItems.map((item) => (
//                     <SidebarMenuItem key={item.title}>
//                         {item.children ? (
//                             <>
//                                 <SidebarMenuButton
//                                     onClick={() => toggleSubmenu(item.title)}
//                                     isActive={item.href === url || item.children.some(child => child.href === url)}
//                                 >
//                                     {item.icon && <item.icon />}
//                                     <span className="flex-1">{item.title}</span>
//                                     {openSubmenu === item.title ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
//                                 </SidebarMenuButton>

//                                 {openSubmenu === item.title && (
//                                     <div className="pl-8 mt-1">
//                                         <SidebarMenu>
//                                             {item.children
//                                                 .filter(subItem => hasAccess(subItem as NavItemWithSubmenu))
//                                                 .map((subItem) => (
//                                                     <SidebarMenuItem key={subItem.title}>
//                                                         <SidebarMenuButton asChild isActive={subItem.href === url}>
//                                                             <Link href={subItem.href} prefetch>
//                                                                 {subItem.icon && <subItem.icon />}
//                                                                 <span>{subItem.title}</span>
//                                                             </Link>
//                                                         </SidebarMenuButton>
//                                                     </SidebarMenuItem>
//                                                 ))}
//                                         </SidebarMenu>
//                                     </div>
//                                 )}
//                             </>
//                         ) : (
//                             <SidebarMenuButton asChild isActive={item.href === url}>
//                                 <Link href={item.href} prefetch>
//                                     {item.icon && <item.icon />}
//                                     <span>{item.title}</span>
//                                 </Link>
//                             </SidebarMenuButton>
//                         )}
//                     </SidebarMenuItem>
//                 ))}
//             </SidebarMenu>
//         </SidebarGroup>
//     );
// }

// resources/js/components/NavMain.tsx
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePermissions } from '@/hooks/usePermissions';

// Type NavItem avec permission requise
interface NavItemWithPermission extends NavItem {
  children?: NavItemWithPermission[];
  module?: string;
  action?: string;
  requiredTypes?: string[];
}

export function NavMain({ items = [] }: { items: NavItemWithPermission[] }) {
  const { url } = usePage();
  const { hasPermission, isUserType } = usePermissions();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [filteredItems, setFilteredItems] = useState<NavItemWithPermission[]>([]);

  // Filtrer les items selon les permissions
  useEffect(() => {
    const filterItems = (items: NavItemWithPermission[]): NavItemWithPermission[] => {
      return items.filter(item => {
        // Vérifier les permissions du module
        if (item.module && !hasPermission(item.module, item.action || 'view')) {
          return false;
        }

        // Vérifier les types d'utilisateur
        if (item.requiredTypes && !isUserType(item.requiredTypes)) {
          return false;
        }

        // Filtrer les sous-menus récursivement
        if (item.children) {
          const filteredChildren = filterItems(item.children);
          item.children = filteredChildren;

          // Ne montrer le groupe que s'il a des enfants
          return filteredChildren.length > 0;
        }

        return true;
      });
    };

    setFilteredItems(filterItems(items));
  }, [items, hasPermission, isUserType]);

  const toggleSubmenu = (title: string) => {
    setOpenSubmenu(openSubmenu === title ? null : title);
  };

  // Déterminer si un item ou ses enfants est actif
  const isActive = (item: NavItemWithPermission): boolean => {
    if (item.href === url) return true;
    if (item.children) {
      return item.children.some(child => isActive(child));
    }
    return false;
  };

  return (
    <SidebarGroup className="px-2 py-0">
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {filteredItems.map((item) => (
          <SidebarMenuItem key={item.title}>
            {item.children && item.children.length > 0 ? (
              <>
                <SidebarMenuButton
                  onClick={() => toggleSubmenu(item.title)}
                  isActive={isActive(item)}
                >
                  {item.icon && <item.icon />}
                  <span className="flex-1">{item.title}</span>
                  {openSubmenu === item.title ?
                    <ChevronUp className="ml-2 h-4 w-4" /> :
                    <ChevronDown className="ml-2 h-4 w-4" />
                  }
                </SidebarMenuButton>

                {openSubmenu === item.title && (
                  <div className="pl-8 mt-1">
                    <SidebarMenu>
                      {item.children.map((subItem) => (
                        <SidebarMenuItem key={subItem.title}>
                          <SidebarMenuButton asChild isActive={subItem.href === url}>
                            <Link href={subItem.href} prefetch>
                              {subItem.icon && <subItem.icon />}
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </div>
                )}
              </>
            ) : (
              <SidebarMenuButton asChild isActive={item.href === url}>
                <Link href={item.href} prefetch>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
