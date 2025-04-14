import React, { useState, useEffect } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import { toast } from 'sonner';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  FileTextIcon,
  FilterIcon,
  SearchIcon,
  SlidersIcon,
  XIcon,
  DownloadIcon,
  PrinterIcon,
  MoonIcon,
  SunIcon
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Method } from 'node_modules/@inertiajs/core/types/types';

// Types
interface Collecte {
  id: number;
  entreprise: {
    id: number;
    nom_entreprise: string;
  };
  exercice: {
    id: number;
    annee: number;
  };
  periode: {
    id: number;
    type_periode: string;
  };
  date_collecte: string;
  type_collecte: string; // 'standard' ou 'brouillon'
  status?: string;
  donnees: Record<string, any>;
  created_at: string;
  selected?: boolean; // Pour la sélection multiple
}

interface Entreprise {
  id: number;
  nom_entreprise: string;
}

interface Exercice {
  id: number;
  annee: number;
}

interface Periode {
  id: number;
  type_periode: string;
}

interface CollectesPageProps {
  collectes: {
    data: Collecte[];
    links: any[];
    from: number;
    to: number;
    total: number;
  };
  entreprises: Entreprise[];
  exercices: Exercice[];
  periodes: Periode[];
  filters?: Record<string, any>;
  auth: any;
}

const formatDate = (dateString) => {
  if (!dateString) return '';

  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};

