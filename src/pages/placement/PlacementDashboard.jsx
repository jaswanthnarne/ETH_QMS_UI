import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
    Briefcase, Plus, Search, Trash2, Edit2, Loader2, Users, FileText, CheckCircle, AlertCircle, Award, Settings, GraduationCap, ChevronDown, ChevronUp, Download, MapPin, DollarSign, AlertTriangle
} from 'lucide-react';
import axios from 'axios';
import useAuthStore from '../../store/authStore';
import useCollegeStore from '../../store/collegeStore';

const PlacementDashboard = () => {
    const { token, user } = useAuthStore();
    const { selectedCollegeId } = useCollegeStore();
    const navigate = useNavigate();
    const { collegeId } = useParams();

    // Data lists
    const [jobs, setJobs] = useState([]);
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [formOpen, setFormOpen] = useState(false);
    const [editingJobId, setEditingJobId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        description: '',
        location: '',
        salaryPackage: '',
        targetBatches: [],
        minCgpa: '',
        maxBacklogs: '',
        allowedDepartments: '',
        googleFormUrl: ''
    });

    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = async () => {
        try {
            setLoading(true);
            const headers = { Authorization: `Bearer ${token}` };
            const activeCollegeId = collegeId || selectedCollegeId || user.collegeId?._id || user.collegeId;
            const collegeQuery = activeCollegeId ? `?collegeId=${activeCollegeId}` : '';
 
            const [jobsRes, batchesRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/placement/jobs${collegeQuery}`, { headers }),
                axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/placement/batches${collegeQuery}`, { headers })
            ]);
 
            setJobs(jobsRes.data.data || []);
            setBatches(batchesRes.data.data || []);
        } catch (e) {
            console.error('Failed to load placement dashboard context', e);
        } finally {
            setLoading(false);
        }
    };
 
    useEffect(() => {
        fetchData();
    }, [token, collegeId, selectedCollegeId]);

    const handleBatchCheckbox = (batchId) => {
        const current = formData.targetBatches || [];
        const next = current.includes(batchId)
            ? current.filter(id => id !== batchId)
            : [...current, batchId];
        setFormData({ ...formData, targetBatches: next });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSubmitting(true);
 
        const activeCollegeId = collegeId || selectedCollegeId || user.collegeId?._id || user.collegeId;
        const payload = {
            collegeId: activeCollegeId,
            title: formData.title,
            company: formData.company,
            description: formData.description,
            location: formData.location,
            salaryPackage: formData.salaryPackage,
            targetBatches: formData.targetBatches,
            rules: {
                minCgpa: formData.minCgpa ? parseFloat(formData.minCgpa) : null,
                maxBacklogs: formData.maxBacklogs ? parseInt(formData.maxBacklogs) : null,
                allowedDepartments: formData.allowedDepartments 
                    ? formData.allowedDepartments.split(',').map(d => d.trim()).filter(Boolean)
                    : []
            },
            examId: null,
            googleFormUrl: formData.googleFormUrl || null
        };

        try {
            const headers = { Authorization: `Bearer ${token}` };
            if (editingJobId) {
                await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/placement/jobs/${editingJobId}`, payload, { headers });
                window.toast?.success('Job posting updated successfully.');
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/placement/jobs`, payload, { headers });
                window.toast?.success('Job posting created successfully.');
            }
            setFormOpen(false);
            setEditingJobId(null);
            resetForm();
            fetchData();
        } catch (error) {
            window.toast?.error(error.response?.data?.error || 'Failed to save job posting.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id, title, company) => {
        if (window.confirm(`Are you sure you want to delete job posting for "${title}" at "${company}"? This will delete all applications too.`)) {
            try {
                await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/placement/jobs/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                window.toast?.success('Job posting deleted successfully.');
                fetchData();
            } catch (error) {
                window.toast?.error(error.response?.data?.error || 'Failed to delete job.');
            }
        }
    };

    const handleEditClick = (job) => {
        setEditingJobId(job._id);
        setFormData({
            title: job.title || '',
            company: job.company || '',
            description: job.description || '',
            location: job.location || '',
            salaryPackage: job.salaryPackage || '',
            targetBatches: job.targetBatches?.map(b => b._id || b) || [],
            minCgpa: job.rules?.minCgpa !== null && job.rules?.minCgpa !== undefined ? job.rules.minCgpa.toString() : '',
            maxBacklogs: job.rules?.maxBacklogs !== null && job.rules?.maxBacklogs !== undefined ? job.rules.maxBacklogs.toString() : '',
            allowedDepartments: job.rules?.allowedDepartments ? job.rules.allowedDepartments.join(', ') : '',
            googleFormUrl: job.googleFormUrl || ''
        });
        setFormOpen(true);
    };

    const resetForm = () => {
        setFormData({
            title: '',
            company: '',
            description: '',
            location: '',
            salaryPackage: '',
            targetBatches: [],
            minCgpa: '',
            maxBacklogs: '',
            allowedDepartments: '',
            googleFormUrl: ''
        });
        setEditingJobId(null);
    };

    const filteredJobs = jobs.filter(j => {
        const search = searchTerm.toLowerCase();
        return (j.title || '').toLowerCase().includes(search) || 
               (j.company || '').toLowerCase().includes(search) || 
               (j.location || '').toLowerCase().includes(search);
    });

    return (
        <div className="space-y-6">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Placement Dashboard</h1>
                    <p className="text-sm text-slate-500 mt-1">Configure eligibility requirements, publish jobs, and analyze screening tests</p>
                </div>
                <button 
                    onClick={() => { resetForm(); setFormOpen(true); }} 
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#004AAD] text-white text-sm font-semibold rounded-lg hover:bg-[#003580] transition-colors shadow-sm cursor-pointer"
                >
                    <Plus size={16} /> Post New Job
                </button>
            </div>

            {/* Stats section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#004AAD] flex items-center justify-center flex-shrink-0">
                        <Briefcase size={22} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Job Opportunities</p>
                        <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{jobs.length} Active Drive(s)</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-[#004AAD] flex items-center justify-center flex-shrink-0">
                        <Users size={22} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Target Batches</p>
                        <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{batches.length} Batch(es)</h3>
                    </div>
                </div>
            </div>

            {/* List and Search */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h3 className="text-sm font-semibold text-slate-700">{filteredJobs.length} active job posting{filteredJobs.length !== 1 ? 's' : ''}</h3>
                    <div className="relative w-full sm:w-72">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#004AAD]" 
                            placeholder="Search jobs or companies..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                        />
                    </div>
                </div>

                <div className="p-6 divide-y divide-slate-100">
                    {loading ? (
                        <div className="py-16 text-center">
                            <Loader2 className="animate-spin mx-auto text-[#004AAD]" size={24} />
                            <p className="text-sm text-slate-400 mt-2">Loading placement drives...</p>
                        </div>
                    ) : filteredJobs.length === 0 ? (
                        <div className="py-16 text-center">
                            <Briefcase size={32} className="mx-auto text-slate-200 mb-2" />
                            <p className="text-sm text-slate-400">No active job posts matching your criteria</p>
                        </div>
                    ) : (
                        filteredJobs.map(job => (
                            <div key={job._id} className="py-6 first:pt-0 last:pb-0 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                                <div className="space-y-2 flex-1">
                                    <div className="flex items-center gap-3">
                                        <h4 className="text-base font-bold text-slate-900">{job.title}</h4>
                                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">{job.company}</span>
                                    </div>
                                    <p className="text-sm text-slate-550 line-clamp-2 pr-6">{job.description}</p>
                                    
                                    {/* Parameters Info */}
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1">
                                        {job.location && (
                                            <span className="text-xs text-slate-400 flex items-center gap-1">
                                                <MapPin size={12} className="text-slate-400" /> {job.location}
                                            </span>
                                        )}
                                        {job.salaryPackage && (
                                            <span className="text-xs text-slate-400 flex items-center gap-1">
                                                <DollarSign size={12} className="text-slate-400" /> Package: {job.salaryPackage}
                                            </span>
                                        )}
                                    </div>

                                    {/* Rules summary block */}
                                    <div className="flex flex-wrap items-center gap-2 pt-2">
                                        {job.rules?.minCgpa !== null && job.rules?.minCgpa !== undefined && (
                                            <span className="text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                                <GraduationCap size={11} /> CGPA &ge; {job.rules.minCgpa}
                                            </span>
                                        )}
                                        {job.rules?.maxBacklogs !== null && job.rules?.maxBacklogs !== undefined && (
                                            <span className="text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                                <AlertTriangle size={11} /> Backlogs &le; {job.rules.maxBacklogs}
                                            </span>
                                        )}
                                        {job.rules?.allowedDepartments && job.rules.allowedDepartments.length > 0 && (
                                            <span className="text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                                <Settings size={11} /> Branches: {job.rules.allowedDepartments.join(', ')}
                                            </span>
                                        )}
                                        {(!job.rules?.minCgpa && !job.rules?.maxBacklogs && (!job.rules?.allowedDepartments || job.rules.allowedDepartments.length === 0)) && (
                                            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                                <CheckCircle size={11} /> Open Eligibility
                                            </span>
                                        )}
                                    </div>

                                    {/* Batches mapping */}
                                    <div className="pt-2 flex flex-wrap gap-1 items-center">
                                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wide mr-1">Target Batches:</span>
                                        {job.targetBatches && job.targetBatches.length > 0 ? (
                                            job.targetBatches.map(b => {
                                                const batchObj = typeof b === 'object' && b !== null ? b : batches.find(x => x._id === b);
                                                return batchObj ? (
                                                    <span key={batchObj._id} className="text-[10px] bg-slate-100 text-slate-500 font-mono px-2 py-0.5 rounded border border-slate-200">
                                                        {batchObj.batchName || batchObj.name}
                                                    </span>
                                                ) : null;
                                            })
                                        ) : (
                                            <span className="text-xs text-rose-500 font-medium">None assigned</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-row lg:flex-col items-center lg:items-end gap-3 self-stretch lg:self-auto justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                                    <button 
                                        onClick={() => navigate(`/college/${collegeId || user.collegeId?._id || user.collegeId}/placement/jobs/${job._id}/applicants`)}
                                        className="flex items-center gap-1.5 px-4 py-2 border border-[#004AAD] text-[#004AAD] text-xs font-bold rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                                    >
                                        <Users size={14} /> Applicants
                                    </button>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleEditClick(job)}
                                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                            title="Edit Posting"
                                        >
                                            <Edit2 size={15} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(job._id, job.title, job.company)}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                            title="Delete Posting"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Modal Form for Create / Edit Job */}
            {formOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/35 backdrop-blur-sm" onClick={() => setFormOpen(false)} />
                    <div className="bg-white max-w-xl w-full rounded-2xl shadow-2xl relative z-10 border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                                <Briefcase className="text-[#004AAD]" size={20} />
                                {editingJobId ? 'Edit Job Posting' : 'Post New Job'}
                            </h3>
                            <button onClick={() => setFormOpen(false)} className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors text-slate-400">×</button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Company Name</label>
                                    <input required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} placeholder="Google" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Job Title</label>
                                    <input required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="Software Engineer" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Job Description</label>
                                <textarea required rows={4} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Draft key job roles, expectations, and requirements..." />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Location</label>
                                    <input className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} placeholder="Bangalore, Hybrid" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Salary Package (CTC)</label>
                                    <input className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none" value={formData.salaryPackage} onChange={(e) => setFormData({...formData, salaryPackage: e.target.value})} placeholder="12 LPA" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Google Form Link (Optional)</label>
                                <input 
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none" 
                                    value={formData.googleFormUrl} 
                                    onChange={(e) => setFormData({...formData, googleFormUrl: e.target.value})} 
                                    placeholder="https://docs.google.com/forms/d/e/.../viewform" 
                                />
                                <p className="text-[10px] text-slate-400 mt-1">If provided, students will fill out this form directly inside their dashboard upon applying.</p>
                            </div>

                            {/* Eligibility rules */}
                            <div className="p-4 border border-slate-200 bg-slate-50 rounded-xl space-y-3">
                                <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                    <Settings size={14} className="text-[#004AAD]" />
                                    Eligibility Parameters (Optional)
                                </h4>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Min CGPA</label>
                                        <input type="number" step="0.01" min="0" max="10" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:border-[#004AAD] outline-none" value={formData.minCgpa} onChange={(e) => setFormData({...formData, minCgpa: e.target.value})} placeholder="7.5" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Max Active Backlogs</label>
                                        <input type="number" min="0" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:border-[#004AAD] outline-none" value={formData.maxBacklogs} onChange={(e) => setFormData({...formData, maxBacklogs: e.target.value})} placeholder="0" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Eligible Branches (Comma separated)</label>
                                    <input className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:border-[#004AAD] outline-none" value={formData.allowedDepartments} onChange={(e) => setFormData({...formData, allowedDepartments: e.target.value})} placeholder="CSE, ISE, ECE" />
                                </div>
                            </div>

                            {/* Target batches multiselect */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Target Batches</label>
                                <div className="border border-slate-200 rounded-xl max-h-36 overflow-y-auto p-4 space-y-2 bg-slate-50">
                                    {batches.length === 0 ? (
                                        <p className="text-xs text-slate-400">No batches available in this college context</p>
                                    ) : (
                                        batches.map(b => {
                                            const isChecked = formData.targetBatches?.includes(b._id);
                                            return (
                                                <label key={b._id} className="flex items-center gap-3 cursor-pointer p-1.5 hover:bg-white rounded transition-colors">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={isChecked} 
                                                        onChange={() => handleBatchCheckbox(b._id)} 
                                                        className="rounded border-slate-300 text-[#004AAD] focus:ring-blue-100" 
                                                    />
                                                    <span className="text-xs font-semibold text-slate-700">{b.batchName}</span>
                                                </label>
                                            );
                                        })
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-4 flex gap-3 border-t border-slate-100">
                                <button type="button" onClick={() => setFormOpen(false)} className="flex-1 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-50">Cancel</button>
                                <button type="submit" disabled={submitting} className="flex-1 py-2.5 bg-[#004AAD] text-white rounded-lg text-sm font-semibold hover:bg-[#003580] disabled:opacity-50 flex items-center justify-center gap-2">
                                    {submitting && <Loader2 size={16} className="animate-spin" />}
                                    {editingJobId ? 'Save Changes' : 'Publish Job Posting'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlacementDashboard;
