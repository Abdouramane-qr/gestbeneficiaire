import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

import { Entreprise, IndicateurCommercial, IndicateurFinancier, IndicateurProduction, IndicateurRH, PageProps, Rapport } from '@/types/index';
import CommerciauxTab from '@/components/Rapports/CommerciauxTab';
import RHTab from '@/components/Rapports/RHTab';
import ProductionTab from '@/components/Rapports/ProductionTab';
import FinanciersTab from '@/components/Rapports/FinanciersTab';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, Send, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';

interface RapportEditProps extends Omit<PageProps, 'errors'> {
  entreprise: Entreprise;
  rapport: Rapport;
  indicateursFinanciers: IndicateurFinancier;
  indicateursCommerciaux: IndicateurCommercial;
  indicateursRH: IndicateurRH;
  indicateursProduction: IndicateurProduction;
  periodesPrecedentes?: Record<string, any>;
  rapportPrecedent?: Rapport;
  permissions: {
    peutModifier: boolean;
    peutValider: boolean;
    peutRejeter: boolean;
    peutSoumettre: boolean;
  };
  errors?: {
    indicateurs_financiers?: Record<string, string>;
    indicateurs_commerciaux?: Record<string, string>;
    indicateurs_rh?: Record<string, string>;
    indicateurs_production?: Record<string, string>;
  };
  initialTab?: string;
}

