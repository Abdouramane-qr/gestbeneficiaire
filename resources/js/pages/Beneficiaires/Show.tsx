

// export default Show;
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
    regions: string;
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
    institution_financiere?: InstitutionFinanciere | null;
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
    console.log(beneficiaire);
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">Informations personnelles</h2>
                        <div className="space-y-2">
                            <p className="flex items-start">
                                <span className="font-medium w-40 inline-block text-gray-700 dark:text-gray-300">Nom complet :</span>
                                <span className="text-gray-900 dark:text-gray-100">{beneficiaire.nom} {beneficiaire.prenom}</span>
                            </p>
                            <p className="flex items-start">
                                <span className="font-medium w-40 inline-block text-gray-700 dark:text-gray-300">Genre :</span>
                                <span className="text-gray-900 dark:text-gray-100">{beneficiaire.genre}</span>
                            </p>
                            <p className="flex items-start">
                                <span className="font-medium w-40 inline-block text-gray-700 dark:text-gray-300">Date de naissance :</span>
                                <span className="text-gray-900 dark:text-gray-100">{formatDate(beneficiaire.date_de_naissance)}</span>
                            </p>
                            <p className="flex items-start">
                                <span className="font-medium w-40 inline-block text-gray-700 dark:text-gray-300">Situation de handicap :</span>
                                <span className="text-gray-900 dark:text-gray-100">{beneficiaire.handicap ? 'Oui' : 'Non'}</span>
                            </p>
                            <p className="flex items-start">
                                <span className="font-medium w-40 inline-block text-gray-700 dark:text-gray-300">Email :</span>
                                <span className="text-gray-900 dark:text-gray-100">{beneficiaire.email || 'Non spécifié'}</span>
                            </p>
                            <p className="flex items-start">
                                <span className="font-medium w-40 inline-block text-gray-700 dark:text-gray-300">Contact :</span>
                                <span className="text-gray-900 dark:text-gray-100">{beneficiaire.contact}</span>
                            </p>
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">Localisation</h2>
                        <div className="space-y-2">
                            <p className="flex items-start">
                                <span className="font-medium w-40 inline-block text-gray-700 dark:text-gray-300">Région :</span>
                                <span className="text-gray-900 dark:text-gray-100">{beneficiaire.regions}</span>
                            </p>
                            <p className="flex items-start">
                                <span className="font-medium w-40 inline-block text-gray-700 dark:text-gray-300">Village :</span>
                                <span className="text-gray-900 dark:text-gray-100">{beneficiaire.village || 'Non spécifié'}</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">Activité professionnelle</h2>
                        <div className="space-y-2">
                            <p className="flex items-start">
                                <span className="font-medium w-40 inline-block text-gray-700 dark:text-gray-300">Type de bénéficiaire :</span>
                                <span className="text-gray-900 dark:text-gray-100">{beneficiaire.type_beneficiaire}</span>
                            </p>
                            <p className="flex items-start">
                                <span className="font-medium w-40 inline-block text-gray-700 dark:text-gray-300">Activité :</span>
                                <span className="text-gray-900 dark:text-gray-100">{beneficiaire.activite}</span>
                            </p>
                            <p className="flex items-start">
                                <span className="font-medium w-40 inline-block text-gray-700 dark:text-gray-300">Domaine d'activité :</span>
                                <span className="text-gray-900 dark:text-gray-100">{beneficiaire.domaine_activite}</span>
                            </p>
                            <p className="flex items-start">
                                <span className="font-medium w-40 inline-block text-gray-700 dark:text-gray-300">Niveau de mise en œuvre :</span>
                                <span className="text-gray-900 dark:text-gray-100">{beneficiaire.niveau_mise_en_oeuvre}</span>
                            </p>
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">Éducation et statut</h2>
                        <div className="space-y-2">
                            <p className="flex items-start">
                                <span className="font-medium w-40 inline-block text-gray-700 dark:text-gray-300">Niveau d'instruction :</span>
                                <span className="text-gray-900 dark:text-gray-100">{beneficiaire.niveau_instruction}</span>
                            </p>
                            <p className="flex items-start">
                                <span className="font-medium w-40 inline-block text-gray-700 dark:text-gray-300">Date d'inscription :</span>
                                <span className="text-gray-900 dark:text-gray-100">{formatDate(beneficiaire.date_inscription)}</span>
                            </p>
                            <p className="flex items-start">
                                <span className="font-medium w-40 inline-block text-gray-700 dark:text-gray-300">Statut actuel :</span>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                    beneficiaire.statut_actuel === 'Actif'
                                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                                        : beneficiaire.statut_actuel === 'En attente'
                                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                                            : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                                }`}>
                                    {beneficiaire.statut_actuel}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">Affiliations</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="font-medium text-gray-700 dark:text-gray-300">ONG :</p>
                            <p className="text-gray-600 dark:text-gray-400">{beneficiaire.ong ? beneficiaire.ong.nom : "Aucune"}</p>
                        </div>
                        <div>
                            <p className="font-medium text-gray-700 dark:text-gray-300">Institution Financière :</p>

                            <p className="text-gray-600 dark:text-gray-400">{beneficiaire.institution_financiere  ? beneficiaire.institution_financiere .nom : "Aucune"}</p>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default Show;
