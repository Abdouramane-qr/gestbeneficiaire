<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Collecte extends Model
{
    protected $fillable = [
        'entreprise_id',
        'exercice_id',
        'user_id',
        'periode_id',
        //'indicateur_id', // Ajoutez cette ligne
        'type_collecte',
        'periode',
        'date_collecte',
        'donnees'
    ];

    protected $casts = [
        'date_collecte' => 'date',
        'donnees' =>  'array'
    ];

    // Relations
    public function entreprise()
    {
        return $this->belongsTo(Entreprise::class);
    }

    public function exercice()
    {
        return $this->belongsTo(Exercice::class);
    }

    public function periode()
    {
        return $this->belongsTo(Periode::class);
    }

    public function indicateur()
    {
        return $this->belongsTo(Indicateur::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Avant de sauvegarder, calculer les champs calculés
    protected static function booted()
    {
        static::saving(function ($collecte) {
            $donnees = $collecte->donnees;
            $indicateur = $collecte->indicateur;

            if ($indicateur && is_array($donnees)) {
                foreach ($indicateur->fields as $field) {
                    if (isset($field['type']) && $field['type'] === 'calculated' && isset($field['formula'])) {
                        // Exemple simple de formule: 'resultat_net / chiffre_affaires * 100'
                        $formula = $field['formula'];

                        // Remplacer les noms de champs par leurs valeurs
                        foreach ($donnees as $key => $value) {
                            $formula = str_replace($key, (float)$value, $formula);
                        }

                        // Évaluer la formule de manière sécurisée
                        try {
                            // Utilisation de eval() déconseillée en production
                            // Il faudrait idéalement utiliser une bibliothèque d'évaluation d'expressions mathématiques
                            $donnees[$field['id']] = eval("return $formula;");
                        } catch (\Exception $e) {
                            $donnees[$field['id']] = null;
                        }
                    }
                }

                $collecte->donnees = $donnees;
            }
        });
    }
}
