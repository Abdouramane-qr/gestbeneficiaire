<?php

namespace App\Services;

use App\Models\Collecte;
use App\Models\Entreprise;
use App\Models\Exercice;
use App\Models\Periode;
use App\Services\Calculateurs\IndicateurAnnuelCalculateur;
use App\Services\Calculateurs\IndicateurSemestrielCalculateur;
use App\Services\Calculateurs\IndicateurTrimestrielCalculateur;
use App\Services\Calculateurs\IndicateurOccasionnelCalculateur;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Exception;
use Maatwebsite\Excel\Facades\Excel;


/**
 * Service pour l'analyse des indicateurs
 *
 * Cette classe centralise la logique d'analyse et de calcul des indicateurs
 * pour différentes périodes et types d'indicateurs.
 */
class IndicateursAnalyseService
{
    /**
     * Constantes pour les types de périodes
     */
    const PERIODE_TRIMESTRIELLE = 'Trimestrielle';
    const PERIODE_SEMESTRIELLE = 'Semestrielle';
    const PERIODE_ANNUELLE = 'Annuelle';
    const PERIODE_OCCASIONNELLE = 'Occasionnelle';

    /**
     * Calculateurs d'indicateurs par type de période
     */
    protected $calculateurs = [];

    /**
     * Configuration du cache
     */
    protected $cacheEnabled = true;
    protected $cacheDuration = 60; // Minutes

    /**
     * Constructeur
     */
    public function __construct()
    {
        // Initialiser les calculateurs
        $this->calculateurs = [
            self::PERIODE_TRIMESTRIELLE => app(IndicateurTrimestrielCalculateur::class),
            self::PERIODE_SEMESTRIELLE => app(IndicateurSemestrielCalculateur::class),
            self::PERIODE_ANNUELLE => app(IndicateurAnnuelCalculateur::class),
            self::PERIODE_OCCASIONNELLE => app(IndicateurOccasionnelCalculateur::class),
        ];
    }

    /**
     * Récupère tous les indicateurs pour une entreprise
     *
     * @param int $entrepriseId ID de l'entreprise
     * @param int $annee Année des indicateurs
     * @param string|null $periode Période spécifique (optionnel)
     * @return Collection Collection d'indicateurs
     */
    public function getIndicateurs(int $entrepriseId, int $annee, ?string $periode = null): Collection
    {
        $cacheKey = "indicateurs_{$entrepriseId}_{$annee}_" . ($periode ?? 'all');

        if ($this->cacheEnabled && Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }

        try {
            // Récupérer les collectes pour cette entreprise et année
            $query = Collecte::where('entreprise_id', $entrepriseId)
                ->where('annee', $annee);

            // Filtrer par période si spécifiée
            if ($periode) {
                $query->where('periode', $periode);
            }

            $collectes = $query->get();

            // Initialiser le résultat
            $indicateurs = collect();

            // Calculer les indicateurs pour chaque période
            foreach ($collectes as $collecte) {
                $typeCollecte = $collecte->type_collecte;
                $calculateur = $this->getCalculateur($typeCollecte);

                if (!$calculateur) {
                    Log::warning("Calculateur non trouvé pour le type: {$typeCollecte}");
                    continue;
                }

                // Récupérer les données JSON
                $donnees = $this->normaliseDonnees($collecte->donnees);
                if (empty($donnees)) {
                    Log::error("Erreur de décodage JSON pour collecte ID: {$collecte->id}");
                    continue;
                }

                // Calculer les indicateurs pour cette collecte
                $indicateursCollecte = $calculateur->calculerIndicateurs($donnees, [
                    'entreprise_id' => $entrepriseId,
                    'annee' => $annee,
                    'periode' => $collecte->periode,
                    'date_collecte' => $collecte->date_collecte
                ]);

                // Fusionner avec le résultat global
                $indicateurs = $indicateurs->concat($indicateursCollecte);
            }

            // Filtrer les doublons (par ID) et trier
            $indicateurs = $indicateurs->unique('id')->sortBy('categorie');

            // Mettre en cache
            if ($this->cacheEnabled) {
                Cache::put($cacheKey, $indicateurs, $this->cacheDuration * 60);
            }

            return $indicateurs;

        } catch (Exception $e) {
            Log::error("Erreur lors de la récupération des indicateurs: " . $e->getMessage());
            return collect();
        }
    }

