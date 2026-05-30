import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Users, 
    AlertCircle, 
    CheckCircle2, 
    Clock, 
    ShieldAlert,
    TrendingUp,
    ArrowLeft,
    Search,
    Filter
} from 'lucide-react';
import { io } from 'socket.io-client';
import useAuthStore from '../../store/authStore';

const LiveSession = () => {
    const { key } = useParams();
    const navigate = useNavigate();
    const { token } = useAuthStore();
    const [students, setStudents] = useState([]);
    const [stats, setStats] = useState({
        active: 0,
        violations: 0,
        submitted: 0
    });
    const socket = useRef(null);

    useEffect(() => {
        socket.current = io((import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'));
        
        socket.current.emit('trainer_monitor', key);

        socket.current.on('student_status_update', (data) => {
            setStudents(prev => {
                const existing = prev.find(s => s.id === data.studentId);
                let newList;
                
                if (data.type === 'join') {
                    if (existing) return prev;
                    newList = [...prev, {
                        id: data.studentId,
                        name: data.studentName,
                        rollNumber: data.rollNumber,
                        mobile: data.mobile,
                        progress: 0,
                        violations: 0,
                        status: 'active',
                        lastUpdate: data.timestamp
                    }];
                } else if (data.type === 'progress') {
                    newList = prev.map(s => s.id === data.studentId ? { ...s, progress: data.progress, lastUpdate: data.timestamp } : s);
                } else if (data.type === 'violation') {
                    newList = prev.map(s => s.id === data.studentId ? { ...s, violations: data.count, lastUpdate: data.timestamp } : s);
                } else if (data.type === 'submit') {
                    newList = prev.map(s => s.id === data.studentId ? { ...s, status: 'submitted', lastUpdate: data.timestamp } : s);
                } else {
                    newList = prev;
                }

                // Update Stats
                const active = newList.filter(s => s.status === 'active').length;
                const submitted = newList.filter(s => s.status === 'submitted').length;
                const totalViolations = newList.reduce((acc, s) => acc + s.violations, 0);
                setStats({ active, submitted, violations: totalViolations });

                return newList;
            });
        });

        return () => {
            if (socket.current) socket.current.disconnect();
        };
    }, [key]);

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Moderator Header */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex items-center gap-6">
                    <button 
                        onClick={() => navigate('/dashboard')} 
                        className="w-12 h-12 flex items-center justify-center bg-slate-50 hover:bg-slate-900 hover:text-white rounded-2xl text-slate-400 transition-all border border-slate-100"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/5">Active Session</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] font-mono">ID: {key}</span>
                        </div>
                        <h1 className="text-2xl font-black text-slate-900 border-none tracking-tight uppercase tracking-tighter">Moderator <span className="text-primary">Live Feed</span></h1>
                    </div>
                </div>
                
                <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3 px-6 py-2.5 bg-white text-emerald-600 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-sm border border-slate-100">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse border-2 border-emerald-500/20 shadow-lg shadow-emerald-500/20"></div>
                        Real-time Sync Active
                    </div>
                </div>
            </div>

            {/* Performance KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { label: 'Active Students', value: stats.active, icon: Users, color: 'blue' },
                    { label: 'Integrity Violations', value: stats.violations, icon: ShieldAlert, color: 'rose' },
                    { label: 'Completed Units', value: stats.submitted, icon: CheckCircle2, color: 'emerald' }
                ].map((kpi, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm group hover:shadow-xl transition-all duration-500">
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-4 bg-${kpi.color}-50 text-${kpi.color}-600 rounded-2xl shadow-inner`}>
                                <kpi.icon size={28} />
                            </div>
                            <div className="flex flex-col items-end">
                                <TrendingUp size={16} className="text-slate-200" />
                                <span className={`text-[8px] font-black uppercase tracking-widest text-${kpi.color}-500 mt-1`}>Enterprise Live</span>
                            </div>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">{kpi.label}</p>
                        <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{kpi.value}</h3>
                    </div>
                ))}
            </div>

            {/* Main Progress Feed */}
            <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden mb-10">
                <div className="px-10 py-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-50/30">
                    <div>
                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Student Assessment Feed</h3>
                        <p className="text-xs text-slate-500 font-medium">Tracking live progress and institutional compliance.</p>
                    </div>
                    
                    <div className="w-full md:w-auto relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Filter by name or ID..." 
                            className="w-full md:w-72 pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-primary transition-all shadow-sm" 
                        />
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-10 py-5 text-left text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Personnel Identity</th>
                                <th className="px-10 py-5 text-left text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 w-1/4">Progress Metrics</th>
                                <th className="px-10 py-5 text-left text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Integrity Check</th>
                                <th className="px-10 py-5 text-left text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Status</th>
                                <th className="px-10 py-5 text-right text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Last Telemetry</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {students.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-10 py-24 text-center">
                                        <div className="flex flex-col items-center justify-center opacity-30 grayscale">
                                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                                <Users size={40} className="text-slate-400" />
                                            </div>
                                            <p className="text-sm font-black uppercase tracking-widest text-slate-500">Awaiting student authentication...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : students.map(student => (
                                <tr key={student.id} className="hover:bg-slate-50/80 transition-all group">
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black shadow-lg shadow-slate-200 group-hover:scale-110 transition-transform">
                                                {student.name.charAt(0)}
                                            </div>
                                            <div>
                                                <span className="block font-black text-slate-800 uppercase tracking-tighter text-sm">{student.name}</span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Roll: {student.rollNumber || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-end">
                                                <span className="text-[10px] font-black text-slate-900">{student.progress}% Complete</span>
                                                <div className="flex gap-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <div key={i} className={`w-1.5 h-3 rounded-full ${i < (student.progress / 20) ? 'bg-primary' : 'bg-slate-100'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200/50">
                                                <div 
                                                    className={`h-full transition-all duration-1000 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.4)] ${student.progress === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-primary to-indigo-600'}`} 
                                                    style={{ width: `${student.progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${student.violations > 0 ? 'bg-rose-50 text-rose-600 shadow-sm border border-rose-100' : 'bg-slate-50 text-slate-400'}`}>
                                            <ShieldAlert size={14} />
                                            {student.violations} Violations
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <span className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-colors ${
                                            student.status === 'submitted' 
                                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm' 
                                            : 'bg-indigo-50 text-indigo-600 border border-indigo-100 animate-pulse'
                                        }`}>
                                            {student.status === 'submitted' ? 'Finalized' : 'Moderating'}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6 text-right font-mono text-xs font-black text-slate-400">
                                        {new Date(student.lastUpdate).toLocaleTimeString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LiveSession;
