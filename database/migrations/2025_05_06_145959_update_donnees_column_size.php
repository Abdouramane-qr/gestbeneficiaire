<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class UpdateDonneesColumnSize extends Migration
{
    public function up()
    {
        DB::statement('ALTER TABLE collectes ALTER COLUMN donnees TYPE TEXT');
    }

    public function down()
    {
        DB::statement('ALTER TABLE collectes ALTER COLUMN donnees TYPE JSON USING donnees::json');
    }
}
