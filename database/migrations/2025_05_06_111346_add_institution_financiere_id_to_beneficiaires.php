<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
{
    Schema::table('beneficiaires', function (Blueprint $table) {
        $table->unsignedBigInteger('institution_financiere_id')->nullable();
    });
}

public function down()
{
    Schema::table('beneficiaires', function (Blueprint $table) {
        $table->dropColumn('institution_financiere_id');
    });
}

};
