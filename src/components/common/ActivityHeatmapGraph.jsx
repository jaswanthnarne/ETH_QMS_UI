import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Clock, Flame, Activity } from 'lucide-react';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_LABELS = [
    { idx: 0, label: 'Sun', show: false },
    { idx: 1, label: 'Mon', show: true },
    { idx: 2, label: 'Tue', show: false },
    { idx: 3, label: 'Wed', show: true },
    { idx: 4, label: 'Thu', show: false },
    { idx: 5, label: 'Fri', show: true },
    { idx: 6, label: 'Sat', show: false }
];

export const toDateKey = (dateInput) => {
    const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
    if (Number.isNaN(d.getTime())) return null;
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};

export const formatMinutesReadable = (mins = 0) => {
    const m = Math.round(Number(mins) || 0);
    if (m <= 0) return 'No time recorded';
    if (m < 60) return `${m} min${m !== 1 ? 's' : ''} spent`;
    const hrs = Math.floor(m / 60);
    const rem = m % 60;
    return rem > 0
        ? `${hrs} hr${hrs !== 1 ? 's' : ''} ${rem} min${rem !== 1 ? 's' : ''} spent`
        : `${hrs} hr${hrs !== 1 ? 's' : ''} spent`;
};

/**
 * GitHub green intensity tier based on time spent on the platform:
 * 0: No login / 0 mins          -> #ebedf0 (Empty gray)
 * 1: Login / 1 - 29 mins        -> #9be9a8 (Light Green)
 * 2: 30 - 59 mins               -> #40c463 (Medium Green)
 * 3: 60 - 119 mins (1+ Hour)    -> #30a14e (Dark Green)
 * 4: 120+ mins (2+ Hours)       -> #216e39 (Deepest Dark Green)
 */
const getActivityLevel = (minutes) => {
    const m = Number(minutes) || 0;
    if (m <= 0) return 0;
    if (m < 30) return 1; // Light green for login / < 30m
    if (m < 60) return 2; // Medium green for 30m - 1h
    if (m < 120) return 3; // Dark green for > 1 hr
    return 4; // Deepest dark green for 2+ hrs
};

const LEVEL_STYLES = {
    0: 'bg-[#ebedf0] border-slate-200/80 hover:ring-2 hover:ring-slate-300',
    1: 'bg-[#9be9a8] border-[#7cd88c] hover:ring-2 hover:ring-[#40c463]',
    2: 'bg-[#40c463] border-[#33ad54] hover:ring-2 hover:ring-[#30a14e]',
    3: 'bg-[#30a14e] border-[#268840] hover:ring-2 hover:ring-[#216e39]',
    4: 'bg-[#216e39] border-[#18542b] hover:ring-2 hover:ring-emerald-950'
};

const LEVEL_LABELS = {
    0: 'No Activity',
    1: 'Logged In (< 30 mins)',
    2: 'Active Session (30 – 60 mins)',
    3: 'Deep Focus (1+ Hour)',
    4: 'Power Session (2+ Hours)'
};

