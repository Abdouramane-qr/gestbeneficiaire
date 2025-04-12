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
            $table->string('prenom');
            $table->date('date_de_naissance');
            $table->enum('genre', ['Homme', 'Femme']);
            $table->boolean('handicap')->default(false);
            $table->string('contact');
            $table->enum('niveau_instruction', ['Analphabète', 'Alphabétise',  'Primaire',  'CEPE', 'BEPC', 'Baccalauréat', 'Universitaire']);
            $table->string('email')->nullable();
            $table->string('activite');
            $table->enum('domaine_activite', ['Agriculture', 'Artisanat', 'Commerce', 'Élevage', 'environnement ']);
            $table->enum('niveau_mise_en_oeuvre', ['Création', 'Renforcement']);
            $table->foreignId('ong_id')->nullable()->constrained('ongs')->nullOnDelete();
          //  $table->foreignId('entreprise_id')->nullable()->constrained('entreprises')->onDelete('set null');
            $table->foreignId('institution_financiere_id')->nullable()->constrained('institution_financieres')->nullOnDelete();
            $table->date('date_inscription');
            $table->enum('statut_actuel', ['Actif', 'Inactif', 'En attente']);

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
