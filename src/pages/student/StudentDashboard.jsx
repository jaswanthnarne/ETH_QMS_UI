import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    BookOpen,
    Clock,
    Award,
    FileText,
    Key,
    Shield,
    Upload,
    CheckCircle,
    User,
    Lock,
    Eye,
    EyeOff,
    Briefcase,
    MapPin,
    DollarSign,
    Loader2,
    ArrowRight,
    AlertCircle,
    Download,
    Trash2,
    Star,
    AlertTriangle,
    CalendarCheck,
    Trophy
} from 'lucide-react';
import axios from 'axios';
import { AlertModal } from '../../components/Modals';
import useStudentAuthStore from '../../store/studentAuthStore';
import { motion, AnimatePresence } from 'framer-motion';

const api = axios.create({
    baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:5000/api')
});

const StudentDashboard = () => {
    const { 
        student, token, updateProfile, uploadResume, changePassword, refreshStudentProfile,
        todos, getTodos, addTodo, updateTodo, deleteTodo, updateExternalHandles
    } = useStudentAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    // Active Dashboard Tab
    const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'profile', 'attendance', 'todo', 'security'
    const [profileSubTab, setProfileSubTab] = useState('personal'); // 'personal', 'skills'
    const [attendanceSortDesc, setAttendanceSortDesc] = useState(true);

    // Todo local states
    const [activeFilter, setActiveFilter] = useState('all');
    const [todoModalOpen, setTodoModalOpen] = useState(false);
    const [todoEditingId, setTodoEditingId] = useState(null);
    const [todoTitle, setTodoTitle] = useState('');
    const [todoDesc, setTodoDesc] = useState('');
    const [todoDueDate, setTodoDueDate] = useState('');
    const [todoIsStarred, setTodoIsStarred] = useState(false);
    const [todoIsPriority, setTodoIsPriority] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');
        if (tab && ['dashboard', 'profile', 'attendance', 'todo', 'security', 'enter-exam', 'exam-history', 'placement', 'leaderboard'].includes(tab)) {
            setActiveTab(tab);
        }
    }, [location.search]);

    useEffect(() => {
        if (token && activeTab === 'todo') {
            getTodos();
        }
    }, [activeTab, token]);

    // Local Data states
    const [activeExams, setActiveExams] = useState([]);
    const [attempts, setAttempts] = useState([]);
    const [loadingExams, setLoadingExams] = useState(false);
    const [loadingAttempts, setLoadingAttempts] = useState(false);

    // Profile Edit State
    const [personalName, setPersonalName] = useState('');
    const [personalEmail, setPersonalEmail] = useState('');
    const [personalMobile, setPersonalMobile] = useState('');
    const [personalCgpa, setPersonalCgpa] = useState('');
    const [personalBacklogs, setPersonalBacklogs] = useState('');
    const [skillsInput, setSkillsInput] = useState('');
    const [skillsList, setSkillsList] = useState([]);
    const [capabilities, setCapabilities] = useState('');
    const [prefRoles, setPrefRoles] = useState([]);
    const [prefLocations, setPrefLocations] = useState([]);
    const [expectedCTC, setExpectedCTC] = useState('');
    const [jobType, setJobType] = useState('Any');

    // Password State
    const [currentPw, setCurrentPw] = useState('');
    const [newPw, setNewPw] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const [showPw1, setShowPw1] = useState(false);
    const [showPw2, setShowPw2] = useState(false);

    // External handles states
    const [leetcodeHandle, setLeetcodeHandle] = useState('');
    const [tryhackmeHandle, setTryhackmeHandle] = useState('');
    const [hacktheboxHandle, setHacktheboxHandle] = useState('');
    const [kaggleHandle, setKaggleHandle] = useState('');
    const [handlesSaving, setHandlesSaving] = useState(false);

    // Leaderboard states
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);
    const [syncingLeaderboard, setSyncingLeaderboard] = useState(false);

    // Utility UI States
    const [resumeFile, setResumeFile] = useState(null);
    const [uploadingResume, setUploadingResume] = useState(false);
    const [profileSaving, setProfileSaving] = useState(false);
    const [pwSaving, setPwSaving] = useState(false);
    const [alertState, setAlertState] = useState({ open: false });
    const [examLauncherKey, setExamLauncherKey] = useState('');

    const actualAttempts = attempts.filter(a => !a.isMock);

    const commonRoles = ['Software Engineer', 'Frontend Developer', 'Backend Developer', 'Fullstack Engineer', 'Data Analyst', 'QA Engineer', 'Sales Executive', 'HR Specialist'];
    const commonLocations = ['Bangalore', 'Mumbai', 'Pune', 'Hyderabad', 'Chennai', 'Delhi NCR', 'Remote'];

    useEffect(() => {
        if (!token) {
            navigate('/portal');
            return;
        }
        refreshStudentProfile();
        fetchActiveExams();
        fetchAttempts();
    }, [token]);

    useEffect(() => {
        if (student) {
            setPersonalName(student.name || '');
            setPersonalEmail(student.email || '');
            setPersonalMobile(student.mobile || '');
            setPersonalCgpa(student.cgpa !== undefined ? student.cgpa : '');
            setPersonalBacklogs(student.backlogs !== undefined ? student.backlogs : '');
            setSkillsList(student.skills || []);
            setCapabilities(student.capabilities || '');
            setLeetcodeHandle(student.externalHandles?.leetcode || '');
            setTryhackmeHandle(student.externalHandles?.tryhackme || '');
            setHacktheboxHandle(student.externalHandles?.hackthebox || '');
            setKaggleHandle(student.externalHandles?.kaggle || '');
            if (student.jobPreferences) {
                setPrefRoles(student.jobPreferences.preferredRoles || []);
                setPrefLocations(student.jobPreferences.preferredLocations || []);
                setExpectedCTC(student.jobPreferences.expectedCTC || '');
                setJobType(student.jobPreferences.jobType || 'Any');
            }
        }
    }, [student]);

    const fetchActiveExams = async () => {
        setLoadingExams(true);
        try {
            const res = await api.get('/student/active-exams', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setActiveExams(res.data.data);
            }
        } catch (err) {
            console.error('Error fetching active exams:', err.message);
        } finally {
            setLoadingExams(false);
        }
    };

    const fetchAttempts = async () => {
        setLoadingAttempts(true);
        try {
            const res = await api.get('/student/attempts', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setAttempts(res.data.data);
            }
        } catch (err) {
            console.error('Error fetching attempts:', err.message);
        } finally {
            setLoadingAttempts(false);
        }
    };

    const handleExportProfile = () => {
        if (!student) return;

        const actualAttempts = attempts.filter(a => !a.isMock);
        const examsTaken = actualAttempts.length;
        const avgPercentage = examsTaken > 0 
            ? (actualAttempts.reduce((sum, a) => sum + a.percentage, 0) / examsTaken).toFixed(2) 
            : '0.00';

        const attendanceRate = student.attendance ? student.attendance.percentage : 0;
        const attendedSessions = student.attendance ? student.attendance.attended : 0;
        const totalSessions = student.attendance ? student.attendance.totalSessions : 0;

        // Build list of skills
        const skillsBadges = student.skills && student.skills.length > 0
            ? student.skills.map(s => `<span class="tag-badge">${s}</span>`).join('')
            : '<span style="color:#64748b; font-size:13px;">No skills added yet</span>';

        // Build exam history table rows
        const attemptsRows = actualAttempts.map(attempt => {
            const exam = attempt.examId;
            const dateStr = attempt.completedAt 
                ? new Date(attempt.completedAt).toLocaleDateString('en-IN') 
                : new Date(attempt.createdAt).toLocaleDateString('en-IN');
            const resultClass = attempt.result === 'pass' ? 'result-pass' : 'result-fail';
            return `
                <tr>
                    <td style="font-weight: 600; color: #0f172a;">${exam?.title || 'Exam'}</td>
                    <td>${exam?.courseId?.name || 'N/A'}</td>
                    <td>${dateStr}</td>
                    <td style="font-weight: 600;">${attempt.totalScore} / ${exam?.totalMarks || 0}</td>
                    <td>${attempt.percentage.toFixed(1)}%</td>
                    <td><span class="result-badge ${resultClass}">${attempt.result || 'N/A'}</span></td>
                </tr>
            `;
        }).join('');

        // Construct HTML content
        let htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>${student.name} - Profile Report</title>
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                        color: #1e293b;
                        line-height: 1.5;
                        margin: 0;
                        padding: 40px;
                        background-color: #ffffff;
                    }
                    .header {
                        border-bottom: 3px solid #004AAD;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-end;
                    }
                    .header-left h1 {
                        margin: 0;
                        font-size: 28px;
                        color: #0f172a;
                        font-weight: 700;
                    }
                    .header-left p {
                        margin: 5px 0 0 0;
                        font-size: 14px;
                        color: #64748b;
                        font-weight: 500;
                    }
                    .header-right {
                        text-align: right;
                    }
                    .institution-badge {
                        background-color: #004AAD;
                        color: white;
                        padding: 6px 12px;
                        border-radius: 6px;
                        font-size: 12px;
                        font-weight: 700;
                        letter-spacing: 0.5px;
                        display: inline-block;
                        margin-bottom: 5px;
                    }
                    .usn-text {
                        font-family: monospace;
                        font-size: 14px;
                        font-weight: 600;
                        color: #0f172a;
                    }
                    .grid-2 {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 25px;
                        margin-bottom: 30px;
                    }
                    .section {
                        margin-bottom: 30px;
                    }
                    .section-title {
                        font-size: 16px;
                        font-weight: 700;
                        color: #004AAD;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        border-bottom: 2px solid #f1f5f9;
                        padding-bottom: 6px;
                        margin-bottom: 15px;
                    }
                    .info-list {
                        list-style: none;
                        padding: 0;
                        margin: 0;
                    }
                    .info-list li {
                        display: flex;
                        margin-bottom: 8px;
                        font-size: 13.5px;
                    }
                    .info-list .label {
                        width: 140px;
                        color: #64748b;
                        font-weight: 600;
                    }
                    .info-list .value {
                        color: #0f172a;
                        font-weight: 500;
                        flex: 1;
                    }
                    .stats-grid {
                        display: grid;
                        grid-template-columns: repeat(4, 1fr);
                        gap: 15px;
                        margin-bottom: 30px;
                    }
                    .stat-card {
                        background-color: #f8fafc;
                        border: 1px solid #e2e8f0;
                        border-radius: 10px;
                        padding: 15px;
                        text-align: center;
                    }
                    .stat-card .stat-val {
                        font-size: 20px;
                        font-weight: 700;
                        color: #0f172a;
                    }
                    .stat-card .stat-lbl {
                        font-size: 11px;
                        color: #64748b;
                        font-weight: 600;
                        text-transform: uppercase;
                        margin-top: 4px;
                    }
                    .badge-container {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 6px;
                    }
                    .tag-badge {
                        background-color: #f1f5f9;
                        color: #334155;
                        border: 1px solid #e2e8f0;
                        padding: 4px 10px;
                        border-radius: 6px;
                        font-size: 12px;
                        font-weight: 600;
                    }
                    .table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 10px;
                    }
                    .table th {
                        background-color: #f8fafc;
                        border-bottom: 2px solid #e2e8f0;
                        color: #475569;
                        font-weight: 700;
                        text-transform: uppercase;
                        font-size: 11px;
                        letter-spacing: 0.5px;
                        padding: 10px 12px;
                        text-align: left;
                    }
                    .table td {
                        border-bottom: 1px solid #f1f5f9;
                        padding: 10px 12px;
                        font-size: 13px;
                        color: #334155;
                    }
                    .table tr:last-child td {
                        border-bottom: none;
                    }
                    .result-badge {
                        font-weight: 700;
                        font-size: 11px;
                        padding: 2px 6px;
                        border-radius: 4px;
                        text-transform: uppercase;
                    }
                    .result-pass {
                        background-color: #dcfce7;
                        color: #15803d;
                    }
                    .result-fail {
                        background-color: #fee2e2;
                        color: #b91c1c;
                    }
                    .footer {
                        margin-top: 40px;
                        border-top: 1px solid #e2e8f0;
                        padding-top: 15px;
                        font-size: 11px;
                        color: #94a3b8;
                        text-align: center;
                    }
                    @media print {
                        body {
                            padding: 0;
                        }
                        .no-print {
                            display: none;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="header-left">
                        <h1>${student.name}</h1>
                        <p>${student.department ? student.department.toUpperCase() : 'N/A'} Student | Semester ${student.semester || 'N/A'}</p>
                    </div>
                    <div class="header-right">
                        <div class="institution-badge">ETHNOTECH ACADEMY</div>
                        <div class="usn-text">USN: ${student.usn || 'N/A'}</div>
                    </div>
                </div>

                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-val">${examsTaken}</div>
                        <div class="stat-lbl">Exams Taken</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-val">${avgPercentage}%</div>
                        <div class="stat-lbl">Average Score</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-val">${attendanceRate}%</div>
                        <div class="stat-lbl">Attendance Rate</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-val">${student.cgpa !== undefined ? student.cgpa : '0.0'}</div>
                        <div class="stat-lbl">Current CGPA</div>
                    </div>
                </div>

                <div class="grid-2">
                    <div class="section">
                        <div class="section-title">Personal Contact Info</div>
                        <ul class="info-list">
                            <li>
                                <span class="label">Email Address</span>
                                <span class="value">${student.email || 'N/A'}</span>
                            </li>
                            <li>
                                <span class="label">Mobile Number</span>
                                <span class="value">${student.mobile || 'N/A'}</span>
                            </li>
                            <li>
                                <span class="label">Division / Class</span>
                                <span class="value">${student.division || 'N/A'}</span>
                            </li>
                        </ul>
                    </div>

                    <div class="section">
                        <div class="section-title">Institutional Info</div>
                        <ul class="info-list">
                            <li>
                                <span class="label">College Name</span>
                                <span class="value">${student.collegeName || 'N/A'}</span>
                            </li>
                            <li>
                                <span class="label">College Code</span>
                                <span class="value">${student.collegeCode || 'N/A'}</span>
                            </li>
                            <li>
                                <span class="label">Current Batch</span>
                                <span class="value">${student.batchName || 'N/A'}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="grid-2">
                    <div class="section">
                        <div class="section-title">Skills & Capabilities</div>
                        <div style="margin-bottom: 12px;">
                            <strong>Skills:</strong>
                            <div class="badge-container" style="margin-top: 5px;">
                                ${skillsBadges}
                            </div>
                        </div>
                        <div>
                            <strong>Summary:</strong>
                            <p style="margin: 5px 0 0 0; font-size: 13px; color: #475569;">
                                ${student.capabilities || 'No summary configured.'}
                            </p>
                        </div>
                    </div>

                    <div class="section">
                        <div class="section-title">Career Preferences</div>
                        <ul class="info-list">
                            <li>
                                <span class="label">Job Type</span>
                                <span class="value">${student.jobPreferences?.jobType || 'Any'}</span>
                            </li>
                            <li>
                                <span class="label">Expected CTC</span>
                                <span class="value">${student.jobPreferences?.expectedCTC || 'N/A'}</span>
                            </li>
                            <li>
                                <span class="label">Preferred Roles</span>
                                <span class="value">${student.jobPreferences?.preferredRoles && student.jobPreferences.preferredRoles.length > 0 
                                    ? student.jobPreferences.preferredRoles.join(', ') 
                                    : 'Any'
                                }</span>
                            </li>
                            <li>
                                <span class="label">Preferred Locations</span>
                                <span class="value">${student.jobPreferences?.preferredLocations && student.jobPreferences.preferredLocations.length > 0 
                                    ? student.jobPreferences.preferredLocations.join(', ') 
                                    : 'Any'
                                }</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">Attendance Metrics</div>
                    <ul class="info-list" style="margin-bottom: 15px;">
                        <li>
                            <span class="label">Sessions Attended</span>
                            <span class="value">${attendedSessions} out of ${totalSessions} total sessions</span>
                        </li>
                    </ul>
                </div>

                <div class="section">
                    <div class="section-title">Assessment & Exam Performance History</div>
                    ${examsTaken === 0 
                        ? '<p style="color:#64748b; font-size:13px;">No completed assessments logged on the platform.</p>'
                        : `
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Assessment / Exam</th>
                                    <th>Course</th>
                                    <th>Date Taken</th>
                                    <th>Score</th>
                                    <th>Percentage</th>
                                    <th>Result</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${attemptsRows}
                            </tbody>
                        </table>
                        `
                    }
                </div>

                <div class="footer">
                    Ethnotech Academy Placement Portal | Profile Report Generated on ${new Date().toLocaleDateString('en-IN')} ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </div>
            </body>
            </html>
        `;

        // Print using hidden iframe method
        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';
        document.body.appendChild(iframe);

        const iframeDoc = iframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(htmlContent);
        iframeDoc.close();

        // Give a small delay to load assets if any, and trigger printing
        setTimeout(() => {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
            
            // Remove the iframe after printing is initiated
            setTimeout(() => {
                document.body.removeChild(iframe);
            }, 1000);
        }, 300);
    };

    const handleAddSkill = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const skill = skillsInput.trim().replace(/,$/, '');
            if (skill && !skillsList.includes(skill)) {
                setSkillsList([...skillsList, skill]);
            }
            setSkillsInput('');
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setSkillsList(skillsList.filter(s => s !== skillToRemove));
    };

    const handleToggleRole = (role) => {
        if (prefRoles.includes(role)) {
            setPrefRoles(prefRoles.filter(r => r !== role));
        } else {
            setPrefRoles([...prefRoles, role]);
        }
    };

    const handleToggleLocation = (loc) => {
        if (prefLocations.includes(loc)) {
            setPrefLocations(prefLocations.filter(l => l !== loc));
        } else {
            setPrefLocations([...prefLocations, loc]);
        }
    };

    const handleSavePersonal = async (e) => {
        e.preventDefault();
        setProfileSaving(true);
        const data = {
            name: personalName.trim(),
            email: personalEmail.trim(),
            mobile: personalMobile.trim(),
            cgpa: personalCgpa !== '' ? parseFloat(personalCgpa) : 0,
            backlogs: personalBacklogs !== '' ? parseInt(personalBacklogs) : 0
        };
        const res = await updateProfile(data);
        setProfileSaving(false);
        if (res.success) {
            setAlertState({ open: true, title: 'Profile Updated', message: 'Personal details updated successfully.', type: 'success' });
        } else {
            setAlertState({ open: true, title: 'Update Failed', message: res.error || 'Failed to update personal details.', type: 'error' });
        }
    };

    const handleSaveSkills = async (e) => {
        e.preventDefault();
        setProfileSaving(true);
        const data = {
            skills: skillsList,
            capabilities
        };
        const res = await updateProfile(data);
        setProfileSaving(false);
        if (res.success) {
            setAlertState({ open: true, title: 'Skills Updated', message: 'Skills and capabilities updated successfully.', type: 'success' });
        } else {
            setAlertState({ open: true, title: 'Update Failed', message: res.error || 'Failed to update skills.', type: 'error' });
        }
    };

    const handleSavePreferences = async (e) => {
        e.preventDefault();
        setProfileSaving(true);
        const data = {
            jobPreferences: {
                preferredRoles: prefRoles,
                preferredLocations: prefLocations,
                expectedCTC: expectedCTC.trim(),
                jobType
            }
        };
        const res = await updateProfile(data);
        setProfileSaving(false);
        if (res.success) {
            setAlertState({ open: true, title: 'Preferences Updated', message: 'Career preferences updated successfully.', type: 'success' });
        } else {
            setAlertState({ open: true, title: 'Update Failed', message: res.error || 'Failed to update preferences.', type: 'error' });
        }
    };

    const handleResumeUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.type !== 'application/pdf') {
            setAlertState({ open: true, title: 'Format Error', message: 'Only PDF resume files are accepted.', type: 'error' });
            return;
        }
        setUploadingResume(true);
        const res = await uploadResume(file);
        setUploadingResume(false);
        if (res.success) {
            setAlertState({ open: true, title: 'Upload Successful', message: 'Resume uploaded and processed successfully.', type: 'success' });
            refreshStudentProfile();
        } else {
            setAlertState({ open: true, title: 'Upload Failed', message: res.error || 'Resume uploading failed.', type: 'error' });
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (!currentPw.trim() || !newPw.trim() || !confirmPw.trim()) {
            setAlertState({ open: true, title: 'Incomplete Fields', message: 'Please fill out all password fields.', type: 'info' });
            return;
        }
        if (newPw !== confirmPw) {
            setAlertState({ open: true, title: 'Mismatch', message: 'New password and confirmation passwords do not match.', type: 'error' });
            return;
        }
        if (newPw.length < 6) {
            setAlertState({ open: true, title: 'Length Error', message: 'New password must contain at least 6 characters.', type: 'error' });
            return;
        }

        setPwSaving(true);
        const res = await changePassword(currentPw.trim(), newPw.trim());
        setPwSaving(false);

        if (res.success) {
            setAlertState({ open: true, title: 'Success', message: 'Password updated successfully.', type: 'success' });
            setCurrentPw('');
            setNewPw('');
            setConfirmPw('');
        } else {
            setAlertState({ open: true, title: 'Update Failed', message: res.error || 'Failed to update password.', type: 'error' });
        }
    };

    const handleLaunchKeyExam = (e) => {
        e.preventDefault();
        if (!examLauncherKey.trim()) return;
        navigate(`/exam/${examLauncherKey.trim().toUpperCase()}`);
    };

    const handleDownloadCertificate = (attemptId) => {
        const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        window.open(`${baseURL}/exam/certificate/${attemptId}?rollNumber=${student?.usn}`, '_blank');
    };

    const openAddTodoModal = () => {
        setTodoEditingId(null);
        setTodoTitle('');
        setTodoDesc('');
        setTodoDueDate('');
        setTodoIsStarred(false);
        setTodoIsPriority(false);
        setTodoModalOpen(true);
    };

    const openEditTodoModal = (todo) => {
        setTodoEditingId(todo._id);
        setTodoTitle(todo.title);
        setTodoDesc(todo.description || '');
        setTodoDueDate(todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : '');
        setTodoIsStarred(todo.isStarred || false);
        setTodoIsPriority(todo.isPriority || false);
        setTodoModalOpen(true);
    };

    const handleSaveTodo = async (e) => {
        e.preventDefault();
        if (!todoTitle.trim()) return;

        const todoData = {
            title: todoTitle.trim(),
            description: todoDesc.trim(),
            dueDate: todoDueDate ? new Date(todoDueDate) : undefined,
            isStarred: todoIsStarred,
            isPriority: todoIsPriority
        };

        let res;
        if (todoEditingId) {
            res = await updateTodo(todoEditingId, todoData);
        } else {
            res = await addTodo(todoData);
        }

        if (res.success) {
            setTodoModalOpen(false);
            setTodoTitle('');
            setTodoDesc('');
            setTodoDueDate('');
            setTodoIsStarred(false);
            setTodoIsPriority(false);
            setTodoEditingId(null);
        } else {
            setAlertState({
                open: true,
                title: 'Error Saving Task',
                message: res.error || 'Failed to save task.',
                type: 'error'
            });
        }
    };

    const handleToggleComplete = async (todo) => {
        const newStatus = todo.status === 'completed' ? 'pending' : 'completed';
        const res = await updateTodo(todo._id, { status: newStatus });
        if (!res.success) {
            setAlertState({
                open: true,
                title: 'Error',
                message: res.error || 'Failed to update task completion.',
                type: 'error'
            });
        }
    };

    const handleToggleStar = async (todo) => {
        const res = await updateTodo(todo._id, { isStarred: !todo.isStarred });
        if (!res.success) {
            setAlertState({
                open: true,
                title: 'Error',
                message: res.error || 'Failed to update task star status.',
                type: 'error'
            });
        }
    };

    const handleTogglePriority = async (todo) => {
        const res = await updateTodo(todo._id, { isPriority: !todo.isPriority });
        if (!res.success) {
            setAlertState({
                open: true,
                title: 'Error',
                message: res.error || 'Failed to update task priority.',
                type: 'error'
            });
        }
    };

    const handleSoftDeleteTodo = async (todo) => {
        const res = await updateTodo(todo._id, { status: 'deleted' });
        if (!res.success) {
            setAlertState({
                open: true,
                title: 'Error',
                message: res.error || 'Failed to delete task.',
                type: 'error'
            });
        }
    };

    const handleRestoreTodo = async (todo) => {
        const res = await updateTodo(todo._id, { status: 'pending' });
        if (!res.success) {
            setAlertState({
                open: true,
                title: 'Error',
                message: res.error || 'Failed to restore task.',
                type: 'error'
            });
        }
    };

    const handlePermanentDeleteTodo = async (id) => {
        const res = await deleteTodo(id);
        if (!res.success) {
            setAlertState({
                open: true,
                title: 'Error',
                message: res.error || 'Failed to delete task permanently.',
                type: 'error'
            });
        }
    };

    const getFilterCounts = () => {
        const list = Array.isArray(todos) ? todos : [];
        return {
            all: list.filter(t => t.status !== 'deleted').length,
            starred: list.filter(t => t.isStarred && t.status !== 'deleted').length,
            priority: list.filter(t => t.isPriority && t.status !== 'deleted').length,
            schedule: list.filter(t => t.dueDate && t.status !== 'deleted').length,
            today: list.filter(t => t.dueDate && new Date(t.dueDate).toDateString() === new Date().toDateString() && t.status !== 'deleted').length,
            done: list.filter(t => t.status === 'completed').length,
            deleted: list.filter(t => t.status === 'deleted').length,
        };
    };

    const handleSaveHandles = async (e) => {
        e.preventDefault();
        setHandlesSaving(true);
        const res = await updateExternalHandles({
            leetcode: leetcodeHandle.trim(),
            tryhackme: tryhackmeHandle.trim(),
            hackthebox: hacktheboxHandle.trim(),
            kaggle: kaggleHandle.trim()
        });
        setHandlesSaving(false);
        if (res.success) {
            setAlertState({ open: true, title: 'Success', message: 'Platform handles updated successfully.', type: 'success' });
            refreshStudentProfile();
        } else {
            setAlertState({ open: true, title: 'Update Failed', message: res.error || 'Failed to update platform handles.', type: 'error' });
        }
    };

    const fetchStudentLeaderboard = async () => {
        setLoadingLeaderboard(true);
        try {
            const res = await api.get('/student/leaderboard', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setLeaderboardData(res.data.data);
            }
        } catch (err) {
            console.error('Error fetching leaderboard:', err.message);
        } finally {
            setLoadingLeaderboard(false);
        }
    };

    useEffect(() => {
        if (token && activeTab === 'leaderboard') {
            fetchStudentLeaderboard();
        }
    }, [activeTab, token]);

    return (
        <div className="space-y-8">
            
            {/* Platform Integration Handle Link Alert */}
            {student?.batchId?.integrationType && student.batchId.integrationType !== 'none' && !student.externalHandles?.[student.batchId.integrationType] && (
                <div className="bg-amber-50 border border-amber-250 rounded-[1.5rem] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm border-amber-200">
                    <div className="flex gap-3">
                        <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={20} />
                        <div>
                            <h4 className="text-amber-900 font-bold text-sm">Action Required: Link your profile handle!</h4>
                            <p className="text-amber-700 text-xs mt-1">
                                Your batch **{student.batchId.batchName}** is integrated with **{student.batchId.integrationType === 'tryhackme' ? 'TryHackMe' : student.batchId.integrationType === 'leetcode' ? 'LeetCode' : 'Kaggle'}**. Please configure your profile handle to sync your stats.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            setActiveTab('profile');
                            setProfileSubTab('handles');
                        }}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl shadow-sm whitespace-nowrap active:scale-95 transition-all cursor-pointer"
                    >
                        Configure Now
                    </button>
                </div>
            )}
            
            {/* Glassmorphic Profile Banner */}
            <div className="bg-gradient-to-r from-[#004AAD] to-[#003580] rounded-[2rem] text-white p-8 sm:p-10 shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:2.5rem_2.5rem]" />
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-3">
                        <span className="bg-white/15 border border-white/20 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider inline-block">
                            Student Dashboard
                        </span>
                        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
                            Welcome, {student?.name || 'Candidate'}
                        </h1>
                        <p className="text-blue-100/90 text-sm sm:text-base max-w-xl font-medium">
                            Keep track of your batch assessments, view evaluation certificates, and configure your career placement profile.
                        </p>
                        <div className="pt-2 flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={handleExportProfile}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-sm font-semibold transition-all duration-200 shadow-md cursor-pointer border border-emerald-500/20 active:scale-95"
                            >
                                <Download size={15} /> Export Profile
                            </button>
                        </div>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 p-5 grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                        <div>
                            <span className="text-blue-200/80 text-[10px] font-semibold uppercase tracking-wider block">USN / ID</span>
                            <span className="font-semibold font-mono text-base">{student?.usn || 'N/A'}</span>
                        </div>
                        <div>
                            <span className="text-blue-200/80 text-[10px] font-semibold uppercase tracking-wider block">Department</span>
                            <span className="font-semibold text-base uppercase">{student?.department || 'N/A'}</span>
                        </div>
                        <div className="mt-2">
                            <span className="text-blue-200/80 text-[10px] font-semibold uppercase tracking-wider block">College</span>
                            <span className="font-semibold text-base max-w-[150px] truncate block" title={student?.collegeName}>{student?.collegeName || 'N/A'}</span>
                        </div>
                        <div className="mt-2">
                            <span className="text-blue-200/80 text-[10px] font-semibold uppercase tracking-wider block">Batch</span>
                            <span className="font-semibold text-base block max-w-[150px] truncate" title={student?.batchName}>{student?.batchName || 'N/A'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Panels */}
            <div className="space-y-8">
                        {(activeTab === 'dashboard' || activeTab === 'enter-exam') && (
                            <div className="space-y-8">
                                
                                {/* Dashboard Widgets */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                    <div className="bg-white border border-slate-100 shadow-sm rounded-[1.5rem] p-6 flex items-center gap-4 hover:shadow-md transition-all duration-300">
                                        <div className="p-4 bg-blue-50 text-[#004AAD] rounded-2xl">
                                            <BookOpen size={24} />
                                        </div>
                                        <div>
                                            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Exams Taken</span>
                                            <span className="text-2xl font-semibold text-slate-800">{actualAttempts.length}</span>
                                        </div>
                                    </div>
                                    <div className="bg-white border border-slate-100 shadow-sm rounded-[1.5rem] p-6 flex items-center gap-4 hover:shadow-md transition-all duration-300">
                                        <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
                                            <Award size={24} />
                                        </div>
                                        <div>
                                            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Average Score</span>
                                            <span className="text-2xl font-semibold text-slate-800">
                                                {actualAttempts.length > 0 
                                                    ? `${(actualAttempts.reduce((sum, a) => sum + a.percentage, 0) / actualAttempts.length).toFixed(1)}%`
                                                    : '0.0%'
                                                }
                                            </span>
                                        </div>
                                    </div>
                                    <div className="bg-white border border-slate-100 shadow-sm rounded-[1.5rem] p-6 flex items-center gap-4 hover:shadow-md transition-all duration-300">
                                        <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl">
                                            <CheckCircle size={24} />
                                        </div>
                                        <div>
                                            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Attendance Rate</span>
                                            <span className="text-2xl font-semibold text-slate-800">
                                                {student?.attendance ? `${student.attendance.percentage}%` : '0%'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Quick Exam Launcher */}
                                <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-semibold text-slate-800">Direct Assessment Launcher</h3>
                                        <p className="text-slate-500 text-xs sm:text-sm">Have a custom exam key from your trainer? Launch it directly here.</p>
                                    </div>
                                    <form onSubmit={handleLaunchKeyExam} className="flex gap-3 w-full md:w-auto max-w-md">
                                        <input
                                            type="text"
                                            required
                                            placeholder="Enter Exam Key"
                                            className="px-5 py-3 border border-slate-200 rounded-2xl outline-none font-semibold font-mono focus:border-[#004AAD] uppercase w-full md:w-44 text-sm"
                                            value={examLauncherKey}
                                            onChange={(e) => setExamLauncherKey(e.target.value)}
                                        />
                                        <button
                                            type="submit"
                                            disabled={!examLauncherKey.trim()}
                                            className="px-6 py-3 bg-[#004AAD] hover:bg-[#003580] text-white font-semibold rounded-2xl flex items-center gap-2 cursor-pointer transition active:scale-[0.97] text-sm whitespace-nowrap disabled:opacity-50"
                                        >
                                            Launch <ArrowRight size={16} />
                                        </button>
                                    </form>
                                </div>

                                {/* Active Assessments */}
                                <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-8 space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-800">Active Batch Assessments</h3>
                                        <p className="text-slate-500 text-sm">Tests currently active and available to take for your batch.</p>
                                    </div>

                                    {loadingExams ? (
                                        <div className="flex justify-center items-center py-10">
                                            <Loader2 className="animate-spin text-[#004AAD]" size={28} />
                                        </div>
                                    ) : activeExams.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                            <AlertCircle className="text-slate-400 mb-2.5" size={32} />
                                            <p className="text-slate-700 font-semibold text-sm">No Active Assessments</p>
                                            <p className="text-slate-400 text-xs max-w-xs mt-1">There are no assessment sessions active for your batch at this moment.</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            {activeExams.map((item, idx) => (
                                                <div key={idx} className="border border-slate-100 rounded-2xl p-5 hover:shadow-md hover:border-[#004AAD]/20 transition-all duration-300 bg-white flex flex-col justify-between group">
                                                    <div>
                                                        <div className="flex justify-between items-start gap-2">
                                                            <span className="text-[10px] font-semibold text-[#004AAD] uppercase bg-blue-50 px-2.5 py-1 rounded-full tracking-wider">
                                                                {item.exam.courseName || 'Course'}
                                                            </span>
                                                            {item.isCompleted ? (
                                                                <span className="bg-emerald-50 text-emerald-600 text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full">Completed</span>
                                                            ) : !item.isStarted ? (
                                                                <span className="bg-amber-50 text-amber-600 text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full">Not Started</span>
                                                            ) : (
                                                                <span className="bg-blue-500 text-white text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full animate-pulse">Active</span>
                                                            )}
                                                        </div>
                                                        <h4 className="text-base font-semibold text-slate-800 mt-3 group-hover:text-[#004AAD] transition-colors leading-snug">
                                                            {item.exam.title}
                                                        </h4>
                                                        
                                                        <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-4 text-xs font-semibold text-slate-500 border-t border-slate-50 pt-3">
                                                            <div className="flex items-center gap-1.5">
                                                                <Clock size={14} className="text-slate-400" />
                                                                <span>{item.exam.duration} Minutes</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <Award size={14} className="text-slate-400" />
                                                                <span>{item.exam.totalMarks} Marks</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="mt-5 pt-2 border-t border-slate-50">
                                                        {item.isCompleted ? (
                                                            <button
                                                                onClick={() => navigate(`/exam/${item.sessionKey}`)}
                                                                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition"
                                                            >
                                                                Review Results
                                                            </button>
                                                        ) : !item.isStarted ? (
                                                            <div className="w-full py-2.5 bg-slate-50 text-slate-400 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-100 cursor-not-allowed">
                                                                Waiting for Instructor
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => navigate(`/exam/${item.sessionKey}`)}
                                                                className="w-full py-2.5 bg-[#004AAD] hover:bg-[#003580] text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition shadow-sm group-hover:shadow-md"
                                                            >
                                                                Launch Test <ArrowRight size={14} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                            </div>
                        )}

                        {activeTab === 'exam-history' && (
                            <div className="space-y-8">

                                {/* Historical Attempts */}
                                <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-8 space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-800">Assessment History</h3>
                                        <p className="text-slate-500 text-sm">Your performance track record and evaluations.</p>
                                    </div>

                                    {loadingAttempts ? (
                                        <div className="flex justify-center items-center py-10">
                                            <Loader2 className="animate-spin text-[#004AAD]" size={28} />
                                        </div>
                                    ) : attempts.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                            <Award className="text-slate-400 mb-2.5" size={32} />
                                            <p className="text-slate-700 font-semibold text-sm">No Attempts Recorded</p>
                                            <p className="text-slate-400 text-xs mt-1">You haven't completed any assessments yet.</p>
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                                        <th className="pb-3 pr-4">Assessment</th>
                                                        <th className="pb-3 px-4">Date</th>
                                                        <th className="pb-3 px-4">Score</th>
                                                        <th className="pb-3 px-4">Result</th>
                                                        <th className="pb-3 pl-4 text-right">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-50 text-sm font-semibold text-slate-700">
                                                    {attempts.map((attempt) => {
                                                        const exam = attempt.examId;
                                                        const dateStr = attempt.completedAt 
                                                            ? new Date(attempt.completedAt).toLocaleDateString('en-IN') 
                                                            : new Date(attempt.createdAt).toLocaleDateString('en-IN');
                                                        
                                                        return (
                                                            <tr key={attempt._id} className="hover:bg-slate-50/60 transition duration-150">
                                                                <td className="py-4 pr-4">
                                                                    <p className="font-semibold text-slate-800 leading-snug">{exam?.title || 'Exam'}</p>
                                                                    <p className="text-slate-400 text-[10px] uppercase font-semibold tracking-wider mt-0.5">{exam?.courseId?.name || 'N/A'}</p>
                                                                </td>
                                                                <td className="py-4 px-4 text-slate-500">{dateStr}</td>
                                                                <td className="py-4 px-4">
                                                                    {attempt.isMock ? (
                                                                        <>
                                                                            <p className="font-semibold text-slate-800">— / {exam?.totalMarks || 0}</p>
                                                                            <p className="text-slate-400 text-xs font-semibold">—</p>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <p className="font-semibold text-slate-800">{attempt.totalScore} / {exam?.totalMarks || 0}</p>
                                                                            <p className="text-slate-400 text-xs font-semibold">{attempt.percentage.toFixed(1)}%</p>
                                                                        </>
                                                                    )}
                                                                </td>
                                                                <td className="py-4 px-4">
                                                                    {attempt.isMock ? (
                                                                        attempt.isActive && attempt.isStarted ? (
                                                                            <span className="bg-blue-50 text-[#004AAD] text-xs font-semibold px-2.5 py-1 rounded-md border border-blue-100 inline-block animate-pulse">Pending</span>
                                                                        ) : (
                                                                            <span className="bg-slate-50 text-slate-500 text-xs font-semibold px-2.5 py-1 rounded-md border border-slate-200 inline-block">Not Attempted</span>
                                                                        )
                                                                    ) : attempt.result === 'pass' ? (
                                                                        <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-md border border-emerald-100 inline-block">Pass</span>
                                                                    ) : (
                                                                        <span className="bg-red-50 text-red-700 text-xs font-semibold px-2.5 py-1 rounded-md border border-red-100 inline-block">Fail</span>
                                                                    )}
                                                                </td>
                                                                <td className="py-4 pl-4 text-right">
                                                                    <div className="flex justify-end gap-2">
                                                                        {attempt.isMock ? (
                                                                            attempt.isActive && attempt.isStarted ? (
                                                                                <button
                                                                                    onClick={() => navigate(`/exam/${attempt.sessionId}`)}
                                                                                    className="px-3.5 py-1.5 bg-[#004AAD] hover:bg-[#003580] text-white text-xs font-semibold rounded-lg transition cursor-pointer"
                                                                                >
                                                                                    Launch
                                                                                </button>
                                                                            ) : (
                                                                                <button
                                                                                    disabled
                                                                                    className="px-3.5 py-1.5 bg-slate-100 text-slate-400 text-xs font-semibold rounded-lg border border-slate-200 cursor-not-allowed"
                                                                                >
                                                                                    Unavailable
                                                                                </button>
                                                                            )
                                                                        ) : (
                                                                            <>
                                                                                {exam?.settings?.allowReview !== false && (
                                                                                    <button
                                                                                        onClick={() => navigate(`/exam/${attempt.sessionId}`)}
                                                                                        className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition cursor-pointer"
                                                                                    >
                                                                                        Review
                                                                                    </button>
                                                                                )}
                                                                                {attempt.result === 'pass' && (exam?.settings?.enableCertificate || attempt.certificateId) && (
                                                                                    <button
                                                                                        onClick={() => handleDownloadCertificate(attempt._id)}
                                                                                        className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-100 text-xs font-semibold rounded-lg transition flex items-center gap-1 cursor-pointer"
                                                                                        title="Download Certificate"
                                                                                    >
                                                                                        <Download size={13} /> Cert
                                                                                    </button>
                                                                                )}
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>

                            </div>
                        )}

                        {activeTab === 'profile' && (
                            <div className="space-y-8 font-sans">
                                
                                {/* Profile Sub-navigation Tabs */}
                                <div className="flex flex-wrap items-center justify-between gap-4 w-full">
                                    <div className="flex flex-wrap items-center gap-3 p-1.5 bg-slate-100/60 rounded-3xl w-fit max-w-full">
                                        <button
                                            type="button"
                                            onClick={() => setProfileSubTab('personal')}
                                            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
                                            profileSubTab === 'personal'
                                                    ? 'bg-[#004AAD] text-white shadow-sm'
                                                    : 'bg-slate-100 text-slate-650 hover:bg-slate-200'
                                            }`}
                                        >
                                            Personal Details
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setProfileSubTab('academic')}
                                            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
                                                profileSubTab === 'academic'
                                                    ? 'bg-[#004AAD] text-white shadow-sm'
                                                    : 'bg-slate-100 text-slate-650 hover:bg-slate-200'
                                            }`}
                                        >
                                            Academic Details
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setProfileSubTab('skills')}
                                            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
                                                profileSubTab === 'skills'
                                                    ? 'bg-[#004AAD] text-white shadow-sm'
                                                    : 'bg-slate-100 text-slate-650 hover:bg-slate-200'
                                            }`}
                                        >
                                            Skills
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setProfileSubTab('resume')}
                                            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
                                                profileSubTab === 'resume'
                                                    ? 'bg-[#004AAD] text-white shadow-sm'
                                                    : 'bg-slate-100 text-slate-650 hover:bg-slate-200'
                                            }`}
                                        >
                                            Resume
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setProfileSubTab('preferences')}
                                            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
                                                profileSubTab === 'preferences'
                                                    ? 'bg-[#004AAD] text-white shadow-sm'
                                                    : 'bg-slate-100 text-slate-650 hover:bg-slate-200'
                                            }`}
                                        >
                                            Career Preferences
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setProfileSubTab('handles')}
                                            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
                                                profileSubTab === 'handles'
                                                    ? 'bg-[#004AAD] text-white shadow-sm'
                                                    : 'bg-slate-100 text-slate-650 hover:bg-slate-200'
                                            }`}
                                        >
                                            Platform Handles
                                        </button>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleExportProfile}
                                        className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-sm font-semibold transition-all duration-200 shadow-sm cursor-pointer border border-emerald-500/20 active:scale-95 whitespace-nowrap"
                                    >
                                        <Download size={15} /> Export Profile
                                    </button>
                                </div>

                                {profileSubTab === 'personal' && (
                                    <form onSubmit={handleSavePersonal} className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-8 space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold text-slate-800">Personal Details</h3>
                                            <p className="text-slate-500 text-sm">Update your name, contact email, and mobile number.</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Full Name</label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="Enter your full name"
                                                    className="w-full px-5 py-3.5 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:border-[#004AAD] focus:ring-4 focus:ring-blue-50 outline-none transition placeholder:text-slate-400 bg-slate-50/30 focus:bg-white"
                                                    value={personalName}
                                                    onChange={(e) => setPersonalName(e.target.value)}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Email Address</label>
                                                <input
                                                    type="email"
                                                    placeholder="Enter email address"
                                                    className="w-full px-5 py-3.5 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:border-[#004AAD] focus:ring-4 focus:ring-blue-50 outline-none transition placeholder:text-slate-400 bg-slate-50/30 focus:bg-white"
                                                    value={personalEmail}
                                                    onChange={(e) => setPersonalEmail(e.target.value)}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Mobile Number</label>
                                                <input
                                                    type="text"
                                                    placeholder="Enter mobile number"
                                                    className="w-full px-5 py-3.5 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:border-[#004AAD] focus:ring-4 focus:ring-blue-50 outline-none transition placeholder:text-slate-400 bg-slate-50/30 focus:bg-white"
                                                    value={personalMobile}
                                                    onChange={(e) => setPersonalMobile(e.target.value)}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">CGPA</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    max="10"
                                                    placeholder="Enter your CGPA (e.g. 8.5)"
                                                    className="w-full px-5 py-3.5 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:border-[#004AAD] focus:ring-4 focus:ring-blue-50 outline-none transition placeholder:text-slate-400 bg-slate-50/30 focus:bg-white"
                                                    value={personalCgpa}
                                                    onChange={(e) => setPersonalCgpa(e.target.value)}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Active Backlogs</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    placeholder="Enter active backlogs"
                                                    className="w-full px-5 py-3.5 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:border-[#004AAD] focus:ring-4 focus:ring-blue-50 outline-none transition placeholder:text-slate-400 bg-slate-50/30 focus:bg-white"
                                                    value={personalBacklogs}
                                                    onChange={(e) => setPersonalBacklogs(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-4 flex justify-end border-t border-slate-100">
                                            <button
                                                type="submit"
                                                disabled={profileSaving}
                                                className="px-8 py-3.5 bg-[#004AAD] hover:bg-[#003580] text-white font-semibold rounded-2xl flex items-center gap-2 cursor-pointer shadow-md shadow-blue-500/10 active:scale-[0.98] transition duration-200 text-sm disabled:opacity-50"
                                            >
                                                {profileSaving ? <Loader2 size={16} className="animate-spin" /> : null}
                                                Save Personal Details
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {profileSubTab === 'academic' && (
                                    /* Institutional Context Card */
                                    <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-8 space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold text-slate-800">Academic & Institutional Profile</h3>
                                            <p className="text-slate-500 text-sm">Your course, batch, trainer details, and class attendance rate.</p>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            <div className="bg-slate-50/50 p-4.5 rounded-2xl border border-slate-100">
                                                <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider block mb-1">USN (University Seat Number)</span>
                                                <span className="text-slate-800 font-semibold font-mono text-base">{student?.usn || 'N/A'}</span>
                                            </div>
                                            <div className="bg-slate-50/50 p-4.5 rounded-2xl border border-slate-100">
                                                <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider block mb-1">Course Registered</span>
                                                <span className="text-slate-800 font-semibold text-base">
                                                    {student?.batchId?.courseId ? `${student.batchId.courseId.name} (${student.batchId.courseId.code})` : 'N/A'}
                                                </span>
                                            </div>
                                            <div className="bg-slate-50/50 p-4.5 rounded-2xl border border-slate-100">
                                                <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider block mb-1">Assigned Trainer</span>
                                                <span className="text-slate-800 font-semibold text-base">
                                                    {student?.batchId?.trainerId ? `${student.batchId.trainerId.firstName} ${student.batchId.trainerId.lastName}` : 'N/A'}
                                                </span>
                                            </div>
                                            <div className="bg-slate-50/50 p-4.5 rounded-2xl border border-slate-100">
                                                <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider block mb-1">College Details</span>
                                                <span className="text-slate-800 font-semibold text-base">
                                                    {student?.collegeName ? `${student.collegeName} (${student.collegeCode || 'N/A'})` : 'N/A'}
                                                </span>
                                            </div>
                                            <div className="bg-slate-50/50 p-4.5 rounded-2xl border border-slate-100">
                                                <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider block mb-1">Batch Name</span>
                                                <span className="text-slate-800 font-semibold text-base">{student?.batchId?.batchName || 'N/A'}</span>
                                            </div>
                                            <div className="bg-slate-50/50 p-4.5 rounded-2xl border border-slate-100">
                                                <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider block mb-1">Class Attendance</span>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-slate-800 font-semibold text-base">
                                                        {student?.attendance ? `${student.attendance.percentage}%` : '0%'}
                                                    </span>
                                                    <span className="text-slate-400 text-xs font-semibold">
                                                        ({student?.attendance?.attended || 0}/{student?.attendance?.totalSessions || 0} sessions)
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {profileSubTab === 'skills' && (
                                    <form onSubmit={handleSaveSkills} className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-8 space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold text-slate-800">Skills & Capabilities</h3>
                                            <p className="text-slate-500 text-sm">Add your professional technical skills and capabilities summary statement.</p>
                                        </div>

                                        {/* Skills Tags */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Key Professional Skills</label>
                                            <div className="border border-slate-200 rounded-2xl p-3 bg-slate-50/30 focus-within:bg-white focus-within:border-[#004AAD] transition-all">
                                                <div className="flex flex-wrap gap-2 mb-2">
                                                    {skillsList.map((skill, i) => (
                                                        <span key={i} className="inline-flex items-center gap-1 bg-blue-50 border border-blue-100 text-[#004AAD] text-xs font-semibold px-2.5 py-1 rounded-lg">
                                                            {skill}
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveSkill(skill)}
                                                                className="text-[#004AAD]/60 hover:text-[#004AAD] text-[10px] font-semibold p-0.5"
                                                            >
                                                                ✕
                                                            </button>
                                                        </span>
                                                    ))}
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Type skill & press Enter or Comma (e.g. Java, React, SQL)"
                                                    className="w-full bg-transparent border-none outline-none text-sm font-medium text-slate-800 placeholder:text-slate-400"
                                                    value={skillsInput}
                                                    onChange={(e) => setSkillsInput(e.target.value)}
                                                    onKeyDown={handleAddSkill}
                                                />
                                            </div>
                                        </div>

                                        {/* Capabilities */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Capabilities Statement</label>
                                            <textarea
                                                placeholder="Write a brief professional summary of your key strengths, projects, or achievements..."
                                                rows={4}
                                                className="w-full px-5 py-4 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:border-[#004AAD] focus:ring-4 focus:ring-blue-50 outline-none transition placeholder:text-slate-400 bg-slate-50/30 focus:bg-white"
                                                value={capabilities}
                                                onChange={(e) => setCapabilities(e.target.value)}
                                            />
                                        </div>

                                        <div className="pt-4 flex justify-end border-t border-slate-100">
                                            <button
                                                type="submit"
                                                disabled={profileSaving}
                                                className="px-8 py-3.5 bg-[#004AAD] hover:bg-[#003580] text-white font-semibold rounded-2xl flex items-center gap-2 cursor-pointer shadow-md shadow-blue-500/10 active:scale-[0.98] transition duration-200 text-sm disabled:opacity-50"
                                            >
                                                {profileSaving ? <Loader2 size={16} className="animate-spin" /> : null}
                                                Save Skills
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {profileSubTab === 'resume' && (
                                    <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-8 space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold text-slate-800">Resume PDF</h3>
                                            <p className="text-slate-500 text-sm">Upload your professional resume PDF to share with corporate placement partners.</p>
                                        </div>

                                        {student?.resumeUrl ? (
                                            <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-3 bg-emerald-500 text-white rounded-xl shadow-sm">
                                                        <FileText size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="text-slate-800 font-semibold text-sm leading-tight">Resume PDF Linked</p>
                                                        <p className="text-slate-400 text-xs mt-0.5">Your resume is uploaded and accessible to placement cells.</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                                                    <a
                                                        href={student.resumeUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex-1 sm:flex-none text-center px-4.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-sm cursor-pointer transition"
                                                    >
                                                        View Resume
                                                    </a>
                                                    <label className="flex-1 sm:flex-none text-center px-4.5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs rounded-xl cursor-pointer transition">
                                                        Replace PDF
                                                        <input
                                                            type="file"
                                                            accept=".pdf"
                                                            className="hidden"
                                                            onChange={handleResumeUpload}
                                                            disabled={uploadingResume}
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                        ) : (
                                            <label className="border-2 border-dashed border-slate-200 hover:border-[#004AAD]/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 bg-slate-50/30 group">
                                                {uploadingResume ? (
                                                    <div className="flex flex-col items-center">
                                                        <Loader2 size={32} className="animate-spin text-[#004AAD]" />
                                                        <p className="text-slate-700 font-semibold mt-3 text-sm">Uploading and configuring PDF...</p>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <Upload size={32} className="text-slate-400 group-hover:text-[#004AAD] group-hover:scale-110 transition duration-300" />
                                                        <p className="text-slate-800 font-semibold text-sm mt-3 leading-tight">Select Resume PDF</p>
                                                        <p className="text-slate-400 text-xs mt-1.5 max-w-[200px]">PDF format only (Max 5MB limits)</p>
                                                    </>
                                                )}
                                                <input
                                                    type="file"
                                                    accept=".pdf"
                                                    className="hidden"
                                                    onChange={handleResumeUpload}
                                                    disabled={uploadingResume}
                                                />
                                            </label>
                                        )}
                                    </div>
                                )}

                                {profileSubTab === 'preferences' && (
                                    <form onSubmit={handleSavePreferences} className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-8 space-y-8">
                                        <div>
                                            <h3 className="text-lg font-semibold text-slate-800">Career & Placement Preferences</h3>
                                            <p className="text-slate-500 text-sm">Configure your preferred job arrangements, salary expectations, roles, and locations.</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Expected CTC Range (e.g. 5-7 LPA)</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. 4.5 - 6.0 LPA"
                                                    className="w-full px-5 py-3.5 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:border-[#004AAD] focus:ring-4 focus:ring-blue-50 outline-none transition placeholder:text-slate-400 bg-slate-50/30 focus:bg-white"
                                                    value={expectedCTC}
                                                    onChange={(e) => setExpectedCTC(e.target.value)}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Preferred Job Type</label>
                                                <select
                                                    className="w-full px-5 py-3.5 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-700 focus:border-[#004AAD] focus:ring-4 focus:ring-blue-50 outline-none transition bg-slate-50/30 focus:bg-white cursor-pointer"
                                                    value={jobType}
                                                    onChange={(e) => setJobType(e.target.value)}
                                                >
                                                    <option value="Any">Any</option>
                                                    <option value="Full-time">Full-time</option>
                                                    <option value="Internship">Internship</option>
                                                    <option value="Contract">Contract</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Preferred Roles */}
                                            <div className="space-y-3">
                                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Preferred Roles</label>
                                                <div className="max-h-56 overflow-y-auto border border-slate-100 rounded-2xl p-4 space-y-2 bg-slate-50/30">
                                                    {commonRoles.map((role) => (
                                                        <label key={role} className="flex items-center gap-2.5 text-sm font-semibold text-slate-700 cursor-pointer select-none">
                                                            <input
                                                                type="checkbox"
                                                                checked={prefRoles.includes(role)}
                                                                onChange={() => handleToggleRole(role)}
                                                                className="rounded border-slate-350 text-[#004AAD] focus:ring-[#004AAD]"
                                                            />
                                                            {role}
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Preferred Locations */}
                                            <div className="space-y-3">
                                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Preferred Locations</label>
                                                <div className="max-h-56 overflow-y-auto border border-slate-100 rounded-2xl p-4 space-y-2 bg-slate-50/30">
                                                    {commonLocations.map((loc) => (
                                                        <label key={loc} className="flex items-center gap-2.5 text-sm font-semibold text-slate-700 cursor-pointer select-none">
                                                            <input
                                                                type="checkbox"
                                                                checked={prefLocations.includes(loc)}
                                                                onChange={() => handleToggleLocation(loc)}
                                                                className="rounded border-slate-350 text-[#004AAD] focus:ring-[#004AAD]"
                                                            />
                                                            {loc}
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-4 flex justify-end border-t border-slate-100">
                                            <button
                                                type="submit"
                                                disabled={profileSaving}
                                                className="px-8 py-3.5 bg-[#004AAD] hover:bg-[#003580] text-white font-semibold rounded-2xl flex items-center gap-2 cursor-pointer shadow-md shadow-blue-500/10 active:scale-[0.98] transition duration-200 text-sm disabled:opacity-50"
                                            >
                                                {profileSaving ? <Loader2 size={16} className="animate-spin" /> : null}
                                                Save Career Preferences
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {profileSubTab === 'handles' && (() => {
                                    const batchIntegration = student?.batchId;
                                    const integrationType = batchIntegration?.integrationType || 'none';
                                    return (
                                        <form onSubmit={handleSaveHandles} className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-8 space-y-6">
                                            <div>
                                                <h3 className="text-lg font-semibold text-slate-800">Platform Integration Handles</h3>
                                                <p className="text-slate-500 text-sm">Link your external learning and coding profiles to sync scores and ranks.</p>
                                            </div>

                                            {integrationType === 'none' ? (
                                                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-center text-slate-500 text-sm font-semibold">
                                                    Your current batch <strong>{batchIntegration?.batchName || 'N/A'}</strong> does not require any external learning profile integrations.
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    {integrationType === 'tryhackme' && (
                                                        <>
                                                            <div className="space-y-2">
                                                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">TryHackMe Username</label>
                                                                <input
                                                                    type="text"
                                                                    placeholder="Enter TryHackMe Username"
                                                                    className="w-full px-5 py-3.5 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:border-[#004AAD] focus:ring-4 focus:ring-blue-50 outline-none transition placeholder:text-slate-400 bg-slate-50/30 focus:bg-white"
                                                                    value={tryhackmeHandle}
                                                                    onChange={(e) => setTryhackmeHandle(e.target.value)}
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Hack The Box Username</label>
                                                                <input
                                                                    type="text"
                                                                    placeholder="Enter Hack The Box Username"
                                                                    className="w-full px-5 py-3.5 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:border-[#004AAD] focus:ring-4 focus:ring-blue-50 outline-none transition placeholder:text-slate-400 bg-slate-50/30 focus:bg-white"
                                                                    value={hacktheboxHandle}
                                                                    onChange={(e) => setHacktheboxHandle(e.target.value)}
                                                                />
                                                            </div>
                                                        </>
                                                    )}

                                                    {integrationType === 'leetcode' && (
                                                        <div className="space-y-2">
                                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">LeetCode Username</label>
                                                            <input
                                                                type="text"
                                                                placeholder="Enter LeetCode Username"
                                                                className="w-full px-5 py-3.5 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:border-[#004AAD] focus:ring-4 focus:ring-blue-50 outline-none transition placeholder:text-slate-400 bg-slate-50/30 focus:bg-white"
                                                                value={leetcodeHandle}
                                                                onChange={(e) => setLeetcodeHandle(e.target.value)}
                                                            />
                                                        </div>
                                                    )}

                                                    {integrationType === 'kaggle' && (
                                                        <div className="space-y-2">
                                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Kaggle Username</label>
                                                            <input
                                                                type="text"
                                                                placeholder="Enter Kaggle Username"
                                                                className="w-full px-5 py-3.5 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:border-[#004AAD] focus:ring-4 focus:ring-blue-50 outline-none transition placeholder:text-slate-400 bg-slate-50/30 focus:bg-white"
                                                                value={kaggleHandle}
                                                                onChange={(e) => setKaggleHandle(e.target.value)}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {integrationType !== 'none' && (
                                                <div className="pt-4 flex justify-end border-t border-slate-100">
                                                    <button
                                                        type="submit"
                                                        disabled={handlesSaving}
                                                        className="px-8 py-3.5 bg-[#004AAD] hover:bg-[#003580] text-white font-semibold rounded-2xl flex items-center gap-2 cursor-pointer shadow-md shadow-blue-500/10 active:scale-[0.98] transition duration-200 text-sm disabled:opacity-50"
                                                    >
                                                        {handlesSaving ? <Loader2 size={16} className="animate-spin" /> : null}
                                                        Save Handles
                                                    </button>
                                                </div>
                                            )}
                                        </form>
                                    );
                                })()}
                            </div>
                        )}

                        {activeTab === 'attendance' && (
                            <div className="space-y-8 font-sans">
                                {/* Summary Widgets */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                    <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 flex items-center gap-4 hover:shadow-md transition-all duration-300">
                                        <div className="p-4 bg-blue-50 text-[#004AAD] rounded-2xl">
                                            <BookOpen size={24} />
                                        </div>
                                        <div>
                                            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Total Sessions</span>
                                            <span className="text-2xl font-semibold text-slate-800">
                                                {student?.attendance?.totalSessions || 0}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 flex items-center gap-4 hover:shadow-md transition-all duration-300">
                                        <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
                                            <CheckCircle size={24} />
                                        </div>
                                        <div>
                                            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Sessions Attended</span>
                                            <span className="text-2xl font-semibold text-slate-800">
                                                {student?.attendance?.attended || 0}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 flex items-center gap-4 hover:shadow-md transition-all duration-300">
                                        <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl">
                                            <Award size={24} />
                                        </div>
                                        <div>
                                            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Attendance Rate</span>
                                            <span className="text-2xl font-semibold text-slate-800">
                                                {student?.attendance ? `${student.attendance.percentage}%` : '100%'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Sessions List */}
                                <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-8 space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-800">Class Attendance Log</h3>
                                        <p className="text-slate-500 text-sm">Chronological feed of all recorded classes and your presence status.</p>
                                    </div>

                                    {!student?.attendance?.history || student.attendance.history.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                            <CalendarCheck className="text-slate-400 mb-2.5" size={32} />
                                            <p className="text-slate-700 font-semibold text-sm">No Attendance Logged</p>
                                            <p className="text-slate-400 text-xs mt-1">There are no logged sessions in your batch roster at this moment.</p>
                                        </div>
                                    ) : (() => {
                                        const sortedHistory = [...student.attendance.history].sort((a, b) => {
                                            const dateA = new Date(a.date);
                                            const dateB = new Date(b.date);
                                            return attendanceSortDesc ? dateB - dateA : dateA - dateB;
                                        });

                                        return (
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left border-collapse">
                                                    <thead>
                                                        <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                                            <th 
                                                                className="pb-3 pr-4 cursor-pointer select-none hover:text-[#004AAD] transition-colors"
                                                                onClick={() => setAttendanceSortDesc(!attendanceSortDesc)}
                                                            >
                                                                <div className="flex items-center gap-1.5">
                                                                    Date
                                                                    <span className="text-[10px] text-[#004AAD] font-bold">
                                                                        {attendanceSortDesc ? '▼' : '▲'}
                                                                    </span>
                                                                </div>
                                                            </th>
                                                            <th className="pb-3 px-4">Module / Period</th>
                                                            <th className="pb-3 px-4">Topic Covered</th>
                                                            <th className="pb-3 px-4">Instructor</th>
                                                            <th className="pb-3 pl-4 text-right">Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-50 text-sm font-medium text-slate-700">
                                                        {sortedHistory.map((sess) => {
                                                            const dateStr = new Date(sess.date).toLocaleDateString('en-IN', {
                                                                day: 'numeric',
                                                                month: 'short',
                                                                year: 'numeric'
                                                            });
                                                            
                                                            // status styling
                                                            let statusBg = '';
                                                            let statusText = '';
                                                            if (sess.status === 'present') {
                                                                statusBg = 'bg-emerald-50 text-emerald-700 border-emerald-100';
                                                                statusText = 'Present';
                                                            } else if (sess.status === 'absent') {
                                                                statusBg = 'bg-rose-50 text-rose-700 border-rose-100';
                                                                statusText = 'Absent';
                                                            } else if (sess.status === 'late') {
                                                                statusBg = 'bg-amber-50 text-amber-700 border-amber-100';
                                                                statusText = 'Late';
                                                            } else {
                                                                statusBg = 'bg-slate-50 text-slate-700 border-slate-100';
                                                                statusText = 'Excused';
                                                            }

                                                            return (
                                                                <tr key={sess._id} className="hover:bg-slate-50/60 transition duration-150">
                                                                    <td className="py-4 pr-4 font-mono text-slate-600">{dateStr}</td>
                                                                    <td className="py-4 px-4 text-slate-500">
                                                                        {sess.module} (Hour {sess.period})
                                                                    </td>
                                                                    <td className="py-4 px-4 text-slate-800 font-medium">
                                                                        {sess.topic || <span className="italic text-slate-400">No topic recorded</span>}
                                                                    </td>
                                                                    <td className="py-4 px-4 text-slate-500">{sess.trainerName}</td>
                                                                    <td className="py-4 pl-4 text-right">
                                                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${statusBg}`}>
                                                                            {statusText}
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        );
                                    })()}
                                </div>
                            </div>
                        )}

                        {activeTab === 'todo' && (
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                                {/* Left Categories Sidebar */}
                                <div className="md:col-span-3">
                                    <button 
                                        onClick={openAddTodoModal}
                                        className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white font-semibold rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-amber-500/10 transition duration-200 cursor-pointer text-sm"
                                    >
                                        Add Task
                                    </button>

                                    <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-4 mt-6 space-y-1.5 font-sans">
                                        {[
                                            { key: 'all', label: 'All Tasks', icon: BookOpen },
                                            { key: 'starred', label: 'Starred', icon: Star },
                                            { key: 'priority', label: 'Priority', icon: AlertTriangle },
                                            { key: 'schedule', label: 'Schedule', icon: CalendarCheck },
                                            { key: 'today', label: 'Today', icon: Clock },
                                            { key: 'done', label: 'Completed', icon: CheckCircle },
                                            { key: 'deleted', label: 'Trash', icon: Trash2 }
                                        ].map((item) => {
                                            const isActive = activeFilter === item.key;
                                            const counts = getFilterCounts();
                                            return (
                                                <button
                                                    key={item.key}
                                                    onClick={() => setActiveFilter(item.key)}
                                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                                                        isActive 
                                                            ? 'bg-amber-50 text-amber-700 border border-amber-100 shadow-xs' 
                                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <item.icon size={18} className={isActive ? 'text-amber-600' : 'text-slate-400'} />
                                                        <span>{item.label}</span>
                                                    </div>
                                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                                        isActive 
                                                            ? 'bg-amber-500 text-white' 
                                                            : 'bg-slate-100 text-slate-500'
                                                    }`}>
                                                        {counts[item.key] || 0}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Right Tasks List */}
                                <div className="md:col-span-9 space-y-6">
                                    <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-8 space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold text-slate-800 capitalize">
                                                {activeFilter === 'all' ? 'All Tasks' : `${activeFilter} Tasks`}
                                            </h3>
                                            <p className="text-slate-500 text-sm">Manage, filter, and track your tasks and deadlines.</p>
                                        </div>

                                        {loadingExams && todos.length === 0 ? (
                                            <div className="flex justify-center items-center py-12">
                                                <Loader2 className="animate-spin text-amber-500" size={28} />
                                            </div>
                                        ) : (() => {
                                            const list = Array.isArray(todos) ? todos : [];
                                            const filtered = list.filter(t => {
                                                if (activeFilter === 'all') return t.status !== 'deleted';
                                                if (activeFilter === 'starred') return t.isStarred && t.status !== 'deleted';
                                                if (activeFilter === 'priority') return t.isPriority && t.status !== 'deleted';
                                                if (activeFilter === 'schedule') return t.dueDate && t.status !== 'deleted';
                                                if (activeFilter === 'today') return t.dueDate && new Date(t.dueDate).toDateString() === new Date().toDateString() && t.status !== 'deleted';
                                                if (activeFilter === 'done') return t.status === 'completed';
                                                if (activeFilter === 'deleted') return t.status === 'deleted';
                                                return true;
                                            });

                                            if (filtered.length === 0) {
                                                return (
                                                    <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200 p-8">
                                                        <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 mb-4">
                                                            <CalendarCheck size={32} />
                                                        </div>
                                                        <p className="text-slate-700 font-semibold text-lg">There are no todos!</p>
                                                        <p className="text-slate-400 text-sm max-w-sm mt-1">Enjoy your day or create a new task using the "Add Task" button on the left.</p>
                                                    </div>
                                                );
                                            }

                                            return (
                                                <div className="space-y-4">
                                                    {filtered.map((todo) => {
                                                        const isCompleted = todo.status === 'completed';
                                                        const isDeleted = todo.status === 'deleted';
                                                        const dueDateObj = todo.dueDate ? new Date(todo.dueDate) : null;
                                                        const isPastDue = dueDateObj && dueDateObj < new Date() && !isCompleted && !isDeleted;
                                                        
                                                        let dateStr = '';
                                                        if (dueDateObj) {
                                                            dateStr = dueDateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
                                                        }

                                                        return (
                                                            <div 
                                                                key={todo._id}
                                                                className={`bg-white border border-slate-100 shadow-sm rounded-3xl p-5 hover:shadow-md hover:border-amber-500/10 transition-all duration-300 flex items-start justify-between gap-4 relative group ${
                                                                    isCompleted ? 'opacity-70 bg-slate-50/30' : ''
                                                                }`}
                                                            >
                                                                <div className="flex items-start gap-4 flex-1">
                                                                    {/* Completion Checkbox */}
                                                                    <button
                                                                        type="button"
                                                                        disabled={isDeleted}
                                                                        onClick={() => handleToggleComplete(todo)}
                                                                        className={`mt-1 flex-shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                                                                            isCompleted 
                                                                                ? 'bg-amber-500 border-amber-500 text-white' 
                                                                                : 'border-slate-350 hover:border-amber-500'
                                                                        } ${isDeleted ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                                                                    >
                                                                        {isCompleted && (
                                                                            <span className="text-white text-[10px] font-semibold">✓</span>
                                                                        )}
                                                                    </button>

                                                                    {/* Task Info */}
                                                                    <div className="space-y-1 flex-1">
                                                                        <h4 className={`text-base font-semibold text-slate-800 leading-snug ${
                                                                            isCompleted ? 'line-through text-slate-400' : ''
                                                                        }`}>
                                                                            {todo.title}
                                                                        </h4>
                                                                        {todo.description && (
                                                                            <p className={`text-slate-500 text-xs sm:text-sm leading-relaxed ${
                                                                                isCompleted ? 'line-through text-slate-400' : ''
                                                                            }`}>
                                                                                {todo.description}
                                                                            </p>
                                                                        )}

                                                                        {/* Date and Badges */}
                                                                        <div className="flex flex-wrap items-center gap-2 mt-3.5">
                                                                            {todo.dueDate && (
                                                                                <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-lg ${
                                                                                    isCompleted 
                                                                                        ? 'bg-slate-50 text-slate-400'
                                                                                        : isPastDue 
                                                                                            ? 'bg-rose-50 text-rose-600 border border-rose-100'
                                                                                            : 'bg-blue-50 text-blue-600 border border-blue-100'
                                                                                }`}>
                                                                                    <Clock size={12} />
                                                                                    Due: {dateStr} {isPastDue && '(Overdue)'}
                                                                                </span>
                                                                            )}

                                                                            {todo.isPriority && (
                                                                                <span className="inline-flex items-center gap-1 bg-red-50 border border-red-150 text-red-750 text-[10px] font-semibold px-2 py-0.5 rounded-lg">
                                                                                    High Priority
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Actions Right */}
                                                                <div className="flex items-center gap-1">
                                                                    {/* Star Toggle */}
                                                                    {!isDeleted && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleToggleStar(todo)}
                                                                            className={`p-2 rounded-xl transition duration-150 cursor-pointer ${
                                                                                todo.isStarred 
                                                                                    ? 'text-amber-500 bg-amber-50/50 hover:bg-amber-50' 
                                                                                    : 'text-slate-450 hover:text-slate-600 hover:bg-slate-50'
                                                                            }`}
                                                                            title={todo.isStarred ? 'Unstar Task' : 'Star Task'}
                                                                        >
                                                                            <Star size={16} fill={todo.isStarred ? 'currentColor' : 'none'} />
                                                                        </button>
                                                                    )}

                                                                    {/* Priority Toggle */}
                                                                    {!isDeleted && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleTogglePriority(todo)}
                                                                            className={`p-2 rounded-xl transition duration-150 cursor-pointer ${
                                                                                todo.isPriority 
                                                                                    ? 'text-rose-500 bg-rose-50/50 hover:bg-rose-50' 
                                                                                    : 'text-slate-450 hover:text-slate-650 hover:bg-slate-50'
                                                                            }`}
                                                                            title={todo.isPriority ? 'Remove Priority' : 'Mark as Priority'}
                                                                        >
                                                                            <AlertTriangle size={16} />
                                                                        </button>
                                                                    )}

                                                                    {/* Edit Button */}
                                                                    {!isDeleted && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => openEditTodoModal(todo)}
                                                                            className="p-2 text-slate-450 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition duration-150 cursor-pointer"
                                                                            title="Edit Task"
                                                                        >
                                                                            <FileText size={16} />
                                                                        </button>
                                                                    )}

                                                                    {/* Delete / Restore Actions */}
                                                                    {isDeleted ? (
                                                                        <div className="flex items-center gap-1.5">
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => handleRestoreTodo(todo)}
                                                                                className="px-2.5 py-1.5 text-xs font-semibold text-amber-600 hover:text-amber-750 bg-amber-50 hover:bg-amber-100 rounded-lg cursor-pointer transition"
                                                                            >
                                                                                Restore
                                                                            </button>
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => handlePermanentDeleteTodo(todo._id)}
                                                                                className="p-2 text-slate-450 hover:text-red-500 hover:bg-red-50 rounded-xl cursor-pointer transition"
                                                                                title="Delete Permanently"
                                                                            >
                                                                                <Trash2 size={16} />
                                                                            </button>
                                                                        </div>
                                                                    ) : (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleSoftDeleteTodo(todo)}
                                                                            className="p-2 text-slate-450 hover:text-red-500 hover:bg-red-50 rounded-xl cursor-pointer transition md:opacity-0 group-hover:opacity-100 duration-200"
                                                                            title="Move to Trash"
                                                                        >
                                                                            <Trash2 size={16} />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            );
                                        })()}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <form onSubmit={handleUpdatePassword} className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-8 space-y-6 max-w-xl">
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-800">Account Security</h3>
                                    <p className="text-slate-500 text-sm">Update your access password below. Current password verification is required.</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Current Password</label>
                                    <div className="relative group">
                                        <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#004AAD] transition-colors" />
                                        <input
                                            type={showPw1 ? 'text' : 'password'}
                                            required
                                            placeholder="Enter current password"
                                            className="w-full pl-12 pr-12 py-3.5 bg-slate-50/30 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:bg-white focus:border-[#004AAD] focus:ring-[4px] focus:ring-blue-50 outline-none transitionplaceholder:text-slate-400"
                                            value={currentPw}
                                            onChange={(e) => setCurrentPw(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPw1(!showPw1)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#004AAD] transition-colors p-1"
                                        >
                                            {showPw1 ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2 border-t border-slate-50 pt-4">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">New Password</label>
                                    <input
                                        type="password"
                                        required
                                        placeholder="At least 6 characters"
                                        className="w-full px-5 py-3.5 bg-slate-50/30 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:bg-white focus:border-[#004AAD] focus:ring-[4px] focus:ring-blue-50 outline-none transition placeholder:text-slate-400"
                                        value={newPw}
                                        onChange={(e) => setNewPw(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Confirm New Password</label>
                                    <div className="relative group">
                                        <input
                                            type={showPw2 ? 'text' : 'password'}
                                            required
                                            placeholder="Re-enter new password"
                                            className="w-full px-5 py-3.5 bg-slate-50/30 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:bg-white focus:border-[#004AAD] focus:ring-[4px] focus:ring-blue-50 outline-none transition placeholder:text-slate-400"
                                            value={confirmPw}
                                            onChange={(e) => setConfirmPw(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPw2(!showPw2)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#004AAD] transition-colors p-1"
                                        >
                                            {showPw2 ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end border-t border-slate-100">
                                    <button
                                        type="submit"
                                        disabled={pwSaving || !currentPw.trim() || !newPw.trim() || !confirmPw.trim()}
                                        className="px-8 py-3.5 bg-[#004AAD] hover:bg-[#003580] text-white font-semibold rounded-2xl flex items-center gap-2 cursor-pointer shadow-md shadow-blue-500/10 active:scale-[0.98] transition duration-200 text-sm disabled:opacity-50"
                                    >
                                        {pwSaving ? <Loader2 size={16} className="animate-spin" /> : null}
                                        Update Password
                                    </button>
                                </div>
                            </form>
                        )}

                        {activeTab === 'leaderboard' && (
                            <div className="space-y-8 font-sans">
                                <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-8 space-y-6">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-slate-800">Batch Standings Leaderboard</h3>
                                            <p className="text-slate-500 text-sm">
                                                Performance tracking for batch <strong>{student?.batchId?.batchName || student?.batchName}</strong>
                                            </p>
                                        </div>
                                        {student?.batchId?.integrationType && student.batchId.integrationType !== 'none' && (
                                            <button
                                                onClick={async () => {
                                                    setSyncingLeaderboard(true);
                                                    try {
                                                        await fetchStudentLeaderboard();
                                                    } finally {
                                                        setSyncingLeaderboard(false);
                                                    }
                                                }}
                                                disabled={syncingLeaderboard}
                                                className="px-5 py-2.5 bg-[#004AAD] hover:bg-[#003580] text-white font-semibold rounded-2xl text-xs flex items-center gap-2 cursor-pointer transition shadow-sm active:scale-95 disabled:opacity-50"
                                            >
                                                {syncingLeaderboard ? <Loader2 size={14} className="animate-spin" /> : null}
                                                Sync My Stats
                                            </button>
                                        )}
                                    </div>

                                    {loadingLeaderboard ? (
                                        <div className="flex justify-center items-center py-12">
                                            <Loader2 className="animate-spin text-[#004AAD]" size={28} />
                                        </div>
                                    ) : leaderboardData.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                            <Trophy className="text-slate-400 mb-2.5" size={32} />
                                            <p className="text-slate-700 font-semibold text-sm">No Leaderboard Data</p>
                                            <p className="text-slate-400 text-xs mt-1">Standings are not generated for this batch yet.</p>
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                                        <th className="pb-3 pr-4">Rank</th>
                                                        <th className="pb-3 px-4">Student</th>
                                                        <th className="pb-3 px-4">USN / Roll</th>
                                                        <th className="pb-3 px-4">Department</th>
                                                        {student?.batchId?.integrationType && student.batchId.integrationType !== 'none' ? (
                                                            <>
                                                                <th className="pb-3 px-4">Points</th>
                                                                <th className="pb-3 pl-4 text-right">Badges</th>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <th className="pb-3 px-4">Score</th>
                                                                <th className="pb-3 pl-4 text-right">Percentage</th>
                                                            </>
                                                        )}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-50 text-sm font-medium text-slate-700">
                                                    {leaderboardData.map((row) => {
                                                        const isSelf = row.isSelf;
                                                        return (
                                                            <tr 
                                                                key={row.usn} 
                                                                className={`transition duration-150 ${
                                                                    isSelf 
                                                                        ? 'bg-blue-50/55 hover:bg-blue-50 border-y border-blue-100/50 font-bold text-blue-900' 
                                                                        : 'hover:bg-slate-50/60'
                                                                }`}
                                                            >
                                                                <td className="py-4 pr-4 pl-2 font-semibold">
                                                                    <div className="flex items-center gap-2">
                                                                        {row.rank === 1 && <span className="text-amber-500 text-base">🥇</span>}
                                                                        {row.rank === 2 && <span className="text-slate-400 text-base">🥈</span>}
                                                                        {row.rank === 3 && <span className="text-amber-700 text-base">🥉</span>}
                                                                        <span>#{row.rank}</span>
                                                                    </div>
                                                                </td>
                                                                <td className="py-4 px-4">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="truncate max-w-[180px] block">{row.name}</span>
                                                                        {isSelf && (
                                                                            <span className="bg-blue-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0">You</span>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td className="py-4 px-4 font-mono text-xs">{row.usn}</td>
                                                                <td className="py-4 px-4 text-slate-500 uppercase text-xs">{row.department}</td>
                                                                {row.integrationType && row.integrationType !== 'none' ? (
                                                                    <>
                                                                        <td className="py-4 px-4 font-bold text-slate-800">
                                                                            {row.score} pts
                                                                        </td>
                                                                        <td className="py-4 pl-4 text-right font-semibold text-[#004AAD]">
                                                                            🏆 {row.badges} Badges
                                                                        </td>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <td className="py-4 px-4 font-semibold text-slate-700">
                                                                            {row.score} / {row.totalMarks}
                                                                        </td>
                                                                        <td className="py-4 pl-4 text-right font-bold text-emerald-600">
                                                                            {row.percentage}%
                                                                        </td>
                                                                    </>
                                                                )}
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
            </div>

            {/* Add/Edit Todo Modal */}
            <AnimatePresence>
                {todoModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setTodoModalOpen(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
                        />

                        {/* Modal Dialog */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-[2rem] border border-slate-100 shadow-2xl w-full max-w-lg overflow-hidden z-10 flex flex-col max-h-[90vh] font-sans text-left"
                        >
                            <div className="px-6 py-5 bg-slate-50 border-b border-slate-150 flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-slate-800">
                                    {todoEditingId ? 'Edit Task Details' : 'Create New Task'}
                                </h3>
                                <button 
                                    onClick={() => setTodoModalOpen(false)}
                                    className="text-slate-400 hover:text-slate-650 font-semibold text-xl p-1"
                                >
                                    ×
                                </button>
                            </div>

                            <form onSubmit={handleSaveTodo} className="p-6 space-y-4 overflow-y-auto">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Task Title</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Enter task name"
                                        className="w-full px-5 py-3 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:border-amber-500 outline-none transition bg-slate-50/30 focus:bg-white"
                                        value={todoTitle}
                                        onChange={(e) => setTodoTitle(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Description</label>
                                    <textarea
                                        placeholder="Enter task notes or details..."
                                        rows={3}
                                        className="w-full px-5 py-3 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:border-amber-500 outline-none transition bg-slate-50/30 focus:bg-white"
                                        value={todoDesc}
                                        onChange={(e) => setTodoDesc(e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Due Date</label>
                                        <input
                                            type="date"
                                            className="w-full px-5 py-3 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-700 focus:border-amber-500 outline-none transition bg-slate-50/30 focus:bg-white cursor-pointer"
                                            value={todoDueDate}
                                            onChange={(e) => setTodoDueDate(e.target.value)}
                                        />
                                    </div>

                                    <div className="flex flex-col justify-end gap-2.5 py-1 text-left">
                                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer select-none">
                                            <input
                                                type="checkbox"
                                                className="rounded border-slate-350 text-amber-500 focus:ring-amber-500"
                                                checked={todoIsStarred}
                                                onChange={(e) => setTodoIsStarred(e.target.checked)}
                                            />
                                            Starred Task
                                        </label>
                                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer select-none">
                                            <input
                                                type="checkbox"
                                                className="rounded border-slate-350 text-red-500 focus:ring-red-500"
                                                checked={todoIsPriority}
                                                onChange={(e) => setTodoIsPriority(e.target.checked)}
                                            />
                                            High Priority
                                        </label>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setTodoModalOpen(false)}
                                        className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs rounded-xl cursor-pointer transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs rounded-xl shadow-md shadow-amber-500/10 cursor-pointer transition"
                                    >
                                        {todoEditingId ? 'Update Task' : 'Add Task'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AlertModal
                isOpen={alertState.open}
                onClose={() => setAlertState({ ...alertState, open: false })}
                title={alertState.title}
                message={alertState.message}
                type={alertState.type}
            />

            {activeTab === 'placement' && (
                <StudentPlacementTab token={token} student={student} setAlertState={setAlertState} />
            )}
        </div>
    );
};

const StudentPlacementTab = ({ token, student, setAlertState }) => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [applyingId, setApplyingId] = useState(null);
    const [embedFormJob, setEmbedFormJob] = useState(null);

    const getEmbedUrl = (url) => {
        if (!url) return '';
        let formattedUrl = url.trim();
        if (!/^https?:\/\//i.test(formattedUrl)) {
            formattedUrl = 'https://' + formattedUrl;
        }
        try {
            if (formattedUrl.includes('docs.google.com/forms')) {
                const parsedUrl = new URL(formattedUrl);
                if (parsedUrl.pathname.endsWith('/edit')) {
                    parsedUrl.pathname = parsedUrl.pathname.slice(0, -5) + '/viewform';
                } else if (parsedUrl.pathname.endsWith('/formResponse')) {
                    parsedUrl.pathname = parsedUrl.pathname.slice(0, -13) + '/viewform';
                } else if (!parsedUrl.pathname.endsWith('/viewform')) {
                    parsedUrl.pathname = parsedUrl.pathname.replace(/\/?$/, '/viewform');
                }
                parsedUrl.searchParams.set('embedded', 'true');
                return parsedUrl.toString();
            }
            return formattedUrl;
        } catch (e) {
            return formattedUrl;
        }
    };

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/placement/student/jobs`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setJobs(res.data.data || []);
            }
        } catch (e) {
            console.error('Failed to load placement job opportunities', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchJobs();
        }
    }, [token]);

    const handleApply = async (jobId) => {
        try {
            setApplyingId(jobId);
            const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/placement/student/jobs/${jobId}/apply`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setAlertState({
                    open: true,
                    title: 'Application Successful',
                    message: res.data.message || 'You have successfully applied for this job drive.',
                    type: 'success'
                });
                fetchJobs();
            }
        } catch (e) {
            setAlertState({
                open: true,
                title: 'Application Failed',
                message: e.response?.data?.error || 'Failed to submit application.',
                type: 'error'
            });
        } finally {
            setApplyingId(null);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'shortlisted': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'rejected': return 'bg-rose-50 text-rose-700 border-rose-100';
            case 'screening_passed': return 'bg-teal-50 text-teal-700 border-teal-100';
            case 'screening_failed': return 'bg-orange-50 text-orange-700 border-orange-100';
            case 'sent_to_company': return 'bg-purple-50 text-purple-700 border-purple-100';
            default: return 'bg-blue-50 text-blue-700 border-blue-100';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <Loader2 className="animate-spin text-[#004AAD]" size={28} />
                <span className="text-slate-400 text-sm font-semibold ml-2">Loading placement drives...</span>
            </div>
        );
    }

    return (
        <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 text-[#004AAD] rounded-2xl">
                    <Briefcase size={22} />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-800">Job Placements & Campus Drives</h3>
                    <p className="text-slate-500 text-xs sm:text-sm">Opportunities targeted to your batch. Check your eligibility rules and apply.</p>
                </div>
            </div>

            {jobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                    <Briefcase className="text-slate-400 mb-2.5" size={36} />
                    <p className="text-slate-700 font-semibold text-sm">No Campus Drives Active</p>
                    <p className="text-slate-400 text-xs mt-1">There are no active placement drives published for your batch currently.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {jobs.map((job) => {
                        const isEligible = job.eligibility?.eligible;
                        const reasons = job.eligibility?.reasons || [];
                        const isApplied = job.isApplied;

                        return (
                            <div key={job._id} className="border border-slate-100 rounded-2xl p-5 hover:shadow-md hover:border-[#004AAD]/20 transition-all duration-300 bg-white flex flex-col justify-between group">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-start gap-2">
                                        <span className="text-[10px] font-semibold text-[#004AAD] uppercase bg-blue-50 px-2.5 py-1 rounded-full tracking-wider">
                                            {job.company}
                                        </span>
                                        {isApplied ? (
                                            <span className={`border text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${getStatusBadge(job.applicationStatus)}`}>
                                                Applied • {job.applicationStatus?.replace('_', ' ')}
                                            </span>
                                        ) : isEligible ? (
                                            <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full">Eligible</span>
                                        ) : (
                                            <span className="bg-rose-50 text-rose-600 border border-rose-100 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full">Ineligible</span>
                                        )}
                                    </div>

                                    <h4 className="text-base font-semibold text-slate-800 group-hover:text-[#004AAD] transition-colors leading-snug">
                                        {job.title}
                                    </h4>

                                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{job.description}</p>

                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1 text-[11px] font-semibold text-slate-400">
                                        {job.location && <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>}
                                        {job.salaryPackage && <span className="flex items-center gap-1"><DollarSign size={12} /> Package: {job.salaryPackage}</span>}
                                    </div>

                                    {/* Criteria Rules UI */}
                                    <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-[11px] text-slate-600 font-semibold border border-slate-100">
                                        <div className="flex justify-between">
                                            <span>Min CGPA Requirement:</span>
                                            <span className="text-slate-800">{job.rules?.minCgpa !== null ? job.rules.minCgpa : 'Open'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Max Active Backlogs:</span>
                                            <span className="text-slate-800">{job.rules?.maxBacklogs !== null ? job.rules.maxBacklogs : 'Open'}</span>
                                        </div>
                                        {job.rules?.allowedDepartments && job.rules.allowedDepartments.length > 0 && (
                                            <div className="flex justify-between">
                                                <span>Eligible Branches:</span>
                                                <span className="text-slate-800">{job.rules.allowedDepartments.join(', ')}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Warnings if ineligible */}
                                    {!isEligible && (
                                        <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl space-y-1 text-rose-700 text-xs font-semibold">
                                            <p className="flex items-center gap-1"><AlertTriangle size={12} /> Eligibility Warnings:</p>
                                            <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                                                {reasons.map((r, i) => <li key={i}>{r}</li>)}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-5 pt-3 border-t border-slate-50">
                                    {isApplied ? (
                                        <div className="text-center py-2 bg-slate-50 text-slate-400 text-xs font-bold rounded-xl border border-slate-100">
                                            Application Submitted
                                        </div>
                                    ) : !isEligible ? (
                                        <div className="text-center py-2 bg-slate-50 text-slate-400 text-xs font-bold rounded-xl border border-slate-100 cursor-not-allowed">
                                            Criteria Not Met
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                if (job.googleFormUrl) {
                                                    setEmbedFormJob(job);
                                                } else {
                                                    handleApply(job._id);
                                                }
                                            }}
                                            disabled={applyingId === job._id}
                                            className="w-full py-2.5 bg-[#004AAD] hover:bg-[#003580] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition shadow-sm"
                                        >
                                            {applyingId === job._id ? (
                                                <Loader2 className="animate-spin" size={14} />
                                            ) : (
                                                <span>Apply for Role</span>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Google Form Embed Modal */}
            <AnimatePresence>
                {embedFormJob && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setEmbedFormJob(null)}
                            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
                        />

                        {/* Modal Dialog */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-[2rem] border border-slate-100 shadow-2xl w-full max-w-4xl overflow-hidden z-10 flex flex-col max-h-[90vh] font-sans text-left"
                        >
                            <div className="px-6 py-5 bg-slate-50 border-b border-slate-150 flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                        <Briefcase size={18} className="text-[#004AAD]" />
                                        Application Form: {embedFormJob.company}
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-0.5">Role: {embedFormJob.title}</p>
                                </div>
                                <button 
                                    onClick={() => setEmbedFormJob(null)}
                                    className="text-slate-400 hover:text-slate-650 font-semibold text-xl p-1"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="p-6 space-y-4 flex-1 overflow-y-auto flex flex-col">
                                <div className="p-3.5 bg-blue-50 border border-blue-100 rounded-xl text-xs text-[#004AAD] font-medium leading-relaxed">
                                    <strong>Instructions:</strong> Please fill out and submit the Google Form displayed below. After completing the form, you <strong>must</strong> click the <strong>"Confirm & Complete Application"</strong> button at the bottom to register your application in the placement system.
                                </div>

                                <div className="flex-1 w-full bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden relative min-h-[450px]">
                                    <iframe 
                                        src={getEmbedUrl(embedFormJob.googleFormUrl)} 
                                        width="100%" 
                                        height="100%" 
                                        className="absolute inset-0 border-0 w-full h-full"
                                        title="Google Form" 
                                    />
                                </div>
                            </div>

                            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <span className="text-[11px] text-slate-500 font-semibold">
                                    Your profile details and resume will be shared with the recruiter.
                                </span>
                                <div className="flex items-center gap-3 justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setEmbedFormJob(null)}
                                        className="px-5 py-2.5 border border-slate-200 hover:bg-slate-100 text-slate-650 font-semibold text-xs rounded-xl cursor-pointer transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            const id = embedFormJob._id;
                                            setEmbedFormJob(null);
                                            await handleApply(id);
                                        }}
                                        className="px-6 py-2.5 bg-[#004AAD] hover:bg-[#003580] text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/10 cursor-pointer transition"
                                    >
                                        Confirm & Complete Application
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StudentDashboard;
