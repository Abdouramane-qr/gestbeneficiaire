// import { type SharedData } from '@/types';
// import { Head, Link, usePage } from '@inertiajs/react';
// import { useState, useEffect } from 'react';
// import '/resources/css/app.css'; // Import du fichier CSS

// export default function Welcome() {
//     const { auth } = usePage<SharedData>().props;
//     const [isVisible, setIsVisible] = useState(false);
//     const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//     useEffect(() => {
//         setIsVisible(true);

//         // Animation des compteurs
//         let timeoutId: string | number | NodeJS.Timeout | undefined;
//         const counters = document.querySelectorAll('.stat-counter');
//         counters.forEach(counter => {
//             const targetValue = counter.getAttribute('data-target');
//             if (targetValue) {
//                 const target = parseInt(targetValue, 10);
//                 const duration = 2000;
//                 const step = target / (duration / 16);
//                 let current = 0;

//                 const updateCounter = () => {
//                     current += step;
//                     if (current < target) {
//                         counter.textContent = Math.ceil(current).toLocaleString();
//                         requestAnimationFrame(updateCounter);
//                     } else {
//                         counter.textContent = target.toLocaleString();
//                     }
//                 };

//                 timeoutId = setTimeout(() => requestAnimationFrame(updateCounter), 800);
//             }
//         });

//         // Animation d'intersection pour les éléments au défilement
//         const observer = new IntersectionObserver((entries) => {
//             entries.forEach(entry => {
//                 if (entry.isIntersecting) {
//                     entry.target.classList.add('animate-in');
//                     observer.unobserve(entry.target);
//                 }
//             });
//         }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

//         document.querySelectorAll('.scroll-animate').forEach(el => {
//             observer.observe(el);
//         });

//         return () => {
//             if (timeoutId) clearTimeout(timeoutId);
//             observer.disconnect();
//         };
//     }, []);

//     const toggleMobileMenu = () => {
//         setIsMobileMenuOpen(!isMobileMenuOpen);
//     };

//     // Classes d'animation
//     const fadeInUp = "transition-all duration-700 transform";
//     const initialState = "opacity-0 translate-y-8";
//     const animatedState = "opacity-100 translate-y-0";

//     return (
//         <>
//             <Head title="JEM II Platform - Joint Environmental Migration">
//                 <link rel="preconnect" href="https://fonts.bunny.net" />
//                 <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600|inter:300,400,500,600,700" rel="stylesheet" />
//             </Head>

//             <div className="welcome-container">
//                 <header className="header">
//                     <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//                         <div className="flex items-center justify-between h-16 sm:h-20">
//                             <div className="flex items-center">
//                                 <Link href="/" className="flex items-center">
//                                     <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">JEM II</span>
//                                     <span className="ml-2 text-xl font-semibold hidden sm:inline">Platform</span>
//                                 </Link>
//                             </div>

//                             <nav className="hidden md:flex items-center space-x-4">
//                                 <Link href="#about" className="nav-link">
//                                     À propos
//                                 </Link>
//                                 <Link href="#achievements" className="nav-link">
//                                     Réalisations
//                                 </Link>
//                                 <Link href="#contact" className="nav-link">
//                                     Contact
//                                 </Link>

//                                 {auth.user ? (
//                                     <Link
//                                         href={route('dashboard')}
//                                         className="dashboard-link"
//                                     >
//                                         Dashboard
//                                     </Link>
//                                 ) : (
//                                     <>
//                                         <Link
//                                             href={route('login')}
//                                             className="login-link"
//                                         >
//                                             Connexion
//                                         </Link>
//                                         <Link
//                                             href={route('register')}
//                                             className="register-link"
//                                         >
//                                             Inscription
//                                         </Link>
//                                     </>
//                                 )}
//                             </nav>

//                             {/* Bouton du menu mobile */}
//                             <div className="md:hidden">
//                                 <button
//                                     type="button"
//                                     onClick={toggleMobileMenu}
//                                     className="mobile-menu-button"
//                                     aria-label={isMobileMenuOpen ? "Fermer le menu principal" : "Ouvrir le menu principal"}
//                                 >
//                                     <span className="sr-only">Open main menu</span>
//                                     <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
//                                     </svg>
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </header>

//                 <main className="main-content">
//                     {/* Section Hero */}
//                     <section className="hero-section">
//                         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//                             <div className="max-w-4xl mx-auto text-center">
//                                 <div className={`${fadeInUp} ${isVisible ? animatedState : initialState}`}>
//                                     <h1 className="hero-title">
//                                         <span className="text-blue-600 dark:text-blue-400">JEM II</span> Platform
//                                     </h1>
//                                     <p className="hero-description">
//                                         Joint Environmental Migration II — Supporting vulnerable communities affected by
//                                         environmental migration through better data collection, policy planning, and resource management.
//                                     </p>
//                                 </div>

//                                 <div className={`flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 ${fadeInUp} ${isVisible ? animatedState : initialState}`}
//                                      style={{ transitionDelay: '150ms' }}>
//                                     <Link
//                                         href={auth.user ? route('dashboard') : route('register')}
//                                         className="primary-button"
//                                     >
//                                         {auth.user ? 'Accéder au tableau de bord' : 'Commencer →'}
//                                     </Link>
//                                     <Link
//                                         href="/about-jem"
//                                         className="secondary-button"
//                                     >
//                                         En savoir plus sur JEM II
//                                     </Link>
//                                 </div>
//                             </div>

//                             {/* Image Hero */}
//                             <div className={`mt-12 sm:mt-16 max-w-5xl mx-auto ${fadeInUp} ${isVisible ? animatedState : initialState}`} style={{ transitionDelay: '300ms' }}>
//                                 <div className="hero-image-container">

//                                 </div>
//                             </div>
//                         </div>
//                     </section>

//                     {/* Section À propos */}
//                     <section id="about" className="about-section">
//                         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//                             <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16 scroll-animate">
//                                 <h2 className="about-title">À propos du projet</h2>
//                                 <p className="about-description">
//                                     JEM II est une initiative visant à soutenir les communautés vulnérables touchées par la migration environnementale.
//                                 </p>
//                             </div>


