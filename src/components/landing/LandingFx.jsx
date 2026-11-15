import { useEffect, useRef, useState } from 'react';
import { motion, useInView, animate, useReducedMotion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1];

/* Fade/slide in when scrolled into view */
export const Reveal = ({ children, delay = 0, y = 24, x = 0, className = '', once = true }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once, margin: '-60px' });
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y, x }}
            animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
            transition={{ duration: 0.65, delay, ease: EASE }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

/* Animated number: keeps any prefix / suffix text, e.g. "2.7 lakh+", "15,000+", "4.8 / 5" */
export const CountUp = ({ value, duration = 1.6, className = '' }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-40px' });
    const reduce = useReducedMotion();
    const match = String(value).match(/([\d,]*\.?\d+)/);
    const [display, setDisplay] = useState(match ? String(value).replace(match[1], '0') : value);

    useEffect(() => {
        if (!match || !inView) return;
        const raw = match[1];
        const target = parseFloat(raw.replace(/,/g, ''));
        const decimals = raw.includes('.') ? raw.split('.')[1].length : 0;
        const useCommas = raw.includes(',');
        const fmt = (n) => {
            const fixed = n.toFixed(decimals);
            return useCommas ? Number(fixed).toLocaleString('en-IN') : fixed;
        };
        if (reduce) {
            setDisplay(value);
            return;
        }
        const controls = animate(0, target, {
            duration,
            ease: EASE,
            onUpdate: (v) => setDisplay(String(value).replace(raw, fmt(v))),
        });
        return () => controls.stop();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inView]);

    return (
        <span ref={ref} className={className}>
            {display}
        </span>
    );
};

/* Hand-drawn underline that draws itself */
export const DrawUnderline = ({ color = '#004AAD', className = 'absolute left-0 -bottom-2 w-full h-3 pointer-events-none' }) => (
    <svg viewBox="0 0 300 20" preserveAspectRatio="none" className={className} aria-hidden="true">
        <motion.path
            d="M3 14 C 60 5, 120 5, 170 10 S 260 16, 297 7"
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.1, delay: 0.6, ease: EASE }}
        />
    </svg>
);

/* Photo that prefers the HD asset and falls back to the regular one */
export const Photo = ({ name, alt, className = '', imgClassName = '', zoom = true, priority = false }) => {
    const [src, setSrc] = useState(`/assets/campus/hd/${name}.jpg`);
    const [loaded, setLoaded] = useState(false);
    const tried = useRef(0);
    const onError = () => {
        tried.current += 1;
        if (tried.current === 1) setSrc(`/assets/campus/hd/${name}.png`);
        else if (tried.current === 2) setSrc(`/assets/campus/${name}.jpg`);
    };
    return (
        <div className={`relative overflow-hidden bg-slate-200 ${className}`}>
            {!loaded && <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-slate-200 to-slate-100" />}
            <img
                src={src}
                alt={alt}
                onError={onError}
                onLoad={() => setLoaded(true)}
                loading={priority ? 'eager' : 'lazy'}
                decoding="async"
                className={`w-full h-full object-cover transition-all duration-700 ${loaded ? 'opacity-100' : 'opacity-0'} ${
                    zoom ? 'group-hover:scale-[1.05]' : ''
                } ${imgClassName}`}
                style={{ imageRendering: 'auto' }}
            />
        </div>
    );
};

/* Circular progress ring */
export const ProgressRing = ({ value = 75, size = 56, stroke = 6, color = '#10B981', track = '#E2E8F0', children }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    return (
        <div ref={ref} className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
                <circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    stroke={color}
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray={c}
                    initial={{ strokeDashoffset: c }}
                    animate={inView ? { strokeDashoffset: c - (value / 100) * c } : {}}
                    transition={{ duration: 1.4, delay: 0.3, ease: EASE }}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">{children}</div>
        </div>
    );
};

/* Small bar chart with growing bars */
export const ScoreBars = ({ data = [62, 70, 66, 78, 74, 85, 82], color = '#3D7690', highlight = '#F59E0B', height = 64 }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });
    const max = Math.max(...data);
    return (
        <div ref={ref} className="flex items-end gap-1.5" style={{ height }}>
            {data.map((d, i) => (
                <motion.div
                    key={i}
                    className="flex-1 rounded-t-[3px]"
                    style={{ background: i === data.length - 2 ? highlight : color, opacity: i === data.length - 2 ? 1 : 0.35 + (i / data.length) * 0.65 }}
                    initial={{ height: 0 }}
                    animate={inView ? { height: `${(d / max) * 100}%` } : {}}
                    transition={{ duration: 0.8, delay: 0.2 + i * 0.07, ease: EASE }}
                />
            ))}
        </div>
    );
};

/* Clean background (no grids) */
export const HeroDoodles = () => null;

/* Dashed connector that draws across "How it works" steps */
export const StepConnector = () => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });
    return (
        <svg ref={ref} className="absolute top-7 left-[8%] right-[8%] w-[84%] h-6 hidden md:block" viewBox="0 0 1000 24" preserveAspectRatio="none" aria-hidden="true">
            <motion.path
                d="M0 12 C 160 -4, 340 28, 500 12 S 840 -4, 1000 12"
                fill="none"
                stroke="#94A3B8"
                strokeWidth="2"
                strokeDasharray="6 8"
                initial={{ pathLength: 0 }}
                animate={inView ? { pathLength: 1 } : {}}
                transition={{ duration: 1.6, ease: EASE }}
            />
        </svg>
    );
};

