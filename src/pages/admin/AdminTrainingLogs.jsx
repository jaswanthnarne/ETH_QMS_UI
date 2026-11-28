import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useLocation, useParams } from 'react-router-dom';
import {
    Download,
    Loader2,
    School,
    Calendar,
    BookOpen,
    Users,
    Eye,
    X,
    Search,
    Layers,
    RotateCcw,
    FileSpreadsheet
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useCollegeStore from '../../store/collegeStore';
import useSocketUpdate from '../../hooks/useSocketUpdate';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AdminTrainingLogs = () => {
    const { token, user } = useAuthStore();
    const { selectedCollegeId: storeCollegeId, selectedCollegeName } = useCollegeStore();
    const { collegeId: paramCollegeId } = useParams();
    const location = useLocation();

    const isMultiCollegeAdmin = ['super_admin', 'ops_admin', 'ast_ops_admin', 'regional_manager', 'asst_rm'].includes(user?.role);

    // Derive college ID strictly from URL first (isolated college tab), then store
    const urlCollegeMatch = location.pathname.match(/\/college\/([a-f0-9]{24})/i);
    const urlCollegeId = paramCollegeId || (urlCollegeMatch ? urlCollegeMatch[1] : null);
    const effectiveCollegeId = urlCollegeId || storeCollegeId || (user?.role === 'college_admin' ? user.collegeId : null);

    const [logs, setLogs] = useState([]);
    const [colleges, setColleges] = useState([]);
    const [trainers, setTrainers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [batches, setBatches] = useState([]);

    const [selectedCollege, setSelectedCollege] = useState(effectiveCollegeId || 'all');
    const [selectedTrainer, setSelectedTrainer] = useState('all');
    const [selectedCourse, setSelectedCourse] = useState('all');
    const [selectedBatch, setSelectedBatch] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const [loading, setLoading] = useState(true);
    const [exportLoading, setExportLoading] = useState(false);

    // Details Modal State
    const [selectedLog, setSelectedLog] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Lock selectedCollege whenever inside a college context
    useEffect(() => {
        if (effectiveCollegeId) {
            setSelectedCollege(effectiveCollegeId);
        } else {
            setSelectedCollege('all');
        }
        setSelectedTrainer('all');
        setSelectedCourse('all');
        setSelectedBatch('all');
    }, [effectiveCollegeId]);

    const activeCollegeScope = effectiveCollegeId || (selectedCollege !== 'all' ? selectedCollege : '');

    // Fetch colleges list
    useEffect(() => {
        if (!token) return;
        axios
            .get(`${API}/admin/colleges`, { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => {
                if (res.data.success) setColleges(res.data.data || []);
            })
            .catch(() => {});
    }, [token]);

    // Fetch trainers, courses, and batches strictly scoped to activeCollegeScope
    useEffect(() => {
        if (!token) return;
        const headers = { Authorization: `Bearer ${token}` };

        const fetchFilterMetadata = async () => {
            try {
                const trainerUrl = activeCollegeScope
                    ? `${API}/admin/trainers?collegeId=${activeCollegeScope}`
                    : `${API}/admin/trainers`;
                const courseUrl = activeCollegeScope
                    ? `${API}/admin/colleges/${activeCollegeScope}/courses`
                    : `${API}/admin/courses`;
                const batchUrl = activeCollegeScope
                    ? `${API}/admin/colleges/${activeCollegeScope}/batches`
                    : `${API}/admin/colleges/all/batches`;

                const [tRes, cRes, bRes] = await Promise.all([
                    axios.get(trainerUrl, { headers }),
                    axios.get(courseUrl, { headers }),
                    axios.get(batchUrl, { headers })
                ]);

                if (tRes.data.success) setTrainers(tRes.data.data || []);
                if (cRes.data.success) setCourses(cRes.data.data || []);
                if (bRes.data.success) setBatches(bRes.data.data || []);
            } catch (e) {
                console.error('Failed to fetch training log filters:', e);
            }
        };

        setSelectedTrainer('all');
        setSelectedCourse('all');
        setSelectedBatch('all');
        fetchFilterMetadata();
    }, [token, activeCollegeScope]);

    const fetchLogs = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const params = {};
            if (activeCollegeScope) {
                params.collegeId = activeCollegeScope;
            }
            if (selectedTrainer !== 'all') {
                params.trainerId = selectedTrainer;
            }
            if (selectedCourse !== 'all') {
                params.courseId = selectedCourse;
            }
            if (selectedBatch !== 'all') {
                params.batchId = selectedBatch;
            }

            const res = await axios.get(`${API}/admin/training-logs`, {
                headers: { Authorization: `Bearer ${token}` },
                params
            });

            if (res.data.success) {
                const fetched = res.data.data || [];
                const strictlyScoped = activeCollegeScope
                    ? fetched.filter((l) => l.collegeId?.toString() === activeCollegeScope.toString())
                    : fetched;
                setLogs(strictlyScoped);
            }
        } catch (error) {
            console.error('Failed to fetch training logs', error);
        } finally {
            setLoading(false);
        }
    }, [token, activeCollegeScope, selectedTrainer, selectedCourse, selectedBatch]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    useSocketUpdate(() => {
        fetchLogs();
    }, ['attendance']);

    const handleExport = async () => {
        setExportLoading(true);
        try {
            const collegeQuery = activeCollegeScope ? `&collegeId=${activeCollegeScope}` : '';
            const trainerQuery = selectedTrainer !== 'all' ? `&trainerId=${selectedTrainer}` : '';
            const courseQuery = selectedCourse !== 'all' ? `&courseId=${selectedCourse}` : '';

            const res = await axios.get(
                `${API}/analytics/export?type=training_logs${collegeQuery}${trainerQuery}${courseQuery}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    responseType: 'blob'
                }
            );

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;

            let collegeName = 'Overall_Platform';
            if (activeCollegeScope) {
                const matched = colleges.find((c) => c._id === activeCollegeScope);
                collegeName = matched?.name || selectedCollegeName || 'College';
            }

            const filename = `${collegeName.replace(/\s+/g, '_')}_Training_Logs_Report.xlsx`;
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

    const filteredLogs = logs.filter((log) => {
        if (activeCollegeScope && log.collegeId?.toString() !== activeCollegeScope.toString()) {
            return false;
        }
        if (selectedBatch !== 'all' && log.batchId?.toString() !== selectedBatch.toString()) {
            return false;
        }
        const trainerName = (log.trainerName || '').toLowerCase();
        const courseName = (log.courseName || '').toLowerCase();
        const collegeName = (log.collegeName || '').toLowerCase();
        const topics = (log.topicsCovered || '').toLowerCase();
        const batch = (log.batchName || '').toLowerCase();
        const search = searchTerm.toLowerCase();
        return (
            trainerName.includes(search) ||
            courseName.includes(search) ||
            collegeName.includes(search) ||
            topics.includes(search) ||
            batch.includes(search)
        );
    });

    const activeCollegeDisplay =
        selectedCollegeName ||
        colleges.find((c) => c._id === activeCollegeScope)?.name ||
        'Managed College';

    const visibleBatches = batches.filter((b) => {
        if (selectedCourse !== 'all') {
            const bCid = b.courseId?._id || b.courseId;
            return bCid?.toString() === selectedCourse.toString();
        }
        return true;
    });

    const hasActiveFilters =
        (!effectiveCollegeId && selectedCollege !== 'all') ||
        selectedCourse !== 'all' ||
        selectedBatch !== 'all' ||
        selectedTrainer !== 'all' ||
        searchTerm.trim() !== '';

    return (
        <div className="space-y-6 pb-10">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-5 border-b border-slate-200/80">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
                        <FileSpreadsheet className="text-[#5899B5] shrink-0" size={26} />
                        <span>{effectiveCollegeId ? `Training Logs — ${activeCollegeDisplay}` : 'Trainer Progress Logs'}</span>
                    </h1>
                    <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
                        {effectiveCollegeId
                            ? `Showing session logs recorded exclusively for ${activeCollegeDisplay}.`
                            : 'Review, inspect, and export training progress logs recorded across institutions.'}
                    </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    <button
                        onClick={handleExport}
                        disabled={exportLoading || filteredLogs.length === 0}
                        className="h-10 px-4 bg-[#5899B5] hover:bg-[#3D7690] text-white font-semibold rounded-xl text-xs inline-flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-2xs"
                    >
                        {exportLoading ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
                        Export Training Logs (.xlsx)
                    </button>
                </div>
            </div>

            {/* Dedicated Filter Panel Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                    {/* 1. Institution Filter */}
                    <div>
                        <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                            <School size={13} className="text-[#5899B5]" />
                            Institution Scope
                        </label>
                        {isMultiCollegeAdmin && !effectiveCollegeId ? (
                            <select
                                value={selectedCollege}
                                onChange={(e) => setSelectedCollege(e.target.value)}
                                className="w-full h-10 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-[#5899B5] focus:ring-2 focus:ring-[#5899B5]/15 transition-all cursor-pointer"
                            >
                                <option value="all">All Colleges ({colleges.length})</option>
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

                    {/* 2. Course Filter */}
                    <div>
                        <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                            <BookOpen size={13} className="text-[#5899B5]" />
                            Course
                        </label>
                        <select
                            value={selectedCourse}
                            onChange={(e) => {
                                setSelectedCourse(e.target.value);
                                setSelectedBatch('all');
                            }}
                            className="w-full h-10 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-[#5899B5] focus:ring-2 focus:ring-[#5899B5]/15 transition-all cursor-pointer"
                        >
                            <option value="all">All Courses ({courses.length})</option>
                            {courses.map((c) => (
                                <option key={c._id} value={c._id}>
                                    {c.name} ({c.code})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 3. Batch Filter */}
                    <div>
                        <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                            <Layers size={13} className="text-[#5899B5]" />
                            Batch
                        </label>
                        <select
                            value={selectedBatch}
                            onChange={(e) => setSelectedBatch(e.target.value)}
                            className="w-full h-10 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-[#5899B5] focus:ring-2 focus:ring-[#5899B5]/15 transition-all cursor-pointer"
                        >
                            <option value="all">All Batches ({visibleBatches.length})</option>
                            {visibleBatches.map((b) => (
                                <option key={b._id} value={b._id}>
                                    {b.batchName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 4. Trainer Filter */}
                    <div>
                        <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                            <Users size={13} className="text-[#5899B5]" />
                            Trainer
                        </label>
                        <select
                            value={selectedTrainer}
                            onChange={(e) => setSelectedTrainer(e.target.value)}
                            className="w-full h-10 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-[#5899B5] focus:ring-2 focus:ring-[#5899B5]/15 transition-all cursor-pointer"
                        >
                            <option value="all">All Trainers ({trainers.length})</option>
                            {trainers.map((t) => {
                                const trainerName =
                                    `${t.firstName || ''} ${t.lastName || ''}`.trim() || t.username;
                                return (
                                    <option key={t._id} value={t._id}>
                                        {trainerName}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                </div>

                {/* Search & Reset Toolbar Row */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                            className="w-full h-10 pl-10 pr-9 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-[#5899B5] focus:ring-2 focus:ring-[#5899B5]/15 transition-all"
                            placeholder="Search by trainer, course, topic, or batch..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button
                                type="button"
                                onClick={() => setSearchTerm('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3">
                        <span className="text-xs font-semibold text-slate-500">
                            Showing <strong className="text-slate-800">{filteredLogs.length}</strong> session log{filteredLogs.length !== 1 ? 's' : ''}
                        </span>
                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={() => {
                                    if (!effectiveCollegeId) setSelectedCollege('all');
                                    setSelectedCourse('all');
                                    setSelectedBatch('all');
                                    setSelectedTrainer('all');
                                    setSearchTerm('');
                                }}
                                className="h-9 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                                <RotateCcw size={13} />
                                Reset Filters
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                {loading ? (
                    <div className="py-16 flex flex-col items-center justify-center gap-3">
                        <Loader2 className="animate-spin text-[#5899B5]" size={28} />
                        <p className="text-xs font-medium text-slate-400">Loading training logs...</p>
                    </div>
                ) : filteredLogs.length === 0 ? (
                    <div className="py-16 px-6 text-center">
                        <FileSpreadsheet size={36} className="mx-auto text-slate-200 mb-3" />
                        <p className="text-sm font-semibold text-slate-700">
                            No training logs found for {activeCollegeScope ? activeCollegeDisplay : 'the selected filters'}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                            Try adjusting the course, batch, or trainer filters above.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/80 border-b border-slate-200/80">
                                    <th className="px-6 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Session Date</th>
                                    <th className="px-6 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Trainer</th>
                                    <th className="px-6 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Batch &amp; Module</th>
                                    <th className="px-6 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Course</th>
                                    <th className="px-6 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Topic Covered</th>
                                    <th className="px-6 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">Attendance</th>
                                    <th className="px-6 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {filteredLogs.map((log) => (
                                    <tr key={log._id} className="hover:bg-slate-50/70 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <p className="font-semibold text-slate-800">
                                                {new Date(log.sessionDate).toLocaleDateString('en-IN', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                            <p className="text-[11px] text-slate-400 mt-1">
                                                Logged {new Date(log.logDate).toLocaleDateString('en-IN')}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-slate-700 whitespace-nowrap">
                                            {log.trainerName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <p className="font-semibold text-slate-900">{log.batchName}</p>
                                            <p className="text-xs text-slate-400 mt-1">
                                                {log.moduleTaught} • {log.timeSlot}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-slate-800">{log.courseName}</p>
                                            <p className="text-xs text-slate-400 mt-1">
                                                {log.courseCode} • {log.collegeName}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 text-slate-700 max-w-xs truncate" title={log.topicsCovered}>
                                            {log.topicsCovered}
                                        </td>
                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                            <div className="inline-flex items-center gap-2">
                                                <span className="font-semibold text-slate-800">
                                                    {log.presentCount}/{log.actualCount}
                                                </span>
                                                <span
                                                    className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${
                                                        parseFloat(log.avgAttendance) >= 75
                                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                                                            : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                                                    }`}
                                                >
                                                    {log.avgAttendance}%
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            <button
                                                onClick={() => {
                                                    setSelectedLog(log);
                                                    setIsModalOpen(true);
                                                }}
                                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs transition cursor-pointer"
                                            >
                                                <Eye size={13} />
                                                Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Details Modal */}
            {isModalOpen && selectedLog && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden flex flex-col shadow-xl border border-slate-200">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <div>
                                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                    Session Log Details
                                </span>
                                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mt-0.5">
                                    <Calendar size={16} className="text-[#5899B5]" />
                                    {new Date(selectedLog.sessionDate).toLocaleDateString('en-IN', {
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </h3>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                    <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider mb-1">College</span>
                                    <span className="text-xs font-bold text-slate-800">{selectedLog.collegeName}</span>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                    <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider mb-1">Course</span>
                                    <span className="text-xs font-bold text-slate-800">
                                        {selectedLog.courseName} ({selectedLog.courseCode})
                                    </span>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                    <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider mb-1">Batch &amp; Trainer</span>
                                    <span className="text-xs font-bold text-slate-800">
                                        {selectedLog.batchName} • {selectedLog.trainerName}
                                    </span>
                                </div>
                            </div>

                            <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-4">
                                <div>
                                    <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider mb-1">Topic Covered</span>
                                    <p className="text-sm font-bold text-slate-900">{selectedLog.topicsCovered}</p>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-slate-200/70">
                                    <div>
                                        <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider mb-1">Module</span>
                                        <span className="text-xs font-semibold text-slate-800">{selectedLog.moduleTaught}</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider mb-1">Period / Slot</span>
                                        <span className="text-xs font-semibold text-slate-800">{selectedLog.timeSlot}</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider mb-1">Duration</span>
                                        <span className="text-xs font-semibold text-slate-800">{selectedLog.duration} mins</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider mb-1">Attendance</span>
                                        <span className="text-xs font-bold text-slate-900">
                                            {selectedLog.presentCount}/{selectedLog.actualCount} ({selectedLog.avgAttendance}%)
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminTrainingLogs;
