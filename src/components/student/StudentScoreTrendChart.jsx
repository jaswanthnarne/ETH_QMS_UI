import React, { useState, useMemo } from 'react';
import {
    ResponsiveContainer,
    ComposedChart,
    AreaChart,
    BarChart,
    Area,
    Line,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ReferenceLine,
    Cell,
} from 'recharts';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    TrendingDown,
    Award,
    Target,
    Activity,
    BarChart3,
    LineChart as LineChartIcon,
    Layers,
    Sparkles,
    ArrowUpRight,
} from 'lucide-react';

const CustomScoreTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;
    const item = payload[0]?.payload;
    if (!item || item.isBaseline) {
        return (
            <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl rounded-2xl p-3.5 min-w-[190px] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5899B5] block">
                    {item?.courseName || 'Starting Point'}
                </span>
                <p className="text-xs font-bold text-slate-800">{item?.fullTitle || 'Cohort Baseline'}</p>
                <p className="text-[11px] text-slate-500">
                    Initial Launchpad: <span className="font-bold text-slate-700">0% → First Assessment</span>
                </p>
            </div>
        );
    }

    const isPass = item.result === 'pass';
    const tier =
        item.percentage >= 70
            ? { label: 'Champion Tier', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' }
            : item.percentage >= 50
            ? { label: 'Contender Tier', color: 'text-[#5899B5] bg-sky-50 border-sky-200' }
            : item.percentage >= 35
            ? { label: 'Borderline Tier', color: 'text-amber-600 bg-amber-50 border-amber-200' }
            : { label: 'Comeback Needed', color: 'text-rose-600 bg-rose-50 border-rose-200' };

    return (
        <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl rounded-2xl p-4 min-w-[235px] max-w-[290px] space-y-2.5">
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#5899B5] block truncate">
                        {item.courseName}
                    </span>
                    <p className="text-xs font-bold text-slate-800 leading-snug line-clamp-2 mt-0.5">
                        {item.fullTitle}
                    </p>
                </div>
                <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border shrink-0 ${
                        isPass
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                >
                    {isPass ? 'Pass' : 'Fail'}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-slate-100">
                <div className="bg-slate-50/80 rounded-xl p-2 border border-slate-100">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase block">Score</span>
                    <span className="text-sm font-bold text-slate-800">{item.percentage}%</span>
                    <span className="text-[10px] text-slate-400 font-medium block">
                        {item.totalScore} / {item.totalMarks} pts
                    </span>
                </div>
                <div className="bg-slate-50/80 rounded-xl p-2 border border-slate-100">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase block">Running Avg</span>
                    <span className="text-sm font-bold text-[#3D7690]">{item.runningAvg}%</span>
                    <span className="text-[10px] text-slate-400 font-medium block">{item.fullDate}</span>
                </div>
            </div>

            <div className="flex items-center justify-between pt-1">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${tier.color}`}>
                    {tier.label}
                </span>
                {item.delta !== null && (
                    <span
                        className={`text-[10px] font-bold flex items-center gap-0.5 ${
                            item.delta >= 0 ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                    >
                        {item.delta >= 0 ? '+' : ''}
                        {item.delta}% vs prev
                    </span>
                )}
            </div>
        </div>
    );
};

