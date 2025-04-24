<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('beneficiaires', function (Blueprint $table) {
            $table->id();
            $table->string('regions');
            $table->string('provinces');
            $table->string('communes');
            $table->string('village')->nullable();
            $table->enum('type_beneficiaire', ['Individuel', 'Coopérative', 'Autre']);
            $table->string('nom');
            $table->string('prenom')->nullable();
            $table->date('date_de_naissance')->nullable();
            $table->string('nom_cooperative')->nullable();
            $table->string('numero_enregistrement')->nullable();
            $table->enum('genre', ['Homme', 'Femme'])->nullable();
            $table->string('contact');
            $table->enum('niveau_instruction', ['Analphabète', 'Alphabétisé', 'Primaire', 'CEP', 'BEPC', 'Baccalauréat', 'Universitaire'])->nullable();            $table->string('email')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('beneficiaires');
    }
};
