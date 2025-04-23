
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  DollarSign,
  ShoppingBag,
  Users,
  Briefcase,
  TrendingUp,
  BarChart4,
  PieChart,
  Search,
  Filter,
  X,
  Download,
  RefreshCw
} from 'lucide-react';
import CardMetrique from '@/components/Analyse/cmd';
import IndicateursList from './IndicateursList';
import IndicateurDetailModal from './IndicateurDetailModal';

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
  description?: string;
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
interface AnalyseProps {
  exerciceActif: Exercice;
  exercices: Exercice[];
  periodes: Periode[];
  filtres: Filtres;
  availablePeriodes: Periode[];
  availableCategories: { [key: number]: string[] };
}

const AnalyseIndicateurs = ({
  exerciceActif,
  exercices,
  periodes,
  filtres,
  availablePeriodes,
  availableCategories
}: AnalyseProps) => {
  const [filtreExercice, setFiltreExercice] = useState<string>(exerciceActif?.id?.toString() || '');
  const [filtrePeriode, setFiltrePeriode] = useState<string>('all');
  const [filtreRegion, setFiltreRegion] = useState<string>('all');
  const [filtreProvince, setFiltreProvince] = useState<string>('all');
  const [filtreCommune, setFiltreCommune] = useState<string>('all');
  const [filtreSecteur, setFiltreSecteur] = useState<string>('all');
  const [filtreGenre, setFiltreGenre] = useState<string>('all');
  const [filtreCategorie, setFiltreCategorie] = useState<string>('all');
  const [recherche, setRecherche] = useState<string>('');

  // États pour les données et l'UI
  const [donnees, setDonnees] = useState<Indicateur[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [indicateurSelectionne, setIndicateurSelectionne] = useState<Indicateur | null>(null);
  const [modalOuvert, setModalOuvert] = useState<boolean>(false);
  const [vueActuelle, setVueActuelle] = useState<'liste' | 'cartes'>('liste');

  // Chargement des données
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(route('analyse.indicateurs.donnees'), {
          params: {
            exercice_id: filtreExercice,
            periode_id: filtrePeriode !== 'all' ? filtrePeriode : null,
            region: filtreRegion !== 'all' ? filtreRegion : null,
            province: filtreProvince !== 'all' ? filtreProvince : null,
            commune: filtreCommune !== 'all' ? filtreCommune : null,
            secteur_activite: filtreSecteur !== 'all' ? filtreSecteur : null,
            genre: filtreGenre !== 'all' ? filtreGenre : null,
            categorie: filtreCategorie !== 'all' ? filtreCategorie : null
          }
        });
        setDonnees(response.data.donnees || []);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setError('Impossible de charger les données. Veuillez réessayer plus tard.');
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
    filtreCategorie
  ]);

  // Préparation des données pour les métriques clés
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

  // Grouper les indicateurs par catégorie
  const indicateursParCategorie = useMemo(() => {
    const categories = new Map();

    donnees.forEach(ind => {
      if (!categories.has(ind.categorie)) {
        categories.set(ind.categorie, []);
      }
      categories.get(ind.categorie).push(ind);
    });

    return Array.from(categories.entries()).map(([categorie, indicateurs]) => ({
      categorie,
      indicateurs
    }));
  }, [donnees]);

  // Filtrer les indicateurs par la recherche
  const indicateursFiltres = useMemo(() => {
    if (!recherche.trim()) return indicateursParCategorie;

    return indicateursParCategorie.map(groupe => ({
      categorie: groupe.categorie,
      indicateurs: groupe.indicateurs.filter((ind: Indicateur) =>
        ind.nom.toLowerCase().includes(recherche.toLowerCase()) ||
        ind.entreprise_nom.toLowerCase().includes(recherche.toLowerCase()) ||
        (ind.region && ind.region.toLowerCase().includes(recherche.toLowerCase()))
      )
    })).filter(groupe => groupe.indicateurs.length > 0);
  }, [indicateursParCategorie, recherche]);

  // Ouvrir le modal de détail d'un indicateur
  const ouvrirDetailIndicateur = (indicateur: Indicateur) => {
    setIndicateurSelectionne(indicateur);
    setModalOuvert(true);
  };

  // Reinitialiser les filtres
  const reinitialiserFiltres = () => {
    setFiltreExercice(exerciceActif?.id?.toString() || '');
    setFiltrePeriode('all');
    setFiltreRegion('all');
    setFiltreProvince('all');
    setFiltreCommune('all');
    setFiltreSecteur('all');
    setFiltreGenre('all');
    setFiltreCategorie('all');
    setRecherche('');
  };

  // Obtenir l'icône pour une catégorie
  const getIconeCategorie = (categorie: string) => {
    const categoriesIcones: Record<string, React.ReactNode> = {
      'Indicateurs commerciaux': <ShoppingBag />,
      'Indicateurs financiers': <DollarSign />,
      'Indicateurs RH': <Users />,
      'Indicateurs de performance': <TrendingUp />,
      'Indicateurs de production': <BarChart4 />,
      'Indicateurs de rentabilité': <PieChart />
    };

    // Recherche partielle pour les catégories qui contiennent les mots-clés
    for (const [key, icon] of Object.entries(categoriesIcones)) {
      if (categorie.toLowerCase().includes(key.toLowerCase())) {
        return icon;
      }
    }

    return <BarChart4 />; // Icône par défaut
  };

  // Obtenir la couleur pour une catégorie
  const getCouleurCategorie = (categorie: string): 'blue' | 'green' | 'red' | 'orange' | 'purple' | 'indigo' => {
    const categoriesCouleurs: Record<string, 'blue' | 'green' | 'red' | 'orange' | 'purple' | 'indigo'> = {
      'Indicateurs commerciaux': 'blue',
      'Indicateurs financiers': 'green',
      'Indicateurs RH': 'orange',
      'Indicateurs de performance': 'purple',
      'Indicateurs de production': 'indigo',
      'Indicateurs de rentabilité': 'red'
    };

    // Recherche partielle pour les catégories qui contiennent les mots-clés
    for (const [key, couleur] of Object.entries(categoriesCouleurs)) {
      if (categorie.toLowerCase().includes(key.toLowerCase())) {
        return couleur;
      }
    }

    return 'blue'; // Couleur par défaut
  };

  // Exporter toutes les données en CSV
  const exporterToutesLesDonnees = () => {
    // Préparer les en-têtes
    const headers = ['ID', 'Indicateur', 'Catégorie', 'Entreprise', 'Valeur', 'Tendance', 'Région', 'Province', 'Commune', 'Secteur'];

    // Préparer les données
    const data = donnees.map(ind => [
      ind.id,
      ind.nom,
      ind.categorie,
      ind.entreprise_nom,
      ind.valeur,
      ind.tendance || 'stable',
      ind.region || '',
      ind.province || '',
      ind.commune || '',
      ind.secteur_activite || ''
    ]);

    // Générer le CSV
    const csvContent =
      headers.join(',') + '\n' +
      data.map(row => row.join(',')).join('\n');

    // Télécharger
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `analyse_indicateurs_export.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
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
      {/* Filtres et recherche */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="w-full md:w-1/4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Exercice
            </label>
            <select
              value={filtreExercice}
              onChange={(e) => setFiltreExercice(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              {exercices.map((exercice) => (
                <option key={exercice.id} value={exercice.id}>
                  {exercice.annee} {exercice.actif ? '(Actif)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-1/4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Période
            </label>
            <select
              value={filtrePeriode}
              onChange={(e) => setFiltrePeriode(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Toutes les périodes</option>
              {periodes.map((periode) => (
                <option key={periode.id} value={periode.id}>
                  {periode.nom}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-1/4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie
            </label>
            <select
              value={filtreCategorie}
              onChange={(e) => setFiltreCategorie(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Toutes les catégories</option>
              {availableCategories[availablePeriodes[0]?.id]?.map((categorie) => (
                <option key={categorie} value={categorie}>
                  {categorie}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-1/4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Région
            </label>
            <select
              value={filtreRegion}
              onChange={(e) => setFiltreRegion(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Toutes les régions</option>
              {filtres.regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="w-full md:w-1/4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Province
            </label>
            <select
              value={filtreProvince}
              onChange={(e) => setFiltreProvince(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              disabled={filtreRegion === 'all'}
            >
              <option value="all">Toutes les provinces</option>
              {filtres.provinces
                .filter(p => filtreRegion === 'all' || p.startsWith(filtreRegion))
                .map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
            </select>
          </div>

          <div className="w-full md:w-1/4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Commune
            </label>
            <select
              value={filtreCommune}
              onChange={(e) => setFiltreCommune(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              disabled={filtreProvince === 'all'}
            >
              <option value="all">Toutes les communes</option>
              {filtres.communes
                .filter(c => filtreProvince === 'all' || c.startsWith(filtreProvince))
                .map((commune) => (
                  <option key={commune} value={commune}>
                    {commune}
                  </option>
                ))}
            </select>
          </div>

          <div className="w-full md:w-1/4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Secteur d'activité
            </label>
            <select
              value={filtreSecteur}
              onChange={(e) => setFiltreSecteur(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tous les secteurs</option>
              {filtres.secteursActivite.map((secteur) => (
                <option key={secteur} value={secteur}>
                  {secteur}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-1/4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Genre
            </label>
            <select
              value={filtreGenre}
              onChange={(e) => setFiltreGenre(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tous les genres</option>
              {filtres.genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-2/3 relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recherche
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Rechercher un indicateur, une entreprise..."
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
              />
              {recherche && (
                <button
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setRecherche('')}
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </div>

          <div className="w-full md:w-1/3 flex justify-end gap-2">
            <button
              onClick={reinitialiserFiltres}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Réinitialiser
            </button>
            <button
              onClick={exporterToutesLesDonnees}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Exporter
            </button>
            <button
              onClick={() => setVueActuelle(vueActuelle === 'liste' ? 'cartes' : 'liste')}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              {vueActuelle === 'liste' ? (
                <>
                  <BarChart4 className="h-4 w-4" />
                  Vue Cartes
                </>
              ) : (
                <>
                  <Filter className="h-4 w-4" />
                  Vue Liste
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Indicateurs clés */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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

      {/* Vue principale */}
      {vueActuelle === 'liste' ? (
        // Vue liste par catégories
        <div className="space-y-6">
          {indicateursFiltres.length > 0 ? (
            indicateursFiltres.map((groupe) => (
              <IndicateursList
                key={groupe.categorie}
                titre={groupe.categorie}
                icone={getIconeCategorie(groupe.categorie)}
                couleur={getCouleurCategorie(groupe.categorie)}
                indicateurs={groupe.indicateurs as Indicateur[]}
                onIndicateurClick={ouvrirDetailIndicateur}
                filtrerParTendance={true}
              />
            ))
          ) : (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <p className="text-gray-500">
                {recherche ? 'Aucun résultat pour cette recherche.' : 'Aucun indicateur disponible.'}
              </p>
              {recherche && (
                <button
                  onClick={() => setRecherche('')}
                  className="mt-3 px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                >
                  Effacer la recherche
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        // Vue cartes
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {donnees.filter(ind => !recherche ||
            ind.nom.toLowerCase().includes(recherche.toLowerCase()) ||
            ind.entreprise_nom.toLowerCase().includes(recherche.toLowerCase())
          ).map(indicateur => (
            <div
              key={indicateur.id}
              className="bg-white p-5 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => ouvrirDetailIndicateur(indicateur)}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-medium text-lg text-gray-800">{indicateur.nom}</h3>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  indicateur.tendance === 'hausse' ? 'bg-green-100 text-green-800' :
                  indicateur.tendance === 'baisse' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {indicateur.tendance === 'hausse' ? (
                    <>
                      <TrendingUp className="h-3 w-3 inline mr-1" />
                      Hausse
                    </>
                  ) : indicateur.tendance === 'baisse' ? (
                    <>
                      <TrendingUp className="h-3 w-3 inline mr-1 transform rotate-180" />
                      Baisse
                    </>
                  ) : (
                    <>
                      <span className="h-3 w-3 inline-block border-t-2 border-gray-500 mr-1"></span>
                      Stable
                    </>
                  )}
                </div>
              </div>

              <div className="text-2xl font-bold mb-3">
                {new Intl.NumberFormat('fr-FR').format(indicateur.valeur)}
              </div>

              <div className="text-sm text-gray-500 mb-2">
                {indicateur.entreprise_nom}
              </div>

              <div className="flex flex-wrap gap-2">
                {indicateur.categorie && (
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                    {indicateur.categorie}
                  </span>
                )}
                {indicateur.region && (
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                    {indicateur.region}
                  </span>
                )}
                {indicateur.secteur_activite && (
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                    {indicateur.secteur_activite}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de détail d'indicateur */}
      {indicateurSelectionne && (
        <IndicateurDetailModal
          isOpen={modalOuvert}
          onClose={() => setModalOuvert(false)}
          indicateur={indicateurSelectionne}
        />
      )}
    </div>
  );
};

export default AnalyseIndicateurs;
