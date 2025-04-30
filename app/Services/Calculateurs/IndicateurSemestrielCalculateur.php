<?php

namespace App\Services\Calculateurs;

/**
 * Calculateur pour les indicateurs semestriels
 *
 * Cette classe gère les calculs spécifiques aux données semestrielles
 */
class IndicateurSemestrielCalculateur
{
    /**
     * Calculer les indicateurs pour les données semestrielles
     *
     * @param array $donnees Données brutes
     * @param array $context Contexte supplémentaire (optionnel)
     * @return array Indicateurs calculés
     */
    public function calculerIndicateurs(array $donnees, array $context = []): array
    {
        // Logique de calcul spécifique au semestre
        $resultats = [];

        // Traitement des données brutes
        foreach ($donnees as $categorie => $indicateurs) {
            if (!isset($resultats[$categorie])) {
                $resultats[$categorie] = [];
            }

            // Copier les indicateurs bruts
            foreach ($indicateurs as $id => $valeur) {
                $resultats[$categorie][$id] = $valeur;
            }

            // Ajouter des indicateurs calculés spécifiques au semestre
            $this->ajouterIndicateursCalcules($categorie, $indicateurs, $resultats);
        }

        return $resultats;
    }

    /**
     * Ajouter des indicateurs calculés basés sur les données brutes
     *
     * @param string $categorie Catégorie des indicateurs
     * @param array $indicateurs Indicateurs bruts
     * @param array &$resultats Tableau de résultats à modifier
     */
    protected function ajouterIndicateursCalcules(string $categorie, array $indicateurs, array &$resultats): void
    {
        // Exemple : ajouter des indicateurs calculés selon la catégorie
        switch ($categorie) {
            case 'Financier':
                $this->calculerIndicateursFinanciers($indicateurs, $resultats[$categorie]);
                break;

            case 'Commercial':
                $this->calculerIndicateursCommerciaux($indicateurs, $resultats[$categorie]);
                break;

            case 'Production':
                $this->calculerIndicateursProduction($indicateurs, $resultats[$categorie]);
                break;

            case 'RH':
                $this->calculerIndicateursRH($indicateurs, $resultats[$categorie]);
                break;
        }
    }

    /**
     * Calculer les indicateurs financiers dérivés
     *
     * @param array $indicateurs Indicateurs bruts
     * @param array &$resultats Tableau de résultats à modifier
     */
    protected function calculerIndicateursFinanciers(array $indicateurs, array &$resultats): void
    {
        // Exemples de calculs financiers
        if (isset($indicateurs['resultat_net']) && isset($indicateurs['chiffre_affaires']) && $indicateurs['chiffre_affaires'] > 0) {
            $resultats['ratio_rentabilite'] = ($indicateurs['resultat_net'] / $indicateurs['chiffre_affaires']) * 100;
        }

        if (isset($indicateurs['tresorerie']) && isset($indicateurs['dette_court_terme']) && $indicateurs['dette_court_terme'] > 0) {
            $resultats['liquidite_immediate'] = $indicateurs['tresorerie'] / $indicateurs['dette_court_terme'];
        }
    }

    /**
     * Calculer les indicateurs commerciaux dérivés
     *
     * @param array $indicateurs Indicateurs bruts
     * @param array &$resultats Tableau de résultats à modifier
     */
    protected function calculerIndicateursCommerciaux(array $indicateurs, array &$resultats): void
    {
        // Exemples de calculs commerciaux
        if (isset($indicateurs['ventes']) && isset($indicateurs['cout_ventes']) && $indicateurs['ventes'] > 0) {
            $resultats['marge_commerciale'] = (($indicateurs['ventes'] - $indicateurs['cout_ventes']) / $indicateurs['ventes']) * 100;
        }

        if (isset($indicateurs['clients_nouveaux']) && isset($indicateurs['clients_total']) && $indicateurs['clients_total'] > 0) {
            $resultats['taux_acquisition'] = ($indicateurs['clients_nouveaux'] / $indicateurs['clients_total']) * 100;
        }
    }

