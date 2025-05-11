<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('formations', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // 'technique' ou 'entrepreneuriat'
            $table->string('libelle');
            $table->boolean('actif')->default(true);
            $table->integer('ordre')->default(0);
            $table->timestamps();

            // Pour éviter les doublons
            $table->unique(['type', 'libelle']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('formations');
    }
};
