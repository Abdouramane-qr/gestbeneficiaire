<?php

namespace App\Exports;

use App\Models\Collecte;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use Illuminate\Support\Facades\Log;

class IndicateursCategorieSheet implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize, WithTitle
{
    protected $entrepriseId;
    protected $annee;
    protected $periodeType;
    protected $categorie;
    protected $filtres;
    protected $formatNice;

    public function __construct(int $entrepriseId, int $annee, string $periodeType, string $categorie, array $filtres = [], bool $formatNice = true)
    {
        $this->entrepriseId = $entrepriseId;
        $this->annee = $annee;
        $this->periodeType = $periodeType;
        $this->categorie = $categorie;
        $this->filtres = $filtres;
        $this->formatNice = $formatNice;
    }

    public function title(): string
    {
        // Limiter la longueur du titre pour Excel
        $title = substr($this->categorie, 0, 31);
        if (strlen($this->categorie) > 31) {
            $title = substr($title, 0, 28) . '...';
        }
        return $title;
    }

    public function collection()
    {
        // Construction de la requête
        $query = Collecte::with(['entreprise', 'exercice', 'user']);

        // Filtrer par période
        $query->where('periode', 'like', '%' . $this->periodeType . '%');

        // Filtrer par exercice
        if (isset($this->filtres['exercice_id']) && $this->filtres['exercice_id']) {
            $query->where('exercice_id', $this->filtres['exercice_id']);
        }

        // Filtrer par entreprise ou bénéficiaire selon la période
        if ($this->periodeType === 'Occasionnelle') {
            if (isset($this->filtres['beneficiaire_id']) && $this->filtres['beneficiaire_id']) {
                $query->whereHas('entreprise', function($q) {
                    $q->where('beneficiaires_id', $this->filtres['beneficiaire_id']);
                });
            }
        } else {
            $query->where('entreprise_id', $this->entrepriseId);
        }

        // Appliquer les filtres géographiques et sectoriels
        if (isset($this->filtres['region']) && $this->filtres['region']) {
            $query->whereHas('entreprise', function($q) {
                $q->where('ville', $this->filtres['region']);
            });
        }

        if (isset($this->filtres['commune']) && $this->filtres['commune']) {
            $query->whereHas('entreprise', function($q) {
                $q->where('commune', $this->filtres['commune']);
            });
        }

        if (isset($this->filtres['secteur']) && $this->filtres['secteur']) {
            $query->whereHas('entreprise', function($q) {
                $q->where('secteur_activite', $this->filtres['secteur']);
            });
        }

        $collectes = $query->get();

        // Créer une liste de tous les indicateurs possibles pour cette catégorie
        $indicateursDefinition = $this->getIndicateursDefinitions();
        $indicateursPourCategorie = isset($indicateursDefinition[$this->categorie]) ? $indicateursDefinition[$this->categorie] : [];

        // Si la catégorie n'existe pas dans les définitions mais existe dans les données, extraire tous les indicateurs présents
        if (empty($indicateursPourCategorie)) {
            $indicateursTrouves = [];
            foreach ($collectes as $collecte) {
                $donnees = is_array($collecte->donnees) ? $collecte->donnees : json_decode($collecte->donnees, true);
                if (isset($donnees[$this->categorie]) && is_array($donnees[$this->categorie])) {
                    foreach (array_keys($donnees[$this->categorie]) as $idIndicateur) {
                        if (!isset($indicateursTrouves[$idIndicateur])) {
                            $indicateursTrouves[$idIndicateur] = [
                                'label' => $this->formatIndicateurLibelle($idIndicateur),
                                'unite' => '',
                                'definition' => 'Indicateur ' . $idIndicateur
                            ];
                        }
                    }
                }
            }
            $indicateursPourCategorie = $indicateursTrouves;
        }

        // Traiter les données pour cette catégorie
        $donneesCategorie = [];

        foreach ($collectes as $collecte) {
            $donnees = is_array($collecte->donnees) ? $collecte->donnees : json_decode($collecte->donnees, true);

            if (empty($donnees)) continue;

            // Pour les périodes régulières
            if (isset($donnees[$this->categorie])) {
                $indicateurs = $donnees[$this->categorie];

                // Créer une ligne de base avec les informations communes
                $ligneBase = [
                    'id_entreprise' => $collecte->entreprise->id,
                    'nom_entreprise' => $collecte->entreprise->nom_entreprise,
                    'exercice' => $collecte->exercice ? $collecte->exercice->annee : 'N/A',
                    'frequence' => $this->periodeType,
                    'periode' => $collecte->periode,
                    'statut' => $collecte->status ?? 'N/A',
                    'date_collecte' => $collecte->date_collecte,
                    'type_collecte' => $collecte->type_collecte ?? 'N/A',
                    'collecte_par' => $collecte->user ? $collecte->user->name : 'N/A',
                    'date_creation' => $collecte->created_at,
                    'date_modification' => $collecte->updated_at,
                    'ong' => ($collecte->entreprise && $collecte->entreprise->beneficiaire && $collecte->entreprise->beneficiaire->ong)
                        ? $collecte->entreprise->beneficiaire->ong->nom : 'N/A',
                    'coach' => ($collecte->entreprise && $collecte->entreprise->beneficiaire && $collecte->entreprise->beneficiaire->coach)
                        ? $collecte->entreprise->beneficiaire->coach->nom : 'N/A',
                    'region' => $collecte->entreprise->ville ?? 'N/A',
                    'secteur_activite' => $collecte->entreprise->secteur_activite ?? 'N/A',
                    'institution_financiere' => ($collecte->entreprise && $collecte->entreprise->beneficiaire && $collecte->entreprise->beneficiaire->institution_financiere)
                        ? $collecte->entreprise->beneficiaire->institution_financiere->nom : 'N/A',
                ];

                // Ajouter les valeurs des indicateurs ou N/A si non présent
                foreach (array_keys($indicateursPourCategorie) as $idIndicateur) {
                    $ligneBase[$idIndicateur] = isset($indicateurs[$idIndicateur]) ? $indicateurs[$idIndicateur] : 'N/A';
                }

                $donneesCategorie[] = $ligneBase;
            }
            // Pour les périodes occasionnelles
            else if ($this->periodeType === 'Occasionnelle' && isset($donnees['formulaire_exceptionnel'])) {
                $donneesOccasionnelle = $this->traiterDonneesOccasionnelles($donnees['formulaire_exceptionnel'], $collecte);
                if (!empty($donneesOccasionnelle)) {
                    $donneesCategorie = array_merge($donneesCategorie, $donneesOccasionnelle);
                }
            }
        }

        return collect($donneesCategorie);
    }

