import { useState, useEffect, useCallback } from 'react';
import { 
    Plus, Search, Filter, Trash2, ChevronLeft, ChevronRight, Loader2, CheckCircle2, 
    AlertCircle, BookOpen, Tag, BarChart3, Brain, Layers, X, Database
} from 'lucide-react';
import axios from 'axios';
import useAuthStore from '../../store/authStore';
import useCollegeStore from '../../store/collegeStore';
import { ConfirmModal, AlertModal } from '../../components/Modals';

const QUESTION_TYPES = [
    { id: 'single_correct', label: 'Single Correct' },
    { id: 'multiple_correct', label: 'Multiple Correct' },
    { id: 'true_false', label: 'True / False' },
    { id: 'fill_blank', label: 'Fill in the Blank' },
    { id: 'numeric', label: 'Numeric' },
];

const DIFFICULTY_LEVELS = [
    { id: 'easy', label: 'Easy', color: 'bg-emerald-100 text-emerald-700' },
    { id: 'medium', label: 'Medium', color: 'bg-amber-100 text-amber-700' },
    { id: 'hard', label: 'Hard', color: 'bg-rose-100 text-rose-700' },
];

const BLOOMS_LEVELS = [
    { id: 'remember', label: 'Remember', color: 'bg-sky-100 text-sky-700' },
    { id: 'understand', label: 'Understand', color: 'bg-blue-100 text-blue-700' },
    { id: 'apply', label: 'Apply', color: 'bg-indigo-100 text-indigo-700' },
    { id: 'analyze', label: 'Analyze', color: 'bg-violet-100 text-violet-700' },
    { id: 'evaluate', label: 'Evaluate', color: 'bg-purple-100 text-purple-700' },
    { id: 'create', label: 'Create', color: 'bg-fuchsia-100 text-fuchsia-700' },
];

const DifficultyBadge = ({ level }) => {
    const d = DIFFICULTY_LEVELS.find(d => d.id === level) || DIFFICULTY_LEVELS[1];
    return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${d.color}`}>{d.label}</span>;
};

const BloomsBadge = ({ level }) => {
    const b = BLOOMS_LEVELS.find(b => b.id === level) || BLOOMS_LEVELS[0];
    return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${b.color}`}>{b.label}</span>;
};

