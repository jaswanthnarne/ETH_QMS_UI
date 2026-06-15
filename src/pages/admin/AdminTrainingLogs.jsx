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

    const isMultiCollegeAdmin = ['super_admin', 'ops_admin', 'ast_ops_admin', 'regional_manager', 'asst_rm'].includes(user?.role);

    // Derive college ID from URL as fallback when store hasn't hydrated yet
    const urlCollegeMatch = location.pathname.match(/\/college\/([a-f0-9]+)/);
    const effectiveCollegeId = selectedCollegeId || (urlCollegeMatch ? urlCollegeMatch[1] : null);
    
    const [logs, setLogs] = useState([]);
    const [colleges, setColleges] = useState([]);
    const [trainers, setTrainers] = useState([]);
    const [courses, setCourses] = useState([]);
    
    const [selectedCollege, setSelectedCollege] = useState(effectiveCollegeId || 'all');
    const [selectedTrainer, setSelectedTrainer] = useState('all');
    const [selectedCourse, setSelectedCourse] = useState('all');
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

    // Fetch colleges on mount (only for multi-college admin roles)
    useEffect(() => {
        if (isMultiCollegeAdmin) {
            fetchColleges();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMultiCollegeAdmin]);

    // Fetch trainers & courses when college scope changes, and reset trainer/course selection
    useEffect(() => {
        setSelectedTrainer('all');
        setSelectedCourse('all');
        fetchTrainers();
        fetchCourses();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCollege, effectiveCollegeId]);

    // Fetch logs when college, trainer, or course selection changes
    useEffect(() => {
        fetchLogs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCollege, selectedTrainer, selectedCourse, effectiveCollegeId]);

    useSocketUpdate(() => {
        fetchLogs();
    }, ['attendance']);

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
            const collegeContextId = effectiveCollegeId || (isMultiCollegeAdmin 
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

    const fetchCourses = async () => {
        try {
            const collegeContextId = effectiveCollegeId || (isMultiCollegeAdmin 
                ? (selectedCollege !== 'all' ? selectedCollege : '')
                : user?.collegeId);
            
            let url = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/courses`;
            if (collegeContextId) {
                url = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/colleges/${collegeContextId}/courses`;
            }

            const res = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setCourses(res.data.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch courses', error);
        }
    };

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const params = {};
            const collegeContextId = effectiveCollegeId || (isMultiCollegeAdmin 
                ? (selectedCollege !== 'all' ? selectedCollege : '')
                : user?.collegeId);

            if (collegeContextId) {
                params.collegeId = collegeContextId;
            }

            if (selectedTrainer !== 'all') {
                params.trainerId = selectedTrainer;
            }

            if (selectedCourse !== 'all') {
                params.courseId = selectedCourse;
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
            if (isMultiCollegeAdmin) {
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
            const courseQuery = selectedCourse !== 'all' ? `&courseId=${selectedCourse}` : '';
            
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/analytics/export?type=training_logs${collegeQuery}${trainerQuery}${courseQuery}`,
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
                if (isMultiCollegeAdmin) {
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
        const trainerName = (log.trainerName || '').toLowerCase();
        const courseName = (log.courseName || '').toLowerCase();
        const collegeName = (log.collegeName || '').toLowerCase();
        const topics = (log.topicsCovered || '').toLowerCase();
        const batch = (log.batchName || '').toLowerCase();
        const search = searchTerm.toLowerCase();
        return trainerName.includes(search) || courseName.includes(search) || collegeName.includes(search) || topics.includes(search) || batch.includes(search);
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
                    {isMultiCollegeAdmin && !effectiveCollegeId ? (
                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-2.5 border border-slate-200 rounded-lg shadow-sm">
                            <School size={15} className="text-slate-400" />
                            <select 
                                value={selectedCollege} 
                                onChange={(e) => setSelectedCollege(e.target.value)}
                                className="text-xs font-semibold text-slate-600 bg-transparent outline-none cursor-pointer pr-4"
                            >
                                <option value="all">All Colleges (Overall)</option>
                                {colleges.map(c => (
                                    <option key={c._id} value={c._id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 bg-blue-50 text-[#004AAD] px-3.5 py-2.5 rounded-lg border border-blue-200 shadow-sm">
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
                            className="text-xs font-semibold text-slate-600 bg-transparent outline-none cursor-pointer pr-4"
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

                    {/* Course Filter Dropdown */}
                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-2.5 border border-slate-200 rounded-lg shadow-sm">
                        <BookOpen size={15} className="text-slate-400" />
                        <select 
                            value={selectedCourse} 
                            onChange={(e) => setSelectedCourse(e.target.value)}
                            className="text-xs font-semibold text-slate-600 bg-transparent outline-none cursor-pointer pr-4"
                        >
                            <option value="all">All Courses (Overall)</option>
                            {courses.map(c => (
                                <option key={c._id} value={c._id}>{c.name}</option>
                            ))}
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
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
                    <h3 className="text-sm font-semibold text-slate-700">{filteredLogs.length} session log{filteredLogs.length !== 1 ? 's' : ''}</h3>
                    <div className="relative w-72">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#004AAD]" 
                            placeholder="Search by trainer, course, topic, batch..." 
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
                        <div className="hidden xl:block overflow-x-auto custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50">
                                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Session Date</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Log Date</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Trainer Name</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Course</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Topic Covered</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Batch & Module</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-center">Attendance</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm">
                                    {filteredLogs.map((log) => {
                                        return (
                                            <tr key={log._id} className="hover:bg-slate-50/50 group">
                                                <td className="px-6 py-4 font-semibold text-slate-800">
                                                    {new Date(log.sessionDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </td>
                                                <td className="px-6 py-4 text-xs font-medium text-slate-500">
                                                    {new Date(log.logDate).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                                                </td>
                                                <td className="px-6 py-4 font-medium text-slate-700">
                                                    {log.trainerName}
                                                </td>
                                                <td className="px-6 py-4 text-slate-650">
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-slate-850">{log.courseName}</span>
                                                        <span className="text-[10px] text-slate-400">{log.courseCode} • {log.collegeName}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-medium text-slate-700 max-w-xs truncate" title={log.topicsCovered}>
                                                    {log.topicsCovered}
                                                </td>
                                                <td className="px-6 py-4 text-slate-650">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-slate-850">{log.batchName}</span>
                                                        <span className="text-[10px] text-slate-400">{log.moduleTaught} • {log.timeSlot}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <span className="font-semibold text-slate-800">{log.presentCount} / {log.actualCount}</span>
                                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold mt-1 ${parseFloat(log.avgAttendance) >= 85 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : parseFloat(log.avgAttendance) < 70 ? 'bg-rose-50 text-rose-700 border border-rose-100' : 'bg-amber-50 text-amber-700 border border-amber-100'}`}>
                                                            {log.avgAttendance}%
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button 
                                                        onClick={() => openDetails(log)}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition-colors animate-all"
                                                    >
                                                        <Eye size={14} />
                                                        Details
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
                                return (
                                    <div key={log._id} className="p-5 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className="text-xs font-bold text-slate-800">
                                                    {new Date(log.sessionDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </span>
                                                <p className="text-xs font-medium text-slate-500 mt-0.5">Trainer: {log.trainerName}</p>
                                            </div>
                                            <button 
                                                onClick={() => openDetails(log)}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition-colors"
                                            >
                                                <Eye size={14} />
                                                View Details
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                            <div>
                                                <span className="block font-bold text-slate-400 text-[10px] uppercase">College</span>
                                                <span className="font-semibold text-slate-700">{log.collegeName}</span>
                                            </div>
                                            <div>
                                                <span className="block font-bold text-slate-400 text-[10px] uppercase">Course</span>
                                                <span className="font-semibold text-slate-700">{log.courseName}</span>
                                                <span className="text-[10px] text-slate-400 block">({log.courseCode})</span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                                            <div>
                                                <span className="block font-bold text-slate-400 text-[10px] uppercase">Batch / Module</span>
                                                <span className="font-semibold text-slate-700">{log.batchName} ({log.moduleTaught})</span>
                                            </div>
                                            <div>
                                                <span className="block font-bold text-slate-400 text-[10px] uppercase">Topic Covered</span>
                                                <span className="font-semibold text-slate-700 truncate block max-w-[120px]" title={log.topicsCovered}>{log.topicsCovered}</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center bg-slate-50/50 px-3 py-2 rounded-xl border border-slate-100 text-xs">
                                            <span className="font-bold text-[#004AAD]">{log.presentCount} / {log.actualCount} present</span>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${parseFloat(log.avgAttendance) >= 85 ? 'bg-emerald-50 text-emerald-700' : parseFloat(log.avgAttendance) < 70 ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>
                                                Att: {log.avgAttendance}%
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
                                <span className="text-xs font-bold text-[#004AAD] uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-md">Session Log Details</span>
                                <h3 className="text-lg font-bold text-slate-900 mt-2 flex items-center gap-2">
                                    <Calendar size={18} className="text-slate-400" />
                                    Session Date: {new Date(selectedLog.sessionDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                                </h3>
                                <p className="text-xs text-slate-500 mt-1">
                                    Logged by <span className="font-semibold text-slate-700">{selectedLog.trainerName}</span> on {new Date(selectedLog.logDate).toLocaleString('en-IN')}
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
                                        <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Institution</span>
                                        <span className="text-xs font-bold text-slate-800">{selectedLog.collegeName}</span>
                                    </div>
                                </div>
                                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-3">
                                    <BookOpen className="text-slate-400 flex-shrink-0 mt-0.5" size={16} />
                                    <div>
                                        <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Course Detail</span>
                                        <span className="text-xs font-bold text-slate-800">{selectedLog.courseName}</span>
                                        <span className="text-[10px] text-slate-400 block font-mono">({selectedLog.courseCode})</span>
                                    </div>
                                </div>
                                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-3">
                                    <Users className="text-slate-400 flex-shrink-0 mt-0.5" size={16} />
                                    <div>
                                        <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Batch & Department</span>
                                        <span className="text-xs font-bold text-slate-800">{selectedLog.batchName}</span>
                                        <span className="text-[10px] text-slate-400 block font-mono">{selectedLog.department}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Session Info Block */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                                <div className="border-b border-slate-100 pb-3">
                                    <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Topic Covered</span>
                                    <h4 className="text-base font-extrabold text-slate-900 mt-1">{selectedLog.topicsCovered}</h4>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Module</span>
                                        <span className="text-xs font-bold text-slate-800">{selectedLog.moduleTaught}</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Period / Slot</span>
                                        <span className="text-xs font-bold text-slate-800">{selectedLog.timeSlot}</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Duration</span>
                                        <span className="text-xs font-bold text-slate-800">{selectedLog.duration} mins</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Attendance Rate</span>
                                        <span className={`text-xs font-bold ${parseFloat(selectedLog.avgAttendance) >= 85 ? 'text-emerald-600' : parseFloat(selectedLog.avgAttendance) < 70 ? 'text-rose-600' : 'text-amber-600'}`}>
                                            {selectedLog.presentCount} / {selectedLog.actualCount} ({selectedLog.avgAttendance}%)
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t border-slate-150 bg-slate-50/50 flex justify-end">
                            <button 
                                onClick={closeDetails}
                                className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminTrainingLogs;
