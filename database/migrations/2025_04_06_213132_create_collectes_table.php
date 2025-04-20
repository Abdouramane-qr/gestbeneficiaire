<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('collectes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('entreprise_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('exercice_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('periode_id')->nullable()->constrained()->onDelete('cascade');
            // $table->foreignId('indicateur_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('type_collecte');
            $table->string('periode'); // Peut être redondant avec periode_id mais pratique
            $table->date('date_collecte')->nullable();
            $table->json('donnees')->nullable();
            $table->timestamps();

            // Contrainte unique pour éviter les doublons
            $table->unique(['entreprise_id', 'periode_id','type_collecte']);
        });
    }

    public function down(Blueprint $table)
    {


    }
};
