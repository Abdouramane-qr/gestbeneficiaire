<?php

// app/Config/UserTypes.php
namespace App\Config;

class UserTypes
{
    // Mapping entre types d'utilisateurs et rôles recommandés
    public static array $typeRoleMapping = [
        'admin' => 'Administrateur',
        'coach' => 'Coach',
        'ong' => 'ONG',
        'promoteur' => 'Promoteur',
        'institution' => 'Institution Financière',
        'autre' => 'Utilisateur Simple',
    ];

    // Mapping inverse - du rôle vers le type recommandé
    public static array $roleTypeMapping = [
        'Administrateur' => 'admin',
        'Coach' => 'coach',
        'ONG' => 'ong',
        'Promoteur' => 'promoteur',
        'Institution Financière' => 'institution',
        'Suiveur' => 'autre',
        'Suivi Evaluation (M&E)' => 'admin',
    ];

    // Récupérer le type recommandé pour un rôle
    public static function getTypeForRole(int|string $roleId): ?string
    {
        if (is_int($roleId)) {
            $role = \App\Models\Role::find($roleId);
            if (!$role) return null;
            $roleName = $role->name;
        } else {
            $roleName = $roleId;
        }

        return self::$roleTypeMapping[$roleName] ?? null;
    }

    // Récupérer le rôle recommandé pour un type
    public static function getRoleForType(string $type): ?int
    {
        $roleName = self::$typeRoleMapping[$type] ?? null;
        if (!$roleName) return null;

        $role = \App\Models\Role::where('name', $roleName)->first();
        return $role ? $role->id : null;
    }
}
