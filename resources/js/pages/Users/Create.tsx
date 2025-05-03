// import React, { useState, useEffect } from 'react';
// import { Head, useForm } from '@inertiajs/react';
// import AppLayout from '@/layouts/app-layout';

// interface Role {
//   id: number;
//   name: string;
//   description: string;
// }

// interface UserType {
//   id: string;
//   name: string;
// }

// interface Ong {
//   id: number;
//   nom: string;
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
//   ongs: Ong[]; // Définir le type pour ongs
// }

// interface CoachProfile {
//   nom: string;
//   prenom: string;
//   telephone: string;
//   ong_id: string | number;
//   specialite: string;
//   est_actif: boolean;
// }

// interface UserFormData {
//   name: string;
//   email: string;
//   telephone: string; // Ajout du téléphone
//   password: string;
//   password_confirmation: string;
//   role_id: string | number;
//   type: string;
//   coach_profile: CoachProfile;
// }

// export default function Create({ auth, roles, types, ongs = [] }: CreateProps) { // Valeur par défaut pour ongs
//     const { data, setData, post, processing, errors, reset } = useForm<UserFormData>({
//         name: '',
//         email: '',
//         telephone: '', // Ajout du téléphone
//         password: '',
//         password_confirmation: '',
//         role_id: '',
//         type: '',
//         // Champs pour le profil coach
//         coach_profile: {
//             nom: '',
//             prenom: '',
//             telephone: '',
//             ong_id: '',
//             specialite: '',
//             est_actif: true
//         }
//     });

//     // État pour déterminer si les champs de coach doivent être affichés
//     const [showCoachFields, setShowCoachFields] = useState(false);

//     // Mettre à jour l'affichage des champs de coach en fonction du type sélectionné
//     useEffect(() => {
//         setShowCoachFields(data.type === 'coach');

//         // Pré-remplir les informations du coach si le type est coach
//         if (data.type === 'coach') {
//             setData('coach_profile', {
//                 ...data.coach_profile,
//                 nom: data.name.split(' ')[0] || '',
//                 prenom: data.name.split(' ').slice(1).join(' ') || '',
//                 telephone: data.telephone || '' // Synchroniser aussi le téléphone
//             });
//         }
//     }, [data.type, data.name, data.telephone, data.email]);

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         post(route('users.store'));
//     };

//     // Mettre à jour les champs du coach lors de la modification des champs utilisateur
//     const handleUserFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//         const { name, value } = e.target;
//         setData(name as keyof UserFormData, value);

//         // Synchroniser les champs communs avec le profil coach
//         if (showCoachFields) {
//             if (name === 'name') {
//                 const nameParts = value.split(' ');
//                 setData('coach_profile', {
//                     ...data.coach_profile,
//                     nom: nameParts[0] || '',
//                     prenom: nameParts.slice(1).join(' ') || ''
//                 });
//             } else if (name === 'email') {
//                 setData('coach_profile', {
//                     ...data.coach_profile,
//                     email: value
//                 });
//             } else if (name === 'telephone') {
//                 setData('coach_profile', {
//                     ...data.coach_profile,
//                     telephone: value
//                 });
//             }
//         }
//     };

//     // Gérer les modifications des champs du profil coach
//     const handleCoachFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//         const { name, value, type } = e.target;
//         const fieldValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

//         setData('coach_profile', {
//             ...data.coach_profile,
//             [name]: fieldValue
//         });
//     };

//     return (
//         <AppLayout
//             title="Créer un utilisateur"
//             user={auth.user}
//             header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Créer un utilisateur</h2>}
//         >
//             <Head title="Créer un utilisateur" />

