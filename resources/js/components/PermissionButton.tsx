// resources/js/Components/PermissionButton.tsx
import React from 'react';
import { Link } from '@inertiajs/react';
import { usePermissions } from '@/hooks/usePermissions';

interface PermissionButtonProps {
  module: string;
  action?: string;
  href?: string;
  method?: 'get' | 'post' | 'put' | 'patch' | 'delete';
  as?: 'button' | 'a';
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
  data?: Record<string, any>;
  processing?: boolean;
  preserveScroll?: boolean;
}

const PermissionButton: React.FC<PermissionButtonProps> = ({
  module,
  action = 'view',
  href,
  method = 'get',
  as = 'button',
  onClick,
  className = '',
  children,
  disabled = false,
  data = {},
  processing = false,
  preserveScroll = false,
}) => {
  const { hasPermission } = usePermissions();

  // Vérifier si l'utilisateur a la permission nécessaire
  const hasAccess = hasPermission(module, action);

  if (!hasAccess) {
    return null; // Ne pas rendre le bouton si l'utilisateur n'a pas la permission
  }

  // Classe de base pour tous les boutons
  const baseClass = `
    inline-flex items-center px-4 py-2 border rounded-md font-semibold text-xs uppercase tracking-widest
    focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-150
    ${disabled || processing ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `;

  // Si c'est un lien
  if (href) {
    return (
      <Link
        href={href}
        method={method}
        data={data}
        className={baseClass}
        preserveScroll={preserveScroll}
        disabled={disabled || processing}
      >
        {children}
      </Link>
    );
  }

  // Si c'est un bouton
  return (
    <button
      type="button"
      onClick={onClick}
      className={baseClass}
      disabled={disabled || processing}
    >
      {children}
    </button>
  );
};

export default PermissionButton;
