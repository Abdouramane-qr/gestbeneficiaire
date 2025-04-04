<?php

use App\Http\Controllers\EntrepriseController;
use App\Models\Beneficiaire;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\BeneficiaireController;
use App\Http\Controllers\InstitutionFinanciereController;
use App\Http\Controllers\ONGController;
use App\Http\Controllers\RapportController;
use App\Http\Controllers\AnalyseController;


Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});
Route::resource('beneficiaires', BeneficiaireController::class);
Route::resource('entreprises', EntrepriseController::class);
Route::resource('ong', ONGController::class);
Route::resource('InstitutionFinanciere', InstitutionFinanciereController::class);

// Soumission des différentes catégories d'indicateurs
Route::post('/entreprises/{entreprise}/rapports/{rapport}/financiers', [RapportController::class, 'submitFinanciers'])->name('rapports.submitFinanciers');
Route::post('/entreprises/{entreprise}/rapports/{rapport}/commerciaux', [RapportController::class, 'submitCommerciaux'])->name('rapports.submitCommerciaux');
Route::post('/entreprises/{entreprise}/rapports/{rapport}/rh', [RapportController::class, 'submitRH'])->name('rapports.submitRH');
Route::post('/entreprises/{entreprise}/rapports/{rapport}/production', [RapportController::class, 'submitProduction'])->name('rapports.submitProduction');

//Route::get('/entreprises/{entreprise}/rapports/{rapport}/edit/{tab?}', [RapportController::class, 'edit'])
    //->name('rapports.edit.tab');

// Dans web.php
Route::get('/rapports/{tab?}', [RapportController::class, 'edit'])
    ->name('rapports.edit');
// Analyses
Route::get('/analyses/secteurs', [AnalyseController::class, 'secteurs'])->name('analyses.secteurs');
Route::get('/analyses/comparaison', [AnalyseController::class, 'comparaison'])->name('analyses.comparaison');
Route::get('/analyses/tendances', [AnalyseController::class, 'tendances'])->name('analyses.tendances');


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
