import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, MotionConfig } from 'framer-motion';
import {
    KeyRound,
    BookOpen,
    ClipboardCheck,
    Briefcase,
    ArrowRight,
    CheckCircle2,
    Clock,
    Smartphone,
    Lock,
    Award,
    Sparkles,
} from 'lucide-react';
import PublicLayout from '../../layouts/PublicLayout';
import { Reveal, DrawUnderline, ProgressRing } from '../../components/landing/LandingFx';

const STAGES = [
    {
        step: '01',
        title: 'Get your login from college',
        subtitle: 'Batch onboarding & password activation',
        desc: 'Your college placement cell or Ethnotech trainer maps your USN, mobile number and email to your semester batch. On your first visit, sign in using your default college password or set your own personal password.',
        highlights: [
            'Default password format: your college code in lowercase followed by @3! (e.g. mitm@3!)',
            'Switch to the "First-Time / Reset" tab anytime to set a custom password',
            'Your batch, branch and assigned courses load automatically on login',
        ],
        icon: KeyRound,
        color: 'bg-sky-500',
        lightTone: 'bg-sky-50 text-sky-700 border-sky-200',
        borderTone: 'border-sky-200',
    },
    {
        step: '02',
        title: 'Attend classes & practise topics',
        subtitle: 'Hands-on labs & self-paced drills',
        desc: 'As your trainer covers modules in class, your attendance is logged session by session. Between classes, use the practice sets to sharpen concepts across coding, core engineering, aptitude and LSRW.',
        highlights: [
            'Session-wise attendance updated right after each training class',
            'Practice modules aligned to the exact topics taught in your batch',
            'Covers CSE, AI/ML, Cyber, Cloud, ECE, EEE, Mechanical and Civil tracks',
        ],
        icon: BookOpen,
        color: 'bg-violet-500',
        lightTone: 'bg-violet-50 text-violet-700 border-violet-200',
        borderTone: 'border-violet-200',
    },
    {
        step: '03',
        title: 'Attempt trainer assessments',
        subtitle: 'Waiting room, timed tests & instant solutions',
        desc: 'When your trainer schedules a test or mock drive, join the waiting room from your dashboard. Answer MCQs and coding questions with automatic progress saving after every single question.',
        highlights: [
            'Auto-saves every answer so Wi-Fi drops or power cuts never erase your work',
            'Instant score, accuracy percentage and batch rank upon submission',
            'Detailed explanations for every question so you can fix weak areas fast',
        ],
        icon: ClipboardCheck,
        color: 'bg-emerald-500',
        lightTone: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        borderTone: 'border-emerald-200',
    },
    {
        step: '04',
        title: 'Track progress & apply to drives',
        subtitle: 'Verified readiness & placement applications',
        desc: 'Your test scores and attendance build a clear readiness record across the semester. When campus placement drives open, check your eligibility and apply directly from your student profile.',
        highlights: [
            'Clear visibility into your cumulative test average and course attendance',
            'Browse active placement drives with role, package and eligibility details',
            'One-click application submitted directly to the placement team',
        ],
        icon: Briefcase,
        color: 'bg-amber-500',
        lightTone: 'bg-amber-50 text-amber-700 border-amber-200',
        borderTone: 'border-amber-200',
    },
];

