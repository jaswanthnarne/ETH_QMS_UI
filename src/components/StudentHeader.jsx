import { LogOut, User, LayoutDashboard, ShieldCheck } from 'lucide-react';
import useStudentAuthStore from '../store/studentAuthStore';
import { useNavigate } from 'react-router-dom';

const StudentHeader = () => {
    const { student, logoutStudent } = useStudentAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutStudent();
        navigate('/portal');
    };

    return (
        <header className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/student/dashboard')}>
                        <div className="w-10 h-10 bg-[#004AAD] rounded-xl flex items-center justify-center shadow-md">
                            <span className="text-white font-extrabold text-xl">E</span>
                        </div>
                        <div>
                            <span className="font-extrabold text-slate-900 text-lg tracking-tight">ETHNOTECH</span>
                            <span className="text-[#004AAD] font-extrabold text-xs block tracking-widest -mt-1 uppercase">Academy</span>
                        </div>
                    </div>

                    {/* Navigation Actions */}
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex flex-col text-right">
                            <span className="text-sm font-bold text-slate-800 leading-tight">
                                {student?.name || 'Student'}
                            </span>
                            <span className="text-[11px] font-bold text-slate-400 font-mono tracking-wider">
                                {student?.usn || 'N/A'}
                            </span>
                        </div>

                        <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#004AAD] font-bold shadow-inner relative group">
                            <User size={18} />
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white" />
                        </div>

                        <button
                            onClick={handleLogout}
                            className="p-2.5 rounded-xl border border-slate-200 hover:border-red-200 text-slate-500 hover:text-red-600 hover:bg-red-50 transition duration-200 cursor-pointer shadow-sm"
                            title="Sign Out"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default StudentHeader;