const ActivityHeatmapGraph = ({
    userId = 'default',
    userName = '',
    attempts = [],
    attendanceHistory = [],
    auditLogs = []
}) => {
    const storageKey = `eth_activity_daily_seconds_${userId}`;
    const [dailySecondsMap, setDailySecondsMap] = useState({});
    const [hoveredCell, setHoveredCell] = useState(null);

    // Load & maintain live session timer in localStorage
    useEffect(() => {
        const todayKey = toDateKey(new Date());

        const readAndEnsureLoginToday = () => {
            try {
                const raw = localStorage.getItem(storageKey);
                const parsed = raw ? JSON.parse(raw) : {};
                // Ensure logging in today records at least 5 minutes (300s) baseline so login immediately shows Light Green
                if (!parsed[todayKey] || parsed[todayKey] < 300) {
                    parsed[todayKey] = 300;
                    localStorage.setItem(storageKey, JSON.stringify(parsed));
                }
                setDailySecondsMap({ ...parsed });
            } catch {
                setDailySecondsMap({ [todayKey]: 300 });
            }
        };

        readAndEnsureLoginToday();

        // Increment active time every 30 seconds while tab is visible
        const interval = setInterval(() => {
            if (document.visibilityState !== 'visible') return;
            const currentToday = toDateKey(new Date());
            try {
                const raw = localStorage.getItem(storageKey);
                const parsed = raw ? JSON.parse(raw) : {};
                parsed[currentToday] = (Number(parsed[currentToday]) || 300) + 30;
                localStorage.setItem(storageKey, JSON.stringify(parsed));
                setDailySecondsMap({ ...parsed });
            } catch {}
        }, 30000);

        return () => clearInterval(interval);
    }, [storageKey]);

    // Combine tracked session time with real historical platform events (exams, attendance, coding arena, audit logs)
    const combinedDailyMinutes = useMemo(() => {
        const map = {};

        // 1. Live tracked seconds from localStorage
        Object.entries(dailySecondsMap || {}).forEach(([dateKey, secs]) => {
            map[dateKey] = Math.max(1, Math.round((Number(secs) || 0) / 60));
        });

        // 2. Exam attempts (each completed attempt adds duration or 35 mins)
        if (Array.isArray(attempts)) {
            attempts.forEach((a) => {
                if (a?.isMock) return;
                const dKey = toDateKey(a?.completedAt || a?.createdAt);
                if (!dKey) return;
                const examMins = Number(a?.examId?.duration) || 35;
                map[dKey] = (map[dKey] || 0) + examMins;
            });
        }

        // 3. Attendance history sessions (each present/late session adds 45 mins of engagement)
        if (Array.isArray(attendanceHistory)) {
            attendanceHistory.forEach((h) => {
                if (h?.status === 'present' || h?.status === 'late') {
                    const dKey = toDateKey(h?.date);
                    if (dKey) {
                        map[dKey] = (map[dKey] || 0) + 45;
                    }
                }
            });
        }

        // 4. Audit / admin actions (each logged action adds 15 mins on that date)
        if (Array.isArray(auditLogs)) {
            auditLogs.forEach((log) => {
                const dKey = toDateKey(log?.createdAt);
                if (dKey) {
                    map[dKey] = (map[dKey] || 0) + 15;
                }
            });
        }

        return map;
    }, [dailySecondsMap, attempts, attendanceHistory, auditLogs]);

    // Build 52-week GitHub calendar grid ending today
    const { weeks, monthHeaders, stats } = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Start 52 weeks ago on Sunday
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 363);
        const startDayOfWeek = startDate.getDay(); // 0 = Sun
        startDate.setDate(startDate.getDate() - startDayOfWeek);

        const weeksList = [];
        const months = [];
        let lastMonth = -1;

        let totalMinutesYear = 0;
        let activeDaysCount = 0;
        let overOneHourDays = 0;
        let currentStreak = 0;

        const cursor = new Date(startDate);
        let weekIdx = 0;

        while (cursor <= today || weeksList.length < 52) {
            const week = [];
            for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
                const cellDate = new Date(cursor);
                const isFuture = cellDate > today;
                const dKey = toDateKey(cellDate);
                const mins = !isFuture && dKey ? combinedDailyMinutes[dKey] || 0 : 0;
                const level = isFuture ? -1 : getActivityLevel(mins);

                if (!isFuture && dayOfWeek === 0) {
                    const m = cellDate.getMonth();
                    if (m !== lastMonth) {
                        // Avoid crowding if first two columns change month immediately
                        if (months.length === 0 || weekIdx - months[months.length - 1].weekIdx >= 3) {
                            months.push({ month: MONTH_NAMES[m], weekIdx });
                        }
                        lastMonth = m;
                    }
                }

                if (!isFuture && mins > 0) {
                    totalMinutesYear += mins;
                    activeDaysCount += 1;
                    if (mins >= 60) overOneHourDays += 1;
                }

                week.push({
                    date: cellDate,
                    dateKey: dKey,
                    minutes: mins,
                    level,
                    isFuture,
                    isToday: dKey === toDateKey(today),
                    formattedDate: cellDate.toLocaleDateString('en-IN', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                    })
                });

                cursor.setDate(cursor.getDate() + 1);
            }
            weeksList.push(week);
            weekIdx += 1;
            if (cursor > today && weeksList.length >= 52) break;
        }

        // Calculate current daily streak backwards from today
        const streakCursor = new Date(today);
        while (true) {
            const k = toDateKey(streakCursor);
            if (k && (combinedDailyMinutes[k] || 0) > 0) {
                currentStreak += 1;
                streakCursor.setDate(streakCursor.getDate() - 1);
            } else {
                break;
            }
        }

        const todayKey = toDateKey(today);
        const todayMinutes = combinedDailyMinutes[todayKey] || 5;

        return {
            weeks: weeksList,
            monthHeaders: months,
            stats: {
                totalMinutesYear,
                totalHoursYear: (totalMinutesYear / 60).toFixed(1),
                activeDaysCount,
                overOneHourDays,
                currentStreak,
                todayMinutes
            }
        };
    }, [combinedDailyMinutes]);

    return (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-2xs space-y-5">
            {/* Top Header & Live Time Metrics */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200/70 text-emerald-700 flex items-center justify-center">
                            <Activity size={17} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                            Activity Graph
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold inline-flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Today: {formatMinutesReadable(stats.todayMinutes)}
                        </span>
                    </div>
                    <p className="text-xs text-slate-500">
                        GitHub-style daily time &amp; engagement calendar{userName ? ` for ${userName}` : ''} — light green for login, dark green for 1+ hour spent.
                    </p>
                </div>

                {/* KPI Pills */}
                <div className="flex flex-wrap items-center gap-2.5">
                    <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2">
                        <Clock size={14} className="text-emerald-600" />
                        <div className="text-xs">
                            <span className="text-slate-500 font-medium">Total Time: </span>
                            <strong className="text-slate-900">{stats.totalHoursYear} hrs</strong>
                        </div>
                    </div>
                    <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2">
                        <Calendar size={14} className="text-[#5899B5]" />
                        <div className="text-xs">
                            <span className="text-slate-500 font-medium">Active Days: </span>
                            <strong className="text-slate-900">{stats.activeDaysCount}</strong>
                        </div>
                    </div>
                    <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2">
                        <Flame size={14} className="text-amber-500" />
                        <div className="text-xs">
                            <span className="text-slate-500 font-medium">1h+ Days: </span>
                            <strong className="text-slate-900">{stats.overOneHourDays}</strong>
                            <span className="text-slate-300 mx-1.5">|</span>
                            <span className="text-slate-500 font-medium">Streak: </span>
                            <strong className="text-emerald-700">{stats.currentStreak}d</strong>
                        </div>
                    </div>
                </div>
            </div>

            {/* GitHub Calendar Matrix */}
            <div className="overflow-x-auto pb-2 custom-scrollbar">
                <div className="inline-block min-w-[760px]">
                    {/* Month Headers Row */}
                    <div className="flex items-center mb-1.5 pl-9 relative h-4">
                        {monthHeaders.map((m, idx) => (
                            <span
                                key={`${m.month}-${idx}`}
                                className="text-[11px] font-semibold text-slate-400 absolute"
                                style={{ left: `${36 + m.weekIdx * 16}px` }}
                            >
                                {m.month}
                            </span>
                        ))}
                    </div>

                    {/* Day Labels + 52/53 Week Columns */}
                    <div className="flex items-start gap-2">
                        {/* Day-of-Week Labels (Mon, Wed, Fri) */}
                        <div className="flex flex-col gap-[3px] pr-1 pt-[1px] select-none w-7 shrink-0">
                            {DAY_LABELS.map((d) => (
                                <div
                                    key={d.idx}
                                    className="h-[13px] text-[10px] font-semibold text-slate-400 leading-[13px] flex items-center"
                                >
                                    {d.show ? d.label : ''}
                                </div>
                            ))}
                        </div>

                        {/* Week Columns */}
                        <div className="flex items-center gap-[3px]">
                            {weeks.map((week, wIdx) => (
                                <div key={wIdx} className="flex flex-col gap-[3px]">
                                    {week.map((cell, dIdx) => {
                                        if (cell.isFuture) {
                                            return (
                                                <div
                                                    key={dIdx}
                                                    className="w-[13px] h-[13px] rounded-[3px] bg-transparent"
                                                />
                                            );
                                        }
                                        return (
                                            <div
                                                key={cell.dateKey || dIdx}
                                                onMouseEnter={() => setHoveredCell(cell)}
                                                onMouseLeave={() => setHoveredCell(null)}
                                                title={`${cell.formattedDate}: ${formatMinutesReadable(cell.minutes)} (${LEVEL_LABELS[cell.level]})`}
                                                className={`w-[13px] h-[13px] rounded-[3px] border transition-transform cursor-pointer ${
                                                    LEVEL_STYLES[cell.level]
                                                } ${cell.isToday ? 'ring-2 ring-slate-900 ring-offset-1' : ''}`}
                                            />
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Legend & Active Cell Inspector */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-slate-500">
                    {hoveredCell ? (
                        <span className="font-semibold text-slate-800">
                            {hoveredCell.formattedDate}:{' '}
                            <strong className="text-emerald-700">
                                {formatMinutesReadable(hoveredCell.minutes)}
                            </strong>{' '}
                            <span className="text-slate-400">({LEVEL_LABELS[hoveredCell.level]})</span>
                        </span>
                    ) : (
                        <>
                            <span className="inline-flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded-[3px] bg-[#9be9a8] border border-[#7cd88c] inline-block" />
                                <span>Light Green: Login (&lt; 30m)</span>
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded-[3px] bg-[#40c463] border border-[#33ad54] inline-block" />
                                <span>Medium Green: 30m – 1 hr</span>
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded-[3px] bg-[#30a14e] border border-[#268840] inline-block" />
                                <span>Dark Green: 1+ Hour</span>
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded-[3px] bg-[#216e39] border border-[#18542b] inline-block" />
                                <span>Deep Green: 2+ Hours</span>
                            </span>
                        </>
                    )}
                </div>

                {/* GitHub Less -> More Swatch Strip */}
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 shrink-0 self-end sm:self-auto">
                    <span>Less</span>
                    {[0, 1, 2, 3, 4].map((lvl) => (
                        <span
                            key={lvl}
                            title={LEVEL_LABELS[lvl]}
                            className={`w-3.5 h-3.5 rounded-[3px] border inline-block ${LEVEL_STYLES[lvl]}`}
                        />
                    ))}
                    <span>More</span>
                </div>
            </div>
        </div>
    );
};

export default ActivityHeatmapGraph;
