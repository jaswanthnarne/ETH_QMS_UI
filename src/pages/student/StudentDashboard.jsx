import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    BookOpen,
    Clock,
    Award,
    FileText,
    Key,
    Shield,
    Upload,
    CheckCircle,
    User,
    Lock,
    Eye,
    EyeOff,
    Briefcase,
    MapPin,
    DollarSign,
    Loader2,
    ArrowRight,
    AlertCircle,
    Download,
    Trash2,
    Star,
    AlertTriangle,
    CalendarCheck,
    Trophy,
    Terminal,
    Building2
} from 'lucide-react';
import axios from 'axios';
import { AlertModal } from '../../components/Modals';
import StudentGamesTab from '../../components/student/StudentGamesTab';
import StudentTypeSpeedTab from '../../components/student/StudentTypeSpeedTab';
import StudentLockedInLabTab from '../../components/student/StudentLockedInLabTab';
import StudentStudyMaterialTab from '../../components/student/StudentStudyMaterialTab';
import useStudentAuthStore from '../../store/studentAuthStore';
import { motion, AnimatePresence } from 'framer-motion';

const api = axios.create({
    baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:5000/api')
});

const StudentBannerSvg = ({ activeTab, profileSubTab, compact = false }) => {
    const key = activeTab === 'profile' ? `profile-${profileSubTab}` : activeTab;
    const sizeClass = compact ? 'w-40 lg:w-48 shrink-0 hidden md:block' : 'w-52 lg:w-60 shrink-0 hidden md:block';
    const wideSizeClass = compact ? 'w-44 lg:w-52 shrink-0 hidden md:block' : 'w-56 lg:w-64 shrink-0 hidden md:block';
    const arenaSizeClass = compact ? 'w-48 lg:w-56 shrink-0 hidden md:block' : 'w-60 lg:w-68 shrink-0 hidden md:block';

    switch (key) {
        case 'dashboard':
            // Cartoon Student Command Center with Analytics Board, Trophy & Rocket
            return (
                <svg viewBox="0 0 230 135" className={sizeClass} aria-hidden="true">
                    <ellipse cx="115" cy="118" rx="92" ry="10" fill="#0F172A" fillOpacity="0.18" />
                    {/* Cartoon Analytics Board on Left */}
                    <rect x="20" y="24" width="88" height="68" rx="10" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2.2" />
                    <rect x="20" y="24" width="88" height="16" rx="8" fill="#38BDF8" stroke="#1E293B" strokeWidth="2.2" />
                    <circle cx="31" cy="32" r="2.5" fill="#F43F5E" />
                    <circle cx="40" cy="32" r="2.5" fill="#FACC15" />
                    <circle cx="49" cy="32" r="2.5" fill="#34D399" />
                    {/* Rising Cartoon Bar Chart */}
                    <rect x="32" y="68" width="12" height="14" rx="2" fill="#BAE6FD" stroke="#1E293B" strokeWidth="1.6" />
                    <rect x="50" y="58" width="12" height="24" rx="2" fill="#38BDF8" stroke="#1E293B" strokeWidth="1.6" />
                    <rect x="68" y="48" width="12" height="34" rx="2" fill="#34D399" stroke="#1E293B" strokeWidth="1.6" />
                    <rect x="86" y="42" width="12" height="40" rx="2" fill="#FACC15" stroke="#1E293B" strokeWidth="1.6" />
                    {/* Cheerful Cartoon Student on Right */}
                    <path d="M118 114 C118 88, 176 88, 176 114 Z" fill="#F59E0B" stroke="#1E293B" strokeWidth="2.2" />
                    <circle cx="147" cy="58" r="20" fill="#FDE68A" stroke="#1E293B" strokeWidth="2.2" />
                    <path d="M127 52 C130 34, 164 34, 167 52 C158 44, 136 44, 127 52 Z" fill="#1E293B" />
                    <circle cx="140" cy="58" r="2.2" fill="#1E293B" />
                    <circle cx="154" cy="58" r="2.2" fill="#1E293B" />
                    <path d="M141 66 Q147 72 153 66" stroke="#1E293B" strokeWidth="2" fill="none" strokeLinecap="round" />
                    {/* Mini Cartoon Rocket on Far Right */}
                    <g transform="rotate(15 198 54)">
                        <path d="M198 22 C208 36, 208 60, 198 72 C188 60, 188 36, 198 22 Z" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
                        <path d="M198 22 C203 30, 203 36, 198 36 C193 36, 193 30, 198 22 Z" fill="#F43F5E" stroke="#1E293B" strokeWidth="1.8" />
                        <circle cx="198" cy="48" r="5" fill="#38BDF8" stroke="#1E293B" strokeWidth="1.6" />
                        <path d="M193 72 Q198 84 203 72 Z" fill="#FACC15" stroke="#1E293B" strokeWidth="1.5" />
                    </g>
                    <line x1="16" y1="114" x2="214" y2="114" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
            );

        case 'meta-batch':
            // Cartoon Classroom Cohort with Blackboard, Trainer & Student Group
            return (
                <svg viewBox="0 0 230 135" className={sizeClass} aria-hidden="true">
                    <ellipse cx="115" cy="118" rx="92" ry="10" fill="#0F172A" fillOpacity="0.18" />
                    {/* Cartoon Classroom Chalkboard */}
                    <rect x="20" y="20" width="110" height="66" rx="8" fill="#065F46" stroke="#1E293B" strokeWidth="2.2" />
                    <rect x="16" y="82" width="118" height="6" rx="3" fill="#D97706" stroke="#1E293B" strokeWidth="2" />
                    <text x="75" y="42" textAnchor="middle" fontSize="9.5" fontWeight="900" fill="#FDE047">META BATCH</text>
                    <text x="75" y="56" textAnchor="middle" fontSize="7.2" fontWeight="800" fill="#A7F3D0">WHO ACTUALLY STUDIED?</text>
                    <line x1="36" y1="68" x2="112" y2="68" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="6 4" />
                    {/* 3 Cartoon Batchmates */}
                    {[
                        { cx: 146, shirt: '#38BDF8' },
                        { cx: 174, shirt: '#F59E0B' },
                        { cx: 200, shirt: '#A78BFA' }
                    ].map((m, idx) => (
                        <g key={idx}>
                            <path d={`M${m.cx - 18} 114 C${m.cx - 18} 92, ${m.cx + 18} 92, ${m.cx + 18} 114 Z`} fill={m.shirt} stroke="#1E293B" strokeWidth="2" />
                            <circle cx={m.cx} cy="72" r="13" fill="#FDE68A" stroke="#1E293B" strokeWidth="2" />
                            <path d={`M${m.cx - 13} 68 C${m.cx - 10} 56, ${m.cx + 10} 56, ${m.cx + 13} 68 Z`} fill="#1E293B" />
                            <circle cx={m.cx - 4} cy="72" r="1.5" fill="#1E293B" />
                            <circle cx={m.cx + 4} cy="72" r="1.5" fill="#1E293B" />
                            <path d={`M${m.cx - 4} 77 Q${m.cx} 80 ${m.cx + 4} 77`} stroke="#1E293B" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                        </g>
                    ))}
                    <line x1="14" y1="114" x2="218" y2="114" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
            );

        case 'enter-exam':
            // Cartoon Student with Glasses & Headphones at Laptop Desk
            return (
                <svg viewBox="0 0 230 135" className={sizeClass} aria-hidden="true">
                    {/* Soft backdrop cloud */}
                    <ellipse cx="115" cy="118" rx="92" ry="10" fill="#0F172A" fillOpacity="0.18" />
                    <circle cx="115" cy="66" r="52" fill="#FFFFFF" fillOpacity="0.14" />
                    {/* Stack of Books on Left */}
                    <rect x="20" y="96" width="38" height="10" rx="3" fill="#F43F5E" stroke="#1E293B" strokeWidth="2" />
                    <rect x="23" y="99" width="32" height="4" fill="#FFFFFF" />
                    <rect x="24" y="86" width="34" height="10" rx="3" fill="#F59E0B" stroke="#1E293B" strokeWidth="2" />
                    {/* Cartoon Student Character */}
                    {/* Shoulders / Hoodie */}
                    <path d="M74 112 C74 88, 136 88, 136 112 Z" fill="#38BDF8" stroke="#1E293B" strokeWidth="2.2" strokeLinejoin="round" />
                    <path d="M95 92 L105 104 L115 92" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.8" strokeLinejoin="round" />
                    {/* Headphone Arc */}
                    <path d="M81 56 C81 32, 129 32, 129 56" stroke="#1E293B" strokeWidth="4" fill="none" strokeLinecap="round" />
                    <rect x="76" y="50" width="8" height="16" rx="4" fill="#F59E0B" stroke="#1E293B" strokeWidth="2" />
                    <rect x="126" y="50" width="8" height="16" rx="4" fill="#F59E0B" stroke="#1E293B" strokeWidth="2" />
                    {/* Face */}
                    <circle cx="105" cy="58" r="22" fill="#FDE68A" stroke="#1E293B" strokeWidth="2.2" />
                    {/* Hair */}
                    <path d="M83 52 C85 35, 125 35, 127 52 C120 44, 92 44, 83 52 Z" fill="#1E293B" />
                    {/* Glasses */}
                    <circle cx="97" cy="57" r="6" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
                    <circle cx="113" cy="57" r="6" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
                    <line x1="103" y1="57" x2="107" y2="57" stroke="#1E293B" strokeWidth="2" />
                    <circle cx="97" cy="57" r="2" fill="#1E293B" />
                    <circle cx="113" cy="57" r="2" fill="#1E293B" />
                    {/* Smile */}
                    <path d="M99 67 Q105 72 111 67" stroke="#1E293B" strokeWidth="2" fill="none" strokeLinecap="round" />
                    {/* Cartoon Laptop in Front */}
                    <rect x="116" y="76" width="58" height="36" rx="6" fill="#E2E8F0" stroke="#1E293B" strokeWidth="2.2" />
                    <circle cx="145" cy="94" r="5" fill="#38BDF8" stroke="#1E293B" strokeWidth="1.5" />
                    <rect x="108" y="110" width="74" height="6" rx="3" fill="#94A3B8" stroke="#1E293B" strokeWidth="2" />
                    {/* Coffee Mug */}
                    <rect x="188" y="94" width="18" height="20" rx="4" fill="#FEF3C7" stroke="#1E293B" strokeWidth="2" />
                    <path d="M206 98 h4 a4 4 0 0 1 0 8 h-4" stroke="#1E293B" strokeWidth="2" fill="none" />
                    <path d="M194 88 Q192 83 196 80 M200 88 Q198 83 202 80" stroke="#FFFFFF" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                    {/* Speech Bubble */}
                    <rect x="136" y="18" width="76" height="28" rx="10" fill="#FEF3C7" stroke="#1E293B" strokeWidth="2" />
                    <path d="M154 46 L146 54 L162 46 Z" fill="#FEF3C7" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
                    <text x="174" y="36" textAnchor="middle" fontSize="9.2" fontWeight="900" fill="#B45309">NO CHATGPT?!</text>
                    {/* Desk Line */}
                    <line x1="14" y1="116" x2="216" y2="116" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
            );

        case 'exam-history':
            // Cartoon Student Celebrating with Giant Golden Trophy & Medal
            return (
                <svg viewBox="0 0 230 135" className={sizeClass} aria-hidden="true">
                    <ellipse cx="115" cy="118" rx="92" ry="10" fill="#0F172A" fillOpacity="0.18" />
                    {/* Sparkle Stars */}
                    <path d="M34 32 l3 6 6 1-4.5 4 1 6-5.5-3-5.5 3 1-6-4.5-4 6-1z" fill="#FDE047" stroke="#1E293B" strokeWidth="1.5" />
                    <path d="M196 28 l2.5 5 5 1-3.5 3.5 1 5-5-2.5-5 2.5 1-5-3.5-3.5 5-1z" fill="#FDE047" stroke="#1E293B" strokeWidth="1.5" />
                    {/* Cheerful Cartoon Student */}
                    <path d="M54 114 C54 88, 112 88, 112 114 Z" fill="#A78BFA" stroke="#1E293B" strokeWidth="2.2" />
                    {/* Gold Medal Ribbon on Chest */}
                    <path d="M75 90 L83 104 L91 90" stroke="#EF4444" strokeWidth="3" fill="none" />
                    <circle cx="83" cy="106" r="5" fill="#FACC15" stroke="#1E293B" strokeWidth="1.6" />
                    {/* Head */}
                    <circle cx="83" cy="58" r="21" fill="#FDE68A" stroke="#1E293B" strokeWidth="2.2" />
                    <path d="M62 52 C65 34, 102 34, 104 52 C96 44, 70 44, 62 52 Z" fill="#1E293B" />
                    <circle cx="76" cy="56" r="2.2" fill="#1E293B" />
                    <circle cx="90" cy="56" r="2.2" fill="#1E293B" />
                    <path d="M76 64 Q83 71 90 64 Z" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.8" />
                    {/* Giant Cartoon Golden Trophy on Podium */}
                    <rect x="122" y="92" width="72" height="24" rx="4" fill="#E0F2FE" stroke="#1E293B" strokeWidth="2.2" />
                    <text x="158" y="107.5" textAnchor="middle" fontSize="9.2" fontWeight="900" fill="#0369A1">GUESSED "C" ★</text>
                    <path d="M140 42 h36 v20 c0 11-8 20-18 20 s-18-9-18-20 V42 z" fill="#FACC15" stroke="#1E293B" strokeWidth="2.2" />
                    <path d="M140 48 h-8 a6 6 0 0 0 0 12 h8 M176 48 h8 a6 6 0 0 1 0 12 h-8" stroke="#1E293B" strokeWidth="2.2" fill="none" />
                    <rect x="153" y="82" width="10" height="10" fill="#F59E0B" stroke="#1E293B" strokeWidth="2" />
                    <path d="M158 50 l2.5 5 5.5.8-4 3.8 1 5.4-5-2.6-5 2.6 1-5.4-4-3.8 5.5-.8z" fill="#FFFFFF" />
                    <line x1="20" y1="116" x2="210" y2="116" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
            );

        case 'profile-personal':
        case 'profile-academic':
        case 'profile-skills':
        case 'profile-resume':
        case 'profile-preferences':
            // Cartoon Student with Graduation Cap & Stylized ID Card
            return (
                <svg viewBox="0 0 230 135" className={sizeClass} aria-hidden="true">
                    <ellipse cx="115" cy="118" rx="92" ry="10" fill="#0F172A" fillOpacity="0.18" />
                    {/* Stylized Giant Cartoon ID Card */}
                    <rect x="104" y="24" width="104" height="86" rx="14" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2.2" />
                    <rect x="104" y="24" width="104" height="20" rx="12" fill="#38BDF8" stroke="#1E293B" strokeWidth="2.2" />
                    <circle cx="130" cy="66" r="13" fill="#FEF3C7" stroke="#1E293B" strokeWidth="1.8" />
                    <circle cx="130" cy="63" r="4.5" fill="#F59E0B" />
                    <path d="M121 75 c2-5 6-7 9-7 s7 2 9 7" fill="#F59E0B" />
                    <rect x="150" y="54" width="44" height="7" rx="3.5" fill="#1E293B" />
                    <rect x="150" y="66" width="34" height="6" rx="3" fill="#38BDF8" />
                    <rect x="150" y="77" width="40" height="6" rx="3" fill="#94A3B8" />
                    <rect x="118" y="91" width="76" height="12" rx="6" fill="#DCFCE7" stroke="#10B981" strokeWidth="1.5" />
                    <text x="156" y="99.5" textAnchor="middle" fontSize="7" fontWeight="900" fill="#047857">HIRE ME PLS ★</text>
                    {/* Cartoon Student Waving on Left */}
                    <path d="M36 114 C36 88, 94 88, 94 114 Z" fill="#34D399" stroke="#1E293B" strokeWidth="2.2" />
                    <circle cx="65" cy="62" r="20" fill="#FDE68A" stroke="#1E293B" strokeWidth="2.2" />
                    {/* Graduation Mortarboard Cap */}
                    <polygon points="35,44 65,30 95,44 65,56" fill="#1E293B" stroke="#1E293B" strokeWidth="1.8" strokeLinejoin="round" />
                    <line x1="88" y1="46" x2="88" y2="62" stroke="#FACC15" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx="88" cy="63" r="3" fill="#FACC15" />
                    {/* Eyes & Smile */}
                    <circle cx="58" cy="62" r="2.2" fill="#1E293B" />
                    <circle cx="72" cy="62" r="2.2" fill="#1E293B" />
                    <path d="M59 70 Q65 75 71 70" stroke="#1E293B" strokeWidth="2" fill="none" strokeLinecap="round" />
                    <line x1="20" y1="114" x2="214" y2="114" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
            );

        case 'placement':
            // Cartoon Graduate with Briefcase, Tie & "HIRED" Offer Letter
            return (
                <svg viewBox="0 0 230 135" className={sizeClass} aria-hidden="true">
                    <ellipse cx="115" cy="118" rx="92" ry="10" fill="#0F172A" fillOpacity="0.18" />
                    {/* Cartoon Character in Smart Blazer & Tie */}
                    <path d="M40 114 C40 86, 100 86, 100 114 Z" fill="#1E293B" stroke="#1E293B" strokeWidth="2.2" />
                    <polygon points="62,88 78,88 70,114" fill="#FFFFFF" />
                    <polygon points="68,90 72,90 73,108 70,112 67,108" fill="#EF4444" />
                    <circle cx="70" cy="56" r="20" fill="#FDE68A" stroke="#1E293B" strokeWidth="2.2" />
                    <path d="M50 50 C52 33, 88 33, 90 50 C82 42, 58 42, 50 50 Z" fill="#1E293B" />
                    <circle cx="63" cy="56" r="2.2" fill="#1E293B" />
                    <circle cx="77" cy="56" r="2.2" fill="#1E293B" />
                    <path d="M64 64 Q70 69 76 64" stroke="#1E293B" strokeWidth="2" fill="none" strokeLinecap="round" />
                    {/* Cartoon Briefcase & Offer Envelope */}
                    <rect x="116" y="64" width="66" height="48" rx="8" fill="#D97706" stroke="#1E293B" strokeWidth="2.2" />
                    <path d="M136 64 v-8 a6 6 0 0 1 6 -6 h14 a6 6 0 0 1 6 6 v8" stroke="#1E293B" strokeWidth="2.5" fill="none" />
                    <rect x="116" y="82" width="66" height="6" fill="#B45309" stroke="#1E293B" strokeWidth="1.8" />
                    <rect x="143" y="79" width="12" height="12" rx="3" fill="#FACC15" stroke="#1E293B" strokeWidth="2" />
                    {/* Offer Badge */}
                    <rect x="122" y="20" width="88" height="30" rx="10" fill="#FEF3C7" stroke="#1E293B" strokeWidth="2" />
                    <text x="166" y="38.5" textAnchor="middle" fontSize="8.8" fontWeight="900" fill="#B45309">CGPA 8.0+ PLS</text>
                    <line x1="20" y1="114" x2="210" y2="114" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
            );

        case 'attendance':
            // Cartoon Student Raising Hand Next to Classroom Calendar
            return (
                <svg viewBox="0 0 230 135" className={sizeClass} aria-hidden="true">
                    <ellipse cx="115" cy="118" rx="92" ry="10" fill="#0F172A" fillOpacity="0.18" />
                    {/* Cartoon Flip Calendar */}
                    <rect x="114" y="26" width="90" height="86" rx="12" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2.2" />
                    <rect x="114" y="26" width="90" height="22" rx="10" fill="#F43F5E" stroke="#1E293B" strokeWidth="2.2" />
                    <text x="159" y="41" textAnchor="middle" fontSize="8" fontWeight="900" fill="#FFFFFF">75.01% SAFE</text>
                    <rect x="132" y="18" width="8" height="14" rx="4" fill="#CBD5E1" stroke="#1E293B" strokeWidth="2" />
                    <rect x="178" y="18" width="8" height="14" rx="4" fill="#CBD5E1" stroke="#1E293B" strokeWidth="2" />
                    <circle cx="159" cy="76" r="20" fill="#DCFCE7" stroke="#10B981" strokeWidth="2.2" />
                    <path d="M150 76 l6 6 13-13" stroke="#059669" strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    {/* Cartoon Student Raising Hand */}
                    <path d="M34 114 C34 88, 92 88, 92 114 Z" fill="#F59E0B" stroke="#1E293B" strokeWidth="2.2" />
                    {/* Raised Hand */}
                    <path d="M84 94 Q102 64 96 40" stroke="#FDE68A" strokeWidth="10" fill="none" strokeLinecap="round" />
                    <path d="M84 94 Q102 64 96 40" stroke="#1E293B" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                    <circle cx="63" cy="60" r="20" fill="#FDE68A" stroke="#1E293B" strokeWidth="2.2" />
                    <path d="M43 54 C46 36, 80 36, 83 54 C75 46, 51 46, 43 54 Z" fill="#1E293B" />
                    <circle cx="56" cy="60" r="2.2" fill="#1E293B" />
                    <circle cx="70" cy="60" r="2.2" fill="#1E293B" />
                    <path d="M57 68 Q63 74 69 68" stroke="#1E293B" strokeWidth="2" fill="none" strokeLinecap="round" />
                    <line x1="18" y1="114" x2="212" y2="114" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
            );

        case 'todo':
            // Cartoon Clipboard, Giant Pencil & Twin-Bell Alarm Clock
            return (
                <svg viewBox="0 0 230 135" className={sizeClass} aria-hidden="true">
                    <ellipse cx="115" cy="118" rx="92" ry="10" fill="#0F172A" fillOpacity="0.18" />
                    {/* Cartoon Clipboard */}
                    <rect x="34" y="20" width="76" height="94" rx="10" fill="#FDE68A" stroke="#1E293B" strokeWidth="2.2" />
                    <rect x="42" y="30" width="60" height="76" rx="6" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.8" />
                    <rect x="56" y="14" width="32" height="12" rx="4" fill="#94A3B8" stroke="#1E293B" strokeWidth="2" />
                    {/* Checkboxes */}
                    <rect x="50" y="42" width="12" height="12" rx="3" fill="#DCFCE7" stroke="#10B981" strokeWidth="2" />
                    <path d="M52 48 l3 3 5-5" stroke="#059669" strokeWidth="2" fill="none" strokeLinecap="round" />
                    <rect x="68" y="45" width="26" height="6" rx="3" fill="#1E293B" />
                    <rect x="50" y="62" width="12" height="12" rx="3" fill="#DCFCE7" stroke="#10B981" strokeWidth="2" />
                    <path d="M52 68 l3 3 5-5" stroke="#059669" strokeWidth="2" fill="none" strokeLinecap="round" />
                    <rect x="68" y="65" width="22" height="6" rx="3" fill="#1E293B" />
                    <rect x="50" y="82" width="12" height="12" rx="3" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" />
                    <rect x="68" y="85" width="24" height="6" rx="3" fill="#94A3B8" />
                    {/* Sarcastic Sticky Note on Alarm Clock */}
                    <rect x="142" y="16" width="70" height="20" rx="6" fill="#FEE2E2" stroke="#1E293B" strokeWidth="1.8" />
                    <text x="177" y="29" textAnchor="middle" fontSize="7.5" fontWeight="900" fill="#B91C1C">DUE: YESTERDAY</text>
                    {/* Twin-Bell Cartoon Alarm Clock */}
                    <circle cx="164" cy="78" r="28" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2.2" />
                    <circle cx="164" cy="78" r="22" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="1.5" />
                    <path d="M142 50 a10 10 0 0 1 14 -6 Z" fill="#F59E0B" stroke="#1E293B" strokeWidth="2" />
                    <path d="M186 50 a10 10 0 0 0 -14 -6 Z" fill="#F59E0B" stroke="#1E293B" strokeWidth="2" />
                    <path d="M164 66 v12 l9 6" stroke="#1E293B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    {/* Giant Cartoon Pencil */}
                    <g transform="rotate(22 130 62)">
                        <rect x="120" y="24" width="12" height="54" fill="#FACC15" stroke="#1E293B" strokeWidth="2" />
                        <rect x="120" y="14" width="12" height="10" rx="2" fill="#F43F5E" stroke="#1E293B" strokeWidth="2" />
                        <polygon points="120,78 132,78 126,92" fill="#FDE68A" stroke="#1E293B" strokeWidth="2" />
                        <polygon points="124,87 128,87 126,92" fill="#1E293B" />
                    </g>
                    <line x1="20" y1="114" x2="210" y2="114" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
            );

        case 'security':
            // Cartoon Smiling Padlock Mascot, Shield & Golden Key
            return (
                <svg viewBox="0 0 230 135" className={sizeClass} aria-hidden="true">
                    <ellipse cx="115" cy="118" rx="92" ry="10" fill="#0F172A" fillOpacity="0.18" />
                    {/* Cartoon Shield Behind */}
                    <path d="M74 20 L118 34 V68 C118 92 98 108 74 114 C50 108 30 92 30 68 V34 Z" fill="#38BDF8" stroke="#1E293B" strokeWidth="2.2" strokeLinejoin="round" />
                    <path d="M74 30 L108 41 V66 C108 85 92 98 74 103 C56 98 40 85 40 66 V41 Z" fill="#E0F2FE" stroke="#1E293B" strokeWidth="1.8" />
                    <path d="M62 66 l8 8 18-18" stroke="#0284C7" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    {/* Cute Smiling Cartoon Padlock Character */}
                    <path d="M138 56 v-14 a16 16 0 0 1 32 0 v14" stroke="#E2E8F0" strokeWidth="7" fill="none" />
                    <path d="M138 56 v-14 a16 16 0 0 1 32 0 v14" stroke="#1E293B" strokeWidth="2.2" fill="none" />
                    <rect x="126" y="54" width="56" height="54" rx="14" fill="#FACC15" stroke="#1E293B" strokeWidth="2.2" />
                    <circle cx="144" cy="74" r="2.8" fill="#1E293B" />
                    <circle cx="164" cy="74" r="2.8" fill="#1E293B" />
                    <path d="M147 84 Q154 90 161 84" stroke="#1E293B" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                    <rect x="128" y="96" width="52" height="14" rx="5" fill="#1E293B" />
                    <text x="154" y="105.5" textAnchor="middle" fontSize="7" fontWeight="900" fill="#FDE047">NOT 123456</text>
                    <line x1="20" y1="114" x2="210" y2="114" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
            );

        case 'games':
            // Cartoon Student Player, Puzzle Cube & Gen-Z "My Brain Is Not Braining" Speech Bubble
            return (
                <svg viewBox="0 0 255 135" className={wideSizeClass} aria-hidden="true">
                    <ellipse cx="126" cy="118" rx="102" ry="10" fill="#0F172A" fillOpacity="0.18" />
                    {/* Cartoon Golden Crown Above Student */}
                    <polygon points="50,30 58,18 66,27 74,16 82,30" fill="#FACC15" stroke="#1E293B" strokeWidth="1.8" strokeLinejoin="round" />
                    {/* Cartoon Student Player */}
                    <path d="M36 114 C36 88, 96 88, 96 114 Z" fill="#34D399" stroke="#1E293B" strokeWidth="2.2" />
                    <circle cx="66" cy="60" r="20" fill="#FDE68A" stroke="#1E293B" strokeWidth="2.2" />
                    <path d="M46 54 C49 36, 83 36, 86 54 C78 46, 54 46, 46 54 Z" fill="#1E293B" />
                    <circle cx="59" cy="60" r="2.2" fill="#1E293B" />
                    <circle cx="73" cy="60" r="2.2" fill="#1E293B" />
                    <path d="M60 68 Q66 74 72 68" stroke="#1E293B" strokeWidth="2" fill="none" strokeLinecap="round" />
                    {/* Cartoon 2x2 Brain Cube on Right */}
                    <rect x="138" y="54" width="54" height="54" rx="10" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2.2" />
                    <rect x="144" y="60" width="17" height="17" rx="3" fill="#F43F5E" stroke="#1E293B" strokeWidth="1.6" />
                    <rect x="167" y="60" width="17" height="17" rx="3" fill="#38BDF8" stroke="#1E293B" strokeWidth="1.6" />
                    <rect x="144" y="83" width="17" height="17" rx="3" fill="#FACC15" stroke="#1E293B" strokeWidth="1.6" />
                    <rect x="167" y="83" width="17" height="17" rx="3" fill="#A78BFA" stroke="#1E293B" strokeWidth="1.6" />
                    {/* Gen-Z Speech Bubble: "MY BRAIN IS NOT BRAINING" */}
                    <path
                        d="M104 10 H238 A10 10 0 0 1 248 20 V36 A10 10 0 0 1 238 46 H118 L102 53 L107 46 H104 A10 10 0 0 1 94 36 V20 A10 10 0 0 1 104 10 Z"
                        fill="#FEF3C7"
                        stroke="#1E293B"
                        strokeWidth="2.2"
                        strokeLinejoin="round"
                    />
                    <text x="171" y="25" textAnchor="middle" fontSize="8.5" fontWeight="900" fill="#B45309" letterSpacing="0.4">
                        MY BRAIN IS NOT
                    </text>
                    <text x="171" y="38" textAnchor="middle" fontSize="9.5" fontWeight="900" fill="#92400E" letterSpacing="0.5">
                        BRAINING RN ★
                    </text>
                    <line x1="18" y1="114" x2="236" y2="114" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
            );

        case 'type-speed':
            // Cartoon Sweating Student at Mechanical Keyboard & Sarcastic "Slow Hands" Speech Bubble
            return (
                <svg viewBox="0 0 260 135" className={wideSizeClass} aria-hidden="true">
                    <ellipse cx="130" cy="118" rx="106" ry="10" fill="#0F172A" fillOpacity="0.18" />
                    {/* Cartoon Student Typing */}
                    <path d="M32 114 C32 88, 92 88, 92 114 Z" fill="#F97316" stroke="#1E293B" strokeWidth="2.2" />
                    <circle cx="62" cy="60" r="20" fill="#FDE68A" stroke="#1E293B" strokeWidth="2.2" />
                    <path d="M42 54 C45 36, 79 36, 82 54 C74 46, 50 46, 42 54 Z" fill="#1E293B" />
                    <circle cx="55" cy="60" r="2.2" fill="#1E293B" />
                    <circle cx="69" cy="60" r="2.2" fill="#1E293B" />
                    <path d="M56 69 Q62 66 68 69" stroke="#1E293B" strokeWidth="2" fill="none" strokeLinecap="round" />
                    {/* Cartoon Sweat Drop */}
                    <path d="M86 44 C86 44, 90 50, 90 53 A4 4 0 1 1 82 53 C82 50, 86 44, 86 44 Z" fill="#38BDF8" stroke="#1E293B" strokeWidth="1.5" />
                    {/* Cartoon Mechanical Keyboard on Desk */}
                    <rect x="114" y="62" width="122" height="46" rx="10" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2.2" />
                    <rect x="122" y="70" width="22" height="12" rx="3" fill="#F43F5E" stroke="#1E293B" strokeWidth="1.6" />
                    <rect x="148" y="70" width="22" height="12" rx="3" fill="#38BDF8" stroke="#1E293B" strokeWidth="1.6" />
                    <rect x="174" y="70" width="22" height="12" rx="3" fill="#FACC15" stroke="#1E293B" strokeWidth="1.6" />
                    <rect x="200" y="70" width="28" height="12" rx="3" fill="#A78BFA" stroke="#1E293B" strokeWidth="1.6" />
                    <rect x="122" y="87" width="16" height="12" rx="3" fill="#CBD5E1" stroke="#1E293B" strokeWidth="1.6" />
                    <rect x="142" y="87" width="64" height="12" rx="3" fill="#34D399" stroke="#1E293B" strokeWidth="1.6" />
                    <rect x="210" y="87" width="18" height="12" rx="3" fill="#FB923C" stroke="#1E293B" strokeWidth="1.6" />
                    {/* Sarcastic Speech Bubble: "BRO TYPES WITH 2 FINGERS? SLOW HANDS" */}
                    <path
                        d="M106 10 H242 A10 10 0 0 1 252 20 V38 A10 10 0 0 1 242 48 H122 L104 55 L110 48 H106 A10 10 0 0 1 96 38 V20 A10 10 0 0 1 106 10 Z"
                        fill="#FEF3C7"
                        stroke="#1E293B"
                        strokeWidth="2.2"
                        strokeLinejoin="round"
                    />
                    <text x="174" y="25" textAnchor="middle" fontSize="8" fontWeight="900" fill="#B45309" letterSpacing="0.3">
                        2-FINGER TYPING?
                    </text>
                    <text x="174" y="39" textAnchor="middle" fontSize="9.5" fontWeight="900" fill="#92400E" letterSpacing="0.5">
                        SLOW HANDS BRO 🐌
                    </text>
                    <line x1="18" y1="114" x2="244" y2="114" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
            );

        case 'locked-in':
        case 'company-arena':
            // Sarcastic Campus Placement Arena: Offer Letter Roll (7.2 LPA), Stopwatch (30:00), Coffee Mug & Interview Speech Bubble
            return (
                <svg viewBox="0 0 270 135" className={arenaSizeClass} aria-hidden="true">
                    <ellipse cx="135" cy="118" rx="114" ry="10" fill="#0F172A" fillOpacity="0.18" />
                    {/* Sarcastic Placement Speech Bubble */}
                    <path
                        d="M14 8 H212 A10 10 0 0 1 222 18 V36 A10 10 0 0 1 212 46 H118 L106 54 L109 46 H14 A10 10 0 0 1 4 36 V18 A10 10 0 0 1 14 8 Z"
                        fill="#FEF3C7"
                        stroke="#1E293B"
                        strokeWidth="2.2"
                        strokeLinejoin="round"
                    />
                    <text x="113" y="23" textAnchor="middle" fontSize="8" fontWeight="900" fill="#B45309" letterSpacing="0.3">
                        TCS • ACCENTURE • INFOSYS • WIPRO
                    </text>
                    <text x="113" y="37" textAnchor="middle" fontSize="9.5" fontWeight="900" fill="#92400E" letterSpacing="0.4">
                        CAMPUS CODING ROUND: NO CHATGPT 💀🔥
                    </text>
                    {/* Golden Offer Letter Scroll on Left */}
                    <rect x="22" y="58" width="58" height="52" rx="6" fill="#FEF08A" stroke="#1E293B" strokeWidth="2.2" />
                    <line x1="30" y1="68" x2="68" y2="68" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
                    <line x1="30" y1="76" x2="60" y2="76" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
                    <rect x="28" y="84" width="46" height="18" rx="4" fill="#10B981" stroke="#065F46" strokeWidth="1.5" />
                    <text x="51" y="96" textAnchor="middle" fontSize="7.5" fontWeight="900" fill="#FFFFFF">OFFER: 7.2LPA</text>
                    {/* Coding Test Stopwatch (30:00) in Middle */}
                    <circle cx="122" cy="85" r="24" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2.5" />
                    <rect x="118" y="56" width="8" height="6" rx="2" fill="#64748B" stroke="#1E293B" strokeWidth="2" />
                    <circle cx="122" cy="85" r="2.5" fill="#1E293B" />
                    <line x1="122" y1="85" x2="122" y2="71" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="122" y1="85" x2="132" y2="85" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
                    <text x="122" y="102" textAnchor="middle" fontSize="8" fontWeight="900" fill="#EF4444">30:00</text>
                    {/* Steaming Coffee Mug & Accepted Checkmark Badge on Right */}
                    <rect x="180" y="70" width="34" height="40" rx="6" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2.2" />
                    <path d="M214 78 c8 0 8 16 0 16" fill="none" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" />
                    <text x="197" y="94" textAnchor="middle" fontSize="8" fontWeight="900" fill="#64748B">DSA</text>
                    <path d="M188 64 q4 -6 0 -10 M196 64 q4 -6 0 -10 M204 64 q4 -6 0 -10" fill="none" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" />
                    {/* Green Pass Star / Badge */}
                    <circle cx="238" cy="84" r="16" fill="#10B981" stroke="#1E293B" strokeWidth="2.2" />
                    <path d="M232 84 l4 4 l8 -8" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="14" y1="116" x2="258" y2="116" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
            );

        case 'study-material':
            // Cartoon Towering Stack of Books, PDF Badge & Sarcastic "READ IT TOMORROW" Speech Bubble
            return (
                <svg viewBox="0 0 260 135" className={wideSizeClass} aria-hidden="true">
                    <ellipse cx="130" cy="118" rx="106" ry="10" fill="#0F172A" fillOpacity="0.18" />
                    {/* Sarcastic Speech Bubble */}
                    <path
                        d="M16 10 H208 A10 10 0 0 1 218 20 V36 A10 10 0 0 1 208 46 H112 L100 54 L103 46 H16 A10 10 0 0 1 6 36 V20 A10 10 0 0 1 16 10 Z"
                        fill="#FEF3C7"
                        stroke="#1E293B"
                        strokeWidth="2.2"
                        strokeLinejoin="round"
                    />
                    <text x="112" y="25" textAnchor="middle" fontSize="8" fontWeight="900" fill="#B45309">
                        47 UNOPENED PDFs
                    </text>
                    <text x="112" y="38" textAnchor="middle" fontSize="9.2" fontWeight="900" fill="#92400E">
                        I&apos;LL READ IT TOMORROW 📚
                    </text>
                    {/* Tall Stack of Textbooks */}
                    <rect x="28" y="96" width="84" height="18" rx="4" fill="#38BDF8" stroke="#1E293B" strokeWidth="2" />
                    <rect x="34" y="78" width="76" height="18" rx="4" fill="#F43F5E" stroke="#1E293B" strokeWidth="2" />
                    <rect x="30" y="60" width="80" height="18" rx="4" fill="#34D399" stroke="#1E293B" strokeWidth="2" />
                    <line x1="40" y1="105" x2="96" y2="105" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="44" y1="87" x2="96" y2="87" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="40" y1="69" x2="96" y2="69" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
                    {/* Open Notebook & Highlighter on Right */}
                    <rect x="136" y="62" width="96" height="52" rx="8" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2.2" />
                    <line x1="184" y1="62" x2="184" y2="114" stroke="#CBD5E1" strokeWidth="2" />
                    <line x1="146" y1="76" x2="176" y2="76" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
                    <line x1="146" y1="88" x2="174" y2="88" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="146" y1="100" x2="170" y2="100" stroke="#FACC15" strokeWidth="4" strokeLinecap="round" />
                    <line x1="194" y1="76" x2="222" y2="76" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="194" y1="88" x2="220" y2="88" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
                    <rect x="194" y="96" width="28" height="10" rx="3" fill="#DCFCE7" stroke="#10B981" strokeWidth="1.5" />
                    <line x1="18" y1="114" x2="244" y2="114" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
            );

        default:
            return null;
    }
};

