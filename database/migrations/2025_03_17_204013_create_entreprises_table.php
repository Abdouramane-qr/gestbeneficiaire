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
        Schema::create('entreprises', function (Blueprint $table) {
            $table->id();
            $table->foreignId('beneficiaires_id')->constrained('beneficiaires')->onDelete('cascade'); // Clé étrangère optimisée
            $table->string('nom_entreprise');
            $table->string('secteur_activite');
            $table->date('date_creation')->nullable();
            $table->enum('statut_juridique', ['SARL', 'SA', 'SAS', 'Auto-entrepreneur'])->nullable(); // Enum pour uniformiser les valeurs
            $table->string('adresse')->nullable();
            $table->string('ville')->nullable();
            $table->char('pays', 2); // ISO 3166-1 alpha-2
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('entreprises');
    }
};
