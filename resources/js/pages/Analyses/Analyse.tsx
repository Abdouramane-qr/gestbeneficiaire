

import React, { useState } from 'react';
import {
  Activity,
  TrendingUp,
  ShoppingBag,
  Users,
  LineChart,
  MapPin,
  Building2,
  ChevronDown,
  Home,
  Settings
} from 'lucide-react';

// Types et interfaces
interface Indicateur {
  id: string;
  nom: string;
  valeur: number;
  categorie: string;
  region?: string;
  province?: string;
  commune?: string;
  typeBeneficiaire?: string;
  genre?: string;
  handicap?: boolean;
  niveauInstruction?: string;
  typeActivite?: string;
  niveauDeveloppement?: string;
  tendance?: 'hausse' | 'baisse' | 'stable';
}

// Données de mock
const donneesIndicateurs: Indicateur[] = [
  // Indicateurs d'activités
  {
    id: '1',
    nom: 'Taux de réalisation des activités',
    valeur: 85,
    categorie: 'activites_entreprise',
    region: 'Centre',
    province: 'Kadiogo',
    commune: 'Ouagadougou',
    typeBeneficiaire: 'Individuel',
    genre: 'Homme',
    handicap: false,
    niveauInstruction: 'BAC',
    typeActivite: 'Commerce',
    niveauDeveloppement: 'Renforcement',
    tendance: 'hausse'
  },
  {
    id: '2',
    nom: 'Chiffre d\'affaires',
    valeur: 75,
    categorie: 'commerciaux',
    region: 'Hauts-Bassins',
    province: 'Houet',
    commune: 'Bobo-Dioulasso',
    typeBeneficiaire: 'Coopérative',
    genre: 'Femme',
    handicap: false,
    niveauInstruction: 'Universitaire',
    typeActivite: 'Agriculture',
    niveauDeveloppement: 'Création',
    tendance: 'stable'
  }
];

// Catégories d'indicateurs
const categories = [
  {
    id: 'activites_entreprise',
    nom: "Indicateurs d'activités de l'entreprise du promoteur",
    icone: Activity,
    couleur: 'text-blue-600'
  },
  {
    id: 'ratios_rentabilite',
    nom: 'Ratios de Rentabilité et de solvabilité de l\'entreprise',
    icone: TrendingUp,
    couleur: 'text-green-600'
  },
  {
    id: 'rentabilite_promoteur',
    nom: 'Indicateurs de Rentabilité et de solvabilité de l\'entreprise du promoteur',
    icone: Building2,
    couleur: 'text-yellow-600'
  },
  {
    id: 'commerciaux',
    nom: 'Indicateurs commerciaux de l\'entreprise du promoteur',
    icone: ShoppingBag,
    couleur: 'text-purple-600'
  },
  {
    id: 'sociaux_rh',
    nom: 'Indicateurs Sociaux et ressources humaines de l\'entreprise du promoteur',
    icone: Users,
    couleur: 'text-orange-600'
  },
  {
    id: 'performance_projet',
    nom: 'Indicateurs de performance Projet',
    icone: LineChart,
    couleur: 'text-indigo-600'
  }
];

// Filtres
const filtres = {
  regions: ['Centre', 'Hauts-Bassins', 'Nord', 'Sahel', 'Est', 'Centre-Est', 'Centre-Nord', 'Boucle du Mouhoun', 'Centre-Ouest', 'Centre-Sud', 'Plateau Central', 'Sud-Ouest', 'Cascades'],
  provinces: ['Kadiogo', 'Houet', 'Yatenga', 'Soum', 'Gourma', 'Boulgou', 'Namentenga', 'Mouhoun', 'Boulkiemdé', 'Zoundwéogo', 'Ganzourgou', 'Poni', 'Comoé'],
  communes: ['Ouagadougou', 'Bobo-Dioulasso', 'Koudougou', 'Banfora', 'Ouahigouya', 'Dédougou', 'Fada N\'Gourma', 'Tenkodogo', 'Kaya', 'Manga', 'Ziniaré', 'Gaoua', 'Dori'],
  typesBeneficiaires: ['Individuel', 'Coopérative', 'Autre'],
  genres: ['Homme', 'Femme'],
  handicaps: ['Oui', 'Non'],
  niveauxInstruction: ['Analphabète', 'Alphabétisé', 'Primaire', 'CEPE', 'BEPC', 'BAC', 'Universitaire'],
  typesActivite: ['Agriculture', 'Artisanat', 'Commerce', 'Élevage', 'Environnement'],
  niveauxDeveloppement: ['Création', 'Renforcement']
};

