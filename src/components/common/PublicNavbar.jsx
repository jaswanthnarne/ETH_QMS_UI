import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, ChevronDown } from 'lucide-react';

const navItems = [
    { label: 'Student Portal', href: '/' }
];

const DropdownMenu = ({ items, isDarkText }) => (
    <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.97 }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-full left-0 mt-2 w-56 bg-white border border-slate-100 rounded-xl shadow-xl shadow-slate-200/50 overflow-hidden z-50">
        {items.map((item, i) => (
            <a key={i} href={item.href}
                className="flex items-center justify-between px-4 py-3 text-[13px] font-medium text-slate-600 hover:bg-blue-50/60 hover:text-[#004AAD] transition-colors group border-b border-slate-50 last:border-b-0">
                {item.label}
                <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </a>
        ))}
    </motion.div>
);

const PublicNavbar = ({ isDarkTheme = false }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenu, setMobileMenu] = useState(false);
    const [navScrolled, setNavScrolled] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [mobileExpanded, setMobileExpanded] = useState(null);
    const closeTimer = useRef(null);

    useEffect(() => {
        const handleScroll = () => setNavScrolled(window.scrollY > 30);
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // On sub-pages, always use dark text
    const isHomePage = location.pathname === '/';
    const isDarkText = navScrolled || !isDarkTheme || !isHomePage;

    const handleEnter = (label) => {
        clearTimeout(closeTimer.current);
        setOpenDropdown(label);
    };
    const handleLeave = () => {
        closeTimer.current = setTimeout(() => setOpenDropdown(null), 120);
    };

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={`fixed top-0 w-full z-50 transition-all duration-500 ${isDarkText
                    ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-slate-200/50 border-b border-slate-100'
                    : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
                <a href="/" className="flex items-center gap-3 group">
                    <motion.img
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        src="/assets/cropped-New-logo-footer-270x270.png"
                        alt="Ethnotech"
                        className={`h-10 w-10 ${(!isDarkText) ? 'brightness-0 invert' : ''}`}
                    />
                    <div className="leading-tight">
                        <span className={`text-lg font-bold tracking-tight block transition-colors ${isDarkText ? 'text-slate-900' : 'text-white'}`}>Ethnotech</span>
                        <span className={`text-[10px] font-semibold uppercase tracking-wider transition-colors ${isDarkText ? 'text-[#004AAD]' : 'text-blue-300'}`}>Academy</span>
                    </div>
                </a>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center">
                    {navItems.map((item) => (
                        <a key={item.label} href={item.href}
                            className={`inline-flex items-center justify-center px-5 py-2 text-sm font-semibold rounded-full transition ${
                                isDarkText
                                    ? 'bg-[#004AAD] text-white shadow-md shadow-blue-500/10 hover:bg-[#003580]'
                                    : 'bg-white text-[#004AAD] hover:bg-slate-50'
                            }`}>
                            {item.label}
                        </a>
                    ))}
                </div>

                <div className="flex items-center gap-3 md:hidden">
                    <button
                        onClick={() => setMobileMenu(!mobileMenu)}
                        className={`p-2 rounded-lg transition-colors ${isDarkText
                                ? 'text-slate-600 hover:bg-slate-100'
                                : 'text-white hover:bg-white/10'
                            }`}
                    >
                        {mobileMenu ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenu && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-slate-100 overflow-hidden shadow-2xl">
                        <div className="px-6 py-4 space-y-1">
                            {navItems.map((item) =>
                                item.dropdown ? (
                                    <div key={item.label}>
                                        <button
                                            onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                                            className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-slate-700 rounded-lg hover:bg-blue-50 hover:text-[#004AAD] transition-colors">
                                            {item.label}
                                            <ChevronDown size={14} className={`transition-transform ${mobileExpanded === item.label ? 'rotate-180' : ''}`} />
                                        </button>
                                        <AnimatePresence>
                                            {mobileExpanded === item.label && (
                                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                                    <div className="pl-4 pb-1 space-y-1">
                                                        {item.dropdown.map((sub, i) => (
                                                            <a key={i} href={sub.href}
                                                                onClick={() => setMobileMenu(false)}
                                                                className="block px-4 py-2.5 text-[13px] font-medium text-slate-500 rounded-lg hover:bg-blue-50/70 hover:text-[#004AAD] transition-colors">
                                                                {sub.label}
                                                            </a>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ) : (
                                    <a key={item.label} href={item.href}
                                        onClick={() => setMobileMenu(false)}
                                        className="block px-4 py-3 text-sm font-semibold text-slate-700 rounded-lg hover:bg-blue-50 hover:text-[#004AAD] transition-colors">
                                        {item.label}
                                    </a>
                                )
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
};

export default PublicNavbar;

