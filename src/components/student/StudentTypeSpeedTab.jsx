import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
    Keyboard, RotateCcw, Shuffle, ChevronLeft, ChevronRight,
    Zap, Target, Clock, CheckCircle2, Sparkles, Terminal, Code2
} from 'lucide-react';

// ============================================================================
// STATIC CARTOON SVG ILLUSTRATIONS FOR TYPE SPEED TAB
// ============================================================================
export const TypeSpeedCartoonSvg = ({ variant = 'header', className = 'w-60 h-32' }) => {
    if (variant === 'complete') {
        return (
            <svg viewBox="0 0 220 120" className={className} aria-hidden="true">
                <ellipse cx="110" cy="108" rx="86" ry="7" fill="#E2E8F0" />
                {/* Cartoon Mechanical Keycap Trophy */}
                <rect x="70" y="34" width="80" height="64" rx="14" fill="#FACC15" stroke="#1E293B" strokeWidth="2.2" />
                <rect x="80" y="42" width="60" height="44" rx="10" fill="#FEF08A" stroke="#1E293B" strokeWidth="1.8" />
                <text x="110" y="70" textAnchor="middle" fontSize="15" fontWeight="900" fill="#1E293B" fontFamily="monospace">GG WP</text>
                {/* Sparkles */}
                <path d="M42 36 l3 6 6 1-4.5 4 1 6-5.5-3-5.5 3 1-6-4.5-4 6-1z" fill="#34D399" stroke="#1E293B" strokeWidth="1.5" />
                <path d="M180 36 l3 6 6 1-4.5 4 1 6-5.5-3-5.5 3 1-6-4.5-4 6-1z" fill="#38BDF8" stroke="#1E293B" strokeWidth="1.5" />
            </svg>
        );
    }

    // Main Hub Header SVG: Cartoon Mechanical Keyboard, Snail vs Lightning & Sarcastic "Slow Hands" Speech Bubble
    return (
        <svg viewBox="0 0 265 130" className={className} aria-hidden="true">
            <ellipse cx="132" cy="118" rx="112" ry="8" fill="#E2E8F0" />

            {/* Cartoon Sarcastic Speech Bubble on Top */}
            <path
                d="M26 8 H194 A10 10 0 0 1 204 18 V36 A10 10 0 0 1 194 46 H92 L82 55 L84 46 H26 A10 10 0 0 1 16 36 V18 A10 10 0 0 1 26 8 Z"
                fill="#FEF3C7"
                stroke="#1E293B"
                strokeWidth="2.2"
                strokeLinejoin="round"
            />
            <text x="110" y="24" textAnchor="middle" fontSize="8.5" fontWeight="900" fill="#B45309" letterSpacing="0.4">
                GRANDMA TYPES FASTER THAN
            </text>
            <text x="110" y="37" textAnchor="middle" fontSize="9.5" fontWeight="900" fill="#92400E" letterSpacing="0.5">
                THOSE SLOW HANDS BRO 🐌
            </text>

            {/* Cartoon RGB Mechanical Keyboard */}
            <rect x="22" y="58" width="164" height="54" rx="12" fill="#1E293B" stroke="#0F172A" strokeWidth="2.2" />
            <rect x="28" y="63" width="152" height="44" rx="8" fill="#F8FAFC" stroke="#1E293B" strokeWidth="1.8" />

            {/* Row 1 Keycaps */}
            <rect x="34" y="68" width="20" height="14" rx="3" fill="#F43F5E" stroke="#1E293B" strokeWidth="1.6" />
            <text x="44" y="78" textAnchor="middle" fontSize="7" fontWeight="900" fill="#FFFFFF">ESC</text>

            <rect x="58" y="68" width="18" height="14" rx="3" fill="#38BDF8" stroke="#1E293B" strokeWidth="1.6" />
            <text x="67" y="78" textAnchor="middle" fontSize="8" fontWeight="900" fill="#1E293B">{'{'}</text>

            <rect x="80" y="68" width="18" height="14" rx="3" fill="#38BDF8" stroke="#1E293B" strokeWidth="1.6" />
            <text x="89" y="78" textAnchor="middle" fontSize="8" fontWeight="900" fill="#1E293B">{'}'}</text>

            <rect x="102" y="68" width="18" height="14" rx="3" fill="#FACC15" stroke="#1E293B" strokeWidth="1.6" />
            <text x="111" y="78" textAnchor="middle" fontSize="8" fontWeight="900" fill="#1E293B">;</text>

            <rect x="124" y="68" width="22" height="14" rx="3" fill="#A78BFA" stroke="#1E293B" strokeWidth="1.6" />
            <text x="135" y="78" textAnchor="middle" fontSize="7" fontWeight="900" fill="#FFFFFF">()</text>

            <rect x="150" y="68" width="24" height="14" rx="3" fill="#34D399" stroke="#1E293B" strokeWidth="1.6" />
            <text x="162" y="78" textAnchor="middle" fontSize="7" fontWeight="900" fill="#1E293B">===</text>

            {/* Row 2 Keycaps + Spacebar */}
            <rect x="34" y="86" width="26" height="14" rx="3" fill="#CBD5E1" stroke="#1E293B" strokeWidth="1.6" />
            <text x="47" y="96" textAnchor="middle" fontSize="7" fontWeight="900" fill="#1E293B">TAB</text>

            <rect x="64" y="86" width="76" height="14" rx="4" fill="#FDE047" stroke="#1E293B" strokeWidth="1.6" />
            <text x="102" y="96" textAnchor="middle" fontSize="7.5" fontWeight="900" fill="#1E293B" fontFamily="monospace">TYPE FASTER</text>

            <rect x="144" y="86" width="30" height="14" rx="3" fill="#FB923C" stroke="#1E293B" strokeWidth="1.6" />
            <text x="159" y="96" textAnchor="middle" fontSize="7" fontWeight="900" fill="#FFFFFF">RET</text>

            {/* Cute Cartoon Snail on Right Side Wearing Racing Helmet */}
            <path d="M196 106 H252" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" />
            {/* Snail Body */}
            <path d="M198 105 C202 96, 238 96, 246 105 Z" fill="#86EFAC" stroke="#1E293B" strokeWidth="2" />
            {/* Snail Shell */}
            <circle cx="218" cy="86" r="16" fill="#FB923C" stroke="#1E293B" strokeWidth="2.2" />
            <path d="M218 86 m-8 0 a8 8 0 1 0 16 0 a5 5 0 1 0 -10 0" stroke="#1E293B" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            {/* Snail Eyes */}
            <line x1="238" y1="98" x2="242" y2="86" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
            <line x1="243" y1="99" x2="249" y2="88" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
            <circle cx="242" cy="85" r="2.5" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.5" />
            <circle cx="249" cy="87" r="2.5" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.5" />
            {/* Speed WPM Tag Above Snail */}
            <rect x="205" y="48" width="48" height="18" rx="6" fill="#FEE2E2" stroke="#1E293B" strokeWidth="1.8" />
            <text x="229" y="60" textAnchor="middle" fontSize="8" fontWeight="900" fill="#DC2626">12 WPM</text>
        </svg>
    );
};

