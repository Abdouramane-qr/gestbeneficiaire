<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use App\Models\Entreprise;
use App\Models\Beneficiaire;
use App\Models\InstitutionFinanciere;
use App\Models\ONG;
use App\Models\Collecte;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Afficher la liste des utilisateurs.
     */
    public function index()
    {
        $users = User::with('role')->get();

        return Inertia::render('Users/Index', [
            'users' => $users
        ]);
    }

    /**
     * Afficher le formulaire de création d'un utilisateur.
     */
    public function create()
    {
        $roles = Role::all();

        return Inertia::render('Users/Create', [
            'roles' => $roles,
            'types' => $this->getUserTypes()
        ]);
    }

    /**
     * Stocker un nouvel utilisateur.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Password::defaults()],
            'role_id' => 'required|exists:roles,id',
            'type' => 'required|string|in:admin,coach,ong,promoteur,institution,autre'
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role_id' => $validated['role_id'],
            'type' => $validated['type']
        ]);

        return redirect()->route('users.index')
            ->with('success', 'Utilisateur créé avec succès.');
    }

    /**
     * Afficher un utilisateur spécifique.
     */
    public function show(User $user)
    {
        return Inertia::render('Users/Show', [
            'user' => $user->load('role')
        ]);
    }

    /**
     * Afficher le formulaire de modification d'un utilisateur.
     */
    public function edit(User $user)
    {
        $roles = Role::all();

        return Inertia::render('Users/Edit', [
            'user' => $user,
            'roles' => $roles,
            'types' => $this->getUserTypes()
        ]);
    }

    /**
     * Mettre à jour un utilisateur.
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'role_id' => 'required|exists:roles,id',
            'type' => 'required|string|in:admin,coach,ong,promoteur,institution,autre'
        ]);

        // Mise à jour des champs validés
        $user->update($validated);

        return redirect()->route('users.index')
            ->with('success', 'Utilisateur mis à jour avec succès.');
    }

    /**
     * Afficher le formulaire de réinitialisation du mot de passe.
     */
    public function editPassword(User $user)
    {
        return Inertia::render('Users/EditPassword', [
            'user' => $user
        ]);
    }

    /**
     * Réinitialiser le mot de passe d'un utilisateur.
     */
    public function updatePassword(Request $request, User $user)
    {
        $validated = $request->validate([
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return redirect()->route('users.show', $user->id)
            ->with('success', 'Mot de passe mis à jour avec succès.');
    }

    /**
     * Supprimer un utilisateur.
     */
    public function destroy(User $user)
    {
        // Empêcher la suppression de son propre compte
        if ($user->id === auth()->id()) {
            return redirect()->route('users.index')
                ->with('error', 'Vous ne pouvez pas supprimer votre propre compte.');
        }

        $user->delete();

        return redirect()->route('users.index')
            ->with('success', 'Utilisateur supprimé avec succès.');
    }

    /**
     * Obtenir les types d'utilisateurs disponibles
     */
    private function getUserTypes()
    {
        return [
            ['id' => 'admin', 'name' => 'Administrateur'],
            ['id' => 'coach', 'name' => 'Coach'],
            ['id' => 'ong', 'name' => 'ONG'],
            ['id' => 'promoteur', 'name' => 'Promoteur'],
            ['id' => 'institution', 'name' => 'Institution financière'],
            ['id' => 'autre', 'name' => 'Autre']
        ];
    }


    public function getDashboard()
{
    $user = auth()->user()->load('role'); // Chargez seulement le rôle, pas les permissions

    $stats = [
        'entreprises'   => Entreprise::count(),
        'promoteurs'    => Beneficiaire::count(),
        'ongs'          => ONG::count(),
        'institutions'  => InstitutionFinanciere::count(),
        'collectes'     => Collecte::count(),
        'rapports'      => 0, // Tu peux remplacer ça par ton propre compteur
        'users'         => User::count(),
    ];

    return Inertia::render('Users/DataDashboard', [
        'auth' => [
            'user' => $user
        ],
        'stats' => $stats
    ]);
}

}
