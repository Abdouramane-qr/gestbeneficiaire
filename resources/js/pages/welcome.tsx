

import React, { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage().props;
    const [language, setLanguage] = useState<'fr' | 'en'>('fr');
    const [darkMode, setDarkMode] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const logo = "/logo.png";

    // Load theme from localStorage
    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'dark') {
            setDarkMode(true);
            document.documentElement.classList.add('dark');
        } else {
            setDarkMode(false);
            document.documentElement.classList.remove('dark');
        }
    }, []);

    // Toggle dark mode
    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        if (newMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    const translations = {
        fr: {
            heroTitle: 'JEM II Platform',
            heroDescription: 'Jeunesse, Emploi et Migration II — Pour l\'autonomisation des jeunes et la résilience des communautés face aux migrations environnementales.',
            getStarted: 'Commencer →',
            learnMore: 'En savoir plus',
            dashboard: 'Tableau de bord',
            login: 'Connexion',
            register: 'Inscription',
            projectTitle: 'À propos du projet JEM II',
            projectDescription: `Le projet Jeunesse, Emploi et Migration (JEM II), mis en œuvre par l'OIM et financé par l'AICS, vise à promouvoir l'emploi des jeunes et à réduire la migration irrégulière à travers des formations professionnelles, le soutien à l'entrepreneuriat et la création d'opportunités locales.`,
            projectKeyPoints: [
                { title: 'Formation professionnelle', description: '400 jeunes bénéficient de formations techniques adaptées au marché du travail local.' },
                { title: 'Soutien à l\'entrepreneuriat', description: 'Appui à la création de microentreprises et à l\'insertion professionnelle.' },
                { title: 'Réduction des migrations irrégulières', description: 'Le projet agit sur les causes profondes de la migration à travers le développement local.' }
            ],
            whyImportant: 'Dans un contexte de vulnérabilité climatique et socio-économique, renforcer les capacités des jeunes est essentiel pour un développement durable.',
            welcome: 'Bienvenue sur la plateforme de suivi des jeunes promoteurs d\'entreprise bénéficiaires du projet JEM II',
            menu: 'Menu'
        },
        en: {
            heroTitle: 'JEM II Platform',
            heroDescription: 'Youth, Employment, and Migration II — Empowering young people and strengthening communities in the face of environmental migration.',
            getStarted: 'Get Started →',
            learnMore: 'Learn more',
            dashboard: 'Dashboard',
            login: 'Login',
            register: 'Register',
            projectTitle: 'About the JEM II Project',
            projectDescription: `The Youth, Employment and Migration (JEM II) project, implemented by IOM and funded by AICS, aims to promote youth employment and reduce irregular migration through vocational training, entrepreneurship support, and the creation of local opportunities.`,
            projectKeyPoints: [
                { title: 'Vocational Training', description: '400 youth receive technical training tailored to the local labor market.' },
                { title: 'Support for Entrepreneurship', description: 'Support for starting small businesses and professional integration.' },
                { title: 'Reducing Irregular Migration', description: 'Tackling root causes through local development initiatives.' }
            ],
            whyImportant: 'In a context of climate and socio-economic vulnerability, strengthening youth capacity is essential for sustainable development.',
            welcome: 'Welcome to the monitoring platform for young business promoters benefiting from the JEM II project',
            menu: 'Menu'
        }
    };

    const t = translations[language];

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLanguage(e.target.value as 'fr' | 'en');
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <>
            <Head title="JEM II Platform" />
            <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
                <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 shadow-sm">
                    <div className="container mx-auto px-4">
                        {/* Desktop header */}
                        <div className="hidden md:flex justify-between items-center h-16">
                            <div className="flex items-center">
                                <img
                                    src={logo}
                                    alt="JEM II Logo"
                                    className="h-10 w-auto mr-4 object-contain"
                                />
                                <Link href="/" className="text-base font-bold text-blue-600 dark:text-blue-200 ml-2 line-clamp-1">
                                    {t.welcome}
                                </Link>
                            </div>
                            <div className="flex items-center gap-4">
                                <select
                                    value={language}
                                    onChange={handleLanguageChange}
                                    className="bg-gray-100 dark:bg-gray-800 text-sm rounded-md px-2 py-1"
                                >
                                    <option value="fr">🇫🇷 Français</option>
                                    <option value="en">🇬🇧 English</option>
                                </select>

                                <button
                                    onClick={toggleDarkMode}
                                    className="text-xl px-2 py-1 rounded-md bg-gray-200 dark:bg-gray-700"
                                    title="Toggle dark mode"
                                >
                                    {darkMode ? '🌙' : '☀️'}
                                </button>

                                {auth.user ? (
                                    <Link href={route('dashboard')} className="px-4 py-2 bg-blue-600 text-white rounded-md">
                                        {t.dashboard}
                                    </Link>
                                ) : (
                                    <>
                                        <Link href={route('login')} className="text-gray-900 dark:text-gray-100">
                                            {t.login}
                                        </Link>
                                        <Link href={route('register')} className="px-4 py-2 bg-blue-600 text-white rounded-md">
                                            {t.register}
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Mobile header */}
                        <div className="md:hidden flex justify-between items-center h-16">
                            <div className="flex items-center">
                                <img
                                    src={logo}
                                    alt="JEM II Logo"
                                    className="h-8 w-auto object-contain"
                                />
                                <Link href="/" className="text-sm font-bold text-blue-600 dark:text-blue-200 ml-2 line-clamp-1 max-w-[180px]">
                                    JEM II
                                </Link>
                            </div>
                            <div className="flex items-center">
                                <button
                                    onClick={toggleDarkMode}
                                    className="text-xl px-2 py-1 mr-2 rounded-md bg-gray-200 dark:bg-gray-700"
                                    title="Toggle dark mode"
                                >
                                    {darkMode ? '🌙' : '☀️'}
                                </button>
                                <button
                                    onClick={toggleMobileMenu}
                                    className="p-2 rounded-md bg-gray-100 dark:bg-gray-700"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800 dark:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden bg-white dark:bg-gray-800 px-4 py-4 shadow-lg">
                            <div className="flex flex-col space-y-4">
                                <select
                                    value={language}
                                    onChange={handleLanguageChange}
                                    className="bg-gray-100 dark:bg-gray-700 text-sm rounded-md px-2 py-2 w-full"
                                >
                                    <option value="fr">🇫🇷 Français</option>
                                    <option value="en">🇬🇧 English</option>
                                </select>

                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md text-center"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {t.dashboard}
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-md text-center"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {t.login}
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md text-center"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {t.register}
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </header>

                <main className="container mx-auto px-4 py-8 md:py-16">
                    <div className="text-center">
                        <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6 text-gray-900 dark:text-gray-100">{t.heroTitle}</h1>
                        <p className="text-lg md:text-xl mb-6 md:mb-8 text-gray-700 dark:text-gray-300">{t.heroDescription}</p>

                        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                            <Link
                                href={auth.user ? route('dashboard') : route('register')}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg text-center"
                            >
                                {auth.user ? t.dashboard : t.getStarted}
                            </Link>
                            <Link
                                href="/about"
                                className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg text-center"
                            >
                                {t.learnMore}
                            </Link>
                        </div>
                    </div>

                    <section className="mt-12 md:mt-16">
                        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                            {t.projectTitle}
                        </h2>
                        <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 mb-6 md:mb-8">
                            {t.projectDescription}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {t.projectKeyPoints.map((point, index) => (
                                <div key={index} className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow">
                                    <h3 className="text-lg md:text-xl font-semibold text-blue-600 dark:text-blue-400">{point.title}</h3>
                                    <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 mt-2">{point.description}</p>
                                </div>
                            ))}
                        </div>
                        <p className="text-sm md:text-md text-gray-600 dark:text-gray-400 mt-6">{t.whyImportant}</p>
                    </section>
                </main>

                <footer className="bg-gray-100 dark:bg-gray-800 py-4 md:py-6 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        © {new Date().getFullYear()} JEM II Platform — OIM & AICS
                    </p>
                </footer>
            </div>
        </>
    );
}
