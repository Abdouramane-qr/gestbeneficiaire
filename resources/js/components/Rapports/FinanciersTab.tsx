import React, { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Save, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { Entreprise, IndicateurFinancier, Rapport } from '@/types/index';


interface FinanciersTabProps {
  indicateurs: IndicateurFinancier;
  rapport: Rapport;
  entreprise: Entreprise;
  rapportPrecedent?: Rapport;
  errors: Record<string, string>;
  readOnly?: boolean;
}

const FinanciersTab: React.FC<FinanciersTabProps> = ({
  indicateurs,
  rapport,
  entreprise,
  rapportPrecedent,
  errors = {},
  readOnly = false
}) => {
  const { data, setData, post, processing, reset } = useForm<IndicateurFinancier>({
    ...indicateurs,
  });

  const [showComparaison, setShowComparaison] = useState<boolean>(!!rapportPrecedent);

  // Récupérer les indicateurs du rapport précédent pour comparaison
  const indicateursPrecedents = rapportPrecedent?.indicateursFinanciers;

  // Effet pour calculer automatiquement les valeurs dérivées
  useEffect(() => {
    // Calcul de la marge EBITDA (%)
    if (data.ebitda !== undefined && data.chiffre_affaires !== undefined && data.chiffre_affaires > 0) {
      const margeEbitda = (data.ebitda / data.chiffre_affaires) * 100;
      setData('marge_ebitda', Number(margeEbitda.toFixed(2)));
    } else {
      setData('marge_ebitda', undefined);
    }

    // Calcul du ratio dette/EBITDA
    if (data.dette_nette !== undefined && data.ebitda !== undefined && data.ebitda > 0) {
      const ratioDetteEbitda = data.dette_nette / data.ebitda;
      setData('ratio_dette_ebitda', Number(ratioDetteEbitda.toFixed(2)));
    } else {
      setData('ratio_dette_ebitda', undefined);
    }

    // Calcul du ratio d'endettement (%)
    if (data.dette_nette !== undefined && data.fonds_propres !== undefined && data.fonds_propres > 0) {
      const ratioEndettement = (data.dette_nette / data.fonds_propres) * 100;
      setData('ratio_endettement', Number(ratioEndettement.toFixed(2)));
    } else {
      setData('ratio_endettement', undefined);
    }
  }, [data.chiffre_affaires, data.ebitda, data.dette_nette, data.fonds_propres, setData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(name as keyof IndicateurFinancier, value === '' ? undefined : parseFloat(value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('rapports.submitFinanciers', { entreprise: entreprise.id, rapport: rapport.id }));
  };

  // Calculer la variation en pourcentage entre deux valeurs
  const calculerVariation = (valeurActuelle?: number, valeurPrecedente?: number): number | undefined => {
    if (valeurActuelle === undefined || valeurPrecedente === undefined || valeurPrecedente === 0) {
      return undefined;
    }
    return ((valeurActuelle - valeurPrecedente) / Math.abs(valeurPrecedente)) * 100;
  };

  // Fonction pour afficher l'icône de tendance
  const IconeTendance = ({ variation }: { variation?: number }) => {
    if (variation === undefined) return <Minus className="h-4 w-4" />;
    if (variation > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (variation < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
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

  // Liste des indicateurs financiers avec leurs descriptions et unités
  const indicateursList = [
    {
      id: 'chiffre_affaires',
      label: 'Chiffre d\'affaires',
      description: 'Montant total des ventes de biens ou services réalisées par l\'entreprise',
      unite: '€',
      calculated: false
    },
    {
      id: 'resultat_net',
      label: 'Résultat net',
      description: 'Bénéfice ou perte de l\'entreprise après déduction de toutes les charges et impôts',
      unite: '€',
      calculated: false
    },
    {
      id: 'ebitda',
      label: 'EBITDA',
      description: 'Earnings Before Interest, Taxes, Depreciation, and Amortization (résultat avant intérêts, impôts, dépréciations et amortissements)',
      unite: '€',
      calculated: false
    },
    {
      id: 'marge_ebitda',
      label: 'Marge EBITDA',
      description: 'Ratio entre l\'EBITDA et le chiffre d\'affaires',
      unite: '%',
      calculated: true
    },
    {
      id: 'cash_flow',
      label: 'Cash flow',
      description: 'Flux de trésorerie généré par l\'activité',
      unite: '€',
      calculated: false
    },
    {
      id: 'dette_nette',
      label: 'Dette nette',
      description: 'Endettement financier moins la trésorerie disponible',
      unite: '€',
      calculated: false
    },
    {
      id: 'ratio_dette_ebitda',
      label: 'Ratio dette/EBITDA',
      description: 'Rapport entre la dette nette et l\'EBITDA, mesure la capacité de remboursement',
      unite: '',
      calculated: true
    },
    {
      id: 'fonds_propres',
      label: 'Fonds propres',
      description: 'Capitaux appartenant aux actionnaires de l\'entreprise',
      unite: '€',
      calculated: false
    },
    {
      id: 'ratio_endettement',
      label: 'Ratio d\'endettement',
      description: 'Rapport entre la dette nette et les fonds propres, mesure le levier financier',
      unite: '%',
      calculated: true
    },
    {
      id: 'besoin_fonds_roulement',
      label: 'Besoin en fonds de roulement',
      description: 'Montant nécessaire pour financer le cycle d\'exploitation',
      unite: '€',
      calculated: false
    },
    {
      id: 'tresorerie_nette',
      label: 'Trésorerie nette',
      description: 'Liquidités disponibles après déduction des dettes financières à court terme',
      unite: '€',
      calculated: false
    },
    {
      id: 'investissements',
      label: 'Investissements',
      description: 'Dépenses en capital pour acquérir ou améliorer des actifs à long terme',
      unite: '€',
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

      {/* Alert pour les champs calculés */}
      <Alert className="mb-6 bg-blue-50 border-blue-200">
        <AlertDescription className="text-blue-700">
          Les champs marqués d'un <span className="bg-gray-50 px-1 py-0.5 rounded">fond gris</span> sont calculés automatiquement à partir des valeurs que vous avez saisies.
        </AlertDescription>
      </Alert>

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
                    step="0.01"
                    value={data[indicateur.id as keyof IndicateurFinancier] || ''}
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
                                data[indicateur.id as keyof IndicateurFinancier] as number,
                                indicateursPrecedents[indicateur.id as keyof IndicateurFinancier] as number
                              )}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Précédent: {formatNumber(indicateursPrecedents[indicateur.id as keyof IndicateurFinancier] as number)}
                              <br />
                              Variation: {formatNumber(calculerVariation(
                                data[indicateur.id as keyof IndicateurFinancier] as number,
                                indicateursPrecedents[indicateur.id as keyof IndicateurFinancier] as number
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

          {/* Section pour afficher la comparaison détaillée si activée */}
          {showComparaison && indicateursPrecedents && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Comparaison avec {rapportPrecedent?.periode} {rapportPrecedent?.annee}</CardTitle>
                <CardDescription>
                  Analyse comparative des principaux indicateurs financiers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['chiffre_affaires', 'resultat_net', 'ebitda', 'marge_ebitda'].map((key) => {
                    const indicateur = indicateursList.find(ind => ind.id === key);
                    const valeurActuelle = data[key as keyof IndicateurFinancier];
                    const valeurPrecedente = indicateursPrecedents[key as keyof IndicateurFinancier];
                    const variation = calculerVariation(valeurActuelle as number, valeurPrecedente as number);

                    return (
                      <div key={key} className="p-4 border rounded-lg">
                        <div className="flex justify-between">
                          <div className="font-medium">{indicateur?.label}</div>
                          <div className={variation && variation > 0 ? 'text-green-600' : variation && variation < 0 ? 'text-red-600' : ''}>
                            <IconeTendance variation={variation} />
                            {variation !== undefined ? ` ${formatNumber(variation)}%` : ''}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div>
                            <div className="text-sm text-gray-500">Actuel</div>
                            <div className="font-semibold">{formatNumber(valeurActuelle as number)} {indicateur?.unite}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Précédent</div>
                            <div>{formatNumber(valeurPrecedente as number)} {indicateur?.unite}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
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

export default FinanciersTab;
