<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        // Liste des types d'utilisateurs disponibles pour l'inscription
        $userTypes = [
            ['id' => 'promoteur', 'name' => 'Promoteur'],
            ['id' => 'coach', 'name' => 'Coach'],
            ['id' => 'ong', 'name' => 'ONG'],
            ['id' => 'institution', 'name' => 'Institution financière'],
            ['id' => 'admin', 'name' => 'Administrateur'],
            ['id' => 'me', 'name' => 'Suivi Evaluation (M&E)'],
        ];

        return Inertia::render('auth/register', [
            'userTypes' => $userTypes,
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'telephone' => 'required|string|unique:'.User::class,
            'email' => 'nullable|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'type' => 'required|string|in:promoteur,coach,ong,institution,admin,me',
        ]);

        // Normaliser le numéro de téléphone
        $telephone = preg_replace('/\D/', '', $request->telephone);

        // Récupérer le rôle correspondant au type d'utilisateur
        $roleName = $this->getRoleNameForUserType($request->type);
        $role = Role::where('name', $roleName)->first();

        if (!$role) {
            // Si le rôle n'existe pas, vérifier si le seeder a été exécuté
            return redirect()->back()->withErrors(['type' => 'Le type d\'utilisateur sélectionné n\'est pas configuré. Veuillez contacter l\'administrateur.']);
        }

        $fullName = trim($request->name . ' ' . $request->prenom);

        $user = User::create([
            'name' => $fullName,
            'email' => $request->email,
            'telephone' => $telephone,
            'password' => Hash::make($request->password),
            'type' => $request->type,
            'role_id' => $role->id,
        ]);

        event(new Registered($user));

        Auth::login($user);

        return to_route('dashboard');
    }

    /**
     * Obtenir le nom du rôle correspondant au type d'utilisateur.
     */
    private function getRoleNameForUserType(string $type): string
    {
        $roleName = match ($type) {
            'promoteur' => 'Promoteur',
            'coach' => 'Coach',
            'ong' => 'ONG',
            'institution' => 'Institution financière',
            'admin' => 'Administrateur',
            'me' => 'Suivi Evaluation (M&E)',
            default => 'Promoteur', // Rôle par défaut
        };

       // Log::info("Type utilisateur: $type -> Nom du rôle: $roleName");
        return $roleName;
    }
}
