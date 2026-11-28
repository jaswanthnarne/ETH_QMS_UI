import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code2, GraduationCap, ShieldCheck, Briefcase, Sparkles, Users } from 'lucide-react';
import PublicLayout from '../../layouts/PublicLayout';
import TeamLanyardRail from '@/components/ui/team-lanyard-rail';

export const LMS_TEAM_MEMBERS = [
    {
        id: 'jaswanth',
        name: 'Jaswanth Narne',
        role: 'Lead Architect & Dev Team',
        team: 'Ethnotech · Core LMS',
        tone: 1,
        image: '/assets/team/jaswanth-narne.jpg',
        bio: 'Leads the full-stack platform architecture, real-time exam engine, and in-browser compiler sandboxes.',
        tags: ['Lead Architect', 'Dev Team', 'Core LMS'],
        links: [
            { label: 'Email', href: 'mailto:info@ethnotech.in' },
            { label: 'Portal', href: '/#login' },
        ],
    },
    {
        id: 'sandeep',
        name: 'Sandeep P S',
        role: 'Dev Team',
        team: 'Ethnotech · Engineering',
        tone: 2,
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        bio: 'Builds core LMS modules, interactive dashboards, analytics pipelines, and seamless assessment workflows.',
        tags: ['Full-Stack', 'Dev Team', 'LMS'],
        links: [
            { label: 'Email', href: 'mailto:info@ethnotech.in' },
            { label: 'Features', href: '/features' },
        ],
    },
    {
        id: 'bheemesh',
        name: 'Mr. Bheemesh',
        role: 'Associate Vice President (AVP)',
        team: 'Ethnotech · Leadership',
        tone: 4,
        image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
        bio: 'Spearheads institutional partnerships, strategic academic initiatives, and enterprise campus rollouts.',
        tags: ['AVP', 'Strategy', 'Leadership'],
        links: [
            { label: 'Email', href: 'mailto:info@ethnotech.in' },
            { label: 'Campus', href: '/campus-life' },
        ],
    },
    {
        id: 'vikas',
        name: 'Mr. Vikas',
        role: 'Project Manager',
        team: 'Ethnotech · Delivery',
        tone: 3,
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
        bio: 'Oversees project milestones, multi-college training schedules, and quality assurance across all active cohorts.',
        tags: ['Project Mgmt', 'Operations', 'Delivery'],
        links: [
            { label: 'Email', href: 'mailto:info@ethnotech.in' },
            { label: 'How it works', href: '/how-it-works' },
        ],
    },
    {
        id: 'karthik',
        name: 'Mr. Karthik',
        role: 'SPOC',
        team: 'Ethnotech · Curriculum & LMS',
        tone: 5,
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
        bio: 'Single Point of Contact for LMS course mapping, batch study materials, and college-level assessment coordination.',
        tags: ['SPOC', 'Course Mapping', 'Materials'],
        links: [
            { label: 'Email', href: 'mailto:info@ethnotech.in' },
            { label: 'Tracks', href: '/tracks' },
        ],
    },
    {
        id: 'ananya',
        name: 'Ananya Rao',
        role: 'Technical Training Lead',
        team: 'Ethnotech · Code2Career',
        tone: 1,
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        bio: 'Curates company-specific coding problem banks and mentors students for product and service placement rounds.',
        tags: ['DSA & Coding', 'Mentorship', 'Mock Drives'],
        links: [
            { label: 'Email', href: 'mailto:info@ethnotech.in' },
            { label: 'Features', href: '/features' },
        ],
    },
    {
        id: 'meera',
        name: 'Meera Krishnan',
        role: 'Placement Relations Lead',
        team: 'Ethnotech · Placements',
        tone: 3,
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
        bio: 'Connects verified student skill profiles and assessment scorecards directly with hiring partners.',
        tags: ['Placements', 'Corporate', 'Careers'],
        links: [
            { label: 'Email', href: 'mailto:info@ethnotech.in' },
            { label: 'Portal', href: '/#login' },
        ],
    },
    {
        id: 'rohan',
        name: 'Rohan Kulkarni',
        role: 'QA & Assessment Support',
        team: 'Ethnotech · Support',
        tone: 2,
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        bio: 'Monitors live exam sessions, proctoring uptime, and rapid resolution for partner college computer labs.',
        tags: ['Live Support', 'Proctoring', 'QA'],
        links: [
            { label: 'Email', href: 'mailto:info@ethnotech.in' },
            { label: 'FAQ', href: '/faq' },
        ],
    },
];

