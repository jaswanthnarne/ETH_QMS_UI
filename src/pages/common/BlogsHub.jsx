import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
    BookOpen,
    PenTool,
    Bold,
    Italic,
    Underline,
    Strikethrough,
    Heading1,
    Heading2,
    Heading3,
    Quote,
    Code,
    List,
    ListOrdered,
    Link as LinkIcon,
    Image as ImageIcon,
    Minus,
    Sparkles,
    Search,
    School,
    Layers,
    User,
    Clock,
    ThumbsUp,
    MessageSquare,
    Pin,
    Edit2,
    Trash2,
    ArrowLeft,
    Check,
    X,
    Loader2,
    Send,
    Type,
    Upload,
    Globe,
    RotateCcw,
    FileText
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useStudentAuthStore from '../../store/studentAuthStore';
import useCollegeStore from '../../store/collegeStore';
import { AlertModal, ConfirmModal } from '../../components/Modals';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const BLOG_CATEGORIES = [
    'Engineering & Code',
    'Placement Prep',
    'Interview Experience',
    'Study Guide',
    'System Design',
    'Campus Announcement',
    'Career Advice'
];

const FONT_OPTIONS = [
    { id: 'serif', label: 'Medium Editorial Serif (Lora)', className: 'medium-font-serif' },
    { id: 'sans', label: 'Modern Clean Sans (Inter)', className: 'medium-font-sans' },
    { id: 'mono', label: 'Technical Code Mono (JetBrains)', className: 'medium-font-mono' }
];

/* Custom Architectural Vector SVG for Editorial Blogs Header */
const EditorialIllustrationSvg = () => (
    <svg
        width="148"
        height="86"
        viewBox="0 0 148 86"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="hidden md:block shrink-0 select-none"
        aria-hidden="true"
    >
        {/* Background Editorial Page */}
        <rect x="12" y="14" width="92" height="62" rx="8" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
        {/* Foreground Article Sheet */}
        <rect x="22" y="8" width="94" height="64" rx="8" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.6" />
        {/* Serif Article Title Lines */}
        <rect x="32" y="18" width="56" height="6" rx="3" fill="#0F172A" />
        <rect x="32" y="28" width="40" height="4" rx="2" fill="#5899B5" />
        {/* Pull Quote Accent Bar */}
        <line x1="33" y1="38" x2="33" y2="52" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="39" y="39" width="64" height="3.5" rx="1.75" fill="#64748B" />
        <rect x="39" y="46" width="50" height="3.5" rx="1.75" fill="#94A3B8" />
        {/* Bottom Byline Pills */}
        <circle cx="36" cy="61" r="4" fill="#5899B5" />
        <rect x="44" y="59" width="28" height="4" rx="2" fill="#334155" />
        <rect x="78" y="59" width="24" height="4" rx="2" fill="#CBD5E1" />
        {/* Editorial Fountain Nib Badge */}
        <circle cx="118" cy="54" r="18" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
        <path
            d="M118 42L125 55L118 64L111 55L118 42Z"
            fill="#5899B5"
            fillOpacity="0.16"
            stroke="#5899B5"
            strokeWidth="1.5"
            strokeLinejoin="round"
        />
        <circle cx="118" cy="53" r="2" fill="#1E293B" />
        <line x1="118" y1="42" x2="118" y2="51" stroke="#1E293B" strokeWidth="1.5" />
    </svg>
);

const getFontClass = (fontStyle) => {
    if (fontStyle === 'sans') return 'medium-font-sans';
    if (fontStyle === 'mono') return 'medium-font-mono';
    return 'medium-font-serif';
};

const stripHtmlPreview = (html = '', maxLen = 190) => {
    const text = String(html)
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/\s+/g, ' ')
        .trim();
    if (text.length <= maxLen) return text;
    return `${text.slice(0, maxLen).trim()}…`;
};

const formatScopeBadges = (blog) => {
    if (blog.isGlobal) {
        return [{ label: 'All Colleges & Batches', type: 'global' }];
    }
    const badges = [];
    if (Array.isArray(blog.targetBatches) && blog.targetBatches.length > 0) {
        blog.targetBatches.slice(0, 3).forEach((b) => {
            const bName = b.batchName || 'Batch';
            const cCode = b.collegeId?.code || b.collegeId?.name || '';
            badges.push({
                label: cCode ? `${bName} (${cCode})` : bName,
                type: 'batch'
            });
        });
        if (blog.targetBatches.length > 3) {
            badges.push({ label: `+${blog.targetBatches.length - 3} more batches`, type: 'batch' });
        }
    } else if (Array.isArray(blog.targetColleges) && blog.targetColleges.length > 0) {
        blog.targetColleges.slice(0, 2).forEach((c) => {
            badges.push({ label: `${c.name || c.code} (All Batches)`, type: 'college' });
        });
        if (blog.targetColleges.length > 2) {
            badges.push({ label: `+${blog.targetColleges.length - 2} colleges`, type: 'college' });
        }
    }
    return badges.length > 0 ? badges : [{ label: 'Scoped Post', type: 'batch' }];
};

