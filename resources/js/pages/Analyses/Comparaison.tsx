// resources/js/Pages/Analyses/Comparaison.tsx
import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ComparaisonProps extends PageProps {
  entreprises?: any[];
  entreprise1Id?: number;
  entreprise2Id?: number;
  annees?: number[];
  anneeSelectionnee?: number;
  donnees?: any;
}

export default function Comparaison({
  //auth,
  entreprises,
  entreprise1Id,
  entreprise2Id,
  annees,
  anneeSelectionnee,
  donnees
}: ComparaisonProps) {
  const [activeTab, setActiveTab] = useState('financier');

  return (
    <div className="p-6">
      <Head title="Analyse comparative" />

      <h1 className="text-2xl font-bold mb-6">Analyse comparative d'entreprises</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Sélection des entreprises</CardTitle>
          <CardDescription>
            Sélectionnez deux entreprises et une année pour les comparer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Entreprise 1</label>
              <select className="w-full p-2 border rounded-md">
                <option value="">Sélectionnez une entreprise</option>
                {entreprises?.map((entreprise) => (
                  <option
                    key={entreprise.id}
                    value={entreprise.id}
                    selected={entreprise.id === entreprise1Id}
                  >
                    {entreprise.nom}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Entreprise 2</label>
              <select className="w-full p-2 border rounded-md">
                <option value="">Sélectionnez une entreprise</option>
                {entreprises?.map((entreprise) => (
                  <option
                    key={entreprise.id}
                    value={entreprise.id}
                    selected={entreprise.id === entreprise2Id}
                  >
                    {entreprise.nom}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Année</label>
              <select className="w-full p-2 border rounded-md">
                {annees?.map((annee) => (
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

      {entreprise1Id && entreprise2Id && (
        <Card>
          <CardHeader>
            <CardTitle>Comparaison détaillée</CardTitle>
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
                <div className="py-6">
                  {donnees?.financiers ? (
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm font-medium border-b pb-2">
                        <div className="w-1/3">Indicateur</div>
                        <div className="w-1/3 text-center">{donnees.entreprises?.entreprise1?.nom}</div>
                        <div className="w-1/3 text-center">{donnees.entreprises?.entreprise2?.nom}</div>
                      </div>

                      {donnees.financiers.indicateurs.map((indicateur: any) => (
                        <div key={indicateur.champ} className="flex justify-between">
                          <div className="w-1/3">{indicateur.label}</div>
                          <div className="w-1/3 text-center">{indicateur.valeur1}</div>
                          <div className="w-1/3 text-center flex items-center justify-center">
                            {indicateur.valeur2}
                            <span className="ml-2">
                              {indicateur.differenceLabel}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center">Sélectionnez deux entreprises pour voir la comparaison</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="commercial">
                <div className="text-center py-8">
                  <p>Comparaison commerciale à venir</p>
                </div>
              </TabsContent>

              <TabsContent value="rh">
                <div className="text-center py-8">
                  <p>Comparaison RH à venir</p>
                </div>
              </TabsContent>

              <TabsContent value="production">
                <div className="text-center py-8">
                  <p>Comparaison de production à venir</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
