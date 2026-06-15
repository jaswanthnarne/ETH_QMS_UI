import { useState, useRef } from 'react';
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
    KeyRound,
    Trophy,
    Award
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
    const loginFormRef = useRef(null);

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

    const scrollToForm = () => {
        loginFormRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Course logos helper icons
    const CourseGrid = () => {
        const courses = [
            {
                name: 'C Programming',
                bg: 'bg-blue-50 border-blue-200 text-blue-600',
                svg: (
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15.5c-2.48 0-4.5-2.02-4.5-4.5s2.02-4.5 4.5-4.5c1.47 0 2.78.72 3.59 1.83l-1.66 1.09c-.43-.64-1.15-1.07-1.93-1.07-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5c.78 0 1.5-.43 1.93-1.07l1.66 1.09c-.81 1.11-2.12 1.83-3.59 1.83z" />
                    </svg>
                )
            },
            {
                name: 'Java',
                bg: 'bg-red-50 border-red-200 text-red-600',
                svg: (
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M2 19.5c0 .83.67 1.5 1.5 1.5h17c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5H3.5c-.83 0-1.5.67-1.5 1.5zm16.5-6.5c1.38 0 2.5-1.12 2.5-2.5S19.88 8 18.5 8 16 9.12 16 10.5s1.12 2.5 2.5 2.5zm-5-3.5c.83 0 1.5-.67 1.5-1.5S14.33 5 13.5 5 12 5.67 12 6.5s.67 1.5 1.5 1.5zM6 13h5V8H6v5z" />
                    </svg>
                )
            },
            {
                name: 'Python',
                bg: 'bg-sky-50 border-sky-200 text-sky-600',
                svg: (
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14H9v-2h4v2zm2-4H9V8h6v4z" />
                    </svg>
                )
            },
            {
                name: 'SQL Database',
                bg: 'bg-teal-50 border-teal-200 text-teal-600',
                svg: (
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C7.58 2 4 3.79 4 6v12c0 2.21 3.58 4 8 4s8-1.79 8-4V6c0-2.21-3.58-4-8-4zm0 2c3.87 0 6 1.43 6 2s-2.13 2-6 2-6-1.43-6-2 2.13-2 6-2zm0 14c-3.87 0-6-1.43-6-2v-1.5c1.47 1 3.73 1.5 6 1.5s4.53-.5 6-1.5V16c0 .57-2.13 2-6 2zm0-4.5c-3.87 0-6-1.43-6-2v-1.5c1.47 1 3.73 1.5 6 1.5s4.53-.5 6-1.5V11.5c0 .57-2.13 2-6 2z" />
                    </svg>
                )
            },
            {
                name: 'AWS Cloud',
                bg: 'bg-amber-50 border-amber-200 text-amber-600',
                svg: (
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3z" />
                    </svg>
                )
            },
            {
                name: 'Angular',
                bg: 'bg-rose-50 border-rose-200 text-rose-600',
                svg: (
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L2 5.92v6.09c0 5.4 3.74 10.22 10 11.99 6.26-1.77 10-6.59 10-11.99V5.92L12 2zm0 3.8l5.88 10.15h-2.1l-1.22-2.3H9.44l-1.22 2.3H6.12L12 5.8zm2.46 6.35L12 7.85l-2.46 4.3h4.92z" />
                    </svg>
                )
            },
            {
                name: '.NET Core',
                bg: 'bg-purple-50 border-purple-200 text-purple-600',
                svg: (
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2V8h2v8z" />
                    </svg>
                )
            },
            {
                name: 'Docker',
                bg: 'bg-cyan-50 border-cyan-200 text-cyan-600',
                svg: (
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
                    </svg>
                )
            },
            {
                name: 'GitHub Workspace',
                bg: 'bg-slate-50 border-slate-200 text-slate-800',
                svg: (
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                )
            },
            {
                name: 'Node.js',
                bg: 'bg-emerald-50 border-emerald-200 text-emerald-600',
                svg: (
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                )
            }
        ];

        return (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {courses.map((c, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ scale: 1.05, y: -2 }}
                        className={`flex flex-col items-center justify-center p-4 border rounded-2xl transition duration-200 cursor-pointer shadow-sm ${c.bg}`}
                        onClick={scrollToForm}
                    >
                        {c.svg}
                        <span className="mt-3 text-xs font-bold text-slate-800 text-center">{c.name}</span>
                    </motion.div>
                ))}
            </div>
        );
    };

    return (
        <PublicLayout>
            <AuroraHero className="text-slate-800 flex items-center justify-center p-6 py-24 relative overflow-hidden">
                {/* Decorative Subtle Background Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e11c_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e11c_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

                <div className="max-w-7xl mx-auto w-full relative z-10 space-y-20">
                    {/* Hero Landing Header */}
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
                                    label="ETHNOTECH ACADEMY & ETHOPS"
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
                                    Start your preparation with Ethops
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                    className="max-w-2xl text-base sm:text-lg text-slate-600 leading-8"
                                >
                                    Interactive Courses, Top notch Assessments, High yield QBank and best resources you can have at one click away.
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

                            {/* Left Illustrative Interactive mockup (simulating Screenshot 1 right side) */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="hidden lg:block bg-gradient-to-tr from-slate-100 to-white/70 border border-white p-6 rounded-[2rem] shadow-md relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-[#004AAD]/5 rounded-full blur-2xl" />
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 text-[#004AAD] flex items-center justify-center flex-shrink-0">
                                        <Trophy size={20} />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-bold text-slate-800">Placement Assessment Workspace</h4>
                                        <p className="text-xs text-slate-500 max-w-md">Verify code outputs, build structured skills, and generate auto-evaluated compliance scorecards.</p>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center gap-2">
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">Live Telemetry</span>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">AI Scoring</span>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 border border-purple-100">LSRW Enabled</span>
                                </div>
                            </motion.div>
                        </div>

                        {/* Student Portal Login / Setup Form */}
                        <div ref={loginFormRef} className="space-y-6 lg:pl-4 scroll-mt-24">
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
                                                <label className="text-sm font-semibold text-slate-700 block">Registered Mobile Number / USN</label>
                                                <div className="relative group">
                                                    <Smartphone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#004AAD] transition-colors" />
                                                    <input
                                                        type="text"
                                                        required
                                                        placeholder="e.g. 9848218418 or 21CS101"
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
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Assessment Packs (Screenshot 2 Inspiration) */}
                    <div className="pt-16 border-t border-slate-200/40">
                        <div className="grid gap-12 lg:grid-cols-2 items-center">
                            {/* Left Side: Custom designed CSS mockup of an assessment pack view */}
                            <motion.div
                                whileHover={{ y: -4 }}
                                className="bg-white border border-slate-200 shadow-xl rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-[#004A99]" />
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">✓</span>
                                        <div>
                                            <h4 className="text-sm font-extrabold text-slate-800 leading-none">Aptitude & Coding Practice</h4>
                                            <span className="text-[10px] text-slate-400 mt-1 block">Total 120 questions mapped</span>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">Active Pack</span>
                                </div>

                                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-3">
                                    <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                                        <span>Current progress</span>
                                        <span className="text-[#004AAD]">75% Completed</span>
                                    </div>
                                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                                        <div className="w-3/4 h-full bg-[#004AAD] rounded-full" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { title: 'Core Questions', val: '80 MCQs', color: 'text-blue-600 bg-blue-50/60' },
                                        { title: 'Coding Tasks', val: '10 Problems', color: 'text-purple-600 bg-purple-50/60' },
                                        { title: 'Syllabus Alignment', val: '100% Industry', color: 'text-amber-600 bg-amber-50/60' },
                                        { title: 'Solutions Analysis', val: 'Immediate', color: 'text-teal-600 bg-teal-50/60' }
                                    ].map((box, i) => (
                                        <div key={i} className="p-4 border border-slate-100 rounded-2xl bg-white shadow-sm flex flex-col justify-between">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{box.title}</span>
                                            <span className={`mt-2 text-xs font-extrabold px-2 py-1 rounded-md w-fit ${box.color}`}>{box.val}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Right Side: Copy & Pills */}
                            <div className="space-y-6">
                                <span className="text-[#004AAD] font-bold text-xs uppercase tracking-widest bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100 shadow-sm w-fit inline-block">
                                    High-Performance Testing
                                </span>
                                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl leading-tight">
                                    Get a choice of your Assessment Packs
                                </h2>
                                <p className="text-slate-600 leading-relaxed text-sm">
                                    Ethnotech Academy prepares students for corporate filters through curated testing environments. Enhance your conceptual grip with specialized evaluation sheets.
                                </p>

                                <div className="flex flex-wrap gap-2.5 pt-2">
                                    {[
                                        'Designed by subject experts',
                                        'Latest syllabus and pattern',
                                        'Subject wise assessments',
                                        'Detailed solution with Analysis',
                                        'Topic wise model Questions',
                                        'Live tests with real time experience'
                                    ].map((pill, i) => (
                                        <span
                                            key={i}
                                            className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200/80 hover:border-slate-300 text-xs font-bold text-slate-700 rounded-full cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                                            onClick={scrollToForm}
                                        >
                                            {pill}
                                        </span>
                                    ))}
                                </div>

                                <div className="pt-4">
                                    <button
                                        onClick={scrollToForm}
                                        className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-base font-bold shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-[0.98] transition duration-200 flex items-center gap-2 cursor-pointer"
                                    >
                                        Tests are waiting for you...
                                        <ArrowRight size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Upskill (Screenshot 3 Inspiration) */}
                    <div className="pt-16 border-t border-slate-200/40">
                        <div className="grid gap-12 lg:grid-cols-2 items-center">
                            {/* Left Side: Grid & Action */}
                            <div className="space-y-8 order-2 lg:order-1">
                                <div className="space-y-4">
                                    <span className="text-[#004AAD] font-bold text-xs uppercase tracking-widest bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100 shadow-sm w-fit inline-block">
                                        Upskilling Workspace
                                    </span>
                                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl leading-tight">
                                        Now it's easy to Upskill yourself
                                    </h2>
                                    <p className="text-slate-600 leading-relaxed text-sm">
                                        Establish foundation and advanced execution across core technologies. Practice coding structures mapped to interview queries.
                                    </p>
                                </div>

                                <CourseGrid />

                                <div className="pt-2">
                                    <button
                                        onClick={scrollToForm}
                                        className="px-8 py-4 bg-[#004AAD] hover:bg-[#003580] text-white rounded-2xl text-base font-bold shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.98] transition duration-200 flex items-center gap-2 cursor-pointer"
                                    >
                                        Explore our Academy Courses
                                        <ArrowRight size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Right Side: Video player mockup representation */}
                            <motion.div
                                whileHover={{ y: -4 }}
                                className="bg-slate-900 border border-slate-800 shadow-2xl rounded-[2.5rem] overflow-hidden order-1 lg:order-2"
                            >
                                <div className="bg-slate-800 px-6 py-4 flex items-center gap-2 border-b border-slate-800">
                                    <span className="w-3 h-3 rounded-full bg-rose-500" />
                                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                                    <span className="text-xs text-slate-400 font-mono ml-4 truncate">learning-sandbox://data-structures/index.html</span>
                                </div>
                                <div className="p-8 space-y-6">
                                    <div className="aspect-video bg-slate-950 rounded-2xl border border-slate-800 flex flex-col items-center justify-center relative group overflow-hidden cursor-pointer" onClick={scrollToForm}>
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent z-10" />
                                        <div className="w-14 h-14 rounded-full bg-[#004AAD]/85 hover:bg-[#004A99] text-white flex items-center justify-center z-20 shadow-lg group-hover:scale-115 transition duration-300">
                                            <span className="ml-1 text-lg">▶</span>
                                        </div>
                                        <span className="absolute bottom-4 left-4 text-xs font-mono text-slate-300 z-20">Currently Learning: Animation & UI Mechanics</span>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                                            <span>Module 1: C fundamentals</span>
                                            <span className="text-emerald-500">Completed</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                                            <span>Module 2: Structured Databases</span>
                                            <span className="text-emerald-500">Completed</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                                            <span>Module 3: Advanced APIs & Cloud</span>
                                            <span className="text-[#004AAD] animate-pulse">In Progress</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Section 4: Numbers Speaks (Screenshot 4 Inspiration) */}
                    <div className="pt-16 border-t border-slate-200/40 text-center space-y-12">
                        <div className="space-y-4 max-w-2xl mx-auto">
                            <span className="text-[#004AAD] font-bold text-xs uppercase tracking-widest bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100 shadow-sm w-fit mx-auto block">
                                Platform Metrics
                            </span>
                            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                                Our Numbers speak for us
                            </h2>
                            <p className="text-slate-500 text-sm leading-relaxed max-w-lg mx-auto">
                                Proven metrics driving career placement records and institutional validation.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                            {[
                                { val: '40,000+', label: 'Courses Enrolled', color: 'text-blue-600 bg-blue-50' },
                                { val: '15,000+', label: 'Got Placed', color: 'text-emerald-600 bg-emerald-50' },
                                { val: '21,81,963+', label: 'Registered Users', color: 'text-purple-600 bg-purple-50' },
                                { val: '60,46,234+', label: 'Assessments Attempted', color: 'text-amber-600 bg-amber-50' },
                                { val: '9,56,27,521+', label: 'Questions Attempted', color: 'text-rose-600 bg-rose-50' }
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ scale: 1.05 }}
                                    className="p-6 border border-slate-200/80 bg-white rounded-3xl shadow-sm space-y-3 flex flex-col items-center justify-center"
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${stat.color}`}>✓</div>
                                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-none">{stat.val}</h3>
                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider text-center">{stat.label}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Section 5: Testimonials */}
                    <div className="pt-16 border-t border-slate-200/40 flex flex-col items-center">
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
                </div>

                <AlertModal
                    isOpen={alertState.open}
                    onClose={() => setAlertState({ ...alertState, open: false })}
                    title={alertState.title}
                    message={alertState.message}
                    type={alertState.type}
                />
            </AuroraHero>
        </PublicLayout>
    );
};

export default StudentEntry;

