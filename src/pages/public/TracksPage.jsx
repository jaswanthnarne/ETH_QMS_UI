import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, MotionConfig, AnimatePresence } from 'framer-motion';
import {
    BookOpen, Search, CheckCircle2, ArrowRight, Layers,
    Clock, Award, Sparkles, Code2, Cpu, ShieldCheck
} from 'lucide-react';
import PublicLayout from '../../layouts/PublicLayout';
import { Reveal, DrawUnderline, TrackIcon } from '../../components/landing/LandingFx';

const ALL_TRACKS = [
    {
        id: 'aiml',
        kind: 'aiml',
        category: 'cs-ai',
        stream: 'AI, ML & Data Science',
        title: 'Artificial Intelligence, Machine Learning & GenAI',
        semester: 'Semesters 4 to 7',
        hours: '80+ Guided Hours',
        assessments: '14 Module Tests + 3 Capstones',
        border: 'border-violet-300 hover:border-violet-400',
        pill: 'bg-violet-50 text-violet-700 border-violet-200',
        accent: '#7C3AED',
        summary: 'From Python data pipelines and classical supervised models to deep neural networks, RAG pipelines, and LLM prompt engineering.',
        topics: [
            'Python for Data Science, NumPy, Pandas & EDA',
            'Supervised & Unsupervised Learning with Scikit-Learn',
            'Deep Learning, CNNs, Transformers & PyTorch Basics',
            'Generative AI, Vector Databases, RAG & LLM Evaluation'
        ],
        outcomes: 'Build and evaluate end-to-end ML models and pass technical AI/Data Science coding rounds.'
    },
    {
        id: 'cyber',
        kind: 'cyber',
        category: 'cyber-cloud',
        stream: 'Cyber Security & Defense',
        title: 'Cyber Security, VAPT & Network Defense',
        semester: 'Semesters 4 to 7',
        hours: '70+ Guided Hours',
        assessments: '12 Security Labs + CTF Drills',
        border: 'border-emerald-300 hover:border-emerald-400',
        pill: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        accent: '#059669',
        summary: 'Hands-on offensive and defensive security covering OWASP Top 10, network packet analysis, Linux hardening, and SOC incident response.',
        topics: [
            'Networking Fundamentals, TCP/IP, Wireshark & Nmap',
            'Web Application Security & OWASP Top 10 Exploitation',
            'Linux Privilege Escalation, Cryptography & IAM',
            'SIEM Log Analysis, Vulnerability Assessment & CTF Sprints'
        ],
        outcomes: 'Identify vulnerabilities, secure web APIs, and clear security analyst and SOC technical screenings.'
    },
    {
        id: 'cloud',
        kind: 'cloud',
        category: 'cyber-cloud',
        stream: 'Cloud & DevOps Engineering',
        title: 'Cloud Architecture (AWS / Azure) & DevOps CI/CD',
        semester: 'Semesters 5 to 8',
        hours: '75+ Guided Hours',
        assessments: '12 Cloud Labs + Architecture Quizzes',
        border: 'border-sky-300 hover:border-sky-400',
        pill: 'bg-sky-50 text-sky-700 border-sky-200',
        accent: '#0284C7',
        summary: 'Design resilient cloud infrastructure, containerize microservices with Docker and Kubernetes, and automate deployments with GitHub Actions.',
        topics: [
            'AWS & Azure Core Compute, VPC Networking, IAM & Storage',
            'Linux Shell Scripting, Git Workflows & Build Automation',
            'Docker Containers, Kubernetes Pods & Helm Basics',
            'Infrastructure as Code (Terraform) & CI/CD Pipelines'
        ],
        outcomes: 'Deploy fault-tolerant cloud applications and succeed in Cloud, SRE, and DevOps interviews.'
    },
    {
        id: 'code',
        kind: 'code',
        category: 'cs-ai',
        stream: 'Software & Full-Stack',
        title: 'Data Structures, Algorithms & Full-Stack Development',
        semester: 'Semesters 3 to 8',
        hours: '100+ Guided Hours',
        assessments: '20 Coding Tests + System Mini-Projects',
        border: 'border-blue-300 hover:border-blue-400',
        pill: 'bg-blue-50 text-blue-700 border-blue-200',
        accent: '#004AAD',
        summary: 'Master problem-solving in C++, Java, and Python alongside modern React, Node.js, SQL, and REST API engineering for product and service drives.',
        topics: [
            'Arrays, Strings, Linked Lists, Trees, Graphs & Dynamic Programming',
            'Object-Oriented Programming in Java / C++ & Clean Code',
            'Relational Databases, SQL Joins, Indexing & Query Tuning',
            'React Frontend, Node/Express REST APIs & System Design Basics'
        ],
        outcomes: 'Crack timed OA coding rounds and build production-grade full-stack applications.'
    },
    {
        id: 'ece',
        kind: 'ece',
        category: 'ece-eee',
        stream: 'ECE · Electronics & Comm.',
        title: 'Embedded Systems, VLSI Design & IoT Protocols',
        semester: 'Semesters 3 to 8',
        hours: '75+ Guided Hours',
        assessments: '14 Core ECE Tests + Firmware Labs',
        border: 'border-indigo-300 hover:border-indigo-400',
        pill: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        accent: '#4F46E5',
        summary: 'Bridge classroom electronics with semiconductor and embedded industry expectations through Embedded C, ARM Cortex, Verilog RTL, and IoT systems.',
        topics: [
            'Embedded C Programming, Pointers, Interrupts & RTOS Basics',
            'ARM Cortex Microcontrollers, UART, SPI, I2C & CAN Protocols',
            'Digital Design, Verilog HDL, FPGA Prototyping & CMOS VLSI',
            'IoT Sensor Interfacing, MQTT Telemetry & Edge Diagnostics'
        ],
        outcomes: 'Clear core semiconductor, VLSI, automotive embedded, and IoT technical assessments.'
    },
    {
        id: 'eee',
        kind: 'eee',
        category: 'ece-eee',
        stream: 'EEE · Electrical & Electronics',
        title: 'Power Electronics, EV Systems & PLC Automation',
        semester: 'Semesters 3 to 8',
        hours: '70+ Guided Hours',
        assessments: '12 Core EEE Assessments + Simulink Cases',
        border: 'border-amber-300 hover:border-amber-400',
        pill: 'bg-amber-50 text-amber-800 border-amber-200',
        accent: '#D97706',
        summary: 'Industry-aligned training in power converters, Electric Vehicle battery management systems, industrial PLC/SCADA automation, and smart grids.',
        topics: [
            'Power Electronics, Inverters, Choppers & Motor Drives',
            'EV Powertrain Architecture, Lithium-Ion BMS & Charging Standards',
            'Industrial Automation, PLC Ladder Logic & SCADA Interfacing',
            'MATLAB / Simulink Circuit Modeling, Switchgear & Grid Protection'
        ],
        outcomes: 'Prepare for core electrical, EV manufacturing, energy automation, and PSU technical rounds.'
    },
    {
        id: 'mech',
        kind: 'mech',
        category: 'mech-civil',
        stream: 'Mechanical Engineering',
        title: 'CAD/CAM, FEA/CFD Simulation & Digital Manufacturing',
        semester: 'Semesters 3 to 8',
        hours: '70+ Guided Hours',
        assessments: '12 Core Mech Tests + Design Blueprints',
        border: 'border-orange-300 hover:border-orange-400',
        pill: 'bg-orange-50 text-orange-800 border-orange-200',
        accent: '#EA580C',
        summary: 'Master 3D parametric modeling, GD&T tolerances, structural and thermal analysis, and modern CNC/Mechatronics workflows for core engineering roles.',
        topics: [
            '3D Parametric Part & Assembly Modeling (SolidWorks / CATIA)',
            'Geometric Dimensioning & Tolerancing (GD&T) & Engineering Drawings',
            'Finite Element Analysis (ANSYS FEA), Thermal & CFD Fundamentals',
            'Thermodynamics, Automotive Systems, CNC Toolpaths & Lean Six Sigma'
        ],
        outcomes: 'Excel in R&D design tests, automotive OEM technical interviews, and manufacturing assessments.'
    },
    {
        id: 'civil',
        kind: 'civil',
        category: 'mech-civil',
        stream: 'Civil & Infrastructure',
        title: 'BIM Modeling, Structural Analysis & Quantity Surveying',
        semester: 'Semesters 3 to 8',
        hours: '65+ Guided Hours',
        assessments: '12 Core Civil Tests + Estimation Sheets',
        border: 'border-teal-300 hover:border-teal-400',
        pill: 'bg-teal-50 text-teal-800 border-teal-200',
        accent: '#0D9488',
        summary: 'Practical civil engineering competency across structural design codes, Building Information Modeling (BIM), BOQ estimation, and Primavera scheduling.',
        topics: [
            'AutoCAD 2D Drafting & Revit 3D Building Information Modeling (BIM)',
            'STAAD.Pro Structural Load Analysis & IS 456 / IS 800 RCC & Steel Codes',
            'Quantity Surveying, Bar Bending Schedules (BBS) & BOQ Costing',
            'Geotechnical Engineering, Total Station Surveying & Project Planning'
        ],
        outcomes: 'Qualify for structural consultancy, infrastructure EPC, and smart-city engineering drives.'
    },
    {
        id: 'aptitude',
        kind: 'aptitude',
        category: 'placement',
        stream: 'Placement & LSRW',
        title: 'Quantitative Aptitude, Logical Reasoning & LSRW',
        semester: 'All Semesters (1 to 8)',
        hours: '90+ Guided Hours',
        assessments: '24 Company Mock Drives + GD/PI Rubrics',
        border: 'border-rose-300 hover:border-rose-400',
        pill: 'bg-rose-50 text-rose-700 border-rose-200',
        accent: '#E11D48',
        summary: 'Mandatory placement foundation for every engineering branch covering speed quantitative aptitude, analytical puzzles, verbal ability, and LSRW fluency.',
        topics: [
            'Quantitative Aptitude: Number Systems, Permutation, Probability & DI',
            'Logical & Analytical Reasoning: Seating, Syllogisms & Cryptarithmetic',
            'LSRW Fluency: Listening, Speaking, Reading & Business Writing',
            'Company-Specific Mock Tests, Resume Clinics, GD & HR/Tech Interviews'
        ],
        outcomes: 'Clear initial aptitude elimination rounds and communicate with clarity in panel interviews.'
    }
];

