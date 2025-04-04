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
        Schema::create('indicateur_commercials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rapport_id')->constrained()->onDelete('cascade');

            // Indicateurs commerciaux
            $table->integer('nombre_clients')->nullable();
            $table->integer('nouveaux_clients')->nullable();
            $table->decimal('taux_retention', 8, 2)->nullable(); // En pourcentage
            $table->decimal('panier_moyen', 15, 2)->nullable();
            $table->integer('delai_paiement_moyen')->nullable(); // En jours
            $table->decimal('export_pourcentage', 8, 2)->nullable(); // En pourcentage
            $table->decimal('top_5_clients_pourcentage', 8, 2)->nullable(); // En pourcentage
            $table->decimal('backlog', 15, 2)->nullable();
            $table->decimal('carnet_commandes', 15, 2)->nullable();

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
        Schema::dropIfExists('indicateur_commercials');
    }
};
