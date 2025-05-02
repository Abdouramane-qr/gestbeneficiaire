// import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
// import { UserInfo } from '@/components/user-info';
// import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
// import { type User } from '@/types';
// import { Link } from '@inertiajs/react';
// import { LogOut, Settings } from 'lucide-react';

// interface UserMenuContentProps {
//     user: User;
// }

// export function UserMenuContent({ user }: UserMenuContentProps) {
//     const cleanup = useMobileNavigation();

//     return (
//         <>
//             <DropdownMenuLabel className="p-0 font-normal">
//                 <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
//                     <UserInfo user={user} showEmail={true} />
//                 </div>
//             </DropdownMenuLabel>
//             <DropdownMenuSeparator />
//             <DropdownMenuGroup>
//                 <DropdownMenuItem asChild>
//                     <Link className="block w-full" href={route('profile.edit')} as="button" prefetch onClick={cleanup}>
//                         <Settings className="mr-2" />
//                         Settings
//                     </Link>
//                 </DropdownMenuItem>
//             </DropdownMenuGroup>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem asChild>
//                 <Link className="block w-full" method="post" href={route('logout')} as="button" onClick={cleanup}>
//                     <LogOut className="mr-2" />
//                     Log out
//                 </Link>
//             </DropdownMenuItem>
//         </>
//     );
// }
import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { type User } from '@/types';
import { Link } from '@inertiajs/react';
import { LogOut, Settings, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { initDarkMode, toggleDarkMode } from '@/Utils/darkMode';

interface UserMenuContentProps {
    user: User;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
    const cleanup = useMobileNavigation();
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Initialiser le mode sombre lors du montage du composant
        const darkModeActive = initDarkMode();
        setIsDark(darkModeActive);
    }, []);

    const handleThemeToggle = () => {
        const newDarkMode = !isDark;
        toggleDarkMode(newDarkMode);
        setIsDark(newDarkMode);
    };

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <Link className="block w-full" href={route('profile.edit')} as="button" prefetch onClick={cleanup}>
                        <Settings className="mr-2 h-4 w-4" />
                        Paramètres
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleThemeToggle}>
                    {isDark ? (
                        <Sun className="mr-2 h-4 w-4" />
                    ) : (
                        <Moon className="mr-2 h-4 w-4" />
                    )}
                    {isDark ? 'Mode clair' : 'Mode sombre'}
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link className="block w-full" method="post" href={route('logout')} as="button" onClick={cleanup}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Déconnexion
                </Link>
            </DropdownMenuItem>
        </>
    );
}
