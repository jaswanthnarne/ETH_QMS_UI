import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2, AlertTriangle, ArrowRight } from 'lucide-react';
import axios from 'axios';
import PublicLayout from '../../layouts/PublicLayout';

const ResumeExam = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const resumeSession = async () => {
            const queryParams = new URLSearchParams(location.search);
            let sessionId = queryParams.get('sessionId') || localStorage.getItem('std_client_session');

            if (!sessionId) {
                setError('No valid session ID found. Please contact your instructor or re-enter with your key.');
                setLoading(false);
                return;
            }

            try {
                const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                const response = await axios.get(`${baseURL}/exam/resume/${sessionId}`);
                
                if (response.data.success) {
                    const data = response.data.data;
                    
                    // Repopulate required local identity so StudentExam validates correctly
                    localStorage.setItem('std_name', data.studentName);
                    localStorage.setItem('std_roll', data.rollNumber);
                    if (data.mobile) localStorage.setItem('std_mobile', data.mobile);
                    if (data.email) localStorage.setItem('std_email', data.email);
                    if (data.department) localStorage.setItem('std_dept', data.department);
                    localStorage.setItem('std_client_session', sessionId);

                    // Redirect back into the active exam
                    navigate(`/exam/${data.examKey}`, {
                        state: {
                            studentName: data.studentName,
                            rollNumber: data.rollNumber,
                            mobile: data.mobile,
                            email: data.email,
                            department: data.department
                        },
                        replace: true
                    });
                }
            } catch (err) {
                const msg = err.response?.data?.error || 'Failed to reconnect to the exam session.';
                setError(msg);
                setLoading(false);
            }
        };

        resumeSession();
    }, [location.search, navigate]);

    return (
        <PublicLayout>
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 py-32">
                {loading ? (
                    <div className="text-center">
                        <Loader2 className="animate-spin text-primary mx-auto mb-4" size={48} />
                        <h2 className="text-xl font-bold text-slate-800">Reconnecting to Assessment...</h2>
                        <p className="text-sm text-slate-500 mt-2">Please wait while we securely resume your session.</p>
                    </div>
                ) : (
                    <div className="bg-white p-10 max-w-sm w-full rounded-[2rem] shadow-xl border-t-8 border-rose-500 text-center">
                        <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-500">
                            <AlertTriangle size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-3">Reconnection Failed</h2>
                        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                            {error}
                        </p>
                        <button
                            onClick={() => navigate('/portal')}
                            className="bg-slate-900 text-white w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold hover:bg-black transition-all"
                        >
                            Return to Portal <ArrowRight size={18} />
                        </button>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
};

export default ResumeExam;
