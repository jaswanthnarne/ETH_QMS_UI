import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
    School, BookOpen, Users, Layers, Calendar, Plus, Trash2, ArrowLeft, Loader2,
    Building2, Mail, Phone, PlusCircle, CheckCircle, AlertTriangle, Search, Info, ExternalLink, Upload,
    Download
} from 'lucide-react';
import axios from 'axios';
import useAuthStore from '../../store/authStore';
import useSocketUpdate from '../../hooks/useSocketUpdate';

const CollegeDetail = () => {
    const { collegeId } = useParams();
    const navigate = useNavigate();
    const { token, user } = useAuthStore();
    const isReadOnly = ['regional_manager', 'asst_rm'].includes(user?.role);

    // Context & Detail states
    const [college, setCollege] = useState(null);
    const [mappedCourses, setMappedCourses] = useState([]);
    const [globalCourses, setGlobalCourses] = useState([]);
    const [globalTrainers, setGlobalTrainers] = useState([]);
    const [batches, setBatches] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Active Tab
    const [activeTab, setActiveTab] = useState('overview');

    // Mapped Trainers for Selected Course (under Trainers tab)
    const [selectedCourseForTrainers, setSelectedCourseForTrainers] = useState('');
    const [courseTrainers, setCourseTrainers] = useState([]);
    const [loadingTrainers, setLoadingTrainers] = useState(false);

    // Modals
    const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
    const [isTrainerModalOpen, setIsTrainerModalOpen] = useState(false);
    const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);

    // Modal Form States
    const [courseFormData, setCourseFormData] = useState({ courseId: '', customDuration: '', startDate: '', endDate: '' });
    const [trainerFormData, setTrainerFormData] = useState({ trainerId: '' });
    const [batchFormData, setBatchFormData] = useState({
        courseId: '',
        trainerId: '',
        batchName: '',
        department: '',
        program: 'EWDP',
        startDate: '',
        endDate: ''
    });

    const [modalError, setModalError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Filter states
    const [studentSearch, setStudentSearch] = useState('');
    const [batchSearch, setBatchSearch] = useState('');

    const logoInputRef = useRef(null);
    const [uploadingLogo, setUploadingLogo] = useState(false);

    // Sync Page Tab Title with College Code
    useEffect(() => {
        if (college && college.code) {
            document.title = `${college.code} X ETH`;
        }
        return () => {
            document.title = 'Ethnotech Assessment';
        };
    }, [college]);

    const handleLogoUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Size check (5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size exceeds the 5MB limit.');
            return;
        }

        const formData = new FormData();
        formData.append('logo', file);

        setUploadingLogo(true);
        try {
            const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const res = await axios.post(
                `${baseURL}/admin/colleges/${collegeId}/logo`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            setCollege(res.data.data);
            alert('Logo uploaded successfully.');
        } catch (error) {
            console.error('Logo upload error:', error);
            alert(error.response?.data?.error || 'Failed to upload logo');
        } finally {
            setUploadingLogo(false);
            if (logoInputRef.current) {
                logoInputRef.current.value = ''; // Reset input
            }
        }
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const headers = { Authorization: `Bearer ${token}` };

            // Fetch basic details
            const [collegeRes, mappedCoursesRes, globalCoursesRes, globalTrainersRes, batchesRes, studentsRes] = await Promise.all([
                axios.get(`${baseURL}/admin/colleges/${collegeId}`, { headers }),
                axios.get(`${baseURL}/admin/colleges/${collegeId}/mapped-courses`, { headers }),
                axios.get(`${baseURL}/admin/courses`, { headers }),
                axios.get(`${baseURL}/admin/trainers`, { headers }),
                axios.get(`${baseURL}/admin/colleges/${collegeId}/batches`, { headers }),
                axios.get(`${baseURL}/admin/colleges/${collegeId}/students`, { headers })
            ]);

            setCollege(collegeRes.data.data);
            setMappedCourses(mappedCoursesRes.data.data || []);
            setGlobalCourses(globalCoursesRes.data.data || []);
            setGlobalTrainers(globalTrainersRes.data.data || []);
            setBatches(batchesRes.data.data || []);
            setStudents(studentsRes.data.data || []);

            // Set default selected course for trainer mapping if courses exist
            if (mappedCoursesRes.data.data?.length > 0 && !selectedCourseForTrainers) {
                setSelectedCourseForTrainers(mappedCoursesRes.data.data[0].courseId?._id || '');
            }
        } catch (error) {
            console.error('Error fetching college details:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCourseTrainers = async (courseId) => {
        if (!courseId) return;
        setLoadingTrainers(true);
        try {
            const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const headers = { Authorization: `Bearer ${token}` };
            const res = await axios.get(`${baseURL}/admin/colleges/${collegeId}/courses/${courseId}/trainers`, { headers });
            setCourseTrainers(res.data.data || []);
        } catch (error) {
            console.error('Error fetching course trainers:', error);
        } finally {
            setLoadingTrainers(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [collegeId, token]);

    useEffect(() => {
        if (selectedCourseForTrainers) {
            fetchCourseTrainers(selectedCourseForTrainers);
        } else {
            setCourseTrainers([]);
        }
    }, [selectedCourseForTrainers]);

    useSocketUpdate(() => {
        fetchData();
        if (selectedCourseForTrainers) fetchCourseTrainers(selectedCourseForTrainers);
    }, ['colleges', 'courses', 'batches', 'trainers']);

    // ─── Actions ──────────────────────────────────────────────────────────────────
    const handleMapCourse = async (e) => {
        e.preventDefault();
        setModalError('');
        if (!courseFormData.courseId) return setModalError('Please select a course');

        setSubmitting(true);
        try {
            const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            await axios.post(
                `${baseURL}/admin/colleges/${collegeId}/mapped-courses`,
                courseFormData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setIsCourseModalOpen(false);
            setCourseFormData({ courseId: '', customDuration: '', startDate: '', endDate: '' });
            fetchData();
        } catch (error) {
            setModalError(error.response?.data?.error || 'Failed to map course');
        } finally {
            setSubmitting(false);
        }
    };

    const handleUnmapCourse = async (mapId) => {
        if (!window.confirm('Are you sure you want to unmap this course? All trainer course assignments at this college will also be removed.')) return;
        try {
            const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            await axios.delete(
                `${baseURL}/admin/colleges/${collegeId}/mapped-courses/${mapId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchData();
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to remove mapping');
        }
    };

    const handleAssignTrainer = async (e) => {
        e.preventDefault();
        setModalError('');
        if (!selectedCourseForTrainers) return setModalError('No course selected');
        if (!trainerFormData.trainerId) return setModalError('Please select a trainer');

        setSubmitting(true);
        try {
            const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            await axios.post(
                `${baseURL}/admin/colleges/${collegeId}/courses/${selectedCourseForTrainers}/trainers`,
                trainerFormData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setIsTrainerModalOpen(false);
            setTrainerFormData({ trainerId: '' });
            fetchCourseTrainers(selectedCourseForTrainers);
        } catch (error) {
            setModalError(error.response?.data?.error || 'Failed to assign trainer');
        } finally {
            setSubmitting(false);
        }
    };

    const handleRelieveTrainer = async (mapId) => {
        if (!window.confirm('Are you sure you want to relieve this trainer from the course at this college? Active batches will prevent relieving.')) return;
        try {
            const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            await axios.delete(
                `${baseURL}/admin/colleges/${collegeId}/courses/${selectedCourseForTrainers}/trainers/${mapId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchCourseTrainers(selectedCourseForTrainers);
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to relieve trainer');
        }
    };

    const handleCreateBatch = async (e) => {
        e.preventDefault();
        setModalError('');
        const { courseId, trainerId, batchName, department } = batchFormData;

        if (!courseId) return setModalError('Please select a course');
        if (!trainerId) return setModalError('Please assign a trainer');
        if (!batchName.trim()) return setModalError('Batch name is required');
        if (!department.trim()) return setModalError('Department is required');

        setSubmitting(true);
        try {
            const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            await axios.post(
                `${baseURL}/admin/colleges/${collegeId}/courses/${courseId}/batches`,
                batchFormData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setIsBatchModalOpen(false);
            setBatchFormData({
                courseId: '',
                trainerId: '',
                batchName: '',
                department: '',
                program: 'EWDP',
                startDate: '',
                endDate: ''
            });
            fetchData();
        } catch (error) {
            setModalError(error.response?.data?.error || 'Failed to create batch');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteBatch = async (id) => {
        if (!window.confirm('WARNING: Deleting this batch will permanently remove all student accounts in it. Proceed?')) return;
        try {
            const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            await axios.delete(`${baseURL}/admin/batches/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchData();
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to delete batch');
        }
    };

    const handleExportCollege = async () => {
        try {
            const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const res = await axios.get(
                `${baseURL}/analytics/export?type=college_profile&id=${collegeId}`,
                { 
                    headers: { Authorization: `Bearer ${token}` }, 
                    responseType: 'blob' 
                }
            );
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const a = document.createElement('a');
            a.href = url;
            a.setAttribute('download', `${college.code}_Full_Report.xlsx`);
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            console.error('Export error:', error);
            alert('Export failed');
        }
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="animate-spin text-[#004AAD]" size={36} />
            </div>
        );
    }

    if (!college) {
        return (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
                <AlertTriangle className="mx-auto text-red-500 mb-2" size={32} />
                <p className="font-semibold text-slate-700">College Profile Not Found</p>
                <button onClick={() => navigate('/admin/colleges')} className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm">Back to Colleges</button>
            </div>
        );
    }

    // Filtered lists
    const filteredStudents = students.filter(s =>
        s.name?.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.usn?.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.department?.toLowerCase().includes(studentSearch.toLowerCase())
    );

    const filteredBatches = batches.filter(b =>
        b.batchName?.toLowerCase().includes(batchSearch.toLowerCase()) ||
        b.courseId?.name?.toLowerCase().includes(batchSearch.toLowerCase()) ||
        b.trainerId?.firstName?.toLowerCase().includes(batchSearch.toLowerCase())
    );

    // Available courses for mapping
    const mappedCourseIds = mappedCourses.map(mc => mc.courseId?._id);
    const unmappedGlobalCourses = globalCourses.filter(gc => !mappedCourseIds.includes(gc._id) && gc.status === 'active');

    // Course detail mappings for dropdowns
    const activeMappedCourses = mappedCourses.filter(mc => mc.courseId?.status === 'active');

    return (
        <div className="space-y-6 animate-fade-in duration-300">
            {/* Navigation Header */}
            <div className="flex flex-col gap-4">
                <button onClick={() => navigate('/admin/colleges')} className="flex items-center gap-2 text-slate-500 hover:text-[#004AAD] text-sm font-bold w-fit transition-all active:translate-x-[-2px]">
                    <ArrowLeft size={16} /> Back to Institutions
                </button>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-4">
                        <div 
                            onClick={isReadOnly ? undefined : () => logoInputRef.current?.click()}
                            className={`relative group w-14 h-14 rounded-2xl border border-slate-150 flex items-center justify-center shadow-inner shrink-0 ${isReadOnly ? 'cursor-default' : 'cursor-pointer'} overflow-hidden bg-slate-50`}
                            title={isReadOnly ? undefined : "Click to upload/change logo"}
                        >
                            {college.logoUrl ? (
                                <img 
                                    src={college.logoUrl} 
                                    alt={`${college.name} logo`} 
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50/80 text-[#004AAD] flex items-center justify-center font-bold text-xl uppercase">
                                    {college.name.charAt(0)}
                                </div>
                            )}
                            
                            {!isReadOnly && (
                                <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    {uploadingLogo ? (
                                        <Loader2 size={16} className="text-white animate-spin" />
                                    ) : (
                                        <>
                                            <Upload size={16} className="text-white" />
                                            <span className="text-[9px] text-white font-bold mt-0.5">EDIT</span>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                        <input 
                            type="file" 
                            ref={logoInputRef} 
                            onChange={handleLogoUpload} 
                            accept="image/*" 
                            className="hidden" 
                        />
                        <div>
                            <h1 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight">{college.name}</h1>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-500">
                                <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600 border border-slate-200">{college.code}</span>
                                {college.contactEmail && <span className="flex items-center gap-1"><Mail size={12} /> {college.contactEmail}</span>}
                                {college.contactPhone && <span className="flex items-center gap-1"><Phone size={12} /> {college.contactPhone}</span>}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleExportCollege}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex shrink-0"
                        >
                            <Download size={14} /> Export College
                        </button>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${college.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${college.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                            {college.status === 'active' ? 'Active Partner' : 'Suspended'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Tab controls */}
            <div className="flex border-b border-slate-200 gap-1 bg-white p-1 rounded-xl shadow-sm border border-slate-100 w-fit max-w-full overflow-x-auto">
                {['overview', 'courses', 'trainers', 'batches', 'students'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all capitalize tracking-wider ${
                            activeTab === tab 
                                ? 'bg-[#004AAD] text-white shadow-sm' 
                                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50/50'
                        }`}
                    >
                        {tab === 'overview' ? 'Institutional Info' : tab}
                    </button>
                ))}
            </div>

            {/* TAB CONTENTS */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[40vh] p-6 animate-in fade-in duration-200">
                {/* 1. OVERVIEW */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        <div className="border-b border-slate-100 pb-4">
                            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2"><School className="text-[#004AAD]" size={18} /> Partner Institution Overview</h3>
                            <p className="text-xs text-slate-400 mt-0.5">Details regarding registry, profile, and physical logs.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-4 md:col-span-1">
                                <div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Official Name</span>
                                    <span className="text-sm font-semibold text-slate-700 block mt-1">{college.name}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Institution Code</span>
                                    <span className="text-xs font-mono font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg border border-slate-200/60 inline-block mt-1 uppercase">{college.code}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Campus Address</span>
                                    <span className="text-sm font-semibold text-slate-600 block mt-1 leading-relaxed">{college.address || 'No campus address uploaded.'}</span>
                                </div>
                            </div>
                            <div className="space-y-4 md:col-span-1">
                                <div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Contact Email</span>
                                    <span className="text-sm font-semibold text-slate-700 block mt-1 flex items-center gap-2"><Mail size={14} className="text-slate-400" />{college.contactEmail || '—'}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Contact Number</span>
                                    <span className="text-sm font-semibold text-slate-700 block mt-1 flex items-center gap-2"><Phone size={14} className="text-slate-400" />{college.contactPhone || '—'}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Status</span>
                                    <span className={`inline-flex items-center gap-1.5 mt-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase ${college.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-150'}`}>
                                        {college.status}
                                    </span>
                                </div>
                            </div>
                            <div className="md:col-span-1 border border-slate-150 bg-slate-50/50 p-5 rounded-2xl flex flex-col items-center justify-center text-center">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-3">Institutional Logo</span>
                                <div className="relative w-24 h-24 bg-white rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden mb-3 shadow-sm">
                                    {college.logoUrl ? (
                                        <img src={college.logoUrl} alt="College Logo Preview" className="w-full h-full object-contain p-1" />
                                    ) : (
                                        <Building2 size={36} className="text-slate-300" />
                                    )}
                                    {uploadingLogo && (
                                        <div className="absolute inset-0 bg-white/75 flex items-center justify-center">
                                            <Loader2 size={20} className="text-[#004AAD] animate-spin" />
                                        </div>
                                    )}
                                </div>
                                {!isReadOnly && (
                                    <button 
                                        onClick={() => logoInputRef.current?.click()}
                                        disabled={uploadingLogo}
                                        className="flex items-center gap-1.5 px-3.5 py-2 bg-[#004AAD] text-white text-xs font-bold rounded-xl hover:bg-[#003580] transition-colors disabled:opacity-50 shadow-sm"
                                    >
                                        <Upload size={13} /> {college.logoUrl ? 'Update Logo' : 'Upload Logo'}
                                    </button>
                                )}
                                <span className="text-[9px] text-slate-400 mt-2">PNG, JPG up to 5MB</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. COURSES */}
                {activeTab === 'courses' && (
                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 gap-4">
                            <div>
                                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2"><BookOpen className="text-[#004AAD]" size={18} /> Mapped Curricula</h3>
                                <p className="text-xs text-slate-400 mt-0.5">Courses currently authorized for delivery at this college.</p>
                            </div>
                            {!isReadOnly && (
                                <button 
                                    onClick={() => { setModalError(''); setIsCourseModalOpen(true); }}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#004AAD] text-white text-xs font-bold rounded-xl hover:bg-[#003580] shadow-sm transition-all"
                                >
                                    <Plus size={14} /> Map Global Course
                                </button>
                            )}
                        </div>

                        {mappedCourses.length === 0 ? (
                            <div className="py-12 text-center">
                                <BookOpen className="mx-auto text-slate-300 mb-2" size={32} />
                                <p className="text-sm text-slate-400 font-medium">No courses mapped to this college yet.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto border border-slate-200/60 rounded-xl">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                            <th className="px-5 py-3">Course</th>
                                            <th className="px-5 py-3">Program</th>
                                            <th className="px-5 py-3">Code</th>
                                            <th className="px-5 py-3">Duration</th>
                                            <th className="px-5 py-3">Term Dates</th>
                                            <th className="px-5 py-3 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-sm">
                                        {mappedCourses.map((mc) => (
                                            <tr key={mc._id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-5 py-4">
                                                    <p className="font-semibold text-slate-800">{mc.courseId?.name || 'Deleted Course'}</p>
                                                    {mc.courseId?.description && <p className="text-xs text-slate-400 mt-0.5 line-clamp-1 max-w-sm">{mc.courseId.description}</p>}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className="px-2 py-0.5 bg-blue-50 border border-blue-100 rounded text-[#004AAD] font-bold text-[10px] uppercase">
                                                        {mc.courseId?.program || 'EWDP'}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <code className="px-2 py-0.5 bg-slate-100 text-xs font-mono font-bold text-slate-600 rounded-md border border-slate-200/50">{mc.courseId?.code || '—'}</code>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className="text-slate-600 font-semibold">{mc.customDuration || 'Default'}</span>
                                                </td>
                                                <td className="px-5 py-4 text-xs font-medium text-slate-500">
                                                    {mc.startDate ? (
                                                        <span>{new Date(mc.startDate).toLocaleDateString()} to {mc.endDate ? new Date(mc.endDate).toLocaleDateString() : 'Ongoing'}</span>
                                                    ) : (
                                                        <span className="italic text-slate-400">Not Scheduled</span>
                                                    )}
                                                </td>
                                                <td className="px-5 py-4 text-right">
                                                    {!isReadOnly && (
                                                        <button 
                                                            onClick={() => handleUnmapCourse(mc._id)}
                                                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Remove mapping"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* 3. TRAINERS */}
                {activeTab === 'trainers' && (
                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 gap-4">
                            <div>
                                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2"><Users className="text-[#004AAD]" size={18} /> Course Trainer Assignment</h3>
                                <p className="text-xs text-slate-400 mt-0.5">Assign qualified trainers to delivered curricula.</p>
                            </div>
                            {!isReadOnly && activeMappedCourses.length > 0 && (
                                <button 
                                    onClick={() => { setModalError(''); setIsTrainerModalOpen(true); }}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#004AAD] text-white text-xs font-bold rounded-xl hover:bg-[#003580] shadow-sm transition-all"
                                >
                                    <Plus size={14} /> Assign Trainer to Course
                                </button>
                            )}
                        </div>

                        {activeMappedCourses.length === 0 ? (
                            <div className="py-12 text-center">
                                <Info className="mx-auto text-slate-300 mb-2" size={32} />
                                <p className="text-sm text-slate-400 font-medium">Please map courses to this college first before assigning trainers.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                                {/* Course list side selector */}
                                <div className="lg:col-span-1 space-y-2 border-r border-slate-200 pr-4">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Select Course Context</span>
                                    {activeMappedCourses.map(mc => (
                                        <button
                                            key={mc.courseId._id}
                                            onClick={() => setSelectedCourseForTrainers(mc.courseId._id)}
                                            className={`w-full px-4 py-3 text-left rounded-xl border text-xs font-bold transition-all flex flex-col gap-1 ${
                                                selectedCourseForTrainers === mc.courseId._id
                                                    ? 'bg-blue-50 border-[#004AAD] text-[#004AAD]'
                                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                            }`}
                                        >
                                            <span className="truncate block">{mc.courseId.name}</span>
                                            <code className="text-[10px] font-mono text-slate-400 uppercase">{mc.courseId.code}</code>
                                        </button>
                                    ))}
                                </div>

                                {/* Active course trainer rosters */}
                                <div className="lg:col-span-3 space-y-4">
                                    <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5 uppercase tracking-wider">
                                        Assigned Trainers ({courseTrainers.length})
                                    </span>

                                    {loadingTrainers ? (
                                        <div className="flex h-32 items-center justify-center"><Loader2 className="animate-spin text-[#004AAD]" size={24} /></div>
                                    ) : courseTrainers.length === 0 ? (
                                        <div className="py-10 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                                            <Users className="mx-auto text-slate-300 mb-2" size={24} />
                                            <p className="text-xs text-slate-400 font-semibold">No trainers assigned to this course at this college yet.</p>
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto border border-slate-200/60 rounded-xl">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                                        <th className="px-5 py-3">Trainer</th>
                                                        <th className="px-5 py-3">Employee ID</th>
                                                        <th className="px-5 py-3">Program</th>
                                                        <th className="px-5 py-3">Contact</th>
                                                        <th className="px-5 py-3">Active Batches</th>
                                                        <th className="px-5 py-3 text-right">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100 text-sm">
                                                    {courseTrainers.map((ct) => (
                                                        <tr key={ct._id} className="hover:bg-slate-50/50 transition-colors">
                                                            <td className="px-5 py-4">
                                                                <span className="font-semibold text-slate-800">{ct.trainerId?.firstName} {ct.trainerId?.lastName}</span>
                                                            </td>
                                                            <td className="px-5 py-4">
                                                                <code className="px-2 py-0.5 bg-slate-100 text-xs font-mono font-bold text-slate-600 rounded-md border border-slate-200/50 uppercase">{ct.trainerId?.employeeId || '—'}</code>
                                                            </td>
                                                            <td className="px-5 py-4">
                                                                <span className="px-2 py-0.5 bg-blue-50 border border-blue-100 rounded text-[#004AAD] font-bold text-[10px] uppercase">
                                                                    {ct.trainerId?.program || '—'}
                                                                </span>
                                                            </td>
                                                            <td className="px-5 py-4 text-xs font-medium text-slate-500">
                                                                <div>{ct.trainerId?.phone || 'No phone'}</div>
                                                                {ct.trainerId?.email && <div className="text-[10px] text-slate-400 mt-0.5">{ct.trainerId.email}</div>}
                                                            </td>
                                                            <td className="px-5 py-4">
                                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${ct.activeBatchCount > 0 ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-150 text-slate-500'}`}>
                                                                    {ct.activeBatchCount || 0} Batch(es)
                                                                </span>
                                                            </td>
                                                            <td className="px-5 py-4 text-right">
                                                                {!isReadOnly && (
                                                                    <button 
                                                                        onClick={() => handleRelieveTrainer(ct._id)}
                                                                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                                        title="Relieve Trainer"
                                                                    >
                                                                        <Trash2 size={16} />
                                                                    </button>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* 4. BATCHES */}
                {activeTab === 'batches' && (
                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center border-b border-slate-100 pb-4 gap-4">
                            <div>
                                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2"><Layers className="text-[#004AAD]" size={18} /> College Batches</h3>
                                <p className="text-xs text-slate-400 mt-0.5">Manage study cohorts, departments, and course-trainer mappings.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="relative w-52 sm:w-60">
                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input 
                                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-[#004AAD]" 
                                        placeholder="Search batches..." 
                                        value={batchSearch} 
                                        onChange={(e) => setBatchSearch(e.target.value)} 
                                    />
                                </div>
                                {!isReadOnly && activeMappedCourses.length > 0 && (
                                    <button 
                                        onClick={() => { setModalError(''); setIsBatchModalOpen(true); }}
                                        className="flex items-center gap-2 px-4 py-2 bg-[#004AAD] text-white text-xs font-bold rounded-xl hover:bg-[#003580] shadow-sm transition-all shrink-0"
                                    >
                                        <Plus size={14} /> Add Batch
                                    </button>
                                )}
                            </div>
                        </div>

                        {batches.length === 0 ? (
                            <div className="py-12 text-center">
                                <Layers className="mx-auto text-slate-300 mb-2" size={32} />
                                <p className="text-sm text-slate-400 font-medium">No batches created for this college yet.</p>
                            </div>
                        ) : filteredBatches.length === 0 ? (
                            <p className="text-sm text-slate-400 font-semibold py-8 text-center">No batches match your query.</p>
                        ) : (
                            <div className="overflow-x-auto border border-slate-200/60 rounded-xl">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                            <th className="px-5 py-3">Batch Name</th>
                                            <th className="px-5 py-3">Course</th>
                                            <th className="px-5 py-3">Trainer</th>
                                            <th className="px-5 py-3">Program</th>
                                            <th className="px-5 py-3">Roster Count</th>
                                            <th className="px-5 py-3">Status</th>
                                            <th className="px-5 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-150 text-sm">
                                        {filteredBatches.map((b) => (
                                            <tr key={b._id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-5 py-4">
                                                    <div className="font-semibold text-slate-800">{b.batchName}</div>
                                                    <div className="text-[11px] text-slate-400 mt-0.5 uppercase font-medium">{b.department}</div>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <p className="font-semibold text-slate-700">{b.courseId?.name || '—'}</p>
                                                    <code className="text-[10px] font-mono font-bold text-slate-400 uppercase">{b.courseId?.code || '—'}</code>
                                                </td>
                                                <td className="px-5 py-4 text-xs font-semibold text-slate-600">
                                                    {b.trainerId ? `${b.trainerId.firstName} ${b.trainerId.lastName}` : '—'}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className="px-2 py-0.5 bg-blue-50 border border-blue-100 rounded text-[#004AAD] font-bold text-[10px] uppercase">
                                                        {b.program || 'EWDP'}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className="text-slate-700 font-bold bg-indigo-50/50 px-2 py-0.5 border border-indigo-100/50 rounded-md text-xs">{b.studentCount || 0} Student(s)</span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                        b.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                                        b.status === 'completed' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-slate-100 text-slate-500'
                                                    }`}>
                                                        {b.status || 'active'}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4 text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <Link 
                                                            to={`/admin/batches/${b._id}`}
                                                            className="p-1.5 text-slate-400 hover:text-[#004AAD] hover:bg-blue-50 rounded-lg transition-colors inline-block"
                                                            title="Roster & Imports"
                                                        >
                                                            <ExternalLink size={16} />
                                                        </Link>
                                                        {!isReadOnly && (
                                                            <button 
                                                                onClick={() => handleDeleteBatch(b._id)}
                                                                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                                title="Delete cohort"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* 5. STUDENTS */}
                {activeTab === 'students' && (
                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center border-b border-slate-100 pb-4 gap-4">
                            <div>
                                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2"><Users className="text-[#004AAD]" size={18} /> Student Registry</h3>
                                <p className="text-xs text-slate-400 mt-0.5">Overview of imported students active at this institution.</p>
                            </div>
                            <div className="relative w-full sm:w-64">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input 
                                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-[#004AAD]" 
                                    placeholder="Search by Name, USN, Department..." 
                                    value={studentSearch} 
                                    onChange={(e) => setStudentSearch(e.target.value)} 
                                />
                            </div>
                        </div>

                        {students.length === 0 ? (
                            <div className="py-12 text-center">
                                <Users className="mx-auto text-slate-300 mb-2" size={32} />
                                <p className="text-sm text-slate-400 font-medium">No students enrolled at this college yet.</p>
                            </div>
                        ) : filteredStudents.length === 0 ? (
                            <p className="text-sm text-slate-400 font-semibold py-8 text-center">No students found matching search context.</p>
                        ) : (
                            <div className="overflow-x-auto border border-slate-200/60 rounded-xl">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                            <th className="px-5 py-3">Student</th>
                                            <th className="px-5 py-3">USN</th>
                                            <th className="px-5 py-3">Cohort (Batch)</th>
                                            <th className="px-5 py-3">Dept / Sem</th>
                                            <th className="px-5 py-3">Contact</th>
                                            <th className="px-5 py-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-150 text-sm">
                                        {filteredStudents.map((s) => (
                                            <tr key={s._id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-5 py-4">
                                                    <span className="font-semibold text-slate-800">{s.name}</span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className="px-2 py-0.5 bg-slate-100 text-xs font-bold text-slate-600 rounded-md border border-slate-200/50 uppercase tracking-wider">{s.usn}</span>
                                                </td>
                                                <td className="px-5 py-4 font-medium">
                                                    {s.batchId ? (
                                                        <Link to={`/admin/batches/${s.batchId._id || s.batchId}`} className="text-[#004AAD] hover:underline font-semibold flex items-center gap-1">
                                                            {s.batchId.batchName || 'View Batch'} <ExternalLink size={11} />
                                                        </Link>
                                                    ) : (
                                                        <span className="text-slate-400 italic">No Batch</span>
                                                    )}
                                                </td>
                                                <td className="px-5 py-4 text-xs font-semibold text-slate-500">
                                                    <span>{s.department || '—'}</span>
                                                    {s.semester && <span className="ml-1 px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">S{s.semester}</span>}
                                                </td>
                                                <td className="px-5 py-4 text-xs text-slate-500 font-medium">
                                                    <div>{s.mobile || 'No mobile'}</div>
                                                    {s.email && <div className="text-[10px] text-slate-400 mt-0.5">{s.email}</div>}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${s.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                                                        {s.status}
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
            </div>

            {/* ─── MODALS ───────────────────────────────────────────────────────────── */}
            {/* Modal: Map Course */}
            {isCourseModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsCourseModalOpen(false)} />
                    <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl relative z-10 border border-slate-100 animate-in zoom-in-95 duration-150 overflow-hidden">
                        <div className="px-6 py-5 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800 text-base">Map Global Course to College</h3>
                            <button onClick={() => setIsCourseModalOpen(false)} className="p-1.5 hover:bg-slate-200/60 rounded-lg text-slate-400"><Trash2 size={18} /></button>
                        </div>
                        <form onSubmit={handleMapCourse} className="p-6 space-y-4">
                            {modalError && <div className="p-3 bg-red-50 text-red-600 text-xs font-semibold rounded-lg border border-red-100 flex items-center gap-2"><AlertTriangle size={14} className="shrink-0" />{modalError}</div>}
                            
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Select Course *</label>
                                <select 
                                    required 
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#004AAD] outline-none transition-all cursor-pointer text-slate-700 font-semibold"
                                    value={courseFormData.courseId}
                                    onChange={(e) => setCourseFormData({...courseFormData, courseId: e.target.value})}
                                >
                                    <option value="">-- Choose Global Course --</option>
                                    {unmappedGlobalCourses.map(c => <option key={c._id} value={c._id}>[{c.program}] {c.name} ({c.code})</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Custom Duration (optional)</label>
                                <input 
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#004AAD] outline-none text-slate-800" 
                                    placeholder="e.g. 40 Hours / 4 Weeks" 
                                    value={courseFormData.customDuration}
                                    onChange={(e) => setCourseFormData({...courseFormData, customDuration: e.target.value})}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Start Date</label>
                                    <input 
                                        type="date" 
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#004AAD] outline-none text-slate-800" 
                                        value={courseFormData.startDate}
                                        onChange={(e) => setCourseFormData({...courseFormData, startDate: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">End Date</label>
                                    <input 
                                        type="date" 
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#004AAD] outline-none text-slate-800" 
                                        value={courseFormData.endDate}
                                        onChange={(e) => setCourseFormData({...courseFormData, endDate: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsCourseModalOpen(false)} className="flex-1 py-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50">Cancel</button>
                                <button type="submit" disabled={submitting} className="flex-1 py-3 bg-[#004AAD] text-white rounded-xl text-xs font-extrabold hover:bg-[#003580] disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-md shadow-blue-100">
                                    {submitting && <Loader2 size={14} className="animate-spin" />} Map Course
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Assign Trainer to Course */}
            {isTrainerModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsTrainerModalOpen(false)} />
                    <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl relative z-10 border border-slate-100 animate-in zoom-in-95 duration-150 overflow-hidden">
                        <div className="px-6 py-5 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800 text-base">Assign Trainer to Course</h3>
                            <button onClick={() => setIsTrainerModalOpen(false)} className="p-1.5 hover:bg-slate-200/60 rounded-lg text-slate-400"><Trash2 size={18} /></button>
                        </div>
                        <form onSubmit={handleAssignTrainer} className="p-6 space-y-4">
                            {modalError && <div className="p-3 bg-red-50 text-red-600 text-xs font-semibold rounded-lg border border-red-100 flex items-center gap-2"><AlertTriangle size={14} className="shrink-0" />{modalError}</div>}
                            
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Selected Course</label>
                                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700">
                                    {activeMappedCourses.find(mc => mc.courseId._id === selectedCourseForTrainers)?.courseId.name}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Select Trainer *</label>
                                <select 
                                    required 
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#004AAD] outline-none transition-all cursor-pointer text-slate-700 font-semibold"
                                    value={trainerFormData.trainerId}
                                    onChange={(e) => setTrainerFormData({ trainerId: e.target.value })}
                                >
                                    <option value="">-- Choose Trainer --</option>
                                    {globalTrainers.map(t => (
                                        <option key={t._id} value={t._id}>{t.firstName} {t.lastName} ({t.employeeId || 'No Emp ID'}) [{t.program || 'EWDP'}]</option>
                                    ))}
                                </select>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsTrainerModalOpen(false)} className="flex-1 py-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50">Cancel</button>
                                <button type="submit" disabled={submitting} className="flex-1 py-3 bg-[#004AAD] text-white rounded-xl text-xs font-extrabold hover:bg-[#003580] disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-md shadow-blue-100">
                                    {submitting && <Loader2 size={14} className="animate-spin" />} Assign
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Create Batch */}
            {isBatchModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsBatchModalOpen(false)} />
                    <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl relative z-10 border border-slate-100 animate-in zoom-in-95 duration-150 overflow-hidden">
                        <div className="px-6 py-5 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800 text-base">Create New Roster Batch</h3>
                            <button onClick={() => setIsBatchModalOpen(false)} className="p-1.5 hover:bg-slate-200/60 rounded-lg text-slate-400"><Trash2 size={18} /></button>
                        </div>
                        <form onSubmit={handleCreateBatch} className="p-6 space-y-4">
                            {modalError && <div className="p-3 bg-red-50 text-red-600 text-xs font-semibold rounded-lg border border-red-100 flex items-center gap-2"><AlertTriangle size={14} className="shrink-0" />{modalError}</div>}
                            
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Select Course *</label>
                                <select 
                                    required 
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#004AAD] outline-none transition-all cursor-pointer text-slate-700 font-semibold"
                                    value={batchFormData.courseId}
                                    onChange={(e) => {
                                        const cId = e.target.value;
                                        const mappingObj = activeMappedCourses.find(mc => mc.courseId._id === cId);
                                        setBatchFormData({
                                            ...batchFormData,
                                            courseId: cId,
                                            trainerId: '', // Reset trainer when course changes
                                            program: mappingObj?.courseId.program || 'EWDP'
                                        });
                                    }}
                                >
                                    <option value="">-- Select Course --</option>
                                    {activeMappedCourses.map(mc => (
                                        <option key={mc.courseId._id} value={mc.courseId._id}>[{mc.courseId.program}] {mc.courseId.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Assigned Trainer *</label>
                                <select 
                                    required 
                                    disabled={!batchFormData.courseId}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#004AAD] outline-none transition-all cursor-pointer text-slate-700 font-semibold disabled:opacity-50"
                                    value={batchFormData.trainerId}
                                    onChange={(e) => setBatchFormData({ ...batchFormData, trainerId: e.target.value })}
                                >
                                    <option value="">-- Choose Trainer --</option>
                                    {/* Populate trainers currently mapped to the selected course */}
                                    {globalTrainers.map(t => (
                                        <option key={t._id} value={t._id}>{t.firstName} {t.lastName} ({t.employeeId || 'No Emp ID'}) [{t.program || 'EWDP'}]</option>
                                    ))}
                                </select>
                                <p className="text-[10px] text-slate-400 mt-1">If the trainer is missing, make sure they are registered in the global trainers directory.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Batch Name *</label>
                                    <input 
                                        required 
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#004AAD] outline-none text-slate-800" 
                                        placeholder="e.g. Batch-01" 
                                        value={batchFormData.batchName}
                                        onChange={(e) => setBatchFormData({...batchFormData, batchName: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Department *</label>
                                    <input 
                                        required 
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#004AAD] outline-none text-slate-800" 
                                        placeholder="e.g. CSE" 
                                        value={batchFormData.department}
                                        onChange={(e) => setBatchFormData({...batchFormData, department: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Start Date</label>
                                    <input 
                                        type="date" 
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#004AAD] outline-none text-slate-800" 
                                        value={batchFormData.startDate}
                                        onChange={(e) => setBatchFormData({...batchFormData, startDate: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">End Date</label>
                                    <input 
                                        type="date" 
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#004AAD] outline-none text-slate-800" 
                                        value={batchFormData.endDate}
                                        onChange={(e) => setBatchFormData({...batchFormData, endDate: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsBatchModalOpen(false)} className="flex-1 py-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50">Cancel</button>
                                <button type="submit" disabled={submitting} className="flex-1 py-3 bg-[#004AAD] text-white rounded-xl text-xs font-extrabold hover:bg-[#003580] disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-md shadow-blue-100">
                                    {submitting && <Loader2 size={14} className="animate-spin" />} Create Cohort
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CollegeDetail;
