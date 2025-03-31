<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateIndicateursTable extends Migration
{
    public function up()
    {
        Schema::create('indicateurs', function (Blueprint $table) {
            $table->id();
            $table->string('nom'); // Ex: Chiffre d'affaires, Nombre de clients
            $table->string('categorie'); // Ex: Activité, Social, Financier, Commercial
            $table->text('description')->nullable(); // Ajout du champ description
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('indicateurs');
    }
}
