<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\{
    AnalyseController,
    BeneficiaireController,
    CollecteController,
    EntrepriseController,
    ExerciceController,
    IndicateurController,
    InstitutionFinanciereController,
    ONGController,
    PeriodeController,
    DashboardController,

};

// Accueil
Route::get('/', fn () => Inertia::render('welcome'))->name('home');

// Authentification requise
Route::middleware(['auth', 'verified'])->group(function () {

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

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

    // Collectes
    Route::prefix('collectes')->name('collectes.')->group(function () {
        Route::post('/draft', [CollecteController::class, 'draft'])->name('draft');
        Route::post('/validate-multiple', [CollecteController::class, 'validateMultiple'])->name('validate-multiple');
        Route::post('/delete-multiple', [CollecteController::class, 'deleteMultiple'])->name('delete-multiple');
        Route::get('/export', [CollecteController::class, 'export'])->name('export');
        Route::put('/{collecte}/convert-to-standard', [CollecteController::class, 'convertToStandard'])->name('convert-to-standard');
    });

  // Routes pour l'analyse des indicateurs
Route::prefix('analyse')->name('analyse.')->group(function () {
    // Routes principales
    Route::get('/', [AnalyseController::class, 'index'])->name('index');
    Route::get('/donnees', [AnalyseController::class, 'getDonneesIndicateurs'])->name('donnees');
    Route::get('/rapport', [AnalyseController::class, 'genererRapport'])->name('rapport');
    Route::get('/export', [AnalyseController::class, 'exporterDonnees'])->name('export');
    Route::get('/debug', [AnalyseController::class, 'debug'])->name('debug');

    // Routes pour la synthèse
    Route::get('/synthese', [AnalyseController::class, 'synthese'])->name('synthese');
    Route::get('/synthese/donnees', [AnalyseController::class, 'getSyntheseDonnees'])->name('synthese.donnees');
});
    // Dashboard temporaire (commenté)
    // Route::get('/dashboard-temp', [DashboardTempController::class, 'index'])->name('dashboard.temp');
});

// Ressources accessibles globalement (ou place-les aussi dans auth si besoin)
Route::resource('beneficiaires', BeneficiaireController::class);
Route::resource('entreprises', EntrepriseController::class);
Route::resource('ong', ONGController::class);
Route::resource('InstitutionFinanciere', InstitutionFinanciereController::class);
Route::resource('indicateurs', IndicateurController::class);

// !!! La route export doit être définie avant cette ressource si elle n’est pas protégée
Route::resource('collectes', CollecteController::class);

// Fichiers de configuration et d’auth
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
