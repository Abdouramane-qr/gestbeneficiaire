<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'telephone',
        'password',
        'type',
        'role_id',
        'coach_id',
        'ong_id',
        'institution_financiere_id',
        'beneficiaires_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'telephone_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * Get the role that owns the user.
     */
    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * Get the coach associated with the user.
     */
    public function coach()
    {
        return $this->belongsTo(Coach::class);
    }

    /**
     * Get the ONG associated with the user.
     */
    public function ong()
    {
        return $this->belongsTo(ONG::class);
    }

    /**
     * Get the institution financière associated with the user.
     */
    public function institution()
    {
        return $this->belongsTo(InstitutionFinanciere::class, 'institution_id');
    }

    /**
     * Get the bénéficiaire (promoteur) associated with the user.
     */
    public function beneficiaire()
    {
        return $this->belongsTo(Beneficiaire::class, 'beneficiaire_id');
    }

    /**
     * Check if the user has a specific permission.
     */
    public function hasPermission(string $module, string $action): bool
    {
        if (!$this->role) {
            return false;
        }

        return $this->role->hasPermission($module, $action);
    }

    /**
     * Check if user has any permissions for a module.
     */
    public function hasModuleAccess(string $module): bool
    {
        if (!$this->role || !isset($this->role->permissions[$module])) {
            return false;
        }

        return count($this->role->permissions[$module]) > 0;
    }

    /**
     * Check if the user has at least one of the specified permissions in any of the given modules.
     */
    public function hasAnyPermission(array $modules, string $action): bool
    {
        if (!$this->role) {
            return false;
        }

        foreach ($modules as $module) {
            if ($this->hasPermission($module, $action)) {
                return true;
            }
        }

        return false;
    }
    /**
     * Filtrer les données accessibles selon le type d'utilisateur
     */
    public function scopeFilteredAccess($query, $modelClass, array $additionalConstraints = [])
    {
        // Si l'utilisateur est administrateur ou M&E, pas de filtrage
        if ($this->role->name === 'Administrateur' || $this->role->name === 'Suivi Evaluation (M&E)') {
            return $query;
        }

        // Appliquer les contraintes spécifiques au type d'utilisateur
        switch ($this->type) {
            case 'coach':
                if ($this->coach_id && $modelClass === Beneficiaire::class) {
                    return $query->whereHas('coaches', function ($q) {
                        $q->where('coach_id', $this->coach_id)
                          ->where('est_actif', true);
                    });
                }
                break;

            case 'ong':
                if ($this->ong_id) {
                    if ($modelClass === Beneficiaire::class) {
                        return $query->where('ong_id', $this->ong_id);
                    } elseif ($modelClass === Coach::class) {
                        return $query->where('ong_id', $this->ong_id);
                    } elseif ($modelClass === Entreprise::class) {
                        return $query->whereHas('beneficiaire', function ($q) {
                            $q->where('ong_id', $this->ong_id);
                        });
                    }
                }
                break;

            case 'institution':
                if ($this->institution_id) {
                    if ($modelClass === Beneficiaire::class) {
                        return $query->where('institution_id', $this->institution_id);
                    } elseif ($modelClass === Entreprise::class) {
                        return $query->whereHas('beneficiaire', function ($q) {
                            $q->where('institution_id', $this->institution_id);
                        });
                    }
                }
                break;

            case 'promoteur':
                if ($this->beneficiaire_id) {
                    if ($modelClass === Entreprise::class) {
                        return $query->where('beneficiaires_id', $this->beneficiaire_id);
                    } elseif ($modelClass === Beneficiaire::class) {
                        return $query->where('id', $this->beneficiaire_id);
                    }
                }
                break;
        }

        // Appliquer des contraintes supplémentaires si nécessaire
        foreach ($additionalConstraints as $field => $value) {
            $query->where($field, $value);
        }

        return $query;
    }
}
