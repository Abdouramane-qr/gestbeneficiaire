// import { Head, useForm } from '@inertiajs/react';
// import { LoaderCircle } from 'lucide-react';
// import { FormEventHandler } from 'react';

// import InputError from '@/components/input-error';
// import TextLink from '@/components/text-link';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import AuthLayout from '@/layouts/auth-layout';

// type RegisterForm = {
//     name: string;
//     email: string;
//     password: string;
//     password_confirmation: string;
// };

// export default function Register() {
//     const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
//         name: '',
//         email: '',
//         password: '',
//         password_confirmation: '',
//     });

//     const submit: FormEventHandler = (e) => {
//         e.preventDefault();
//         post(route('register'), {
//             onFinish: () => reset('password', 'password_confirmation'),
//         });
//     };

//     return (
//         <AuthLayout title="Create an account" description="Enter your details below to create your account">
//             <Head title="Register" />
//             <form className="flex flex-col gap-6" onSubmit={submit}>
//                 <div className="grid gap-6">
//                     <div className="grid gap-2">
//                         <Label htmlFor="name">Name</Label>
//                         <Input
//                             id="name"
//                             type="text"
//                             required
//                             autoFocus
//                             tabIndex={1}
//                             autoComplete="name"
//                             value={data.name}
//                             onChange={(e) => setData('name', e.target.value)}
//                             disabled={processing}
//                             placeholder="Full name"
//                         />
//                         <InputError message={errors.name} className="mt-2" />
//                     </div>

//                     <div className="grid gap-2">
//                         <Label htmlFor="email">Email address</Label>
//                         <Input
//                             id="email"
//                             type="email"
//                             required
//                             tabIndex={2}
//                             autoComplete="email"
//                             value={data.email}
//                             onChange={(e) => setData('email', e.target.value)}
//                             disabled={processing}
//                             placeholder="email@example.com"
//                         />
//                         <InputError message={errors.email} />
//                     </div>

//                     <div className="grid gap-2">
//                         <Label htmlFor="password">Password</Label>
//                         <Input
//                             id="password"
//                             type="password"
//                             required
//                             tabIndex={3}
//                             autoComplete="new-password"
//                             value={data.password}
//                             onChange={(e) => setData('password', e.target.value)}
//                             disabled={processing}
//                             placeholder="Password"
//                         />
//                         <InputError message={errors.password} />
//                     </div>

//                     <div className="grid gap-2">
//                         <Label htmlFor="password_confirmation">Confirm password</Label>
//                         <Input
//                             id="password_confirmation"
//                             type="password"
//                             required
//                             tabIndex={4}
//                             autoComplete="new-password"
//                             value={data.password_confirmation}
//                             onChange={(e) => setData('password_confirmation', e.target.value)}
//                             disabled={processing}
//                             placeholder="Confirm password"
//                         />
//                         <InputError message={errors.password_confirmation} />
//                     </div>

//                     <Button type="submit" className="mt-2 w-full" tabIndex={5} disabled={processing}>
//                         {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
//                         Create account
//                     </Button>
//                 </div>

//                 <div className="text-muted-foreground text-center text-sm">
//                     Already have an account?{' '}
//                     <TextLink href={route('login')} tabIndex={6}>
//                         Log in
//                     </TextLink>
//                 </div>
//             </form>
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

// type RegisterForm = {
//     name: string;
//     prenom: string;
//     email: string;
//     password: string;

// };

// interface RegisterProps {
//     logo?: string;

// }

// export default function Register({
//     logo = "/logo.png",

// }: RegisterProps) {
//     const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
//         name: '',
//         prenom: '',
//         email: '',
//         password: '',

//     });

//     const submit: FormEventHandler = (e) => {
//         e.preventDefault();
//         post(route('register'), {
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
//                     <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">Inscription</h2>
//                     <Head title="Register" />

//                     <form onSubmit={submit} className="space-y-6">
//                         <div>
//                             <Label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom</Label>
//                             <Input
//                                 id="name"
//                                 type="text"
//                                 required
//                                 autoFocus
//                                 autoComplete="name"
//                                 value={data.name}
//                                 onChange={(e) => setData('name', e.target.value)}
//                                 placeholder="Votre nom"
//                                 className="mt-1 block w-full"
//                                 disabled={processing}
//                             />
//                             <InputError message={errors.name} className="mt-2" />
//                         </div>

//                         <div>
//                             <Label htmlFor="prenom" className="block text-sm font-medium text-gray-700">Prénom</Label>
//                             <Input
//                                 id="prenom"
//                                 type="text"
//                                 required
//                                 autoComplete="given-name"
//                                 value={data.prenom}
//                                 onChange={(e) => setData('prenom', e.target.value)}
//                                 placeholder="Votre prénom"
//                                 className="mt-1 block w-full"
//                                 disabled={processing}
//                             />
//                             <InputError message={errors.prenom} className="mt-2" />
//                         </div>

