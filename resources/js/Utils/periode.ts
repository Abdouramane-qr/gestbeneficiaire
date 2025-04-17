/**
 * Classe utilitaire pour gérer les noms et la disponibilité des périodes
 */
export class PeriodeNameGenerator {
    /**
     * Génère des noms formatés pour les périodes d'un exercice
     * @param periodes Liste des périodes
     * @returns Map avec les IDs de période en clé et les noms formatés en valeur
     */
    static getPeriodeNamesForExercice(periodes: Periode[]): Map<number, string> {
        const periodeNames = new Map<number, string>();

        periodes.forEach(periode => {
            const annee = new Date(periode.date_debut).getFullYear();
            let nom = '';

            switch (periode.type_periode.toLowerCase()) {
                case 'mensuel':
                    { const mois = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                                'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
                    const moisIndex = new Date(periode.date_debut).getMonth();
                    nom = `${mois[moisIndex]} ${annee}`;
                    break; }

                case 'trimestriel':
                    { const trimestre = Math.floor(new Date(periode.date_debut).getMonth() / 3) + 1;
                    nom = `T${trimestre} ${annee}`;
                    break; }

                case 'semestriel':
                    { const semestre = Math.floor(new Date(periode.date_debut).getMonth() / 6) + 1;
                    nom = `S${semestre} ${annee}`;
                    break; }

                case 'annuel':
                    nom = `Annuel ${annee}`;
                    break;

                case 'occasionnel':
                    nom = `Occasionnel ${annee}`;
                    break;

                default:
                    nom = `${periode.type_periode} ${annee}`;
            }

            periodeNames.set(periode.id, nom);
        });

        return periodeNames;
    }

    /**
     * Filtre les périodes déjà utilisées dans les collectes
     * @param periodes Liste complète des périodes
     * @param existingCollectes Liste des collectes existantes
     * @returns Liste des périodes disponibles (non utilisées)
     */
    static filterAvailablePeriodes(periodes: Periode[], existingCollectes: any[]): Periode[] {
        // Créer un ensemble des périodes déjà utilisées
        const usedPeriodeIds = new Set(existingCollectes.map(c => c.periode_id));

        // Filtrer les périodes qui ne sont pas encore utilisées
        return periodes.filter(periode => !usedPeriodeIds.has(periode.id));
    }

    /**
     * Vérifie si une période est disponible pour une entreprise
     * @param periodeId ID de la période à vérifier
     * @param entrepriseId ID de l'entreprise
     * @param collectes Liste des collectes existantes
     */
    static isPeriodeAvailableForEntreprise(periodeId: number, entrepriseId: number, collectes: any[]): boolean {
        return !collectes.some(c =>
            c.periode_id === periodeId &&
            c.entreprise_id === entrepriseId
        );
    }

    /**
     * Obtient les détails d'une période par son ID
     * @param periodeId ID de la période
     * @param periodes Liste des périodes
     */
    static getPeriodeDetails(periodeId: number, periodes: Periode[]): Periode | undefined {
        return periodes.find(p => p.id === periodeId);
    }
}

/**
 * Interface pour les périodes
 */
export interface Periode {
    id: number;
    type_periode: string;
    exercice_id: number;
    date_debut: string;
    date_fin: string;
}

/**
 * Interface pour les détails d'une période
 */
export interface PeriodeDetails {
    id: number;
    nom: string;
    typePeriode: string;
    dateDebut: string;
    dateFin: string;
    disponible: boolean;
}
