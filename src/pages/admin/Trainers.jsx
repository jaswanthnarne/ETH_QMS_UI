import { useState, useEffect, useRef } from 'react';
import { Users, Plus, Search, Phone, Edit2, Trash2, X, Loader2, School, Download, BookOpen, Check, Eye, KeyRound, FileText, AlertTriangle, XCircle } from 'lucide-react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import ExcelJS from 'exceljs';
import useAuthStore from '../../store/authStore';
import useCollegeStore from '../../store/collegeStore';
import useSocketUpdate from '../../hooks/useSocketUpdate';
import { ConfirmModal } from '../../components/Modals';

// ─── Modal ────────────────────────────────────────────────────────────────────
const TrainerModal = ({ trainer, isOpen, onClose, onSave, colleges, courses, selectedCollegeId }) => {
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', phone: '', password: '', employeeId: '',
        collegeId: '', assignedColleges: [], assignedCourses: [], courseLocations: {}, program: 'EWDP'
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setError(null);
        if (trainer) {
            const initialCourseLocations = {};
            if (selectedCollegeId && trainer.assignedCourses) {
                trainer.assignedCourses.forEach(c => {
                    initialCourseLocations[c._id || c] = c.classroomLocation || '';
                });
            }

            setFormData({
                firstName: trainer.firstName || '',
                lastName: trainer.lastName || '',
                phone: trainer.phone || '',
                employeeId: trainer.employeeId || '',
                password: '',
                collegeId: trainer.collegeId?._id || trainer.collegeId || selectedCollegeId || '',
                assignedColleges: trainer.assignedColleges?.map(c => c._id || c) || [],
                assignedCourses: trainer.assignedCourses?.map(c => c._id || c) || [],
                courseLocations: initialCourseLocations,
                program: trainer.program || 'EWDP'
            });
        } else {
            setFormData({
                firstName: '', lastName: '', phone: '', password: '', employeeId: '',
                collegeId: selectedCollegeId || '',
                assignedColleges: [], assignedCourses: [],
                courseLocations: {},
                program: 'EWDP'
            });
        }
    }, [trainer, isOpen, selectedCollegeId]);

    const toggleCourse = (cid) => {
        const cur = formData.assignedCourses;
        const isChecked = cur.includes(cid);
        const newCourses = isChecked ? cur.filter(x => x !== cid) : [...cur, cid];
        
        // Remove location if unchecked
        const newLocations = { ...formData.courseLocations };
        if (isChecked) {
            delete newLocations[cid];
        } else {
            newLocations[cid] = '';
        }

        setFormData({
            ...formData,
            assignedCourses: newCourses,
            courseLocations: newLocations
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        const dataToSend = { ...formData };
        if (!dataToSend.employeeId) {
            delete dataToSend.employeeId;
        }
        await onSave(dataToSend, setError);
        setSubmitting(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
            <div className="bg-white max-w-4xl w-full min-h-[600px] rounded-xl shadow-2xl relative z-10 border border-slate-200 flex flex-col max-h-[90vh]">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center flex-shrink-0">
                    <h3 className="font-bold text-slate-900 text-lg">{trainer ? 'Edit Trainer' : 'Add New Trainer'}</h3>
                    <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400"><X size={18} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 flex-1 flex flex-col justify-between overflow-y-auto animate-in fade-in-50 duration-200">
                    <div className="space-y-4 flex-1">
                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm font-semibold rounded-lg border border-red-100 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                                {error}
                            </div>
                        )}
                        {/* Note when editing a trainer inside college scope */}
                        {trainer && selectedCollegeId && (
                            <div className="p-4 bg-blue-50/50 border border-blue-200 text-slate-700 text-xs font-medium rounded-xl flex flex-col gap-1.5">
                                <p className="font-bold text-[#004AAD] uppercase tracking-wider text-[10px]">Important Note</p>
                                <p className="leading-relaxed">
                                    Global trainer profile details (name, credentials, and program classification) can only be modified from the Global Dashboard, not inside the college scope.
                                </p>
                            </div>
                        )}

                        {/* Name */}
                        {!(trainer && selectedCollegeId) && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                                    <input required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none"
                                        placeholder="John" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                                    <input className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none"
                                        placeholder="Doe" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
                                </div>
                            </div>
                        )}

                        {/* Employee ID (only show in Global Dashboard, hide in College Dashboard) */}
                        {!selectedCollegeId && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Employee ID <span className="text-[#004AAD]">*</span></label>
                                <input required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none font-mono uppercase"
                                    placeholder="e.g. EMP1001" value={formData.employeeId} onChange={e => setFormData({ ...formData, employeeId: e.target.value.toUpperCase() })} />
                                <p className="text-xs text-slate-400 mt-1">Unique trainer code. Can also be used as a login username</p>
                            </div>
                        )}

                        {/* Mobile */}
                        {!(trainer && selectedCollegeId) && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number <span className="text-[#004AAD]">*</span></label>
                                <div className="relative">
                                    <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input required type="tel" className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none"
                                        placeholder="10-digit mobile number" value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                                </div>
                                <p className="text-xs text-slate-400 mt-1">Facilitator login mobile identifier</p>
                            </div>
                        )}

                        {/* Password */}
                        {!(trainer && selectedCollegeId) && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    {trainer ? 'New Password (leave blank to keep)' : 'Password *'}
                                </label>
                                <input required={!trainer} minLength={6} type="password" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none"
                                    placeholder="Min 6 characters" value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })} />
                            </div>
                        )}

                        {/* Program Classification */}
                        {!(trainer && selectedCollegeId) && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Program Classification *</label>
                                <select required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none"
                                    value={formData.program} onChange={e => setFormData({ ...formData, program: e.target.value })}>
                                    <option value="EWDP">EWDP</option>
                                    <option value="CFS">CFS</option>
                                    <option value="PMKVY">PMKVY</option>
                                    <option value="CMKKY">CMKKY</option>
                                </select>
                            </div>
                        )}

                        {/* College */}
                        {!(trainer && selectedCollegeId) && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">College</label>
                                <select disabled={!!selectedCollegeId} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none disabled:opacity-60"
                                    value={formData.collegeId} onChange={e => setFormData({ ...formData, collegeId: e.target.value })}>
                                    <option value="">Global / All Colleges (Unrestricted)</option>
                                    {colleges.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                </select>
                            </div>
                        )}

                        {/* Assigned Courses */}
                        {courses.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Assigned Courses <span className="text-slate-400 font-normal">(select one or many)</span>
                                </label>
                                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                                    {courses.map(c => {
                                        const selected = formData.assignedCourses.includes(c._id);
                                        return (
                                            <button key={c._id} type="button" onClick={() => toggleCourse(c._id)}
                                                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-left text-sm transition-colors ${selected ? 'bg-blue-50 border-[#004AAD] text-[#004AAD]' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                                                <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border transition-colors ${selected ? 'bg-[#004AAD] border-[#004AAD]' : 'border-slate-300'}`}>
                                                    {selected && <Check size={10} className="text-white" />}
                                                </div>
                                                <div className="truncate">
                                                    <span className="font-semibold">{c.code}</span>
                                                    <span className="text-xs ml-1 text-slate-400">{c.name}</span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                                {formData.assignedCourses.length > 0 && (
                                    <p className="text-xs text-[#004AAD] mt-1.5">{formData.assignedCourses.length} course{formData.assignedCourses.length > 1 ? 's' : ''} selected</p>
                                )}

                                {/* Course Locations inputs */}
                                {selectedCollegeId && formData.assignedCourses.length > 0 && (
                                    <div className="mt-4 space-y-2 animate-in fade-in-50 duration-200">
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Classroom Location per Course *</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {formData.assignedCourses.map(cid => {
                                                const c = courses.find(x => x._id === cid);
                                                if (!c) return null;
                                                return (
                                                    <div key={cid} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col gap-1">
                                                        <span className="text-xs font-bold text-slate-700">{c.code} <span className="text-[10px] text-slate-400 font-normal">({c.name})</span></span>
                                                        <input 
                                                            required
                                                            type="text"
                                                            placeholder="e.g. Room 123"
                                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-[#004AAD] transition-all font-medium text-slate-700"
                                                            value={formData.courseLocations?.[cid] || ''}
                                                            onChange={e => {
                                                                setFormData({
                                                                    ...formData,
                                                                    courseLocations: {
                                                                        ...formData.courseLocations,
                                                                        [cid]: e.target.value
                                                                    }
                                                                });
                                                            }}
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="pt-3 flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-50">Cancel</button>
                        <button type="submit" disabled={submitting}
                            className="flex-1 py-2.5 bg-[#004AAD] text-white rounded-lg text-sm font-semibold hover:bg-[#003580] disabled:opacity-50 flex items-center justify-center gap-2">
                            {submitting && <Loader2 size={16} className="animate-spin" />}
                            {trainer ? 'Save Changes' : 'Add Trainer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
// ─── Trainer Profile Modal ───────────────────────────────────────────────────
const TrainerProfileModal = ({ trainer, isOpen, onClose, onEdit, onDelete, token, onRefresh, effectiveCollegeId, courses }) => {
    const { user } = useAuthStore();
    const isReadOnly = ['regional_manager', 'asst_rm', 'placement'].includes(user?.role);
    const [newPassword, setNewPassword] = useState('');
    const [resetting, setResetting] = useState(false);
    const [statusMsg, setStatusMsg] = useState(null);

    const pdfInputRef = useRef(null);
    const [uploadingPdf, setUploadingPdf] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setNewPassword('');
            setStatusMsg(null);
        }
    }, [isOpen]);

    if (!isOpen || !trainer) return null;

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!newPassword || newPassword.length < 6) {
            setStatusMsg({ type: 'error', text: 'Password must be at least 6 characters.' });
            return;
        }
        setResetting(true);
        setStatusMsg(null);
        try {
            const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            await axios.put(
                `${baseURL}/admin/trainers/${trainer._id}`,
                { password: newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setStatusMsg({ type: 'success', text: 'Password reset successfully!' });
            setNewPassword('');
        } catch (error) {
            setStatusMsg({
                type: 'error',
                text: error.response?.data?.error || 'Failed to reset password.'
            });
        } finally {
            setResetting(false);
        }
    };

    const handlePdfUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            alert('Please select a valid PDF file.');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('File size exceeds the 5MB limit.');
            return;
        }

        const formData = new FormData();
        formData.append('pdf', file);

        setUploadingPdf(true);
        try {
            const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const res = await axios.post(
                `${baseURL}/admin/trainers/${trainer._id}/pdf`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            if (res.data.success) {
                alert('PDF details uploaded successfully!');
                if (onRefresh) onRefresh();
                trainer.pdfUrl = res.data.data.pdfUrl;
            }
        } catch (error) {
            console.error('PDF upload error:', error);
            alert(error.response?.data?.error || 'Failed to upload PDF');
        } finally {
            setUploadingPdf(false);
            if (pdfInputRef.current) pdfInputRef.current.value = '';
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
            <div className="bg-white max-w-4xl w-full min-h-[600px] rounded-xl shadow-2xl relative z-10 border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 text-[#004AAD] rounded-xl flex items-center justify-center font-medium text-base shadow-sm">
                            {(trainer.firstName || trainer.phone || '?').charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h3 className="text-slate-800 text-base leading-tight">Trainer Profile</h3>
                            <span className="inline-flex items-center gap-1.5 mt-0.5 px-2 py-0.5 rounded-full text-[10px] bg-[#004AAD]/10 text-[#004AAD] uppercase">
                                {trainer.role}
                            </span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400"><X size={18} /></button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6 overflow-y-auto flex-1 animate-in fade-in-50 duration-200">
                    {/* Note when viewing a trainer inside college scope */}
                    {effectiveCollegeId && (
                        <div className="p-4 bg-blue-50/50 border border-blue-200 text-slate-700 text-xs font-medium rounded-xl flex flex-col gap-1.5">
                            <p className="font-bold text-[#004AAD] uppercase tracking-wider text-[10px]">Important Note</p>
                            <p className="leading-relaxed">
                                Global trainer profile details (name, credentials, and program classification) can only be modified from the Global Dashboard, not inside the college scope.
                            </p>
                        </div>
                    )}

                    {/* Main Details Grid */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-4 border-b border-slate-100 pb-5">
                        <div>
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Full Name</span>
                            <span className="text-sm text-slate-700 mt-1 block">
                                {`${trainer.firstName || ''} ${trainer.lastName || ''}`.trim() || '—'}
                            </span>
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                                {effectiveCollegeId ? 'Classroom Location' : 'Employee ID'}
                            </span>
                            {effectiveCollegeId ? (
                                trainer.assignedCourses?.length > 0 ? (
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {trainer.assignedCourses.map(c => (
                                            <span key={c._id} className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-50 text-[#004AAD] border border-blue-100">
                                                {c.classroomLocation ? `${c.classroomLocation} (${c.code})` : `Not Set (${c.code})`}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="text-xs text-slate-400 italic mt-1 block">No courses mapped</span>
                                )
                            ) : (
                                <span className="inline-flex items-center mt-1 px-2.5 py-0.5 rounded text-xs font-mono bg-indigo-50 text-indigo-700 uppercase border border-indigo-100">
                                    {trainer.employeeId || '—'}
                                </span>
                            )}
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Program Classification</span>
                            <span className="inline-flex items-center mt-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-50 text-[#004AAD] uppercase border border-blue-100">
                                {trainer.program || 'EWDP'}
                            </span>
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Mobile Number</span>
                            <span className="text-sm text-slate-700 mt-1 block font-mono">
                                {trainer.phone || '—'}
                            </span>
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Primary College</span>
                            <span className="text-sm text-slate-700 mt-1 block truncate" title={trainer.collegeId?.name || '—'}>
                                {trainer.collegeId?.name || '—'}
                            </span>
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Assessments Conducted</span>
                            <span className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full text-xs bg-emerald-50 text-emerald-700 border border-emerald-100">
                                {trainer.testsCount || 0} Test{trainer.testsCount !== 1 ? 's' : ''}
                            </span>
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Status</span>
                            <span className="inline-flex items-center gap-1 mt-1 text-xs text-emerald-600">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Active Account
                            </span>
                        </div>
                    </div>

                    {/* Assigned Colleges */}
                    <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-2">Assigned Colleges</span>
                        {trainer.assignedColleges?.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                                {trainer.assignedColleges.map(c => (
                                    <span key={c._id || c} className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs border border-slate-200">
                                        <School size={11} className="text-slate-400" />{c.name || c}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <span className="text-xs text-slate-400 italic">No additional colleges assigned</span>
                        )}
                    </div>

                    {/* Assigned Courses */}
                    <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-2">Assigned Courses</span>
                        {trainer.assignedCourses?.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                                {trainer.assignedCourses.map(c => (
                                    <span key={c._id || c} className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-[#004AAD] rounded text-xs border border-blue-100">
                                        <BookOpen size={11} />{c.code} <span className="text-[10px] text-blue-400">({c.name})</span>
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <span className="text-xs text-slate-400 italic">No courses assigned</span>
                        )}
                    </div>

                    {/* PDF Details Document Uploader */}
                    {(!effectiveCollegeId || trainer.pdfUrl) && (
                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-3">
                            <div>
                                <h4 className="text-xs text-slate-700 uppercase flex items-center gap-1.5 font-bold">
                                    <FileText size={13} className="text-[#004AAD]" /> Trainer Details Document (PDF)
                                </h4>
                                {!effectiveCollegeId && (
                                    <p className="text-[11px] text-slate-400 mt-0.5">Upload a PDF containing all the details about the trainer (Max 5MB)</p>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                {!effectiveCollegeId && (
                                    <>
                                        <input
                                            type="file"
                                            accept="application/pdf"
                                            ref={pdfInputRef}
                                            onChange={handlePdfUpload}
                                            className="hidden"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => pdfInputRef.current?.click()}
                                            disabled={uploadingPdf}
                                            className="px-4 py-2 bg-[#004AAD] text-white rounded-lg text-xs font-semibold hover:bg-[#003580] disabled:opacity-50 flex items-center gap-1.5 shadow-sm cursor-pointer"
                                        >
                                            {uploadingPdf ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
                                            {trainer.pdfUrl ? 'Update PDF' : 'Upload PDF'}
                                        </button>
                                    </>
                                )}
                                
                                {trainer.pdfUrl && (
                                    <a
                                        href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/trainers/${trainer._id}/pdf`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-100 flex items-center gap-1.5 shadow-sm"
                                    >
                                        <Eye size={12} /> View Current PDF
                                    </a>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Password Reset Section */}
                    {!effectiveCollegeId && (
                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-3">
                            <div>
                                <h4 className="text-xs text-slate-700 uppercase flex items-center gap-1.5">
                                    <KeyRound size={13} className="text-[#004AAD]" /> Reset Password
                                </h4>
                                <p className="text-[11px] text-slate-400 mt-0.5">Quickly update this trainer's login password</p>
                            </div>

                            <form onSubmit={handleResetPassword} className="flex gap-2 items-center">
                                <input
                                    required
                                    minLength={6}
                                    type="password"
                                    className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-[#004AAD] font-mono"
                                    placeholder="New password (min 6 chars)"
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    disabled={resetting}
                                    className="px-4 py-2 bg-[#004AAD] text-white rounded-lg text-xs hover:bg-[#003580] disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
                                >
                                    {resetting && <Loader2 size={12} className="animate-spin" />}
                                    Reset
                                </button>
                            </form>

                            {statusMsg && (
                                <div className={`text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 ${
                                    statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
                                }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${statusMsg.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                    {statusMsg.text}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer Controls */}
                <div className="px-6 py-4 border-t border-slate-100 flex gap-2 flex-shrink-0 bg-slate-50/50 justify-between">
                    {!isReadOnly ? (
                        !effectiveCollegeId ? (
                            <button
                                onClick={() => onDelete(trainer._id)}
                                className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-xs hover:bg-red-50"
                            >
                                Delete Trainer
                            </button>
                        ) : (
                            <button
                                onClick={async () => {
                                    if (window.confirm(`Are you sure you want to remove trainer ${trainer.firstName} ${trainer.lastName} from this college?`)) {
                                        try {
                                            const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                                            const isPrimary = (trainer.collegeId?._id || trainer.collegeId)?.toString() === effectiveCollegeId?.toString();
                                            const payload = {};
                                            if (isPrimary) {
                                                payload.collegeId = null;
                                            }
                                            const currentColleges = trainer.assignedColleges?.map(c => c._id || c) || [];
                                            payload.assignedColleges = currentColleges.filter(cid => cid !== effectiveCollegeId);
                                            const currentCourses = trainer.assignedCourses?.map(c => c._id || c) || [];
                                            payload.assignedCourses = currentCourses.filter(cid => !courses.some(cc => cc._id === cid));
                                            
                                            await axios.put(
                                                `${baseURL}/admin/trainers/${trainer._id}`,
                                                payload,
                                                { headers: { Authorization: `Bearer ${token}` } }
                                            );
                                            onClose();
                                            onRefresh();
                                        } catch (error) {
                                            alert(error.response?.data?.error || 'Failed to remove trainer assignment');
                                        }
                                    }
                                }}
                                className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-xs hover:bg-red-50"
                            >
                                Remove Assignment
                            </button>
                        )
                    ) : (
                        <div />
                    )}
                    <div className="flex gap-2">
                        {!isReadOnly && (
                            <button
                                onClick={() => onEdit(trainer)}
                                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs hover:bg-slate-50"
                            >
                                {effectiveCollegeId ? 'Edit Location & Courses' : 'Edit Profile'}
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs hover:bg-slate-800"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AssignTrainerModal = ({ isOpen, onClose, onSave, trainers, globalTrainers, courses, effectiveCollegeId }) => {
    const { token } = useAuthStore();
    const { selectedCollegeName } = useCollegeStore();
    const [formData, setFormData] = useState({ trainerId: '', courseId: '' });
    const [trainerSearch, setTrainerSearch] = useState('');
    const [courseSearch, setCourseSearch] = useState('');
    const [showTrainerDropdown, setShowTrainerDropdown] = useState(false);
    const [showCourseDropdown, setShowCourseDropdown] = useState(false);
    const [confirmState, setConfirmState] = useState({ isOpen: false, type: '', data: null, otherColleges: '' });
    const [submitting, setSubmitting] = useState(false);
    const [validationError, setValidationError] = useState('');

    const assignableTrainers = globalTrainers;

    const filteredAssignableTrainers = assignableTrainers.filter(t => {
        const fullName = `${t.firstName || ''} ${t.lastName || ''}`.toLowerCase();
        const search = trainerSearch.toLowerCase();
        return fullName.includes(search) || 
               t.employeeId?.toLowerCase().includes(search) || 
               t.phone?.includes(search);
    });

    const filteredCourses = courses.filter(c => {
        const search = courseSearch.toLowerCase();
        return c.name?.toLowerCase().includes(search) || 
               c.code?.toLowerCase().includes(search);
    });

    useEffect(() => {
        if (isOpen) {
            setFormData({ trainerId: '', courseId: '' });
            setTrainerSearch('');
            setCourseSearch('');
            setShowTrainerDropdown(false);
            setShowCourseDropdown(false);
            setConfirmState({ isOpen: false, type: '', data: null, otherColleges: '' });
            setValidationError('');
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidationError('');

        if (!formData.trainerId) return setValidationError('Please select a trainer');
        if (!formData.courseId) return setValidationError('Please select a course to assign the trainer to');

        const trainer = globalTrainers.find(t => t._id === formData.trainerId);
        const course = courses.find(c => c._id === formData.courseId);

        if (trainer) {
            // Find if trainer is already mapped to the active college
            const localTrainer = trainers.find(t => t._id === formData.trainerId);
            // Get courses they teach at THIS college (using localTrainer's scoped assignedCourses)
            const trainerLocalCourseIds = localTrainer ? localTrainer.assignedCourses?.map(c => c._id?.toString() || c.toString()) || [] : [];
            
            // Check if already assigned to the same course AT THIS COLLEGE
            if (trainerLocalCourseIds.includes(formData.courseId)) {
                return setValidationError(`This trainer is already assigned to ${course?.code || 'this course'} at this college.`);
            }

            // Get all courses they teach globally
            const trainerGlobalCourseIds = trainer.assignedCourses?.map(c => c._id?.toString() || c.toString()) || [];

            // Check if already teaching THIS course at ANOTHER college (Sarcastic warning)
            if (trainerGlobalCourseIds.includes(formData.courseId)) {
                setConfirmState({
                    isOpen: true,
                    type: 'cross_college_same_course',
                    otherColleges: '',
                    data: { trainerId: formData.trainerId, courseId: formData.courseId, classroomLocation: formData.classroomLocation }
                });
                return;
            }

            // Check if assigned to any other colleges but not the active college
            const isAssociatedWithActiveCollege = 
                (trainer.collegeId?._id || trainer.collegeId)?.toString() === effectiveCollegeId?.toString() ||
                trainer.assignedColleges?.some(c => (c._id || c)?.toString() === effectiveCollegeId?.toString());

            if (!isAssociatedWithActiveCollege) {
                const associatedCollegesNames = [];
                if (trainer.collegeId && (trainer.collegeId._id || trainer.collegeId).toString() !== effectiveCollegeId?.toString()) {
                    associatedCollegesNames.push(trainer.collegeId.name || 'Primary College');
                }
                if (trainer.assignedColleges) {
                    trainer.assignedColleges.forEach(c => {
                        const cid = c._id || c;
                        if (cid.toString() !== effectiveCollegeId?.toString()) {
                            associatedCollegesNames.push(c.name || 'Assigned College');
                        }
                    });
                }
                const uniqueOtherColleges = [...new Set(associatedCollegesNames)];
                if (uniqueOtherColleges.length > 0) {
                    setConfirmState({
                        isOpen: true,
                        type: 'cross_college_new_assignment',
                        otherColleges: uniqueOtherColleges.join(', '),
                        data: { trainerId: formData.trainerId, courseId: formData.courseId, classroomLocation: formData.classroomLocation }
                    });
                    return;
                }
            }

            // Check if another trainer at this college is already assigned to this course (Multiple trainers mapping warning)
            const otherTrainersWithSameCourse = trainers.filter(t => 
                t._id !== formData.trainerId && 
                t.assignedCourses?.some(c => (c._id || c)?.toString() === formData.courseId)
            );
            if (otherTrainersWithSameCourse.length > 0) {
                const names = otherTrainersWithSameCourse.map(t => `${t.firstName || ''} ${t.lastName || ''}`.trim() || t.username).join(', ');
                setConfirmState({
                    isOpen: true,
                    type: 'course_already_has_trainer',
                    otherColleges: '',
                    otherTrainers: names,
                    data: { trainerId: formData.trainerId, courseId: formData.courseId, classroomLocation: formData.classroomLocation }
                });
                return;
            }

            // Trigger warning dialog if they are already assigned to ANOTHER course at this college
            if (trainerLocalCourseIds.length > 0) {
                setConfirmState({
                    isOpen: true,
                    type: 'local_different_course',
                    otherColleges: '',
                    data: { trainerId: formData.trainerId, courseId: formData.courseId, classroomLocation: formData.classroomLocation }
                });
                return; // Abort direct submit
            }
        }

        setSubmitting(true);
        try {
            await onSave(formData);
        } catch (error) {
            setValidationError(error.response?.data?.error || 'Failed to assign trainer');
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const activeTrainer = confirmState.data ? globalTrainers.find(t => t._id === confirmState.data.trainerId) : null;
    const activeTrainerName = activeTrainer ? `${activeTrainer.firstName || ''} ${activeTrainer.lastName || ''}`.trim() : '';
    
    const activeCourse = confirmState.data ? courses.find(c => c._id === confirmState.data.courseId) : null;
    const activeCourseName = activeCourse ? `${activeCourse.code} - ${activeCourse.name}` : '';
    
    let activeAssignedCourseDetails = '';
    if (activeTrainer) {
        const localTrainer = trainers.find(t => t._id === activeTrainer._id);
        if (localTrainer) {
            activeAssignedCourseDetails = localTrainer.assignedCourses
                ?.map(c => `${c.code} - ${c.name}`)
                .join(', ') || '';
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
            <div className="bg-white max-w-4xl w-full min-h-[600px] rounded-2xl shadow-2xl relative z-10 border border-slate-100 animate-in zoom-in-95 duration-150 overflow-hidden flex flex-col">
                <div className="px-6 py-5 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 text-lg">Assign Global Trainer to College</h3>
                    <button onClick={onClose} className="p-1.5 hover:bg-slate-200/60 active:scale-95 rounded-lg text-slate-400 hover:text-slate-600 transition-all"><X size={18} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 flex-1 flex flex-col justify-between space-y-6">
                    <div className="space-y-6 flex-1">
                        {validationError && (
                            <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-lg flex items-center gap-2">
                                <AlertTriangle size={14} className="shrink-0" />
                                <span>{validationError}</span>
                            </div>
                        )}
                        
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Select Trainer *</label>
                            <div className="relative">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input 
                                    type="text"
                                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-[#004AAD] transition-all font-medium text-slate-700"
                                    placeholder="Type to search and select trainer..."
                                    value={trainerSearch}
                                    onChange={(e) => {
                                        setTrainerSearch(e.target.value);
                                        setFormData(prev => ({ ...prev, trainerId: '' }));
                                        setShowTrainerDropdown(true);
                                    }}
                                    onFocus={() => setShowTrainerDropdown(true)}
                                    onBlur={() => setTimeout(() => setShowTrainerDropdown(false), 255)}
                                />
                                {showTrainerDropdown && (
                                    <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto divide-y divide-slate-100">
                                        {filteredAssignableTrainers.length === 0 ? (
                                            <div className="px-4 py-2.5 text-xs text-slate-500 italic">No assignable trainers found</div>
                                        ) : (
                                            filteredAssignableTrainers.map(t => (
                                                <button
                                                    key={t._id}
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData(prev => ({ ...prev, trainerId: t._id }));
                                                        setTrainerSearch(`${t.firstName} ${t.lastName} (${t.employeeId || t.phone})`);
                                                        setShowTrainerDropdown(false);
                                                    }}
                                                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 text-slate-700 transition-colors flex flex-col cursor-pointer"
                                                >
                                                    <span className="font-semibold">{t.firstName} {t.lastName}</span>
                                                    <span className="text-xs text-slate-400">ID: {t.employeeId || 'N/A'} | Phone: {t.phone} ({t.program})</span>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                            {formData.trainerId && (
                                <p className="text-xs text-[#004AAD] mt-1.5 font-semibold">Selected Trainer: {trainerSearch}</p>
                            )}
                            {assignableTrainers.length === 0 && (
                                <p className="text-xs text-amber-600 mt-1">No assignable trainers found (all are already linked to this college).</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Select Course (Active Mapped Courses) *</label>
                            <div className="relative">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input 
                                    type="text"
                                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-[#004AAD] transition-all font-medium text-slate-700"
                                    placeholder="Type to search and select course..."
                                    value={courseSearch}
                                    onChange={(e) => {
                                        setCourseSearch(e.target.value);
                                        setFormData(prev => ({ ...prev, courseId: '' }));
                                        setShowCourseDropdown(true);
                                    }}
                                    onFocus={() => setShowCourseDropdown(true)}
                                    onBlur={() => setTimeout(() => setShowCourseDropdown(false), 255)}
                                />
                                {showCourseDropdown && (
                                    <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto divide-y divide-slate-100">
                                        {filteredCourses.length === 0 ? (
                                            <div className="px-4 py-2.5 text-xs text-slate-500 italic">No courses found</div>
                                        ) : (
                                            filteredCourses.map(c => (
                                                <button
                                                    key={c._id}
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData(prev => ({ ...prev, courseId: c._id }));
                                                        setCourseSearch(`${c.code} - ${c.name}`);
                                                        setShowCourseDropdown(false);
                                                    }}
                                                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 text-slate-700 transition-colors flex flex-col cursor-pointer"
                                                >
                                                    <span className="font-semibold">{c.code}</span>
                                                    <span className="text-xs text-slate-400">{c.name}</span>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                            {formData.courseId && (
                                <p className="text-xs text-[#004AAD] mt-1.5 font-semibold">Selected Course: {courseSearch}</p>
                            )}
                            {courses.length === 0 && (
                                <p className="text-xs text-amber-600 mt-1">Please map courses to this college first.</p>
                            )}
                        </div>

                        {formData.courseId && (
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Classroom Location *</label>
                                <input 
                                    required
                                    type="text"
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-[#004AAD] transition-all font-medium text-slate-700"
                                    placeholder="e.g. Room 123"
                                    value={formData.classroomLocation || ''}
                                    onChange={e => setFormData(prev => ({ ...prev, classroomLocation: e.target.value }))}
                                />
                            </div>
                        )}
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 active:scale-[0.98] transition-all"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={submitting || assignableTrainers.length === 0 || courses.length === 0} 
                            className="flex-1 py-3 bg-[#004AAD] text-white rounded-xl text-sm font-bold hover:bg-[#003580] disabled:opacity-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            {submitting && <Loader2 size={16} className="animate-spin" />}
                            Assign Trainer
                        </button>
                    </div>
                </form>
            </div>

            <ConfirmModal
                isOpen={confirmState.isOpen}
                onClose={() => setConfirmState({ isOpen: false, type: '', data: null, otherColleges: '', otherTrainers: '' })}
                onConfirm={async () => {
                    setSubmitting(true);
                    try {
                        await onSave(confirmState.data);
                        setConfirmState({ isOpen: false, type: '', data: null, otherColleges: '', otherTrainers: '' });
                    } catch (error) {
                        setValidationError(error.response?.data?.error || 'Failed to assign trainer');
                        setConfirmState({ isOpen: false, type: '', data: null, otherColleges: '', otherTrainers: '' });
                    } finally {
                        setSubmitting(false);
                    }
                }}
                title={
                    confirmState.type === 'cross_college_same_course' 
                        ? "Trainer Cross-College Assignment Warning" 
                        : confirmState.type === 'cross_college_new_assignment'
                        ? "Trainer Cross-College Assignment Warning"
                        : confirmState.type === 'course_already_has_trainer'
                        ? "Duplicate Course Trainer Assignment Warning"
                        : "Trainer Multi-Course Assignment Warning"
                }
                message={
                    confirmState.type === 'cross_college_same_course' ? (
                        <span>
                            Whoa, slow down! Trainer <strong>{activeTrainerName}</strong> is already teaching the course <strong>{activeCourseName}</strong> at another college.
                            <br /><br />
                            Unless they've mastered bilocation or we've secretly cloned them, they will have to travel between campuses to run this.
                            Are you sure you want to force-assign them to this course here at <strong>{selectedCollegeName || 'this college'}</strong> too?
                            <br /><br />
                            Click Confirm to force-assign them anyway, or Cancel to abort.
                        </span>
                    ) : confirmState.type === 'cross_college_new_assignment' ? (
                        <span>
                            Wait, is this a campus exchange program? Trainer <strong>{activeTrainerName}</strong> is currently mapped to <strong>{confirmState.otherColleges}</strong>.
                            <br /><br />
                            Unless they can teleport, they will have to split their teaching time between institutions. Are you sure you want to force-assign them to teach at <strong>{selectedCollegeName || 'this college'}</strong> too?
                            <br /><br />
                            Click Confirm to force-assign them anyway, or Cancel to abort.
                        </span>
                    ) : confirmState.type === 'course_already_has_trainer' ? (
                        <span>
                            Wait a minute, are we team-teaching now? The course <strong>{activeCourseName}</strong> is already assigned to <strong>{confirmState.otherTrainers}</strong> at this college.
                            <br /><br />
                            Unless this is a tag-team match or a very crowded classroom, having multiple trainers assigned to the same course might get confusing. Are you sure you want to assign <strong>{activeTrainerName}</strong> to it as well?
                            <br /><br />
                            Click Confirm to proceed with assigning multiple trainers, or Cancel to abort.
                        </span>
                    ) : (
                        <span>
                            Trainer <strong>{activeTrainerName}</strong> is already teaching <strong>{activeAssignedCourseDetails}</strong> at this college.
                            <br /><br />
                            Are you sure you want to map them to the course <strong>{activeCourseName}</strong>? This will increase their course workload.
                            <br /><br />
                            Click Confirm to force-assign them anyway, or Cancel to abort.
                        </span>
                    )
                }
                confirmText="Confirm Force-Assign"
                type="warning"
                maxWidthClass="max-w-2xl"
            />
        </div>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const Trainers = () => {
    const location = useLocation();
    const [trainers, setTrainers] = useState([]);
    const [globalTrainers, setGlobalTrainers] = useState([]);
    const [colleges, setColleges] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [selectedTrainer, setSelectedTrainer] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCollegeFilter, setSelectedCollegeFilter] = useState('all');
    const [programFilter, setProgramFilter] = useState('all');
    const [sortBy, setSortBy] = useState('name-asc');
    const [forceAssignConfirmState, setForceAssignConfirmState] = useState({ isOpen: false, existingTrainer: null });

    const { token, user } = useAuthStore();
    const isReadOnly = ['regional_manager', 'asst_rm', 'placement'].includes(user?.role);
    const { selectedCollegeId, selectedCollegeName, selectedCollegeCode } = useCollegeStore();

    const urlCollegeMatch = location.pathname.match(/\/college\/([a-f0-9]+)/);
    const effectiveCollegeId = selectedCollegeId || (urlCollegeMatch ? urlCollegeMatch[1] : null);

    useEffect(() => {
        if (effectiveCollegeId) {
            setSelectedCollegeFilter(effectiveCollegeId);
        } else {
            setSelectedCollegeFilter('all');
        }
    }, [effectiveCollegeId]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const url = effectiveCollegeId
                ? `${baseURL}/admin/trainers?collegeId=${effectiveCollegeId}`
                : `${baseURL}/admin/trainers`;
            const [tRes, cRes] = await Promise.all([
                axios.get(url, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${baseURL}/admin/colleges`, { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setTrainers(tRes.data.data);
            setColleges(cRes.data.data);

            // Load courses mapped to the selected college and all global trainers
            if (effectiveCollegeId) {
                const [courseRes, globalTRes] = await Promise.all([
                    axios.get(`${baseURL}/admin/colleges/${effectiveCollegeId}/mapped-courses`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`${baseURL}/admin/trainers`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);
                const mappedCoursesList = (courseRes.data.data || []).map(m => m.courseId).filter(Boolean);
                setCourses(mappedCoursesList);
                setGlobalTrainers(globalTRes.data.data || []);
            }
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, [effectiveCollegeId]);

    useSocketUpdate(() => fetchData(), ['trainers', 'courses', 'colleges']);

    const handleSave = async (data, setSaveError) => {
        try {
            const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const payload = { ...data };
            if (!payload.password) delete payload.password; // Don't overwrite if empty on edit
            const url = effectiveCollegeId 
                ? `${baseURL}/admin/trainers/${selectedTrainer ? selectedTrainer._id : ''}?collegeId=${effectiveCollegeId}`
                : `${baseURL}/admin/trainers/${selectedTrainer ? selectedTrainer._id : ''}`;
            if (selectedTrainer) {
                await axios.put(url, payload, { headers: { Authorization: `Bearer ${token}` } });
            } else {
                const postUrl = effectiveCollegeId
                    ? `${baseURL}/admin/trainers?collegeId=${effectiveCollegeId}`
                    : `${baseURL}/admin/trainers`;
                await axios.post(postUrl, payload, { headers: { Authorization: `Bearer ${token}` } });
            }
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            const existingTrainer = error.response?.data?.existingTrainer;
            if (existingTrainer && effectiveCollegeId) {
                const alreadyAssigned = 
                    (existingTrainer.collegeId?.toString() === effectiveCollegeId.toString()) ||
                    existingTrainer.assignedColleges?.some(c => (c._id || c)?.toString() === effectiveCollegeId.toString());

                if (alreadyAssigned) {
                    setSaveError("This trainer is already registered at this college.");
                    return;
                }

                setIsModalOpen(false);
                setForceAssignConfirmState({
                    isOpen: true,
                    existingTrainer
                });
                return;
            }
            setSaveError(error.response?.data?.error || 'Failed to save trainer');
        }
    };

    const handleForceAssignConfirm = async () => {
        const trainer = forceAssignConfirmState.existingTrainer;
        if (!trainer || !effectiveCollegeId) return;

        try {
            const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const currentColleges = trainer.assignedColleges?.map(c => c._id || c) || [];
            const newColleges = [...new Set([...currentColleges, effectiveCollegeId])];

            await axios.put(
                `${baseURL}/admin/trainers/${trainer._id}`,
                { assignedColleges: newColleges },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setForceAssignConfirmState({ isOpen: false, existingTrainer: null });
            fetchData();
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to force-assign trainer');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this trainer? They will lose all access immediately.')) {
            try {
                const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                await axios.delete(`${baseURL}/admin/trainers/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                fetchData();
            } catch (error) { alert(error.response?.data?.error || 'Failed'); }
        }
    };

    const handleAssignTrainerSave = async (data) => {
        try {
            const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            await axios.post(
                `${baseURL}/admin/colleges/${effectiveCollegeId}/courses/${data.courseId}/trainers`,
                { trainerId: data.trainerId, classroomLocation: data.classroomLocation || '' },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setIsAssignModalOpen(false);
            fetchData();
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to assign trainer');
        }
    };

    const handleUnassignTrainer = async (trainer) => {
        if (!window.confirm(`Are you sure you want to remove trainer ${trainer.firstName} ${trainer.lastName} from this college?`)) return;
        try {
            const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const isPrimary = (trainer.collegeId?._id || trainer.collegeId)?.toString() === effectiveCollegeId?.toString();
            const payload = {};
            if (isPrimary) {
                payload.collegeId = null;
            }
            const currentColleges = trainer.assignedColleges?.map(c => c._id || c) || [];
            payload.assignedColleges = currentColleges.filter(cid => cid !== effectiveCollegeId);
            const currentCourses = trainer.assignedCourses?.map(c => c._id || c) || [];
            payload.assignedCourses = currentCourses.filter(cid => !courses.some(cc => cc._id === cid));

            await axios.put(
                `${baseURL}/admin/trainers/${trainer._id}`,
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchData();
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to remove trainer assignment');
        }
    };

    const handleExportAllTrainers = async () => {
        try {
            if (sortedTrainers.length === 0) {
                alert('No trainers to export');
                return;
            }

            const workbook = new ExcelJS.Workbook();
            workbook.creator = 'Ethnotech Academy';
            workbook.created = new Date();

            const sheet = workbook.addWorksheet('👤 All Trainers');

            sheet.columns = [
                { header: 'Trainer Name', key: 'name', width: 30 },
                { header: 'Assigned Courses', key: 'assignedCourses', width: 45 },
                { header: effectiveCollegeId ? 'Classroom Location' : 'Employee ID', key: 'employeeId', width: 22 },
                { header: 'Mobile / Login', key: 'phone', width: 18 },
                { header: 'Program', key: 'program', width: 14 },
                { header: effectiveCollegeId ? 'College' : 'Primary College', key: 'primaryCollege', width: 35 }
            ];

            const headerRow = sheet.getRow(1);
            headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
            headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF004AAD' } }; // Brand Navy Blue
            headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
            headerRow.height = 24;

            sortedTrainers.forEach((t, index) => {
                const name = `${t.firstName || ''} ${t.lastName || ''}`.trim() || '—';
                const employeeId = effectiveCollegeId 
                    ? (t.assignedCourses?.map(c => `${c.code}: ${c.classroomLocation || '—'}`).join('; ') || '—')
                    : (t.employeeId || '—');
                const program = t.program || 'EWDP';
                const phone = t.phone || '—';
                const primaryCollege = effectiveCollegeId 
                    ? (selectedCollegeName || colleges.find(c => c._id === effectiveCollegeId)?.name || '—')
                    : (t.collegeId?.name || '—');
                const assignedCourses = t.assignedCourses?.map(c => c.code).join(', ') || '—';

                const row = sheet.addRow({
                    name,
                    employeeId,
                    program,
                    phone,
                    primaryCollege,
                    assignedCourses
                });

                row.fill = { 
                    type: 'pattern', 
                    pattern: 'solid', 
                    fgColor: { argb: index % 2 === 0 ? 'FFF0F4FF' : 'FFFFFFFF' } 
                };
                row.alignment = { vertical: 'middle' };
                row.height = 20;
            });

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.setAttribute('download', 'Trainers_Report.xlsx');
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            console.error('Failed to export trainers:', error);
            alert('Failed to export trainers');
        }
    };

    const filteredTrainers = trainers.filter(t => {
        const courseLocationsStr = t.assignedCourses?.map(c => c.classroomLocation || '').join(' ') || '';
        
        const matchesSearch = `${t.firstName || ''} ${t.lastName || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              t.phone?.includes(searchTerm) ||
                              t.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              courseLocationsStr.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCollege = selectedCollegeFilter === 'all' || 
                               (t.collegeId?._id || t.collegeId) === selectedCollegeFilter ||
                                t.assignedColleges?.some(c => (c._id || c) === selectedCollegeFilter);
        const matchesProgram = programFilter === 'all' || t.program === programFilter;
        return matchesSearch && matchesCollege && matchesProgram;
    });

    const sortedTrainers = [...filteredTrainers].sort((a, b) => {
        if (sortBy === 'name-asc') {
            const nameA = `${a.firstName || ''} ${a.lastName || ''}`.trim();
            const nameB = `${b.firstName || ''} ${b.lastName || ''}`.trim();
            return nameA.localeCompare(nameB);
        }
        if (sortBy === 'name-desc') {
            const nameA = `${a.firstName || ''} ${a.lastName || ''}`.trim();
            const nameB = `${b.firstName || ''} ${b.lastName || ''}`.trim();
            return nameB.localeCompare(nameA);
        }
        if (sortBy === 'emp-asc') {
            if (effectiveCollegeId) {
                const locA = a.assignedCourses?.map(c => c.classroomLocation || '').join(', ') || '';
                const locB = b.assignedCourses?.map(c => c.classroomLocation || '').join(', ') || '';
                return locA.localeCompare(locB);
            }
            return (a.employeeId || '').localeCompare(b.employeeId || '');
        }
        if (sortBy === 'emp-desc') {
            if (effectiveCollegeId) {
                const locA = a.assignedCourses?.map(c => c.classroomLocation || '').join(', ') || '';
                const locB = b.assignedCourses?.map(c => c.classroomLocation || '').join(', ') || '';
                return locB.localeCompare(locA);
            }
            return (b.employeeId || '').localeCompare(a.employeeId || '');
        }
        return 0;
    });

    // Removed strict block to allow Global Trainer visibility across all colleges

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <Users className="text-[#004AAD]" size={26} />
                        {effectiveCollegeId ? `Trainers - ${selectedCollegeCode || 'College'}` : 'Trainers'}
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        {effectiveCollegeId ? `Manage assessment facilitators assigned to ${selectedCollegeName || 'this college'}` : 'Manage assessment facilitators · Login via mobile number or Employee ID'}
                    </p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button 
                        onClick={handleExportAllTrainers}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 active:scale-95 transition-all w-full md:w-auto shrink-0 shadow-sm cursor-pointer"
                    >
                        <Download size={16} /> Export All
                    </button>
                    {!isReadOnly && effectiveCollegeId && (
                        <button onClick={() => setIsAssignModalOpen(true)}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 active:scale-95 transition-all w-full md:w-auto shrink-0 shadow-sm cursor-pointer">
                            <Plus size={16} /> Assign Trainer
                        </button>
                    )}
                    {!isReadOnly && (
                        <button onClick={() => { setSelectedTrainer(null); setIsModalOpen(true); }}
                            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#004AAD] text-white text-sm font-bold rounded-xl hover:bg-[#003580] shadow-md shadow-blue-100 hover:shadow-lg active:scale-95 transition-all w-full md:w-auto shrink-0 cursor-pointer">
                            <Plus size={16} /> Add Trainer
                        </button>
                    )}
                </div>
            </div>

            {/* Table card */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
                <div className="px-6 py-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-slate-50/50 min-w-[800px]">
                    <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-sm font-bold text-slate-700 mr-2">{sortedTrainers.length} trainer{sortedTrainers.length !== 1 ? 's' : ''}</h3>
                        
                        <select
                            className="text-xs bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-700 outline-none cursor-pointer focus:border-[#004AAD] focus:ring-1 focus:ring-blue-100 transition-all"
                            value={programFilter}
                            onChange={(e) => setProgramFilter(e.target.value)}
                        >
                            <option value="all">All Programs</option>
                            <option value="EWDP">EWDP</option>
                            <option value="CFS">CFS</option>
                            <option value="PMKVY">PMKVY</option>
                            <option value="CMKKY">CMKKY</option>
                        </select>

                        {!effectiveCollegeId && (
                            <select
                                className="text-xs bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-700 outline-none cursor-pointer focus:border-[#004AAD] focus:ring-1 focus:ring-blue-100 transition-all"
                                value={selectedCollegeFilter}
                                onChange={(e) => setSelectedCollegeFilter(e.target.value)}
                            >
                                <option value="all">All Colleges</option>
                                {colleges.map(c => (
                                    <option key={c._id} value={c._id}>{c.name}</option>
                                ))}
                            </select>
                        )}

                        <select
                            className="text-xs bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-700 outline-none cursor-pointer focus:border-[#004AAD] focus:ring-1 focus:ring-blue-100 transition-all"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="name-asc">Sort: Name (A-Z)</option>
                            <option value="name-desc">Sort: Name (Z-A)</option>
                            <option value="emp-asc">{effectiveCollegeId ? 'Sort: Classroom (A-Z)' : 'Sort: Emp ID (A-Z)'}</option>
                            <option value="emp-desc">{effectiveCollegeId ? 'Sort: Classroom (Z-A)' : 'Sort: Emp ID (Z-A)'}</option>
                        </select>
                    </div>

                    <div className="relative w-72">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-[#004AAD] focus:ring-2 focus:ring-blue-100 transition-all"
                            placeholder={effectiveCollegeId ? "Search by name, mobile or classroom..." : "Search by name, mobile or Emp ID..."} value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)} />
                    </div>
                </div>

                <table className="w-full text-left min-w-[800px]">
                    <thead>
                        <tr className="bg-slate-50">
                            <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Trainer</th>
                            <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">{effectiveCollegeId ? 'Classroom Location' : 'Employee ID'}</th>
                            <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Program</th>
                            <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Mobile / Login</th>
                            <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Course(s)</th>
                            <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr><td colSpan="6" className="px-6 py-16 text-center"><Loader2 className="animate-spin mx-auto text-[#004AAD]" size={24} /></td></tr>
                        ) : sortedTrainers.length === 0 ? (
                            <tr><td colSpan="6" className="px-6 py-16 text-center text-sm text-slate-400">No trainers found</td></tr>
                        ) : sortedTrainers.map((t) => (
                            <tr key={t._id} className="hover:bg-slate-50/50 group">
                                {/* Name */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3 relative">
                                        <div className="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-normal text-sm">
                                            {(t.firstName || t.phone || '?').charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-800">
                                                {`${t.firstName || ''} ${t.lastName || ''}`.trim() || <span className="text-slate-400 italic">No name</span>}
                                            </p>
                                            {t.collegeId?.name && <p className="text-xs text-slate-400">{t.collegeId.name}</p>}
                                        </div>
                                    </div>
                                </td>
                                {/* Employee ID or Classroom Location */}
                                <td className="px-6 py-4">
                                    {effectiveCollegeId ? (
                                        t.assignedCourses?.length > 0 ? (
                                            <div className="flex flex-wrap gap-1">
                                                {t.assignedCourses.map(c => c.classroomLocation).filter(Boolean).map((loc, idx) => (
                                                    <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-[#004AAD] border border-blue-100">
                                                        {loc}
                                                    </span>
                                                ))}
                                                {t.assignedCourses.map(c => c.classroomLocation).filter(Boolean).length === 0 && (
                                                    <span className="text-xs text-slate-400 italic">Not Set</span>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-xs text-slate-400 italic">Not Set</span>
                                        )
                                    ) : t.employeeId ? (
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono bg-indigo-50 text-indigo-700 uppercase border border-indigo-100">
                                            {t.employeeId}
                                        </span>
                                    ) : (
                                        <span className="text-xs text-slate-400 italic">No Emp ID</span>
                                    )}
                                </td>
                                {/* Program */}
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2 py-0.5 bg-blue-50 border border-blue-100 rounded text-[#004AAD] font-bold text-[10px] uppercase">
                                        {t.program || 'EWDP'}
                                    </span>
                                </td>
                                {/* Mobile */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1.5 text-sm text-slate-700">
                                        <Phone size={13} className="text-slate-400" />
                                        <span className="font-mono">{t.phone || '—'}</span>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-0.5">Login ID</p>
                                </td>
                                {/* Courses */}
                                <td className="px-6 py-4">
                                    {t.assignedCourses?.length > 0 ? (
                                        <div className="flex flex-wrap gap-1.5">
                                            {t.assignedCourses.map(c => (
                                                <span key={c._id} className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-[#004AAD] rounded text-xs border border-blue-100" title={c.name}>
                                                    <BookOpen size={9} />
                                                    <span>{c.code}</span>
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-xs text-slate-400 italic">No courses</span>
                                    )}
                                </td>
                                {/* Actions */}
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2 transition-opacity">
                                        <button onClick={() => { setSelectedTrainer(t); setIsProfileOpen(true); }}
                                            className="p-1.5 text-slate-400 hover:text-[#004AAD] rounded-md hover:bg-blue-50" title="View Profile">
                                            <Eye size={16} />
                                        </button>
                                        {t.pdfUrl && (
                                            <a href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/trainers/${t._id}/pdf`} target="_blank" rel="noopener noreferrer"
                                                className="p-1.5 text-red-500 hover:text-red-700 rounded-md hover:bg-red-50 transition-colors inline-block" title="View Trainer Details PDF">
                                                <FileText size={16} />
                                            </a>
                                        )}
                                        {!isReadOnly ? (
                                            !effectiveCollegeId ? (
                                                <>
                                                    <button onClick={() => { setSelectedTrainer(t); setIsModalOpen(true); }}
                                                        className="p-1.5 text-slate-400 hover:text-[#004AAD] rounded-md hover:bg-blue-50" title="Edit Trainer">
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button onClick={() => handleDelete(t._id)}
                                                        className="p-1.5 text-slate-400 hover:text-red-500 rounded-md hover:bg-red-50" title="Delete Trainer">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button onClick={() => { setSelectedTrainer(t); setIsModalOpen(true); }}
                                                        className="p-1.5 text-slate-400 hover:text-[#004AAD] rounded-md hover:bg-blue-50" title="Edit Assigned Courses">
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button onClick={() => handleUnassignTrainer(t)}
                                                        className="p-1.5 text-slate-400 hover:text-red-500 rounded-md hover:bg-red-50" title="Remove Trainer Assignment">
                                                        <XCircle size={16} />
                                                    </button>
                                                </>
                                            )
                                        ) : (
                                            <span className="text-xs text-slate-400 italic">Read-only</span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <TrainerModal
                isOpen={isModalOpen}
                trainer={selectedTrainer}
                colleges={colleges}
                courses={courses}
                selectedCollegeId={effectiveCollegeId}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
            />

            <TrainerProfileModal
                isOpen={isProfileOpen}
                trainer={selectedTrainer}
                token={token}
                onClose={() => setIsProfileOpen(false)}
                onRefresh={fetchData}
                effectiveCollegeId={effectiveCollegeId}
                courses={courses}
                onEdit={(trainer) => {
                    setIsProfileOpen(false);
                    setSelectedTrainer(trainer);
                    setIsModalOpen(true);
                }}
                onDelete={(id) => {
                    setIsProfileOpen(false);
                    handleDelete(id);
                }}
            />

            <AssignTrainerModal
                isOpen={isAssignModalOpen}
                trainers={trainers}
                globalTrainers={globalTrainers}
                courses={courses}
                effectiveCollegeId={effectiveCollegeId}
                onClose={() => setIsAssignModalOpen(false)}
                onSave={handleAssignTrainerSave}
            />

            <ConfirmModal
                isOpen={forceAssignConfirmState.isOpen}
                onClose={() => setForceAssignConfirmState({ isOpen: false, existingTrainer: null })}
                onConfirm={handleForceAssignConfirm}
                title="Trainer College Assignment Conflict"
                message={
                    forceAssignConfirmState.existingTrainer ? (
                        <span>
                            Whoa there, copycat! Trainer <strong>{`${forceAssignConfirmState.existingTrainer.firstName || ''} ${forceAssignConfirmState.existingTrainer.lastName || ''}`.trim() || forceAssignConfirmState.existingTrainer.phone}</strong> is already in our records, currently registered with <strong>{forceAssignConfirmState.existingTrainer.collegeName}</strong>.
                            <br /><br />
                            We haven't perfected human cloning yet. Since you are the Administrator, would you like to use your admin authority to force-assign them to <strong>{selectedCollegeName || 'this college'}</strong> instead of creating a duplicate?
                        </span>
                    ) : ''
                }
                confirmText="Confirm Force-Assign"
                type="warning"
                maxWidthClass="max-w-2xl"
            />
        </div>
    );
};

export default Trainers;
