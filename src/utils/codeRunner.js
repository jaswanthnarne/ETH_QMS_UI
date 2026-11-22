/**
 * codeRunner.js
 * 
 * 100% Zero-Cost Client-Side Execution Engine for Antigravity / Ethnotech Coding Arena.
 * Runs on Vercel at ₹0 cost, supporting 1,500+ simultaneous students.
 * 
 * Engines (Strictly Python 3 & JavaScript):
 * 1. Python 3: Real CPython 3.11 in WebAssembly via Pyodide. Executes arbitrary algorithms, recursion, DP, data structures, and standard libraries.
 * 2. JavaScript: Isolated native Web Worker with watchdog timeout, console.log interception, and deep equality.
 */

// Deep equality comparator for test case verification
export const deepEqual = (a, b) => {
    if (a === b) return true;
    if (typeof a === 'number' && typeof b === 'number') {
        if (Number.isNaN(a) && Number.isNaN(b)) return true;
        return Math.abs(a - b) < 1e-6;
    }
    if (a == null || b == null) return a === b;
    if (typeof a !== typeof b) return false;
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (!deepEqual(a[i], b[i])) return false;
        }
        return true;
    }
    if (typeof a === 'object' && typeof b === 'object') {
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);
        if (keysA.length !== keysB.length) return false;
        for (let k of keysA) {
            if (!deepEqual(a[k], b[k])) return false;
        }
        return true;
    }
    return false;
};

// In-thread synchronous fallback for JavaScript execution if Web Workers are restricted by browser policy/extensions
export const executeJavaScriptInThread = (code, testCases) => {
    const tStart = performance.now();
    const results = [];
    const logs = [];

    const originalLog = console.log;
    console.log = function(...args) {
        logs.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
    };

    try {
        const factory = new Function(
            code + "\n\n" +
            "if (typeof solve !== 'function') { throw new Error(\"Missing function definition: 'function solve(...)' was not found in your code.\"); }\n" +
            "return solve;"
        );
        const solveFn = factory();

        for (let i = 0; i < testCases.length; i++) {
            const tc = testCases[i];
            const argsCopy = JSON.parse(JSON.stringify(tc.args));
            logs.length = 0;
            const t0 = performance.now();
            let actual = solveFn(...argsCopy);
            const t1 = performance.now();

            if (typeof actual === 'number' && typeof tc.expected === 'number') {
                if (Number.isInteger(tc.expected) && !Number.isInteger(actual) && Math.abs(actual - tc.expected) < 1e-6) {
                    actual = Math.round(actual);
                }
            }

            const pass = deepEqual(actual, tc.expected);
            results.push({
                index: i + 1,
                args: tc.args,
                expected: tc.expected,
                actual: actual === undefined ? 'undefined' : actual,
                pass,
                isHidden: Boolean(tc.isHidden),
                timeMs: Math.max(1, Math.round((t1 - t0) * 10) / 10),
                stdout: logs.join('\n')
            });
        }

        console.log = originalLog;
        const totalMs = Math.round(performance.now() - tStart);
        const allPass = results.length > 0 && results.every(r => r.pass);
        return {
            status: allPass ? 'OK' : 'Wrong Answer',
            executionTimeMs: totalMs,
            results
        };
    } catch (err) {
        console.log = originalLog;
        const totalMs = Math.round(performance.now() - tStart);
        return {
            status: 'Runtime / Syntax Error',
            error: err && err.message ? err.message : String(err),
            executionTimeMs: totalMs,
            results: []
        };
    }
};

