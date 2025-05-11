<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class ProfileController extends Controller
{
    /**
     * Afficher le profil de l'utilisateur.
     */
    public function show()
    {
        $user = Auth::user();

        return Inertia::render('profile/Show', [
            'user' => $user->load('role')
        ]);
    }

    // /**
    //  * Afficher le formulaire de modification du profil.
    //  */
    // // public function edit()
    // // {
    // //     $user = Auth::user();

    // //     return Inertia::render('profile/Edit', [
    // //         'user' => $user
    // //     ]);
    // // }

    /**
     * Mettre à jour les informations du profil utilisateur.
     */
    public function update(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)]
        ]);

        $user->update($validated);

        return redirect()->route('Profile.show')->with('success', 'Profil mis à jour avec succès.');
    }

    /**
     * Afficher le formulaire de changement de mot de passe.
     */
    public function editPassword()
    {
        return Inertia::render('profile/EditPassword');
    }

    /**
     * Mettre à jour le mot de passe de l'utilisateur.
     */
    public function updatePassword(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'current_password' => ['required', function ($attribute, $value, $fail) use ($user) {
                if (!Hash::check($value, $user->password)) {
                    return $fail('Le mot de passe actuel est incorrect.');
                }
            }],
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return redirect()->route('profile.show')->with('success', 'Mot de passe mis à jour avec succès.');
    }
}