//                         </div>
//                     </section>

//                     {/* Section Statistiques */}
//                     <div className="stats-section">
//                         <div className="container mx-auto">
//                             <h2 className="stats-title">Nos réalisations</h2>
//                             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                                 <div className="text-center">
//                                     <h3 className="stat-number">500+</h3>
//                                     <p className="stat-description">Jeunes formés</p>
//                                 </div>
//                                 <div className="text-center">
//                                     <h3 className="stat-number">200+</h3>
//                                     <p className="stat-description">Microentreprises créées</p>
//                                 </div>
//                                 <div className="text-center">
//                                     <h3 className="stat-number">80%</h3>
//                                     <p className="stat-description">Taux de réussite</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Section CTA */}
//                     <div className="cta-section">
//                         <div className="container mx-auto text-center">
//                             <h2 className="cta-title">Rejoignez-nous dès aujourd'hui !</h2>
//                             <p className="cta-description">
//                                 Participez à notre projet et contribuez à l'autonomisation des jeunes entrepreneurs.
//                             </p>
//                             <a
//                                 href="#contact"
//                                 className="cta-button"
//                             >
//                                 Contactez-nous
//                             </a>
//                         </div>
//                     </div>


//                 </main>

//                 <footer className="footer">
//                     <div className="footer-links">
//                         <a href="#" className="footer-link">About</a>
//                         <a href="#" className="footer-link">Documentation</a>
//                         <a href="#" className="footer-link">Privacy</a>
//                         <a href="#" className="footer-link">Terms</a>
//                     </div>
//                     <p className="footer-text">© {new Date().getFullYear()} JEM II Platform. All rights reserved.</p>
//                 </footer>
//             </div>
//         </>
//     );
// }
// import { type SharedData } from '@/types';
// import { Head, Link, usePage } from '@inertiajs/react';
// import { useState, useEffect } from 'react';
// import '/resources/css/app.css'; // Import du fichier CSS

// export default function Welcome() {
//     const { auth } = usePage<SharedData>().props;
//     const [isVisible, setIsVisible] = useState(false);
//     const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//     const [isDarkMode, setIsDarkMode] = useState(false);

//     useEffect(() => {
//         setIsVisible(true);

//         // Animation des compteurs
//         let timeoutId: string | number | NodeJS.Timeout | undefined;
//         const counters = document.querySelectorAll('.stat-counter');
//         counters.forEach(counter => {
//             const targetValue = counter.getAttribute('data-target');
//             if (targetValue) {
//                 const target = parseInt(targetValue, 10);
//                 const duration = 2000;
//                 const step = target / (duration / 16);
//                 let current = 0;

//                 const updateCounter = () => {
//                     current += step;
//                     if (current < target) {
//                         counter.textContent = Math.ceil(current).toLocaleString();
//                         requestAnimationFrame(updateCounter);
//                     } else {
//                         counter.textContent = target.toLocaleString();
//                     }
//                 };

//                 timeoutId = setTimeout(() => requestAnimationFrame(updateCounter), 800);
//             }
//         });

//         // Animation d'intersection pour les éléments au défilement
//         const observer = new IntersectionObserver((entries) => {
//             entries.forEach(entry => {
//                 if (entry.isIntersecting) {
//                     entry.target.classList.add('animate-in');
//                     observer.unobserve(entry.target);
//                 }
//             });
//         }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

//         document.querySelectorAll('.scroll-animate').forEach(el => {
//             observer.observe(el);
//         });

//         return () => {
//             if (timeoutId) clearTimeout(timeoutId);
//             observer.disconnect();
//         };
//     }, []);

//     const toggleMobileMenu = () => {
//         setIsMobileMenuOpen(!isMobileMenuOpen);
//     };

//     const toggleDarkMode = () => {
//         setIsDarkMode(!isDarkMode);
//         document.documentElement.classList.toggle('dark', !isDarkMode);
//     };

//     // Classes d'animation
//     const fadeInUp = "transition-all duration-700 transform";
//     const initialState = "opacity-0 translate-y-8";
//     const animatedState = "opacity-100 translate-y-0";

//     return (
//         <>
//             <Head title="JEM II Platform - Joint Environmental Migration">
//                 <link rel="preconnect" href="https://fonts.bunny.net" />
//                 <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600|inter:300,400,500,600,700" rel="stylesheet" />
//             </Head>

//             <div className={`welcome-container ${isDarkMode ? 'dark' : ''}`}>
//                 <header className="header bg-white dark:bg-gray-900">
//                     <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//                         <div className="flex items-center justify-between h-16 sm:h-20">
//                             <div className="flex items-center">
//                                 <Link href="/" className="flex items-center">
//                                     <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">JEM II</span>
//                                     <span className="ml-2 text-xl font-semibold hidden sm:inline text-gray-900 dark:text-gray-100">Platform</span>
//                                 </Link>
//                             </div>

//                             <nav className="hidden md:flex items-center space-x-4">
//                                 <Link href="#about" className="nav-link text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400">
//                                     À propos
//                                 </Link>
//                                 <Link href="#achievements" className="nav-link text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400">
//                                     Réalisations
//                                 </Link>
//                                 <Link href="#contact" className="nav-link text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400">
//                                     Contact
//                                 </Link>

//                                 {auth.user ? (
//                                     <Link
//                                         href={route('dashboard')}
//                                         className="dashboard-link text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
//                                     >
//                                         Dashboard
//                                     </Link>
//                                 ) : (
//                                     <>
//                                         <Link
//                                             href={route('login')}
//                                             className="login-link text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
//                                         >
//                                             Connexion
//                                         </Link>
//                                         <Link
//                                             href={route('register')}
//                                             className="register-link text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
//                                         >
//                                             Inscription
//                                         </Link>
//                                     </>
//                                 )}
//                             </nav>

