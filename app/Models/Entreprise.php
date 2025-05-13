<?php

namespace App\Models;
use App\Models\Collecte;
use App\Models\Beneficiaire;
use App\Models\ONG;
use App\Models\InstitutionFinanciere;

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
        'beneficiaires_id',
        'domaine_activite',
        'niveau_mise_en_oeuvre',
        'ong_id',
        'institution_financiere_id'
    ];

    protected $casts = [
        'date_creation' => 'date', // Cast automatique en objet Date
    ];

    // Une entreprise appartient à un seul bénéficiaire (promoteur)
    public function beneficiaire()
    {
        return $this->belongsTo(Beneficiaire::class, 'beneficiaires_id');
    }



    // Relation avec l'ONG
    public function ong()
    {
        return $this->belongsTo(ONG::class, 'ong_id');
    }

    // Relation avec l'institution financière
    public function institutionFinanciere()
    {
        return $this->belongsTo(InstitutionFinanciere::class, 'institution_financiere_id');
    }

    // Relation avec les collectes de données
    public function dataCollections()
    {
        return $this->hasMany(Collecte::class);
    }
// App\Models\Entreprise.php

public function collectes()
{
    return $this->hasMany(Collecte::class, 'entreprise_id');
}

    // Accesseur pour obtenir le nom du promoteur (bénéficiaire)
    public function getNomPromoteurAttribute()
    {
        return $this->promoteur ? $this->promoteur->nom . ' ' . $this->promoteur->prenom : 'Non spécifié';
    }
}
