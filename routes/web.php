<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

use Inertia\Inertia;
use App\Http\Controllers\{
    AnalyseController,
    BeneficiaireController,
    CollecteController,
    CoachController,
    EntrepriseController,
    ExerciceController,
    InstitutionFinanciereController,
    ONGController,
    PeriodeController,
    DashboardController,
 OfflineSyncController,
 IndicateursAnalyseController,


};

// Accueil
Route::get('/', fn () => Inertia::render('welcome'))->name('home');

// Authentification requise
Route::middleware(['auth', 'verified'])->group(function () {

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Pages des indicateurs (routes Inertia)
    Route::get('/indicateurs/analyse', [IndicateursAnalyseController::class, 'index'])->name('indicateurs.analyse');
    Route::get('/indicateurs/detail/{indicateurId}', [IndicateursAnalyseController::class, 'showIndicateur'])->name('indicateurs.detail');
    Route::get('/indicateurs/evolution', [IndicateursAnalyseController::class, 'evolution'])->name('indicateurs.evolution');

    // Ressources principales
    Route::resources([
        'exercices' => ExerciceController::class,
        'periodes' => PeriodeController::class,
    ]);

    // Exercices
    Route::patch('exercices/{exercice}/activate', [ExerciceController::class, 'activate'])->name('exercices.activate');

    // Périodes
    Route::prefix('periodes')->name('periodes.')->group(function () {
        Route::patch('{periode}/cloture', [PeriodeController::class, 'cloture'])->name('cloture');
        Route::patch('{periode}/reouverture', [PeriodeController::class, 'reouverture'])->name('reouverture');
        Route::get('{periode}/collectes', [PeriodeController::class, 'collectes'])->name('collectes');
        Route::get('{periode}/collectes/create', [PeriodeController::class, 'createCollecte'])->name('collectes.create');
    });


// Route pour les collectes
Route::pattern('collecte', '[0-9]+'); // Cela force le paramètre à être un nombre

    Route::get('/collectes/{collecte}', [CollecteController::class, 'show']);
   // Route::get('/collectes/{collecte}/edit', [CollecteController::class, 'edit'])->name('collectes.edit');
// Route pour récupérer les périodes disponibles (AJAX)
Route::get('/collectes/periodes-disponibles', [CollecteController::class, 'getAvailablePeriodes'])
    ->name('collectes.periodes-disponibles');


    // Collectes
    Route::prefix('collectes')->name('collectes.')->group(function () {
        Route::post('/draft', [CollecteController::class, 'draft'])->name('draft');
        Route::post('/validate-multiple', [CollecteController::class, 'validateMultiple'])->name('validate-multiple');
        Route::post('/delete-multiple', [CollecteController::class, 'deleteMultiple'])->name('delete-multiple');
        Route::get('/export', [CollecteController::class, 'export'])->name('export');
        Route::put('/{collecte}/convert-to-standard', [CollecteController::class, 'convertToStandard'])->name('convert-to-standard');
    });




Route::post('/analyse/export', [AnalyseController::class, 'export'])->name('analyse.export');

 // Routes pour la synthèse
Route::get('/analyse/synthese', [AnalyseController::class, 'synthese'])->name('synthese');
Route::get('/analyse/synthese/donnees', [AnalyseController::class, 'getSyntheseDonnees'])->name('synthese.donnees');
});
Route::get('/entreprises/export', [EntrepriseController::class, 'export'])->name('entreprises.export');

    // Routes pour l'export des bénéficiaires

// Route pour l'exportation
Route::get('/beneficiaires/export', [BeneficiaireController::class, 'export'])->name('beneficiaires.export');

// Routes pour la prévisualisation des PDF (optionnel, utile pour le développement)
Route::get('/beneficiaires/pdf-preview', [BeneficiaireController::class, 'generatePdfView'])->name('beneficiaires.pdf-preview');
Route::get('/beneficiaires/pdf-preview/{id}', [BeneficiaireController::class, 'generatePdfView'])->name('beneficiaires.pdf-preview.detail');

    //Route::get('/beneficiaires/export', [BeneficiaireController::class, 'export'])->name('beneficiaires.export');
// Ressources accessibles globalement (ou place-les aussi dans auth si besoin)
Route::resource('beneficiaires', BeneficiaireController::class);
Route::resource('entreprises', EntrepriseController::class);
Route::resource('ong', ONGController::class);
Route::resource('InstitutionFinanciere', InstitutionFinanciereController::class);
//Route::resource('indicateurs', IndicateurController::class);

// !!! La route export doit être définie avant cette ressource si elle n’est pas protégée

// Routes pour les coachs
Route::resource('coaches', CoachController::class);
Route::post('/coaches/{coach}/affecter-promoteurs', [CoachController::class, 'affecterPromoteurs'])
    ->name('coaches.affecter-promoteurs');
Route::delete('/coaches/{coach}/desaffecter-promoteur/{promoteurId}', [CoachController::class, 'desaffecterPromoteur'])
    ->name('coaches.desaffecter-promoteur');
