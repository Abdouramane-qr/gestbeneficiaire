<?php

use App\Http\Controllers\EntrepriseController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\BeneficiaireController;
use App\Http\Controllers\InstitutionFinanciereController;
use App\Http\Controllers\ONGController;
use App\Http\Controllers\PeriodeController;
use App\Http\Controllers\ExerciceController;
use App\Http\Controllers\IndicateurController;
use App\Http\Controllers\CollecteController;



Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {


    Route::resources([
        'exercices' => ExerciceController::class,
        'periodes' => PeriodeController::class,
    ]);

    Route::get('/dashboard', [App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');


});
Route::resource('beneficiaires', BeneficiaireController::class);
Route::resource('entreprises', EntrepriseController::class);
Route::resource('ong', ONGController::class);
Route::resource('InstitutionFinanciere', InstitutionFinanciereController::class);
Route::resource('exercices', ExerciceController::class)->except(['show']);
// Routes pour les indicateurs
Route::resource('indicateurs', IndicateurController::class);
Route::resource('collectes', CollecteController::class);
Route::post('/collectes/draft', [CollecteController::class, 'draft'])->name('collectes.draft');

 // Routes supplémentaires qui ne sont pas couvertes par resource
 Route::patch('exercices/{exercice}/activate', [ExerciceController::class, 'activate'])->name('exercices.activate');
 Route::patch('periodes/{periode}/cloture', [PeriodeController::class, 'cloture'])->name('periodes.cloture');
 Route::patch('periodes/{periode}/reouverture', [PeriodeController::class, 'reouverture'])->name('periodes.reouverture');
 Route::get('/periodes/{periode}/collectes', [PeriodeController::class, 'collectes'])->name('periodes.collectes');
 Route::get('/periodes/{periode}/collectes/create', [PeriodeController::class, 'createCollecte'])->name('periodes.collectes.create');
 // Dans routes/web.php, ajoutez cette route:
Route::put('/collectes/{collecte}/convert-to-standard', [CollecteController::class, 'convertToStandard'])
->name('collectes.convert-to-standard');

// Route::get('/analyse-indicateurs', [IndicateurController::class, 'index'])
//         ->name('analyse.indicateurs.index');

//     Route::get('/analyse-indicateurs/filtrer', [IndicateurController::class, 'filtrer'])
//         ->name('analyse.indicateurs.filtrer');

//     Route::get('/analyse-indicateurs/exporter', [IndicateurController::class, 'exporter'])
//         ->name('analyse.indicateurs.exporter');

Route::get('/analyse', [App\Http\Controllers\AnalyseController::class, 'index'])->name('analyse.index');

    // Endpoint API pour récupérer les données filtrées
    Route::post('/analyse/donnees', [App\Http\Controllers\AnalyseController::class, 'getDonneesIndicateurs'])->name('analyse.donnees');

    // Génération de rapport détaillé
    Route::post('/analyse/rapport', [App\Http\Controllers\AnalyseController::class, 'genererRapport'])->name('analyse.rapport');

    // Export des données
    Route::post('/analyse/export', [App\Http\Controllers\AnalyseController::class, 'exporterDonnees'])->name('analyse.export');

  ///  Route::get('/dashboard-temp', [App\Http\Controllers\DashboardTempController::class, 'index'])->name('dashboard.temp');
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