// Composant Dropdown personnalisé
function Dropdown({
  label,
  options,
  value,
  onChange,
  icone: Icone
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  icone?: React.ElementType
}) {
  const [estOuvert, setEstOuvert] = useState(false);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {Icone && <Icone className="w-4 h-4 inline mr-1" />}
        {label}
      </label>
      <button
        onClick={() => setEstOuvert(!estOuvert)}
        className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-left text-sm flex items-center justify-between hover:bg-gray-50"
      >
        <span>{value === 'all' ? `Tous${label === 'Région' || label === 'Province' || label === 'Commune' ? 'tes' : ''}` : value}</span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {estOuvert && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
          <div className="max-h-60 overflow-auto py-1">
            <button
              onClick={() => {
                onChange('all');
                setEstOuvert(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                value === 'all' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
              }`}
            >
              Tous{label === 'Région' || label === 'Province' || label === 'Commune' ? 'tes' : ''}
            </button>
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onChange(option);
                  setEstOuvert(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                  value === option ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Composant Sidebar
function BarreLatérale() {
  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Tableau de Bord  Analyse</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a href="/dashboard" className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
            <Home className="w-5 h-5 mr-3" />
            Accueil
          </a>
          <a href="#" className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
            <Settings className="w-5 h-5 mr-3" />
            Paramètres
          </a>
        </nav>
      </div>
    </div>
  );
}

export default function AnalyseIndicateurs() {
  // États pour les filtres
  const [filtreCategorie, setFiltreCategorie] = useState<string>('all');
  const [filtreRegion, setFiltreRegion] = useState<string>('all');
  const [filtreProvince, setFiltreProvince] = useState<string>('all');
  const [filtreCommune, setFiltreCommune] = useState<string>('all');
  const [filtreTypeBeneficiaire, setFiltreTypeBeneficiaire] = useState<string>('all');
  const [filtreGenre, setFiltreGenre] = useState<string>('all');
  const [filtreHandicap, setFiltreHandicap] = useState<string>('all');
  const [filtreNiveauInstruction, setFiltreNiveauInstruction] = useState<string>('all');
  const [filtreTypeActivite, setFiltreTypeActivite] = useState<string>('all');
  const [filtreNiveauDeveloppement, setFiltreNiveauDeveloppement] = useState<string>('all');

  // Filtrage des données
  const donneesFiltrees = donneesIndicateurs.filter(indicateur => {
    const verifierFiltre = (valeurFiltre: string, valeurIndicateur: unknown) =>
      valeurFiltre === 'all' || valeurFiltre === valeurIndicateur;

    return (
      verifierFiltre(filtreCategorie, indicateur.categorie) &&
      verifierFiltre(filtreRegion, indicateur.region) &&
      verifierFiltre(filtreProvince, indicateur.province) &&
      verifierFiltre(filtreCommune, indicateur.commune) &&
      verifierFiltre(filtreTypeBeneficiaire, indicateur.typeBeneficiaire) &&
      verifierFiltre(filtreGenre, indicateur.genre) &&
      verifierFiltre(filtreHandicap, indicateur.handicap ? 'Oui' : 'Non') &&
      verifierFiltre(filtreNiveauInstruction, indicateur.niveauInstruction) &&
      verifierFiltre(filtreTypeActivite, indicateur.typeActivite) &&
      verifierFiltre(filtreNiveauDeveloppement, indicateur.niveauDeveloppement)
    );
  });

  // Fonction pour obtenir la couleur de la tendance
  const obtenirCouleurTendance = (tendance?: 'hausse' | 'baisse' | 'stable') => {
    switch (tendance) {
      case 'hausse': return 'text-green-500';
      case 'baisse': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  // Fonction pour obtenir l'icône de la tendance
  const obtenirIconeTendance = (tendance?: 'hausse' | 'baisse' | 'stable') => {
    switch (tendance) {
      case 'hausse': return '↑';
      case 'baisse': return '↓';
      default: return '→';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <BarreLatérale />
      <div className="flex-1 ml-64">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <MapPin className="h-6 w-6" />
                  Tableau de Bord Analytique
                </h1>
              </div>

              {/* Filtres */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">
                <Dropdown
                  label="Catégorie"
                  options={categories.map(c => c.nom)}
                  value={filtreCategorie === 'all' ? 'all' : categories.find(c => c.id === filtreCategorie)?.nom || ''}
                  onChange={(value) => {
                    const categorie = categories.find(c => c.nom === value);
                    setFiltreCategorie(categorie ? categorie.id : 'all');
                  }}
                  icone={MapPin}
                />

                <Dropdown
                  label="Région"
                  options={filtres.regions}
                  value={filtreRegion}
                  onChange={setFiltreRegion}
                  icone={MapPin}
                />

                <Dropdown
                  label="Province"
                  options={filtres.provinces}
                  value={filtreProvince}
                  onChange={setFiltreProvince}
                  icone={MapPin}
                />

                <Dropdown
                  label="Commune"
                  options={filtres.communes}
                  value={filtreCommune}
                  onChange={setFiltreCommune}
                  icone={MapPin}
                />

                <Dropdown
                  label="Type de bénéficiaire"
                  options={filtres.typesBeneficiaires}
                  value={filtreTypeBeneficiaire}
                  onChange={setFiltreTypeBeneficiaire}
                  icone={Users}
                />

                <Dropdown
                  label="Genre"
                  options={filtres.genres}
                  value={filtreGenre}
                  onChange={setFiltreGenre}
                />

<Dropdown
                  label="Situation de Handicap"
                  options={filtres.handicaps}
                  value={filtreHandicap}
                  onChange={setFiltreHandicap}
                />

                <Dropdown
                  label="Niveau d'instruction"
                  options={filtres.niveauxInstruction}
                  value={filtreNiveauInstruction}
                  onChange={setFiltreNiveauInstruction}
                />

                <Dropdown
                  label="Type d'activité"
                  options={filtres.typesActivite}
                  value={filtreTypeActivite}
                  onChange={setFiltreTypeActivite}
                />

                <Dropdown
                  label="Niveau de développement"
                  options={filtres.niveauxDeveloppement}
                  value={filtreNiveauDeveloppement}
                  onChange={setFiltreNiveauDeveloppement}
                />
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map(categorie => {
              const donneesCategorie = donneesFiltrees.filter(indicateur =>
                indicateur.categorie === categorie.id
              );

              // Si un filtre de catégorie est actif et ne correspond pas, ne pas afficher
              if (filtreCategorie !== 'all' && filtreCategorie !== categorie.id) return null;

              const Icone = categorie.icone;

              return (
                <div
                  key={categorie.id}
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {categorie.nom}
                    </h3>
                    <Icone className={`h-5 w-5 ${categorie.couleur}`} />
                  </div>

                  <div className="space-y-4">
                    {donneesCategorie.length > 0 ? (
                      donneesCategorie.map(indicateur => (
                        <div
                          key={indicateur.id}
                          className="flex justify-between items-center"
                        >
                          <div className="flex flex-col">
                            <span className="text-gray-600 text-sm">
                              {indicateur.nom}
                            </span>
                            <span className="text-xs text-gray-500">
                              {indicateur.region} - {indicateur.commune}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-medium ${obtenirCouleurTendance(indicateur.tendance)}`}
                            >
                              {indicateur.valeur}% {obtenirIconeTendance(indicateur.tendance)}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm italic text-center">
                        Aucun indicateur disponible
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