// ============================================================================
// 1. JAVASCRIPT EXECUTION ENGINE (NATIVE WEB WORKER WITH INSTANT IN-THREAD FALLBACK)
// ============================================================================
export const executeJavaScript = (code, testCases) => {
    return new Promise((resolve) => {
        try {
            const workerScript = `
                ${deepEqual.toString()}

                self.onmessage = function(e) {
                    const { code, testCases } = e.data;
                    const results = [];
                    const logs = [];

                    const originalLog = console.log;
                    console.log = function(...args) {
                        logs.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
                    };

                    try {
                        const factory = new Function(
                            code + "\\n\\n" +
                            "if (typeof solve !== 'function') { throw new Error(\\"Missing function definition: 'function solve(...)' was not found in your code.\\"); }\\n" +
                            "return solve;"
                        );
                        const solveFn = factory();

                        for (let i = 0; i < testCases.length; i++) {
                            const tc = testCases[i];
                            const argsCopy = JSON.parse(JSON.stringify(tc.args));
                            logs.length = 0;
                            const t0 = performance.now();
                            let actual = solveFn(...argsCopy);
                            const t1 = performance.now();

                            if (typeof actual === 'number' && typeof tc.expected === 'number') {
                                if (Number.isInteger(tc.expected) && !Number.isInteger(actual) && Math.abs(actual - tc.expected) < 1e-6) {
                                    actual = Math.round(actual);
                                }
                            }

                            const pass = deepEqual(actual, tc.expected);
                            results.push({
                                index: i + 1,
                                args: tc.args,
                                expected: tc.expected,
                                actual: actual === undefined ? 'undefined' : actual,
                                pass,
                                isHidden: Boolean(tc.isHidden),
                                timeMs: Math.max(1, Math.round((t1 - t0) * 10) / 10),
                                stdout: logs.join('\\n')
                            });
                        }

                        const allPass = results.length > 0 && results.every(r => r.pass);
                        self.postMessage({ status: allPass ? 'OK' : 'Wrong Answer', results });
                    } catch (err) {
                        self.postMessage({
                            status: 'Runtime / Syntax Error',
                            error: err && err.message ? err.message : String(err),
                            results
                        });
                    }
                };
            `;

            const blob = new Blob([workerScript], { type: 'application/javascript' });
            const url = URL.createObjectURL(blob);
            let worker;

            try {
                worker = new Worker(url);
            } catch (err) {
                // If Worker creation fails (e.g. extension or CSP blocked blob), use in-thread runner
                URL.revokeObjectURL(url);
                return resolve(executeJavaScriptInThread(code, testCases));
            }

            const timeoutId = setTimeout(() => {
                try { worker.terminate(); } catch {}
                URL.revokeObjectURL(url);
                resolve({
                    status: 'Time Limit Exceeded',
                    error: 'Execution exceeded 2500ms limit. Please check for infinite while/for loops!',
                    executionTimeMs: 2500,
                    results: []
                });
            }, 2500);

            worker.onmessage = (e) => {
                clearTimeout(timeoutId);
                try { worker.terminate(); } catch {}
                URL.revokeObjectURL(url);
                const results = e.data.results || [];
                const totalTime = results.reduce((acc, r) => acc + (r.timeMs || 0), 0);
                resolve({
                    ...e.data,
                    executionTimeMs: Math.max(1, Math.round(totalTime))
                });
            };

            worker.onerror = () => {
                clearTimeout(timeoutId);
                try { worker.terminate(); } catch {}
                URL.revokeObjectURL(url);
                resolve(executeJavaScriptInThread(code, testCases));
            };

            worker.postMessage({ code, testCases });
        } catch {
            resolve(executeJavaScriptInThread(code, testCases));
        }
    });
};

// ============================================================================
// 2. PYTHON 3 EXECUTION ENGINE (PYODIDE WEBASSEMBLY - REAL CPYTHON 3.11)
// ============================================================================
let pyodideInstance = null;
let pyodidePromise = null;
let pythonStatus = 'idle'; // 'idle' | 'loading' | 'ready' | 'error'

export const getPythonStatus = () => pythonStatus;

export const preloadPython = async (onStatus) => {
    if (pyodideInstance) {
        pythonStatus = 'ready';
        return pyodideInstance;
    }
    if (pyodidePromise) return pyodidePromise;

    pythonStatus = 'loading';
    pyodidePromise = (async () => {
        try {
            if (typeof window === 'undefined') {
                throw new Error('Pyodide can only run in the browser.');
            }

            const PYODIDE_CDNS = [
                'https://cdn.jsdelivr.net/pyodide/v0.26.1/full/',
                'https://cdnjs.cloudflare.com/ajax/libs/pyodide/0.26.1/full/'
            ];

            // 1. Load Pyodide bootstrap script from CDN if not already on window
            if (!window.loadPyodide) {
                if (onStatus) onStatus('Loading Python 3.11 WebAssembly Runtime...');
                let loaded = false;

                for (const cdn of PYODIDE_CDNS) {
                    try {
                        await new Promise((resolve, reject) => {
                            const script = document.createElement('script');
                            script.src = `${cdn}pyodide.js`;
                            script.async = true;
                            script.onload = () => resolve();
                            script.onerror = () => reject(new Error(`Failed to fetch from ${cdn}`));
                            document.head.appendChild(script);
                        });
                        if (window.loadPyodide) {
                            loaded = true;
                            break;
                        }
                    } catch {}
                }

                if (!loaded && !window.loadPyodide) {
                    throw new Error('Failed to download Python 3.11 WebAssembly from CDN. Please check your internet connection or switch to JavaScript (which runs 100% offline).');
                }
            }

            // 2. Initialize CPython WebAssembly VM
            if (onStatus) onStatus('Initializing Python 3.11 Virtual Machine...');
            const py = await window.loadPyodide({
                indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.1/full/'
            });

            pyodideInstance = py;
            pythonStatus = 'ready';
            if (onStatus) onStatus('Python 3.11 Ready!');
            return py;
        } catch (err) {
            pythonStatus = 'error';
            pyodidePromise = null;
            throw err;
        }
    })();

    return pyodidePromise;
};

