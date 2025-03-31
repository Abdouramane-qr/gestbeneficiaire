<?php

namespace Database\Seeders;
use Illuminate\Support\Facades\DB;


use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class InstitutionsFinancieresSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        DB::table('institution_financieres')->insert([
            [
                'nom' => 'Banque Centrale du Burkina',
                'adresse' => 'Avenue Kwame Nkrumah',
                'ville' => 'Ouagadougou',
                'description' => 'Institution régulatrice du secteur bancaire.',
            ],
            [
                'nom' => 'Coris Bank International',
                'adresse' => 'Quartier des affaires, Ouaga 2000',
                'ville' => 'Ouagadougou',
                'description' => 'Banque commerciale avec présence en Afrique de l’Ouest.',
            ],
            [
                'nom' => 'Ecobank Burkina',
                'adresse' => 'Boulevard Charles De Gaulle',
                'ville' => 'Bobo-Dioulasso',
                'description' => 'Filiale du groupe bancaire panafricain Ecobank.',
            ],
        ]);

    }
}
