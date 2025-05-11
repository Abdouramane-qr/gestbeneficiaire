import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageProps } from "@/types";
import { toast } from "sonner";
import AppLayout from "@/layouts/app-layout";
import FormulaireExceptionnelModal from "@/components/OccasionnelModal";

interface Beneficiaire {
  id: number;
  nom: string;
  prenom: string;
}

interface Entreprise {
  id: number;
  nom_entreprise: string;
  secteur_activite: string;
  adresse: string;
  contact: string;
  email: string;
  date_creation: string;
  statut_juridique: string;
  description: string;
  ville: string;
  pays: string;
  beneficiaires_id: number;
  beneficiaire?: {
    id: number;
    nom: string;
    prenom: string;
  };
}

interface ShowPageProps extends PageProps {
  entreprise: Entreprise;
  beneficiaires: Beneficiaire[];
}

const Show: React.FC<ShowPageProps> = ({  entreprise, beneficiaires }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  const openEditModal = () => setIsEditModalOpen(true);
  const closeEditModal = () => setIsEditModalOpen(false);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Non spécifié';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fr-FR').format(date);
    } catch (e) {
      console.log(e);
      return dateString;
    }
  };

  const handleDelete = () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette entreprise ?")) {
      // Inertia DELETE request
      // Ajuster selon votre implémentation
      // Inertia.delete(route('entreprises.destroy', entreprise.id));
      toast.success("Entreprise supprimée avec succès");
    }
  };

  return (
    <AppLayout
      title="Détails des collectes Exceptionel"
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Détails de l'entreprise
          </h2>
          <div className="flex space-x-2">
            <Button onClick={openEditModal} className="bg-blue-600 hover:bg-blue-700 text-white">
              Modifier
            </Button>
            <Button onClick={handleDelete} variant="destructive">
              Supprimer
            </Button>
            <Link href={route('entreprises.index')}>
              <Button variant="outline">Retour à la liste</Button>
            </Link>
          </div>
        </div>
      }
    >
      <Head title={`Entreprise - ${entreprise.nom_entreprise}`} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Card className="overflow-hidden shadow-sm">
            <div className="p-6">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {entreprise.nom_entreprise}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {entreprise.secteur_activite} • Créée le {formatDate(entreprise.date_creation)}
                </p>
              </div>

              <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-6 grid w-full grid-cols-3 md:grid-cols-4">
                  <TabsTrigger value="general">Informations générales</TabsTrigger>
                  <TabsTrigger value="contacts">Coordonnées</TabsTrigger>
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="beneficiaire">Bénéficiaire</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                  <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">
                    Informations générales
                  </h2>
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
                  </div>
                </TabsContent>

                <TabsContent value="contacts" className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                  <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">Coordonnées</h2>
                  <div className="space-y-2">
                    <p className="flex items-start">
                      <span className="font-medium w-40 inline-block text-gray-700 dark:text-gray-300">Adresse :</span>
                      <span className="text-gray-900 dark:text-gray-100">{entreprise.adresse}</span>
                    </p>
                    <p className="flex items-start">
                      <span className="font-medium w-40 inline-block text-gray-700 dark:text-gray-300">Ville :</span>
                      <span className="text-gray-900 dark:text-gray-100">{entreprise.ville}</span>
                    </p>
                    <p className="flex items-start">
                      <span className="font-medium w-40 inline-block text-gray-700 dark:text-gray-300">Pays :</span>
                      <span className="text-gray-900 dark:text-gray-100">{entreprise.pays}</span>
                    </p>
                    <p className="flex items-start">
                      <span className="font-medium w-40 inline-block text-gray-700 dark:text-gray-300">Contact :</span>
                      <span className="text-gray-900 dark:text-gray-100">{entreprise.contact || 'Non spécifié'}</span>
                    </p>
                    <p className="flex items-start">
                      <span className="font-medium w-40 inline-block text-gray-700 dark:text-gray-300">Email :</span>
                      <span className="text-gray-900 dark:text-gray-100">{entreprise.email || 'Non spécifié'}</span>
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="description" className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                  <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">Description</h2>
                  <div className="space-y-2">
                    <p className="text-gray-900 dark:text-gray-100">
                      {entreprise.description || 'Aucune description disponible.'}
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="beneficiaire" className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                  <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">Bénéficiaire associé</h2>
                  <div className="space-y-2">
                    {entreprise.beneficiaire ? (
                      <>
                        <p className="flex items-start">
                          <span className="font-medium w-40 inline-block text-gray-700 dark:text-gray-300">Nom :</span>
                          <span className="text-gray-900 dark:text-gray-100">{entreprise.beneficiaire.nom}</span>
                        </p>
                        <p className="flex items-start">
                          <span className="font-medium w-40 inline-block text-gray-700 dark:text-gray-300">Prénom :</span>
                          <span className="text-gray-900 dark:text-gray-100">{entreprise.beneficiaire.prenom}</span>
                        </p>
                        <div className="mt-4">
                          <Link href={route('beneficiaires.show', entreprise.beneficiaire.id)}>
                            <Button variant="outline" size="sm">
                              Voir le profil du bénéficiaire
                            </Button>
                          </Link>
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">Aucun bénéficiaire associé à cette entreprise.</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-6">
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">Données de collecte</h2>
                {/* Ici, vous pourriez ajouter un résumé des données de collecte de l'entreprise */}
                <p className="text-gray-500 dark:text-gray-400">
                  Pour accéder aux données de collecte de cette entreprise, veuillez consulter la section "Rapports".
                </p>
                <div className="mt-4">
                  <Link href={route('rapports.index', { entreprise_id: entreprise.id })}>
                    <Button variant="outline">
                      Voir les rapports
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>


        <FormulaireExceptionnelModal
          isOpen={isEditModalOpen}
          closeModal={closeEditModal}
          beneficiaires={beneficiaires}
          //exercices={exercices}
        />
    </AppLayout>
  );
};

export default Show;
