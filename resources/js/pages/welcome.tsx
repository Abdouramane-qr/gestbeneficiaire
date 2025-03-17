
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);

        // Animation pour les stats qui comptent vers le haut
        const counters = document.querySelectorAll('.stat-counter');
        counters.forEach(counter => {
            const targetValue = counter.getAttribute('data-target');
            if (targetValue) { // Vérifie que targetValue n'est pas null
                const target = parseInt(targetValue, 10); // Convertit en nombre
                const duration = 2000; // ms
                const step = target / (duration / 16); // pour un rafraîchissement à environ 60fps
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

                setTimeout(() => requestAnimationFrame(updateCounter), 800);
            }
        });

        // Observer pour les animations au scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.scroll-animate').forEach(el => {
            observer.observe(el);
        });

        return () => {
            observer.disconnect();
        };
    }, []);

    // Animation classes pour les entrées
    const fadeInUp = "transition-all duration-700 transform";
    const initialState = "opacity-0 translate-y-8";
    const animatedState = "opacity-100 translate-y-0";

    return (
        <>
            <Head title="Welcome to JEM II Platform">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
                <style>{`
                    .animate-in {
                        opacity: 1 !important;
                        transform: translateY(0) !important;
                    }
                    .scroll-animate {
                        opacity: 0;
                        transform: translateY(20px);
                        transition: all 0.7s ease-out;
                    }
                    .pulse-soft {
                        animation: pulse-soft 3s infinite;
                    }
                    @keyframes pulse-soft {
                        0% { transform: scale(1); }
                        50% { transform: scale(1.05); }
                        100% { transform: scale(1); }
                    }
                    .region-marker {
                        transition: all 0.3s ease;
                    }
                    .region-marker:hover {
                        transform: scale(1.2);
                        filter: drop-shadow(0 0 5px rgba(59, 130, 246, 0.5));
                    }
                `}</style>
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:p-8 dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                <main className="flex grow flex-col items-center justify-center">
                    <div className="text-center">
                        <div className={`${fadeInUp} ${isVisible ? animatedState : initialState}`}>
                            <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
                                <span className="text-blue-600 dark:text-blue-400">JEM II</span> Platform
                            </h1>

                            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
                                Joint Environmental Migration II — Supporting vulnerable communities affected by
                                environmental migration through better data collection, policy planning, and resource management.
                            </p>
                        </div>

                        <div className={`flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-x-4 sm:space-y-0 ${fadeInUp} ${isVisible ? animatedState : initialState}`}
                             style={{ transitionDelay: '150ms' }}>
                            <Link
                                href={auth.user ? route('dashboard') : route('register')}
                                className="inline-block rounded-md bg-blue-600 px-8 py-3 text-base font-medium text-white transition-all duration-300 hover:bg-blue-700 hover:scale-105 dark:bg-blue-700 dark:hover:bg-blue-600"
                            >
                                {auth.user ? 'Go to Dashboard' : 'Get Started →'}
                            </Link>
                            <Link
                                href="/about-jem"
                                className="inline-block rounded-md border border-[#19140035] px-8 py-3 text-base font-medium transition-all duration-300 hover:border-[#1915014a] hover:scale-105 dark:border-[#3E3E3A] dark:hover:border-[#62605b]"
                            >
                                Learn About JEM II
                            </Link>
                        </div>
                    </div>

                    {/* Stats section avec animation de comptage */}
                    <div className={`mt-12 w-full max-w-4xl ${fadeInUp} ${isVisible ? animatedState : initialState}`}
                         style={{ transitionDelay: '250ms' }}>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            <div className="rounded-lg border border-[#19140035] p-4 text-center dark:border-[#3E3E3A]">
                                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                    <span className="stat-counter" data-target="84">0</span>
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-300">Countries</div>
                            </div>
                            <div className="rounded-lg border border-[#19140035] p-4 text-center dark:border-[#3E3E3A]">
                                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                    <span className="stat-counter" data-target="249">0</span>M
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-300">People Affected</div>
                            </div>
                            <div className="rounded-lg border border-[#19140035] p-4 text-center dark:border-[#3E3E3A]">
                                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                    <span className="stat-counter" data-target="512">0</span>
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-300">Projects</div>
                            </div>
                            <div className="rounded-lg border border-[#19140035] p-4 text-center dark:border-[#3E3E3A]">
                                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                    <span className="stat-counter" data-target="34">0</span>M
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-300">Funding (USD)</div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3 lg:mt-24">
                        <div className={`rounded-lg border border-[#19140035] p-6 dark:border-[#3E3E3A] ${fadeInUp} ${isVisible ? animatedState : initialState}`}
                             style={{ transitionDelay: '300ms' }}>
                            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-md bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                                </svg>
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">Data Collection</h3>
                            <p className="text-gray-600 dark:text-gray-300">Advanced data collection tools for accurate mapping of environmental migration patterns and risk factors.</p>
                        </div>

                        <div className={`rounded-lg border border-[#19140035] p-6 dark:border-[#3E3E3A] ${fadeInUp} ${isVisible ? animatedState : initialState}`}
                             style={{ transitionDelay: '400ms' }}>
                            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-md bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z" />
                                </svg>
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">Policy Support</h3>
                            <p className="text-gray-600 dark:text-gray-300">Tools for policymakers to develop evidence-based strategies for managing environmental migration challenges.</p>
                        </div>

                        <div className={`rounded-lg border border-[#19140035] p-6 dark:border-[#3E3E3A] ${fadeInUp} ${isVisible ? animatedState : initialState}`}
                             style={{ transitionDelay: '500ms' }}>
                            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-md bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                                </svg>
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">Community Response</h3>
                            <p className="text-gray-600 dark:text-gray-300">Resources and frameworks for communities to build resilience and adapt to environmental changes.</p>
                        </div>
                    </div>
                </main>

                <footer className="mt-16 w-full max-w-4xl text-center text-sm text-gray-500 dark:text-gray-400">
                    <div className="mb-4 flex justify-center space-x-6">
                        <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300">About</a>
                        <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300">Documentation</a>
                        <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300">Privacy</a>
                        <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300">Terms</a>
                    </div>
                    <p>© {new Date().getFullYear()} YourApp. All rights reserved.</p>
                </footer>
            </div>
        </>
    );
}
