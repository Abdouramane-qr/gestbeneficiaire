<?php

namespace App\Models;
use App\Models\Collecte;

use Illuminate\Database\Eloquent\Model;

class Entreprise extends Model
{
    protected $fillable = [

        'nom_entreprise',
        'secteur_activite',
        'date_creation',
        'statut_juridique',
        'adresse',
        'ville',
        'pays',
        'description',
        'beneficiaires_id' // 🔹 Ajoute ce champ pour la relation

    ];
    protected $casts = [
        'date_creation' => 'date', // Cast automatique en objet Date
    ];
     // 🔹 Une entreprise appartient à un seul bénéficiaire
     public function beneficiaire()
     {
         return $this->belongsTo(Beneficiaire::class,'beneficiaires_id');
     }

    
    public function dataCollections()
{
    return $this->hasMany(Collecte::class);
}

}
