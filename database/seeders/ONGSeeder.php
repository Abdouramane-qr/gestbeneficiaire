<?php

namespace Database\Seeders;
use App\Models\ONG; // Importez la classe ONG depuis app/Models

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ONGSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('ongs')->insert([
            [
                'nom' => 'Santé pour Tous',
                'adresse' => '789 Boulevard de la Santé',
                'description' => 'ONG dédiée à l\'amélioration des soins de santé en milieu rural.',
            ],
            [
                'nom' => 'Éducation Avenir',
                'adresse' => '321 Chemin de l\'École',
                'description' => 'Organisation œuvrant pour l\'éducation des enfants défavorisés.',
            ],
            // Ajoutez d'autres ONG ici
        ]);
    }
}
