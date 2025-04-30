<?php

namespace App\Http\Middleware;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CheckPermission
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, string $module, string $action = 'view')
    {
        $user = auth()->user();

        // Log pour le débogage
        Log::info('Vérification des permissions', [
            'user_id' => $user ? $user->id : null,
            'module' => $module,
            'action' => $action,
            'has_permission' => $user ? $user->hasPermission($module, $action) : false
        ]);

        if (!$user || !$user->hasPermission($module, $action)) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Accès non autorisé.'], 403);
            }

            // Utilisation de flash() au lieu de with() pour s'assurer que le message persiste après la redirection
            return redirect()->route('dashboard')->with('error', 'Vous n\'avez pas les permissions nécessaires pour accéder à cette ressource.');
        }

        return $next($request);
    }
}
