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
        Schema::create('coach_beneficiaires', function (Blueprint $table) {
            $table->id();
            $table->foreignId('coach_id')->constrained()->onDelete('cascade');
            $table->foreignId('beneficiaires_id')->constrained()->onDelete('cascade');
            $table->date('date_affectation');
            $table->boolean('est_actif')->default(true);
            $table->timestamps();

            $table->unique(['coach_id', 'beneficiaires_id'], 'unique_coach_beneficiaire');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('coach_beneficiaires');
    }
};
