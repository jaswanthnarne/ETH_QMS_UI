import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FileText, Download, Play, Send, Clock, Award, Loader2, CheckCircle,
    Plus, Trash2, Copy, Search, Edit, Users, Eye, XCircle, Building2, BookOpen
} from 'lucide-react';
import axios from 'axios';
import useAuthStore from '../../store/authStore';
import useCollegeStore from '../../store/collegeStore';
import useSocketUpdate from '../../hooks/useSocketUpdate';
import { AlertModal, ConfirmModal } from '../../components/Modals';

const StatusBadge = ({ status }) => {
    const config = {
        published: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Published' },
        draft: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500', label: 'Draft' },
    };
    const c = config[status] || config.draft;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${c.bg} ${c.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
            {c.label}
        </span>
    );
};

const TrainerExams = () => {
    const { token, user } = useAuthStore();
    const { selectedCollegeId } = useCollegeStore();
    const navigate = useNavigate();
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [publishing, setPublishing] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [copiedKey, setCopiedKey] = useState(null);
    
    // Alerts and Confirm Modal State
    const [alertState, setAlertState] = useState({ isOpen: false, title: '', message: '', type: 'info' });
    const [confirmState, setConfirmState] = useState({ isOpen: false, title: '', message: '', onConfirm: () => {} });

    const fetchExams = async () => {
        try {
            setLoading(true);
            const collegeQuery = selectedCollegeId ? `?collegeId=${selectedCollegeId}` : '';
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/trainer/course-exams${collegeQuery}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setExams(res.data.data || []);
        } catch (e) {
            console.error('Failed to fetch course exams', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { if (token) fetchExams(); }, [token, selectedCollegeId]);
    useSocketUpdate(() => fetchExams(), ['exams']);

    const handlePublish = async (id) => {
        try {
            setPublishing(id);
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/trainer/exams/${id}/publish`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAlertState({
                isOpen: true,
                title: 'Success',
                message: 'Exam published! Your access key is ready.',
                type: 'success'
            });
            fetchExams();
        } catch (error) {
            setAlertState({
                isOpen: true,
                title: 'Publish Failed',
                message: error.response?.data?.error || 'Failed to publish exam',
                type: 'error'
            });
        } finally {
            setPublishing(null);
        }
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
            setAlertState({
                isOpen: true,
                title: 'Export Failed',
                message: 'Export failed. Please try again.',
                type: 'error'
            });
        }
    };

    const handleDelete = async (id) => {
        setConfirmState({
            isOpen: true,
            title: 'Delete Exam',
            message: 'Are you sure you want to delete this exam? All student results will be permanently removed.',
            onConfirm: async () => {
                try {
                    await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/exams/${id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    fetchExams();
                } catch (error) {
                    setAlertState({
                        isOpen: true,
                        title: 'Delete Failed',
                        message: error.response?.data?.error || 'Failed to delete exam',
                        type: 'error'
                    });
                }
            }
        });
    };

    const handleClone = async (id, title) => {
        setConfirmState({
            isOpen: true,
            title: 'Clone Exam',
            message: `Clone "${title}"? A draft copy will be created.`,
            onConfirm: async () => {
                try {
                    await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/exams/${id}/clone`, {}, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    fetchExams();
                } catch (error) {
                    setAlertState({
                        isOpen: true,
                        title: 'Clone Failed',
                        message: error.response?.data?.error || 'Failed to clone exam',
                        type: 'error'
                    });
                }
            }
        });
    };

    const copyKey = (key) => {
        navigator.clipboard.writeText(key);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    const filteredExams = exams.filter(e => {
        const matchesSearch =
            e.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.courseCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.course?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: exams.length,
        published: exams.filter(e => e.status === 'published').length,
        draft: exams.filter(e => e.status === 'draft').length,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Assessments Portal</h1>
                    <p className="text-sm text-slate-500 mt-1">Create, manage, and proctor your course assessments</p>
                </div>
                <button
                    onClick={() => navigate('/trainer/exams/create')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#004AAD] text-white text-sm font-semibold rounded-lg hover:bg-[#003580] shadow-sm transition-all active:scale-95"
                >
                    <Plus size={16} /> Create Exam
                </button>
            </div>

            {/* Stats Strip */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <FileText size={18} className="text-[#004AAD]" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500">Total</p>
                        <p className="text-lg font-bold text-slate-900">{stats.total}</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                        <Eye size={18} className="text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500">Live</p>
                        <p className="text-lg font-bold text-emerald-700">{stats.published}</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                        <Edit size={18} className="text-amber-600" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500">Drafts</p>
                        <p className="text-lg font-bold text-amber-700">{stats.draft}</p>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <div className="relative w-full max-w-sm">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-[#004AAD] transition-colors"
                        placeholder="Search by title, course..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1">
                    {[
                        { key: 'all', label: 'All' },
                        { key: 'published', label: 'Live' },
                        { key: 'draft', label: 'Drafts' },
                    ].map(f => (
                        <button
                            key={f.key}
                            onClick={() => setStatusFilter(f.key)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${statusFilter === f.key ? 'bg-[#004AAD] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Exam Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {loading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <div className="p-5 space-y-3">
                                <div className="flex justify-between"><div className="h-5 w-16 bg-slate-100 rounded animate-pulse" /><div className="h-5 w-20 bg-slate-100 rounded-full animate-pulse" /></div>
                                <div className="h-5 w-3/4 bg-slate-100 rounded animate-pulse" />
                                <div className="h-4 w-1/2 bg-slate-50 rounded animate-pulse" />
                                <div className="flex gap-4 pt-2"><div className="h-4 w-16 bg-slate-50 rounded animate-pulse" /><div className="h-4 w-16 bg-slate-50 rounded animate-pulse" /></div>
                            </div>
                            <div className="h-14 border-t border-slate-100 bg-slate-50/50" />
                        </div>
                    ))
                ) : filteredExams.length === 0 ? (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                            <FileText size={28} className="text-slate-300" />
                        </div>
                        <h3 className="text-base font-semibold text-slate-700">No assessments found</h3>
                        <p className="text-sm text-slate-400 mt-1 max-w-sm">
                            {searchTerm ? 'No matches for your search term.' : 'Create an exam or check with your administrator for course mappings.'}
                        </p>
                    </div>
                ) : (
                    filteredExams.map((exam) => {
                        const isOwner = exam.createdBy?.toString() === user?._id?.toString();
                        const hasKeys = exam.trainerKeys && exam.trainerKeys.length > 0;
                        const hasKey = exam.trainerKey;
                        const firstKey = hasKeys ? exam.trainerKeys[0]?.key : hasKey;

                        return (
                            <div key={exam.id} className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200 flex flex-col group">
                                {/* Card Body */}
                                <div className="p-5 flex-1">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-0.5 bg-blue-50 text-[#004AAD] rounded text-[11px] font-bold tracking-wide">
                                                {exam.courseCode || '—'}
                                            </span>
                                        </div>
                                        <StatusBadge status={exam.status} />
                                    </div>

                                    <h4 className="text-[15px] font-bold text-slate-900 mb-1 line-clamp-2 leading-snug group-hover:text-[#004AAD] transition-colors">
                                        {exam.title}
                                    </h4>
                                    <p className="text-xs text-slate-400 mb-4 flex items-center gap-1">
                                        <BookOpen size={10} /> {exam.course} · {exam.college}
                                    </p>

                                    {/* Meta Row */}
                                    <div className="flex items-center gap-4 text-[11px] text-slate-500 font-medium">
                                        <span className="flex items-center gap-1"><Clock size={12} className="text-slate-400" /> {exam.duration} min</span>
                                        <span className="flex items-center gap-1"><Award size={12} className="text-slate-400" /> {exam.passingPercentage}% pass</span>
                                        <span className="flex items-center gap-1"><FileText size={12} className="text-slate-400" /> {exam.questionCount || 0} Q</span>
                                    </div>

                                    {/* Access Keys Section */}
                                    {hasKeys ? (
                                        <div className="mt-4 space-y-1.5">
                                            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Access Keys</p>
                                            {exam.trainerKeys.map((tk, idx) => (
                                                <div key={idx} className="flex items-center justify-between bg-slate-900 rounded-lg px-3 py-2">
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <span className="text-[10px] text-indigo-400 font-medium shrink-0">{tk.batchName}</span>
                                                        <code className="text-xs font-bold font-mono text-emerald-400 tracking-wider truncate">{tk.key}</code>
                                                    </div>
                                                    <button onClick={() => copyKey(tk.key)} className="p-1 text-slate-500 hover:text-white transition-colors shrink-0">
                                                        {copiedKey === tk.key ? <CheckCircle size={12} className="text-emerald-400" /> : <Copy size={12} />}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : hasKey ? (
                                        <div className="mt-4 flex items-center justify-between bg-slate-900 rounded-lg px-3 py-2">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <code className="text-sm font-bold font-mono text-emerald-400 tracking-wider">{exam.trainerKey}</code>
                                            </div>
                                            <button onClick={() => copyKey(exam.trainerKey)} className="p-1 text-slate-500 hover:text-white transition-colors">
                                                {copiedKey === exam.trainerKey ? <CheckCircle size={12} className="text-emerald-400" /> : <Copy size={12} />}
                                            </button>
                                        </div>
                                    ) : null}
                                </div>

                                {/* Card Footer */}
                                <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50/40 flex items-center justify-between rounded-b-xl">
                                    {/* Primary Action */}
                                    {!hasKeys && !hasKey ? (
                                        <button
                                            disabled={publishing === exam.id}
                                            onClick={() => handlePublish(exam.id)}
                                            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-all shadow-sm active:scale-95 disabled:opacity-50"
                                        >
                                            {publishing === exam.id ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                                            Publish Exam
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => navigate(`/trainer/monitor/${firstKey}`)}
                                            className="flex items-center gap-1.5 px-4 py-2 bg-[#004AAD] hover:bg-[#003580] text-white rounded-lg text-xs font-semibold transition-all shadow-sm active:scale-95"
                                        >
                                            <Play size={13} fill="currentColor" /> Proctor
                                        </button>
                                    )}

                                    {/* Secondary Actions */}
                                    <div className="flex items-center gap-0.5">
                                        {(hasKeys || hasKey) && (
                                            <button
                                                onClick={() => handleExport(exam.id, exam.title)}
                                                className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                title="Export Results"
                                            >
                                                <Download size={14} />
                                            </button>
                                        )}
                                        {isOwner && (
                                            <button
                                                onClick={() => navigate(`/trainer/exams/edit/${exam.id}`)}
                                                className="p-2 text-slate-400 hover:text-[#004AAD] hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit size={14} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleClone(exam.id, exam.title)}
                                            className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                                            title="Clone"
                                        >
                                            <Copy size={14} />
                                        </button>
                                        {isOwner && (
                                            <button
                                                onClick={() => handleDelete(exam.id)}
                                                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
            
            {/* Alerts & Confirms */}
            <AlertModal 
                isOpen={alertState.isOpen}
                onClose={() => setAlertState({ ...alertState, isOpen: false })}
                title={alertState.title}
                message={alertState.message}
                type={alertState.type}
            />
            <ConfirmModal 
                isOpen={confirmState.isOpen}
                onClose={() => setConfirmState({ ...confirmState, isOpen: false })}
                title={confirmState.title}
                message={confirmState.message}
                onConfirm={confirmState.onConfirm}
            />
        </div>
    );
};

export default TrainerExams;
