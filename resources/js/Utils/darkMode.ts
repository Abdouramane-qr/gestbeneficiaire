/**
 * Utilitaires pour la gestion du mode sombre
 * Ce module permet de basculer entre le mode clair et le mode sombre,
 * et de sauvegarder la préférence de l'utilisateur.
 */

// Fonction pour initialiser le mode sombre
export function initDarkMode(): boolean {
    // Vérifier les préférences enregistrées
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Déterminer le thème initial
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
      return true;
    } else {
      document.documentElement.classList.remove('dark');
      return false;
    }
  }

  // Fonction pour basculer le mode sombre
  export function toggleDarkMode(isDark: boolean): boolean {
    // Ajouter une classe pour les transitions douces
    document.documentElement.classList.add('dark-transition');

    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }

    // Supprimer la classe de transition après un délai
    setTimeout(() => {
      document.documentElement.classList.remove('dark-transition');
    }, 300);

    return isDark;
  }

  // Écouter les changements de préférence au niveau du système
  export function listenForThemeChanges(callback: (isDark: boolean) => void): void {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      // Ne pas réagir si l'utilisateur a explicitement défini une préférence
      if (!localStorage.getItem('theme')) {
        const isDark = e.matches;
        document.documentElement.classList.toggle('dark', isDark);
        if (callback) callback(isDark);
      }
    };

    // Pour les navigateurs modernes
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback pour les anciens navigateurs
      mediaQuery.addListener?.(handleChange);
    }
  }

  // Fonction pour réinitialiser la préférence (utiliser celle du système)
  export function resetThemePreference(callback?: (isDark: boolean) => void): boolean {
    localStorage.removeItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', prefersDark);
    if (callback) callback(prefersDark);
    return prefersDark;
  }


  