const StudentScoreTrendChart = ({ attempts = [], loading = false, onViewHistory, onTakeExam }) => {
    const [chartMode, setChartMode] = useState('area'); // 'area' | 'composed' | 'bar'
    const [rangeFilter, setRangeFilter] = useState('all'); // 'last5' | 'last10' | 'all'

    // Chronological processing of actual attempts (oldest -> newest)
    const rawData = useMemo(() => {
        const valid = (Array.isArray(attempts) ? attempts : []).filter((a) => !a.isMock);
        const sorted = [...valid].sort((a, b) => {
            const dA = new Date(a.completedAt || a.createdAt || 0).getTime();
            const dB = new Date(b.completedAt || b.createdAt || 0).getTime();
            return dA - dB;
        });

        let runningSum = 0;
        const enriched = sorted.map((attempt, idx) => {
            const exam = attempt.examId || {};
            const pct = Number((attempt.percentage || 0).toFixed(1));
            runningSum += pct;
            const runningAvg = Number((runningSum / (idx + 1)).toFixed(1));
            const prevPct = idx > 0 ? Number((sorted[idx - 1].percentage || 0).toFixed(1)) : null;
            const delta = prevPct !== null ? Number((pct - prevPct).toFixed(1)) : null;
            const dateObj = new Date(attempt.completedAt || attempt.createdAt || Date.now());
            const shortDate = dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
            const fullDate = dateObj.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            });
            const title = exam?.title || `Assessment #${idx + 1}`;
            const shortLabel = title.length > 14 ? `${title.slice(0, 12)}…` : title;

            return {
                id: attempt._id || `attempt-${idx}`,
                index: idx + 1,
                label: `#${idx + 1} ${shortDate}`,
                shortTitle: shortLabel,
                fullTitle: title,
                courseName: exam?.courseId?.name || 'Course Assessment',
                shortDate,
                fullDate,
                percentage: pct,
                runningAvg,
                delta,
                totalScore: attempt.totalScore ?? 0,
                totalMarks: exam?.totalMarks ?? 100,
                result: attempt.result || (pct >= 50 ? 'pass' : 'fail'),
                isBaseline: false,
            };
        });

        if (rangeFilter === 'last5') return enriched.slice(-5);
        if (rangeFilter === 'last10') return enriched.slice(-10);
        return enriched;
    }, [attempts, rangeFilter]);

    // For Wave (Area) & Analytics (Line) charts, an SVG wave path needs at least 2 points to draw a curve and gradient fill.
    // Prepending a "Start (0%)" baseline point ensures even a single completed exam renders a full rising wave curve!
    const waveChartData = useMemo(() => {
        if (!rawData.length) return [];
        const first = rawData[0];
        const baselinePoint = {
            id: 'cohort-start-baseline',
            index: 0,
            label: 'Start',
            shortTitle: 'Baseline',
            fullTitle: 'Cohort Starting Baseline',
            courseName: 'Initial Launchpad',
            shortDate: 'Start',
            fullDate: 'Starting Point',
            percentage: 0,
            runningAvg: 0,
            delta: null,
            totalScore: 0,
            totalMarks: first.totalMarks || 100,
            result: 'pass',
            isBaseline: true,
        };

        // If only 1 exam exists, also add a smooth trailing projection point so the wave fills edge-to-edge nicely
        if (rawData.length === 1) {
            const targetNext = Math.min(100, Math.max(70, Number((first.percentage + 8).toFixed(1))));
            const targetPoint = {
                id: 'cohort-next-target',
                index: 2,
                label: 'Next Goal',
                shortTitle: 'Next Target',
                fullTitle: 'Target Score Trajectory',
                courseName: 'Projected Milestone',
                shortDate: 'Target',
                fullDate: 'Upcoming Assessment Goal',
                percentage: targetNext,
                runningAvg: Number(((first.percentage + targetNext) / 2).toFixed(1)),
                delta: Number((targetNext - first.percentage).toFixed(1)),
                totalScore: Math.round((targetNext / 100) * (first.totalMarks || 100)),
                totalMarks: first.totalMarks || 100,
                result: 'pass',
                isBaseline: false,
                isProjected: true,
            };
            return [baselinePoint, ...rawData, targetPoint];
        }

        return [baselinePoint, ...rawData];
    }, [rawData]);

    // Summary analytics based strictly on real completed exams
    const metrics = useMemo(() => {
        if (!rawData.length) {
            return {
                avg: 0,
                best: 0,
                latest: 0,
                momentum: 0,
                passRate: 0,
                championCount: 0,
            };
        }
        const total = rawData.length;
        const sum = rawData.reduce((acc, d) => acc + d.percentage, 0);
        const avg = Number((sum / total).toFixed(1));
        const best = Number(Math.max(...rawData.map((d) => d.percentage)).toFixed(1));
        const latest = rawData[total - 1].percentage;
        const first = rawData[0].percentage;
        const momentum = total > 1 ? Number((latest - first).toFixed(1)) : latest;
        const passed = rawData.filter((d) => d.result === 'pass').length;
        const passRate = Math.round((passed / total) * 100);
        const championCount = rawData.filter((d) => d.percentage >= 70).length;

        return { avg, best, latest, momentum, passRate, championCount };
    }, [rawData]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden"
        >
            {/* Subtle top-right decorative glow matching Ethnotech theme */}
            <div
                className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-20 blur-3xl"
                style={{ background: 'radial-gradient(circle, #5899B5 0%, transparent 70%)' }}
            />

            {/* Header Row: Title, Badges & Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
                <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-sky-50 text-[#5899B5] border border-sky-100 uppercase tracking-wider">
                            <Activity size={12} /> Performance Telemetry
                        </span>
                        {rawData.length >= 1 && (
                            <span
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                                    metrics.momentum >= 0
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                        : 'bg-amber-50 text-amber-700 border-amber-200'
                                }`}
                            >
                                {metrics.momentum >= 0 ? (
                                    <TrendingUp size={12} />
                                ) : (
                                    <TrendingDown size={12} />
                                )}
                                {metrics.momentum >= 0 ? `+${metrics.momentum}%` : `${metrics.momentum}%`} Growth Trajectory
                            </span>
                        )}
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-800">
                        Assessment Score Trend & Moving Average
                    </h3>
                    <p className="text-slate-500 text-xs sm:text-sm">
                        Visualizing your chronological exam accuracy wave, cumulative growth curve, and 70% Champion benchmark.
                    </p>
                </div>

                {/* Controls: Range Filter & Chart Style Switcher */}
                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    {/* Range Filter */}
                    <div className="inline-flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
                        {[
                            { id: 'last5', label: 'Last 5' },
                            { id: 'last10', label: 'Last 10' },
                            { id: 'all', label: 'All Exams' },
                        ].map((r) => (
                            <button
                                key={r.id}
                                type="button"
                                onClick={() => setRangeFilter(r.id)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                    rangeFilter === r.id
                                        ? 'bg-white text-[#5899B5] shadow-2xs'
                                        : 'text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                {r.label}
                            </button>
                        ))}
                    </div>

                    {/* Chart Mode Switcher */}
                    <div className="inline-flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
                        {[
                            { id: 'area', label: 'Wave', icon: LineChartIcon },
                            { id: 'composed', label: 'Analytics', icon: Layers },
                            { id: 'bar', label: 'Bars', icon: BarChart3 },
                        ].map((mode) => {
                            const Icon = mode.icon;
                            return (
                                <button
                                    key={mode.id}
                                    type="button"
                                    onClick={() => setChartMode(mode.id)}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                        chartMode === mode.id
                                            ? 'bg-[#5899B5] text-white shadow-2xs'
                                            : 'text-slate-500 hover:text-slate-800'
                                    }`}
                                >
                                    <Icon size={13} />
                                    <span>{mode.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Mini Telemetry Strip */}
            {rawData.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 relative z-10">
                    <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-3.5 flex items-center justify-between">
                        <div>
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                                Latest Score
                            </span>
                            <span className="text-lg font-bold text-slate-800 mt-0.5 block">
                                {metrics.latest}%
                            </span>
                        </div>
                        <div className="w-9 h-9 rounded-xl bg-sky-50 text-[#5899B5] flex items-center justify-center">
                            <Activity size={18} />
                        </div>
                    </div>

                    <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-3.5 flex items-center justify-between">
                        <div>
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                                Moving Average
                            </span>
                            <span className="text-lg font-bold text-[#3D7690] mt-0.5 block">
                                {metrics.avg}%
                            </span>
                        </div>
                        <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#3D7690] flex items-center justify-center">
                            <Target size={18} />
                        </div>
                    </div>

                    <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-3.5 flex items-center justify-between">
                        <div>
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                                Personal Best
                            </span>
                            <span className="text-lg font-bold text-emerald-600 mt-0.5 block">
                                {metrics.best}%
                            </span>
                        </div>
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <Award size={18} />
                        </div>
                    </div>

                    <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-3.5 flex items-center justify-between">
                        <div>
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                                Champion (70%+)
                            </span>
                            <span className="text-lg font-bold text-amber-600 mt-0.5 block">
                                {metrics.championCount} / {rawData.length}
                            </span>
                        </div>
                        <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                            <Sparkles size={18} />
                        </div>
                    </div>
                </div>
            )}

            {/* Main Animated Chart Canvas */}
            <div className="relative z-10">
                {loading ? (
                    <div className="h-72 flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl border border-slate-100">
                        <div className="w-10 h-10 rounded-full border-3 border-[#5899B5]/20 border-t-[#5899B5] animate-spin mb-3" />
                        <p className="text-xs font-semibold text-slate-500">Syncing score telemetry...</p>
                    </div>
                ) : rawData.length === 0 ? (
                    <div className="h-72 flex flex-col items-center justify-center text-center bg-gradient-to-b from-slate-50/60 to-sky-50/30 rounded-2xl border border-dashed border-slate-200 p-6">
                        <svg viewBox="0 0 180 90" className="w-40 mb-3" aria-hidden="true">
                            <ellipse cx="90" cy="80" rx="70" ry="6" fill="#E2E8F0" />
                            <rect x="24" y="16" width="132" height="58" rx="10" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
                            <line x1="38" y1="58" x2="142" y2="58" stroke="#CBD5E1" strokeWidth="1.5" />
                            <path
                                d="M40 52 Q65 48 82 36 T122 28 T140 20"
                                fill="none"
                                stroke="#5899B5"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeDasharray="5 4"
                            />
                            <circle cx="82" cy="36" r="4" fill="#38BDF8" stroke="#1E293B" strokeWidth="1.5" />
                            <circle cx="122" cy="28" r="4" fill="#10B981" stroke="#1E293B" strokeWidth="1.5" />
                            <circle cx="140" cy="20" r="5" fill="#FACC15" stroke="#1E293B" strokeWidth="1.5" />
                        </svg>
                        <p className="text-slate-800 font-semibold text-sm">
                            Your Score Trend Wave Will Ignite After Your First Exam
                        </p>
                        <p className="text-slate-400 text-xs max-w-md mt-1">
                            Complete any live batch assessment to unlock your real-time accuracy wave, moving average trajectory, and Champion Tier analytics.
                        </p>
                        {onTakeExam && (
                            <button
                                type="button"
                                onClick={onTakeExam}
                                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5899B5] hover:bg-[#3D7690] text-white text-xs font-semibold shadow-sm transition cursor-pointer"
                            >
                                Go to Live Assessments <ArrowUpRight size={14} />
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="h-72 sm:h-80 w-full pt-2">
                        <ResponsiveContainer width="100%" height="100%">
                            {chartMode === 'area' ? (
                                <AreaChart data={waveChartData} margin={{ top: 14, right: 20, left: -12, bottom: 4 }}>
                                    <defs>
                                        <linearGradient id="ethScoreAreaGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#5899B5" stopOpacity={0.48} />
                                            <stop offset="55%" stopColor="#38BDF8" stopOpacity={0.18} />
                                            <stop offset="98%" stopColor="#5899B5" stopOpacity={0.02} />
                                        </linearGradient>
                                        <linearGradient id="ethAvgAreaGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.22} />
                                            <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="4 4" stroke="#E2E8F0" vertical={false} />
                                    <XAxis
                                        dataKey="label"
                                        tick={{ fill: '#64748B', fontSize: 11, fontWeight: 600 }}
                                        axisLine={{ stroke: '#E2E8F0' }}
                                        tickLine={false}
                                        dy={6}
                                    />
                                    <YAxis
                                        domain={[0, 100]}
                                        ticks={[0, 25, 50, 75, 100]}
                                        tickFormatter={(v) => `${v}%`}
                                        tick={{ fill: '#64748B', fontSize: 11, fontWeight: 600 }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip
                                        content={<CustomScoreTooltip />}
                                        cursor={{ stroke: '#5899B5', strokeWidth: 1.5, strokeDasharray: '4 4' }}
                                    />
                                    <ReferenceLine
                                        y={70}
                                        stroke="#10B981"
                                        strokeDasharray="5 5"
                                        strokeWidth={1.5}
                                        label={{
                                            value: '70% Champion',
                                            position: 'insideTopRight',
                                            fill: '#059669',
                                            fontSize: 10,
                                            fontWeight: 700,
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="runningAvg"
                                        name="Running Average"
                                        stroke="#10B981"
                                        strokeWidth={2.2}
                                        strokeDasharray="5 4"
                                        fill="url(#ethAvgAreaGrad)"
                                        isAnimationActive={true}
                                        animationDuration={1300}
                                        animationEasing="ease-out"
                                        dot={false}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="percentage"
                                        name="Exam Score"
                                        stroke="#5899B5"
                                        strokeWidth={3.5}
                                        fill="url(#ethScoreAreaGrad)"
                                        isAnimationActive={true}
                                        animationDuration={1100}
                                        animationEasing="ease-out"
                                        dot={(props) => {
                                            const { cx, cy, payload } = props;
                                            if (!Number.isFinite(cx) || !Number.isFinite(cy)) return null;
                                            if (payload?.isBaseline) {
                                                return (
                                                    <circle
                                                        key={`dot-${payload.id}`}
                                                        cx={cx}
                                                        cy={cy}
                                                        r={4}
                                                        fill="#CBD5E1"
                                                        stroke="#FFFFFF"
                                                        strokeWidth={2}
                                                    />
                                                );
                                            }
                                            if (payload?.isProjected) {
                                                return (
                                                    <circle
                                                        key={`dot-${payload.id}`}
                                                        cx={cx}
                                                        cy={cy}
                                                        r={5}
                                                        fill="#FFFFFF"
                                                        stroke="#10B981"
                                                        strokeWidth={2.5}
                                                        strokeDasharray="2 2"
                                                    />
                                                );
                                            }
                                            return (
                                                <circle
                                                    key={`dot-${payload.id}`}
                                                    cx={cx}
                                                    cy={cy}
                                                    r={5.5}
                                                    fill="#FFFFFF"
                                                    stroke="#5899B5"
                                                    strokeWidth={3}
                                                />
                                            );
                                        }}
                                        activeDot={{
                                            r: 7.5,
                                            fill: '#5899B5',
                                            stroke: '#FFFFFF',
                                            strokeWidth: 2.5,
                                        }}
                                    />
                                </AreaChart>
                            ) : chartMode === 'composed' ? (
                                <ComposedChart data={waveChartData} margin={{ top: 14, right: 20, left: -12, bottom: 4 }}>
                                    <defs>
                                        <linearGradient id="ethBarGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#5899B5" stopOpacity={0.9} />
                                            <stop offset="100%" stopColor="#3D7690" stopOpacity={0.75} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="4 4" stroke="#E2E8F0" vertical={false} />
                                    <XAxis
                                        dataKey="label"
                                        tick={{ fill: '#64748B', fontSize: 11, fontWeight: 600 }}
                                        axisLine={{ stroke: '#E2E8F0' }}
                                        tickLine={false}
                                        dy={6}
                                    />
                                    <YAxis
                                        domain={[0, 100]}
                                        ticks={[0, 25, 50, 75, 100]}
                                        tickFormatter={(v) => `${v}%`}
                                        tick={{ fill: '#64748B', fontSize: 11, fontWeight: 600 }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip content={<CustomScoreTooltip />} cursor={{ fill: 'rgba(88, 153, 181, 0.08)' }} />
                                    <ReferenceLine y={70} stroke="#10B981" strokeDasharray="5 5" strokeWidth={1.5} />
                                    <Bar
                                        dataKey="percentage"
                                        name="Exam Score"
                                        fill="url(#ethBarGrad)"
                                        radius={[8, 8, 2, 2]}
                                        maxBarSize={42}
                                        isAnimationActive={true}
                                        animationDuration={1000}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="runningAvg"
                                        name="Running Average"
                                        stroke="#F59E0B"
                                        strokeWidth={3}
                                        dot={{ r: 4, fill: '#FFFFFF', stroke: '#F59E0B', strokeWidth: 2.5 }}
                                        isAnimationActive={true}
                                        animationDuration={1300}
                                    />
                                </ComposedChart>
                            ) : (
                                <BarChart data={rawData} margin={{ top: 14, right: 20, left: -12, bottom: 4 }}>
                                    <CartesianGrid strokeDasharray="4 4" stroke="#E2E8F0" vertical={false} />
                                    <XAxis
                                        dataKey="label"
                                        tick={{ fill: '#64748B', fontSize: 11, fontWeight: 600 }}
                                        axisLine={{ stroke: '#E2E8F0' }}
                                        tickLine={false}
                                        dy={6}
                                    />
                                    <YAxis
                                        domain={[0, 100]}
                                        ticks={[0, 25, 50, 75, 100]}
                                        tickFormatter={(v) => `${v}%`}
                                        tick={{ fill: '#64748B', fontSize: 11, fontWeight: 600 }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip content={<CustomScoreTooltip />} cursor={{ fill: 'rgba(88, 153, 181, 0.08)' }} />
                                    <ReferenceLine y={70} stroke="#10B981" strokeDasharray="5 5" strokeWidth={1.5} />
                                    <Bar
                                        dataKey="percentage"
                                        name="Exam Score"
                                        radius={[10, 10, 3, 3]}
                                        maxBarSize={46}
                                        isAnimationActive={true}
                                        animationDuration={1050}
                                    >
                                        {rawData.map((entry) => {
                                            const fill =
                                                entry.percentage >= 70
                                                    ? '#10B981'
                                                    : entry.percentage >= 50
                                                    ? '#5899B5'
                                                    : entry.percentage >= 35
                                                    ? '#F59E0B'
                                                    : '#F43F5E';
                                            return <Cell key={entry.id} fill={fill} />;
                                        })}
                                    </Bar>
                                </BarChart>
                            )}
                        </ResponsiveContainer>
                    </div>
                )}
            </div>

            {/* Footer Legend & Action Bar */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-4">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-slate-600">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#5899B5]" />
                        Assessment Score Wave (%)
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-semibold text-slate-600">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        Cumulative Average / 70% Champion Benchmark
                    </span>
                    {chartMode === 'bar' && (
                        <span className="inline-flex items-center gap-1.5 font-semibold text-slate-500">
                            <span className="w-2 h-2 rounded-full bg-amber-500" />
                            Tier Color-Coded Bars
                        </span>
                    )}
                </div>

                {onViewHistory && rawData.length > 0 && (
                    <button
                        type="button"
                        onClick={onViewHistory}
                        className="text-xs font-semibold text-[#5899B5] hover:text-[#3D7690] inline-flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                    >
                        Detailed Score Breakdown <ArrowUpRight size={14} />
                    </button>
                )}
            </div>
        </motion.div>
    );
};

export default StudentScoreTrendChart;
