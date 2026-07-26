import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
    ArrowLeft, Save, Trash2, CheckCircle2, XCircle, Search, 
    Calendar, Award, Hash, Bookmark, FileText, Loader2, Info
} from 'lucide-react';
import { AlertModal } from '../../components/Modals';

const THMRoomDetail = () => {
    const { batchId, roomId } = useParams();
    const navigate = useNavigate();

    // Data states
    const [assignment, setAssignment] = useState(null);
    const [roster, setRoster] = useState([]);
    const [batchName, setBatchName] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // Form states
    const [roomNo, setRoomNo] = useState('');
    const [roomCode, setRoomCode] = useState('');
    const [roomTitle, setRoomTitle] = useState('');
    const [roomMarks, setRoomMarks] = useState('');
    const [roomDueDate, setRoomDueDate] = useState('');

    // Search and filters
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'completed', 'pending'

    // Alert state
    const [alertState, setAlertState] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'info'
    });

    const token = localStorage.getItem('token');
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        fetchRoomData();
    }, [batchId, roomId]);

    const fetchRoomData = async () => {
        setLoading(true);
        try {
            const headers = { Authorization: `Bearer ${token}` };
            
            // Fetch single room details & student statuses
            const res = await axios.get(`${baseURL}/admin/batches/${batchId}/thm-rooms/${roomId}`, { headers });
            if (res.data.success) {
                const data = res.data.data;
                setAssignment(data.assignment);
                setRoster(data.roster);
                
                // Set form defaults
                setRoomNo(data.assignment.roomNumber);
                setRoomCode(data.assignment.roomCode);
                setRoomTitle(data.assignment.title);
                setRoomMarks(data.assignment.maxMarks);
                
                if (data.assignment.dueDate) {
                    const d = new Date(data.assignment.dueDate);
                    const formattedDate = d.toISOString().split('T')[0];
                    setRoomDueDate(formattedDate);
                } else {
                    setRoomDueDate('');
                }
            }

            // Fetch batch details to display name
            const batchRes = await axios.get(`${baseURL}/admin/batches/${batchId}`, { headers });
            if (batchRes.data.success) {
                setBatchName(batchRes.data.data.batchName);
            }
        } catch (err) {
            console.error('Error fetching room assignment data:', err);
            setAlertState({
                isOpen: true,
                title: 'Error Loading Data',
                message: err.response?.data?.error || 'Failed to fetch TryHackMe assignment details.',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateAssignment = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const headers = { Authorization: `Bearer ${token}` };
            const payload = {
                roomNumber: parseInt(roomNo),
                roomCode: roomCode.trim(),
                title: roomTitle.trim(),
                maxMarks: parseInt(roomMarks),
                dueDate: roomDueDate ? new Date(roomDueDate) : null
            };

            const res = await axios.put(`${baseURL}/admin/batches/${batchId}/thm-rooms/${roomId}`, payload, { headers });
            if (res.data.success) {
                setAlertState({
                    isOpen: true,
                    title: 'Update Successful',
                    message: 'TryHackMe Room assignment was successfully updated.',
                    type: 'success'
                });
                fetchRoomData();
            }
        } catch (err) {
            console.error('Error updating TryHackMe assignment:', err);
            setAlertState({
                isOpen: true,
                title: 'Error Saving Changes',
                message: err.response?.data?.error || 'Failed to update assignment details.',
                type: 'error'
            });
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAssignment = async () => {
        if (!window.confirm('Are you sure you want to delete this room assignment permanently? This will erase all student progress records for this room.')) return;
        setDeleting(true);
        try {
            const headers = { Authorization: `Bearer ${token}` };
            const res = await axios.delete(`${baseURL}/admin/batches/${batchId}/thm-rooms/${roomId}`, { headers });
            if (res.data.success) {
                alert('TryHackMe room assignment successfully deleted.');
                window.close(); // Close tab as it opened in a new tab
            }
        } catch (err) {
            console.error('Error deleting assignment:', err);
            setAlertState({
                isOpen: true,
                title: 'Deletion Failed',
                message: err.response?.data?.error || 'Failed to delete room assignment.',
                type: 'error'
            });
            setDeleting(false);
        }
    };

    // Filters & Searches
    const filteredRoster = roster.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             s.usn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             (s.tryhackmeHandle && s.tryhackmeHandle.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const matchesStatus = statusFilter === 'all' || s.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const totalStudents = roster.length;
    const completedCount = roster.filter(s => s.status === 'completed').length;
    const pendingCount = totalStudents - completedCount;
    const completionRate = totalStudents > 0 ? Math.round((completedCount / totalStudents) * 100) : 0;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 size={36} className="animate-spin text-[#004AAD]" />
                    <span className="text-sm font-bold text-slate-500">Loading assignment details...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* Header Navigation */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                        <button 
                            onClick={() => window.close()} 
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer"
                        >
                            <ArrowLeft size={14} /> Close & Return
                        </button>
                        <h1 className="text-2xl font-extrabold text-slate-850 tracking-tight flex items-center gap-2">
                            Manage TryHackMe Room #{assignment?.roomNumber}
                        </h1>
                        <p className="text-xs font-semibold text-slate-450 uppercase tracking-wider">
                            Batch: <strong className="text-slate-700">{batchName}</strong>
                        </p>
                    </div>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-[#004AAD] rounded-xl"><Bookmark size={20} /></div>
                        <div>
                            <span className="text-[10px] text-slate-400 uppercase font-bold block">Room Title</span>
                            <span className="text-base font-extrabold text-slate-800 truncate max-w-[200px] block" title={assignment?.title}>{assignment?.title}</span>
                        </div>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle2 size={20} /></div>
                        <div>
                            <span className="text-[10px] text-slate-400 uppercase font-bold block">Completed Students</span>
                            <span className="text-lg font-extrabold text-slate-800">{completedCount} / {totalStudents}</span>
                        </div>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Calendar size={20} /></div>
                        <div>
                            <span className="text-[10px] text-slate-400 uppercase font-bold block">Completion Rate</span>
                            <span className="text-lg font-extrabold text-slate-800">{completionRate}%</span>
                        </div>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Award size={20} /></div>
                        <div>
                            <span className="text-[10px] text-slate-400 uppercase font-bold block">Max Marks</span>
                            <span className="text-lg font-extrabold text-slate-800">{assignment?.maxMarks} Marks</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Left Column: Form Details Editor */}
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 self-start lg:col-span-1">
                        <div>
                            <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
                                <Info size={16} className="text-[#004AAD]" /> Edit Room Details
                            </h3>
                        </div>

                        <form onSubmit={handleUpdateAssignment} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Room Number *</label>
                                <div className="relative">
                                    <Hash size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input 
                                        type="number"
                                        required
                                        className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-250 rounded-xl text-xs focus:bg-white focus:border-[#004AAD] outline-none text-slate-800 font-bold"
                                        placeholder="e.g. 1"
                                        value={roomNo}
                                        onChange={e => setRoomNo(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Room Code *</label>
                                <div className="relative">
                                    <FileText size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input 
                                        type="text"
                                        required
                                        className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-250 rounded-xl text-xs focus:bg-white focus:border-[#004AAD] outline-none text-slate-800 font-bold"
                                        placeholder="TryHackMe room code (slug)"
                                        value={roomCode}
                                        onChange={e => setRoomCode(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Room Title *</label>
                                <div className="relative">
                                    <Bookmark size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input 
                                        type="text"
                                        required
                                        className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-250 rounded-xl text-xs focus:bg-white focus:border-[#004AAD] outline-none text-slate-800 font-bold"
                                        placeholder="Room Display Title"
                                        value={roomTitle}
                                        onChange={e => setRoomTitle(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Max Marks *</label>
                                <div className="relative">
                                    <Award size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input 
                                        type="number"
                                        required
                                        className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-250 rounded-xl text-xs focus:bg-white focus:border-[#004AAD] outline-none text-slate-800 font-bold"
                                        placeholder="Max marks to award"
                                        value={roomMarks}
                                        onChange={e => setRoomMarks(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Due Date</label>
                                <div className="relative">
                                    <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input 
                                        type="date"
                                        className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-250 rounded-xl text-xs focus:bg-white focus:border-[#004AAD] outline-none text-slate-800 font-bold"
                                        value={roomDueDate}
                                        onChange={e => setRoomDueDate(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="pt-2 flex flex-col gap-2">
                                <button 
                                    type="submit"
                                    disabled={saving}
                                    className="w-full py-3 bg-[#004AAD] hover:bg-[#003580] text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-100 transition cursor-pointer active:scale-[0.98] disabled:opacity-50"
                                >
                                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save Details
                                </button>
                                <button 
                                    type="button"
                                    onClick={handleDeleteAssignment}
                                    disabled={deleting}
                                    className="w-full py-3 border border-red-200 text-red-500 hover:bg-red-50 font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-[0.98] disabled:opacity-50"
                                >
                                    {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />} Delete Assignment
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right Column: Student Roster Checklist & Progress Details */}
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 lg:col-span-2">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-3">
                            <h3 className="text-sm font-extrabold text-slate-800">
                                Student Roster Checklist ({filteredRoster.length})
                            </h3>
                            
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                {/* Search */}
                                <div className="relative w-full sm:w-48">
                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input 
                                        type="text"
                                        placeholder="Search student..."
                                        className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:bg-white focus:border-[#004AAD]"
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                    />
                                </div>

                                {/* Status Filter */}
                                <select 
                                    value={statusFilter}
                                    onChange={e => setStatusFilter(e.target.value)}
                                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none text-slate-600 font-semibold focus:bg-white"
                                >
                                    <option value="all">All</option>
                                    <option value="completed">Completed</option>
                                    <option value="pending">Pending</option>
                                </select>
                            </div>
                        </div>

                        {filteredRoster.length === 0 ? (
                            <p className="text-center text-slate-400 text-xs py-8">No student matching this filter found.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-xs">
                                    <thead>
                                        <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                                            <th className="py-2.5 pr-2">Student</th>
                                            <th className="py-2.5 px-3">USN</th>
                                            <th className="py-2.5 px-3">THM Handle</th>
                                            <th className="py-2.5 px-3">Status</th>
                                            <th className="py-2.5 pl-3 text-right">Obtained Marks</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 font-bold text-slate-700">
                                        {filteredRoster.map(s => (
                                            <tr key={s.studentId} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="py-3.5 pr-2 block truncate max-w-[150px]">{s.name}</td>
                                                <td className="py-3.5 px-3 font-mono text-slate-500">{s.usn}</td>
                                                <td className="py-3.5 px-3 text-slate-500 font-mono">{s.tryhackmeHandle}</td>
                                                <td className="py-3.5 px-3">
                                                    {s.status === 'completed' ? (
                                                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px]">
                                                            <CheckCircle2 size={10} /> Completed
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-slate-50 text-slate-400 rounded-full text-[10px]">
                                                            <XCircle size={10} /> Pending
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-3.5 pl-3 text-right font-mono text-slate-800">
                                                    {s.status === 'completed' ? `${s.obtainedMarks} / ${assignment?.maxMarks}` : `0 / ${assignment?.maxMarks}`}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <AlertModal
                isOpen={alertState.isOpen}
                onClose={() => setAlertState(prev => ({ ...prev, isOpen: false }))}
                title={alertState.title}
                message={alertState.message}
                type={alertState.type}
            />
        </div>
    );
};

export default THMRoomDetail;
