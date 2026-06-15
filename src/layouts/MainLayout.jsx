import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import { 
    LayoutDashboard, School, BookOpen, Users, User, FileText, BarChart3, 
    LogOut, Menu, X, Bell, ChevronDown, Search, Send, Globe, ArrowLeftRight, Trophy, ShieldCheck, Database, FileSpreadsheet,
    CalendarCheck, Briefcase, Lock, CheckSquare
} from 'lucide-react';
import { SocketContext } from '../contexts/SocketContext';
import useAuthStore from '../store/authStore';
import useStudentAuthStore from '../store/studentAuthStore';
import useCollegeStore from '../store/collegeStore';
import axios from 'axios';

const MainLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { user, logout, token } = useAuthStore();
    const { student, logoutStudent, token: studentToken } = useStudentAuthStore();
    const isStudent = !!student;
    const { selectedCollegeId, selectedCollegeName, setSelectedCollege, clearSelectedCollege } = useCollegeStore();
    const [colleges, setColleges] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    // Notifications State
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
    const socketRef = useRef(null);

    const fetchNotifications = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/notifications`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setNotifications(res.data.data);
                setUnreadCount(res.data.unreadCount);
            }
        } catch (e) {
            console.error('Failed to fetch notifications', e);
        }
    };

    useEffect(() => {
        if (!token) return;

        if (user && user.role !== 'student') {
            fetchNotifications();
        }

        // Connect socket for all authenticated users so pages can react to live updates.
        const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
        const isVercelServer = socketUrl.includes('vercel.app');
        socketRef.current = isVercelServer 
            ? { on: () => {}, off: () => {}, emit: () => {}, disconnect: () => {} }
            : io(socketUrl);

        if (user && user.role !== 'student') {
            socketRef.current.on('new_notification', (data) => {
                if (data.collegeId && ['college_admin', 'trainer', 'regional_manager', 'asst_rm'].includes(user.role)) {
                    const collegesList = [
                        ...(user.collegeId ? [user.collegeId.toString()] : []),
                        ...(Array.isArray(user.assignedColleges) ? user.assignedColleges.map(id => id.toString()) : [])
                    ];
                    if (collegesList.length > 0 && !collegesList.includes(data.collegeId.toString())) {
                        return;
                    }
                }
                setNotifications(prev => [data, ...prev].slice(0, 50));
                setUnreadCount(prev => prev + 1);
            });
        }

        return () => {
            if (socketRef.current) socketRef.current.disconnect();
        };
    }, [token, user]);

    const handleMarkAsRead = async (id) => {
        try {
            const res = await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (e) {
            console.error('Failed to mark read', e);
        }
    };

    const handleClearAll = async () => {
        try {
            const res = await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/notifications/clear`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
                setUnreadCount(0);
            }
        } catch (e) {
            console.error('Failed to clear notifications', e);
        }
    };

    const prefix = selectedCollegeId ? `/college/${selectedCollegeId}` : '';

    const ALL_ADMINS = ['super_admin', 'ops_admin', 'ast_ops_admin', 'regional_manager', 'asst_rm', 'college_admin'];
    const isGlobalAdmin = ['super_admin', 'ops_admin', 'ast_ops_admin', 'regional_manager', 'asst_rm'].includes(user?.role);
    const isRegionalOrAsstRM = ['regional_manager', 'asst_rm'].includes(user?.role);

    const menuItems = isStudent ? [
        { label: 'Enter Exam', icon: FileText, path: '/student/dashboard?tab=enter-exam' },
        { label: 'Exam History', icon: Trophy, path: '/student/dashboard?tab=exam-history' },
        { label: 'Profile', icon: User, path: '/student/dashboard?tab=profile' },
        { label: 'Attendance', icon: CalendarCheck, path: '/student/dashboard?tab=attendance' },
        { label: 'To-do List', icon: CheckSquare, path: '/student/dashboard?tab=todo' },
        { label: 'Account Security', icon: Lock, path: '/student/dashboard?tab=security' }
    ] : user?.role === 'trainer' ? [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { label: 'Exams', icon: FileText, path: '/trainer/exams' },
        { label: 'Courses', icon: BookOpen, path: '/trainer/courses' },
        { label: 'My Batches', icon: Users, path: '/trainer/batches' },
        { label: 'Attendance', icon: CalendarCheck, path: '/trainer/attendance' },
        { label: 'Analytics', icon: BarChart3, path: '/analytics' },
        { label: 'Reports & Exports', icon: Database, path: '/reports' }
    ] : (isRegionalOrAsstRM && !selectedCollegeId) ? [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' }
    ] : (isGlobalAdmin && !selectedCollegeId) ? [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { label: 'Colleges', icon: School, path: '/admin/colleges' },
        { label: 'Courses', icon: BookOpen, path: '/admin/courses' },
        { label: 'Trainers', icon: Users, path: '/admin/trainers' },
        { label: 'Attendance', icon: CalendarCheck, path: '/admin/attendance' },
        { label: 'Training Logs', icon: FileSpreadsheet, path: '/admin/logs' },
        ...(['super_admin', 'ops_admin'].includes(user?.role) ? [{ label: 'Admins & Staff', icon: ShieldCheck, path: '/admin/users' }] : []),
        { label: 'Analytics', icon: BarChart3, path: '/analytics' },
        { label: 'Reports & Exports', icon: Database, path: '/reports' }
    ] : [
        { label: 'Dashboard', icon: LayoutDashboard, path: `${prefix}/dashboard` },
        { label: 'Courses', icon: BookOpen, path: `${prefix}/admin/courses` },
        { label: 'Exams', icon: FileText, path: `${prefix}/admin/exams` },
        { label: 'Trainers', icon: Users, path: `${prefix}/admin/trainers` },
        { label: 'Batches', icon: Users, path: `${prefix}/admin/batches` },
        { label: 'Attendance', icon: CalendarCheck, path: `${prefix}/admin/attendance` },
        { label: 'Allotments', icon: Send, path: `${prefix}/admin/allotments` },
        { label: 'Training Logs', icon: FileSpreadsheet, path: `${prefix}/admin/logs` },
        { label: 'Analytics', icon: BarChart3, path: `${prefix}/analytics` },
        { label: 'Reports & Exports', icon: Database, path: `${prefix}/reports` },
        { label: 'Audit Log', icon: ShieldCheck, path: `${prefix}/admin/audit` },
    ];

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!token) return;
        const isAnyAdmin = ['super_admin', 'ops_admin', 'ast_ops_admin', 'regional_manager', 'asst_rm', 'college_admin'].includes(user?.role);
        if (isAnyAdmin || user?.role === 'trainer') {
            const fetchColleges = async () => {
                try {
                    const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/colleges`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setColleges(res.data.data || []);
                } catch (e) { console.error('Failed to load colleges'); }
            };
            fetchColleges();
        }
    }, [user, token]);

    useEffect(() => {
        if (isGlobalAdmin && !location.pathname.startsWith('/college/') && selectedCollegeId) {
            clearSelectedCollege();
        }
    }, [location.pathname, user, selectedCollegeId, clearSelectedCollege]);

    const handleLogout = () => {
        logout();
        clearSelectedCollege();
        navigate('/console/admin');
    };

    const displayAvatar = isStudent ? (student?.name?.charAt(0) || 'S') : (user?.firstName?.charAt(0) || 'U');
    const displayName = isStudent ? student?.name : user?.firstName;
    const displayRole = isStudent ? 'Student' : user?.role?.replace('_', ' ');
    const displayLogout = isStudent ? () => {
        logoutStudent();
        navigate('/portal');
    } : handleLogout;

    return (
        <SocketContext.Provider value={socketRef.current}>
            <div className="flex h-screen bg-slate-50 font-['Inter'] overflow-hidden relative">
                {/* Mobile Sidebar Backdrop */}
                {sidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-black/20 backdrop-blur-xs z-30 md:hidden" 
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

            {/* Sidebar */}
            <aside className={`fixed md:relative inset-y-0 left-0 z-40 flex flex-col bg-white border-r border-slate-200 transition-all duration-300 h-full ${
                sidebarOpen 
                    ? 'w-64 translate-x-0' 
                    : 'w-64 -translate-x-full md:translate-x-0 md:w-20'
            }`}>
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                            <img src="/logonew.jpg" alt="Ethnotech" className="w-full h-full object-cover" />
                        </div>
                        {sidebarOpen && (
                            <div className="leading-tight">
                                <span className="text-sm font-bold text-slate-900 block">Ethnotech</span>
                                <span className="text-[10px] font-medium text-[#004AAD]">Academy</span>
                            </div>
                        )}
                    </div>
                    {/* Close button for mobile */}
                    {sidebarOpen && (
                        <button 
                            onClick={() => setSidebarOpen(false)} 
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 md:hidden"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>

                {/* Context Badge */}
                {sidebarOpen && !isStudent && (
                    <div className="px-4 pt-4">
                        <div className={`px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 ${selectedCollegeId ? 'bg-blue-50 text-[#004AAD] border border-blue-100' : 'bg-slate-50 text-slate-500 border border-slate-100'}`}>
                            {selectedCollegeId ? <School size={14} /> : <Globe size={14} />}
                            <span className="truncate">{selectedCollegeId ? selectedCollegeName : 'All Colleges'}</span>
                        </div>
                    </div>
                )}

                {/* Nav Items */}
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto mt-2">
                    {menuItems.map((item) => {
                        const isActive = isStudent 
                            ? (location.pathname + location.search) === item.path || (item.path === '/student/dashboard?tab=enter-exam' && !location.search)
                            : location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
                        return (
                            <NavLink
                                key={item.path} to={item.path}
                                onClick={() => {
                                    if (window.innerWidth < 768) {
                                        setSidebarOpen(false);
                                    }
                                }}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-[#004AAD] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                            >
                                <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                                {sidebarOpen && <span>{item.label}</span>}
                            </NavLink>
                        );
                    })}

                    {!isStudent && selectedCollegeId && isGlobalAdmin && (
                        <button 
                            onClick={() => { 
                                clearSelectedCollege(); 
                                navigate('/dashboard'); 
                                if (window.innerWidth < 768) {
                                    setSidebarOpen(false);
                                }
                            }}
                            title={isRegionalOrAsstRM ? 'Switch College' : 'Switch to Global'}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-amber-600 hover:bg-amber-50 transition-colors mt-4"
                        >
                            <ArrowLeftRight size={18} />
                            {sidebarOpen && <span>{isRegionalOrAsstRM ? 'Switch College' : 'Switch to Global'}</span>}
                        </button>
                    )}
                </nav>

                {/* User Section */}
                <div className="p-4 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#004AAD] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                            {displayAvatar}
                        </div>
                        {sidebarOpen && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-900 truncate">{displayName}</p>
                                <p className="text-xs text-slate-400 capitalize">{displayRole}</p>
                            </div>
                        )}
                        {sidebarOpen && (
                            <button onClick={displayLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Logout">
                                <LogOut size={16} />
                            </button>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
                            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>

                        {!isStudent && (
                            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg w-80">
                                <Search size={16} className="text-slate-400" />
                                <input type="text" placeholder="Search..." className="bg-transparent text-sm outline-none w-full text-slate-600 placeholder:text-slate-400" />
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        {/* College Selector / Read-only Student Badge */}
                        {isStudent && student?.collegeName && (
                            <div className="text-sm bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-700 font-semibold flex items-center gap-2 max-w-[280px] md:max-w-[360px] truncate shadow-sm">
                                <School size={15} className="text-[#004AAD] flex-shrink-0" />
                                <span className="truncate">{student.collegeName}</span>
                            </div>
                        )}
                        {!isStudent && (isGlobalAdmin || user?.role === 'trainer') && (
                            selectedCollegeId ? (
                                <div className="text-sm bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-700 font-semibold flex items-center gap-2 max-w-[280px] md:max-w-[360px] truncate shadow-sm">
                                    <School size={15} className="text-[#004AAD] flex-shrink-0" />
                                    <span className="truncate">{selectedCollegeName}</span>
                                    <button 
                                        onClick={() => { 
                                            clearSelectedCollege(); 
                                            if (isGlobalAdmin) navigate('/dashboard'); 
                                        }}
                                        className="ml-1 text-slate-400 hover:text-red-500 font-bold transition-colors cursor-pointer"
                                        title="Clear college context"
                                    >
                                        ×
                                    </button>
                                </div>
                            ) : (
                                <select 
                                    className="text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-[#004AAD] text-slate-600 min-w-[200px]"
                                    value={selectedCollegeId || ''}
                                    onChange={(e) => {
                                        if (!e.target.value) { 
                                            clearSelectedCollege(); 
                                            if (isGlobalAdmin) navigate('/dashboard'); 
                                        }
                                        else {
                                            const college = colleges.find(c => c._id === e.target.value);
                                            if (college) { 
                                                setSelectedCollege(college._id, college.name, college.code); 
                                                if (isGlobalAdmin) {
                                                    navigate(`/college/${college._id}/dashboard`); 
                                                }
                                            }
                                        }
                                    }}
                                >
                                    <option value="">All Colleges</option>
                                    {colleges.map(c => (<option key={c._id} value={c._id}>{c.name}</option>))}
                                </select>
                            )
                        )}

                        {/* Notification Bell Dropdown */}
                        {user && user.role !== 'student' && (
                            <div className="relative">
                                <button 
                                    onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                                    className={`relative p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors ${notifDropdownOpen ? 'bg-slate-50 text-slate-600' : ''}`}
                                >
                                    <Bell size={20} />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>

                                <AnimatePresence>
                                    {notifDropdownOpen && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setNotifDropdownOpen(false)} />
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                transition={{ duration: 0.15 }}
                                                className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-3xl shadow-xl z-50 overflow-hidden flex flex-col max-h-[480px]"
                                            >
                                                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                                                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                                        <Bell size={14} className="text-[#004AAD]" />
                                                        System Notifications
                                                    </span>
                                                    {unreadCount > 0 && (
                                                        <button 
                                                            onClick={handleClearAll}
                                                            className="text-[10px] font-bold text-[#004AAD] hover:underline cursor-pointer"
                                                        >
                                                            Mark all as read
                                                        </button>
                                                    )}
                                                </div>

                                                <div className="overflow-y-auto divide-y divide-slate-100 flex-1 custom-scrollbar">
                                                    {notifications.length === 0 ? (
                                                        <div className="py-12 text-center text-slate-400">
                                                            <Bell size={28} className="mx-auto text-slate-200 mb-2" />
                                                            <p className="text-xs font-medium">No notifications yet</p>
                                                        </div>
                                                    ) : (
                                                        notifications.map((notif) => {
                                                            let typeBg = "bg-blue-50";
                                                            if (notif.type === 'exam_started') {
                                                                typeBg = "bg-emerald-50";
                                                            } else if (notif.type === 'log_submitted') {
                                                                typeBg = "bg-purple-50";
                                                            }

                                                            return (
                                                                <div 
                                                                    key={notif._id}
                                                                    onClick={() => {
                                                                        if (!notif.isRead) handleMarkAsRead(notif._id);
                                                                    }}
                                                                    className={`p-4 flex gap-3 transition-colors text-left hover:bg-slate-50 cursor-pointer ${!notif.isRead ? 'bg-blue-50/15' : ''}`}
                                                                >
                                                                    <div className={`w-8 h-8 rounded-lg ${typeBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                                                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: notif.type === 'exam_started' ? '#10b981' : notif.type === 'log_submitted' ? '#a855f7' : '#3b82f6' }} />
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-center justify-between gap-2 mb-1">
                                                                            <h4 className="text-xs font-bold text-slate-800 truncate">{notif.title}</h4>
                                                                            <span className="text-[9px] text-slate-400 font-medium">
                                                                                {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                            </span>
                                                                        </div>
                                                                        <p className="text-xs text-slate-500 leading-relaxed break-words">{notif.message}</p>
                                                                        
                                                                        {!notif.isRead && (
                                                                            <span className="inline-flex items-center gap-1 text-[9px] text-[#004AAD] font-bold mt-2">
                                                                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping" /> New Alert
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })
                                                    )}
                                                </div>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
        </SocketContext.Provider>
    );
};

export default MainLayout;
