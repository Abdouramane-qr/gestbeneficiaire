<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Collecte extends Model
{
    use HasFactory;

    protected $fillable = [
        'entreprise_id',
        'exercice_id',
        'periode_id',
        'user_id',
        'date_collecte',
        'type_collecte',
        'periode',
        'donnees',
    ];

    protected $casts = [
        'date_collecte' => 'date',
        'donnees' => 'array',
    ];

    // Relations
    public function entreprise(): BelongsTo
    {
        return $this->belongsTo(Entreprise::class);
    }

    public function exercice(): BelongsTo
    {
        return $this->belongsTo(Exercice::class);
    }

    public function periode(): BelongsTo
    {
        return $this->belongsTo(Periode::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Scopes
    public function scopeStandard($query)
    {
        return $query->where('type_collecte', 'standard');
    }

    public function scopeBrouillon($query)
    {
        return $query->where('type_collecte', 'brouillon');
    }

    // Helpers pour accéder aux données
    public function getCategoryData(string $category): array
    {
        return is_array($this->donnees) ? ($this->donnees[$category] ?? []) : [];
    }

    public function hasIndicateur(string $category, string $indicateur): bool
    {
        return isset($this->getCategoryData($category)[$indicateur]);
    }

    public function getIndicateurValue(string $category, string $indicateur)
    {
        return $this->getCategoryData($category)[$indicateur] ?? null;
    }

    public function getCategories(): array
    {
        return is_array($this->donnees) ? array_keys($this->donnees) : [];
    }
}
