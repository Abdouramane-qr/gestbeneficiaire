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
         // Table des objectifs pour les indicateurs
         Schema::create('objectifs_indicateurs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('entreprise_id')->constrained()->onDelete('cascade');
            $table->string('type_indicateur'); // 'financier', 'commercial', 'rh', 'production'
            $table->string('champ');
            $table->decimal('valeur_cible', 15, 4);
            $table->year('annee');
            $table->text('commentaire')->nullable();
            $table->timestamps();

            // Unicité de l'objectif pour un champ/année spécifique
            $table->unique(['entreprise_id', 'type_indicateur', 'champ', 'annee']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('objectif_indicateurs');
    }
};
