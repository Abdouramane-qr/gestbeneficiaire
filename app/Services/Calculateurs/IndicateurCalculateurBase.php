<?php

namespace App\Services\Calculateurs;

use Illuminate\Support\Facades\Log;

abstract class IndicateurCalculateurBase
{
    /**
     * Définition abstraite des indicateurs avec leurs formules et dépendances
     * À implémenter dans chaque classe dérivée
     */
    abstract protected function getDefinitionsIndicateurs(): array;

    /**
     * Calculer les indicateurs
     * À implémenter dans chaque classe dérivée
     *
     * @param array $donneesCollecte Les données brutes de la collecte
     * @param array $donneesReference Données de référence
     * @return array Les données complétées avec les indicateurs calculés
     */
    abstract public function calculerIndicateurs(array $donneesCollecte, array $donneesReference = []): array;

    /**
     * Évaluer une formule mathématique de manière sécurisée
     *
     * @param string $formule Formule à évaluer
     * @param array $variables Valeurs des variables
     * @return float Résultat du calcul
     * @throws \Exception En cas d'erreur d'évaluation
     */
    protected function evaluerFormule(string $formule, array $variables): float
    {
        // Remplacer les variables par leurs valeurs
        foreach ($variables as $nom => $valeur) {
            // S'assurer que la valeur est numérique
            if (!is_numeric($valeur)) {
                $valeur = 0;
            }

            // Remplacer les occurrences dans la formule
            $formule = preg_replace('/\b' . preg_quote($nom, '/') . '\b/', (float)$valeur, $formule);
        }

        // Nettoyer la formule : n'accepter que les chiffres, espaces, parenthèses et opérateurs mathématiques de base
        $formule = str_replace(['×', '÷'], ['*', '/'], $formule);

        // Vérifier que la formule ne contient que des caractères autorisés
        if (preg_match('/[^0-9\s\(\)\+\-\*\/\.\,\>\<\=\!\?\:]/', $formule)) {
            throw new \Exception("Formule non sécurisée: {$formule}");
        }

        // Évaluer la formule avec notre méthode mathématique sécurisée
        return $this->mathEvalSecurise($formule);
    }

