import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Mail, Youtube, Linkedin, Instagram, ArrowUp, ExternalLink, ShieldCheck } from 'lucide-react';
import { LegalModal } from './LegalModals';

const PublicFooter = () => {
    const [activeModal, setActiveModal] = useState(null);
    const location = useLocation();
    const isHome = ['/', '/portal', '/assessment'].includes(location.pathname);

    const socialLinks = [
        {
            icon: Youtube,
            href: 'https://www.youtube.com/@EthnotechAcademy',
            tone: 'hover:border-rose-500/50 hover:bg-rose-500/10 hover:text-rose-400',
            label: 'YouTube',
        },
        {
            icon: Linkedin,
            href: 'https://www.linkedin.com/company/ethnotech-academic-solutions/',
            tone: 'hover:border-sky-500/50 hover:bg-sky-500/10 hover:text-sky-400',
            label: 'LinkedIn',
        },
        {
            icon: Instagram,
            href: 'https://www.instagram.com/ethnotech_academy/',
            tone: 'hover:border-pink-500/50 hover:bg-pink-500/10 hover:text-pink-400',
            label: 'Instagram',
        },
    ];

    const portalLinks = [
        { label: 'Student Sign In', to: '/#login', isLogin: true },
        { label: 'Portal Features', to: '/features' },
        { label: 'How It Works', to: '/how-it-works' },
        { label: 'Life at Ethnotech', to: '/campus-life' },
        { label: 'Courses & Tracks', to: '/tracks' },
        { label: 'Help & FAQs', to: '/faq' },
    ];

    const streamList = [
        'AI, ML & Data Science',
        'Cyber Security & Cloud',
        'Software & Full-Stack',
        'ECE: VLSI, Embedded & IoT',
        'EEE: EV & Industrial Automation',
        'Mechanical & Civil CAD / BIM',
    ];

    const handleSectionClick = (e, href) => {
        if (isHome && href.startsWith('#')) {
            e.preventDefault();
            document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <footer id="contact" className="bg-slate-950 text-white border-t border-slate-900 relative overflow-hidden">
                {/* Top Brand, Accreditation & Animated SVG Strip */}
                <div className="border-b border-slate-800/80">
                    <div className="max-w-6xl mx-auto px-5 lg:px-6 py-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                            <a href="/" className="flex items-center gap-3.5">
                                <img
                                    src="/assets/cropped-New-logo-footer-270x270.png"
                                    alt="Ethnotech Academy"
                                    className="h-11 w-11 object-contain brightness-0 invert"
                                />
                                <div>
                                    <span className="text-[19px] font-bold text-white tracking-tight block leading-tight">
                                        Ethnotech Academy
                                    </span>
                                    <span className="text-[11.5px] text-sky-400 font-semibold uppercase tracking-wider block mt-0.5">
                                        Future Skills & Placement Hub
                                    </span>
                                </div>
                            </a>

                            {/* Skill India & NSDC Badges */}
                            <div className="flex items-center gap-3 sm:pl-6 sm:border-l sm:border-slate-800">
                                <div className="bg-white/95 px-3 py-1.5 rounded-xl shadow-sm flex items-center hover:bg-white transition-colors">
                                    <img
                                        src="/assets/Skill-India-1.png"
                                        alt="Skill India"
                                        className="h-8 object-contain mix-blend-multiply"
                                    />
                                </div>
                                <div className="bg-white/95 px-3 py-1.5 rounded-xl shadow-sm flex items-center hover:bg-white transition-colors">
                                    <img
                                        src="/assets/NSDC.png"
                                        alt="NSDC"
                                        className="h-8 object-contain mix-blend-multiply"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Animated Flat-Vector SVG Illustration (matching FAQ, Courses & Reviews style) */}
                        <svg viewBox="0 0 250 115" className="w-56 shrink-0 hidden md:block" aria-hidden="true">
                            {/* Base campus / career card */}
                            <rect x="12" y="16" width="136" height="76" rx="16" fill="#E0F2FE" />
                            <rect x="28" y="32" width="44" height="9" rx="4.5" fill="#0284C7" />
                            <rect x="28" y="48" width="94" height="7" rx="3.5" fill="#38BDF8" />
                            <rect x="28" y="61" width="70" height="7" rx="3.5" fill="#7DD3FC" />
                            <circle cx="122" cy="36" r="9" fill="#BAE6FD" />
                            <path d="M118 36l2.5 2.5 5-5" stroke="#0284C7" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />

                            {/* Floating placement / graduation card */}
                            <motion.g animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
                                <rect x="118" y="38" width="118" height="64" rx="15" fill="#FEF3C7" />
                                {/* Graduation cap icon */}
                                <path d="M138 64l18-8 18 8-18 8-18-8z" fill="#F59E0B" />
                                <path d="M145 68v7c0 2.2 5 4 11 4s11-1.8 11-4v-7" stroke="#B45309" strokeWidth="2" fill="none" />
                                <rect x="182" y="58" width="38" height="7" rx="3.5" fill="#D97706" />
                                <rect x="182" y="70" width="26" height="7" rx="3.5" fill="#F59E0B" />
                            </motion.g>

                            {/* Floating verified badge */}
                            <motion.g animate={{ y: [0, 5, 0] }} transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}>
                                <rect x="172" y="8" width="56" height="24" rx="9" fill="#DCFCE7" />
                                <circle cx="186" cy="20" r="5" fill="#10B981" />
                                <rect x="195" y="17" width="24" height="6" rx="3" fill="#059669" />
                            </motion.g>
                        </svg>
                    </div>
                </div>

                {/* Main 4-Column Footer Body */}
                <div className="max-w-6xl mx-auto px-5 lg:px-6 py-14">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10">
                        {/* Column 1: About & Socials (4 cols) */}
                        <div className="lg:col-span-4 space-y-5">
                            <p className="text-[14px] text-slate-400 leading-relaxed">
                                Equipping the next generation of engineers across partner colleges with hands-on technical
                                training, proctored assessments, and campus placement readiness.
                            </p>

                            <div className="inline-flex items-center gap-2 text-[12px] font-medium text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-1.5">
                                <ShieldCheck size={15} className="text-emerald-400 shrink-0" />
                                Verified Campus Assessment Portal
                            </div>

                            <div className="pt-1">
                                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 mb-3">
                                    Connect With Us
                                </p>
                                <div className="flex flex-wrap items-center gap-2.5">
                                    {socialLinks.map((social) => (
                                        <a
                                            key={social.label}
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-[13px] font-medium text-slate-300 transition-all ${social.tone}`}
                                            title={social.label}
                                        >
                                            <social.icon size={15} />
                                            <span>{social.label}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Column 2: Portal Navigation (2 cols) */}
                        <div className="lg:col-span-2 space-y-3.5">
                            <h4 className="text-[12.5px] font-bold uppercase tracking-wider text-slate-200">
                                Portal
                            </h4>
                            <ul className="space-y-2.5">
                                {portalLinks.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            to={link.to}
                                            onClick={(e) => {
                                                if (link.isLogin && isHome) {
                                                    e.preventDefault();
                                                    document.querySelector('#login')?.scrollIntoView({ behavior: 'smooth' });
                                                }
                                            }}
                                            className="text-[14px] text-slate-400 hover:text-white transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                                <li className="pt-1">
                                    {/* <a
                                        href="/console/admin"
                                        className="inline-flex items-center gap-1 text-[13.5px] font-medium text-sky-400 hover:text-sky-300 transition-colors"
                                    >
                                        Staff Console <ExternalLink size={12} />
                                    </a> */}
                                </li>
                            </ul>
                        </div>

                        {/* Column 3: Training Domains (3 cols) */}
                        <div className="lg:col-span-3 space-y-3.5">
                            <h4 className="text-[12.5px] font-bold uppercase tracking-wider text-slate-200">
                                Training Tracks
                            </h4>
                            <ul className="space-y-2.5">
                                {streamList.map((stream) => (
                                    <li key={stream}>
                                        <Link
                                            to="/tracks"
                                            className="flex items-center gap-2 text-[14px] text-slate-400 hover:text-white transition-colors"
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-sky-500/70 shrink-0" />
                                            <span>{stream}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Column 4: Campus Contact Card (3 cols) */}
                        <div className="lg:col-span-3 space-y-3.5">
                            <h4 className="text-[12.5px] font-bold uppercase tracking-wider text-slate-200">
                                Contact & Support
                            </h4>
                            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3.5">
                                <div className="flex items-start gap-2.5 text-[13.5px] text-slate-300 leading-snug">
                                    <MapPin size={16} className="text-sky-400 shrink-0 mt-0.5" />
                                    <span>
                                        SK Arena Building, BDA Link Rd, Channasandra, Rajarajeshwari Nagar, Bengaluru, Karnataka 560098
                                    </span>
                                </div>
                                <div className="pt-2.5 border-t border-slate-800 flex items-center gap-2.5 text-[13.5px]">
                                    <Mail size={15} className="text-amber-400 shrink-0" />
                                    <a
                                        href="mailto:info@ethnotech.in"
                                        className="font-medium text-slate-200 hover:text-sky-300 transition-colors"
                                    >
                                        info@ethnotech.in
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Legal & Back-to-Top Bar */}
                <div className="border-t border-slate-800/80 bg-slate-950">
                    <div className="max-w-6xl mx-auto px-5 lg:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-[12.5px] text-slate-500 text-center sm:text-left">
                            &copy; {new Date().getFullYear()} Ethnotech Educational Solutions Pvt Ltd. All Rights Reserved.
                        </p>

                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-5">
                                <button
                                    type="button"
                                    onClick={() => setActiveModal('terms')}
                                    className="text-[12.5px] text-slate-400 hover:text-white transition-colors cursor-pointer"
                                >
                                    Terms
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveModal('privacy')}
                                    className="text-[12.5px] text-slate-400 hover:text-white transition-colors cursor-pointer"
                                >
                                    Privacy
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveModal('security')}
                                    className="text-[12.5px] text-slate-400 hover:text-white transition-colors cursor-pointer"
                                >
                                    Security
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={scrollToTop}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-[12.5px] font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
                                title="Back to top"
                            >
                                Top <ArrowUp size={13} />
                            </button>
                        </div>
                    </div>
                </div>
            </footer>

            <LegalModal
                isOpen={!!activeModal}
                type={activeModal}
                onClose={() => setActiveModal(null)}
            />
        </>
    );
};

export default PublicFooter;
