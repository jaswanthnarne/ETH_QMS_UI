import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Scale, ShieldCheck, Lock } from 'lucide-react';

const termsContent = (
    <div className="prose prose-slate max-w-none prose-headings:text-[#004AAD] prose-headings:font-bold">
        <h2>1. Acceptance of Terms</h2>
        <p>By accessing or using the Ethnotech Academy assessment platform and related services, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access our services.</p>

        <h2>2. Academic Integrity</h2>
        <p>Our platform is designed to facilitate fair and secure assessments. Users agree to abide by the principles of academic integrity. Any attempt to use unauthorized materials, circumvent proctoring systems, or engage in cheating will result in immediate termination of the exam session and may be reported to your affiliated institution.</p>

        <h2>3. User Account Security</h2>
        <p>You are responsible for safeguarding your login credentials (such as your Exam Access Key and Roll Number). You agree to notify us immediately of any unauthorized use of your credentials or any other breach of security. Ethnotech Academy will not be liable for any loss or damage arising from your failure to comply with this requirement.</p>

        <h2>4. Intellectual Property</h2>
        <p>The Service and its original content, features, functionalities, and examination materials are and will remain the exclusive property of Ethnotech Academy and its licensors. The examination questions, structural design, and source code may not be reproduced without explicit written permission.</p>

        <h2>5. Modification of Service</h2>
        <p>We reserve the right to withdraw or amend our service, and any service or material we provide, in our sole discretion without notice. We will not be liable if for any reason all or any part of the service is unavailable at any time or for any period.</p>

        <h2>6. Governing Law</h2>
        <p>These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.</p>
        
        <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-100">
            <h3 className="text-xl font-bold text-slate-800 mb-2 mt-0">Questions regarding our terms?</h3>
            <p className="mb-0 text-slate-600">Please reach out to our support team at <a href="mailto:info@ethnotech.in" className="text-[#004AAD] font-semibold no-underline hover:underline">info@ethnotech.in</a> for clarification on any of the points mentioned above.</p>
        </div>
    </div>
);

const privacyContent = (
    <div className="prose prose-slate max-w-none prose-headings:text-emerald-700 prose-headings:font-bold prose-a:text-emerald-600 hover:prose-a:text-emerald-800">
        <h2>1. Information we collect</h2>
        <p>When you use Ethnotech Academy's assessment platform, we may collect personal information that you provide to us directly such as your Legal Name, Roll Number, Phone Number, and Exam Access Key. We also collect technical data regarding your browser footprint and IP address during the assessment session.</p>

        <h2>2. How we use your data</h2>
        <p>We use the collected information solely for the purpose of identifying you before an examination, ensuring assessment integrity, maintaining audit logs, calculating and displaying leaderboard results, and processing your examination history. Non-identifiable aggregated data may be used to improve system performance.</p>

        <h2>3. Data retention and deletion</h2>
        <p>We retain your personal data only for as long as is necessary to complete the assessment cycle or as required by your academic institution. Audit logs generated during the exam containing technical tracking information are periodically reviewed and securely disposed of when they are no longer required for integrity verification.</p>

        <h2>4. Proctoring & Security Tracking</h2>
        <p>During your examination, we track background activity and employ fingerprinting technologies to prevent misconduct. This data includes the hardware configuration, connection properties, and in-exam navigation events. This information is classified as strictly confidential and is only accessible by authorized exam trainers and system administrators.</p>

        <h2>5. Sharing your information</h2>
        <p>Ethnotech Academy will not sell your personal data. We may share assessment reports, scoring, and proctoring metrics directly with the educational program or corporate partner associated with the Exam Access Key you utilize. We do not share this data with any third-party marketing entities.</p>

        <div className="mt-8 p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
            <h3 className="text-xl font-bold text-slate-800 mb-2 mt-0">Contact our DPO</h3>
            <p className="mb-0 text-slate-600">If you have any queries concerning our privacy practices, you can submit an inquiry at <a href="mailto:privacy@ethnotech.in" className="font-semibold no-underline hover:underline">privacy@ethnotech.in</a>.</p>
        </div>
    </div>
);

const securityContent = (
    <div className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-headings:font-bold prose-strong:text-slate-800">
        <h2>1. End-To-End Security Model</h2>
        <p>Ethnotech Academy employs an industry-leading security architecture to maintain data integrity and prevent unauthorized examination access. All platform communication is encrypted enforcing TLS v1.2 at minimum for any connection processing identifiable or examination outcome data.</p>

        <h2>2. Exam Proctoring Security</h2>
        <p>Exams hosted on our platform rely on real-time continuous behavioral metrics including cursor tracking, window focus auditing, multi-tab restrictions, and IP/Browser fingerprint validation. Attempts to use network proxies and headless browser automation are mitigated using active prevention heuristics to prevent fraudulent activity.</p>

        <h2>3. Data Handling & Safe Storage</h2>
        <p>Our database clusters process data inside virtual private networks (VPCs) without public internet access boundaries. Exam content, answers, scoring, and identifiable student entries interact only across authenticated internal microservices. Data at rest is encrypted according to standard AES-256 regulations.</p>

        <h2>4. Identity Verification</h2>
        <p>Trainer dashboards rely strictly on JSON Web Tokens (JWT) incorporating brief expiry cycles. Refresh tokens are dynamically validated preventing persistent state hijacking attacks. Access scopes check role-based allowances dynamically at endpoint levels.</p>

        <h2>5. Vulnerability Management</h2>
        <p>Ethnotech Academy runs comprehensive penetration tests routinely. Any critical infrastructure patching and framework-level security advisories are actively handled by our system orchestration teams to ensure dependencies carry zero known exploits.</p>

        <div className="mt-8 p-6 bg-slate-900 text-slate-300 rounded-2xl border border-slate-800">
            <h3 className="text-xl font-bold text-white mb-2 mt-0">Reporting Security Concerns</h3>
            <p className="mb-0">Please do not test vulnerabilities on our production servers. Contact our security response team confidentially at <a href="mailto:security@ethnotech.in" className="text-blue-400 font-semibold no-underline hover:underline">security@ethnotech.in</a> with Proof of Concepts for any observed vulnerability.</p>
        </div>
    </div>
);

export const LegalModal = ({ isOpen, type, onClose }) => {
    if (!isOpen || !type) return null;

    const modalConfig = {
        terms: {
            title: "Terms of Service",
            subtitle: "User agreement and platform terms",
            icon: <Scale size={24} className="text-blue-500" />,
            content: termsContent,
            headerBg: "bg-blue-50/50 border-blue-100"
        },
        privacy: {
            title: "Privacy Policy",
            subtitle: "Data collection and usage guidelines",
            icon: <ShieldCheck size={24} className="text-emerald-500" />,
            content: privacyContent,
            headerBg: "bg-emerald-50/50 border-emerald-100"
        },
        security: {
            title: "Security Information",
            subtitle: "Platform integrity and compliance",
            icon: <Lock size={24} className="text-slate-700" />,
            content: securityContent,
            headerBg: "bg-slate-100 border-slate-200"
        }
    };

    const config = modalConfig[type];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-md bg-slate-900/40"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
                    className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className={`p-6 sm:p-8 flex items-start gap-5 border-b shrink-0 ${config.headerBg}`}>
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                            {config.icon}
                        </div>
                        <div className="flex-1 pr-8">
                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{config.title}</h2>
                            <p className="text-sm font-medium text-slate-500 mt-1">{config.subtitle}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-200/50 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content Scrollable Area */}
                    <div className="p-6 sm:p-8 overflow-y-auto overscroll-contain bg-white flex-1 custom-scrollbar">
                        {config.content}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
