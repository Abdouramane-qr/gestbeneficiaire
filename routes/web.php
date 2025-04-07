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



    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
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

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
