<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tresorerie extends Model
{
    use HasFactory;

    protected $fillable = [
        'indicateur_id',
        'entreprise_id',
        'fonds_roulement',
        'besoin_fonds_roulement',
        'nombre_credits_recus',
        'montant_cumule_credits',
        'pourcentage_echeances_impaye',
        'delai_moyen_reglement_clients',
        'delai_moyen_paiement_fournisseurs'
    ];
    protected $table = 'tresoreries';
    
    public function indicateur()
    {
        return $this->belongsTo(Indicateur::class, 'indicateur_id');
    }
    public function entreprise() {
        return $this->belongsTo(Entreprise::class);
    }
}
