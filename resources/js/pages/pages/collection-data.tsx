import { useState, useEffect, SetStateAction } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, LineChart } from 'lucide-react';
import Graphique from '../graphique ';

interface CollectionDataProps {
  collectesStats: Array<any>;
  collectesParCategorie: Array<any>;
}

export default function CollectionData({
  collectesStats,
  collectesParCategorie
}: CollectionDataProps) {
  const [categorieCollecte, setCategorieCollecte] = useState('commercial');
  const [chartData, setChartData] = useState<any[]>([]);
  const [chartKeys, setChartKeys] = useState<string[]>([]);

  // Log pour débogage
  useEffect(() => {
    console.log('CollectionData received:', {
      collectesStats,
      collectesParCategorie
    });
  }, [collectesStats, collectesParCategorie]);

  // Préparation des données pour l'affichage
  useEffect(() => {
    if (!Array.isArray(collectesParCategorie)) {
      setChartData([]);
      setChartKeys([]);
      return;
    }

    let data: SetStateAction<any[]> = [];
    let keys: SetStateAction<string[]> = [];

    // Utiliser les données en fonction de la catégorie sélectionnée
    switch (categorieCollecte) {
      case 'commercial':
        data = collectesParCategorie.map(item => ({
          name: item.periode || 'Non spécifié',
          Prospects: Number(item.commercial?.prospects_total || 0),
          Clients: Number(item.commercial?.clients_total || 0),
          Contrats: Number(item.commercial?.contrats_total || 0)
        }));
        keys = ['Prospects', 'Clients', 'Contrats'];
        break;

      case 'tresorerie':
        data = collectesParCategorie.map(item => ({
          name: item.periode || 'Non spécifié',
          Impayés: Number(item.tresorerie?.montant_impayes || 0),
          Employés: Number(item.tresorerie?.employes_total || 0)
        }));
        keys = ['Impayés', 'Employés'];
        break;

      case 'rentabilite':
        data = collectesParCategorie.map(item => ({
          name: item.periode || 'Non spécifié',
          'Rendement des fonds propres (%)': Number(item.rentabilite?.rendement_fonds_propres || 0),
          'Autosuffisance opérationnelle (%)': Number(item.rentabilite?.autosuffisance_operationnelle || 0),
          'Marge bénéficiaire (%)': Number(item.rentabilite?.marge_beneficiaire || 0),
          'Ratio charges financières (%)': Number(item.rentabilite?.ratio_charges_financieres || 0)
        }));
        keys = [
          'Rendement des fonds propres (%)',
          'Autosuffisance opérationnelle (%)',
          'Marge bénéficiaire (%)',
          'Ratio charges financières (%)'
        ];
        break;

      case 'activites':
        data = collectesParCategorie.map(item => ({
          name: item.periode || 'Non spécifié',
          'Cycles de production': Number(item.activites?.nbr_cycle_production || 0),
          'Clients': Number(item.activites?.nbr_clients || 0),
          'Chiffre d\'affaires': Number(item.activites?.chiffre_affaire || 0),
          'Croissance (%)': Number(item.activites?.taux_croissance || 0)
        }));
        keys = ['Cycles de production', 'Clients', 'Chiffre d\'affaires', 'Croissance (%)'];
        break;

      case 'rh':
        data = collectesParCategorie.map(item => ({
          name: item.periode || 'Non spécifié',
          'Effectif total': Number(item.rh?.effectif_total || 0),
          'Nouveaux recrutés': Number(item.rh?.nouveaux_recrutes || 0),
          'Taux de rotation (%)': Number(item.rh?.taux_rotation || 0)
        }));
        keys = ['Effectif total', 'Nouveaux recrutés', 'Taux de rotation (%)'];
        break;

      case 'performance':
        data = collectesParCategorie.map(item => ({
          name: item.periode || 'Non spécifié',
          'Crédits remboursés': Number(item.performance?.credit_rembourse || 0),
          'Taux de remboursement (%)': Number(item.performance?.taux_rembourssement || 0),
          'Accès au financement': Number(item.performance?.acces_financement || 0),
          'Bancarisation': Number(item.performance?.nbr_bancarisation || 0)
        }));
        keys = ['Crédits remboursés', 'Taux de remboursement (%)', 'Accès au financement', 'Bancarisation'];
        break;
    }

    // Mise à jour des états
    setChartData(data);
    setChartKeys(keys);
  }, [categorieCollecte, collectesParCategorie]);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Données des collectes</CardTitle>
          <Select value={categorieCollecte} onValueChange={setCategorieCollecte}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="tresorerie">Trésorerie</SelectItem>
              <SelectItem value="rentabilite">Rentabilité</SelectItem>
              <SelectItem value="activites">Activités</SelectItem>
              <SelectItem value="rh">Ressources Humaines</SelectItem>
              <SelectItem value="performance">Performance</SelectItem>
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
            {chartData.length > 0 && chartKeys.length > 0 ? (
              <Graphique
                data={chartData}
                type="line"
                dataKeys={chartKeys}
                height={350}
                title={`Données - ${categorieCollecte}`}
              />
            ) : (
              <div className="text-center text-gray-500 py-10">
                Aucune donnée disponible pour cette catégorie
              </div>
            )}
          </TabsContent>

          <TabsContent value="table">
            <div className="overflow-x-auto">
              {chartData.length > 0 && chartKeys.length > 0 ? (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 px-4 text-left">Période</th>
                      {chartKeys.map(key => (
                        <th key={key} className="py-2 px-4 text-left">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.map((item, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4">{item.name}</td>
                        {chartKeys.map(key => (
                          <td key={key} className="py-2 px-4">{item[key]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center text-gray-500 py-10">
                  Aucune donnée disponible pour cette catégorie
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
