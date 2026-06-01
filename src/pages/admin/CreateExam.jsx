import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, CheckCircle2, ChevronRight, ChevronLeft, Loader2, Clock, Target, Send, AlertCircle, ChevronDown, Bot, FileSpreadsheet, Upload, Download, X, Database, Users } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from '../../store/authStore';
import useCollegeStore from '../../store/collegeStore';
import { ConfirmModal, AlertModal, AIUploadModal } from '../../components/Modals';

const QUESTION_TYPES = [
    { id: 'single_correct', label: 'Single Correct', description: 'One correct answer from multiple options' },
    { id: 'multiple_correct', label: 'Multiple Correct', description: 'Multiple correct answers allowed' },
    { id: 'true_false', label: 'True / False', description: 'Binary choice question' },
    { id: 'fill_blank', label: 'Fill in the Blank', description: 'Student types the answer' },
    { id: 'numeric', label: 'Numeric', description: 'Numeric value as the answer' },
];

const getDefaultQuestion = (type = 'single_correct') => ({
    id: Date.now() + Math.random(),
    type,
    text: '',
    options: type === 'true_false' ? ['True', 'False'] : type === 'fill_blank' || type === 'numeric' ? [] : ['', '', '', ''],
    correctAnswer: '',
    correctAnswers: [],
    marks: 5,
});

