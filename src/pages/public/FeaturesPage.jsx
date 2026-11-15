import React from 'react';
import { Link } from 'react-router-dom';
import { motion, MotionConfig } from 'framer-motion';
import {
    ClipboardList,
    PenLine,
    BarChart3,
    CalendarCheck,
    Briefcase,
    RotateCcw,
    ArrowRight,
    CheckCircle2,
    Clock,
    ShieldCheck,
    Wifi,
    Sparkles,
    Award,
    FileCheck2,
} from 'lucide-react';
import PublicLayout from '../../layouts/PublicLayout';
import { Reveal, DrawUnderline, ProgressRing, ScoreBars } from '../../components/landing/LandingFx';

const CORE_FEATURES = [
    {
        icon: ClipboardList,
        badge: 'Assessments',
        title: 'Assessments assigned by your trainer',
        desc: 'Every unit test, weekly quiz and mock drive scheduled for your batch appears automatically on your dashboard with the exact start window, duration and question count.',
        bullets: [
            'Live countdown timer and trainer waiting room before start',
            'Section-wise question navigation with mark-for-review',
            'Clear instructions and syllabus tags before you begin',
        ],
        tone: 'bg-sky-50 text-sky-700 border-sky-200',
        cardBorder: 'border-sky-200 hover:border-sky-300',
        dot: 'bg-sky-500',
    },
    {
        icon: PenLine,
        badge: 'Practice Hub',
        title: 'Topic-wise practice across all branches',
        desc: 'Practise between classes with curated question banks covering coding, aptitude, verbal LSRW, AI/ML, Cyber Security, Cloud, ECE, EEE, Mechanical and Civil engineering.',
        bullets: [
            'Difficulty progression from foundation to company-level',
            'Mapped to real service and product company test patterns',
            'Instant feedback after each practice session',
        ],
        tone: 'bg-violet-50 text-violet-700 border-violet-200',
        cardBorder: 'border-violet-200 hover:border-violet-300',
        dot: 'bg-violet-500',
    },
    {
        icon: BarChart3,
        badge: 'Analytics',
        title: 'Instant results with step-by-step explanations',
        desc: 'No waiting weeks for paper corrections. Review your score, accuracy percentage, time spent and detailed answer explanations right after submission.',
        bullets: [
            'Topic-wise strength and weakness breakdown',
            'Batch percentile and score trend across the semester',
            'Full solution walkthroughs for every question',
        ],
        tone: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        cardBorder: 'border-emerald-200 hover:border-emerald-300',
        dot: 'bg-emerald-500',
    },
    {
        icon: CalendarCheck,
        badge: 'Attendance',
        title: 'Session-wise attendance at a glance',
        desc: 'Every training session marked by your trainer updates your attendance ledger immediately so you always know where you stand.',
        bullets: [
            'Course-wise attendance percentage and session log',
            'Date and topic record for every class conducted',
            'Zero end-of-semester surprises during placement eligibility checks',
        ],
        tone: 'bg-amber-50 text-amber-700 border-amber-200',
        cardBorder: 'border-amber-200 hover:border-amber-300',
        dot: 'bg-amber-500',
    },
    {
        icon: Briefcase,
        badge: 'Placements',
        title: 'Campus placement drives & applications',
        desc: 'View job openings shared by your placement cell, check if you meet the eligibility criteria, and apply with a single click using your verified portal profile.',
        bullets: [
            'Role, package (CTC), eligibility criteria and deadline in one view',
            'Direct one-click application from your student dashboard',
            'Track application status from applied to shortlisted',
        ],
        tone: 'bg-rose-50 text-rose-700 border-rose-200',
        cardBorder: 'border-rose-200 hover:border-rose-300',
        dot: 'bg-rose-500',
    },
    {
        icon: RotateCcw,
        badge: 'Reliability',
        title: 'Auto-save & instant disconnect recovery',
        desc: 'If your laptop battery dies or campus Wi-Fi drops in the middle of an exam, your answers and remaining time are safely preserved.',
        bullets: [
            'Every answer is saved automatically as you move between questions',
            'Log back in and resume from the exact question you left on',
            'Works seamlessly within the active assessment window',
        ],
        tone: 'bg-cyan-50 text-cyan-700 border-cyan-200',
        cardBorder: 'border-cyan-200 hover:border-cyan-300',
        dot: 'bg-cyan-500',
    },
];

