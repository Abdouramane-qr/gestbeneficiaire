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
        'is_exceptionnel',
        'periode',
        'donnees',
    ];

    protected $casts = [
        'date_collecte' => 'datetime',
        'donnees' => 'array',
        'is_exceptionnel' => 'boolean',

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

    /**
     * Ensure donnees is always returned as an array
     *
     * @return array
     */
    public function getDonneesAsArray(): array
    {
        if (is_string($this->donnees)) {
            return json_decode($this->donnees, true) ?? [];
        }

        return is_array($this->donnees) ? $this->donnees : [];
    }

    /**
     * Get data for a specific category
     *
     * @param string $category
     * @return array
     */
    public function getCategoryData(string $category): array
    {
        $donnees = $this->getDonneesAsArray();
        return $donnees[$category] ?? [];
    }

    /**
     * Check if an indicator exists in a category
     *
     * @param string $category
     * @param string $indicateur
     * @return bool
     */
    public function hasIndicateur(string $category, string $indicateur): bool
    {
        return isset($this->getCategoryData($category)[$indicateur]);
    }

    /**
     * Get value for a specific indicator
     *
     * @param string $category
     * @param string $indicateur
     * @return mixed|null
     */
    public function getIndicateurValue(string $category, string $indicateur)
    {
        return $this->getCategoryData($category)[$indicateur] ?? null;
    }

    /**
     * Get all categories in donnees
     *
     * @return array
     */
    public function getCategories(): array
    {
        return array_keys($this->getDonneesAsArray());
    }

    /**
     * Get all indicators for a specific category
     *
     * @param string $category
     * @return array
     */
    public function getIndicateurs(string $category): array
    {
        $categoryData = $this->getCategoryData($category);
        return is_array($categoryData) ? $categoryData : [];
    }



// Assurez-vous que les accesseurs/mutateurs traitent correctement les données
public function getDonneesAttribute($value)
{
    if (is_string($value)) {
        return json_decode($value, true) ?: [];
    }
    return $value ?: [];
}

public function setDonneesAttribute($value)
{
    $this->attributes['donnees'] = is_array($value) ? json_encode($value) : $value;
}

    public static function boot()
    {
        parent::boot();

        static::saving(function ($model) {
            // Ensure periode is properly capitalized
            if ($model->periode) {
                $model->periode = ucfirst(strtolower($model->periode));
            }
        });
    }
}
