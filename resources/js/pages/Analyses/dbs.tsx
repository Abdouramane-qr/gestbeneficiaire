import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Briefcase, DollarSign, ShoppingBag, TrendingUp, Users } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { PeriodeName } from '@/Utils/IndicateurCalculator';
import FiltreDashboard from '@/components/Analyse/Fldsb';
import CardMetrique from '@/components/Analyse/cmd';

// Types et interfaces
interface Indicateur {
  id: number;
  indicateur_id: number;
  nom: string;
  valeur: number;
  categorie: string;
  region?: string;
  province?: string;
  commune?: string;
  secteur_activite?: string;
  typeBeneficiaire?: string;
  genre?: string;
  tendance?: 'hausse' | 'baisse' | 'stable';
  entreprise_id: number;
  entreprise_nom: string;
  exercice_id: number;
  periode_id: number;
  date?: string;
}

interface Exercice {
  id: number;
  annee: number;
  actif: boolean;
}

interface Periode {
  id: number;
  nom: string;
  exercice_id: number;
}

interface Filtres {
  regions: string[];
  provinces: string[];
  communes: string[];
  typesBeneficiaires: string[];
  genres: string[];
  secteursActivite: string[];
  handicaps: string[];
  niveauxInstruction: string[];
  descriptionsActivite: string[];
  niveauxDeveloppement: string[];
}

interface DashboardProps {
  exerciceActif: Exercice;
  exercices: Exercice[];
  periodes: Periode[];
  filtres: Filtres;
  availablePeriodes: PeriodeName[];
  availableCategories: Record<PeriodeName, string[]>;
}

// Couleurs pour les graphiques
const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8',
  '#82CA9D', '#FF6B6B', '#6A7FDB', '#61DAFB', '#F28E2B'
];