    protected function traiterDonneesOccasionnelles($form, $collecte): array
    {
        $donneesCategorie = [];
        $ligneBase = [
            'id_entreprise' => $collecte->entreprise->id,
            'nom_entreprise' => $collecte->entreprise->nom_entreprise,
            'exercice' => $collecte->exercice ? $collecte->exercice->annee : 'N/A',
            'frequence' => $this->periodeType,
            'periode' => $collecte->periode,
            'statut' => $collecte->status ?? 'N/A',
            'date_collecte' => $collecte->date_collecte,
            'type_collecte' => $collecte->type_collecte ?? 'N/A',
            'collecte_par' => $collecte->user ? $collecte->user->name : 'N/A',
            'date_creation' => $collecte->created_at,
            'date_modification' => $collecte->updated_at,
            'ong' => ($collecte->entreprise && $collecte->entreprise->beneficiaire && $collecte->entreprise->beneficiaire->ong)
                ? $collecte->entreprise->beneficiaire->ong->nom : 'N/A',
            'coach' => ($collecte->entreprise && $collecte->entreprise->beneficiaire && $collecte->entreprise->beneficiaire->coach)
                ? $collecte->entreprise->beneficiaire->coach->nom : 'N/A',
            'region' => $collecte->entreprise->ville ?? 'N/A',
            'secteur_activite' => $collecte->entreprise->secteur_activite ?? 'N/A',
            'institution_financiere' => ($collecte->entreprise && $collecte->entreprise->beneficiaire && $collecte->entreprise->beneficiaire->institution_financiere)
                ? $collecte->entreprise->beneficiaire->institution_financiere->nom : 'N/A',
        ];

        switch ($this->categorie) {
            case 'Indicateurs de formation':
                $ligne = $ligneBase;
                $ligne['formation_technique_recu'] = $form['formation_technique_recu'] ? 'Oui' : 'Non';
                $ligne['formation_entrepreneuriat_recu'] = $form['formation_entrepreneuriat_recu'] ? 'Oui' : 'Non';
                $donneesCategorie[] = $ligne;
                break;

            case 'Indicateurs de bancarisation':
                $ligne = $ligneBase;
                $ligne['est_bancarise_demarrage'] = $form['est_bancarise_demarrage'] ? 'Oui' : 'Non';
                $ligne['est_bancarise_fin'] = $form['est_bancarise_fin'] ? 'Oui' : 'Non';
                $donneesCategorie[] = $ligne;
                break;

            case 'Indicateurs d\'appréciation':
                $ligne = $ligneBase;
                $appreciationFields = [
                    'appreciation_organisation_interne_demarrage',
                    'appreciation_services_adherents_demarrage',
                    'appreciation_relations_externes_demarrage',
                    'appreciation_organisation_interne_fin',
                    'appreciation_services_adherents_fin',
                    'appreciation_relations_externes_fin',
                ];

                foreach ($appreciationFields as $field) {
                    $ligne[$field] = isset($form[$field]) ? $form[$field] : 'N/A';
                }
                $donneesCategorie[] = $ligne;
                break;
        }

        return $donneesCategorie;
    }

