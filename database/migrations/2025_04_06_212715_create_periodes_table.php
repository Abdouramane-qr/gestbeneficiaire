<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('periodes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exercice_id')->constrained()->onDelete('cascade');
            $table->string('code');
            $table->string('nom')->nullable();
            $table->string('type_periode'); // Mensuel, Trimestriel, Semestriel...
            $table->integer('numero'); // 1, 2, 3, 4 pour les trimestres...
            $table->date('date_debut');
            $table->date('date_fin');
            $table->boolean('cloturee')->default(false);
            $table->timestamps();

            // Contrainte unique sur l'exercice et le code
            $table->unique(['exercice_id', 'code']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('periodes');
    }
};