// ============================================================================
// 300 CODE SNIPPETS BANK: 5 LANGUAGES × 3 LEVELS (EASY, MEDIUM, HARD) × 20 EACH
// ============================================================================
const LANGUAGES = [
    { id: 'c', label: 'C', ext: '.c', badge: 'bg-slate-100 text-slate-800 border-slate-300' },
    { id: 'cpp', label: 'C++', ext: '.cpp', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
    { id: 'java', label: 'Java', ext: '.java', badge: 'bg-orange-50 text-orange-700 border-orange-200' },
    { id: 'python', label: 'Python', ext: '.py', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { id: 'javascript', label: 'JavaScript', ext: '.js', badge: 'bg-amber-50 text-amber-800 border-amber-200' }
];

const LEVELS = [
    { id: 'easy', label: 'Easy', desc: 'One-liners & basic syntax warmups', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { id: 'medium', label: 'Medium', desc: 'Loops, functions & array logic', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { id: 'hard', label: 'Hard', desc: 'DSA patterns, pointers & recursion', color: 'bg-rose-50 text-rose-700 border-rose-200' }
];

const SNIPPETS_DB = {
    // ========================================================================
    // 1. C LANGUAGE (20 Easy, 20 Medium, 20 Hard)
    // ========================================================================
    c: {
        easy: [
            { title: 'Hello World Print', code: 'printf("Hello, World!\\n");' },
            { title: 'Integer Declaration', code: 'int count = 42, sum = 0;' },
            { title: 'Read Integer Input', code: 'int n;\nscanf("%d", &n);' },
            { title: 'Even Number Check', code: 'if (num % 2 == 0) {\n    printf("Even");\n}' },
            { title: 'Ternary Maximum', code: 'int max = (a > b) ? a : b;' },
            { title: 'Basic For Loop', code: 'for (int i = 0; i < 10; i++) {\n    sum += i;\n}' },
            { title: 'Swap Using Temp', code: 'int temp = a;\na = b;\nb = temp;' },
            { title: 'Array Initialization', code: 'int arr[5] = {10, 20, 30, 40, 50};' },
            { title: 'While Countdown', code: 'while (n > 0) {\n    printf("%d ", n--);\n}' },
            { title: 'Character ASCII Print', code: 'char ch = \'A\';\nprintf("ASCII: %d", ch);' },
            { title: 'Constant Macro', code: '#define MAX_SIZE 100\nint buffer[MAX_SIZE];' },
            { title: 'Simple Add Function', code: 'int add(int x, int y) {\n    return x + y;\n}' },
            { title: 'Sizeof Operator', code: 'size_t len = sizeof(arr) / sizeof(arr[0]);' },
            { title: 'Null Pointer Check', code: 'int *ptr = NULL;\nif (ptr == NULL) return -1;' },
            { title: 'Bitwise AND Check', code: 'int isOdd = (n & 1);' },
            { title: 'Left Shift Multiply', code: 'int doubled = val << 1;' },
            { title: 'String Copy Call', code: 'char dest[32];\nstrcpy(dest, "Placement");' },
            { title: 'Float Average', code: 'float avg = (float)total / count;' },
            { title: 'Do-While Prompt', code: 'do {\n    steps++;\n} while (steps < limit);' },
            { title: 'Return Exit Success', code: 'int main(void) {\n    return 0;\n}' }
        ],
        medium: [
            { title: 'Iterative Factorial', code: 'long fact = 1;\nfor (int i = 2; i <= n; i++) {\n    fact *= i;\n}' },
            { title: 'Reverse an Integer', code: 'int rev = 0;\nwhile (n != 0) {\n    rev = rev * 10 + (n % 10);\n    n /= 10;\n}' },
            { title: 'Linear Search Loop', code: 'int findKey(int arr[], int n, int key) {\n    for (int i = 0; i < n; i++) {\n        if (arr[i] == key) return i;\n    }\n    return -1;\n}' },
            { title: 'Swap With Pointers', code: 'void swap(int *a, int *b) {\n    int t = *a;\n    *a = *b;\n    *b = t;\n}' },
            { title: 'Count Set Bits', code: 'int countBits(unsigned int n) {\n    int cnt = 0;\n    while (n) {\n        cnt += n & 1;\n        n >>= 1;\n    }\n    return cnt;\n}' },
            { title: 'Custom String Length', code: 'int strLen(const char *s) {\n    int len = 0;\n    while (s[len] != \'\\0\') len++;\n    return len;\n}' },
            { title: 'Check Prime Number', code: 'int isPrime(int n) {\n    if (n < 2) return 0;\n    for (int i = 2; i * i <= n; i++) {\n        if (n % i == 0) return 0;\n    }\n    return 1;\n}' },
            { title: 'Dynamic Array Malloc', code: 'int *arr = (int *)malloc(n * sizeof(int));\nif (!arr) return NULL;' },
            { title: 'Find Array Maximum', code: 'int maxVal = arr[0];\nfor (int i = 1; i < n; i++) {\n    if (arr[i] > maxVal) maxVal = arr[i];\n}' },
            { title: 'GCD Euclidean Loop', code: 'int gcd(int a, int b) {\n    while (b != 0) {\n        int r = a % b;\n        a = b;\n        b = r;\n    }\n    return a;\n}' },
            { title: 'Struct Student Definition', code: 'struct Student {\n    int id;\n    char name[40];\n    float cgpa;\n};' },
            { title: 'Palindrome String Check', code: 'int l = 0, r = strlen(s) - 1;\nwhile (l < r) {\n    if (s[l++] != s[r--]) return 0;\n}' },
            { title: 'Matrix Diagonal Sum', code: 'int diag = 0;\nfor (int i = 0; i < n; i++) {\n    diag += mat[i][i];\n}' },
            { title: 'Fibonacci Iterative', code: 'int a = 0, b = 1;\nfor (int i = 2; i <= n; i++) {\n    int c = a + b;\n    a = b;\n    b = c;\n}' },
            { title: 'File Open Read Guard', code: 'FILE *fp = fopen("input.txt", "r");\nif (fp == NULL) {\n    perror("File error");\n}' },
            { title: 'Power of Two Check', code: 'int isPowerOfTwo(int n) {\n    return (n > 0) && ((n & (n - 1)) == 0);\n}' },
            { title: 'Reverse Array In-Place', code: 'for (int i = 0, j = n - 1; i < j; i++, j--) {\n    int tmp = a[i];\n    a[i] = a[j];\n    a[j] = tmp;\n}' },
            { title: 'Sum of Digits', code: 'int sumDigits(int n) {\n    int sum = 0;\n    while (n > 0) {\n        sum += n % 10;\n        n /= 10;\n    }\n    return sum;\n}' },
            { title: 'Count Vowels in String', code: 'int v = 0;\nfor (int i = 0; s[i]; i++) {\n    if (strchr("aeiouAEIOU", s[i])) v++;\n}' },
            { title: 'XOR Swap Without Temp', code: 'if (x != y) {\n    *x ^= *y;\n    *y ^= *x;\n    *x ^= *y;\n}' }
        ],
        hard: [
            { title: 'Binary Search Iterative', code: 'int binarySearch(int a[], int n, int target) {\n    int lo = 0, hi = n - 1;\n    while (lo <= hi) {\n        int mid = lo + (hi - lo) / 2;\n        if (a[mid] == target) return mid;\n        if (a[mid] < target) lo = mid + 1;\n        else hi = mid - 1;\n    }\n    return -1;\n}' },
            { title: 'Reverse Singly Linked List', code: 'struct Node* reverseList(struct Node* head) {\n    struct Node *prev = NULL, *curr = head;\n    while (curr != NULL) {\n        struct Node *next = curr->next;\n        curr->next = prev;\n        prev = curr;\n        curr = next;\n    }\n    return prev;\n}' },
            { title: 'Bubble Sort Optimized', code: 'void bubbleSort(int a[], int n) {\n    for (int i = 0; i < n - 1; i++) {\n        int swapped = 0;\n        for (int j = 0; j < n - i - 1; j++) {\n            if (a[j] > a[j + 1]) {\n                int t = a[j]; a[j] = a[j + 1]; a[j + 1] = t;\n                swapped = 1;\n            }\n        }\n        if (!swapped) break;\n    }\n}' },
            { title: 'Kadane Maximum Subarray', code: 'int maxSubArray(int a[], int n) {\n    int best = a[0], curr = a[0];\n    for (int i = 1; i < n; i++) {\n        curr = (a[i] > curr + a[i]) ? a[i] : curr + a[i];\n        if (curr > best) best = curr;\n    }\n    return best;\n}' },
            { title: 'Floyd Cycle Detection', code: 'int hasCycle(struct Node *head) {\n    struct Node *slow = head, *fast = head;\n    while (fast && fast->next) {\n        slow = slow->next;\n        fast = fast->next->next;\n        if (slow == fast) return 1;\n    }\n    return 0;\n}' },
            { title: 'QuickSort Partition', code: 'int partition(int a[], int low, int high) {\n    int pivot = a[high], i = low - 1;\n    for (int j = low; j < high; j++) {\n        if (a[j] <= pivot) {\n            i++;\n            int t = a[i]; a[i] = a[j]; a[j] = t;\n        }\n    }\n    int t = a[i + 1]; a[i + 1] = a[high]; a[high] = t;\n    return i + 1;\n}' },
            { title: 'Custom Strcmp Implementation', code: 'int myStrcmp(const char *s1, const char *s2) {\n    while (*s1 && (*s1 == *s2)) {\n        s1++;\n        s2++;\n    }\n    return *(const unsigned char*)s1 - *(const unsigned char*)s2;\n}' },
            { title: '2D Matrix Dynamic Allocation', code: 'int **mat = (int **)malloc(rows * sizeof(int *));\nfor (int i = 0; i < rows; i++) {\n    mat[i] = (int *)calloc(cols, sizeof(int));\n}' },
            { title: 'Insertion Sort Algorithm', code: 'for (int i = 1; i < n; i++) {\n    int key = a[i], j = i - 1;\n    while (j >= 0 && a[j] > key) {\n        a[j + 1] = a[j];\n        j--;\n    }\n    a[j + 1] = key;\n}' },
            { title: 'Fast Modular Exponentiation', code: 'long long modPow(long long base, long long exp, long long mod) {\n    long long res = 1;\n    base %= mod;\n    while (exp > 0) {\n        if (exp & 1) res = (res * base) % mod;\n        base = (base * base) % mod;\n        exp >>= 1;\n    }\n    return res;\n}' },
            { title: 'Linked List Node Insertion', code: 'struct Node* pushFront(struct Node* head, int val) {\n    struct Node* node = malloc(sizeof(struct Node));\n    node->data = val;\n    node->next = head;\n    return node;\n}' },
            { title: 'Merge Two Sorted Arrays', code: 'while (i < n1 && j < n2) {\n    if (L[i] <= R[j]) out[k++] = L[i++];\n    else out[k++] = R[j++];\n}\nwhile (i < n1) out[k++] = L[i++];\nwhile (j < n2) out[k++] = R[j++];' },
            { title: 'Brian Kernighan Bit Count', code: 'int countSetBits(int n) {\n    int count = 0;\n    while (n > 0) {\n        n &= (n - 1);\n        count++;\n    }\n    return count;\n}' },
            { title: 'Binary Tree Height', code: 'int treeHeight(struct TreeNode* root) {\n    if (root == NULL) return 0;\n    int l = treeHeight(root->left);\n    int r = treeHeight(root->right);\n    return 1 + (l > r ? l : r);\n}' },
            { title: 'Function Pointer Dispatch', code: 'typedef int (*Operation)(int, int);\nint execute(Operation op, int x, int y) {\n    return op(x, y);\n}' },
            { title: 'Rotate Array Right By K', code: 'void reverse(int a[], int l, int r) {\n    while (l < r) {\n        int t = a[l]; a[l++] = a[r]; a[r--] = t;\n    }\n}' },
            { title: 'Find Missing Number XOR', code: 'int missingNumber(int a[], int n) {\n    int xorAll = 0;\n    for (int i = 0; i < n; i++) {\n        xorAll ^= (i + 1) ^ a[i];\n    }\n    return xorAll;\n}' },
            { title: 'Lower Bound Binary Search', code: 'int lowerBound(int a[], int n, int x) {\n    int l = 0, r = n;\n    while (l < r) {\n        int m = l + (r - l) / 2;\n        if (a[m] < x) l = m + 1;\n        else r = m;\n    }\n    return l;\n}' },
            { title: 'Circular Queue Enqueue', code: 'if ((rear + 1) % capacity == front) {\n    return -1;\n}\nrear = (rear + 1) % capacity;\nqueue[rear] = item;' },
            { title: 'Memory Copy Byte Loop', code: 'void *myMemcpy(void *dest, const void *src, size_t n) {\n    char *d = (char *)dest;\n    const char *s = (const char *)src;\n    while (n--) *d++ = *s++;\n    return dest;\n}' }
        ]
    },

    // ========================================================================
    // 2. C++ LANGUAGE (20 Easy, 20 Medium, 20 Hard)
    // ========================================================================
    cpp: {
        easy: [
            { title: 'Fast I/O Stream Setup', code: 'ios::sync_with_stdio(false);\ncin.tie(nullptr);' },
            { title: 'Vector Initialization', code: 'vector<int> nums = {4, 8, 15, 16, 23, 42};' },
            { title: 'Sort Vector Ascending', code: 'sort(nums.begin(), nums.end());' },
            { title: 'Range-Based For Loop', code: 'for (int x : nums) {\n    cout << x << " ";\n}' },
            { title: 'Pair Declaration', code: 'pair<int, string> student = {101, "Karthik"};' },
            { title: 'String Reverse STL', code: 'string s = "placement";\nreverse(s.begin(), s.end());' },
            { title: 'Max Element in Vector', code: 'int mx = *max_element(v.begin(), v.end());' },
            { title: 'Push Back & Pop Back', code: 'v.push_back(99);\nv.pop_back();' },
            { title: 'Unordered Set Insert', code: 'unordered_set<int> seen;\nseen.insert(key);' },
            { title: 'Auto Iterator Loop', code: 'for (auto it = mp.begin(); it != mp.end(); ++it) {\n    cout << it->first;\n}' },
            { title: 'Swap Two Variables', code: 'int a = 10, b = 20;\nswap(a, b);' },
            { title: 'Accumulate Vector Sum', code: 'int total = accumulate(v.begin(), v.end(), 0);' },
            { title: 'Queue Push and Front', code: 'queue<int> q;\nq.push(10);\nint first = q.front();' },
            { title: 'Stack LIFO Operations', code: 'stack<char> st;\nst.push(\'(\');\nst.pop();' },
            { title: 'String Substring Extract', code: 'string sub = text.substr(0, 5);' },
            { title: 'Lambda Comparator', code: 'auto cmp = [](int a, int b) { return a > b; };' },
            { title: '2D Vector Grid Init', code: 'vector<vector<int>> grid(n, vector<int>(m, 0));' },
            { title: 'Check Map Contains Key', code: 'if (freq.find(target) != freq.end()) {\n    return true;\n}' },
            { title: 'Min Priority Queue', code: 'priority_queue<int, vector<int>, greater<int>> pq;' },
            { title: 'String To Integer', code: 'int val = stoi("2048");\nstring str = to_string(val);' }
        ],
        medium: [
            { title: 'Frequency Map Counter', code: 'unordered_map<char, int> freq;\nfor (char c : s) {\n    freq[c]++;\n}' },
            { title: 'Two Sum Hash Map', code: 'unordered_map<int, int> mp;\nfor (int i = 0; i < nums.size(); i++) {\n    int need = target - nums[i];\n    if (mp.count(need)) return {mp[need], i};\n    mp[nums[i]] = i;\n}' },
            { title: 'Valid Parentheses Stack', code: 'stack<char> st;\nfor (char c : s) {\n    if (c == \'(\') st.push(\')\');\n    else if (st.empty() || st.top() != c) return false;\n    else st.pop();\n}' },
            { title: 'Prefix Sum Array', code: 'vector<int> pref(n + 1, 0);\nfor (int i = 0; i < n; i++) {\n    pref[i + 1] = pref[i] + arr[i];\n}' },
            { title: 'Custom Interval Sort', code: 'sort(intervals.begin(), intervals.end(), [](const auto& a, const auto& b) {\n    return a[0] < b[0];\n});' },
            { title: 'Remove Duplicates Sorted', code: 'int idx = 1;\nfor (int i = 1; i < nums.size(); i++) {\n    if (nums[i] != nums[i - 1]) {\n        nums[idx++] = nums[i];\n    }\n}' },
            { title: 'Binary Search STL Bound', code: 'auto it = lower_bound(v.begin(), v.end(), target);\nint pos = distance(v.begin(), it);' },
            { title: 'Kth Largest With Min-Heap', code: 'priority_queue<int, vector<int>, greater<int>> pq;\nfor (int x : nums) {\n    pq.push(x);\n    if (pq.size() > k) pq.pop();\n}\nreturn pq.top();' },
            { title: 'Two Pointer Container Water', code: 'int l = 0, r = h.size() - 1, best = 0;\nwhile (l < r) {\n    best = max(best, (r - l) * min(h[l], h[r]));\n    if (h[l] < h[r]) l++; else r--;\n}' },
            { title: 'Anagram Check Sorting', code: 'bool isAnagram(string s, string t) {\n    if (s.size() != t.size()) return false;\n    sort(s.begin(), s.end());\n    sort(t.begin(), t.end());\n    return s == t;\n}' },
            { title: 'Move Zeroes In-Place', code: 'int j = 0;\nfor (int i = 0; i < nums.size(); i++) {\n    if (nums[i] != 0) swap(nums[j++], nums[i]);\n}' },
            { title: 'Level Order BFS Queue', code: 'queue<TreeNode*> q;\nq.push(root);\nwhile (!q.empty()) {\n    TreeNode* cur = q.front(); q.pop();\n    if (cur->left) q.push(cur->left);\n    if (cur->right) q.push(cur->right);\n}' },
            { title: 'Next Permutation Call', code: 'bool hasNext = next_permutation(nums.begin(), nums.end());' },
            { title: 'Dutch National Flag 0-1-2', code: 'int lo = 0, mid = 0, hi = nums.size() - 1;\nwhile (mid <= hi) {\n    if (nums[mid] == 0) swap(nums[lo++], nums[mid++]);\n    else if (nums[mid] == 1) mid++;\n    else swap(nums[mid], nums[hi--]);\n}' },
            { title: 'Class Constructor Init List', code: 'class Node {\npublic:\n    int val;\n    Node* next;\n    Node(int v) : val(v), next(nullptr) {}\n};' },
            { title: 'Sliding Window Fixed Sum', code: 'int win = 0;\nfor (int i = 0; i < n; i++) {\n    win += a[i];\n    if (i >= k) win -= a[i - k];\n    if (i >= k - 1) ans = max(ans, win);\n}' },
            { title: 'Sieve of Eratosthenes', code: 'vector<bool> prime(n + 1, true);\nfor (int p = 2; p * p <= n; p++) {\n    if (prime[p]) {\n        for (int i = p * p; i <= n; i += p) prime[i] = false;\n    }\n}' },
            { title: 'Matrix Transpose Loop', code: 'for (int i = 0; i < n; i++) {\n    for (int j = i + 1; j < n; j++) {\n        swap(mat[i][j], mat[j][i]);\n    }\n}' },
            { title: 'String Stream Tokenizer', code: 'stringstream ss(sentence);\nstring word;\nwhile (ss >> word) {\n    tokens.push_back(word);\n}' },
            { title: 'Subarray Sum Equals K', code: 'unordered_map<int, int> pref = {{0, 1}};\nint sum = 0, count = 0;\nfor (int x : nums) {\n    sum += x;\n    count += pref[sum - k];\n    pref[sum]++;\n}' }
        ],
        hard: [
            { title: 'Dijkstra Shortest Path', code: 'priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> pq;\ndist[src] = 0;\npq.push({0, src});\nwhile (!pq.empty()) {\n    auto [d, u] = pq.top(); pq.pop();\n    if (d > dist[u]) continue;\n    for (auto [v, w] : adj[u]) {\n        if (dist[u] + w < dist[v]) {\n            dist[v] = dist[u] + w;\n            pq.push({dist[v], v});\n        }\n    }\n}' },
            { title: 'Disjoint Set Union (DSU)', code: 'struct DSU {\n    vector<int> parent, rank;\n    DSU(int n) : parent(n), rank(n, 0) {\n        iota(parent.begin(), parent.end(), 0);\n    }\n    int find(int x) {\n        return parent[x] == x ? x : parent[x] = find(parent[x]);\n    }\n};' },
            { title: '0/1 Knapsack DP Table', code: 'vector<int> dp(W + 1, 0);\nfor (int i = 0; i < n; i++) {\n    for (int w = W; w >= wt[i]; w--) {\n        dp[w] = max(dp[w], dp[w - wt[i]] + val[i]);\n    }\n}\nreturn dp[W];' },
            { title: 'Longest Increasing Subsequence', code: 'vector<int> tails;\nfor (int x : nums) {\n    auto it = lower_bound(tails.begin(), tails.end(), x);\n    if (it == tails.end()) tails.push_back(x);\n    else *it = x;\n}\nreturn tails.size();' },
            { title: 'Trie Node Insertion', code: 'void insert(const string& word) {\n    TrieNode* cur = root;\n    for (char c : word) {\n        int idx = c - \'a\';\n        if (!cur->children[idx]) cur->children[idx] = new TrieNode();\n        cur = cur->children[idx];\n    }\n    cur->isEnd = true;\n}' },
            { title: 'Topological Sort Kahn BFS', code: 'queue<int> q;\nfor (int i = 0; i < n; i++) if (indeg[i] == 0) q.push(i);\nwhile (!q.empty()) {\n    int u = q.front(); q.pop();\n    order.push_back(u);\n    for (int v : adj[u]) {\n        if (--indeg[v] == 0) q.push(v);\n    }\n}' },
            { title: 'Monotonic Stack Next Greater', code: 'vector<int> res(n, -1);\nstack<int> st;\nfor (int i = 0; i < n; i++) {\n    while (!st.empty() && nums[st.top()] < nums[i]) {\n        res[st.top()] = nums[i];\n        st.pop();\n    }\n    st.push(i);\n}' },
            { title: 'Lowest Common Ancestor Tree', code: 'TreeNode* lca(TreeNode* root, TreeNode* p, TreeNode* q) {\n    if (!root || root == p || root == q) return root;\n    TreeNode* left = lca(root->left, p, q);\n    TreeNode* right = lca(root->right, p, q);\n    return (left && right) ? root : (left ? left : right);\n}' },
            { title: 'Segment Tree Point Update', code: 'void update(int node, int l, int r, int idx, int val) {\n    if (l == r) { tree[node] = val; return; }\n    int mid = (l + r) / 2;\n    if (idx <= mid) update(2 * node, l, mid, idx, val);\n    else update(2 * node + 1, mid + 1, r, idx, val);\n    tree[node] = tree[2 * node] + tree[2 * node + 1];\n}' },
            { title: 'Merge Overlapping Intervals', code: 'vector<vector<int>> merged;\nfor (const auto& cur : intervals) {\n    if (merged.empty() || merged.back()[1] < cur[0]) {\n        merged.push_back(cur);\n    } else {\n        merged.back()[1] = max(merged.back()[1], cur[1]);\n    }\n}' },
            { title: 'Fenwick Tree (BIT) Sum', code: 'void add(int i, int delta) {\n    for (; i <= n; i += i & -i) bit[i] += delta;\n}\nint query(int i) {\n    int sum = 0;\n    for (; i > 0; i -= i & -i) sum += bit[i];\n    return sum;\n}' },
            { title: 'Backtracking Subsets Generator', code: 'void dfs(int idx, vector<int>& cur) {\n    res.push_back(cur);\n    for (int i = idx; i < nums.size(); i++) {\n        cur.push_back(nums[i]);\n        dfs(i + 1, cur);\n        cur.pop_back();\n    }\n}' },
            { title: 'Edit Distance Levenshtein DP', code: 'for (int i = 1; i <= m; i++) {\n    for (int j = 1; j <= n; j++) {\n        if (a[i - 1] == b[j - 1]) dp[i][j] = dp[i - 1][j - 1];\n        else dp[i][j] = 1 + min({dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]});\n    }\n}' },
            { title: 'Sliding Window Maximum Deque', code: 'deque<int> dq;\nfor (int i = 0; i < n; i++) {\n    if (!dq.empty() && dq.front() == i - k) dq.pop_front();\n    while (!dq.empty() && a[dq.back()] <= a[i]) dq.pop_back();\n    dq.push_back(i);\n    if (i >= k - 1) ans.push_back(a[dq.front()]);\n}' },
            { title: 'Trapping Rain Water Two-Pointer', code: 'int l = 0, r = n - 1, lMax = 0, rMax = 0, water = 0;\nwhile (l < r) {\n    if (h[l] < h[r]) {\n        lMax = max(lMax, h[l]);\n        water += lMax - h[l++];\n    } else {\n        rMax = max(rMax, h[r]);\n        water += rMax - h[r--];\n    }\n}' },
            { title: 'KMP Prefix Function Pi Array', code: 'vector<int> pi(n, 0);\nfor (int i = 1; i < n; i++) {\n    int j = pi[i - 1];\n    while (j > 0 && s[i] != s[j]) j = pi[j - 1];\n    if (s[i] == s[j]) j++;\n    pi[i] = j;\n}' },
            { title: 'Bipartite Graph Coloring DFS', code: 'bool dfsColor(int u, int c) {\n    color[u] = c;\n    for (int v : adj[u]) {\n        if (color[v] == c) return false;\n        if (color[v] == 0 && !dfsColor(v, -c)) return false;\n    }\n    return true;\n}' },
            { title: 'Rotated Sorted Array Search', code: 'while (lo <= hi) {\n    int mid = lo + (hi - lo) / 2;\n    if (a[mid] == target) return mid;\n    if (a[lo] <= a[mid]) {\n        if (a[lo] <= target && target < a[mid]) hi = mid - 1;\n        else lo = mid + 1;\n    } else {\n        if (a[mid] < target && target <= a[hi]) lo = mid + 1;\n        else hi = mid - 1;\n    }\n}' },
            { title: 'LRU Cache Get Operation', code: 'int get(int key) {\n    if (mp.find(key) == mp.end()) return -1;\n    cache.splice(cache.begin(), cache, mp[key]);\n    return mp[key]->second;\n}' },
            { title: 'Coin Change Minimum Coins DP', code: 'vector<int> dp(amount + 1, amount + 1);\ndp[0] = 0;\nfor (int i = 1; i <= amount; i++) {\n    for (int c : coins) {\n        if (c <= i) dp[i] = min(dp[i], dp[i - c] + 1);\n    }\n}' }
        ]
    },

    // ========================================================================
    // 3. JAVA LANGUAGE (20 Easy, 20 Medium, 20 Hard)
    // ========================================================================
    java: {
        easy: [
            { title: 'Standard Main Method', code: 'public static void main(String[] args) {\n    System.out.println("Ready");\n}' },
            { title: 'Scanner Input Read', code: 'Scanner sc = new Scanner(System.in);\nint n = sc.nextInt();' },
            { title: 'ArrayList Creation', code: 'List<String> list = new ArrayList<>();\nlist.add("Java");' },
            { title: 'Arrays Sort Call', code: 'int[] scores = {88, 92, 75, 96};\nArrays.sort(scores);' },
            { title: 'Enhanced For-Each Loop', code: 'for (String item : items) {\n    System.out.println(item);\n}' },
            { title: 'StringBuilder Append', code: 'StringBuilder sb = new StringBuilder();\nsb.append("Code").reverse();' },
            { title: 'HashMap Put & GetOrDefault', code: 'Map<String, Integer> map = new HashMap<>();\nmap.put(key, map.getOrDefault(key, 0) + 1);' },
            { title: 'String Equals Check', code: 'if ("ADMIN".equalsIgnoreCase(role)) {\n    grantAccess();\n}' },
            { title: 'Math Max and Abs', code: 'int diff = Math.abs(a - b);\nint best = Math.max(best, diff);' },
            { title: 'Char Array Conversion', code: 'char[] chars = word.toCharArray();' },
            { title: 'HashSet Uniqueness', code: 'Set<Integer> visited = new HashSet<>();\nvisited.add(nodeId);' },
            { title: 'Integer ParseInt', code: 'int port = Integer.parseInt("8080");' },
            { title: 'Ternary Status Assignment', code: 'String status = (marks >= 50) ? "PASS" : "FAIL";' },
            { title: 'Queue LinkedList Init', code: 'Queue<Integer> q = new LinkedList<>();\nq.offer(10);' },
            { title: 'ArrayDeque Stack Push', code: 'Deque<Character> stack = new ArrayDeque<>();\nstack.push(\'{\');' },
            { title: 'String Split Words', code: 'String[] words = line.trim().split("\\\\s+");' },
            { title: 'Static Final Constant', code: 'private static final int MOD = 1_000_000_007;' },
            { title: 'Character IsLetterOrDigit', code: 'if (Character.isLetterOrDigit(ch)) {\n    clean.append(Character.toLowerCase(ch));\n}' },
            { title: 'Collections Reverse', code: 'Collections.reverse(resultList);' },
            { title: 'Try-Catch Exception Block', code: 'try {\n    processData();\n} catch (Exception e) {\n    e.printStackTrace();\n}' }
        ],
        medium: [
            { title: 'Two Sum HashMap Solution', code: 'Map<Integer, Integer> seen = new HashMap<>();\nfor (int i = 0; i < nums.length; i++) {\n    int complement = target - nums[i];\n    if (seen.containsKey(complement)) {\n        return new int[]{seen.get(complement), i};\n    }\n    seen.put(nums[i], i);\n}' },
            { title: 'Valid Palindrome Two Pointers', code: 'int left = 0, right = s.length() - 1;\nwhile (left < right) {\n    if (s.charAt(left++) != s.charAt(right--)) {\n        return false;\n    }\n}\nreturn true;' },
            { title: 'Frequency Bucket Array', code: 'int[] count = new int[26];\nfor (char c : s.toCharArray()) {\n    count[c - \'a\']++;\n}' },
            { title: 'PriorityQueue Max-Heap', code: 'PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());\nfor (int n : nums) {\n    maxHeap.offer(n);\n}' },
            { title: 'Binary Search Method', code: 'int low = 0, high = arr.length - 1;\nwhile (low <= high) {\n    int mid = low + (high - low) / 2;\n    if (arr[mid] == key) return mid;\n    if (arr[mid] < key) low = mid + 1;\n    else high = mid - 1;\n}' },
            { title: 'Group Anagrams Map', code: 'Map<String, List<String>> groups = new HashMap<>();\nfor (String w : words) {\n    char[] ca = w.toCharArray();\n    Arrays.sort(ca);\n    String key = new String(ca);\n    groups.computeIfAbsent(key, k -> new ArrayList<>()).add(w);\n}' },
            { title: 'Stream Filter & Collect', code: 'List<Integer> evens = numbers.stream()\n    .filter(n -> n % 2 == 0)\n    .collect(Collectors.toList());' },
            { title: 'Reverse Words with Builder', code: 'String[] parts = s.trim().split("\\\\s+");\nStringBuilder sb = new StringBuilder();\nfor (int i = parts.length - 1; i >= 0; i--) {\n    sb.append(parts[i]).append(i > 0 ? " " : "");\n}' },
            { title: 'Product Except Self Prefix', code: 'int[] res = new int[n];\nres[0] = 1;\nfor (int i = 1; i < n; i++) {\n    res[i] = res[i - 1] * nums[i - 1];\n}' },
            { title: 'Linked List Middle Slow-Fast', code: 'ListNode slow = head, fast = head;\nwhile (fast != null && fast.next != null) {\n    slow = slow.next;\n    fast = fast.next.next;\n}\nreturn slow;' },
            { title: 'Custom Comparator Sort 2D', code: 'Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));' },
            { title: 'Best Time to Buy & Sell Stock', code: 'int minPrice = Integer.MAX_VALUE, maxProfit = 0;\nfor (int price : prices) {\n    minPrice = Math.min(minPrice, price);\n    maxProfit = Math.max(maxProfit, price - minPrice);\n}' },
            { title: 'Check Balanced Brackets', code: 'Deque<Character> st = new ArrayDeque<>();\nfor (char c : s.toCharArray()) {\n    if (c == \'(\') st.push(\')\');\n    else if (c == \'[\') st.push(\']\');\n    else if (st.isEmpty() || st.pop() != c) return false;\n}' },
            { title: 'Rotate Matrix 90 Degrees', code: 'for (int i = 0; i < n; i++) {\n    for (int j = i; j < n; j++) {\n        int tmp = m[i][j];\n        m[i][j] = m[j][i];\n        m[j][i] = tmp;\n    }\n}' },
            { title: 'Climbing Stairs Fibonacci DP', code: 'int prev2 = 1, prev1 = 2;\nfor (int i = 3; i <= n; i++) {\n    int cur = prev1 + prev2;\n    prev2 = prev1;\n    prev1 = cur;\n}' },
            { title: 'Find Peak Element Binary', code: 'int l = 0, r = nums.length - 1;\nwhile (l < r) {\n    int mid = l + (r - l) / 2;\n    if (nums[mid] < nums[mid + 1]) l = mid + 1;\n    else r = mid;\n}' },
            { title: 'Longest Common Prefix', code: 'String prefix = strs[0];\nfor (int i = 1; i < strs.length; i++) {\n    while (strs[i].indexOf(prefix) != 0) {\n        prefix = prefix.substring(0, prefix.length() - 1);\n    }\n}' },
            { title: 'Subarray Sum Prefix HashMap', code: 'Map<Integer, Integer> map = new HashMap<>();\nmap.put(0, 1);\nint sum = 0, ans = 0;\nfor (int x : nums) {\n    sum += x;\n    ans += map.getOrDefault(sum - k, 0);\n    map.put(sum, map.getOrDefault(sum, 0) + 1);\n}' },
            { title: 'Tree Inorder Traversal', code: 'void inorder(TreeNode root, List<Integer> out) {\n    if (root == null) return;\n    inorder(root.left, out);\n    out.add(root.val);\n    inorder(root.right, out);\n}' },
            { title: 'Thread-Safe Singleton Pattern', code: 'private static volatile Config instance;\npublic static Config getInstance() {\n    if (instance == null) {\n        synchronized (Config.class) {\n            if (instance == null) instance = new Config();\n        }\n    }\n    return instance;\n}' }
        ],
        hard: [
            { title: 'BFS Shortest Path Grid', code: 'Queue<int[]> q = new ArrayDeque<>();\nq.offer(new int[]{0, 0, 1});\nvisited[0][0] = true;\nwhile (!q.isEmpty()) {\n    int[] cur = q.poll();\n    if (cur[0] == R - 1 && cur[1] == C - 1) return cur[2];\n    for (int[] d : DIRS) {\n        int nr = cur[0] + d[0], nc = cur[1] + d[1];\n        if (nr >= 0 && nr < R && nc >= 0 && nc < C && !visited[nr][nc]) {\n            visited[nr][nc] = true;\n            q.offer(new int[]{nr, nc, cur[2] + 1});\n        }\n    }\n}' },
            { title: 'Merge K Sorted Lists Heap', code: 'PriorityQueue<ListNode> pq = new PriorityQueue<>((a, b) -> a.val - b.val);\nfor (ListNode node : lists) {\n    if (node != null) pq.offer(node);\n}\nListNode dummy = new ListNode(0), tail = dummy;\nwhile (!pq.isEmpty()) {\n    ListNode min = pq.poll();\n    tail.next = min;\n    tail = tail.next;\n    if (min.next != null) pq.offer(min.next);\n}' },
            { title: 'Longest Substring Without Repeat', code: 'Map<Character, Integer> lastIdx = new HashMap<>();\nint left = 0, maxLen = 0;\nfor (int right = 0; right < s.length(); right++) {\n    char c = s.charAt(right);\n    if (lastIdx.containsKey(c)) {\n        left = Math.max(left, lastIdx.get(c) + 1);\n    }\n    lastIdx.put(c, right);\n    maxLen = Math.max(maxLen, right - left + 1);\n}' },
            { title: 'Number of Islands DFS', code: 'void dfsGrid(char[][] grid, int r, int c) {\n    if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] == \'0\') {\n        return;\n    }\n    grid[r][c] = \'0\';\n    dfsGrid(grid, r + 1, c);\n    dfsGrid(grid, r - 1, c);\n    dfsGrid(grid, r, c + 1);\n    dfsGrid(grid, r, c - 1);\n}' },
            { title: 'Validate Binary Search Tree', code: 'boolean isValidBST(TreeNode node, Long min, Long max) {\n    if (node == null) return true;\n    if ((min != null && node.val <= min) || (max != null && node.val >= max)) {\n        return false;\n    }\n    return isValidBST(node.left, min, (long) node.val)\n        && isValidBST(node.right, (long) node.val, max);\n}' },
            { title: 'Course Schedule Topological BFS', code: 'Queue<Integer> q = new ArrayDeque<>();\nfor (int i = 0; i < numCourses; i++) {\n    if (inDegree[i] == 0) q.offer(i);\n}\nint taken = 0;\nwhile (!q.isEmpty()) {\n    int u = q.poll();\n    taken++;\n    for (int v : graph.get(u)) {\n        if (--inDegree[v] == 0) q.offer(v);\n    }\n}\nreturn taken == numCourses;' },
            { title: 'Word Break Dynamic Programming', code: 'boolean[] dp = new boolean[s.length() + 1];\ndp[0] = true;\nfor (int i = 1; i <= s.length(); i++) {\n    for (int j = 0; j < i; j++) {\n        if (dp[j] && dict.contains(s.substring(j, i))) {\n            dp[i] = true;\n            break;\n        }\n    }\n}\nreturn dp[s.length()];' },
            { title: 'LRU Cache LinkedHashMap', code: 'class LRUCache extends LinkedHashMap<Integer, Integer> {\n    private final int capacity;\n    public LRUCache(int capacity) {\n        super(capacity, 0.75f, true);\n        this.capacity = capacity;\n    }\n    @Override\n    protected boolean removeEldestEntry(Map.Entry<Integer, Integer> eldest) {\n        return size() > capacity;\n    }\n}' },
            { title: 'House Robber Linear DP', code: 'int prev2 = 0, prev1 = 0;\nfor (int loot : houses) {\n    int cur = Math.max(prev1, prev2 + loot);\n    prev2 = prev1;\n    prev1 = cur;\n}\nreturn prev1;' },
            { title: 'Permutations Backtracking', code: 'void backtrack(int[] nums, boolean[] used, List<Integer> path) {\n    if (path.size() == nums.length) {\n        result.add(new ArrayList<>(path));\n        return;\n    }\n    for (int i = 0; i < nums.length; i++) {\n        if (used[i]) continue;\n        used[i] = true;\n        path.add(nums[i]);\n        backtrack(nums, used, path);\n        path.remove(path.size() - 1);\n        used[i] = false;\n    }\n}' },
            { title: 'Median of Stream Two Heaps', code: 'low.offer(num);\nhigh.offer(low.poll());\nif (low.size() < high.size()) {\n    low.offer(high.poll());\n}' },
            { title: 'Daily Temperatures Monotonic Stack', code: 'int[] ans = new int[temps.length];\nDeque<Integer> stack = new ArrayDeque<>();\nfor (int i = 0; i < temps.length; i++) {\n    while (!stack.isEmpty() && temps[stack.peek()] < temps[i]) {\n        int idx = stack.pop();\n        ans[idx] = i - idx;\n    }\n    stack.push(i);\n}' },
            { title: 'Serialize Binary Tree Preorder', code: 'void buildString(TreeNode node, StringBuilder sb) {\n    if (node == null) {\n        sb.append("#,");\n    } else {\n        sb.append(node.val).append(",");\n        buildString(node.left, sb);\n        buildString(node.right, sb);\n    }\n}' },
            { title: 'Koko Eating Bananas Binary Answer', code: 'int lo = 1, hi = maxPile;\nwhile (lo < hi) {\n    int mid = lo + (hi - lo) / 2;\n    long hours = 0;\n    for (int p : piles) hours += (p + mid - 1) / mid;\n    if (hours <= h) hi = mid;\n    else lo = mid + 1;\n}' },
            { title: 'Trie Prefix Search Method', code: 'public boolean startsWith(String prefix) {\n    TrieNode node = root;\n    for (char c : prefix.toCharArray()) {\n        int i = c - \'a\';\n        if (node.links[i] == null) return false;\n        node = node.links[i];\n    }\n    return true;\n}' },
            { title: 'Longest Common Subsequence 2D DP', code: 'int[][] dp = new int[m + 1][n + 1];\nfor (int i = 1; i <= m; i++) {\n    for (int j = 1; j <= n; j++) {\n        if (s1.charAt(i - 1) == s2.charAt(j - 1)) {\n            dp[i][j] = 1 + dp[i - 1][j - 1];\n        } else {\n            dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);\n        }\n    }\n}' },
            { title: 'Minimum Window Substring Expand', code: 'while (missing == 0) {\n    if (right - left + 1 < minLen) {\n        minLen = right - left + 1;\n        start = left;\n    }\n    if (++need[s.charAt(left++)] > 0) missing++;\n}' },
            { title: 'Clone Graph DFS MemoMap', code: 'Node cloneGraph(Node node, Map<Node, Node> copies) {\n    if (node == null) return null;\n    if (copies.containsKey(node)) return copies.get(node);\n    Node copy = new Node(node.val);\n    copies.put(node, copy);\n    for (Node nei : node.neighbors) {\n        copy.neighbors.add(cloneGraph(nei, copies));\n    }\n    return copy;\n}' },
            { title: 'Largest Rectangle in Histogram', code: 'int h = (i == n) ? 0 : heights[i];\nwhile (!st.isEmpty() && h < heights[st.peek()]) {\n    int height = heights[st.pop()];\n    int width = st.isEmpty() ? i : i - st.peek() - 1;\n    maxArea = Math.max(maxArea, height * width);\n}\nst.push(i);' },
            { title: 'CompletableFuture Async Pipeline', code: 'CompletableFuture.supplyAsync(() -> fetchCandidate(id))\n    .thenApply(candidate -> evaluateScore(candidate))\n    .thenAccept(score -> publishResult(score));' }
        ]
    },

    // ========================================================================
    // 4. PYTHON LANGUAGE (20 Easy, 20 Medium, 20 Hard)
    // ========================================================================
    python: {
        easy: [
            { title: 'F-String Greeting', code: 'name = "Karthik"\nprint(f"Welcome, {name}!")' },
            { title: 'List Comprehension Squares', code: 'squares = [x * x for x in range(1, 11)]' },
            { title: 'Reverse String Slice', code: 'reversed_text = text[::-1]' },
            { title: 'Multiple Variable Swap', code: 'a, b = b, a' },
            { title: 'Dictionary Get Default', code: 'count = freq.get(word, 0) + 1' },
            { title: 'Enumerate Loop Index', code: 'for idx, val in enumerate(items):\n    print(idx, val)' },
            { title: 'Read Space-Separated Ints', code: 'nums = list(map(int, input().split()))' },
            { title: 'Set Intersection Check', code: 'common = set(list_a) & set(list_b)' },
            { title: 'Lambda Sort by Second Key', code: 'pairs.sort(key=lambda x: x[1])' },
            { title: 'Filter Even Numbers', code: 'evens = [n for n in nums if n % 2 == 0]' },
            { title: 'Join String Tokens', code: 'sentence = " ".join(words)' },
            { title: 'Zip Two Lists Into Dict', code: 'lookup = dict(zip(keys, values))' },
            { title: 'Any and All Builtins', code: 'is_valid = all(x > 0 for x in scores)' },
            { title: 'Counter Frequency Import', code: 'from collections import Counter\ncounts = Counter(s)' },
            { title: 'Ternary Conditional Expression', code: 'result = "Pass" if score >= 60 else "Fail"' },
            { title: 'Unpack First and Rest', code: 'first, *middle, last = [10, 20, 30, 40, 50]' },
            { title: 'Defaultdict List Init', code: 'from collections import defaultdict\ngraph = defaultdict(list)' },
            { title: 'File Context Manager Read', code: 'with open("data.txt", "r") as f:\n    lines = f.read().splitlines()' },
            { title: 'Check Palindrome One-Liner', code: 'is_pal = (s == s[::-1])' },
            { title: 'Deque Popleft Queue', code: 'from collections import deque\nq = deque([1, 2, 3])\nfirst = q.popleft()' }
        ],
        medium: [
            { title: 'Two Sum Dictionary Lookup', code: 'def two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        if target - num in seen:\n            return [seen[target - num], i]\n        seen[num] = i' },
            { title: 'Valid Parentheses Stack', code: 'def is_valid(s: str) -> bool:\n    stack = []\n    pairs = {")": "(", "]": "[", "}": "{"}\n    for ch in s:\n        if ch in pairs:\n            if not stack or stack.pop() != pairs[ch]:\n                return False\n        else:\n            stack.append(ch)\n    return not stack' },
            { title: 'Binary Search Iterative', code: 'def binary_search(arr, target):\n    lo, hi = 0, len(arr) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            lo = mid + 1\n        else:\n            hi = mid - 1\n    return -1' },
            { title: 'Group Anagrams Defaultdict', code: 'def group_anagrams(strs):\n    groups = defaultdict(list)\n    for s in strs:\n        key = "".join(sorted(s))\n        groups[key].append(s)\n    return list(groups.values())' },
            { title: 'Kadane Maximum Subarray', code: 'def max_subarray(nums):\n    cur = best = nums[0]\n    for x in nums[1:]:\n        cur = max(x, cur + x)\n        best = max(best, cur)\n    return best' },
            { title: 'Fibonacci Generator Yield', code: 'def fib_gen(limit):\n    a, b = 0, 1\n    for _ in range(limit):\n        yield a\n        a, b = b, a + b' },
            { title: 'Merge Overlapping Intervals', code: 'def merge_intervals(intervals):\n    intervals.sort(key=lambda x: x[0])\n    merged = [intervals[0]]\n    for start, end in intervals[1:]:\n        if start <= merged[-1][1]:\n            merged[-1][1] = max(merged[-1][1], end)\n        else:\n            merged.append([start, end])\n    return merged' },
            { title: 'Top K Frequent Elements', code: 'def top_k_frequent(nums, k):\n    counts = Counter(nums)\n    return [item for item, _ in counts.most_common(k)]' },
            { title: 'Product of Array Except Self', code: 'def product_except_self(nums):\n    res = [1] * len(nums)\n    prefix = 1\n    for i in range(len(nums)):\n        res[i] = prefix\n        prefix *= nums[i]\n    return res' },
            { title: 'Flatten Nested List Comprehension', code: 'flat = [item for row in matrix for item in row]' },
            { title: 'Longest Substring Sliding Window', code: 'def length_of_longest_substring(s: str) -> int:\n    seen = {}\n    left = best = 0\n    for right, ch in enumerate(s):\n        if ch in seen and seen[ch] >= left:\n            left = seen[ch] + 1\n        seen[ch] = right\n        best = max(best, right - left + 1)\n    return best' },
            { title: 'Min Heap Heapq PushPop', code: 'import heapq\nheap = []\nfor x in nums:\n    heapq.heappush(heap, x)\n    if len(heap) > k:\n        heapq.heappop(heap)' },
            { title: 'Reverse Linked List Iterative', code: 'def reverse_list(head):\n    prev, curr = None, head\n    while curr:\n        curr.next, prev, curr = prev, curr, curr.next\n    return prev' },
            { title: 'Subarray Sum Equals K', code: 'def subarray_sum(nums, k):\n    pref = {0: 1}\n    cur = ans = 0\n    for x in nums:\n        cur += x\n        ans += pref.get(cur - k, 0)\n        pref[cur] = pref.get(cur, 0) + 1\n    return ans' },
            { title: 'Timing Decorator Function', code: 'def timer(func):\n    def wrapper(*args, **kwargs):\n        res = func(*args, **kwargs)\n        return res\n    return wrapper' },
            { title: 'Matrix Transpose with Zip', code: 'transposed = [list(row) for row in zip(*matrix)]' },
            { title: 'Container With Most Water', code: 'l, r, best = 0, len(h) - 1, 0\nwhile l < r:\n    best = max(best, (r - l) * min(h[l], h[r]))\n    if h[l] < h[r]:\n        l += 1\n    else:\n        r -= 1' },
            { title: 'GCD and LCM Helper', code: 'import math\ng = math.gcd(a, b)\nlcm = (a * b) // g' },
            { title: 'Bisect Left Insertion Point', code: 'import bisect\nidx = bisect.bisect_left(sorted_arr, target)' },
            { title: 'Dataclass Student Model', code: 'from dataclasses import dataclass\n\n@dataclass\nclass Student:\n    usn: str\n    name: str\n    cgpa: float' }
        ],
        hard: [
            { title: 'LRU Cache Using lru_cache', code: 'from functools import lru_cache\n\n@lru_cache(maxsize=None)\ndef climb_stairs(n: int) -> int:\n    if n <= 2:\n        return n\n    return climb_stairs(n - 1) + climb_stairs(n - 2)' },
            { title: 'Dijkstra Shortest Path Heapq', code: 'def dijkstra(n, adj, src):\n    dist = [float("inf")] * n\n    dist[src] = 0\n    pq = [(0, src)]\n    while pq:\n        d, u = heapq.heappop(pq)\n        if d > dist[u]:\n            continue\n        for v, w in adj[u]:\n            if dist[u] + w < dist[v]:\n                dist[v] = dist[u] + w\n                heapq.heappush(pq, (dist[v], v))\n    return dist' },
            { title: 'Number of Islands BFS', code: 'def num_islands(grid):\n    rows, cols = len(grid), len(grid[0])\n    def dfs(r, c):\n        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != "1":\n            return\n        grid[r][c] = "0"\n        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):\n            dfs(r + dr, c + dc)\n    count = 0\n    for r in range(rows):\n        for c in range(cols):\n            if grid[r][c] == "1":\n                dfs(r, c)\n                count += 1\n    return count' },
            { title: 'Trie Dictionary Implementation', code: 'class Trie:\n    def __init__(self):\n        self.root = {}\n\n    def insert(self, word: str) -> None:\n        node = self.root\n        for ch in word:\n            node = node.setdefault(ch, {})\n        node["#"] = True' },
            { title: 'Union-Find Disjoint Set', code: 'class UnionFind:\n    def __init__(self, n):\n        self.parent = list(range(n))\n\n    def find(self, x):\n        if self.parent[x] != x:\n            self.parent[x] = self.find(self.parent[x])\n        return self.parent[x]\n\n    def union(self, a, b):\n        ra, rb = self.find(a), self.find(b)\n        if ra != rb:\n            self.parent[ra] = rb' },
            { title: 'QuickSort List Comprehension', code: 'def quicksort(arr):\n    if len(arr) <= 1:\n        return arr\n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    mid = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    return quicksort(left) + mid + quicksort(right)' },
            { title: 'Coin Change Minimum Coins DP', code: 'def coin_change(coins, amount):\n    dp = [amount + 1] * (amount + 1)\n    dp[0] = 0\n    for a in range(1, amount + 1):\n        for c in coins:\n            if a - c >= 0:\n                dp[a] = min(dp[a], 1 + dp[a - c])\n    return dp[amount] if dp[amount] <= amount else -1' },
            { title: 'Topological Sort Kahn Algorithm', code: 'def topo_sort(n, edges):\n    indeg = [0] * n\n    adj = defaultdict(list)\n    for u, v in edges:\n        adj[u].append(v)\n        indeg[v] += 1\n    q = deque([i for i in range(n) if indeg[i] == 0])\n    order = []\n    while q:\n        u = q.popleft()\n        order.append(u)\n        for v in adj[u]:\n            indeg[v] -= 1\n            if indeg[v] == 0:\n                q.append(v)\n    return order' },
            { title: 'Longest Increasing Subsequence Bisect', code: 'def lis_length(nums):\n    tails = []\n    for x in nums:\n        idx = bisect.bisect_left(tails, x)\n        if idx == len(tails):\n            tails.append(x)\n        else:\n            tails[idx] = x\n    return len(tails)' },
            { title: 'N-Queens Backtracking State', code: 'def solve_n_queens(n):\n    cols, pos_diag, neg_diag = set(), set(), set()\n    res = []\n    def backtrack(r, board):\n        if r == n:\n            res.append(board[:])\n            return\n        for c in range(n):\n            if c in cols or (r + c) in pos_diag or (r - c) in neg_diag:\n                continue\n            cols.add(c); pos_diag.add(r + c); neg_diag.add(r - c)\n            backtrack(r + 1, board + [c])\n            cols.remove(c); pos_diag.remove(r + c); neg_diag.remove(r - c)' },
            { title: 'Sliding Window Maximum Deque', code: 'def max_sliding_window(nums, k):\n    dq, out = deque(), []\n    for i, n in enumerate(nums):\n        while dq and nums[dq[-1]] <= n:\n            dq.pop()\n        dq.append(i)\n        if dq[0] == i - k:\n            dq.popleft()\n        if i >= k - 1:\n            out.append(nums[dq[0]])\n    return out' },
            { title: 'Validate Binary Search Tree', code: 'def is_valid_bst(node, low=float("-inf"), high=float("inf")):\n    if not node:\n        return True\n    if not (low < node.val < high):\n        return False\n    return is_valid_bst(node.left, low, node.val) and is_valid_bst(node.right, node.val, high)' },
            { title: 'Word Ladder BFS Shortest Transformation', code: 'def word_ladder(begin, end, word_set):\n    q = deque([(begin, 1)])\n    while q:\n        word, steps = q.popleft()\n        if word == end:\n            return steps\n        for i in range(len(word)):\n            for ch in "abcdefghijklmnopqrstuvwxyz":\n                nxt = word[:i] + ch + word[i+1:]\n                if nxt in word_set:\n                    word_set.remove(nxt)\n                    q.append((nxt, steps + 1))\n    return 0' },
            { title: 'Trapping Rain Water Two Pointers', code: 'def trap(height):\n    l, r = 0, len(height) - 1\n    l_max = r_max = water = 0\n    while l < r:\n        if height[l] < height[r]:\n            l_max = max(l_max, height[l])\n            water += l_max - height[l]\n            l += 1\n        else:\n            r_max = max(r_max, height[r])\n            water += r_max - height[r]\n            r -= 1\n    return water' },
            { title: 'Monotonic Stack Daily Temperatures', code: 'def daily_temperatures(temps):\n    ans = [0] * len(temps)\n    stack = []\n    for i, t in enumerate(temps):\n        while stack and temps[stack[-1]] < t:\n            prev = stack.pop()\n            ans[prev] = i - prev\n        stack.append(i)\n    return ans' },
            { title: 'Edit Distance Bottom-Up DP', code: 'def min_distance(w1: str, w2: str) -> int:\n    m, n = len(w1), len(w2)\n    dp = [[0] * (n + 1) for _ in range(m + 1)]\n    for i in range(m + 1): dp[i][0] = i\n    for j in range(n + 1): dp[0][j] = j\n    for i in range(1, m + 1):\n        for j in range(1, n + 1):\n            if w1[i - 1] == w2[j - 1]:\n                dp[i][j] = dp[i - 1][j - 1]\n            else:\n                dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])\n    return dp[m][n]' },
            { title: 'Lowest Common Ancestor Binary Tree', code: 'def lca(root, p, q):\n    if not root or root == p or root == q:\n        return root\n    left = lca(root.left, p, q)\n    right = lca(root.right, p, q)\n    return root if (left and right) else (left or right)' },
            { title: 'Subsets Power Set Backtracking', code: 'def subsets(nums):\n    res = []\n    def dfs(idx, path):\n        res.append(path[:])\n        for i in range(idx, len(nums)):\n            path.append(nums[i])\n            dfs(i + 1, path)\n            path.pop()\n    dfs(0, [])\n    return res' },
            { title: 'Binary Search on Answer Capacity', code: 'def ship_within_days(weights, days):\n    lo, hi = max(weights), sum(weights)\n    while lo < hi:\n        mid = (lo + hi) // 2\n        need, cur = 1, 0\n        for w in weights:\n            if cur + w > mid:\n                need += 1\n                cur = 0\n            cur += w\n        if need <= days: hi = mid\n        else: lo = mid + 1\n    return lo' },
            { title: 'Asyncio Gather Concurrent Tasks', code: 'import asyncio\n\nasync def run_batch(urls):\n    tasks = [fetch_url(u) for u in urls]\n    return await asyncio.gather(*tasks)' }
        ]
    },

    // ========================================================================
    // 5. JAVASCRIPT LANGUAGE (20 Easy, 20 Medium, 20 Hard)
    // ========================================================================
    javascript: {
        easy: [
            { title: 'Arrow Function Sum', code: 'const add = (a, b) => a + b;' },
            { title: 'Array Filter Evens', code: 'const evens = nums.filter((n) => n % 2 === 0);' },
            { title: 'Array Map Double', code: 'const doubled = nums.map((x) => x * 2);' },
            { title: 'Array Reduce Total', code: 'const total = prices.reduce((acc, cur) => acc + cur, 0);' },
            { title: 'Object Destructuring', code: 'const { name, usn, department } = student;' },
            { title: 'Spread Operator Clone', code: 'const merged = [...firstBatch, ...secondBatch];' },
            { title: 'Template Literal String', code: 'const msg = `Score: ${score}% (${status})`;' },
            { title: 'Optional Chaining & Nullish', code: 'const city = user?.address?.city ?? "Bengaluru";' },
            { title: 'Unique Array with Set', code: 'const unique = [...new Set(items)];' },
            { title: 'Sort Numbers Ascending', code: 'nums.sort((a, b) => a - b);' },
            { title: 'Object Keys & Values', code: 'const keys = Object.keys(config);' },
            { title: 'Find First Matching Item', code: 'const admin = users.find((u) => u.role === "admin");' },
            { title: 'Check Every & Some', code: 'const allPassed = marks.every((m) => m >= 40);' },
            { title: 'JSON Parse & Stringify', code: 'const copy = JSON.parse(JSON.stringify(payload));' },
            { title: 'String Split Reverse Join', code: 'const rev = str.split("").reverse().join("");' },
            { title: 'Promise Delay Helper', code: 'const sleep = (ms) => new Promise((r) => setTimeout(r, ms));' },
            { title: 'LocalStorage Save Item', code: 'localStorage.setItem("theme", JSON.stringify(prefs));' },
            { title: 'Default Function Parameter', code: 'function greet(user = "Candidate") {\n    return `Hello, ${user}`;\n}' },
            { title: 'Array From Length Range', code: 'const range = Array.from({ length: 5 }, (_, i) => i + 1);' },
            { title: 'Short-Circuit Guard', code: 'isLoggedIn && renderDashboard();' }
        ],
        medium: [
            { title: 'Debounce Utility Function', code: 'function debounce(fn, delay = 300) {\n    let timer;\n    return (...args) => {\n        clearTimeout(timer);\n        timer = setTimeout(() => fn(...args), delay);\n    };\n}' },
            { title: 'Async Fetch With Try-Catch', code: 'async function loadProfile(id) {\n    try {\n        const res = await fetch(`/api/students/${id}`);\n        return await res.json();\n    } catch (err) {\n        console.error(err);\n    }\n}' },
            { title: 'Two Sum Using Map', code: 'function twoSum(nums, target) {\n    const seen = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const need = target - nums[i];\n        if (seen.has(need)) return [seen.get(need), i];\n        seen.set(nums[i], i);\n    }\n    return [];\n}' },
            { title: 'Group By Property Reduce', code: 'const groupBy = (arr, key) =>\n    arr.reduce((acc, item) => {\n        (acc[item[key]] ||= []).push(item);\n        return acc;\n    }, {});' },
            { title: 'Frequency Counter Object', code: 'const freq = {};\nfor (const ch of text) {\n    freq[ch] = (freq[ch] || 0) + 1;\n}' },
            { title: 'Flatten Nested Array Recursive', code: 'const flatten = (arr) =>\n    arr.reduce((acc, val) =>\n        Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val), []);' },
            { title: 'Throttle Event Handler', code: 'function throttle(fn, limit) {\n    let inThrottle = false;\n    return (...args) => {\n        if (!inThrottle) {\n            fn(...args);\n            inThrottle = true;\n            setTimeout(() => (inThrottle = false), limit);\n        }\n    };\n}' },
            { title: 'Valid Brackets Stack Check', code: 'function isValid(s) {\n    const stack = [];\n    const map = { ")": "(", "]": "[", "}": "{" };\n    for (const c of s) {\n        if (map[c]) {\n            if (stack.pop() !== map[c]) return false;\n        } else stack.push(c);\n    }\n    return stack.length === 0;\n}' },
            { title: 'Binary Search Iterative JS', code: 'function binarySearch(arr, target) {\n    let lo = 0, hi = arr.length - 1;\n    while (lo <= hi) {\n        const mid = (lo + hi) >>> 1;\n        if (arr[mid] === target) return mid;\n        if (arr[mid] < target) lo = mid + 1;\n        else hi = mid - 1;\n    }\n    return -1;\n}' },
            { title: 'Memoize Pure Function', code: 'function memoize(fn) {\n    const cache = new Map();\n    return (arg) => {\n        if (cache.has(arg)) return cache.get(arg);\n        const res = fn(arg);\n        cache.set(arg, res);\n        return res;\n    };\n}' },
            { title: 'Chunk Array Into Batches', code: 'function chunk(arr, size) {\n    const res = [];\n    for (let i = 0; i < arr.length; i += size) {\n        res.push(arr.slice(i, i + size));\n    }\n    return res;\n}' },
            { title: 'Deep Freeze Configuration', code: 'function deepFreeze(obj) {\n    Object.keys(obj).forEach((k) => {\n        if (typeof obj[k] === "object" && obj[k] !== null) deepFreeze(obj[k]);\n    });\n    return Object.freeze(obj);\n}' },
            { title: 'Custom Array.prototype.myMap', code: 'Array.prototype.myMap = function (callback) {\n    const result = [];\n    for (let i = 0; i < this.length; i++) {\n        result.push(callback(this[i], i, this));\n    }\n    return result;\n};' },
            { title: 'Max Subarray Kadane JS', code: 'function maxSubArray(nums) {\n    let cur = nums[0], best = nums[0];\n    for (let i = 1; i < nums.length; i++) {\n        cur = Math.max(nums[i], cur + nums[i]);\n        best = Math.max(best, cur);\n    }\n    return best;\n}' },
            { title: 'Event Emitter Subscribe', code: 'class EventEmitter {\n    constructor() { this.events = {}; }\n    on(evt, cb) {\n        (this.events[evt] ||= []).push(cb);\n    }\n    emit(evt, data) {\n        (this.events[evt] || []).forEach((cb) => cb(data));\n    }\n}' },
            { title: 'Anagram Check Frequency', code: 'function isAnagram(s, t) {\n    if (s.length !== t.length) return false;\n    return s.split("").sort().join("") === t.split("").sort().join("");\n}' },
            { title: 'Promise.all Parallel Fetch', code: 'const [exams, results] = await Promise.all([\n    fetch("/api/exams").then((r) => r.json()),\n    fetch("/api/results").then((r) => r.json())\n]);' },
            { title: 'Once Function Wrapper', code: 'function once(fn) {\n    let called = false, result;\n    return (...args) => {\n        if (!called) {\n            called = true;\n            result = fn(...args);\n        }\n        return result;\n    };\n}' },
            { title: 'URL Query Params Builder', code: 'const params = new URLSearchParams({ tab: "games", page: "1" });\nconst url = `/student/dashboard?${params.toString()}`;' },
            { title: 'Intersection of Two Arrays', code: 'function intersect(a, b) {\n    const setB = new Set(b);\n    return [...new Set(a)].filter((x) => setB.has(x));\n}' }
        ],
        hard: [
            { title: 'Promise.all Polyfill Implementation', code: 'function promiseAll(promises) {\n    return new Promise((resolve, reject) => {\n        const results = [];\n        let completed = 0;\n        if (promises.length === 0) return resolve([]);\n        promises.forEach((p, idx) => {\n            Promise.resolve(p).then((val) => {\n                results[idx] = val;\n                if (++completed === promises.length) resolve(results);\n            }).catch(reject);\n        });\n    });\n}' },
            { title: 'Deep Clone With Circular Map', code: 'function deepClone(obj, seen = new WeakMap()) {\n    if (obj === null || typeof obj !== "object") return obj;\n    if (seen.has(obj)) return seen.get(obj);\n    const clone = Array.isArray(obj) ? [] : {};\n    seen.set(obj, clone);\n    for (const key of Reflect.ownKeys(obj)) {\n        clone[key] = deepClone(obj[key], seen);\n    }\n    return clone;\n}' },
            { title: 'LRU Cache Using JS Map Order', code: 'class LRUCache {\n    constructor(capacity) {\n        this.cap = capacity;\n        this.cache = new Map();\n    }\n    get(key) {\n        if (!this.cache.has(key)) return -1;\n        const val = this.cache.get(key);\n        this.cache.delete(key);\n        this.cache.set(key, val);\n        return val;\n    }\n    put(key, val) {\n        if (this.cache.has(key)) this.cache.delete(key);\n        this.cache.set(key, val);\n        if (this.cache.size > this.cap) {\n            this.cache.delete(this.cache.keys().next().value);\n        }\n    }\n}' },
            { title: 'Currying Function Converter', code: 'function curry(fn) {\n    return function curried(...args) {\n        if (args.length >= fn.length) {\n            return fn.apply(this, args);\n        }\n        return (...next) => curried.apply(this, args.concat(next));\n    };\n}' },
            { title: 'Async Retry With Exponential Backoff', code: 'async function fetchWithRetry(fn, retries = 3, delay = 200) {\n    try {\n        return await fn();\n    } catch (err) {\n        if (retries <= 0) throw err;\n        await new Promise((r) => setTimeout(r, delay));\n        return fetchWithRetry(fn, retries - 1, delay * 2);\n    }\n}' },
            { title: 'Longest Substring Without Repeating JS', code: 'function lengthOfLongestSubstring(s) {\n    const map = new Map();\n    let left = 0, max = 0;\n    for (let right = 0; right < s.length; right++) {\n        if (map.has(s[right])) {\n            left = Math.max(left, map.get(s[right]) + 1);\n        }\n        map.set(s[right], right);\n        max = Math.max(max, right - left + 1);\n    }\n    return max;\n}' },
            { title: 'Merge Intervals Sorting & Reduce', code: 'function mergeIntervals(intervals) {\n    intervals.sort((a, b) => a[0] - b[0]);\n    const res = [intervals[0]];\n    for (let i = 1; i < intervals.length; i++) {\n        const prev = res[res.length - 1];\n        if (intervals[i][0] <= prev[1]) {\n            prev[1] = Math.max(prev[1], intervals[i][1]);\n        } else {\n            res.push(intervals[i]);\n        }\n    }\n    return res;\n}' },
            { title: 'Concurrency Limiter Task Queue', code: 'async function runPool(tasks, limit) {\n    const results = [];\n    const executing = new Set();\n    for (const task of tasks) {\n        const p = Promise.resolve().then(() => task());\n        results.push(p);\n        executing.add(p);\n        const clean = () => executing.delete(p);\n        p.then(clean, clean);\n        if (executing.size >= limit) await Promise.race(executing);\n    }\n    return Promise.all(results);\n}' },
            { title: 'Trie Prefix Tree Class JS', code: 'class Trie {\n    constructor() { this.root = {}; }\n    insert(word) {\n        let node = this.root;\n        for (const ch of word) {\n            node[ch] = node[ch] || {};\n            node = node[ch];\n        }\n        node.isWord = true;\n    }\n    search(word) {\n        let node = this.root;\n        for (const ch of word) {\n            if (!node[ch]) return false;\n            node = node[ch];\n        }\n        return Boolean(node.isWord);\n    }\n}' },
            { title: 'Function Compose Right-to-Left', code: 'const compose = (...fns) => (initial) =>\n    fns.reduceRight((acc, fn) => fn(acc), initial);' },
            { title: 'Trapping Rain Water Two Pointers JS', code: 'function trap(h) {\n    let l = 0, r = h.length - 1, lMax = 0, rMax = 0, ans = 0;\n    while (l < r) {\n        if (h[l] < h[r]) {\n            lMax = Math.max(lMax, h[l]);\n            ans += lMax - h[l++];\n        } else {\n            rMax = Math.max(rMax, h[r]);\n            ans += rMax - h[r--];\n        }\n    }\n    return ans;\n}' },
            { title: 'Binary Tree Level Order BFS', code: 'function levelOrder(root) {\n    if (!root) return [];\n    const q = [root], res = [];\n    while (q.length > 0) {\n        const size = q.length, row = [];\n        for (let i = 0; i < size; i++) {\n            const node = q.shift();\n            row.push(node.val);\n            if (node.left) q.push(node.left);\n            if (node.right) q.push(node.right);\n        }\n        res.push(row);\n    }\n    return res;\n}' },
            { title: 'Deep Equal Value Comparison', code: 'function deepEqual(a, b) {\n    if (Object.is(a, b)) return true;\n    if (typeof a !== "object" || !a || typeof b !== "object" || !b) return false;\n    const keysA = Object.keys(a), keysB = Object.keys(b);\n    if (keysA.length !== keysB.length) return false;\n    return keysA.every((k) => Object.prototype.hasOwnProperty.call(b, k) && deepEqual(a[k], b[k]));\n}' },
            { title: 'Custom Bind Polyfill', code: 'Function.prototype.myBind = function (ctx, ...boundArgs) {\n    const fn = this;\n    return function (...callArgs) {\n        return fn.apply(ctx, [...boundArgs, ...callArgs]);\n    };\n};' },
            { title: 'Number of Islands Grid DFS', code: 'function numIslands(grid) {\n    let count = 0;\n    const dfs = (r, c) => {\n        if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] === "0") return;\n        grid[r][c] = "0";\n        dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1);\n    };\n    for (let r = 0; r < grid.length; r++) {\n        for (let c = 0; c < grid[0].length; c++) {\n            if (grid[r][c] === "1") { count++; dfs(r, c); }\n        }\n    }\n    return count;\n}' },
            { title: 'Subarray Sum Equals K Map', code: 'function subarraySum(nums, k) {\n    const map = new Map([[0, 1]]);\n    let sum = 0, count = 0;\n    for (const n of nums) {\n        sum += n;\n        count += map.get(sum - k) || 0;\n        map.set(sum, (map.get(sum) || 0) + 1);\n    }\n    return count;\n}' },
            { title: 'Observable Subscribe Pattern', code: 'class Observable {\n    constructor(setup) { this._setup = setup; }\n    subscribe(observer) {\n        return this._setup(observer);\n    }\n}' },
            { title: 'Search in Rotated Sorted Array', code: 'function searchRotated(nums, target) {\n    let lo = 0, hi = nums.length - 1;\n    while (lo <= hi) {\n        const mid = (lo + hi) >>> 1;\n        if (nums[mid] === target) return mid;\n        if (nums[lo] <= nums[mid]) {\n            if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;\n            else lo = mid + 1;\n        } else {\n            if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;\n            else hi = mid - 1;\n        }\n    }\n    return -1;\n}' },
            { title: 'Min Stack With O(1) Minimum', code: 'class MinStack {\n    constructor() { this.st = []; }\n    push(val) {\n        const min = this.st.length === 0 ? val : Math.min(val, this.getMin());\n        this.st.push({ val, min });\n    }\n    pop() { this.st.pop(); }\n    top() { return this.st[this.st.length - 1].val; }\n    getMin() { return this.st[this.st.length - 1].min; }\n}' },
            { title: 'Permutations Backtracking JS', code: 'function permute(nums) {\n    const res = [];\n    const walk = (path, used) => {\n        if (path.length === nums.length) return res.push([...path]);\n        for (let i = 0; i < nums.length; i++) {\n            if (used[i]) continue;\n            used[i] = true;\n            path.push(nums[i]);\n            walk(path, used);\n            path.pop();\n            used[i] = false;\n        }\n    };\n    walk([], []);\n    return res;\n}' }
        ]
    }
};

const getSarcasticVerdict = (wpm, accuracy) => {
    if (wpm === 0) return 'Waiting for your fingers to wake up from hibernation... 🦥';
    if (accuracy < 75) return 'Bro is mashing keys with elbows — accuracy left the chat 💀';
    if (wpm < 20) return 'Certified Two-Finger Hunt & Peck — my grandma types faster on a Nokia 3310 🐢';
    if (wpm < 35) return 'Slow Hands Alert: The compiler literally fell asleep waiting for your semicolon 😴';
    if (wpm < 55) return 'Not bad! Your fingers finally found the home row, keep locking in ⚡';
    if (wpm < 75) return 'Clean & snappy coder hands — placement OA timer fears you 🔥';
    return 'Absolute 10x Mechanical Keyboard Demon — touch grass immediately 👑';
};

const StudentTypeSpeedTab = () => {
    const [selectedLang, setSelectedLang] = useState('c');
    const [selectedLevel, setSelectedLevel] = useState('easy');
    const [snippetIndex, setSnippetIndex] = useState(0);
    const [typed, setTyped] = useState('');
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [elapsedMs, setElapsedMs] = useState(0);
    const textareaRef = useRef(null);

    const snippets = useMemo(() => {
        return SNIPPETS_DB[selectedLang]?.[selectedLevel] || [];
    }, [selectedLang, selectedLevel]);

    const currentSnippet = snippets[snippetIndex % snippets.length] || { title: '', code: '' };
    const targetCode = currentSnippet.code;
    const isCompleted = typed.length > 0 && typed.length >= targetCode.length;

    // Reset typing state whenever language, level, or snippet index changes
    const resetSession = () => {
        setTyped('');
        setStartTime(null);
        setEndTime(null);
        setElapsedMs(0);
        setTimeout(() => {
            textareaRef.current?.focus();
        }, 30);
    };

    useEffect(() => {
        resetSession();
    }, [selectedLang, selectedLevel, snippetIndex]);

    // Live timer while typing
    useEffect(() => {
        if (!startTime || endTime) return undefined;
        const id = setInterval(() => {
            setElapsedMs(Date.now() - startTime);
        }, 100);
        return () => clearInterval(id);
    }, [startTime, endTime]);

    // Calculate live WPM, CPM, and Accuracy
    const stats = useMemo(() => {
        let correctChars = 0;
        for (let i = 0; i < typed.length; i++) {
            if (typed[i] === targetCode[i]) correctChars++;
        }
        const accuracy = typed.length > 0 ? Math.round((correctChars / typed.length) * 100) : 100;
        const activeMs = endTime && startTime ? endTime - startTime : elapsedMs;
        const minutes = activeMs / 60000;
        const wpm = minutes > 0.01 ? Math.round(correctChars / 5 / minutes) : 0;
        const cpm = minutes > 0.01 ? Math.round(correctChars / minutes) : 0;
        const progressPct = targetCode.length > 0 ? Math.min(100, Math.round((typed.length / targetCode.length) * 100)) : 0;
        return {
            correctChars,
            errors: typed.length - correctChars,
            accuracy,
            wpm,
            cpm,
            seconds: (activeMs / 1000).toFixed(1),
            progressPct
        };
    }, [typed, targetCode, elapsedMs, startTime, endTime]);

    const applyTypedChange = (nextValue) => {
        if (endTime) return;
        const clamped = nextValue.slice(0, targetCode.length);
        if (!startTime && clamped.length > 0) {
            setStartTime(Date.now());
        }
        setTyped(clamped);
        if (clamped.length === targetCode.length) {
            const now = Date.now();
            setEndTime(now);
            if (startTime) setElapsedMs(now - startTime);
        }
    };

    // Smart Tab & Enter handling so indentation in multi-line code snippets feels effortless
    const handleKeyDown = (e) => {
        if (endTime) return;

        if (e.key === 'Tab') {
            e.preventDefault();
            const pos = typed.length;
            // Insert matching spaces up to 4 if the target expects spaces
            let spacesToInsert = '';
            for (let i = 0; i < 4 && pos + i < targetCode.length; i++) {
                if (targetCode[pos + i] === ' ') {
                    spacesToInsert += ' ';
                } else {
                    break;
                }
            }
            if (!spacesToInsert) spacesToInsert = '    ';
            applyTypedChange(typed + spacesToInsert);
            return;
        }

        if (e.key === 'Enter') {
            e.preventDefault();
            const pos = typed.length;
            // Auto-complete the newline AND any leading indentation spaces on the next line
            let autoIndent = '\n';
            let cursor = pos + 1;
            while (cursor < targetCode.length && targetCode[cursor] === ' ') {
                autoIndent += ' ';
                cursor++;
            }
            applyTypedChange(typed + autoIndent);
        }
    };

    const handleLanguageChange = (langId) => {
        setSelectedLang(langId);
        setSnippetIndex(0);
    };

    const handleLevelChange = (levelId) => {
        setSelectedLevel(levelId);
        setSnippetIndex(0);
    };

    const handleRandomSnippet = () => {
        if (snippets.length <= 1) return;
        let next = Math.floor(Math.random() * snippets.length);
        if (next === snippetIndex) next = (next + 1) % snippets.length;
        setSnippetIndex(next);
    };

    const activeLangMeta = LANGUAGES.find((l) => l.id === selectedLang);
    const activeLevelMeta = LEVELS.find((l) => l.id === selectedLevel);

    return (
        <div className="space-y-8 font-sans">
            {/* Top Sarcastic Header Card with Static Cartoon SVG */}
            <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="space-y-2.5 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-50 text-[#5899B5] border border-blue-100">
                            Code Typing Dojo
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
                            Cure for “Slow Hands” Syndrome 🐌
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-slate-100 text-slate-700">
                            300 Practice Snippets (No Storage / Pure Practice)
                        </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-semibold text-slate-800">
                        Still Typing With Two Fingers? Fix Those Slow Hands.
                    </h2>
                    <p className="text-slate-500 text-sm leading-relaxed">
                        Knowing the algorithm is useless if your hands type at 12 WPM and the OA timer expires while you hunt for the semicolon. Pick a language (`C`, `C++`, `Java`, `Python`, `JS`), choose from **Easy, Medium, or Hard** (20 snippets each), and train your muscle memory.
                    </p>
                </div>
                <TypeSpeedCartoonSvg variant="header" className="w-64 h-32 shrink-0 hidden sm:block" />
            </div>

            {/* Control Bar: Language Selector + Difficulty Level Selector */}
            <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-7 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Language Pills (5 Languages) */}
                    <div className="lg:col-span-7 space-y-2.5">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                <Code2 size={14} className="text-[#5899B5]" /> 1. Select Programming Language
                            </span>
                            <span className="text-[11px] font-semibold text-slate-400">60 Snippets / Language</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {LANGUAGES.map((lang) => {
                                const isActive = selectedLang === lang.id;
                                return (
                                    <button
                                        key={lang.id}
                                        type="button"
                                        onClick={() => handleLanguageChange(lang.id)}
                                        className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold border transition cursor-pointer flex items-center gap-2 ${
                                            isActive
                                                ? 'bg-[#5899B5] text-white border-[#5899B5] shadow-xs'
                                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                                        }`}
                                    >
                                        <span>{lang.label}</span>
                                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                                            isActive ? 'bg-white/20 text-white' : 'bg-white text-slate-500'
                                        }`}>
                                            {lang.ext}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Difficulty Level Pills (Easy, Medium, Hard - 20 Each) */}
                    <div className="lg:col-span-5 space-y-2.5">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                <Zap size={14} className="text-amber-500" /> 2. Select Difficulty Level
                            </span>
                            <span className="text-[11px] font-semibold text-slate-400">20 Snippets / Level</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {LEVELS.map((lvl) => {
                                const isActive = selectedLevel === lvl.id;
                                return (
                                    <button
                                        key={lvl.id}
                                        type="button"
                                        onClick={() => handleLevelChange(lvl.id)}
                                        className={`py-2.5 px-3 rounded-2xl text-xs sm:text-sm font-semibold border transition cursor-pointer text-center ${
                                            isActive
                                                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                                        }`}
                                    >
                                        <div>{lvl.label}</div>
                                        <div className={`text-[10px] font-normal ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>
                                            20 Snippets
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Snippet Picker & Navigation Bar */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-wrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${activeLevelMeta?.color}`}>
                            {activeLangMeta?.label} • {activeLevelMeta?.label}
                        </span>
                        <select
                            value={snippetIndex}
                            onChange={(e) => setSnippetIndex(Number(e.target.value))}
                            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs sm:text-sm font-semibold outline-none focus:border-[#5899B5] cursor-pointer"
                        >
                            {snippets.map((s, idx) => (
                                <option key={idx} value={idx}>
                                    #{idx + 1} / {snippets.length} — {s.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setSnippetIndex((i) => (i - 1 + snippets.length) % snippets.length)}
                            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                            title="Previous Snippet"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button
                            type="button"
                            onClick={() => setSnippetIndex((i) => (i + 1) % snippets.length)}
                            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer flex items-center gap-1"
                        >
                            Next <ChevronRight size={15} />
                        </button>
                        <button
                            type="button"
                            onClick={handleRandomSnippet}
                            className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
                        >
                            <Shuffle size={14} /> Random
                        </button>
                        <button
                            type="button"
                            onClick={resetSession}
                            className="px-3.5 py-2 rounded-xl bg-[#5899B5] hover:bg-[#3D7690] text-white text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
                        >
                            <RotateCcw size={14} /> Restart
                        </button>
                    </div>
                </div>
            </div>

            {/* Live Typing Telemetry & Sarcastic Status Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-4 flex items-center justify-between">
                    <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">Speed (WPM)</span>
                        <span className="text-2xl font-bold text-slate-800">{stats.wpm}</span>
                        <span className="text-[11px] text-slate-400 block">{stats.cpm} CPM</span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#5899B5] flex items-center justify-center">
                        <Zap size={20} />
                    </div>
                </div>

                <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-4 flex items-center justify-between">
                    <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">Accuracy</span>
                        <span className={`text-2xl font-bold ${stats.accuracy >= 90 ? 'text-emerald-600' : stats.accuracy >= 75 ? 'text-amber-600' : 'text-rose-600'}`}>
                            {stats.accuracy}%
                        </span>
                        <span className="text-[11px] text-slate-400 block">{stats.errors} typos</span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <Target size={20} />
                    </div>
                </div>

                <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-4 flex items-center justify-between">
                    <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">Elapsed Time</span>
                        <span className="text-2xl font-bold text-slate-800">{stats.seconds}s</span>
                        <span className="text-[11px] text-slate-400 block">Live Stopwatch</span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                        <Clock size={20} />
                    </div>
                </div>

                <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-4 flex items-center justify-between">
                    <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">Snippet Progress</span>
                        <span className="text-2xl font-bold text-[#5899B5]">{stats.progressPct}%</span>
                        <span className="text-[11px] text-slate-400 block">{typed.length} / {targetCode.length} chars</span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                        <Keyboard size={20} />
                    </div>
                </div>
            </div>

            {/* Interactive Code Editor Typing Box */}
            <div
                onClick={() => textareaRef.current?.focus()}
                className="bg-slate-900 border-2 border-slate-800 rounded-3xl shadow-md overflow-hidden cursor-text"
            >
                {/* Fake IDE Window Bar */}
                <div className="bg-slate-800/90 px-5 py-3.5 border-b border-slate-700 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                            <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                            <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
                        </div>
                        <span className="text-xs font-mono font-semibold text-slate-200 flex items-center gap-1.5">
                            <Terminal size={13} className="text-sky-400" />
                            snippet_{snippetIndex + 1}{activeLangMeta?.ext} — {currentSnippet.title}
                        </span>
                    </div>
                    <span className="text-[11px] font-medium text-amber-300">
                        {getSarcasticVerdict(stats.wpm, stats.accuracy)}
                    </span>
                </div>

                {/* Progress Bar Strip */}
                <div className="w-full h-1.5 bg-slate-800">
                    <div
                        className="h-full bg-gradient-to-r from-[#5899B5] to-emerald-400 transition-all duration-150"
                        style={{ width: `${stats.progressPct}%` }}
                    />
                </div>

                {/* Code Overlay + Hidden Textarea Input */}
                <div className="relative p-6 sm:p-8">
                    <pre className="font-mono text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words select-none m-0">
                        {targetCode.split('').map((char, i) => {
                            const isTyped = i < typed.length;
                            const isCurrent = i === typed.length && !isCompleted;
                            const isCorrect = isTyped && typed[i] === char;
                            const isWrong = isTyped && typed[i] !== char;

                            let charClass = 'text-slate-500';
                            if (isCorrect) charClass = 'text-emerald-400';
                            if (isWrong) charClass = 'bg-rose-500/40 text-rose-200 underline decoration-rose-400';
                            if (isCurrent) charClass = 'bg-amber-400 text-slate-950 font-bold rounded-xs px-0.5';

                            if (char === '\n') {
                                return (
                                    <React.Fragment key={i}>
                                        {isCurrent && (
                                            <span className="bg-amber-400 text-slate-950 font-bold rounded-xs px-1 text-xs">
                                                ↵
                                            </span>
                                        )}
                                        {isWrong && (
                                            <span className="bg-rose-500/60 text-white rounded-xs px-1 text-xs">
                                                ↵
                                            </span>
                                        )}
                                        {'\n'}
                                    </React.Fragment>
                                );
                            }

                            return (
                                <span key={i} className={charClass}>
                                    {char}
                                </span>
                            );
                        })}
                    </pre>

                    {/* Transparent Textarea Capturing Keystrokes */}
                    <textarea
                        ref={textareaRef}
                        value={typed}
                        onChange={(e) => applyTypedChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isCompleted}
                        spellCheck={false}
                        autoCapitalize="off"
                        autoComplete="off"
                        autoCorrect="off"
                        aria-label="Code typing input"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-text resize-none"
                    />
                </div>

                {/* Bottom Helper Footer */}
                <div className="bg-slate-950/60 px-6 py-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                    <span>
                        💡 <strong>Pro Tip:</strong> Click anywhere inside the code terminal to focus. Pressing <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 font-mono">Enter</kbd> automatically indents the next line!
                    </span>
                    <span>
                        Snippet #{snippetIndex + 1} of {snippets.length} ({activeLangMeta?.label} • {activeLevelMeta?.label})
                    </span>
                </div>
            </div>

            {/* Completion Summary Banner */}
            {isCompleted && (
                <div className="bg-emerald-50/90 border border-emerald-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                        <TypeSpeedCartoonSvg variant="complete" className="w-36 h-24 shrink-0" />
                        <div className="space-y-1.5">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                                <CheckCircle2 size={14} /> Snippet Completed!
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">
                                {stats.wpm} WPM • {stats.accuracy}% Accuracy in {stats.seconds}s
                            </h3>
                            <p className="text-xs sm:text-sm font-medium text-emerald-900">
                                {getSarcasticVerdict(stats.wpm, stats.accuracy)}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        <button
                            type="button"
                            onClick={resetSession}
                            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold cursor-pointer transition flex items-center gap-1.5"
                        >
                            <RotateCcw size={14} /> Retry Same
                        </button>
                        <button
                            type="button"
                            onClick={() => setSnippetIndex((i) => (i + 1) % snippets.length)}
                            className="px-5 py-2.5 rounded-xl bg-[#5899B5] hover:bg-[#3D7690] text-white text-xs font-semibold cursor-pointer transition flex items-center gap-1.5 shadow-xs"
                        >
                            <Sparkles size={14} /> Next Snippet →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentTypeSpeedTab;

