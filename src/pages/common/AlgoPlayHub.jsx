import React, { useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import {
    Play,
    Pause,
    SkipBack,
    SkipForward,
    RotateCcw,
    Search,
    CheckCircle2,
    ChevronRight,
    ChevronLeft,
    Code2,
    Terminal,
    Cpu,
    Layers,
    Edit3,
    Plus,
    Trash2,
    Award,
    Clock,
    ShieldCheck,
    ArrowRight,
    ArrowLeft,
    BarChart3,
    GitBranch,
    Lightbulb,
    Copy,
    Check,
    X,
    Sliders,
    Eye,
    EyeOff,
    Shuffle,
    AlertTriangle,
    HelpCircle,
    Sparkles,
    LayoutGrid,
    List,
    Columns,
    History,
    Zap
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useStudentAuthStore from '../../store/studentAuthStore';
import { useToastStore } from '../../store/toastStore';
import {
    ALL_ALGOPLAY_TOPICS,
    ALGOPLAY_CATEGORIES,
    BIG_O_REFERENCE_TABLE,
    SORTING_COMPARISON_TABLE
} from '../../data/algoPlayCatalogData';
import {
    generateSearchingFrames,
    generateSortingFrames,
    generateLinearDsFrames,
    buildTreeVisualLayout,
    generateTreeAndAdvancedFrames,
    DEFAULT_GRAPH_STATE,
    computeGraphRepresentations,
    generateGraphFrames,
    generateAlgorithmFrames
} from '../../data/algoPlayStepEngine';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/* ============================================================================
   ALGORITHM COMPLEXITY COLOR & NAME BADGE HELPER + DEDICATED SVG ICON SYSTEM
   ============================================================================ */
const getComplexityMeta = (notation = '') => {
    const raw = String(notation || 'O(n)').trim();
    const s = raw.toLowerCase();
    if (s.includes('1)') || s.includes('α')) {
        return {
            notation: raw,
            name: 'Constant Time',
            badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            dotClass: 'bg-emerald-500'
        };
    }
    if ((s.includes('log') && !s.includes('n log') && !s.includes('v + e')) || s.includes('h)')) {
        return {
            notation: raw,
            name: 'Logarithmic',
            badgeClass: 'bg-teal-50 text-teal-700 border-teal-200',
            dotClass: 'bg-teal-500'
        };
    }
    if (s.includes('√n') || s.includes('sqrt')) {
        return {
            notation: raw,
            name: 'Root-N Jump',
            badgeClass: 'bg-cyan-50 text-cyan-700 border-cyan-200',
            dotClass: 'bg-cyan-500'
        };
    }
    if (s.includes('n log') || s.includes('e log') || s.includes('v log')) {
        return {
            notation: raw,
            name: 'Linearithmic',
            badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
            dotClass: 'bg-amber-500'
        };
    }
    if (s.includes('n²') || s.includes('v²') || s.includes('n^2') || s.includes('v·e') || s.includes('n·w')) {
        return {
            notation: raw,
            name: 'Quadratic / DP',
            badgeClass: 'bg-orange-50 text-orange-700 border-orange-200',
            dotClass: 'bg-orange-500'
        };
    }
    if (s.includes('v³') || s.includes('2^') || s.includes('2ⁿ') || s.includes('n!') || s.includes('4^') || s.includes('b^d')) {
        return {
            notation: raw,
            name: s.includes('!') ? 'Factorial' : s.includes('³') ? 'Cubic Time' : 'Exponential',
            badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
            dotClass: 'bg-rose-500'
        };
    }
    return {
        notation: raw,
        name: 'Linear Time',
        badgeClass: 'bg-[#5899B5]/12 text-[#3D7690] border-[#5899B5]/30',
        dotClass: 'bg-[#5899B5]'
    };
};

const getDirectAlgorithmTypeLabel = (topic) => {
    const map = {
        linear: 'Linear Data Structure',
        'linear-ds': 'Linear Data Structure',
        nonlinear: 'Non-Linear Structure',
        'non-linear-ds': 'Non-Linear Structure',
        advanced: 'Advanced Index Tree',
        'advanced-ds': 'Advanced Index Tree',
        searching: 'Search Algorithm',
        sorting: 'Sorting Algorithm',
        trees: 'Tree Algorithm',
        'tree-algo': 'Tree Algorithm',
        graphs: 'Graph Algorithm',
        'graph-algo': 'Graph Algorithm',
        algorithms:
            topic.engineType === 'recursion'
                ? 'Recursion Algorithm'
                : topic.engineType === 'backtracking'
                  ? 'Backtracking Search'
                  : topic.subVariant === 'greedy'
                    ? 'Greedy Algorithm'
                    : 'Dynamic Programming',
        'paradigm-algo':
            topic.engineType === 'recursion'
                ? 'Recursion Algorithm'
                : topic.engineType === 'backtracking'
                  ? 'Backtracking Search'
                  : topic.subVariant === 'greedy'
                    ? 'Greedy Algorithm'
                    : 'Dynamic Programming'
    };
    return map[topic.category] || topic.categoryLabel || 'DSA Visualizer';
};

const AlgoTopicIcon = ({ topic, size = 'md' }) => {
    const dim =
        size === 'lg'
            ? 'w-12 h-12 rounded-2xl'
            : size === 'sm'
              ? 'w-9 h-9 rounded-xl'
              : 'w-11 h-11 rounded-xl';
    const svgDim = size === 'lg' ? 'w-6 h-6' : size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
    const eng = topic?.engineType || 'array';
    const sub = topic?.subVariant || '';

    return (
        <div
            className={`${dim} bg-[#5899B5]/10 border border-[#5899B5]/25 text-[#3D7690] flex items-center justify-center shrink-0 shadow-2xs group-hover:bg-[#5899B5] group-hover:text-white group-hover:border-[#3D7690] transition-colors`}
            title={topic?.title}
        >
            {eng === 'array' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={svgDim}>
                    <rect x="2" y="7" width="20" height="10" rx="2" />
                    <line x1="8.5" y1="7" x2="8.5" y2="17" />
                    <line x1="15.5" y1="7" x2="15.5" y2="17" />
                </svg>
            ) : eng === 'linked-list' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={svgDim}>
                    <circle cx="5" cy="12" r="3" />
                    <circle cx="19" cy="12" r="3" />
                    <path d="M8 12h8m-2-2.5L16.5 12 14 14.5" />
                    {(sub.includes('circular') || sub.includes('doubly')) && (
                        <path d="M16 15.5c-3 2.5-5 2.5-8 0" strokeDasharray="2 2" />
                    )}
                </svg>
            ) : eng === 'stack' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={svgDim}>
                    <path d="M5 6v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6" />
                    <rect x="7.5" y="14.5" width="9" height="3" rx="0.8" />
                    <rect x="7.5" y="10" width="9" height="3" rx="0.8" />
                    <rect x="7.5" y="5.5" width="9" height="3" rx="0.8" />
                </svg>
            ) : eng === 'queue' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={svgDim}>
                    {sub === 'circular' ? (
                        <>
                            <circle cx="12" cy="12" r="8" strokeDasharray="4 2" />
                            <circle cx="12" cy="4" r="1.8" fill="currentColor" />
                            <circle cx="20" cy="12" r="1.8" fill="currentColor" />
                            <circle cx="12" cy="20" r="1.8" fill="currentColor" />
                        </>
                    ) : (
                        <>
                            <line x1="3" y1="7" x2="21" y2="7" />
                            <line x1="3" y1="17" x2="21" y2="17" />
                            <rect x="5" y="9.5" width="3.5" height="5" rx="0.8" />
                            <rect x="10.25" y="9.5" width="3.5" height="5" rx="0.8" />
                            <rect x="15.5" y="9.5" width="3.5" height="5" rx="0.8" />
                        </>
                    )}
                </svg>
            ) : eng === 'searching' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={svgDim}>
                    <circle cx="10.5" cy="10.5" r="6.5" />
                    <line x1="15.5" y1="15.5" x2="21" y2="21" />
                    <text x="10.5" y="13" textAnchor="middle" fontSize="7" fontWeight="600" fill="currentColor" stroke="none">
                        {sub === 'binary' ? '÷2' : sub === 'jump' ? '√n' : '?'}
                    </text>
                </svg>
            ) : eng === 'sorting' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={svgDim}>
                    <rect x="3" y="14" width="3.5" height="6" rx="0.8" />
                    <rect x="8.5" y="10" width="3.5" height="10" rx="0.8" />
                    <rect x="14" y="5" width="3.5" height="15" rx="0.8" />
                    <path d="M19.5 9l2-2-2-2" />
                </svg>
            ) : eng === 'tree' || eng === 'segment-tree' || eng === 'fenwick-tree' || eng === 'btree' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={svgDim}>
                    <circle cx="12" cy="5" r="2.8" />
                    <circle cx="6" cy="18" r="2.8" />
                    <circle cx="18" cy="18" r="2.8" />
                    <line x1="10.2" y1="7.2" x2="7.5" y2="15.5" />
                    <line x1="13.8" y1="7.2" x2="16.5" y2="15.5" />
                </svg>
            ) : eng === 'trie' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={svgDim}>
                    <circle cx="12" cy="4.5" r="2.2" />
                    <line x1="10.5" y1="6.2" x2="6.5" y2="12" />
                    <line x1="13.5" y1="6.2" x2="17.5" y2="12" />
                    <text x="5.5" y="19" fontSize="7" fontWeight="600" fill="currentColor" stroke="none">A</text>
                    <text x="15.5" y="19" fontSize="7" fontWeight="600" fill="currentColor" stroke="none">Z</text>
                </svg>
            ) : eng === 'hash-table' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={svgDim}>
                    <line x1="4" y1="9" x2="20" y2="9" />
                    <line x1="4" y1="15" x2="20" y2="15" />
                    <line x1="10" y1="4" x2="8" y2="20" />
                    <line x1="16" y1="4" x2="14" y2="20" />
                </svg>
            ) : eng === 'dsu' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={svgDim}>
                    <circle cx="9" cy="12" r="5.5" />
                    <circle cx="15" cy="12" r="5.5" />
                </svg>
            ) : eng === 'graph' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={svgDim}>
                    <circle cx="5" cy="6" r="2.5" />
                    <circle cx="19" cy="6" r="2.5" />
                    <circle cx="12" cy="18" r="2.5" />
                    <line x1="7.5" y1="6" x2="16.5" y2="6" />
                    <line x1="6.5" y1="8.2" x2="10.5" y2="15.8" />
                    <line x1="17.5" y1="8.2" x2="13.5" y2="15.8" />
                </svg>
            ) : eng === 'recursion' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={svgDim}>
                    <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
                    <path d="M3 3v5h5" />
                    <circle cx="12" cy="12" r="2.5" />
                </svg>
            ) : eng === 'backtracking' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={svgDim}>
                    <rect x="3" y="3" width="18" height="18" rx="2.5" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="12" y1="3" x2="12" y2="21" />
                    <circle cx="7.5" cy="7.5" r="1.8" fill="currentColor" />
                    <circle cx="16.5" cy="16.5" r="1.8" fill="currentColor" />
                </svg>
            ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={svgDim}>
                    <rect x="3" y="4" width="18" height="16" rx="2" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                    <line x1="9" y1="10" x2="9" y2="20" />
                    <line x1="15" y1="10" x2="15" y2="20" />
                </svg>
            )}
        </div>
    );
};

/* ============================================================================
   MULTI-ENGINE VISUALIZATION CANVAS RENDERERS
   ============================================================================ */

