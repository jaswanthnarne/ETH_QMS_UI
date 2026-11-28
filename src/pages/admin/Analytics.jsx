import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    ComposedChart,
    Line,
    Area
} from 'recharts';
import {
    Calendar,
    Users,
    BookOpen,
    School,
    Download,
    Clock,
    Layers,
    CalendarCheck,
    AlertTriangle,
    FileSpreadsheet,
    ExternalLink,
    BarChart3,
    RotateCcw
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useCollegeStore from '../../store/collegeStore';
import useSocketUpdate from '../../hooks/useSocketUpdate';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const MetricCard = ({ label, value, subtitle, icon: Icon }) => (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs flex items-start justify-between gap-4">
        <div className="space-y-1.5 min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
            {subtitle && <p className="text-xs text-slate-400 truncate">{subtitle}</p>}
        </div>
        <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200/80 text-[#5899B5] flex items-center justify-center shrink-0">
            <Icon size={20} />
        </div>
    </div>
);

const Analytics = () => {
    const { token, user } = useAuthStore();
    const { selectedCollegeId: storeCollegeId, selectedCollegeName } = useCollegeStore();
    const { collegeId: paramCollegeId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const urlCollegeMatch = location.pathname.match(/\/college\/([a-f0-9]{24})/i);
    const urlCollegeId = paramCollegeId || (urlCollegeMatch ? urlCollegeMatch[1] : null);
    const lockedCollegeId = urlCollegeId || storeCollegeId || (user?.role === 'college_admin' ? user.collegeId : null);

    const isTrainer = user?.role === 'trainer';
    const isMultiCollegeAdmin = ['super_admin', 'ops_admin', 'ast_ops_admin', 'regional_manager', 'asst_rm', 'placement'].includes(user?.role);

    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const [stats, setStats] = useState(null);

    // Filter Options
    const [colleges, setColleges] = useState([]);
    const [courses, setCourses] = useState([]);
    const [trainers, setTrainers] = useState([]);
    const [batches, setBatches] = useState([]);

    const [filters, setFilters] = useState({
        collegeId: lockedCollegeId || '',
        courseId: '',
        trainerId: '',
        batchId: '',
        days: '30'
    });

    const latestRequestRef = useRef(0);

    // Sync lockedCollegeId when entering an isolated college tab
    useEffect(() => {
        setFilters((prev) => ({
            ...prev,
            collegeId: lockedCollegeId || '',
            courseId: '',
            trainerId: '',
            batchId: ''
        }));
    }, [lockedCollegeId]);

    const activeCollegeScope = lockedCollegeId || filters.collegeId || '';

    // Load colleges
    useEffect(() => {
        if (!token || isTrainer) return;
        axios
            .get(`${API}/admin/colleges`, { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => setColleges(res.data?.data || []))
            .catch(() => {});
    }, [token, isTrainer]);

    // Load courses, batches, and trainers scoped to activeCollegeScope
    const fetchFilterOptions = useCallback(async () => {
        if (!token) return;
        const headers = { Authorization: `Bearer ${token}` };
        try {
            const courseUrl = activeCollegeScope
                ? `${API}/admin/colleges/${activeCollegeScope}/courses`
                : `${API}/admin/courses`;
            const batchUrl = isTrainer
                ? `${API}/trainer/batches${activeCollegeScope ? `?collegeId=${activeCollegeScope}` : ''}`
                : activeCollegeScope
                    ? `${API}/admin/colleges/${activeCollegeScope}/batches`
                    : `${API}/admin/colleges/all/batches`;

            const reqs = [axios.get(courseUrl, { headers }), axios.get(batchUrl, { headers })];
            if (!isTrainer) {
                const trainerUrl = activeCollegeScope
                    ? `${API}/admin/trainers?collegeId=${activeCollegeScope}`
                    : `${API}/admin/trainers`;
                reqs.push(axios.get(trainerUrl, { headers }));
            }

            const [cRes, bRes, tRes] = await Promise.all(reqs);
            setCourses(cRes?.data?.data || []);
            setBatches(bRes?.data?.data || []);
            if (tRes?.data?.data) setTrainers(tRes.data.data);
        } catch (err) {
            console.error('Failed to load analytics filter metadata:', err);
        }
    }, [token, activeCollegeScope, isTrainer]);

    useEffect(() => {
        fetchFilterOptions();
    }, [fetchFilterOptions]);

    // Fetch Training Logs & Attendance Analytics
    const fetchAnalyticsData = useCallback(async () => {
        if (!token) return;
        const reqId = ++latestRequestRef.current;
        setLoading(true);
        try {
            const params = new URLSearchParams({ days: filters.days });
            if (activeCollegeScope) params.set('collegeId', activeCollegeScope);
            if (filters.courseId) params.set('courseId', filters.courseId);
            if (filters.trainerId) params.set('trainerId', filters.trainerId);
            if (filters.batchId) params.set('batchId', filters.batchId);

            const res = await axios.get(`${API}/analytics/logs-attendance-stats?${params.toString()}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (reqId === latestRequestRef.current && res.data.success) {
                setStats(res.data.data);
            }
        } catch (err) {
            if (reqId === latestRequestRef.current) {
                console.error('Failed to fetch training logs & attendance analytics:', err);
            }
        } finally {
            if (reqId === latestRequestRef.current) {
                setLoading(false);
            }
        }
    }, [token, activeCollegeScope, filters.courseId, filters.trainerId, filters.batchId, filters.days]);

    useEffect(() => {
        fetchAnalyticsData();
    }, [fetchAnalyticsData]);

    useSocketUpdate(() => {
        fetchAnalyticsData();
    }, ['attendance', 'colleges', 'courses', 'trainers']);

    const handleExportReport = async (exportType) => {
        setExporting(exportType);
        try {
            const params = new URLSearchParams({ type: exportType });
            if (activeCollegeScope) params.set('collegeId', activeCollegeScope);
            if (filters.courseId) params.set('courseId', filters.courseId);
            if (filters.trainerId) params.set('trainerId', filters.trainerId);
            if (filters.batchId) params.set('batchIds', filters.batchId);

            const res = await axios.get(`${API}/analytics/export?${params.toString()}`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const a = document.createElement('a');
            a.href = url;
            const label =
                exportType === 'batch_attendance' ? 'Batch_Daywise_Attendance_Report' : 'Training_Logs_Report';
            a.setAttribute('download', `${label}_${new Date().toISOString().slice(0, 10)}.xlsx`);
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch {
            alert('Export failed.');
        } finally {
            setExporting(false);
        }
    };

    const visibleBatches = batches.filter((b) => {
        if (filters.courseId) {
            const cid = b.courseId?._id || b.courseId;
            return cid?.toString() === filters.courseId.toString();
        }
        return true;
    });

    const activeCollegeDisplay =
        selectedCollegeName ||
        colleges.find((c) => c._id === activeCollegeScope)?.name ||
        'Selected College';

    const hasActiveFilters =
        (!lockedCollegeId && filters.collegeId !== '') ||
        filters.courseId !== '' ||
        filters.batchId !== '' ||
        filters.trainerId !== '' ||
        filters.days !== '30';

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900 text-white p-3.5 rounded-xl border border-slate-800 shadow-lg text-xs">
                    <p className="font-bold text-slate-200 mb-1.5 border-b border-slate-800 pb-1">{label}</p>
                    {payload.map((p, i) => (
                        <div key={i} className="flex items-center gap-2 mt-1">
                            <div
                                className="w-2.5 h-2.5 rounded-full"
                                style={{ backgroundColor: p.color || p.fill }}
                            />
                            <span className="text-slate-300">
                                {p.name}:{' '}
                                <b className="text-white">
                                    {p.value}
                                    {p.name?.includes('%') || p.name?.includes('Rate') ? '%' : ''}
                                </b>
                            </span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-6 pb-10">
            {/* Page Header & Export Actions */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 pb-5 border-b border-slate-200/80">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
                        <BarChart3 className="text-[#5899B5] shrink-0" size={26} />
                        <span>
                            {lockedCollegeId
                                ? `Training Logs & Attendance Analytics — ${activeCollegeDisplay}`
                                : 'Training Logs & Attendance Analytics'}
                        </span>
                    </h1>
                    <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
                        Day-wise session logging velocity, student attendance compliance, batch coverage, and trainer hours
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <button
                        onClick={() => handleExportReport('batch_attendance')}
                        disabled={exporting !== false}
                        className="h-10 px-4 inline-flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs transition cursor-pointer disabled:opacity-50 shadow-2xs"
                    >
                        <FileSpreadsheet size={15} className="text-[#5899B5]" />
                        {exporting === 'batch_attendance' ? 'Exporting...' : 'Export Day-Wise Attendance'}
                    </button>
                    <button
                        onClick={() => handleExportReport('training_logs')}
                        disabled={exporting !== false}
                        className="h-10 px-4 inline-flex items-center gap-2 bg-[#5899B5] hover:bg-[#3D7690] text-white font-semibold rounded-xl text-xs transition cursor-pointer disabled:opacity-50 shadow-2xs"
                    >
                        <Download size={15} />
                        {exporting === 'training_logs' ? 'Exporting...' : 'Export Training Logs'}
                    </button>
                </div>
            </div>

            {/* Filter Panel Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
                <div className={`grid grid-cols-1 sm:grid-cols-2 ${isTrainer ? 'lg:grid-cols-4' : 'lg:grid-cols-5'} gap-4 sm:gap-5`}>
                    {/* 1. Institution Selector */}
                    <div>
                        <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                            <School size={13} className="text-[#5899B5]" />
                            Institution Scope
                        </label>
                        {!lockedCollegeId && isMultiCollegeAdmin ? (
                            <select
                                className="w-full h-10 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-[#5899B5] focus:ring-2 focus:ring-[#5899B5]/15 transition-all cursor-pointer"
                                value={filters.collegeId}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        collegeId: e.target.value,
                                        courseId: '',
                                        trainerId: '',
                                        batchId: ''
                                    })
                                }
                            >
                                <option value="">All Colleges ({colleges.length})</option>
                                {colleges.map((c) => (
                                    <option key={c._id} value={c._id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <div className="w-full h-10 px-3.5 bg-slate-100/90 border border-slate-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-slate-800 truncate">
                                <span className="w-2 h-2 rounded-full bg-[#5899B5] shrink-0" />
                                <span className="truncate">{activeCollegeDisplay}</span>
                            </div>
                        )}
                    </div>

                    {/* 2. Course Selector */}
                    <div>
                        <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                            <BookOpen size={13} className="text-[#5899B5]" />
                            Course
                        </label>
                        <select
                            className="w-full h-10 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-[#5899B5] focus:ring-2 focus:ring-[#5899B5]/15 transition-all cursor-pointer"
                            value={filters.courseId}
                            onChange={(e) => setFilters({ ...filters, courseId: e.target.value, batchId: '' })}
                        >
                            <option value="">All Courses ({courses.length})</option>
                            {courses.map((c) => (
                                <option key={c._id} value={c._id}>
                                    {c.name} ({c.code})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 3. Batch Selector */}
                    <div>
                        <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                            <Layers size={13} className="text-[#5899B5]" />
                            Batch
                        </label>
                        <select
                            className="w-full h-10 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-[#5899B5] focus:ring-2 focus:ring-[#5899B5]/15 transition-all cursor-pointer"
                            value={filters.batchId}
                            onChange={(e) => setFilters({ ...filters, batchId: e.target.value })}
                        >
                            <option value="">All Batches ({visibleBatches.length})</option>
                            {visibleBatches.map((b) => (
                                <option key={b._id} value={b._id}>
                                    {b.batchName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 4. Trainer Selector */}
                    {!isTrainer && (
                        <div>
                            <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                                <Users size={13} className="text-[#5899B5]" />
                                Trainer
                            </label>
                            <select
                                className="w-full h-10 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-[#5899B5] focus:ring-2 focus:ring-[#5899B5]/15 transition-all cursor-pointer"
                                value={filters.trainerId}
                                onChange={(e) => setFilters({ ...filters, trainerId: e.target.value })}
                            >
                                <option value="">All Trainers ({trainers.length})</option>
                                {trainers.map((t) => (
                                    <option key={t._id} value={t._id}>
                                        {`${t.firstName || ''} ${t.lastName || ''}`.trim() || t.username}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* 5. Time Window Selector */}
                    <div>
                        <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                            <Calendar size={13} className="text-[#5899B5]" />
                            Time Window
                        </label>
                        <select
                            className="w-full h-10 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-[#5899B5] focus:ring-2 focus:ring-[#5899B5]/15 transition-all cursor-pointer"
                            value={filters.days}
                            onChange={(e) => setFilters({ ...filters, days: e.target.value })}
                        >
                            <option value="7">Last 7 Days</option>
                            <option value="14">Last 14 Days</option>
                            <option value="30">Last 30 Days</option>
                            <option value="90">Last 90 Days</option>
                            <option value="all">All Time</option>
                        </select>
                    </div>
                </div>

                {hasActiveFilters && (
                    <div className="pt-3 border-t border-slate-100 flex justify-end">
                        <button
                            type="button"
                            onClick={() =>
                                setFilters({
                                    collegeId: lockedCollegeId || '',
                                    courseId: '',
                                    trainerId: '',
                                    batchId: '',
                                    days: '30'
                                })
                            }
                            className="h-9 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition cursor-pointer"
                        >
                            <RotateCcw size={13} />
                            Reset Filters
                        </button>
                    </div>
                )}
            </div>

            {/* Top Metrics Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <MetricCard
                    label="Sessions Logged"
                    value={stats?.summary?.totalSessionsLogged ?? 0}
                    subtitle={`${stats?.summary?.totalBatches ?? 0} active batch(es) in scope`}
                    icon={FileSpreadsheet}
                />
                <MetricCard
                    label="Training Hours Delivered"
                    value={`${stats?.summary?.totalTrainingHours ?? 0} hrs`}
                    subtitle="Cumulative classroom duration"
                    icon={Clock}
                />
                <MetricCard
                    label="Overall Attendance Rate"
                    value={`${stats?.summary?.overallAttendanceRate ?? 0}%`}
                    subtitle={`${stats?.summary?.totalPresentMarks ?? 0} present / ${
                        (stats?.summary?.totalPresentMarks ?? 0) + (stats?.summary?.totalAbsentMarks ?? 0)
                    } total marks`}
                    icon={CalendarCheck}
                />
                <MetricCard
                    label="Below 75% Attendance"
                    value={stats?.summary?.below75Count ?? 0}
                    subtitle={`Out of ${stats?.summary?.totalActiveStudents ?? 0} enrolled students`}
                    icon={AlertTriangle}
                />
            </div>

            {/* Charts Section: Daily Attendance & Sessions Timeline + Student Attendance Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Daily Sessions & Attendance Rate Timeline */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-base font-bold text-slate-900">
                                Daily Training Logs &amp; Attendance Trend
                            </h3>
                            <p className="text-xs text-slate-400 mt-1">
                                Daily attendance rate (%) and sessions logged across dates
                            </p>
                        </div>
                    </div>
                    <div className="h-[290px] w-full">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <ComposedChart data={stats?.timeline || []}>
                                <defs>
                                    <linearGradient id="attRateGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#5899B5" stopOpacity={0.18} />
                                        <stop offset="95%" stopColor="#5899B5" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }}
                                    dy={8}
                                />
                                <YAxis
                                    yAxisId="left"
                                    domain={[0, 100]}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }}
                                    unit="%"
                                />
                                <YAxis
                                    yAxisId="right"
                                    orientation="right"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="attendanceRate"
                                    name="Attendance Rate (%)"
                                    stroke="#5899B5"
                                    strokeWidth={2.5}
                                    fillOpacity={1}
                                    fill="url(#attRateGrad)"
                                />
                                <Line
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="sessions"
                                    name="Sessions Logged"
                                    stroke="#0f172a"
                                    strokeWidth={2}
                                    dot={{ r: 3 }}
                                />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Student Attendance Tier Distribution */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs flex flex-col">
                    <div className="mb-6">
                        <h3 className="text-base font-bold text-slate-900">Student Attendance Brackets</h3>
                        <p className="text-xs text-slate-400 mt-1">
                            Distribution of students by cumulative attendance %
                        </p>
                    </div>
                    <div className="h-[290px] w-full">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <BarChart data={stats?.attendanceDistribution || []} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="range"
                                    type="category"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 600, fill: '#334155' }}
                                    width={118}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="count" name="Students" fill="#5899B5" radius={[0, 6, 6, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Batch-wise Training Logs & Attendance Summary Table + Trainer Session Logging Table */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Batch-wise Attendance & Logs Breakdown */}
                <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900">
                                Batch-Wise Attendance &amp; Training Log Coverage
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Sessions conducted, hours delivered, and average attendance per batch
                            </p>
                        </div>
                        <button
                            onClick={() =>
                                navigate(lockedCollegeId ? `/college/${lockedCollegeId}/admin/attendance` : '/admin/attendance')
                            }
                            className="text-xs font-semibold text-[#5899B5] hover:underline inline-flex items-center gap-1 shrink-0 cursor-pointer"
                        >
                            Open Register <ExternalLink size={12} />
                        </button>
                    </div>

                    <div className="overflow-x-auto max-h-[380px]">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead className="bg-slate-50/90 border-b border-slate-200/80 sticky top-0">
                                <tr className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">
                                    <th className="px-6 py-3.5">Batch &amp; Course</th>
                                    <th className="px-6 py-3.5">Trainer</th>
                                    <th className="px-6 py-3.5 text-center">Roster</th>
                                    <th className="px-6 py-3.5 text-center">Sessions / Hrs</th>
                                    <th className="px-6 py-3.5 text-right">Avg Attendance</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {!stats?.batches || stats.batches.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                                            No batches found for the active filters.
                                        </td>
                                    </tr>
                                ) : (
                                    stats.batches.map((b) => (
                                        <tr key={b.batchId} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-900 text-sm">{b.batchName}</div>
                                                <div className="text-xs text-slate-400 mt-0.5">
                                                    {b.courseName} {b.courseCode ? `(${b.courseCode})` : ''}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-slate-700 whitespace-nowrap">
                                                {b.trainerName}
                                            </td>
                                            <td className="px-6 py-4 text-center font-semibold text-slate-700 whitespace-nowrap">
                                                {b.studentCount}
                                            </td>
                                            <td className="px-6 py-4 text-center whitespace-nowrap">
                                                <span className="font-bold text-slate-800">{b.sessionsLogged}</span>
                                                <span className="text-slate-400 ml-1">({b.hoursLogged}h)</span>
                                            </td>
                                            <td className="px-6 py-4 text-right whitespace-nowrap">
                                                <span
                                                    className={`px-2.5 py-1 rounded-md font-bold ${
                                                        b.attendanceRate >= 75
                                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                                                            : b.sessionsLogged === 0
                                                                ? 'bg-slate-100 text-slate-500'
                                                                : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                                                    }`}
                                                >
                                                    {b.sessionsLogged === 0 ? 'No Logs' : `${b.attendanceRate}%`}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Trainer Session Logging Compliance */}
                <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900">Trainer Logging Activity</h3>
                            <p className="text-xs text-slate-400 mt-0.5">Sessions logged and classroom hours by trainer</p>
                        </div>
                        <button
                            onClick={() =>
                                navigate(lockedCollegeId ? `/college/${lockedCollegeId}/admin/logs` : '/admin/logs')
                            }
                            className="text-xs font-semibold text-[#5899B5] hover:underline inline-flex items-center gap-1 shrink-0 cursor-pointer"
                        >
                            All Logs <ExternalLink size={12} />
                        </button>
                    </div>

                    <div className="overflow-x-auto max-h-[380px]">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead className="bg-slate-50/90 border-b border-slate-200/80 sticky top-0">
                                <tr className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">
                                    <th className="px-6 py-3.5">Trainer</th>
                                    <th className="px-6 py-3.5 text-center">Sessions</th>
                                    <th className="px-6 py-3.5 text-center">Hours</th>
                                    <th className="px-6 py-3.5 text-right">Attendance %</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {!stats?.trainers || stats.trainers.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-slate-400">
                                            No trainer session logs recorded in this period.
                                        </td>
                                    </tr>
                                ) : (
                                    stats.trainers.map((t) => (
                                        <tr key={t.trainerId} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-900 text-sm">{t.name}</div>
                                                <div className="text-xs text-slate-400 mt-0.5">
                                                    {t.batchesCount} batch(es) • {t.coursesCount} course(s)
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center font-bold text-slate-800 whitespace-nowrap">
                                                {t.sessionsLogged}
                                            </td>
                                            <td className="px-6 py-4 text-center font-semibold text-slate-600 whitespace-nowrap">
                                                {t.hoursLogged} hrs
                                            </td>
                                            <td className="px-6 py-4 text-right whitespace-nowrap">
                                                <span
                                                    className={`px-2.5 py-1 rounded-md font-bold ${
                                                        t.attendanceRate >= 75
                                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                                                            : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                                                    }`}
                                                >
                                                    {t.attendanceRate}%
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Recent Training Log & Attendance Sessions */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-bold text-slate-900">
                            Recent Logged Training Sessions &amp; Attendance
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Chronological log of topics taught, modules covered, and session attendance
                        </p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead className="bg-slate-50/90 border-b border-slate-200/80">
                            <tr className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">
                                <th className="px-6 py-3.5">Date &amp; Slot</th>
                                <th className="px-6 py-3.5">Batch &amp; Course</th>
                                <th className="px-6 py-3.5">Trainer</th>
                                <th className="px-6 py-3.5">Module &amp; Topic Covered</th>
                                <th className="px-6 py-3.5 text-center">Present / Roster</th>
                                <th className="px-6 py-3.5 text-right">Attendance %</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {!stats?.recentSessions || stats.recentSessions.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                                        No training sessions logged for the selected filters.
                                    </td>
                                </tr>
                            ) : (
                                stats.recentSessions.map((s) => (
                                    <tr key={s._id} className="hover:bg-slate-50/70 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-bold text-slate-800 text-sm">
                                                {new Date(s.date).toLocaleDateString('en-IN', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </div>
                                            <div className="text-xs text-slate-400 mt-0.5">
                                                {s.period} ({s.duration}m)
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-900 text-sm">{s.batchName}</div>
                                            <div className="text-xs text-slate-400 mt-0.5">
                                                {s.courseName} ({s.courseCode})
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-slate-700 whitespace-nowrap">
                                            {s.trainerName}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200/80 text-slate-700 font-semibold text-[11px] mr-2">
                                                {s.module}
                                            </span>
                                            <span className="font-medium text-slate-800 text-sm">{s.topic}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center font-semibold text-slate-700 whitespace-nowrap text-sm">
                                            {s.presentCount} / {s.totalCount}
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            <span
                                                className={`px-2.5 py-1 rounded-md font-bold ${
                                                    s.attendanceRate >= 75
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                                                        : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                                                }`}
                                            >
                                                {s.attendanceRate}%
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
