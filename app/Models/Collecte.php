<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Collecte extends Model
{
    use HasFactory;

    protected $fillable = [
        'entreprise_id',
        'indicateur_id',
        'frequence_id',
        'date_collecte',
        'data'
    ];

    // Cast data as array to handle JSON storage and retrieval
    protected $casts = [
        'data' => 'array',
        'date_collecte' => 'date'
    ];

    public function entreprise()
    {
        return $this->belongsTo(Entreprise::class);
    }

    public function indicateur()
    {
        return $this->belongsTo(Indicateur::class);
    }

    public function frequence()
    {
        return $this->belongsTo(Frequence::class);
    }
}
