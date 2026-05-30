import { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Plus, Edit2, Trash2, X, Loader2, Users, School, BookOpen, Clock, AlertCircle } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useSocketUpdate from '../../hooks/useSocketUpdate';

const BatchModal = ({ batch, isOpen, onClose, onSave, colleges }) => {
    const { token } = useAuthStore();
    const [formData, setFormData] = useState({
        collegeId: '',
        courseId: '',
        batchName: '',
        department: ''
    });
    const [courses, setCourses] = useState([]);
    const [loadingCourses, setLoadingCourses] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (batch) {
            setFormData({
                collegeId: batch.collegeId?._id || batch.collegeId || '',
                courseId: batch.courseId?._id || batch.courseId || '',
                batchName: batch.batchName || '',
                department: batch.department || ''
            });
        } else {
            setFormData({
                collegeId: colleges.length > 0 ? colleges[0]._id : '',
                courseId: '',
                batchName: '',
                department: ''
            });
        }
    }, [batch, isOpen, colleges]);

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
                setFormData(prev => ({ ...prev, courseId: batch.courseId?._id || batch.courseId }));
            } else if (res.data.data?.length > 0) {
                setFormData(prev => ({ ...prev, courseId: res.data.data[0]._id }));
            }
        }).catch(err => {
            console.error(err);
        }).finally(() => {
            setLoadingCourses(false);
        });
    }, [formData.collegeId, token, batch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        await onSave(formData);
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
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* College selector */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">College Context *</label>
                        <select 
                            required
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none"
                            value={formData.collegeId}
                            onChange={(e) => setFormData({...formData, collegeId: e.target.value, courseId: ''})}
                        >
                            <option value="">Choose College</option>
                            {colleges.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                        </select>
                    </div>

                    {/* Course selector */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Course Name *</label>
                        <select 
                            required
                            disabled={loadingCourses || courses.length === 0}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none disabled:opacity-60"
                            value={formData.courseId}
                            onChange={(e) => setFormData({...formData, courseId: e.target.value})}
                        >
                            <option value="">{loadingCourses ? 'Loading Courses...' : courses.length === 0 ? 'No courses active' : 'Choose Course'}</option>
                            {courses.map(c => <option key={c._id} value={c._id}>{c.name} ({c.code})</option>)}
                        </select>
                    </div>

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
    const location = useLocation();
    const [batches, setBatches] = useState([]);
    const [colleges, setColleges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const urlCollegeMatch = location.pathname.match(/\/college\/([a-f0-9]+)/);
    const urlCollegeId = urlCollegeMatch ? urlCollegeMatch[1] : null;
    const activeCollegeId = urlCollegeId || user?.collegeId;

    const [filterCollegeId, setFilterCollegeId] = useState(activeCollegeId || '');
    const [filterTrainerId, setFilterTrainerId] = useState('');
    const [trainersList, setTrainersList] = useState([]);

    // Sync college context on mount/change
    useEffect(() => {
        if (activeCollegeId) setFilterCollegeId(activeCollegeId);
    }, [activeCollegeId]);

    // Fetch trainers when college filter changes
    useEffect(() => {
        if (user?.role === 'super_admin' || user?.role === 'college_admin') {
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
    }, [token, filterCollegeId]);
    
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
            const url = (user?.role === 'super_admin' || user?.role === 'college_admin')
                ? `${baseURL}/admin/colleges/${targetCollege}/batches`
                : `${baseURL}/trainer/batches`;
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
            if (selectedBatch) {
                await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/trainer/batches/${selectedBatch._id}`, data, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/trainer/batches`, data, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            setIsModalOpen(false);
            fetchBatches();
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to save batch template.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this batch template?')) {
            try {
                await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/trainer/batches/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchBatches();
            } catch (error) {
                alert(error.response?.data?.error || 'Delete failed.');
            }
        }
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

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        {user?.role === 'trainer' ? 'My Batch Templates' : 'Trainer Batches'}
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        {user?.role === 'trainer' 
                            ? 'Pre-configure and manage batch schedules to speed up daily logs' 
                            : 'Monitor pre-configured batch templates managed by active trainers'}
                    </p>
                </div>
                {user?.role === 'trainer' && (
                    <button 
                        onClick={() => { setSelectedBatch(null); setIsModalOpen(true); }} 
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#004AAD] text-white text-sm font-semibold rounded-lg hover:bg-[#003580] shadow-sm active:scale-95 transition-all"
                    >
                        <Plus size={16} /> Add Batch Template
                    </button>
                )}
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
                        
                        {(user?.role === 'super_admin' || user?.role === 'college_admin') && (
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                {user?.role === 'super_admin' && (
                                    <select
                                        value={filterCollegeId}
                                        onChange={(e) => {
                                            setFilterCollegeId(e.target.value);
                                            setFilterTrainerId('');
                                        }}
                                        className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 outline-none focus:border-[#004AAD] text-slate-650 font-semibold cursor-pointer min-w-[160px]"
                                    >
                                        <option value="">All Colleges</option>
                                        {colleges.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                    </select>
                                )}
                                
                                <select
                                    value={filterTrainerId}
                                    onChange={(e) => setFilterTrainerId(e.target.value)}
                                    className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 outline-none focus:border-[#004AAD] text-slate-650 font-semibold cursor-pointer min-w-[160px]"
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
                    </div>
                </div>

                {loading ? (
                    <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-[#004AAD]" size={32} /></div>
                ) : filteredBatches.length === 0 ? (
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
                                        {user?.role === 'trainer' && <th className="p-4 text-center">Actions</th>}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm">
                                    {filteredBatches.map((b) => (
                                        <tr key={b._id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="p-4 font-semibold text-slate-800">
                                                {b.batchName}
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
                                            {user?.role === 'trainer' && (
                                                <td className="p-4 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button onClick={() => { setSelectedBatch(b); setIsModalOpen(true); }} className="p-2 text-slate-400 hover:text-[#004AAD] hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={15} /></button>
                                                        <button onClick={() => handleDelete(b._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={15} /></button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Card View (Mobile) */}
                        <div className="md:hidden divide-y divide-slate-100">
                            {filteredBatches.map((b) => (
                                <div key={b._id} className="p-4 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-slate-900">{b.batchName}</h4>
                                            <span className="inline-block text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full mt-1 font-semibold">DEPT: {b.department}</span>
                                        </div>
                                        {user?.role === 'trainer' && (
                                            <div className="flex items-center gap-1">
                                                <button onClick={() => { setSelectedBatch(b); setIsModalOpen(true); }} className="p-2 text-slate-400 hover:text-[#004AAD] hover:bg-blue-50 rounded-lg"><Edit2 size={15} /></button>
                                                <button onClick={() => handleDelete(b._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={15} /></button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-550 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                        <div>
                                            <span className="block font-bold text-slate-400 text-[10px] uppercase">College</span>
                                            <span className="font-medium text-slate-700">{b.collegeId?.name || '—'}</span>
                                        </div>
                                        <div>
                                            <span className="block font-bold text-slate-400 text-[10px] uppercase">Course</span>
                                            <span className="font-medium text-slate-700">{b.courseId?.name || '—'}</span>
                                            <span className="text-[10px] text-slate-400 block">({b.courseId?.code || '—'})</span>
                                        </div>
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
            />
        </div>
    );
};

export default Batches;
