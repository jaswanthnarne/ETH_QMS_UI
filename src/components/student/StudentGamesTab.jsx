import { useState, useEffect, useCallback } from 'react';
import {
    Trophy,
    RotateCcw,
    Play,
    Sparkles,
    Clock,
    CheckCircle,
    AlertCircle,
    ArrowLeft,
    Zap,
    Award,
    HelpCircle
} from 'lucide-react';

// Static Cartoon SVG Illustrations for the Games Hub & Each of the 4 Games
export const GameCardSvg = ({ type, className = 'w-44 h-28 shrink-0' }) => {
    switch (type) {
        case 'hub':
            // Cartoon Arcade Cabinet, Gamepad Controller & Star Coins
            return (
                <svg viewBox="0 0 240 120" className={className} aria-hidden="true">
                    <ellipse cx="120" cy="110" rx="98" ry="7" fill="#E2E8F0" />
                    {/* Cartoon Arcade Machine */}
                    <rect x="26" y="16" width="76" height="88" rx="10" fill="#38BDF8" stroke="#1E293B" strokeWidth="2.2" />
                    <rect x="34" y="24" width="60" height="40" rx="6" fill="#0F172A" stroke="#1E293B" strokeWidth="2" />
                    <text x="64" y="48" textAnchor="middle" fontSize="11" fontWeight="900" fill="#FACC15">PLAY!</text>
                    {/* Joystick & Arcade Buttons */}
                    <rect x="32" y="68" width="64" height="10" rx="3" fill="#F59E0B" stroke="#1E293B" strokeWidth="2" />
                    <line x1="48" y1="68" x2="48" y2="58" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx="48" cy="56" r="4.5" fill="#EF4444" stroke="#1E293B" strokeWidth="1.8" />
                    <circle cx="72" cy="73" r="3" fill="#EF4444" stroke="#1E293B" strokeWidth="1.5" />
                    <circle cx="82" cy="73" r="3" fill="#34D399" stroke="#1E293B" strokeWidth="1.5" />
                    {/* Cartoon Gamepad Controller on Right */}
                    <rect x="122" y="44" width="90" height="50" rx="22" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2.2" />
                    {/* D-Pad */}
                    <path d="M144 62 h8 v-8 h8 v8 h8 v8 h-8 v8 h-8 v-8 h-8 z" fill="#334155" stroke="#1E293B" strokeWidth="1.6" strokeLinejoin="round" />
                    {/* Action Buttons */}
                    <circle cx="188" cy="60" r="4.5" fill="#F43F5E" stroke="#1E293B" strokeWidth="1.6" />
                    <circle cx="198" cy="68" r="4.5" fill="#38BDF8" stroke="#1E293B" strokeWidth="1.6" />
                    <circle cx="178" cy="68" r="4.5" fill="#FACC15" stroke="#1E293B" strokeWidth="1.6" />
                    <circle cx="188" cy="76" r="4.5" fill="#34D399" stroke="#1E293B" strokeWidth="1.6" />
                    {/* Floating Star Coin */}
                    <circle cx="168" cy="24" r="13" fill="#FACC15" stroke="#1E293B" strokeWidth="2" />
                    <text x="168" y="28" textAnchor="middle" fontSize="11" fontWeight="900" fill="#B45309">★</text>
                    <line x1="14" y1="106" x2="226" y2="106" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
            );

        case 'math-blitz':
            // Cartoon Smiling Calculator Mascot, Lightning Bolt & Math Operator Badges
            return (
                <svg viewBox="0 0 220 120" className={className} aria-hidden="true">
                    <ellipse cx="110" cy="110" rx="90" ry="7" fill="#E2E8F0" />
                    {/* Cartoon Calculator Character */}
                    <rect x="52" y="16" width="76" height="88" rx="12" fill="#38BDF8" stroke="#1E293B" strokeWidth="2.2" />
                    <rect x="62" y="26" width="56" height="24" rx="5" fill="#DCFCE7" stroke="#1E293B" strokeWidth="1.8" />
                    {/* Cute Eyes & Smile on Calculator Screen */}
                    <circle cx="78" cy="36" r="2.5" fill="#1E293B" />
                    <circle cx="102" cy="36" r="2.5" fill="#1E293B" />
                    <path d="M84 41 Q90 46 96 41" stroke="#1E293B" strokeWidth="2" fill="none" strokeLinecap="round" />
                    {/* Calculator Buttons */}
                    {[64, 84, 104].map((x) =>
                        [58, 74, 88].map((y, idx) => (
                            <rect
                                key={`${x}-${y}`}
                                x={x}
                                y={y}
                                width="14"
                                height="10"
                                rx="3"
                                fill={idx === 2 && x === 104 ? '#FACC15' : '#FFFFFF'}
                                stroke="#1E293B"
                                strokeWidth="1.6"
                            />
                        ))
                    )}
                    {/* Operator Badges on Left */}
                    <circle cx="28" cy="42" r="14" fill="#F43F5E" stroke="#1E293B" strokeWidth="2" />
                    <text x="28" y="47" textAnchor="middle" fontSize="15" fontWeight="900" fill="#FFFFFF">+</text>
                    <circle cx="30" cy="78" r="13" fill="#A78BFA" stroke="#1E293B" strokeWidth="2" />
                    <text x="30" y="83" textAnchor="middle" fontSize="15" fontWeight="900" fill="#FFFFFF">×</text>
                    {/* Cartoon Lightning Bolt on Right */}
                    <polygon points="164,18 144,60 162,60 150,98 188,50 168,50" fill="#FACC15" stroke="#1E293B" strokeWidth="2.2" strokeLinejoin="round" />
                </svg>
            );

        case 'memory-matrix':
            // Cartoon 2x2 Flip Cards Grid with Brain Mascot & Sparkle Star
            return (
                <svg viewBox="0 0 220 120" className={className} aria-hidden="true">
                    <ellipse cx="110" cy="110" rx="90" ry="7" fill="#E2E8F0" />
                    {/* 4 Cartoon Memory Cards */}
                    <rect x="26" y="18" width="42" height="40" rx="8" fill="#34D399" stroke="#1E293B" strokeWidth="2" />
                    <text x="47" y="43" textAnchor="middle" fontSize="14" fontWeight="900" fill="#FFFFFF">&lt;/&gt;</text>

                    <rect x="76" y="18" width="42" height="40" rx="8" fill="#FACC15" stroke="#1E293B" strokeWidth="2" />
                    <text x="97" y="44" textAnchor="middle" fontSize="16" fontWeight="900" fill="#1E293B">?</text>

                    <rect x="26" y="64" width="42" height="40" rx="8" fill="#38BDF8" stroke="#1E293B" strokeWidth="2" />
                    <text x="47" y="90" textAnchor="middle" fontSize="16" fontWeight="900" fill="#FFFFFF">?</text>

                    <rect x="76" y="64" width="42" height="40" rx="8" fill="#34D399" stroke="#1E293B" strokeWidth="2" />
                    <text x="97" y="89" textAnchor="middle" fontSize="14" fontWeight="900" fill="#FFFFFF">&lt;/&gt;</text>

                    {/* Cute Cartoon Robot/Brain Character on Right */}
                    <rect x="138" y="38" width="54" height="48" rx="14" fill="#F43F5E" stroke="#1E293B" strokeWidth="2.2" />
                    <line x1="165" y1="38" x2="165" y2="24" stroke="#1E293B" strokeWidth="2.5" />
                    <circle cx="165" cy="21" r="5" fill="#FACC15" stroke="#1E293B" strokeWidth="1.8" />
                    <circle cx="154" cy="56" r="5" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.8" />
                    <circle cx="176" cy="56" r="5" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.8" />
                    <circle cx="154" cy="56" r="2" fill="#1E293B" />
                    <circle cx="176" cy="56" r="2" fill="#1E293B" />
                    <path d="M156 71 Q165 77 174 71" stroke="#FFFFFF" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                </svg>
            );

        case 'word-cipher':
            // Cartoon Letter Blocks, Detective Magnifying Glass & Terminal Key
            return (
                <svg viewBox="0 0 220 120" className={className} aria-hidden="true">
                    <ellipse cx="110" cy="110" rx="90" ry="7" fill="#E2E8F0" />
                    {/* Cartoon Letter Tiles */}
                    {[
                        { x: 20, y: 30, ch: 'C', bg: '#FDE68A' },
                        { x: 60, y: 22, ch: 'O', bg: '#BAE6FD' },
                        { x: 100, y: 30, ch: 'D', bg: '#A7F3D0' },
                        { x: 140, y: 22, ch: 'E', bg: '#DDD6FE' }
                    ].map((tile, idx) => (
                        <g key={idx}>
                            <rect x={tile.x} y={tile.y} width="36" height="38" rx="8" fill={tile.bg} stroke="#1E293B" strokeWidth="2" />
                            <text x={tile.x + 18} y={tile.y + 25} textAnchor="middle" fontSize="16" fontWeight="900" fill="#1E293B">
                                {tile.ch}
                            </text>
                        </g>
                    ))}
                    {/* Cartoon Magnifying Glass Below */}
                    <circle cx="96" cy="78" r="20" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2.2" />
                    <circle cx="96" cy="78" r="14" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="1.8" />
                    <path d="M90 78 l4 4 9-9" stroke="#10B981" strokeWidth="2.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="111" y1="91" x2="132" y2="105" stroke="#F59E0B" strokeWidth="7" strokeLinecap="round" />
                    <line x1="111" y1="91" x2="132" y2="105" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
            );

        case 'pattern-iq':
            // Cartoon Jigsaw Puzzle Piece, Number Sequence Train & Glowing Lightbulb
            return (
                <svg viewBox="0 0 220 120" className={className} aria-hidden="true">
                    <ellipse cx="110" cy="110" rx="90" ry="7" fill="#E2E8F0" />
                    {/* Connected Sequence Blocks */}
                    <line x1="40" y1="68" x2="175" y2="68" stroke="#1E293B" strokeWidth="3" />
                    {[
                        { x: 22, label: '2', bg: '#BAE6FD' },
                        { x: 68, label: '6', bg: '#38BDF8' },
                        { x: 114, label: '18', bg: '#34D399' },
                        { x: 160, label: '?', bg: '#FACC15' }
                    ].map((b, i) => (
                        <g key={i}>
                            <rect x={b.x} y="48" width="38" height="38" rx="9" fill={b.bg} stroke="#1E293B" strokeWidth="2.2" />
                            <text x={b.x + 19} y="73" textAnchor="middle" fontSize="15" fontWeight="900" fill="#1E293B">
                                {b.label}
                            </text>
                        </g>
                    ))}
                    {/* Glowing Cartoon Idea Bulb Above */}
                    <circle cx="110" cy="24" r="13" fill="#FEF08A" stroke="#1E293B" strokeWidth="2" />
                    <line x1="110" y1="6" x2="110" y2="2" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" />
                    <line x1="92" y1="14" x2="87" y2="10" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" />
                    <line x1="128" y1="14" x2="133" y2="10" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
            );

        default:
            return null;
    }
};