    /**
     * Calculer les indicateurs de production dérivés
     *
     * @param array $indicateurs Indicateurs bruts
     * @param array &$resultats Tableau de résultats à modifier
     */
    protected function calculerIndicateursProduction(array $indicateurs, array &$resultats): void
    {
        // Exemples de calculs de production
        if (isset($indicateurs['production_totale']) && isset($indicateurs['heures_production']) && $indicateurs['heures_production'] > 0) {
            $resultats['productivite_horaire'] = $indicateurs['production_totale'] / $indicateurs['heures_production'];
        }

        if (isset($indicateurs['production_defectueuse']) && isset($indicateurs['production_totale']) && $indicateurs['production_totale'] > 0) {
            $resultats['taux_defauts'] = ($indicateurs['production_defectueuse'] / $indicateurs['production_totale']) * 100;
        }
    }

    /**
     * Calculer les indicateurs RH dérivés
     *
     * @param array $indicateurs Indicateurs bruts
     * @param array &$resultats Tableau de résultats à modifier
     */
    protected function calculerIndicateursRH(array $indicateurs, array &$resultats): void
    {
        // Exemples de calculs RH
        if (isset($indicateurs['masse_salariale']) && isset($indicateurs['effectif_total']) && $indicateurs['effectif_total'] > 0) {
            $resultats['cout_moyen_employe'] = $indicateurs['masse_salariale'] / $indicateurs['effectif_total'];
        }

        if (isset($indicateurs['departs']) && isset($indicateurs['effectif_total']) && $indicateurs['effectif_total'] > 0) {
            $resultats['taux_rotation'] = ($indicateurs['departs'] / $indicateurs['effectif_total']) * 100;
        }
    }

    /**
     * Récupérer les métadonnées d'un indicateur
     *
     * @param string $categorie Catégorie de l'indicateur
     * @param string $indicateurId Identifiant de l'indicateur
     * @return array|null Métadonnées de l'indicateur ou null si non trouvé
     */
    public function getMetadataIndicateur(string $categorie, string $indicateurId): ?array
    {
        // Définitions des métadonnées pour les indicateurs semestriels
        $metadata = [
            // Indicateurs financiers
            'chiffre_affaires' => [
                'libelle' => 'Chiffre d\'affaires semestriel',
                'definition' => 'Total des ventes réalisées sur un semestre',
                'unite' => 'FCFA',
                'valeur_cible' => null,
                'formule' => null,
            ],
            'resultat_net' => [
                'libelle' => 'Résultat net',
                'definition' => 'Bénéfice ou perte après impôts',
                'unite' => 'FCFA',
                'valeur_cible' => null,
                'formule' => null,
            ],
            'ratio_rentabilite' => [
                'libelle' => 'Ratio de rentabilité',
                'definition' => 'Rapport entre le résultat net et le chiffre d\'affaires',
                'unite' => '%',
                'valeur_cible' => 15,
                'formule' => '$resultat_net / $chiffre_affaires * 100',
            ],
            'liquidite_immediate' => [
                'libelle' => 'Ratio de liquidité immédiate',
                'definition' => 'Capacité à rembourser les dettes à court terme avec la trésorerie disponible',
                'unite' => 'ratio',
                'valeur_cible' => 1,
                'formule' => '$tresorerie / $dette_court_terme',
            ],

            // Indicateurs commerciaux
            'ventes' => [
                'libelle' => 'Ventes semestrielles',
                'definition' => 'Total des ventes réalisées',
                'unite' => 'FCFA',
                'valeur_cible' => null,
                'formule' => null,
            ],
            'marge_commerciale' => [
                'libelle' => 'Marge commerciale',
                'definition' => 'Pourcentage de marge réalisé sur les ventes',
                'unite' => '%',
                'valeur_cible' => 30,
                'formule' => '($ventes - $cout_ventes) / $ventes * 100',
            ],
            'taux_acquisition' => [
                'libelle' => 'Taux d\'acquisition clients',
                'definition' => 'Pourcentage de nouveaux clients sur la période',
                'unite' => '%',
                'valeur_cible' => 10,
                'formule' => '$clients_nouveaux / $clients_total * 100',
            ],

            // Indicateurs de production
            'productivite_horaire' => [
                'libelle' => 'Productivité horaire',
                'definition' => 'Quantité produite par heure de travail',
                'unite' => 'unités/h',
                'valeur_cible' => null,
                'formule' => '$production_totale / $heures_production',
            ],
            'taux_defauts' => [
                'libelle' => 'Taux de défauts',
                'definition' => 'Pourcentage de production défectueuse',
                'unite' => '%',
                'valeur_cible' => 5,
                'formule' => '$production_defectueuse / $production_totale * 100',
            ],

            // Indicateurs RH
            'cout_moyen_employe' => [
                'libelle' => 'Coût moyen par employé',
                'definition' => 'Masse salariale divisée par le nombre d\'employés',
                'unite' => 'FCFA',
                'valeur_cible' => null,
                'formule' => '$masse_salariale / $effectif_total',
            ],
            'taux_rotation' => [
                'libelle' => 'Taux de rotation du personnel',
                'definition' => 'Pourcentage d\'employés ayant quitté l\'entreprise',
                'unite' => '%',
                'valeur_cible' => 15,
                'formule' => '$departs / $effectif_total * 100',
            ],
        ];

        // Rechercher par ID exact
        if (isset($metadata[$indicateurId])) {
            return $metadata[$indicateurId];
        }

        // Si non trouvé, chercher un ID similaire
        foreach ($metadata as $id => $meta) {
            if (strpos($id, $indicateurId) !== false || strpos($indicateurId, $id) !== false) {
                return $meta;
            }
        }

        return null;
    }

