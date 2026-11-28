import { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
    Trophy,
    Search,
    Download,
    School,
    BookOpen,
    FileText,
    TrendingUp,
    Users,
    RefreshCw,
    Layers,
    RotateCcw,
    X
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useCollegeStore from '../../store/collegeStore';
import useSocketUpdate from '../../hooks/useSocketUpdate';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Leaderboard = () => {
    const { token, user } = useAuthStore();
    const { selectedCollegeId: storeCollegeId, selectedCollegeName } = useCollegeStore();
    const { collegeId: paramCollegeId } = useParams();
    const location = useLocation();

    const urlCollegeMatch = location.pathname.match(/\/college\/([a-f0-9]{24})/i);
    const urlCollegeId = paramCollegeId || (urlCollegeMatch ? urlCollegeMatch[1] : null);
    const lockedCollegeId = urlCollegeId || storeCollegeId || (user?.role === 'college_admin' ? user.collegeId : null);

    const [data, setData] = useState([]);
    const [totalQualified, setTotalQualified] = useState(0);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Filter option lists
    const [colleges, setColleges] = useState([]);
    const [courses, setCourses] = useState([]);
    const [batches, setBatches] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [exams, setExams] = useState([]);

    // Active filter selections
    const [selectedCollege, setSelectedCollege] = useState(lockedCollegeId || 'all');
    const [selectedCourse, setSelectedCourse] = useState('all');
    const [selectedBatch, setSelectedBatch] = useState('all');
    const [selectedDepartment, setSelectedDepartment] = useState('all');
    const [selectedExam, setSelectedExam] = useState('all');
    const [rankingMode, setRankingMode] = useState('best'); // 'best' | 'average'
    const [limit, setLimit] = useState(50);

    // Sync lockedCollegeId when switching tabs or global college context
    useEffect(() => {
        if (lockedCollegeId) {
            setSelectedCollege(lockedCollegeId);
        } else {
            setSelectedCollege('all');
        }
        setSelectedCourse('all');
        setSelectedBatch('all');
        setSelectedDepartment('all');
        setSelectedExam('all');
    }, [lockedCollegeId]);

    const activeCollegeScope = lockedCollegeId || (selectedCollege !== 'all' ? selectedCollege : '');

    // Load colleges once
    useEffect(() => {
        if (!token) return;
        axios
            .get(`${API}/admin/colleges`, { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => setColleges(res.data?.data || []))
            .catch(() => {});
    }, [token]);

    // Load courses, batches, and exams scoped to activeCollegeScope
    useEffect(() => {
        if (!token) return;
        const headers = { Authorization: `Bearer ${token}` };

        const loadFilterMetadata = async () => {
            try {
                const courseUrl = activeCollegeScope
                    ? `${API}/admin/colleges/${activeCollegeScope}/courses`
                    : `${API}/admin/courses`;
                const batchUrl = activeCollegeScope
                    ? `${API}/admin/colleges/${activeCollegeScope}/batches`
                    : `${API}/admin/colleges/all/batches`;
                const examUrl = activeCollegeScope
                    ? `${API}/admin/exams?collegeId=${activeCollegeScope}`
                    : `${API}/admin/exams`;

                const [coursesRes, batchesRes, examsRes] = await Promise.all([
                    axios.get(courseUrl, { headers }),
                    axios.get(batchUrl, { headers }),
                    axios.get(examUrl, { headers })
                ]);

                setCourses(coursesRes.data?.data || []);
                setBatches(batchesRes.data?.data || []);
                setExams((examsRes.data?.data || []).filter((e) => e.status === 'published'));
            } catch (e) {
                console.error('Failed to load leaderboard filter options:', e);
            }
        };

        loadFilterMetadata();
    }, [token, activeCollegeScope]);

    const fetchLeaderboard = useCallback(async () => {
        if (!token) return;
        try {
            setLoading(true);
            const params = new URLSearchParams();
            params.set('limit', String(limit));
            params.set('mode', rankingMode);

            if (activeCollegeScope) params.set('collegeId', activeCollegeScope);
            if (selectedCourse !== 'all') params.set('courseId', selectedCourse);
            if (selectedBatch !== 'all') params.set('batchId', selectedBatch);
            if (selectedDepartment !== 'all') params.set('department', selectedDepartment);
            if (selectedExam !== 'all') params.set('examId', selectedExam);

            const res = await axios.get(`${API}/analytics/leaderboard?${params.toString()}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(res.data.data || []);
            setTotalQualified(res.data.totalQualified || (res.data.data || []).length);
            if (res.data.filters?.departments) {
                setDepartments(res.data.filters.departments);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [
        token,
        activeCollegeScope,
        selectedCourse,
        selectedBatch,
        selectedDepartment,
        selectedExam,
        rankingMode,
        limit
    ]);

    useEffect(() => {
        fetchLeaderboard();
    }, [fetchLeaderboard]);

    useSocketUpdate(() => {
        fetchLeaderboard();
    }, ['exams']);

    // Cascading dropdown subsets
    const visibleBatches = batches.filter((b) => {
        if (selectedCourse !== 'all') {
            const cid = b.courseId?._id || b.courseId;
            return cid?.toString() === selectedCourse.toString();
        }
        return true;
    });

    const visibleExams = exams.filter((e) => {
        if (selectedCourse !== 'all') {
            const cid = e.courseId?._id || e.courseId;
            if (cid?.toString() !== selectedCourse.toString()) return false;
        }
        if (selectedBatch !== 'all' && Array.isArray(e.batches) && e.batches.length > 0) {
            const matchBatch = e.batches.some((b) => (b._id || b)?.toString() === selectedBatch.toString());
            if (!matchBatch) return false;
        }
        return true;
    });

    const handleExport = async () => {
        try {
            const params = new URLSearchParams();
            let filename = 'Leaderboard';

            if (selectedExam !== 'all') {
                params.set('type', 'exam');
                params.set('id', selectedExam);
                const exam = exams.find((e) => e._id === selectedExam);
                filename = `${exam?.title || 'Exam'}_Leaderboard`;
            } else if (selectedCourse !== 'all') {
                params.set('type', 'course');
                params.set('id', selectedCourse);
                const crs = courses.find((c) => c._id === selectedCourse);
                filename = `${crs?.name || 'Course'}_Leaderboard`;
            } else if (activeCollegeScope) {
                params.set('type', 'college');
                params.set('id', activeCollegeScope);
                filename = 'College_Leaderboard';
            } else {
                params.set('type', 'overall');
                filename = 'Overall_Leaderboard';
            }

            const res = await axios.get(`${API}/analytics/export?${params.toString()}`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const a = document.createElement('a');
            a.href = url;
            a.download = `${filename.replace(/\s+/g, '_')}.xlsx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch {
            alert('Export failed. Please try again.');
        }
    };

    const filteredData = data.filter((entry) => {
        const q = searchTerm.toLowerCase();
        return (
            entry.name?.toLowerCase().includes(q) ||
            entry.rollNumber?.toLowerCase().includes(q) ||
            entry.department?.toLowerCase().includes(q) ||
            entry.batchName?.toLowerCase().includes(q) ||
            entry.courseName?.toLowerCase().includes(q) ||
            entry.examTitle?.toLowerCase().includes(q)
        );
    });

    const topThree = filteredData.slice(0, 3);
    const hasActiveFilters =
        (!lockedCollegeId && selectedCollege !== 'all') ||
        selectedCourse !== 'all' ||
        selectedBatch !== 'all' ||
        selectedDepartment !== 'all' ||
        selectedExam !== 'all' ||
        searchTerm.trim() !== '';

    const activeCollegeDisplay =
        selectedCollegeName ||
        colleges.find((c) => c._id === activeCollegeScope)?.name ||
        'College';

    return (
        <div className="space-y-6 pb-10">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-5 border-b border-slate-200/80">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
                        <Trophy className="text-[#5899B5] shrink-0" size={26} />
                        <span>{lockedCollegeId ? `Leaderboard — ${activeCollegeDisplay}` : 'Leaderboard'}</span>
                    </h1>
                    <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
                        Rank students by assessment score across courses, batches, departments, and exams
                        {totalQualified > 0 && <span className="text-slate-400"> · {totalQualified} qualified students</span>}
                    </p>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                    <button
                        onClick={fetchLeaderboard}
                        className="h-10 w-10 inline-flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                        title="Refresh leaderboard"
                    >
                        <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <button
                        onClick={handleExport}
                        className="h-10 px-4 inline-flex items-center gap-2 bg-[#5899B5] text-white rounded-xl text-xs font-semibold hover:bg-[#3D7690] transition-colors cursor-pointer shadow-2xs"
                    >
                        <Download size={15} /> Export Results (.xlsx)
                    </button>
                </div>
            </div>

            {/* Cascading Filter Panel (2 Spacious Rows of 3 Columns + Search & Mode Toolbar) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                    {/* 1. College Filter */}
                    <div>
                        <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                            <School size={13} className="text-[#5899B5]" />
                            Institution Scope
                        </label>
                        {!lockedCollegeId ? (
                            <select
                                value={selectedCollege}
                                onChange={(e) => {
                                    setSelectedCollege(e.target.value);
                                    setSelectedCourse('all');
                                    setSelectedBatch('all');
                                    setSelectedExam('all');
                                }}
                                className="w-full h-10 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-[#5899B5] focus:ring-2 focus:ring-[#5899B5]/15 transition-all cursor-pointer"
                            >
                                <option value="all">All Colleges ({colleges.length})</option>
                                {colleges.map((c) => (
                                    <option key={c._id} value={c._id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <div className="w-full h-10 px-3.5 bg-slate-100/90 border border-slate-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-slate-800 truncate">
                                <span className="w-2 h-2 rounded-full bg-[#5899B5] shrink-0" />
                                <span className="truncate">{activeCollegeDisplay}</span>
                            </div>
                        )}
                    </div>

                    {/* 2. Course Filter */}
                    <div>
                        <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                            <BookOpen size={13} className="text-[#5899B5]" />
                            Course
                        </label>
                        <select
                            value={selectedCourse}
                            onChange={(e) => {
                                setSelectedCourse(e.target.value);
                                setSelectedBatch('all');
                                setSelectedExam('all');
                            }}
                            className="w-full h-10 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-[#5899B5] focus:ring-2 focus:ring-[#5899B5]/15 transition-all cursor-pointer"
                        >
                            <option value="all">All Courses ({courses.length})</option>
                            {courses.map((c) => (
                                <option key={c._id} value={c._id}>
                                    {c.name} ({c.code})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 3. Batch Filter */}
                    <div>
                        <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                            <Layers size={13} className="text-[#5899B5]" />
                            Batch
                        </label>
                        <select
                            value={selectedBatch}
                            onChange={(e) => {
                                setSelectedBatch(e.target.value);
                                setSelectedExam('all');
                            }}
                            className="w-full h-10 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-[#5899B5] focus:ring-2 focus:ring-[#5899B5]/15 transition-all cursor-pointer"
                        >
                            <option value="all">All Batches ({visibleBatches.length})</option>
                            {visibleBatches.map((b) => (
                                <option key={b._id} value={b._id}>
                                    {b.batchName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 4. Department Filter */}
                    <div>
                        <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                            <Users size={13} className="text-[#5899B5]" />
                            Department / Branch
                        </label>
                        <select
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                            className="w-full h-10 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-[#5899B5] focus:ring-2 focus:ring-[#5899B5]/15 transition-all cursor-pointer"
                        >
                            <option value="all">All Departments ({departments.length})</option>
                            {departments.map((dept) => (
                                <option key={dept} value={dept}>
                                    {dept}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 5. Exam Filter */}
                    <div>
                        <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                            <FileText size={13} className="text-[#5899B5]" />
                            Assessment / Exam
                        </label>
                        <select
                            value={selectedExam}
                            onChange={(e) => setSelectedExam(e.target.value)}
                            className="w-full h-10 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-[#5899B5] focus:ring-2 focus:ring-[#5899B5]/15 transition-all cursor-pointer"
                        >
                            <option value="all">All Assessments ({visibleExams.length})</option>
                            {visibleExams.map((e) => (
                                <option key={e._id} value={e._id}>
                                    {e.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 6. Limit Filter */}
                    <div>
                        <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                            <Trophy size={13} className="text-[#5899B5]" />
                            Leaderboard Size
                        </label>
                        <select
                            value={limit}
                            onChange={(e) => setLimit(Number(e.target.value))}
                            className="w-full h-10 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-[#5899B5] focus:ring-2 focus:ring-[#5899B5]/15 transition-all cursor-pointer"
                        >
                            <option value={10}>Top 10 Students</option>
                            <option value={20}>Top 20 Students</option>
                            <option value={50}>Top 50 Students</option>
                            <option value={100}>Top 100 Students</option>
                            <option value={200}>Top 200 Students</option>
                        </select>
                    </div>
                </div>

                {/* Second Row: Search Box, Ranking Mode Switcher, Clear Button */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
                    <div className="relative flex-1 max-w-md">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                            className="w-full h-10 pl-10 pr-9 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-[#5899B5] focus:ring-2 focus:ring-[#5899B5]/15 transition-all"
                            placeholder="Search student name, USN, batch, department, exam..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button
                                type="button"
                                onClick={() => setSearchTerm('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
                            <button
                                type="button"
                                onClick={() => setRankingMode('best')}
                                className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
                                    rankingMode === 'best'
                                        ? 'bg-white text-slate-900 shadow-2xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                Best Exam Score
                            </button>
                            <button
                                type="button"
                                onClick={() => setRankingMode('average')}
                                className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
                                    rankingMode === 'average'
                                        ? 'bg-white text-slate-900 shadow-2xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                Overall Average
                            </button>
                        </div>

                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={() => {
                                    if (!lockedCollegeId) setSelectedCollege('all');
                                    setSelectedCourse('all');
                                    setSelectedBatch('all');
                                    setSelectedDepartment('all');
                                    setSelectedExam('all');
                                    setSearchTerm('');
                                }}
                                className="h-9 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition cursor-pointer"
                            >
                                <RotateCcw size={13} />
                                Reset Filters
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-40 bg-slate-100 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : filteredData.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-2xl border border-slate-200 shadow-2xs">
                    <Trophy size={40} className="mx-auto text-slate-200 mb-3" />
                    <p className="text-base font-bold text-slate-700">No matching leaderboard records found</p>
                    <p className="text-xs text-slate-400 mt-1.5">
                        Try clearing one of the filters above or selecting another batch/exam.
                    </p>
                </div>
            ) : (
                <>
                    {/* Top 3 Podium Cards */}
                    {topThree.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                            {topThree.map((entry, i) => (
                                <div
                                    key={`${entry.rollNumber}-${i}`}
                                    className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col justify-between gap-4 relative overflow-hidden"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="space-y-1">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 text-xs font-bold">
                                                Rank #{entry.rank}
                                            </span>
                                            <h3 className="text-base font-bold text-slate-900 pt-1">{entry.name}</h3>
                                            <code className="text-xs font-mono text-slate-500 block">{entry.rollNumber}</code>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <span className="text-2xl font-extrabold text-[#5899B5]">
                                                {entry.percentage}%
                                            </span>
                                            <p className="text-xs text-slate-400 mt-0.5">
                                                {entry.score}/{entry.totalMarks} pts
                                            </p>
                                        </div>
                                    </div>
                                    <div className="pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                                        <span className="font-semibold text-slate-700">
                                            {entry.batchName !== '—' ? entry.batchName : entry.department}
                                        </span>
                                        <span className="truncate max-w-[180px]" title={entry.examTitle}>
                                            {entry.examTitle}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Complete Leaderboard Table */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                            <h3 className="text-sm font-bold text-slate-800">
                                Ranked Standings ({filteredData.length} student{filteredData.length !== 1 ? 's' : ''})
                            </h3>
                            <span className="text-xs font-medium text-slate-400">
                                Mode: {rankingMode === 'average' ? 'Overall Average Across Exams' : 'Best Exam Score'}
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left border-collapse">
                                <thead className="bg-slate-50/80 border-b border-slate-200/80">
                                    <tr>
                                        <th className="px-6 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider w-16">Rank</th>
                                        <th className="px-6 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Student &amp; USN</th>
                                        <th className="px-6 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Batch &amp; Dept</th>
                                        <th className="px-6 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Course / Exam</th>
                                        <th className="px-6 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">Attempts</th>
                                        <th className="px-6 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Score</th>
                                        <th className="px-6 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right w-40">Percentage</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredData.map((entry) => (
                                        <tr key={`${entry.rollNumber}-${entry.rank}`} className="hover:bg-slate-50/70 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold ${
                                                        entry.rank <= 3
                                                            ? 'bg-[#5899B5] text-white'
                                                            : 'bg-slate-100 text-slate-600'
                                                    }`}
                                                >
                                                    #{entry.rank}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-slate-900">{entry.name}</div>
                                                <div className="text-xs text-slate-400 font-mono mt-0.5">{entry.rollNumber}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-semibold text-slate-800">{entry.batchName || '—'}</div>
                                                <div className="text-xs text-slate-400 mt-0.5">{entry.department || '—'}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-slate-800 line-clamp-1">{entry.examTitle}</div>
                                                <div className="text-xs text-slate-400 mt-0.5">
                                                    {entry.courseName && entry.courseName !== '—' ? entry.courseName : entry.collegeName}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center text-xs font-semibold text-slate-600 whitespace-nowrap">
                                                {entry.attemptsCount || 1}
                                            </td>
                                            <td className="px-6 py-4 text-right font-semibold text-slate-700 whitespace-nowrap">
                                                {entry.score}/{entry.totalMarks}
                                            </td>
                                            <td className="px-6 py-4 text-right whitespace-nowrap">
                                                <div className="flex items-center justify-end gap-2.5">
                                                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-[#5899B5] rounded-full"
                                                            style={{ width: `${Math.min(entry.percentage, 100)}%` }}
                                                        />
                                                    </div>
                                                    <span className="font-bold text-slate-900 min-w-[46px] text-right">
                                                        {entry.percentage}%
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* Summary Footer */}
            {filteredData.length > 0 && (
                <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs shadow-2xs">
                        <TrendingUp size={14} className="text-[#5899B5]" />
                        <span className="text-slate-500">Average Score:</span>
                        <span className="font-bold text-slate-900">
                            {(filteredData.reduce((s, d) => s + d.percentage, 0) / filteredData.length).toFixed(1)}%
                        </span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs shadow-2xs">
                        <Users size={14} className="text-slate-500" />
                        <span className="text-slate-500">Students Displayed:</span>
                        <span className="font-bold text-slate-900">{filteredData.length}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Leaderboard;