Route::get('/coaches/{coach}/promoteurs-disponibles', [CoachController::class, 'getPromoteursDisponibles'])
    ->name('coaches.promoteurs-disponibles');

// Simplification avec Route::resource pour les formulaires exceptionnels
Route::resource('collectes/Exception', App\Http\Controllers\FormulaireExceptionnelController::class, [
    'names' => 'formulaires.exceptionnels'
]);

Route::get('/collectes/Exception', [App\Http\Controllers\FormulaireExceptionnelController::class, 'index'])->name('index');
Route::resource('collectes', controller: CollecteController::class);



// Routes pour les rôles (protégées par middleware)
Route::middleware(['auth', 'verified', 'permission:utilisateurs,view'])->prefix('roles')->group(function () {
    Route::get('/', [RoleController::class, 'index'])->name('roles.index');
    Route::get('/create', [RoleController::class, 'create'])->name('roles.create')->middleware('permission:utilisateurs,create');
    Route::post('/', [RoleController::class, 'store'])->name('roles.store')->middleware('permission:utilisateurs,create');
    Route::get('/{role}', [RoleController::class, 'show'])->name('roles.show');
    Route::get('/{role}/edit', [RoleController::class, 'edit'])->name('roles.edit')->middleware('permission:utilisateurs,edit');
    Route::put('/{role}', [RoleController::class, 'update'])->name('roles.update')->middleware('permission:utilisateurs,edit');
    Route::delete('/{role}', [RoleController::class, 'destroy'])->name('roles.destroy')->middleware('permission:utilisateurs,delete');
});

// Routes pour le profil utilisateur
Route::middleware(['auth', 'verified'])->prefix('profile')->group(function () {
    Route::get('/', [ProfileController::class, 'show'])->name('profile.show');
   // Route::get('/edit', [ProfileController::class, 'edit'])->name('profile.edit');
   // Route::put('/', [ProfileController::class, 'update'])->name('profile.update');
    Route::get('/password', [ProfileController::class, 'editPassword'])->name('profile.edit.password');
    Route::put('/password', [ProfileController::class, 'updatePassword'])->name('profile.update.password');
});

// Routes pour les utilisateurs (protégées par middleware)
Route::middleware(['auth', 'verified', 'permission:utilisateurs,view'])->prefix('users')->group(function () {
    Route::get('/', [UserController::class, 'index'])->name('users.index');
    Route::get('/create', [UserController::class, 'create'])->name('users.create')->middleware('permission:utilisateurs,create');
    Route::post('/', [UserController::class, 'store'])->name('users.store')->middleware('permission:utilisateurs,create');
    Route::get('/{user}', [UserController::class, 'show'])->name('users.show');
    Route::get('/{user}/edit', [UserController::class, 'edit'])->name('users.edit')->middleware('permission:utilisateurs,edit');
    Route::put('/{user}', [UserController::class, 'update'])->name('users.update')->middleware('permission:utilisateurs,edit');
    Route::get('/{user}/password', [UserController::class, 'editPassword'])->name('users.edit.password')->middleware('permission:utilisateurs,edit');
    Route::put('/{user}/password', [UserController::class, 'updatePassword'])->name('users.update.password')->middleware('permission:utilisateurs,edit');
    Route::delete('/{user}', [UserController::class, 'destroy'])->name('users.destroy')->middleware('permission:utilisateurs,delete');
});


Route::get('/data-dashboard', [UserController::class, 'getDashboard'])->name('users.dashboard')->middleware(['auth', 'verified']);
// Fichiers de configuration et d’auth




 // Routes pour la synchronisation offline
 Route::post('/collectes/sync-offline-data', [OfflineSyncController::class, 'syncOfflineData'])->name('collectes.sync-offline-data');





 /*
 |--------------------------------------------------------------------------
 | API Routes
 |--------------------------------------------------------------------------

 */



// Routes API - Ne pas appliquer le middleware Inertia à ces routes
Route::prefix('api')->group(function () {
    Route::middleware(['auth'])->group(function () {
        // API pour les indicateurs - Ces endpoints retournent du JSON, pas des réponses Inertia
        Route::get('/indicateurs/analyse', [IndicateursAnalyseController::class, 'getAnalyseData']);
        Route::get('/indicateurs/evolution', [IndicateursAnalyseController::class, 'getIndicateurEvolution']);
        Route::get('/indicateurs/export-excel', [IndicateursAnalyseController::class, 'exportExcel']);
        Route::get('/indicateurs/periodes', [IndicateursAnalyseController::class, 'getPeriodes']);
        Route::get('/indicateurs/exercices', [IndicateursAnalyseController::class, 'getExercices']);
        Route::get('/indicateurs/entreprises', [IndicateursAnalyseController::class, 'getEntreprises']);
        Route::get('/indicateurs/analyse-integree', [IndicateursAnalyseController::class, 'showAnalyseIntegree'])
    ->name('indicateurs.analyse-integree');
    });
});


//Route Temporaires:


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
