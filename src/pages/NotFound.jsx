import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ShieldAlert,
    Compass,
    BookOpen,
    ArrowRight,
    Award,
    Trophy,
    ArrowLeft,
    Calculator,
    HelpCircle,
    Flame,
    Sparkles,
    RefreshCw,
    Terminal,
    AlertTriangle,
    Coins,
    GraduationCap
} from 'lucide-react';
import useAuthStore from '../store/authStore';

const NotFound = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();

    // Interactive Widget States
    const [hoursCode, setHoursCode] = useState(2);
    const [cgpa, setCgpa] = useState(7.5);
    const [unpaidInternships, setUnpaidInternships] = useState("1");
    const [calcResult, setCalcResult] = useState(null);
    const [isCalculating, setIsCalculating] = useState(false);

    const [excuse, setExcuse] = useState("");
    const [excuseReply, setExcuseReply] = useState("");

    const [activeTab, setActiveTab] = useState("roast"); // "roast" | "calculator" | "excuses"
    const [tickerIndex, setTickerIndex] = useState(0);
    const [claimedInternship, setClaimedInternship] = useState(false);

    // Ethnotech Sarcastic Ticker Updates
    const tickerNews = [
        "🚨 BATCH ALERT: 42 students placed as 'Unpaid LinkedIn Brand Evangelists'. CTC: Free tea & 'Exposure'!",
        "🚨 SYLLABUS NEWS: We have replaced Java 8 with 'Resume Inflation 101' to align with modern corporate standards.",
        "🚨 FEE EXEMPTION: Fine of ₹5,000 imposed on student Ajay M. for asking if 'Guaranteed Placement' means actual jobs.",
        "🚨 SUCCESS STORY: Alumnus Priya S. bought a cycle after 2 months of training. 'Ethnotech taught me to stand on my own feet!'",
        "🚨 TECH INSIGHT: Our AI-driven algorithms determined that 404 pages are the only bug-free pages in your final year project."
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setTickerIndex((prev) => (prev + 1) % tickerNews.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Sarcastic remarks
    const remarks = [
        "Oops, this page is as vacant as a student's GitHub commit graph during a semester break.",
        "While you are looking at this broken link, our placement coordinator is composing another 'Urgent: Mandtory Mock Interview' email you'll probably ignore.",
        "404: Career path not found. (But don't worry, Ethnotech's Premium Rs. 49,999 Bootcamp can fix your lack of directional skills. Enroll now!)",
        "Congratulations! You found a dead link. Unfortunately, unlike your college, we don't hand out honorary certifications for exploring dead ends.",
        "Wait, did you expect content here? That's about as realistic as getting a full-time package from an internship that lists 'self-motivated unpaid hustle' as the primary benefit.",
        "Unlike this completely broken route, our graduates have a 100% smooth transition into corporate support roles. Well, at least they got a branded lanyard."
    ];

    const [randomRemark, setRandomRemark] = useState("");

    useEffect(() => {
        setRandomRemark(remarks[Math.floor(Math.random() * remarks.length)]);
    }, []);

    const handleCalculatePlacement = () => {
        setIsCalculating(true);
        setCalcResult(null);

        setTimeout(() => {
            setIsCalculating(false);

            const hours = Number(hoursCode);
            const grade = Number(cgpa);
            const internships = unpaidInternships;

            let probability = 0;
            let verdict = "";
            let recommendation = "";

            if (hours === 0) {
                probability = 0.01;
                verdict = "Absolute digital wanderer. You code as much as a toaster.";
                recommendation = "Register for our 'Hello World Intensive' bootcamp (discount price: ₹14,999) to increase chances by 200%.";
            } else if (hours < 3 && grade < 8) {
                probability = 12.5;
                verdict = "Average Syllabus Devotee. You know just enough to get stuck in a git conflict.";
                recommendation = "Buy our 'Premium Resume Inflator Pro Max' add-on for ₹4,999 to add 5 fake Web3 projects.";
            } else if (hours >= 8 && grade >= 9) {
                probability = 89.9;
                verdict = "Dangerous LeetCode Zealot. You are overqualified and will frighten recruiters with standard wages.";
                recommendation = "Purposely fail our next assessment so we can keep you in our unpaid trainer pipeline for another year.";
            } else {
                probability = 45.2;
                verdict = "Standard Indian Engineer. Capable of copy-pasting StackOverflow answers, but struggles with standard Flexbox.";
                recommendation = "Enroll in our 'Full-Stack Corporate Wizardry' masterclass (₹29,999). We guarantee to forward your resume to companies that don't exist.";
            }

            if (internships === "unlimited") {
                probability = Math.min(100, probability + 15);
                verdict += " [Elite PDF Certificate Collector Add-on Active!]";
                recommendation = "You have unlimited certificates. We suggest converting them to wallpaper to insulate your study room.";
            }

            setCalcResult({
                percentage: probability,
                verdict,
                recommendation
            });
        }, 1200);
    };

    const handleExcuseSubmit = (e) => {
        const val = e.target.value;
        setExcuse(val);

        if (!val) {
            setExcuseReply("");
            return;
        }

        const replies = {
            timer: "Ah, trying to bypass the exam timer. Dynamic security measures have flagged your cursor path. Your IP has been reported to the Head of Training. Prepare to write a 10-page manual assignment in Core Java 6.",
            admin: "Looking for the admin portal? Attempting to hack our premium platform with zero certifications is highly humorous. Go back and complete your daily CSS module before you attempt any database manipulation.",
            lost: "Lost in route? That is because you skipped the 'React Router & Absolute URL Paths' lecture in Week 3. Your trainer has been informed. Please pay a dynamic re-engagement fee of ₹250 to reactivate normal navigation.",
            keyboard: "Sticky keys? Nice excuse, but our keylogger detected you were actually playing Chrome Dino game during the SQL training. Your placement priority score has been docked by 45 points."
        };

        setExcuseReply(replies[val] || "");
    };

    const handleClaimInternship = () => {
        setClaimedInternship(true);
        setTimeout(() => {
            alert(
                "🎉 CONGRATULATIONS!\n\nYou have been selected for the Ethnotech '404 Route Specialist' Unpaid Internship!\n\nDuration: 6 Months (Unpaid)\nWorking hours: 14 hours/day\nCertificate Fee: ₹8,999 (Discounted!)\n\nPlease report to the placement lobby to sign your non-disclosure agreement and pay the fee."
            );
        }, 100);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-8 relative overflow-hidden font-['Inter'] selection:bg-indigo-500 selection:text-white">
            {/* Glowing Cyber Gradients */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl -translate-y-1/2" />
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#004AAD]/10 rounded-full blur-3xl translate-y-1/2" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            <div className="max-w-3xl w-full text-center space-y-8 relative z-10 animate-in fade-in-50 zoom-in-95 duration-500">

                {/* Custom Ethnotech Live Scrolling Sarcastic Ticker */}
                <div className="bg-indigo-950/40 backdrop-blur-sm border border-indigo-500/20 rounded-full px-4 py-2 text-xs font-semibold text-indigo-300 flex items-center gap-2 overflow-hidden max-w-lg mx-auto shadow-md">
                    <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold shrink-0 animate-pulse border border-red-500/30">
                        Live Feed
                    </span>
                    <div className="overflow-hidden relative w-full h-4">
                        <span className="absolute left-0 top-0 w-full text-left truncate animate-in slide-in-from-bottom duration-300">
                            {tickerNews[tickerIndex]}
                        </span>
                    </div>
                </div>

                {/* Sarcastic Header Emblem */}
                <div className="relative inline-block group">
                    <div className="absolute inset-0 bg-[#004AAD]/30 rounded-full blur-2xl scale-150 animate-pulse" />
                    <div className="w-24 h-24 bg-gradient-to-tr from-[#004AAD] to-indigo-600 text-white rounded-3xl flex items-center justify-center mx-auto shadow-2xl rotate-6 group-hover:rotate-0 hover:scale-105 transition-all duration-300 cursor-pointer">
                        <ShieldAlert size={48} className="animate-bounce" />
                    </div>
                    <span className="absolute -bottom-2 -right-4 bg-amber-400 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md border border-slate-950">
                        100% Sarcastic
                    </span>
                </div>

                {/* Big Bold Error Code */}
                <div className="space-y-2">
                    <h1 className="text-8xl sm:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-white select-none">
                        404
                    </h1>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-indigo-200 tracking-tight px-4">
                        Page Missing. Just Like Your Placement Readiness?
                    </h2>
                </div>

                {/* Dynamic Content Container */}
                <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl shadow-2xl text-left overflow-hidden">
                    {/* Navigation Tabs */}
                    <div className="flex border-b border-slate-800 bg-slate-950/40 text-xs sm:text-sm">
                        <button
                            onClick={() => setActiveTab("roast")}
                            className={`flex-1 py-4 text-center font-bold transition-all ${activeTab === 'roast' ? 'text-indigo-400 bg-slate-900/50 border-b-2 border-indigo-500' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/20'}`}
                        >
                            📋 Academy Roast
                        </button>
                        <button
                            onClick={() => setActiveTab("calculator")}
                            className={`flex-1 py-4 text-center font-bold transition-all ${activeTab === 'calculator' ? 'text-indigo-400 bg-slate-900/50 border-b-2 border-indigo-500' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/20'}`}
                        >
                            🧮 Placement Luck Calc
                        </button>
                        <button
                            onClick={() => setActiveTab("excuses")}
                            className={`flex-1 py-4 text-center font-bold transition-all ${activeTab === 'excuses' ? 'text-indigo-400 bg-slate-900/50 border-b-2 border-indigo-500' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/20'}`}
                        >
                            💬 Submit Excuse
                        </button>
                    </div>

                    {/* Tab 1: Roast Card */}
                    {activeTab === 'roast' && (
                        <div className="p-6 sm:p-8 space-y-6 animate-in fade-in-40 duration-300">
                            <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
                                <Compass className="text-indigo-400 shrink-0" size={20} />
                                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Ethnotech Placement Cell Alert</span>
                            </div>

                            <p className="text-base sm:text-lg text-slate-300 leading-relaxed italic font-medium bg-slate-950/40 p-5 rounded-2xl border border-slate-800/60 shadow-inner">
                                "{randomRemark}"
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-slate-300">
                                <div className="flex items-center gap-3 bg-slate-950/30 p-4 rounded-2xl border border-slate-800/40">
                                    <Trophy className="text-amber-400 shrink-0" size={18} />
                                    <span>100% Placement Record (Strictly on PowerPoint)</span>
                                </div>
                                <div className="flex items-center gap-3 bg-slate-950/30 p-4 rounded-2xl border border-slate-800/40">
                                    <Award className="text-emerald-400 shrink-0" size={18} />
                                    <span>Zero Unpaid Work* (Excluding Internships)</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab 2: Placement Calculator */}
                    {activeTab === 'calculator' && (
                        <div className="p-6 sm:p-8 space-y-6 animate-in fade-in-40 duration-300">
                            <div className="flex items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                                <div className="flex items-center gap-3">
                                    <Calculator className="text-indigo-400 shrink-0" size={20} />
                                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Ethnotech AI Placement Chance Calculator</span>
                                </div>
                                <Sparkles className="text-amber-400 shrink-0 animate-pulse" size={16} />
                            </div>

                            <div className="space-y-4">
                                {/* Coding Hours */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-slate-400">Daily Coding Practice:</span>
                                        <span className="text-indigo-400">{hoursCode} Hours</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="12"
                                        value={hoursCode}
                                        onChange={(e) => {
                                            setHoursCode(e.target.value);
                                            setCalcResult(null);
                                        }}
                                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                    />
                                </div>

                                {/* CGPA Slider */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-slate-400">Inflated Resume CGPA:</span>
                                        <span className="text-indigo-400">{cgpa} CGPA</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="5.0"
                                        max="10.0"
                                        step="0.1"
                                        value={cgpa}
                                        onChange={(e) => {
                                            setCgpa(e.target.value);
                                            setCalcResult(null);
                                        }}
                                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                    />
                                </div>

                                {/* Unpaid Internships Select */}
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-slate-400">Unpaid Internships Accepted:</label>
                                    <select
                                        value={unpaidInternships}
                                        onChange={(e) => {
                                            setUnpaidInternships(e.target.value);
                                            setCalcResult(null);
                                        }}
                                        className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl p-3 text-sm font-semibold text-slate-350 focus:border-indigo-500 focus:outline-none"
                                    >
                                        <option value="0">0 (I want to buy food)</option>
                                        <option value="1">1 (Ready to survive on instant noodles)</option>
                                        <option value="3">3 (I collect PDFs of certificates for a hobby)</option>
                                        <option value="unlimited">Unlimited (I work solely for exposure and vibes)</option>
                                    </select>
                                </div>

                                <button
                                    onClick={handleCalculatePlacement}
                                    disabled={isCalculating}
                                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 text-white font-bold rounded-2xl text-sm transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98] flex items-center justify-center gap-2 mt-4 cursor-pointer"
                                >
                                    {isCalculating ? (
                                        <>
                                            <RefreshCw className="animate-spin" size={16} />
                                            Consulting Placement AI algorithms...
                                        </>
                                    ) : (
                                        <>
                                            <Terminal size={16} />
                                            Compute Placement Fate
                                        </>
                                    )}
                                </button>

                                {/* Results Box */}
                                {calcResult && (
                                    <div className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-2xl mt-4 space-y-3 animate-in zoom-in-95 duration-200 shadow-inner">
                                        <div className="flex items-center justify-between gap-4">
                                            <span className="text-xs font-bold text-slate-400 uppercase">Computed Success Probability:</span>
                                            <span className={`text-xl font-black ${calcResult.percentage > 70 ? 'text-emerald-400' : calcResult.percentage > 40 ? 'text-amber-400' : 'text-red-400'}`}>
                                                {calcResult.percentage}%
                                            </span>
                                        </div>
                                        {/* Fake progress bar */}
                                        <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-850">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${calcResult.percentage > 70 ? 'bg-emerald-500' : calcResult.percentage > 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                                                style={{ width: `${calcResult.percentage}%` }}
                                            />
                                        </div>
                                        <div className="space-y-1 pt-1">
                                            <p className="text-xs font-bold text-slate-300">
                                                <span className="text-red-400 font-extrabold">Verdict:</span> {calcResult.verdict}
                                            </p>
                                            <p className="text-xs text-slate-400 italic">
                                                <span className="text-indigo-400 font-extrabold">Placement Desk Action:</span> {calcResult.recommendation}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Tab 3: Submit Excuse */}
                    {activeTab === 'excuses' && (
                        <div className="p-6 sm:p-8 space-y-6 animate-in fade-in-40 duration-300">
                            <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
                                <HelpCircle className="text-indigo-400 shrink-0" size={20} />
                                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Select Your Navigation Excuse</span>
                            </div>

                            <div className="space-y-4">
                                <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                                    Our intelligent, state-of-the-art security systems logged this 404 event. Select your official excuse below to bypass academic inquiry:
                                </p>

                                <div className="space-y-2">
                                    <select
                                        onChange={handleExcuseSubmit}
                                        value={excuse}
                                        className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl p-3.5 text-sm font-semibold text-slate-350 focus:border-indigo-500 focus:outline-none"
                                    >
                                        <option value="">-- Choose your excuse path --</option>
                                        <option value="timer">"I was trying to bypass the assessment countdown timer."</option>
                                        <option value="admin">"I was searching for the admin system database console."</option>
                                        <option value="lost">"I clicked a button and got lost in empty routes."</option>
                                        <option value="keyboard">"My browser went to 404 because of keyboard layout failure."</option>
                                    </select>
                                </div>

                                {excuseReply && (
                                    <div className="bg-red-500/5 border border-red-500/20 p-5 rounded-2xl space-y-2.5 animate-in slide-in-from-top-4 duration-300 shadow-inner">
                                        <div className="flex items-center gap-2 text-xs font-bold text-red-400">
                                            <AlertTriangle size={16} />
                                            <span>Automated Academy Warden Reply:</span>
                                        </div>
                                        <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
                                            "{excuseReply}"
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Bottom promotion strip */}
                    <div className="bg-slate-950/60 p-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2 text-slate-400 font-semibold">
                            <Flame className="text-amber-400 animate-pulse" size={16} />
                            <span>Apply for '404 Broken Route Specialist' Internship</span>
                        </div>
                        <button
                            onClick={handleClaimInternship}
                            disabled={claimedInternship}
                            className={`px-4 py-2 rounded-xl text-[11px] font-extrabold uppercase tracking-wide border cursor-pointer transition-all ${claimedInternship ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/30 text-indigo-400 active:scale-95'}`}
                        >
                            {claimedInternship ? "Internship Secured! (Check Desk)" : "Secure Position (₹8,999 fee)"}
                        </button>
                    </div>
                </div>

                {/* Sarcastic Navigation Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={() => navigate(isAuthenticated ? '/dashboard' : '/console/admin')}
                        className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-[#004AAD] to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm font-bold rounded-2xl transition-all shadow-lg shadow-indigo-900/40 active:scale-95 flex items-center justify-center gap-2 group cursor-pointer"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        {isAuthenticated ? 'Back to Portal Dashboard' : 'Back to Admin Portal'}
                    </button>

                    <button
                        onClick={() => navigate(isAuthenticated ? '/admin/courses' : '/portal')}
                        className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-white text-sm font-bold rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2 group cursor-pointer"
                    >
                        <BookOpen size={16} className="text-indigo-400" />
                        Explore 'High-Paying' Syllabus
                        <ArrowRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                {/* Highly Sarcastic Small Text Footer */}
                <div className="space-y-1 px-4">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">
                        Ethnotech Academy © 2026. All placements are fictional. Real placements are purely coincidental.
                    </p>
                    <p className="text-[9px] text-slate-600">
                        *100% Placement means you will receive emails containing PDF certificates. Ethnotech does not guarantee actual monetary exchange, employment status, or career satisfaction.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
