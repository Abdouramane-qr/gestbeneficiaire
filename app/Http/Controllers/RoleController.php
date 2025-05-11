<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class RoleController extends Controller
{
    /**
     * Afficher la liste des rôles.
     */
    public function index()
    {
        $roles = Role::all();

        return Inertia::render('Roles/Index', [
            'roles' => $roles,
            'modules' => $this->getAccessModules(),
            'actions' => $this->getAccessActions()
        ]);
    }

    /**
     * Afficher le formulaire de création d'un rôle.
     */
    public function create()
    {
        $modules = $this->getAccessModules();
        $actions = $this->getAccessActions();

        return Inertia::render('Roles/Create', [
            'modules' => $modules,
            'actions' => $actions
        ]);
    }

    /**
     * Stocker un nouveau rôle.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'description' => 'nullable|string|max:1000',
            'permissions' => 'required|array'
        ]);

        Role::create($validated);

        return redirect()->route('roles.index')->with('success', 'Rôle créé avec succès.');
    }

    /**
     * Afficher un rôle spécifique.
     */
    public function show(Role $role)
    {
        return Inertia::render('Roles/Show', [
            'role' => $role,
            'modules' => $this->getAccessModules(),
            'actions' => $this->getAccessActions()
        ]);
    }

    /**
     * Afficher le formulaire de modification d'un rôle.
     */
    public function edit(Role $role)
    {
        $modules = $this->getAccessModules();
        $actions = $this->getAccessActions();

        return Inertia::render('Roles/Edit', [
            'role' => $role,
            'modules' => $modules,
            'actions' => $actions
        ]);
    }

    /**
     * Mettre à jour un rôle.
     */
    public function update(Request $request, Role $role)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('roles')->ignore($role->id)],
            'description' => 'nullable|string|max:1000',
            'permissions' => 'required|array'
        ]);

        $role->update($validated);

        return redirect()->route('roles.index')->with('success', 'Rôle mis à jour avec succès.');
    }

    /**
     * Supprimer un rôle.
     */
    public function destroy(Role $role)
    {
        // Vérifier si des utilisateurs sont associés à ce rôle
        if ($role->users()->count() > 0) {
            return redirect()->route('roles.index')->with('error', 'Ce rôle ne peut pas être supprimé car des utilisateurs y sont associés.');
        }

        $role->delete();

        return redirect()->route('roles.index')->with('success', 'Rôle supprimé avec succès.');
    }

    /**
     * Obtenir la liste des modules d'accès.
     */
    private function getAccessModules()
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
    private function getAccessActions()
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