const CollectesIndex = ({ collectes, entreprises, exercices, periodes, filters = {} }) => {
  // État pour la gestion des filtres, recherche et sélection
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [selectedCollectes, setSelectedCollectes] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    entreprise_id: filters.entreprise_id || '',
    exercice_id: filters.exercice_id || '',
    periode_id: filters.periode_id || '',
    type_collecte: filters.type_collecte || ''
  });
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    entreprise: true,
    exercice: true,
    periode: true,
    date: true,
    status: true,
    actions: true
  });

  // État pour le mode sombre
  const [darkMode, setDarkMode] = useState(() => {
    // Récupérer la préférence de l'utilisateur depuis localStorage ou utiliser la préférence du système
    const savedMode = localStorage.getItem('darkMode');
    return savedMode !== null ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Sauvegarder la préférence de mode sombre
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    // Appliquer ou supprimer la classe dark sur le document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Basculer le mode sombre
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Fonction pour appliquer les filtres
  const applyFilters = () => {
    const queryParams = { ...activeFilters };
    if (searchTerm) queryParams.search = searchTerm;

    // Supprimer les filtres vides
    Object.keys(queryParams).forEach(key => {
      if (!queryParams[key]) delete queryParams[key];
    });

    router.get(route('collectes.index'), queryParams, {
      preserveState: true,
      replace: true
    });
  };

  // Réinitialiser les filtres
  const resetFilters = () => {
    setActiveFilters({
      entreprise_id: '',
      exercice_id: '',
      periode_id: '',
      type_collecte: ''
    });
    setSearchTerm('');
    router.get(route('collectes.index'), {}, {
      preserveState: true,
      replace: true
    });
  };

  // Toggle la sélection d'une collecte
  const toggleSelect = (id: number) => {
    setSelectedCollectes(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Sélectionner toutes les collectes brouillons
  const selectAllDrafts = () => {
    const draftIds = collectes.data
      .filter(c => c.type_collecte === 'brouillon')
      .map(c => c.id);
    setSelectedCollectes(draftIds);
  };

  // Désélectionner toutes les collectes
  const deselectAll = () => {
    setSelectedCollectes([]);
  };

  // Gestion de la suppression
  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (confirmDelete === id) {
      router.delete(route('collectes.destroy', id), {
        onSuccess: () => {
          toast.success('Collecte supprimée avec succès');
          setConfirmDelete(null);
        },
        onError: () => {
          toast.error("Échec de la suppression de la collecte");
          setConfirmDelete(null);
        },
      });
    } else {
      setConfirmDelete(id);
      toast.info("Cliquez à nouveau pour confirmer la suppression");

      setTimeout(() => {
        setConfirmDelete(null);
      }, 3000);
    }
  };

  // Valider les collectes sélectionnées
  const validateSelectedCollectes = () => {
    if (selectedCollectes.length === 0) {
      toast.info("Veuillez sélectionner au moins une collecte à valider");
      return;
    }

    if (!confirm(`Confirmer la validation de ${selectedCollectes.length} collecte(s) ?`)) {
      return;
    }

    setIsProcessing(true);

    router.post(route('collectes.validate-multiple'), { collecte_ids: selectedCollectes }, {
      onSuccess: () => {
        toast.success(`${selectedCollectes.length} collecte(s) validée(s) avec succès`);
        setSelectedCollectes([]);
        setIsProcessing(false);
        // Rafraîchir la page pour montrer les changements
        router.reload();
      },
      onError: () => {
        toast.error("Une erreur est survenue lors de la validation des collectes");
        setIsProcessing(false);
      }
    });
  };

  // Supprimer les collectes sélectionnées
  const deleteSelectedCollectes = () => {
    if (selectedCollectes.length === 0) {
      toast.info("Veuillez sélectionner au moins une collecte à supprimer");
      return;
    }

    if (!confirm(`Confirmer la suppression de ${selectedCollectes.length} collecte(s) ?`)) {
      return;
    }

    setIsProcessing(true);

    // Appel API pour supprimer en masse
    router.post(route('collectes.delete-multiple'), { collecte_ids: selectedCollectes }, {
      onSuccess: () => {
        toast.success(`${selectedCollectes.length} collecte(s) supprimée(s) avec succès`);
        setSelectedCollectes([]);
        setIsProcessing(false);
        router.reload();
      },
      onError: () => {
        toast.error("Une erreur est survenue lors de la suppression des collectes");
        setIsProcessing(false);
      }
    });
  };

  // Exporter les données
  const exportData = (format: 'pdf' | 'excel') => {
    const params = {
      ...activeFilters,
      search: searchTerm,
      collecte_ids: selectedCollectes.length > 0 ? selectedCollectes : undefined,
      format
    };

    // Nettoyer les paramètres vides
    Object.keys(params).forEach(key => {
      if (!params[key]) delete params[key];
    });

    // Redirection vers le endpoint d'export
    window.location.href = route('collectes.export', params);
  };

  // Impression
  const printCollectes = () => {
    // Configuration des colonnes pour l'impression
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error("Impossible d'ouvrir la fenêtre d'impression. Veuillez vérifier vos paramètres de navigateur.");
      return;
    }

    // Créer le contenu HTML pour l'impression
    let printContent = `
      <html>
        <head>
          <title>Liste des collectes</title>
          <style>
            body { font-family: Arial, sans-serif; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .header { text-align: center; margin-bottom: 20px; }
            .draft { color: #d97706; }
            .standard { color: #059669; }
            @media print {
              .no-print { display: none; }
              body { margin: 0; padding: 15px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Liste des collectes</h1>
            <p>Imprimé le ${new Date().toLocaleDateString('fr-FR')}</p>
          </div>
          <table>
            <thead>
              <tr>
                ${visibleColumns.entreprise ? '<th>Entreprise</th>' : ''}
                ${visibleColumns.exercice ? '<th>Exercice</th>' : ''}
                ${visibleColumns.periode ? '<th>Période</th>' : ''}
                ${visibleColumns.date ? '<th>Date collecte</th>' : ''}
                ${visibleColumns.status ? '<th>Statut</th>' : ''}
              </tr>
            </thead>
            <tbody>
    `;

    // Ajouter les lignes du tableau
    const filteredCollectes = selectedCollectes.length > 0
      ? collectes.data.filter(c => selectedCollectes.includes(c.id))
      : collectes.data;

    filteredCollectes.forEach(collecte => {
      printContent += `<tr>
        ${visibleColumns.entreprise ? `<td>${collecte.entreprise.nom_entreprise}</td>` : ''}
        ${visibleColumns.exercice ? `<td>${collecte.exercice.annee}</td>` : ''}
        ${visibleColumns.periode ? `<td>${collecte.periode.type_periode}</td>` : ''}
        ${visibleColumns.date ? `<td>${formatDate(collecte.date_collecte)}</td>` : ''}
        ${visibleColumns.status ? `<td class="${collecte.type_collecte === 'brouillon' ? 'draft' : 'standard'}">${collecte.type_collecte === 'brouillon' ? 'Brouillon' : 'Standard'}</td>` : ''}
      </tr>`;
    });

    printContent += `
            </tbody>
          </table>
          <div class="no-print" style="margin-top: 20px; text-align: center;">
            <button onclick="window.print()">Imprimer</button>
            <button onclick="window.close()">Fermer</button>
          </div>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
  };

  // Détermination du nombre de brouillons sélectionnés/disponibles
  const totalDrafts = collectes.data.filter(c => c.type_collecte === 'brouillon').length;
  const selectedDrafts = selectedCollectes.length > 0 ?
    collectes.data.filter(c => selectedCollectes.includes(c.id) && c.type_collecte === 'brouillon').length : 0;

  return (
    <AppLayout title="Liste des collectes">
      <Head title="Liste des collectes" />

      <div className={`py-12 transition-colors duration-200 ${darkMode ? 'dark' : ''}`}>
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg sm:rounded-xl p-6 transition-colors">
            {/* En-tête et actions principales */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 relative">
              <div>
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Liste des Collectes</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Total: {collectes.total} collecte(s), dont {totalDrafts} brouillon(s)
                </p>
              </div>

              {/* Bouton de basculement du mode sombre */}
              <button
                onClick={toggleDarkMode}
                className="absolute right-0 top-0 p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label={darkMode ? "Activer le mode clair" : "Activer le mode sombre"}
              >
                {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
              </button>

              <div className="flex flex-wrap gap-2 mt-8 md:mt-0">
                <Link
                  href={route('collectes.create')}
                  className="inline-flex items-center px-5 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg border-2 border-blue-600 dark:border-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 transition shadow-md"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Nouvelle Collecte
                </Link>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center px-5 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600 transition shadow-md"
                >
                  <FilterIcon className="w-4 h-4 mr-2" />
                  {showFilters ? 'Masquer les filtres' : 'Filtres'}
                </button>

                <div className="relative">
                  <button
                    type="button"
                    className="inline-flex items-center px-5 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600 transition shadow-md"
                    onClick={() => exportData('excel')}
                  >
                    <DownloadIcon className="w-4 h-4 mr-2" />
                    Exporter en Excel
                  </button>
                </div>

                <button
                  onClick={() => exportData('pdf')}
                  className="inline-flex items-center px-5 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600 transition shadow-md"
                >
                  <DownloadIcon className="w-4 h-4 mr-2" />
                  Exporter en PDF
                </button>

                <button
                  onClick={printCollectes}
                  className="inline-flex items-center px-5 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600 transition shadow-md"
                >
                  <PrinterIcon className="w-4 h-4 mr-2" />
                  Imprimer
                </button>
              </div>
            </div>

            {/* Filtres */}
            {showFilters && (
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg mb-6 shadow-inner border-2 border-gray-200 dark:border-gray-600">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-800 dark:text-white">Filtres</h2>
                  <button
                    onClick={resetFilters}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    Réinitialiser
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label htmlFor="entreprise_filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Entreprise
                    </label>
                    <select
                      id="entreprise_filter"
                      className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-md py-3 px-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:border-blue-500 dark:focus:border-blue-400 focus:ring focus:ring-blue-200 dark:focus:ring-blue-700 focus:ring-opacity-50"
                      value={activeFilters.entreprise_id}
                      onChange={(e) => setActiveFilters({...activeFilters, entreprise_id: e.target.value})}
                    >
                      <option value="">Toutes les entreprises</option>
                      {entreprises.map((entreprise) => (
                        <option key={entreprise.id} value={entreprise.id}>
                          {entreprise.nom_entreprise}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="exercice_filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Exercice
                    </label>
                    <select
                      id="exercice_filter"
                      className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-md py-3 px-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:border-blue-500 dark:focus:border-blue-400 focus:ring focus:ring-blue-200 dark:focus:ring-blue-700 focus:ring-opacity-50"
                      value={activeFilters.exercice_id}
                      onChange={(e) => setActiveFilters({...activeFilters, exercice_id: e.target.value})}
                    >
                      <option value="">Tous les exercices</option>
                      {exercices.map((exercice) => (
                        <option key={exercice.id} value={exercice.id}>
                          {exercice.annee}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="periode_filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Période
                    </label>
                    <select
                      id="periode_filter"
                      className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-md py-3 px-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:border-blue-500 dark:focus:border-blue-400 focus:ring focus:ring-blue-200 dark:focus:ring-blue-700 focus:ring-opacity-50"
                      value={activeFilters.periode_id}
                      onChange={(e) => setActiveFilters({...activeFilters, periode_id: e.target.value})}
                    >
                      <option value="">Toutes les périodes</option>
                      {periodes.map((periode) => (
                        <option key={periode.id} value={periode.id}>
                          {periode.type_periode}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="type_filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Type
                    </label>
                    <select
                      id="type_filter"
                      className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-md py-3 px-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:border-blue-500 dark:focus:border-blue-400 focus:ring focus:ring-blue-200 dark:focus:ring-blue-700 focus:ring-opacity-50"
                      value={activeFilters.type_collecte}
                      onChange={(e) => setActiveFilters({...activeFilters, type_collecte: e.target.value})}
                    >
                      <option value="">Tous les types</option>
                      <option value="standard">Standard</option>
                      <option value="brouillon">Brouillon</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={applyFilters}
                    className="inline-flex items-center px-5 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg border-2 border-blue-600 dark:border-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 shadow-md"
                  >
                    Appliquer les filtres
                  </button>
                </div>
              </div>
            )}

            {/* Barre de recherche et actions sur la sélection */}
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
              <div className="relative flex-grow max-w-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Rechercher une collecte..."
                  className="pl-10 w-full p-3 border-2 rounded-lg shadow-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                />
              </div>

              {selectedCollectes.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedCollectes.length} collecte(s) sélectionnée(s)
                    {selectedDrafts > 0 && ` (${selectedDrafts} brouillon(s))`}
                  </span>

                  {selectedDrafts > 0 && (
                    <button
                      onClick={validateSelectedCollectes}
                      disabled={isProcessing}
                      className="inline-flex items-center px-4 py-2 bg-green-600 dark:bg-green-500 text-white text-sm rounded-lg border-2 border-green-600 dark:border-green-500 hover:bg-green-700 dark:hover:bg-green-600 disabled:bg-green-300 dark:disabled:bg-green-800 shadow-md"
                    >
                      <CheckCircleIcon className="w-4 h-4 mr-1" />
                      Valider
                    </button>
                  )}

                  <button
                    onClick={deleteSelectedCollectes}
                    disabled={isProcessing}
                    className="inline-flex items-center px-4 py-2 bg-red-600 dark:bg-red-500 text-white text-sm rounded-lg border-2 border-red-600 dark:border-red-500 hover:bg-red-700 dark:hover:bg-red-600 disabled:bg-red-300 dark:disabled:bg-red-800 shadow-md"
                  >
                    <TrashIcon className="w-4 h-4 mr-1" />
                    Supprimer
                  </button>

                  <button
                    onClick={deselectAll}
                    className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600 shadow-md"
                  >
                    <XIcon className="w-4 h-4 mr-1" />
                    Désélectionner
                  </button>
                </div>
              )}

              {selectedCollectes.length === 0 && totalDrafts > 0 && (
                <button
                  onClick={selectAllDrafts}
                  className="inline-flex items-center px-4 py-2 bg-amber-100 dark:bg-amber-800 text-amber-800 dark:text-amber-100 text-sm rounded-lg border-2 border-amber-200 dark:border-amber-700 hover:bg-amber-200 dark:hover:bg-amber-700 shadow-md"
                >
                  <CheckCircleIcon className="w-4 h-4 mr-1" />
                  Sélectionner tous les brouillons ({totalDrafts})
                </button>
              )}

              {/* Bouton pour gérer les colonnes visibles */}
              <div className="relative">
                <button
                  className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600 shadow-md"
                  onClick={() => {
                    // Toggle dialog pour gérer les colonnes
                  }}
                >
                  <SlidersIcon className="w-4 h-4 mr-1" />
                  Colonnes
                </button>
              </div>
            </div>

            {/* Tableau des collectes */}
            {collectes.data.length > 0 ? (
              <div className="overflow-x-auto rounded-lg border-2 border-gray-200 dark:border-gray-700 shadow-lg">
                <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-600">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="w-10 px-2 py-3">
                        <input
                          type="checkbox"
                          className="rounded-md border-2 border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-500 shadow-sm focus:border-blue-300 dark:focus:border-blue-500 focus:ring focus:ring-blue-200 dark:focus:ring-blue-700 focus:ring-opacity-50"
                          checked={selectedCollectes.length > 0 && selectedCollectes.length === collectes.data.length}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCollectes(collectes.data.map(c => c.id));
                            } else {
                              setSelectedCollectes([]);
                            }
                          }}
                        />
                      </th>
                      {visibleColumns.entreprise && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Entreprise</th>
                      )}
                      {visibleColumns.exercice && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Exercice</th>
                      )}
                      {visibleColumns.periode && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Période</th>
                      )}
                      {visibleColumns.date && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Date Collecte</th>
                      )}
                      {visibleColumns.status && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Statut</th>
                      )}
                      {visibleColumns.actions && (
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {collectes.data.map((collecte) => (
                      <tr
                        key={collecte.id}
                        className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 ${
                          selectedCollectes.includes(collecte.id) ? 'bg-blue-50 dark:bg-blue-900/30' : ''
                        }`}
                      >
                        <td className="px-2 py-4">
                          <input
                            type="checkbox"
                            className="rounded-md border-2 border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-500 shadow-sm focus:border-blue-300 dark:focus:border-blue-500 focus:ring focus:ring-blue-200 dark:focus:ring-blue-700 focus:ring-opacity-50"
                            checked={selectedCollectes.includes(collecte.id)}
                            onChange={() => toggleSelect(collecte.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </td>
                        {visibleColumns.entreprise && (
                          <td
                            className="px-6 py-4 cursor-pointer text-gray-900 dark:text-gray-200"
                            onClick={() => router.visit(route('collectes.show', collecte.id))}
                          >
                            {collecte.entreprise.nom_entreprise}
                          </td>
                        )}
                        {visibleColumns.exercice && (
                          <td
                            className="px-6 py-4 cursor-pointer text-gray-900 dark:text-gray-200"
                            onClick={() => router.visit(route('collectes.show', collecte.id))}
                          >
                            {collecte.exercice.annee}
                          </td>
                        )}
                        {visibleColumns.periode && (
                          <td
                            className="px-6 py-4 cursor-pointer text-gray-900 dark:text-gray-200"
                            onClick={() => router.visit(route('collectes.show', collecte.id))}
                          >
                            {collecte.periode.type_periode}
                          </td>
                        )}
                        {visibleColumns.date && (
                          <td
                            className="px-6 py-4 cursor-pointer text-gray-900 dark:text-gray-200"
                            onClick={() => router.visit(route('collectes.show', collecte.id))}
                          >
                            {formatDate(collecte.date_collecte)}
                          </td>
                        )}
                        {visibleColumns.status && (
                          <td
                            className="px-6 py-4 cursor-pointer"
                            onClick={() => router.visit(route('collectes.show', collecte.id))}
                          >
                            {collecte.type_collecte === 'brouillon' ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200">
                                Brouillon
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                                Standard
                              </span>
                            )}
                          </td>
                        )}
                        {visibleColumns.actions && (
                          <td className="px-6 py-4 text-right space-x-2">
                            <div className="flex space-x-2 justify-end" onClick={e => e.stopPropagation()}>
                              <Link
                                href={route('collectes.show', collecte.id)}
                                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                title="Voir"
                              >
                                <FileTextIcon className="w-5 h-5" />
                              </Link>

                              {/* Modifier - visible pour tous */}
                              <Link
                                href={route('collectes.edit', collecte.id)}
                                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                                title="Modifier"
                              >
                                <PencilIcon className="w-5 h-5" />
                              </Link>

                              {/* Convertir - visible uniquement pour les brouillons */}
                              {collecte.type_collecte === 'brouillon' && (
                                <Link
                                  href={route('collectes.edit', collecte.id)}
                                  className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
                                  title="Convertir en standard"
                                >
                                  <CheckCircleIcon className="w-5 h-5" />
                                </Link>
                              )}

                              {/* Supprimer - visible pour tous */}
                              <button
                                onClick={(e) => handleDelete(collecte.id, e)}
                                className={`${
                                  confirmDelete === collecte.id
                                   ? 'text-red-600 dark:text-red-400'
                                   : 'text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400'
                                }`}
                                title={confirmDelete === collecte.id ? "Confirmer la suppression" : "Supprimer"}
                              >
                                <TrashIcon className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <FileTextIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Aucune collecte trouvée</h3>
                <p className="mt-1 text-gray-500 dark:text-gray-400">
                  {searchTerm || Object.values(activeFilters).some(v => v)
                    ? "Aucun résultat ne correspond à vos critères de recherche."
                    : "Commencez par créer une nouvelle collecte."}
                </p>
                {(searchTerm || Object.values(activeFilters).some(v => v)) && (
                  <button
                    onClick={resetFilters}
                    className="mt-4 inline-flex items-center px-5 py-3 border-2 border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600"
                  >
                    Réinitialiser les filtres
                  </button>
                )}
              </div>
            )}

            {/* Pagination */}
            {collectes.links && collectes.links.length > 3 && (
              <div className="mt-6">
                <nav className="flex items-center justify-between">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    Affichage <span className="font-medium">{collectes.from}</span> à{' '}
                    <span className="font-medium">{collectes.to}</span> sur{' '}
                    <span className="font-medium">{collectes.total}</span> résultats
                  </div>
                  <div className="flex-1 flex justify-end space-x-2">
                    {collectes.links.map((link: { url: string | { url: string; method: Method; }; active: any; label: any; }, index: React.Key | null | undefined) => (
                      link.url && (
                        <Link
                          key={index}
                          href={link.url}
                          className={`relative inline-flex items-center px-4 py-2 border-2 text-sm font-medium rounded-lg ${
                            link.active
                              ? 'bg-blue-50 dark:bg-blue-900 border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-300'
                              : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                          dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                      )
                    ))}
                  </div>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default CollectesIndex;