const QuestionBank = () => {
    const { token, user } = useAuthStore();
    const { selectedCollegeId } = useCollegeStore();
    const isReadOnly = ['regional_manager', 'asst_rm'].includes(user?.role);
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const headers = { Authorization: `Bearer ${token}` };

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [search, setSearch] = useState('');
    const [filterSubject, setFilterSubject] = useState('');
    const [filterDifficulty, setFilterDifficulty] = useState('');
    const [filterBlooms, setFilterBlooms] = useState('');
    const [availableSubjects, setAvailableSubjects] = useState([]);
    const [addOpen, setAddOpen] = useState(false);
    const [addLoading, setAddLoading] = useState(false);
    const [confirmState, setConfirmState] = useState({ open: false });
    const [alertState, setAlertState] = useState({ open: false });

    // Course state
    const [courses, setCourses] = useState([]);
    const [filterCourse, setFilterCourse] = useState('');

    // New question form
    const [newQ, setNewQ] = useState({
        courseId: '', subject: '', topic: '', difficulty: 'medium', bloomsLevel: 'remember',
        type: 'single_correct', text: '', points: 1,
        options: ['', '', '', ''], correctAnswer: '', correctAnswers: [], tags: ''
    });

    const fetchQuestions = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page, limit: 15 });
            if (selectedCollegeId) params.append('collegeId', selectedCollegeId);
            if (search) params.append('search', search);
            if (filterSubject) params.append('subject', filterSubject);
            if (filterDifficulty) params.append('difficulty', filterDifficulty);
            if (filterBlooms) params.append('bloomsLevel', filterBlooms);
            if (filterCourse) params.append('courseId', filterCourse);
            
            const res = await axios.get(`${apiBase}/question-bank?${params}`, { headers });
            setQuestions(res.data.data);
            setTotalPages(res.data.totalPages);
            setTotalCount(res.data.totalCount);
            setAvailableSubjects(res.data.filters?.subjects || []);
        } catch (e) { console.error('Fetch question bank error:', e); }
        finally { setLoading(false); }
    }, [page, search, filterSubject, filterDifficulty, filterBlooms, filterCourse, selectedCollegeId]);

    const fetchStats = useCallback(async () => {
        try {
            const params = selectedCollegeId ? `?collegeId=${selectedCollegeId}` : '';
            const res = await axios.get(`${apiBase}/question-bank/stats${params}`, { headers });
            setStats(res.data.data);
        } catch (e) { console.error('Stats error:', e); }
    }, [selectedCollegeId]);

    useEffect(() => { fetchQuestions(); }, [fetchQuestions]);
    useEffect(() => { fetchStats(); }, [fetchStats]);

    // Fetch courses
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const url = selectedCollegeId 
                    ? `${apiBase}/admin/colleges/${selectedCollegeId}/courses`
                    : `${apiBase}/admin/courses`;
                const res = await axios.get(url, { headers });
                setCourses(res.data.data || []);
            } catch (e) { console.error('Fetch courses error:', e); }
        };
        fetchCourses();
    }, [selectedCollegeId]);

    const handleAddQuestion = async () => {
        if (!newQ.text.trim() || !newQ.subject.trim()) {
            setAlertState({ open: true, title: 'Validation', message: 'Question text and subject are required.', type: 'error' });
            return;
        }
        if (!newQ.courseId) {
            setAlertState({ open: true, title: 'Validation', message: 'Please select a course.', type: 'error' });
            return;
        }
        setAddLoading(true);
        try {
            const payload = {
                collegeId: selectedCollegeId || user?.collegeId,
                courseId: newQ.courseId,
                subject: newQ.subject,
                topic: newQ.topic,
                difficulty: newQ.difficulty,
                bloomsLevel: newQ.bloomsLevel,
                type: newQ.type,
                text: newQ.text,
                points: newQ.points,
                options: newQ.options.filter(Boolean),
                correctAnswer: newQ.correctAnswer,
                correctAnswers: newQ.correctAnswers,
                tags: newQ.tags ? newQ.tags.split(',').map(t => t.trim()).filter(Boolean) : []
            };

            await axios.post(`${apiBase}/question-bank`, payload, { headers });
            setAlertState({ open: true, title: 'Success', message: 'Question added to the bank!', type: 'success' });
            setAddOpen(false);
            setNewQ({
                courseId: newQ.courseId, subject: newQ.subject, topic: newQ.topic, difficulty: 'medium', bloomsLevel: 'remember',
                type: 'single_correct', text: '', points: 1,
                options: ['', '', '', ''], correctAnswer: '', correctAnswers: [], tags: ''
            });
            fetchQuestions();
            fetchStats();
        } catch (error) {
            setAlertState({ open: true, title: 'Error', message: error.response?.data?.error || 'Failed to add question', type: 'error' });
        } finally { setAddLoading(false); }
    };

    const handleDelete = (id) => {
        setConfirmState({
            open: true,
            title: 'Delete Question',
            message: 'Are you sure you want to remove this question from the bank?',
            type: 'danger',
            confirmText: 'Delete',
            onConfirm: async () => {
                try {
                    await axios.delete(`${apiBase}/question-bank/${id}`, { headers });
                    setAlertState({ open: true, title: 'Deleted', message: 'Question removed from bank.', type: 'success' });
                    fetchQuestions();
                    fetchStats();
                } catch (error) {
                    setAlertState({ open: true, title: 'Error', message: 'Failed to delete question', type: 'error' });
                }
            }
        });
    };

    const toggleMultipleCorrect = (opt) => {
        const current = newQ.correctAnswers || [];
        const next = current.includes(opt) ? current.filter(a => a !== opt) : [...current, opt];
        setNewQ({ ...newQ, correctAnswers: next });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Question Bank</h1>
                    <p className="text-sm text-slate-500 mt-1">Course-based question repository categorized by Subject, Difficulty & Bloom's Taxonomy</p>
                </div>
                {!isReadOnly && (
                    <button onClick={() => setAddOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-[#004AAD] text-white text-sm font-semibold rounded-lg hover:bg-[#003580] transition-colors shadow-sm">
                        <Plus size={16} /> Add Question
                    </button>
                )}
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl border border-slate-200 p-4">
                        <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center mb-3">
                            <Layers size={18} className="text-indigo-600" />
                        </div>
                        <p className="text-xs text-slate-500 font-medium">Total Questions</p>
                        <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                    </div>
                    {stats.byDifficulty?.map(d => (
                        <div key={d._id} className="bg-white rounded-xl border border-slate-200 p-4">
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${
                                d._id === 'easy' ? 'bg-emerald-50' : d._id === 'medium' ? 'bg-amber-50' : 'bg-rose-50'
                            }`}>
                                <BarChart3 size={18} className={
                                    d._id === 'easy' ? 'text-emerald-600' : d._id === 'medium' ? 'text-amber-600' : 'text-rose-600'
                                } />
                            </div>
                            <p className="text-xs text-slate-500 font-medium capitalize">{d._id}</p>
                            <p className="text-2xl font-bold text-slate-900">{d.count}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px]">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none"
                        placeholder="Search questions..."
                    />
                </div>
                <select value={filterSubject} onChange={(e) => { setFilterSubject(e.target.value); setPage(1); }}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none">
                    <option value="">All Subjects</option>
                    {availableSubjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select value={filterDifficulty} onChange={(e) => { setFilterDifficulty(e.target.value); setPage(1); }}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none">
                    <option value="">All Difficulty</option>
                    {DIFFICULTY_LEVELS.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
                </select>
                <select value={filterBlooms} onChange={(e) => { setFilterBlooms(e.target.value); setPage(1); }}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none">
                    <option value="">All Bloom's Levels</option>
                    {BLOOMS_LEVELS.map(b => <option key={b.id} value={b.id}>{b.label}</option>)}
                </select>
                <select value={filterCourse} onChange={(e) => { setFilterCourse(e.target.value); setPage(1); }}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none">
                    <option value="">All Courses</option>
                    {courses.map(c => <option key={c._id} value={c._id}>{c.name} ({c.code})</option>)}
                </select>
                {(filterSubject || filterDifficulty || filterBlooms || filterCourse || search) && (
                    <button onClick={() => { setSearch(''); setFilterSubject(''); setFilterDifficulty(''); setFilterBlooms(''); setFilterCourse(''); setPage(1); }}
                        className="text-xs text-rose-500 font-semibold hover:underline">Clear Filters</button>
                )}
            </div>

            {/* Questions Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
                    <h3 className="text-sm font-semibold text-slate-700">{totalCount} question{totalCount !== 1 ? 's' : ''}</h3>
                    <span className="text-xs font-semibold text-slate-400">Page {page} of {totalPages}</span>
                </div>

                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-3">
                        <Loader2 className="animate-spin text-[#004AAD]" size={28} />
                        <p className="text-sm text-slate-400">Loading question bank...</p>
                    </div>
                ) : questions.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center text-center">
                        <Database size={40} className="text-slate-200 mb-4" />
                        <h3 className="text-base font-semibold text-slate-700">No questions found</h3>
                        <p className="text-sm text-slate-400 mt-1">Add questions to build your centralized repository.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {questions.map((q, idx) => (
                            <div key={q._id} className="px-6 py-4 hover:bg-slate-50/50 group">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                            <span className="w-6 h-6 bg-slate-100 rounded-md flex items-center justify-center text-xs font-bold text-slate-500">
                                                {(page - 1) * 15 + idx + 1}
                                            </span>
                                            <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-600 uppercase">
                                                {QUESTION_TYPES.find(t => t.id === q.type)?.label || q.type}
                                            </span>
                                            <DifficultyBadge level={q.difficulty} />
                                            <BloomsBadge level={q.bloomsLevel} />
                                            {q.subject && (
                                                <span className="px-2 py-0.5 bg-blue-50 rounded text-[10px] font-bold text-blue-600 flex items-center gap-1">
                                                    <BookOpen size={10} /> {q.subject}
                                                </span>
                                            )}
                                            {q.topic && (
                                                <span className="px-2 py-0.5 bg-slate-50 rounded text-[10px] font-bold text-slate-500">
                                                    {q.topic}
                                                </span>
                                            )}
                                            {q.courseId && (
                                                <span className="px-2 py-0.5 bg-violet-50 rounded text-[10px] font-bold text-violet-600 flex items-center gap-1">
                                                    📘 {q.courseId.name || 'Course'}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-800 font-medium leading-relaxed line-clamp-2">{q.text}</p>
                                        {q.options?.choices?.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {q.options.choices.map((c, ci) => (
                                                    <span key={ci} className={`text-xs px-2 py-1 rounded-lg border ${
                                                        c.isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-bold' : 'bg-slate-50 border-slate-100 text-slate-500'
                                                    }`}>
                                                        {String.fromCharCode(65 + ci)}. {c.text} {c.isCorrect && '✓'}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        {q.correctAnswerText && (
                                            <p className="text-xs text-emerald-600 font-semibold mt-2">Answer: {q.correctAnswerText}</p>
                                        )}
                                        {q.tags?.length > 0 && (
                                            <div className="flex gap-1 mt-2">
                                                {q.tags.map((tag, ti) => (
                                                    <span key={ti} className="text-[9px] px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded font-bold">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <span className="text-sm font-bold text-slate-600">{q.points} pts</span>
                                        {!isReadOnly && (
                                            <button onClick={() => handleDelete(q._id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all">
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-slate-100 flex justify-between items-center">
                        <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                            className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 disabled:opacity-30 border border-slate-200 rounded-lg hover:bg-slate-50">
                            <ChevronLeft size={14} /> Previous
                        </button>
                        <span className="text-xs text-slate-400">Page {page} of {totalPages}</span>
                        <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
                            className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 disabled:opacity-30 border border-slate-200 rounded-lg hover:bg-slate-50">
                            Next <ChevronRight size={14} />
                        </button>
                    </div>
                )}
            </div>

            {/* ========== ADD QUESTION MODAL ========== */}
            {addOpen && (
                <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-8 relative my-8 max-h-[90vh] overflow-y-auto border border-slate-200">
                        <button onClick={() => setAddOpen(false)} className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all">
                            <X size={18} />
                        </button>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                                <Plus size={24} className="text-indigo-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Add to Question Bank</h3>
                                <p className="text-sm text-slate-400">This question will be available for import into any exam</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* Course Selector */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Course *</label>
                                <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none"
                                    value={newQ.courseId} onChange={(e) => setNewQ({ ...newQ, courseId: e.target.value })}>
                                    <option value="">Select a course...</option>
                                    {courses.map(c => <option key={c._id} value={c._id}>{c.name} ({c.code})</option>)}
                                </select>
                            </div>

                            {/* Subject & Topic */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Subject *</label>
                                    <input className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none"
                                        placeholder="e.g. Python, Networking, DBMS"
                                        value={newQ.subject} onChange={(e) => setNewQ({ ...newQ, subject: e.target.value })}
                                        list="subjects-list"
                                    />
                                    <datalist id="subjects-list">
                                        {availableSubjects.map(s => <option key={s} value={s} />)}
                                    </datalist>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Topic</label>
                                    <input className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none"
                                        placeholder="e.g. Loops, TCP/IP, Normalization"
                                        value={newQ.topic} onChange={(e) => setNewQ({ ...newQ, topic: e.target.value })} />
                                </div>
                            </div>

                            {/* Difficulty & Bloom's */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Difficulty</label>
                                    <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none"
                                        value={newQ.difficulty} onChange={(e) => setNewQ({ ...newQ, difficulty: e.target.value })}>
                                        {DIFFICULTY_LEVELS.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1"><Brain size={12} /> Bloom's Level</label>
                                    <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none"
                                        value={newQ.bloomsLevel} onChange={(e) => setNewQ({ ...newQ, bloomsLevel: e.target.value })}>
                                        {BLOOMS_LEVELS.map(b => <option key={b.id} value={b.id}>{b.label}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Type & Points */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Question Type</label>
                                    <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none"
                                        value={newQ.type} onChange={(e) => {
                                            const t = e.target.value;
                                            setNewQ({ ...newQ, type: t, correctAnswer: '', correctAnswers: [],
                                                options: (t === 'fill_blank' || t === 'numeric') ? [] : (t === 'true_false') ? ['True', 'False'] : ['', '', '', '']
                                            });
                                        }}>
                                        {QUESTION_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Points</label>
                                    <input type="number" min="1" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-center focus:bg-white focus:border-[#004AAD] outline-none"
                                        value={newQ.points} onChange={(e) => setNewQ({ ...newQ, points: parseInt(e.target.value) || 1 })} />
                                </div>
                            </div>

                            {/* Question Text */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Question Text *</label>
                                <textarea className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none resize-none min-h-[80px]"
                                    placeholder="Enter the question..." value={newQ.text} onChange={(e) => setNewQ({ ...newQ, text: e.target.value })} />
                            </div>

                            {/* Options for MCQ types */}
                            {(newQ.type === 'single_correct' || newQ.type === 'multiple_correct') && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">
                                        {newQ.type === 'multiple_correct' ? 'Options (select all correct)' : 'Options (select correct answer)'}
                                    </label>
                                    {newQ.options.map((opt, i) => (
                                        <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                                            newQ.type === 'single_correct'
                                                ? (newQ.correctAnswer === opt && opt !== '' ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200')
                                                : (newQ.correctAnswers?.includes(opt) && opt !== '' ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200')
                                        }`}>
                                            {newQ.type === 'single_correct' ? (
                                                <button type="button" onClick={() => opt.trim() && setNewQ({ ...newQ, correctAnswer: opt })}
                                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                                        newQ.correctAnswer === opt && opt !== '' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 hover:border-[#004AAD]'
                                                    }`}>
                                                    {newQ.correctAnswer === opt && opt !== '' && <CheckCircle2 size={12} />}
                                                </button>
                                            ) : (
                                                <button type="button" onClick={() => opt.trim() && toggleMultipleCorrect(opt)}
                                                    className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border-2 ${
                                                        newQ.correctAnswers?.includes(opt) && opt !== '' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 hover:border-[#004AAD]'
                                                    }`}>
                                                    {newQ.correctAnswers?.includes(opt) && opt !== '' && <CheckCircle2 size={12} />}
                                                </button>
                                            )}
                                            <input className="flex-1 bg-transparent border-none text-sm outline-none" placeholder={`Option ${String.fromCharCode(65 + i)}`}
                                                value={opt} onChange={(e) => {
                                                    const opts = [...newQ.options];
                                                    opts[i] = e.target.value;
                                                    setNewQ({ ...newQ, options: opts });
                                                }} />
                                        </div>
                                    ))}
                                    {newQ.options.length < 6 && (
                                        <button onClick={() => setNewQ({ ...newQ, options: [...newQ.options, ''] })} className="text-xs text-[#004AAD] font-semibold hover:underline">+ Add Option</button>
                                    )}
                                </div>
                            )}

                            {/* True/False */}
                            {newQ.type === 'true_false' && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Select Correct Answer</label>
                                    <div className="flex gap-3">
                                        {['True', 'False'].map(val => (
                                            <button key={val} type="button" onClick={() => setNewQ({ ...newQ, correctAnswer: val })}
                                                className={`flex-1 py-3 rounded-lg border text-sm font-semibold transition-all ${
                                                    newQ.correctAnswer === val ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-white border-slate-200 text-slate-500'
                                                }`}>{val}</button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Fill in the Blank / Numeric */}
                            {(newQ.type === 'fill_blank' || newQ.type === 'numeric') && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Correct Answer</label>
                                    <input type={newQ.type === 'numeric' ? 'number' : 'text'}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none"
                                        placeholder={newQ.type === 'numeric' ? 'Enter the correct number...' : 'Type the exact correct answer...'}
                                        value={newQ.correctAnswer} onChange={(e) => setNewQ({ ...newQ, correctAnswer: e.target.value })} />
                                </div>
                            )}

                            {/* Tags */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1"><Tag size={12} /> Tags (comma-separated)</label>
                                <input className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none"
                                    placeholder="e.g. unit-1, important, semester-final"
                                    value={newQ.tags} onChange={(e) => setNewQ({ ...newQ, tags: e.target.value })} />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button onClick={() => setAddOpen(false)} className="px-5 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-700">Cancel</button>
                            <button onClick={handleAddQuestion} disabled={addLoading}
                                className="flex items-center gap-2 px-6 py-2.5 bg-[#004AAD] text-white text-sm font-bold rounded-xl hover:bg-[#003580] disabled:opacity-50 transition-all shadow-lg shadow-blue-200">
                                {addLoading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                                {addLoading ? 'Adding...' : 'Add to Bank'}
                            </button>
                        </div>
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
        </div>
    );
};

export default QuestionBank;
