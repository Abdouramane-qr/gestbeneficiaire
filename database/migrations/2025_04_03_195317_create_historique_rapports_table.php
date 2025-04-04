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
    {Schema::create('historique_rapports', function (Blueprint $table) {
        $table->id();
        $table->foreignId('rapport_id')->constrained()->onDelete('cascade');
        $table->string('type_indicateur'); // 'financier', 'commercial', 'rh', 'production'
        $table->string('champ');
        $table->decimal('valeur_precedente', 15, 4)->nullable();
        $table->decimal('valeur_actuelle', 15, 4)->nullable();
        $table->decimal('variation_pourcentage', 8, 2)->nullable();
        $table->timestamp('date_modification');
        $table->timestamps();

        // Index pour optimiser les requêtes
        $table->index(['rapport_id', 'type_indicateur', 'champ']);
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('historique_rapports');
    }
};