const COMPARISON = [
    {
        aspect: 'Test announcements & links',
        oldWay: 'Scattered across multiple WhatsApp groups and forwarded messages',
        newWay: 'Automatically listed on your personal dashboard with a live countdown',
    },
    {
        aspect: 'Checking test scores & solutions',
        oldWay: 'Waiting days for spreadsheet uploads without knowing which questions went wrong',
        newWay: 'Instant score breakdown, batch rank and question-by-question explanations',
    },
    {
        aspect: 'Internet drop during an exam',
        oldWay: 'Losing all progress and having to restart the test from question one',
        newWay: 'Auto-saved after every answer so you resume from the exact same spot',
    },
    {
        aspect: 'Tracking training attendance',
        oldWay: 'Guessing your attendance percentage until the final placement shortlist comes out',
        newWay: 'Live session-by-session attendance percentage updated after every class',
    },
];

const FeaturesPage = () => {
    return (
        <MotionConfig reducedMotion="user">
            <PublicLayout>
                <div className="bg-white text-slate-900 pt-16">
                    {/* ═════════════ HERO ═════════════ */}
                    <section className="bg-[#F8FAFC] border-b border-slate-200 py-14 lg:py-20">
                        <div className="max-w-6xl mx-auto px-5 lg:px-6 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] items-center">
                            <div>
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="inline-flex items-center gap-2 text-[13px] font-medium text-slate-600 bg-white border border-slate-200 rounded-full px-3.5 py-1"
                                >
                                    <span className="w-2 h-2 rounded-full bg-[#004AAD]" />
                                    Student Portal Capabilities
                                </motion.p>
                                <motion.h1
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.08 }}
                                    className="mt-4 text-[34px] sm:text-[44px] font-bold tracking-tight leading-[1.12] text-slate-900"
                                >
                                    Built for how students actually{' '}
                                    <span
                                        className="relative inline-block text-[#004AAD] font-semibold text-[1.08em] px-1 tracking-normal"
                                        style={{ fontFamily: "'Dancing Script', 'Courgette', cursive", fontWeight: 600 }}
                                    >
                                        learn and prepare
                                        <DrawUnderline className="absolute left-0 -bottom-2 w-full h-3" color="#004AAD" />
                                    </span>
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.15 }}
                                    className="mt-5 text-[16.5px] text-slate-600 leading-relaxed max-w-xl"
                                >
                                    Everything inside the Ethnotech Student Portal is designed to remove friction from your semester
                                    training so you can focus on building skills, taking tests and landing offers.
                                </motion.p>
                                <motion.div
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.22 }}
                                    className="mt-7 flex flex-wrap items-center gap-3"
                                >
                                    <Link
                                        to="/"
                                        className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-[#004AAD] hover:bg-[#003882] text-white text-[14.5px] font-semibold transition-colors"
                                    >
                                        Sign in to portal <ArrowRight size={15} />
                                    </Link>
                                    <Link
                                        to="/tracks"
                                        className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-[14.5px] font-semibold transition-colors"
                                    >
                                        Explore training tracks
                                    </Link>
                                </motion.div>
                            </div>

                            {/* Custom Animated Flat-Vector SVG Hero Illustration */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.15 }}
                                className="flex justify-center lg:justify-end"
                            >
                                <svg viewBox="0 0 360 240" className="w-full max-w-[360px]" aria-hidden="true">
                                    {/* Main workspace card */}
                                    <rect x="20" y="24" width="240" height="156" rx="20" fill="#E0F2FE" />
                                    <rect x="40" y="46" width="80" height="12" rx="6" fill="#0284C7" />
                                    <rect x="40" y="68" width="170" height="9" rx="4.5" fill="#38BDF8" />
                                    <rect x="40" y="85" width="135" height="9" rx="4.5" fill="#7DD3FC" />

                                    {/* Mini chart bars inside card */}
                                    <rect x="40" y="138" width="22" height="24" rx="4" fill="#38BDF8" />
                                    <rect x="68" y="126" width="22" height="36" rx="4" fill="#0284C7" />
                                    <rect x="96" y="114" width="22" height="48" rx="4" fill="#004AAD" />
                                    <rect x="124" y="102" width="22" height="60" rx="4" fill="#10B981" />

                                    {/* Floating score badge */}
                                    <motion.g animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
                                        <rect x="195" y="102" width="145" height="96" rx="18" fill="#FEF3C7" />
                                        <circle cx="235" cy="150" r="22" fill="#F59E0B" />
                                        <path d="M226 150l6 6 12-12" stroke="#ffffff" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                        <rect x="268" y="136" width="52" height="10" rx="5" fill="#D97706" />
                                        <rect x="268" y="154" width="38" height="8" rx="4" fill="#F59E0B" />
                                    </motion.g>

                                    {/* Floating auto-save pill */}
                                    <motion.g animate={{ y: [0, 6, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}>
                                        <rect x="215" y="14" width="120" height="42" rx="13" fill="#EDE9FE" />
                                        <circle cx="240" cy="35" r="9" fill="#7C3AED" />
                                        <rect x="256" y="30" width="62" height="10" rx="5" fill="#7C3AED" />
                                    </motion.g>
                                </svg>
                            </motion.div>
                        </div>
                    </section>

                    {/* ═════════════ 6 CORE FEATURES GRID ═════════════ */}
                    <section className="py-20">
                        <div className="max-w-6xl mx-auto px-5 lg:px-6">
                            <Reveal className="max-w-2xl">
                                <p className="text-sm font-semibold text-[#004AAD] mb-2">Core Modules</p>
                                <h2 className="text-[28px] sm:text-[34px] font-bold tracking-tight text-slate-900 leading-tight">
                                    Six tools that power your daily training
                                </h2>
                                <p className="mt-3 text-[16px] text-slate-600 leading-relaxed">
                                    Each module connects directly to your college batch so your trainer, placement coordinator and you
                                    are always looking at the same live record.
                                </p>
                            </Reveal>

                            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {CORE_FEATURES.map((f, i) => (
                                    <Reveal key={f.title} delay={(i % 3) * 0.08}>
                                        <motion.div
                                            whileHover={{ y: -4 }}
                                            className={`h-full bg-white border-2 ${f.cardBorder} rounded-2xl p-6 flex flex-col justify-between transition-all hover:shadow-lg`}
                                        >
                                            <div>
                                                <div className="flex items-center justify-between gap-3">
                                                    <div className={`w-11 h-11 rounded-xl border flex items-center justify-center ${f.tone}`}>
                                                        <f.icon size={20} />
                                                    </div>
                                                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${f.tone}`}>
                                                        {f.badge}
                                                    </span>
                                                </div>
                                                <h3 className="mt-5 text-[18px] font-bold text-slate-900">{f.title}</h3>
                                                <p className="mt-2 text-[14.5px] text-slate-600 leading-relaxed">{f.desc}</p>
                                            </div>

                                            <ul className="mt-5 pt-4 border-t border-slate-100 space-y-2">
                                                {f.bullets.map((b) => (
                                                    <li key={b} className="flex items-start gap-2 text-[13.5px] text-slate-700">
                                                        <span className={`w-1.5 h-1.5 rounded-full ${f.dot} mt-2 shrink-0`} />
                                                        <span>{b}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </motion.div>
                                    </Reveal>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ═════════════ LIVE EXAM & RECOVERY SPOTLIGHT ═════════════ */}
                    <section className="py-20 bg-[#F8FAFC] border-y border-slate-200">
                        <div className="max-w-6xl mx-auto px-5 lg:px-6 grid gap-12 lg:grid-cols-2 items-center">
                            <Reveal>
                                <p className="text-sm font-semibold text-[#004AAD] mb-2">Built for Real Campus Conditions</p>
                                <h2 className="text-[28px] sm:text-[34px] font-bold tracking-tight text-slate-900 leading-tight">
                                    Reliable even when campus Wi-Fi isn’t
                                </h2>
                                <p className="mt-3 text-[16px] text-slate-600 leading-relaxed">
                                    We know lab networks and hostel connections can drop unexpectedly. The assessment engine saves
                                    your state after every single question so your hard work is never lost.
                                </p>

                                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                                    <div className="bg-white border border-emerald-200 rounded-2xl p-4">
                                        <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                                            <Wifi size={18} />
                                        </div>
                                        <h4 className="text-[15px] font-semibold text-slate-900">Instant State Sync</h4>
                                        <p className="mt-1 text-[13.5px] text-slate-600">
                                            Selected options and code submissions sync to the server as you navigate.
                                        </p>
                                    </div>
                                    <div className="bg-white border border-sky-200 rounded-2xl p-4">
                                        <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center mb-3">
                                            <ShieldCheck size={18} />
                                        </div>
                                        <h4 className="text-[15px] font-semibold text-slate-900">Fair Proctoring</h4>
                                        <p className="mt-1 text-[13.5px] text-slate-600">
                                            Clear warnings and trainer waiting-room controls keep every batch test fair.
                                        </p>
                                    </div>
                                </div>
                            </Reveal>

                            {/* Interactive Exam UI Mockup Card */}
                            <Reveal delay={0.1}>
                                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                                    <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between text-[13px]">
                                        <div className="flex items-center gap-2.5">
                                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                                            <span className="font-semibold">Aptitude & DSA Assessment</span>
                                        </div>
                                        <span className="inline-flex items-center gap-1.5 font-mono text-xs bg-slate-800 px-2.5 py-1 rounded-md text-amber-300">
                                            <Clock size={12} /> 28:14 left
                                        </span>
                                    </div>

                                    <div className="p-6 space-y-5">
                                        <div className="flex items-center justify-between text-xs text-slate-500">
                                            <span className="font-semibold text-[#004AAD] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                                                Question 14 of 30
                                            </span>
                                            <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                                                <CheckCircle2 size={13} /> Progress auto-saved
                                            </span>
                                        </div>

                                        <p className="text-[15px] font-semibold text-slate-900 leading-snug">
                                            What is the time complexity of searching for an element in a balanced Binary Search Tree (BST) with n nodes?
                                        </p>

                                        <div className="space-y-2.5">
                                            {[
                                                { opt: 'A', text: 'O(n)', active: false },
                                                { opt: 'B', text: 'O(log n)', active: true },
                                                { opt: 'C', text: 'O(n log n)', active: false },
                                                { opt: 'D', text: 'O(1)', active: false },
                                            ].map((o) => (
                                                <div
                                                    key={o.opt}
                                                    className={`flex items-center justify-between px-4 py-3 rounded-xl border text-[14px] ${
                                                        o.active
                                                            ? 'border-[#004AAD] bg-blue-50/60 text-[#004AAD] font-semibold'
                                                            : 'border-slate-200 text-slate-700'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span
                                                            className={`w-6 h-6 rounded-md text-xs font-bold flex items-center justify-center ${
                                                                o.active ? 'bg-[#004AAD] text-white' : 'bg-slate-100 text-slate-600'
                                                            }`}
                                                        >
                                                            {o.opt}
                                                        </span>
                                                        <span>{o.text}</span>
                                                    </div>
                                                    {o.active && <CheckCircle2 size={16} className="text-[#004AAD]" />}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <ProgressRing value={84} size={42} stroke={5} color="#10B981">
                                                    <span className="text-[10px] font-bold text-slate-900">84%</span>
                                                </ProgressRing>
                                                <div>
                                                    <p className="text-[12px] font-semibold text-slate-900">Batch Accuracy</p>
                                                    <p className="text-[11px] text-slate-500">Shown after submission</p>
                                                </div>
                                            </div>
                                            <div className="w-28">
                                                <ScoreBars data={[60, 68, 72, 78, 84, 88]} height={36} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Reveal>
                        </div>
                    </section>

                    {/* ═════════════ COMPARISON TABLE ═════════════ */}
                    <section className="py-20">
                        <div className="max-w-6xl mx-auto px-5 lg:px-6">
                            <Reveal className="max-w-2xl">
                                <p className="text-sm font-semibold text-[#004AAD] mb-2">Why It Matters</p>
                                <h2 className="text-[28px] sm:text-[34px] font-bold tracking-tight text-slate-900 leading-tight">
                                    Manual coordination vs Ethnotech Portal
                                </h2>
                            </Reveal>

                            <div className="mt-10 grid gap-4">
                                {COMPARISON.map((row, i) => (
                                    <Reveal key={row.aspect} delay={i * 0.06}>
                                        <div className="grid md:grid-cols-12 gap-4 p-5 rounded-2xl border border-slate-200 bg-white items-center">
                                            <div className="md:col-span-3">
                                                <p className="text-[15px] font-bold text-slate-900">{row.aspect}</p>
                                            </div>
                                            <div className="md:col-span-4 bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 text-[13.5px] text-slate-500">
                                                <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                                                    Without Portal
                                                </span>
                                                {row.oldWay}
                                            </div>
                                            <div className="md:col-span-5 bg-emerald-50/60 border border-emerald-200 rounded-xl p-3.5 text-[13.5px] text-slate-800 font-medium">
                                                <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-700 mb-1">
                                                    <CheckCircle2 size={13} /> With Ethnotech Portal
                                                </span>
                                                {row.newWay}
                                            </div>
                                        </div>
                                    </Reveal>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ═════════════ CTA ═════════════ */}
                    <section className="pb-20">
                        <div className="max-w-6xl mx-auto px-5 lg:px-6">
                            <div className="rounded-3xl bg-[#004AAD] px-8 py-12 sm:px-12 flex flex-col md:flex-row md:items-center justify-between gap-6 text-white">
                                <div>
                                    <h2 className="text-[26px] sm:text-[30px] font-bold tracking-tight">
                                        Ready to check your dashboard?
                                    </h2>
                                    <p className="mt-2 text-[16px] text-blue-100">
                                        Sign in with your USN or registered mobile number to view your courses and tests.
                                    </p>
                                </div>
                                <Link
                                    to="/"
                                    className="shrink-0 inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-white text-[#004AAD] text-[15px] font-semibold hover:bg-blue-50 transition-colors"
                                >
                                    Go to Student Sign In <ArrowRight size={16} />
                                </Link>
                            </div>
                        </div>
                    </section>
                </div>
            </PublicLayout>
        </MotionConfig>
    );
};

export default FeaturesPage;