const cleanPythonTraceback = (msg) => {
    if (!msg) return 'Unknown Python Error';
    const lines = msg.split('\n');
    const filtered = lines.filter((l) => !l.includes('/lib/python3') && !l.includes('pyodide/_base.py') && !l.includes('File "<exec>"'));
    return filtered.join('\n').trim() || msg;
};

export const executePython = async (code, testCases, onStatus) => {
    const tStart = performance.now();
    try {
        const pyodide = await preloadPython(onStatus);

        const stdoutLogs = [];
        pyodide.setStdout({
            batched: (msg) => {
                stdoutLogs.push(msg);
            }
        });

        // 1. Reset namespace and run student's code to declare solve
        try {
            pyodide.runPython(`
import sys
import json

if 'solve' in globals():
    del solve
`);
            await pyodide.runPythonAsync(code);
        } catch (syntaxErr) {
            return {
                status: 'Syntax / Runtime Error',
                error: cleanPythonTraceback(syntaxErr.message),
                executionTimeMs: Math.round(performance.now() - tStart),
                results: []
            };
        }

        const hasSolve = pyodide.runPython("'solve' in globals() and callable(solve)");
        if (!hasSolve) {
            return {
                status: 'Compilation Error',
                error: "Missing entry function: 'def solve(...):' was not found in your Python code.",
                executionTimeMs: Math.round(performance.now() - tStart),
                results: []
            };
        }

        // 2. Run each test case against real CPython using pyodide.globals.set
        const results = [];
        for (let i = 0; i < testCases.length; i++) {
            const tc = testCases[i];
            stdoutLogs.length = 0;
            const t0 = performance.now();
            try {
                // Pass args cleanly into Pyodide globals without string escaping corruption
                pyodide.globals.set('_raw_args_json', JSON.stringify(tc.args));

                const pyRunner = `
import json

def _custom_serializer(o):
    if isinstance(o, (set, frozenset)):
        return list(o)
    return str(o)

_raw_args = json.loads(_raw_args_json)
_actual_res = solve(*_raw_args)
json.dumps(_actual_res, default=_custom_serializer)
`;
                const resJson = await pyodide.runPythonAsync(pyRunner);
                const t1 = performance.now();
                let actual = JSON.parse(resJson);

                if (typeof actual === 'number' && typeof tc.expected === 'number') {
                    if (Number.isInteger(tc.expected) && !Number.isInteger(actual) && Math.abs(actual - tc.expected) < 1e-6) {
                        actual = Math.round(actual);
                    }
                }

                const pass = deepEqual(actual, tc.expected);
                results.push({
                    index: i + 1,
                    args: tc.args,
                    expected: tc.expected,
                    actual: actual === undefined ? 'None' : actual,
                    pass,
                    isHidden: Boolean(tc.isHidden),
                    timeMs: Math.max(1, Math.round((t1 - t0) * 10) / 10),
                    stdout: stdoutLogs.join('\n')
                });
            } catch (runErr) {
                const t1 = performance.now();
                results.push({
                    index: i + 1,
                    args: tc.args,
                    expected: tc.expected,
                    actual: null,
                    error: cleanPythonTraceback(runErr.message),
                    pass: false,
                    isHidden: Boolean(tc.isHidden),
                    timeMs: Math.max(1, Math.round((t1 - t0) * 10) / 10),
                    stdout: stdoutLogs.join('\n')
                });
            }
        }

        const totalMs = Math.round(performance.now() - tStart);
        const allPass = results.length > 0 && results.every((r) => r.pass);
        return {
            status: allPass ? 'OK' : 'Wrong Answer',
            executionTimeMs: totalMs,
            results
        };
    } catch (err) {
        return {
            status: 'Engine Error',
            error: err.message || String(err),
            executionTimeMs: Math.round(performance.now() - tStart),
            results: []
        };
    }
};

// ============================================================================
// MAIN DISPATCHER (STRICTLY PYTHON & JAVASCRIPT)
// ============================================================================
export const executeCode = async (lang, code, testCases, onStatus) => {
    if (lang === 'python') {
        return executePython(code, testCases, onStatus);
    }
    // Default: JavaScript (ES6)
    return executeJavaScript(code, testCases);
};
