import React, { useState, useEffect } from 'react';
import { X, Home, Download, LineChart, BarChart, FileText, Share } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Link } from '@inertiajs/react';

// Type pour les indicateurs - compatible avec AnalyseIndicateurs
interface Indicateur {
  id: string;
  nom: string;
  valeur: number;
  unite?: string;
  categorie: string;
  entite: string;
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
  description?: string;
}

interface IndicateurDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  indicateur: Indicateur;
}

const IndicateurDetailModal: React.FC<IndicateurDetailModalProps> = ({
  isOpen,
  onClose,
  indicateur
}) => {
  const [activeTab, setActiveTab] = useState('details');
  const [isClosing, setIsClosing] = useState(false);
  const [historique, setHistorique] = useState<{date: string, valeur: number}[]>([]);

  // Animation de fermeture
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  // Empêcher le scroll du body quand le modal est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Générer des données d'historique fictives pour la démonstration
  useEffect(() => {
    if (isOpen && indicateur) {
      // Générer des données fictives d'historique pour la démo
      const today = new Date();
      const mockHistorique = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(today.getMonth() - i);

        // Variation aléatoire autour de la valeur actuelle
        const variation = Math.random() * 20 - 10; // entre -10 et +10
        const valeur = Math.max(0, Math.round((indicateur.valeur + variation) * 10) / 10);

        return {
          date: date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }),
          valeur
        };
      }).reverse();

      setHistorique(mockHistorique);
    }
  }, [isOpen, indicateur]);

  // Obtenir le nom de la catégorie
  const getCategoryName = (categoryId: string) => {
    const categories: Record<string, string> = {
      'commercial': 'Indicateurs commerciaux',
      'financier': 'Indicateurs financiers',
      'production': 'Indicateurs de production',
      'rh': 'Indicateurs RH'
    };
    return categories[categoryId] || categoryId;
  };

  // Couleur basée sur la tendance
  const getTendanceColor = (tendance?: string) => {
    switch (tendance) {
      case 'hausse': return 'text-green-600';
      case 'baisse': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  // Symbole basé sur la tendance
  const getTendanceSymbol = (tendance?: string) => {
    switch (tendance) {
      case 'hausse': return '↑';
      case 'baisse': return '↓';
      default: return '→';
    }
  };

  // Exporter les données
  const handleExport = () => {
    // Créer le contenu CSV
    const headers = ['Propriété', 'Valeur'];
    const rows = [
      ['ID', indicateur.id],
      ['Nom', indicateur.nom],
      ['Catégorie', getCategoryName(indicateur.categorie)],
      ['Valeur', `${indicateur.valeur}${indicateur.unite || ''}`],
      ['Tendance', indicateur.tendance || 'stable'],
      ['Entité', indicateur.entite],
      ['Région', indicateur.region || ''],
      ['Province', indicateur.province || ''],
      ['Commune', indicateur.commune || ''],
      ['Type de bénéficiaire', indicateur.typeBeneficiaire || ''],
      ['Genre', indicateur.genre || ''],
      ['Niveau d\'instruction', indicateur.niveauInstruction || '']
    ];

    const csvContent =
      headers.join(',') + '\n' +
      rows.map(row => `"${row[0]}","${row[1]}"`).join('\n');

    // Télécharger
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `indicateur_${indicateur.id}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Partager l'indicateur
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Indicateur: ${indicateur.nom}`,
        text: `Valeur: ${indicateur.valeur}${indicateur.unite || ''} (${indicateur.tendance || 'stable'})`,
        url: window.location.href,
      });
    } else {
      // Fallback pour les navigateurs qui ne supportent pas Web Share API
      alert(`Lien copié: ${window.location.href}`);
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (!isOpen || !indicateur) return null;

  return (
    <div
      className={`fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 transition-opacity duration-300 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={handleClose}
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all duration-300 sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full ${
            isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header avec titre et description */}
          <div className="bg-white px-4 pt-5 pb-4 sm:px-6 border-b">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  {indicateur.nom}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {indicateur.description || `Détail de l'indicateur ${getCategoryName(indicateur.categorie)}`}
                </p>
              </div>
              <button
                type="button"
                className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={handleClose}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Contenu principal avec onglets */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="details" className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  Détails
                </TabsTrigger>
                <TabsTrigger value="historique" className="flex items-center gap-1">
                  <LineChart className="h-4 w-4" />
                  Historique
                </TabsTrigger>
                <TabsTrigger value="graphique" className="flex items-center gap-1">
                  <BarChart className="h-4 w-4" />
                  Graphique
                </TabsTrigger>
              </TabsList>

              {/* Onglet Détails */}
              <TabsContent value="details" className="pt-2">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Propriété
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Valeur
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr className="bg-white hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Catégorie</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getCategoryName(indicateur.categorie)}
                        </td>
                      </tr>
                      <tr className="bg-gray-50 hover:bg-gray-100">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Valeur</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className="text-gray-500">
                            {indicateur.valeur}{indicateur.unite || ''}
                          </span>
                          <span className={`ml-2 ${getTendanceColor(indicateur.tendance)}`}>
                            {getTendanceSymbol(indicateur.tendance)} {indicateur.tendance || 'stable'}
                          </span>
                        </td>
                      </tr>
                      <tr className="bg-white hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Entité</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{indicateur.entite}</td>
                      </tr>
                      {indicateur.region && (
                        <tr className="bg-gray-50 hover:bg-gray-100">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Région</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{indicateur.region}</td>
                        </tr>
                      )}
                      {indicateur.province && (
                        <tr className="bg-white hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Province</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{indicateur.province}</td>
                        </tr>
                      )}
                      {indicateur.commune && (
                        <tr className="bg-gray-50 hover:bg-gray-100">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Commune</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{indicateur.commune}</td>
                        </tr>
                      )}
                      {indicateur.typeBeneficiaire && (
                        <tr className="bg-white hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Type de bénéficiaire</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{indicateur.typeBeneficiaire}</td>
                        </tr>
                      )}
                      {indicateur.genre && (
                       <tr className="bg-gray-50 hover:bg-gray-100">
                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Genre</td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{indicateur.genre}</td>
                     </tr>
                   )}
                   {indicateur.handicap !== undefined && (
                     <tr className="bg-white hover:bg-gray-50">
                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Situation de handicap</td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                         {indicateur.handicap ? 'Oui' : 'Non'}
                       </td>
                     </tr>
                   )}
                   {indicateur.niveauInstruction && (
                     <tr className="bg-gray-50 hover:bg-gray-100">
                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Niveau d'instruction</td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{indicateur.niveauInstruction}</td>
                     </tr>
                   )}
                   {indicateur.typeActivite && (
                     <tr className="bg-white hover:bg-gray-50">
                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Type d'activité</td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{indicateur.typeActivite}</td>
                     </tr>
                   )}
                 </tbody>
               </table>
             </div>
           </TabsContent>

           {/* Onglet Historique */}
           <TabsContent value="historique" className="pt-2">
             {historique.length > 0 ? (
               <div className="overflow-x-auto">
                 <table className="min-w-full divide-y divide-gray-200">
                   <thead className="bg-gray-50">
                     <tr>
                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                         Période
                       </th>
                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                         Valeur
                       </th>
                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                         Variation
                       </th>
                     </tr>
                   </thead>
                   <tbody className="bg-white divide-y divide-gray-200">
                     {historique.map((entry, index) => {
                       // Calculer la variation
                       const previousValue = index > 0 ? historique[index - 1].valeur : entry.valeur;
                       const variation = entry.valeur - previousValue;
                       const variationPercent = previousValue !== 0
                         ? (variation / previousValue) * 100
                         : 0;

                       // Déterminer la classe de couleur
                       const variationClass = variation > 0
                         ? 'text-green-600'
                         : variation < 0
                           ? 'text-red-600'
                           : 'text-gray-600';

                       return (
                         <tr key={entry.date} className={index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}>
                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                             {entry.date}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                             {entry.valeur}{indicateur.unite || ''}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm">
                             {index > 0 && (
                               <span className={variationClass}>
                                 {variation > 0 ? '+' : ''}{variation.toFixed(1)}{indicateur.unite || ''}
                                 ({variation > 0 ? '+' : ''}{variationPercent.toFixed(1)}%)
                               </span>
                             )}
                           </td>
                         </tr>
                       );
                     })}
                   </tbody>
                 </table>
               </div>
             ) : (
               <div className="py-8 text-center text-gray-500">
                 Aucun historique disponible pour cet indicateur.
               </div>
             )}
           </TabsContent>

           {/* Onglet Graphique */}
           <TabsContent value="graphique" className="pt-2">
             {historique.length > 0 ? (
               <div className="h-80 w-full">
                 {/* Simulation d'un graphique avec un SVG simple */}
                 <svg width="100%" height="100%" viewBox="0 0 800 300" className="border rounded-lg p-4">
                   {/* Définir l'échelle */}
                   {(() => {
                     const values = historique.map(h => h.valeur);
                     const minValue = Math.min(...values) * 0.9;
                     const maxValue = Math.max(...values) * 1.1;
                     const valueRange = maxValue - minValue;

                     const width = 700;
                     const height = 250;
                     const paddingLeft = 50;
                     const paddingBottom = 30;

                     // Fonction pour convertir les données en coordonnées SVG
                     const getX = (index: number) =>
                       paddingLeft + (index * (width / (historique.length - 1)));
                     const getY = (value: number) =>
                       height - paddingBottom - ((value - minValue) / valueRange) * (height - paddingBottom);

                     return (
                       <>
                         {/* Axe Y */}
                         <line
                           x1={paddingLeft}
                           y1={20}
                           x2={paddingLeft}
                           y2={height}
                           stroke="#E5E7EB"
                           strokeWidth="1"
                         />

                         {/* Axe X */}
                         <line
                           x1={paddingLeft}
                           y1={height - paddingBottom}
                           x2={width + paddingLeft}
                           y2={height - paddingBottom}
                           stroke="#E5E7EB"
                           strokeWidth="1"
                         />

                         {/* Graduations Y */}
                         {[0, 0.25, 0.5, 0.75, 1].map(fraction => {
                           const value = minValue + valueRange * fraction;
                           const y = getY(value);
                           return (
                             <g key={`y-${fraction}`}>
                               <line
                                 x1={paddingLeft - 5}
                                 y1={y}
                                 x2={paddingLeft}
                                 y2={y}
                                 stroke="#9CA3AF"
                                 strokeWidth="1"
                               />
                               <text
                                 x={paddingLeft - 10}
                                 y={y + 4}
                                 textAnchor="end"
                                 fontSize="12"
                                 fill="#6B7280"
                               >
                                 {Math.round(value)}
                               </text>
                               <line
                                 x1={paddingLeft}
                                 y1={y}
                                 x2={width + paddingLeft}
                                 y2={y}
                                 stroke="#E5E7EB"
                                 strokeWidth="1"
                                 strokeDasharray="4"
                               />
                             </g>
                           );
                         })}

                         {/* Étiquettes X */}
                         {historique.map((entry, index) => (
                           <text
                             key={`x-${index}`}
                             x={getX(index)}
                             y={height - 10}
                             textAnchor="middle"
                             fontSize="12"
                             fill="#6B7280"
                           >
                             {entry.date}
                           </text>
                         ))}

                         {/* Ligne principale et points */}
                         <polyline
                           points={historique.map((entry, index) =>
                             `${getX(index)},${getY(entry.valeur)}`
                           ).join(' ')}
                           fill="none"
                           stroke="#3B82F6"
                           strokeWidth="2"
                         />

                         {historique.map((entry, index) => (
                           <circle
                             key={`point-${index}`}
                             cx={getX(index)}
                             cy={getY(entry.valeur)}
                             r="4"
                             fill="white"
                             stroke="#3B82F6"
                             strokeWidth="2"
                           />
                         ))}

                         {/* Étiquettes de valeur */}
                         {historique.map((entry, index) => (
                           <text
                             key={`value-${index}`}
                             x={getX(index)}
                             y={getY(entry.valeur) - 10}
                             textAnchor="middle"
                             fontSize="12"
                             fontWeight="bold"
                             fill="#3B82F6"
                           >
                             {entry.valeur}
                           </text>
                         ))}
                       </>
                     );
                   })()}
                 </svg>
               </div>
             ) : (
               <div className="py-8 text-center text-gray-500">
                 Pas de données disponibles pour afficher un graphique.
               </div>
             )}
           </TabsContent>
         </Tabs>
       </div>

       {/* Footer avec boutons */}
       <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
         <button
           type="button"
           className="w-full sm:w-auto sm:ml-2 inline-flex justify-center rounded-md border border-transparent px-4 py-2 bg-blue-600 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
           onClick={handleClose}
         >
           Fermer
         </button>

         <button
           type="button"
           className="mt-3 sm:mt-0 sm:ml-2 w-full sm:w-auto inline-flex justify-center items-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
           onClick={handleExport}
         >
           <Download className="mr-2 h-4 w-4" />
           Exporter
         </button>

         <button
           type="button"
           className="mt-3 sm:mt-0 sm:ml-2 w-full sm:w-auto inline-flex justify-center items-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
           onClick={handleShare}
         >
           <Share className="mr-2 h-4 w-4" />
           Partager
         </button>

         <Link
           href={route('dashboard')}
           className="mt-3 sm:mt-0 w-full sm:w-auto inline-flex justify-center items-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
         >
           <Home className="mr-2 h-4 w-4" />
           Accueil
         </Link>
       </div>
     </div>
   </div>
 </div>
);
};

export default IndicateurDetailModal;
