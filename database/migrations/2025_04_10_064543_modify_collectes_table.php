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
    {
        Schema::table('collectes', function (Blueprint $table) {
            $table->string('periode')->nullable()->change();
            $table->string('type_collecte')->nullable()->change();
            $table->string('status')->default('draft')->nullable();





    }
);
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('collectes', function (Blueprint $table) {
            $table->string('periode')->nullable()->change();
            $table->string('type_collecte')->nullable()->change();;
            $table->string('status')->default('draft')->nullable();




        });
    }
};
