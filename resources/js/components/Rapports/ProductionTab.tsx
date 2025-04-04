import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { IndicateurProduction, Rapport, Entreprise } from '@/types/index';
import { Button } from '../ui/button';
import {Textarea } from '../ui/textarea';
import { Input } from '../ui/input';

import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Activity, Factory, Minus, Save, TrendingDown, TrendingUp } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';

interface ProductionTabProps {
  indicateurs: IndicateurProduction;
  rapport: Rapport;
  entreprise: Entreprise;
  rapportPrecedent?: Rapport;
  errors: Record<string, string>;
  readOnly?: boolean;
}

const ProductionTab: React.FC<ProductionTabProps> = ({
  indicateurs,
  rapport,
  entreprise,
  rapportPrecedent,
  errors = {},
  readOnly = false
}) => {
  const { data, setData, post, processing, reset } = useForm<IndicateurProduction>({
    ...indicateurs,
  });

  const [showComparaison, setShowComparaison] = useState<boolean>(!!rapportPrecedent);

  // Récupérer les indicateurs du rapport précédent pour comparaison
  const indicateursPrecedents = rapportPrecedent?.indicateursProduction;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'delai_production_moyen' || name === 'incidents_qualite') {
      setData(name as keyof IndicateurProduction, value === '' ? undefined : parseInt(value));
    } else if (name === 'certifications') {
      setData(name as keyof IndicateurProduction, value);
    } else {
      setData(name as keyof IndicateurProduction, value === '' ? undefined : parseFloat(value));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('rapports.submitProduction', { entreprise: entreprise.id, rapport: rapport.id }));
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
    // Pour certains indicateurs, une hausse est négative (ex: taux de rebut)
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

  // Traiter et afficher les certifications
  const parseCertifications = (certifs?: string): string[] => {
    if (!certifs) return [];
    return certifs.split(',').map(cert => cert.trim()).filter(cert => cert !== '');
  };

  const certificationsList = parseCertifications(data.certifications);

  // Liste des indicateurs de production avec leurs descriptions, unités et si une hausse est négative
  const indicateursList = [
    {
      id: 'taux_utilisation',
      label: 'Taux d\'utilisation',
      description: 'Pourcentage d\'utilisation des capacités de production',
      unite: '%',
      inverseTrend: false,
      required: true
    },
    {
      id: 'taux_rebut',
      label: 'Taux de rebut',
      description: 'Pourcentage de produits non conformes ou défectueux',
      unite: '%',
      inverseTrend: true, // Une hausse est négative
      required: true
    },
    {
      id: 'delai_production_moyen',
      label: 'Délai de production moyen',
      description: 'Temps moyen nécessaire pour produire une unité ou un lot',
      unite: 'jours',
      inverseTrend: true, // Une hausse est négative
      required: false
    },
    {
      id: 'cout_production',
      label: 'Coût de production',
      description: 'Coût total de production sur la période',
      unite: '€',
      inverseTrend: true, // Une hausse est négative
      required: true
    },
    {
      id: 'stock_matieres_premieres',
      label: 'Stock matières premières',
      description: 'Valeur du stock de matières premières en fin de période',
      unite: '€',
      inverseTrend: false,
      required: false
    },
    {
      id: 'stock_produits_finis',
      label: 'Stock produits finis',
      description: 'Valeur du stock de produits finis en fin de période',
      unite: '€',
      inverseTrend: false,
      required: false
    },
    {
      id: 'rotation_stocks',
      label: 'Rotation des stocks',
      description: 'Nombre de fois que le stock est renouvelé sur une année',
      unite: 'par an',
      inverseTrend: false,
      required: false
    },
    {
      id: 'incidents_qualite',
      label: 'Incidents qualité',
      description: 'Nombre d\'incidents ou de non-conformités qualité signalés',
      unite: '',
      inverseTrend: true, // Une hausse est négative
      required: true
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

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Tableau de bord de production */}
          {data.taux_utilisation !== undefined && data.taux_rebut !== undefined && (
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <Factory className="mr-2 h-5 w-5" />
                  Tableau de bord de production
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Efficacité de production */}
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Efficacité de production</h3>
                      <Activity className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Taux d'utilisation</span>
                        <span className="font-medium">{formatNumber(data.taux_utilisation)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            data.taux_utilisation >= 85 ? 'bg-green-500' :
                            data.taux_utilisation >= 70 ? 'bg-amber-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${data.taux_utilisation}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Taux de rebut</span>
                        <span className="font-medium">{formatNumber(data.taux_rebut)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            data.taux_rebut <= 2 ? 'bg-green-500' :
                            data.taux_rebut <= 5 ? 'bg-amber-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(100, data.taux_rebut * 5)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Indicateurs de qualité */}
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-4">Indicateurs de qualité</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Incidents qualité</span>
                        <span className={`font-medium ${
                         (data.incidents_qualite ?? 0) === 0 ? 'text-green-600' :
                         (data.incidents_qualite ?? 0) <= 3 ? 'text-amber-600' :
                         'text-red-600'
                        }`}>
                          {data.incidents_qualite || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Certifications</span>
                        <span className="font-medium">{certificationsList.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Formulaire de saisie des indicateurs numériques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {indicateursList.map((indicateur) => (
              <div className="space-y-2" key={indicateur.id}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Label htmlFor={indicateur.id} className="flex items-center cursor-help">
                        {indicateur.label} {indicateur.unite && <span className="ml-1 text-gray-500">({indicateur.unite})</span>}
                        {indicateur.required && <span className="ml-1 text-red-500">*</span>}
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
                    step={indicateur.unite === '%' || indicateur.id === 'rotation_stocks' ? "0.1" : "1"}
                    value={data[indicateur.id as keyof IndicateurProduction] || ''}
                    onChange={handleChange}
                    className="pr-10"
                    readOnly={readOnly}
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
                                data[indicateur.id as keyof IndicateurProduction] as number,
                                indicateursPrecedents[indicateur.id as keyof IndicateurProduction] as number
                              )}
                              inverse={indicateur.inverseTrend}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Précédent: {formatNumber(indicateursPrecedents[indicateur.id as keyof IndicateurProduction] as number)}
                              <br />
                              Variation: {formatNumber(calculerVariation(
                                data[indicateur.id as keyof IndicateurProduction] as number,
                                indicateursPrecedents[indicateur.id as keyof IndicateurProduction] as number
                              ))}%
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  )}
                </div>

                {errors[indicateur.id] && (
                  <p className="text-red-500 text-sm">{errors[indicateur.id]}</p>
                )}
              </div>
            ))}
          </div>

          {/* Champ pour les certifications */}
          <div className="space-y-2 mt-8">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Label htmlFor="certifications" className="flex items-center cursor-help">
                    Certifications
                  </Label>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Liste des certifications et normes obtenues par l'entreprise (ISO, etc.). Séparez les certifications par des virgules.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Textarea
              id="certifications"
              name="certifications"
              value={data.certifications || ''}
              onChange={handleChange}
              placeholder="Ex: ISO 9001, ISO 14001, ..."
              className="h-24"
              readOnly={readOnly}
              disabled={readOnly}
            />

            {errors.certifications && (
              <p className="text-red-500 text-sm">{errors.certifications}</p>
            )}

            {/* Afficher les badges des certifications */}
            {certificationsList.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {certificationsList.map((certification, index) => (
                  <Badge key={index} variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    {certification}
                  </Badge>
                ))}
              </div>
            )}
          </div>

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

export default ProductionTab;
