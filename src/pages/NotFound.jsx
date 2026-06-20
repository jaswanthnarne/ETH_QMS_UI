import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Compass } from 'lucide-react';
import useAuthStore from '../store/authStore';
import useStudentAuthStore from '../store/studentAuthStore';

const NotFound = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();
    const { student, studentToken } = useStudentAuthStore();

    const handleGoHome = () => {
        if (student || studentToken) {
            navigate('/student/dashboard');
        } else if (isAuthenticated) {
            navigate('/dashboard');
        } else {
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f9fb] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden font-sans select-none">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/2 w-[500px] h-[500px] bg-blue-400/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl translate-y-1/2 pointer-events-none" />
            
            {/* Subtle Grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,white,transparent_75%)] opacity-60 pointer-events-none" />

            <div className="max-w-xl w-full relative z-10 animate-in fade-in-50 zoom-in-95 duration-500 space-y-8">
                {/* Branding Logo */}
                <div className="flex items-center justify-center gap-2 mb-2">
                    <img src="/assets/cropped-New-logo-footer-270x270.png" alt="Ethnotech Logo" className="h-10 w-10" />
                    <div className="text-left leading-none mt-0.5">
                        <span className="text-lg font-extrabold text-slate-800 tracking-tight block">Ethnotech</span>
                        <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#004AAD] mt-0.5 block">Academy</span>
                    </div>
                </div>

                {/* Card Container */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200/85 shadow-[0_12px_40px_rgba(0,0,0,0.02)] p-8 md:p-12 flex flex-col items-center">
                    {/* Visual 404 Display */}
                    <div className="relative mb-6">
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-[#004AAD]/10 rounded-full blur-xl scale-125 animate-pulse" />
                        <div className="w-20 h-20 bg-blue-50/50 rounded-2xl flex items-center justify-center border border-blue-100/50 shadow-sm relative">
                            <Compass size={36} className="text-[#004AAD] animate-[spin_10s_linear_infinite]" />
                        </div>
                    </div>

                    {/* Headline */}
                    <h1 className="text-7xl font-black tracking-tight text-slate-900 leading-none">404</h1>
                    <h2 className="text-xl font-extrabold text-slate-850 mt-4 tracking-tight">Lost in the Academy?</h2>
                    
                    {/* Description */}
                    <p className="text-slate-500 text-sm mt-3 leading-relaxed max-w-sm">
                        The requested page path does not exist, or you might not have permission to view it. Please check the URL or use the shortcuts below.
                    </p>

                    {/* Quick navigation links */}
                    <div className="w-full border-t border-slate-100 pt-6 mt-8 space-y-3">
                        <button
                            onClick={handleGoHome}
                            className="w-full bg-[#004AAD] hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold shadow-md shadow-blue-500/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <Home size={16} />
                            Return to Dashboard
                        </button>
                        
                        <button
                            onClick={() => navigate(-1)}
                            className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 py-3.5 rounded-xl font-bold active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                        >
                            <ArrowLeft size={16} />
                            Go Back
                        </button>
                    </div>
                </div>

                {/* Institutional Footer */}
                <div className="text-[10px] text-slate-400 uppercase tracking-widest leading-relaxed">
                    Ethnotech Academy Assessment Platform
                    <br />
                    <span className="text-[#004AAD] font-bold">Secure Environment Verified</span>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
