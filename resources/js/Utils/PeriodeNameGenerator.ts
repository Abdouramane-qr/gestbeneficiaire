import { Periode } from './periodeTypes';

export class PeriodeNameGenerator {
  private static mois = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

  static getPeriodeNamesForExercice(periodes: Periode[]): Map<number, string> {
    const periodeNames = new Map<number, string>();

    periodes.forEach(periode => {
      periodeNames.set(periode.id, this.generatePeriodeName(periode));
    });

    return periodeNames;
  }

  private static generatePeriodeName(periode: Periode): string {
    if (periode.nom) return periode.nom;

    const annee = new Date(periode.date_debut).getFullYear();
    const type = periode.type_periode.toLowerCase();

    switch (type) {
      case 'mensuel':
      case 'mensuelle':
        return `${this.mois[new Date(periode.date_debut).getMonth()]} ${annee}`;
      case 'trimestriel':
      case 'trimestrielle':
        return `T${Math.floor(new Date(periode.date_debut).getMonth() / 3) + 1} ${annee}`;
      case 'semestriel':
      case 'semestrielle':
        return `S${Math.floor(new Date(periode.date_debut).getMonth() / 6) + 1} ${annee}`;
      case 'annuel':
      case 'annuelle':
        return `Annuel ${annee}`;
      case 'occasionnel':
      case 'occasionnelle':
        return `Occasionnel ${annee}`;
      default:
        return `${periode.type_periode} ${annee}`;
    }
  }

  static filterAvailablePeriodes(periodes: Periode[], existingCollectes: { periode_id: number }[]): Periode[] {
    const usedPeriodeIds = new Set(existingCollectes.map(c => c.periode_id));
    return periodes.filter(periode => !usedPeriodeIds.has(periode.id));
  }
}

export function mapTypePeriode(typePeriode: string): string {
  const typeMap: Record<string, string> = {
    'Trimestriel': 'Trimestrielle',
    'Mensuelle': 'Mensuelle',
    'mensuelle': 'Mensuelle',
    'trimestriel': 'Trimestrielle',
    'Semestriel': 'Semestrielle',
    'semestriel': 'Semestrielle',
    'Annuel': 'Annuelle',
    'annuel': 'Annuelle',
    'Occasionnel': 'Occasionnelle',
    'occasionnel': 'Occasionnelle'
  };
  return typeMap[typePeriode] || typePeriode;
}