const StudentTabSvg = ({ type, className = 'w-60 shrink-0 hidden sm:block' }) => {
    switch (type) {
        case 'dashboard':
            // Cartoon Bullseye Target with Arrow, Megaphone & Lightning Badge (distinct from top banner)
            return (
                <svg viewBox="0 0 240 120" className={className} aria-hidden="true">
                    <ellipse cx="120" cy="110" rx="98" ry="7" fill="#E2E8F0" />
                    {/* Cartoon Bullseye Target on Stand */}
                    <line x1="54" y1="82" x2="42" y2="106" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
                    <line x1="78" y1="82" x2="90" y2="106" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="66" cy="56" r="34" fill="#F43F5E" stroke="#1E293B" strokeWidth="2.2" />
                    <circle cx="66" cy="56" r="24" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
                    <circle cx="66" cy="56" r="14" fill="#38BDF8" stroke="#1E293B" strokeWidth="2" />
                    <circle cx="66" cy="56" r="6" fill="#FACC15" stroke="#1E293B" strokeWidth="1.8" />
                    {/* Dart Arrow Hitting Bullseye */}
                    <line x1="66" y1="56" x2="106" y2="26" stroke="#1E293B" strokeWidth="2.8" strokeLinecap="round" />
                    <polygon points="102,29 112,20 109,32" fill="#F59E0B" stroke="#1E293B" strokeWidth="1.6" strokeLinejoin="round" />
                    {/* Cartoon Megaphone on Right */}
                    <g transform="rotate(-12 168 62)">
                        <polygon points="132,56 184,34 184,86 132,68" fill="#FACC15" stroke="#1E293B" strokeWidth="2.2" strokeLinejoin="round" />
                        <rect x="120" y="54" width="14" height="16" rx="4" fill="#F43F5E" stroke="#1E293B" strokeWidth="2" />
                        <path d="M138 69 L144 88 L154 86 L148 66" fill="#38BDF8" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
                        <ellipse cx="184" cy="60" rx="6" ry="26" fill="#FEF3C7" stroke="#1E293B" strokeWidth="2" />
                    </g>
                    {/* Sound Action Lines */}
                    <path d="M204 42 Q214 52 206 64" stroke="#F59E0B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    <path d="M214 34 Q226 52 216 72" stroke="#38BDF8" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    <line x1="16" y1="106" x2="224" y2="106" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
            );

        case 'meta-batch':
            // Cartoon Open Curriculum Textbook, Academic Bookmark, Badge Folder & Compass (completely distinct from top banner)
            return (
                <svg viewBox="0 0 240 120" className={className} aria-hidden="true">
                    <ellipse cx="120" cy="110" rx="98" ry="7" fill="#E2E8F0" />
                    {/* Cartoon Tabbed Dossier Folder Behind */}
                    <path d="M24 32 h38 l8 10 h56 a8 8 0 0 1 8 8 v46 a8 8 0 0 1 -8 8 H24 a8 8 0 0 1 -8 -8 V40 a8 8 0 0 1 8 -8 Z" fill="#FACC15" stroke="#1E293B" strokeWidth="2.2" />
                    {/* Cartoon Open Textbook in Front */}
                    <path d="M36 46 Q66 38 92 48 L92 98 Q66 88 36 96 Z" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2.2" strokeLinejoin="round" />
                    <path d="M92 48 Q118 38 148 46 L148 96 Q118 88 92 98 Z" fill="#E0F2FE" stroke="#1E293B" strokeWidth="2.2" strokeLinejoin="round" />
                    <line x1="92" y1="48" x2="92" y2="98" stroke="#1E293B" strokeWidth="2.2" />
                    {/* Book Lines & Red Bookmark Ribbon */}
                    <line x1="48" y1="60" x2="80" y2="58" stroke="#94A3B8" strokeWidth="2.2" strokeLinecap="round" />
                    <line x1="48" y1="70" x2="76" y2="68" stroke="#94A3B8" strokeWidth="2.2" strokeLinecap="round" />
                    <line x1="48" y1="80" x2="72" y2="78" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="104" y1="58" x2="136" y2="60" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="104" y1="68" x2="132" y2="70" stroke="#94A3B8" strokeWidth="2.2" strokeLinecap="round" />
                    <polygon points="88,96 96,96 96,112 92,107 88,112" fill="#EF4444" stroke="#1E293B" strokeWidth="1.6" strokeLinejoin="round" />
                    {/* Cartoon Golden Award Seal & Ribbon on Right */}
                    <path d="M180 68 L172 102 L184 95 L192 104 L196 68" fill="#EF4444" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M196 68 L204 102 L192 95 L184 104" fill="#F43F5E" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
                    <circle cx="190" cy="52" r="24" fill="#34D399" stroke="#1E293B" strokeWidth="2.2" />
                    <circle cx="190" cy="52" r="17" fill="#FEF3C7" stroke="#1E293B" strokeWidth="1.8" />
                    <path d="M190 40 l3.5 7 7.5 1-5.5 5 1.5 7.5-7-3.8-7 3.8 1.5-7.5-5.5-5 7.5-1z" fill="#F59E0B" stroke="#1E293B" strokeWidth="1.4" />
                    <line x1="14" y1="106" x2="226" y2="106" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
            );

        case 'trainer':
            // Cartoon Teacher / Professor at Wooden Podium Lectern with Microphone, Glasses, Suit & Tie, Open Book & Idea Bulb
            return (
                <svg viewBox="0 0 240 125" className={className} aria-hidden="true">
                    <ellipse cx="120" cy="114" rx="102" ry="7" fill="#E2E8F0" />
                    {/* Glowing Cartoon Idea Bulb on Left */}
                    <circle cx="44" cy="44" r="16" fill="#FACC15" stroke="#1E293B" strokeWidth="2" />
                    <rect x="38" y="58" width="12" height="7" rx="2" fill="#CBD5E1" stroke="#1E293B" strokeWidth="2" />
                    <line x1="44" y1="20" x2="44" y2="13" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="22" y1="30" x2="16" y2="25" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="66" y1="30" x2="72" y2="25" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
                    {/* Cartoon Teacher / Professor Behind Lectern */}
                    {/* Blazer & Shoulders */}
                    <path d="M84 96 C84 68, 156 68, 156 96 Z" fill="#1E293B" stroke="#1E293B" strokeWidth="2.2" strokeLinejoin="round" />
                    {/* White Shirt & Bowtie/Tie */}
                    <polygon points="108,71 132,71 120,94" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.6" strokeLinejoin="round" />
                    <polygon points="117,73 123,73 124,90 120,94 116,90" fill="#EF4444" />
                    {/* Teacher Head */}
                    <circle cx="120" cy="42" r="21" fill="#FDE68A" stroke="#1E293B" strokeWidth="2.2" />
                    {/* Neat Professor Hair */}
                    <path d="M99 37 C101 18, 139 18, 141 37 C133 28, 107 28, 99 37 Z" fill="#1E293B" />
                    {/* Professor Glasses */}
                    <rect x="105" y="37" width="12" height="9" rx="3" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
                    <rect x="123" y="37" width="12" height="9" rx="3" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
                    <line x1="117" y1="41" x2="123" y2="41" stroke="#1E293B" strokeWidth="2" />
                    <circle cx="111" cy="41.5" r="2" fill="#1E293B" />
                    <circle cx="129" cy="41.5" r="2" fill="#1E293B" />
                    {/* Warm Smile */}
                    <path d="M114 52 Q120 57 126 52" stroke="#1E293B" strokeWidth="2" fill="none" strokeLinecap="round" />
                    {/* Wooden Lectern / Podium in Front */}
                    <polygon points="74,78 166,78 158,88 82,88" fill="#F59E0B" stroke="#1E293B" strokeWidth="2.2" strokeLinejoin="round" />
                    <rect x="84" y="88" width="72" height="22" rx="3" fill="#D97706" stroke="#1E293B" strokeWidth="2.2" />
                    <circle cx="120" cy="99" r="7" fill="#FEF3C7" stroke="#1E293B" strokeWidth="1.8" />
                    {/* Gooseneck Microphone on Podium */}
                    <path d="M148 78 Q154 62 142 58" stroke="#1E293B" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                    <ellipse cx="140" cy="57" rx="4" ry="3" fill="#38BDF8" stroke="#1E293B" strokeWidth="1.8" />
                    {/* Speech Bubble on Right */}
                    <rect x="168" y="24" width="60" height="26" rx="9" fill="#DCFCE7" stroke="#1E293B" strokeWidth="2" />
                    <path d="M176 50 L168 58 L184 50 Z" fill="#DCFCE7" stroke="#1E293B" strokeWidth="1.8" strokeLinejoin="round" />
                    <text x="198" y="41" textAnchor="middle" fontSize="9.5" fontWeight="900" fill="#047857">TRAINER ★</text>
                    {/* Baseline */}
                    <line x1="12" y1="110" x2="228" y2="110" stroke="#1E293B" strokeWidth="2.4" strokeLinecap="round" />
                </svg>
            );

        case 'launcher':
            // Cartoon Launchpad Console & Golden Key
            return (
                <svg viewBox="0 0 240 120" className={className} aria-hidden="true">
                    <ellipse cx="120" cy="108" rx="96" ry="8" fill="#E2E8F0" />
                    {/* Cartoon Computer Monitor */}
                    <rect x="24" y="16" width="110" height="72" rx="12" fill="#38BDF8" stroke="#1E293B" strokeWidth="2.2" />
                    <rect x="32" y="24" width="94" height="52" rx="6" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.8" />
                    <rect x="66" y="88" width="26" height="12" fill="#94A3B8" stroke="#1E293B" strokeWidth="2" />
                    <rect x="50" y="100" width="58" height="6" rx="3" fill="#CBD5E1" stroke="#1E293B" strokeWidth="2" />
                    <rect x="44" y="38" width="70" height="24" rx="6" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.8" />
                    <text x="79" y="54" textAnchor="middle" fontSize="10" fontWeight="900" fontFamily="monospace" fill="#B45309">KEY-2026</text>
                    {/* Big Cartoon Golden Key */}
                    <circle cx="164" cy="56" r="18" fill="#FACC15" stroke="#1E293B" strokeWidth="2.2" />
                    <circle cx="164" cy="56" r="6" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
                    <path d="M182 52 h36 v8 h-6 v8 h-8 v-8 h-6 v6 h-8 v-6 h-8 Z" fill="#FACC15" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
                </svg>
            );

        case 'enter-exam':
            // Cartoon Student at Desk Taking Live Assessment
            return (
                <svg viewBox="0 0 240 120" className={className} aria-hidden="true">
                    <ellipse cx="120" cy="110" rx="98" ry="7" fill="#E2E8F0" />
                    {/* Books Stack */}
                    <rect x="18" y="88" width="42" height="10" rx="3" fill="#F43F5E" stroke="#1E293B" strokeWidth="2" />
                    <rect x="22" y="78" width="36" height="10" rx="3" fill="#38BDF8" stroke="#1E293B" strokeWidth="2" />
                    {/* Cartoon Student */}
                    <path d="M72 106 C72 82, 130 82, 130 106 Z" fill="#8B5CF6" stroke="#1E293B" strokeWidth="2.2" />
                    <circle cx="101" cy="54" r="20" fill="#FDE68A" stroke="#1E293B" strokeWidth="2.2" />
                    <path d="M81 48 C84 30, 118 30, 121 48 C112 40, 88 40, 81 48 Z" fill="#1E293B" />
                    <circle cx="94" cy="54" r="5.5" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.8" />
                    <circle cx="108" cy="54" r="5.5" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.8" />
                    <line x1="99.5" y1="54" x2="102.5" y2="54" stroke="#1E293B" strokeWidth="1.8" />
                    <circle cx="94" cy="54" r="2" fill="#1E293B" />
                    <circle cx="108" cy="54" r="2" fill="#1E293B" />
                    <path d="M96 64 Q101 68 106 64" stroke="#1E293B" strokeWidth="2" fill="none" strokeLinecap="round" />
                    {/* Laptop & Clock */}
                    <rect x="118" y="72" width="54" height="34" rx="5" fill="#E2E8F0" stroke="#1E293B" strokeWidth="2.2" />
                    <circle cx="145" cy="89" r="5" fill="#38BDF8" stroke="#1E293B" strokeWidth="1.5" />
                    <circle cx="198" cy="48" r="22" fill="#FEF3C7" stroke="#1E293B" strokeWidth="2.2" />
                    <circle cx="198" cy="48" r="17" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="1.5" />
                    <path d="M198 38 v10 l7 5" stroke="#1E293B" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                    <line x1="12" y1="106" x2="228" y2="106" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
            );

        case 'exam-history':
            // Cartoon 1st-2nd-3rd Winner Podium, Trophy & Diploma Scroll
            return (
                <svg viewBox="0 0 240 120" className={className} aria-hidden="true">
                    <ellipse cx="120" cy="110" rx="98" ry="7" fill="#E2E8F0" />
                    {/* 3-Step Cartoon Podium */}
                    <rect x="28" y="74" width="40" height="32" rx="4" fill="#BAE6FD" stroke="#1E293B" strokeWidth="2" />
                    <text x="48" y="95" textAnchor="middle" fontSize="13" fontWeight="900" fill="#0369A1">2</text>
                    <rect x="68" y="56" width="44" height="50" rx="4" fill="#FDE68A" stroke="#1E293B" strokeWidth="2.2" />
                    <text x="90" y="86" textAnchor="middle" fontSize="16" fontWeight="900" fill="#B45309">1</text>
                    <rect x="112" y="80" width="40" height="26" rx="4" fill="#DDD6FE" stroke="#1E293B" strokeWidth="2" />
                    <text x="132" y="98" textAnchor="middle" fontSize="12" fontWeight="900" fill="#6D28D9">3</text>
                    {/* Trophy Cup on 1st Place */}
                    <path d="M76 20 h28 v14 c0 8-6 14-14 14 s-14-6-14-14 V20 z" fill="#FACC15" stroke="#1E293B" strokeWidth="2" />
                    <path d="M76 24 h-6 a5 5 0 0 0 0 10 h6 M104 24 h6 a5 5 0 0 1 0 10 h-6" stroke="#1E293B" strokeWidth="2" fill="none" />
                    <rect x="86" y="48" width="8" height="8" fill="#F59E0B" stroke="#1E293B" strokeWidth="2" />
                    {/* Rolled Diploma Scroll with Red Ribbon */}
                    <g transform="rotate(-12 190 66)">
                        <rect x="160" y="56" width="60" height="20" rx="10" fill="#FEFCE8" stroke="#1E293B" strokeWidth="2" />
                        <rect x="184" y="55" width="12" height="22" rx="2" fill="#EF4444" stroke="#1E293B" strokeWidth="1.8" />
                        <path d="M186 77 l-4 10 l8-4 l4 4 l-2-10" fill="#EF4444" stroke="#1E293B" strokeWidth="1.5" />
                    </g>
                    <line x1="16" y1="106" x2="224" y2="106" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
            );

        case 'profile-personal':
            // Cartoon Polaroid Portrait Card, Mail Envelope & Star
            return (
                <svg viewBox="0 0 240 120" className={className} aria-hidden="true">
                    <ellipse cx="120" cy="110" rx="96" ry="7" fill="#E2E8F0" />
                    {/* Cartoon Polaroid Frame */}
                    <g transform="rotate(-4 78 60)">
                        <rect x="36" y="14" width="84" height="92" rx="10" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2.2" />
                        <rect x="44" y="22" width="68" height="60" rx="6" fill="#E0F2FE" stroke="#1E293B" strokeWidth="1.8" />
                        <circle cx="78" cy="48" r="14" fill="#FDE68A" stroke="#1E293B" strokeWidth="2" />
                        <path d="M64 44 C66 32, 90 32, 92 44 Z" fill="#1E293B" />
                        <circle cx="73" cy="48" r="1.8" fill="#1E293B" />
                        <circle cx="83" cy="48" r="1.8" fill="#1E293B" />
                        <path d="M74 54 Q78 58 82 54" stroke="#1E293B" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                        <path d="M62 82 C62 66, 94 66, 94 82 Z" fill="#38BDF8" stroke="#1E293B" strokeWidth="2" />
                        <rect x="54" y="90" width="48" height="6" rx="3" fill="#94A3B8" />
                    </g>
                    {/* Cartoon Mail Envelope & CGPA Badge */}
                    <rect x="136" y="54" width="76" height="48" rx="8" fill="#FEF3C7" stroke="#1E293B" strokeWidth="2.2" />
                    <path d="M138 56 L174 82 L210 56" stroke="#1E293B" strokeWidth="2" fill="none" strokeLinejoin="round" />
                    <rect x="144" y="18" width="64" height="26" rx="13" fill="#DCFCE7" stroke="#1E293B" strokeWidth="2" />
                    <text x="176" y="35" textAnchor="middle" fontSize="10" fontWeight="900" fill="#047857">ID VERIFIED</text>
                </svg>
            );

        case 'profile-academic':
            // Cartoon University Campus Building, Trees & Graduation Cap
            return (
                <svg viewBox="0 0 240 120" className={className} aria-hidden="true">
                    <ellipse cx="120" cy="110" rx="98" ry="7" fill="#E2E8F0" />
                    {/* Cartoon Trees */}
                    <circle cx="28" cy="84" r="14" fill="#34D399" stroke="#1E293B" strokeWidth="2" />
                    <rect x="25" y="94" width="6" height="12" fill="#B45309" stroke="#1E293B" strokeWidth="1.8" />
                    {/* University Building */}
                    <polygon points="48,46 104,18 160,46" fill="#F59E0B" stroke="#1E293B" strokeWidth="2.2" strokeLinejoin="round" />
                    <circle cx="104" cy="35" r="7" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.8" />
                    <path d="M104 31 v4 l3 2" stroke="#1E293B" strokeWidth="1.5" fill="none" />
                    <rect x="54" y="46" width="100" height="60" fill="#E0F2FE" stroke="#1E293B" strokeWidth="2.2" />
                    {[66, 88, 110, 132].map((x) => (
                        <rect key={x} x={x} y="54" width="10" height="44" rx="2" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.8" />
                    ))}
                    <rect x="48" y="98" width="112" height="8" rx="3" fill="#94A3B8" stroke="#1E293B" strokeWidth="2" />
                    {/* Graduation Cap on Right */}
                    <polygon points="164,52 196,38 228,52 196,66" fill="#1E293B" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M178 59 v14 c0 5 8 9 18 9 s18-4 18-9 V59" fill="#38BDF8" stroke="#1E293B" strokeWidth="2" />
                    <line x1="220" y1="55" x2="220" y2="75" stroke="#FACC15" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx="220" cy="76" r="3.5" fill="#FACC15" stroke="#1E293B" strokeWidth="1.5" />
                </svg>
            );

        case 'profile-skills':
            // Cartoon Rocket, Glowing Lightbulb & Coding Laptop
            return (
                <svg viewBox="0 0 240 120" className={className} aria-hidden="true">
                    <ellipse cx="120" cy="110" rx="98" ry="7" fill="#E2E8F0" />
                    {/* Cartoon Coding Laptop */}
                    <rect x="26" y="42" width="86" height="54" rx="8" fill="#EDE9FE" stroke="#1E293B" strokeWidth="2.2" />
                    <rect x="34" y="50" width="70" height="38" rx="4" fill="#1E293B" />
                    <text x="69" y="75" textAnchor="middle" fontSize="18" fontWeight="900" fill="#38BDF8">&lt;/&gt;</text>
                    <rect x="16" y="96" width="106" height="8" rx="4" fill="#94A3B8" stroke="#1E293B" strokeWidth="2" />
                    {/* Glowing Idea Lightbulb */}
                    <circle cx="144" cy="40" r="16" fill="#FACC15" stroke="#1E293B" strokeWidth="2" />
                    <rect x="138" y="54" width="12" height="8" rx="2" fill="#CBD5E1" stroke="#1E293B" strokeWidth="2" />
                    <line x1="144" y1="16" x2="144" y2="10" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="122" y1="26" x2="117" y2="22" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="166" y1="26" x2="171" y2="22" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
                    {/* Cartoon Rocket */}
                    <g transform="rotate(18 196 66)">
                        <path d="M196 24 C210 42, 210 72, 196 88 C182 72, 182 42, 196 24 Z" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2.2" />
                        <path d="M196 24 C203 34, 203 42, 196 42 C189 42, 189 34, 196 24 Z" fill="#F43F5E" stroke="#1E293B" strokeWidth="2" />
                        <circle cx="196" cy="56" r="7" fill="#38BDF8" stroke="#1E293B" strokeWidth="2" />
                        <path d="M185 72 L175 86 L188 82 Z M207 72 L217 86 L204 82 Z" fill="#F43F5E" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
                        <path d="M190 88 Q196 104 202 88 Z" fill="#F59E0B" stroke="#1E293B" strokeWidth="1.8" />
                    </g>
                </svg>
            );

        case 'profile-resume':
            // Cartoon CV Sheet, Red PDF Stamp & Magnifying Glass
            return (
                <svg viewBox="0 0 240 120" className={className} aria-hidden="true">
                    <ellipse cx="120" cy="110" rx="96" ry="7" fill="#E2E8F0" />
                    {/* Cartoon Resume Document */}
                    <rect x="42" y="12" width="76" height="94" rx="8" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2.2" />
                    <circle cx="64" cy="34" r="10" fill="#BAE6FD" stroke="#1E293B" strokeWidth="1.8" />
                    <rect x="80" y="26" width="28" height="6" rx="3" fill="#1E293B" />
                    <rect x="80" y="36" width="20" height="5" rx="2.5" fill="#38BDF8" />
                    <rect x="54" y="54" width="52" height="5" rx="2.5" fill="#94A3B8" />
                    <rect x="54" y="64" width="44" height="5" rx="2.5" fill="#CBD5E1" />
                    <rect x="54" y="78" width="34" height="16" rx="4" fill="#EF4444" stroke="#1E293B" strokeWidth="1.8" />
                    <text x="71" y="89" textAnchor="middle" fontSize="9" fontWeight="900" fill="#FFFFFF">PDF</text>
                    {/* Cartoon Magnifying Glass Inspecting Resume */}
                    <circle cx="156" cy="56" r="26" fill="#E0F2FE" fillOpacity="0.85" stroke="#1E293B" strokeWidth="2.5" />
                    <circle cx="156" cy="56" r="20" fill="#FFFFFF" stroke="#38BDF8" strokeWidth="2" />
                    <path d="M148 56 l6 6 12-12" stroke="#10B981" strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="175" y1="75" x2="198" y2="98" stroke="#F59E0B" strokeWidth="9" strokeLinecap="round" />
                    <line x1="175" y1="75" x2="198" y2="98" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
            );

        case 'profile-preferences':
            // Cartoon Globe, Directional Signpost & Paper Airplane
            return (
                <svg viewBox="0 0 240 120" className={className} aria-hidden="true">
                    <ellipse cx="120" cy="110" rx="96" ry="7" fill="#E2E8F0" />
                    {/* Cartoon Globe */}
                    <circle cx="66" cy="64" r="34" fill="#38BDF8" stroke="#1E293B" strokeWidth="2.2" />
                    <path d="M42 50 Q60 42 68 56 T54 86 Z" fill="#34D399" stroke="#1E293B" strokeWidth="1.6" />
                    <path d="M76 38 Q92 48 86 68 T72 78 Z" fill="#34D399" stroke="#1E293B" strokeWidth="1.6" />
                    {/* Cartoon Signpost */}
                    <rect x="154" y="20" width="8" height="86" rx="3" fill="#B45309" stroke="#1E293B" strokeWidth="2" />
                    <polygon points="122,30 192,30 202,41 192,52 122,52" fill="#FACC15" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
                    <text x="158" y="45" textAnchor="middle" fontSize="9.5" fontWeight="900" fill="#1E293B">DREAM ROLE</text>
                    <polygon points="194,60 126,60 116,71 126,82 194,82" fill="#A7F3D0" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
                    <text x="158" y="75" textAnchor="middle" fontSize="9.5" fontWeight="900" fill="#065F46">TOP CITIES</text>
                    {/* Paper Airplane */}
                    <polygon points="94,18 128,26 106,38 102,28" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.8" strokeLinejoin="round" />
                </svg>
            );

        case 'placement':
            // Cartoon Briefcase, Corporate Building & Golden Offer Star
            return (
                <svg viewBox="0 0 240 120" className={className} aria-hidden="true">
                    <ellipse cx="120" cy="110" rx="98" ry="7" fill="#E2E8F0" />
                    {/* Cartoon Office Tower */}
                    <rect x="26" y="22" width="54" height="84" rx="6" fill="#BAE6FD" stroke="#1E293B" strokeWidth="2.2" />
                    {[36, 56].map((x) =>
                        [34, 52, 70].map((y) => (
                            <rect key={`${x}-${y}`} x={x} y={y} width="12" height="12" rx="2" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.5" />
                        ))
                    )}
                    {/* Cartoon Leather Briefcase */}
                    <rect x="98" y="48" width="76" height="58" rx="10" fill="#D97706" stroke="#1E293B" strokeWidth="2.2" />
                    <path d="M122 48 v-8 a6 6 0 0 1 6 -6 h16 a6 6 0 0 1 6 6 v8" stroke="#1E293B" strokeWidth="2.5" fill="none" />
                    <rect x="98" y="70" width="76" height="7" fill="#B45309" stroke="#1E293B" strokeWidth="1.8" />
                    <rect x="130" y="67" width="12" height="13" rx="3" fill="#FACC15" stroke="#1E293B" strokeWidth="2" />
                    {/* Offer Badge */}
                    <circle cx="198" cy="48" r="22" fill="#FEF3C7" stroke="#1E293B" strokeWidth="2.2" />
                    <path d="M198 32 l4.5 9 10 1.5-7.2 7 1.7 10-9-4.7-9 4.7 1.7-10-7.2-7 10-1.5z" fill="#FACC15" stroke="#1E293B" strokeWidth="1.6" />
                </svg>
            );

        case 'attendance':
            // Cartoon Flip-Calendar, Smiling Sun & Green Checkmark Stamp
            return (
                <svg viewBox="0 0 240 120" className={className} aria-hidden="true">
                    <ellipse cx="120" cy="110" rx="96" ry="7" fill="#E2E8F0" />
                    {/* Smiling Cartoon Sun */}
                    <circle cx="44" cy="40" r="18" fill="#FACC15" stroke="#1E293B" strokeWidth="2" />
                    <circle cx="39" cy="38" r="1.8" fill="#1E293B" />
                    <circle cx="49" cy="38" r="1.8" fill="#1E293B" />
                    <path d="M40 44 Q44 48 48 44" stroke="#1E293B" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                    {/* Cartoon Calendar */}
                    <rect x="78" y="20" width="96" height="86" rx="12" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2.2" />
                    <rect x="78" y="20" width="96" height="22" rx="10" fill="#38BDF8" stroke="#1E293B" strokeWidth="2.2" />
                    <rect x="98" y="12" width="8" height="14" rx="4" fill="#CBD5E1" stroke="#1E293B" strokeWidth="2" />
                    <rect x="146" y="12" width="8" height="14" rx="4" fill="#CBD5E1" stroke="#1E293B" strokeWidth="2" />
                    {[96, 116, 136, 156].map((cx) => (
                        <circle key={`c1-${cx}`} cx={cx} cy="58" r="5.5" fill="#34D399" stroke="#1E293B" strokeWidth="1.5" />
                    ))}
                    {[96, 116, 136, 156].map((cx, i) => (
                        <circle key={`c2-${cx}`} cx={cx} cy="78" r="5.5" fill={i === 3 ? '#FACC15' : '#34D399'} stroke="#1E293B" strokeWidth="1.5" />
                    ))}
                    {/* Big Green Checkmark Badge */}
                    <circle cx="192" cy="78" r="22" fill="#DCFCE7" stroke="#1E293B" strokeWidth="2.2" />
                    <path d="M182 78 l7 7 14-14" stroke="#059669" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            );

        case 'todo':
            // Cartoon Notepad, Sticky Notes & Giant Pencil
            return (
                <svg viewBox="0 0 240 120" className={className} aria-hidden="true">
                    <ellipse cx="120" cy="110" rx="96" ry="7" fill="#E2E8F0" />
                    {/* Pinned Sticky Note */}
                    <g transform="rotate(-6 48 62)">
                        <rect x="20" y="34" width="56" height="56" rx="6" fill="#FEF08A" stroke="#1E293B" strokeWidth="2" />
                        <circle cx="48" cy="42" r="4" fill="#EF4444" stroke="#1E293B" strokeWidth="1.5" />
                        <rect x="30" y="54" width="36" height="5" rx="2.5" fill="#B45309" />
                        <rect x="30" y="66" width="26" height="5" rx="2.5" fill="#D97706" />
                    </g>
                    {/* Cartoon Task Clipboard */}
                    <rect x="92" y="14" width="78" height="92" rx="10" fill="#38BDF8" stroke="#1E293B" strokeWidth="2.2" />
                    <rect x="100" y="24" width="62" height="74" rx="6" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.8" />
                    <rect x="116" y="8" width="30" height="12" rx="4" fill="#CBD5E1" stroke="#1E293B" strokeWidth="2" />
                    {[38, 56, 74].map((y, idx) => (
                        <g key={y}>
                            <rect x="108" y={y} width="12" height="12" rx="3" fill={idx < 2 ? '#DCFCE7' : '#FEF3C7'} stroke="#1E293B" strokeWidth="1.8" />
                            {idx < 2 && <path d={`M110 ${y + 6} l3 3 5-5`} stroke="#059669" strokeWidth="2" fill="none" strokeLinecap="round" />}
                            <rect x="126" y={y + 3} width="28" height="6" rx="3" fill="#1E293B" />
                        </g>
                    ))}
                    {/* Cartoon Pencil */}
                    <g transform="rotate(20 198 62)">
                        <rect x="190" y="24" width="14" height="58" fill="#FACC15" stroke="#1E293B" strokeWidth="2" />
                        <rect x="190" y="14" width="14" height="10" rx="2" fill="#F43F5E" stroke="#1E293B" strokeWidth="2" />
                        <polygon points="190,82 204,82 197,98" fill="#FDE68A" stroke="#1E293B" strokeWidth="2" />
                        <polygon points="194,91 200,91 197,98" fill="#1E293B" />
                    </g>
                </svg>
            );

        case 'security':
            // Cartoon Safe Vault Door, Smiling Padlock & Shield
            return (
                <svg viewBox="0 0 240 120" className={className} aria-hidden="true">
                    <ellipse cx="120" cy="110" rx="96" ry="7" fill="#E2E8F0" />
                    {/* Cartoon Vault Safe */}
                    <rect x="26" y="18" width="84" height="84" rx="14" fill="#94A3B8" stroke="#1E293B" strokeWidth="2.2" />
                    <rect x="34" y="26" width="68" height="68" rx="10" fill="#CBD5E1" stroke="#1E293B" strokeWidth="2" />
                    <circle cx="68" cy="60" r="18" fill="#E2E8F0" stroke="#1E293B" strokeWidth="2.2" />
                    <line x1="68" y1="42" x2="68" y2="78" stroke="#1E293B" strokeWidth="2.5" />
                    <line x1="50" y1="60" x2="86" y2="60" stroke="#1E293B" strokeWidth="2.5" />
                    <circle cx="68" cy="60" r="6" fill="#38BDF8" stroke="#1E293B" strokeWidth="2" />
                    {/* Cartoon Smiling Padlock */}
                    <path d="M148 52 v-12 a14 14 0 0 1 28 0 v12" stroke="#94A3B8" strokeWidth="6" fill="none" />
                    <path d="M148 52 v-12 a14 14 0 0 1 28 0 v12" stroke="#1E293B" strokeWidth="2.2" fill="none" />
                    <rect x="136" y="50" width="52" height="50" rx="12" fill="#FACC15" stroke="#1E293B" strokeWidth="2.2" />
                    <circle cx="153" cy="68" r="2.5" fill="#1E293B" />
                    <circle cx="171" cy="68" r="2.5" fill="#1E293B" />
                    <path d="M156 78 Q162 84 168 78" stroke="#1E293B" strokeWidth="2" fill="none" strokeLinecap="round" />
                </svg>
            );

        default:
            return null;
    }
};