const CATEGORIES = [
    { id: 'all', label: 'All 9 Tracks' },
    { id: 'cs-ai', label: 'CSE · AI & ML · Software' },
    { id: 'cyber-cloud', label: 'Cyber Security & Cloud' },
    { id: 'ece-eee', label: 'ECE & EEE Core' },
    { id: 'mech-civil', label: 'Mechanical & Civil Core' },
    { id: 'placement', label: 'Aptitude & LSRW' }
];

const TracksPage = () => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTracks = ALL_TRACKS.filter((track) => {
        const matchesCat = activeCategory === 'all' || track.category === activeCategory;
        const q = searchQuery.trim().toLowerCase();
        if (!q) return matchesCat;
        const searchable = `${track.title} ${track.stream} ${track.summary} ${track.topics.join(' ')}`.toLowerCase();
        return matchesCat && searchable.includes(q);
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
                                    {/* <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-xs text-[12px] font-semibold text-slate-700 mb-5">
                                        <Layers className="w-3.5 h-3.5 text-[#004AAD]" />
                                        <span>Multi-Disciplinary Engineering Curriculum</span>
                                    </div> */}
                                </Reveal>

                                <Reveal delay={0.05}>
                                    <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight leading-[1.12] mb-5">
                                        Courses and assessments for{' '}
                                        <span
                                            className="relative inline-block text-[#004AAD] font-semibold text-[1.08em] px-1 tracking-normal"
                                            style={{ fontFamily: "'Dancing Script', 'Courgette', cursive", fontWeight: 600 }}
                                        >
                                            every branch
                                            <DrawUnderline className="absolute left-0 -bottom-2 w-full h-3" color="#004AAD" />
                                        </span>
                                    </h1>
                                </Reveal>

                                <Reveal delay={0.1}>
                                    <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mb-8">
                                        Whether you are in Computer Science, AI & ML, Cyber Security, Cloud, ECE, EEE, Mechanical, or Civil Engineering, your portal dashboard unlocks structured modules, lab sprints, and timed unit tests tailored to your stream.
                                    </p>
                                </Reveal>

                                <Reveal delay={0.15}>
                                    <div className="flex flex-wrap items-center gap-2.5">
                                        {['AI & ML', 'Cyber Security', 'Cloud & DevOps', 'Full-Stack & DSA', 'ECE & VLSI', 'EEE & EV', 'Mechanical CAD/FEA', 'Civil BIM', 'Aptitude & LSRW'].map((tag) => (
                                            <span key={tag} className="px-3 py-1.5 rounded-xl bg-white border border-slate-200/90 text-xs font-semibold text-slate-700 shadow-2xs">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </Reveal>
                            </div>

                            {/* Custom Animated Multi-Branch Engineering SVG */}
                            <div className="lg:col-span-5 flex justify-center">
                                <Reveal delay={0.12}>
                                    <div className="w-full max-w-[430px] rounded-2xl bg-white border-2 border-violet-200 p-4 shadow-sm">
                                        <svg viewBox="0 0 400 270" fill="none" className="w-full h-auto">
                                            <rect width="400" height="270" rx="16" fill="#F8FAFC" />
                                            <circle cx="200" cy="135" r="95" stroke="#E2E8F0" strokeWidth="1.5" strokeDasharray="5 5" />
                                            <circle cx="200" cy="135" r="60" stroke="#BAE6FD" strokeWidth="1.5" />

                                            {/* Center Core Hub */}
                                            <rect x="148" y="103" width="104" height="64" rx="14" fill="#004AAD" />
                                            <text x="200" y="131" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="800" fontFamily="sans-serif">9 STREAM</text>
                                            <text x="200" y="147" textAnchor="middle" fill="#BAE6FD" fontSize="10" fontWeight="700" fontFamily="sans-serif">TRACKS</text>

                                            {/* Node 1: AI / ML */}
                                            <motion.g animate={{ y: [-3, 3, -3] }} transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}>
                                                <rect x="28" y="28" width="98" height="46" rx="10" fill="#FFFFFF" stroke="#C4B5FD" strokeWidth="2" />
                                                <circle cx="48" cy="51" r="10" fill="#EDE9FE" />
                                                <text x="48" y="54" textAnchor="middle" fill="#7C3AED" fontSize="8" fontWeight="800" fontFamily="sans-serif">AI</text>
                                                <text x="64" y="48" fill="#0F172A" fontSize="9.5" fontWeight="700" fontFamily="sans-serif">AI & GenAI</text>
                                                <text x="64" y="60" fill="#64748B" fontSize="8" fontFamily="sans-serif">ML · Deep Learning</text>
                                            </motion.g>

                                            {/* Node 2: Cyber & Cloud */}
                                            <motion.g animate={{ y: [3, -3, 3] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}>
                                                <rect x="274" y="28" width="98" height="46" rx="10" fill="#FFFFFF" stroke="#A7F3D0" strokeWidth="2" />
                                                <circle cx="294" cy="51" r="10" fill="#ECFDF5" />
                                                <text x="294" y="54" textAnchor="middle" fill="#059669" fontSize="8" fontWeight="800" fontFamily="sans-serif">SEC</text>
                                                <text x="310" y="48" fill="#0F172A" fontSize="9.5" fontWeight="700" fontFamily="sans-serif">Cyber & Cloud</text>
                                                <text x="310" y="60" fill="#64748B" fontSize="8" fontFamily="sans-serif">AWS · VAPT · CI/CD</text>
                                            </motion.g>

                                            {/* Node 3: ECE & EEE */}
                                            <motion.g animate={{ y: [-2, 4, -2] }} transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}>
                                                <rect x="28" y="196" width="98" height="46" rx="10" fill="#FFFFFF" stroke="#FDE68A" strokeWidth="2" />
                                                <circle cx="48" cy="219" r="10" fill="#FEF3C7" />
                                                <text x="48" y="222" textAnchor="middle" fill="#D97706" fontSize="8" fontWeight="800" fontFamily="sans-serif">IC</text>
                                                <text x="64" y="216" fill="#0F172A" fontSize="9.5" fontWeight="700" fontFamily="sans-serif">ECE & EEE</text>
                                                <text x="64" y="228" fill="#64748B" fontSize="8" fontFamily="sans-serif">VLSI · IoT · EV BMS</text>
                                            </motion.g>

                                            {/* Node 4: Mech & Civil */}
                                            <motion.g animate={{ y: [3, -4, 3] }} transition={{ duration: 3.1, repeat: Infinity, ease: 'easeInOut' }}>
                                                <rect x="274" y="196" width="98" height="46" rx="10" fill="#FFFFFF" stroke="#99F6E4" strokeWidth="2" />
                                                <circle cx="294" cy="219" r="10" fill="#CCFBF1" />
                                                <text x="294" y="222" textAnchor="middle" fill="#0D9488" fontSize="8" fontWeight="800" fontFamily="sans-serif">CAD</text>
                                                <text x="310" y="216" fill="#0F172A" fontSize="9.5" fontWeight="700" fontFamily="sans-serif">Mech & Civil</text>
                                                <text x="310" y="228" fill="#64748B" fontSize="8" fontFamily="sans-serif">FEA · BIM · STAAD</text>
                                            </motion.g>
                                        </svg>
                                    </div>
                                </Reveal>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════════════════════
                    FILTER BAR & 9 TRACK CARDS
                   ══════════════════════════════════════════════════════════════════ */}
                <section className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Filter & Search Controls */}
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200/80">
                            <div className="flex flex-wrap gap-2">
                                {CATEGORIES.map((cat) => {
                                    const active = activeCategory === cat.id;
                                    return (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            onClick={() => setActiveCategory(cat.id)}
                                            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${active
                                                    ? 'bg-[#004AAD] text-white border-[#004AAD] shadow-xs'
                                                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                                                }`}
                                        >
                                            {cat.label}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="relative w-full lg:w-72">
                                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search syllabus, e.g. VLSI, AWS, BIM..."
                                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#004AAD] focus:outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Track Cards Grid */}
                        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence mode="popLayout">
                                {filteredTracks.map((track) => (
                                    <motion.div
                                        key={track.id}
                                        layout
                                        initial={{ opacity: 0, y: 14 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.96 }}
                                        transition={{ duration: 0.25 }}
                                        className={`rounded-2xl bg-white border-2 ${track.border} p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between`}
                                    >
                                        <div>
                                            {/* Top Row: Icon + Stream Badge */}
                                            <div className="flex items-center justify-between gap-3 mb-4">
                                                <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center shrink-0">
                                                    <TrackIcon kind={track.kind} color={track.accent} />
                                                </div>
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold border ${track.pill}`}>
                                                    {track.stream}
                                                </span>
                                            </div>

                                            {/* Title & Summary */}
                                            <h3 className="text-lg font-bold text-slate-900 leading-snug mb-2">
                                                {track.title}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                                                {track.summary}
                                            </p>

                                            {/* Meta Pills */}
                                            <div className="flex flex-wrap items-center gap-2 mb-4 pb-4 border-b border-slate-100">
                                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                                                    <Clock className="w-3 h-3 text-slate-500" />
                                                    {track.hours}
                                                </span>
                                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                                                    <Award className="w-3 h-3 text-slate-500" />
                                                    {track.assessments}
                                                </span>
                                            </div>

                                            {/* Core Syllabus Bullets */}
                                            <div className="mb-5">
                                                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                                                    Key Modules & Lab Topics
                                                </div>
                                                <ul className="space-y-2">
                                                    {track.topics.map((topic) => (
                                                        <li key={topic} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
                                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                                            <span>{topic}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        {/* Outcome Footer */}
                                        <div className="pt-3.5 border-t border-slate-100">
                                            <div className="text-[11px] font-semibold text-slate-500">
                                                <span className="font-bold text-slate-800">Placement Outcome: </span>
                                                {track.outcomes}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>

                        {filteredTracks.length === 0 && (
                            <div className="text-center py-12 rounded-2xl bg-slate-50 border border-slate-200">
                                <p className="text-sm font-semibold text-slate-700 mb-2">No tracks matched your search filter.</p>
                                <button
                                    type="button"
                                    onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
                                    className="text-xs font-bold text-[#004AAD] hover:underline cursor-pointer"
                                >
                                    Reset filters to view all 9 engineering tracks
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════════════════════
                    ASSESSMENT FORMAT SECTION & CTA
                   ══════════════════════════════════════════════════════════════════ */}
                <section className="py-16 sm:py-20 bg-[#F8FAFC]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="rounded-3xl bg-white border-2 border-sky-200 p-6 sm:p-10 shadow-xs">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                                <div className="lg:col-span-7">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs font-bold text-sky-800 mb-3">
                                        <Sparkles className="w-3.5 h-3.5" />
                                        <span>Assigned Automatically by Batch</span>
                                    </div>
                                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-3">
                                        Your college batch schedule maps directly to your portal
                                    </h2>
                                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
                                        You do not need to enroll manually in individual courses. As soon as you sign in with your college USN, the portal loads the exact tracks, unit assessments, and placement mock drives mapped to your department and semester.
                                    </p>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <Link
                                            to="/#login"
                                            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#004AAD] hover:bg-[#003882] text-white text-sm font-semibold shadow-xs transition-all"
                                        >
                                            <span>Sign in to view your assigned tracks</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                        <Link
                                            to="/how-it-works"
                                            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 text-sm font-semibold transition-all"
                                        >
                                            <span>See how assessments work</span>
                                        </Link>
                                    </div>
                                </div>

                                <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                    <div className="rounded-2xl bg-slate-50 border border-sky-200 p-4">
                                        <div className="text-xs font-bold text-[#004AAD] mb-1">Unit Assessments</div>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            20 to 30 minute proctored quizzes at the end of every classroom module to verify concept mastery.
                                        </p>
                                    </div>
                                    <div className="rounded-2xl bg-slate-50 border border-violet-200 p-4">
                                        <div className="text-xs font-bold text-violet-700 mb-1">Domain Lab Sprints</div>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            Hands-on coding, circuit simulation, CAD/BIM, or security lab checkpoints graded with trainer feedback.
                                        </p>
                                    </div>
                                    <div className="rounded-2xl bg-slate-50 border border-emerald-200 p-4">
                                        <div className="text-xs font-bold text-emerald-700 mb-1">Company Mock Drives</div>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            Full-length placement simulations combining aptitude, verbal ability, and branch-specific technical sections.
                                        </p>
                                    </div>
                                    <div className="rounded-2xl bg-slate-50 border border-amber-200 p-4">
                                        <div className="text-xs font-bold text-amber-800 mb-1">Topic Wise Analytics</div>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            Instant scorecards highlighting strong modules and topics that need revision before campus interviews.
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

export default TracksPage;
