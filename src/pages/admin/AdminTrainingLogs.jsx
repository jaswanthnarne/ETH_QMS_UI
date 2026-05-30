import { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { 
    Download, FileText, Loader2, Database, School, Calendar, 
    BookOpen, Users, Clock, ArrowRight, Eye, X, BookOpenCheck, Search
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useCollegeStore from '../../store/collegeStore';
import useSocketUpdate from '../../hooks/useSocketUpdate';

const AdminTrainingLogs = () => {
    const { token, user } = useAuthStore();
    const { selectedCollegeId, selectedCollegeName } = useCollegeStore();
    const location = useLocation();

    // Derive college ID from URL as fallback when store hasn't hydrated yet
    const urlCollegeMatch = location.pathname.match(/\/college\/([a-f0-9]+)/);
    const effectiveCollegeId = selectedCollegeId || (urlCollegeMatch ? urlCollegeMatch[1] : null);
    
    const [logs, setLogs] = useState([]);
    const [colleges, setColleges] = useState([]);
    const [trainers, setTrainers] = useState([]);
    
    const [selectedCollege, setSelectedCollege] = useState(effectiveCollegeId || 'all');
    const [selectedTrainer, setSelectedTrainer] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (effectiveCollegeId) {
            setSelectedCollege(effectiveCollegeId);
        } else {
            setSelectedCollege('all');
        }
    }, [effectiveCollegeId]);
    
    const [loading, setLoading] = useState(true);
    const [exportLoading, setExportLoading] = useState(false);
    
    // Details Modal State
    const [selectedLog, setSelectedLog] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch colleges on mount (only for super admin)
    useEffect(() => {
        if (user?.role === 'super_admin') {
            fetchColleges();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetch trainers when college scope changes, and reset trainer selection
    useEffect(() => {
        setSelectedTrainer('all');
        fetchTrainers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCollege, effectiveCollegeId]);

    // Fetch logs when college or trainer selection changes
    useEffect(() => {
        fetchLogs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCollege, selectedTrainer, effectiveCollegeId]);

    useSocketUpdate(() => {
        fetchLogs();
    }, ['training_logs']);

    const fetchColleges = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/colleges`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setColleges(res.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch colleges', error);
        }
    };

    const fetchTrainers = async () => {
        try {
            const collegeContextId = effectiveCollegeId || (user?.role === 'super_admin' 
                ? (selectedCollege !== 'all' ? selectedCollege : '')
                : user?.collegeId);
            
            const params = {};
            if (collegeContextId) {
                params.collegeId = collegeContextId;
            }

            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/trainers`, {
                headers: { Authorization: `Bearer ${token}` },
                params
            });
            if (res.data.success) {
                setTrainers(res.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch trainers', error);
        }
    };

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const params = {};
            const collegeContextId = effectiveCollegeId || (user?.role === 'super_admin' 
                ? (selectedCollege !== 'all' ? selectedCollege : '')
                : user?.collegeId);

            if (collegeContextId) {
                params.collegeId = collegeContextId;
            }

            if (selectedTrainer !== 'all') {
                params.trainerId = selectedTrainer;
            }

            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/training-logs`, {
                headers: { Authorization: `Bearer ${token}` },
                params
            });

            if (res.data.success) {
                setLogs(res.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch training logs', error);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        setExportLoading(true);
        try {
            const params = {};
            if (user?.role === 'super_admin') {
                if (effectiveCollegeId) {
                    params.collegeId = effectiveCollegeId;
                } else if (selectedCollege !== 'all') {
                    params.collegeId = selectedCollege;
                }
            } else {
                params.collegeId = effectiveCollegeId || user?.collegeId;
            }

            const collegeQuery = params.collegeId ? `&collegeId=${params.collegeId}` : '';
            const trainerQuery = selectedTrainer !== 'all' ? `&trainerId=${selectedTrainer}` : '';
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/analytics/export?type=training_logs${collegeQuery}${trainerQuery}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    responseType: 'blob'
                }
            );

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;

            let collegeName = 'Overall_Platform';
            if (params.collegeId) {
                if (user?.role === 'super_admin') {
                    const matched = colleges.find(c => c._id === selectedCollege);
                    if (matched) collegeName = matched.name;
                } else {
                    collegeName = selectedCollegeName || 'College';
                }
            }

            let filename = `${collegeName.replace(/\s+/g, '_')}_Training_Logs_Report.xlsx`;
            if (selectedTrainer !== 'all') {
                const matchedTrainer = trainers.find(t => t._id === selectedTrainer);
                if (matchedTrainer) {
                    const trainerName = `${matchedTrainer.firstName || ''} ${matchedTrainer.lastName || ''}`.trim() || matchedTrainer.username;
                    filename = `${collegeName.replace(/\s+/g, '_')}_Trainer_${trainerName.replace(/\s+/g, '_')}_Training_Logs_Report.xlsx`;
                }
            }

            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('Failed to export training logs', error);
            alert('Failed to generate Excel export.');
        } finally {
            setExportLoading(false);
        }
    };

    const openDetails = (log) => {
        setSelectedLog(log);
        setIsModalOpen(true);
    };

    const closeDetails = () => {
        setSelectedLog(null);
        setIsModalOpen(false);
    };

    const filteredLogs = logs.filter(log => {
        const trainerName = log.trainerId
            ? `${log.trainerId.firstName || ''} ${log.trainerId.lastName || ''}`.toLowerCase()
            : '';
        const courseName = log.courseId?.name?.toLowerCase() || '';
        const collegeName = log.collegeId?.name?.toLowerCase() || '';
        const search = searchTerm.toLowerCase();
        return trainerName.includes(search) || courseName.includes(search) || collegeName.includes(search);
    });

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        Trainer Progress Logs
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Review, inspect, and export training progress logs recorded by your active teaching staff.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-wrap">
                    {/* College Filter Selection */}
                    {user?.role === 'super_admin' && !effectiveCollegeId ? (
                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-2.5 border border-slate-200 rounded-lg shadow-sm">
                            <School size={15} className="text-slate-400" />
                            <select 
                                value={selectedCollege} 
                                onChange={(e) => setSelectedCollege(e.target.value)}
                                className="text-xs font-semibold text-slate-650 bg-transparent outline-none cursor-pointer pr-4"
                            >
                                <option value="all">All Colleges (Overall)</option>
                                {colleges.map(c => (
                                    <option key={c._id} value={c._id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 bg-blue-50 text-[#004AAD] px-3.5 py-2.5 rounded-lg border border-blue-150 shadow-sm">
                            <School size={15} className="text-[#004AAD]" />
                            <span className="text-xs font-bold">
                                College: {selectedCollegeName || 'Managed College'}
                            </span>
                        </div>
                    )}

                    {/* Trainer Filter Dropdown */}
                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-2.5 border border-slate-200 rounded-lg shadow-sm">
                        <Users size={15} className="text-slate-400" />
                        <select 
                            value={selectedTrainer} 
                            onChange={(e) => setSelectedTrainer(e.target.value)}
                            className="text-xs font-semibold text-slate-650 bg-transparent outline-none cursor-pointer pr-4"
                        >
                            <option value="all">All Trainers (Overall)</option>
                            {trainers.map(t => {
                                const trainerName = `${t.firstName || ''} ${t.lastName || ''}`.trim() || t.username;
                                return (
                                    <option key={t._id} value={t._id}>{trainerName}</option>
                                );
                            })}
                        </select>
                    </div>

                    <button 
                        onClick={handleExport}
                        disabled={exportLoading || logs.length === 0}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#004AAD] hover:bg-[#003580] text-white font-semibold rounded-lg text-sm transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
                    >
                        {exportLoading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                        Export to Excel
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
                    <h3 className="text-sm font-semibold text-slate-700">{filteredLogs.length} training log{filteredLogs.length !== 1 ? 's' : ''}</h3>
                    <div className="relative w-72">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#004AAD]" 
                            placeholder="Search by trainer, course, or college..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="p-12 flex justify-center">
                        <Loader2 className="animate-spin text-[#004AAD]" size={32} />
                    </div>
                ) : logs.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        No training logs have been logged yet for the selected scope.
                    </div>
                ) : filteredLogs.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        No training logs match the search query.
                    </div>
                ) : (
                    <div>
                        {/* Table View (Desktop & Tablet) */}
                        <div className="hidden xl:block overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50">
                                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Log Date</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Trainer Name</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">College</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Course</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-center">Batches Logged</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-center">Avg Attendance</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm">
                                    {filteredLogs.map((log) => {
                                        const trainerName = log.trainerId
                                            ? (`${log.trainerId.firstName || ''} ${log.trainerId.lastName || ''}`.trim() || log.trainerId.phone || log.trainerId.username)
                                            : '—';
                                        
                                        const batchCount = log.batches?.length || 0;
                                        let presentTotal = 0;
                                        let actualTotal = 0;
                                        log.batches?.forEach(b => {
                                            presentTotal += b.presentCount || 0;
                                            actualTotal += b.actualCount || 0;
                                        });
                                        const avgAttendance = actualTotal > 0 ? ((presentTotal / actualTotal) * 100).toFixed(1) : '0.0';

                                        return (
                                            <tr key={log._id} className="hover:bg-slate-50/50 group">
                                                <td className="px-6 py-4 font-semibold text-slate-800">
                                                    {new Date(log.logDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </td>
                                                <td className="px-6 py-4 font-medium text-slate-700">
                                                    {trainerName}
                                                </td>
                                                <td className="px-6 py-4 text-slate-650">
                                                    {log.collegeId?.name || '—'}
                                                </td>
                                                <td className="px-6 py-4 text-slate-650">
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-slate-850">{log.courseId?.name || '—'}</span>
                                                        <span className="text-xs text-slate-400">{log.courseId?.code || '—'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center font-bold text-[#004AAD]">
                                                    {batchCount}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${parseFloat(avgAttendance) >= 85 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : parseFloat(avgAttendance) < 70 ? 'bg-rose-50 text-rose-700 border border-rose-100' : 'bg-amber-50 text-amber-700 border border-amber-100'}`}>
                                                        {avgAttendance}%
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button 
                                                        onClick={() => openDetails(log)}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition-colors"
                                                    >
                                                        <Eye size={14} />
                                                        View Details
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Card View (Mobile & Tablet) */}
                        <div className="xl:hidden divide-y divide-slate-100">
                            {filteredLogs.map((log) => {
                                const trainerName = log.trainerId
                                    ? (`${log.trainerId.firstName || ''} ${log.trainerId.lastName || ''}`.trim() || log.trainerId.phone || log.trainerId.username)
                                    : '—';
                                
                                const batchCount = log.batches?.length || 0;
                                let presentTotal = 0;
                                let actualTotal = 0;
                                log.batches?.forEach(b => {
                                    presentTotal += b.presentCount || 0;
                                    actualTotal += b.actualCount || 0;
                                });
                                const avgAttendance = actualTotal > 0 ? ((presentTotal / actualTotal) * 100).toFixed(1) : '0.0';

                                return (
                                    <div key={log._id} className="p-5 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className="text-xs font-bold text-slate-800">
                                                    {new Date(log.logDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </span>
                                                <p className="text-xs font-medium text-slate-500 mt-0.5">Trainer: {trainerName}</p>
                                            </div>
                                            <button 
                                                onClick={() => openDetails(log)}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition-colors"
                                            >
                                                <Eye size={14} />
                                                View
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                            <div>
                                                <span className="block font-bold text-slate-400 text-[10px] uppercase">College</span>
                                                <span className="font-semibold text-slate-700">{log.collegeId?.name || '—'}</span>
                                            </div>
                                            <div>
                                                <span className="block font-bold text-slate-400 text-[10px] uppercase">Course</span>
                                                <span className="font-semibold text-slate-700">{log.courseId?.name || '—'}</span>
                                                <span className="text-[10px] text-slate-400 block">({log.courseId?.code || '—'})</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center bg-slate-50/50 px-3 py-2 rounded-xl border border-slate-100 text-xs">
                                            <span className="font-bold text-[#004AAD]">{batchCount} batches logged</span>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${parseFloat(avgAttendance) >= 85 ? 'bg-emerald-50 text-emerald-700' : parseFloat(avgAttendance) < 70 ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>
                                                Avg Att: {avgAttendance}%
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Details Modal */}
            {isModalOpen && selectedLog && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div>
                                <span className="text-xs font-bold text-[#004AAD] uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-md">Log Details</span>
                                <h3 className="text-lg font-bold text-slate-900 mt-2 flex items-center gap-2">
                                    <Calendar size={18} className="text-slate-400" />
                                    {new Date(selectedLog.logDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                                </h3>
                                <p className="text-xs text-slate-500 mt-1">
                                    Logged by <span className="font-semibold text-slate-700">{selectedLog.trainerId ? `${selectedLog.trainerId.firstName || ''} ${selectedLog.trainerId.lastName || ''}`.trim() : 'System'}</span>
                                </p>
                            </div>
                            <button onClick={closeDetails} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-150 rounded-xl transition-all">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/20">
                            {/* Meta Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-3">
                                    <School className="text-slate-400 flex-shrink-0 mt-0.5" size={16} />
                                    <div>
                                        <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">College Context</span>
                                        <span className="text-xs font-bold text-slate-800">{selectedLog.collegeId?.name || '—'}</span>
                                    </div>
                                </div>
                                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-3">
                                    <BookOpen className="text-slate-400 flex-shrink-0 mt-0.5" size={16} />
                                    <div>
                                        <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Course Detail</span>
                                        <span className="text-xs font-bold text-slate-800">{selectedLog.courseId?.name || '—'}</span>
                                        <span className="text-[10px] text-slate-400 block font-mono">{selectedLog.courseId?.code || '—'}</span>
                                    </div>
                                </div>
                                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-3">
                                    <Calendar className="text-slate-400 flex-shrink-0 mt-0.5" size={16} />
                                    <div>
                                        <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Trainer Start Date</span>
                                        <span className="text-xs font-bold text-slate-800">
                                            {selectedLog.startDate ? new Date(selectedLog.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Batches Sub-Table */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                                    <Users size={16} className="text-[#004AAD]" />
                                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Daily Batch Schedule ({selectedLog.batches?.length || 0})</h4>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold text-slate-500 uppercase">
                                                <th className="p-4">Batch Details</th>
                                                <th className="p-4">Time / Slot</th>
                                                <th className="p-4">Department</th>
                                                <th className="p-4">Module Taught</th>
                                                <th className="p-4 text-center">Attendance</th>
                                                <th className="p-4">Topics Covered</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-150 text-xs text-slate-600">
                                            {selectedLog.batches?.map((b, idx) => {
                                                const bRate = b.actualCount > 0 ? ((b.presentCount / b.actualCount) * 100).toFixed(1) : '0.0';
                                                return (
                                                    <tr key={idx} className="hover:bg-slate-50/30">
                                                        <td className="p-4 font-bold text-slate-800">{b.batchName}</td>
                                                        <td className="p-4 flex items-center gap-1.5 text-slate-600">
                                                            <Clock size={12} className="text-slate-400" />
                                                            {b.timeSlot}
                                                        </td>
                                                        <td className="p-4">{b.department}</td>
                                                        <td className="p-4 font-semibold text-slate-700">{b.moduleTaught}</td>
                                                        <td className="p-4 text-center">
                                                            <div className="flex flex-col items-center">
                                                                <span className="font-bold text-slate-800">{b.presentCount} / {b.actualCount}</span>
                                                                <span className={`text-[10px] font-bold ${parseFloat(bRate) >= 85 ? 'text-emerald-600' : parseFloat(bRate) < 70 ? 'text-rose-600' : 'text-amber-600'}`}>
                                                                    {bRate}%
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 max-w-xs break-words">{b.topicsCovered || '—'}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t border-slate-150 bg-slate-50/50 flex justify-end">
                            <button 
                                onClick={closeDetails}
                                className="px-5 py-2 bg-slate-200 hover:bg-slate-350 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                            >
                                Close View
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminTrainingLogs;
