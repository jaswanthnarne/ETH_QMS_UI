import React, { useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import {
    BookOpen,
    Code2,
    Terminal,
    CheckCircle2,
    ChevronRight,
    ChevronLeft,
    Copy,
    Check,
    Search,
    Edit3,
    Plus,
    Trash2,
    RotateCcw,
    BarChart3,
    GitBranch,
    Lightbulb,
    FileCode,
    X,
    Upload,
    Award,
    Clock,
    ShieldCheck,
    ArrowRight,
    ArrowLeft,
    Layers,
    Cpu
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useStudentAuthStore from '../../store/studentAuthStore';
import { useToastStore } from '../../store/toastStore';
import { ALL_LANGUAGE_TRACKS } from '../../data/languageCurriculumData';
import { getChapterSubTopics } from '../../data/byteBaseSubTopicGenerator';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BRAND_PRIMARY = '#5899B5';

/* ─────────────────── Unified Brand-Themed Language Emblem SVG ─────────────────── */
const LanguageEmblemSvg = ({ slug, badge, logoUrl, size = 'md' }) => {
    const dim =
        size === 'lg'
            ? 'w-12 h-12 text-sm'
            : size === 'sm'
            ? 'w-9 h-9 text-xs'
            : 'w-11 h-11 text-xs';

    if (logoUrl) {
        return (
            <div
                className={`${dim} rounded-xl bg-white border border-slate-200 p-1.5 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs`}
            >
                <img src={logoUrl} alt={badge || slug} className="w-full h-full object-contain" />
            </div>
        );
    }

    const s = String(slug || '').toLowerCase();

    return (
        <div
            className={`${dim} rounded-xl flex items-center justify-center font-semibold tracking-tight shrink-0 border bg-[#5899B5]/10 border-[#5899B5]/25 text-[#3D7690]`}
        >
            {s === 'python' ? (
                <span className="font-mono font-semibold text-xs">PY</span>
            ) : s === 'c' ? (
                <span className="font-mono font-semibold text-base">C</span>
            ) : s === 'cpp' ? (
                <span className="font-mono font-semibold text-xs">C++</span>
            ) : s === 'java' ? (
                <span className="font-mono font-semibold text-xs">JAVA</span>
            ) : s === 'javascript' ? (
                <span className="font-mono font-semibold text-xs">JS</span>
            ) : s === 'html' ? (
                <span className="font-mono font-semibold text-xs">&lt;/&gt;</span>
            ) : s === 'css' ? (
                <span className="font-mono font-semibold text-xs">CSS</span>
            ) : s === 'oops' ? (
                <span className="font-mono font-semibold text-xs">OOP</span>
            ) : (
                <span className="font-mono font-semibold">{badge || s.slice(0, 3).toUpperCase()}</span>
            )}
        </div>
    );
};

/* ─────────────────── Visual Architecture Illustration SVG Banner ─────────────────── */
const SubTopicArchitectureIllustration = ({
    type = 'architecture',
    languageName = 'Language',
    chapterTitle = '',
    topicTitle = '',
    steps = []
}) => {
    const nodes =
        Array.isArray(steps) && steps.length >= 3
            ? steps.slice(0, 4)
            : ['Input & Lexical Parse', 'AST & Memory Binding', 'Execution Core', 'Verified Output'];

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#5899B5]/15 text-[#3D7690] flex items-center justify-center">
                        <Cpu size={16} />
                    </div>
                    <div>
                        <span className="text-[10px] font-medium uppercase tracking-wider text-[#5899B5] block">
                            Visual Systems Architecture &amp; Memory Diagram
                        </span>
                        <h4 className="text-sm sm:text-base font-medium text-slate-900">
                            {topicTitle || chapterTitle}
                        </h4>
                    </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-[#5899B5]/10 text-[#3D7690]">
                    {languageName} Runtime View
                </span>
            </div>

            {/* Crisp Vector SVG Architecture Blueprint */}
            <div className="w-full overflow-x-auto bg-slate-50/80 border border-slate-200/80 rounded-xl p-4">
                <svg
                    viewBox="0 0 820 185"
                    className="w-full min-w-[640px] h-auto"
                    role="img"
                    aria-label={`Architecture blueprint for ${topicTitle}`}
                >
                    <defs>
                        <pattern
                            id="bytebase-grid"
                            width="20"
                            height="20"
                            patternUnits="userSpaceOnUse"
                        >
                            <path
                                d="M 20 0 L 0 0 0 20"
                                fill="none"
                                stroke="#E2E8F0"
                                strokeWidth="0.7"
                            />
                        </pattern>
                        <marker
                            id="bytebase-arrow"
                            viewBox="0 0 10 10"
                            refX="8"
                            refY="5"
                            markerWidth="6"
                            markerHeight="6"
                            orient="auto-start-reverse"
                        >
                            <path d="M 0 1 L 10 5 L 0 9 z" fill="#5899B5" />
                        </marker>
                    </defs>

                    <rect width="820" height="185" rx="12" fill="url(#bytebase-grid)" />

                    {/* Top Telemetry Strip */}
                    <rect
                        x="16"
                        y="12"
                        width="788"
                        height="26"
                        rx="6"
                        fill="#5899B5"
                        fillOpacity="0.10"
                        stroke="#5899B5"
                        strokeOpacity="0.3"
                    />
                    <text
                        x="28"
                        y="29"
                        fontSize="10"
                        fontWeight="800"
                        fill="#3D7690"
                        fontFamily="monospace"
                    >
                        {languageName.toUpperCase()} EXECUTION &amp; MEMORY PIPELINE • MODE:{' '}
                        {String(type).toUpperCase()}
                    </text>
                    <text
                        x="790"
                        y="29"
                        textAnchor="end"
                        fontSize="10"
                        fontWeight="700"
                        fill="#5899B5"
                        fontFamily="monospace"
                    >
                        L1 CACHE: 64B • DETERMINISTIC TRACE
                    </text>

                    {/* 4 Connected Architecture Nodes */}
                    {nodes.map((label, idx) => {
                        const x = 20 + idx * 200;
                        const y = 54;
                        const w = 176;
                        const h = 76;
                        const cleanLabel =
                            label.length > 26 ? `${label.slice(0, 24)}...` : label;
                        const subLabel =
                            idx === 0
                                ? 'Stage 01 • Ingress'
                                : idx === 1
                                ? 'Stage 02 • Memory/AST'
                                : idx === 2
                                ? 'Stage 03 • Core Engine'
                                : 'Stage 04 • Verified Out';

                        return (
                            <g key={idx}>
                                <rect
                                    x={x}
                                    y={y}
                                    width={w}
                                    height={h}
                                    rx="10"
                                    fill="#FFFFFF"
                                    stroke="#5899B5"
                                    strokeWidth="1.8"
                                />
                                <rect
                                    x={x}
                                    y={y}
                                    width={w}
                                    height="22"
                                    rx="9"
                                    fill="#5899B5"
                                />
                                <text
                                    x={x + 10}
                                    y={y + 15}
                                    fontSize="9.5"
                                    fontWeight="800"
                                    fill="#FFFFFF"
                                    fontFamily="monospace"
                                >
                                    {subLabel}
                                </text>
                                <text
                                    x={x + 12}
                                    y={y + 46}
                                    fontSize="10.5"
                                    fontWeight="700"
                                    fill="#0F172A"
                                >
                                    {cleanLabel}
                                </text>
                                <text
                                    x={x + 12}
                                    y={y + 62}
                                    fontSize="9"
                                    fontWeight="600"
                                    fill="#64748B"
                                    fontFamily="monospace"
                                >
                                    {idx === 0
                                        ? 'addr: 0x7ffd..00'
                                        : idx === 1
                                        ? 'bind: O(1) slot'
                                        : idx === 2
                                        ? 'exec: ALU/JIT'
                                        : 'status: 200 OK'}
                                </text>

                                {idx < nodes.length - 1 && (
                                    <line
                                        x1={x + w + 2}
                                        y1={y + h / 2}
                                        x2={x + w + 20}
                                        y2={y + h / 2}
                                        stroke="#5899B5"
                                        strokeWidth="2"
                                        markerEnd="url(#bytebase-arrow)"
                                    />
                                )}
                            </g>
                        );
                    })}

                    {/* Bottom Memory Bus Bar */}
                    <rect
                        x="20"
                        y="144"
                        width="776"
                        height="26"
                        rx="6"
                        fill="#0F172A"
                    />
                    <text
                        x="34"
                        y="161"
                        fontSize="9.5"
                        fontWeight="700"
                        fill="#BAE6FD"
                        fontFamily="monospace"
                    >
                        VIRTUAL ADDRESS SPACE: [ TEXT / CODE ] ──► [ DATA / BSS ] ──► [ HEAP ↑ ]
                        ◄──► [ ↓ CALL STACK FRAMES ]
                    </text>
                </svg>
            </div>
        </div>
    );
};

/* ─────────────────── Architecture Flowchart Step Cards ─────────────────── */
const ChapterFlowDiagramSvg = ({ title, steps = [], languageName = '' }) => {
    const cleanSteps =
        Array.isArray(steps) && steps.length > 0
            ? steps
            : ['Source Input', 'Compiler / Interpreter', 'Memory Allocation', 'Runtime Output'];

    return (
        <div className="bg-slate-50/80 rounded-2xl p-5 sm:p-6 border border-slate-200 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#5899B5]/15 text-[#3D7690] flex items-center justify-center">
                        <GitBranch size={16} />
                    </div>
                    <div>
                        <span className="text-[10px] font-medium uppercase tracking-wider text-[#5899B5] block">
                            Step-by-Step Execution Flowchart
                        </span>
                        <h4 className="text-sm sm:text-base font-medium text-slate-900">
                            {title || `${languageName} Execution Pipeline`}
                        </h4>
                    </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-white text-slate-600 border border-slate-200">
                    {cleanSteps.length} Stages
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
                {cleanSteps.map((step, idx) => (
                    <div
                        key={idx}
                        className="relative bg-white border border-slate-200 hover:border-[#5899B5]/60 rounded-xl p-3.5 flex flex-col justify-between transition-colors shadow-2xs group"
                    >
                        <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg text-[11px] font-semibold text-white bg-[#5899B5]">
                                0{idx + 1}
                            </span>
                            {idx < cleanSteps.length - 1 && (
                                <ArrowRight
                                    size={14}
                                    className="text-slate-400 group-hover:text-[#5899B5] transition-colors"
                                />
                            )}
                        </div>
                        <p className="text-xs font-semibold text-slate-800 leading-snug">{step}</p>
                        <div className="h-1 w-full rounded-full mt-3 bg-[#5899B5]/25 group-hover:bg-[#5899B5] transition-colors" />
                    </div>
                ))}
            </div>
        </div>
    );
};

/* ─────────────────── Complexity & Benchmark Graph + Asymptotic Curve SVG ─────────────────── */
const ChapterBenchmarkGraph = ({ title, metricLabel, graphData = [] }) => {
    if (!Array.isArray(graphData) || graphData.length === 0) return null;

    const maxVal = Math.max(...graphData.map((d) => Number(d.value) || 1), 100);

    return (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#5899B5]/15 text-[#3D7690] flex items-center justify-center">
                        <BarChart3 size={16} />
                    </div>
                    <div>
                        <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 block">
                            {metricLabel || 'Complexity & Performance Telemetry Graph'}
                        </span>
                        <h4 className="text-sm sm:text-base font-medium text-slate-900">
                            {title || 'Benchmark & Complexity Comparison'}
                        </h4>
                    </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600">
                    Comparative Telemetry
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Left 7 cols: Horizontal Telemetry Bars */}
                <div className="lg:col-span-7 space-y-3.5">
                    {graphData.map((bar, idx) => {
                        const pct = Math.max(
                            6,
                            Math.min(100, Math.round(((Number(bar.value) || 10) / maxVal) * 100))
                        );
                        const isPrimary = idx === 0;

                        return (
                            <div key={idx} className="space-y-1.5">
                                <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs">
                                    <span className="font-medium text-slate-800 flex items-center gap-2">
                                        <span
                                            className={`w-2 h-2 rounded-full shrink-0 ${
                                                isPrimary ? 'bg-[#5899B5]' : 'bg-slate-400'
                                            }`}
                                        />
                                        {bar.label}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        {bar.note && (
                                            <span className="text-[11px] text-slate-500 hidden sm:inline">
                                                {bar.note}
                                            </span>
                                        )}
                                        <span
                                            className={`px-2 py-0.5 rounded-md font-mono font-medium text-[11px] ${
                                                isPrimary
                                                    ? 'bg-[#5899B5]/15 text-[#3D7690]'
                                                    : 'bg-slate-100 text-slate-700'
                                            }`}
                                        >
                                            {bar.displayValue || `${bar.value}`}
                                        </span>
                                    </div>
                                </div>
                                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${
                                            isPrimary ? 'bg-[#5899B5]' : 'bg-slate-400'
                                        }`}
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                                {bar.note && (
                                    <p className="text-[11px] text-slate-500 sm:hidden">
                                        {bar.note}
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Right 5 cols: SVG Asymptotic Scaling Curve Chart */}
                <div className="lg:col-span-5 bg-slate-50 border border-slate-200/80 rounded-xl p-3.5">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                            Scaling Curve (Ops vs Input N)
                        </span>
                        <span className="text-[10px] font-mono font-medium text-[#3D7690]">
                            O(1) • O(log N) • O(N) • O(N²)
                        </span>
                    </div>
                    <svg viewBox="0 0 260 130" className="w-full h-32" aria-hidden="true">
                        {/* Axes */}
                        <line x1="28" y1="12" x2="28" y2="108" stroke="#94A3B8" strokeWidth="1.5" />
                        <line x1="28" y1="108" x2="246" y2="108" stroke="#94A3B8" strokeWidth="1.5" />
                        {/* O(N^2) Steep Curve */}
                        <path
                            d="M 28 108 Q 75 102 125 14"
                            fill="none"
                            stroke="#94A3B8"
                            strokeWidth="1.8"
                            strokeDasharray="4 3"
                        />
                        <text x="128" y="22" fontSize="8.5" fontWeight="700" fill="#64748B">
                            O(N²) Naive
                        </text>
                        {/* O(N) Linear Curve */}
                        <line
                            x1="28"
                            y1="108"
                            x2="225"
                            y2="34"
                            stroke="#64748B"
                            strokeWidth="1.8"
                        />
                        <text x="200" y="30" fontSize="8.5" fontWeight="700" fill="#475569">
                            O(N)
                        </text>
                        {/* O(log N) / O(1) Optimal Curve */}
                        <path
                            d="M 28 108 Q 90 86 240 82"
                            fill="none"
                            stroke="#5899B5"
                            strokeWidth="2.6"
                        />
                        <text x="182" y="76" fontSize="9" fontWeight="800" fill="#3D7690">
                            O(log N) / O(1) Optimal
                        </text>
                        <text x="135" y="123" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#64748B">
                            Input Scale (N → 10⁵)
                        </text>
                    </svg>
                </div>
            </div>
        </div>
    );
};

/* ─────────────────── Helper: Compress Uploaded Image to Data URL ─────────────────── */
const compressImageToDataUrl = (file, maxWidth = 1200, quality = 0.82) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const scale = img.width > maxWidth ? maxWidth / img.width : 1;
                const canvas = document.createElement('canvas');
                canvas.width = Math.round(img.width * scale);
                canvas.height = Math.round(img.height * scale);
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT: LanguageDescriptionHub (ByteBase)
   4-Level Hierarchical Card Flow (Single Unified Color Theme):
   - Level 1: Language Catalog Cards (8 Languages, each with "Get Started")
   - Level 2: 10 Chapter Cards for the selected Language (each with "Open Chapter (10 Modules)")
   - Level 3: 10 Sub-Topic Cards inside the selected Chapter (each with "Read Topic")
   - Level 4: Full Enhanced Sub-Topic Reader (Content, SVG Architecture Blueprint,
              Flowchart, Benchmark Graph, Images, Syntax Table, Examples & Problems)
   ═══════════════════════════════════════════════════════════════════════════ */
const LanguageDescriptionHub = ({ isStudentView = false }) => {
    const { user, token: staffToken } = useAuthStore();
    const { student, token: studentToken } = useStudentAuthStore();
    const toast = useToastStore();

    const activeToken = isStudentView ? studentToken || staffToken : staffToken || studentToken;
    const isAdminCustomizer =
        !isStudentView &&
        ['super_admin', 'ops_admin', 'ast_ops_admin', 'college_admin'].includes(user?.role);

    const [tracks, setTracks] = useState(ALL_LANGUAGE_TRACKS);
    const [canCustomize, setCanCustomize] = useState(isAdminCustomizer);

    // 4-Level Navigation State:
    // Level 1: activeLanguageSlug === null
    // Level 2: activeLanguageSlug !== null && activeChapterNum === null
    // Level 3: activeLanguageSlug !== null && activeChapterNum !== null && activeTopicNum === null
    // Level 4: activeLanguageSlug !== null && activeChapterNum !== null && activeTopicNum !== null
    const [activeLanguageSlug, setActiveLanguageSlug] = useState(null);
    const [activeChapterNum, setActiveChapterNum] = useState(null);
    const [activeTopicNum, setActiveTopicNum] = useState(null);

    const [catalogSearch, setCatalogSearch] = useState('');
    const [chapterSearch, setChapterSearch] = useState('');
    const [topicSearch, setTopicSearch] = useState('');
    const [copiedCodeKey, setCopiedCodeKey] = useState(null);
    const [revealedHints, setRevealedHints] = useState({});
    const [saving, setSaving] = useState(false);

    // Per-user local reading progress tracker (tracks both chapters and sub-topics)
    const progressStorageKey = useMemo(() => {
        const actorId = student?._id || student?.usn || user?._id || 'guest';
        return `eth_bytebase_progress_${actorId}`;
    }, [student?._id, student?.usn, user?._id]);

    const [completedMap, setCompletedMap] = useState(() => {
        try {
            const raw = localStorage.getItem(progressStorageKey);
            return raw ? JSON.parse(raw) : {};
        } catch {
            return {};
        }
    });

    useEffect(() => {
        try {
            const raw = localStorage.getItem(progressStorageKey);
            setCompletedMap(raw ? JSON.parse(raw) : {});
        } catch {
            setCompletedMap({});
        }
    }, [progressStorageKey]);

    const toggleTopicCompleted = (slug, chapterNumber, topicNumber) => {
        const topicKey = `${slug}:ch${chapterNumber}:t${topicNumber}`;
        setCompletedMap((prev) => {
            const next = { ...prev, [topicKey]: !prev[topicKey] };
            // If at least 1 topic or all topics completed, also mark chapter status
            let doneTopics = 0;
            for (let t = 1; t <= 10; t++) {
                if (next[`${slug}:ch${chapterNumber}:t${t}`]) doneTopics++;
            }
            if (doneTopics === 10) {
                next[`${slug}:${chapterNumber}`] = true;
            }
            try {
                localStorage.setItem(progressStorageKey, JSON.stringify(next));
            } catch {
                // ignore quota errors
            }
            return next;
        });
    };

    const toggleChapterCompleted = (slug, chapterNumber) => {
        const chKey = `${slug}:${chapterNumber}`;
        setCompletedMap((prev) => {
            const nextState = !prev[chKey];
            const next = { ...prev, [chKey]: nextState };
            for (let t = 1; t <= 10; t++) {
                next[`${slug}:ch${chapterNumber}:t${t}`] = nextState;
            }
            try {
                localStorage.setItem(progressStorageKey, JSON.stringify(next));
            } catch {
                // ignore
            }
            return next;
        });
    };

    // Fetch customized tracks from backend API
    const fetchTracks = async () => {
        if (!activeToken) return;
        try {
            const res = await axios.get(`${API_BASE}/language-description`, {
                headers: { Authorization: `Bearer ${activeToken}` }
            });
            if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
                setTracks(res.data.data);
                setCanCustomize(!isStudentView && (Boolean(res.data.canCustomize) || isAdminCustomizer));
            }
        } catch (err) {
            console.warn('Using built-in ByteBase curriculum catalog:', err?.message);
        }
    };

    useEffect(() => {
        fetchTracks();
    }, [activeToken, isStudentView]);

    const filteredCatalogTracks = useMemo(() => {
        if (!catalogSearch.trim()) return tracks;
        const q = catalogSearch.trim().toLowerCase();
        return tracks.filter(
            (t) =>
                t.name?.toLowerCase().includes(q) ||
                t.fullName?.toLowerCase().includes(q) ||
                t.description?.toLowerCase().includes(q) ||
                t.paradigm?.toLowerCase().includes(q) ||
                (t.chapters || []).some((c) => c.title?.toLowerCase().includes(q))
        );
    }, [tracks, catalogSearch]);

    const activeTrack = useMemo(
        () =>
            tracks.find((t) => t.slug === activeLanguageSlug) ||
            tracks[0] ||
            ALL_LANGUAGE_TRACKS[0],
        [tracks, activeLanguageSlug]
    );

    const chapters = useMemo(() => {
        const list = Array.isArray(activeTrack?.chapters) ? [...activeTrack.chapters] : [];
        return list.sort((a, b) => (a.chapterNumber || 0) - (b.chapterNumber || 0));
    }, [activeTrack]);

    const filteredChapters = useMemo(() => {
        if (!chapterSearch.trim()) return chapters;
        const q = chapterSearch.trim().toLowerCase();
        return chapters.filter(
            (c) =>
                c.title?.toLowerCase().includes(q) ||
                c.summary?.toLowerCase().includes(q) ||
                c.overview?.toLowerCase().includes(q) ||
                String(c.chapterNumber).includes(q)
        );
    }, [chapters, chapterSearch]);

    const activeChapter = useMemo(
        () =>
            chapters.find((c) => Number(c.chapterNumber) === Number(activeChapterNum)) ||
            chapters[0] ||
            null,
        [chapters, activeChapterNum]
    );

    // 10 Sub-Topics for the currently active chapter
    const subTopics = useMemo(
        () => getChapterSubTopics(activeTrack, activeChapter),
        [activeTrack, activeChapter]
    );

    const filteredSubTopics = useMemo(() => {
        if (!topicSearch.trim()) return subTopics;
        const q = topicSearch.trim().toLowerCase();
        return subTopics.filter(
            (t) =>
                t.title?.toLowerCase().includes(q) ||
                t.summary?.toLowerCase().includes(q) ||
                t.badge?.toLowerCase().includes(q) ||
                String(t.topicNumber).includes(q)
        );
    }, [subTopics, topicSearch]);

    const activeSubTopic = useMemo(
        () =>
            subTopics.find((t) => Number(t.topicNumber) === Number(activeTopicNum)) ||
            subTopics[0] ||
            null,
        [subTopics, activeTopicNum]
    );

    /* ─────────────────── Navigation Helpers ─────────────────── */
    const handleOpenLanguageTrack = (slug) => {
        setActiveLanguageSlug(slug);
        setActiveChapterNum(null);
        setActiveTopicNum(null);
        setChapterSearch('');
        setTopicSearch('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleOpenChapter = (chapterNumber) => {
        setActiveChapterNum(chapterNumber);
        setActiveTopicNum(null);
        setTopicSearch('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleOpenSubTopic = (topicNumber) => {
        setActiveTopicNum(topicNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCopyCode = (code, key) => {
        navigator.clipboard?.writeText(code);
        setCopiedCodeKey(key);
        setTimeout(() => setCopiedCodeKey(null), 1800);
    };

    const getChapterDoneTopicsCount = (slug, chapterNumber) => {
        let count = 0;
        for (let t = 1; t <= 10; t++) {
            if (completedMap[`${slug}:ch${chapterNumber}:t${t}`]) count++;
        }
        if (count === 0 && completedMap[`${slug}:${chapterNumber}`]) return 10;
        return count;
    };

    const trackCompletedCount = useMemo(() => {
        if (!activeTrack) return 0;
        return chapters.filter(
            (c) =>
                completedMap[`${activeTrack.slug}:${c.chapterNumber}`] ||
                getChapterDoneTopicsCount(activeTrack.slug, c.chapterNumber) === 10
        ).length;
    }, [activeTrack, chapters, completedMap]);

    /* ─────────────────── Admin / Ops Admin Customization Modals State ─────────────────── */
    const [chapterModalOpen, setChapterModalOpen] = useState(false);
    const [trackModalOpen, setTrackModalOpen] = useState(false);
    const [isNewTrackMode, setIsNewTrackMode] = useState(false);
    const [editingTrackSlug, setEditingTrackSlug] = useState(null);

    const [trackForm, setTrackForm] = useState({
        name: '',
        slug: '',
        fullName: '',
        badge: '',
        tagline: '',
        description: '',
        accentColor: BRAND_PRIMARY,
        fileExtension: '.py',
        paradigm: 'Multi-Paradigm',
        creatorInfo: '',
        logoUrl: ''
    });

    const [chapterForm, setChapterForm] = useState({
        chapterNumber: 1,
        title: '',
        duration: '15 min read',
        difficulty: 'Beginner',
        summary: '',
        overview: '',
        keyPointsText: '',
        diagramTitle: '',
        diagramStepsText: '',
        graphTitle: '',
        graphMetricLabel: '',
        graphData: [],
        syntaxSummaryCode: '',
        syntaxTable: [],
        images: [],
        examples: [],
        problems: []
    });

    const imageInputRef = useRef(null);

    const openEditTrackModal = (createNew = false, targetTrack = null) => {
        setIsNewTrackMode(createNew);
        const trackToEdit = targetTrack || activeTrack;
        if (createNew) {
            setEditingTrackSlug(null);
            setTrackForm({
                name: '',
                slug: '',
                fullName: '',
                badge: '',
                tagline: '',
                description: '',
                accentColor: BRAND_PRIMARY,
                fileExtension: '.txt',
                paradigm: 'Multi-Paradigm',
                creatorInfo: '',
                logoUrl: ''
            });
        } else if (trackToEdit) {
            setEditingTrackSlug(trackToEdit.slug);
            setTrackForm({
                name: trackToEdit.name || '',
                slug: trackToEdit.slug || '',
                fullName: trackToEdit.fullName || '',
                badge: trackToEdit.badge || '',
                tagline: trackToEdit.tagline || '',
                description: trackToEdit.description || '',
                accentColor: BRAND_PRIMARY,
                fileExtension: trackToEdit.fileExtension || '.txt',
                paradigm: trackToEdit.paradigm || '',
                creatorInfo: trackToEdit.creatorInfo || '',
                logoUrl: trackToEdit.logoUrl || ''
            });
        }
        setTrackModalOpen(true);
    };

    const openEditChapterModal = (chapterObj = null) => {
        if (chapterObj) {
            setChapterForm({
                chapterNumber: chapterObj.chapterNumber || 1,
                title: chapterObj.title || '',
                duration: chapterObj.duration || '15 min read',
                difficulty: chapterObj.difficulty || 'Beginner',
                summary: chapterObj.summary || '',
                overview: chapterObj.overview || '',
                keyPointsText: (chapterObj.keyPoints || []).join('\n'),
                diagramTitle: chapterObj.diagramTitle || 'Execution & Architecture Flow',
                diagramStepsText: (chapterObj.diagramSteps || []).join('\n'),
                graphTitle: chapterObj.graphTitle || 'Performance & Complexity Benchmark',
                graphMetricLabel: chapterObj.graphMetricLabel || 'Relative Efficiency Metric',
                graphData:
                    Array.isArray(chapterObj.graphData) && chapterObj.graphData.length > 0
                        ? chapterObj.graphData.map((g) => ({ ...g }))
                        : [{ label: 'Optimized Approach', value: 15, displayValue: 'O(N)', note: 'Fastest' }],
                syntaxSummaryCode: chapterObj.syntaxSummaryCode || '',
                syntaxTable:
                    Array.isArray(chapterObj.syntaxTable) && chapterObj.syntaxTable.length > 0
                        ? chapterObj.syntaxTable.map((r) => ({ ...r }))
                        : [{ construct: '', syntax: '', description: '' }],
                images: Array.isArray(chapterObj.images) ? chapterObj.images.map((img) => ({ ...img })) : [],
                examples:
                    Array.isArray(chapterObj.examples) && chapterObj.examples.length > 0
                        ? chapterObj.examples.map((ex) => ({ ...ex }))
                        : [{ title: 'Code Example 1', code: '', output: '', explanation: '' }],
                problems:
                    Array.isArray(chapterObj.problems) && chapterObj.problems.length > 0
                        ? chapterObj.problems.map((p) => ({ ...p }))
                        : [
                              {
                                  title: 'Practice Challenge 1',
                                  difficulty: 'Easy',
                                  statement: '',
                                  sampleInput: '',
                                  sampleOutput: '',
                                  constraints: '',
                                  hint: ''
                              }
                          ]
            });
        } else {
            const nextNum = chapters.length + 1;
            setChapterForm({
                chapterNumber: nextNum,
                title: `Chapter ${nextNum}: New Topic`,
                duration: '15 min read',
                difficulty: 'Intermediate',
                summary: '',
                overview: '',
                keyPointsText: '',
                diagramTitle: 'Execution & Architecture Flow',
                diagramStepsText: 'Step 1: Input\nStep 2: Process\nStep 3: Output',
                graphTitle: 'Performance & Complexity Benchmark',
                graphMetricLabel: 'Relative Efficiency Metric',
                graphData: [
                    { label: 'Optimal Approach', value: 15, displayValue: 'O(N)', note: 'Linear time' },
                    { label: 'Naive Approach', value: 90, displayValue: 'O(N²)', note: 'Nested loop' }
                ],
                syntaxSummaryCode: '',
                syntaxTable: [{ construct: 'Construct', syntax: 'syntax()', description: 'Usage note' }],
                images: [],
                examples: [{ title: 'Annotated Example', code: '', output: '', explanation: '' }],
                problems: [
                    {
                        title: 'Practice Problem',
                        difficulty: 'Easy',
                        statement: '',
                        sampleInput: '',
                        sampleOutput: '',
                        constraints: '',
                        hint: ''
                    }
                ]
            });
        }
        setChapterModalOpen(true);
    };

    const handleSaveTrack = async (e) => {
        e.preventDefault();
        if (!trackForm.name.trim()) return;
        setSaving(true);
        try {
            if (isNewTrackMode) {
                const res = await axios.post(`${API_BASE}/language-description/tracks`, trackForm, {
                    headers: { Authorization: `Bearer ${activeToken}` }
                });
                if (res.data?.success) {
                    const created = res.data.data;
                    setTracks((prev) => [...prev, created]);
                    toast.success(`Created language track "${created.name}"`);
                    setTrackModalOpen(false);
                }
            } else {
                const slugToUpdate = editingTrackSlug || activeTrack?.slug;
                const res = await axios.put(
                    `${API_BASE}/language-description/tracks/${slugToUpdate}`,
                    trackForm,
                    { headers: { Authorization: `Bearer ${activeToken}` } }
                );
                if (res.data?.success) {
                    const updated = res.data.data;
                    setTracks((prev) => prev.map((t) => (t.slug === updated.slug ? updated : t)));
                    toast.success(`Updated "${updated.name}" track details`);
                    setTrackModalOpen(false);
                }
            }
        } catch (err) {
            toast.error(err?.response?.data?.error || 'Failed to save language track');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveChapter = async (e) => {
        e.preventDefault();
        if (!chapterForm.title.trim() || !chapterForm.overview.trim()) {
            toast.error('Chapter title and overview content are required');
            return;
        }
        setSaving(true);
        try {
            const payload = {
                chapterNumber: Number(chapterForm.chapterNumber) || 1,
                title: chapterForm.title.trim(),
                duration: chapterForm.duration.trim() || '15 min read',
                difficulty: chapterForm.difficulty,
                summary: chapterForm.summary.trim(),
                overview: chapterForm.overview,
                keyPoints: chapterForm.keyPointsText
                    .split('\n')
                    .map((s) => s.trim())
                    .filter(Boolean),
                diagramTitle: chapterForm.diagramTitle.trim(),
                diagramSteps: chapterForm.diagramStepsText
                    .split('\n')
                    .map((s) => s.trim())
                    .filter(Boolean),
                graphTitle: chapterForm.graphTitle.trim(),
                graphMetricLabel: chapterForm.graphMetricLabel.trim(),
                graphData: chapterForm.graphData,
                syntaxSummaryCode: chapterForm.syntaxSummaryCode,
                syntaxTable: chapterForm.syntaxTable,
                images: chapterForm.images,
                examples: chapterForm.examples,
                problems: chapterForm.problems
            };

            const res = await axios.put(
                `${API_BASE}/language-description/tracks/${activeTrack.slug}/chapters/${payload.chapterNumber}`,
                payload,
                { headers: { Authorization: `Bearer ${activeToken}` } }
            );
            if (res.data?.success) {
                const updatedTrack = res.data.data;
                setTracks((prev) =>
                    prev.map((t) => (t.slug === updatedTrack.slug ? updatedTrack : t))
                );
                setActiveChapterNum(payload.chapterNumber);
                toast.success(`Saved Chapter ${payload.chapterNumber}: ${payload.title}`);
                setChapterModalOpen(false);
            }
        } catch (err) {
            toast.error(err?.response?.data?.error || 'Failed to save chapter customization');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteChapter = async (chapterNum) => {
        if (!window.confirm(`Delete Chapter ${chapterNum} from ${activeTrack.name}?`)) return;
        try {
            const res = await axios.delete(
                `${API_BASE}/language-description/tracks/${activeTrack.slug}/chapters/${chapterNum}`,
                { headers: { Authorization: `Bearer ${activeToken}` } }
            );
            if (res.data?.success) {
                const updatedTrack = res.data.data;
                setTracks((prev) =>
                    prev.map((t) => (t.slug === updatedTrack.slug ? updatedTrack : t))
                );
                setActiveChapterNum(null);
                setActiveTopicNum(null);
                toast.success(`Removed Chapter ${chapterNum}`);
            }
        } catch (err) {
            toast.error(err?.response?.data?.error || 'Failed to delete chapter');
        }
    };

    const handleResetTrackDefaults = async () => {
        if (
            !window.confirm(
                `Reset all 10 chapters of ${activeTrack.name} back to the default Ethnotech curriculum?`
            )
        )
            return;
        try {
            const res = await axios.post(
                `${API_BASE}/language-description/tracks/${activeTrack.slug}/reset`,
                {},
                { headers: { Authorization: `Bearer ${activeToken}` } }
            );
            if (res.data?.success) {
                const updatedTrack = res.data.data;
                setTracks((prev) =>
                    prev.map((t) => (t.slug === updatedTrack.slug ? updatedTrack : t))
                );
                toast.success(`Reset ${activeTrack.name} to default 10-chapter curriculum`);
            }
        } catch (err) {
            toast.error(err?.response?.data?.error || 'Failed to reset track');
        }
    };

    const handleUploadChapterImage = async (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;
        try {
            const uploaded = [];
            for (const file of files) {
                const dataUrl = await compressImageToDataUrl(file);
                uploaded.push({ url: dataUrl, caption: file.name.replace(/\.[^.]+$/, '') });
            }
            setChapterForm((prev) => ({
                ...prev,
                images: [...prev.images, ...uploaded]
            }));
            toast.success(`Added ${uploaded.length} diagram/image(s) to chapter`);
        } catch {
            toast.error('Failed to process image file');
        } finally {
            e.target.value = '';
        }
    };

    const totalChaptersCount = useMemo(
        () => tracks.reduce((acc, t) => acc + (t.chapters?.length || 0), 0),
        [tracks]
    );

    const totalModulesCount = totalChaptersCount * 10;

    return (
        <div className="space-y-6">
            {/* ═══════════════════════════════════════════════════════════════════════
                LEVEL 1: LANGUAGE CATALOG PAGE (8 LANGUAGES WITH "GET STARTED")
               ═══════════════════════════════════════════════════════════════════════ */}
            {!activeLanguageSlug && (
                <div className="space-y-6">
                    {/* Top Unified Banner */}
                    <div className="bg-gradient-to-r from-[#5899B5] to-[#3D7690] rounded-3xl text-white p-6 sm:p-8 shadow-md relative overflow-hidden">
                        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div className="space-y-2.5 max-w-3xl">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="bg-white/15 border border-white/25 rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-wider inline-flex items-center gap-1.5">
                                        <Code2 size={13} />
                                        ByteBase • Engineering Curriculum
                                    </span>
                                    <span className="bg-white/15 border border-white/25 rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-wider">
                                        {tracks.length} Languages • {totalChaptersCount} Chapters • {totalModulesCount} Deep-Dive Modules
                                    </span>
                                    {canCustomize && (
                                        <span className="bg-white text-[#3D7690] rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider inline-flex items-center gap-1">
                                            <ShieldCheck size={12} />
                                            Admin Customization Enabled
                                        </span>
                                    )}
                                </div>
                                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                                    ByteBase — Language-Wise Engineering &amp; Syntax Hub
                                </h1>
                                <p className="text-blue-50/90 text-xs sm:text-sm leading-relaxed">
                                    Select any programming language below and click <span className="font-medium">Get Started</span> to explore its 10 structured chapters—each containing 10 deep-dive topic modules with architecture diagrams, benchmark graphs, syntax tables, code traces, and practice problem statements.
                                </p>
                            </div>

                            {canCustomize && (
                                <button
                                    type="button"
                                    onClick={() => openEditTrackModal(true)}
                                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-[#3D7690] hover:bg-blue-50 text-xs font-semibold transition cursor-pointer shadow-sm shrink-0"
                                >
                                    <Plus size={14} />
                                    Add New Language Track
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-[#5899B5]/10 text-[#3D7690] flex items-center justify-center shrink-0">
                                <Layers size={18} />
                            </div>
                            <div>
                                <h2 className="text-sm sm:text-base font-semibold text-slate-900">
                                    Select a Language Track ({filteredCatalogTracks.length})
                                </h2>
                                <p className="text-xs text-slate-500">
                                    Each language contains 10 chapters × 10 sub-topic modules (100 modules per language).
                                </p>
                            </div>
                        </div>

                        <div className="relative w-full sm:w-80">
                            <Search
                                size={15}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                type="text"
                                value={catalogSearch}
                                onChange={(e) => setCatalogSearch(e.target.value)}
                                placeholder="Search language or chapter topic..."
                                className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 outline-none focus:bg-white focus:border-[#5899B5] transition"
                            />
                        </div>
                    </div>

                    {/* Unified Single-Color Grid of 8 Language Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                        {filteredCatalogTracks.map((track) => {
                            const totalCh = track.chapters?.length || 10;
                            const doneCh = (track.chapters || []).filter(
                                (c) =>
                                    completedMap[`${track.slug}:${c.chapterNumber}`] ||
                                    getChapterDoneTopicsCount(track.slug, c.chapterNumber) === 10
                            ).length;
                            const progressPct = totalCh
                                ? Math.round((doneCh / totalCh) * 100)
                                : 0;
                            const previewChapters = (track.chapters || []).slice(0, 3);

                            return (
                                <div
                                    key={track.slug}
                                    onClick={() => handleOpenLanguageTrack(track.slug)}
                                    className="group bg-white border border-slate-200 hover:border-[#5899B5] rounded-2xl p-5 sm:p-6 shadow-2xs hover:shadow-sm transition-colors duration-200 flex flex-col justify-between gap-5 cursor-pointer"
                                >
                                    <div className="space-y-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <LanguageEmblemSvg
                                                    slug={track.slug}
                                                    badge={track.badge}
                                                    logoUrl={track.logoUrl}
                                                    size="md"
                                                />
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="text-base sm:text-lg font-semibold text-slate-900 group-hover:text-[#3D7690] transition-colors">
                                                            {track.name}
                                                        </h3>
                                                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                                            {track.fileExtension}
                                                        </span>
                                                    </div>
                                                    <p className="text-[11px] font-semibold text-[#5899B5] line-clamp-1">
                                                        {totalCh} Chapters • {totalCh * 10} Topic Modules
                                                    </p>
                                                </div>
                                            </div>

                                            {canCustomize && (
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openEditTrackModal(false, track);
                                                    }}
                                                    title={`Edit ${track.name} Track`}
                                                    className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-[#3D7690] hover:bg-slate-50 transition cursor-pointer"
                                                >
                                                    <Edit3 size={13} />
                                                </button>
                                            )}
                                        </div>

                                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                                            {track.tagline || track.description}
                                        </p>

                                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-1.5">
                                            <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-200/70">
                                                <span>Chapters Inside</span>
                                                <span className="text-[#3D7690]">10 × 10 Modules</span>
                                            </div>
                                            {previewChapters.map((ch) => (
                                                <div
                                                    key={ch.chapterNumber}
                                                    className="flex items-center gap-2 text-[11px] text-slate-700 font-medium truncate"
                                                >
                                                    <span className="w-4 h-4 rounded bg-[#5899B5]/15 text-[#3D7690] font-medium text-[10px] flex items-center justify-center shrink-0">
                                                        {ch.chapterNumber}
                                                    </span>
                                                    <span className="truncate">{ch.title}</span>
                                                </div>
                                            ))}
                                            {totalCh > 3 && (
                                                <p className="text-[10px] font-semibold text-slate-400 pl-6">
                                                    + {totalCh - 3} more chapters
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-2 border-t border-slate-100">
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between text-[11px] font-semibold">
                                                <span className="text-slate-500">
                                                    {doneCh} of {totalCh} Chapters
                                                </span>
                                                <span className="text-[#3D7690] font-medium">
                                                    {progressPct}%
                                                </span>
                                            </div>
                                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-[#5899B5] rounded-full transition-all duration-300"
                                                    style={{ width: `${progressPct}%` }}
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleOpenLanguageTrack(track.slug);
                                            }}
                                            className="w-full py-2.5 px-4 rounded-xl bg-[#5899B5] hover:bg-[#3D7690] text-white text-xs font-semibold flex items-center justify-center gap-2 transition shadow-2xs cursor-pointer"
                                        >
                                            <span>{doneCh > 0 ? 'Continue Track' : 'Get Started'}</span>
                                            <ArrowRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════════════
                LEVEL 2: 10 CHAPTER CARDS PAGE FOR SELECTED LANGUAGE
               ═══════════════════════════════════════════════════════════════════════ */}
            {activeLanguageSlug && activeTrack && activeChapterNum === null && (
                <div className="space-y-6">
                    {/* Top Language Header & Breadcrumb Bar */}
                    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                            <button
                                type="button"
                                onClick={() => setActiveLanguageSlug(null)}
                                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-semibold transition cursor-pointer"
                            >
                                <ArrowLeft size={15} />
                                Back to All Languages
                            </button>

                            <div className="flex flex-wrap items-center gap-2">
                                <div className="relative w-56 sm:w-64">
                                    <Search
                                        size={14}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                    />
                                    <input
                                        type="text"
                                        value={chapterSearch}
                                        onChange={(e) => setChapterSearch(e.target.value)}
                                        placeholder={`Search ${activeTrack.name} chapters...`}
                                        className="w-full h-9 pl-8 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 outline-none focus:bg-white focus:border-[#5899B5]"
                                    />
                                </div>

                                {canCustomize && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => openEditTrackModal(false, activeTrack)}
                                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition cursor-pointer"
                                        >
                                            <Edit3 size={14} />
                                            Edit Track
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => openEditChapterModal(null)}
                                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#5899B5] hover:bg-[#3D7690] text-white text-xs font-medium transition cursor-pointer"
                                        >
                                            <Plus size={14} />
                                            Add Chapter
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleResetTrackDefaults}
                                            title="Reset to default 10 chapters"
                                            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 cursor-pointer"
                                        >
                                            <RotateCcw size={15} />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="rounded-2xl p-4 sm:p-5 bg-[#5899B5]/[0.07] border border-[#5899B5]/25 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-start sm:items-center gap-3.5">
                                <LanguageEmblemSvg
                                    slug={activeTrack.slug}
                                    badge={activeTrack.badge}
                                    logoUrl={activeTrack.logoUrl}
                                    size="lg"
                                />
                                <div className="space-y-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h1 className="text-lg sm:text-xl font-semibold text-slate-900">
                                            {activeTrack.fullName || activeTrack.name} — 10 Chapters
                                        </h1>
                                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-medium uppercase bg-[#5899B5]/15 text-[#3D7690]">
                                            {chapters.length} Chapters × 10 Sub-Topic Divs Each
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                                        Click on any chapter card below to open its <span className="font-medium">10 dedicated topic modules</span> (Architecture, Memory Model, Syntax Grammar, Execution Trace, Big-O Complexity, Pitfalls, Production Systems, Optimizations, Interview Patterns, and Master Lab).
                                    </p>
                                </div>
                            </div>

                            <div className="text-left md:text-right shrink-0">
                                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 block">
                                    Track Completion
                                </span>
                                <span className="text-sm font-semibold text-slate-900">
                                    {trackCompletedCount} / {chapters.length} Chapters
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 10 Chapter Option Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {filteredChapters.map((ch) => {
                            const doneTopics = getChapterDoneTopicsCount(
                                activeTrack.slug,
                                ch.chapterNumber
                            );
                            const chTopics = getChapterSubTopics(activeTrack, ch);

                            return (
                                <div
                                    key={ch.chapterNumber}
                                    onClick={() => handleOpenChapter(ch.chapterNumber)}
                                    className="group bg-white border border-slate-200 hover:border-[#5899B5] rounded-2xl p-5 sm:p-6 shadow-2xs hover:shadow-sm transition-colors duration-200 flex flex-col justify-between gap-5 cursor-pointer"
                                >
                                    <div className="space-y-3.5">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="px-3 py-1 rounded-lg bg-[#5899B5] text-white text-xs font-semibold">
                                                Chapter {ch.chapterNumber}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#5899B5]/10 text-[#3D7690]">
                                                    10 Topic Modules
                                                </span>
                                                {canCustomize && (
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openEditChapterModal(ch);
                                                        }}
                                                        className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-[#3D7690] hover:bg-slate-50 cursor-pointer"
                                                        title="Customize Chapter"
                                                    >
                                                        <Edit3 size={13} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <h3 className="text-base sm:text-lg font-semibold text-slate-900 group-hover:text-[#3D7690] transition-colors leading-snug">
                                            {ch.title}
                                        </h3>

                                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                                            {ch.summary || ch.overview}
                                        </p>

                                        {/* Preview of the 10 Sub-Topic Divs inside this Chapter */}
                                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-1.5">
                                            <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-200/70">
                                                <span>10 Sub-Topics Inside</span>
                                                <span className="text-[#3D7690]">{ch.difficulty || 'Core'}</span>
                                            </div>
                                            {chTopics.slice(0, 4).map((tp) => (
                                                <div
                                                    key={tp.topicNumber}
                                                    className="flex items-center gap-2 text-[11px] text-slate-700 font-medium truncate"
                                                >
                                                    <span className="w-4 h-4 rounded bg-[#5899B5]/15 text-[#3D7690] font-medium text-[9px] flex items-center justify-center shrink-0">
                                                        {tp.topicNumber}
                                                    </span>
                                                    <span className="truncate">{tp.title}</span>
                                                </div>
                                            ))}
                                            <p className="text-[10px] font-semibold text-slate-400 pl-6">
                                                + 6 more deep-dive modules inside
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-2 border-t border-slate-100">
                                        <div className="flex items-center justify-between text-[11px] font-semibold">
                                            <span className="text-slate-500">
                                                {doneTopics} / 10 Modules Read
                                            </span>
                                            <span className="text-[#3D7690] font-medium">
                                                {doneTopics * 10}%
                                            </span>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-[#5899B5] rounded-full transition-all"
                                                style={{ width: `${doneTopics * 10}%` }}
                                            />
                                        </div>

                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleOpenChapter(ch.chapterNumber);
                                            }}
                                            className="w-full py-2.5 px-4 rounded-xl bg-[#5899B5] hover:bg-[#3D7690] text-white text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
                                        >
                                            <span>Explore 10 Modules</span>
                                            <ArrowRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════════════
                LEVEL 3: 10 SUB-TOPIC DIV CARDS INSIDE THE SELECTED CHAPTER
               ═══════════════════════════════════════════════════════════════════════ */}
            {activeLanguageSlug &&
                activeTrack &&
                activeChapterNum !== null &&
                activeChapter &&
                activeTopicNum === null && (
                    <div className="space-y-6">
                        {/* Top Chapter Header & Breadcrumb Navigation */}
                        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-4">
                            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                                <div className="flex flex-wrap items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setActiveChapterNum(null)}
                                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-semibold transition cursor-pointer"
                                    >
                                        <ArrowLeft size={15} />
                                        Back to {activeTrack.name} Chapters
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setActiveLanguageSlug(null);
                                            setActiveChapterNum(null);
                                        }}
                                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium transition cursor-pointer"
                                    >
                                        All Languages
                                    </button>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                    <select
                                        value={activeChapter.chapterNumber}
                                        onChange={(e) => handleOpenChapter(Number(e.target.value))}
                                        className="h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-none focus:border-[#5899B5] cursor-pointer"
                                    >
                                        {chapters.map((c) => (
                                            <option key={c.chapterNumber} value={c.chapterNumber}>
                                                Jump to Chapter {c.chapterNumber}: {c.title}
                                            </option>
                                        ))}
                                    </select>

                                    {canCustomize && (
                                        <button
                                            type="button"
                                            onClick={() => openEditChapterModal(activeChapter)}
                                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#5899B5] hover:bg-[#3D7690] text-white text-xs font-medium transition cursor-pointer"
                                        >
                                            <Edit3 size={13} />
                                            Customize Chapter
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Selected Chapter Banner */}
                            <div className="rounded-2xl p-5 bg-[#5899B5]/[0.07] border border-[#5899B5]/25 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="space-y-1.5 max-w-3xl">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="px-3 py-1 rounded-lg bg-[#5899B5] text-white text-xs font-semibold">
                                            {activeTrack.name} • Chapter {activeChapter.chapterNumber}
                                        </span>
                                        <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-medium text-[#3D7690]">
                                            10 Deep-Dive Sub-Topics Inside
                                        </span>
                                    </div>
                                    <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">
                                        {activeChapter.title}
                                    </h1>
                                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                        {activeChapter.summary ||
                                            'Select any of the 10 sub-topic modules below to open its comprehensive reading material, SVG diagrams, benchmark graphs, syntax tables, code examples, and problem statements.'}
                                    </p>
                                </div>

                                <div className="text-left md:text-right shrink-0">
                                    <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 block">
                                        Chapter Progress
                                    </span>
                                    <span className="text-base font-semibold text-slate-900">
                                        {getChapterDoneTopicsCount(
                                            activeTrack.slug,
                                            activeChapter.chapterNumber
                                        )}{' '}
                                        / 10 Sub-Topics Completed
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 10 Sub-Topic Div Cards Grid (Clean Minimal Hover Effect) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
                            {filteredSubTopics.map((topic) => {
                                const isTopicDone = Boolean(
                                    completedMap[
                                        `${activeTrack.slug}:ch${activeChapter.chapterNumber}:t${topic.topicNumber}`
                                    ]
                                );

                                return (
                                    <div
                                        key={topic.topicNumber}
                                        onClick={() => handleOpenSubTopic(topic.topicNumber)}
                                        className="group bg-white border border-slate-200 hover:border-[#5899B5] rounded-2xl p-5 shadow-2xs hover:shadow-sm transition-colors duration-200 flex flex-col justify-between gap-4 cursor-pointer"
                                    >
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="px-2.5 py-1 rounded-lg bg-[#5899B5]/12 text-[#3D7690] text-[11px] font-semibold">
                                                    {topic.badge || `Module 0${topic.topicNumber}`}
                                                </span>
                                                {isTopicDone ? (
                                                    <span className="w-6 h-6 rounded-full bg-[#5899B5] text-white flex items-center justify-center">
                                                        <Check size={13} />
                                                    </span>
                                                ) : (
                                                    <span className="text-[11px] font-semibold text-slate-400">
                                                        {topic.duration}
                                                    </span>
                                                )}
                                            </div>

                                            <h3 className="text-sm sm:text-[15px] font-semibold text-slate-900 group-hover:text-[#3D7690] transition-colors leading-snug">
                                                {topic.title}
                                            </h3>

                                            <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                                                {topic.summary}
                                            </p>
                                        </div>

                                        <div className="pt-3 border-t border-slate-100 space-y-2.5">
                                            <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-semibold text-slate-500">
                                                <span className="px-2 py-0.5 rounded bg-slate-100">
                                                    SVG Diagram
                                                </span>
                                                <span className="px-2 py-0.5 rounded bg-slate-100">
                                                    Graph
                                                </span>
                                                <span className="px-2 py-0.5 rounded bg-slate-100">
                                                    Syntax &amp; Code
                                                </span>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleOpenSubTopic(topic.topicNumber);
                                                }}
                                                className="w-full py-2 px-3 rounded-xl bg-[#5899B5] hover:bg-[#3D7690] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                                            >
                                                <span>
                                                    {isTopicDone ? 'Review Module' : 'Get Started'}
                                                </span>
                                                <ArrowRight size={13} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

            {/* ═══════════════════════════════════════════════════════════════════════
                LEVEL 4: DEDICATED SUB-TOPIC READER WORKSPACE (10X ENHANCED CONTENT)
               ═══════════════════════════════════════════════════════════════════════ */}
            {activeLanguageSlug &&
                activeTrack &&
                activeChapterNum !== null &&
                activeChapter &&
                activeTopicNum !== null &&
                activeSubTopic && (
                    <div className="space-y-6">
                        {/* Top Breadcrumb Bar */}
                        <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-2xs flex flex-wrap items-center justify-between gap-3">
                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setActiveTopicNum(null)}
                                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-semibold transition cursor-pointer"
                                >
                                    <ArrowLeft size={15} />
                                    Back to Chapter {activeChapter.chapterNumber} Modules (10)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setActiveTopicNum(null);
                                        setActiveChapterNum(null);
                                    }}
                                    className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium transition cursor-pointer"
                                >
                                    {activeTrack.name} Chapters
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setActiveTopicNum(null);
                                        setActiveChapterNum(null);
                                        setActiveLanguageSlug(null);
                                    }}
                                    className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium transition cursor-pointer"
                                >
                                    All Languages
                                </button>
                            </div>

                            <div className="flex items-center gap-2">
                                {canCustomize && (
                                    <button
                                        type="button"
                                        onClick={() => openEditChapterModal(activeChapter)}
                                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#5899B5] hover:bg-[#3D7690] text-white text-xs font-medium transition cursor-pointer"
                                    >
                                        <Edit3 size={13} />
                                        Customize Content
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* 2-Column Workspace: Left 10 Sub-Topics Rail + Right Deep-Dive Reader */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                            {/* Left Rail: All 10 Sub-Topics of this Chapter */}
                            <aside className="lg:col-span-4 xl:col-span-3 bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs lg:sticky lg:top-6 space-y-3">
                                <div className="px-1 border-b border-slate-100 pb-2.5">
                                    <span className="text-[10px] font-medium uppercase tracking-wider text-[#5899B5] block">
                                        {activeTrack.name} • Chapter {activeChapter.chapterNumber}
                                    </span>
                                    <h3 className="text-xs font-semibold text-slate-900 truncate">
                                        {activeChapter.title}
                                    </h3>
                                </div>

                                <div className="space-y-1.5 max-h-[70vh] overflow-y-auto pr-1">
                                    {subTopics.map((tp) => {
                                        const isCurrent =
                                            Number(tp.topicNumber) ===
                                            Number(activeSubTopic.topicNumber);
                                        const isDone = Boolean(
                                            completedMap[
                                                `${activeTrack.slug}:ch${activeChapter.chapterNumber}:t${tp.topicNumber}`
                                            ]
                                        );

                                        return (
                                            <button
                                                key={tp.topicNumber}
                                                type="button"
                                                onClick={() => handleOpenSubTopic(tp.topicNumber)}
                                                className={`w-full text-left p-2.5 rounded-xl border transition-colors cursor-pointer flex items-start gap-2.5 ${
                                                    isCurrent
                                                        ? 'bg-[#5899B5] text-white border-[#5899B5]'
                                                        : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200/80'
                                                }`}
                                            >
                                                <span
                                                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-semibold shrink-0 mt-0.5 ${
                                                        isCurrent
                                                            ? 'bg-white text-[#3D7690]'
                                                            : isDone
                                                            ? 'bg-[#5899B5]/15 text-[#3D7690]'
                                                            : 'bg-slate-100 text-slate-600'
                                                    }`}
                                                >
                                                    {isDone ? <Check size={12} /> : tp.topicNumber}
                                                </span>
                                                <div className="min-w-0 flex-1">
                                                    <span
                                                        className={`text-[10px] font-medium uppercase tracking-wider block ${
                                                            isCurrent
                                                                ? 'text-blue-100'
                                                                : 'text-slate-400'
                                                        }`}
                                                    >
                                                        {tp.badge}
                                                    </span>
                                                    <p
                                                        className={`text-xs font-medium leading-snug line-clamp-2 ${
                                                            isCurrent
                                                                ? 'text-white'
                                                                : 'text-slate-800'
                                                        }`}
                                                    >
                                                        {tp.title}
                                                    </p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </aside>

                            {/* Right Main Reader: Enhanced Sub-Topic Content */}
                            <div className="lg:col-span-8 xl:col-span-9 space-y-6">
                                <article className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-8">
                                    {/* Header */}
                                    <header className="border-b border-slate-100 pb-6 space-y-4">
                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="px-3 py-1 rounded-full text-xs font-semibold text-white bg-[#5899B5]">
                                                    Chapter {activeChapter.chapterNumber} • Module{' '}
                                                    {activeSubTopic.topicNumber} of 10
                                                </span>
                                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#5899B5]/10 text-[#3D7690] border border-[#5899B5]/25">
                                                    {activeSubTopic.badge}
                                                </span>
                                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                                                    <Clock size={12} />
                                                    {activeSubTopic.duration || '14 min read'}
                                                </span>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    toggleTopicCompleted(
                                                        activeTrack.slug,
                                                        activeChapter.chapterNumber,
                                                        activeSubTopic.topicNumber
                                                    )
                                                }
                                                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium border transition cursor-pointer ${
                                                    completedMap[
                                                        `${activeTrack.slug}:ch${activeChapter.chapterNumber}:t${activeSubTopic.topicNumber}`
                                                    ]
                                                        ? 'bg-[#5899B5]/15 text-[#3D7690] border-[#5899B5]/30'
                                                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                                                }`}
                                            >
                                                <CheckCircle2 size={14} />
                                                {completedMap[
                                                    `${activeTrack.slug}:ch${activeChapter.chapterNumber}:t${activeSubTopic.topicNumber}`
                                                ]
                                                    ? 'Module Completed ✓'
                                                    : 'Mark Module Complete'}
                                            </button>
                                        </div>

                                        <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight leading-snug">
                                            {activeSubTopic.title}
                                        </h2>

                                        {activeSubTopic.summary && (
                                            <p className="text-sm sm:text-base font-medium text-slate-600 leading-relaxed">
                                                {activeSubTopic.summary}
                                            </p>
                                        )}
                                    </header>

                                    {/* 1. Deep-Dive Reading Content & Engineering Takeaways */}
                                    <section className="space-y-5">
                                        <div className="flex items-center gap-2">
                                            <BookOpen size={18} className="text-[#5899B5]" />
                                            <h3 className="text-lg font-semibold text-slate-900">
                                                1. Comprehensive Theory &amp; Systems Deep-Dive
                                            </h3>
                                        </div>

                                        <div className="space-y-4 text-slate-700 text-sm sm:text-[15.5px] leading-[1.85]">
                                            {String(activeSubTopic.content || '')
                                                .split('\n\n')
                                                .map((para, idx) => (
                                                    <p key={idx} className="whitespace-pre-line">
                                                        {para}
                                                    </p>
                                                ))}
                                        </div>

                                        {Array.isArray(activeSubTopic.keyTakeaways) &&
                                            activeSubTopic.keyTakeaways.length > 0 && (
                                                <div className="rounded-2xl p-5 border bg-[#5899B5]/[0.06] border-[#5899B5]/25 space-y-3">
                                                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                                                        <Lightbulb
                                                            size={15}
                                                            className="text-[#3D7690]"
                                                        />
                                                        Key Engineering Rules &amp; Takeaways
                                                    </h4>
                                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                                        {activeSubTopic.keyTakeaways.map(
                                                            (pt, idx) => (
                                                                <li
                                                                    key={idx}
                                                                    className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-slate-200/80 text-xs sm:text-[13px] font-medium text-slate-700 leading-relaxed"
                                                                >
                                                                    <CheckCircle2
                                                                        size={15}
                                                                        className="shrink-0 mt-0.5 text-[#5899B5]"
                                                                    />
                                                                    <span>{pt}</span>
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                </div>
                                            )}
                                    </section>

                                    {/* 2. Visual SVG Architecture Blueprint, Flowchart & Telemetry Graphs */}
                                    <section className="space-y-5">
                                        <div className="flex items-center gap-2">
                                            <BarChart3 size={18} className="text-[#5899B5]" />
                                            <h3 className="text-lg font-semibold text-slate-900">
                                                2. Visual Architecture Blueprint, Execution Flow &amp; Telemetry Graphs
                                            </h3>
                                        </div>

                                        <SubTopicArchitectureIllustration
                                            type={activeSubTopic.illustrationType}
                                            languageName={activeTrack.name}
                                            chapterTitle={activeChapter.title}
                                            topicTitle={activeSubTopic.title}
                                            steps={activeSubTopic.diagramSteps}
                                        />

                                        <ChapterFlowDiagramSvg
                                            title={activeSubTopic.diagramTitle}
                                            steps={activeSubTopic.diagramSteps}
                                            languageName={activeTrack.name}
                                        />

                                        <ChapterBenchmarkGraph
                                            title={activeSubTopic.graphTitle}
                                            metricLabel={activeSubTopic.graphMetricLabel}
                                            graphData={activeSubTopic.graphData}
                                        />

                                        {/* Custom Uploaded Chapter Images */}
                                        {Array.isArray(activeChapter.images) &&
                                            activeChapter.images.length > 0 && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                                    {activeChapter.images.map((img, idx) => (
                                                        <figure
                                                            key={idx}
                                                            className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-2xs"
                                                        >
                                                            <img
                                                                src={img.url}
                                                                alt={
                                                                    img.caption ||
                                                                    `Chapter diagram ${idx + 1}`
                                                                }
                                                                className="w-full max-h-80 object-contain bg-white p-2"
                                                                loading="lazy"
                                                            />
                                                            {img.caption && (
                                                                <figcaption className="px-4 py-2.5 text-xs font-semibold text-slate-600 border-t border-slate-200/80">
                                                                    Figure {idx + 1}: {img.caption}
                                                                </figcaption>
                                                            )}
                                                        </figure>
                                                    ))}
                                                </div>
                                            )}
                                    </section>

                                    {/* 3. Syntax Specification Table & Reference Block */}
                                    <section className="space-y-5">
                                        <div className="flex items-center gap-2">
                                            <FileCode size={18} className="text-[#5899B5]" />
                                            <h3 className="text-lg font-semibold text-slate-900">
                                                3. Syntax Specification &amp; Reference Cheat-Sheet
                                            </h3>
                                        </div>

                                        {Array.isArray(activeSubTopic.syntaxTable) &&
                                            activeSubTopic.syntaxTable.length > 0 && (
                                                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                                                    <table className="w-full text-left border-collapse">
                                                        <thead>
                                                            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                                                <th className="py-3 px-4">Construct</th>
                                                                <th className="py-3 px-4">
                                                                    Exact Syntax Pattern
                                                                </th>
                                                                <th className="py-3 px-4">
                                                                    Engineering Notes &amp; Behavior
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-slate-100 text-xs sm:text-[13px]">
                                                            {activeSubTopic.syntaxTable.map(
                                                                (row, idx) => (
                                                                    <tr
                                                                        key={idx}
                                                                        className="hover:bg-slate-50/70"
                                                                    >
                                                                        <td className="py-3 px-4 font-medium text-slate-900 whitespace-nowrap">
                                                                            {row.construct}
                                                                        </td>
                                                                        <td className="py-3 px-4">
                                                                            <code className="px-2 py-1 rounded-md bg-slate-900 text-sky-200 font-mono text-xs">
                                                                                {row.syntax}
                                                                            </code>
                                                                        </td>
                                                                        <td className="py-3 px-4 text-slate-600">
                                                                            {row.description}
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}

                                        {activeSubTopic.syntaxCode && (
                                            <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-100">
                                                <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
                                                    <span className="text-xs font-medium text-slate-300 font-mono flex items-center gap-2">
                                                        <Terminal
                                                            size={13}
                                                            className="text-[#5899B5]"
                                                        />
                                                        module_{activeSubTopic.topicNumber}_syntax
                                                        {activeTrack.fileExtension || '.txt'}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleCopyCode(
                                                                activeSubTopic.syntaxCode,
                                                                'syntax-main'
                                                            )
                                                        }
                                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold transition cursor-pointer"
                                                    >
                                                        {copiedCodeKey === 'syntax-main' ? (
                                                            <>
                                                                <Check
                                                                    size={12}
                                                                    className="text-sky-400"
                                                                />{' '}
                                                                Copied
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Copy size={12} /> Copy Syntax
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                                <pre className="p-4 sm:p-5 text-xs sm:text-[13px] font-mono leading-relaxed overflow-x-auto text-sky-100">
                                                    <code>{activeSubTopic.syntaxCode}</code>
                                                </pre>
                                            </div>
                                        )}
                                    </section>

                                    {/* 4. Annotated Code Examples & Console Output Trace */}
                                    {Array.isArray(activeSubTopic.examples) &&
                                        activeSubTopic.examples.length > 0 && (
                                            <section className="space-y-5">
                                                <div className="flex items-center gap-2">
                                                    <Terminal size={18} className="text-[#5899B5]" />
                                                    <h3 className="text-lg font-semibold text-slate-900">
                                                        4. Annotated Code Examples &amp; Execution Output Trace
                                                    </h3>
                                                </div>

                                                <div className="space-y-5">
                                                    {activeSubTopic.examples.map((ex, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50/50"
                                                        >
                                                            <div className="px-5 py-3.5 bg-white border-b border-slate-200 flex items-center justify-between gap-2">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold text-white bg-[#5899B5]">
                                                                        Example #{idx + 1}
                                                                    </span>
                                                                    <h4 className="text-sm font-medium text-slate-900">
                                                                        {ex.title}
                                                                    </h4>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleCopyCode(
                                                                            ex.code,
                                                                            `ex-${idx}`
                                                                        )
                                                                    }
                                                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 text-[11px] font-semibold transition cursor-pointer"
                                                                >
                                                                    {copiedCodeKey ===
                                                                    `ex-${idx}` ? (
                                                                        <>
                                                                            <Check
                                                                                size={12}
                                                                                className="text-[#3D7690]"
                                                                            />{' '}
                                                                            Copied
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <Copy size={12} /> Copy
                                                                            Code
                                                                        </>
                                                                    )}
                                                                </button>
                                                            </div>

                                                            <pre className="p-4 sm:p-5 bg-slate-950 text-sky-100 text-xs sm:text-[13px] font-mono leading-relaxed overflow-x-auto">
                                                                <code>{ex.code}</code>
                                                            </pre>

                                                            {ex.output && (
                                                                <div className="px-5 py-3.5 bg-slate-900 border-t border-slate-800 text-xs font-mono">
                                                                    <span className="text-[10px] font-medium uppercase tracking-wider text-sky-400 block mb-1">
                                                                        Standard Output (stdout)
                                                                    </span>
                                                                    <pre className="text-slate-200 whitespace-pre-wrap">
                                                                        {ex.output}
                                                                    </pre>
                                                                </div>
                                                            )}

                                                            {ex.explanation && (
                                                                <div className="px-5 py-3.5 bg-white border-t border-slate-200 text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                                                                    <span className="text-slate-900">
                                                                        Execution Trace:{' '}
                                                                    </span>
                                                                    {ex.explanation}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </section>
                                        )}

                                    {/* 5. Related Problem Statements & Practice Challenges */}
                                    {Array.isArray(activeSubTopic.problems) &&
                                        activeSubTopic.problems.length > 0 && (
                                            <section className="space-y-5">
                                                <div className="flex items-center justify-between gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <Award
                                                            size={18}
                                                            className="text-[#5899B5]"
                                                        />
                                                        <h3 className="text-lg font-semibold text-slate-900">
                                                            5. Related Problem Statements &amp; Practice Challenges
                                                        </h3>
                                                    </div>
                                                    <span className="text-xs font-medium text-slate-500">
                                                        {activeSubTopic.problems.length} Curated Problems
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-1 gap-4">
                                                    {activeSubTopic.problems.map((prob, idx) => {
                                                        const hintKey = `${activeTrack.slug}-${activeChapter.chapterNumber}-${activeSubTopic.topicNumber}-p${idx}`;
                                                        const isHintOpen = Boolean(
                                                            revealedHints[hintKey]
                                                        );

                                                        return (
                                                            <div
                                                                key={idx}
                                                                className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xs space-y-4"
                                                            >
                                                                <div className="flex flex-wrap items-center justify-between gap-2">
                                                                    <div className="flex items-center gap-2.5">
                                                                        <span className="px-2.5 py-1 rounded-lg bg-[#5899B5] text-white text-xs font-semibold">
                                                                            Problem #{idx + 1}
                                                                        </span>
                                                                        <h4 className="text-base font-semibold text-slate-900">
                                                                            {prob.title}
                                                                        </h4>
                                                                    </div>
                                                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#5899B5]/10 text-[#3D7690] border border-[#5899B5]/25">
                                                                        {prob.difficulty || 'Easy'}
                                                                    </span>
                                                                </div>

                                                                <p className="text-sm text-slate-700 leading-relaxed">
                                                                    {prob.statement}
                                                                </p>

                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                    {prob.sampleInput && (
                                                                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                                                                            <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 block mb-1">
                                                                                Sample Input
                                                                            </span>
                                                                            <code className="text-xs font-mono text-slate-800 break-words">
                                                                                {prob.sampleInput}
                                                                            </code>
                                                                        </div>
                                                                    )}
                                                                    {prob.sampleOutput && (
                                                                        <div className="bg-[#5899B5]/[0.06] border border-[#5899B5]/25 rounded-xl p-3">
                                                                            <span className="text-[10px] font-medium uppercase tracking-wider text-[#3D7690] block mb-1">
                                                                                Expected Output
                                                                            </span>
                                                                            <code className="text-xs font-mono font-medium text-slate-900 break-words">
                                                                                {prob.sampleOutput}
                                                                            </code>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                                                                    {prob.constraints ? (
                                                                        <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                                                                            Constraints:{' '}
                                                                            {prob.constraints}
                                                                        </span>
                                                                    ) : (
                                                                        <span />
                                                                    )}

                                                                    {prob.hint && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                setRevealedHints(
                                                                                    (prev) => ({
                                                                                        ...prev,
                                                                                        [hintKey]:
                                                                                            !prev[
                                                                                                hintKey
                                                                                            ]
                                                                                    })
                                                                                )
                                                                            }
                                                                            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#3D7690] hover:underline cursor-pointer"
                                                                        >
                                                                            <Lightbulb size={14} />
                                                                            {isHintOpen
                                                                                ? 'Hide Solution Approach'
                                                                                : 'Show Algorithmic Hint & Approach'}
                                                                        </button>
                                                                    )}
                                                                </div>

                                                                {isHintOpen && prob.hint && (
                                                                    <div className="p-3.5 rounded-xl bg-[#5899B5]/[0.08] border border-[#5899B5]/25 text-xs text-slate-800 leading-relaxed">
                                                                        <span className="text-[#3D7690]">
                                                                            Approach &amp; Hint:{' '}
                                                                        </span>
                                                                        {prob.hint}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </section>
                                        )}

                                    {/* Footer Navigation Between the 10 Sub-Topics */}
                                    <footer className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                                        <button
                                            type="button"
                                            disabled={activeSubTopic.topicNumber <= 1}
                                            onClick={() =>
                                                handleOpenSubTopic(
                                                    Math.max(1, activeSubTopic.topicNumber - 1)
                                                )
                                            }
                                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium disabled:opacity-40 transition cursor-pointer"
                                        >
                                            <ChevronLeft size={16} />
                                            Previous Module
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                toggleTopicCompleted(
                                                    activeTrack.slug,
                                                    activeChapter.chapterNumber,
                                                    activeSubTopic.topicNumber
                                                )
                                            }
                                            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                                                completedMap[
                                                    `${activeTrack.slug}:ch${activeChapter.chapterNumber}:t${activeSubTopic.topicNumber}`
                                                ]
                                                    ? 'bg-[#3D7690] text-white'
                                                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                                            }`}
                                        >
                                            <CheckCircle2 size={15} />
                                            {completedMap[
                                                `${activeTrack.slug}:ch${activeChapter.chapterNumber}:t${activeSubTopic.topicNumber}`
                                            ]
                                                ? 'Module Completed ✓'
                                                : 'Mark Module as Complete'}
                                        </button>

                                        {activeSubTopic.topicNumber < subTopics.length ? (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleOpenSubTopic(
                                                        activeSubTopic.topicNumber + 1
                                                    )
                                                }
                                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5899B5] hover:bg-[#3D7690] text-white text-xs font-medium transition cursor-pointer"
                                            >
                                                Next Module ({activeSubTopic.topicNumber + 1}/10)
                                                <ChevronRight size={16} />
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => setActiveTopicNum(null)}
                                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5899B5] hover:bg-[#3D7690] text-white text-xs font-medium transition cursor-pointer"
                                            >
                                                All 10 Modules Overview
                                                <ChevronRight size={16} />
                                            </button>
                                        )}
                                    </footer>
                                </article>
                            </div>
                        </div>
                    </div>
                )}

            {/* ═══════════ MODAL 1: ADMIN / OPS ADMIN CHAPTER CUSTOMIZER ═══════════ */}
            {chapterModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
                    <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
                        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                            <div>
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#5899B5] block">
                                    {activeTrack?.name} Curriculum Customizer
                                </span>
                                <h3 className="text-lg font-semibold text-slate-900">
                                    Customize Chapter #{chapterForm.chapterNumber}
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setChapterModalOpen(false)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form
                            onSubmit={handleSaveChapter}
                            className="p-6 overflow-y-auto space-y-6 flex-1 text-left"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                                <div className="sm:col-span-2">
                                    <label className="block text-[11px] font-medium uppercase text-slate-500 mb-1">
                                        Chapter #
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="50"
                                        required
                                        value={chapterForm.chapterNumber}
                                        onChange={(e) =>
                                            setChapterForm({
                                                ...chapterForm,
                                                chapterNumber: Number(e.target.value) || 1
                                            })
                                        }
                                        className="w-full h-10 px-3 border border-slate-200 rounded-xl text-sm font-medium"
                                    />
                                </div>
                                <div className="sm:col-span-6">
                                    <label className="block text-[11px] font-medium uppercase text-slate-500 mb-1">
                                        Chapter Title *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={chapterForm.title}
                                        onChange={(e) =>
                                            setChapterForm({ ...chapterForm, title: e.target.value })
                                        }
                                        className="w-full h-10 px-3.5 border border-slate-200 rounded-xl text-sm font-semibold"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-[11px] font-medium uppercase text-slate-500 mb-1">
                                        Read Time
                                    </label>
                                    <input
                                        type="text"
                                        value={chapterForm.duration}
                                        onChange={(e) =>
                                            setChapterForm({
                                                ...chapterForm,
                                                duration: e.target.value
                                            })
                                        }
                                        className="w-full h-10 px-3 border border-slate-200 rounded-xl text-sm"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-[11px] font-medium uppercase text-slate-500 mb-1">
                                        Difficulty
                                    </label>
                                    <select
                                        value={chapterForm.difficulty}
                                        onChange={(e) =>
                                            setChapterForm({
                                                ...chapterForm,
                                                difficulty: e.target.value
                                            })
                                        }
                                        className="w-full h-10 px-3 border border-slate-200 rounded-xl text-sm font-semibold bg-white"
                                    >
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[11px] font-medium uppercase text-slate-500 mb-1">
                                        Short Chapter Summary
                                    </label>
                                    <input
                                        type="text"
                                        value={chapterForm.summary}
                                        onChange={(e) =>
                                            setChapterForm({
                                                ...chapterForm,
                                                summary: e.target.value
                                            })
                                        }
                                        className="w-full h-10 px-3.5 border border-slate-200 rounded-xl text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-medium uppercase text-slate-500 mb-1">
                                        Chapter Reading Content / Concept Deep-Dive *
                                    </label>
                                    <textarea
                                        rows={5}
                                        required
                                        value={chapterForm.overview}
                                        onChange={(e) =>
                                            setChapterForm({
                                                ...chapterForm,
                                                overview: e.target.value
                                            })
                                        }
                                        className="w-full p-3.5 border border-slate-200 rounded-xl text-sm leading-relaxed"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-medium uppercase text-slate-500 mb-1">
                                        Key Takeaways (One bullet point per line)
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={chapterForm.keyPointsText}
                                        onChange={(e) =>
                                            setChapterForm({
                                                ...chapterForm,
                                                keyPointsText: e.target.value
                                            })
                                        }
                                        className="w-full p-3 border border-slate-200 rounded-xl text-xs leading-relaxed"
                                    />
                                </div>
                            </div>

                            {/* Visual Flowchart & Graph Editor */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-medium uppercase text-slate-600">
                                        Architecture Flowchart Title &amp; Steps (1 per line)
                                    </label>
                                    <input
                                        type="text"
                                        value={chapterForm.diagramTitle}
                                        onChange={(e) =>
                                            setChapterForm({
                                                ...chapterForm,
                                                diagramTitle: e.target.value
                                            })
                                        }
                                        placeholder="Flowchart Title"
                                        className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                                    />
                                    <textarea
                                        rows={4}
                                        value={chapterForm.diagramStepsText}
                                        onChange={(e) =>
                                            setChapterForm({
                                                ...chapterForm,
                                                diagramStepsText: e.target.value
                                            })
                                        }
                                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-[11px] font-medium uppercase text-slate-600">
                                            Benchmark Graph Bars
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setChapterForm({
                                                    ...chapterForm,
                                                    graphData: [
                                                        ...chapterForm.graphData,
                                                        {
                                                            label: 'Metric',
                                                            value: 50,
                                                            displayValue: 'O(N)',
                                                            note: ''
                                                        }
                                                    ]
                                                })
                                            }
                                            className="text-[11px] font-medium text-[#3D7690] hover:underline cursor-pointer"
                                        >
                                            + Add Graph Bar
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        value={chapterForm.graphTitle}
                                        onChange={(e) =>
                                            setChapterForm({
                                                ...chapterForm,
                                                graphTitle: e.target.value
                                            })
                                        }
                                        placeholder="Graph Title"
                                        className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                                    />
                                    <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                                        {chapterForm.graphData.map((g, gIdx) => (
                                            <div key={gIdx} className="flex items-center gap-1.5">
                                                <input
                                                    type="text"
                                                    placeholder="Label"
                                                    value={g.label}
                                                    onChange={(e) => {
                                                        const next = [...chapterForm.graphData];
                                                        next[gIdx] = { ...g, label: e.target.value };
                                                        setChapterForm({
                                                            ...chapterForm,
                                                            graphData: next
                                                        });
                                                    }}
                                                    className="flex-1 h-8 px-2 bg-white border border-slate-200 rounded-lg text-xs"
                                                />
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="100"
                                                    value={g.value}
                                                    onChange={(e) => {
                                                        const next = [...chapterForm.graphData];
                                                        next[gIdx] = {
                                                            ...g,
                                                            value: Number(e.target.value) || 10
                                                        };
                                                        setChapterForm({
                                                            ...chapterForm,
                                                            graphData: next
                                                        });
                                                    }}
                                                    className="w-14 h-8 px-2 bg-white border border-slate-200 rounded-lg text-xs"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Display"
                                                    value={g.displayValue}
                                                    onChange={(e) => {
                                                        const next = [...chapterForm.graphData];
                                                        next[gIdx] = {
                                                            ...g,
                                                            displayValue: e.target.value
                                                        };
                                                        setChapterForm({
                                                            ...chapterForm,
                                                            graphData: next
                                                        });
                                                    }}
                                                    className="w-24 h-8 px-2 bg-white border border-slate-200 rounded-lg text-xs"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setChapterForm({
                                                            ...chapterForm,
                                                            graphData: chapterForm.graphData.filter(
                                                                (_, i) => i !== gIdx
                                                            )
                                                        })
                                                    }
                                                    className="text-rose-500 p-1 cursor-pointer"
                                                >
                                                    <X size={13} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Custom Chapter Images & Diagrams Uploader */}
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div>
                                        <span className="text-xs font-semibold text-slate-800 block">
                                            Chapter Images &amp; Visual Diagrams ({chapterForm.images.length})
                                        </span>
                                        <span className="text-[11px] text-slate-500">
                                            Upload diagram images or paste an image URL to display across this chapter.
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            ref={imageInputRef}
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleUploadChapterImage}
                                            className="hidden"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => imageInputRef.current?.click()}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-medium text-slate-700 cursor-pointer"
                                        >
                                            <Upload size={13} /> Upload Image
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setChapterForm({
                                                    ...chapterForm,
                                                    images: [
                                                        ...chapterForm.images,
                                                        { url: '', caption: '' }
                                                    ]
                                                })
                                            }
                                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-medium text-[#3D7690] cursor-pointer"
                                        >
                                            <Plus size={13} /> Add Image URL
                                        </button>
                                    </div>
                                </div>

                                {chapterForm.images.length > 0 && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {chapterForm.images.map((img, idx) => (
                                            <div
                                                key={idx}
                                                className="bg-white p-3 rounded-xl border border-slate-200 flex items-start gap-3"
                                            >
                                                {img.url && (
                                                    <img
                                                        src={img.url}
                                                        alt="preview"
                                                        className="w-16 h-16 rounded-lg object-cover border border-slate-100 shrink-0"
                                                    />
                                                )}
                                                <div className="flex-1 space-y-1.5 min-w-0">
                                                    <input
                                                        type="text"
                                                        placeholder="Image URL or Data URI"
                                                        value={img.url}
                                                        onChange={(e) => {
                                                            const next = [...chapterForm.images];
                                                            next[idx] = {
                                                                ...img,
                                                                url: e.target.value
                                                            };
                                                            setChapterForm({
                                                                ...chapterForm,
                                                                images: next
                                                            });
                                                        }}
                                                        className="w-full h-8 px-2.5 border border-slate-200 rounded-lg text-xs"
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Figure Caption"
                                                        value={img.caption}
                                                        onChange={(e) => {
                                                            const next = [...chapterForm.images];
                                                            next[idx] = {
                                                                ...img,
                                                                caption: e.target.value
                                                            };
                                                            setChapterForm({
                                                                ...chapterForm,
                                                                images: next
                                                            });
                                                        }}
                                                        className="w-full h-8 px-2.5 border border-slate-200 rounded-lg text-xs"
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setChapterForm({
                                                            ...chapterForm,
                                                            images: chapterForm.images.filter(
                                                                (_, i) => i !== idx
                                                            )
                                                        })
                                                    }
                                                    className="text-rose-500 p-1 cursor-pointer"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Syntax Summary Code */}
                            <div className="space-y-3">
                                <label className="block text-[11px] font-medium uppercase text-slate-500">
                                    Main Syntax Cheat-Sheet Code Block
                                </label>
                                <textarea
                                    rows={5}
                                    value={chapterForm.syntaxSummaryCode}
                                    onChange={(e) =>
                                        setChapterForm({
                                            ...chapterForm,
                                            syntaxSummaryCode: e.target.value
                                        })
                                    }
                                    className="w-full p-3.5 bg-slate-950 text-sky-200 font-mono text-xs rounded-xl"
                                />
                            </div>

                            <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setChapterModalOpen(false)}
                                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-medium cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-6 py-2.5 rounded-xl bg-[#5899B5] hover:bg-[#3D7690] text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
                                >
                                    {saving ? 'Saving...' : 'Save Chapter Customization'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ═══════════ MODAL 2: ADMIN / OPS ADMIN TRACK METADATA EDITOR ═══════════ */}
            {trackModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
                    <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
                        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                            <h3 className="text-base font-semibold text-slate-900">
                                {isNewTrackMode
                                    ? 'Create New Language Track'
                                    : `Edit ${trackForm.name || 'Language'} Track Metadata`}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setTrackModalOpen(false)}
                                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveTrack} className="p-6 space-y-4 text-left">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[11px] font-medium uppercase text-slate-500 mb-1">
                                        Language Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={trackForm.name}
                                        onChange={(e) =>
                                            setTrackForm({ ...trackForm, name: e.target.value })
                                        }
                                        placeholder="e.g. Python"
                                        className="w-full h-10 px-3 border border-slate-200 rounded-xl text-sm font-semibold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-medium uppercase text-slate-500 mb-1">
                                        File Extension
                                    </label>
                                    <input
                                        type="text"
                                        value={trackForm.fileExtension}
                                        onChange={(e) =>
                                            setTrackForm({
                                                ...trackForm,
                                                fileExtension: e.target.value
                                            })
                                        }
                                        placeholder=".py"
                                        className="w-full h-10 px-3 border border-slate-200 rounded-xl text-sm font-mono"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-medium uppercase text-slate-500 mb-1">
                                    Full Track Title
                                </label>
                                <input
                                    type="text"
                                    value={trackForm.fullName}
                                    onChange={(e) =>
                                        setTrackForm({ ...trackForm, fullName: e.target.value })
                                    }
                                    className="w-full h-10 px-3 border border-slate-200 rounded-xl text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-medium uppercase text-slate-500 mb-1">
                                    Paradigm Badge
                                </label>
                                <input
                                    type="text"
                                    value={trackForm.paradigm}
                                    onChange={(e) =>
                                        setTrackForm({ ...trackForm, paradigm: e.target.value })
                                    }
                                    className="w-full h-10 px-3 border border-slate-200 rounded-xl text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-medium uppercase text-slate-500 mb-1">
                                    Track Overview Description
                                </label>
                                <textarea
                                    rows={3}
                                    value={trackForm.description}
                                    onChange={(e) =>
                                        setTrackForm({ ...trackForm, description: e.target.value })
                                    }
                                    className="w-full p-3 border border-slate-200 rounded-xl text-sm"
                                />
                            </div>

                            <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setTrackModalOpen(false)}
                                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-5 py-2 rounded-xl bg-[#5899B5] hover:bg-[#3D7690] text-white text-xs font-semibold cursor-pointer"
                                >
                                    {saving ? 'Saving...' : 'Save Track'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LanguageDescriptionHub;
