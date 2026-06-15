import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { BarChart3, Download, Users, BookOpen, TrendingUp, ShieldCheck, Building, Filter, Calendar, School } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { motion } from 'framer-motion';
import useAuthStore from '../../store/authStore';
import useCollegeStore from '../../store/collegeStore';
import useSocketUpdate from '../../hooks/useSocketUpdate';

const MetricCard = ({ label, value, icon: Icon, color, subtitle }) => {
    let bgClass = "bg-blue-50 text-blue-600";
    let borderHover = "hover:border-slate-350";

    if (color === "emerald") {
        bgClass = "bg-emerald-50 text-emerald-600";
        borderHover = "hover:border-slate-350";
    } else if (color === "blue") {
        bgClass = "bg-blue-50 text-blue-600";
        borderHover = "hover:border-slate-350";
    } else if (color === "indigo") {
        bgClass = "bg-indigo-50 text-indigo-650";
        borderHover = "hover:border-slate-350";
    } else if (color === "orange") {
        bgClass = "bg-orange-50 text-orange-600";
        borderHover = "hover:border-slate-350";
    }

    return (
        <motion.div
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`bg-white p-5 rounded-xl border border-slate-200 transition-all flex items-center gap-4 ${borderHover}`}
        >
            <div className={`w-10 h-10 rounded-xl ${bgClass} flex items-center justify-center flex-shrink-0 transition-transform duration-300`}>
                <Icon size={18} />
            </div>

            <div className="space-y-0.5 flex-1 min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    {label}
                </p>
                <h3 className="text-2xl font-bold tracking-tight text-slate-900 leading-none mt-0.5">
                    {value ?? '—'}
                </h3>
                {subtitle && <p className="text-[10px] text-slate-400 font-medium pt-0.5">{subtitle}</p>}
            </div>
        </motion.div>
    );
};

