<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFrequencesTable extends Migration
{
    public function up()
    {
        Schema::create('frequences', function (Blueprint $table) {
            $table->id();
            $table->string('nom'); // Ex: Mensuel, Trimestriel, Annuel
            $table->string('code')->unique(); // Ex: M, T, A
            $table->integer('days_interval')->nullable(); // Jours entre les collectes
            $table->date('date_debut')->nullable(); // Date de début de collecte
            $table->date('date_fin')->nullable(); // Date de fin de collecte
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('frequences');
    }
}
