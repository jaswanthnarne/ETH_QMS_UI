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
    BookOpen,
    Eye,
    EyeOff,
    KeyRound
} from 'lucide-react';
import { AlertModal } from '../components/Modals';
import PublicLayout from '../layouts/PublicLayout';
import DemoOne from '@/components/ui/demo';
import { AuroraHero } from '@/components/ui/hero-2';
import { motion } from 'framer-motion';
import { LetterSwapForward, LetterSwapPingPong } from '@/components/ui/letter-swap';
import useStudentAuthStore from '../store/studentAuthStore';
import useAuthStore from '../store/authStore';

const StudentEntry = () => {
    const [alertState, setAlertState] = useState({ open: false });
    const navigate = useNavigate();

    // Student Login & Setup states
    const [activeTab, setActiveTab] = useState('login'); // 'login', 'setup'
    const [loginVal, setLoginVal] = useState('');
    const [loginPw, setLoginPw] = useState('');
    const [showLoginPw, setShowLoginPw] = useState(false);
    const { loginStudent, setupPassword, loading: studentAuthLoading } = useStudentAuthStore();

    const [setupUsn, setSetupUsn] = useState('');
    const [setupIdentifier, setSetupIdentifier] = useState('');
    const [setupPasswordVal, setSetupPasswordVal] = useState('');
    const [setupConfirmPassword, setSetupConfirmPassword] = useState('');

    const handleStudentLogin = async (e) => {
        e.preventDefault();
        if (!loginVal.trim() || !loginPw.trim()) {
            setAlertState({ open: true, title: 'Details Required', message: 'Please enter your Mobile number/USN and Password.', type: 'info' });
            return;
        }

        const res = await loginStudent(loginVal.trim(), loginPw.trim());
        if (res.success) {
            useAuthStore.getState().logout();
            navigate('/student/dashboard');
        } else {
            setAlertState({ open: true, title: 'Authentication Failed', message: res.error || 'Login failed. Please check your details.', type: 'error' });
        }
    };

    const handleStudentSetupPassword = async (e) => {
        e.preventDefault();
        if (!setupUsn.trim() || !setupIdentifier.trim() || !setupPasswordVal.trim() || !setupConfirmPassword.trim()) {
            setAlertState({ open: true, title: 'Incomplete Fields', message: 'All fields are required.', type: 'info' });
            return;
        }

        if (setupPasswordVal !== setupConfirmPassword) {
            setAlertState({ open: true, title: 'Password Mismatch', message: 'Passwords do not match.', type: 'error' });
            return;
        }

        if (setupPasswordVal.length < 6) {
            setAlertState({ open: true, title: 'Password Too Short', message: 'Password must be at least 6 characters long.', type: 'error' });
            return;
        }

        const res = await setupPassword(setupUsn.trim().toUpperCase(), setupIdentifier.trim(), setupPasswordVal.trim());
        if (res.success) {
            setAlertState({ open: true, title: 'Setup Complete', message: 'Your password has been configured successfully. You can now log in.', type: 'success' });
            setActiveTab('login');
            setSetupUsn('');
            setSetupIdentifier('');
            setSetupPasswordVal('');
            setSetupConfirmPassword('');
        } else {
            setAlertState({ open: true, title: 'Setup Failed', message: res.error || 'Verification failed. USN and mobile/email mismatch.', type: 'error' });
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
                                    <p className="mt-2.5 text-sm text-blue-100/90 leading-relaxed">
                                        {activeTab === 'login' ? 'Sign in to access your placement dashboard.' : 'Set up your placement profile password.'}
                                    </p>
                                </div>

                                <div className="p-10 space-y-8">
                                    {activeTab === 'login' && (
                                        <form onSubmit={handleStudentLogin} className="space-y-6">
                                            <div className="space-y-2.5">
                                                <label className="text-sm font-semibold text-slate-700 block">Registered Mobile Number</label>
                                                <div className="relative group">
                                                    <Smartphone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#004AAD] transition-colors" />
                                                    <input
                                                        type="text"
                                                        required
                                                        placeholder="e.g. 9876543210"
                                                        className="w-full pl-12 pr-5 py-4 bg-slate-50/50 border border-slate-200/80 rounded-2xl text-base text-slate-900 placeholder:text-slate-400 focus:border-[#004AAD] focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition duration-200 shadow-sm"
                                                        value={loginVal}
                                                        onChange={(e) => setLoginVal(e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2.5">
                                                <label className="text-sm font-semibold text-slate-700 block">Password</label>
                                                <div className="relative group">
                                                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#004AAD] transition-colors" />
                                                    <input
                                                        type={showLoginPw ? 'text' : 'password'}
                                                        required
                                                        placeholder="••••••••"
                                                        className="w-full pl-12 pr-12 py-4 bg-slate-50/50 border border-slate-200/80 rounded-2xl text-base text-slate-900 placeholder:text-slate-400 focus:border-[#004AAD] focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition duration-200 shadow-sm"
                                                        value={loginPw}
                                                        onChange={(e) => setLoginPw(e.target.value)}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowLoginPw(!showLoginPw)}
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#004AAD] transition-colors p-1"
                                                    >
                                                        {showLoginPw ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </div>
                                                <p className="text-slate-400 text-xs mt-1.5 leading-relaxed font-semibold">
                                                    * Default password is <code className="bg-slate-100 text-blue-800 px-1 py-0.5 rounded font-mono">collegecode@3!</code>
                                                </p>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={studentAuthLoading || !loginVal.trim() || !loginPw.trim()}
                                                className="w-full py-4 bg-[#004AAD] text-white rounded-2xl text-base font-bold hover:bg-[#003580] active:scale-[0.98] transition duration-200 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                            >
                                                {studentAuthLoading ? <Loader2 size={16} className="animate-spin" /> : null}
                                                Sign In to Dashboard <ArrowRight size={16} />
                                            </button>

                                            <div className="text-center pt-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setActiveTab('setup')}
                                                    className="text-sm font-semibold text-[#004AAD] hover:underline cursor-pointer"
                                                >
                                                    First-time logging in? Set up password
                                                </button>
                                            </div>
                                        </form>
                                    )}

                                    {activeTab === 'setup' && (
                                        <form onSubmit={handleStudentSetupPassword} className="space-y-6">
                                            <div className="space-y-2.5">
                                                <label className="text-sm font-semibold text-slate-700 block">Student USN</label>
                                                <div className="relative group">
                                                    <KeyRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#004AAD] transition-colors" />
                                                    <input
                                                        type="text"
                                                        required
                                                        placeholder="e.g. 1CIT22CS001"
                                                        className="w-full pl-12 pr-5 py-4 bg-slate-50/50 border border-slate-200/80 rounded-2xl text-base text-slate-900 placeholder:text-slate-400 focus:border-[#004AAD] focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition duration-200 shadow-sm uppercase font-bold"
                                                        value={setupUsn}
                                                        onChange={(e) => setSetupUsn(e.target.value.toUpperCase())}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2.5">
                                                <label className="text-sm font-semibold text-slate-700 block">Registered Mobile or Email</label>
                                                <div className="relative group">
                                                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#004AAD] transition-colors" />
                                                    <input
                                                        type="text"
                                                        required
                                                        placeholder="Registered email or phone number"
                                                        className="w-full pl-12 pr-5 py-4 bg-slate-50/50 border border-slate-200/80 rounded-2xl text-base text-slate-900 placeholder:text-slate-400 focus:border-[#004AAD] focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition duration-200 shadow-sm"
                                                        value={setupIdentifier}
                                                        onChange={(e) => setSetupIdentifier(e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2.5">
                                                <label className="text-sm font-semibold text-slate-700 block">Create Password</label>
                                                <input
                                                    type="password"
                                                    required
                                                    placeholder="At least 6 characters"
                                                    className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200/80 rounded-2xl text-base text-slate-900 placeholder:text-slate-400 focus:border-[#004AAD] focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition duration-200 shadow-sm"
                                                    value={setupPasswordVal}
                                                    onChange={(e) => setSetupPasswordVal(e.target.value)}
                                                />
                                            </div>

                                            <div className="space-y-2.5">
                                                <label className="text-sm font-semibold text-slate-700 block">Confirm Password</label>
                                                <input
                                                    type="password"
                                                    required
                                                    placeholder="Re-enter password"
                                                    className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200/80 rounded-2xl text-base text-slate-900 placeholder:text-slate-400 focus:border-[#004AAD] focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition duration-200 shadow-sm"
                                                    value={setupConfirmPassword}
                                                    onChange={(e) => setSetupConfirmPassword(e.target.value)}
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={studentAuthLoading || !setupUsn.trim() || !setupIdentifier.trim() || !setupPasswordVal.trim()}
                                                className="w-full py-4 bg-[#004AAD] text-white rounded-2xl text-base font-bold hover:bg-[#003580] active:scale-[0.98] transition duration-200 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                            >
                                                {studentAuthLoading ? <Loader2 size={16} className="animate-spin" /> : null}
                                                Configure Profile Password <ArrowRight size={16} />
                                            </button>

                                            <div className="text-center pt-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setActiveTab('login')}
                                                    className="text-sm font-semibold text-[#004AAD] hover:underline cursor-pointer"
                                                >
                                                    Back to Student Login
                                                </button>
                                            </div>
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
