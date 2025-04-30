// import React, { useState } from 'react';
// import { Head, useForm } from '@inertiajs/react';
// import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
// import { Eye, EyeOff, Save, X } from 'lucide-react';
// import { Link } from '@inertiajs/react';

// interface Role {
//   id: number;
//   name: string;
//   description?: string;
// }

// interface UserType {
//   id: string;
//   name: string;
// }

// interface CreateProps {
//   auth: {
//     user: {
//       id: number;
//       name: string;
//       email: string;
//     };
//   };
//   roles: Role[];
//   types: UserType[];
// }

// type UserFormData = {
//   name: string;
//   email: string;
//   password: string;
//   password_confirmation: string;
//   role_id: string;
//   type: string;
// };

// export default function Create({ auth, roles, types }: CreateProps) {
//   const { data, setData, post, processing, errors } = useForm<UserFormData>({
//     name: '',
//     email: '',
//     password: '',
//     password_confirmation: '',
//     role_id: '',
//     type: '',
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     post(route('users.store'));
//   };

//   return (
//     <AuthenticatedLayout
//       user={auth.user}
//       title="Créer un utilisateur"
//       header={
//         <h2 className="font-semibold text-xl text-gray-800 leading-tight">
//           Créer un nouvel utilisateur
//         </h2>
//       }
//     >
//       <Head title="Créer un utilisateur" />

//       <div className="py-12">
//         <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
//           <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
//             <div className="p-6 bg-white border-b border-gray-200">
//               <form onSubmit={handleSubmit}>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <div className="mb-6">
//                       <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//                         Nom complet
//                       </label>
//                       <input
//                         id="name"
//                         type="text"
//                         className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
//                         value={data.name}
//                         onChange={(e) => setData('name', e.target.value)}
//                       />
//                       {errors.name && <div className="text-red-500 mt-1 text-sm">{errors.name}</div>}
//                     </div>

//                     <div className="mb-6">
//                       <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                         Email
//                       </label>
//                       <input
//                         id="email"
//                         type="email"
//                         className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
//                         value={data.email}
//                         onChange={(e) => setData('email', e.target.value)}
//                       />
//                       {errors.email && <div className="text-red-500 mt-1 text-sm">{errors.email}</div>}
//                     </div>

//                     <div className="mb-6">
//                       <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                         Mot de passe
//                       </label>
//                       <div className="mt-1 relative">
//                         <input
//                           id="password"
//                           type={showPassword ? 'text' : 'password'}
//                           className="block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
//                           value={data.password}
//                           onChange={(e) => setData('password', e.target.value)}
//                         />
//                         <button
//                           type="button"
//                           className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                           onClick={() => setShowPassword(!showPassword)}
//                         >
//                           {showPassword ? (
//                             <EyeOff size={20} className="text-gray-500" />
//                           ) : (
//                             <Eye size={20} className="text-gray-500" />
//                           )}
//                         </button>
//                       </div>
//                       {errors.password && <div className="text-red-500 mt-1 text-sm">{errors.password}</div>}
//                     </div>

//                     <div className="mb-6">
//                       <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
//                         Confirmer le mot de passe
//                       </label>
//                       <div className="mt-1 relative">
//                         <input
//                           id="password_confirmation"
//                           type={showConfirmPassword ? 'text' : 'password'}
//                           className="block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
//                           value={data.password_confirmation}
//                           onChange={(e) => setData('password_confirmation', e.target.value)}
//                         />
//                         <button
//                           type="button"
//                           className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                           onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                         >
//                           {showConfirmPassword ? (
//                             <EyeOff size={20} className="text-gray-500" />
//                           ) : (
//                             <Eye size={20} className="text-gray-500" />
//                           )}
//                         </button>
//                       </div>
//                       {errors.password_confirmation && (
//                         <div className="text-red-500 mt-1 text-sm">{errors.password_confirmation}</div>
//                       )}
//                     </div>
//                   </div>

//                   <div>
//                     <div className="mb-6">
//                       <label htmlFor="type" className="block text-sm font-medium text-gray-700">
//                         Type d'utilisateur
//                       </label>
//                       <select
//                         id="type"
//                         className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
//                         value={data.type}
//                         onChange={(e) => setData('type', e.target.value)}
//                       >
//                         <option value="">Sélectionner un type</option>
//                         {types.map((type) => (
//                           <option key={type.id} value={type.id}>
//                             {type.name}
//                           </option>
//                         ))}
//                       </select>
//                       {errors.type && <div className="text-red-500 mt-1 text-sm">{errors.type}</div>}
//                     </div>

