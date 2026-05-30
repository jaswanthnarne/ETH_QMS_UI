import { useState, useEffect } from 'react';
import { Users, Plus, Search, Phone, Edit2, Trash2, X, Loader2, School, Download, BookOpen, Check, Eye, KeyRound } from 'lucide-react';
import axios from 'axios';
import useAuthStore from '../../store/authStore';
import useCollegeStore from '../../store/collegeStore';
import useSocketUpdate from '../../hooks/useSocketUpdate';

// ─── Modal ────────────────────────────────────────────────────────────────────
const TrainerModal = ({ trainer, isOpen, onClose, onSave, colleges, courses, selectedCollegeId }) => {
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', phone: '', password: '', employeeId: '',
        collegeId: '', assignedColleges: [], assignedCourses: []
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setError(null);
        if (trainer) {
            setFormData({
                firstName: trainer.firstName || '',
                lastName: trainer.lastName || '',
                phone: trainer.phone || '',
                employeeId: trainer.employeeId || '',
                password: '',
                collegeId: trainer.collegeId?._id || trainer.collegeId || selectedCollegeId || '',
                assignedColleges: trainer.assignedColleges?.map(c => c._id || c) || [],
                assignedCourses: trainer.assignedCourses?.map(c => c._id || c) || []
            });
        } else {
            setFormData({
                firstName: '', lastName: '', phone: '', password: '', employeeId: '',
                collegeId: selectedCollegeId || '',
                assignedColleges: [], assignedCourses: []
            });
        }
    }, [trainer, isOpen, selectedCollegeId]);

    const toggleCourse = (cid) => {
        const cur = formData.assignedCourses;
        setFormData({
            ...formData,
            assignedCourses: cur.includes(cid) ? cur.filter(x => x !== cid) : [...cur, cid]
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        await onSave(formData, setError);
        setSubmitting(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
            <div className="bg-white max-w-lg w-full rounded-xl shadow-2xl relative z-10 border border-slate-200 flex flex-col max-h-[90vh]">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center flex-shrink-0">
                    <h3 className="font-bold text-slate-900 text-lg">{trainer ? 'Edit Trainer' : 'Add New Trainer'}</h3>
                    <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400"><X size={18} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 animate-in fade-in-50 duration-200">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm font-semibold rounded-lg border border-red-100 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                            {error}
                        </div>
                    )}
                    {/* Name */}
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

                    {/* Employee ID */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Employee ID <span className="text-[#004AAD]">*</span></label>
                        <input required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none font-mono uppercase"
                            placeholder="e.g. EMP1001" value={formData.employeeId} onChange={e => setFormData({ ...formData, employeeId: e.target.value.toUpperCase() })} />
                        <p className="text-xs text-slate-400 mt-1">Unique trainer code. Can also be used as a login username</p>
                    </div>

                    {/* Mobile */}
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

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            {trainer ? 'New Password (leave blank to keep)' : 'Password *'}
                        </label>
                        <input required={!trainer} minLength={6} type="password" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none"
                            placeholder="Min 6 characters" value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })} />
                    </div>

                    {/* College */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">College</label>
                        <select disabled={!!selectedCollegeId} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none disabled:opacity-60"
                            value={formData.collegeId} onChange={e => setFormData({ ...formData, collegeId: e.target.value })}>
                            <option value="">Global / All Colleges (Unrestricted)</option>
                            {colleges.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                        </select>
                    </div>

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
                        </div>
                    )}

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
const TrainerProfileModal = ({ trainer, isOpen, onClose, onEdit, onDelete, token }) => {
    const [newPassword, setNewPassword] = useState('');
    const [resetting, setResetting] = useState(false);
    const [statusMsg, setStatusMsg] = useState(null);

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

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
            <div className="bg-white max-w-lg w-full rounded-xl shadow-2xl relative z-10 border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
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
                    {/* Main Details Grid */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-4 border-b border-slate-100 pb-5">
                        <div>
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Full Name</span>
                            <span className="text-sm text-slate-700 mt-1 block">
                                {`${trainer.firstName || ''} ${trainer.lastName || ''}`.trim() || '—'}
                            </span>
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Employee ID</span>
                            <span className="inline-flex items-center mt-1 px-2.5 py-0.5 rounded text-xs font-mono bg-indigo-50 text-indigo-700 uppercase border border-indigo-100">
                                {trainer.employeeId || '—'}
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

                    {/* Password Reset Section */}
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
                </div>

                {/* Footer Controls */}
                <div className="px-6 py-4 border-t border-slate-100 flex gap-2 flex-shrink-0 bg-slate-50/50 justify-between">
                    <button
                        onClick={() => onDelete(trainer._id)}
                        className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-xs hover:bg-red-50"
                    >
                        Delete Trainer
                    </button>
                    <div className="flex gap-2">
                        <button
                            onClick={() => onEdit(trainer)}
                            className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs hover:bg-slate-50"
                        >
                            Edit Profile
                        </button>
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

// ─── Main Page ────────────────────────────────────────────────────────────────
const Trainers = () => {
    const [trainers, setTrainers] = useState([]);
    const [colleges, setColleges] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [selectedTrainer, setSelectedTrainer] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { token, user } = useAuthStore();
    const { selectedCollegeId } = useCollegeStore();

    const fetchData = async () => {
        try {
            setLoading(true);
            const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const url = selectedCollegeId
                ? `${baseURL}/admin/trainers?collegeId=${selectedCollegeId}`
                : `${baseURL}/admin/trainers`;
            const [tRes, cRes] = await Promise.all([
                axios.get(url, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${baseURL}/admin/colleges`, { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setTrainers(tRes.data.data);
            setColleges(cRes.data.data);

            // Load courses for the selected college
            if (selectedCollegeId) {
                const courseRes = await axios.get(`${baseURL}/admin/colleges/${selectedCollegeId}/courses`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCourses(courseRes.data.data);
            }
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, [selectedCollegeId]);

    useSocketUpdate(() => fetchData(), ['trainers', 'courses', 'colleges']);

    const handleSave = async (data, setSaveError) => {
        try {
            const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const payload = { ...data };
            if (!payload.password) delete payload.password; // Don't overwrite if empty on edit
            if (selectedTrainer) {
                await axios.put(`${baseURL}/admin/trainers/${selectedTrainer._id}`, payload, { headers: { Authorization: `Bearer ${token}` } });
            } else {
                await axios.post(`${baseURL}/admin/trainers`, payload, { headers: { Authorization: `Bearer ${token}` } });
            }
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            setSaveError(error.response?.data?.error || 'Failed to save trainer');
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

    const handleExport = async (id, name) => {
        try {
            const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const res = await axios.get(`${baseURL}/analytics/export?type=trainer&id=${id}`, {
                headers: { Authorization: `Bearer ${token}` }, responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const a = document.createElement('a');
            a.href = url;
            a.setAttribute('download', `${name}_Report.xlsx`);
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch { alert('Export failed'); }
    };

    const filteredTrainers = trainers.filter(t =>
        `${t.firstName} ${t.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.phone?.includes(searchTerm) ||
        t.employeeId?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Removed strict block to allow Global Trainer visibility across all colleges

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Trainers</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage assessment facilitators · Login via mobile number or Employee ID</p>
                </div>
                <button onClick={() => { setSelectedTrainer(null); setIsModalOpen(true); }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#004AAD] text-white text-sm font-semibold rounded-lg hover:bg-[#003580] shadow-sm">
                    <Plus size={16} /> Add Trainer
                </button>
            </div>

            {/* Table card */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center min-w-[800px]">
                    <h3 className="text-sm font-semibold text-slate-700">{filteredTrainers.length} trainer{filteredTrainers.length !== 1 ? 's' : ''}</h3>
                    <div className="relative w-72">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#004AAD]"
                            placeholder="Search by name, mobile or Emp ID..." value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)} />
                    </div>
                </div>

                <table className="w-full text-left min-w-[800px]">
                    <thead>
                        <tr className="bg-slate-50">
                            <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Trainer</th>
                            <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Employee ID</th>
                            <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Mobile / Login</th>
                            <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Course(s)</th>
                            <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr><td colSpan="5" className="px-6 py-16 text-center"><Loader2 className="animate-spin mx-auto text-[#004AAD]" size={24} /></td></tr>
                        ) : filteredTrainers.length === 0 ? (
                            <tr><td colSpan="5" className="px-6 py-16 text-center text-sm text-slate-400">No trainers found</td></tr>
                        ) : filteredTrainers.map((t) => (
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
                                            <p className="text-xs text-slate-400">{t.collegeId?.name || '—'}</p>
                                        </div>
                                        
                                        {/* Hover tooltip for stats */}
                                        <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 flex items-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                            <div className="bg-slate-900 text-white text-[11px] whitespace-nowrap px-3 py-2 rounded-md shadow-lg flex items-center gap-2 border border-slate-800">
                                                <span className="text-slate-400 text-[9px] uppercase tracking-wider">Tests Conducted</span>
                                                <span className="text-emerald-400 font-medium">{t.testsCount || 0}</span>
                                            </div>
                                            {/* Tooltip caret */}
                                            <div className="absolute right-full top-1/2 -translate-y-1/2 border-[6px] border-transparent border-r-slate-900" />
                                        </div>
                                    </div>
                                </td>
                                {/* Employee ID */}
                                <td className="px-6 py-4">
                                    {t.employeeId ? (
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono bg-indigo-50 text-indigo-700 uppercase border border-indigo-100">
                                            {t.employeeId}
                                        </span>
                                    ) : (
                                        <span className="text-xs text-slate-400 italic">No Emp ID</span>
                                    )}
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
                                        <div className="flex flex-wrap gap-1">
                                            {t.assignedCourses.slice(0, 3).map(c => (
                                                <span key={c._id} className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-[#004AAD] rounded text-xs">
                                                    <BookOpen size={9} />{c.code}
                                                </span>
                                            ))}
                                            {t.assignedCourses.length > 3 && (
                                                <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-xs">+{t.assignedCourses.length - 3}</span>
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-xs text-slate-400 italic">No courses</span>
                                    )}
                                </td>
                                {/* Actions */}
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => { setSelectedTrainer(t); setIsProfileOpen(true); }}
                                            className="p-1.5 text-slate-400 hover:text-[#004AAD] rounded-md hover:bg-blue-50" title="View Profile">
                                            <Eye size={16} />
                                        </button>
                                        <button onClick={() => handleExport(t._id, `${t.firstName}_${t.lastName}`)}
                                            className="p-1.5 text-slate-400 hover:text-[#004AAD] rounded-md hover:bg-blue-50" title="Export Report">
                                            <Download size={16} />
                                        </button>
                                        <button onClick={() => { setSelectedTrainer(t); setIsModalOpen(true); }}
                                            className="p-1.5 text-slate-400 hover:text-[#004AAD] rounded-md hover:bg-blue-50" title="Edit Trainer">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(t._id)}
                                            className="p-1.5 text-slate-400 hover:text-red-500 rounded-md hover:bg-red-50" title="Delete Trainer">
                                            <Trash2 size={16} />
                                        </button>
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
                selectedCollegeId={selectedCollegeId}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
            />

            <TrainerProfileModal
                isOpen={isProfileOpen}
                trainer={selectedTrainer}
                token={token}
                onClose={() => setIsProfileOpen(false)}
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
        </div>
    );
};

export default Trainers;