    /**
     * Vérifie si un indicateur est calculé (dérivé d'autres indicateurs)
     *
     * @param string $categorie Catégorie de l'indicateur
     * @param string $indicateurId Identifiant de l'indicateur
     * @return bool True si l'indicateur est calculé, false sinon
     */
    public function estIndicateurCalcule(string $categorie, string $indicateurId): bool
    {
        // Liste des indicateurs calculés
        $indicateursCalcules = [
            'ratio_rentabilite',
            'liquidite_immediate',
            'marge_commerciale',
            'taux_acquisition',
            'productivite_horaire',
            'taux_defauts',
            'cout_moyen_employe',
            'taux_rotation',
        ];

        return in_array($indicateurId, $indicateursCalcules);
    }

    /**
     * Obtenir la liste des formules pour les indicateurs calculés
     *
     * @return array Liste des formules
     */
    public function getFormules(): array
    {
        return [
            [
                'id' => 'ratio_rentabilite',
                'categorie' => 'Financier',
                'expression' => '$resultat_net / $chiffre_affaires * 100',
                'dependances' => ['resultat_net', 'chiffre_affaires'],
            ],
            [
                'id' => 'liquidite_immediate',
                'categorie' => 'Financier',
                'expression' => '$tresorerie / $dette_court_terme',
                'dependances' => ['tresorerie', 'dette_court_terme'],
            ],
            [
                'id' => 'marge_commerciale',
                'categorie' => 'Commercial',
                'expression' => '($ventes - $cout_ventes) / $ventes * 100',
                'dependances' => ['ventes', 'cout_ventes'],
            ],
            [
                'id' => 'taux_acquisition',
                'categorie' => 'Commercial',
                'expression' => '$clients_nouveaux / $clients_total * 100',
                'dependances' => ['clients_nouveaux', 'clients_total'],
            ],
            [
                'id' => 'productivite_horaire',
                'categorie' => 'Production',
                'expression' => '$production_totale / $heures_production',
                'dependances' => ['production_totale', 'heures_production'],
            ],
            [
                'id' => 'taux_defauts',
                'categorie' => 'Production',
                'expression' => '$production_defectueuse / $production_totale * 100',
                'dependances' => ['production_defectueuse', 'production_totale'],
            ],
            [
                'id' => 'cout_moyen_employe',
                'categorie' => 'RH',
                'expression' => '$masse_salariale / $effectif_total',
                'dependances' => ['masse_salariale', 'effectif_total'],
            ],
            [
                'id' => 'taux_rotation',
                'categorie' => 'RH',
                'expression' => '$departs / $effectif_total * 100',
                'dependances' => ['departs', 'effectif_total'],
            ],
        ];
    }

    /**
     * Obtenir les catégories d'indicateurs disponibles
     *
     * @return array Liste des catégories
     */
    public function getCategoriesIndicateurs(): array
    {
        return [
            'Financier',
            'Commercial',
            'Production',
            'RH',
        ];
    }
}
