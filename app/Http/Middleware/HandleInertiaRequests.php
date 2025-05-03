<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        // IMPORTANT: Ignorer les routes API - ne pas leur appliquer le middleware Inertia
        if ($request->is('api/*')) {
            return [];
        }

        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        // Récupérer l'utilisateur avec ses permissions
        $user = $request->user();

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'telephone' => $user->telephone,
                    'type' => $user->type,
                    'role' => $user->role ? [
                        'id' => $user->role->id,
                        'name' => $user->role->name,
                        'permissions' => $user->role->permissions ?? []
                    ] : null,
                    // Ajouter les IDs associés selon le type d'utilisateur
                    'coach_id' => $user->coach_id,
                    'ong_id' => $user->ong_id,
                    'institution_id' => $user->institution_financiere_id,
                    'beneficiaire_id' => $user->beneficiaires_id,
                ] : null,
                // Ajouter des raccourcis pour les vérifications de permission courantes
                'can' => $user ? [
                    'manage_users' => $user->hasPermission('utilisateurs', 'view'),
                    'manage_roles' => $user->hasPermission('parametres', 'view'),
                    'view_dashboard' => $user->hasPermission('dashboard', 'view'),
                    'create_entreprise' => $user->hasPermission('entreprises', 'create'),
                    'edit_entreprise' => $user->hasPermission('entreprises', 'edit'),
                    'create_collecte' => $user->hasPermission('collectes', 'create'),
                    'edit_collecte' => $user->hasPermission('collectes', 'edit'),
                    'export_data' => $user->hasAnyPermission(['entreprises', 'promoteurs', 'collectes'], 'export'),
                ] : [],
            ],
            // Ajout des messages flash de session
            'flash' => [
                'message' => fn () => $request->session()->get('message'),
                'error' => fn () => $request->session()->get('error'),
                'success' => fn () => $request->session()->get('success'),
                'warning' => fn () => $request->session()->get('warning'),
                'info' => fn () => $request->session()->get('info'),
            ],
            'ziggy' => fn (): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ]
        ];
    }
}
