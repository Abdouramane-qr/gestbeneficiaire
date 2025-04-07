<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Indicateur;

class IndicateurSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $indicateurs = [
            [
                'nom' => 'Taux de scolarisation',
                'categorie' => 'Éducation',
                'description' => 'Pourcentage d’enfants inscrits à l’école par rapport à la population totale des enfants en âge scolaire.',
                'fields' => json_encode([
                    'annee' => 'int',
                    'region' => 'string',
                    'taux' => 'float'
                ])
            ],
            [
                'nom' => 'Taux de mortalité infantile',
                'categorie' => 'Santé',
                'description' => 'Nombre de décès d’enfants de moins de 1 an pour 1000 naissances vivantes.',
                'fields' => json_encode([
                    'annee' => 'int',
                    'region' => 'string',
                    'valeur' => 'float'
                ])
            ],
            [
                'nom' => 'Taux de chômage',
                'categorie' => 'Économie',
                'description' => 'Pourcentage de la population active sans emploi.',
                'fields' => json_encode([
                    'annee' => 'int',
                    'province' => 'string',
                    'pourcentage' => 'float'
                ])
            ]
        ];

        foreach ($indicateurs as $indicateur) {
            Indicateur::create($indicateur);
        }
    }
}
