import React, { useState } from 'react';

const COMPANY_DOMAINS = {
    tcs: 'tcs.com',
    infosys: 'infosys.com',
    accenture: 'accenture.com',
    wipro: 'wipro.com',
    cognizant: 'cognizant.com',
    amazon: 'amazon.com',
    microsoft: 'microsoft.com',
    google: 'google.com',
    swiggy: 'swiggy.com',
    zomato: 'zomato.com',
    razorpay: 'razorpay.com',
    goldman: 'goldmansachs.com',
    jpmorgan: 'jpmorganchase.com',
    zoho: 'zoho.com',
    meta: 'meta.com',
    apple: 'apple.com',
    netflix: 'netflix.com',
    adobe: 'adobe.com',
    flipkart: 'flipkart.com',
    uber: 'uber.com',
    atlassian: 'atlassian.com',
    phonepe: 'phonepe.com'
};

const getCompanyDomain = (key) => {
    if (key.includes('tcs') || key.includes('tata')) return COMPANY_DOMAINS.tcs;
    if (key.includes('infosys')) return COMPANY_DOMAINS.infosys;
    if (key.includes('accenture')) return COMPANY_DOMAINS.accenture;
    if (key.includes('wipro')) return COMPANY_DOMAINS.wipro;
    if (key.includes('cognizant')) return COMPANY_DOMAINS.cognizant;
    if (key.includes('amazon')) return COMPANY_DOMAINS.amazon;
    if (key.includes('microsoft')) return COMPANY_DOMAINS.microsoft;
    if (key.includes('google')) return COMPANY_DOMAINS.google;
    if (key.includes('meta') || key.includes('facebook')) return COMPANY_DOMAINS.meta;
    if (key.includes('apple')) return COMPANY_DOMAINS.apple;
    if (key.includes('netflix')) return COMPANY_DOMAINS.netflix;
    if (key.includes('adobe')) return COMPANY_DOMAINS.adobe;
    if (key.includes('flipkart')) return COMPANY_DOMAINS.flipkart;
    if (key.includes('uber')) return COMPANY_DOMAINS.uber;
    if (key.includes('atlassian')) return COMPANY_DOMAINS.atlassian;
    if (key.includes('swiggy')) return COMPANY_DOMAINS.swiggy;
    if (key.includes('zomato')) return COMPANY_DOMAINS.zomato;
    if (key.includes('razorpay')) return COMPANY_DOMAINS.razorpay;
    if (key.includes('phonepe')) return COMPANY_DOMAINS.phonepe;
    if (key.includes('goldman') || key.includes('gs')) return COMPANY_DOMAINS.goldman;
    if (key.includes('jpmorgan') || key.includes('jpm') || key.includes('chase')) return COMPANY_DOMAINS.jpmorgan;
    if (key.includes('zoho')) return COMPANY_DOMAINS.zoho;
    return null;
};

/**
 * CompanyLogoSvg
 * Renders real official company logos from the internet with automatic fallback to crisp vector SVGs.
 */
