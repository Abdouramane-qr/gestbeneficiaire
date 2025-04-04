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
    {Schema::create('indicateur_productions', function (Blueprint $table) {
        $table->id();
        $table->foreignId('rapport_id')->constrained()->onDelete('cascade');

        // Indicateurs de production
        $table->decimal('taux_utilisation', 8, 2)->nullable(); // En pourcentage
        $table->decimal('taux_rebut', 8, 2)->nullable(); // En pourcentage
        $table->integer('delai_production_moyen')->nullable(); // En jours
        $table->decimal('cout_production', 15, 2)->nullable();
        $table->decimal('stock_matieres_premieres', 15, 2)->nullable();
        $table->decimal('stock_produits_finis', 15, 2)->nullable();
        $table->decimal('rotation_stocks', 8, 2)->nullable(); // Nombre de fois par an
        $table->integer('incidents_qualite')->nullable();
        $table->string('certifications')->nullable();

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
        Schema::dropIfExists('indicateur_productions');
    }
};
