<?php

// app/Services/RolePermissionService.php
namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class RolePermissionService
{
    /**
     * Vérifie si un utilisateur a une permission spécifique
     */
    public function hasPermission(User $user, string $module, string $action = 'view'): bool
    {
        // Cache pour optimiser les performances
        $cacheKey = "user_permission_{$user->id}_{$module}_{$action}";

        return Cache::remember($cacheKey, now()->addMinutes(10), function () use ($user, $module, $action) {
            Log::debug('Vérification de permission', [
                'user_id' => $user->id,
                'module' => $module,
                'action' => $action
            ]);

            return $user->hasPermission($module, $action);
        });
    }

    /**
     * Vérifie si un utilisateur peut accéder à un bénéficiaire spécifique
     */
    public function canAccessBeneficiaire(User $user, int $beneficiaireId): bool
    {
        // Un admin peut tout voir
        if ($user->role && $user->role->name === 'Administrateur') {
            return true;
        }

        // Accès contextuel selon le type
        switch ($user->type) {
            case 'coach':
                return $this->isCoachAssignedToBeneficiaire($user->coach_id, $beneficiaireId);

            case 'ong':
                return $this->isBeneficiaireInOng($beneficiaireId, $user->ong_id);

            case 'institution':
                return $this->isBeneficiaireFinancedByInstitution($beneficiaireId, $user->institution_financiere_id);

            case 'promoteur':
                return $user->beneficiaires_id == $beneficiaireId;

            default:
                return false;
        }
    }

    /**
     * Vérifie si un coach est assigné à un bénéficiaire
     */
    private function isCoachAssignedToBeneficiaire(int $coachId, int $beneficiaireId): bool
    {
        return DB::table('coach_beneficiaires')
            ->where('coach_id', $coachId)
            ->where('beneficiaires_id', $beneficiaireId)
            ->where('est_actif', true)
            ->exists();
    }

    /**
     * Vérifie si un bénéficiaire appartient à une ONG
     */
    private function isBeneficiaireInOng(int $beneficiaireId, int $ongId): bool
    {
        return DB::table('beneficiaires')
            ->where('id', $beneficiaireId)
            ->where('ong_id', $ongId)
            ->exists();
    }

    /**
     * Vérifie si un bénéficiaire est financé par une institution
     */
    private function isBeneficiaireFinancedByInstitution(int $beneficiaireId, int $institutionId): bool
    {
        return DB::table('beneficiaires')
            ->where('id', $beneficiaireId)
            ->where('institution_id', $institutionId)
            ->exists();
    }

}
