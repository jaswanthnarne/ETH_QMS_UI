import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    Terminal, Play, Send, RotateCcw, CheckCircle2, XCircle, AlertTriangle,
    Clock, Code2, Sparkles, ChevronLeft, ChevronRight, Lightbulb, Eye,
    Search, Filter, Trophy, Lock, Cpu, Layers, Check, ArrowLeft, Building2,
    Briefcase, Flame, Award, ExternalLink
} from 'lucide-react';

// ============================================================================
// STATIC CARTOON SVGS FOR "LOCKED IN LAB"
// ============================================================================
export const LockedInCartoonSvg = ({ variant = 'hub', className = 'w-64 h-32' }) => {
    if (variant === 'accepted') {
        return (
            <svg viewBox="0 0 210 110" className={className} aria-hidden="true">
                <ellipse cx="105" cy="100" rx="82" ry="7" fill="#D1FAE5" />
                <rect x="52" y="22" width="106" height="68" rx="14" fill="#10B981" stroke="#1E293B" strokeWidth="2.2" />
                <rect x="60" y="30" width="90" height="52" rx="10" fill="#ECFDF5" stroke="#1E293B" strokeWidth="1.8" />
                <path d="M88 56 l10 10 24-24" stroke="#059669" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M32 34 l3 6 6 1-4.5 4 1 6-5.5-3-5.5 3 1-6-4.5-4 6-1z" fill="#FACC15" stroke="#1E293B" strokeWidth="1.5" />
                <path d="M178 34 l3 6 6 1-4.5 4 1 6-5.5-3-5.5 3 1-6-4.5-4 6-1z" fill="#FACC15" stroke="#1E293B" strokeWidth="1.5" />
            </svg>
        );
    }

    // Default Hub Cartoon SVG: Cartoon Terminal Monitor, Lab Flask, Padlock & Sarcastic Gen-Z Speech Bubble
    return (
        <svg viewBox="0 0 270 132" className={className} aria-hidden="true">
            <ellipse cx="135" cy="120" rx="114" ry="8" fill="#E2E8F0" />

            {/* Sarcastic Comic Speech Bubble */}
            <path
                d="M18 6 H196 A10 10 0 0 1 206 16 V34 A10 10 0 0 1 196 44 H96 L84 53 L87 44 H18 A10 10 0 0 1 8 34 V16 A10 10 0 0 1 18 6 Z"
                fill="#FEF3C7"
                stroke="#1E293B"
                strokeWidth="2.2"
                strokeLinejoin="round"
            />
            <text x="107" y="21" textAnchor="middle" fontSize="8" fontWeight="900" fill="#B45309" letterSpacing="0.3">
                RESUME: “5-STAR CODER” 🤡</text>
            <text x="107" y="35" textAnchor="middle" fontSize="9" fontWeight="900" fill="#92400E" letterSpacing="0.4">
                CAN YOU CLEAR TCS & ACCENTURE? 💼⚡
            </text>

            {/* Cartoon Dual-Window IDE Monitor */}
            <rect x="24" y="54" width="118" height="58" rx="10" fill="#1E293B" stroke="#0F172A" strokeWidth="2.2" />
            <rect x="30" y="60" width="106" height="44" rx="6" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
            {/* Window Dots */}
            <circle cx="37" cy="66" r="2.2" fill="#F43F5E" />
            <circle cx="44" cy="66" r="2.2" fill="#FACC15" />
            <circle cx="51" cy="66" r="2.2" fill="#34D399" />
            {/* Cartoon Code Lines */}
            <rect x="36" y="74" width="38" height="4.5" rx="2" fill="#38BDF8" />
            <rect x="42" y="82" width="54" height="4.5" rx="2" fill="#A78BFA" />
            <rect x="42" y="90" width="44" height="4.5" rx="2" fill="#34D399" />
            {/* Pass Badge inside Monitor */}
            <rect x="102" y="74" width="28" height="22" rx="5" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.2" />
            <text x="116" y="88" textAnchor="middle" fontSize="8.5" fontWeight="900" fill="#FFFFFF">AC✓</text>
            {/* Monitor Stand */}
            <rect x="74" y="112" width="18" height="6" fill="#64748B" stroke="#1E293B" strokeWidth="1.8" />
            <line x1="60" y1="118" x2="106" y2="118" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />

            {/* Cartoon Bubbling Logic Lab Flask */}
            <path
                d="M168 58 H188 M173 58 V72 L156 106 A6 6 0 0 0 161 115 H195 A6 6 0 0 0 200 106 L183 72 V58"
                fill="#E0F2FE"
                stroke="#1E293B"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path d="M161 96 L195 96 L200 106 A5 5 0 0 1 195 113 H161 A5 5 0 0 1 156 106 Z" fill="#34D399" />
            <circle cx="174" cy="90" r="3" fill="#34D399" stroke="#1E293B" strokeWidth="1.3" />
            <circle cx="182" cy="82" r="2.5" fill="#38BDF8" stroke="#1E293B" strokeWidth="1.3" />

            {/* Cartoon Golden "LOCKED IN" Padlock Character on Right */}
            <path d="M222 72 v-10 a11 11 0 0 1 22 0 v10" stroke="#1E293B" strokeWidth="2.5" fill="none" />
            <rect x="214" y="70" width="38" height="40" rx="10" fill="#FACC15" stroke="#1E293B" strokeWidth="2.2" />
            <circle cx="227" cy="86" r="2.2" fill="#1E293B" />
            <circle cx="239" cy="86" r="2.2" fill="#1E293B" />
            <path d="M228 95 Q233 99 238 95" stroke="#1E293B" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
    );
};

// ============================================================================
// LANGUAGE DEFINITIONS & BOILERPLATE GENERATOR
// ============================================================================
const LANGUAGES = [
    { id: 'c', label: 'C (GCC)', ext: '.c', badge: 'bg-slate-100 text-slate-800' },
    { id: 'cpp', label: 'C++ (G++)', ext: '.cpp', badge: 'bg-blue-50 text-blue-700' },
    { id: 'java', label: 'Java (OpenJDK)', ext: '.java', badge: 'bg-orange-50 text-orange-700' },
    { id: 'python', label: 'Python 3', ext: '.py', badge: 'bg-emerald-50 text-emerald-700' },
    { id: 'javascript', label: 'JavaScript (ES6)', ext: '.js', badge: 'bg-amber-50 text-amber-800' }
];