// Mini Cartoon SVG Icons for the Memory Matrix Game Cards
const MemoryTokenSvg = ({ icon }) => {
    switch (icon) {
        case 'code':
            return (
                <svg viewBox="0 0 60 60" className="w-10 h-10">
                    <rect x="8" y="12" width="44" height="36" rx="6" fill="#38BDF8" stroke="#1E293B" strokeWidth="2.2" />
                    <text x="30" y="35" textAnchor="middle" fontSize="15" fontWeight="900" fill="#FFFFFF">&lt;/&gt;</text>
                </svg>
            );
        case 'rocket':
            return (
                <svg viewBox="0 0 60 60" className="w-10 h-10">
                    <path d="M30 8 C42 20, 42 40, 30 50 C18 40, 18 20, 30 8 Z" fill="#F43F5E" stroke="#1E293B" strokeWidth="2.2" />
                    <circle cx="30" cy="28" r="6" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
                </svg>
            );
        case 'trophy':
            return (
                <svg viewBox="0 0 60 60" className="w-10 h-10">
                    <path d="M18 12 h24 v14 c0 7-5 12-12 12 s-12-5-12-12 V12 z" fill="#FACC15" stroke="#1E293B" strokeWidth="2.2" />
                    <rect x="26" y="38" width="8" height="8" fill="#F59E0B" stroke="#1E293B" strokeWidth="2" />
                    <rect x="18" y="46" width="24" height="6" rx="2" fill="#38BDF8" stroke="#1E293B" strokeWidth="2" />
                </svg>
            );
        case 'bulb':
            return (
                <svg viewBox="0 0 60 60" className="w-10 h-10">
                    <circle cx="30" cy="26" r="15" fill="#FDE047" stroke="#1E293B" strokeWidth="2.2" />
                    <rect x="24" y="40" width="12" height="8" rx="2" fill="#94A3B8" stroke="#1E293B" strokeWidth="2" />
                </svg>
            );
        case 'shield':
            return (
                <svg viewBox="0 0 60 60" className="w-10 h-10">
                    <path d="M30 8 L48 16 V32 C48 44 39 51 30 54 C21 51 12 44 12 32 V16 Z" fill="#34D399" stroke="#1E293B" strokeWidth="2.2" />
                    <path d="M23 31 l5 5 10-10" stroke="#FFFFFF" strokeWidth="3" fill="none" strokeLinecap="round" />
                </svg>
            );
        case 'cpu':
            return (
                <svg viewBox="0 0 60 60" className="w-10 h-10">
                    <rect x="16" y="16" width="28" height="28" rx="5" fill="#A78BFA" stroke="#1E293B" strokeWidth="2.2" />
                    <rect x="23" y="23" width="14" height="14" rx="2" fill="#FEF3C7" stroke="#1E293B" strokeWidth="1.8" />
                </svg>
            );
        case 'star':
            return (
                <svg viewBox="0 0 60 60" className="w-10 h-10">
                    <polygon points="30,8 36,22 51,24 40,34 43,49 30,41 17,49 20,34 9,24 24,22" fill="#F59E0B" stroke="#1E293B" strokeWidth="2.2" strokeLinejoin="round" />
                </svg>
            );
        case 'db':
        default:
            return (
                <svg viewBox="0 0 60 60" className="w-10 h-10">
                    <ellipse cx="30" cy="16" rx="16" ry="6" fill="#60A5FA" stroke="#1E293B" strokeWidth="2" />
                    <rect x="14" y="16" width="32" height="28" fill="#60A5FA" stroke="#1E293B" strokeWidth="2" />
                    <ellipse cx="30" cy="44" rx="16" ry="6" fill="#3B82F6" stroke="#1E293B" strokeWidth="2" />
                </svg>
            );
    }
};