//                             {/* Bouton du menu mobile */}
//                             <div className="md:hidden">
//                                 <button
//                                     type="button"
//                                     onClick={toggleMobileMenu}
//                                     className="mobile-menu-button text-gray-900 dark:text-gray-100"
//                                     aria-label={isMobileMenuOpen ? "Fermer le menu principal" : "Ouvrir le menu principal"}
//                                 >
//                                     <span className="sr-only">Open main menu</span>
//                                     <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
//                                     </svg>
//                                 </button>
//                             </div>

//                             {/* Bouton pour basculer entre le mode clair et sombre */}
//                             <button
//                                 onClick={toggleDarkMode}
//                                 className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
//                             >
//                                 {isDarkMode ? '🌙' : '☀️'}
//                             </button>
//                         </div>
//                     </div>
//                 </header>

//                 <main className="main-content bg-white dark:bg-gray-900">
//                     {/* Section Hero */}
//                     <section className="hero-section bg-white dark:bg-gray-900">
//                         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//                             <div className="max-w-4xl mx-auto text-center">
//                                 <div className={`${fadeInUp} ${isVisible ? animatedState : initialState}`}>
//                                     <h1 className="hero-title text-gray-900 dark:text-gray-100">
//                                         <span className="text-blue-600 dark:text-blue-400">JEM II</span> Platform
//                                     </h1>
//                                     <p className="hero-description text-gray-700 dark:text-gray-300">
//                                         Joint Environmental Migration II — Supporting vulnerable communities affected by
//                                         environmental migration through better data collection, policy planning, and resource management.
//                                     </p>
//                                 </div>

//                                 <div className={`flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 ${fadeInUp} ${isVisible ? animatedState : initialState}`}
//                                      style={{ transitionDelay: '150ms' }}>
//                                     <Link
//                                         href={auth.user ? route('dashboard') : route('register')}
//                                         className="primary-button bg-blue-600 hover:bg-blue-700 text-white"
//                                     >
//                                         {auth.user ? 'Accéder au tableau de bord' : 'Commencer →'}
//                                     </Link>
//                                     <Link
//                                         href="/about-jem"
//                                         className="secondary-button border border-gray-900 dark:border-gray-100 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
//                                     >
//                                         En savoir plus sur JEM II
//                                     </Link>
//                                 </div>
//                             </div>

//                             {/* Image Hero */}
//                             <div className={`mt-12 sm:mt-16 max-w-5xl mx-auto ${fadeInUp} ${isVisible ? animatedState : initialState}`} style={{ transitionDelay: '300ms' }}>
//                                 <div className="hero-image-container">

//                                 </div>
//                             </div>
//                         </div>
//                     </section>

//                     {/* Section À propos */}
//                     <section id="about" className="about-section bg-white dark:bg-gray-900">
//                         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//                             <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16 scroll-animate">
//                                 <h2 className="about-title text-gray-900 dark:text-gray-100">À propos du projet</h2>
//                                 <p className="about-description text-gray-700 dark:text-gray-300">
//                                     JEM II est une initiative visant à soutenir les communautés vulnérables touchées par la migration environnementale.
//                                 </p>
//                             </div>


//                         </div>
//                     </section>

//                     {/* Section Statistiques */}
//                     <div className="stats-section bg-gray-100 dark:bg-gray-800">
//                         <div className="container mx-auto">
//                             <h2 className="stats-title text-gray-900 dark:text-gray-100">Nos réalisations</h2>
//                             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                                 <div className="text-center">
//                                     <h3 className="stat-number text-blue-600 dark:text-blue-400">500+</h3>
//                                     <p className="stat-description text-gray-700 dark:text-gray-300">Jeunes formés</p>
//                                 </div>
//                                 <div className="text-center">
//                                     <h3 className="stat-number text-blue-600 dark:text-blue-400">200+</h3>
//                                     <p className="stat-description text-gray-700 dark:text-gray-300">Microentreprises créées</p>
//                                 </div>
//                                 <div className="text-center">
//                                     <h3 className="stat-number text-blue-600 dark:text-blue-400">80%</h3>
//                                     <p className="stat-description text-gray-700 dark:text-gray-300">Taux de réussite</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Section CTA */}
//                     <div className="cta-section bg-blue-600 dark:bg-blue-700">
//                         <div className="container mx-auto text-center">
//                             <h2 className="cta-title text-white">Rejoignez-nous dès aujourd'hui !</h2>
//                             <p className="cta-description text-gray-100">
//                                 Participez à notre projet et contribuez à l'autonomisation des jeunes entrepreneurs.
//                             </p>
//                             <a
//                                 href="#contact"
//                                 className="cta-button bg-white text-blue-600 hover:bg-gray-100"
//                             >
//                                 Contactez-nous
//                             </a>
//                         </div>
//                     </div>


//                 </main>

//                 <footer className="footer bg-white dark:bg-gray-900">
//                     <div className="footer-links">
//                         <a href="#" className="footer-link text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400">About</a>
//                         <a href="#" className="footer-link text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400">Documentation</a>
//                         <a href="#" className="footer-link text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400">Privacy</a>
//                         <a href="#" className="footer-link text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400">Terms</a>
//                     </div>
//                     <p className="footer-text text-gray-700 dark:text-gray-300">© {new Date().getFullYear()} JEM II Platform. All rights reserved.</p>
//                 </footer>
//             </div>
//         </>
//     );
// }
// import { type SharedData } from '@/types';
// import { Head, Link, usePage } from '@inertiajs/react';
// import { useState, useEffect } from 'react';
// import '/resources/css/app.css';

// export default function Welcome() {
//     const { auth } = usePage<SharedData>().props;
//     const [isVisible, setIsVisible] = useState(false);
//     const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//     const [isDarkMode, setIsDarkMode] = useState(false);
//     const [currentLanguage, setCurrentLanguage] = useState('fr');
//     const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);