    /**
     * Évaluation sécurisée d'une expression mathématique
     *
     * @param string $expression Expression à évaluer
     * @return float Résultat
     * @throws \Exception Si l'expression est invalide
     */
    protected function mathEvalSecurise(string $expression): float
    {
        // Supprimer les espaces
        $expression = preg_replace('/\s+/', '', $expression);

        try {
            // Évaluer les expressions conditionnelles (ternaires)
            if (strpos($expression, '?') !== false && strpos($expression, ':') !== false) {
                return $this->evaluerTernaire($expression);
            }

            // Traiter d'abord les parenthèses (récursivement)
            while (preg_match('/\(([^()]+)\)/', $expression, $matches)) {
                $resultat = $this->mathEvalSecurise($matches[1]);
                $expression = str_replace($matches[0], $resultat, $expression);
            }

            // Évaluer les opérations de comparaison
            if (strpos($expression, '>') !== false ||
                strpos($expression, '<') !== false ||
                strpos($expression, '=') !== false ||
                strpos($expression, '!') !== false) {
                return $this->evaluerComparaison($expression);
            }

            // Évaluer les multiplications et divisions
            while (preg_match('/(-?\d+\.?\d*)\s*([*\/])\s*(-?\d+\.?\d*)/', $expression, $matches)) {
                $gauche = (float)$matches[1];
                $operateur = $matches[2];
                $droite = (float)$matches[3];

                if ($operateur === '*') {
                    $resultat = $gauche * $droite;
                } else {
                    // Division
                    if ($droite == 0) {
                        // Division par zéro : retourner zéro au lieu de lancer une exception
                        $resultat = 0;
                    } else {
                        $resultat = $gauche / $droite;
                    }
                }

                $expression = str_replace($matches[0], $resultat, $expression);
            }

            // Évaluer les additions et soustractions
            while (preg_match('/(-?\d+\.?\d*)\s*([+\-])\s*(-?\d+\.?\d*)/', $expression, $matches)) {
                $gauche = (float)$matches[1];
                $operateur = $matches[2];
                $droite = (float)$matches[3];

                if ($operateur === '+') {
                    $resultat = $gauche + $droite;
                } else {
                    $resultat = $gauche - $droite;
                }

                $expression = str_replace($matches[0], $resultat, $expression);
            }

            // Vérifier que le résultat est bien un nombre
            if (!is_numeric($expression)) {
                throw new \Exception("Expression non valide après évaluation: {$expression}");
            }

            return (float)$expression;

        } catch (\Exception $e) {
            Log::error("Erreur d'évaluation mathématique: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Évalue une expression conditionnelle ternaire (condition ? vrai : faux)
     *
     * @param string $expression Expression à évaluer
     * @return float Résultat
     */
    protected function evaluerTernaire(string $expression): float
    {
        // Diviser l'expression en ses parties : condition ? vrai : faux
        $parties = explode('?', $expression, 2);
        $condition = $parties[0];

        $parties = explode(':', $parties[1], 2);
        $vrai = $parties[0];
        $faux = $parties[1];

        // Évaluer la condition
        $conditionResult = $this->evaluerComparaison($condition);

        // Retourner la branche appropriée
        if ($conditionResult) {
            return $this->mathEvalSecurise($vrai);
        } else {
            return $this->mathEvalSecurise($faux);
        }
    }

    /**
     * Évalue une expression de comparaison (>, <, >=, <=, ==, !=)
     *
     * @param string $expression Expression à évaluer
     * @return bool Résultat de la comparaison
     */
    protected function evaluerComparaison(string $expression): bool
    {
        // Gérer les différents opérateurs de comparaison
        if (strpos($expression, '>=') !== false) {
            list($gauche, $droite) = explode('>=', $expression, 2);
            return (float)$this->mathEvalSecurise($gauche) >= (float)$this->mathEvalSecurise($droite);
        }
        else if (strpos($expression, '<=') !== false) {
            list($gauche, $droite) = explode('<=', $expression, 2);
            return (float)$this->mathEvalSecurise($gauche) <= (float)$this->mathEvalSecurise($droite);
        }
        else if (strpos($expression, '>') !== false) {
            list($gauche, $droite) = explode('>', $expression, 2);
            return (float)$this->mathEvalSecurise($gauche) > (float)$this->mathEvalSecurise($droite);
        }
        else if (strpos($expression, '<') !== false) {
            list($gauche, $droite) = explode('<', $expression, 2);
            return (float)$this->mathEvalSecurise($gauche) < (float)$this->mathEvalSecurise($droite);
        }
        else if (strpos($expression, '==') !== false) {
            list($gauche, $droite) = explode('==', $expression, 2);
            return (float)$this->mathEvalSecurise($gauche) == (float)$this->mathEvalSecurise($droite);
        }
        else if (strpos($expression, '!=') !== false) {
            list($gauche, $droite) = explode('!=', $expression, 2);
            return (float)$this->mathEvalSecurise($gauche) != (float)$this->mathEvalSecurise($droite);
        }
        else if (strpos($expression, '&&') !== false) {
            list($gauche, $droite) = explode('&&', $expression, 2);
            return $this->evaluerComparaison($gauche) && $this->evaluerComparaison($droite);
        }
        else if (strpos($expression, '||') !== false) {
            list($gauche, $droite) = explode('||', $expression, 2);
            return $this->evaluerComparaison($gauche) || $this->evaluerComparaison($droite);
        }
        else if (strpos($expression, '!') !== false && $expression[0] == '!') {
            $reste = substr($expression, 1);
            return !$this->evaluerComparaison($reste);
        }

        // Si ce n'est pas une comparaison, c'est peut-être une valeur booléenne
        $val = $this->mathEvalSecurise($expression);
        return $val != 0;
    }

    /**
     * Obtenir la liste des indicateurs pour une catégorie spécifique
     *
     * @param string $categorie Nom de la catégorie
     * @return array Liste des indicateurs de cette catégorie
     */
    public function getIndicateursCategorie(string $categorie): array
    {
        $definitions = $this->getDefinitionsIndicateurs();

        if (isset($definitions[$categorie])) {
            return $definitions[$categorie];
        }

        return [];
    }

    /**
     * Obtenir la liste des catégories d'indicateurs
     *
     * @return array Liste des catégories
     */
    public function getCategories(): array
    {
        return array_keys($this->getDefinitionsIndicateurs());
    }

    /**
     * Vérifier si un indicateur est calculé automatiquement
     *
     * @param string $categorie Catégorie de l'indicateur
     * @param string $indicateurId Identifiant de l'indicateur
     * @return bool True si l'indicateur est calculé automatiquement
     */
    public function estIndicateurCalcule(string $categorie, string $indicateurId): bool
    {
        $definitions = $this->getDefinitionsIndicateurs();

        if (isset($definitions[$categorie][$indicateurId])) {
            return !empty($definitions[$categorie][$indicateurId]['formule']);
        }

        return false;
    }

    /**
     * Obtenir les métadonnées d'un indicateur
     *
     * @param string $categorie Catégorie de l'indicateur
     * @param string $indicateurId Identifiant de l'indicateur
     * @return array|null Métadonnées de l'indicateur ou null si non trouvé
     */
    public function getMetadataIndicateur(string $categorie, string $indicateurId): ?array
    {
        $definitions = $this->getDefinitionsIndicateurs();

        if (isset($definitions[$categorie][$indicateurId])) {
            return $definitions[$categorie][$indicateurId];
        }

        return null;
    }
}
