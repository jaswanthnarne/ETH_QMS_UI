import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
    Clock,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    AlertTriangle,
    Flag,
    Send,
    Loader2,
    ShieldCheck,
    Check,
    ArrowRight,
    Trophy,
    FileText,
    Target,
    XCircle,
    BookOpen,
    Timer,
    Award,
    BarChart3,
    MessageSquare,
    X,
    Megaphone,
    Video,
    Mic,
    Monitor
} from 'lucide-react';
import axios from 'axios';
import { io } from 'socket.io-client';
import useCheatDetection from '../hooks/useCheatDetection';
import { ConfirmModal, AlertModal } from '../components/Modals';
import useStudentAuthStore from '../store/studentAuthStore';

const StudentExam = () => {
    const { key } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // Retrieve logged-in student context
    const { student } = useStudentAuthStore();

    // Identity persistence
    const studentName = location.state?.studentName || student?.name || localStorage.getItem('std_name');
    const rollNumber = location.state?.rollNumber || student?.usn || localStorage.getItem('std_roll');
    const mobile = location.state?.mobile || student?.mobile || localStorage.getItem('std_mobile');
    const email = location.state?.email || student?.email || localStorage.getItem('std_email');
    const department = location.state?.department || student?.department || localStorage.getItem('std_dept');

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [showWarning, setShowWarning] = useState(null);
    const [answers, setAnswers] = useState({});
    const [marked, setMarked] = useState([]);
    const [exam, setExam] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null);
    const [reviewTab, setReviewTab] = useState('all'); // 'all' | 'correct' | 'incorrect'
    const [isStarted, setIsStarted] = useState(false);
    const [hasEnteredEx, setHasEnteredEx] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [confirmState, setConfirmState] = useState({ open: false });
    const [alertState, setAlertState] = useState({ open: false });
    const [certDownloading, setCertDownloading] = useState(false);
    const socket = useRef(null);
    const [showAwakeModal, setShowAwakeModal] = useState(false);

    // Mock proctoring states
    const [isWebcamActive, setIsWebcamActive] = useState(false);
    const [isMicActive, setIsMicActive] = useState(false);
    const [isScreenActive, setIsScreenActive] = useState(false);
    const [mediaError, setMediaError] = useState(null);
    const [requestingMedia, setRequestingMedia] = useState(false);
    const [showSightWarning, setShowSightWarning] = useState(false);

    const webcamStreamRef = useRef(null);
    const micStreamRef = useRef(null);
    const screenStreamRef = useRef(null);

    const stopAllMediaTracks = useCallback(() => {
        if (webcamStreamRef.current) {
            webcamStreamRef.current.getTracks().forEach(track => track.stop());
            webcamStreamRef.current = null;
        }
        if (micStreamRef.current) {
            micStreamRef.current.getTracks().forEach(track => track.stop());
            micStreamRef.current = null;
        }
        if (screenStreamRef.current) {
            screenStreamRef.current.getTracks().forEach(track => track.stop());
            screenStreamRef.current = null;
        }
        setIsWebcamActive(false);
        setIsMicActive(false);
        setIsScreenActive(false);
    }, []);

    // Cleanup streams on unmount
    useEffect(() => {
        return () => {
            if (webcamStreamRef.current) webcamStreamRef.current.getTracks().forEach(t => t.stop());
            if (micStreamRef.current) micStreamRef.current.getTracks().forEach(t => t.stop());
            if (screenStreamRef.current) screenStreamRef.current.getTracks().forEach(t => t.stop());
        };
    }, []);

    const handleStartExam = async () => {
        setMediaError(null);
        setRequestingMedia(true);

        let localWebcamStream = null;
        let localMicStream = null;
        let localScreenStream = null;

        try {
            const needsWebcam = exam?.settings?.requireWebcam;
            const needsMic = exam?.settings?.requireMic;
            const needsScreen = exam?.settings?.requireScreenshare;

            if (needsWebcam || needsMic) {
                localWebcamStream = await navigator.mediaDevices.getUserMedia({
                    video: needsWebcam ? { width: 320, height: 240 } : false,
                    audio: needsMic ? true : false
                });

                if (needsWebcam) {
                    webcamStreamRef.current = localWebcamStream;
                    setIsWebcamActive(true);
                }
                if (needsMic) {
                    micStreamRef.current = localWebcamStream;
                    setIsMicActive(true);
                }
            }

            if (needsScreen) {
                localScreenStream = await navigator.mediaDevices.getDisplayMedia({
                    video: true,
                    audio: false
                });
                screenStreamRef.current = localScreenStream;
                setIsScreenActive(true);

                // Listen for manual screenshare stop from browser bar
                localScreenStream.getVideoTracks()[0].onended = () => {
                    setIsScreenActive(false);
                    triggerViolation('screenshareStopped', 1);
                };
            }

            // Request fullscreen
            try {
                if (document.documentElement.requestFullscreen) {
                    await document.documentElement.requestFullscreen();
                }
            } catch (err) {
                console.error("Fullscreen failed:", err);
            }

            setHasEnteredEx(true);
        } catch (err) {
            console.error("Proctoring setup error:", err);
            
            // Clean up partially created tracks
            if (localWebcamStream) localWebcamStream.getTracks().forEach(t => t.stop());
            if (localScreenStream) localScreenStream.getTracks().forEach(t => t.stop());

            let errMsg = "Permissions denied. Please allow camera, microphone, or screen sharing access to start the exam.";
            if (err.name === 'NotAllowedError') {
                errMsg = "Access denied: You must grant permission for the requested security devices (Camera, Microphone, or Screenshare) to begin this assessment.";
            } else if (err.name === 'NotFoundError') {
                errMsg = "Device error: The requested camera or microphone was not found on your system.";
            }
            setMediaError(errMsg);
        } finally {
            setRequestingMedia(false);
        }
    };

    // Sight warnings popup effect
    useEffect(() => {
        if (!isWebcamActive || !isStarted || !hasEnteredEx || result || submitting) return;

        // Triggers warning overlay every 2.5 minutes (150 seconds)
        const warningInterval = setInterval(() => {
            setShowSightWarning(true);

            // Dismiss after 10 seconds
            setTimeout(() => {
                setShowSightWarning(false);
            }, 10000);

        }, 150000);

        return () => clearInterval(warningInterval);
    }, [isWebcamActive, isStarted, hasEnteredEx, result, submitting]);

    // Chat & Broadcast state
    const [chatOpen, setChatOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [unreadChat, setUnreadChat] = useState(0);
    const [broadcast, setBroadcast] = useState(null);
    const chatEndRef = useRef(null);
    const chatOpenRef = useRef(false);

    // Per-question time tracking
    const questionTimeRef = useRef({}); // { [questionId]: totalSecondsSpent }
    const questionStartRef = useRef(null); // timestamp when current Q was shown

    const violationsRef = useRef({
        tabSwitches: 0,
        fullScreenExits: 0,
        copyAttempts: 0,
        devToolsAttempts: 0,
        windowBlurs: 0,
        overlaysDetected: 0,
        idleTimeouts: 0
    });

    // Identity Validation and Storage
    useEffect(() => {
        if (!studentName || !rollNumber) {
            navigate(student ? '/student/dashboard' : '/');
            return;
        }
        localStorage.setItem('std_name', studentName);
        localStorage.setItem('std_roll', rollNumber);
        localStorage.setItem('std_mobile', mobile || '');
    }, [studentName, rollNumber, mobile, navigate]);

    // Initialize Real-time Connection
    useEffect(() => {
        const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
        const isVercelServer = socketUrl.includes('vercel.app');
        socket.current = isVercelServer 
            ? { on: () => {}, off: () => {}, emit: () => {}, disconnect: () => {} }
            : io(socketUrl);

        socket.current.emit('student_join', {
            examKey: key,
            studentName,
            rollNumber,
            mobile,
            studentId: rollNumber
        });

        socket.current.on('session_started', () => {
            setIsStarted(true);
        });

        socket.current.on('session_ended', (data) => {
            if (data?.resetRollNumber && data.resetRollNumber !== rollNumber) {
                return; // Ignore reset if targeted for a different student
            }
            window.location.reload();
        });

        socket.current.on('session_paused', () => {
            setIsPaused(true);
        });

        socket.current.on('session_resumed', () => {
            setIsPaused(false);
        });

        // Chat listeners
        socket.current.emit('fetch_chat_history', { examKey: key });
        socket.current.on('chat_history', (msgs) => {
            // Filter so students only see their own messages and trainer messages
            setChatMessages(msgs.filter(m => m.senderRole === 'trainer' || m.senderId === rollNumber));
        });
        socket.current.on('chat_message', (msg) => {
            // Filter new incoming messages
            if (msg.senderRole === 'trainer' || msg.senderId === rollNumber) {
                setChatMessages(prev => [...prev, msg]);
                if (!chatOpenRef.current && msg.senderRole === 'trainer') {
                    setUnreadChat(prev => prev + 1);
                }
            }
        });

        // Broadcast listener
        socket.current.on('broadcast_announcement', (data) => {
            setBroadcast(data);
            // Auto-dismiss after 10 seconds
            setTimeout(() => setBroadcast(null), 10000);
        });

        return () => {
            if (socket.current) socket.current.disconnect();
        };
    }, [key, studentName, rollNumber, mobile]);

    // Report Real-time Progress
    useEffect(() => {
        if (!loading && socket.current && questions.length > 0) {
            const answeredCount = Object.keys(answers).length;
            const progress = Math.round((answeredCount / questions.length) * 100);

            socket.current.emit('student_progress', {
                examKey: key,
                studentId: rollNumber,
                progress
            });
        }
    }, [answers, questions.length, loading, key, rollNumber]);

    // Track time per question â€” record when we leave a question
    const flushCurrentQuestionTime = useCallback(() => {
        if (questionStartRef.current && questions.length > 0) {
            const qId = questions[currentQuestion]?.id?.toString();
            if (qId) {
                const elapsed = Math.round((Date.now() - questionStartRef.current) / 1000);
                questionTimeRef.current[qId] = (questionTimeRef.current[qId] || 0) + elapsed;
            }
        }
        questionStartRef.current = Date.now();
    }, [currentQuestion, questions]);

    // Reset timer when question changes
    useEffect(() => {
        if (!loading && isStarted && hasEnteredEx) {
            questionStartRef.current = Date.now();
        }
    }, [currentQuestion, loading, isStarted, hasEnteredEx]);


    // Fetch Assessment Content
    useEffect(() => {
        const fetchExamData = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/exam/details/${key}?rollNumber=${rollNumber}`);

                if (res.data.isCompleted) {
                    setResult(res.data.data);
                    setLoading(false);
                    return;
                }

                const { exam: examInfo, questions: qList, existingAnswers } = res.data.data;

                setExam(examInfo);
                setQuestions(qList);
                setAnswers(existingAnswers || {});
                setTimeLeft(examInfo.duration * 60);
                setIsStarted(examInfo.isStarted || false);
                setIsPaused(examInfo.isPaused || false);

                // Initialize or Resume Attempt
                const startRes = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/exam/start-attempt`, {
                    examId: examInfo.id,
                    sessionId: examInfo.sessionId,
                    trainerId: examInfo.trainerId,
                    studentDetails: {
                        name: studentName,
                        rollNumber: rollNumber,
                        mobile: mobile,
                        email: email,
                        department: department || examInfo.department,
                        college: examInfo.college,
                        course: examInfo.course
                    }
                });

                if (startRes.data.newQuestions) {
                    setQuestions(startRes.data.newQuestions);
                }

                if (startRes.data?.data?.clientSessionId) {
                    localStorage.setItem('std_client_session', startRes.data.data.clientSessionId);
                }

                setLoading(false);
            } catch (error) {
                console.error('Failed to load assessment:', error);
                alert(error.response?.data?.error || 'Failed to load assessment. Please verify your access key.');
                navigate(student ? '/student/dashboard' : '/');
            }
        };

        if (key && rollNumber) fetchExamData();
    }, [key, rollNumber, studentName, mobile, navigate]);

    // Handle Selection
    const handleAnswerChange = async (questionId, selectedOption) => {
        const qType = questions.find(q => q.id === questionId)?.type || 'single_correct';
        const isMultiple = qType === 'multiple' || qType === 'multiple_correct';

        let finalAnswer;

        // Use a temporary updated answers object to get the exact value we need to send to the server
        setAnswers(prev => {
            const currentVal = prev[questionId];
            if (isMultiple) {
                const prevAns = Array.isArray(currentVal) ? currentVal : (currentVal ? [currentVal] : []);
                if (prevAns.includes(selectedOption)) {
                    finalAnswer = prevAns.filter(opt => opt !== selectedOption);
                } else {
                    finalAnswer = [...prevAns, selectedOption];
                }
            } else {
                finalAnswer = selectedOption;
            }

            // We need to trigger the API call WITH the new finalAnswer
            // Since setState is async, we do the API call outside but with the calculated finalAnswer
            syncAnswer(questionId, finalAnswer);

            return { ...prev, [questionId]: finalAnswer };
        });
    };

    const syncAnswer = async (questionId, answer) => {
        // Flush time for that question
        const qIdStr = questionId?.toString();
        const timeSpent = questionTimeRef.current[qIdStr] || 0;
        try {
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/exam/update-progress`, {
                examId: exam.id,
                rollNumber: rollNumber,
                questionId,
                answer: Array.isArray(answer) ? answer : [answer],
                timeSpent
            });
        } catch (error) {
            console.error('Failed to sync response:', error);
        }
    };

    // Compliance Management
    const handleViolation = async (type, count) => {
        setShowWarning({ type, count });
        
        const fieldMap = {
            tabSwitch: 'tabSwitches',
            fullScreen: 'fullScreenExits',
            copyPaste: 'copyAttempts',
            devTools: 'devToolsAttempts',
            windowBlur: 'windowBlurs',
            overlaysDetected: 'overlaysDetected',
            idleTimeouts: 'idleTimeouts'
        };
        const refField = fieldMap[type];
        if (refField) {
            violationsRef.current[refField] = count;
        }

        if (exam) {
            const violationData = { ...violationsRef.current };

            try {
                await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/exam/update-violations`, {
                    examId: exam.id,
                    rollNumber,
                    violations: violationData
                });
            } catch (error) {
                console.error('Failed to sync violations:', error);
            }
        }

        if (socket.current) {
            socket.current.emit('student_violation', {
                examKey: key,
                studentId: rollNumber,
                studentName,
                violationType: type,
                count
            });
        }
        if (count >= 3 && !submitting && !result) {
            handleAutoSubmit();
        }
    };

    const handleIdleDetected = useCallback(() => {
        setShowAwakeModal(true);
    }, []);

    const { warnings, triggerViolation } = useCheatDetection(
        handleViolation,
        3,
        isStarted && hasEnteredEx && !submitting && !result,
        handleIdleDetected
    );

    // Awake Modal is now purely visual and requires interaction, but no timer or violation.

    const submitExam = async (status, isAutoSubmit = false) => {
        if (submitting) return;

        // Stop all proctoring media streams first
        stopAllMediaTracks();

        try {
            setSubmitting(true);
            const violationData = { ...violationsRef.current };

            const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/exam/submit`, {
                examId: exam.id,
                rollNumber: rollNumber,
                violations: violationData,
                isAutoSubmit: isAutoSubmit || status === 'violated'
            });

            if (res.data.success) {
                if (socket.current) {
                    socket.current.emit('student_submit', {
                        examKey: key,
                        studentId: rollNumber,
                        studentName
                    });
                }

                // Set normalized result data (with review data from server)
                setResult({
                    score: res.data.score,
                    percentage: res.data.percentage,
                    totalMarks: res.data.totalMarks,
                    passingPercentage: exam.passingPercentage,
                    result: res.data.result,
                    attemptId: res.data.attemptId,
                    enableCertificate: res.data.enableCertificate || false,
                    settings: exam.settings || {},
                    studentDetails: {
                        name: studentName,
                        rollNumber: rollNumber,
                        college: exam.college,
                        course: exam.course
                    },
                    review: res.data.review || []
                });

                // Clear temporary session data
                localStorage.removeItem('std_name');
                localStorage.removeItem('std_roll');
                localStorage.removeItem('std_mobile');
                localStorage.removeItem('std_email');
                localStorage.removeItem('std_dept');
            }
        } catch (error) {
            console.error('Submission error:', error);
            setAlertState({ open: true, title: 'Network Error', message: 'A network error occurred. Please try submitting again.', type: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleAutoSubmit = () => submitExam('violated', true);

    const handleManualSubmit = () => {
        // Prevent manual submission if less than 60 seconds have elapsed
        if (exam && timeLeft > (exam.duration * 60) - 60) {
            setAlertState({
                open: true,
                title: 'Woah there, Speed Racer! 🏎️',
                message: "Less than a minute? Unless you're secretly an AI or just guessing 'C' for everything, take a breath and actually read the questions. You can't submit yet!",
                type: 'warning'
            });
            return;
        }

        setConfirmState({
            open: true,
            title: 'Finalize Assessment',
            message: 'Are you certain you wish to finalize and submit your assessment? This action cannot be undone.',
            type: 'danger',
            confirmText: 'Submit Assessment',
            onConfirm: () => submitExam('completed', false)
        });
    };

    useEffect(() => {
        if (loading || result || !isStarted || !hasEnteredEx || !exam) return;

        const timer = setInterval(() => {
            // Check for hard expiry date
            if (exam.expiryDate && new Date() > new Date(exam.expiryDate)) {
                clearInterval(timer);
                setAlertState({
                    open: true,
                    title: 'Assessment Expired',
                    message: 'The institutional deadline for this assessment has been reached. Your current responses are being submitted automatically.',
                    type: 'warning'
                });
                setTimeout(() => submitExam('completed', true), 2000);
                return;
            }

            if (isPaused) return;

            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [loading, result, isStarted, hasEnteredEx, exam]);

    useEffect(() => {
        if (!loading && !result && timeLeft === 0 && exam) {
            submitExam('completed', true);
        }
    }, [timeLeft, loading, exam, result]);

    // Fallback polling for exam session state (started / paused / closed)
    useEffect(() => {
        if (loading || result || !exam) return;

        const checkStatusInterval = setInterval(async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/exam/settings/${key}`);
                if (res.data.success) {
                    const { isStarted: serverStarted, isPaused: serverPaused, isActive: serverActive } = res.data.data;
                    
                    if (serverStarted !== undefined && serverStarted !== isStarted) {
                        setIsStarted(serverStarted);
                    }
                    if (serverPaused !== undefined && serverPaused !== isPaused) {
                        setIsPaused(serverPaused);
                    }
                    if (serverActive === false && !submitting && !result) {
                        // Session has been forced closed by instructor
                        window.location.reload();
                    }
                }
            } catch (err) {
                console.error('Failed to poll exam status:', err);
            }
        }, 5000);

        return () => clearInterval(checkStatusInterval);
    }, [loading, result, isStarted, isPaused, exam, key, submitting]);

    const handleDownloadQuestionPaper = () => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const questionsHtml = questions.map((q, i) => {
            let optionsHtml = '';
            if (q.options && q.options.length > 0) {
                optionsHtml = `
                    <ul style="list-style-type: upper-alpha; margin-left: 20px; font-family: 'Inter', sans-serif; font-size: 14px; color: #334155; line-height: 1.8; margin-top: 8px;">
                        ${q.options.map(opt => `<li>${opt}</li>`).join('')}
                    </ul>
                `;
            }
            return `
                <div style="margin-bottom: 25px; border-bottom: 1px solid #e2e8f0; padding-bottom: 15px;">
                    <p style="font-family: 'Inter', sans-serif; font-size: 15px; font-weight: 600; color: #1e293b; margin: 0 0 8px 0; line-height: 1.5;">
                        Q${i + 1}. ${q.text} <span style="float: right; font-size: 12px; color: #64748b; font-weight: normal;">[Points: ${q.points || 1}]</span>
                    </p>
                    ${optionsHtml}
                </div>
            `;
        }).join('');

        printWindow.document.write(`
            <html>
                <head>
                    <title>${exam?.title || 'Question Paper'}</title>
                    <style>
                        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
                        body { font-family: 'Inter', sans-serif; padding: 40px; color: #1e293b; max-width: 800px; margin: 0 auto; line-height: 1.5; }
                        .header { border-bottom: 2px solid #004AAD; padding-bottom: 20px; margin-bottom: 30px; text-align: center; }
                        .header h1 { font-size: 24px; font-weight: 800; color: #0f172a; margin: 0 0 10px 0; }
                        .header p { font-size: 14px; color: #64748b; margin: 5px 0; font-weight: 500; }
                        .footer { border-top: 1px solid #e2e8f0; padding-top: 15px; margin-top: 40px; text-align: center; font-size: 11px; color: #94a3b8; font-weight: 500; }
                        .no-print-btn { background-color: #004AAD; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; font-size: 13px; cursor: pointer; transition: background-color 0.2s; }
                        .no-print-btn:hover { background-color: #003580; }
                        @media print {
                            body { padding: 20px; }
                            .no-print { display: none; }
                        }
                    </style>
                </head>
                <body>
                    <div class="no-print" style="margin-bottom: 20px; text-align: right;">
                        <button class="no-print-btn" onclick="window.print()">Print / Save as PDF</button>
                    </div>
                    <div class="header">
                         <img src="/assets/cropped-New-logo-footer-270x270.png" alt="Logo" style="height: 40px; width: 40px; margin-bottom: 10px;" />
                         <h1>${exam?.title || 'Assessment Question Paper'}</h1>
                         <p><strong>Duration:</strong> ${exam?.duration || ''} Min | <strong>Total Questions:</strong> ${questions.length} | <strong>Total Marks:</strong> ${questions.reduce((acc, q) => acc + (parseInt(q.points) || 0), 0)}</p>
                         <p style="text-transform: uppercase; font-size: 10px; tracking-spacing: 0.1em; color: #004AAD; font-weight: bold;">Ethnotech Academy Assessment Portal</p>
                    </div>
                    <div class="content">
                         ${questionsHtml}
                    </div>
                    <div class="footer">
                         Ethnotech Academy &copy; 2026. Secure Assessment Platform.
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // Chat send handler
    const handleSendChat = () => {
        const msg = chatInput.trim();
        if (!msg || !socket.current) return;
        socket.current.emit('chat_message', {
            examKey: key,
            senderRole: 'student',
            senderName: studentName,
            senderId: rollNumber,
            message: msg
        });
        setChatInput('');
    };

    // Auto-scroll chat
    useEffect(() => {
        if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages, chatOpen]);

    // Reset unread when chat opened
    useEffect(() => {
        if (chatOpen) setUnreadChat(0);
        chatOpenRef.current = chatOpen;
    }, [chatOpen]);

    if (isPaused) {
        return (
            <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-md animate-in fade-in">
                <div className="bg-white max-w-md w-full p-10 rounded-[3rem] shadow-2xl text-center border border-slate-200/20">
                    <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle className="text-amber-500" size={40} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-3">Session Paused</h2>
                    <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                        The instructor has temporarily paused this assessment. Your progress is saved and the timer has been halted.
                    </p>
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100">
                        <Loader2 className="animate-spin text-slate-400" size={18} />
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Waiting to resume...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (submitting) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-6">
                <Loader2 className="animate-spin text-primary" size={64} strokeWidth={1.5} />
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-900">Finalizing Evaluation</h2>
                    <p className="text-slate-500 font-medium mt-2 animate-pulse">Your responses are being recorded and validated...</p>
                </div>
            </div>
        );
    }

    if (result) {
        const showResult = result.settings?.showResultImmediately !== false;
        const allowReview = result.settings?.allowReview !== false;

        const isPassed = parseFloat(result.percentage) >= parseFloat(result.passingPercentage);
        const review = result.review || [];
        const correctCount = review.filter(r => r.isCorrect).length;
        const incorrectCount = review.filter(r => !r.isCorrect && r.studentAnswer?.length > 0).length;
        const skippedCount = review.filter(r => !r.studentAnswer || r.studentAnswer.length === 0 || (Array.isArray(r.studentAnswer) && r.studentAnswer.every(a => !a))).length;

        const filteredReview = reviewTab === 'correct' ? review.filter(r => r.isCorrect)
            : reviewTab === 'incorrect' ? review.filter(r => !r.isCorrect)
                : review;

        const formatTimeSpent = (secs) => {
            if (!secs) return '—';
            if (secs < 60) return `${secs}s`;
            return `${Math.floor(secs / 60)}m ${secs % 60}s`;
        };

        return (
            <div className="min-h-screen bg-[#f8f9fb]" style={{ fontFamily: "'Inter', sans-serif" }}>
                {/* ——— Top Hero Banner ——— */}
                <div className="relative bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 70% 20%, rgba(0,74,173,0.15) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(16,185,129,0.08) 0%, transparent 50%)' }} />
                    <div className="max-w-3xl mx-auto px-6 pt-10 pb-28 relative z-10">
                        <div className="flex items-center gap-2.5 justify-center mb-10">
                            <img src="/assets/cropped-New-logo-footer-270x270.png" alt="Ethnotech" className="h-8 w-8 brightness-0 invert opacity-90" />
                            <span className="text-white/90 text-sm font-semibold tracking-wide">Ethnotech Academy</span>
                        </div>
                        <div className="text-center">
                            <p className="text-[11px] font-semibold text-blue-400 uppercase tracking-[0.2em] mb-3">Assessment Report</p>
                            <h1 className="text-3xl md:text-[2.75rem] font-extrabold text-white leading-tight tracking-tight">Assessment Complete</h1>
                            <p className="text-slate-400 text-[15px] mt-3 font-normal max-w-md mx-auto leading-relaxed">Your responses have been securely recorded and evaluated.</p>
                        </div>
                    </div>
                </div>

                {/* ——— Main Content ——— */}
                <div className="max-w-3xl w-full mx-auto px-5 relative -mt-16 z-20 pb-20">
                    {/* Score Card */}
                    <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-slate-200/80 overflow-hidden mb-6">
                        {showResult ? (
                            <>
                                <div className="p-7 md:p-9">
                                    <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-10">
                                        {/* Score */}
                                        <div className="flex-1 text-center md:text-left">
                                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.15em] mb-1">Your Score</p>
                                            <div className="flex items-baseline gap-1 justify-center md:justify-start">
                                                <span className="text-6xl md:text-7xl font-extrabold text-slate-900 tabular-nums leading-none">{result.percentage}</span>
                                                <span className="text-2xl font-semibold text-slate-400">%</span>
                                            </div>
                                            <div className="mt-4">
                                                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold ${isPassed ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80' : 'bg-rose-50 text-rose-700 border border-rose-200/80'
                                                    }`}>
                                                    {isPassed ? <Trophy size={15} /> : <XCircle size={15} />}
                                                    {isPassed ? 'Passed' : 'Not Passed'}
                                                </span>
                                            </div>
                                        </div>
                                        {/* Marks & Pass */}
                                        <div className="flex gap-3 w-full md:w-auto">
                                            <div className="flex-1 md:w-28 bg-slate-50 border border-slate-100 rounded-xl p-4 text-center">
                                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Marks</p>
                                                <p className="text-xl font-bold text-slate-800">{result.score}<span className="text-sm font-medium text-slate-400">/{result.totalMarks}</span></p>
                                            </div>
                                            <div className="flex-1 md:w-28 bg-slate-50 border border-slate-100 rounded-xl p-4 text-center">
                                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Pass Mark</p>
                                                <p className="text-xl font-bold text-slate-800">{result.passingPercentage}%</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Progress bar */}
                                <div className="px-7 md:px-9 pb-7 md:pb-9">
                                    <div className="flex justify-between text-[11px] font-medium text-slate-400 mb-2">
                                        <span>Performance</span>
                                        <span>{result.score} / {result.totalMarks} pts</span>
                                    </div>
                                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 ease-out ${isPassed ? 'bg-emerald-500' : 'bg-rose-500'
                                                }`}
                                            style={{ width: `${Math.max(result.percentage, 2)}%` }}
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-14 px-6">
                                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5 border border-emerald-100">
                                    <CheckCircle2 className="text-emerald-500" size={32} />
                                </div>
                                <h2 className="text-xl font-bold text-slate-900 mb-2">Submission Successful</h2>
                                <p className="text-slate-500 text-sm font-normal max-w-sm mx-auto leading-relaxed">Your answers have been submitted. Results will be shared by your institution.</p>
                            </div>
                        )}
                    </div>

                    {/* Stats Row */}
                    {allowReview && showResult && review.length > 0 && (
                        <div className="grid grid-cols-3 gap-3 mb-8">
                            <div className="bg-white rounded-xl border border-slate-200/80 p-5 text-center shadow-sm">
                                <CheckCircle2 size={18} className="text-emerald-500 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-slate-900">{correctCount}</p>
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Correct</p>
                            </div>
                            <div className="bg-white rounded-xl border border-slate-200/80 p-5 text-center shadow-sm">
                                <XCircle size={18} className="text-rose-500 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-slate-900">{incorrectCount}</p>
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Incorrect</p>
                            </div>
                            <div className="bg-white rounded-xl border border-slate-200/80 p-5 text-center shadow-sm">
                                <BookOpen size={18} className="text-slate-400 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-slate-900">{skippedCount}</p>
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Skipped</p>
                            </div>
                        </div>
                    )}

                    {/* Review Section */}
                    {allowReview && review.length > 0 && (
                        <div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                                <h2 className="text-lg font-bold text-slate-900">Response Review</h2>
                                <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200/80">
                                    {[
                                        { id: 'all', label: `All (${review.length})` },
                                        { id: 'correct', label: `Correct (${correctCount})` },
                                        { id: 'incorrect', label: `Wrong (${incorrectCount + skippedCount})` },
                                    ].map(tab => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setReviewTab(tab.id)}
                                            className={`px-3.5 py-1.5 text-[11px] font-semibold rounded-md transition-all ${reviewTab === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                                }`}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                {filteredReview.map((q, idx) => {
                                    const studentAns = Array.isArray(q.studentAnswer) ? q.studentAnswer : (q.studentAnswer ? [q.studentAnswer] : []);
                                    const isSkipped = studentAns.length === 0 || studentAns.every(a => !a);
                                    const correctAns = Array.isArray(q.correctAnswer) ? q.correctAnswer : (q.correctAnswer ? [q.correctAnswer] : []);
                                    return (
                                        <div key={q.id || idx} className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
                                            <div className={`px-5 py-4 flex items-start justify-between gap-4 border-l-[3px] ${isSkipped ? 'border-l-slate-300 bg-slate-50/50' : q.isCorrect ? 'border-l-emerald-500 bg-emerald-50/30' : 'border-l-rose-500 bg-rose-50/30'
                                                }`}>
                                                <div className="flex gap-3 flex-1 min-w-0">
                                                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5 ${isSkipped ? 'bg-slate-200 text-slate-500' : q.isCorrect ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                                                        }`}>{idx + 1}</span>
                                                    <p className="text-[13px] font-medium text-slate-800 leading-relaxed pt-0.5">{q.text}</p>
                                                </div>
                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                    {q.timeSpent > 0 && <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1"><Timer size={11} />{formatTimeSpent(q.timeSpent)}</span>}
                                                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-md ${isSkipped ? 'bg-slate-100 text-slate-400' : q.isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                                                        }`}>{isSkipped ? 'Skipped' : q.isCorrect ? `+${q.marksObtained}` : `0/${q.points}`}</span>
                                                </div>
                                            </div>
                                            <div className="px-5 py-4 border-t border-slate-100">
                                                {q.options && q.options.length > 0 ? (
                                                    <div className="space-y-2">
                                                        {q.options.map((opt, oi) => {
                                                            const isCorrectOpt = correctAns.includes(opt);
                                                            const isStudentOpt = studentAns.includes(opt);
                                                            return (
                                                                <div key={oi} className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-[13px] ${isCorrectOpt && isStudentOpt ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
                                                                    isCorrectOpt ? 'bg-emerald-50/60 border-emerald-200/70 text-emerald-700' :
                                                                        isStudentOpt ? 'bg-rose-50 border-rose-200 text-rose-700' :
                                                                            'bg-white border-slate-100 text-slate-500'
                                                                    }`}>
                                                                    {isCorrectOpt ? <CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0" />
                                                                        : isStudentOpt ? <XCircle size={15} className="text-rose-500 flex-shrink-0" />
                                                                            : <div className="w-[15px] flex-shrink-0" />}
                                                                    <span className="font-medium flex-1">{opt}</span>
                                                                    {isCorrectOpt && !isStudentOpt && <span className="text-[10px] font-semibold text-emerald-600">Correct</span>}
                                                                    {isStudentOpt && !isCorrectOpt && <span className="text-[10px] font-semibold text-rose-600">Your answer</span>}
                                                                    {isStudentOpt && isCorrectOpt && <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1"><Check size={11} />Correct</span>}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <div className="flex gap-3">
                                                        <div className={`flex-1 p-3.5 rounded-lg border ${q.isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-100'}`}>
                                                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Your answer</p>
                                                            <p className={`text-sm font-semibold ${isSkipped ? 'text-slate-400 italic' : q.isCorrect ? 'text-emerald-700' : 'text-slate-800'}`}>{isSkipped ? 'No answer' : studentAns.join(', ')}</p>
                                                        </div>
                                                        {!q.isCorrect && (
                                                            <div className="flex-1 p-3.5 rounded-lg border bg-emerald-50 border-emerald-200">
                                                                <p className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider mb-1">Correct</p>
                                                                <p className="text-sm font-semibold text-emerald-700">{correctAns.join(', ')}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Footer Actions */}
                    <div className="mt-10 flex flex-col sm:flex-row gap-3">
                        {result.enableCertificate && isPassed && result.attemptId && (
                            <button
                                onClick={async () => {
                                    try {
                                        setCertDownloading(true);
                                        const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                                        const res = await fetch(`${apiBase}/exam/certificate/${result.attemptId}?rollNumber=${encodeURIComponent(rollNumber)}`, { method: 'GET' });
                                        if (!res.ok) { const err = await res.json(); throw new Error(err.error || 'Certificate not available'); }
                                        const blob = await res.blob();
                                        const url = URL.createObjectURL(blob);
                                        const a = document.createElement('a');
                                        a.href = url; a.download = `Certificate_${rollNumber}.pdf`; a.click();
                                        URL.revokeObjectURL(url);
                                    } catch (err) { setAlertState({ open: true, title: 'Certificate Error', message: err.message, type: 'error' }); }
                                    finally { setCertDownloading(false); }
                                }}
                                disabled={certDownloading}
                                className="flex-1 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60"
                            >
                                {certDownloading ? <><Loader2 size={16} className="animate-spin" /> Generating...</> : <><Award size={16} /> Download Certificate</>}
                            </button>
                        )}
                        <button
                            onClick={handleDownloadQuestionPaper}
                            className="flex-1 py-3.5 rounded-xl bg-[#004AAD] hover:bg-[#003580] text-white font-semibold text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            <FileText size={15} /> Print Question Paper
                        </button>
                        <button
                            onClick={() => navigate(student ? '/student/dashboard' : '/')}
                            className="flex-1 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            Exit Session <ArrowRight size={15} />
                        </button>
                    </div>

                    {/* Footer Logos */}
                    <div className="flex items-center justify-center gap-6 mt-10 opacity-30 grayscale">
                        <img src="/assets/Skill-India-1.png" alt="Skill India" className="h-6 w-auto" />
                        <img src="/assets/NSDC.png" alt="NSDC" className="h-6 w-auto" />
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8f9fb] flex flex-col items-center justify-center font-sans">
                <div className="w-16 h-16 relative flex items-center justify-center mb-6">
                    <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                    <img src="/assets/cropped-New-logo-footer-270x270.png" alt="Logo" className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Initializing Environment</h3>
                <p className="text-[13px] font-medium text-slate-400 tracking-wide">Establishing secure connection...</p>
            </div>
        );
    }

    if (!loading && (!questions || questions.length === 0) && !result && !submitting) {
        return (
            <div className="min-h-screen bg-[#f8f9fb] flex flex-col items-center justify-center p-6 text-center font-sans">
                <div className="bg-white p-10 md:p-12 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-t-[6px] border-t-amber-500 max-w-lg w-full flex flex-col items-center">
                    <div className="w-20 h-20 bg-amber-50 rounded-2xl flex items-center justify-center mb-8 border border-amber-100">
                        <AlertTriangle size={40} className="text-amber-500" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">No Questions Configured</h2>
                    <p className="text-slate-500 text-[15px] leading-relaxed mb-8">
                        This assessment is currently active but does not contain any questions. Please notify your instructor or institution administrator.
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                        Return to Portal <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        );
    }

    if (!isStarted && !result && !submitting) {
        return (
            <div className="min-h-screen bg-[#f8f9fb] flex flex-col items-center justify-center p-6 text-center font-sans">
                <div className="bg-white p-10 md:p-12 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-slate-200/80 max-w-lg w-full flex flex-col items-center relative overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(0,74,173,0.05) 0%, transparent 60%)' }} />
                    <div className="w-20 h-20 bg-blue-50/50 rounded-2xl flex items-center justify-center mb-8 relative border border-blue-100/50">
                        <Clock size={36} className="text-blue-600" />
                        <span className="absolute top-[-4px] right-[-4px] flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
                        </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">Waiting Room</h2>
                    <p className="text-slate-500 text-[15px] leading-relaxed mb-8 max-w-sm">The assessment will begin automatically once the instructor starts the session. Please do not close this window.</p>

                    {exam?.expiryDate && (
                        <div className="mb-8 w-full bg-amber-50/50 text-amber-800 px-5 py-4 rounded-xl border border-amber-200/50 flex flex-col items-center gap-2">
                            <div className="flex items-center gap-2 text-[13px] font-semibold"><AlertTriangle size={16} className="text-amber-500" /> Deadline Alert</div>
                            <span className="text-sm font-medium">Must complete before {new Date(exam.expiryDate).toLocaleString()}</span>
                        </div>
                    )}

                    <div className="w-full bg-slate-50/50 border border-slate-200/60 rounded-xl py-4 flex items-center justify-center gap-3 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>
                        <Loader2 size={18} className="animate-spin text-slate-400" />
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Awaiting Instructor</span>
                    </div>
                </div>
            </div>
        );
    }

    if (isStarted && !hasEnteredEx && !result && !submitting) {
        const needsWebcam = exam?.settings?.requireWebcam;
        const needsMic = exam?.settings?.requireMic;
        const needsScreen = exam?.settings?.requireScreenshare;
        const hasProctoring = needsWebcam || needsMic || needsScreen;

        return (
            <div className="min-h-screen bg-[#f8f9fb] flex flex-col items-center justify-center p-6 text-center font-sans">
                <div className="bg-white p-10 md:p-12 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-200 border-t-4 border-t-emerald-500 max-w-lg w-full flex flex-col items-center">
                    <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center mb-8 relative border border-emerald-100">
                        <Check size={40} className="text-emerald-500" />
                        <span className="absolute top-[-4px] right-[-4px] flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
                        </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">Session Started</h2>
                    <p className="text-slate-500 text-[15px] leading-relaxed mb-6">The instructor has initiated the assessment. Please confirm setup to begin securely.</p>

                    {hasProctoring && (
                        <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-6 text-left">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                <ShieldCheck size={14} className="text-[#004AAD]" /> Security Verification Required
                            </h4>
                            <div className="space-y-2.5">
                                {needsWebcam && (
                                    <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                                        <div className="w-6 h-6 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                                            <Video size={13} />
                                        </div>
                                        <span>Webcam Feed Authorization</span>
                                    </div>
                                )}
                                {needsMic && (
                                    <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                                        <div className="w-6 h-6 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                                            <Mic size={13} />
                                        </div>
                                        <span>Microphone Level Check</span>
                                    </div>
                                )}
                                {needsScreen && (
                                    <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                                        <div className="w-6 h-6 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                                            <Monitor size={13} />
                                        </div>
                                        <span>Desktop Screenshare Session</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {mediaError && (
                        <div className="w-full bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl p-4 mb-6 text-xs font-semibold text-left flex items-start gap-2.5">
                            <span className="text-sm">⚠️</span>
                            <div>
                                <p className="font-bold">Device Setup Failed</p>
                                <p className="text-rose-600 font-medium mt-0.5 leading-relaxed">{mediaError}</p>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleStartExam}
                        disabled={requestingMedia}
                        className="w-full bg-[#004AAD] hover:bg-[#003580] text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-500/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-75"
                    >
                        {requestingMedia ? (
                            <>
                                <Loader2 className="animate-spin" size={18} />
                                Configuring Secure Stream...
                            </>
                        ) : (
                            <>
                                Enter Fullscreen & Begin <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                    <p className="mt-6 text-[11px] font-semibold text-slate-400 max-w-[250px] leading-relaxed">
                        Exiting full screen or altering window focus will log a security violation.
                    </p>
                </div>
            </div>
        );
    }

    const currentQ = questions[currentQuestion];

    return (
        <div className="min-h-screen bg-[#f8f9fb] flex flex-col overflow-hidden select-none" style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* Header */}
            <header className="bg-white border-b border-slate-200/80 px-6 py-3.5 flex items-center justify-between z-50 shadow-sm relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(90deg, rgba(0,74,173,0.02) 0%, transparent 100%)' }} />
                <div className="flex items-center gap-3.5 relative z-10">
                    <img src="/assets/cropped-New-logo-footer-270x270.png" alt="Ethnotech" className="h-9 w-9" />
                    <div className="leading-none hidden sm:block mt-0.5">
                        <span className="text-[15px] font-extrabold text-slate-800 tracking-tight block">Ethnotech</span>
                        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#004AAD] mt-0.5 block">Academy</span>
                    </div>
                    <div className="h-7 w-px bg-slate-200 mx-1 hidden md:block" />
                    <div className="hidden md:block">
                        <h1 className="text-[13px] font-bold text-slate-900 uppercase tracking-wide line-clamp-1 truncate max-w-[250px] lg:max-w-none">{exam?.title}</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1.5 tracking-wider uppercase">
                                <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span></span>
                                Secure Assessment Active
                            </p>
                            {isWebcamActive && (
                                <span className="h-4 w-px bg-slate-200 mx-1" />
                            )}
                            {isWebcamActive && (
                                <span className="flex items-center gap-1 text-[9px] font-extrabold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded px-1.5 py-0.5 uppercase tracking-wider">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
                                    Cam
                                </span>
                            )}
                            {isMicActive && (
                                <span className="flex items-center gap-1 text-[9px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded px-1.5 py-0.5 uppercase tracking-wider">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                                    Mic
                                </span>
                            )}
                            {isScreenActive && (
                                <span className="flex items-center gap-1 text-[9px] font-extrabold text-blue-600 bg-blue-50 border border-blue-100 rounded px-1.5 py-0.5 uppercase tracking-wider">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                                    Screen
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 relative z-10">
                    <div className="flex items-center gap-2.5 bg-slate-900 px-4 py-2 rounded-lg text-white shadow-md border border-slate-800">
                        <Clock size={15} className={timeLeft < 300 ? 'text-amber-400 animate-pulse' : 'text-slate-400'} />
                        <span className="text-base font-mono font-bold tracking-tight tabular-nums mt-0.5">{formatTime(timeLeft)}</span>
                    </div>

                    <button
                        onClick={handleManualSubmit}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg text-[11px] font-bold transition-all shadow-md active:scale-95 flex items-center gap-2 uppercase tracking-widest border border-emerald-500"
                    >
                        Submit
                        <Send size={13} />
                    </button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden p-5 gap-5 relative z-10">
                {/* Main Content */}
                <div className="flex-1 flex flex-col gap-5 overflow-hidden">
                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.04)] flex-1 flex flex-col relative overflow-hidden">
                        <div className="h-1.5 bg-slate-100 flex w-full">
                            <div
                                className="h-full transition-all duration-700 ease-out bg-gradient-to-r from-blue-500 to-blue-400"
                                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                            />
                        </div>

                        <div className="px-8 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <span className="bg-blue-50 text-blue-700 border border-blue-100 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[13px]">
                                    {currentQuestion + 1}
                                </span>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Question {currentQuestion + 1} of {questions.length}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                {/* Navigation Buttons at the Top */}
                                <div className="flex gap-2">
                                    <button
                                        disabled={currentQuestion === 0}
                                        onClick={() => {
                                            flushCurrentQuestionTime();
                                            setCurrentQuestion(prev => prev - 1);
                                        }}
                                        className="px-3.5 py-1.5 bg-white border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50 transition-all text-slate-600 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-sm"
                                    >
                                        <ChevronLeft size={13} /> Prev
                                    </button>
                                    {currentQuestion === questions.length - 1 ? (
                                        <button
                                            onClick={handleManualSubmit}
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                                        >
                                            Submit <Send size={11} />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                flushCurrentQuestionTime();
                                                setCurrentQuestion(prev => prev + 1);
                                            }}
                                            className="bg-slate-900 hover:bg-black text-white px-4 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-wider transition-all flex items-center gap-1 shadow-sm active:scale-95"
                                        >
                                            Next <ChevronRight size={13} />
                                        </button>
                                    )}
                                </div>
                                <div className="px-3.5 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-500 uppercase tracking-widest shadow-sm">
                                    Points: {currentQ?.points || 1}
                                </div>
                            </div>
                        </div>

                        <div className="p-8 md:p-10 flex-1 overflow-y-auto custom-scrollbar">
                            <h2 className="text-xl md:text-2xl font-bold text-slate-800 leading-relaxed mb-8 break-words whitespace-pre-wrap">
                                {currentQ?.text}
                            </h2>

                            <div className="grid grid-cols-1 gap-4 max-w-4xl">
                                {currentQ?.type === 'coding' ? (
                                    <div className="flex flex-col h-[350px] border border-slate-700 bg-[#1e1e1e] rounded-2xl overflow-hidden shadow-xl w-full">
                                        <div className="flex justify-between items-center bg-[#2d2d2d] px-4 py-3 border-b border-black/40 shadow-sm">
                                            <div className="flex gap-2">
                                                <div className="w-3 h-3 rounded-full bg-rose-500 shadow-inner" />
                                                <div className="w-3 h-3 rounded-full bg-amber-500 shadow-inner" />
                                                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-inner" />
                                            </div>
                                            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest">{currentQ.codingDetails?.language || 'JavaScript'} Engine</span>
                                        </div>
                                        <textarea
                                            spellCheck={false}
                                            value={answers[currentQ.id] || currentQ.codingDetails?.initialCode || ''}
                                            onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                                            className="flex-1 w-full bg-transparent text-[#d4d4d4] font-mono text-[14px] p-6 outline-none resize-none leading-relaxed placeholder:text-slate-600 focus:ring-0 focus:outline-none focus:bg-[#1a1a1a] transition-colors"
                                            placeholder="// Write your solution here..."
                                        />
                                    </div>
                                ) : currentQ?.type === 'descriptive' ? (
                                    <textarea
                                        value={answers[currentQ.id] || ''}
                                        onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                                        className="w-full h-56 px-6 py-5 rounded-2xl border-2 border-slate-200 text-slate-700 bg-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none resize-none transition-all shadow-sm"
                                        placeholder="Type your detailed answer here..."
                                    />
                                ) : currentQ?.type === 'fill_blank' || currentQ?.type === 'numeric' ? (
                                    <input
                                        type={currentQ?.type === 'numeric' ? "number" : "text"}
                                        value={answers[currentQ.id] || ''}
                                        onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                                        className="w-full px-6 py-4 rounded-xl border-2 border-slate-200 text-slate-700 font-semibold text-base bg-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all shadow-sm"
                                        placeholder={currentQ?.type === 'numeric' ? "Enter numeric value..." : "Type your answer..."}
                                    />
                                ) : (
                                    <div className="grid gap-3">
                                        {currentQ?.options?.map((option, i) => {
                                            const isSelected = Array.isArray(answers[currentQ.id]) ? answers[currentQ.id].includes(option) : answers[currentQ.id] === option;
                                            return (
                                                <button
                                                    key={i}
                                                    onClick={() => handleAnswerChange(currentQ.id, option)}
                                                    className={`
                                                        w-full flex items-center p-5 rounded-xl border-2 text-left transition-all duration-200 group
                                                        ${isSelected
                                                            ? 'border-blue-500 bg-blue-50/50 shadow-[0_2px_12px_rgba(59,130,246,0.12)]'
                                                            : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50 shadow-sm'}
                                                    `}
                                                >
                                                    <div className={`
                                                        w-7 h-7 rounded-lg border-2 flex items-center justify-center font-bold text-[11px] transition-all flex-shrink-0
                                                        ${isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 text-slate-500 group-hover:border-slate-400'}
                                                    `}>
                                                        {String.fromCharCode(65 + i)}
                                                    </div>
                                                    <span className={`ml-4 font-semibold text-[15px] ${isSelected ? 'text-blue-900' : 'text-slate-700'}`}>
                                                        {option}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="px-8 py-5 border-t border-slate-100 flex justify-between items-center bg-white/50">
                            <button
                                onClick={() => setMarked(prev => prev.includes(currentQ.id) ? prev.filter(id => id !== currentQ.id) : [...prev, currentQ.id])}
                                className={`px-4 py-2.5 rounded-lg border font-bold text-[10px] uppercase tracking-wider transition-all flex items-center gap-1.5 ${marked.includes(currentQ.id) ? 'bg-amber-100 border-amber-200 text-amber-700' : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
                            >
                                <AlertTriangle size={14} className={marked.includes(currentQ.id) ? 'text-amber-500' : ''} />
                                {marked.includes(currentQ.id) ? 'Review Mode Active' : 'Mark for Review'}
                            </button>

                            {currentQuestion === questions.length - 1 && (
                                <button
                                    onClick={handleManualSubmit}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold text-xs shadow-xl active:scale-95 transition-all flex items-center gap-2 uppercase tracking-widest"
                                >
                                    Submit Assessment <Send size={14} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tracking Sidebar */}
                <div className="hidden xl:flex w-[22rem] flex-col gap-6 relative z-10">
                    {/* Webcam Stream Card in Sidebar */}
                    {isWebcamActive && (
                        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.04)] flex flex-col overflow-hidden">
                            <div className="relative aspect-video w-full rounded-xl bg-slate-950 overflow-hidden shadow-inner border border-slate-800">
                                <video
                                    ref={(el) => {
                                        if (el && webcamStreamRef.current && el.srcObject !== webcamStreamRef.current) {
                                            el.srcObject = webcamStreamRef.current;
                                        }
                                    }}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="w-full h-full object-cover scale-x-[-1]"
                                />
                                
                                {/* Recording status dot */}
                                <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded-full border border-white/10">
                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                                    <span className="text-[8px] font-bold text-white uppercase tracking-wider">LIVE</span>
                                </div>

                                {/* Sight warning popup directly on the webcam video */}
                                {showSightWarning && (
                                    <div className="absolute inset-0 bg-rose-900/95 flex flex-col items-center justify-center p-2 text-center animate-in fade-in duration-300">
                                        <AlertTriangle className="text-amber-400 animate-bounce mb-1" size={20} />
                                        <p className="text-[9px] font-black text-white uppercase tracking-widest leading-tight">Sight Warning</p>
                                        <p className="text-[8px] font-semibold text-rose-100 mt-0.5 max-w-[130px] leading-tight">Please keep your eyesight focused proper centered!</p>
                                    </div>
                                )}
                            </div>
                            <div className="mt-2 flex items-center justify-between">
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">AI Proctoring Active</span>
                                <div className="flex gap-1">
                                    {isMicActive && <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full flex items-center justify-center text-[6px] text-white font-extrabold" title="Mic Active">M</span>}
                                    {isScreenActive && <span className="w-2.5 h-2.5 bg-blue-500 rounded-full flex items-center justify-center text-[6px] text-white font-extrabold" title="Screen Share Active">S</span>}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.04)] flex flex-col overflow-hidden relative">
                        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(0,74,173,0.02) 0%, transparent 100%)' }} />
                        <div className="flex items-center justify-between mb-6 relative z-10">
                            <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-[0.15em]">Navigation Map</h3>
                            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-[10px] font-bold tracking-widest border border-blue-100">
                                {Math.round((Object.keys(answers).length / questions.length) * 100)}% Done
                            </span>
                        </div>

                        <div className="grid grid-cols-5 gap-2.5 overflow-y-auto pb-4 max-h-[360px] custom-scrollbar relative z-10">
                            {questions.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        flushCurrentQuestionTime();
                                        setCurrentQuestion(i);
                                    }}
                                    className={`
                                        h-10 rounded-lg text-[11px] font-bold transition-all relative
                                        ${currentQuestion === i
                                            ? 'ring-2 ring-blue-500 ring-offset-1 bg-blue-50 text-blue-700 border border-blue-200'
                                            : marked.includes(questions[i].id)
                                                ? 'bg-amber-100/50 text-amber-700 border border-amber-200/50 hover:bg-amber-100'
                                                : answers[questions[i].id]
                                                    ? 'bg-slate-800 text-white shadow-sm'
                                                    : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'}
                                    `}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        <div className="mt-8 space-y-3.5 pt-6 border-t border-slate-100 relative z-10">
                            {[
                                { color: 'bg-slate-800', label: 'Answered', count: Object.keys(answers).length },
                                { color: 'bg-amber-400', label: 'Review Later', count: marked.length },
                                { color: 'bg-white border-2 border-slate-200', label: 'Unanswered', count: questions.length - Object.keys(answers).length }
                            ].map(status => (
                                <div key={status.label} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-md ${status.color} shadow-sm transition-transform group-hover:scale-110`} />
                                        <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">{status.label}</span>
                                    </div>
                                    <span className="text-[13px] font-bold text-slate-800 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                                        {status.count}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.04)] relative overflow-hidden">
                        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(16,185,129,0.02) 0%, transparent 100%)' }} />
                        <h4 className="flex items-center gap-2 text-slate-800 text-[11px] font-bold uppercase tracking-[0.15em] mb-5 relative z-10">
                            <ShieldCheck size={16} className="text-emerald-500" />
                            Security Integrity
                        </h4>
                        <div className="space-y-3 relative z-10">
                            <div className="flex justify-between items-center px-4 py-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Tab Switches</span>
                                <span className={`text-[11px] font-bold px-2 py-1 rounded-md ${warnings.tabSwitch > 0 ? 'bg-rose-50 text-rose-700 border border-rose-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
                                    {warnings.tabSwitch} / 3 Warns
                                </span>
                            </div>
                            <div className="flex justify-between items-center px-4 py-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Fullscreen</span>
                                <span className={`text-[11px] font-bold px-2 py-1 rounded-md ${warnings.fullScreen > 0 ? 'bg-rose-50 text-rose-700 border border-rose-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
                                    {warnings.fullScreen > 0 ? 'Compromised' : 'Verified Secure'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showWarning && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-6 animate-in fade-in" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <div className="bg-white max-w-sm w-full p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-t-[6px] border-rose-500 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5"><AlertTriangle size={120} className="text-rose-500" /></div>
                        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6 relative border border-rose-100">
                            <AlertTriangle size={32} />
                        </div>
                        <h2 className="text-2xl font-extrabold text-slate-900 mb-2 tracking-tight relative z-10">Compliance Alert</h2>
                        <p className="text-slate-500 text-[13px] font-medium mb-8 leading-relaxed relative z-10">
                            {showWarning.type === 'fullScreen' ? 'Institutional protocols require mandatory fullscreen mode for certification validity.' :
                                showWarning.type === 'tabSwitch' ? 'Application switching is restricted. High violation counts will result in automatic submission.' : 'Anomalous session activity detected.'}
                        </p>
                        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5 mb-8 relative z-10 shadow-sm">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Violation Count</p>
                            <p className="text-lg font-bold text-rose-600 flex items-center justify-center gap-2">
                                Attempt {showWarning.count} <span className="text-slate-400 font-medium px-2">/</span> 3
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                if (showWarning.type === 'fullScreen') document.documentElement.requestFullscreen();
                                setShowWarning(null);
                            }}
                            className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm shadow-md active:scale-[0.98] transition-all relative z-10"
                        >
                            Acknowledge & Return
                        </button>
                    </div>
                </div>
            )}
            {showAwakeModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-6 animate-in zoom-in-95 duration-300">
                    <div className="bg-white max-w-sm w-full p-10 rounded-[2.5rem] shadow-[0_0_80px_rgba(245,158,11,0.2)] border-t-[10px] border-amber-500 text-center transform rotate-1 hover:rotate-0 transition-transform">
                        <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-6 transform -rotate-3 shadow-sm">
                            <span className="text-4xl text-amber-600">🥱</span>
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Earth to Student </h2>
                        <p className="text-slate-600 text-sm font-medium mb-8 leading-relaxed">
                            Hello? Is anybody in there? Did you fall asleep, or Using Telepathy  ..?
                            <br /><br />
                            We aren't giving you a penalty,
                            but please click the button below
                            to prove you still possess a physical body.
                        </p>
                        <button
                            onClick={() => {
                                setShowAwakeModal(false);
                            }}
                            className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-[15px] shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                        >
                            <span className="text-xl">🏃‍♂️</span> Yes, I am alive!
                        </button>
                    </div>
                </div>
            )}
            <ConfirmModal
                isOpen={confirmState.open}
                onClose={() => setConfirmState({ ...confirmState, open: false })}
                title={confirmState.title}
                message={confirmState.message}
                type={confirmState.type}
                confirmText={confirmState.confirmText}
                onConfirm={confirmState.onConfirm}
            />

            <AlertModal
                isOpen={alertState.open}
                onClose={() => setAlertState({ ...alertState, open: false })}
                title={alertState.title}
                message={alertState.message}
                type={alertState.type}
            />

            {/* ========== BROADCAST ANNOUNCEMENT TOAST ========== */}
            {broadcast && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[300] animate-in slide-in-from-top-4 fade-in duration-300">
                    <div className="bg-white border-2 border-indigo-200 rounded-2xl shadow-2xl px-8 py-5 max-w-lg w-full relative">
                        <button onClick={() => setBroadcast(null)} className="absolute top-3 right-3 p-1 text-slate-400 hover:text-slate-700 rounded-lg">
                            <X size={14} />
                        </button>
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Megaphone size={20} className="text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-1">Instructor Announcement</p>
                                <p className="text-sm font-semibold text-slate-900 leading-relaxed">{broadcast.message}</p>
                            </div>
                        </div>
                        <div className="mt-3 h-1 bg-indigo-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full animate-[shrink_10s_linear_forwards]" style={{ animation: 'shrink 10s linear forwards' }} />
                        </div>
                    </div>
                </div>
            )}

            {/* ========== FLOATING WEBCAM CARD (MOCK PROCTORING - MOBILE FALLBACK ONLY) ========== */}
            {isWebcamActive && !result && !submitting && (
                <div className="xl:hidden fixed bottom-24 right-6 z-[90] w-48 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xl overflow-hidden p-2 transition-all hover:scale-105 duration-300">
                    <div className="relative aspect-video w-full rounded-xl bg-slate-950 overflow-hidden shadow-inner border border-slate-800">
                        <video
                            ref={(el) => {
                                if (el && webcamStreamRef.current && el.srcObject !== webcamStreamRef.current) {
                                    el.srcObject = webcamStreamRef.current;
                                }
                            }}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover scale-x-[-1]"
                        />
                        
                        {/* Recording status dot */}
                        <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded-full border border-white/10">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                            <span className="text-[8px] font-bold text-white uppercase tracking-wider">LIVE</span>
                        </div>

                        {/* Sight warning popup directly on the webcam video */}
                        {showSightWarning && (
                            <div className="absolute inset-0 bg-rose-900/95 flex flex-col items-center justify-center p-2 text-center animate-in fade-in duration-300">
                                <AlertTriangle className="text-amber-400 animate-bounce mb-1" size={20} />
                                <p className="text-[9px] font-black text-white uppercase tracking-widest leading-tight">Sight Warning</p>
                                <p className="text-[8px] font-semibold text-rose-100 mt-0.5 max-w-[130px] leading-tight">Please keep your eyesight focused proper centered!</p>
                            </div>
                        )}
                    </div>
                    <div className="mt-1.5 px-1 flex items-center justify-between">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">AI Proctoring Active</span>
                        <div className="flex gap-1">
                            {isMicActive && <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full flex items-center justify-center text-[6px] text-white font-extrabold" title="Mic Active">M</span>}
                            {isScreenActive && <span className="w-2.5 h-2.5 bg-blue-500 rounded-full flex items-center justify-center text-[6px] text-white font-extrabold" title="Screen Share Active">S</span>}
                        </div>
                    </div>
                </div>
            )}

            {/* ========== FLOATING CHAT BUBBLE ========== */}
            {!result && !submitting && (
                <>
                    {/* Chat Toggle Button */}
                    {!chatOpen && (
                        <button
                            onClick={() => setChatOpen(true)}
                            className="fixed bottom-6 right-6 z-[100] w-14 h-14 bg-[#004AAD] text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-[#003580] transition-all active:scale-90"
                        >
                            <MessageSquare size={22} />
                            {unreadChat > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                                    {unreadChat}
                                </span>
                            )}
                        </button>
                    )}

                    {/* Chat Panel */}
                    {chatOpen && (
                        <div className="fixed bottom-6 right-6 z-[100] w-80 h-[420px] bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                            {/* Header */}
                            <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-[#004AAD]">
                                <div className="flex items-center gap-2">
                                    <MessageSquare size={16} className="text-white" />
                                    <span className="text-sm font-bold text-white">Chat with Trainer</span>
                                </div>
                                <button onClick={() => setChatOpen(false)} className="p-1 text-white/70 hover:text-white rounded">
                                    <X size={16} />
                                </button>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                                {chatMessages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center">
                                        <MessageSquare size={28} className="text-slate-200 mb-2" />
                                        <p className="text-xs font-semibold text-slate-500">Need help?</p>
                                        <p className="text-[10px] text-slate-400 mt-0.5">Send a message to the trainer if you face any technical issues.</p>
                                    </div>
                                ) : chatMessages.map((msg, i) => (
                                    <div key={msg.id || i} className={`flex ${msg.senderId === rollNumber ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] px-3 py-2 rounded-xl text-xs ${msg.senderId === rollNumber
                                            ? 'bg-[#004AAD] text-white rounded-br-sm'
                                            : 'bg-slate-100 text-slate-800 rounded-bl-sm'
                                            }`}>
                                            {msg.senderRole === 'trainer' && (
                                                <p className="text-[9px] font-bold text-indigo-500 mb-0.5">ðŸŽ“ Trainer</p>
                                            )}
                                            <p className="leading-relaxed">{msg.message}</p>
                                            <p className={`text-[8px] mt-0.5 ${msg.senderId === rollNumber ? 'text-blue-200' : 'text-slate-400'}`}>
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                <div ref={chatEndRef} />
                            </div>

                            {/* Input */}
                            <div className="px-3 py-2 border-t border-slate-100">
                                <div className="flex gap-2">
                                    <input
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                                        className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-[#004AAD] outline-none"
                                        placeholder="Type a message..."
                                        maxLength={500}
                                    />
                                    <button
                                        onClick={handleSendChat}
                                        disabled={!chatInput.trim()}
                                        className="px-3 py-2 bg-[#004AAD] text-white rounded-lg hover:bg-[#003580] disabled:opacity-40 transition-all"
                                    >
                                        <Send size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default StudentExam;