//     // Traductions
//     const translations = {
//         fr: {
//             about: 'À propos',
//             achievements: 'Réalisations',
//             contact: 'Contact',
//             dashboard: 'Tableau de bord',
//             login: 'Connexion',
//             register: 'Inscription',
//             heroDescription: 'Joint Environmental Migration II — Soutien aux communautés vulnérables affectées par la migration environnementale grâce à une meilleure collecte de données, une planification politique et une gestion des ressources.',
//             getStarted: 'Commencer →',
//             accessDashboard: 'Accéder au tableau de bord',
//             learnMore: 'En savoir plus sur JEM II',
//             aboutTitle: 'À propos du projet',
//             aboutDescription: 'JEM II est une initiative visant à soutenir les communautés vulnérables touchées par la migration environnementale.',
//             statsTitle: 'Nos réalisations',
//             youngTrained: 'Jeunes formés',
//             companiesCreated: 'Microentreprises créées',
//             successRate: 'Taux de réussite',
//             ctaTitle: 'Rejoignez-nous dès aujourd\'hui !',
//             ctaDescription: 'Participez à notre projet et contribuez à l\'autonomisation des jeunes entrepreneurs.',
//             contactUs: 'Contactez-nous',
//             allRightsReserved: 'Tous droits réservés'
//         },
//         en: {
//             about: 'About',
//             achievements: 'Achievements',
//             contact: 'Contact',
//             dashboard: 'Dashboard',
//             login: 'Login',
//             register: 'Register',
//             heroDescription: 'Joint Environmental Migration II — Supporting vulnerable communities affected by environmental migration through better data collection, policy planning, and resource management.',
//             getStarted: 'Get Started →',
//             accessDashboard: 'Access Dashboard',
//             learnMore: 'Learn more about JEM II',
//             aboutTitle: 'About the Project',
//             aboutDescription: 'JEM II is an initiative aimed at supporting vulnerable communities affected by environmental migration.',
//             statsTitle: 'Our Achievements',
//             youngTrained: 'Youth Trained',
//             companiesCreated: 'Micro-enterprises Created',
//             successRate: 'Success Rate',
//             ctaTitle: 'Join us today!',
//             ctaDescription: 'Participate in our project and contribute to the empowerment of young entrepreneurs.',
//             contactUs: 'Contact Us',
//             allRightsReserved: 'All rights reserved'
//         }
//     };

//     const t = translations[currentLanguage];

//     useEffect(() => {
//         setIsVisible(true);

//         // Animation des compteurs
//         let timeoutId: string | number | NodeJS.Timeout | undefined;
//         const counters = document.querySelectorAll('.stat-counter');
//         counters.forEach(counter => {
//             const targetValue = counter.getAttribute('data-target');
//             if (targetValue) {
//                 const target = parseInt(targetValue, 10);
//                 const duration = 2000;
//                 const step = target / (duration / 16);
//                 let current = 0;

//                 const updateCounter = () => {
//                     current += step;
//                     if (current < target) {
//                         counter.textContent = Math.ceil(current).toLocaleString();
//                         requestAnimationFrame(updateCounter);
//                     } else {
//                         counter.textContent = target.toLocaleString();
//                     }
//                 };

//                 timeoutId = setTimeout(() => requestAnimationFrame(updateCounter), 800);
//             }
//         });

//         // Animation d'intersection pour les éléments au défilement
//         const observer = new IntersectionObserver((entries) => {
//             entries.forEach(entry => {
//                 if (entry.isIntersecting) {
//                     entry.target.classList.add('animate-in');
//                     observer.unobserve(entry.target);
//                 }
//             });
//         }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

//         document.querySelectorAll('.scroll-animate').forEach(el => {
//             observer.observe(el);
//         });

//         // Vérifier la préférence du système pour le mode sombre
//         if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
//             setIsDarkMode(true);
//             document.documentElement.classList.add('dark');
//         }

//         return () => {
//             if (timeoutId) clearTimeout(timeoutId);
//             observer.disconnect();
//         };
//     }, []);

//     const toggleMobileMenu = () => {
//         setIsMobileMenuOpen(!isMobileMenuOpen);
//         if (isLanguageMenuOpen) setIsLanguageMenuOpen(false);
//     };

//     const toggleLanguageMenu = () => {
//         setIsLanguageMenuOpen(!isLanguageMenuOpen);
//     };

//     const changeLanguage = (lang) => {
//         setCurrentLanguage(lang);
//         setIsLanguageMenuOpen(false);
//     };

//     const toggleDarkMode = () => {
//         setIsDarkMode(!isDarkMode);
//         document.documentElement.classList.toggle('dark', !isDarkMode);
//     };

//     // Classes d'animation
//     const fadeInUp = "transition-all duration-700 transform";
//     const initialState = "opacity-0 translate-y-8";
//     const animatedState = "opacity-100 translate-y-0";

//     return (
//         <>
//             <Head title="JEM II Platform - Joint Environmental Migration">
//                 <link rel="preconnect" href="https://fonts.bunny.net" />
//                 <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600|inter:300,400,500,600,700" rel="stylesheet" />
//                 <meta name="description" content="Joint Environmental Migration II - Supporting vulnerable communities affected by environmental migration" />
//             </Head>

//             <div className={`welcome-container ${isDarkMode ? 'dark' : ''}`}>
//                 <header className="header sticky top-0 z-50 bg-white/90 backdrop-blur-md dark:bg-gray-900/90 shadow-sm">
//                     <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//                         <div className="flex items-center justify-between h-16 sm:h-20">
//                             <div className="flex items-center">
//                                 <Link href="/" className="flex items-center group">
//                                     <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition duration-300">JEM II</span>
//                                     <span className="ml-2 text-xl font-semibold hidden sm:inline text-gray-900 dark:text-gray-100">Platform</span>
//                                 </Link>
//                             </div>

//                             <nav className="hidden md:flex items-center space-x-6">
//                                 <Link href="#about" className="nav-link text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium transition duration-300">
//                                     {t.about}
//                                 </Link>
//                                 <Link href="#achievements" className="nav-link text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium transition duration-300">
//                                     {t.achievements}
//                                 </Link>
//                                 <Link href="#contact" className="nav-link text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium transition duration-300">
//                                     {t.contact}
//                                 </Link>

