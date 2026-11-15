import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, MotionConfig, AnimatePresence } from 'framer-motion';
import {
    Sparkles, Users, BookOpen, Cpu, Compass, CheckCircle2,
    ArrowRight, Star, Clock, Award, MessageSquare, MapPin
} from 'lucide-react';
import PublicLayout from '../../layouts/PublicLayout';
import { Reveal, DrawUnderline, Photo, CountUp } from '../../components/landing/LandingFx';

const CAMPUS_PHOTOS = [
    {
        id: 'classroom',
        category: 'classrooms',
        hd: '/assets/campus/hd/classroom.jpg',
        fallback: '/assets/campus/classroom.jpg',
        title: 'Smart Live-Coding Classrooms',
        tag: 'Classroom Sessions',
        desc: 'Interactive digital-board classrooms where trainers walk through C++, Java, Python, and Core Engineering problems step by step with live student participation.',
        border: 'border-sky-300 hover:border-sky-400',
        badge: 'bg-sky-50 text-sky-700 border-sky-200',
        span: 'lg:col-span-7',
        aspect: 'aspect-[16/10]'
    },
    {
        id: 'logo-wall',
        category: 'community',
        hd: '/assets/campus/hd/logo-wall.jpg',
        fallback: '/assets/campus/logo-wall.jpg',
        title: 'Ethnotech Academy Collaboration Hub',
        tag: 'Student Lounge',
        desc: 'Peer discussion zones where batches review mock test solutions, prepare for group discussions, and consult placement coordinators.',
        border: 'border-violet-300 hover:border-violet-400',
        badge: 'bg-violet-50 text-violet-700 border-violet-200',
        span: 'lg:col-span-5',
        aspect: 'aspect-[16/10]'
    },
    {
        id: 'team',
        category: 'labs',
        hd: '/assets/campus/hd/team.jpg',
        fallback: '/assets/campus/team.jpg',
        title: 'Peer Problem-Solving Pods',
        tag: 'Hands-on Practice',
        desc: 'Small student squads collaborating on algorithmic sprints, debugging test cases, and reviewing unit assessment feedback right after class.',
        border: 'border-emerald-300 hover:border-emerald-400',
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        span: 'lg:col-span-4',
        aspect: 'aspect-[4/3]'
    },
    {
        id: 'lab',
        category: 'labs',
        hd: '/assets/campus/hd/lab.jpg',
        fallback: '/assets/campus/lab.jpg',
        title: 'Build, Learn & Innovate Labs',
        tag: 'Innovation Lab',
        desc: 'Dedicated project labs for AI/ML model prototyping, Cyber Security CTF drills, Cloud deployments, and Embedded IoT hardware sprints.',
        border: 'border-amber-300 hover:border-amber-400',
        badge: 'bg-amber-50 text-amber-800 border-amber-200',
        span: 'lg:col-span-4',
        aspect: 'aspect-[4/3]'
    },
    {
        id: 'outdoor',
        category: 'community',
        hd: '/assets/campus/hd/outdoor.jpg',
        fallback: '/assets/campus/outdoor.jpg',
        title: 'Campus Green Breakouts',
        tag: 'Campus Community',
        desc: 'Open-air discussion spaces where students recharge between technical blocks and practice communication and interview drills.',
        border: 'border-rose-300 hover:border-rose-400',
        badge: 'bg-rose-50 text-rose-700 border-rose-200',
        span: 'lg:col-span-4',
        aspect: 'aspect-[4/3]'
    },
    {
        id: 'office',
        category: 'classrooms',
        hd: '/assets/campus/hd/office.jpg',
        fallback: '/assets/campus/office.jpg',
        title: 'Good Learners, Brighter Futures',
        tag: 'Mentorship & Career Desk',
        desc: 'Dedicated faculty and placement readiness spaces focused on 1-on-1 resume clinics, company-specific mock interviews, and career guidance.',
        border: 'border-indigo-300 hover:border-indigo-400',
        badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        span: 'lg:col-span-12',
        aspect: 'aspect-[21/9]'
    }
];

