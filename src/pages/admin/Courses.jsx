import { useState, useEffect, useRef } from 'react';
import { BookOpen, Plus, Search, Edit2, Trash2, X, Loader2, Download, Building2, CheckCircle2, AlertTriangle, Layers, XCircle, FileText, Eye } from 'lucide-react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import ExcelJS from 'exceljs';
import useAuthStore from '../../store/authStore';
import useCollegeStore from '../../store/collegeStore';
import useSocketUpdate from '../../hooks/useSocketUpdate';

const CourseModal = ({ course, isOpen, onClose, onSave, token, onRefresh }) => {
    const [formData, setFormData] = useState({ name: '', code: '', description: '', status: 'active', modulesCount: 5, program: 'EWDP' });
    const [submitting, setSubmitting] = useState(false);
    const [validationError, setValidationError] = useState('');

    const syllabusInputRef = useRef(null);
    const [uploadingSyllabus, setUploadingSyllabus] = useState(false);

    const handleSyllabusUpload = async (e) => {
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

        setUploadingSyllabus(true);
        try {
            const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const res = await axios.post(
                `${baseURL}/admin/courses/${course._id}/syllabus`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            if (res.data.success) {
                alert('Syllabus PDF uploaded successfully!');
                if (onRefresh) onRefresh();
                course.syllabusUrl = res.data.data.syllabusUrl;
            }
        } catch (error) {
            console.error('Syllabus upload error:', error);
            alert(error.response?.data?.error || 'Failed to upload syllabus');
        } finally {
            setUploadingSyllabus(false);
            if (syllabusInputRef.current) syllabusInputRef.current.value = '';
        }
    };

    useEffect(() => {
        if (course) {
            setFormData({
                name: course.name || '',
                code: course.code || '',
                description: course.description || '',
                status: course.status || 'active',
                modulesCount: course.modulesCount || 5,
                program: course.program || 'EWDP'
            });
        } else {
            setFormData({
                name: '',
                code: '',
                description: '',
                status: 'active',
                modulesCount: 5,
                program: 'EWDP'
            });
        }
        setValidationError('');
    }, [course, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidationError('');

        if (!formData.name.trim()) return setValidationError('Course name is required');
        if (!formData.code.trim()) return setValidationError('Course code is required');
        if (!formData.program) return setValidationError('Program type is required');

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
            <div className="bg-white max-w-4xl w-full min-h-[600px] rounded-2xl shadow-2xl relative z-10 border border-slate-100 animate-in zoom-in-95 duration-150 overflow-hidden flex flex-col">
                <div className="px-6 py-5 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 text-lg">{course ? 'Edit Course Details' : 'Create New Course'}</h3>
                    <button onClick={onClose} className="p-1.5 hover:bg-slate-200/60 active:scale-95 rounded-lg text-slate-400 hover:text-slate-600 transition-all"><X size={18} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-4 flex-1">
                        {validationError && (
                            <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-lg flex items-center gap-2">
                                <AlertTriangle size={14} className="shrink-0" />
                                <span>{validationError}</span>
                            </div>
                        )}
                        
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Program *</label>
                            <select 
                                required
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#004AAD] focus:ring-2 focus:ring-blue-100 outline-none transition-all cursor-pointer text-slate-700 font-medium"
                                value={formData.program}
                                onChange={(e) => setFormData({...formData, program: e.target.value})}
                            >
                                <option value="EWDP">EWDP</option>
                                <option value="CFS">CFS</option>
                                <option value="PMKVY">PMKVY</option>
                                <option value="CMKKY">CMKKY</option>
                            </select>
                        </div>

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

                        {/* Syllabus PDF Upload (Edit Mode only) */}
                        {course && (
                            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-3">
                                <div>
                                    <h4 className="text-xs text-slate-700 uppercase flex items-center gap-1.5 font-bold">
                                        <FileText size={13} className="text-[#004AAD]" /> Course Syllabus (PDF)
                                    </h4>
                                    <p className="text-[11px] text-slate-400 mt-0.5">Upload syllabus details document (Max 5MB)</p>
                                </div>

                                <div className="flex flex-wrap items-center gap-3">
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        ref={syllabusInputRef}
                                        onChange={handleSyllabusUpload}
                                        className="hidden"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => syllabusInputRef.current?.click()}
                                        disabled={uploadingSyllabus}
                                        className="px-4 py-2 bg-[#004AAD] text-white rounded-lg text-xs font-semibold hover:bg-[#003580] disabled:opacity-50 flex items-center gap-1.5 shadow-sm cursor-pointer"
                                    >
                                        {uploadingSyllabus ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
                                        {course.syllabusUrl ? 'Update Syllabus' : 'Upload Syllabus'}
                                    </button>
                                    
                                    {course.syllabusUrl && (
                                        <a
                                            href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/courses/${course._id}/syllabus`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-100 flex items-center gap-1.5 shadow-sm"
                                        >
                                            <Eye size={12} /> View Syllabus
                                        </a>
                                    )}
                                </div>
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

const MapCourseModal = ({ isOpen, onClose, onSave, token, globalCourses, mappedCourseIds }) => {
    const [formData, setFormData] = useState({ courseId: '', customDuration: '', startDate: '', endDate: '' });
    const [courseSearch, setCourseSearch] = useState('');
    const [showCourseDropdown, setShowCourseDropdown] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [validationError, setValidationError] = useState('');

    const unmappedCourses = globalCourses.filter(c => !mappedCourseIds?.includes(c._id));

    const filteredCourses = unmappedCourses.filter(c => {
        const search = courseSearch.toLowerCase();
        return c.name?.toLowerCase().includes(search) || 
               c.code?.toLowerCase().includes(search) ||
               c.program?.toLowerCase().includes(search);
    });

    useEffect(() => {
        if (isOpen) {
            setFormData({ courseId: '', customDuration: '', startDate: '', endDate: '' });
            setCourseSearch('');
            setShowCourseDropdown(false);
            setValidationError('');
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidationError('');

        if (!formData.courseId) return setValidationError('Please select a course to map');

        setSubmitting(true);
        try {
            await onSave(formData);
        } catch (error) {
            setValidationError(error.response?.data?.error || 'Failed to map course');
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
            <div className="bg-white max-w-4xl w-full min-h-[600px] rounded-2xl shadow-2xl relative z-10 border border-slate-100 animate-in zoom-in-95 duration-150 overflow-hidden flex flex-col">
                <div className="px-6 py-5 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 text-lg">Map Global Course to College</h3>
                    <button onClick={onClose} className="p-1.5 hover:bg-slate-200/60 active:scale-95 rounded-lg text-slate-400 hover:text-slate-600 transition-all"><X size={18} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 flex-1 flex flex-col justify-between space-y-6">
                    <div className="space-y-6 flex-1">
                        {validationError && (
                            <div className="p-3 bg-red-50 border border-red-200 text-red-655 text-xs font-semibold rounded-lg flex items-center gap-2">
                                <AlertTriangle size={14} className="shrink-0" />
                                <span>{validationError}</span>
                            </div>
                        )}
                        
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Select Global Course *</label>
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
                                            <div className="px-4 py-2.5 text-xs text-slate-500 italic">No global courses found</div>
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
                                                    <span className="text-xs text-slate-400">{c.name} ({c.program})</span>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                            {formData.courseId && (
                                <p className="text-xs text-[#004AAD] mt-1.5 font-semibold">Selected Course: {courseSearch}</p>
                            )}
                            {unmappedCourses.length === 0 && (
                                <p className="text-xs text-amber-600 mt-1">All global courses are already mapped to this college.</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Custom Duration (Optional)</label>
                            <input 
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#004AAD] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-800 font-medium" 
                                value={formData.customDuration} 
                                onChange={(e) => setFormData({...formData, customDuration: e.target.value})} 
                                placeholder="e.g., 60 hours (Default is course standard)" 
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Start Date (Optional)</label>
                                <input 
                                    type="date"
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#004AAD] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-800 font-medium" 
                                    value={formData.startDate} 
                                    onChange={(e) => setFormData({...formData, startDate: e.target.value})} 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">End Date (Optional)</label>
                                <input 
                                    type="date"
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#004AAD] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-800 font-medium" 
                                    value={formData.endDate} 
                                    onChange={(e) => setFormData({...formData, endDate: e.target.value})} 
                                />
                            </div>
                        </div>
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
                            disabled={submitting || unmappedCourses.length === 0} 
                            className="flex-1 py-3 bg-[#004AAD] text-white rounded-xl text-sm font-bold hover:bg-[#003580] disabled:opacity-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            {submitting && <Loader2 size={16} className="animate-spin" />}
                            Map Course
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Courses = () => {
    const { user, token } = useAuthStore(); 
    const isReadOnly = ['regional_manager', 'asst_rm'].includes(user?.role);
    const { selectedCollegeId, selectedCollegeName, selectedCollegeCode } = useCollegeStore();
    const location = useLocation();
    const urlCollegeMatch = location.pathname.match(/\/college\/([a-f0-9]+)/);
    const effectiveCollegeId = selectedCollegeId || (urlCollegeMatch ? urlCollegeMatch[1] : null);

    const [courses, setCourses] = useState([]); 
    const [globalCourses, setGlobalCourses] = useState([]);
    const [colleges, setColleges] = useState([]);
    const [selectedCollegeFilter, setSelectedCollegeFilter] = useState('all');
    const [mappedCourseIds, setMappedCourseIds] = useState(null);
    const [courseToMapId, setCourseToMapId] = useState({});
    const [sortBy, setSortBy] = useState('name-asc');
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [isMapModalOpen, setIsMapModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [programFilter, setProgramFilter] = useState('all');

    useEffect(() => {
        if (effectiveCollegeId) {
            setSelectedCollegeFilter(effectiveCollegeId);
        } else {
            setSelectedCollegeFilter('all');
        }
    }, [effectiveCollegeId]);

    const fetchCourses = async () => { 
        setLoading(true); 
        try { 
            const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const collegeQuery = effectiveCollegeId ? `?collegeId=${effectiveCollegeId}` : '';
            const reqs = [
                axios.get(`${baseURL}/admin/courses${collegeQuery}`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${baseURL}/admin/colleges`, { headers: { Authorization: `Bearer ${token}` } })
            ];
            if (effectiveCollegeId && user?.role !== 'trainer') {
                reqs.push(axios.get(`${baseURL}/admin/courses?global=true`, { headers: { Authorization: `Bearer ${token}` } }));
            }
            const results = await Promise.all(reqs);
            setCourses(results[0].data.data || []); 
            setColleges(results[1].data.data || []);
            if (results[2]) {
                setGlobalCourses(results[2].data.data || []);
            } else {
                setGlobalCourses(results[0].data.data || []);
            }
        } catch (e) { 
            console.error(e); 
        } finally { 
            setLoading(false); 
        } 
    };

    const fetchMappedCourses = async (collegeFilter = selectedCollegeFilter) => {
        if (user?.role === 'trainer' || collegeFilter === 'all') {
            setMappedCourseIds(null);
            setCourseToMapId({});
            return;
        }
        try {
            const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const res = await axios.get(`${baseURL}/admin/colleges/${collegeFilter}/mapped-courses`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const map = {};
            const ids = (res.data.data || []).map(m => {
                const cid = m.courseId?._id || m.courseId;
                if (cid) {
                    map[cid] = m._id;
                }
                return cid;
            }).filter(Boolean);
            setMappedCourseIds(ids);
            setCourseToMapId(map);
        } catch (error) {
            console.error("Failed to fetch mapped courses:", error);
            setMappedCourseIds([]);
            setCourseToMapId({});
        }
    };

    useEffect(() => { 
        fetchCourses(); 
    }, [token, effectiveCollegeId]);

    useEffect(() => {
        fetchMappedCourses();
    }, [selectedCollegeFilter, token]);

    useSocketUpdate(() => fetchCourses(), ['courses']);

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

    const handleMapSave = async (data) => {
        try {
            const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            await axios.post(`${baseURL}/admin/colleges/${effectiveCollegeId}/mapped-courses`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsMapModalOpen(false);
            fetchCourses();
            fetchMappedCourses(effectiveCollegeId);
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to map course');
        }
    };

    const handleUnmapCourse = async (courseId) => {
        const mapId = courseToMapId[courseId];
        if (!mapId) {
            alert("Error: Mapping ID not found for this course.");
            return;
        }
        if (window.confirm('Are you sure you want to unmap this course from the college? Active batches will prevent unmapping.')) {
            try {
                const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                await axios.delete(`${baseURL}/admin/colleges/${effectiveCollegeId}/mapped-courses/${mapId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchCourses();
                fetchMappedCourses(effectiveCollegeId);
            } catch (error) {
                alert(error.response?.data?.error || 'Failed to unmap course');
            }
        }
    };

    const handleExportAllCourses = async () => {
        try {
            if (sortedCourses.length === 0) {
                alert('No courses to export');
                return;
            }

            const workbook = new ExcelJS.Workbook();
            workbook.creator = 'Ethnotech Academy';
            workbook.created = new Date();

            const sheet = workbook.addWorksheet('📚 All Courses');

            // Set column definitions
            sheet.columns = [
                { header: 'Course Name', key: 'name', width: 35 },
                { header: 'Course Code', key: 'code', width: 18 },
                { header: 'Program', key: 'program', width: 14 },
                { header: 'No of Modules', key: 'modulesCount', width: 18 },
                { header: 'Syllabus URL', key: 'syllabusUrl', width: 35 },
                { header: 'Description', key: 'description', width: 45 }
            ];

            // Style the header row
            const headerRow = sheet.getRow(1);
            headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
            headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF004AAD' } }; // Brand Navy Blue
            headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
            headerRow.height = 24;

            // Add rows
            sortedCourses.forEach((c, index) => {
                const syllabusUrl = c.syllabusUrl ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/courses/${c._id}/syllabus` : '—';
                const row = sheet.addRow({
                    name: c.name || '—',
                    code: c.code || '—',
                    program: c.program || 'EWDP',
                    modulesCount: c.modulesCount || 5,
                    syllabusUrl,
                    description: c.description || '—'
                });

                // Alternating row colors
                row.fill = { 
                    type: 'pattern', 
                    pattern: 'solid', 
                    fgColor: { argb: index % 2 === 0 ? 'FFF0F4FF' : 'FFFFFFFF' } 
                };
                row.alignment = { vertical: 'middle' };
                row.height = 20;
            });

            // Write to buffer and download
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.setAttribute('download', 'Courses_Report.xlsx');
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            console.error('Failed to export courses:', error);
            alert('Failed to export courses');
        }
    };

    // Filter courses based on college, program and search query
    const filteredCourses = courses.filter(c => {
        const matchesSearch = c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              c.code?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesProgram = programFilter === 'all' || c.program === programFilter;
        const matchesCollege = mappedCourseIds === null || mappedCourseIds.includes(c._id);
        return matchesSearch && matchesProgram && matchesCollege;
    });

    // Sort the filtered courses
    const sortedCourses = [...filteredCourses].sort((a, b) => {
        if (sortBy === 'name-asc') return (a.name || '').localeCompare(b.name || '');
        if (sortBy === 'name-desc') return (b.name || '').localeCompare(a.name || '');
        if (sortBy === 'code-asc') return (a.code || '').localeCompare(b.code || '');
        if (sortBy === 'code-desc') return (b.code || '').localeCompare(a.code || '');
        if (sortBy === 'modules-asc') return (a.modulesCount || 0) - (b.modulesCount || 0);
        if (sortBy === 'modules-desc') return (b.modulesCount || 0) - (a.modulesCount || 0);
        return 0;
    });

    const statsCourses = effectiveCollegeId ? filteredCourses : courses;
    const totalCoursesCount = statsCourses.length;
    const syllabusUploadedCount = statsCourses.filter(c => c.syllabusUrl).length;
    const totalModulesCount = statsCourses.reduce((acc, c) => acc + (c.modulesCount || 0), 0);

    return (
        <div className="space-y-6 animate-fade-in duration-300">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <BookOpen className="text-[#004AAD]" size={26} />
                        {effectiveCollegeId ? `Courses - ${selectedCollegeCode || 'College'}` : 'Global Courses'}
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        {effectiveCollegeId ? `Manage courses mapped to ${selectedCollegeName || 'this college'}` : 'Manage global training programs, curricula, and program classifications'}
                    </p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button 
                        onClick={handleExportAllCourses}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-650 text-sm font-medium rounded-xl hover:bg-slate-50 active:scale-95 transition-all w-full md:w-auto shrink-0 shadow-sm cursor-pointer"
                    >
                        <Download size={16} /> Export All
                    </button>
                    {user?.role !== 'trainer' && !isReadOnly && (
                        effectiveCollegeId ? (
                            <button 
                                onClick={() => setIsMapModalOpen(true)} 
                                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#004AAD] text-white text-sm font-bold rounded-xl hover:bg-[#003580] shadow-md shadow-blue-100 hover:shadow-lg active:scale-95 transition-all w-full md:w-auto shrink-0 cursor-pointer"
                            >
                                <Plus size={16} /> Map Course
                            </button>
                        ) : (
                            <button 
                                onClick={() => { setSelectedCourse(null); setIsModalOpen(true); }} 
                                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#004AAD] text-white text-sm font-bold rounded-xl hover:bg-[#003580] shadow-md shadow-blue-100 hover:shadow-lg active:scale-95 transition-all w-full md:w-auto shrink-0 cursor-pointer"
                            >
                                <Plus size={16} /> Add Global Course
                            </button>
                        )
                    )}
                </div>
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#004AAD]"><Layers size={20} /></div>
                    <div><p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Courses</p><p className="text-xl font-bold text-slate-800 mt-0.5">{totalCoursesCount}</p></div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500"><FileText size={20} /></div>
                    <div><p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Syllabi Uploaded</p><p className="text-xl font-bold text-slate-800 mt-0.5">{syllabusUploadedCount}</p></div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50/50 flex items-center justify-center text-indigo-600"><BookOpen size={20} /></div>
                    <div><p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Modules</p><p className="text-xl font-bold text-slate-800 mt-0.5">{totalModulesCount}</p></div>
                </div>
            </div>

            {/* List & Filters */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                {/* Search & Tabs */}
                <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-slate-50/50">
                    <div className="flex flex-wrap items-center gap-3">
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
                            <option value="code-asc">Sort: Code (A-Z)</option>
                            <option value="code-desc">Sort: Code (Z-A)</option>
                            <option value="modules-asc">Sort: Modules (L-H)</option>
                            <option value="modules-desc">Sort: Modules (H-L)</option>
                        </select>
                    </div>
                    <div className="relative w-full md:w-72">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-[#004AAD] focus:ring-2 focus:ring-blue-100 transition-all" 
                            placeholder="Search by code or title..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/40">
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Course Name</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Program</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Code</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Modules</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Syllabus</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader2 className="animate-spin text-[#004AAD]" size={28} />
                                            <span className="text-xs font-semibold text-slate-400">Loading courses...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : sortedCourses.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-16 text-center text-sm font-semibold text-slate-400">
                                        No courses found.
                                    </td>
                                </tr>
                            ) : (
                                sortedCourses.map((c) => (
                                    <tr key={c._id} className="hover:bg-slate-50/40 group transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3.5">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-indigo-50/60 text-[#004AAD] rounded-xl flex items-center justify-center font-bold text-sm shadow-inner shrink-0 uppercase">
                                                    {c.name?.substring(0, 2)}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-slate-800 truncate">{c.name}</p>
                                                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-[11px] text-slate-400">
                                                        {c.createdBy && (
                                                            <span>Created by {c.createdBy.firstName} {c.createdBy.lastName}</span>
                                                        )}
                                                    </div>
                                                    {c.description && <p className="text-xs text-slate-400/80 mt-1 line-clamp-1 max-w-lg">{c.description}</p>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2 py-0.5 bg-blue-50 border border-blue-100 rounded text-[#004AAD] font-bold text-[10px] uppercase">
                                                {c.program || 'EWDP'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <code className="px-2.5 py-1 bg-slate-100 border border-slate-200/60 text-xs font-mono font-semibold text-slate-600 rounded-lg">{c.code}</code>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-xs font-bold text-slate-600 bg-indigo-50/50 px-2.5 py-1 rounded-lg border border-indigo-100/50">{c.modulesCount || 5} Modules</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {c.syllabusUrl ? (
                                                <a 
                                                    href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/courses/${c._id}/syllabus`}
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-semibold transition-all border border-red-100/50"
                                                    title="View Syllabus PDF"
                                                >
                                                    <FileText size={13} /> View Syllabus
                                                </a>
                                            ) : (
                                                <span className="text-xs text-slate-400 italic">No Syllabus</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            <div className="flex justify-end gap-1.5">
                                                {!isReadOnly ? (
                                                    effectiveCollegeId ? (
                                                        <>
                                                            {user?.role !== 'trainer' && (
                                                                <button 
                                                                    onClick={() => handleUnmapCourse(c._id)} 
                                                                    className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors" 
                                                                    title="Unmap Course from College"
                                                                >
                                                                    <XCircle size={16} />
                                                                </button>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <>
                                                            {user?.role !== 'trainer' && (
                                                                <button onClick={() => { setSelectedCourse(c); setIsModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-[#004AAD] rounded-lg hover:bg-blue-50 transition-colors" title="Edit Course"><Edit2 size={16} /></button>
                                                            )}
                                                            {user?.role !== 'trainer' && (
                                                                <button onClick={() => handleDelete(c._id)} className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors" title="Delete Course"><Trash2 size={16} /></button>
                                                            )}
                                                        </>
                                                    )
                                                ) : (
                                                    <span className="text-xs text-slate-400 italic">Read-only</span>
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
                token={token}
                onRefresh={fetchCourses}
                onClose={() => setIsModalOpen(false)} 
                onSave={handleSave} 
            />

            <MapCourseModal
                isOpen={isMapModalOpen}
                token={token}
                globalCourses={globalCourses}
                mappedCourseIds={mappedCourseIds}
                onClose={() => setIsMapModalOpen(false)}
                onSave={handleMapSave}
            />
        </div>
    );
};

export default Courses;