//             <div className="py-12">
//                 <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
//                     <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
//                         <div className="p-6 bg-white border-b border-gray-200">
//                             <form onSubmit={handleSubmit}>
//                                 <div className="mb-6">
//                                     <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom complet</label>
//                                     <input
//                                         id="name"
//                                         type="text"
//                                         className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                                         value={data.name}
//                                         onChange={handleUserFieldChange}
//                                         name="name"
//                                         required
//                                     />
//                                     {errors.name && <div className="text-red-500 mt-1">{errors.name}</div>}
//                                 </div>

//                                 <div className="mb-6">
//                                     <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">Téléphone</label>
//                                     <input
//                                         id="telephone"
//                                         type="tel"
//                                         className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                                         value={data.telephone}
//                                         onChange={handleUserFieldChange}
//                                         name="telephone"
//                                         required
//                                         placeholder="70XXXXXX"
//                                     />
//                                     {errors.telephone && <div className="text-red-500 mt-1">{errors.telephone}</div>}
//                                 </div>

//                                 <div className="mb-6">
//                                     <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email (optionnel)</label>
//                                     <input
//                                         id="email"
//                                         type="email"
//                                         className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                                         value={data.email}
//                                         onChange={handleUserFieldChange}
//                                         name="email"
//                                     />
//                                     {errors.email && <div className="text-red-500 mt-1">{errors.email}</div>}
//                                 </div>

//                                 <div className="mb-6">
//                                     <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
//                                     <input
//                                         id="password"
//                                         type="password"
//                                         className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                                         value={data.password}
//                                         onChange={handleUserFieldChange}
//                                         name="password"
//                                         required
//                                     />
//                                     {errors.password && <div className="text-red-500 mt-1">{errors.password}</div>}
//                                 </div>

//                                 <div className="mb-6">
//                                     <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
//                                     <input
//                                         id="password_confirmation"
//                                         type="password"
//                                         className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                                         value={data.password_confirmation}
//                                         onChange={handleUserFieldChange}
//                                         name="password_confirmation"
//                                         required
//                                     />
//                                 </div>

//                                 <div className="mb-6">
//                                     <label htmlFor="role_id" className="block text-sm font-medium text-gray-700">Rôle</label>
//                                     <select
//                                         id="role_id"
//                                         className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                                         value={data.role_id}
//                                         onChange={handleUserFieldChange}
//                                         name="role_id"
//                                         required
//                                     >
//                                         <option value="">Sélectionner un rôle</option>
//                                         {roles.map(role => (
//                                             <option key={role.id} value={role.id}>{role.name}</option>
//                                         ))}
//                                     </select>
//                                     {errors.role_id && <div className="text-red-500 mt-1">{errors.role_id}</div>}
//                                 </div>

//                                 <div className="mb-6">
//                                     <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type d'utilisateur</label>
//                                     <select
//                                         id="type"
//                                         className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                                         value={data.type}
//                                         onChange={handleUserFieldChange}
//                                         name="type"
//                                         required
//                                     >
//                                         <option value="">Sélectionner un type</option>
//                                         {types.map(type => (
//                                             <option key={type.id} value={type.id}>{type.name}</option>
//                                         ))}
//                                     </select>
//                                     {errors.type && <div className="text-red-500 mt-1">{errors.type}</div>}
//                                 </div>

//                                 {/* Champs spécifiques au profil coach */}
//                                 {showCoachFields && (
//                                     <div className="mt-8 border-t pt-6">
//                                         <h3 className="text-lg font-medium text-gray-900 mb-4">Informations du profil coach</h3>

//                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//                                             {/* Téléphone coach - Déjà synchronisé avec le téléphone utilisateur */}
//                                             <div>
//                                                 <label htmlFor="coach_specialite" className="block text-sm font-medium text-gray-700">
//                                                     Spécialité
//                                                 </label>
//                                                 <input
//                                                     id="coach_specialite"
//                                                     type="text"
//                                                     className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                                                     value={data.coach_profile.specialite}
//                                                     onChange={handleCoachFieldChange}
//                                                     name="specialite"
//                                                 />
//                                                 {errors['coach_profile.specialite'] && (
//                                                     <div className="text-red-500 mt-1">{errors['coach_profile.specialite']}</div>
//                                                 )}
//                                             </div>
//                                         </div>

