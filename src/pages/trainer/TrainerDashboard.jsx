import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Play, Copy, Users, FileText, Download, BarChart3, TrendingUp,
    Clock, CheckCircle, XCircle, Monitor, BookOpen, Award, Loader2, RefreshCcw
} from 'lucide-react';
import axios from 'axios';
import useAuthStore from '../../store/authStore';
import useSocketUpdate from '../../hooks/useSocketUpdate';
import { AlertModal } from '../../components/Modals';

const getColorClasses = (color) => {
    if (color.includes('blue')) return { bg: 'bg-blue-50', text: 'text-blue-600' };
    if (color.includes('indigo')) return { bg: 'bg-indigo-50', text: 'text-indigo-600' };
    if (color.includes('emerald')) return { bg: 'bg-emerald-50', text: 'text-emerald-600' };
    if (color.includes('orange')) return { bg: 'bg-orange-50', text: 'text-orange-600' };
    return { bg: 'bg-slate-50', text: 'text-slate-600' };
};

const StatCard = ({ label, value, icon: Icon, color, sub }) => {
    const { bg, text } = getColorClasses(color);
    return (
        <div className="bg-white p-5 rounded-xl border border-slate-200 hover:shadow-md transition-all">
            <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center mb-3`}>
                <Icon size={18} className={text} />
            </div>
            <p className="text-xs font-medium text-slate-500">{label}</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{value ?? '—'}</h3>
            {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
        </div>
    );
};

const TrainerDashboard = () => {
    const { user, token } = useAuthStore();
    const navigate = useNavigate();
    const [assignedExams, setAssignedExams] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(null);
    const [alertState, setAlertState] = useState({ open: false });

    const fetchData = async () => {
        try {
            setLoading(true);
            const [examsRes, statsRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/trainer/exams`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/trainer/stats`, { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setAssignedExams(examsRes.data.data || []);
            setStats(statsRes.data.data || {});
        } catch (e) { console.error('Trainer fetch failed', e); }
        finally { setLoading(false); }
    };

    useEffect(() => { if (token) fetchData(); }, [token]);
    useSocketUpdate(() => fetchData(), ['exams']);

    const copyKey = (key, id) => {
        navigator.clipboard.writeText(key);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    const handleExport = async (examId, title) => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/analytics/export?type=exam&id=${examId}`, {
                headers: { Authorization: `Bearer ${token}` }, responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const a = document.createElement('a');
            a.href = url; a.setAttribute('download', `${title}_Results.xlsx`);
            document.body.appendChild(a); a.click(); a.remove();
        } catch { 
            setAlertState({ open: true, title: 'Export Failed', message: 'There was an issue exporting the assessment results.', type: 'error' });
        }
    };

    if (loading) {
        return (
            <div className="h-[50vh] flex items-center justify-center">
                <Loader2 className="animate-spin text-[#004AAD]" size={28} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        Welcome back, {user?.firstName || 'Trainer'} 👋
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Manage your assigned assessments and monitor student progress</p>
                </div>
                <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50">
                    <RefreshCcw size={15} /> Refresh
                </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Assigned Exams" value={stats?.totalExams ?? 0} icon={FileText} color="bg-blue-500" sub="Published to you" />
                <StatCard label="Total Attempts" value={stats?.completedSessions ?? 0} icon={Users} color="bg-indigo-500" sub="All time" />
                <StatCard label="Avg Score" value={`${stats?.avgScore ?? 0}%`} icon={TrendingUp} color="bg-emerald-500" sub="Across all exams" />
                <StatCard label="Pass Rate" value={`${stats?.averagePassRate ?? 0}%`} icon={Award} color="bg-orange-500" sub="Overall" />
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Exams & Performance */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Assigned Exams */}
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="font-bold text-slate-900 flex items-center gap-2">
                                <Monitor size={18} className="text-[#004AAD]" /> My Assigned Exams
                            </h2>
                            <span className="text-xs text-slate-400 font-medium">{assignedExams.length} exam{assignedExams.length !== 1 ? 's' : ''}</span>
                        </div>

                        {assignedExams.length === 0 ? (
                            <div className="py-20 flex flex-col items-center justify-center text-center">
                                <FileText size={40} className="text-slate-200 mb-4" />
                                <h3 className="text-base font-semibold text-slate-700">No exams assigned yet</h3>
                                <p className="text-sm text-slate-400 mt-1 max-w-xs">When an admin publishes an exam for your course, it will appear here with your unique access key.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {assignedExams.map((exam) => (
                                    <div key={exam.id} className="p-5 hover:bg-slate-50/50 transition-colors group">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                            {/* Exam info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-[#004AAD] rounded text-xs font-semibold">
                                                        <BookOpen size={10} /> {exam.courseCode}
                                                    </span>
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-xs font-medium">
                                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Published
                                                    </span>
                                                    {exam.batchName && exam.batchName !== 'General' && (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-xs font-medium">
                                                            <Users size={10} /> {exam.batchName}
                                                        </span>
                                                    )}
                                                </div>
                                                <h3 className="font-bold text-slate-900 text-base line-clamp-1">{exam.title}</h3>
                                                <p className="text-xs text-slate-400 mt-0.5">{exam.course} · {exam.college}</p>
                                                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                                                    <span className="flex items-center gap-1"><Clock size={12} /> {exam.duration} min</span>
                                                    <span className="flex items-center gap-1"><CheckCircle size={12} /> {exam.passingPercentage}% to pass</span>
                                                </div>
                                            </div>

                                            {/* Access Key */}
                                            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                                                <div>
                                                    <p className="text-[10px] text-slate-400 font-medium">ACCESS KEY</p>
                                                    <code className="text-sm font-bold font-mono text-slate-900 tracking-wider">{exam.key}</code>
                                                </div>
                                                <button onClick={() => copyKey(exam.key, exam.id)}
                                                    className="p-1.5 text-slate-400 hover:text-[#004AAD] rounded hover:bg-blue-50 transition-colors"
                                                    title="Copy key">
                                                    {copied === exam.id ? <CheckCircle size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                                </button>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-2 flex-shrink-0">
                                                <button onClick={() => handleExport(exam.examId, exam.title)}
                                                    className="p-2 text-slate-400 hover:text-[#004AAD] border border-slate-200 rounded-lg hover:bg-blue-50 transition-colors"
                                                    title="Export Results">
                                                    <Download size={16} />
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/trainer/monitor/${exam.key}`)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-[#004AAD] text-white text-sm font-semibold rounded-lg hover:bg-[#003580] transition-colors shadow-sm">
                                                    <Play size={14} fill="currentColor" /> Monitor
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Exam Performance Breakdown */}
                    {stats?.examBreakdown?.length > 0 && (
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                            <div className="px-6 py-4 border-b border-slate-100">
                                <h2 className="font-bold text-slate-900 flex items-center gap-2">
                                    <BarChart3 size={18} className="text-[#004AAD]" /> Exam Performance Breakdown
                                </h2>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {stats.examBreakdown.map((e, i) => (
                                    <div key={i} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-slate-50/50">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-slate-900 truncate">{e.title}</p>
                                            <p className="text-xs text-slate-400">{e.course}</p>
                                        </div>
                                        <div className="flex items-center gap-6 text-sm">
                                            <div className="text-center">
                                                <p className="font-bold text-slate-900">{e.total}</p>
                                                <p className="text-xs text-slate-400">Attempts</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="font-bold text-slate-900">{e.avgScore}%</p>
                                                <p className="text-xs text-slate-400">Avg Score</p>
                                            </div>
                                            <div className="text-center">
                                                <p className={`font-bold ${parseFloat(e.passRate) >= 60 ? 'text-emerald-600' : 'text-red-500'}`}>{e.passRate}%</p>
                                                <p className="text-xs text-slate-400">Pass Rate</p>
                                            </div>
                                            <div className="w-24 hidden sm:block">
                                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-[#004AAD] rounded-full" style={{ width: `${e.passRate}%` }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Training & Curriculum Activity Dashboard */}
                <div className="space-y-6">
                    {/* Curriculum & Logs Summary Card */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                        <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
                            <BookOpen size={16} className="text-[#004AAD]" />
                            Curriculum & Daily Progress
                        </h3>
                        <div className="space-y-3">
                            {/* Courses count */}
                            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/60 rounded-xl hover:bg-slate-100/30 transition-colors">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-[#004AAD]"><BookOpen size={14} /></div>
                                    <div>
                                        <span className="text-xs font-semibold text-slate-700 block">My Courses</span>
                                        <span className="text-[10px] text-slate-400">Curriculums mapped to you</span>
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-slate-800 bg-white border border-slate-200 px-2.5 py-1 rounded-md">{stats?.totalCourses ?? 0}</span>
                            </div>
                            {/* Batches count */}
                            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/60 rounded-xl hover:bg-slate-100/30 transition-colors">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600"><Users size={14} /></div>
                                    <div>
                                        <span className="text-xs font-semibold text-slate-700 block">Batch Templates</span>
                                        <span className="text-[10px] text-slate-400">Pre-saved templates</span>
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-slate-800 bg-white border border-slate-200 px-2.5 py-1 rounded-md">{stats?.totalBatches ?? 0}</span>
                            </div>
                            {/* Logs count */}
                            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/60 rounded-xl hover:bg-slate-100/30 transition-colors">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600"><FileText size={14} /></div>
                                    <div>
                                        <span className="text-xs font-semibold text-slate-700 block">Training Logs</span>
                                        <span className="text-[10px] text-slate-400">Recorded session logs</span>
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-slate-800 bg-white border border-slate-200 px-2.5 py-1 rounded-md">{stats?.totalLogs ?? 0}</span>
                            </div>
                        </div>

                        {/* Quick Action Links */}
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <button 
                                onClick={() => navigate('/trainer/batches')}
                                className="py-2.5 text-center text-xs font-bold bg-[#004AAD] text-white hover:bg-[#003580] active:scale-95 transition-all rounded-lg cursor-pointer"
                            >
                                Manage Batches
                            </button>
                            <button 
                                onClick={() => navigate('/trainer/logs')}
                                className="py-2.5 text-center text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95 transition-all rounded-lg cursor-pointer"
                            >
                                Log Daily Work
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <AlertModal 
                isOpen={alertState.open}
                onClose={() => setAlertState({ ...alertState, open: false })}
                title={alertState.title}
                message={alertState.message}
                type={alertState.type}
            />
        </div>
    );
};

export default TrainerDashboard;
