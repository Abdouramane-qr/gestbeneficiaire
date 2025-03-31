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
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import '/resources/css/app.css'; // Import du fichier CSS

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const [isVisible, setIsVisible] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        setIsVisible(true);

        // Animation des compteurs
        let timeoutId: string | number | NodeJS.Timeout | undefined;
        const counters = document.querySelectorAll('.stat-counter');
        counters.forEach(counter => {
            const targetValue = counter.getAttribute('data-target');
            if (targetValue) {
                const target = parseInt(targetValue, 10);
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;

                const updateCounter = () => {
                    current += step;
                    if (current < target) {
                        counter.textContent = Math.ceil(current).toLocaleString();
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target.toLocaleString();
                    }
                };

                timeoutId = setTimeout(() => requestAnimationFrame(updateCounter), 800);
            }
        });

        // Animation d'intersection pour les éléments au défilement
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

        document.querySelectorAll('.scroll-animate').forEach(el => {
            observer.observe(el);
        });

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
            observer.disconnect();
        };
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark', !isDarkMode);
    };

    // Classes d'animation
    const fadeInUp = "transition-all duration-700 transform";
    const initialState = "opacity-0 translate-y-8";
    const animatedState = "opacity-100 translate-y-0";

    return (
        <>
            <Head title="JEM II Platform - Joint Environmental Migration">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600|inter:300,400,500,600,700" rel="stylesheet" />
            </Head>

            <div className={`welcome-container ${isDarkMode ? 'dark' : ''}`}>
                <header className="header bg-white dark:bg-gray-900">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16 sm:h-20">
                            <div className="flex items-center">
                                <Link href="/" className="flex items-center">
                                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">JEM II</span>
                                    <span className="ml-2 text-xl font-semibold hidden sm:inline text-gray-900 dark:text-gray-100">Platform</span>
                                </Link>
                            </div>

                            <nav className="hidden md:flex items-center space-x-4">
                                <Link href="#about" className="nav-link text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400">
                                    À propos
                                </Link>
                                <Link href="#achievements" className="nav-link text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400">
                                    Réalisations
                                </Link>
                                <Link href="#contact" className="nav-link text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400">
                                    Contact
                                </Link>

                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="dashboard-link text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="login-link text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
                                        >
                                            Connexion
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="register-link text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
                                        >
                                            Inscription
                                        </Link>
                                    </>
                                )}
                            </nav>

                            {/* Bouton du menu mobile */}
                            <div className="md:hidden">
                                <button
                                    type="button"
                                    onClick={toggleMobileMenu}
                                    className="mobile-menu-button text-gray-900 dark:text-gray-100"
                                    aria-label={isMobileMenuOpen ? "Fermer le menu principal" : "Ouvrir le menu principal"}
                                >
                                    <span className="sr-only">Open main menu</span>
                                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>
                            </div>

                            {/* Bouton pour basculer entre le mode clair et sombre */}
                            <button
                                onClick={toggleDarkMode}
                                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            >
                                {isDarkMode ? '🌙' : '☀️'}
                            </button>
                        </div>
                    </div>
                </header>

                <main className="main-content bg-white dark:bg-gray-900">
                    {/* Section Hero */}
                    <section className="hero-section bg-white dark:bg-gray-900">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="max-w-4xl mx-auto text-center">
                                <div className={`${fadeInUp} ${isVisible ? animatedState : initialState}`}>
                                    <h1 className="hero-title text-gray-900 dark:text-gray-100">
                                        <span className="text-blue-600 dark:text-blue-400">JEM II</span> Platform
                                    </h1>
                                    <p className="hero-description text-gray-700 dark:text-gray-300">
                                        Joint Environmental Migration II — Supporting vulnerable communities affected by
                                        environmental migration through better data collection, policy planning, and resource management.
                                    </p>
                                </div>

                                <div className={`flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 ${fadeInUp} ${isVisible ? animatedState : initialState}`}
                                     style={{ transitionDelay: '150ms' }}>
                                    <Link
                                        href={auth.user ? route('dashboard') : route('register')}
                                        className="primary-button bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        {auth.user ? 'Accéder au tableau de bord' : 'Commencer →'}
                                    </Link>
                                    <Link
                                        href="/about-jem"
                                        className="secondary-button border border-gray-900 dark:border-gray-100 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    >
                                        En savoir plus sur JEM II
                                    </Link>
                                </div>
                            </div>

                            {/* Image Hero */}
                            <div className={`mt-12 sm:mt-16 max-w-5xl mx-auto ${fadeInUp} ${isVisible ? animatedState : initialState}`} style={{ transitionDelay: '300ms' }}>
                                <div className="hero-image-container">

                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section À propos */}
                    <section id="about" className="about-section bg-white dark:bg-gray-900">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16 scroll-animate">
                                <h2 className="about-title text-gray-900 dark:text-gray-100">À propos du projet</h2>
                                <p className="about-description text-gray-700 dark:text-gray-300">
                                    JEM II est une initiative visant à soutenir les communautés vulnérables touchées par la migration environnementale.
                                </p>
                            </div>


                        </div>
                    </section>

                    {/* Section Statistiques */}
                    <div className="stats-section bg-gray-100 dark:bg-gray-800">
                        <div className="container mx-auto">
                            <h2 className="stats-title text-gray-900 dark:text-gray-100">Nos réalisations</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="text-center">
                                    <h3 className="stat-number text-blue-600 dark:text-blue-400">500+</h3>
                                    <p className="stat-description text-gray-700 dark:text-gray-300">Jeunes formés</p>
                                </div>
                                <div className="text-center">
                                    <h3 className="stat-number text-blue-600 dark:text-blue-400">200+</h3>
                                    <p className="stat-description text-gray-700 dark:text-gray-300">Microentreprises créées</p>
                                </div>
                                <div className="text-center">
                                    <h3 className="stat-number text-blue-600 dark:text-blue-400">80%</h3>
                                    <p className="stat-description text-gray-700 dark:text-gray-300">Taux de réussite</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section CTA */}
                    <div className="cta-section bg-blue-600 dark:bg-blue-700">
                        <div className="container mx-auto text-center">
                            <h2 className="cta-title text-white">Rejoignez-nous dès aujourd'hui !</h2>
                            <p className="cta-description text-gray-100">
                                Participez à notre projet et contribuez à l'autonomisation des jeunes entrepreneurs.
                            </p>
                            <a
                                href="#contact"
                                className="cta-button bg-white text-blue-600 hover:bg-gray-100"
                            >
                                Contactez-nous
                            </a>
                        </div>
                    </div>


                </main>

                <footer className="footer bg-white dark:bg-gray-900">
                    <div className="footer-links">
                        <a href="#" className="footer-link text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400">About</a>
                        <a href="#" className="footer-link text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400">Documentation</a>
                        <a href="#" className="footer-link text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400">Privacy</a>
                        <a href="#" className="footer-link text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400">Terms</a>
                    </div>
                    <p className="footer-text text-gray-700 dark:text-gray-300">© {new Date().getFullYear()} JEM II Platform. All rights reserved.</p>
                </footer>
            </div>
        </>
    );
}