const BlogsHub = ({ isStudentView = false }) => {
    const { token: adminToken, user } = useAuthStore();
    const { token: studentToken, student } = useStudentAuthStore();
    const { selectedCollegeId: storeCollegeId, selectedCollegeName } = useCollegeStore();
    const { collegeId: paramCollegeId } = useParams();
    const location = useLocation();

    const activeToken = isStudentView ? studentToken : adminToken || studentToken;
    const isStudent = isStudentView || (!user && Boolean(student));

    const urlCollegeMatch = location.pathname.match(/^\/college\/([a-f0-9]{24})/i);
    const urlCollegeId = paramCollegeId || (urlCollegeMatch ? urlCollegeMatch[1] : null);
    const lockedCollegeId =
        urlCollegeId || (!isStudent && user?.role === 'college_admin' ? user.collegeId : null);

    // View mode: 'feed' | 'read' | 'write'
    const [viewMode, setViewMode] = useState('feed');
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [contextData, setContextData] = useState(null);

    // Feed Filters
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [authorTypeFilter, setAuthorTypeFilter] = useState('all'); // 'all' | 'trainer' | 'admin' | 'student' | 'mine'
    const [filterCollegeId, setFilterCollegeId] = useState(lockedCollegeId || storeCollegeId || 'all');
    const [filterBatchId, setFilterBatchId] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Active Blog being read or edited
    const [activeBlog, setActiveBlog] = useState(null);
    const [editingBlog, setEditingBlog] = useState(null);
    const [commentText, setCommentText] = useState('');
    const [commentSubmitting, setCommentSubmitting] = useState(false);

    // Composer State
    const editorRef = useRef(null);
    const [composerData, setComposerData] = useState({
        title: '',
        subtitle: '',
        category: 'Engineering & Code',
        fontStyle: 'serif',
        coverImage: '',
        images: [],
        tagsText: '',
        isGlobal: false,
        targetColleges: [],
        targetBatches: [],
        isPinned: false,
        status: 'published'
    });
    const [imageUrlDraft, setImageUrlDraft] = useState('');
    const [lightboxImage, setLightboxImage] = useState(null);
    const [savingBlog, setSavingBlog] = useState(false);

    // Modals
    const [alertState, setAlertState] = useState({ open: false, title: '', message: '', type: 'info' });
    const [confirmState, setConfirmState] = useState({
        open: false,
        title: '',
        message: '',
        onConfirm: null
    });

    const headers = useMemo(() => ({ Authorization: `Bearer ${activeToken}` }), [activeToken]);

    useEffect(() => {
        if (lockedCollegeId) {
            setFilterCollegeId(lockedCollegeId);
        } else if (storeCollegeId && !isStudent) {
            setFilterCollegeId(storeCollegeId);
        } else {
            setFilterCollegeId('all');
        }
        setFilterBatchId('all');
    }, [lockedCollegeId, storeCollegeId, isStudent]);

    // Fetch Authoring Context (actor details + allowed target colleges & batches)
    const fetchContext = useCallback(async () => {
        if (!activeToken) return;
        try {
            const res = await axios.get(`${API}/blogs/context`, { headers });
            if (res.data.success) {
                setContextData(res.data.data);
            }
        } catch (err) {
            console.error('Failed to load blog context:', err);
        }
    }, [activeToken, headers]);

    useEffect(() => {
        fetchContext();
    }, [fetchContext]);

    // Fetch Scoped Blogs
    const fetchBlogs = useCallback(async () => {
        if (!activeToken) return;
        setLoading(true);
        try {
            const params = new URLSearchParams();
            const targetCol = lockedCollegeId || (filterCollegeId !== 'all' ? filterCollegeId : '');
            if (targetCol && !isStudent) params.set('collegeId', targetCol);
            if (filterBatchId !== 'all' && !isStudent) params.set('batchId', filterBatchId);
            if (selectedCategory !== 'all') params.set('category', selectedCategory);
            if (authorTypeFilter !== 'all') params.set('authorType', authorTypeFilter);
            if (searchQuery.trim()) params.set('search', searchQuery.trim());

            const res = await axios.get(`${API}/blogs?${params.toString()}`, { headers });
            if (res.data.success) {
                setBlogs(res.data.data || []);
            }
        } catch (err) {
            console.error('Failed to load blogs:', err);
        } finally {
            setLoading(false);
        }
    }, [
        activeToken,
        headers,
        lockedCollegeId,
        filterCollegeId,
        filterBatchId,
        selectedCategory,
        authorTypeFilter,
        searchQuery,
        isStudent
    ]);

    useEffect(() => {
        fetchBlogs();
    }, [fetchBlogs]);

    const actor = contextData?.actor;
    const availableColleges = contextData?.colleges || [];
    const availableBatches = contextData?.batches || [];

    const visibleFilterBatches = useMemo(() => {
        const targetCol = lockedCollegeId || (filterCollegeId !== 'all' ? filterCollegeId : '');
        if (!targetCol) return availableBatches;
        return availableBatches.filter(
            (b) => (b.collegeId?._id || b.collegeId)?.toString() === targetCol.toString()
        );
    }, [availableBatches, lockedCollegeId, filterCollegeId]);

    const visibleComposerBatches = useMemo(() => {
        if (composerData.targetColleges.length === 0) return availableBatches;
        return availableBatches.filter((b) =>
            composerData.targetColleges.includes((b.collegeId?._id || b.collegeId)?.toString())
        );
    }, [availableBatches, composerData.targetColleges]);

    // Open Composer for New or Existing Blog
    const openComposer = (blogToEdit = null) => {
        setImageUrlDraft('');
        if (blogToEdit) {
            setEditingBlog(blogToEdit);
            setComposerData({
                title: blogToEdit.title || '',
                subtitle: blogToEdit.subtitle || '',
                category: blogToEdit.category || 'Engineering & Code',
                fontStyle: blogToEdit.fontStyle || 'serif',
                coverImage: blogToEdit.coverImage || '',
                images: Array.isArray(blogToEdit.images)
                    ? blogToEdit.images.map((img) => ({
                          url: img.url || img,
                          caption: img.caption || ''
                      }))
                    : [],
                tagsText: Array.isArray(blogToEdit.tags) ? blogToEdit.tags.join(', ') : '',
                isGlobal: Boolean(blogToEdit.isGlobal),
                targetColleges: (blogToEdit.targetColleges || []).map((c) => (c._id || c).toString()),
                targetBatches: (blogToEdit.targetBatches || []).map((b) => (b._id || b).toString()),
                isPinned: Boolean(blogToEdit.isPinned),
                status: blogToEdit.status || 'published'
            });
            setViewMode('write');
            setTimeout(() => {
                if (editorRef.current) {
                    editorRef.current.innerHTML = blogToEdit.content || '';
                }
            }, 30);
        } else {
            setEditingBlog(null);
            const defaultColleges = lockedCollegeId
                ? [lockedCollegeId]
                : availableColleges.length === 1
                    ? [availableColleges[0]._id.toString()]
                    : [];
            const defaultBatches =
                actor?.role === 'student' && actor.batchId
                    ? [actor.batchId.toString()]
                    : actor?.role === 'trainer'
                        ? availableBatches.map((b) => b._id.toString())
                        : [];

            setComposerData({
                title: '',
                subtitle: '',
                category: 'Engineering & Code',
                fontStyle: 'serif',
                coverImage: '',
                images: [],
                tagsText: '',
                isGlobal: Boolean(contextData?.canSelectGlobal && !lockedCollegeId),
                targetColleges: defaultColleges,
                targetBatches: defaultBatches,
                isPinned: false,
                status: 'published'
            });
            setViewMode('write');
            setTimeout(() => {
                if (editorRef.current) {
                    editorRef.current.innerHTML =
                        '<p>Start writing your story here… Select any text or use the editorial toolbar above for headings, quotes, code blocks, images, and formatting.</p>';
                }
            }, 30);
        }
    };

    // Rich Text Editor Commands
    const execFormat = (command, value = null) => {
        if (!editorRef.current) return;
        editorRef.current.focus();
        document.execCommand(command, false, value);
    };

    const insertHtmlBlock = (htmlSnippet) => {
        if (!editorRef.current) return;
        editorRef.current.focus();
        document.execCommand('insertHTML', false, htmlSnippet);
    };

    const handleInsertLink = () => {
        const url = window.prompt('Enter the URL (https://...):', 'https://');
        if (url && url !== 'https://') {
            execFormat('createLink', url);
        }
    };

    const handleInlineImageUpload = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        files.forEach((file) => {
            if (file.size > 3 * 1024 * 1024) {
                setAlertState({
                    open: true,
                    title: 'Image Too Large',
                    message: `"${file.name}" exceeds 3 MB. Please choose a smaller image.`,
                    type: 'warning'
                });
                return;
            }
            const reader = new FileReader();
            reader.onload = () => {
                const dataUrl = String(reader.result || '');
                insertHtmlBlock(`<img src="${dataUrl}" alt="${file.name}" /><p><br/></p>`);
                setComposerData((prev) => ({
                    ...prev,
                    coverImage: prev.coverImage || dataUrl,
                    images: [...(prev.images || []), { url: dataUrl, caption: '' }]
                }));
            };
            reader.readAsDataURL(file);
        });
        e.target.value = '';
    };

    const handleGalleryFilesUpload = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        files.forEach((file) => {
            if (file.size > 3 * 1024 * 1024) {
                setAlertState({
                    open: true,
                    title: 'Image Too Large',
                    message: `"${file.name}" exceeds 3 MB. Please choose a smaller image.`,
                    type: 'warning'
                });
                return;
            }
            const reader = new FileReader();
            reader.onload = () => {
                const dataUrl = String(reader.result || '');
                setComposerData((prev) => ({
                    ...prev,
                    coverImage: prev.coverImage || dataUrl,
                    images: [...(prev.images || []), { url: dataUrl, caption: '' }]
                }));
            };
            reader.readAsDataURL(file);
        });
        e.target.value = '';
    };

    const handleAddGalleryImageByUrl = () => {
        const trimmed = imageUrlDraft.trim();
        if (!trimmed) return;
        setComposerData((prev) => ({
            ...prev,
            coverImage: prev.coverImage || trimmed,
            images: [...(prev.images || []), { url: trimmed, caption: '' }]
        }));
        setImageUrlDraft('');
    };

    const handleUpdateImageCaption = (idx, caption) => {
        setComposerData((prev) => ({
            ...prev,
            images: (prev.images || []).map((img, i) => (i === idx ? { ...img, caption } : img))
        }));
    };

    const handleRemoveGalleryImage = (idx) => {
        setComposerData((prev) => {
            const removed = prev.images?.[idx];
            const nextImages = (prev.images || []).filter((_, i) => i !== idx);
            const nextCover =
                prev.coverImage === removed?.url ? nextImages[0]?.url || '' : prev.coverImage;
            return {
                ...prev,
                coverImage: nextCover,
                images: nextImages
            };
        });
    };

    const handleInsertGalleryImageToEditor = (img) => {
        const captionHtml = img.caption
            ? `<p><em>${img.caption}</em></p>`
            : '';
        insertHtmlBlock(`<img src="${img.url}" alt="${img.caption || 'Blog image'}" />${captionHtml}<p><br/></p>`);
    };

    const handleCoverImageFile = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 3 * 1024 * 1024) {
            setAlertState({
                open: true,
                title: 'Image Too Large',
                message: 'Cover image must be under 3 MB.',
                type: 'warning'
            });
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            setComposerData((prev) => ({ ...prev, coverImage: String(reader.result || '') }));
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    const toggleTargetCollege = (collegeId) => {
        setComposerData((prev) => {
            const exists = prev.targetColleges.includes(collegeId);
            const nextColleges = exists
                ? prev.targetColleges.filter((id) => id !== collegeId)
                : [...prev.targetColleges, collegeId];
            return {
                ...prev,
                isGlobal: false,
                targetColleges: nextColleges
            };
        });
    };

    const toggleTargetBatch = (batchId) => {
        setComposerData((prev) => {
            const exists = prev.targetBatches.includes(batchId);
            const nextBatches = exists
                ? prev.targetBatches.filter((id) => id !== batchId)
                : [...prev.targetBatches, batchId];
            return {
                ...prev,
                isGlobal: false,
                targetBatches: nextBatches
            };
        });
    };

    const handlePublishOrSave = async (targetStatus = 'published') => {
        const htmlContent = editorRef.current ? editorRef.current.innerHTML.trim() : '';
        if (!composerData.title.trim()) {
            setAlertState({
                open: true,
                title: 'Title Required',
                message: 'Please enter a headline for your blog story.',
                type: 'warning'
            });
            return;
        }
        if (!htmlContent || htmlContent === '<br>') {
            setAlertState({
                open: true,
                title: 'Content Required',
                message: 'Please write some content for your story before publishing.',
                type: 'warning'
            });
            return;
        }

        if (
            actor?.role === 'trainer' &&
            composerData.targetColleges.length === 0 &&
            composerData.targetBatches.length === 0
        ) {
            setAlertState({
                open: true,
                title: 'Select Target Batch',
                message: 'Please choose at least one of your assigned colleges or batches to publish to.',
                type: 'warning'
            });
            return;
        }

        setSavingBlog(true);
        try {
            const payload = {
                ...composerData,
                status: targetStatus,
                content: htmlContent,
                tags: composerData.tagsText
                    .split(',')
                    .map((t) => t.trim())
                    .filter(Boolean)
            };

            let res;
            if (editingBlog) {
                res = await axios.put(`${API}/blogs/${editingBlog._id}`, payload, { headers });
            } else {
                res = await axios.post(`${API}/blogs`, payload, { headers });
            }

            if (res.data.success) {
                await fetchBlogs();
                setActiveBlog(res.data.data);
                setViewMode('read');
            }
        } catch (err) {
            setAlertState({
                open: true,
                title: 'Could Not Save Story',
                message: err.response?.data?.error || 'Failed to publish blog story.',
                type: 'error'
            });
        } finally {
            setSavingBlog(false);
        }
    };

    const handleDeleteBlog = (blog) => {
        setConfirmState({
            open: true,
            title: 'Delete Blog Story?',
            message: `Are you sure you want to permanently delete "${blog.title}"?`,
            onConfirm: async () => {
                setConfirmState((s) => ({ ...s, open: false }));
                try {
                    await axios.delete(`${API}/blogs/${blog._id}`, { headers });
                    if (activeBlog?._id === blog._id) {
                        setActiveBlog(null);
                        setViewMode('feed');
                    }
                    fetchBlogs();
                } catch (err) {
                    setAlertState({
                        open: true,
                        title: 'Delete Failed',
                        message: err.response?.data?.error || 'Could not delete blog story.',
                        type: 'error'
                    });
                }
            }
        });
    };

    const handleTogglePin = async (blog, e) => {
        if (e) e.stopPropagation();
        try {
            const res = await axios.put(
                `${API}/blogs/${blog._id}`,
                { isPinned: !blog.isPinned },
                { headers }
            );
            if (res.data.success) {
                fetchBlogs();
                if (activeBlog?._id === blog._id) setActiveBlog(res.data.data);
            }
        } catch (err) {
            console.error('Failed to pin blog:', err);
        }
    };

    const hasUserLiked = useCallback(
        (blog) => {
            if (!actor || !blog) return false;
            const actorKey = `${actor.model}:${actor.id}`;
            return Array.isArray(blog.clappedBy) && blog.clappedBy.includes(actorKey);
        },
        [actor]
    );

    const handleClap = async (blog, e) => {
        if (e) e.stopPropagation();
        try {
            const res = await axios.post(`${API}/blogs/${blog._id}/clap`, {}, { headers });
            if (res.data.success) {
                const { claps: nextClaps, clappedBy: nextClappedBy } = res.data.data;
                setBlogs((prev) =>
                    prev.map((b) =>
                        b._id === blog._id
                            ? { ...b, claps: nextClaps, clappedBy: nextClappedBy }
                            : b
                    )
                );
                if (activeBlog?._id === blog._id) {
                    setActiveBlog((prev) => ({
                        ...prev,
                        claps: nextClaps,
                        clappedBy: nextClappedBy
                    }));
                }
            }
        } catch (err) {
            console.error('Failed to like blog:', err);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim() || !activeBlog) return;
        setCommentSubmitting(true);
        try {
            const res = await axios.post(
                `${API}/blogs/${activeBlog._id}/comments`,
                { text: commentText.trim() },
                { headers }
            );
            if (res.data.success) {
                const updatedComments = res.data.data;
                setActiveBlog((prev) => ({ ...prev, comments: updatedComments }));
                setBlogs((prev) =>
                    prev.map((b) =>
                        b._id === activeBlog._id ? { ...b, comments: updatedComments } : b
                    )
                );
                setCommentText('');
            }
        } catch (err) {
            console.error('Failed to add comment:', err);
        } finally {
            setCommentSubmitting(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!activeBlog) return;
        try {
            const res = await axios.delete(
                `${API}/blogs/${activeBlog._id}/comments/${commentId}`,
                { headers }
            );
            if (res.data.success) {
                const updatedComments = res.data.data;
                setActiveBlog((prev) => ({ ...prev, comments: updatedComments }));
                setBlogs((prev) =>
                    prev.map((b) =>
                        b._id === activeBlog._id ? { ...b, comments: updatedComments } : b
                    )
                );
            }
        } catch (err) {
            console.error('Failed to delete comment:', err);
        }
    };

    const canManageBlog = (blog) => {
        if (!actor || !blog) return false;
        if (blog.authorId?.toString() === actor.id?.toString()) return true;
        return ['super_admin', 'ops_admin', 'ast_ops_admin', 'college_admin'].includes(actor.role);
    };

    const activeCollegeDisplay =
        selectedCollegeName ||
        availableColleges.find((c) => c._id?.toString() === (lockedCollegeId || filterCollegeId))?.name ||
        'Selected College';

    /* ═══════════════════════════════════════════════════════════════════════
       VIEW 2: MEDIUM-STYLE RICH TEXT COMPOSER & AUDIENCE TARGETING
       ═══════════════════════════════════════════════════════════════════════ */
    if (viewMode === 'write') {
        return (
            <div className="space-y-6 pb-16">
                {/* Composer Top Bar */}
                <div className="bg-white border border-slate-200 rounded-2xl px-5 py-4 shadow-2xs flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setViewMode(activeBlog ? 'read' : 'feed')}
                            className="h-10 px-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 inline-flex items-center gap-1.5 cursor-pointer"
                        >
                            <ArrowLeft size={14} /> Back to Stories
                        </button>
                        <div className="h-5 w-px bg-slate-200 hidden sm:block" />
                        <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5899B5] block">
                                {editingBlog ? 'Editing Story' : 'Medium Editorial Studio'}
                            </span>
                            <span className="text-xs font-semibold text-slate-700">
                                Author: <strong className="text-slate-900">{actor?.name}</strong> ({actor?.roleLabel})
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                        {/* Font Style Selector */}
                        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 h-10">
                            <Type size={14} className="text-[#5899B5]" />
                            <select
                                value={composerData.fontStyle}
                                onChange={(e) =>
                                    setComposerData({ ...composerData, fontStyle: e.target.value })
                                }
                                className="text-xs font-semibold text-slate-700 bg-transparent outline-none cursor-pointer"
                            >
                                {FONT_OPTIONS.map((f) => (
                                    <option key={f.id} value={f.id}>
                                        {f.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="button"
                            disabled={savingBlog}
                            onClick={() => handlePublishOrSave('draft')}
                            className="h-10 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-50"
                        >
                            Save Draft
                        </button>

                        <button
                            type="button"
                            disabled={savingBlog}
                            onClick={() => handlePublishOrSave('published')}
                            className="h-10 px-5 bg-[#5899B5] hover:bg-[#3D7690] text-white rounded-xl text-xs font-semibold inline-flex items-center gap-2 cursor-pointer shadow-2xs disabled:opacity-50"
                        >
                            {savingBlog ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                            {editingBlog ? 'Update & Publish' : 'Publish Story'}
                        </button>
                    </div>
                </div>

                {/* Audience & Batch / College Scope Configuration Panel */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900">
                                Target Audience &amp; Batch Scope
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                                {actor?.role === 'student'
                                    ? 'Student blogs are automatically scoped exclusively to your batch and trainer.'
                                    : actor?.role === 'trainer'
                                        ? `Publishing as Trainer ${actor.name} — choose which of your assigned colleges and batches will receive this story.`
                                        : 'Choose whether to publish across all colleges or target specific colleges and batches.'}
                            </p>
                        </div>

                        {actor?.role !== 'student' && (
                            <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={composerData.isPinned}
                                    onChange={(e) =>
                                        setComposerData({ ...composerData, isPinned: e.target.checked })
                                    }
                                    className="rounded border-slate-300 text-[#5899B5]"
                                />
                                <Pin size={13} className="text-[#5899B5]" />
                                Pin as Featured Story
                            </label>
                        )}
                    </div>

                    {/* Student Locked Batch Scope Display */}
                    {actor?.role === 'student' ? (
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 inline-flex items-center gap-2">
                                <Layers size={14} className="text-[#5899B5]" />
                                <span>Batch Scope Locked: {actor.batchName}</span>
                            </div>
                            <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-600 inline-flex items-center gap-2">
                                <School size={14} className="text-slate-400" />
                                <span>{actor.collegeName}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Admin / Ops Admin Global Toggle */}
                            {contextData?.canSelectGlobal && !lockedCollegeId && (
                                <div className="flex flex-wrap items-center gap-2.5">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setComposerData({
                                                ...composerData,
                                                isGlobal: true,
                                                targetColleges: [],
                                                targetBatches: []
                                            })
                                        }
                                        className={`h-9 px-4 rounded-xl text-xs font-semibold inline-flex items-center gap-2 border transition cursor-pointer ${
                                            composerData.isGlobal
                                                ? 'bg-[#5899B5] text-white border-[#5899B5]'
                                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                                        }`}
                                    >
                                        <Globe size={13} />
                                        All Colleges &amp; Batches (Platform-Wide)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setComposerData({
                                                ...composerData,
                                                isGlobal: false
                                            })
                                        }
                                        className={`h-9 px-4 rounded-xl text-xs font-semibold inline-flex items-center gap-2 border transition cursor-pointer ${
                                            !composerData.isGlobal
                                                ? 'bg-[#5899B5] text-white border-[#5899B5]'
                                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                                        }`}
                                    >
                                        <School size={13} />
                                        Select Specific College(s) &amp; Batch(es)
                                    </button>
                                </div>
                            )}

                            {/* College & Batch Multi-Select Pills */}
                            {(!composerData.isGlobal || !contextData?.canSelectGlobal || lockedCollegeId) && (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    {/* Colleges Selection */}
                                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                                                <School size={13} className="text-[#5899B5]" />
                                                1. Select Target College(s) ({composerData.targetColleges.length})
                                            </span>
                                            {availableColleges.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setComposerData((prev) => ({
                                                            ...prev,
                                                            isGlobal: false,
                                                            targetColleges:
                                                                prev.targetColleges.length === availableColleges.length
                                                                    ? []
                                                                    : availableColleges.map((c) => c._id.toString())
                                                        }))
                                                    }
                                                    className="text-[11px] font-semibold text-[#5899B5] hover:underline cursor-pointer"
                                                >
                                                    {composerData.targetColleges.length === availableColleges.length
                                                        ? 'Clear All'
                                                        : 'Select All Colleges'}
                                                </button>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto">
                                            {availableColleges.map((c) => {
                                                const cid = c._id.toString();
                                                const selected = composerData.targetColleges.includes(cid);
                                                return (
                                                    <button
                                                        key={cid}
                                                        type="button"
                                                        onClick={() => toggleTargetCollege(cid)}
                                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 border transition cursor-pointer ${
                                                            selected
                                                                ? 'bg-[#5899B5] text-white border-[#5899B5]'
                                                                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                                                        }`}
                                                    >
                                                        {selected && <Check size={12} />}
                                                        <span>{c.name}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Batches Selection */}
                                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                                                <Layers size={13} className="text-[#5899B5]" />
                                                2. Select Target Batch(es) (
                                                {composerData.targetBatches.length === 0
                                                    ? 'All Batches in College'
                                                    : `${composerData.targetBatches.length} Selected`}
                                                )
                                            </span>
                                            {visibleComposerBatches.length > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setComposerData((prev) => ({
                                                            ...prev,
                                                            isGlobal: false,
                                                            targetBatches:
                                                                prev.targetBatches.length === visibleComposerBatches.length
                                                                    ? []
                                                                    : visibleComposerBatches.map((b) => b._id.toString())
                                                        }))
                                                    }
                                                    className="text-[11px] font-semibold text-[#5899B5] hover:underline cursor-pointer"
                                                >
                                                    {composerData.targetBatches.length === visibleComposerBatches.length
                                                        ? 'All Batches (Unfilter)'
                                                        : 'Select All Batches'}
                                                </button>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto">
                                            {visibleComposerBatches.length === 0 ? (
                                                <span className="text-xs text-slate-400">
                                                    Select a college on the left to choose specific batches.
                                                </span>
                                            ) : (
                                                visibleComposerBatches.map((b) => {
                                                    const bid = b._id.toString();
                                                    const selected = composerData.targetBatches.includes(bid);
                                                    return (
                                                        <button
                                                            key={bid}
                                                            type="button"
                                                            onClick={() => toggleTargetBatch(bid)}
                                                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 border transition cursor-pointer ${
                                                                selected
                                                                    ? 'bg-[#5899B5] text-white border-[#5899B5]'
                                                                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                                                            }`}
                                                        >
                                                            {selected && <Check size={12} />}
                                                            <span>{b.batchName}</span>
                                                            {b.collegeId?.code && (
                                                                <span
                                                                    className={`text-[10px] ${
                                                                        selected ? 'text-white/80' : 'text-slate-400'
                                                                    }`}
                                                                >
                                                                    ({b.collegeId.code})
                                                                </span>
                                                            )}
                                                        </button>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Category, Tags & Cover Image Metadata Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-100">
                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                Editorial Category
                            </label>
                            <select
                                value={composerData.category}
                                onChange={(e) =>
                                    setComposerData({ ...composerData, category: e.target.value })
                                }
                                className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-[#5899B5] cursor-pointer"
                            >
                                {BLOG_CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                Topic Tags (Comma-Separated)
                            </label>
                            <input
                                type="text"
                                value={composerData.tagsText}
                                onChange={(e) =>
                                    setComposerData({ ...composerData, tagsText: e.target.value })
                                }
                                placeholder="e.g. C Programming, Pointers, Placements"
                                className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:bg-white focus:border-[#5899B5]"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                Cover Banner Image (Upload or URL)
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={
                                        composerData.coverImage.startsWith('data:')
                                            ? ''
                                            : composerData.coverImage
                                    }
                                    onChange={(e) =>
                                        setComposerData({ ...composerData, coverImage: e.target.value })
                                    }
                                    placeholder={
                                        composerData.coverImage.startsWith('data:')
                                            ? 'Uploaded cover image active'
                                            : 'Paste cover image URL...'
                                    }
                                    className="flex-1 h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 outline-none focus:bg-white focus:border-[#5899B5]"
                                />
                                <label className="h-10 px-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 inline-flex items-center gap-1.5 cursor-pointer shrink-0">
                                    <Upload size={13} />
                                    Cover
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleCoverImageFile}
                                    />
                                </label>
                                {composerData.coverImage && (
                                    <button
                                        type="button"
                                        onClick={() => setComposerData({ ...composerData, coverImage: '' })}
                                        className="h-10 px-2.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                                        title="Remove cover image"
                                    >
                                        <X size={15} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Dedicated Blog Images & Visuals Uploader Panel */}
                    <div className="pt-4 border-t border-slate-100 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                                    <ImageIcon size={14} className="text-[#5899B5]" />
                                    Blog Images &amp; Diagrams Gallery ({composerData.images?.length || 0})
                                </h4>
                                <p className="text-[11px] text-slate-500 mt-0.5">
                                    Upload one or multiple images/screenshots for your blog, add captions, or insert them directly into your story paragraphs.
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <label className="h-9 px-3.5 bg-[#5899B5] hover:bg-[#3D7690] text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition shadow-2xs">
                                    <Upload size={13} />
                                    Upload Images
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={handleGalleryFilesUpload}
                                    />
                                </label>

                                <div className="flex items-center gap-1.5">
                                    <input
                                        type="text"
                                        value={imageUrlDraft}
                                        onChange={(e) => setImageUrlDraft(e.target.value)}
                                        placeholder="Or paste image URL (https://...)"
                                        className="h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 outline-none focus:bg-white focus:border-[#5899B5] w-48 sm:w-56"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddGalleryImageByUrl}
                                        disabled={!imageUrlDraft.trim()}
                                        className="h-9 px-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer disabled:opacity-50"
                                    >
                                        Add URL
                                    </button>
                                </div>
                            </div>
                        </div>

                        {Array.isArray(composerData.images) && composerData.images.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
                                {composerData.images.map((img, idx) => {
                                    const isCover = composerData.coverImage === img.url;
                                    return (
                                        <div
                                            key={idx}
                                            className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex flex-col gap-2"
                                        >
                                            <div className="relative h-32 rounded-lg overflow-hidden bg-white border border-slate-200">
                                                <img
                                                    src={img.url}
                                                    alt={img.caption || `Blog image ${idx + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                {isCover && (
                                                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#5899B5] text-white text-[10px] font-bold">
                                                        Cover Banner
                                                    </span>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveGalleryImage(idx)}
                                                    className="absolute top-2 right-2 p-1 rounded-md bg-slate-900/70 hover:bg-rose-600 text-white cursor-pointer"
                                                    title="Remove image"
                                                >
                                                    <X size={13} />
                                                </button>
                                            </div>

                                            <input
                                                type="text"
                                                value={img.caption || ''}
                                                onChange={(e) => handleUpdateImageCaption(idx, e.target.value)}
                                                placeholder="Add image caption (optional)..."
                                                className="w-full h-8 px-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 outline-none focus:border-[#5899B5]"
                                            />

                                            <div className="flex items-center justify-between gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleInsertGalleryImageToEditor(img)}
                                                    className="flex-1 py-1.5 px-2.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 cursor-pointer"
                                                >
                                                    Insert in Story Text
                                                </button>
                                                {!isCover && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setComposerData((prev) => ({
                                                                ...prev,
                                                                coverImage: img.url
                                                            }))
                                                        }
                                                        className="py-1.5 px-2.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-semibold text-[#5899B5] cursor-pointer"
                                                    >
                                                        Set Cover
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Medium-Style Editorial Writing Sheet */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
                    {/* Rich Text Formatting Toolbar */}
                    <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center gap-1.5 sticky top-0 z-10">
                        <button
                            type="button"
                            onClick={() => execFormat('bold')}
                            title="Bold (Ctrl+B)"
                            className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer"
                        >
                            <Bold size={15} />
                        </button>
                        <button
                            type="button"
                            onClick={() => execFormat('italic')}
                            title="Italic (Ctrl+I)"
                            className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer"
                        >
                            <Italic size={15} />
                        </button>
                        <button
                            type="button"
                            onClick={() => execFormat('underline')}
                            title="Underline (Ctrl+U)"
                            className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer"
                        >
                            <Underline size={15} />
                        </button>
                        <button
                            type="button"
                            onClick={() => execFormat('strikeThrough')}
                            title="Strikethrough"
                            className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer"
                        >
                            <Strikethrough size={15} />
                        </button>

                        <div className="h-5 w-px bg-slate-200 mx-1" />

                        <button
                            type="button"
                            onClick={() => execFormat('formatBlock', 'H1')}
                            title="Large Heading (H1)"
                            className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                        >
                            <Heading1 size={15} /> H1
                        </button>
                        <button
                            type="button"
                            onClick={() => execFormat('formatBlock', 'H2')}
                            title="Section Heading (H2)"
                            className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                        >
                            <Heading2 size={15} /> H2
                        </button>
                        <button
                            type="button"
                            onClick={() => execFormat('formatBlock', 'H3')}
                            title="Subheading (H3)"
                            className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                        >
                            <Heading3 size={15} /> H3
                        </button>
                        <button
                            type="button"
                            onClick={() => execFormat('formatBlock', 'P')}
                            title="Normal Paragraph"
                            className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer"
                        >
                            Paragraph
                        </button>

                        <div className="h-5 w-px bg-slate-200 mx-1" />

                        <button
                            type="button"
                            onClick={() =>
                                insertHtmlBlock(
                                    '<blockquote>“Write a memorable pull-quote or key takeaway here…”</blockquote><p><br/></p>'
                                )
                            }
                            title="Medium Pull-Quote"
                            className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                        >
                            <Quote size={14} /> Quote
                        </button>
                        <button
                            type="button"
                            onClick={() =>
                                insertHtmlBlock(
                                    '<pre><code>// Write or paste your code snippet here\nint main() {\n    return 0;\n}</code></pre><p><br/></p>'
                                )
                            }
                            title="Code Block"
                            className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                        >
                            <Code size={14} /> Code Block
                        </button>
                        <button
                            type="button"
                            onClick={() =>
                                insertHtmlBlock(
                                    '<div class="callout-box"><strong>Key Note:</strong> Highlight important batch instructions or exam pointers here.</div><p><br/></p>'
                                )
                            }
                            title="Callout Box"
                            className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer"
                        >
                            Callout Box
                        </button>

                        <div className="h-5 w-px bg-slate-200 mx-1" />

                        <button
                            type="button"
                            onClick={() => execFormat('insertUnorderedList')}
                            title="Bullet List"
                            className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer"
                        >
                            <List size={15} />
                        </button>
                        <button
                            type="button"
                            onClick={() => execFormat('insertOrderedList')}
                            title="Numbered List"
                            className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer"
                        >
                            <ListOrdered size={15} />
                        </button>
                        <button
                            type="button"
                            onClick={handleInsertLink}
                            title="Insert Hyperlink"
                            className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer"
                        >
                            <LinkIcon size={15} />
                        </button>
                        <label
                            title="Upload & Insert Image into Article"
                            className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5"
                        >
                            <ImageIcon size={15} className="text-[#5899B5]" />
                            <span>Insert Image</span>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={handleInlineImageUpload}
                            />
                        </label>
                        <button
                            type="button"
                            onClick={() => insertHtmlBlock('<hr/><p><br/></p>')}
                            title="Insert Editorial Divider"
                            className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer"
                        >
                            <Minus size={15} />
                        </button>
                    </div>

                    {/* Centered Medium Editorial Canvas */}
                    <div className="max-w-3xl mx-auto px-6 sm:px-12 py-10 space-y-6">
                        {composerData.coverImage && (
                            <div className="rounded-2xl overflow-hidden border border-slate-200 max-h-80">
                                <img
                                    src={composerData.coverImage}
                                    alt="Story cover"
                                    className="w-full h-64 object-cover"
                                />
                            </div>
                        )}

                        {/* Title Input */}
                        <input
                            type="text"
                            value={composerData.title}
                            onChange={(e) =>
                                setComposerData({ ...composerData, title: e.target.value })
                            }
                            placeholder="Title of your story…"
                            className={`w-full text-3xl sm:text-4xl font-extrabold text-slate-900 placeholder:text-slate-300 outline-none border-none bg-transparent tracking-tight leading-tight ${getFontClass(
                                composerData.fontStyle
                            )}`}
                        />

                        {/* Subtitle / Deck Input */}
                        <input
                            type="text"
                            value={composerData.subtitle}
                            onChange={(e) =>
                                setComposerData({ ...composerData, subtitle: e.target.value })
                            }
                            placeholder="Add an editorial subtitle or summary deck…"
                            className="w-full text-lg text-slate-500 placeholder:text-slate-300 outline-none border-none bg-transparent font-medium pb-4 border-b border-slate-100"
                        />

                        {/* ContentEditable Rich Text Area */}
                        <div
                            ref={editorRef}
                            contentEditable
                            suppressContentEditableWarning
                            data-placeholder="Tell your story…"
                            className={`medium-article medium-editor-canvas min-h-[420px] outline-none ${getFontClass(
                                composerData.fontStyle
                            )}`}
                        />
                    </div>
                </div>

                <AlertModal
                    isOpen={alertState.open}
                    title={alertState.title}
                    message={alertState.message}
                    type={alertState.type}
                    onClose={() => setAlertState((s) => ({ ...s, open: false }))}
                />
            </div>
        );
    }

    /* ═══════════════════════════════════════════════════════════════════════
       VIEW 3: FULL MEDIUM EDITORIAL ARTICLE READER & DISCUSSION
       ═══════════════════════════════════════════════════════════════════════ */
    if (viewMode === 'read' && activeBlog) {
        const scopeBadges = formatScopeBadges(activeBlog);
        const canEditThis = canManageBlog(activeBlog);

        return (
            <div className="space-y-6 pb-16">
                {/* Reader Top Navigation Bar */}
                <div className="bg-white border border-slate-200 rounded-2xl px-5 py-3.5 shadow-2xs flex flex-wrap items-center justify-between gap-3">
                    <button
                        type="button"
                        onClick={() => {
                            setActiveBlog(null);
                            setViewMode('feed');
                        }}
                        className="h-9 px-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 inline-flex items-center gap-1.5 cursor-pointer"
                    >
                        <ArrowLeft size={14} /> Back to All Blogs
                    </button>

                    <div className="flex flex-wrap items-center gap-2">
                        {scopeBadges.map((b, idx) => (
                            <span
                                key={idx}
                                className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700"
                            >
                                {b.label}
                            </span>
                        ))}

                        {canEditThis && (
                            <>
                                <button
                                    type="button"
                                    onClick={() => openComposer(activeBlog)}
                                    className="h-9 px-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                                >
                                    <Edit2 size={13} /> Edit Story
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDeleteBlog(activeBlog)}
                                    className="h-9 px-3.5 bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                                >
                                    <Trash2 size={13} /> Delete
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Medium Centered Reading Container */}
                <article className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
                    <div className="max-w-3xl mx-auto px-6 sm:px-12 py-10 sm:py-12">
                        {/* Category & Pinned Badge */}
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider">
                                {activeBlog.category || 'Engineering & Code'}
                            </span>
                            {activeBlog.isPinned && (
                                <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold inline-flex items-center gap-1">
                                    <Pin size={11} /> Featured Story
                                </span>
                            )}
                            {activeBlog.status === 'draft' && (
                                <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">
                                    Draft
                                </span>
                            )}
                        </div>

                        {/* Headline */}
                        <h1
                            className={`text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight ${getFontClass(
                                activeBlog.fontStyle
                            )}`}
                        >
                            {activeBlog.title}
                        </h1>

                        {/* Subtitle / Deck */}
                        {activeBlog.subtitle && (
                            <p className="text-lg sm:text-xl text-slate-500 mt-3 leading-relaxed font-normal">
                                {activeBlog.subtitle}
                            </p>
                        )}

                        {/* Author Byline Bar */}
                        <div className="mt-6 py-5 border-y border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3.5">
                                <div className="w-11 h-11 rounded-full bg-[#5899B5] text-white font-bold text-base flex items-center justify-center shrink-0">
                                    {(activeBlog.authorName || 'A').charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-sm font-bold text-slate-900">
                                            {activeBlog.authorName}
                                        </span>
                                        <span
                                            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                                activeBlog.authorRole === 'trainer'
                                                    ? 'bg-blue-50 text-[#3D7690] border border-blue-200/70'
                                                    : activeBlog.authorRole === 'student'
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/70'
                                                        : 'bg-slate-100 text-slate-800 border border-slate-200'
                                            }`}
                                        >
                                            {activeBlog.authorRole === 'trainer'
                                                ? `Trainer • ${activeBlog.authorName}`
                                                : activeBlog.authorRoleLabel || activeBlog.authorRole}
                                        </span>
                                    </div>
                                    <div className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-2">
                                        {activeBlog.authorHeadline && (
                                            <span>{activeBlog.authorHeadline}</span>
                                        )}
                                        <span>•</span>
                                        <span>{activeBlog.readingTimeMinutes || 3} min read</span>
                                        <span>•</span>
                                        <span>
                                            {new Date(activeBlog.createdAt).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Like (1 per user) & Comments Action Strip */}
                            <div className="flex items-center gap-2.5">
                                <button
                                    type="button"
                                    onClick={(e) => handleClap(activeBlog, e)}
                                    title={
                                        hasUserLiked(activeBlog)
                                            ? 'You liked this story (click to unlike)'
                                            : 'Like this story (1 like per user)'
                                    }
                                    className={`h-9 px-4 rounded-full border text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition ${
                                        hasUserLiked(activeBlog)
                                            ? 'bg-[#5899B5] text-white border-[#5899B5] shadow-2xs'
                                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                                    }`}
                                >
                                    <ThumbsUp size={14} />
                                    <span>
                                        {hasUserLiked(activeBlog) ? 'Liked' : 'Like'} • {activeBlog.claps || 0}
                                    </span>
                                </button>
                                <span className="h-9 px-3.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600 inline-flex items-center gap-1.5">
                                    <MessageSquare size={14} />
                                    <span>{activeBlog.comments?.length || 0}</span>
                                </span>
                            </div>
                        </div>

                        {/* Optional Cover Image */}
                        {activeBlog.coverImage && (
                            <div className="my-8 rounded-2xl overflow-hidden border border-slate-200">
                                <img
                                    src={activeBlog.coverImage}
                                    alt={activeBlog.title}
                                    onClick={() => setLightboxImage(activeBlog.coverImage)}
                                    className="w-full max-h-[440px] object-cover cursor-zoom-in"
                                />
                            </div>
                        )}

                        {/* Rendered Medium Article Body */}
                        <div
                            className={`medium-article mt-8 ${getFontClass(activeBlog.fontStyle)}`}
                            dangerouslySetInnerHTML={{ __html: activeBlog.content }}
                        />

                        {/* Attached Blog Images Gallery */}
                        {Array.isArray(activeBlog.images) && activeBlog.images.length > 0 && (
                            <div className="mt-10 pt-8 border-t border-slate-100 space-y-4">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                                    <ImageIcon size={14} className="text-[#5899B5]" />
                                    Attached Story Visuals &amp; Diagrams ({activeBlog.images.length})
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {activeBlog.images.map((img, idx) => (
                                        <figure
                                            key={idx}
                                            className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden flex flex-col"
                                        >
                                            <img
                                                src={img.url || img}
                                                alt={img.caption || `Story visual ${idx + 1}`}
                                                onClick={() => setLightboxImage(img.url || img)}
                                                className="w-full h-56 object-cover cursor-zoom-in hover:opacity-95 transition"
                                            />
                                            {img.caption && (
                                                <figcaption className="px-4 py-2.5 text-xs text-slate-600 font-medium border-t border-slate-200/80 bg-white">
                                                    {img.caption}
                                                </figcaption>
                                            )}
                                        </figure>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tags Footer */}
                        {Array.isArray(activeBlog.tags) && activeBlog.tags.length > 0 && (
                            <div className="mt-10 pt-6 border-t border-slate-100 flex flex-wrap gap-2">
                                {activeBlog.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Discussion / Responses Section */}
                        <div className="mt-12 pt-8 border-t border-slate-200 space-y-6">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <MessageSquare size={18} className="text-[#5899B5]" />
                                Responses ({activeBlog.comments?.length || 0})
                            </h3>

                            <form onSubmit={handleAddComment} className="space-y-3">
                                <textarea
                                    rows={3}
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="What are your thoughts on this story?"
                                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:bg-white focus:border-[#5899B5]"
                                />
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={commentSubmitting || !commentText.trim()}
                                        className="h-9 px-4 bg-[#5899B5] hover:bg-[#3D7690] text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                                    >
                                        {commentSubmitting && (
                                            <Loader2 size={13} className="animate-spin" />
                                        )}
                                        Respond
                                    </button>
                                </div>
                            </form>

                            <div className="divide-y divide-slate-100">
                                {(activeBlog.comments || []).map((c) => {
                                    const canDeleteComment =
                                        c.authorId?.toString() === actor?.id?.toString() ||
                                        canEditThis;
                                    return (
                                        <div key={c._id} className="py-4 flex items-start justify-between gap-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-slate-900">
                                                        {c.authorName}
                                                    </span>
                                                    <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-semibold text-slate-600">
                                                        {c.authorRoleLabel || c.authorRole}
                                                    </span>
                                                    <span className="text-[11px] text-slate-400">
                                                        {new Date(c.createdAt).toLocaleDateString('en-IN', {
                                                            day: 'numeric',
                                                            month: 'short'
                                                        })}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-700 leading-relaxed">
                                                    {c.text}
                                                </p>
                                            </div>
                                            {canDeleteComment && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteComment(c._id)}
                                                    className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                                                    title="Delete comment"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </article>

                {lightboxImage && (
                    <div
                        onClick={() => setLightboxImage(null)}
                        className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 cursor-zoom-out"
                    >
                        <button
                            type="button"
                            onClick={() => setLightboxImage(null)}
                            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                        >
                            <X size={20} />
                        </button>
                        <img
                            src={lightboxImage}
                            alt="Enlarged blog visual"
                            className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl object-contain"
                        />
                    </div>
                )}

                <ConfirmModal
                    isOpen={confirmState.open}
                    title={confirmState.title}
                    message={confirmState.message}
                    type="danger"
                    confirmText="Delete"
                    onConfirm={confirmState.onConfirm}
                    onClose={() => setConfirmState((s) => ({ ...s, open: false }))}
                />
            </div>
        );
    }

    /* ═══════════════════════════════════════════════════════════════════════
       VIEW 1: MEDIUM-STYLE BLOGS FEED & ROLE/BATCH FILTERS
       ═══════════════════════════════════════════════════════════════════════ */
    const trainerCount = blogs.filter((b) => b.authorRole === 'trainer').length;
    const studentCount = blogs.filter((b) => b.authorRole === 'student').length;

    return (
        <div className="space-y-6 pb-12">
            {/* Editorial Masthead Banner */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <EditorialIllustrationSvg />
                    <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                                {isStudent
                                    ? `Batch Editorial • ${actor?.batchName || 'Your Batch'}`
                                    : actor?.role === 'trainer'
                                        ? `Trainer Editorial • ${actor?.name}`
                                        : lockedCollegeId
                                            ? activeCollegeDisplay
                                            : 'Campus & Batch Editorial Hub'}
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight medium-font-serif">
                            Blogs &amp; Technical Stories
                        </h1>
                        <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
                            {isStudent
                                ? `Read technical articles from your trainers and operations team, or publish your own study notes and interview experiences exclusively for your batch (${actor?.batchName || 'your cohort'}).`
                                : actor?.role === 'trainer'
                                    ? 'Publish technical guides, module walkthroughs, and coding deep-dives under your name to your chosen colleges and batches.'
                                    : 'Publish engineering blogs, placement guides, and campus updates targeted to specific colleges and batches or across the entire platform.'}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <div className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center min-w-[90px]">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Stories</p>
                        <p className="text-lg font-bold text-slate-900">{blogs.length}</p>
                    </div>
                    <div className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center min-w-[90px]">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Trainers</p>
                        <p className="text-lg font-bold text-slate-900">{trainerCount}</p>
                    </div>
                    <div className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center min-w-[90px]">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Students</p>
                        <p className="text-lg font-bold text-slate-900">{studentCount}</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => openComposer(null)}
                        className="h-11 px-5 bg-[#5899B5] hover:bg-[#3D7690] text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 transition cursor-pointer shadow-2xs"
                    >
                        <PenTool size={15} />
                        Write a Story
                    </button>
                </div>
            </div>

            {/* Filter & Search Panel */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-5">
                {/* Row 1: Search Input + Author Source Segmented Switcher */}
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search
                            size={16}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                        />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search stories by title, trainer name, student, or tag..."
                            className="w-full h-10 pl-10 pr-9 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:bg-white focus:border-[#5899B5]"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200 overflow-x-auto">
                        {[
                            { id: 'all', label: 'All Stories' },
                            { id: 'trainer', label: 'From Trainers' },
                            { id: 'admin', label: 'Ops & Admin' },
                            { id: 'student', label: 'Batch Students' },
                            { id: 'mine', label: 'My Stories' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setAuthorTypeFilter(tab.id)}
                                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                                    authorTypeFilter === tab.id
                                        ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/80'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Row 2: Labeled Scope & Category Dropdowns */}
                <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                    {/* 1. Institution Scope */}
                    <div>
                        <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                            <School size={13} className="text-[#5899B5]" />
                            Institution Scope
                        </label>
                        {!isStudent && !lockedCollegeId && availableColleges.length > 1 ? (
                            <select
                                value={filterCollegeId}
                                onChange={(e) => {
                                    setFilterCollegeId(e.target.value);
                                    setFilterBatchId('all');
                                }}
                                className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-[#5899B5] cursor-pointer"
                            >
                                <option value="all">All Colleges ({availableColleges.length})</option>
                                {availableColleges.map((c) => (
                                    <option key={c._id} value={c._id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <div className="w-full h-10 px-3.5 bg-slate-100/90 border border-slate-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-slate-800 truncate">
                                <span className="w-2 h-2 rounded-full bg-[#5899B5] shrink-0" />
                                <span className="truncate">
                                    {isStudent ? actor?.collegeName || 'Your College' : activeCollegeDisplay}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* 2. Batch Scope */}
                    <div>
                        <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                            <Layers size={13} className="text-[#5899B5]" />
                            Batch Scope
                        </label>
                        {!isStudent ? (
                            <select
                                value={filterBatchId}
                                onChange={(e) => setFilterBatchId(e.target.value)}
                                className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-[#5899B5] cursor-pointer"
                            >
                                <option value="all">
                                    All Batches ({visibleFilterBatches.length})
                                </option>
                                {visibleFilterBatches.map((b) => (
                                    <option key={b._id} value={b._id}>
                                        {b.batchName}
                                        {b.collegeId?.code ? ` (${b.collegeId.code})` : ''}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <div className="w-full h-10 px-3.5 bg-slate-100/90 border border-slate-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-slate-800 truncate">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                                <span className="truncate">
                                    Scoped to Batch: {actor?.batchName || 'Your Batch'}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* 3. Topic Category */}
                    <div>
                        <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                            <BookOpen size={13} className="text-[#5899B5]" />
                            Topic Category
                        </label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-[#5899B5] cursor-pointer"
                        >
                            <option value="all">All Categories</option>
                            {BLOG_CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Stories Stream */}
            {loading ? (
                <div className="bg-white border border-slate-200 rounded-2xl py-20 flex flex-col items-center justify-center gap-3">
                    <Loader2 size={28} className="animate-spin text-[#5899B5]" />
                    <p className="text-xs font-medium text-slate-400">Loading editorial stories...</p>
                </div>
            ) : blogs.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl py-20 px-6 text-center space-y-3">
                    <BookOpen size={40} className="mx-auto text-slate-200" />
                    <h3 className="text-base font-bold text-slate-800">No stories published in this scope yet</h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                        Be the first to share a technical article, module summary, or interview insight with your cohort.
                    </p>
                    <button
                        type="button"
                        onClick={() => openComposer(null)}
                        className="h-10 px-5 bg-[#5899B5] hover:bg-[#3D7690] text-white rounded-xl text-xs font-semibold inline-flex items-center gap-2 cursor-pointer"
                    >
                        <PenTool size={14} /> Write the First Story
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {blogs.map((blog) => {
                        const scopeBadges = formatScopeBadges(blog);
                        const canEdit = canManageBlog(blog);
                        const excerpt = blog.subtitle || stripHtmlPreview(blog.content, 200);

                        return (
                            <article
                                key={blog._id}
                                onClick={() => {
                                    setActiveBlog(blog);
                                    setViewMode('read');
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="bg-white border border-slate-200 hover:border-[#5899B5]/40 rounded-2xl p-6 sm:p-7 shadow-2xs transition-all cursor-pointer flex flex-col md:flex-row items-start justify-between gap-6 group"
                            >
                                <div className="flex-1 min-w-0 space-y-3">
                                    {/* Author Byline + Target Scope Pills */}
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                                                {(blog.authorName || 'A').charAt(0).toUpperCase()}
                                            </div>
                                            <span className="text-xs font-bold text-slate-900">
                                                {blog.authorName}
                                            </span>
                                            <span
                                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                    blog.authorRole === 'trainer'
                                                        ? 'bg-blue-50 text-[#3D7690] border border-blue-200/70'
                                                        : blog.authorRole === 'student'
                                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/70'
                                                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                                                }`}
                                            >
                                                {blog.authorRole === 'trainer'
                                                    ? `Trainer • ${blog.authorName}`
                                                    : blog.authorRoleLabel || blog.authorRole}
                                            </span>
                                            <span className="text-xs text-slate-400">·</span>
                                            <span className="text-xs text-slate-500">
                                                {new Date(blog.createdAt).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-1.5">
                                            {blog.isPinned && (
                                                <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold inline-flex items-center gap-1">
                                                    <Pin size={10} /> Featured
                                                </span>
                                            )}
                                            {blog.status === 'draft' && (
                                                <span className="px-2.5 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold">
                                                    Draft
                                                </span>
                                            )}
                                            {scopeBadges.map((b, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10px] font-semibold text-slate-700"
                                                >
                                                    {b.label}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Story Title & Deck in Medium Editorial Serif */}
                                    <div>
                                        <h2
                                            className={`text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-[#5899B5] transition-colors leading-snug ${getFontClass(
                                                blog.fontStyle
                                            )}`}
                                        >
                                            {blog.title}
                                        </h2>
                                        <p className="text-sm text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                                            {excerpt}
                                        </p>
                                    </div>

                                    {/* Bottom Metadata & Engagement Bar */}
                                    <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                                            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold text-[11px]">
                                                {blog.category}
                                            </span>
                                            <span className="inline-flex items-center gap-1">
                                                <Clock size={12} /> {blog.readingTimeMinutes || 3} min read
                                            </span>
                                            <button
                                                type="button"
                                                onClick={(e) => handleClap(blog, e)}
                                                title={
                                                    hasUserLiked(blog)
                                                        ? 'You liked this story (click to unlike)'
                                                        : 'Like this story (1 like per user)'
                                                }
                                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] font-bold transition cursor-pointer ${
                                                    hasUserLiked(blog)
                                                        ? 'bg-[#5899B5] text-white border-[#5899B5]'
                                                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-[#5899B5] hover:text-[#5899B5]'
                                                }`}
                                            >
                                                <ThumbsUp size={12} />
                                                <span>
                                                    {hasUserLiked(blog) ? 'Liked' : 'Like'} • {blog.claps || 0}
                                                </span>
                                            </button>
                                            <span className="inline-flex items-center gap-1">
                                                <MessageSquare size={13} /> {blog.comments?.length || 0}
                                            </span>
                                            {Array.isArray(blog.images) && blog.images.length > 0 && (
                                                <span className="inline-flex items-center gap-1 text-slate-500">
                                                    <ImageIcon size={12} /> {blog.images.length}
                                                </span>
                                            )}
                                        </div>

                                        {canEdit && (
                                            <div
                                                className="flex items-center gap-1.5"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {actor?.role !== 'student' && (
                                                    <button
                                                        type="button"
                                                        onClick={(e) => handleTogglePin(blog, e)}
                                                        title={blog.isPinned ? 'Unpin Story' : 'Pin Story'}
                                                        className={`p-1.5 rounded-lg border text-xs cursor-pointer ${
                                                            blog.isPinned
                                                                ? 'bg-amber-50 border-amber-200 text-amber-700'
                                                                : 'bg-white border-slate-200 text-slate-400 hover:text-slate-700'
                                                        }`}
                                                    >
                                                        <Pin size={13} />
                                                    </button>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => openComposer(blog)}
                                                    className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                                                >
                                                    <Edit2 size={12} /> Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteBlog(blog)}
                                                    className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 cursor-pointer"
                                                    title="Delete story"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {(blog.coverImage || blog.images?.[0]?.url) && (
                                    <div className="w-full md:w-44 h-32 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                                        <img
                                            src={blog.coverImage || blog.images?.[0]?.url}
                                            alt={blog.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                            </article>
                        );
                    })}
                </div>
            )}

            <AlertModal
                isOpen={alertState.open}
                title={alertState.title}
                message={alertState.message}
                type={alertState.type}
                onClose={() => setAlertState((s) => ({ ...s, open: false }))}
            />

            <ConfirmModal
                isOpen={confirmState.open}
                title={confirmState.title}
                message={confirmState.message}
                type="danger"
                confirmText="Delete"
                onConfirm={confirmState.onConfirm}
                onClose={() => setConfirmState((s) => ({ ...s, open: false }))}
            />
        </div>
    );
};

export default BlogsHub;
