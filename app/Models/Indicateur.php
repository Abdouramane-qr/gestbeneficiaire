<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Indicateur extends Model
{
    protected $fillable = [
        'nom',
        'categorie',
        'description',
        'fields',

    ];
    protected $casts = [
        'fields' => 'array',
    ];

    // Relations
    public function collectes()
    {
        return $this->hasMany(Collecte::class);
    }

    // Accesseur qui permet de générer dynamiquement les champs de l'indicateur
    public function getFieldsAttribute()
    {
        $fields = [];

        switch ($this->categorie) {
            case 'financier':
                $fields = [
                    ['id' => 'resultat_net', 'label' => 'Résultat net', 'type' => 'number', 'required' => true],
                    ['id' => 'chiffre_affaires', 'label' => 'Chiffre d\'affaires', 'type' => 'number', 'required' => true],
                    ['id' => 'total_actif', 'label' => 'Total Actif', 'type' => 'number', 'required' => true],
                    ['id' => 'capitaux_propres', 'label' => 'Capitaux propres', 'type' => 'number', 'required' => false],
                    // Champ calculé - sera calculé automatiquement
                    ['id' => 'rentabilite', 'label' => 'Rentabilité (%)', 'type' => 'calculated', 'formula' => 'resultat_net / chiffre_affaires * 100']
                ];
                break;
            case 'commercial':
                $fields = [
                    ['id' => 'nb_clients', 'label' => 'Nombre de clients', 'type' => 'number', 'required' => true],
                    ['id' => 'nb_commandes', 'label' => 'Nombre de commandes', 'type' => 'number', 'required' => true],
                    ['id' => 'valeur_commandes', 'label' => 'Valeur des commandes', 'type' => 'number', 'required' => true],
                    // Champ calculé
                    ['id' => 'panier_moyen', 'label' => 'Panier moyen', 'type' => 'calculated', 'formula' => 'valeur_commandes / nb_commandes']
                ];
                break;
            case 'production':
                $fields = [
                    ['id' => 'quantite_produite', 'label' => 'Quantité produite', 'type' => 'number', 'required' => true],
                    ['id' => 'heures_travaillees', 'label' => 'Heures travaillées', 'type' => 'number', 'required' => true],
                    ['id' => 'cout_production', 'label' => 'Coût de production', 'type' => 'number', 'required' => true],
                    // Champ calculé
                    ['id' => 'productivite', 'label' => 'Productivité', 'type' => 'calculated', 'formula' => 'quantite_produite / heures_travaillees']
                ];
                break;
            case 'rh':
                $fields = [
                    ['id' => 'effectif', 'label' => 'Effectif', 'type' => 'number', 'required' => true],
                    ['id' => 'masse_salariale', 'label' => 'Masse salariale', 'type' => 'number', 'required' => true],
                    ['id' => 'heures_formation', 'label' => 'Heures de formation', 'type' => 'number', 'required' => false],
                    // Champ calculé
                    ['id' => 'cout_moyen_employe', 'label' => 'Coût moyen par employé', 'type' => 'calculated', 'formula' => 'masse_salariale / effectif']
                ];
                break;
        }

        return $fields;
    }
}