const HowItWorksPage = () => {
    const [activeStage, setActiveStage] = useState(0);

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
                                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                    Step-by-Step Student Guide
                                </motion.p>
                                <motion.h1
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.08 }}
                                    className="mt-4 text-[34px] sm:text-[44px] font-bold tracking-tight leading-[1.12] text-slate-900"
                                >
                                    From your first login to{' '}
                                    <span
                                        className="relative inline-block text-[#004AAD] font-semibold text-[1.08em] px-1 tracking-normal"
                                        style={{ fontFamily: "'Dancing Script', 'Courgette', cursive", fontWeight: 600 }}
                                    >
                                        final placement
                                        <DrawUnderline className="absolute left-0 -bottom-2 w-full h-3" color="#004AAD" />
                                    </span>
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.15 }}
                                    className="mt-5 text-[16.5px] text-slate-600 leading-relaxed max-w-xl"
                                >
                                    New to the portal? Here is how your classes, assessments, attendance and placement drives fit
                                    together through the semester.
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
                                        Log in now <ArrowRight size={15} />
                                    </Link>
                                    <Link
                                        to="/faq"
                                        className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-[14.5px] font-semibold transition-colors"
                                    >
                                        Read student FAQs
                                    </Link>
                                </motion.div>
                            </div>

                            {/* Custom Animated Flat-Vector Roadmap SVG */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.15 }}
                                className="flex justify-center lg:justify-end"
                            >
                                <svg viewBox="0 0 360 230" className="w-full max-w-[360px]" aria-hidden="true">
                                    {/* Connecting curved path */}
                                    <path
                                        d="M55 175 C 120 175, 130 95, 185 95 S 250 45, 310 45"
                                        fill="none"
                                        stroke="#94A3B8"
                                        strokeWidth="3"
                                        strokeDasharray="7 7"
                                    />

                                    {/* Step 1 Node */}
                                    <motion.g animate={{ y: [0, -5, 0] }} transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}>
                                        <rect x="18" y="135" width="96" height="72" rx="16" fill="#E0F2FE" />
                                        <circle cx="46" cy="162" r="13" fill="#0284C7" />
                                        <text x="46" y="167" textAnchor="middle" fontSize="13" fontWeight="800" fill="#fff">1</text>
                                        <rect x="66" y="154" width="34" height="7" rx="3.5" fill="#0284C7" />
                                        <rect x="66" y="166" width="24" height="6" rx="3" fill="#38BDF8" />
                                        <rect x="33" y="185" width="66" height="7" rx="3.5" fill="#7DD3FC" />
                                    </motion.g>

                                    {/* Step 2 Node */}
                                    <motion.g animate={{ y: [0, 6, 0] }} transition={{ duration: 4.1, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}>
                                        <rect x="134" y="68" width="104" height="74" rx="16" fill="#EDE9FE" />
                                        <circle cx="162" cy="96" r="13" fill="#7C3AED" />
                                        <text x="162" y="101" textAnchor="middle" fontSize="13" fontWeight="800" fill="#fff">2</text>
                                        <rect x="182" y="88" width="42" height="7" rx="3.5" fill="#7C3AED" />
                                        <rect x="182" y="100" width="28" height="6" rx="3" fill="#A78BFA" />
                                        <rect x="148" y="120" width="74" height="7" rx="3.5" fill="#C4B5FD" />
                                    </motion.g>

                                    {/* Step 3 Goal Node */}
                                    <motion.g animate={{ y: [0, -7, 0] }} transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}>
                                        <rect x="242" y="16" width="104" height="76" rx="16" fill="#FEF3C7" />
                                        <circle cx="270" cy="44" r="13" fill="#F59E0B" />
                                        <path d="M265 44l4 4 8-8" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                        <rect x="290" y="36" width="42" height="7" rx="3.5" fill="#D97706" />
                                        <rect x="290" y="48" width="30" height="6" rx="3" fill="#F59E0B" />
                                        <rect x="256" y="70" width="74" height="7" rx="3.5" fill="#FBBF24" />
                                    </motion.g>
                                </svg>
                            </motion.div>
                        </div>
                    </section>

                    {/* ═════════════ 4-STAGE DETAILED ROADMAP ═════════════ */}
                    <section className="py-20">
                        <div className="max-w-6xl mx-auto px-5 lg:px-6">
                            <Reveal className="max-w-2xl">
                                <p className="text-sm font-semibold text-[#004AAD] mb-2">The 4-Stage Workflow</p>
                                <h2 className="text-[28px] sm:text-[34px] font-bold tracking-tight text-slate-900 leading-tight">
                                    What happens at each step of the semester
                                </h2>
                            </Reveal>

                            <div className="mt-12 grid gap-8 md:grid-cols-2">
                                {STAGES.map((s, i) => (
                                    <Reveal key={s.step} delay={(i % 2) * 0.1}>
                                        <div className={`h-full rounded-2xl border-2 ${s.borderTone} bg-white p-7 flex flex-col justify-between shadow-2xs`}>
                                            <div>
                                                <div className="flex items-center justify-between gap-4">
                                                    <div className="flex items-center gap-3">
                                                        <span className={`w-11 h-11 rounded-xl ${s.color} text-white font-bold text-[16px] flex items-center justify-center shadow-sm`}>
                                                            {s.step}
                                                        </span>
                                                        <div>
                                                            <span className="text-[12px] font-semibold uppercase tracking-wider text-slate-400 block">
                                                                Stage {i + 1}
                                                            </span>
                                                            <span className="text-[13.5px] font-semibold text-slate-700">
                                                                {s.subtitle}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <span className={`w-10 h-10 rounded-xl border flex items-center justify-center ${s.lightTone}`}>
                                                        <s.icon size={19} />
                                                    </span>
                                                </div>

                                                <h3 className="mt-5 text-[20px] font-bold text-slate-900">{s.title}</h3>
                                                <p className="mt-2 text-[15px] text-slate-600 leading-relaxed">{s.desc}</p>
                                            </div>

                                            <ul className="mt-6 pt-5 border-t border-slate-100 space-y-2.5">
                                                {s.highlights.map((h) => (
                                                    <li key={h} className="flex items-start gap-2.5 text-[14px] text-slate-700">
                                                        <CheckCircle2 size={16} className="text-emerald-600 mt-0.5 shrink-0" />
                                                        <span>{h}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </Reveal>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ═════════════ INTERACTIVE WALKTHROUGH PREVIEW ═════════════ */}
                    <section className="py-20 bg-[#F8FAFC] border-y border-slate-200">
                        <div className="max-w-6xl mx-auto px-5 lg:px-6">
                            <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                                <div>
                                    <p className="text-sm font-semibold text-[#004AAD] mb-2">Interactive Preview</p>
                                    <h2 className="text-[28px] sm:text-[34px] font-bold tracking-tight text-slate-900 leading-tight">
                                        See what each stage looks like inside
                                    </h2>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {STAGES.map((s, idx) => (
                                        <button
                                            key={s.step}
                                            type="button"
                                            onClick={() => setActiveStage(idx)}
                                            className={`px-4 py-2 rounded-xl text-[13.5px] font-semibold border transition-all cursor-pointer ${
                                                activeStage === idx
                                                    ? 'bg-[#004AAD] text-white border-[#004AAD] shadow-xs'
                                                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                                            }`}
                                        >
                                            {s.step}. {s.title.split(' ')[0]} {s.title.split(' ')[1]}
                                        </button>
                                    ))}
                                </div>
                            </Reveal>

                            <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
                                {activeStage === 0 && (
                                    <div className="grid gap-8 md:grid-cols-2 items-center">
                                        <div className="space-y-3">
                                            <span className="inline-block text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-sky-50 text-sky-700 border border-sky-200">
                                                Stage 01 · First-Time Login
                                            </span>
                                            <h3 className="text-[22px] font-bold text-slate-900">
                                                Sign in with your USN and default college password
                                            </h3>
                                            <p className="text-[15px] text-slate-600 leading-relaxed">
                                                Enter your University Seat Number (or registered phone number) and use your college’s
                                                default password on day one. You can immediately set a custom password from the
                                                First-Time / Reset tab.
                                            </p>
                                        </div>
                                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3.5 max-w-md mx-auto w-full">
                                            <div className="text-xs font-semibold text-slate-500">USN or mobile number</div>
                                            <div className="h-10 px-3.5 rounded-lg bg-white border border-slate-200 flex items-center gap-2 text-sm font-mono text-slate-800">
                                                <Smartphone size={15} className="text-[#004AAD]" /> 4MT22CS042
                                            </div>
                                            <div className="text-xs font-semibold text-slate-500">Default Password</div>
                                            <div className="h-10 px-3.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between text-sm font-mono text-slate-800">
                                                <span className="flex items-center gap-2">
                                                    <Lock size={15} className="text-[#004AAD]" /> mitm@3!
                                                </span>
                                                <span className="text-[11px] font-sans font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                                                    Verified
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeStage === 1 && (
                                    <div className="grid gap-8 md:grid-cols-2 items-center">
                                        <div className="space-y-3">
                                            <span className="inline-block text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-violet-50 text-violet-700 border border-violet-200">
                                                Stage 02 · Attendance & Practice
                                            </span>
                                            <h3 className="text-[22px] font-bold text-slate-900">
                                                Every class attended and practice set completed counts
                                            </h3>
                                            <p className="text-[15px] text-slate-600 leading-relaxed">
                                                Check your course attendance percentage after every session and work through topic-wise
                                                practice sets before your trainer’s next unit assessment.
                                            </p>
                                        </div>
                                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex items-center justify-between gap-4 max-w-md mx-auto w-full">
                                            <div className="space-y-2">
                                                <p className="text-xs font-semibold text-slate-500">Current Semester Attendance</p>
                                                <p className="text-lg font-bold text-slate-900">24 of 26 Sessions Present</p>
                                                <p className="text-xs text-emerald-600 font-medium">Meets 85%+ placement requirement</p>
                                            </div>
                                            <ProgressRing value={92} size={64} stroke={6} color="#10B981">
                                                <span className="text-xs font-bold text-slate-900">92%</span>
                                            </ProgressRing>
                                        </div>
                                    </div>
                                )}

                                {activeStage === 2 && (
                                    <div className="grid gap-8 md:grid-cols-2 items-center">
                                        <div className="space-y-3">
                                            <span className="inline-block text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                Stage 03 · Scheduled Assessments
                                            </span>
                                            <h3 className="text-[22px] font-bold text-slate-900">
                                                Take timed tests and review solutions right away
                                            </h3>
                                            <p className="text-[15px] text-slate-600 leading-relaxed">
                                                Join your batch waiting room, complete the proctored test with automatic answer saving,
                                                and inspect the full answer key as soon as you submit.
                                            </p>
                                        </div>
                                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3 max-w-md mx-auto w-full">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-bold text-slate-900">Aptitude & Coding Mock 4</span>
                                                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                                                    Score: 88%
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                                                <div className="bg-white border border-slate-200 rounded-lg p-2.5">
                                                    <p className="text-[11px] text-slate-500">Correct</p>
                                                    <p className="text-sm font-bold text-emerald-600">26 / 30</p>
                                                </div>
                                                <div className="bg-white border border-slate-200 rounded-lg p-2.5">
                                                    <p className="text-[11px] text-slate-500">Time Taken</p>
                                                    <p className="text-sm font-bold text-slate-800">34m 12s</p>
                                                </div>
                                                <div className="bg-white border border-slate-200 rounded-lg p-2.5">
                                                    <p className="text-[11px] text-slate-500">Batch Rank</p>
                                                    <p className="text-sm font-bold text-[#004AAD]">#4 / 120</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeStage === 3 && (
                                    <div className="grid gap-8 md:grid-cols-2 items-center">
                                        <div className="space-y-3">
                                            <span className="inline-block text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                                                Stage 04 · Campus Placements
                                            </span>
                                            <h3 className="text-[22px] font-bold text-slate-900">
                                                Apply to eligible campus drives with one click
                                            </h3>
                                            <p className="text-[15px] text-slate-600 leading-relaxed">
                                                When your placement officer posts a hiring drive, your dashboard shows whether you meet
                                                the criteria and lets you submit your application immediately.
                                            </p>
                                        </div>
                                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3 max-w-md mx-auto w-full">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">Software Engineer Trainee</p>
                                                    <p className="text-xs text-slate-500">Campus Drive · Full-Time · 6.5 LPA</p>
                                                </div>
                                                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                                                    Eligible
                                                </span>
                                            </div>
                                            <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-200">
                                                <span>Min Attendance: 85% (You: 92%)</span>
                                                <span className="font-semibold text-[#004AAD]">Applied ✓</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* ═════════════ CTA ═════════════ */}
                    <section className="py-20">
                        <div className="max-w-6xl mx-auto px-5 lg:px-6">
                            <div className="rounded-3xl bg-[#004AAD] px-8 py-12 sm:px-12 flex flex-col md:flex-row md:items-center justify-between gap-6 text-white">
                                <div>
                                    <h2 className="text-[26px] sm:text-[30px] font-bold tracking-tight">
                                        Start with Step 1 today
                                    </h2>
                                    <p className="mt-2 text-[16px] text-blue-100">
                                        Sign in with your college USN or mobile number and check your batch schedule.
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

export default HowItWorksPage;