// ============================================================================
// GAME 1: SPEED MATH BLITZ
// ============================================================================
const SpeedMathBlitzGame = ({ onSaveHighScore, highScore }) => {
    const [playing, setPlaying] = useState(false);
    const [timeLeft, setTimeLeft] = useState(45);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [question, setQuestion] = useState(null);
    const [feedback, setFeedback] = useState(null);

    const generateQuestion = useCallback(() => {
        const types = ['add', 'sub', 'mul', 'square', 'percent'];
        const chosen = types[Math.floor(Math.random() * types.length)];
        let text = '';
        let answer = 0;

        if (chosen === 'add') {
            const a = Math.floor(Math.random() * 45) + 12;
            const b = Math.floor(Math.random() * 45) + 12;
            text = `${a} + ${b}`;
            answer = a + b;
        } else if (chosen === 'sub') {
            const a = Math.floor(Math.random() * 60) + 35;
            const b = Math.floor(Math.random() * 30) + 8;
            text = `${a} − ${b}`;
            answer = a - b;
        } else if (chosen === 'mul') {
            const a = Math.floor(Math.random() * 12) + 4;
            const b = Math.floor(Math.random() * 11) + 3;
            text = `${a} × ${b}`;
            answer = a * b;
        } else if (chosen === 'square') {
            const a = Math.floor(Math.random() * 13) + 6;
            text = `${a}²`;
            answer = a * a;
        } else {
            const pcts = [10, 20, 25, 50];
            const p = pcts[Math.floor(Math.random() * pcts.length)];
            const base = (Math.floor(Math.random() * 8) + 2) * 20;
            text = `${p}% of ${base}`;
            answer = (p * base) / 100;
        }

        const opts = new Set([answer]);
        while (opts.size < 4) {
            const offset = (Math.floor(Math.random() * 7) - 3) || 2;
            const candidate = answer + offset * (Math.random() > 0.5 ? 1 : 2);
            if (candidate >= 0) opts.add(candidate);
        }
        const shuffled = Array.from(opts).sort(() => Math.random() - 0.5);
        setQuestion({ text, answer, options: shuffled });
    }, []);

    const startGame = () => {
        setScore(0);
        setStreak(0);
        setTimeLeft(45);
        setFeedback(null);
        setPlaying(true);
        generateQuestion();
    };

    useEffect(() => {
        if (!playing) return;
        if (timeLeft <= 0) {
            setPlaying(false);
            onSaveHighScore(score);
            return;
        }
        const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
        return () => clearTimeout(timer);
    }, [playing, timeLeft, score, onSaveHighScore]);

    const handleOptionClick = (val) => {
        if (!playing || !question) return;
        if (val === question.answer) {
            const newStreak = streak + 1;
            const points = 10 + Math.min(newStreak * 2, 20);
            const newScore = score + points;
            setScore(newScore);
            setStreak(newStreak);
            setFeedback({ ok: true, msg: `+${points} pts!` });
            onSaveHighScore(newScore);
        } else {
            setStreak(0);
            setFeedback({ ok: false, msg: `Correct was ${question.answer}` });
        }
        generateQuestion();
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-6">
                    <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">Current Score</span>
                        <span className="text-2xl font-bold text-slate-800">{score}</span>
                    </div>
                    <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">Streak</span>
                        <span className="text-xl font-bold text-amber-600">{streak}🔥</span>
                    </div>
                    <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">Best Score</span>
                        <span className="text-xl font-bold text-[#5899B5]">{Math.max(highScore, score)}</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className={`px-4 py-2 rounded-xl font-mono font-bold text-sm flex items-center gap-1.5 border ${
                        timeLeft <= 10 ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-blue-50 text-[#5899B5] border-blue-100'
                    }`}>
                        <Clock size={15} /> {timeLeft}s
                    </div>
                    <button
                        type="button"
                        onClick={startGame}
                        className="px-4 py-2 bg-[#5899B5] hover:bg-[#3D7690] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer transition"
                    >
                        <RotateCcw size={14} /> {playing ? 'Restart' : 'Start Blitz'}
                    </button>
                </div>
            </div>

            {!playing ? (
                <div className="text-center py-10 px-4 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 space-y-4">
                    <GameCardSvg type="math-blitz" className="w-52 h-32 mx-auto" />
                    <h4 className="text-xl font-semibold text-slate-800">
                        {timeLeft === 0 ? `Time's Up! Final Score: ${score}` : 'Ready for a 45-Second Quantitative Blitz?'}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                        Solve as many mental arithmetic, percentage, and square problems as you can before the timer runs out. Consecutive correct answers build your streak bonus!
                    </p>
                    <button
                        type="button"
                        onClick={startGame}
                        className="px-6 py-3 bg-[#5899B5] hover:bg-[#3D7690] text-white font-semibold rounded-2xl text-sm inline-flex items-center gap-2 cursor-pointer shadow-sm transition"
                    >
                        <Play size={16} /> {timeLeft === 0 ? 'Play Again' : 'Start Game'}
                    </button>
                </div>
            ) : (
                <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-50 to-blue-50/30 border border-slate-100 text-center space-y-6">
                    <div className="space-y-1">
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#5899B5]">Calculate Quickly</span>
                        <div className="text-4xl sm:text-5xl font-bold text-slate-800 font-mono py-4">
                            {question?.text} = ?
                        </div>
                        {feedback && (
                            <p className={`text-xs font-semibold ${feedback.ok ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {feedback.msg}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl mx-auto">
                        {question?.options.map((opt, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => handleOptionClick(opt)}
                                className="py-4 px-5 bg-white hover:bg-[#5899B5] text-slate-800 hover:text-white border-2 border-slate-200 hover:border-[#5899B5] rounded-2xl text-xl font-bold font-mono transition cursor-pointer shadow-xs active:scale-95"
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// ============================================================================
// GAME 2: TECH MEMORY MATRIX
// ============================================================================
const ICONS = ['code', 'rocket', 'trophy', 'bulb', 'shield', 'cpu', 'star', 'db'];

const TechMemoryMatrixGame = ({ onSaveHighScore, highScore }) => {
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState([]);
    const [moves, setMoves] = useState(0);

    const initBoard = useCallback(() => {
        const deck = [...ICONS, ...ICONS]
            .sort(() => Math.random() - 0.5)
            .map((icon, index) => ({ id: index, icon }));
        setCards(deck);
        setFlipped([]);
        setMatched([]);
        setMoves(0);
    }, []);

    useEffect(() => {
        initBoard();
    }, [initBoard]);

    const handleCardClick = (idx) => {
        if (flipped.length === 2 || flipped.includes(idx) || matched.includes(cards[idx].icon)) return;
        const nextFlipped = [...flipped, idx];
        setFlipped(nextFlipped);

        if (nextFlipped.length === 2) {
            const nextMoves = moves + 1;
            setMoves(nextMoves);
            const [firstIdx, secondIdx] = nextFlipped;
            if (cards[firstIdx].icon === cards[secondIdx].icon) {
                const nextMatched = [...matched, cards[firstIdx].icon];
                setMatched(nextMatched);
                setFlipped([]);
                if (nextMatched.length === ICONS.length) {
                    const computedScore = Math.max(100, 300 - (nextMoves - 8) * 12);
                    onSaveHighScore(computedScore);
                }
            } else {
                setTimeout(() => setFlipped([]), 650);
            }
        }
    };

    const isComplete = matched.length === ICONS.length;

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-6">
                    <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">Pairs Found</span>
                        <span className="text-2xl font-bold text-slate-800">{matched.length} / {ICONS.length}</span>
                    </div>
                    <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">Moves Used</span>
                        <span className="text-xl font-bold text-amber-600">{moves}</span>
                    </div>
                    <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">Best Score</span>
                        <span className="text-xl font-bold text-[#5899B5]">{highScore}</span>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={initBoard}
                    className="px-4 py-2 bg-[#5899B5] hover:bg-[#3D7690] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer transition"
                >
                    <RotateCcw size={14} /> Shuffle Deck
                </button>
            </div>

            {isComplete && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Trophy className="text-emerald-600 shrink-0" size={24} />
                        <div>
                            <p className="text-sm font-bold text-emerald-800">All 8 Tech Pairs Matched in {moves} Moves!</p>
                            <p className="text-xs text-emerald-700">Score Awarded: {Math.max(100, 300 - (moves - 8) * 12)} pts</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={initBoard}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl cursor-pointer"
                    >
                        Play Again
                    </button>
                </div>
            )}

            <div className="grid grid-cols-4 gap-3 sm:gap-4 max-w-md mx-auto">
                {cards.map((card, idx) => {
                    const isShown = flipped.includes(idx) || matched.includes(card.icon);
                    const isPairMatched = matched.includes(card.icon);
                    return (
                        <button
                            key={card.id}
                            type="button"
                            onClick={() => handleCardClick(idx)}
                            className={`h-20 sm:h-24 rounded-2xl border-2 flex items-center justify-center transition-all cursor-pointer ${
                                isPairMatched
                                    ? 'bg-emerald-50 border-emerald-300 shadow-xs'
                                    : isShown
                                        ? 'bg-white border-[#5899B5] shadow-md'
                                        : 'bg-[#5899B5] hover:bg-[#3D7690] border-slate-800 text-white'
                            }`}
                        >
                            {isShown ? (
                                <MemoryTokenSvg icon={card.icon} />
                            ) : (
                                <span className="text-2xl font-black text-white/90">?</span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

// ============================================================================
// GAME 3: CODE & LOGIC DECIPHER (TECH WORD SCRAMBLE - 80 CS & PLACEMENT TERMS)
// ============================================================================
const CIPHER_WORDS = [
    // Data Structures & Algorithms (1 - 20)
    { word: 'ALGORITHM', clue: 'Step-by-step procedure used to solve a computational problem.' },
    { word: 'RECURSION', clue: 'A technique where a function calls itself until a base condition is met.' },
    { word: 'HASHMAP', clue: 'Data structure that stores key-value pairs with O(1) average lookup.' },
    { word: 'BINARY', clue: 'Search algorithm that halves a sorted array on every comparison.' },
    { word: 'HEAPSORT', clue: 'Comparison-based sorting technique based on a binary heap data structure.' },
    { word: 'QUICKSORT', clue: 'Divide-and-conquer sorting algorithm that partitions around a pivot element.' },
    { word: 'MERGESORT', clue: 'Stable O(n log n) sorting algorithm that divides and merges sorted halves.' },
    { word: 'BACKTRACK', clue: 'Algorithmic technique that incrementally builds candidates and abandons invalid paths.' },
    { word: 'DIJKSTRA', clue: 'Famous greedy algorithm for finding shortest paths from a source vertex in a graph.' },
    { word: 'KRUSKAL', clue: 'Greedy graph algorithm that finds a Minimum Spanning Tree by sorting edges by weight.' },
    { word: 'TOPOLOGY', clue: 'Linear ordering of vertices in a Directed Acyclic Graph (DAG).' },
    { word: 'MEMOIZE', clue: 'Optimization technique that caches expensive function call results in Dynamic Programming.' },
    { word: 'LINKEDLIST', clue: 'Linear collection of nodes where each node points to the next in memory.' },
    { word: 'AVLTREE', clue: 'Self-balancing binary search tree where subtree heights differ by at most one.' },
    { word: 'TRIE', clue: 'Prefix tree data structure used for fast dictionary string retrieval and autocomplete.' },
    { word: 'DEQUE', clue: 'Double-ended queue allowing insertion and deletion at both front and rear.' },
    { word: 'MONOTONIC', clue: 'Type of stack or queue whose elements are strictly increasing or decreasing.' },
    { word: 'BIPARTITE', clue: 'Graph whose vertices can be divided into two disjoint independent sets.' },
    { word: 'SUBARRAY', clue: 'Contiguous slice of elements within a parent array (e.g., Kadane’s algorithm).' },
    { word: 'POINTER', clue: 'Memory variable that stores the direct address of another variable.' },

    // Operating Systems & Computer Architecture (21 - 35)
    { word: 'DEADLOCK', clue: 'OS state where two or more processes wait indefinitely for each other’s resource.' },
    { word: 'SEMAPHORE', clue: 'Signaling variable used to control access to shared resources in concurrent systems.' },
    { word: 'MUTEX', clue: 'Mutual exclusion lock that allows only one thread into a critical section at a time.' },
    { word: 'THRASHING', clue: 'OS condition where excessive paging leaves little CPU time for actual execution.' },
    { word: 'KERNEL', clue: 'Core component of an operating system that manages hardware and system calls.' },
    { word: 'SCHEDULER', clue: 'OS module that selects which ready process gets CPU time next.' },
    { word: 'PAGETABLE', clue: 'Data structure used by virtual memory to map virtual addresses to physical frames.' },
    { word: 'INTERRUPT', clue: 'Signal emitted by hardware or software indicating an event needing immediate CPU attention.' },
    { word: 'PIPELINE', clue: 'CPU instruction execution technique where multiple instructions overlap in stages.' },
    { word: 'REGISTER', clue: 'Ultra-fast, small storage location directly inside the CPU processor.' },
    { word: 'FIRMWARE', clue: 'Low-level permanent software programmed into read-only memory hardware.' },
    { word: 'SPOOLING', clue: 'Buffering jobs on disk or memory so slow I/O devices like printers can read them at their own rate.' },
    { word: 'STARVATION', clue: 'Situation where a low-priority process is perpetually denied necessary CPU resources.' },
    { word: 'CONTEXT', clue: 'State saved and reloaded by the OS when switching the CPU between processes.' },
    { word: 'DAEMON', clue: 'Computer program that runs unobtrusively as a background process.' },

    // Object-Oriented Programming & Compilers (36 - 48)
    { word: 'COMPILER', clue: 'Translates high-level source code into machine code all at once before execution.' },
    { word: 'POLYMORPH', clue: 'OOP concept allowing objects to take many forms via overloading or overriding.' },
    { word: 'INTERFACE', clue: 'Abstract contract in OOP that defines method signatures without state.' },
    { word: 'ABSTRACT', clue: 'OOP principle of hiding complex implementation details and showing only essentials.' },
    { word: 'INHERIT', clue: 'OOP mechanism where a child class acquires properties and methods of a parent class.' },
    { word: 'SINGLETON', clue: 'Design pattern that restricts instantiation of a class to a single global object.' },
    { word: 'BYTECODE', clue: 'Platform-independent intermediate code executed by a virtual machine like the JVM.' },
    { word: 'GARBAGE', clue: 'Automatic memory management collector that reclaims unused heap objects.' },
    { word: 'CLOSURE', clue: 'Function bundled together with references to its surrounding lexical environment.' },
    { word: 'IMMUTABLE', clue: 'Object whose state cannot be modified after it is created in memory.' },
    { word: 'LAMBDA', clue: 'Concise anonymous function expression passed as an argument in functional programming.' },
    { word: 'ITERATOR', clue: 'Object that enables traversing a container collection one element at a time.' },
    { word: 'HOISTING', clue: 'JavaScript mechanism where variable and function declarations move to top of scope.' },

    // Database Management Systems (49 - 60)
    { word: 'DATABASE', clue: 'Organized collection of structured data stored electronically.' },
    { word: 'INDEXING', clue: 'DBMS technique using B-Trees to speed up data retrieval queries at the cost of writes.' },
    { word: 'FOREIGNKEY', clue: 'Column that establishes a referential link between data in two relational tables.' },
    { word: 'NORMALIZE', clue: 'Database design process that organizes tables to minimize data redundancy.' },
    { word: 'ROLLBACK', clue: 'Transaction operation that undoes uncommitted database changes on error.' },
    { word: 'TRIGGER', clue: 'Stored database procedure that automatically fires when an INSERT, UPDATE, or DELETE occurs.' },
    { word: 'SHARDING', clue: 'Horizontal database partitioning pattern that splits large tables across multiple servers.' },
    { word: 'NOSQL', clue: 'Non-relational database paradigm storing document, key-value, wide-column, or graph data.' },
    { word: 'AGGREGATE', clue: 'SQL function like COUNT, SUM, AVG, MIN, or MAX that computes a single result from rows.' },
    { word: 'SUBQUERY', clue: 'Nested SQL query embedded inside the WHERE, FROM, or SELECT clause of another query.' },
    { word: 'REPLICATE', clue: 'Copying and maintaining database objects across multiple server nodes for fault tolerance.' },
    { word: 'SNAPSHOT', clue: 'Read-consistent point-in-time view of a database or storage volume.' },

    // Computer Networks, Web & Cloud Security (61 - 80)
    { word: 'FIREWALL', clue: 'Network security system that monitors and filters incoming and outgoing traffic.' },
    { word: 'PROTOCOL', clue: 'Standard set of rules governing how data packets are transmitted across a network.' },
    { word: 'ETHERNET', clue: 'Traditional wired Local Area Network (LAN) technology operating at the Data Link layer.' },
    { word: 'HANDSHAKE', clue: 'Three-way SYN, SYN-ACK, ACK negotiation that establishes a reliable TCP connection.' },
    { word: 'LATENCY', clue: 'Time delay taken for a data packet to travel from source to destination.' },
    { word: 'BANDWIDTH', clue: 'Maximum data transfer capacity of a network communication channel per second.' },
    { word: 'SUBNET', clue: 'Logical subdivision of an IP network using a bitmask to route traffic efficiently.' },
    { word: 'GATEWAY', clue: 'Network node that connects two networks using different transmission protocols.' },
    { word: 'LOOPBACK', clue: 'Virtual network interface (127.0.0.1 / localhost) used for local host communication.' },
    { word: 'DNSLOOKUP', clue: 'Resolution process that translates human-friendly domain names into IP addresses.' },
    { word: 'WEBHOOK', clue: 'HTTP callback that pushes real-time event payloads from one server to another.' },
    { word: 'GRAPHQL', clue: 'API query language that lets clients request the exact fields they need.' },
    { word: 'WEBSOCKET', clue: 'Full-duplex communication protocol over a single persistent TCP connection.' },
    { word: 'TOKENIZE', clue: 'Breaking input text or authentication claims (like JWT) into discrete verifiable tokens.' },
    { word: 'CHECKSUM', clue: 'Small-sized datum computed from a data block to detect transmission errors.' },
    { word: 'PHISHING', clue: 'Social engineering cyberattack that tricks users into revealing credentials.' },
    { word: 'SALTING', clue: 'Adding random data before hashing a password to defend against rainbow table attacks.' },
    { word: 'CONTAINER', clue: 'Lightweight Docker package bundling application code with all its OS dependencies.' },
    { word: 'KUBERNETES', clue: 'Open-source orchestration platform for automating container deployment and scaling.' },
    { word: 'MIDDLEWARE', clue: 'Software layer sitting between the request router and controller in web frameworks.' },
    { word: 'IDEMPOTENT', clue: 'REST API property where making multiple identical requests has the same effect as one.' }
];

const shuffleArray = (arr) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
};

const scrambleString = (str) => {
    const arr = str.split('');
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    const res = arr.join('');
    return res === str ? arr.reverse().join('') : res;
};

const CodeLogicDecipherGame = ({ onSaveHighScore, highScore }) => {
    const [deck, setDeck] = useState(() => shuffleArray(CIPHER_WORDS));
    const [index, setIndex] = useState(0);
    const [scrambled, setScrambled] = useState('');
    const [guess, setGuess] = useState('');
    const [score, setScore] = useState(0);
    const [hintUsed, setHintUsed] = useState(false);
    const [statusMsg, setStatusMsg] = useState(null);

    const currentItem = deck[index % deck.length];

    const loadWord = useCallback((idx, targetDeck = deck) => {
        const item = targetDeck[idx % targetDeck.length];
        setScrambled(scrambleString(item.word));
        setGuess('');
        setHintUsed(false);
        setStatusMsg(null);
    }, [deck]);

    useEffect(() => {
        loadWord(0, deck);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSubmit = (e) => {
        e.preventDefault();
        if (guess.trim().toUpperCase() === currentItem.word) {
            const pts = hintUsed ? 15 : 25;
            const nextScore = score + pts;
            setScore(nextScore);
            onSaveHighScore(nextScore);
            setStatusMsg({ ok: true, text: `Deciphered! +${pts} pts` });
            setTimeout(() => {
                const nextIdx = index + 1;
                setIndex(nextIdx);
                loadWord(nextIdx, deck);
            }, 900);
        } else {
            setStatusMsg({ ok: false, text: 'Not quite! Check the letter tiles and try again.' });
        }
    };

    const handleRevealHint = () => {
        setHintUsed(true);
        setGuess(currentItem.word.slice(0, 2));
    };

    const handleShuffleNewDeck = () => {
        const fresh = shuffleArray(CIPHER_WORDS);
        setDeck(fresh);
        setIndex(0);
        setScore(0);
        loadWord(0, fresh);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-6">
                    <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">Cipher Score</span>
                        <span className="text-2xl font-bold text-slate-800">{score}</span>
                    </div>
                    <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">Puzzle Pool</span>
                        <span className="text-xl font-bold text-amber-600">#{(index % deck.length) + 1} / {deck.length}</span>
                    </div>
                    <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">Best Score</span>
                        <span className="text-xl font-bold text-[#5899B5]">{Math.max(highScore, score)}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleShuffleNewDeck}
                        className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer transition"
                    >
                        <RotateCcw size={13} /> Shuffle {deck.length} Words
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            const nextIdx = index + 1;
                            setIndex(nextIdx);
                            loadWord(nextIdx, deck);
                        }}
                        className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer transition"
                    >
                        Skip Word →
                    </button>
                </div>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-slate-50/60 border border-slate-100 text-center space-y-6">
                <div className="space-y-2">
                    <span className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-blue-50 text-[#5899B5]">
                        Technical Clue ({currentItem.word.length} Letters)
                    </span>
                    <p className="text-sm sm:text-base font-semibold text-slate-700 max-w-lg mx-auto">
                        “{currentItem.clue}”
                    </p>
                </div>

                {/* Cartoon Letter Tiles */}
                <div className="flex flex-wrap justify-center gap-2">
                    {scrambled.split('').map((ch, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => setGuess((g) => (g.length < currentItem.word.length ? g + ch : g))}
                            className="w-11 h-12 rounded-xl bg-amber-100 hover:bg-amber-200 border-2 border-slate-800 text-slate-900 font-black text-lg font-mono shadow-xs cursor-pointer transition active:scale-95"
                        >
                            {ch}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                    <input
                        type="text"
                        value={guess}
                        onChange={(e) => setGuess(e.target.value.toUpperCase())}
                        placeholder={`Type ${currentItem.word.length}-letter term`}
                        className="w-full px-5 py-3 border-2 border-slate-200 focus:border-[#5899B5] rounded-2xl font-mono font-bold uppercase text-center text-base outline-none bg-white"
                    />
                    <div className="flex gap-2 w-full sm:w-auto">
                        <button
                            type="submit"
                            className="flex-1 sm:flex-initial px-6 py-3 bg-[#5899B5] hover:bg-[#3D7690] text-white font-semibold rounded-2xl text-xs sm:text-sm cursor-pointer transition whitespace-nowrap"
                        >
                            Verify
                        </button>
                        <button
                            type="button"
                            onClick={handleRevealHint}
                            disabled={hintUsed}
                            className="px-4 py-3 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-semibold rounded-2xl text-xs cursor-pointer disabled:opacity-50 whitespace-nowrap"
                        >
                            Hint (-10)
                        </button>
                    </div>
                </form>

                {statusMsg && (
                    <p className={`text-xs font-bold ${statusMsg.ok ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {statusMsg.text}
                    </p>
                )}
            </div>
        </div>
    );
};

// ============================================================================
// GAME 4: NUMBER SEQUENCE & PATTERN IQ (80 PLACEMENT APTITUDE SERIES)
// ============================================================================
const PATTERN_PUZZLES = [
    // 1 - 10: N*(N+1), Perfect Squares, Cubes, Primes, Fibonacci
    {
        seq: ['2', '6', '12', '20', '30', '?'],
        options: ['40', '42', '38', '44'],
        answer: '42',
        explanation: 'Pattern is n × (n + 1): 1×2=2, 2×3=6, 3×4=12, 4×5=20, 5×6=30, so 6×7 = 42.'
    },
    {
        seq: ['3', '7', '15', '31', '63', '?'],
        options: ['125', '127', '128', '95'],
        answer: '127',
        explanation: 'Each term doubles and adds 1: (63 × 2) + 1 = 127.'
    },
    {
        seq: ['1', '4', '9', '16', '25', '?'],
        options: ['32', '35', '36', '49'],
        answer: '36',
        explanation: 'Perfect squares: 1², 2², 3², 4², 5², next is 6² = 36.'
    },
    {
        seq: ['2', '3', '5', '7', '11', '13', '?'],
        options: ['15', '17', '19', '21'],
        answer: '17',
        explanation: 'Consecutive prime numbers: the prime after 13 is 17.'
    },
    {
        seq: ['1', '1', '2', '3', '5', '8', '13', '?'],
        options: ['18', '20', '21', '24'],
        answer: '21',
        explanation: 'Fibonacci sequence where each number is the sum of the two preceding ones: 8 + 13 = 21.'
    },
    {
        seq: ['100', '95', '85', '70', '50', '?'],
        options: ['20', '25', '30', '35'],
        answer: '25',
        explanation: 'Differences increase by 5 each step: -5, -10, -15, -20, so 50 - 25 = 25.'
    },
    {
        seq: ['4', '9', '20', '43', '90', '?'],
        options: ['180', '185', '187', '192'],
        answer: '185',
        explanation: 'Pattern is ×2 + 1, ×2 + 2, ×2 + 3, ×2 + 4, so (90 × 2) + 5 = 185.'
    },
    {
        seq: ['1', '8', '27', '64', '125', '?'],
        options: ['196', '216', '225', '256'],
        answer: '216',
        explanation: 'Perfect cubes: 1³, 2³, 3³, 4³, 5³, so 6³ = 216.'
    },
    {
        seq: ['2', '9', '28', '65', '126', '?'],
        options: ['215', '217', '225', '240'],
        answer: '217',
        explanation: 'Pattern is n³ + 1: 1³+1=2, 2³+1=9, 3³+1=28, 4³+1=65, 5³+1=126, so 6³+1 = 217.'
    },
    {
        seq: ['0', '7', '26', '63', '124', '?'],
        options: ['214', '215', '216', '224'],
        answer: '215',
        explanation: 'Pattern is n³ - 1: 1³-1=0, 2³-1=7, 3³-1=26, 4³-1=63, 5³-1=124, so 6³-1 = 215.'
    },

    // 11 - 20: Squares +/- constants and Triangular numbers
    {
        seq: ['2', '5', '10', '17', '26', '?'],
        options: ['35', '37', '39', '41'],
        answer: '37',
        explanation: 'Pattern is n² + 1: 1²+1=2, 2²+1=5, 3²+1=10, 4²+1=17, 5²+1=26, so 6²+1 = 37.'
    },
    {
        seq: ['0', '3', '8', '15', '24', '?'],
        options: ['33', '35', '36', '38'],
        answer: '35',
        explanation: 'Pattern is n² - 1: 1²-1=0, 2²-1=3, 3²-1=8, 4²-1=15, 5²-1=24, so 6²-1 = 35.'
    },
    {
        seq: ['1', '3', '6', '10', '15', '21', '?'],
        options: ['27', '28', '29', '30'],
        answer: '28',
        explanation: 'Triangular numbers (+2, +3, +4, +5, +6, +7): 21 + 7 = 28.'
    },
    {
        seq: ['1', '2', '6', '24', '120', '?'],
        options: ['480', '600', '720', '840'],
        answer: '720',
        explanation: 'Factorial progression (×2, ×3, ×4, ×5, ×6): 120 × 6 = 720.'
    },
    {
        seq: ['5', '11', '23', '47', '95', '?'],
        options: ['189', '191', '193', '195'],
        answer: '191',
        explanation: 'Each term is ×2 + 1: (95 × 2) + 1 = 191.'
    },
    {
        seq: ['6', '11', '21', '41', '81', '?'],
        options: ['151', '161', '163', '171'],
        answer: '161',
        explanation: 'Each term is ×2 - 1 (or differences +5, +10, +20, +40, +80): 81 + 80 = 161.'
    },
    {
        seq: ['17', '19', '23', '29', '31', '?'],
        options: ['33', '35', '37', '39'],
        answer: '37',
        explanation: 'Consecutive prime numbers starting from 17: next prime after 31 is 37.'
    },
    {
        seq: ['41', '43', '47', '53', '59', '?'],
        options: ['61', '63', '65', '67'],
        answer: '61',
        explanation: 'Consecutive prime numbers starting from 41: next prime after 59 is 61.'
    },
    {
        seq: ['121', '144', '169', '196', '225', '?'],
        options: ['246', '256', '266', '289'],
        answer: '256',
        explanation: 'Consecutive squares from 11²: 11², 12², 13², 14², 15², next is 16² = 256.'
    },
    {
        seq: ['12', '20', '30', '42', '56', '?'],
        options: ['68', '70', '72', '76'],
        answer: '72',
        explanation: 'Pattern is 3×4, 4×5, 5×6, 6×7, 7×8, so next is 8×9 = 72.'
    },

    // 21 - 30: Second-order differences (Squares/Primes/Even/Odd steps)
    {
        seq: ['4', '5', '9', '18', '34', '?'],
        options: ['50', '55', '59', '63'],
        answer: '59',
        explanation: 'Differences are consecutive squares (+1², +2², +3², +4², +5²): 34 + 25 = 59.'
    },
    {
        seq: ['10', '11', '19', '46', '110', '?'],
        options: ['210', '225', '235', '250'],
        answer: '235',
        explanation: 'Differences are consecutive cubes (+1³, +2³, +3³, +4³, +5³): 110 + 125 = 235.'
    },
    {
        seq: ['10', '12', '15', '20', '27', '?'],
        options: ['34', '36', '38', '40'],
        answer: '38',
        explanation: 'Differences are prime numbers (+2, +3, +5, +7, +11): 27 + 11 = 38.'
    },
    {
        seq: ['5', '7', '10', '15', '22', '33', '?'],
        options: ['44', '46', '48', '50'],
        answer: '46',
        explanation: 'Prime differences (+2, +3, +5, +7, +11, +13): 33 + 13 = 46.'
    },
    {
        seq: ['3', '8', '15', '24', '35', '?'],
        options: ['46', '48', '50', '52'],
        answer: '48',
        explanation: 'Odd number differences (+5, +7, +9, +11, +13): 35 + 13 = 48.'
    },
    {
        seq: ['7', '13', '21', '31', '43', '?'],
        options: ['55', '57', '59', '61'],
        answer: '57',
        explanation: 'Even number increments (+6, +8, +10, +12, +14): 43 + 14 = 57.'
    },
    {
        seq: ['11', '15', '23', '35', '51', '?'],
        options: ['67', '71', '75', '79'],
        answer: '71',
        explanation: 'Multiples of 4 added (+4, +8, +12, +16, +20): 51 + 20 = 71.'
    },
    {
        seq: ['8', '15', '29', '57', '113', '?'],
        options: ['221', '225', '227', '229'],
        answer: '225',
        explanation: 'Pattern is ×2 - 1 (or +7, +14, +28, +56, +112): 113 + 112 = 225.'
    },
    {
        seq: ['2', '5', '14', '41', '122', '?'],
        options: ['361', '365', '368', '371'],
        answer: '365',
        explanation: 'Pattern is ×3 - 1: (122 × 3) - 1 = 365.'
    },
    {
        seq: ['1', '4', '13', '40', '121', '?'],
        options: ['360', '362', '364', '366'],
        answer: '364',
        explanation: 'Pattern is ×3 + 1: (121 × 3) + 1 = 364.'
    },

    // 31 - 40: Alternating & Interleaved Series
    {
        seq: ['2', '10', '4', '8', '6', '6', '8', '?'],
        options: ['2', '4', '8', '10'],
        answer: '4',
        explanation: 'Two alternating series: odd positions (+2: 2, 4, 6, 8) and even positions (-2: 10, 8, 6, 4).'
    },
    {
        seq: ['5', '20', '10', '17', '15', '14', '20', '?'],
        options: ['10', '11', '12', '25'],
        answer: '11',
        explanation: 'Interleaved series: odd indices +5 (5, 10, 15, 20), even indices -3 (20, 17, 14, 11).'
    },
    {
        seq: ['3', '4', '6', '8', '12', '16', '24', '?'],
        options: ['28', '30', '32', '36'],
        answer: '32',
        explanation: 'Two interleaved doubling series: (3, 6, 12, 24) and (4, 8, 16, 32).'
    },
    {
        seq: ['10', '14', '12', '16', '14', '18', '?'],
        options: ['15', '16', '20', '22'],
        answer: '16',
        explanation: 'Alternating +4 and -2 at each step: 18 - 2 = 16.'
    },
    {
        seq: ['50', '45', '48', '43', '46', '41', '?'],
        options: ['36', '43', '44', '45'],
        answer: '44',
        explanation: 'Alternating -5 and +3 at each step: 41 + 3 = 44.'
    },
    {
        seq: ['2', '6', '3', '9', '6', '18', '15', '?'],
        options: ['12', '30', '45', '48'],
        answer: '45',
        explanation: 'Alternating ×3 and -3 operations: ×3, -3, ×3, -3, ×3, -3, so 15 × 3 = 45.'
    },
    {
        seq: ['4', '8', '5', '10', '7', '14', '11', '?'],
        options: ['18', '20', '22', '24'],
        answer: '22',
        explanation: 'Alternating ×2 and -3 operations: 4×2=8, 8-3=5, 5×2=10, 10-3=7, 7×2=14, 14-3=11, 11×2 = 22.'
    },
    {
        seq: ['1', '5', '3', '7', '5', '9', '7', '?'],
        options: ['9', '10', '11', '13'],
        answer: '11',
        explanation: 'Alternating +4 and -2 operations: 7 + 4 = 11.'
    },
    {
        seq: ['100', '50', '52', '26', '28', '14', '?'],
        options: ['7', '12', '16', '18'],
        answer: '16',
        explanation: 'Alternating ÷2 and +2 operations: 100÷2=50, +2=52, ÷2=26, +2=28, ÷2=14, so 14 + 2 = 16.'
    },
    {
        seq: ['6', '18', '15', '45', '42', '126', '?'],
        options: ['120', '123', '129', '378'],
        answer: '123',
        explanation: 'Alternating ×3 and -3 operations: 6×3=18, -3=15, ×3=45, -3=42, ×3=126, so 126 - 3 = 123.'
    },

    // 41 - 50: Geometric, Halving & Multiplier Progressions
    {
        seq: ['3', '6', '12', '24', '48', '?'],
        options: ['72', '84', '96', '108'],
        answer: '96',
        explanation: 'Geometric series doubling each step (×2): 48 × 2 = 96.'
    },
    {
        seq: ['2', '6', '18', '54', '162', '?'],
        options: ['324', '486', '512', '648'],
        answer: '486',
        explanation: 'Geometric series multiplying by 3 each step: 162 × 3 = 486.'
    },
    {
        seq: ['1024', '512', '256', '128', '64', '?'],
        options: ['16', '24', '32', '48'],
        answer: '32',
        explanation: 'Powers of 2 halving each step (÷2): 64 ÷ 2 = 32.'
    },
    {
        seq: ['720', '120', '24', '6', '2', '?'],
        options: ['0', '1', '2', '3'],
        answer: '1',
        explanation: 'Dividing by decreasing integers (÷6, ÷5, ÷4, ÷3, ÷2): 2 ÷ 2 = 1.'
    },
    {
        seq: ['2', '2', '4', '12', '48', '?'],
        options: ['192', '240', '288', '320'],
        answer: '240',
        explanation: 'Multiplying by consecutive integers (×1, ×2, ×3, ×4, ×5): 48 × 5 = 240.'
    },
    {
        seq: ['4', '6', '12', '30', '90', '?'],
        options: ['270', '300', '315', '360'],
        answer: '315',
        explanation: 'Multipliers increase by 0.5 each step (×1.5, ×2, ×2.5, ×3, ×3.5): 90 × 3.5 = 315.'
    },
    {
        seq: ['8', '4', '4', '6', '12', '?'],
        options: ['24', '30', '36', '48'],
        answer: '30',
        explanation: 'Multipliers increase by 0.5 (×0.5, ×1, ×1.5, ×2, ×2.5): 12 × 2.5 = 30.'
    },
    {
        seq: ['240', '120', '60', '30', '15', '?'],
        options: ['5', '7.5', '8', '10'],
        answer: '7.5',
        explanation: 'Each term is halved (÷2): 15 ÷ 2 = 7.5.'
    },
    {
        seq: ['5', '6', '14', '45', '184', '?'],
        options: ['920', '925', '930', '935'],
        answer: '925',
        explanation: 'Pattern is ×1 + 1, ×2 + 2, ×3 + 3, ×4 + 4, so (184 × 5) + 5 = 925.'
    },
    {
        seq: ['3', '5', '12', '38', '154', '?'],
        options: ['770', '772', '774', '775'],
        answer: '772',
        explanation: 'Pattern is ×1 + 2, ×2 + 2, ×3 + 2, ×4 + 2, so (154 × 5) + 2 = 772.'
    },

    // 51 - 65: Classic Placement Aptitude & Multi-Step Series
    {
        seq: ['2', '3', '8', '27', '112', '?'],
        options: ['560', '565', '570', '575'],
        answer: '565',
        explanation: 'Pattern is ×1 + 1, ×2 + 2, ×3 + 3, ×4 + 4, so (112 × 5) + 5 = 565.'
    },
    {
        seq: ['6', '7', '16', '51', '208', '?'],
        options: ['1040', '1045', '1050', '1055'],
        answer: '1045',
        explanation: 'Pattern is ×1 + 1, ×2 + 2, ×3 + 3, ×4 + 4, so (208 × 5) + 5 = 1045.'
    },
    {
        seq: ['1', '3', '9', '31', '129', '?'],
        options: ['645', '650', '651', '655'],
        answer: '651',
        explanation: 'Pattern is ×1 + 2, ×2 + 3, ×3 + 4, ×4 + 5, so (129 × 5) + 6 = 651.'
    },
    {
        seq: ['15', '16', '20', '29', '45', '?'],
        options: ['65', '70', '75', '81'],
        answer: '70',
        explanation: 'Adding consecutive squares (+1², +2², +3², +4², +5²): 45 + 25 = 70.'
    },
    {
        seq: ['90', '89', '85', '76', '60', '?'],
        options: ['35', '40', '44', '45'],
        answer: '35',
        explanation: 'Subtracting consecutive squares (-1², -2², -3², -4², -5²): 60 - 25 = 35.'
    },
    {
        seq: ['12', '14', '18', '26', '42', '?'],
        options: ['58', '64', '74', '84'],
        answer: '74',
        explanation: 'Differences double every step (+2, +4, +8, +16, +32): 42 + 32 = 74.'
    },
    {
        seq: ['100', '97', '91', '82', '70', '?'],
        options: ['52', '55', '57', '60'],
        answer: '55',
        explanation: 'Subtracting multiples of 3 (-3, -6, -9, -12, -15): 70 - 15 = 55.'
    },
    {
        seq: ['7', '14', '28', '56', '112', '?'],
        options: ['196', '214', '224', '248'],
        answer: '224',
        explanation: 'Doubling progression (×2): 112 × 2 = 224.'
    },
    {
        seq: ['2', '4', '7', '12', '19', '30', '?'],
        options: ['41', '43', '45', '47'],
        answer: '43',
        explanation: 'Differences are prime numbers (+2, +3, +5, +7, +11, +13): 30 + 13 = 43.'
    },
    {
        seq: ['1', '2', '4', '7', '11', '16', '?'],
        options: ['21', '22', '23', '24'],
        answer: '22',
        explanation: 'Differences increase by 1 (+1, +2, +3, +4, +5, +6): 16 + 6 = 22.'
    },
    {
        seq: ['3', '5', '9', '17', '33', '?'],
        options: ['63', '65', '66', '67'],
        answer: '65',
        explanation: 'Differences are powers of 2 (+2, +4, +8, +16, +32): 33 + 32 = 65.'
    },
    {
        seq: ['4', '7', '13', '25', '49', '?'],
        options: ['95', '97', '98', '99'],
        answer: '97',
        explanation: 'Pattern is ×2 - 1 (or +3, +6, +12, +24, +48): 49 + 48 = 97.'
    },
    {
        seq: ['9', '17', '33', '65', '129', '?'],
        options: ['255', '257', '258', '259'],
        answer: '257',
        explanation: 'Pattern is ×2 - 1: (129 × 2) - 1 = 257.'
    },
    {
        seq: ['1', '3', '7', '13', '21', '31', '?'],
        options: ['41', '43', '45', '47'],
        answer: '43',
        explanation: 'Even differences (+2, +4, +6, +8, +10, +12): 31 + 12 = 43.'
    },
    {
        seq: ['2', '8', '18', '32', '50', '?'],
        options: ['64', '68', '72', '78'],
        answer: '72',
        explanation: 'Pattern is 2 × n²: 2×1², 2×2², 2×3², 2×4², 2×5², so 2 × 6² = 72.'
    },

    // 66 - 80: Tribonacci, Digit Sums, Fractional & Advanced Series
    {
        seq: ['1', '1', '2', '4', '7', '13', '24', '?'],
        options: ['42', '44', '46', '48'],
        answer: '44',
        explanation: 'Tribonacci sequence (sum of previous 3 terms): 7 + 13 + 24 = 44.'
    },
    {
        seq: ['2', '3', '5', '10', '20', '40', '?'],
        options: ['60', '75', '80', '100'],
        answer: '80',
        explanation: 'Each term equals the sum of all preceding terms: 2+3+5+10+20+40 = 80.'
    },
    {
        seq: ['3', '4', '7', '11', '18', '29', '?'],
        options: ['43', '45', '47', '49'],
        answer: '47',
        explanation: 'Lucas-style Fibonacci sum of two preceding terms: 18 + 29 = 47.'
    },
    {
        seq: ['5', '8', '13', '21', '34', '55', '?'],
        options: ['79', '84', '89', '94'],
        answer: '89',
        explanation: 'Fibonacci sequence continuation: 34 + 55 = 89.'
    },
    {
        seq: ['13', '16', '22', '26', '38', '?'],
        options: ['48', '52', '56', '62'],
        answer: '62',
        explanation: 'Add the product of a number’s own digits: 13+(1×3)=16, 16+(1×6)=22, 22+(2×2)=26, 26+(2×6)=38, so 38+(3×8) = 62.'
    },
    {
        seq: ['11', '13', '17', '25', '32', '?'],
        options: ['35', '37', '39', '41'],
        answer: '37',
        explanation: 'Each step adds the sum of digits of the current number: 32 + (3 + 2) = 37.'
    },
    {
        seq: ['19', '29', '40', '44', '52', '?'],
        options: ['57', '59', '61', '63'],
        answer: '59',
        explanation: 'Add the sum of digits at each step: 19+10=29, 29+11=40, 40+4=44, 44+8=52, so 52 + (5+2) = 59.'
    },
    {
        seq: ['6', '24', '60', '120', '210', '?'],
        options: ['300', '324', '336', '360'],
        answer: '336',
        explanation: 'Pattern is n³ - n: 2³-2=6, 3³-3=24, 4³-4=60, 5³-5=120, 6³-6=210, so 7³-7 = 336.'
    },
    {
        seq: ['2', '10', '30', '68', '130', '?'],
        options: ['216', '220', '222', '226'],
        answer: '222',
        explanation: 'Pattern is n³ + n: 1³+1=2, 2³+2=10, 3³+3=30, 4³+4=68, 5³+5=130, so 6³+6 = 222.'
    },
    {
        seq: ['14', '28', '20', '40', '32', '64', '?'],
        options: ['52', '56', '72', '128'],
        answer: '56',
        explanation: 'Alternating ×2 and -8 operations: 14×2=28, -8=20, ×2=40, -8=32, ×2=64, so 64 - 8 = 56.'
    },
    {
        seq: ['8', '24', '12', '36', '18', '54', '?'],
        options: ['24', '27', '36', '108'],
        answer: '27',
        explanation: 'Alternating ×3 and ÷2 operations: 8×3=24, ÷2=12, ×3=36, ÷2=18, ×3=54, so 54 ÷ 2 = 27.'
    },
    {
        seq: ['9', '27', '31', '155', '161', '1127', '?'],
        options: ['1133', '1135', '1137', '1139'],
        answer: '1135',
        explanation: 'Alternating × and + with odd numbers (×3, +4, ×5, +6, ×7, +8): 1127 + 8 = 1135.'
    },
    {
        seq: ['25', '36', '49', '64', '81', '?'],
        options: ['90', '96', '100', '121'],
        answer: '100',
        explanation: 'Squares of consecutive integers: 5², 6², 7², 8², 9², so 10² = 100.'
    },
    {
        seq: ['4', '16', '36', '64', '100', '?'],
        options: ['121', '144', '169', '196'],
        answer: '144',
        explanation: 'Squares of even numbers: 2², 4², 6², 8², 10², so 12² = 144.'
    },
    {
        seq: ['1', '9', '25', '49', '81', '?'],
        options: ['100', '111', '121', '144'],
        answer: '121',
        explanation: 'Squares of odd numbers: 1², 3², 5², 7², 9², so 11² = 121.'
    }
];

const PatternIqGame = ({ onSaveHighScore, highScore }) => {
    const [deck, setDeck] = useState(() => shuffleArray(PATTERN_PUZZLES));
    const [qIdx, setQIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [selected, setSelected] = useState(null);

    const puzzle = deck[qIdx % deck.length];

    const handleChoose = (opt) => {
        if (selected !== null) return;
        setSelected(opt);
        if (opt === puzzle.answer) {
            const nextScore = score + 30;
            setScore(nextScore);
            onSaveHighScore(nextScore);
        }
    };

    const nextPuzzle = () => {
        setSelected(null);
        setQIdx((i) => i + 1);
    };

    const handleResetAndShuffle = () => {
        setDeck(shuffleArray(PATTERN_PUZZLES));
        setScore(0);
        setSelected(null);
        setQIdx(0);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-6">
                    <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">IQ Score</span>
                        <span className="text-2xl font-bold text-slate-800">{score}</span>
                    </div>
                    <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">Pattern Pool</span>
                        <span className="text-xl font-bold text-amber-600">#{(qIdx % deck.length) + 1} / {deck.length}</span>
                    </div>
                    <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">Best Score</span>
                        <span className="text-xl font-bold text-[#5899B5]">{Math.max(highScore, score)}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={nextPuzzle}
                        className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer transition"
                    >
                        Skip Series →
                    </button>
                    <button
                        type="button"
                        onClick={handleResetAndShuffle}
                        className="px-4 py-2 bg-[#5899B5] hover:bg-[#3D7690] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer transition"
                    >
                        <RotateCcw size={14} /> Shuffle {deck.length} Series
                    </button>
                </div>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-slate-50/60 border border-slate-100 text-center space-y-6">
                <span className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-purple-50 text-purple-700">
                    Find the Missing Number in the Sequence
                </span>

                {/* Visual Cartoon Number Sequence Blocks */}
                <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 py-2">
                    {puzzle.seq.map((num, idx) => {
                        const isTarget = num === '?';
                        return (
                            <div
                                key={idx}
                                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 border-slate-800 flex items-center justify-center font-mono text-lg sm:text-xl font-black shadow-xs ${
                                    isTarget ? 'bg-amber-300 text-slate-900' : 'bg-white text-slate-800'
                                }`}
                            >
                                {isTarget && selected ? selected : num}
                            </div>
                        );
                    })}
                </div>

                {/* Options */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
                    {puzzle.options.map((opt) => {
                        const isPicked = selected === opt;
                        const isRight = opt === puzzle.answer;
                        let btnStyle = 'bg-white hover:bg-blue-50 border-slate-200 text-slate-800';
                        if (selected !== null) {
                            if (isRight) btnStyle = 'bg-emerald-500 border-emerald-600 text-white';
                            else if (isPicked) btnStyle = 'bg-rose-500 border-rose-600 text-white';
                        }

                        return (
                            <button
                                key={opt}
                                type="button"
                                disabled={selected !== null}
                                onClick={() => handleChoose(opt)}
                                className={`py-3.5 px-4 rounded-2xl border-2 font-mono text-lg font-bold transition cursor-pointer ${btnStyle}`}
                            >
                                {opt}
                            </button>
                        );
                    })}
                </div>

                {selected !== null && (
                    <div className={`p-4 rounded-2xl border text-left max-w-lg mx-auto flex items-start justify-between gap-4 ${
                        selected === puzzle.answer
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                            : 'bg-rose-50 border-rose-200 text-rose-800'
                    }`}>
                        <div className="space-y-1 text-xs sm:text-sm">
                            <p className="font-bold">
                                {selected === puzzle.answer ? 'Spot On! (+30 pts)' : `Incorrect — Answer is ${puzzle.answer}`}
                            </p>
                            <p className="text-xs opacity-90">{puzzle.explanation}</p>
                        </div>
                        <button
                            type="button"
                            onClick={nextPuzzle}
                            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shrink-0 cursor-pointer"
                        >
                            Next →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// ============================================================================
// MAIN STUDENT GAMES TAB
// ============================================================================
const GAMES_LIST = [
    {
        id: 'math-blitz',
        title: 'Speed Math Blitz',
        category: 'Quantitative Aptitude',
        badge: '45s Timer',
        badgeColor: 'bg-blue-50 text-[#5899B5] border-blue-100',
        description: 'Race against a 45-second clock solving mental arithmetic, squares, and percentages to build your streak multiplier.'
    },
    {
        id: 'memory-matrix',
        title: 'Tech Memory Matrix',
        category: 'Visual Working Memory',
        badge: '8 Tech Pairs',
        badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        description: 'Flip and match pairs of custom cartoon tech icons in the fewest moves possible to maximize your memory score.'
    },
    {
        id: 'word-cipher',
        title: 'Code & Logic Decipher',
        category: 'CS Terminology',
        badge: '80+ CS Words',
        badgeColor: 'bg-amber-50 text-amber-700 border-amber-100',
        description: 'Unscramble 80+ computer science, DSA, OS, DBMS, networking, and placement terms from technical clues and letter tiles.'
    },
    {
        id: 'pattern-iq',
        title: 'Number Pattern IQ',
        category: 'Logical Reasoning',
        badge: '80 IQ Series',
        badgeColor: 'bg-purple-50 text-purple-700 border-purple-100',
        description: 'Crack 80 randomized placement-style number series and progression puzzles with instant step-by-step explanations.'
    }
];

const StudentGamesTab = ({ student }) => {
    const storageKey = `eth_student_games_${student?.usn || 'guest'}`;
    const [activeGameId, setActiveGameId] = useState(null);
    const [highScores, setHighScores] = useState(() => {
        try {
            const raw = localStorage.getItem(storageKey);
            return raw ? JSON.parse(raw) : {};
        } catch {
            return {};
        }
    });

    const saveHighScore = useCallback((gameId, newScore) => {
        setHighScores((prev) => {
            const currentBest = prev[gameId] || 0;
            if (newScore <= currentBest) return prev;
            const updated = { ...prev, [gameId]: newScore };
            try {
                localStorage.setItem(storageKey, JSON.stringify(updated));
            } catch {
                // ignore storage errors
            }
            return updated;
        });
    }, [storageKey]);

    const totalArcadePoints = Object.values(highScores).reduce((sum, v) => sum + (Number(v) || 0), 0);
    const activeGameMeta = GAMES_LIST.find((g) => g.id === activeGameId);

    return (
        <div className="space-y-8 font-sans">
            {/* Top Hub Header Card */}
            <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="space-y-2.5 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-50 text-[#5899B5] border border-blue-100">
                            Student Skill Arcade
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-100">
                            “My Brain Is Not Braining” Mode ⚡
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-100">
                            Total Best Score: {totalArcadePoints} pts
                        </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-semibold text-slate-800">
                        My Brain Is Not Braining? Let’s Lock In.
                    </h2>
                    <p className="text-slate-500 text-sm leading-relaxed">
                        Take a quick brain-recharge break — sharpen your quantitative speed, working memory, CS vocabulary, and logical reasoning with 4 interactive mini-games.
                    </p>
                </div>
                <GameCardSvg type="hub" className="w-60 h-32 shrink-0 hidden sm:block" />
            </div>

            {activeGameId && activeGameMeta ? (
                <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-8 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => setActiveGameId(null)}
                                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                                title="Back to All Games"
                            >
                                <ArrowLeft size={18} />
                            </button>
                            <div>
                                <span className={`inline-block text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${activeGameMeta.badgeColor}`}>
                                    {activeGameMeta.category}
                                </span>
                                <h3 className="text-xl font-semibold text-slate-800 mt-1">{activeGameMeta.title}</h3>
                            </div>
                        </div>
                        <GameCardSvg type={activeGameMeta.id} className="w-40 h-24 shrink-0 hidden md:block" />
                    </div>

                    {activeGameId === 'math-blitz' && (
                        <SpeedMathBlitzGame
                            highScore={highScores['math-blitz'] || 0}
                            onSaveHighScore={(s) => saveHighScore('math-blitz', s)}
                        />
                    )}
                    {activeGameId === 'memory-matrix' && (
                        <TechMemoryMatrixGame
                            highScore={highScores['memory-matrix'] || 0}
                            onSaveHighScore={(s) => saveHighScore('memory-matrix', s)}
                        />
                    )}
                    {activeGameId === 'word-cipher' && (
                        <CodeLogicDecipherGame
                            highScore={highScores['word-cipher'] || 0}
                            onSaveHighScore={(s) => saveHighScore('word-cipher', s)}
                        />
                    )}
                    {activeGameId === 'pattern-iq' && (
                        <PatternIqGame
                            highScore={highScores['pattern-iq'] || 0}
                            onSaveHighScore={(s) => saveHighScore('pattern-iq', s)}
                        />
                    )}
                </div>
            ) : (
                /* 4 Games Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {GAMES_LIST.map((game) => {
                        const best = highScores[game.id] || 0;
                        return (
                            <div
                                key={game.id}
                                className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-7 hover:shadow-md hover:border-[#5899B5]/30 transition-all duration-300 flex flex-col justify-between gap-6 group"
                            >
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="space-y-2 flex-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border ${game.badgeColor}`}>
                                                {game.category}
                                            </span>
                                            <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                                                {game.badge}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-semibold text-slate-800 group-hover:text-[#5899B5] transition-colors">
                                            {game.title}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                                            {game.description}
                                        </p>
                                    </div>
                                    <GameCardSvg type={game.id} className="w-40 h-28 shrink-0 mx-auto sm:mx-0" />
                                </div>

                                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                                        <Trophy size={15} className="text-amber-500" />
                                        <span>High Score: <strong className="text-slate-800">{best} pts</strong></span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setActiveGameId(game.id)}
                                        className="px-5 py-2.5 bg-[#5899B5] hover:bg-[#3D7690] text-white text-xs font-semibold rounded-xl flex items-center gap-2 cursor-pointer transition shadow-xs"
                                    >
                                        <Play size={14} /> Play Game
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default StudentGamesTab;