//                                         {/* ONG */}
//                                         <div className="mb-6">
//                                             <label htmlFor="coach_ong_id" className="block text-sm font-medium text-gray-700">
//                                                 ONG
//                                             </label>
//                                             <select
//                                                 id="coach_ong_id"
//                                                 className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                                                 value={data.coach_profile.ong_id}
//                                                 onChange={handleCoachFieldChange}
//                                                 name="ong_id"
//                                                 required
//                                             >
//                                                 <option value="">Sélectionner une ONG</option>
//                                                 {ongs.map(ong => (
//                                                     <option key={ong.id} value={ong.id}>{ong.nom}</option>
//                                                 ))}
//                                             </select>
//                                             {errors['coach_profile.ong_id'] && (
//                                                 <div className="text-red-500 mt-1">{errors['coach_profile.ong_id']}</div>
//                                             )}
//                                         </div>

//                                         {/* Est actif */}
//                                         <div className="mb-6 flex items-center">
//                                             <input
//                                                 id="coach_est_actif"
//                                                 type="checkbox"
//                                                 className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//                                                 checked={data.coach_profile.est_actif}
//                                                 onChange={handleCoachFieldChange}
//                                                 name="est_actif"
//                                             />
//                                             <label htmlFor="coach_est_actif" className="ml-2 block text-sm font-medium text-gray-700">
//                                                 Coach actif
//                                             </label>
//                                         </div>
//                                     </div>
//                                 )}

//                                 <div className="flex items-center justify-end mt-6">
//                                     <button
//                                         type="submit"
//                                         className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-300 disabled:opacity-25 transition"
//                                         disabled={processing}
//                                     >
//                                         {processing ? 'Création en cours...' : 'Créer l\'utilisateur'}
//                                     </button>
//                                 </div>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </AppLayout>
//     );
// }