/* Wavy SVG section divider */
export const Wave = ({ fill = '#020617', flip = false, className = '' }) => (
    <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className={`block w-full h-[50px] md:h-[80px] ${flip ? 'rotate-180' : ''} ${className}`}
        aria-hidden="true"
    >
        <path d="M0 40 C 240 90, 480 0, 720 30 S 1200 80, 1440 30 V80 H0 Z" fill={fill} />
    </svg>
);

/* Track illustrations */
export const TrackIcon = ({ type }) => {
    const common = { width: 40, height: 40, viewBox: '0 0 40 40' };
    switch (type) {
        case 'code':
            return (
                <svg {...common}>
                    <rect width="40" height="40" rx="10" fill="#DBEAFE" />
                    <rect x="8" y="10" width="24" height="20" rx="3" fill="#fff" stroke="#2563EB" strokeWidth="2" />
                    <path d="M15 17l-3 3 3 3M25 17l3 3-3 3M21.5 16l-3 8" stroke="#2563EB" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            );
        case 'aiml':
            return (
                <svg {...common}>
                    <rect width="40" height="40" rx="10" fill="#F3E8FF" />
                    <circle cx="20" cy="20" r="4" fill="#fff" stroke="#7C3AED" strokeWidth="2" />
                    <circle cx="11" cy="13" r="2.5" fill="#fff" stroke="#7C3AED" strokeWidth="1.8" />
                    <circle cx="29" cy="13" r="2.5" fill="#fff" stroke="#7C3AED" strokeWidth="1.8" />
                    <circle cx="11" cy="27" r="2.5" fill="#fff" stroke="#7C3AED" strokeWidth="1.8" />
                    <circle cx="29" cy="27" r="2.5" fill="#fff" stroke="#7C3AED" strokeWidth="1.8" />
                    <path d="M13 14.5l4 3.5M27 14.5l-4 3.5M13 25.5l4-3.5M27 25.5l-4-3.5" stroke="#7C3AED" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
            );
        case 'cyber':
            return (
                <svg {...common}>
                    <rect width="40" height="40" rx="10" fill="#FFE4E6" />
                    <path d="M20 8l10 4v7c0 6.5-4.3 11.5-10 13-5.7-1.5-10-6.5-10-13v-7l10-4z" fill="#fff" stroke="#E11D48" strokeWidth="2" strokeLinejoin="round" />
                    <rect x="16.5" y="18.5" width="7" height="5.5" rx="1" fill="#E11D48" />
                    <path d="M18 18.5v-2a2 2 0 114 0v2" stroke="#E11D48" strokeWidth="1.8" fill="none" />
                </svg>
            );
        case 'cloud':
            return (
                <svg {...common}>
                    <rect width="40" height="40" rx="10" fill="#CFFAFE" />
                    <path d="M14 27h12.5a4.5 4.5 0 00.7-8.95A6.5 6.5 0 0014.3 16a5 5 0 00-.3 11z" fill="#fff" stroke="#0891B2" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M20 18v6m0 0l-2.5-2.5M20 24l2.5-2.5" stroke="#0891B2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            );
        case 'ece':
            return (
                <svg {...common}>
                    <rect width="40" height="40" rx="10" fill="#D1FAE5" />
                    <rect x="13" y="13" width="14" height="14" rx="2.5" fill="#fff" stroke="#059669" strokeWidth="2" />
                    <rect x="17" y="17" width="6" height="6" rx="1" fill="#059669" />
                    <path d="M16 9v4M20 9v4M24 9v4M16 27v4M20 27v4M24 27v4M9 16h4M9 20h4M9 24h4M27 16h4M27 20h4M27 24h4" stroke="#059669" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
            );
        case 'eee':
            return (
                <svg {...common}>
                    <rect width="40" height="40" rx="10" fill="#FEF3C7" />
                    <circle cx="20" cy="20" r="11" fill="#fff" stroke="#D97706" strokeWidth="2" />
                    <path d="M21.5 11.5L15 21h5l-1.5 7.5L25 19h-5l1.5-7.5z" fill="#F59E0B" stroke="#D97706" strokeWidth="1.4" strokeLinejoin="round" />
                </svg>
            );
        case 'mech':
            return (
                <svg {...common}>
                    <rect width="40" height="40" rx="10" fill="#FFEDD5" />
                    <circle cx="20" cy="20" r="7" fill="#fff" stroke="#EA580C" strokeWidth="2" />
                    <circle cx="20" cy="20" r="2.8" fill="#EA580C" />
                    <path d="M20 9v3M20 28v3M9 20h3M28 20h3M12.2 12.2l2.2 2.2M25.6 25.6l2.2 2.2M27.8 12.2l-2.2 2.2M14.4 25.6l-2.2 2.2" stroke="#EA580C" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
            );
        case 'civil':
            return (
                <svg {...common}>
                    <rect width="40" height="40" rx="10" fill="#E0E7FF" />
                    <path d="M9 29h22M12 29V17l8-6 8 6v12" fill="#fff" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16 29v-6h8v6M16 18h8" stroke="#4F46E5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            );
        default:
            return (
                <svg {...common}>
                    <rect width="40" height="40" rx="10" fill="#FCE7F3" />
                    <path d="M12 27l6-7 4 4 7-9" stroke="#DB2777" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="29" cy="15" r="2.5" fill="#DB2777" />
                </svg>
            );
    }
};

