<?php

namespace App\Models;
use App\Models\InstitutionFinanciere;
use App\Models\ONG;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Beneficiaire extends Model
{
    protected $fillable = [
        'regions',
        'provinces',
        'communes',
        'village',
        'type_beneficiaire',
        'nom',
        'prenom',
        'date_de_naissance',
        'genre',
        'nom_cooperative',
        'numero_enregistrement',
        'contact',
        'niveau_instruction',
        'email',
    ];

    protected $casts = [
        'date_de_naissance' => 'date',
        'handicap' => 'boolean',
    ];
// app/Models/Promoteur.php
// Ajouter cette méthode à la classe Promoteur

/**
 * Relation avec les coachs qui suivent ce promoteur
 */
public function coaches(): BelongsToMany
{
    return $this->belongsToMany(Coach::class, 'coach_beneficiaires', 'beneficiaires_id', 'coach_id')
        ->withPivot('date_affectation', 'est_actif')
        ->withTimestamps();
}
    // Un bénéficiaire peut avoir plusieurs entreprises
    public function entreprises()
    {
        return $this->hasMany(Entreprise::class, 'beneficiaires_id');
    }

    public function institutionFinanciere()
{
    return $this->belongsTo(InstitutionFinanciere::class);
}
    public function ong()
{
    return $this->belongsTo(ONG::class);
}
    // Accesseur pour obtenir le nom complet du bénéficiaire
    public function getNomCompletAttribute()
    {
        return $this->nom . ' ' . $this->prenom;
    }
}
