import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    ArrowRight,
    Loader2,
    Lock,
    User,
    Smartphone,
    Eye,
    EyeOff,
    KeyRound,
    ClipboardList,
    PenLine,
    BarChart3,
    CalendarCheck,
    Briefcase,
    RotateCcw,
    ChevronDown,
    Clock,
    CheckCircle2,
    Star,
    BookOpen,
    LayoutDashboard,
    FileText,
    Bell,
    TrendingUp,
    Sparkles,
} from 'lucide-react';
import { motion, MotionConfig, AnimatePresence } from 'framer-motion';
import {
    Reveal,
    CountUp,
    DrawUnderline,
    Photo,
    ProgressRing,
    ScoreBars,
    StepConnector,
    TrackIcon,
} from '../components/landing/LandingFx';
import { AlertModal } from '../components/Modals';
import PublicLayout from '../layouts/PublicLayout';
import useStudentAuthStore from '../store/studentAuthStore';
import useAuthStore from '../store/authStore';

/* ───────────────────────── Static content ───────────────────────── */

const COLLEGES = [
    {
        id: 'mitm',
        code: 'MITM',
        name: 'MIT Mysore',
        sub: 'Maharaja Inst. of Technology',
        border: 'border-rose-200/90',
        logo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://mitmysore.in&size=128',
        fallbackLogo: 'https://www.google.com/s2/favicons?domain=mitmysore.in&sz=128',
    },
    {
        id: 'parul',
        code: 'PU',
        name: 'Parul University',
        sub: 'Vadodara · NAAC A++',
        border: 'border-amber-200/90',
        logo: 'https://upload.wikimedia.org/wikipedia/en/8/86/Parul_University_logo.svg',
        fallbackLogo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://paruluniversity.ac.in&size=128',
    },
    {
        id: 'vtu',
        code: 'VTU',
        name: 'VTU Belagavi',
        sub: 'Visvesvaraya Tech. University',
        border: 'border-sky-200/90',
        logo: 'https://upload.wikimedia.org/wikipedia/en/a/a0/Visvesvaraya_Technological_University_logo.png',
        fallbackLogo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://vtu.ac.in&size=128',
    },
    {
        id: 'psg',
        code: 'PSG',
        name: 'PSG Tech',
        sub: 'Coimbatore · Autonomous',
        border: 'border-blue-200/90',
        logo: 'https://upload.wikimedia.org/wikipedia/ta/6/6c/PSG_College_of_Technology_logo.jpg',
        fallbackLogo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://www.psgtech.edu&size=128',
    },
    {
        id: 'nmit',
        code: 'NMIT',
        name: 'NMIT Bengaluru',
        sub: 'Nitte Meenakshi Inst. of Tech',
        border: 'border-indigo-200/90',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/8/83/NMIT-Logo.svg',
        fallbackLogo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://www.nmit.ac.in&size=128',
    },
    {
        id: 'fisat',
        code: 'FISAT',
        name: 'FISAT Kochi',
        sub: 'Federal Inst. of Science & Tech',
        border: 'border-emerald-200/90',
        logo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://fisat.ac.in&size=128',
        fallbackLogo: 'https://www.google.com/s2/favicons?domain=fisat.ac.in&sz=128',
    },
    {
        id: 'bmsit',
        code: 'BMSIT',
        name: 'BMSIT Bengaluru',
        sub: 'BMS Inst. of Technology',
        border: 'border-violet-200/90',
        logo: 'https://upload.wikimedia.org/wikipedia/en/6/65/B.M.S._Institute_of_Technology_and_Management_logo.png',
        fallbackLogo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://bmsit.ac.in&size=128',
    },
    {
        id: 'msrit',
        code: 'MSRIT',
        name: 'Ramaiah Inst. of Tech',
        sub: 'MSRIT Bengaluru · Autonomous',
        border: 'border-orange-200/90',
        logo: 'https://upload.wikimedia.org/wikipedia/en/5/5a/Ramaiah_Institutions_Logo.png',
        fallbackLogo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://www.msrit.edu&size=128',
    },
    {
        id: 'rvce',
        code: 'RVCE',
        name: 'RV College of Engg.',
        sub: 'RVCE Bengaluru · Autonomous',
        border: 'border-cyan-200/90',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1f/New_RV_College_logo.png',
        fallbackLogo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://www.rvce.edu.in&size=128',
    },
    {
        id: 'kiit',
        code: 'KIIT',
        name: 'KIIT University',
        sub: 'Bhubaneswar · Deemed Univ.',
        border: 'border-teal-200/90',
        logo: 'https://upload.wikimedia.org/wikipedia/en/e/ef/KIIT_logo.svg',
        fallbackLogo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://kiit.ac.in&size=128',
    },
    {
        id: 'tce',
        code: 'TCE',
        name: 'TCE Gadag',
        sub: 'Tontadarya College of Engg.',
        border: 'border-purple-200/90',
        logo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://www.tcegadag.org&size=128',
        fallbackLogo: 'https://www.google.com/s2/favicons?domain=tcegadag.org&sz=128',
    },
];

const CollegeLogoImg = ({ logo, fallbackLogo, name }) => {
    const [src, setSrc] = useState(logo);
    return (
        <div className="w-10 h-10 rounded-lg bg-white border border-slate-100 p-1 flex items-center justify-center shrink-0 overflow-hidden">
            <img
                src={src}
                alt={`${name} official logo`}
                onError={() => {
                    if (fallbackLogo && src !== fallbackLogo) {
                        setSrc(fallbackLogo);
                    }
                }}
                className="w-full h-full object-contain"
                loading="lazy"
            />
        </div>
    );
};

const STATS = [
    { value: '2.7 lakh+', label: 'students trained', color: 'text-[#004AAD]' },
    { value: '80+', label: 'partner colleges', color: 'text-violet-600' },
    { value: '15,000+', label: 'students placed', color: 'text-emerald-600' },
    { value: '4.8 / 5', label: 'from 5,240+ Google reviews', color: 'text-amber-600' },
];

