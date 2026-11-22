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
    X
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
    const [previewBlobUrl, setPreviewBlobUrl] = useState('');
    const [previewLoading, setPreviewLoading] = useState(false);

    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const serverOrigin = apiBase.replace(/\/api\/?$/, '');
    const resolveMaterialUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('/api/')) return `${serverOrigin}${url}`;
        if (url.startsWith('/uploads/')) return `${serverOrigin}${url}`;
        return url;
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
                    (item.description || '').toLowerCase().includes(q)
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
                    (item.description || '').toLowerCase().includes(q)
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
                                ? 'Search teacher uploaded files...'
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
                        {filteredTeacherMaterials.map((item, idx) => (
                            <div
                                key={item._id || idx}
                                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between gap-4"
                            >
                                <div className="space-y-2">
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
                                        </div>
                                        {item.uploadedAt && (
                                            <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                                                <Calendar size={11} />
                                                {new Date(item.uploadedAt).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                                    {item.description && (
                                        <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
                                    )}
                                </div>
                                {item.fileUrl && (
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setPreviewItem(item)}
                                            className="flex-1 py-2.5 px-3 rounded-xl bg-[#5899B5] hover:bg-[#49849E] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                                        >
                                            <BookOpen size={14} />
                                            View Material
                                        </button>
                                        <a
                                            href={resolveMaterialUrl(item.fileUrl)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title="Open in new tab"
                                            className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center transition"
                                        >
                                            <ExternalLink size={14} />
                                        </a>
                                    </div>
                                )}
                            </div>
                        ))}
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
                    {/* Mapped Course Info Card (if a course is mapped to this student's batch) */}
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
                            {filteredLmsMaterials.map((item, idx) => (
                                <div
                                    key={item._id || idx}
                                    className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between gap-4"
                                >
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-sky-50 text-sky-700 border border-sky-200">
                                                {item.module || 'Course Module'}
                                            </span>
                                            <span className="text-[11px] font-medium text-slate-400">
                                                {item.type || 'PDF'}
                                            </span>
                                        </div>
                                        <h4 className="text-base font-semibold text-slate-900">{item.title}</h4>
                                        {item.description && (
                                            <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
                                        )}
                                    </div>
                                    {item.fileUrl && (
                                        <a
                                            href={resolveMaterialUrl(item.fileUrl)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full py-2.5 px-4 rounded-xl bg-[#5899B5] hover:bg-[#49849E] text-white text-xs font-semibold flex items-center justify-center gap-2 transition"
                                        >
                                            <FileText size={14} />
                                            View Course Content
                                        </a>
                                    )}
                                </div>
                            ))}
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

            {/* In-App PDF / Document Viewer Modal */}
            {previewItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-5xl h-[88vh] flex flex-col overflow-hidden">
                        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-4">
                            <div className="min-w-0">
                                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5899B5]">
                                    {batchName} • {previewItem.module || 'Study Material'}
                                </span>
                                <h3 className="text-base font-semibold text-slate-900 truncate">{previewItem.title}</h3>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <a
                                    href={resolveMaterialUrl(previewItem.fileUrl)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3.5 py-1.5 rounded-xl bg-[#5899B5] hover:bg-[#49849E] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition"
                                >
                                    <ExternalLink size={13} />
                                    Open in New Tab
                                </a>
                                <button
                                    type="button"
                                    onClick={() => setPreviewItem(null)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 bg-slate-100 flex items-center justify-center">
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
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentStudyMaterialTab;
