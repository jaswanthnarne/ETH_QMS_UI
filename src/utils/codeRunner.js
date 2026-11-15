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

// ============================================================================
// 1. JAVASCRIPT EXECUTION ENGINE (NATIVE WEB WORKER)
// ============================================================================
export const executeJavaScript = (code, testCases) => {
    return new Promise((resolve) => {
        const workerScript = `
            ${deepEqual.toString()}

            self.onmessage = function(e) {
                const { code, testCases } = e.data;
                const results = [];
                const logs = [];

                // Intercept console.log for student debugging
                const originalLog = console.log;
                console.log = function(...args) {
                    logs.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
                };

                try {
                    // Extract solve function
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

                        // Treat floats matching ints gracefully
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

                    self.postMessage({ status: 'OK', results });
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
        const worker = new Worker(url);

        const timeoutId = setTimeout(() => {
            worker.terminate();
            URL.revokeObjectURL(url);
            resolve({
                status: 'Time Limit Exceeded',
                error: 'Execution exceeded 2500ms limit. Please check for infinite while/for loops!',
                results: []
            });
        }, 2500);

        worker.onmessage = (e) => {
            clearTimeout(timeoutId);
            worker.terminate();
            URL.revokeObjectURL(url);
            resolve(e.data);
        };

        worker.onerror = (err) => {
            clearTimeout(timeoutId);
            worker.terminate();
            URL.revokeObjectURL(url);
            resolve({
                status: 'Compilation / Syntax Error',
                error: err.message || 'Syntax error in JavaScript code.',
                results: []
            });
        };

        worker.postMessage({ code, testCases });
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

            // 1. Load Pyodide bootstrap script from CDN if not already on window
            if (!window.loadPyodide) {
                if (onStatus) onStatus('Downloading Python 3.11 WebAssembly Runtime from CDN...');
                await new Promise((resolve, reject) => {
                    const existing = document.querySelector('script[src*="pyodide.js"]');
                    if (existing) {
                        existing.addEventListener('load', resolve);
                        existing.addEventListener('error', () => reject(new Error('Failed to load Pyodide script.')));
                        return;
                    }
                    const script = document.createElement('script');
                    script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js';
                    script.async = true;
                    script.onload = () => resolve();
                    script.onerror = () => reject(new Error('Failed to download Python 3.11 WebAssembly from CDN. Please check your internet connection.'));
                    document.head.appendChild(script);
                });
            }

            // 2. Initialize CPython WebAssembly VM
            if (onStatus) onStatus('Compiling Python 3.11 Virtual Machine...');
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
                results: []
            };
        }

        const hasSolve = pyodide.runPython("'solve' in globals() and callable(solve)");
        if (!hasSolve) {
            return {
                status: 'Compilation Error',
                error: "Missing entry function: 'def solve(...):' was not found in your Python code.",
                results: []
            };
        }

        // 2. Run each test case against real CPython
        const results = [];
        for (let i = 0; i < testCases.length; i++) {
            const tc = testCases[i];
            stdoutLogs.length = 0;
            const argsJson = JSON.stringify(tc.args);
            const t0 = performance.now();
            try {
                // Pass args cleanly as JSON string to preserve arrays, ints, strings, dicts
                const pyRunner = `
import json

def _custom_serializer(o):
    if isinstance(o, (set, frozenset)):
        return list(o)
    return str(o)

_raw_args = json.loads(${JSON.stringify(argsJson)})
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

        const allPass = results.length > 0 && results.every((r) => r.pass);
        return {
            status: allPass ? 'OK' : 'Wrong Answer',
            results
        };
    } catch (err) {
        return {
            status: 'Engine Error',
            error: err.message || String(err),
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
