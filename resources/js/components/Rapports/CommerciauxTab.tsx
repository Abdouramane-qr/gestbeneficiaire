import React, { useEffect, useState } from 'react';
import { Save, TrendingUp, TrendingDown, Minus, HelpCircle } from 'lucide-react';
import { IndicateurCommercial, Rapport, Entreprise } from '@/types/index';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useForm } from '@inertiajs/react';
import { Tooltip } from '../ui/tooltip';
import {  Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface CommerciauxTabProps {
  indicateurs: IndicateurCommercial;
  rapport: Rapport;
  entreprise: Entreprise;
  rapportPrecedent?: Rapport;
  errors: Record<string, string>;
  readOnly?: boolean;
}

const CommerciauxTab: React.FC<CommerciauxTabProps> = ({
  indicateurs,
  rapport,
  entreprise,
  rapportPrecedent,
  errors = {},
  readOnly = false
}) => {
  const { data, setData, post, processing, reset } = useForm<IndicateurCommercial>({
    ...indicateurs,
  });

  const [showComparaison, setShowComparaison] = useState<boolean>(!!rapportPrecedent);

  // Récupérer les indicateurs du rapport précédent pour comparaison
  const indicateursPrecedents = rapportPrecedent?.indicateursCommerciaux;

  // Données client de la période précédente pour le taux de rétention
  const clientsPeriodePrecedente = indicateursPrecedents?.nombre_clients;

  // Effet pour calculer automatiquement le taux de rétention
  useEffect(() => {
    // Si nous avons le nombre de clients de la période précédente et celui actuel,
    // nous pouvons calculer le taux de rétention
    if (data.nombre_clients !== undefined &&
        clientsPeriodePrecedente !== undefined &&
        clientsPeriodePrecedente > 0) {

      // Taux de rétention = (Clients actuels - Nouveaux clients) / Clients période précédente * 100
      if (data.nouveaux_clients !== undefined) {
        const clientsRetenus = data.nombre_clients - data.nouveaux_clients;
        if (clientsRetenus >= 0) {
          const tauxRetention = (clientsRetenus / clientsPeriodePrecedente) * 100;
          setData('taux_retention', Number(tauxRetention.toFixed(2)));
        }
      }
    }
  }, [data.nombre_clients, data.nouveaux_clients, clientsPeriodePrecedente, setData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'nombre_clients' || name === 'nouveaux_clients' || name === 'delai_paiement_moyen') {
      setData(name as keyof IndicateurCommercial, value === '' ? undefined : parseInt(value));
    } else {
      setData(name as keyof IndicateurCommercial, value === '' ? undefined : parseFloat(value));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('rapports.submitCommerciaux', { entreprise: entreprise.id, rapport: rapport.id }));
  };

  // Calculer la variation en pourcentage entre deux valeurs
  const calculerVariation = (valeurActuelle?: number, valeurPrecedente?: number): number | undefined => {
    if (valeurActuelle === undefined || valeurPrecedente === undefined || valeurPrecedente === 0) {
      return undefined;
    }
    return ((valeurActuelle - valeurPrecedente) / Math.abs(valeurPrecedente)) * 100;
  };

  // Fonction pour afficher l'icône de tendance
  const IconeTendance = ({ variation, inverse = false }: { variation?: number, inverse?: boolean }) => {
    if (variation === undefined) return <Minus className="h-4 w-4" />;
    // Pour certains indicateurs, une hausse est négative (ex: délai de paiement)
    const isPositiveTrend = inverse ? variation < 0 : variation > 0;
    if (isPositiveTrend) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (!isPositiveTrend) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4" />;
  };

  // Formatage des nombres pour l'affichage
  const formatNumber = (value?: number, decimals: number = 2): string => {
    if (value === undefined) return '-';
    return Number(value).toLocaleString('fr-FR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };

  // Liste des indicateurs commerciaux avec leurs descriptions, unités et si une hausse est négative
  const indicateursList = [
    {
      id: 'nombre_clients',
      label: 'Nombre de clients',
      description: 'Nombre total de clients actifs sur la période',
      unite: '',
      inverseTrend: false,
      calculated: false
    },
    {
      id: 'nouveaux_clients',
      label: 'Nouveaux clients',
      description: 'Nombre de nouveaux clients acquis sur la période',
      unite: '',
      inverseTrend: false,
      calculated: false
    },
    {
      id: 'taux_retention',
      label: 'Taux de rétention',
      description: 'Pourcentage de clients de la période précédente conservés sur la période actuelle',
      unite: '%',
      inverseTrend: false,
      calculated: !!clientsPeriodePrecedente
    },
    {
      id: 'panier_moyen',
      label: 'Panier moyen',
      description: 'Montant moyen des achats par client',
      unite: '€',
      inverseTrend: false,
      calculated: false
    },
    {
      id: 'delai_paiement_moyen',
      label: 'Délai de paiement moyen',
      description: 'Nombre moyen de jours entre la facturation et le paiement',
      unite: 'jours',
      inverseTrend: true, // Une hausse est négative
      calculated: false
    },
    {
      id: 'export_pourcentage',
      label: 'Export',
      description: 'Pourcentage du chiffre d\'affaires réalisé à l\'export',
      unite: '%',
      inverseTrend: false,
      calculated: false
    },
    {
      id: 'top_5_clients_pourcentage',
      label: 'Top 5 clients',
      description: 'Pourcentage du chiffre d\'affaires réalisé avec les 5 plus grands clients',
      unite: '%',
      inverseTrend: true, // Une hausse est négative (dépendance clients)
      calculated: false
    },
    {
      id: 'backlog',
      label: 'Backlog',
      description: 'Montant des commandes confirmées mais non encore livrées',
      unite: '€',
      inverseTrend: false,
      calculated: false
    },
    {
      id: 'carnet_commandes',
      label: 'Carnet de commandes',
      description: 'Montant total des commandes à livrer (backlog + commandes en négociation)',
      unite: '€',
      inverseTrend: false,
      calculated: false
    }
  ];

  return (
    <div>
      {/* Bouton pour afficher/masquer la comparaison avec la période précédente */}
      {rapportPrecedent && (
        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowComparaison(!showComparaison)}
          >
            {showComparaison ? "Masquer la comparaison" : "Afficher la comparaison"}
          </Button>
        </div>
      )}

      {/* Alerte pour le taux de rétention calculé automatiquement */}
      {clientsPeriodePrecedente && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <AlertDescription className="text-green-700 flex items-center">
            <HelpCircle className="h-4 w-4 mr-2" />
            Le taux de rétention est calculé automatiquement à partir du nombre de clients actuel, du nombre de nouveaux clients et du nombre de clients de la période précédente ({clientsPeriodePrecedente}).
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {indicateursList.map((indicateur) => (
              <div className="space-y-2" key={indicateur.id}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Label htmlFor={indicateur.id} className="flex items-center cursor-help">
                        {indicateur.label} {indicateur.unite && <span className="ml-1 text-gray-500">({indicateur.unite})</span>}
                      </Label>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{indicateur.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <div className="relative">
                  <Input
                    id={indicateur.id}
                    name={indicateur.id}
                    type="number"
                    step={indicateur.unite === '%' || indicateur.unite === '€' ? "0.01" : "1"}
                    value={data[indicateur.id as keyof IndicateurCommercial] || ''}
                    onChange={handleChange}
                    className={indicateur.calculated ? "bg-gray-50 pr-10" : "pr-10"}
                    readOnly={indicateur.calculated || readOnly}
                    disabled={readOnly}
                  />

                  {/* Affichage de la tendance si comparaison activée */}
                  {showComparaison && indicateursPrecedents && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <IconeTendance
                              variation={calculerVariation(
                                data[indicateur.id as keyof IndicateurCommercial] as number,
                                indicateursPrecedents[indicateur.id as keyof IndicateurCommercial] as number
                              )}
                              inverse={indicateur.inverseTrend}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Précédent: {formatNumber(indicateursPrecedents[indicateur.id as keyof IndicateurCommercial] as number)}
                              <br />
                              Variation: {formatNumber(calculerVariation(
                                data[indicateur.id as keyof IndicateurCommercial] as number,
                                indicateursPrecedents[indicateur.id as keyof IndicateurCommercial] as number
                              ))}%
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  )}
                </div>

                {indicateur.calculated && (
                  <p className="text-xs text-gray-500">Calculé automatiquement</p>
                )}

                {errors[indicateur.id] && (
                  <p className="text-red-500 text-sm">{errors[indicateur.id]}</p>
                )}
              </div>
            ))}
          </div>

          {/* Section d'analyse de la concentration client */}
          {data.top_5_clients_pourcentage !== undefined && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Analyse de concentration client</CardTitle>
                <CardDescription>
                  Répartition du chiffre d'affaires et niveau de dépendance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className={`h-4 rounded-full ${
                        data.top_5_clients_pourcentage > 70 ? 'bg-red-500' :
                        data.top_5_clients_pourcentage > 50 ? 'bg-amber-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(100, data.top_5_clients_pourcentage)}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>0%</span>
                    <span className="text-green-600">25%</span>
                    <span className="text-amber-600">50%</span>
                    <span className="text-red-600">75%</span>
                    <span>100%</span>
                  </div>

                  <div className="mt-2 text-sm">
                    {data.top_5_clients_pourcentage > 70 ? (
                      <p className="text-red-600">
                        Concentration client élevée. Un effort de diversification est recommandé.
                      </p>
                    ) : data.top_5_clients_pourcentage > 50 ? (
                      <p className="text-amber-600">
                        Concentration client modérée. Surveillez l'évolution de cet indicateur.
                      </p>
                    ) : (
                      <p className="text-green-600">
                        Bonne diversification de la clientèle.
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {!readOnly && (
            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => reset()}
                disabled={processing}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={processing}
              >
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </Button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default CommerciauxTab;
