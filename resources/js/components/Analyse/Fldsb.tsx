import React, { useState } from 'react';
import { Filter, ChevronDown, RefreshCw } from 'lucide-react';

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

interface Option {
  value: string;
  label: string;
}

interface FiltresDisponibles {
  periodicites: Option[];
  categories: Option[];
}

interface FiltreDashboardProps {
  exercices: Exercice[];
  periodes: Periode[];
  filtres: Filtres;
  filtreExercice: string;
  filtrePeriode: string;
  filtreRegion: string;
  filtreProvince: string;
  filtreCommune: string;
  filtreSecteur: string;
  filtreGenre: string;
  filtrePeriodicite: string;
  filtreCategorie: string;
  filtresDisponibles: FiltresDisponibles;
  setFiltreExercice: (value: string) => void;
  setFiltrePeriode: (value: string) => void;
  setFiltreRegion: (value: string) => void;
  setFiltreProvince: (value: string) => void;
  setFiltreCommune: (value: string) => void;
  setFiltreSecteur: (value: string) => void;
  setFiltreGenre: (value: string) => void;
  setFiltrePeriodicite: (value: string) => void;
  setFiltreCategorie: (value: string) => void;
  reinitialiserFiltres: () => void;
}

const FiltreDashboard = ({
  exercices,
  periodes,
  filtres,
  filtreExercice,
  filtrePeriode,
  filtreRegion,
  filtreProvince,
  filtreCommune,
  filtreSecteur,
  filtreGenre,
  filtrePeriodicite,
  filtreCategorie,
  filtresDisponibles,
  setFiltreExercice,
  setFiltrePeriode,
  setFiltreRegion,
  setFiltreProvince,
  setFiltreCommune,
  setFiltreSecteur,
  setFiltreGenre,
  setFiltrePeriodicite,
  setFiltreCategorie,
  reinitialiserFiltres
}: FiltreDashboardProps) => {
  const [expanded, setExpanded] = useState(false);

  // Compter le nombre de filtres actifs (en excluant l'exercice qui est toujours sélectionné)
  const filtresActifs = [
    filtrePeriode !== 'all',
    filtreRegion !== 'all',
    filtreProvince !== 'all',
    filtreCommune !== 'all',
    filtreSecteur !== 'all',
    filtreGenre !== 'all',
    filtrePeriodicite !== 'all',
    filtreCategorie !== 'all'
  ].filter(Boolean).length;

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
      {/* En-tête des filtres */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2 sm:mb-0 flex items-center">
          <Filter className="h-5 w-5 mr-2" />
          Filtres
        </h2>
        {filtresActifs > 0 && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {filtresActifs} {filtresActifs === 1 ? 'filtre actif' : 'filtres actifs'}
          </span>
        )}
      </div>

      {/* Filtres toujours visibles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {/* Exercice */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Exercice</label>
          <select
            value={filtreExercice}
            onChange={(e) => setFiltreExercice(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
          >
            {exercices.map((ex) => (
              <option key={ex.id} value={ex.id.toString()}>
                {ex.annee} {ex.actif ? '(Actif)' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Période */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Période</label>
          <select
            value={filtrePeriode}
            onChange={(e) => setFiltrePeriode(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
            disabled={periodes.filter(p => p.exercice_id.toString() === filtreExercice).length === 0}
          >
            <option value="all">Toutes les périodes</option>
            {periodes
              .filter(p => p.exercice_id.toString() === filtreExercice)
              .map((p) => (
                <option key={p.id} value={p.id.toString()}>{p.nom}</option>
              ))
            }
          </select>
        </div>

        {/* Périodicité */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Périodicité</label>
          <select
            value={filtrePeriodicite}
            onChange={(e) => {
              setFiltrePeriodicite(e.target.value);
              setFiltreCategorie('all'); // Réinitialiser la catégorie quand on change la périodicité
            }}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
          >
            <option value="all">Toutes les périodicités</option>
            {filtresDisponibles.periodicites.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Second niveau de filtres (si périodicité est sélectionnée) */}
      {filtrePeriodicite !== 'all' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {/* Catégorie d'indicateur */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie d'indicateurs</label>
            <select
              value={filtreCategorie}
              onChange={(e) => setFiltreCategorie(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
            >
              <option value="all">Toutes les catégories</option>
              {filtresDisponibles.categories.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* Secteur d'activité */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Secteur d'activité</label>
            <select
              value={filtreSecteur}
              onChange={(e) => setFiltreSecteur(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
            >
              <option value="all">Tous les secteurs</option>
              {filtres.secteursActivite.map((secteur, index) => (
                <option key={index} value={secteur}>{secteur}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Bouton pour afficher/masquer les filtres avancés */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
        >
          {expanded ? 'Masquer les filtres avancés' : 'Afficher plus de filtres'}
          <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>

        {filtresActifs > 0 && (
          <button
            onClick={reinitialiserFiltres}
            className="text-red-600 hover:text-red-800 text-sm flex items-center"
          >
            <RefreshCw className="mr-1 h-4 w-4" />
            Réinitialiser les filtres
          </button>
        )}
      </div>

      {/* Filtres avancés (conditionnels) */}
      {expanded && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          {/* Région */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Région</label>
            <select
              value={filtreRegion}
              onChange={(e) => {
                setFiltreRegion(e.target.value);
                // Réinitialiser les filtres dépendants
                if (e.target.value !== filtreRegion) {
                  setFiltreProvince('all');
                  setFiltreCommune('all');
                }
              }}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
            >
              <option value="all">Toutes les régions</option>
              {filtres.regions.map((region, index) => (
                <option key={index} value={region}>{region}</option>
              ))}
            </select>
          </div>

          {/* Province */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
            <select
              value={filtreProvince}
              onChange={(e) => {
                setFiltreProvince(e.target.value);
                // Réinitialiser la commune si la province change
                if (e.target.value !== filtreProvince) {
                  setFiltreCommune('all');
                }
              }}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
              disabled={filtreRegion === 'all'}
            >
              <option value="all">Toutes les provinces</option>
              {filtres.provinces
                .filter(() => filtreRegion === 'all' || true) // À adapter selon la relation région-province
                .map((province, index) => (
                  <option key={index} value={province}>{province}</option>
                ))
              }
            </select>
          </div>

          {/* Commune */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Commune</label>
            <select
              value={filtreCommune}
              onChange={(e) => setFiltreCommune(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
              disabled={filtreProvince === 'all'}
            >
              <option value="all">Toutes les communes</option>
              {filtres.communes
                .filter(() =>
                  (filtreRegion === 'all' && filtreProvince === 'all') ||
                  true // À adapter selon la relation province-commune
                )
                .map((commune, index) => (
                  <option key={index} value={commune}>{commune}</option>
                ))
              }
            </select>
          </div>

          {/* Genre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
            <select
              value={filtreGenre}
              onChange={(e) => setFiltreGenre(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
            >
              <option value="all">Tous les genres</option>
              {filtres.genres.map((genre, index) => (
                <option key={index} value={genre}>{genre}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default FiltreDashboard;