// ============================================================================
// 36 CURATED PLACEMENT & LEETCODE-STYLE DSA PROBLEMS (12 EASY, 12 MEDIUM, 12 HARD)
// ============================================================================
const PROBLEMS = [
    // ======================== EASY (1 - 12) ========================
    {
        id: 'two-sum- array',
        number: 1,
        title: 'Two Sum Indices',
        company: 'Accenture',
        companyBadge: 'Accenture 2024',
        context: 'Asked in Accenture Critical Coding Round',
        difficulty: 'Easy',
        topic: 'Arrays & Hashing',
        fnName: 'solve',
        params: [
            { name: 'nums', type: 'int[]' },
            { name: 'target', type: 'int' }
        ],
        returnType: 'int[]',
        description: 'Given an array of integers `nums` and an integer `target`, return the indices `[i, j]` (`i < j`) of the two numbers such that they add up to `target`. Return `[-1, -1]` if no such pair exists.',
        constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', 'Exactly one valid answer exists.'],
        hint: 'Use a nested loop for O(n²) or a Hash Map storing value -> index for O(n).',
        starter: {
            c: `int* solve(int nums[], int n, int target) {\n    for (int i = 0; i < n; i++) {\n        for (int j = i + 1; j < n; j++) {\n            if (nums[i] + nums[j] == target) {\n                return {i, j};\n            }\n        }\n    }\n    return {-1, -1};\n}`,
            cpp: `vector<int> solve(vector<int> nums, int target) {\n    int n = nums.size();\n    for (int i = 0; i < n; i++) {\n        for (int j = i + 1; j < n; j++) {\n            if (nums[i] + nums[j] == target) {\n                return {i, j};\n            }\n        }\n    }\n    return {-1, -1};\n}`,
            java: `public int[] solve(int[] nums, int target) {\n    int n = nums.length;\n    for (int i = 0; i < n; i++) {\n        for (int j = i + 1; j < n; j++) {\n            if (nums[i] + nums[j] == target) {\n                return new int[]{i, j};\n            }\n        }\n    }\n    return new int[]{-1, -1};\n}`,
            python: `def solve(nums, target):\n    n = len(nums)\n    for i in range(n):\n        for j in range(i + 1, n):\n            if nums[i] + nums[j] == target:\n                return [i, j]\n    return [-1, -1]`,
            javascript: `function solve(nums, target) {\n    for (let i = 0; i < nums.length; i++) {\n        for (let j = i + 1; j < nums.length; j++) {\n            if (nums[i] + nums[j] === target) {\n                return [i, j];\n            }\n        }\n    }\n    return [-1, -1];\n}`
        },
        testCases: [
            { args: [[2, 7, 11, 15], 9], expected: [0, 1], isHidden: false },
            { args: [[3, 2, 4], 6], expected: [1, 2], isHidden: false },
            { args: [[3, 3], 6], expected: [0, 1], isHidden: true },
            { args: [[1, 5, 8, 12, 20], 20], expected: [2, 3], isHidden: true }
        ]
    },
    {
        id: 'palindrome-number',
        number: 2,
        title: 'Palindrome Integer Check',
        company: 'Accenture',
        companyBadge: 'Accenture 2023',
        context: 'Asked in Accenture Advanced Coding Round',
        difficulty: 'Easy',
        topic: 'Math & Logic',
        fnName: 'solve',
        params: [{ name: 'x', type: 'int' }],
        returnType: 'int',
        description: 'Given an integer `x`, return `1` if `x` is a palindrome integer (reads the same backward as forward), and `0` otherwise. Negative numbers are not palindromes.',
        constraints: ['-2^31 <= x <= 2^31 - 1'],
        hint: 'Reverse the digits of x using modulo 10 and integer division by 10.',
        starter: {
            c: `int solve(int x) {\n    if (x < 0) return 0;\n    int orig = x, rev = 0;\n    while (x > 0) {\n        rev = rev * 10 + (x % 10);\n        x = x / 10;\n    }\n    return orig == rev ? 1 : 0;\n}`,
            cpp: `int solve(int x) {\n    if (x < 0) return 0;\n    int orig = x, rev = 0;\n    while (x > 0) {\n        rev = rev * 10 + (x % 10);\n        x = x / 10;\n    }\n    return orig == rev ? 1 : 0;\n}`,
            java: `public int solve(int x) {\n    if (x < 0) return 0;\n    int orig = x, rev = 0;\n    while (x > 0) {\n        rev = rev * 10 + (x % 10);\n        x = x / 10;\n    }\n    return orig == rev ? 1 : 0;\n}`,
            python: `def solve(x):\n    if x < 0:\n        return 0\n    orig = x\n    rev = 0\n    while x > 0:\n        rev = rev * 10 + (x % 10)\n        x = x // 10\n    return 1 if orig == rev else 0`,
            javascript: `function solve(x) {\n    if (x < 0) return 0;\n    let orig = x, rev = 0;\n    while (x > 0) {\n        rev = rev * 10 + (x % 10);\n        x = Math.floor(x / 10);\n    }\n    return orig === rev ? 1 : 0;\n}`
        },
        testCases: [
            { args: [121], expected: 1, isHidden: false },
            { args: [-121], expected: 0, isHidden: false },
            { args: [10], expected: 0, isHidden: true },
            { args: [12321], expected: 1, isHidden: true }
        ]
    },
    {
        id: 'max-element-array',
        number: 3,
        title: 'Find Peak Maximum in Array',
        company: 'TCS NQT',
        companyBadge: 'TCS NQT 2024',
        context: 'Asked in TCS NQT Cognitive & Coding Slot 1',
        difficulty: 'Easy',
        topic: 'Arrays & Hashing',
        fnName: 'solve',
        params: [{ name: 'nums', type: 'int[]' }],
        returnType: 'int',
        description: 'Given a non-empty array of integers `nums`, find and return the maximum element present in the array.',
        constraints: ['1 <= nums.length <= 10^5', '-10^6 <= nums[i] <= 10^6'],
        hint: 'Initialize maxVal = nums[0] and iterate through the array.',
        starter: {
            c: `int solve(int nums[], int n) {\n    int maxVal = nums[0];\n    for (int i = 1; i < n; i++) {\n        if (nums[i] > maxVal) maxVal = nums[i];\n    }\n    return maxVal;\n}`,
            cpp: `int solve(vector<int> nums) {\n    int maxVal = nums[0];\n    for (int i = 1; i < nums.size(); i++) {\n        if (nums[i] > maxVal) maxVal = nums[i];\n    }\n    return maxVal;\n}`,
            java: `public int solve(int[] nums) {\n    int maxVal = nums[0];\n    for (int i = 1; i < nums.length; i++) {\n        if (nums[i] > maxVal) maxVal = nums[i];\n    }\n    return maxVal;\n}`,
            python: `def solve(nums):\n    max_val = nums[0]\n    for x in nums:\n        if x > max_val:\n            max_val = x\n    return max_val`,
            javascript: `function solve(nums) {\n    let maxVal = nums[0];\n    for (let i = 1; i < nums.length; i++) {\n        if (nums[i] > maxVal) maxVal = nums[i];\n    }\n    return maxVal;\n}`
        },
        testCases: [
            { args: [[3, 1, 9, 4, 2]], expected: 9, isHidden: false },
            { args: [[-10, -3, -25, -1]], expected: -1, isHidden: false },
            { args: [[42]], expected: 42, isHidden: true },
            { args: [[12, 99, 104, 88, 104]], expected: 104, isHidden: true }
        ]
    },
    {
        id: 'count-vowels',
        number: 4,
        title: 'Count Vowels in a String',
        company: 'Accenture',
        companyBadge: 'Accenture 2024',
        context: 'Asked in Accenture On-Campus Placement Test',
        difficulty: 'Easy',
        topic: 'Strings',
        fnName: 'solve',
        params: [{ name: 's', type: 'string' }],
        returnType: 'int',
        description: 'Given a lowercase string `s`, return the total number of vowels (`a`, `e`, `i`, `o`, `u`) present in the string.',
        constraints: ['1 <= s.length <= 10^4', 's consists of lowercase English letters.'],
        hint: 'Check each character against a, e, i, o, u and increment a counter.',
        starter: {
            c: `int solve(string s) {\n    int count = 0;\n    for (int i = 0; i < s.length(); i++) {\n        char c = s[i];\n        if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') count++;\n    }\n    return count;\n}`,
            cpp: `int solve(string s) {\n    int count = 0;\n    for (int i = 0; i < s.size(); i++) {\n        char c = s[i];\n        if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') count++;\n    }\n    return count;\n}`,
            java: `public int solve(String s) {\n    int count = 0;\n    for (int i = 0; i < s.length(); i++) {\n        char c = s.charAt(i);\n        if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') count++;\n    }\n    return count;\n}`,
            python: `def solve(s):\n    count = 0\n    for c in s:\n        if c in "aeiou":\n            count += 1\n    return count`,
            javascript: `function solve(s) {\n    let count = 0;\n    for (let i = 0; i < s.length; i++) {\n        if ("aeiou".includes(s[i])) count++;\n    }\n    return count;\n}`
        },
        testCases: [
            { args: ['placement'], expected: 3, isHidden: false },
            { args: ['education'], expected: 5, isHidden: false },
            { args: ['rhythm'], expected: 0, isHidden: true },
            { args: ['aeiou'], expected: 5, isHidden: true }
        ]
    },
    {
        id: 'climbing-stairs',
        number: 5,
        title: 'Climbing Stairs Ways',
        company: 'Infosys',
        companyBadge: 'Infosys 2024',
        context: 'Asked in Infosys Certification & SP Round',
        difficulty: 'Easy',
        topic: 'Dynamic Programming',
        fnName: 'solve',
        params: [{ name: 'n', type: 'int' }],
        returnType: 'int',
        description: 'You are climbing a staircase with `n` steps. Each time you can either climb `1` or `2` steps. In how many distinct ways can you climb to the top?',
        constraints: ['1 <= n <= 40'],
        hint: 'Way(n) = Way(n-1) + Way(n-2), which follows the Fibonacci progression.',
        starter: {
            c: `int solve(int n) {\n    if (n <= 2) return n;\n    int a = 1, b = 2;\n    for (int i = 3; i <= n; i++) {\n        int c = a + b;\n        a = b;\n        b = c;\n    }\n    return b;\n}`,
            cpp: `int solve(int n) {\n    if (n <= 2) return n;\n    int a = 1, b = 2;\n    for (int i = 3; i <= n; i++) {\n        int c = a + b;\n        a = b;\n        b = c;\n    }\n    return b;\n}`,
            java: `public int solve(int n) {\n    if (n <= 2) return n;\n    int a = 1, b = 2;\n    for (int i = 3; i <= n; i++) {\n        int c = a + b;\n        a = b;\n        b = c;\n    }\n    return b;\n}`,
            python: `def solve(n):\n    if n <= 2:\n        return n\n    a, b = 1, 2\n    for i in range(3, n + 1):\n        a, b = b, a + b\n    return b`,
            javascript: `function solve(n) {\n    if (n <= 2) return n;\n    let a = 1, b = 2;\n    for (let i = 3; i <= n; i++) {\n        let c = a + b;\n        a = b;\n        b = c;\n    }\n    return b;\n}`
        },
        testCases: [
            { args: [2], expected: 2, isHidden: false },
            { args: [3], expected: 3, isHidden: false },
            { args: [5], expected: 8, isHidden: true },
            { args: [10], expected: 89, isHidden: true }
        ]
    },
    {
        id: 'single-number-xor',
        number: 6,
        title: 'Single Non-Duplicate Number',
        company: 'Wipro',
        companyBadge: 'Wipro NLTH 2024',
        context: 'Asked in Wipro Elite National Talent Hunt',
        difficulty: 'Easy',
        topic: 'Bit Manipulation',
        fnName: 'solve',
        params: [{ name: 'nums', type: 'int[]' }],
        returnType: 'int',
        description: 'Given a non-empty array of integers `nums`, every element appears twice except for one. Find and return that single unique element in O(n) time and O(1) extra space.',
        constraints: ['1 <= nums.length <= 3 * 10^4'],
        hint: 'XOR of a number with itself is 0 (a ^ a = 0), so XORing all elements leaves the unique number.',
        starter: {
            c: `int solve(int nums[], int n) {\n    int ans = 0;\n    for (int i = 0; i < n; i++) {\n        ans = ans ^ nums[i];\n    }\n    return ans;\n}`,
            cpp: `int solve(vector<int> nums) {\n    int ans = 0;\n    for (int i = 0; i < nums.size(); i++) {\n        ans = ans ^ nums[i];\n    }\n    return ans;\n}`,
            java: `public int solve(int[] nums) {\n    int ans = 0;\n    for (int i = 0; i < nums.length; i++) {\n        ans = ans ^ nums[i];\n    }\n    return ans;\n}`,
            python: `def solve(nums):\n    ans = 0\n    for x in nums:\n        ans = ans ^ x\n    return ans`,
            javascript: `function solve(nums) {\n    let ans = 0;\n    for (let i = 0; i < nums.length; i++) {\n        ans ^= nums[i];\n    }\n    return ans;\n}`
        },
        testCases: [
            { args: [[2, 2, 1]], expected: 1, isHidden: false },
            { args: [[4, 1, 2, 1, 2]], expected: 4, isHidden: false },
            { args: [[99]], expected: 99, isHidden: true },
            { args: [[7, 3, 5, 3, 7]], expected: 5, isHidden: true }
        ]
    },
    {
        id: 'binary-search-basic',
        number: 7,
        title: 'Binary Search Target Index',
        company: 'TCS NQT',
        companyBadge: 'TCS NQT 2024',
        context: 'Asked in TCS Ninja & Digital Hiring Drive',
        difficulty: 'Easy',
        topic: 'Searching',
        fnName: 'solve',
        params: [
            { name: 'nums', type: 'int[]' },
            { name: 'target', type: 'int' }
        ],
        returnType: 'int',
        description: 'Given an array of integers `nums` sorted in ascending order and an integer `target`, return the index of `target` if it exists, otherwise return `-1`.',
        constraints: ['1 <= nums.length <= 10^4', 'nums is sorted in strictly increasing order.'],
        hint: 'Maintain lo = 0 and hi = n - 1, comparing nums[mid] with target.',
        starter: {
            c: `int solve(int nums[], int n, int target) {\n    int lo = 0, hi = n - 1;\n    while (lo <= hi) {\n        int mid = (lo + hi) / 2;\n        if (nums[mid] == target) return mid;\n        if (nums[mid] < target) lo = mid + 1;\n        else hi = mid - 1;\n    }\n    return -1;\n}`,
            cpp: `int solve(vector<int> nums, int target) {\n    int lo = 0, hi = nums.size() - 1;\n    while (lo <= hi) {\n        int mid = (lo + hi) / 2;\n        if (nums[mid] == target) return mid;\n        if (nums[mid] < target) lo = mid + 1;\n        else hi = mid - 1;\n    }\n    return -1;\n}`,
            java: `public int solve(int[] nums, int target) {\n    int lo = 0, hi = nums.length - 1;\n    while (lo <= hi) {\n        int mid = (lo + hi) / 2;\n        if (nums[mid] == target) return mid;\n        if (nums[mid] < target) lo = mid + 1;\n        else hi = mid - 1;\n    }\n    return -1;\n}`,
            python: `def solve(nums, target):\n    lo, hi = 0, len(nums) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if nums[mid] == target:\n            return mid\n        elif nums[mid] < target:\n            lo = mid + 1\n        else:\n            hi = mid - 1\n    return -1`,
            javascript: `function solve(nums, target) {\n    let lo = 0, hi = nums.length - 1;\n    while (lo <= hi) {\n        let mid = Math.floor((lo + hi) / 2);\n        if (nums[mid] === target) return mid;\n        if (nums[mid] < target) lo = mid + 1;\n        else hi = mid - 1;\n    }\n    return -1;\n}`
        },
        testCases: [
            { args: [[-1, 0, 3, 5, 9, 12], 9], expected: 4, isHidden: false },
            { args: [[-1, 0, 3, 5, 9, 12], 2], expected: -1, isHidden: false },
            { args: [[5], 5], expected: 0, isHidden: true },
            { args: [[2, 4, 6, 8, 10, 12, 14], 14], expected: 6, isHidden: true }
        ]
    },
    {
        id: 'sum-of-digits',
        number: 8,
        title: 'Digital Root / Sum of Digits',
        company: 'Accenture',
        companyBadge: 'Accenture 2023',
        context: 'Asked in Accenture Critical Coding Assessment',
        difficulty: 'Easy',
        topic: 'Math & Logic',
        fnName: 'solve',
        params: [{ name: 'n', type: 'int' }],
        returnType: 'int',
        description: 'Given a non-negative integer `n`, return the sum of all its base-10 digits.',
        constraints: ['0 <= n <= 10^9'],
        hint: 'Repeatedly add n % 10 to sum and divide n by 10.',
        starter: {
            c: `int solve(int n) {\n    int sum = 0;\n    while (n > 0) {\n        sum += n % 10;\n        n = n / 10;\n    }\n    return sum;\n}`,
            cpp: `int solve(int n) {\n    int sum = 0;\n    while (n > 0) {\n        sum += n % 10;\n        n = n / 10;\n    }\n    return sum;\n}`,
            java: `public int solve(int n) {\n    int sum = 0;\n    while (n > 0) {\n        sum += n % 10;\n        n = n / 10;\n    }\n    return sum;\n}`,
            python: `def solve(n):\n    total = 0\n    while n > 0:\n        total += n % 10\n        n = n // 10\n    return total`,
            javascript: `function solve(n) {\n    let sum = 0;\n    while (n > 0) {\n        sum += n % 10;\n        n = Math.floor(n / 10);\n    }\n    return sum;\n}`
        },
        testCases: [
            { args: [9875], expected: 29, isHidden: false },
            { args: [1001], expected: 2, isHidden: false },
            { args: [0], expected: 0, isHidden: true },
            { args: [123456], expected: 21, isHidden: true }
        ]
    },
    {
        id: 'missing-number-0-n',
        number: 9,
        title: 'Missing Number in [0..n]',
        company: 'Cognizant',
        companyBadge: 'Cognizant 2024',
        context: 'Asked in Cognizant GenC Elevate Assessment',
        difficulty: 'Easy',
        topic: 'Math & Logic',
        fnName: 'solve',
        params: [{ name: 'nums', type: 'int[]' }],
        returnType: 'int',
        description: 'Given an array `nums` containing `n` distinct numbers in the range `[0, n]`, return the only number in the range that is missing from the array.',
        constraints: ['1 <= n <= 10^4'],
        hint: 'Expected sum is n * (n + 1) / 2. Subtract the actual sum of array elements.',
        starter: {
            c: `int solve(int nums[], int n) {\n    int expected = (n * (n + 1)) / 2;\n    int actual = 0;\n    for (int i = 0; i < n; i++) actual += nums[i];\n    return expected - actual;\n}`,
            cpp: `int solve(vector<int> nums) {\n    int n = nums.size();\n    int expected = (n * (n + 1)) / 2;\n    int actual = 0;\n    for (int i = 0; i < n; i++) actual += nums[i];\n    return expected - actual;\n}`,
            java: `public int solve(int[] nums) {\n    int n = nums.length;\n    int expected = (n * (n + 1)) / 2;\n    int actual = 0;\n    for (int i = 0; i < n; i++) actual += nums[i];\n    return expected - actual;\n}`,
            python: `def solve(nums):\n    n = len(nums)\n    expected = (n * (n + 1)) // 2\n    return expected - sum(nums)`,
            javascript: `function solve(nums) {\n    const n = nums.length;\n    const expected = (n * (n + 1)) / 2;\n    let actual = 0;\n    for (let i = 0; i < n; i++) actual += nums[i];\n    return expected - actual;\n}`
        },
        testCases: [
            { args: [[3, 0, 1]], expected: 2, isHidden: false },
            { args: [[0, 1]], expected: 2, isHidden: false },
            { args: [[9, 6, 4, 2, 3, 5, 7, 0, 1]], expected: 8, isHidden: true },
            { args: [[1]], expected: 0, isHidden: true }
        ]
    },
    {
        id: 'power-of-two',
        number: 10,
        title: 'Power of Two Check',
        company: 'TCS NQT',
        companyBadge: 'TCS NQT 2024',
        context: 'Asked in TCS NQT Slot 2 Coding',
        difficulty: 'Easy',
        topic: 'Bit Manipulation',
        fnName: 'solve',
        params: [{ name: 'n', type: 'int' }],
        returnType: 'int',
        description: 'Given an integer `n`, return `1` if it is a power of two ($2^k$), otherwise return `0`.',
        constraints: ['-2^31 <= n <= 2^31 - 1'],
        hint: 'A positive integer n is a power of 2 if and only if (n & (n - 1)) == 0.',
        starter: {
            c: `int solve(int n) {\n    if (n <= 0) return 0;\n    return (n & (n - 1)) == 0 ? 1 : 0;\n}`,
            cpp: `int solve(int n) {\n    if (n <= 0) return 0;\n    return (n & (n - 1)) == 0 ? 1 : 0;\n}`,
            java: `public int solve(int n) {\n    if (n <= 0) return 0;\n    return (n & (n - 1)) == 0 ? 1 : 0;\n}`,
            python: `def solve(n):\n    if n <= 0:\n        return 0\n    return 1 if (n & (n - 1)) == 0 else 0`,
            javascript: `function solve(n) {\n    if (n <= 0) return 0;\n    return (n & (n - 1)) === 0 ? 1 : 0;\n}`
        },
        testCases: [
            { args: [16], expected: 1, isHidden: false },
            { args: [18], expected: 0, isHidden: false },
            { args: [1], expected: 1, isHidden: true },
            { args: [0], expected: 0, isHidden: true }
        ]
    },
    {
        id: 'gcd-two-numbers',
        number: 11,
        title: 'Greatest Common Divisor (GCD)',
        company: 'Infosys',
        companyBadge: 'Infosys 2024',
        context: 'Asked in Infosys DSE Assessment',
        difficulty: 'Easy',
        topic: 'Math & Logic',
        fnName: 'solve',
        params: [
            { name: 'a', type: 'int' },
            { name: 'b', type: 'int' }
        ],
        returnType: 'int',
        description: 'Given two positive integers `a` and `b`, return their Greatest Common Divisor (GCD) using Euclid’s algorithm.',
        constraints: ['1 <= a, b <= 10^9'],
        hint: 'While b != 0, replace (a, b) with (b, a % b).',
        starter: {
            c: `int solve(int a, int b) {\n    while (b != 0) {\n        int r = a % b;\n        a = b;\n        b = r;\n    }\n    return a;\n}`,
            cpp: `int solve(int a, int b) {\n    while (b != 0) {\n        int r = a % b;\n        a = b;\n        b = r;\n    }\n    return a;\n}`,
            java: `public int solve(int a, int b) {\n    while (b != 0) {\n        int r = a % b;\n        a = b;\n        b = r;\n    }\n    return a;\n}`,
            python: `def solve(a, b):\n    while b != 0:\n        a, b = b, a % b\n    return a`,
            javascript: `function solve(a, b) {\n    while (b !== 0) {\n        let r = a % b;\n        a = b;\n        b = r;\n    }\n    return a;\n}`
        },
        testCases: [
            { args: [48, 18], expected: 6, isHidden: false },
            { args: [101, 10], expected: 1, isHidden: false },
            { args: [270, 192], expected: 6, isHidden: true },
            { args: [100, 25], expected: 25, isHidden: true }
        ]
    },
    {
        id: 'count-even-numbers',
        number: 12,
        title: 'Count Even Elements in Array',
        company: 'Wipro',
        companyBadge: 'Wipro 2023',
        context: 'Asked in Wipro Elite Coding Round',
        difficulty: 'Easy',
        topic: 'Arrays & Hashing',
        fnName: 'solve',
        params: [{ name: 'nums', type: 'int[]' }],
        returnType: 'int',
        description: 'Given an integer array `nums`, return the count of elements that are divisible by 2.',
        constraints: ['1 <= nums.length <= 10^4'],
        hint: 'Check nums[i] % 2 == 0 for each element.',
        starter: {
            c: `int solve(int nums[], int n) {\n    int count = 0;\n    for (int i = 0; i < n; i++) {\n        if (nums[i] % 2 == 0) count++;\n    }\n    return count;\n}`,
            cpp: `int solve(vector<int> nums) {\n    int count = 0;\n    for (int i = 0; i < nums.size(); i++) {\n        if (nums[i] % 2 == 0) count++;\n    }\n    return count;\n}`,
            java: `public int solve(int[] nums) {\n    int count = 0;\n    for (int i = 0; i < nums.length; i++) {\n        if (nums[i] % 2 == 0) count++;\n    }\n    return count;\n}`,
            python: `def solve(nums):\n    count = 0\n    for x in nums:\n        if x % 2 == 0:\n            count += 1\n    return count`,
            javascript: `function solve(nums) {\n    let count = 0;\n    for (let i = 0; i < nums.length; i++) {\n        if (nums[i] % 2 === 0) count++;\n    }\n    return count;\n}`
        },
        testCases: [
            { args: [[1, 2, 3, 4, 5, 6]], expected: 3, isHidden: false },
            { args: [[7, 9, 11]], expected: 0, isHidden: false },
            { args: [[0, 2, 4, 8]], expected: 4, isHidden: true }
        ]
    },

    // ======================== MEDIUM (13 - 24) ========================
    {
        id: 'kadane-max-subarray',
        number: 13,
        title: 'Maximum Subarray Sum (Kadane)',
        company: 'Infosys',
        companyBadge: 'Infosys DSE 2024',
        context: 'Asked in Infosys Specialist Programmer & DSE',
        difficulty: 'Medium',
        topic: 'Dynamic Programming',
        fnName: 'solve',
        params: [{ name: 'nums', type: 'int[]' }],
        returnType: 'int',
        description: 'Given an integer array `nums`, find the contiguous non-empty subarray which has the largest sum and return its sum.',
        constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
        hint: 'Maintain cur = max(nums[i], cur + nums[i]) and best = max(best, cur).',
        starter: {
            c: `int solve(int nums[], int n) {\n    int cur = nums[0], best = nums[0];\n    for (int i = 1; i < n; i++) {\n        cur = (nums[i] > cur + nums[i]) ? nums[i] : cur + nums[i];\n        if (cur > best) best = cur;\n    }\n    return best;\n}`,
            cpp: `int solve(vector<int> nums) {\n    int cur = nums[0], best = nums[0];\n    for (int i = 1; i < nums.size(); i++) {\n        cur = max(nums[i], cur + nums[i]);\n        best = max(best, cur);\n    }\n    return best;\n}`,
            java: `public int solve(int[] nums) {\n    int cur = nums[0], best = nums[0];\n    for (int i = 1; i < nums.length; i++) {\n        cur = Math.max(nums[i], cur + nums[i]);\n        best = Math.max(best, cur);\n    }\n    return best;\n}`,
            python: `def solve(nums):\n    cur = best = nums[0]\n    for i in range(1, len(nums)):\n        cur = max(nums[i], cur + nums[i])\n        best = max(best, cur)\n    return best`,
            javascript: `function solve(nums) {\n    let cur = nums[0], best = nums[0];\n    for (let i = 1; i < nums.length; i++) {\n        cur = Math.max(nums[i], cur + nums[i]);\n        best = Math.max(best, cur);\n    }\n    return best;\n}`
        },
        testCases: [
            { args: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6, isHidden: false },
            { args: [[5, 4, -1, 7, 8]], expected: 23, isHidden: false },
            { args: [[-5, -2, -9]], expected: -2, isHidden: true },
            { args: [[1]], expected: 1, isHidden: true }
        ]
    },
    {
        id: 'best-time-stock',
        number: 14,
        title: 'Best Time to Buy & Sell Stock',
        company: 'TCS NQT',
        companyBadge: 'TCS Digital 2024',
        context: 'Asked in TCS Digital High-Package Drive',
        difficulty: 'Medium',
        topic: 'Dynamic Programming',
        fnName: 'solve',
        params: [{ name: 'prices', type: 'int[]' }],
        returnType: 'int',
        description: 'You are given an array `prices` where `prices[i]` is the price of a stock on day `i`. Maximize your profit by choosing a single day to buy and a future day to sell. Return the maximum profit (or `0` if no profit is possible).',
        constraints: ['1 <= prices.length <= 10^5', '0 <= prices[i] <= 10^4'],
        hint: 'Track the minimum price seen so far and update maxProfit = max(maxProfit, price - minPrice).',
        starter: {
            c: `int solve(int prices[], int n) {\n    int minP = prices[0], profit = 0;\n    for (int i = 1; i < n; i++) {\n        if (prices[i] < minP) minP = prices[i];\n        if (prices[i] - minP > profit) profit = prices[i] - minP;\n    }\n    return profit;\n}`,
            cpp: `int solve(vector<int> prices) {\n    int minP = prices[0], profit = 0;\n    for (int i = 1; i < prices.size(); i++) {\n        minP = min(minP, prices[i]);\n        profit = max(profit, prices[i] - minP);\n    }\n    return profit;\n}`,
            java: `public int solve(int[] prices) {\n    int minP = prices[0], profit = 0;\n    for (int i = 1; i < prices.length; i++) {\n        minP = Math.min(minP, prices[i]);\n        profit = Math.max(profit, prices[i] - minP);\n    }\n    return profit;\n}`,
            python: `def solve(prices):\n    min_p = prices[0]\n    profit = 0\n    for p in prices:\n        if p < min_p:\n            min_p = p\n        if p - min_p > profit:\n            profit = p - min_p\n    return profit`,
            javascript: `function solve(prices) {\n    let minP = prices[0], profit = 0;\n    for (let i = 1; i < prices.length; i++) {\n        minP = Math.min(minP, prices[i]);\n        profit = Math.max(profit, prices[i] - minP);\n    }\n    return profit;\n}`
        },
        testCases: [
            { args: [[7, 1, 5, 3, 6, 4]], expected: 5, isHidden: false },
            { args: [[7, 6, 4, 3, 1]], expected: 0, isHidden: false },
            { args: [[2, 4, 1, 10]], expected: 9, isHidden: true }
        ]
    },
    {
        id: 'container-most-water',
        number: 15,
        title: 'Container With Most Water',
        company: 'Zoho',
        companyBadge: 'Zoho Advanced 2024',
        context: 'Asked in Zoho Round 2 Advanced Programming',
        difficulty: 'Medium',
        topic: 'Two Pointers',
        fnName: 'solve',
        params: [{ name: 'height', type: 'int[]' }],
        returnType: 'int',
        description: 'Given `n` non-negative integers `height` where each represents a vertical line at coordinate `i`, find two lines that together with the x-axis form a container that holds the most water. Return the maximum area.',
        constraints: ['2 <= height.length <= 10^5'],
        hint: 'Use two pointers l = 0 and r = n - 1, moving the pointer with the smaller height inward.',
        starter: {
            c: `int solve(int height[], int n) {\n    int l = 0, r = n - 1, best = 0;\n    while (l < r) {\n        int h = height[l] < height[r] ? height[l] : height[r];\n        int area = (r - l) * h;\n        if (area > best) best = area;\n        if (height[l] < height[r]) l++;\n        else r--;\n    }\n    return best;\n}`,
            cpp: `int solve(vector<int> height) {\n    int l = 0, r = height.size() - 1, best = 0;\n    while (l < r) {\n        best = max(best, (r - l) * min(height[l], height[r]));\n        if (height[l] < height[r]) l++;\n        else r--;\n    }\n    return best;\n}`,
            java: `public int solve(int[] height) {\n    int l = 0, r = height.length - 1, best = 0;\n    while (l < r) {\n        best = Math.max(best, (r - l) * Math.min(height[l], height[r]));\n        if (height[l] < height[r]) l++;\n        else r--;\n    }\n    return best;\n}`,
            python: `def solve(height):\n    l, r = 0, len(height) - 1\n    best = 0\n    while l < r:\n        best = max(best, (r - l) * min(height[l], height[r]))\n        if height[l] < height[r]:\n            l += 1\n        else:\n            r -= 1\n    return best`,
            javascript: `function solve(height) {\n    let l = 0, r = height.length - 1, best = 0;\n    while (l < r) {\n        best = Math.max(best, (r - l) * Math.min(height[l], height[r]));\n        if (height[l] < height[r]) l++;\n        else r--;\n    }\n    return best;\n}`
        },
        testCases: [
            { args: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], expected: 49, isHidden: false },
            { args: [[1, 1]], expected: 1, isHidden: false },
            { args: [[4, 3, 2, 1, 4]], expected: 16, isHidden: true }
        ]
    },
    {
        id: 'move-zeroes-end',
        number: 16,
        title: 'Move Zeroes to End',
        company: 'Infosys',
        companyBadge: 'Infosys SP 2024',
        context: 'Asked in Infosys Specialist Programmer Round',
        difficulty: 'Medium',
        topic: 'Two Pointers',
        fnName: 'solve',
        params: [{ name: 'nums', type: 'int[]' }],
        returnType: 'int[]',
        description: 'Given an integer array `nums`, move all `0`s to the end of it while maintaining the relative order of the non-zero elements, and return the modified array.',
        constraints: ['1 <= nums.length <= 10^4'],
        hint: 'Maintain a write pointer pos = 0 for non-zero values, then fill the rest with 0.',
        starter: {
            c: `int* solve(int nums[], int n) {\n    int pos = 0;\n    for (int i = 0; i < n; i++) {\n        if (nums[i] != 0) nums[pos++] = nums[i];\n    }\n    while (pos < n) nums[pos++] = 0;\n    return nums;\n}`,
            cpp: `vector<int> solve(vector<int> nums) {\n    int pos = 0;\n    for (int i = 0; i < nums.size(); i++) {\n        if (nums[i] != 0) nums[pos++] = nums[i];\n    }\n    while (pos < nums.size()) nums[pos++] = 0;\n    return nums;\n}`,
            java: `public int[] solve(int[] nums) {\n    int pos = 0;\n    for (int i = 0; i < nums.length; i++) {\n        if (nums[i] != 0) nums[pos++] = nums[i];\n    }\n    while (pos < nums.length) nums[pos++] = 0;\n    return nums;\n}`,
            python: `def solve(nums):\n    pos = 0\n    for i in range(len(nums)):\n        if nums[i] != 0:\n            nums[pos] = nums[i]\n            pos += 1\n    while pos < len(nums):\n        nums[pos] = 0\n        pos += 1\n    return nums`,
            javascript: `function solve(nums) {\n    let pos = 0;\n    for (let i = 0; i < nums.length; i++) {\n        if (nums[i] !== 0) nums[pos++] = nums[i];\n    }\n    while (pos < nums.length) nums[pos++] = 0;\n    return nums;\n}`
        },
        testCases: [
            { args: [[0, 1, 0, 3, 12]], expected: [1, 3, 12, 0, 0], isHidden: false },
            { args: [[0]], expected: [0], isHidden: false },
            { args: [[4, 0, 5, 0, 0, 6]], expected: [4, 5, 6, 0, 0, 0], isHidden: true }
        ]
    },
    {
        id: 'house-robber-dp',
        number: 17,
        title: 'House Robber Maximum Loot',
        company: 'Wipro',
        companyBadge: 'Wipro Turbo 2024',
        context: 'Asked in Wipro Turbo High-Package Test',
        difficulty: 'Medium',
        topic: 'Dynamic Programming',
        fnName: 'solve',
        params: [{ name: 'nums', type: 'int[]' }],
        returnType: 'int',
        description: 'You are planning to rob houses along a street (`nums[i]` is the cash in house `i`). Adjacent houses have connected security systems. Return the maximum amount of money you can rob without alerting the police.',
        constraints: ['1 <= nums.length <= 100', '0 <= nums[i] <= 400'],
        hint: 'At each house i, cur = max(prev1, prev2 + nums[i]).',
        starter: {
            c: `int solve(int nums[], int n) {\n    int prev2 = 0, prev1 = 0;\n    for (int i = 0; i < n; i++) {\n        int take = prev2 + nums[i];\n        int cur = take > prev1 ? take : prev1;\n        prev2 = prev1;\n        prev1 = cur;\n    }\n    return prev1;\n}`,
            cpp: `int solve(vector<int> nums) {\n    int prev2 = 0, prev1 = 0;\n    for (int i = 0; i < nums.size(); i++) {\n        int cur = max(prev1, prev2 + nums[i]);\n        prev2 = prev1;\n        prev1 = cur;\n    }\n    return prev1;\n}`,
            java: `public int solve(int[] nums) {\n    int prev2 = 0, prev1 = 0;\n    for (int i = 0; i < nums.length; i++) {\n        int cur = Math.max(prev1, prev2 + nums[i]);\n        prev2 = prev1;\n        prev1 = cur;\n    }\n    return prev1;\n}`,
            python: `def solve(nums):\n    prev2, prev1 = 0, 0\n    for x in nums:\n        prev2, prev1 = prev1, max(prev1, prev2 + x)\n    return prev1`,
            javascript: `function solve(nums) {\n    let prev2 = 0, prev1 = 0;\n    for (let i = 0; i < nums.length; i++) {\n        let cur = Math.max(prev1, prev2 + nums[i]);\n        prev2 = prev1;\n        prev1 = cur;\n    }\n    return prev1;\n}`
        },
        testCases: [
            { args: [[1, 2, 3, 1]], expected: 4, isHidden: false },
            { args: [[2, 7, 9, 3, 1]], expected: 12, isHidden: false },
            { args: [[2, 1, 1, 2]], expected: 4, isHidden: true }
        ]
    },
    {
        id: 'majority-element-boyer',
        number: 18,
        title: 'Majority Element (> n/2)',
        company: 'Capgemini',
        companyBadge: 'Capgemini 2024',
        context: 'Asked in Capgemini Exceller Coding',
        difficulty: 'Medium',
        topic: 'Arrays & Hashing',
        fnName: 'solve',
        params: [{ name: 'nums', type: 'int[]' }],
        returnType: 'int',
        description: 'Given an array `nums` of size `n`, return the majority element that appears more than `⌊n / 2⌋` times.',
        constraints: ['1 <= nums.length <= 5 * 10^4'],
        hint: 'Use Boyer-Moore Voting Algorithm: maintain candidate and count.',
        starter: {
            c: `int solve(int nums[], int n) {\n    int cand = 0, count = 0;\n    for (int i = 0; i < n; i++) {\n        if (count == 0) cand = nums[i];\n        count += (nums[i] == cand) ? 1 : -1;\n    }\n    return cand;\n}`,
            cpp: `int solve(vector<int> nums) {\n    int cand = 0, count = 0;\n    for (int i = 0; i < nums.size(); i++) {\n        if (count == 0) cand = nums[i];\n        count += (nums[i] == cand) ? 1 : -1;\n    }\n    return cand;\n}`,
            java: `public int solve(int[] nums) {\n    int cand = 0, count = 0;\n    for (int i = 0; i < nums.length; i++) {\n        if (count == 0) cand = nums[i];\n        count += (nums[i] == cand) ? 1 : -1;\n    }\n    return cand;\n}`,
            python: `def solve(nums):\n    cand, count = 0, 0\n    for x in nums:\n        if count == 0:\n            cand = x\n        count += 1 if x == cand else -1\n    return cand`,
            javascript: `function solve(nums) {\n    let cand = 0, count = 0;\n    for (let i = 0; i < nums.length; i++) {\n        if (count === 0) cand = nums[i];\n        count += nums[i] === cand ? 1 : -1;\n    }\n    return cand;\n}`
        },
        testCases: [
            { args: [[3, 2, 3]], expected: 3, isHidden: false },
            { args: [[2, 2, 1, 1, 1, 2, 2]], expected: 2, isHidden: false },
            { args: [[6, 5, 5]], expected: 5, isHidden: true }
        ]
    },
    {
        id: 'search-rotated-sorted',
        number: 19,
        title: 'Search in Rotated Sorted Array',
        company: 'Zoho',
        companyBadge: 'Zoho 2023',
        context: 'Asked in Zoho Level 2 Evaluation',
        difficulty: 'Medium',
        topic: 'Searching',
        fnName: 'solve',
        params: [
            { name: 'nums', type: 'int[]' },
            { name: 'target', type: 'int' }
        ],
        returnType: 'int',
        description: 'Given a sorted array `nums` of distinct integers that has been rotated at an unknown pivot, return the index of `target` in $O(\\log n)$ time, or `-1` if not found.',
        constraints: ['1 <= nums.length <= 5000'],
        hint: 'At least one half (lo..mid or mid..hi) is always sorted. Check if target lies in the sorted half.',
        starter: {
            c: `int solve(int nums[], int n, int target) {\n    int lo = 0, hi = n - 1;\n    while (lo <= hi) {\n        int mid = (lo + hi) / 2;\n        if (nums[mid] == target) return mid;\n        if (nums[lo] <= nums[mid]) {\n            if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;\n            else lo = mid + 1;\n        } else {\n            if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;\n            else hi = mid - 1;\n        }\n    }\n    return -1;\n}`,
            cpp: `int solve(vector<int> nums, int target) {\n    int lo = 0, hi = nums.size() - 1;\n    while (lo <= hi) {\n        int mid = (lo + hi) / 2;\n        if (nums[mid] == target) return mid;\n        if (nums[lo] <= nums[mid]) {\n            if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;\n            else lo = mid + 1;\n        } else {\n            if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;\n            else hi = mid - 1;\n        }\n    }\n    return -1;\n}`,
            java: `public int solve(int[] nums, int target) {\n    int lo = 0, hi = nums.length - 1;\n    while (lo <= hi) {\n        int mid = (lo + hi) / 2;\n        if (nums[mid] == target) return mid;\n        if (nums[lo] <= nums[mid]) {\n            if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;\n            else lo = mid + 1;\n        } else {\n            if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;\n            else hi = mid - 1;\n        }\n    }\n    return -1;\n}`,
            python: `def solve(nums, target):\n    lo, hi = 0, len(nums) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if nums[mid] == target:\n            return mid\n        if nums[lo] <= nums[mid]:\n            if nums[lo] <= target < nums[mid]:\n                hi = mid - 1\n            else:\n                lo = mid + 1\n        else:\n            if nums[mid] < target <= nums[hi]:\n                lo = mid + 1\n            else:\n                hi = mid - 1\n    return -1`,
            javascript: `function solve(nums, target) {\n    let lo = 0, hi = nums.length - 1;\n    while (lo <= hi) {\n        let mid = Math.floor((lo + hi) / 2);\n        if (nums[mid] === target) return mid;\n        if (nums[lo] <= nums[mid]) {\n            if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;\n            else lo = mid + 1;\n        } else {\n            if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;\n            else hi = mid - 1;\n        }\n    }\n    return -1;\n}`
        },
        testCases: [
            { args: [[4, 5, 6, 7, 0, 1, 2], 0], expected: 4, isHidden: false },
            { args: [[4, 5, 6, 7, 0, 1, 2], 3], expected: -1, isHidden: false },
            { args: [[1], 0], expected: -1, isHidden: true },
            { args: [[5, 1, 3], 3], expected: 2, isHidden: true }
        ]
    },
    {
        id: 'find-peak-element',
        number: 20,
        title: 'Find Peak Index in Mountain',
        company: 'TCS NQT',
        companyBadge: 'TCS NQT 2024',
        context: 'Asked in TCS NQT Shift 1',
        difficulty: 'Medium',
        topic: 'Searching',
        fnName: 'solve',
        params: [{ name: 'nums', type: 'int[]' }],
        returnType: 'int',
        description: 'A peak element is strictly greater than its neighbors. Given an array `nums`, find a peak element and return its index in $O(\\log n)$ time.',
        constraints: ['1 <= nums.length <= 1000'],
        hint: 'Binary search: if nums[mid] < nums[mid + 1], a peak must exist on the right side (lo = mid + 1).',
        starter: {
            c: `int solve(int nums[], int n) {\n    int lo = 0, hi = n - 1;\n    while (lo < hi) {\n        int mid = (lo + hi) / 2;\n        if (nums[mid] < nums[mid + 1]) lo = mid + 1;\n        else hi = mid;\n    }\n    return lo;\n}`,
            cpp: `int solve(vector<int> nums) {\n    int lo = 0, hi = nums.size() - 1;\n    while (lo < hi) {\n        int mid = (lo + hi) / 2;\n        if (nums[mid] < nums[mid + 1]) lo = mid + 1;\n        else hi = mid;\n    }\n    return lo;\n}`,
            java: `public int solve(int[] nums) {\n    int lo = 0, hi = nums.length - 1;\n    while (lo < hi) {\n        int mid = (lo + hi) / 2;\n        if (nums[mid] < nums[mid + 1]) lo = mid + 1;\n        else hi = mid;\n    }\n    return lo;\n}`,
            python: `def solve(nums):\n    lo, hi = 0, len(nums) - 1\n    while lo < hi:\n        mid = (lo + hi) // 2\n        if nums[mid] < nums[mid + 1]:\n            lo = mid + 1\n        else:\n            hi = mid\n    return lo`,
            javascript: `function solve(nums) {\n    let lo = 0, hi = nums.length - 1;\n    while (lo < hi) {\n        let mid = Math.floor((lo + hi) / 2);\n        if (nums[mid] < nums[mid + 1]) lo = mid + 1;\n        else hi = mid;\n    }\n    return lo;\n}`
        },
        testCases: [
            { args: [[1, 2, 3, 1]], expected: 2, isHidden: false },
            { args: [[1, 2, 1, 3, 5, 6, 4]], expected: 5, isHidden: false },
            { args: [[10, 20, 15, 2, 23, 90, 67]], expected: 5, isHidden: true }
        ]
    },
    {
        id: 'factorial-trailing-zeroes',
        number: 21,
        title: 'Factorial Trailing Zeroes',
        company: 'Tech Mahindra',
        companyBadge: 'Tech Mahindra 2024',
        context: 'Asked in Tech Mahindra Coding Assessment',
        difficulty: 'Medium',
        topic: 'Math & Logic',
        fnName: 'solve',
        params: [{ name: 'n', type: 'int' }],
        returnType: 'int',
        description: 'Given an integer `n`, return the number of trailing zeroes in `n!` ($n$ factorial) in $O(\\log_5 n)$ time.',
        constraints: ['0 <= n <= 10^4'],
        hint: 'Count factors of 5 by repeatedly dividing n by 5 and adding to count.',
        starter: {
            c: `int solve(int n) {\n    int count = 0;\n    while (n > 0) {\n        n = n / 5;\n        count += n;\n    }\n    return count;\n}`,
            cpp: `int solve(int n) {\n    int count = 0;\n    while (n > 0) {\n        n = n / 5;\n        count += n;\n    }\n    return count;\n}`,
            java: `public int solve(int n) {\n    int count = 0;\n    while (n > 0) {\n        n = n / 5;\n        count += n;\n    }\n    return count;\n}`,
            python: `def solve(n):\n    count = 0\n    while n > 0:\n        n = n // 5\n        count += n\n    return count`,
            javascript: `function solve(n) {\n    let count = 0;\n    while (n > 0) {\n        n = Math.floor(n / 5);\n        count += n;\n    }\n    return count;\n}`
        },
        testCases: [
            { args: [5], expected: 1, isHidden: false },
            { args: [25], expected: 6, isHidden: false },
            { args: [100], expected: 24, isHidden: true },
            { args: [3], expected: 0, isHidden: true }
        ]
    },
    {
        id: 'valid-anagram-sort',
        number: 22,
        title: 'Valid Anagram Strings',
        company: 'Accenture',
        companyBadge: 'Accenture 2024',
        context: 'Asked in Accenture Advanced Coding Round',
        difficulty: 'Medium',
        topic: 'Strings',
        fnName: 'solve',
        params: [
            { name: 's', type: 'string' },
            { name: 't', type: 'string' }
        ],
        returnType: 'int',
        description: 'Given two lowercase strings `s` and `t`, return `1` if `t` is an anagram of `s`, and `0` otherwise.',
        constraints: ['1 <= s.length, t.length <= 5 * 10^4'],
        hint: 'Sort both strings and compare, or count character frequencies.',
        starter: {
            c: `int solve(string s, string t) {\n    if (s.length() != t.length()) return 0;\n    sort(s.begin(), s.end());\n    sort(t.begin(), t.end());\n    return s == t ? 1 : 0;\n}`,
            cpp: `int solve(string s, string t) {\n    if (s.size() != t.size()) return 0;\n    sort(s.begin(), s.end());\n    sort(t.begin(), t.end());\n    return s == t ? 1 : 0;\n}`,
            java: `public int solve(String s, String t) {\n    if (s.length() != t.length()) return 0;\n    char[] a = s.toCharArray();\n    char[] b = t.toCharArray();\n    Arrays.sort(a);\n    Arrays.sort(b);\n    return Arrays.equals(a, b) ? 1 : 0;\n}`,
            python: `def solve(s, t):\n    return 1 if sorted(s) == sorted(t) else 0`,
            javascript: `function solve(s, t) {\n    if (s.length !== t.length) return 0;\n    return s.split('').sort().join('') === t.split('').sort().join('') ? 1 : 0;\n}`
        },
        testCases: [
            { args: ['anagram', 'nagaram'], expected: 1, isHidden: false },
            { args: ['rat', 'car'], expected: 0, isHidden: false },
            { args: ['listen', 'silent'], expected: 1, isHidden: true }
        ]
    },
    {
        id: 'max-sliding-window-sum-k',
        number: 23,
        title: 'Max Subarray Sum of Size K',
        company: 'Cognizant',
        companyBadge: 'Cognizant 2024',
        context: 'Asked in Cognizant Next Assessment',
        difficulty: 'Medium',
        topic: 'Sliding Window',
        fnName: 'solve',
        params: [
            { name: 'nums', type: 'int[]' },
            { name: 'k', type: 'int' }
        ],
        returnType: 'int',
        description: 'Given an array of integers `nums` and a window size `k`, return the maximum sum of any contiguous subarray of length `k`.',
        constraints: ['1 <= k <= nums.length <= 10^5'],
        hint: 'Compute the sum of the first k elements, then slide the window by adding nums[i] and subtracting nums[i - k].',
        starter: {
            c: `int solve(int nums[], int n, int k) {\n    int win = 0;\n    for (int i = 0; i < k; i++) win += nums[i];\n    int best = win;\n    for (int i = k; i < n; i++) {\n        win += nums[i] - nums[i - k];\n        if (win > best) best = win;\n    }\n    return best;\n}`,
            cpp: `int solve(vector<int> nums, int k) {\n    int win = 0;\n    for (int i = 0; i < k; i++) win += nums[i];\n    int best = win;\n    for (int i = k; i < nums.size(); i++) {\n        win += nums[i] - nums[i - k];\n        best = max(best, win);\n    }\n    return best;\n}`,
            java: `public int solve(int[] nums, int k) {\n    int win = 0;\n    for (int i = 0; i < k; i++) win += nums[i];\n    int best = win;\n    for (int i = k; i < nums.length; i++) {\n        win += nums[i] - nums[i - k];\n        best = Math.max(best, win);\n    }\n    return best;\n}`,
            python: `def solve(nums, k):\n    win = sum(nums[:k])\n    best = win\n    for i in range(k, len(nums)):\n        win += nums[i] - nums[i - k]\n        if win > best:\n            best = win\n    return best`,
            javascript: `function solve(nums, k) {\n    let win = 0;\n    for (let i = 0; i < k; i++) win += nums[i];\n    let best = win;\n    for (let i = k; i < nums.length; i++) {\n        win += nums[i] - nums[i - k];\n        best = Math.max(best, win);\n    }\n    return best;\n}`
        },
        testCases: [
            { args: [[2, 1, 5, 1, 3, 2], 3], expected: 9, isHidden: false },
            { args: [[2, 3, 4, 1, 5], 2], expected: 7, isHidden: false },
            { args: [[10, 20, 30, 40], 2], expected: 70, isHidden: true }
        ]
    },
    {
        id: 'count-set-bits-kernighan',
        number: 24,
        title: 'Hamming Weight (Set Bits Count)',
        company: 'Zoho',
        companyBadge: 'Zoho 2024',
        context: 'Asked in Zoho Technical Round',
        difficulty: 'Medium',
        topic: 'Bit Manipulation',
        fnName: 'solve',
        params: [{ name: 'n', type: 'int' }],
        returnType: 'int',
        description: 'Given a positive integer `n`, return the number of `1` bits in its binary representation (also known as the Hamming weight).',
        constraints: ['1 <= n <= 10^9'],
        hint: 'Use Brian Kernighan’s trick: n = n & (n - 1) clears the lowest set bit in each iteration.',
        starter: {
            c: `int solve(int n) {\n    int count = 0;\n    while (n > 0) {\n        n = n & (n - 1);\n        count++;\n    }\n    return count;\n}`,
            cpp: `int solve(int n) {\n    int count = 0;\n    while (n > 0) {\n        n = n & (n - 1);\n        count++;\n    }\n    return count;\n}`,
            java: `public int solve(int n) {\n    int count = 0;\n    while (n > 0) {\n        n = n & (n - 1);\n        count++;\n    }\n    return count;\n}`,
            python: `def solve(n):\n    count = 0\n    while n > 0:\n        n = n & (n - 1)\n        count += 1\n    return count`,
            javascript: `function solve(n) {\n    let count = 0;\n    while (n > 0) {\n        n = n & (n - 1);\n        count++;\n    }\n    return count;\n}`
        },
        testCases: [
            { args: [11], expected: 3, isHidden: false },
            { args: [128], expected: 1, isHidden: false },
            { args: [255], expected: 8, isHidden: true }
        ]
    },

    // ======================== HARD (25 - 36) ========================
    {
        id: 'trapping-rain-water',
        number: 25,
        title: 'Trapping Rain Water',
        company: 'Infosys',
        companyBadge: 'Infosys DSE 2024',
        context: 'Asked in Infosys DSE Coding Round',
        difficulty: 'Hard',
        topic: 'Two Pointers',
        fnName: 'solve',
        params: [{ name: 'height', type: 'int[]' }],
        returnType: 'int',
        description: 'Given `n` non-negative integers representing an elevation map where the width of each bar is `1`, compute how much rainwater can be trapped after raining.',
        constraints: ['1 <= height.length <= 2 * 10^4', '0 <= height[i] <= 10^5'],
        hint: 'Use two pointers (l, r) and track lMax and rMax. Add lMax - height[l] or rMax - height[r] at each step.',
        starter: {
            c: `int solve(int height[], int n) {\n    int l = 0, r = n - 1, lMax = 0, rMax = 0, water = 0;\n    while (l < r) {\n        if (height[l] < height[r]) {\n            if (height[l] > lMax) lMax = height[l];\n            water += lMax - height[l];\n            l++;\n        } else {\n            if (height[r] > rMax) rMax = height[r];\n            water += rMax - height[r];\n            r--;\n        }\n    }\n    return water;\n}`,
            cpp: `int solve(vector<int> height) {\n    int l = 0, r = height.size() - 1, lMax = 0, rMax = 0, water = 0;\n    while (l < r) {\n        if (height[l] < height[r]) {\n            lMax = max(lMax, height[l]);\n            water += lMax - height[l++];\n        } else {\n            rMax = max(rMax, height[r]);\n            water += rMax - height[r--];\n        }\n    }\n    return water;\n}`,
            java: `public int solve(int[] height) {\n    int l = 0, r = height.length - 1, lMax = 0, rMax = 0, water = 0;\n    while (l < r) {\n        if (height[l] < height[r]) {\n            lMax = Math.max(lMax, height[l]);\n            water += lMax - height[l++];\n        } else {\n            rMax = Math.max(rMax, height[r]);\n            water += rMax - height[r--];\n        }\n    }\n    return water;\n}`,
            python: `def solve(height):\n    l, r = 0, len(height) - 1\n    l_max = r_max = water = 0\n    while l < r:\n        if height[l] < height[r]:\n            l_max = max(l_max, height[l])\n            water += l_max - height[l]\n            l += 1\n        else:\n            r_max = max(r_max, height[r])\n            water += r_max - height[r]\n            r -= 1\n    return water`,
            javascript: `function solve(height) {\n    let l = 0, r = height.length - 1, lMax = 0, rMax = 0, water = 0;\n    while (l < r) {\n        if (height[l] < height[r]) {\n            lMax = Math.max(lMax, height[l]);\n            water += lMax - height[l++];\n        } else {\n            rMax = Math.max(rMax, height[r]);\n            water += rMax - height[r--];\n        }\n    }\n    return water;\n}`
        },
        testCases: [
            { args: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], expected: 6, isHidden: false },
            { args: [[4, 2, 0, 3, 2, 5]], expected: 9, isHidden: false },
            { args: [[3, 0, 2, 0, 4]], expected: 7, isHidden: true }
        ]
    },
    {
        id: 'coin-change-min',
        number: 26,
        title: 'Coin Change Minimum Coins',
        company: 'TCS NQT',
        companyBadge: 'TCS Digital 2024',
        context: 'Asked in TCS Digital Coding Round',
        difficulty: 'Hard',
        topic: 'Dynamic Programming',
        fnName: 'solve',
        params: [
            { name: 'coins', type: 'int[]' },
            { name: 'amount', type: 'int' }
        ],
        returnType: 'int',
        description: 'Given an integer array `coins` representing coin denominations and an integer `amount`, return the fewest number of coins needed to make up that amount, or `-1` if it cannot be made.',
        constraints: ['1 <= coins.length <= 12', '0 <= amount <= 10^4'],
        hint: 'Build a DP array of size amount + 1 initialized to amount + 1, with dp[0] = 0.',
        starter: {
            c: `int solve(int coins[], int n, int amount) {\n    vector<int> dp(amount + 1, amount + 1);\n    dp[0] = 0;\n    for (int i = 1; i <= amount; i++) {\n        for (int j = 0; j < n; j++) {\n            if (coins[j] <= i && dp[i - coins[j]] + 1 < dp[i]) {\n                dp[i] = dp[i - coins[j]] + 1;\n            }\n        }\n    }\n    return dp[amount] > amount ? -1 : dp[amount];\n}`,
            cpp: `int solve(vector<int> coins, int amount) {\n    vector<int> dp(amount + 1, amount + 1);\n    dp[0] = 0;\n    for (int i = 1; i <= amount; i++) {\n        for (int c : coins) {\n            if (c <= i) dp[i] = min(dp[i], dp[i - c] + 1);\n        }\n    }\n    return dp[amount] > amount ? -1 : dp[amount];\n}`,
            java: `public int solve(int[] coins, int amount) {\n    int[] dp = new int[amount + 1];\n    Arrays.fill(dp, amount + 1);\n    dp[0] = 0;\n    for (int i = 1; i <= amount; i++) {\n        for (int c : coins) {\n            if (c <= i) dp[i] = Math.min(dp[i], dp[i - c] + 1);\n        }\n    }\n    return dp[amount] > amount ? -1 : dp[amount];\n}`,
            python: `def solve(coins, amount):\n    dp = [amount + 1] * (amount + 1)\n    dp[0] = 0\n    for i in range(1, amount + 1):\n        for c in coins:\n            if c <= i:\n                dp[i] = min(dp[i], dp[i - c] + 1)\n    return -1 if dp[amount] > amount else dp[amount]`,
            javascript: `function solve(coins, amount) {\n    const dp = new Array(amount + 1).fill(amount + 1);\n    dp[0] = 0;\n    for (let i = 1; i <= amount; i++) {\n        for (const c of coins) {\n            if (c <= i) dp[i] = Math.min(dp[i], dp[i - c] + 1);\n        }\n    }\n    return dp[amount] > amount ? -1 : dp[amount];\n}`
        },
        testCases: [
            { args: [[1, 2, 5], 11], expected: 3, isHidden: false },
            { args: [[2], 3], expected: -1, isHidden: false },
            { args: [[1], 0], expected: 0, isHidden: true },
            { args: [[1, 3, 4], 6], expected: 2, isHidden: true }
        ]
    },
    {
        id: 'longest-increasing-subseq',
        number: 27,
        title: 'Longest Increasing Subsequence',
        company: 'Cognizant',
        companyBadge: 'Cognizant 2024',
        context: 'Asked in Cognizant GenC Elevate Round',
        difficulty: 'Hard',
        topic: 'Dynamic Programming',
        fnName: 'solve',
        params: [{ name: 'nums', type: 'int[]' }],
        returnType: 'int',
        description: 'Given an integer array `nums`, return the length of the longest strictly increasing subsequence.',
        constraints: ['1 <= nums.length <= 2500'],
        hint: 'dp[i] = 1 + max(dp[j]) for all j < i where nums[j] < nums[i].',
        starter: {
            c: `int solve(int nums[], int n) {\n    vector<int> dp(n, 1);\n    int best = 1;\n    for (int i = 1; i < n; i++) {\n        for (int j = 0; j < i; j++) {\n            if (nums[j] < nums[i] && dp[j] + 1 > dp[i]) dp[i] = dp[j] + 1;\n        }\n        if (dp[i] > best) best = dp[i];\n    }\n    return best;\n}`,
            cpp: `int solve(vector<int> nums) {\n    int n = nums.size(), best = 1;\n    vector<int> dp(n, 1);\n    for (int i = 1; i < n; i++) {\n        for (int j = 0; j < i; j++) {\n            if (nums[j] < nums[i]) dp[i] = max(dp[i], dp[j] + 1);\n        }\n        best = max(best, dp[i]);\n    }\n    return best;\n}`,
            java: `public int solve(int[] nums) {\n    int n = nums.length, best = 1;\n    int[] dp = new int[n];\n    Arrays.fill(dp, 1);\n    for (int i = 1; i < n; i++) {\n        for (int j = 0; j < i; j++) {\n            if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);\n        }\n        best = Math.max(best, dp[i]);\n    }\n    return best;\n}`,
            python: `def solve(nums):\n    n = len(nums)\n    dp = [1] * n\n    for i in range(1, n):\n        for j in range(i):\n            if nums[j] < nums[i]:\n                dp[i] = max(dp[i], dp[j] + 1)\n    return max(dp)`,
            javascript: `function solve(nums) {\n    const dp = new Array(nums.length).fill(1);\n    let best = 1;\n    for (let i = 1; i < nums.length; i++) {\n        for (let j = 0; j < i; j++) {\n            if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);\n        }\n        best = Math.max(best, dp[i]);\n    }\n    return best;\n}`
        },
        testCases: [
            { args: [[10, 9, 2, 5, 3, 7, 101, 18]], expected: 4, isHidden: false },
            { args: [[0, 1, 0, 3, 2, 3]], expected: 4, isHidden: false },
            { args: [[7, 7, 7, 7]], expected: 1, isHidden: true }
        ]
    },
    {
        id: 'first-missing-positive',
        number: 28,
        title: 'First Missing Positive Integer',
        company: 'Accenture',
        companyBadge: 'Accenture 2024',
        context: 'Asked in Accenture Critical Coding Round',
        difficulty: 'Hard',
        topic: 'Arrays & Hashing',
        fnName: 'solve',
        params: [{ name: 'nums', type: 'int[]' }],
        returnType: 'int',
        description: 'Given an unsorted integer array `nums`, return the smallest positive integer ($\\ge 1$) that is not present in `nums`.',
        constraints: ['1 <= nums.length <= 10^5'],
        hint: 'Sort or place each positive number x into index x - 1, then scan for the first mismatch.',
        starter: {
            c: `int solve(int nums[], int n) {\n    sort(nums.begin(), nums.end());\n    int target = 1;\n    for (int i = 0; i < n; i++) {\n        if (nums[i] == target) target++;\n    }\n    return target;\n}`,
            cpp: `int solve(vector<int> nums) {\n    sort(nums.begin(), nums.end());\n    int target = 1;\n    for (int x : nums) {\n        if (x == target) target++;\n    }\n    return target;\n}`,
            java: `public int solve(int[] nums) {\n    Arrays.sort(nums);\n    int target = 1;\n    for (int x : nums) {\n        if (x == target) target++;\n    }\n    return target;\n}`,
            python: `def solve(nums):\n    nums.sort()\n    target = 1\n    for x in nums:\n        if x == target:\n            target += 1\n    return target`,
            javascript: `function solve(nums) {\n    nums.sort((a, b) => a - b);\n    let target = 1;\n    for (const x of nums) {\n        if (x === target) target++;\n    }\n    return target;\n}`
        },
        testCases: [
            { args: [[1, 2, 0]], expected: 3, isHidden: false },
            { args: [[3, 4, -1, 1]], expected: 2, isHidden: false },
            { args: [[7, 8, 9, 11, 12]], expected: 1, isHidden: true }
        ]
    },
    {
        id: 'max-product-subarray',
        number: 29,
        title: 'Maximum Product Subarray',
        company: 'Capgemini',
        companyBadge: 'Capgemini 2024',
        context: 'Asked in Capgemini Exceller Test',
        difficulty: 'Hard',
        topic: 'Dynamic Programming',
        fnName: 'solve',
        params: [{ name: 'nums', type: 'int[]' }],
        returnType: 'int',
        description: 'Given an integer array `nums`, find a contiguous non-empty subarray that has the largest product, and return the product.',
        constraints: ['1 <= nums.length <= 2 * 10^4', '-10 <= nums[i] <= 10'],
        hint: 'Track both maxProd and minProd at each step because a negative number flips min and max.',
        starter: {
            c: `int solve(int nums[], int n) {\n    int maxP = nums[0], minP = nums[0], ans = nums[0];\n    for (int i = 1; i < n; i++) {\n        if (nums[i] < 0) { int t = maxP; maxP = minP; minP = t; }\n        maxP = max(nums[i], maxP * nums[i]);\n        minP = min(nums[i], minP * nums[i]);\n        ans = max(ans, maxP);\n    }\n    return ans;\n}`,
            cpp: `int solve(vector<int> nums) {\n    int maxP = nums[0], minP = nums[0], ans = nums[0];\n    for (int i = 1; i < nums.size(); i++) {\n        if (nums[i] < 0) swap(maxP, minP);\n        maxP = max(nums[i], maxP * nums[i]);\n        minP = min(nums[i], minP * nums[i]);\n        ans = max(ans, maxP);\n    }\n    return ans;\n}`,
            java: `public int solve(int[] nums) {\n    int maxP = nums[0], minP = nums[0], ans = nums[0];\n    for (int i = 1; i < nums.length; i++) {\n        if (nums[i] < 0) { int t = maxP; maxP = minP; minP = t; }\n        maxP = Math.max(nums[i], maxP * nums[i]);\n        minP = Math.min(nums[i], minP * nums[i]);\n        ans = Math.max(ans, maxP);\n    }\n    return ans;\n}`,
            python: `def solve(nums):\n    max_p = min_p = ans = nums[0]\n    for x in nums[1:]:\n        if x < 0:\n            max_p, min_p = min_p, max_p\n        max_p = max(x, max_p * x)\n        min_p = min(x, min_p * x)\n        ans = max(ans, max_p)\n    return ans`,
            javascript: `function solve(nums) {\n    let maxP = nums[0], minP = nums[0], ans = nums[0];\n    for (let i = 1; i < nums.length; i++) {\n        if (nums[i] < 0) [maxP, minP] = [minP, maxP];\n        maxP = Math.max(nums[i], maxP * nums[i]);\n        minP = Math.min(nums[i], minP * nums[i]);\n        ans = Math.max(ans, maxP);\n    }\n    return ans;\n}`
        },
        testCases: [
            { args: [[2, 3, -2, 4]], expected: 6, isHidden: false },
            { args: [[-2, 0, -1]], expected: 0, isHidden: false },
            { args: [[-2, 3, -4]], expected: 24, isHidden: true }
        ]
    },
    {
        id: 'subarray-sum-equals-k',
        number: 30,
        title: 'Subarray Sum Equals K Count',
        company: 'TCS NQT',
        companyBadge: 'TCS Digital 2024',
        context: 'Asked in TCS Digital Coding',
        difficulty: 'Hard',
        topic: 'Arrays & Hashing',
        fnName: 'solve',
        params: [
            { name: 'nums', type: 'int[]' },
            { name: 'k', type: 'int' }
        ],
        returnType: 'int',
        description: 'Given an array of integers `nums` and an integer `k`, return the total number of contiguous subarrays whose sum equals `k`.',
        constraints: ['1 <= nums.length <= 2 * 10^4'],
        hint: 'Check all contiguous subarrays or maintain prefix sums.',
        starter: {
            c: `int solve(int nums[], int n, int k) {\n    int count = 0;\n    for (int i = 0; i < n; i++) {\n        int sum = 0;\n        for (int j = i; j < n; j++) {\n            sum += nums[j];\n            if (sum == k) count++;\n        }\n    }\n    return count;\n}`,
            cpp: `int solve(vector<int> nums, int k) {\n    int count = 0, n = nums.size();\n    for (int i = 0; i < n; i++) {\n        int sum = 0;\n        for (int j = i; j < n; j++) {\n            sum += nums[j];\n            if (sum == k) count++;\n        }\n    }\n    return count;\n}`,
            java: `public int solve(int[] nums, int k) {\n    int count = 0;\n    for (int i = 0; i < nums.length; i++) {\n        int sum = 0;\n        for (int j = i; j < nums.length; j++) {\n            sum += nums[j];\n            if (sum == k) count++;\n        }\n    }\n    return count;\n}`,
            python: `def solve(nums, k):\n    count = 0\n    n = len(nums)\n    for i in range(n):\n        cur = 0\n        for j in range(i, n):\n            cur += nums[j]\n            if cur == k:\n                count += 1\n    return count`,
            javascript: `function solve(nums, k) {\n    let count = 0;\n    for (let i = 0; i < nums.length; i++) {\n        let sum = 0;\n        for (let j = i; j < nums.length; j++) {\n            sum += nums[j];\n            if (sum === k) count++;\n        }\n    }\n    return count;\n}`
        },
        testCases: [
            { args: [[1, 1, 1], 2], expected: 2, isHidden: false },
            { args: [[1, 2, 3], 3], expected: 2, isHidden: false },
            { args: [[3, 4, 7, 2, -3, 1, 4, 2], 7], expected: 4, isHidden: true }
        ]
    },
    {
        id: 'dutch-national-flag-sort',
        number: 31,
        title: 'Sort Colors (0s, 1s, and 2s)',
        company: 'Capgemini',
        companyBadge: 'Capgemini 2024',
        context: 'Asked in Capgemini Technical Round',
        difficulty: 'Hard',
        topic: 'Two Pointers',
        fnName: 'solve',
        params: [{ name: 'nums', type: 'int[]' }],
        returnType: 'int[]',
        description: 'Given an array `nums` with `n` objects colored `0`, `1`, or `2`, sort them in-place in a single pass using the Dutch National Flag algorithm.',
        constraints: ['1 <= nums.length <= 300'],
        hint: 'Maintain three pointers: lo = 0, mid = 0, hi = n - 1.',
        starter: {
            c: `int* solve(int nums[], int n) {\n    sort(nums.begin(), nums.end());\n    return nums;\n}`,
            cpp: `vector<int> solve(vector<int> nums) {\n    sort(nums.begin(), nums.end());\n    return nums;\n}`,
            java: `public int solve(int[] nums) {\n    Arrays.sort(nums);\n    return nums;\n}`,
            python: `def solve(nums):\n    nums.sort()\n    return nums`,
            javascript: `function solve(nums) {\n    return nums.sort((a, b) => a - b);\n}`
        },
        testCases: [
            { args: [[2, 0, 2, 1, 1, 0]], expected: [0, 0, 1, 1, 2, 2], isHidden: false },
            { args: [[2, 0, 1]], expected: [0, 1, 2], isHidden: false },
            { args: [[1, 0, 0, 2, 1]], expected: [0, 0, 1, 1, 2], isHidden: true }
        ]
    },
    {
        id: 'jump-game-reach',
        number: 32,
        title: 'Jump Game Reachability',
        company: 'Infosys',
        companyBadge: 'Infosys 2024',
        context: 'Asked in Infosys Specialist Programmer',
        difficulty: 'Hard',
        topic: 'Dynamic Programming',
        fnName: 'solve',
        params: [{ name: 'nums', type: 'int[]' }],
        returnType: 'int',
        description: 'You are given an integer array `nums` where `nums[i]` is your maximum jump length at position `i`. Return `1` if you can reach the last index, or `0` otherwise.',
        constraints: ['1 <= nums.length <= 10^4'],
        hint: 'Track the farthest index reachable so far. If i > reach, return 0.',
        starter: {
            c: `int solve(int nums[], int n) {\n    int reach = 0;\n    for (int i = 0; i < n; i++) {\n        if (i > reach) return 0;\n        if (i + nums[i] > reach) reach = i + nums[i];\n    }\n    return 1;\n}`,
            cpp: `int solve(vector<int> nums) {\n    int reach = 0;\n    for (int i = 0; i < nums.size(); i++) {\n        if (i > reach) return 0;\n        reach = max(reach, i + nums[i]);\n    }\n    return 1;\n}`,
            java: `public int solve(int[] nums) {\n    int reach = 0;\n    for (int i = 0; i < nums.length; i++) {\n        if (i > reach) return 0;\n        reach = Math.max(reach, i + nums[i]);\n    }\n    return 1;\n}`,
            python: `def solve(nums):\n    reach = 0\n    for i in range(len(nums)):\n        if i > reach:\n            return 0\n        reach = max(reach, i + nums[i])\n    return 1`,
            javascript: `function solve(nums) {\n    let reach = 0;\n    for (let i = 0; i < nums.length; i++) {\n        if (i > reach) return 0;\n        reach = Math.max(reach, i + nums[i]);\n    }\n    return 1;\n}`
        },
        testCases: [
            { args: [[2, 3, 1, 1, 4]], expected: 1, isHidden: false },
            { args: [[3, 2, 1, 0, 4]], expected: 0, isHidden: false },
            { args: [[0]], expected: 1, isHidden: true }
        ]
    },
    {
        id: 'count-primes-sieve',
        number: 33,
        title: 'Count Primes Less Than N (Sieve)',
        company: 'Tech Mahindra',
        companyBadge: 'Tech Mahindra 2024',
        context: 'Asked in Tech Mahindra On-Campus Test',
        difficulty: 'Hard',
        topic: 'Math & Logic',
        fnName: 'solve',
        params: [{ name: 'n', type: 'int' }],
        returnType: 'int',
        description: 'Given an integer `n`, return the number of prime numbers that are strictly less than `n`.',
        constraints: ['0 <= n <= 5 * 10^4'],
        hint: 'Use the Sieve of Eratosthenes array of size n.',
        starter: {
            c: `int solve(int n) {\n    if (n <= 2) return 0;\n    vector<int> prime(n, 1);\n    prime[0] = 0; prime[1] = 0;\n    for (int p = 2; p * p < n; p++) {\n        if (prime[p]) {\n            for (int i = p * p; i < n; i += p) prime[i] = 0;\n        }\n    }\n    int cnt = 0;\n    for (int i = 2; i < n; i++) cnt += prime[i];\n    return cnt;\n}`,
            cpp: `int solve(int n) {\n    if (n <= 2) return 0;\n    vector<int> prime(n, 1);\n    for (int p = 2; p * p < n; p++) {\n        if (prime[p]) {\n            for (int i = p * p; i < n; i += p) prime[i] = 0;\n        }\n    }\n    int cnt = 0;\n    for (int i = 2; i < n; i++) cnt += prime[i];\n    return cnt;\n}`,
            java: `public int solve(int n) {\n    if (n <= 2) return 0;\n    int[] prime = new int[n];\n    Arrays.fill(prime, 1);\n    for (int p = 2; p * p < n; p++) {\n        if (prime[p] == 1) {\n            for (int i = p * p; i < n; i += p) prime[i] = 0;\n        }\n    }\n    int cnt = 0;\n    for (int i = 2; i < n; i++) cnt += prime[i];\n    return cnt;\n}`,
            python: `def solve(n):\n    if n <= 2:\n        return 0\n    prime = [1] * n\n    prime[0] = prime[1] = 0\n    p = 2\n    while p * p < n:\n        if prime[p]:\n            i = p * p\n            while i < n:\n                prime[i] = 0\n                i += p\n        p += 1\n    return sum(prime)`,
            javascript: `function solve(n) {\n    if (n <= 2) return 0;\n    const prime = new Array(n).fill(1);\n    for (let p = 2; p * p < n; p++) {\n        if (prime[p]) {\n            for (let i = p * p; i < n; i += p) prime[i] = 0;\n        }\n    }\n    let cnt = 0;\n    for (let i = 2; i < n; i++) cnt += prime[i];\n    return cnt;\n}`
        },
        testCases: [
            { args: [10], expected: 4, isHidden: false },
            { args: [0], expected: 0, isHidden: false },
            { args: [100], expected: 25, isHidden: true }
        ]
    },
    {
        id: 'find-duplicate-floyd',
        number: 34,
        title: 'Find the Duplicate Number',
        company: 'Tech Mahindra',
        companyBadge: 'Tech Mahindra 2024',
        context: 'Asked in Tech Mahindra Coding Round',
        difficulty: 'Hard',
        topic: 'Two Pointers',
        fnName: 'solve',
        params: [{ name: 'nums', type: 'int[]' }],
        returnType: 'int',
        description: 'Given an array of integers `nums` containing `n + 1` integers where each integer is in `[1, n]` inclusive, find and return the repeated number.',
        constraints: ['2 <= nums.length <= 10^5'],
        hint: 'Use Floyd cycle detection or sort a copy to spot adjacent equals.',
        starter: {
            c: `int solve(int nums[], int n) {\n    sort(nums.begin(), nums.end());\n    for (int i = 1; i < n; i++) {\n        if (nums[i] == nums[i - 1]) return nums[i];\n    }\n    return -1;\n}`,
            cpp: `int solve(vector<int> nums) {\n    sort(nums.begin(), nums.end());\n    for (int i = 1; i < nums.size(); i++) {\n        if (nums[i] == nums[i - 1]) return nums[i];\n    }\n    return -1;\n}`,
            java: `public int solve(int[] nums) {\n    Arrays.sort(nums);\n    for (int i = 1; i < nums.length; i++) {\n        if (nums[i] == nums[i - 1]) return nums[i];\n    }\n    return -1;\n}`,
            python: `def solve(nums):\n    nums.sort()\n    for i in range(1, len(nums)):\n        if nums[i] == nums[i - 1]:\n            return nums[i]\n    return -1`,
            javascript: `function solve(nums) {\n    nums.sort((a, b) => a - b);\n    for (let i = 1; i < nums.length; i++) {\n        if (nums[i] === nums[i - 1]) return nums[i];\n    }\n    return -1;\n}`
        },
        testCases: [
            { args: [[1, 3, 4, 2, 2]], expected: 2, isHidden: false },
            { args: [[3, 1, 3, 4, 2]], expected: 3, isHidden: false },
            { args: [[3, 3, 3, 3]], expected: 3, isHidden: true }
        ]
    },
    {
        id: 'koko-eating-bananas',
        number: 35,
        title: 'Minimum Eating Speed (Binary Answer)',
        company: 'Zoho',
        companyBadge: 'Zoho 2024',
        context: 'Asked in Zoho Round 2 Advanced Coding',
        difficulty: 'Hard',
        topic: 'Searching',
        fnName: 'solve',
        params: [
            { name: 'piles', type: 'int[]' },
            { name: 'h', type: 'int' }
        ],
        returnType: 'int',
        description: 'Given `piles` of bananas and `h` hours before guards return, find the minimum integer eating speed `k` (bananas/hour) such that all bananas can be eaten within `h` hours.',
        constraints: ['1 <= piles.length <= 10^4', 'piles.length <= h <= 10^9'],
        hint: 'Binary search speed k between 1 and max(piles). Hours needed for pile p at speed k is (p + k - 1) / k.',
        starter: {
            c: `int solve(int piles[], int n, int h) {\n    int lo = 1, hi = 1000000;\n    while (lo < hi) {\n        int mid = (lo + hi) / 2;\n        int hours = 0;\n        for (int i = 0; i < n; i++) hours += (piles[i] + mid - 1) / mid;\n        if (hours <= h) hi = mid;\n        else lo = mid + 1;\n    }\n    return lo;\n}`,
            cpp: `int solve(vector<int> piles, int h) {\n    int lo = 1, hi = 1000000;\n    while (lo < hi) {\n        int mid = (lo + hi) / 2;\n        int hours = 0;\n        for (int p : piles) hours += (p + mid - 1) / mid;\n        if (hours <= h) hi = mid;\n        else lo = mid + 1;\n    }\n    return lo;\n}`,
            java: `public int solve(int[] piles, int h) {\n    int lo = 1, hi = 1000000;\n    while (lo < hi) {\n        int mid = (lo + hi) / 2;\n        int hours = 0;\n        for (int p : piles) hours += (p + mid - 1) / mid;\n        if (hours <= h) hi = mid;\n        else lo = mid + 1;\n    }\n    return lo;\n}`,
            python: `def solve(piles, h):\n    lo, hi = 1, max(piles)\n    while lo < hi:\n        mid = (lo + hi) // 2\n        hours = 0\n        for p in piles:\n            hours += (p + mid - 1) // mid\n        if hours <= h:\n            hi = mid\n        else:\n            lo = mid + 1\n    return lo`,
            javascript: `function solve(piles, h) {\n    let lo = 1, hi = Math.max(...piles);\n    while (lo < hi) {\n        let mid = Math.floor((lo + hi) / 2);\n        let hours = 0;\n        for (const p of piles) hours += Math.ceil(p / mid);\n        if (hours <= h) hi = mid;\n        else lo = mid + 1;\n    }\n    return lo;\n}`
        },
        testCases: [
            { args: [[3, 6, 7, 11], 8], expected: 4, isHidden: false },
            { args: [[30, 11, 23, 4, 20], 5], expected: 30, isHidden: false },
            { args: [[30, 11, 23, 4, 20], 6], expected: 23, isHidden: true }
        ]
    },
    {
        id: 'product-except-self',
        number: 36,
        title: 'Product of Array Except Self',
        company: 'Zoho',
        companyBadge: 'Zoho Advanced 2024',
        context: 'Asked in Zoho Level 2 Advanced Programming',
        difficulty: 'Hard',
        topic: 'Arrays & Hashing',
        fnName: 'solve',
        params: [{ name: 'nums', type: 'int[]' }],
        returnType: 'int[]',
        description: 'Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`, without using division.',
        constraints: ['2 <= nums.length <= 10^5'],
        hint: 'Make a prefix pass from left to right and a suffix pass from right to left.',
        starter: {
            c: `int* solve(int nums[], int n) {\n    vector<int> res(n, 1);\n    int pref = 1;\n    for (int i = 0; i < n; i++) { res[i] = pref; pref *= nums[i]; }\n    int suff = 1;\n    for (int i = n - 1; i >= 0; i--) { res[i] *= suff; suff *= nums[i]; }\n    return res;\n}`,
            cpp: `vector<int> solve(vector<int> nums) {\n    int n = nums.size();\n    vector<int> res(n, 1);\n    int pref = 1;\n    for (int i = 0; i < n; i++) { res[i] = pref; pref *= nums[i]; }\n    int suff = 1;\n    for (int i = n - 1; i >= 0; i--) { res[i] *= suff; suff *= nums[i]; }\n    return res;\n}`,
            java: `public int[] solve(int[] nums) {\n    int n = nums.length;\n    int[] res = new int[n];\n    Arrays.fill(res, 1);\n    int pref = 1;\n    for (int i = 0; i < n; i++) { res[i] = pref; pref *= nums[i]; }\n    int suff = 1;\n    for (int i = n - 1; i >= 0; i--) { res[i] *= suff; suff *= nums[i]; }\n    return res;\n}`,
            python: `def solve(nums):\n    n = len(nums)\n    res = [1] * n\n    pref = 1\n    for i in range(n):\n        res[i] = pref\n        pref *= nums[i]\n    suff = 1\n    for i in range(n - 1, -1, -1):\n        res[i] *= suff\n        suff *= nums[i]\n    return res`,
            javascript: `function solve(nums) {\n    const n = nums.length;\n    const res = new Array(n).fill(1);\n    let pref = 1;\n    for (let i = 0; i < n; i++) { res[i] = pref; pref *= nums[i]; }\n    let suff = 1;\n    for (let i = n - 1; i >= 0; i--) { res[i] *= suff; suff *= nums[i]; }\n    return res;\n}`
        },
        testCases: [
            { args: [[1, 2, 3, 4]], expected: [24, 12, 8, 6], isHidden: false },
            { args: [[-1, 1, 0, -3, 3]], expected: [0, 0, 9, 0, 0], isHidden: false },
            { args: [[2, 3, 4, 5]], expected: [60, 40, 30, 24], isHidden: true }
        ]
    }
];

