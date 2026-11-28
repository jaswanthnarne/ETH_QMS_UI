import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
    Building2,
    Cpu,
    Code2,
    ArrowRight
} from 'lucide-react';
import { ALL_COMPANY_QUESTIONS } from '../../data/companyQuestions';
import { ALL_ALGOPLAY_TOPICS } from '../../data/algoPlayCatalogData';
import { ALL_LANGUAGE_TRACKS } from '../../data/languageCurriculumData';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/* ─────────────────── SVG Semi-Circle Gauge Graph ─────────────────── */
const SemiCircleGaugeGraph = ({
    completed = 0,
    total = 1,
    label = 'Done',
    gradientId = 'semi-grad-1'
}) => {
    const safeTotal = Math.max(1, total);
    const pct = Math.min(100, Math.round((completed / safeTotal) * 100));

    // Semi-circle geometry (180-degree top arc)
    const width = 200;
    const height = 115;
    const strokeWidth = 14;
    const cx = width / 2;
    const cy = 98;
    const radius = 76;
    const arcLength = Math.PI * radius; // Half circumference = π * r
    const dashOffset = arcLength - (pct / 100) * arcLength;

    // Arc path from left (cx - r, cy) to right (cx + r, cy)
    const arcPath = `M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`;

    return (
        <div className="relative flex flex-col items-center justify-center select-none group/gauge">
            <svg
                width={width}
                height={height}
                viewBox={`0 0 ${width} ${height}`}
                className="overflow-visible transition-transform duration-300 group-hover/gauge:scale-105"
            >
                <defs>
                    <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#5899B5" />
                        <stop offset="100%" stopColor="#3D7690" />
                    </linearGradient>
                </defs>

                {/* Background Semi-Circle Track */}
                <path
                    d={arcPath}
                    fill="none"
                    stroke="#E2E8F0"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                />

                {/* Animated Foreground Semi-Circle Arc */}
                <path
                    d={arcPath}
                    fill="none"
                    stroke={`url(#${gradientId})`}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={arcLength}
                    strokeDashoffset={dashOffset}
                    className="transition-all duration-700 ease-out"
                />

                {/* Scale ticks at 0% and 100% */}
                <text
                    x={cx - radius}
                    y={cy + 15}
                    textAnchor="middle"
                    className="text-[10px] font-mono fill-slate-400"
                >
                    0
                </text>
                <text
                    x={cx + radius}
                    y={cy + 15}
                    textAnchor="middle"
                    className="text-[10px] font-mono fill-slate-400"
                >
                    {total}
                </text>
            </svg>

            {/* Center Readout Inside the Semi-Circle Arch */}
            <div className="absolute bottom-3 flex flex-col items-center text-center pointer-events-none">
                <span className="text-xl font-semibold font-mono text-[#3D7690] leading-none transition-transform duration-300 group-hover/gauge:scale-105">
                    {completed}
                    <span className="text-xs font-normal text-slate-400"> / {total}</span>
                </span>
                <span className="text-xs font-medium text-[#5899B5] mt-1">
                    {pct}% {label}
                </span>
            </div>
        </div>
    );
};

