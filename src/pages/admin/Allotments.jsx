import { useState, useEffect } from 'react';
import { 
    Send, Search, Key, User, Copy, RefreshCcw, Loader2, Download, 
    CheckCircle2, X, School, BookOpen, Clock, Target, Calendar, 
    Layers, ChevronRight, Settings, Info
} from 'lucide-react';
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
    const [selectedTrainerId, setSelectedTrainerId] = useState(null);
    const [selectedExamDetail, setSelectedExamDetail] = useState(null);

    const fetchAllotments = async () => {
        try { 
            setLoading(true); 
            const url = effectiveCollegeId 
                ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/allotments?collegeId=${effectiveCollegeId}` 
                : `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/allotments`; 
            const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } }); 
            setAllotments(res.data.data || []); 
        } catch (e) { 
            console.error(e); 
        } finally { 
            setLoading(false); 
        }
    };

    useEffect(() => { fetchAllotments(); }, [effectiveCollegeId]);
    useSocketUpdate(() => fetchAllotments(), ['colleges', 'courses', 'exams']);

    const copyToClipboard = (text, id) => { 
        navigator.clipboard.writeText(text); 
        setCopied(id); 
        setTimeout(() => setCopied(null), 2000); 
    };

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

    // Group allotments by trainer
    const trainersGroup = allotments.reduce((acc, current) => {
        const tId = current.trainerId?._id || 'unassigned';
        if (!acc[tId]) {
            acc[tId] = {
                trainer: current.trainerId || { firstName: 'System', lastName: 'Unassigned', email: 'N/A', phone: '' },
                allotments: []
            };
        }
        acc[tId].allotments.push(current);
        return acc;
    }, {});

    const trainersList = Object.values(trainersGroup);

    // Filter trainers based on search query (searching trainer name, exam title, batch name, key)
    const filteredTrainers = trainersList.map(item => {
        const matchedAllotments = item.allotments.filter(a => 
            a.examId?.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
            a.uniqueKey?.toLowerCase().includes(searchTerm.toLowerCase()) || 
            (a.batchId?.batchName || 'General').toLowerCase().includes(searchTerm.toLowerCase()) ||
            `${item.trainer.firstName} ${item.trainer.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return {
            ...item,
            allotments: matchedAllotments
        };
    }).filter(item => item.allotments.length > 0);

    // Auto-select the first trainer if none is selected and filtered list is loaded
    useEffect(() => {
        if (filteredTrainers.length > 0 && !selectedTrainerId) {
            setSelectedTrainerId(filteredTrainers[0].trainer._id || 'unassigned');
        }
    }, [filteredTrainers, selectedTrainerId]);

    // If active selection is filtered out, select another active one
    useEffect(() => {
        if (selectedTrainerId && filteredTrainers.length > 0) {
            const stillExists = filteredTrainers.some(item => (item.trainer._id || 'unassigned') === selectedTrainerId);
            if (!stillExists) {
                setSelectedTrainerId(filteredTrainers[0].trainer._id || 'unassigned');
            }
        }
    }, [filteredTrainers, selectedTrainerId]);

    const activeTrainerData = filteredTrainers.find(item => (item.trainer._id || 'unassigned') === selectedTrainerId);

    if (user?.role === 'super_admin' && !effectiveCollegeId) {
        return (
            <div className="h-[50vh] flex flex-col items-center justify-center">
                <Send size={40} className="text-slate-200 mb-4" />
                <h2 className="text-xl font-bold text-slate-900">Select a College</h2>
                <p className="text-sm text-slate-500 mt-1 max-w-sm text-center">
                    Choose a college to view exam allotments and access keys.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Allotments</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage exam access keys assigned to trainers</p>
                </div>
                <button onClick={fetchAllotments} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50"><RefreshCcw size={16} /> Refresh</button>
            </div>

            {/* Main Panel grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Panel: Master List of Trainers */}
                <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col max-h-[75vh]">
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col gap-3">
                        <div className="relative">
                            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-[#004AAD] transition-all" 
                                placeholder="Search by trainer, exam, key..." 
                                value={searchTerm} 
                                onChange={(e) => setSearchTerm(e.target.value)} 
                            />
                        </div>
                    </div>

                    <div className="overflow-y-auto divide-y divide-slate-100 flex-1 custom-scrollbar">
                        {loading ? (
                            <div className="py-12 text-center">
                                <Loader2 className="animate-spin mx-auto text-[#004AAD]" size={24} />
                            </div>
                        ) : filteredTrainers.length === 0 ? (
                            <div className="py-12 text-center text-slate-400">
                                <User size={28} className="mx-auto text-slate-200 mb-2" />
                                <p className="text-xs font-semibold">No trainers found</p>
                            </div>
                        ) : (
                            filteredTrainers.map((item) => {
                                const tId = item.trainer._id || 'unassigned';
                                const isActive = selectedTrainerId === tId;
                                const initials = `${item.trainer.firstName?.charAt(0) || ''}${item.trainer.lastName?.charAt(0) || ''}` || 'U';

                                return (
                                    <div 
                                        key={tId}
                                        onClick={() => setSelectedTrainerId(tId)}
                                        className={`p-4 flex gap-3 items-center cursor-pointer transition-all ${isActive ? 'bg-blue-50/60 border-l-4 border-l-[#004AAD]' : 'hover:bg-slate-50/50'}`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl font-extrabold text-xs flex items-center justify-center flex-shrink-0 shadow-inner ${isActive ? 'bg-blue-100 text-[#004AAD]' : 'bg-slate-100 text-slate-500'}`}>
                                            {initials}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-xs font-bold text-slate-800 truncate">{item.trainer.firstName} {item.trainer.lastName}</h4>
                                            <p className="text-[10px] text-slate-400 truncate mt-0.5">{item.trainer.email}</p>
                                        </div>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-blue-100 text-[#004AAD]' : 'bg-slate-100 text-slate-500'}`}>
                                            {item.allotments.length} Exam{item.allotments.length !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Right Panel: Selected Trainer Allotments Detail */}
                <div className="lg:col-span-8 space-y-6">
                    {activeTrainerData ? (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
                            {/* Trainer Info Header */}
                            <div className="pb-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="flex gap-4 items-center">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-[#004AAD] flex items-center justify-center font-extrabold text-base border border-indigo-100 shadow-sm">
                                        {`${activeTrainerData.trainer.firstName?.charAt(0) || ''}${activeTrainerData.trainer.lastName?.charAt(0) || ''}` || 'U'}
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-800">{activeTrainerData.trainer.firstName} {activeTrainerData.trainer.lastName}</h3>
                                        <p className="text-xs text-slate-400 mt-0.5">{activeTrainerData.trainer.email} {activeTrainerData.trainer.phone ? `• ${activeTrainerData.trainer.phone}` : ''}</p>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-[#004AAD] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                                    {activeTrainerData.allotments.length} Active Allotment{activeTrainerData.allotments.length !== 1 ? 's' : ''}
                                </span>
                            </div>

                            {/* Allotments list cards */}
                            <div className="space-y-4">
                                {activeTrainerData.allotments.map((a) => (
                                    <div key={a._id} className="p-4 rounded-xl border border-slate-150 bg-slate-50/20 hover:border-blue-200 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group">
                                        <div className="space-y-1.5 flex-1 min-w-0">
                                            <h4 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-[#004AAD] transition-colors">{a.examId?.title}</h4>
                                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-semibold text-slate-400">
                                                <span className="flex items-center gap-1"><BookOpen size={11} /> {a.examId?.courseId?.name} ({a.examId?.courseId?.code})</span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1"><Layers size={11} /> {a.batchId?.batchName || 'General'}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-3 shrink-0">
                                            {/* Access Key copyable badge */}
                                            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg pl-2.5 pr-1 py-1 shadow-xs">
                                                <code className="text-xs font-mono font-bold text-slate-700 tracking-wide">{a.uniqueKey}</code>
                                                <button 
                                                    onClick={() => copyToClipboard(a.uniqueKey, a._id)}
                                                    className="p-1 hover:bg-slate-250 rounded-md text-slate-400 hover:text-[#004AAD] transition-colors cursor-pointer"
                                                    title="Copy Access Key"
                                                >
                                                    {copied === a._id ? <CheckCircle2 size={13} className="text-emerald-500" /> : <Copy size={13} />}
                                                </button>
                                            </div>

                                            {/* Action buttons */}
                                            <div className="flex items-center gap-1.5">
                                                <button
                                                    onClick={() => setSelectedExamDetail(a)}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-[#004AAD]/10 text-slate-650 hover:text-[#004AAD] rounded-lg text-[10px] font-bold border border-slate-200 hover:border-[#004AAD]/20 transition-all cursor-pointer"
                                                    title="View Exam Settings"
                                                >
                                                    <Info size={12} /> Info
                                                </button>
                                                <button 
                                                    onClick={() => handleExportAllotment(a.examId?._id || a.examId, a.examId?.title, a.trainerId?._id || a.trainerId, a.batchId?._id || a.batchId)} 
                                                    className="p-2 bg-slate-100 hover:bg-emerald-50 text-slate-500 hover:text-emerald-600 rounded-lg border border-slate-200 hover:border-emerald-200 transition-all cursor-pointer" 
                                                    title="Export Allotment Results"
                                                >
                                                    <Download size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-16 text-center">
                            <User size={40} className="mx-auto text-slate-300 mb-3 animate-pulse" />
                            <h4 className="font-bold text-slate-750 text-sm">Select a Trainer</h4>
                            <p className="text-xs text-slate-400 mt-1">Select a trainer from the master list to view their allotted exams and access keys.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Exam Details Modal */}
            {selectedExamDetail && (() => {
                const exam = selectedExamDetail.examId || {};
                const batch = selectedExamDetail.batchId || {};
                const formattedDate = exam.scheduledDate ? new Date(exam.scheduledDate).toLocaleString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true
                }) : 'Immediate / Open';
                const formattedExpiry = exam.expiryDate ? new Date(exam.expiryDate).toLocaleString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true
                }) : 'Manual closure by trainer';

                return (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                        <div 
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
                            onClick={() => setSelectedExamDetail(null)}
                        />
                        <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col z-10 animate-in zoom-in-95 duration-200 max-h-[90vh]">
                            {/* Modal Header */}
                            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <div>
                                    <span className="text-[9px] font-bold text-[#004AAD] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full uppercase tracking-wider">Exam Parameters</span>
                                    <h3 className="font-extrabold text-slate-800 text-base mt-1">{exam.title || 'Exam Information'}</h3>
                                </div>
                                <button
                                    onClick={() => setSelectedExamDetail(null)}
                                    className="p-1.5 hover:bg-slate-200/60 text-slate-400 hover:text-slate-650 rounded-lg transition-colors cursor-pointer"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 overflow-y-auto space-y-6 text-xs">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Left Column: Context & Metrics */}
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><School size={12} /> Academic Context</h4>
                                            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 space-y-2 font-medium">
                                                <p className="text-slate-500">Course: <strong className="text-slate-700">{exam.courseId?.name || 'N/A'}</strong></p>
                                                <p className="text-slate-500">Code: <strong className="text-slate-700">{exam.courseId?.code || 'N/A'}</strong></p>
                                                {exam.department && <p className="text-slate-500">Department: <strong className="text-slate-700">{exam.department}</strong></p>}
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Clock size={12} /> Schedule Constraints</h4>
                                            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 space-y-2 font-medium">
                                                <p className="text-slate-500">Duration: <strong className="text-slate-700">{exam.duration || 60} Minutes</strong></p>
                                                <p className="text-slate-500">Scheduled: <strong className="text-slate-700">{formattedDate}</strong></p>
                                                <p className="text-slate-500">Expires: <strong className="text-slate-700">{formattedExpiry}</strong></p>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Target size={12} /> Scoring & Criteria</h4>
                                            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 space-y-2 font-medium">
                                                <p className="text-slate-500">Total Marks: <strong className="text-slate-700">{exam.totalMarks || 'N/A'} Points</strong></p>
                                                <p className="text-slate-500">Passing Score: <strong className="text-slate-700">{exam.passingPercentage || 40}%</strong></p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column: Key, Allocation & Safety */}
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Key size={12} /> Allocation Details</h4>
                                            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 space-y-2.5 font-medium">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-slate-500">Target Batch:</span>
                                                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-md font-bold text-[10px]">
                                                        {batch.batchName || 'General'}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center gap-2">
                                                    <span className="text-slate-500">Access Key:</span>
                                                    <div className="flex items-center gap-1.5 bg-slate-900 text-emerald-400 pl-2.5 pr-1 py-1 rounded-lg font-mono font-bold tracking-wide shadow-inner">
                                                        {selectedExamDetail.uniqueKey}
                                                        <button 
                                                            onClick={() => copyToClipboard(selectedExamDetail.uniqueKey, selectedExamDetail._id)}
                                                            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-emerald-300 transition-colors cursor-pointer"
                                                            title="Copy Access Key"
                                                        >
                                                            {copied === selectedExamDetail._id ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Copy size={12} />}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Settings size={12} /> Safety & Preferences</h4>
                                            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 grid grid-cols-2 gap-x-4 gap-y-2 font-medium">
                                                <div className="flex items-center gap-1.5">
                                                    <span className={`w-2 h-2 rounded-full ${exam.settings?.shuffleQuestions ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                                    <span className="text-slate-650">Shuffle Questions</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className={`w-2 h-2 rounded-full ${exam.settings?.showResultImmediately ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                                    <span className="text-slate-650">Show Results</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className={`w-2 h-2 rounded-full ${exam.settings?.allowReview ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                                    <span className="text-slate-650">Allow Review</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className={`w-2 h-2 rounded-full ${exam.settings?.randomizeQuestions ? 'bg-indigo-500' : 'bg-slate-300'}`} />
                                                    <span className="text-slate-650">Pooling Enabled</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
                                <button
                                    onClick={() => handleExportAllotment(exam._id || exam, exam.title, selectedExamDetail.trainerId?._id || selectedExamDetail.trainerId, batch._id || batch)}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-sm active:scale-95 cursor-pointer text-xs"
                                >
                                    <Download size={14} /> Export Results
                                </button>
                                <button
                                    onClick={() => setSelectedExamDetail(null)}
                                    className="px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-semibold transition-all cursor-pointer text-xs"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
};

export default Allotments;