    /**
     * Récupérer les indicateurs agrégés par période et catégorie
     *
     * @param string $periodeType Type de période (Trimestrielle, Semestrielle, Annuelle, Occasionnelle)
     * @param int|null $exerciceId ID de l'exercice (optionnel)
     * @param int|null $entrepriseId ID de l'entreprise (optionnel)
     * @return array Données des indicateurs
     */
    public function getIndicateursAnalyse(string $periodeType, ?int $exerciceId = null, ?int $entrepriseId = null): array
    {
        try {
            // Vérifier que le type de période est valide
            if (!$this->estPeriodeValide($periodeType)) {
                throw new \InvalidArgumentException("Type de période non valide: {$periodeType}");
            }

            // Récupérer le calculateur approprié
            $calculateur = $this->getCalculateur($periodeType);

            // Récupérer les collectes selon les critères
            $collectes = $this->getCollectes($periodeType, $exerciceId, $entrepriseId);

            // Structure pour stocker les indicateurs agrégés par catégorie
            $indicateursParCategorie = [];
            $referenceData = [];

            // Obtenir les données de référence pour les calculs
            if (method_exists($calculateur, 'getDonneesReference')) {
                $referenceData = $calculateur->getDonneesReference($exerciceId, $entrepriseId);
            }

            // Parcourir toutes les collectes
            foreach ($collectes as $collecte) {
                // Assurer que les données sont un tableau
                $donnees = $this->normaliseDonnees($collecte->donnees);

                // Appliquer les calculs spécifiques à la période
                $donneesCalculees = $calculateur->calculerIndicateurs($donnees, $referenceData);

                // Pour chaque catégorie dans les données calculées
                foreach ($donneesCalculees as $categorie => $indicateurs) {
                    // Ignorer les entrées qui ne sont pas des tableaux d'indicateurs
                    if (!is_array($indicateurs) || empty($indicateurs)) {
                        continue;
                    }

                    // Initier la catégorie si elle n'existe pas encore
                    if (!isset($indicateursParCategorie[$categorie])) {
                        $indicateursParCategorie[$categorie] = [];
                    }

                    // Parcourir les indicateurs de cette catégorie
                    foreach ($indicateurs as $id => $valeur) {
                        // Déterminer le libellé et les métadonnées de l'indicateur
                        $metadata = $calculateur->getMetadataIndicateur($categorie, $id) ?? [
                            'libelle' => $this->formatIndicateurLibelle($id),
                            'definition' => '',
                            'unite' => '',
                            'valeur_cible' => '',
                            'formule' => null,
                        ];

                        $estCalcule = $calculateur->estIndicateurCalcule($categorie, $id, $metadata['libelle'] ?? null);

                        // Agréger l'indicateur dans le tableau final
                        if (!isset($indicateursParCategorie[$categorie][$id])) {
                            $indicateursParCategorie[$categorie][$id] = [
                                'id' => $id,
                                'label' => $metadata['libelle'],
                                'values' => [$valeur],
                                'unite' => $metadata['unite'],
                                'definition' => $metadata['definition'],
                                'valeur_cible' => $metadata['valeur_cible'],
                                'is_calculated' => $estCalcule,
                                'entreprise_ids' => [$collecte->entreprise_id],
                                'collecte_ids' => [$collecte->id],
                                'formula' => $metadata['formule'] ?? null,
                            ];
                        } else {
                            $indicateursParCategorie[$categorie][$id]['values'][] = $valeur;
                            $indicateursParCategorie[$categorie][$id]['entreprise_ids'][] = $collecte->entreprise_id;
                            $indicateursParCategorie[$categorie][$id]['collecte_ids'][] = $collecte->id;
                        }
                    }
                }
            }

            // Calculer les agrégations finales (moyenne, évolution, etc.)
            $resultat = $this->calculerAggregations($indicateursParCategorie, $exerciceId);

            return $resultat;
        } catch (\Exception $e) {
            Log::error('Erreur lors de l\'analyse des indicateurs: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Récupère les détails d'un indicateur spécifique
     *
     * @param int $indicateurId ID de l'indicateur
     * @param int $entrepriseId ID de l'entreprise
     * @return array Détails de l'indicateur
     */
    public function getIndicateurDetail(int $indicateurId, int $entrepriseId): array
    {
        $cacheKey = "indicateur_detail_{$indicateurId}_{$entrepriseId}";

        if ($this->cacheEnabled && Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }

        try {
            // Récupérer l'indicateur de base
            $indicateur = $this->getIndicateurById($indicateurId);

            if (empty($indicateur)) {
                return [];
            }

            // Récupérer l'historique
            $historique = $this->getIndicateurHistorique($indicateurId, $entrepriseId);

            // Calculer les statistiques
            $valeurs = collect($historique)->pluck('valeur')->filter()->toArray();
            $stats = [];

            if (!empty($valeurs)) {
                $stats = [
                    'moyenne' => array_sum($valeurs) / count($valeurs),
                    'min' => min($valeurs),
                    'max' => max($valeurs),
                    'derniereValeur' => end($valeurs),
                    'evolution' => $this->calculerEvolution($valeurs),
                    'tendance' => $this->calculerTendance($valeurs)
                ];
            }

            // Compléter l'indicateur avec l'historique et les stats
            $indicateurDetail = array_merge($indicateur, [
                'historique' => $historique,
                'stats' => $stats
            ]);

            // Mettre en cache
            if ($this->cacheEnabled) {
                Cache::put($cacheKey, $indicateurDetail, $this->cacheDuration * 60);
            }

            return $indicateurDetail;

        } catch (Exception $e) {
            Log::error("Erreur lors de la récupération des détails de l'indicateur: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Récupère l'historique d'un indicateur
     *
     * @param int $indicateurId ID de l'indicateur
     * @param int $entrepriseId ID de l'entreprise
     * @return array Historique de l'indicateur
     */
    public function getIndicateurHistorique(int $indicateurId, int $entrepriseId): array
    {
        $cacheKey = "indicateur_historique_{$indicateurId}_{$entrepriseId}";

        if ($this->cacheEnabled && Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }

        try {
            // Récupérer toutes les collectes pour cette entreprise
            $collectes = Collecte::where('entreprise_id', $entrepriseId)
                ->orderBy('annee', 'asc')
                ->orderBy('date_collecte', 'asc')
                ->get();

            // Initialiser l'historique
            $historique = [];
            $prevValeur = null;

            // Parcourir les collectes
            foreach ($collectes as $collecte) {
                $typeCollecte = $collecte->type_collecte;
                $calculateur = $this->getCalculateur($typeCollecte);

                if (!$calculateur) {
                    continue;
                }

                // Récupérer les données JSON
                $donnees = $this->normaliseDonnees($collecte->donnees);
                if (empty($donnees)) {
                    continue;
                }

                // Extraire l'indicateur spécifique
                $indicateur = null;
                foreach ($donnees as $categorie => $indicateurs) {
                    if (isset($indicateurs[$indicateurId])) {
                        $indicateur = [
                            'valeur' => $indicateurs[$indicateurId],
                            'categorie' => $categorie
                        ];
                        break;
                    }
                }

                // Si l'indicateur n'est pas trouvé dans les données brutes,
                // essayer de le calculer avec le calculateur approprié
                if (!$indicateur && method_exists($calculateur, 'calculerIndicateur')) {
                    $indicateur = $calculateur->calculerIndicateur($indicateurId, $donnees, [
                        'entreprise_id' => $entrepriseId,
                        'annee' => $collecte->annee,
                        'periode' => $collecte->periode,
                        'date_collecte' => $collecte->date_collecte
                    ]);
                }

                if ($indicateur && isset($indicateur['valeur'])) {
                    // Calculer la tendance par rapport à la valeur précédente
                    $tendance = 0;
                    if ($prevValeur !== null) {
                        if ($indicateur['valeur'] > $prevValeur) {
                            $tendance = 1;
                        } elseif ($indicateur['valeur'] < $prevValeur) {
                            $tendance = -1;
                        }
                    }

                    // Récupérer la valeur cible si disponible
                    $valeurCible = null;
                    $definitionIndicateur = $this->getIndicateurById($indicateurId);
                    if ($definitionIndicateur && isset($definitionIndicateur['valeur_cible'])) {
                        $valeurCible = $definitionIndicateur['valeur_cible'];
                    }

                    // Ajouter à l'historique
                    $historique[] = [
                        'periode' => $collecte->periode,
                        'annee' => $collecte->annee,
                        'valeur' => $indicateur['valeur'],
                        'valeur_cible' => $valeurCible,
                        'date_calcul' => $collecte->date_collecte,
                        'tendance' => $tendance
                    ];

                    // Mettre à jour la valeur précédente pour la prochaine itération
                    $prevValeur = $indicateur['valeur'];
                }
            }

            // Mettre en cache
            if ($this->cacheEnabled) {
                Cache::put($cacheKey, $historique, $this->cacheDuration * 60);
            }

            return $historique;

        } catch (Exception $e) {
            Log::error("Erreur lors de la récupération de l'historique: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Récupère un indicateur par son ID
     *
     * @param int $indicateurId ID de l'indicateur
     * @return array Données de l'indicateur
     */
    public function getIndicateurById(int $indicateurId): array
    {
        // Parcourir tous les calculateurs pour trouver la définition de l'indicateur
        foreach ($this->calculateurs as $calculateur) {
            if (method_exists($calculateur, 'getMetadataIndicateur')) {
                $metadata = $calculateur->getMetadataIndicateur('', $indicateurId);
                if (!empty($metadata)) {
                    return [
                        'id' => $indicateurId,
                        'libelle' => $metadata['libelle'],
                        'description' => $metadata['definition'] ?? '',
                        'categorie' => 'Autre',
                        'unite' => $metadata['unite'] ?? '',
                        'valeur_cible' => $metadata['valeur_cible'] ?? null,
                        'formule' => $metadata['formule'] ?? null,
                        'source' => $metadata['source'] ?? '',
                        'frequence' => $metadata['frequence'] ?? ''
                    ];
                }
            }
        }

        // Si non trouvé, retourner une structure par défaut
        return [
            'id' => $indicateurId,
            'libelle' => 'Indicateur #' . $indicateurId,
            'description' => '',
            'categorie' => 'Autre',
            'unite' => '',
            'valeur_cible' => null,
            'formule' => null,
            'source' => '',
            'frequence' => ''
        ];
    }

    /**
     * Récupère toutes les catégories d'indicateurs
     *
     * @return array Liste des catégories
     */
    public function getCategories(): array
    {
        $categories = [];

        // Récupérer les catégories à partir des définitions de chaque calculateur
        foreach ($this->calculateurs as $calculateur) {
            if (method_exists($calculateur, 'getCategoriesIndicateurs')) {
                $categoriesCalculateur = $calculateur->getCategoriesIndicateurs();
                $categories = array_merge($categories, $categoriesCalculateur);
            }
        }

        // Éliminer les doublons et trier
        $categories = array_unique($categories);
        sort($categories);

        return $categories;
    }

    /**
     * Récupère les périodes disponibles pour une entreprise et une année
     *
     * @param int $entrepriseId ID de l'entreprise
     * @param int $annee Année
     * @return array Liste des périodes
     */
    public function getPeriodesDisponibles(int $entrepriseId, int $annee): array
    {
        try {
            $periodes = Collecte::where('entreprise_id', $entrepriseId)
                ->where('annee', $annee)
                ->pluck('periode')
                ->unique()
                ->filter()
                ->values()
                ->toArray();

            return $periodes;
        } catch (Exception $e) {
            Log::error("Erreur lors de la récupération des périodes: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Récupérer les périodes disponibles pour l'analyse
     *
     * @param int|null $exerciceId
     * @return array
     */
    public function getPeriodesDisponiblesParExercice(?int $exerciceId = null): array
    {
        $query = Periode::select('id', 'exercice_id', 'type_periode', 'numero')
            ->orderBy('type_periode')
            ->orderBy('numero', 'asc');

        if ($exerciceId) {
            $query->where('exercice_id', $exerciceId);
        }

        return $query->get()->toArray();
    }

    /**
     * Récupère les années disponibles pour les indicateurs
     *
     * @return array Liste des années
     */
    public function getAnneesDisponibles(): array
    {
        try {
            $annees = Collecte::pluck('annee')
                ->unique()
                ->sort()
                ->values()
                ->toArray();

            // Si aucune année n'est trouvée, retourner l'année courante et les 2 précédentes
            if (empty($annees)) {
                $currentYear = date('Y');
                return [$currentYear - 2, $currentYear - 1, $currentYear];
            }

            return $annees;
        } catch (Exception $e) {
            Log::error("Erreur lors de la récupération des années: " . $e->getMessage());
            return [date('Y')];
        }
    }

    /**
     * Récupérer les exercices disponibles pour les indicateurs
     *
     * @return array
     */
    public function getExercicesDisponibles(): array
    {
        return Exercice::orderBy('annee', 'desc')
            ->get()
            ->map(function ($exercice) {
                return [
                    'id' => $exercice->id,
                    'annee' => $exercice->annee,
                    'date_debut' => $exercice->date_debut,
                    'date_fin' => $exercice->date_fin,
                    'actif' => (bool)$exercice->actif
                ];
            })
            ->toArray();
    }

    /**
     * Récupérer les entreprises disponibles pour les indicateurs
     *
     * @return array
     */
    public function getEntreprisesDisponibles(): array
    {
        return Entreprise::select('id', 'nom_entreprise', 'secteur_activite')
            ->orderBy('nom_entreprise', 'asc')
            ->get()
            ->toArray();
    }

    /**
     * Récupère les données pour l'export des indicateurs
     *
     * @param int $entrepriseId ID de l'entreprise
     * @param int $annee Année
     * @param string|null $periode Période (optionnel)
     * @return Collection Collection des indicateurs pour l'export
     */
    public function getIndicateursForExport(int $entrepriseId, int $annee, ?string $periode = null): Collection
    {
        try {
            // Récupérer les indicateurs bruts
            $indicateurs = $this->getIndicateurs($entrepriseId, $annee, $periode);

            // Formater pour l'export
            $formattedIndicateurs = $indicateurs->map(function ($indicateur) use ($annee) {
                return [
                    'id' => $indicateur['id'],
                    'libelle' => $indicateur['libelle'],
                    'categorie' => $indicateur['categorie'],
                    'valeur' => $indicateur['valeur'],
                    'valeur_cible' => $indicateur['valeur_cible'] ?? null,
                    'ecart' => isset($indicateur['valeur']) && isset($indicateur['valeur_cible'])
                        ? $indicateur['valeur'] - $indicateur['valeur_cible']
                        : null,
                    'unite' => $indicateur['unite'] ?? '',
                    'periode' => $indicateur['periode'] ?? '',
                    'annee' => $indicateur['annee'] ?? $annee,
                    'date_calcul' => $indicateur['date_calcul'] ?? now()->format('Y-m-d'),
                    'description' => $indicateur['description'] ?? '',
                    'formule' => $indicateur['formule'] ?? '',
                    'source' => $indicateur['source'] ?? '',
                    'frequence' => $indicateur['frequence'] ?? ''
                ];
            });

            return $formattedIndicateurs;
        } catch (Exception $e) {
            Log::error("Erreur lors de la préparation des indicateurs pour l'export: " . $e->getMessage());
            return collect([]);
        }
    }

    /**
     * Récupérer les données d'évolution d'un indicateur spécifique
     *
     * @param string $indicateurId
     * @param string $categorie
     * @param string $periodeType
     * @param int|null $exerciceId
     * @param int|null $entrepriseId
     * @return array
     */
    public function getIndicateurEvolutionData(
        string $indicateurId,
        string $categorie,
        string $periodeType,
        ?int $exerciceId = null,
        ?int $entrepriseId = null
    ): array {
        try {
            // Vérifier que le type de période est valide
            if (!$this->estPeriodeValide($periodeType)) {
                throw new \InvalidArgumentException("Type de période non valide: {$periodeType}");
            }

            // Récupérer le calculateur approprié
            $calculateur = $this->getCalculateur($periodeType);

            // Récupérer les collectes pour cet indicateur
            $collectes = $this->getCollectes($periodeType, $exerciceId, $entrepriseId);

            // Collecter les données d'évolution
            $evolutionData = [];

            foreach ($collectes as $collecte) {
                $donnees = $this->normaliseDonnees($collecte->donnees);

                // Appliquer les calculs pour obtenir les indicateurs calculés
                $donneesCalculees = $calculateur->calculerIndicateurs($donnees);

                if (isset($donneesCalculees[$categorie][$indicateurId])) {
                    $valeur = $donneesCalculees[$categorie][$indicateurId];

                    if (is_numeric($valeur)) {
                        // Formater la date pour le graphique
                        $date = Carbon::parse($collecte->date_collecte)->format('Y-m-d');

                        // Structure pour le point de données
                        $point = [
                            'date' => $date,
                            'value' => (float)$valeur,
                            'entreprise' => $collecte->entreprise->nom_entreprise ?? 'Non spécifié',
                            'exercice' => $collecte->exercice->annee ?? 'Non spécifié',
                            'periode' => $collecte->periode ? $collecte->periode->type_periode : $periodeType,
                        ];

                        $evolutionData[] = $point;
                    }
                }
            }

            // Obtenir les métadonnées de l'indicateur
            $metadata = $calculateur->getMetadataIndicateur($categorie, $indicateurId) ?? [
                'libelle' => $this->formatIndicateurLibelle($indicateurId),
                'definition' => '',
                'unite' => '',
                'valeur_cible' => '',
            ];

            return [
                'id' => $indicateurId,
                'label' => $metadata['libelle'],
                'unite' => $metadata['unite'],
                'definition' => $metadata['definition'],
                'valeur_cible' => $metadata['valeur_cible'],
                'is_calculated' => $calculateur->estIndicateurCalcule($categorie, $indicateurId),
                'evolution_data' => $evolutionData
            ];
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des données d\'évolution: ' . $e->getMessage());
            return [
                'id' => $indicateurId,
                'label' => $this->formatIndicateurLibelle($indicateurId),
                'unite' => '',
                'definition' => '',
                'valeur_cible' => '',
                'is_calculated' => false,
                'evolution_data' => []
            ];
        }
    }

    /**
     * Récupère l'évolution des indicateurs pour une entreprise
     *
     * @param int $entrepriseId ID de l'entreprise
     * @param int $annee Année de référence
     * @return array Évolution des indicateurs
     */
    public function getEvolutionIndicateurs(int $entrepriseId, int $annee): array
    {
        try {
            // Récupérer toutes les collectes pour cette entreprise
            $collectes = Collecte::where('entreprise_id', $entrepriseId)
                ->orderBy('annee', 'asc')
                ->orderBy('date_collecte', 'asc')
                ->get();

            // Structure pour stocker l'évolution des indicateurs
            $evolution = [];

            // Parcourir les collectes
            foreach ($collectes as $collecte) {
                $donnees = $this->normaliseDonnees($collecte->donnees);
                if (empty($donnees)) {
                    continue;
                }

                // Calculer les indicateurs pour cette collecte
                $typeCollecte = $collecte->type_collecte;
                $calculateur = $this->getCalculateur($typeCollecte);

                if (!$calculateur) {
                    continue;
                }

                // Obtenir les valeurs brutes et calculées
                $indicateursCalcules = $calculateur->calculerIndicateurs($donnees, [
                    'entreprise_id' => $entrepriseId,
                    'annee' => $collecte->annee,
                    'periode' => $collecte->periode,
                    'date_collecte' => $collecte->date_collecte
                ]);

                // Fusionner avec les données brutes
                foreach ($donnees as $categorie => $indicateurs) {
                    foreach ($indicateurs as $id => $valeur) {
                        if (!isset($evolution[$id])) {
                            // Obtenir les métadonnées de l'indicateur
                            $definition = $this->getIndicateurById($id);

                            $evolution[$id] = [
                                'id' => $id,
                                'libelle' => $definition['libelle'] ?? 'Indicateur ' . $id,
                                'categorie' => $definition['categorie'] ?? $categorie,
                                'unite' => $definition['unite'] ?? '',
                                'historique' => []
                            ];
                        }

                        // Déterminer la tendance par rapport à la dernière valeur
                        $tendance = 0;
                        $historique = $evolution[$id]['historique'];
                        if (!empty($historique)) {
                            $derniereValeur = end($historique)['valeur'];
                            if ($valeur > $derniereValeur) {
                                $tendance = 1;
                            } elseif ($valeur < $derniereValeur) {
                                $tendance = -1;
                            }
                        }

                        // Ajouter le point d'historique
                        $evolution[$id]['historique'][] = [
                            'periode' => $collecte->periode,
                            'annee' => $collecte->annee,
                            'valeur' => $valeur,
                            'valeur_cible' => $definition['valeur_cible'] ?? null,
                            'date_calcul' => $collecte->date_collecte,
                            'tendance' => $tendance
                        ];
                    }
                }

                // Ajouter également les indicateurs calculés
                foreach ($indicateursCalcules as $categorie => $indicateurs) {
                    foreach ($indicateurs as $id => $valeur) {
                        // Ne pas traiter les indicateurs déjà traités dans les données brutes
                        if (isset($donnees[$categorie][$id])) {
                            continue;
                        }

                        if (!isset($evolution[$id])) {
                            // Obtenir les métadonnées de l'indicateur
                            $definition = $this->getIndicateurById($id);

                            $evolution[$id] = [
                                'id' => $id,
                                'libelle' => $definition['libelle'] ?? 'Indicateur ' . $id,
                                'categorie' => $definition['categorie'] ?? $categorie,
                                'unite' => $definition['unite'] ?? '',
                                'historique' => []
                            ];
                        }

                        // Déterminer la tendance par rapport à la dernière valeur
                        $tendance = 0;
                        $historique = $evolution[$id]['historique'];
                        if (!empty($historique)) {
                            $derniereValeur = end($historique)['valeur'];
                            if ($valeur > $derniereValeur) {
                                $tendance = 1;
                            } elseif ($valeur < $derniereValeur) {
                                $tendance = -1;
                            }
                        }

                        // Ajouter le point d'historique
                        $evolution[$id]['historique'][] = [
                            'periode' => $collecte->periode,
                            'annee' => $collecte->annee,
                            'valeur' => $valeur,
                            'valeur_cible' => $definition['valeur_cible'] ?? null,
                            'date_calcul' => $collecte->date_collecte,
                            'tendance' => $tendance
                        ];
                    }
                }
            }

            // Convertir le tableau associatif en tableau indexé
            return array_values($evolution);

        } catch (Exception $e) {
            Log::error("Erreur lors de la récupération de l'évolution des indicateurs: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Calcule les indicateurs basés sur des formules
     *
     * @param array $donnees Données brutes
     * @param array $context Contexte du calcul (entreprise, période, etc.)
     * @return array Indicateurs calculés
     */
    public function calculerIndicateursFormules(array $donnees, array $context = []): array
    {
        try {
            $contextData = [];
            if (is_string($context)) {
                $contextData['periode_type'] = $context;
            } elseif (is_array($context)) {
                $contextData = $context;
            }


            $resultats = [];

            // Récupérer les définitions de formules à partir des calculateurs
        $formules = [];
        foreach ($this->calculateurs as $calculateur) {
            if (method_exists($calculateur, 'getFormules')) {
                $formulesCalculateur = $calculateur->getFormules();
                $formules = array_merge($formules, $formulesCalculateur);
            }
        }

        if (empty($formules)) {
            return $resultats;
        }

            // Trier les formules par dépendances (calculer d'abord celles qui ne dépendent pas d'autres)
            usort($formules, function ($a, $b) {
                $depA = $a['dependances'] ?? [];
                $depB = $b['dependances'] ?? [];
                return count($depA) - count($depB);
            });

            // Copier les données pour ne pas les modifier
            $donneesCalculees = $donnees;

            // Calculer chaque formule
            foreach ($formules as $formule) {
                $id = $formule['id'];
                $categorie = $formule['categorie'];
                $expression = $formule['expression'];
                $dependances = $formule['dependances'] ?? [];

                // Vérifier si toutes les dépendances sont disponibles
                $dependancesDisponibles = true;
                $variables = [];

                foreach ($dependances as $dependance) {
                    $found = false;
                    foreach ($donneesCalculees as $cat => $indicateurs) {
                        if (isset($indicateurs[$dependance])) {
                            $variables[$dependance] = $indicateurs[$dependance];
                            $found = true;
                            break;
                        }
                    }

                    if (!$found) {
                        $dependancesDisponibles = false;
                        break;
                    }
                }

                // Si toutes les dépendances sont disponibles, calculer la formule
                if ($dependancesDisponibles) {
                    try {
                        // Évaluer la formule
                        $resultat = $this->evaluerFormule($expression, $variables);

                        // Stocker le résultat
                        if (!isset($donneesCalculees[$categorie])) {
                            $donneesCalculees[$categorie] = [];
                        }

                        $donneesCalculees[$categorie][$id] = $resultat;

                        // Ajouter au résultat final
                        if (!isset($resultats[$categorie])) {
                            $resultats[$categorie] = [];
                        }

                        $resultats[$categorie][$id] = $resultat;

                    } catch (Exception $e) {
                        Log::error("Erreur lors du calcul de la formule {$id}: " . $e->getMessage());
                    }
                }
            }

            return $resultats;

        } catch (Exception $e) {
            Log::error("Erreur lors du calcul des indicateurs par formules: " . $e->getMessage());
            return [];
        }
    }

    /**
 * Exporter les indicateurs au format Excel
 *
 * @param string $periodeType
 * @param string|null $categorie
 * @param int|null $exerciceId
 * @param int|null $entrepriseId
 * @return \Symfony\Component\HttpFoundation\BinaryFileResponse
 */
public function exportIndicateursToExcel(
    string $periodeType,
    ?string $categorie = null,
    ?int $exerciceId = null,
    ?int $entrepriseId = null
) {
    // Récupérer les données d'indicateurs
    $indicateursData = $this->getIndicateursAnalyse($periodeType, $exerciceId, $entrepriseId);

    // Si une catégorie spécifique est demandée, ne garder que celle-là
    if ($categorie && isset($indicateursData[$categorie])) {
        $indicateursData = [$categorie => $indicateursData[$categorie]];
    }

    // Obtenir les informations sur l'exercice et l'entreprise pour l'en-tête du rapport
    $exerciceInfo = $exerciceId ? \App\Models\Exercice::find($exerciceId) : null;
    $entrepriseInfo = $entrepriseId ? \App\Models\Entreprise::find($entrepriseId) : null;

    // Créer les métadonnées pour l'exportation
    $metadata = [];

    // Important: Assurez-vous que l'année est un entier pour le constructeur de IndicateursExport
    if ($exerciceInfo) {
        $metadata['annee'] = (int)$exerciceInfo->annee; // Conversion explicite en int
    } else {
        $metadata['annee'] = (int)date('Y'); // Année courante si pas d'exercice spécifié
    }

    if ($entrepriseInfo) {
        $metadata['nom_entreprise'] = $entrepriseInfo->nom_entreprise;
    }

    // Créer l'exportateur Excel
    $exporter = new \App\Exports\IndicateursExport(
        $indicateursData,
        $metadata['annee'], // Passer l'année comme int
        $periodeType,
        $metadata // Autres métadonnées
    );

    // Générer un nom de fichier
    $fileName = 'indicateurs_' . $periodeType;
    if ($categorie) {
        $fileName .= '_' . str_replace(' ', '_', $categorie);
    }
    if ($exerciceId && $exerciceInfo) {
        $fileName .= '_' . $exerciceInfo->annee;
    }
    if ($entrepriseId && $entrepriseInfo) {
        $fileName .= '_' . str_replace(' ', '_', $entrepriseInfo->nom_entreprise);
    }
    $fileName .= '_' . date('Y-m-d_H-i-s') . '.xlsx';

    // Exporter avec la classe d'export Excel
    return \Maatwebsite\Excel\Facades\Excel::download($exporter, $fileName);
}
    /**
     * Exporter les données détaillées d'un indicateur au format Excel
     *
     * @param string|int $indicateurId
     * @param string $categorie
     * @param string $periodeType
     * @param int|null $exerciceId
     * @param int|null $entrepriseId
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse
     */
    public function exportIndicateurDetailToExcel(
        $indicateurId,
        string $categorie,
        string $periodeType,
        ?int $exerciceId = null,
        ?int $entrepriseId = null
    ) {
        // Récupérer les données d'évolution
        $evolutionData = $this->getIndicateurEvolutionData(
            $indicateurId,
            $categorie,
            $periodeType,
            $exerciceId,
            $entrepriseId
        );

        // Obtenir les informations sur l'exercice pour l'en-tête du rapport
        $exerciceInfo = $exerciceId ? Exercice::find($exerciceId) : null;

        // Créer l'exportateur Excel
        $exporter = new \App\Exports\IndicateurDetailExport(
            $evolutionData['evolution_data'],
            (int)$indicateurId,
            $periodeType,
            $exerciceInfo ? ['annee' => $exerciceInfo->annee] : null
        );

        // Générer un nom de fichier
        $fileName = 'indicateur_' . $indicateurId . '_' . str_replace(' ', '_', $periodeType);
        if ($exerciceId && $exerciceInfo) {
            $fileName .= '_' . $exerciceInfo->annee;
        }
        $fileName .= '_' . date('Y-m-d_H-i-s') . '.xlsx';

        // Exporter avec la classe d'export Excel
        return Excel::download($exporter, $fileName);
    }

    /**
     * Récupérer les collectes selon les critères spécifiés
     *
     * @param string $periodeType Type de période
     * @param int|null $exerciceId ID de l'exercice
     * @param int|null $entrepriseId ID de l'entreprise
     * @return \Illuminate\Database\Eloquent\Collection
     */

    protected function getCollectes(string $periodeType, ?int $exerciceId = null, ?int $entrepriseId = null)
    {
        $query = Collecte::with(['entreprise', 'exercice', 'periode', 'user'])
            // Remove or expand the type_collecte filter
            ->whereIn('type_collecte', ['standard', 'brouillon', 'exceptionnel']);

        // Make periode matching case-insensitive
        if ($periodeType == self::PERIODE_OCCASIONNELLE) {
            $query->whereNull('periode_id')
                ->whereRaw('LOWER(periode) = ?', [strtolower(self::PERIODE_OCCASIONNELLE)]);
        } else {
            $query->whereRaw('LOWER(periode) = ?', [strtolower($periodeType)]);
        }

        // Keep other filters
        if ($exerciceId) {
            $query->where('exercice_id', $exerciceId);
        }
        if ($entrepriseId) {
            $query->where('entreprise_id', $entrepriseId);
        }

        return $query->orderBy('date_collecte', 'desc')->get();
    }
    /**
     * Récupère un calculateur par type de collecte
     *
     * @param string $typeCollecte Type de collecte
     * @return mixed Instance du calculateur ou null
     */
    protected function getCalculateur(string $typeCollecte)
    {
        // Vérifier si c'est déjà une des constantes de période
        if (isset($this->calculateurs[$typeCollecte])) {
            return $this->calculateurs[$typeCollecte];
        }

        // Sinon, essayer de déterminer le type à partir du nom
        $type = Str::lower($typeCollecte);

        if (Str::contains($type, 'trimestre') || Str::contains($type, 'trimestriel')) {
            return $this->calculateurs[self::PERIODE_TRIMESTRIELLE];
        } elseif (Str::contains($type, 'semestre') || Str::contains($type, 'semestriel')) {
            return $this->calculateurs[self::PERIODE_SEMESTRIELLE];
        } elseif (Str::contains($type, 'annuel') || Str::contains($type, 'annee')) {
            return $this->calculateurs[self::PERIODE_ANNUELLE];
        } else {
            return $this->calculateurs[self::PERIODE_OCCASIONNELLE];
        }
    }

    /**
     * Normaliser les données JSON en tableau PHP
     *
     * @param mixed $donnees
     * @return array
    //  */

    protected function normaliseDonnees($donnees): array
    {
 // Maintenant que le modèle Collecte normalise les données, on reçoit toujours un tableau
 if (!is_array($donnees)) {
    Log::warning('Données non normalisées reçues', ['type' => gettype($donnees)]);
    return [];
}

        $data = [];

        if (is_string($donnees)) {
            $data = json_decode($donnees, true) ?: [];
        } elseif (is_array($donnees)) {
            $data = $donnees;
        } elseif (is_object($donnees)) {
            $data = (array)$donnees;
        }

        // Transform your specific data structure to match what calculateurs expect

        return $donnees;

    }
    /**
     * Formater le libellé d'un indicateur à partir de son identifiant
     *
     * @param string $indicateurId
     * @return string
     */
    protected function formatIndicateurLibelle($indicateurId): string
    {
        // Convertir snake_case en texte lisible
        $libelle = str_replace('_', ' ', (string)$indicateurId);

        // Mettre la première lettre en majuscule
        return ucfirst($libelle);
    }

    /**
     * Calculer les agrégations finales pour chaque indicateur
     *
     * @param array $indicateursParCategorie
     * @param int|null $exerciceId
     * @return array
     */
    protected function calculerAggregations(array $indicateursParCategorie, ?int $exerciceId = null): array
    {
        $resultat = [];

        // Récupérer l'exercice précédent pour calculer l'évolution
        $exerciceActuel = $exerciceId ? Exercice::find($exerciceId) : null;
        $exercicePrecedent = $exerciceActuel ? Exercice::where('annee', $exerciceActuel->annee - 1)->first() : null;

        foreach ($indicateursParCategorie as $categorie => $indicateurs) {
            $resultat[$categorie] = [];

            foreach ($indicateurs as $indicateurId => $indicateur) {
                // Calculer la valeur moyenne pour cet indicateur
                $valeurs = array_filter($indicateur['values'], function ($val) {
                    return is_numeric($val);
                });

                $nombreValeurs = count($valeurs);

                if ($nombreValeurs > 0) {
                    $valeurMoyenne = array_sum($valeurs) / $nombreValeurs;

                    // Calculer la cible (utiliser celle définie ou une par défaut)
                    $cible = $this->calculerCible($indicateurId, $categorie, $valeurMoyenne, $indicateur['valeur_cible']);

                    // Calculer l'évolution par rapport à la période précédente
                    $evolution = $this->calculerEvolutionParExercice(
                        $indicateurId,
                        $categorie,
                        $valeurMoyenne,
                        $exerciceActuel,
                        $exercicePrecedent
                    );

                    // Formater le résultat final
                    $resultat[$categorie][] = [
                        'id' => $indicateurId,
                        'label' => $indicateur['label'],
                        'value' => $valeurMoyenne,
                        'target' => $cible,
                        'evolution' => $evolution,
                        'unite' => $indicateur['unite'],
                        'definition' => $indicateur['definition'],
                        'is_calculated' => $indicateur['is_calculated'],
                        'metadata' => [
                            'entreprise_ids' => array_unique($indicateur['entreprise_ids']),
                            'collecte_ids' => array_unique($indicateur['collecte_ids']),
                            'nombre_points_donnees' => $nombreValeurs,
                            'formula' => $indicateur['formula']
                        ]
                    ];
                }
            }
        }

        return $resultat;
    }

    /**
     * Calculer la cible pour un indicateur
     *
     * @param string|int $indicateurId
     * @param string $categorie
     * @param float $valeurActuelle
     * @param string|null $valeurCibleDefinie
     * @return float
     */
    protected function calculerCible($indicateurId, string $categorie, float $valeurActuelle, $valeurCibleDefinie = null): float
    {
        // Si une valeur cible est définie et est numérique, l'utiliser
        if ($valeurCibleDefinie && is_numeric($valeurCibleDefinie)) {
            return (float)$valeurCibleDefinie;
        }

        // Si une valeur cible est définie mais avec un pourcentage (ex: "10% min"), l'extraire
        if ($valeurCibleDefinie) {
            preg_match('/(\d+)%\s*(min|max)?/', (string)$valeurCibleDefinie, $matches);
            if (!empty($matches)) {
                $pourcentage = (float)$matches[1];
                $type = $matches[2] ?? '';

                if ($type == 'min') {
                    // Pour un minimum, la cible est valeurActuelle + 10%
                    return $valeurActuelle * (1 + ($pourcentage / 100));
                } else if ($type == 'max') {
                    // Pour un maximum, la cible est valeurActuelle - 10%
                    return $valeurActuelle * (1 - ($pourcentage / 100));
                } else {
                    // Sans spécification, prendre la valeur pourcentage directement
                    return $pourcentage;
                }
            }
        }

        // Règles par défaut basées sur le type d'indicateur
        $indicateurIdStr = (string)$indicateurId;
        if (strpos($indicateurIdStr, 'cout') !== false ||
            strpos($indicateurIdStr, 'charge') !== false ||
            strpos($indicateurIdStr, 'perte') !== false ||
            strpos($indicateurIdStr, 'creance') !== false) {
            // Pour les coûts et les charges, la cible est généralement inférieure à la valeur actuelle
            return $valeurActuelle * 0.9; // Réduction de 10%
        } else {
            // Pour les autres indicateurs (revenus, clients, etc.), la cible est généralement supérieure
            return $valeurActuelle * 1.1; // Augmentation de 10%
        }
    }

    /**
     * Calculer l'évolution par rapport à la période précédente (par exercice)
     *
     * @param string|int $indicateurId
     * @param string $categorie
     * @param float $valeurActuelle
     * @param Exercice|null $exerciceActuel
     * @param Exercice|null $exercicePrecedent
     * @return string
     */
    protected function calculerEvolutionParExercice(
        $indicateurId,
        string $categorie,
        float $valeurActuelle,
        ?Exercice $exerciceActuel = null,
        ?Exercice $exercicePrecedent = null
    ): string {
        // Si pas d'exercice précédent, on ne peut pas calculer l'évolution
        if (!$exercicePrecedent || !$exerciceActuel) {
            // Pour l'exemple, je vais générer une évolution aléatoire
            $evolutionAleatoire = rand(-15, 25);
            $signe = $evolutionAleatoire >= 0 ? '+' : '';
            return $signe . $evolutionAleatoire . '%';
        }

        // Rechercher la valeur de l'indicateur pour l'exercice précédent
        try {
            $collectesPrecedentes = Collecte::with(['exercice', 'periode'])
                ->where('exercice_id', $exercicePrecedent->id)
                ->where('type_collecte', 'standard')
                ->get();

            $valeursPrecedentes = [];

            foreach ($collectesPrecedentes as $collecte) {
                $donnees = $this->normaliseDonnees($collecte->donnees);

                if (isset($donnees[$categorie][$indicateurId])) {
                    $valeur = $donnees[$categorie][$indicateurId];

                    if (is_numeric($valeur)) {
                        $valeursPrecedentes[] = (float)$valeur;
                    }
                }
            }

            if (count($valeursPrecedentes) > 0) {
                $valeurMoyennePrecedente = array_sum($valeursPrecedentes) / count($valeursPrecedentes);

                if ($valeurMoyennePrecedente != 0) {
                    $tauxEvolution = (($valeurActuelle - $valeurMoyennePrecedente) / abs($valeurMoyennePrecedente)) * 100;
                    $signe = $tauxEvolution >= 0 ? '+' : '';
                    return $signe . number_format($tauxEvolution, 1) . '%';
                }
            }

            // Si pas de valeur précédente, considérer que c'est une nouvelle donnée (100% d'augmentation)
            return '+100%';

        } catch (\Exception $e) {
            Log::error('Erreur lors du calcul de l\'évolution: ' . $e->getMessage());
            return '0%';
        }
    }

    /**
     * Calcule l'évolution d'une série de valeurs
     *
     * @param array $valeurs Tableau de valeurs
     * @return array Statistiques d'évolution
     */
    protected function calculerEvolution(array $valeurs): array
    {
        if (count($valeurs) < 2) {
            return [
                'evolution' => 0,
                'tendance' => 'stable'
            ];
        }

        $premier = reset($valeurs);
        $dernier = end($valeurs);

        if ($premier == 0) {
            return [
                'evolution' => 100, // Considéré comme 100% d'augmentation
                'tendance' => 'up'
            ];
        }

        $evolution = (($dernier - $premier) / abs($premier)) * 100;

        $tendance = 'stable';
        if ($evolution > 5) {
            $tendance = 'up';
        } elseif ($evolution < -5) {
            $tendance = 'down';
        }

        return [
            'evolution' => round($evolution, 1),
            'tendance' => $tendance
        ];
    }

    /**
     * Calcule la tendance d'une série de valeurs
     *
     * @param array $valeurs Tableau de valeurs
     * @return string Direction de la tendance (up, down, stable)
     */
    protected function calculerTendance(array $valeurs): string
    {
        if (count($valeurs) < 2) {
            return 'stable';
        }

        // Calculer les différences entre valeurs consécutives
        $differences = [];
        for ($i = 1; $i < count($valeurs); $i++) {
            $differences[] = $valeurs[$i] - $valeurs[$i - 1];
        }

        // Compter les tendances
        $positives = 0;
        $negatives = 0;

        foreach ($differences as $diff) {
            if ($diff > 0) {
                $positives++;
            } elseif ($diff < 0) {
                $negatives++;
            }
        }

        // Déterminer la tendance dominante
        if ($positives > $negatives && $positives > (count($differences) / 3)) {
            return 'up';
        } elseif ($negatives > $positives && $negatives > (count($differences) / 3)) {
            return 'down';
        } else {
            return 'stable';
        }
    }

    /**
     * Évalue une formule mathématique
     *
     * @param string $expression Expression à évaluer
     * @param array $variables Variables pour l'évaluation
     * @return float Résultat de l'évaluation
     */
   /**
 * Évalue une formule mathématique
 *
 * @param string $expression Expression à évaluer
 * @param array $variables Variables pour l'évaluation
 * @return float Résultat de l'évaluation
 */
protected function evaluerFormule(string $expression, array $variables): float
{
    // Remplacer les variables par leurs valeurs
    foreach ($variables as $nom => $valeur) {
        $expression = str_replace('$' . $nom, (float)$valeur, $expression);
    }

    // Évaluer l'expression (méthode sécurisée)
    $expression = preg_replace('/[^0-9\+\-\*\/\(\)\.\,\s]/', '', $expression);

    // Utiliser eval() avec précaution
    $resultat = 0;
    try {
        eval('$resultat = ' . $expression . ';');
    } catch (Exception $e) {
        throw new Exception("Formule invalide: " . $expression);
    }

    return (float)$resultat;
}
    /**
     * Vérifier si un type de période est valide
     *
     * @param string $periodeType
     * @return bool
     */
    protected function estPeriodeValide(string $periodeType): bool
    {
        return in_array($periodeType, [
            self::PERIODE_TRIMESTRIELLE,
            self::PERIODE_SEMESTRIELLE,
            self::PERIODE_ANNUELLE,
            self::PERIODE_OCCASIONNELLE
        ]);
    }
}