//                                 {auth.user ? (
//                                     <Link
//                                         href={route('dashboard')}
//                                         className="dashboard-link ml-4 px-4 py-2 rounded-md bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 text-sm font-medium transition duration-300"
//                                     >
//                                         {t.dashboard}
//                                     </Link>
//                                 ) : (
//                                     <>
//                                         <Link
//                                             href={route('login')}
//                                             className="login-link text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium transition duration-300"
//                                         >
//                                             {t.login}
//                                         </Link>
//                                         <Link
//                                             href={route('register')}
//                                             className="register-link ml-4 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-sm font-medium transition duration-300"
//                                         >
//                                             {t.register}
//                                         </Link>
//                                     </>
//                                 )}
//                             </nav>

//                             <div className="flex items-center space-x-3">
//                                 {/* Sélecteur de langue */}
//                                 <div className="relative">
//                                     <button
//                                         onClick={toggleLanguageMenu}
//                                         className="flex items-center text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium focus:outline-none"
//                                         aria-expanded={isLanguageMenuOpen}
//                                         aria-haspopup="true"
//                                     >
//                                         <span className="mr-1">{currentLanguage.toUpperCase()}</span>
//                                         <svg
//                                             className={`h-4 w-4 transition-transform ${isLanguageMenuOpen ? 'rotate-180' : ''}`}
//                                             xmlns="http://www.w3.org/2000/svg"
//                                             viewBox="0 0 20 20"
//                                             fill="currentColor"
//                                         >
//                                             <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//                                         </svg>
//                                     </button>
//                                     {isLanguageMenuOpen && (
//                                         <div className="absolute right-0 mt-2 w-24 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
//                                             <div className="py-1" role="menu" aria-orientation="vertical">
//                                                 <button
//                                                     onClick={() => changeLanguage('fr')}
//                                                     className={`block w-full text-left px-4 py-2 text-sm ${currentLanguage === 'fr' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200' : 'text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
//                                                     role="menuitem"
//                                                 >
//                                                     Français
//                                                 </button>
//                                                 <button
//                                                     onClick={() => changeLanguage('en')}
//                                                     className={`block w-full text-left px-4 py-2 text-sm ${currentLanguage === 'en' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200' : 'text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
//                                                     role="menuitem"
//                                                 >
//                                                     English
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>

//                                 {/* Bouton pour basculer entre le mode clair et sombre */}
//                                 <button
//                                     onClick={toggleDarkMode}
//                                     className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300 focus:outline-none"
//                                     aria-label={isDarkMode ? 'Activer le mode clair' : 'Activer le mode sombre'}
//                                 >
//                                     {isDarkMode ? (
//                                         <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
//                                             <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
//                                         </svg>
//                                     ) : (
//                                         <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
//                                             <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
//                                         </svg>
//                                     )}
//                                 </button>

//                                 {/* Bouton du menu mobile */}
//                                 <div className="md:hidden">
//                                     <button
//                                         type="button"
//                                         onClick={toggleMobileMenu}
//                                         className="mobile-menu-button p-2 rounded-md text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-300 focus:outline-none"
//                                         aria-label={isMobileMenuOpen ? "Fermer le menu principal" : "Ouvrir le menu principal"}
//                                     >
//                                         <span className="sr-only">Open main menu</span>
//                                         {isMobileMenuOpen ? (
//                                             <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                                             </svg>
//                                         ) : (
//                                             <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
//                                             </svg>
//                                         )}
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Menu mobile */}
//                         {isMobileMenuOpen && (
//                             <div className="md:hidden">
//                                 <div className="py-4 space-y-4 border-t border-gray-200 dark:border-gray-700">
//                                     <Link
//                                         href="#about"
//                                         className="block py-2 px-4 text-base font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition duration-300"
//                                         onClick={() => setIsMobileMenuOpen(false)}
//                                     >
//                                         {t.about}
//                                     </Link>
//                                     <Link
//                                         href="#achievements"
//                                         className="block py-2 px-4 text-base font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition duration-300"
//                                         onClick={() => setIsMobileMenuOpen(false)}
//                                     >
//                                         {t.achievements}
//                                     </Link>
//                                     <Link
//                                         href="#contact"
//                                         className="block py-2 px-4 text-base font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition duration-300"
//                                         onClick={() => setIsMobileMenuOpen(false)}
//                                     >
//                                         {t.contact}
//                                     </Link>

//                                     {auth.user ? (
//                                         <Link
//                                             href={route('dashboard')}
//                                             className="block py-2 px-4 text-base font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition duration-300"
//                                             onClick={() => setIsMobileMenuOpen(false)}
//                                         >
//                                             {t.dashboard}
//                                         </Link>
//                                     ) : (
//                                         <>
//                                             <Link
//                                                 href={route('login')}
//                                                 className="block py-2 px-4 text-base font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition duration-300"
//                                                 onClick={() => setIsMobileMenuOpen(false)}
//                                             >
//                                                 {t.login}
//                                             </Link>
//                                             <Link
//                                                 href={route('register')}
//                                                 className="block py-2 px-4 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition duration-300"
//                                                 onClick={() => setIsMobileMenuOpen(false)}
//                                             >
//                                                 {t.register}
//                                             </Link>
//                                         </>
//                                     )}
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </header>

//                 <main className="main-content bg-white dark:bg-gray-900">
//                     {/* Section Hero */}
//                     <section className="hero-section py-16 sm:py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
//                         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//                             <div className="max-w-4xl mx-auto text-center">
//                                 <div className={`${fadeInUp} ${isVisible ? animatedState : initialState}`}>
//                                     <h1 className="hero-title text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-gray-100">
//                                         <span className="text-blue-600 dark:text-blue-400">JEM II</span> Platform
//                                     </h1>
//                                     <p className="hero-description text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
//                                         {t.heroDescription}
//                                     </p>
//                                 </div>

