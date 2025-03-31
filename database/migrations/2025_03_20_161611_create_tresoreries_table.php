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
        Schema::create('tresoreries', function (Blueprint $table) {
            $table->id();
          //  $table->foreignId('indicateur_id')->constrained('indicateurs')->onDelete('cascade');
            $table->foreignId('entreprise_id')->constrained()->onDelete('cascade');
            $table->decimal('fonds_roulement', 15, 2)->nullable();
            $table->decimal('besoin_fonds_roulement', 15, 2)->nullable();
            $table->integer('nombre_credits_recus')->default(0);
            $table->decimal('montant_cumule_credits', 15, 2)->nullable();
            $table->decimal('pourcentage_echeances_impaye', 5, 2)->nullable();
            $table->integer('delai_moyen_reglement_clients')->nullable();
            $table->integer('delai_moyen_paiement_fournisseurs')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tresoreries');
    }
};
