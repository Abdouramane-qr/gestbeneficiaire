<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Frequence extends Model
{
    use HasFactory;

    protected $fillable = ['nom', 'code', 'days_interval','date_debut', 'date_fin'];

    public function collectes()
    {
        return $this->hasMany(Collecte::class);
    }
}
