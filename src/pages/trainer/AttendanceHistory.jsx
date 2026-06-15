import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Calendar, Clock, Edit2, Trash2, Loader2, AlertCircle, Lock, FileSpreadsheet } from 'lucide-react';
import axios from 'axios';
import ExcelJS from 'exceljs';
import useAuthStore from '../../store/authStore';

const AttendanceHistory = () => {
    const { batchId } = useParams();
    const navigate = useNavigate();
    const { token, user } = useAuthStore();

    // States
    const [batch, setBatch] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [stats, setStats] = useState({ totalSessions: 0, avgAttendance: 0 });
    const [exporting, setExporting] = useState(false);

    const loadData = async () => {
        setLoading(true);
        setError('');
        try {
            const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const headers = { Authorization: `Bearer ${token}` };

            // 1. Fetch batch details
            const batchRes = await axios.get(`${baseURL}/admin/batches/${batchId}`, { headers });
            setBatch(batchRes.data.data);

            // 2. Fetch historic sessions
            const sessionsRes = await axios.get(`${baseURL}/attendance/batch/${batchId}`, { headers });
            const list = sessionsRes.data.data || [];
            setSessions(list);

            // Calculate simple stats
            if (list.length > 0) {
                let totalStudents = 0;
                let totalPresent = 0;

                list.forEach(sess => {
                    totalStudents += sess.records?.length || 0;
                    totalPresent += sess.records?.filter(r => r.status === 'present' || r.status === 'late').length || 0;
                });

                const average = totalStudents > 0 ? Math.round((totalPresent / totalStudents) * 100) : 100;
                setStats({
                    totalSessions: list.length,
                    avgAttendance: average
                });
            } else {
                setStats({ totalSessions: 0, avgAttendance: 0 });
            }

        } catch (err) {
            console.error('Failed to load attendance logs', err);
            setError(err.response?.data?.error || 'Failed to load attendance history.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [batchId, token]);

    const handleDelete = async (sessionId) => {
        if (!window.confirm('Are you sure you want to permanently delete this attendance session? All recorded statuses will be lost.')) return;
        
        try {
            const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const headers = { Authorization: `Bearer ${token}` };
            await axios.delete(`${baseURL}/attendance/session/${sessionId}`, { headers });
            
            // Reload list
            loadData();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to delete attendance session.');
        }
    };

    const handleExportExcel = async () => {
        setExporting(true);
        try {
            const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const headers = { Authorization: `Bearer ${token}` };

            // 1. Fetch student roster
            const studentsRes = await axios.get(`${baseURL}/admin/batches/${batchId}/students`, { headers });
            const students = studentsRes.data.data || [];

            // 2. Build Excel
            const workbook = new ExcelJS.Workbook();
            workbook.creator = 'Ethnotech Academy';
            workbook.created = new Date();

            const chronologicalSessions = [...sessions].sort((a, b) => new Date(a.date) - new Date(b.date));

            // --- SHEET 1: Summary Logs ---
            const summarySheet = workbook.addWorksheet('Summary Logs');
            // Heading
            summarySheet.addRow([`Batch Attendance Summary — ${batch?.batchName || 'Batch'}`]);
            summarySheet.getRow(1).font = { bold: true, size: 14, color: { argb: 'FF004AAD' } };
            summarySheet.mergeCells(1, 1, 1, 7);
            summarySheet.getRow(1).height = 28;

            const trainerName = batch?.trainerId 
                ? `${batch.trainerId.firstName || ''} ${batch.trainerId.lastName || ''}`.trim() 
                : (user?.firstName || user?.name || '');
            const metadataText = `College: ${batch?.collegeId?.name || '—'}   |   Course: ${batch?.courseId?.name || '—'}   |   Department: ${batch?.department || '—'}${trainerName ? `   |   Trainer: ${trainerName}` : ''}   |   Generated: ${new Date().toLocaleDateString('en-IN')}`;

            summarySheet.addRow([metadataText]);
            summarySheet.getRow(2).font = { size: 10, italic: true, color: { argb: 'FF475569' } };
            summarySheet.mergeCells(2, 1, 2, 7);
            summarySheet.getRow(2).height = 20;

            summarySheet.addRow([]); // Spacer

            const headers1 = ['S.No', 'Date', 'Period / Hour', 'Topic Covered', 'Module', 'Head Count', 'Attendance %'];
            const headerRow1 = summarySheet.addRow(headers1);
            headerRow1.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 10 };
            headerRow1.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF004AAD' } };
            headerRow1.alignment = { vertical: 'middle', horizontal: 'center' };
            headerRow1.height = 28;

            chronologicalSessions.forEach((sess, idx) => {
                const total = sess.records?.length || 0;
                const present = sess.records?.filter(r => r.status === 'present' || r.status === 'late').length || 0;
                const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

                const row = summarySheet.addRow([
                    idx + 1,
                    new Date(sess.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
                    sess.period || '—',
                    sess.topic || '—',
                    sess.module || '—',
                    `${present} / ${total}`,
                    `${percentage}%`
                ]);
                row.alignment = { vertical: 'middle', horizontal: 'center' };
                row.getCell(4).alignment = { vertical: 'middle', horizontal: 'left' }; // Left align topic
                row.height = 22;

                const rowBg = idx % 2 === 0 ? 'FFFFFFFF' : 'FFF8FAFC';
                row.eachCell((cell) => {
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: rowBg } };
                    cell.border = {
                        bottom: { style: 'hair', color: { argb: 'FFE2E8F0' } },
                        left: { style: 'hair', color: { argb: 'FFE2E8F0' } },
                        right: { style: 'hair', color: { argb: 'FFE2E8F0' } },
                    };
                });
            });

            summarySheet.getColumn(1).width = 6;
            summarySheet.getColumn(2).width = 16;
            summarySheet.getColumn(3).width = 16;
            summarySheet.getColumn(4).width = 35;
            summarySheet.getColumn(5).width = 14;
            summarySheet.getColumn(6).width = 14;
            summarySheet.getColumn(7).width = 16;


            // --- SHEET 2: Student Register ---
            const registerSheet = workbook.addWorksheet('Student Register');

            registerSheet.addRow([`Student Attendance Register — ${batch?.batchName || 'Batch'}`]);
            registerSheet.getRow(1).font = { bold: true, size: 14, color: { argb: 'FF004AAD' } };
            registerSheet.mergeCells(1, 1, 1, 4 + chronologicalSessions.length + 3);
            registerSheet.getRow(1).height = 28;

            registerSheet.addRow([metadataText]);
            registerSheet.getRow(2).font = { size: 10, italic: true, color: { argb: 'FF475569' } };
            registerSheet.mergeCells(2, 1, 2, 4 + chronologicalSessions.length + 3);
            registerSheet.getRow(2).height = 20;

            registerSheet.addRow([]); // Spacer

            const headers2 = [
                'S.No', 'Student Name', 'USN', 'Department',
                ...chronologicalSessions.map(s => new Date(s.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })),
                'Total P', 'Total A', 'Attendance %'
            ];
            const headerRow2 = registerSheet.addRow(headers2);
            headerRow2.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 10 };
            headerRow2.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF004AAD' } };
            headerRow2.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
            headerRow2.height = 32;

            headerRow2.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin', color: { argb: 'FF003580' } },
                    bottom: { style: 'thin', color: { argb: 'FF003580' } },
                    left: { style: 'thin', color: { argb: 'FF003580' } },
                    right: { style: 'thin', color: { argb: 'FF003580' } },
                };
            });

            const subHeaders2 = [
                '', '', '', '',
                ...chronologicalSessions.map(s => s.topic || '—'),
                '', '', ''
            ];
            const subRow2 = registerSheet.addRow(subHeaders2);
            subRow2.font = { size: 8, italic: true, color: { argb: 'FF64748B' } };
            subRow2.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEEF2FF' } };
            subRow2.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
            subRow2.height = 22;

            const statusColors = {
                present: { fill: 'FFD1FAE5', font: 'FF065F46', label: 'P' },
                absent: { fill: 'FFFEE2E2', font: 'FF991B1B', label: 'A' },
                late: { fill: 'FFFEF3C7', font: 'FF92400E', label: 'L' },
                excused: { fill: 'FFF1F5F9', font: 'FF475569', label: 'E' },
            };

            students.forEach((student, idx) => {
                let pCount = 0;
                let aCount = 0;
                let lCount = 0;
                let eCount = 0;

                const statuses = chronologicalSessions.map(s => {
                    const rec = s.records?.find(r => (r.studentId?._id || r.studentId)?.toString() === student._id.toString());
                    const status = rec ? rec.status : 'absent';
                    if (status === 'present') pCount++;
                    else if (status === 'absent') aCount++;
                    else if (status === 'late') lCount++;
                    else if (status === 'excused') eCount++;
                    return statusColors[status]?.label || 'A';
                });

                const attendedCount = pCount + lCount;
                const percentage = chronologicalSessions.length > 0
                    ? Math.round((attendedCount / chronologicalSessions.length) * 100)
                    : 100;

                const row = registerSheet.addRow([
                    idx + 1,
                    student.name,
                    student.usn || '—',
                    student.department || '—',
                    ...statuses,
                    pCount + lCount,
                    aCount,
                    `${percentage}%`
                ]);
                row.alignment = { vertical: 'middle', horizontal: 'center' };
                row.getCell(2).alignment = { vertical: 'middle', horizontal: 'left' };
                row.getCell(3).alignment = { vertical: 'middle', horizontal: 'left' };
                row.getCell(3).font = { name: 'Inter', size: 10 };
                row.getCell(4).alignment = { vertical: 'middle', horizontal: 'left' };
                row.height = 22;

                const rowBg = idx % 2 === 0 ? 'FFFFFFFF' : 'FFF8FAFC';
                row.eachCell((cell) => {
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: rowBg } };
                    cell.border = {
                        bottom: { style: 'hair', color: { argb: 'FFE2E8F0' } },
                        left: { style: 'hair', color: { argb: 'FFE2E8F0' } },
                        right: { style: 'hair', color: { argb: 'FFE2E8F0' } },
                    };
                });

                chronologicalSessions.forEach((s, sIdx) => {
                    const cell = row.getCell(5 + sIdx);
                    const statusVal = s.records?.find(r => (r.studentId?._id || r.studentId)?.toString() === student._id.toString())?.status || 'absent';
                    const cfg = statusColors[statusVal] || statusColors.absent;
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: cfg.fill } };
                    cell.font = { bold: true, size: 10, color: { argb: cfg.font } };
                });

                const pctCell = row.getCell(5 + chronologicalSessions.length + 2);
                pctCell.font = { bold: true, size: 10, color: { argb: percentage >= 75 ? 'FF065F46' : 'FF991B1B' } };
                pctCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: percentage >= 75 ? 'FFD1FAE5' : 'FFFEE2E2' } };
            });

            registerSheet.getColumn(1).width = 6;
            registerSheet.getColumn(2).width = 28;
            registerSheet.getColumn(3).width = 18;
            registerSheet.getColumn(4).width = 14;
            chronologicalSessions.forEach((_, i) => { registerSheet.getColumn(5 + i).width = 10; });
            registerSheet.getColumn(5 + chronologicalSessions.length).width = 10;
            registerSheet.getColumn(5 + chronologicalSessions.length + 1).width = 10;
            registerSheet.getColumn(5 + chronologicalSessions.length + 2).width = 14;

            // 3. Download
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const safeName = (batch?.batchName || 'Batch').replace(/[^a-zA-Z0-9]/g, '_');
            a.setAttribute('download', `Batch_Attendance_${safeName}_${new Date().toISOString().slice(0, 10)}.xlsx`);
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (e) {
            console.error('Export failed', e);
            alert('Failed to export batch attendance.');
        } finally {
            setExporting(false);
        }
    };

    // Helper: checks if editing window is closed (72 hours) for trainers
    const isSessionLocked = (createdAt) => {
        if (user?.role !== 'trainer') return false; // Admin can always edit
        const timeDiff = Date.now() - new Date(createdAt).getTime();
        const lockTime = 72 * 60 * 60 * 1000;
        return timeDiff > lockTime;
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="animate-spin text-[#004AAD]" size={36} />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in duration-300">
            {/* Header */}
            <div className="flex flex-col gap-3">
                <button 
                    onClick={() => navigate('/trainer/attendance')} 
                    className="flex items-center gap-2 text-slate-500 hover:text-[#004AAD] text-sm font-bold w-fit transition-all active:translate-x-[-2px]"
                >
                    <ArrowLeft size={16} /> Back to Batches
                </button>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">Attendance Logs</h1>
                        <p className="text-xs text-slate-500 mt-1">
                            Batch: <span className="font-semibold text-slate-700">{batch?.batchName}</span> • Course: <span className="font-semibold text-slate-700">{batch?.courseId?.name || '—'}</span>
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                        <button
                            disabled={exporting}
                            onClick={handleExportExcel}
                            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                        >
                            {exporting ? <Loader2 size={14} className="animate-spin" /> : <FileSpreadsheet size={14} />}
                            {exporting ? 'Exporting...' : 'Export Attendance'}
                        </button>

                        <button
                            onClick={() => navigate(`/trainer/attendance/mark/${batchId}`)}
                            className="px-4 py-2.5 bg-[#004AAD] hover:bg-[#003580] text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-blue-50 transition-all cursor-pointer"
                        >
                            <Plus size={16} /> New Session Attendance
                        </button>
                    </div>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-2xl flex items-center gap-3">
                    <AlertCircle className="text-rose-600 shrink-0" size={18} />
                    <span className="font-semibold">{error}</span>
                </div>
            )}

            {/* Metrics cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 text-[#004AAD] rounded-xl flex items-center justify-center font-extrabold text-lg border border-indigo-100">
                        {stats.totalSessions}
                    </div>
                    <div>
                        <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Classes Recorded</h4>
                        <p className="text-sm font-extrabold text-slate-700 mt-0.5">Sessions logged in database</p>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center font-extrabold text-lg border border-emerald-100">
                        {stats.avgAttendance}%
                    </div>
                    <div>
                        <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Average Attendance</h4>
                        <p className="text-sm font-extrabold text-slate-700 mt-0.5">Cumulative roster presence</p>
                    </div>
                </div>
            </div>

            {/* Logs List Table */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100">
                    <h3 className="text-sm font-bold text-slate-800">Session History</h3>
                </div>

                {sessions.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 text-xs">
                        No attendance logs found for this batch. Click "New Session Attendance" to create the first record.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    <th className="p-4 pl-6">Session Date</th>
                                    <th className="p-4">Period / Hour</th>
                                    <th className="p-4">Topic Covered</th>
                                    <th className="p-4">Duration</th>
                                    <th className="p-4 text-center">Attendance Status</th>
                                    <th className="p-4 text-right pr-6">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {sessions.map(sess => {
                                    const locked = isSessionLocked(sess.createdAt);
                                    const total = sess.records?.length || 0;
                                    const present = sess.records?.filter(r => r.status === 'present' || r.status === 'late').length || 0;
                                    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

                                    return (
                                        <tr key={sess._id} className="hover:bg-slate-50/45 transition-colors">
                                            <td className="p-4 pl-6 font-bold text-xs text-slate-700">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={14} className="text-slate-400 shrink-0" />
                                                    {new Date(sess.date).toLocaleDateString('en-US', {
                                                        year: 'numeric', month: 'short', day: 'numeric'
                                                    })}
                                                </div>
                                            </td>
                                            <td className="p-4 text-xs font-semibold text-slate-500">
                                                {sess.period || 'Hour 1'}
                                            </td>
                                            <td className="p-4 text-xs font-semibold text-slate-700 truncate max-w-xs" title={sess.topic}>
                                                {sess.topic}
                                            </td>
                                            <td className="p-4 text-xs text-slate-500 font-medium">
                                                <div className="flex items-center gap-1">
                                                    <Clock size={12} className="text-slate-400" />
                                                    {sess.duration || 60} mins
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-col items-center">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wide uppercase ${
                                                        percentage >= 75 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                                        percentage >= 60 ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                                                        'bg-rose-50 text-rose-700 border border-rose-100'
                                                    }`}>
                                                        {present} / {total} ({percentage}%)
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-right pr-6">
                                                <div className="flex justify-end gap-1.5">
                                                    {locked ? (
                                                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold bg-slate-100 px-2 py-1.5 rounded-lg" title="Attendance locked after 72 hours">
                                                            <Lock size={12} /> Locked
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <button 
                                                                onClick={() => navigate(`/trainer/attendance/mark/${batchId}?sessionId=${sess._id}`)}
                                                                className="p-1.5 text-slate-400 hover:text-[#004AAD] hover:bg-blue-50 rounded-lg transition-colors"
                                                                title="Edit Session Attendance"
                                                            >
                                                                <Edit2 size={15} />
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDelete(sess._id)}
                                                                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                                title="Delete Session Log"
                                                            >
                                                                <Trash2 size={15} />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AttendanceHistory;
