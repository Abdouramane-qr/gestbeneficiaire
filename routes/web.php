<?php

use App\Http\Controllers\EntrepriseController;
use App\Models\Beneficiaire;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\BeneficiaireController;
use App\Http\Controllers\InstitutionFinanciereController;
use App\Http\Controllers\ONGController;
use App\Http\Controllers\FrequenceController;
use App\Http\Controllers\IndicateurController;
use App\Http\Controllers\CollecteController;


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
Route::apiResource('Frequencies', FrequenceController::class);
Route::apiResource('Indicateurs', IndicateurController::class);
Route::apiResource('DataCollections', CollecteController::class);






require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