export const CompanyLogoSvg = ({ company, companyId, className = 'w-10 h-10', size = 40 }) => {
    const rawName = company || companyId || '';
    const key = rawName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const domain = getCompanyDomain(key);
    const [imgTier, setImgTier] = useState(0);

    if (domain && imgTier < 2) {
        const src =
            imgTier === 0
                ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
                : `https://icons.duckduckgo.com/ip3/${domain}.ico`;

        return (
            <img
                src={src}
                alt={`${rawName} logo`}
                width={size}
                height={size}
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={() => setImgTier((t) => t + 1)}
                onLoad={(e) => {
                    if (e.currentTarget.naturalWidth <= 16) {
                        setImgTier((t) => t + 1);
                    }
                }}
                className={`${className} rounded-lg object-contain`}
            />
        );
    }

    // 1. TCS (Tata Consultancy Services)
    if (key.includes('tcs') || key.includes('tata')) {
        return (
            <svg viewBox="0 0 100 100" className={className} width={size} height={size} aria-label="TCS Logo">
                <rect width="100" height="100" rx="22" fill="#0F4C81" />
                <path d="M22 36 h56 v12 h-22 v34 h-12 v-34 h-22 z" fill="#FFFFFF" />
                <path d="M68 64 l10 18 h-10 l-6 -11 -6 11 h-10 l11 -18 z" fill="#F43F5E" />
                <circle cx="50" cy="22" r="4" fill="#38BDF8" />
            </svg>
        );
    }

    // 2. Infosys
    if (key.includes('infosys')) {
        return (
            <svg viewBox="0 0 100 100" className={className} width={size} height={size} aria-label="Infosys Logo">
                <rect width="100" height="100" rx="22" fill="#007CC3" />
                <text x="50" y="62" textAnchor="middle" fill="#FFFFFF" fontSize="26" fontWeight="900" fontFamily="sans-serif" letterSpacing="-1">
                    infy
                </text>
                <circle cx="28" cy="38" r="4" fill="#FBBF24" />
                <path d="M20 74 Q50 82 80 74" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.8" />
            </svg>
        );
    }

    // 3. Accenture
    if (key.includes('accenture')) {
        return (
            <svg viewBox="0 0 100 100" className={className} width={size} height={size} aria-label="Accenture Logo">
                <rect width="100" height="100" rx="22" fill="#111827" />
                <text x="36" y="66" textAnchor="middle" fill="#FFFFFF" fontSize="42" fontWeight="900" fontFamily="sans-serif">
                    &gt;
                </text>
                <path d="M52 46 l16 -16 l8 8 l-12 12 l12 12 l-8 8 z" fill="#A100FF" />
                <circle cx="76" cy="30" r="3" fill="#C084FC" />
            </svg>
        );
    }

    // 4. Wipro
    if (key.includes('wipro')) {
        return (
            <svg viewBox="0 0 100 100" className={className} width={size} height={size} aria-label="Wipro Logo">
                <rect width="100" height="100" rx="22" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
                <circle cx="50" cy="36" r="10" fill="#E11D48" />
                <circle cx="34" cy="50" r="8" fill="#F59E0B" />
                <circle cx="66" cy="50" r="8" fill="#10B981" />
                <circle cx="38" cy="68" r="9" fill="#0EA5E9" />
                <circle cx="62" cy="68" r="9" fill="#8B5CF6" />
                <text x="50" y="90" textAnchor="middle" fill="#1E293B" fontSize="11" fontWeight="800">
                    wipro
                </text>
            </svg>
        );
    }

    // 5. Cognizant
    if (key.includes('cognizant')) {
        return (
            <svg viewBox="0 0 100 100" className={className} width={size} height={size} aria-label="Cognizant Logo">
                <rect width="100" height="100" rx="22" fill="#000048" />
                <path d="M50 20 A 30 30 0 0 1 80 50 A 30 30 0 0 1 50 80 A 30 30 0 0 1 20 50" stroke="#0033A0" strokeWidth="9" fill="none" strokeLinecap="round" />
                <path d="M50 28 A 22 22 0 0 1 72 50 A 22 22 0 0 1 50 72" stroke="#00B4D8" strokeWidth="8" fill="none" strokeLinecap="round" />
                <circle cx="50" cy="50" r="7" fill="#FFFFFF" />
            </svg>
        );
    }

    // 6. Amazon
    if (key.includes('amazon')) {
        return (
            <svg viewBox="0 0 100 100" className={className} width={size} height={size} aria-label="Amazon Logo">
                <rect width="100" height="100" rx="22" fill="#232F3E" />
                <text x="50" y="52" textAnchor="middle" fill="#FFFFFF" fontSize="28" fontWeight="900" fontFamily="sans-serif">
                    a
                </text>
                {/* Golden Smile Arrow */}
                <path d="M26 62 Q50 78 74 62" stroke="#FF9900" strokeWidth="4.5" strokeLinecap="round" fill="none" />
                <path d="M72 57 l6 6 l-7 4 z" fill="#FF9900" />
            </svg>
        );
    }

    // 7. Microsoft
    if (key.includes('microsoft')) {
        return (
            <svg viewBox="0 0 100 100" className={className} width={size} height={size} aria-label="Microsoft Logo">
                <rect width="100" height="100" rx="22" fill="#18181B" />
                <rect x="26" y="26" width="22" height="22" rx="2" fill="#F25022" />
                <rect x="52" y="26" width="22" height="22" rx="2" fill="#7FBA00" />
                <rect x="26" y="52" width="22" height="22" rx="2" fill="#00A4EF" />
                <rect x="52" y="52" width="22" height="22" rx="2" fill="#FFB900" />
            </svg>
        );
    }

    // 8. Google
    if (key.includes('google')) {
        return (
            <svg viewBox="0 0 100 100" className={className} width={size} height={size} aria-label="Google Logo">
                <rect width="100" height="100" rx="22" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
                {/* 4-Color Google G */}
                <path d="M50 42 h30 A 30 30 0 0 1 80 50 A 30 30 0 0 1 50 80 A 30 30 0 0 1 20 50 A 30 30 0 0 1 50 20 A 30 30 0 0 1 70 28 l-9 9 A 17 17 0 0 0 50 33 A 17 17 0 0 0 33 50 A 17 17 0 0 0 50 67 A 17 17 0 0 0 66 54 H50 Z" fill="#4285F4" />
                <path d="M20 50 A 30 30 0 0 1 28 32 l9 8 A 17 17 0 0 0 33 50 z" fill="#FBBC05" />
                <path d="M28 32 A 30 30 0 0 1 50 20 l0 13 A 17 17 0 0 0 37 40 z" fill="#EA4335" />
                <path d="M37 60 l-9 8 A 30 30 0 0 1 20 50 l13 0 z" fill="#FBBC05" />
                <path d="M50 80 A 30 30 0 0 1 28 68 l9 -8 A 17 17 0 0 0 50 67 z" fill="#34A853" />
                <path d="M50 80 l0 -13 A 17 17 0 0 0 66 54 l14 0 A 30 30 0 0 1 50 80 z" fill="#34A853" />
            </svg>
        );
    }

    // 9. Swiggy
    if (key.includes('swiggy')) {
        return (
            <svg viewBox="0 0 100 100" className={className} width={size} height={size} aria-label="Swiggy Logo">
                <rect width="100" height="100" rx="22" fill="#FC8019" />
                {/* Location Marker Spoon Pin */}
                <path d="M50 18 A 22 22 0 0 1 72 40 C72 56 54 75 50 82 C46 75 28 56 28 40 A 22 22 0 0 1 50 18 Z" fill="#FFFFFF" />
                <ellipse cx="50" cy="38" rx="8" ry="11" fill="#FC8019" />
                <circle cx="50" cy="32" r="4" fill="#FFFFFF" />
            </svg>
        );
    }

    // 10. Zomato
    if (key.includes('zomato')) {
        return (
            <svg viewBox="0 0 100 100" className={className} width={size} height={size} aria-label="Zomato Logo">
                <rect width="100" height="100" rx="22" fill="#E23744" />
                <text x="50" y="60" textAnchor="middle" fill="#FFFFFF" fontSize="28" fontWeight="900" fontStyle="italic" fontFamily="sans-serif">
                    zomato
                </text>
                <circle cx="50" cy="74" r="3.5" fill="#FFFFFF" />
            </svg>
        );
    }

    // 11. Razorpay
    if (key.includes('razorpay')) {
        return (
            <svg viewBox="0 0 100 100" className={className} width={size} height={size} aria-label="Razorpay Logo">
                <rect width="100" height="100" rx="22" fill="#0C2340" />
                {/* Razorpay Lightning Crest */}
                <path d="M58 18 L32 50 L48 50 L42 82 L70 46 L54 46 Z" fill="#0C83FD" stroke="#38BDF8" strokeWidth="2" strokeLinejoin="round" />
            </svg>
        );
    }

    // 12. Goldman Sachs
    if (key.includes('goldman') || key.includes('gs')) {
        return (
            <svg viewBox="0 0 100 100" className={className} width={size} height={size} aria-label="Goldman Sachs Logo">
                <rect width="100" height="100" rx="22" fill="#7399C6" />
                <rect x="10" y="10" width="80" height="80" rx="14" fill="#1E3A8A" />
                <text x="50" y="58" textAnchor="middle" fill="#FFFFFF" fontSize="30" fontWeight="900" fontFamily="serif" letterSpacing="1">
                    GS
                </text>
                <line x1="28" y1="68" x2="72" y2="68" stroke="#93C5FD" strokeWidth="2.5" />
            </svg>
        );
    }

    // 13. JPMorgan Chase
    if (key.includes('jpmorgan') || key.includes('jpm') || key.includes('chase')) {
        return (
            <svg viewBox="0 0 100 100" className={className} width={size} height={size} aria-label="JPMorgan Chase Logo">
                <rect width="100" height="100" rx="22" fill="#111827" />
                {/* Octagonal Compass Logo */}
                <g transform="translate(50,50)">
                    <rect x="-24" y="-24" width="48" height="48" fill="none" stroke="#005EB8" strokeWidth="6" rx="4" transform="rotate(45)" />
                    <circle cx="0" cy="0" r="10" fill="#005EB8" />
                </g>
                <text x="50" y="90" textAnchor="middle" fill="#9CA3AF" fontSize="9" fontWeight="800" letterSpacing="0.8">
                    J.P. MORGAN
                </text>
            </svg>
        );
    }

    // 14. Zoho
    if (key.includes('zoho')) {
        return (
            <svg viewBox="0 0 100 100" className={className} width={size} height={size} aria-label="Zoho Logo">
                <rect width="100" height="100" rx="22" fill="#0F172A" />
                {/* 4 Colored Connected Squares */}
                <rect x="22" y="24" width="24" height="24" rx="5" fill="#E42528" />
                <rect x="54" y="24" width="24" height="24" rx="5" fill="#28A745" />
                <rect x="22" y="54" width="24" height="24" rx="5" fill="#007BFF" />
                <rect x="54" y="54" width="24" height="24" rx="5" fill="#FFC107" />
            </svg>
        );
    }

    // Default Fallback Logo
    return (
        <svg viewBox="0 0 100 100" className={className} width={size} height={size} aria-label="Company Logo">
            <rect width="100" height="100" rx="22" fill="#334155" />
            <text x="50" y="62" textAnchor="middle" fill="#FFFFFF" fontSize="36" fontWeight="bold">
                {(rawName || 'C').charAt(0).toUpperCase()}
            </text>
        </svg>
    );
};

export default CompanyLogoSvg;

