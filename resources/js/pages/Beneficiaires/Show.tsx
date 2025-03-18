import React from "react";

interface Entreprise {
    id: number;
    nom_entreprise: string;
    secteur_activite: string;
}

interface ONG {
    id: number;
    nom: string;
}

interface InstitutionFinanciere {
    id: number;
    nom: string;
}

interface Beneficiaire {
    id: number;
    region: string;
    village: string;
    type_beneficiaire: string;
    nom: string;
    prenom: string;
    date_de_naissance: string;
    genre: string;
    handicap: boolean;
    contact: string;
    email: string;
    niveau_instruction: string;
    activite: string;
    domaine_activite: string;
    niveau_mise_en_oeuvre: string;
    ong_id: number | null;
    institution_financiere_id: number | null;
    date_inscription: string;
    statut_actuel: string;
    ong?: ONG | null;
    institutionFinanciere?: InstitutionFinanciere | null;
    entreprises?: Entreprise[];
}

const Show: React.FC<{ beneficiaire: Beneficiaire }> = ({ beneficiaire }) => {
    const formatDate = (dateString: string) => {
        if (!dateString) return 'Non spécifié';
        try {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat('fr-FR').format(date);
        } catch (e) {
            console.log(e)
            return dateString;
        }
    };

    return (
        <div className="bg-white rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-md">
                        <h2 className="text-lg font-semibold text-gray-700 mb-3">Informations personnelles</h2>
                        <div className="space-y-2">
                            <p className="flex items-start">
                                <span className="font-medium w-40 inline-block">Nom complet :</span>
                                <span>{beneficiaire.nom} {beneficiaire.prenom}</span>
                            </p>
                            <p className="flex items-start">
                                <span className="font-medium w-40 inline-block">Genre :</span>
                                <span>{beneficiaire.genre}</span>
                            </p>
                            <p className="flex items-start">
                                <span className="font-medium w-40 inline-block">Date de naissance :</span>
                                <span>{formatDate(beneficiaire.date_de_naissance)}</span>
                            </p>
                            <p className="flex items-start">
                                <span className="font-medium w-40 inline-block">Situation de handicap :</span>
                                <span>{beneficiaire.handicap ? 'Oui' : 'Non'}</span>
                            </p>
                            <p className="flex items-start">
                                <span className="font-medium w-40 inline-block">Email :</span>
                                <span>{beneficiaire.email || 'Non spécifié'}</span>
                            </p>
                            <p className="flex items-start">
                                <span className="font-medium w-40 inline-block">Contact :</span>
                                <span>{beneficiaire.contact}</span>
                            </p>
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-md">
                        <h2 className="text-lg font-semibold text-gray-700 mb-3">Localisation</h2>
                        <div className="space-y-2">
                            <p className="flex items-start">
                                <span className="font-medium w-40 inline-block">Région :</span>
                                <span>{beneficiaire.region}</span>
                            </p>
                            <p className="flex items-start">
                                <span className="font-medium w-40 inline-block">Village :</span>
                                <span>{beneficiaire.village || 'Non spécifié'}</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-md">
                        <h2 className="text-lg font-semibold text-gray-700 mb-3">Activité professionnelle</h2>
                        <div className="space-y-2">
                            <p className="flex items-start">
                                <span className="font-medium w-40 inline-block">Type de bénéficiaire :</span>
                                <span>{beneficiaire.type_beneficiaire}</span>
                            </p>
                            <p className="flex items-start">
                                <span className="font-medium w-40 inline-block">Activité :</span>
                                <span>{beneficiaire.activite}</span>
                            </p>
                            <p className="flex items-start">
                                <span className="font-medium w-40 inline-block">Domaine d'activité :</span>
                                <span>{beneficiaire.domaine_activite}</span>
                            </p>
                            <p className="flex items-start">
                                <span className="font-medium w-40 inline-block">Niveau de mise en œuvre :</span>
                                <span>{beneficiaire.niveau_mise_en_oeuvre}</span>
                            </p>
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-md">
                        <h2 className="text-lg font-semibold text-gray-700 mb-3">Éducation et statut</h2>
                        <div className="space-y-2">
                            <p className="flex items-start">
                                <span className="font-medium w-40 inline-block">Niveau d'instruction :</span>
                                <span>{beneficiaire.niveau_instruction}</span>
                            </p>
                            <p className="flex items-start">
                                <span className="font-medium w-40 inline-block">Date d'inscription :</span>
                                <span>{formatDate(beneficiaire.date_inscription)}</span>
                            </p>
                            <p className="flex items-start">
                                <span className="font-medium w-40 inline-block">Statut actuel :</span>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                    beneficiaire.statut_actuel === 'Actif'
                                        ? 'bg-green-100 text-green-800'
                                        : beneficiaire.statut_actuel === 'En attente'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-red-100 text-red-800'
                                }`}>
                                    {beneficiaire.statut_actuel}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 space-y-4">
                <div className="p-4 bg-gray-50 rounded-md">
                    <h2 className="text-lg font-semibold text-gray-700 mb-3">Affiliations</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="font-medium text-gray-700">ONG :</p>
                            <p className="text-gray-600">{beneficiaire.ong ? beneficiaire.ong.nom : "Aucune"}</p>
                        </div>
                        <div>
                            <p className="font-medium text-gray-700">Institution Financière :</p>
                            <p className="text-gray-600">{beneficiaire.institutionFinanciere ? beneficiaire.institutionFinanciere.nom : "Aucune"}</p>
                        </div>
                    </div>
                </div>

                {beneficiaire.entreprises && beneficiaire.entreprises.length > 0 && (
                    <div className="p-4 bg-gray-50 rounded-md">
                        <h2 className="text-lg font-semibold text-gray-700 mb-3">Entreprises associées</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Secteur d'activité</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {beneficiaire.entreprises.map(entreprise => (
                                        <tr key={entreprise.id}>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{entreprise.nom_entreprise}</td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{entreprise.secteur_activite}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {(!beneficiaire.entreprises || beneficiaire.entreprises.length === 0) && (
                    <div className="p-4 bg-gray-50 rounded-md">
                        <h2 className="text-lg font-semibold text-gray-700 mb-3">Entreprises associées</h2>
                        <p className="text-gray-500">Aucune entreprise associée.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Show;