//                                 <div className={`flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 ${fadeInUp} ${isVisible ? animatedState : initialState}`}
//                                      style={{ transitionDelay: '150ms' }}>
//                                     <Link
//                                         href={auth.user ? route('dashboard') : route('register')}
//                                         className="primary-button px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1"
//                                     >
//                                         {auth.user ? t.accessDashboard : t.getStarted}
//                                     </Link>
//                                     <Link
//                                         href="/about-jem"
//                                         className="secondary-button px-6 py-3 rounded-lg border border-gray-900 dark:border-gray-100 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition duration-300 transform hover:-translate-y-1"
//                                     >
//                                         {t.learnMore}
//                                     </Link>
//                                 </div>
//                             </div>

//                             {/* Image Hero */}
//                             <div className={`mt-16 max-w-6xl mx-auto rounded-xl overflow-hidden shadow-2xl ${fadeInUp} ${isVisible ? animatedState : initialState}`} style={{ transitionDelay: '300ms' }}>
//                                 <div className="hero-image-container bg-gray-200 dark:bg-gray-700 aspect-[16/9] flex items-center justify-center">
//                                     <svg className="w-24 h-24 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                                     </svg>
//                                 </div>
//                             </div>
//                         </div>
//                     </section>

//                     {/* Section Caractéristiques */}
//                     <section className="features-section py-16 sm:py-24 bg-white dark:bg-gray-900">
//                         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//                             <div className="max-w-3xl mx-auto text-center mb-16 scroll-animate">
//                                 <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Solutions intégrées</h2>
//                                 <p className="text-lg text-gray-700 dark:text-gray-300">
//                                     Notre plateforme offre des outils complets pour la gestion des migrations environnementales.
//                                 </p>
//                             </div>

//                             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
//                                 <div className="feature-card bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition duration-300 scroll-animate">
//                                     <div className="feature-icon-container mb-4 bg-blue-100 dark:bg-blue-900/30 p-3 inline-block rounded-full">
//                                         <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//                                         </svg>
//                                     </div>
//                                     <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Analyse de données</h3>
//                                     <p className="text-gray-700 dark:text-gray-300">
//                                         Collecte et analyse de données pour comprendre les tendances migratoires liées aux changements environnementaux.
//                                     </p>
//                                 </div>

//                                 <div className="feature-card bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition duration-300 scroll-animate">
//                                     <div className="feature-icon-container mb-4 bg-blue-100 dark:bg-blue-900/30 p-3 inline-block rounded-full">
//                                         <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
//                                         </svg>
//                                     </div>
//                                     <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Soutien communautaire</h3>
//                                     <p className="text-gray-700 dark:text-gray-300">
//                                         Programmes pour accompagner les communautés impactées et faciliter leur adaptation aux changements.
//                                     </p>
//                                 </div>

//                                 <div className="feature-card bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition duration-300 scroll-animate">
//                                     <div className="feature-icon-container mb-4 bg-blue-100 dark:bg-blue-900/30 p-3 inline-block rounded-full">
//                                         <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//                                         </svg>
//                                     </div>
//                                     <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Planification politique</h3>
//                                     <p className="text-gray-700 dark:text-gray-300">
//                                         Outils d'aide à la décision pour développer des politiques efficaces en matière de migration environnementale.
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                     </section>

//                     {/* Section À propos */}
//                     <section id="about" className="about-section py-16 sm:py-24 bg-gray-50 dark:bg-gray-800">
//                         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//                             <div className="max-w-6xl mx-auto">
//                                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
//                                     <div className="scroll-animate">
//                                         <h2 className="about-title text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">{t.aboutTitle}</h2>
//                                         <p className="about-description text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
//                                             {t.aboutDescription}
//                                         </p>
//                                         <p className="text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
//                                             Notre mission est de développer des solutions innovantes pour anticiper, gérer et atténuer les conséquences des migrations liées aux changements environnementaux. Nous travaillons en étroite collaboration avec les communautés, les autorités locales et les organisations internationales.
//                                         </p>
//                                         <div className="flex flex-wrap gap-4">
//                                             <a href="#contact" className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md hover:shadow-lg transition duration-300">
//                                                 {t.contactUs}
//                                             </a>
//                                             <a href="/documentation" className="px-6 py-3 rounded-lg border border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 font-medium transition duration-300">
//                                                 Documentation
//                                             </a>
//                                         </div>
//                                     </div>
//                                     <div className="about-image-container bg-white dark:bg-gray-700 rounded-xl overflow-hidden shadow-xl scroll-animate">
//                                         <div className="aspect-[4/3] bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/50 dark:to-gray-800 flex items-center justify-center">
//                                             <svg className="w-32 h-32 text-blue-600/50 dark:text-blue-400/50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                             </svg>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </section>

//                     {/* Section Statistiques */}
//                     <section id="achievements" className="stats-section py-16 sm:py-24 bg-white dark:bg-gray-900">
//                         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//                             <h2 className="stats-title text-3xl font-bold mb-12 text-center text-gray-900 dark:text-gray-100">{t.statsTitle}</h2>
//                             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
//                                 <div className="stat-card bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md hover:shadow-xl transition duration-300 text-center scroll-animate border-t-4 border-blue-600 dark:border-blue-400">
//                                     <h3 className="stat-number text-4xl font-bold mb-4 text-blue-600 dark:text-blue-400 stat-counter" data-target="500">
//                                         500+
//                                     </h3>
//                                     <p className="stat-description text-lg text-gray-700 dark:text-gray-300">{t.youngTrained}</p>
//                                 </div>
//                                 <div className="stat-card bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md hover:shadow-xl transition duration-300 text-center scroll-animate border-t-4 border-blue-600 dark:border-blue-400">
//                                     <h3 className="stat-number text-4xl font-bold mb-4 text-blue-600 dark:text-blue-400 stat-counter" data-target="200">
//                                         200+
//                                     </h3>
//                                     <p className="stat-description text-lg text-gray-700 dark:text-gray-300">{t.companiesCreated}</p>
//                                 </div>
//                                 <div className="stat-card bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md hover:shadow-xl transition duration-300 text-center scroll-animate border-t-4 border-blue-600 dark:border-blue-400">
//                                     <h3 className="stat-number text-4xl font-bold mb-4 text-blue-600 dark:text-blue-400 stat-counter" data-target="80">
//                                         80%
//                                     </h3>
//                                     <p className="stat-description text-lg text-gray-700 dark:text-gray-300">{t.successRate}</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </section>

