import { useState, useEffect } from 'react';
import axios from 'axios';
import { Download, FileText, Loader2, Database, AlertTriangle, CheckCircle2, School, Search, User, Users } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useCollegeStore from '../../store/collegeStore';
import useSocketUpdate from '../../hooks/useSocketUpdate';

const Reports = () => {
    const { token, user } = useAuthStore();
    const { selectedCollegeId, selectedCollegeName } = useCollegeStore();
    
    // Core states
    const [colleges, setColleges] = useState([]);
    const [trainers, setTrainers] = useState([]);
    const [allotments, setAllotments] = useState([]);
    
    // Filter states
    const [selectedCollege, setSelectedCollege] = useState('all');
    const [selectedTrainer, setSelectedTrainer] = useState('all');
    const [selectedBatch, setSelectedBatch] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    // Sync selected college with global store selection
    useEffect(() => {
        if (selectedCollegeId) {
            setSelectedCollege(selectedCollegeId);
        } else {
            setSelectedCollege('all');
        }
        setSelectedBatch('all');
    }, [selectedCollegeId]);

    // Initial Fetch: Colleges
    useEffect(() => {
        if (!token || !user) return;
        
        if (user.role === 'super_admin' || user.role === 'trainer') {
            axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/colleges`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => {
                if (res.data.success) setColleges(res.data.data || []);
            }).catch(err => console.error('Failed to fetch colleges', err));
        }
    }, [token, user]);

    // Fetch Trainers when college filter changes
    useEffect(() => {
        if (!token || !user) return;
        if (user.role === 'trainer') return; // Trainers don't need other trainers

        const fetchTrainers = async () => {
            try {
                const collegeParam = selectedCollege !== 'all' ? `?collegeId=${selectedCollege}` : '';
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/trainers${collegeParam}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                    setTrainers(res.data.data || []);
                }
            } catch (err) {
                console.error('Failed to fetch trainers', err);
            }
        };

        fetchTrainers();
        // Reset trainer and batch filters when changing college
        setSelectedTrainer('all');
        setSelectedBatch('all');
    }, [selectedCollege, token, user]);

    // Fetch Allotments
    const fetchReportData = async () => {
        if (!token || !user) return;
        setLoading(true);

        try {
            const allotmentCollege = user.role === 'college_admin' ? (selectedCollegeId || user.collegeId) : selectedCollege;
            const allotmentParam = allotmentCollege && allotmentCollege !== 'all' ? `?collegeId=${allotmentCollege}` : '';
            
            const allotmentsRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/allotments${allotmentParam}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (allotmentsRes.data.success) {
                setAllotments(allotmentsRes.data.data || []);
            }
        } catch (err) {
            console.error('Failed to load report data', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReportData();
    }, [selectedCollege, selectedCollegeId, token, user]);

    useSocketUpdate(() => fetchReportData(), ['exams', 'courses', 'colleges']);

    // Export Specific Allotment / Exam Report
    const handleExportExamReport = async (examId, examTitle, trainerId, batchId) => {
        setActionLoading(examId);
        try {
            const trainerQuery = trainerId ? `&trainerId=${trainerId}` : '';
            const batchQuery = batchId ? `&batchId=${batchId}` : '&batchId=General';
            
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/analytics/export?type=exam&id=${examId}${trainerQuery}${batchQuery}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    responseType: 'blob'
                }
            );

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${examTitle.replace(/\s+/g, '_')}_Report.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('Export failed:', error);
            alert('Failed to generate exam results report.');
        } finally {
            setActionLoading(false);
        }
    };

    // Extract unique batches from allotments list
    const uniqueBatches = Array.from(
        new Set(allotments.map(a => a.batchId?._id).filter(Boolean))
    ).map(id => allotments.find(a => a.batchId?._id === id).batchId);

    // Filtering logic for frontend tables
    const filteredAllotments = allotments.filter(a => {
        const matchesSearch = a.examId?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              a.examId?.courseId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              a.examId?.courseId?.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              (a.trainerId && `${a.trainerId.firstName} ${a.trainerId.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesTrainer = selectedTrainer === 'all' || a.trainerId?._id === selectedTrainer;
        const matchesBatch = selectedBatch === 'all' || 
                             (selectedBatch === 'General' && !a.batchId) || 
                             (a.batchId?._id === selectedBatch);
        return matchesSearch && matchesTrainer && matchesBatch;
    });

    // College display strings
    const showCollegeSelector = user?.role === 'super_admin' || user?.role === 'trainer';
    const currentCollegeName = colleges.find(c => c._id === selectedCollege)?.name;

    return (
        <div className="space-y-6 animate-fade-in duration-300 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <Database className="text-[#004AAD]" size={26} />
                        Exam Reports
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Export comprehensive multi-sheet reports, analysis, integrity logs, and cohort statistics</p>
                </div>
            </div>

            {/* Filter Panel */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-4">
                {/* College Filter */}
                {showCollegeSelector ? (
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 hover:border-slate-300 transition-all">
                        <School size={16} className="text-slate-400 shrink-0" />
                        <select 
                            className="text-sm bg-transparent outline-none text-slate-700 font-semibold min-w-[180px] cursor-pointer"
                            value={selectedCollege}
                            onChange={(e) => setSelectedCollege(e.target.value)}
                        >
                            <option value="all">All Colleges</option>
                            {colleges.map(c => (<option key={c._id} value={c._id}>{c.name}</option>))}
                        </select>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 bg-blue-50/50 px-4 py-2.5 rounded-xl border border-blue-100/60 text-xs text-[#004AAD] font-bold">
                        <School size={14} />
                        <span>College: {selectedCollegeName || 'Your College'}</span>
                    </div>
                )}

                {/* Trainer Filter */}
                {user?.role !== 'trainer' && (
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 hover:border-slate-300 transition-all">
                        <User size={16} className="text-slate-400 shrink-0" />
                        <select 
                            className="text-sm bg-transparent outline-none text-slate-700 font-semibold min-w-[180px] cursor-pointer"
                            value={selectedTrainer}
                            onChange={(e) => setSelectedTrainer(e.target.value)}
                        >
                            <option value="all">All Trainers</option>
                            {trainers.map(t => (
                                <option key={t._id} value={t._id}>{t.firstName || t.username} {t.lastName || ''}</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Batch Filter */}
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 hover:border-slate-300 transition-all">
                    <Users size={16} className="text-slate-400 shrink-0" />
                    <select 
                        className="text-sm bg-transparent outline-none text-slate-700 font-semibold min-w-[180px] cursor-pointer"
                        value={selectedBatch}
                        onChange={(e) => setSelectedBatch(e.target.value)}
                    >
                        <option value="all">All Batches</option>
                        <option value="General">General (No Batch)</option>
                        {uniqueBatches.map(b => (
                            <option key={b._id} value={b._id}>{b.batchName}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Main Area */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                {/* Search Bar */}
                <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-slate-50/50">
                    <div className="relative w-full sm:w-72">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-[#004AAD] focus:ring-2 focus:ring-blue-100 transition-all" 
                            placeholder="Search by exam or course..."
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                        />
                    </div>
                </div>

                {/* Subtitle Scope Indicator */}
                {selectedCollege !== 'all' && currentCollegeName && (
                    <div className="px-6 py-3 bg-blue-50/30 border-b border-blue-50/50 text-xs text-slate-500 flex items-center gap-2">
                        <School size={13} className="text-[#004AAD]" />
                        <span>Filtering records for <span className="font-semibold text-slate-700">{currentCollegeName}</span></span>
                    </div>
                )}

                {/* Data Preview Table */}
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="py-20 text-center">
                            <Loader2 className="animate-spin text-[#004AAD] mx-auto" size={28} />
                            <p className="text-xs font-semibold text-slate-400 mt-3">Fetching records...</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/40">
                                    <th className="px-6 py-3.5 text-[10px] font-bold text-slate-455 uppercase tracking-wider">Exam Title</th>
                                    <th className="px-6 py-3.5 text-[10px] font-bold text-slate-455 uppercase tracking-wider">Course</th>
                                    <th className="px-6 py-3.5 text-[10px] font-bold text-slate-455 uppercase tracking-wider">Trainer Context</th>
                                    <th className="px-6 py-3.5 text-[10px] font-bold text-slate-455 uppercase tracking-wider">Target Batch</th>
                                    <th className="px-6 py-3.5 text-[10px] font-bold text-slate-455 uppercase tracking-wider">Access Key</th>
                                    <th className="px-6 py-3.5 text-[10px] font-bold text-slate-455 uppercase tracking-wider text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredAllotments.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-16 text-center text-sm font-semibold text-slate-400">
                                            No exam allotments match the active filters.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredAllotments.map((a) => (
                                        <tr key={a._id} className="hover:bg-slate-50/40 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 bg-blue-50 text-[#004AAD] rounded-xl flex items-center justify-center shrink-0">
                                                        <FileText size={16} />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-semibold text-slate-800 truncate">{a.examId?.title || 'Unknown Exam'}</p>
                                                        {a.examId?.status && (
                                                            <span className="text-[10px] font-bold text-slate-400 capitalize mt-0.5 inline-block">{a.examId.status}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-xs font-semibold text-slate-600">
                                                {a.examId?.courseId?.name || '—'}
                                                {a.examId?.courseId?.code && <code className="ml-1.5 px-1.5 py-0.5 bg-slate-100 rounded text-slate-500 font-mono text-[10px]">{a.examId.courseId.code}</code>}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-xs font-bold text-slate-700">
                                                    {a.trainerId ? `${a.trainerId.firstName} ${a.trainerId.lastName}` : 'System'}
                                                </div>
                                                {a.trainerId?.phone && (
                                                    <div className="text-[10px] text-slate-400 font-medium mt-0.5">{a.trainerId.phone}</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                                    a.batchId ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-slate-100 text-slate-500'
                                                }`}>
                                                    {a.batchId?.batchName || 'General'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <code className="px-2.5 py-1 bg-slate-900 text-emerald-400 rounded-lg text-xs font-mono font-bold tracking-wide">{a.uniqueKey}</code>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button 
                                                    onClick={() => handleExportExamReport(a.examId?._id || a.examId, a.examId?.title, a.trainerId?._id || a.trainerId, a.batchId?._id || a.batchId)}
                                                    disabled={actionLoading === a.examId?._id}
                                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#004AAD] hover:bg-[#003580] text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
                                                >
                                                    {actionLoading === a.examId?._id ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
                                                    Export Results
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Widget Info Panels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-amber-50/40 p-5 rounded-2xl border border-amber-200 flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 flex-shrink-0">
                        <AlertTriangle size={18} />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-900">Integrity Violation Analytics</h4>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-medium">
                            Every generated Exam Report contains a complete proctoring checklist, recording student tab switches, devTools interventions, idle durations, and copy-paste warnings.
                        </p>
                    </div>
                </div>
                <div className="bg-emerald-50/40 p-5 rounded-2xl border border-emerald-200 flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
                        <CheckCircle2 size={18} />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-900">Adaptive Item Difficulty Index</h4>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-medium">
                            The Difficulty Index sheet analyzes success rates and speed indices for every question, allowing curriculum managers to optimize assessment rigor.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
