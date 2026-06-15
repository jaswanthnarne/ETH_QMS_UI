import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, CalendarCheck, Search, Loader2, ArrowRight, BookOpen, Layers, FileSpreadsheet, Download } from 'lucide-react';
import axios from 'axios';
import ExcelJS from 'exceljs';
import useAuthStore from '../../store/authStore';

const TrainerAttendance = () => {
    const navigate = useNavigate();
    const { token, user } = useAuthStore();
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [exportingBatchId, setExportingBatchId] = useState(null);
    const [exportingAll, setExportingAll] = useState(false);

    const fetchBatches = async () => {
        setLoading(true);
        try {
            const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const res = await axios.get(`${baseURL}/trainer/batches`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBatches(res.data.data || []);
        } catch (err) {
            console.error('Failed to load trainer batches', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBatches();
    }, [token]);

    const exportSingleBatch = async (batch) => {
        setExportingBatchId(batch._id);
        try {
            const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const headers = { Authorization: `Bearer ${token}` };

            // 1. Fetch student roster
            const studentsRes = await axios.get(`${baseURL}/admin/batches/${batch._id}/students`, { headers });
            const students = studentsRes.data.data || [];

            // 2. Fetch historic sessions
            const sessionsRes = await axios.get(`${baseURL}/attendance/batch/${batch._id}`, { headers });
            const sessionsList = sessionsRes.data.data || [];

            const workbook = new ExcelJS.Workbook();
            workbook.creator = 'Ethnotech Academy';
            workbook.created = new Date();

            const chronologicalSessions = [...sessionsList].sort((a, b) => new Date(a.date) - new Date(b.date));

            // --- SHEET 1: Summary Logs ---
            const summarySheet = workbook.addWorksheet('Summary Logs');
            // Heading
            summarySheet.addRow([`Batch Attendance Summary — ${batch.batchName}`]);
            summarySheet.getRow(1).font = { bold: true, size: 14, color: { argb: 'FF004AAD' } };
            summarySheet.mergeCells(1, 1, 1, 7);
            summarySheet.getRow(1).height = 28;

            const trainerName = batch.trainerId 
                ? `${batch.trainerId.firstName || ''} ${batch.trainerId.lastName || ''}`.trim() 
                : (user?.firstName || user?.name || '');
            const metadataText = `College: ${batch.collegeId?.name || '—'}   |   Course: ${batch.courseId?.name || '—'}   |   Department: ${batch.department || '—'}${trainerName ? `   |   Trainer: ${trainerName}` : ''}   |   Generated: ${new Date().toLocaleDateString('en-IN')}`;

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

            registerSheet.addRow([`Student Attendance Register — ${batch.batchName}`]);
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

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const safeName = (batch.batchName || 'Batch').replace(/[^a-zA-Z0-9]/g, '_');
            a.setAttribute('download', `Batch_Attendance_${safeName}_${new Date().toISOString().slice(0, 10)}.xlsx`);
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Export failed', err);
            alert('Failed to export batch attendance.');
        } finally {
            setExportingBatchId(null);
        }
    };

    const exportAllBatches = async () => {
        if (batches.length === 0) return;
        setExportingAll(true);
        try {
            const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const headers = { Authorization: `Bearer ${token}` };

            const workbook = new ExcelJS.Workbook();
            workbook.creator = 'Ethnotech Academy';
            workbook.created = new Date();

            // --- SHEET 1: Overview ---
            const overviewSheet = workbook.addWorksheet('Batches Overview');
            overviewSheet.addRow([`Trainer Batches Attendance Overview`]);
            overviewSheet.getRow(1).font = { bold: true, size: 14, color: { argb: 'FF004AAD' } };
            overviewSheet.mergeCells(1, 1, 1, 6);
            overviewSheet.getRow(1).height = 28;

            overviewSheet.addRow([`Generated: ${new Date().toLocaleDateString('en-IN')}`]);
            overviewSheet.getRow(2).font = { size: 10, italic: true, color: { argb: 'FF475569' } };
            overviewSheet.mergeCells(2, 1, 2, 6);
            overviewSheet.getRow(2).height = 20;

            overviewSheet.addRow([]); // Spacer

            const headersOverview = ['S.No', 'Batch Name', 'College', 'Course', 'Department', 'Roster Size'];
            const headerRowOverview = overviewSheet.addRow(headersOverview);
            headerRowOverview.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 10 };
            headerRowOverview.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF004AAD' } };
            headerRowOverview.alignment = { vertical: 'middle', horizontal: 'center' };
            headerRowOverview.height = 28;

            batches.forEach((b, idx) => {
                const row = overviewSheet.addRow([
                    idx + 1,
                    b.batchName || '—',
                    b.collegeId?.name || '—',
                    b.courseId?.name || '—',
                    b.department || '—',
                    b.studentCount || 0
                ]);
                row.alignment = { vertical: 'middle', horizontal: 'center' };
                row.getCell(2).alignment = { vertical: 'middle', horizontal: 'left' };
                row.getCell(3).alignment = { vertical: 'middle', horizontal: 'left' };
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
            });

            overviewSheet.getColumn(1).width = 6;
            overviewSheet.getColumn(2).width = 20;
            overviewSheet.getColumn(3).width = 30;
            overviewSheet.getColumn(4).width = 30;
            overviewSheet.getColumn(5).width = 16;
            overviewSheet.getColumn(6).width = 14;

            // Loop and add sheets for each batch
            for (const batch of batches) {
                // Fetch student roster
                const studentsRes = await axios.get(`${baseURL}/admin/batches/${batch._id}/students`, { headers });
                const students = studentsRes.data.data || [];

                // Fetch historic sessions
                const sessionsRes = await axios.get(`${baseURL}/attendance/batch/${batch._id}`, { headers });
                const sessionsList = sessionsRes.data.data || [];

                const chronologicalSessions = [...sessionsList].sort((a, b) => new Date(a.date) - new Date(b.date));
                const cleanBatchName = (batch.batchName || 'Batch').replace(/[^a-zA-Z0-9]/g, '_').slice(0, 20);

                // Add Summary Sheet
                const summarySheet = workbook.addWorksheet(`${cleanBatchName}_Summary`);
                summarySheet.addRow([`Batch Summary — ${batch.batchName}`]);
                summarySheet.getRow(1).font = { bold: true, size: 14, color: { argb: 'FF004AAD' } };
                summarySheet.mergeCells(1, 1, 1, 7);
                summarySheet.getRow(1).height = 28;

                const trainerName = batch.trainerId 
                    ? `${batch.trainerId.firstName || ''} ${batch.trainerId.lastName || ''}`.trim() 
                    : (user?.firstName || user?.name || '');
                const metadataText = `College: ${batch.collegeId?.name || '—'}   |   Course: ${batch.courseId?.name || '—'}   |   Department: ${batch.department || '—'}${trainerName ? `   |   Trainer: ${trainerName}` : ''}   |   Generated: ${new Date().toLocaleDateString('en-IN')}`;

                summarySheet.addRow([metadataText]);
                summarySheet.getRow(2).font = { size: 10, italic: true, color: { argb: 'FF475569' } };
                summarySheet.mergeCells(2, 1, 2, 7);
                summarySheet.getRow(2).height = 20;

                summarySheet.addRow([]);

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
                });

                summarySheet.getColumn(1).width = 6;
                summarySheet.getColumn(2).width = 16;
                summarySheet.getColumn(3).width = 16;
                summarySheet.getColumn(4).width = 35;
                summarySheet.getColumn(5).width = 14;
                summarySheet.getColumn(6).width = 14;
                summarySheet.getColumn(7).width = 16;

                // Add Register Sheet
                const registerSheet = workbook.addWorksheet(`${cleanBatchName}_Register`);
                registerSheet.addRow([`Student Register — ${batch.batchName}`]);
                registerSheet.getRow(1).font = { bold: true, size: 14, color: { argb: 'FF004AAD' } };
                registerSheet.mergeCells(1, 1, 1, 4 + chronologicalSessions.length + 3);
                registerSheet.getRow(1).height = 28;

                registerSheet.addRow([metadataText]);
                registerSheet.getRow(2).font = { size: 10, italic: true, color: { argb: 'FF475569' } };
                registerSheet.mergeCells(2, 1, 2, 4 + chronologicalSessions.length + 3);
                registerSheet.getRow(2).height = 20;

                registerSheet.addRow([]);

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

                students.forEach((student, sIdx) => {
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
                        sIdx + 1,
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

                    const rowBg = sIdx % 2 === 0 ? 'FFFFFFFF' : 'FFF8FAFC';
                    row.eachCell((cell) => {
                        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: rowBg } };
                        cell.border = {
                            bottom: { style: 'hair', color: { argb: 'FFE2E8F0' } },
                            left: { style: 'hair', color: { argb: 'FFE2E8F0' } },
                            right: { style: 'hair', color: { argb: 'FFE2E8F0' } },
                        };
                    });

                    chronologicalSessions.forEach((s, csIdx) => {
                        const cell = row.getCell(5 + csIdx);
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
            }

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.setAttribute('download', `All_Batches_Attendance_${new Date().toISOString().slice(0, 10)}.xlsx`);
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Export all failed', err);
            alert('Failed to export all batches.');
        } finally {
            setExportingAll(false);
        }
    };

    const filteredBatches = batches.filter(b => 
        b.batchName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.courseId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.collegeId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="animate-spin text-[#004AAD]" size={36} />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in duration-300">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2.5">
                        <CalendarCheck className="text-[#004AAD]" size={28} />
                        Student Attendance
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                        Select a batch below to record new session attendance or manage historic logs.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <button
                        onClick={exportAllBatches}
                        disabled={exportingAll || batches.length === 0}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95 disabled:opacity-50 cursor-pointer w-full sm:w-auto justify-center"
                    >
                        {exportingAll ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                        {exportingAll ? 'Exporting All...' : 'Export All Batches'}
                    </button>

                    <div className="relative w-full md:w-80 flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text"
                            placeholder="Search batches..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:border-[#004AAD] outline-none font-medium shadow-sm transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Batches list */}
            {filteredBatches.length === 0 ? (
                <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl">
                    <Users className="mx-auto text-slate-400 mb-3" size={40} />
                    <p className="font-semibold text-slate-700 text-sm">No batches found</p>
                    <p className="text-xs text-slate-400 mt-1">You must be assigned to batches by an administrator to take attendance.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBatches.map(batch => (
                        <div key={batch._id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                            <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-50 text-[#004AAD] rounded-xl flex items-center justify-center font-bold text-sm border border-blue-100 shadow-inner group-hover:scale-105 transition-transform">
                                            <Layers size={18} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800 text-sm group-hover:text-[#004AAD] transition-colors">{batch.batchName}</h3>
                                            <span className="text-[10px] text-slate-400 font-semibold uppercase">{batch.program || 'EWDP'}</span>
                                        </div>
                                    </div>
                                    <span className="px-2 py-0.5 bg-slate-50 border border-slate-100 text-slate-500 rounded text-[10px] font-bold">
                                        {batch.department || 'GEN'}
                                    </span>
                                </div>

                                <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <BookOpen size={14} className="text-slate-400 shrink-0" />
                                        <span className="truncate font-medium">{batch.courseId?.name || 'No Course Mapped'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                                        <Users size={14} className="text-slate-400 shrink-0" />
                                        <span>Roster Size: <strong className="text-slate-700">{batch.studentCount || 0} students</strong></span>
                                    </div>
                                    <div className="text-[10px] text-slate-400 mt-1 truncate">
                                        College: <span className="font-semibold text-slate-600">{batch.collegeId?.name || '—'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-[1fr_auto] gap-2 mt-5 pt-3 border-t border-slate-100">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => navigate(`/trainer/attendance/history/${batch._id}`)}
                                        className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-600 rounded-xl text-xs font-bold transition-all text-center"
                                    >
                                        Logs
                                    </button>
                                    <button
                                        onClick={() => navigate(`/trainer/attendance/mark/${batch._id}`)}
                                        className="flex-1 py-2.5 bg-[#004AAD] hover:bg-[#003580] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-md shadow-blue-50 transition-all active:scale-98"
                                    >
                                        Take Attendance <ArrowRight size={12} />
                                    </button>
                                </div>
                                <button
                                    disabled={exportingBatchId === batch._id}
                                    onClick={() => exportSingleBatch(batch)}
                                    className="px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 hover:text-emerald-800 border border-emerald-100 rounded-xl transition-all flex items-center justify-center cursor-pointer shadow-sm disabled:opacity-50"
                                    title="Export Attendance to Excel"
                                >
                                    {exportingBatchId === batch._id ? (
                                        <Loader2 size={16} className="animate-spin text-emerald-600" />
                                    ) : (
                                        <FileSpreadsheet size={16} />
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TrainerAttendance;
