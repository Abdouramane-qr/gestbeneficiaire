// resources/js/Pages/Analyses/Tendances.tsx
//import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface TendancesProps extends PageProps {
  entreprises?: any[];
  entrepriseId?: number;
  indicateursDisponibles?: Record<string, string>;
  indicateurSelectionne?: string;
  donneesTendance?: any;
}

export default function Tendances({
 // auth,
  entreprises,
  entrepriseId,
  indicateursDisponibles,
  indicateurSelectionne,
  donneesTendance
}: TendancesProps) {
  return (
    <div className="p-6">
      <Head title="Analyse de tendances" />

      <h1 className="text-2xl font-bold mb-6">Analyse de tendances sur plusieurs années</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Sélection des paramètres</CardTitle>
          <CardDescription>
            Sélectionnez une entreprise et un indicateur pour visualiser son évolution
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Entreprise</label>
              <select className="w-full p-2 border rounded-md">
                <option value="">Sélectionnez une entreprise</option>
                {entreprises?.map((entreprise) => (
                  <option
                    key={entreprise.id}
                    value={entreprise.id}
                    selected={entreprise.id === entrepriseId}
                  >
                    {entreprise.nom}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Indicateur</label>
              <select className="w-full p-2 border rounded-md">
                <option value="">Sélectionnez un indicateur</option>
                {indicateursDisponibles && Object.entries(indicateursDisponibles).map(([key, label]) => (
                  <option
                    key={key}
                    value={key}
                    selected={key === indicateurSelectionne}
                  >
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {entrepriseId && indicateurSelectionne && donneesTendance?.graphique && (
        <Card>
          <CardHeader>
            <CardTitle>Évolution de l'indicateur</CardTitle>
            <CardDescription>
              {indicateursDisponibles?.[indicateurSelectionne]} - {entreprises?.find(e => e.id === entrepriseId)?.nom}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={donneesTendance.graphique}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="annee" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="valeur" fill="#8884d8" name={indicateursDisponibles?.[indicateurSelectionne]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {donneesTendance.statistiques && (
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-gray-500">Variation globale</div>
                  <div className="text-2xl font-bold">
                    {donneesTendance.statistiques.variationGlobale?.toFixed(2)} %
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-gray-500">TCAM</div>
                  <div className="text-2xl font-bold">
                    {donneesTendance.statistiques.tcam?.toFixed(2)} %
                  </div>
                  <div className="text-xs text-gray-500">Taux de croissance annuel moyen</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-gray-500">Valeur moyenne</div>
                  <div className="text-2xl font-bold">
                    {donneesTendance.statistiques.moyenne?.toFixed(2)}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
