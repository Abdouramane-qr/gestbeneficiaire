import React from "react";

interface Beneficiaire {
  id: number;
  nom: string;
  prenom: string;
  contact?: string;
  email?: string;
}

interface ONG {
  id: number;
  nom: string;
  sigle?: string;
  adresse?: string;
}

interface InstitutionFinanciere {
  id: number;
  nom: string;
  adresse?: string;
  description?: string;
  ville?: string;
}

interface Entreprise {
  id: number;
  nom_entreprise: string;
  secteur_activite: string;
  adresse?: string;
  contact?: string;
  email?: string;
  date_creation: string;
  statut_juridique: string;
  description?: string;
  ville: string;
  pays: string;
  domaine_activite?: string;
  niveau_mise_en_oeuvre?: string;
  beneficiaire?: Beneficiaire | null;
  ong?: ONG | null;
  institutionFinanciere?: InstitutionFinanciere | null;
}

const ShowEntreprise: React.FC<{ entreprise: Entreprise }> = ({ entreprise }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Non spécifié';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fr-FR').format(date);
    } catch (e) {
      console.error("Erreur de formatage de date:", e);
      return dateString;
    }
  };

  console.log('Entreprise data:', entreprise);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {/* Informations principales */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">Informations générales</h2>
            <div className="space-y-2">
              <p className="flex items-start">
                <span className="font-medium w-40 inline-block text-gray-700 dark:text-gray-300">Nom :</span>
                <span className="text-gray-900 dark:text-gray-100">{entreprise.nom_entreprise}</span>
              </p>
              <p className="flex items-start">
                <span className="font-medium w-40 inline-block text-gray-700 dark:text-gray-300">Secteur d'activité :</span>
                <span className="text-gray-900 dark:text-gray-100">{entreprise.secteur_activite}</span>
              </p>
              <p className="flex items-start">
                <span className="font-medium w-40 inline-block text-gray-700 dark:text-gray-300">Date de création :</span>
                <span className="text-gray-900 dark:text-gray-100">{formatDate(entreprise.date_creation)}</span>
              </p>
              <p className="flex items-start">
                <span className="font-medium w-40 inline-block text-gray-700 dark:text-gray-300">Statut juridique :</span>
                <span className="text-gray-900 dark:text-gray-100">{entreprise.statut_juridique}</span>
              </p>
              {entreprise.niveau_mise_en_oeuvre && (
                <p className="flex items-start">
                  <span className="font-medium w-40 inline-block text-gray-700 dark:text-gray-300">Niveau de mise en œuvre :</span>
                  <span className="text-gray-900 dark:text-gray-100">{entreprise.niveau_mise_en_oeuvre}</span>
                </p>
              )}
            </div>
          </div>

          {/* Promoteur (Bénéficiaire) */}
          {entreprise.beneficiaire && (
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">Promoteur</h2>
              <div className="space-y-2">
                <p className="flex items-start">
                  <span className="font-medium w-40 inline-block text-gray-700 dark:text-gray-300">Nom complet :</span>
                  <span className="text-gray-900 dark:text-gray-100">
                    {entreprise.beneficiaire.nom} {entreprise.beneficiaire.prenom}
                  </span>
                </p>
                {entreprise.beneficiaire.contact && (
                  <p className="flex items-start">
                    <span className="font-medium w-40 inline-block text-gray-700 dark:text-gray-300">Contact :</span>
                    <span className="text-gray-900 dark:text-gray-100">{entreprise.beneficiaire.contact}</span>
                  </p>
                )}
                {entreprise.beneficiaire.email && (
                  <p className="flex items-start">
                    <span className="font-medium w-40 inline-block text-gray-700 dark:text-gray-300">Email :</span>
                    <span className="text-gray-900 dark:text-gray-100">{entreprise.beneficiaire.email}</span>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Coordonnées */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">Coordonnées</h2>
            <div className="space-y-2">
              {entreprise.adresse && (
                <p className="flex items-start">
                  <span className="font-medium w-40 inline-block text-gray-700 dark:text-gray-300">Adresse :</span>
                  <span className="text-gray-900 dark:text-gray-100">{entreprise.adresse}</span>
                </p>
              )}
              <p className="flex items-start">
                <span className="font-medium w-40 inline-block text-gray-700 dark:text-gray-300">Ville :</span>
                <span className="text-gray-900 dark:text-gray-100">{entreprise.ville}</span>
              </p>
              <p className="flex items-start">
                <span className="font-medium w-40 inline-block text-gray-700 dark:text-gray-300">Pays :</span>
                <span className="text-gray-900 dark:text-gray-100">{entreprise.pays}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Description */}
          {entreprise.description && (
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">Description</h2>
              <div className="space-y-2">
                <p className="text-gray-900 dark:text-gray-100 whitespace-pre-line">{entreprise.description}</p>
              </div>
            </div>
          )}

          {/* Domaine d'activité */}
          {entreprise.domaine_activite && (
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">Domaine d'activité</h2>
              <div className="space-y-2">
                <p className="text-gray-900 dark:text-gray-100 whitespace-pre-line">{entreprise.domaine_activite}</p>
              </div>
            </div>
          )}

          {/* Partenaires (ONG et Institution Financière) */}
          {(entreprise.ong || entreprise.institutionFinanciere) && (
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">Partenaires</h2>
              <div className="space-y-4">
                {/* ONG d'appui */}
                {entreprise.ong && (
                  <div className="space-y-2">
                    <h3 className="text-md font-medium text-gray-700 dark:text-gray-200">ONG d'appui</h3>
                    <p className="flex items-start">
                      <span className="font-medium w-40 inline-block text-gray-700 dark:text-gray-300">Nom :</span>
                      <span className="text-gray-900 dark:text-gray-100">
                        {entreprise.ong.nom} {entreprise.ong.sigle && `(${entreprise.ong.sigle})`}
                      </span>
                    </p>
                    {entreprise.ong.adresse && (
                      <p className="flex items-start">
                        <span className="font-medium w-40 inline-block text-gray-700 dark:text-gray-300">Adresse :</span>
                        <span className="text-gray-900 dark:text-gray-100">{entreprise.ong.adresse}</span>
                      </p>
                    )}
                  </div>
                )}

                {/* Institution financière */}
                {entreprise.institutionFinanciere && (
                  <div className="space-y-2 mt-4">
                    <h3 className="text-md font-medium text-gray-700 dark:text-gray-200">Institution financière</h3>
                    <p className="flex items-start">
                      <span className="font-medium w-40 inline-block text-gray-700 dark:text-gray-300">Nom :</span>
                      <span className="text-gray-900 dark:text-gray-100">
                        {entreprise.institutionFinanciere.nom}
                      </span>
                    </p>
                    {entreprise.institutionFinanciere.adresse && (
                      <p className="flex items-start">
                        <span className="font-medium w-40 inline-block text-gray-700 dark:text-gray-300">Adresse :</span>
                        <span className="text-gray-900 dark:text-gray-100">{entreprise.institutionFinanciere.adresse}</span>
                      </p>
                    )}
                    {entreprise.institutionFinanciere.ville && (
                      <p className="flex items-start">
                        <span className="font-medium w-40 inline-block text-gray-700 dark:text-gray-300">Ville :</span>
                        <span className="text-gray-900 dark:text-gray-100">{entreprise.institutionFinanciere.ville}</span>
                      </p>
                    )}
                    {entreprise.institutionFinanciere.description && (
                      <div className="mt-2">
                        <span className="font-medium block text-gray-700 dark:text-gray-300 mb-1">Description :</span>
                        <p className="text-gray-900 dark:text-gray-100 whitespace-pre-line pl-2">
                          {entreprise.institutionFinanciere.description}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowEntreprise;
