import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import axios from 'axios';
import {
    Terminal, Play, Send, RotateCcw, CheckCircle2, XCircle, AlertTriangle,
    Clock, Code2, Sparkles, ChevronLeft, ChevronRight, Lightbulb, Eye,
    Search, Filter, Trophy, Lock, Cpu, Layers, Check, ArrowLeft, Building2,
    Briefcase, Flame, Award, ExternalLink, Maximize2, Minimize2, History,
    FileText, CheckSquare, Zap, Copy, Loader2, ArrowRight, BookOpen, CalendarCheck
} from 'lucide-react';
import { executeCode, preloadPython, getPythonStatus } from '../../utils/codeRunner';
import CompanyLogoSvg from '../common/CompanyLogoSvg';
import {
    ALL_COMPANY_QUESTIONS,
    COMPANIES_CATALOG,
    COMPANY_CATEGORIES
} from '../../data/companyQuestions';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ============================================================================
// SUPPORTED LANGUAGES (STRICTLY PYTHON 3 & JAVASCRIPT ES6 AT ₹0 COST)
// ============================================================================
const LANGUAGES = [
    { id: 'python', label: 'Python 3', ext: '.py' },
    { id: 'javascript', label: 'JavaScript (ES6)', ext: '.js' }
];

// ============================================================================
// SYNTAX HIGHLIGHTING ENGINE (SINGLE-PASS TOKENIZER, ZERO HTML LEAKAGE)
// ============================================================================
const highlightCode = (code, lang) => {
    if (!code) return '';
    const escapeHtml = (str) =>
        str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const pyKeywords = new Set([
        'def', 'return', 'if', 'elif', 'else', 'for', 'while', 'in', 'range', 'len',
        'min', 'max', 'abs', 'sum', 'sorted', 'print', 'import', 'from', 'as', 'class',
        'pass', 'break', 'continue', 'lambda', 'True', 'False', 'None', 'and', 'or', 'not', 'is'
    ]);
    const jsKeywords = new Set([
        'function', 'const', 'let', 'var', 'return', 'if', 'else', 'for', 'while', 'of',
        'in', 'switch', 'case', 'break', 'continue', 'default', 'new', 'class', 'typeof',
        'instanceof', 'true', 'false', 'null', 'undefined', 'Math', 'Array', 'String', 'Number', 'JSON'
    ]);

    const kwSet = lang === 'javascript' ? jsKeywords : pyKeywords;
    const tokenizer = /("(?:\\.|[^"\n])*"|'(?:\\.|[^'\n])*'|\/\/.*$|#.*$|\b\d+\b|\b[a-zA-Z_][a-zA-Z0-9_]*\b|[^"'\w\s]+|\s+)/gm;

    const tokens = code.match(tokenizer) || [code];
    let html = '';

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        if (!token) continue;
        const esc = escapeHtml(token);

        if ((token.startsWith('"') && token.endsWith('"')) || (token.startsWith("'") && token.endsWith("'"))) {
            html += `<span class="text-amber-300">${esc}</span>`;
        } else if (token.startsWith('//') || (lang === 'python' && token.startsWith('#'))) {
            html += `<span class="text-slate-500 italic">${esc}</span>`;
        } else if (/^\d+$/.test(token)) {
            html += `<span class="text-orange-400 font-semibold">${esc}</span>`;
        } else if (kwSet.has(token)) {
            html += `<span class="text-rose-400 font-semibold">${esc}</span>`;
        } else if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(token)) {
            let nextIdx = i + 1;
            while (nextIdx < tokens.length && /^\s+$/.test(tokens[nextIdx])) nextIdx++;
            if (tokens[nextIdx] && tokens[nextIdx].startsWith('(')) {
                html += `<span class="text-sky-300">${esc}</span>`;
            } else {
                html += esc;
            }
        } else {
            html += esc;
        }
    }

    return html;
};

