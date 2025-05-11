import React, { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import {  PieChart, Award, Users, Users2, MapPin, CalendarDays, Briefcase, AlertTriangle } from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage().props;
    const [language, setLanguage] = useState('fr');
    const [darkMode, setDarkMode] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [count, setCount] = useState({ beneficiaries: 0, regions: 0, women: 0, projects: 0 });
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

    // Animation compteur pour la section impact
    useEffect(() => {
        const interval = setInterval(() => {
            setCount(prev => ({
                beneficiaries: prev.beneficiaries >= 400 ? 400 : prev.beneficiaries + 4,
                regions: prev.regions >= 3 ? 3 : prev.regions + 1,
                women: prev.women >= 150 ? 150 : prev.women + 2,
                projects: prev.projects >= 200 ? 200 : prev.projects + 2
            }));
        }, 50);

        // Arrêter l'animation après que tous les compteurs aient atteint leur valeur maximale
        if (count.beneficiaries === 400 && count.regions === 3 && count.women === 150 && count.projects === 200) {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [count]);

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
            welcomeMessageTitle: "Bienvenue sur la plateforme JEM II",
            welcomeMessageSubtitle: "Un mot du coordinateur du projet",
            welcomeMessageContent: "Chers visiteurs, chers partenaires, et surtout chers jeunes entrepreneurs, je suis heureux de vous accueillir sur la plateforme de suivi du projet Jeunesse, Emploi et Migration (JEM II). Cette plateforme représente notre engagement collectif à promouvoir l'emploi des jeunes et à offrir des alternatives viables à la migration irrégulière. Grâce à ce nouvel outil, nous pourrons suivre efficacement les résultats de nos bénéficiaires, partager des ressources précieuses et créer une communauté d'entrepreneurs dynamiques. Je vous invite à explorer cette plateforme et à rejoindre notre initiative pour un développement économique durable de nos régions.",
            welcomeMessageSignature: "Dr. Amadou Traoré",
            welcomeMessageRole: "Coordinateur National du Projet JEM II",
            heroTitle: 'PROJET JEUNESSE, EMPLOI ET MIGRATION (JEM)',
            heroSubtitle: 'Ensemble pour un avenir meilleur',
            heroDescription: 'Renforcement de l\'employabilité et de l\'entreprenariat des jeunes pour réduire les risques de la migration irrégulière dans les régions du Centre-Est, Centre-Sud et Plateau Central du Burkina Faso',
            discover: 'Découvrir le projet',
            joinBeneficiaries: 'Rejoindre les bénéficiaires',
            dashboard: 'Tableau de bord',
            login: 'Connexion',
            register: 'Inscription',
            aboutTitle: 'À propos du projet JEM II',
            aboutDescription: 'Le Projet JEM – Phase II (2021-2024) vise à renforcer l\'employabilité et l\'entrepreneuriat des jeunes (18 à 35 ans), y compris les femmes et les personnes en situation de handicap, dans les régions du Centre-Est, Centre-Sud et Plateau Central du Burkina Faso. Cette initiative, mise en œuvre par l\'OIM et financée par l\'AICS, contribue également à la sensibilisation sur les risques de la migration irrégulière.',
            projectGoals: 'Objectifs du projet',
            objectives: [
                {
                    title: 'Renforcement des capacités',
                    description: 'Renforcer les capacités entrepreneuriales des jeunes (18 à 35 ans), y compris les femmes et les personnes vivant avec un handicap.',
                    icon: <Award className="h-10 w-10 text-blue-600" />
                },
                {
                    title: 'Création d\'opportunités',
                    description: 'Créer des opportunités et promouvoir des activités génératrices de revenus pour les jeunes entrepreneurs.',
                    icon: <Briefcase className="h-10 w-10 text-blue-600" />
                },
                {
                    title: 'Sensibilisation',
                    description: 'Sensibiliser sur les risques et les alternatives à la migration irrégulière dans les communautés vulnérables.',
                    icon: <AlertTriangle className="h-10 w-10 text-blue-600" />
                }
            ],
            impactTitle: 'Notre impact en chiffres',
            impactStats: [
                {
                    value: count.beneficiaries,
                    label: 'Bénéficiaires formés',
                    icon: <Users className="h-8 w-8 text-white" />
                },
                {
                    value: count.regions,
                    label: 'Régions couvertes',
                    icon: <MapPin className="h-8 w-8 text-white" />
                },
                {
                    value: count.women,
                    label: 'Jeunes femmes soutenues',
                    icon: <Users2 className="h-8 w-8 text-white" />
                },
                {
                    value: count.projects,
                    label: 'Microprojets financés',
                    icon: <PieChart className="h-8 w-8 text-white" />
                }
            ],
            testimonialTitle: 'Témoignages et réussites',
            testimonials: [
                {
                    name: 'Aminata S.',
                    activity: 'Couture et design',
                    quote: 'Grâce au projet JEM, j\'ai pu acquérir les compétences nécessaires pour lancer mon atelier de couture.',
                    image: '/api/placeholder/400/300'
                },
                {
                    name: 'Ousmane K.',
                    activity: 'Électronique',
                    quote: 'La formation technique m\'a permis de créer mon entreprise de réparation d\'appareils électroniques.',
                    image: '/api/placeholder/400/300'
                },
                {
                    name: 'Fatima N.',
                    activity: 'Agriculture',
                    quote: 'Le financement reçu a transformé ma petite ferme en une entreprise agricole prospère.',
                    image: '/api/placeholder/400/300'
                }
            ],
            ctaTitle: 'Rejoignez-nous !',
            ctaDescription: 'Vous êtes jeune, motivé·e, et vous voulez entreprendre ? Rejoignez-nous et bénéficiez de l\'accompagnement du Projet JEM.',
            applyButton: 'Faire une demande',
            contactButton: 'Contacter l\'équipe',
            partners: 'Nos partenaires',
            menu: 'Menu'
        },
        en: {
            heroTitle: 'YOUTH, EMPLOYMENT AND MIGRATION PROJECT (JEM)',
            heroSubtitle: 'Together for a better future',
            heroDescription: 'Strengthening youth employability and entrepreneurship to reduce the risks of irregular migration in the Center-East, Center-South and Central Plateau regions of Burkina Faso',
            discover: 'Discover the project',
            joinBeneficiaries: 'Join beneficiaries',
            dashboard: 'Dashboard',
            login: 'Login',
            register: 'Register',
            aboutTitle: 'About the JEM II Project',
            aboutDescription: 'The JEM Project - Phase II (2021-2024) aims to strengthen the employability and entrepreneurship of young people (18 to 35 years old), including women and people with disabilities, in the Center-East, Center-South and Central Plateau regions of Burkina Faso.',
            projectGoals: 'Project Goals',
            objectives: [
                {
                    title: 'Capacity Building',
                    description: 'Strengthen the entrepreneurial capacities of young people (18 to 35 years old), including women and people living with disabilities.',
                    icon: <Award className="h-10 w-10 text-blue-600" />
                },
                {
                    title: 'Creating Opportunities',
                    description: 'Create opportunities and promote income-generating activities for young entrepreneurs.',
                    icon: <Briefcase className="h-10 w-10 text-blue-600" />
                },
                {
                    title: 'Awareness',
                    description: 'Raise awareness about the risks and alternatives to irregular migration in vulnerable communities.',
                    icon: <AlertTriangle className="h-10 w-10 text-blue-600" />
                }
            ],
            impactTitle: 'Our impact in numbers',
            impactStats: [
                {
                    value: count.beneficiaries,
                    label: 'Trained beneficiaries',
                    icon: <Users className="h-8 w-8 text-white" />
                },
                {
                    value: count.regions,
                    label: 'Regions covered',
                    icon: <MapPin className="h-8 w-8 text-white" />
                },
                {
                    value: count.women,
                    label: 'Young women supported',
                    icon: <Users2 className="h-8 w-8 text-white" />
                },
                {
                    value: count.projects,
                    label: 'Microprojects funded',
                    icon: <PieChart className="h-8 w-8 text-white" />
                }
            ],
            testimonialTitle: 'Testimonials and Success Stories',
            testimonials: [
                {
                    name: 'Aminata S.',
                    activity: 'Sewing and design',
                    quote: 'Thanks to the JEM project, I was able to acquire the skills needed to launch my sewing workshop.',
                    image: '/api/placeholder/400/300'
                },
                {
                    name: 'Ousmane K.',
                    activity: 'Electronics',
                    quote: 'The technical training allowed me to create my electronic device repair business.',
                    image: '/api/placeholder/400/300'
                },
                {
                    name: 'Fatima N.',
                    activity: 'Agriculture',
                    quote: 'The funding received transformed my small farm into a thriving agricultural business.',
                    image: '/api/placeholder/400/300'
                }
            ],
            ctaTitle: 'Join us!',
            ctaDescription: 'Are you young, motivated, and want to be an entrepreneur? Join us and benefit from the support of the JEM Project.',
            applyButton: 'Apply now',
            contactButton: 'Contact the team',
            partners: 'Our partners',
            menu: 'Menu'
        }
    };

    const t = translations[language];

    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <>
            <Head title="JEM II Platform" />
            <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
                {/* Header */}
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
                                <Link href="/Welcome" className="text-base font-bold text-blue-600 dark:text-blue-200 ml-2">
                               Bienvenue sur la plateforme JEM II

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
                                <Link href="/" className="text-sm font-bold text-blue-600 dark:text-blue-200 ml-2">
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

                {/* Hero Section */}
                <section className="relative text-white overflow-hidden">
                    {/* Background avec image et overlay */}
                    <div className="absolute inset-0 bg-black">
                        {/* Image de fond (photo de groupe avec overlay) */}
                        <div className="absolute inset-0 opacity-40 bg-cover bg-center"
                             style={{
                                backgroundImage: "url('/images/jem-group-photo.jpg')",
                                backgroundSize: "cover"
                             }}>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-700 opacity-75"></div>
                    </div>

                    <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
                        <div className="max-w-3xl">
                            <h1 className="text-2xl md:text-4xl font-bold mb-2">{t.heroTitle}</h1>
                            <h2 className="text-xl md:text-2xl font-semibold mb-4">{t.heroSubtitle}</h2>
                            <p className="text-base md:text-lg mb-8 text-blue-100 max-w-2xl">{t.heroDescription}</p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                {/* <Link href="/aboutDescription" className="px-6 py-3 bg-white text-blue-700 rounded-lg font-medium flex items-center justify-center sm:justify-start">
                                    {t.discover}
                                    <ChevronRight className="ml-2 h-5 w-5" />
                                </Link> */}
                                {/* <Link href="/join" className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-lg font-medium hover:bg-white/10 transition flex items-center justify-center sm:justify-start">
                                    {t.joinBeneficiaries}
                                </Link> */}
                            </div>
                        </div>
                    </div>
                </section>

                {/* À propos du projet */}
                <section className="py-12 md:py-16 bg-white dark:bg-gray-800">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row md:items-center">
                            <div className="md:w-1/2 mb-8 md:mb-0">
                                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-white">{t.aboutTitle}</h2>
                                <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">{t.aboutDescription}</p>

                                <div className="relative w-full h-64 sm:h-80 overflow-hidden rounded-lg shadow-lg mt-4">
                                    <img
                                        src="/images/jem-project-brochure.jpg"
                                        alt="Brochure du projet JEM"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4">
                                        <span className="text-white text-sm font-medium">Projet JEM II — 2021-2024</span>
                                    </div>
                                </div>
                            </div>
                            <div className="md:w-1/2 md:pl-10">
                                <div className="bg-gray-100 dark:bg-gray-700 p-8 rounded-lg">
                                    <div className="flex items-center mb-4">
                                        <CalendarDays className="h-6 w-6 text-blue-600 mr-3" />
                                        <span className="text-lg font-semibold dark:text-white">2021 - 2024</span>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-4 dark:text-white">{t.projectGoals}</h3>
                                    <ul className="space-y-4">
                                        {t.objectives.map((objective, index) => (
                                            <li key={index} className="flex items-start">
                                                <div className="mt-1 mr-3 flex-shrink-0">
                                                    {objective.icon}
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-800 dark:text-white">{objective.title}</h4>
                                                    <p className="text-gray-600 dark:text-gray-300 text-sm">{objective.description}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Impact en chiffres */}
                <section className="py-12 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">{t.impactTitle}</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                            {t.impactStats.map((stat, index) => (
                                <div key={index} className="text-center bg-blue-700/50 p-6 rounded-lg">
                                    <div className="bg-blue-500 w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center">
                                        {stat.icon}
                                    </div>
                                    <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                                    <div className="text-sm md:text-base text-blue-100">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Section Témoignages et Résultats */}
                <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-800">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center text-gray-800 dark:text-white">{t.testimonialTitle}</h2>

                        {/* Galerie de photos des bénéficiaires */}
                        <div className="mb-12">
                            <div className="relative w-full rounded-xl overflow-hidden shadow-xl">
                                <div className="aspect-w-16 aspect-h-9">
                                    <img
                                        src="/images/jem-group-photo.jpg"
                                        alt="Cérémonie de remise de financement aux bénéficiaires du projet JEM"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 p-4 md:p-6">
                                    <h3 className="text-white text-lg md:text-xl font-semibold">Remise officielle de financements</h3>
                                    <p className="text-blue-100 text-sm md:text-base">Cérémonie de soutien aux jeunes entrepreneurs bénéficiaires du projet JEM</p>
                                </div>
                            </div>
                        </div>


                    </div>
                </section>



                {/* CTA Section */}
                <section className="py-12 bg-blue-50 dark:bg-blue-900">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto text-center">
                            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-white">{t.ctaTitle}</h2>
                            <p className="text-gray-600 dark:text-blue-100 mb-8">{t.ctaDescription}</p>
                            {/* <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <Link href="/apply" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                                    {t.applyButton}
                                </Link>
                                <Link href="/contact" className="px-6 py-3 bg-transparent border-2 border-blue-600 text-blue-600 dark:text-blue-200 dark:border-blue-400 rounded-lg font-medium hover:bg-blue-600/10 transition">
                                    {t.contactButton}
                                </Link>
                            </div> */}
                        </div>
                    </div>
                </section>

                <footer className="bg-gray-100 dark:bg-gray-800 py-6 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        © {new Date().getFullYear()} JEM II Platform — OIM & AICS
                    </p>
                </footer>
            </div>
        </>
    );
}
