import { useState, useEffect } from 'react';
import { School, Plus, Search, Edit2, Trash2, X, Loader2, Building2, Mail, Phone, ExternalLink, Download } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useCollegeStore from '../../store/collegeStore';
import useSocketUpdate from '../../hooks/useSocketUpdate';

const CollegeModal = ({ college, isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({ name: '', code: '', address: '', contactEmail: '', contactPhone: '', status: 'active' });
    const [submitting, setSubmitting] = useState(false);
    useEffect(() => { if (college) setFormData(college); else setFormData({ name: '', code: '', address: '', contactEmail: '', contactPhone: '', status: 'active' }); }, [college, isOpen]);
    const handleSubmit = async (e) => { e.preventDefault(); setSubmitting(true); await onSave(formData); setSubmitting(false); };
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
            <div className="bg-white max-w-lg w-full rounded-xl shadow-2xl relative z-10 border border-slate-200">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900 text-lg">{college ? 'Edit College' : 'Add New College'}</h3>
                    <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400"><X size={18} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div><label className="block text-sm font-medium text-slate-700 mb-1">College Name</label><input required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] focus:ring-2 focus:ring-blue-100 outline-none" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Ethnotech Institute of Technology" /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-slate-700 mb-1">Code</label><input required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono uppercase focus:bg-white focus:border-[#004AAD] outline-none" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} placeholder="ETH-01" /></div>
                        <div><label className="block text-sm font-medium text-slate-700 mb-1">Status</label><select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-slate-700 mb-1">Email</label><input type="email" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none" value={formData.contactEmail} onChange={(e) => setFormData({...formData, contactEmail: e.target.value})} placeholder="admin@college.edu" /></div>
                        <div><label className="block text-sm font-medium text-slate-700 mb-1">Phone</label><input className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none" value={formData.contactPhone} onChange={(e) => setFormData({...formData, contactPhone: e.target.value})} placeholder="+91 9876543210" /></div>
                    </div>
                    <div className="pt-3 flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-50">Cancel</button>
                        <button type="submit" disabled={submitting} className="flex-1 py-2.5 bg-[#004AAD] text-white rounded-lg text-sm font-semibold hover:bg-[#003580] disabled:opacity-50 flex items-center justify-center gap-2">{submitting && <Loader2 size={16} className="animate-spin" />}{college ? 'Save Changes' : 'Create College'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Colleges = () => {
    const navigate = useNavigate();
    const [colleges, setColleges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCollege, setSelectedCollege] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { token } = useAuthStore();
    const { setSelectedCollege: setContextCollege } = useCollegeStore();

    const fetchColleges = async () => { try { const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/colleges`, { headers: { Authorization: `Bearer ${token}` } }); setColleges(res.data.data); } catch (e) { console.error(e); } finally { setLoading(false); } };
    useEffect(() => { fetchColleges(); }, []);
    useSocketUpdate(() => fetchColleges(), ['colleges']);
    const handleSave = async (data) => { try { if (selectedCollege) { await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/colleges/${selectedCollege._id}`, data, { headers: { Authorization: `Bearer ${token}` } }); } else { await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/colleges`, data, { headers: { Authorization: `Bearer ${token}` } }); } setIsModalOpen(false); fetchColleges(); } catch (error) { alert(error.response?.data?.error || 'Failed to save college'); } };
    const handleDelete = async (id) => { if (window.confirm('Delete this college? All associated courses, trainers, and exams will be removed.')) { try { await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/colleges/${id}`, { headers: { Authorization: `Bearer ${token}` } }); fetchColleges(); } catch (error) { alert(error.response?.data?.error || 'Failed to delete'); } } };
    const handleManage = (college) => { window.open(`/college/${college._id}/dashboard`, '_blank'); };
    const handleExport = async (id, name) => { try { const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/analytics/export?type=college&id=${id}`, { headers: { Authorization: `Bearer ${token}` }, responseType: 'blob' }); const url = window.URL.createObjectURL(new Blob([res.data])); const a = document.createElement('a'); a.href = url; a.setAttribute('download', `${name}_Report.xlsx`); document.body.appendChild(a); a.click(); a.remove(); } catch { alert('Export failed'); } };
    const filteredColleges = colleges.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.code.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Colleges</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage institutional profiles and registrations</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => handleExport('all', 'All_Colleges')} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"><Download size={16} /> Export All</button>
                    <button onClick={() => { setSelectedCollege(null); setIsModalOpen(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-[#004AAD] text-white text-sm font-semibold rounded-lg hover:bg-[#003580] transition-colors shadow-sm"><Plus size={16} /> Add College</button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-slate-700">{filteredColleges.length} college{filteredColleges.length !== 1 ? 's' : ''}</h3>
                    <div className="relative w-72">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#004AAD]" placeholder="Search colleges..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                </div>
                <table className="w-full text-left">
                    <thead><tr className="bg-slate-50"><th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">College</th><th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Code</th><th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th><th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th></tr></thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (<tr><td colSpan="4" className="px-6 py-16 text-center"><Loader2 className="animate-spin mx-auto text-[#004AAD]" size={24} /><p className="text-sm text-slate-400 mt-2">Loading...</p></td></tr>
                        ) : filteredColleges.length === 0 ? (<tr><td colSpan="4" className="px-6 py-16 text-center"><Building2 size={32} className="mx-auto text-slate-200 mb-2" /><p className="text-sm text-slate-400">No colleges found</p></td></tr>
                        ) : filteredColleges.map((college) => (
                            <tr key={college._id} className="hover:bg-slate-50/50 group">
                                <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-9 h-9 bg-blue-50 text-[#004AAD] rounded-lg flex items-center justify-center font-bold text-sm">{college.name.charAt(0)}</div><div><p className="text-sm font-semibold text-slate-900">{college.name}</p>{college.contactEmail && <p className="text-xs text-slate-400">{college.contactEmail}</p>}</div></div></td>
                                <td className="px-6 py-4"><code className="px-2 py-1 bg-slate-100 text-xs font-mono text-slate-600 rounded">{college.code}</code></td>
                                <td className="px-6 py-4"><span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${college.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}><span className={`w-1.5 h-1.5 rounded-full ${college.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />{college.status}</span></td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2 transition-opacity">
                                        <button onClick={() => handleManage(college)} className="px-3 py-1.5 bg-[#004AAD] text-white rounded-md text-xs font-medium hover:bg-[#003580] flex items-center gap-1"><ExternalLink size={12} /> Manage</button>
                                        <button onClick={() => handleExport(college._id, college.name)} className="p-1.5 text-slate-400 hover:text-[#004AAD] rounded-md hover:bg-blue-50"><Download size={16} /></button>
                                        <button onClick={() => { setSelectedCollege(college); setIsModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-[#004AAD] rounded-md hover:bg-blue-50"><Edit2 size={16} /></button>
                                        <button onClick={() => handleDelete(college._id)} className="p-1.5 text-slate-400 hover:text-red-500 rounded-md hover:bg-red-50"><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <CollegeModal isOpen={isModalOpen} college={selectedCollege} onClose={() => setIsModalOpen(false)} onSave={handleSave} />
        </div>
    );
};
export default Colleges;
