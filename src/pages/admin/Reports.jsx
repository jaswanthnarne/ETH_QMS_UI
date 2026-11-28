import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
    Download,
    FileText,
    Loader2,
    Database,
    CheckCircle2,
    School,
    Search,
    User,
    BookOpen,
    Copy,
    CalendarCheck,
    Layers,
    ChevronDown,
    ChevronUp,
    FileSpreadsheet,
    RotateCcw,
    X
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useCollegeStore from '../../store/collegeStore';
import useSocketUpdate from '../../hooks/useSocketUpdate';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Reports = () => {
    const { token, user } = useAuthStore();
    const {
        selectedCollegeId: storeCollegeId,
        selectedCollegeName,
        setSelectedCollege: setGlobalCollege,
        clearSelectedCollege: clearGlobalCollege
    } = useCollegeStore();
    const { collegeId: paramCollegeId } = useParams();
    const location = useLocation();

    const urlCollegeMatch = location.pathname.match(/\/college\/([a-f0-9]{24})/i);
    const urlCollegeId = paramCollegeId || (urlCollegeMatch ? urlCollegeMatch[1] : null);
    const lockedCollegeId = urlCollegeId || (user?.role === 'college_admin' ? user.collegeId : null);

    // Report Mode: 'attendance' (Batch & Day-Wise Attendance Reports) | 'exams' (Exam Allotments & Results)
    const [reportMode, setReportMode] = useState('attendance');

    const [colleges, setColleges] = useState([]);
    const [trainers, setTrainers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [allotments, setAllotments] = useState([]);

    // Attendance Report Data
    const [attendanceBatches, setAttendanceBatches] = useState([]);
    const [selectedBatchIds, setSelectedBatchIds] = useState([]);
    const [expandedBatchId, setExpandedBatchId] = useState(null);
    const [attendanceLoading, setAttendanceLoading] = useState(true);

    // Filter selections
    const [selectedCollege, setSelectedCollege] = useState(
        lockedCollegeId || storeCollegeId || (user?.role === 'trainer' ? user.collegeId || 'all' : 'all')
    );
    const [selectedTrainer, setSelectedTrainer] = useState(
        user?.role === 'trainer' ? user._id || user.id : 'all'
    );
    const [selectedBatch, setSelectedBatch] = useState('all');
    const [selectedCourse, setSelectedCourse] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [copiedKey, setCopiedKey] = useState(null);

    const requestCounterRef = useRef(0);

    const isGlobalAdmin = [
        'super_admin',
        'ops_admin',
        'ast_ops_admin',
        'regional_manager',
        'asst_rm',
        'placement'
    ].includes(user?.role);

    // Sync lockedCollegeId or storeCollegeId
    useEffect(() => {
        if (lockedCollegeId) {
            setSelectedCollege(lockedCollegeId);
        } else if (storeCollegeId) {
            setSelectedCollege(storeCollegeId);
        } else if (isGlobalAdmin) {
            setSelectedCollege('all');
        }
        setSelectedTrainer(user?.role === 'trainer' ? user._id || user.id : 'all');
        setSelectedBatch('all');
        setSelectedCourse('all');
        setSelectedBatchIds([]);
    }, [lockedCollegeId, storeCollegeId, isGlobalAdmin, user]);

    const activeCollegeScope =
        lockedCollegeId || (selectedCollege && selectedCollege !== 'all' ? selectedCollege : '');

    // Load colleges
    useEffect(() => {
        if (!token) return;
        if (isGlobalAdmin || user?.role === 'trainer') {
            axios
                .get(`${API}/admin/colleges`, { headers: { Authorization: `Bearer ${token}` } })
                .then((res) => {
                    const list = res.data.data || [];
                    setColleges(list);
                    if (
                        ['regional_manager', 'asst_rm'].includes(user?.role) &&
                        list.length > 0 &&
                        !lockedCollegeId &&
                        !storeCollegeId
                    ) {
                        setSelectedCollege(list[0]._id);
                    }
                })
                .catch(() => {});
        }
    }, [token, user, isGlobalAdmin, lockedCollegeId, storeCollegeId]);

    // Load courses and trainers for active scope
    useEffect(() => {
        if (!token) return;
        const headers = { Authorization: `Bearer ${token}` };

        const loadFilters = async () => {
            try {
                const courseUrl = activeCollegeScope
                    ? `${API}/admin/colleges/${activeCollegeScope}/courses`
                    : `${API}/admin/courses`;
                const trainerUrl = activeCollegeScope
                    ? `${API}/admin/trainers?collegeId=${activeCollegeScope}`
                    : `${API}/admin/trainers`;

                const reqs = [axios.get(courseUrl, { headers })];
                if (user?.role !== 'trainer') {
                    reqs.push(axios.get(trainerUrl, { headers }));
                }
                const [cRes, tRes] = await Promise.all(reqs);
                setCourses(cRes?.data?.data || []);
                if (tRes?.data?.data) setTrainers(tRes.data.data);
            } catch (e) {
                console.error('Failed to fetch report filter options:', e);
            }
        };
        loadFilters();
    }, [token, activeCollegeScope, user?.role]);

    // Fetch Batch & Day-Wise Attendance Summaries
    const fetchAttendanceSummaries = useCallback(async () => {
        if (!token) return;
        setAttendanceLoading(true);
        try {
            const params = new URLSearchParams();
            if (activeCollegeScope) params.set('collegeId', activeCollegeScope);
            if (selectedCourse !== 'all') params.set('courseId', selectedCourse);
            if (selectedTrainer !== 'all' && user?.role !== 'trainer') {
                params.set('trainerId', selectedTrainer);
            }

            const res = await axios.get(`${API}/analytics/attendance-summary?${params.toString()}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setAttendanceBatches(res.data.data || []);
            }
        } catch (err) {
            console.error('Failed to load batch attendance summaries:', err);
        } finally {
            setAttendanceLoading(false);
        }
    }, [token, activeCollegeScope, selectedCourse, selectedTrainer, user?.role]);

    useEffect(() => {
        fetchAttendanceSummaries();
    }, [fetchAttendanceSummaries]);

    // Fetch Exam Allotments
    const fetchExamAllotments = useCallback(async () => {
        if (!token) return;
        const currentReqId = ++requestCounterRef.current;
        setLoading(true);
        try {
            const headers = { Authorization: `Bearer ${token}` };
            const url = activeCollegeScope
                ? `${API}/admin/allotments?collegeId=${activeCollegeScope}`
                : `${API}/admin/allotments`;
            const res = await axios.get(url, { headers });
            if (currentReqId === requestCounterRef.current) {
                setAllotments(res.data?.data || []);
            }
        } catch (e) {
            console.error('Failed to load exam allotments:', e);
        } finally {
            if (currentReqId === requestCounterRef.current) {
                setLoading(false);
            }
        }
    }, [token, activeCollegeScope]);

    useEffect(() => {
        fetchExamAllotments();
    }, [fetchExamAllotments]);

    useSocketUpdate(() => {
        fetchAttendanceSummaries();
        fetchExamAllotments();
    }, ['exams', 'colleges', 'courses', 'trainers', 'attendance']);

    // Export Selected or All Batches Day-Wise Attendance Report (Excel)
    const handleExportBatchAttendance = async (customBatchIds = null) => {
        setActionLoading('batch_attendance');
        try {
            const params = new URLSearchParams({ type: 'batch_attendance' });
            if (activeCollegeScope) params.set('collegeId', activeCollegeScope);
            if (selectedCourse !== 'all') params.set('courseId', selectedCourse);
            if (selectedTrainer !== 'all' && user?.role !== 'trainer') {
                params.set('trainerId', selectedTrainer);
            }

            const targetIds =
                customBatchIds || (selectedBatchIds.length > 0 ? selectedBatchIds.join(',') : '');
            if (targetIds) {
                params.set('batchIds', targetIds);
            } else if (selectedBatch !== 'all') {
                params.set('batchIds', selectedBatch);
            }

            const res = await axios.get(`${API}/analytics/export?${params.toString()}`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            const dateTag = new Date().toISOString().slice(0, 10);
            link.setAttribute('download', `Batch_Daywise_Attendance_Report_${dateTag}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (err) {
            console.error('Attendance export failed:', err);
            alert('Failed to generate Batch Day-Wise Attendance Excel report.');
        } finally {
            setActionLoading(false);
        }
    };

    // Export Training Logs Report
    const handleExportTrainingLogs = async () => {
        setActionLoading('training_logs');
        try {
            const params = new URLSearchParams({ type: 'training_logs' });
            if (activeCollegeScope) params.set('collegeId', activeCollegeScope);
            if (selectedCourse !== 'all') params.set('courseId', selectedCourse);
            if (selectedTrainer !== 'all') params.set('trainerId', selectedTrainer);

            const res = await axios.get(`${API}/analytics/export?${params.toString()}`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Training_Logs_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch {
            alert('Failed to export training logs.');
        } finally {
            setActionLoading(false);
        }
    };

    // Export Specific Allotment / Exam Report
    const handleExportExamReport = async (examId, examTitle, trainerId, batchId) => {
        setActionLoading(examId);
        try {
            const trainerQuery = trainerId ? `&trainerId=${trainerId}` : '';
            const batchQuery = batchId ? `&batchId=${batchId}` : '&batchId=General';

            const res = await axios.get(
                `${API}/analytics/export?type=exam&id=${examId}${trainerQuery}${batchQuery}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    responseType: 'blob'
                }
            );

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${(examTitle || 'Exam').replace(/\s+/g, '_')}_Report.xlsx`);
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

    const toggleBatchSelection = (batchId) => {
        setSelectedBatchIds((prev) =>
            prev.includes(batchId) ? prev.filter((id) => id !== batchId) : [...prev, batchId]
        );
    };

    const filteredAttendanceBatches = attendanceBatches.filter((b) => {
        if (selectedBatch !== 'all' && b._id !== selectedBatch) return false;
        if (searchTerm.trim()) {
            const q = searchTerm.toLowerCase();
            return (
                b.batchName?.toLowerCase().includes(q) ||
                b.courseName?.toLowerCase().includes(q) ||
                b.courseCode?.toLowerCase().includes(q) ||
                b.department?.toLowerCase().includes(q) ||
                b.trainerName?.toLowerCase().includes(q)
            );
        }
        return true;
    });

    const filteredAllotments = allotments.filter((a) => {
        const matchesSearch =
            a.examId?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.examId?.courseId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.examId?.courseId?.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (a.trainerId &&
                `${a.trainerId.firstName} ${a.trainerId.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesTrainer = selectedTrainer === 'all' || a.trainerId?._id === selectedTrainer;
        const matchesBatch =
            selectedBatch === 'all' ||
            (selectedBatch === 'General' && !a.batchId) ||
            a.batchId?._id === selectedBatch;
        const matchesCourse =
            selectedCourse === 'all' ||
            a.examId?.courseId?._id === selectedCourse ||
            a.examId?.courseId === selectedCourse;
        return matchesSearch && matchesTrainer && matchesBatch && matchesCourse;
    });

    const showCollegeSelector = (isGlobalAdmin && !lockedCollegeId) || user?.role === 'trainer';
    const activeCollegeDisplay =
        selectedCollegeName ||
        colleges.find((c) => c._id === activeCollegeScope)?.name ||
        'Your College';

    const hasActiveFilters =
        (!lockedCollegeId && selectedCollege !== 'all') ||
        selectedCourse !== 'all' ||
        selectedBatch !== 'all' ||
        (user?.role !== 'trainer' && selectedTrainer !== 'all') ||
        searchTerm.trim() !== '';

    return (
        <div className="space-y-6 pb-12">
            {/* Page Header & Primary Report Mode Switcher */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-5 border-b border-slate-200/80">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
                        <Database className="text-[#5899B5] shrink-0" size={26} />
                        <span>{lockedCollegeId ? `Reports & Exports — ${activeCollegeDisplay}` : 'Reports & Exports'}</span>
                    </h1>
                    <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
                        Generate day-wise batch attendance summaries, multi-batch attendance registers, training logs, and exam result sheets
                    </p>
                </div>

                {/* Mode Switcher Tabs */}
                <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
                    <button
                        type="button"
                        onClick={() => setReportMode('attendance')}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                            reportMode === 'attendance'
                                ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/80'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        <CalendarCheck size={14} className="text-[#5899B5]" />
                        Batch &amp; Day-Wise Attendance
                    </button>
                    <button
                        type="button"
                        onClick={() => setReportMode('exams')}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                            reportMode === 'exams'
                                ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/80'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        <FileText size={14} className="text-[#5899B5]" />
                        Exam Results &amp; Allotments
                    </button>
                </div>
            </div>

            {/* Unified Filter Panel Card */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
                <div className={`grid grid-cols-1 sm:grid-cols-2 ${user?.role === 'trainer' ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-4 sm:gap-5`}>
                    {/* 1. Institution Filter */}
                    <div>
                        <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                            <School size={13} className="text-[#5899B5]" />
                            Institution Scope
                        </label>
                        {showCollegeSelector ? (
                            <select
                                className="w-full h-10 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-[#5899B5] focus:ring-2 focus:ring-[#5899B5]/15 transition-all cursor-pointer"
                                value={selectedCollege}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setSelectedCollege(val);
                                    if (val === 'all') {
                                        clearGlobalCollege();
                                    } else {
                                        const coll = colleges.find((c) => c._id === val);
                                        if (coll) setGlobalCollege(coll._id, coll.name, coll.code);
                                    }
                                }}
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
                            className="w-full h-10 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-[#5899B5] focus:ring-2 focus:ring-[#5899B5]/15 transition-all cursor-pointer"
                            value={selectedCourse}
                            onChange={(e) => {
                                setSelectedCourse(e.target.value);
                                setSelectedBatch('all');
                            }}
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
                            className="w-full h-10 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-[#5899B5] focus:ring-2 focus:ring-[#5899B5]/15 transition-all cursor-pointer"
                            value={selectedBatch}
                            onChange={(e) => setSelectedBatch(e.target.value)}
                        >
                            <option value="all">All Batches ({attendanceBatches.length})</option>
                            {attendanceBatches.map((b) => (
                                <option key={b._id} value={b._id}>
                                    {b.batchName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 4. Trainer Filter */}
                    {user?.role !== 'trainer' && (
                        <div>
                            <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                                <User size={13} className="text-[#5899B5]" />
                                Trainer
                            </label>
                            <select
                                className="w-full h-10 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-[#5899B5] focus:ring-2 focus:ring-[#5899B5]/15 transition-all cursor-pointer"
                                value={selectedTrainer}
                                onChange={(e) => setSelectedTrainer(e.target.value)}
                            >
                                <option value="all">All Trainers ({trainers.length})</option>
                                {trainers.map((t) => (
                                    <option key={t._id} value={t._id}>
                                        {t.firstName || t.username} {t.lastName || ''}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {/* Search & Bulk Export Toolbar Row */}
                <div className="pt-4 border-t border-slate-100 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3 flex-1">
                        <div className="relative flex-1 min-w-[240px] max-w-md">
                            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            <input
                                className="w-full h-10 pl-10 pr-9 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-[#5899B5] focus:ring-2 focus:ring-[#5899B5]/15 transition-all"
                                placeholder={
                                    reportMode === 'attendance'
                                        ? 'Search batch, course, department, or trainer...'
                                        : 'Search exam title, course, or trainer...'
                                }
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

                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={() => {
                                    if (!lockedCollegeId) {
                                        setSelectedCollege('all');
                                        clearGlobalCollege();
                                    }
                                    setSelectedCourse('all');
                                    setSelectedBatch('all');
                                    if (user?.role !== 'trainer') setSelectedTrainer('all');
                                    setSearchTerm('');
                                }}
                                className="h-10 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition cursor-pointer"
                            >
                                <RotateCcw size={13} />
                                Reset Filters
                            </button>
                        )}
                    </div>

                    {reportMode === 'attendance' && (
                        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                            {selectedBatchIds.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => setSelectedBatchIds([])}
                                    className="h-10 px-3.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                                >
                                    Clear Selection ({selectedBatchIds.length})
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={handleExportTrainingLogs}
                                disabled={actionLoading !== false}
                                className="h-10 px-4 inline-flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer disabled:opacity-50 shadow-2xs"
                            >
                                {actionLoading === 'training_logs' ? (
                                    <Loader2 size={15} className="animate-spin" />
                                ) : (
                                    <FileSpreadsheet size={15} className="text-[#5899B5]" />
                                )}
                                Export Training Logs
                            </button>
                            <button
                                type="button"
                                onClick={() => handleExportBatchAttendance()}
                                disabled={actionLoading !== false || filteredAttendanceBatches.length === 0}
                                className="h-10 px-4 inline-flex items-center gap-2 bg-[#5899B5] hover:bg-[#3D7690] text-white text-xs font-semibold rounded-xl transition cursor-pointer disabled:opacity-50 shadow-2xs"
                            >
                                {actionLoading === 'batch_attendance' ? (
                                    <Loader2 size={15} className="animate-spin" />
                                ) : (
                                    <Download size={15} />
                                )}
                                {selectedBatchIds.length > 0
                                    ? `Export Selected (${selectedBatchIds.length}) Batches`
                                    : 'Export All Batches Attendance'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════════════
                MODE 1: BATCH & DAY-WISE ATTENDANCE SUMMARY & MULTI-BATCH EXPORT
               ═══════════════════════════════════════════════════════════════════════ */}
            {reportMode === 'attendance' && (
                <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900">
                                {selectedBatchIds.length > 0
                                    ? `${selectedBatchIds.length} Batch(es) Selected for Multi-Sheet Attendance Export`
                                    : `Batch Day-Wise Attendance Summary (${filteredAttendanceBatches.length} Batches)`}
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Expand any batch row to inspect its day-by-day session attendance breakdown, or select multiple batches via checkboxes to download a multi-sheet attendance workbook.
                            </p>
                        </div>
                    </div>

                    {attendanceLoading ? (
                        <div className="py-16 text-center">
                            <Loader2 className="animate-spin text-[#5899B5] mx-auto" size={28} />
                            <p className="text-xs font-medium text-slate-400 mt-2.5">Loading batch day-wise attendance summaries...</p>
                        </div>
                    ) : filteredAttendanceBatches.length === 0 ? (
                        <div className="py-16 text-center text-sm text-slate-400">
                            No batches found for the active filters.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-sm">
                                <thead>
                                    <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                        <th className="px-5 py-3.5 w-12">
                                            <input
                                                type="checkbox"
                                                className="rounded border-slate-300 text-[#5899B5] cursor-pointer"
                                                checked={
                                                    filteredAttendanceBatches.length > 0 &&
                                                    filteredAttendanceBatches.every((b) =>
                                                        selectedBatchIds.includes(b._id)
                                                    )
                                                }
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedBatchIds(
                                                            filteredAttendanceBatches.map((b) => b._id)
                                                        );
                                                    } else {
                                                        setSelectedBatchIds([]);
                                                    }
                                                }}
                                            />
                                        </th>
                                        <th className="px-5 py-3.5">Batch &amp; Dept</th>
                                        <th className="px-5 py-3.5">Course</th>
                                        <th className="px-5 py-3.5">Trainer</th>
                                        <th className="px-5 py-3.5 text-center">Students</th>
                                        <th className="px-5 py-3.5 text-center">Sessions / Hrs</th>
                                        <th className="px-5 py-3.5 text-center">Avg Attendance</th>
                                        <th className="px-5 py-3.5 text-center">Below 75%</th>
                                        <th className="px-5 py-3.5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredAttendanceBatches.map((b) => {
                                        const isExpanded = expandedBatchId === b._id;
                                        const isSelected = selectedBatchIds.includes(b._id);
                                        return (
                                            <React.Fragment key={b._id}>
                                                <tr className="hover:bg-slate-50/80 transition-colors">
                                                    <td className="px-5 py-4">
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            onChange={() => toggleBatchSelection(b._id)}
                                                            className="rounded border-slate-300 text-[#5899B5] cursor-pointer"
                                                        />
                                                    </td>
                                                    <td className="px-5 py-4 whitespace-nowrap">
                                                        <div className="font-bold text-slate-900">{b.batchName}</div>
                                                        <div className="text-xs text-slate-400 mt-0.5">
                                                            {b.department} • {b.collegeName}
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <div className="font-medium text-slate-800">{b.courseName}</div>
                                                        {b.courseCode && (
                                                            <code className="text-[11px] font-mono text-slate-400 block mt-0.5">
                                                                {b.courseCode}
                                                            </code>
                                                        )}
                                                    </td>
                                                    <td className="px-5 py-4 text-xs font-semibold text-slate-700 whitespace-nowrap">
                                                        {b.trainerName}
                                                    </td>
                                                    <td className="px-5 py-4 text-center font-semibold text-slate-800 whitespace-nowrap">
                                                        {b.studentCount}
                                                    </td>
                                                    <td className="px-5 py-4 text-center whitespace-nowrap">
                                                        <span className="font-bold text-slate-900">
                                                            {b.totalSessions}
                                                        </span>
                                                        <span className="text-xs text-slate-400 ml-1">
                                                            ({b.totalHours}h)
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-4 text-center whitespace-nowrap">
                                                        <span
                                                            className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                                                                b.totalSessions === 0
                                                                    ? 'bg-slate-100 text-slate-500'
                                                                    : b.avgAttendance >= 75
                                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                                                                        : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                                                            }`}
                                                        >
                                                            {b.totalSessions === 0
                                                                ? 'No Sessions'
                                                                : `${b.avgAttendance}%`}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-4 text-center whitespace-nowrap">
                                                        <span
                                                            className={`text-xs font-bold ${
                                                                b.below75Count > 0
                                                                    ? 'text-rose-600'
                                                                    : 'text-slate-400'
                                                            }`}
                                                        >
                                                            {b.below75Count}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-4 text-right whitespace-nowrap">
                                                        <div className="inline-flex items-center gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setExpandedBatchId(isExpanded ? null : b._id)
                                                                }
                                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition cursor-pointer"
                                                            >
                                                                {isExpanded ? (
                                                                    <>
                                                                        Hide Days <ChevronUp size={13} />
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        Day-Wise ({b.totalSessions}){' '}
                                                                        <ChevronDown size={13} />
                                                                    </>
                                                                )}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleExportBatchAttendance(b._id)}
                                                                title="Export this batch's day-wise attendance register"
                                                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#5899B5] hover:bg-[#3D7690] text-white text-xs font-semibold transition cursor-pointer"
                                                            >
                                                                <Download size={12} />
                                                                Excel
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>

                                                {/* Expandable Day-Wise Session Summary Sub-Table */}
                                                {isExpanded && (
                                                    <tr className="bg-slate-50/70">
                                                        <td colSpan="9" className="p-5">
                                                            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                                                                <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                                                                    <span className="text-xs font-bold text-slate-800">
                                                                        Day-Wise Attendance Breakdown — {b.batchName}
                                                                    </span>
                                                                    <span className="text-[11px] font-semibold text-slate-500">
                                                                        {b.daywiseSessions?.length || 0} Session(s) Conducted
                                                                    </span>
                                                                </div>
                                                                {!b.daywiseSessions || b.daywiseSessions.length === 0 ? (
                                                                    <div className="p-8 text-center text-xs text-slate-400">
                                                                        No attendance sessions recorded for this batch yet.
                                                                    </div>
                                                                ) : (
                                                                    <table className="w-full text-left border-collapse text-xs">
                                                                        <thead>
                                                                            <tr className="border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                                                                                <th className="px-5 py-3">Date</th>
                                                                                <th className="px-5 py-3">Slot &amp; Module</th>
                                                                                <th className="px-5 py-3">Topic Covered</th>
                                                                                <th className="px-5 py-3">Trainer</th>
                                                                                <th className="px-5 py-3 text-center">Present</th>
                                                                                <th className="px-5 py-3 text-center">Absent</th>
                                                                                <th className="px-5 py-3 text-right">Attendance %</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody className="divide-y divide-slate-100">
                                                                            {b.daywiseSessions.map((sess) => (
                                                                                <tr key={sess.sessionId} className="hover:bg-slate-50">
                                                                                    <td className="px-5 py-3 font-semibold text-slate-800 whitespace-nowrap">
                                                                                        {new Date(sess.date).toLocaleDateString(
                                                                                            'en-IN',
                                                                                            {
                                                                                                day: '2-digit',
                                                                                                month: 'short',
                                                                                                year: 'numeric'
                                                                                            }
                                                                                        )}
                                                                                    </td>
                                                                                    <td className="px-5 py-3 text-slate-600 whitespace-nowrap">
                                                                                        {sess.module} • {sess.period}
                                                                                    </td>
                                                                                    <td className="px-5 py-3 font-medium text-slate-800">
                                                                                        {sess.topic}
                                                                                    </td>
                                                                                    <td className="px-5 py-3 text-slate-600 whitespace-nowrap">
                                                                                        {sess.trainerName}
                                                                                    </td>
                                                                                    <td className="px-5 py-3 text-center font-bold text-emerald-700 whitespace-nowrap">
                                                                                        {sess.presentCount}
                                                                                    </td>
                                                                                    <td className="px-5 py-3 text-center font-bold text-rose-600 whitespace-nowrap">
                                                                                        {sess.absentCount}
                                                                                    </td>
                                                                                    <td className="px-5 py-3 text-right font-bold text-slate-900 whitespace-nowrap">
                                                                                        {sess.attendanceRate}%
                                                                                    </td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════════════
                MODE 2: EXAM ALLOTMENTS & RESULTS REPORTS
               ═══════════════════════════════════════════════════════════════════════ */}
            {reportMode === 'exams' && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="py-16 text-center">
                                <Loader2 className="animate-spin text-[#5899B5] mx-auto" size={28} />
                                <p className="text-xs font-medium text-slate-400 mt-2.5">Fetching exam allotment records...</p>
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-200/80 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                        <th className="px-6 py-3.5">Exam Title</th>
                                        <th className="px-6 py-3.5">Course</th>
                                        <th className="px-6 py-3.5">Trainer</th>
                                        <th className="px-6 py-3.5">Target Batch</th>
                                        <th className="px-6 py-3.5">Access Key</th>
                                        <th className="px-6 py-3.5 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm">
                                    {filteredAllotments.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-16 text-center text-sm text-slate-400">
                                                No exam allotments match the active filters.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredAllotments.map((a) => (
                                            <tr key={a._id} className="hover:bg-slate-50/70 transition-colors">
                                                <td className="px-6 py-4 font-semibold text-slate-900">
                                                    {a.examId?.title || 'Unknown Exam'}
                                                </td>
                                                <td className="px-6 py-4 text-xs text-slate-600">
                                                    {a.examId?.courseId?.name || '—'}
                                                    {a.examId?.courseId?.code && (
                                                        <code className="ml-1.5 px-2 py-0.5 bg-slate-100 rounded text-slate-600 font-mono text-[10px]">
                                                            {a.examId.courseId.code}
                                                        </code>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-xs font-semibold text-slate-700 whitespace-nowrap">
                                                    {a.trainerId
                                                        ? `${a.trainerId.firstName} ${a.trainerId.lastName}`
                                                        : 'System'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
                                                        {a.batchId?.batchName || 'General'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-1.5">
                                                        <code className="px-2.5 py-1 bg-slate-50 text-slate-700 border border-slate-200 rounded-md text-xs font-mono font-semibold">
                                                            {a.uniqueKey}
                                                        </code>
                                                        <button
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(a.uniqueKey);
                                                                setCopiedKey(a._id);
                                                                setTimeout(() => setCopiedKey(null), 1500);
                                                            }}
                                                            title="Copy Access Key"
                                                            className="p-1.5 hover:bg-slate-100 rounded-md text-slate-400 hover:text-[#5899B5] cursor-pointer"
                                                        >
                                                            {copiedKey === a._id ? (
                                                                <CheckCircle2 size={13} className="text-emerald-500" />
                                                            ) : (
                                                                <Copy size={13} />
                                                            )}
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                                    <button
                                                        onClick={() =>
                                                            handleExportExamReport(
                                                                a.examId?._id || a.examId,
                                                                a.examId?.title,
                                                                a.trainerId?._id || a.trainerId,
                                                                a.batchId?._id || a.batchId
                                                            )
                                                        }
                                                        disabled={actionLoading === a.examId?._id}
                                                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#5899B5] hover:bg-[#3D7690] text-white text-xs font-semibold rounded-xl transition cursor-pointer disabled:opacity-50"
                                                    >
                                                        {actionLoading === a.examId?._id ? (
                                                            <Loader2 size={12} className="animate-spin" />
                                                        ) : (
                                                            <Download size={12} />
                                                        )}
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
            )}
        </div>
    );
};

export default Reports;