const Dashboard = ({
  exerciceActif,
  exercices,
  periodes,
  filtres,
  availablePeriodes,
  availableCategories,
}: DashboardProps) => {
  // État des filtres
  const [filtreExercice, setFiltreExercice] = useState<string>(exerciceActif?.id?.toString() || '');
  const [filtrePeriode, setFiltrePeriode] = useState<string>('all');
  const [filtreRegion, setFiltreRegion] = useState<string>('all');
  const [filtreProvince, setFiltreProvince] = useState<string>('all');
  const [filtreCommune, setFiltreCommune] = useState<string>('all');
  const [filtreSecteur, setFiltreSecteur] = useState<string>('all');
  const [filtreGenre, setFiltreGenre] = useState<string>('all');
  const [filtrePeriodicite, setFiltrePeriodicite] = useState<string>('all');
  const [filtreCategorie, setFiltreCategorie] = useState<string>('all');

  // Données
  const [donnees, setDonnees] = useState<Indicateur[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Chargement des données
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(route('analyse.dashboard.donnees'), {
          params: {
            exercice_id: filtreExercice,
            periode_id: filtrePeriode !== 'all' ? filtrePeriode : null,
            region: filtreRegion !== 'all' ? filtreRegion : null,
            province: filtreProvince !== 'all' ? filtreProvince : null,
            commune: filtreCommune !== 'all' ? filtreCommune : null,
            secteur_activite: filtreSecteur !== 'all' ? filtreSecteur : null,
            genre: filtreGenre !== 'all' ? filtreGenre : null,
            periodicite: filtrePeriodicite !== 'all' ? filtrePeriodicite : null,
            categorie: filtreCategorie !== 'all' ? filtreCategorie : null
          }
        });
        setDonnees(response.data.donnees || []);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setError('Impossible de charger les données du tableau de bord. Veuillez réessayer plus tard.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [
    filtreExercice,
    filtrePeriode,
    filtreRegion,
    filtreProvince,
    filtreCommune,
    filtreSecteur,
    filtreGenre,
    filtrePeriodicite,
    filtreCategorie
  ]);

  // Préparation des données pour les indicateurs clés
  const metriques = useMemo(() => {
    if (!donnees.length) return [];

    // Indicateurs commerciaux
    const chiffreAffaires = donnees.find(d => d.nom === "Chiffre d'affaires")?.valeur || 0;

    // Indicateurs financiers
    const resultatNet = donnees.find(d => d.nom === "Résultat net")?.valeur || 0;

    // Indicateurs RH
    const nombreEmployes = donnees.find(d => d.nom === "Nombre d'employés")?.valeur || 0;

    // Indicateurs de performance projet
    const nombrePromoteurs = donnees.find(d => d.nom === "Nombre de promoteurs accompagnés")?.valeur || 0;

    return [
      {
        titre: "Chiffre d'affaires",
        valeur: chiffreAffaires,
        unite: 'FCFA',
        icon: <ShoppingBag />,
        couleur: 'blue',
        tendance: 'hausse'
      },
      {
        titre: "Résultat net",
        valeur: resultatNet,
        unite: 'FCFA',
        icon: <DollarSign />,
        couleur: 'green',
        tendance: 'hausse'
      },
      {
        titre: "Nombre d'employés",
        valeur: nombreEmployes,
        unite: '',
        icon: <Users />,
        couleur: 'orange',
        tendance: 'stable'
      },
      {
        titre: "Promoteurs accompagnés",
        valeur: nombrePromoteurs,
        unite: '',
        icon: <Briefcase />,
        couleur: 'purple',
        tendance: 'hausse'
      }
    ];
  }, [donnees]);

  // Données par secteur d'activité
  const donneesSecteurs = useMemo(() => {
    if (!donnees.length) return [];

    // Regrouper les données par secteur d'activité
    const secteurs = new Map();
    donnees.forEach(item => {
      if (item.secteur_activite) {
        const secteur = item.secteur_activite;
        if (!secteurs.has(secteur)) {
          secteurs.set(secteur, { nom: secteur, count: 0, valeur: 0 });
        }
        const data = secteurs.get(secteur);
        data.count += 1;
        data.valeur += item.valeur || 0;
        secteurs.set(secteur, data);
      }
    });

    return Array.from(secteurs.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5 secteurs
  }, [donnees]);

  // Données par région
  const donneesRegions = useMemo(() => {
    if (!donnees.length) return [];

    // Regrouper les données par région
    const regions = new Map();
    donnees.forEach(item => {
      if (item.region) {
        const region = item.region;
        if (!regions.has(region)) {
          regions.set(region, { nom: region, count: 0, valeur: 0 });
        }
        const data = regions.get(region);
        data.count += 1;
        data.valeur += item.valeur || 0;
        regions.set(region, data);
      }
    });

    return Array.from(regions.values())
      .sort((a, b) => b.valeur - a.valeur);
  }, [donnees]);

  // Données par genre
  const donneesGenre = useMemo(() => {
    if (!donnees.length) return [];

    // Regrouper les données par genre
    const genres = new Map();
    donnees.forEach(item => {
      if (item.genre) {
        const genre = item.genre;
        if (!genres.has(genre)) {
          genres.set(genre, { name: genre, value: 0 });
        }
        const data = genres.get(genre);
        data.value += 1;
        genres.set(genre, data);
      }
    });

    return Array.from(genres.values());
  }, [donnees]);

  // Données par indicateur et catégorie
  const donneesParCategorie = useMemo(() => {
    if (!donnees.length) return [];

    // Regrouper les données par catégorie puis par indicateur
    const categoriesMap = new Map();

    donnees.forEach(item => {
      if (!categoriesMap.has(item.categorie)) {
        categoriesMap.set(item.categorie, new Map());
      }

      const indicateursMap = categoriesMap.get(item.categorie);
      if (!indicateursMap.has(item.nom)) {
        indicateursMap.set(item.nom, {
          nom: item.nom,
          valeurs: [],
          moyenne: 0,
          tendance: item.tendance || 'stable'
        });
      }

      const indicateurData = indicateursMap.get(item.nom);
      indicateurData.valeurs.push(item.valeur);
      indicateursMap.set(item.nom, indicateurData);
    });

    // Calculer les moyennes et déterminer les tendances
    const result: any[] = [];
    categoriesMap.forEach((indicateursMap, categorie) => {
      const indicateurs: {
        nom: string;
        valeurs: number[];
        moyenne: number;
        tendance: 'hausse' | 'baisse' | 'stable';
      }[] = [];
      indicateursMap.forEach((indicateur: { valeurs: any; moyenne: any; tendance: any; nom?: string; }) => {
        // Calculer la moyenne
        const moyenne = indicateur.valeurs.reduce((sum: any, val: any) => sum + val, 0) / indicateur.valeurs.length;
        indicateur.moyenne = moyenne;

        // Déterminer la tendance majoritaire
        if (indicateur.valeurs.length > 1) {
          const tendances = {
            'hausse': 0,
            'baisse': 0,
            'stable': 0
          };

          for (let i = 1; i < indicateur.valeurs.length; i++) {
            const diff = indicateur.valeurs[i] - indicateur.valeurs[i-1];
            if (diff > 0) tendances['hausse']++;
            else if (diff < 0) tendances['baisse']++;
            else tendances['stable']++;
          }

          let maxCount = 0;
          Object.entries(tendances).forEach(([tendance, count]) => {
            if (count > maxCount) {
              maxCount = count;
              indicateur.tendance = tendance as 'hausse' | 'baisse' | 'stable';
            }
          });
        }

        if (indicateur.nom) {
          indicateurs.push(indicateur as {
            nom: string;
            valeurs: number[];
            moyenne: number;
            tendance: 'hausse' | 'baisse' | 'stable';
          });
        }
      });

      result.push({
        categorie,
        indicateurs
      });
    });

    return result;
  }, [donnees]);

  // Tendances des indicateurs dans le temps (si disponible avec date)
  const donneesTendances = useMemo(() => {
    if (!donnees.length) return [];

    // Filtrer les indicateurs qui ont une date
    const indicateursAvecDate = donnees.filter(item => item.date);

    // Si aucune date n'est disponible, renvoyer un tableau vide
    if (indicateursAvecDate.length === 0) return [];

    // Grouper par date et calculer les valeurs moyennes
    const tendances = new Map();

    indicateursAvecDate.forEach(item => {
      if (item.date) {
        const date = new Date(item.date).toISOString().split('T')[0];
        if (!tendances.has(date)) {
          tendances.set(date, { date, valeur: 0, count: 0 });
        }
        const data = tendances.get(date);
        data.valeur += item.valeur || 0;
        data.count += 1;
        tendances.set(date, data);
      }
    });

    // Calculer les moyennes et formater pour le graphique
    return Array.from(tendances.values())
      .map(item => ({
        date: item.date,
        valeur: item.count > 0 ? item.valeur / item.count : 0
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [donnees]);

  // Filtres pour les périodicités disponibles et leurs catégories
  const filtresDisponibles = useMemo(() => {
    const periodicites = availablePeriodes.map(periode => ({
      value: periode,
      label: periode
    }));

    const categories = filtrePeriodicite !== 'all'
      ? availableCategories[filtrePeriodicite as PeriodeName]?.map(cat => ({
          value: cat,
          label: cat
        })) || []
      : [];

    return { periodicites, categories };
  }, [availablePeriodes, availableCategories, filtrePeriodicite]);

  // Réinitialiser les filtres
  function reinitialiserFiltres(): void {
    setFiltreExercice(exerciceActif?.id?.toString() || '');
    setFiltrePeriode('all');
    setFiltreRegion('all');
    setFiltreProvince('all');
    setFiltreCommune('all');
    setFiltreSecteur('all');
    setFiltreGenre('all');
    setFiltrePeriodicite('all');
    setFiltreCategorie('all');
  }

  // Gestion du chargement
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Gestion des erreurs
  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Tableau de bord d'analyse</h1>

      {/* Filtres du tableau de bord */}
      <FiltreDashboard
        exercices={exercices}
        periodes={periodes}
        filtres={filtres}
        filtreExercice={filtreExercice}
        filtrePeriode={filtrePeriode}
        filtreRegion={filtreRegion}
        filtreProvince={filtreProvince}
        filtreCommune={filtreCommune}
        filtreSecteur={filtreSecteur}
        filtreGenre={filtreGenre}
        filtrePeriodicite={filtrePeriodicite}
        filtreCategorie={filtreCategorie}
        filtresDisponibles={filtresDisponibles}
        setFiltreExercice={setFiltreExercice}
        setFiltrePeriode={setFiltrePeriode}
        setFiltreRegion={setFiltreRegion}
        setFiltreProvince={setFiltreProvince}
        setFiltreCommune={setFiltreCommune}
        setFiltreSecteur={setFiltreSecteur}
        setFiltreGenre={setFiltreGenre}
        setFiltrePeriodicite={setFiltrePeriodicite}
        setFiltreCategorie={setFiltreCategorie}
        reinitialiserFiltres={reinitialiserFiltres}
      />

      {/* Indicateurs clés */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {metriques.map((metrique, index) => (
          <CardMetrique
            key={index}
            titre={metrique.titre}
            valeur={metrique.valeur}
            unite={metrique.unite}
            icon={metrique.icon}
            couleur={metrique.couleur as 'blue' | 'green' | 'red' | 'orange' | 'purple' | 'indigo'}
            tendance={metrique.tendance as 'hausse' | 'baisse' | 'stable'}
          />
        ))}
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Répartition par secteur d'activité */}
        <div className="bg-white p-5 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Répartition par secteur d'activité</h2>
          <div className="h-80">
            {donneesSecteurs.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={donneesSecteurs}
                  margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nom" angle={-45} textAnchor="end" height={70} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Nombre d'entreprises" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex justify-center items-center h-full text-gray-500">
                Aucune donnée disponible
              </div>
            )}
          </div>
        </div>

        {/* Répartition par région */}
        <div className="bg-white p-5 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Répartition par région</h2>
          <div className="h-80">
            {donneesRegions.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={donneesRegions}
                  margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="nom" type="category" width={80} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="valeur" name="Valeur" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex justify-center items-center h-full text-gray-500">
                Aucune donnée disponible
              </div>
            )}
          </div>
        </div>

        {/* Répartition par genre */}
        <div className="bg-white p-5 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Répartition par genre</h2>
          <div className="h-80">
            {donneesGenre.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={donneesGenre}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {donneesGenre.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex justify-center items-center h-full text-gray-500">
                Aucune donnée disponible
              </div>
            )}
          </div>
        </div>

        {/* Tendances des indicateurs */}
        <div className="bg-white p-5 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Évolution des indicateurs</h2>
          <div className="h-80">
            {donneesTendances.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={donneesTendances}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="valeur" name="Valeur moyenne" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex justify-center items-center h-full text-gray-500">
                Aucune donnée disponible
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Synthèse des indicateurs par catégorie */}
      <div className="mt-6 bg-white p-5 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Synthèse des indicateurs par catégorie</h2>
        {donneesParCategorie.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Catégorie</th>
                  <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Indicateur</th>
                  <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Valeur moyenne</th>
                  <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tendance</th>
                </tr>
              </thead>
              <tbody>
                {donneesParCategorie.map((categorieData) => {
                  return categorieData.indicateurs.map((indicateur: { nom: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; moyenne: { toLocaleString: (arg0: string, arg1: { maximumFractionDigits: number; }) => string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }; tendance: string; }, indIndex: number) => {
                    return (
                      <tr key={`${categorieData.categorie}-${indicateur.nom}`} className={indIndex === 0 ? 'bg-gray-50' : ''}>
                        {indIndex === 0 && (
                          <td className="px-4 py-2 border-b border-gray-200 bg-white text-sm" rowSpan={categorieData.indicateurs.length}>
                            {categorieData.categorie}
                          </td>
                        )}
                        <td className="px-4 py-2 border-b border-gray-200 bg-white text-sm">{indicateur.nom}</td>
                        <td className="px-4 py-2 border-b border-gray-200 bg-white text-sm">
                          {indicateur.moyenne ? indicateur.moyenne.toLocaleString('fr-FR', { maximumFractionDigits: 2 }) : '-'}
                        </td>
                        <td className="px-4 py-2 border-b border-gray-200 bg-white text-sm">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            indicateur.tendance === 'hausse' ? 'bg-green-100 text-green-800' :
                            indicateur.tendance === 'baisse' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {indicateur.tendance === 'hausse' ? (
                              <>
                                <TrendingUp className="h-3 w-3 mr-1" />
                                Hausse
                              </>
                            ) : indicateur.tendance === 'baisse' ? (
                              <>
                                <TrendingUp className="h-3 w-3 mr-1 transform rotate-180" />
                                Baisse
                              </>
                            ) : (
                              <>
                                <span className="h-3 w-3 mr-1 inline-block border-t-2 border-gray-500"></span>
                                Stable
                              </>
                            )}
                          </span>
                        </td>
                      </tr>
                    );
                  });
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">
            Aucune donnée disponible
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
