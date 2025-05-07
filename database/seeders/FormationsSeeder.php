<?php

namespace Database\Seeders;

use App\Models\Formation;
use Illuminate\Database\Seeder;

class FormationsSeeder extends Seeder
{
    public function run()
    {
        // Formations techniques
        $formationsTechniques = [
            "Gestion de la qualité",
            "Techniques de production",
            "Gestion de l'approvisionnement",
            "Techniques de transformation",
            "Contrôle de la qualité",
            "Normes et certification"
        ];

        $ordre = 10;
        foreach ($formationsTechniques as $formation) {
            Formation::create([
                'type' => 'technique',
                'libelle' => $formation,
                'actif' => true,
                'ordre' => $ordre
            ]);
            $ordre += 10;
        }

        // Formations entrepreneuriat
        $formationsEntrepreneuriat = [
            "Gestion d'entreprise",
            "Marketing et vente",
            "Comptabilité de base",
            "Planification financière",
            "Plan d'affaires",
            "Leadership et gestion d'équipe"
        ];

        $ordre = 10;
        foreach ($formationsEntrepreneuriat as $formation) {
            Formation::create([
                'type' => 'entrepreneuriat',
                'libelle' => $formation,
                'actif' => true,
                'ordre' => $ordre
            ]);
            $ordre += 10;
        }
    }
}
