<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\{
    AnalyseController,
    BeneficiaireController,
    CollecteController,
    CoachController,
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


// Route pour les collectes occasionnelles
// Route::post('/collectes/occasionnel', [CollecteController::class, 'storeOccasionnel'])
//  ->name('collectes.storeOccasionnel');
    Route::get('/collectes/{collecte}', [CollecteController::class, 'show']);
   // Route::get('/collectes/{collecte}/edit', [CollecteController::class, 'edit'])->name('collectes.edit');
// Route pour récupérer les périodes disponibles (AJAX)
Route::get('/collectes/periodes-disponibles', [CollecteController::class, 'getAvailablePeriodes'])
    ->name('collectes.periodes-disponibles');

Route::pattern('collecte', '[0-9]+'); // Cela force le paramètre à être un nombre

    // Collectes
    Route::prefix('collectes')->name('collectes.')->group(function () {
        Route::post('/draft', [CollecteController::class, 'draft'])->name('draft');
        Route::post('/validate-multiple', [CollecteController::class, 'validateMultiple'])->name('validate-multiple');
        Route::post('/delete-multiple', [CollecteController::class, 'deleteMultiple'])->name('delete-multiple');
        Route::get('/export', [CollecteController::class, 'export'])->name('export');
        Route::put('/{collecte}/convert-to-standard', [CollecteController::class, 'convertToStandard'])->name('convert-to-standard');
    });

  // Routes pour l'analyse des indicateurs

   Route::get('/analyse/rapport-global', [AnalyseController::class, 'rapportGlobal'])->name('analyse.rapport.global');

   // Route pour les données statistiques (avec hachage MD5) - CORRIGÉE
   Route::get('/analyse/rapport-global/donnees', [AnalyseController::class, 'statistiquesData'])->name('analyse.rapport.global.donnees');

   // Routes pour les indicateurs
   Route::get('/analyse/indicateurs/donnees', [AnalyseController::class, 'getIndicateursData'])->name('analyse.indicateurs.donnees');

   // Routes pour le tableau de bord analytique
   Route::get('/analyse/dashboard/donnees', [AnalyseController::class, 'dashboardDonnees'])->name('analyse.dashboard.donnees');

   // Routes pour les séries temporelles
   Route::get('/analyse/timeseries/donnees', [AnalyseController::class, 'getTimeSeriesData'])->name('analyse.timeseries.donnees');

   // Routes pour les données comparatives
   Route::get('/analyse/comparative/donnees', [AnalyseController::class, 'getComparativeData'])->name('analyse.comparative.donnees');


// Assurez-vous que cette route est définie correctement
Route::get('/analyse/analyse/rapport-global/donnees', [AnalyseController::class, 'statistiquesData'])
    ->name('analyse.analyse.rapport-global.donnees');
// Routes pour l'analyse
Route::get('/analyse/rapport-global', [AnalyseController::class, 'rapportGlobal'])->name('analyse.rapport.global');
Route::get('/analyse/donnees', [AnalyseController::class, 'donnees'])->name('analyse.donnees');
Route::get('/analyse/dashboard/donnees', [AnalyseController::class, 'dashboardDonnees'])->name('analyse.dashboard.donnees');
Route::post('/analyse/export', [AnalyseController::class, 'export'])->name('analyse.export');
Route::post('/analyse/rapport', [AnalyseController::class, 'rapport'])->name('analyse.rapport');

 // Routes pour la synthèse
Route::get('/analyse/synthese', [AnalyseController::class, 'synthese'])->name('synthese');
Route::get('/analyse/synthese/donnees', [AnalyseController::class, 'getSyntheseDonnees'])->name('synthese.donnees');
});
Route::get('/entreprises/export', [EntrepriseController::class, 'export'])->name('entreprises.export');

    // Routes pour l'export des bénéficiaires
    Route::get('/beneficiaires/export', [BeneficiaireController::class, 'export'])->name('beneficiaires.export');
// Ressources accessibles globalement (ou place-les aussi dans auth si besoin)
Route::resource('beneficiaires', BeneficiaireController::class);
Route::resource('entreprises', EntrepriseController::class);
Route::resource('ong', ONGController::class);
Route::resource('InstitutionFinanciere', InstitutionFinanciereController::class);
Route::resource('indicateurs', IndicateurController::class);

// !!! La route export doit être définie avant cette ressource si elle n’est pas protégée
Route::resource('collectes', CollecteController::class);

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

    // Route::prefix('formulaires/exceptionnels')->name('formulaires.exceptionnels.')->group(function () {
    //     Route::get('/', [App\Http\Controllers\FormulaireExceptionnelController::class, 'index'])->name('index');
    //     Route::get('/create', [App\Http\Controllers\FormulaireExceptionnelController::class, 'create'])->name('create');
    //     Route::post('/', [App\Http\Controllers\FormulaireExceptionnelController::class, 'store'])->name('store');
    //     Route::get('/{collecte}', [App\Http\Controllers\FormulaireExceptionnelController::class, 'show'])->name('show');
    //     Route::get('/{collecte}/edit', [App\Http\Controllers\FormulaireExceptionnelController::class, 'edit'])->name('edit');
    //     Route::put('/{collecte}', [App\Http\Controllers\FormulaireExceptionnelController::class, 'update'])->name('update');
    //     Route::delete('/{collecte}', [App\Http\Controllers\FormulaireExceptionnelController::class, 'destroy'])->name('destroy');
    // });

// Fichiers de configuration et d’auth
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
