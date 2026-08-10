import { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, X, Loader2, Users, School, BookOpen, Clock, AlertCircle, Download } from 'lucide-react';
import ExcelJS from 'exceljs';
import useAuthStore from '../../store/authStore';
import useCollegeStore from '../../store/collegeStore';
import useSocketUpdate from '../../hooks/useSocketUpdate';
import { AlertModal, ConfirmModal } from '../../components/Modals';

const BatchModal = ({ batch, isOpen, onClose, onSave, colleges, activeCollegeId }) => {
    const { token, user } = useAuthStore();
    const isAdmin = ['super_admin', 'college_admin', 'ops_admin', 'ast_ops_admin', 'regional_manager', 'asst_rm'].includes(user?.role);

    const [formData, setFormData] = useState({
        collegeId: '',
        courseId: '',
        trainerId: '',
        batchName: '',
        department: '',
        program: '',
        startDate: '',
        endDate: ''
    });
    const [courses, setCourses] = useState([]);
    const [trainers, setTrainers] = useState([]);
    const [loadingCourses, setLoadingCourses] = useState(false);
    const [loadingTrainers, setLoadingTrainers] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (batch) {
            setFormData({
                collegeId: batch.collegeId?._id || batch.collegeId || activeCollegeId || '',
                courseId: batch.courseId?._id || batch.courseId || '',
                trainerId: batch.trainerId?._id || batch.trainerId || '',
                batchName: batch.batchName || '',
                department: batch.department || '',
                program: batch.program || '',
                startDate: batch.startDate ? new Date(batch.startDate).toISOString().split('T')[0] : '',
                endDate: batch.endDate ? new Date(batch.endDate).toISOString().split('T')[0] : ''
            });
        } else {
            setFormData({
                collegeId: activeCollegeId || (colleges.length > 0 ? colleges[0]._id : ''),
                courseId: '',
                trainerId: '',
                batchName: '',
                department: '',
                program: '',
                startDate: '',
                endDate: ''
            });
        }
    }, [batch, isOpen, colleges, activeCollegeId]);

    // Fetch courses when selected college changes
    useEffect(() => {
        if (!formData.collegeId) {
            setCourses([]);
            return;
        }
        
        setLoadingCourses(true);
        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/colleges/${formData.collegeId}/courses`, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
            setCourses(res.data.data || []);
            // Pre-select first course if editing none or not populated yet
            if (batch && batch.collegeId?._id === formData.collegeId) {
                setFormData(prev => ({ ...prev, courseId: batch.courseId?._id || batch.courseId || '' }));
            } else {
                setFormData(prev => ({ ...prev, courseId: '' }));
            }
        }).catch(err => {
            console.error(err);
        }).finally(() => {
            setLoadingCourses(false);
        });
    }, [formData.collegeId, token, batch]);

    // Fetch trainers when collegeId or courseId changes (only for admin)
    useEffect(() => {
        if (!isAdmin || !formData.collegeId) {
            setTrainers([]);
            return;
        }

        setLoadingTrainers(true);
        const url = formData.courseId
            ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/colleges/${formData.collegeId}/courses/${formData.courseId}/trainers`
            : `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/trainers?collegeId=${formData.collegeId}`;

        axios.get(url, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
            const dataList = res.data.data || [];
            const activeTrainers = formData.courseId
                ? dataList.map(m => m.trainerId).filter(Boolean)
                : dataList;
            setTrainers(activeTrainers);
            
            // Pre-select first trainer or current editing batch trainer
            if (batch && batch.collegeId?._id === formData.collegeId && (!formData.courseId || batch.courseId?._id === formData.courseId)) {
                setFormData(prev => ({ ...prev, trainerId: batch.trainerId?._id || batch.trainerId || '' }));
            } else {
                setFormData(prev => ({ 
                    ...prev, 
                    trainerId: activeTrainers.some(t => t._id === prev.trainerId) ? prev.trainerId : '' 
                }));
            }
        }).catch(err => {
            console.error('Failed to fetch trainers', err);
        }).finally(() => {
            setLoadingTrainers(false);
        });
    }, [formData.collegeId, formData.courseId, token, batch, isAdmin]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        
        const payload = {
            collegeId: formData.collegeId,
            courseId: formData.courseId,
            batchName: formData.batchName,
            department: formData.department
        };
        
        if (isAdmin) {
            payload.trainerId = formData.trainerId;
            payload.program = formData.program || undefined;
            payload.startDate = formData.startDate || undefined;
            payload.endDate = formData.endDate || undefined;
        }
        
        await onSave(payload);
        setSubmitting(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
            <div className="bg-white max-w-lg w-full rounded-xl shadow-2xl relative z-10 border border-slate-200 animate-in zoom-in-95 duration-150">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900 text-lg">{batch ? 'Edit Batch Template' : 'Add Batch Template'}</h3>
                    <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400"><X size={18} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                    {/* College selector */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">College Context *</label>
                        <select 
                            required
                            disabled={!!activeCollegeId}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none disabled:opacity-60"
                            value={formData.collegeId}
                            onChange={(e) => setFormData({...formData, collegeId: e.target.value, courseId: '', trainerId: ''})}
                        >
                            <option value="">Choose College</option>
                            {colleges.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                        </select>
                    </div>

                    {/* Course selector */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Course Name (Optional)</label>
                        <select 
                            disabled={loadingCourses}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none disabled:opacity-60"
                            value={formData.courseId}
                            onChange={(e) => setFormData({...formData, courseId: e.target.value, trainerId: ''})}
                        >
                            <option value="">{loadingCourses ? 'Loading Courses...' : courses.length === 0 ? 'No courses active' : 'Choose Course'}</option>
                            {courses.map(c => <option key={c._id} value={c._id}>{c.name} ({c.code})</option>)}
                        </select>
                    </div>

                    {/* Trainer selector (Admin only) */}
                    {isAdmin && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Trainer (Optional)</label>
                            <select 
                                disabled={loadingTrainers}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none disabled:opacity-60"
                                value={formData.trainerId}
                                onChange={(e) => setFormData({...formData, trainerId: e.target.value})}
                            >
                                <option value="">{loadingTrainers ? 'Loading Trainers...' : trainers.length === 0 ? (formData.courseId ? 'No trainers mapped to this course' : 'No trainers mapped to this college') : 'Choose Trainer'}</option>
                                {trainers.map(t => <option key={t._id} value={t._id}>{`${t.firstName || ''} ${t.lastName || ''}`.trim() || t.username}</option>)}
                            </select>
                        </div>
                    )}

                    {/* Batch Name & Department */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Batch Name *</label>
                            <input 
                                required
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none"
                                value={formData.batchName}
                                onChange={(e) => setFormData({...formData, batchName: e.target.value})}
                                placeholder="e.g. Batch 1"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Department *</label>
                            <input 
                                required
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none"
                                value={formData.department}
                                onChange={(e) => setFormData({...formData, department: e.target.value})}
                                placeholder="e.g. CSE"
                            />
                        </div>
                    </div>

                    {/* ERP and Schedule Options (Admin only) */}
                    {isAdmin && (
                        <div className="space-y-4 border-t border-slate-100 pt-3">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">ERP / Schedule Details (Optional)</h4>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Program</label>
                                <select 
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none"
                                    value={formData.program}
                                    onChange={(e) => setFormData({...formData, program: e.target.value})}
                                >
                                    <option value="">No Program Selected</option>
                                    <option value="EWDP">EWDP</option>
                                    <option value="CFS">CFS</option>
                                    <option value="PMKVY">PMKVY</option>
                                    <option value="CMKKY">CMKKY</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                                    <input 
                                        type="date"
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                                    <input 
                                        type="date"
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="pt-3 flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-50 active:scale-95 transition-all">Cancel</button>
                        <button type="submit" disabled={submitting} className="flex-1 py-2.5 bg-[#004AAD] text-white rounded-lg text-sm font-semibold hover:bg-[#003580] disabled:opacity-50 active:scale-95 transition-all flex items-center justify-center gap-2">{submitting && <Loader2 size={16} className="animate-spin" />}{batch ? 'Save Changes' : 'Create Batch'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Batches = () => {
    const { token, user } = useAuthStore();
    const { selectedCollegeId } = useCollegeStore();
    const isAdmin = ['super_admin', 'college_admin', 'ops_admin', 'ast_ops_admin', 'regional_manager', 'asst_rm', 'placement'].includes(user?.role);
    const isReadOnly = ['regional_manager', 'asst_rm', 'placement'].includes(user?.role);
    const location = useLocation();
    const [batches, setBatches] = useState([]);
    const [colleges, setColleges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [alertState, setAlertState] = useState({ isOpen: false, title: '', message: '', type: 'info' });
    const [confirmState, setConfirmState] = useState({ isOpen: false, title: '', message: '', onConfirm: () => {} });
    const [exportingAllRosters, setExportingAllRosters] = useState(false);

    const exportAllBatchesRosters = async () => {
        if (filteredBatches.length === 0) {
            alert('No batches to export.');
            return;
        }
        setExportingAllRosters(true);
        try {
            const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const headers = { Authorization: `Bearer ${token}` };

            const workbook = new ExcelJS.Workbook();
            workbook.creator = 'Ethnotech Academy';
            workbook.created = new Date();

            // --- SHEET 1: Overview ---
            const overviewSheet = workbook.addWorksheet('Rosters Overview');
            overviewSheet.addRow([`Trainer Batches Roster Overview`]);
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

            const allBatchesData = [];
            for (const b of filteredBatches) {
                const studentsRes = await axios.get(`${baseURL}/admin/batches/${b._id}/students`, { headers });
                const batchStudents = studentsRes.data.data || [];
                allBatchesData.push({
                    batch: b,
                    students: batchStudents
                });
            }

            allBatchesData.forEach((item, idx) => {
                const b = item.batch;
                const row = overviewSheet.addRow([
                    idx + 1,
                    b.batchName || '—',
                    b.collegeId?.name || '—',
                    b.courseId?.name || '—',
                    b.department || '—',
                    item.students.length
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

            for (const item of allBatchesData) {
                const b = item.batch;
                const batchStudents = item.students;
                const cleanBatchName = (b.batchName || 'Batch').replace(/[^a-zA-Z0-9]/g, '_').slice(0, 20);
                const sheet = workbook.addWorksheet(`${cleanBatchName}_Roster`);

                // 1. Title Row
                sheet.addRow([`Student Roster — ${b.batchName || 'Batch'}`]);
                sheet.getRow(1).font = { bold: true, size: 14, color: { argb: 'FF004AAD' } };
                sheet.mergeCells(1, 1, 1, 9);
                sheet.getRow(1).height = 28;

                // 2. Metadata Row
                const trainerName = b.trainerId 
                    ? `${b.trainerId.firstName || ''} ${b.trainerId.lastName || ''}`.trim() 
                    : 'Unassigned';
                const metadataText = `College: ${b.collegeId?.name || '—'}   |   Course: ${b.courseId?.name || '—'}   |   Department: ${b.department || '—'}${trainerName ? `   |   Trainer: ${trainerName}` : ''}   |   Generated: ${new Date().toLocaleDateString('en-IN')}`;
                sheet.addRow([metadataText]);
                sheet.getRow(2).font = { size: 10, italic: true, color: { argb: 'FF475569' } };
                sheet.mergeCells(2, 1, 2, 9);
                sheet.getRow(2).height = 20;

                sheet.addRow([]); // Spacer

                // 3. Headers
                const excelHeaders = ['S.No', 'Student Name', 'USN', 'Department', 'Semester', 'Division', 'Email', 'Mobile', 'Status'];
                const headerRow = sheet.addRow(excelHeaders);
                headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 10 };
                headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF004AAD' } };
                headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
                headerRow.height = 28;

                // 4. Data Rows
                batchStudents.forEach((student, sIdx) => {
                    const row = sheet.addRow([
                        sIdx + 1,
                        student.name || '—',
                        student.usn || '—',
                        student.department || '—',
                        student.semester || '—',
                        student.division || '—',
                        student.email || '—',
                        student.mobile || '—',
                        student.status || 'active'
                    ]);
                    row.alignment = { vertical: 'middle', horizontal: 'center' };
                    row.getCell(2).alignment = { vertical: 'middle', horizontal: 'left' };
                    row.getCell(3).alignment = { vertical: 'middle', horizontal: 'left' };
                    row.getCell(3).font = { name: 'Inter', size: 10 };
                    row.getCell(7).alignment = { vertical: 'middle', horizontal: 'left' };
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
                });

                sheet.getColumn(1).width = 6;
                sheet.getColumn(2).width = 28;
                sheet.getColumn(3).width = 18;
                sheet.getColumn(4).width = 14;
                sheet.getColumn(5).width = 12;
                sheet.getColumn(6).width = 12;
                sheet.getColumn(7).width = 28;
                sheet.getColumn(8).width = 18;
                sheet.getColumn(9).width = 12;
            }

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.setAttribute('download', `All_Batches_Rosters_${new Date().toISOString().slice(0, 10)}.xlsx`);
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(downloadUrl);
        } catch (err) {
            console.error('Export all rosters failed', err);
            alert('Failed to export all batch rosters.');
        } finally {
            setExportingAllRosters(false);
        }
    };

    const urlCollegeMatch = location.pathname.match(/\/college\/([a-f0-9]+)/);
    const urlCollegeId = urlCollegeMatch ? urlCollegeMatch[1] : null;
    const activeCollegeId = urlCollegeId || selectedCollegeId || user?.collegeId;

    const getBatchDetailLink = (b) => {
        if (user?.role === 'trainer') {
            return `/trainer/batches/${b._id}`;
        }
        return urlCollegeId 
            ? `/college/${urlCollegeId}/admin/batches/${b._id}` 
            : `/admin/batches/${b._id}`;
    };

    const [filterCollegeId, setFilterCollegeId] = useState(activeCollegeId || '');
    const [filterTrainerId, setFilterTrainerId] = useState('');
    const [trainersList, setTrainersList] = useState([]);
    const [sortBy, setSortBy] = useState('');

    // Sync college context on mount/change
    useEffect(() => {
        if (activeCollegeId) setFilterCollegeId(activeCollegeId);
    }, [activeCollegeId]);

    // Fetch trainers when college filter changes
    useEffect(() => {
        if (isAdmin) {
            const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const url = filterCollegeId 
                ? `${baseURL}/admin/trainers?collegeId=${filterCollegeId}`
                : `${baseURL}/admin/trainers`;
            axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => {
                setTrainersList(res.data.data || []);
            }).catch(err => console.error('Failed to fetch trainers', err));
        }
    }, [filterCollegeId, token, user]);

    useEffect(() => {
        fetchColleges();
        fetchBatches();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, filterCollegeId, selectedCollegeId]);
    
    useSocketUpdate(() => {
        fetchColleges();
        fetchBatches();
    }, ['colleges', 'courses']);

    const fetchColleges = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/colleges`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setColleges(res.data.data || []);
        } catch (e) {
            console.error('Failed to fetch colleges', e);
        }
    };

    const fetchBatches = async () => {
        setLoading(true);
        try {
            const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const targetCollege = filterCollegeId || 'all';
            const url = isAdmin
                ? `${baseURL}/admin/colleges/${targetCollege}/batches`
                : `${baseURL}/trainer/batches${selectedCollegeId ? `?collegeId=${selectedCollegeId}` : ''}`;
            const res = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBatches(res.data.data || []);
        } catch (e) {
            console.error('Failed to fetch batches', e);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (data) => {
        try {
            const isAdmin = ['super_admin', 'college_admin', 'ops_admin', 'ast_ops_admin', 'regional_manager', 'asst_rm'].includes(user?.role);
            const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const headers = { Authorization: `Bearer ${token}` };

            if (selectedBatch) {
                const url = isAdmin 
                    ? `${baseURL}/admin/batches/${selectedBatch._id}`
                    : `${baseURL}/trainer/batches/${selectedBatch._id}`;
                await axios.put(url, data, { headers });
            } else {
                const url = isAdmin
                    ? (data.courseId
                        ? `${baseURL}/admin/colleges/${data.collegeId}/courses/${data.courseId}/batches`
                        : `${baseURL}/admin/colleges/${data.collegeId}/batches`)
                    : `${baseURL}/trainer/batches`;
                await axios.post(url, data, { headers });
            }
            setIsModalOpen(false);
            fetchBatches();
        } catch (error) {
            setAlertState({
                isOpen: true,
                title: 'Action Failed',
                message: error.response?.data?.error || 'Failed to save batch template.',
                type: 'error'
            });
        }
    };

    const handleDelete = async (id) => {
        setConfirmState({
            isOpen: true,
            title: 'Delete Batch Template',
            message: 'Are you sure you want to delete this batch template?',
            onConfirm: async () => {
                try {
                    const isAdmin = ['super_admin', 'college_admin', 'ops_admin', 'ast_ops_admin', 'regional_manager', 'asst_rm'].includes(user?.role);
                    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                    const headers = { Authorization: `Bearer ${token}` };
                    const url = isAdmin
                        ? `${baseURL}/admin/batches/${id}`
                        : `${baseURL}/trainer/batches/${id}`;
                    
                    await axios.delete(url, { headers });
                    fetchBatches();
                } catch (error) {
                    setAlertState({
                        isOpen: true,
                        title: 'Action Failed',
                        message: error.response?.data?.error || 'Delete failed.',
                        type: 'error'
                    });
                }
            }
        });
    };

    const filteredBatches = batches.filter(b => {
        const matchSearch = b.batchName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
            b.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.collegeId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.courseId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            `${b.trainerId?.firstName || ''} ${b.trainerId?.lastName || ''}`.toLowerCase().includes(searchTerm.toLowerCase());

        const matchCollege = !filterCollegeId || (b.collegeId?._id || b.collegeId) === filterCollegeId;
        const matchTrainer = !filterTrainerId || (b.trainerId?._id || b.trainerId) === filterTrainerId;

        return matchSearch && matchCollege && matchTrainer;
    });

    const sortedBatches = [...filteredBatches].sort((a, b) => {
        if (sortBy === 'name_asc') {
            return (a.batchName || '').localeCompare(b.batchName || '');
        }
        if (sortBy === 'name_desc') {
            return (b.batchName || '').localeCompare(a.batchName || '');
        }
        if (sortBy === 'date_desc') {
            const dateA = a.startDate ? new Date(a.startDate) : new Date(0);
            const dateB = b.startDate ? new Date(b.startDate) : new Date(0);
            return dateB - dateA;
        }
        if (sortBy === 'date_asc') {
            const dateA = a.startDate ? new Date(a.startDate) : new Date(8640000000000000);
            const dateB = b.startDate ? new Date(b.startDate) : new Date(8640000000000000);
            return dateA - dateB;
        }
        if (sortBy === 'program_asc') {
            return (a.program || '').localeCompare(b.program || '');
        }
        if (sortBy === 'dept_asc') {
            return (a.department || '').localeCompare(b.department || '');
        }
        return 0;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        {user?.role === 'trainer' ? 'My Batch Templates' : 'Batch Templates'}
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        {user?.role === 'trainer' 
                            ? 'Pre-configure and manage batch schedules to speed up daily logs' 
                            : 'Monitor and manage pre-configured batch templates'}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={exportAllBatchesRosters}
                        disabled={exportingAllRosters}
                        className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold flex items-center gap-2 px-5 py-2.5 text-sm transition-all active:scale-95 disabled:opacity-50 cursor-pointer shadow-sm shrink-0"
                        title="Export All Batches Rosters"
                    >
                        {exportingAllRosters ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                        Export All
                    </button>
                    {isAdmin && !isReadOnly && (
                        <button 
                            onClick={() => { setSelectedBatch(null); setIsModalOpen(true); }} 
                            className="flex items-center gap-2 px-5 py-2.5 bg-[#004AAD] text-white text-sm font-semibold rounded-lg hover:bg-[#003580] shadow-sm active:scale-95 transition-all shrink-0"
                        >
                            <Plus size={16} /> Add Batch Template
                        </button>
                    )}
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
                        <input 
                            type="text" 
                            placeholder="Search batches..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                            className="px-4 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:border-[#004AAD] outline-none max-w-sm flex-1 sm:flex-initial" 
                        />
                        
                        {isAdmin && (
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                {activeCollegeId ? (
                                    <div className="flex items-center gap-2 bg-blue-50 text-[#004AAD] border border-blue-100 rounded-lg px-3.5 py-2 text-xs font-bold shadow-sm max-w-[240px] truncate">
                                        <School size={14} className="text-[#004AAD] shrink-0" />
                                        <span className="truncate">
                                            {colleges.find(c => c._id === activeCollegeId)?.name || 'Loading College...'}
                                        </span>
                                    </div>
                                ) : (
                                    user?.role === 'super_admin' && (
                                        <select
                                            value={filterCollegeId}
                                            onChange={(e) => {
                                                setFilterCollegeId(e.target.value);
                                                setFilterTrainerId('');
                                            }}
                                            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 outline-none focus:border-[#004AAD] text-slate-600 font-semibold cursor-pointer min-w-[160px]"
                                        >
                                            <option value="">All Colleges</option>
                                            {colleges.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                        </select>
                                    )
                                )}
                                
                                <select
                                    value={filterTrainerId}
                                    onChange={(e) => setFilterTrainerId(e.target.value)}
                                    className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 outline-none focus:border-[#004AAD] text-slate-600 font-semibold cursor-pointer min-w-[160px]"
                                >
                                    <option value="">All Trainers</option>
                                    {trainersList.map(t => (
                                        <option key={t._id} value={t._id}>
                                            {`${t.firstName || ''} ${t.lastName || ''}`.trim() || t.username}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 outline-none focus:border-[#004AAD] text-slate-600 font-semibold cursor-pointer min-w-[160px]"
                        >
                            <option value="">Sort by: Default</option>
                            <option value="name_asc">Name (A-Z)</option>
                            <option value="name_desc">Name (Z-A)</option>
                            <option value="date_desc">Start Date (Newest)</option>
                            <option value="date_asc">Start Date (Oldest)</option>
                            <option value="program_asc">Program (A-Z)</option>
                            <option value="dept_asc">Department (A-Z)</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-[#004AAD]" size={32} /></div>
                ) : sortedBatches.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
                        <AlertCircle className="text-slate-300" size={32} />
                        No batches found.
                    </div>
                ) : (
                    <div>
                        {/* Table View (Desktop & Tablet) */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-600 text-xs font-bold uppercase">
                                        <th className="p-4">Batch Name</th>
                                        {user?.role !== 'trainer' && <th className="p-4">Trainer</th>}
                                        <th className="p-4">College</th>
                                        <th className="p-4">Course</th>
                                        <th className="p-4">Department</th>
                                        {(user?.role === 'trainer' || isAdmin) && <th className="p-4 text-center">Actions</th>}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm">
                                    {sortedBatches.map((b) => (
                                        <tr key={b._id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="p-4">
                                                <div className="flex flex-col">
                                                    {(isAdmin || user?.role === 'trainer') ? (
                                                        <Link to={getBatchDetailLink(b)} className="font-semibold text-[#004AAD] hover:underline cursor-pointer">
                                                            {b.batchName}
                                                        </Link>
                                                    ) : (
                                                        <span className="font-semibold text-slate-800">{b.batchName}</span>
                                                    )}
                                                    {b.program && (
                                                        <div className="flex items-center gap-1.5 mt-1">
                                                            <span className="text-[10px] bg-blue-50 text-[#004AAD] px-2 py-0.5 rounded-full font-bold border border-blue-100/50">{b.program}</span>
                                                            {b.startDate && (
                                                                <span className="text-[10px] text-slate-400 font-medium">
                                                                    {new Date(b.startDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})} - {b.endDate ? new Date(b.endDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'}) : 'TBD'}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            {user?.role !== 'trainer' && (
                                                <td className="p-4 text-slate-700 font-semibold">
                                                    {b.trainerId ? `${b.trainerId.firstName || ''} ${b.trainerId.lastName || ''}`.trim() || b.trainerId.username : '—'}
                                                </td>
                                            )}
                                            <td className="p-4 text-slate-600 font-medium">{b.collegeId?.name || '—'}</td>
                                            <td className="p-4 text-slate-600">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-slate-700">{b.courseId?.name || '—'}</span>
                                                    <span className="text-xs text-slate-400">{b.courseId?.code || '—'}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-slate-600">{b.department}</td>
                                            {(user?.role === 'trainer' || isAdmin) && (
                                                <td className="p-4 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Link to={getBatchDetailLink(b)} className="p-2 text-slate-400 hover:text-[#004AAD] hover:bg-blue-50 rounded-lg transition-colors" title="View Student Roster">
                                                            <Users size={15} />
                                                        </Link>
                                                        {isAdmin && !isReadOnly && (
                                                            <>
                                                                <button onClick={() => { setSelectedBatch(b); setIsModalOpen(true); }} className="p-2 text-slate-400 hover:text-[#004AAD] hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={15} /></button>
                                                                <button onClick={() => handleDelete(b._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={15} /></button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="md:hidden divide-y divide-slate-100">
                            {sortedBatches.map((b) => (
                                <div key={b._id} className="p-4 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            {(isAdmin || user?.role === 'trainer') ? (
                                                <Link to={getBatchDetailLink(b)} className="font-bold text-[#004AAD] hover:underline cursor-pointer block">
                                                    {b.batchName}
                                                </Link>
                                            ) : (
                                                <h4 className="font-bold text-slate-900">{b.batchName}</h4>
                                            )}
                                            <div className="flex flex-wrap gap-1.5 mt-1">
                                                <span className="inline-block text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">DEPT: {b.department}</span>
                                                {b.program && (
                                                    <span className="inline-block text-[10px] bg-blue-50 text-[#004AAD] px-2 py-0.5 rounded-full font-bold border border-blue-100/50">{b.program}</span>
                                                )}
                                            </div>
                                        </div>
                                        {(user?.role === 'trainer' || isAdmin) && (
                                            <div className="flex items-center gap-1">
                                                <Link to={getBatchDetailLink(b)} className="p-2 text-slate-400 hover:text-[#004AAD] hover:bg-blue-50 rounded-lg" title="View Student Roster">
                                                    <Users size={15} />
                                                </Link>
                                                {isAdmin && !isReadOnly && (
                                                    <>
                                                        <button onClick={() => { setSelectedBatch(b); setIsModalOpen(true); }} className="p-2 text-slate-400 hover:text-[#004AAD] hover:bg-blue-50 rounded-lg"><Edit2 size={15} /></button>
                                                        <button onClick={() => handleDelete(b._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={15} /></button>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                        <div>
                                            <span className="block font-bold text-slate-400 text-[10px] uppercase">College</span>
                                            <span className="font-medium text-slate-700">{b.collegeId?.name || '—'}</span>
                                        </div>
                                        <div>
                                            <span className="block font-bold text-slate-400 text-[10px] uppercase">Course</span>
                                            <span className="font-medium text-slate-700">{b.courseId?.name || '—'}</span>
                                            <span className="text-[10px] text-slate-400 block">({b.courseId?.code || '—'})</span>
                                        </div>
                                        {b.startDate && (
                                            <div className="col-span-2 mt-1.5 pt-1.5 border-t border-slate-200/60">
                                                <span className="block font-bold text-slate-400 text-[10px] uppercase">Schedule / Duration</span>
                                                <span className="font-semibold text-slate-700">
                                                    {new Date(b.startDate).toLocaleDateString(undefined, {dateStyle: 'medium'})} to {b.endDate ? new Date(b.endDate).toLocaleDateString(undefined, {dateStyle: 'medium'}) : 'TBD'}
                                                </span>
                                            </div>
                                        )}
                                        {user?.role !== 'trainer' && (
                                            <div className="col-span-2 mt-1.5 pt-1.5 border-t border-slate-200/60">
                                                <span className="block font-bold text-slate-400 text-[10px] uppercase">Trainer</span>
                                                <span className="font-semibold text-slate-800">{b.trainerId ? `${b.trainerId.firstName || ''} ${b.trainerId.lastName || ''}`.trim() || b.trainerId.username : '—'}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <BatchModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                batch={selectedBatch}
                colleges={colleges}
                activeCollegeId={activeCollegeId}
            />

            <AlertModal
                isOpen={alertState.isOpen}
                onClose={() => setAlertState(prev => ({ ...prev, isOpen: false }))}
                title={alertState.title}
                message={alertState.message}
                type={alertState.type}
            />

            <ConfirmModal
                isOpen={confirmState.isOpen}
                onClose={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
                title={confirmState.title}
                message={confirmState.message}
                onConfirm={confirmState.onConfirm}
            />
        </div>
    );
};

export default Batches;
