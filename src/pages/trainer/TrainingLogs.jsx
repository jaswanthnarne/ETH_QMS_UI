import { useState, useEffect } from 'react';
import { 
    FileText, Plus, Trash2, Edit, Clock, BookOpen, Users, Calendar, X, Save, ArrowLeft, Loader2, Info, Eye, Search, Download
} from 'lucide-react';
import axios from 'axios';
import useAuthStore from '../../store/authStore';
import useCollegeStore from '../../store/collegeStore';
import useSocketUpdate from '../../hooks/useSocketUpdate';
import { AlertModal, ConfirmModal } from '../../components/Modals';

const DEFAULT_BATCH = () => ({
    batchName: '',
    timeSlot: '9:00 AM - 10:00 AM',
    department: '',
    moduleTaught: '',
    actualCount: 60,
    presentCount: 60,
    topicsCovered: ''
});

const normalizeId = (id) => {
    if (!id) return '';
    if (typeof id === 'object') {
        return (id._id || id.id || '').toString().toLowerCase().trim();
    }
    return id.toString().toLowerCase().trim();
};

const TrainingLogs = () => {
    const { token, user } = useAuthStore();
    const { selectedCollegeId } = useCollegeStore();
    const [logs, setLogs] = useState([]);
    const [colleges, setColleges] = useState([]);
    const [courses, setCourses] = useState([]);
    const [batchesList, setBatchesList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingCourses, setLoadingCourses] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [creatingCourse, setCreatingCourse] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Custom modals states
    const [alertState, setAlertState] = useState({ isOpen: false, title: '', message: '', type: 'info' });
    const [confirmState, setConfirmState] = useState({ isOpen: false, title: '', message: '', onConfirm: () => {} });

    // Modal states
    const [formOpen, setFormOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingLogId, setEditingLogId] = useState(null);
    const [viewOpen, setViewOpen] = useState(false);
    const [selectedLog, setSelectedLog] = useState(null);
    const [courseModalOpen, setCourseModalOpen] = useState(false);

    // Form state for daily logs
    const [formData, setFormData] = useState({
        collegeId: '',
        courseId: '',
        startDate: '',
        logDate: new Date().toISOString().slice(0, 10),
        batches: [DEFAULT_BATCH()]
    });

    // Form state for creating a new course mapped to a college inline
    const [courseForm, setCourseForm] = useState({
        name: '',
        code: '',
        description: ''
    });

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const collegeQuery = selectedCollegeId ? `?collegeId=${selectedCollegeId}` : '';
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/trainer/logs${collegeQuery}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLogs(res.data.data || []);
        } catch (e) {
            console.error('Failed to load training logs', e);
        } finally {
            setLoading(false);
        }
    };

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

    const fetchCoursesForCollege = async (collegeId) => {
        if (!collegeId) {
            setCourses([]);
            return;
        }
        try {
            setLoadingCourses(true);
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/colleges/${collegeId}/courses`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCourses(res.data.data || []);
        } catch (e) {
            console.error('Failed to load college courses', e);
        } finally {
            setLoadingCourses(false);
        }
    };

    const fetchTrainerBatches = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/trainer/batches`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBatchesList(res.data.data || []);
        } catch (e) {
            console.error('Failed to load trainer batches', e);
        }
    };

    useEffect(() => {
        if (token) {
            fetchLogs();
            fetchColleges();
            fetchTrainerBatches();
        }
    }, [token, selectedCollegeId]);

    useSocketUpdate(() => {
        fetchLogs();
    }, ['training_logs']);

    // Re-fetch courses when selected college in the form changes
    useEffect(() => {
        fetchCoursesForCollege(formData.collegeId);
    }, [formData.collegeId]);

    const handleOpenCreate = () => {
        fetchTrainerBatches();
        setFormData({
            collegeId: selectedCollegeId || '',
            courseId: '',
            startDate: new Date().toISOString().slice(0, 10),
            logDate: new Date().toISOString().slice(0, 10),
            batches: [DEFAULT_BATCH()]
        });
        setIsEditing(false);
        setFormOpen(true);
    };

    const handleOpenEdit = (log) => {
        fetchTrainerBatches();
        setFormData({
            collegeId: normalizeId(log.collegeId),
            courseId: normalizeId(log.courseId),
            startDate: log.startDate ? new Date(log.startDate).toISOString().slice(0, 10) : '',
            logDate: log.logDate ? new Date(log.logDate).toISOString().slice(0, 10) : '',
            batches: log.batches?.map(b => ({ ...b })) || [DEFAULT_BATCH()]
        });
        setEditingLogId(log._id);
        setIsEditing(true);
        setFormOpen(true);
    };

    const handleOpenView = (log) => {
        setSelectedLog(log);
        setViewOpen(true);
    };

    const handleAddBatch = () => {
        setFormData(prev => ({
            ...prev,
            batches: [...prev.batches, {
                ...DEFAULT_BATCH()
            }]
        }));
    };

    const handleRemoveBatch = (index) => {
        if (formData.batches.length === 1) return;
        setFormData(prev => ({
            ...prev,
            batches: prev.batches.filter((_, idx) => idx !== index)
        }));
    };

    const handleBatchFieldChange = (index, field, value) => {
        setFormData(prev => {
            const newBatches = [...prev.batches];
            newBatches[index] = { ...newBatches[index], [field]: value };
            return { ...prev, batches: newBatches };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.collegeId || !formData.courseId || !formData.startDate || !formData.logDate) {
            setAlertState({
                isOpen: true,
                title: 'Validation Error',
                message: 'Please fill out all required course information.',
                type: 'error'
            });
            return;
        }

        setSubmitting(true);
        try {
            if (isEditing) {
                await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/trainer/logs/${editingLogId}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAlertState({
                    isOpen: true,
                    title: 'Success',
                    message: 'Daily training log updated!',
                    type: 'success'
                });
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/trainer/logs`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAlertState({
                    isOpen: true,
                    title: 'Success',
                    message: 'Daily training log created!',
                    type: 'success'
                });
            }
            setFormOpen(false);
            fetchLogs();
        } catch (error) {
            setAlertState({
                isOpen: true,
                title: 'Action Failed',
                message: error.response?.data?.error || 'Failed to submit log',
                type: 'error'
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleCreateCourseInline = async (e) => {
        e.preventDefault();
        if (!formData.collegeId) {
            setAlertState({
                isOpen: true,
                title: 'Validation Error',
                message: 'Please select a college first.',
                type: 'error'
            });
            return;
        }
        if (!courseForm.name || !courseForm.code) {
            setAlertState({
                isOpen: true,
                title: 'Validation Error',
                message: 'Course Name and Course Code are required.',
                type: 'error'
            });
            return;
        }

        setCreatingCourse(true);
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/colleges/${formData.collegeId}/courses`,
                courseForm,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setAlertState({
                isOpen: true,
                title: 'Success',
                message: 'New course created and mapped to college!',
                type: 'success'
            });
            
            // Reload courses for current college
            const updatedCoursesRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/colleges/${formData.collegeId}/courses`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const updatedCourses = updatedCoursesRes.data.data || [];
            setCourses(updatedCourses);

            // Auto-select the newly created course
            const createdCourseId = res.data.data?._id;
            if (createdCourseId) {
                setFormData(prev => ({ ...prev, courseId: createdCourseId }));
            }

            // Close inline modal and reset fields
            setCourseModalOpen(false);
            setCourseForm({ name: '', code: '', description: '' });
        } catch (error) {
            setAlertState({
                isOpen: true,
                title: 'Action Failed',
                message: error.response?.data?.error || 'Failed to create course',
                type: 'error'
            });
        } finally {
            setCreatingCourse(false);
        }
    };

    const handleDelete = async (id) => {
        setConfirmState({
            isOpen: true,
            title: 'Delete Daily Log',
            message: 'Are you sure you want to permanently delete this daily log?',
            onConfirm: async () => {
                try {
                    await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/trainer/logs/${id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    fetchLogs();
                } catch (error) {
                    setAlertState({
                        isOpen: true,
                        title: 'Delete Failed',
                        message: error.response?.data?.error || 'Failed to delete daily log',
                        type: 'error'
                    });
                }
            }
        });
    };

    const [selectedCollege, setSelectedCollege] = useState(selectedCollegeId || 'all');
    const [selectedCourse, setSelectedCourse] = useState('all');
    const [filterCourses, setFilterCourses] = useState([]);
    const [loadingFilterCourses, setLoadingFilterCourses] = useState(false);
    const [exportLoading, setExportLoading] = useState(false);

    // Sync selectedCollege filter when selectedCollegeId context changes
    useEffect(() => {
        setSelectedCollege(selectedCollegeId || 'all');
    }, [selectedCollegeId]);

    const fetchFilterCourses = async (collegeId) => {
        if (!collegeId || collegeId === 'all') {
            setFilterCourses([]);
            return;
        }
        try {
            setLoadingFilterCourses(true);
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/colleges/${collegeId}/courses`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFilterCourses(res.data.data || []);
        } catch (e) {
            console.error('Failed to load courses for filter', e);
        } finally {
            setLoadingFilterCourses(false);
        }
    };

    useEffect(() => {
        fetchFilterCourses(selectedCollege);
        setSelectedCourse('all');
    }, [selectedCollege]);

    const handleExport = async () => {
        setExportLoading(true);
        try {
            const collegeQuery = selectedCollege !== 'all' ? `&collegeId=${selectedCollege}` : '';
            const courseQuery = selectedCourse !== 'all' ? `&courseId=${selectedCourse}` : '';
            
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/analytics/export?type=training_logs${collegeQuery}${courseQuery}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    responseType: 'blob'
                }
            );

            const url = window.URL.createObjectURL(res.data);
            const link = document.createElement('a');
            link.href = url;

            let collegeName = 'Overall_Platform';
            if (selectedCollege !== 'all') {
                const matched = colleges.find(c => c._id === selectedCollege);
                if (matched) collegeName = matched.name;
            }

            let filename = `${collegeName.replace(/\s+/g, '_')}_Training_Logs_Report.xlsx`;
            if (selectedCourse !== 'all') {
                const matchedCourse = filterCourses.find(c => c._id === selectedCourse);
                if (matchedCourse) {
                    filename = `${collegeName.replace(/\s+/g, '_')}_Course_${matchedCourse.code}_Training_Logs.xlsx`;
                }
            }

            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('Failed to export training logs', error);
            setAlertState({
                isOpen: true,
                title: 'Export Failed',
                message: 'Failed to generate Excel export.',
                type: 'error'
            });
        } finally {
            setExportLoading(false);
        }
    };

    const filteredLogs = logs.filter(log => {
        const matchesCollege = selectedCollege === 'all' || normalizeId(log.collegeId) === normalizeId(selectedCollege);
        const matchesCourse = selectedCourse === 'all' || normalizeId(log.courseId) === normalizeId(selectedCourse);
        
        const courseName = log.courseId?.name?.toLowerCase() || '';
        const courseCode = log.courseId?.code?.toLowerCase() || '';
        const collegeName = log.collegeId?.name?.toLowerCase() || '';
        const search = searchTerm.toLowerCase();
        const matchesSearch = courseName.includes(search) || courseCode.includes(search) || collegeName.includes(search);
        
        return matchesCollege && matchesCourse && matchesSearch;
    });

    return (
        <div className="space-y-6 pb-12">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Training Progress Logs</h1>
                    <p className="text-sm text-slate-500 mt-1">Record and review daily batch sessions, attendance counts, and curriculum modules taught</p>
                </div>
                <button 
                    onClick={handleOpenCreate} 
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#004AAD] text-white text-sm font-semibold rounded-lg hover:bg-[#003580] shadow-sm transition-all active:scale-95"
                >
                    <Plus size={16} /> Log Daily Batch
                </button>
            </div>

            {/* List panel */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-4 bg-white">
                    <h3 className="text-sm font-semibold text-slate-700">{filteredLogs.length} logged day{filteredLogs.length !== 1 ? 's' : ''}</h3>
                    
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-wrap">
                        {/* College Filter Selection */}
                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 border border-slate-200 rounded-lg shadow-sm">
                            <span className="text-xs font-semibold text-slate-400">College:</span>
                            <select 
                                value={selectedCollege} 
                                onChange={(e) => setSelectedCollege(e.target.value)}
                                className="text-xs font-semibold text-slate-600 bg-transparent outline-none cursor-pointer pr-4"
                            >
                                <option value="all">All Colleges</option>
                                {colleges.map(c => (
                                    <option key={c._id} value={c._id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Course Filter Selection */}
                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 border border-slate-200 rounded-lg shadow-sm">
                            <span className="text-xs font-semibold text-slate-400">Course:</span>
                            <select 
                                value={selectedCourse} 
                                onChange={(e) => setSelectedCourse(e.target.value)}
                                disabled={selectedCollege === 'all' || loadingFilterCourses}
                                className="text-xs font-semibold text-slate-600 bg-transparent outline-none cursor-pointer pr-4 disabled:opacity-50"
                            >
                                <option value="all">All Courses</option>
                                {filterCourses.map(c => (
                                    <option key={c._id} value={c._id}>{c.name} ({c.code})</option>
                                ))}
                            </select>
                        </div>

                        {/* Export Button */}
                        <button 
                            onClick={handleExport}
                            disabled={exportLoading || filteredLogs.length === 0}
                            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-[#004AAD] hover:bg-[#003580] text-white font-semibold rounded-lg text-xs transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
                        >
                            {exportLoading ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
                            Export Logs
                        </button>

                        <div className="relative w-full sm:w-48">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#004AAD]" 
                                placeholder="Search..." 
                                value={searchTerm} 
                                onChange={(e) => setSearchTerm(e.target.value)} 
                            />
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="py-24 flex flex-col items-center justify-center gap-3">
                        <Loader2 className="animate-spin text-[#004AAD]" size={24} />
                        <p className="text-xs font-semibold text-slate-400">Loading progress logbook...</p>
                    </div>
                ) : logs.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center text-center">
                        <FileText size={48} className="text-slate-200 mb-4" />
                        <h3 className="text-base font-bold text-slate-700">No training logs recorded</h3>
                        <p className="text-sm text-slate-400 mt-1 max-w-sm">Keep a clean record of your daily batches, module items, and attendee statistics.</p>
                        <button 
                            onClick={handleOpenCreate} 
                            className="mt-5 flex items-center gap-2 px-4 py-2 border border-[#004AAD] text-[#004AAD] text-xs font-bold rounded-lg hover:bg-blue-50 transition-all"
                        >
                            Log First Batch Day
                        </button>
                    </div>
                ) : filteredLogs.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        No training logs match the search query.
                    </div>
                ) : (
                    <div>
                        {/* Table View (Desktop & Tablet) */}
                        <div className="hidden lg:block overflow-x-auto">
                            <table className="w-full text-left border-collapse text-sm text-slate-700">
                                <thead>
                                    <tr className="bg-slate-50">
                                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Log Date</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">College</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Course Name</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Start Date</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-center">Batches Held</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-center">Avg Attendance</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredLogs.map((log) => {
                                        const totalPresent = log.batches?.reduce((acc, b) => acc + (b.presentCount || 0), 0) || 0;
                                        const totalActual = log.batches?.reduce((acc, b) => acc + (b.actualCount || 1), 0) || 1;
                                        const avgPercent = ((totalPresent / totalActual) * 100).toFixed(0);

                                        return (
                                            <tr key={log._id} className="hover:bg-slate-50/50 group">
                                                <td className="px-6 py-4 font-semibold text-slate-900">
                                                    {new Date(log.logDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </td>
                                                <td className="px-6 py-4 font-medium text-slate-700">{log.collegeId?.name || '—'}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-[#004AAD]">{log.courseId?.name || '—'}</span>
                                                        {log.courseId?.code && (
                                                            <span className="text-[10px] text-slate-400 font-bold mt-0.5">{log.courseId.code}</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                                                    {log.startDate ? new Date(log.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="px-2 py-0.5 bg-blue-50 text-[#004AAD] rounded text-xs font-bold">
                                                        {log.batches?.length || 0} batches
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex items-center justify-center gap-1.5">
                                                        <span className="font-bold text-slate-900">{totalPresent}/{totalActual}</span>
                                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                                            parseInt(avgPercent) >= 85 ? 'bg-emerald-50 text-emerald-700' : parseInt(avgPercent) >= 60 ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                                                        }`}>
                                                            {avgPercent}%
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                                                        <button 
                                                            onClick={() => handleOpenView(log)} 
                                                            className="p-1.5 text-slate-400 hover:text-[#004AAD] hover:bg-blue-50 rounded" 
                                                            title="View Details"
                                                        >
                                                            <Eye size={15} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleOpenEdit(log)} 
                                                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded" 
                                                            title="Edit Log"
                                                        >
                                                            <Edit size={15} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(log._id)} 
                                                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded" 
                                                            title="Delete Log"
                                                        >
                                                            <Trash2 size={15} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Card View (Mobile & Tablet) */}
                        <div className="lg:hidden divide-y divide-slate-100">
                            {filteredLogs.map((log) => {
                                const totalPresent = log.batches?.reduce((acc, b) => acc + (b.presentCount || 0), 0) || 0;
                                const totalActual = log.batches?.reduce((acc, b) => acc + (b.actualCount || 1), 0) || 1;
                                const avgPercent = ((totalPresent / totalActual) * 100).toFixed(0);

                                return (
                                    <div key={log._id} className="p-4 space-y-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className="text-xs font-bold text-slate-800">
                                                    {new Date(log.logDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </span>
                                                <h4 className="font-bold text-[#004AAD] text-sm mt-0.5">{log.courseId?.name || '—'}</h4>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <button onClick={() => handleOpenView(log)} className="p-1.5 text-slate-400 hover:text-[#004AAD] hover:bg-blue-50 rounded"><Eye size={15} /></button>
                                                <button onClick={() => handleOpenEdit(log)} className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded"><Edit size={15} /></button>
                                                <button onClick={() => handleDelete(log._id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"><Trash2 size={15} /></button>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                                            <div>
                                                <span className="block font-bold text-slate-400 text-[10px] uppercase">College</span>
                                                <span className="font-medium text-slate-700">{log.collegeId?.name || '—'}</span>
                                            </div>
                                            <div>
                                                <span className="block font-bold text-slate-400 text-[10px] uppercase">Stats</span>
                                                <div className="flex flex-col gap-0.5 mt-0.5">
                                                    <span className="font-bold text-[#004AAD]">{log.batches?.length || 0} batches</span>
                                                    <span className="text-[10px] text-slate-500 font-semibold">{totalPresent}/{totalActual} Present ({avgPercent}%)</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* ========== ADD / EDIT PROGRESS LOG MODAL ========== */}
            {formOpen && (
                <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-6 relative max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-150">
                        {/* Close button */}
                        <button 
                            onClick={() => setFormOpen(false)} 
                            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all"
                        >
                            <X size={18} />
                        </button>

                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                                <Calendar size={20} className="text-[#004AAD]" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">{isEditing ? 'Modify Daily Progress Log' : 'Create Daily Progress Log'}</h3>
                                <p className="text-xs text-slate-400">Map your courses and batches to document your engagement progress</p>
                            </div>
                        </div>

                        {/* Modal form scroll content */}
                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-1.5 space-y-6">
                            {/* Course / College metadata info card */}
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Course / College Mapping</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-600 mb-1">Target College *</label>
                                        <select 
                                            required
                                            value={formData.collegeId} 
                                            onChange={e => setFormData(prev => ({ ...prev, collegeId: e.target.value, courseId: '' }))}
                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:border-[#004AAD] outline-none"
                                        >
                                            <option value="">Select College</option>
                                            {colleges.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center justify-between">
                                            <span>Target Course *</span>
                                            {formData.collegeId && (
                                                <button 
                                                    type="button" 
                                                    onClick={() => setCourseModalOpen(true)}
                                                    className="text-[10px] text-[#004AAD] font-bold hover:underline"
                                                >
                                                    + Create Course
                                                </button>
                                            )}
                                        </label>
                                        <div className="flex gap-2 items-center">
                                            <select 
                                                required
                                                disabled={!formData.collegeId || loadingCourses}
                                                value={formData.courseId} 
                                                onChange={e => setFormData(prev => ({ ...prev, courseId: e.target.value }))}
                                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:border-[#004AAD] outline-none disabled:opacity-60 font-semibold"
                                            >
                                                <option value="">
                                                    {!formData.collegeId ? 'Select college first' : loadingCourses ? 'Loading college courses...' : courses.length === 0 ? 'No courses found — click create' : 'Select Course'}
                                                </option>
                                                {courses.map(c => <option key={c._id} value={c._id}>{c.name} ({c.code})</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-600 mb-1">Trainer Engagement Start Date *</label>
                                        <input 
                                            type="date" 
                                            required
                                            value={formData.startDate}
                                            onChange={e => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:border-[#004AAD] outline-none font-semibold"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-600 mb-1">Daily Log Date *</label>
                                        <input 
                                            type="date" 
                                            required
                                            value={formData.logDate}
                                            onChange={e => setFormData(prev => ({ ...prev, logDate: e.target.value }))}
                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:border-[#004AAD] outline-none font-semibold"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Batch information lists */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Batches Conducted on Same Day</h4>
                                    <button 
                                        type="button" 
                                        onClick={handleAddBatch} 
                                        className="text-xs font-bold text-[#004AAD] bg-blue-50 border border-blue-100 hover:bg-blue-100 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                                    >
                                        <Plus size={12} /> Add Time Slot Batch
                                    </button>
                                </div>

                                {formData.batches.map((batch, index) => (
                                    <div key={index} className="border border-slate-200 rounded-xl p-4 bg-white space-y-4 relative shadow-sm hover:border-slate-300 transition-colors">
                                        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="w-6 h-6 bg-slate-100 text-slate-700 font-bold rounded-full flex items-center justify-center text-xs">
                                                    {index + 1}
                                                </span>
                                            </div>
                                            {formData.batches.length > 1 && (
                                                <button 
                                                    type="button" 
                                                    onClick={() => handleRemoveBatch(index)} 
                                                    className="p-1 text-slate-300 hover:text-red-500 rounded hover:bg-red-50 transition-all"
                                                    title="Remove this batch"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            <div>
                                                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Select Batch *</label>
                                                {(() => {
                                                    const filteredTemplates = batchesList.filter(
                                                        b => normalizeId(b.collegeId) === normalizeId(formData.collegeId) && 
                                                             normalizeId(b.courseId) === normalizeId(formData.courseId)
                                                    );

                                                    if (filteredTemplates.length === 0) {
                                                        return (
                                                            <select 
                                                                required
                                                                disabled
                                                                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none opacity-60"
                                                            >
                                                                <option value="">No batches saved</option>
                                                            </select>
                                                        );
                                                    }

                                                    return (
                                                        <select 
                                                            required
                                                            value={batch.batchName}
                                                            onChange={e => {
                                                                const name = e.target.value;
                                                                handleBatchFieldChange(index, 'batchName', name);
                                                                const matched = filteredTemplates.find(t => t.batchName === name);
                                                                if (matched) {
                                                                    handleBatchFieldChange(index, 'department', matched.department);
                                                                }
                                                            }}
                                                            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-[#004AAD] outline-none font-semibold"
                                                        >
                                                            <option value="">Choose Batch</option>
                                                            {filteredTemplates.map(t => (
                                                                <option key={t._id} value={t.batchName}>{t.batchName}</option>
                                                            ))}
                                                        </select>
                                                    );
                                                })()}
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Daily Time Slot *</label>
                                                <input 
                                                    type="text" 
                                                    required
                                                    placeholder="e.g. 9:00 AM - 10:00 AM"
                                                    value={batch.timeSlot}
                                                    onChange={e => handleBatchFieldChange(index, 'timeSlot', e.target.value)}
                                                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-[#004AAD] outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Department *</label>
                                                <input 
                                                    type="text" 
                                                    required
                                                    placeholder="e.g. CSE / ECE"
                                                    value={batch.department}
                                                    onChange={e => handleBatchFieldChange(index, 'department', e.target.value)}
                                                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-[#004AAD] outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            <div className="sm:col-span-1">
                                                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Curriculum Module *</label>
                                                {(() => {
                                                    const matchedCourse = courses.find(c => normalizeId(c._id) === normalizeId(formData.courseId));
                                                    const modulesCount = matchedCourse?.modulesCount || 5;
                                                    const modules = Array.from({ length: modulesCount }, (_, i) => `Module ${i + 1}`);

                                                    return (
                                                        <select 
                                                            required
                                                            value={batch.moduleTaught}
                                                            onChange={e => handleBatchFieldChange(index, 'moduleTaught', e.target.value)}
                                                            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-[#004AAD] outline-none"
                                                        >
                                                            <option value="">Select Module</option>
                                                            {modules.map(mod => (
                                                                <option key={mod} value={mod}>{mod}</option>
                                                            ))}
                                                        </select>
                                                    );
                                                })()}
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Actual Student Count *</label>
                                                <input 
                                                    type="number" 
                                                    required
                                                    min="1"
                                                    value={batch.actualCount}
                                                    onChange={e => handleBatchFieldChange(index, 'actualCount', parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-[#004AAD] outline-none font-bold text-center"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Present Student Count *</label>
                                                <input 
                                                    type="number" 
                                                    required
                                                    min="0"
                                                    max={batch.actualCount}
                                                    value={batch.presentCount}
                                                    onChange={e => handleBatchFieldChange(index, 'presentCount', parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-[#004AAD] outline-none font-bold text-center"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Topics Covered / What Happened *</label>
                                            <textarea 
                                                required
                                                rows="2"
                                                placeholder="Explain exactly what topics were taught and any exercises completed during the time slot..."
                                                value={batch.topicsCovered}
                                                onChange={e => handleBatchFieldChange(index, 'topicsCovered', e.target.value)}
                                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-[#004AAD] outline-none resize-none"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Submit area */}
                            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                                <button 
                                    type="button" 
                                    onClick={() => setFormOpen(false)}
                                    className="px-4 py-2 border border-slate-200 text-slate-500 text-sm font-semibold rounded-lg hover:bg-slate-50 active:scale-95 transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={submitting}
                                    className="flex items-center gap-1.5 px-6 py-2 bg-[#004AAD] hover:bg-[#003580] text-white text-sm font-bold rounded-lg shadow disabled:opacity-50 active:scale-95 transition-all"
                                >
                                    {submitting ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                                    {isEditing ? 'Save Updates' : 'Log Day'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ========== VIEW PROGRESS DETAIL MODAL ========== */}
            {viewOpen && selectedLog && (
                <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 relative max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-150">
                        {/* Close button */}
                        <button 
                            onClick={() => setViewOpen(false)} 
                            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all"
                        >
                            <X size={18} />
                        </button>

                        <div className="flex items-center gap-3 mb-5 border-b border-slate-100 pb-3">
                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                                <Eye size={20} className="text-[#004AAD]" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">
                                    {selectedLog.courseId?.name || '—'} 
                                    {selectedLog.courseId?.code && (
                                        <span className="ml-2 text-xs font-semibold px-2 py-0.5 bg-slate-100 rounded text-slate-500 uppercase tracking-wider">{selectedLog.courseId.code}</span>
                                    )}
                                </h3>
                                <p className="text-xs text-slate-500 font-semibold">{selectedLog.collegeId?.name}</p>
                            </div>
                        </div>

                        {/* Detail content scroll */}
                        <div className="flex-1 overflow-y-auto space-y-6 pr-1">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs bg-slate-50 rounded-xl p-4 border border-slate-100">
                                <div>
                                    <span className="text-slate-400 font-semibold uppercase">Log Date</span>
                                    <p className="font-bold text-slate-800 mt-0.5 text-sm">
                                        {new Date(selectedLog.logDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-slate-400 font-semibold uppercase">Trainer Start Date</span>
                                    <p className="font-bold text-slate-800 mt-0.5 text-sm">
                                        {selectedLog.startDate ? new Date(selectedLog.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-slate-400 font-semibold uppercase">Total Batches Conducted</span>
                                    <p className="font-bold text-[#004AAD] mt-0.5 text-sm">
                                        {selectedLog.batches?.length || 0} batches
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Detailed Batches Timeline</h4>
                                
                                {selectedLog.batches?.map((batch, index) => {
                                    const percent = ((batch.presentCount / batch.actualCount) * 100).toFixed(0);
                                    return (
                                        <div key={index} className="border border-slate-100 rounded-xl p-4 bg-white shadow-sm space-y-3">
                                            <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-bold rounded text-[10px] uppercase">
                                                        {batch.batchName}
                                                    </span>
                                                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                                                        <Clock size={11} className="text-[#004AAD]" /> {batch.timeSlot}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-slate-400 font-semibold uppercase">DEPT: {batch.department}</span>
                                            </div>

                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                                                <div>
                                                    <span className="text-slate-400 font-semibold">Curriculum Module</span>
                                                    <p className="font-bold text-slate-800 mt-0.5">{batch.moduleTaught}</p>
                                                </div>
                                                <div>
                                                    <span className="text-slate-400 font-semibold">Attendance Record</span>
                                                    <p className="font-bold text-slate-800 mt-0.5">{batch.presentCount} present / {batch.actualCount} total</p>
                                                </div>
                                                <div>
                                                    <span className="text-slate-400 font-semibold">Attendance Rate</span>
                                                    <p className="mt-0.5"><span className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                                                        parseInt(percent) >= 85 ? 'bg-emerald-50 text-emerald-700' : parseInt(percent) >= 60 ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                                                    }`}>{percent}%</span></p>
                                                </div>
                                            </div>

                                            <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 text-xs mt-2">
                                                <span className="text-slate-400 font-semibold block mb-1">Topics Taught & Progress Logs:</span>
                                                <p className="text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">{batch.topicsCovered}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex justify-end">
                            <button 
                                onClick={() => setViewOpen(false)}
                                className="px-5 py-2 bg-slate-100 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-200 active:scale-95 transition-all"
                            >
                                Close View
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ========== NESTED INLINE CREATE COURSE MODAL ========== */}
            {courseModalOpen && (
                <div className="fixed inset-0 z-[250] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-5 relative animate-in zoom-in-95 duration-100">
                        <button 
                            type="button"
                            onClick={() => setCourseModalOpen(false)} 
                            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all"
                        >
                            <X size={15} />
                        </button>

                        <div className="flex items-center gap-2 mb-4">
                            <BookOpen size={16} className="text-[#004AAD]" />
                            <h4 className="font-bold text-slate-900 text-sm">Create & Map Course</h4>
                        </div>

                        <form onSubmit={handleCreateCourseInline} className="space-y-4">
                            <div>
                                <label className="block text-[11px] font-bold text-slate-500 mb-1">Course Name *</label>
                                <input 
                                    type="text" 
                                    required
                                    placeholder="e.g. Advanced Java & Spring Boot"
                                    value={courseForm.name}
                                    onChange={e => setCourseForm(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-[#004AAD] outline-none font-medium"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-slate-500 mb-1">Course Code (Identifier) *</label>
                                <input 
                                    type="text" 
                                    required
                                    placeholder="e.g. AJ-SB-01"
                                    value={courseForm.code}
                                    onChange={e => setCourseForm(prev => ({ ...prev, code: e.target.value }))}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-[#004AAD] outline-none font-bold"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-slate-500 mb-1">Description (Optional)</label>
                                <textarea 
                                    rows="2"
                                    placeholder="Brief details about topics included..."
                                    value={courseForm.description}
                                    onChange={e => setCourseForm(prev => ({ ...prev, description: e.target.value }))}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-[#004AAD] outline-none resize-none font-medium"
                                />
                            </div>

                            <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
                                <button 
                                    type="button" 
                                    onClick={() => setCourseModalOpen(false)}
                                    className="px-3 py-1.5 border border-slate-200 text-slate-500 text-xs font-semibold rounded-lg hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={creatingCourse}
                                    className="flex items-center gap-1 px-4 py-1.5 bg-[#004AAD] hover:bg-[#003580] text-white text-xs font-bold rounded-lg disabled:opacity-50"
                                >
                                    {creatingCourse ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                                    Create & Select
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Alerts & Confirms */}
            <AlertModal 
                isOpen={alertState.isOpen}
                onClose={() => setAlertState({ ...alertState, isOpen: false })}
                title={alertState.title}
                message={alertState.message}
                type={alertState.type}
            />
            <ConfirmModal 
                isOpen={confirmState.isOpen}
                onClose={() => setConfirmState({ ...confirmState, isOpen: false })}
                title={confirmState.title}
                message={confirmState.message}
                onConfirm={confirmState.onConfirm}
            />
        </div>
    );
};

export default TrainingLogs;
