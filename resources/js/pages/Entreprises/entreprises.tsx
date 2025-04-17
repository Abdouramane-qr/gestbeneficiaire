import React, { useState, useRef } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { PlusIcon, PencilIcon, TrashIcon, ArrowLeftIcon, PrinterIcon, FileSpreadsheetIcon, FileTextIcon } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import * as XLSX from 'xlsx';
import ShowEntreprise from './show';
import EntrepriseFormModal from '@/components/entrepriseFormModal';
import AppLayout from '@/layouts/app-layout';

// Types (à ajuster selon vos besoins)
interface Beneficiaire {
  id: number;
  nom: string;
  prenom: string;
}

interface ONG {
  id: number;
  nom: string;
  sigle?: string;
}

interface InstitutionFinanciere {
  id: number;
  nom: string;
}

interface Entreprise {
  id: number;
  nom_entreprise: string;
  secteur_activite: string;
  ville: string;
  pays: string;
  date_creation: string;
  beneficiaire?: Beneficiaire | null;
  ong?: ONG | null;
  institutionFinanciere?: InstitutionFinanciere | null;
}

const Entreprises = () => {
  const { 
    entreprises, 
    beneficiaires, 
    ongs, 
    institutionsFinancieres 
  } = usePage().props as unknown as {
    entreprises: Entreprise[];
    beneficiaires: Beneficiaire[];
    ongs: ONG[];
    institutionsFinancieres: InstitutionFinanciere[];
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEntreprise, setCurrentEntreprise] = useState<Entreprise | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [showDetailView, setShowDetailView] = useState(false);
  const [selectedEntreprise, setSelectedEntreprise] = useState<Entreprise | null>(null);

  const tableRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  const openModal = (entreprise: Entreprise | null = null) => {
    setCurrentEntreprise(entreprise);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentEntreprise(null);
  };

  const onSuccess = () => {
    router.get(route('entreprises.index'), {
      onSuccess: () => toast.success("Liste des entreprises mise à jour."),
      onError: () => toast.error("Échec de la mise à jour de la liste des entreprises."),
    });
  };

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();

    if (confirmDelete === id) {
      router.delete(route('entreprises.destroy', id), {
        onSuccess: () => {
          toast.success("Entreprise supprimée avec succès");
          setConfirmDelete(null);
          if (selectedEntreprise && selectedEntreprise.id === id) {
            setShowDetailView(false);
            setSelectedEntreprise(null);
          }
          onSuccess();
        },
        onError: () => toast.error("Échec de la suppression de l'entreprise"),
      });
    } else {
      setConfirmDelete(id);
      toast.info("Cliquez à nouveau pour confirmer la suppression");

      setTimeout(() => {
        if (confirmDelete === id) {
          setConfirmDelete(null);
        }
      }, 3000);
    }
  };

  const handleRowClick = (entreprise: Entreprise) => {
    setSelectedEntreprise(entreprise);
    setShowDetailView(true);
  };

  const filteredEntreprises = entreprises.filter(
    (entreprise) =>
      entreprise.nom_entreprise.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entreprise.secteur_activite.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entreprise.ville.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entreprise.beneficiaire?.nom.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (entreprise.beneficiaire?.prenom.toLowerCase().includes(searchTerm.toLowerCase()) || false)
  );

  // Impression
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error("Impossible d'ouvrir la fenêtre d'impression");
      return;
    }

    const contentToPrint = showDetailView && selectedEntreprise 
      ? detailsRef.current 
      : tableRef.current;

    if (!contentToPrint) {
      toast.error("Contenu à imprimer non trouvé");
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>${showDetailView ? 'Détails Entreprise' : 'Liste des Entreprises'}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .header { text-align: center; margin-bottom: 20px; }
            @media print {
              .no-print { display: none; }
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${showDetailView ? 'Détails de l\'Entreprise' : 'Liste des Entreprises'}</h1>
            <p>Imprimé le ${new Date().toLocaleDateString('fr-FR')}</p>
          </div>
          ${contentToPrint.innerHTML}
          <div class="no-print" style="margin-top: 20px; text-align: center;">
            <button onclick="window.print()">Imprimer</button>
            <button onclick="window.close()">Fermer</button>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
  };

  // Exportation PDF
  const exportToPDF = () => {
    const params = new URLSearchParams({
      format: 'pdf',
      mode: showDetailView ? 'detail' : 'list'
    });

    if (showDetailView && selectedEntreprise) {
      params.append('entreprise_ids[]', selectedEntreprise.id.toString());
    } else {
      filteredEntreprises.forEach(entreprise => {
        params.append('entreprise_ids[]', entreprise.id.toString());
      });
    }

    if (searchTerm) {
      params.append('search', searchTerm);
    }

    window.open(`${route('entreprises.export')}?${params.toString()}`, '_blank');
  };

  // Exportation Excel
  const exportToExcel = () => {
    try {
      const data = showDetailView && selectedEntreprise 
        ? [selectedEntreprise].map(e => ({
            'Nom': e.nom_entreprise,
            'Secteur d\'activité': e.secteur_activite,
            'Ville': e.ville,
            'Pays': e.pays,
            'Date de création': new Date(e.date_creation).toLocaleDateString('fr-FR'),
            'Promoteur': e.beneficiaire 
              ? `${e.beneficiaire.nom} ${e.beneficiaire.prenom}` 
              : 'N/A'
          }))
        : filteredEntreprises.map(e => ({
            'Nom': e.nom_entreprise,
            'Secteur d\'activité': e.secteur_activite,
            'Ville': e.ville,
            'Pays': e.pays,
            'Date de création': new Date(e.date_creation).toLocaleDateString('fr-FR'),
            'Promoteur': e.beneficiaire 
              ? `${e.beneficiaire.nom} ${e.beneficiaire.prenom}` 
              : 'N/A'
          }));

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Entreprises");

      const fileName = showDetailView && selectedEntreprise
        ? `entreprise_${selectedEntreprise.nom_entreprise}.xlsx`
        : 'liste_entreprises.xlsx';

      XLSX.writeFile(workbook, fileName);
      toast.success("Document Excel exporté avec succès");
    } catch (error) {
      console.error("Erreur lors de l'exportation Excel:", error);
      toast.error("Erreur lors de l'exportation Excel");
    }
  };

  // Vue détaillée
  if (showDetailView && selectedEntreprise) {
    return (
      <AppLayout title='Détails de Entreprise'>
        <Head title={`Détails de ${selectedEntreprise.nom_entreprise}`} />
        <Toaster position='top-right' richColors />
        <div className="py-6 sm:py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-4 sm:p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <button
                    onClick={() => setShowDetailView(false)}
                    className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition flex items-center w-full sm:w-auto justify-center sm:justify-start"
                  >
                    <ArrowLeftIcon className="w-4 h-4 mr-2" />
                    Retour à la liste
                  </button>

                  <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
                    <button
                      onClick={handlePrint}
                      className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center"
                    >
                      <PrinterIcon className="w-4 h-4 mr-2" />
                      Imprimer
                    </button>
                    <button
                      onClick={exportToExcel}
                      className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition flex items-center"
                    >
                      <FileSpreadsheetIcon className="w-4 h-4 mr-2" />
                      Excel
                    </button>
                    <button
                      onClick={exportToPDF}
                      className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition flex items-center"
                    >
                      <FileTextIcon className="w-4 h-4 mr-2" />
                      PDF
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
                  <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4 sm:mb-0">
                    Fiche Entreprise
                  </h1>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => openModal(selectedEntreprise)}
                      className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition flex items-center"
                    >
                      <PencilIcon className="w-4 h-4 mr-2" />
                      Modifier
                    </button>
                    <button
                      onClick={(e) => handleDelete(selectedEntreprise.id, e)}
                      className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition flex items-center"
                    >
                      <TrashIcon className="w-4 h-4 mr-2" />
                      Supprimer
                    </button>
                  </div>
                </div>

                <div ref={detailsRef}>
                  <ShowEntreprise entreprise={selectedEntreprise} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <EntrepriseFormModal
          isOpen={isModalOpen}
          closeModal={closeModal}
          entreprise={currentEntreprise}
          onSuccess={onSuccess}
          beneficiaires={beneficiaires}
          ongs={ongs}
          institutionsFinancieres={institutionsFinancieres}
        />
      </AppLayout>
    );
  }

  // Vue liste
  return (
    <AppLayout title="Gestion des Entreprises">
      <Head title="Gestion des Entreprises" />
      <Toaster position='top-right' richColors />
      <div className="py-6 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-4 sm:p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100">
                  Liste des Entreprises
                </h1>

                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => openModal(null)}
                    className="px-3 py-2 bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700 transition w-full sm:w-auto justify-center sm:justify-start"
                  >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Ajouter une Entreprise
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                <div className="w-full sm:w-1/2">
                  <input
                    type="text"
                    placeholder="Rechercher une entreprise..."
                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="flex flex-wrap gap-2 justify-end w-full sm:w-auto">
                  <button
                    onClick={handlePrint}
                    className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center"
                  >
                    <PrinterIcon className="w-4 h-4 mr-2" />
                    Imprimer
                  </button>
                  <button
                    onClick={exportToExcel}
                    className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition flex items-center"
                  >
                    <FileSpreadsheetIcon className="w-4 h-4 mr-2" />
                    Excel
                  </button>
                  <button
                    onClick={exportToPDF}
                    className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition flex items-center"
                  >
                    <FileTextIcon className="w-4 h-4 mr-2" />
                    PDF
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto" ref={tableRef}>
                <table className="min-w-full divide-y divide-gray-400 dark:divide-gray-600">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Nom de l'entreprise
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Secteur d'activité
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Ville
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Promoteur
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Date de création
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredEntreprises.length > 0 ? (
                      filteredEntreprises.map((entreprise) => (
                        <tr
                          key={entreprise.id}
                          onClick={() => handleRowClick(entreprise)}
                          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                        >
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-gray-100">
                              {entreprise.nom_entreprise || 'N/A'}
                            </div>
                          </td>

                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-gray-100">
                              {entreprise.secteur_activite}
                            </div>
                          </td>

                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {entreprise.ville}
                          </td>

                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {entreprise.beneficiaire
                              ? `${entreprise.beneficiaire.nom} ${entreprise.beneficiaire.prenom}`
                              : 'N/A'}
                          </td>

                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {new Date(entreprise.date_creation).toLocaleDateString('fr-FR')}
                          </td>

                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                            <div className="flex space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openModal(entreprise);
                                }}
                                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                              >
                                <PencilIcon className="w-5 h-5" />
                              </button>
                              <button
                                onClick={(e) => handleDelete(entreprise.id, e)}
                                className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                              >
                                <TrashIcon className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-4 sm:px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                          Aucune entreprise trouvée
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EntrepriseFormModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        entreprise={currentEntreprise}
        onSuccess={onSuccess}
        beneficiaires={beneficiaires}
        ongs={ongs}
        institutionsFinancieres={institutionsFinancieres}
      />
    </AppLayout>
  );
};

export default Entreprises;