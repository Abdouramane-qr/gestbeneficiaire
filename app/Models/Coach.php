<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Coach extends Model
{
    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'telephone',
        'specialite',
        'ong_id',

        'est_actif',

    ];

    protected $casts = [
       
        'est_actif' => 'boolean',
    ];

    /**
     * Relation avec l'ONG à laquelle appartient le coach
     */
    public function ong(): BelongsTo
    {
        return $this->belongsTo(ONG::class, 'ong_id');
    }

    /**
     * Relation avec les promoteurs suivis par ce coach
     */
    public function beneficiaires(): BelongsToMany
    {
        return $this->belongsToMany(Beneficiaire::class, 'coach_beneficiaires', 'coach_id', 'beneficiaires_id')
            ->withPivot('date_affectation', 'est_actif')
            ->withTimestamps();
    }

    /**
     * Obtenir le nombre de promoteurs actifs suivis par ce coach
     */
    public function getNombrePromoteursAttribute()
    {
        return $this->beneficiaires()->wherePivot('est_actif', true)->count();
    }
}
