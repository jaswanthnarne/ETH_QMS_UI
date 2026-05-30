import React, { useState } from 'react';
import { MapPin, Mail, Youtube, Linkedin, Instagram } from 'lucide-react';
import { LegalModal } from './LegalModals';

const PublicFooter = () => {
    const [activeModal, setActiveModal] = useState(null);

    const socialLinks = [
        { icon: Youtube, href: 'https://www.youtube.com/@EthnotechAcademy', color: 'hover:text-red-600', label: 'YouTube' },
        { icon: Linkedin, href: 'https://www.linkedin.com/company/ethnotech-academic-solutions/', color: 'hover:text-blue-600', label: 'LinkedIn' },
        { icon: Instagram, href: 'https://www.instagram.com/ethnotech_academy/', color: 'hover:text-pink-600', label: 'Instagram' },
    ];

    return (
        <>
            <footer id="contact" className="bg-slate-950 text-white pt-20 pb-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(0,74,173,0.15),transparent_60%)]" />
                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-14 border-b border-slate-800/60">
                        <div className="md:col-span-2 space-y-6">
                            <div className="flex items-center gap-3">
                                <img src="/assets/cropped-New-logo-footer-270x270.png" alt="Ethnotech" className="h-12 w-12 brightness-0 invert" />
                                <div>
                                    <span className="text-xl font-bold block">Ethnotech Academy</span>
                                    <span className="text-xs text-slate-400 font-medium tracking-wide">FUTURE SKILLS HUB</span>
                                </div>
                            </div>
                            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
                                Equipping the next generation of professionals with the skills and knowledge required to thrive in today's fast-paced global job market.
                            </p>
                            
                            <div className="flex flex-col gap-6">
                                <div className="flex gap-4">
                                    <div className="bg-white/95 p-2 rounded-lg hover:bg-white transition-all shadow-sm group">
                                        <img src="/assets/Skill-India-1.png" alt="Skill India" className="h-10 object-contain mix-blend-multiply transition-transform group-hover:scale-105" />
                                    </div>
                                    <div className="bg-white/95 p-2 rounded-lg hover:bg-white transition-all shadow-sm group">
                                        <img src="/assets/NSDC.png" alt="NSDC" className="h-10 object-contain mix-blend-multiply transition-transform group-hover:scale-105" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300">Contact</h4>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3 text-sm text-slate-400">
                                        <MapPin size={16} className="text-[#004AAD] flex-shrink-0 mt-0.5" />
                                        <span>SK Arena Building, BDA Link Rd, Channasandra, Rajarajeshwari Nagar, Bengaluru, Karnataka 560098</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-slate-400">
                                        <Mail size={16} className="text-[#004AAD]" />
                                        <span>info@ethnotech.in</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="pt-2">
                                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-4">Connect With Us</h4>
                                <div className="flex gap-3">
                                    {socialLinks.map((social) => (
                                        <a
                                            key={social.label}
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`w-9 h-9 rounded-xl bg-slate-900 border border-slate-800/50 flex items-center justify-center text-slate-400 transition-all duration-300 hover:-translate-y-1 hover:border-slate-700 hover:bg-slate-800 ${social.color} shadow-lg shadow-black/20`}
                                            title={social.label}
                                        >
                                            <social.icon size={18} strokeWidth={1.5} />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-xs text-slate-500">&copy; {new Date().getFullYear()} Ethnotech Educational Solutions Pvt Ltd. All Rights Reserved.</p>
                        <div className="flex gap-6">
                            <button onClick={() => setActiveModal('terms')} className="text-xs text-slate-500 hover:text-white transition-colors focus:outline-none">Terms</button>
                            <button onClick={() => setActiveModal('privacy')} className="text-xs text-slate-500 hover:text-white transition-colors focus:outline-none">Privacy</button>
                            <button onClick={() => setActiveModal('security')} className="text-xs text-slate-500 hover:text-white transition-colors focus:outline-none">Security</button>
                        </div>
                    </div>
                </div>
            </footer>
            <LegalModal
                isOpen={!!activeModal}
                type={activeModal}
                onClose={() => setActiveModal(null)}
            />
        </>
    );
};

export default PublicFooter;
