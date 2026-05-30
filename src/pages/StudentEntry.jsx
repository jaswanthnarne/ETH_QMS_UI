import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ArrowRight, 
    Loader2, 
    Zap, 
    Shield, 
    Lock, 
    FileText, 
    Cpu, 
    CheckCircle2, 
    User, 
    Smartphone, 
    Mail, 
    BookOpen 
} from 'lucide-react';
import axios from 'axios';
import { AlertModal } from '../components/Modals';
import PublicLayout from '../layouts/PublicLayout';
import DemoOne from '@/components/ui/demo';
import { AuroraHero } from '@/components/ui/hero-2';
import { motion } from 'framer-motion';
import { LetterSwapForward, LetterSwapPingPong } from '@/components/ui/letter-swap';

const StudentEntry = () => {
    const [step, setStep] = useState(1);
    const [examKey, setExamKey] = useState('');
    const [examData, setExamData] = useState(null);
    const [settings, setSettings] = useState(null);
    
    // Form fields
    const [studentName, setStudentName] = useState('');
    const [rollNumber, setRollNumber] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [department, setDepartment] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [alertState, setAlertState] = useState({ open: false });
    const navigate = useNavigate();

    const fetchSettings = async (e) => {
        e.preventDefault();
        if (!examKey.trim()) {
            setAlertState({ open: true, title: 'Key Required', message: 'Please enter a valid exam key.', type: 'info' });
            return;
        }
        
        setLoading(true);
        try {
            const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const res = await axios.get(`${baseURL}/exam/settings/${examKey.trim()}`);
            if (res.data.success) {
                setSettings(res.data.data.settings);
                setExamData({ title: res.data.data.title, isActive: res.data.data.isActive });
                setStep(2);
            }
        } catch (error) {
            setAlertState({ open: true, title: 'Access Denied', message: error.response?.data?.error || 'Invalid access key. Please try again.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleProceed = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!studentName.trim() || !rollNumber.trim()) {
            setAlertState({ open: true, title: 'Incomplete Details', message: 'Name and Roll Number are required.', type: 'info' });
            return;
        }
        if (settings?.collectMobile && !mobile.trim()) {
             setAlertState({ open: true, title: 'Mobile Required', message: 'Please provide your mobile number.', type: 'info' });
             return;
        }
        if (settings?.collectEmail && !email.trim()) {
             setAlertState({ open: true, title: 'Email Required', message: 'Please provide your email address.', type: 'info' });
             return;
        }
        if (settings?.collectDepartment && !department.trim()) {
             setAlertState({ open: true, title: 'Department Required', message: 'Please provide your department.', type: 'info' });
             return;
        }

        setLoading(true);
        try {
            const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const res = await axios.post(`${baseURL}/exam/validate-key`, {
                key: examKey.trim(), rollNumber: rollNumber.trim()
            });
            
            if (res.data.success) {
                localStorage.setItem('std_name', studentName.trim());
                localStorage.setItem('std_roll', rollNumber.trim());
                if (mobile.trim()) localStorage.setItem('std_mobile', mobile.trim());
                if (email.trim()) localStorage.setItem('std_email', email.trim());
                if (department.trim()) localStorage.setItem('std_dept', department.trim());
                
                navigate(`/exam/${examKey.trim()}`, {
                    state: { 
                        studentName: studentName.trim(), 
                        rollNumber: rollNumber.trim(), 
                        mobile: mobile.trim(),
                        email: email.trim(),
                        department: department.trim()
                    }
                });
            }
        } catch (error) {
            setAlertState({ open: true, title: 'Access Check Failed', message: error.response?.data?.error || 'Failed to authorize this device.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <PublicLayout>
            <AuroraHero className="text-slate-800 flex items-center justify-center p-6 py-32 relative overflow-hidden">
                {/* Decorative Subtle Background Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e11c_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e11c_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

                <div className="max-w-7xl mx-auto w-full relative z-10">
                    <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-start">
                        <div className="space-y-8">
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="inline-flex items-center gap-3 rounded-full border border-white/60 bg-white/40 backdrop-blur-md px-4 py-2 shadow-sm"
                            >
                                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#004AAD] animate-pulse" />
                                <LetterSwapForward
                                    label="ETHNOTECH ACADEMY"
                                    reverse={true}
                                    className="text-xs font-semibold uppercase tracking-[0.24em] text-[#004AAD] font-sans"
                                />
                            </motion.div>

                            <div className="space-y-6">
                                <motion.h1 
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.1 }}
                                    className="text-4xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight"
                                >
                                    Bridging Academia with Industry for career-ready professionals.
                                </motion.h1>
                                <motion.p 
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                    className="max-w-2xl text-base sm:text-lg text-slate-600 leading-8"
                                >
                                    Ethnotech Academy provides industry-partnered training, career assessment, and recruitment support that helps students secure employment and stay competitive globally.
                                </motion.p>
                            </div>

                            <motion.div 
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="grid gap-4 sm:grid-cols-2"
                            >
                                {[
                                    { label: 'Job-focused training', value: '220+ Programs', icon: BookOpen },
                                    { label: 'Institution partners', value: '80+ Partners', icon: Shield },
                                    { label: 'Student reach', value: '272k+ Students', icon: User },
                                    { label: 'Trusted reviews', value: '5240+ Google reviews', icon: CheckCircle2 },
                                ].map((stat, index) => (
                                    <div 
                                        key={index} 
                                        className="rounded-3xl border border-white/50 bg-white/40 backdrop-blur-md p-5 shadow-sm hover:scale-[1.03] hover:shadow-[0_12px_40px_0_rgba(0,74,173,0.06)] hover:border-[#004AAD]/20 hover:bg-white/80 transition-all duration-300 group"
                                    >
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-semibold text-slate-800 group-hover:text-[#004AAD] transition-colors">{stat.label}</p>
                                            <stat.icon className="h-4 w-4 text-[#004AAD]/60 group-hover:text-[#004AAD] group-hover:rotate-12 transition-all duration-300" />
                                        </div>
                                        <div className="mt-3 flex justify-start">
                                            <LetterSwapPingPong
                                                label={stat.value}
                                                reverse={false}
                                                staggerFrom="center"
                                                className="text-3xl font-bold text-[#004AAD] justify-start cursor-pointer select-none inline-flex font-sans"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="grid gap-4 sm:grid-cols-3"
                            >
                                {[
                                    { title: 'Job-focused training', description: 'Aligned to industry demand.', icon: Cpu },
                                    { title: 'Recruitment support', description: 'Placement-ready student services.', icon: Zap },
                                    { title: 'Corporate programs', description: 'Career assessments and upskilling.', icon: FileText },
                                ].map((item, index) => (
                                    <div 
                                        key={index} 
                                        className="rounded-3xl border border-white/50 bg-white/40 backdrop-blur-md p-5 shadow-sm hover:scale-[1.03] hover:shadow-[0_12px_40px_0_rgba(0,74,173,0.06)] hover:border-[#004AAD]/20 hover:bg-white/80 transition-all duration-300 group flex flex-col h-full"
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <item.icon className="h-4 w-4 text-[#004AAD]/70 group-hover:scale-110 transition-transform" />
                                            <LetterSwapForward
                                                label={item.title}
                                                reverse={false}
                                                className="text-sm font-semibold text-slate-900 justify-start inline-flex cursor-pointer select-none font-sans"
                                            />
                                        </div>
                                        <p className="text-xs text-slate-500 leading-relaxed mt-1">{item.description}</p>
                                    </div>
                                ))}
                            </motion.div>
                        </div>

                        <div className="space-y-6 lg:pl-4">
                            <div className="bg-white/80 border border-white/60 shadow-[0_24px_64px_0_rgba(0,74,173,0.06)] rounded-[2.5rem] overflow-hidden backdrop-blur-xl">
                                <div className="bg-gradient-to-r from-[#004AAD] to-[#003580] px-10 py-9">
                                    <h2 className="text-3xl font-extrabold text-white tracking-tight">Student Portal</h2>
                                    <p className="mt-2.5 text-sm text-blue-100/90 leading-relaxed">Enter your exam access key to continue.</p>
                                </div>
                                <div className="p-10 space-y-8">
                                    {step === 1 && (
                                        <form onSubmit={fetchSettings} className="space-y-6">
                                            <div className="space-y-2.5">
                                                <label className="text-sm font-semibold text-slate-700 block">Exam access key</label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="Enter access key"
                                                    className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200/80 rounded-2xl text-base text-slate-900 placeholder:text-slate-400 focus:border-[#004AAD] focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition duration-200 shadow-sm"
                                                    value={examKey}
                                                    onChange={(e) => setExamKey(e.target.value.toUpperCase())}
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={loading || !examKey.trim()}
                                                className="w-full py-4 bg-[#004AAD] text-white rounded-2xl text-base font-bold hover:bg-[#003580] active:scale-[0.98] transition duration-200 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {loading ? 'Verifying key...' : 'Verify access key'}
                                            </button>
                                        </form>
                                    )}

                                    {step === 2 && (
                                        <form onSubmit={handleProceed} className="space-y-6">
                                            {examData?.title && (
                                                <div className="rounded-2xl bg-blue-50 border border-blue-100 p-5 shadow-sm">
                                                    <p className="text-xs text-[#004AAD] uppercase tracking-[0.18em] font-bold">Exam</p>
                                                    <p className="mt-2 text-base font-semibold text-slate-800 leading-snug">{examData.title}</p>
                                                    {!examData.isActive && (
                                                        <p className="mt-2 text-sm font-medium text-amber-600">Session is not currently active.</p>
                                                    )}
                                                </div>
                                            )}

                                            <div className="space-y-2.5">
                                                <label className="text-sm font-semibold text-slate-700 block">Full legal name</label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="Enter your full name"
                                                    className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200/80 rounded-2xl text-base text-slate-900 placeholder:text-slate-400 focus:border-[#004AAD] focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition duration-200 shadow-sm"
                                                    value={studentName}
                                                    onChange={(e) => setStudentName(e.target.value)}
                                                />
                                            </div>

                                            <div className="space-y-2.5">
                                                <label className="text-sm font-semibold text-slate-700 block">Roll number / ID</label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="e.g. 21CS101"
                                                    className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200/80 rounded-2xl text-base text-slate-900 placeholder:text-slate-400 focus:border-[#004AAD] focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition duration-200 shadow-sm"
                                                    value={rollNumber}
                                                    onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
                                                />
                                            </div>

                                            {settings?.collectMobile && (
                                                <div className="space-y-2.5">
                                                    <label className="text-sm font-semibold text-slate-700 block">Mobile number</label>
                                                    <input
                                                        type="tel"
                                                        required
                                                        placeholder="10-digit number"
                                                        className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200/80 rounded-2xl text-base text-slate-900 placeholder:text-slate-400 focus:border-[#004AAD] focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition duration-200 shadow-sm"
                                                        value={mobile}
                                                        onChange={(e) => setMobile(e.target.value)}
                                                    />
                                                </div>
                                            )}

                                            {settings?.collectEmail && (
                                                <div className="space-y-2.5">
                                                    <label className="text-sm font-semibold text-slate-700 block">Email address</label>
                                                    <input
                                                        type="email"
                                                        required
                                                        placeholder="student@institution.edu"
                                                        className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200/80 rounded-2xl text-base text-slate-900 placeholder:text-slate-400 focus:border-[#004AAD] focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition duration-200 shadow-sm"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                    />
                                                </div>
                                            )}

                                            {settings?.collectDepartment && (
                                                <div className="space-y-2.5">
                                                    <label className="text-sm font-semibold text-slate-700 block">Department / Stream</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        placeholder="e.g. Computer Science"
                                                        className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200/80 rounded-2xl text-base text-slate-900 placeholder:text-slate-400 focus:border-[#004AAD] focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition duration-200 shadow-sm"
                                                        value={department}
                                                        onChange={(e) => setDepartment(e.target.value)}
                                                    />
                                                </div>
                                            )}

                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full py-4 bg-[#004AAD] text-white rounded-2xl text-base font-bold hover:bg-[#003580] active:scale-[0.98] transition duration-200 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {loading ? 'Authorizing...' : 'Enter assessment environment'}
                                            </button>
                                        </form>
                                    )}

                                    {/* Portal Highlights & Features */}
                                    <div className="border-t border-slate-200/50 pt-8 mt-6">
                                        <h3 className="text-xs font-bold text-[#004AAD] uppercase tracking-[0.2em] mb-5">
                                            Portal Highlights & Rules
                                        </h3>
                                        <div className="grid gap-5">
                                            {[
                                                { title: 'Real-time Auto-Save', desc: 'Progress is backed up automatically every second to prevent data loss.', icon: CheckCircle2 },
                                                { title: 'Secure Proctoring', desc: 'Active environment monitoring ensures complete assessment fairness.', icon: Shield },
                                                { title: 'Network Fail-Safe', desc: 'Continue the assessment seamlessly even during network drops.', icon: Zap },
                                                { title: 'Instant Evaluation', desc: 'Receive immediate analytical feedback upon exam completion.', icon: Cpu }
                                            ].map((feature, i) => (
                                                <div key={i} className="flex items-start gap-4 group">
                                                    <div className="p-2.5 rounded-xl bg-blue-50/70 text-[#004AAD] group-hover:bg-[#004AAD] group-hover:text-white group-hover:scale-110 transition duration-200 shadow-sm">
                                                        <feature.icon size={16} />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-bold text-slate-800 leading-none mb-1.5 group-hover:text-[#004AAD] transition-colors">{feature.title}</h4>
                                                        <p className="text-xs text-slate-500 leading-normal">{feature.desc}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3D Testimonials Marquee Section */}
                    <div className="mt-24 border-t border-slate-200/60 pt-16 flex flex-col items-center">
                        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
                            <span className="text-[#004AAD] font-bold text-xs uppercase tracking-widest bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100 shadow-sm">
                                Student Testimonials
                            </span>
                            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                                Reaching Careers Across Top Institutions
                            </h2>
                            <p className="text-slate-500 text-sm leading-relaxed max-w-xl mx-auto">
                                Discover how students from Maharaja Institute of Technology (MIT) Mysore, Parul University, Tontadarya College of Engineering (TCE) Gadag, FISAT, and other premium institutions have accelerated their industry readiness with Ethnotech Academy.
                            </p>
                        </div>
                        <div className="w-full flex justify-center">
                            <DemoOne />
                        </div>
                    </div>

                    <AlertModal
                        isOpen={alertState.open}
                        onClose={() => setAlertState({ ...alertState, open: false })}
                        title={alertState.title}
                        message={alertState.message}
                        type={alertState.type}
                    />
                </div>
            </AuroraHero>
        </PublicLayout>
    );
};

export default StudentEntry;
