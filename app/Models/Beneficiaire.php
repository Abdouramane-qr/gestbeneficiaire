<?php

namespace App\Models;
use App\Models\InstitutionFinanciere;
use App\Models\ONG;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

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


  /**
     * Relation avec les coaches qui suivent ce bénéficiaire
     */
    public function coaches(): BelongsToMany
    {
        return $this->belongsToMany(Coach::class, 'coach_beneficiaires', 'beneficiaires_id', 'coach_id')
            ->withPivot('date_affectation', 'est_actif')
            ->withTimestamps();
    }

    /**
     * Un bénéficiaire peut avoir plusieurs entreprises
     */
    public function entreprises(): HasMany
    {
        return $this->hasMany(Entreprise::class, 'beneficiaires_id');
    }

    /**
     * Relation avec l'institution financière
     */
    public function institutionFinanciere(): BelongsTo
    {
        return $this->belongsTo(InstitutionFinanciere::class);
    }

    /**
     * Relation avec l'ONG
     */
    public function ong(): BelongsTo
    {
        return $this->belongsTo(ONG::class);
    }

    /**
     * Accesseur pour obtenir le nom complet du bénéficiaire
     */
    public function getNomCompletAttribute(): string
    {
        return $this->nom . ' ' . $this->prenom;
    }

    /**
     * Relation avec les formations
     */
    public function formations(): HasMany
    {
        return $this->hasMany(Formation::class, 'beneficiaires_id');
    }

     /**
     * Accesseur pour la relation coaches qui gère automatiquement le cas où coaches est un entier
     */
    public function getCoachesAttribute($value)
    {
        // Si la valeur originale est un entier ou un identifiant, transformons-la en relation
        if (is_numeric($value) || (is_string($value) && is_numeric($value))) {
            try {
                $coachId = (int) $value;

                // Vérifier si la relation existe dans la table pivot
                $relationExists = DB::table('coach_beneficiaires')
                    ->where('coach_id', $coachId)
                    ->where('beneficiaires_id', $this->id)
                    ->exists();

                // Si la relation n'existe pas, la créer
                if (!$relationExists) {
                    DB::table('coach_beneficiaires')->insert([
                        'coach_id' => $coachId,
                        'beneficiaires_id' => $this->id,
                        'date_affectation' => now(),
                        'est_actif' => true,
                        'created_at' => now(),
                        'updated_at' => now()
                    ]);

                    // Réinitialiser l'attribut pour les prochains accès
                    $this->attributes['coaches'] = null;
                    $this->save();

                    Log::info("Relation coach-bénéficiaire corrigée", [
                        'beneficiaire_id' => $this->id,
                        'coach_id' => $coachId
                    ]);
                }

                // Charger et retourner la relation correctement
                return $this->coaches()->get();
            } catch (\Exception $e) {
                Log::error("Erreur lors de la conversion de coaches", [
                    'beneficiaire_id' => $this->id,
                    'value' => $value,
                    'message' => $e->getMessage()
                ]);
            }
        }

        // Si ce n'est pas un nombre ou si une erreur s'est produite, laisser Eloquent gérer la relation normalement
        return $this->getRelationValue('coaches');
    }

//--------------------Coaches--------------------//
     /**
     * Mutateur pour la propriété coaches
     * Intercepte les tentatives d'affecter un ID directement à la propriété coaches
     */
    public function setCoachesAttribute($value)
    {
        // Si on essaie d'assigner un entier (ID de coach)
        if (is_int($value) || is_numeric($value)) {
            $coachId = (int)$value;

            // Ne pas stocker comme attribut
            // Mais synchroniser la relation si le modèle existe déjà
            if ($this->exists) {
                try {
                    $this->coaches()->syncWithoutDetaching([$coachId => [
                        'date_affectation' => now(),
                        'est_actif' => true
                    ]]);

                    Log::info("Relation coach-bénéficiaire mise à jour via mutateur", [
                        'beneficiaire_id' => $this->id,
                        'coach_id' => $coachId
                    ]);
                } catch (\Exception $e) {
                    Log::error("Erreur lors de la synchronisation coach via mutateur", [
                        'beneficiaire_id' => $this->id,
                        'coach_id' => $coachId,
                        'message' => $e->getMessage()
                    ]);
                }
            }
            return;
        }

        // Si on essaie d'assigner un tableau d'IDs
        if (is_array($value)) {
            // Ne pas stocker comme attribut
            // Mais synchroniser la relation si le modèle existe déjà
            if ($this->exists) {
                $pivotData = array_fill(0, count($value), [
                    'date_affectation' => now(),
                    'est_actif' => true
                ]);
                $syncData = array_combine($value, $pivotData);

                try {
                    $this->coaches()->syncWithoutDetaching($syncData);
                } catch (\Exception $e) {
                    Log::error("Erreur lors de la synchronisation des coaches via mutateur", [
                        'beneficiaire_id' => $this->id,
                        'coach_ids' => $value,
                        'message' => $e->getMessage()
                    ]);
                }
            }
            return;
        }
    }

    /**
     * Méthode pratique pour ajouter un coach à ce bénéficiaire
     */
    public function assignCoach(int $coachId, bool $estActif = true): void
    {
        $this->coaches()->syncWithoutDetaching([
            $coachId => [
                'date_affectation' => now(),
                'est_actif' => $estActif
            ]
        ]);
    }

    /**
     * Méthode pratique pour retirer un coach de ce bénéficiaire
     */
    public function removeCoach(int $coachId): void
    {
        $this->coaches()->detach($coachId);
    }

    /**
     * Méthode pratique pour désactiver un coach sans le supprimer
     */
    public function deactivateCoach(int $coachId): void
    {
        $this->coaches()->updateExistingPivot($coachId, [
            'est_actif' => false
        ]);
    }

}
