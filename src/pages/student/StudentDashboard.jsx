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
    CalendarCheck
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
        todos, getTodos, addTodo, updateTodo, deleteTodo 
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
        if (tab && ['dashboard', 'profile', 'attendance', 'todo', 'security', 'enter-exam', 'exam-history'].includes(tab)) {
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
            setSkillsList(student.skills || []);
            setCapabilities(student.capabilities || '');
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
            mobile: personalMobile.trim()
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

    return (
        <div className="space-y-8">
            
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
                                                {student?.attendance ? `${student.attendance.percentage}%` : '100%'}
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
                                                        {student?.attendance ? `${student.attendance.percentage}%` : '100%'}
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
        </div>
    );
};

export default StudentDashboard;
