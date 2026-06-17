import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, Loader2, Search, FileDown, ExternalLink, ShieldCheck, Mail, Phone, Award, Edit3, CheckCircle, AlertTriangle, Users, FileText, MapPin, DollarSign, Settings, GraduationCap
} from 'lucide-react';
import axios from 'axios';
import useAuthStore from '../../store/authStore';
import useCollegeStore from '../../store/collegeStore';

const StatusModal = ({ application, isOpen, onClose, onSave }) => {
    const [status, setStatus] = useState('applied');
    const [notes, setNotes] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (application) {
            setStatus(application.status || 'applied');
            setNotes(application.notes || '');
        }
    }, [application, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        await onSave(application._id, { status, notes });
        setSubmitting(false);
    };

    if (!isOpen || !application) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/35 backdrop-blur-sm" onClick={onClose} />
            <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl relative z-10 border border-slate-200 overflow-hidden flex flex-col">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                        <Edit3 className="text-[#004AAD]" size={18} />
                        Update Application Status
                    </h3>
                    <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded text-slate-400">×</button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Status</label>
                        <select 
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none cursor-pointer" 
                            value={status} 
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="applied">Applied</option>
                            <option value="screening_passed">Screening Passed</option>
                            <option value="screening_failed">Screening Failed</option>
                            <option value="shortlisted">Shortlisted for Interview</option>
                            <option value="sent_to_company">Sent to Company</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Feedback / Notes</label>
                        <textarea 
                            rows={3} 
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none" 
                            value={notes} 
                            onChange={(e) => setNotes(e.target.value)} 
                            placeholder="Add evaluation remarks (e.g. good programming fundamentals)..."
                        />
                    </div>

                    <div className="pt-4 flex gap-3 border-t border-slate-100">
                        <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-50">Cancel</button>
                        <button type="submit" disabled={submitting} className="flex-1 py-2.5 bg-[#004AAD] text-white rounded-lg text-sm font-semibold hover:bg-[#003580] disabled:opacity-50 flex items-center justify-center gap-2">
                            {submitting && <Loader2 size={16} className="animate-spin" />}
                            Update Status
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const JobApplicants = () => {
    const { collegeId, jobId } = useParams();
    const { token, user } = useAuthStore();
    const { selectedCollegeId } = useCollegeStore();
    const navigate = useNavigate();

    const [job, setJob] = useState(null);
    const [applicants, setApplicants] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    const [selectedApp, setSelectedApp] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedAppIds, setSelectedAppIds] = useState([]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const headers = { Authorization: `Bearer ${token}` };
            
            const activeCollegeId = collegeId || selectedCollegeId || user?.collegeId?._id || user?.collegeId;
            const collegeQuery = activeCollegeId ? `?collegeId=${activeCollegeId}` : '';
            // Get single job detail, applications list, and all students
            const [jobRes, appsRes, studentsRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/placement/jobs${collegeQuery}`, { headers }),
                axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/placement/jobs/${jobId}/applications`, { headers }),
                axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/placement/students${collegeQuery}`, { headers })
            ]);

            const jobsList = jobRes.data.data || [];
            const activeJob = jobsList.find(j => j._id === jobId);
            setJob(activeJob);
            setApplicants(appsRes.data.data || []);
            setStudents(studentsRes.data.data || []);
        } catch (e) {
            console.error('Failed to load job applicants details', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchData();
        }
    }, [jobId, token, collegeId, user, selectedCollegeId]);

    const handleStatusUpdate = async (appId, payload) => {
        try {
            const headers = { Authorization: `Bearer ${token}` };
            await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/placement/applications/${appId}/status`, payload, { headers });
            window.toast?.success('Application status updated successfully.');
            setModalOpen(false);
            fetchData();
        } catch (error) {
            window.toast?.error(error.response?.data?.error || 'Failed to update application status.');
        }
    };

    const handleBulkStatusUpdate = async (status) => {
        const confirmMsg = `Are you sure you want to update ${selectedAppIds.length} candidate(s) to "${status.replace(/_/g, ' ')}"?`;
        if (!window.confirm(confirmMsg)) return;

        try {
            const headers = { Authorization: `Bearer ${token}` };
            const res = await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/placement/applications/bulk-status`, {
                applicationIds: selectedAppIds,
                status
            }, { headers });

            window.toast?.success(res.data.message || 'Status updated successfully.');
            setSelectedAppIds([]);
            fetchData();
        } catch (error) {
            window.toast?.error(error.response?.data?.error || 'Failed to perform bulk status update.');
        }
    };

    const handleExport = () => {
        // Build raw CSV for download
        const headers = ["Candidate Name", "USN", "Email", "Mobile", "Department", "Batch", "CGPA", "Backlogs", "Status", "Notes"];
        const rows = filteredApplicants.map(app => {
            const stud = app.studentId || {};
            return [
                stud.name || '',
                stud.usn || '',
                stud.email || '',
                stud.mobile || '',
                stud.department || '',
                stud.batchId?.name || '',
                stud.cgpa || '0',
                stud.backlogs || '0',
                app.status,
                app.notes || ''
            ];
        });

        const csvContent = [headers.join(","), ...rows.map(e => e.map(val => `"${String(val ?? '').replace(/"/g, '""')}"`).join(","))].join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Applicants_${job?.company || 'Company'}_${job?.title || 'Job'}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'shortlisted': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'rejected': return 'bg-rose-50 text-rose-700 border-rose-100';
            case 'screening_passed': return 'bg-teal-50 text-teal-700 border-teal-100';
            case 'screening_failed': return 'bg-orange-50 text-orange-700 border-orange-100';
            case 'sent_to_company': return 'bg-purple-50 text-purple-700 border-purple-100';
            default: return 'bg-blue-50 text-blue-700 border-blue-100';
        }
    };

    const filteredApplicants = applicants.filter(app => {
        const stud = app.studentId || {};
        const search = searchTerm.toLowerCase();
        return (stud.name || '').toLowerCase().includes(search) || 
               (stud.usn || '').toLowerCase().includes(search) || 
               (stud.department || '').toLowerCase().includes(search) ||
               (app.status || '').toLowerCase().includes(search);
    });

    // Compute statistics based on active job and students scope
    const targetBatchIds = job?.targetBatches?.map(b => b._id || b) || [];
    const targetedStudents = students.filter(s => {
        const studentBatchId = s.batchId?._id || s.batchId;
        return studentBatchId && targetBatchIds.includes(studentBatchId);
    });
    const targetScope = targetedStudents.length;
    const appliedCount = applicants.length;
    const shortlistedCount = applicants.filter(a => a.status === 'shortlisted').length;

    return (
        <div className="space-y-6">
            {/* Back button */}
            <button 
                onClick={() => navigate(-1)} 
                className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-sm font-semibold cursor-pointer"
            >
                <ArrowLeft size={16} /> Back to Placements
            </button>

            {/* Job Details Card */}
            {job && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
                        <div>
                            <span className="text-xs uppercase font-bold tracking-wider text-slate-400">{job.company}</span>
                            <h2 className="text-xl font-bold text-slate-900 mt-0.5">{job.title}</h2>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {job.salaryPackage && (
                                <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-semibold flex items-center gap-1.5">
                                    <DollarSign size={13} className="text-slate-500" /> {job.salaryPackage}
                                </span>
                            )}
                            {job.location && (
                                <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-semibold flex items-center gap-1.5">
                                    <MapPin size={13} className="text-slate-500" /> {job.location}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Target Batches</h4>
                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                                {job.targetBatches?.map(b => {
                                    const name = typeof b === 'object' && b !== null ? (b.batchName || b.name) : b;
                                    const id = typeof b === 'object' && b !== null ? b._id : b;
                                    return (
                                        <span key={id} className="text-xs font-mono bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                                            {name}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Eligibility Rules</h4>
                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                                {job.rules?.minCgpa !== null && (
                                    <span className="text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                        <GraduationCap size={12} /> Min CGPA: {job.rules.minCgpa}
                                    </span>
                                )}
                                {job.rules?.maxBacklogs !== null && (
                                    <span className="text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                        <AlertTriangle size={12} /> Max Backlogs: {job.rules.maxBacklogs}
                                    </span>
                                )}
                                {job.rules?.allowedDepartments && job.rules.allowedDepartments.length > 0 && (
                                    <span className="text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                        <Settings size={12} /> Depts: {job.rules.allowedDepartments.join(', ')}
                                    </span>
                                )}
                                {!job.rules?.minCgpa && !job.rules?.maxBacklogs && (!job.rules?.allowedDepartments || job.rules.allowedDepartments.length === 0) && (
                                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                        <CheckCircle size={12} /> Open Entry
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats section */}
            {job && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-200">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#004AAD] flex items-center justify-center flex-shrink-0">
                            <Users size={22} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Target Scope</p>
                            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{targetScope} Student{targetScope !== 1 ? 's' : ''}</h3>
                        </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                            <FileText size={22} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Applied Count</p>
                            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{appliedCount} Applicant{appliedCount !== 1 ? 's' : ''}</h3>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                            <CheckCircle size={22} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Shortlisted</p>
                            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{shortlistedCount} Student{shortlistedCount !== 1 ? 's' : ''}</h3>
                        </div>
                    </div>
                </div>
            )}

            {/* Applicants Listing */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                {selectedAppIds.length > 0 ? (
                    <div className="px-6 py-4 border-b border-slate-100 bg-[#004AAD]/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all duration-300">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-[#004AAD]">{selectedAppIds.length} candidate{selectedAppIds.length !== 1 ? 's' : ''} selected</span>
                            <button 
                                onClick={() => setSelectedAppIds([])} 
                                className="text-xs text-slate-500 hover:text-slate-700 underline font-semibold cursor-pointer"
                            >
                                Clear Selection
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button 
                                onClick={() => handleBulkStatusUpdate('shortlisted')} 
                                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-all cursor-pointer shadow-sm"
                            >
                                Bulk Shortlist
                            </button>
                            <button 
                                onClick={() => handleBulkStatusUpdate('sent_to_company')} 
                                className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg transition-all cursor-pointer shadow-sm"
                            >
                                Bulk Send to Company
                            </button>
                            <button 
                                onClick={() => handleBulkStatusUpdate('rejected')} 
                                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-all cursor-pointer shadow-sm"
                            >
                                Bulk Reject
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h3 className="text-sm font-semibold text-slate-700">Applicants Pipeline ({filteredApplicants.length})</h3>
                        </div>
                        <div className="flex w-full sm:w-auto items-center gap-3">
                            <div className="relative flex-1 sm:w-64">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input 
                                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#004AAD]" 
                                    placeholder="Search candidates, USN..." 
                                    value={searchTerm} 
                                    onChange={(e) => setSearchTerm(e.target.value)} 
                                />
                            </div>
                            <button 
                                onClick={handleExport}
                                className="flex items-center gap-2 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                                title="Export to CSV"
                            >
                                <FileDown size={16} /> Export
                            </button>
                        </div>
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-6 py-3 w-[50px]">
                                    <input 
                                        type="checkbox"
                                        className="rounded border-slate-350 text-[#004AAD] focus:ring-blue-100 cursor-pointer"
                                        checked={filteredApplicants.length > 0 && filteredApplicants.every(app => selectedAppIds.includes(app._id))}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                const allIds = filteredApplicants.map(app => app._id);
                                                setSelectedAppIds(prev => Array.from(new Set([...prev, ...allIds])));
                                            } else {
                                                const allIds = filteredApplicants.map(app => app._id);
                                                setSelectedAppIds(prev => prev.filter(id => !allIds.includes(id)));
                                            }
                                        }}
                                    />
                                </th>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Candidate Info</th>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Department / Batch</th>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">CGPA / Backlogs</th>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Pipeline Status</th>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-16 text-center">
                                        <Loader2 className="animate-spin mx-auto text-[#004AAD]" size={24} />
                                        <p className="text-sm text-slate-400 mt-2">Loading applications...</p>
                                    </td>
                                </tr>
                            ) : filteredApplicants.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-16 text-center">
                                        <ShieldCheck size={32} className="mx-auto text-slate-200 mb-2" />
                                        <p className="text-sm text-slate-400">No applications recorded yet</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredApplicants.map(app => {
                                    const stud = app.studentId || {};
                                    
                                    return (
                                        <tr key={app._id} className="hover:bg-slate-50/50 group">
                                            <td className="px-6 py-4">
                                                <input 
                                                    type="checkbox"
                                                    className="rounded border-slate-350 text-[#004AAD] focus:ring-blue-100 cursor-pointer"
                                                    checked={selectedAppIds.includes(app._id)}
                                                    onChange={(e) => {
                                                        const id = app._id;
                                                        if (e.target.checked) {
                                                            setSelectedAppIds(prev => [...prev, id]);
                                                        } else {
                                                            setSelectedAppIds(prev => prev.filter(item => item !== id));
                                                        }
                                                    }}
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-semibold text-slate-900">{stud.name}</p>
                                                <p className="text-xs text-slate-400 font-mono mt-0.5">USN: {stud.usn}</p>
                                                <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                                                    {stud.email && <span className="flex items-center gap-0.5"><Mail size={10} /> {stud.email}</span>}
                                                    {stud.mobile && <span className="flex items-center gap-0.5"><Phone size={10} /> {stud.mobile}</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-semibold text-slate-700">{stud.department || 'N/A'}</p>
                                                <p className="text-xs text-slate-400 mt-0.5">{stud.batchId?.name || 'N/A'}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-semibold text-slate-700">CGPA: {stud.cgpa || 0.0}</p>
                                                <p className="text-xs text-slate-400 mt-0.5">Backlogs: {stud.backlogs || 0}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 text-[10px] font-bold border rounded-full uppercase tracking-wider ${getStatusStyle(app.status)}`}>
                                                    {app.status?.replace('_', ' ')}
                                                </span>
                                                {app.notes && (
                                                    <p className="text-xs text-slate-400 mt-1 italic line-clamp-1 max-w-[180px]" title={app.notes}>
                                                        "{app.notes}"
                                                    </p>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end items-center gap-3">
                                                    {stud.resumeUrl && (
                                                        <a 
                                                            href={stud.resumeUrl} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer" 
                                                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
                                                            title="View Candidate Resume"
                                                        >
                                                            <ExternalLink size={14} /> Resume
                                                        </a>
                                                    )}
                                                    <button 
                                                        onClick={() => { setSelectedApp(app); setModalOpen(true); }} 
                                                        className="p-1.5 text-slate-400 hover:text-[#004AAD] hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Update Status"
                                                    >
                                                        <Edit3 size={15} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Status updates modal */}
            <StatusModal 
                application={selectedApp} 
                isOpen={modalOpen} 
                onClose={() => { setSelectedApp(null); setModalOpen(false); }} 
                onSave={handleStatusUpdate} 
            />
        </div>
    );
};

export default JobApplicants;
