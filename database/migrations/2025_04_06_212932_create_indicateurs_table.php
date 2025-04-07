<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('indicateurs', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('categorie'); // financier, commercial, production, rh...
            $table->text('description')->nullable();
            $table->json('fields'); // Les champs sous forme de JSON

            $table->timestamps();

            // Contrainte unique sur le nom de l'indicateur
            $table->unique('nom');
        });
    }

    public function down()
    {
        Schema::dropIfExists('indicateurs');
    }
};