//                     {/* Section Témoignages */}
//                     <section className="testimonials-section py-16 sm:py-24 bg-gray-50 dark:bg-gray-800">
//                         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//                             <div className="max-w-3xl mx-auto text-center mb-16 scroll-animate">
//                                 <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Témoignages</h2>
//                                 <p className="text-lg text-gray-700 dark:text-gray-300">
//                                     Découvrez l'impact de notre plateforme à travers les expériences de nos partenaires.
//                                 </p>
//                             </div>

//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
//                                 <div className="testimonial-card bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md hover:shadow-lg transition duration-300 scroll-animate">
//                                     <div className="flex items-center mb-4">
//                                         <div className="testimonial-avatar bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
//                                             <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                                             </svg>
//                                         </div>
//                                         <div className="ml-4">
//                                             <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Marie Dupont</h3>
//                                             <p className="text-sm text-gray-600 dark:text-gray-400">ONG Environnement & Migration</p>
//                                         </div>
//                                     </div>
//                                     <p className="text-gray-700 dark:text-gray-300 italic">
//                                         "La plateforme JEM II nous a permis de collecter des données précieuses sur les flux migratoires dans notre région. Ces informations sont essentielles pour élaborer des stratégies d'adaptation efficaces."
//                                     </p>
//                                 </div>

//                                 <div className="testimonial-card bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md hover:shadow-lg transition duration-300 scroll-animate">
//                                     <div className="flex items-center mb-4">
//                                         <div className="testimonial-avatar bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
//                                             <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                                             </svg>
//                                         </div>
//                                         <div className="ml-4">
//                                             <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Thomas Martin</h3>
//                                             <p className="text-sm text-gray-600 dark:text-gray-400">Agence de Développement Local</p>
//                                         </div>
//                                     </div>
//                                     <p className="text-gray-700 dark:text-gray-300 italic">
//                                         "Grâce à JEM II, nous avons pu mettre en place des programmes de formation adaptés aux besoins des communautés déplacées. L'impact sur l'intégration sociale et économique a été remarquable."
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                     </section>

//                     {/* Section CTA */}
//                     <section className="cta-section py-16 sm:py-20 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800">
//                         <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
//                             <h2 className="cta-title text-3xl font-bold mb-6 text-white">{t.ctaTitle}</h2>
//                             <p className="cta-description text-xl text-gray-100 mb-8 max-w-3xl mx-auto">
//                                 {t.ctaDescription}
//                             </p>
//                             <a
//                                 href="#contact"
//                                 className="cta-button px-8 py-4 rounded-lg bg-white text-blue-600 hover:bg-gray-100 font-medium shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1"
//                             >
//                                 {t.contactUs}
//                             </a>
//                         </div>
//                     </section>

//                     {/* Section Contact */}
//                     <section id="contact" className="contact-section py-16 sm:py-24 bg-white dark:bg-gray-900">
//                         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//                             <div className="max-w-6xl mx-auto">
//                                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
//                                     <div className="scroll-animate">
//                                         <h2 className="contact-title text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">{t.contact}</h2>
//                                         <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
//                                             Nous sommes à votre disposition pour répondre à toutes vos questions concernant la plateforme JEM II.
//                                         </p>

//                                         <div className="space-y-6">
//                                             <div className="flex items-start">
//                                                 <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
//                                                     <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                                                     </svg>
//                                                 </div>
//                                                 <div className="ml-4">
//                                                     <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Email</h3>
//                                                     <p className="text-gray-700 dark:text-gray-300">contact@jemii-platform.org</p>
//                                                 </div>
//                                             </div>

//                                             <div className="flex items-start">
//                                                 <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
//                                                     <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//                                                     </svg>
//                                                 </div>
//                                                 <div className="ml-4">
//                                                     <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Téléphone</h3>
//                                                     <p className="text-gray-700 dark:text-gray-300">+33 (0)1 23 45 67 89</p>
//                                                 </div>
//                                             </div>

//                                             <div className="flex items-start">
//                                                 <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
//                                                     <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                                                     </svg>
//                                                 </div>
//                                                 <div className="ml-4">
//                                                     <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Adresse</h3>
//                                                     <p className="text-gray-700 dark:text-gray-300">123 Avenue de l'Innovation, 75001 Paris, France</p>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <div className="contact-form bg-gray-50 dark:bg-gray-800 rounded-xl p-8 shadow-lg scroll-animate">
//                                         <h3 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Envoyez-nous un message</h3>
//                                         <form>
//                                             <div className="mb-6">
//                                                 <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nom</label>
//                                                 <input
//                                                     type="text"
//                                                     id="name"
//                                                     className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
//                                                     placeholder="Votre nom"
//                                                 />
//                                             </div>
//                                             <div className="mb-6">
//                                                 <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
//                                                 <input
//                                                     type="email"
//                                                     id="email"
//                                                     className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
//                                                     placeholder="Votre email"
//                                                 />
//                                             </div>
//                                             <div className="mb-6">
//                                                 <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
//                                                 <textarea
//                                                     id="message"
//                                                     rows={5}
//                                                     className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
//                                                     placeholder="Votre message"
//                                                 ></textarea>
//                                             </div>
//                                             <button
//                                                 type="submit"
//                                                 className="w-full px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md hover:shadow-lg transition duration-300"
//                                             >
//                                                 Envoyer
//                                             </button>
//                                         </form>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </section>
//                 </main>

