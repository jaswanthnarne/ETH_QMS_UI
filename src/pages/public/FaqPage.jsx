import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, MotionConfig, AnimatePresence } from 'framer-motion';
import {
    HelpCircle, Search, ChevronDown, KeyRound, Wifi, ShieldCheck,
    CalendarCheck, ArrowRight, Mail, Phone, CheckCircle2, Sparkles
} from 'lucide-react';
import PublicLayout from '../../layouts/PublicLayout';
import { Reveal, DrawUnderline } from '../../components/landing/LandingFx';

const FAQ_CATEGORIES = [
    { id: 'all', label: 'All Questions (12)' },
    { id: 'login', label: 'Login & Password' },
    { id: 'exams', label: 'Assessments & Rules' },
    { id: 'recovery', label: 'Wi-Fi & Disconnects' },
    { id: 'placements', label: 'Attendance & Placements' }
];

const FAQ_ITEMS = [
    {
        id: 'q1',
        category: 'login',
        q: 'How do I get my Ethnotech student portal account?',
        a: 'Your account is created automatically by your college placement cell and Ethnotech batch coordinator before your first training session. You do not need to fill out a separate sign-up form. Simply sign in using your University Seat Number (USN) or the mobile number registered with your college.'
    },
    {
        id: 'q2',
        category: 'login',
        q: 'What is my default password when logging in for the first time?',
        a: 'For your first login, use the default password pattern shared by your trainer in class (your lowercase college code followed by @3!, for example mitm@3!). You can also switch directly to the "First-Time / Reset" tab on the login card to set a personal password using your USN and registered mobile number or email.'
    },
    {
        id: 'q3',
        category: 'login',
        q: 'What should I do if I forgot my password or my account says invalid credentials?',
        a: 'Click the "First-Time / Reset" tab on the login card, enter your USN along with your college-registered mobile number or email address, and choose a new password (minimum 6 characters). Your password updates immediately without waiting for an email reset link.'
    },
    {
        id: 'q4',
        category: 'login',
        q: 'What if the portal says my USN or mobile number is not found?',
        a: 'Double-check that you have entered your full official USN without spaces. If you recently joined the batch or changed your phone number, let your classroom trainer or college placement coordinator know so they can sync your details to the batch roster.'
    },
    {
        id: 'q5',
        category: 'recovery',
        q: 'What happens if my campus Wi-Fi drops or my laptop battery dies during a test?',
        a: 'Do not panic. Every answer you select is auto-saved to the server in real time. Reconnect to Wi-Fi (or log in from another lab system), open the test again, and your session will resume from the exact question and remaining timer where you left off.'
    },
    {
        id: 'q6',
        category: 'recovery',
        q: 'Can I switch devices if my computer freezes mid-assessment?',
        a: 'Yes. If your lab desktop or laptop freezes during a live test, inform your invigilator or trainer in the room and sign in on a backup computer. Because responses sync continuously, your previously marked answers will already be preserved.'
    },
    {
        id: 'q7',
        category: 'exams',
        q: 'Can I take assessments on my mobile phone or tablet?',
        a: 'Regular practice quizzes, attendance checks, scorecards, and placement applications work smoothly on mobile browsers. However, proctored classroom unit tests and company mock drives require a laptop or lab desktop running Chrome or Edge in full-screen mode.'
    },
    {
        id: 'q8',
        category: 'exams',
        q: 'Why did my assessment show a tab-switch or full-screen warning?',
        a: 'Proctored tests lock into full-screen mode to simulate real company online assessments (OAs). Pressing Escape, switching browser tabs, opening notification pop-ups, or using split-screen triggers a proctoring warning and logs the event for your trainer. Always close background messaging apps before starting a test.'
    },
    {
        id: 'q9',
        category: 'exams',
        q: 'When can I see my test score and topic-wise breakdown?',
        a: 'For standard unit tests and practice mocks, your score, accuracy percentage, and topic-wise performance bars appear immediately after submission. For synchronized campus-wide mock drives, detailed question solutions unlock once the exam window closes for all batches.'
    },
    {
        id: 'q10',
        category: 'placements',
        q: 'How is my classroom attendance recorded on the portal?',
        a: 'Your trainer marks batch attendance during each session, and completed in-class unit assessments also verify your active participation. You can view your cumulative attendance percentage anytime from your student dashboard.'
    },
    {
        id: 'q11',
        category: 'placements',
        q: 'How do placement drives and company shortlists work on the portal?',
        a: 'When partner recruiters announce campus drives, eligible batches see the job role, package details, and eligibility criteria under the Placement Drives section. Your training attendance and assessment averages are shared with your college placement cell to fast-track shortlisting.'
    },
    {
        id: 'q12',
        category: 'placements',
        q: 'Do I get access to courses outside my core engineering branch?',
        a: 'Your dashboard prioritizes the syllabus assigned to your department and semester (such as AI/ML, Cyber Security, Cloud, ECE, EEE, Mechanical, or Civil), along with mandatory Quantitative Aptitude and LSRW modules. If your college opts for cross-branch electives, those modules appear automatically in your course list.'
    }
];