const TONES = [
    { tile: 'bg-sky-50 text-sky-700 border border-sky-200', border: 'border-sky-200 hover:border-sky-300', bar: 'bg-sky-500' },
    { tile: 'bg-violet-50 text-violet-700 border border-violet-200', border: 'border-violet-200 hover:border-violet-300', bar: 'bg-violet-500' },
    { tile: 'bg-emerald-50 text-emerald-700 border border-emerald-200', border: 'border-emerald-200 hover:border-emerald-300', bar: 'bg-emerald-500' },
    { tile: 'bg-amber-50 text-amber-700 border border-amber-200', border: 'border-amber-200 hover:border-amber-300', bar: 'bg-amber-500' },
    { tile: 'bg-rose-50 text-rose-700 border border-rose-200', border: 'border-rose-200 hover:border-rose-300', bar: 'bg-rose-500' },
    { tile: 'bg-cyan-50 text-cyan-700 border border-cyan-200', border: 'border-cyan-200 hover:border-cyan-300', bar: 'bg-cyan-500' },
];

const FEATURES = [
    {
        icon: ClipboardList,
        title: 'Assessments from your trainer',
        desc: 'Tests assigned to your batch show up on your dashboard with the date, duration and number of questions.',
    },
    {
        icon: PenLine,
        title: 'Practice before the real thing',
        desc: 'Topic-wise aptitude, coding and verbal practice sets that follow current campus hiring patterns.',
    },
    {
        icon: BarChart3,
        title: 'Results with explanations',
        desc: 'See your score as soon as you submit, along with the correct answers and where you lost marks.',
    },
    {
        icon: CalendarCheck,
        title: 'Attendance at a glance',
        desc: 'Check your session-wise attendance for every course so there are no surprises at the end of term.',
    },
    {
        icon: Briefcase,
        title: 'Placement drives',
        desc: 'Eligible openings shared by your placement team, with one-click applications from your profile.',
    },
    {
        icon: RotateCcw,
        title: 'Resume if you get disconnected',
        desc: 'Power cut or Wi-Fi drop mid-test? Log back in and continue from the question you were on.',
    },
];

