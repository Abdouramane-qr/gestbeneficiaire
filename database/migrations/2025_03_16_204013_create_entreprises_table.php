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
            $table->enum('secteur_activite',['Agriculture', 'Artisanat', 'Commerce', 'Élevage', 'Environnement']);
            $table->date('date_creation')->nullable();
            $table->enum('statut_juridique', ['SARL', 'SA', 'SAS','SCS','SNC' ,'GIE','SCP','SCI','Auto-entrepreneur'])->nullable(); // Enum pour uniformiser les valeurs
            $table->string('adresse')->nullable();
            $table->string('ville')->nullable();
            $table->string('pays'); // ISO 3166-1 alpha-2
            $table->text('description')->nullable();
            $table->text('domaine_activite')->nullable();
            $table->enum('niveau_mise_en_oeuvre', ['Création', 'Renforcement'])->nullable();
            $table->foreignId('ong_id')->nullable()->constrained('ongs')->nullOnDelete();
            $table->foreignId('institution_financiere_id')->nullable()->constrained('institution_financieres')->nullOnDelete();
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