const StudentDashboard = () => {
    const { 
        student, token, updateProfile, uploadResume, changePassword, refreshStudentProfile,
        todos, getTodos, addTodo, updateTodo, deleteTodo, updateExternalHandles
    } = useStudentAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    // Active Dashboard Tab
    const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'profile', 'attendance', 'todo', 'security'
    const [profileSubTab, setProfileSubTab] = useState('personal'); // 'personal', 'skills'
    const [attendanceSortDesc, setAttendanceSortDesc] = useState(true);

    // Todo local states
    const [activeFilter, setActiveFilter] = useState('all');
    const [todoModalOpen, setTodoModalOpen] = useState(false);
    const [todoEditingId, setTodoEditingId] = useState(null);
    const [todoTitle, setTodoTitle] = useState('');
    const [todoDesc, setTodoDesc] = useState('');
    const [todoDueDate, setTodoDueDate] = useState('');
    const [todoIsStarred, setTodoIsStarred] = useState(false);
    const [todoIsPriority, setTodoIsPriority] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');
        if (tab && ['dashboard', 'meta-batch', 'games', 'type-speed', 'locked-in', 'company-arena', 'study-material', 'profile', 'attendance', 'todo', 'security', 'enter-exam', 'exam-history', 'placement', 'leaderboard'].includes(tab)) {
            setActiveTab(tab);
        } else if (!tab) {
            setActiveTab('dashboard');
        }
    }, [location.search]);

    const switchTab = (tabName, subTab = null) => {
        setActiveTab(tabName);
        if (subTab) {
            setProfileSubTab(subTab);
        }
        navigate(`/student/dashboard?tab=${tabName}`);
    };

    useEffect(() => {
        if (token && (activeTab === 'todo' || activeTab === 'dashboard')) {
            getTodos();
        }
    }, [activeTab, token]);

    // Local Data states
    const [activeExams, setActiveExams] = useState([]);
    const [attempts, setAttempts] = useState([]);
    const [placementJobs, setPlacementJobs] = useState([]);
    const [loadingExams, setLoadingExams] = useState(false);
    const [loadingAttempts, setLoadingAttempts] = useState(false);
    const [loadingPlacementJobs, setLoadingPlacementJobs] = useState(false);

    // Profile Edit State
    const [personalName, setPersonalName] = useState('');
    const [personalEmail, setPersonalEmail] = useState('');
    const [personalMobile, setPersonalMobile] = useState('');
    const [personalCgpa, setPersonalCgpa] = useState('');
    const [personalBacklogs, setPersonalBacklogs] = useState('');
    const [skillsInput, setSkillsInput] = useState('');
    const [skillsList, setSkillsList] = useState([]);
    const [capabilities, setCapabilities] = useState('');
    const [prefRoles, setPrefRoles] = useState([]);
    const [prefLocations, setPrefLocations] = useState([]);
    const [expectedCTC, setExpectedCTC] = useState('');
    const [jobType, setJobType] = useState('Any');

    // Password State
    const [currentPw, setCurrentPw] = useState('');
    const [newPw, setNewPw] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const [showPw1, setShowPw1] = useState(false);
    const [showPw2, setShowPw2] = useState(false);



    // Leaderboard states
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);
    const [syncingLeaderboard, setSyncingLeaderboard] = useState(false);


    // Utility UI States
    const [resumeFile, setResumeFile] = useState(null);
    const [uploadingResume, setUploadingResume] = useState(false);
    const [profileSaving, setProfileSaving] = useState(false);
    const [pwSaving, setPwSaving] = useState(false);
    const [alertState, setAlertState] = useState({ open: false });
    const [examLauncherKey, setExamLauncherKey] = useState('');

    const actualAttempts = attempts.filter(a => !a.isMock);

    const commonRoles = ['Software Engineer', 'Frontend Developer', 'Backend Developer', 'Fullstack Engineer', 'Data Analyst', 'QA Engineer', 'Sales Executive', 'HR Specialist'];
    const commonLocations = ['Bangalore', 'Mumbai', 'Pune', 'Hyderabad', 'Chennai', 'Delhi NCR', 'Remote'];

    useEffect(() => {
        if (!token) {
            navigate('/portal');
            return;
        }
        refreshStudentProfile();
        fetchActiveExams();
        fetchAttempts();
        fetchPlacementJobs();
        getTodos();
    }, [token]);

    const fetchPlacementJobs = async () => {
        setLoadingPlacementJobs(true);
        try {
            const res = await api.get('/placement/student/jobs', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setPlacementJobs(res.data.data || []);
            }
        } catch (err) {
            console.error('Error fetching placement jobs:', err.message);
        } finally {
            setLoadingPlacementJobs(false);
        }
    };

    useEffect(() => {
        if (student) {
            setPersonalName(student.name || '');
            setPersonalEmail(student.email || '');
            setPersonalMobile(student.mobile || '');
            setPersonalCgpa(student.cgpa !== undefined ? student.cgpa : '');
            setPersonalBacklogs(student.backlogs !== undefined ? student.backlogs : '');
            setSkillsList(student.skills || []);
            setCapabilities(student.capabilities || '');
            if (student.jobPreferences) {
                setPrefRoles(student.jobPreferences.preferredRoles || []);
                setPrefLocations(student.jobPreferences.preferredLocations || []);
                setExpectedCTC(student.jobPreferences.expectedCTC || '');
                setJobType(student.jobPreferences.jobType || 'Any');
            }
        }
    }, [student]);

    const fetchActiveExams = async () => {
        setLoadingExams(true);
        try {
            const res = await api.get('/student/active-exams', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setActiveExams(res.data.data);
            }
        } catch (err) {
            console.error('Error fetching active exams:', err.message);
        } finally {
            setLoadingExams(false);
        }
    };

    const fetchAttempts = async () => {
        setLoadingAttempts(true);
        try {
            const res = await api.get('/student/attempts', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setAttempts(res.data.data);
            }
        } catch (err) {
            console.error('Error fetching attempts:', err.message);
        } finally {
            setLoadingAttempts(false);
        }
    };

    const handleExportProfile = () => {
        if (!student) return;

        const actualAttempts = attempts.filter(a => !a.isMock);
        const examsTaken = actualAttempts.length;
        const avgPercentage = examsTaken > 0 
            ? (actualAttempts.reduce((sum, a) => sum + a.percentage, 0) / examsTaken).toFixed(2) 
            : '0.00';

        const attendanceRate = student.attendance ? student.attendance.percentage : 0;
        const attendedSessions = student.attendance ? student.attendance.attended : 0;
        const totalSessions = student.attendance ? student.attendance.totalSessions : 0;

        // Build list of skills
        const skillsBadges = student.skills && student.skills.length > 0
            ? student.skills.map(s => `<span class="tag-badge">${s}</span>`).join('')
            : '<span style="color:#64748b; font-size:13px;">No skills added yet</span>';

        // Build exam history table rows
        const attemptsRows = actualAttempts.map(attempt => {
            const exam = attempt.examId;
            const dateStr = attempt.completedAt 
                ? new Date(attempt.completedAt).toLocaleDateString('en-IN') 
                : new Date(attempt.createdAt).toLocaleDateString('en-IN');
            const resultClass = attempt.result === 'pass' ? 'result-pass' : 'result-fail';
            return `
                <tr>
                    <td style="font-weight: 600; color: #0f172a;">${exam?.title || 'Exam'}</td>
                    <td>${exam?.courseId?.name || 'N/A'}</td>
                    <td>${dateStr}</td>
                    <td style="font-weight: 600;">${attempt.totalScore} / ${exam?.totalMarks || 0}</td>
                    <td>${attempt.percentage.toFixed(1)}%</td>
                    <td><span class="result-badge ${resultClass}">${attempt.result || 'N/A'}</span></td>
                </tr>
            `;
        }).join('');

        // Construct HTML content
        let htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>${student.name} - Profile Report</title>
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                        color: #1e293b;
                        line-height: 1.5;
                        margin: 0;
                        padding: 40px;
                        background-color: #ffffff;
                    }
                    .header {
                        border-bottom: 3px solid #5899B5;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-end;
                    }
                    .header-left h1 {
                        margin: 0;
                        font-size: 28px;
                        color: #0f172a;
                        font-weight: 700;
                    }
                    .header-left p {
                        margin: 5px 0 0 0;
                        font-size: 14px;
                        color: #64748b;
                        font-weight: 500;
                    }
                    .header-right {
                        text-align: right;
                    }
                    .institution-badge {
                        background-color: #5899B5;
                        color: white;
                        padding: 6px 12px;
                        border-radius: 6px;
                        font-size: 12px;
                        font-weight: 700;
                        letter-spacing: 0.5px;
                        display: inline-block;
                        margin-bottom: 5px;
                    }
                    .usn-text {
                        font-family: monospace;
                        font-size: 14px;
                        font-weight: 600;
                        color: #0f172a;
                    }
                    .grid-2 {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 25px;
                        margin-bottom: 30px;
                    }
                    .section {
                        margin-bottom: 30px;
                    }
                    .section-title {
                        font-size: 16px;
                        font-weight: 700;
                        color: #5899B5;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        border-bottom: 2px solid #f1f5f9;
                        padding-bottom: 6px;
                        margin-bottom: 15px;
                    }
                    .info-list {
                        list-style: none;
                        padding: 0;
                        margin: 0;
                    }
                    .info-list li {
                        display: flex;
                        margin-bottom: 8px;
                        font-size: 13.5px;
                    }
                    .info-list .label {
                        width: 140px;
                        color: #64748b;
                        font-weight: 600;
                    }
                    .info-list .value {
                        color: #0f172a;
                        font-weight: 500;
                        flex: 1;
                    }
                    .stats-grid {
                        display: grid;
                        grid-template-columns: repeat(4, 1fr);
                        gap: 15px;
                        margin-bottom: 30px;
                    }
                    .stat-card {
                        background-color: #f8fafc;
                        border: 1px solid #e2e8f0;
                        border-radius: 10px;
                        padding: 15px;
                        text-align: center;
                    }
                    .stat-card .stat-val {
                        font-size: 20px;
                        font-weight: 700;
                        color: #0f172a;
                    }
                    .stat-card .stat-lbl {
                        font-size: 11px;
                        color: #64748b;
                        font-weight: 600;
                        text-transform: uppercase;
                        margin-top: 4px;
                    }
                    .badge-container {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 6px;
                    }
                    .tag-badge {
                        background-color: #f1f5f9;
                        color: #334155;
                        border: 1px solid #e2e8f0;
                        padding: 4px 10px;
                        border-radius: 6px;
                        font-size: 12px;
                        font-weight: 600;
                    }
                    .table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 10px;
                    }
                    .table th {
                        background-color: #f8fafc;
                        border-bottom: 2px solid #e2e8f0;
                        color: #475569;
                        font-weight: 700;
                        text-transform: uppercase;
                        font-size: 11px;
                        letter-spacing: 0.5px;
                        padding: 10px 12px;
                        text-align: left;
                    }
                    .table td {
                        border-bottom: 1px solid #f1f5f9;
                        padding: 10px 12px;
                        font-size: 13px;
                        color: #334155;
                    }
                    .table tr:last-child td {
                        border-bottom: none;
                    }
                    .result-badge {
                        font-weight: 700;
                        font-size: 11px;
                        padding: 2px 6px;
                        border-radius: 4px;
                        text-transform: uppercase;
                    }
                    .result-pass {
                        background-color: #dcfce7;
                        color: #15803d;
                    }
                    .result-fail {
                        background-color: #fee2e2;
                        color: #b91c1c;
                    }
                    .footer {
                        margin-top: 40px;
                        border-top: 1px solid #e2e8f0;
                        padding-top: 15px;
                        font-size: 11px;
                        color: #94a3b8;
                        text-align: center;
                    }
                    @media print {
                        body {
                            padding: 0;
                        }
                        .no-print {
                            display: none;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="header-left">
                        <h1>${student.name}</h1>
                        <p>${student.department ? student.department.toUpperCase() : 'N/A'} Student | Semester ${student.semester || 'N/A'}</p>
                    </div>
                    <div class="header-right">
                        <div class="institution-badge">ETHNOTECH ACADEMY</div>
                        <div class="usn-text">USN: ${student.usn || 'N/A'}</div>
                    </div>
                </div>

                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-val">${examsTaken}</div>
                        <div class="stat-lbl">Exams Taken</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-val">${avgPercentage}%</div>
                        <div class="stat-lbl">Average Score</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-val">${attendanceRate}%</div>
                        <div class="stat-lbl">Attendance Rate</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-val">${student.cgpa !== undefined ? student.cgpa : '0.0'}</div>
                        <div class="stat-lbl">Current CGPA</div>
                    </div>
                </div>

                <div class="grid-2">
                    <div class="section">
                        <div class="section-title">Personal Contact Info</div>
                        <ul class="info-list">
                            <li>
                                <span class="label">Email Address</span>
                                <span class="value">${student.email || 'N/A'}</span>
                            </li>
                            <li>
                                <span class="label">Mobile Number</span>
                                <span class="value">${student.mobile || 'N/A'}</span>
                            </li>
                            <li>
                                <span class="label">Division / Class</span>
                                <span class="value">${student.division || 'N/A'}</span>
                            </li>
                        </ul>
                    </div>

                    <div class="section">
                        <div class="section-title">Institutional Info</div>
                        <ul class="info-list">
                            <li>
                                <span class="label">College Name</span>
                                <span class="value">${student.collegeName || 'N/A'}</span>
                            </li>
                            <li>
                                <span class="label">College Code</span>
                                <span class="value">${student.collegeCode || 'N/A'}</span>
                            </li>
                            <li>
                                <span class="label">Current Batch</span>
                                <span class="value">${student.batchName || 'N/A'}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="grid-2">
                    <div class="section">
                        <div class="section-title">Skills & Capabilities</div>
                        <div style="margin-bottom: 12px;">
                            <strong>Skills:</strong>
                            <div class="badge-container" style="margin-top: 5px;">
                                ${skillsBadges}
                            </div>
                        </div>
                        <div>
                            <strong>Summary:</strong>
                            <p style="margin: 5px 0 0 0; font-size: 13px; color: #475569;">
                                ${student.capabilities || 'No summary configured.'}
                            </p>
                        </div>
                    </div>

                    <div class="section">
                        <div class="section-title">Career Preferences</div>
                        <ul class="info-list">
                            <li>
                                <span class="label">Job Type</span>
                                <span class="value">${student.jobPreferences?.jobType || 'Any'}</span>
                            </li>
                            <li>
                                <span class="label">Expected CTC</span>
                                <span class="value">${student.jobPreferences?.expectedCTC || 'N/A'}</span>
                            </li>
                            <li>
                                <span class="label">Preferred Roles</span>
                                <span class="value">${student.jobPreferences?.preferredRoles && student.jobPreferences.preferredRoles.length > 0 
                                    ? student.jobPreferences.preferredRoles.join(', ') 
                                    : 'Any'
                                }</span>
                            </li>
                            <li>
                                <span class="label">Preferred Locations</span>
                                <span class="value">${student.jobPreferences?.preferredLocations && student.jobPreferences.preferredLocations.length > 0 
                                    ? student.jobPreferences.preferredLocations.join(', ') 
                                    : 'Any'
                                }</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">Attendance Metrics</div>
                    <ul class="info-list" style="margin-bottom: 15px;">
                        <li>
                            <span class="label">Sessions Attended</span>
                            <span class="value">${attendedSessions} out of ${totalSessions} total sessions</span>
                        </li>
                    </ul>
                </div>

                <div class="section">
                    <div class="section-title">Assessment & Exam Performance History</div>
                    ${examsTaken === 0 
                        ? '<p style="color:#64748b; font-size:13px;">No completed assessments logged on the platform.</p>'
                        : `
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Assessment / Exam</th>
                                    <th>Course</th>
                                    <th>Date Taken</th>
                                    <th>Score</th>
                                    <th>Percentage</th>
                                    <th>Result</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${attemptsRows}
                            </tbody>
                        </table>
                        `
                    }
                </div>

                <div class="footer">
                    Ethnotech Academy Placement Portal | Profile Report Generated on ${new Date().toLocaleDateString('en-IN')} ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </div>
            </body>
            </html>
        `;

        // Print using hidden iframe method
        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';
        document.body.appendChild(iframe);

        const iframeDoc = iframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(htmlContent);
        iframeDoc.close();

        // Give a small delay to load assets if any, and trigger printing
        setTimeout(() => {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
            
            // Remove the iframe after printing is initiated
            setTimeout(() => {
                document.body.removeChild(iframe);
            }, 1000);
        }, 300);
    };

    const handleAddSkill = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const skill = skillsInput.trim().replace(/,$/, '');
            if (skill && !skillsList.includes(skill)) {
                setSkillsList([...skillsList, skill]);
            }
            setSkillsInput('');
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setSkillsList(skillsList.filter(s => s !== skillToRemove));
    };

    const handleToggleRole = (role) => {
        if (prefRoles.includes(role)) {
            setPrefRoles(prefRoles.filter(r => r !== role));
        } else {
            setPrefRoles([...prefRoles, role]);
        }
    };

    const handleToggleLocation = (loc) => {
        if (prefLocations.includes(loc)) {
            setPrefLocations(prefLocations.filter(l => l !== loc));
        } else {
            setPrefLocations([...prefLocations, loc]);
        }
    };

    const handleSavePersonal = async (e) => {
        e.preventDefault();
        setProfileSaving(true);
        const data = {
            name: personalName.trim(),
            email: personalEmail.trim(),
            mobile: personalMobile.trim(),
            cgpa: personalCgpa !== '' ? parseFloat(personalCgpa) : 0,
            backlogs: personalBacklogs !== '' ? parseInt(personalBacklogs) : 0
        };
        const res = await updateProfile(data);
        setProfileSaving(false);
        if (res.success) {
            setAlertState({ open: true, title: 'Profile Updated', message: 'Personal details updated successfully.', type: 'success' });
        } else {
            setAlertState({ open: true, title: 'Update Failed', message: res.error || 'Failed to update personal details.', type: 'error' });
        }
    };

    const handleSaveSkills = async (e) => {
        e.preventDefault();
        setProfileSaving(true);
        const data = {
            skills: skillsList,
            capabilities
        };
        const res = await updateProfile(data);
        setProfileSaving(false);
        if (res.success) {
            setAlertState({ open: true, title: 'Skills Updated', message: 'Skills and capabilities updated successfully.', type: 'success' });
        } else {
            setAlertState({ open: true, title: 'Update Failed', message: res.error || 'Failed to update skills.', type: 'error' });
        }
    };

    const handleSavePreferences = async (e) => {
        e.preventDefault();
        setProfileSaving(true);
        const data = {
            jobPreferences: {
                preferredRoles: prefRoles,
                preferredLocations: prefLocations,
                expectedCTC: expectedCTC.trim(),
                jobType
            }
        };
        const res = await updateProfile(data);
        setProfileSaving(false);
        if (res.success) {
            setAlertState({ open: true, title: 'Preferences Updated', message: 'Career preferences updated successfully.', type: 'success' });
        } else {
            setAlertState({ open: true, title: 'Update Failed', message: res.error || 'Failed to update preferences.', type: 'error' });
        }
    };

    const handleResumeUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.type !== 'application/pdf') {
            setAlertState({ open: true, title: 'Format Error', message: 'Only PDF resume files are accepted.', type: 'error' });
            return;
        }
        setUploadingResume(true);
        const res = await uploadResume(file);
        setUploadingResume(false);
        if (res.success) {
            setAlertState({ open: true, title: 'Upload Successful', message: 'Resume uploaded and processed successfully.', type: 'success' });
            refreshStudentProfile();
        } else {
            setAlertState({ open: true, title: 'Upload Failed', message: res.error || 'Resume uploading failed.', type: 'error' });
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (!currentPw.trim() || !newPw.trim() || !confirmPw.trim()) {
            setAlertState({ open: true, title: 'Incomplete Fields', message: 'Please fill out all password fields.', type: 'info' });
            return;
        }
        if (newPw !== confirmPw) {
            setAlertState({ open: true, title: 'Mismatch', message: 'New password and confirmation passwords do not match.', type: 'error' });
            return;
        }
        if (newPw.length < 6) {
            setAlertState({ open: true, title: 'Length Error', message: 'New password must contain at least 6 characters.', type: 'error' });
            return;
        }

        setPwSaving(true);
        const res = await changePassword(currentPw.trim(), newPw.trim());
        setPwSaving(false);

        if (res.success) {
            setAlertState({ open: true, title: 'Success', message: 'Password updated successfully.', type: 'success' });
            setCurrentPw('');
            setNewPw('');
            setConfirmPw('');
        } else {
            setAlertState({ open: true, title: 'Update Failed', message: res.error || 'Failed to update password.', type: 'error' });
        }
    };

    const handleLaunchKeyExam = (e) => {
        e.preventDefault();
        if (!examLauncherKey.trim()) return;
        navigate(`/exam/${examLauncherKey.trim().toUpperCase()}`);
    };

    const handleDownloadCertificate = (attemptId) => {
        const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        window.open(`${baseURL}/exam/certificate/${attemptId}?rollNumber=${student?.usn}`, '_blank');
    };

    const openAddTodoModal = () => {
        setTodoEditingId(null);
        setTodoTitle('');
        setTodoDesc('');
        setTodoDueDate('');
        setTodoIsStarred(false);
        setTodoIsPriority(false);
        setTodoModalOpen(true);
    };

    const openEditTodoModal = (todo) => {
        setTodoEditingId(todo._id);
        setTodoTitle(todo.title);
        setTodoDesc(todo.description || '');
        setTodoDueDate(todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : '');
        setTodoIsStarred(todo.isStarred || false);
        setTodoIsPriority(todo.isPriority || false);
        setTodoModalOpen(true);
    };

    const handleSaveTodo = async (e) => {
        e.preventDefault();
        if (!todoTitle.trim()) return;

        const todoData = {
            title: todoTitle.trim(),
            description: todoDesc.trim(),
            dueDate: todoDueDate ? new Date(todoDueDate) : undefined,
            isStarred: todoIsStarred,
            isPriority: todoIsPriority
        };

        let res;
        if (todoEditingId) {
            res = await updateTodo(todoEditingId, todoData);
        } else {
            res = await addTodo(todoData);
        }

        if (res.success) {
            setTodoModalOpen(false);
            setTodoTitle('');
            setTodoDesc('');
            setTodoDueDate('');
            setTodoIsStarred(false);
            setTodoIsPriority(false);
            setTodoEditingId(null);
        } else {
            setAlertState({
                open: true,
                title: 'Error Saving Task',
                message: res.error || 'Failed to save task.',
                type: 'error'
            });
        }
    };

    const handleToggleComplete = async (todo) => {
        const newStatus = todo.status === 'completed' ? 'pending' : 'completed';
        const res = await updateTodo(todo._id, { status: newStatus });
        if (!res.success) {
            setAlertState({
                open: true,
                title: 'Error',
                message: res.error || 'Failed to update task completion.',
                type: 'error'
            });
        }
    };

    const handleToggleStar = async (todo) => {
        const res = await updateTodo(todo._id, { isStarred: !todo.isStarred });
        if (!res.success) {
            setAlertState({
                open: true,
                title: 'Error',
                message: res.error || 'Failed to update task star status.',
                type: 'error'
            });
        }
    };

    const handleTogglePriority = async (todo) => {
        const res = await updateTodo(todo._id, { isPriority: !todo.isPriority });
        if (!res.success) {
            setAlertState({
                open: true,
                title: 'Error',
                message: res.error || 'Failed to update task priority.',
                type: 'error'
            });
        }
    };

    const handleSoftDeleteTodo = async (todo) => {
        const res = await updateTodo(todo._id, { status: 'deleted' });
        if (!res.success) {
            setAlertState({
                open: true,
                title: 'Error',
                message: res.error || 'Failed to delete task.',
                type: 'error'
            });
        }
    };

    const handleRestoreTodo = async (todo) => {
        const res = await updateTodo(todo._id, { status: 'pending' });
        if (!res.success) {
            setAlertState({
                open: true,
                title: 'Error',
                message: res.error || 'Failed to restore task.',
                type: 'error'
            });
        }
    };

    const handlePermanentDeleteTodo = async (id) => {
        const res = await deleteTodo(id);
        if (!res.success) {
            setAlertState({
                open: true,
                title: 'Error',
                message: res.error || 'Failed to delete task permanently.',
                type: 'error'
            });
        }
    };

    const getFilterCounts = () => {
        const list = Array.isArray(todos) ? todos : [];
        return {
            all: list.filter(t => t.status !== 'deleted').length,
            starred: list.filter(t => t.isStarred && t.status !== 'deleted').length,
            priority: list.filter(t => t.isPriority && t.status !== 'deleted').length,
            schedule: list.filter(t => t.dueDate && t.status !== 'deleted').length,
            today: list.filter(t => t.dueDate && new Date(t.dueDate).toDateString() === new Date().toDateString() && t.status !== 'deleted').length,
            done: list.filter(t => t.status === 'completed').length,
            deleted: list.filter(t => t.status === 'deleted').length,
        };
    };



    const fetchStudentLeaderboard = async () => {
        setLoadingLeaderboard(true);
        try {
            const res = await api.get('/student/leaderboard', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setLeaderboardData(res.data.data);
            }
        } catch (err) {
            console.error('Error fetching leaderboard:', err.message);
        } finally {
            setLoadingLeaderboard(false);
        }
    };

    useEffect(() => {
        if (token && activeTab === 'leaderboard') {
            fetchStudentLeaderboard();
        }
    }, [activeTab, token, student]);

    const TAB_BANNERS = {
        'meta-batch': {
            badge: 'Meta Batch • Cohort',
            title: 'Your Batchmates (And The Ones Who Pretend To Study)',
            subtitle: 'Track your cohort, see who actually shows up, and remind yourself you are all competing for the same offer.'
        },
        'enter-exam': {
            badge: 'Live Assessment • Zero Chill',
            title: 'No Tab Switching. No ChatGPT. Just Vibes.',
            subtitle: 'Enter your exam key, lock your screen, and pretend you definitely revised that module last night.'
        },
        'exam-history': {
            badge: 'Scoreboard • Emotional Damage',
            title: 'Receipts Of Every MCQ You Guessed "C" On',
            subtitle: 'Review past attempts, download certificates to flex on LinkedIn, and silently judge your accuracy.'
        },
        'profile': {
            badge: 'Student Identity • Placement Ready',
            title: 'Convince Recruiters You Are More Than A CGPA',
            subtitle: 'Keep your skills, resume, and academic stats updated before the placement cell sends a "last warning" mail.'
        },
        'placement': {
            badge: 'Campus Placements • Hunger Games',
            title: 'Manifesting That Offer Letter Before Sem Ends',
            subtitle: 'Check eligibility, track drives, and pray the cutoff doesn’t randomly jump from 6.5 to 8.0 CGPA.'
        },
        'attendance': {
            badge: '75% Rule • Survival Mode',
            title: 'Walking The Tightrope Between Condonation & Sleep',
            subtitle: 'Every session matters when you are one missed morning class away from begging the HOD.'
        },
        'todo': {
            badge: 'Tasks • Procrastination Tracker',
            title: 'Things You Swore You Would Finish Yesterday',
            subtitle: 'Write down your study goals, ignore them for 3 hours, and then speedrun them at 11:58 PM.'
        },
        'study-material': {
            badge: 'Study Material • Zero Excuses',
            title: 'Notes You Downloaded And Never Opened',
            subtitle: 'Access batch handouts uploaded by your trainer or revise SPOC-curated LMS guides before placement season hits.'
        },
        'games': {
            badge: 'Brain Gym • Productive Break',
            title: 'Technically Studying Because It Says "Brain Games"',
            subtitle: 'Warm up those last two surviving brain cells before going back to debugging missing semicolons.'
        },
        'type-speed': {
            badge: 'WPM Arena • Keyboard Warrior',
            title: 'Two-Finger Typing Won’t Pass The Coding Round',
            subtitle: 'Test your raw WPM and accuracy. Bonus points if you don’t look down at the keyboard.'
        },
        'company-arena': {
            badge: 'Company Arena • Real Compiler',
            title: 'Practice What Companies Actually Ask (Not Just FizzBuzz)',
            subtitle: 'Curated service, product & startup rounds. Real code execution—no regex shortcuts, no excuses.'
        },
        'locked-in': {
            badge: 'Company Arena • Real Compiler',
            title: 'Practice What Companies Actually Ask (Not Just FizzBuzz)',
            subtitle: 'Curated service, product & startup rounds. Real code execution—no regex shortcuts, no excuses.'
        },
        'security': {
            badge: 'Security • Don’t Get Hacked',
            title: 'Please Tell Us Your Password Isn’t "123456"',
            subtitle: 'Update your password before your roommate logs in and submits your assessment with blank answers.'
        }
    };

    const currentTabBanner = activeTab !== 'dashboard' ? TAB_BANNERS[activeTab] : null;

    return (
        <div className="space-y-6">
            {/* Glassmorphic Profile Banner - Only shown on Dashboard tab */}
            {activeTab === 'dashboard' && (
                <div className="bg-gradient-to-r from-[#5899B5] to-[#3D7690] rounded-[2rem] text-white p-8 sm:p-10 shadow-lg relative overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="space-y-3">
                            <span className="bg-white/15 border border-white/20 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider inline-block">
                                Student Portal
                            </span>
                            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
                                Welcome, {student?.name || 'Candidate'}
                            </h1>
                            <p className="text-blue-100/90 text-sm sm:text-base max-w-xl font-medium">
                                Keep track of your assessments, view evaluation certificates, and manage your academic & career placement profile.
                            </p>
                        </div>
                        
                        <div className="flex items-center justify-end w-full md:w-auto shrink-0">
                            <StudentBannerSvg activeTab={activeTab} profileSubTab={profileSubTab} />
                        </div>
                    </div>
                </div>
            )}

            {/* Compact Sarcastic Banner for Every Other Tab */}
            {currentTabBanner && (
                <div className="bg-gradient-to-r from-[#5899B5] to-[#3D7690] rounded-2xl text-white px-6 py-4 sm:px-7 sm:py-5 shadow-md relative overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="space-y-1.5">
                            <span className="bg-white/15 border border-white/20 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider inline-block">
                                {currentTabBanner.badge}
                            </span>
                            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
                                {currentTabBanner.title}
                            </h2>
                            <p className="text-blue-100/90 text-xs sm:text-sm max-w-2xl font-medium">
                                {currentTabBanner.subtitle}
                            </p>
                        </div>

                        <div className="flex items-center justify-end w-full md:w-auto shrink-0">
                            <StudentBannerSvg activeTab={activeTab} profileSubTab={profileSubTab} compact />
                        </div>
                    </div>
                </div>
            )}

            {/* Tab Panels */}
            <div className="space-y-8">
                        {activeTab === 'dashboard' && (() => {
                            const passedAttemptsCount = actualAttempts.filter(a => a.result === 'pass').length;
                            const avgScorePct = actualAttempts.length > 0
                                ? (actualAttempts.reduce((sum, a) => sum + a.percentage, 0) / actualAttempts.length).toFixed(1)
                                : '0.0';
                            const bestScorePct = actualAttempts.length > 0
                                ? Math.max(...actualAttempts.map(a => a.percentage || 0)).toFixed(1)
                                : '0.0';
                            const attendancePct = student?.attendance?.percentage ?? 0;
                            const attendedSessionsCount = student?.attendance?.attended ?? 0;
                            const totalSessionsCount = student?.attendance?.totalSessions ?? 0;

                            // Profile & Placement readiness calculation
                            const profileChecks = [
                                Boolean(student?.name && student?.email && student?.mobile),
                                student?.cgpa !== undefined && student?.cgpa !== null && student?.cgpa !== '',
                                Array.isArray(student?.skills) && student.skills.length > 0,
                                Boolean(student?.resumeUrl),
                                Array.isArray(student?.jobPreferences?.preferredRoles) && student.jobPreferences.preferredRoles.length > 0
                            ];
                            const profileCompletionPct = Math.round((profileChecks.filter(Boolean).length / profileChecks.length) * 100);

                            const recentAttempts = actualAttempts.slice(0, 4);
                            const recentAttendance = Array.isArray(student?.attendance?.history)
                                ? [...student.attendance.history]
                                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                                    .slice(0, 4)
                                : [];
                            const pendingTodos = (Array.isArray(todos) ? todos : [])
                                .filter(t => t.status !== 'completed' && t.status !== 'deleted')
                                .slice(0, 4);
                            const eligibleDrivesCount = placementJobs.filter(j => j.eligibility?.eligible).length;
                            const appliedDrivesCount = placementJobs.filter(j => j.isApplied).length;

                            return (
                                <div className="space-y-8">
                                    {/* Row 1: 4 Interactive KPI Summary Cards */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                                        <div
                                            onClick={() => switchTab('exam-history')}
                                            className="bg-white border border-slate-100 shadow-sm rounded-[1.5rem] p-6 flex items-center justify-between gap-4 hover:shadow-md hover:border-[#5899B5]/30 transition-all duration-300 cursor-pointer group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="p-4 bg-blue-50 text-[#5899B5] rounded-2xl group-hover:scale-105 transition-transform">
                                                    <BookOpen size={24} />
                                                </div>
                                                <div>
                                                    <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Exams Taken</span>
                                                    <span className="text-2xl font-semibold text-slate-800">{actualAttempts.length}</span>
                                                    <span className="text-xs font-semibold text-emerald-600 block mt-0.5">
                                                        {passedAttemptsCount} Passed • {activeExams.filter(e => !e.isCompleted).length} Live
                                                    </span>
                                                </div>
                                            </div>
                                            <ArrowRight size={16} className="text-slate-300 group-hover:text-[#5899B5] transition-colors shrink-0" />
                                        </div>

                                        <div
                                            onClick={() => switchTab('exam-history')}
                                            className="bg-white border border-slate-100 shadow-sm rounded-[1.5rem] p-6 flex items-center justify-between gap-4 hover:shadow-md hover:border-emerald-500/30 transition-all duration-300 cursor-pointer group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-105 transition-transform">
                                                    <Award size={24} />
                                                </div>
                                                <div>
                                                    <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Average Score</span>
                                                    <span className="text-2xl font-semibold text-slate-800">{avgScorePct}%</span>
                                                    <span className="text-xs font-semibold text-slate-500 block mt-0.5">
                                                        Best Score: {bestScorePct}%
                                                    </span>
                                                </div>
                                            </div>
                                            <ArrowRight size={16} className="text-slate-300 group-hover:text-emerald-600 transition-colors shrink-0" />
                                        </div>

                                        <div
                                            onClick={() => switchTab('attendance')}
                                            className="bg-white border border-slate-100 shadow-sm rounded-[1.5rem] p-6 flex items-center justify-between gap-4 hover:shadow-md hover:border-amber-500/30 transition-all duration-300 cursor-pointer group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl group-hover:scale-105 transition-transform">
                                                    <CalendarCheck size={24} />
                                                </div>
                                                <div>
                                                    <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Attendance Rate</span>
                                                    <span className="text-2xl font-semibold text-slate-800">{attendancePct}%</span>
                                                    <span className="text-xs font-semibold text-slate-500 block mt-0.5">
                                                        {attendedSessionsCount} / {totalSessionsCount} Sessions
                                                    </span>
                                                </div>
                                            </div>
                                            <ArrowRight size={16} className="text-slate-300 group-hover:text-amber-600 transition-colors shrink-0" />
                                        </div>

                                        <div
                                            onClick={() => switchTab('profile', 'personal')}
                                            className="bg-white border border-slate-100 shadow-sm rounded-[1.5rem] p-6 flex items-center justify-between gap-4 hover:shadow-md hover:border-purple-500/30 transition-all duration-300 cursor-pointer group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl group-hover:scale-105 transition-transform">
                                                    <Briefcase size={24} />
                                                </div>
                                                <div>
                                                    <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Profile Readiness</span>
                                                    <span className="text-2xl font-semibold text-slate-800">{profileCompletionPct}%</span>
                                                    <span className="text-xs font-semibold text-purple-600 block mt-0.5">
                                                        CGPA: {student?.cgpa || 'N/A'} • {eligibleDrivesCount} Eligible Drives
                                                    </span>
                                                </div>
                                            </div>
                                            <ArrowRight size={16} className="text-slate-300 group-hover:text-purple-600 transition-colors shrink-0" />
                                        </div>
                                    </div>

                                    {/* Row 2: Student Command Center & Direct Exam Key Launcher */}
                                    <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-8 space-y-6">
                                        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                                            <div className="flex items-center gap-5">
                                                <StudentTabSvg type="dashboard" className="w-52 shrink-0 hidden md:block" />
                                                <div className="space-y-2">
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-[#5899B5] uppercase tracking-wider">
                                                        Student Command Hub
                                                    </span>
                                                    <h3 className="text-lg sm:text-xl font-semibold text-slate-800">
                                                        Quick Actions & Direct Exam Key Launcher
                                                    </h3>
                                                    <p className="text-slate-500 text-xs sm:text-sm max-w-xl">
                                                        Enter a session key from your trainer to launch a live assessment immediately, or jump straight to your academic and placement modules.
                                                    </p>
                                                </div>
                                            </div>

                                            <form onSubmit={handleLaunchKeyExam} className="flex gap-3 w-full xl:w-auto max-w-md shrink-0">
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="Enter Exam Key"
                                                    className="px-5 py-3 border border-slate-200 rounded-2xl outline-none font-semibold font-mono focus:border-[#5899B5] uppercase w-full xl:w-44 text-sm"
                                                    value={examLauncherKey}
                                                    onChange={(e) => setExamLauncherKey(e.target.value)}
                                                />
                                                <button
                                                    type="submit"
                                                    disabled={!examLauncherKey.trim()}
                                                    className="px-6 py-3 bg-[#5899B5] hover:bg-[#3D7690] text-white font-semibold rounded-2xl flex items-center gap-2 cursor-pointer transition active:scale-[0.97] text-sm whitespace-nowrap disabled:opacity-50"
                                                >
                                                    Launch <ArrowRight size={16} />
                                                </button>
                                            </form>
                                        </div>

                                        {/* Quick Navigation Pills */}
                                        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2.5">
                                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2">Quick Jump:</span>
                                            {[
                                                { label: 'Meta Batch', tab: 'meta-batch', icon: BookOpen },
                                                { label: 'Enter Exam', tab: 'enter-exam', icon: FileText },
                                                { label: 'Exam History', tab: 'exam-history', icon: Trophy },
                                                { label: 'Update Profile', tab: 'profile', sub: 'personal', icon: User },
                                                { label: 'Upload Resume', tab: 'profile', sub: 'resume', icon: Upload },
                                                { label: 'Campus Drives', tab: 'placement', icon: Briefcase },
                                                { label: 'Attendance Log', tab: 'attendance', icon: CalendarCheck },
                                                { label: 'To-do List', tab: 'todo', icon: CheckCircle },
                                                { label: 'Brain Games', tab: 'games', icon: Award },
                                                { label: 'Type Speed', tab: 'type-speed', icon: Key },
                                                { label: 'Company Arena', tab: 'company-arena', icon: Building2 }
                                            ].map((q) => (
                                                <button
                                                    key={`${q.tab}-${q.sub || ''}`}
                                                    type="button"
                                                    onClick={() => switchTab(q.tab, q.sub)}
                                                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-[#5899B5] border border-slate-200/70 hover:border-blue-200 text-xs font-semibold transition cursor-pointer"
                                                >
                                                    <q.icon size={14} />
                                                    {q.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Row 3: 2-Column Comprehensive Student Overview Grid */}
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                                        {/* Left Column (7 cols): Active Assessments, Recent Exam Results, Placement Drives */}
                                        <div className="lg:col-span-7 space-y-8">
                                            {/* Active Assessments Card */}
                                            <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-8 space-y-5">
                                                <div className="flex items-center justify-between gap-4">
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-slate-800">Active Assessments</h3>
                                                        <p className="text-slate-500 text-xs sm:text-sm">Live exams currently available for you to take.</p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => switchTab('enter-exam')}
                                                        className="text-xs font-semibold text-[#5899B5] hover:text-[#3D7690] flex items-center gap-1 cursor-pointer shrink-0"
                                                    >
                                                        View All ({activeExams.length}) <ArrowRight size={14} />
                                                    </button>
                                                </div>

                                                {loadingExams ? (
                                                    <div className="flex justify-center items-center py-8">
                                                        <Loader2 className="animate-spin text-[#5899B5]" size={26} />
                                                    </div>
                                                ) : activeExams.length === 0 ? (
                                                    <div className="flex flex-col items-center justify-center py-10 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                                        <AlertCircle className="text-slate-400 mb-2" size={28} />
                                                        <p className="text-slate-700 font-semibold text-sm">No Live Assessments Right Now</p>
                                                        <p className="text-slate-400 text-xs max-w-xs mt-1">When your instructor starts a batch assessment, it will appear here immediately.</p>
                                                    </div>
                                                ) : (
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        {activeExams.slice(0, 4).map((item, idx) => (
                                                            <div key={idx} className="border border-slate-100 rounded-2xl p-4 hover:shadow-md hover:border-[#5899B5]/20 transition-all duration-300 bg-white flex flex-col justify-between group">
                                                                <div>
                                                                    <div className="flex justify-between items-start gap-2">
                                                                        <span className="text-[10px] font-semibold text-[#5899B5] uppercase bg-blue-50 px-2.5 py-1 rounded-full tracking-wider truncate max-w-[140px]">
                                                                            {item.exam.courseName || 'Course'}
                                                                        </span>
                                                                        {item.isCompleted ? (
                                                                            <span className="bg-emerald-50 text-emerald-600 text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full">Completed</span>
                                                                        ) : !item.isStarted ? (
                                                                            <span className="bg-amber-50 text-amber-600 text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full">Waiting</span>
                                                                        ) : (
                                                                            <span className="bg-blue-500 text-white text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full animate-pulse">Active</span>
                                                                        )}
                                                                    </div>
                                                                    <h4 className="text-sm font-semibold text-slate-800 mt-2.5 group-hover:text-[#5899B5] transition-colors leading-snug">
                                                                        {item.exam.title}
                                                                    </h4>
                                                                    <div className="flex items-center gap-4 mt-3 text-xs font-semibold text-slate-500">
                                                                        <span className="flex items-center gap-1"><Clock size={13} className="text-slate-400" /> {item.exam.duration}m</span>
                                                                        <span className="flex items-center gap-1"><Award size={13} className="text-slate-400" /> {item.exam.totalMarks} Marks</span>
                                                                    </div>
                                                                </div>
                                                                <div className="mt-4 pt-2.5 border-t border-slate-50">
                                                                    {item.isCompleted ? (
                                                                        <button
                                                                            onClick={() => navigate(`/exam/${item.sessionKey}`)}
                                                                            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition"
                                                                        >
                                                                            Review Results
                                                                        </button>
                                                                    ) : !item.isStarted ? (
                                                                        <div className="w-full py-2 bg-slate-50 text-slate-400 font-semibold rounded-xl text-xs flex items-center justify-center border border-slate-100">
                                                                            Waiting for Instructor
                                                                        </div>
                                                                    ) : (
                                                                        <button
                                                                            onClick={() => navigate(`/exam/${item.sessionKey}`)}
                                                                            className="w-full py-2 bg-[#5899B5] hover:bg-[#3D7690] text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition shadow-sm"
                                                                        >
                                                                            Launch Test <ArrowRight size={13} />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Recent Assessment Results Card */}
                                            <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-8 space-y-5">
                                                <div className="flex items-center justify-between gap-4">
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-slate-800">Recent Assessment Results</h3>
                                                        <p className="text-slate-500 text-xs sm:text-sm">Your latest completed exams, scores, and certificates.</p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => switchTab('exam-history')}
                                                        className="text-xs font-semibold text-[#5899B5] hover:text-[#3D7690] flex items-center gap-1 cursor-pointer shrink-0"
                                                    >
                                                        Full History <ArrowRight size={14} />
                                                    </button>
                                                </div>

                                                {loadingAttempts ? (
                                                    <div className="flex justify-center items-center py-8">
                                                        <Loader2 className="animate-spin text-[#5899B5]" size={26} />
                                                    </div>
                                                ) : recentAttempts.length === 0 ? (
                                                    <div className="flex flex-col items-center justify-center py-10 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                                        <Trophy className="text-slate-400 mb-2" size={28} />
                                                        <p className="text-slate-700 font-semibold text-sm">No Exam Results Yet</p>
                                                        <p className="text-slate-400 text-xs mt-1">Your completed exam scores and certificates will appear here.</p>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-3">
                                                        {recentAttempts.map((attempt) => {
                                                            const exam = attempt.examId;
                                                            const dateStr = attempt.completedAt
                                                                ? new Date(attempt.completedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                                                                : new Date(attempt.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
                                                            const pct = Number(attempt.percentage || 0);

                                                            return (
                                                                <div key={attempt._id} className="p-4 rounded-2xl border border-slate-100 hover:border-slate-200 bg-slate-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition">
                                                                    <div className="space-y-1 flex-1 min-w-0">
                                                                        <div className="flex items-center gap-2 flex-wrap">
                                                                            <p className="font-semibold text-slate-800 text-sm truncate">{exam?.title || 'Assessment'}</p>
                                                                            {attempt.result === 'pass' ? (
                                                                                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-emerald-100">Pass</span>
                                                                            ) : (
                                                                                <span className="bg-rose-50 text-rose-700 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-rose-100">Fail</span>
                                                                            )}
                                                                        </div>
                                                                        <p className="text-xs text-slate-400 font-medium">
                                                                            {exam?.courseId?.name || 'Course Assessment'} • {dateStr}
                                                                        </p>
                                                                        <div className="w-full max-w-xs bg-slate-200/70 h-1.5 rounded-full overflow-hidden mt-1.5">
                                                                            <div
                                                                                className={`h-full rounded-full ${attempt.result === 'pass' ? 'bg-emerald-500' : 'bg-rose-500'}`}
                                                                                style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                                                                        <div className="text-left sm:text-right">
                                                                            <p className="text-sm font-semibold text-slate-800">
                                                                                {attempt.totalScore} / {exam?.totalMarks || 0}
                                                                            </p>
                                                                            <p className="text-xs font-semibold text-slate-500">{pct.toFixed(1)}%</p>
                                                                        </div>
                                                                        <div className="flex items-center gap-1.5">
                                                                            {exam?.settings?.allowReview !== false && (
                                                                                <button
                                                                                    onClick={() => navigate(`/exam/${attempt.sessionId}`)}
                                                                                    className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold rounded-xl transition cursor-pointer"
                                                                                >
                                                                                    Review
                                                                                </button>
                                                                            )}
                                                                            {attempt.result === 'pass' && (exam?.settings?.enableCertificate || attempt.certificateId) && (
                                                                                <button
                                                                                    onClick={() => handleDownloadCertificate(attempt._id)}
                                                                                    className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-100 text-xs font-semibold rounded-xl transition flex items-center gap-1 cursor-pointer"
                                                                                    title="Download Certificate"
                                                                                >
                                                                                    <Download size={12} /> Cert
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Campus Placement Drives Snapshot */}
                                            <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-8 space-y-5">
                                                <div className="flex items-center justify-between gap-4">
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-slate-800">Campus Placement Opportunities</h3>
                                                        <p className="text-slate-500 text-xs sm:text-sm">
                                                            {eligibleDrivesCount} eligible drives • {appliedDrivesCount} applications submitted
                                                        </p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => switchTab('placement')}
                                                        className="text-xs font-semibold text-[#5899B5] hover:text-[#3D7690] flex items-center gap-1 cursor-pointer shrink-0"
                                                    >
                                                        Explore Drives <ArrowRight size={14} />
                                                    </button>
                                                </div>

                                                {loadingPlacementJobs ? (
                                                    <div className="flex justify-center items-center py-8">
                                                        <Loader2 className="animate-spin text-[#5899B5]" size={26} />
                                                    </div>
                                                ) : placementJobs.length === 0 ? (
                                                    <div className="flex flex-col items-center justify-center py-10 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                                        <Briefcase className="text-slate-400 mb-2" size={28} />
                                                        <p className="text-slate-700 font-semibold text-sm">No Active Placement Drives</p>
                                                        <p className="text-slate-400 text-xs max-w-xs mt-1">Keep your CGPA, skills, and resume updated to qualify when new drives open.</p>
                                                    </div>
                                                ) : (
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        {placementJobs.slice(0, 4).map((job) => {
                                                            const isEligible = job.eligibility?.eligible;
                                                            return (
                                                                <div
                                                                    key={job._id}
                                                                    onClick={() => switchTab('placement')}
                                                                    className="border border-slate-100 rounded-2xl p-4 hover:shadow-md hover:border-[#5899B5]/20 transition cursor-pointer bg-white flex flex-col justify-between gap-3"
                                                                >
                                                                    <div>
                                                                        <div className="flex items-center justify-between gap-2">
                                                                            <span className="text-[10px] font-semibold text-[#5899B5] uppercase bg-blue-50 px-2.5 py-0.5 rounded-full truncate">
                                                                                {job.company}
                                                                            </span>
                                                                            {job.isApplied ? (
                                                                                <span className="bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-semibold px-2 py-0.5 rounded-full">Applied</span>
                                                                            ) : isEligible ? (
                                                                                <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-semibold px-2 py-0.5 rounded-full">Eligible</span>
                                                                            ) : (
                                                                                <span className="bg-rose-50 text-rose-600 border border-rose-100 text-[10px] font-semibold px-2 py-0.5 rounded-full">Check Criteria</span>
                                                                            )}
                                                                        </div>
                                                                        <h4 className="text-sm font-semibold text-slate-800 mt-2 leading-snug">{job.title}</h4>
                                                                    </div>
                                                                    <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold text-slate-500 pt-2 border-t border-slate-50">
                                                                        {job.location && <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>}
                                                                        {job.salaryPackage && <span className="flex items-center gap-1"><DollarSign size={12} /> {job.salaryPackage}</span>}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Right Column (5 cols): Attendance Feed & Pending Tasks */}
                                        <div className="lg:col-span-5 space-y-8">
                                            {/* Recent Class Attendance Feed */}
                                            <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-8 space-y-5">
                                                <div className="flex items-center justify-between gap-4">
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-slate-800">Recent Class Attendance</h3>
                                                        <p className="text-slate-500 text-xs sm:text-sm">Latest recorded training sessions.</p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => switchTab('attendance')}
                                                        className="text-xs font-semibold text-[#5899B5] hover:text-[#3D7690] flex items-center gap-1 cursor-pointer shrink-0"
                                                    >
                                                        Full Log <ArrowRight size={14} />
                                                    </button>
                                                </div>

                                                {recentAttendance.length === 0 ? (
                                                    <div className="flex flex-col items-center justify-center py-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                                        <CalendarCheck className="text-slate-400 mb-2" size={26} />
                                                        <p className="text-slate-700 font-semibold text-xs">No Attendance Sessions Recorded</p>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-2.5">
                                                        {recentAttendance.map((sess) => {
                                                            const dateStr = new Date(sess.date).toLocaleDateString('en-IN', {
                                                                day: 'numeric',
                                                                month: 'short'
                                                            });
                                                            const badgeClass = sess.status === 'present'
                                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                                : sess.status === 'absent'
                                                                    ? 'bg-rose-50 text-rose-700 border-rose-100'
                                                                    : 'bg-amber-50 text-amber-700 border-amber-100';

                                                            return (
                                                                <div key={sess._id} className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/40 flex items-center justify-between gap-3">
                                                                    <div className="min-w-0">
                                                                        <p className="text-xs font-semibold text-slate-800 truncate">
                                                                            {sess.topic || sess.module || 'Training Session'}
                                                                        </p>
                                                                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                                                                            {dateStr} • {sess.module} (Hr {sess.period}) • {sess.trainerName}
                                                                        </p>
                                                                    </div>
                                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase border shrink-0 ${badgeClass}`}>
                                                                        {sess.status}
                                                                    </span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Pending Tasks & Deadlines (To-do List) */}
                                            <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-8 space-y-5">
                                                <div className="flex items-center justify-between gap-4">
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-slate-800">Pending Tasks & Deadlines</h3>
                                                        <p className="text-slate-500 text-xs sm:text-sm">Stay on top of your study action items.</p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => switchTab('todo')}
                                                        className="text-xs font-semibold text-[#5899B5] hover:text-[#3D7690] flex items-center gap-1 cursor-pointer shrink-0"
                                                    >
                                                        Manage Tasks <ArrowRight size={14} />
                                                    </button>
                                                </div>

                                                {pendingTodos.length === 0 ? (
                                                    <div className="flex flex-col items-center justify-center py-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                                        <CheckCircle className="text-emerald-500 mb-2" size={26} />
                                                        <p className="text-slate-700 font-semibold text-xs">All Caught Up!</p>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                switchTab('todo');
                                                                openAddTodoModal();
                                                            }}
                                                            className="mt-2 text-xs font-semibold text-amber-600 hover:underline cursor-pointer"
                                                        >
                                                            + Add a new task
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-2.5">
                                                        {pendingTodos.map((todo) => {
                                                            const dueStr = todo.dueDate
                                                                ? new Date(todo.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                                                                : null;
                                                            return (
                                                                <div key={todo._id} className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/40 flex items-start justify-between gap-3">
                                                                    <div className="flex items-start gap-3 min-w-0">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleToggleComplete(todo)}
                                                                            className="mt-0.5 w-4 h-4 rounded border border-slate-300 hover:border-amber-500 flex items-center justify-center shrink-0 cursor-pointer"
                                                                            title="Mark as completed"
                                                                        />
                                                                        <div className="min-w-0">
                                                                            <p className="text-xs font-semibold text-slate-800 truncate">{todo.title}</p>
                                                                            <div className="flex items-center gap-2 mt-1">
                                                                                {dueStr && (
                                                                                    <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                                                                        Due {dueStr}
                                                                                    </span>
                                                                                )}
                                                                                {todo.isPriority && (
                                                                                    <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                                                                                        Priority
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    {todo.isStarred && <Star size={14} className="text-amber-500 shrink-0" fill="currentColor" />}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}

                        {activeTab === 'meta-batch' && (() => {
                            const batchObj = typeof student?.batchId === 'object' && student?.batchId !== null ? student.batchId : {};
                            const courseObj = typeof batchObj?.courseId === 'object' && batchObj?.courseId !== null ? batchObj.courseId : {};
                            const trainerObj = typeof batchObj?.trainerId === 'object' && batchObj?.trainerId !== null ? batchObj.trainerId : {};
                            const collegeObj = typeof student?.collegeId === 'object' && student?.collegeId !== null ? student.collegeId : {};

                            const batchName = batchObj.batchName || student?.batchName || 'Assigned Batch';
                            const batchStatus = batchObj.status || 'active';
                            const batchProgram = batchObj.program || courseObj.program || 'Standard Track';
                            const batchDepartment = batchObj.department || student?.department || 'N/A';
                            const batchStrength = student?.batchStrength || batchObj.studentCount || 0;
                            const batchStartDate = batchObj.startDate
                                ? new Date(batchObj.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                                : batchObj.createdAt
                                    ? new Date(batchObj.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                                    : 'Ongoing';
                            const batchEndDate = batchObj.endDate
                                ? new Date(batchObj.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                                : 'Active Cohort';

                            const collegeName = collegeObj.name || student?.collegeName || 'N/A';
                            const collegeCode = collegeObj.code || student?.collegeCode || 'N/A';
                            const collegeAddress = collegeObj.address || '';

                            const courseName = courseObj.name || student?.courseName || 'Assigned Curriculum';
                            const courseCode = courseObj.code || student?.courseCode || 'N/A';
                            const courseDuration = courseObj.duration || 'Full Semester Track';
                            const courseModulesCount = courseObj.modulesCount || 5;
                            const courseDescription = courseObj.description || 'Comprehensive technical and aptitude training curriculum tailored for your batch cohort.';

                            const trainerFullName = trainerObj.firstName
                                ? `${trainerObj.firstName} ${trainerObj.lastName || ''}`.trim()
                                : (student?.trainerName || (Array.isArray(student?.attendance?.history) && student.attendance.history[0]?.trainerName) || 'Assigned Faculty');
                            const trainerEmail = trainerObj.email || 'Managed via Batch Coordinator';
                            const trainerPhone = trainerObj.phone || 'Available in Class Sessions';

                            const attendanceHistory = Array.isArray(student?.attendance?.history) ? student.attendance.history : [];
                            const totalSessions = student?.attendance?.totalSessions ?? attendanceHistory.length;
                            const attendedSessions = student?.attendance?.attended ?? 0;
                            const attendancePct = student?.attendance?.percentage ?? 0;

                            // Group sessions by module for curriculum breakdown
                            const moduleMap = {};
                            attendanceHistory.forEach((sess) => {
                                const modName = sess.module || 'Module 1';
                                if (!moduleMap[modName]) {
                                    moduleMap[modName] = {
                                        module: modName,
                                        sessionsCount: 0,
                                        attendedCount: 0,
                                        topics: [],
                                        trainerName: sess.trainerName || trainerFullName,
                                        lastDate: sess.date
                                    };
                                }
                                moduleMap[modName].sessionsCount += 1;
                                if (sess.status === 'present' || sess.status === 'late') {
                                    moduleMap[modName].attendedCount += 1;
                                }
                                if (sess.topic && !moduleMap[modName].topics.includes(sess.topic)) {
                                    moduleMap[modName].topics.push(sess.topic);
                                }
                            });
                            const moduleSummaries = Object.values(moduleMap);

                            return (
                                <div className="space-y-8 font-sans">
                                    {/* Batch Header Card */}
                                    <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                                        <div className="space-y-3 max-w-2xl">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-50 text-[#5899B5] border border-blue-100">
                                                    {batchProgram}
                                                </span>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${
                                                    batchStatus === 'active'
                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                        : batchStatus === 'completed'
                                                            ? 'bg-slate-100 text-slate-700 border-slate-200'
                                                            : 'bg-amber-50 text-amber-700 border-amber-100'
                                                }`}>
                                                    {batchStatus} Batch
                                                </span>
                                                <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-100">
                                                    Dept: {batchDepartment}
                                                </span>
                                            </div>
                                            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-800">
                                                {batchName}
                                            </h2>
                                            <p className="text-slate-500 text-sm leading-relaxed">
                                                Complete batch metadata, enrolled institution & student identity, assigned course curriculum, faculty details, and module-wise session progress.
                                            </p>
                                        </div>
                                        <StudentTabSvg type="meta-batch" className="w-60 shrink-0 hidden sm:block" />
                                    </div>

                                    {/* 4 Batch KPI Cards */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                                        <div className="bg-white border border-slate-100 shadow-sm rounded-[1.5rem] p-6 flex items-center gap-4">
                                            <div className="p-4 bg-blue-50 text-[#5899B5] rounded-2xl">
                                                <User size={24} />
                                            </div>
                                            <div>
                                                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">USN / Roll ID</span>
                                                <span className="text-xl font-semibold font-mono text-slate-800">{student?.usn || 'N/A'}</span>
                                                <span className="text-xs font-semibold text-slate-500 block mt-0.5">
                                                    {batchStrength > 0 ? `${batchStrength} Students in Batch` : `Sem ${student?.semester || 'N/A'} Cohort`}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="bg-white border border-slate-100 shadow-sm rounded-[1.5rem] p-6 flex items-center gap-4">
                                            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
                                                <BookOpen size={24} />
                                            </div>
                                            <div className="min-w-0">
                                                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Course Track</span>
                                                <span className="text-lg font-semibold text-slate-800 truncate block" title={courseName}>{courseName}</span>
                                                <span className="text-xs font-semibold text-emerald-600 block mt-0.5">
                                                    Code: {courseCode} • {courseModulesCount} Modules
                                                </span>
                                            </div>
                                        </div>

                                        <div className="bg-white border border-slate-100 shadow-sm rounded-[1.5rem] p-6 flex items-center gap-4">
                                            <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl">
                                                <CalendarCheck size={24} />
                                            </div>
                                            <div>
                                                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Batch Sessions</span>
                                                <span className="text-2xl font-semibold text-slate-800">{totalSessions}</span>
                                                <span className="text-xs font-semibold text-amber-600 block mt-0.5">
                                                    {attendedSessions} Attended ({attendancePct}%)
                                                </span>
                                            </div>
                                        </div>

                                        <div className="bg-white border border-slate-100 shadow-sm rounded-[1.5rem] p-6 flex items-center gap-4">
                                            <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl">
                                                <Award size={24} />
                                            </div>
                                            <div>
                                                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Batch Assessments</span>
                                                <span className="text-2xl font-semibold text-slate-800">{actualAttempts.length}</span>
                                                <span className="text-xs font-semibold text-purple-600 block mt-0.5">
                                                    {activeExams.length} Active / Assigned
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 2-Column Detailed Batch Metadata Grid */}
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                                        {/* Left Card: Batch, College & Student Enrollment Metadata */}
                                        <div className="lg:col-span-6 bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-8 space-y-6">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div>
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold bg-blue-50 text-[#5899B5] border border-blue-100 uppercase tracking-wider mb-1.5">
                                                        Institution & Cohort
                                                    </span>
                                                    <h3 className="text-lg font-semibold text-slate-800">Batch & Institutional Metadata</h3>
                                                    <p className="text-slate-500 text-xs sm:text-sm">Official enrollment, college, and cohort details for your account.</p>
                                                </div>
                                                <StudentTabSvg type="profile-academic" className="w-48 shrink-0 hidden sm:block" />
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
                                                    <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider block">Batch Name</span>
                                                    <span className="text-slate-800 font-semibold text-sm mt-1 block">{batchName}</span>
                                                </div>
                                                <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
                                                    <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider block">USN / Roll Number</span>
                                                    <span className="text-slate-800 font-semibold font-mono text-sm mt-1 block">{student?.usn || 'N/A'}</span>
                                                </div>
                                                <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 sm:col-span-2">
                                                    <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider block">College / Institution</span>
                                                    <span className="text-slate-800 font-semibold text-sm mt-1 block">{collegeName}</span>
                                                    <span className="text-slate-500 text-xs font-medium mt-0.5 block">
                                                        Institution Code: <span className="font-mono font-semibold text-slate-700">{collegeCode}</span>
                                                        {collegeAddress ? ` • ${collegeAddress}` : ''}
                                                    </span>
                                                </div>
                                                <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
                                                    <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider block">Department / Branch</span>
                                                    <span className="text-slate-800 font-semibold text-sm mt-1 block uppercase">{batchDepartment}</span>
                                                </div>
                                                <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
                                                    <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider block">Semester & Division</span>
                                                    <span className="text-slate-800 font-semibold text-sm mt-1 block">
                                                        {student?.semester ? `Semester ${student.semester}` : 'N/A'}
                                                        {student?.division ? ` • Div ${student.division}` : ''}
                                                    </span>
                                                </div>
                                                <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
                                                    <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider block">Batch Start Date</span>
                                                    <span className="text-slate-800 font-semibold text-sm mt-1 block">{batchStartDate}</span>
                                                </div>
                                                <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
                                                    <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider block">Batch End / Status</span>
                                                    <span className="text-slate-800 font-semibold text-sm mt-1 block capitalize">{batchEndDate}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Card: Assigned Course & Faculty Details */}
                                        <div className="lg:col-span-6 bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-8 space-y-6">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div>
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-100 uppercase tracking-wider mb-1.5">
                                                        Faculty & Curriculum
                                                    </span>
                                                    <h3 className="text-lg font-semibold text-slate-800">Assigned Course & Trainer Details</h3>
                                                    <p className="text-slate-500 text-xs sm:text-sm">Curriculum specifications and faculty mentor assigned to your batch.</p>
                                                </div>
                                                <StudentTabSvg type="trainer" className="w-52 shrink-0 hidden sm:block" />
                                            </div>

                                            <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-2">
                                                <div className="flex items-center justify-between gap-2 flex-wrap">
                                                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#5899B5] bg-white px-2.5 py-1 rounded-full border border-blue-100">
                                                        Course Code: {courseCode}
                                                    </span>
                                                    <span className="text-xs font-semibold text-slate-600">
                                                        {courseDuration} • {courseModulesCount} Modules
                                                    </span>
                                                </div>
                                                <h4 className="text-base font-semibold text-slate-800 pt-1">{courseName}</h4>
                                                <p className="text-xs text-slate-600 leading-relaxed">{courseDescription}</p>
                                                {courseObj.syllabusUrl && (
                                                    <div className="pt-2">
                                                        <a
                                                            href={courseObj.syllabusUrl}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5899B5] hover:underline"
                                                        >
                                                            <Download size={13} /> View / Download Course Syllabus
                                                        </a>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 sm:col-span-2 flex items-center justify-between gap-4">
                                                    <div>
                                                        <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider block">Assigned Batch Trainer / Faculty</span>
                                                        <span className="text-slate-800 font-semibold text-base mt-1 block">{trainerFullName}</span>
                                                    </div>
                                                    <span className="px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100 shrink-0">
                                                        Lead Instructor
                                                    </span>
                                                </div>
                                                <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
                                                    <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider block">Faculty Email</span>
                                                    <span className="text-slate-700 font-semibold text-xs mt-1 block truncate" title={trainerEmail}>{trainerEmail}</span>
                                                </div>
                                                <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
                                                    <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider block">Faculty Contact</span>
                                                    <span className="text-slate-700 font-semibold text-xs mt-1 block">{trainerPhone}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Batch Modules & Topics Covered Breakdown */}
                                    <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-8 space-y-6">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div>
                                                <h3 className="text-lg font-semibold text-slate-800">Batch Modules & Curriculum Progress</h3>
                                                <p className="text-slate-500 text-xs sm:text-sm">Breakdown of training modules, hours conducted, and topics covered in your batch.</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => switchTab('attendance')}
                                                className="text-xs font-semibold text-[#5899B5] hover:text-[#3D7690] flex items-center gap-1 cursor-pointer shrink-0"
                                            >
                                                View Full Attendance Log <ArrowRight size={14} />
                                            </button>
                                        </div>

                                        {moduleSummaries.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                                <BookOpen className="text-slate-400 mb-2.5" size={32} />
                                                <p className="text-slate-700 font-semibold text-sm">No Batch Modules Logged Yet</p>
                                                <p className="text-slate-400 text-xs max-w-xs mt-1">Once your trainer logs batch sessions and topics, module-wise progress will appear here.</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                {moduleSummaries.map((mod, idx) => {
                                                    const modPct = mod.sessionsCount > 0
                                                        ? Math.round((mod.attendedCount / mod.sessionsCount) * 100)
                                                        : 0;
                                                    return (
                                                        <div key={idx} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/40 space-y-3">
                                                            <div className="flex items-center justify-between gap-2">
                                                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#5899B5] border border-blue-100">
                                                                    {mod.module}
                                                                </span>
                                                                <span className="text-xs font-semibold text-slate-600">
                                                                    {mod.sessionsCount} {mod.sessionsCount === 1 ? 'Session' : 'Sessions'} • {modPct}% Attended
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">Instructor</span>
                                                                <span className="text-sm font-semibold text-slate-800">{mod.trainerName}</span>
                                                            </div>
                                                            <div className="space-y-1.5">
                                                                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">Topics Covered</span>
                                                                {mod.topics.length > 0 ? (
                                                                    <div className="flex flex-wrap gap-1.5">
                                                                        {mod.topics.map((t, i) => (
                                                                            <span key={i} className="px-2.5 py-1 bg-white border border-slate-200/80 rounded-lg text-xs font-medium text-slate-700">
                                                                                {t}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                ) : (
                                                                    <p className="text-xs text-slate-400 italic">General module sessions</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })()}

                        {activeTab === 'enter-exam' && (
                            <div className="space-y-8">
                                
                                {/* Dashboard Widgets */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                    <div className="bg-white border border-slate-100 shadow-sm rounded-[1.5rem] p-6 flex items-center gap-4 hover:shadow-md transition-all duration-300">
                                        <div className="p-4 bg-blue-50 text-[#5899B5] rounded-2xl">
                                            <BookOpen size={24} />
                                        </div>
                                        <div>
                                            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Exams Taken</span>
                                            <span className="text-2xl font-semibold text-slate-800">{actualAttempts.length}</span>
                                        </div>
                                    </div>
                                    <div className="bg-white border border-slate-100 shadow-sm rounded-[1.5rem] p-6 flex items-center gap-4 hover:shadow-md transition-all duration-300">
                                        <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
                                            <Award size={24} />
                                        </div>
                                        <div>
                                            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Average Score</span>
                                            <span className="text-2xl font-semibold text-slate-800">
                                                {actualAttempts.length > 0 
                                                    ? `${(actualAttempts.reduce((sum, a) => sum + a.percentage, 0) / actualAttempts.length).toFixed(1)}%`
                                                    : '0.0%'
                                                }
                                            </span>
                                        </div>
                                    </div>
                                    <div className="bg-white border border-slate-100 shadow-sm rounded-[1.5rem] p-6 flex items-center gap-4 hover:shadow-md transition-all duration-300">
                                        <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl">
                                            <CheckCircle size={24} />
                                        </div>
                                        <div>
                                            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Attendance Rate</span>
                                            <span className="text-2xl font-semibold text-slate-800">
                                                {student?.attendance ? `${student.attendance.percentage}%` : '0%'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Quick Exam Launcher */}
                                <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="flex items-center gap-5">
                                        <StudentTabSvg type="launcher" className="w-44 shrink-0 hidden lg:block" />
                                        <div className="space-y-1">
                                            <h3 className="text-lg font-semibold text-slate-800">Direct Assessment Launcher</h3>
                                            <p className="text-slate-500 text-xs sm:text-sm">Have a custom exam key from your trainer? Launch it directly here.</p>
                                        </div>
                                    </div>
                                    <form onSubmit={handleLaunchKeyExam} className="flex gap-3 w-full md:w-auto max-w-md">
                                        <input
                                            type="text"
                                            required
                                            placeholder="Enter Exam Key"
                                            className="px-5 py-3 border border-slate-200 rounded-2xl outline-none font-semibold font-mono focus:border-[#5899B5] uppercase w-full md:w-44 text-sm"
                                            value={examLauncherKey}
                                            onChange={(e) => setExamLauncherKey(e.target.value)}
                                        />
                                        <button
                                            type="submit"
                                            disabled={!examLauncherKey.trim()}
                                            className="px-6 py-3 bg-[#5899B5] hover:bg-[#3D7690] text-white font-semibold rounded-2xl flex items-center gap-2 cursor-pointer transition active:scale-[0.97] text-sm whitespace-nowrap disabled:opacity-50"
                                        >
                                            Launch <ArrowRight size={16} />
                                        </button>
                                    </form>
                                </div>

                                {/* Active Assessments */}
                                <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-8 space-y-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-slate-800">Active Batch Assessments</h3>
                                            <p className="text-slate-500 text-sm">Tests currently active and available to take for your batch.</p>
                                        </div>
                                        <StudentTabSvg type="enter-exam" />
                                    </div>

                                    {loadingExams ? (
                                        <div className="flex justify-center items-center py-10">
                                            <Loader2 className="animate-spin text-[#5899B5]" size={28} />
                                        </div>
                                    ) : activeExams.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                            <AlertCircle className="text-slate-400 mb-2.5" size={32} />
                                            <p className="text-slate-700 font-semibold text-sm">No Active Assessments</p>
                                            <p className="text-slate-400 text-xs max-w-xs mt-1">There are no assessment sessions active for your batch at this moment.</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            {activeExams.map((item, idx) => (
                                                <div key={idx} className="border border-slate-100 rounded-2xl p-5 hover:shadow-md hover:border-[#5899B5]/20 transition-all duration-300 bg-white flex flex-col justify-between group">
                                                    <div>
                                                        <div className="flex justify-between items-start gap-2">
                                                            <span className="text-[10px] font-semibold text-[#5899B5] uppercase bg-blue-50 px-2.5 py-1 rounded-full tracking-wider">
                                                                {item.exam.courseName || 'Course'}
                                                            </span>
                                                            {item.isCompleted ? (
                                                                <span className="bg-emerald-50 text-emerald-600 text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full">Completed</span>
                                                            ) : !item.isStarted ? (
                                                                <span className="bg-amber-50 text-amber-600 text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full">Not Started</span>
                                                            ) : (
                                                                <span className="bg-blue-500 text-white text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full animate-pulse">Active</span>
                                                            )}
                                                        </div>
                                                        <h4 className="text-base font-semibold text-slate-800 mt-3 group-hover:text-[#5899B5] transition-colors leading-snug">
                                                            {item.exam.title}
                                                        </h4>
                                                        
                                                        <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-4 text-xs font-semibold text-slate-500 border-t border-slate-50 pt-3">
                                                            <div className="flex items-center gap-1.5">
                                                                <Clock size={14} className="text-slate-400" />
                                                                <span>{item.exam.duration} Minutes</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <Award size={14} className="text-slate-400" />
                                                                <span>{item.exam.totalMarks} Marks</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="mt-5 pt-2 border-t border-slate-50">
                                                        {item.isCompleted ? (
                                                            <button
                                                                onClick={() => navigate(`/exam/${item.sessionKey}`)}
                                                                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition"
                                                            >
                                                                Review Results
                                                            </button>
                                                        ) : !item.isStarted ? (
                                                            <div className="w-full py-2.5 bg-slate-50 text-slate-400 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-100 cursor-not-allowed">
                                                                Waiting for Instructor
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => navigate(`/exam/${item.sessionKey}`)}
                                                                className="w-full py-2.5 bg-[#5899B5] hover:bg-[#3D7690] text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition shadow-sm group-hover:shadow-md"
                                                            >
                                                                Launch Test <ArrowRight size={14} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                            </div>
                        )}

                        {activeTab === 'exam-history' && (
                            <div className="space-y-8">

                                {/* Historical Attempts */}
                                <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-8 space-y-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-slate-800">Assessment History</h3>
                                            <p className="text-slate-500 text-sm">Your performance track record and evaluations.</p>
                                        </div>
                                        <StudentTabSvg type="exam-history" />
                                    </div>

                                    {loadingAttempts ? (
                                        <div className="flex justify-center items-center py-10">
                                            <Loader2 className="animate-spin text-[#5899B5]" size={28} />
                                        </div>
                                    ) : attempts.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                            <Award className="text-slate-400 mb-2.5" size={32} />
                                            <p className="text-slate-700 font-semibold text-sm">No Attempts Recorded</p>
                                            <p className="text-slate-400 text-xs mt-1">You haven't completed any assessments yet.</p>
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                                        <th className="pb-3 pr-4">Assessment</th>
                                                        <th className="pb-3 px-4">Date</th>
                                                        <th className="pb-3 px-4">Score</th>
                                                        <th className="pb-3 px-4">Result</th>
                                                        <th className="pb-3 pl-4 text-right">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-50 text-sm font-semibold text-slate-700">
                                                    {attempts.map((attempt) => {
                                                        const exam = attempt.examId;
                                                        const dateStr = attempt.completedAt 
                                                            ? new Date(attempt.completedAt).toLocaleDateString('en-IN') 
                                                            : new Date(attempt.createdAt).toLocaleDateString('en-IN');
                                                        
                                                        return (
                                                            <tr key={attempt._id} className="hover:bg-slate-50/60 transition duration-150">
                                                                <td className="py-4 pr-4">
                                                                    <p className="font-semibold text-slate-800 leading-snug">{exam?.title || 'Exam'}</p>
                                                                    <p className="text-slate-400 text-[10px] uppercase font-semibold tracking-wider mt-0.5">{exam?.courseId?.name || 'N/A'}</p>
                                                                </td>
                                                                <td className="py-4 px-4 text-slate-500">{dateStr}</td>
                                                                <td className="py-4 px-4">
                                                                    {attempt.isMock ? (
                                                                        <>
                                                                            <p className="font-semibold text-slate-800">— / {exam?.totalMarks || 0}</p>
                                                                            <p className="text-slate-400 text-xs font-semibold">—</p>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <p className="font-semibold text-slate-800">{attempt.totalScore} / {exam?.totalMarks || 0}</p>
                                                                            <p className="text-slate-400 text-xs font-semibold">{attempt.percentage.toFixed(1)}%</p>
                                                                        </>
                                                                    )}
                                                                </td>
                                                                <td className="py-4 px-4">
                                                                    {attempt.isMock ? (
                                                                        attempt.isActive && attempt.isStarted ? (
                                                                            <span className="bg-blue-50 text-[#5899B5] text-xs font-semibold px-2.5 py-1 rounded-md border border-blue-100 inline-block animate-pulse">Pending</span>
                                                                        ) : (
                                                                            <span className="bg-slate-50 text-slate-500 text-xs font-semibold px-2.5 py-1 rounded-md border border-slate-200 inline-block">Not Attempted</span>
                                                                        )
                                                                    ) : attempt.result === 'pass' ? (
                                                                        <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-md border border-emerald-100 inline-block">Pass</span>
                                                                    ) : (
                                                                        <span className="bg-red-50 text-red-700 text-xs font-semibold px-2.5 py-1 rounded-md border border-red-100 inline-block">Fail</span>
                                                                    )}
                                                                </td>
                                                                <td className="py-4 pl-4 text-right">
                                                                    <div className="flex justify-end gap-2">
                                                                        {attempt.isMock ? (
                                                                            attempt.isActive && attempt.isStarted ? (
                                                                                <button
                                                                                    onClick={() => navigate(`/exam/${attempt.sessionId}`)}
                                                                                    className="px-3.5 py-1.5 bg-[#5899B5] hover:bg-[#3D7690] text-white text-xs font-semibold rounded-lg transition cursor-pointer"
                                                                                >
                                                                                    Launch
                                                                                </button>
                                                                            ) : (
                                                                                <button
                                                                                    disabled
                                                                                    className="px-3.5 py-1.5 bg-slate-100 text-slate-400 text-xs font-semibold rounded-lg border border-slate-200 cursor-not-allowed"
                                                                                >
                                                                                    Unavailable
                                                                                </button>
                                                                            )
                                                                        ) : (
                                                                            <>
                                                                                {exam?.settings?.allowReview !== false && (
                                                                                    <button
                                                                                        onClick={() => navigate(`/exam/${attempt.sessionId}`)}
                                                                                        className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition cursor-pointer"
                                                                                    >
                                                                                        Review
                                                                                    </button>
                                                                                )}
                                                                                {attempt.result === 'pass' && (exam?.settings?.enableCertificate || attempt.certificateId) && (
                                                                                    <button
                                                                                        onClick={() => handleDownloadCertificate(attempt._id)}
                                                                                        className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-100 text-xs font-semibold rounded-lg transition flex items-center gap-1 cursor-pointer"
                                                                                        title="Download Certificate"
                                                                                    >
                                                                                        <Download size={13} /> Cert
                                                                                    </button>
                                                                                )}
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>

                            </div>
                        )}

                        {activeTab === 'profile' && (
                            <div className="space-y-8 font-sans">
                                
                                {/* Profile Sub-navigation Tabs */}
                                <div className="flex flex-wrap items-center justify-between gap-4 w-full">
                                    <div className="flex flex-wrap items-center gap-3 p-1.5 bg-slate-100/60 rounded-3xl w-fit max-w-full">
                                        <button
                                            type="button"
                                            onClick={() => setProfileSubTab('personal')}
                                            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
                                            profileSubTab === 'personal'
                                                    ? 'bg-[#5899B5] text-white shadow-sm'
                                                    : 'bg-slate-100 text-slate-650 hover:bg-slate-200'
                                            }`}
                                        >
                                            Personal Details
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setProfileSubTab('academic')}
                                            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
                                                profileSubTab === 'academic'
                                                    ? 'bg-[#5899B5] text-white shadow-sm'
                                                    : 'bg-slate-100 text-slate-650 hover:bg-slate-200'
                                            }`}
                                        >
                                            Academic Details
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setProfileSubTab('skills')}
                                            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
                                                profileSubTab === 'skills'
                                                    ? 'bg-[#5899B5] text-white shadow-sm'
                                                    : 'bg-slate-100 text-slate-650 hover:bg-slate-200'
                                            }`}
                                        >
                                            Skills
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setProfileSubTab('resume')}
                                            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
                                                profileSubTab === 'resume'
                                                    ? 'bg-[#5899B5] text-white shadow-sm'
                                                    : 'bg-slate-100 text-slate-650 hover:bg-slate-200'
                                            }`}
                                        >
                                            Resume
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setProfileSubTab('preferences')}
                                            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
                                                profileSubTab === 'preferences'
                                                    ? 'bg-[#5899B5] text-white shadow-sm'
                                                    : 'bg-slate-100 text-slate-650 hover:bg-slate-200'
                                            }`}
                                        >
                                            Career Preferences
                                        </button>

                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleExportProfile}
                                        className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-sm font-semibold transition-all duration-200 shadow-sm cursor-pointer border border-emerald-500/20 active:scale-95 whitespace-nowrap"
                                    >
                                        <Download size={15} /> Export Profile
                                    </button>
                                </div>

                                {profileSubTab === 'personal' && (
                                    <form onSubmit={handleSavePersonal} className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-8 space-y-6">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div>
                                                <h3 className="text-lg font-semibold text-slate-800">Personal Details</h3>
                                                <p className="text-slate-500 text-sm">Update your name, contact email, and mobile number.</p>
                                            </div>
                                            <StudentTabSvg type="profile-personal" />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Full Name</label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="Enter your full name"
                                                    className="w-full px-5 py-3.5 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:border-[#5899B5] focus:ring-4 focus:ring-blue-50 outline-none transition placeholder:text-slate-400 bg-slate-50/30 focus:bg-white"
                                                    value={personalName}
                                                    onChange={(e) => setPersonalName(e.target.value)}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Email Address</label>
                                                <input
                                                    type="email"
                                                    placeholder="Enter email address"
                                                    className="w-full px-5 py-3.5 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:border-[#5899B5] focus:ring-4 focus:ring-blue-50 outline-none transition placeholder:text-slate-400 bg-slate-50/30 focus:bg-white"
                                                    value={personalEmail}
                                                    onChange={(e) => setPersonalEmail(e.target.value)}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Mobile Number</label>
                                                <input
                                                    type="text"
                                                    placeholder="Enter mobile number"
                                                    className="w-full px-5 py-3.5 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:border-[#5899B5] focus:ring-4 focus:ring-blue-50 outline-none transition placeholder:text-slate-400 bg-slate-50/30 focus:bg-white"
                                                    value={personalMobile}
                                                    onChange={(e) => setPersonalMobile(e.target.value)}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">CGPA</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    max="10"
                                                    placeholder="Enter your CGPA (e.g. 8.5)"
                                                    className="w-full px-5 py-3.5 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:border-[#5899B5] focus:ring-4 focus:ring-blue-50 outline-none transition placeholder:text-slate-400 bg-slate-50/30 focus:bg-white"
                                                    value={personalCgpa}
                                                    onChange={(e) => setPersonalCgpa(e.target.value)}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Active Backlogs</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    placeholder="Enter active backlogs"
                                                    className="w-full px-5 py-3.5 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:border-[#5899B5] focus:ring-4 focus:ring-blue-50 outline-none transition placeholder:text-slate-400 bg-slate-50/30 focus:bg-white"
                                                    value={personalBacklogs}
                                                    onChange={(e) => setPersonalBacklogs(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-4 flex justify-end border-t border-slate-100">
                                            <button
                                                type="submit"
                                                disabled={profileSaving}
                                                className="px-8 py-3.5 bg-[#5899B5] hover:bg-[#3D7690] text-white font-semibold rounded-2xl flex items-center gap-2 cursor-pointer shadow-md shadow-blue-500/10 active:scale-[0.98] transition duration-200 text-sm disabled:opacity-50"
                                            >
                                                {profileSaving ? <Loader2 size={16} className="animate-spin" /> : null}
                                                Save Personal Details
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {profileSubTab === 'academic' && (
                                    /* Institutional Context Card */
                                    <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-8 space-y-6">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div>
                                                <h3 className="text-lg font-semibold text-slate-800">Academic & Institutional Profile</h3>
                                                <p className="text-slate-500 text-sm">Your course, batch, trainer details, and class attendance rate.</p>
                                            </div>
                                            <StudentTabSvg type="profile-academic" />
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            <div className="bg-slate-50/50 p-4.5 rounded-2xl border border-slate-100">
                                                <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider block mb-1">USN (University Seat Number)</span>
                                                <span className="text-slate-800 font-semibold font-mono text-base">{student?.usn || 'N/A'}</span>
                                            </div>
                                            <div className="bg-slate-50/50 p-4.5 rounded-2xl border border-slate-100">
                                                <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider block mb-1">Course Registered</span>
                                                <span className="text-slate-800 font-semibold text-base">
                                                    {student?.batchId?.courseId ? `${student.batchId.courseId.name} (${student.batchId.courseId.code})` : 'N/A'}
                                                </span>
                                            </div>
                                            <div className="bg-slate-50/50 p-4.5 rounded-2xl border border-slate-100">
                                                <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider block mb-1">Assigned Trainer</span>
                                                <span className="text-slate-800 font-semibold text-base">
                                                    {student?.batchId?.trainerId ? `${student.batchId.trainerId.firstName} ${student.batchId.trainerId.lastName}` : 'N/A'}
                                                </span>
                                            </div>
                                            <div className="bg-slate-50/50 p-4.5 rounded-2xl border border-slate-100">
                                                <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider block mb-1">College Details</span>
                                                <span className="text-slate-800 font-semibold text-base">
                                                    {student?.collegeName ? `${student.collegeName} (${student.collegeCode || 'N/A'})` : 'N/A'}
                                                </span>
                                            </div>
                                            <div className="bg-slate-50/50 p-4.5 rounded-2xl border border-slate-100">
                                                <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider block mb-1">Batch Name</span>
                                                <span className="text-slate-800 font-semibold text-base">{student?.batchId?.batchName || 'N/A'}</span>
                                            </div>
                                            <div className="bg-slate-50/50 p-4.5 rounded-2xl border border-slate-100">
                                                <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider block mb-1">Class Attendance</span>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-slate-800 font-semibold text-base">
                                                        {student?.attendance ? `${student.attendance.percentage}%` : '0%'}
                                                    </span>
                                                    <span className="text-slate-400 text-xs font-semibold">
                                                        ({student?.attendance?.attended || 0}/{student?.attendance?.totalSessions || 0} sessions)
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {profileSubTab === 'skills' && (
                                    <form onSubmit={handleSaveSkills} className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-8 space-y-6">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div>
                                                <h3 className="text-lg font-semibold text-slate-800">Skills & Capabilities</h3>
                                                <p className="text-slate-500 text-sm">Add your professional technical skills and capabilities summary statement.</p>
                                            </div>
                                            <StudentTabSvg type="profile-skills" />
                                        </div>

                                        {/* Skills Tags */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Key Professional Skills</label>
                                            <div className="border border-slate-200 rounded-2xl p-3 bg-slate-50/30 focus-within:bg-white focus-within:border-[#5899B5] transition-all">
                                                <div className="flex flex-wrap gap-2 mb-2">
                                                    {skillsList.map((skill, i) => (
                                                        <span key={i} className="inline-flex items-center gap-1 bg-blue-50 border border-blue-100 text-[#5899B5] text-xs font-semibold px-2.5 py-1 rounded-lg">
                                                            {skill}
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveSkill(skill)}
                                                                className="text-[#5899B5]/60 hover:text-[#5899B5] text-[10px] font-semibold p-0.5"
                                                            >
                                                                ✕
                                                            </button>
                                                        </span>
                                                    ))}
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Type skill & press Enter or Comma (e.g. Java, React, SQL)"
                                                    className="w-full bg-transparent border-none outline-none text-sm font-medium text-slate-800 placeholder:text-slate-400"
                                                    value={skillsInput}
                                                    onChange={(e) => setSkillsInput(e.target.value)}
                                                    onKeyDown={handleAddSkill}
                                                />
                                            </div>
                                        </div>

                                        {/* Capabilities */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Capabilities Statement</label>
                                            <textarea
                                                placeholder="Write a brief professional summary of your key strengths, projects, or achievements..."
                                                rows={4}
                                                className="w-full px-5 py-4 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:border-[#5899B5] focus:ring-4 focus:ring-blue-50 outline-none transition placeholder:text-slate-400 bg-slate-50/30 focus:bg-white"
                                                value={capabilities}
                                                onChange={(e) => setCapabilities(e.target.value)}
                                            />
                                        </div>

                                        <div className="pt-4 flex justify-end border-t border-slate-100">
                                            <button
                                                type="submit"
                                                disabled={profileSaving}
                                                className="px-8 py-3.5 bg-[#5899B5] hover:bg-[#3D7690] text-white font-semibold rounded-2xl flex items-center gap-2 cursor-pointer shadow-md shadow-blue-500/10 active:scale-[0.98] transition duration-200 text-sm disabled:opacity-50"
                                            >
                                                {profileSaving ? <Loader2 size={16} className="animate-spin" /> : null}
                                                Save Skills
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {profileSubTab === 'resume' && (
                                    <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-8 space-y-6">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div>
                                                <h3 className="text-lg font-semibold text-slate-800">Resume PDF</h3>
                                                <p className="text-slate-500 text-sm">Upload your professional resume PDF to share with corporate placement partners.</p>
                                            </div>
                                            <StudentTabSvg type="profile-resume" />
                                        </div>

                                        {student?.resumeUrl ? (
                                            <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-3 bg-emerald-500 text-white rounded-xl shadow-sm">
                                                        <FileText size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="text-slate-800 font-semibold text-sm leading-tight">Resume PDF Linked</p>
                                                        <p className="text-slate-400 text-xs mt-0.5">Your resume is uploaded and accessible to placement cells.</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                                                    <a
                                                        href={student.resumeUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex-1 sm:flex-none text-center px-4.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-sm cursor-pointer transition"
                                                    >
                                                        View Resume
                                                    </a>
                                                    <label className="flex-1 sm:flex-none text-center px-4.5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs rounded-xl cursor-pointer transition">
                                                        Replace PDF
                                                        <input
                                                            type="file"
                                                            accept=".pdf"
                                                            className="hidden"
                                                            onChange={handleResumeUpload}
                                                            disabled={uploadingResume}
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                        ) : (
                                            <label className="border-2 border-dashed border-slate-200 hover:border-[#5899B5]/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 bg-slate-50/30 group">
                                                {uploadingResume ? (
                                                    <div className="flex flex-col items-center">
                                                        <Loader2 size={32} className="animate-spin text-[#5899B5]" />
                                                        <p className="text-slate-700 font-semibold mt-3 text-sm">Uploading and configuring PDF...</p>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <Upload size={32} className="text-slate-400 group-hover:text-[#5899B5] group-hover:scale-110 transition duration-300" />
                                                        <p className="text-slate-800 font-semibold text-sm mt-3 leading-tight">Select Resume PDF</p>
                                                        <p className="text-slate-400 text-xs mt-1.5 max-w-[200px]">PDF format only (Max 5MB limits)</p>
                                                    </>
                                                )}
                                                <input
                                                    type="file"
                                                    accept=".pdf"
                                                    className="hidden"
                                                    onChange={handleResumeUpload}
                                                    disabled={uploadingResume}
                                                />
                                            </label>
                                        )}
                                    </div>
                                )}

                                {profileSubTab === 'preferences' && (
                                    <form onSubmit={handleSavePreferences} className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-8 space-y-8">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div>
                                                <h3 className="text-lg font-semibold text-slate-800">Career & Placement Preferences</h3>
                                                <p className="text-slate-500 text-sm">Configure your preferred job arrangements, salary expectations, roles, and locations.</p>
                                            </div>
                                            <StudentTabSvg type="profile-preferences" />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Expected CTC Range (e.g. 5-7 LPA)</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. 4.5 - 6.0 LPA"
                                                    className="w-full px-5 py-3.5 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:border-[#5899B5] focus:ring-4 focus:ring-blue-50 outline-none transition placeholder:text-slate-400 bg-slate-50/30 focus:bg-white"
                                                    value={expectedCTC}
                                                    onChange={(e) => setExpectedCTC(e.target.value)}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Preferred Job Type</label>
                                                <select
                                                    className="w-full px-5 py-3.5 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-700 focus:border-[#5899B5] focus:ring-4 focus:ring-blue-50 outline-none transition bg-slate-50/30 focus:bg-white cursor-pointer"
                                                    value={jobType}
                                                    onChange={(e) => setJobType(e.target.value)}
                                                >
                                                    <option value="Any">Any</option>
                                                    <option value="Full-time">Full-time</option>
                                                    <option value="Internship">Internship</option>
                                                    <option value="Contract">Contract</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Preferred Roles */}
                                            <div className="space-y-3">
                                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Preferred Roles</label>
                                                <div className="max-h-56 overflow-y-auto border border-slate-100 rounded-2xl p-4 space-y-2 bg-slate-50/30">
                                                    {commonRoles.map((role) => (
                                                        <label key={role} className="flex items-center gap-2.5 text-sm font-semibold text-slate-700 cursor-pointer select-none">
                                                            <input
                                                                type="checkbox"
                                                                checked={prefRoles.includes(role)}
                                                                onChange={() => handleToggleRole(role)}
                                                                className="rounded border-slate-350 text-[#5899B5] focus:ring-[#5899B5]"
                                                            />
                                                            {role}
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Preferred Locations */}
                                            <div className="space-y-3">
                                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Preferred Locations</label>
                                                <div className="max-h-56 overflow-y-auto border border-slate-100 rounded-2xl p-4 space-y-2 bg-slate-50/30">
                                                    {commonLocations.map((loc) => (
                                                        <label key={loc} className="flex items-center gap-2.5 text-sm font-semibold text-slate-700 cursor-pointer select-none">
                                                            <input
                                                                type="checkbox"
                                                                checked={prefLocations.includes(loc)}
                                                                onChange={() => handleToggleLocation(loc)}
                                                                className="rounded border-slate-350 text-[#5899B5] focus:ring-[#5899B5]"
                                                            />
                                                            {loc}
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-4 flex justify-end border-t border-slate-100">
                                            <button
                                                type="submit"
                                                disabled={profileSaving}
                                                className="px-8 py-3.5 bg-[#5899B5] hover:bg-[#3D7690] text-white font-semibold rounded-2xl flex items-center gap-2 cursor-pointer shadow-md shadow-blue-500/10 active:scale-[0.98] transition duration-200 text-sm disabled:opacity-50"
                                            >
                                                {profileSaving ? <Loader2 size={16} className="animate-spin" /> : null}
                                                Save Career Preferences
                                            </button>
                                        </div>
                                    </form>
                                )}

                            </div>
                        )}

                        {activeTab === 'attendance' && (
                            <div className="space-y-8 font-sans">
                                {/* Summary Widgets */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                    <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 flex items-center gap-4 hover:shadow-md transition-all duration-300">
                                        <div className="p-4 bg-blue-50 text-[#5899B5] rounded-2xl">
                                            <BookOpen size={24} />
                                        </div>
                                        <div>
                                            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Total Sessions</span>
                                            <span className="text-2xl font-semibold text-slate-800">
                                                {student?.attendance?.totalSessions || 0}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 flex items-center gap-4 hover:shadow-md transition-all duration-300">
                                        <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
                                            <CheckCircle size={24} />
                                        </div>
                                        <div>
                                            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Sessions Attended</span>
                                            <span className="text-2xl font-semibold text-slate-800">
                                                {student?.attendance?.attended || 0}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 flex items-center gap-4 hover:shadow-md transition-all duration-300">
                                        <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl">
                                            <Award size={24} />
                                        </div>
                                        <div>
                                            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Attendance Rate</span>
                                            <span className="text-2xl font-semibold text-slate-800">
                                                {student?.attendance ? `${student.attendance.percentage}%` : '100%'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Sessions List */}
                                <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-8 space-y-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-slate-800">Class Attendance Log</h3>
                                            <p className="text-slate-500 text-sm">Chronological feed of all recorded classes and your presence status.</p>
                                        </div>
                                        <StudentTabSvg type="attendance" />
                                    </div>

                                    {!student?.attendance?.history || student.attendance.history.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                            <CalendarCheck className="text-slate-400 mb-2.5" size={32} />
                                            <p className="text-slate-700 font-semibold text-sm">No Attendance Logged</p>
                                            <p className="text-slate-400 text-xs mt-1">There are no logged sessions in your batch roster at this moment.</p>
                                        </div>
                                    ) : (() => {
                                        const sortedHistory = [...student.attendance.history].sort((a, b) => {
                                            const dateA = new Date(a.date);
                                            const dateB = new Date(b.date);
                                            return attendanceSortDesc ? dateB - dateA : dateA - dateB;
                                        });

                                        return (
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left border-collapse">
                                                    <thead>
                                                        <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                                            <th 
                                                                className="pb-3 pr-4 cursor-pointer select-none hover:text-[#5899B5] transition-colors"
                                                                onClick={() => setAttendanceSortDesc(!attendanceSortDesc)}
                                                            >
                                                                <div className="flex items-center gap-1.5">
                                                                    Date
                                                                    <span className="text-[10px] text-[#5899B5] font-bold">
                                                                        {attendanceSortDesc ? '▼' : '▲'}
                                                                    </span>
                                                                </div>
                                                            </th>
                                                            <th className="pb-3 px-4">Module / Period</th>
                                                            <th className="pb-3 px-4">Topic Covered</th>
                                                            <th className="pb-3 px-4">Instructor</th>
                                                            <th className="pb-3 pl-4 text-right">Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-50 text-sm font-medium text-slate-700">
                                                        {sortedHistory.map((sess) => {
                                                            const dateStr = new Date(sess.date).toLocaleDateString('en-IN', {
                                                                day: 'numeric',
                                                                month: 'short',
                                                                year: 'numeric'
                                                            });
                                                            
                                                            // status styling
                                                            let statusBg = '';
                                                            let statusText = '';
                                                            if (sess.status === 'present') {
                                                                statusBg = 'bg-emerald-50 text-emerald-700 border-emerald-100';
                                                                statusText = 'Present';
                                                            } else if (sess.status === 'absent') {
                                                                statusBg = 'bg-rose-50 text-rose-700 border-rose-100';
                                                                statusText = 'Absent';
                                                            } else if (sess.status === 'late') {
                                                                statusBg = 'bg-amber-50 text-amber-700 border-amber-100';
                                                                statusText = 'Late';
                                                            } else {
                                                                statusBg = 'bg-slate-50 text-slate-700 border-slate-100';
                                                                statusText = 'Excused';
                                                            }

                                                            return (
                                                                <tr key={sess._id} className="hover:bg-slate-50/60 transition duration-150">
                                                                    <td className="py-4 pr-4 font-mono text-slate-600">{dateStr}</td>
                                                                    <td className="py-4 px-4 text-slate-500">
                                                                        {sess.module} (Hour {sess.period})
                                                                    </td>
                                                                    <td className="py-4 px-4 text-slate-800 font-medium">
                                                                        {sess.topic || <span className="italic text-slate-400">No topic recorded</span>}
                                                                    </td>
                                                                    <td className="py-4 px-4 text-slate-500">{sess.trainerName}</td>
                                                                    <td className="py-4 pl-4 text-right">
                                                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${statusBg}`}>
                                                                            {statusText}
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        );
                                    })()}
                                </div>
                            </div>
                        )}

                        {activeTab === 'todo' && (
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                                {/* Left Categories Sidebar */}
                                <div className="md:col-span-3">
                                    <button 
                                        onClick={openAddTodoModal}
                                        className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white font-semibold rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-amber-500/10 transition duration-200 cursor-pointer text-sm"
                                    >
                                        Add Task
                                    </button>

                                    <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-4 mt-6 space-y-1.5 font-sans">
                                        {[
                                            { key: 'all', label: 'All Tasks', icon: BookOpen },
                                            { key: 'starred', label: 'Starred', icon: Star },
                                            { key: 'priority', label: 'Priority', icon: AlertTriangle },
                                            { key: 'schedule', label: 'Schedule', icon: CalendarCheck },
                                            { key: 'today', label: 'Today', icon: Clock },
                                            { key: 'done', label: 'Completed', icon: CheckCircle },
                                            { key: 'deleted', label: 'Trash', icon: Trash2 }
                                        ].map((item) => {
                                            const isActive = activeFilter === item.key;
                                            const counts = getFilterCounts();
                                            return (
                                                <button
                                                    key={item.key}
                                                    onClick={() => setActiveFilter(item.key)}
                                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                                                        isActive 
                                                            ? 'bg-amber-50 text-amber-700 border border-amber-100 shadow-xs' 
                                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <item.icon size={18} className={isActive ? 'text-amber-600' : 'text-slate-400'} />
                                                        <span>{item.label}</span>
                                                    </div>
                                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                                        isActive 
                                                            ? 'bg-amber-500 text-white' 
                                                            : 'bg-slate-100 text-slate-500'
                                                    }`}>
                                                        {counts[item.key] || 0}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Right Tasks List */}
                                <div className="md:col-span-9 space-y-6">
                                    <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-8 space-y-6">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div>
                                                <h3 className="text-lg font-semibold text-slate-800 capitalize">
                                                    {activeFilter === 'all' ? 'All Tasks' : `${activeFilter} Tasks`}
                                                </h3>
                                                <p className="text-slate-500 text-sm">Manage, filter, and track your tasks and deadlines.</p>
                                            </div>
                                            <StudentTabSvg type="todo" />
                                        </div>

                                        {loadingExams && todos.length === 0 ? (
                                            <div className="flex justify-center items-center py-12">
                                                <Loader2 className="animate-spin text-amber-500" size={28} />
                                            </div>
                                        ) : (() => {
                                            const list = Array.isArray(todos) ? todos : [];
                                            const filtered = list.filter(t => {
                                                if (activeFilter === 'all') return t.status !== 'deleted';
                                                if (activeFilter === 'starred') return t.isStarred && t.status !== 'deleted';
                                                if (activeFilter === 'priority') return t.isPriority && t.status !== 'deleted';
                                                if (activeFilter === 'schedule') return t.dueDate && t.status !== 'deleted';
                                                if (activeFilter === 'today') return t.dueDate && new Date(t.dueDate).toDateString() === new Date().toDateString() && t.status !== 'deleted';
                                                if (activeFilter === 'done') return t.status === 'completed';
                                                if (activeFilter === 'deleted') return t.status === 'deleted';
                                                return true;
                                            });

                                            if (filtered.length === 0) {
                                                return (
                                                    <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200 p-8">
                                                        <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 mb-4">
                                                            <CalendarCheck size={32} />
                                                        </div>
                                                        <p className="text-slate-700 font-semibold text-lg">There are no todos!</p>
                                                        <p className="text-slate-400 text-sm max-w-sm mt-1">Enjoy your day or create a new task using the "Add Task" button on the left.</p>
                                                    </div>
                                                );
                                            }

                                            return (
                                                <div className="space-y-4">
                                                    {filtered.map((todo) => {
                                                        const isCompleted = todo.status === 'completed';
                                                        const isDeleted = todo.status === 'deleted';
                                                        const dueDateObj = todo.dueDate ? new Date(todo.dueDate) : null;
                                                        const isPastDue = dueDateObj && dueDateObj < new Date() && !isCompleted && !isDeleted;
                                                        
                                                        let dateStr = '';
                                                        if (dueDateObj) {
                                                            dateStr = dueDateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
                                                        }

                                                        return (
                                                            <div 
                                                                key={todo._id}
                                                                className={`bg-white border border-slate-100 shadow-sm rounded-3xl p-5 hover:shadow-md hover:border-amber-500/10 transition-all duration-300 flex items-start justify-between gap-4 relative group ${
                                                                    isCompleted ? 'opacity-70 bg-slate-50/30' : ''
                                                                }`}
                                                            >
                                                                <div className="flex items-start gap-4 flex-1">
                                                                    {/* Completion Checkbox */}
                                                                    <button
                                                                        type="button"
                                                                        disabled={isDeleted}
                                                                        onClick={() => handleToggleComplete(todo)}
                                                                        className={`mt-1 flex-shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                                                                            isCompleted 
                                                                                ? 'bg-amber-500 border-amber-500 text-white' 
                                                                                : 'border-slate-350 hover:border-amber-500'
                                                                        } ${isDeleted ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                                                                    >
                                                                        {isCompleted && (
                                                                            <span className="text-white text-[10px] font-semibold">✓</span>
                                                                        )}
                                                                    </button>

                                                                    {/* Task Info */}
                                                                    <div className="space-y-1 flex-1">
                                                                        <h4 className={`text-base font-semibold text-slate-800 leading-snug ${
                                                                            isCompleted ? 'line-through text-slate-400' : ''
                                                                        }`}>
                                                                            {todo.title}
                                                                        </h4>
                                                                        {todo.description && (
                                                                            <p className={`text-slate-500 text-xs sm:text-sm leading-relaxed ${
                                                                                isCompleted ? 'line-through text-slate-400' : ''
                                                                            }`}>
                                                                                {todo.description}
                                                                            </p>
                                                                        )}

                                                                        {/* Date and Badges */}
                                                                        <div className="flex flex-wrap items-center gap-2 mt-3.5">
                                                                            {todo.dueDate && (
                                                                                <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-lg ${
                                                                                    isCompleted 
                                                                                        ? 'bg-slate-50 text-slate-400'
                                                                                        : isPastDue 
                                                                                            ? 'bg-rose-50 text-rose-600 border border-rose-100'
                                                                                            : 'bg-blue-50 text-blue-600 border border-blue-100'
                                                                                }`}>
                                                                                    <Clock size={12} />
                                                                                    Due: {dateStr} {isPastDue && '(Overdue)'}
                                                                                </span>
                                                                            )}

                                                                            {todo.isPriority && (
                                                                                <span className="inline-flex items-center gap-1 bg-red-50 border border-red-150 text-red-750 text-[10px] font-semibold px-2 py-0.5 rounded-lg">
                                                                                    High Priority
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Actions Right */}
                                                                <div className="flex items-center gap-1">
                                                                    {/* Star Toggle */}
                                                                    {!isDeleted && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleToggleStar(todo)}
                                                                            className={`p-2 rounded-xl transition duration-150 cursor-pointer ${
                                                                                todo.isStarred 
                                                                                    ? 'text-amber-500 bg-amber-50/50 hover:bg-amber-50' 
                                                                                    : 'text-slate-450 hover:text-slate-600 hover:bg-slate-50'
                                                                            }`}
                                                                            title={todo.isStarred ? 'Unstar Task' : 'Star Task'}
                                                                        >
                                                                            <Star size={16} fill={todo.isStarred ? 'currentColor' : 'none'} />
                                                                        </button>
                                                                    )}

                                                                    {/* Priority Toggle */}
                                                                    {!isDeleted && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleTogglePriority(todo)}
                                                                            className={`p-2 rounded-xl transition duration-150 cursor-pointer ${
                                                                                todo.isPriority 
                                                                                    ? 'text-rose-500 bg-rose-50/50 hover:bg-rose-50' 
                                                                                    : 'text-slate-450 hover:text-slate-650 hover:bg-slate-50'
                                                                            }`}
                                                                            title={todo.isPriority ? 'Remove Priority' : 'Mark as Priority'}
                                                                        >
                                                                            <AlertTriangle size={16} />
                                                                        </button>
                                                                    )}

                                                                    {/* Edit Button */}
                                                                    {!isDeleted && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => openEditTodoModal(todo)}
                                                                            className="p-2 text-slate-450 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition duration-150 cursor-pointer"
                                                                            title="Edit Task"
                                                                        >
                                                                            <FileText size={16} />
                                                                        </button>
                                                                    )}

                                                                    {/* Delete / Restore Actions */}
                                                                    {isDeleted ? (
                                                                        <div className="flex items-center gap-1.5">
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => handleRestoreTodo(todo)}
                                                                                className="px-2.5 py-1.5 text-xs font-semibold text-amber-600 hover:text-amber-750 bg-amber-50 hover:bg-amber-100 rounded-lg cursor-pointer transition"
                                                                            >
                                                                                Restore
                                                                            </button>
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => handlePermanentDeleteTodo(todo._id)}
                                                                                className="p-2 text-slate-450 hover:text-red-500 hover:bg-red-50 rounded-xl cursor-pointer transition"
                                                                                title="Delete Permanently"
                                                                            >
                                                                                <Trash2 size={16} />
                                                                            </button>
                                                                        </div>
                                                                    ) : (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleSoftDeleteTodo(todo)}
                                                                            className="p-2 text-slate-450 hover:text-red-500 hover:bg-red-50 rounded-xl cursor-pointer transition md:opacity-0 group-hover:opacity-100 duration-200"
                                                                            title="Move to Trash"
                                                                        >
                                                                            <Trash2 size={16} />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            );
                                        })()}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <form onSubmit={handleUpdatePassword} className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-8 space-y-6 max-w-2xl">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-800">Account Security</h3>
                                        <p className="text-slate-500 text-sm">Update your access password below. Current password verification is required.</p>
                                    </div>
                                    <StudentTabSvg type="security" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Current Password</label>
                                    <div className="relative group">
                                        <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#5899B5] transition-colors" />
                                        <input
                                            type={showPw1 ? 'text' : 'password'}
                                            required
                                            placeholder="Enter current password"
                                            className="w-full pl-12 pr-12 py-3.5 bg-slate-50/30 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:bg-white focus:border-[#5899B5] focus:ring-[4px] focus:ring-blue-50 outline-none transitionplaceholder:text-slate-400"
                                            value={currentPw}
                                            onChange={(e) => setCurrentPw(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPw1(!showPw1)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#5899B5] transition-colors p-1"
                                        >
                                            {showPw1 ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2 border-t border-slate-50 pt-4">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">New Password</label>
                                    <input
                                        type="password"
                                        required
                                        placeholder="At least 6 characters"
                                        className="w-full px-5 py-3.5 bg-slate-50/30 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:bg-white focus:border-[#5899B5] focus:ring-[4px] focus:ring-blue-50 outline-none transition placeholder:text-slate-400"
                                        value={newPw}
                                        onChange={(e) => setNewPw(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Confirm New Password</label>
                                    <div className="relative group">
                                        <input
                                            type={showPw2 ? 'text' : 'password'}
                                            required
                                            placeholder="Re-enter new password"
                                            className="w-full px-5 py-3.5 bg-slate-50/30 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:bg-white focus:border-[#5899B5] focus:ring-[4px] focus:ring-blue-50 outline-none transition placeholder:text-slate-400"
                                            value={confirmPw}
                                            onChange={(e) => setConfirmPw(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPw2(!showPw2)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#5899B5] transition-colors p-1"
                                        >
                                            {showPw2 ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end border-t border-slate-100">
                                    <button
                                        type="submit"
                                        disabled={pwSaving || !currentPw.trim() || !newPw.trim() || !confirmPw.trim()}
                                        className="px-8 py-3.5 bg-[#5899B5] hover:bg-[#3D7690] text-white font-semibold rounded-2xl flex items-center gap-2 cursor-pointer shadow-md shadow-blue-500/10 active:scale-[0.98] transition duration-200 text-sm disabled:opacity-50"
                                    >
                                        {pwSaving ? <Loader2 size={16} className="animate-spin" /> : null}
                                        Update Password
                                    </button>
                                </div>
                            </form>
                        )}


            </div>

            {/* Add/Edit Todo Modal */}
            <AnimatePresence>
                {todoModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setTodoModalOpen(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
                        />

                        {/* Modal Dialog */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-[2rem] border border-slate-100 shadow-2xl w-full max-w-lg overflow-hidden z-10 flex flex-col max-h-[90vh] font-sans text-left"
                        >
                            <div className="px-6 py-5 bg-slate-50 border-b border-slate-150 flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-slate-800">
                                    {todoEditingId ? 'Edit Task Details' : 'Create New Task'}
                                </h3>
                                <button 
                                    onClick={() => setTodoModalOpen(false)}
                                    className="text-slate-400 hover:text-slate-650 font-semibold text-xl p-1"
                                >
                                    ×
                                </button>
                            </div>

                            <form onSubmit={handleSaveTodo} className="p-6 space-y-4 overflow-y-auto">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Task Title</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Enter task name"
                                        className="w-full px-5 py-3 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:border-amber-500 outline-none transition bg-slate-50/30 focus:bg-white"
                                        value={todoTitle}
                                        onChange={(e) => setTodoTitle(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Description</label>
                                    <textarea
                                        placeholder="Enter task notes or details..."
                                        rows={3}
                                        className="w-full px-5 py-3 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:border-amber-500 outline-none transition bg-slate-50/30 focus:bg-white"
                                        value={todoDesc}
                                        onChange={(e) => setTodoDesc(e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Due Date</label>
                                        <input
                                            type="date"
                                            className="w-full px-5 py-3 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-700 focus:border-amber-500 outline-none transition bg-slate-50/30 focus:bg-white cursor-pointer"
                                            value={todoDueDate}
                                            onChange={(e) => setTodoDueDate(e.target.value)}
                                        />
                                    </div>

                                    <div className="flex flex-col justify-end gap-2.5 py-1 text-left">
                                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer select-none">
                                            <input
                                                type="checkbox"
                                                className="rounded border-slate-350 text-amber-500 focus:ring-amber-500"
                                                checked={todoIsStarred}
                                                onChange={(e) => setTodoIsStarred(e.target.checked)}
                                            />
                                            Starred Task
                                        </label>
                                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer select-none">
                                            <input
                                                type="checkbox"
                                                className="rounded border-slate-350 text-red-500 focus:ring-red-500"
                                                checked={todoIsPriority}
                                                onChange={(e) => setTodoIsPriority(e.target.checked)}
                                            />
                                            High Priority
                                        </label>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setTodoModalOpen(false)}
                                        className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs rounded-xl cursor-pointer transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs rounded-xl shadow-md shadow-amber-500/10 cursor-pointer transition"
                                    >
                                        {todoEditingId ? 'Update Task' : 'Add Task'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AlertModal
                isOpen={alertState.open}
                onClose={() => setAlertState({ ...alertState, open: false })}
                title={alertState.title}
                message={alertState.message}
                type={alertState.type}
            />

            {activeTab === 'placement' && (
                <StudentPlacementTab token={token} student={student} setAlertState={setAlertState} />
            )}

            {activeTab === 'games' && (
                <StudentGamesTab student={student} />
            )}

            {activeTab === 'type-speed' && (
                <StudentTypeSpeedTab />
            )}

            {(activeTab === 'locked-in' || activeTab === 'company-arena') && (
                <StudentLockedInLabTab student={student} />
            )}

            {activeTab === 'study-material' && (
                <StudentStudyMaterialTab student={student} />
            )}
        </div>
    );
};

const StudentPlacementTab = ({ token, student, setAlertState }) => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [applyingId, setApplyingId] = useState(null);
    const [embedFormJob, setEmbedFormJob] = useState(null);

    const getEmbedUrl = (url) => {
        if (!url) return '';
        let formattedUrl = url.trim();
        if (!/^https?:\/\//i.test(formattedUrl)) {
            formattedUrl = 'https://' + formattedUrl;
        }
        try {
            if (formattedUrl.includes('docs.google.com/forms')) {
                const parsedUrl = new URL(formattedUrl);
                if (parsedUrl.pathname.endsWith('/edit')) {
                    parsedUrl.pathname = parsedUrl.pathname.slice(0, -5) + '/viewform';
                } else if (parsedUrl.pathname.endsWith('/formResponse')) {
                    parsedUrl.pathname = parsedUrl.pathname.slice(0, -13) + '/viewform';
                } else if (!parsedUrl.pathname.endsWith('/viewform')) {
                    parsedUrl.pathname = parsedUrl.pathname.replace(/\/?$/, '/viewform');
                }
                parsedUrl.searchParams.set('embedded', 'true');
                return parsedUrl.toString();
            }
            return formattedUrl;
        } catch (e) {
            return formattedUrl;
        }
    };

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/placement/student/jobs`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setJobs(res.data.data || []);
            }
        } catch (e) {
            console.error('Failed to load placement job opportunities', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchJobs();
        }
    }, [token]);

    const handleApply = async (jobId) => {
        try {
            setApplyingId(jobId);
            const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/placement/student/jobs/${jobId}/apply`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setAlertState({
                    open: true,
                    title: 'Application Successful',
                    message: res.data.message || 'You have successfully applied for this job drive.',
                    type: 'success'
                });
                fetchJobs();
            }
        } catch (e) {
            setAlertState({
                open: true,
                title: 'Application Failed',
                message: e.response?.data?.error || 'Failed to submit application.',
                type: 'error'
            });
        } finally {
            setApplyingId(null);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'shortlisted': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'rejected': return 'bg-rose-50 text-rose-700 border-rose-100';
            case 'screening_passed': return 'bg-teal-50 text-teal-700 border-teal-100';
            case 'screening_failed': return 'bg-orange-50 text-orange-700 border-orange-100';
            case 'sent_to_company': return 'bg-purple-50 text-purple-700 border-purple-100';
            default: return 'bg-blue-50 text-blue-700 border-blue-100';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <Loader2 className="animate-spin text-[#5899B5]" size={28} />
                <span className="text-slate-400 text-sm font-semibold ml-2">Loading placement drives...</span>
            </div>
        );
    }

    return (
        <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-50 text-[#5899B5] rounded-2xl">
                        <Briefcase size={22} />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-800">Job Placements & Campus Drives</h3>
                        <p className="text-slate-500 text-xs sm:text-sm">Opportunities targeted to your batch. Check your eligibility rules and apply.</p>
                    </div>
                </div>
                <StudentTabSvg type="placement" />
            </div>

            {jobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                    <Briefcase className="text-slate-400 mb-2.5" size={36} />
                    <p className="text-slate-700 font-semibold text-sm">No Campus Drives Active</p>
                    <p className="text-slate-400 text-xs mt-1">There are no active placement drives published for your batch currently.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {jobs.map((job) => {
                        const isEligible = job.eligibility?.eligible;
                        const reasons = job.eligibility?.reasons || [];
                        const isApplied = job.isApplied;

                        return (
                            <div key={job._id} className="border border-slate-100 rounded-2xl p-5 hover:shadow-md hover:border-[#5899B5]/20 transition-all duration-300 bg-white flex flex-col justify-between group">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-start gap-2">
                                        <span className="text-[10px] font-semibold text-[#5899B5] uppercase bg-blue-50 px-2.5 py-1 rounded-full tracking-wider">
                                            {job.company}
                                        </span>
                                        {isApplied ? (
                                            <span className={`border text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${getStatusBadge(job.applicationStatus)}`}>
                                                Applied • {job.applicationStatus?.replace('_', ' ')}
                                            </span>
                                        ) : isEligible ? (
                                            <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full">Eligible</span>
                                        ) : (
                                            <span className="bg-rose-50 text-rose-600 border border-rose-100 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full">Ineligible</span>
                                        )}
                                    </div>

                                    <h4 className="text-base font-semibold text-slate-800 group-hover:text-[#5899B5] transition-colors leading-snug">
                                        {job.title}
                                    </h4>

                                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{job.description}</p>

                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1 text-[11px] font-semibold text-slate-400">
                                        {job.location && <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>}
                                        {job.salaryPackage && <span className="flex items-center gap-1"><DollarSign size={12} /> Package: {job.salaryPackage}</span>}
                                    </div>

                                    {/* Criteria Rules UI */}
                                    <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-[11px] text-slate-600 font-semibold border border-slate-100">
                                        <div className="flex justify-between">
                                            <span>Min CGPA Requirement:</span>
                                            <span className="text-slate-800">{job.rules?.minCgpa !== null ? job.rules.minCgpa : 'Open'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Max Active Backlogs:</span>
                                            <span className="text-slate-800">{job.rules?.maxBacklogs !== null ? job.rules.maxBacklogs : 'Open'}</span>
                                        </div>
                                        {job.rules?.allowedDepartments && job.rules.allowedDepartments.length > 0 && (
                                            <div className="flex justify-between">
                                                <span>Eligible Branches:</span>
                                                <span className="text-slate-800">{job.rules.allowedDepartments.join(', ')}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Warnings if ineligible */}
                                    {!isEligible && (
                                        <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl space-y-1 text-rose-700 text-xs font-semibold">
                                            <p className="flex items-center gap-1"><AlertTriangle size={12} /> Eligibility Warnings:</p>
                                            <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                                                {reasons.map((r, i) => <li key={i}>{r}</li>)}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-5 pt-3 border-t border-slate-50">
                                    {isApplied ? (
                                        <div className="text-center py-2 bg-slate-50 text-slate-400 text-xs font-bold rounded-xl border border-slate-100">
                                            Application Submitted
                                        </div>
                                    ) : !isEligible ? (
                                        <div className="text-center py-2 bg-slate-50 text-slate-400 text-xs font-bold rounded-xl border border-slate-100 cursor-not-allowed">
                                            Criteria Not Met
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                if (job.googleFormUrl) {
                                                    setEmbedFormJob(job);
                                                } else {
                                                    handleApply(job._id);
                                                }
                                            }}
                                            disabled={applyingId === job._id}
                                            className="w-full py-2.5 bg-[#5899B5] hover:bg-[#3D7690] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition shadow-sm"
                                        >
                                            {applyingId === job._id ? (
                                                <Loader2 className="animate-spin" size={14} />
                                            ) : (
                                                <span>Apply for Role</span>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Google Form Embed Modal */}
            <AnimatePresence>
                {embedFormJob && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setEmbedFormJob(null)}
                            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
                        />

                        {/* Modal Dialog */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-[2rem] border border-slate-100 shadow-2xl w-full max-w-4xl overflow-hidden z-10 flex flex-col max-h-[90vh] font-sans text-left"
                        >
                            <div className="px-6 py-5 bg-slate-50 border-b border-slate-150 flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                        <Briefcase size={18} className="text-[#5899B5]" />
                                        Application Form: {embedFormJob.company}
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-0.5">Role: {embedFormJob.title}</p>
                                </div>
                                <button 
                                    onClick={() => setEmbedFormJob(null)}
                                    className="text-slate-400 hover:text-slate-650 font-semibold text-xl p-1"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="p-6 space-y-4 flex-1 overflow-y-auto flex flex-col">
                                <div className="p-3.5 bg-blue-50 border border-blue-100 rounded-xl text-xs text-[#5899B5] font-medium leading-relaxed">
                                    <strong>Instructions:</strong> Please fill out and submit the Google Form displayed below. After completing the form, you <strong>must</strong> click the <strong>"Confirm & Complete Application"</strong> button at the bottom to register your application in the placement system.
                                </div>

                                <div className="flex-1 w-full bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden relative min-h-[450px]">
                                    <iframe 
                                        src={getEmbedUrl(embedFormJob.googleFormUrl)} 
                                        width="100%" 
                                        height="100%" 
                                        className="absolute inset-0 border-0 w-full h-full"
                                        title="Google Form" 
                                    />
                                </div>
                            </div>

                            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <span className="text-[11px] text-slate-500 font-semibold">
                                    Your profile details and resume will be shared with the recruiter.
                                </span>
                                <div className="flex items-center gap-3 justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setEmbedFormJob(null)}
                                        className="px-5 py-2.5 border border-slate-200 hover:bg-slate-100 text-slate-650 font-semibold text-xs rounded-xl cursor-pointer transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            const id = embedFormJob._id;
                                            setEmbedFormJob(null);
                                            await handleApply(id);
                                        }}
                                        className="px-6 py-2.5 bg-[#5899B5] hover:bg-[#3D7690] text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/10 cursor-pointer transition"
                                    >
                                        Confirm & Complete Application
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StudentDashboard;
