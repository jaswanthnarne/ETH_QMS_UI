import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    School, BookOpen, Users, FileText, TrendingUp, Loader2, Activity,
    ChevronRight, Building2, UserPlus, Download, ShieldCheck, User,
    GraduationCap, Trash2, Copy, Book, Clock
} from 'lucide-react';
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer
} from 'recharts';
import useAuthStore from '../store/authStore';
import useCollegeStore from '../store/collegeStore';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const StatCard = ({ label, value, icon: Icon, color, loading, onClick }) => {
    let bgClass = "bg-blue-50 text-blue-600";
    let borderHover = "hover:border-blue-200";

    if (color.includes("indigo")) {
        bgClass = "bg-indigo-50 text-indigo-650";
        borderHover = "hover:border-indigo-200";
    } else if (color.includes("purple")) {
        bgClass = "bg-purple-50 text-purple-650";
        borderHover = "hover:border-purple-200";
    } else if (color.includes("emerald")) {
        bgClass = "bg-emerald-50 text-emerald-600";
        borderHover = "hover:border-emerald-200";
    } else if (color.includes("orange")) {
        bgClass = "bg-orange-50 text-orange-600";
        borderHover = "hover:border-orange-200";
    } else if (color.includes("blue")) {
        bgClass = "bg-blue-50 text-blue-600";
        borderHover = "hover:border-blue-200";
    }

    return (
        <motion.div
            whileHover={onClick ? { y: -2, scale: 1.005 } : { y: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={onClick}
            className={`bg-white p-5 rounded-2xl border border-slate-100 hover:shadow-md hover:shadow-slate-100/30 transition-all flex items-center gap-4 ${onClick ? 'cursor-pointer' : ''} ${borderHover}`}
        >
            <div className={`w-10 h-10 rounded-xl ${bgClass} flex items-center justify-center flex-shrink-0 transition-transform duration-300`}>
                <Icon size={18} />
            </div>

            <div className="space-y-0.5 flex-1 min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    {label}
                </p>
                {loading ? (
                    <div className="h-6 w-16 bg-slate-100 animate-pulse rounded-md mt-1" />
                ) : (
                    <h3 className="text-2xl font-bold tracking-tight text-slate-900 leading-none mt-0.5">
                        {value}
                    </h3>
                )}
            </div>
        </motion.div>
    );
};

/* ── Audit Action Helpers ── */
const ACTION_ICONS = {
    CREATE_COLLEGE: { icon: GraduationCap, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    UPDATE_COLLEGE: { icon: GraduationCap, color: 'text-blue-600', bg: 'bg-blue-50' },
    DELETE_COLLEGE: { icon: Trash2, color: 'text-red-600', bg: 'bg-red-50' },
    CREATE_TRAINER: { icon: User, color: 'text-violet-600', bg: 'bg-violet-50' },
    DELETE_TRAINER: { icon: Trash2, color: 'text-red-600', bg: 'bg-red-50' },
    CREATE_EXAM: { icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    DELETE_EXAM: { icon: Trash2, color: 'text-red-600', bg: 'bg-red-50' },
    CLONE_EXAM: { icon: Copy, color: 'text-amber-600', bg: 'bg-amber-50' },
    BULK_IMPORT_QUESTIONS: { icon: Book, color: 'text-teal-600', bg: 'bg-teal-50' },
};
const ACTION_LABELS = {
    CREATE_COLLEGE: 'Created College', UPDATE_COLLEGE: 'Updated College',
    DELETE_COLLEGE: 'Deleted College', CREATE_TRAINER: 'Created Trainer',
    DELETE_TRAINER: 'Deleted Trainer', CREATE_EXAM: 'Created Exam',
    DELETE_EXAM: 'Deleted Exam', CLONE_EXAM: 'Cloned Exam',
    BULK_IMPORT_QUESTIONS: 'Bulk Imported Questions',
};

const getActionMeta = (action) => ACTION_ICONS[action] || { icon: ShieldCheck, color: 'text-slate-600', bg: 'bg-slate-100' };

const formatTimeAgo = (iso) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
};

/* ── Custom Chart Tooltip ── */
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900 text-white p-3 rounded-xl border border-slate-800 shadow-2xl text-xs">
                <p className="font-bold mb-1">{label}</p>
                {payload.map((p, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color || p.fill }} />
                        <span>{p.name}: <b>{p.value}</b></span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

const Dashboard = () => {
    const navigate = useNavigate();
    const { user, token } = useAuthStore();
    const { selectedCollegeId, selectedCollegeName } = useCollegeStore();
    const [stats, setStats] = useState({ colleges: 0, courses: 0, trainers: 0, exams: 0, attempts: 0 });
    const [loading, setLoading] = useState(true);
    const [recentLogs, setRecentLogs] = useState([]);
    const [logsLoading, setLogsLoading] = useState(true);
    const [analytics, setAnalytics] = useState(null);
    const [analyticsLoading, setAnalyticsLoading] = useState(true);

    // Fetch dashboard stats
    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const url = selectedCollegeId
                    ? `${API}/admin/dashboard-stats?collegeId=${selectedCollegeId}`
                    : `${API}/admin/dashboard-stats`;
                const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
                setStats(res.data.data);
            } catch (error) { console.error('Failed to fetch stats', error); }
            finally { setLoading(false); }
        };
        if (token) fetchStats();
    }, [token, selectedCollegeId]);

    // Fetch real audit logs for recent activity
    useEffect(() => {
        const fetchLogs = async () => {
            setLogsLoading(true);
            try {
                const res = await axios.get(`${API}/audit/logs?limit=6&page=1`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setRecentLogs(res.data.data || []);
            } catch (error) { console.error('Failed to fetch audit logs', error); }
            finally { setLogsLoading(false); }
        };
        if (token) fetchLogs();
    }, [token]);

    // Fetch real analytics for performance charts
    useEffect(() => {
        const fetchAnalytics = async () => {
            setAnalyticsLoading(true);
            try {
                let url = `${API}/analytics/college-stats?days=7`;
                if (selectedCollegeId) {
                    const cid = user.role === 'college_admin' ? user.collegeId : selectedCollegeId;
                    url = `${API}/analytics/college-stats?collegeId=${cid}&days=7`;
                }
                const res = await axios.get(url, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAnalytics(res.data.data);
            } catch (error) { console.error('Failed to fetch analytics', error); }
            finally { setAnalyticsLoading(false); }
        };
        if (token) fetchAnalytics();
    }, [token, selectedCollegeId, user]);

    const handleExport = async (type, id, title) => {
        try {
            const params = new URLSearchParams({ type });
            if (id && id !== 'all') params.set('id', id);
            const response = await axios.get(`${API}/analytics/export?${params}`, {
                headers: { Authorization: `Bearer ${token}` }, responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${title}_Report.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) { alert('Export failed. Please try again.'); }
    };

    const statCards = [
        { label: 'Colleges', value: stats.colleges, icon: School, color: 'bg-blue-600', roles: ['super_admin'] },
        { label: 'Courses', value: stats.courses, icon: BookOpen, color: 'bg-indigo-600' },
        { label: 'Trainers', value: stats.trainers || 0, icon: UserPlus, color: 'bg-purple-600' },
        { label: 'Exams', value: stats.exams, icon: FileText, color: 'bg-emerald-600' },
        { label: 'Attempts', value: stats.attempts || 0, icon: Users, color: 'bg-orange-600' },
    ];

    /* ── Active Trainers Panel (Global view) ── */
    const ActiveTrainersPanel = () => (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col h-full shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <UserPlus size={18} className="text-[#004AAD]" />
                    <h3 className="text-lg font-bold text-slate-900">Active Trainers</h3>
                </div>
                <button onClick={() => navigate('/admin/trainers')} className="text-xs font-semibold text-[#004AAD] hover:underline flex items-center gap-1">
                    Manage <ChevronRight size={14} />
                </button>
            </div>
            
            <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-64">
                {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex gap-3 p-3 rounded-lg border border-slate-100">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 animate-pulse flex-shrink-0" />
                            <div className="flex-1 space-y-2 py-1">
                                <div className="h-3.5 bg-slate-100 animate-pulse rounded w-3/4" />
                                <div className="h-3 bg-slate-50 animate-pulse rounded w-1/2" />
                            </div>
                        </div>
                    ))
                ) : !stats.activeTrainers || stats.activeTrainers.length === 0 ? (
                    <div className="py-8 text-center text-slate-400">
                        <UserPlus size={24} className="mx-auto text-slate-200 mb-2" />
                        <p className="text-sm">No trainers available</p>
                    </div>
                ) : (
                    stats.activeTrainers.map((trainer) => (
                        <div key={trainer.id} className="relative group flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-[#004AAD]/20 hover:bg-blue-50/30 transition-all cursor-default">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#004AAD] flex items-center justify-center font-bold text-sm">
                                {trainer.initials}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-slate-900 truncate">{trainer.name}</h4>
                                <p className="text-xs text-slate-500 truncate">{trainer.collegeName}</p>
                            </div>
                            
                            {/* Hover tooltip for stats */}
                            <div className="absolute right-full mr-2 inset-y-0 flex items-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                <div className="bg-slate-900 text-white text-xs whitespace-nowrap p-3 rounded-xl shadow-lg flex gap-3">
                                    <div className="flex flex-col">
                                        <span className="text-slate-450 text-[10px] uppercase font-semibold tracking-wider">College</span>
                                        <span className="font-semibold">{trainer.collegeName}</span>
                                    </div>
                                    <div className="w-px bg-slate-750" />
                                    <div className="flex flex-col">
                                        <span className="text-slate-450 text-[10px] uppercase font-semibold tracking-wider">Tests Done</span>
                                        <span className="font-semibold text-emerald-450">{trainer.testsDone} tests</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="text-right">
                                <div className="text-xs font-semibold text-[#004AAD] bg-blue-50 px-2.5 py-1 rounded-lg">
                                    {trainer.testsDone} tests
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );

    /* ── Recent Activity Panel (shared by both views) ── */
    const RecentActivityPanel = () => (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
                <button onClick={() => navigate('/admin/audit')} className="text-xs font-semibold text-[#004AAD] hover:underline flex items-center gap-1">
                    View all <ChevronRight size={14} />
                </button>
            </div>
            <div className="space-y-1">
                {logsLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex gap-3 p-3 rounded-lg">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 animate-pulse flex-shrink-0" />
                            <div className="flex-1 space-y-2">
                                <div className="h-3.5 bg-slate-100 animate-pulse rounded w-3/4" />
                                <div className="h-3 bg-slate-50 animate-pulse rounded w-1/2" />
                            </div>
                        </div>
                    ))
                ) : recentLogs.length === 0 ? (
                    <div className="py-10 text-center">
                        <ShieldCheck size={28} className="mx-auto text-slate-200 mb-2" />
                        <p className="text-xs text-slate-400">No activity recorded yet</p>
                    </div>
                ) : (
                    recentLogs.map((log) => {
                        const meta = getActionMeta(log.action);
                        const IconComp = meta.icon;
                        return (
                            <div key={log._id} className="flex gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                                <div className={`w-8 h-8 rounded-lg ${meta.bg} flex items-center justify-center flex-shrink-0`}>
                                    <IconComp size={14} className={meta.color} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-900 truncate">
                                        {ACTION_LABELS[log.action] || log.action}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                                        {log.targetName || '—'} <span className="text-slate-300 mx-1">·</span> {log.userName}
                                    </p>
                                    <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-1">
                                        <Clock size={10} /> {formatTimeAgo(log.createdAt)}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );

    /* ── Performance Charts Panel ── */
    const PerformancePanel = () => (
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Activity size={20} className="text-slate-400" />
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Performance Overview</h3>
                        <p className="text-xs text-slate-450 mt-0.5">Last 7 days submission trends</p>
                    </div>
                </div>
                {analytics?.summary && (
                    <div className="hidden sm:flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Pass Rate</p>
                            <p className="text-lg font-bold text-emerald-600">{analytics.summary.passRate}%</p>
                        </div>
                        <div className="w-px h-8 bg-slate-100" />
                        <div className="text-right">
                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Avg Score</p>
                            <p className="text-lg font-bold text-[#004AAD]">{analytics.summary.avgScore}%</p>
                        </div>
                    </div>
                )}
            </div>

            {analyticsLoading ? (
                <div className="h-64 flex items-center justify-center">
                    <Loader2 size={24} className="animate-spin text-slate-300" />
                </div>
            ) : !analytics || !analytics.timeline || analytics.timeline.every(t => t.attempts === 0) ? (
                <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg border-2 border-dashed border-slate-100">
                    <div className="text-center">
                        <TrendingUp size={40} className="text-slate-200 mx-auto mb-3" />
                        <p className="text-sm font-medium text-slate-400">No assessment data available yet</p>
                        <p className="text-xs text-slate-300 mt-1">Charts will appear once students complete exams</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Timeline Chart */}
                    <div className="lg:col-span-3 h-64">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <AreaChart data={analytics.timeline}>
                                <defs>
                                    <linearGradient id="dashGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#004AAD" stopOpacity={0.12} />
                                        <stop offset="95%" stopColor="#004AAD" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }} dy={8} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="attempts" name="Submissions" stroke="#004AAD" strokeWidth={2.5} fillOpacity={1} fill="url(#dashGrad)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Score Distribution */}
                    <div className="lg:col-span-2 h-64">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Score Distribution</p>
                        <ResponsiveContainer width="100%" height="90%" minWidth={0}>
                            <BarChart data={analytics.distribution} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="range" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#475569' }} width={55} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="count" name="Students" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={16} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </div>
    );

    // ═══════════════ Global view (no college selected) ═══════════════
    if (!selectedCollegeId) {
        const visibleCards = statCards.filter(card => !card.roles || card.roles.includes(user?.role));
        const gridColsClass = visibleCards.length === 5 
            ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5' 
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';

        return (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            Platform Dashboard
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">Overview of the entire platform</p>
                    </div>
                    <button
                        onClick={() => handleExport('overall', null, 'Overall_Platform')}
                        title="Exports all student attempt data across every college, course and exam as a multi-sheet Excel file"
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#004AAD] text-white text-sm font-semibold rounded-lg hover:bg-[#003580] transition-colors shadow-sm active:scale-95 cursor-pointer"
                    >
                        <Download size={16} /> Export Master Report
                    </button>
                </div>

                {/* Stats */}
                <div className={`grid ${gridColsClass} gap-6`}>
                    {visibleCards.map((card, i) => <StatCard key={i} {...card} loading={loading} />)}
                </div>

                {/* Recent Activity + Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Quick Actions */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div onClick={() => navigate('/admin/colleges')} className="bg-white p-8 rounded-3xl border border-slate-200/80 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group flex flex-col justify-between shadow-sm">
                            <div>
                                <div className="w-14 h-14 bg-blue-50 text-[#004AAD] rounded-2xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                                    <Building2 size={28} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">Manage Colleges</h3>
                                <p className="text-sm text-slate-500 mb-4">Add, edit, or remove institutional profiles from the system.</p>
                            </div>
                            <span className="text-sm text-[#004AAD] font-semibold flex items-center gap-1">Open <ChevronRight size={16} /></span>
                        </div>

                        <div onClick={() => navigate('/admin/trainers')} className="bg-white p-8 rounded-3xl border border-slate-200/80 hover:shadow-md hover:border-purple-200 transition-all cursor-pointer group flex flex-col justify-between shadow-sm">
                            <div>
                                <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                                    <UserPlus size={28} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">Manage Trainers</h3>
                                <p className="text-sm text-slate-500 mb-4">Onboard new trainers and manage credentials for assessments.</p>
                            </div>
                            <span className="text-sm text-purple-600 font-semibold flex items-center gap-1">Open <ChevronRight size={16} /></span>
                        </div>
                    </div>

                    {/* Recent Activity (real audit logs) & Active Trainers */}
                    <ActiveTrainersPanel />
                    <div className="lg:col-span-2">
                        <RecentActivityPanel />
                    </div>
                </div>
            </div>
        );
    }

    // ═══════════════ College-specific view ═══════════════
    const visibleCollegeCards = statCards.filter(card => !card.roles || card.roles.includes(user?.role));
    const collegeGridColsClass = visibleCollegeCards.length === 5
        ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'
        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 bg-blue-50 text-[#004AAD] text-xs font-semibold rounded-md">{selectedCollegeName}</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">College Dashboard</h1>
                    <p className="text-sm text-slate-500 mt-1">Performance overview and quick management</p>
                </div>
                <button
                    onClick={() => handleExport('college', selectedCollegeId, selectedCollegeName)}
                    title="Exports all student results, trainer summaries, and course breakdowns for this college as a multi-sheet Excel report"
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#004AAD] text-white text-sm font-semibold rounded-lg hover:bg-[#003580] transition-colors shadow-sm active:scale-95 cursor-pointer"
                >
                    <Download size={16} /> Export College Report
                </button>
            </div>

            {/* Stats */}
            <div className={`grid ${collegeGridColsClass} gap-6`}>
                {visibleCollegeCards.map((card, i) => {
                    if (card.roles && !card.roles.includes(user?.role)) return null;
                    return <StatCard key={i} {...card} loading={loading} />;
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Performance Overview — Real Charts */}
                <PerformancePanel />

                {/* Recent Activity — Real Audit Logs */}
                <RecentActivityPanel />
            </div>
        </div>
    );
};

export default Dashboard;
