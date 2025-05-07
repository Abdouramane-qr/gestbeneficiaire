<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Formation extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'libelle',
        'actif',
        'ordre',
        'user_id',
        'beneficiaires_id'
    ];

    protected $casts = [
        'actif' => 'boolean',
        'ordre' => 'integer',
    ];

    public function scopeActives($query)
    {
        return $query->where('actif', true);
    }

    public function scopeType($query, $type)
    {
        return $query->where('type', $type);
    }

     // Relation avec l'utilisateur qui a créé/modifié la formation
     public function user()
     {
         return $this->belongsTo(User::class);
     }

     // Relation avec le bénéficiaire/promoteur associé
     public function beneficiaire()
     {
         return $this->belongsTo(Beneficiaire::class, 'beneficiaires_id');
     }
}
