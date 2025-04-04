import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';

import { Save, TrendingUp, TrendingDown, Minus, Users } from 'lucide-react';
import { IndicateurRH, Rapport, Entreprise } from '@/types/index';
import {  Input } from '../ui/input';
import { Button } from '../ui/button';

import { TooltipProvider, TooltipTrigger, TooltipContent } from '../ui/tooltip';
import {  Label } from '../ui/label';
import { Tooltip } from '../ui/tooltip';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../ui/card';


interface RHTabProps {
  indicateurs: IndicateurRH;
  rapport: Rapport;
  entreprise: Entreprise;
  rapportPrecedent?: Rapport;
  errors: Record<string, string>;
  readOnly?: boolean;
}

const RHTab: React.FC<RHTabProps> = ({
  indicateurs,
  rapport,
  entreprise,
  rapportPrecedent,
  errors = {},
  readOnly = false
}) => {
  const { data, setData, post, processing, reset } = useForm<IndicateurRH>({
    ...indicateurs,
  });

  const [showComparaison, setShowComparaison] = useState<boolean>(!!rapportPrecedent);
  const [coutParEmploye, setCoutParEmploye] = useState<number | undefined>(undefined);

  // Récupérer les indicateurs du rapport précédent pour comparaison
  const indicateursPrecedents = rapportPrecedent?.indicateursRH;

  // Calculer le coût moyen par employé
  useEffect(() => {
    if (data.masse_salariale !== undefined && data.effectif_total !== undefined && data.effectif_total > 0) {
      setCoutParEmploye(data.masse_salariale / data.effectif_total);
    } else {
      setCoutParEmploye(undefined);
    }
  }, [data.masse_salariale, data.effectif_total]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'effectif_total' || name === 'accidents_travail') {
      setData(name as keyof IndicateurRH, value === '' ? undefined : parseInt(value));
    } else {
      setData(name as keyof IndicateurRH, value === '' ? undefined : parseFloat(value));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('rapports.submitRH', { entreprise: entreprise.id, rapport: rapport.id }));
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
    // Pour certains indicateurs, une hausse est négative (ex: turnover)
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

  // Liste des indicateurs RH avec leurs descriptions, unités et si une hausse est négative
  const indicateursList = [
    {
      id: 'effectif_total',
      label: 'Effectif total',
      description: 'Nombre total d\'employés dans l\'entreprise',
      unite: '',
      inverseTrend: false,
      required: true
    },
    {
      id: 'cadres_pourcentage',
      label: 'Cadres',
      description: 'Pourcentage de cadres dans l\'effectif total',
      unite: '%',
      inverseTrend: false,
      required: false
    },
    {
      id: 'turnover',
      label: 'Turnover',
      description: 'Taux de rotation du personnel (départs / effectif moyen)',
      unite: '%',
      inverseTrend: true, // Une hausse est négative
      required: true
    },
    {
      id: 'absenteisme',
      label: 'Absentéisme',
      description: 'Taux d\'absentéisme (jours d\'absence / jours travaillés théoriques)',
      unite: '%',
      inverseTrend: true, // Une hausse est négative
      required: true
    },
    {
      id: 'masse_salariale',
      label: 'Masse salariale',
      description: 'Montant total des salaires et charges sociales',
      unite: '€',
      inverseTrend: false,
      required: true
    },
    {
      id: 'cout_formation',
      label: 'Coût formation',
      description: 'Dépenses totales consacrées à la formation',
      unite: '€',
      inverseTrend: false,
      required: false
    },
    {
      id: 'anciennete_moyenne',
      label: 'Ancienneté moyenne',
      description: 'Nombre moyen d\'années de présence des employés dans l\'entreprise',
      unite: 'années',
      inverseTrend: false,
      required: false
    },
    {
      id: 'accidents_travail',
      label: 'Accidents du travail',
      description: 'Nombre d\'accidents du travail survenus pendant la période',
      unite: '',
      inverseTrend: true, // Une hausse est négative
      required: true
    },
    {
      id: 'index_egalite',
      label: 'Index égalité',
      description: 'Index d\'égalité professionnelle femmes-hommes (sur 100 points)',
      unite: '/100',
      inverseTrend: false,
      required: data.effectif_total !== undefined && data.effectif_total >= 50
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
          {/* Analyses et statistiques RH */}
          {data.effectif_total !== undefined && data.masse_salariale !== undefined && (
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Analyse RH
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg bg-blue-50">
                    <div className="text-sm text-blue-700 font-medium">Coût moyen par employé</div>
                    <div className="text-2xl font-bold mt-2">{formatNumber(coutParEmploye)} €</div>
                    {indicateursPrecedents?.masse_salariale !== undefined &&
                     indicateursPrecedents?.effectif_total !== undefined &&
                     indicateursPrecedents?.effectif_total > 0 && (
                      <div className="mt-1 text-sm">
                        <IconeTendance
                          variation={calculerVariation(
                            coutParEmploye,
                            indicateursPrecedents.masse_salariale / indicateursPrecedents.effectif_total
                          )}
                          inverse={true}
                        />
                        {' '}
                        {formatNumber(calculerVariation(
                          coutParEmploye,
                          indicateursPrecedents.masse_salariale / indicateursPrecedents.effectif_total
                        ))}% vs période précédente
                      </div>
                    )}
                  </div>

                  {data.cout_formation !== undefined && (
                    <div className="p-4 border rounded-lg bg-green-50">
                      <div className="text-sm text-green-700 font-medium">Formation par employé</div>
                      <div className="text-2xl font-bold mt-2">
                        {formatNumber(data.cout_formation / data.effectif_total)} €
                      </div>
                      {indicateursPrecedents?.cout_formation !== undefined &&
                       indicateursPrecedents?.effectif_total !== undefined &&
                       indicateursPrecedents?.effectif_total > 0 && (
                        <div className="mt-1 text-sm">
                          <IconeTendance
                            variation={calculerVariation(
                              data.cout_formation / data.effectif_total,
                              indicateursPrecedents.cout_formation / indicateursPrecedents.effectif_total
                            )}
                          />
                          {' '}
                          {formatNumber(calculerVariation(
                            data.cout_formation / data.effectif_total,
                            indicateursPrecedents.cout_formation / indicateursPrecedents.effectif_total
                          ))}% vs période précédente
                        </div>
                      )}
                    </div>
                  )}

                  {data.anciennete_moyenne !== undefined && (
                    <div className="p-4 border rounded-lg bg-purple-50">
                      <div className="text-sm text-purple-700 font-medium">Stabilité de l'équipe</div>
                      <div className="text-2xl font-bold mt-2">
                        {data.anciennete_moyenne.toFixed(1)} {data.anciennete_moyenne > 1 ? 'années' : 'année'}
                      </div>
                      <div className="mt-1 text-sm">
                        {data.anciennete_moyenne > 5 ? (
                          <span className="text-green-600">Équipe expérimentée</span>
                        ) : data.anciennete_moyenne > 2 ? (
                          <span className="text-amber-600">Équipe stabilisée</span>
                        ) : (
                          <span className="text-red-600">Équipe récente</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Formulaire de saisie des indicateurs */}
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
                    step={indicateur.unite === '%' || indicateur.unite === 'années' ? "0.1" : "1"}
                    value={data[indicateur.id as keyof IndicateurRH] || ''}
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
                                data[indicateur.id as keyof IndicateurRH] as number,
                                indicateursPrecedents[indicateur.id as keyof IndicateurRH] as number
                              )}
                              inverse={indicateur.inverseTrend}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Précédent: {formatNumber(indicateursPrecedents[indicateur.id as keyof IndicateurRH] as number)}
                              <br />
                              Variation: {formatNumber(calculerVariation(
                                data[indicateur.id as keyof IndicateurRH] as number,
                                indicateursPrecedents[indicateur.id as keyof IndicateurRH] as number
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

          {/* Index égalité détaillé (s'il est renseigné) */}
          {data.index_egalite !== undefined && data.index_egalite > 0 && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Index Égalité professionnelle</CardTitle>
                <CardDescription>
                  Évaluation de l'égalité femmes-hommes au sein de l'entreprise
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="w-full h-6 bg-gray-200 rounded-full">
                    <div
                      className={`h-6 rounded-full ${
                        data.index_egalite >= 85 ? 'bg-green-500' :
                        data.index_egalite >= 75 ? 'bg-amber-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${data.index_egalite}%` }}
                    >
                      <span className="px-4 font-medium text-white">{data.index_egalite} / 100</span>
                    </div>
                  </div>

                  <div className="mt-2">
                    {data.index_egalite >= 85 ? (
                      <p className="text-green-600">
                        Excellent niveau d'égalité professionnelle. Continuez à maintenir ces bonnes pratiques.
                      </p>
                    ) : data.index_egalite >= 75 ? (
                      <p className="text-amber-600">
                        Niveau satisfaisant mais des améliorations sont possibles. Un plan d'action est recommandé.
                      </p>
                    ) : (
                      <p className="text-red-600">
                        Un plan d'action obligatoire doit être mis en place pour améliorer l'égalité professionnelle.
                      </p>
                    )}
                  </div>

                  <div className="text-sm text-gray-500 mt-2">
                    <p>L'index d'égalité professionnelle femmes-hommes est noté sur 100 points et prend en compte plusieurs indicateurs :</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>L'écart de rémunération entre les femmes et les hommes</li>
                      <li>L'écart dans les augmentations annuelles</li>
                      <li>L'écart dans les promotions</li>
                      <li>Les augmentations au retour de congé maternité</li>
                      <li>La parité parmi les 10 plus hautes rémunérations</li>
                    </ul>
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

export default RHTab;
