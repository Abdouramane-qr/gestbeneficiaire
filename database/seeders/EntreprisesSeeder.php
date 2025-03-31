<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class EntreprisesSeeder extends Seeder
{
    public function run()
    {
        DB::table('entreprises')->insert([
            [
                'beneficiaires_id' => 1,
                'nom_entreprise' => 'Tech Innov',
                'secteur_activite' => 'Technologie',
                'date_creation' => '2015-06-15',
                'statut_juridique' => 'SARL',
                'adresse' => '654 Rue de l\'Innovation',
                'ville' => 'Ouagadougou',
                'pays' => 'BF',
                'description' => 'Entreprise spécialisée dans le développement de solutions logicielles.',
            ],
            [
                'beneficiaires_id' => 2,
                'nom_entreprise' => 'AgriCulture',
                'secteur_activite' => 'Agriculture',
                'date_creation' => '2010-09-20',
                'statut_juridique' => 'SA',
                'adresse' => '987 Route des Champs',
                'ville' => 'Koudougou',
                'pays' => 'BF',
                'description' => 'Entreprise agricole axée sur les cultures durables.',
            ],
            // Ajoutez d'autres entreprises ici
        ]);
}
}
