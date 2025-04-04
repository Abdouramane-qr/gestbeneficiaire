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
        Schema::create('indicateur_financiers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rapport_id')->constrained()->onDelete('cascade');

            // Indicateurs financiers
            $table->decimal('chiffre_affaires', 15, 2)->nullable();
            $table->decimal('resultat_net', 15, 2)->nullable();
            $table->decimal('ebitda', 15, 2)->nullable();
            $table->decimal('marge_ebitda', 8, 2)->nullable(); // En pourcentage
            $table->decimal('cash_flow', 15, 2)->nullable();
            $table->decimal('dette_nette', 15, 2)->nullable();
            $table->decimal('ratio_dette_ebitda', 8, 2)->nullable();
            $table->decimal('fonds_propres', 15, 2)->nullable();
            $table->decimal('ratio_endettement', 8, 2)->nullable(); // En pourcentage
            $table->decimal('besoin_fonds_roulement', 15, 2)->nullable();
            $table->decimal('tresorerie_nette', 15, 2)->nullable();
            $table->decimal('investissements', 15, 2)->nullable();

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
        Schema::dropIfExists('indicateur_financiers');
    }
};
