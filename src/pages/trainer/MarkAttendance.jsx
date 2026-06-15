import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Loader2, Check, X, Clock, HelpCircle, AlertCircle, Save } from 'lucide-react';
import axios from 'axios';
import useAuthStore from '../../store/authStore';

const MarkAttendance = () => {
    const { batchId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { token } = useAuthStore();

    // Check if we are editing an existing session
    const searchParams = new URLSearchParams(location.search);
    const sessionId = searchParams.get('sessionId');

    // States
    const [batch, setBatch] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Session form fields
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [topic, setTopic] = useState('');
    const [duration, setDuration] = useState(60);
    const [period, setPeriod] = useState('Hour 1');
    const [module, setModule] = useState('Module 1');

    // Attendance records map: { studentId: { status, remarks } }
    const [records, setRecords] = useState({});

    const loadData = async () => {
        setLoading(true);
        setError('');
        try {
            const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const headers = { Authorization: `Bearer ${token}` };

            // 1. Fetch batch metadata
            const batchRes = await axios.get(`${baseURL}/admin/batches/${batchId}`, { headers });
            setBatch(batchRes.data.data);

            // 2. Fetch student roster
            const studentsRes = await axios.get(`${baseURL}/admin/batches/${batchId}/students`, { headers });
            const roster = studentsRes.data.data || [];
            setStudents(roster);

            // Initialize records with default status: 'present'
            const initialRecords = {};
            roster.forEach(student => {
                initialRecords[student._id] = {
                    status: 'present',
                    remarks: ''
                };
            });

            // 3. If editing, fetch session details
            if (sessionId) {
                const sessionRes = await axios.get(`${baseURL}/attendance/session/${sessionId}`, { headers });
                const session = sessionRes.data.data;
                if (session) {
                    setDate(new Date(session.date).toISOString().split('T')[0]);
                    setTopic(session.topic || '');
                    setDuration(session.duration || 60);
                    setPeriod(session.period || 'Hour 1');
                    setModule(session.module || 'Module 1');

                    // Overlay loaded student records onto roster defaults
                    session.records.forEach(record => {
                        const sId = record.studentId?._id || record.studentId;
                        if (sId) {
                            initialRecords[sId] = {
                                status: record.status || 'present',
                                remarks: record.remarks || ''
                            };
                        }
                    });
                }
            }

            setRecords(initialRecords);
        } catch (err) {
            console.error('Failed to load attendance details', err);
            setError(err.response?.data?.error || 'Failed to initialize rosters. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [batchId, sessionId, token]);

    // Fast action updates
    const updateAllStatuses = (status) => {
        setRecords(prev => {
            const updated = { ...prev };
            Object.keys(updated).forEach(id => {
                updated[id] = { ...updated[id], status };
            });
            return updated;
        });
    };

    const handleStatusChange = (studentId, status) => {
        setRecords(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                status
            }
        }));
    };

    const handleRemarksChange = (studentId, remarks) => {
        setRecords(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                remarks
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!topic.trim()) {
            setError('Session topic is required');
            return;
        }

        setSubmitting(true);
        setError('');
        setSuccessMsg('');

        try {
            const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const headers = { Authorization: `Bearer ${token}` };

            // Format records array for payload
            const recordsPayload = Object.keys(records).map(studentId => ({
                studentId,
                status: records[studentId].status,
                remarks: records[studentId].remarks
            }));

            const payload = {
                batchId,
                date,
                topic: topic.trim(),
                duration: parseInt(duration),
                period,
                module,
                records: recordsPayload
            };

            let res;
            if (sessionId) {
                // Update
                res = await axios.put(`${baseURL}/attendance/session/${sessionId}`, payload, { headers });
            } else {
                // Create
                res = await axios.post(`${baseURL}/attendance`, payload, { headers });
            }

            if (res.data.success) {
                setSuccessMsg(sessionId ? 'Attendance log updated successfully.' : 'Attendance session saved successfully.');
                setTimeout(() => {
                    navigate(`/trainer/attendance/history/${batchId}`);
                }, 1500);
            }
        } catch (err) {
            console.error('Failed to submit attendance', err);
            setError(err.response?.data?.error || 'Failed to submit attendance. Please verify entries.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="animate-spin text-[#004AAD]" size={36} />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in duration-300">
            {/* Navigation Header */}
            <div className="flex flex-col gap-3">
                <button 
                    onClick={() => navigate(sessionId ? `/trainer/attendance/history/${batchId}` : '/trainer/attendance')} 
                    className="flex items-center gap-2 text-slate-500 hover:text-[#004AAD] text-sm font-bold w-fit transition-all active:translate-x-[-2px]"
                >
                    <ArrowLeft size={16} /> Back to Attendance Logs
                </button>

                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">
                            {sessionId ? 'Edit Attendance Log' : 'Take Attendance'}
                        </h1>
                        <p className="text-xs text-slate-500 mt-1">
                            Batch: <span className="font-semibold text-slate-700">{batch?.batchName}</span> • Course: <span className="font-semibold text-slate-700">{batch?.courseId?.name || '—'}</span>
                        </p>
                    </div>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-2xl flex items-center gap-3 animate-head-shake">
                    <AlertCircle className="text-rose-600 shrink-0" size={18} />
                    <span className="font-semibold">{error}</span>
                </div>
            )}

            {successMsg && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center gap-3">
                    <Check className="text-emerald-600 shrink-0" size={18} />
                    <span className="font-bold">{successMsg}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Session details card */}
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-slate-800 pb-2 border-b border-slate-100">Session Metadata</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Class Date *</label>
                            <input 
                                type="date" 
                                required
                                value={date}
                                onChange={e => setDate(e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-[#004AAD] outline-none text-slate-800 font-semibold"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Topic Covered *</label>
                            <input 
                                type="text"
                                required
                                placeholder="e.g. Introduction to React state management"
                                value={topic}
                                onChange={e => setTopic(e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-[#004AAD] outline-none text-slate-800 font-semibold"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Period/Hour *</label>
                            <select
                                value={period}
                                onChange={e => setPeriod(e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-[#004AAD] outline-none text-slate-700 font-semibold"
                            >
                                <option value="Hour 1">Hour 1 (1st Period)</option>
                                <option value="Hour 2">Hour 2 (2nd Period)</option>
                                <option value="Hour 3">Hour 3 (3rd Period)</option>
                                <option value="Hour 4">Hour 4 (4th Period)</option>
                                <option value="Hour 5">Hour 5 (5th Period)</option>
                                <option value="Hour 6">Hour 6 (6th Period)</option>
                                <option value="Session 1">Session 1 (Morning)</option>
                                <option value="Session 2">Session 2 (Afternoon)</option>
                                <option value="Full Day">Full Day Session</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Duration (Minutes)</label>
                            <input 
                                type="number" 
                                min="15"
                                max="480"
                                value={duration}
                                onChange={e => setDuration(e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-[#004AAD] outline-none text-slate-800 font-semibold"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Module *</label>
                            <select
                                required
                                value={module}
                                onChange={e => setModule(e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-[#004AAD] outline-none text-slate-700 font-semibold"
                            >
                                <option value="">Select Module</option>
                                {Array.from({ length: batch?.courseId?.modulesCount || 5 }, (_, i) => (
                                    <option key={i + 1} value={`Module ${i + 1}`}>{`Module ${i + 1}`}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Student roster list card */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                            <h3 className="text-sm font-bold text-slate-800">Student Roster</h3>
                            <p className="text-[11px] text-slate-500 mt-0.5">Toggle each student's status for the session.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => updateAllStatuses('present')}
                                className="px-3 py-1.5 bg-emerald-600 border border-emerald-500 text-white rounded-lg text-[10px] font-bold hover:bg-emerald-700 shadow-sm"
                            >
                                All Present
                            </button>
                            <button
                                type="button"
                                onClick={() => updateAllStatuses('absent')}
                                className="px-3 py-1.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-[10px] font-bold hover:bg-rose-100 shadow-sm"
                            >
                                All Absent
                            </button>
                        </div>
                    </div>

                    {students.length === 0 ? (
                        <div className="p-8 text-center text-slate-500 text-xs">
                            No students registered inside this batch.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                        <th className="p-4 pl-6">Student Info</th>
                                        <th className="p-4">USN / Roll Number</th>
                                        <th className="p-4 text-center">Status</th>
                                        <th className="p-4 pr-6">Remarks / Notes</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {students.map((student, idx) => {
                                        const currentRec = records[student._id] || { status: 'present', remarks: '' };
                                        return (
                                            <tr key={student._id} className="hover:bg-slate-50/45 transition-colors">
                                                <td className="p-4 pl-6">
                                                    <div className="font-bold text-slate-800 text-xs">{student.name}</div>
                                                    <div className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">
                                                        {student.department || 'GEN'} {student.division && `• Div ${student.division}`}
                                                    </div>
                                                </td>
                                                <td className="p-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">
                                                    {student.usn}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleStatusChange(student._id, 'present')}
                                                            className={`p-1.5 rounded-lg border flex items-center gap-1 text-[10px] font-bold transition-all ${
                                                                currentRec.status === 'present'
                                                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm'
                                                                    : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
                                                            }`}
                                                            title="Present"
                                                        >
                                                            <Check size={14} /> P
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleStatusChange(student._id, 'absent')}
                                                            className={`p-1.5 rounded-lg border flex items-center gap-1 text-[10px] font-bold transition-all ${
                                                                currentRec.status === 'absent'
                                                                    ? 'bg-rose-50 border-rose-200 text-rose-700 shadow-sm'
                                                                    : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
                                                            }`}
                                                            title="Absent"
                                                        >
                                                            <X size={14} /> A
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleStatusChange(student._id, 'late')}
                                                            className={`p-1.5 rounded-lg border flex items-center gap-1 text-[10px] font-bold transition-all ${
                                                                currentRec.status === 'late'
                                                                    ? 'bg-amber-50 border-amber-200 text-amber-700 shadow-sm'
                                                                    : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
                                                            }`}
                                                            title="Late"
                                                        >
                                                            <Clock size={14} /> L
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleStatusChange(student._id, 'excused')}
                                                            className={`p-1.5 rounded-lg border flex items-center gap-1 text-[10px] font-bold transition-all ${
                                                                currentRec.status === 'excused'
                                                                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm'
                                                                    : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
                                                            }`}
                                                            title="Excused"
                                                        >
                                                            <HelpCircle size={14} /> E
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="p-4 pr-6">
                                                    <input 
                                                        type="text"
                                                        placeholder="Add brief note..."
                                                        value={currentRec.remarks}
                                                        onChange={e => handleRemarksChange(student._id, e.target.value)}
                                                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] focus:bg-white focus:border-[#004AAD] outline-none font-medium"
                                                    />
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Form Actions */}
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={() => navigate(sessionId ? `/trainer/attendance/history/${batchId}` : '/trainer/attendance')}
                        className="px-6 py-3 border border-slate-200 text-slate-500 rounded-xl text-xs font-bold hover:bg-slate-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting || students.length === 0}
                        className="px-6 py-3 bg-[#004AAD] hover:bg-[#003580] text-white rounded-xl text-xs font-extrabold disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-md shadow-blue-100"
                    >
                        {submitting ? (
                            <>
                                <Loader2 size={14} className="animate-spin" /> Saving...
                            </>
                        ) : (
                            <>
                                <Save size={14} /> {sessionId ? 'Update Logs' : 'Submit Attendance'}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MarkAttendance;
