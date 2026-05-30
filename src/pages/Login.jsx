import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Mail, Lock, Loader2, Eye, EyeOff, Shield, ShieldCheck, KeyRound } from 'lucide-react';
import useAuthStore from '../store/authStore';
import PublicLayout from '../layouts/PublicLayout';

/* ─── Animation Component (matches public pages) ─── */
const FadeIn = ({ children, delay = 0, direction = "up", className = "" }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-40px' });
    const yOffset = direction === "up" ? 30 : direction === "down" ? -30 : 0;
    const xOffset = direction === "left" ? 30 : direction === "right" ? -30 : 0;

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: yOffset, x: xOffset }}
            animate={inView ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, y: yOffset, x: xOffset }}
            transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const { login, loading, error } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(email, password);
        if (result.success) navigate('/dashboard');
    };

    return (
        <PublicLayout>
            <div className="bg-white">

                {/* ══════════ HERO SECTION ══════════ */}
                <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden"
                    style={{ background: 'linear-gradient(155deg, #f0f5ff 0%, #ffffff 55%, #eef3ff 100%)' }}>

                    {/* Background Accents (matching About / Contact pages) */}
                    <div className="absolute -top-16 -right-16 w-[480px] h-[480px] rounded-full border-[1.5px] border-[#004AAD]/10 pointer-events-none" />
                    <div className="absolute top-4 right-4 w-[320px] h-[320px] rounded-full border-[1.5px] border-[#004AAD]/10 pointer-events-none" />
                    <div className="absolute top-20 right-20 w-[180px] h-[180px] rounded-full bg-[#004AAD]/[0.04] pointer-events-none" />
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                        className="absolute top-32 right-64 w-9 h-9 rounded-xl border-[1.5px] border-[#004AAD]/15 pointer-events-none hidden lg:block" />
                    <motion.div animate={{ rotate: -360 }} transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
                        className="absolute bottom-24 right-1/3 w-5 h-5 rounded bg-[#004AAD]/10 pointer-events-none hidden lg:block" />

                    {/* Bottom-left floating shapes */}
                    <div className="absolute -bottom-20 -left-20 w-[350px] h-[350px] rounded-full border border-[#004AAD]/[0.06] pointer-events-none" />
                    <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute bottom-40 left-16 w-6 h-6 rounded-full bg-[#004AAD]/[0.06] pointer-events-none hidden lg:block" />

                    <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                        <div className="flex flex-col lg:flex-row gap-16 lg:gap-20 items-center">

                            {/* ── Left Content ── */}
                            <div className="flex-1 max-w-2xl lg:max-w-none">
                                <FadeIn>
                                    <span className="inline-block text-[11px] font-bold text-[#004AAD] uppercase tracking-[0.2em] mb-5 px-3 py-1.5 bg-[#004AAD]/[0.07] rounded-full">
                                        Management Portal
                                    </span>
                                </FadeIn>
                                <FadeIn delay={0.1}>
                                    <h1 className="text-[2.8rem] lg:text-[4rem] font-extrabold text-slate-900 leading-[1.06] tracking-[-0.02em] mb-7">
                                        Welcome to the<br className="hidden lg:block" /><span className="text-[#004AAD]"> Admin Dashboard</span>
                                    </h1>
                                </FadeIn>
                                <FadeIn delay={0.2}>
                                    <p className="text-[16.5px] text-slate-500 leading-[1.8] max-w-lg mb-8">
                                        Access your dashboard to manage colleges, courses, trainers, exams, and analytics — all from one unified portal.
                                    </p>
                                </FadeIn>

                                {/* Trust Badges */}
                                <FadeIn delay={0.3}>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg">
                                        {[
                                            { icon: ShieldCheck, label: 'Role-Based Access', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                                            { icon: KeyRound, label: 'JWT Secured', color: 'text-[#004AAD]', bg: 'bg-blue-50', border: 'border-blue-100' },
                                            { icon: Shield, label: 'Rate Limited', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
                                        ].map((badge, i) => (
                                            <div key={i} className={`flex items-center gap-3 ${badge.bg} ${badge.border} border rounded-xl px-4 py-3 group hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-default`}>
                                                <badge.icon size={18} className={`${badge.color} group-hover:scale-110 transition-transform`} strokeWidth={2.5} />
                                                <span className="text-[12px] font-bold text-slate-600">{badge.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </FadeIn>
                            </div>

                            {/* ── Right: Login Card ── */}
                            <div className="flex-1 w-full max-w-md">
                                <FadeIn delay={0.15} direction="up">
                                    <motion.div
                                        initial={{ scale: 0.96, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                                        className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100/80 overflow-hidden"
                                    >
                                        {/* Card Header */}
                                        <div className="bg-[#004AAD] px-8 py-7 relative overflow-hidden">
                                            {/* Decorative circles inside header */}
                                            <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/5 rounded-full" />
                                            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-white/5 rounded-full" />

                                            <div className="relative z-10 flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center shadow-inner">
                                                    <Shield size={24} className="text-white" />
                                                </div>
                                                <div>
                                                    <h2 className="text-[20px] font-extrabold text-white tracking-tight">Sign In</h2>
                                                    <p className="text-blue-200/90 text-[13px] font-medium mt-0.5 uppercase tracking-wide">Secure Authentication</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Card Body */}
                                        <form onSubmit={handleSubmit} className="p-8 space-y-5">
                                            {error && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -8 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="p-4 bg-red-50 border border-red-100 rounded-xl text-[13px] text-red-600 font-semibold flex items-center gap-2"
                                                >
                                                    <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                                                    {error}
                                                </motion.div>
                                            )}

                                            {/* Email Field */}
                                            <div>
                                                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-2 px-1">
                                                    Email, Mobile Number or Employee ID
                                                </label>
                                                <div className="relative group">
                                                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#004AAD] transition-colors" />
                                                    <input
                                                        id="login-email"
                                                        type="text"
                                                        required
                                                        placeholder="e.g. admin@ethnotech.in, 9876543210 or EMP1001"
                                                        className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-medium text-slate-800 focus:bg-white focus:border-[#004AAD] focus:ring-[4px] focus:ring-blue-50 outline-none transition-all placeholder:text-slate-400 shadow-sm"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            {/* Password Field */}
                                            <div>
                                                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-2 px-1">
                                                    Password
                                                </label>
                                                <div className="relative group">
                                                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#004AAD] transition-colors" />
                                                    <input
                                                        id="login-password"
                                                        type={showPw ? 'text' : 'password'}
                                                        required
                                                        placeholder="••••••••"
                                                        className="w-full pl-12 pr-14 py-4 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-medium text-slate-800 focus:bg-white focus:border-[#004AAD] focus:ring-[4px] focus:ring-blue-50 outline-none transition-all placeholder:text-slate-400 shadow-sm"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPw(!showPw)}
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#004AAD] transition-colors p-1"
                                                    >
                                                        {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Submit Button */}
                                            <button
                                                id="login-submit"
                                                type="submit"
                                                disabled={loading}
                                                className="w-full py-4.5 bg-[#004AAD] hover:bg-[#003a8c] text-white text-[15px] font-extrabold rounded-2xl disabled:opacity-50 transition-all flex items-center justify-center gap-3 mt-2 shadow-[0_10px_25px_-5px_rgba(0,74,173,0.3)] hover:shadow-[0_14px_35px_-5px_rgba(0,74,173,0.4)] active:scale-[0.98] cursor-pointer"
                                            >
                                                {loading ? (
                                                    <><Loader2 size={18} className="animate-spin" /> Signing in...</>
                                                ) : (
                                                    <>Sign In <ArrowRight size={18} /></>
                                                )}
                                            </button>

                                            {/* Bottom Security Badges */}
                                            <div className="flex items-center justify-center gap-6 pt-3">
                                                <p className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                                    <ShieldCheck size={14} className="text-emerald-500" /> Encrypted
                                                </p>
                                                <span className="w-1 h-1 rounded-full bg-slate-300" />
                                                <p className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                                    <Lock size={14} className="text-blue-400" /> Secured
                                                </p>
                                            </div>
                                        </form>
                                    </motion.div>
                                </FadeIn>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </PublicLayout>
    );
};

export default Login;
