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
        Schema::create('indicateur_activites', function (Blueprint $table) {
            $table->id();
            //$table->foreignId('indicateur_id')->constrained('indicateurs')->onDelete('cascade');
            $table->foreignId('entreprise_id')->constrained('entreprises')->cascadeOnDelete();
            $table->integer('nombre_cycles_production')->default(0);
            $table->integer('nombre_clients')->default(0);
            $table->decimal('taux_croissance_clients', 8, 2)->default(0);
            $table->decimal('chiffre_affaires', 15, 2)->default(0);
            $table->decimal('taux_croissance_ca', 8, 2)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('indicateur_activites');
    }
};
