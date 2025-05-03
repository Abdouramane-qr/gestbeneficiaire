// resources/js/components/PermissionGuard.tsx
import React from 'react';
import { usePermissions } from '@/hooks/usePermissions';

interface PermissionGuardProps {
  module: string;
  action?: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Composant pour afficher/masquer du contenu selon les permissions
 */
const PermissionGuard: React.FC<PermissionGuardProps> = ({
  module,
  action = 'view',
  fallback = null,
  children
}) => {
  const { hasPermission } = usePermissions();

  if (hasPermission(module, action)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};

export default PermissionGuard;
