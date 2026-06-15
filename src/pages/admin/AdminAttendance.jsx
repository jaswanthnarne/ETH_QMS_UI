import { useState, useEffect, useRef } from 'react';
import {
    CalendarCheck, Download, Loader2, Search,
    School, BookOpen, Layers, Users, X, HelpCircle, Check, Clock,
    AlertTriangle, ChevronRight, FileSpreadsheet, BarChart3
} from 'lucide-react';
import axios from 'axios';
import ExcelJS from 'exceljs';
import { useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useCollegeStore from '../../store/collegeStore';

const STATUS_CONFIG = {
    present: { label: 'P', bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
    absent:  { label: 'A', bg: 'bg-rose-100',    text: 'text-rose-700',    border: 'border-rose-200' },
    late:    { label: 'L', bg: 'bg-amber-100',    text: 'text-amber-700',   border: 'border-amber-200' },
    excused: { label: 'E', bg: 'bg-slate-100',    text: 'text-slate-600',   border: 'border-slate-200' },
};

const AdminAttendance = () => {
    const { token, user } = useAuthStore();
    const { selectedCollegeId, selectedCollegeName } = useCollegeStore();
    const location = useLocation();

    // Filters
    const [colleges, setColleges] = useState([]);
    const [courses, setCourses] = useState([]);
    const [batches, setBatches] = useState([]);

    const [filterCollegeId, setFilterCollegeId] = useState('');
    const [filterCourseId, setFilterCourseId] = useState('');
    const [filterBatchId, setFilterBatchId] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // Day-wise data
    const [loading, setLoading] = useState(false);
    const [daywiseData, setDaywiseData] = useState(null);
    const [exporting, setExporting] = useState(false);

    // Student History Drawer
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [studentHistory, setStudentHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [studentSummary, setStudentSummary] = useState(null);

    const tableRef = useRef(null);

    const [activeCollege, setActiveCollege] = useState(null);

    // Context derivations
    const isMultiCollegeAdmin = ['super_admin', 'ops_admin', 'ast_ops_admin', 'regional_manager', 'asst_rm'].includes(user?.role);
    const urlCollegeMatch = location.pathname.match(/\/college\/([a-f0-9]+)/);
    const urlCollegeId = urlCollegeMatch ? urlCollegeMatch[1] : null;
    const effectiveCollegeId = isMultiCollegeAdmin ? (selectedCollegeId || urlCollegeId || filterCollegeId) : user?.collegeId;

    // Fetch active college details for scoped header banner
    useEffect(() => {
        const fetchActiveCollege = async () => {
            if (!effectiveCollegeId) {
                setActiveCollege(null);
                return;
            }
            // Check in list first
            const matched = colleges.find(c => c._id === effectiveCollegeId);
            if (matched) {
                setActiveCollege(matched);
                return;
            }
            try {
                const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                const res = await axios.get(`${baseURL}/admin/colleges/${effectiveCollegeId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                    setActiveCollege(res.data.data);
                }
            } catch (e) {
                console.error('Failed to load active college details', e);
            }
        };

        if (token && effectiveCollegeId) {
            fetchActiveCollege();
        }
    }, [effectiveCollegeId, token, colleges]);

    // ─── Filter Data Loading ─────────────────────────────────────────────────
    const fetchColleges = async () => {
        try {
            const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const res = await axios.get(`${baseURL}/admin/colleges`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setColleges(res.data.data || []);
        } catch (e) {
            console.error('Failed to load colleges', e);
        }
    };

    const fetchCoursesAndBatches = async () => {
        if (!effectiveCollegeId) {
            setCourses([]);
            setBatches([]);
            return;
        }
        try {
            const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const headers = { Authorization: `Bearer ${token}` };
            const [coursesRes, batchesRes] = await Promise.all([
                axios.get(`${baseURL}/admin/colleges/${effectiveCollegeId}/courses`, { headers }),
                axios.get(`${baseURL}/admin/colleges/${effectiveCollegeId}/batches`, { headers }),
            ]);
            setCourses(coursesRes.data.data || []);
            setBatches(batchesRes.data.data || []);
        } catch (e) {
            console.error('Failed to load courses or batches', e);
        }
    };

    useEffect(() => {
        if (isMultiCollegeAdmin) fetchColleges();
    }, [token, user]);

    useEffect(() => {
        fetchCoursesAndBatches();
        setFilterCourseId('');
        setFilterBatchId('');
        setDaywiseData(null);
    }, [effectiveCollegeId, token]);

    // ─── Load Day-wise Matrix ────────────────────────────────────────────────
    const loadDaywiseData = async () => {
        if (!filterBatchId) {
            setDaywiseData(null);
            return;
        }
        setLoading(true);
        try {
            const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const res = await axios.get(`${baseURL}/attendance/reports/batch/${filterBatchId}/daywise`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDaywiseData(res.data);
        } catch (e) {
            console.error('Failed to load daywise report', e);
            setDaywiseData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDaywiseData();
    }, [filterBatchId]);

    // ─── Student Detail Drawer ───────────────────────────────────────────────
    const fetchStudentHistory = async (student) => {
        setSelectedStudent(student);
        setLoadingHistory(true);
        try {
            const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const res = await axios.get(`${baseURL}/attendance/reports/student/${student.studentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStudentHistory(res.data.data || []);
            setStudentSummary(res.data.summary);
        } catch (e) {
            console.error('Failed to load student history', e);
        } finally {
            setLoadingHistory(false);
        }
    };

    // ─── Excel Export ────────────────────────────────────────────────────────
    const handleExportExcel = async () => {
        if (!daywiseData) return;
        setExporting(true);

        try {
            const workbook = new ExcelJS.Workbook();
            workbook.creator = 'Ethnotech Academy';
            workbook.created = new Date();

            const sheet = workbook.addWorksheet('Attendance Register');

            const sessions = daywiseData.sessions;
            const students = filteredStudents;

            // ── Title rows ──
            const titleRow = sheet.addRow([`Attendance Register — ${daywiseData.batchName}`]);
            titleRow.font = { bold: true, size: 14, color: { argb: 'FF004AAD' } };
            sheet.mergeCells(1, 1, 1, 5 + sessions.length + 3);
            titleRow.height = 28;

            const metadataText = `College: ${daywiseData.collegeName}   |   Course: ${daywiseData.courseName}   |   Department: ${daywiseData.department || '—'}   |   Generated: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`;
            const metaRow = sheet.addRow([metadataText]);
            metaRow.font = { size: 10, italic: true, color: { argb: 'FF475569' } };
            sheet.mergeCells(2, 1, 2, 5 + sessions.length + 3);
            metaRow.height = 20;

            sheet.addRow([]); // spacer

            // ── Header row ──
            const headerValues = [
                'S.No', 'Student Name', 'USN', 'Department',
                ...sessions.map(s => {
                    const d = new Date(s.date);
                    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
                }),
                'Total P', 'Total A', 'Attendance %'
            ];
            const headerRow = sheet.addRow(headerValues);
            headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 10 };
            headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF004AAD' } };
            headerRow.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
            headerRow.height = 32;

            // Add borders to header
            headerRow.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin', color: { argb: 'FF003580' } },
                    bottom: { style: 'thin', color: { argb: 'FF003580' } },
                    left: { style: 'thin', color: { argb: 'FF003580' } },
                    right: { style: 'thin', color: { argb: 'FF003580' } },
                };
            });

            // ── Sub-header row with topics ──
            const topicValues = [
                '', '', '', '',
                ...sessions.map(s => s.topic || '—'),
                '', '', ''
            ];
            const topicRow = sheet.addRow(topicValues);
            topicRow.font = { size: 8, italic: true, color: { argb: 'FF64748B' } };
            topicRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEEF2FF' } };
            topicRow.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
            topicRow.height = 22;

            // ── Data rows ──
            const statusColors = {
                present: { fill: 'FFD1FAE5', font: 'FF065F46' },
                absent: { fill: 'FFFEE2E2', font: 'FF991B1B' },
                late: { fill: 'FFFEF3C7', font: 'FF92400E' },
                excused: { fill: 'FFF1F5F9', font: 'FF475569' },
            };
            const statusLabels = { present: 'P', absent: 'A', late: 'L', excused: 'E' };

            students.forEach((student, idx) => {
                const rowValues = [
                    idx + 1,
                    student.name,
                    student.usn,
                    student.department,
                    ...sessions.map(s => statusLabels[student.records[s.sessionId]] || '—'),
                    student.summary.present,
                    student.summary.absent,
                    `${student.summary.percentage}%`
                ];

                const row = sheet.addRow(rowValues);
                row.alignment = { vertical: 'middle', horizontal: 'center' };
                row.height = 22;

                // Alternating row bg
                const rowBg = idx % 2 === 0 ? 'FFFFFFFF' : 'FFF8FAFC';
                row.eachCell((cell) => {
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: rowBg } };
                    cell.border = {
                        bottom: { style: 'hair', color: { argb: 'FFE2E8F0' } },
                        left: { style: 'hair', color: { argb: 'FFE2E8F0' } },
                        right: { style: 'hair', color: { argb: 'FFE2E8F0' } },
                    };
                });

                row.getCell(2).alignment = { vertical: 'middle', horizontal: 'left' };
                row.getCell(3).alignment = { vertical: 'middle', horizontal: 'left' };
                row.getCell(3).font = { name: 'Inter', size: 10 };
                row.getCell(4).alignment = { vertical: 'middle', horizontal: 'left' };

                // Color-code each date cell
                sessions.forEach((s, sIdx) => {
                    const cellIndex = 5 + sIdx;
                    const cell = row.getCell(cellIndex);
                    const status = student.records[s.sessionId] || 'absent';
                    const colors = statusColors[status] || statusColors.absent;
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.fill } };
                    cell.font = { bold: true, size: 10, color: { argb: colors.font } };
                });

                // Color-code percentage
                const pctCell = row.getCell(5 + sessions.length + 2);
                const pct = student.summary.percentage;
                pctCell.font = { bold: true, size: 10, color: { argb: pct >= 75 ? 'FF065F46' : 'FF991B1B' } };
                pctCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: pct >= 75 ? 'FFD1FAE5' : 'FFFEE2E2' } };
            });

            // ── Column widths ──
            sheet.getColumn(1).width = 6;   // S.No
            sheet.getColumn(2).width = 28;  // Name
            sheet.getColumn(3).width = 18;  // USN
            sheet.getColumn(4).width = 14;  // Dept
            sessions.forEach((_, i) => { sheet.getColumn(5 + i).width = 10; });
            sheet.getColumn(5 + sessions.length).width = 10;
            sheet.getColumn(5 + sessions.length + 1).width = 10;
            sheet.getColumn(5 + sessions.length + 2).width = 14;

            // ── Download ──
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const safeName = (daywiseData.batchName || 'Batch').replace(/[^a-zA-Z0-9]/g, '_');
            a.setAttribute('download', `Attendance_${safeName}_${new Date().toISOString().slice(0, 10)}.xlsx`);
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (e) {
            console.error('Export failed', e);
            alert('Failed to export attendance. Please try again.');
        } finally {
            setExporting(false);
        }
    };

    // ─── Derived Data ────────────────────────────────────────────────────────
    const filteredBatchesList = batches.filter(b => !filterCourseId || b.courseId?._id === filterCourseId);

    const filteredStudents = daywiseData?.students?.filter(s =>
        s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.usn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.department?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const overallAvg = filteredStudents.length > 0
        ? Math.round(filteredStudents.reduce((acc, s) => acc + s.summary.percentage, 0) / filteredStudents.length)
        : 0;

    const lowAttendanceCount = filteredStudents.filter(s => s.summary.percentage < 75).length;

    // ─── Format date for column header ───────────────────────────────────────
    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    };

    const formatFullDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    // ─── RENDER ──────────────────────────────────────────────────────────────
    return (
        <div className="space-y-6 animate-fade-in duration-300">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-100">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2.5">
                        <CalendarCheck className="text-[#004AAD]" size={28} />
                        Attendance Register
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                        View day-wise attendance matrix, drill into student logs, and export professional reports.
                    </p>
                </div>

                {filterBatchId && daywiseData && (
                    <button
                        onClick={handleExportExcel}
                        disabled={exporting}
                        className="w-full md:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 transition-all active:scale-95 cursor-pointer"
                    >
                        {exporting ? <Loader2 size={14} className="animate-spin" /> : <FileSpreadsheet size={14} />}
                        {exporting ? 'Generating...' : 'Export Excel'}
                    </button>
                )}
            </div>

            {/* Active College Badge if selected */}
            {effectiveCollegeId && (
                <div className="bg-blue-50/80 border border-blue-100/50 rounded-2xl p-4 flex items-center justify-between gap-3 animate-in fade-in duration-300">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#004AAD] flex items-center justify-center flex-shrink-0 shadow-inner">
                            <School size={20} />
                        </div>
                        <div>
                            <span className="text-[10px] font-bold text-[#004AAD] uppercase tracking-wider block">Active Institution Context</span>
                            <h3 className="text-sm font-bold text-slate-800 leading-tight mt-0.5">
                                {activeCollege?.name || selectedCollegeName || "Loading college details..."}
                            </h3>
                        </div>
                    </div>
                </div>
            )}

            {/* Filter controls */}
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm grid grid-cols-1 sm:grid-cols-4 gap-4">
                {/* College Selector */}
                {isMultiCollegeAdmin && !selectedCollegeId && (
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
                            <School size={12} className="text-slate-400" /> Institution
                        </label>
                        <select
                            value={filterCollegeId}
                            onChange={e => setFilterCollegeId(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-[#004AAD] outline-none text-slate-700 font-semibold"
                        >
                            <option value="">Select Institution</option>
                            {colleges.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                        </select>
                    </div>
                )}

                {/* Course Selector */}
                <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
                        <BookOpen size={12} className="text-slate-400" /> Course Filter
                    </label>
                    <select
                        disabled={!effectiveCollegeId}
                        value={filterCourseId}
                        onChange={e => { setFilterCourseId(e.target.value); setFilterBatchId(''); }}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-[#004AAD] outline-none text-slate-700 font-semibold disabled:opacity-50"
                    >
                        <option value="">All Courses</option>
                        {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                </div>

                {/* Batch Selector */}
                <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
                        <Layers size={12} className="text-slate-400" /> Select Batch
                    </label>
                    <select
                        disabled={!effectiveCollegeId}
                        value={filterBatchId}
                        onChange={e => setFilterBatchId(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-[#004AAD] outline-none text-slate-700 font-semibold disabled:opacity-50"
                    >
                        <option value="">— Select a Batch —</option>
                        {filteredBatchesList.map(b => <option key={b._id} value={b._id}>{b.batchName}</option>)}
                    </select>
                </div>

                {/* Search Bar */}
                <div className={isMultiCollegeAdmin && !selectedCollegeId ? '' : 'sm:col-span-2'}>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
                        <Search size={12} className="text-slate-400" /> Student Search
                    </label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input
                            type="text"
                            disabled={!filterBatchId}
                            placeholder="Search by name or USN..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-[#004AAD] outline-none font-medium transition-all disabled:opacity-50"
                        />
                    </div>
                </div>
            </div>

            {/* Summary Stats */}
            {filterBatchId && daywiseData && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 text-[#004AAD] rounded-xl flex items-center justify-center font-extrabold text-sm border border-blue-100">
                            {daywiseData.totalSessions}
                        </div>
                        <div>
                            <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Sessions</h4>
                            <p className="text-xs text-slate-500 mt-0.5">Classes recorded</p>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-700 rounded-xl flex items-center justify-center font-extrabold text-sm border border-indigo-100">
                            {daywiseData.students.length}
                        </div>
                        <div>
                            <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Students</h4>
                            <p className="text-xs text-slate-500 mt-0.5">Active roster</p>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm border ${
                            overallAvg >= 75 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                        }`}>
                            {overallAvg}%
                        </div>
                        <div>
                            <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Avg Attendance</h4>
                            <p className="text-xs text-slate-500 mt-0.5">Batch average</p>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm border ${
                            lowAttendanceCount > 0 ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                        }`}>
                            {lowAttendanceCount}
                        </div>
                        <div>
                            <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Below 75%</h4>
                            <p className="text-xs text-slate-500 mt-0.5">Risk flagged</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Main content area */}
            {!effectiveCollegeId ? (
                <div className="p-16 text-center bg-white border border-slate-200 rounded-2xl shadow-sm">
                    <School className="mx-auto text-slate-400 mb-3 animate-pulse" size={40} />
                    <p className="font-bold text-slate-700 text-sm">Select an Institution Context</p>
                    <p className="text-xs text-slate-400 mt-1">Please select an institution and batch to view the day-wise attendance register.</p>
                </div>
            ) : !filterBatchId ? (
                <div className="p-16 text-center bg-white border border-slate-200 rounded-2xl shadow-sm">
                    <Layers className="mx-auto text-slate-400 mb-3" size={40} />
                    <p className="font-bold text-slate-700 text-sm">Select a Batch</p>
                    <p className="text-xs text-slate-400 mt-1">Choose a batch from the filter above to load the day-wise attendance matrix.</p>
                </div>
            ) : loading ? (
                <div className="h-[40vh] flex items-center justify-center">
                    <Loader2 className="animate-spin text-[#004AAD]" size={36} />
                </div>
            ) : !daywiseData || daywiseData.sessions.length === 0 ? (
                <div className="p-16 text-center bg-white border border-slate-200 rounded-2xl shadow-sm">
                    <CalendarCheck className="mx-auto text-slate-300 mb-3" size={40} />
                    <p className="font-bold text-slate-700 text-sm">No Attendance Records</p>
                    <p className="text-xs text-slate-400 mt-1">No attendance sessions have been logged for this batch yet.</p>
                </div>
            ) : (
                /* ─── Day-wise Matrix Table ─────────────────────────────────── */
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    {/* Table header info */}
                    <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                <BarChart3 size={16} className="text-[#004AAD]" />
                                Day-wise Attendance Register
                            </h3>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                                {daywiseData.batchName} • {daywiseData.courseName} • {filteredStudents.length} student(s) × {daywiseData.sessions.length} session(s)
                            </p>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-bold">
                            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-200"></span> Present</span>
                            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-rose-100 border border-rose-200"></span> Absent</span>
                            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-100 border border-amber-200"></span> Late</span>
                            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-slate-100 border border-slate-200"></span> Excused</span>
                        </div>
                    </div>

                    {filteredStudents.length === 0 ? (
                        <div className="p-12 text-center text-slate-500 text-xs">
                            No matching students found.
                        </div>
                    ) : (
                        <div className="overflow-x-auto custom-scrollbar" ref={tableRef}>
                            <table className="w-full border-collapse text-xs">
                                <thead>
                                    {/* Date headers */}
                                    <tr className="border-b border-slate-200 bg-slate-50">
                                        <th className="sticky left-0 z-20 bg-slate-50 p-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center border-r border-slate-200 min-w-[40px]">
                                            #
                                        </th>
                                        <th className="sticky left-[40px] z-20 bg-slate-50 p-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-left border-r border-slate-200 min-w-[180px]">
                                            Student Info
                                        </th>
                                        <th className="sticky left-[220px] z-20 bg-slate-50 p-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-left border-r border-slate-200 min-w-[120px]">
                                            USN
                                        </th>

                                        {daywiseData.sessions.map((s) => (
                                            <th
                                                key={s.sessionId}
                                                className="p-2 text-center min-w-[60px] border-r border-slate-100"
                                                title={`${formatFullDate(s.date)} — ${s.topic} (${s.period})\nTrainer: ${s.trainer}`}
                                            >
                                                <div className="text-[10px] font-bold text-slate-700">
                                                    {formatDate(s.date)}
                                                </div>
                                                <div className="text-[8px] text-slate-400 font-semibold truncate max-w-[56px] mx-auto" title={s.topic}>
                                                    {s.topic?.length > 8 ? s.topic.substring(0, 8) + '…' : s.topic}
                                                </div>
                                            </th>
                                        ))}

                                        <th className="p-3 text-center min-w-[50px] text-[10px] font-bold text-emerald-600 uppercase tracking-wider border-l-2 border-slate-200">P</th>
                                        <th className="p-3 text-center min-w-[50px] text-[10px] font-bold text-rose-600 uppercase tracking-wider">A</th>
                                        <th className="p-3 text-center min-w-[70px] text-[10px] font-bold text-[#004AAD] uppercase tracking-wider">%</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {filteredStudents.map((student, idx) => (
                                        <tr
                                            key={student.studentId}
                                            className="hover:bg-blue-50/30 transition-colors cursor-pointer group"
                                            onClick={() => fetchStudentHistory(student)}
                                        >
                                            <td className="sticky left-0 z-10 bg-white group-hover:bg-blue-50/30 p-3 text-center font-bold text-slate-400 border-r border-slate-100 text-[10px]">
                                                {idx + 1}
                                            </td>
                                            <td className="sticky left-[40px] z-10 bg-white group-hover:bg-blue-50/30 p-3 border-r border-slate-100">
                                                <div className="flex items-center gap-2">
                                                    <div>
                                                        <div className="font-bold text-slate-800 text-xs">{student.name}</div>
                                                        <div className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">
                                                            {student.department} {student.division && student.division !== '—' ? `• Div ${student.division}` : ''}
                                                        </div>
                                                    </div>
                                                    <ChevronRight size={12} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-auto" />
                                                </div>
                                            </td>
                                            <td className="sticky left-[220px] z-10 bg-white group-hover:bg-blue-50/30 p-3 font-semibold text-slate-500 uppercase border-r border-slate-100 text-[11px] tracking-wider">
                                                {student.usn}
                                            </td>

                                            {daywiseData.sessions.map((s) => {
                                                const status = student.records[s.sessionId] || 'absent';
                                                const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.absent;
                                                return (
                                                    <td key={s.sessionId} className="p-1.5 text-center border-r border-slate-50">
                                                        <span className={`inline-flex items-center justify-center w-7 h-6 rounded ${cfg.bg} ${cfg.text} border ${cfg.border} text-[10px] font-extrabold`}>
                                                            {cfg.label}
                                                        </span>
                                                    </td>
                                                );
                                            })}

                                            <td className="p-3 text-center font-extrabold text-emerald-700 border-l-2 border-slate-200 text-[11px]">
                                                {student.summary.present}
                                            </td>
                                            <td className="p-3 text-center font-extrabold text-rose-700 text-[11px]">
                                                {student.summary.absent}
                                            </td>
                                            <td className="p-3 text-center">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wide uppercase ${
                                                    student.summary.percentage >= 75
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                                        : student.summary.percentage >= 60
                                                        ? 'bg-amber-50 text-amber-700 border border-amber-100'
                                                        : 'bg-rose-50 text-rose-700 border border-rose-100'
                                                }`}>
                                                    {student.summary.percentage}%
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* ─── Student Detail Drawer ───────────────────────────────────── */}
            {selectedStudent && (
                <div className="fixed inset-0 z-[120] flex justify-end">
                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
                        onClick={() => setSelectedStudent(null)}
                    />
                    <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
                        {/* Header */}
                        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <div>
                                <h3 className="font-extrabold text-slate-800 text-base">{selectedStudent.name}</h3>
                                <p className="text-[11px] text-slate-400 font-semibold uppercase mt-0.5">
                                    USN: {selectedStudent.usn} • {selectedStudent.department}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedStudent(null)}
                                className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Summary */}
                        {studentSummary && (
                            <div className="p-6 border-b border-slate-100 grid grid-cols-3 gap-4 text-center">
                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase">Conducted</span>
                                    <span className="block text-base font-extrabold text-slate-700 mt-0.5">{studentSummary.totalSessions}</span>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase">Attended</span>
                                    <span className="block text-base font-extrabold text-slate-700 mt-0.5">{studentSummary.attended}</span>
                                </div>
                                <div className={`p-3 rounded-xl border ${
                                    studentSummary.percentage >= 75
                                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                        : 'bg-rose-50 border-rose-200 text-rose-700'
                                }`}>
                                    <span className="text-[10px] opacity-75 font-bold uppercase">Percentage</span>
                                    <span className="block text-base font-extrabold mt-0.5">{studentSummary.percentage}%</span>
                                </div>
                            </div>
                        )}

                        {/* History Log */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Chronological Session Log</h4>

                            {loadingHistory ? (
                                <div className="h-40 flex items-center justify-center">
                                    <Loader2 className="animate-spin text-[#004AAD]" size={28} />
                                </div>
                            ) : studentHistory.length === 0 ? (
                                <div className="text-center text-slate-400 text-xs py-8">
                                    No logged history found for this student.
                                </div>
                            ) : (
                                <div className="relative border-l border-slate-200 pl-4 ml-2 space-y-6">
                                    {studentHistory.map(log => (
                                        <div key={log.sessionId} className="relative">
                                            <span className={`absolute -left-[23px] top-0.5 w-4.5 h-4.5 rounded-full flex items-center justify-center border text-[9px] font-extrabold ${
                                                log.status === 'present' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                                                log.status === 'absent' ? 'bg-rose-50 border-rose-200 text-rose-700' :
                                                log.status === 'late' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                                                'bg-indigo-50 border-indigo-200 text-indigo-700'
                                            }`}>
                                                {log.status === 'present' && <Check size={10} />}
                                                {log.status === 'absent' && <X size={10} />}
                                                {log.status === 'late' && <Clock size={10} />}
                                                {log.status === 'excused' && <HelpCircle size={10} />}
                                            </span>

                                            <div>
                                                <div className="flex justify-between items-start">
                                                    <span className="font-extrabold text-slate-800 text-xs leading-none">
                                                        {log.topic}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400 font-bold shrink-0">
                                                        {new Date(log.date).toLocaleDateString('en-US', {
                                                            month: 'short', day: 'numeric', year: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                                <div className="text-[10px] text-slate-400 mt-1 flex gap-2 font-medium">
                                                    <span>Period: <strong className="text-slate-600">{log.period}</strong></span>
                                                    <span>•</span>
                                                    <span>Trainer: <strong className="text-slate-600">{log.trainer}</strong></span>
                                                </div>
                                                {log.remarks && (
                                                    <div className="mt-1.5 p-2 bg-slate-50 rounded-lg text-[10px] text-slate-500 border border-slate-100 font-medium italic">
                                                        Note: {log.remarks}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminAttendance;