const QuestionEditor = ({ question, index, onChange, onRemove, total }) => {
    const q = question;
    const typeInfo = QUESTION_TYPES.find(t => t.id === q.type);

    const handleTypeChange = (newType) => {
        const updated = { ...q, type: newType, correctAnswer: '', correctAnswers: [] };
        if (newType === 'true_false') updated.options = ['True', 'False'];
        else if (newType === 'fill_blank' || newType === 'numeric') updated.options = [];
        else if (q.options.length === 0 || newType !== q.type) updated.options = ['', '', '', ''];
        onChange(q.id, null, updated);
    };

    const handleOptionChange = (i, value) => {
        const newOpts = [...q.options];
        newOpts[i] = value;
        onChange(q.id, 'options', newOpts);
    };

    const toggleMultipleCorrect = (opt) => {
        const current = q.correctAnswers || [];
        const next = current.includes(opt) ? current.filter(a => a !== opt) : [...current, opt];
        onChange(q.id, 'correctAnswers', next);
    };

    // Validation
    const errors = [];
    if (!q.text.trim()) errors.push('Question text is required');
    if (q.type === 'single_correct') {
        if (q.options.some(o => !o.trim())) errors.push('All options must be filled');
        if (!q.correctAnswer) errors.push('Select the correct answer');
    }
    if (q.type === 'multiple_correct') {
        if (q.options.some(o => !o.trim())) errors.push('All options must be filled');
        if (!q.correctAnswers?.length) errors.push('Select at least one correct answer');
    }
    if (q.type === 'true_false' && !q.correctAnswer) errors.push('Select True or False');
    if (q.type === 'fill_blank' && !q.correctAnswer.trim()) errors.push('Enter the correct answer');
    if (q.type === 'numeric' && q.correctAnswer === '') errors.push('Enter the numeric answer');

    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <span className="w-7 h-7 bg-[#004AAD] text-white rounded-md flex items-center justify-center text-xs font-bold">{index + 1}</span>
                    <span className="text-sm font-medium text-slate-500">Question {index + 1} of {total}</span>
                </div>
                <div className="flex items-center gap-3">
                    {errors.length > 0 && <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-md flex items-center gap-1"><AlertCircle size={12} />{errors.length} issue{errors.length > 1 ? 's' : ''}</span>}
                    <button onClick={() => onRemove(q.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Remove question"><Trash2 size={16} /></button>
                </div>
            </div>

            <div className="p-5 space-y-5">
                {/* Question Type Selector */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Question Type</label>
                        <select value={q.type} onChange={(e) => handleTypeChange(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:border-[#004AAD] outline-none appearance-none cursor-pointer" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}>
                            {QUESTION_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                        </select>
                        <p className="text-xs text-slate-400 mt-1">{typeInfo?.description}</p>
                    </div>
                    <div className="w-32">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Marks</label>
                        <input type="number" min="1" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-center focus:bg-white focus:border-[#004AAD] outline-none" value={q.marks} onChange={(e) => onChange(q.id, 'marks', parseInt(e.target.value) || 1)} />
                    </div>
                </div>

                {/* Question Text */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Question Text</label>
                    <textarea className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none resize-none min-h-[70px]" placeholder="Enter your question here..." value={q.text} onChange={(e) => onChange(q.id, 'text', e.target.value)} />
                </div>

                {/* Options for MCQ types */}
                {(q.type === 'single_correct' || q.type === 'multiple_correct') && (
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-slate-700">{q.type === 'multiple_correct' ? 'Options (select all correct)' : 'Options (select correct answer)'}</label>
                            {q.options.length < 6 && <button onClick={() => onChange(q.id, 'options', [...q.options, ''])} className="text-xs text-[#004AAD] font-semibold hover:underline">+ Add Option</button>}
                        </div>
                        {q.options.map((opt, i) => (
                            <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${q.type === 'single_correct' ? (q.correctAnswer === opt && opt !== '' ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200 hover:border-slate-300')
                                    : (q.correctAnswers?.includes(opt) && opt !== '' ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200 hover:border-slate-300')
                                }`}>
                                {q.type === 'single_correct' ? (
                                    <button type="button" onClick={() => opt.trim() && onChange(q.id, 'correctAnswer', opt)} className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${q.correctAnswer === opt && opt !== '' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 hover:border-[#004AAD]'}`}>
                                        {q.correctAnswer === opt && opt !== '' && <CheckCircle2 size={12} />}
                                    </button>
                                ) : (
                                    <button type="button" onClick={() => opt.trim() && toggleMultipleCorrect(opt)} className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border-2 transition-colors ${q.correctAnswers?.includes(opt) && opt !== '' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 hover:border-[#004AAD]'}`}>
                                        {q.correctAnswers?.includes(opt) && opt !== '' && <CheckCircle2 size={12} />}
                                    </button>
                                )}
                                <input className="flex-1 bg-transparent border-none text-sm outline-none placeholder:text-slate-400" placeholder={`Option ${String.fromCharCode(65 + i)}`} value={opt} onChange={(e) => handleOptionChange(i, e.target.value)} />
                                {q.options.length > 2 && <button onClick={() => { const newOpts = q.options.filter((_, idx) => idx !== i); onChange(q.id, 'options', newOpts); }} className="p-1 text-slate-300 hover:text-red-500"><Trash2 size={14} /></button>}
                            </div>
                        ))}
                    </div>
                )}

                {/* True/False */}
                {q.type === 'true_false' && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Select Correct Answer</label>
                        <div className="flex gap-3">
                            {['True', 'False'].map(val => (
                                <button key={val} type="button" onClick={() => onChange(q.id, 'correctAnswer', val)} className={`flex-1 py-3 rounded-lg border text-sm font-semibold transition-all ${q.correctAnswer === val ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}>{val}</button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Fill in the Blank */}
                {q.type === 'fill_blank' && (
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Correct Answer</label>
                        <input className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none" placeholder="Type the exact correct answer..." value={q.correctAnswer} onChange={(e) => onChange(q.id, 'correctAnswer', e.target.value)} />
                        <p className="text-xs text-slate-400 mt-1">Student's answer will be matched against this (case-insensitive)</p>
                    </div>
                )}

                {/* Numeric */}
                {q.type === 'numeric' && (
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Correct Numeric Answer</label>
                        <input type="number" step="any" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none" placeholder="Enter the correct number..." value={q.correctAnswer} onChange={(e) => onChange(q.id, 'correctAnswer', e.target.value)} />
                        <p className="text-xs text-slate-400 mt-1">Only numeric values will be accepted from students</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const CreateExam = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = !!id;
    const { token, user } = useAuthStore();
    const { selectedCollegeId } = useCollegeStore();
    const redirectPath = user?.role === 'trainer' ? '/trainer/exams' : '/admin/exams';

    const [step, setStep] = useState(1);
    const [colleges, setColleges] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loadingCourses, setLoadingCourses] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [validationErrors, setValidationErrors] = useState([]);
    
    const [showAIOptions, setShowAIOptions] = useState(false);
    const [confirmState, setConfirmState] = useState({ open: false });
    const [alertState, setAlertState] = useState({ open: false });
    const [bulkImport, setBulkImport] = useState({ open: false, loading: false, file: null, result: null });
    const bulkFileRef = useRef(null);

    // Question Bank Import state
    const [bankOpen, setBankOpen] = useState(false);
    const [bankQuestions, setBankQuestions] = useState([]);
    const [bankLoading, setBankLoading] = useState(false);
    const [bankSelected, setBankSelected] = useState([]);
    const [bankSearch, setBankSearch] = useState('');

    // Batch selection state
    const [availableBatches, setAvailableBatches] = useState([]);
    const [loadingBatches, setLoadingBatches] = useState(false);
    const [selectedBatches, setSelectedBatches] = useState([]);

    const [examData, setExamData] = useState({
        title: '', collegeId: selectedCollegeId || (user?.role === 'college_admin' ? user.collegeId : ''),
        courseId: '', department: '', duration: 60, passingPercentage: 40, instructions: '',
        scheduledDate: new Date().toISOString().slice(0, 16),
        expiryDate: '',
        settings: { shuffleQuestions: true, showResultImmediately: true, allowReview: true, collectEmail: true, collectMobile: true, collectDepartment: true, enableCertificate: false, randomizeQuestions: false, randomQuestionCount: 0 }
    });

    const [questions, setQuestions] = useState([getDefaultQuestion()]);

    useEffect(() => {
        if (!token || !user) return;
        if ((user.role === 'super_admin' || user.role === 'trainer') && !isEditing) {
            axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/colleges`, { headers: { Authorization: `Bearer ${token}` } })
                .then(res => setColleges(res.data.data))
                .catch(() => { });
        }
    }, [token, user, isEditing]);

    useEffect(() => { if (!examData.collegeId) return; setLoadingCourses(true); axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/colleges/${examData.collegeId}/courses`, { headers: { Authorization: `Bearer ${token}` } }).then(res => { setCourses(res.data.data); setLoadingCourses(false); }).catch(() => setLoadingCourses(false)); }, [examData.collegeId, token]);

    // Fetch batches when collegeId changes
    useEffect(() => {
        if (!examData.collegeId || !token) { setAvailableBatches([]); return; }
        setLoadingBatches(true);
        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/colleges/${examData.collegeId}/batches`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => setAvailableBatches(res.data.data || []))
            .catch(() => setAvailableBatches([]))
            .finally(() => setLoadingBatches(false));
    }, [examData.collegeId, token]);

    // Data load for editing
    useEffect(() => {
        if (!isEditing || !token) return;
        const loadExam = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/exams/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                const { exam, questions: fetchedQs } = res.data.data;

                // If super_admin or trainer, fetch colleges so the select isn't empty
                if (user?.role === 'super_admin' || user?.role === 'trainer') {
                    const cRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/colleges`, { headers: { Authorization: `Bearer ${token}` } });
                    setColleges(cRes.data.data);
                }

                setExamData({
                    title: exam.title,
                    collegeId: exam.collegeId,
                    courseId: exam.courseId,
                    department: exam.department || '',
                    duration: exam.duration,
                    totalMarks: exam.totalMarks,
                    passingPercentage: exam.passingPercentage || 40,
                    instructions: exam.instructions || '',
                    scheduledDate: exam.scheduledDate ? new Date(exam.scheduledDate).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
                    expiryDate: exam.expiryDate ? new Date(exam.expiryDate).toISOString().slice(0, 16) : '',
                    settings: {
                        shuffleQuestions: true, showResultImmediately: true, allowReview: true, 
                        collectEmail: true, collectMobile: true, collectDepartment: true, enableCertificate: false, randomizeQuestions: false, randomQuestionCount: 0,
                        ...(exam.settings || {})
                    }
                });
                // Pre-select targeted batches when editing
                if (exam.batches && exam.batches.length > 0) {
                    setSelectedBatches(exam.batches.map(b => typeof b === 'object' ? b._id || b : b));
                }

                if (fetchedQs && fetchedQs.length > 0) {
                    setQuestions(fetchedQs.map(q => ({
                        id: q._id,
                        type: q.type,
                        text: q.text,
                        options: q.options?.choices?.map(c => c.text) || [],
                        correctAnswer: q.type === 'multiple_correct' ? '' : q.correctAnswerText || (q.options?.choices?.find(c => c.isCorrect)?.text || ''),
                        correctAnswers: q.type === 'multiple_correct' ? q.options?.choices?.filter(c => c.isCorrect).map(c => c.text) : [],
                        marks: q.points
                    })));
                }
            } catch (err) {
                setAlertState({
                    open: true,
                    title: 'Load Failed',
                    message: 'Technical difficulties loading the assessment. Redirecting...',
                    type: 'error'
                });
                setTimeout(() => navigate(redirectPath), 2000);
            }
        };
        loadExam();
    }, [isEditing, id, token, navigate, user, redirectPath]);

    const validateAll = () => {
        const errs = [];
        if (!examData.title.trim()) errs.push('Exam title is required');
        if (!examData.collegeId) errs.push('Select a college');
        if (!examData.courseId) errs.push('Select a course');
        if (selectedBatches.length === 0) errs.push('Select at least one target batch');
        
        // Date validation
        const startDate = new Date(examData.scheduledDate);
        const endDate = examData.expiryDate ? new Date(examData.expiryDate) : null;
        
        if (endDate && endDate <= startDate) {
            errs.push('Expiry date must be set after the scheduled start time');
        }

        const calculatedTotal = questions.reduce((acc, q) => acc + (parseInt(q.marks) || 0), 0);
        if (!examData.passingPercentage || parseInt(examData.passingPercentage) <= 0 || parseInt(examData.passingPercentage) > 100) errs.push('Passing percentage must be between 1 and 100');
        
        questions.forEach((q, i) => {
            if (!q.text.trim()) errs.push(`Q${i + 1}: Question text is required`);
            if (q.type === 'single_correct') { if (q.options.some(o => !o.trim())) errs.push(`Q${i + 1}: All options must be filled`); if (!q.correctAnswer) errs.push(`Q${i + 1}: Select the correct answer`); }
            if (q.type === 'multiple_correct') { if (q.options.some(o => !o.trim())) errs.push(`Q${i + 1}: All options must be filled`); if (!q.correctAnswers?.length) errs.push(`Q${i + 1}: Select at least one correct answer`); }
            if (q.type === 'true_false' && !q.correctAnswer) errs.push(`Q${i + 1}: Select True or False`);
            if (q.type === 'fill_blank' && !q.correctAnswer.trim()) errs.push(`Q${i + 1}: Enter the correct answer`);
            if (q.type === 'numeric' && q.correctAnswer === '') errs.push(`Q${i + 1}: Enter the numeric answer`);
        });
        setValidationErrors(errs);
        return errs.length === 0;
    };

    const handlePublish = async () => {
        if (!validateAll()) { 
            setAlertState({
                open: true,
                title: 'Validation Issues',
                message: 'Please resolve the highlighted errors before publishing your assessment.',
                type: 'error'
            });
            return; 
        }
        setSubmitting(true);
        try {
            const calculatedTotal = questions.reduce((acc, q) => acc + (parseInt(q.marks) || 0), 0);
            const payload = { ...examData, batches: selectedBatches, totalMarks: calculatedTotal, questions: questions.map(q => ({ type: q.type, text: q.text, options: q.options, correctAnswer: q.type === 'multiple_correct' ? JSON.stringify(q.correctAnswers) : q.correctAnswer, marks: q.marks })) };

            if (isEditing) {
                await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/exams/${id}`, payload, { headers: { Authorization: `Bearer ${token}` } });
                setAlertState({ open: true, title: 'Success', message: 'Exam configuration updated successfully!', type: 'success' });
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/exams`, payload, { headers: { Authorization: `Bearer ${token}` } });
                setAlertState({ open: true, title: 'Exam Created', message: 'Your assessment has been published and is ready for use.', type: 'success' });
            }
            setTimeout(() => navigate(redirectPath), 1500);
        } catch (error) { 
            setAlertState({ 
                open: true, 
                title: 'Operation Failed', 
                message: error.response?.data?.error || `Failed to ${isEditing ? 'update' : 'create'} exam`, 
                type: 'error' 
            }); 
        } finally { setSubmitting(false); }
    };

    const handleAIUpload = async (file) => {
        setShowAIOptions(false);
        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('document', file);
            
            const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/exams/parse-document`, formData, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            const extractedQs = res.data.data.map(q => ({
                ...q,
                id: Date.now() + Math.random(),
                marks: q.marks || 5
            }));
            
            setQuestions([...questions, ...extractedQs]);
            setAlertState({
                open: true,
                title: 'AI Magic Success!',
                message: `Extracted ${extractedQs.length} questions from your document. Please review and refine them.`,
                type: 'success'
            });
        } catch (error) {
            setAlertState({
                open: true,
                title: 'AI Processing Failed',
                message: error.response?.data?.error || 'Could not parse the document correctly. Please try a clearer file or add questions manually.',
                type: 'error'
            });
        } finally {
            setSubmitting(false);
        }
    };

    const addQuestion = (type = 'single_correct') => setQuestions([...questions, getDefaultQuestion(type)]);
    const removeQuestion = (id) => { if (questions.length > 1) setQuestions(questions.filter(q => q.id !== id)); };
    const handleQuestionChange = (id, field, value) => {
        if (field === null) setQuestions(questions.map(q => q.id === id ? value : q));
        else setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
    };

    const handleBulkImport = async () => {
        if (!bulkImport.file) return;
        if (!isEditing) {
            setAlertState({ open: true, title: 'Save First', message: 'Please create and save the exam first, then use bulk import to add questions.', type: 'warning' });
            setBulkImport(prev => ({ ...prev, open: false }));
            return;
        }
        setBulkImport(prev => ({ ...prev, loading: true, result: null }));
        try {
            const formData = new FormData();
            formData.append('file', bulkImport.file);
            formData.append('examId', id); // id from useParams (edit mode)
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/exams/bulk-import`,
                formData,
                { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
            );
            setBulkImport(prev => ({ ...prev, loading: false, result: res.data }));
            // Refresh questions list
            const examRes = await axios.get(
                `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/exams/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const fetchedQs = examRes.data.data.questions;
            if (fetchedQs?.length > 0) {
                setQuestions(fetchedQs.map(q => ({
                    id: q._id,
                    type: q.type,
                    text: q.text,
                    options: q.options?.choices?.map(c => c.text) || [],
                    correctAnswer: q.type === 'multiple_correct' ? '' : q.correctAnswerText || (q.options?.choices?.find(c => c.isCorrect)?.text || ''),
                    correctAnswers: q.type === 'multiple_correct' ? q.options?.choices?.filter(c => c.isCorrect).map(c => c.text) : [],
                    marks: q.points
                })));
            }
        } catch (error) {
            setBulkImport(prev => ({ ...prev, loading: false, result: { success: false, error: error.response?.data?.error || 'Import failed' } }));
        }
    };

    // Fetch bank questions
    const fetchBankQuestions = async () => {
        setBankLoading(true);
        try {
            const params = new URLSearchParams({ limit: 50 });
            if (bankSearch) params.append('search', bankSearch);
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/question-bank?${params}`, { headers: { Authorization: `Bearer ${token}` } });
            setBankQuestions(res.data.data || []);
        } catch (e) { console.error('Fetch bank error:', e); }
        finally { setBankLoading(false); }
    };

    const handleBankImport = () => {
        if (bankSelected.length === 0) return;
        const selectedQs = bankQuestions.filter(q => bankSelected.includes(q._id));
        const mappedQs = selectedQs.map(bq => ({
            id: Date.now() + Math.random(),
            type: bq.type,
            text: bq.text,
            options: bq.options?.choices?.map(c => c.text) || [],
            correctAnswer: bq.type === 'multiple_correct' ? '' : bq.correctAnswerText || (bq.options?.choices?.find(c => c.isCorrect)?.text || ''),
            correctAnswers: bq.type === 'multiple_correct' ? bq.options?.choices?.filter(c => c.isCorrect).map(c => c.text) : [],
            marks: bq.points || 5
        }));
        setQuestions(prev => [...prev, ...mappedQs]);
        setBankOpen(false);
        setBankSelected([]);
        setAlertState({ open: true, title: 'Imported!', message: `${mappedQs.length} question(s) imported from the bank.`, type: 'success' });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div><h1 className="text-2xl font-bold text-slate-900">{isEditing ? 'Edit Exam' : 'Create New Exam'}</h1><p className="text-sm text-slate-500 mt-1">Step {step} of 3 — {step === 1 ? 'Basic Details' : step === 2 ? 'Questions' : 'Settings & Publish'}</p></div>
                <div className="flex items-center gap-1">
                    {[1, 2, 3].map(s => <div key={s} className={`w-8 h-1.5 rounded-full transition-colors ${step >= s ? 'bg-[#004AAD]' : 'bg-slate-200'}`} />)}
                </div>
            </div>

            {/* Step 1: Details */}
            {step === 1 && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
                    <h3 className="text-lg font-bold text-slate-900">Exam Details</h3>
                    <div><label className="block text-sm font-medium text-slate-700 mb-1">Exam Title *</label><input className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold focus:bg-white focus:border-[#004AAD] outline-none" placeholder="e.g. Python Programming — Final Assessment 2026" value={examData.title} onChange={(e) => setExamData({ ...examData, title: e.target.value })} /></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div><label className="block text-sm font-medium text-slate-700 mb-1">College *</label><select disabled={!!selectedCollegeId || user?.role === 'college_admin'} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none disabled:opacity-60" value={examData.collegeId} onChange={(e) => setExamData({ ...examData, collegeId: e.target.value, courseId: '' })}><option value="">Select college</option>{colleges.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}</select></div>
                        <div><label className="block text-sm font-medium text-slate-700 mb-1">Course *</label><select disabled={!examData.collegeId || loadingCourses} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none disabled:opacity-60" value={examData.courseId} onChange={(e) => setExamData({ ...examData, courseId: e.target.value })}><option value="">{loadingCourses ? 'Loading courses...' : 'Select course'}</option>{courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}</select></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div><label className="block text-sm font-medium text-slate-700 mb-1">Department</label><input className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none" placeholder="e.g. CS" value={examData.department} onChange={(e) => setExamData({ ...examData, department: e.target.value })} /></div>
                        <div><label className="block text-sm font-medium text-slate-700 mb-1">Duration (minutes)</label><div className="relative"><Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="number" className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none" value={examData.duration} onChange={(e) => setExamData({ ...examData, duration: e.target.value })} /></div></div>
                        <div><label className="block text-sm font-medium text-slate-700 mb-1">Total Marks</label><div className="relative"><Target size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="number" readOnly className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white outline-none cursor-not-allowed text-slate-500" value={questions.reduce((acc, q) => acc + (parseInt(q.marks) || 0), 0)} /></div><p className="text-xs text-slate-400 mt-1">Calculated automatically</p></div>
                    </div>

                    {/* Target Batches Multi-Select */}
                    <div className="pt-4 border-t border-slate-100">
                        <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                            <Users size={14} className="text-[#004AAD]" /> Target Batches *
                        </label>
                        <p className="text-xs text-slate-400 mb-3">Select batches that this exam targets. Each batch will receive a unique access key.</p>
                        {!examData.collegeId ? (
                            <p className="text-xs text-slate-400 italic">Select a college first to load batches.</p>
                        ) : loadingBatches ? (
                            <div className="flex items-center gap-2 py-4"><Loader2 size={16} className="animate-spin text-[#004AAD]" /><span className="text-xs text-slate-400">Loading batches...</span></div>
                        ) : (() => {
                            const filteredBatches = examData.courseId ? availableBatches.filter(b => {
                                const bCourseId = typeof b.courseId === 'object' ? b.courseId._id : b.courseId;
                                return bCourseId?.toString() === examData.courseId;
                            }) : availableBatches;
                            return filteredBatches.length === 0 ? (
                                <div className="py-4 text-center border-2 border-dashed border-slate-200 rounded-xl">
                                    <Users size={24} className="text-slate-200 mx-auto mb-2" />
                                    <p className="text-xs text-slate-400">No batches found for this college{examData.courseId ? ' & course' : ''}. Create batches first.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                    {filteredBatches.map(batch => {
                                        const batchId = batch._id;
                                        const isChecked = selectedBatches.includes(batchId);
                                        return (
                                            <label key={batchId}
                                                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                                    isChecked ? 'bg-blue-50 border-[#004AAD]/30' : 'bg-white border-slate-200 hover:border-slate-300'
                                                }`}
                                            >
                                                <input type="checkbox" checked={isChecked}
                                                    onChange={() => setSelectedBatches(prev => isChecked ? prev.filter(id => id !== batchId) : [...prev, batchId])}
                                                    className="w-4 h-4 rounded accent-[#004AAD]" />
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-slate-800 truncate">{batch.batchName}</p>
                                                    <p className="text-[10px] text-slate-400 truncate">{batch.department} · {batch.courseId?.name || ''}</p>
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>
                            );
                        })()}
                    </div>

                    <div><label className="block text-sm font-medium text-slate-700 mb-1">Instructions</label><textarea className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none min-h-[100px]" placeholder="Enter exam instructions for students..." value={examData.instructions} onChange={(e) => setExamData({ ...examData, instructions: e.target.value })} /></div>
                    
                    <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2"><Clock size={14} className="text-[#004AAD]" /> Scheduled Start *</label>
                            <input type="datetime-local" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold focus:bg-white focus:border-[#004AAD] outline-none" value={examData.scheduledDate} onChange={(e) => setExamData({ ...examData, scheduledDate: e.target.value })} />
                            <p className="text-[10px] text-slate-400 mt-1">When students can first begin entering the access key.</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2"><AlertCircle size={14} className="text-amber-500" /> Expiry Date & Time (Optional)</label>
                            <input type="datetime-local" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold focus:bg-white focus:border-[#004AAD] outline-none" value={examData.expiryDate} onChange={(e) => setExamData({ ...examData, expiryDate: e.target.value })} />
                            <p className="text-[10px] text-slate-400 mt-1">Leave blank for manual session termination by trainer.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Step 2: Questions */}
            {step === 2 && (
                <div className="space-y-5">
                    <div className="flex justify-between items-center bg-white rounded-xl border border-slate-200 p-5">
                        <div><h3 className="text-lg font-bold text-slate-900">Questions</h3><p className="text-sm text-slate-500">{questions.length} question{questions.length !== 1 ? 's' : ''} added</p></div>
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => setShowAIOptions(true)} 
                                className="flex items-center gap-2 px-4 py-2 border border-indigo-200 bg-indigo-50 text-indigo-600 text-sm font-semibold rounded-lg hover:bg-indigo-100 transition-all"
                            >
                                <Bot size={16} /> AI OCR Magic
                            </button>
                            <button
                                onClick={() => setBulkImport(prev => ({ ...prev, open: true, result: null, file: null }))}
                                className="flex items-center gap-2 px-4 py-2 border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm font-semibold rounded-lg hover:bg-emerald-100 transition-all"
                            >
                                <FileSpreadsheet size={16} /> Excel Import
                            </button>
                            <button
                                onClick={() => { setBankOpen(true); fetchBankQuestions(); }}
                                className="flex items-center gap-2 px-4 py-2 border border-violet-200 bg-violet-50 text-violet-600 text-sm font-semibold rounded-lg hover:bg-violet-100 transition-all"
                            >
                                <Database size={16} /> Import from Bank
                            </button>
                            <button onClick={() => addQuestion('single_correct')} className="flex items-center gap-2 px-4 py-2 bg-[#004AAD] text-white text-sm font-semibold rounded-lg hover:bg-[#003580]"><Plus size={16} /> Add Question</button>
                        </div>
                    </div>

                    {questions.map((q, i) => (
                        <QuestionEditor key={q.id} question={q} index={i} onChange={handleQuestionChange} onRemove={removeQuestion} total={questions.length} />
                    ))}

                    {/* Quick add buttons */}
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center">
                        <p className="text-sm text-slate-500 mb-3">Add a question of specific type:</p>
                        <div className="flex flex-wrap justify-center gap-2">
                            {QUESTION_TYPES.map(t => (
                                <button key={t.id} onClick={() => addQuestion(t.id)} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-white hover:border-[#004AAD] hover:text-[#004AAD] transition-colors">{t.label}</button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Step 3: Settings & Publish */}
            {step === 3 && (
                <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
                        <h3 className="text-lg font-bold text-slate-900">Exam Preferences</h3>
                        <div className="flex flex-wrap gap-6 items-end">
                            <div className="w-48"><label className="block text-sm font-medium text-slate-700 mb-1">Passing Percentage (%)</label><input type="number" min="1" max="100" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:bg-white focus:border-[#004AAD] outline-none" value={examData.passingPercentage} onChange={(e) => setExamData({ ...examData, passingPercentage: e.target.value })} /></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { key: 'shuffleQuestions', label: 'Shuffle Questions', desc: 'Randomize question order for each student' },
                                { key: 'showResultImmediately', label: 'Show Results Immediately', desc: 'Display score after submission' },
                                { key: 'allowReview', label: 'Allow Review', desc: 'Let students review before submitting' },
                                { key: 'collectEmail', label: 'Collect Email', desc: 'Require student email' },
                                { key: 'collectMobile', label: 'Collect Mobile', desc: 'Require student phone number' },
                                { key: 'collectDepartment', label: 'Collect Department', desc: 'Require student department' },
                            ].map(s => (
                                <label key={s.key} className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${examData.settings[s.key] ? 'bg-blue-50 border-[#004AAD]/20' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                                    <input type="checkbox" checked={examData.settings[s.key]} onChange={(e) => setExamData({ ...examData, settings: { ...examData.settings, [s.key]: e.target.checked } })} className="w-4 h-4 rounded accent-[#004AAD]" />
                                    <div><p className="text-sm font-semibold text-slate-900">{s.label}</p><p className="text-xs text-slate-400">{s.desc}</p></div>
                                </label>
                            ))}
                        </div>

                        {/* Dynamic Question Pooling Setting */}
                        <div className={`mt-6 flex flex-col gap-3 p-5 rounded-xl border-2 transition-all ${examData.settings.randomizeQuestions ? 'border-indigo-400 bg-indigo-50/50' : 'border-dashed border-slate-200 bg-white hover:border-indigo-300'}`}>
                            <div className="flex items-center gap-4 cursor-pointer" onClick={() => setExamData({ ...examData, settings: { ...examData.settings, randomizeQuestions: !examData.settings.randomizeQuestions } })}>
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${examData.settings.randomizeQuestions ? 'bg-indigo-500' : 'bg-slate-100'}`}>
                                    <Target className={examData.settings.randomizeQuestions ? "text-white" : "text-slate-400"} size={22} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-slate-900">Dynamic Question Pooling (Anti-Cheat)</p>
                                    <p className="text-xs text-slate-500 mt-0.5">Serve a random, unique subset of your questions to every student.</p>
                                </div>
                                <div className={`w-11 h-6 rounded-full transition-all relative flex-shrink-0 ${examData.settings.randomizeQuestions ? 'bg-indigo-500' : 'bg-slate-200'}`}>
                                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${examData.settings.randomizeQuestions ? 'left-5' : 'left-0.5'}`} />
                                </div>
                            </div>
                            
                            {/* Slide down input when enabled */}
                            {examData.settings.randomizeQuestions && (
                                <div className="mt-2 pl-16 pt-3 border-t border-indigo-100/60 flex items-center gap-3 animate-in slide-in-from-top-2 fade-in duration-200">
                                    <label className="text-sm font-semibold text-slate-700">Questions per student:</label>
                                    <input 
                                        type="number" min="1" max={questions.length}
                                        className="w-24 px-3 py-2 bg-white border border-indigo-200 rounded-lg text-sm font-bold text-center focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                                        value={examData.settings.randomQuestionCount}
                                        onChange={(e) => setExamData({ ...examData, settings: { ...examData.settings, randomQuestionCount: parseInt(e.target.value) || 0 } })}
                                    />
                                    <span className="text-xs font-medium text-slate-400">Out of {questions.length} total</span>
                                </div>
                            )}
                        </div>

                        {/* Certificate Setting — special highlighted card */}
                        <div className={`mt-2 flex items-center gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all ${examData.settings.enableCertificate ? 'border-amber-400 bg-amber-50' : 'border-dashed border-slate-200 bg-white hover:border-amber-300'}`}
                             onClick={() => setExamData({ ...examData, settings: { ...examData.settings, enableCertificate: !examData.settings.enableCertificate } })}>
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${examData.settings.enableCertificate ? 'bg-amber-400' : 'bg-slate-100'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={examData.settings.enableCertificate ? 'white' : '#94a3b8'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-slate-900">Generate Certificate for Passed Students</p>
                                <p className="text-xs text-slate-400 mt-0.5">When enabled, students who pass the exam can download a PDF certificate from the result screen.</p>
                            </div>
                            <div className={`w-11 h-6 rounded-full transition-all relative flex-shrink-0 ${examData.settings.enableCertificate ? 'bg-amber-400' : 'bg-slate-200'}`}>
                                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${examData.settings.enableCertificate ? 'left-5' : 'left-0.5'}`} />
                            </div>
                        </div>
                    </div>

                    {/* AI Processing Overlay */}
            {submitting && (
                <div className="fixed inset-0 z-[200] bg-white/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in transition-all">
                    <div className="relative mb-10">
                        <div className="w-24 h-24 bg-indigo-50 rounded-[2rem] flex items-center justify-center animate-pulse">
                            <Bot className="text-indigo-600" size={48} strokeWidth={1.5} />
                        </div>
                        <div className="absolute -inset-2 border-2 border-indigo-200 border-dashed rounded-[2.5rem] animate-spin duration-[10000ms]" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">AI OCR Engine Active</h2>
                    <p className="text-slate-500 font-medium mt-3 max-w-sm">
                        Deconstructing your document and extracting intelligent knowledge patterns. This usually takes just a few seconds...
                    </p>
                    <div className="mt-10 flex gap-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className={`w-2 h-2 rounded-full bg-indigo-600 animate-bounce delay-${i*150}`} />
                        ))}
                    </div>
                </div>
            )}

            {/* Validation Summary */}
            {validationErrors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                    <h4 className="text-sm font-bold text-red-700 mb-2 flex items-center gap-2"><AlertCircle size={16} /> Please fix these issues:</h4>
                    <ul className="text-xs text-red-600 space-y-1">{validationErrors.map((e, i) => <li key={i}>• {e}</li>)}</ul>
                </div>
            )}

                    {/* Summary */}
                    <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Exam Summary</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div><span className="text-slate-500">Title</span><p className="font-semibold text-slate-900">{examData.title || '—'}</p></div>
                            <div><span className="text-slate-500">Duration</span><p className="font-semibold text-slate-900">{examData.duration} min</p></div>
                            <div><span className="text-slate-500">Total Marks</span><p className="font-semibold text-slate-900">{questions.reduce((acc, q) => acc + (parseInt(q.marks) || 0), 0)}</p></div>
                            <div><span className="text-slate-500">Questions</span><p className="font-semibold text-slate-900">{questions.length}</p></div>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {questions.map((q, i) => { const t = QUESTION_TYPES.find(x => x.id === q.type); return <span key={q.id} className="px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-500">Q{i + 1}: {t?.label}</span>; })}
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation Bar */}
            <div className="flex justify-between items-center p-5 bg-white rounded-xl border border-slate-200 mt-8 shadow-sm">
                <button disabled={step === 1} onClick={() => setStep(step - 1)} className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-700 disabled:opacity-0"><ChevronLeft size={16} /> Back</button>
                {step < 3 ? (
                    <button onClick={() => setStep(step + 1)} className="flex items-center gap-2 px-6 py-2.5 bg-[#004AAD] text-white rounded-lg text-sm font-semibold hover:bg-[#003580] transition-colors shadow-md active:scale-95">Next <ChevronRight size={16} /></button>
                ) : (
                    <button disabled={submitting} onClick={handlePublish} className="flex items-center gap-2 px-8 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-md active:scale-95">{submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />} {submitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Exam'}</button>
                )}
            </div>

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

            <AIUploadModal 
                isOpen={showAIOptions}
                onClose={() => setShowAIOptions(false)}
                onUpload={handleAIUpload}
            />

            {/* Bulk Excel Import Modal */}
            {bulkImport.open && (
                <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-6">
                    <div className="bg-white rounded-[2rem] shadow-2xl max-w-md w-full p-8 relative">
                        <button onClick={() => setBulkImport(prev => ({ ...prev, open: false }))} className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all">
                            <X size={18} />
                        </button>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                                <FileSpreadsheet size={24} className="text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Bulk Question Import</h3>
                                <p className="text-sm text-slate-400">Upload an Excel (.xlsx) file to import questions</p>
                            </div>
                        </div>

                        {!isEditing && (
                            <div className="mb-5 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700 font-medium">
                                <AlertCircle size={14} className="inline mr-2" />
                                This feature works for <strong>existing saved exams</strong>. Create and save the exam first, then come back to import questions.
                            </div>
                        )}

                        <div
                            onClick={() => bulkFileRef.current?.click()}
                            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all mb-5 ${
                                bulkImport.file ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 hover:border-[#004AAD] hover:bg-slate-50'
                            }`}
                        >
                            <input ref={bulkFileRef} type="file" accept=".xlsx" className="hidden" onChange={e => setBulkImport(prev => ({ ...prev, file: e.target.files[0], result: null }))} />
                            <Upload size={28} className={`mx-auto mb-3 ${bulkImport.file ? 'text-emerald-500' : 'text-slate-300'}`} />
                            {bulkImport.file ? (
                                <>
                                    <p className="font-bold text-emerald-700 text-sm">{bulkImport.file.name}</p>
                                    <p className="text-xs text-slate-400 mt-1">{(bulkImport.file.size / 1024).toFixed(1)} KB — Click to change</p>
                                </>
                            ) : (
                                <>
                                    <p className="text-sm font-semibold text-slate-500">Click to select .xlsx file</p>
                                    <p className="text-xs text-slate-400 mt-1">Max 5 MB</p>
                                </>
                            )}
                        </div>

                        {/* Column format reminder */}
                        <div className="mb-5 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500 space-y-1">
                            <p className="font-bold text-slate-700 mb-1">Expected column order:</p>
                            <p>A: Question Text &nbsp;|&nbsp; B: Type &nbsp;|&nbsp; C-F: Options A-D</p>
                            <p>G: Correct Answer &nbsp;|&nbsp; H: Marks &nbsp;|&nbsp; I: Difficulty</p>
                            <a
                                href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/exams/bulk-import/template`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 mt-2 text-[#004AAD] font-semibold hover:underline"
                            >
                                <Download size={12} /> Download Template (.xlsx)
                            </a>
                        </div>

                        {/* Result */}
                        {bulkImport.result && (
                            <div className={`mb-5 p-4 rounded-xl border text-sm ${
                                bulkImport.result.success === false
                                    ? 'bg-rose-50 border-rose-200 text-rose-700'
                                    : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            }`}>
                                {bulkImport.result.success === false ? (
                                    <p className="font-bold"><AlertCircle size={14} className="inline mr-1" />{bulkImport.result.error}</p>
                                ) : (
                                    <>
                                        <p className="font-bold"><CheckCircle2 size={14} className="inline mr-1" />{bulkImport.result.imported} question(s) imported!</p>
                                        {bulkImport.result.errors?.length > 0 && (
                                            <ul className="mt-2 space-y-1 text-xs text-rose-600">
                                                {bulkImport.result.errors.map((e, i) => <li key={i}>Row {e.row}: {e.error}</li>)}
                                            </ul>
                                        )}
                                    </>
                                )}
                            </div>
                        )}

                        <button
                            disabled={!bulkImport.file || bulkImport.loading || !isEditing}
                            onClick={handleBulkImport}
                            className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                        >
                            {bulkImport.loading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                            {bulkImport.loading ? 'Importing...' : 'Import Questions'}
                        </button>
                    </div>
                </div>
            )}

            {/* ========== IMPORT FROM BANK MODAL ========== */}
            {bankOpen && (
                <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-6">
                    <div className="bg-white rounded-[2rem] shadow-2xl max-w-2xl w-full p-8 relative max-h-[80vh] flex flex-col">
                        <button onClick={() => setBankOpen(false)} className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all">
                            <X size={18} />
                        </button>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center">
                                <Database size={24} className="text-violet-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Import from Question Bank</h3>
                                <p className="text-sm text-slate-400">Select questions from the centralized repository</p>
                            </div>
                        </div>

                        {/* Search */}
                        <div className="relative mb-4">
                            <input
                                type="text"
                                value={bankSearch}
                                onChange={(e) => { setBankSearch(e.target.value); }}
                                onKeyDown={(e) => e.key === 'Enter' && fetchBankQuestions()}
                                className="w-full pl-4 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-[#004AAD] outline-none"
                                placeholder="Search questions... (press Enter)"
                            />
                        </div>

                        {/* Questions list */}
                        <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                            {bankLoading ? (
                                <div className="py-12 flex flex-col items-center justify-center gap-2">
                                    <Loader2 className="animate-spin text-[#004AAD]" size={24} />
                                    <p className="text-xs text-slate-400">Loading bank...</p>
                                </div>
                            ) : bankQuestions.length === 0 ? (
                                <div className="py-12 text-center">
                                    <Database size={32} className="text-slate-200 mx-auto mb-3" />
                                    <p className="text-sm text-slate-500">No questions found in the bank.</p>
                                    <p className="text-xs text-slate-400 mt-1">Add questions to the Question Bank first.</p>
                                </div>
                            ) : bankQuestions.map((bq) => (
                                <label key={bq._id} className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                                    bankSelected.includes(bq._id) ? 'bg-violet-50 border-violet-300' : 'bg-white border-slate-200 hover:border-slate-300'
                                }`}>
                                    <input type="checkbox" checked={bankSelected.includes(bq._id)}
                                        onChange={() => setBankSelected(prev => prev.includes(bq._id) ? prev.filter(id => id !== bq._id) : [...prev, bq._id])}
                                        className="w-4 h-4 rounded accent-violet-600 mt-0.5" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-600 uppercase">{bq.type?.replace('_', ' ')}</span>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                                bq.difficulty === 'easy' ? 'bg-emerald-100 text-emerald-700' : bq.difficulty === 'hard' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                                            }`}>{bq.difficulty}</span>
                                            {bq.subject && <span className="px-2 py-0.5 bg-blue-50 rounded text-[10px] font-bold text-blue-600">{bq.subject}</span>}
                                            {bq.bloomsLevel && <span className="px-2 py-0.5 bg-indigo-50 rounded text-[10px] font-bold text-indigo-600">{bq.bloomsLevel}</span>}
                                        </div>
                                        <p className="text-sm text-slate-800 font-medium line-clamp-2">{bq.text}</p>
                                    </div>
                                    <span className="text-xs font-bold text-slate-500">{bq.points} pts</span>
                                </label>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                            <span className="text-sm text-slate-500 font-medium">{bankSelected.length} selected</span>
                            <button
                                onClick={handleBankImport}
                                disabled={bankSelected.length === 0}
                                className="flex items-center gap-2 px-6 py-2.5 bg-violet-600 text-white text-sm font-bold rounded-xl hover:bg-violet-700 disabled:opacity-40 transition-all shadow-lg shadow-violet-200"
                            >
                                <Plus size={16} /> Import {bankSelected.length > 0 ? `(${bankSelected.length})` : ''}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateExam;