const QUICK_GUIDES = [
    {
        icon: KeyRound,
        title: 'First-Time Password Setup',
        desc: 'Use the "First-Time / Reset" tab on the login card with your USN + registered mobile/email to set a custom password in 15 seconds.',
        border: 'border-sky-200 hover:border-sky-300',
        tint: 'bg-sky-50 text-sky-700 border-sky-200'
    },
    {
        icon: Wifi,
        title: 'Zero-Loss Auto-Save',
        desc: 'Every MCQ selection and coding submission saves automatically. Re-login within the active test window to continue seamlessly.',
        border: 'border-emerald-200 hover:border-emerald-300',
        tint: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
        icon: ShieldCheck,
        title: 'Full-Screen Exam Checklist',
        desc: 'Use Google Chrome or Microsoft Edge, disable browser extensions that inject pop-ups, and stay in full-screen until submission.',
        border: 'border-violet-200 hover:border-violet-300',
        tint: 'bg-violet-50 text-violet-700 border-violet-200'
    },
    {
        icon: CalendarCheck,
        title: 'Batch Roster Sync',
        desc: 'If your USN or mobile number was recently updated at college, ask your Ethnotech trainer to refresh your batch profile.',
        border: 'border-amber-200 hover:border-amber-300',
        tint: 'bg-amber-50 text-amber-800 border-amber-200'
    }
];