// resources/js/Pages/Users/Create.tsx
import React, { useState } from 'react';
import { usePage, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Panel from '@/components/Panel';

interface CoachProfile {
  nom: string;
  prenom: string;
  telephone: string;
  ong_id: number | string;
  specialite?: string;
  est_actif?: boolean;
}

interface UserFormData {
  name: string;
  email: string;
  telephone: string;
  password: string;
  password_confirmation: string;
  role_id: number | string;
  type: string;
  coach_profile?: CoachProfile;
  ong_id?: number | string;
  institution_id?: number | string;
  beneficiaire_id?: number | string;
  promoteurs?: number[];
}

interface ONG {
  id: number;
  nom: string;
}

interface Institution {
  id: number;
  nom: string;
}

interface Promoteur {
  id: number;
  nom: string;
  prenom: string;
  contact: string;
}

interface Role {
  id: number;
  name: string;
}

interface PageProps {
  roles: Role[];
  types: { id: string; name: string }[];
  ongs: ONG[];
  institutions: Institution[];
  promoteurs: Promoteur[];
  typeRoleMappings: Record<string, string>;
  roleTypeMappings: Record<string, string>;
}

export default function Create() {
  const { roles, types, ongs, institutions, promoteurs, typeRoleMappings, roleTypeMappings } = usePage<PageProps>().props;

  const { data, setData, post, processing, errors } = useForm<UserFormData>({
    name: '',
    email: '',
    telephone: '',
    password: '',
    password_confirmation: '',
    role_id: '',
    type: '',
    coach_profile: {
      nom: '',
      prenom: '',
      telephone: '',
      ong_id: '',
      specialite: '',
      est_actif: true
    },
    promoteurs: []
  });

  const [showCoachFields, setShowCoachFields] = useState(false);
  const [showOngFields, setShowOngFields] = useState(false);
  const [showInstitutionFields, setShowInstitutionFields] = useState(false);
  const [showPromoteurFields, setShowPromoteurFields] = useState(false);

  const updateFormByType = (type: string) => {
    setData(data => ({ ...data, type }));

    setShowCoachFields(type === 'coach');
    setShowOngFields(type === 'ong');
    setShowInstitutionFields(type === 'institution');
    setShowPromoteurFields(type === 'promoteur');

    const roleMapping = typeRoleMappings[type];
    if (roleMapping) {
      const matchedRole = roles.find(role => role.name === roleMapping);
      if (matchedRole) {
        setData(data => ({ ...data, role_id: matchedRole.id }));
      }
    }
  };

  const updateTypeByRole = (roleId: number | string) => {
    setData(data => ({ ...data, role_id: roleId }));

    const role = roles.find(r => r.id === Number(roleId));
    if (role && roleTypeMappings[role.name]) {
      updateFormByType(roleTypeMappings[role.name]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('users.store'));
  };

  return (
    <AppLayout title="Créer un Utilisateur">
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Panel>
            <Panel.Header>
              <h2 className="text-lg font-medium">Création d'un Nouvel Utilisateur</h2>
            </Panel.Header>

            <Panel.Content>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Informations de base */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nom</label>
                    <input
                      type="text"
                      value={data.name}
                      onChange={e => setData('name', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={data.email}
                      onChange={e => setData('email', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                    <input
                      type="tel"
                      value={data.telephone}
                      onChange={e => setData('telephone', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    />
                    {errors.telephone && <p className="text-red-500 text-sm mt-1">{errors.telephone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type d'utilisateur</label>
                    <select
                      value={data.type}
                      onChange={e => updateFormByType(e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    >
                      <option value="">Sélectionner un type</option>
                      {types.map(type => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>
                    {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}

                    </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Rôle</label>
                    <select
                      value={data.role_id}
                      onChange={e => updateTypeByRole(e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    >
                      <option value="">Sélectionner un rôle</option>
                      {roles.map(role => (
                        <option key={role.id} value={role.id}>{role.name}</option>
                      ))}
                    </select>
                    {errors.role_id && <p className="text-red-500 text-sm mt-1">{errors.role_id}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
                    <input
                      type="password"
                      value={data.password}
                      onChange={e => setData('password', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    />
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
                    <input
                      type="password"
                      value={data.password_confirmation}
                      onChange={e => setData('password_confirmation', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    />
                  </div>
                </div>

                {/* Champs spécifiques au Coach */}
                {showCoachFields && (
                  <div className="border p-4 rounded-md bg-gray-50">
                    <h3 className="font-medium text-gray-900 mb-4">Informations du Coach</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Nom</label>
                        <input
                          type="text"
                          value={data.coach_profile?.nom}
                          onChange={e => setData('coach_profile', { ...data.coach_profile!, nom: e.target.value })}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        {errors['coach_profile.nom'] && (
                          <p className="text-red-500 text-sm mt-1">{errors['coach_profile.nom']}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Prénom</label>
                        <input
                          type="text"
                          value={data.coach_profile?.prenom}
                          onChange={e => setData('coach_profile', { ...data.coach_profile!, prenom: e.target.value })}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        {errors['coach_profile.prenom'] && (
                          <p className="text-red-500 text-sm mt-1">{errors['coach_profile.prenom']}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">ONG</label>
                        <select
                          value={data.coach_profile?.ong_id}
                          onChange={e => setData('coach_profile', { ...data.coach_profile!, ong_id: e.target.value })}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        >
                          <option value="">Sélectionner une ONG</option>
                          {ongs.map(ong => (
                            <option key={ong.id} value={ong.id}>{ong.nom}</option>
                          ))}
                        </select>
                        {errors['coach_profile.ong_id'] && (
                          <p className="text-red-500 text-sm mt-1">{errors['coach_profile.ong_id']}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Spécialité</label>
                        <input
                          type="text"
                          value={data.coach_profile?.specialite}
                          onChange={e => setData('coach_profile', { ...data.coach_profile!, specialite: e.target.value })}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                      </div>

                      {/* Affectation de promoteurs */}
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Affecter des promoteurs
                        </label>
                        <div className="bg-white p-3 border rounded-md max-h-60 overflow-y-auto">
                          {promoteurs.length === 0 ? (
                            <p className="text-gray-500">Aucun promoteur disponible.</p>
                          ) : (
                            <div className="space-y-2">
                              {promoteurs.map(promoteur => (
                                <div key={promoteur.id} className="flex items-center">
                                  <input
                                    type="checkbox"
                                    id={`promoteur-${promoteur.id}`}
                                    checked={data.promoteurs?.includes(promoteur.id)}
                                    onChange={e => {
                                      if (e.target.checked) {
                                        setData('promoteurs', [...(data.promoteurs || []), promoteur.id]);
                                      } else {
                                        setData('promoteurs',
                                          (data.promoteurs || []).filter(id => id !== promoteur.id)
                                        );
                                      }
                                    }}
                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                  />
                                  <label htmlFor={`promoteur-${promoteur.id}`} className="ml-2 text-sm text-gray-700">
                                    {promoteur.nom} {promoteur.prenom} - {promoteur.contact}
                                  </label>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Champs spécifiques à l'ONG */}
                {showOngFields && (
                  <div className="border p-4 rounded-md bg-gray-50">
                    <h3 className="font-medium text-gray-900 mb-4">Association à une ONG</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Sélectionner une ONG</label>
                      <select
                        value={data.ong_id}
                        onChange={e => setData('ong_id', e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                      >
                        <option value="">Sélectionner une ONG</option>
                        {ongs.map(ong => (
                          <option key={ong.id} value={ong.id}>{ong.nom}</option>
                        ))}
                      </select>
                      {errors.ong_id && <p className="text-red-500 text-sm mt-1">{errors.ong_id}</p>}
                    </div>
                  </div>
                )}

                {/* Champs spécifiques à l'Institution Financière */}
                {showInstitutionFields && (
                  <div className="border p-4 rounded-md bg-gray-50">
                    <h3 className="font-medium text-gray-900 mb-4">Association à une Institution Financière</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Sélectionner une Institution</label>
                      <select
                        value={data.institution_id}
                        onChange={e => setData('institution_id', e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                      >
                        <option value="">Sélectionner une Institution</option>
                        {institutions.map(institution => (
                          <option key={institution.id} value={institution.id}>{institution.nom}</option>
                        ))}
                      </select>
                      {errors.institution_id && <p className="text-red-500 text-sm mt-1">{errors.institution_id}</p>}
                    </div>
                  </div>
                )}

                {/* Champs spécifiques au Promoteur */}
                {showPromoteurFields && (
                  <div className="border p-4 rounded-md bg-gray-50">
                    <h3 className="font-medium text-gray-900 mb-4">Association à un Promoteur</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Sélectionner un Promoteur</label>
                      <select
                        value={data.beneficiaire_id}
                        onChange={e => setData('beneficiaire_id', e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                      >
                        <option value="">Sélectionner un Promoteur</option>
                        {promoteurs.map(promoteur => (
                          <option key={promoteur.id} value={promoteur.id}>
                            {promoteur.nom} {promoteur.prenom} - {promoteur.contact}
                          </option>
                        ))}
                      </select>
                      {errors.beneficiaire_id && <p className="text-red-500 text-sm mt-1">{errors.beneficiaire_id}</p>}
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3">
                  <Link
                    href={route('users.index')}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Annuler
                  </Link>
                  <button
                    type="submit"
                    disabled={processing}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {processing ? 'Création en cours...' : 'Créer l\'utilisateur'}
                  </button>
                </div>
              </form>
            </Panel.Content>
          </Panel>
        </div>
      </div>
    </AppLayout>
  );
}