// ============================================================================
// 100% CLIENT-SIDE MULTI-LANGUAGE COMPILER & TRANSPILER ENGINE
// Runs inside an isolated Web Worker so 1,500+ concurrent students cause
// 0% server load and 0 API rate limits!
// ============================================================================
const checkBalancedDelimiters = (code) => {
    const stack = [];
    const pairs = { ')': '(', ']': '[', '}': '{' };
    let inSingle = false;
    let inDouble = false;
    for (let i = 0; i < code.length; i++) {
        const ch = code[i];
        const prev = i > 0 ? code[i - 1] : '';
        if (ch === "'" && !inDouble && prev !== '\\') inSingle = !inSingle;
        else if (ch === '"' && !inSingle && prev !== '\\') inDouble = !inDouble;
        else if (!inSingle && !inDouble) {
            if (ch === '(' || ch === '[' || ch === '{') stack.push(ch);
            else if (ch === ')' || ch === ']' || ch === '}') {
                if (stack.pop() !== pairs[ch]) {
                    return `Compilation Error: Unmatched closing '${ch}' token.`;
                }
            }
        }
    }
    if (stack.length > 0) {
        return `Compilation Error: Unclosed '${stack[stack.length - 1]}' delimiter at end of source.`;
    }
    return null;
};

const transpileToExecutableJs = (lang, rawCode) => {
    const balanceErr = checkBalancedDelimiters(rawCode);
    if (balanceErr) throw new Error(balanceErr);

    if (lang === 'javascript') {
        if (!/function\s+solve\s*\(/.test(rawCode) && !/const\s+solve\s*=/.test(rawCode)) {
            throw new Error("Compilation Error: Missing 'function solve(...)' entrypoint.");
        }
        return rawCode;
    }

    if (lang === 'python') {
        if (!/def\s+solve\s*\(/.test(rawCode)) {
            throw new Error("SyntaxError: Missing 'def solve(...):' function definition.");
        }

        let prep = rawCode.replace(/\t/g, '    ');
        prep = prep.replace(/for\s+([a-zA-Z0-9_]+)\s+in\s+([a-zA-Z0-9_]+)\[1:\]:/g, 'for $1 in ($2).slice(1):');
        prep = prep.replace(/for\s+([a-zA-Z0-9_]+)\s+in\s+([a-zA-Z0-9_]+)\[:([^\]]+)\]:/g, 'for $1 in ($2).slice(0, $3):');
        prep = prep.replace(/([a-zA-Z0-9_]+)\s*\+=\s*(.+?)\s+if\s+(.+?)\s+else\s+(.+)$/gm, '$1 += ($3) ? ($2) : ($4)');

        const lines = prep.split('\n');
        const out = [];
        const indentStack = [0];

        const convertPyExpr = (expr) => {
            let e = expr
                .replace(/\bTrue\b/g, 'true')
                .replace(/\bFalse\b/g, 'false')
                .replace(/\bNone\b/g, 'null')
                .replace(/\band\b/g, '&&')
                .replace(/\bor\b/g, '||')
                .replace(/\bnot\s+/g, '!')
                .replace(/((?:\([^)]+\)|[a-zA-Z0-9_[\]()+* -])+?)\s*\/\/\s*(\([^)]+\)|[a-zA-Z0-9_[\]]+)/g, 'Math.trunc(($1) / ($2))')
                .replace(/\.append\(/g, '.push(')
                .replace(/\.sort\(\)/g, '.sort((a,b)=>(typeof a==="number"?a-b:String(a).localeCompare(String(b))))');
            return e;
        };

        for (let rawLine of lines) {
            const commentIdx = rawLine.indexOf('#');
            if (commentIdx !== -1) rawLine = rawLine.slice(0, commentIdx);
            if (!rawLine.trim()) continue;

            const indent = rawLine.match(/^ */)[0].length;
            let trimmed = rawLine.trim();

            while (indent < indentStack[indentStack.length - 1]) {
                indentStack.pop();
                out.push('}');
            }

            if (/^elif\s+(.+):$/.test(trimmed)) {
                const cond = convertPyExpr(trimmed.replace(/^elif\s+(.+):$/, '$1'));
                if (out[out.length - 1] === '}') out.pop();
                out.push(`} else if (${cond}) {`);
                indentStack.push(indent + 4);
                continue;
            }
            if (/^else\s*:$/.test(trimmed)) {
                if (out[out.length - 1] === '}') out.pop();
                out.push('} else {');
                indentStack.push(indent + 4);
                continue;
            }
            if (/^def\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\)\s*:$/.test(trimmed)) {
                out.push(trimmed.replace(/^def\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\)\s*:$/, 'function $1($2) {'));
                indentStack.push(indent + 4);
                continue;
            }
            if (/^if\s+(.+):$/.test(trimmed)) {
                let cond = trimmed.replace(/^if\s+(.+):$/, '$1');
                cond = cond.replace(/([^\s<>=!]+)\s*(<=|<)\s*([^\s<>=!]+)\s*(<=|<)\s*([^\s<>=!:]+)/g, '($1 $2 $3 && $3 $4 $5)');
                cond = cond.replace(/([a-zA-Z0-9_[\]]+)\s+in\s+("[^"]+"|'[^']+')/g, '($2).includes($1)');
                out.push(`if (${convertPyExpr(cond)}) {`);
                indentStack.push(indent + 4);
                continue;
            }
            if (/^while\s+(.+):$/.test(trimmed)) {
                const cond = convertPyExpr(trimmed.replace(/^while\s+(.+):$/, '$1'));
                out.push(`while (${cond}) {`);
                indentStack.push(indent + 4);
                continue;
            }
            if (/^for\s+([a-zA-Z0-9_]+)\s+in\s+(.+):$/.test(trimmed)) {
                const m = trimmed.match(/^for\s+([a-zA-Z0-9_]+)\s+in\s+(.+):$/);
                out.push(`for (let ${m[1]} of ${convertPyExpr(m[2])}) {`);
                indentStack.push(indent + 4);
                continue;
            }

            if (/^return\s+(.+)\s+if\s+(.+)\s+else\s+(.+)$/.test(trimmed)) {
                const m = trimmed.match(/^return\s+(.+)\s+if\s+(.+)\s+else\s+(.+)$/);
                out.push(`return (${convertPyExpr(m[2])}) ? (${convertPyExpr(m[1])}) : (${convertPyExpr(m[3])});`);
                continue;
            }

            trimmed = trimmed.replace(/\[([^\]]+)\]\s*\*\s*\(([^)]+)\)/g, 'new Array($2).fill($1)');
            trimmed = trimmed.replace(/\[([^\]]+)\]\s*\*\s*([a-zA-Z0-9_]+)/g, 'new Array($2).fill($1)');
            trimmed = trimmed.replace(/([a-zA-Z0-9_]+)\[:([a-zA-Z0-9_]+)\]/g, '$1.slice(0, $2)');
            trimmed = trimmed.replace(/([a-zA-Z0-9_]+)\[1:\]/g, '$1.slice(1)');

            if (/^([a-zA-Z0-9_]+)\s*,\s*([a-zA-Z0-9_]+)\s*=\s*(.+),(.+)$/.test(trimmed)) {
                const m = trimmed.match(/^([a-zA-Z0-9_]+)\s*,\s*([a-zA-Z0-9_]+)\s*=\s*(.+),(.+)$/);
                out.push(`[${m[1]}, ${m[2]}] = [${convertPyExpr(m[3])}, ${convertPyExpr(m[4])}];`);
                continue;
            }

            out.push(`${convertPyExpr(trimmed)};`);
        }

        while (indentStack.length > 1) {
            indentStack.pop();
            out.push('}');
        }

        const pyHelpers = `
            const range = (start, stop, step) => {
                if (stop === undefined) { stop = start; start = 0; }
                if (step === undefined) step = 1;
                const r = [];
                if (step > 0) { for (let i = start; i < stop; i += step) r.push(i); }
                else { for (let i = start; i > stop; i += step) r.push(i); }
                return r;
            };
            const len = (x) => (x ? (x.length !== undefined ? x.length : Object.keys(x).length) : 0);
            const sum = (arr) => arr.reduce((a, b) => a + b, 0);
            const max = (...args) => {
                if (args.length === 1 && Array.isArray(args[0])) return Math.max(...args[0]);
                return Math.max(...args);
            };
            const min = (...args) => {
                if (args.length === 1 && Array.isArray(args[0])) return Math.min(...args[0]);
                return Math.min(...args);
            };
            const abs = Math.abs;
            const sorted = (x) => (typeof x === 'string' ? [...x].sort().join('') : [...x].sort((a, b) => (typeof a === 'number' ? a - b : String(a).localeCompare(String(b)))));
        `;

        return pyHelpers + '\n' + out.join('\n');
    }

    // C, C++, and Java Transpiler
    if (!/\bsolve\s*\(/.test(rawCode)) {
        throw new Error("Compilation Error: Missing 'solve(...)' function signature.");
    }

    let src = rawCode;
    src = src.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');

    // 1. C array+len signature normalization
    src = src.replace(
        /(?:[a-zA-Z0-9_*]+)\s+solve\s*\(\s*(?:int|long|double|float)\s+([a-zA-Z0-9_]+)\s*\[\s*\]\s*,\s*int\s+([a-zA-Z0-9_]+)(?:,\s*([^)]*))?\)\s*\{/g,
        (_, arr, len, rest) => {
            const cleanRest = rest ? `, ${rest.replace(/\b(?:int|long|double|float|char|string)\b/g, '').trim()}` : '';
            return `function solve(${arr}${cleanRest}) {\n    let ${len} = ${arr}.length;`;
        }
    );

    // 2. Standard C/C++/Java function header
    src = src.replace(
        /(?:public\s+|private\s+|static\s+)*(?:vector<\s*[a-zA-Z0-9_]+\s*>|int\s*\[\s*\]|int\s*\*|long\s+long|int|long|double|float|bool|boolean|String|string)\s+solve\s*\(([^)]*)\)/g,
        (_, paramsStr) => {
            const cleanParams = paramsStr
                .split(',')
                .map((p) => p.trim())
                .filter(Boolean)
                .map((p) => {
                    const tokens = p.replace(/&/g, ' ').replace(/\[\s*\]/g, '').trim().split(/\s+/);
                    return tokens[tokens.length - 1];
                })
                .join(', ');
            return `function solve(${cleanParams})`;
        }
    );

    // Transform array declarations: int[] a = ..., char[] a = ...
    src = src.replace(/(?:[a-zA-Z0-9_]+)\s*\[\s*\]\s+([a-zA-Z0-9_]+)\s*=\s*new\s+(?:[a-zA-Z0-9_]+)\s*\[\s*([^\]]+)\s*\]/g, 'let $1 = new Array($2).fill(0)');
    src = src.replace(/(?:[a-zA-Z0-9_]+)\s*\[\s*\]\s+([a-zA-Z0-9_]+)\s*=/g, 'let $1 =');

    // Transform vector declarations
    src = src.replace(/vector<\s*[a-zA-Z0-9_]+\s*>\s+([a-zA-Z0-9_]+)\s*\(\s*([^,]+),\s*([^)]+)\)/g, 'let $1 = new Array($2).fill($3)');
    src = src.replace(/vector<\s*[a-zA-Z0-9_]+\s*>\s+([a-zA-Z0-9_]+)\s*\(\s*([^)]+)\)/g, 'let $1 = new Array($2).fill(0)');
    src = src.replace(/vector<\s*[a-zA-Z0-9_]+\s*>\s+([a-zA-Z0-9_]+)/g, 'let $1');

    // Java Arrays helpers (use ("" + a) so \bString\b -> let won't mangle it)
    src = src.replace(/Arrays\.fill\s*\(\s*([a-zA-Z0-9_]+)\s*,\s*([^)]+)\)/g, '$1.fill($2)');
    src = src.replace(/Arrays\.sort\s*\(\s*([a-zA-Z0-9_]+)\s*\)/g, '$1.sort((a,b)=>(typeof a==="number"?a-b:("" + a).localeCompare("" + b)))');
    src = src.replace(/Arrays\.equals\s*\(\s*([a-zA-Z0-9_]+)\s*,\s*([a-zA-Z0-9_]+)\s*\)/g, '(JSON.stringify($1) === JSON.stringify($2))');
    src = src.replace(/\.toCharArray\s*\(\s*\)/g, ".split('')");
    src = src.replace(/\.charAt\s*\(\s*([^)]+)\)/g, '[$1]');

    // C++ STL sort & swap
    src = src.replace(/sort\s*\(\s*([a-zA-Z0-9_]+)\.begin\(\)\s*,\s*\1\.end\(\)\s*\)/g, 'if (typeof $1 === "__CPP_STR__") { $1 = $1.split("").sort().join(""); } else { $1.sort((a,b)=>a-b); }');
    src = src.replace(/swap\s*\(\s*([^,]+)\s*,\s*([^)]+)\s*\)/g, '([$1, $2] = [$2, $1])');

    // Range-based for loop
    src = src.replace(/for\s*\(\s*(?:const\s+)?(?:auto|int|long|char|String|string)\s*&?\s*([a-zA-Z0-9_]+)\s*:\s*([^)]+)\)/g, 'for (let $1 of $2)');

    // Convert common typed variables
    src = src.replace(/\b(?:long\s+long|unsigned\s+int|int|long|double|float|bool|boolean|char\s*\[\s*\]|char|string|String)\b/g, 'let');
    src = src.replace(/__CPP_STR__/g, 'string');

    // Transform returns
    src = src.replace(/new\s+let\s*\[\s*\]\s*\{([^}]*)\}/g, '[$1]');
    src = src.replace(/new\s+int\s*\[\s*\]\s*\{([^}]*)\}/g, '[$1]');
    src = src.replace(/return\s+\{([^}]*)\}\s*;/g, 'return [$1];');

    // Transform .size() and .length()
    src = src.replace(/\.size\s*\(\s*\)/g, '.length');
    src = src.replace(/\.length\s*\(\s*\)/g, '.length');

    // Handle C/Java integer divisions: (a + b) / 2 -> Math.trunc((a + b) / 2)
    src = src.replace(/\(([^)]+)\)\s*\/\s*(\d+|[a-zA-Z0-9_]+)/g, 'Math.trunc(($1) / $2)');
    src = src.replace(/([a-zA-Z0-9_]+)\s*\/\s*(\d+)/g, 'Math.trunc($1 / $2)');

    // Provide max, min, abs helpers
    const helperHeader = `
        const max = Math.max;
        const min = Math.min;
        const abs = Math.abs;
    `;

    return `${helperHeader}\n${src}`;
};

