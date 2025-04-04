// resources/js/Pages/Analyses/Secteurs.tsx
import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SecteursProps extends PageProps {
  secteurs: string[];
  secteurSelectionne?: string;
  annees: number[];
  anneeSelectionnee: number;
  statistiques?: any;
}

export default function Secteurs({  secteurs, secteurSelectionne, annees, anneeSelectionnee, statistiques }: SecteursProps) {
  const [activeTab, setActiveTab] = useState('financier');

  return (
    <AuthenticatedLayout /* user={auth.user} */>
      <Head title="Analyse par secteur" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold mb-6">Analyse par secteur d'activité</h1>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Sélection du secteur</CardTitle>
              <CardDescription>
                Sélectionnez un secteur d'activité et une année pour visualiser les statistiques
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Formulaire de sélection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Secteur d'activité</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="">Sélectionnez un secteur</option>
                    {secteurs.map((secteur) => (
                      <option
                        key={secteur}
                        value={secteur}
                        selected={secteur === secteurSelectionne}
                      >
                        {secteur}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Année</label>
                  <select className="w-full p-2 border rounded-md">
                    {annees.map((annee) => (
                      <option
                        key={annee}
                        value={annee}
                        selected={annee === anneeSelectionnee}
                      >
                        {annee}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {secteurSelectionne && (
            <Card>
              <CardHeader>
                <CardTitle>Analyse du secteur : {secteurSelectionne}</CardTitle>
                <CardDescription>
                  Année : {anneeSelectionnee}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-4 mb-8">
                    <TabsTrigger value="financier">Financier</TabsTrigger>
                    <TabsTrigger value="commercial">Commercial</TabsTrigger>
                    <TabsTrigger value="rh">RH</TabsTrigger>
                    <TabsTrigger value="production">Production</TabsTrigger>
                  </TabsList>

                  <TabsContent value="financier">
                    <div className="text-center py-8">
                      {statistiques ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="p-4 border rounded-lg">
                            <div className="text-sm text-gray-500">Chiffre d'affaires moyen</div>
                            <div className="text-2xl font-bold">{statistiques.moyenneChiffreAffaires?.toLocaleString('fr-FR')} €</div>
                          </div>
                          <div className="p-4 border rounded-lg">
                            <div className="text-sm text-gray-500">Marge EBITDA moyenne</div>
                            <div className="text-2xl font-bold">{statistiques.moyenneMargeEbitda?.toFixed(2)} %</div>
                          </div>
                          <div className="p-4 border rounded-lg">
                            <div className="text-sm text-gray-500">Entreprises analysées</div>
                            <div className="text-2xl font-bold">{statistiques.entreprises_count}</div>
                          </div>
                        </div>
                      ) : (
                        <p>Aucune donnée disponible pour ce secteur et cette année.</p>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="commercial">
                    <div className="text-center py-8">
                      <p>Données commerciales à venir</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="rh">
                    <div className="text-center py-8">
                      <p>Données RH à venir</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="production">
                    <div className="text-center py-8">
                      <p>Données de production à venir</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
