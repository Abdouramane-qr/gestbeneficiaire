import { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, LineChart } from 'lucide-react';
import { DashboardProps } from '@/types/dasb';
import Graphique from '../graphique ';

export default function Dashboard({
  totalEntreprises = 0,
  totalBeneficiaires = 0,
  totalCollectes = 0,
  entreprisesParMois = [],
  entreprisesParSecteur = [],
  beneficiairesParRegion = [],
  collectesStats = [],
  collectesParCategorie = []
}: DashboardProps) {
  const [timeRange, setTimeRange] = useState('month');
  const [categorieCollecte, setCategorieCollecte] = useState('commercial');

  console.log("DONNÉES REÇUES DASHBOARD:", {
    totalEntreprises,
    totalBeneficiaires,
    totalCollectes,
    entreprisesParMois: entreprisesParMois.length,
    entreprisesParSecteur: entreprisesParSecteur.length,
    beneficiairesParRegion: beneficiairesParRegion.length,
    collectesStats: collectesStats.length,
    collectesParCategorie: collectesParCategorie.length
  });

  // Sécurisation des données
  const secureDonneesParCategorie = () => {
    // Vérifier si les données existent et ne sont pas vides
    if (!collectesStats || collectesStats.length === 0) {
      return [{ name: 'Aucune donnée', placeholder: 0 }];
    }

    switch (categorieCollecte) {
      case 'commercial':
        return collectesStats.map(item => ({
          name: item.name || 'Non spécifié',
          'Prospects': item.prospects || 0,
          'Clients': item.clients || 0,
          'Contrats': item.contrats || 0
        }));
      case 'tresorerie':
        // Vérifier si collectesParCategorie existe et n'est pas vide
        if (!collectesParCategorie || collectesParCategorie.length === 0) {
          return [{ name: 'Aucune donnée', placeholder: 0 }];
        }

        return collectesParCategorie.map(item => ({
          name: item.periode || 'Non spécifié',
          'Impayés': item.tresorerie?.montant_impayes || 0,
          'Employés': item.tresorerie?.employes_total || 0
        }));
      default:
        return [{ name: 'Aucune donnée', placeholder: 0 }];
    }
  };

  // Obtenir les clés de données de façon sécurisée
  const getDataKeys = () => {
    const donnees = secureDonneesParCategorie();
    if (donnees.length === 0) return [];
    return Object.keys(donnees[0]).filter(key => key !== 'name');
  };

  // Console log pour débogage
  console.log("Dashboard Props:", {
    totalEntreprises,
    entreprisesParMois,
    collectesStats,
    collectesParCategorie
  });

  return (
    <AppLayout>
      <Head title="Tableau de bord" />
      <div className="flex h-full flex-1 flex-col gap-4 p-4">
        {/* En-tête avec filtres */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <h1 className="text-2xl font-bold">Tableau de bord JEM II OIM</h1>
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Semaine</SelectItem>
                <SelectItem value="month">Mois</SelectItem>
                <SelectItem value="quarter">Trimestre</SelectItem>
                <SelectItem value="year">Année</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Statistiques principales */}
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">
                Entreprises
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalEntreprises}</div>
              <p className="text-sm text-gray-500">Total des entreprises</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">
                Promoteurs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalBeneficiaires}</div>
              <p className="text-sm text-gray-500">Total des bénéficiaires</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">
                Collectes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalCollectes}</div>
              <p className="text-sm text-gray-500">Total des collectes</p>
            </CardContent>
          </Card>
        </div>

        {/* Graphiques principaux */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Évolution mensuelle</CardTitle>
            </CardHeader>
            <CardContent>
              {entreprisesParMois && entreprisesParMois.length > 0 ? (
                <Graphique
                  data={entreprisesParMois}
                  type="line"
                  dataKeys={['entreprises', 'promoteurs']}
                  colors={['#0088FE', '#00C49F']}
                  title="Entreprises et Promoteurs"
                />
              ) : (
                <div className="text-center text-gray-500 py-10">Aucune donnée disponible</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Distribution par secteur</CardTitle>
            </CardHeader>
            <CardContent>
              {entreprisesParSecteur && entreprisesParSecteur.length > 0 ? (
                <Graphique
                  data={entreprisesParSecteur}
                  type="pie"
                  title="Secteurs d'activité"
                />
              ) : (
                <div className="text-center text-gray-500 py-10">Aucune donnée disponible</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Données des collectes */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-semibold">
                Données des collectes
              </CardTitle>
              <Select value={categorieCollecte} onValueChange={setCategorieCollecte}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="tresorerie">Trésorerie</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="graph">
              <TabsList className="mb-4">
                <TabsTrigger value="graph">
                  <LineChart className="mr-2" size={16} />
                  Graphique
                </TabsTrigger>
                <TabsTrigger value="table">
                  <BarChart3 className="mr-2" size={16} />
                  Tableau
                </TabsTrigger>
              </TabsList>

              <TabsContent value="graph">
                {secureDonneesParCategorie().length > 0 && getDataKeys().length > 0 ? (
                  <Graphique
                    data={secureDonneesParCategorie()}
                    type="line"
                    dataKeys={getDataKeys()}
                  />
                ) : (
                  <div className="text-center text-gray-500 py-10">Aucune donnée disponible</div>
                )}
              </TabsContent>

              <TabsContent value="table">
                <div className="overflow-x-auto">
                  {secureDonneesParCategorie().length > 0 && getDataKeys().length > 0 ? (
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="py-2 px-4 text-left">Période</th>
                          {getDataKeys().map(key => (
                            <th key={key} className="py-2 px-4 text-left">{key}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {secureDonneesParCategorie().map((item, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-2 px-4">{item.name}</td>
                            {getDataKeys().map(key => (
                              <td key={key} className="py-2 px-4">{item[key]}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center text-gray-500 py-10">Aucune donnée disponible</div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Statistiques régionales */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Statistiques régionales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              {beneficiairesParRegion && beneficiairesParRegion.length > 0 ? (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 px-4 text-left">Région</th>
                      <th className="py-2 px-4 text-left">Promteurs</th>
                      <th className="py-2 px-4 text-left">Entreprises</th>
                      <th className="py-2 px-4 text-left">Ratio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {beneficiairesParRegion.map((region) => (
                      <tr key={region.region} className="border-b">
                        <td className="py-2 px-4">{region.region}</td>
                        <td className="py-2 px-4">{region.total}</td>
                        <td className="py-2 px-4">{region.entreprises}</td>
                        <td className="py-2 px-4">
                          {region.total > 0 ? ((region.entreprises / region.total) * 100).toFixed(1) + '%' : '0%'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center text-gray-500 py-10">Aucune donnée disponible</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
