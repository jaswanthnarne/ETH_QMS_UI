import { useState, useEffect } from 'react';
import { BookOpen, Plus, Search, Edit2, Trash2, X, Loader2, Download, Building2, CheckCircle2, AlertTriangle, Layers, XCircle } from 'lucide-react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useCollegeStore from '../../store/collegeStore';
import useSocketUpdate from '../../hooks/useSocketUpdate';

const CourseModal = ({ course, isOpen, onClose, onSave, colleges, showCollegeSelector, activeCollegeId }) => {
    const [formData, setFormData] = useState({ name: '', code: '', description: '', status: 'active', collegeId: '', modulesCount: 5 });
    const [submitting, setSubmitting] = useState(false);
    const [validationError, setValidationError] = useState('');

    useEffect(() => {
        if (course) {
            setFormData({
                name: course.name || '',
                code: course.code || '',
                description: course.description || '',
                status: course.status || 'active',
                collegeId: course.collegeId?._id || course.collegeId || '',
                modulesCount: course.modulesCount || 5
            });
        } else {
            setFormData({
                name: '',
                code: '',
                description: '',
                status: 'active',
                collegeId: (activeCollegeId && activeCollegeId !== 'all') ? activeCollegeId : '',
                modulesCount: 5
            });
        }
        setValidationError('');
    }, [course, isOpen, activeCollegeId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidationError('');

        if (!formData.name.trim()) return setValidationError('Course name is required');
        if (!formData.code.trim()) return setValidationError('Course code is required');
        if (showCollegeSelector && !formData.collegeId) return setValidationError('Please select a college');

        setSubmitting(true);
        try {
            await onSave(formData);
        } catch (error) {
            setValidationError(error.response?.data?.error || 'Failed to save course');
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
            <div className="bg-white max-w-lg w-full rounded-2xl shadow-2xl relative z-10 border border-slate-100 animate-in zoom-in-95 duration-150 overflow-hidden">
                <div className="px-6 py-5 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 text-lg">{course ? 'Edit Course Details' : 'Create New Course'}</h3>
                    <button onClick={onClose} className="p-1.5 hover:bg-slate-200/60 active:scale-95 rounded-lg text-slate-400 hover:text-slate-600 transition-all"><X size={18} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {validationError && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-lg flex items-center gap-2">
                            <AlertTriangle size={14} className="shrink-0" />
                            <span>{validationError}</span>
                        </div>
                    )}
                    
                    {showCollegeSelector && (
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">College *</label>
                            <select 
                                required
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#004AAD] focus:ring-2 focus:ring-blue-100 outline-none transition-all cursor-pointer text-slate-700 font-medium"
                                value={formData.collegeId}
                                onChange={(e) => setFormData({...formData, collegeId: e.target.value})}
                            >
                                <option value="">Select College</option>
                                {colleges.map(c => (
                                    <option key={c._id} value={c._id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Course Name *</label>
                        <input 
                            required 
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#004AAD] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-800 font-medium" 
                            value={formData.name} 
                            onChange={(e) => setFormData({...formData, name: e.target.value})} 
                            placeholder="e.g., Python Programming for Beginners" 
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Course Code *</label>
                            <input 
                                required 
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono uppercase focus:bg-white focus:border-[#004AAD] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-800" 
                                value={formData.code} 
                                onChange={(e) => setFormData({...formData, code: e.target.value})} 
                                placeholder="e.g., PY-101" 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Status</label>
                            <select 
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#004AAD] focus:ring-2 focus:ring-blue-100 outline-none transition-all cursor-pointer text-slate-700 font-medium" 
                                value={formData.status} 
                                onChange={(e) => setFormData({...formData, status: e.target.value})}
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Number of Modules *</label>
                        <input 
                            type="number" 
                            min="1" 
                            required 
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#004AAD] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-800 font-medium" 
                            value={formData.modulesCount || 5} 
                            onChange={(e) => setFormData({...formData, modulesCount: parseInt(e.target.value) || 1})} 
                            placeholder="e.g., 5" 
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Description</label>
                        <textarea 
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#004AAD] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-800 min-h-[80px] resize-none" 
                            value={formData.description} 
                            onChange={(e) => setFormData({...formData, description: e.target.value})} 
                            placeholder="Provide a brief course description..." 
                        />
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
                            disabled={submitting} 
                            className="flex-1 py-3 bg-[#004AAD] text-white rounded-xl text-sm font-bold hover:bg-[#003580] disabled:opacity-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            {submitting && <Loader2 size={16} className="animate-spin" />}
                            {course ? 'Save Changes' : 'Create Course'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Courses = () => {
    const { user, token } = useAuthStore(); 
    const { selectedCollegeId } = useCollegeStore();
    const location = useLocation();

    const urlCollegeMatch = location.pathname.match(/\/college\/([a-f0-9]+)/);
    const urlCollegeId = urlCollegeMatch ? urlCollegeMatch[1] : null;

    const [colleges, setColleges] = useState([]);
    const [inlineCollegeId, setInlineCollegeId] = useState(selectedCollegeId || urlCollegeId || 'all');
    const [loadingColleges, setLoadingColleges] = useState(false);
    const [courses, setCourses] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // For college_admin, use their assigned college. For others, allow selection.
    const activeCollegeId = user?.role === 'college_admin' 
        ? (selectedCollegeId || urlCollegeId || user.collegeId) 
        : (inlineCollegeId && inlineCollegeId !== 'all' ? inlineCollegeId : (selectedCollegeId || urlCollegeId || 'all'));

    // Fetch colleges for super_admin and trainer
    useEffect(() => {
        if ((user?.role === 'super_admin' || user?.role === 'trainer') && token) {
            setLoadingColleges(true);
            axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/colleges`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => {
                setColleges(res.data.data || []);
            }).catch(e => console.error(e))
              .finally(() => setLoadingColleges(false));
        }
    }, [user, token]);

    // Synchronize inlineCollegeId selector state when the active context updates
    useEffect(() => {
        const currentCollegeId = selectedCollegeId || urlCollegeId;
        if (currentCollegeId) {
            setInlineCollegeId(currentCollegeId);
        } else {
            setInlineCollegeId('all');
        }
    }, [selectedCollegeId, urlCollegeId]);

    const fetchCourses = async () => { 
        setLoading(true); 
        try { 
            let url = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/courses`;
            if (activeCollegeId && activeCollegeId !== 'all') {
                url = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/colleges/${activeCollegeId}/courses`;
            }
            const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } }); 
            setCourses(res.data.data || []); 
        } catch (e) { 
            console.error(e); 
        } finally { 
            setLoading(false); 
        } 
    };

    useEffect(() => { 
        fetchCourses(); 
    }, [activeCollegeId, token]);

    useSocketUpdate(() => fetchCourses(), ['courses', 'colleges']);

    const handleSave = async (data) => { 
        if (selectedCourse) {
            await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/courses/${selectedCourse._id}`, data, { headers: { Authorization: `Bearer ${token}` } }); 
        } else {
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/courses`, data, { headers: { Authorization: `Bearer ${token}` } }); 
        }
        setIsModalOpen(false); 
        fetchCourses(); 
    };

    const handleDelete = async (id) => { 
        if (window.confirm('Are you sure you want to delete this course? Associated exams will be preserved.')) { 
            try { 
                await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/courses/${id}`, { headers: { Authorization: `Bearer ${token}` } }); 
                fetchCourses(); 
            } catch (error) { 
                alert(error.response?.data?.error || 'Delete failed.'); 
            } 
        } 
    };

    const handleExport = async (id, name) => { 
        try { 
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/analytics/export?type=course&id=${id}`, { headers: { Authorization: `Bearer ${token}` }, responseType: 'blob' }); 
            const url = window.URL.createObjectURL(new Blob([res.data])); 
            const a = document.createElement('a'); 
            a.href = url; a.setAttribute('download', `${name}_Report.xlsx`); 
            document.body.appendChild(a); a.click(); a.remove(); 
        } catch { 
            alert('Export failed'); 
        } 
    };

    if (loadingColleges) {
        return (
            <div className="h-[50vh] flex items-center justify-center">
                <Loader2 className="animate-spin text-[#004AAD]" size={32} />
            </div>
        );
    }

    // Filter courses based on status and search query
    const filteredCourses = courses.filter(c => {
        const matchesSearch = c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              c.code?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const totalCoursesCount = courses.length;
    const activeCoursesCount = courses.filter(c => c.status === 'active').length;
    const inactiveCoursesCount = courses.filter(c => c.status === 'inactive').length;
    const distinctCollegesCount = new Set(courses.map(c => c.collegeId?._id || c.collegeId).filter(Boolean)).size;

    const showCollegeSelector = user?.role === 'super_admin' || user?.role === 'trainer';
    const selectedCollegeName = colleges.find(c => c._id === activeCollegeId)?.name;

    return (
        <div className="space-y-6 animate-fade-in duration-300">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <BookOpen className="text-[#004AAD]" size={26} />
                        Courses
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Manage training programs, curricula, and course codes across colleges</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    {showCollegeSelector && (
                        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2.5 shadow-sm hover:border-slate-300 transition-all w-full md:w-auto">
                            <Building2 size={16} className="text-slate-400 shrink-0" />
                            <select 
                                className="text-sm bg-transparent outline-none text-slate-700 font-semibold min-w-[180px] cursor-pointer w-full"
                                value={inlineCollegeId}
                                onChange={(e) => setInlineCollegeId(e.target.value)}
                            >
                                <option value="all">All Colleges</option>
                                {colleges.map(c => (<option key={c._id} value={c._id}>{c.name}</option>))}
                            </select>
                        </div>
                    )}
                    <button 
                        onClick={() => { setSelectedCourse(null); setIsModalOpen(true); }} 
                        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#004AAD] text-white text-sm font-bold rounded-xl hover:bg-[#003580] shadow-md shadow-blue-100 hover:shadow-lg active:scale-95 transition-all w-full md:w-auto shrink-0"
                    >
                        <Plus size={16} /> Add Course
                    </button>
                </div>
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#004AAD]"><Layers size={20} /></div>
                    <div><p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Programs</p><p className="text-xl font-bold text-slate-800 mt-0.5">{totalCoursesCount}</p></div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600"><CheckCircle2 size={20} /></div>
                    <div><p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Curriculum</p><p className="text-xl font-bold text-slate-800 mt-0.5">{activeCoursesCount}</p></div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500"><XCircle className="text-slate-400" size={20} /></div>
                    <div><p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Inactive</p><p className="text-xl font-bold text-slate-800 mt-0.5">{inactiveCoursesCount}</p></div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600"><Building2 size={20} /></div>
                    <div><p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Colleges</p><p className="text-xl font-bold text-slate-800 mt-0.5">{distinctCollegesCount}</p></div>
                </div>
            </div>

            {/* List & Filters */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                {/* Search & Tabs */}
                <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-slate-50/50">
                    <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
                        <button onClick={() => setStatusFilter('all')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${statusFilter === 'all' ? 'bg-white text-[#004AAD] shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>All</button>
                        <button onClick={() => setStatusFilter('active')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${statusFilter === 'active' ? 'bg-white text-[#004AAD] shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>Active</button>
                        <button onClick={() => setStatusFilter('inactive')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${statusFilter === 'inactive' ? 'bg-white text-[#004AAD] shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>Inactive</button>
                    </div>
                    <div className="relative w-full sm:w-72">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-[#004AAD] focus:ring-2 focus:ring-blue-100 transition-all" 
                            placeholder="Search by code or title..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                        />
                    </div>
                </div>

                {/* Info Text */}
                {selectedCollegeName && activeCollegeId !== 'all' && (
                    <div className="px-6 py-3 bg-blue-50/50 border-b border-blue-50 text-xs text-slate-500 flex items-center gap-2">
                        <Building2 size={13} className="text-[#004AAD]" />
                        <span>Displaying courses for <span className="font-semibold text-slate-700">{selectedCollegeName}</span></span>
                    </div>
                )}

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/40">
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Course Program</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Code</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Modules</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader2 className="animate-spin text-[#004AAD]" size={28} />
                                            <span className="text-xs font-semibold text-slate-400">Loading courses...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredCourses.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-16 text-center text-sm font-semibold text-slate-400">
                                        No courses found.
                                    </td>
                                </tr>
                            ) : (
                                filteredCourses.map((c) => (
                                    <tr key={c._id} className="hover:bg-slate-50/40 group transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3.5">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-indigo-50/60 text-[#004AAD] rounded-xl flex items-center justify-center font-bold text-sm shadow-inner shrink-0 uppercase">
                                                    {c.name?.substring(0, 2)}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-slate-800 truncate">{c.name}</p>
                                                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-[11px] text-slate-400">
                                                        {c.collegeId && (
                                                            <span className="flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-medium">
                                                                <Building2 size={11} /> {c.collegeId.name || c.collegeId}
                                                            </span>
                                                        )}
                                                        {c.createdBy && (
                                                            <span>• Created by {c.createdBy.firstName} {c.createdBy.lastName}</span>
                                                        )}
                                                    </div>
                                                    {c.description && <p className="text-xs text-slate-400/80 mt-1 line-clamp-1 max-w-lg">{c.description}</p>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <code className="px-2.5 py-1 bg-slate-100 border border-slate-200/60 text-xs font-mono font-semibold text-slate-600 rounded-lg">{c.code}</code>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-bold text-slate-600 bg-indigo-50/50 px-2.5 py-1 rounded-lg border border-indigo-100/50">{c.modulesCount || 5} Modules</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${c.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-100 text-slate-500 border border-slate-200/50'}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${c.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                                                {c.status === 'active' ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-1.5 transition-opacity">
                                                <button onClick={() => handleExport(c._id, c.name)} className="p-1.5 text-slate-400 hover:text-[#004AAD] rounded-lg hover:bg-blue-50 transition-colors" title="Export Results Report"><Download size={16} /></button>
                                                <button onClick={() => { setSelectedCourse(c); setIsModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-[#004AAD] rounded-lg hover:bg-blue-50 transition-colors" title="Edit Course"><Edit2 size={16} /></button>
                                                {user?.role !== 'trainer' && (
                                                    <button onClick={() => handleDelete(c._id)} className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors" title="Delete Course"><Trash2 size={16} /></button>
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

            <CourseModal 
                isOpen={isModalOpen} 
                course={selectedCourse} 
                onClose={() => setIsModalOpen(false)} 
                onSave={handleSave} 
                colleges={colleges}
                showCollegeSelector={showCollegeSelector}
                activeCollegeId={activeCollegeId}
            />
        </div>
    );
};

export default Courses;