    public function headings(): array
    {
        $indicateursDefinition = $this->getIndicateursDefinitions();
        $indicateursPourCategorie = isset($indicateursDefinition[$this->categorie]) ? $indicateursDefinition[$this->categorie] : [];

        // En-têtes de base (informations générales)
        $headers = [
            'ID Entreprise',
            'Nom Entreprise',
            'Exercice',
            'Fréquence',
            'Période',
            'Statut',
            'Date de collecte',
            'Type Collecte',
            'Collecté par',
            'Date de création',
            'Dernière modification',
            'ONG',
            'Coach',
            'Region',
            'Secteur activité',
            'Institution Financière',
        ];

        // Ajouter les en-têtes des indicateurs avec des libellés lisibles
        foreach ($indicateursPourCategorie as $idIndicateur => $definition) {
            $headers[] = $this->formatNice ? $definition['label'] : $idIndicateur;
        }

        return $headers;
    }

    public function map($row): array
    {
        $indicateursDefinition = $this->getIndicateursDefinitions();
        $indicateursPourCategorie = isset($indicateursDefinition[$this->categorie]) ? $indicateursDefinition[$this->categorie] : [];

        // Valeurs de base
        $values = [
            $row['id_entreprise'],
            $row['nom_entreprise'],
            $row['exercice'],
            $row['frequence'],
            $row['periode'],
            $row['statut'],
            $row['date_collecte'],
            $row['type_collecte'],
            $row['collecte_par'],
            $row['date_creation'],
            $row['date_modification'],
            $row['ong'],
            $row['coach'],
            $row['region'],
            $row['secteur_activite'],
            $row['institution_financiere'],
        ];

        // Ajouter les valeurs des indicateurs
        foreach (array_keys($indicateursPourCategorie) as $idIndicateur) {
            $values[] = isset($row[$idIndicateur]) ? $row[$idIndicateur] : 'N/A';
        }

        return $values;
    }

    public function styles(Worksheet $sheet)
    {
        $styles = [
            1 => [
                'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => ['rgb' => '4472C4'],
                ],
                'alignment' => [
                    'horizontal' => Alignment::HORIZONTAL_CENTER,
                    'vertical' => Alignment::VERTICAL_CENTER,
                ],
            ],
        ];

        // Styles pour les valeurs numériques
        // Comme nous avons 16 colonnes d'infos de base, les indicateurs commencent à partir de la colonne Q
        $highestColumn = $sheet->getHighestColumn();
        $sheet->getStyle('Q1:' . $highestColumn . '1')->getNumberFormat()->setFormatCode('#,##0.00');

        // Alternance des couleurs pour les lignes
        $highestRow = $sheet->getHighestRow();
        for ($row = 2; $row <= $highestRow; $row++) {
            if ($row % 2 == 0) {
                $sheet->getStyle("A{$row}:{$highestColumn}{$row}")->getFill()
                    ->setFillType(Fill::FILL_SOLID)
                    ->getStartColor()->setRGB('F2F2F2');
            }
        }

