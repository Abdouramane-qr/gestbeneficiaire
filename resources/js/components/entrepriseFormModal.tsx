
import { Dialog, Transition } from '@headlessui/react';
import {  useForm } from '@inertiajs/react';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

// Définition des types
interface Beneficiaire {
    id: number;
    nom: string;
    prenom?: string;
    type_beneficiaire: string;
    nom_cooperative?: string;
}

interface ONG {
    id: number;
    nom: string;
    sigle?: string;
}

interface InstitutionFinanciere {
    id: number;
    nom: string;
}

interface EntrepriseFormModalProps {
    isOpen: boolean;
    closeModal: () => void;
    onSuccess: () => void; // Callback pour mettre à jour la liste sans rafraîchir la page
    entreprise?: {
        id?: number;
        beneficiaires_id: string | number;
        nom_entreprise: string;
        secteur_activite: string;
        date_creation: string;
        statut_juridique: string;
        adresse?: string;
        ville: string;
        pays: string;
        description?: string;
        domaine_activite?: string;
        niveau_mise_en_oeuvre?: string;
        ong_id?: string | number;
        institution_financiere_id?: string | number;
    } | null;
    beneficiaires: Beneficiaire[];
    ongs: ONG[];
    institutionsFinancieres: InstitutionFinanciere[];
}

// Fonction pour formater la date au format `yyyy-MM-dd`
const formatDateForInput = (dateString: string | undefined) => {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    } catch (e) {
        console.error('Erreur lors du formatage de la date:', e);
        return '';
    }
};