const TEAM_PILLARS = [
    {
        icon: Code2,
        badge: 'Platform Engineering',
        title: 'Built for zero-lag campus scale',
        desc: 'Our engineering squad maintains the real-time WebSocket waiting rooms, in-browser Python & JS compilers, and anti-cheating exam engine.',
    },
    {
        icon: GraduationCap,
        badge: 'Curriculum & SPOC Guild',
        title: 'Industry-mapped courses & problem banks',
        desc: 'Subject matter experts design structured modules and curate authentic coding & aptitude questions asked by top recruiters.',
    },
    {
        icon: ShieldCheck,
        badge: 'On-Campus Faculty',
        title: 'Hands-on mentorship inside your college',
        desc: 'Dedicated trainers conduct daily lab sessions, track attendance, upload batch study materials, and review your progress.',
    },
    {
        icon: Briefcase,
        badge: 'Placement Cell',
        title: 'Connecting top performers to hiring drives',
        desc: 'Our corporate relations team maps student skill profiles, verified certificates, and coding scores directly to placement opportunities.',
    },
];

const TeamPage = () => {
    return (
        <PublicLayout>
            <div className="bg-white text-slate-900 pt-16 overflow-x-hidden">
                {/* Top Hero Header */}
                <section className="relative bg-gradient-to-b from-slate-50 via-white to-white border-b border-slate-200/80 pt-10 pb-4">
                    <div className="max-w-6xl mx-auto px-5 lg:px-6 text-center">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-[#004AAD] text-xs font-semibold">
                            <Users size={14} />
                            Ethnotech Academy · LMS Core Team
                        </div>
                    </div>

                    {/* Interactive 3D Physics Lanyard Rail Component */}
                    <div className="max-w-6xl mx-auto">
                        <TeamLanyardRail
                            items={LMS_TEAM_MEMBERS}
                            eyebrow="Meet the LMS Team · Interactive ID Rail"
                            heading="The engineers, mentors & educators behind your learning portal."
                            caption="Brush along the rail to swing a badge, pull a lanyard down, or click any ID card to flip it over."
                            autoplay={true}
                            action={
                                <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                                    <Link
                                        to="/#login"
                                        className="inline-flex items-center gap-2 rounded-full bg-[#004AAD] hover:bg-[#003882] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-px"
                                    >
                                        <span aria-hidden="true" className="size-1.5 rounded-full bg-emerald-400" />
                                        Enter Student Portal
                                        <ArrowRight size={15} />
                                    </Link>
                                    <Link
                                        to="/features"
                                        className="inline-flex items-center gap-2 rounded-full bg-white hover:bg-slate-50 border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all"
                                    >
                                        <Sparkles size={15} className="text-[#004AAD]" />
                                        Explore Platform Features
                                    </Link>
                                </div>
                            }
                        />
                    </div>
                </section>

                {/* Team Pillars Section */}
                <section className="py-16 lg:py-20 bg-slate-50/70">
                    <div className="max-w-6xl mx-auto px-5 lg:px-6 space-y-10">
                        <div className="max-w-2xl mx-auto text-center space-y-3">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#004AAD]">
                                How Our Team Works Together
                            </p>
                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                                Four specialized teams powering every student batch
                            </h2>
                            <p className="text-sm sm:text-base text-slate-600">
                                From writing compiler test cases to conducting live classroom sessions across partner campuses, every feature in the LMS is built and supported in-house.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                            {TEAM_PILLARS.map((pillar) => {
                                const Icon = pillar.icon;
                                return (
                                    <div
                                        key={pillar.title}
                                        className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between gap-4"
                                    >
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 text-[#004AAD] flex items-center justify-center">
                                                    <Icon size={20} />
                                                </div>
                                                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                                                    {pillar.badge}
                                                </span>
                                            </div>
                                            <h3 className="text-base font-bold text-slate-900 leading-snug">
                                                {pillar.title}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                                {pillar.desc}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </div>
        </PublicLayout>
    );
};

export default TeamPage;

