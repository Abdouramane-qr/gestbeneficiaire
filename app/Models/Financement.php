<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Financement extends Model
{
    protected $fillable = [
        'beneficiaire_id', 'montant', 'date_octroi', 'source', 'statut_remboursement'
    ];

    // Relation avec Beneficiaire
    public function beneficiaire()
    {
        return $this->belongsTo(Beneficiaire::class);
    }
}
