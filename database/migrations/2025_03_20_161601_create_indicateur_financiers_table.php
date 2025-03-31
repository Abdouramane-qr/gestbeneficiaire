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
           // $table->foreignId('indicateur_id')->constrained('indicateurs')->onDelete('cascade');
            $table->foreignId('entreprise_id')->constrained()->onDelete('cascade');
            $table->decimal('rendement_fonds_propres', 10, 2)->nullable();
            $table->decimal('autosuffisance_operationnelle', 10, 2)->nullable();
            $table->decimal('marge_beneficiaire', 10, 2)->nullable();
            $table->decimal('autosuffisance_financiere', 10, 2)->nullable();
            $table->decimal('ratio_liquidite_generale', 10, 2)->nullable();
            $table->decimal('ratio_charges_financieres', 10, 2)->nullable();
            $table->timestamps();
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