//                         <div>
//                             <Label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</Label>
//                             <Input
//                                 id="email"
//                                 type="email"
//                                 required
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
//                                 autoComplete="new-password"
//                                 value={data.password}
//                                 onChange={(e) => setData('password', e.target.value)}
//                                 placeholder="Mot de passe"
//                                 className="mt-1 block w-full"
//                                 disabled={processing}
//                             />
//                             <InputError message={errors.password} className="mt-2" />
//                         </div>


//                         <div className="grid gap-2">
//                         <Label htmlFor="password_confirmation">Confirm password</Label>
//                          <Input
//                             id="password_confirmation"
//                             type="password"
//                             required
//                             tabIndex={4}
//                              autoComplete="new-password"
//                              value={data.password_confirmation}
//                              onChange={(e) => setData('password_confirmation', e.target.value)}
//                              disabled={processing}
//                              placeholder="Confirm password"
//                          />
//                          <InputError message={errors.password_confirmation} />
//                     </div>

//                         <Button
//                             type="submit"
//                             className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                             disabled={processing}
//                         >
//                             {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
//                             S'inscrire
//                         </Button>
//                     </form>

//                     <div className="mt-6 text-center">
//                         <p className="text-sm text-gray-600">
//                             Déjà un compte ?{' '}
//                             <TextLink
//                                 href={route('login')}
//                                 className="font-medium text-blue-600 hover:text-blue-500"
//                             >
//                                 Connectez-vous
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

type RegisterForm = {
    name: string;
    prenom: string;
    email: string;
    password: string;
    password_confirmation: string;
    type: string;
};

interface RegisterProps {
    logo?: string;
    userTypes?: Array<{ id: string; name: string }>;
}

export default function Register({
    logo = "/logo.png",
    userTypes = [
        { id: 'promoteur', name: 'Promoteur' },
        { id: 'coach', name: 'Coach' },
        { id: 'ong', name: 'ONG' },
        { id: 'institution', name: 'Institution financière' },
        { id: 'admin', name: 'Administrateur' },
        { id: 'me', name: 'Suivi Evaluation (M&E)' }
    ]
}: RegisterProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        prenom: '',
        email: '',
        password: '',
        password_confirmation: '',
        type: 'promoteur', // Valeur par défaut
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md bg-white shadow-md rounded-lg">
                <div className="p-8">
                    <div className="flex justify-center mb-6">
                        <img
                            src={logo}
                            alt="Logo"
                            className="h-20 w-auto object-contain"
                        />
                    </div>
                    <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">Inscription</h2>
                    <Head title="Register" />

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <Label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom</Label>
                            <Input
                                id="name"
                                type="text"
                                required
                                autoFocus
                                autoComplete="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Votre nom"
                                className="mt-1 block w-full"
                                disabled={processing}
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div>
                            <Label htmlFor="prenom" className="block text-sm font-medium text-gray-700">Prénom</Label>
                            <Input
                                id="prenom"
                                type="text"
                                required
                                autoComplete="given-name"
                                value={data.prenom}
                                onChange={(e) => setData('prenom', e.target.value)}
                                placeholder="Votre prénom"
                                className="mt-1 block w-full"
                                disabled={processing}
                            />
                            <InputError message={errors.prenom} className="mt-2" />
                        </div>

                        <div>
                            <Label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                required
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
                            <Label htmlFor="type" className="block text-sm font-medium text-gray-700">Type d'utilisateur</Label>
                            <select
                                id="type"
                                value={data.type}
                                onChange={(e) => setData('type', e.target.value)}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                disabled={processing}
                            >
                                {userTypes.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.type} className="mt-2" />
                            <p className="mt-1 text-xs text-gray-500">
                                Votre compte sera configuré avec les permissions appropriées pour ce type d'utilisateur
                            </p>
                        </div>

                        <div>
                            <Label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                autoComplete="new-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Mot de passe"
                                className="mt-1 block w-full"
                                disabled={processing}
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div>
                            <Label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">Confirmer le mot de passe</Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                required
                                autoComplete="new-password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                placeholder="Confirmer le mot de passe"
                                className="mt-1 block w-full"
                                disabled={processing}
                            />
                            <InputError message={errors.password_confirmation} className="mt-2" />
                        </div>

                        <Button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            disabled={processing}
                        >
                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            S'inscrire
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Déjà un compte ?{' '}
                            <TextLink
                                href={route('login')}
                                className="font-medium text-blue-600 hover:text-blue-500"
                            >
                                Connectez-vous
                            </TextLink>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
