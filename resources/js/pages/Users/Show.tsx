import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Edit, Key, WifiOff } from 'lucide-react';
import React from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    telephone: string;
    type?: string;
    role?: {
        id: number;
        name: string;
        description?: string;
    };
    created_at: string;
    updated_at: string;
}

interface ShowProps {
    auth: {
        user: {
            id: number;
            name: string;
            telephone: string;
            email: string;
            role?: {
                permissions?: Record<string, string[]>;
            };
        };
    };
    user: User;
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function Show({ auth, user, flash }: ShowProps) {
    // État pour suivre la connectivité
    const [isOnline, setIsOnline] = React.useState(navigator.onLine);

    // Gestionnaires d'événements pour suivre les changements de connectivité
    React.useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const formatDate = (dateString: string): string => {
        try {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            }).format(date);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return dateString;
        }
    };

    return (
        <AppLayout
            user={auth.user}
            title={`Utilisateur: ${user.name}`}
            header={<h2 className="text-xl leading-tight font-semibold text-gray-800">Détails de l'utilisateur</h2>}
        >
            <Head title={`Utilisateur: ${user.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Indicateur de connectivité */}
                    {!isOnline && (
                        <div className="mb-4 flex items-center rounded border border-yellow-300 bg-yellow-100 p-3 text-yellow-800">
                            <WifiOff size={18} className="mr-2" />
                            <span>Mode hors ligne. Les modifications seront synchronisées lorsque vous serez à nouveau en ligne.</span>
                        </div>
                    )}

                    {flash?.success && <div className="mb-4 rounded border border-green-300 bg-green-100 p-4 text-green-800">{flash.success}</div>}

                    {flash?.error && <div className="mb-4 rounded border border-red-300 bg-red-100 p-4 text-red-800">{flash.error}</div>}

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="border-b border-gray-200 bg-white p-6">
                            <div className="mb-6 flex flex-col justify-between sm:flex-row sm:items-center">
                                <h3 className="text-lg font-medium text-gray-900">Informations de l'utilisateur</h3>

                                <div className="mt-4 flex space-x-2 sm:mt-0">
                                    {auth.user.role?.permissions?.utilisateurs?.includes('edit') && (
                                        <>
                                            <Link
                                                href={route('users.edit', user.id)}
                                                className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-xs font-semibold tracking-widest text-white uppercase hover:bg-blue-700"
                                            >
                                                <Edit size={16} className="mr-2" />
                                                Modifier
                                            </Link>

                                            <Link
                                                href={route('users.edit.password', user.id)}
                                                className="inline-flex items-center rounded-md border border-transparent bg-gray-800 px-4 py-2 text-xs font-semibold tracking-widest text-white uppercase hover:bg-gray-700"
                                            >
                                                <Key size={16} className="mr-2" />
                                                Mot de passe
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">ID</label>
                                        <div className="mt-1 rounded-md border border-gray-300 bg-gray-50 p-2">{user.id}</div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Nom</label>
                                        <div className="mt-1 rounded-md border border-gray-300 bg-gray-50 p-2">{user.name}</div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <div className="mt-1 rounded-md border border-gray-300 bg-gray-50 p-2">{user.email}</div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Telephone</label>
                                        <div className="mt-1 rounded-md border border-gray-300 bg-gray-50 p-2">{user.telephone}</div>
                                    </div>
                                </div>

                                <div>
                                    {user.role && (
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">Rôle</label>
                                            <div className="mt-1 flex items-center rounded-md border border-gray-300 bg-gray-50 p-2">
                                                <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs leading-5 font-semibold text-green-800">
                                                    {user.role.name}
                                                </span>
                                            </div>
                                            {user.role.description && <p className="mt-1 text-sm text-gray-500">{user.role.description}</p>}
                                        </div>
                                    )}
                                    {user.type && (
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">Type d'utilisateur</label>
                                            <div className="mt-1 flex items-center rounded-md border border-gray-300 bg-gray-50 p-2">
                                                <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs leading-5 font-semibold text-blue-800">
                                                    {user.type}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Date de création</label>
                                        <div className="mt-1 rounded-md border border-gray-300 bg-gray-50 p-2">{formatDate(user.created_at)}</div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Dernière modification</label>
                                        <div className="mt-1 rounded-md border border-gray-300 bg-gray-50 p-2">{formatDate(user.updated_at)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <Link
                            href={route('users.index')}
                            className="inline-flex items-center rounded-md border border-transparent bg-gray-200 px-4 py-2 text-xs font-semibold tracking-widest text-gray-700 uppercase hover:bg-gray-300"
                        >
                            Retour à la liste
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