const RapportEdit: React.FC<RapportEditProps> = ({
  //auth,
  entreprise,
  rapport,
  indicateursFinanciers,
  indicateursCommerciaux,
  indicateursRH,
  indicateursProduction,
  rapportPrecedent,
  permissions,
  errors = {},
  initialTab = 'financiers'
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [progresPourcentage, setProgresPourcentage] = useState<number>(0);
  const { post, processing } = useForm();

  // Couleurs pour le thème de l'application
  const colors = {
    financiers: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    commerciaux: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    rh: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    production: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' }
  };

  // Calcul du progrès de remplissage du formulaire
  useEffect(() => {
    const calculerProgres = () => {
      let totalChamps = 0;
      let champsRemplis = 0;

      // Liste des champs pour chaque section
      const champsFinanciers = [
        'chiffre_affaires', 'resultat_net', 'ebitda', 'cash_flow',
        'dette_nette', 'fonds_propres', 'besoin_fonds_roulement',
        'tresorerie_nette', 'investissements'
      ];
      const champsCommerciaux = [
        'nombre_clients', 'nouveaux_clients', 'taux_retention', 'panier_moyen',
        'delai_paiement_moyen', 'export_pourcentage', 'top_5_clients_pourcentage',
        'backlog', 'carnet_commandes'
      ];
      const champsRH = [
        'effectif_total', 'cadres_pourcentage', 'turnover', 'absenteisme',
        'masse_salariale', 'cout_formation', 'anciennete_moyenne',
        'accidents_travail', 'index_egalite'
      ];
      const champsProduction = [
        'taux_utilisation', 'taux_rebut', 'delai_production_moyen', 'cout_production',
        'stock_matieres_premieres', 'stock_produits_finis', 'rotation_stocks',
        'incidents_qualite', 'certifications'
      ];

      const calculerSousTotal = (champs: string[], indicateurs: IndicateurFinancier | IndicateurCommercial | IndicateurRH | IndicateurProduction) =>
        champs.filter(champ =>
          indicateurs[champ as keyof typeof indicateurs] !== undefined &&
          indicateurs[champ as keyof typeof indicateurs] !== null
        ).length;

      totalChamps += champsFinanciers.length + champsCommerciaux.length +
                     champsRH.length + champsProduction.length;

      champsRemplis += calculerSousTotal(champsFinanciers, indicateursFinanciers) +
                       calculerSousTotal(champsCommerciaux, indicateursCommerciaux) +
                       calculerSousTotal(champsRH, indicateursRH) +
                       calculerSousTotal(champsProduction, indicateursProduction);

      return Math.round((champsRemplis / totalChamps) * 100);
    };

    setProgresPourcentage(calculerProgres());
  }, [indicateursFinanciers, indicateursCommerciaux, indicateursRH, indicateursProduction]);

  // Fonction pour changer le statut du rapport
  const updateStatus = (action: string) => {
    post(route('rapports.update', {
      entreprise: entreprise.id,
      rapport: rapport.id,
      submit_action: action
    }));
  };

  // Fonction pour obtenir la couleur de badge selon le statut
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'brouillon':
        return 'bg-gray-100 text-gray-800';
      case 'soumis':
        return 'bg-blue-100 text-blue-800';
      case 'validé':
        return 'bg-green-100 text-green-800';
      case 'rejeté':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Fonction pour afficher l'aide contextuelle selon l'onglet actif
  const getHelperText = (): string => {
    switch (activeTab) {
      case 'financiers':
        return 'Les champs en gris sont calculés automatiquement à partir des autres valeurs';
      case 'commerciaux':
        return 'Tous les indicateurs commerciaux doivent être renseignés pour les entreprises de plus de 20 salariés';
      case 'rh':
        return 'L\'index d\'égalité est noté sur 100 points';
      case 'production':
        return 'Séparez les certifications par des virgules';
      default:
        return '';
    }
  };

  // Liste des onglets disponibles
  const tabs = [
    { id: 'financiers', label: 'Financiers', icon: '💰' },
    { id: 'commerciaux', label: 'Commerciaux', icon: '🛒' },
    { id: 'rh', label: 'Ressources Humaines', icon: '👥' },
    { id: 'production', label: 'Production', icon: '🏭' }
  ];

  return (
    <AuthenticatedLayout title={`Édition rapport - ${entreprise.nom}`}>
      <Head title={`Édition rapport - ${entreprise.nom}`} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="mb-6 flex justify-between items-center">
            <Link href={route('rapports.edit', entreprise.id)}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux rapports
              </Button>
            </Link>

            <div className="flex items-center space-x-4">
              <Badge className={getStatusColor(rapport.statut ?? '')}>
                {/* {rapport.statut.charAt(0).toUpperCase() + rapport.statut.slice(1)} */}
              </Badge>

              {/* Boutons d'action selon les permissions */}
              {permissions.peutSoumettre && (
                <Button
                  onClick={() => updateStatus('submit')}
                  disabled={processing || progresPourcentage < 50}
                  title={progresPourcentage < 50 ? "Complétez au moins 50% du formulaire avant de soumettre" : ""}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Soumettre
                </Button>
              )}

              {permissions.peutRejeter && (
                <Button
                  variant="outline"
                  className="border-red-200 text-red-700 hover:bg-red-50"
                  onClick={() => updateStatus('reject')}
                  disabled={processing}
                >
                  <X className="mr-2 h-4 w-4" />
                  Rejeter
                </Button>
              )}

              {permissions.peutValider && (
                <Button
                  variant="outline"
                  className="border-green-200 text-green-700 hover:bg-green-50"
                  onClick={() => updateStatus('validate')}
                  disabled={processing}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Valider
                </Button>
              )}
            </div>
          </div>

          {/* Carte d'information du rapport */}
          <Card className="mb-8">
            <CardHeader className={`${colors[activeTab as keyof typeof colors].bg} border-b ${colors[activeTab as keyof typeof colors].border}`}>
              <CardTitle className={colors[activeTab as keyof typeof colors].text}>
                Rapport {rapport.periode} {rapport.annee} - {entreprise.nom}
              </CardTitle>
              <CardDescription>
                Créé le {new Date(rapport.created_at || '').toLocaleDateString()}
                {rapport.date_soumission && ` | Soumis le ${new Date(rapport.date_soumission).toLocaleDateString()}`}
                {rapport.valide_par && ` | Validé par ${rapport.valide_par}`}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div>
                  <span className="font-semibold">Nom de l'entreprise:</span> {entreprise.nom}
                </div>
                <div>
                  <span className="font-semibold">Forme juridique:</span> {entreprise.forme_juridique}
                </div>
                <div>
                  <span className="font-semibold">Secteur:</span> {entreprise.secteur_activite}
                </div>
              </div>

              {rapport.statut === 'rejeté' && (
                <Alert className="mb-4 bg-red-50 border-red-200">
                  <AlertTitle>Rapport rejeté</AlertTitle>
                  <AlertDescription>
                    Ce rapport a été rejeté. Veuillez vérifier et corriger les informations avant de le soumettre à nouveau.
                  </AlertDescription>
                </Alert>
              )}

              <div className="mt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Progression du formulaire</span>
                  <span className="text-sm font-medium">{progresPourcentage}%</span>
                </div>
                <Progress value={progresPourcentage} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Système d'onglets */}
          <Card>
            <CardHeader>
              <CardTitle>Indicateurs</CardTitle>
              <CardDescription>
                Remplissez les différentes catégories d'indicateurs en utilisant les onglets ci-dessous.
                Les champs calculés automatiquement sont mis à jour en temps réel.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                value={activeTab}
                onValueChange={(tab) => {
                  // Mise à jour de l'URL sans rechargement
                  window.history.replaceState(
                    null,
                    '',
                    route('rapports.edit', {
                      entreprise: entreprise.id,
                      rapport: rapport.id,
                      tab: tab
                    })
                  );
                  setActiveTab(tab);
                }}
                className="w-full"
              >
                <TabsList className="grid grid-cols-4 mb-8">
                  {tabs.map(tab => (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="relative"
                    >
                      <span className="mr-2">{tab.icon}</span>
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value="financiers">
                  <FinanciersTab
                    indicateurs={indicateursFinanciers}
                    rapport={rapport}
                    entreprise={entreprise}
                    rapportPrecedent={rapportPrecedent}
                    errors={errors.indicateurs_financiers || {}}
                    readOnly={!permissions.peutModifier}
                  />
                </TabsContent>

                <TabsContent value="commerciaux">
                  <CommerciauxTab
                    indicateurs={indicateursCommerciaux}
                    rapport={rapport}
                    entreprise={entreprise}
                    rapportPrecedent={rapportPrecedent}
                    errors={errors.indicateurs_commerciaux || {}}
                    readOnly={!permissions.peutModifier}
                  />
                </TabsContent>

                <TabsContent value="rh">
                  <RHTab
                    indicateurs={indicateursRH}
                    rapport={rapport}
                    entreprise={entreprise}
                    rapportPrecedent={rapportPrecedent}
                    errors={errors.indicateurs_rh || {}}
                    readOnly={!permissions.peutModifier}
                  />
                </TabsContent>

                <TabsContent value="production">
                  <ProductionTab
                    indicateurs={indicateursProduction}
                    rapport={rapport}
                    entreprise={entreprise}
                    rapportPrecedent={rapportPrecedent}
                    errors={errors.indicateurs_production || {}}
                    readOnly={!permissions.peutModifier}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-4">
              <div className="text-sm text-gray-500">
                {getHelperText()}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const tabIndex = tabs.findIndex(t => t.id === activeTab);
                    if (tabIndex > 0) {
                      setActiveTab(tabs[tabIndex - 1].id);
                    }
                  }}
                  disabled={activeTab === tabs[0].id}
                >
                  Précédent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const tabIndex = tabs.findIndex(t => t.id === activeTab);
                    if (tabIndex < tabs.length - 1) {
                      setActiveTab(tabs[tabIndex + 1].id);
                    }
                  }}
                  disabled={activeTab === tabs[tabs.length - 1].id}
                >
                  Suivant
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default RapportEdit;