/* ─────────────────── 3 Individual Semi-Circle Progress Graphs ─────────────────── */
const StudentLearningMasteryGraphs = ({ student, token, onNavigateTab }) => {
    const [allQuestions, setAllQuestions] = useState(() => ALL_COMPANY_QUESTIONS || []);
    const [algoProgressMap, setAlgoProgressMap] = useState({});
    const [algoTotalCount, setAlgoTotalCount] = useState(ALL_ALGOPLAY_TOPICS.length);
    const [bytebaseTracks, setBytebaseTracks] = useState(() => ALL_LANGUAGE_TRACKS || []);
    const [bytebaseCompletedMap, setBytebaseCompletedMap] = useState({});
    const [solvedIds, setSolvedIds] = useState([]);

    // 1. Load Code2Career (Questions Solved out of Total)
    useEffect(() => {
        const solvedKey = `eth_company_arena_solved_${student?.usn || 'guest'}`;
        try {
            const raw = localStorage.getItem(solvedKey);
            setSolvedIds(raw ? JSON.parse(raw) : []);
        } catch {
            setSolvedIds([]);
        }

        let mounted = true;
        axios
            .get(`${API_BASE}/coding-arena/catalog`)
            .then((res) => {
                if (!mounted || !res.data?.success) return;
                const qs = res.data?.data?.questions;
                if (Array.isArray(qs) && qs.length > 0) {
                    setAllQuestions(qs);
                }
            })
            .catch(() => {});
        return () => {
            mounted = false;
        };
    }, [student?.usn]);

    // 2. Load AlgoPlay (Algorithms Visited out of Total 66)
    useEffect(() => {
        try {
            const saved = localStorage.getItem('algoplay_progress_v1');
            if (saved) setAlgoProgressMap(JSON.parse(saved));
        } catch {
            /* ignore */
        }

        let mounted = true;
        axios
            .get(`${API_BASE}/algoplay/topics`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            })
            .then((res) => {
                if (!mounted || !res.data?.success) return;
                if (res.data.progressMap) {
                    setAlgoProgressMap((prev) => ({ ...prev, ...res.data.progressMap }));
                }
                if (Array.isArray(res.data.topics) && res.data.topics.length > 0) {
                    const enabledTopics = res.data.topics.filter(
                        (t) => t.isPublished !== false && t.isEnabled !== false
                    );
                    if (enabledTopics.length > 0) {
                        setAlgoTotalCount(Math.max(ALL_ALGOPLAY_TOPICS.length, enabledTopics.length));
                    }
                }
            })
            .catch(() => {});
        return () => {
            mounted = false;
        };
    }, [token]);

    // 3. Load ByteBase (Chapters Completed out of Total 80 Chapters / 800 Sub-topics)
    useEffect(() => {
        const actorId = student?._id || student?.usn || 'guest';
        const progressKey = `eth_bytebase_progress_${actorId}`;
        try {
            const raw = localStorage.getItem(progressKey);
            setBytebaseCompletedMap(raw ? JSON.parse(raw) : {});
        } catch {
            setBytebaseCompletedMap({});
        }

        if (!token) return;
        let mounted = true;
        axios
            .get(`${API_BASE}/language-description`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then((res) => {
                if (!mounted || !res.data?.success) return;
                if (Array.isArray(res.data.data) && res.data.data.length > 0) {
                    setBytebaseTracks(res.data.data);
                }
            })
            .catch(() => {});
        return () => {
            mounted = false;
        };
    }, [student?._id, student?.usn, token]);

    /* ─────────────── Computed Metrics for Graph 1: Questions Solved ─────────────── */
    const questionsMetrics = useMemo(() => {
        const solvedSet = new Set(Array.isArray(solvedIds) ? solvedIds : []);
        const total = allQuestions.length || 1;
        let solved = 0;

        const diffStats = {
            Easy: { solved: 0, total: 0 },
            Medium: { solved: 0, total: 0 },
            Hard: { solved: 0, total: 0 }
        };

        allQuestions.forEach((q) => {
            const d = q.difficulty === 'Hard' ? 'Hard' : q.difficulty === 'Medium' ? 'Medium' : 'Easy';
            diffStats[d].total++;
            if (solvedSet.has(q.id)) {
                solved++;
                diffStats[d].solved++;
            }
        });

        const finalSolved = Math.min(total, Math.max(solved, solvedSet.size));

        return {
            solved: finalSolved,
            total,
            remaining: Math.max(0, total - finalSolved),
            bars: [
                { label: 'Easy Problems', done: diffStats.Easy.solved, total: diffStats.Easy.total || 1 },
                { label: 'Medium Problems', done: diffStats.Medium.solved, total: diffStats.Medium.total || 1 },
                { label: 'Hard Problems', done: diffStats.Hard.solved, total: diffStats.Hard.total || 1 }
            ]
        };
    }, [allQuestions, solvedIds]);

    /* ─────────────── Computed Metrics for Graph 2: Algorithms Visited ─────────────── */
    const algoMetrics = useMemo(() => {
        const total = algoTotalCount || ALL_ALGOPLAY_TOPICS.length || 66;
        let visited = 0;
        let completed = 0;
        let inProgress = 0;

        const groupBuckets = {
            ds: { label: 'Data Structures', done: 0, total: 0 },
            searchSort: { label: 'Searching & Sorting', done: 0, total: 0 },
            graphDp: { label: 'Trees, Graphs & DP', done: 0, total: 0 }
        };

        ALL_ALGOPLAY_TOPICS.forEach((topic) => {
            const st = algoProgressMap[topic.slug]?.status;
            const isVisited = st === 'completed' || st === 'in-progress';
            if (st === 'completed') completed++;
            else if (st === 'in-progress') inProgress++;
            if (isVisited) visited++;

            if (['linear', 'nonlinear', 'advanced', 'linear-ds', 'non-linear-ds', 'advanced-ds'].includes(topic.category)) {
                groupBuckets.ds.total++;
                if (isVisited) groupBuckets.ds.done++;
            } else if (['searching', 'sorting'].includes(topic.category)) {
                groupBuckets.searchSort.total++;
                if (isVisited) groupBuckets.searchSort.done++;
            } else {
                groupBuckets.graphDp.total++;
                if (isVisited) groupBuckets.graphDp.done++;
            }
        });

        return {
            visited,
            completed,
            inProgress,
            total,
            remaining: Math.max(0, total - visited),
            bars: [groupBuckets.ds, groupBuckets.searchSort, groupBuckets.graphDp]
        };
    }, [algoProgressMap, algoTotalCount]);

    /* ─────────────── Computed Metrics for Graph 3: Chapters Completed ─────────────── */
    const chapterMetrics = useMemo(() => {
        let totalChapters = 0;
        let completedChapters = 0;
        let completedSubTopics = 0;

        const trackBreakdown = (bytebaseTracks || []).map((track) => {
            const chList = Array.isArray(track.chapters) ? track.chapters : [];
            const trackTotal = chList.length || 10;
            let trackDone = 0;

            chList.forEach((ch) => {
                totalChapters++;
                let subDone = 0;
                for (let t = 1; t <= 10; t++) {
                    if (bytebaseCompletedMap[`${track.slug}:ch${ch.chapterNumber}:t${t}`]) {
                        subDone++;
                        completedSubTopics++;
                    }
                }
                const isChDone =
                    Boolean(bytebaseCompletedMap[`${track.slug}:${ch.chapterNumber}`]) ||
                    subDone === 10;
                if (isChDone) {
                    completedChapters++;
                    trackDone++;
                    if (subDone === 0) completedSubTopics += 10;
                }
            });

            return {
                slug: track.slug,
                name: track.name,
                done: trackDone,
                total: trackTotal
            };
        });

        const safeTotalChapters = totalChapters || 80;

        return {
            completed: completedChapters,
            total: safeTotalChapters,
            remaining: Math.max(0, safeTotalChapters - completedChapters),
            completedSubTopics,
            totalSubTopics: safeTotalChapters * 10,
            trackBreakdown
        };
    }, [bytebaseTracks, bytebaseCompletedMap]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ====================================================================
                INDIVIDUAL SEMI-CIRCLE GRAPH 1: QUESTIONS SOLVED (Code2Career)
               ==================================================================== */}
            <div
                onClick={() => onNavigateTab && onNavigateTab('company-arena')}
                className="group bg-white border border-slate-200/80 shadow-2xs rounded-3xl p-6 flex flex-col justify-between space-y-4 hover:-translate-y-1 hover:shadow-lg hover:border-[#5899B5]/60 transition-all duration-300 cursor-pointer"
            >
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#5899B5]/10 text-[#5899B5] border border-[#5899B5]/20">
                            <Building2 className="w-3 h-3" /> Code2Career
                        </span>
                        <h3 className="text-lg font-normal text-[#5899B5] group-hover:text-[#3D7690] transition-colors mt-1.5">
                            Questions Solved
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Solved out of {questionsMetrics.total} total coding questions
                        </p>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 group-hover:bg-[#5899B5] text-slate-500 group-hover:text-white border border-slate-200/80 group-hover:border-[#5899B5] transition-all duration-300 shrink-0">
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </div>
                </div>

                {/* Semi-Circle Gauge Graph */}
                <div className="bg-slate-50/60 group-hover:bg-[#5899B5]/[0.04] rounded-2xl border border-slate-100 group-hover:border-[#5899B5]/20 pt-3 pb-2 px-4 flex flex-col items-center transition-colors duration-300">
                    <SemiCircleGaugeGraph
                        completed={questionsMetrics.solved}
                        total={questionsMetrics.total}
                        label="Solved"
                        gradientId="semi-code2career"
                    />
                    <div className="w-full grid grid-cols-3 gap-2 pt-2 mt-1 border-t border-slate-200/60 text-center text-xs">
                        <div className="py-1 rounded-lg hover:bg-white transition-colors">
                            <span className="block text-[10px] text-slate-400">Solved</span>
                            <span className="font-mono font-semibold text-[#5899B5]">
                                {questionsMetrics.solved}
                            </span>
                        </div>
                        <div className="py-1 rounded-lg hover:bg-white transition-colors">
                            <span className="block text-[10px] text-slate-400">Remaining</span>
                            <span className="font-mono font-medium text-slate-700">
                                {questionsMetrics.remaining}
                            </span>
                        </div>
                        <div className="py-1 rounded-lg hover:bg-white transition-colors">
                            <span className="block text-[10px] text-slate-400">Total</span>
                            <span className="font-mono font-semibold text-slate-800">
                                {questionsMetrics.total}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Difficulty Breakdown Bars */}
                <div className="space-y-2">
                    {questionsMetrics.bars.map((b) => {
                        const pct = Math.min(100, Math.round((b.done / Math.max(1, b.total)) * 100));
                        return (
                            <div
                                key={b.label}
                                className="space-y-1 p-1.5 rounded-xl hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-normal text-slate-600">{b.label}</span>
                                    <span className="font-mono text-[#5899B5]">
                                        {b.done} / {b.total}
                                    </span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        style={{ width: `${pct}%` }}
                                        className="h-full bg-[#5899B5] rounded-full transition-all duration-500"
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ====================================================================
                INDIVIDUAL SEMI-CIRCLE GRAPH 2: ALGORITHMS VISITED (AlgoPlay)
               ==================================================================== */}
            <div
                onClick={() => onNavigateTab && onNavigateTab('algoplay')}
                className="group bg-white border border-slate-200/80 shadow-2xs rounded-3xl p-6 flex flex-col justify-between space-y-4 hover:-translate-y-1 hover:shadow-lg hover:border-[#5899B5]/60 transition-all duration-300 cursor-pointer"
            >
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#5899B5]/10 text-[#5899B5] border border-[#5899B5]/20">
                            <Cpu className="w-3 h-3" /> AlgoPlay
                        </span>
                        <h3 className="text-lg font-normal text-[#5899B5] group-hover:text-[#3D7690] transition-colors mt-1.5">
                            Algorithms Visited
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Visited out of {algoMetrics.total} interactive DSA visualizers
                        </p>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 group-hover:bg-[#5899B5] text-slate-500 group-hover:text-white border border-slate-200/80 group-hover:border-[#5899B5] transition-all duration-300 shrink-0">
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </div>
                </div>

                {/* Semi-Circle Gauge Graph */}
                <div className="bg-slate-50/60 group-hover:bg-[#5899B5]/[0.04] rounded-2xl border border-slate-100 group-hover:border-[#5899B5]/20 pt-3 pb-2 px-4 flex flex-col items-center transition-colors duration-300">
                    <SemiCircleGaugeGraph
                        completed={algoMetrics.visited}
                        total={algoMetrics.total}
                        label="Visited"
                        gradientId="semi-algoplay"
                    />
                    <div className="w-full grid grid-cols-3 gap-2 pt-2 mt-1 border-t border-slate-200/60 text-center text-xs">
                        <div className="py-1 rounded-lg hover:bg-white transition-colors">
                            <span className="block text-[10px] text-slate-400">Visited</span>
                            <span className="font-mono font-semibold text-[#5899B5]">
                                {algoMetrics.visited}
                            </span>
                        </div>
                        <div className="py-1 rounded-lg hover:bg-white transition-colors">
                            <span className="block text-[10px] text-slate-400">Completed</span>
                            <span className="font-mono font-medium text-emerald-600">
                                {algoMetrics.completed}
                            </span>
                        </div>
                        <div className="py-1 rounded-lg hover:bg-white transition-colors">
                            <span className="block text-[10px] text-slate-400">Total</span>
                            <span className="font-mono font-semibold text-slate-800">
                                {algoMetrics.total}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Category Coverage Bars */}
                <div className="space-y-2">
                    {algoMetrics.bars.map((b) => {
                        const pct = Math.min(100, Math.round((b.done / Math.max(1, b.total)) * 100));
                        return (
                            <div
                                key={b.label}
                                className="space-y-1 p-1.5 rounded-xl hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-normal text-slate-600 truncate pr-2">
                                        {b.label}
                                    </span>
                                    <span className="font-mono text-[#5899B5] shrink-0">
                                        {b.done} / {b.total}
                                    </span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        style={{ width: `${pct}%` }}
                                        className="h-full bg-[#5899B5] rounded-full transition-all duration-500"
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ====================================================================
                INDIVIDUAL SEMI-CIRCLE GRAPH 3: CHAPTERS COMPLETED (ByteBase)
               ==================================================================== */}
            <div
                onClick={() => onNavigateTab && onNavigateTab('bytebase')}
                className="group bg-white border border-slate-200/80 shadow-2xs rounded-3xl p-6 flex flex-col justify-between space-y-4 hover:-translate-y-1 hover:shadow-lg hover:border-[#5899B5]/60 transition-all duration-300 cursor-pointer"
            >
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#5899B5]/10 text-[#5899B5] border border-[#5899B5]/20">
                            <Code2 className="w-3 h-3" /> ByteBase
                        </span>
                        <h3 className="text-lg font-normal text-[#5899B5] group-hover:text-[#3D7690] transition-colors mt-1.5">
                            Chapters Completed
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Completed out of {chapterMetrics.total} chapters across 8 languages
                        </p>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 group-hover:bg-[#5899B5] text-slate-500 group-hover:text-white border border-slate-200/80 group-hover:border-[#5899B5] transition-all duration-300 shrink-0">
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </div>
                </div>

                {/* Semi-Circle Gauge Graph */}
                <div className="bg-slate-50/60 group-hover:bg-[#5899B5]/[0.04] rounded-2xl border border-slate-100 group-hover:border-[#5899B5]/20 pt-3 pb-2 px-4 flex flex-col items-center transition-colors duration-300">
                    <SemiCircleGaugeGraph
                        completed={chapterMetrics.completed}
                        total={chapterMetrics.total}
                        label="Completed"
                        gradientId="semi-bytebase"
                    />
                    <div className="w-full grid grid-cols-3 gap-2 pt-2 mt-1 border-t border-slate-200/60 text-center text-xs">
                        <div className="py-1 rounded-lg hover:bg-white transition-colors">
                            <span className="block text-[10px] text-slate-400">Chapters</span>
                            <span className="font-mono font-semibold text-[#5899B5]">
                                {chapterMetrics.completed}/{chapterMetrics.total}
                            </span>
                        </div>
                        <div className="py-1 rounded-lg hover:bg-white transition-colors">
                            <span className="block text-[10px] text-slate-400">Sub-Topics</span>
                            <span className="font-mono font-medium text-slate-700">
                                {chapterMetrics.completedSubTopics}/{chapterMetrics.totalSubTopics}
                            </span>
                        </div>
                        <div className="py-1 rounded-lg hover:bg-white transition-colors">
                            <span className="block text-[10px] text-slate-400">Remaining</span>
                            <span className="font-mono font-semibold text-slate-800">
                                {chapterMetrics.remaining}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Per-Language Mini Bars */}
                <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                    {chapterMetrics.trackBreakdown.slice(0, 6).map((tr) => {
                        const pct = Math.min(
                            100,
                            Math.round((tr.done / Math.max(1, tr.total)) * 100)
                        );
                        return (
                            <div
                                key={tr.slug}
                                className="space-y-1 p-1 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex items-center justify-between text-[11px]">
                                    <span className="font-normal text-slate-600 truncate">
                                        {tr.name}
                                    </span>
                                    <span className="font-mono text-[#5899B5]">
                                        {tr.done}/{tr.total}
                                    </span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        style={{ width: `${pct}%` }}
                                        className="h-full bg-[#5899B5] rounded-full transition-all duration-500"
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default StudentLearningMasteryGraphs;
