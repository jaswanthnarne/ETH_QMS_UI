import { useState, useEffect } from 'react';
import { FileText, Download, Trash2, Clock, Award, Search, Loader2, Send, Copy, Edit, Plus, Eye, BarChart3, Users, XCircle, Building2 } from 'lucide-react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useCollegeStore from '../../store/collegeStore';
import useSocketUpdate from '../../hooks/useSocketUpdate';

const StatusBadge = ({ status }) => {
    const config = {
        published: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Published' },
        draft: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500', label: 'Draft' },
        archived: { bg: 'bg-slate-100', text: 'text-slate-500', dot: 'bg-slate-400', label: 'Archived' },
    };
    const c = config[status] || config.draft;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${c.bg} ${c.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
            {c.label}
        </span>
    );
};

const Exams = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [publishing, setPublishing] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const { token, user } = useAuthStore();
    const { selectedCollegeId } = useCollegeStore();

    const urlCollegeMatch = location.pathname.match(/\/college\/([a-f0-9]+)/);
    const effectiveCollegeId = selectedCollegeId || (urlCollegeMatch ? urlCollegeMatch[1] : null);

    const isReadOnly = ['regional_manager', 'asst_rm'].includes(user?.role);

    const fetchExams = async () => {
        try {
            setLoading(true);
            const url = effectiveCollegeId
                ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/exams?collegeId=${effectiveCollegeId}`
                : `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/exams`;
            const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
            setExams(res.data.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchExams(); }, [effectiveCollegeId]);
    useSocketUpdate(() => fetchExams(), ['exams']);

    const handlePublish = async (id) => {
        try {
            setPublishing(id);
            const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/exams/${id}/publish`, {}, { headers: { Authorization: `Bearer ${token}` } });
            alert(`Exam published! Generated ${res.data.keys?.length || 0} access keys.`);
            fetchExams();
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to publish');
        } finally {
            setPublishing(null);
        }
    };

    const handleUnpublish = async (id) => {
        if (!window.confirm('Retract this exam? Trainers will lose access.')) return;
        try {
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/exams/${id}/unpublish`, {}, { headers: { Authorization: `Bearer ${token}` } });
            fetchExams();
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to unpublish');
        }
    };

    const handleExport = async (id, title) => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/analytics/export?type=exam&id=${id}`, { headers: { Authorization: `Bearer ${token}` }, responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const a = document.createElement('a');
            a.href = url; a.setAttribute('download', `${title}_Results.xlsx`);
            document.body.appendChild(a); a.click(); a.remove();
        } catch { alert('Export failed'); }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this exam? All student results will be removed.')) {
            try {
                await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/exams/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                fetchExams();
            } catch (error) {
                alert(error.response?.data?.error || 'Failed');
            }
        }
    };

    const handleClone = async (id, title) => {
        if (!window.confirm(`Clone "${title}"? A draft copy will be created.`)) return;
        try {
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/exams/${id}/clone`, {}, { headers: { Authorization: `Bearer ${token}` } });
            fetchExams();
        } catch (error) {
            alert(error.response?.data?.error || 'Clone failed');
        }
    };

    const filteredExams = exams.filter(e => {
        const matchesSearch = e.title?.toLowerCase().includes(searchTerm.toLowerCase()) || e.courseId?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: exams.length,
        published: exams.filter(e => e.status === 'published').length,
        draft: exams.filter(e => e.status === 'draft').length,
    };

    if (user?.role === 'super_admin' && !effectiveCollegeId) return (
        <div className="h-[50vh] flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-5">
                <Building2 size={28} className="text-slate-300" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Select a College</h2>
            <p className="text-sm text-slate-500 mt-1 max-w-sm text-center">Choose a college from the selector to view and manage its exams.</p>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Assessments</h1>
                    <p className="text-sm text-slate-500 mt-1">Create, publish, and track exam assessments</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => handleExport('all', 'All_Exams')} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors">
                        <Download size={15} /> Export
                    </button>
                    {!isReadOnly && (
                        <button onClick={() => navigate('/admin/exams/create')} className="flex items-center gap-2 px-5 py-2.5 bg-[#004AAD] text-white text-sm font-semibold rounded-lg hover:bg-[#003580] shadow-sm active:scale-95 transition-all">
                            <Plus size={16} /> New Exam
                        </button>
                    )}
                </div>
            </div>

            {/* Stats Strip */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <FileText size={18} className="text-[#004AAD]" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500">Total Exams</p>
                        <p className="text-lg font-bold text-slate-900">{stats.total}</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                        <Eye size={18} className="text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500">Published</p>
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
                    <input className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-[#004AAD] transition-colors" placeholder="Search exams or courses..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1">
                    {[
                        { key: 'all', label: 'All' },
                        { key: 'published', label: 'Published' },
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

            {/* Exam Cards */}
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
                        <h3 className="text-base font-semibold text-slate-700">No exams found</h3>
                        <p className="text-sm text-slate-400 mt-1 max-w-xs">
                            {searchTerm ? 'Try adjusting your search term.' : 'Create your first exam to get started.'}
                        </p>
                    </div>
                ) : (
                    filteredExams.map((exam) => (
                        <div key={exam._id} className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200 flex flex-col group">
                            {/* Card Header */}
                            <div className="p-5 flex-1">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 bg-blue-50 text-[#004AAD] rounded text-[11px] font-bold tracking-wide">
                                            {exam.courseId?.code || '—'}
                                        </span>
                                        {exam.collegeId?.name && (
                                            <span className="px-2 py-0.5 bg-slate-50 text-slate-500 rounded text-[10px] font-medium truncate max-w-[120px]">
                                                {exam.collegeId.name}
                                            </span>
                                        )}
                                    </div>
                                    <StatusBadge status={exam.status} />
                                </div>

                                <h4 className="text-[15px] font-bold text-slate-900 mb-1 line-clamp-2 leading-snug group-hover:text-[#004AAD] transition-colors">
                                    {exam.title}
                                </h4>
                                <p className="text-xs text-slate-400 mb-4">{exam.courseId?.name || '—'}</p>

                                {/* Meta Row */}
                                <div className="flex items-center gap-4 text-[11px] text-slate-500 font-medium">
                                    <span className="flex items-center gap-1"><Clock size={12} className="text-slate-400" /> {exam.duration} min</span>
                                    <span className="flex items-center gap-1"><Award size={12} className="text-slate-400" /> {exam.passingPercentage}% pass</span>
                                    <span className="flex items-center gap-1"><FileText size={12} className="text-slate-400" /> {exam.totalMarks || 0} marks</span>
                                </div>
                            </div>

                            {/* Card Footer */}
                            <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50/40 flex items-center justify-between rounded-b-xl">
                                {!isReadOnly ? (
                                    exam.status === 'draft' ? (
                                        <button
                                            disabled={publishing === exam._id}
                                            onClick={() => handlePublish(exam._id)}
                                            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-all shadow-sm active:scale-95 disabled:opacity-50"
                                        >
                                            {publishing === exam._id ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                                            Publish
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleUnpublish(exam._id)}
                                            className="flex items-center gap-1.5 px-4 py-2 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold transition-all active:scale-95"
                                        >
                                            <XCircle size={13} /> Unpublish
                                        </button>
                                    )
                                ) : (
                                    <span className="text-xs text-slate-400 font-medium italic">View Only</span>
                                )}

                                <div className="flex items-center gap-0.5">
                                    {exam.status === 'published' && (
                                        <button onClick={() => handleExport(exam._id, exam.title)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Export Results">
                                            <Download size={14} />
                                        </button>
                                    )}
                                    {!isReadOnly && (
                                        <>
                                            {user?.role !== 'college_admin' && (
                                                <button onClick={() => navigate(`/admin/exams/edit/${exam._id}`)} className="p-2 text-slate-400 hover:text-[#004AAD] hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                                                    <Edit size={14} />
                                                </button>
                                            )}
                                            <button onClick={() => handleClone(exam._id, exam.title)} className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors" title="Clone">
                                                <Copy size={14} />
                                            </button>
                                            <button onClick={() => handleDelete(exam._id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors" title="Delete">
                                                <Trash2 size={14} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
export default Exams;