//                     <div className="mb-6">
//                       <label htmlFor="role_id" className="block text-sm font-medium text-gray-700">
//                         Rôle
//                       </label>
//                       <select
//                         id="role_id"
//                         className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
//                         value={data.role_id}
//                         onChange={(e) => setData('role_id', e.target.value)}
//                       >
//                         <option value="">Sélectionner un rôle</option>
//                         {roles.map((role) => (
//                           <option key={role.id} value={role.id.toString()}>
//                             {role.name} - {role.description}
//                           </option>
//                         ))}
//                       </select>
//                       {errors.role_id && <div className="text-red-500 mt-1 text-sm">{errors.role_id}</div>}
//                     </div>

//                     <div className="mt-12 p-4 bg-blue-50 rounded-md">
//                       <h3 className="font-medium text-blue-800 mb-2">Information importante</h3>
//                       <p className="text-sm text-blue-700">
//                         Les utilisateurs nouvellement créés auront accès au système selon leur rôle.
//                         Assurez-vous d'attribuer le rôle approprié pour contrôler leurs permissions.
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="mt-8 flex items-center justify-end border-t pt-4">
//                   <Link
//                     href={route('users.index')}
//                     className="inline-flex items-center px-4 py-2 bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-300 mr-2"
//                   >
//                     <X size={16} className="mr-2" />
//                     Annuler
//                   </Link>
//                   <button
//                     type="submit"
//                     className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700"
//                     disabled={processing}
//                   >
//                     <Save size={16} className="mr-2" />
//                     {processing ? 'Création...' : 'Créer l\'utilisateur'}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </AuthenticatedLayout>
//   );
// }
// resources/js/Pages/Users/Create.jsx
import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
// Composants de création de profil coach

