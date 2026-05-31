import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Users, CheckCircle, XCircle, Clock, ShieldAlert, TrendingUp, ArrowLeft,
    Play, RefreshCcw, Download, Copy, BookOpen, AlertTriangle, Loader2, Timer, Pause, RotateCcw,
    MessageSquare, Send, Megaphone, X
} from 'lucide-react';
import { io } from 'socket.io-client';
import axios from 'axios';
import useAuthStore from '../../store/authStore';
import { ConfirmModal, AlertModal } from '../../components/Modals';

const StatusBadge = ({ status }) => {
    const config = {
        started: { color: 'bg-blue-50 text-blue-700', dot: 'bg-blue-500', label: 'In Progress' },
        completed: { color: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500', label: 'Completed' },
        violated: { color: 'bg-red-50 text-red-700', dot: 'bg-red-500', label: 'Violated' },
        active: { color: 'bg-blue-50 text-blue-700', dot: 'bg-blue-500', label: 'Active' },
    };
    const s = config[status] || { color: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400', label: status };
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${s.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            {s.label}
        </span>
    );
};

const WaitingRoom = () => {
    const { key } = useParams();
    const navigate = useNavigate();
    const { token } = useAuthStore();

    const [exam, setExam] = useState(null);
    const [students, setStudents] = useState([]);
    const [liveStudents, setLiveStudents] = useState({});
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    const [starting, setStarting] = useState(false);
    const [confirmState, setConfirmState] = useState({ open: false });
    const [alertState, setAlertState] = useState({ open: false });
    const socket = useRef(null);
    const timerRef = useRef(null);

    // Chat & Broadcast state
    const [chatOpen, setChatOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [broadcastOpen, setBroadcastOpen] = useState(false);
    const [broadcastMsg, setBroadcastMsg] = useState('');
    const [unreadChat, setUnreadChat] = useState(0);
    const chatEndRef = useRef(null);

    // Fetch initial HTTP data
    const fetchRoomData = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/trainer/waiting-room/${key}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setExam(res.data.data.exam);
            setStudents(res.data.data.students);
        } catch (e) { console.error('Waiting room fetch failed', e); }
        finally { setLoading(false); }
    };

    // Socket for real-time updates
    useEffect(() => {
        fetchRoomData();

        socket.current = io((import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'));
        socket.current.emit('trainer_monitor', key);

        socket.current.on('student_status_update', (data) => {
            setLiveStudents(prev => {
                const updated = { ...prev };
                if (data.type === 'join') {
                    updated[data.studentId] = {
                        id: data.studentId, name: data.studentName,
                        rollNumber: data.rollNumber, mobile: data.mobile,
                        progress: 0, violations: 0, status: 'active', joinedAt: data.timestamp
                    };
                } else if (data.type === 'progress') {
                    if (updated[data.studentId]) updated[data.studentId].progress = data.progress;
                } else if (data.type === 'violation') {
                    if (updated[data.studentId]) updated[data.studentId].violations = data.count;
                } else if (data.type === 'submit') {
                    if (updated[data.studentId]) updated[data.studentId].status = 'completed';
                }
                return updated;
            });
        });

        // Chat listeners
        socket.current.emit('fetch_chat_history', { examKey: key });
        socket.current.on('chat_history', (msgs) => {
            setChatMessages(msgs);
        });
        socket.current.on('chat_message', (msg) => {
            setChatMessages(prev => [...prev, msg]);
            if (!chatOpen && msg.senderRole === 'student') {
                setUnreadChat(prev => prev + 1);
            }
        });

        // Elapsed timer
        timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);

        // Fallback polling for serverless (Vercel) hosting
        const pollingInterval = setInterval(() => {
            fetchRoomData();
        }, 5000);

        return () => {
            if (socket.current) socket.current.disconnect();
            clearInterval(timerRef.current);
            clearInterval(pollingInterval);
        };
    }, [key]);

    const allStudents = [
        ...students.map(s => {
            const liveMatch = liveStudents[s.rollNumber];
            return liveMatch ? { ...s, ...liveMatch, id: s.id } : s;
        }),
        ...Object.values(liveStudents).filter(ls => !students.find(s => s.rollNumber?.toString() === ls.rollNumber?.toString()))
    ];

    const active = allStudents.filter(s => s.status === 'started' || s.status === 'active').length;
    const completed = allStudents.filter(s => s.status === 'completed').length;
    const violated = allStudents.filter(s => s.status === 'violated').length;
    const totalViolations = Object.values(liveStudents).reduce((s, st) => s + (st.violations || 0), 0);

    const copyKey = () => {
        navigator.clipboard.writeText(key);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleExport = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/analytics/export?type=exam&id=${exam?.id}`, {
                headers: { Authorization: `Bearer ${token}` }, responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const a = document.createElement('a'); a.href = url;
            a.setAttribute('download', `${exam?.title}_Results.xlsx`);
            document.body.appendChild(a); a.click(); a.remove();
        } catch { 
            setAlertState({ open: true, title: 'Export Failed', message: 'There was an issue exporting the results.', type: 'error' });
        }
    };

    const handleStartSession = async () => {
        setConfirmState({
            open: true,
            title: 'Start Exam Session',
            message: 'Are you sure you want to start the exam? All students in the waiting room will begin immediately.',
            type: 'warning',
            confirmText: 'Start Session',
            onConfirm: async () => {
                try {
                    setStarting(true);
                    await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/trainer/waiting-room/${key}/start`, {}, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (socket.current) {
                        socket.current.emit('trainer_start_session', key);
                    }
                    setExam(prev => ({ ...prev, isStarted: true }));
                } catch (error) {
                    setAlertState({ open: true, title: 'Error Starting Session', message: error.response?.data?.error || error.message, type: 'error' });
                } finally {
                    setStarting(false);
                }
            }
        });
    };

    const handleForceSubmit = async () => {
        setConfirmState({
            open: true,
            title: 'Force End Exam',
            message: 'Are you sure you want to end the exam for all active students? Their attempts will be completed immediately.',
            type: 'danger',
            confirmText: 'End Exam',
            onConfirm: async () => {
                try {
                    await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/trainer/waiting-room/${key}/force-submit`, {}, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (socket.current) {
                        socket.current.emit('trainer_end_session', key);
                    }
                    setAlertState({ open: true, title: 'Success', message: 'Exam forcibly submitted for all active students.', type: 'success' });
                    fetchRoomData();
                } catch (error) {
                    setAlertState({ open: true, title: 'Error Ending Exam', message: error.response?.data?.error || error.message, type: 'error' });
                }
            }
        });
    };

    const handlePauseSession = async () => {
        setConfirmState({
            open: true,
            title: 'Pause Exam Session',
            message: 'Are you sure you want to pause the exam? All active students will be temporarily locked out and their timers halted.',
            type: 'warning',
            confirmText: 'Pause Session',
            onConfirm: async () => {
                try {
                    await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/trainer/waiting-room/${key}/pause`, {}, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (socket.current) socket.current.emit('trainer_pause_session', key);
                    setAlertState({ open: true, title: 'Success', message: 'Exam paused successfully.', type: 'success' });
                    fetchRoomData();
                } catch (error) {
                    setAlertState({ open: true, title: 'Error Pausing Exam', message: error.response?.data?.error || error.message, type: 'error' });
                }
            }
        });
    };

    const handleResumeSession = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/trainer/waiting-room/${key}/resume`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (socket.current) socket.current.emit('trainer_resume_session', key);
            setAlertState({ open: true, title: 'Success', message: 'Exam resumed successfully.', type: 'success' });
            fetchRoomData();
        } catch (error) {
            setAlertState({ open: true, title: 'Error Resuming Exam', message: error.response?.data?.error || error.message, type: 'error' });
        }
    };

    const handleRestartSession = async () => {
        setConfirmState({
            open: true,
            title: 'Restart / Reopen Session',
            message: 'This will re-activate the exam key so new students can join. Are you sure?',
            type: 'warning',
            confirmText: 'Restart Session',
            onConfirm: async () => {
                try {
                    await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/trainer/waiting-room/${key}/restart`, {}, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (socket.current) socket.current.emit('trainer_restart_session', key);
                    setAlertState({ open: true, title: 'Success', message: 'Exam key reopened.', type: 'success' });
                    fetchRoomData();
                } catch (error) {
                    setAlertState({ open: true, title: 'Error Restarting Exam', message: error.response?.data?.error || error.message, type: 'error' });
                }
            }
        });
    };

    const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

    // Chat send handler
    const handleSendChat = () => {
        const msg = chatInput.trim();
        if (!msg || !socket.current) return;
        socket.current.emit('chat_message', {
            examKey: key,
            senderRole: 'trainer',
            senderName: 'Trainer',
            senderId: 'trainer',
            message: msg
        });
        setChatInput('');
    };

    // Broadcast handler
    const handleBroadcast = () => {
        const msg = broadcastMsg.trim();
        if (!msg || !socket.current) return;
        socket.current.emit('trainer_broadcast', {
            examKey: key,
            message: msg,
            trainerName: 'Trainer'
        });
        setBroadcastMsg('');
        setBroadcastOpen(false);
        setAlertState({ open: true, title: 'Broadcast Sent', message: 'Your announcement has been delivered to all active students.', type: 'success' });
    };

    // Auto-scroll chat
    useEffect(() => {
        if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages, chatOpen]);

    // Reset unread when chat opened
    useEffect(() => {
        if (chatOpen) setUnreadChat(0);
    }, [chatOpen]);

    if (loading) return (
        <div className="h-[50vh] flex flex-col items-center justify-center gap-3">
            <Loader2 className="animate-spin text-[#004AAD]" size={28} />
            <p className="text-sm text-slate-400">Loading waiting room...</p>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/dashboard')}
                        className="p-2 text-slate-400 hover:text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{exam?.title || 'Exam Room'}</h1>
                        <div className="flex items-center gap-3 mt-1">
                            {exam?.courseCode && (
                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#004AAD] bg-blue-50 px-2 py-0.5 rounded">
                                    <BookOpen size={10} /> {exam.courseCode}
                                </span>
                            )}
                            <span className="text-xs text-slate-400">{exam?.college}</span>
                            <span className="flex items-center gap-1 text-xs text-slate-400">
                                <Timer size={12} /> Session: {formatTime(elapsed)}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {!exam?.isStarted && (
                        <button 
                            onClick={handleStartSession} 
                            disabled={starting}
                            className="flex items-center gap-2 px-5 py-2.5 bg-[#004AAD] text-white text-sm font-semibold rounded-xl hover:bg-[#003580] transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
                        >
                            {starting ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} fill="currentColor" />} 
                            {starting ? 'Starting...' : 'Start Session'}
                        </button>
                    )}
                    {exam?.isStarted && exam?.isActive && !exam?.isPaused && (
                        <button 
                            onClick={handlePauseSession} 
                            className="flex items-center gap-2 px-4 py-2 border border-amber-200 text-amber-600 bg-amber-50 text-sm font-semibold rounded-lg hover:bg-amber-100 transition-all"
                        >
                            <Pause size={15} /> Pause
                        </button>
                    )}
                    {exam?.isStarted && exam?.isActive && exam?.isPaused && (
                        <button 
                            onClick={handleResumeSession} 
                            className="flex items-center gap-2 px-4 py-2 border border-emerald-200 text-emerald-600 bg-emerald-50 text-sm font-semibold rounded-lg hover:bg-emerald-100 transition-all"
                        >
                            <Play size={15} /> Resume
                        </button>
                    )}
                    {exam?.isStarted && exam?.isActive && (
                        <button 
                            onClick={handleForceSubmit} 
                            className="flex items-center gap-2 px-4 py-2 border border-rose-200 text-rose-600 bg-rose-50 text-sm font-semibold rounded-lg hover:bg-rose-100 transition-all"
                        >
                            <XCircle size={15} /> End Exam
                        </button>
                    )}
                    {!exam?.isActive && (
                        <button 
                            onClick={handleRestartSession} 
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-all shadow-md"
                        >
                            <RotateCcw size={15} /> Reopen Key
                        </button>
                    )}
                    <button onClick={fetchRoomData} className="p-2 text-slate-400 hover:text-[#004AAD] border border-slate-200 rounded-lg hover:bg-blue-50 transition-colors">
                        <RefreshCcw size={16} />
                    </button>
                    <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors">
                        <Download size={15} /> Export
                    </button>
                    <button 
                        onClick={() => setBroadcastOpen(true)} 
                        className="flex items-center gap-2 px-4 py-2 border border-indigo-200 text-indigo-600 bg-indigo-50 text-sm font-semibold rounded-lg hover:bg-indigo-100 transition-all"
                    >
                        <Megaphone size={15} /> Broadcast
                    </button>
                    <button 
                        onClick={() => setChatOpen(!chatOpen)} 
                        className="relative flex items-center gap-2 px-4 py-2 border border-emerald-200 text-emerald-600 bg-emerald-50 text-sm font-semibold rounded-lg hover:bg-emerald-100 transition-all"
                    >
                        <MessageSquare size={15} /> Chat
                        {unreadChat > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                                {unreadChat}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Exam Info + Key */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase mb-3">Exam Details</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-slate-500">Course</span><span className="font-semibold text-slate-900">{exam?.course}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Duration</span><span className="font-semibold text-slate-900">{exam?.duration} min</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Total Marks</span><span className="font-semibold text-slate-900">{exam?.totalMarks}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Passing Percentage</span><span className="font-semibold text-emerald-600">{exam?.passingPercentage}%</span></div>
                    </div>
                </div>

                <div className="bg-slate-900 p-5 rounded-xl text-white">
                    <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Student Access Key</p>
                    <div className="flex items-center justify-between">
                        <code className="text-2xl font-black font-mono tracking-widest text-emerald-400">{key}</code>
                        <button onClick={copyKey} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 text-white rounded-lg text-xs font-semibold hover:bg-white/20 transition-colors">
                            {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                    <p className="text-xs text-slate-400 mt-3">Share this key with students to join the exam</p>
                </div>
            </div>

            {/* Live Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Joined', val: allStudents.length, icon: Users, color: 'text-slate-600', bg: 'bg-slate-100' },
                    { label: 'In Progress', val: active, icon: Play, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Submitted', val: completed, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Violations', val: totalViolations, icon: ShieldAlert, color: 'text-red-600', bg: 'bg-red-50' },
                ].map((s) => (
                    <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-4">
                        <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center mb-3`}>
                            <s.icon size={18} className={s.color} />
                        </div>
                        <p className="text-xs text-slate-500 font-medium">{s.label}</p>
                        <p className="text-2xl font-bold text-slate-900">{s.val}</p>
                    </div>
                ))}
            </div>

            {/* Student Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="font-bold text-slate-900">Live Student Monitor</h2>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-xs text-slate-400 font-medium">Real-time</span>
                    </div>
                </div>

                {allStudents.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center text-center">
                        <Users size={40} className="text-slate-200 mb-4" />
                        <h3 className="text-base font-semibold text-slate-700">Waiting for students</h3>
                        <p className="text-sm text-slate-400 mt-1 max-w-xs">Share the access key with students. They will appear here when they join.</p>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50">
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">#</th>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Student</th>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">Roll / Mobile</th>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-center">Score</th>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-center">Violations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {allStudents.map((s, i) => (
                                <tr key={s.id || i} className="hover:bg-slate-50/50">
                                    <td className="px-6 py-3 text-sm text-slate-400">{i + 1}</td>
                                    <td className="px-6 py-3">
                                        <p className="text-sm font-semibold text-slate-900">{s.name || '—'}</p>
                                        <p className="text-xs text-slate-400">{s.department || ''}</p>
                                    </td>
                                    <td className="px-6 py-3 hidden md:table-cell">
                                        <p className="text-xs text-slate-600">{s.rollNumber || '—'}</p>
                                        <p className="text-xs text-slate-400">{s.mobile || '—'}</p>
                                    </td>
                                    <td className="px-6 py-3"><StatusBadge status={s.status} /></td>
                                    <td className="px-6 py-3 text-center">
                                        {s.percentage != null ? (
                                            <div>
                                                <p className={`text-sm font-bold ${s.result === 'pass' ? 'text-emerald-600' : s.result === 'fail' ? 'text-red-500' : 'text-slate-600'}`}>
                                                    {s.percentage?.toFixed(1)}%
                                                </p>
                                                <p className="text-xs text-slate-400">{s.score}/{exam?.totalMarks}</p>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-slate-400">—</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-3 text-center">
                                        {(s.violations || 0) > 0 ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 rounded-full text-xs font-semibold">
                                                <AlertTriangle size={10} /> {s.violations}
                                            </span>
                                        ) : (
                                            <span className="text-xs text-emerald-500">✓ Clean</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <ConfirmModal 
                isOpen={confirmState.open}
                onClose={() => setConfirmState({ ...confirmState, open: false })}
                title={confirmState.title}
                message={confirmState.message}
                type={confirmState.type}
                confirmText={confirmState.confirmText}
                onConfirm={confirmState.onConfirm}
            />
            
            <AlertModal
                isOpen={alertState.open}
                onClose={() => setAlertState({ ...alertState, open: false })}
                title={alertState.title}
                message={alertState.message}
                type={alertState.type}
            />

            {/* ========== BROADCAST ANNOUNCEMENT MODAL ========== */}
            {broadcastOpen && (
                <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-6">
                    <div className="bg-white rounded-[2rem] shadow-2xl max-w-md w-full p-8 relative">
                        <button onClick={() => setBroadcastOpen(false)} className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all">
                            <X size={18} />
                        </button>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                                <Megaphone size={24} className="text-indigo-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Broadcast Announcement</h3>
                                <p className="text-sm text-slate-400">Message will appear to all active students</p>
                            </div>
                        </div>
                        <textarea
                            value={broadcastMsg}
                            onChange={(e) => setBroadcastMsg(e.target.value)}
                            className="w-full h-32 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-indigo-400 outline-none resize-none mb-4"
                            placeholder='e.g. "5 minutes remaining" or "Correction in Question 4: Option B should read..."'
                            maxLength={300}
                        />
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-400">{broadcastMsg.length}/300</span>
                            <button
                                onClick={handleBroadcast}
                                disabled={!broadcastMsg.trim()}
                                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-40 transition-all shadow-lg shadow-indigo-200"
                            >
                                <Send size={14} /> Send to All Students
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ========== LIVE CHAT DRAWER ========== */}
            {chatOpen && (
                <div className="fixed top-0 right-0 h-full w-96 bg-white border-l border-slate-200 shadow-2xl z-[150] flex flex-col">
                    {/* Chat Header */}
                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center">
                                <MessageSquare size={18} className="text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Live Chat</h3>
                                <p className="text-xs text-slate-400">{chatMessages.length} messages</p>
                            </div>
                        </div>
                        <button onClick={() => setChatOpen(false)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all">
                            <X size={16} />
                        </button>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {chatMessages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <MessageSquare size={32} className="text-slate-200 mb-3" />
                                <p className="text-sm font-semibold text-slate-500">No messages yet</p>
                                <p className="text-xs text-slate-400 mt-1">Students can message you here if they face any issues during the exam.</p>
                            </div>
                        ) : chatMessages.map((msg, i) => (
                            <div key={msg.id || i} className={`flex ${msg.senderRole === 'trainer' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                                    msg.senderRole === 'trainer'
                                        ? 'bg-[#004AAD] text-white rounded-br-md'
                                        : 'bg-slate-100 text-slate-800 rounded-bl-md'
                                }`}>
                                    {msg.senderRole === 'student' && (
                                        <p className="text-[10px] font-bold text-emerald-600 mb-0.5">{msg.senderName} ({msg.senderId})</p>
                                    )}
                                    <p className="leading-relaxed">{msg.message}</p>
                                    <p className={`text-[9px] mt-1 ${
                                        msg.senderRole === 'trainer' ? 'text-blue-200' : 'text-slate-400'
                                    }`}>
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Chat Input */}
                    <div className="px-4 py-3 border-t border-slate-100 bg-white">
                        <div className="flex gap-2">
                            <input
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#004AAD] outline-none"
                                placeholder="Type a reply..."
                                maxLength={500}
                            />
                            <button
                                onClick={handleSendChat}
                                disabled={!chatInput.trim()}
                                className="px-4 py-2.5 bg-[#004AAD] text-white rounded-xl hover:bg-[#003580] disabled:opacity-40 transition-all"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WaitingRoom;