const Analytics = () => {
    const { token, user } = useAuthStore();
    const { selectedCollegeId, selectedCollegeName, setSelectedCollege: setGlobalCollege, clearSelectedCollege: clearGlobalCollege } = useCollegeStore();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [colleges, setColleges] = useState([]);
    const [filters, setFilters] = useState({ 
        collegeId: user?.role === 'college_admin' 
            ? user.collegeId 
            : (selectedCollegeId || (user?.role === 'trainer' && user?.collegeId ? user.collegeId : '')),
        trainerId: '', 
        courseId: '', 
        timeRange: '7d' 
    });
    const [filterData, setFilterData] = useState({ trainers: [], courses: [] });
    const [isInitialized, setIsInitialized] = useState(false);
    const latestRequestRef = useRef(0);

    // Fetch colleges list for super admin and trainers
    useEffect(() => {
        if (user?.role === 'super_admin' || user?.role === 'trainer') {
            axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/colleges`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => {
                if (res.data.success) {
                    setColleges(res.data.data || []);
                }
            }).catch(e => console.error('Failed to fetch colleges for filters', e));
        }
    }, [user, token]);

    // Keep store college selection in sync with filters
    useEffect(() => {
        if (user?.role !== 'college_admin') {
            if (!isInitialized) {
                if (selectedCollegeId) {
                    setFilters(f => ({ ...f, collegeId: selectedCollegeId, trainerId: '', courseId: '' }));
                    setIsInitialized(true);
                } else if (user?.role === 'trainer' && user?.collegeId) {
                    setFilters(f => ({ ...f, collegeId: user.collegeId, trainerId: '', courseId: '' }));
                    if (colleges.length > 0) {
                        const coll = colleges.find(c => c._id === user.collegeId);
                        if (coll) {
                            setGlobalCollege(coll._id, coll.name, coll.code);
                            setIsInitialized(true);
                        }
                    }
                } else {
                    setFilters(f => ({ ...f, collegeId: '', trainerId: '', courseId: '' }));
                    setIsInitialized(true);
                }
            } else {
                setFilters(f => ({ ...f, collegeId: selectedCollegeId || '', trainerId: '', courseId: '' }));
            }
        }
    }, [selectedCollegeId, user, colleges, isInitialized, setGlobalCollege]);


    const fetchFilters = useCallback(async () => {
        if (user?.role === 'trainer') return;
        try {
            const cid = user?.role === 'college_admin' ? user.collegeId : filters.collegeId;
            const queryParams = cid ? `?collegeId=${cid}` : '';
            const [tRes, cRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/trainers${queryParams}`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/courses${queryParams}`, { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setFilterData({ trainers: tRes.data.data, courses: cRes.data.data });
        } catch (e) { console.error('Failed to fetch filter data', e); }
    }, [filters.collegeId, token, user]);

    // Reactive trainers and courses re-fetching on college change
    useEffect(() => {
        if (token && user) {
            fetchFilters();
        }
    }, [fetchFilters, token, user]);

    const fetchData = async () => {
        const requestId = ++latestRequestRef.current;
        try {
            setLoading(true);
            let url;
            const cid = user.role === 'college_admin' ? user.collegeId : filters.collegeId;
            const days = filters.timeRange.replace('d', '');
            if (user.role === 'trainer') {
                const params = new URLSearchParams({ days });
                if (filters.collegeId) params.append('collegeId', filters.collegeId);
                url = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/analytics/trainer-stats?${params.toString()}`;
            } else {
                const params = new URLSearchParams({ days });
                if (cid) params.append('collegeId', cid);
                if (filters.courseId) params.append('courseId', filters.courseId);
                if (filters.trainerId) params.append('trainerId', filters.trainerId);
                url = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/analytics/college-stats?${params.toString()}`;
            }
            const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
            if (requestId === latestRequestRef.current) {
                setStats(res.data.data);
            }
        } catch (e) { 
            if (requestId === latestRequestRef.current) console.error('Failed to fetch analytics', e); 
        } finally { 
            if (requestId === latestRequestRef.current) setLoading(false); 
        }
    };

    useEffect(() => { fetchData(); }, [filters.collegeId, token, user, filters.courseId, filters.trainerId, filters.timeRange]);

    useSocketUpdate(() => {
        fetchData();
        fetchFilters();
    }, ['colleges', 'trainers', 'courses', 'exams']);

    const handleExport = async (type, id, title) => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/analytics/export?type=${type}&id=${id}`, { headers: { Authorization: `Bearer ${token}` }, responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const a = document.createElement('a'); a.href = url; a.setAttribute('download', `${title}_Performance_Report.xlsx`); document.body.appendChild(a); a.click(); a.remove();
        } catch { alert('Export failed'); }
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900/95 text-white p-4 rounded-2xl border border-slate-800 shadow-lg text-xs backdrop-blur-md">
                    <p className="font-bold text-slate-200 mb-2 border-b border-slate-800/80 pb-1">{label}</p>
                    {payload.map((p, i) => (
                        <div key={i} className="flex items-center gap-2 mt-1.5">
                            <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: p.color || p.fill }} />
                            <span className="text-slate-300">{p.name}: <b className="text-white font-bold">{p.value}</b></span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header & Controls Panel */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        Performance Insights
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Real-time assessment intelligence and institutional metrics</p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-wrap">
                    {user.role !== 'trainer' && (
                        <>
                            {user.role === 'super_admin' && (
                                selectedCollegeId ? (
                                    <div className="flex items-center gap-2 bg-blue-50 text-[#004AAD] px-3.5 py-2.5 rounded-lg border border-blue-150 shadow-sm">
                                        <School size={15} className="text-[#004AAD] flex-shrink-0" />
                                        <span className="text-xs font-bold">
                                            College: {selectedCollegeName || 'Managed College'}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-2.5 border border-slate-200 rounded-lg shadow-sm">
                                        <School size={15} className="text-slate-400 flex-shrink-0" />
                                        <select
                                            className="text-xs font-semibold text-slate-650 bg-transparent outline-none cursor-pointer pr-4 border-none"
                                            value={filters.collegeId}
                                            onChange={(e) => setFilters({ ...filters, collegeId: e.target.value, trainerId: '', courseId: '' })}
                                        >
                                            <option value="">All Colleges (Overall)</option>
                                            {colleges.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                )
                            )}
                            <div className="flex items-center gap-2 bg-slate-50 px-3 py-2.5 border border-slate-200 rounded-lg shadow-sm">
                                <Filter size={15} className="text-slate-400 flex-shrink-0" />
                                <select
                                    className="text-xs font-semibold text-slate-650 bg-transparent outline-none cursor-pointer pr-4 border-none"
                                    value={filters.courseId}
                                    onChange={(e) => setFilters({ ...filters, courseId: e.target.value })}
                                >
                                    <option value="">All Courses (Overall)</option>
                                    {filterData.courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div className="flex items-center gap-2 bg-slate-50 px-3 py-2.5 border border-slate-200 rounded-lg shadow-sm">
                                <Building size={15} className="text-slate-400 flex-shrink-0" />
                                <select
                                    className="text-xs font-semibold text-slate-650 bg-transparent outline-none cursor-pointer pr-4 border-none"
                                    value={filters.trainerId}
                                    onChange={(e) => setFilters({ ...filters, trainerId: e.target.value })}
                                >
                                    <option value="">All Trainers (Overall)</option>
                                    {filterData.trainers.map(t => <option key={t._id} value={t._id}>{t.firstName} {t.lastName}</option>)}
                                </select>
                            </div>
                        </>
                    )}
                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-2.5 border border-slate-200 rounded-lg shadow-sm">
                        <Calendar size={15} className="text-slate-400 flex-shrink-0" />
                        <select
                            className="text-xs font-semibold text-slate-650 bg-transparent outline-none cursor-pointer pr-4 border-none"
                            value={filters.timeRange}
                            onChange={(e) => setFilters({ ...filters, timeRange: e.target.value })}
                        >
                            <option value="7d">Last 7 Days</option>
                            <option value="30d">Last 30 Days</option>
                            <option value="90d">Last 90 Days</option>
                            <option value="all">All Time</option>
                        </select>
                    </div>
                    <button
                        onClick={() => {
                            const cid = user.role === 'college_admin' ? user.collegeId : (filters.collegeId || '');
                            const exportType = cid ? 'college' : 'overall';
                            let exportName = 'Overall_Platform';
                            if (cid) {
                                const matched = colleges.find(c => c._id === cid);
                                if (matched) exportName = matched.name;
                                else exportName = selectedCollegeName || 'College';
                            }
                            handleExport(exportType, cid, exportName);
                        }}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#004AAD] hover:bg-[#003580] text-white font-semibold rounded-lg text-sm transition-all shadow-sm active:scale-95 cursor-pointer"
                    >
                        <Download size={14} /> Export Report
                    </button>
                    {((user?.role === 'super_admin' && filters.collegeId && !selectedCollegeId) || filters.courseId || filters.trainerId) && (
                        <button 
                            onClick={() => setFilters({ 
                                ...filters, 
                                collegeId: (user?.role === 'super_admin' && !selectedCollegeId) ? '' : filters.collegeId, 
                                courseId: '', 
                                trainerId: '' 
                            })} 
                            className="flex items-center justify-center px-4 py-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-600 font-semibold rounded-lg text-xs transition-all active:scale-95"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
            </div>

            {/* Top Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard label="Global Pass Rate" value={stats?.summary?.passRate !== undefined ? `${stats.summary.passRate}%` : '—'} icon={ShieldCheck} color="emerald" subtitle="Success benchmarks met" />
                <MetricCard label="Mean Performance" value={stats?.summary?.avgScore !== undefined ? `${stats.summary.avgScore}%` : '—'} icon={TrendingUp} color="blue" subtitle="Average across all courses" />
                <MetricCard label="Total Submissions" value={stats?.summary?.totalAttempts !== undefined ? stats.summary.totalAttempts : '—'} icon={Users} color="indigo" subtitle="Enrolled student attempts" />
                <MetricCard label="Learning Assets" value={stats?.summary?.totalExams !== undefined ? stats.summary.totalExams : '—'} icon={BookOpen} color="orange" subtitle="Active assessments" />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Engagement Timeline */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Submission Velocity</h3>
                            <p className="text-xs font-semibold text-slate-400 mt-0.5">Assessment attempts over time</p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-[#004AAD] text-[10px] font-bold rounded-lg uppercase tracking-wider">
                            <Calendar size={12} /> Active Window
                        </div>
                    </div>
                    <div className="h-[300px] w-full mt-2 relative">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <AreaChart data={stats?.timeline || []}>
                                <defs>
                                    <linearGradient id="colorAttempts" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#004AAD" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#004AAD" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="attempts" name="Submissions" stroke="#004AAD" strokeWidth={2.5} fillOpacity={1} fill="url(#colorAttempts)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Score Distribution */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col">
                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-slate-900 tracking-tight">Score Distribution</h3>
                        <p className="text-xs font-semibold text-slate-400 mt-0.5">Frequency of student percentages</p>
                    </div>
                    <div className="h-[300px] w-full mt-2 relative">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <BarChart data={stats?.distribution || []} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="range" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#475569' }} width={60} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="count" name="Students" fill="#6366f1" radius={[0, 6, 6, 0]} barSize={16} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Performance Rankings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Trainer Leaderboard */}
                {stats?.trainers ? (
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                            <h3 className="font-bold text-slate-900 text-sm">Trainer Efficacy</h3>
                            <span className="text-[10px] font-semibold text-[#004AAD] bg-blue-50 px-2.5 py-1 rounded-md tracking-wider">TOP PERFORMERS</span>
                        </div>
                        <div className="p-4 space-y-2 max-h-[440px] overflow-y-auto custom-scrollbar">
                            {stats.trainers.map((t, i) => (
                                <motion.div 
                                    whileHover={{ scale: 1.005 }}
                                    key={i} 
                                    className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-slate-350 hover:bg-slate-50/50 transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#004AAD] flex items-center justify-center font-bold text-sm">
                                            {t.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-sm">{t.name}</h4>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-[9px] font-semibold text-slate-400 tracking-wider uppercase">{t.totalStudents} attempts</span>
                                                <span className="text-[9px] font-semibold text-[#004AAD] tracking-wider uppercase">Avg {t.avgScore}%</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <span className="text-sm font-bold text-emerald-600 block">{t.passRate}%</span>
                                            <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">PASS RATE</span>
                                        </div>
                                        <button 
                                            onClick={() => handleExport('trainer', t.trainerId, t.name)} 
                                            className="p-2.5 text-slate-400 hover:text-[#004AAD] hover:bg-blue-50/50 rounded-xl active:scale-95 transition-all" 
                                            title="Export trainer report"
                                        >
                                            <Download size={16} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                            {!stats.trainers.length && <div className="py-20 text-center"><div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4"><Users className="text-slate-200" /></div><p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">No trainer data available</p></div>}
                        </div>
                    </div>
                ) : null}

                {/* Course Rankings */}
                {stats?.courses ? (
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                            <h3 className="font-bold text-slate-900 text-sm">Course Attainment</h3>
                            <span className="text-[10px] font-semibold text-[#004AAD] bg-blue-50 px-2.5 py-1 rounded-md tracking-wider">CURRICULUM IMPACT</span>
                        </div>
                        <div className="p-4 space-y-2 max-h-[440px] overflow-y-auto custom-scrollbar">
                            {stats.courses.map((c, i) => (
                                <motion.div 
                                    whileHover={{ scale: 1.005 }}
                                    key={i} 
                                    className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-slate-350 hover:bg-slate-50/50 transition-all group"
                                >
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-50 text-[#004AAD] flex items-center justify-center font-semibold text-xs">
                                            {c.code}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{c.name}</h4>
                                            <div className="flex items-center gap-3 mt-1.5">
                                                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden relative">
                                                    <div className="h-full bg-[#004AAD] rounded-full transition-all duration-1000" style={{ width: `${c.passRate}%` }} />
                                                </div>
                                                <span className="text-xs font-bold text-[#004AAD] min-w-[35px] text-right">{c.passRate}%</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleExport('course', c.courseId, c.name)} 
                                        className="ml-4 p-2.5 text-slate-400 hover:text-[#004AAD] hover:bg-blue-50/50 rounded-xl active:scale-95 transition-all"
                                    >
                                        <Download size={16} />
                                    </button>
                                </motion.div>
                            ))}
                            {!stats.courses.length && <div className="py-20 text-center"><div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4"><BookOpen className="text-slate-200" /></div><p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">No course data available</p></div>}
                        </div>
                    </div>
                ) : null}
            </div>

            {/* Individual Exams Table/List */}
            {stats?.exams && stats.exams.length > 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-6 overflow-hidden">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-bold text-slate-900 text-base">Assessment Granularity</h3>
                            <p className="text-xs font-medium text-slate-400 mt-1">Drill-down into individual exam results</p>
                        </div>
                        <BarChart3 size={20} className="text-slate-400" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {stats.exams.map((exam, i) => (
                            <motion.div 
                                whileHover={{ y: -4, scale: 1.005 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                key={i} 
                                className="relative p-6 rounded-xl border border-slate-200 bg-slate-50/30 hover:bg-white hover:border-slate-350 transition-all group overflow-hidden border-l-4 border-l-[#004AAD]"
                            >
                                <h4 className="font-bold text-slate-900 text-sm mb-4 line-clamp-2 h-10 group-hover:text-[#004AAD] transition-colors">{exam.title}</h4>
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="p-3 bg-white rounded-xl border border-slate-100">
                                        <span className="block text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Submissions</span>
                                        <span className="text-lg font-bold text-slate-900 mt-0.5 block">{exam.totalStudents}</span>
                                    </div>
                                    <div className="p-3 bg-white rounded-xl border border-slate-100">
                                        <span className="block text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Avg Score</span>
                                        <span className="text-lg font-bold text-[#004AAD] mt-0.5 block">{exam.avgScore}%</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                    <div className="flex flex-col">
                                        <span className="text-[8px] font-semibold text-slate-400 uppercase tracking-wider">Success Rate</span>
                                        <span className="text-xs font-bold text-emerald-600 mt-0.5">{exam.passRate}%</span>
                                    </div>
                                    <button 
                                        onClick={() => handleExport('exam', exam.id || exam.examId, exam.title)} 
                                        className="flex items-center gap-1.5 px-4 py-2 bg-[#004AAD] hover:bg-[#004AAD]/95 text-white font-semibold rounded-xl text-[10px] transition-all shadow-md active:scale-95 cursor-pointer uppercase"
                                    >
                                        <Download size={10} /> Report
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default Analytics;
