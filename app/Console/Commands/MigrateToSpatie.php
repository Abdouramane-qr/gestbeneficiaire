<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Role as OldRole;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class MigrateToSpatie extends Command
{
    protected $signature = 'migrate:to-spatie';
    protected $description = 'Migrer les rôles et permissions existants vers Spatie Laravel-Permission';

    public function handle()
    {
        $this->info('Début de la migration vers Spatie Laravel-Permission...');

        // 1. Vérifier si les tables de Spatie sont créées
        if (!Schema::hasTable('roles') || !Schema::hasTable('permissions')) {
            $this->error('Tables Spatie non trouvées. Exécutez d\'abord les migrations Spatie.');
            return 1;
        }

        // 2. Créer les permissions basées sur les modules et actions
        $this->info('Création des permissions...');
        $modules = $this->getModules();
        $actions = $this->getActions();

        $permissionsCreated = 0;
        foreach ($modules as $module) {
            foreach ($actions as $action) {
                $permissionName = $action['id'] . '-' . $module['id'];
                Permission::findOrCreate($permissionName);
                $permissionsCreated++;
            }
        }
        $this->info("{$permissionsCreated} permissions créées.");

        // 3. Migrer les rôles existants
        $this->info('Migration des rôles...');
        $oldRoles = OldRole::all();
        $rolesMigrated = 0;

        foreach ($oldRoles as $oldRole) {
            $newRole = Role::firstOrCreate(['name' => $oldRole->name]);
            $newRole->syncPermissions([]);

            // Convertir les permissions JSON en permissions Spatie
            $permissions = $oldRole->permissions ?? [];
            foreach ($permissions as $moduleId => $actionIds) {
                foreach ($actionIds as $actionId) {
                    $permissionName = $actionId . '-' . $moduleId;
                    $permission = Permission::where('name', $permissionName)->first();
                    if ($permission) {
                        $newRole->givePermissionTo($permission);
                    }
                }
            }
            $rolesMigrated++;
        }
        $this->info("{$rolesMigrated} rôles migrés.");

        // 4. Migrer les assignations de rôles aux utilisateurs
        $this->info('Migration des assignations utilisateurs-rôles...');
        $usersMigrated = 0;

        $users = User::all();
        foreach ($users as $user) {
            if ($user->role_id) {
                $oldRole = OldRole::find($user->role_id);
                if ($oldRole) {
                    $newRole = Role::where('name', $oldRole->name)->first();
                    if ($newRole) {
                        $user->syncRoles([$newRole->name]);
                        $usersMigrated++;
                    }
                }
            }
        }
        $this->info("{$usersMigrated} utilisateurs migrés.");

        $this->info('Migration terminée avec succès!');
        return 0;
    }

    /**
     * Obtenir la liste des modules d'accès.
     */
    private function getModules()
    {
        return [
            ['id' => 'dashboard', 'name' => 'Dashboard', 'description' => 'Tableaux de bord et statistiques'],
            ['id' => 'entreprises', 'name' => 'Entreprises', 'description' => 'Gestion des entreprises bénéficiaires'],
            ['id' => 'promoteurs', 'name' => 'Promoteurs', 'description' => 'Gestion des promoteurs'],
            ['id' => 'ongs', 'name' => 'ONGs', 'description' => 'Gestion des organisations non gouvernementales'],
            ['id' => 'institutions', 'name' => 'Institutions financières', 'description' => 'Gestion des institutions financières'],
            ['id' => 'coaches', 'name' => 'Coachs', 'description' => 'Gestion des coachs'],
            ['id' => 'collectes', 'name' => 'Collectes', 'description' => 'Saisie et gestion des collectes de données'],
            ['id' => 'rapports', 'name' => 'Rapports', 'description' => 'Génération et consultation des rapports'],
            ['id' => 'utilisateurs', 'name' => 'Utilisateurs', 'description' => 'Gestion des utilisateurs'],
            ['id' => 'parametres', 'name' => 'Paramètres', 'description' => 'Configuration du système']
        ];
    }

    /**
     * Obtenir la liste des actions d'accès.
     */
    private function getActions()
    {
        return [
            ['id' => 'view', 'name' => 'Consulter', 'description' => 'Peut consulter les données'],
            ['id' => 'create', 'name' => 'Créer', 'description' => 'Peut créer de nouvelles entrées'],
            ['id' => 'edit', 'name' => 'Modifier', 'description' => 'Peut modifier les données existantes'],
            ['id' => 'delete', 'name' => 'Supprimer', 'description' => 'Peut supprimer des données'],
            ['id' => 'export', 'name' => 'Exporter', 'description' => 'Peut exporter des données'],
            ['id' => 'validate', 'name' => 'Valider', 'description' => 'Peut valider ou approuver des données']
        ];
    }
}