const DAILY_RHYTHM = [
    {
        time: '09:00 AM to 11:00 AM',
        title: 'Interactive Concept & Whiteboard Block',
        desc: 'Trainers introduce core algorithms, circuit architecture, or domain frameworks using live code execution and interactive smartboards.',
        border: 'border-sky-200 hover:border-sky-300',
        pill: 'bg-sky-50 text-sky-700 border-sky-200',
        icon: BookOpen
    },
    {
        time: '11:15 AM to 01:00 PM',
        title: 'Guided Lab & Squad Problem Solving',
        desc: 'Students break into 3-to-4 member pods to build working implementations, solve graded problem sets, and get immediate trainer unblocking.',
        border: 'border-violet-200 hover:border-violet-300',
        pill: 'bg-violet-50 text-violet-700 border-violet-200',
        icon: Cpu
    },
    {
        time: '02:00 PM to 03:15 PM',
        title: 'Timed Portal Assessment & Instant Analytics',
        desc: 'Every session wraps with a proctored unit test on the Ethnotech portal so students see their exact topic accuracy before leaving the lab.',
        border: 'border-emerald-200 hover:border-emerald-300',
        pill: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        icon: CheckCircle2
    },
    {
        time: '03:30 PM to 04:30 PM',
        title: 'LSRW, Mock Interviews & Doubt Clinics',
        desc: 'Dedicated afternoon slots for communication drills, group discussions, resume reviews, and 1-on-1 mentoring with domain trainers.',
        border: 'border-amber-200 hover:border-amber-300',
        pill: 'bg-amber-50 text-amber-800 border-amber-200',
        icon: Users
    }
];

