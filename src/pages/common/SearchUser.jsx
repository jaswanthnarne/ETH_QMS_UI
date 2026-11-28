import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import {
    Search,
    Users,
    GraduationCap,
    UserCheck,
    ShieldCheck,
    School,
    Layers,
    Mail,
    Phone,
    ExternalLink,
    KeyRound,
    X,
    Loader2,
    CheckCircle2,
    XCircle,
    FileText
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useCollegeStore from '../../store/collegeStore';
import { AlertModal } from '../../components/Modals';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/* Custom Architectural Vector SVG for User Directory Header */
const DirectoryIllustrationSvg = () => (
    <svg
        width="148"
        height="84"
        viewBox="0 0 148 84"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="hidden md:block shrink-0 select-none"
        aria-hidden="true"
    >
        {/* Background Card Stack */}
        <rect x="10" y="14" width="96" height="58" rx="8" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
        <rect x="18" y="8" width="96" height="58" rx="8" fill="#FFFFFF" stroke="#5899B5" strokeWidth="1.5" />

        {/* Profile Avatar inside Card */}
        <rect x="28" y="18" width="24" height="24" rx="6" fill="#5899B5" fillOpacity="0.12" stroke="#5899B5" strokeWidth="1.2" />
        <circle cx="40" cy="27" r="4" stroke="#5899B5" strokeWidth="1.4" />
        <path d="M33 38C34.2 35.2 36.8 34 40 34C43.2 34 45.8 35.2 47 38" stroke="#5899B5" strokeWidth="1.4" strokeLinecap="round" />

        {/* Structured Data Lines */}
        <rect x="60" y="20" width="42" height="5" rx="2.5" fill="#1E293B" />
        <rect x="60" y="29" width="28" height="4" rx="2" fill="#5899B5" />
        <rect x="60" y="37" width="36" height="3.5" rx="1.75" fill="#CBD5E1" />

        {/* Bottom Metadata Pills inside Card */}
        <rect x="28" y="49" width="24" height="7" rx="3.5" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1" />
        <rect x="56" y="49" width="32" height="7" rx="3.5" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1" />

        {/* Precision Magnifying Lens Node */}
        <circle cx="114" cy="52" r="18" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
        <circle cx="114" cy="52" r="12" fill="#5899B5" fillOpacity="0.1" stroke="#5899B5" strokeWidth="1.4" strokeDasharray="3 2" />
        <path d="M109 52H119M114 47V57" stroke="#5899B5" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M127 65L137 75" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
    </svg>
);

const SearchUser = () => {
    const { token, user } = useAuthStore();
    const { selectedCollegeId: storeCollegeId, selectedCollegeName } = useCollegeStore();
    const { collegeId: paramCollegeId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const urlCollegeMatch = location.pathname.match(/^\/college\/([a-f0-9]{24})/i);
    const urlCollegeId = paramCollegeId || (urlCollegeMatch ? urlCollegeMatch[1] : null);
    const activeCollegeId = urlCollegeId || storeCollegeId || '';

    const isTrainer = user?.role === 'trainer';
    const isFullGlobalAdmin = ['super_admin', 'ops_admin', 'ast_ops_admin'].includes(user?.role);
    const isReadOnlyRole = ['regional_manager', 'asst_rm', 'placement'].includes(user?.role);

    // Search & filter states
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
    const [debouncedQuery, setDebouncedQuery] = useState(searchParams.get('q') || '');
    const [activeCategory, setActiveCategory] = useState(isTrainer ? 'students' : 'all');
    const [filterCollegeId, setFilterCollegeId] = useState(activeCollegeId || 'all');
    const [filterBatchId, setFilterBatchId] = useState('all');

    // Data states
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState({ students: [], users: [] });
    const [counts, setCounts] = useState({ students: 0, trainers: 0, staff: 0 });
    const [filterOptions, setFilterOptions] = useState({ colleges: [], batches: [] });
    const [scopeMeta, setScopeMeta] = useState(null);

    // Profile Modal state
    const [selectedEntity, setSelectedEntity] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [profileLoading, setProfileLoading] = useState(false);

    // Password Reset Modal state for Student
    const [resetModalOpen, setResetModalOpen] = useState(false);
    const [resetTargetStudent, setResetTargetStudent] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [resetSubmitting, setResetSubmitting] = useState(false);
    const [alertState, setAlertState] = useState({ open: false, title: '', message: '', type: 'info' });

    useEffect(() => {
        const qFromUrl = searchParams.get('q');
        if (qFromUrl !== null && qFromUrl !== searchQuery) {
            setSearchQuery(qFromUrl);
            setDebouncedQuery(qFromUrl);
        }
    }, [searchParams]);

    useEffect(() => {
        if (activeCollegeId) {
            setFilterCollegeId(activeCollegeId);
        } else {
            setFilterCollegeId('all');
        }
        setFilterBatchId('all');
    }, [activeCollegeId]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 280);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const fetchSearchResults = useCallback(async () => {
        if (!token) return;
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (debouncedQuery.trim()) params.set('q', debouncedQuery.trim());
            params.set('type', isTrainer ? 'students' : activeCategory);

            const targetCollege = activeCollegeId || (filterCollegeId !== 'all' ? filterCollegeId : '');
            if (targetCollege) params.set('collegeId', targetCollege);
            if (filterBatchId && filterBatchId !== 'all') params.set('batchId', filterBatchId);
            params.set('limit', '60');

            const res = await axios.get(`${API}/admin/search-users?${params.toString()}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                setResults(res.data.data || { students: [], users: [] });
                setCounts(res.data.counts || { students: 0, trainers: 0, staff: 0 });
                setFilterOptions(res.data.filters || { colleges: [], batches: [] });
                setScopeMeta(res.data.scope || null);
            }
        } catch (err) {
            console.error('Failed to search users:', err);
        } finally {
            setLoading(false);
        }
    }, [token, debouncedQuery, activeCategory, activeCollegeId, filterCollegeId, filterBatchId, isTrainer]);

    useEffect(() => {
        fetchSearchResults();
    }, [fetchSearchResults]);

    const openUserProfile = async (entityType, id) => {
        setSelectedEntity({ entityType, id });
        setProfileLoading(true);
        setProfileData(null);
        try {
            const res = await axios.get(`${API}/admin/search-users/${entityType}/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setProfileData(res.data.data);
            }
        } catch (err) {
            setAlertState({
                open: true,
                title: 'Could Not Load Profile',
                message: err.response?.data?.error || 'Failed to load user details.',
                type: 'error'
            });
            setSelectedEntity(null);
        } finally {
            setProfileLoading(false);
        }
    };

    const handleResetStudentPassword = async (e) => {
        e.preventDefault();
        if (!resetTargetStudent || !newPassword || newPassword.trim().length < 4) {
            setAlertState({
                open: true,
                title: 'Invalid Password',
                message: 'Please enter a new password with at least 4 characters.',
                type: 'warning'
            });
            return;
        }
        try {
            setResetSubmitting(true);
            await axios.post(
                `${API}/admin/batches/${resetTargetStudent.batchId}/students/${resetTargetStudent._id}/reset-password`,
                { newPassword: newPassword.trim() },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setResetModalOpen(false);
            setNewPassword('');
            setAlertState({
                open: true,
                title: 'Password Updated',
                message: `Password for ${resetTargetStudent.name} (${resetTargetStudent.identifier || resetTargetStudent.usn}) has been reset.`,
                type: 'success'
            });
        } catch (err) {
            setAlertState({
                open: true,
                title: 'Reset Failed',
                message: err.response?.data?.error || 'Could not reset student password.',
                type: 'error'
            });
        } finally {
            setResetSubmitting(false);
        }
    };

    const getBatchDetailPath = (batchId, collegeId) => {
        if (!batchId) return null;
        if (isTrainer) return `/trainer/batches/${batchId}`;
        if (activeCollegeId) return `/college/${activeCollegeId}/admin/batches/${batchId}`;
        if (collegeId) return `/college/${collegeId}/admin/batches/${batchId}`;
        return `/admin/batches/${batchId}`;
    };

    const visibleBatchesForDropdown = filterOptions.batches.filter((b) => {
        if (activeCollegeId) return b.collegeId?.toString() === activeCollegeId.toString();
        if (filterCollegeId !== 'all') return b.collegeId?.toString() === filterCollegeId.toString();
        return true;
    });

    const activeCollegeDisplay =
        selectedCollegeName ||
        filterOptions.colleges.find((c) => c._id === (activeCollegeId || filterCollegeId))?.name ||
        'Selected College';

    return (
        <div className="space-y-6">
            {/* Clean Enterprise Header with Custom Vector SVG */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <DirectoryIllustrationSvg />
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-600 uppercase tracking-wide">
                                {isTrainer
                                    ? 'Assigned Batch Scope'
                                    : activeCollegeId
                                        ? activeCollegeDisplay
                                        : 'Global Directory'}
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900">Search User</h1>
                        <p className="text-sm text-slate-500 max-w-2xl">
                            {isTrainer
                                ? `Look up students enrolled across your ${scopeMeta?.batchesCount ?? filterOptions.batches.length} assigned batch(es) by Name, USN, Mobile, or Department.`
                                : activeCollegeId
                                    ? `Find students, trainers, and staff mapped to ${activeCollegeDisplay}. Select any record to view academic details, assessment history, and attendance.`
                                    : 'Find any student, trainer, or staff member across all colleges and batches by Name, USN, Employee ID, Email, or Mobile.'}
                        </p>
                    </div>
                </div>

                {/* Clean Monochrome Stats Strip */}
                <div className="flex items-center gap-3 shrink-0">
                    <div className="px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 min-w-[100px]">
                        <p className="text-[11px] font-medium text-slate-500 uppercase">Students</p>
                        <p className="text-xl font-bold text-slate-900 mt-0.5">{counts.students}</p>
                    </div>
                    {!isTrainer && (
                        <div className="px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 min-w-[100px]">
                            <p className="text-[11px] font-medium text-slate-500 uppercase">Trainers</p>
                            <p className="text-xl font-bold text-slate-900 mt-0.5">{counts.trainers}</p>
                        </div>
                    )}
                    <div className="px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 min-w-[100px]">
                        <p className="text-[11px] font-medium text-slate-500 uppercase">Batches</p>
                        <p className="text-xl font-bold text-slate-900 mt-0.5">{filterOptions.batches.length}</p>
                    </div>
                </div>
            </div>

            {/* Search & Filters Bar */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-5">
                {/* Row 1: Search Input + Category Segmented Switcher */}
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                    {/* Search Input */}
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={
                                isTrainer
                                    ? 'Search students in your batches by Name, USN, Mobile, or Email...'
                                    : 'Search by Name, USN, Employee ID, Mobile, or Email...'
                            }
                            className="w-full h-10 pl-10 pr-9 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:border-[#5899B5] focus:ring-2 focus:ring-[#5899B5]/15 outline-none transition-all"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    {/* Role Filter Segmented Switcher */}
                    {!isTrainer && (
                        <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0 overflow-x-auto">
                            {[
                                { id: 'all', label: 'All Users' },
                                { id: 'students', label: 'Students' },
                                { id: 'trainers', label: 'Trainers' },
                                ...(isFullGlobalAdmin ? [{ id: 'staff', label: 'Admins & Staff' }] : [])
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveCategory(tab.id)}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                                        activeCategory === tab.id
                                            ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/80'
                                            : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Row 2: Labeled Scope Dropdowns & Reset */}
                <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 items-end">
                    {/* Institution Scope */}
                    <div>
                        <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                            <School size={13} className="text-[#5899B5]" />
                            Institution Scope
                        </label>
                        {!isTrainer && !activeCollegeId && filterOptions.colleges.length > 1 ? (
                            <select
                                value={filterCollegeId}
                                onChange={(e) => {
                                    setFilterCollegeId(e.target.value);
                                    setFilterBatchId('all');
                                }}
                                className="w-full h-10 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-[#5899B5] focus:ring-2 focus:ring-[#5899B5]/15 transition-all cursor-pointer"
                            >
                                <option value="all">All Colleges ({filterOptions.colleges.length})</option>
                                {filterOptions.colleges.map((c) => (
                                    <option key={c._id} value={c._id}>
                                        {c.name} ({c.code})
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <div className="w-full h-10 px-3.5 bg-slate-100/90 border border-slate-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-slate-800 truncate">
                                <span className="w-2 h-2 rounded-full bg-[#5899B5] shrink-0" />
                                <span className="truncate">
                                    {isTrainer ? 'Assigned Batches Scope' : activeCollegeDisplay}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Batch Filter */}
                    <div>
                        <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                            <Layers size={13} className="text-[#5899B5]" />
                            Batch Filter
                        </label>
                        <select
                            value={filterBatchId}
                            onChange={(e) => setFilterBatchId(e.target.value)}
                            className="w-full h-10 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-[#5899B5] focus:ring-2 focus:ring-[#5899B5]/15 transition-all cursor-pointer"
                        >
                            <option value="all">
                                {isTrainer
                                    ? `All Assigned Batches (${visibleBatchesForDropdown.length})`
                                    : `All Batches (${visibleBatchesForDropdown.length})`}
                            </option>
                            {visibleBatchesForDropdown.map((b) => (
                                <option key={b._id} value={b._id}>
                                    {b.batchName}
                                    {b.courseCode ? ` (${b.courseCode})` : ''}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Active Summary & Clear */}
                    <div className="flex items-center justify-between lg:justify-end gap-3 h-10">
                        <span className="text-xs font-medium text-slate-500">
                            Showing <strong className="text-slate-800">{results.students.length}</strong> student{results.students.length !== 1 ? 's' : ''}
                            {!isTrainer && (
                                <>
                                    {' '}• <strong className="text-slate-800">{results.users.length}</strong> trainer/staff
                                </>
                            )}
                        </span>
                        {(searchQuery || filterBatchId !== 'all' || (!activeCollegeId && filterCollegeId !== 'all')) && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchQuery('');
                                    setFilterBatchId('all');
                                    if (!activeCollegeId) setFilterCollegeId('all');
                                }}
                                className="h-9 px-3.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer shrink-0"
                            >
                                Reset Filters
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="bg-white border border-slate-200 rounded-xl p-16 flex flex-col items-center justify-center gap-2">
                    <Loader2 size={24} className="animate-spin text-[#5899B5]" />
                    <p className="text-sm text-slate-400">Loading directory...</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* SECTION 1: TRAINERS & STAFF TABLE */}
                    {!isTrainer &&
                        (activeCategory === 'all' || activeCategory === 'trainers' || activeCategory === 'staff') &&
                        results.users.length > 0 && (
                            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                                <div className="px-6 py-3.5 border-b border-slate-100 flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-slate-800">
                                        Trainers &amp; Staff ({results.users.length})
                                    </h3>
                                    <span className="text-xs text-slate-400">Select a row to view details</span>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase">
                                                <th className="px-6 py-3">Name</th>
                                                <th className="px-6 py-3">Role</th>
                                                <th className="px-6 py-3">ID / Contact</th>
                                                <th className="px-6 py-3">College</th>
                                                <th className="px-6 py-3">Mapped Courses</th>
                                                <th className="px-6 py-3 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-sm">
                                            {results.users.map((u) => (
                                                <tr
                                                    key={u._id}
                                                    onClick={() => openUserProfile(u.entityType, u._id)}
                                                    className="hover:bg-slate-50/80 transition cursor-pointer"
                                                >
                                                    <td className="px-6 py-3.5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-semibold text-xs flex items-center justify-center shrink-0">
                                                                {(u.name || 'U').charAt(0).toUpperCase()}
                                                            </div>
                                                            <span className="font-semibold text-slate-900">{u.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-3.5">
                                                        <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium">
                                                            {u.roleLabel}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-3.5">
                                                        <div className="flex flex-col gap-0.5">
                                                            {u.employeeId && (
                                                                <code className="text-xs font-mono text-slate-800 font-semibold">
                                                                    {u.employeeId}
                                                                </code>
                                                            )}
                                                            <span className="text-xs text-slate-500 font-mono">
                                                                {u.phone || u.email || '—'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-3.5 text-xs font-medium text-slate-700">
                                                        {activeCollegeId ? activeCollegeDisplay : u.collegeName}
                                                    </td>
                                                    <td className="px-6 py-3.5">
                                                        {u.assignedCourses?.length > 0 ? (
                                                            <div className="flex flex-wrap gap-1">
                                                                {u.assignedCourses.slice(0, 3).map((c) => (
                                                                    <code
                                                                        key={c._id}
                                                                        className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs font-mono"
                                                                    >
                                                                        {c.code}
                                                                    </code>
                                                                ))}
                                                                {u.assignedCourses.length > 3 && (
                                                                    <span className="text-xs text-slate-400">
                                                                        +{u.assignedCourses.length - 3}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <span className="text-xs text-slate-400">—</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-3.5 text-right">
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openUserProfile(u.entityType, u._id);
                                                            }}
                                                            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition cursor-pointer"
                                                        >
                                                            View Details
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                    {/* SECTION 2: STUDENTS TABLE */}
                    {(isTrainer || activeCategory === 'all' || activeCategory === 'students') && (
                        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                            <div className="px-6 py-3.5 border-b border-slate-100 flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-slate-800">
                                    Students ({results.students.length}
                                    {counts.students > results.students.length ? ` of ${counts.students}` : ''})
                                </h3>
                                <span className="text-xs text-slate-400">
                                    Select a student to inspect exam history and attendance
                                </span>
                            </div>

                            {results.students.length === 0 ? (
                                <div className="p-14 text-center space-y-1.5">
                                    <Users size={28} className="mx-auto text-slate-300" />
                                    <p className="text-sm font-semibold text-slate-700">No students found</p>
                                    <p className="text-xs text-slate-400">
                                        Try adjusting your search query or batch filter.
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase">
                                                <th className="px-6 py-3">Student</th>
                                                <th className="px-6 py-3">USN</th>
                                                <th className="px-6 py-3">Batch &amp; Course</th>
                                                <th className="px-6 py-3">College</th>
                                                <th className="px-6 py-3">Academic</th>
                                                <th className="px-6 py-3">Contact</th>
                                                <th className="px-6 py-3 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-sm">
                                            {results.students.map((s) => {
                                                const batchPath = getBatchDetailPath(s.batchId, s.collegeId);
                                                return (
                                                    <tr
                                                        key={s._id}
                                                        onClick={() => openUserProfile('student', s._id)}
                                                        className="hover:bg-slate-50/80 transition cursor-pointer"
                                                    >
                                                        <td className="px-6 py-3.5">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-semibold text-xs flex items-center justify-center shrink-0">
                                                                    {(s.name || 'S').charAt(0).toUpperCase()}
                                                                </div>
                                                                <span className="font-semibold text-slate-900">
                                                                    {s.name}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-3.5">
                                                            <code className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs font-mono">
                                                                {s.identifier}
                                                            </code>
                                                        </td>
                                                        <td className="px-6 py-3.5">
                                                            <p className="font-medium text-slate-800">{s.batchName}</p>
                                                            <p className="text-xs text-slate-400">
                                                                {s.courseName || '—'}
                                                                {s.courseCode ? ` (${s.courseCode})` : ''}
                                                            </p>
                                                        </td>
                                                        <td className="px-6 py-3.5 text-xs text-slate-600">
                                                            {s.collegeName}
                                                        </td>
                                                        <td className="px-6 py-3.5 text-xs text-slate-600">
                                                            <div>
                                                                {s.department || '—'}
                                                                {s.semester ? ` • Sem ${s.semester}` : ''}
                                                            </div>
                                                            <div className="text-slate-400">
                                                                CGPA: {s.cgpa || 0} • Backlogs: {s.backlogs || 0}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-3.5 text-xs text-slate-500">
                                                            {s.phone || s.email || '—'}
                                                        </td>
                                                        <td className="px-6 py-3.5 text-right">
                                                            <div
                                                                className="inline-flex items-center gap-1.5"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <button
                                                                    type="button"
                                                                    onClick={() => openUserProfile('student', s._id)}
                                                                    className="px-3 py-1.5 rounded-lg bg-[#5899B5] hover:bg-[#3D7690] text-white text-xs font-medium transition cursor-pointer"
                                                                >
                                                                    View Profile
                                                                </button>
                                                                {batchPath && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => navigate(batchPath)}
                                                                        title="Open Batch Roster"
                                                                        className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition cursor-pointer"
                                                                    >
                                                                        <ExternalLink size={14} />
                                                                    </button>
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
                    )}
                </div>
            )}

            {/* USER PROFILE MODAL */}
            {selectedEntity && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-4xl max-h-[88vh] flex flex-col overflow-hidden">
                        {/* Modal Header */}
                        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-800 font-bold text-sm flex items-center justify-center shrink-0">
                                    {profileData?.profile
                                        ? (
                                              profileData.profile.name ||
                                              profileData.profile.firstName ||
                                              'U'
                                          )
                                              .charAt(0)
                                              .toUpperCase()
                                        : 'U'}
                                </div>
                                <div className="min-w-0">
                                    <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                        User Details
                                    </span>
                                    <h3 className="text-base font-bold text-slate-900 truncate">
                                        {profileLoading
                                            ? 'Loading...'
                                            : profileData?.entityType === 'student'
                                                ? `${profileData.profile.name} (${profileData.profile.usn})`
                                                : `${profileData?.profile?.firstName || ''} ${profileData?.profile?.lastName || ''}`.trim() ||
                                                  profileData?.profile?.email}
                                    </h3>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedEntity(null);
                                    setProfileData(null);
                                }}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {profileLoading || !profileData ? (
                                <div className="py-16 flex flex-col items-center justify-center gap-2">
                                    <Loader2 size={24} className="animate-spin text-[#5899B5]" />
                                    <p className="text-xs text-slate-400">Loading academic and assessment records...</p>
                                </div>
                            ) : profileData.entityType === 'student' ? (
                                <>
                                    {/* Student Metadata Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1">
                                            <span className="text-[10px] font-semibold uppercase text-slate-400">
                                                College &amp; Batch
                                            </span>
                                            <p className="text-sm font-semibold text-slate-900">
                                                {profileData.profile.collegeId?.name || '—'}
                                            </p>
                                            <p className="text-xs text-slate-600">
                                                Batch: {profileData.profile.batchId?.batchName || '—'} •{' '}
                                                {profileData.profile.department || '—'}
                                            </p>
                                        </div>

                                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1">
                                            <span className="text-[10px] font-semibold uppercase text-slate-400">
                                                Course &amp; Trainer
                                            </span>
                                            <p className="text-sm font-semibold text-slate-900">
                                                {profileData.profile.batchId?.courseId?.name || 'No Course Mapped'}
                                            </p>
                                            <p className="text-xs text-slate-600">
                                                Trainer:{' '}
                                                {profileData.profile.batchId?.trainerId
                                                    ? `${profileData.profile.batchId.trainerId.firstName || ''} ${profileData.profile.batchId.trainerId.lastName || ''}`.trim()
                                                    : 'Unassigned'}
                                            </p>
                                        </div>

                                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1">
                                            <span className="text-[10px] font-semibold uppercase text-slate-400">
                                                Academics &amp; Contact
                                            </span>
                                            <p className="text-sm font-semibold text-slate-900">
                                                CGPA: {profileData.profile.cgpa ?? 0} • Backlogs:{' '}
                                                {profileData.profile.backlogs ?? 0}
                                            </p>
                                            <p className="text-xs text-slate-500 font-mono">
                                                {profileData.profile.mobile || 'No Mobile'} •{' '}
                                                {profileData.profile.email || 'No Email'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Student Summary Metrics */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        <div className="bg-white border border-slate-200 rounded-xl p-4">
                                            <p className="text-[11px] font-medium text-slate-500">Exams Completed</p>
                                            <p className="text-xl font-bold text-slate-900 mt-1">
                                                {profileData.examSummary?.completedAttempts || 0}
                                            </p>
                                        </div>
                                        <div className="bg-white border border-slate-200 rounded-xl p-4">
                                            <p className="text-[11px] font-medium text-slate-500">Average Score</p>
                                            <p className="text-xl font-bold text-slate-900 mt-1">
                                                {profileData.examSummary?.avgScore || 0}%
                                            </p>
                                        </div>
                                        <div className="bg-white border border-slate-200 rounded-xl p-4">
                                            <p className="text-[11px] font-medium text-slate-500">Exams Passed</p>
                                            <p className="text-xl font-bold text-slate-900 mt-1">
                                                {profileData.examSummary?.passedCount || 0}
                                            </p>
                                        </div>
                                        <div className="bg-white border border-slate-200 rounded-xl p-4">
                                            <p className="text-[11px] font-medium text-slate-500">Attendance</p>
                                            <p className="text-xl font-bold text-slate-900 mt-1">
                                                {profileData.attendanceSummary?.percentage || 0}%
                                                <span className="text-xs font-normal text-slate-400 ml-1">
                                                    ({profileData.attendanceSummary?.presentCount || 0}/
                                                    {profileData.attendanceSummary?.totalSessions || 0})
                                                </span>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Exam Attempts Table */}
                                    <div className="space-y-2.5">
                                        <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            Assessment History ({profileData.attempts?.length || 0})
                                        </h4>
                                        {!profileData.attempts || profileData.attempts.length === 0 ? (
                                            <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-400">
                                                No assessment attempts recorded for this student.
                                            </div>
                                        ) : (
                                            <div className="border border-slate-200 rounded-xl overflow-hidden">
                                                <table className="w-full text-left border-collapse text-xs">
                                                    <thead>
                                                        <tr className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-500 uppercase">
                                                            <th className="px-4 py-2.5">Exam Title</th>
                                                            <th className="px-4 py-2.5">Score</th>
                                                            <th className="px-4 py-2.5">Result</th>
                                                            <th className="px-4 py-2.5">Violations</th>
                                                            <th className="px-4 py-2.5 text-right">Date</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-100">
                                                        {profileData.attempts.map((a) => (
                                                            <tr key={a._id} className="hover:bg-slate-50">
                                                                <td className="px-4 py-3 font-medium text-slate-800">
                                                                    {a.examTitle}
                                                                </td>
                                                                <td className="px-4 py-3 text-slate-700">
                                                                    {a.totalScore}/{a.totalMarks} ({a.percentage}%)
                                                                </td>
                                                                <td className="px-4 py-3">
                                                                    <span
                                                                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                                                                            a.result === 'pass'
                                                                                ? 'bg-emerald-50 text-emerald-700'
                                                                                : 'bg-slate-100 text-slate-600'
                                                                        }`}
                                                                    >
                                                                        {a.result}
                                                                    </span>
                                                                </td>
                                                                <td className="px-4 py-3 text-slate-600">
                                                                    {a.violationsCount > 0
                                                                        ? `${a.violationsCount} flag(s)`
                                                                        : 'None'}
                                                                </td>
                                                                <td className="px-4 py-3 text-right text-slate-400">
                                                                    {a.completedAt
                                                                        ? new Date(a.completedAt).toLocaleDateString('en-IN')
                                                                        : '—'}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                /* Trainer / Staff Profile View */
                                <div className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1">
                                            <span className="text-[10px] font-semibold uppercase text-slate-400">
                                                Role &amp; Employee ID
                                            </span>
                                            <p className="text-sm font-semibold text-slate-900 capitalize">
                                                {profileData.profile.role?.replace(/_/g, ' ')}
                                            </p>
                                            <p className="text-xs font-mono text-slate-600">
                                                {profileData.profile.employeeId || profileData.profile.email || '—'}
                                            </p>
                                        </div>
                                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1">
                                            <span className="text-[10px] font-semibold uppercase text-slate-400">
                                                Contact
                                            </span>
                                            <p className="text-xs font-medium text-slate-800">
                                                Phone: {profileData.profile.phone || '—'}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                Email: {profileData.profile.email || '—'}
                                            </p>
                                        </div>
                                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1">
                                            <span className="text-[10px] font-semibold uppercase text-slate-400">
                                                Activity
                                            </span>
                                            <p className="text-sm font-semibold text-slate-900">
                                                {profileData.batches?.length || 0} Assigned Batch(es)
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {profileData.trainingLogsCount || 0} Training Sessions Logged
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-2.5">
                                        <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            Assigned Batches ({profileData.batches?.length || 0})
                                        </h4>
                                        {!profileData.batches || profileData.batches.length === 0 ? (
                                            <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-400">
                                                No batches currently assigned.
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {profileData.batches.map((b) => (
                                                    <div
                                                        key={b._id}
                                                        onClick={() => {
                                                            const path = getBatchDetailPath(b._id, b.collegeId?._id);
                                                            if (path) navigate(path);
                                                        }}
                                                        className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white flex items-center justify-between gap-3 cursor-pointer transition"
                                                    >
                                                        <div>
                                                            <p className="text-sm font-semibold text-slate-900">
                                                                {b.batchName}
                                                            </p>
                                                            <p className="text-xs text-slate-500">
                                                                {b.collegeId?.name || '—'} • {b.courseId?.name || '—'}
                                                            </p>
                                                        </div>
                                                        <ExternalLink size={14} className="text-slate-400 shrink-0" />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        {profileData && (
                            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                                {profileData.entityType === 'student' ? (
                                    <>
                                        <div>
                                            {!isReadOnlyRole && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setResetTargetStudent({
                                                            _id: profileData.profile._id,
                                                            name: profileData.profile.name,
                                                            usn: profileData.profile.usn,
                                                            batchId:
                                                                profileData.profile.batchId?._id ||
                                                                profileData.profile.batchId
                                                        });
                                                        setNewPassword('');
                                                        setResetModalOpen(true);
                                                    }}
                                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold transition cursor-pointer"
                                                >
                                                    <KeyRound size={13} />
                                                    Reset Password
                                                </button>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {profileData.profile.batchId && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const path = getBatchDetailPath(
                                                            profileData.profile.batchId?._id ||
                                                                profileData.profile.batchId,
                                                            profileData.profile.collegeId?._id ||
                                                                profileData.profile.collegeId
                                                        );
                                                        if (path) navigate(path);
                                                    }}
                                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#5899B5] hover:bg-[#3D7690] text-white text-xs font-semibold transition cursor-pointer"
                                                >
                                                    <ExternalLink size={13} />
                                                    Open Batch Roster
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedEntity(null);
                                                    setProfileData(null);
                                                }}
                                                className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex items-center justify-end w-full">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedEntity(null);
                                                setProfileData(null);
                                            }}
                                            className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                                        >
                                            Close
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Reset Student Password Modal */}
            {resetModalOpen && resetTargetStudent && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-md p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-bold text-slate-900">Reset Student Password</h3>
                            <button
                                type="button"
                                onClick={() => setResetModalOpen(false)}
                                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <p className="text-xs text-slate-500">
                            Set a new password for <b>{resetTargetStudent.name}</b> ({resetTargetStudent.usn}).
                        </p>
                        <form onSubmit={handleResetStudentPassword} className="space-y-4">
                            <input
                                type="text"
                                required
                                minLength={4}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password (min 4 characters)"
                                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm font-mono focus:bg-white focus:border-[#5899B5] outline-none"
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setResetModalOpen(false)}
                                    className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={resetSubmitting}
                                    className="px-5 py-2 rounded-lg bg-[#5899B5] hover:bg-[#3D7690] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                                >
                                    {resetSubmitting && <Loader2 size={14} className="animate-spin" />}
                                    Save Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

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

export default SearchUser;
