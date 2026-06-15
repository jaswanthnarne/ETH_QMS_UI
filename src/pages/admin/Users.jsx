import { useState, useEffect } from 'react';
import { Users, Plus, Search, Edit2, Trash2, X, Loader2, Shield, Mail, Phone, Lock, Check } from 'lucide-react';
import axios from 'axios';
import useAuthStore from '../../store/authStore';
import useSocketUpdate from '../../hooks/useSocketUpdate';

const UserModal = ({ userObj, isOpen, onClose, onSave, colleges }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
        role: 'regional_manager',
        collegeId: '',
        assignedColleges: []
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (userObj) {
            setFormData({
                ...userObj,
                password: '', // Clear password field on edit
                collegeId: userObj.collegeId?._id || userObj.collegeId || '',
                assignedColleges: userObj.assignedColleges?.map(c => c._id || c) || []
            });
        } else {
            setFormData({
                username: '',
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                phone: '',
                role: 'regional_manager',
                collegeId: '',
                assignedColleges: []
            });
        }
    }, [userObj, isOpen]);

    const handleCollegeCheckbox = (collegeId) => {
        const current = formData.assignedColleges || [];
        const next = current.includes(collegeId)
            ? current.filter(id => id !== collegeId)
            : [...current, collegeId];
        setFormData({ ...formData, assignedColleges: next });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        // Clean up empty fields
        const payload = { ...formData };
        if (!payload.password) delete payload.password;
        if (!payload.email) delete payload.email;
        if (!payload.phone) delete payload.phone;
        
        // Clear unneeded scoping fields based on role
        if (payload.role !== 'college_admin') {
            payload.collegeId = null;
        }
        if (!['regional_manager', 'asst_rm'].includes(payload.role)) {
            payload.assignedColleges = [];
        }

        await onSave(payload);
        setSubmitting(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/35 backdrop-blur-sm" onClick={onClose} />
            <div className="bg-white max-w-xl w-full rounded-2xl shadow-2xl relative z-10 border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                        <Shield className="text-[#004AAD]" size={20} />
                        {userObj ? 'Edit Admin Account' : 'Create Admin Account'}
                    </h3>
                    <button onClick={onClose} className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors text-slate-400"><X size={18} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">First Name</label>
                            <input className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none" value={formData.firstName || ''} onChange={(e) => setFormData({...formData, firstName: e.target.value})} placeholder="John" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Last Name</label>
                            <input className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none" value={formData.lastName || ''} onChange={(e) => setFormData({...formData, lastName: e.target.value})} placeholder="Doe" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Username</label>
                            <input required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none" value={formData.username || ''} onChange={(e) => setFormData({...formData, username: e.target.value})} placeholder="johndoe" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Password</label>
                            <input type="password" required={!userObj} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none" value={formData.password || ''} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder={userObj ? 'Leave blank to keep current' : '••••••'} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email</label>
                            <input type="email" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none" value={formData.email || ''} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="john.doe@ethnotech.com" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Mobile Phone</label>
                            <input className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none" value={formData.phone || ''} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="+91 9876543210" />
                        </div>
                    </div>

                    {/* Role Selection */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Account Role</label>
                        <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none cursor-pointer" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                            <option value="regional_manager">Regional Manager (RM)</option>
                            <option value="asst_rm">Assistant Regional Manager (ARM)</option>
                            <option value="ops_admin">Operations Admin (Ops)</option>
                            <option value="ast_ops_admin">Assistant Operations Admin</option>
                            <option value="college_admin">College Admin</option>
                        </select>
                    </div>

                    {/* Primary College Scope (For College Admin Only) */}
                    {formData.role === 'college_admin' && (
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Primary College</label>
                            <select required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none cursor-pointer" value={formData.collegeId} onChange={(e) => setFormData({...formData, collegeId: e.target.value})}>
                                <option value="">Select College Context...</option>
                                {colleges.map(c => <option key={c._id} value={c._id}>{c.name} ({c.code})</option>)}
                            </select>
                        </div>
                    )}

                    {/* Multiple Colleges Assignment Scope (For RM / ARM Only) */}
                    {['regional_manager', 'asst_rm'].includes(formData.role) && (
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Assigned Colleges (Data Scopes)</label>
                            <div className="border border-slate-200 rounded-xl max-h-48 overflow-y-auto p-4 space-y-2 bg-slate-50">
                                {colleges.length === 0 ? (
                                    <p className="text-xs text-slate-400">No colleges available</p>
                                ) : (
                                    colleges.map(c => {
                                        const isChecked = formData.assignedColleges?.includes(c._id);
                                        return (
                                            <label key={c._id} className="flex items-center gap-3 cursor-pointer p-1.5 hover:bg-white rounded transition-colors">
                                                <input type="checkbox" checked={isChecked} onChange={() => handleCollegeCheckbox(c._id)} className="rounded border-slate-300 text-[#004AAD] focus:ring-blue-100" />
                                                <span className="text-xs font-medium text-slate-700">{c.name} <code className="text-[10px] bg-slate-100 text-slate-500 px-1 py-0.5 rounded font-mono ml-1">{c.code}</code></span>
                                            </label>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="pt-4 flex gap-3 border-t border-slate-100">
                        <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-50">Cancel</button>
                        <button type="submit" disabled={submitting} className="flex-1 py-2.5 bg-[#004AAD] text-white rounded-lg text-sm font-semibold hover:bg-[#003580] disabled:opacity-50 flex items-center justify-center gap-2">
                            {submitting && <Loader2 size={16} className="animate-spin" />}
                            {userObj ? 'Save Changes' : 'Create Account'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [colleges, setColleges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { token } = useAuthStore();

    const fetchData = async () => {
        try {
            const headers = { Authorization: `Bearer ${token}` };
            const [usersRes, collegesRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/users`, { headers }),
                axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/colleges`, { headers })
            ]);
            setUsers(usersRes.data.data || []);
            setColleges(collegesRes.data.data || []);
        } catch (e) {
            console.error('Failed to load user accounts page context', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useSocketUpdate(() => fetchData(), ['users', 'colleges']);

    const handleSave = async (data) => {
        try {
            const headers = { Authorization: `Bearer ${token}` };
            if (selectedUser) {
                await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/users/${selectedUser._id}`, data, { headers });
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/users`, data, { headers });
            }
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to save admin user account.');
        }
    };

    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete account: "${name}"? This action cannot be undone.`)) {
            try {
                await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/users/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchData();
            } catch (error) {
                alert(error.response?.data?.error || 'Failed to delete account.');
            }
        }
    };

    const filteredUsers = users.filter(u => {
        const search = searchTerm.toLowerCase();
        const fullName = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
        const username = (u.username || '').toLowerCase();
        const email = (u.email || '').toLowerCase();
        const phone = (u.phone || '').toLowerCase();
        const role = (u.role || '').toLowerCase().replace('_', ' ');

        return fullName.includes(search) || username.includes(search) || email.includes(search) || phone.includes(search) || role.includes(search);
    });

    const getRoleBadge = (role) => {
        switch (role) {
            case 'ops_admin': return 'bg-purple-50 text-purple-700 border-purple-100';
            case 'ast_ops_admin': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
            case 'regional_manager': return 'bg-[#004AAD]/10 text-[#004AAD] border-blue-100';
            case 'asst_rm': return 'bg-sky-50 text-sky-700 border-sky-100';
            case 'college_admin': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            default: return 'bg-slate-50 text-slate-700 border-slate-100';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Administrator Accounts</h1>
                    <p className="text-sm text-slate-500 mt-1">Create and manage access settings for managers, college admins, and operations</p>
                </div>
                <button onClick={() => { setSelectedUser(null); setIsModalOpen(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-[#004AAD] text-white text-sm font-semibold rounded-lg hover:bg-[#003580] transition-colors shadow-sm cursor-pointer"><Plus size={16} /> Add Admin User</button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-slate-700">{filteredUsers.length} user account{filteredUsers.length !== 1 ? 's' : ''}</h3>
                    <div className="relative w-72">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#004AAD]" placeholder="Search administrator accounts..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Profile Details</th>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Username / Role</th>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Mapping Scope</th>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-16 text-center">
                                        <Loader2 className="animate-spin mx-auto text-[#004AAD]" size={24} />
                                        <p className="text-sm text-slate-400 mt-2">Loading user directories...</p>
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-16 text-center">
                                        <Users size={32} className="mx-auto text-slate-200 mb-2" />
                                        <p className="text-sm text-slate-400">No administrator accounts match your query</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((u) => {
                                    const displayName = `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'No Name Provided';
                                    
                                    // Calculate College Scope Summary
                                    let scopingText = 'Global / Unrestricted';
                                    if (u.role === 'college_admin') {
                                        scopingText = u.collegeId?.name || 'Assigned College Missing';
                                    } else if (['regional_manager', 'asst_rm'].includes(u.role)) {
                                        if (u.assignedColleges && u.assignedColleges.length > 0) {
                                            scopingText = `${u.assignedColleges.length} Assigned College(s)`;
                                        } else {
                                            scopingText = 'No Colleges Assigned (Read-only Scoped)';
                                        }
                                    }

                                    return (
                                        <tr key={u._id} className="hover:bg-slate-50/50 group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-[#004AAD] text-white rounded-full flex items-center justify-center font-bold text-sm">
                                                        {u.firstName ? u.firstName.charAt(0) : (u.username || 'A').charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-900">{displayName}</p>
                                                        <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                                                            {u.email && <span className="flex items-center gap-1"><Mail size={12} /> {u.email}</span>}
                                                            {u.phone && <span className="flex items-center gap-1"><Phone size={12} /> {u.phone}</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-semibold text-slate-700">{u.username}</p>
                                                <span className={`inline-flex items-center px-2 py-0.5 mt-1 border rounded-full text-[10px] font-bold capitalize ${getRoleBadge(u.role)}`}>
                                                    {u.role?.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-xs font-semibold text-slate-550 truncate max-w-xs" title={scopingText}>{scopingText}</p>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => { setSelectedUser(u); setIsModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-[#004AAD] rounded-md hover:bg-blue-50 transition-colors" title="Edit account details"><Edit2 size={15} /></button>
                                                    <button onClick={() => handleDelete(u._id, u.username)} className="p-1.5 text-slate-400 hover:text-red-500 rounded-md hover:bg-red-50 transition-colors" title="Revoke access"><Trash2 size={15} /></button>
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

            <UserModal 
                userObj={selectedUser} 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSave={handleSave} 
                colleges={colleges} 
            />
        </div>
    );
};

export default UsersPage;
