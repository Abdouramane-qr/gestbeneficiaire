<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CollectHistory extends Model
{
    use HasFactory;

    protected $table = 'collect_histories'; // Le nom de la table (assurez-vous qu'elle existe dans votre base de données)

    protected $fillable = [
        'collect_id',   // L'ID de la collecte associée
        'old_data',     // Les anciennes données
        'new_data',     // Les nouvelles données
    ];

    protected $casts = [
        'old_data' => 'array',  // Assurez-vous que les données sont traitées comme un tableau JSON
        'new_data' => 'array',
    ];
}
