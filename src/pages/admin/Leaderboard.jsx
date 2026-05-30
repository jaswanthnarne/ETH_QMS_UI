import { useState, useEffect, useCallback } from 'react';
import { Trophy, Medal, Star, Download, Filter, RefreshCw, TrendingUp, Users, Award, ChevronDown, Search } from 'lucide-react';
import axios from 'axios';
import useAuthStore from '../../store/authStore';
import useCollegeStore from '../../store/collegeStore';
import useSocketUpdate from '../../hooks/useSocketUpdate';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const RANK_STYLES = [
    { bg: 'from-amber-50 to-yellow-50', border: 'border-amber-250', text: 'text-amber-900', badge: 'bg-yellow-100 text-yellow-800', icon: '🥇' },
    { bg: 'from-slate-50 to-slate-100', border: 'border-slate-300', text: 'text-slate-800', badge: 'bg-slate-200 text-slate-700', icon: '🥈' },
    { bg: 'from-orange-50 to-amber-50', border: 'border-orange-250', text: 'text-orange-900', badge: 'bg-orange-100 text-orange-850', icon: '🥉' },
];

const Leaderboard = () => {
    const { token } = useAuthStore();
    const { selectedCollegeId } = useCollegeStore();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [exams, setExams] = useState([]);
    const [selectedExam, setSelectedExam] = useState('');
    const [limit, setLimit] = useState(20);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchExams = useCallback(async () => {
        try {
            const url = selectedCollegeId
                ? `${API}/admin/exams?collegeId=${selectedCollegeId}`
                : `${API}/admin/exams`;
            const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
            setExams(res.data.data || []);
        } catch (err) {
            console.error(err);
        }
    }, [token, selectedCollegeId]);

    const fetchLeaderboard = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({ limit });
            if (selectedExam) params.set('examId', selectedExam);
            else if (selectedCollegeId) params.set('collegeId', selectedCollegeId);

            const res = await axios.get(`${API}/analytics/leaderboard?${params}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(res.data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [token, selectedExam, selectedCollegeId, limit]);

    useEffect(() => { fetchExams(); }, [fetchExams]);
    useEffect(() => { fetchLeaderboard(); }, [fetchLeaderboard]);
    useSocketUpdate(() => {
        fetchExams();
        fetchLeaderboard();
    }, ['exams']);

    /* ── FIXED EXPORT LOGIC ──
     * - If a specific exam is selected → export that exam's results (type=exam, id=examId)
     * - If no exam but college is selected → export college report (type=college, id=collegeId)
     * - If neither → export entire platform (type=overall, no id)
     */
    const handleExport = async () => {
        try {
            const params = new URLSearchParams();
            let filename = 'Leaderboard';

            if (selectedExam) {
                params.set('type', 'exam');
                params.set('id', selectedExam);
                const exam = exams.find(e => e._id === selectedExam);
                filename = `${exam?.title || 'Exam'}_Leaderboard`;
            } else if (selectedCollegeId) {
                params.set('type', 'college');
                params.set('id', selectedCollegeId);
                filename = 'College_Leaderboard';
            } else {
                params.set('type', 'overall');
                filename = 'Overall_Leaderboard';
            }

            const res = await axios.get(`${API}/analytics/export?${params}`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const a = document.createElement('a');
            a.href = url;
            a.download = `${filename}.xlsx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch {
            alert('Export failed. Please try again.');
        }
    };

    // Determine export description for tooltip
    const getExportTooltip = () => {
        if (selectedExam) {
            const exam = exams.find(e => e._id === selectedExam);
            return `Export all student results for "${exam?.title || 'selected exam'}" as Excel`;
        }
        if (selectedCollegeId) return 'Export all student results for this college as Excel';
        return 'Export all student results across the platform as Excel';
    };

    const filteredData = data.filter(entry => 
        entry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.examTitle?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const topThree = filteredData.slice(0, 3);
    const rest = filteredData.slice(3);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Leaderboard</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Top performers ranked by score {data.length > 0 && <span className="text-slate-400">· {data.length} students</span>}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button onClick={fetchLeaderboard} className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors" title="Refresh leaderboard data">
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <button
                        onClick={handleExport}
                        title={getExportTooltip()}
                        className="flex items-center gap-1.5 px-4 py-2 bg-[#004AAD] text-white rounded-lg text-sm font-semibold hover:bg-[#003580] transition-colors shadow-sm"
                    >
                        <Download size={14} /> Export Results
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="relative">
                    <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <select
                        className="pl-8 pr-8 py-2.5 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-[#004AAD] focus:ring-2 focus:ring-blue-50 appearance-none cursor-pointer transition-all"
                        value={selectedExam}
                        onChange={e => setSelectedExam(e.target.value)}
                    >
                        <option value="">All Exams</option>
                        {exams.map(e => (
                            <option key={e._id} value={e._id}>{e.title}</option>
                        ))}
                    </select>
                </div>
                <div className="relative">
                    <Users size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <select
                        className="pl-8 pr-8 py-2.5 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-[#004AAD] focus:ring-2 focus:ring-blue-50 appearance-none cursor-pointer transition-all"
                        value={limit}
                        onChange={e => setLimit(Number(e.target.value))}
                    >
                        <option value={10}>Top 10</option>
                        <option value={20}>Top 20</option>
                        <option value={50}>Top 50</option>
                        <option value={100}>Top 100</option>
                    </select>
                </div>
                {selectedExam && (
                    <button
                        onClick={() => setSelectedExam('')}
                        className="px-3 py-2 bg-rose-50 text-rose-600 border border-rose-100 rounded-lg text-xs font-bold hover:bg-rose-100 transition-colors"
                    >
                        Clear Filter
                    </button>
                )}
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {[1, 2, 3].map(i => <div key={i} className="h-48 bg-slate-100 rounded-xl animate-pulse" />)}
                </div>
            ) : data.length === 0 ? (
                <div className="py-24 text-center bg-white rounded-xl border border-slate-200">
                    <Trophy size={48} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-lg font-bold text-slate-400">No completed attempts found</p>
                    <p className="text-sm text-slate-300 mt-1">Results will appear here once students complete exams</p>
                </div>
            ) : (
                <>
                    {/* Top 3 Podium */}
                    {topThree.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2">
                            {topThree.map((entry, i) => {
                                const style = RANK_STYLES[i] || RANK_STYLES[1];
                                return (
                                    <div
                                        key={entry.rollNumber}
                                        className={`relative rounded-xl p-6 bg-gradient-to-br ${style.bg} border ${style.border} overflow-hidden flex flex-col items-center text-center gap-2 hover:scale-[1.02] transition-transform`}
                                    >
                                        <div className="text-4xl mb-1">{style.icon}</div>
                                        <div className={`text-lg font-extrabold ${style.text} leading-tight`}>{entry.name}</div>
                                        <div className={`text-xs font-medium px-3 py-0.5 rounded-full ${style.badge}`}>
                                            {entry.rollNumber}
                                        </div>
                                        {entry.department && entry.department !== '—' && (
                                            <div className={`text-xs ${style.text} opacity-70`}>{entry.department}</div>
                                        )}
                                        <div className="mt-2 flex items-center gap-1.5">
                                            <Star size={18} className={style.text} fill="currentColor" />
                                            <span className={`text-3xl font-black ${style.text}`}>{entry.percentage}%</span>
                                        </div>
                                        <div className={`text-[11px] ${style.text} opacity-60 font-medium`}>
                                            {entry.score}/{entry.totalMarks} marks · {entry.examTitle}
                                        </div>
                                        <div className="absolute top-3 right-4 font-black opacity-[0.05] text-7xl leading-none select-none">
                                            #{entry.rank}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Remaining rows */}
                    {rest.length > 0 && (
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
                                <h3 className="text-sm font-semibold text-slate-700">{filteredData.length} student{filteredData.length !== 1 ? 's' : ''}</h3>
                                <div className="relative w-72">
                                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input 
                                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#004AAD]" 
                                        placeholder="Search students..." 
                                        value={searchTerm} 
                                        onChange={(e) => setSearchTerm(e.target.value)} 
                                    />
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase w-16">Rank</th>
                                            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Student</th>
                                            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Department</th>
                                            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Exam</th>
                                            <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Score</th>
                                            <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase w-36">Performance</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {rest.map((entry) => (
                                            <tr key={`${entry.rollNumber}-${entry.rank}`} className="hover:bg-slate-50/50 group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center w-8 h-8 bg-slate-100 rounded-full text-xs font-bold text-slate-600">
                                                        #{entry.rank}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-semibold text-slate-800">{entry.name}</div>
                                                    <div className="text-xs text-slate-400 font-mono">{entry.rollNumber}</div>
                                                </td>
                                                <td className="px-6 py-4 text-slate-600">{entry.department || '—'}</td>
                                                <td className="px-6 py-4">
                                                    <span className="text-xs text-slate-550 line-clamp-1">{entry.examTitle}</span>
                                                </td>
                                                <td className="px-6 py-4 text-right font-semibold text-slate-700">
                                                    {entry.score}/{entry.totalMarks}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full transition-all duration-700 ${
                                                                    entry.percentage >= 80 ? 'bg-emerald-500' :
                                                                    entry.percentage >= 60 ? 'bg-blue-500' :
                                                                    entry.percentage >= 40 ? 'bg-amber-500' : 'bg-red-400'
                                                                }`}
                                                                style={{ width: `${Math.min(entry.percentage, 100)}%` }}
                                                            />
                                                        </div>
                                                        <span className={`font-bold text-sm min-w-[40px] text-right ${
                                                            entry.percentage >= 80 ? 'text-emerald-600' :
                                                            entry.percentage >= 60 ? 'text-blue-600' :
                                                            entry.percentage >= 40 ? 'text-amber-600' : 'text-red-500'
                                                        }`}>
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
                    )}
                </>
            )}

            {/* Stats Footer */}
            {data.length > 0 && (
                <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm">
                        <TrendingUp size={15} className="text-[#004AAD]" />
                        <span className="text-slate-500">Avg Score:</span>
                        <span className="font-semibold text-slate-800">
                            {(data.reduce((s, d) => s + d.percentage, 0) / data.length).toFixed(1)}%
                        </span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm">
                        <Users size={15} className="text-violet-600" />
                        <span className="text-slate-500">Showing:</span>
                        <span className="font-semibold text-slate-800">{data.length} students</span>
                    </div>
                    {data[0] && (
                        <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl text-sm">
                            <Trophy size={15} className="text-amber-600" />
                            <span className="text-amber-700">Top score: <strong>{data[0].percentage}%</strong> by {data[0].name}</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Leaderboard;
