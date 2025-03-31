<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCollectesTable extends Migration
{
    public function up()
    {
        Schema::create('collectes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('entreprise_id')->constrained()->onDelete('cascade');
            $table->foreignId('indicateur_id')->constrained()->onDelete('cascade');
            $table->foreignId('frequence_id')->constrained()->onDelete('cascade');
            $table->json('data')->nullable()->after('date_collecte');
            $table->date('date_collecte');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('collectes');
    }
}