/* 1. SEARCHING & ARRAY & ADVANCED RANGE VISUALIZER */
const SearchingOrRangeCanvas = ({ frame, topic, comparisonFrames, currentStep }) => {
    const vs = frame?.visualState || {};
    const arr = vs.array || [];
    const active = vs.activeIndices || [];
    const comparing = vs.comparingIndices || [];
    const found = vs.foundIndex ?? -1;
    const eliminated = vs.eliminatedIndices || [];
    const range = vs.range || vs.queryRange || null;

    const renderArrayRow = (rowArr, rowVs, label = null) => (
        <div className="space-y-2">
            {label && (
                <div className="flex items-center justify-between text-xs font-medium text-slate-600 px-1">
                    <span>{label}</span>
                    <span className="font-mono text-[#3D7690]">
                        Comparisons: {rowVs.comparisons ?? 0}
                    </span>
                </div>
            )}
            <div className="flex flex-wrap items-center justify-center gap-2.5 py-4 px-3 bg-slate-50/80 rounded-xl border border-slate-200/80">
                {rowArr.map((val, idx) => {
                    const isFound = (rowVs.foundIndex ?? -1) === idx;
                    const isCmp = (rowVs.comparingIndices || []).includes(idx);
                    const isAct = (rowVs.activeIndices || []).includes(idx);
                    const isElim = (rowVs.eliminatedIndices || []).includes(idx);
                    const inRange =
                        rowVs.range && idx >= rowVs.range[0] && idx <= rowVs.range[1];

                    let boxClass = 'bg-white border-slate-300 text-slate-800';
                    let badgeText = null;
                    if (isFound) {
                        boxClass =
                            'bg-emerald-600 border-emerald-700 text-white shadow-md scale-105 ring-4 ring-emerald-500/20';
                        badgeText = 'FOUND';
                    } else if (isCmp) {
                        boxClass =
                            'bg-[#5899B5] border-[#3D7690] text-white shadow-md scale-105 ring-4 ring-[#5899B5]/20';
                        badgeText = 'COMPARE';
                    } else if (isAct) {
                        boxClass =
                            'bg-[#5899B5]/15 border-[#5899B5] text-[#3D7690] font-semibold';
                        badgeText = 'ACTIVE';
                    } else if (isElim) {
                        boxClass =
                            'bg-slate-100 border-slate-200 text-slate-400 opacity-50';
                    } else if (inRange) {
                        boxClass = 'bg-white border-[#5899B5]/60 text-slate-800';
                    }

                    return (
                        <div key={idx} className="flex flex-col items-center">
                            <div className="h-5 flex items-center justify-center">
                                {badgeText && (
                                    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-[#3D7690] text-white tracking-wider">
                                        {badgeText}
                                    </span>
                                )}
                            </div>
                            <div
                                className={`w-14 h-14 rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-300 ${boxClass}`}
                            >
                                <span className="text-base font-semibold font-mono">
                                    {val}
                                </span>
                            </div>
                            <span className="mt-1 text-[10px] font-mono font-medium text-slate-400">
                                [{idx}]
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className="space-y-4">
            {range && (
                <div className="flex items-center justify-center gap-3 text-xs font-medium text-[#3D7690] bg-[#5899B5]/10 border border-[#5899B5]/25 rounded-lg py-1.5 px-3">
                    <span>
                        Active Interval: [{range[0]} .. {range[1]}]
                    </span>
                    {vs.rangeSum !== null && vs.rangeSum !== undefined && (
                        <span className="px-2 py-0.5 rounded bg-[#5899B5] text-white font-mono">
                            Range Aggregate = {vs.rangeSum}
                        </span>
                    )}
                </div>
            )}

            {renderArrayRow(
                arr,
                {
                    foundIndex: found,
                    comparingIndices: comparing,
                    activeIndices: active,
                    eliminatedIndices: eliminated,
                    range,
                    comparisons: frame?.metrics?.comparisons
                },
                comparisonFrames ? `${topic.title} Execution` : null
            )}

            {/* Side-by-Side Comparison Mode for Binary Search vs Linear Search */}
            {comparisonFrames && comparisonFrames.length > 0 && (
                <div className="pt-2 border-t border-slate-200">
                    {(() => {
                        const cmpFrame =
                            comparisonFrames[
                                Math.min(currentStep, comparisonFrames.length - 1)
                            ];
                        const cvs = cmpFrame?.visualState || {};
                        return renderArrayRow(
                            cvs.array || arr,
                            {
                                ...cvs,
                                comparisons: cmpFrame?.metrics?.comparisons
                            },
                            `Side-by-Side Comparison: ${
                                topic.subVariant === 'binary'
                                    ? 'Linear Search O(n)'
                                    : 'Binary Search O(log n)'
                            } on Same Input`
                        );
                    })()}
                </div>
            )}

            {/* Hierarchical Segment/Fenwick/B-Tree Summary View */}
            {['segment-tree', 'fenwick-tree', 'btree'].includes(topic.engineType) &&
                arr.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2">
                        <div className="text-[11px] font-semibold uppercase tracking-wider text-[#3D7690]">
                            {topic.engineType === 'segment-tree'
                                ? 'Segment Tree Hierarchical Interval Partitions'
                                : topic.engineType === 'fenwick-tree'
                                  ? 'Fenwick Tree (BIT) 1-Indexed LSB Stride Buckets (i & -i)'
                                  : 'Multi-Way B-Tree / B+ Tree Sorted Page Keys'}
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {topic.engineType === 'segment-tree' && (
                                <>
                                    <div className="p-2 rounded-lg bg-[#5899B5]/10 border border-[#5899B5]/25 text-center">
                                        <div className="text-[10px] font-medium text-slate-500">
                                            Root [0..{arr.length - 1}]
                                        </div>
                                        <div className="text-sm font-semibold font-mono text-[#3D7690]">
                                            Sum = {arr.reduce((a, b) => a + b, 0)}
                                        </div>
                                    </div>
                                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-center">
                                        <div className="text-[10px] font-medium text-slate-500">
                                            Left [0..{Math.floor((arr.length - 1) / 2)}]
                                        </div>
                                        <div className="text-sm font-semibold font-mono text-slate-700">
                                            Sum ={' '}
                                            {arr
                                                .slice(
                                                    0,
                                                    Math.floor((arr.length - 1) / 2) + 1
                                                )
                                                .reduce((a, b) => a + b, 0)}
                                        </div>
                                    </div>
                                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-center">
                                        <div className="text-[10px] font-medium text-slate-500">
                                            Right [
                                            {Math.floor((arr.length - 1) / 2) + 1}..
                                            {arr.length - 1}]
                                        </div>
                                        <div className="text-sm font-semibold font-mono text-slate-700">
                                            Sum ={' '}
                                            {arr
                                                .slice(
                                                    Math.floor((arr.length - 1) / 2) + 1
                                                )
                                                .reduce((a, b) => a + b, 0)}
                                        </div>
                                    </div>
                                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-center">
                                        <div className="text-[10px] font-medium text-slate-500">
                                            Tree Height
                                        </div>
                                        <div className="text-sm font-semibold font-mono text-slate-700">
                                            ⌈log₂({arr.length})⌉ ={' '}
                                            {Math.ceil(Math.log2(Math.max(1, arr.length)))}
                                        </div>
                                    </div>
                                </>
                            )}
                            {topic.engineType === 'fenwick-tree' &&
                                arr.slice(0, 8).map((_, idx) => {
                                    const oneIdx = idx + 1;
                                    const lsb = oneIdx & -oneIdx;
                                    const start = oneIdx - lsb;
                                    const bitVal = arr
                                        .slice(start, oneIdx)
                                        .reduce((a, b) => a + b, 0);
                                    return (
                                        <div
                                            key={idx}
                                            className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-center"
                                        >
                                            <div className="text-[10px] font-mono font-medium text-slate-500">
                                                BIT[{oneIdx}] (len={lsb})
                                            </div>
                                            <div className="text-xs font-semibold font-mono text-[#3D7690]">
                                                {bitVal}
                                            </div>
                                        </div>
                                    );
                                })}
                            {topic.engineType === 'btree' && (
                                <>
                                    <div className="p-2.5 rounded-lg bg-[#5899B5]/10 border border-[#5899B5]/30 col-span-2 text-center">
                                        <div className="text-[10px] font-medium text-slate-500">
                                            Internal Root Separator Key
                                        </div>
                                        <div className="text-sm font-semibold font-mono text-[#3D7690]">
                                            [ {arr[Math.floor(arr.length / 2)] ?? '-'} ]
                                        </div>
                                    </div>
                                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
                                        <div className="text-[10px] font-medium text-slate-500">
                                            Left Leaf Page
                                        </div>
                                        <div className="text-xs font-semibold font-mono text-slate-700">
                                            [
                                            {arr
                                                .slice(0, Math.floor(arr.length / 2))
                                                .join(' | ')}
                                            ]
                                        </div>
                                    </div>
                                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
                                        <div className="text-[10px] font-medium text-slate-500">
                                            Right Leaf Page
                                        </div>
                                        <div className="text-xs font-semibold font-mono text-slate-700">
                                            [
                                            {arr
                                                .slice(Math.floor(arr.length / 2))
                                                .join(' | ')}
                                            ]
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
        </div>
    );
};

/* 2. SORTING VISUALIZER (Animated Bars + Temp Buffers + Dual Heap Tree for Heap Sort) */
const SortingCanvas = ({ frame }) => {
    const vs = frame?.visualState || {};
    const arr = vs.array || [];
    const comparing = vs.comparing || [];
    const swapping = vs.swapping || [];
    const sorted = vs.sorted || [];
    const processing = vs.processing || [];
    const pivotIndex = vs.pivotIndex ?? -1;
    const tempBuffer = vs.tempBuffer || [];
    const maxVal = Math.max(...arr.map((v) => Math.abs(v)), 1);

    const heapLayout = useMemo(() => {
        if (!vs.showHeapTree) return null;
        return buildTreeVisualLayout(arr, 'heap');
    }, [arr, vs.showHeapTree]);

    return (
        <div className="space-y-4">
            {/* Color Legend */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] font-medium text-slate-600">
                <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-xs bg-[#5899B5]" /> Comparing
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-xs bg-amber-500" /> Swapping / Writing
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-xs bg-purple-600" /> Pivot / Key
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-xs bg-emerald-600" /> Sorted Position
                </span>
            </div>

            {/* Vertical Bar Chart + Index Cards */}
            <div className="h-56 px-4 pt-6 pb-2 bg-slate-50/90 rounded-xl border border-slate-200 flex items-end justify-center gap-2">
                {arr.map((val, idx) => {
                    const isSwap = swapping.includes(idx);
                    const isCmp = comparing.includes(idx);
                    const isPivot = pivotIndex === idx;
                    const isSort = sorted.includes(idx);
                    const isProc = processing.includes(idx);

                    let barColor = 'bg-slate-300 border-slate-400 text-slate-700';
                    if (isSwap) barColor = 'bg-amber-500 border-amber-600 text-white shadow-md';
                    else if (isPivot)
                        barColor = 'bg-purple-600 border-purple-700 text-white shadow-md';
                    else if (isCmp)
                        barColor = 'bg-[#5899B5] border-[#3D7690] text-white shadow-md';
                    else if (isSort)
                        barColor = 'bg-emerald-600 border-emerald-700 text-white';
                    else if (isProc)
                        barColor = 'bg-[#5899B5]/40 border-[#5899B5] text-slate-800';

                    const heightPct = Math.max(18, Math.round((Math.abs(val) / maxVal) * 100));

                    return (
                        <div
                            key={idx}
                            className="flex-1 max-w-[54px] h-full flex flex-col items-center justify-end"
                        >
                            <span className="text-xs font-semibold font-mono text-slate-700 mb-1">
                                {val}
                            </span>
                            <div
                                style={{ height: `${heightPct}%` }}
                                className={`w-full rounded-t-lg border-t-2 border-x-2 transition-all duration-300 flex items-end justify-center pb-1 ${barColor}`}
                            />
                            <span className="mt-1.5 text-[10px] font-mono font-medium text-slate-400">
                                [{idx}]
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Temporary Storage / Buckets / Frequency Counts (Merge, Counting, Radix, Bucket Sort) */}
            {tempBuffer.length > 0 && (
                <div className="p-3 bg-white rounded-xl border border-[#5899B5]/30 space-y-2">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-[#3D7690]">
                        Auxiliary Buffer / Intermediate Buckets
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {tempBuffer.map((item, i) => (
                            <div
                                key={i}
                                className="px-2.5 py-1.5 rounded-lg bg-[#5899B5]/10 border border-[#5899B5]/25 text-xs font-mono"
                            >
                                <span className="font-medium text-slate-500">{item.label}: </span>
                                <span className="font-semibold text-[#3D7690]">{item.val}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Dual Heap Tree View for Heap Sort */}
            {heapLayout && heapLayout.nodes.length > 0 && (
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-[#3D7690] mb-1">
                        Synchronized Binary Heap Tree Structure
                    </div>
                    <svg viewBox="0 0 800 220" className="w-full h-44">
                        {heapLayout.edges.map((e, i) => {
                            const u = heapLayout.nodes.find((n) => n.id === e.from);
                            const v = heapLayout.nodes.find((n) => n.id === e.to);
                            if (!u || !v) return null;
                            return (
                                <line
                                    key={i}
                                    x1={u.x}
                                    y1={u.y}
                                    x2={v.x}
                                    y2={v.y}
                                    stroke="#CBD5E1"
                                    strokeWidth="2"
                                />
                            );
                        })}
                        {heapLayout.nodes.map((n, idx) => {
                            const isLocked = sorted.includes(idx);
                            const isAct = swapping.includes(idx) || comparing.includes(idx);
                            return (
                                <g key={n.id}>
                                    <circle
                                        cx={n.x}
                                        cy={n.y}
                                        r="18"
                                        fill={
                                            isAct
                                                ? '#5899B5'
                                                : isLocked
                                                  ? '#059669'
                                                  : '#FFFFFF'
                                        }
                                        stroke={
                                            isAct
                                                ? '#3D7690'
                                                : isLocked
                                                  ? '#047857'
                                                  : '#5899B5'
                                        }
                                        strokeWidth="2.5"
                                    />
                                    <text
                                        x={n.x}
                                        y={n.y + 4}
                                        textAnchor="middle"
                                        className="text-[11px] font-mono font-semibold"
                                        fill={isAct || isLocked ? '#FFFFFF' : '#1E293B'}
                                    >
                                        {n.val}
                                    </text>
                                </g>
                            );
                        })}
                    </svg>
                </div>
            )}
        </div>
    );
};

/* 3. LINEAR DATA STRUCTURES (Arrays, Singly/Doubly/Circular Linked Lists, Stack, Queue) */
const LinearDsCanvas = ({ frame, topic }) => {
    const vs = frame?.visualState || {};
    const items = vs.items || [];
    const activeIdx = vs.activeIndex ?? -1;
    const cmpIdx = vs.comparingIndex ?? -1;
    const foundIdx = vs.foundIndex ?? -1;
    const shifting = vs.shiftingIndices || [];
    const preview = vs.newNodePreview || null;
    const sub = topic.subVariant;

    // A. STACK (Vertical LIFO Tower)
    if (topic.engineType === 'stack') {
        const cap = vs.capacity || 8;
        const slots = Array.from({ length: cap }, (_, i) => items[i] ?? null);
        return (
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 py-4">
                <div className="flex flex-col-reverse w-52 bg-slate-100 p-3 rounded-b-2xl border-x-4 border-b-4 border-[#3D7690] gap-1.5">
                    {slots.map((val, idx) => {
                        const isTop = idx === items.length - 1 && val !== null;
                        const isAct = idx === activeIdx || idx === foundIdx || idx === cmpIdx;
                        return (
                            <div
                                key={idx}
                                className={`h-10 rounded-lg border-2 px-3 flex items-center justify-between font-mono text-sm transition-all ${
                                    val === null
                                        ? 'border-dashed border-slate-300 bg-white/50 text-slate-300'
                                        : isAct
                                          ? 'bg-[#5899B5] border-[#3D7690] text-white font-semibold shadow-sm'
                                          : isTop
                                            ? 'bg-[#5899B5]/15 border-[#5899B5] text-[#3D7690] font-semibold'
                                            : 'bg-white border-slate-300 text-slate-800 font-medium'
                                }`}
                            >
                                <span className="text-[10px] opacity-70">[{idx}]</span>
                                <span>{val !== null ? val : 'empty'}</span>
                                {isTop && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#3D7690] text-white font-sans font-semibold">
                                        ← TOP
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
                <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                        <div className="font-medium text-slate-500">TOP Pointer</div>
                        <div className="text-lg font-semibold font-mono text-[#3D7690]">
                            top = {items.length - 1}
                        </div>
                        <div className="text-[11px] text-slate-500">
                            Capacity: {items.length} / {cap}
                        </div>
                    </div>
                    {preview && (
                        <div className="p-3 rounded-xl bg-[#5899B5]/10 border border-[#5899B5] text-[#3D7690] font-medium">
                            Incoming Frame: <span className="font-mono font-semibold">{preview.value}</span>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // B. LINKED LISTS (Singly, Doubly, Circular, Circular-Doubly)
    if (topic.engineType === 'linked-list') {
        const isDoubly = sub === 'doubly' || sub === 'circular-doubly';
        const isCircular = sub === 'circular' || sub === 'circular-doubly';

        return (
            <div className="space-y-4 py-3">
                {preview && (
                    <div className="flex items-center justify-center">
                        <div className="px-3.5 py-1.5 rounded-xl bg-[#5899B5] text-white text-xs font-medium shadow-sm flex items-center gap-2">
                            <span>Allocating New Node: [{preview.value}]</span>
                            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-mono">
                                Stage: {vs.pointerStage || 'wire-next'}
                            </span>
                        </div>
                    </div>
                )}

                <div className="flex flex-wrap items-center justify-center gap-2 py-6 px-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="px-2.5 py-1 rounded-lg bg-[#3D7690] text-white text-xs font-semibold font-mono">
                        HEAD
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#3D7690]" />

                    {items.length === 0 ? (
                        <div className="px-4 py-2 rounded-xl border-2 border-dashed border-slate-300 text-xs font-mono font-medium text-slate-400">
                            NULL (Empty List)
                        </div>
                    ) : (
                        items.map((val, idx) => {
                            const isAct =
                                idx === activeIdx || idx === cmpIdx || idx === foundIdx;
                            return (
                                <React.Fragment key={idx}>
                                    <div
                                        className={`rounded-xl border-2 transition-all duration-300 flex items-center overflow-hidden ${
                                            isAct
                                                ? 'border-[#3D7690] bg-[#5899B5] text-white shadow-md scale-105'
                                                : 'border-[#5899B5]/40 bg-white text-slate-800'
                                        }`}
                                    >
                                        {isDoubly && (
                                            <div className="px-2 py-2.5 border-r border-slate-200/60 text-[10px] font-mono opacity-75">
                                                prev
                                            </div>
                                        )}
                                        <div className="px-3.5 py-2.5 font-mono font-semibold text-sm">
                                            {val}
                                        </div>
                                        <div className="px-2 py-2.5 border-l border-slate-200/60 text-[10px] font-mono opacity-75">
                                            next
                                        </div>
                                    </div>

                                    {idx < items.length - 1 ? (
                                        <div className="flex flex-col items-center text-[#5899B5] font-medium text-xs px-0.5">
                                            <span>→</span>
                                            {isDoubly && <span className="-mt-2">←</span>}
                                        </div>
                                    ) : isCircular ? (
                                        <div className="px-2.5 py-1 rounded-lg bg-[#5899B5]/15 border border-[#5899B5]/30 text-[#3D7690] text-[11px] font-mono font-semibold">
                                            ↺ wraps to HEAD ({items[0]})
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1">
                                            <span className="text-slate-400 font-medium">→</span>
                                            <span className="px-2 py-1 rounded bg-slate-200 text-slate-600 text-[11px] font-mono font-medium">
                                                NULL
                                            </span>
                                        </div>
                                    )}
                                </React.Fragment>
                            );
                        })
                    )}
                </div>
            </div>
        );
    }

    // C. QUEUES & ARRAYS
    return (
        <div className="space-y-3 py-3">
            {topic.engineType === 'queue' && (
                <div className="flex items-center justify-between text-xs font-medium text-[#3D7690] px-2">
                    <span>
                        FRONT → {items[0] !== undefined ? `${items[0]} [0]` : 'EMPTY'}
                    </span>
                    <span className="uppercase tracking-wider text-[11px] bg-[#5899B5]/10 px-2.5 py-0.5 rounded border border-[#5899B5]/25">
                        {sub === 'circular'
                            ? 'Circular Ring Buffer ((i + 1) % cap)'
                            : sub === 'deque'
                              ? 'Double-Ended Queue (Both Ends O(1))'
                              : sub === 'priority'
                                ? 'Priority-Ordered Queue (Min-First)'
                                : 'FIFO Linear Queue'}
                    </span>
                    <span>
                        REAR →{' '}
                        {items.length > 0
                            ? `${items[items.length - 1]} [${items.length - 1}]`
                            : 'EMPTY'}
                    </span>
                </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-2.5 py-5 px-4 bg-slate-50 rounded-xl border border-slate-200">
                {items.map((val, idx) => {
                    const isAct = idx === activeIdx || idx === cmpIdx || idx === foundIdx;
                    const isShift = shifting.includes(idx);
                    const isFront = topic.engineType === 'queue' && idx === 0;
                    const isRear =
                        topic.engineType === 'queue' && idx === items.length - 1;

                    return (
                        <div key={idx} className="flex flex-col items-center">
                            <div className="h-5 flex items-center gap-1">
                                {isFront && (
                                    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-[#3D7690] text-white">
                                        FRONT
                                    </span>
                                )}
                                {isRear && (
                                    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-[#5899B5] text-white">
                                        REAR
                                    </span>
                                )}
                            </div>
                            <div
                                className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center font-mono text-base font-semibold transition-all ${
                                    isAct
                                        ? 'bg-[#5899B5] border-[#3D7690] text-white shadow-md scale-105'
                                        : isShift
                                          ? 'bg-amber-500 border-amber-600 text-white'
                                          : 'bg-white border-slate-300 text-slate-800'
                                }`}
                            >
                                {val}
                            </div>
                            <span className="mt-1 text-[10px] font-mono font-medium text-slate-400">
                                [{idx}]
                            </span>
                            {topic.engineType === 'array' && (
                                <span className="text-[9px] font-mono text-slate-400">
                                    0x{(0x1000 + idx * 4).toString(16).toUpperCase()}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

/* 4. TREES, TRIE, HASH TABLE, DSU VISUALIZER */
const TreeAndNonLinearCanvas = ({ frame, topic }) => {
    const vs = frame?.visualState || {};

    // A. TRIE
    if (vs.engineType === 'trie') {
        const words = vs.words || [];
        const activePrefix = vs.activePrefix || '';
        return (
            <div className="space-y-4 py-3">
                <div className="flex flex-wrap items-center justify-center gap-2">
                    <span className="text-xs font-medium text-slate-500">Stored Dictionary:</span>
                    {words.map((w) => (
                        <span
                            key={w}
                            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold border ${
                                w === vs.activeWord && vs.foundWord
                                    ? 'bg-emerald-600 text-white border-emerald-700'
                                    : w.startsWith(activePrefix) && activePrefix
                                      ? 'bg-[#5899B5]/15 text-[#3D7690] border-[#5899B5]'
                                      : 'bg-white text-slate-700 border-slate-200'
                            }`}
                        >
                            {w} •
                        </span>
                    ))}
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <div className="text-xs font-medium text-slate-600 text-center">
                        Root-to-Terminal Character Prefix Chains
                    </div>
                    <div className="space-y-2">
                        {words.map((w) => (
                            <div key={w} className="flex items-center gap-1.5 flex-wrap">
                                <span className="px-2 py-1 rounded bg-[#3D7690] text-white text-[10px] font-mono font-semibold">
                                    ROOT
                                </span>
                                {w.split('').map((ch, i) => {
                                    const pref = w.slice(0, i + 1);
                                    const isHighlighted =
                                        activePrefix && activePrefix.startsWith(pref);
                                    return (
                                        <React.Fragment key={i}>
                                            <span className="text-slate-400 text-xs">→</span>
                                            <div
                                                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-mono text-xs font-semibold ${
                                                    isHighlighted
                                                        ? 'bg-[#5899B5] border-[#3D7690] text-white shadow-xs'
                                                        : 'bg-white border-slate-300 text-slate-800'
                                                }`}
                                            >
                                                {ch}
                                            </div>
                                        </React.Fragment>
                                    );
                                })}
                                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    isEnd=true
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // B. HASH TABLE
    if (vs.engineType === 'hash-table') {
        const buckets = vs.buckets || [];
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 py-2">
                {buckets.map((b) => {
                    const isAct = vs.activeBucket === b.bucketIndex;
                    return (
                        <div
                            key={b.bucketIndex}
                            className={`p-2.5 rounded-xl border-2 flex items-center gap-2 transition-all ${
                                isAct
                                    ? 'border-[#5899B5] bg-[#5899B5]/10'
                                    : 'border-slate-200 bg-white'
                            }`}
                        >
                            <div
                                className={`w-16 py-1.5 rounded-lg text-center font-mono text-xs font-semibold shrink-0 ${
                                    isAct
                                        ? 'bg-[#3D7690] text-white'
                                        : 'bg-slate-100 text-slate-700'
                                }`}
                            >
                                [{b.bucketIndex}]
                            </div>
                            <span className="text-slate-400 font-medium">→</span>
                            <div className="flex flex-wrap items-center gap-1.5">
                                {b.chain.length === 0 ? (
                                    <span className="text-xs font-mono text-slate-400">
                                        NULL
                                    </span>
                                ) : (
                                    b.chain.map((entry, idx) => (
                                        <div
                                            key={idx}
                                            className={`px-2.5 py-1 rounded-lg border text-xs font-mono font-medium ${
                                                vs.highlightKey === entry.key
                                                    ? 'bg-emerald-600 text-white border-emerald-700'
                                                    : 'bg-slate-50 text-slate-800 border-slate-300'
                                            }`}
                                        >
                                            {entry.key} : {entry.val}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    // C. DISJOINT SET UNION (UNION-FIND)
    if (vs.engineType === 'dsu') {
        const parent = vs.parent || [];
        const rank = vs.rank || [];
        return (
            <div className="space-y-4 py-3">
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
                    {parent.map((p, idx) => {
                        const isAct = (vs.activeNodes || []).includes(idx);
                        const isRoot = p === idx;
                        return (
                            <div
                                key={idx}
                                className={`p-3 rounded-xl border-2 text-center transition-all ${
                                    isAct
                                        ? 'bg-[#5899B5] border-[#3D7690] text-white shadow-md'
                                        : isRoot
                                          ? 'bg-[#5899B5]/10 border-[#5899B5] text-[#3D7690]'
                                          : 'bg-white border-slate-200 text-slate-800'
                                }`}
                            >
                                <div className="text-xs font-medium opacity-75">
                                    Node {idx}
                                </div>
                                <div className="text-base font-semibold font-mono my-1">
                                    p[{idx}] = {p}
                                </div>
                                <div className="text-[10px] font-mono opacity-80">
                                    {isRoot ? `ROOT (rank ${rank[idx]})` : `→Parent ${p}`}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    // D. BINARY TREE / BST / AVL / RED-BLACK / HEAP SVG RENDERER
    const nodes = vs.treeNodes || [];
    const edges = vs.treeEdges || [];
    const pathVals = vs.pathVals || [];
    const showBF = topic.subVariant === 'avl' || topic.subVariant === 'avl-rotations';
    const showRBT = topic.subVariant === 'rbt';

    return (
        <div className="space-y-3">
            {vs.rotationBadge && (
                <div className="flex justify-center">
                    <span className="px-3 py-1 rounded-full bg-[#5899B5]/15 border border-[#5899B5] text-[#3D7690] text-xs font-semibold">
                        {vs.rotationBadge}
                    </span>
                </div>
            )}

            {vs.traversalOrder && vs.traversalOrder.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-1.5 p-2.5 rounded-xl bg-[#5899B5]/10 border border-[#5899B5]/25 text-xs font-mono">
                    <span className="font-medium text-[#3D7690]">Traversal Output:</span>
                    {vs.traversalOrder.map((v, i) => (
                        <React.Fragment key={i}>
                            <span className="px-2 py-0.5 rounded bg-white border border-[#5899B5]/40 font-semibold text-slate-800">
                                {v}
                            </span>
                            {i < vs.traversalOrder.length - 1 && <span>→</span>}
                        </React.Fragment>
                    ))}
                </div>
            )}

            <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                <svg viewBox="0 0 800 320" className="w-full h-72">
                    {edges.map((e, idx) => {
                        const u = nodes.find((n) => n.id === e.from);
                        const v = nodes.find((n) => n.id === e.to);
                        if (!u || !v) return null;
                        const isPathEdge =
                            pathVals.includes(u.val) && pathVals.includes(v.val);
                        return (
                            <line
                                key={idx}
                                x1={u.x}
                                y1={u.y}
                                x2={v.x}
                                y2={v.y}
                                stroke={isPathEdge ? '#5899B5' : '#CBD5E1'}
                                strokeWidth={isPathEdge ? '3.5' : '2'}
                            />
                        );
                    })}
                    {nodes.map((n) => {
                        const isFound = vs.foundVal === n.val;
                        const isAct = vs.activeVal === n.val;
                        const inPath = pathVals.includes(n.val);

                        let fill = '#FFFFFF';
                        let stroke = '#5899B5';
                        let textFill = '#1E293B';

                        if (isFound) {
                            fill = '#059669';
                            stroke = '#047857';
                            textFill = '#FFFFFF';
                        } else if (isAct) {
                            fill = '#5899B5';
                            stroke = '#3D7690';
                            textFill = '#FFFFFF';
                        } else if (showRBT) {
                            fill = n.color === 'RED' ? '#DC2626' : '#1E293B';
                            stroke = n.color === 'RED' ? '#991B1B' : '#0F172A';
                            textFill = '#FFFFFF';
                        } else if (inPath) {
                            fill = '#EBF3F7';
                            stroke = '#3D7690';
                        }

                        return (
                            <g key={n.id}>
                                <circle
                                    cx={n.x}
                                    cy={n.y}
                                    r="22"
                                    fill={fill}
                                    stroke={stroke}
                                    strokeWidth="3"
                                />
                                <text
                                    x={n.x}
                                    y={n.y + 4}
                                    textAnchor="middle"
                                    fill={textFill}
                                    className="text-xs font-mono font-semibold"
                                >
                                    {n.val}
                                </text>
                                {showBF && (
                                    <text
                                        x={n.x + 28}
                                        y={n.y - 10}
                                        className="text-[10px] font-mono font-semibold"
                                        fill="#3D7690"
                                    >
                                        bf={n.bf}
                                    </text>
                                )}
                            </g>
                        );
                    })}
                </svg>
            </div>

            {/* Synchronized Underlying Array for Heaps */}
            {vs.showHeapArray && (vs.values || []).length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-1.5 p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="text-xs font-medium text-slate-500 mr-2">
                        Heap Array Backing:
                    </span>
                    {vs.values.map((v, i) => (
                        <div
                            key={i}
                            className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 font-mono text-xs"
                        >
                            <span className="text-slate-400">[{i}]</span>{' '}
                            <span className="font-semibold text-[#3D7690]">{v}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

/* 5. INTERACTIVE DRAGGABLE GRAPH CANVAS + ADJACENCY LIST & MATRIX */
const GraphCanvas = ({ frame, graphState, setGraphState }) => {
    const svgRef = useRef(null);
    const [draggingId, setDraggingId] = useState(null);
    const vs = frame?.visualState || {};
    const graph = graphState || vs.graph || DEFAULT_GRAPH_STATE;
    const { ids, adjList, matrix } = useMemo(
        () => computeGraphRepresentations(graph),
        [graph]
    );

    const handleMouseMove = (e) => {
        if (!draggingId || !svgRef.current) return;
        const rect = svgRef.current.getBoundingClientRect();
        const x = Math.max(
            40,
            Math.min(700, ((e.clientX - rect.left) / rect.width) * 740)
        );
        const y = Math.max(
            35,
            Math.min(265, ((e.clientY - rect.top) / rect.height) * 300)
        );
        setGraphState((prev) => ({
            ...prev,
            vertices: prev.vertices.map((v) =>
                v.id === draggingId ? { ...v, x: Math.round(x), y: Math.round(y) } : v
            )
        }));
    };

    const isEdgeHighlighted = (u, v) => {
        const list = vs.highlightedEdges || [];
        return (
            list.includes(`${u}-${v}`) ||
            (!graph.directed && list.includes(`${v}-${u}`)) ||
            vs.activeEdge === `${u}-${v}` ||
            (!graph.directed && vs.activeEdge === `${v}-${u}`)
        );
    };

    return (
        <div className="space-y-4">
            <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden relative">
                <div className="absolute top-2.5 left-3 text-[11px] font-medium text-slate-500 bg-white/90 px-2.5 py-1 rounded-lg border border-slate-200">
                    Tip: Drag any vertex circle to rearrange the graph layout
                </div>
                <svg
                    ref={svgRef}
                    viewBox="0 0 740 300"
                    className="w-full h-72 select-none"
                    onMouseMove={handleMouseMove}
                    onMouseUp={() => setDraggingId(null)}
                    onMouseLeave={() => setDraggingId(null)}
                >
                    <defs>
                        <marker
                            id="algo-arrow"
                            viewBox="0 0 10 10"
                            refX="25"
                            refY="5"
                            markerWidth="6"
                            markerHeight="6"
                            orient="auto-start-reverse"
                        >
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3D7690" />
                        </marker>
                    </defs>

                    {graph.edges.map((e, idx) => {
                        const u = graph.vertices.find((v) => v.id === e.from);
                        const v = graph.vertices.find((v) => v.id === e.to);
                        if (!u || !v) return null;
                        const highlighted = isEdgeHighlighted(e.from, e.to);
                        const isNegative = Number(e.weight) < 0;
                        const mx = (u.x + v.x) / 2;
                        const my = (u.y + v.y) / 2;

                        return (
                            <g key={idx}>
                                <line
                                    x1={u.x}
                                    y1={u.y}
                                    x2={v.x}
                                    y2={v.y}
                                    stroke={
                                        isNegative
                                            ? '#DC2626'
                                            : highlighted
                                              ? '#5899B5'
                                              : '#CBD5E1'
                                    }
                                    strokeWidth={highlighted ? '4' : '2.2'}
                                    markerEnd={
                                        graph.directed ? 'url(#algo-arrow)' : undefined
                                    }
                                />
                                <rect
                                    x={mx - 14}
                                    y={my - 10}
                                    width="28"
                                    height="19"
                                    rx="5"
                                    fill={isNegative ? '#FEE2E2' : '#FFFFFF'}
                                    stroke={isNegative ? '#DC2626' : '#94A3B8'}
                                />
                                <text
                                    x={mx}
                                    y={my + 3}
                                    textAnchor="middle"
                                    className="text-[11px] font-mono font-semibold"
                                    fill={isNegative ? '#DC2626' : '#334155'}
                                >
                                    {e.weight}
                                </text>
                            </g>
                        );
                    })}

                    {graph.vertices.map((v) => {
                        const isAct = vs.activeVertex === v.id;
                        const isVis = (vs.visitedVertices || []).includes(v.id);
                        const distVal = vs.distances?.[v.id];

                        return (
                            <g
                                key={v.id}
                                className="cursor-grab active:cursor-grabbing"
                                onMouseDown={() => setDraggingId(v.id)}
                            >
                                <circle
                                    cx={v.x}
                                    cy={v.y}
                                    r="22"
                                    fill={
                                        isAct
                                            ? '#5899B5'
                                            : isVis
                                              ? '#059669'
                                              : '#FFFFFF'
                                    }
                                    stroke={
                                        isAct
                                            ? '#3D7690'
                                            : isVis
                                              ? '#047857'
                                              : '#5899B5'
                                    }
                                    strokeWidth="3"
                                />
                                <text
                                    x={v.x}
                                    y={v.y + 4}
                                    textAnchor="middle"
                                    fill={isAct || isVis ? '#FFFFFF' : '#1E293B'}
                                    className="text-xs font-mono font-semibold"
                                >
                                    {v.id}
                                </text>
                                {distVal !== undefined && (
                                    <text
                                        x={v.x}
                                        y={v.y - 28}
                                        textAnchor="middle"
                                        className="text-[11px] font-mono font-semibold"
                                        fill="#3D7690"
                                    >
                                        d={distVal}
                                    </text>
                                )}
                            </g>
                        );
                    })}
                </svg>
            </div>

            {/* Live Adjacency List & Adjacency Matrix Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-[#3D7690] mb-2">
                        Adjacency List Representation
                    </div>
                    <div className="space-y-1 max-h-36 overflow-y-auto text-xs font-mono">
                        {ids.map((id) => (
                            <div key={id} className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded bg-[#5899B5]/15 text-[#3D7690] font-semibold">
                                    {id}
                                </span>
                                <span className="text-slate-400">→</span>
                                <span className="text-slate-700">
                                    {(adjList[id] || [])
                                        .map((n) => `${n.to}(w:${n.weight})`)
                                        .join(', ') || '∅'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 overflow-x-auto">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-[#3D7690] mb-2">
                        Adjacency Matrix ({ids.length}×{ids.length})
                    </div>
                    <table className="w-full text-center font-mono text-[11px]">
                        <thead>
                            <tr>
                                <th className="p-1 text-slate-400">#</th>
                                {ids.map((id) => (
                                    <th key={id} className="p-1 text-[#3D7690] font-semibold">
                                        {id}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {matrix.map((row, rIdx) => (
                                <tr key={ids[rIdx]} className="border-t border-slate-100">
                                    <td className="p-1 font-semibold text-[#3D7690]">
                                        {ids[rIdx]}
                                    </td>
                                    {row.map((val, cIdx) => (
                                        <td
                                            key={cIdx}
                                            className={`p-1 ${
                                                val !== 0
                                                    ? 'font-semibold text-slate-800 bg-[#5899B5]/10'
                                                    : 'text-slate-300'
                                            }`}
                                        >
                                            {val}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

/* 6. RECURSION, BACKTRACKING, DP & GREEDY CANVAS */
const AlgorithmParadigmCanvas = ({ frame }) => {
    const vs = frame?.visualState || {};

    // A. RECURSION & TOWER OF HANOI
    if (vs.engineType === 'recursion') {
        const stack = vs.callStack || [];
        const pegs = vs.hanoiPegs;

        return (
            <div className="space-y-4 py-2">
                {pegs && (
                    <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                        {['A', 'B', 'C'].map((pegKey) => (
                            <div
                                key={pegKey}
                                className="flex flex-col items-center justify-end h-40 border-b-4 border-[#3D7690] pb-2 relative"
                            >
                                <div className="w-1.5 h-32 bg-slate-300 rounded-t absolute bottom-0" />
                                <div className="flex flex-col-reverse items-center gap-1 z-10 w-full">
                                    {(pegs[pegKey] || []).map((disk) => (
                                        <div
                                            key={disk}
                                            style={{ width: `${30 + disk * 16}%` }}
                                            className="h-6 rounded-md bg-[#5899B5] border border-[#3D7690] text-white text-xs font-mono font-semibold flex items-center justify-center shadow-xs"
                                        >
                                            D{disk}
                                        </div>
                                    ))}
                                </div>
                                <span className="mt-2 text-xs font-semibold text-[#3D7690]">
                                    Peg {pegKey}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#3D7690]">
                        Live Recursion Call Stack (LIFO Activation Records)
                    </div>
                    {stack.length === 0 ? (
                        <div className="text-xs font-mono text-slate-400 py-3 text-center">
                            Call stack unwound — Final Return Value ={' '}
                            <span className="font-semibold text-emerald-600">
                                {vs.returnValue ?? 'Complete'}
                            </span>
                        </div>
                    ) : (
                        <div className="flex flex-col-reverse gap-1.5">
                            {stack.map((item, idx) => (
                                <div
                                    key={idx}
                                    className={`px-3.5 py-2 rounded-lg border flex items-center justify-between font-mono text-xs ${
                                        idx === stack.length - 1
                                            ? 'bg-[#5899B5] border-[#3D7690] text-white font-semibold'
                                            : 'bg-slate-50 border-slate-200 text-slate-700'
                                    }`}
                                >
                                    <span>
                                        #{idx + 1}: {item.fn}
                                    </span>
                                    <span className="text-[11px] opacity-85">
                                        {item.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // B. BACKTRACKING (N-Queens Board, Rat Maze Grid, Subsets/Permutations)
    if (vs.engineType === 'backtracking') {
        if (vs.subVariant === 'nqueens' && vs.board) {
            return (
                <div className="flex flex-col items-center py-3">
                    <div className="grid grid-cols-4 border-4 border-[#3D7690] rounded-xl overflow-hidden shadow-sm">
                        {vs.board.map((row, r) =>
                            row.map((cell, c) => {
                                const isAct =
                                    vs.activeCell &&
                                    vs.activeCell[0] === r &&
                                    vs.activeCell[1] === c;
                                const isDark = (r + c) % 2 === 1;
                                return (
                                    <div
                                        key={`${r}-${c}`}
                                        className={`w-16 h-16 flex items-center justify-center text-2xl font-semibold transition-all ${
                                            isAct && vs.conflict
                                                ? 'bg-rose-500 text-white'
                                                : isAct
                                                  ? 'bg-[#5899B5] text-white'
                                                  : isDark
                                                    ? 'bg-slate-200 text-slate-800'
                                                    : 'bg-white text-slate-800'
                                        }`}
                                    >
                                        {cell === 1 ? '♛' : ''}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            );
        }

        if (vs.subVariant === 'maze' && vs.maze) {
            return (
                <div className="flex flex-col items-center py-3">
                    <div className="grid grid-cols-4 gap-1.5 p-3 bg-slate-100 rounded-xl border border-slate-300">
                        {vs.maze.map((row, r) =>
                            row.map((cell, c) => {
                                const inPath = vs.pathGrid?.[r]?.[c] === 1;
                                const isAct =
                                    vs.activeCell &&
                                    vs.activeCell[0] === r &&
                                    vs.activeCell[1] === c;
                                return (
                                    <div
                                        key={`${r}-${c}`}
                                        className={`w-14 h-14 rounded-lg border-2 flex items-center justify-center font-mono text-xs font-semibold ${
                                            cell === 0
                                                ? 'bg-slate-800 border-slate-900 text-slate-400'
                                                : isAct && vs.conflict
                                                  ? 'bg-amber-500 border-amber-600 text-white'
                                                  : inPath
                                                    ? 'bg-emerald-600 border-emerald-700 text-white'
                                                    : 'bg-white border-slate-300 text-slate-600'
                                        }`}
                                    >
                                        {cell === 0
                                            ? 'WALL'
                                            : r === 3 && c === 3
                                              ? 'GOAL'
                                              : inPath
                                                ? 'RAT'
                                                : `${r},${c}`}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            );
        }

        return (
            <div className="space-y-3 py-3">
                <div className="p-3.5 rounded-xl bg-[#5899B5]/10 border border-[#5899B5]/30 text-center">
                    <div className="text-xs font-medium text-slate-500">
                        Active Candidate Path
                    </div>
                    <div className="text-lg font-semibold font-mono text-[#3D7690]">
                        [ {(vs.currentSet || []).join(', ')} ]
                    </div>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#3D7690] mb-2">
                        Generated Solutions ({(vs.allResults || []).length})
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {(vs.allResults || []).map((res, i) => (
                            <span
                                key={i}
                                className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 font-mono text-xs font-medium text-slate-800"
                            >
                                {res}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // C. DYNAMIC PROGRAMMING 2D TABLE & GREEDY TIMELINE
    if (vs.subVariant === 'greedy') {
        return (
            <div className="space-y-2.5 py-3">
                {(vs.activities || []).map((act) => {
                    const isSel = (vs.selectedActivities || []).includes(act.id);
                    const isAct = vs.activeActivity === act.id;
                    return (
                        <div key={act.id} className="flex items-center gap-3">
                            <span className="w-10 text-xs font-mono font-semibold text-slate-700">
                                {act.id}
                            </span>
                            <div className="flex-1 h-8 bg-slate-100 rounded-lg relative overflow-hidden border border-slate-200">
                                <div
                                    style={{
                                        left: `${act.start * 9}%`,
                                        width: `${(act.end - act.start) * 9}%`
                                    }}
                                    className={`h-full rounded-md flex items-center justify-center text-[11px] font-mono font-semibold transition-all ${
                                        isSel
                                            ? 'bg-emerald-600 text-white'
                                            : isAct
                                              ? 'bg-amber-500 text-white'
                                              : 'bg-slate-300 text-slate-700'
                                    }`}
                                >
                                    [{act.start}..{act.end}]
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    const table = vs.dpTable || [];
    return (
        <div className="overflow-x-auto py-2">
            <table className="w-full text-center font-mono text-xs border-collapse">
                <thead>
                    <tr>
                        <th className="p-2 bg-slate-100 border border-slate-200 text-slate-600">
                            Item \ Cap
                        </th>
                        {(vs.colLabels || []).map((c, i) => (
                            <th
                                key={i}
                                className="p-2 bg-slate-100 border border-slate-200 text-[#3D7690]"
                            >
                                {c}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {table.map((row, r) => (
                        <tr key={r}>
                            <td className="p-2 bg-slate-50 border border-slate-200 font-medium text-slate-700 text-left">
                                {vs.rowLabels?.[r] || `Row ${r}`}
                            </td>
                            {row.map((val, c) => {
                                const isAct =
                                    vs.activeCell &&
                                    vs.activeCell[0] === r &&
                                    vs.activeCell[1] === c;
                                const isDep = (vs.dependencyCells || []).some(
                                    (d) => d[0] === r && d[1] === c
                                );
                                return (
                                    <td
                                        key={c}
                                        className={`p-2.5 border border-slate-200 font-semibold transition-all ${
                                            isAct
                                                ? 'bg-[#5899B5] text-white scale-105'
                                                : isDep
                                                  ? 'bg-amber-100 text-amber-900 border-amber-400'
                                                  : 'bg-white text-slate-800'
                                        }`}
                                    >
                                        {val}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

/* ============================================================================
   MAIN ALGOPLAY HUB COMPONENT
   ============================================================================ */
const AlgoPlayHub = ({ isStudentView = false }) => {
    const { user, token: adminToken } = useAuthStore();
    const { student, token: studentToken } = useStudentAuthStore();
    const addToast = useToastStore((s) => s.addToast);

    const activeRole = isStudentView
        ? 'student'
        : user?.role || (student ? 'student' : 'student');
    const canManage = ['admin', 'ops_admin'].includes(activeRole);
    const authToken = isStudentView ? studentToken : adminToken || studentToken;

    // Catalog & Student Progress State
    const [topics, setTopics] = useState(ALL_ALGOPLAY_TOPICS);
    const [progressMap, setProgressMap] = useState({});
    const [recentSlugs, setRecentSlugs] = useState(() => {
        try {
            const saved = localStorage.getItem('algoplay_recent_visited_v1');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });
    const [viewLayout, setViewLayout] = useState(() => {
        return localStorage.getItem('algoplay_view_layout_v1') || 'default'; // 'default' | 'grid' | 'list'
    });
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeDashboardRefTab, setActiveDashboardRefTab] = useState('none'); // 'none' | 'bigo' | 'sorting'

    // Active Topic Workspace State
    const [activeTopicSlug, setActiveTopicSlug] = useState(null);
    const [workspaceMode, setWorkspaceMode] = useState('learning'); // 'learning' | 'practice'
    const [selectedCodeLang, setSelectedCodeLang] = useState('python');
    const [copiedCode, setCopiedCode] = useState(false);

    // Interactive Inputs & Structure State
    const [inputValue, setInputValue] = useState('42');
    const [secondInputValue, setSecondInputValue] = useState('3');
    const [customArrayText, setCustomArrayText] = useState('38, 27, 43, 3, 9, 82, 10');
    const [sortOrder, setSortOrder] = useState('asc');
    const [compareWithLinear, setCompareWithLinear] = useState(false);
    const [dpMode, setDpMode] = useState('Tabulation (Bottom-Up)');

    // Persistent Mutable State for Current Structure
    const [linearItems, setLinearItems] = useState([12, 24, 36, 48, 60]);
    const [treeData, setTreeData] = useState([50, 30, 70, 20, 40, 60, 80]);
    const [graphState, setGraphState] = useState(DEFAULT_GRAPH_STATE);
    const [edgeFrom, setEdgeFrom] = useState('A');
    const [edgeTo, setEdgeTo] = useState('F');
    const [edgeWeight, setEdgeWeight] = useState('4');

    // Deterministic Step-Snapshot Animation Engine State
    const [frames, setFrames] = useState([]);
    const [comparisonFrames, setComparisonFrames] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speedMultiplier, setSpeedMultiplier] = useState(1);
    const [executionMode, setExecutionMode] = useState('auto'); // 'auto' | 'step'

    // Practice Mode State
    const [practiceAnswers, setPracticeAnswers] = useState({});
    const [stepPredictionChoice, setStepPredictionChoice] = useState(null);
    const [stepPredictionFeedback, setStepPredictionFeedback] = useState(null);

    // Admin Editor Modal State
    const [editingTopic, setEditingTopic] = useState(null);

    const activeTopic = useMemo(
        () => topics.find((t) => t.slug === activeTopicSlug) || null,
        [topics, activeTopicSlug]
    );

    // Load catalog overrides & user progress from backend
    useEffect(() => {
        const fetchCatalog = async () => {
            try {
                const res = await axios.get(`${API_BASE}/algoplay/topics`, {
                    headers: authToken ? { Authorization: `Bearer ${authToken}` } : {}
                });
                const serverTopics = res.data?.topics || res.data?.data;
                if (res.data?.success && Array.isArray(serverTopics)) {
                    const overrideMap = new Map(
                        serverTopics.map((o) => [o.slug, o])
                    );
                    setTopics(
                        ALL_ALGOPLAY_TOPICS.map((base) => {
                            const ov = overrideMap.get(base.slug);
                            if (!ov) return base;
                            return {
                                ...base,
                                ...ov,
                                title: ov.title || ov.name || base.title || base.name,
                                name: ov.name || ov.title || base.name || base.title,
                                shortDesc: ov.shortDesc || ov.shortDescription || base.shortDesc,
                                overview: {
                                    ...base.overview,
                                    ...(ov.overview || {}),
                                    what: ov.overview?.what || ov.overview?.whatItIs || base.overview?.what
                                },
                                complexity: {
                                    ...base.complexity,
                                    ...(ov.complexity || {}),
                                    timeAvg: ov.complexity?.timeAvg || ov.complexity?.averageTime || base.complexity?.timeAvg,
                                    timeBest: ov.complexity?.timeBest || ov.complexity?.bestTime || base.complexity?.timeBest,
                                    timeWorst: ov.complexity?.timeWorst || ov.complexity?.worstTime || base.complexity?.timeWorst
                                }
                            };
                        })
                    );
                }
                if (res.data?.progressMap) setProgressMap(res.data.progressMap);
                if (Array.isArray(res.data?.recentSlugs) && res.data.recentSlugs.length > 0) {
                    setRecentSlugs((prev) => {
                        const merged = [...new Set([...res.data.recentSlugs, ...prev])].slice(0, 3);
                        localStorage.setItem('algoplay_recent_visited_v1', JSON.stringify(merged));
                        return merged;
                    });
                }
            } catch {
                // Fallback to built-in 66-topic catalog + localStorage progress
                const savedProg = localStorage.getItem('algoplay_progress_v1');
                if (savedProg) {
                    try {
                        setProgressMap(JSON.parse(savedProg));
                    } catch {
                        /* ignore */
                    }
                }
            }
        };
        fetchCatalog();
    }, [authToken]);

    const handleChangeViewLayout = (mode) => {
        setViewLayout(mode);
        localStorage.setItem('algoplay_view_layout_v1', mode);
    };

    const recordTopicProgress = async (slug, statusUpdate = 'in-progress', extra = {}) => {
        setProgressMap((prev) => {
            const current = prev[slug]?.status;
            const nextStatus =
                current === 'completed' && statusUpdate !== 'in-progress-force'
                    ? 'completed'
                    : statusUpdate;
            const updated = {
                ...prev,
                [slug]: {
                    ...(prev[slug] || {}),
                    status: nextStatus,
                    lastVisitedAt: new Date().toISOString(),
                    ...extra
                }
            };
            localStorage.setItem('algoplay_progress_v1', JSON.stringify(updated));
            return updated;
        });

        setRecentSlugs((prev) => {
            const updatedRecent = [slug, ...prev.filter((s) => s !== slug)].slice(0, 3);
            localStorage.setItem('algoplay_recent_visited_v1', JSON.stringify(updatedRecent));
            return updatedRecent;
        });

        if (authToken) {
            try {
                await axios.post(
                    `${API_BASE}/algoplay/topics/${slug}/progress`,
                    { status: statusUpdate, ...extra },
                    { headers: { Authorization: `Bearer ${authToken}` } }
                );
            } catch {
                /* offline fallback handled via localStorage */
            }
        }
    };

    // Initialize default visualization frames whenever a topic is opened
    useEffect(() => {
        if (!activeTopic) return;
        setIsPlaying(false);
        setCurrentStep(0);
        setComparisonFrames(null);
        setStepPredictionChoice(null);
        setStepPredictionFeedback(null);

        const def = activeTopic.defaultSample || [10, 20, 30, 40, 50];

        if (activeTopic.engineType === 'searching') {
            setCustomArrayText(def.join(', '));
            setInputValue('23');
            const initialFrames = generateSearchingFrames(
                activeTopic.subVariant,
                def,
                23
            );
            setFrames(initialFrames);
        } else if (activeTopic.engineType === 'sorting') {
            setCustomArrayText(def.join(', '));
            const initialFrames = generateSortingFrames(
                activeTopic.subVariant,
                def,
                'asc'
            );
            setFrames(initialFrames);
        } else if (
            ['array', 'linked-list', 'stack', 'queue'].includes(
                activeTopic.engineType
            )
        ) {
            setLinearItems([...def]);
            const { frames: f } = generateLinearDsFrames(
                activeTopic.engineType,
                activeTopic.subVariant,
                def,
                'init'
            );
            setFrames(f);
        } else if (
            [
                'tree',
                'trie',
                'hash-table',
                'dsu',
                'segment-tree',
                'fenwick-tree',
                'btree'
            ].includes(activeTopic.engineType)
        ) {
            const initData =
                activeTopic.engineType === 'dsu' ? null : [...def];
            setTreeData(initData);
            const { frames: f, nextData } = generateTreeAndAdvancedFrames(
                activeTopic.engineType,
                activeTopic.subVariant,
                initData || [],
                'init'
            );
            setTreeData(nextData);
            setFrames(f);
        } else if (activeTopic.engineType === 'graph') {
            const f = generateGraphFrames(
                activeTopic.subVariant,
                graphState,
                'A',
                'F'
            );
            setFrames(f);
        } else {
            const f = generateAlgorithmFrames(
                activeTopic.engineType,
                activeTopic.subVariant,
                { n: 4, dpMode }
            );
            setFrames(f);
        }
    }, [activeTopic]);

    // Animation Playback Timer
    useEffect(() => {
        if (!isPlaying || frames.length <= 1) return;
        if (currentStep >= frames.length - 1) {
            setIsPlaying(false);
            return;
        }
        const delay = Math.max(180, Math.round(950 / speedMultiplier));
        const timer = setTimeout(() => {
            setCurrentStep((prev) => Math.min(frames.length - 1, prev + 1));
        }, delay);
        return () => clearTimeout(timer);
    }, [isPlaying, currentStep, frames.length, speedMultiplier]);

    // Trigger Operation Helper
    const runFrames = (newFrames, cmpFrames = null) => {
        if (!newFrames || newFrames.length === 0) return;
        setFrames(newFrames);
        setComparisonFrames(cmpFrames);
        setCurrentStep(0);
        setIsPlaying(executionMode === 'auto' && newFrames.length > 1);
    };

    const parseCustomArray = () =>
        customArrayText
            .split(',')
            .map((s) => Number(s.trim()))
            .filter((n) => !Number.isNaN(n))
            .slice(0, 14);

    // Filtered topics for Main Dashboard
    const visibleTopics = useMemo(() => {
        return topics
            .filter((t) => {
                if (!canManage && (t.isPublished === false || t.isEnabled === false))
                    return false;
                if (selectedCategory !== 'all' && t.category !== selectedCategory)
                    return false;
                if (searchQuery.trim()) {
                    const q = searchQuery.toLowerCase();
                    return (
                        t.title.toLowerCase().includes(q) ||
                        t.shortDesc.toLowerCase().includes(q) ||
                        t.categoryLabel.toLowerCase().includes(q)
                    );
                }
                return true;
            })
            .sort((a, b) => (a.sequenceOrder || 0) - (b.sequenceOrder || 0));
    }, [topics, canManage, selectedCategory, searchQuery]);

    const dashboardStats = useMemo(() => {
        let completed = 0;
        let inProgress = 0;
        topics.forEach((t) => {
            const st = progressMap[t.slug]?.status;
            if (st === 'completed') completed++;
            else if (st === 'in-progress') inProgress++;
        });
        return {
            total: topics.length,
            completed,
            inProgress,
            notExplored: Math.max(0, topics.length - completed - inProgress)
        };
    }, [topics, progressMap]);

    const currentFrame = frames[currentStep] || frames[0] || {};

    /* ========================================================================
       ADMIN TOPIC CUSTOMIZATION SAVE HANDLER
       ======================================================================== */
    const handleSaveTopicCustomization = async (updatedFields) => {
        const slug = updatedFields.slug;
        setTopics((prev) =>
            prev.map((t) => (t.slug === slug ? { ...t, ...updatedFields } : t))
        );
        setEditingTopic(null);

        if (authToken) {
            try {
                await axios.put(
                    `${API_BASE}/algoplay/topics/${slug}`,
                    updatedFields,
                    { headers: { Authorization: `Bearer ${authToken}` } }
                );
                addToast('AlgoPlay topic customization saved!', 'success');
            } catch {
                addToast('Saved locally in session.', 'info');
            }
        }
    };

    /* ========================================================================
       RENDER 1: INDIVIDUAL TOPIC VISUALIZER WORKSPACE
       ======================================================================== */
    if (activeTopic) {
        const topicStatus = progressMap[activeTopic.slug]?.status || 'in-progress';
        const codeText =
            activeTopic.codeExamples?.[selectedCodeLang] ||
            activeTopic.codeExamples?.python ||
            '';

        return (
            <div className="space-y-5 pb-10">
                {/* Top Navigation & Topic Header Bar */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                        <button
                            onClick={() => {
                                setIsPlaying(false);
                                setActiveTopicSlug(null);
                            }}
                            className="p-2.5 rounded-xl border border-slate-200 hover:border-[#5899B5] text-slate-600 hover:text-[#3D7690] transition-colors shrink-0"
                            title="Back to AlgoPlay Library"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </button>
                        <AlgoTopicIcon topic={activeTopic} size="lg" />
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#5899B5]/10 text-[#3D7690] border border-[#5899B5]/25">
                                    {getDirectAlgorithmTypeLabel(activeTopic)}
                                </span>
                                <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
                                    {activeTopic.difficulty}
                                </span>
                                {(() => {
                                    const cMeta = getComplexityMeta(activeTopic.complexity?.timeAvg);
                                    return (
                                        <span
                                            className={`inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-md border ${cMeta.badgeClass}`}
                                        >
                                            <span className={`w-1.5 h-1.5 rounded-full ${cMeta.dotClass}`} />
                                            Time: {cMeta.notation} ({cMeta.name})
                                        </span>
                                    );
                                })()}
                                <span className="text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-md bg-slate-100 text-[#3D7690]">
                                    Space: {activeTopic.complexity?.space}
                                </span>
                            </div>
                            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 mt-1">
                                {activeTopic.title}
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                                {activeTopic.overview?.what || activeTopic.shortDesc}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {/* Learning Mode vs Practice Mode Switcher */}
                        <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                            <button
                                onClick={() => setWorkspaceMode('learning')}
                                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                    workspaceMode === 'learning'
                                        ? 'bg-[#5899B5] text-white shadow-2xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                Learning & Visualizer
                            </button>
                            <button
                                onClick={() => setWorkspaceMode('practice')}
                                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                    workspaceMode === 'practice'
                                        ? 'bg-[#5899B5] text-white shadow-2xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                Practice & Challenges
                            </button>
                        </div>

                        <button
                            onClick={() =>
                                recordTopicProgress(
                                    activeTopic.slug,
                                    topicStatus === 'completed'
                                        ? 'in-progress-force'
                                        : 'completed'
                                )
                            }
                            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                                topicStatus === 'completed'
                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                                    : 'bg-white border-slate-200 text-slate-700 hover:border-[#5899B5]'
                            }`}
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            {topicStatus === 'completed'
                                ? 'Completed'
                                : 'Mark Complete'}
                        </button>

                        {canManage && (
                            <button
                                onClick={() => setEditingTopic({ ...activeTopic })}
                                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#5899B5]/10 border border-[#5899B5]/30 text-[#3D7690] hover:bg-[#5899B5] hover:text-white transition-all flex items-center gap-1.5"
                            >
                                <Edit3 className="w-3.5 h-3.5" /> Customize
                            </button>
                        )}
                    </div>
                </div>

                {workspaceMode === 'practice' ? (
                    /* ============================================================
                       PRACTICE MODE VIEW (Step Prediction + Easy/Medium/Hard Quizzes)
                       ============================================================ */
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                        {/* Step Prediction Interactive Challenge */}
                        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                            <div className="flex items-center gap-2 text-[#3D7690]">
                                <Sparkles className="w-5 h-5" />
                                <h2 className="text-base font-semibold text-slate-900">
                                    Interactive Step-Prediction Lab
                                </h2>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Pause at step <span className="font-medium">#{currentStep + 1}</span> of{' '}
                                <span className="font-medium">{activeTopic.title}</span> and predict what action
                                the algorithm will execute on step{' '}
                                <span className="font-medium">#{Math.min(frames.length, currentStep + 2)}</span>!
                            </p>

                            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                                <div className="text-[11px] font-medium text-slate-500">
                                    Current State (Step {currentStep + 1} / {frames.length}):
                                </div>
                                <div className="text-xs font-semibold text-[#3D7690]">
                                    {currentFrame.title}
                                </div>
                                <div className="text-xs text-slate-600">
                                    {currentFrame.detail}
                                </div>
                            </div>

                            {currentStep < frames.length - 1 ? (
                                <div className="space-y-2.5">
                                    <div className="text-xs font-medium text-slate-700">
                                        What happens on the very next execution step?
                                    </div>
                                    {[
                                        frames[currentStep + 1]?.title,
                                        frames[Math.max(0, currentStep - 1)]?.title ||
                                            'Reset all pointers to index 0 and terminate immediately',
                                        'Trigger an immediate memory overflow exception'
                                    ]
                                        .filter((v, i, a) => v && a.indexOf(v) === i)
                                        .map((optionText, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    setStepPredictionChoice(optionText);
                                                    const correct =
                                                        optionText ===
                                                        frames[currentStep + 1]?.title;
                                                    setStepPredictionFeedback(
                                                        correct
                                                            ? 'Correct! Advancing to the next step so you can see it in action.'
                                                            : `Not quite — the next deterministic step is: "${frames[currentStep + 1]?.title}".`
                                                    );
                                                    if (correct) {
                                                        setCurrentStep((s) =>
                                                            Math.min(frames.length - 1, s + 1)
                                                        );
                                                    }
                                                }}
                                                className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all ${
                                                    stepPredictionChoice === optionText
                                                        ? optionText ===
                                                          frames[currentStep + 1]?.title
                                                            ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                                                            : 'bg-rose-50 border-rose-300 text-rose-800'
                                                        : 'bg-white border-slate-200 hover:border-[#5899B5] text-slate-700'
                                                }`}
                                            >
                                                {optionText}
                                            </button>
                                        ))}

                                    {stepPredictionFeedback && (
                                        <div className="p-3 rounded-xl bg-[#5899B5]/10 border border-[#5899B5]/30 text-xs font-medium text-[#3D7690]">
                                            {stepPredictionFeedback}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-800">
                                    Animation is at the final frame. Click{' '}
                                    <button
                                        onClick={() => setCurrentStep(0)}
                                        className="underline font-semibold"
                                    >
                                        Restart to Step 1
                                    </button>{' '}
                                    to practice step-by-step prediction again!
                                </div>
                            )}
                        </div>

                        {/* Easy, Medium & Hard Mastery Challenges */}
                        <div className="lg:col-span-7 space-y-4">
                            {(activeTopic.practiceQuestions || []).map((q, qIdx) => {
                                const key = `${activeTopic.slug}-q-${qIdx}`;
                                const chosen = practiceAnswers[key];
                                const isAnswered = chosen !== undefined;
                                const isCorrect = chosen === q.answerIndex;

                                return (
                                    <div
                                        key={qIdx}
                                        className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="px-2.5 py-0.5 rounded-md bg-[#5899B5]/10 text-[#3D7690] border border-[#5899B5]/25 text-[11px] font-semibold uppercase">
                                                {q.level} Challenge
                                            </span>
                                            {isAnswered && (
                                                <span
                                                    className={`text-xs font-semibold ${
                                                        isCorrect
                                                            ? 'text-emerald-600'
                                                            : 'text-rose-600'
                                                    }`}
                                                >
                                                    {isCorrect
                                                        ? '✓ Correct Answer'
                                                        : '✗ Review Explanation'}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-sm font-semibold text-slate-900">
                                            {q.question}
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {(q.options || []).map((opt, oIdx) => {
                                                const selected = chosen === oIdx;
                                                return (
                                                    <button
                                                        key={oIdx}
                                                        onClick={() => {
                                                            setPracticeAnswers((prev) => ({
                                                                ...prev,
                                                                [key]: oIdx
                                                            }));
                                                            if (oIdx === q.answerIndex) {
                                                                recordTopicProgress(
                                                                    activeTopic.slug,
                                                                    'completed'
                                                                );
                                                            }
                                                        }}
                                                        className={`p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                                                            selected
                                                                ? oIdx === q.answerIndex
                                                                    ? 'bg-emerald-600 border-emerald-700 text-white'
                                                                    : 'bg-rose-600 border-rose-700 text-white'
                                                                : isAnswered &&
                                                                    oIdx === q.answerIndex
                                                                  ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                                                                  : 'bg-slate-50 border-slate-200 hover:border-[#5899B5] text-slate-700'
                                                        }`}
                                                    >
                                                        {opt}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        {isAnswered && (
                                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                                                <span className="text-[#3D7690]">
                                                    Explanation:{' '}
                                                </span>
                                                {q.explanation}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    /* ============================================================
                       LEARNING & INTERACTIVE VISUALIZER WORKSPACE
                       ============================================================ */
                    <>
                        {/* 1. CONTEXT-AWARE INTERACTIVE OPERATIONS BAR */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className="text-xs font-semibold uppercase tracking-wider text-[#3D7690] flex items-center gap-1.5">
                                    <Sliders className="w-3.5 h-3.5" /> Interactive Operations
                                    Panel ({activeTopic.title})
                                </span>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => {
                                            const sample = activeTopic.defaultSample || [
                                                15, 25, 35, 45, 55
                                            ];
                                            if (
                                                ['searching', 'sorting'].includes(
                                                    activeTopic.engineType
                                                )
                                            ) {
                                                setCustomArrayText(sample.join(', '));
                                                runFrames(
                                                    activeTopic.engineType === 'searching'
                                                        ? generateSearchingFrames(
                                                              activeTopic.subVariant,
                                                              sample,
                                                              Number(inputValue)
                                                          )
                                                        : generateSortingFrames(
                                                              activeTopic.subVariant,
                                                              sample,
                                                              sortOrder
                                                          )
                                                );
                                            } else if (
                                                [
                                                    'array',
                                                    'linked-list',
                                                    'stack',
                                                    'queue'
                                                ].includes(activeTopic.engineType)
                                            ) {
                                                setLinearItems([...sample]);
                                                const { frames: f } = generateLinearDsFrames(
                                                    activeTopic.engineType,
                                                    activeTopic.subVariant,
                                                    sample,
                                                    'load'
                                                );
                                                runFrames(f);
                                            } else if (activeTopic.engineType === 'graph') {
                                                setGraphState(DEFAULT_GRAPH_STATE);
                                                runFrames(
                                                    generateGraphFrames(
                                                        activeTopic.subVariant,
                                                        DEFAULT_GRAPH_STATE,
                                                        'A',
                                                        'F'
                                                    )
                                                );
                                            } else {
                                                setTreeData([...sample]);
                                                const { frames: f } =
                                                    generateTreeAndAdvancedFrames(
                                                        activeTopic.engineType,
                                                        activeTopic.subVariant,
                                                        sample,
                                                        'init'
                                                    );
                                                runFrames(f);
                                            }
                                        }}
                                        className="px-2.5 py-1 rounded-lg border border-slate-200 hover:border-[#5899B5] text-xs font-medium text-slate-600"
                                    >
                                        Load Sample
                                    </button>
                                    <button
                                        onClick={() => {
                                            const rand = Array.from({ length: 7 }, () =>
                                                Math.floor(Math.random() * 89) + 10
                                            );
                                            if (
                                                ['searching', 'sorting'].includes(
                                                    activeTopic.engineType
                                                )
                                            ) {
                                                setCustomArrayText(rand.join(', '));
                                                runFrames(
                                                    activeTopic.engineType === 'searching'
                                                        ? generateSearchingFrames(
                                                              activeTopic.subVariant,
                                                              rand,
                                                              rand[
                                                                  Math.floor(
                                                                      Math.random() *
                                                                          rand.length
                                                                  )
                                                              ]
                                                          )
                                                        : generateSortingFrames(
                                                              activeTopic.subVariant,
                                                              rand,
                                                              sortOrder
                                                          )
                                                );
                                            } else if (
                                                [
                                                    'array',
                                                    'linked-list',
                                                    'stack',
                                                    'queue'
                                                ].includes(activeTopic.engineType)
                                            ) {
                                                setLinearItems(rand.slice(0, 6));
                                                const { frames: f } = generateLinearDsFrames(
                                                    activeTopic.engineType,
                                                    activeTopic.subVariant,
                                                    rand.slice(0, 6),
                                                    'load'
                                                );
                                                runFrames(f);
                                            } else if (activeTopic.engineType === 'tree') {
                                                setTreeData(rand);
                                                const { frames: f } =
                                                    generateTreeAndAdvancedFrames(
                                                        'tree',
                                                        activeTopic.subVariant,
                                                        rand,
                                                        'init'
                                                    );
                                                runFrames(f);
                                            }
                                        }}
                                        className="px-2.5 py-1 rounded-lg border border-slate-200 hover:border-[#5899B5] text-xs font-medium text-slate-600 flex items-center gap-1"
                                    >
                                        <Shuffle className="w-3 h-3" /> Random Data
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (
                                                [
                                                    'array',
                                                    'linked-list',
                                                    'stack',
                                                    'queue'
                                                ].includes(activeTopic.engineType)
                                            ) {
                                                setLinearItems([]);
                                                const { frames: f } = generateLinearDsFrames(
                                                    activeTopic.engineType,
                                                    activeTopic.subVariant,
                                                    [],
                                                    'load'
                                                );
                                                runFrames(f);
                                            } else if (activeTopic.engineType === 'tree') {
                                                setTreeData([]);
                                                const { frames: f } =
                                                    generateTreeAndAdvancedFrames(
                                                        'tree',
                                                        activeTopic.subVariant,
                                                        [],
                                                        'init'
                                                    );
                                                runFrames(f);
                                            }
                                        }}
                                        className="px-2.5 py-1 rounded-lg border border-slate-200 hover:border-rose-300 text-xs font-medium text-rose-600"
                                    >
                                        Clear
                                    </button>
                                </div>
                            </div>

                            {/* Context-specific controls */}
                            <div className="flex flex-wrap items-center gap-2">
                                {/* SEARCHING CONTROLS */}
                                {activeTopic.engineType === 'searching' && (
                                    <>
                                        <input
                                            type="text"
                                            value={customArrayText}
                                            onChange={(e) =>
                                                setCustomArrayText(e.target.value)
                                            }
                                            placeholder="Comma-separated array"
                                            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono w-56"
                                        />
                                        <input
                                            type="number"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            placeholder="Target"
                                            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono w-24"
                                        />
                                        <button
                                            onClick={() => {
                                                const arr = parseCustomArray();
                                                const primary = generateSearchingFrames(
                                                    activeTopic.subVariant,
                                                    arr,
                                                    Number(inputValue)
                                                );
                                                const cmp = compareWithLinear
                                                    ? generateSearchingFrames(
                                                          activeTopic.subVariant === 'binary'
                                                              ? 'linear'
                                                              : 'binary',
                                                          arr,
                                                          Number(inputValue)
                                                      )
                                                    : null;
                                                runFrames(primary, cmp);
                                            }}
                                            className="px-3.5 py-1.5 rounded-xl bg-[#5899B5] hover:bg-[#3D7690] text-white text-xs font-semibold"
                                        >
                                            Run {activeTopic.title}
                                        </button>
                                        {['linear', 'binary'].includes(
                                            activeTopic.subVariant
                                        ) && (
                                            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 ml-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={compareWithLinear}
                                                    onChange={(e) =>
                                                        setCompareWithLinear(
                                                            e.target.checked
                                                        )
                                                    }
                                                />
                                                Compare Linear vs Binary on Same Input
                                            </label>
                                        )}
                                    </>
                                )}

                                {/* SORTING CONTROLS */}
                                {activeTopic.engineType === 'sorting' && (
                                    <>
                                        <input
                                            type="text"
                                            value={customArrayText}
                                            onChange={(e) =>
                                                setCustomArrayText(e.target.value)
                                            }
                                            placeholder="Custom array (e.g. 64, 34, 25, 12)"
                                            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono w-64"
                                        />
                                        <select
                                            value={sortOrder}
                                            onChange={(e) => setSortOrder(e.target.value)}
                                            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium"
                                        >
                                            <option value="asc">Ascending Order</option>
                                            <option value="desc">Descending Order</option>
                                        </select>
                                        <button
                                            onClick={() =>
                                                runFrames(
                                                    generateSortingFrames(
                                                        activeTopic.subVariant,
                                                        parseCustomArray(),
                                                        sortOrder
                                                    )
                                                )
                                            }
                                            className="px-3.5 py-1.5 rounded-xl bg-[#5899B5] hover:bg-[#3D7690] text-white text-xs font-semibold"
                                        >
                                            Sort Array
                                        </button>
                                    </>
                                )}

                                {/* ARRAY CONTROLS */}
                                {activeTopic.engineType === 'array' && (
                                    <>
                                        <input
                                            type="number"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            placeholder="Value"
                                            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono w-24"
                                        />
                                        <input
                                            type="number"
                                            value={secondInputValue}
                                            onChange={(e) =>
                                                setSecondInputValue(e.target.value)
                                            }
                                            placeholder="Index"
                                            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono w-20"
                                        />
                                        {[
                                            { label: 'Insert at Index', act: 'insert' },
                                            { label: 'Read Index', act: 'read' },
                                            { label: 'Update Index', act: 'update' },
                                            { label: 'Delete Index', act: 'delete' },
                                            { label: 'Search Value', act: 'search' }
                                        ].map((btn) => (
                                            <button
                                                key={btn.act}
                                                onClick={() => {
                                                    const { frames: f, nextItems } =
                                                        generateLinearDsFrames(
                                                            'array',
                                                            activeTopic.subVariant,
                                                            linearItems,
                                                            btn.act,
                                                            {
                                                                value: Number(inputValue),
                                                                index: Number(
                                                                    secondInputValue
                                                                )
                                                            }
                                                        );
                                                    setLinearItems(nextItems);
                                                    runFrames(f);
                                                }}
                                                className="px-3 py-1.5 rounded-xl bg-[#5899B5] hover:bg-[#3D7690] text-white text-xs font-medium"
                                            >
                                                {btn.label}
                                            </button>
                                        ))}
                                    </>
                                )}

                                {/* LINKED LIST CONTROLS */}
                                {activeTopic.engineType === 'linked-list' && (
                                    <>
                                        <input
                                            type="number"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            placeholder="Value"
                                            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono w-24"
                                        />
                                        <input
                                            type="number"
                                            value={secondInputValue}
                                            onChange={(e) =>
                                                setSecondInputValue(e.target.value)
                                            }
                                            placeholder="Pos"
                                            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono w-20"
                                        />
                                        {[
                                            { label: 'Insert Head', act: 'insertHead' },
                                            { label: 'Insert Tail', act: 'insertTail' },
                                            { label: 'Insert at Pos', act: 'insertPos' },
                                            { label: 'Delete Head', act: 'deleteHead' },
                                            { label: 'Delete Tail', act: 'deleteTail' },
                                            { label: 'Delete by Value', act: 'deleteVal' },
                                            { label: 'Delete at Pos', act: 'deletePos' },
                                            { label: 'Search', act: 'search' },
                                            { label: 'Reverse List', act: 'reverse' },
                                            { label: 'Traverse', act: 'traverse' }
                                        ].map((btn) => (
                                            <button
                                                key={btn.act}
                                                onClick={() => {
                                                    const { frames: f, nextItems } =
                                                        generateLinearDsFrames(
                                                            'linked-list',
                                                            activeTopic.subVariant,
                                                            linearItems,
                                                            btn.act,
                                                            {
                                                                value: Number(inputValue),
                                                                index: Number(
                                                                    secondInputValue
                                                                )
                                                            }
                                                        );
                                                    setLinearItems(nextItems);
                                                    runFrames(f);
                                                }}
                                                className="px-2.5 py-1.5 rounded-xl bg-[#5899B5] hover:bg-[#3D7690] text-white text-xs font-medium"
                                            >
                                                {btn.label}
                                            </button>
                                        ))}
                                    </>
                                )}

                                {/* STACK CONTROLS */}
                                {activeTopic.engineType === 'stack' && (
                                    <>
                                        <input
                                            type="number"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            placeholder="Value"
                                            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono w-24"
                                        />
                                        {[
                                            { label: 'Push', act: 'push' },
                                            { label: 'Pop', act: 'pop' },
                                            { label: 'Peek Top', act: 'peek' },
                                            { label: 'Search', act: 'search' }
                                        ].map((btn) => (
                                            <button
                                                key={btn.act}
                                                onClick={() => {
                                                    const { frames: f, nextItems } =
                                                        generateLinearDsFrames(
                                                            'stack',
                                                            'lifo',
                                                            linearItems,
                                                            btn.act,
                                                            { value: Number(inputValue) }
                                                        );
                                                    setLinearItems(nextItems);
                                                    runFrames(f);
                                                }}
                                                className="px-3.5 py-1.5 rounded-xl bg-[#5899B5] hover:bg-[#3D7690] text-white text-xs font-medium"
                                            >
                                                {btn.label}
                                            </button>
                                        ))}
                                    </>
                                )}

                                {/* QUEUE CONTROLS */}
                                {activeTopic.engineType === 'queue' && (
                                    <>
                                        <input
                                            type="number"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            placeholder="Value"
                                            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono w-24"
                                        />
                                        {(activeTopic.subVariant === 'deque'
                                            ? [
                                                  { label: 'Push Front', act: 'pushFront' },
                                                  { label: 'Push Rear', act: 'pushRear' },
                                                  { label: 'Pop Front', act: 'popFront' },
                                                  { label: 'Pop Rear', act: 'popRear' },
                                                  { label: 'Front', act: 'front' },
                                                  { label: 'Rear', act: 'rear' }
                                              ]
                                            : [
                                                  { label: 'Enqueue', act: 'enqueue' },
                                                  { label: 'Dequeue', act: 'dequeue' },
                                                  { label: 'Peek Front', act: 'front' },
                                                  { label: 'Peek Rear', act: 'rear' }
                                              ]
                                        ).map((btn) => (
                                            <button
                                                key={btn.act}
                                                onClick={() => {
                                                    const { frames: f, nextItems } =
                                                        generateLinearDsFrames(
                                                            'queue',
                                                            activeTopic.subVariant,
                                                            linearItems,
                                                            btn.act,
                                                            { value: Number(inputValue) }
                                                        );
                                                    setLinearItems(nextItems);
                                                    runFrames(f);
                                                }}
                                                className="px-3 py-1.5 rounded-xl bg-[#5899B5] hover:bg-[#3D7690] text-white text-xs font-medium"
                                            >
                                                {btn.label}
                                            </button>
                                        ))}
                                    </>
                                )}

                                {/* TREE / TRIE / HASH / DSU / ADVANCED CONTROLS */}
                                {[
                                    'tree',
                                    'trie',
                                    'hash-table',
                                    'dsu',
                                    'segment-tree',
                                    'fenwick-tree',
                                    'btree'
                                ].includes(activeTopic.engineType) && (
                                    <>
                                        <input
                                            type="text"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            placeholder={
                                                activeTopic.engineType === 'trie'
                                                    ? 'WORD'
                                                    : 'Key / Val'
                                            }
                                            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono w-28"
                                        />
                                        {['dsu', 'tree', 'segment-tree', 'fenwick-tree'].includes(
                                            activeTopic.engineType
                                        ) && (
                                            <input
                                                type="number"
                                                value={secondInputValue}
                                                onChange={(e) =>
                                                    setSecondInputValue(e.target.value)
                                                }
                                                placeholder="2nd Key / Right"
                                                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono w-24"
                                            />
                                        )}

                                        {(activeTopic.engineType === 'tree'
                                            ? [
                                                  { label: 'Insert', act: 'insert' },
                                                  { label: 'Search', act: 'search' },
                                                  { label: 'Delete', act: 'delete' },
                                                  { label: 'Inorder', act: 'inorder' },
                                                  { label: 'Preorder', act: 'preorder' },
                                                  { label: 'Postorder', act: 'postorder' },
                                                  { label: 'Level-Order', act: 'levelorder' },
                                                  { label: 'Min & Max', act: 'minmax' },
                                                  { label: 'Height & BF', act: 'height' },
                                                  { label: 'Find LCA(p,q)', act: 'lca' }
                                              ]
                                            : activeTopic.engineType === 'trie'
                                              ? [
                                                    { label: 'Insert Word', act: 'insert' },
                                                    { label: 'Search Word', act: 'search' },
                                                    { label: 'Check Prefix', act: 'prefix' },
                                                    { label: 'Delete Word', act: 'delete' }
                                                ]
                                              : activeTopic.engineType === 'hash-table'
                                                ? [
                                                      { label: 'Insert Key', act: 'insert' },
                                                      { label: 'Lookup Key', act: 'search' },
                                                      { label: 'Delete Key', act: 'delete' }
                                                  ]
                                                : activeTopic.engineType === 'dsu'
                                                  ? [
                                                        {
                                                            label: 'Union(a, b)',
                                                            act: 'union'
                                                        },
                                                        {
                                                            label: 'Find(a) + Compress',
                                                            act: 'find'
                                                        }
                                                    ]
                                                  : [
                                                        {
                                                            label: 'Range Query [L..R]',
                                                            act: 'query'
                                                        },
                                                        {
                                                            label: 'Point Update / Insert',
                                                            act: 'update'
                                                        }
                                                    ]
                                        ).map((btn) => (
                                            <button
                                                key={btn.act}
                                                onClick={() => {
                                                    const { frames: f, nextData } =
                                                        generateTreeAndAdvancedFrames(
                                                            activeTopic.engineType,
                                                            activeTopic.subVariant,
                                                            treeData,
                                                            btn.act,
                                                            {
                                                                value: Number(inputValue),
                                                                secondValue: Number(
                                                                    secondInputValue
                                                                ),
                                                                text: inputValue,
                                                                index: Number(
                                                                    secondInputValue
                                                                ),
                                                                left: Number(inputValue),
                                                                right: Number(
                                                                    secondInputValue
                                                                )
                                                            }
                                                        );
                                                    setTreeData(nextData);
                                                    runFrames(f);
                                                }}
                                                className="px-2.5 py-1.5 rounded-xl bg-[#5899B5] hover:bg-[#3D7690] text-white text-xs font-medium"
                                            >
                                                {btn.label}
                                            </button>
                                        ))}
                                    </>
                                )}

                                {/* GRAPH CONTROLS */}
                                {activeTopic.engineType === 'graph' && (
                                    <>
                                        <select
                                            value={edgeFrom}
                                            onChange={(e) => setEdgeFrom(e.target.value)}
                                            className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-mono font-medium"
                                        >
                                            {graphState.vertices.map((v) => (
                                                <option key={v.id} value={v.id}>
                                                    From / Start: {v.id}
                                                </option>
                                            ))}
                                        </select>
                                        <select
                                            value={edgeTo}
                                            onChange={(e) => setEdgeTo(e.target.value)}
                                            className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-mono font-medium"
                                        >
                                            {graphState.vertices.map((v) => (
                                                <option key={v.id} value={v.id}>
                                                    To / Target: {v.id}
                                                </option>
                                            ))}
                                        </select>
                                        <input
                                            type="number"
                                            value={edgeWeight}
                                            onChange={(e) => setEdgeWeight(e.target.value)}
                                            placeholder="Weight"
                                            className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-mono w-20"
                                        />
                                        <button
                                            onClick={() =>
                                                runFrames(
                                                    generateGraphFrames(
                                                        activeTopic.subVariant,
                                                        graphState,
                                                        edgeFrom,
                                                        edgeTo
                                                    )
                                                )
                                            }
                                            className="px-3.5 py-1.5 rounded-xl bg-[#5899B5] hover:bg-[#3D7690] text-white text-xs font-semibold"
                                        >
                                            Run {activeTopic.title}
                                        </button>
                                        <button
                                            onClick={() => {
                                                const nextChar = String.fromCharCode(
                                                    65 + graphState.vertices.length
                                                );
                                                if (graphState.vertices.length >= 9) return;
                                                const updated = {
                                                    ...graphState,
                                                    vertices: [
                                                        ...graphState.vertices,
                                                        {
                                                            id: nextChar,
                                                            x:
                                                                120 +
                                                                ((graphState.vertices
                                                                    .length *
                                                                    95) %
                                                                    520),
                                                            y:
                                                                70 +
                                                                ((graphState.vertices
                                                                    .length *
                                                                    65) %
                                                                    170)
                                                        }
                                                    ]
                                                };
                                                setGraphState(updated);
                                            }}
                                            className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-[#5899B5] text-xs font-medium text-slate-700"
                                        >
                                            + Vertex
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (edgeFrom === edgeTo) return;
                                                const exists = graphState.edges.some(
                                                    (e) =>
                                                        e.from === edgeFrom &&
                                                        e.to === edgeTo
                                                );
                                                const nextEdges = exists
                                                    ? graphState.edges.map((e) =>
                                                          e.from === edgeFrom &&
                                                          e.to === edgeTo
                                                              ? {
                                                                    ...e,
                                                                    weight: Number(
                                                                        edgeWeight
                                                                    )
                                                                }
                                                              : e
                                                      )
                                                    : [
                                                          ...graphState.edges,
                                                          {
                                                              from: edgeFrom,
                                                              to: edgeTo,
                                                              weight: Number(edgeWeight)
                                                          }
                                                      ];
                                                const updated = {
                                                    ...graphState,
                                                    edges: nextEdges
                                                };
                                                setGraphState(updated);
                                                runFrames(
                                                    generateGraphFrames(
                                                        activeTopic.subVariant,
                                                        updated,
                                                        edgeFrom,
                                                        edgeTo
                                                    )
                                                );
                                            }}
                                            className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-[#5899B5] text-xs font-medium text-slate-700"
                                        >
                                            Add / Update Edge
                                        </button>
                                        <button
                                            onClick={() => {
                                                const updated = {
                                                    ...graphState,
                                                    directed: !graphState.directed
                                                };
                                                setGraphState(updated);
                                                runFrames(
                                                    generateGraphFrames(
                                                        activeTopic.subVariant,
                                                        updated,
                                                        edgeFrom,
                                                        edgeTo
                                                    )
                                                );
                                            }}
                                            className="px-2.5 py-1.5 rounded-xl border border-[#5899B5]/40 bg-[#5899B5]/10 text-[#3D7690] text-xs font-medium"
                                        >
                                            {graphState.directed
                                                ? 'Directed Graph'
                                                : 'Undirected Graph'}
                                        </button>
                                    </>
                                )}

                                {/* RECURSION / BACKTRACKING / DP CONTROLS */}
                                {['recursion', 'backtracking', 'dp'].includes(
                                    activeTopic.engineType
                                ) && (
                                    <>
                                        {activeTopic.engineType === 'recursion' && (
                                            <input
                                                type="number"
                                                min="1"
                                                max="6"
                                                value={secondInputValue}
                                                onChange={(e) =>
                                                    setSecondInputValue(e.target.value)
                                                }
                                                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono w-20"
                                            />
                                        )}
                                        {activeTopic.engineType === 'dp' && (
                                            <select
                                                value={dpMode}
                                                onChange={(e) => setDpMode(e.target.value)}
                                                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium"
                                            >
                                                <option value="Tabulation (Bottom-Up)">
                                                    Tabulation (Bottom-Up DP)
                                                </option>
                                                <option value="Memoization (Top-Down)">
                                                    Memoization (Top-Down Cache)
                                                </option>
                                            </select>
                                        )}
                                        <button
                                            onClick={() =>
                                                runFrames(
                                                    generateAlgorithmFrames(
                                                        activeTopic.engineType,
                                                        activeTopic.subVariant,
                                                        {
                                                            n: Number(secondInputValue),
                                                            dpMode
                                                        }
                                                    )
                                                )
                                            }
                                            className="px-3.5 py-1.5 rounded-xl bg-[#5899B5] hover:bg-[#3D7690] text-white text-xs font-semibold"
                                        >
                                            Execute {activeTopic.title}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* 2. MAIN VISUALIZER CANVAS + SYNCHRONIZED PSEUDOCODE/CODE TRACE */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                            {/* Left 7 Cols: Interactive Animation Canvas + Transport Control Panel */}
                            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs flex flex-col justify-between space-y-4">
                                {/* Current Step Explanation Banner & Error Alert */}
                                <div className="space-y-2">
                                    {currentFrame.error && (
                                        <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-medium flex items-center gap-2">
                                            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                                            <span>{currentFrame.error}</span>
                                        </div>
                                    )}
                                    <div className="p-3.5 rounded-xl bg-[#5899B5]/10 border border-[#5899B5]/25 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                        <div>
                                            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#3D7690]">
                                                Step {currentStep + 1} of{' '}
                                                {Math.max(1, frames.length)} —{' '}
                                                {currentFrame.title || 'Ready'}
                                            </div>
                                            <div className="text-xs text-slate-700 mt-0.5">
                                                {currentFrame.detail}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            {Object.entries(
                                                currentFrame.metrics || {}
                                            ).map(([k, v]) => (
                                                <span
                                                    key={k}
                                                    className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-mono"
                                                >
                                                    <span className="text-slate-400">
                                                        {k}:{' '}
                                                    </span>
                                                    <span className="font-semibold text-[#3D7690]">
                                                        {v}
                                                    </span>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Dynamic Multi-Engine Canvas */}
                                <div className="min-h-[260px] flex flex-col justify-center">
                                    {['searching', 'segment-tree', 'fenwick-tree', 'btree'].includes(
                                        activeTopic.engineType
                                    ) ? (
                                        <SearchingOrRangeCanvas
                                            frame={currentFrame}
                                            topic={activeTopic}
                                            comparisonFrames={comparisonFrames}
                                            currentStep={currentStep}
                                        />
                                    ) : activeTopic.engineType === 'sorting' ? (
                                        <SortingCanvas frame={currentFrame} />
                                    ) : [
                                          'array',
                                          'linked-list',
                                          'stack',
                                          'queue'
                                      ].includes(activeTopic.engineType) ? (
                                        <LinearDsCanvas
                                            frame={currentFrame}
                                            topic={activeTopic}
                                        />
                                    ) : ['tree', 'trie', 'hash-table', 'dsu'].includes(
                                          activeTopic.engineType
                                      ) ? (
                                        <TreeAndNonLinearCanvas
                                            frame={currentFrame}
                                            topic={activeTopic}
                                        />
                                    ) : activeTopic.engineType === 'graph' ? (
                                        <GraphCanvas
                                            frame={currentFrame}
                                            graphState={graphState}
                                            setGraphState={setGraphState}
                                        />
                                    ) : (
                                        <AlgorithmParadigmCanvas frame={currentFrame} />
                                    )}
                                </div>

                                {/* Complete Animation Control Panel */}
                                <div className="pt-3 border-t border-slate-200 space-y-3">
                                    {/* Scrubber Slider */}
                                    <div className="flex items-center gap-3">
                                        <span className="text-[11px] font-mono font-medium text-slate-500">
                                            Frame {currentStep + 1}/{Math.max(1, frames.length)}
                                        </span>
                                        <input
                                            type="range"
                                            min="0"
                                            max={Math.max(0, frames.length - 1)}
                                            value={currentStep}
                                            onChange={(e) => {
                                                setIsPlaying(false);
                                                setCurrentStep(Number(e.target.value));
                                            }}
                                            className="flex-1 accent-[#5899B5]"
                                        />
                                    </div>

                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        {/* Transport Buttons: Restart, Prev Step, Play/Pause/Resume, Next Step */}
                                        <div className="flex items-center gap-1.5">
                                            <button
                                                onClick={() => {
                                                    setIsPlaying(false);
                                                    setCurrentStep(0);
                                                }}
                                                className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-[#5899B5] text-xs font-medium text-slate-700 flex items-center gap-1"
                                                title="Restart from Step 1"
                                            >
                                                <RotateCcw className="w-3.5 h-3.5" /> Restart
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setIsPlaying(false);
                                                    setCurrentStep((s) => Math.max(0, s - 1));
                                                }}
                                                disabled={currentStep <= 0}
                                                className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-[#5899B5] disabled:opacity-40 text-xs font-medium text-slate-700 flex items-center gap-1"
                                                title="Restore Exact Previous Step State"
                                            >
                                                <SkipBack className="w-3.5 h-3.5" /> Prev Step
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (
                                                        !isPlaying &&
                                                        currentStep >= frames.length - 1
                                                    ) {
                                                        setCurrentStep(0);
                                                    }
                                                    setIsPlaying((p) => !p);
                                                }}
                                                className="px-4 py-1.5 rounded-xl bg-[#5899B5] hover:bg-[#3D7690] text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
                                            >
                                                {isPlaying ? (
                                                    <>
                                                        <Pause className="w-3.5 h-3.5" /> Pause
                                                    </>
                                                ) : (
                                                    <>
                                                        <Play className="w-3.5 h-3.5" />{' '}
                                                        {currentStep > 0 &&
                                                        currentStep < frames.length - 1
                                                            ? 'Resume'
                                                            : 'Play'}
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setIsPlaying(false);
                                                    setCurrentStep((s) =>
                                                        Math.min(frames.length - 1, s + 1)
                                                    );
                                                }}
                                                disabled={currentStep >= frames.length - 1}
                                                className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-[#5899B5] disabled:opacity-40 text-xs font-medium text-slate-700 flex items-center gap-1"
                                                title="Advance to Next Step"
                                            >
                                                Next Step <SkipForward className="w-3.5 h-3.5" />
                                            </button>
                                        </div>

                                        {/* Speed Multiplier (0.5x, 1x, 1.5x, 2x, 3x) & Step vs Auto Mode */}
                                        <div className="flex items-center gap-1.5">
                                            {[0.5, 1, 1.5, 2, 3].map((spd) => (
                                                <button
                                                    key={spd}
                                                    onClick={() => setSpeedMultiplier(spd)}
                                                    className={`px-2 py-1 rounded-lg text-[11px] font-mono font-semibold border ${
                                                        speedMultiplier === spd
                                                            ? 'bg-[#5899B5] text-white border-[#3D7690]'
                                                            : 'bg-slate-50 text-slate-600 border-slate-200'
                                                    }`}
                                                >
                                                    {spd}x
                                                </button>
                                            ))}
                                            <button
                                                onClick={() =>
                                                    setExecutionMode((m) =>
                                                        m === 'auto' ? 'step' : 'auto'
                                                    )
                                                }
                                                className="px-2.5 py-1 rounded-lg border border-slate-200 text-[11px] font-medium text-[#3D7690] bg-[#5899B5]/10"
                                            >
                                                {executionMode === 'auto'
                                                    ? 'Auto Mode'
                                                    : 'Step Mode'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right 5 Cols: Synchronized Pseudocode, Live Variable Watch & 5-Language Code */}
                            <div className="lg:col-span-5 space-y-4">
                                {/* Synchronized Pseudocode & Variable Watch */}
                                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold uppercase tracking-wider text-[#3D7690] flex items-center gap-1.5">
                                            <Terminal className="w-3.5 h-3.5" /> Synchronized
                                            Pseudocode Trace
                                        </span>
                                        <span className="text-[11px] font-mono text-slate-400">
                                            Active Line #{(currentFrame.pseudoLine ?? 0) + 1}
                                        </span>
                                    </div>
                                    <div className="bg-slate-900 rounded-xl p-3 font-mono text-xs space-y-1">
                                        {(activeTopic.pseudocode || []).map((line, lIdx) => {
                                            const isCurrent =
                                                (currentFrame.pseudoLine ?? 0) === lIdx;
                                            return (
                                                <div
                                                    key={lIdx}
                                                    className={`px-2.5 py-1 rounded flex items-center gap-2 transition-all ${
                                                        isCurrent
                                                            ? 'bg-[#5899B5] text-white font-semibold'
                                                            : 'text-slate-300'
                                                    }`}
                                                >
                                                    <span className="text-[10px] opacity-60 w-4">
                                                        {lIdx + 1}
                                                    </span>
                                                    <span className="flex-1">{line}</span>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Live Intermediate Variables Inspector */}
                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                        {Object.entries(currentFrame.vars || {}).map(
                                            ([k, v]) => (
                                                <div
                                                    key={k}
                                                    className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-mono"
                                                >
                                                    <span className="text-slate-500">
                                                        {k} ={' '}
                                                    </span>
                                                    <span className="font-semibold text-[#3D7690]">
                                                        {String(v)}
                                                    </span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>

                                {/* 5-Language Code Implementation View (C, C++, Java, Python, JS) */}
                                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <div className="flex items-center gap-1">
                                            {[
                                                { id: 'c', label: 'C' },
                                                { id: 'cpp', label: 'C++' },
                                                { id: 'java', label: 'Java' },
                                                { id: 'python', label: 'Python' },
                                                { id: 'javascript', label: 'JS' }
                                            ].map((lang) => (
                                                <button
                                                    key={lang.id}
                                                    onClick={() =>
                                                        setSelectedCodeLang(lang.id)
                                                    }
                                                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                                                        selectedCodeLang === lang.id
                                                            ? 'bg-[#5899B5] text-white'
                                                            : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                                                    }`}
                                                >
                                                    {lang.label}
                                                </button>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(codeText);
                                                setCopiedCode(true);
                                                setTimeout(() => setCopiedCode(false), 1500);
                                            }}
                                            className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 flex items-center gap-1"
                                        >
                                            {copiedCode ? (
                                                <>
                                                    <Check className="w-3.5 h-3.5 text-emerald-600" />{' '}
                                                    Copied
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-3.5 h-3.5" /> Copy
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    <pre className="bg-slate-900 text-slate-100 rounded-xl p-3.5 text-xs font-mono overflow-x-auto max-h-60 leading-relaxed">
                                        <code>{codeText}</code>
                                    </pre>
                                </div>
                            </div>
                        </div>

                        {/* 3. CONCEPT OVERVIEW & TIME/SPACE COMPLEXITY DEEP-DIVE CARDS */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                            {/* Time & Space Complexity Matrix */}
                            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
                                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                                    <BarChart3 className="w-4 h-4 text-[#5899B5]" /> Time &
                                    Space Complexity Analysis
                                </h3>
                                <div className="grid grid-cols-2 gap-2.5">
                                    {[
                                        {
                                            label: 'Best Case Time',
                                            val: activeTopic.complexity?.timeBest
                                        },
                                        {
                                            label: 'Average Case Time',
                                            val: activeTopic.complexity?.timeAvg
                                        },
                                        {
                                            label: 'Worst Case Time',
                                            val: activeTopic.complexity?.timeWorst
                                        },
                                        {
                                            label: 'Auxiliary Space',
                                            val: activeTopic.complexity?.space
                                        }
                                    ].map((item) => (
                                        <div
                                            key={item.label}
                                            className="p-3 rounded-xl bg-slate-50 border border-slate-200"
                                        >
                                            <div className="text-[11px] font-medium text-slate-500">
                                                {item.label}
                                            </div>
                                            <div className="text-base font-semibold font-mono text-[#3D7690] mt-0.5">
                                                {item.val}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-3.5 rounded-xl bg-[#5899B5]/10 border border-[#5899B5]/25 text-xs text-slate-700 leading-relaxed">
                                    <span className="text-[#3D7690]">
                                        Why this complexity?{' '}
                                    </span>
                                    {activeTopic.complexity?.explanation}
                                </div>
                            </div>

                            {/* Architectural Concept Overview */}
                            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                                    <Lightbulb className="w-4 h-4 text-[#5899B5]" /> Concept
                                    Architecture & Real-World Engineering Guide
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                                        <div className="font-semibold text-[#3D7690]">
                                            What It Is & Why It Is Used
                                        </div>
                                        <p className="text-slate-600 leading-relaxed">
                                            {activeTopic.overview?.what} —{' '}
                                            {activeTopic.overview?.why}
                                        </p>
                                    </div>
                                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                                        <div className="font-semibold text-[#3D7690]">
                                            How It Organizes & Stores Data
                                        </div>
                                        <p className="text-slate-600 leading-relaxed">
                                            {activeTopic.overview?.howItStores}
                                        </p>
                                    </div>
                                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                                        <div className="font-semibold text-emerald-700">
                                            Key Advantages
                                        </div>
                                        <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                                            {(activeTopic.overview?.advantages || []).map(
                                                (a, i) => (
                                                    <li key={i}>{a}</li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                                        <div className="font-semibold text-amber-700">
                                            Limitations & Trade-offs
                                        </div>
                                        <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                                            {(activeTopic.overview?.limitations || []).map(
                                                (l, i) => (
                                                    <li key={i}>{l}</li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                                    <div className="flex flex-wrap items-center gap-1.5">
                                        <span className="font-medium text-slate-500">
                                            Real-World Applications:
                                        </span>
                                        {(activeTopic.overview?.realWorld || []).map(
                                            (rw, i) => (
                                                <span
                                                    key={i}
                                                    className="px-2.5 py-1 rounded-lg bg-[#5899B5]/10 text-[#3D7690] font-medium"
                                                >
                                                    {rw}
                                                </span>
                                            )
                                        )}
                                    </div>
                                    <div className="text-slate-600">
                                        <span className="text-[#3D7690]">
                                            When to choose:{' '}
                                        </span>
                                        {activeTopic.overview?.whenToUse}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        );
    }

    /* ========================================================================
       RENDER 2: MAIN ALGOPLAY DASHBOARD
       ======================================================================== */
    return (
        <div className="space-y-6 pb-10">
            {/* Hero Header Banner */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                    <div className="space-y-2 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5899B5]/10 border border-[#5899B5]/25 text-[#3D7690] text-xs font-semibold">
                            <Cpu className="w-3.5 h-3.5" /> AlgoPlay Interactive Data
                            Visualiser & Algorithm Simulation Lab
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
                            Master Data Structures & Algorithms Visually
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                            Explore 66 interactive, deterministic step-by-step visualizers
                            across Linear & Non-Linear Data Structures, Advanced Trees,
                            Searching, Sorting, Graph Algorithms, Recursion, Backtracking, and
                            Dynamic Programming.
                        </p>
                    </div>

                    {/* Progress KPI Cards */}
                    <div className="grid grid-cols-3 gap-3 shrink-0">
                        <div className="p-3.5 rounded-xl bg-[#5899B5]/10 border border-[#5899B5]/25 text-center">
                            <div className="text-xl font-semibold text-[#3D7690]">
                                {dashboardStats.completed}
                            </div>
                            <div className="text-[11px] font-medium text-slate-600">
                                Completed
                            </div>
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                            <div className="text-xl font-semibold text-slate-800">
                                {dashboardStats.inProgress}
                            </div>
                            <div className="text-[11px] font-medium text-slate-600">
                                In Progress
                            </div>
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                            <div className="text-xl font-semibold text-slate-500">
                                {dashboardStats.notExplored}
                            </div>
                            <div className="text-[11px] font-medium text-slate-500">
                                Not Explored
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Reference Toggle Buttons (Big-O Guide & Sorting Comparison Table) */}
                <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-4 border-t border-slate-100">
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            onClick={() =>
                                setActiveDashboardRefTab((t) =>
                                    t === 'bigo' ? 'none' : 'bigo'
                                )
                            }
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                                activeDashboardRefTab === 'bigo'
                                    ? 'bg-[#5899B5] text-white border-[#3D7690]'
                                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-[#5899B5]'
                            }`}
                        >
                            Big-O Complexity Reference Chart
                        </button>
                        <button
                            onClick={() =>
                                setActiveDashboardRefTab((t) =>
                                    t === 'sorting' ? 'none' : 'sorting'
                                )
                            }
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                                activeDashboardRefTab === 'sorting'
                                    ? 'bg-[#5899B5] text-white border-[#3D7690]'
                                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-[#5899B5]'
                            }`}
                        >
                            Sorting Algorithms Comparison Matrix
                        </button>
                    </div>

                    {/* Search Box */}
                    <div className="relative w-full sm:w-80">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search 66 data structures & algorithms..."
                            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#5899B5]"
                        />
                    </div>
                </div>

                {/* Collapsible Big-O Reference Chart */}
                {activeDashboardRefTab === 'bigo' && (
                    <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 overflow-x-auto">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#3D7690] mb-3">
                            Asymptotic Time & Space Complexity Growth Reference
                        </h3>
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 text-slate-500">
                                    <th className="py-2 px-3">Notation</th>
                                    <th className="py-2 px-3">Class</th>
                                    <th className="py-2 px-3">Operations at n=1,000</th>
                                    <th className="py-2 px-3">Canonical Examples</th>
                                    <th className="py-2 px-3">Scalability Rating</th>
                                </tr>
                            </thead>
                            <tbody>
                                {BIG_O_REFERENCE_TABLE.map((row) => (
                                    <tr
                                        key={row.notation}
                                        className="border-b border-slate-200/60"
                                    >
                                        <td className="py-2 px-3 font-mono font-semibold text-[#3D7690]">
                                            {row.notation}
                                        </td>
                                        <td className="py-2 px-3 font-medium text-slate-800">
                                            {row.name}
                                        </td>
                                        <td className="py-2 px-3 font-mono text-slate-600">
                                            {row.opsAtN1000}
                                        </td>
                                        <td className="py-2 px-3 text-slate-600">
                                            {row.example}
                                        </td>
                                        <td className="py-2 px-3 font-medium text-[#3D7690]">
                                            {row.rating}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Collapsible Sorting Comparison Table */}
                {activeDashboardRefTab === 'sorting' && (
                    <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 overflow-x-auto">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#3D7690] mb-3">
                            Sorting Algorithms Master Comparison Matrix
                        </h3>
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 text-slate-500">
                                    <th className="py-2 px-3">Algorithm</th>
                                    <th className="py-2 px-3">Best Time</th>
                                    <th className="py-2 px-3">Average Time</th>
                                    <th className="py-2 px-3">Worst Time</th>
                                    <th className="py-2 px-3">Space</th>
                                    <th className="py-2 px-3">Stable?</th>
                                    <th className="py-2 px-3">In-Place?</th>
                                </tr>
                            </thead>
                            <tbody>
                                {SORTING_COMPARISON_TABLE.map((row) => (
                                    <tr
                                        key={row.name}
                                        className="border-b border-slate-200/60"
                                    >
                                        <td className="py-2 px-3 font-semibold text-slate-800">
                                            {row.name}
                                        </td>
                                        <td className="py-2 px-3 font-mono text-[#3D7690]">
                                            {row.best}
                                        </td>
                                        <td className="py-2 px-3 font-mono text-[#3D7690]">
                                            {row.avg}
                                        </td>
                                        <td className="py-2 px-3 font-mono text-slate-700">
                                            {row.worst}
                                        </td>
                                        <td className="py-2 px-3 font-mono text-slate-600">
                                            {row.space}
                                        </td>
                                        <td className="py-2 px-3 font-medium">
                                            {row.stable}
                                        </td>
                                        <td className="py-2 px-3 font-medium">
                                            {row.inPlace}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Recently Visited (Last 3) & Recommended Learning Sequence Strip */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Last 3 Visited Algorithms Card */}
                <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="text-xs font-semibold uppercase tracking-wider text-[#3D7690] flex items-center gap-1.5">
                            <History className="w-3.5 h-3.5" /> Last Visited Algorithms (Quick Resume)
                        </div>
                        <span className="text-[10px] font-medium text-slate-400">
                            Stores last {Math.min(3, recentSlugs.length)} / 3 visited
                        </span>
                    </div>
                    {recentSlugs.length === 0 ? (
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-xs text-slate-500">
                            Open any algorithm visualizer below — your last 3 visited algorithms will appear here with their icon and complexity for instant resume.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            {recentSlugs.slice(0, 3).map((slug, rIdx) => {
                                const t = topics.find((item) => item.slug === slug);
                                if (!t) return null;
                                const cMeta = getComplexityMeta(t.complexity?.timeAvg);
                                return (
                                    <button
                                        key={slug}
                                        onClick={() => {
                                            setActiveTopicSlug(slug);
                                            recordTopicProgress(slug, 'in-progress');
                                        }}
                                        className="group p-3 rounded-xl border border-slate-200 hover:border-[#5899B5] bg-slate-50/60 hover:bg-white text-left transition-all flex flex-col justify-between gap-2"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <AlgoTopicIcon topic={t} size="sm" />
                                            <div className="min-w-0 flex-1">
                                                <div className="text-[10px] font-medium text-slate-400 truncate">
                                                    #{rIdx + 1} • {getDirectAlgorithmTypeLabel(t)}
                                                </div>
                                                <div className="text-xs font-semibold text-slate-900 group-hover:text-[#3D7690] truncate">
                                                    {t.title}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between gap-1 pt-1.5 border-t border-slate-200/70">
                                            <span
                                                className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold border ${cMeta.badgeClass}`}
                                            >
                                                <span className={`w-1.5 h-1.5 rounded-full ${cMeta.dotClass}`} />
                                                {cMeta.notation}
                                            </span>
                                            <span className="text-[10px] font-medium text-[#3D7690] flex items-center gap-0.5">
                                                Resume <ArrowRight className="w-3 h-3" />
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Recommended Learning Sequence */}
                <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#3D7690] flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> Recommended Step-by-Step DSA Learning Path
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {[
                            'arrays',
                            'singly-linked-list',
                            'stacks',
                            'queues',
                            'binary-search',
                            'merge-sort',
                            'binary-search-trees',
                            'bfs',
                            'dijkstra',
                            'dynamic-programming'
                        ].map((slug, idx) => {
                            const t = topics.find((item) => item.slug === slug);
                            if (!t) return null;
                            const cMeta = getComplexityMeta(t.complexity?.timeAvg);
                            return (
                                <button
                                    key={slug}
                                    onClick={() => {
                                        setActiveTopicSlug(slug);
                                        recordTopicProgress(slug, 'in-progress');
                                    }}
                                    className="px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-[#5899B5] text-slate-700 hover:text-white border border-slate-200 text-xs font-medium transition-all flex items-center gap-1.5"
                                >
                                    <span>
                                        {idx + 1}. {t.title}
                                    </span>
                                    <span className="text-[10px] font-mono opacity-75">
                                        ({cMeta.notation})
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Category Filter Tabs + View Mode Switcher (Default / Grid / List View) */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200">
                <div className="flex flex-wrap items-center gap-1.5">
                    {ALGOPLAY_CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                                selectedCategory === cat.id
                                    ? 'bg-[#5899B5] text-white border-[#3D7690] shadow-2xs'
                                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-[#5899B5]'
                            }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* User View Switcher: Default View | Grid View | List View */}
                <div className="flex items-center gap-1.5 shrink-0 self-end md:self-auto">
                    <span className="text-[11px] font-medium text-slate-400 mr-1">
                        View Layout:
                    </span>
                    <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                        {[
                            { id: 'default', label: 'Default View', icon: Columns },
                            { id: 'grid', label: 'Grid View', icon: LayoutGrid },
                            { id: 'list', label: 'List View', icon: List }
                        ].map((v) => {
                            const IconComp = v.icon;
                            const isActive = viewLayout === v.id;
                            return (
                                <button
                                    key={v.id}
                                    onClick={() => handleChangeViewLayout(v.id)}
                                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                                        isActive
                                            ? 'bg-[#5899B5] text-white shadow-2xs'
                                            : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                    title={v.label}
                                >
                                    <IconComp className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">{v.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* 66 Topic Cards Rendered in User's Chosen View (Default View / Compact Grid View / Detailed List View) */}
            <div
                className={
                    viewLayout === 'list'
                        ? 'space-y-3'
                        : viewLayout === 'grid'
                          ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5'
                          : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                }
            >
                {visibleTopics.map((topic) => {
                    const st = progressMap[topic.slug]?.status || 'not-explored';
                    const isHidden =
                        topic.isPublished === false || topic.isEnabled === false;
                    const avgMeta = getComplexityMeta(topic.complexity?.timeAvg);
                    const bestMeta = getComplexityMeta(topic.complexity?.timeBest);
                    const worstMeta = getComplexityMeta(topic.complexity?.timeWorst);
                    const directType = getDirectAlgorithmTypeLabel(topic);

                    /* -------------------- 1. LIST VIEW LAYOUT -------------------- */
                    if (viewLayout === 'list') {
                        return (
                            <div
                                key={topic.slug}
                                className={`group bg-white rounded-2xl border p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 transition-all duration-200 hover:shadow-md ${
                                    isHidden
                                        ? 'border-dashed border-slate-300 opacity-65'
                                        : 'border-slate-200 hover:border-[#5899B5]'
                                }`}
                            >
                                <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                                    <AlgoTopicIcon topic={topic} size="md" />
                                    <div className="min-w-0 flex-1 space-y-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="text-base font-semibold text-slate-900 group-hover:text-[#3D7690] transition-colors">
                                                {topic.title}
                                            </h3>
                                            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#5899B5]/10 text-[#3D7690] border border-[#5899B5]/25">
                                                {directType}
                                            </span>
                                            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                                                {topic.difficulty}
                                            </span>
                                            <span
                                                className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                                                    st === 'completed'
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                        : st === 'in-progress'
                                                          ? 'bg-[#5899B5]/15 text-[#3D7690]'
                                                          : 'bg-slate-100 text-slate-400'
                                                }`}
                                            >
                                                {st === 'completed'
                                                    ? 'Completed'
                                                    : st === 'in-progress'
                                                      ? 'In Progress'
                                                      : 'Not Explored'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-600 line-clamp-1">
                                            <span className="text-slate-700">What it is:</span>{' '}
                                            {topic.overview?.what || topic.shortDesc}
                                        </p>
                                    </div>
                                </div>

                                {/* Color-Coded Complexity Badges & Action Buttons */}
                                <div className="flex flex-wrap items-center justify-between lg:justify-end gap-2.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                                    <div className="flex flex-wrap items-center gap-1.5">
                                        <span
                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold border ${avgMeta.badgeClass}`}
                                        >
                                            <span className={`w-1.5 h-1.5 rounded-full ${avgMeta.dotClass}`} />
                                            Avg: {avgMeta.notation} ({avgMeta.name})
                                        </span>
                                        <span
                                            className={`hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-mono font-medium border ${worstMeta.badgeClass}`}
                                        >
                                            Worst: {worstMeta.notation}
                                        </span>
                                        <span className="px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-mono font-medium text-slate-600">
                                            Space: {topic.complexity?.space}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-1.5">
                                        <button
                                            onClick={() => {
                                                setActiveTopicSlug(topic.slug);
                                                recordTopicProgress(topic.slug, 'in-progress');
                                            }}
                                            className="py-2 px-4 rounded-xl bg-[#5899B5] hover:bg-[#3D7690] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                                        >
                                            Get Started <ArrowRight className="w-3.5 h-3.5" />
                                        </button>
                                        {canManage && (
                                            <>
                                                <button
                                                    onClick={() =>
                                                        handleSaveTopicCustomization({
                                                            ...topic,
                                                            isPublished:
                                                                topic.isPublished === false
                                                                    ? true
                                                                    : false
                                                        })
                                                    }
                                                    className="p-2 rounded-xl border border-slate-200 hover:border-[#5899B5] text-slate-600"
                                                    title={
                                                        topic.isPublished === false
                                                            ? 'Publish Topic'
                                                            : 'Unpublish Topic'
                                                    }
                                                >
                                                    {topic.isPublished === false ? (
                                                        <EyeOff className="w-3.5 h-3.5 text-rose-500" />
                                                    ) : (
                                                        <Eye className="w-3.5 h-3.5 text-[#3D7690]" />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => setEditingTopic({ ...topic })}
                                                    className="p-2 rounded-xl border border-slate-200 hover:border-[#5899B5] text-slate-600"
                                                    title="Customize Topic"
                                                >
                                                    <Edit3 className="w-3.5 h-3.5" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    }

                    /* -------------------- 2. COMPACT GRID VIEW LAYOUT -------------------- */
                    if (viewLayout === 'grid') {
                        return (
                            <div
                                key={topic.slug}
                                className={`group bg-white rounded-2xl border p-4 flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                                    isHidden
                                        ? 'border-dashed border-slate-300 opacity-65'
                                        : 'border-slate-200 hover:border-[#5899B5]'
                                }`}
                            >
                                <div className="space-y-2.5">
                                    <div className="flex items-start justify-between gap-2">
                                        <AlgoTopicIcon topic={topic} size="sm" />
                                        <span
                                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold border ${avgMeta.badgeClass}`}
                                        >
                                            <span className={`w-1.5 h-1.5 rounded-full ${avgMeta.dotClass}`} />
                                            {avgMeta.notation} • {avgMeta.name}
                                        </span>
                                    </div>

                                    <div>
                                        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#3D7690]">
                                            {directType}
                                        </span>
                                        <h3 className="text-sm font-semibold text-slate-900 mt-0.5 group-hover:text-[#3D7690] transition-colors">
                                            {topic.title}
                                        </h3>
                                        <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                                            {topic.overview?.what || topic.shortDesc}
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-3 mt-3 border-t border-slate-100 space-y-2.5">
                                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                                        <span>Space: {topic.complexity?.space}</span>
                                        <span className="font-sans font-medium text-slate-600">
                                            {topic.difficulty}
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => {
                                            setActiveTopicSlug(topic.slug);
                                            recordTopicProgress(topic.slug, 'in-progress');
                                        }}
                                        className="w-full py-1.5 px-3 rounded-xl bg-[#5899B5] hover:bg-[#3D7690] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                                    >
                                        Get Started <ArrowRight className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        );
                    }

                    /* -------------------- 3. DEFAULT VIEW LAYOUT -------------------- */
                    return (
                        <div
                            key={topic.slug}
                            className={`group bg-white rounded-2xl border p-5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                                isHidden
                                    ? 'border-dashed border-slate-300 opacity-65'
                                    : 'border-slate-200 hover:border-[#5899B5]'
                            }`}
                        >
                            <div className="space-y-3">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#5899B5]/10 text-[#3D7690] border border-[#5899B5]/25">
                                        {directType}
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                                            {topic.difficulty}
                                        </span>
                                        <span
                                            className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                                                st === 'completed'
                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                    : st === 'in-progress'
                                                      ? 'bg-[#5899B5]/15 text-[#3D7690]'
                                                      : 'bg-slate-100 text-slate-400'
                                            }`}
                                        >
                                            {st === 'completed'
                                                ? 'Completed'
                                                : st === 'in-progress'
                                                  ? 'In Progress'
                                                  : 'Not Explored'}
                                        </span>
                                    </div>
                                </div>

                                {/* Direct Algorithm Name + Custom SVG Icon + What It Is */}
                                <div className="flex items-start gap-3">
                                    <AlgoTopicIcon topic={topic} size="md" />
                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-base font-semibold text-slate-900 group-hover:text-[#3D7690] transition-colors">
                                            {topic.title}
                                        </h3>
                                        <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                                            <span className="text-slate-700">What it is:</span>{' '}
                                            {topic.overview?.what || topic.shortDesc}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 mt-4 border-t border-slate-100 space-y-3">
                                {/* Color-Coded Time & Space Complexity Strip with Complexity Class Names */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between gap-2">
                                        <span
                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold border ${avgMeta.badgeClass}`}
                                        >
                                            <span className={`w-1.5 h-1.5 rounded-full ${avgMeta.dotClass}`} />
                                            {avgMeta.notation} • {avgMeta.name}
                                        </span>
                                        <span className="px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-mono font-medium text-[#3D7690]">
                                            Space: {topic.complexity?.space}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 px-0.5">
                                        <span>
                                            Best: <span className="text-emerald-700">{bestMeta.notation}</span>
                                        </span>
                                        <span>
                                            Worst: <span className="text-rose-700">{worstMeta.notation}</span>
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => {
                                            setActiveTopicSlug(topic.slug);
                                            recordTopicProgress(topic.slug, 'in-progress');
                                        }}
                                        className="flex-1 py-2 px-3.5 rounded-xl bg-[#5899B5] hover:bg-[#3D7690] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                                    >
                                        Get Started <ArrowRight className="w-3.5 h-3.5" />
                                    </button>

                                    {canManage && (
                                        <>
                                            <button
                                                onClick={() =>
                                                    handleSaveTopicCustomization({
                                                        ...topic,
                                                        isPublished:
                                                            topic.isPublished === false
                                                                ? true
                                                                : false
                                                    })
                                                }
                                                className="p-2 rounded-xl border border-slate-200 hover:border-[#5899B5] text-slate-600"
                                                title={
                                                    topic.isPublished === false
                                                        ? 'Publish Topic'
                                                        : 'Unpublish Topic'
                                                }
                                            >
                                                {topic.isPublished === false ? (
                                                    <EyeOff className="w-3.5 h-3.5 text-rose-500" />
                                                ) : (
                                                    <Eye className="w-3.5 h-3.5 text-[#3D7690]" />
                                                )}
                                            </button>
                                            <button
                                                onClick={() =>
                                                    setEditingTopic({ ...topic })
                                                }
                                                className="p-2 rounded-xl border border-slate-200 hover:border-[#5899B5] text-slate-600"
                                                title="Customize Topic"
                                            >
                                                <Edit3 className="w-3.5 h-3.5" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ADMIN / OPS ADMIN CUSTOMIZATION MODAL */}
            {editingTopic && (
                <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full max-h-[88vh] overflow-y-auto p-6 space-y-4 shadow-xl">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                            <h3 className="text-base font-semibold text-slate-900">
                                Customize AlgoPlay Topic: {editingTopic.title}
                            </h3>
                            <button
                                onClick={() => setEditingTopic(null)}
                                className="p-1.5 rounded-lg hover:bg-slate-100"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div>
                                <label className="font-medium text-slate-600">Title</label>
                                <input
                                    type="text"
                                    value={editingTopic.title || ''}
                                    onChange={(e) =>
                                        setEditingTopic({
                                            ...editingTopic,
                                            title: e.target.value
                                        })
                                    }
                                    className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200"
                                />
                            </div>
                            <div>
                                <label className="font-medium text-slate-600">
                                    Difficulty Level
                                </label>
                                <select
                                    value={editingTopic.difficulty || 'Beginner'}
                                    onChange={(e) =>
                                        setEditingTopic({
                                            ...editingTopic,
                                            difficulty: e.target.value
                                        })
                                    }
                                    className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200"
                                >
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                </select>
                            </div>
                            <div className="sm:col-span-2">
                                <label className="font-medium text-slate-600">
                                    Short Description
                                </label>
                                <textarea
                                    rows="2"
                                    value={editingTopic.shortDesc || ''}
                                    onChange={(e) =>
                                        setEditingTopic({
                                            ...editingTopic,
                                            shortDesc: e.target.value
                                        })
                                    }
                                    className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200"
                                />
                            </div>
                            <div>
                                <label className="font-medium text-slate-600">
                                    Sequence Order
                                </label>
                                <input
                                    type="number"
                                    value={editingTopic.sequenceOrder || 1}
                                    onChange={(e) =>
                                        setEditingTopic({
                                            ...editingTopic,
                                            sequenceOrder: Number(e.target.value)
                                        })
                                    }
                                    className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200"
                                />
                            </div>
                            <div className="flex items-center gap-4 pt-5">
                                <label className="flex items-center gap-1.5 font-medium text-slate-700">
                                    <input
                                        type="checkbox"
                                        checked={editingTopic.isPublished !== false}
                                        onChange={(e) =>
                                            setEditingTopic({
                                                ...editingTopic,
                                                isPublished: e.target.checked
                                            })
                                        }
                                    />
                                    Published
                                </label>
                                <label className="flex items-center gap-1.5 font-medium text-slate-700">
                                    <input
                                        type="checkbox"
                                        checked={editingTopic.isEnabled !== false}
                                        onChange={(e) =>
                                            setEditingTopic({
                                                ...editingTopic,
                                                isEnabled: e.target.checked
                                            })
                                        }
                                    />
                                    Enabled
                                </label>
                            </div>
                            <div className="sm:col-span-2">
                                <label className="font-medium text-slate-600">
                                    Pseudocode Lines (One line per step)
                                </label>
                                <textarea
                                    rows="4"
                                    value={(editingTopic.pseudocode || []).join('\n')}
                                    onChange={(e) =>
                                        setEditingTopic({
                                            ...editingTopic,
                                            pseudocode: e.target.value.split('\n')
                                        })
                                    }
                                    className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 font-mono"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                            <button
                                onClick={() => setEditingTopic(null)}
                                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() =>
                                    handleSaveTopicCustomization(editingTopic)
                                }
                                className="px-4 py-2 rounded-xl bg-[#5899B5] hover:bg-[#3D7690] text-white text-xs font-semibold"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AlgoPlayHub;