// ============================================================================
// CODE EDITOR COMPONENT (AUTO-BRACKETS, AUTOCOMPLETE, INDENTATION)
// ============================================================================
const CodeEditor = ({ code, onChange, lang, params = [], minHeight = '400px' }) => {
    const textareaRef = useRef(null);
    const preRef = useRef(null);
    const [suggestions, setSuggestions] = useState([]);
    const [suggestionPos, setSuggestionPos] = useState({ top: 0, left: 0 });
    const [selectedSugIdx, setSelectedSugIdx] = useState(0);

    const handleScroll = (e) => {
        if (preRef.current) {
            preRef.current.scrollTop = e.target.scrollTop;
            preRef.current.scrollLeft = e.target.scrollLeft;
        }
    };

    const KEYWORDS_BY_LANG = {
        python: ['def', 'return', 'if', 'elif', 'else', 'for', 'while', 'in', 'range', 'len', 'min', 'max', 'abs', 'sum', 'sorted', 'append', 'sort', 'print', 'True', 'False', 'None'],
        javascript: ['function', 'const', 'let', 'var', 'return', 'if', 'else', 'for', 'while', 'of', 'in', 'break', 'continue', 'new', 'Math', 'Array', 'String', 'JSON', 'push', 'slice', 'map', 'filter', 'reduce', 'length']
    };

    const paramNames = (params || []).map((p) => p.name);

    const checkSuggestions = (text, cursor) => {
        const textBefore = text.substring(0, cursor);
        const match = textBefore.match(/([a-zA-Z0-9_]{2,})$/);
        if (!match) {
            setSuggestions([]);
            return;
        }
        const query = match[1].toLowerCase();
        const pool = Array.from(new Set([...paramNames, ...(KEYWORDS_BY_LANG[lang] || KEYWORDS_BY_LANG.python)]));
        const matches = pool.filter((w) => w.toLowerCase().startsWith(query) && w.toLowerCase() !== query);
        if (matches.length > 0) {
            const lines = textBefore.split('\n');
            const lineIdx = lines.length;
            const colIdx = lines[lines.length - 1].length;
            setSuggestionPos({
                top: Math.min(lineIdx * 21 + 10, 310),
                left: Math.min(colIdx * 8 + 48, 280)
            });
            setSuggestions(matches.slice(0, 5));
            setSelectedSugIdx(0);
        } else {
            setSuggestions([]);
        }
    };

    const applySuggestion = (sug) => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        const cursor = textarea.selectionStart;
        const textBefore = code.substring(0, cursor);
        const match = textBefore.match(/([a-zA-Z0-9_]{2,})$/);
        if (!match) return;
        const wordStart = cursor - match[1].length;
        const nextCode = code.substring(0, wordStart) + sug + code.substring(cursor);
        onChange(nextCode);
        setSuggestions([]);
        setTimeout(() => {
            textarea.focus();
            textarea.selectionStart = textarea.selectionEnd = wordStart + sug.length;
        }, 0);
    };

    const handleKeyDown = (e) => {
        if (suggestions.length > 0) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedSugIdx((prev) => (prev + 1) % suggestions.length);
                return;
            }
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedSugIdx((prev) => (prev - 1 + suggestions.length) % suggestions.length);
                return;
            }
            if (e.key === 'Enter' || e.key === 'Tab') {
                e.preventDefault();
                applySuggestion(suggestions[selectedSugIdx]);
                return;
            }
            if (e.key === 'Escape') {
                setSuggestions([]);
                return;
            }
        }

        // Bracket & quote auto-closing
        const pairs = { '{': '}', '[': ']', '(': ')', '"': '"', "'": "'" };
        if (pairs[e.key]) {
            e.preventDefault();
            const start = e.target.selectionStart;
            const end = e.target.selectionEnd;
            const open = e.key;
            const close = pairs[open];
            const next = code.substring(0, start) + open + close + code.substring(end);
            onChange(next);
            setTimeout(() => {
                e.target.selectionStart = e.target.selectionEnd = start + 1;
                checkSuggestions(next, start + 1);
            }, 0);
            return;
        }

        // Tab indentation (4 spaces)
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = e.target.selectionStart;
            const end = e.target.selectionEnd;
            const next = code.substring(0, start) + '    ' + code.substring(end);
            onChange(next);
            setTimeout(() => {
                e.target.selectionStart = e.target.selectionEnd = start + 4;
                checkSuggestions(next, start + 4);
            }, 0);
            return;
        }

        // Smart Enter indentation
        if (e.key === 'Enter') {
            const start = e.target.selectionStart;
            const lineStart = code.lastIndexOf('\n', start - 1) + 1;
            const currentLine = code.substring(lineStart, start);
            const indentMatch = currentLine.match(/^\s*/);
            const indent = indentMatch ? indentMatch[0] : '';
            const prevChar = code[start - 1];
            const nextChar = code[start];

            if (prevChar === '{' && nextChar === '}') {
                e.preventDefault();
                const next = code.substring(0, start) + '\n' + indent + '    \n' + indent + code.substring(start);
                onChange(next);
                setTimeout(() => {
                    e.target.selectionStart = e.target.selectionEnd = start + indent.length + 5;
                }, 0);
                return;
            }

            if (prevChar === '{' || prevChar === ':') {
                e.preventDefault();
                const next = code.substring(0, start) + '\n' + indent + '    ' + code.substring(start);
                onChange(next);
                setTimeout(() => {
                    e.target.selectionStart = e.target.selectionEnd = start + indent.length + 5;
                }, 0);
                return;
            }

            if (indent.length > 0) {
                e.preventDefault();
                const next = code.substring(0, start) + '\n' + indent + code.substring(start);
                onChange(next);
                setTimeout(() => {
                    e.target.selectionStart = e.target.selectionEnd = start + indent.length + 1;
                }, 0);
                return;
            }
        }
    };

    const handleTextareaChange = (e) => {
        const val = e.target.value;
        onChange(val);
        checkSuggestions(val, e.target.selectionStart);
    };

    const highlightedHtml = useMemo(() => {
        return highlightCode(code, lang);
    }, [code, lang]);

    const lineCount = useMemo(() => {
        return Math.max(code.split('\n').length, 14);
    }, [code]);

    const editorStyle = {
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        fontSize: '13px',
        lineHeight: '22px',
        letterSpacing: '0px',
        tabSize: 4
    };

    return (
        <div className="relative font-mono text-xs sm:text-sm leading-relaxed overflow-hidden bg-slate-900 rounded-b-3xl">
            <div className="flex" style={{ minHeight }}>
                {/* Line numbers gutter */}
                <div
                    aria-hidden="true"
                    className="select-none py-4 px-2.5 text-right bg-slate-950/60 text-slate-500 font-mono text-xs w-11 border-r border-slate-800 shrink-0"
                >
                    {Array.from({ length: lineCount }).map((_, i) => (
                        <div key={i} style={{ height: '22px', lineHeight: '22px' }}>{i + 1}</div>
                    ))}
                </div>

                {/* Overlaid editor */}
                <div className="relative flex-1 overflow-hidden">
                    <pre
                        ref={preRef}
                        aria-hidden="true"
                        style={editorStyle}
                        className="m-0 p-4 text-slate-100 overflow-hidden whitespace-pre pointer-events-none select-none absolute inset-0 font-normal"
                        dangerouslySetInnerHTML={{ __html: highlightedHtml + '\n' }}
                    />
                    <textarea
                        ref={textareaRef}
                        value={code}
                        onChange={handleTextareaChange}
                        onKeyDown={handleKeyDown}
                        onScroll={handleScroll}
                        style={editorStyle}
                        className="w-full h-full min-h-[400px] p-4 text-transparent caret-emerald-400 bg-transparent outline-none resize-none relative z-10 whitespace-pre overflow-auto font-normal"
                        spellCheck={false}
                        autoCapitalize="off"
                        autoComplete="off"
                        autoCorrect="off"
                    />

                    {/* Autocomplete Suggestions Popup */}
                    {suggestions.length > 0 && (
                        <div
                            className="absolute z-30 bg-slate-950/95 backdrop-blur-sm border border-slate-700 shadow-xl rounded-xl p-1 w-48 font-mono text-xs text-slate-200"
                            style={{ top: suggestionPos.top, left: suggestionPos.left }}
                        >
                            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider px-2 py-1 border-b border-slate-800 flex items-center justify-between">
                                <span>Suggestions</span>
                                <span className="text-[9px] text-slate-500">Tab / ↵</span>
                            </div>
                            {suggestions.map((sug, i) => (
                                <button
                                    key={sug}
                                    type="button"
                                    onClick={() => applySuggestion(sug)}
                                    className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-mono transition flex items-center justify-between cursor-pointer ${selectedSugIdx === i ? 'bg-[#5899B5] text-white font-semibold' : 'hover:bg-slate-800 text-slate-300'
                                        }`}
                                >
                                    <span>{sug}</span>
                                    <span className="text-[10px] opacity-60 font-sans">
                                        {paramNames.includes(sug) ? 'param' : 'keyword'}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// MAIN COMPONENT: STUDENT LOCKED IN LAB / COMPANY ARENA TAB
// ============================================================================
const StudentLockedInLabTab = ({ student }) => {
    const solvedStorageKey = `eth_company_arena_solved_${student?.usn || 'guest'}`;
    const subStorageKey = `eth_company_arena_submissions_${student?.usn || 'guest'}`;

    const [solvedIds, setSolvedIds] = useState(() => {
        try {
            const raw = localStorage.getItem(solvedStorageKey);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    });

    const [submissions, setSubmissions] = useState(() => {
        try {
            const raw = localStorage.getItem(subStorageKey);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    });

    // Navigation State: 'directory' | 'company-list' | 'solve'
    const [activeView, setActiveView] = useState('directory');
    const [selectedCompanyId, setSelectedCompanyId] = useState('tcs');
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
    const [selectedDifficulty, setSelectedDifficulty] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeProblemId, setActiveProblemId] = useState('tcs-1');
    const [selectedLang, setSelectedLang] = useState('python');
    const [code, setCode] = useState('');
    const [showHint, setShowHint] = useState(false);
    const [running, setRunning] = useState(false);
    const [engineStatus, setEngineStatus] = useState('');
    const [runOutput, setRunOutput] = useState(null);
    const [activeSampleIdx, setActiveSampleIdx] = useState(0);
    const [leftPanelTab, setLeftPanelTab] = useState('description'); // 'description' | 'submissions'
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showRules, setShowRules] = useState(true);

    // Live Catalog State (initialized from static catalog, refreshed from MongoDB)
    const [companiesList, setCompaniesList] = useState(() => COMPANIES_CATALOG || []);
    const [allQuestionsList, setAllQuestionsList] = useState(() => ALL_COMPANY_QUESTIONS || []);

    useEffect(() => {
        let active = true;
        axios
            .get(`${API}/coding-arena/catalog`)
            .then((res) => {
                if (!active || !res.data?.success) return;
                const { companies, questions } = res.data.data || {};
                if (Array.isArray(companies) && companies.length > 0) {
                    setCompaniesList(companies);
                }
                if (Array.isArray(questions) && questions.length > 0) {
                    setAllQuestionsList(questions);
                }
            })
            .catch(() => { });
        return () => {
            active = false;
        };
    }, []);

    // Warm up Python 3.11 WebAssembly engine in background
    useEffect(() => {
        preloadPython().catch(() => { });
    }, []);

    const getCompanyQuestions = useCallback(
        (companyId) => {
            if (!companyId || companyId === 'all') return allQuestionsList;
            const norm = String(companyId).toLowerCase().replace(/[^a-z0-9]/g, '');
            return allQuestionsList.filter(
                (q) => String(q.company || '').toLowerCase().replace(/[^a-z0-9]/g, '') === norm
            );
        },
        [allQuestionsList]
    );

    // Active Company & Active Problem helpers
    const currentCompany = useMemo(() => {
        const catalog = companiesList || [];
        const norm = (selectedCompanyId || 'tcs').toLowerCase().replace(/[^a-z0-9]/g, '');
        return (
            catalog.find((c) => c && c.id && c.id.replace(/[^a-z0-9]/g, '') === norm) ||
            catalog[0] || {
                id: 'tcs',
                name: 'TCS',
                category: 'service',
                categoryLabel: 'Service-Based',
                packageRange: '3.36 – 9.0 LPA',
                description: 'TCS technical coding round problems'
            }
        );
    }, [selectedCompanyId, companiesList]);

    const companyQuestions = useMemo(() => {
        return getCompanyQuestions(selectedCompanyId);
    }, [selectedCompanyId, getCompanyQuestions]);

    const activeProblem = useMemo(() => {
        return allQuestionsList.find((q) => q.id === activeProblemId) || companyQuestions[0] || allQuestionsList[0];
    }, [activeProblemId, allQuestionsList, companyQuestions]);

    // Synchronize starter skeleton stub whenever active problem or language changes
    useEffect(() => {
        if (activeProblem?.starter) {
            setCode(activeProblem.starter[selectedLang] || '');
        }
        setRunOutput(null);
        setShowHint(false);
        setActiveSampleIdx(0);
        setLeftPanelTab('description');
    }, [activeProblem, selectedLang]);

    // Handle Escape key to exit fullscreen
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isFullscreen) {
                setIsFullscreen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFullscreen]);

    // Solved counters per company
    const getSolvedCountForCompany = useCallback(
        (companyId) => {
            const qList = getCompanyQuestions(companyId);
            return qList.filter((q) => solvedIds.includes(q.id)).length;
        },
        [solvedIds, getCompanyQuestions]
    );

    const totalSolved = useMemo(() => {
        const validIds = new Set(allQuestionsList.map((q) => q.id));
        return solvedIds.filter((id) => validIds.has(id)).length;
    }, [solvedIds, allQuestionsList]);

    // Filtered questions within the selected company list view
    const filteredCompanyQuestions = useMemo(() => {
        return companyQuestions.filter((q) => {
            if (selectedDifficulty !== 'All' && q.difficulty !== selectedDifficulty) return false;
            if (searchQuery.trim()) {
                const term = searchQuery.toLowerCase();
                const matchTitle = (q.title || '').toLowerCase().includes(term);
                const matchTopic = (q.topic || '').toLowerCase().includes(term);
                const matchDesc = (q.description || '').toLowerCase().includes(term);
                if (!matchTitle && !matchTopic && !matchDesc) return false;
            }
            return true;
        });
    }, [companyQuestions, selectedDifficulty, searchQuery]);

    // Filtered companies in the Directory view
    const filteredCompanies = useMemo(() => {
        const catalog = companiesList || [];
        if (selectedCategoryFilter === 'all') return catalog;
        return catalog.filter((c) => c && c.category === selectedCategoryFilter);
    }, [selectedCategoryFilter, companiesList]);

    // Problem submissions for current active problem
    const problemSubmissions = useMemo(() => {
        return submissions.filter(s => s.problemId === activeProblem?.id);
    }, [submissions, activeProblem?.id]);

    // Run sample test cases
    const handleRunSample = async () => {
        setRunning(true);
        const sampleCases = (activeProblem?.testCases || []).filter(tc => !tc.isHidden);
        const res = await executeCode(selectedLang, code, sampleCases, (s) => setEngineStatus(s));
        const results = res.results || [];
        const allPassed = res.status === 'OK' && results.length > 0 && results.every((r) => r.pass);
        setRunOutput({
            mode: 'run',
            status: res.status,
            error: res.error,
            executionTimeMs: res.executionTimeMs || 0,
            stdout: res.stdout,
            results,
            allPassed
        });
        setRunning(false);
        setEngineStatus('');
    };

    // Submit against all test cases (including hidden)
    const handleSubmitAll = async () => {
        setRunning(true);
        const allCases = activeProblem?.testCases || [];
        const res = await executeCode(selectedLang, code, allCases, (s) => setEngineStatus(s));
        const results = res.results || [];
        const allPassed = res.status === 'OK' && results.length > 0 && results.every((r) => r.pass);
        const passedCount = results.filter((r) => r.pass).length;
        const totalCount = allCases.length;

        if (allPassed && activeProblem?.id && !solvedIds.includes(activeProblem.id)) {
            const nextSolved = [...solvedIds, activeProblem.id];
            setSolvedIds(nextSolved);
            try {
                localStorage.setItem(solvedStorageKey, JSON.stringify(nextSolved));
            } catch { }
        }

        const submissionRecord = {
            id: Date.now(),
            problemId: activeProblem?.id,
            lang: selectedLang,
            code,
            verdict: allPassed ? 'Accepted' : (res.status === 'OK' ? 'Wrong Answer' : res.status),
            passedCount,
            totalCount,
            executionTimeMs: res.executionTimeMs || 0,
            timestamp: new Date().toLocaleTimeString()
        };

        const nextSubmissions = [submissionRecord, ...submissions.slice(0, 99)];
        setSubmissions(nextSubmissions);
        try {
            localStorage.setItem(subStorageKey, JSON.stringify(nextSubmissions));
        } catch { }

        setRunOutput({
            mode: 'submit',
            status: res.status,
            error: res.error,
            executionTimeMs: res.executionTimeMs || 0,
            stdout: res.stdout,
            results,
            allPassed,
            passedCount,
            totalCount
        });
        setRunning(false);
        setEngineStatus('');
    };

    // Navigation helpers
    const openCompany = (companyId) => {
        setSelectedCompanyId(companyId);
        setSelectedDifficulty('All');
        setSearchQuery('');
        setActiveView('company-list');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const openProblemSolver = (problemId) => {
        setActiveProblemId(problemId);
        setActiveView('solve');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const navigateAdjacentProblem = (direction) => {
        const currentList = companyQuestions;
        const currentIndex = currentList.findIndex(q => q.id === activeProblem.id);
        const nextIndex = currentIndex + direction;
        if (nextIndex >= 0 && nextIndex < currentList.length) {
            openProblemSolver(currentList[nextIndex].id);
        }
    };

    // =========================================================================
    // VIEW 1: COMPANY ARENA DIRECTORY (14 RECRUITERS ACROSS 4 SEGMENTS)
    // =========================================================================
    if (activeView === 'directory') {
        const totalQuestionsCount = allQuestionsList.length || 1;
        const completionPct = Math.round((totalSolved / totalQuestionsCount) * 100);

        return (
            <div className="space-y-6 sm:space-y-8 font-sans pb-12">
                {/* Top Hub Header Card matching Student Portal */}
                <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    <div className="space-y-2.5 max-w-2xl">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-50 text-[#5899B5] border border-blue-100">
                                Campus Placement Arena
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-100">
                                {companiesList.length} Top Recruiters ⚡
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100">
                                {allQuestionsList.length} Curated Challenges
                            </span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-semibold text-slate-800">
                            Code2Career — Company-Wise Technical Coding
                        </h2>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Targeted preparation for campus placements. Practice the most frequent coding problems from Service-Based, Product-Based, Next-Gen Startups, and FinTech companies with instant in-browser test validation.
                        </p>
                    </div>

                    {/* Progress indicator card */}
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 shrink-0 w-full lg:w-68 space-y-2.5">
                        <div className="flex items-center justify-between text-xs font-semibold">
                            <span className="text-slate-600">Total Solved</span>
                            <span className="text-slate-900 font-bold">{totalSolved} / {allQuestionsList.length}</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[#5899B5] rounded-full transition-all duration-500"
                                style={{ width: `${Math.max(totalSolved > 0 ? 5 : 0, completionPct)}%` }}
                            />
                        </div>
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                            <span>{Math.max(0, allQuestionsList.length - totalSolved)} remaining</span>
                            <span className="text-[#5899B5]">{completionPct}% Completed</span>
                        </div>
                    </div>
                </div>

                {/* 4 Platform KPI Summary Cards (Identical to Student Dashboard) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                    <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 flex items-center justify-between gap-4 hover:shadow-md hover:border-[#5899B5]/30 transition-all duration-300 group">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-blue-50 text-[#5899B5] rounded-2xl group-hover:scale-105 transition-transform">
                                <Building2 size={24} />
                            </div>
                            <div>
                                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Top Recruiters</span>
                                <span className="text-2xl font-bold text-slate-800">{companiesList.length} Companies</span>
                                <span className="text-xs font-semibold text-[#5899B5] block mt-0.5">
                                    4 Hiring Tracks
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 flex items-center justify-between gap-4 hover:shadow-md hover:border-emerald-500/30 transition-all duration-300 group">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-105 transition-transform">
                                <Code2 size={24} />
                            </div>
                            <div>
                                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Curated Problems</span>
                                <span className="text-2xl font-bold text-slate-800">{allQuestionsList.length} Questions</span>
                                <span className="text-xs font-semibold text-emerald-600 block mt-0.5">
                                    Real Placement Rounds
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 flex items-center justify-between gap-4 hover:shadow-md hover:border-purple-500/30 transition-all duration-300 group">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl group-hover:scale-105 transition-transform">
                                <Trophy size={24} />
                            </div>
                            <div>
                                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Challenges Solved</span>
                                <span className="text-2xl font-bold text-slate-800">{totalSolved}</span>
                                <span className="text-xs font-semibold text-purple-600 block mt-0.5">
                                    {Math.max(0, allQuestionsList.length - totalSolved)} Remaining
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 flex items-center justify-between gap-4 hover:shadow-md hover:border-amber-500/30 transition-all duration-300 group">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl group-hover:scale-105 transition-transform">
                                <Zap size={24} />
                            </div>
                            <div>
                                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Browser Compiler</span>
                                <span className="text-2xl font-bold text-slate-800">₹0 Cost</span>
                                <span className="text-xs font-semibold text-amber-600 block mt-0.5">
                                    Python 3 &amp; JS Wasm
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Category Filters Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
                        <button
                            type="button"
                            onClick={() => setSelectedCategoryFilter('all')}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition shrink-0 ${selectedCategoryFilter === 'all'
                                ? 'bg-[#5899B5] text-white shadow-xs'
                                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80'
                                }`}
                        >
                            All Companies ({(companiesList || []).length})
                        </button>
                        {(COMPANY_CATEGORIES || []).filter(c => c && c.id !== 'all').map(cat => (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => setSelectedCategoryFilter(cat.id)}
                                className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition shrink-0 flex items-center gap-2 ${selectedCategoryFilter === cat.id
                                    ? 'bg-[#5899B5] text-white shadow-xs'
                                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80'
                                    }`}
                            >
                                <span>{cat.label}</span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${selectedCategoryFilter === cat.id ? 'bg-white/20 text-white font-bold' : 'bg-slate-100 text-slate-500'
                                    }`}>
                                    {(companiesList || []).filter(c => c && c.category === cat.id).length}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Companies Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCompanies.map(company => {
                        const companyTotal = getCompanyQuestions(company.id).length || company.totalQuestions || 20;
                        const solvedCount = getSolvedCountForCompany(company.id);
                        const progressPct = companyTotal > 0 ? Math.round((solvedCount / companyTotal) * 100) : 0;

                        return (
                            <div
                                key={company.id}
                                className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-7 hover:shadow-md hover:border-[#5899B5]/30 transition-all duration-300 flex flex-col justify-between group"
                            >
                                <div className="space-y-4">
                                    {/* Top Row: Logo & Package */}
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 group-hover:scale-105 transition-transform flex items-center justify-center p-2.5 shrink-0">
                                            <CompanyLogoSvg
                                                companyId={company.id}
                                                company={company.name}
                                                logoUrl={company.logoUrl}
                                                website={company.website}
                                                accentColor={company.accentColor}
                                                className="w-9 h-9 object-contain"
                                            />
                                        </div>
                                        <div className="flex flex-col items-end gap-1.5">
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${company.badgeClass || 'bg-slate-100 text-slate-700'}`}>
                                                {company.categoryLabel || company.category}
                                            </span>
                                            {company.packageRange && (
                                                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                                                    {company.packageRange}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Company Title & Description */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-800 group-hover:text-[#5899B5] transition-colors">
                                            {company.name}
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                                            {company.description}
                                        </p>
                                    </div>

                                    {/* Focus Area Tags */}
                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                        {(company.focusAreas || []).slice(0, 3).map(area => (
                                            <span
                                                key={area}
                                                className="px-2.5 py-1 bg-slate-50 text-slate-600 rounded-lg text-[11px] font-medium border border-slate-100"
                                            >
                                                {area}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="pt-2 space-y-1.5">
                                        <div className="flex justify-between text-xs font-semibold text-slate-600">
                                            <span>Progress</span>
                                            <span className={solvedCount > 0 ? 'text-[#5899B5]' : 'text-slate-400'}>
                                                {solvedCount} / {companyTotal} Solved ({progressPct}%)
                                            </span>
                                        </div>
                                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-[#5899B5] rounded-full transition-all duration-300"
                                                style={{ width: `${Math.max(solvedCount > 0 ? 5 : 0, progressPct)}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Action CTA */}
                                <div className="pt-6">
                                    <button
                                        type="button"
                                        onClick={() => openCompany(company.id)}
                                        className="w-full py-2.5 px-4 bg-[#5899B5] hover:bg-[#3D7690] text-white rounded-xl text-xs font-semibold transition cursor-pointer shadow-xs flex items-center justify-center gap-2 group-hover:shadow-sm"
                                    >
                                        <span>View {companyTotal} Question{companyTotal !== 1 ? 's' : ''}</span>
                                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    // =========================================================================
    // VIEW 2: COMPANY QUESTION LIST (20 CURATED CHALLENGES)
    // =========================================================================
    if (activeView === 'company-list') {
        const companySolved = getSolvedCountForCompany(selectedCompanyId);
        const companyTotalCount = companyQuestions.length || currentCompany.totalQuestions || 20;

        return (
            <div className="space-y-6 font-sans pb-12">
                {/* Back to All Companies Button */}
                <div className="flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => setActiveView('directory')}
                        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200/80 cursor-pointer shadow-xs transition"
                    >
                        <ArrowLeft size={14} /> Back to All Companies
                    </button>
                    <span className="text-xs text-slate-500 font-medium">
                        Showing {companyQuestions.length} question{companyQuestions.length !== 1 ? 's' : ''} for {currentCompany.name}
                    </span>
                </div>

                {/* Company Banner Card */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-3 shrink-0">
                            <CompanyLogoSvg
                                companyId={currentCompany.id}
                                company={currentCompany.name}
                                logoUrl={currentCompany.logoUrl}
                                website={currentCompany.website}
                                accentColor={currentCompany.accentColor}
                                className="w-10 h-10 object-contain"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${currentCompany.badgeClass || 'bg-slate-100 text-slate-700'}`}>
                                    {currentCompany.categoryLabel || currentCompany.category}
                                </span>
                                {currentCompany.packageRange && (
                                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                                        Package: {currentCompany.packageRange}
                                    </span>
                                )}
                            </div>
                            <h2 className="text-xl sm:text-2xl font-semibold text-slate-800">
                                {currentCompany.name} — Code2Career
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-500 max-w-xl leading-relaxed">
                                {currentCompany.description}
                            </p>
                        </div>
                    </div>

                    {/* Progress Indicator */}
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 w-full md:w-60 shrink-0 space-y-2">
                        <div className="flex justify-between text-xs font-semibold">
                            <span className="text-slate-600">Company Progress</span>
                            <span className="text-[#5899B5]">{companySolved} / {companyTotalCount}</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[#5899B5] rounded-full transition-all duration-300"
                                style={{ width: `${Math.max(companySolved > 0 ? 5 : 0, companyTotalCount > 0 ? (companySolved / companyTotalCount) * 100 : 0)}%` }}
                            />
                        </div>
                        <p className="text-[11px] text-slate-400 text-center font-medium">
                            {Math.max(0, companyTotalCount - companySolved)} problems remaining
                        </p>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                        {['All', 'Easy', 'Medium', 'Hard'].map(diff => (
                            <button
                                key={diff}
                                type="button"
                                onClick={() => setSelectedDifficulty(diff)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition ${selectedDifficulty === diff
                                    ? 'bg-[#5899B5] text-white shadow-xs'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                            >
                                {diff}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full sm:w-72">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search questions by title or topic..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#5899B5] focus:bg-white"
                        />
                    </div>
                </div>

                {/* Questions List */}
                <div className="space-y-3">
                    {filteredCompanyQuestions.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 text-slate-500 text-sm">
                            No problems match your current filter. Try selecting All or clearing the search.
                        </div>
                    ) : (
                        filteredCompanyQuestions.map((q) => {
                            const isSolved = solvedIds.includes(q.id);

                            return (
                                <div
                                    key={q.id}
                                    className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 hover:border-[#5899B5]/40 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-semibold text-xs shrink-0 ${isSolved ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                                            }`}>
                                            {isSolved ? <Check size={16} /> : `#${q.number}`}
                                        </div>

                                        <div className="space-y-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h4 className="text-sm font-semibold text-slate-800 hover:text-[#5899B5] transition-colors cursor-pointer" onClick={() => openProblemSolver(q.id)}>
                                                    {q.title}
                                                </h4>
                                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase ${q.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                                    q.difficulty === 'Medium' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                                                        'bg-rose-50 text-rose-700 border border-rose-100'
                                                    }`}>
                                                    {q.difficulty}
                                                </span>
                                                <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-purple-50 text-purple-700 border border-purple-100">
                                                    {q.frequency}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500 line-clamp-1">
                                                <span className="font-semibold text-slate-600">Scenario:</span> {q.context}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end shrink-0">
                                        <span className="text-[11px] font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 hidden md:block">
                                            {q.topic}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => openProblemSolver(q.id)}
                                            className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition flex items-center gap-1.5 ${isSolved
                                                ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                                                : 'bg-[#5899B5] hover:bg-[#3D7690] text-white shadow-xs'
                                                }`}
                                        >
                                            <span>{isSolved ? 'Solve Again' : 'Solve Challenge'}</span>
                                            <ArrowRight size={13} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        );
    }

    // =========================================================================
    // VIEW 3: SEPARATE DEDICATED PROBLEM SOLVER PAGE (FULLSCREEN IDE)
    // =========================================================================
    const sampleCases = (activeProblem?.testCases || []).filter(tc => !tc.isHidden);
    const isCurrentSolved = solvedIds.includes(activeProblem?.id);

    return (
        <div className={`space-y-5 font-sans ${isFullscreen ? 'fixed inset-0 z-50 bg-[#0F172A] p-4 sm:p-6 overflow-y-auto' : 'pb-12'}`}>
            {/* Top Navigation & Breadcrumbs Bar */}
            <div className={`flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl border ${isFullscreen ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-100 shadow-sm'
                }`}>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setActiveView('company-list')}
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border cursor-pointer transition ${isFullscreen
                            ? 'bg-slate-700 hover:bg-slate-600 text-slate-200 border-slate-600'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80'
                            }`}
                    >
                        <ArrowLeft size={13} /> Back to {currentCompany.name} Questions
                    </button>

                    <div className="hidden sm:flex items-center gap-2">
                        <CompanyLogoSvg
                            companyId={currentCompany.id}
                            company={currentCompany.name}
                            logoUrl={currentCompany.logoUrl}
                            website={currentCompany.website}
                            accentColor={currentCompany.accentColor}
                            className="w-5 h-5 object-contain"
                        />
                        <span className="text-xs font-semibold text-slate-400">/</span>
                        <span className="text-xs font-semibold text-slate-700 truncate max-w-xs">
                            Problem #{activeProblem?.number}: {activeProblem?.title}
                        </span>
                    </div>
                </div>

                {/* Right Action Controls: Prev / Next / Fullscreen */}
                <div className="flex items-center gap-2">
                    {isCurrentSolved && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 size={12} /> Solved
                        </span>
                    )}

                    <button
                        type="button"
                        onClick={() => navigateAdjacentProblem(-1)}
                        className={`p-2 rounded-xl border text-xs cursor-pointer transition ${isFullscreen
                            ? 'bg-slate-700 hover:bg-slate-600 text-slate-300 border-slate-600'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200/80'
                            }`}
                        title="Previous Question"
                    >
                        <ChevronLeft size={16} />
                    </button>

                    <button
                        type="button"
                        onClick={() => navigateAdjacentProblem(1)}
                        className={`p-2 rounded-xl border text-xs cursor-pointer transition ${isFullscreen
                            ? 'bg-slate-700 hover:bg-slate-600 text-slate-300 border-slate-600'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200/80'
                            }`}
                        title="Next Question"
                    >
                        <ChevronRight size={16} />
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className={`p-2 rounded-xl border text-xs cursor-pointer transition ${isFullscreen
                            ? 'bg-[#5899B5] text-white border-[#5899B5]'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200/80'
                            }`}
                        title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Fullscreen Mode'}
                    >
                        {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                    </button>
                </div>
            </div>

            {/* Solver Guidelines & Evaluation Rules Card */}
            <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${isFullscreen
                ? 'bg-slate-800/90 border-slate-700 text-slate-200'
                : 'bg-white border-slate-100 shadow-sm text-slate-700'
                }`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-start sm:items-center gap-3">
                        <div className={`p-2.5 rounded-xl shrink-0 ${isFullscreen ? 'bg-sky-500/20 text-sky-400' : 'bg-blue-50 text-[#5899B5]'
                            }`}>
                            <Code2 size={20} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h4 className={`text-sm font-semibold ${isFullscreen ? 'text-white' : 'text-slate-800'}`}>
                                    Real In-Browser Compiler • Any Valid Logic Accepted
                                </h4>
                                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
                                    No Hardcoded Checks
                                </span>
                                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-blue-50 text-[#5899B5] border border-blue-100">
                                    Python 3.11 &amp; JS ES6
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Your code is dynamically compiled and executed against test cases. Whatever logic you write will pass if it returns the right result.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowRules(!showRules)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition cursor-pointer shrink-0 self-start md:self-auto ${isFullscreen
                            ? 'bg-slate-700 hover:bg-slate-600 text-slate-200 border-slate-600'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200/80'
                            }`}
                    >
                        {showRules ? 'Hide Rules' : 'View Solver Rules'}
                    </button>
                </div>

                {showRules && (
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                        <div className={`p-3 rounded-xl border ${isFullscreen ? 'bg-slate-900/60 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-600'
                            }`}>
                            <div className={`font-semibold flex items-center gap-1.5 mb-1 ${isFullscreen ? 'text-white' : 'text-slate-800'}`}>
                                <span className="w-5 h-5 rounded-full bg-blue-100 text-[#5899B5] text-[11px] font-bold flex items-center justify-center">1</span>
                                Keep Function Name
                            </div>
                            <p className="text-[11px] leading-relaxed">
                                Keep your main entry function named <code className="text-[#5899B5] font-mono font-bold">solve(...)</code>. You can write custom helper functions inside or outside it.
                            </p>
                        </div>

                        <div className={`p-3 rounded-xl border ${isFullscreen ? 'bg-slate-900/60 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-600'
                            }`}>
                            <div className={`font-semibold flex items-center gap-1.5 mb-1 ${isFullscreen ? 'text-white' : 'text-slate-800'}`}>
                                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-bold flex items-center justify-center">2</span>
                                Always Return Result
                            </div>
                            <p className="text-[11px] leading-relaxed">
                                Always <code className="text-emerald-700 font-mono font-bold">return</code> your calculated output. You can still use <code className="font-mono">print()</code> / <code className="font-mono">console.log()</code> to debug!
                            </p>
                        </div>

                        <div className={`p-3 rounded-xl border ${isFullscreen ? 'bg-slate-900/60 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-600'
                            }`}>
                            <div className={`font-semibold flex items-center gap-1.5 mb-1 ${isFullscreen ? 'text-white' : 'text-slate-800'}`}>
                                <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 text-[11px] font-bold flex items-center justify-center">3</span>
                                Write Any Valid Logic
                            </div>
                            <p className="text-[11px] leading-relaxed">
                                Loops, recursion, two-pointers, built-in methods, math formulas—<strong>all approaches are accepted</strong> as long as outputs match.
                            </p>
                        </div>

                        <div className={`p-3 rounded-xl border ${isFullscreen ? 'bg-slate-900/60 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-600'
                            }`}>
                            <div className={`font-semibold flex items-center gap-1.5 mb-1 ${isFullscreen ? 'text-white' : 'text-slate-800'}`}>
                                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-[11px] font-bold flex items-center justify-center">4</span>
                                Watch Loop Limits
                            </div>
                            <p className="text-[11px] leading-relaxed">
                                Avoid infinite loops. The compiler has a 2500ms safety timeout to protect your browser tab from freezing.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Split Screen Layout (Left: Description, Right: Code Editor & Console) */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
                {/* LEFT COLUMN: Problem Details, Scenario, Constraints, Hint */}
                <div className="xl:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm space-y-5">
                    {/* Panel Tabs */}
                    <div className="flex border-b border-slate-100 pb-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setLeftPanelTab('description')}
                            className={`text-xs font-semibold pb-2 cursor-pointer transition border-b-2 ${leftPanelTab === 'description'
                                ? 'border-[#5899B5] text-[#5899B5]'
                                : 'border-transparent text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            Problem Statement
                        </button>
                        <button
                            type="button"
                            onClick={() => setLeftPanelTab('submissions')}
                            className={`text-xs font-semibold pb-2 cursor-pointer transition border-b-2 flex items-center gap-1.5 ${leftPanelTab === 'submissions'
                                ? 'border-[#5899B5] text-[#5899B5]'
                                : 'border-transparent text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            <span>Submissions</span>
                            <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-[10px] text-slate-600 font-semibold">
                                {problemSubmissions.length}
                            </span>
                        </button>
                    </div>

                    {leftPanelTab === 'description' ? (
                        <div className="space-y-4">
                            {/* Title & Metadata */}
                            <div>
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-semibold uppercase ${activeProblem.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                        activeProblem.difficulty === 'Medium' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                                            'bg-rose-50 text-rose-700 border border-rose-100'
                                        }`}>
                                        {activeProblem.difficulty}
                                    </span>
                                    <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-purple-50 text-purple-700 border border-purple-100">
                                        {activeProblem.frequency}
                                    </span>
                                    <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-50 text-slate-600 border border-slate-100">
                                        {activeProblem.topic}
                                    </span>
                                </div>
                                <h3 className="text-lg font-semibold text-slate-800">
                                    #{activeProblem.number}. {activeProblem.title}
                                </h3>
                            </div>

                            {/* Real-World Context Callout */}
                            <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 text-xs text-slate-700 leading-relaxed">
                                <span className="font-semibold text-slate-900 block mb-0.5">Engineering Context:</span>
                                {activeProblem.context}
                            </div>

                            {/* Problem Statement */}
                            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2">
                                <p className="whitespace-pre-line">{activeProblem.description}</p>
                            </div>

                            {/* Constraints Section */}
                            <div className="space-y-1.5 pt-2">
                                <h5 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">Constraints:</h5>
                                <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 font-mono">
                                    {(activeProblem.constraints || []).map((c, i) => (
                                        <li key={i}>{c}</li>
                                    ))}
                                </ul>
                            </div>

                            {/* Algorithmic Hint Accordion */}
                            {activeProblem.hint && (
                                <div className="pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowHint(!showHint)}
                                        className="text-xs font-semibold text-[#5899B5] hover:text-[#3D7690] flex items-center gap-1.5 cursor-pointer"
                                    >
                                        <Lightbulb size={14} />
                                        <span>{showHint ? 'Hide Hint' : 'View Algorithmic Hint'}</span>
                                    </button>
                                    {showHint && (
                                        <div className="mt-2 p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl text-xs text-amber-900 leading-relaxed">
                                            {activeProblem.hint}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Sample Examples Preview */}
                            <div className="space-y-2 pt-2 border-t border-slate-100">
                                <h5 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">Sample Test Cases:</h5>
                                <div className="space-y-2">
                                    {sampleCases.map((tc, idx) => (
                                        <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-mono space-y-1">
                                            <div><span className="text-slate-400 font-sans font-medium">Input: </span>{JSON.stringify(tc.args)}</div>
                                            <div><span className="text-slate-400 font-sans font-medium">Output: </span><span className="text-emerald-700 font-semibold">{JSON.stringify(tc.expected)}</span></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Submissions Tab */
                        <div className="space-y-3">
                            {problemSubmissions.length === 0 ? (
                                <div className="text-center py-8 text-xs text-slate-400">
                                    No submissions yet for this problem. Write your logic and click Submit!
                                </div>
                            ) : (
                                problemSubmissions.map(sub => (
                                    <div key={sub.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 text-xs space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className={`px-2 py-0.5 rounded-md font-semibold text-[10px] ${sub.verdict === 'Accepted'
                                                ? 'bg-emerald-100 text-emerald-800'
                                                : 'bg-rose-100 text-rose-800'
                                                }`}>
                                                {sub.verdict}
                                            </span>
                                            <span className="text-slate-400 text-[10px]">{sub.timestamp}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-slate-600 font-mono text-[11px]">
                                            <span>Lang: {sub.lang}</span>
                                            <span>Passed: {sub.passedCount} / {sub.totalCount} ({sub.executionTimeMs} ms)</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* RIGHT COLUMN: Code Editor, Language Switcher, Output Console */}
                <div className="xl:col-span-7 space-y-4">
                    <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-sm overflow-hidden">
                        {/* Editor Header Bar */}
                        <div className="px-5 py-3.5 bg-slate-800/90 border-b border-slate-700 flex flex-wrap items-center justify-between gap-3">
                            {/* Window Dots & Language Switcher */}
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                                    <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                                    <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
                                </div>
                                <div className="flex items-center gap-1.5">
                                    {LANGUAGES.map(l => (
                                        <button
                                            key={l.id}
                                            type="button"
                                            onClick={() => setSelectedLang(l.id)}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition ${selectedLang === l.id
                                                ? 'bg-[#5899B5] text-white shadow-xs'
                                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                                }`}
                                        >
                                            {l.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Editor Utilities */}
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setCode(activeProblem.starter[selectedLang] || '')}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                                    title="Reset Code Stub"
                                >
                                    <RotateCcw size={15} />
                                </button>
                                <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                    {selectedLang === 'python' ? 'Python 3 (Wasm)' : 'JavaScript (Worker)'}
                                </span>
                            </div>
                        </div>

                        {/* Interactive Code Editor */}
                        <CodeEditor
                            code={code}
                            onChange={setCode}
                            lang={selectedLang}
                            params={activeProblem.params}
                            minHeight="400px"
                        />

                        {/* Editor Bottom Actions Bar */}
                        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                            <div className="text-xs text-slate-400 font-mono">
                                {running ? (
                                    <span className="text-sky-400 flex items-center gap-1.5">
                                        <Loader2 size={13} className="animate-spin" /> {engineStatus || 'Running test cases in browser...'}
                                    </span>
                                ) : (
                                    <span>Method: <code className="text-sky-300">solve({(activeProblem.params || []).map(p => p.name).join(', ')})</code></span>
                                )}
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    disabled={running}
                                    onClick={handleRunSample}
                                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold cursor-pointer transition flex items-center gap-1.5 border border-slate-700 disabled:opacity-50"
                                >
                                    <Play size={13} /> Run Samples
                                </button>
                                <button
                                    type="button"
                                    disabled={running}
                                    onClick={handleSubmitAll}
                                    className="px-5 py-2 bg-[#5899B5] hover:bg-[#3D7690] text-white rounded-xl text-xs font-semibold cursor-pointer transition flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                                >
                                    <Send size={13} /> Submit Solution
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* EXECUTION RESULTS CONSOLE */}
                    {runOutput && (
                        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5 sm:p-6 shadow-sm space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                <div className="flex items-center gap-2">
                                    <span className={`w-2.5 h-2.5 rounded-full ${runOutput.allPassed ? 'bg-emerald-400' : 'bg-rose-400'
                                        }`} />
                                    <h4 className="text-sm font-semibold text-white">
                                        {runOutput.mode === 'submit' ? 'Submission Verdict' : 'Sample Test Run'}
                                    </h4>
                                </div>
                                <div className="text-xs font-mono text-slate-400">
                                    Runtime: {runOutput.executionTimeMs} ms
                                </div>
                            </div>

                            {/* Error / Diagnostic Banner */}
                            {runOutput.error && (
                                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs leading-relaxed space-y-2">
                                    <div className="font-semibold text-sm flex items-center gap-2 text-rose-400">
                                        <AlertTriangle size={16} />
                                        <span>{runOutput.status || 'Execution Error'}</span>
                                    </div>
                                    <pre className="font-mono text-rose-200 bg-slate-950/80 p-3 rounded-xl whitespace-pre-wrap overflow-x-auto text-xs border border-rose-500/20">
                                        {runOutput.error}
                                    </pre>
                                </div>
                            )}

                            {/* Submission Verdict Banner */}
                            {!runOutput.error && runOutput.mode === 'submit' && (
                                <div className={`p-4 rounded-2xl border text-xs leading-relaxed ${runOutput.allPassed
                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                                    : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                                    }`}>
                                    <div className="font-semibold text-sm mb-1 flex items-center gap-2">
                                        {runOutput.allPassed ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                                        {runOutput.allPassed ? 'Accepted — All Test Cases Passed!' : 'Wrong Answer — Some Test Cases Failed'}
                                    </div>
                                    <p>
                                        Passed {runOutput.passedCount} of {runOutput.totalCount} test cases.
                                    </p>
                                </div>
                            )}

                            {/* Sample Run Verdict Banner */}
                            {!runOutput.error && runOutput.mode === 'run' && (
                                <div className={`p-4 rounded-2xl border text-xs leading-relaxed ${runOutput.allPassed
                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                                    : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                                    }`}>
                                    <div className="font-semibold text-sm mb-1 flex items-center gap-2">
                                        {runOutput.allPassed ? <CheckCircle2 size={16} className="text-emerald-400" /> : <XCircle size={16} className="text-amber-400" />}
                                        {runOutput.allPassed
                                            ? 'Sample Test Cases Passed!'
                                            : `Sample Test Cases Failed (${(runOutput.results || []).filter(r => r.pass).length} / ${(runOutput.results || []).length} passed)`}
                                    </div>
                                    <p className="opacity-80">
                                        {runOutput.allPassed
                                            ? 'Your code passed all sample test cases. Click "Submit Solution" to test against hidden test cases.'
                                            : 'Inspect the test case results below to debug and refine your solution.'}
                                    </p>
                                </div>
                            )}

                            {/* Sample Results Tabs */}
                            {runOutput.results && runOutput.results.length > 0 && (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                                        {runOutput.results.map((res, i) => (
                                            <button
                                                key={i}
                                                type="button"
                                                onClick={() => setActiveSampleIdx(i)}
                                                className={`px-3 py-1 rounded-lg text-xs font-mono cursor-pointer transition flex items-center gap-1.5 ${activeSampleIdx === i
                                                    ? 'bg-slate-700 text-white font-semibold'
                                                    : 'text-slate-400 hover:bg-slate-800'
                                                    }`}
                                            >
                                                <span className={`w-1.5 h-1.5 rounded-full ${res.pass ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                                                Case {i + 1}
                                            </button>
                                        ))}
                                    </div>

                                    {runOutput.results[activeSampleIdx] && (
                                        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs font-mono space-y-2">
                                            <div>
                                                <span className="text-slate-500 block text-[10px] uppercase tracking-wider">Input Arguments</span>
                                                <span className="text-slate-300">{JSON.stringify(runOutput.results[activeSampleIdx].args)}</span>
                                            </div>
                                            <div>
                                                <span className="text-slate-500 block text-[10px] uppercase tracking-wider">Expected Output</span>
                                                <span className="text-emerald-400">{JSON.stringify(runOutput.results[activeSampleIdx].expected)}</span>
                                            </div>
                                            <div>
                                                <span className="text-slate-500 block text-[10px] uppercase tracking-wider">Actual Output</span>
                                                <span className={runOutput.results[activeSampleIdx].pass ? 'text-emerald-400' : 'text-rose-400'}>
                                                    {runOutput.results[activeSampleIdx].actual !== undefined
                                                        ? JSON.stringify(runOutput.results[activeSampleIdx].actual)
                                                        : runOutput.results[activeSampleIdx].error || 'undefined'}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Standard Output / Logs */}
                            {runOutput.stdout && (
                                <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs font-mono text-slate-300">
                                    <span className="text-[10px] text-slate-500 block uppercase mb-1">Standard Output (print / console.log)</span>
                                    <pre className="whitespace-pre-wrap">{runOutput.stdout}</pre>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentLockedInLabTab;
