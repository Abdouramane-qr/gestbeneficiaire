<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
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
        'password',
        'type',
        'role_id',
        // autres attributs existants...
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
        'password' => 'hashed',
    ];

    /**
     * Get the role that owns the user.
     */
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * Check if the user has a specific permission.
     *
     * @param string $module Module name (dashboard, entreprises, etc.)
     * @param string $action Action name (view, create, edit, delete)
     * @return bool
     */
    public function hasPermission(string $module, string $action): bool
    {
        // Autorisation temporaire pour les indicateurs
    if ($module === 'indicateurs' && $action === 'view') {
        return true;
    }
        if (!$this->role) {
            return false;
        }

        return $this->role->hasPermission($module, $action);
    }

    /**
     * Check if user has any permissions for a module.
     *
     * @param string $module Module name
     * @return bool
     */
    public function hasModuleAccess(string $module): bool
    {
        if (!$this->role || !isset($this->role->permissions[$module])) {
            return false;
        }

        return count($this->role->permissions[$module]) > 0;
    }
}