// Execute inside an isolated Web Worker with a 2000ms watchdog timer
const executeInBrowserWorker = (lang, code, testCases) => {
    return new Promise((resolve) => {
        let jsSource;
        try {
            jsSource = transpileToExecutableJs(lang, code);
        } catch (compileErr) {
            resolve({
                status: 'Compilation Error',
                error: compileErr.message || String(compileErr),
                results: []
            });
            return;
        }

        const workerScript = `
            self.onmessage = function(e) {
                const { jsSource, testCases } = e.data;
                const results = [];
                try {
                    const runner = new Function(jsSource + "\\n; return solve;");
                    const solveFn = runner();
                    for (let i = 0; i < testCases.length; i++) {
                        const tc = testCases[i];
                        const argsCopy = JSON.parse(JSON.stringify(tc.args));
                        const t0 = performance.now();
                        let actual = solveFn(...argsCopy);
                        const t1 = performance.now();
                        if (typeof actual === 'number' && !Number.isInteger(actual)) {
                            actual = Math.trunc(actual);
                        }
                        const pass = JSON.stringify(actual) === JSON.stringify(tc.expected);
                        results.push({
                            index: i + 1,
                            args: tc.args,
                            expected: tc.expected,
                            actual,
                            pass,
                            isHidden: Boolean(tc.isHidden),
                            timeMs: Math.max(1, Math.round((t1 - t0) * 10) / 10)
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
                error: 'Execution exceeded 2000ms limit (Check for infinite while/for loops!).',
                results: []
            });
        }, 2000);

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
                status: 'Compilation Error',
                error: err.message || 'Syntax error in submitted code.',
                results: []
            });
        };

        worker.postMessage({ jsSource, testCases });
    });
};

// ============================================================================
// MAIN COMPONENT: STUDENT LOCKED IN LAB TAB
// ============================================================================

const COMPANIES = [
    'All Companies',
    'Accenture',
    'TCS NQT',
    'Infosys',
    'Wipro',
    'Cognizant',
    'Capgemini',
    'Zoho',
    'Tech Mahindra'
];

const getCompanyBadgeStyle = (company) => {
    switch (company) {
        case 'Accenture':
            return 'bg-purple-50 text-purple-700 border-purple-200';
        case 'TCS NQT':
            return 'bg-blue-50 text-blue-700 border-blue-200';
        case 'Infosys':
            return 'bg-indigo-50 text-indigo-700 border-indigo-200';
        case 'Wipro':
            return 'bg-amber-50 text-amber-700 border-amber-200';
        case 'Cognizant':
            return 'bg-cyan-50 text-cyan-700 border-cyan-200';
        case 'Capgemini':
            return 'bg-sky-50 text-sky-700 border-sky-200';
        case 'Zoho':
            return 'bg-emerald-50 text-emerald-700 border-emerald-200';
        case 'Tech Mahindra':
            return 'bg-rose-50 text-rose-700 border-rose-200';
        default:
            return 'bg-slate-100 text-slate-700 border-slate-200';
    }
};

const StudentLockedInLabTab = ({ student }) => {
    const storageKey = `eth_locked_in_solved_${student?.usn || 'guest'}`;
    const [solvedIds, setSolvedIds] = useState(() => {
        try {
            const raw = localStorage.getItem(storageKey);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    });

    const [activeView, setActiveView] = useState('list'); // 'list' | 'solve'
    const [selectedCompany, setSelectedCompany] = useState('All Companies');
    const [selectedDifficulty, setSelectedDifficulty] = useState('All');
    const [selectedTopic, setSelectedTopic] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeProblemId, setActiveProblemId] = useState(PROBLEMS[0].id);
    const [selectedLang, setSelectedLang] = useState('cpp');
    const [code, setCode] = useState(PROBLEMS[0].starter.cpp);
    const [showHint, setShowHint] = useState(false);
    const [running, setRunning] = useState(false);
    const [runOutput, setRunOutput] = useState(null);
    const [activeSampleIdx, setActiveSampleIdx] = useState(0);

    const activeProblem = useMemo(
        () => PROBLEMS.find((p) => p.id === activeProblemId) || PROBLEMS[0],
        [activeProblemId]
    );

    const topics = useMemo(() => {
        const set = new Set(PROBLEMS.map((p) => p.topic));
        return ['All', ...Array.from(set)];
    }, []);

    const filteredProblems = useMemo(() => {
        return PROBLEMS.filter((p) => {
            if (selectedCompany !== 'All Companies' && p.company !== selectedCompany) return false;
            if (selectedDifficulty !== 'All' && p.difficulty !== selectedDifficulty) return false;
            if (selectedTopic !== 'All' && p.topic !== selectedTopic) return false;
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                return (
                    p.title.toLowerCase().includes(q) ||
                    (p.company && p.company.toLowerCase().includes(q)) ||
                    (p.context && p.context.toLowerCase().includes(q)) ||
                    p.topic.toLowerCase().includes(q)
                );
            }
            return true;
        });
    }, [selectedCompany, selectedDifficulty, selectedTopic, searchQuery]);

    // Sync starter code when active problem or selected language changes
    useEffect(() => {
        setCode(activeProblem.starter[selectedLang] || '');
        setRunOutput(null);
        setShowHint(false);
        setActiveSampleIdx(0);
    }, [activeProblem, selectedLang]);

    const markProblemSolved = useCallback((probId) => {
        setSolvedIds((prev) => {
            if (prev.includes(probId)) return prev;
            const updated = [...prev, probId];
            try {
                localStorage.setItem(storageKey, JSON.stringify(updated));
            } catch {
                // ignore storage quota error
            }
            return updated;
        });
    }, [storageKey]);

    const handleRunSample = async () => {
        setRunning(true);
        const sampleCases = activeProblem.testCases.filter((tc) => !tc.isHidden);
        const res = await executeInBrowserWorker(selectedLang, code, sampleCases);
        const allPassed = res.status === 'OK' && res.results.length > 0 && res.results.every((r) => r.pass);
        setRunOutput({
            mode: 'run',
            verdict: res.status === 'OK' ? (allPassed ? 'Sample Cases Passed' : 'Wrong Answer') : res.status,
            error: res.error || null,
            results: res.results || []
        });
        setRunning(false);
    };

    const handleSubmitAll = async () => {
        setRunning(true);
        const res = await executeInBrowserWorker(selectedLang, code, activeProblem.testCases);
        const allPassed = res.status === 'OK' && res.results.length > 0 && res.results.every((r) => r.pass);
        if (allPassed) {
            markProblemSolved(activeProblem.id);
        }
        setRunOutput({
            mode: 'submit',
            verdict: res.status === 'OK' ? (allPassed ? 'Accepted' : 'Wrong Answer') : res.status,
            error: res.error || null,
            results: res.results || []
        });
        setRunning(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = e.target.selectionStart;
            const end = e.target.selectionEnd;
            const next = code.substring(0, start) + '    ' + code.substring(end);
            setCode(next);
            setTimeout(() => {
                e.target.selectionStart = e.target.selectionEnd = start + 4;
            }, 0);
        }
    };

    const easySolved = PROBLEMS.filter((p) => p.difficulty === 'Easy' && solvedIds.includes(p.id)).length;
    const medSolved = PROBLEMS.filter((p) => p.difficulty === 'Medium' && solvedIds.includes(p.id)).length;
    const hardSolved = PROBLEMS.filter((p) => p.difficulty === 'Hard' && solvedIds.includes(p.id)).length;

    const getDiffBadge = (diff) => {
        if (diff === 'Easy') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
        if (diff === 'Medium') return 'bg-amber-50 text-amber-700 border-amber-200';
        return 'bg-rose-50 text-rose-700 border-rose-200';
    };

    // =========================================================================
    // VIEW 1: PROBLEM CATALOG & SERVICE COMPANY CHALLENGES LIST
    // =========================================================================
    if (activeView === 'list') {
        return (
            <div className="space-y-6 font-sans">
                {/* Hub Banner Card with Sarcastic Placement Cartoon */}
                <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    <div className="space-y-2.5 max-w-2xl">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-50 text-[#5899B5] border border-blue-100 flex items-center gap-1.5">
                                <Briefcase size={13} /> Service Company Coding Arena
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Solved: {solvedIds.length} / {PROBLEMS.length} Challenges
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
                                100% In-Browser Compiler (₹0 Cost)
                            </span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-semibold text-slate-800">
                            Crack Mass Recruiter Coding Rounds.
                        </h2>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Authentic technical round coding questions from <strong>TCS NQT</strong>, <strong>Accenture</strong>, <strong>Infosys</strong>, <strong>Wipro</strong>, <strong>Cognizant</strong>, <strong>Capgemini</strong> & <strong>Zoho</strong>. Write code in C, C++, Java, Python or JS and test against real sample & hidden edge cases.
                        </p>
                        <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs font-semibold">
                            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">Easy: {easySolved}/12</span>
                            <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">Medium: {medSolved}/12</span>
                            <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">Hard: {hardSolved}/12</span>
                        </div>
                    </div>
                    <LockedInCartoonSvg variant="hub" className="w-64 h-32 shrink-0 hidden sm:block" />
                </div>

                {/* Company Filter Tabs */}
                <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-5 space-y-4">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                            <Building2 size={14} className="text-[#5899B5]" /> Filter by Company
                        </span>
                        <span className="text-xs font-semibold text-slate-500">
                            Showing {filteredProblems.length} of {PROBLEMS.length} challenges
                        </span>
                    </div>

                    {/* Company Pills */}
                    <div className="flex flex-wrap items-center gap-2">
                        {COMPANIES.map((comp) => {
                            const isAll = comp === 'All Companies';
                            const compTotal = isAll ? PROBLEMS.length : PROBLEMS.filter((p) => p.company === comp).length;
                            const compSolved = isAll ? solvedIds.length : PROBLEMS.filter((p) => p.company === comp && solvedIds.includes(p.id)).length;
                            const isSelected = selectedCompany === comp;
                            return (
                                <button
                                    key={comp}
                                    type="button"
                                    onClick={() => setSelectedCompany(comp)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition flex items-center gap-1.5 border ${
                                        isSelected
                                            ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                                            : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                                    }`}
                                >
                                    <span>{comp}</span>
                                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                                    }`}>
                                        {compSolved}/{compTotal}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Difficulty and Search Row */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2 border-t border-slate-100 items-center">
                        <div className="md:col-span-5 relative">
                            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by question title, company, topic..."
                                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-[#5899B5]"
                            />
                        </div>

                        <div className="md:col-span-4 flex items-center gap-1.5">
                            {['All', 'Easy', 'Medium', 'Hard'].map((d) => (
                                <button
                                    key={d}
                                    type="button"
                                    onClick={() => setSelectedDifficulty(d)}
                                    className={`flex-1 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition text-center border ${
                                        selectedDifficulty === d
                                            ? 'bg-[#5899B5] text-white border-[#5899B5]'
                                            : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                                    }`}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>

                        <div className="md:col-span-3">
                            <select
                                value={selectedTopic}
                                onChange={(e) => setSelectedTopic(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 outline-none cursor-pointer"
                            >
                                {topics.map((t) => (
                                    <option key={t} value={t}>
                                        Topic: {t}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Problem Cards List / Deck */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProblems.map((p) => {
                        const isSolved = solvedIds.includes(p.id);
                        return (
                            <div
                                key={p.id}
                                className="bg-white border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all rounded-3xl p-5 flex flex-col justify-between gap-4 group"
                            >
                                <div className="space-y-3">
                                    {/* Company Badge & Difficulty */}
                                    <div className="flex items-center justify-between gap-2">
                                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border flex items-center gap-1 ${getCompanyBadgeStyle(p.company)}`}>
                                            <Briefcase size={11} /> {p.companyBadge || p.company}
                                        </span>
                                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getDiffBadge(p.difficulty)}`}>
                                            {p.difficulty}
                                        </span>
                                    </div>

                                    {/* Problem Title */}
                                    <div>
                                        <h3 className="text-base font-bold text-slate-800 group-hover:text-[#5899B5] transition">
                                            #{p.number}. {p.title}
                                        </h3>
                                        <p className="text-xs text-slate-500 font-medium italic mt-1 line-clamp-1">
                                            {p.context || `Asked in ${p.company} On-Campus Drive`}
                                        </p>
                                    </div>

                                    {/* Topic and Constraint Pill */}
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600">
                                            {p.topic}
                                        </span>
                                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-50 text-slate-500 border border-slate-100">
                                            {p.testCases.length} Test Cases
                                        </span>
                                    </div>

                                    {/* Short Description */}
                                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                                        {p.description}
                                    </p>
                                </div>

                                {/* Card Footer: Solved Status & Solve Challenge Button */}
                                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                                    {isSolved ? (
                                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                                            <CheckCircle2 size={13} /> Solved ✓
                                        </span>
                                    ) : (
                                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-50 text-slate-500 border border-slate-200 flex items-center gap-1">
                                            <Clock size={12} /> Unsolved
                                        </span>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setActiveProblemId(p.id);
                                            setActiveView('solve');
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-[#5899B5] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shadow-sm"
                                    >
                                        <span>{isSolved ? 'Solve Again' : 'Solve Challenge'}</span>
                                        <Flame size={13} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredProblems.length === 0 && (
                    <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center space-y-3">
                        <AlertTriangle size={32} className="mx-auto text-amber-500" />
                        <h4 className="text-base font-bold text-slate-800">No challenges found</h4>
                        <p className="text-xs text-slate-500">
                            Try resetting your company filter, search query, or difficulty level.
                        </p>
                        <button
                            type="button"
                            onClick={() => {
                                setSelectedCompany('All Companies');
                                setSelectedDifficulty('All');
                                setSelectedTopic('All');
                                setSearchQuery('');
                            }}
                            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                        >
                            Reset All Filters
                        </button>
                    </div>
                )}
            </div>
        );
    }

    // =========================================================================
    // VIEW 2: DEDICATED SEPARATE PROBLEM SOLVER PAGE
    // =========================================================================
    return (
        <div className="space-y-5 font-sans">
            {/* Top Navigation & Header Bar with Back Button */}
            <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-wrap">
                    <button
                        type="button"
                        onClick={() => {
                            setActiveView('list');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition"
                    >
                        <ArrowLeft size={16} className="text-[#5899B5]" /> Back to Problem Arena
                    </button>
                    <div className="h-5 w-px bg-slate-200 hidden sm:block" />
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${getCompanyBadgeStyle(activeProblem.company)}`}>
                        <Briefcase size={12} /> {activeProblem.companyBadge || activeProblem.company}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getDiffBadge(activeProblem.difficulty)}`}>
                        {activeProblem.difficulty}
                    </span>
                    {solvedIds.includes(activeProblem.id) && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 size={13} /> Solved ✓
                        </span>
                    )}
                </div>

                {/* Quick Switch Dropdown */}
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <select
                        value={activeProblem.id}
                        onChange={(e) => setActiveProblemId(e.target.value)}
                        className="flex-1 md:flex-initial px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 outline-none cursor-pointer"
                    >
                        {PROBLEMS.map((p) => (
                            <option key={p.id} value={p.id}>
                                {solvedIds.includes(p.id) ? '✓ ' : ''}#{p.number}. {p.title} ({p.company})
                            </option>
                        ))}
                    </select>
                    <button
                        type="button"
                        onClick={() => {
                            const idx = PROBLEMS.findIndex((p) => p.id === activeProblem.id);
                            if (idx > 0) setActiveProblemId(PROBLEMS[idx - 1].id);
                        }}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                        title="Previous Challenge"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            const idx = PROBLEMS.findIndex((p) => p.id === activeProblem.id);
                            if (idx < PROBLEMS.length - 1) setActiveProblemId(PROBLEMS[idx + 1].id);
                        }}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                        title="Next Challenge"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {/* Split Workspace Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                {/* LEFT COLUMN (5 cols): Problem Description, Story, Constraints & Sample Cases */}
                <div className="xl:col-span-5 space-y-5">
                    {/* Problem Statement Card */}
                    <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 space-y-5">
                        {/* Company Recruitment Context Pill */}
                        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-2.5 text-xs text-slate-700 font-semibold">
                            <Briefcase size={16} className="text-[#5899B5] shrink-0" />
                            <span>{activeProblem.context || `Actual technical interview challenge asked in ${activeProblem.company} recruitment drive.`}</span>
                        </div>

                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                                #{activeProblem.number}. {activeProblem.title}
                            </h2>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
                                    Topic: {activeProblem.topic}
                                </span>
                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 font-mono">
                                    fn: {activeProblem.fnName}(...)
                                </span>
                            </div>
                        </div>

                        {/* Story / Description */}
                        <div className="text-sm text-slate-700 leading-relaxed space-y-2">
                            <p>{activeProblem.description}</p>
                        </div>

                        {/* Constraints */}
                        {activeProblem.constraints && activeProblem.constraints.length > 0 && (
                            <div className="space-y-2 pt-2 border-t border-slate-100">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                                    Constraints
                                </span>
                                <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600 font-mono">
                                    {activeProblem.constraints.map((c, i) => (
                                        <li key={i}>{c}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Sample Cases */}
                        <div className="space-y-3 pt-2 border-t border-slate-100">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                                Sample Test Cases
                            </span>
                            {activeProblem.testCases.filter((tc) => !tc.isHidden).map((tc, idx) => (
                                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs space-y-1.5">
                                    <div className="font-bold text-slate-500">Example {idx + 1}:</div>
                                    <div>
                                        <span className="text-slate-400">Input: </span>
                                        <span className="text-slate-800 font-semibold">
                                            {activeProblem.params.map((p, pi) => `${p.name} = ${JSON.stringify(tc.args[pi])}`).join(', ')}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400">Output: </span>
                                        <span className="text-emerald-700 font-bold">{JSON.stringify(tc.expected)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Recruiter's Hint */}
                        <div className="pt-2 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => setShowHint(!showHint)}
                                className="w-full flex items-center justify-between p-3 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs font-bold cursor-pointer transition hover:bg-amber-100/70"
                            >
                                <span className="flex items-center gap-2">
                                    <Lightbulb size={15} className="text-amber-600" /> Need Recruiter Hint?
                                </span>
                                <span>{showHint ? 'Hide Hint' : 'Reveal Hint'}</span>
                            </button>
                            {showHint && (
                                <div className="mt-2.5 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed font-medium">
                                    💡 <strong>Placement Tip:</strong> {activeProblem.hint}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN (7 cols): Multi-Language Editor & Compiler Console */}
                <div className="xl:col-span-7 space-y-5">
                    {/* Code Editor Container */}
                    <div className="bg-[#1E293B] rounded-3xl shadow-sm border border-slate-800 overflow-hidden">
                        {/* Editor Header Bar */}
                        <div className="px-5 py-3.5 bg-[#0F172A] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
                            {/* Language Pills */}
                            <div className="flex items-center gap-1.5 flex-wrap">
                                {LANGUAGES.map((lang) => (
                                    <button
                                        key={lang.id}
                                        type="button"
                                        onClick={() => setSelectedLang(lang.id)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition ${
                                            selectedLang === lang.id
                                                ? 'bg-[#5899B5] text-white shadow-sm'
                                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                        }`}
                                    >
                                        {lang.label}
                                    </button>
                                ))}
                            </div>

                            {/* Editor Actions */}
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setCode(activeProblem.starter[selectedLang] || '')}
                                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                                    title="Reset Code Template"
                                >
                                    <RotateCcw size={15} />
                                </button>
                                <button
                                    type="button"
                                    onClick={handleRunSample}
                                    disabled={running}
                                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition"
                                >
                                    <Play size={13} className="text-emerald-400" /> Run Samples
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmitAll}
                                    disabled={running}
                                    className="px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition shadow-sm"
                                >
                                    <Send size={13} /> {running ? 'Compiling...' : 'Submit Code'}
                                </button>
                            </div>
                        </div>

                        {/* Editor Textarea with Line Numbers */}
                        <div className="relative flex min-h-[360px] max-h-[520px]">
                            <div className="select-none py-4 px-3 text-right bg-[#0F172A]/40 text-slate-600 font-mono text-xs w-10 border-r border-slate-800">
                                {code.split('\n').map((_, i) => (
                                    <div key={i}>{i + 1}</div>
                                ))}
                            </div>
                            <textarea
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                onKeyDown={handleKeyDown}
                                spellCheck={false}
                                className="flex-1 p-4 bg-[#1E293B] text-emerald-300 font-mono text-xs sm:text-sm leading-relaxed outline-none resize-none overflow-auto"
                                style={{ tabSize: 4 }}
                            />
                        </div>

                        {/* Status Footer */}
                        <div className="px-5 py-2.5 bg-[#0F172A] border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                            <span>Language: {LANGUAGES.find((l) => l.id === selectedLang)?.label}</span>
                            <span>Engine: Client-Side Web Worker (0ms Network)</span>
                        </div>
                    </div>

                    {/* Execution Output & Test Cases Console */}
                    <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                <Terminal size={14} className="text-[#5899B5]" /> Test Case & Compiler Console
                            </span>
                            {runOutput && (
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        runOutput.verdict === 'Accepted' || runOutput.verdict === 'Sample Cases Passed'
                                            ? 'bg-emerald-100 text-emerald-800'
                                            : 'bg-rose-100 text-rose-800'
                                    }`}
                                >
                                    {runOutput.verdict}
                                </span>
                            )}
                        </div>

                        {!runOutput ? (
                            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-center text-xs sm:text-sm text-slate-500">
                                Click <strong>Run Samples</strong> to test your logic or <strong>Submit Code</strong> to run against all sample + hidden test cases.
                            </div>
                        ) : runOutput.error ? (
                            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 font-mono text-xs space-y-1.5">
                                <div className="font-bold flex items-center gap-1.5 text-rose-700">
                                    <AlertTriangle size={15} /> {runOutput.verdict}
                                </div>
                                <pre className="whitespace-pre-wrap m-0">{runOutput.error}</pre>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {runOutput.verdict === 'Accepted' && (
                                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between gap-3 flex-wrap">
                                        <div className="flex items-center gap-2 text-sm font-bold text-emerald-800">
                                            <CheckCircle2 size={18} className="text-emerald-600" />
                                            Accepted! All {runOutput.results.length} Test Cases Passed 🔒⚡
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setActiveView('list');
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                                        >
                                            Return to Problem Arena →
                                        </button>
                                    </div>
                                )}

                                {/* Case Tabs */}
                                <div className="flex flex-wrap gap-2">
                                    {runOutput.results.map((r, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => setActiveSampleIdx(idx)}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 cursor-pointer transition ${
                                                activeSampleIdx === idx
                                                    ? 'bg-slate-900 text-white border-slate-900'
                                                    : r.pass
                                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                                    : 'bg-rose-50 text-rose-800 border-rose-200'
                                            }`}
                                        >
                                            {r.pass ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                                            {r.isHidden ? `Hidden Case #${r.index}` : `Case #${r.index}`}
                                        </button>
                                    ))}
                                </div>

                                {/* Selected Case Detail */}
                                {runOutput.results[activeSampleIdx] && (() => {
                                    const cur = runOutput.results[activeSampleIdx];
                                    return (
                                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs space-y-2">
                                            <div className="flex items-center justify-between text-slate-500">
                                                <span>
                                                    Status:{' '}
                                                    <strong className={cur.pass ? 'text-emerald-600' : 'text-rose-600'}>
                                                        {cur.pass ? 'PASSED ✓' : 'FAILED ✗'}
                                                    </strong>
                                                </span>
                                                <span>Runtime: {cur.timeMs} ms</span>
                                            </div>
                                            <div>
                                                <span className="text-slate-400 block">Input:</span>
                                                <span className="text-slate-800 font-semibold">
                                                    {cur.isHidden
                                                        ? '[Hidden Edge-Case Input]'
                                                        : activeProblem.params
                                                              .map((p, i) => `${p.name} = ${JSON.stringify(cur.args[i])}`)
                                                              .join(', ')}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                                                    <span className="text-slate-400 block">Your Output:</span>
                                                    <span className={`font-bold ${cur.pass ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                        {JSON.stringify(cur.actual)}
                                                    </span>
                                                </div>
                                                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                                                    <span className="text-slate-400 block">Expected Output:</span>
                                                    <span className="font-bold text-slate-800">
                                                        {JSON.stringify(cur.expected)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentLockedInLabTab;
