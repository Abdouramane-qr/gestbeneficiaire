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
        Schema::create('indicateur_r_h_s', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rapport_id')->constrained()->onDelete('cascade');

            // Indicateurs RH
            $table->integer('effectif_total')->nullable();
            $table->decimal('cadres_pourcentage', 8, 2)->nullable(); // En pourcentage
            $table->decimal('turnover', 8, 2)->nullable(); // En pourcentage
            $table->decimal('absenteisme', 8, 2)->nullable(); // En pourcentage
            $table->decimal('masse_salariale', 15, 2)->nullable();
            $table->decimal('cout_formation', 15, 2)->nullable();
            $table->decimal('anciennete_moyenne', 5, 2)->nullable(); // En années
            $table->integer('accidents_travail')->nullable();
            $table->decimal('index_egalite', 5, 2)->nullable(); // Sur 100

            $table->timestamps();

            // Un seul enregistrement par rapport
            $table->unique(['rapport_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('indicateur_r_h_s');
    }
};
