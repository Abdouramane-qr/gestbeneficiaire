<?php

// app/Http/Middleware/CheckPermission.php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class CheckPermission
{
    public function handle(Request $request, Closure $next, string $module, string $action = 'view')
    {
        $user = Auth::user();

        // Journalisation améliorée
        Log::info('Vérification des permissions', [
            'user_id' => $user ? $user->id : null,
            'user_type' => $user ? $user->type : null,
            'module' => $module,
            'action' => $action,
            'route' => $request->route()->getName(),
        ]);

        if (!$user || !$user->hasPermission($module, $action)) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Accès non autorisé.'], 403);
            }

            // Flash message avec différents niveaux de sévérité selon le contexte
            $message = "Vous n'avez pas les permissions nécessaires pour cette action.";

            // Si c'est une tentative d'accès à un module complet
            if ($action === 'view') {
                return redirect()->route('dashboard')
                    ->with('error', "Vous n'avez pas accès au module '$module'.");
            }

            // Si c'est une action sur un module auquel l'utilisateur a accès partiel
            if ($user && $user->hasModuleAccess($module)) {
                return back()->with('warning', "Action non autorisée: vous ne pouvez pas '$action' dans '$module'.");
            }

            return redirect()->route('dashboard')->with('error', $message);
        }

        return $next($request);
    }
}
