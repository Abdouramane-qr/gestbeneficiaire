
// import { Head, useForm } from '@inertiajs/react';
// import { LoaderCircle } from 'lucide-react';
// import { FormEventHandler } from 'react';

// import InputError from '@/components/input-error';
// import TextLink from '@/components/text-link';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';

// type LoginForm = {
//     email: string;
//     password: string;
//     remember: boolean;
// };

// interface LoginProps {
//     logo?: string;
//     canResetPassword: boolean;
//     status?: string;
// }

// export default function Login({ logo = '/logo.png', canResetPassword = false, status }: LoginProps) {
//     const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
//         email: '',
//         password: '',
//         remember: false,
//     });

//     const submit: FormEventHandler = (e) => {
//         e.preventDefault();
//         post(route('login'), {
//             onFinish: () => reset('password'),
//         });
//     };

//     return (
//         <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
//             <div className="w-full max-w-md rounded-lg bg-white shadow-md">
//                 <div className="p-8">
//                     <div className="mb-6 flex justify-center">
//                         <img src={logo} alt="Logo" className="h-20 w-auto object-contain" />
//                     </div>
//                     <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">Connexion</h2>
//                     <Head title="Connexion" />

//                     {status && <div className="mb-4 rounded border border-green-300 bg-green-100 p-4 text-green-800">{status}</div>}

//                     <form onSubmit={submit} className="space-y-6">
//                         <div>
//                             <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                                 Email
//                             </Label>
//                             <Input
//                                 id="email"
//                                 type="email"
//                                 required
//                                 autoFocus
//                                 autoComplete="email"
//                                 value={data.email}
//                                 onChange={(e) => setData('email', e.target.value)}
//                                 placeholder="votre.email@exemple.com"
//                                 className="mt-1 block w-full"
//                                 disabled={processing}
//                             />
//                             <InputError message={errors.email} className="mt-2" />
//                         </div>

//                         <div>
//                             <div className="flex items-center justify-between">
//                                 <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                                     Mot de passe
//                                 </Label>
//                                 {canResetPassword && (
//                                     <TextLink href={route('password.request')} className="text-sm text-blue-600 hover:text-blue-500">
//                                         Mot de passe oublié ?
//                                     </TextLink>
//                                 )}
//                             </div>
//                             <Input
//                                 id="password"
//                                 type="password"
//                                 required
//                                 autoComplete="current-password"
//                                 value={data.password}
//                                 onChange={(e) => setData('password', e.target.value)}
//                                 placeholder="Mot de passe"
//                                 className="mt-1 block w-full"
//                                 disabled={processing}
//                             />
//                             <InputError message={errors.password} className="mt-2" />
//                         </div>

//                         <div className="flex items-center">
//                             <input
//                                 type="checkbox"
//                                 id="remember"
//                                 checked={data.remember}
//                                 onChange={(e) => setData('remember', e.target.checked)}
//                                 disabled={processing}
//                                 className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                             />
//                             <Label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
//                                 Se souvenir de moi
//                             </Label>
//                         </div>

//                         <Button
//                             type="submit"
//                             className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
//                             disabled={processing}
//                         >
//                             {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
//                             Se connecter
//                         </Button>
//                     </form>

//                     <div className="mt-6 text-center">
//                         <p className="text-sm text-gray-600">
//                             Pas encore de compte ?{' '}
//                             <TextLink href={route('register')} className="font-medium text-blue-600 hover:text-blue-500">
//                                 Inscrivez-vous
//                             </TextLink>
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type LoginForm = {
    telephone: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    logo?: string;
    canResetPassword: boolean;
    status?: string;
}

export default function Login({ logo = '/logo.png', canResetPassword = false, status }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        telephone: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md rounded-lg bg-white shadow-md">
                <div className="p-8">
                    <div className="mb-6 flex justify-center">
                        <img src={logo} alt="Logo" className="h-20 w-auto object-contain" />
                    </div>
                    <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">Connexion</h2>
                    <Head title="Connexion" />

                    {status && <div className="mb-4 rounded border border-green-300 bg-green-100 p-4 text-green-800">{status}</div>}

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <Label htmlFor="telephone" className="block text-sm font-medium text-gray-700">
                                Numéro de téléphone  <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="telephone"
                                type="tel"
                                required
                                autoFocus
                                autoComplete="tel"
                                value={data.telephone}
                                onChange={(e) => setData('telephone', e.target.value)}
                                placeholder="Exemple: 70123456"
                                className="mt-1 block w-full"
                                disabled={processing}
                            />
                            <InputError message={errors.telephone} className="mt-2" />
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Mot de passe  <span className="text-red-500">*</span>
                                </Label>
                                {canResetPassword && (
                                    <TextLink href={route('password.request')} className="text-sm text-blue-600 hover:text-blue-500">
                                        Mot de passe oublié ?
                                    </TextLink>
                                )}
                            </div>
                            <Input
                                id="password"
                                type="password"
                                required
                                autoComplete="current-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Mot de passe"
                                className="mt-1 block w-full"
                                disabled={processing}
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                disabled={processing}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <Label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                                Se souvenir de moi
                            </Label>
                        </div>

                        <Button
                            type="submit"
                            className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                            disabled={processing}
                        >
                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            Se connecter
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Pas encore de compte ?{' '}
                            <TextLink href={route('register')} className="font-medium text-blue-600 hover:text-blue-500">
                                Inscrivez-vous
                            </TextLink>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
