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
        Schema::create('indicateur_sociaux', function (Blueprint $table) {
            $table->id();
         //   $table->foreignId('indicateur_id')->constrained('indicateurs')->onDelete('cascade');
            $table->foreignId('entreprise_id')->constrained()->onDelete('cascade');
            $table->integer('nombre_employes')->default(0);
            $table->integer('nombre_stagiaires')->default(0);
            $table->integer('nombre_nouveaux_recrutements')->default(0);
            $table->integer('nombre_depart')->default(0);
            $table->decimal('taux_renouvellement_effectifs', 5, 2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('indicateur_sociaux');
    }
};
