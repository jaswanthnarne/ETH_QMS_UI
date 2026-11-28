import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import axios from 'axios';
import { ShieldAlert, LogIn, Sparkles, MonitorX } from 'lucide-react';
import useStudentAuthStore from '../../store/studentAuthStore';
import useAuthStore from '../../store/authStore';

const SARCASTIC_EVICTION_QUOTES = [
    {
        badge: 'CLONE DETECTED • MAX 1 LOGIN ALLOWED',
        title: 'Plot Twist: You Just Kicked Yourself Out.',
        bubbleLeft: 'WAIT, THAT’S ME?!',
        bubbleRight: 'BYE TWIN, MY TURN 💀',
        message:
            'A shiny new login was detected on another device, which means this older session has officially lost the Hunger Games. Unless you unlocked shadow-clone jutsu, only 1 active login is allowed!',
        subtext:
            'Want this screen back? Log in again below (and watch the other device get yeeted into orbit too).',
    },
    {
        badge: 'EVICTED • 1 HUMAN = 1 SESSION',
        title: 'Whoa There, Multiverse Traveler! One Device At A Time.',
        bubbleLeft: 'BRO MY EXAM?!',
        bubbleRight: 'NEW TAB WHO DIS ⚡',
        message:
            'Your account just signed in somewhere else. Our strict 1-login-per-human policy has retired this tab Effective Immediately™.',
        subtext:
            'If that wasn’t you, your "friend" who borrowed your password is currently speedrunning your account. Go change it!',
    },
    {
        badge: 'SESSION HIJACKED BY… YOU? • SINGLE LOGIN POLICY',
        title: 'Nice Try, Twin! You Can’t Be In Two Places At Once.',
        bubbleLeft: 'I GOT YEETED 💀',
        bubbleRight: 'IMPOSTOR WINS 👑',
        message:
            'Someone (hopefully you) just logged in with your credentials on another browser or device, so we politely booted this session out the door.',
        subtext:
            'Pro tip: Sharing your account during placement season is a fast track to emotional damage.',
    },
];

// Decode JWT payload safely to read sessionId
const parseJwtSessionId = (token) => {
    if (!token || typeof token !== 'string') return null;
    try {
        const base64Url = token.split('.')[1];
        if (!base64Url) return null;
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));
        return payload?.sessionId || null;
    } catch {
        return null;
    }
};

export const triggerSessionReplacedEvent = (role = 'student', evictedToken = null) => {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(
            new CustomEvent('ethnotech:session-replaced', {
                detail: { role, evictedToken },
            })
        );
    }
};

/**
 * Hand-Drawn Doodle Crew Eviction Scene:
 * - Animated SVG turbulence "line-boil" filter (like a hand-drawn sketchbook cartoon)
 * - Left: Shocked Doodle Yeti / Student getting booted with dizzy X-eyes, flying coffee mug & speech bubble
 * - Center: Giant hand-drawn comic "BOOT! / 1 LOGIN ONLY" kick cloud + lightning bolt
 * - Right: Smug Doodle Cat / Impostor Twin wearing crown & sunglasses at the new laptop
 * - Floating interactive doodle flames, bolts, stars & hearts that pop when clicked!
 */
