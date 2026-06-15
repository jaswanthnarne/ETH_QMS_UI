import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import {
    ShieldCheck, Search, Filter, ChevronLeft, ChevronRight,
    RefreshCw, User, Book, GraduationCap, FileText, Trash2, Copy
} from 'lucide-react';
import axios from 'axios';
import useAuthStore from '../../store/authStore';
import useCollegeStore from '../../store/collegeStore';
import useSocketUpdate from '../../hooks/useSocketUpdate';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ACTION_ICONS = {
    CREATE_COLLEGE: { icon: GraduationCap, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    UPDATE_COLLEGE: { icon: GraduationCap, color: 'text-blue-600', bg: 'bg-blue-50' },
    DELETE_COLLEGE: { icon: Trash2, color: 'text-red-600', bg: 'bg-red-50' },
    CREATE_TRAINER: { icon: User, color: 'text-violet-600', bg: 'bg-violet-50' },
    DELETE_TRAINER: { icon: Trash2, color: 'text-red-600', bg: 'bg-red-50' },
    CREATE_EXAM: { icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    DELETE_EXAM: { icon: Trash2, color: 'text-red-650', bg: 'bg-red-50' },
    CLONE_EXAM: { icon: Copy, color: 'text-amber-600', bg: 'bg-amber-50' },
    BULK_IMPORT_QUESTIONS: { icon: Book, color: 'text-teal-600', bg: 'bg-teal-50' },
};

const ACTION_LABELS = {
    CREATE_COLLEGE: 'Created College',
    UPDATE_COLLEGE: 'Updated College',
    DELETE_COLLEGE: 'Deleted College',
    CREATE_TRAINER: 'Created Trainer',
    DELETE_TRAINER: 'Deleted Trainer',
    CREATE_EXAM: 'Created Exam',
    DELETE_EXAM: 'Deleted Exam',
    CLONE_EXAM: 'Cloned Exam',
    BULK_IMPORT_QUESTIONS: 'Bulk Imported Questions',
};

const AuditLogs = () => {
    const { token } = useAuthStore();
    const { selectedCollegeId } = useCollegeStore();
    const location = useLocation();

    // Derive college ID from URL as fallback
    const urlCollegeMatch = location.pathname.match(/\/college\/([a-f0-9]+)/);
    const urlCollegeId = urlCollegeMatch ? urlCollegeMatch[1] : null;
    const effectiveCollegeId = selectedCollegeId || urlCollegeId;

    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, limit: 25, total: 0, pages: 1 });
    const [search, setSearch] = useState('');
    const [actionFilter, setActionFilter] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(search), 400);
        return () => clearTimeout(t);
    }, [search]);

    const fetchLogs = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: pagination.page,
                limit: pagination.limit,
                ...(debouncedSearch && { search: debouncedSearch }),
                ...(actionFilter && { action: actionFilter }),
                ...(effectiveCollegeId && { collegeId: effectiveCollegeId })
            });
            const res = await axios.get(`${API}/audit/logs?${params}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLogs(res.data.data || []);
            setPagination(prev => ({ ...prev, ...res.data.pagination }));
        } catch (err) {
            console.error('Failed to load audit logs:', err);
        } finally {
            setLoading(false);
        }
    }, [token, pagination.page, pagination.limit, debouncedSearch, actionFilter, effectiveCollegeId]);

    useEffect(() => { fetchLogs(); }, [fetchLogs]);

    useSocketUpdate(() => {
        fetchLogs();
    }, ['audit_logs']);

    const formatDate = (iso) => {
        const d = new Date(iso);
        return d.toLocaleString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: true
        });
    };

    const getActionMeta = (action) => ACTION_ICONS[action] || {
        icon: ShieldCheck, color: 'text-slate-600', bg: 'bg-slate-100'
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Audit Log</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Track all admin actions — {pagination.total} total events
                    </p>
                </div>
                <button
                    onClick={fetchLogs}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                >
                    <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
                    <h3 className="text-sm font-semibold text-slate-700">{pagination.total} audit event{pagination.total !== 1 ? 's' : ''}</h3>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            <select
                                className="pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-650 outline-none focus:border-[#004AAD] appearance-none cursor-pointer"
                                value={actionFilter}
                                onChange={e => { setActionFilter(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
                            >
                                <option value="">All Actions</option>
                                {Object.keys(ACTION_LABELS).map(a => (
                                    <option key={a} value={a}>{ACTION_LABELS[a]}</option>
                                ))}
                            </select>
                        </div>
                        <div className="relative w-72">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#004AAD]"
                                placeholder="Search logs..."
                                value={search}
                                onChange={e => { setSearch(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Action</th>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Performed By</th>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Target</th>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">IP Address</th>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                Array.from({ length: 8 }).map((_, i) => (
                                    <tr key={i} className="hover:bg-slate-50/50 group">
                                        {Array.from({ length: 5 }).map((_, j) => (
                                            <td key={j} className="px-6 py-4">
                                                <div className="h-4 bg-slate-100 rounded animate-pulse" style={{ width: `${60 + Math.random() * 40}%` }} />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-16 text-center">
                                        <ShieldCheck size={36} className="mx-auto text-slate-200 mb-3" />
                                        <p className="text-sm text-slate-400">No audit events found</p>
                                    </td>
                                </tr>
                            ) : logs.map((log) => {
                                const meta = getActionMeta(log.action);
                                const IconComp = meta.icon;
                                return (
                                    <tr key={log._id} className="hover:bg-slate-50/50 group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2.5">
                                                <div className={`w-8 h-8 rounded-lg ${meta.bg} flex items-center justify-center flex-shrink-0`}>
                                                    <IconComp size={15} className={meta.color} />
                                                </div>
                                                <span className="font-medium text-slate-800">
                                                    {ACTION_LABELS[log.action] || log.action}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-800">{log.userName || '—'}</div>
                                            <div className="text-xs text-slate-400 capitalize">{log.userRole}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-700">{log.targetName || '—'}</div>
                                            <div className="text-xs text-slate-400 capitalize">{log.targetType}</div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                                            {log.ipAddress || '—'}
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 text-xs text-right whitespace-nowrap">
                                            {formatDate(log.createdAt)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                    <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-100 bg-slate-50/50">
                        <span className="text-xs text-slate-500">
                            Showing {((pagination.page - 1) * pagination.limit) + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
                        </span>
                        <div className="flex items-center gap-1.5">
                            <button
                                disabled={pagination.page <= 1}
                                onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition-colors"
                            >
                                <ChevronLeft size={15} />
                            </button>
                            {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
                                const p = i + 1;
                                return (
                                    <button
                                        key={p}
                                        onClick={() => setPagination(prev => ({ ...prev, page: p }))}
                                        className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${pagination.page === p
                                                ? 'bg-[#004AAD] text-white'
                                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                                            }`}
                                    >
                                        {p}
                                    </button>
                                );
                            })}
                            <button
                                disabled={pagination.page >= pagination.pages}
                                onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition-colors"
                            >
                                <ChevronRight size={15} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuditLogs;
