<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Role extends Model
{
    protected $fillable = [
        'name',
        'description',
        'permissions',
    ];

    protected $casts = [
        'permissions' => 'array',
    ];

    /**
     * Get the users that belong to this role.
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
    

    /**
     * Check if the role has a specific permission.
     *
     * @param string $module Module name (dashboard, entreprises, etc.)
     * @param string $action Action name (view, create, edit, delete)
     * @return bool
     */
    public function hasPermission(string $module, string $action): bool
    {
        $permissions = $this->permissions ?? [];

        return isset($permissions[$module]) && in_array($action, $permissions[$module]);
    }
}
