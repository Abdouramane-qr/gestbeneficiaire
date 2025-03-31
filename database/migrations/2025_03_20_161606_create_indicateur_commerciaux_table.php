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
        Schema::create('indicateur_commerciaux', function (Blueprint $table) {
            $table->id();
           // $table->foreignId('indicateur_id')->constrained('indicateurs')->onDelete('cascade');
            $table->foreignId('entreprise_id')->constrained()->onDelete('cascade');
            $table->integer('nombre_clients_prospectes')->default(0);
            $table->integer('nombre_nouveaux_clients')->default(0);
            $table->integer('nombre_commandes')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('indicateur_commerciaux');
    }
};