const SarcasticDoodleEvictionScene = ({ bubbleLeft = 'I GOT YEETED 💀', bubbleRight = 'MY TURN BRO ⚡' }) => {
    const [boilFrame, setBoilFrame] = useState(0);
    const [pokedChar, setPokedChar] = useState(null); // 'left' | 'right' | null

    useEffect(() => {
        const timer = setInterval(() => {
            setBoilFrame((prev) => (prev + 1) % 3);
        }, 140);
        return () => clearInterval(timer);
    }, []);

    const handlePoke = (side) => {
        setPokedChar(side);
        setTimeout(() => setPokedChar(null), 700);
    };

    return (
        <div className="relative w-full pt-2 pb-1 select-none">
            <svg
                viewBox="0 0 420 175"
                className="w-full max-w-[420px] h-44 mx-auto overflow-visible"
                role="img"
                aria-label="Hand-drawn doodle cartoon of a new login kicking out the old session"
            >
                <defs>
                    {/* 3-Frame Hand-Drawn Sketchbook Line-Boil Filter */}
                    {[0, 1, 2].map((k) => (
                        <filter key={k} id={`evict-boil-${k}`} x="-12%" y="-12%" width="124%" height="124%">
                            <feTurbulence
                                type="fractalNoise"
                                baseFrequency="0.032"
                                numOctaves="2"
                                seed={k * 9 + 5}
                                result="noise"
                            />
                            <feDisplacementMap
                                in="SourceGraphic"
                                in2="noise"
                                scale="2.1"
                                xChannelSelector="R"
                                yChannelSelector="G"
                            />
                        </filter>
                    ))}

                    {/* Sketchbook Diagonal Ink Hatch Pattern */}
                    <pattern
                        id="evict-hatch"
                        width="5"
                        height="5"
                        patternUnits="userSpaceOnUse"
                        patternTransform="rotate(35)"
                    >
                        <line x1="0" y1="0" x2="0" y2="5" stroke="#0F172A" strokeWidth="1.2" strokeOpacity="0.22" />
                    </pattern>
                </defs>

                {/* Floating Hand-Drawn Doodles in Background (Flames, Stars, Bolts, Sandwich) */}
                <g className="opacity-95">
                    {/* Floating Doodle Flame Top Left */}
                    <motion.g
                        animate={{ y: [0, -7, 0], rotate: [-8, 6, -8] }}
                        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                        transform="translate(26, 36)"
                    >
                        <path
                            d="M0 13 C-8 13 -11 5 -9 0 C-7 -5 -3 -6 -3 -11 C1 -8 3 -4 2 -1 C4 -3 5 -5 5 -7 C9 -2 10 4 7 9 C5 11 3 13 0 13 Z"
                            fill="#FF7A1A"
                            stroke="#0F172A"
                            strokeWidth="2"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M0 10.5 C-3.5 10.5 -5 7 -4 4 C-3 1.5 -1 1 -1 -2.5 C1.5 -1 3 2.5 2.5 5.5 C4 5 5 8 0 10.5 Z"
                            fill="#FFD23F"
                        />
                    </motion.g>

                    {/* Floating Doodle Lightning Bolt Top Center */}
                    <motion.g
                        animate={{ y: [0, 6, 0], scale: [1, 1.12, 1] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                        transform="translate(208, 22)"
                    >
                        <path
                            d="M3 -13 L-8 2 L-1 2 L-4 13 L8 -3 L1 -3 Z"
                            fill="#FFD23F"
                            stroke="#0F172A"
                            strokeWidth="2"
                            strokeLinejoin="round"
                        />
                    </motion.g>

                    {/* Floating Doodle Star Top Right */}
                    <motion.g
                        animate={{ y: [0, -6, 0], rotate: [0, 18, 0] }}
                        transition={{ duration: 3.1, repeat: Infinity, ease: 'easeInOut' }}
                        transform="translate(392, 36)"
                    >
                        <path
                            d="M0 -11 L3 -3.8 L11 -3.5 L5 1.8 L7 10 L0 5.5 L-7 10 L-5 1.8 L-11 -3.5 L-3 -3.8 Z"
                            fill="#FFD23F"
                            stroke="#0F172A"
                            strokeWidth="2"
                            strokeLinejoin="round"
                        />
                    </motion.g>

                    {/* Floating Doodle Sparkle Left-Bottom */}
                    <motion.g
                        animate={{ scale: [0.85, 1.15, 0.85], rotate: [0, 15, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                        transform="translate(18, 122)"
                    >
                        <path
                            d="M0 -10 C1 -3 3 -1 10 0 C3 1 1 3 0 10 C-1 3 -3 1 -10 0 C-3 -1 -1 -3 0 -10 Z"
                            fill="#8FDCFF"
                            stroke="#0F172A"
                            strokeWidth="1.8"
                            strokeLinejoin="round"
                        />
                    </motion.g>

                    {/* Floating Doodle Heart Right-Bottom */}
                    <motion.g
                        animate={{ y: [0, -5, 0], rotate: [8, -8, 8] }}
                        transition={{ duration: 2.7, repeat: Infinity, ease: 'easeInOut' }}
                        transform="translate(402, 118) scale(0.82)"
                    >
                        <path
                            d="M0 10 C-5 5 -11 1 -11 -4 C-11 -9 -7 -11 -3.5 -9.5 C-1.5 -8.5 -0.8 -7 0 -5 C0.8 -7 1.5 -8.5 3.5 -9.5 C7 -11 11 -9 11 -4 C11 1 5 5 0 10 Z"
                            fill="#FF5C7A"
                            stroke="#0F172A"
                            strokeWidth="2.2"
                            strokeLinejoin="round"
                        />
                    </motion.g>
                </g>

                {/* Main Boiling Hand-Drawn Sketch Layer */}
                <g filter={`url(#evict-boil-${boilFrame})`}>
                    {/* Hand-Drawn Sketchbook Ground Line, Grass Tufts & Pebbles */}
                    <path
                        d="M 18 154 Q 85 151 150 155 T 285 153 T 402 155"
                        fill="none"
                        stroke="#0F172A"
                        strokeWidth="2.8"
                        strokeLinecap="round"
                    />
                    <path
                        d="M 38 154 l 2 -7 M 42 154 l 1 -10 M 46 154 l -1 -6 M 195 154 l 2 -8 M 199 154 l 1 -11 M 365 154 l 2 -7 M 369 154 l -1 -9"
                        fill="none"
                        stroke="#0F172A"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                    <ellipse cx="75" cy="161" rx="4" ry="2.2" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.8" />
                    <ellipse cx="235" cy="162" rx="5" ry="2.5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.8" />
                    <ellipse cx="332" cy="160" rx="3.5" ry="2" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.8" />

                    {/* ============================================================
                        LEFT CHARACTER: DIZZY YEETED DOODLE YETI (OLD SESSION)
                       ============================================================ */}
                    <g
                        onClick={() => handlePoke('left')}
                        style={{ cursor: 'pointer' }}
                        transform={`translate(98, 150) ${
                            pokedChar === 'left' ? 'translate(0, -14) rotate(-18)' : 'rotate(-10)'
                        }`}
                    >
                        {/* Ground shadow */}
                        <ellipse cx="-4" cy="4" rx="44" ry="5" fill="#0F172A" fillOpacity="0.22" />

                        {/* Yeti Horns */}
                        <path
                            d="M-24 -86 C-34 -94 -38 -105 -34 -116 C-26 -108 -18 -102 -10 -95 Z"
                            fill="#FFD23F"
                            stroke="#0F172A"
                            strokeWidth="2.4"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M14 -94 C22 -104 30 -109 40 -112 C38 -100 34 -91 26 -83 Z"
                            fill="#FFD23F"
                            stroke="#0F172A"
                            strokeWidth="2.4"
                            strokeLinejoin="round"
                        />

                        {/* Yeti Body */}
                        <path
                            d="M-36 -2 C-45 -24 -45 -56 -35 -76 C-26 -94 -11 -100 2 -100 C18 -100 34 -91 40 -74 C48 -54 48 -24 40 -2 C24 3 -22 3 -36 -2 Z"
                            fill="#FFFFFF"
                            stroke="#0F172A"
                            strokeWidth="2.6"
                            strokeLinejoin="round"
                        />
                        {/* Sketchbook Ink Hatching on Yeti */}
                        <path
                            d="M28 -84 C42 -56 42 -25 36 -4 C30 -2 24 -1 20 0 C30 -25 31 -54 22 -86 Z"
                            fill="url(#evict-hatch)"
                        />

                        {/* Yeti Messenger Strap & "YEETED" Badge */}
                        <path
                            d="M-39 -52 C-18 -42 8 -26 41 -21 M-41 -44 C-20 -34 6 -18 41 -13"
                            fill="none"
                            stroke="#0F172A"
                            strokeWidth="2.4"
                        />
                        <rect
                            x="-14"
                            y="-38"
                            width="34"
                            height="14"
                            rx="3"
                            transform="rotate(18 -2 -31)"
                            fill="#FF5C7A"
                            stroke="#0F172A"
                            strokeWidth="2.2"
                        />
                        <text
                            x="3"
                            y="-28"
                            transform="rotate(18 -2 -31)"
                            textAnchor="middle"
                            fontSize="7"
                            fontWeight="900"
                            fill="#FFFFFF"
                        >
                            401 💀
                        </text>

                        {/* Flailing Arms */}
                        <path
                            d="M-36 -52 C-54 -64 -58 -82 -46 -90 C-40 -93 -34 -87 -36 -78"
                            fill="#FFFFFF"
                            stroke="#0F172A"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                        />
                        <path
                            d="M38 -50 C54 -62 56 -78 46 -86 C40 -89 34 -83 36 -75"
                            fill="#FFFFFF"
                            stroke="#0F172A"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                        />

                        {/* Dizzy X-Eyes (Because This Session Just Got Knocked Out!) */}
                        <circle cx="-12" cy="-72" r="8" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.4" />
                        <path
                            d="M-15.5 -75.5 L-8.5 -68.5 M-8.5 -75.5 L-15.5 -68.5"
                            stroke="#DC2626"
                            strokeWidth="2.6"
                            strokeLinecap="round"
                        />
                        <circle cx="12" cy="-74" r="8" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.4" />
                        <path
                            d="M8.5 -77.5 L15.5 -70.5 M15.5 -77.5 L8.5 -70.5"
                            stroke="#DC2626"
                            strokeWidth="2.6"
                            strokeLinecap="round"
                        />

                        {/* Shocked Wavy Mouth & Sticking-Out Tongue */}
                        <path
                            d="M-10 -54 Q0 -62 10 -54 Q0 -44 -10 -54 Z"
                            fill="#0F172A"
                            stroke="#0F172A"
                            strokeWidth="2"
                        />
                        <path
                            d="M-4 -52 C-4 -43 5 -43 5 -52 Z"
                            fill="#FF5C7A"
                            stroke="#0F172A"
                            strokeWidth="1.8"
                        />

                        {/* Flying Coffee Cup & Yeeted Laptop Mid-Air on Left */}
                        <g transform="translate(-56, -34) rotate(-28)">
                            <rect
                                x="-18"
                                y="-12"
                                width="32"
                                height="22"
                                rx="4"
                                fill="#FEE2E2"
                                stroke="#0F172A"
                                strokeWidth="2.2"
                            />
                            <text x="-2" y="2" textAnchor="middle" fontSize="6.8" fontWeight="900" fill="#DC2626">
                                BYE!
                            </text>
                            <rect
                                x="-22"
                                y="10"
                                width="40"
                                height="5"
                                rx="2.5"
                                fill="#94A3B8"
                                stroke="#0F172A"
                                strokeWidth="2"
                            />
                        </g>

                        {/* Comic Speech Bubble Above Left Yeti */}
                        <g transform="translate(-8, -124) rotate(8)">
                            <rect
                                x="-54"
                                y="-22"
                                width="108"
                                height="24"
                                rx="12"
                                fill="#FFFFFF"
                                stroke="#0F172A"
                                strokeWidth="2.4"
                            />
                            <path
                                d="M-8 2 L-2 11 L6 2 Z"
                                fill="#FFFFFF"
                                stroke="#0F172A"
                                strokeWidth="2.2"
                                strokeLinejoin="round"
                            />
                            <text x="0" y="-7" textAnchor="middle" fontSize="8.2" fontWeight="900" fill="#DC2626">
                                {bubbleLeft}
                            </text>
                        </g>
                    </g>

                    {/* ============================================================
                        CENTER: GIANT COMIC "YEET / MAX 1 LOGIN" KICK IMPACT
                       ============================================================ */}
                    <g transform="translate(212, 96)">
                        {/* Motion Speed Lines */}
                        <path
                            d="M 48 -18 L -38 -24 M 52 0 L -45 0 M 46 18 L -34 22"
                            stroke="#FFD23F"
                            strokeWidth="3.2"
                            strokeLinecap="round"
                            strokeDasharray="10 6"
                        />

                        {/* Cartoon Comic Starburst Impact Badge */}
                        <polygon
                            points="0,-36 11,-24 28,-30 22,-13 38,-4 23,8 30,24 12,21 2,35 -10,21 -28,25 -21,9 -36,-2 -21,-13 -27,-29 -10,-24"
                            fill="#FFD23F"
                            stroke="#0F172A"
                            strokeWidth="2.5"
                            strokeLinejoin="round"
                        />
                        <text x="0" y="-3" textAnchor="middle" fontSize="9.5" fontWeight="900" fill="#0F172A">
                            YEET!
                        </text>
                        <text x="0" y="9" textAnchor="middle" fontSize="7.2" fontWeight="900" fill="#B45309">
                            1 LOGIN MAX
                        </text>
                    </g>

                    {/* ============================================================
                        RIGHT CHARACTER: SMUG CROWNED DOODLE CAT & KID (NEW LOGIN)
                       ============================================================ */}
                    <g
                        onClick={() => handlePoke('right')}
                        style={{ cursor: 'pointer' }}
                        transform={`translate(326, 150) ${
                            pokedChar === 'right' ? 'translate(0, -14) scale(1.05)' : ''
                        }`}
                    >
                        {/* Ground shadow */}
                        <ellipse cx="0" cy="4" rx="46" ry="5" fill="#0F172A" fillOpacity="0.22" />

                        {/* Waving Cat Tail */}
                        <path
                            d="M20 -6 C42 -6 52 -24 46 -44 C44 -50 36 -52 34 -45 C40 -30 34 -16 18 -14 Z"
                            fill="#FFFFFF"
                            stroke="#0F172A"
                            strokeWidth="2.4"
                        />

                        {/* Doodle Cat Body */}
                        <path
                            d="M-22 0 C-28 -18 -24 -42 -14 -52 L14 -52 C24 -42 28 -18 22 0 C10 3 -10 3 -22 0 Z"
                            fill="#FFFFFF"
                            stroke="#0F172A"
                            strokeWidth="2.5"
                        />
                        <path
                            d="M14 -46 C24 -36 26 -16 22 0 C18 1 14 2 12 2 C16 -14 16 -32 10 -46 Z"
                            fill="url(#evict-hatch)"
                        />

                        {/* Bandana Scarf */}
                        <path
                            d="M-18 -54 C-6 -48 6 -48 18 -54 L17 -45 C6 -39 -6 -39 -17 -45 Z"
                            fill="#FF7A1A"
                            stroke="#0F172A"
                            strokeWidth="2.2"
                        />

                        {/* Cat Ears & Head */}
                        <path
                            d="M-22 -84 L-26 -106 L-7 -95 Z M8 -95 L24 -107 L22 -84 Z"
                            fill="#FFFFFF"
                            stroke="#0F172A"
                            strokeWidth="2.5"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M-26 -70 C-28 -88 -16 -98 0 -98 C16 -98 28 -88 26 -70 C24 -56 12 -50 0 -50 C-12 -50 -24 -56 -26 -70 Z"
                            fill="#FFFFFF"
                            stroke="#0F172A"
                            strokeWidth="2.5"
                        />

                        {/* Golden King Crown on Top of New Session Cat */}
                        <polygon
                            points="-15,-97 -18,-115 -6,-106 0,-118 6,-106 18,-115 15,-97"
                            fill="#FFD23F"
                            stroke="#0F172A"
                            strokeWidth="2.2"
                            strokeLinejoin="round"
                        />

                        {/* Cool Deal-With-It Sunglasses on Smug New Device Cat */}
                        <rect
                            x="-21"
                            y="-82"
                            width="18"
                            height="11"
                            rx="2.5"
                            fill="#0F172A"
                            stroke="#0F172A"
                            strokeWidth="2"
                        />
                        <rect
                            x="3"
                            y="-82"
                            width="18"
                            height="11"
                            rx="2.5"
                            fill="#0F172A"
                            stroke="#0F172A"
                            strokeWidth="2"
                        />
                        <line x1="-3" y1="-77" x2="3" y2="-77" stroke="#0F172A" strokeWidth="2.5" />
                        {/* Glint on shades */}
                        <line x1="-18" y1="-79" x2="-13" y2="-74" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
                        <line x1="6" y1="-79" x2="11" y2="-74" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />

                        {/* Smug Cat Grin & Whiskers */}
                        <path
                            d="M-7 -63 Q0 -57 8 -64"
                            fill="none"
                            stroke="#0F172A"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                        />
                        <path
                            d="M-18 -67 L-31 -69 M-18 -63 L-30 -60 M18 -67 L31 -69 M18 -63 L30 -60"
                            stroke="#0F172A"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                        />

                        {/* Active Laptop in Front of New Session Cat */}
                        <g transform="translate(-38, -28)">
                            <rect
                                x="0"
                                y="0"
                                width="46"
                                height="28"
                                rx="5"
                                fill="#DCFCE7"
                                stroke="#0F172A"
                                strokeWidth="2.4"
                            />
                            <text x="23" y="13" textAnchor="middle" fontSize="6.8" fontWeight="900" fill="#047857">
                                ACTIVE
                            </text>
                            <text x="23" y="22" textAnchor="middle" fontSize="6.5" fontWeight="900" fill="#065F46">
                                VIP ★
                            </text>
                            <rect
                                x="-5"
                                y="26"
                                width="56"
                                height="5"
                                rx="2.5"
                                fill="#34D399"
                                stroke="#0F172A"
                                strokeWidth="2.2"
                            />
                        </g>

                        {/* Comic Speech Bubble Above Right Cat */}
                        <g transform="translate(-4, -126)">
                            <rect
                                x="-56"
                                y="-22"
                                width="112"
                                height="24"
                                rx="12"
                                fill="#FEF3C7"
                                stroke="#0F172A"
                                strokeWidth="2.4"
                            />
                            <path
                                d="M-4 2 L2 11 L10 2 Z"
                                fill="#FEF3C7"
                                stroke="#0F172A"
                                strokeWidth="2.2"
                                strokeLinejoin="round"
                            />
                            <text x="0" y="-7" textAnchor="middle" fontSize="8.2" fontWeight="900" fill="#B45309">
                                {bubbleRight}
                            </text>
                        </g>
                    </g>
                </g>
            </svg>
            <p className="text-[10px] text-center text-sky-100/80 font-semibold tracking-wide -mt-1">
                (Tip: Click the doodle characters to make them hop!)
            </p>
        </div>
    );
};

const SessionEnforcementGuard = () => {
    const navigate = useNavigate();
    const { student, token: studentToken, isAuthenticated: isStudentAuth, logoutStudent } = useStudentAuthStore();
    const { user, token: staffToken, isAuthenticated: isStaffAuth, logout: logoutStaff } = useAuthStore();

    const [evictionModal, setEvictionModal] = useState({
        open: false,
        role: 'student',
        quote: SARCASTIC_EVICTION_QUOTES[0],
    });

    const socketRef = useRef(null);
    const evictingRef = useRef(false);
    const activeTokenRef = useRef(null);
    const lastFreshLoginAtRef = useRef(0);

    const activeToken = isStudentAuth && studentToken ? studentToken : isStaffAuth && staffToken ? staffToken : null;
    const activeUserId = isStudentAuth && student?._id ? student._id : isStaffAuth && user?._id ? user._id : null;
    const activeRole = isStudentAuth && student ? 'student' : isStaffAuth && user ? user.role || 'staff' : null;
    const currentSessionId = parseJwtSessionId(activeToken);

    useEffect(() => {
        activeTokenRef.current = activeToken;
    }, [activeToken]);

    const handleEvictSession = (roleToEvict, evictedToken = null) => {
        if (evictingRef.current) return;
        // Ignore stale 401s that belong to a previous token or fire during/immediately after a fresh login
        if (evictedToken && activeTokenRef.current && evictedToken !== activeTokenRef.current) {
            return;
        }
        if (Date.now() - lastFreshLoginAtRef.current < 4000) {
            return;
        }
        if (!activeTokenRef.current) {
            return;
        }

        evictingRef.current = true;

        const chosenQuote =
            SARCASTIC_EVICTION_QUOTES[Math.floor(Math.random() * SARCASTIC_EVICTION_QUOTES.length)];

        if (roleToEvict === 'student' || isStudentAuth) {
            logoutStudent();
        } else {
            logoutStaff();
        }

        setEvictionModal({
            open: true,
            role: roleToEvict || 'student',
            quote: chosenQuote,
        });
    };

    // Listen for global SESSION_REPLACED custom events dispatched from axios interceptors or stores
    useEffect(() => {
        const onSessionReplaced = (e) => {
            const role = e?.detail?.role || activeRole || 'student';
            const evictedToken = e?.detail?.evictedToken || null;
            handleEvictSession(role, evictedToken);
        };
        const onFreshLogin = () => {
            lastFreshLoginAtRef.current = Date.now();
            evictingRef.current = false;
            setEvictionModal((prev) => (prev.open ? { ...prev, open: false } : prev));
        };
        window.addEventListener('ethnotech:session-replaced', onSessionReplaced);
        window.addEventListener('ethnotech:session-fresh-login', onFreshLogin);
        return () => {
            window.removeEventListener('ethnotech:session-replaced', onSessionReplaced);
            window.removeEventListener('ethnotech:session-fresh-login', onFreshLogin);
        };
    }, [activeRole, isStudentAuth, isStaffAuth]);

    // Global Axios response interceptor to catch 401 with code === 'SESSION_REPLACED' from any axios instance
    useEffect(() => {
        const interceptorId = axios.interceptors.response.use(
            (res) => res,
            (err) => {
                if (err?.response?.status === 401 && err?.response?.data?.code === 'SESSION_REPLACED') {
                    const authHeader = err?.config?.headers?.Authorization || err?.config?.headers?.authorization || '';
                    const failedToken = typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
                        ? authHeader.slice(7).trim()
                        : null;
                    triggerSessionReplacedEvent(activeRole || 'student', failedToken);
                }
                return Promise.reject(err);
            }
        );
        return () => axios.interceptors.response.eject(interceptorId);
    }, [activeRole]);

    // Reset evicting lock and close any stale eviction modal once user logs in
    useEffect(() => {
        if (activeToken && activeUserId) {
            evictingRef.current = false;
            setEvictionModal((prev) => (prev.open ? { ...prev, open: false } : prev));
        }
    }, [activeToken, activeUserId]);

    // Real-time Socket.io listener + Periodic Heartbeat check (for serverless / multi-device tabs)
    useEffect(() => {
        if (!activeToken || !activeUserId) {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
            return;
        }

        const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
        const isVercelServer = socketUrl.includes('vercel.app');

        if (!isVercelServer) {
            const s = io(socketUrl, { transports: ['websocket', 'polling'] });
            socketRef.current = s;

            s.on('connect', () => {
                s.emit('register_auth_session', {
                    userId: activeUserId,
                    sessionId: currentSessionId,
                    role: activeRole,
                });
            });

            s.on('session_replaced', (payload) => {
                if (
                    payload &&
                    String(payload.userId) === String(activeUserId) &&
                    payload.newSessionId &&
                    currentSessionId &&
                    payload.newSessionId !== currentSessionId
                ) {
                    handleEvictSession(activeRole);
                }
            });
        }

        // Lightweight heartbeat verification every 30 seconds & on tab/window focus
        const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const checkEndpoint =
            activeRole === 'student' ? `${baseURL}/student/session-check` : `${baseURL}/auth/session-check`;

        const verifyActiveSession = async () => {
            if (!activeToken || evictingRef.current) return;
            if (Date.now() - lastFreshLoginAtRef.current < 4000) return;
            try {
                await axios.get(checkEndpoint, {
                    headers: { Authorization: `Bearer ${activeToken}` },
                });
            } catch (err) {
                if (err?.response?.status === 401 && err?.response?.data?.code === 'SESSION_REPLACED') {
                    handleEvictSession(activeRole, activeToken);
                }
            }
        };

        const intervalId = setInterval(verifyActiveSession, 30000);
        const onFocus = () => verifyActiveSession();
        const onVisibility = () => {
            if (document.visibilityState === 'visible') verifyActiveSession();
        };
        const onStorage = (e) => {
            if (e.key === 'student-auth-storage' || e.key === 'auth-storage') {
                verifyActiveSession();
            }
        };
        window.addEventListener('focus', onFocus);
        document.addEventListener('visibilitychange', onVisibility);
        window.addEventListener('storage', onStorage);

        return () => {
            clearInterval(intervalId);
            window.removeEventListener('focus', onFocus);
            document.removeEventListener('visibilitychange', onVisibility);
            window.removeEventListener('storage', onStorage);
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [activeToken, activeUserId, activeRole, currentSessionId]);

    const handleConfirmRedirect = () => {
        const target = evictionModal.role === 'student' ? '/portal#login' : '/console/admin';
        setEvictionModal((prev) => ({ ...prev, open: false }));
        navigate(target, { replace: true });
    };

    return (
        <AnimatePresence>
            {evictionModal.open && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.88, y: 24, rotate: -1 }}
                        animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="bg-white border-[2.5px] border-slate-900 rounded-[2rem] shadow-[6px_6px_0px_#0F172A,0_25px_70px_-15px_rgba(0,0,0,0.45)] max-w-lg w-full overflow-hidden relative"
                    >
                        {/* Top Hand-Drawn Doodle Stage Banner */}
                        <div className="bg-gradient-to-b from-[#5899B5] to-[#3D7690] px-5 pt-5 pb-3 text-white relative overflow-hidden border-b-[2.5px] border-slate-900">
                            <div className="flex items-center justify-between gap-4 relative z-10">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold bg-slate-900/25 border border-white/30 uppercase tracking-wider shadow-2xs">
                                    <ShieldAlert size={13} />
                                    {evictionModal.quote.badge}
                                </span>
                                <MonitorX size={20} className="text-white/85 shrink-0" />
                            </div>

                            {/* Hand-Drawn Boiling Doodle Crew Eviction Cartoon */}
                            <SarcasticDoodleEvictionScene
                                bubbleLeft={evictionModal.quote.bubbleLeft}
                                bubbleRight={evictionModal.quote.bubbleRight}
                            />
                        </div>

                        {/* Body Content */}
                        <div className="p-6 sm:p-7 space-y-5 bg-white">
                            <div className="space-y-2 text-center">
                                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug tracking-tight">
                                    {evictionModal.quote.title}
                                </h3>
                                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                    {evictionModal.quote.message}
                                </p>
                            </div>

                            {/* Doodle-Bordered Callout Box */}
                            <div className="bg-amber-50 border-2 border-slate-900 shadow-[3px_3px_0px_#0F172A] rounded-2xl p-4 flex items-start gap-3">
                                <Sparkles size={18} className="text-amber-600 shrink-0 mt-0.5" />
                                <p className="text-xs font-bold text-amber-950 leading-relaxed">
                                    {evictionModal.quote.subtext}
                                </p>
                            </div>

                            {/* Doodle-Styled Solid CTA Button */}
                            <button
                                type="button"
                                onClick={handleConfirmRedirect}
                                className="w-full py-3.5 px-6 bg-[#5899B5] hover:bg-[#3D7690] text-white font-extrabold rounded-2xl border-2 border-slate-900 shadow-[0_4px_0_#0F172A] hover:shadow-[0_6px_0_#0F172A] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_1px_0_#0F172A] transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
                            >
                                <LogIn size={17} />
                                Got It, Take Me Back To Login
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SessionEnforcementGuard;
