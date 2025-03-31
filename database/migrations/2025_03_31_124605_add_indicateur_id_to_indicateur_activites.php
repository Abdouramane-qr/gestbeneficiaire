<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('indicateur_activites', function (Blueprint $table) {
            $table->foreignId('indicateur_id')->constrained('indicateurs')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::table('indicateur_activites', function (Blueprint $table) {
            $table->dropForeign(['indicateur_id']);
            $table->dropColumn('indicateur_id');
        });
    }
};
