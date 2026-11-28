import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DoodleCrewFooter from '@/components/ui/doodle-crew-footer';
import { LegalModal } from './LegalModals';

const PublicFooter = () => {
    const [activeModal, setActiveModal] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const isHome = ['/', '/portal', '/assessment'].includes(location.pathname);

    const handleNav = (path) => (e) => {
        e.preventDefault();
        if (path === '/#login') {
            if (isHome) {
                document.querySelector('#login')?.scrollIntoView({ behavior: 'smooth' });
            } else {
                navigate('/#login');
            }
            return;
        }
        navigate(path);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const columns = [
        {
            title: 'Portal',
            links: [
                { label: 'Student Sign In', href: '/#login', onClick: handleNav('/#login') },
                { label: 'Portal Features', href: '/features', onClick: handleNav('/features') },
                { label: 'How It Works', href: '/how-it-works', onClick: handleNav('/how-it-works') },
                { label: 'Meet the LMS Team', href: '/team', onClick: handleNav('/team') },
            ],
        },
        {
            title: 'Campus',
            links: [
                { label: 'Life at Ethnotech', href: '/campus-life', onClick: handleNav('/campus-life') },
                { label: 'Courses & Tracks', href: '/tracks', onClick: handleNav('/tracks') },
                { label: 'Help & FAQs', href: '/faq', onClick: handleNav('/faq') },
                { label: 'Contact Support', href: 'mailto:info@ethnotech.in' },
            ],
        },
        {
            title: 'Tracks',
            links: [
                { label: 'AI, ML & Data Science', href: '/tracks', onClick: handleNav('/tracks') },
                { label: 'Cyber Security & Cloud', href: '/tracks', onClick: handleNav('/tracks') },
                { label: 'Software & Full-Stack', href: '/tracks', onClick: handleNav('/tracks') },
                { label: 'VLSI, Embedded & IoT', href: '/tracks', onClick: handleNav('/tracks') },
            ],
        },
        {
            title: 'Programs',
            links: [
                { label: 'EWDP Degree Track', href: '/tracks', onClick: handleNav('/tracks') },
                { label: 'CFS Future Skills', href: '/tracks', onClick: handleNav('/tracks') },
                { label: 'PMKVY & CMKKY', href: '/tracks', onClick: handleNav('/tracks') },
                { label: 'Skill India & NSDC', href: '/campus-life', onClick: handleNav('/campus-life') },
            ],
        },
    ];

    // Wordmark has 9 letters: E(0) T(1) H(2) N(3) O(4) T(5) E(6) C(7) H(8)
    const crew = [
        {
            kind: 'yeti',
            letter: 0,
            seat: 'front',
            offset: -0.32,
            name: 'Bruno',
            says: '75.01% attendance safe! Ready for the coding lab?',
        },
        {
            kind: 'bird',
            letter: 1,
            seat: 'top',
            offset: 0.04,
            name: 'Pip',
            says: 'Check the Study Material tab before the exam starts!',
        },
        {
            kind: 'mushroom',
            letter: 3,
            seat: 'front',
            offset: 0.12,
            scale: 0.95,
            name: 'Morel',
            says: '22 companies in Code2Career — 440 problems waiting!',
        },
        {
            kind: 'kid',
            letter: 5,
            seat: 'top',
            offset: -0.05,
            name: 'Juno',
            says: '70%+ Champion Tier! Best seat on the leaderboard.',
        },
        {
            kind: 'ghost',
            letter: 7,
            seat: 'behind',
            offset: 0,
            name: 'Boo',
            says: 'No tab-switching in the exam room… the proctor sees all!',
        },
        {
            kind: 'cat',
            letter: 8,
            seat: 'front',
            offset: 0.42,
            flip: true,
            name: 'Patch',
            says: 'All hidden test cases passed on the first run!',
        },
    ];

    const actions = [
        {
            label: 'Meet the LMS Team',
            href: '/team',
            icon: 'star',
            variant: 'outline',
            onClick: handleNav('/team'),
        },
        {
            label: 'Student Portal Login',
            href: '/#login',
            icon: 'bolt',
            variant: 'solid',
            onClick: handleNav('/#login'),
        },
    ];

    const legal = [
        { label: 'Terms', onClick: () => setActiveModal('terms') },
        { label: 'Privacy', onClick: () => setActiveModal('privacy') },
        { label: 'Security', onClick: () => setActiveModal('security') },
    ];

    const socials = [
        { label: 'YouTube', href: 'https://www.youtube.com/@EthnotechAcademy' },
        { label: 'LinkedIn', href: 'https://www.linkedin.com/company/ethnotech-academic-solutions/' },
        { label: 'Instagram', href: 'https://www.instagram.com/ethnotech_academy/' },
    ];

    return (
        <>
            <div id="contact" className="w-full border-t border-slate-200/80">
                <DoodleCrewFooter
                    wordmark="ETHNOTECH"
                    brand="Ethnotech Academy"
                    logoSrc="/assets/cropped-New-logo-footer-270x270.png"
                    blurb="Equipping engineering cohorts across partner colleges with hands-on technical training, proctored assessments, and campus placement readiness."
                    tagline="Where campus prep meets real compilers, live assessments, and placement wins."
                    columns={columns}
                    actions={actions}
                    crew={crew}
                    legal={legal}
                    socials={socials}
                    copyright={`© ${new Date().getFullYear()} Ethnotech Educational Solutions Pvt Ltd. Skill India & NSDC Partner.`}
                    preset="paper"
                    palette={{
                        background: '#ffffff',
                        ink: '#0f172a',
                        wordmarkInk: '#5899B5',
                        accent: '#5899B5',
                    }}
                />
            </div>

            <LegalModal
                isOpen={!!activeModal}
                type={activeModal}
                onClose={() => setActiveModal(null)}
            />
        </>
    );
};

export default PublicFooter;
