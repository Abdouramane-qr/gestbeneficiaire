// resources/js/hooks/usePermissions.ts
import { usePage } from '@inertiajs/react';

interface AuthUser {
  id: number;
  role: {
    id: number;
    name: string;
    permissions: Record<string, string[]>;
  };
  type: string;
  coach_id?: number;
  ong_id?: number;
  institution_id?: number;
  beneficiaire_id?: number;
}

interface PageProps {
  auth: {
    user: AuthUser | null;
    can: Record<string, boolean>;
  };
}

export function usePermissions() {
  const { auth } = usePage<PageProps>().props;
  const user = auth.user;



  /**
   * Vérifie si l'utilisateur a la permission spécifiée
   */
  const hasPermission = (module: string, action: string = 'view'): boolean => {
    if (!user || !user.role || !user.role.permissions) return false;

    return user.role.permissions[module]?.includes(action) || false;
  };

  /**
   * Vérifie si l'utilisateur a un accès quelconque à un module
   */
  const hasModuleAccess = (module: string): boolean => {
    if (!user || !user.role || !user.role.permissions) return false;

    return !!user.role.permissions[module]?.length;
  };

  /**
   * Vérifie si l'utilisateur peut effectuer l'une des actions sur le module
   */
  const hasAnyPermission = (module: string, actions: string[]): boolean => {
    if (!user || !user.role || !user.role.permissions) return false;

    return actions.some(action => hasPermission(module, action));
  };

  /**
   * Vérifie si l'utilisateur a une permission dans n'importe lequel des modules
   */
  const hasPermissionInAny = (modules: string[], action: string = 'view'): boolean => {
    return modules.some(module => hasPermission(module, action));
  };

  /**
   * Vérifie si l'utilisateur a un type spécifique
   */
  const isUserType = (type: string | string[]): boolean => {
    if (!user) return false;

    if (Array.isArray(type)) {
      return type.includes(user.type);
    }

    return user.type === type;
  };

  /**
   * Raccourcis pour les capacités communes
   */
  const can = {
    ...auth.can,
    viewModule: (module: string) => hasPermission(module, 'view'),
    createInModule: (module: string) => hasPermission(module, 'create'),
    editInModule: (module: string) => hasPermission(module, 'edit'),
    deleteInModule: (module: string) => hasPermission(module, 'delete'),
    export: (module: string) => hasPermission(module, 'export'),
  };

  return {
    user,
    hasPermission,
    hasModuleAccess,
    hasAnyPermission,
    hasPermissionInAny,
    isUserType,
    can,
  };
}
