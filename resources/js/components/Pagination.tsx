// resources/js/Components/Pagination.tsx
import React from 'react';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from './ui/button';

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface PaginationProps {
  links: PaginationLink[];
}

export default function Pagination({ links }: PaginationProps) {
    console.log('Pagination links:', links); // Debug

  // Si nous n'avons pas de liens ou juste une page, ne pas afficher de pagination
  if (!links || links.length <= 3) {
    return null;
  }

  return (
    <div className="flex items-center justify-center space-x-2">
      {links.map((link, key) => {
        // Afficher les liens avec des boutons appropriés
        if (link.url === null) {
          return (
            <Button
              key={key}
              variant="ghost"
              size="icon"
              disabled
              className="w-8 h-8"
            >
              {link.label === '...' ? (
                <MoreHorizontal className="h-4 w-4" />
              ) : (
                <span
                  dangerouslySetInnerHTML={{ __html: link.label }}
                  className="text-sm"
                />
              )}
            </Button>
          );
        }

        return (
          <Link key={key} href={link.url}>
            <Button
              variant={link.active ? "default" : "outline"}
              size="icon"
              className="w-8 h-8"
            >
              {link.label === '&laquo; Previous' ? (
                <ChevronLeft className="h-4 w-4" />
              ) : link.label === 'Next &raquo;' ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <span
                  dangerouslySetInnerHTML={{ __html: link.label }}
                  className="text-sm"
                />
              )}
            </Button>
          </Link>
        );
      })}
    </div>
  );
}
