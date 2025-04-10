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

    // Helpers
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

    public function isReadyForFinalization(): bool
    {
        return $this->entreprise_id &&
               $this->exercice_id &&
               $this->periode_id &&
               $this->date_collecte &&
               is_array($this->donnees) &&
               count($this->donnees) > 0;
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

    // Static Methods
    public static function getCollectesForEntrepriseAndExercice(int $entrepriseId, int $exerciceId): array
    {
        return self::with('periode')
            ->where('entreprise_id', $entrepriseId)
            ->where('exercice_id', $exerciceId)
            ->orderBy('date_collecte')
            ->get()
            ->groupBy('periode_id')
            ->toArray();
    }

    public static function getLatestCollecteForEntrepriseAndCategory(int $entrepriseId, string $category): ?self
    {
        return self::where('entreprise_id', $entrepriseId)
            ->whereJsonContains('donnees->' . $category, null)
            ->orderByDesc('date_collecte')
            ->first();
    }
}