const STEPS = [
    {
        title: 'Get your login from college',
        desc: 'Your trainer or placement coordinator adds you to a batch. Log in with your USN or registered mobile number.',
        border: 'border-sky-200 hover:border-sky-300',
        badge: 'bg-sky-50 text-sky-700 border-sky-200',
    },
    {
        title: 'Attend sessions & take tests',
        desc: 'Join classes, practise between sessions and attempt the assessments your trainer schedules.',
        border: 'border-violet-200 hover:border-violet-300',
        badge: 'bg-violet-50 text-violet-700 border-violet-200',
    },
    {
        title: 'Track progress & get placed',
        desc: 'Watch your scores improve over the term and apply to placement drives you are eligible for.',
        border: 'border-emerald-200 hover:border-emerald-300',
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
];

const TRACKS = [
    {
        group: 'AI, Machine Learning & Data Science',
        tag: 'CSE · AI & ML · DS',
        tagTone: 'bg-purple-50 text-purple-700 border-purple-200',
        icon: 'aiml',
        border: 'border-purple-200 hover:border-purple-300',
        items: [
            'Machine Learning & Deep Learning',
            'Generative AI & Prompt Engineering',
            'Natural Language Processing (NLP)',
            'Computer Vision & Neural Networks',
            'Data Analytics with Python & SQL',
        ],
    },
    {
        group: 'Cyber Security & Network Defense',
        tag: 'Cyber Security · IT',
        tagTone: 'bg-rose-50 text-rose-700 border-rose-200',
        icon: 'cyber',
        border: 'border-rose-200 hover:border-rose-300',
        items: [
            'Ethical Hacking & Penetration Testing',
            'Network Security & Cryptography',
            'Web Application Security (OWASP)',
            'SOC Operations & Incident Response',
            'Digital Forensics & Cloud Security',
        ],
    },
    {
        group: 'Cloud Computing & DevOps',
        tag: 'Cloud · DevOps',
        tagTone: 'bg-cyan-50 text-cyan-700 border-cyan-200',
        icon: 'cloud',
        border: 'border-cyan-200 hover:border-cyan-300',
        items: [
            'AWS & Microsoft Azure Fundamentals',
            'Docker, Kubernetes & Microservices',
            'CI/CD Pipelines & GitHub Actions',
            'Linux Administration & Shell Scripting',
            'Infrastructure as Code (Terraform)',
        ],
    },
    {
        group: 'Software & Full-Stack Development',
        tag: 'CSE · ISE · MCA',
        tagTone: 'bg-blue-50 text-blue-700 border-blue-200',
        icon: 'code',
        border: 'border-blue-200 hover:border-blue-300',
        items: [
            'C, C++, Java & Python Programming',
            'Data Structures & Algorithms (DSA)',
            'Full-Stack Web (React, Angular, Node.js)',
            'Enterprise Backend (.NET Core & Spring)',
            'System Design & DBMS',
        ],
    },
    {
        group: 'Electronics & Communication (ECE)',
        tag: 'ECE · TCE · Instrumentation',
        tagTone: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        icon: 'ece',
        border: 'border-emerald-200 hover:border-emerald-300',
        items: [
            'Embedded Systems & Microcontrollers (ARM/AVR)',
            'VLSI Design, Verilog & FPGA Prototyping',
            'Internet of Things (IoT) & Sensor Networks',
            'Digital Signal Processing & PCB Design',
            'Wireless & 5G Communication Systems',
        ],
    },
    {
        group: 'Electrical & Electronics (EEE)',
        tag: 'EEE · E&I',
        tagTone: 'bg-amber-50 text-amber-700 border-amber-200',
        icon: 'eee',
        border: 'border-amber-200 hover:border-amber-300',
        items: [
            'Electric Vehicle (EV) & Battery Management',
            'Power Electronics, Drives & Smart Grids',
            'PLC, SCADA & Industrial Automation',
            'MATLAB / Simulink for Control Systems',
            'Renewable Energy & Solar PV Systems',
        ],
    },
    {
        group: 'Mechanical & Robotics (MECH)',
        tag: 'Mechanical · Mechatronics',
        tagTone: 'bg-orange-50 text-orange-700 border-orange-200',
        icon: 'mech',
        border: 'border-orange-200 hover:border-orange-300',
        items: [
            '3D CAD Modelling (SolidWorks, CATIA, Creo)',
            'Finite Element Analysis (ANSYS & HyperMesh)',
            'Robotics, CNC & Mechatronics Automation',
            'Automotive Engineering & IC Engines',
            'Additive Manufacturing & 3D Printing',
        ],
    },
    {
        group: 'Civil & Infrastructure (CIVIL)',
        tag: 'Civil · Construction',
        tagTone: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        icon: 'civil',
        border: 'border-indigo-200 hover:border-indigo-300',
        items: [
            'AutoCAD 2D/3D & Building Information Modelling (Revit BIM)',
            'Structural Analysis & Design (STAAD.Pro & ETABS)',
            'Quantity Surveying, Estimation & Costing',
            'Construction Project Management (Primavera)',
            'Total Station, GIS & Smart Urban Infrastructure',
        ],
    },
    {
        group: 'Aptitude, LSRW & Placement Readiness',
        tag: 'All Branches',
        tagTone: 'bg-pink-50 text-pink-700 border-pink-200',
        icon: 'aptitude',
        border: 'border-pink-200 hover:border-pink-300',
        items: [
            'Quantitative Aptitude & Data Interpretation',
            'Logical, Analytical & Non-Verbal Reasoning',
            'Verbal Ability & LSRW Communication Suite',
            'Company-Specific Mock Drives (Product & Service)',
            'GD, Resume Building & Technical Mock Interviews',
        ],
    },
];

const TESTIMONIALS = [
    {
        name: 'Karthik Rao',
        college: 'MIT Mysore',
        avatar: 'bg-sky-100 text-sky-700',
        quote: 'text-sky-200',
        border: 'border-sky-200 hover:border-sky-300',
        body: 'The weekly tests on the portal showed me exactly which topics I was weak in. By the time placements started, the actual aptitude round felt familiar.',
    },
    {
        name: 'Priya Anand',
        college: 'Parul University',
        avatar: 'bg-violet-100 text-violet-700',
        quote: 'text-violet-200',
        border: 'border-violet-200 hover:border-violet-300',
        body: 'I liked that the solutions were right there after each test. My trainer would go through the batch results in the next class, which helped a lot.',
    },
    {
        name: 'Sanjay Gowda',
        college: 'TCE Gadag',
        avatar: 'bg-emerald-100 text-emerald-700',
        quote: 'text-emerald-200',
        border: 'border-emerald-200 hover:border-emerald-300',
        body: 'My internet dropped in the middle of a mock drive and I was able to continue from the same question. Small thing, but it saved my attempt.',
    },
];

const FAQS = [
    {
        q: 'What is my password for the first login?',
        a: 'Your default password is your college code in lowercase followed by @3!. For example, if your college code is MITM, your password is mitm@3!. You can change it any time after logging in.',
    },
    {
        q: 'I forgot my password. What should I do?',
        a: 'Click "First-Time / Reset" on the login card, enter your USN along with the mobile number or email registered with your college, and set a new password.',
    },
    {
        q: 'I cannot see a test my trainer mentioned.',
        a: 'Tests appear only once they are published for your batch. If it still does not show up at the scheduled time, check with your trainer that you are added to the correct batch.',
    },
    {
        q: 'What happens if I get disconnected during a test?',
        a: 'Your answers are saved as you go. Log back in from the same account and you will be taken back to the test to continue, as long as the test window is still open.',
    },
    {
        q: 'Can I take tests on my phone?',
        a: 'Practice sets work on mobile, but for proctored assessments and coding rounds we recommend a laptop or desktop with a stable internet connection.',
    },
];

/* ───────────────────────── Small pieces ───────────────────────── */

const SectionHeading = ({ eyebrow, title, desc, center = false }) => (
    <div className={center ? 'text-center max-w-2xl mx-auto' : 'max-w-2xl'}>
        {eyebrow && (
            <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#004AAD] bg-sky-50 border border-sky-200 px-3 py-1 rounded-full mb-3">
                {eyebrow}
            </p>
        )}
        <h2 className="text-[28px] sm:text-[34px] font-bold tracking-tight text-slate-900 leading-tight">{title}</h2>
        {desc && <p className="mt-3 text-[16px] text-slate-600 leading-relaxed">{desc}</p>}
    </div>
);

const FaqItem = ({ q, a }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="border-b border-slate-200">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between gap-6 py-5 text-left cursor-pointer"
            >
                <span className="text-[16px] font-semibold text-slate-900">{q}</span>
                <span
                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${open ? 'bg-[#004AAD] text-white' : 'bg-slate-100 text-slate-500'
                        }`}
                >
                    <ChevronDown size={16} className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
                </span>
            </button>
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                    >
                        <p className="pb-5 -mt-1 pr-12 text-[15px] text-slate-600 leading-relaxed">{a}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

/* A clean, screenshot-like preview of the student dashboard */
const DashboardPreview = () => (
    <div className="rounded-2xl border-2 border-sky-200 bg-white shadow-[0_20px_50px_-20px_rgba(15,23,42,0.18)] overflow-hidden text-left">
        {/* browser chrome */}
        <div className="flex items-center gap-3 px-4 h-9 border-b border-slate-200 bg-slate-50">
            <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-300" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-300" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-300" />
            </div>
            <div className="flex-1 max-w-xs mx-auto h-5 rounded bg-white border border-slate-200 text-[10px] text-slate-500 flex items-center justify-center font-medium">
                portal.ethnotech.in/student/dashboard
            </div>
        </div>

        <div className="flex">
            {/* sidebar */}
            <aside className="hidden sm:flex w-44 flex-col gap-1 border-r border-slate-200 p-3 bg-white">
                {[
                    { icon: LayoutDashboard, label: 'Dashboard', active: true },
                    { icon: FileText, label: 'My tests' },
                    { icon: BookOpen, label: 'Practice' },
                    { icon: CalendarCheck, label: 'Attendance' },
                    { icon: Briefcase, label: 'Placements' },
                ].map((i) => (
                    <div
                        key={i.label}
                        className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-[12px] ${i.active ? 'bg-sky-50 text-[#004AAD] font-semibold border border-sky-200/80' : 'text-slate-500'
                            }`}
                    >
                        <i.icon size={14} />
                        {i.label}
                    </div>
                ))}
            </aside>

            {/* main */}
            <div className="flex-1 p-4 sm:p-5 bg-slate-50/60 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[11px] text-slate-500">Active Semester Batch</p>
                        <p className="text-[15px] font-semibold text-slate-900">Welcome back, Priya</p>
                    </div>
                    <div className="relative w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                        <Bell size={14} className="text-slate-500" />
                        <span className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full bg-rose-500" />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: 'Tests taken', value: '18', tone: 'border-sky-200', txt: 'text-[#004AAD]' },
                        { label: 'Average score', value: '81%', tone: 'border-violet-200', txt: 'text-violet-700' },
                        { label: 'Rank in batch', value: '#7', tone: 'border-amber-200', txt: 'text-amber-700' },
                    ].map((s) => (
                        <div key={s.label} className={`bg-white border-2 ${s.tone} rounded-xl p-3`}>
                            <p className="text-[10px] text-slate-500 font-medium">{s.label}</p>
                            <p className={`text-[17px] font-bold mt-0.5 ${s.txt}`}>{s.value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-[1fr_auto] gap-3">
                    <div className="bg-white border border-slate-200 rounded-xl p-3.5">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-[12px] font-semibold text-slate-900">Score trend</p>
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                                <TrendingUp size={10} /> +12%
                            </span>
                        </div>
                        <ScoreBars data={[58, 64, 61, 70, 73, 86, 81]} height={56} />
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col items-center justify-center">
                        <ProgressRing value={92} size={58} stroke={6} color="#10B981">
                            <span className="text-[12px] font-bold text-slate-900">92%</span>
                        </ProgressRing>
                        <p className="text-[10px] text-slate-500 mt-1.5">Attendance</p>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-[10px] font-semibold text-amber-600 uppercase tracking-wide">Upcoming Assessment</p>
                        <p className="text-[13px] font-semibold text-slate-900 truncate">Java & DSA: Unit Assessment</p>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <Clock size={11} /> 45 min · 30 questions · Proctored
                        </p>
                    </div>
                    <span className="shrink-0 text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-sky-50 text-[#004AAD] border border-sky-200">
                        Assigned
                    </span>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl">
                    <p className="px-3.5 pt-3 pb-2 text-[12px] font-semibold text-slate-900">Recent results</p>
                    {[
                        { name: 'AI & Data Science Module 2', date: '10 Nov', score: 88 },
                        { name: 'C Programming: Pointers', date: '07 Nov', score: 90 },
                        { name: 'Verbal Ability (LSRW)', date: '04 Nov', score: 78 },
                    ].map((r) => (
                        <div key={r.name} className="flex items-center justify-between px-3.5 py-2 border-t border-slate-100 text-[12px]">
                            <span className="text-slate-700 truncate">{r.name}</span>
                            <div className="flex items-center gap-3 shrink-0">
                                <span className="text-slate-400 hidden sm:inline">{r.date}</span>
                                <span
                                    className={`font-semibold w-11 text-center rounded px-1 py-0.5 text-[11px] ${r.score >= 85
                                            ? 'bg-emerald-50 text-emerald-700'
                                            : r.score >= 75
                                                ? 'bg-sky-50 text-sky-700'
                                                : 'bg-amber-50 text-amber-700'
                                        }`}
                                >
                                    {r.score}%
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

/* ───────────────────────── Page ───────────────────────── */

const inputCls =
    'w-full h-12 px-4 bg-slate-50/90 border border-slate-200/90 rounded-xl text-[14.5px] font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#004AAD] focus:ring-4 focus:ring-blue-500/10 outline-none transition-all';

const StudentEntry = () => {
    const [alertState, setAlertState] = useState({ open: false });
    const navigate = useNavigate();
    const loginFormRef = useRef(null);

    const [loginVal, setLoginVal] = useState('');
    const [loginPw, setLoginPw] = useState('');
    const [showLoginPw, setShowLoginPw] = useState(false);
    const [collegeList, setCollegeList] = useState(COLLEGES);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { loginStudent } = useStudentAuthStore();

    useEffect(() => {
        useStudentAuthStore.setState({ loading: false });
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        axios
            .get(`${apiUrl}/student/colleges`)
            .then((res) => {
                const dbColleges = res.data?.data || [];
                if (!dbColleges.length) return;
                setCollegeList((prev) => {
                    const updated = prev.map((item) => {
                        const match = dbColleges.find(
                            (d) =>
                                d.logoUrl &&
                                (d.code?.toLowerCase() === item.code?.toLowerCase() ||
                                    d.name?.toLowerCase().includes(item.name.toLowerCase()))
                        );
                        return match ? { ...item, logo: match.logoUrl } : item;
                    });
                    const extras = dbColleges
                        .filter(
                            (d) =>
                                d.logoUrl &&
                                !prev.some(
                                    (item) =>
                                        d.code?.toLowerCase() === item.code?.toLowerCase() ||
                                        d.name?.toLowerCase().includes(item.name.toLowerCase())
                                )
                        )
                        .map((d) => ({
                            id: d._id,
                            code: d.code,
                            name: d.name,
                            sub: d.address || 'Partner Institution',
                            border: 'border-sky-200/90',
                            logo: d.logoUrl,
                            fallbackLogo: d.logoUrl,
                        }));
                    return [...extras, ...updated];
                });
            })
            .catch(() => { });
    }, []);

    const handleStudentLogin = async (e) => {
        e.preventDefault();
        if (!loginVal.trim() || !loginPw.trim()) {
            setAlertState({ open: true, title: 'Details Required', message: 'Please enter your Mobile number/USN and Password.', type: 'info' });
            return;
        }
        setIsSubmitting(true);
        try {
            const res = await loginStudent(loginVal.trim(), loginPw.trim());
            if (res.success) {
                useAuthStore.getState().logout();
                navigate('/student/dashboard');
            } else {
                setAlertState({ open: true, title: 'Authentication Failed', message: res.error || 'Login failed. Please check your details.', type: 'error' });
            }
        } catch (err) {
            setAlertState({ open: true, title: 'Authentication Error', message: err.message || 'An unexpected error occurred.', type: 'error' });
        } finally {
            setIsSubmitting(false);
            useStudentAuthStore.setState({ loading: false });
        }
    };

    const scrollToForm = () => loginFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });

    return (
        <MotionConfig reducedMotion="user">
            <PublicLayout>
                <div className="bg-white text-slate-900 overflow-x-hidden">
                    {/* ═════════════ HERO + LOGIN ═════════════ */}
                    <section className="relative pt-16 bg-[#F8FAFC] border-b border-slate-200">
                        <div className="relative max-w-6xl mx-auto px-5 lg:px-6 py-10 lg:py-14">
                            {/* Top Hero Heading */}
                            <div className="max-w-3xl mb-8 lg:mb-10">
                                {/* <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.45 }}
                                    className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-[#004AAD] bg-white border border-sky-200 rounded-full px-3.5 py-1 shadow-2xs"
                                >
                                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                    Official Partner College Learning & Assessment Portal
                                </motion.div> */}

                                <motion.h1
                                    initial={{ opacity: 0, y: 18 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                                    className="mt-4 text-[34px] sm:text-[46px] font-bold tracking-tight leading-[1.12] text-slate-900"
                                >
                                    Your classes, tests and{' '}
                                    <span
                                        className="relative inline-block text-[#004AAD] font-semibold text-[1.08em] px-1 tracking-normal"
                                        style={{ fontFamily: "'Dancing Script', 'Courgette', cursive", fontWeight: 600 }}
                                    >
                                        placement prep
                                        <DrawUnderline className="absolute left-0 -bottom-2 w-full h-3" color="#004AAD" />
                                    </span>{' '}
                                    in one place.
                                </motion.h1>

                                <motion.p
                                    initial={{ opacity: 0, y: 18 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
                                    className="mt-4 text-[16px] sm:text-[16.5px] text-slate-600 leading-relaxed max-w-2xl"
                                >
                                    Log in to see the assessments your trainer has assigned, practise between sessions, check your
                                    results and attendance, and apply to placement drives.
                                </motion.p>
                            </div>

                            {/* Side-by-Side Image Card & Login Form */}
                            <div className="grid gap-8 lg:grid-cols-[1.28fr_420px] items-stretch">
                                {/* Left: Full Campus Image + Stats Bar */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.65, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                                    className="flex flex-col rounded-2xl overflow-hidden border-2 border-sky-200 bg-white shadow-[0_12px_32px_-12px_rgba(0,74,173,0.10)]"
                                >
                                    <div className="relative flex-1 min-h-[260px] sm:min-h-[340px] overflow-hidden bg-slate-100 group">
                                        <img
                                            src="/assets/campus/hd/hero-login.jpg"
                                            alt="Ethnotech Academy students collaborating with laptops and C Programming, Data Structures and Computer Networks books"
                                            className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-slate-200 border-t border-slate-200 bg-white">
                                        {STATS.map((s) => (
                                            <div key={s.label} className="px-4 py-3.5">
                                                <CountUp value={s.value} className={`block text-[20px] font-bold ${s.color}`} />
                                                <p className="text-[12px] text-slate-500 leading-snug">{s.label}</p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>

                                {/* Right: Simple & Professional Login Card */}
                                <motion.div
                                    id="login"
                                    ref={loginFormRef}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                                    className="scroll-mt-24 flex"
                                >
                                    <div className="w-full flex flex-col justify-between bg-white border-2 border-sky-200 rounded-2xl shadow-[0_12px_32px_-12px_rgba(0,74,173,0.12)] overflow-hidden">
                                        <div className="p-6 sm:p-7">
                                            <div className="flex items-center justify-between gap-3">
                                                <div>
                                                    <h2 className="text-[21px] font-bold text-slate-900 tracking-tight">
                                                        Student Sign In
                                                    </h2>
                                                    <p className="mt-1 text-[13.5px] text-slate-500">
                                                        Enter your college USN or registered mobile number.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-6">
                                                <form onSubmit={handleStudentLogin} className="space-y-4">
                                                    <div>
                                                        <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                                                            USN or mobile number
                                                        </label>
                                                        <div className="relative group">
                                                            <Smartphone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#004AAD] transition-colors" />
                                                            <input
                                                                type="text"
                                                                required
                                                                autoComplete="username"
                                                                placeholder="e.g. 4MT22CS001 or 98XXXXXXXX"
                                                                className={`${inputCls} pl-10`}
                                                                value={loginVal}
                                                                onChange={(e) => setLoginVal(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <div className="flex items-center justify-between mb-1.5">
                                                            <label className="block text-[13px] font-medium text-slate-700">
                                                                Password
                                                            </label>
                                                        </div>
                                                        <div className="relative group">
                                                            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#004AAD] transition-colors" />
                                                            <input
                                                                type={showLoginPw ? 'text' : 'password'}
                                                                required
                                                                autoComplete="current-password"
                                                                placeholder="Enter your password"
                                                                className={`${inputCls} pl-10 pr-11`}
                                                                value={loginPw}
                                                                onChange={(e) => setLoginPw(e.target.value)}
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowLoginPw(!showLoginPw)}
                                                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-700 transition-colors"
                                                                aria-label={showLoginPw ? 'Hide password' : 'Show password'}
                                                            >
                                                                {showLoginPw ? <EyeOff size={16} /> : <Eye size={16} />}
                                                            </button>
                                                        </div>
                                                        <p className="mt-2 text-[12.5px] text-slate-500">
                                                            First time? Default password is{' '}
                                                            <code className="font-mono font-semibold text-slate-700">collegecode@3!</code>
                                                        </p>
                                                    </div>

                                                    <button
                                                        type="submit"
                                                        disabled={isSubmitting || !loginVal.trim() || !loginPw.trim()}
                                                        className="w-full h-11 mt-2 rounded-xl bg-[#004AAD] hover:bg-[#003882] text-white text-[14.5px] font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                                    >
                                                        {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                                                        Sign in
                                                        <ArrowRight size={15} />
                                                    </button>
                                                </form>
                                            </div>
                                        </div>

                                        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/80 text-[12.5px] text-slate-500 flex items-center justify-between gap-2">
                                            <span>Need help signing in?</span>
                                            <Link to="/faq" className="font-semibold text-[#004AAD] hover:underline">
                                                Read login FAQ
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </section>

                    {/* ═════════════ COLLEGES MARQUEE ═════════════ */}
                    <section className="border-b border-slate-200 bg-white">
                        <div className="max-w-6xl mx-auto px-5 lg:px-6 py-5 flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                            <div className="shrink-0">
                                <p className="text-[11px] font-bold uppercase tracking-wider text-[#004AAD]">Partner Universities</p>
                                <p className="text-[13px] font-medium text-slate-500">80+ campuses across India</p>
                            </div>
                            <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
                                <div className="flex w-max [--gap:1.25rem] [--duration:34s] gap-[var(--gap)] hover:[animation-play-state:paused]">
                                    {[0, 1].map((k) => (
                                        <div key={k} className="flex shrink-0 gap-[var(--gap)] animate-marquee" aria-hidden={k === 1}>
                                            {collegeList.map((c, i) => (
                                                <div
                                                    key={`${k}-${c.id}-${i}`}
                                                    className={`inline-flex items-center gap-3 px-3.5 py-2 rounded-xl bg-white border ${c.border} shadow-2xs whitespace-nowrap`}
                                                >
                                                    <CollegeLogoImg logo={c.logo} fallbackLogo={c.fallbackLogo} name={c.name} />
                                                    <div className="leading-tight">
                                                        <span className="block text-[13.5px] font-bold text-slate-800">{c.name}</span>
                                                        <span className="block text-[11px] font-medium text-slate-500">{c.sub}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ═════════════ FEATURES ═════════════ */}
                    <section id="features" className="scroll-mt-16 py-20 bg-white">
                        <div className="max-w-6xl mx-auto px-5 lg:px-6">
                            <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                                <SectionHeading
                                    eyebrow="What is in the portal"
                                    title="Everything you need through the semester"
                                    desc="Built around how training actually runs at your college. Your trainer assigns, you practise and attempt, and everyone can see the progress."
                                />
                                <Link
                                    to="/features"
                                    className="group self-start md:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-50 border border-sky-200 text-[14px] font-semibold text-[#004AAD] hover:bg-sky-100 transition-colors"
                                >
                                    Explore all features <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Reveal>
                            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                {FEATURES.map((f, i) => {
                                    const tone = TONES[i % TONES.length];
                                    return (
                                        <Reveal key={f.title} delay={(i % 3) * 0.08}>
                                            <motion.div
                                                whileHover={{ y: -4 }}
                                                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                                                className={`group relative h-full bg-white border-2 ${tone.border} rounded-2xl p-6 overflow-hidden transition-all hover:shadow-md`}
                                            >
                                                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${tone.tile} transition-transform duration-300 group-hover:scale-105`}>
                                                    <f.icon size={20} />
                                                </div>
                                                <h3 className="mt-4 text-[17px] font-semibold text-slate-900">{f.title}</h3>
                                                <p className="mt-1.5 text-[15px] text-slate-600 leading-relaxed">{f.desc}</p>
                                            </motion.div>
                                        </Reveal>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    {/* ═════════════ DASHBOARD PREVIEW ═════════════ */}
                    <section className="relative py-20 bg-[#F8FAFC] border-y border-slate-200 overflow-hidden">
                        <div className="relative max-w-6xl mx-auto px-5 lg:px-6 grid gap-12 lg:grid-cols-[0.82fr_1.18fr] items-center">
                            <Reveal>
                                <SectionHeading
                                    eyebrow="Your dashboard"
                                    title="Know what is due and how you are doing"
                                    desc="The first thing you see after logging in: your next test, your recent scores and your attendance, with no digging through WhatsApp groups."
                                />
                                <ul className="mt-6 space-y-3">
                                    {[
                                        { t: 'Upcoming tests with exact start time and duration', c: 'text-sky-600' },
                                        { t: 'Scores, solutions and a trend for every attempt', c: 'text-violet-600' },
                                        { t: 'Attendance percentage for each course', c: 'text-emerald-600' },
                                    ].map((x) => (
                                        <li key={x.t} className="flex items-start gap-2.5 text-[15px] text-slate-700">
                                            <CheckCircle2 size={18} className={`${x.c} mt-0.5 shrink-0`} />
                                            {x.t}
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-7">
                                    <Link
                                        to="/how-it-works"
                                        className="inline-flex items-center gap-2 text-[14.5px] font-semibold text-[#004AAD] hover:underline"
                                    >
                                        See how the student dashboard works <ArrowRight size={15} />
                                    </Link>
                                </div>
                            </Reveal>
                            <Reveal delay={0.1} y={40}>
                                <DashboardPreview />
                            </Reveal>
                        </div>
                    </section>

                    {/* ═════════════ HOW IT WORKS ═════════════ */}
                    <section id="how-it-works" className="scroll-mt-16 py-20 bg-white">
                        <div className="max-w-6xl mx-auto px-5 lg:px-6">
                            <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                                <SectionHeading
                                    eyebrow="How it works"
                                    title="Three steps from day one to placement"
                                    desc="Your batch roster, classroom sessions, proctored assessments and placement shortlists stay connected in one flow."
                                />
                                <Link
                                    to="/how-it-works"
                                    className="group self-start md:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-50 border border-violet-200 text-[14px] font-semibold text-violet-700 hover:bg-violet-100 transition-colors"
                                >
                                    Step-by-step guide <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Reveal>
                            <div className="relative mt-12">
                                <ol className="relative grid gap-6 md:grid-cols-3">
                                    {STEPS.map((s, i) => (
                                        <Reveal key={s.title} delay={i * 0.12}>
                                            <li className={`h-full rounded-2xl bg-white border-2 ${s.border} p-6 shadow-2xs`}>
                                                <div className="flex items-center justify-between mb-4">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${s.badge}`}>
                                                        Step 0{i + 1}
                                                    </span>
                                                </div>
                                                <h3 className="text-[18px] font-bold text-slate-900">{s.title}</h3>
                                                <p className="mt-2 text-[15px] text-slate-600 leading-relaxed">{s.desc}</p>
                                            </li>
                                        </Reveal>
                                    ))}
                                </ol>
                            </div>
                        </div>
                    </section>

                    {/* ═════════════ CAMPUS LIFE ═════════════ */}
                    <section id="campus" className="scroll-mt-16 py-20 bg-[#F8FAFC] border-y border-slate-200">
                        <div className="max-w-6xl mx-auto px-5 lg:px-6">
                            <Reveal className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                                <SectionHeading
                                    eyebrow="Life at Ethnotech Academy"
                                    title="More than classes, a place to learn, build and grow"
                                    desc="Hands-on labs, trainers who code along with you, and a batch that pushes each other through every mock drive."
                                />
                                <Link
                                    to="/campus-life"
                                    className="group self-start lg:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border-2 border-sky-200 text-[14px] font-semibold text-[#004AAD] hover:bg-sky-50 transition-colors"
                                >
                                    Explore Campus Life <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Reveal>

                            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 md:grid-rows-2 gap-4 md:h-[540px]">
                                {[
                                    { name: 'classroom', alt: 'Trainer teaching C programming in a classroom', cls: 'col-span-2 md:row-span-2', cap: 'Live coding sessions with your trainer', aspect: 'aspect-[4/3] md:aspect-auto', border: 'border-sky-300' },
                                    { name: 'team', alt: 'Students working together on a laptop', cap: 'Peer learning pods', aspect: 'aspect-square md:aspect-auto', border: 'border-violet-300' },
                                    { name: 'lab', alt: 'Students in the innovation lab', cap: 'Innovation lab', aspect: 'aspect-square md:aspect-auto', border: 'border-emerald-300' },
                                    { name: 'outdoor', alt: 'Students chatting outdoors on campus', cap: 'Campus community', aspect: 'aspect-square md:aspect-auto', border: 'border-amber-300' },
                                    { name: 'office', alt: 'Good learners, brighter futures wall', cap: 'Brighter futures', aspect: 'aspect-square md:aspect-auto', border: 'border-rose-300' },
                                ].map((p, i) => (
                                    <motion.figure
                                        key={p.name}
                                        initial={{ opacity: 0, scale: 0.96, y: 16 }}
                                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                        viewport={{ once: true, margin: '-60px' }}
                                        transition={{ duration: 0.6, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                                        className={`group relative rounded-2xl overflow-hidden border-2 ${p.border} bg-white shadow-sm ${p.cls || ''}`}
                                    >
                                        <Photo name={p.name} alt={p.alt} className={`w-full h-full ${p.aspect}`} />
                                        <figcaption className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent text-[13px] font-medium text-white">
                                            {p.cap}
                                        </figcaption>
                                    </motion.figure>
                                ))}
                            </div>

                            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                                {[
                                    { t: 'Learning beyond classrooms', d: 'Labs and projects, not just slides.', c: 'bg-sky-50 text-sky-700', b: 'border-sky-200 hover:border-sky-300', I: BookOpen },
                                    { t: 'A supportive community', d: 'Peers and mentors who help you through.', c: 'bg-emerald-50 text-emerald-700', b: 'border-emerald-200 hover:border-emerald-300', I: User },
                                    { t: 'Events & opportunities', d: 'Hackathons, workshops and hiring drives.', c: 'bg-amber-50 text-amber-700', b: 'border-amber-200 hover:border-amber-300', I: Sparkles },
                                    { t: 'Hands-on practice', d: 'Every concept followed by a test.', c: 'bg-violet-50 text-violet-700', b: 'border-violet-200 hover:border-violet-300', I: PenLine },
                                ].map((p, i) => (
                                    <Reveal key={p.t} delay={i * 0.08}>
                                        <div className={`h-full rounded-2xl bg-white border-2 ${p.b} p-5 flex gap-3.5 transition-colors`}>
                                            <span className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${p.c}`}>
                                                <p.I size={18} />
                                            </span>
                                            <div>
                                                <h3 className="text-[15.5px] font-semibold text-slate-900">{p.t}</h3>
                                                <p className="mt-1 text-[14px] text-slate-600 leading-relaxed">{p.d}</p>
                                            </div>
                                        </div>
                                    </Reveal>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ═════════════ TRACKS ═════════════ */}
                    <section id="tracks" className="scroll-mt-16 py-20 bg-white">
                        <div className="max-w-6xl mx-auto px-5 lg:px-6">
                            <Reveal className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                <div>
                                    <SectionHeading
                                        eyebrow="Training tracks across all branches"
                                        title="Courses and assessments you will find inside"
                                        desc="Domain-specific modules and assessments across Computer Science, AI & ML, Cyber Security, Cloud, ECE, EEE, Mechanical, Civil, and Placement Readiness."
                                    />
                                    <div className="mt-4">
                                        <Link
                                            to="/tracks"
                                            className="inline-flex items-center gap-2 text-[14.5px] font-semibold text-[#004AAD] hover:underline"
                                        >
                                            Filter & search all 9 engineering tracks <ArrowRight size={15} />
                                        </Link>
                                    </div>
                                </div>
                                {/* Courses & Assessments SVG Illustration */}
                                <svg viewBox="0 0 250 135" className="w-60 shrink-0 hidden md:block" aria-hidden="true">
                                    <rect x="12" y="18" width="140" height="86" rx="16" fill="#E0F2FE" />
                                    <rect x="28" y="34" width="46" height="10" rx="5" fill="#38BDF8" />
                                    <rect x="28" y="52" width="96" height="8" rx="4" fill="#7DD3FC" />
                                    <rect x="28" y="66" width="74" height="8" rx="4" fill="#7DD3FC" />
                                    <rect x="28" y="82" width="54" height="8" rx="4" fill="#0284C7" opacity="0.7" />

                                    <motion.g animate={{ y: [0, -7, 0] }} transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}>
                                        <rect x="122" y="42" width="114" height="72" rx="15" fill="#EDE9FE" />
                                        <text x="160" y="85" textAnchor="middle" fontSize="24" fontWeight="800" fill="#7C3AED">&lt;/&gt;</text>
                                        <circle cx="206" cy="66" r="10" fill="#C4B5FD" />
                                        <path d="M202 66l3 3 6-6" stroke="#5B21B6" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                        <rect x="140" y="96" width="76" height="6" rx="3" fill="#A78BFA" />
                                    </motion.g>

                                    <motion.g animate={{ y: [0, 5, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}>
                                        <rect x="168" y="8" width="60" height="28" rx="10" fill="#FEF3C7" />
                                        <circle cx="184" cy="22" r="5" fill="#F59E0B" />
                                        <rect x="194" y="19" width="24" height="6" rx="3" fill="#D97706" />
                                    </motion.g>
                                </svg>
                            </Reveal>
                            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                {TRACKS.map((t, i) => (
                                    <Reveal key={t.group} delay={(i % 3) * 0.08}>
                                        <motion.div
                                            whileHover={{ y: -4 }}
                                            className={`h-full bg-white border-2 ${t.border} rounded-2xl p-6 hover:shadow-md transition-all`}
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <TrackIcon type={t.icon} />
                                                {t.tag && (
                                                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${t.tagTone}`}>
                                                        {t.tag}
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="mt-4 text-[16px] font-semibold text-slate-900">{t.group}</h3>
                                            <ul className="mt-3 space-y-2">
                                                {t.items.map((item) => (
                                                    <li key={item} className="flex items-start gap-2 text-[14px] text-slate-600 leading-snug">
                                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-1 shrink-0" />
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </motion.div>
                                    </Reveal>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ═════════════ TESTIMONIALS ═════════════ */}
                    <section className="py-20 bg-[#F8FAFC] border-y border-slate-200">
                        <div className="max-w-6xl mx-auto px-5 lg:px-6">
                            <Reveal className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                <SectionHeading
                                    eyebrow="From students"
                                    title="What learners say about the program"
                                    desc="Real feedback from engineering students across our partner colleges."
                                />
                                {/* Student Reviews & Feedback SVG Illustration */}
                                <svg viewBox="0 0 250 135" className="w-60 shrink-0 hidden md:block" aria-hidden="true">
                                    <rect x="12" y="16" width="136" height="82" rx="16" fill="#E0F2FE" />
                                    <path d="M42 98 l-10 20 l26 -20z" fill="#E0F2FE" />
                                    <text x="44" y="64" fontSize="44" fontWeight="800" fill="#0284C7">“</text>
                                    <rect x="68" y="42" width="60" height="8" rx="4" fill="#38BDF8" />
                                    <rect x="68" y="56" width="46" height="8" rx="4" fill="#7DD3FC" />

                                    <motion.g animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
                                        <rect x="114" y="48" width="124" height="66" rx="15" fill="#FEF3C7" />
                                        {[136, 156, 176, 196, 216].map((cx) => (
                                            <path
                                                key={cx}
                                                d={`M${cx} 66 l2.4 4.8 5.3.8-3.8 3.7.9 5.3-4.8-2.5-4.8 2.5.9-5.3-3.8-3.7 5.3-.8z`}
                                                fill="#F59E0B"
                                            />
                                        ))}
                                        <rect x="134" y="92" width="64" height="7" rx="3.5" fill="#D97706" opacity="0.65" />
                                    </motion.g>

                                    <motion.g animate={{ y: [0, 5, 0] }} transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}>
                                        <circle cx="204" cy="26" r="16" fill="#FFE4E6" />
                                        <path
                                            d="M204 33s-7-4.3-7-9a4 4 0 017-2.6A4 4 0 01211 24c0 4.7-7 9-7 9z"
                                            fill="#F43F5E"
                                        />
                                    </motion.g>
                                </svg>
                            </Reveal>
                            <div className="mt-10 grid gap-6 md:grid-cols-3">
                                {TESTIMONIALS.map((t, i) => (
                                    <Reveal key={t.name} delay={i * 0.1}>
                                        <figure className={`relative h-full bg-white border-2 ${t.border} rounded-2xl p-6 flex flex-col hover:shadow-md transition-all`}>
                                            <svg className={`absolute top-5 right-5 w-10 h-10 ${t.quote}`} viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
                                                <path d="M9.3 6C5 8.4 2.7 12 2.7 16.6V26h9.6v-9.4H7.7c0-3.2 1.6-5.5 4.6-7L9.3 6zm16 0c-4.3 2.4-6.6 6-6.6 10.6V26h9.6v-9.4h-4.6c0-3.2 1.6-5.5 4.6-7L25.3 6z" />
                                            </svg>
                                            <div className="flex gap-0.5 text-amber-400">
                                                {Array.from({ length: 5 }).map((_, k) => (
                                                    <Star key={k} size={15} fill="currentColor" strokeWidth={0} />
                                                ))}
                                            </div>
                                            <blockquote className="mt-4 text-[15px] text-slate-700 leading-relaxed flex-1">“{t.body}”</blockquote>
                                            <figcaption className="mt-6 flex items-center gap-3">
                                                <span className={`w-10 h-10 rounded-full text-[13px] font-bold flex items-center justify-center ${t.avatar}`}>
                                                    {t.name.split(' ').map((n) => n[0]).join('')}
                                                </span>
                                                <div>
                                                    <p className="text-[14px] font-semibold text-slate-900">{t.name}</p>
                                                    <p className="text-[13px] text-slate-500">{t.college}</p>
                                                </div>
                                            </figcaption>
                                        </figure>
                                    </Reveal>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ═════════════ FAQ ═════════════ */}
                    <section id="faq" className="scroll-mt-16 py-20 bg-white">
                        <div className="max-w-6xl mx-auto px-5 lg:px-6 grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
                            <Reveal>
                                <SectionHeading
                                    eyebrow="Help & Support"
                                    title="Frequently asked questions"
                                    desc="Cannot find your answer? Browse our complete FAQ page or reach out to your trainer."
                                />
                                <div className="mt-4">
                                    <Link
                                        to="/faq"
                                        className="inline-flex items-center gap-2 text-[14.5px] font-semibold text-[#004AAD] hover:underline"
                                    >
                                        View all 12 FAQs & troubleshooting guides <ArrowRight size={15} />
                                    </Link>
                                </div>
                                <svg viewBox="0 0 220 140" className="mt-8 w-56 hidden lg:block" aria-hidden="true">
                                    <rect x="10" y="20" width="130" height="80" rx="16" fill="#E0F2FE" />
                                    <path d="M40 100 l-10 22 l28 -22z" fill="#E0F2FE" />
                                    <text x="75" y="72" textAnchor="middle" fontSize="40" fontWeight="700" fill="#0284C7">?</text>
                                    <motion.g animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
                                        <rect x="110" y="50" width="100" height="62" rx="14" fill="#FEF3C7" />
                                        <circle cx="140" cy="81" r="5" fill="#F59E0B" />
                                        <circle cx="160" cy="81" r="5" fill="#F59E0B" />
                                        <circle cx="180" cy="81" r="5" fill="#F59E0B" />
                                    </motion.g>
                                </svg>
                            </Reveal>
                            <Reveal delay={0.1} className="border-t border-slate-200">
                                {FAQS.map((f) => (
                                    <FaqItem key={f.q} {...f} />
                                ))}
                            </Reveal>
                        </div>
                    </section>

                    {/* ═════════════ CTA ═════════════ */}
                    <section className="pb-20 bg-white">
                        <div className="max-w-6xl mx-auto px-5 lg:px-6">
                            <Reveal>
                                <div className="relative rounded-3xl bg-[#F8FAFC] border-2 border-sky-200 p-8 sm:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
                                    <div className="max-w-xl">
                                        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#004AAD] bg-white border border-sky-200 px-3 py-1 rounded-full mb-3">
                                            Ready for your session?
                                        </span>
                                        <h2 className="text-[26px] sm:text-[32px] font-bold text-slate-900 tracking-tight">
                                            Your next assessment might already be scheduled.
                                        </h2>
                                        <p className="mt-2 text-[16px] text-slate-600">
                                            Sign in with your college USN or registered mobile number to check your upcoming tests, practice sets, and placement drives.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={scrollToForm}
                                        className="group shrink-0 inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-[#004AAD] hover:bg-[#003882] text-white text-[15px] font-semibold shadow-sm transition-colors cursor-pointer"
                                    >
                                        Go to Student Sign In <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                                    </button>
                                </div>
                            </Reveal>
                        </div>
                    </section>
                </div>

                <AlertModal
                    isOpen={alertState.open}
                    onClose={() => setAlertState({ ...alertState, open: false })}
                    title={alertState.title}
                    message={alertState.message}
                    type={alertState.type}
                />
            </PublicLayout>
        </MotionConfig>
    );
};

export default StudentEntry;
