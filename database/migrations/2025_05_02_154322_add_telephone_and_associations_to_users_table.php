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
        Schema::table('users', function (Blueprint $table) {
            // Ajout de la colonne telephone
            // $table->string('telephone')->nullable()->unique()->after('email');
            // $table->timestamp('telephone_verified_at')->nullable()->after('email_verified_at');

            // Ajout des colonnes de type et d'association
           // $table->string('type')->nullable()->after('remember_token');
           // $table->unsignedBigInteger('role_id')->nullable()->after('type');
            $table->unsignedBigInteger('coach_id')->nullable()->after('role_id');
            $table->unsignedBigInteger('ong_id')->nullable()->after('coach_id');
            $table->unsignedBigInteger('institution_id')->nullable()->after('ong_id');
            $table->unsignedBigInteger('beneficiaire_id')->nullable()->after('institution_id');

            // Ajout des contraintes de clé étrangère
            //$table->foreign('role_id')->references('id')->on('roles')->onDelete('set null');
            $table->foreign('coach_id')->references('id')->on('coaches')->onDelete('set null');
            $table->foreign('ong_id')->references('id')->on('ongs')->onDelete('set null');
            $table->foreign('institution_id')->references('id')->on('institution_financieres')->onDelete('set null');
            $table->foreign('beneficiaire_id')->references('id')->on('beneficiaires')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Suppression des clés étrangères
           // $table->dropForeign(['role_id']);
            $table->dropForeign(['coach_id']);
            $table->dropForeign(['ong_id']);
            $table->dropForeign(['institution_id']);
            $table->dropForeign(['beneficiaire_id']);

            // Suppression des colonnes
            $table->dropColumn([
                // 'telephone',
                // 'telephone_verified_at',
                //'type',
                //'role_id',
                'coach_id',
                'ong_id',
                'institution_id',
                'beneficiaire_id'
            ]);
        });
    }
};
