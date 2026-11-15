import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const navLinks = [
    { label: 'Features', to: '/features' },
    { label: 'How it works', to: '/how-it-works' },
    { label: 'Campus life', to: '/campus-life', aliases: ['/campus'] },
    { label: 'Tracks', to: '/tracks' },
    { label: 'FAQ', to: '/faq' },
];

const PublicNavbar = () => {
    const location = useLocation();
    const [mobileMenu, setMobileMenu] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        window.addEventListener('scroll', onScroll);
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        setMobileMenu(false);
        if (location.hash === '#login') {
            setTimeout(() => {
                document.querySelector('#login')?.scrollIntoView({ behavior: 'smooth' });
            }, 60);
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [location.pathname, location.hash]);

    const isHome = ['/', '/portal', '/assessment'].includes(location.pathname);

    const handleLoginClick = (e) => {
        setMobileMenu(false);
        if (isHome) {
            e.preventDefault();
            document.querySelector('#login')?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const isActiveLink = (link) => {
        if (location.pathname === link.to) return true;
        if (link.aliases && link.aliases.includes(location.pathname)) return true;
        return false;
    };

    return (
        <header
            className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 bg-white/75 backdrop-blur-xl backdrop-saturate-150 ${
                scrolled
                    ? 'border-b border-slate-200/80 shadow-[0_8px_30px_-10px_rgba(15,23,42,0.10),inset_0_1px_0_0_rgba(255,255,255,0.9)]'
                    : 'border-b border-slate-200/70 shadow-[0_2px_16px_-6px_rgba(15,23,42,0.05),inset_0_1px_0_0_rgba(255,255,255,0.9)]'
            }`}
        >
            <div className="max-w-6xl mx-auto px-5 lg:px-6 h-16 flex items-center justify-between gap-6">
                <Link to="/" className="flex items-center gap-2.5 shrink-0">
                    <img src="/assets/cropped-New-logo-footer-270x270.png" alt="Ethnotech Academy" className="h-8 w-8 object-contain" />
                    <div className="leading-tight">
                        <span className="block text-[15px] font-bold text-slate-900 tracking-tight">Ethnotech Academy</span>
                        <span className="block text-[11px] text-slate-500">Student Learning Portal</span>
                    </div>
                </Link>

                <nav className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-xl bg-white/70 border border-slate-200/70 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9)]">
                    {navLinks.map((l) => {
                        const active = isActiveLink(l);
                        return (
                            <Link
                                key={l.label}
                                to={l.to}
                                className={`px-3.5 py-1.5 rounded-lg text-sm transition-all ${
                                    active
                                        ? 'text-[#004AAD] font-semibold bg-sky-50/90 border border-sky-200/90 shadow-2xs'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/80 font-medium'
                                }`}
                            >
                                {l.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="hidden md:flex items-center gap-4 shrink-0">
                    {/* <a href="/console/admin" className="text-sm text-slate-600 hover:text-slate-900">
                            Staff login
                        </a> */}
                    <Link
                        to="/#login"
                        onClick={handleLoginClick}
                        className="text-sm font-semibold px-4 py-2 rounded-xl bg-[#004AAD] text-white hover:bg-[#003882] shadow-[0_4px_14px_-3px_rgba(0,74,173,0.35),inset_0_1px_0_0_rgba(255,255,255,0.25)] transition-all"
                    >
                        Student login
                    </Link>
                </div>

                <button
                    onClick={() => setMobileMenu(!mobileMenu)}
                    className="md:hidden p-2 -mr-2 text-slate-700"
                    aria-label="Toggle menu"
                >
                    {mobileMenu ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {mobileMenu && (
                <div className="md:hidden border-t border-slate-200/80 bg-white/90 backdrop-blur-xl px-5 py-3">
                    {navLinks.map((l) => {
                        const active = isActiveLink(l);
                        return (
                            <Link
                                key={l.label}
                                to={l.to}
                                onClick={() => setMobileMenu(false)}
                                className={`block py-2.5 px-3 rounded-lg text-[15px] ${
                                    active
                                        ? 'text-[#004AAD] font-semibold bg-sky-50'
                                        : 'text-slate-700'
                                }`}
                            >
                                {l.label}
                            </Link>
                        );
                    })}
                    <div className="flex gap-3 pt-3 mt-2 border-t border-slate-100">
                        {/* <a href="/console/admin" className="flex-1 text-center text-sm py-2.5 rounded-lg border border-slate-300 text-slate-700">
                            Staff login
                        </a> */}
                        <Link
                            to="/#login"
                            onClick={handleLoginClick}
                            className="flex-1 text-center text-sm font-semibold py-2.5 rounded-lg bg-[#004AAD] text-white"
                        >
                            Student login
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
};

export default PublicNavbar;