const FaqPage = () => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [openId, setOpenId] = useState('q1');

    const filteredFaqs = FAQ_ITEMS.filter((item) => {
        const matchesCat = activeCategory === 'all' || item.category === activeCategory;
        const q = searchQuery.trim().toLowerCase();
        if (!q) return matchesCat;
        return matchesCat && (item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q));
    });

    return (
        <MotionConfig reducedMotion="user">
            <PublicLayout>
                {/* ══════════════════════════════════════════════════════════════════
                    HERO SECTION
                   ══════════════════════════════════════════════════════════════════ */}
                <section className="relative overflow-hidden bg-[#F8FAFC] pt-24 pb-16 sm:pt-28 sm:pb-20 border-b border-slate-200/80">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
                            <div className="lg:col-span-7">
                                <Reveal>
                                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-xs text-[12px] font-semibold text-slate-700 mb-5">
                                        <HelpCircle className="w-3.5 h-3.5 text-[#004AAD]" />
                                        <span>Student Help Center & FAQ</span>
                                    </div>
                                </Reveal>

                                <Reveal delay={0.05}>
                                    <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight leading-[1.12] mb-5">
                                        Quick answers for{' '}
                                        <span
                                            className="relative inline-block text-[#004AAD] font-semibold text-[1.08em] px-1 tracking-normal"
                                            style={{ fontFamily: "'Dancing Script', 'Courgette', cursive", fontWeight: 600 }}
                                        >
                                            smooth exams
                                            <DrawUnderline className="absolute left-0 -bottom-2 w-full h-3" color="#004AAD" />
                                        </span>
                                    </h1>
                                </Reveal>

                                <Reveal delay={0.1}>
                                    <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mb-8">
                                        Everything you need to know about signing in for the first time, resetting your password, handling Wi-Fi disconnects during live assessments, and tracking your placement eligibility.
                                    </p>
                                </Reveal>

                                {/* Live Search Bar in Hero */}
                                <Reveal delay={0.15}>
                                    <div className="relative max-w-xl">
                                        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search questions (e.g., default password, Wi-Fi drop, USN)..."
                                            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border-2 border-sky-200 text-sm sm:text-base text-slate-800 placeholder:text-slate-400 shadow-xs focus:border-[#004AAD] focus:outline-none transition-all"
                                        />
                                    </div>
                                </Reveal>
                            </div>

                            {/* Custom Animated Support Desk SVG */}
                            <div className="lg:col-span-5 flex justify-center">
                                <Reveal delay={0.12}>
                                    <div className="w-full max-w-[420px] rounded-2xl bg-white border-2 border-amber-200 p-4 shadow-sm">
                                        <svg viewBox="0 0 400 265" fill="none" className="w-full h-auto">
                                            <rect width="400" height="265" rx="16" fill="#F8FAFC" />
                                            <circle cx="330" cy="60" r="42" fill="#FEF3C7" opacity="0.7" />
                                            <circle cx="70" cy="210" r="45" fill="#E0F2FE" opacity="0.7" />

                                            {/* Main FAQ Window Card */}
                                            <rect x="42" y="34" width="236" height="196" rx="14" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
                                            <rect x="58" y="52" width="110" height="10" rx="5" fill="#004AAD" />
                                            <circle cx="250" cy="57" r="6" fill="#10B981" />

                                            {/* Q&A Row 1 */}
                                            <rect x="58" y="76" width="204" height="40" rx="8" fill="#F0F9FF" stroke="#BAE6FD" strokeWidth="1.5" />
                                            <circle cx="74" cy="96" r="8" fill="#0284C7" />
                                            <text x="74" y="99" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="800" fontFamily="sans-serif">Q</text>
                                            <rect x="90" y="88" width="128" height="6" rx="3" fill="#0F172A" />
                                            <rect x="90" y="99" width="96" height="5" rx="2.5" fill="#0284C7" />

                                            {/* Q&A Row 2 */}
                                            <rect x="58" y="126" width="204" height="40" rx="8" fill="#ECFDF5" stroke="#A7F3D0" strokeWidth="1.5" />
                                            <circle cx="74" cy="146" r="8" fill="#059669" />
                                            <text x="74" y="149" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="800" fontFamily="sans-serif">A</text>
                                            <rect x="90" y="138" width="142" height="6" rx="3" fill="#065F46" />
                                            <rect x="90" y="149" width="112" height="5" rx="2.5" fill="#10B981" />

                                            {/* Q&A Row 3 */}
                                            <rect x="58" y="176" width="204" height="38" rx="8" fill="#FFFBEB" stroke="#FDE68A" strokeWidth="1.5" />
                                            <circle cx="74" cy="195" r="8" fill="#D97706" />
                                            <path d="M70 195L73 198L79 192" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <rect x="90" y="188" width="120" height="6" rx="3" fill="#92400E" />
                                            <rect x="90" y="199" width="84" height="5" rx="2.5" fill="#D97706" />

                                            {/* Floating Instant Reset Card */}
                                            <motion.g
                                                animate={{ y: [-4, 4, -4] }}
                                                transition={{ duration: 3.3, repeat: Infinity, ease: 'easeInOut' }}
                                            >
                                                <rect x="252" y="88" width="118" height="92" rx="14" fill="#0F172A" stroke="#004AAD" strokeWidth="2.5" />
                                                <circle cx="280" cy="116" r="12" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5" />
                                                <path d="M276 116L279 119L285 113" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <text x="298" y="114" fill="#FFFFFF" fontSize="9.5" fontWeight="800" fontFamily="sans-serif">Auto-Save</text>
                                                <text x="298" y="125" fill="#38BDF8" fontSize="8.5" fontWeight="700" fontFamily="sans-serif">Verified</text>
                                                <rect x="268" y="142" width="86" height="6" rx="3" fill="#334155" />
                                                <rect x="268" y="142" width="72" height="6" rx="3" fill="#10B981" />
                                                <text x="268" y="164" fill="#94A3B8" fontSize="8" fontFamily="sans-serif">Resume any time</text>
                                            </motion.g>
                                        </svg>
                                    </div>
                                </Reveal>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════════════════════
                    QUICK TROUBLESHOOTING CARDS
                   ══════════════════════════════════════════════════════════════════ */}
                <section className="py-12 bg-white border-b border-slate-200/80">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {QUICK_GUIDES.map((guide, i) => {
                                const Icon = guide.icon;
                                return (
                                    <Reveal key={guide.title} delay={i * 0.05}>
                                        <div className={`h-full rounded-2xl bg-white border-2 ${guide.border} p-5 shadow-xs`}>
                                            <div className={`w-10 h-10 rounded-xl border ${guide.tint} flex items-center justify-center mb-3.5`}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <h2 className="text-base font-bold text-slate-900 mb-1.5">{guide.title}</h2>
                                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{guide.desc}</p>
                                        </div>
                                    </Reveal>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════════════════════
                    CATEGORIZED ACCORDION FAQ
                   ══════════════════════════════════════════════════════════════════ */}
                <section className="py-16 sm:py-20 bg-[#F8FAFC] border-b border-slate-200/80">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Category Tabs */}
                        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
                            {FAQ_CATEGORIES.map((cat) => {
                                const active = activeCategory === cat.id;
                                return (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => setActiveCategory(cat.id)}
                                        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
                                            active
                                                ? 'bg-[#004AAD] text-white border-[#004AAD] shadow-xs'
                                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                                        }`}
                                    >
                                        {cat.label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Accordion List */}
                        <div className="space-y-3.5">
                            {filteredFaqs.map((item) => {
                                const isOpen = openId === item.id;
                                return (
                                    <div
                                        key={item.id}
                                        className={`rounded-2xl bg-white border-2 transition-all ${
                                            isOpen
                                                ? 'border-[#004AAD] shadow-sm'
                                                : 'border-slate-200/90 hover:border-sky-200'
                                        }`}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => setOpenId(isOpen ? null : item.id)}
                                            className="w-full px-5 sm:px-6 py-4 sm:py-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                                        >
                                            <span className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                                                {item.q}
                                            </span>
                                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                                                isOpen ? 'bg-[#004AAD] text-white' : 'bg-slate-100 text-slate-600'
                                            }`}>
                                                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                                            </span>
                                        </button>

                                        <AnimatePresence initial={false}>
                                            {isOpen && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.22 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="px-5 sm:px-6 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                                                        {item.a}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}

                            {filteredFaqs.length === 0 && (
                                <div className="text-center py-12 rounded-2xl bg-white border border-slate-200 p-6">
                                    <p className="text-sm font-semibold text-slate-700 mb-2">
                                        No questions matched "{searchQuery}".
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
                                        className="text-xs font-bold text-[#004AAD] hover:underline cursor-pointer"
                                    >
                                        Clear search and show all 12 questions
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════════════════════
                    STILL NEED HELP / SUPPORT ESCALATION
                   ══════════════════════════════════════════════════════════════════ */}
                <section className="py-16 sm:py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="rounded-3xl bg-[#F8FAFC] border-2 border-emerald-200 p-6 sm:p-10 shadow-xs">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                                <div className="lg:col-span-7">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 mb-3">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        <span>Direct Campus Support</span>
                                    </div>
                                    <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-3">
                                        Still having trouble signing in?
                                    </h3>
                                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
                                        For fastest resolution during a live class or assessment, speak directly with your Ethnotech classroom trainer or college placement coordinator. They can verify your USN and reset your session immediately from the trainer console.
                                    </p>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <Link
                                            to="/#login"
                                            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#004AAD] hover:bg-[#003882] text-white text-sm font-semibold shadow-xs transition-all"
                                        >
                                            <span>Go to Login & Password Reset</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                        <a
                                            href="mailto:info@ethnotech.in"
                                            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-sm font-semibold transition-all"
                                        >
                                            <Mail className="w-4 h-4 text-[#004AAD]" />
                                            <span>info@ethnotech.in</span>
                                        </a>
                                    </div>
                                </div>

                                <div className="lg:col-span-5 grid grid-cols-1 gap-3.5">
                                    <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-2xs">
                                        <div className="text-xs font-bold text-[#004AAD] uppercase tracking-wider mb-1">
                                            Step 1 · Self-Service Reset
                                        </div>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            Use the "First-Time / Reset" tab on the home page with your USN and registered mobile number to set a fresh password.
                                        </p>
                                    </div>
                                    <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-2xs">
                                        <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
                                            Step 2 · Classroom Trainer Desk
                                        </div>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            If your mobile number changed or your USN was recently added to the batch, your trainer can update your record on the spot.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </PublicLayout>
        </MotionConfig>
    );
};

export default FaqPage;
