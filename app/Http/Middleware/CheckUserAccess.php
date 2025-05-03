<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CheckUserAccess
{
    /**
     * Restreint l'accès aux données selon le type d'utilisateur de manière contextuelle
     */
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        // Administrateur a accès à tout
        if ($user->role && $user->role->name === 'Administrateur') {
            return $next($request);
        }

        // M&E a accès à tout sauf paramétrage des comptes et rôles
        if ($user->role && $user->role->name === 'Suivi Evaluation (M&E)') {
            $routeName = $request->route()->getName();
            if ($this->isRestrictedRoute($routeName)) {
                return $this->accessDenied('Cette section est réservée aux administrateurs.');
            }
            return $next($request);
        }

        // Journalisation détaillée pour débogage
        Log::info('Vérification d\'accès contextuel', [
            'user_id' => $user->id,
            'user_type' => $user->type,
            'route_name' => $request->route()->getName(),
            'route_parameters' => $request->route()->parameters(),
            'uri' => $request->getRequestUri(),
        ]);

        // Traitement contextuel selon le type d'utilisateur
        return $this->handleContextualAccess($request, $next, $user);
    }

    /**
     * Détermine si une route est restreinte (config/admin)
     */
    protected function isRestrictedRoute(string $routeName): bool
    {
        return (strpos($routeName, 'users') === 0 && $routeName !== 'users.profile') ||
               strpos($routeName, 'roles') === 0 ||
               $routeName === 'parametres.index';
    }

    /**
     * Traite l'accès contextuel selon le type d'utilisateur
     */
    protected function handleContextualAccess(Request $request, Closure $next, $user)
    {
        $routeName = $request->route()->getName();
        $modulePrefix = explode('.', $routeName)[0] ?? '';

        // Vérifier les restrictions d'accès par type d'utilisateur
        switch ($user->type) {
            case 'coach':
                return $this->handleCoachAccess($request, $next, $user);

            case 'ong':
                return $this->handleOngAccess($request, $next, $user);

            case 'institution':
                return $this->handleInstitutionAccess($request, $next, $user);

            case 'promoteur':
                return $this->handlePromoteurAccess($request, $next, $user);

            default:
                // Type non géré, appliquer les règles basiques de permission
                if (!$user->hasModuleAccess($modulePrefix)) {
                    return $this->accessDenied('Vous n\'avez pas accès à cette section.');
                }
                return $next($request);
        }
    }

    /**
     * Gère l'accès contextuel pour un coach
     */
    protected function handleCoachAccess(Request $request, Closure $next, $user)
    {
        // Un coach doit avoir un coach_id valide
        if (!$user->coach_id) {
            return $this->accessDenied('Votre profil coach n\'est pas correctement configuré.');
        }

        $routeName = $request->route()->getName();

        // Accès aux promoteurs
        if (strpos($routeName, 'beneficiaires') === 0) {
            $beneficiaireId = $request->route('beneficiaire');
            if ($beneficiaireId) {
                $isAssigned = DB::table('coach_beneficiaires')
                    ->where('coach_id', $user->coach_id)
                    ->where('beneficiaires_id', $beneficiaireId)
                    ->where('est_actif', true)
                    ->exists();

                if (!$isAssigned) {
                    return $this->accessDenied('Ce promoteur n\'est pas sous votre supervision.');
                }
            }
        }

        // Accès aux entreprises
        if (strpos($routeName, 'entreprises') === 0) {
            $entrepriseId = $request->route('entreprise');
            if ($entrepriseId) {
                $isAssigned = DB::table('coach_beneficiaires')
                    ->join('entreprises', 'coach_beneficiaires.beneficiaires_id', '=', 'entreprises.beneficiaires_id')
                    ->where('coach_beneficiaires.coach_id', $user->coach_id)
                    ->where('entreprises.id', $entrepriseId)
                    ->where('coach_beneficiaires.est_actif', true)
                    ->exists();

                if (!$isAssigned) {
                    return $this->accessDenied('Cette entreprise n\'appartient pas à un promoteur sous votre supervision.');
                }
            }
        }

        // Accès aux collectes
        if (strpos($routeName, 'collectes') === 0) {
            $collecteId = $request->route('collecte');
            if ($collecteId) {
                $isAssigned = DB::table('collectes')
                    ->join('entreprises', 'collectes.entreprise_id', '=', 'entreprises.id')
                    ->join('coach_beneficiaires', 'entreprises.beneficiaires_id', '=', 'coach_beneficiaires.beneficiaires_id')
                    ->where('coach_beneficiaires.coach_id', $user->coach_id)
                    ->where('collectes.id', $collecteId)
                    ->where('coach_beneficiaires.est_actif', true)
                    ->exists();

                if (!$isAssigned) {
                    return $this->accessDenied('Cette collecte concerne une entreprise que vous ne suivez pas.');
                }
            }
        }

        return $next($request);
    }

    /**
     * Gère l'accès contextuel pour une ONG
     */
    protected function handleOngAccess(Request $request, Closure $next, $user)
    {
        // Une ONG doit avoir un ong_id valide
        if (!$user->ong_id) {
            return $this->accessDenied('Votre profil ONG n\'est pas correctement configuré.');
        }

        $routeName = $request->route()->getName();

        // Accès aux coaches
        if (strpos($routeName, 'coaches') === 0) {
            $coachId = $request->route('coach');
            if ($coachId) {
                $belongsToOng = DB::table('coaches')
                    ->where('id', $coachId)
                    ->where('ong_id', $user->ong_id)
                    ->exists();

                if (!$belongsToOng) {
                    return $this->accessDenied('Ce coach n\'appartient pas à votre ONG.');
                }
            }
        }

        // Accès aux bénéficiaires
        if (strpos($routeName, 'beneficiaires') === 0) {
            $beneficiaireId = $request->route('beneficiaire');
            if ($beneficiaireId) {
                $isSupported = DB::table('beneficiaires')
                    ->where('id', $beneficiaireId)
                    ->where('ong_id', $user->ong_id)
                    ->exists();

                if (!$isSupported) {
                    return $this->accessDenied('Ce promoteur n\'est pas accompagné par votre ONG.');
                }
            }
        }

        // Vous pouvez ajouter d'autres vérifications pour les entreprises, collectes, etc.

        return $next($request);
    }

    /**
     * Gère l'accès contextuel pour une institution financière
     */
    protected function handleInstitutionAccess(Request $request, Closure $next, $user)
    {
        // Une institution doit avoir un institution_id valide
        if (!$user->institution_financiere_id) {
            return $this->accessDenied('Votre profil institution n\'est pas correctement configuré.');
        }

        $routeName = $request->route()->getName();

        // Accès aux bénéficiaires
        if (strpos($routeName, 'beneficiaires') === 0) {
            $beneficiaireId = $request->route('beneficiaire');
            if ($beneficiaireId) {
                $isFinanced = DB::table('beneficiaires')
                    ->where('id', $beneficiaireId)
                    ->where('institution_id', $user->institution_financiere_id)
                    ->exists();

                if (!$isFinanced) {
                    return $this->accessDenied('Ce promoteur n\'est pas financé par votre institution.');
                }
            }
        }

        // Accès aux entreprises
        if (strpos($routeName, 'entreprises') === 0) {
            $entrepriseId = $request->route('entreprise');
            if ($entrepriseId) {
                $isFinanced = DB::table('entreprises')
                    ->join('beneficiaires', 'entreprises.beneficiaires_id', '=', 'beneficiaires.id')
                    ->where('entreprises.id', $entrepriseId)
                    ->where('beneficiaires.institution_id', $user->institution_financiere_id)
                    ->exists();

                if (!$isFinanced) {
                    return $this->accessDenied('Cette entreprise n\'appartient pas à un promoteur financé par votre institution.');
                }
            }
        }

        return $next($request);
    }

    /**
     * Gère l'accès contextuel pour un promoteur
     */
    protected function handlePromoteurAccess(Request $request, Closure $next, $user)
    {
        // Un promoteur doit avoir un beneficiaire_id valide
        if (!$user->beneficiaires_id) {
            return $this->accessDenied('Votre profil promoteur n\'est pas correctement configuré.');
        }

        $routeName = $request->route()->getName();

        // Accès à son propre profil de bénéficiaire
        if (strpos($routeName, 'beneficiaires') === 0) {
            $beneficiaireId = $request->route('beneficiaire');
            if ($beneficiaireId && $beneficiaireId != $user->beneficiaires_id) {
                return $this->accessDenied('Vous ne pouvez consulter que votre propre profil.');
            }
        }

        // Accès à ses propres entreprises
        if (strpos($routeName, 'entreprises') === 0) {
            $entrepriseId = $request->route('entreprise');
            if ($entrepriseId) {
                $ownedByUser = DB::table('entreprises')
                    ->where('id', $entrepriseId)
                    ->where('beneficiaires_id', $user->beneficiaires_id)
                    ->exists();

                if (!$ownedByUser) {
                    return $this->accessDenied('Cette entreprise ne vous appartient pas.');
                }
            }
        }

        // Accès à ses propres collectes de données
        if (strpos($routeName, 'collectes') === 0) {
            $collecteId = $request->route('collecte');
            if ($collecteId) {
                $ownedByUser = DB::table('collectes')
                    ->join('entreprises', 'collectes.entreprise_id', '=', 'entreprises.id')
                    ->where('collectes.id', $collecteId)
                    ->where('entreprises.beneficiaires_id', $user->beneficiaires_id)
                    ->exists();

                if (!$ownedByUser) {
                    return $this->accessDenied('Cette collecte ne concerne pas votre entreprise.');
                }
            }
        }

        return $next($request);
    }

    /**
     * Retourne une réponse d'accès refusé
     */
    protected function accessDenied(string $message = 'Accès non autorisé.')
    {
        $request = request();

        if ($request->expectsJson()) {
            return response()->json(['error' => $message], 403);
        }

        return redirect()
            ->route('dashboard')
            ->with('error', $message);
    }
}
