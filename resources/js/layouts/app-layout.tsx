import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type ReactNode, useEffect } from 'react';
import { BreadcrumbItem } from '../types';
import { Toaster, toast } from 'sonner';
import { usePage } from '@inertiajs/react';

interface AppLayoutProps {
    children: ReactNode;
    title: string;
    breadcrumbs?: BreadcrumbItem[];
    user?: {
        id: number;
        name: string;
        email: string;
    };
    header?: React.ReactNode;
}

interface FlashMessages {
    error?: string;
    success?: string;
    message?: string;
    warning?: string;
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    const { flash } = usePage().props as unknown as { flash: FlashMessages };

    useEffect(() => {
        // Afficher les messages flash
        if (flash?.error) {
            toast.error(flash.error);
        }
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.message) {
            toast.info(flash.message);
        }
        if (flash?.warning) {
            toast.warning(flash.warning);
        }
    }, [flash]);

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            <div>
                <Toaster position="top-right" richColors closeButton />
                {children}
            </div>
        </AppLayoutTemplate>
    );
};
