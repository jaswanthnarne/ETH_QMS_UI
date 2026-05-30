import { useState, useEffect } from 'react';
import { Send, Search, Key, User, Copy, RefreshCcw, Loader2, Download, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useCollegeStore from '../../store/collegeStore';
import useSocketUpdate from '../../hooks/useSocketUpdate';

const Allotments = () => {
    const { token, user } = useAuthStore();
    const { selectedCollegeId } = useCollegeStore();
    const location = useLocation();

    // Derive college ID from URL as fallback
    const urlCollegeMatch = location.pathname.match(/\/college\/([a-f0-9]+)/);
    const effectiveCollegeId = selectedCollegeId || (urlCollegeMatch ? urlCollegeMatch[1] : null);

    const [allotments, setAllotments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [copied, setCopied] = useState(null);

    const fetchAllotments = async () => {
        try { setLoading(true); const url = effectiveCollegeId ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/allotments?collegeId=${effectiveCollegeId}` : 'http://localhost:5000/api/admin/allotments'; const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } }); setAllotments(res.data.data); } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    useEffect(() => { fetchAllotments(); }, [effectiveCollegeId]);
    useSocketUpdate(() => fetchAllotments(), ['colleges', 'courses', 'exams']);

    const copyToClipboard = (text, id) => { navigator.clipboard.writeText(text); setCopied(id); setTimeout(() => setCopied(null), 2000); };
    const filteredAllotments = allotments.filter(a => a.examId?.title?.toLowerCase().includes(searchTerm.toLowerCase()) || a.trainerId?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) || a.uniqueKey?.toLowerCase().includes(searchTerm.toLowerCase()) || (a.batchId?.batchName || 'General').toLowerCase().includes(searchTerm.toLowerCase()));

    const handleExportAllotment = async (examId, examTitle, trainerId, batchId) => {
        try {
            const batchParam = batchId ? `&batchId=${batchId}` : '&batchId=General';
            const url = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/analytics/export?type=exam&id=${examId}&trainerId=${trainerId}${batchParam}`;
            const res = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });
            const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
            const a = document.createElement('a');
            a.href = blobUrl;
            a.setAttribute('download', `${examTitle.replace(/\s+/g, '_')}_Results.xlsx`);
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            alert('Export failed');
        }
    };

    if (user?.role === 'super_admin' && !effectiveCollegeId) return (<div className="h-[50vh] flex flex-col items-center justify-center"><Send size={40} className="text-slate-200 mb-4" /><h2 className="text-xl font-bold text-slate-900">Select a College</h2><p className="text-sm text-slate-500 mt-1 max-w-sm text-center">Choose a college to view exam allotments and access keys.</p></div>);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div><h1 className="text-2xl font-bold text-slate-900">Allotments</h1><p className="text-sm text-slate-500 mt-1">Manage exam access keys assigned to trainers</p></div>
                <button onClick={fetchAllotments} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50"><RefreshCcw size={16} /> Refresh</button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-slate-700">{filteredAllotments.length} allotment{filteredAllotments.length !== 1 ? 's' : ''}</h3>
                    <div className="relative w-72"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#004AAD]" placeholder="Search by trainer, exam, or key..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
                </div>
                <table className="w-full text-left">
                    <thead><tr className="bg-slate-50"><th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Trainer</th><th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Exam</th><th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Target Batch</th><th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Access Key</th><th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th><th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th></tr></thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? <tr><td colSpan="6" className="px-6 py-16 text-center"><Loader2 className="animate-spin mx-auto text-[#004AAD]" size={24} /></td></tr>
                        : filteredAllotments.length === 0 ? <tr><td colSpan="6" className="px-6 py-16 text-center"><Key size={32} className="text-slate-200 mx-auto mb-2" /><p className="text-sm text-slate-400">No allotments found</p></td></tr>
                        : filteredAllotments.map((a) => (
                            <tr key={a._id} className="hover:bg-slate-50/50 group">
                                <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center"><User size={16} className="text-slate-500" /></div><div><p className="text-sm font-semibold text-slate-900">{a.trainerId?.firstName} {a.trainerId?.lastName}</p><p className="text-xs text-slate-400">{a.trainerId?.email}</p></div></div></td>
                                <td className="px-6 py-4"><p className="text-sm font-medium text-slate-900">{a.examId?.title}</p><p className="text-xs text-slate-400">{a.examId?.courseId?.name} • {a.examId?.courseId?.code}</p></td>
                                <td className="px-6 py-4"><span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${a.batchId ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>{a.batchId?.batchName || 'General'}</span></td>
                                <td className="px-6 py-4"><div className="flex items-center gap-2"><code className="px-3 py-1.5 bg-slate-900 text-emerald-400 rounded-md text-xs font-mono font-bold tracking-wider">{a.uniqueKey}</code><button onClick={() => copyToClipboard(a.uniqueKey, a._id)} className="p-1.5 text-slate-400 hover:text-[#004AAD] rounded hover:bg-blue-50 transition-colors">{copied === a._id ? <CheckCircle size={14} className="text-emerald-500" /> : <Copy size={14} />}</button></div></td>
                                <td className="px-6 py-4"><span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />Active</span></td>
                                <td className="px-6 py-4 text-right">
                                    <button 
                                        onClick={() => handleExportAllotment(a.examId?._id || a.examId, a.examId?.title, a.trainerId?._id || a.trainerId, a.batchId?._id || a.batchId)} 
                                        className="p-1.5 text-slate-400 hover:text-[#004AAD] rounded-md hover:bg-blue-50 transition-colors" 
                                        title="Export Allotment Results"
                                    >
                                        <Download size={14} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Allotments;
