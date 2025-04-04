<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class IndicateurFinancier extends Model
{
    use HasFactory;

    protected $fillable = [
        'rapport_id',
        'chiffre_affaires',
        'resultat_net',
        'ebitda',
        'marge_ebitda',
        'cash_flow',
        'dette_nette',
        'ratio_dette_ebitda',
        'fonds_propres',
        'ratio_endettement',
        'besoin_fonds_roulement',
        'tresorerie_nette',
        'investissements'
    ];

    /**
     * Obtenir le rapport associé aux indicateurs financiers.
     */
    public function rapport(): BelongsTo
    {
        return $this->belongsTo(Rapport::class);
    }

    /**
     * Boot du modèle pour ajouter les écouteurs d'événements.
     */
    protected static function boot()
    {
        parent::boot();

        // Calcul automatique des valeurs dérivées avant sauvegarde
        static::saving(function ($model) {
            // Calcul de la marge EBITDA si chiffre d'affaires existe et est > 0
            if (!empty($model->ebitda) && !empty($model->chiffre_affaires) && $model->chiffre_affaires > 0) {
                $model->marge_ebitda = ($model->ebitda / $model->chiffre_affaires) * 100;
            }

            // Calcul du ratio dette/EBITDA
            if (!empty($model->dette_nette) && !empty($model->ebitda) && $model->ebitda > 0) {
                $model->ratio_dette_ebitda = $model->dette_nette / $model->ebitda;
            }

            // Calcul du ratio d'endettement
            if (!empty($model->dette_nette) && !empty($model->fonds_propres) && $model->fonds_propres > 0) {
                $model->ratio_endettement = ($model->dette_nette / $model->fonds_propres) * 100;
            }
        });
    }
}