export default function Create({ auth, roles, types, ongs }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role_id: '',
        type: '',
        // Champs pour le profil coach
        coach_profile: {
            nom: '',
            prenom: '',
            telephone: '',
            ong_id: '',
            specialite: '',
            est_actif: true
        }
    });

    // État pour déterminer si les champs de coach doivent être affichés
    const [showCoachFields, setShowCoachFields] = useState(false);

    // Mettre à jour l'affichage des champs de coach en fonction du type sélectionné
    useEffect(() => {
        setShowCoachFields(data.type === 'coach');

        // Pré-remplir les informations du coach si le type est coach
        if (data.type === 'coach') {
            setData('coach_profile', {
                ...data.coach_profile,
                nom: data.name.split(' ')[0] || '',
                prenom: data.name.split(' ').slice(1).join(' ') || ''
            });
        }
    }, [data.type, data.name, data.email]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('users.store'));
    };

    // Mettre à jour les champs du coach lors de la modification des champs utilisateur
    const handleUserFieldChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);

        // Synchroniser les champs communs avec le profil coach
        if (showCoachFields) {
            if (name === 'name') {
                const nameParts = value.split(' ');
                setData('coach_profile', {
                    ...data.coach_profile,
                    nom: nameParts[0] || '',
                    prenom: nameParts.slice(1).join(' ') || ''
                });
            } else if (name === 'email') {
                setData('coach_profile', {
                    ...data.coach_profile,
                    email: value
                });
            }
        }
    };

    // Gérer les modifications des champs du profil coach
    const handleCoachFieldChange = (e) => {
        const { name, value, type, checked } = e.target;
        const fieldValue = type === 'checkbox' ? checked : value;

        setData('coach_profile', {
            ...data.coach_profile,
            [name]: fieldValue
        });
    };

    return (
        <AppLayout
            title="Créer un utilisateur"
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Créer un utilisateur</h2>}
        >
            <Head title="Créer un utilisateur" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-6">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom complet</label>
                                    <input
                                        id="name"
                                        type="text"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        value={data.name}
                                        onChange={handleUserFieldChange}
                                        name="name"
                                        required
                                    />
                                    {errors.name && <div className="text-red-500 mt-1">{errors.name}</div>}
                                </div>

                                <div className="mb-6">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        id="email"
                                        type="email"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        value={data.email}
                                        onChange={handleUserFieldChange}
                                        name="email"
                                        required
                                    />
                                    {errors.email && <div className="text-red-500 mt-1">{errors.email}</div>}
                                </div>

                                <div className="mb-6">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
                                    <input
                                        id="password"
                                        type="password"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        value={data.password}
                                        onChange={handleUserFieldChange}
                                        name="password"
                                        required
                                    />
                                    {errors.password && <div className="text-red-500 mt-1">{errors.password}</div>}
                                </div>

                                <div className="mb-6">
                                    <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
                                    <input
                                        id="password_confirmation"
                                        type="password"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        value={data.password_confirmation}
                                        onChange={handleUserFieldChange}
                                        name="password_confirmation"
                                        required
                                    />
                                </div>

                                <div className="mb-6">
                                    <label htmlFor="role_id" className="block text-sm font-medium text-gray-700">Rôle</label>
                                    <select
                                        id="role_id"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        value={data.role_id}
                                        onChange={handleUserFieldChange}
                                        name="role_id"
                                        required
                                    >
                                        <option value="">Sélectionner un rôle</option>
                                        {roles.map(role => (
                                            <option key={role.id} value={role.id}>{role.name}</option>
                                        ))}
                                    </select>
                                    {errors.role_id && <div className="text-red-500 mt-1">{errors.role_id}</div>}
                                </div>

                                <div className="mb-6">
                                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type d'utilisateur</label>
                                    <select
                                        id="type"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        value={data.type}
                                        onChange={handleUserFieldChange}
                                        name="type"
                                        required
                                    >
                                        <option value="">Sélectionner un type</option>
                                        {types.map(type => (
                                            <option key={type.id} value={type.id}>{type.name}</option>
                                        ))}
                                    </select>
                                    {errors.type && <div className="text-red-500 mt-1">{errors.type}</div>}
                                </div>

                                {/* Champs spécifiques au profil coach */}
                                {showCoachFields && (
                                    <div className="mt-8 border-t pt-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Informations du profil coach</h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                            {/* Téléphone */}
                                            <div>
                                                <label htmlFor="coach_telephone" className="block text-sm font-medium text-gray-700">
                                                    Téléphone
                                                </label>
                                                <input
                                                    id="coach_telephone"
                                                    type="text"
                                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                    value={data.coach_profile.telephone}
                                                    onChange={handleCoachFieldChange}
                                                    name="telephone"
                                                />
                                                {errors['coach_profile.telephone'] && (
                                                    <div className="text-red-500 mt-1">{errors['coach_profile.telephone']}</div>
                                                )}
                                            </div>

                                            {/* Spécialité */}
                                            <div>
                                                <label htmlFor="coach_specialite" className="block text-sm font-medium text-gray-700">
                                                    Spécialité
                                                </label>
                                                <input
                                                    id="coach_specialite"
                                                    type="text"
                                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                    value={data.coach_profile.specialite}
                                                    onChange={handleCoachFieldChange}
                                                    name="specialite"
                                                />
                                                {errors['coach_profile.specialite'] && (
                                                    <div className="text-red-500 mt-1">{errors['coach_profile.specialite']}</div>
                                                )}
                                            </div>
                                        </div>

                                        {/* ONG */}
                                        <div className="mb-6">
                                            <label htmlFor="coach_ong_id" className="block text-sm font-medium text-gray-700">
                                                ONG
                                            </label>
                                            <select
                                                id="coach_ong_id"
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                value={data.coach_profile.ong_id}
                                                onChange={handleCoachFieldChange}
                                                name="ong_id"
                                                required
                                            >
                                                <option value="">Sélectionner une ONG</option>
                                                {ongs.map(ong => (
                                                    <option key={ong.id} value={ong.id}>{ong.nom}</option>
                                                ))}
                                            </select>
                                            {errors['coach_profile.ong_id'] && (
                                                <div className="text-red-500 mt-1">{errors['coach_profile.ong_id']}</div>
                                            )}
                                        </div>

                                        {/* Est actif */}
                                        <div className="mb-6 flex items-center">
                                            <input
                                                id="coach_est_actif"
                                                type="checkbox"
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                checked={data.coach_profile.est_actif}
                                                onChange={handleCoachFieldChange}
                                                name="est_actif"
                                            />
                                            <label htmlFor="coach_est_actif" className="ml-2 block text-sm font-medium text-gray-700">
                                                Coach actif
                                            </label>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center justify-end mt-6">
                                    <button
                                        type="submit"
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-300 disabled:opacity-25 transition"
                                        disabled={processing}
                                    >
                                        {processing ? 'Création en cours...' : 'Créer l\'utilisateur'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
