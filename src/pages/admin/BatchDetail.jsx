import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { 
    Layers, BookOpen, Users, Phone, Mail, Edit2, Trash2, ArrowLeft, Loader2,
    Download, Upload, AlertTriangle, AlertCircle, FileSpreadsheet, Plus, X, RefreshCw, CheckCircle2,
    Search, Key, Calendar, ExternalLink
} from 'lucide-react';
import axios from 'axios';
import ExcelJS from 'exceljs';
import useAuthStore from '../../store/authStore';
import useSocketUpdate from '../../hooks/useSocketUpdate';
import { AlertModal } from '../../components/Modals';

// ─── Student Modal ────────────────────────────────────────────────────────────
const StudentModal = ({ student, isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: '', usn: '', email: '', mobile: '', semester: '', department: '', division: '', status: 'active', cgpa: '', backlogs: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setError('');
        if (student) {
            setFormData({
                name: student.name || '',
                usn: student.usn || '',
                email: student.email || '',
                mobile: student.mobile || '',
                semester: student.semester || '',
                department: student.department || '',
                division: student.division || '',
                status: student.status || 'active',
                cgpa: student.cgpa !== undefined ? student.cgpa : '',
                backlogs: student.backlogs !== undefined ? student.backlogs : ''
            });
        } else {
            setFormData({
                name: '', usn: '', email: '', mobile: '', semester: '', department: '', division: '', status: 'active', cgpa: '', backlogs: ''
            });
        }
    }, [student, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!formData.name.trim()) return setError('Name is required');
        if (!formData.usn.trim()) return setError('USN is required');

        setSubmitting(true);
        try {
            await onSave(formData);
            onClose();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to save student details');
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
            <div className="bg-white max-w-lg w-full rounded-2xl shadow-2xl relative z-10 border border-slate-100 animate-in zoom-in-95 duration-150 overflow-hidden">
                <div className="px-6 py-5 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 text-base">{student ? 'Edit Student Details' : 'Register New Student'}</h3>
                    <button onClick={onClose} className="p-1 hover:bg-slate-200/60 rounded-lg text-slate-400"><X size={18} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-xs font-semibold rounded-lg border border-red-100 flex items-center gap-2">
                            <AlertCircle size={14} className="shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Full Name *</label>
                            <input 
                                required
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#004AAD] outline-none text-slate-800 font-semibold"
                                placeholder="e.g. John Doe"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">University Seat Number (USN) *</label>
                            <input 
                                required
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#004AAD] outline-none text-slate-800 uppercase font-bold"
                                placeholder="e.g. 1CIT22CS001"
                                value={formData.usn}
                                onChange={e => setFormData({ ...formData, usn: e.target.value.toUpperCase() })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Email Address</label>
                            <input 
                                type="email"
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#004AAD] outline-none text-slate-800"
                                placeholder="e.g. john@gmail.com"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Mobile Number</label>
                            <input 
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#004AAD] outline-none text-slate-800"
                                placeholder="e.g. 9876543210"
                                value={formData.mobile}
                                onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Semester</label>
                            <input 
                                type="number" min="1" max="8"
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#004AAD] outline-none text-slate-800"
                                placeholder="e.g. 6"
                                value={formData.semester}
                                onChange={e => setFormData({ ...formData, semester: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Department</label>
                            <input 
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#004AAD] outline-none text-slate-800 uppercase"
                                placeholder="e.g. CSE"
                                value={formData.department}
                                onChange={e => setFormData({ ...formData, department: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Division</label>
                            <input 
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#004AAD] outline-none text-slate-800 uppercase"
                                placeholder="e.g. A"
                                value={formData.division}
                                onChange={e => setFormData({ ...formData, division: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">CGPA</label>
                            <input 
                                type="number" step="0.01" min="0" max="10"
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#004AAD] outline-none text-slate-800"
                                placeholder="e.g. 8.5"
                                value={formData.cgpa}
                                onChange={e => setFormData({ ...formData, cgpa: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Active Backlogs</label>
                            <input 
                                type="number" min="0"
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#004AAD] outline-none text-slate-800"
                                placeholder="e.g. 0"
                                value={formData.backlogs}
                                onChange={e => setFormData({ ...formData, backlogs: e.target.value })}
                            />
                        </div>
                    </div>

                    {student && (
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Status</label>
                            <select 
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#004AAD] outline-none text-slate-700 font-semibold"
                                value={formData.status}
                                onChange={e => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    )}

                    <div className="pt-4 flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 py-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50">Cancel</button>
                        <button type="submit" disabled={submitting} className="flex-1 py-3 bg-[#004AAD] text-white rounded-xl text-xs font-extrabold hover:bg-[#003580] disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-md shadow-blue-100">
                            {submitting && <Loader2 size={14} className="animate-spin" />} Save Student
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ─── Main Batch Detail Component ──────────────────────────────────────────────
const BatchDetail = () => {
    const { batchId } = useParams();
    const navigate = useNavigate();
    const { token, user } = useAuthStore();
    const fileInputRef = useRef(null);
    const location = useLocation();
    const isReadOnly = ['regional_manager', 'asst_rm', 'placement'].includes(user?.role);

    const urlCollegeMatch = location.pathname.match(/\/college\/([a-f0-9]+)/);
    const urlCollegeId = urlCollegeMatch ? urlCollegeMatch[1] : null;

    const [batch, setBatch] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modals
    const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [error, setError] = useState('');
    const [alertState, setAlertState] = useState({ isOpen: false, title: '', message: '', type: 'info' });

    // Reset Password States
    const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
    const [resetStudentObj, setResetStudentObj] = useState(null);
    const [newStudentPassword, setNewStudentPassword] = useState('');
    const [resettingPassword, setResettingPassword] = useState(false);

    // Upload & Template States
    const [uploading, setUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState(null);

    // Export States & Functions
    const [exportingRoster, setExportingRoster] = useState(false);

    const exportBatchRoster = async () => {
        if (!batch) return;
        setExportingRoster(true);
        try {
            const workbook = new ExcelJS.Workbook();
            workbook.creator = 'Ethnotech Academy';
            workbook.created = new Date();

            const sheet = workbook.addWorksheet('Student Roster');

            // 1. Title Row
            sheet.addRow([`Student Roster — ${batch.batchName || 'Batch'}`]);
            sheet.getRow(1).font = { bold: true, size: 14, color: { argb: 'FF004AAD' } };
            sheet.mergeCells(1, 1, 1, 11);
            sheet.getRow(1).height = 28;
 
            // 2. Metadata Row
            const trainerName = batch.trainerId 
                ? `${batch.trainerId.firstName || ''} ${batch.trainerId.lastName || ''}`.trim() 
                : 'Unassigned';
            const metadataText = `College: ${batch.collegeId?.name || '—'}   |   Course: ${batch.courseId?.name || '—'}   |   Department: ${batch.department || '—'}${trainerName ? `   |   Trainer: ${trainerName}` : ''}   |   Generated: ${new Date().toLocaleDateString('en-IN')}`;
            sheet.addRow([metadataText]);
            sheet.getRow(2).font = { size: 10, italic: true, color: { argb: 'FF475569' } };
            sheet.mergeCells(2, 1, 2, 11);
            sheet.getRow(2).height = 20;
 
            sheet.addRow([]); // Spacer
 
            // 3. Headers
            const excelHeaders = ['S.No', 'Student Name', 'USN', 'Department', 'Semester', 'Division', 'Email', 'Mobile', 'CGPA', 'Backlogs', 'Status'];
            if (batch.integrationType && batch.integrationType !== 'none') {
                excelHeaders.push('Integration Handle', 'Platform Score');
            }
            const headerRow = sheet.addRow(excelHeaders);
            headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 10 };
            headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF004AAD' } };
            headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
            headerRow.height = 28;
 
            // 4. Data Rows
            students.forEach((s, idx) => {
                const rowData = [
                    idx + 1,
                    s.name || '—',
                    s.usn || '—',
                    s.department || '—',
                    s.semester || '—',
                    s.division || '—',
                    s.email || '—',
                    s.mobile || '—',
                    s.cgpa !== undefined ? s.cgpa : '—',
                    s.backlogs !== undefined ? s.backlogs : '—',
                    s.status || 'active'
                ];
                if (batch.integrationType && batch.integrationType !== 'none') {
                    rowData.push(
                        s.externalHandles?.[batch.integrationType] || '—',
                        s.externalScore || 0
                    );
                }
                const row = sheet.addRow(rowData);
                row.alignment = { vertical: 'middle', horizontal: 'center' };
                row.getCell(2).alignment = { vertical: 'middle', horizontal: 'left' };
                row.getCell(3).alignment = { vertical: 'middle', horizontal: 'left' };
                row.getCell(3).font = { name: 'Inter', size: 10 };
                row.getCell(7).alignment = { vertical: 'middle', horizontal: 'left' };
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
 
            sheet.getColumn(1).width = 6;
            sheet.getColumn(2).width = 28;
            sheet.getColumn(3).width = 18;
            sheet.getColumn(4).width = 14;
            sheet.getColumn(5).width = 12;
            sheet.getColumn(6).width = 12;
            sheet.getColumn(7).width = 28;
            sheet.getColumn(8).width = 18;
            sheet.getColumn(9).width = 10;
            sheet.getColumn(10).width = 10;
            sheet.getColumn(11).width = 12;
            if (batch.integrationType && batch.integrationType !== 'none') {
                sheet.getColumn(12).width = 22;
                sheet.getColumn(13).width = 16;
            }

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const safeName = (batch.batchName || 'Batch').replace(/[^a-zA-Z0-9]/g, '_');
            a.setAttribute('download', `Batch_Roster_${safeName}_${new Date().toISOString().slice(0, 10)}.xlsx`);
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Export roster failed', err);
            alert('Failed to export batch roster.');
        } finally {
            setExportingRoster(false);
        }
    };

    // Import Preview & Staging States
    const [previewList, setPreviewList] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editFormData, setEditFormData] = useState({});

    const validatePreviewList = (list) => {
        const usnCounts = {};
        list.forEach(s => {
            const u = s.usn?.toString()?.trim()?.toUpperCase();
            if (u) {
                usnCounts[u] = (usnCounts[u] || 0) + 1;
            }
        });

        return list.map(s => {
            let error = null;
            if (!s.name?.trim()) {
                error = 'Student name is required';
            } else if (!s.usn?.trim()) {
                error = 'USN is required';
            } else {
                const u = s.usn.trim().toUpperCase();
                if (usnCounts[u] > 1) {
                    error = 'Duplicate USN in preview list';
                } else if (s.originalError && u === s.originalUsn?.toUpperCase()) {
                    error = s.originalError;
                }
            }
            return { ...s, error };
        });
    };

    const handleStartEdit = (index, student) => {
        setEditingIndex(index);
        setEditFormData({ ...student });
    };

    const handleSaveEdit = (index) => {
        if (!editFormData.name?.trim()) {
            setAlertState({
                isOpen: true,
                title: 'Validation Error',
                message: 'Name is required.',
                type: 'error'
            });
            return;
        }
        if (!editFormData.usn?.trim()) {
            setAlertState({
                isOpen: true,
                title: 'Validation Error',
                message: 'USN is required.',
                type: 'error'
            });
            return;
        }

        const updatedList = [...previewList];
        updatedList[index] = { ...editFormData };
        const validatedList = validatePreviewList(updatedList);
        setPreviewList(validatedList);
        setEditingIndex(null);
    };

    const handleCancelEdit = () => {
        setEditingIndex(null);
    };

    const handleRemoveFromPreview = (index) => {
        const updatedList = previewList.filter((_, i) => i !== index);
        setPreviewList(validatePreviewList(updatedList));
        if (editingIndex === index) {
            setEditingIndex(null);
        } else if (editingIndex > index) {
            setEditingIndex(editingIndex - 1);
        }
    };

    const handleAddStudentToPreview = () => {
        const newStudent = {
            name: '',
            usn: '',
            mobile: '',
            email: '',
            semester: '',
            department: '',
            division: '',
            cgpa: '',
            backlogs: '',
            error: 'Name and USN are required',
            originalUsn: '',
            originalError: null
        };
        const updatedList = [...previewList, newStudent];
        setPreviewList(updatedList);
        setEditingIndex(updatedList.length - 1);
        setEditFormData(newStudent);
    };

    const handleConfirmImport = async () => {
        const validatedList = validatePreviewList(previewList);
        const hasErrors = validatedList.some(s => s.error);
        if (hasErrors) {
            setAlertState({
                isOpen: true,
                title: 'Validation Errors',
                message: 'Please resolve or remove all flagged rows before importing.',
                type: 'error'
            });
            return;
        }

        setUploading(true);
        try {
            const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const res = await axios.post(
                `${baseURL}/admin/batches/${batchId}/students/import-list`,
                { students: previewList },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (res.data.success) {
                setAlertState({
                    isOpen: true,
                    title: 'Import Complete',
                    message: `Successfully registered ${res.data.data.created} students inside this batch.`,
                    type: 'success'
                });
                setPreviewList([]);
                fetchStudents();
                fetchBatch();
            }
        } catch (err) {
            setAlertState({
                isOpen: true,
                title: 'Import Failed',
                message: err.response?.data?.error || 'Failed to import roster.',
                type: 'error'
            });
        } finally {
            setUploading(false);
        }
    };

    const handleCancelImport = () => {
        if (window.confirm('Are you sure you want to discard the uploaded roster? All staging edits will be lost.')) {
            setPreviewList([]);
            setEditingIndex(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const fetchBatch = async () => {
        try {
            const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const headers = { Authorization: `Bearer ${token}` };
            const res = await axios.get(`${baseURL}/admin/batches/${batchId}`, { headers });
            setBatch(res.data.data);
        } catch (err) {
            console.error('Error fetching batch metadata:', err);
        }
    };

    const fetchStudents = async () => {
        try {
            const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const headers = { Authorization: `Bearer ${token}` };
            const res = await axios.get(`${baseURL}/admin/batches/${batchId}/students`, { headers });
            setStudents(res.data.data || []);
        } catch (err) {
            console.error('Error fetching students:', err);
        }
    };

    const loadAll = async () => {
        setLoading(true);
        await Promise.all([fetchBatch(), fetchStudents()]);
        setLoading(false);
    };

    useEffect(() => {
        loadAll();
    }, [batchId, token]);



    useSocketUpdate(() => {
        fetchBatch();
        fetchStudents();
    }, ['batches', 'students']);

    const handleSaveStudent = async (data) => {
        const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const headers = { Authorization: `Bearer ${token}` };

        if (selectedStudent) {
            await axios.put(`${baseURL}/admin/batches/${batchId}/students/${selectedStudent._id}`, data, { headers });
        } else {
            await axios.post(`${baseURL}/admin/batches/${batchId}/students`, data, { headers });
        }
        fetchStudents();
        fetchBatch(); // Update roster count
    };

    const handleDeleteStudent = async (studentId) => {
        if (!window.confirm('Are you sure you want to remove this student from this batch?')) return;
        try {
            const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const headers = { Authorization: `Bearer ${token}` };
            await axios.delete(`${baseURL}/admin/batches/${batchId}/students/${studentId}`, { headers });
            fetchStudents();
            fetchBatch();
        } catch (err) {
            setAlertState({
                isOpen: true,
                title: 'Action Failed',
                message: err.response?.data?.error || 'Failed to remove student',
                type: 'error'
            });
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!newStudentPassword.trim() || newStudentPassword.length < 4) {
            setAlertState({
                isOpen: true,
                title: 'Validation Error',
                message: 'Password must be at least 4 characters.',
                type: 'error'
            });
            return;
        }
        setResettingPassword(true);
        try {
            const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            await axios.post(`${baseURL}/admin/batches/${batchId}/students/${resetStudentObj._id}/reset-password`, {
                newPassword: newStudentPassword
            }, { headers: { Authorization: `Bearer ${token}` } });
            
            setIsResetPasswordOpen(false);
            setNewStudentPassword('');
            setAlertState({
                isOpen: true,
                title: 'Password Overridden',
                message: `Password overridden successfully for ${resetStudentObj.name}.`,
                type: 'success'
            });
        } catch (err) {
            setAlertState({
                isOpen: true,
                title: 'Reset Failed',
                message: err.response?.data?.error || 'Failed to reset password',
                type: 'error'
            });
        } finally {
            setResettingPassword(false);
        }
    };

    const handleDownloadTemplate = async () => {
        try {
            const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const res = await axios.get(`${baseURL}/admin/batches/${batchId}/students/template`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const a = document.createElement('a');
            a.href = url;
            a.setAttribute('download', `student_import_template_${batch?.batchName || 'batch'}.xlsx`);
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (err) {
            setAlertState({
                isOpen: true,
                title: 'Action Failed',
                message: 'Failed to download template',
                type: 'error'
            });
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setUploadResult(null);
        setError('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const res = await axios.post(
                `${baseURL}/admin/batches/${batchId}/students/parse`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            if (res.data.success) {
                const parsed = res.data.data || [];
                setPreviewList(validatePreviewList(parsed));
            }
            if (fileInputRef.current) fileInputRef.current.value = '';
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to parse student spreadsheet');
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="animate-spin text-[#004AAD]" size={36} />
            </div>
        );
    }

    if (!batch) {
        return (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
                <AlertTriangle className="mx-auto text-red-500 mb-2" size={32} />
                <p className="font-semibold text-slate-700">Batch Not Found</p>
                <button 
                    onClick={() => navigate(urlCollegeId ? `/college/${urlCollegeId}/admin/batches` : '/admin/colleges')} 
                    className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm"
                >
                    {urlCollegeId ? 'Back to College Batches' : 'Back to Institutions'}
                </button>
            </div>
        );
    }

    const filteredStudents = students.filter(s =>
        s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.usn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.department?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in duration-300">
            {/* Back to College */}
            <div className="flex flex-col gap-4">
                <Link 
                    to={user?.role === 'trainer' ? '/trainer/batches' : (urlCollegeId ? `/college/${urlCollegeId}/admin/batches` : `/admin/colleges/${batch.collegeId?._id || batch.collegeId}`)} 
                    className="flex items-center gap-2 text-slate-500 hover:text-[#004AAD] text-sm font-bold w-fit transition-all active:translate-x-[-2px]"
                >
                    <ArrowLeft size={16} /> Back to Batches
                </Link>

                {/* Metadata summary card */}
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-50 text-[#004AAD] rounded-xl flex items-center justify-center font-bold text-lg border border-indigo-100 shadow-inner">
                            <Layers size={22} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">{batch.batchName}</h1>
                                <span className="px-2 py-0.5 bg-blue-50 border border-blue-100 rounded text-[#004AAD] font-bold text-[10px] uppercase">
                                    {batch.program || 'EWDP'}
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-slate-500">
                                <span>College: <span className="font-semibold text-slate-700">{batch.collegeId?.name || '—'}</span></span>
                                <span>•</span>
                                <span>Course: <span className="font-semibold text-slate-700">{batch.courseId?.name || '—'} ({batch.courseId?.code || '—'})</span></span>
                                <span>•</span>
                                <span>Trainer: <span className="font-semibold text-slate-700">{batch.trainerId ? `${batch.trainerId.firstName} ${batch.trainerId.lastName}` : 'Unassigned'}</span></span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="text-left bg-slate-50 px-4 py-2 border border-slate-200 rounded-xl">
                            <span className="text-[10px] text-slate-400 uppercase font-bold block">Roster Size</span>
                            <span className="text-base font-extrabold text-slate-700">{students.length} Student(s)</span>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase ${
                            batch.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                            batch.status === 'completed' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-slate-100 text-slate-500'
                        }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${batch.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-350'}`} />
                            {batch.status || 'Active'}
                        </span>
                    </div>
                </div>
            </div>




                    {previewList.length > 0 ? (
                        /* Interactive Import Review/Preview Table Panel */
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6 animate-in fade-in duration-200">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-slate-100">
                        <div>
                            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                                <FileSpreadsheet className="text-[#004AAD]" size={20} /> Spreadsheet Import Preview
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">
                                Review the staged student records. You must correct all flagged validation errors or remove them before saving.
                            </p>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <button
                                onClick={handleAddStudentToPreview}
                                className="px-4 py-2 border border-slate-200 text-slate-650 text-xs font-bold rounded-xl hover:bg-slate-50 flex items-center gap-1.5 transition-all"
                            >
                                <Plus size={14} /> Add Student Row
                            </button>
                            <button
                                onClick={handleCancelImport}
                                className="px-4 py-2 border border-rose-200 text-rose-600 text-xs font-bold rounded-xl hover:bg-rose-50 flex items-center gap-1.5 transition-all"
                            >
                                <X size={14} /> Discard Import
                            </button>
                        </div>
                    </div>

                    {/* Summary Banners */}
                    {previewList.some(s => s.error) ? (
                        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2.5">
                            <AlertCircle className="text-rose-600 shrink-0" size={16} />
                            <div>
                                <span className="font-bold">Validation Errors Detected:</span> There are student records with missing information or registration duplicates. Edit the invalid rows or remove them to continue.
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2.5">
                            <CheckCircle2 className="text-emerald-600 shrink-0" size={16} />
                            <div>
                                <span className="font-bold">All Records Validated!</span> You can now click "Confirm & Save Roster" below to write these student records into the roster database.
                            </div>
                        </div>
                    )}

                    {/* Preview Roster Table */}
                    <div className="overflow-x-auto border border-slate-200 rounded-xl max-h-[500px]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider sticky top-0 z-10">
                                    <th className="px-4 py-3 min-w-[150px]">Status / Issues</th>
                                    <th className="px-4 py-3">Student Name *</th>
                                    <th className="px-4 py-3">USN *</th>
                                    <th className="px-4 py-3">Department</th>
                                    <th className="px-4 py-3 w-[100px]">Semester</th>
                                    <th className="px-4 py-3 w-[90px]">Division</th>
                                    <th className="px-4 py-3">Email</th>
                                    <th className="px-4 py-3">Mobile</th>
                                    <th className="px-4 py-3 w-[80px]">CGPA</th>
                                    <th className="px-4 py-3 w-[80px]">Backlogs</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs">
                                {previewList.map((s, index) => {
                                    const isEditing = index === editingIndex;
                                    return (
                                        <tr key={index} className={`hover:bg-slate-50/50 transition-colors ${s.error ? 'bg-rose-50/20' : ''}`}>
                                            {/* Status / Issues */}
                                            <td className="px-4 py-3">
                                                {s.error ? (
                                                    <span className="inline-flex items-center gap-1.5 text-[10px] text-rose-700 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full font-semibold">
                                                        <AlertTriangle size={12} className="text-rose-600 shrink-0" />
                                                        {s.error}
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full font-semibold">
                                                        <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                                                        Valid
                                                    </span>
                                                )}
                                            </td>

                                            {/* Student Name */}
                                            <td className="px-4 py-3">
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={editFormData.name || ''}
                                                        onChange={e => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                                                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#004AAD] font-semibold"
                                                        placeholder="Name"
                                                    />
                                                ) : (
                                                    <span className="font-semibold text-slate-800">{s.name || <span className="text-rose-500 italic">Missing Name</span>}</span>
                                                )}
                                            </td>

                                            {/* USN */}
                                            <td className="px-4 py-3">
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={editFormData.usn || ''}
                                                        onChange={e => setEditFormData(prev => ({ ...prev, usn: e.target.value.toUpperCase() }))}
                                                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#004AAD] font-bold uppercase"
                                                        placeholder="USN"
                                                    />
                                                ) : (
                                                    <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-xs font-bold text-slate-600 rounded uppercase tracking-wider">
                                                        {s.usn || <span className="text-rose-500 italic">Missing USN</span>}
                                                    </span>
                                                )}
                                            </td>

                                            {/* Department */}
                                            <td className="px-4 py-3">
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={editFormData.department || ''}
                                                        onChange={e => setEditFormData(prev => ({ ...prev, department: e.target.value }))}
                                                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#004AAD]"
                                                        placeholder="Dept"
                                                    />
                                                ) : (
                                                    <span className="font-semibold text-slate-500 uppercase">{s.department || '—'}</span>
                                                )}
                                            </td>

                                            {/* Semester */}
                                            <td className="px-4 py-3">
                                                {isEditing ? (
                                                    <input
                                                        type="number"
                                                        min="1" max="8"
                                                        value={editFormData.semester || ''}
                                                        onChange={e => setEditFormData(prev => ({ ...prev, semester: e.target.value }))}
                                                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#004AAD]"
                                                        placeholder="Sem"
                                                    />
                                                ) : (
                                                    <span className="font-semibold text-slate-600">{s.semester || '—'}</span>
                                                )}
                                            </td>

                                            {/* Division */}
                                            <td className="px-4 py-3">
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={editFormData.division || ''}
                                                        onChange={e => setEditFormData(prev => ({ ...prev, division: e.target.value }))}
                                                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#004AAD]"
                                                        placeholder="Div"
                                                    />
                                                ) : (
                                                    <span className="font-bold text-slate-500 uppercase">{s.division || '—'}</span>
                                                )}
                                            </td>

                                            {/* Email */}
                                            <td className="px-4 py-3">
                                                {isEditing ? (
                                                    <input
                                                        type="email"
                                                        value={editFormData.email || ''}
                                                        onChange={e => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                                                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#004AAD]"
                                                        placeholder="Email"
                                                    />
                                                ) : (
                                                    <span className="text-slate-500">{s.email || '—'}</span>
                                                )}
                                            </td>

                                            {/* Mobile */}
                                            <td className="px-4 py-3">
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={editFormData.mobile || ''}
                                                        onChange={e => setEditFormData(prev => ({ ...prev, mobile: e.target.value }))}
                                                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#004AAD]"
                                                        placeholder="Mobile"
                                                    />
                                                ) : (
                                                    <span className="font-mono text-slate-500">{s.mobile || '—'}</span>
                                                )}
                                            </td>

                                            {/* CGPA */}
                                            <td className="px-4 py-3">
                                                {isEditing ? (
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        min="0" max="10"
                                                        value={editFormData.cgpa !== undefined ? editFormData.cgpa : ''}
                                                        onChange={e => setEditFormData(prev => ({ ...prev, cgpa: e.target.value }))}
                                                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#004AAD]"
                                                        placeholder="CGPA"
                                                    />
                                                ) : (
                                                    <span className="font-semibold text-slate-650">{s.cgpa !== undefined ? s.cgpa : '—'}</span>
                                                )}
                                            </td>

                                            {/* Backlogs */}
                                            <td className="px-4 py-3">
                                                {isEditing ? (
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={editFormData.backlogs !== undefined ? editFormData.backlogs : ''}
                                                        onChange={e => setEditFormData(prev => ({ ...prev, backlogs: e.target.value }))}
                                                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#004AAD]"
                                                        placeholder="Backlogs"
                                                    />
                                                ) : (
                                                    <span className="font-semibold text-slate-650">{s.backlogs !== undefined ? s.backlogs : '—'}</span>
                                                )}
                                            </td>

                                            {/* Actions */}
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-1.5">
                                                    {isEditing ? (
                                                        <>
                                                            <button
                                                                onClick={() => handleSaveEdit(index)}
                                                                className="px-2 py-1 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors text-[10px]"
                                                            >
                                                                Save
                                                            </button>
                                                            <button
                                                                onClick={handleCancelEdit}
                                                                className="px-2 py-1 bg-slate-200 text-slate-650 font-bold rounded-lg hover:bg-slate-300 transition-colors text-[10px]"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button
                                                                onClick={() => handleStartEdit(index, s)}
                                                                className="p-1 text-slate-400 hover:text-[#004AAD] hover:bg-blue-50 rounded-lg transition-colors"
                                                                title="Edit row"
                                                            >
                                                                <Edit2 size={14} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleRemoveFromPreview(index)}
                                                                className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                                title="Remove row"
                                                            >
                                                                <Trash2 size={14} />
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

                    <div className="pt-2 flex justify-end gap-3 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={handleCancelImport}
                            className="px-5 py-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50"
                        >
                            Discard Staged Roster
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirmImport}
                            disabled={uploading || previewList.some(s => s.error)}
                            className="px-6 py-3 bg-[#004AAD] text-white rounded-xl text-xs font-extrabold hover:bg-[#003580] disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-md shadow-blue-100"
                        >
                            {uploading && <Loader2 size={14} className="animate-spin" />}
                            Confirm & Save Roster
                        </button>
                    </div>
                </div>
            ) : (
                (user?.role !== 'trainer' && !isReadOnly) ? (
                    /* Excel Upload and Template Downloads */
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Excel Import Panel */}
                        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                <FileSpreadsheet className="text-indigo-600" size={18} /> Bulk Student Roster Import
                            </h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Upload an Excel spreadsheet with student details (Name, USN, Mobile, Email, Sem, Dept, Div).
                                The system will parse the spreadsheet and allow you to preview, edit, or fix any validation conflicts before finalized import.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                                <input 
                                    type="file" 
                                    accept=".xlsx"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                    className="w-full sm:w-auto px-5 py-3 bg-[#004AAD] text-white text-xs font-bold rounded-xl hover:bg-[#003580] disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-100"
                                >
                                    {uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
                                    {uploading ? 'Parsing File...' : 'Upload Student Spreadsheet'}
                                </button>
                                <button
                                    onClick={handleDownloadTemplate}
                                    className="w-full sm:w-auto px-5 py-3 border border-slate-200 text-slate-650 text-xs font-bold rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                                >
                                    <Download size={15} /> Download Template
                                </button>
                            </div>

                            {error && (
                                <div className="p-3.5 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-xl flex items-center gap-2 animate-in fade-in duration-150">
                                    <AlertTriangle size={15} className="shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}
                        </div>

                        {/* Information Card */}
                        <div className="bg-indigo-50/30 border border-indigo-100 rounded-2xl p-6 shadow-sm space-y-4">
                            <h3 className="text-sm font-bold text-[#004AAD] flex items-center gap-1.5">
                                <AlertCircle size={18} /> Import Guidelines
                            </h3>
                            <ul className="text-xs text-slate-600 space-y-2.5 list-disc pl-4 leading-relaxed">
                                <li>Ensure columns are formatted exactly as defined in the template.</li>
                                <li><strong>Name</strong> and <strong>USN</strong> are mandatory fields.</li>
                                <li>A student already registered in the system under any batch or college will generate a conflict error, allowing you to edit or remove it.</li>
                            </ul>
                        </div>
                    </div>
                ) : null
            )}

            {/* Student list grid table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
                    <div>
                        <h3 className="text-sm font-bold text-slate-800"> Roster Students ({filteredStudents.length})</h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative w-full sm:w-64">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-[#004AAD]" 
                                placeholder="Search by Name, USN, Department..." 
                                value={searchTerm} 
                                onChange={(e) => setSearchTerm(e.target.value)} 
                            />
                        </div>
                        <button 
                            onClick={exportBatchRoster}
                            disabled={exportingRoster}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5 px-3 py-2 text-xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer shrink-0 shadow-sm"
                            title="Export Current Batch Roster"
                        >
                            {exportingRoster ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
                            Export Roster
                        </button>
                        {!isReadOnly && (
                            <button 
                                onClick={() => { setSelectedStudent(null); setIsStudentModalOpen(true); }}
                                className="flex items-center gap-1.5 px-4 py-2 bg-[#004AAD] text-white text-xs font-bold rounded-xl hover:bg-[#003580] shadow-sm transition-all shrink-0"
                            >
                                <Plus size={14} /> Add Student
                            </button>
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                <th className="px-5 py-3">Student Name</th>
                                <th className="px-5 py-3">USN</th>
                                <th className="px-5 py-3">Department</th>
                                <th className="px-5 py-3">Semester</th>
                                <th className="px-5 py-3">Division</th>
                                <th className="px-5 py-3">CGPA</th>
                                <th className="px-5 py-3">Backlogs</th>
                                {batch?.integrationType && batch.integrationType !== 'none' && (
                                    <>
                                        <th className="px-5 py-3">Platform Handle</th>
                                        <th className="px-5 py-3">External Stats</th>
                                    </>
                                )}
                                <th className="px-5 py-3">Contact</th>
                                <th className="px-5 py-3">Status</th>
                                <th className="px-5 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {students.length === 0 ? (
                                <tr>
                                    <td colSpan={batch?.integrationType && batch.integrationType !== 'none' ? "12" : "10"} className="px-5 py-12 text-center text-slate-400 font-medium">
                                        No students in this batch yet. Download the template or add manually.
                                    </td>
                                </tr>
                            ) : filteredStudents.length === 0 ? (
                                <tr>
                                    <td colSpan={batch?.integrationType && batch.integrationType !== 'none' ? "12" : "10"} className="px-5 py-12 text-center text-slate-400 font-medium">
                                        No students match the search query.
                                    </td>
                                </tr>
                            ) : (
                                filteredStudents.map((s) => (
                                    <tr key={s._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-5 py-4">
                                            <span className="font-semibold text-slate-800">{s.name}</span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="px-2.5 py-0.5 bg-slate-100 border border-slate-200/50 text-xs font-bold text-slate-600 rounded-md uppercase tracking-wider">{s.usn}</span>
                                        </td>
                                        <td className="px-5 py-4 font-semibold text-slate-500 uppercase">
                                            {s.department || '—'}
                                        </td>
                                        <td className="px-5 py-4 font-semibold text-slate-600">
                                            {s.semester ? `Semester ${s.semester}` : '—'}
                                        </td>
                                        <td className="px-5 py-4 font-bold text-slate-500">
                                            {s.division || '—'}
                                        </td>
                                        <td className="px-5 py-4 font-semibold text-slate-700">
                                            {s.cgpa !== undefined ? Number(s.cgpa).toFixed(2) : '0.00'}
                                        </td>
                                        <td className="px-5 py-4 font-semibold text-slate-700">
                                            {s.backlogs !== undefined ? s.backlogs : '0'}
                                        </td>
                                        {batch?.integrationType && batch.integrationType !== 'none' && (
                                            <>
                                                <td className="px-5 py-4">
                                                    <span className="font-semibold text-slate-700 bg-slate-50 border border-slate-200/50 rounded-lg px-2.5 py-1 text-xs font-mono">
                                                        {s.externalHandles?.[batch.integrationType] || '—'}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="flex flex-col gap-0.5 text-xs">
                                                        <span className="font-bold text-slate-800">
                                                            {s.externalScore || 0} pts
                                                        </span>
                                                        {batch.integrationType === 'tryhackme' && (
                                                            <span className="text-[10px] font-bold text-[#004AAD]">
                                                                🏆 {s.externalBadges || 0} Badges
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                            </>
                                        )}
                                        <td className="px-5 py-4 text-xs font-medium text-slate-500">
                                            <div className="font-mono">{s.mobile || 'No mobile'}</div>
                                            {s.email && <div className="text-[10px] text-slate-400 mt-0.5">{s.email}</div>}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${s.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                                                {s.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <div className="flex justify-end gap-1.5">
                                                {!isReadOnly ? (
                                                    <>
                                                        <button 
                                                            onClick={() => { setSelectedStudent(s); setIsStudentModalOpen(true); }}
                                                            className="p-1.5 text-slate-400 hover:text-[#004AAD] hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Edit Student"
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button 
                                                            onClick={() => { setResetStudentObj(s); setIsResetPasswordOpen(true); }}
                                                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                                            title="Reset Password"
                                                        >
                                                            <Key size={16} />
                                                        </button>
                                                        {user?.role !== 'trainer' && (
                                                            <button 
                                                                onClick={() => handleDeleteStudent(s._id)}
                                                                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                                title="Delete Student"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        )}
                                                    </>
                                                ) : (
                                                    <span className="text-xs text-slate-400 font-medium italic">View Only</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>


            <StudentModal 
                isOpen={isStudentModalOpen}
                student={selectedStudent}
                onClose={() => setIsStudentModalOpen(false)}
                onSave={handleSaveStudent}
            />

            <AlertModal
                isOpen={alertState.isOpen}
                onClose={() => setAlertState(prev => ({ ...prev, isOpen: false }))}
                title={alertState.title}
                message={alertState.message}
                type={alertState.type}
            />

            {isResetPasswordOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsResetPasswordOpen(false)} />
                    <div className="bg-white max-w-sm w-full rounded-2xl shadow-2xl relative z-10 border border-slate-100 animate-in zoom-in-95 duration-150 overflow-hidden">
                        <div className="px-6 py-5 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800 text-base">Reset Student Password</h3>
                            <button onClick={() => setIsResetPasswordOpen(false)} className="p-1 hover:bg-slate-200/60 rounded-lg text-slate-400"><X size={18} /></button>
                        </div>
                        <form onSubmit={handleResetPassword} className="p-6 space-y-4">
                            <p className="text-xs text-slate-500 font-medium">Override password directly for <strong className="text-slate-800">{resetStudentObj?.name}</strong> (USN: {resetStudentObj?.usn}).</p>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">New Password *</label>
                                <input 
                                    type="text"
                                    required
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#004AAD] outline-none text-slate-850 font-bold"
                                    placeholder="Enter new password"
                                    value={newStudentPassword}
                                    onChange={e => setNewStudentPassword(e.target.value)}
                                />
                            </div>
                            <div className="pt-2 flex gap-3">
                                <button type="button" onClick={() => setIsResetPasswordOpen(false)} className="flex-1 py-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50">Cancel</button>
                                <button type="submit" disabled={resettingPassword} className="flex-1 py-3 bg-amber-500 text-white rounded-xl text-xs font-extrabold hover:bg-amber-600 disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-md shadow-amber-100">
                                    {resettingPassword && <Loader2 size={14} className="animate-spin" />} Reset Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


        </div>
    );
};

export default BatchDetail;
