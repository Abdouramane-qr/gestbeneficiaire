<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Entreprise extends Model
{
    protected $fillable = ['beneficiaire_id', 'nom_entreprise', 'secteur_activite', 'date_creation', 
        'statut_juridique', 'adresse', 'ville', 'pays', 'description'];

         // Relation avec Beneficiaire
    public function beneficiaire()
    {
        return $this->belongsTo(Beneficiaire::class);
    }

     // Relation avec PerformanceEntreprise
     public function performances()
     {
         return $this->hasMany(PerformanceEntreprise::class);
     }
}
