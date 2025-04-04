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
        Schema::create('rapports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('entreprise_id')->constrained()->onDelete('cascade');
            $table->string('periode'); // Trimestriel, Semestriel, Annuel
            $table->year('annee');
            $table->string('statut')->default('brouillon'); // brouillon, soumis, validé, rejeté
            $table->timestamp('date_soumission')->nullable();
            $table->string('valide_par')->nullable();
            $table->timestamps();

            // Contrainte d'unicité pour éviter les doublons
            $table->unique(['entreprise_id', 'periode', 'annee']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rapports');
    }
};
