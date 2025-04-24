// import { Head, useForm } from '@inertiajs/react';
// import { LoaderCircle } from 'lucide-react';
// import { FormEventHandler } from 'react';

// import InputError from '@/components/input-error';
// import TextLink from '@/components/text-link';
// import { Button } from '@/components/ui/button';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import AuthLayout from '@/layouts/auth-layout';

// type LoginForm = {
//     email: string;
//     password: string;
//     remember: boolean;
// };

// interface LoginProps {
//     status?: string;
//     canResetPassword: boolean;
// }

// export default function Login({ status, canResetPassword }: LoginProps) {
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
//         <AuthLayout title="Log in to your account" description="Enter your email and password below to log in">
//             <Head title="Log in" />

//             <form className="flex flex-col gap-6" onSubmit={submit}>
//                 <div className="grid gap-6">
//                     <div className="grid gap-2">
//                         <Label htmlFor="email">Email address</Label>
//                         <Input
//                             id="email"
//                             type="email"
//                             required
//                             autoFocus
//                             tabIndex={1}
//                             autoComplete="email"
//                             value={data.email}
//                             onChange={(e) => setData('email', e.target.value)}
//                             placeholder="email@example.com"
//                         />
//                         <InputError message={errors.email} />
//                     </div>

//                     <div className="grid gap-2">
//                         <div className="flex items-center">
//                             <Label htmlFor="password">Password</Label>
//                             {canResetPassword && (
//                                 <TextLink href={route('password.request')} className="ml-auto text-sm" tabIndex={5}>
//                                     Forgot password?
//                                 </TextLink>
//                             )}
//                         </div>
//                         <Input
//                             id="password"
//                             type="password"
//                             required
//                             tabIndex={2}
//                             autoComplete="current-password"
//                             value={data.password}
//                             onChange={(e) => setData('password', e.target.value)}
//                             placeholder="Password"
//                         />
//                         <InputError message={errors.password} />
//                     </div>

//                     <div className="flex items-center space-x-3">
//                         <Checkbox
//                             id="remember"
//                             name="remember"
//                             checked={data.remember}
//                             onClick={() => setData('remember', !data.remember)}
//                             tabIndex={3}
//                         />
//                         <Label htmlFor="remember">Remember me</Label>
//                     </div>

//                     <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
//                         {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
//                         Log in
//                     </Button>
//                 </div>

//                 <div className="text-muted-foreground text-center text-sm">
//                     Don't have an account?{' '}
//                     <TextLink href={route('register')} tabIndex={5}>
//                         Sign up
//                     </TextLink>
//                 </div>
//             </form>

//             {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
//         </AuthLayout>
//     );
// }
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
// };

// interface LoginProps {
//     status?: string;
//     logo?: string;
// }

// export default function Login({ status, logo = "/logo.png" }: LoginProps) {
//     const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
//         email: '',
//         password: '',
//     });

//     const submit: FormEventHandler = (e) => {
//         e.preventDefault();
//         post(route('login'), {
//             onFinish: () => reset('password'),
//         });
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
//             <div className="w-full max-w-md bg-white shadow-md rounded-lg">
//                 <div className="p-8">
//                     <div className="flex justify-center mb-6">
//                         <img
//                             src={logo}
//                             alt="Logo"
//                             className="h-20 w-auto object-contain"
//                         />
//                     </div>
//                     <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">Connexion</h2>
//                     <Head title="Log in" />

//                     <form onSubmit={submit} className="space-y-6">
//                         <div>
//                             <Label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</Label>
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
//                             <Label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</Label>
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

//                         <Button
//                             type="submit"
//                             className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                             disabled={processing}
//                         >
//                             {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
//                             Se connecter
//                         </Button>
//                     </form>

//                     <div className="mt-6 text-center">
//                         <p className="text-sm text-gray-600">
//                             Pas de compte ?{' '}
//                             <TextLink
//                                 href={route('register')}
//                                 className="font-medium text-blue-600 hover:text-blue-500"
//                             >
//                                 Inscrivez-vous
//                             </TextLink>
//                         </p>
//                     </div>

//                     {status && (
//                         <div className="mt-4 text-center text-sm font-medium text-green-600">
//                             {status}
//                         </div>
//                     )}
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
    email: string;
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
        email: '',
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
                            <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                autoFocus
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="votre.email@exemple.com"
                                className="mt-1 block w-full"
                                disabled={processing}
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Mot de passe
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
