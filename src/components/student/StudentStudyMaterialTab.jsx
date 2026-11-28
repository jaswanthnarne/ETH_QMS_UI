import React, { useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import {
    BookOpen,
    GraduationCap,
    Library,
    Search,
    FileText,
    FolderOpen,
    Layers,
    ExternalLink,
    User,
    Users,
    Clock,
    Calendar,
    X,
    Code2,
    Copy,
    Check,
    HelpCircle,
    Sparkles
} from 'lucide-react';
import useStudentAuthStore from '../../store/studentAuthStore';

const TEACHER_TYPES = ['All', 'PDF Notes', 'Slides', 'Assignments', 'Reference'];
const LMS_TYPES = ['All', 'Module Notes', 'PDF', 'Slides', 'Syllabus'];

const StudentStudyMaterialTab = ({ student }) => {
    const { token } = useStudentAuthStore();
    const [sourceTab, setSourceTab] = useState('teacher'); // 'teacher' | 'lms'
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [liveData, setLiveData] = useState(null);
    const [previewItem, setPreviewItem] = useState(null);
    const [previewMode, setPreviewMode] = useState('notes'); // 'notes' | 'pdf'
    const [previewBlobUrl, setPreviewBlobUrl] = useState('');
    const [previewLoading, setPreviewLoading] = useState(false);
    const [copiedCodeIdx, setCopiedCodeIdx] = useState(null);

    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const serverOrigin = apiBase.replace(/\/api\/?$/, '');
    const resolveMaterialUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('/api/')) return `${serverOrigin}${url}`;
        if (url.startsWith('/uploads/')) return `${serverOrigin}${url}`;
        return url;
    };

    const hasInlineNotes = (item) => {
        if (!item) return false;
        const hasSections = Array.isArray(item.sections) && item.sections.length > 0;
        const hasText = Boolean((item.textContent || '').trim());
        const hasPractice = Array.isArray(item.practice) && item.practice.length > 0;
        return hasSections || hasText || hasPractice;
    };

    const openMaterialViewer = (item, preferredMode = 'auto') => {
        setPreviewItem(item);
        if (preferredMode === 'notes' || (preferredMode === 'auto' && hasInlineNotes(item))) {
            setPreviewMode('notes');
        } else {
            setPreviewMode('pdf');
        }
    };

    const handleCopyCode = (code, idx) => {
        if (!code) return;
        navigator.clipboard?.writeText(code);
        setCopiedCodeIdx(idx);
        setTimeout(() => setCopiedCodeIdx(null), 1800);
    };

    useEffect(() => {
        let activeUrl = '';
        if (!previewItem?.fileUrl) {
            setPreviewBlobUrl('');
            setPreviewLoading(false);
            return;
        }
        const targetUrl = resolveMaterialUrl(previewItem.fileUrl);
        setPreviewLoading(true);
        fetch(targetUrl)
            .then((res) => res.blob())
            .then((blob) => {
                const pdfBlob = new Blob([blob], { type: blob.type || 'application/pdf' });
                activeUrl = URL.createObjectURL(pdfBlob);
                setPreviewBlobUrl(activeUrl);
            })
            .catch(() => {
                setPreviewBlobUrl(targetUrl);
            })
            .finally(() => {
                setPreviewLoading(false);
            });

        return () => {
            if (activeUrl) URL.revokeObjectURL(activeUrl);
        };
    }, [previewItem]);

    useEffect(() => {
        if (!token) return;
        const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        axios
            .get(`${apiBase}/student/study-materials`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then((res) => {
                if (res.data?.success) {
                    setLiveData(res.data.data);
                }
            })
            .catch(() => {});
    }, [token]);

    // Real Batch, Trainer & Mapped Course from live endpoint or Student Profile
    const batchObj = typeof student?.batchId === 'object' ? student?.batchId : null;
    const courseObj = liveData?.course || (typeof batchObj?.courseId === 'object' ? batchObj?.courseId : null);
    const trainerObj = typeof batchObj?.trainerId === 'object' ? batchObj?.trainerId : null;

    const batchName = liveData?.batchName || student?.batchName || batchObj?.batchName || 'Assigned Batch';
    const trainerName =
        liveData?.trainerName ||
        student?.trainerName ||
        (trainerObj ? `${trainerObj.firstName || ''} ${trainerObj.lastName || ''}`.trim() : '') ||
        'Batch Trainer';
    const courseName = courseObj?.name || student?.courseName || '';
    const courseCode = courseObj?.code || student?.courseCode || '';
    const courseProgram = courseObj?.program || batchObj?.program || '';
    const courseDuration = courseObj?.duration || '';
    const courseModulesCount = courseObj?.modulesCount || 0;
    const courseDescription = courseObj?.description || '';
    const syllabusUrl = courseObj?.syllabusUrl || '';

    // Real materials from Teacher uploads & Mapped Course (LMS)
    const teacherMaterials = useMemo(() => {
        const raw = Array.isArray(liveData?.teacherMaterials)
            ? liveData.teacherMaterials
            : Array.isArray(batchObj?.materials)
                ? batchObj.materials
                : [];
        return raw.filter((m) => !String(m.fileUrl || '').includes('qms_study_materials'));
    }, [liveData, batchObj]);

    const lmsCourseMaterials = useMemo(() => {
        const base = Array.isArray(liveData?.lmsMaterials)
            ? liveData.lmsMaterials
            : Array.isArray(courseObj?.materials)
                ? courseObj.materials
                : [];
        const list = [...base];
        if (syllabusUrl) {
            list.unshift({
                _id: 'course-syllabus',
                title: `${courseName || 'Course'} Official Syllabus`,
                module: 'Course Syllabus',
                type: 'Syllabus',
                fileUrl: syllabusUrl,
                description: `Official curriculum syllabus mapped to ${batchName}.`
            });
        }
        return list;
    }, [liveData, courseObj, syllabusUrl, courseName, batchName]);

    const filteredTeacherMaterials = useMemo(() => {
        return teacherMaterials.filter((item) => {
            if (selectedFilter !== 'All' && item.type !== selectedFilter) return false;
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                return (
                    (item.title || '').toLowerCase().includes(q) ||
                    (item.module || '').toLowerCase().includes(q) ||
                    (item.description || '').toLowerCase().includes(q) ||
                    (item.textContent || '').toLowerCase().includes(q)
                );
            }
            return true;
        });
    }, [teacherMaterials, selectedFilter, searchQuery]);

    const filteredLmsMaterials = useMemo(() => {
        return lmsCourseMaterials.filter((item) => {
            if (selectedFilter !== 'All' && item.type !== selectedFilter) return false;
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                return (
                    (item.title || '').toLowerCase().includes(q) ||
                    (item.module || '').toLowerCase().includes(q) ||
                    (item.description || '').toLowerCase().includes(q) ||
                    (item.textContent || '').toLowerCase().includes(q)
                );
            }
            return true;
        });
    }, [lmsCourseMaterials, selectedFilter, searchQuery]);

    const handleSourceSwitch = (nextSource) => {
        setSourceTab(nextSource);
        setSelectedFilter('All');
        setSearchQuery('');
    };

    const renderMaterialActions = (item) => {
        const hasNotes = hasInlineNotes(item);
        const hasPdf = Boolean(item.fileUrl);

        return (
            <div className="flex flex-wrap items-center gap-2 pt-2">
                {hasNotes && (
                    <button
                        type="button"
                        onClick={() => openMaterialViewer(item, 'notes')}
                        className="flex-1 min-w-[125px] py-2.5 px-3 rounded-xl bg-[#5899B5] hover:bg-[#3D7690] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-2xs"
                    >
                        <BookOpen size={14} />
                        Read Notes
                    </button>
                )}
                {hasPdf && (
                    <button
                        type="button"
                        onClick={() => openMaterialViewer(item, 'pdf')}
                        className={`flex-1 min-w-[115px] py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                            hasNotes
                                ? 'bg-sky-50 hover:bg-sky-100 text-[#3D7690] border border-sky-200'
                                : 'bg-[#5899B5] hover:bg-[#3D7690] text-white'
                        }`}
                    >
                        <FileText size={14} />
                        View PDF
                    </button>
                )}
                {hasPdf && (
                    <a
                        href={resolveMaterialUrl(item.fileUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open PDF in new tab"
                        className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center transition"
                    >
                        <ExternalLink size={14} />
                    </a>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Primary 2-Option Switcher: Uploaded by Teacher / LMS */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="inline-flex p-1.5 bg-slate-100 rounded-xl border border-slate-200/80 w-full sm:w-auto">
                    <button
                        type="button"
                        onClick={() => handleSourceSwitch('teacher')}
                        className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
                            sourceTab === 'teacher'
                                ? 'bg-[#5899B5] text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        <GraduationCap size={17} />
                        Uploaded by Teacher
                        <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                sourceTab === 'teacher' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                            }`}
                        >
                            {teacherMaterials.length}
                        </span>
                    </button>
                    <button
                        type="button"
                        onClick={() => handleSourceSwitch('lms')}
                        className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
                            sourceTab === 'lms'
                                ? 'bg-[#5899B5] text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        <Library size={17} />
                        LMS
                        <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                sourceTab === 'lms' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                            }`}
                        >
                            {lmsCourseMaterials.length}
                        </span>
                    </button>
                </div>

                {/* Search Input */}
                <div className="relative w-full lg:w-80">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={
                            sourceTab === 'teacher'
                                ? 'Search teacher notes & PDFs...'
                                : 'Search mapped course LMS content...'
                        }
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#5899B5] outline-none transition"
                    />
                </div>
            </div>

            {/* Context Summary Bar (Shows Mapped Batch, Trainer & Mapped Course) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:px-6 flex flex-wrap items-center justify-between gap-4 shadow-xs">
                <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-600">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-slate-800">
                        <Users size={15} className="text-[#5899B5]" />
                        Batch: <span className="text-[#5899B5]">{batchName}</span>
                    </span>
                    <span className="text-slate-300">|</span>
                    {sourceTab === 'teacher' ? (
                        <span className="inline-flex items-center gap-1.5 font-medium">
                            <User size={15} className="text-slate-400" />
                            Trainer: <span className="font-semibold text-slate-800">{trainerName || 'Not Assigned'}</span>
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 font-medium">
                            <BookOpen size={15} className="text-slate-400" />
                            Mapped Course:{' '}
                            {courseName ? (
                                <span className="font-semibold text-slate-800">
                                    {courseName} {courseCode ? `(${courseCode})` : ''}
                                </span>
                            ) : (
                                <span className="font-semibold text-amber-700">No Course Mapped Yet</span>
                            )}
                        </span>
                    )}
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap items-center gap-1.5">
                    {(sourceTab === 'teacher' ? TEACHER_TYPES : LMS_TYPES).map((item) => (
                        <button
                            key={item}
                            type="button"
                            onClick={() => setSelectedFilter(item)}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer border ${
                                selectedFilter === item
                                    ? 'bg-[#5899B5] text-white border-[#5899B5]'
                                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </div>

            {/* OPTION 1: UPLOADED BY TEACHER */}
            {sourceTab === 'teacher' && (
                filteredTeacherMaterials.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {filteredTeacherMaterials.map((item, idx) => {
                            const hasNotes = hasInlineNotes(item);
                            const hasPdf = Boolean(item.fileUrl);
                            return (
                                <div
                                    key={item._id || idx}
                                    className="bg-white border border-slate-200 hover:border-[#5899B5]/60 rounded-2xl p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between gap-4"
                                >
                                    <div className="space-y-2.5">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <div className="flex flex-wrap items-center gap-1.5">
                                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-sky-50 text-sky-700 border border-sky-200">
                                                    {item.type || 'PDF Notes'}
                                                </span>
                                                {item.module && (
                                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                                                        {item.module}
                                                    </span>
                                                )}
                                                {hasNotes && hasPdf && (
                                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                        In-Site Notes + PDF
                                                    </span>
                                                )}
                                            </div>
                                            {item.uploadedAt && (
                                                <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                                                    <Calendar size={11} />
                                                    {new Date(item.uploadedAt).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-base font-semibold text-slate-900 leading-snug">{item.title}</h3>
                                        {item.description && (
                                            <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
                                        )}
                                        {Array.isArray(item.sections) && item.sections.length > 0 && (
                                            <div className="pt-1 flex flex-wrap gap-1.5">
                                                {item.sections.map((sec, sIdx) => (
                                                    <span
                                                        key={sIdx}
                                                        className="inline-flex items-center gap-1 text-[10.5px] font-medium text-slate-600 bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded-md"
                                                    >
                                                        <Code2 size={11} className="text-[#5899B5]" />
                                                        {sec.heading}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="pt-2 border-t border-slate-100 space-y-2">
                                        {renderMaterialActions(item)}
                                        <div className="flex items-center justify-between gap-2 pt-1.5 text-[10.5px] text-slate-400">
                                            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-500">
                                                <img
                                                    src="/assets/cropped-New-logo-footer-270x270.png"
                                                    alt="Ethnotech"
                                                    className="w-4 h-4 rounded-sm object-contain"
                                                />
                                                Ethnotech Academy
                                            </span>
                                            <span>© All Rights Reserved</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 text-center shadow-xs">
                        <div className="max-w-md mx-auto space-y-3">
                            <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-200 text-[#5899B5] flex items-center justify-center mx-auto">
                                <FolderOpen size={26} />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900">
                                No Materials Uploaded by Teacher Yet
                            </h3>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                When your trainer ({trainerName}) uploads class notes, PDFs, or reference materials for{' '}
                                <span className="font-semibold text-slate-700">{batchName}</span>, they will be listed here.
                            </p>
                        </div>
                    </div>
                )
            )}

            {/* OPTION 2: LMS (MAPPED COURSE CONTENT) */}
            {sourceTab === 'lms' && (
                <div className="space-y-5">
                    {/* Mapped Course Info Card */}
                    {courseName ? (
                        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-1.5">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold uppercase tracking-wider bg-sky-50 text-sky-700 border border-sky-200">
                                        Mapped Batch Course
                                    </span>
                                    {courseCode && (
                                        <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-slate-100 text-slate-700">
                                            Code: {courseCode}
                                        </span>
                                    )}
                                    {courseProgram && (
                                        <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                                            {courseProgram}
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900">{courseName}</h3>
                                {courseDescription && (
                                    <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">{courseDescription}</p>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center gap-3 shrink-0 text-xs font-semibold text-slate-600">
                                {courseModulesCount > 0 && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
                                        <Layers size={14} className="text-[#5899B5]" />
                                        {courseModulesCount} Modules
                                    </span>
                                )}
                                {courseDuration && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
                                        <Clock size={14} className="text-[#5899B5]" />
                                        {courseDuration}
                                    </span>
                                )}
                            </div>
                        </div>
                    ) : null}

                    {/* Mapped Course Materials List or Empty State */}
                    {filteredLmsMaterials.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                            {filteredLmsMaterials.map((item, idx) => {
                                const hasNotes = hasInlineNotes(item);
                                const hasPdf = Boolean(item.fileUrl);
                                return (
                                    <div
                                        key={item._id || idx}
                                        className="bg-white border border-slate-200 hover:border-[#5899B5]/60 rounded-2xl p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between gap-4"
                                    >
                                        <div className="space-y-2.5">
                                            <div className="flex items-center justify-between gap-2 flex-wrap">
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-sky-50 text-sky-700 border border-sky-200">
                                                        {item.module || 'Course Module'}
                                                    </span>
                                                    {hasNotes && hasPdf && (
                                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                            In-Site Notes + PDF
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-[11px] font-medium text-slate-400">
                                                    {item.type || 'PDF'}
                                                </span>
                                            </div>
                                            <h4 className="text-base font-semibold text-slate-900 leading-snug">{item.title}</h4>
                                            {item.description && (
                                                <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
                                            )}
                                            {Array.isArray(item.sections) && item.sections.length > 0 && (
                                                <div className="pt-1 flex flex-wrap gap-1.5">
                                                    {item.sections.map((sec, sIdx) => (
                                                        <span
                                                            key={sIdx}
                                                            className="inline-flex items-center gap-1 text-[10.5px] font-medium text-slate-600 bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded-md"
                                                        >
                                                            <Code2 size={11} className="text-[#5899B5]" />
                                                            {sec.heading}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="pt-2 border-t border-slate-100 space-y-2">
                                            {renderMaterialActions(item)}
                                            <div className="flex items-center justify-between gap-2 pt-1.5 text-[10.5px] text-slate-400">
                                                <span className="inline-flex items-center gap-1.5 font-semibold text-slate-500">
                                                    <img
                                                        src="/assets/cropped-New-logo-footer-270x270.png"
                                                        alt="Ethnotech"
                                                        className="w-4 h-4 rounded-sm object-contain"
                                                    />
                                                    Ethnotech Academy
                                                </span>
                                                <span>© All Rights Reserved</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 text-center shadow-xs">
                            <div className="max-w-md mx-auto space-y-3">
                                <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-200 text-[#5899B5] flex items-center justify-center mx-auto">
                                    <Library size={26} />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900">
                                    {courseName
                                        ? `No LMS Content Published for ${courseName} Yet`
                                        : 'No Course Mapped to Your Batch Yet'}
                                </h3>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    {courseName
                                        ? `Your batch (${batchName}) is mapped to ${courseName}. Once the SPOC uploads modules and study materials to this course, they will automatically appear here.`
                                        : `Once a course is mapped to your batch (${batchName}) and content is published to that course, all LMS study materials will automatically reflect here.`}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Dual-Mode In-App Study Reader & PDF Viewer Modal */}
            {previewItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/65 backdrop-blur-xs">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden">
                        {/* Modal Top Bar */}
                        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
                            <div className="min-w-0 flex-1 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 p-1.5 shadow-2xs shrink-0 flex items-center justify-center">
                                    <img
                                        src="/assets/cropped-New-logo-footer-270x270.png"
                                        alt="Ethnotech Logo"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5899B5]">
                                        Ethnotech Academy • {batchName} • {previewItem.module || 'Study Material'}
                                    </span>
                                    <h3 className="text-base font-bold text-slate-900 truncate">{previewItem.title}</h3>
                                </div>
                            </div>

                            {/* Switcher between Interactive Text Notes and PDF View */}
                            <div className="flex items-center gap-2 shrink-0">
                                {hasInlineNotes(previewItem) && previewItem.fileUrl && (
                                    <div className="inline-flex bg-slate-200/80 p-1 rounded-xl border border-slate-300/60">
                                        <button
                                            type="button"
                                            onClick={() => setPreviewMode('notes')}
                                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                                                previewMode === 'notes'
                                                    ? 'bg-white text-[#5899B5] shadow-2xs'
                                                    : 'text-slate-600 hover:text-slate-900'
                                            }`}
                                        >
                                            <BookOpen size={13} />
                                            In-Site Notes
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setPreviewMode('pdf')}
                                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                                                previewMode === 'pdf'
                                                    ? 'bg-white text-[#5899B5] shadow-2xs'
                                                    : 'text-slate-600 hover:text-slate-900'
                                            }`}
                                        >
                                            <FileText size={13} />
                                            PDF Document
                                        </button>
                                    </div>
                                )}

                                {previewItem.fileUrl && (
                                    <a
                                        href={resolveMaterialUrl(previewItem.fileUrl)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3.5 py-1.5 rounded-xl bg-[#5899B5] hover:bg-[#3D7690] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition"
                                    >
                                        <ExternalLink size={13} />
                                        Open PDF
                                    </a>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setPreviewItem(null)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body: Either In-Site Interactive Study Notes OR Embedded PDF Document */}
                        {previewMode === 'notes' && hasInlineNotes(previewItem) ? (
                            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 bg-slate-50/50">
                                {/* Overview Hero Card with Official Ethnotech Logo */}
                                <div className="bg-gradient-to-r from-[#5899B5] to-[#3D7690] rounded-2xl p-6 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                                    <div className="space-y-2 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/15 border border-white/20">
                                                <Sparkles size={12} />
                                                {previewItem.module || 'Module Guide'} • Interactive Study Notes
                                            </span>
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-900/25 border border-white/15 text-sky-100">
                                                © Ethnotech Academic Solutions • All Rights Reserved
                                            </span>
                                        </div>
                                        <h2 className="text-xl sm:text-2xl font-bold">{previewItem.title}</h2>
                                        {previewItem.description && (
                                            <p className="text-xs sm:text-sm text-sky-100/95 leading-relaxed max-w-3xl">
                                                {previewItem.description}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 bg-white/10 border border-white/20 rounded-2xl p-3 shrink-0 self-start sm:self-center">
                                        <div className="w-12 h-12 rounded-xl bg-white p-1.5 flex items-center justify-center shrink-0 shadow-xs">
                                            <img
                                                src="/assets/cropped-New-logo-footer-270x270.png"
                                                alt="Ethnotech Academy"
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <div className="text-left pr-1">
                                            <p className="text-xs font-extrabold tracking-wide uppercase text-white leading-tight">
                                                Ethnotech
                                            </p>
                                            <p className="text-[10px] font-medium text-sky-100">
                                                Academic Solutions
                                            </p>
                                            <p className="text-[9.5px] text-sky-200/90 mt-0.5">
                                                All Rights Reserved
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Structured Sections with Theory Bullet Points & Syntax-Highlighted Code Blocks */}
                                {Array.isArray(previewItem.sections) && previewItem.sections.length > 0 && (
                                    <div className="space-y-5">
                                        {previewItem.sections.map((sec, idx) => (
                                            <div
                                                key={idx}
                                                className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4"
                                            >
                                                <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                                                    <span className="w-7 h-7 rounded-lg bg-sky-50 border border-sky-200 text-[#5899B5] font-bold text-xs flex items-center justify-center shrink-0">
                                                        {idx + 1}
                                                    </span>
                                                    <h4 className="text-base font-bold text-slate-900">{sec.heading}</h4>
                                                </div>

                                                {Array.isArray(sec.points) && sec.points.length > 0 && (
                                                    <ul className="space-y-2.5 pl-1">
                                                        {sec.points.map((pt, pIdx) => (
                                                            <li
                                                                key={pIdx}
                                                                className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed"
                                                            >
                                                                <span className="w-1.5 h-1.5 rounded-full bg-[#5899B5] mt-2 shrink-0" />
                                                                <span>{pt}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}

                                                {sec.code && (
                                                    <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
                                                        <div className="px-4 py-2 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                                                            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-sky-400 font-mono">
                                                                <Code2 size={13} />
                                                                Verified C Program Example (GCC C11)
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleCopyCode(sec.code, idx)}
                                                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold transition cursor-pointer"
                                                            >
                                                                {copiedCodeIdx === idx ? (
                                                                    <>
                                                                        <Check size={12} className="text-emerald-400" />
                                                                        Copied
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Copy size={12} />
                                                                        Copy Code
                                                                    </>
                                                                )}
                                                            </button>
                                                        </div>
                                                        <pre className="p-4 text-xs sm:text-[13px] font-mono text-slate-100 overflow-x-auto leading-relaxed">
                                                            <code>{sec.code}</code>
                                                        </pre>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Plain / Markdown Text Content (for custom text notes typed by Trainer / Ops Admin) */}
                                {previewItem.textContent && (!previewItem.sections || previewItem.sections.length === 0) && (
                                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs">
                                        <div className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed font-sans">
                                            {previewItem.textContent}
                                        </div>
                                    </div>
                                )}

                                {/* Lab Exercises & Placement Viva Questions */}
                                {Array.isArray(previewItem.practice) && previewItem.practice.length > 0 && (
                                    <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 sm:p-6 space-y-3">
                                        <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                                            <HelpCircle size={17} className="text-amber-600 shrink-0" />
                                            Lab Exercises &amp; Placement Interview Questions
                                        </div>
                                        <ol className="space-y-2 pl-1">
                                            {previewItem.practice.map((q, qIdx) => (
                                                <li
                                                    key={qIdx}
                                                    className="flex items-start gap-2.5 text-xs sm:text-sm font-medium text-amber-950 leading-relaxed"
                                                >
                                                    <span className="font-bold text-amber-700 shrink-0">Q{qIdx + 1}.</span>
                                                    <span>{q}</span>
                                                </li>
                                            ))}
                                        </ol>
                                    </div>
                                )}

                                {/* In-Site Study Notes Official Logo & Copyright Card */}
                                <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
                                    <div className="flex items-center gap-3.5">
                                        <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 p-1.5 flex items-center justify-center shrink-0">
                                            <img
                                                src="/assets/cropped-New-logo-footer-270x270.png"
                                                alt="Ethnotech Academic Solutions"
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <div>
                                            <p className="text-xs sm:text-sm font-bold text-slate-900">
                                                © {new Date().getFullYear()} Ethnotech Academic Solutions Pvt. Ltd. • All Rights Reserved.
                                            </p>
                                            <p className="text-[11px] text-slate-500">
                                                Official Curriculum &amp; Lab Study Material. Unauthorized reproduction, sharing, or distribution is strictly prohibited.
                                            </p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-[#3D7690] text-[10.5px] font-bold uppercase tracking-wider shrink-0">
                                        Verified Curriculum
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 bg-slate-100 flex flex-col overflow-hidden">
                                <div className="flex-1 flex items-center justify-center">
                                    {previewLoading ? (
                                        <span className="text-sm font-medium text-slate-500">Loading document preview...</span>
                                    ) : (
                                        <iframe
                                            src={previewBlobUrl || resolveMaterialUrl(previewItem.fileUrl)}
                                            title={previewItem.title}
                                            className="w-full h-full border-0"
                                        />
                                    )}
                                </div>
                                <div className="px-5 py-2.5 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                                    <div className="flex items-center gap-2">
                                        <img
                                            src="/assets/cropped-New-logo-footer-270x270.png"
                                            alt="Ethnotech"
                                            className="w-5 h-5 object-contain rounded-sm"
                                        />
                                        <span className="font-semibold text-slate-800">
                                            © {new Date().getFullYear()} Ethnotech Academic Solutions Pvt. Ltd. All Rights Reserved.
                                        </span>
                                    </div>
                                    <span className="text-[11px] text-slate-400">
                                        Proprietary Study Material • For Authorized Students Only
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Page-Level Official Brand & Copyright Footer */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 p-1.5 flex items-center justify-center shrink-0">
                        <img
                            src="/assets/cropped-New-logo-footer-270x270.png"
                            alt="Ethnotech Logo"
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-800">
                            © {new Date().getFullYear()} Ethnotech Academic Solutions Pvt. Ltd. • All Rights Reserved.
                        </p>
                        <p className="text-[11px] text-slate-500">
                            All course notes, code labs, and PDF documents are proprietary intellectual property of Ethnotech Academy.
                        </p>
                    </div>
                </div>
                <span className="text-[10.5px] font-semibold text-[#5899B5] bg-sky-50 border border-sky-200 px-3 py-1 rounded-full shrink-0">
                    Ethnotech LMS &amp; Study Hub
                </span>
            </div>
        </div>
    );
};

export default StudentStudyMaterialTab;