const EntrepriseFormModal = ({
    isOpen,
    closeModal,
    onSuccess,
    entreprise,
    beneficiaires,
    ongs,
    institutionsFinancieres,
}: EntrepriseFormModalProps) => {
    const inputRef = useRef<HTMLSelectElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    // État pour stocker le type de bénéficiaire sélectionné
    const [selectedBeneficiaireType, setSelectedBeneficiaireType] = useState<string>('');
    // État pour stocker les détails du bénéficiaire sélectionné
    const [selectedBeneficiaire, setSelectedBeneficiaire] = useState<Beneficiaire | null>(null);

    // Initialisation du formulaire avec useForm d'Inertia
    const { data, setData, post, put, errors, processing, reset } = useForm({
        beneficiaires_id: '',
        nom_entreprise: '',
        secteur_activite: '',
        date_creation: '',
        statut_juridique: '',
        adresse: '',
        ville: '',
        pays: '',
        description: '',
        domaine_activite: '',
        niveau_mise_en_oeuvre: '',
        ong_id: '',
        institution_financiere_id: '',
    });

    // Effet pour pré-remplir le formulaire si une entreprise existe
    useEffect(() => {
        if (entreprise) {
            setData({
                beneficiaires_id: entreprise.beneficiaires_id || '',
                nom_entreprise: entreprise.nom_entreprise || '',
                secteur_activite: entreprise.secteur_activite || '',
                date_creation: formatDateForInput(entreprise.date_creation) || '',
                statut_juridique: entreprise.statut_juridique || '',
                adresse: entreprise.adresse || '',
                ville: entreprise.ville || '',
                pays: entreprise.pays || '',
                description: entreprise.description || '',
                domaine_activite: entreprise.domaine_activite || '',
                niveau_mise_en_oeuvre: entreprise.niveau_mise_en_oeuvre || '',
                ong_id: entreprise.ong_id || '',
                institution_financiere_id: entreprise.institution_financiere_id || '',
            });

            // Récupérer le type du bénéficiaire associé à l'entreprise
            if (entreprise.beneficiaires_id) {
                const beneficiaireId = Number(entreprise.beneficiaires_id);
                const beneficiaire = beneficiaires.find((b) => b.id === beneficiaireId);
                if (beneficiaire) {
                    setSelectedBeneficiaireType(beneficiaire.type_beneficiaire);
                    setSelectedBeneficiaire(beneficiaire);
                }
            }
        } else {
            reset();
            setSelectedBeneficiaireType('');
            setSelectedBeneficiaire(null);
        }

        // Focus sur le premier champ lorsque le modal s'ouvre
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [entreprise, isOpen, reset, setData, beneficiaires]);

   // Gestion du changement de bénéficiaire
const handleBeneficiaireChange = (beneficiaireId: string) => {
    setData('beneficiaires_id', beneficiaireId);

    if (beneficiaireId) {
      const beneficiaire = beneficiaires.find(b => b.id === Number(beneficiaireId));
      if (beneficiaire) {
        setSelectedBeneficiaireType(beneficiaire.type_beneficiaire);
        setSelectedBeneficiaire(beneficiaire);

        // Si c'est une coopérative, définir automatiquement le nom de l'entreprise
        if (beneficiaire.type_beneficiaire === 'Coopérative') {
          setData('nom_entreprise', beneficiaire.nom_cooperative || beneficiaire.nom);
        }
      } else {
        setSelectedBeneficiaireType('');
        setSelectedBeneficiaire(null);
      }
    } else {
      setSelectedBeneficiaireType('');
      setSelectedBeneficiaire(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Créer une copie des données
    const formData = { ...data };

    // Pour les coopératives, utiliser le nom de la coopérative comme nom d'entreprise
    if (selectedBeneficiaireType === 'Coopérative' && selectedBeneficiaire) {
        formData.nom_entreprise = selectedBeneficiaire.nom_cooperative || selectedBeneficiaire.nom;
        // S'assurer que cette valeur est également mise à jour dans le state local
        setData('nom_entreprise', selectedBeneficiaire.nom_cooperative || selectedBeneficiaire.nom);
    }

    const successMessage = entreprise?.id ? 'Entreprise mise à jour avec succès.' : 'Entreprise ajoutée avec succès.';
    const errorMessage = entreprise?.id ? "Échec de la mise à jour de l'entreprise." : "Échec d'ajout de l'entreprise.";

    if (entreprise?.id) {
        // Mettre à jour une entreprise existante
        put(route('entreprises.update', entreprise.id), {
                    ...formData,
                    onSuccess: () => {
                        toast.success(successMessage);
                        closeModal();
                        reset();
                        onSuccess(); // Notifier le composant parent
                    },
                    onError: () => {
                        toast.error(errorMessage);
                    },
                });
    } else {
        // Créer une nouvelle entreprise
        post(route('entreprises.store'), {
            ...formData,
            onSuccess: () => {
                toast.success(successMessage);
                closeModal();
                reset();
                onSuccess(); // Notifier le composant parent
            },
            onError: () => {
                toast.error(errorMessage);
            },
        });
    }
};

    // Filtrer les options de bénéficiaires par type (pour un affichage groupé éventuel)
    const individuels = beneficiaires.filter((b) => b.type_beneficiaire === 'Individuel');
    const cooperatives = beneficiaires.filter((b) => b.type_beneficiaire === 'Coopérative');
    const autres = beneficiaires.filter((b) => b.type_beneficiaire === 'Autre');

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={closeModal}>
                <div className="min-h-screen px-4 text-center">
                    {/* Overlay de fond sombre */}
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Panel className="bg-opacity-30 fixed inset-0 bg-black" />
                    </Transition.Child>

                    <span className="inline-block h-screen align-middle" aria-hidden="true">
                        &#8203;
                    </span>

                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="relative inline-block max-h-[90vh] w-full max-w-4xl transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all">
                            {/* En-tête avec titre et bouton de fermeture */}
                            <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white p-4">
                                <Dialog.Title className="text-lg font-medium text-gray-900">
                                    {entreprise?.id ? 'Modifier une entreprise' : 'Ajouter une entreprise'}
                                </Dialog.Title>
                                <button type="button" onClick={closeModal} className="text-gray-400 hover:text-gray-500 focus:outline-none">
                                    <span className="sr-only">Fermer</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Corps du formulaire avec défilement */}
                            <div className="max-h-[calc(90vh-130px)] overflow-y-auto p-4">
                                <form
                                    ref={formRef}
                                    id="entreprise-form"
                                    onSubmit={handleSubmit}
                                    className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3"
                                >
                                    {/* Section: Information principale */}
                                    <div className="col-span-full mb-2 border-b pb-2">
                                        <h3 className="text-md font-medium text-gray-800">Informations principales</h3>
                                    </div>

                                    {/* Promoteur (Bénéficiaire) associé */}
                                    <div className="col-span-full mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label htmlFor="beneficiaires_id" className="block text-sm font-medium text-gray-700">
                                                Promoteur associé <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                id="beneficiaires_id"
                                                ref={inputRef}
                                                value={data.beneficiaires_id}
                                                onChange={(e) => handleBeneficiaireChange(e.target.value)}
                                                className="mt-1 w-full rounded-md border p-2 transition-colors focus:border-blue-500 focus:ring-blue-500"
                                                required
                                            >
                                                <option value="">-- Sélectionnez un promoteur --</option>

                                                {/* Grouper par type de bénéficiaire pour une meilleure organisation */}
                                                {individuels.length > 0 && (
                                                    <optgroup label="Individuels">
                                                        {individuels.map((beneficiaire) => (
                                                            <option key={`ind-${beneficiaire.id}`} value={beneficiaire.id}>
                                                                {beneficiaire.nom} {beneficiaire.prenom}
                                                            </option>
                                                        ))}
                                                    </optgroup>
                                                )}

                                                {cooperatives.length > 0 && (
                                                    <optgroup label="Coopératives">
                                                        {cooperatives.map((beneficiaire) => (
                                                            <option key={`coop-${beneficiaire.id}`} value={beneficiaire.id}>
                                                                {beneficiaire.nom_cooperative || beneficiaire.nom}
                                                            </option>
                                                        ))}
                                                    </optgroup>
                                                )}

                                                {autres.length > 0 && (
                                                    <optgroup label="Autres">
                                                        {autres.map((beneficiaire) => (
                                                            <option key={`other-${beneficiaire.id}`} value={beneficiaire.id}>
                                                                {beneficiaire.nom}
                                                            </option>
                                                        ))}
                                                    </optgroup>
                                                )}
                                            </select>
                                            {errors.beneficiaires_id && <span className="text-sm text-red-500">{errors.beneficiaires_id}</span>}
                                        </div>

                                        {/* Affichage du promoteur sélectionné en lecture seule */}
                                        {selectedBeneficiaire && (
                                            <div>
                                                <label htmlFor="beneficiaire_info" className="block text-sm font-medium text-gray-700">
                                                    {selectedBeneficiaireType === 'Individuel'
                                                        ? 'Promoteur individuel'
                                                        : selectedBeneficiaireType === 'Coopérative'
                                                          ? 'Coopérative'
                                                          : 'Organisation'}
                                                </label>
                                                <input
                                                    type="text"
                                                    id="beneficiaire_info"
                                                    value={
                                                        selectedBeneficiaireType === 'Individuel'
                                                            ? `${selectedBeneficiaire.nom} ${selectedBeneficiaire.prenom || ''}`
                                                            : selectedBeneficiaireType === 'Coopérative'
                                                              ? selectedBeneficiaire.nom_cooperative || selectedBeneficiaire.nom
                                                              : selectedBeneficiaire.nom
                                                    }
                                                    readOnly
                                                    className="mt-1 w-full rounded-md border bg-gray-50 p-2 text-gray-700 focus:outline-none"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Nom de l'entreprise - affiché uniquement si ce n'est pas une coopérative */}
                                    {selectedBeneficiaireType !== 'Coopérative' && (
                                        <div>
                                            <label htmlFor="nom_entreprise" className="block text-sm font-medium text-gray-700">
                                                Nom de l'entreprise <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="nom_entreprise"
                                                value={data.nom_entreprise}
                                                onChange={(e) => setData('nom_entreprise', e.target.value)}
                                                className="mt-1 w-full rounded-md border p-2 transition-colors focus:border-blue-500 focus:ring-blue-500"
                                                required
                                            />
                                            {errors.nom_entreprise && <span className="text-sm text-red-500">{errors.nom_entreprise}</span>}
                                        </div>
                                    )}

                                    {/* Champ caché pour nom_entreprise si coopérative */}
                                    {selectedBeneficiaireType === 'Coopérative' && (
                                        <input
                                            type="hidden"
                                            id="nom_entreprise_hidden"
                                            name="nom_entreprise"
                                            value={selectedBeneficiaire ? selectedBeneficiaire.nom_cooperative || selectedBeneficiaire.nom : ''}
                                        />
                                    )}

                                    {/* Date de création */}
                                    <div>
                                        <label htmlFor="date_creation" className="block text-sm font-medium text-gray-700">
                                            Date de création <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            id="date_creation"
                                            value={data.date_creation}
                                            onChange={(e) => setData('date_creation', e.target.value)}
                                            className="mt-1 w-full rounded-md border p-2 transition-colors focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                        {errors.date_creation && <span className="text-sm text-red-500">{errors.date_creation}</span>}
                                    </div>

                                    {/* Secteur d'activité */}
                                    <div>
                                        <label htmlFor="secteur_activite" className="block text-sm font-medium text-gray-700">
                                            Secteur d'activité <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="secteur_activite"
                                            value={data.secteur_activite}
                                            onChange={(e) => setData('secteur_activite', e.target.value)}
                                            className="mt-1 w-full rounded-md border p-2 transition-colors focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        >
                                            <option value="">-- Sélectionnez un secteur --</option>
                                            <option value="Agriculture">Agriculture</option>
                                            <option value="Artisanat">Artisanat</option>
                                            <option value="Commerce">Commerce</option>
                                            <option value="Élevage">Élevage</option>
                                            <option value="Environnement">Environnement</option>
                                        </select>
                                        {errors.secteur_activite && <span className="text-sm text-red-500">{errors.secteur_activite}</span>}
                                    </div>

                                    {/* Statut juridique - Adapté selon le type de promoteur */}
                                    <div>
                                        <label htmlFor="statut_juridique" className="block text-sm font-medium text-gray-700">
                                            Statut juridique <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="statut_juridique"
                                            value={data.statut_juridique}
                                            onChange={(e) => setData('statut_juridique', e.target.value)}
                                            className="mt-1 w-full rounded-md border p-2 transition-colors focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        >
                                            <option value="">-- Sélectionnez un statut --</option>
                                            {selectedBeneficiaireType === 'Coopérative' ? (
                                                // Options pour les coopératives
                                                <>
                                                    <option value="SARL">SARL</option>
                                                    <option value="SA">SA</option>
                                                    <option value="SAS">SAS</option>
                                                    <option value="SNC">SNC</option>
                                                </>
                                            ) : (
                                                // Options pour les individuels et autres
                                                <>
                                                    <option value="SARL">SARL</option>
                                                    <option value="SA">SA</option>
                                                    <option value="SAS">SAS</option>
                                                    <option value="SNC">SNC</option>
                                                    <option value="Auto-entrepreneur">Auto-entrepreneur</option>
                                                </>
                                            )}
                                        </select>
                                        {errors.statut_juridique && <span className="text-sm text-red-500">{errors.statut_juridique}</span>}
                                    </div>

                                    {/* Niveau de mise en œuvre */}
                                    <div>
                                        <label htmlFor="niveau_mise_en_oeuvre" className="block text-sm font-medium text-gray-700">
                                            Niveau de mise en œuvre
                                        </label>
                                        <select
                                            id="niveau_mise_en_oeuvre"
                                            value={data.niveau_mise_en_oeuvre}
                                            onChange={(e) => setData('niveau_mise_en_oeuvre', e.target.value)}
                                            className="mt-1 w-full rounded-md border p-2 transition-colors focus:border-blue-500 focus:ring-blue-500"
                                        >
                                            <option value="">-- Sélectionnez un niveau --</option>
                                            <option value="Création">Création</option>
                                            <option value="Renforcement">Renforcement</option>
                                        </select>
                                        {errors.niveau_mise_en_oeuvre && <span className="text-sm text-red-500">{errors.niveau_mise_en_oeuvre}</span>}
                                    </div>

                                    {/* Section: Localisation */}
                                    <div className="col-span-full mt-4 mb-2 border-b pb-2">
                                        <h3 className="text-md font-medium text-gray-800">Localisation</h3>
                                    </div>

                                    {/* Adresse */}
                                    <div>
                                        <label htmlFor="adresse" className="block text-sm font-medium text-gray-700">
                                            Adresse
                                        </label>
                                        <input
                                            type="text"
                                            id="adresse"
                                            value={data.adresse}
                                            onChange={(e) => setData('adresse', e.target.value)}
                                            className="mt-1 w-full rounded-md border p-2 transition-colors focus:border-blue-500 focus:ring-blue-500"
                                        />
                                        {errors.adresse && <span className="text-sm text-red-500">{errors.adresse}</span>}
                                    </div>

                                    {/* Ville */}
                                    <div>
                                        <label htmlFor="ville" className="block text-sm font-medium text-gray-700">
                                            Ville <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="ville"
                                            value={data.ville}
                                            onChange={(e) => setData('ville', e.target.value)}
                                            className="mt-1 w-full rounded-md border p-2 transition-colors focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                        {errors.ville && <span className="text-sm text-red-500">{errors.ville}</span>}
                                    </div>

                                    {/* Pays */}
                                    <div>
                                        <label htmlFor="pays" className="block text-sm font-medium text-gray-700">
                                            Pays <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="pays"
                                            value={data.pays}
                                            onChange={(e) => setData('pays', e.target.value)}
                                            className="mt-1 w-full rounded-md border p-2 transition-colors focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                        {errors.pays && <span className="text-sm text-red-500">{errors.pays}</span>}
                                    </div>

                                    {/* Section: Support et financement */}
                                    <div className="col-span-full mt-4 mb-2 border-b pb-2">
                                        <h3 className="text-md font-medium text-gray-800">Support et financement</h3>
                                    </div>

                                    {/* ONG d'appui */}
                                    <div>
                                        <label htmlFor="ong_id" className="block text-sm font-medium text-gray-700">
                                            ONG d'appui
                                        </label>
                                        <select
                                            id="ong_id"
                                            value={data.ong_id}
                                            onChange={(e) => setData('ong_id', e.target.value)}
                                            className="mt-1 w-full rounded-md border p-2 transition-colors focus:border-blue-500 focus:ring-blue-500"
                                        >
                                            <option value="">-- Sélectionnez une ONG --</option>
                                            {ongs.map((ong) => (
                                                <option key={ong.id} value={ong.id}>
                                                    {ong.nom} {ong.sigle ? `(${ong.sigle})` : ''}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.ong_id && <span className="text-sm text-red-500">{errors.ong_id}</span>}
                                    </div>

                                    {/* Institution financière */}
                                    <div>
                                        <label htmlFor="institution_financiere_id" className="block text-sm font-medium text-gray-700">
                                            Institution financière
                                        </label>
                                        <select
                                            id="institution_financiere_id"
                                            value={data.institution_financiere_id}
                                            onChange={(e) => setData('institution_financiere_id', e.target.value)}
                                            className="mt-1 w-full rounded-md border p-2 transition-colors focus:border-blue-500 focus:ring-blue-500"
                                        >
                                            <option value="">-- Sélectionnez une institution --</option>
                                            {institutionsFinancieres.map((institution) => (
                                                <option key={institution.id} value={institution.id}>
                                                    {institution.nom}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.institution_financiere_id && (
                                            <span className="text-sm text-red-500">{errors.institution_financiere_id}</span>
                                        )}
                                    </div>

                                    {/* Section: Détails */}
                                    <div className="col-span-full mt-4 mb-2 border-b pb-2">
                                        <h3 className="text-md font-medium text-gray-800">Détails</h3>
                                    </div>

                                    {/* Description sur deux colonnes */}
                                    <div className="col-span-full sm:col-span-2 lg:col-span-3">
                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                            Description {selectedBeneficiaireType === 'Coopérative' ? 'du projet' : "de l'entreprise"}
                                        </label>
                                        <textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            className="mt-1 w-full rounded-md border p-2 transition-colors focus:border-blue-500 focus:ring-blue-500"
                                            rows={3}
                                        />
                                        {errors.description && <span className="text-sm text-red-500">{errors.description}</span>}
                                    </div>
                                </form>
                            </div>

                            {/* Pied de page fixe avec boutons */}
                            <div className="sticky bottom-0 flex justify-end space-x-2 border-t bg-white p-4 shadow-md">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    form="entreprise-form"
                                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                                    disabled={processing}
                                >
                                    {processing ? 'Traitement...' : entreprise?.id ? 'Modifier' : 'Ajouter'}
                                </button>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};

export default EntrepriseFormModal;
