import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import {
    Building2,
    Plus,
    Edit2,
    Trash2,
    Search,
    Code2,
    Layers,
    ArrowLeft,
    Upload,
    CheckCircle2,
    XCircle,
    Loader2,
    Play,
    Eye,
    EyeOff,
    X,
    Terminal,
    Globe,
    Sparkles,
    RotateCcw
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import CompanyLogoSvg from '../../components/common/CompanyLogoSvg';
import { executeCode } from '../../utils/codeRunner';
import { AlertModal, ConfirmModal } from '../../components/Modals';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CATEGORIES = [
    { id: 'service', label: 'Service-Based Giants' },
    { id: 'product', label: 'Product-Based Leaders' },
    { id: 'startup', label: 'Next-Gen Startups' },
    { id: 'misc', label: 'FinTech & Specialized' }
];

const PARAM_TYPES = ['int', 'int[]', 'int[][]', 'string', 'string[]', 'float', 'boolean'];

const parseJsonSafe = (raw) => {
    const trimmed = String(raw ?? '').trim();
    if (trimmed === '') return { ok: true, value: '' };
    try {
        return { ok: true, value: JSON.parse(trimmed) };
    } catch {
        // Fallback: treat unquoted text as string if user didn't wrap in quotes
        return { ok: true, value: trimmed };
    }
};

const formatJsonValue = (val) => {
    if (val === undefined) return '';
    try {
        return JSON.stringify(val);
    } catch {
        return String(val);
    }
};

/* ═══════════════════════════════════════════════════════════════════════════
   MODAL 1: CREATE / EDIT COMPANY (WITH LOGO UPLOAD, URL & DOMAIN PREVIEW)
   ═══════════════════════════════════════════════════════════════════════════ */
const CompanyModal = ({ isOpen, company, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        fullName: '',
        slug: '',
        category: 'service',
        categoryLabel: 'Service-Based',
        tagline: '',
        packageRange: '',
        accentColor: '#0F4C81',
        logoUrl: '',
        website: '',
        focusAreasText: '',
        description: '',
        isActive: true
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (company) {
            setFormData({
                name: company.name || '',
                fullName: company.fullName || '',
                slug: company.slug || company.id || '',
                category: company.category || 'service',
                categoryLabel: company.categoryLabel || '',
                tagline: company.tagline || '',
                packageRange: company.packageRange || '',
                accentColor: company.accentColor || '#5899B5',
                logoUrl: company.logoUrl || '',
                website: company.website || '',
                focusAreasText: Array.isArray(company.focusAreas) ? company.focusAreas.join(', ') : '',
                description: company.description || '',
                isActive: company.isActive !== false
            });
        } else {
            setFormData({
                name: '',
                fullName: '',
                slug: '',
                category: 'service',
                categoryLabel: 'Service-Based',
                tagline: '',
                packageRange: '',
                accentColor: '#0F4C81',
                logoUrl: '',
                website: '',
                focusAreasText: 'Arrays & Strings, Dynamic Programming, Graphs',
                description: '',
                isActive: true
            });
        }
        setError('');
    }, [company, isOpen]);

    if (!isOpen) return null;

    const handleLogoFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 1.5 * 1024 * 1024) {
            setError('Logo file must be under 1.5 MB.');
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            setFormData((prev) => ({ ...prev, logoUrl: String(reader.result || '') }));
            setError('');
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            setError('Company name is required.');
            return;
        }
        setSaving(true);
        setError('');
        try {
            await onSave({
                ...formData,
                focusAreas: formData.focusAreasText
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean)
            });
        } catch (err) {
            setError(err.response?.data?.error || err.message || 'Failed to save company.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden my-8">
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#5899B5]">
                            Code2Career Configuration
                        </span>
                        <h3 className="text-lg font-bold text-slate-900">
                            {company ? `Edit Company — ${company.name}` : 'Create New Recruiting Company'}
                        </h3>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
                    {error && (
                        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                            {error}
                        </div>
                    )}

                    {/* Logo Preview + Upload / URL / Domain Configuration */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center p-2.5 shrink-0 shadow-2xs">
                            <CompanyLogoSvg
                                companyId={formData.slug || formData.name}
                                company={formData.name || 'C'}
                                logoUrl={formData.logoUrl}
                                website={formData.website}
                                accentColor={formData.accentColor}
                                className="w-11 h-11 object-contain"
                                size={44}
                            />
                        </div>

                        <div className="flex-1 space-y-2.5 w-full">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className="text-xs font-bold text-slate-800">
                                    Company Logo (Upload Image, Paste Logo URL, or Website Domain)
                                </span>
                                <div className="flex items-center gap-2">
                                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#5899B5] hover:bg-[#3D7690] text-white rounded-xl text-xs font-semibold cursor-pointer transition">
                                        <Upload size={13} />
                                        Upload Logo File
                                        <input
                                            type="file"
                                            accept="image/png,image/jpeg,image/svg+xml,image/webp"
                                            className="hidden"
                                            onChange={handleLogoFileChange}
                                        />
                                    </label>
                                    {formData.logoUrl && (
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, logoUrl: '' })}
                                            className="px-2.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-semibold cursor-pointer"
                                        >
                                            Clear Logo
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    value={formData.logoUrl.startsWith('data:') ? '' : formData.logoUrl}
                                    onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                                    placeholder={
                                        formData.logoUrl.startsWith('data:')
                                            ? 'Custom uploaded image active'
                                            : 'Or paste direct logo image URL (https://...)'
                                    }
                                    className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 outline-none focus:border-[#5899B5]"
                                />
                                <div className="relative">
                                    <Globe size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        value={formData.website}
                                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                        placeholder="Company domain (e.g. stripe.com)"
                                        className="w-full h-9 pl-8 pr-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 outline-none focus:border-[#5899B5]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Basic Identity */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                Company Short Name *
                            </label>
                            <input
                                required
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Stripe"
                                className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#5899B5]"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                Full Legal / Division Name
                            </label>
                            <input
                                type="text"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                placeholder="e.g. Stripe Payments India Pvt. Ltd."
                                className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#5899B5]"
                            />
                        </div>
                    </div>

                    {/* Category, Package, Accent Color */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                Hiring Segment *
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#5899B5] cursor-pointer"
                            >
                                {CATEGORIES.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                CTC / Package Range
                            </label>
                            <input
                                type="text"
                                value={formData.packageRange}
                                onChange={(e) => setFormData({ ...formData, packageRange: e.target.value })}
                                placeholder="e.g. 18 – 36 LPA"
                                className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#5899B5]"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                Brand Accent Color
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={formData.accentColor || '#5899B5'}
                                    onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                                    className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer p-1 bg-white"
                                />
                                <input
                                    type="text"
                                    value={formData.accentColor}
                                    onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                                    className="flex-1 h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 outline-none focus:bg-white focus:border-[#5899B5]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Tagline & Focus Areas */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                Assessment Track Tagline
                            </label>
                            <input
                                type="text"
                                value={formData.tagline}
                                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                                placeholder="e.g. SDE-1 Online Assessment & Machine Coding"
                                className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#5899B5]"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                Focus Topics (Comma-Separated)
                            </label>
                            <input
                                type="text"
                                value={formData.focusAreasText}
                                onChange={(e) => setFormData({ ...formData, focusAreasText: e.target.value })}
                                placeholder="Arrays, Sliding Window, Graphs, DP"
                                className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#5899B5]"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                            Company Track Description
                        </label>
                        <textarea
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Describe the coding patterns, hiring rounds, and key focus areas for this company..."
                            className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:bg-white focus:border-[#5899B5]"
                        />
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <label className="inline-flex items-center gap-2.5 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isActive}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                className="rounded border-slate-300 text-[#5899B5]"
                            />
                            <span className="text-xs font-semibold text-slate-700">
                                Active &amp; Visible to Students in Code2Career
                            </span>
                        </label>

                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="h-10 px-4 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="h-10 px-5 bg-[#5899B5] hover:bg-[#3D7690] text-white rounded-xl text-xs font-semibold inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                {saving && <Loader2 size={14} className="animate-spin" />}
                                {company ? 'Save Changes' : 'Create Company'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

/* ═══════════════════════════════════════════════════════════════════════════
   MODAL 2: CREATE / EDIT CODING QUESTION & TEST CASES (WITH LIVE COMPILER TEST)
   ═══════════════════════════════════════════════════════════════════════════ */
const QuestionModal = ({ isOpen, company, question, nextNumber, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        number: 1,
        title: '',
        difficulty: 'Easy',
        topic: '',
        frequency: '90% in Recent Drives',
        context: '',
        fnName: 'solve',
        returnType: 'int',
        params: [{ name: 'nums', type: 'int[]' }],
        description: '',
        constraintsText: '',
        hint: '',
        starter: {
            python: 'def solve(nums):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(nums) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(nums):\n    return len(nums)',
            javascript: 'function solve(nums) {\n    return nums.length;\n}'
        },
        testCases: [
            { argsText: ['[1, 2, 3]'], expectedText: '3', isHidden: false },
            { argsText: ['[10, 20, 30, 40]'], expectedText: '4', isHidden: true }
        ]
    });

    const [activeCodeTab, setActiveCodeTab] = useState('python');
    const [saving, setSaving] = useState(false);
    const [testing, setTesting] = useState(false);
    const [testResult, setTestResult] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (question) {
            const params =
                Array.isArray(question.params) && question.params.length > 0
                    ? question.params
                    : [{ name: 'n', type: 'int' }];
            setFormData({
                number: question.number || 1,
                title: question.title || '',
                difficulty: question.difficulty || 'Easy',
                topic: question.topic || '',
                frequency: question.frequency || '',
                context: question.context || '',
                fnName: question.fnName || 'solve',
                returnType: question.returnType || 'int',
                params,
                description: question.description || '',
                constraintsText: Array.isArray(question.constraints) ? question.constraints.join('\n') : '',
                hint: question.hint || '',
                starter: {
                    python: question.starter?.python || '',
                    javascript: question.starter?.javascript || ''
                },
                solution: {
                    python: question.solution?.python || '',
                    javascript: question.solution?.javascript || ''
                },
                testCases:
                    Array.isArray(question.testCases) && question.testCases.length > 0
                        ? question.testCases.map((tc) => ({
                            argsText: params.map((_, idx) => formatJsonValue(tc.args?.[idx])),
                            expectedText: formatJsonValue(tc.expected),
                            isHidden: Boolean(tc.isHidden)
                        }))
                        : [
                            {
                                argsText: params.map(() => '0'),
                                expectedText: '0',
                                isHidden: false
                            }
                        ]
            });
        } else {
            setFormData({
                number: nextNumber || 1,
                title: '',
                difficulty: 'Easy',
                topic: 'Arrays & Logic',
                frequency: '90% in Recent Drives',
                context: `Asked in ${company?.name || 'Company'} Technical Coding Assessment`,
                fnName: 'solve',
                returnType: 'int',
                params: [{ name: 'n', type: 'int' }],
                description: '',
                constraintsText: '1 <= n <= 10^5',
                hint: '',
                starter: {
                    python: 'def solve(n):\n    # Write your logic here\n    return 0',
                    javascript: 'function solve(n) {\n    // Write your logic here\n    return 0;\n}'
                },
                solution: {
                    python: 'def solve(n):\n    return n',
                    javascript: 'function solve(n) {\n    return n;\n}'
                },
                testCases: [
                    { argsText: ['5'], expectedText: '5', isHidden: false },
                    { argsText: ['10'], expectedText: '10', isHidden: true }
                ]
            });
        }
        setTestResult(null);
        setError('');
    }, [question, company, nextNumber, isOpen]);

    if (!isOpen) return null;

    const handleAddParam = () => {
        const nextParams = [...formData.params, { name: `arg${formData.params.length + 1}`, type: 'int' }];
        const nextTestCases = formData.testCases.map((tc) => ({
            ...tc,
            argsText: [...(tc.argsText || []), '0']
        }));
        setFormData({ ...formData, params: nextParams, testCases: nextTestCases });
    };

    const handleRemoveParam = (idx) => {
        if (formData.params.length <= 1) return;
        const nextParams = formData.params.filter((_, i) => i !== idx);
        const nextTestCases = formData.testCases.map((tc) => ({
            ...tc,
            argsText: (tc.argsText || []).filter((_, i) => i !== idx)
        }));
        setFormData({ ...formData, params: nextParams, testCases: nextTestCases });
    };

    const handleParamChange = (idx, field, val) => {
        const nextParams = formData.params.map((p, i) => (i === idx ? { ...p, [field]: val } : p));
        setFormData({ ...formData, params: nextParams });
    };

    const handleGenerateStubs = () => {
        const fn = formData.fnName.trim() || 'solve';
        const argList = formData.params.map((p) => p.name.trim() || 'x').join(', ');
        const defaultReturn =
            formData.returnType.includes('[]')
                ? '[]'
                : formData.returnType === 'string'
                    ? '""'
                    : formData.returnType === 'boolean'
                        ? 'False'
                        : '0';
        const defaultJsReturn = defaultReturn === 'False' ? 'false' : defaultReturn;

        setFormData((prev) => ({
            ...prev,
            starter: {
                python: `def ${fn}(${argList}):\n    # Write your logic here\n    return ${defaultReturn}`,
                javascript: `function ${fn}(${argList}) {\n    // Write your logic here\n    return ${defaultJsReturn};\n}`
            }
        }));
    };

    const handleAddTestCase = (isHidden = false) => {
        setFormData((prev) => ({
            ...prev,
            testCases: [
                ...prev.testCases,
                {
                    argsText: prev.params.map(() => '0'),
                    expectedText: '0',
                    isHidden
                }
            ]
        }));
    };

    const handleRemoveTestCase = (idx) => {
        if (formData.testCases.length <= 1) return;
        setFormData((prev) => ({
            ...prev,
            testCases: prev.testCases.filter((_, i) => i !== idx)
        }));
    };

    const handleTestCaseArgChange = (tcIdx, paramIdx, val) => {
        setFormData((prev) => ({
            ...prev,
            testCases: prev.testCases.map((tc, i) => {
                if (i !== tcIdx) return tc;
                const nextArgs = [...(tc.argsText || [])];
                nextArgs[paramIdx] = val;
                return { ...tc, argsText: nextArgs };
            })
        }));
    };

    const handleTestCaseFieldChange = (tcIdx, field, val) => {
        setFormData((prev) => ({
            ...prev,
            testCases: prev.testCases.map((tc, i) => (i === tcIdx ? { ...tc, [field]: val } : tc))
        }));
    };

    const buildNormalizedTestCases = () => {
        return formData.testCases.map((tc) => ({
            args: formData.params.map((_, pIdx) => parseJsonSafe(tc.argsText?.[pIdx]).value),
            expected: parseJsonSafe(tc.expectedText).value,
            isHidden: Boolean(tc.isHidden)
        }));
    };

    const handleVerifyReferenceSolution = async () => {
        const codeToTest = formData.solution[activeCodeTab] || formData.starter[activeCodeTab];
        if (!codeToTest?.trim()) {
            setError(`Please enter a ${activeCodeTab} reference solution or starter code to verify.`);
            return;
        }
        setTesting(true);
        setError('');
        try {
            const normalizedTcs = buildNormalizedTestCases();
            const res = await executeCode(activeCodeTab, codeToTest, normalizedTcs);
            const results = res.results || [];
            const passedCount = results.filter((r) => r.pass).length;
            setTestResult({
                lang: activeCodeTab,
                status: res.status,
                error: res.error,
                passedCount,
                totalCount: normalizedTcs.length,
                allPassed: res.status === 'OK' && passedCount === normalizedTcs.length,
                results
            });
        } catch (err) {
            setError(err.message || 'Verification failed.');
        } finally {
            setTesting(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim()) {
            setError('Problem title is required.');
            return;
        }
        if (!formData.description.trim()) {
            setError('Problem description is required.');
            return;
        }
        setSaving(true);
        setError('');
        try {
            const payload = {
                number: Number(formData.number) || 1,
                title: formData.title.trim(),
                difficulty: formData.difficulty,
                topic: formData.topic.trim(),
                frequency: formData.frequency.trim(),
                context: formData.context.trim(),
                fnName: formData.fnName.trim() || 'solve',
                returnType: formData.returnType.trim() || 'int',
                params: formData.params,
                description: formData.description.trim(),
                constraints: formData.constraintsText
                    .split('\n')
                    .map((s) => s.trim())
                    .filter(Boolean),
                hint: formData.hint.trim(),
                starter: formData.starter,
                solution: formData.solution,
                testCases: buildNormalizedTestCases()
            };
            await onSave(payload);
        } catch (err) {
            setError(err.response?.data?.error || err.message || 'Failed to save question.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-5xl overflow-hidden my-6 flex flex-col max-h-[92vh]">
                {/* Header */}
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center p-1.5">
                            <CompanyLogoSvg
                                companyId={company?.id}
                                company={company?.name}
                                logoUrl={company?.logoUrl}
                                website={company?.website}
                                accentColor={company?.accentColor}
                                className="w-7 h-7 object-contain"
                                size={28}
                            />
                        </div>
                        <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5899B5]">
                                {company?.name} • Code2Career Question &amp; Test Cases Editor
                            </span>
                            <h3 className="text-lg font-bold text-slate-900">
                                {question ? `Edit Problem #${question.number}: ${question.title}` : 'Add New Coding Problem'}
                            </h3>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
                    {error && (
                        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                            {error}
                        </div>
                    )}

                    {/* Section 1: Problem Identity & Metadata */}
                    <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                Problem #
                            </label>
                            <input
                                type="number"
                                min={1}
                                value={formData.number}
                                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                                className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-[#5899B5]"
                            />
                        </div>

                        <div className="sm:col-span-3">
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                Problem Title *
                            </label>
                            <input
                                required
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g. Maximum Subarray Sum With K Elements"
                                className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#5899B5]"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                Difficulty *
                            </label>
                            <select
                                value={formData.difficulty}
                                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                                className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#5899B5] cursor-pointer"
                            >
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                Primary Topic
                            </label>
                            <input
                                type="text"
                                value={formData.topic}
                                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                                placeholder="e.g. Sliding Window"
                                className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#5899B5]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                Frequency Badge
                            </label>
                            <input
                                type="text"
                                value={formData.frequency}
                                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                                placeholder="e.g. 92% in 2024-25 Drives"
                                className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#5899B5]"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                Hiring Round / Scenario Context
                            </label>
                            <input
                                type="text"
                                value={formData.context}
                                onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                                placeholder="e.g. Asked in SDE-1 Online Assessment Round 1"
                                className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#5899B5]"
                            />
                        </div>
                    </div>

                    {/* Section 2: Function Signature & Parameters */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                                    Function Signature &amp; Parameters
                                </h4>
                                <p className="text-[11px] text-slate-500">
                                    Define the entry function name, parameters, and return type. Test cases pass these arguments in order.
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={handleAddParam}
                                    className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                                >
                                    <Plus size={13} /> Add Parameter
                                </button>
                                <button
                                    type="button"
                                    onClick={handleGenerateStubs}
                                    className="px-3 py-1.5 bg-[#5899B5]/10 hover:bg-[#5899B5]/20 text-[#3D7690] border border-[#5899B5]/30 rounded-xl text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                                >
                                    <Code2 size={13} /> Generate Starter Stubs
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                                    Function Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.fnName}
                                    onChange={(e) => setFormData({ ...formData, fnName: e.target.value })}
                                    className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 outline-none focus:border-[#5899B5]"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                                    Return Type
                                </label>
                                <select
                                    value={formData.returnType}
                                    onChange={(e) => setFormData({ ...formData, returnType: e.target.value })}
                                    className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl text-xs font-mono font-semibold text-slate-800 outline-none focus:border-[#5899B5] cursor-pointer"
                                >
                                    {PARAM_TYPES.map((t) => (
                                        <option key={t} value={t}>
                                            {t}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-end">
                                <div className="w-full h-9 px-3 bg-slate-900 text-emerald-400 rounded-xl flex items-center text-xs font-mono truncate">
                                    {formData.fnName || 'solve'}(
                                    {formData.params.map((p) => `${p.name}: ${p.type}`).join(', ')}) →{' '}
                                    {formData.returnType}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {formData.params.map((param, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white border border-slate-200 rounded-xl p-2.5 flex items-center gap-2"
                                >
                                    <span className="text-[10px] font-bold text-slate-400 px-1.5">#{idx + 1}</span>
                                    <input
                                        type="text"
                                        value={param.name}
                                        onChange={(e) => handleParamChange(idx, 'name', e.target.value)}
                                        placeholder="paramName"
                                        className="flex-1 min-w-0 h-8 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-800 outline-none focus:border-[#5899B5]"
                                    />
                                    <select
                                        value={param.type}
                                        onChange={(e) => handleParamChange(idx, 'type', e.target.value)}
                                        className="h-8 px-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-700 outline-none cursor-pointer"
                                    >
                                        {PARAM_TYPES.map((t) => (
                                            <option key={t} value={t}>
                                                {t}
                                            </option>
                                        ))}
                                    </select>
                                    {formData.params.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveParam(idx)}
                                            className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                                            title="Remove parameter"
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section 3: Description, Constraints & Hint */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="lg:col-span-2">
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                Problem Statement / Description *
                            </label>
                            <textarea
                                required
                                rows={5}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Write the clear problem statement, input/output rules, and edge-case specifications..."
                                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:bg-white focus:border-[#5899B5] leading-relaxed"
                            />
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                    Constraints (One Per Line)
                                </label>
                                <textarea
                                    rows={2}
                                    value={formData.constraintsText}
                                    onChange={(e) => setFormData({ ...formData, constraintsText: e.target.value })}
                                    placeholder={'1 <= n <= 10^5\n-10^4 <= nums[i] <= 10^4'}
                                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 outline-none focus:bg-white focus:border-[#5899B5]"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                    Algorithmic Hint
                                </label>
                                <textarea
                                    rows={2}
                                    value={formData.hint}
                                    onChange={(e) => setFormData({ ...formData, hint: e.target.value })}
                                    placeholder="Optional hint shown when a student clicks Show Hint..."
                                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 outline-none focus:bg-white focus:border-[#5899B5]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Starter Code & Reference Solution Code */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="inline-flex bg-white p-1 rounded-xl border border-slate-200">
                                {[
                                    { id: 'python', label: 'Python 3 (.py)' },
                                    { id: 'javascript', label: 'JavaScript ES6 (.js)' }
                                ].map((lang) => (
                                    <button
                                        key={lang.id}
                                        type="button"
                                        onClick={() => setActiveCodeTab(lang.id)}
                                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${activeCodeTab === lang.id
                                            ? 'bg-[#5899B5] text-white'
                                            : 'text-slate-600 hover:text-slate-900'
                                            }`}
                                    >
                                        {lang.label}
                                    </button>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={handleVerifyReferenceSolution}
                                disabled={testing}
                                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                            >
                                {testing ? <Loader2 size={13} className="animate-spin" /> : <Play size={13} />}
                                Test Reference Solution on All Test Cases
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                                    Student Starter Code ({activeCodeTab})
                                </label>
                                <textarea
                                    rows={6}
                                    value={formData.starter[activeCodeTab] || ''}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            starter: { ...formData.starter, [activeCodeTab]: e.target.value }
                                        })
                                    }
                                    className="w-full p-3 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono outline-none leading-relaxed"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                                    Reference Solution ({activeCodeTab} — Admin Only, Never Sent to Students)
                                </label>
                                <textarea
                                    rows={6}
                                    value={formData.solution[activeCodeTab] || ''}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            solution: { ...formData.solution, [activeCodeTab]: e.target.value }
                                        })
                                    }
                                    className="w-full p-3 bg-slate-900 text-emerald-300 rounded-xl text-xs font-mono outline-none leading-relaxed"
                                />
                            </div>
                        </div>

                        {testResult && (
                            <div
                                className={`p-3.5 rounded-xl border text-xs flex items-center justify-between ${testResult.allPassed
                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                                    : 'bg-rose-50 border-rose-200 text-rose-800'
                                    }`}
                            >
                                <div className="flex items-center gap-2 font-bold">
                                    {testResult.allPassed ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                                    <span>
                                        {testResult.allPassed
                                            ? `All ${testResult.totalCount} test cases passed with ${testResult.lang} reference solution!`
                                            : `Passed ${testResult.passedCount} / ${testResult.totalCount} test cases (${testResult.error || testResult.status})`}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Section 5: Test Cases Builder (Sample & Hidden) */}
                    <div className="space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                                    Test Cases ({formData.testCases.length} Total •{' '}
                                    {formData.testCases.filter((t) => !t.isHidden).length} Sample,{' '}
                                    {formData.testCases.filter((t) => t.isHidden).length} Hidden)
                                </h4>
                                <p className="text-[11px] text-slate-500">
                                    Enter JSON values for each parameter (e.g. <code>200</code>, <code>[1, 2, 3]</code>,{' '}
                                    <code>&quot;hello&quot;</code>) and the expected return value.
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleAddTestCase(false)}
                                    className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                                >
                                    <Plus size={13} /> Add Sample Case
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleAddTestCase(true)}
                                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                                >
                                    <Plus size={13} /> Add Hidden Case
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2.5">
                            {formData.testCases.map((tc, tcIdx) => (
                                <div
                                    key={tcIdx}
                                    className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col lg:flex-row items-stretch lg:items-center gap-3"
                                >
                                    <div className="flex items-center justify-between lg:justify-start gap-2 shrink-0">
                                        <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700">
                                            Case #{tcIdx + 1}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleTestCaseFieldChange(tcIdx, 'isHidden', !tc.isHidden)
                                            }
                                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer border ${tc.isHidden
                                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                }`}
                                        >
                                            {tc.isHidden ? <EyeOff size={12} /> : <Eye size={12} />}
                                            {tc.isHidden ? 'Hidden Test' : 'Sample (Visible)'}
                                        </button>
                                    </div>

                                    {/* Parameter Inputs */}
                                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                                        {formData.params.map((p, pIdx) => (
                                            <div key={pIdx}>
                                                <label className="block text-[10px] font-mono font-semibold text-slate-500 mb-0.5">
                                                    {p.name} ({p.type})
                                                </label>
                                                <input
                                                    type="text"
                                                    value={tc.argsText?.[pIdx] ?? ''}
                                                    onChange={(e) =>
                                                        handleTestCaseArgChange(tcIdx, pIdx, e.target.value)
                                                    }
                                                    placeholder="JSON value"
                                                    className="w-full h-8 px-2.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-800 outline-none focus:border-[#5899B5]"
                                                />
                                            </div>
                                        ))}
                                        <div>
                                            <label className="block text-[10px] font-mono font-bold text-[#5899B5] mb-0.5">
                                                Expected Output ({formData.returnType})
                                            </label>
                                            <input
                                                type="text"
                                                value={tc.expectedText ?? ''}
                                                onChange={(e) =>
                                                    handleTestCaseFieldChange(tcIdx, 'expectedText', e.target.value)
                                                }
                                                placeholder="Expected JSON output"
                                                className="w-full h-8 px-2.5 bg-white border border-[#5899B5]/40 rounded-lg text-xs font-mono font-bold text-slate-900 outline-none focus:border-[#5899B5]"
                                            />
                                        </div>
                                    </div>

                                    {formData.testCases.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTestCase(tcIdx)}
                                            className="p-1.5 text-slate-400 hover:text-rose-600 self-end lg:self-center cursor-pointer"
                                            title="Delete test case"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="h-10 px-4 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="h-10 px-5 bg-[#5899B5] hover:bg-[#3D7690] text-white rounded-xl text-xs font-semibold inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                            {saving && <Loader2 size={14} className="animate-spin" />}
                            {question ? 'Update Question & Test Cases' : 'Create Question'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE: OPS ADMIN COMPANY ARENA & CODING QUESTIONS MANAGER
   ═══════════════════════════════════════════════════════════════════════════ */
const AdminCompanyArena = () => {
    const { token } = useAuthStore();

    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [companySearch, setCompanySearch] = useState('');

    // Active Company for Question Management
    const [activeCompany, setActiveCompany] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [questionsLoading, setQuestionsLoading] = useState(false);
    const [questionSearch, setQuestionSearch] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState('All');

    // Modals
    const [companyModalOpen, setCompanyModalOpen] = useState(false);
    const [editingCompany, setEditingCompany] = useState(null);
    const [questionModalOpen, setQuestionModalOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);

    const [alertState, setAlertState] = useState({ open: false, title: '', message: '', type: 'info' });
    const [confirmState, setConfirmState] = useState({
        open: false,
        title: '',
        message: '',
        onConfirm: null
    });

    const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

    const fetchCompanies = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const res = await axios.get(`${API}/coding-arena/admin/companies`, { headers });
            if (res.data.success) {
                setCompanies(res.data.data || []);
            }
        } catch (err) {
            console.error('Failed to load companies:', err);
        } finally {
            setLoading(false);
        }
    }, [token, headers]);

    useEffect(() => {
        fetchCompanies();
    }, [fetchCompanies]);

    const fetchCompanyQuestions = useCallback(
        async (companyDoc) => {
            if (!companyDoc?._id) return;
            setQuestionsLoading(true);
            try {
                const res = await axios.get(
                    `${API}/coding-arena/admin/companies/${companyDoc._id}/questions`,
                    { headers }
                );
                if (res.data.success) {
                    setQuestions(res.data.data || []);
                }
            } catch (err) {
                console.error('Failed to load questions:', err);
            } finally {
                setQuestionsLoading(false);
            }
        },
        [headers]
    );

    const handleOpenCompanyQuestions = (companyDoc) => {
        setActiveCompany(companyDoc);
        setQuestionSearch('');
        setDifficultyFilter('All');
        fetchCompanyQuestions(companyDoc);
    };

    const handleSaveCompany = async (payload) => {
        if (editingCompany) {
            await axios.put(`${API}/coding-arena/admin/companies/${editingCompany._id}`, payload, { headers });
        } else {
            await axios.post(`${API}/coding-arena/admin/companies`, payload, { headers });
        }
        setCompanyModalOpen(false);
        setEditingCompany(null);
        await fetchCompanies();
    };

    const handleDeleteCompany = (comp) => {
        setConfirmState({
            open: true,
            title: `Delete ${comp.name}?`,
            message: `This will permanently delete "${comp.name}" and all ${comp.totalQuestions || 0} coding questions associated with it.`,
            onConfirm: async () => {
                setConfirmState((s) => ({ ...s, open: false }));
                try {
                    await axios.delete(`${API}/coding-arena/admin/companies/${comp._id}`, { headers });
                    if (activeCompany?._id === comp._id) setActiveCompany(null);
                    fetchCompanies();
                } catch (err) {
                    setAlertState({
                        open: true,
                        title: 'Delete Failed',
                        message: err.response?.data?.error || 'Could not delete company.',
                        type: 'error'
                    });
                }
            }
        });
    };

    const handleSaveQuestion = async (payload) => {
        if (!activeCompany) return;
        if (editingQuestion) {
            await axios.put(`${API}/coding-arena/admin/questions/${editingQuestion._id}`, payload, { headers });
        } else {
            await axios.post(
                `${API}/coding-arena/admin/companies/${activeCompany._id}/questions`,
                payload,
                { headers }
            );
        }
        setQuestionModalOpen(false);
        setEditingQuestion(null);
        await Promise.all([fetchCompanyQuestions(activeCompany), fetchCompanies()]);
    };

    const handleDeleteQuestion = (q) => {
        setConfirmState({
            open: true,
            title: `Delete Problem #${q.number}: ${q.title}?`,
            message: 'Are you sure you want to permanently remove this coding question and its test cases?',
            onConfirm: async () => {
                setConfirmState((s) => ({ ...s, open: false }));
                try {
                    await axios.delete(`${API}/coding-arena/admin/questions/${q._id}`, { headers });
                    await Promise.all([fetchCompanyQuestions(activeCompany), fetchCompanies()]);
                } catch (err) {
                    setAlertState({
                        open: true,
                        title: 'Delete Failed',
                        message: err.response?.data?.error || 'Could not delete question.',
                        type: 'error'
                    });
                }
            }
        });
    };

    const filteredCompanies = companies.filter((c) => {
        if (selectedCategory !== 'all' && c.category !== selectedCategory) return false;
        if (companySearch.trim()) {
            const term = companySearch.toLowerCase();
            return (
                c.name?.toLowerCase().includes(term) ||
                c.fullName?.toLowerCase().includes(term) ||
                c.tagline?.toLowerCase().includes(term)
            );
        }
        return true;
    });

    const filteredQuestions = questions.filter((q) => {
        if (difficultyFilter !== 'All' && q.difficulty !== difficultyFilter) return false;
        if (questionSearch.trim()) {
            const term = questionSearch.toLowerCase();
            return (
                q.title?.toLowerCase().includes(term) ||
                q.topic?.toLowerCase().includes(term) ||
                q.description?.toLowerCase().includes(term)
            );
        }
        return true;
    });

    const totalQuestionsAcrossAll = companies.reduce((sum, c) => sum + (c.totalQuestions || 0), 0);

    return (
        <div className="space-y-6 pb-12">
            {/* VIEW A: COMPANIES DIRECTORY & CRUD */}
            {!activeCompany ? (
                <>
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-5 border-b border-slate-200/80">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
                                <Terminal className="text-[#5899B5] shrink-0" size={26} />
                                <span>Code2Career &amp; Coding Questions Manager</span>
                            </h1>
                            <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
                                Create and configure recruiting companies, upload official logos, and manage coding problems, starter stubs, and sample/hidden test cases.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                setEditingCompany(null);
                                setCompanyModalOpen(true);
                            }}
                            className="h-10 px-4 bg-[#5899B5] hover:bg-[#3D7690] text-white rounded-xl text-xs font-semibold inline-flex items-center gap-2 transition cursor-pointer shadow-2xs shrink-0"
                        >
                            <Plus size={16} /> Add New Company
                        </button>
                    </div>

                    {/* KPI Summary Strip */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex items-center justify-between">
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                    Configured Companies
                                </p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{companies.length}</p>
                            </div>
                            <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 text-[#5899B5] flex items-center justify-center">
                                <Building2 size={20} />
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex items-center justify-between">
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                    Total Coding Problems
                                </p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{totalQuestionsAcrossAll}</p>
                            </div>
                            <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 text-[#5899B5] flex items-center justify-center">
                                <Code2 size={20} />
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex items-center justify-between">
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                    Hiring Segments
                                </p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">4 Tracks</p>
                            </div>
                            <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 text-[#5899B5] flex items-center justify-center">
                                <Layers size={20} />
                            </div>
                        </div>
                    </div>

                    {/* Filter Panel */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setSelectedCategory('all')}
                                className={`h-10 px-4 rounded-xl text-xs font-semibold transition cursor-pointer ${selectedCategory === 'all'
                                    ? 'bg-[#5899B5] text-white'
                                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                                    }`}
                            >
                                All Companies ({companies.length})
                            </button>
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`h-10 px-4 rounded-xl text-xs font-semibold transition cursor-pointer ${selectedCategory === cat.id
                                        ? 'bg-[#5899B5] text-white'
                                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                                        }`}
                                >
                                    {cat.label} ({companies.filter((c) => c.category === cat.id).length})
                                </button>
                            ))}
                        </div>

                        <div className="relative w-full lg:w-80">
                            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={companySearch}
                                onChange={(e) => setCompanySearch(e.target.value)}
                                placeholder="Search company name or track..."
                                className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:bg-white focus:border-[#5899B5]"
                            />
                        </div>
                    </div>

                    {/* Companies Grid */}
                    {loading ? (
                        <div className="py-20 bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center gap-3">
                            <Loader2 size={28} className="animate-spin text-[#5899B5]" />
                            <p className="text-xs font-medium text-slate-400">
                                Loading Code2Career catalog...
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {filteredCompanies.map((company) => (
                                <div
                                    key={company._id}
                                    className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs hover:border-[#5899B5]/40 transition-all flex flex-col justify-between gap-5"
                                >
                                    <div className="space-y-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-center gap-3.5">
                                                <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center p-2.5 shrink-0">
                                                    <CompanyLogoSvg
                                                        companyId={company.id}
                                                        company={company.name}
                                                        logoUrl={company.logoUrl}
                                                        website={company.website}
                                                        accentColor={company.accentColor}
                                                        className="w-9 h-9 object-contain"
                                                    />
                                                </div>
                                                <div>
                                                    <h3 className="text-base font-bold text-slate-900">
                                                        {company.name}
                                                    </h3>
                                                    <p className="text-xs text-slate-400 line-clamp-1">
                                                        {company.fullName || company.tagline}
                                                    </p>
                                                    <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                                                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold uppercase">
                                                            {company.categoryLabel || company.category}
                                                        </span>
                                                        {company.packageRange && (
                                                            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[10px] font-bold">
                                                                {company.packageRange}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setEditingCompany(company);
                                                        setCompanyModalOpen(true);
                                                    }}
                                                    className="p-2 text-slate-400 hover:text-[#5899B5] hover:bg-slate-50 rounded-xl transition cursor-pointer"
                                                    title="Edit Company & Logo"
                                                >
                                                    <Edit2 size={15} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteCompany(company)}
                                                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                                                    title="Delete Company"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </div>

                                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                            {company.description || 'No description provided.'}
                                        </p>

                                        {company.focusAreas?.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5">
                                                {company.focusAreas.slice(0, 4).map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="px-2.5 py-0.5 bg-slate-50 border border-slate-200/80 rounded-lg text-[11px] font-medium text-slate-600"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                                        <span className="text-xs font-bold text-slate-700">
                                            {company.totalQuestions || 0} Coding Question
                                            {company.totalQuestions !== 1 ? 's' : ''}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => handleOpenCompanyQuestions(company)}
                                            className="h-9 px-4 bg-[#5899B5] hover:bg-[#3D7690] text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition cursor-pointer"
                                        >
                                            <Code2 size={14} />
                                            Manage Questions
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            ) : (
                /* VIEW B: QUESTIONS & TEST CASES CRUD FOR SELECTED COMPANY */
                <>
                    {/* Top Bar */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-5 border-b border-slate-200/80">
                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => setActiveCompany(null)}
                                className="h-10 px-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                            >
                                <ArrowLeft size={14} /> All Companies
                            </button>
                            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center p-2 shrink-0">
                                <CompanyLogoSvg
                                    companyId={activeCompany.id}
                                    company={activeCompany.name}
                                    logoUrl={activeCompany.logoUrl}
                                    website={activeCompany.website}
                                    accentColor={activeCompany.accentColor}
                                    className="w-8 h-8 object-contain"
                                />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-slate-900">
                                    {activeCompany.name} — Coding Questions &amp; Test Cases ({questions.length})
                                </h1>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Add, edit, or delete coding questions, function signatures, starter stubs, and sample/hidden test cases.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2.5">
                            <button
                                type="button"
                                onClick={() => {
                                    setEditingCompany(activeCompany);
                                    setCompanyModalOpen(true);
                                }}
                                className="h-10 px-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                            >
                                <Edit2 size={14} /> Edit Company &amp; Logo
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setEditingQuestion(null);
                                    setQuestionModalOpen(true);
                                }}
                                className="h-10 px-4 bg-[#5899B5] hover:bg-[#3D7690] text-white rounded-xl text-xs font-semibold inline-flex items-center gap-2 cursor-pointer"
                            >
                                <Plus size={15} /> Add Coding Question
                            </button>
                        </div>
                    </div>

                    {/* Filter Bar */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
                                <button
                                    key={diff}
                                    type="button"
                                    onClick={() => setDifficultyFilter(diff)}
                                    className={`h-9 px-3.5 rounded-xl text-xs font-semibold transition cursor-pointer ${difficultyFilter === diff
                                        ? 'bg-[#5899B5] text-white'
                                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                                        }`}
                                >
                                    {diff}
                                </button>
                            ))}
                        </div>

                        <div className="relative w-full sm:w-80">
                            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={questionSearch}
                                onChange={(e) => setQuestionSearch(e.target.value)}
                                placeholder="Search problem title, topic, or description..."
                                className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:bg-white focus:border-[#5899B5]"
                            />
                        </div>
                    </div>

                    {/* Questions Table */}
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
                        {questionsLoading ? (
                            <div className="py-16 flex flex-col items-center justify-center gap-2.5">
                                <Loader2 size={26} className="animate-spin text-[#5899B5]" />
                                <p className="text-xs text-slate-400">Loading coding questions...</p>
                            </div>
                        ) : filteredQuestions.length === 0 ? (
                            <div className="py-16 text-center">
                                <Code2 size={36} className="mx-auto text-slate-200 mb-2" />
                                <p className="text-sm font-semibold text-slate-700">No coding questions found</p>
                                <p className="text-xs text-slate-400 mt-1">
                                    Click &quot;Add Coding Question&quot; above to create one with custom test cases.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-sm">
                                    <thead>
                                        <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                            <th className="px-6 py-3.5 w-16">#</th>
                                            <th className="px-6 py-3.5">Problem Title &amp; Scenario</th>
                                            <th className="px-6 py-3.5">Difficulty</th>
                                            <th className="px-6 py-3.5">Topic</th>
                                            <th className="px-6 py-3.5">Signature</th>
                                            <th className="px-6 py-3.5 text-center">Test Cases</th>
                                            <th className="px-6 py-3.5 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredQuestions.map((q) => {
                                            const totalTcs = q.testCases?.length || 0;
                                            const hiddenTcs = (q.testCases || []).filter((t) => t.isHidden).length;
                                            const sampleTcs = totalTcs - hiddenTcs;

                                            return (
                                                <tr key={q._id} className="hover:bg-slate-50/70 transition-colors">
                                                    <td className="px-6 py-4 font-bold text-slate-700">
                                                        #{q.number}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-slate-900">{q.title}</div>
                                                        <div className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                                                            {q.context || q.frequency}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`px-2.5 py-1 rounded-md text-xs font-bold ${q.difficulty === 'Easy'
                                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                                                                : q.difficulty === 'Medium'
                                                                    ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                                                                    : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                                                                }`}
                                                        >
                                                            {q.difficulty}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-xs font-semibold text-slate-700 whitespace-nowrap">
                                                        {q.topic || '—'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <code className="px-2.5 py-1 bg-slate-100 rounded-md text-xs font-mono text-slate-700">
                                                            {q.fnName || 'solve'}(
                                                            {(q.params || []).map((p) => p.name).join(', ')}) →{' '}
                                                            {q.returnType || 'int'}
                                                        </code>
                                                    </td>
                                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                                        <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 text-xs font-bold">
                                                            {sampleTcs} Sample • {hiddenTcs} Hidden
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                                        <div className="inline-flex items-center gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setEditingQuestion(q);
                                                                    setQuestionModalOpen(true);
                                                                }}
                                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
                                                            >
                                                                <Edit2 size={13} /> Edit &amp; Test Cases
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDeleteQuestion(q)}
                                                                className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 cursor-pointer"
                                                                title="Delete Question"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
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
                </>
            )}

            {/* Modals */}
            <CompanyModal
                isOpen={companyModalOpen}
                company={editingCompany}
                onClose={() => {
                    setCompanyModalOpen(false);
                    setEditingCompany(null);
                }}
                onSave={handleSaveCompany}
            />

            <QuestionModal
                isOpen={questionModalOpen}
                company={activeCompany}
                question={editingQuestion}
                nextNumber={questions.length + 1}
                onClose={() => {
                    setQuestionModalOpen(false);
                    setEditingQuestion(null);
                }}
                onSave={handleSaveQuestion}
            />

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

export default AdminCompanyArena;
