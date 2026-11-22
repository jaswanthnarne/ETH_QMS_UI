import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import {
    BookOpen,
    UploadCloud,
    Plus,
    Search,
    FileText,
    Link2,
    Trash2,
    Edit2,
    ExternalLink,
    Users,
    FolderOpen,
    Loader2,
    X,
    Layers,
    Calendar
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useCollegeStore from '../../store/collegeStore';
import { AlertModal, ConfirmModal } from '../../components/Modals';

const MATERIAL_TYPES = ['PDF Notes', 'Slides', 'Assignments', 'Reference'];

const TrainerStudyMaterials = () => {
    const { token } = useAuthStore();
    const { selectedCollegeId } = useCollegeStore();
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const serverOrigin = apiBase.replace(/\/api\/?$/, '');

    const resolveMaterialUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('/api/')) return `${serverOrigin}${url}`;
        if (url.startsWith('/uploads/')) return `${serverOrigin}${url}`;
        return url;
    };

    const [batches, setBatches] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedBatchFilter, setSelectedBatchFilter] = useState('all');
    const [selectedTypeFilter, setSelectedTypeFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    // Upload / Edit Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [uploadMode, setUploadMode] = useState('file'); // 'file' | 'url'
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        batchId: '',
        title: '',
        module: 'Module 1',
        type: 'PDF Notes',
        description: '',
        fileUrl: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);

    const [alertState, setAlertState] = useState({ open: false, title: '', message: '', type: 'info' });
    const [confirmState, setConfirmState] = useState({ open: false });
    const [previewItem, setPreviewItem] = useState(null);
    const [previewBlobUrl, setPreviewBlobUrl] = useState('');
    const [previewLoading, setPreviewLoading] = useState(false);

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

    const fetchMaterials = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (selectedCollegeId) params.set('collegeId', selectedCollegeId);
            const res = await axios.get(`${apiBase}/trainer/materials?${params.toString()}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                const fetchedBatches = res.data.data?.batches || [];
                setBatches(fetchedBatches);
                setMaterials(res.data.data?.materials || []);
            }
        } catch (err) {
            console.error('Failed to load trainer study materials:', err);
        } finally {
            setLoading(false);
        }
    }, [apiBase, token, selectedCollegeId]);

    useEffect(() => {
        if (token) fetchMaterials();
    }, [token, fetchMaterials]);

    const openCreateModal = () => {
        setEditingItem(null);
        setUploadMode('file');
        setSelectedFile(null);
        setFormData({
            batchId: selectedBatchFilter !== 'all' ? selectedBatchFilter : (batches[0]?._id || 'all'),
            title: '',
            module: 'Module 1',
            type: 'PDF Notes',
            description: '',
            fileUrl: ''
        });
        setModalOpen(true);
    };

    const openEditModal = (item) => {
        setEditingItem(item);
        setUploadMode('url');
        setSelectedFile(null);
        setFormData({
            batchId: item.batchId,
            title: item.title || '',
            module: item.module || 'General',
            type: item.type || 'PDF Notes',
            description: item.description || '',
            fileUrl: item.fileUrl || ''
        });
        setModalOpen(true);
    };

    const handleSaveMaterial = async (e) => {
        e.preventDefault();
        if (!formData.title.trim()) {
            setAlertState({ open: true, title: 'Missing Title', message: 'Please enter a title for the study material.', type: 'warning' });
            return;
        }
        if (!formData.batchId) {
            setAlertState({ open: true, title: 'Select Batch', message: 'Please select a target batch.', type: 'warning' });
            return;
        }
        if (uploadMode === 'file' && !selectedFile && !editingItem) {
            setAlertState({ open: true, title: 'File Required', message: 'Please choose a file to upload or switch to External Link mode.', type: 'warning' });
            return;
        }
        if (uploadMode === 'url' && !formData.fileUrl.trim()) {
            setAlertState({ open: true, title: 'URL Required', message: 'Please provide a valid resource link.', type: 'warning' });
            return;
        }

        try {
            setSubmitting(true);
            const payload = new FormData();
            payload.append('batchId', formData.batchId);
            payload.append('title', formData.title.trim());
            payload.append('module', formData.module.trim() || 'General');
            payload.append('type', formData.type);
            payload.append('description', formData.description.trim());
            if (selectedCollegeId) payload.append('collegeId', selectedCollegeId);

            if (uploadMode === 'file' && selectedFile) {
                payload.append('file', selectedFile);
            } else if (formData.fileUrl.trim()) {
                payload.append('fileUrl', formData.fileUrl.trim());
            }

            if (editingItem) {
                await axios.put(
                    `${apiBase}/trainer/materials/${editingItem.batchId}/${editingItem._id}`,
                    payload,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setAlertState({ open: true, title: 'Material Updated', message: 'Study material details updated for students.', type: 'success' });
            } else {
                const res = await axios.post(`${apiBase}/trainer/materials`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAlertState({
                    open: true,
                    title: 'Material Published',
                    message: res.data?.message || 'Study material uploaded and visible to students.',
                    type: 'success'
                });
            }

            setModalOpen(false);
            fetchMaterials();
        } catch (err) {
            setAlertState({
                open: true,
                title: 'Upload Failed',
                message: err.response?.data?.error || 'Could not save study material.',
                type: 'error'
            });
        } finally {
            setSubmitting(false);
        }
    };

    const confirmDeleteMaterial = (item) => {
        setConfirmState({
            open: true,
            title: 'Delete Study Material',
            message: `Remove "${item.title}" from ${item.batchName}? Students in this batch will no longer see it.`,
            type: 'danger',
            confirmText: 'Delete Material',
            onConfirm: async () => {
                try {
                    await axios.delete(`${apiBase}/trainer/materials/${item.batchId}/${item._id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    fetchMaterials();
                } catch (err) {
                    setAlertState({
                        open: true,
                        title: 'Delete Failed',
                        message: err.response?.data?.error || 'Could not remove material.',
                        type: 'error'
                    });
                }
            }
        });
    };

    const filteredMaterials = useMemo(() => {
        return materials
            .filter((m) => !String(m.fileUrl || '').includes('qms_study_materials'))
            .filter((m) => {
                if (selectedBatchFilter !== 'all' && m.batchId?.toString() !== selectedBatchFilter) return false;
                if (selectedTypeFilter !== 'All' && m.type !== selectedTypeFilter) return false;
                if (searchQuery.trim()) {
                    const q = searchQuery.toLowerCase();
                    return (
                        (m.title || '').toLowerCase().includes(q) ||
                        (m.module || '').toLowerCase().includes(q) ||
                        (m.batchName || '').toLowerCase().includes(q) ||
                        (m.description || '').toLowerCase().includes(q)
                    );
                }
                return true;
            });
    }, [materials, selectedBatchFilter, selectedTypeFilter, searchQuery]);

    const pdfCount = materials.filter((m) => m.type === 'PDF Notes').length;
    const slidesAndAssignCount = materials.filter((m) => m.type === 'Slides' || m.type === 'Assignments').length;

    return (
        <div className="space-y-6">
            {/* Top Banner Header */}
            <div className="bg-gradient-to-r from-[#5899B5] to-[#3D7690] rounded-2xl text-white p-6 sm:p-8 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div className="space-y-1.5">
                    <span className="inline-flex items-center gap-1.5 bg-white/15 border border-white/20 rounded-full px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wider">
                        <UploadCloud size={13} />
                        Trainer Classroom Hub
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                        Batch Study Materials &amp; Notes
                    </h1>
                    <p className="text-blue-100/90 text-xs sm:text-sm max-w-2xl">
                        Upload lecture PDFs, slides, assignments, and reference links for your assigned batches. Materials appear immediately in your students&apos; &ldquo;Uploaded by Teacher&rdquo; study tab.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={openCreateModal}
                    disabled={batches.length === 0}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-[#3D7690] hover:bg-blue-50 font-semibold text-sm shadow-sm transition cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Plus size={18} />
                    Upload Study Material
                </button>
            </div>

            {/* Summary KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Uploaded</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{materials.length}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Published resources</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Assigned Batches</p>
                    <p className="text-2xl font-bold text-[#5899B5] mt-1">{batches.length}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Active cohorts</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">PDF Notes</p>
                    <p className="text-2xl font-bold text-emerald-600 mt-1">{pdfCount}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Handouts &amp; guides</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Slides &amp; Tasks</p>
                    <p className="text-2xl font-bold text-indigo-600 mt-1">{slidesAndAssignCount}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Decks &amp; assignments</p>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                    {/* Batch Filter */}
                    <select
                        value={selectedBatchFilter}
                        onChange={(e) => setSelectedBatchFilter(e.target.value)}
                        className="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-semibold text-slate-700 focus:border-[#5899B5] outline-none"
                    >
                        <option value="all">All Assigned Batches ({batches.length})</option>
                        {batches.map((b) => (
                            <option key={b._id} value={b._id}>
                                {b.batchName} {b.courseCode ? `• ${b.courseCode}` : ''} ({b.materialsCount})
                            </option>
                        ))}
                    </select>

                    {/* Type Filter Pills */}
                    <div className="flex flex-wrap items-center gap-1.5">
                        {['All', ...MATERIAL_TYPES].map((type) => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => setSelectedTypeFilter(type)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                                    selectedTypeFilter === type
                                        ? 'bg-[#5899B5] text-white border-[#5899B5]'
                                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search Input */}
                <div className="relative w-full lg:w-72">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by title, module, batch..."
                        className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#5899B5] outline-none"
                    />
                </div>
            </div>

            {/* Materials List / Empty State */}
            {loading ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center gap-3 text-slate-500">
                    <Loader2 size={28} className="animate-spin text-[#5899B5]" />
                    <span className="text-sm font-medium">Loading batch study materials...</span>
                </div>
            ) : filteredMaterials.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-10 sm:p-14 text-center shadow-xs">
                    <div className="max-w-md mx-auto space-y-3">
                        <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-200 text-[#5899B5] flex items-center justify-center mx-auto">
                            <FolderOpen size={26} />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900">
                            {materials.length === 0 ? 'No Study Materials Uploaded Yet' : 'No Matching Study Materials'}
                        </h3>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            {batches.length === 0
                                ? 'You do not have any batches assigned yet. Once a batch is assigned to you, you can upload PDFs, slides, and notes here.'
                                : 'Upload PDF notes, presentation slides, assignments, or reference links to share directly with students in your batches.'}
                        </p>
                        {batches.length > 0 && (
                            <div className="pt-2">
                                <button
                                    type="button"
                                    onClick={openCreateModal}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5899B5] hover:bg-[#49849E] text-white text-sm font-semibold transition cursor-pointer"
                                >
                                    <Plus size={16} />
                                    Upload First Material
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filteredMaterials.map((item) => (
                        <div
                            key={`${item.batchId}-${item._id}`}
                            className="bg-white border border-slate-200 hover:border-[#5899B5]/60 rounded-2xl p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between gap-4"
                        >
                            <div className="space-y-3">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex flex-wrap items-center gap-1.5">
                                        <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold uppercase tracking-wider bg-sky-50 text-sky-700 border border-sky-200">
                                            {item.type || 'PDF Notes'}
                                        </span>
                                        <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-slate-100 text-slate-700">
                                            {item.module || 'General'}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-1 shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => openEditModal(item)}
                                            title="Edit material"
                                            className="p-1.5 rounded-lg text-slate-400 hover:text-[#5899B5] hover:bg-slate-100 transition cursor-pointer"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => confirmDeleteMaterial(item)}
                                            title="Delete material"
                                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="text-base font-semibold text-slate-900 leading-snug">
                                    {item.title}
                                </h3>
                                {item.description && (
                                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                                        {item.description}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-3 pt-3 border-t border-slate-100">
                                <div className="flex items-center justify-between text-[11.5px] text-slate-500 font-medium">
                                    <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700 truncate">
                                        <Users size={13} className="text-[#5899B5] shrink-0" />
                                        {item.batchName}
                                    </span>
                                    {item.uploadedAt && (
                                        <span className="inline-flex items-center gap-1 text-slate-400 shrink-0">
                                            <Calendar size={12} />
                                            {new Date(item.uploadedAt).toLocaleDateString()}
                                        </span>
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
                                            View Document
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
                        </div>
                    ))}
                </div>
            )}

            {/* Upload / Edit Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-200 text-[#5899B5] flex items-center justify-center">
                                    <BookOpen size={18} />
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-slate-900">
                                        {editingItem ? 'Edit Study Material' : 'Upload Batch Study Material'}
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        Shared directly under students&apos; &ldquo;Uploaded by Teacher&rdquo; section
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setModalOpen(false)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveMaterial} className="p-6 space-y-4 overflow-y-auto">
                            {/* Target Batch */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                                    Target Batch *
                                </label>
                                <select
                                    value={formData.batchId}
                                    disabled={!!editingItem}
                                    onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-800 focus:bg-white focus:border-[#5899B5] outline-none disabled:opacity-60"
                                >
                                    {!editingItem && batches.length > 1 && (
                                        <option value="all">All My Assigned Batches ({batches.length} Batches)</option>
                                    )}
                                    {batches.map((b) => (
                                        <option key={b._id} value={b._id}>
                                            {b.batchName} {b.courseName ? `— ${b.courseName}` : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Material Title */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                                    Material Title *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g., Module 1: Java OOPs & Collections Handout"
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:bg-white focus:border-[#5899B5] outline-none"
                                />
                            </div>

                            {/* Module & Type Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                                        Module / Unit Tag
                                    </label>
                                    <div className="relative">
                                        <Layers size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            value={formData.module}
                                            onChange={(e) => setFormData({ ...formData, module: e.target.value })}
                                            placeholder="e.g., Module 1 / Week 2"
                                            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:bg-white focus:border-[#5899B5] outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                                        Material Type
                                    </label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-800 focus:bg-white focus:border-[#5899B5] outline-none"
                                    >
                                        {MATERIAL_TYPES.map((t) => (
                                            <option key={t} value={t}>
                                                {t}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Upload Source Switcher: File vs External Link */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                        Resource File or Link *
                                    </label>
                                    <div className="inline-flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold">
                                        <button
                                            type="button"
                                            onClick={() => setUploadMode('file')}
                                            className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                                                uploadMode === 'file' ? 'bg-white text-[#5899B5] shadow-2xs' : 'text-slate-500'
                                            }`}
                                        >
                                            Upload File
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setUploadMode('url')}
                                            className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                                                uploadMode === 'url' ? 'bg-white text-[#5899B5] shadow-2xs' : 'text-slate-500'
                                            }`}
                                        >
                                            External Link
                                        </button>
                                    </div>
                                </div>

                                {uploadMode === 'file' ? (
                                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-[#5899B5] rounded-xl p-5 bg-slate-50/70 cursor-pointer transition text-center">
                                        <UploadCloud size={24} className="text-[#5899B5] mb-1.5" />
                                        <span className="text-xs font-semibold text-slate-700">
                                            {selectedFile ? selectedFile.name : 'Click to select PDF, PPT, DOC, or ZIP (up to 15 MB)'}
                                        </span>
                                        {selectedFile && (
                                            <span className="text-[11px] text-emerald-600 font-medium mt-0.5">
                                                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB ready to upload
                                            </span>
                                        )}
                                        <input
                                            type="file"
                                            accept=".pdf,.ppt,.pptx,.doc,.docx,.zip,.txt,.png,.jpg,.jpeg"
                                            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                            className="hidden"
                                        />
                                    </label>
                                ) : (
                                    <div className="relative">
                                        <Link2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="url"
                                            value={formData.fileUrl}
                                            onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                                            placeholder="https://drive.google.com/... or direct PDF link"
                                            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:bg-white focus:border-[#5899B5] outline-none"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                                    Description / Study Instructions
                                </label>
                                <textarea
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Add key topics covered or instructions for students..."
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:bg-white focus:border-[#5899B5] outline-none resize-none"
                                />
                            </div>

                            <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-5 py-2.5 rounded-xl bg-[#5899B5] hover:bg-[#49849E] text-white text-xs font-semibold inline-flex items-center gap-2 transition cursor-pointer disabled:opacity-60"
                                >
                                    {submitting ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
                                    {editingItem ? 'Save Changes' : 'Publish Material'}
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

            <ConfirmModal
                isOpen={confirmState.open}
                onClose={() => setConfirmState({ ...confirmState, open: false })}
                onConfirm={confirmState.onConfirm}
                title={confirmState.title}
                message={confirmState.message}
                type={confirmState.type}
                confirmText={confirmState.confirmText}
            />

            {/* In-App PDF / Document Viewer Modal */}
            {previewItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-5xl h-[88vh] flex flex-col overflow-hidden">
                        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-4">
                            <div className="min-w-0">
                                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5899B5]">
                                    {previewItem.batchName} • {previewItem.module || 'General'}
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

export default TrainerStudyMaterials;