        return $styles;
    }

    // Convertit un ID d'indicateur en libellé lisible si aucune définition n'existe
    protected function formatIndicateurLibelle($indicateurId): string
    {
        // Convertir les underscores en espaces et mettre en majuscule la première lettre
        $label = str_replace('_', ' ', $indicateurId);
        return ucfirst($label);
    }

    protected function getIndicateursDefinitions(): array
    {
        // Retourne un tableau complet de définitions d'indicateurs avec des libellés clairs
        return [
            "Indicateurs commerciaux de l'entreprise du promoteur" => [
                'propects_grossites' => [
                    'label' => 'Nombre de clients prospectés (grossistes)',
                    'unite' => '',
                    'definition' => 'Le nombre de clients potentiels prospectés par le promoteur'
                ],
                'prospects_detaillant' => [
                    'label' => 'Nombre de clients prospectés (détaillants)',
                    'unite' => '',
                    'definition' => 'Le nombre de clients potentiels prospectés par le promoteur'
                ],
                'clients_grossistes' => [
                    'label' => 'Nombre de nouveaux clients (grossistes)',
                    'unite' => '',
                    'definition' => 'Nombre de nouveaux clients obtenus'
                ],
                'clients_detaillant' => [
                    'label' => 'Nombre de nouveaux clients (détaillants)',
                    'unite' => '',
                    'definition' => 'Nombre de nouveaux clients obtenus'
                ],
                'nbr_contrat_conclu' => [
                    'label' => 'Nombre de commandes/contrats obtenus',
                    'unite' => '',
                    'definition' => 'Nombre de commandes ou de contrats obtenus'
                ],
                'nbr_contrat_encours' => [
                    'label' => 'Nombre de commandes/contrats en cours',
                    'unite' => '',
                    'definition' => 'Nombre de commandes ou de contrats en cours'
                ],
                'nbr_contrat_perdu' => [
                    'label' => 'Nombre de commandes/contrats perdus',
                    'unite' => '',
                    'definition' => 'Nombre de commandes ou de contrats perdus'
                ],
                'nbr_creance_clients_12m' => [
                    'label' => 'Nombre de créances clients irrécouvrables',
                    'unite' => '',
                    'definition' => 'Nombre de créances clients irrécouvrables'
                ],
                'montant_creance_clients_12m_h' => [
                    'label' => 'Montant créances clients irrécouvrables',
                    'unite' => 'FCFA',
                    'definition' => 'Montant des créances clients irrécouvrables'
                ],
                'credit_rembourse' => [
                    'label' => 'Crédit remboursé',
                    'unite' => 'FCFA',
                    'definition' => 'Montant du crédit remboursé'
                ],
            ],
            "Indicateurs d'activités de l'entreprise du promoteur" => [
                'nbr_cycle_production' => [
                    'label' => 'Nombre de cycles de production réalisés',
                    'unite' => '',
                    'definition' => 'Définir le nombre de cycles de production réalisés par le promoteur'
                ],
                'nbr_clients' => [
                    'label' => 'Nombre de clients fidélisés',
                    'unite' => '',
                    'definition' => 'Compter le nombre de clients fidélisés'
                ],
                'taux_croissance' => [
                    'label' => 'Taux de croissance',
                    'unite' => '%',
                    'definition' => 'Taux de croissance du chiffre d\'affaires'
                ],
                'chiffre_affaire' => [
                    'label' => 'Chiffre d\'affaires',
                    'unite' => 'FCFA',
                    'definition' => 'Montant cumulé des ventes réalisées par l\'entreprise'
                ],
            ],
            "Indicateurs de Rentabilité et de solvabilité" => [
                'cout_main_oeuvre' => [
                    'label' => 'Coût de la main d\'œuvre',
                    'unite' => 'FCFA',
                    'definition' => 'Coût total de la main-d\'œuvre'
                ],
                'cout_matiere_premiere' => [
                    'label' => 'Coût des matières premières',
                    'unite' => 'FCFA',
                    'definition' => 'Coût total des matières premières'
                ],
                'cout_frais_generaux' => [
                    'label' => 'Coût des frais généraux',
                    'unite' => 'FCFA',
                    'definition' => 'Coût des frais généraux'
                ],
                'produit_exploitation' => [
                    'label' => 'Produits d\'exploitation',
                    'unite' => 'FCFA',
                    'definition' => 'Montant total des produits d\'exploitation'
                ],
                'cout_production' => [
                    'label' => 'Coût de production',
                    'unite' => 'FCFA',
                    'definition' => 'Coût total de la production'
                ],
                'subvention_oim' => [
                    'label' => 'Subvention OIM',
                    'unite' => 'FCFA',
                    'definition' => 'Montant de la subvention OIM'
                ],
                'subvention_autres' => [
                    'label' => 'Autres subventions',
                    'unite' => 'FCFA',
                    'definition' => 'Montant des autres subventions'
                ],
                'total_actif' => [
                    'label' => 'Total actif',
                    'unite' => 'FCFA',
                    'definition' => 'Montant total des actifs'
                ],
                'capital_social' => [
                    'label' => 'Capital social',
                    'unite' => 'FCFA',
                    'definition' => 'Montant du capital social'
                ],
                'reserves_social' => [
                    'label' => 'Réserves sociales',
                    'unite' => 'FCFA',
                    'definition' => 'Montant des réserves sociales'
                ],
                'report_a_nouveau' => [
                    'label' => 'Report à nouveau',
                    'unite' => 'FCFA',
                    'definition' => 'Montant du report à nouveau'
                ],
                'subvention_investissement' => [
                    'label' => 'Subvention d\'investissement',
                    'unite' => 'FCFA',
                    'definition' => 'Montant de la subvention d\'investissement'
                ],
                'resultat_net_exercice' => [
                    'label' => 'Résultat net de l\'exercice',
                    'unite' => 'FCFA',
                    'definition' => 'Résultat net de l\'exercice'
                ],
                'engagement_projet' => [
                    'label' => 'Engagement projet',
                    'unite' => 'FCFA',
                    'definition' => 'Montant de l\'engagement du projet'
                ],
                'engagement_autre' => [
                    'label' => 'Engagement autre',
                    'unite' => 'FCFA',
                    'definition' => 'Montant des autres engagements'
                ],
                'resultat_net_exploitation' => [
                    'label' => 'Résultat net d\'exploitation',
                    'unite' => 'FCFA',
                    'definition' => 'Résultat net d\'exploitation'
                ],
                'capitaux_propres' => [
                    'label' => 'Capitaux propres',
                    'unite' => 'FCFA',
                    'definition' => 'Montant des capitaux propres'
                ],
            ],
            "Indicateurs de trésorerie de l'entreprise du promoteur" => [
                'dettes_financieres' => [
                    'label' => 'Dettes financières',
                    'unite' => 'FCFA',
                    'definition' => 'Montant des dettes financières'
                ],
                'emprunts_moyen_terme' => [
                    'label' => 'Emprunts à moyen terme',
                    'unite' => 'FCFA',
                    'definition' => 'Montant des emprunts à moyen terme'
                ],
                'emprunts_long_terme' => [
                    'label' => 'Emprunts à long terme',
                    'unite' => 'FCFA',
                    'definition' => 'Montant des emprunts à long terme'
                ],
                'actifs_immobilises' => [
                    'label' => 'Actifs immobilisés',
                    'unite' => 'FCFA',
                    'definition' => 'Montant des actifs immobilisés'
                ],
                'stocks' => [
                    'label' => 'Stocks',
                    'unite' => 'FCFA',
                    'definition' => 'Montant des stocks'
                ],
                'creances_clients' => [
                    'label' => 'Créances clients',
                    'unite' => 'FCFA',
                    'definition' => 'Montant des créances clients'
                ],
                'creances_fiscales' => [
                    'label' => 'Créances fiscales',
                    'unite' => 'FCFA',
                    'definition' => 'Montant des créances fiscales'
                ],
                'dettes_fournisseurs' => [
                    'label' => 'Dettes fournisseurs',
                    'unite' => 'FCFA',
                    'definition' => 'Montant des dettes fournisseurs'
                ],
                'dettes_sociales' => [
                    'label' => 'Dettes sociales',
                    'unite' => 'FCFA',
                    'definition' => 'Montant des dettes sociales'
                ],
                'dettes_fiscales' => [
                    'label' => 'Dettes fiscales',
                    'unite' => 'FCFA',
                    'definition' => 'Montant des dettes fiscales'
                ],
                'nbr_echeances_impayes' => [
                    'label' => 'Nombre d\'échéances impayées',
                    'unite' => '',
                    'definition' => 'Nombre d\'échéances impayées'
                ],
                'nbr_echeances_aterme' => [
                    'label' => 'Nombre d\'échéances à terme',
                    'unite' => '',
                    'definition' => 'Nombre d\'échéances à terme'
                ],
                'capital_rembourse' => [
                    'label' => 'Capital remboursé',
                    'unite' => 'FCFA',
                    'definition' => 'Montant du capital remboursé'
                ],
                'capital_echu' => [
                    'label' => 'Capital échu',
                    'unite' => 'FCFA',
                    'definition' => 'Montant du capital échu'
                ],
                'nbr_jours_fact_client_paie' => [
                    'label' => 'Nombre de jours facture client payé',
                    'unite' => 'jours',
                    'definition' => 'Nombre de jours entre facture et paiement client'
                ],
                'nbr_jours_fact_fournisseur_paie' => [
                    'label' => 'Nombre de jours facture fournisseur payé',
                    'unite' => 'jours',
                    'definition' => 'Nombre de jours entre facture et paiement fournisseur'
                ],
                'nbr_factures_impayees_12m' => [
                    'label' => 'Nombre de factures impayées (>12 mois)',
                    'unite' => '',
                    'definition' => 'Nombre de factures impayées depuis plus de 12 mois'
                ],
            ],
            "Indicateurs Sociaux et RH" => [
                'nbr_employes_remunerer_h' => [
                    'label' => 'Employés rémunérés (hommes)',
                    'unite' => '',
                    'definition' => 'Nombre d\'employés hommes rémunérés'
                ],
                'nbr_employes_remunerer_f' => [
                    'label' => 'Employés rémunérés (femmes)',
                    'unite' => '',
                    'definition' => 'Nombre d\'employés femmes rémunérées'
                ],
                'nbr_employes_non_remunerer_f' => [
                    'label' => 'Employés non rémunérés (femmes)',
                    'unite' => '',
                    'definition' => 'Nombre d\'employés femmes non rémunérées'
                ],
                'nbr_employes_non_remunerer_h' => [
                    'label' => 'Employés non rémunérés (hommes)',
                    'unite' => '',
                    'definition' => 'Nombre d\'employés hommes non rémunérés'
                ],
                'nbr_nouveau_recru_h' => [
                    'label' => 'Nouveaux recrutés (hommes)',
                    'unite' => '',
                    'definition' => 'Nombre de nouveaux recrutés hommes'
                ],
                'nbr_nouveau_recru_f' => [
                    'label' => 'Nouvelles recrutées (femmes)',
                    'unite' => '',
                    'definition' => 'Nombre de nouvelles recrutées femmes'
                ],
                'nbr_depart_h' => [
                    'label' => 'Départs (hommes)',
                    'unite' => '',
                    'definition' => 'Nombre de départs d\'employés hommes'
                ],
                'nbr_depart_f' => [
                    'label' => 'Départs (femmes)',
                    'unite' => '',
                    'definition' => 'Nombre de départs d\'employées femmes'
                ],
                'effectif_moyen_h' => [
                    'label' => 'Effectif moyen (hommes)',
                    'unite' => '',
                    'definition' => 'Effectif moyen d\'employés hommes'
                ],
                'effectif_moyen_f' => [
                    'label' => 'Effectif moyen (femmes)',
                    'unite' => '',
                    'definition' => 'Effectif moyen d\'employées femmes'
                ],
            ],
            "Indicateurs de développement personnel" => [
                'nbr_initiatives_realises' => [
                    'label' => 'Initiatives réalisées',
                    'unite' => '',
                    'definition' => 'Nombre d\'initiatives personnelles réalisées'
                ],
                'nbr_initiatives_encours' => [
                    'label' => 'Initiatives en cours',
                    'unite' => '',
                    'definition' => 'Nombre d\'initiatives personnelles en cours'
                ],
                'nbr_initiatives_abandonnees' => [
                    'label' => 'Initiatives abandonnées',
                    'unite' => '',
                    'definition' => 'Nombre d\'initiatives personnelles abandonnées'
                ],
                'nbr_initiatives_aboutis' => [
                    'label' => 'Initiatives abouties',
                    'unite' => '',
                    'definition' => 'Nombre d\'initiatives personnelles abouties'
                ],
                'nbr_objectifs_realises' => [
                    'label' => 'Objectifs réalisés',
                    'unite' => '',
                    'definition' => 'Nombre d\'objectifs personnels réalisés'
                ],
                'nbr_objectifs_planifies' => [
                    'label' => 'Objectifs planifiés',
                    'unite' => '',
                    'definition' => 'Nombre d\'objectifs personnels planifiés'
                ],
                'nbr_objectifs_abandonnees' => [
                    'label' => 'Objectifs abandonnés',
                    'unite' => '',
                    'definition' => 'Nombre d\'objectifs personnels abandonnés'
                ],
                'nbr_objectifs_aboutis' => [
                    'label' => 'Objectifs aboutis',
                    'unite' => '',
                    'definition' => 'Nombre d\'objectifs personnels aboutis'
                ],
            ],
            "Indicateurs de performance Projet" => [
                'total_autres_revenus' => [
                    'label' => 'Total autres revenus',
                    'unite' => 'FCFA',
                    'definition' => 'Montant total des autres revenus'
                ],
                'nombres_credits' => [
                    'label' => 'Nombre de crédits',
                    'unite' => '',
                    'definition' => 'Nombre de crédits obtenus'
                ],
                'montant_credit' => [
                    'label' => 'Montant du crédit',
                    'unite' => 'FCFA',
                    'definition' => 'Montant total des crédits obtenus'
                ],
                'prop_revenu_accru_h' => [
                    'label' => 'Proportion revenu accru (hommes)',
                    'unite' => '%',
                    'definition' => 'Proportion de revenus accrus pour les hommes'
                ],
                'prop_revenu_accru_f' => [
                    'label' => 'Proportion revenu accru (femmes)',
                    'unite' => '%',
                    'definition' => 'Proportion de revenus accrus pour les femmes'
                ],
            ],
            "Indicateurs de formation" => [
                'formation_entrepreneuriat_recu' => [
                    'label' => 'Formation entrepreneuriat reçue',
                    'unite' => '',
                    'definition' => 'Indique si une formation en entrepreneuriat a été reçue'
                ],
                'formation_technique_recu' => [
                    'label' => 'Formation technique reçue',
                    'unite' => '',
                    'definition' => 'Indique si une formation technique a été reçue'
                ],
            ],
            "Indicateurs de bancarisation" => [
                'est_bancarise_demarrage' => [
                    'label' => 'Bancarisé au démarrage',
                    'unite' => '',
                    'definition' => 'Indique si le bénéficiaire était bancarisé au démarrage'
                ],
                'est_bancarise_fin' => [
                    'label' => 'Bancarisé à la fin',
                    'unite' => '',
                    'definition' => 'Indique si le bénéficiaire est bancarisé à la fin'
                ],
            ],
            "Indicateurs d'appréciation" => [
                'appreciation_organisation_interne_demarrage' => [
                    'label' => 'Appréciation organisation interne (démarrage)',
                    'unite' => '/3',
                    'definition' => 'Niveau d\'appréciation de l\'organisation interne au démarrage'
                ],
                'appreciation_services_adherents_demarrage' => [
                    'label' => 'Appréciation services adhérents (démarrage)',
                    'unite' => '/3',
                    'definition' => 'Niveau d\'appréciation des services aux adhérents au démarrage'
                ],
                'appreciation_relations_externes_demarrage' => [
                    'label' => 'Appréciation relations externes (démarrage)',
                    'unite' => '/3',
                    'definition' => 'Niveau d\'appréciation des relations externes au démarrage'
                ],
                'appreciation_organisation_interne_fin' => [
                    'label' => 'Appréciation organisation interne (fin)',
                    'unite' => '/3',
                    'definition' => 'Niveau d\'appréciation de l\'organisation interne à la fin'
                ],
                'appreciation_services_adherents_fin' => [
                    'label' => 'Appréciation services adhérents (fin)',
                    'unite' => '/3',
                    'definition' => 'Niveau d\'appréciation des services aux adhérents à la fin'
                ],
                'appreciation_relations_externes_fin' => [
                    'label' => 'Appréciation relations externes (fin)',
                    'unite' => '/3',
                    'definition' => 'Niveau d\'appréciation des relations externes à la fin'
                ],
            ],
        ];
    }
}