const PILLARS = [
    {
        icon: BookOpen,
        title: 'Learning beyond textbooks',
        desc: 'Every concept is taught with live coding, hardware benches, or real industrial case studies rather than static slide decks.',
        border: 'border-sky-200 hover:border-sky-300',
        tint: 'bg-sky-50 text-sky-700 border-sky-200'
    },
    {
        icon: Users,
        title: 'A supportive batch community',
        desc: 'Trainers, lab mentors, and batchmates work together in small pods so no student gets stuck silently behind the class.',
        border: 'border-emerald-200 hover:border-emerald-300',
        tint: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
        icon: Compass,
        title: 'Real-world engineering sprints',
        desc: 'Hackathons, company-patterned mock drives, and capstone reviews prepare you for actual technical interview rounds.',
        border: 'border-amber-200 hover:border-amber-300',
        tint: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    {
        icon: Cpu,
        title: 'Daily hands-on practice',
        desc: 'Consistent practice across coding, core engineering simulations, aptitude, and LSRW communication builds lasting confidence.',
        border: 'border-violet-200 hover:border-violet-300',
        tint: 'bg-violet-50 text-violet-700 border-violet-200'
    }
];

const CampusLifePage = () => {
    const [activeFilter, setActiveFilter] = useState('all');

    const filteredPhotos = activeFilter === 'all'
        ? CAMPUS_PHOTOS
        : CAMPUS_PHOTOS.filter((item) => item.category === activeFilter);

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
                                    {/* <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-xs text-[12px] font-semibold text-slate-700 mb-5">
                                        <Sparkles className="w-3.5 h-3.5 text-[#004AAD]" />
                                        <span>Life at Ethnotech Academy</span>
                                    </div> */}
                                </Reveal>

                                <Reveal delay={0.05}>
                                    <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight leading-[1.12] mb-5">
                                        More than classes, a place to{' '}
                                        <span
                                            className="relative inline-block text-[#004AAD] font-semibold text-[1.08em] px-1 tracking-normal"
                                            style={{ fontFamily: "'Dancing Script', 'Courgette', cursive", fontWeight: 600 }}
                                        >
                                            learn, build and grow
                                            <DrawUnderline className="absolute left-0 -bottom-2 w-full h-3" color="#004AAD" />
                                        </span>
                                    </h1>
                                </Reveal>

                                <Reveal delay={0.1}>
                                    <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mb-8">
                                        Step inside our partner college training hubs and Ethnotech Academy centers. From interactive smartboard classrooms to peer coding pods and placement readiness clinics, every space is designed for active learning.
                                    </p>
                                </Reveal>

                                <Reveal delay={0.15}>
                                    <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-xl">
                                        <div className="rounded-xl bg-white border-2 border-sky-200 p-3.5 shadow-xs">
                                            <div className="text-xl sm:text-2xl font-extrabold text-[#004AAD]">
                                                <CountUp value="80+" />
                                            </div>
                                            <div className="text-[11px] font-medium text-slate-500 mt-0.5">Partner campuses</div>
                                        </div>
                                        <div className="rounded-xl bg-white border-2 border-emerald-200 p-3.5 shadow-xs">
                                            <div className="text-xl sm:text-2xl font-extrabold text-emerald-700">
                                                <CountUp value="2.7L+" />
                                            </div>
                                            <div className="text-[11px] font-medium text-slate-500 mt-0.5">Students trained</div>
                                        </div>
                                        <div className="rounded-xl bg-white border-2 border-amber-200 p-3.5 shadow-xs">
                                            <div className="text-xl sm:text-2xl font-extrabold text-amber-600">
                                                <CountUp value="4.8/5" />
                                            </div>
                                            <div className="text-[11px] font-medium text-slate-500 mt-0.5">Student rating</div>
                                        </div>
                                    </div>
                                </Reveal>
                            </div>

                            {/* Custom Animated Campus Hub SVG */}
                            <div className="lg:col-span-5 flex justify-center">
                                <Reveal delay={0.12}>
                                    <div className="w-full max-w-[430px] rounded-2xl bg-white border-2 border-sky-200 p-4 shadow-sm">
                                        <svg viewBox="0 0 400 280" fill="none" className="w-full h-auto">
                                            <rect width="400" height="280" rx="16" fill="#F8FAFC" />
                                            <circle cx="65" cy="55" r="38" fill="#E0F2FE" opacity="0.7" />
                                            <circle cx="340" cy="225" r="46" fill="#FEF3C7" opacity="0.65" />

                                            {/* Smartboard / Screen */}
                                            <rect x="44" y="34" width="210" height="122" rx="12" fill="#0F172A" stroke="#004AAD" strokeWidth="3" />
                                            <rect x="56" y="46" width="84" height="10" rx="5" fill="#38BDF8" />
                                            <rect x="56" y="64" width="140" height="7" rx="3.5" fill="#94A3B8" opacity="0.6" />
                                            <rect x="56" y="78" width="118" height="7" rx="3.5" fill="#34D399" opacity="0.85" />
                                            <rect x="56" y="92" width="156" height="7" rx="3.5" fill="#FBBF24" opacity="0.85" />
                                            <rect x="56" y="114" width="68" height="22" rx="6" fill="#004AAD" />
                                            <text x="90" y="129" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="700" fontFamily="sans-serif">LIVE LAB</text>

                                            {/* Floating Achievement Badge */}
                                            <motion.g
                                                animate={{ y: [-4, 4, -4] }}
                                                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                                            >
                                                <rect x="272" y="36" width="104" height="68" rx="12" fill="#FFFFFF" stroke="#BAE6FD" strokeWidth="2" />
                                                <circle cx="296" cy="62" r="12" fill="#ECFDF5" />
                                                <path d="M291 62L294.5 65.5L302 58" stroke="#10B981" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                                                <text x="314" y="59" fill="#0F172A" fontSize="10" fontWeight="800" fontFamily="sans-serif">Batch Pod</text>
                                                <text x="314" y="72" fill="#059669" fontSize="9" fontWeight="700" fontFamily="sans-serif">Active Now</text>
                                                <rect x="284" y="84" width="80" height="6" rx="3" fill="#E0F2FE" />
                                                <rect x="284" y="84" width="64" height="6" rx="3" fill="#0284C7" />
                                            </motion.g>

                                            {/* Collaborative Student Pod Table */}
                                            <rect x="64" y="208" width="272" height="14" rx="7" fill="#CBD5E1" />
                                            <rect x="96" y="222" width="10" height="36" rx="4" fill="#94A3B8" />
                                            <rect x="294" y="222" width="10" height="36" rx="4" fill="#94A3B8" />

                                            {/* Student 1 */}
                                            <circle cx="115" cy="168" r="15" fill="#0284C7" />
                                            <path d="M92 208C92 193 102 185 115 185C128 185 138 193 138 208" fill="#004AAD" />
                                            {/* Laptop 1 */}
                                            <path d="M124 192H154L158 208H120L124 192Z" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.5" />

                                            {/* Student 2 (Center) */}
                                            <circle cx="200" cy="162" r="16" fill="#7C3AED" />
                                            <path d="M175 208C175 191 186 182 200 182C214 182 225 191 225 208" fill="#6D28D9" />
                                            {/* Laptop 2 */}
                                            <path d="M184 190H216L220 208H180L184 190Z" fill="#FFFFFF" stroke="#004AAD" strokeWidth="1.8" />

                                            {/* Student 3 */}
                                            <circle cx="285" cy="168" r="15" fill="#059669" />
                                            <path d="M262 208C262 193 272 185 285 185C298 185 308 193 308 208" fill="#047857" />

                                            {/* Floating Idea / Discussion Bubble */}
                                            <motion.g
                                                animate={{ y: [3, -4, 3] }}
                                                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                            >
                                                <rect x="268" y="118" width="96" height="32" rx="10" fill="#FFFBEB" stroke="#FCD34D" strokeWidth="1.8" />
                                                <text x="316" y="138" textAnchor="middle" fill="#B45309" fontSize="10" fontWeight="700" fontFamily="sans-serif">100% Hands-on</text>
                                            </motion.g>
                                        </svg>
                                    </div>
                                </Reveal>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════════════════════
                    INTERACTIVE HD PHOTO GALLERY
                   ══════════════════════════════════════════════════════════════════ */}
                <section className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                            <div>
                                <div className="text-[12px] font-bold uppercase tracking-wider text-[#004AAD] mb-2">
                                    Inside Ethnotech Classrooms & Labs
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                                    Real moments from our training centers
                                </h2>
                            </div>

                            {/* Category Filter Pills */}
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { id: 'all', label: 'All Moments (6)' },
                                    { id: 'classrooms', label: 'Smart Classrooms' },
                                    { id: 'labs', label: 'Coding & Innovation Labs' },
                                    { id: 'community', label: 'Campus Community' }
                                ].map((tab) => {
                                    const active = activeFilter === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            type="button"
                                            onClick={() => setActiveFilter(tab.id)}
                                            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${active
                                                    ? 'bg-[#004AAD] text-white border-[#004AAD] shadow-xs'
                                                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                                                }`}
                                        >
                                            {tab.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Photo Cards Grid */}
                        <motion.div layout className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            <AnimatePresence mode="popLayout">
                                {filteredPhotos.map((photo) => (
                                    <motion.div
                                        key={photo.id}
                                        layout
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.96 }}
                                        transition={{ duration: 0.28 }}
                                        className={`${activeFilter === 'all' ? photo.span : 'lg:col-span-6'
                                            } group rounded-2xl bg-white border-2 ${photo.border} p-3 sm:p-4 shadow-sm hover:shadow-md transition-all flex flex-col`}
                                    >
                                        <div className={`relative overflow-hidden rounded-xl ${activeFilter === 'all' ? photo.aspect : 'aspect-[16/10]'
                                            } bg-slate-100 mb-4`}>
                                            <Photo
                                                name={photo.id}
                                                alt={photo.title}
                                                className="w-full h-full"
                                            />
                                            <div className="absolute top-3 left-3">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold border shadow-2xs backdrop-blur-xs bg-white/95 ${photo.badge}`}>
                                                    {photo.tag}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="px-1 pb-1 flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900 mb-1.5">
                                                    {photo.title}
                                                </h3>
                                                <p className="text-sm text-slate-600 leading-relaxed">
                                                    {photo.desc}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>

                        {/* Four Core Pillars */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
                            {PILLARS.map((pillar, i) => {
                                const Icon = pillar.icon;
                                return (
                                    <Reveal key={pillar.title} delay={i * 0.05}>
                                        <div className={`h-full rounded-2xl bg-white border-2 ${pillar.border} p-5 shadow-xs transition-all hover:-translate-y-0.5`}>
                                            <div className={`w-10 h-10 rounded-xl border ${pillar.tint} flex items-center justify-center mb-3.5`}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <h3 className="text-base font-bold text-slate-900 mb-1.5">{pillar.title}</h3>
                                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{pillar.desc}</p>
                                        </div>
                                    </Reveal>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════════════════════
                    A DAY AT ETHNOTECH ACADEMY
                   ══════════════════════════════════════════════════════════════════ */}
                <section className="py-16 sm:py-20 bg-[#F8FAFC] border-b border-slate-200/80">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-3xl mb-12">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-[#004AAD] mb-3">
                                <Clock className="w-3.5 h-3.5" />
                                <span>Typical Training Day</span>
                            </div>
                            <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
                                How a campus training session unfolds
                            </h2>
                            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                                Every training day balances concept clarity, squad lab implementation, and immediate assessment verification on the student portal.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {DAILY_RHYTHM.map((slot, idx) => {
                                const Icon = slot.icon;
                                return (
                                    <Reveal key={slot.title} delay={idx * 0.06}>
                                        <div className={`h-full rounded-2xl bg-white border-2 ${slot.border} p-6 shadow-xs flex flex-col justify-between`}>
                                            <div>
                                                <div className="flex items-center justify-between gap-3 mb-4">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${slot.pill}`}>
                                                        {slot.time}
                                                    </span>
                                                    <div className={`w-9 h-9 rounded-xl border ${slot.pill} flex items-center justify-center`}>
                                                        <Icon className="w-4 h-4" />
                                                    </div>
                                                </div>
                                                <h3 className="text-lg font-bold text-slate-900 mb-2">
                                                    {slot.title}
                                                </h3>
                                                <p className="text-sm text-slate-600 leading-relaxed">
                                                    {slot.desc}
                                                </p>
                                            </div>
                                        </div>
                                    </Reveal>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════════════════════
                    FULL COLLAGE SHOWCASE & CTA
                   ══════════════════════════════════════════════════════════════════ */}
                <section className="py-16 sm:py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="rounded-3xl bg-[#F8FAFC] border-2 border-sky-200 p-6 sm:p-10 shadow-xs">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                                <div className="lg:col-span-5">
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold mb-4">
                                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                                        <span>5,240+ Verified Student Reviews</span>
                                    </div>
                                    <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-3">
                                        Ready to join your batch session?
                                    </h3>
                                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
                                        Log in with your college USN or registered mobile number to view your upcoming classroom schedule, take unit assessments, and track your placement eligibility.
                                    </p>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <Link
                                            to="/#login"
                                            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#004AAD] hover:bg-[#003882] text-white text-sm font-semibold shadow-xs transition-all"
                                        >
                                            <span>Go to Student Sign In</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                        <Link
                                            to="/tracks"
                                            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-sm font-semibold transition-all"
                                        >
                                            <span>Explore 9 Training Tracks</span>
                                        </Link>
                                    </div>
                                </div>
                                <div className="lg:col-span-7">
                                    <div className="rounded-2xl bg-white border-2 border-slate-200 p-2.5 shadow-xs overflow-hidden">
                                        <img
                                            src="/assets/life-at-ethnotech.jpg"
                                            alt="Life at Ethnotech Academy collage"
                                            className="w-full h-auto rounded-xl object-cover"
                                        />
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

export default CampusLifePage;
