<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Indicateur extends Model
{
    use HasFactory;

    protected $fillable = ['nom', 'categorie', 'description'];
    protected $appends = ['fields']; // Ajouter cet attribut pour inclure automatiquement les champs

    /**
     * Relations avec les tables spécifiques par type
     */
    public function financier()
    {
        return $this->hasOne(IndicateurFinancier::class, 'indicateur_id');
    }
    
    public function social()
    {
        return $this->hasOne(IndicateurSocial::class, 'indicateur_id');
    }
    
    public function activite()
    {
        return $this->hasOne(IndicateurActivite::class, 'indicateur_id');
    }
    
    public function commercial()
    {
        return $this->hasOne(IndicateurCommercial::class, 'indicateur_id');
    }
    
    public function tresorerie()
    {
        return $this->hasOne(Tresorerie::class, 'indicateur_id');
    }

    /**
     * Obtient les champs dynamiques basés sur la catégorie de l'indicateur
     * et les colonnes de la table correspondante
     * @return array
     */
    public function getFieldsAttribute()
    {
        // Obtenir les champs de la table spécifique en fonction de la catégorie
        $fields = [];
        
        switch ($this->categorie) {
            case 'financier':
                $fields = $this->mapTableColumns('indicateur_financiers', [
                    'rendement_fonds_propres',
                    'autosuffisance_operationnelle',
                    'marge_beneficiaire',
                    'autosuffisance_financiere',
                    'ratio_liquidite_generale',
                    'ratio_charges_financieres'
                ]);
                break;
            case 'social':
                $fields = $this->mapTableColumns('indicateur_sociaux', [
                    'nombre_employes',
                    'nombre_stagiaires',
                    'nombre_nouveaux_recrutements',
                    'nombre_depart',
                    'taux_renouvellement_effectifs'
                ]);
                break;
            case 'activite':
                $fields = $this->mapTableColumns('indicateur_activites', [
                    'nombre_cycles_production',
                    'nombre_clients',
                    'taux_croissance_clients',
                    'chiffre_affaires',
                    'taux_croissance_ca'
                ]);
                break;
            case 'commercial':
                $fields = $this->mapTableColumns('indicateur_commerciaux', [
                    'nombre_clients_prospectes',
                    'nombre_nouveaux_clients',
                    'nombre_commandes'
                ]);
                break;
            case 'tresorerie':
                $fields = $this->mapTableColumns('tresoreries', [
                    'fonds_roulement',
                    'besoin_fonds_roulement',
                    'nombre_credits_recus',
                    'montant_cumule_credits',
                    'pourcentage_echeances_impaye',
                    'delai_moyen_reglement_clients',
                    'delai_moyen_paiement_fournisseurs'
                ]);
                break;
        }
        
        return $fields;
    }
    
    /**
     * Helper pour mapper les colonnes de la table en fields
     */
    private function mapTableColumns($table, $columns)
    {
        $fields = [];
        $index = 1;
        
        foreach ($columns as $column) {
            $fields[] = [
                'id' => $column,
                'name' => $column,
                'label' => $this->formatLabel($column),
                'type' => 'number', // Type par défaut, à ajuster si nécessaire
                'required' => $index <= 3 // Exemple: premiers champs requis, à adapter selon vos besoins
            ];
            $index++;
        }
        
        return $fields;
    }
    
    /**
     * Formatage des labels à partir des noms de colonne
     */
    private function formatLabel($column)
    {
        return ucfirst(str_replace('_', ' ', $column));
    }

    public function collectes()
    {
        return $this->hasMany(Collecte::class);
    }
}