//                 <footer className="footer py-12 bg-gray-900 text-gray-100">
//                     <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//                         <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
//                             <div>
//                                 <div className="flex items-center mb-4">
//                                     <span className="text-2xl font-bold text-blue-400">JEM II</span>
//                                     <span className="ml-2 text-lg font-semibold text-gray-100">Platform</span>
//                                 </div>
//                                 <p className="text-gray-400 mb-4">
//                                     Soutenir les communautés vulnérables touchées par la migration environnementale.
//                                 </p>
//                                 <div className="flex space-x-4">
//                                     <a href="#" className="text-gray-400 hover:text-white transition duration-300">
//                                         <span className="sr-only">Facebook</span>
//                                         <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
//                                             <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
//                                         </svg>
//                                     </a>
//                                     <a href="#" className="text-gray-400 hover:text-white transition duration-300">
//                                         <span className="sr-only">Twitter</span>
//                                         <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
//                                             <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
//                                         </svg>
//                                     </a>
//                                     <a href="#" className="text-gray-400 hover:text-white transition duration-300">
//                                         <span className="sr-only">LinkedIn</span>
//                                         <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
//                                             <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
//                                         </svg>
//                                     </a>
//                                 </div>
//                             </div>

//                             <div>
//                                 <h3 className="text-lg font-semibold mb-4">Navigation</h3>
//                                 <ul className="space-y-3">
//                                     <li>
//                                         <a href="#" className="text-gray-400 hover:text-white transition duration-300">Accueil</a>
//                                     </li>
//                                     <li>
//                                         <a href="#about" className="text-gray-400 hover:text-white transition duration-300">À propos</a>
//                                     </li>
//                                     <li>
//                                         <a href="#achievements" className="text-gray-400 hover:text-white transition duration-300">Réalisations</a>
//                                     </li>
//                                     <li>
//                                         <a href="#contact" className="text-gray-400 hover:text-white transition duration-300">Contact</a>
//                                     </li>
//                                 </ul>
//                             </div>

//                             <div>
//                                 <h3 className="text-lg font-semibold mb-4">Ressources</h3>
//                                 <ul className="space-y-3">
//                                     <li>
//                                         <a href="#" className="text-gray-400 hover:text-white transition duration-300">Documentation</a>
//                                     </li>
//                                     <li>
//                                         <a href="#" className="text-gray-400 hover:text-white transition duration-300">Rapports</a>
//                                     </li>
//                                     <li>
//                                         <a href="#" className="text-gray-400 hover:text-white transition duration-300">Études de cas</a>
//                                     </li>
//                                     <li>
//                                         <a href="#" className="text-gray-400 hover:text-white transition duration-300">FAQ</a>
//                                     </li>
//                                 </ul>
//                             </div>

//                             <div>
//                                 <h3 className="text-lg font-semibold mb-4">Légal</h3>
//                                 <ul className="space-y-3">
//                                     <li>
//                                         <a href="#" className="text-gray-400 hover:text-white transition duration-300">Mentions légales</a>
//                                     </li>
//                                     <li>
//                                         <a href="#" className="text-gray-400 hover:text-white transition duration-300">Politique de confidentialité</a>
//                                     </li>
//                                     <li>
//                                         <a href="#" className="text-gray-400 hover:text-white transition duration-300">Conditions d'utilisation</a>
//                                     </li>
//                                     <li>
//                                         <a href="#" className="text-gray-400 hover:text-white transition duration-300">Cookies</a>
//                                     </li>
//                                 </ul>
//                             </div>
//                         </div>

//                         <div className="border-t border-gray-800 pt-8">
//                             <p className="text-gray-400 text-center">© {new Date().getFullYear()} JEM II Platform. {t.allRightsReserved}.</p>
//                         </div>
//                     </div>
//                 </footer>
//             </div>
//         </>
//     );
// }

// resources/js/Pages/Welcome.tsx
import React, { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage().props;
    const [language, setLanguage] = useState<'fr' | 'en'>('fr');
    const [darkMode, setDarkMode] = useState(false);
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
            whyImportant: 'Dans un contexte de vulnérabilité climatique et socio-économique, renforcer les capacités des jeunes est essentiel pour un développement durable.'
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
            whyImportant: 'In a context of climate and socio-economic vulnerability, strengthening youth capacity is essential for sustainable development.'
        }
    };

    const t = translations[language];

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLanguage(e.target.value as 'fr' | 'en');
    };

    return (
        <>
            <Head title="JEM II Platform" />
            <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
                <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 shadow-sm">
                    <div className="container mx-auto px-4 flex justify-between items-center h-16">
                        <div className="flex flex-col">
                            <div className="flex items-center">
                                <img
                                    src={logo}
                                    alt="JEM II Logo"
                                    className="h-10 w-auto mr-4 object-contain"
                                />
                                 {/* <Link href="/" className="text-xl font-bold text-blue-600 dark:text-blue-200">
          JEM II
        </Link> */}
        <Link href="/" className="text-base font-bold text-blue-600 dark:text-blue-200 ml-4">
          Bienvenue sur la plateforme de suivi des jeunes promoteurs d'entreprise bénéficiaires du projet JEM II
        </Link>
                            </div>

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
                </header>

                <main className="container mx-auto px-4 py-16">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-gray-100">{t.heroTitle}</h1>
                        <p className="text-xl mb-8 text-gray-700 dark:text-gray-300">{t.heroDescription}</p>

                        <div className="flex justify-center space-x-4">
                            <Link
                                href={auth.user ? route('dashboard') : route('register')}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg"
                            >
                                {auth.user ? t.dashboard : t.getStarted}

                            </Link>
                            <Link
                                href="/about"
                                className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg"
                            >
                                {t.learnMore}
                            </Link>
                        </div>
                    </div>

                    <section className="mt-16">
                        <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                            {t.projectTitle}
                        </h2>
                        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                            {t.projectDescription}
                        </p>
                        <div className="grid md:grid-cols-3 gap-6">
                            {t.projectKeyPoints.map((point, index) => (
                                <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                                    <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400">{point.title}</h3>
                                    <p className="text-gray-700 dark:text-gray-300 mt-2">{point.description}</p>
                                </div>
                            ))}
                        </div>
                        <p className="text-md text-gray-600 dark:text-gray-400 mt-6">{t.whyImportant}</p>
                    </section>
                </main>

                <footer className="bg-gray-100 dark:bg-gray-800 py-6 text-center">
                    <p className="text-gray-600 dark:text-gray-400">
                        © {new Date().getFullYear()} JEM II Platform — OIM & AICS
                    </p>
                </footer>
            </div>
        </>
    );
}
