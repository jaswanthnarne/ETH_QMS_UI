export const CPP_AND_JS_TRACKS = [
    /* =========================================================================
       4. C++ (CPP) (10 CHAPTERS)
       ========================================================================= */
    {
        slug: 'cpp',
        name: 'C++',
        fullName: 'Modern C++ (C++17/20), RAII & Standard Template Library (STL)',
        badge: 'C++',
        tagline: 'Zero-cost abstractions, deterministic RAII memory management, and the high-speed STL for competitive & systems engineering.',
        description:
            'Master Modern C++ from references, value categories, and RAII smart pointers to OOP virtual tables, templates, std::vector, ordered/unordered associative containers, and STL algorithms.',
        accentColor: '#4F46E5',
        secondaryColor: '#E0E7FF',
        fileExtension: '.cpp',
        paradigm: 'Multi-Paradigm (Object-Oriented, Generic Templates, Functional, Systems)',
        creatorInfo: 'Created by Bjarne Stroustrup • Zero-Overhead Principle & STL',
        sortOrder: 4,
        chapters: [
            {
                chapterNumber: 1,
                title: 'Modern C++ Foundations, References, Namespaces & Fast I/O',
                duration: '14 min read',
                difficulty: 'Beginner',
                summary: 'Master C++ lvalue references, const correctness, auto type deduction, namespaces, and high-throughput I/O streams.',
                overview: `C++ extends C with zero-overhead abstractions, strong compile-time type checking, and the Standard Template Library (STL). Unlike C pointers which can be NULL or reassigned, a C++ reference (int &ref = x;) is a non-null, non-reseatable alias to an existing variable. Passing large objects by const reference (const std::string &s) avoids expensive deep copies while guaranteeing the callee cannot mutate the caller's object.

In competitive programming and high-throughput benchmarks, C++ std::cin and std::cout synchronize with C stdio buffers by default. Calling std::ios::sync_with_stdio(false); std::cin.tie(nullptr); decouples the streams and speeds up console I/O by 5x–8x.`,
                keyPoints: [
                    'A reference (T &ref) must be initialized when declared and cannot be rebound to another object later.',
                    'Pass primitives (int, double) by value, and large objects (vector, string, map) by const T& when read-only.',
                    'Use "\\n" instead of std::endl in loops because std::endl forces a slow OS buffer flush on every line.',
                    'constexpr evaluates expressions and functions at compile time, embedding constants directly into machine code.'
                ],
                diagramTitle: 'C++ Compilation, Reference Aliasing & Fast Stream Pipeline',
                diagramSteps: [
                    'Source (main.cpp) + <iostream>',
                    'auto / constexpr Compile-Time Deduction',
                    'Pass-by-Const-Reference (const T&) Zero Copy',
                    'sync_with_stdio(false) Unbuffered Fast I/O'
                ],
                graphTitle: 'Console I/O Speed for 1,000,000 Integers in C++',
                graphMetricLabel: 'Execution Time in Milliseconds (Lower is faster)',
                graphData: [
                    { label: 'cin/cout + sync_with_stdio(false) + "\\n"', value: 14, displayValue: '75 ms', note: 'Fastest idiomatic C++ stream I/O' },
                    { label: 'C scanf / printf', value: 18, displayValue: '98 ms', note: 'Standard libc buffered I/O' },
                    { label: 'Default synced cin/cout + "\\n"', value: 52, displayValue: '310 ms', note: 'Dual buffer lock synchronization' },
                    { label: 'cout << x << std::endl in loop', value: 100, displayValue: '1,420 ms', note: '1M forced kernel buffer flushes!' }
                ],
                syntaxSummaryCode: `#include <iostream>
#include <string>

constexpr int square(int x) { return x * x; }

// Pass by reference to mutate; pass by const reference to read without copying
void clamp_and_log(int &val, int lo, int hi, const std::string &tag) {
    if (val < lo) val = lo;
    if (val > hi) val = hi;
    std::cout << "[" << tag << "] val=" << val << '\\n';
}

int main() {
    std::ios::sync_with_stdio(false);
    std::cin.tie(nullptr);

    constexpr int LIMIT = square(12); // Evaluated at compile time (144)
    int score = 180;
    clamp_and_log(score, 0, LIMIT, "Assessment");
    return 0;
}`,
                syntaxTable: [
                    { construct: 'Lvalue Reference', syntax: 'int &ref = x;', description: 'Creates a non-null alias to x with zero copy overhead.' },
                    { construct: 'Const Reference', syntax: 'void fn(const std::string &s)', description: 'Passes object without copying and prevents modification.' },
                    { construct: 'Compile-Time Const', syntax: 'constexpr int N = 1024;', description: 'Guarantees compile-time evaluation.' },
                    { construct: 'Fast I/O Setup', syntax: 'ios::sync_with_stdio(false); cin.tie(nullptr);', description: 'Disables C/C++ stream sync for 5x faster cin/cout.' }
                ],
                examples: [
                    {
                        title: 'Reference Aliasing vs Value Copy & Structured Bindings (C++17)',
                        code: `#include <iostream>
#include <tuple>

std::pair<int, int> min_max(int a, int b) {
    return (a < b) ? std::make_pair(a, b) : std::make_pair(b, a);
}

int main() {
    auto [lo, hi] = min_max(42, 17); // C++17 structured binding
    std::cout << "Min: " << lo << " | Max: " << hi << '\\n';
    return 0;
}`,
                        output: `Min: 17 | Max: 42`,
                        explanation: 'C++17 structured bindings auto [lo, hi] unpack pairs, tuples, and structs directly into named variables.'
                    }
                ],
                problems: [
                    {
                        title: 'Swap Three Variables Cyclically by Reference',
                        difficulty: 'Easy',
                        statement: 'Write a C++ function void rotateThree(int &a, int &b, int &c) that shifts values cyclically (a gets c, b gets a, c gets b) in O(1) without pointers.',
                        sampleInput: 'a = 10, b = 20, c = 30',
                        sampleOutput: 'a = 30, b = 10, c = 20',
                        constraints: 'Use C++ lvalue references',
                        hint: 'Save int temp = c; c = b; b = a; a = temp;'
                    },
                    {
                        title: 'Fast Range Sum Queries (1D Prefix Sums)',
                        difficulty: 'Easy',
                        statement: 'Given an array of N integers and Q range queries [L, R] (0-indexed), answer each query in O(1) time after O(N) preprocessing.',
                        sampleInput: 'nums = [2, 4, 1, 7, 3], Query [1, 3]',
                        sampleOutput: '12 (4 + 1 + 7)',
                        constraints: '1 <= N, Q <= 10^5',
                        hint: 'Build pref[i + 1] = pref[i] + nums[i] of size N + 1 using 64-bit long long, then answer [L, R] as pref[R + 1] - pref[L].'
                    }
                ]
            },
            {
                chapterNumber: 2,
                title: 'std::string, string_view, Streams & String Algorithms',
                duration: '14 min read',
                difficulty: 'Beginner',
                summary: 'Explore std::string Small String Optimization (SSO), zero-copy std::string_view, and stringstream tokenization.',
                overview: `Unlike C char arrays, C++ std::string manages its own heap buffer, tracks its length in O(1) via .size(), and automatically grows on append (+=). Modern standard libraries implement Small String Optimization (SSO): strings up to 15–22 characters are stored directly inside the stack-allocated std::string object itself without a single heap allocation!

C++17 introduced std::string_view—a lightweight non-owning (pointer, length) pair that slices substrings in O(1) time with zero memory allocation.`,
                keyPoints: [
                    'Small String Optimization (SSO) keeps short strings (<= 15 chars) entirely on the stack with 0 heap calls.',
                    's.substr(pos, len) on std::string allocates a new string copy; std::string_view::substr(pos, len) is O(1) and zero-copy.',
                    'Use std::getline(std::cin, line) to read a full line containing spaces.',
                    'std::stoi, std::stoll, and std::to_string convert between numbers and strings cleanly.'
                ],
                diagramTitle: 'Small String Optimization (SSO) & std::string_view Slicing',
                diagramSteps: [
                    'len <= 15 chars -> Stored Inline on Stack (SSO)',
                    'len > 15 chars -> Heap Buffer Allocated',
                    'std::string_view (const char* ptr, size_t len)',
                    'sv.substr(start, count) -> O(1) Pointer Adjustment'
                ],
                graphTitle: 'Substring Extraction Cost: std::string_view vs std::string::substr',
                graphMetricLabel: 'Time for 1,000,000 Substring Slices (ms)',
                graphData: [
                    { label: 'std::string_view::substr (Zero-Copy)', value: 4, displayValue: '2.1 ms (O(1))', note: 'Adjusts pointer & length only' },
                    { label: 'SSO Short std::string::substr (<=15B)', value: 24, displayValue: '14.0 ms', note: 'Stack buffer copy' },
                    { label: 'Heap std::string::substr (>32B)', value: 96, displayValue: '88.0 ms (O(K))', note: 'Heap new + memcpy + delete' }
                ],
                syntaxSummaryCode: `#include <iostream>
#include <string>
#include <string_view>
#include <sstream>

void inspect_token(std::string_view sv) {
    std::cout << "Token: " << sv << " (len=" << sv.size() << ")\\n";
}

int main() {
    std::string raw = "Python C Java CPP";
    std::stringstream ss(raw);
    std::string word;
    while (ss >> word) {
        inspect_token(word);
    }
    return 0;
}`,
                syntaxTable: [
                    { construct: 'Append / Push', syntax: 's += "abc"; s.push_back(\'x\');', description: 'Appends characters to mutable std::string in amortized O(1).' },
                    { construct: 'Substring', syntax: 's.substr(start_idx, length)', description: 'Extracts length characters starting at start_idx.' },
                    { construct: 'Find Substring', syntax: 'if (s.find("key") != std::string::npos)', description: 'Searches for substring and checks against npos sentinel.' },
                    { construct: 'Zero-Copy View', syntax: 'std::string_view sv = s;', description: 'Non-owning O(1) read-only view over contiguous characters.' }
                ],
                examples: [
                    {
                        title: 'Fast String Tokenization & Number Conversion',
                        code: `#include <iostream>
#include <string>
#include <sstream>

int sum_csv_numbers(const std::string &csv) {
    std::stringstream ss(csv);
    std::string item;
    int total = 0;
    while (std::getline(ss, item, ',')) {
        if (!item.empty()) total += std::stoi(item);
    }
    return total;
}

int main() {
    std::cout << "CSV Sum: " << sum_csv_numbers("10,25,35,50") << '\\n';
    return 0;
}`,
                        output: `CSV Sum: 120`,
                        explanation: 'std::getline with a custom delimiter "," splits CSV strings cleanly without manual index tracking.'
                    }
                ],
                problems: [
                    {
                        title: 'Valid Palindrome After Deleting at Most One Character',
                        difficulty: 'Easy',
                        statement: 'Given a string s, return true if the s can become a palindrome after deleting at most one character from it.',
                        sampleInput: 's = "abca"',
                        sampleOutput: 'true (delete "c" -> "aba")',
                        constraints: '1 <= s.size() <= 10^5',
                        hint: 'Use two pointers l=0, r=n-1; on the first mismatch s[l] != s[r], check if either s[l+1..r] or s[l..r-1] is a palindrome.'
                    },
                    {
                        title: 'Longest Common Prefix of String Array',
                        difficulty: 'Easy',
                        statement: 'Write a function to find the longest common prefix string amongst an array of strings.',
                        sampleInput: 'strs = ["flower","flow","flight"]',
                        sampleOutput: '"fl"',
                        constraints: '1 <= strs.size() <= 200',
                        hint: 'Sort the vector of strings lexicographically and compare only the first and last strings character by character.'
                    }
                ]
            },
            {
                chapterNumber: 3,
                title: 'STL Sequence Containers: vector, array, deque & list',
                duration: '16 min read',
                difficulty: 'Beginner',
                summary: 'Master std::vector memory growth, reserve() vs resize(), emplace_back(), std::array, and std::deque.',
                overview: `std::vector<T> is the default sequence container in C++. It stores elements contiguously on the heap, providing hardware cache locality and O(1) random access. When size() reaches capacity(), vector allocates a new buffer (typically 2x capacity) and moves existing elements over.

Calling v.reserve(N) pre-allocates capacity upfront so subsequent push_back / emplace_back calls never reallocate or invalidate iterators. Unlike push_back which constructs a temporary object and moves it, emplace_back(args...) forwards constructor arguments to construct the element directly in-place at the end of the buffer.`,
                keyPoints: [
                    'v.reserve(n) changes capacity() without changing size(); v.resize(n) changes size() and value-initializes new elements.',
                    'Reallocation in std::vector invalidates all existing pointers, references, and iterators into the vector!',
                    'std::deque<T> uses chunked fixed-size page blocks, giving O(1) push_front, push_back, and O(1) random access.',
                    'std::array<T, N> is a zero-overhead stack-allocated fixed-size array that does not decay to a pointer.'
                ],
                diagramTitle: 'std::vector Geometric Growth & In-Place emplace_back',
                diagramSteps: [
                    'Stack Control Block (begin*, end*, cap*)',
                    'v.reserve(N) Pre-Allocates Contiguous Heap',
                    'v.emplace_back(args...) In-Place Placement New',
                    'size == capacity -> 2x Geometric Reallocation'
                ],
                graphTitle: '1,000,000 Push Operations Across STL Containers',
                graphMetricLabel: 'Total Execution Time in Milliseconds',
                graphData: [
                    { label: 'std::vector with v.reserve(1M)', value: 8, displayValue: '4.2 ms', note: 'Single allocation + contiguous write' },
                    { label: 'std::vector default emplace_back', value: 18, displayValue: '9.8 ms', note: '~20 geometric doublings' },
                    { label: 'std::deque push_back / push_front', value: 24, displayValue: '13.5 ms', note: 'Chunked page table allocation' },
                    { label: 'std::list push_back (Doubly Linked)', value: 98, displayValue: '112.0 ms', note: '1M separate heap node allocations' }
                ],
                syntaxSummaryCode: `#include <iostream>
#include <vector>
#include <deque>

int main() {
    std::vector<std::pair<int, int>> pts;
    pts.reserve(100);               // Avoids reallocations
    pts.emplace_back(10, 20);       // Constructs pair in-place

    // 2D Matrix: R rows x C cols initialized to 0
    int R = 3, C = 4;
    std::vector<std::vector<int>> grid(R, std::vector<int>(C, 0));

    std::deque<int> dq = {20, 30};
    dq.push_front(10);              // O(1)
    dq.push_back(40);               // O(1)
    return 0;
}`,
                syntaxTable: [
                    { construct: 'Pre-Allocate Cap', syntax: 'v.reserve(n);', description: 'Reserves heap capacity for n elements without creating objects.' },
                    { construct: 'In-Place Append', syntax: 'v.emplace_back(arg1, arg2);', description: 'Constructs element directly at the end of the vector.' },
                    { construct: '2D Vector Init', syntax: 'vector<vector<int>> dp(R, vector<int>(C, -1));', description: 'Creates R x C grid initialized to -1.' },
                    { construct: 'Erase-Remove Idiom', syntax: 'std::erase(v, target_val); // C++20', description: 'Removes all occurrences of target_val in O(N) time.' }
                ],
                examples: [
                    {
                        title: 'Monotonic Stack Next Greater Element with std::vector',
                        code: `#include <iostream>
#include <vector>

std::vector<int> next_greater(const std::vector<int> &nums) {
    int n = (int)nums.size();
    std::vector<int> ans(n, -1);
    std::vector<int> st; // Using vector as fast contiguous LIFO stack
    for (int i = 0; i < n; i++) {
        while (!st.empty() && nums[st.back()] < nums[i]) {
            ans[st.back()] = nums[i];
            st.pop_back();
        }
        st.push_back(i);
    }
    return ans;
}

int main() {
    for (int x : next_greater({2, 1, 2, 4, 3})) std::cout << x << ' ';
    std::cout << '\\n';
    return 0;
}`,
                        output: `4 2 4 -1 -1`,
                        explanation: 'Using std::vector as a stack (push_back / back / pop_back) avoids chunk indirection and runs in strict O(N) time.'
                    }
                ],
                problems: [
                    {
                        title: 'Trapping Rain Water (Two-Pointer / Vector)',
                        difficulty: 'Hard',
                        statement: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining in O(N) time and O(1) space.',
                        sampleInput: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
                        sampleOutput: '6',
                        constraints: '1 <= height.size() <= 2 * 10^4',
                        hint: 'Maintain left, right pointers and leftMax, rightMax; always advance the side with the smaller current boundary.'
                    },
                    {
                        title: 'Pascal Triangle Generator Using 2D std::vector',
                        difficulty: 'Easy',
                        statement: 'Given an integer numRows, return the first numRows of Pascal triangle as a vector<vector<int>>.',
                        sampleInput: 'numRows = 4',
                        sampleOutput: '[[1],[1,1],[1,2,1],[1,3,3,1]]',
                        constraints: '1 <= numRows <= 30',
                        hint: 'Resize row i to i + 1 initialized with 1s, and set row[i][j] = row[i-1][j-1] + row[i-1][j] for 1 <= j < i.'
                    }
                ]
            },
            {
                chapterNumber: 4,
                title: 'STL Associative & Unordered Containers: map, set, priority_queue',
                duration: '16 min read',
                difficulty: 'Intermediate',
                summary: 'Compare Red-Black Tree containers (map, set, multiset) against Hash Table containers (unordered_map, unordered_set) and heaps.',
                overview: `C++ STL offers two families of key-based containers:
1. Ordered Associative Containers (std::map, std::set, std::multiset): Implemented as balanced Red-Black Trees. Keys are always kept sorted in ascending order, supporting O(log N) insert, erase, find, lower_bound, and upper_bound.
2. Unordered Hash Containers (std::unordered_map, std::unordered_set): Implemented as open-chained hash tables providing O(1) average lookup and insertion.

Additionally, std::priority_queue<T> is a binary max-heap by default (largest element at .top()). To create a min-heap in C++, declare std::priority_queue<T, std::vector<T>, std::greater<T>>.`,
                keyPoints: [
                    'Watch out: accessing mp[key] on a std::map or std::unordered_map silently inserts a default-constructed key if it was missing! Use mp.find(key) or mp.count(key) for read-only checks.',
                    'Always call member method s.lower_bound(x) on std::set / std::map (O(log N)), never std::lower_bound(s.begin(), s.end(), x) which is O(N) on non-random-access tree iterators!',
                    'In multiset, ms.erase(val) deletes ALL copies of val; use ms.erase(ms.find(val)) to delete only a single instance.',
                    'std::priority_queue is a max-heap by default; pass std::greater<> for a min-heap.'
                ],
                diagramTitle: 'Red-Black Tree (std::map) vs Hash Table (unordered_map)',
                diagramSteps: [
                    'std::map / std::set -> Red-Black Tree O(log N) Sorted + lower_bound',
                    'std::unordered_map -> Hash Buckets O(1) Avg Lookup',
                    'std::multiset -> Duplicate Keys + erase(find(x))',
                    'std::priority_queue -> Max-Heap / Min-Heap O(log N)'
                ],
                graphTitle: 'Lookup & Range Query Performance Across STL Containers',
                graphMetricLabel: 'Operation Latency (Nanoseconds per query)',
                graphData: [
                    { label: 'unordered_map.find(k) (Reserved)', value: 14, displayValue: '28 ns (O(1))', note: 'Direct hash bucket hit' },
                    { label: 'priority_queue.top() / push()', value: 22, displayValue: '45 ns (O(1) / O(log N))', note: 'Contiguous vector heap' },
                    { label: 'std::map / std::set.lower_bound(k)', value: 58, displayValue: '165 ns (O(log N))', note: 'Red-Black tree traversal' },
                    { label: 'std::lower_bound(set.begin(), set.end())', value: 100, displayValue: '14,500 ns (O(N) TRAP!)', note: 'Bidirectional iterator stepping' }
                ],
                syntaxSummaryCode: `#include <iostream>
#include <map>
#include <unordered_map>
#include <set>
#include <queue>

int main() {
    // 1. O(1) Hash Map frequency counter
    std::unordered_map<std::string, int> freq;
    freq.reserve(64);
    freq["cpp"]++;

    // 2. Ordered Set with O(log N) lower_bound
    std::set<int> ordered = {10, 20, 30, 40};
    auto it = ordered.lower_bound(25); // Points to 30

    // 3. Min-Heap Priority Queue
    using P = std::pair<int, int>;
    std::priority_queue<P, std::vector<P>, std::greater<P>> min_pq;
    min_pq.emplace(5, 101);
    return 0;
}`,
                syntaxTable: [
                    { construct: 'Safe Lookup', syntax: 'if (auto it = mp.find(k); it != mp.end())', description: 'Checks key existence without inserting default entry.' },
                    { construct: 'Tree Lower Bound', syntax: 'auto it = st.lower_bound(x);', description: 'First element >= x in O(log N) via Red-Black Tree.' },
                    { construct: 'Single Multiset Erase', syntax: 'ms.erase(ms.find(x));', description: 'Erases only one occurrence of x from a std::multiset.' },
                    { construct: 'Min-Heap Declaration', syntax: 'priority_queue<int, vector<int>, greater<int>> pq;', description: 'Configures priority_queue to pop smallest element first.' }
                ],
                examples: [
                    {
                        title: 'Sliding Window Median / Dynamic Min-Max with std::multiset',
                        code: `#include <iostream>
#include <set>
#include <vector>

int main() {
    std::multiset<int> window = {10, 30, 20, 20};
    // Remove only one instance of 20
    window.erase(window.find(20));

    std::cout << "Min: " << *window.begin()
              << " | Max: " << *window.rbegin()
              << " | Count(20): " << window.count(20) << '\\n';
    return 0;
}`,
                        output: `Min: 10 | Max: 30 | Count(20): 1`,
                        explanation: '*window.begin() and *window.rbegin() access the minimum and maximum of a dynamic multiset in O(1) time.'
                    }
                ],
                problems: [
                    {
                        title: 'Find K Closest Elements Using Priority Queue or Binary Search',
                        difficulty: 'Medium',
                        statement: 'Given a sorted integer array arr, two integers k and x, return the k closest integers to x in the array sorted in ascending order.',
                        sampleInput: 'arr = [1,2,3,4,5], k = 4, x = 3',
                        sampleOutput: '[1,2,3,4]',
                        constraints: '1 <= k <= arr.size() <= 10^4',
                        hint: 'Binary search the starting index left in [0, n - k] by comparing x - arr[mid] with arr[mid + k] - x.'
                    },
                    {
                        title: 'Continuous Median Finder Using Two Heaps',
                        difficulty: 'Hard',
                        statement: 'Design a MedianFinder class that supports addNum(int num) in O(log N) and findMedian() in O(1) using a max-heap for the lower half and a min-heap for the upper half.',
                        sampleInput: 'addNum(1), addNum(2), findMedian(), addNum(3), findMedian()',
                        sampleOutput: '1.5, 2.0',
                        constraints: 'Up to 5 * 10^4 calls',
                        hint: 'Keep maxHeap.size() == minHeap.size() or maxHeap.size() == minHeap.size() + 1.'
                    }
                ]
            },
            {
                chapterNumber: 5,
                title: 'Pointers, RAII, Smart Pointers & Move Semantics',
                duration: '16 min read',
                difficulty: 'Intermediate',
                summary: 'Eliminate memory leaks deterministically with RAII, std::unique_ptr, std::shared_ptr, std::weak_ptr, and rvalue std::move.',
                overview: `The defining idiom of Modern C++ is RAII (Resource Acquisition Is Initialization): resources (heap memory, file handles, mutex locks) are acquired in an object's constructor and deterministically released in its destructor (~T()) the instant the object goes out of scope—even if an exception is thrown.

Instead of manual new and delete, Modern C++ uses Smart Pointers (<memory>):
- std::unique_ptr<T>: Exclusive ownership with zero size or speed overhead over a raw pointer. Cannot be copied, only moved via std::move().
- std::shared_ptr<T>: Thread-safe atomic reference-counted shared ownership.
- std::weak_ptr<T>: Non-owning observer that breaks cyclic shared_ptr references.`,
                keyPoints: [
                    'Always allocate with std::make_unique<T>(args...) and std::make_shared<T>(args...) instead of raw new.',
                    'std::move(obj) does not move bytes by itself—it casts an lvalue to an rvalue reference (T&&) so the Move Constructor can steal internal pointers in O(1).',
                    'Rule of Zero / Five: If a class uses STL containers and smart pointers, it needs zero custom destructors/copy/move operators.',
                    'Use std::weak_ptr on parent/back pointers in graphs or doubly linked structures to prevent reference-count memory leaks.'
                ],
                diagramTitle: 'RAII Smart Pointer Lifecycle & Rvalue Move Semantics',
                diagramSteps: [
                    'auto p = std::make_unique<Node>(42)',
                    'Exclusive Ownership (sizeof == 8B)',
                    'p2 = std::move(p) -> O(1) Pointer Steal',
                    'Scope Exit -> ~unique_ptr() Auto Deletes Heap'
                ],
                graphTitle: 'Object Transfer Cost: Deep Copy vs Rvalue std::move (10MB Vector)',
                graphMetricLabel: 'Transfer Time in Microseconds',
                graphData: [
                    { label: 'Rvalue Move Constructor (std::move)', value: 2, displayValue: '0.01 µs (O(1))', note: 'Swaps 3 internal pointers (24 bytes)' },
                    { label: 'std::unique_ptr Ownership Transfer', value: 2, displayValue: '0.01 µs (O(1))', note: 'Zero-cost pointer handoff' },
                    { label: 'std::shared_ptr Copy (Atomic RefCount)', value: 12, displayValue: '0.09 µs (O(1))', note: 'Atomic lock increment' },
                    { label: 'Lvalue Deep Copy Constructor', value: 100, displayValue: '4,200 µs (O(N))', note: 'Allocates & copies 10MB buffer' }
                ],
                syntaxSummaryCode: `#include <iostream>
#include <memory>
#include <vector>

struct Resource {
    int id;
    explicit Resource(int id) : id(id) { std::cout << "Acquired #" << id << '\\n'; }
    ~Resource() { std::cout << "Released #" << id << '\\n'; }
};

int main() {
    // 1. Exclusive ownership (Zero overhead)
    auto ptr1 = std::make_unique<Resource>(101);

    // 2. Transfer ownership via std::move
    std::unique_ptr<Resource> ptr2 = std::move(ptr1); // ptr1 is now nullptr

    // 3. Shared ownership
    auto sp1 = std::make_shared<Resource>(202);
    std::weak_ptr<Resource> wp = sp1;                 // Non-owning observer
    return 0; // Destructors fire deterministically in reverse order!
}`,
                syntaxTable: [
                    { construct: 'Unique Pointer', syntax: 'auto p = std::make_unique<T>(args...);', description: 'Creates single-owner smart pointer with automatic destructor cleanup.' },
                    { construct: 'Shared Pointer', syntax: 'auto s = std::make_shared<T>(args...);', description: 'Creates reference-counted smart pointer in a single allocation.' },
                    { construct: 'Move Cast', syntax: 'sink = std::move(source);', description: 'Casts source to rvalue (T&&) to transfer ownership in O(1).' },
                    { construct: 'Rule of Five Delete', syntax: 'Foo(const Foo&) = delete;', description: 'Explicitly forbids copying of a resource-owning class.' }
                ],
                examples: [
                    {
                        title: 'Zero-Copy Vector Move & Deterministic RAII Scope Exit',
                        code: `#include <iostream>
#include <memory>
#include <vector>

int main() {
    std::vector<int> source = {10, 20, 30, 40, 50};
    const int *orig_addr = source.data();

    // O(1) move steals the underlying heap buffer pointer
    std::vector<int> dest = std::move(source);

    std::cout << "Buffer address preserved? " << (dest.data() == orig_addr ? "YES" : "NO") << '\\n';
    std::cout << "source size after move: " << source.size() << " | dest size: " << dest.size() << '\\n';
    return 0;
}`,
                        output: `Buffer address preserved? YES
source size after move: 0 | dest size: 5`,
                        explanation: 'Moving a std::vector transfers its internal data pointer directly to dest without copying a single integer.'
                    }
                ],
                problems: [
                    {
                        title: 'Implement a Minimal RAII UniquePtr<T> Wrapper',
                        difficulty: 'Medium',
                        statement: 'Implement a template class UniquePtr<T> supporting explicit construction, destructor delete, deleted copy constructor/assignment, move constructor/assignment, and release()/get().',
                        sampleInput: 'UniquePtr<int> p1(new int(42)); UniquePtr<int> p2 = std::move(p1);',
                        sampleOutput: 'p1.get() == nullptr, *p2 == 42, freed once on scope exit',
                        constraints: 'Zero memory leaks or double frees',
                        hint: 'In the move assignment operator, guard against self-assignment (if (this != &other)), delete current ptr_, steal other.ptr_, and set other.ptr_ = nullptr.'
                    },
                    {
                        title: 'Binary Tree Maximum Path Sum Using Smart Pointers',
                        difficulty: 'Hard',
                        statement: 'Given the root of a binary tree with positive and negative node values, find the maximum path sum of any non-empty path.',
                        sampleInput: 'root = [-10, 9, 20, null, null, 15, 7]',
                        sampleOutput: '42 (15 + 20 + 7)',
                        constraints: 'Nodes <= 3 * 10^4',
                        hint: 'At each node, compute leftGain = max(0, dfs(node->left)) and rightGain = max(0, dfs(node->right)), update globalMax = max(globalMax, node->val + leftGain + rightGain), and return node->val + max(leftGain, rightGain).'
                    }
                ]
            },
            {
                chapterNumber: 6,
                title: 'Object-Oriented C++: Classes, Operator Overloading & Initialization',
                duration: '15 min read',
                difficulty: 'Intermediate',
                summary: 'Master member initializer lists, const member functions, explicit constructors, and custom operator overloading.',
                overview: `In C++, class and struct are identical except for default access visibility (class defaults to private, struct defaults to public). Constructors should always initialize members using the Member Initializer List (: a_(a), b_(b)) rather than assigning inside the constructor body, because members are constructed before the body begins.

C++ allows custom types (such as Complex numbers, Matrices, BigInts, or Vectors) to overload arithmetic and comparison operators (operator+, operator<, operator==, operator<<, operator()), enabling mathematical expressions that compile down to inline instructions.`,
                keyPoints: [
                    'Always mark single-argument constructors explicit to prevent unintended implicit type conversions.',
                    'Mark every getter or read-only method const (int size() const) so it can be called on const references.',
                    'Member variables are initialized in the order they are declared in the class, NOT the order listed in the initializer list!',
                    'Overload operator< (or C++20 operator<=> spaceship) to allow custom structs to be stored in std::set or sorted.'
                ],
                diagramTitle: 'C++ Constructor Member Initializer & Operator Dispatch',
                diagramSteps: [
                    'explicit Constructor(: member_(val))',
                    'Direct In-Place Member Initialization',
                    'const Member Methods (Read-Only Guarantee)',
                    'Overloaded operator+ / operator< / operator<<'
                ],
                graphTitle: 'Initialization Efficiency: Initializer List vs Body Assignment',
                graphMetricLabel: 'Constructor Operations Performed',
                graphData: [
                    { label: 'Member Initializer List : s_(str)', value: 45, displayValue: '1 Direct Construct', note: 'Constructs member directly once' },
                    { label: 'Constructor Body Assignment { s_ = str; }', value: 95, displayValue: '2 Ops (Default + Reassign)', note: 'Constructs empty, then overwrites' }
                ],
                syntaxSummaryCode: `#include <iostream>

class Vector2D {
    double x_, y_;
public:
    explicit Vector2D(double x = 0.0, double y = 0.0) : x_(x), y_(y) {}

    double x() const { return x_; }
    double y() const { return y_; }

    Vector2D operator+(const Vector2D &rhs) const {
        return Vector2D(x_ + rhs.x_, y_ + rhs.y_);
    }

    bool operator<(const Vector2D &rhs) const {
        return (x_ != rhs.x_) ? (x_ < rhs.x_) : (y_ < rhs.y_);
    }

    friend std::ostream &operator<<(std::ostream &os, const Vector2D &v) {
        return os << "(" << v.x_ << ", " << v.y_ << ")";
    }
};`,
                syntaxTable: [
                    { construct: 'Initializer List', syntax: 'Foo(int a) : a_(a) {}', description: 'Initializes member variables directly before constructor body runs.' },
                    { construct: 'Explicit Guard', syntax: 'explicit Buffer(size_t cap);', description: 'Prevents accidental implicit conversion from integer to Buffer.' },
                    { construct: 'Const Method', syntax: 'int getScore() const;', description: 'Promises method will not mutate any non-mutable instance field.' },
                    { construct: 'Stream Operator', syntax: 'friend ostream& operator<<(ostream& os, const T& obj)', description: 'Enables natural std::cout << obj printing.' }
                ],
                examples: [
                    {
                        title: 'Modular Integer Arithmetic Class with Operator Overloading',
                        code: `#include <iostream>

struct ModInt {
    static constexpr long long MOD = 1'000'000'007LL;
    long long v;
    ModInt(long long val = 0) : v((val % MOD + MOD) % MOD) {}

    ModInt operator+(const ModInt &o) const { return ModInt(v + o.v); }
    ModInt operator*(const ModInt &o) const { return ModInt(v * o.v); }
};

int main() {
    ModInt a(900'000'000), b(250'000'005);
    ModInt sum = a + b;
    ModInt prod = a * b;
    std::cout << "Mod Sum: " << sum.v << " | Mod Prod: " << prod.v << '\\n';
    return 0;
}`,
                        output: `Mod Sum: 149999998 | Mod Prod: 499999426`,
                        explanation: 'Overloading + and * on ModInt keeps number-theory DP and combinatorics code clean and overflow-free.'
                    }
                ],
                problems: [
                    {
                        title: 'Overload Matrix Multiplication Operator (operator*)',
                        difficulty: 'Medium',
                        statement: 'Create a 2x2 Matrix struct in C++ with overloaded operator* and compute the N-th Fibonacci number in O(log N) time using binary matrix exponentiation.',
                        sampleInput: 'N = 10',
                        sampleOutput: '55',
                        constraints: '0 <= N <= 10^18 (modulo 10^9+7)',
                        hint: 'Raise [[1, 1], [1, 0]] to the N-th power using binary exponentiation and operator*.'
                    },
                    {
                        title: 'Custom Interval Struct with Overlap Merge & Sorting',
                        difficulty: 'Easy',
                        statement: 'Define an Interval struct with start, end and overloaded operator< to sort intervals and merge overlapping ranges.',
                        sampleInput: '[[1,4], [2,5], [7,9]]',
                        sampleOutput: '[[1,5], [7,9]]',
                        constraints: '1 <= N <= 10^5',
                        hint: 'Sort using std::sort(v.begin(), v.end()) which automatically invokes Interval::operator<.'
                    }
                ]
            },
            {
                chapterNumber: 7,
                title: 'Inheritance, Virtual Functions, vtable & Runtime Polymorphism',
                duration: '15 min read',
                difficulty: 'Intermediate',
                summary: 'Understand how C++ implements dynamic dispatch via vptr and vtable, pure virtual abstract interfaces, and virtual destructors.',
                overview: `Unlike Java where all methods are virtual by default, C++ follows the "don't pay for what you don't use" philosophy: member functions use static compile-time binding unless explicitly marked virtual. When a class declares at least one virtual function, the compiler inserts a hidden 8-byte Virtual Table Pointer (vptr) into each instance pointing to a per-class Virtual Method Table (vtable) of function pointers.

Crucial Rule: Any base class intended to be used polymorphically MUST declare a virtual destructor (virtual ~Base() = default;). Without a virtual destructor, calling delete basePtr; on a derived object invokes only ~Base(), leaking all resources owned by the Derived subclass!`,
                keyPoints: [
                    'Always declare virtual ~Base() = default; in any base class with virtual methods.',
                    'Always annotate overridden methods in derived classes with the override keyword so the compiler catches signature mismatches.',
                    'A pure virtual function (virtual double area() const = 0;) makes a class Abstract and uninstantiable.',
                    'Use virtual inheritance (class D : virtual public Base) to solve the Diamond Inheritance ambiguity.'
                ],
                diagramTitle: 'C++ Object vptr & Per-Class vtable Dispatch Architecture',
                diagramSteps: [
                    'Heap Object Instance [vptr | member fields]',
                    'vptr Points to Class vtable in Read-Only Memory',
                    'basePtr->render() Looks Up Slot in vtable',
                    'Jumps to Derived::render() Implementation',
                    'delete basePtr -> Virtual ~Derived() then ~Base()'
                ],
                graphTitle: 'Function Call Overhead: Inlined Non-Virtual vs Virtual vtable Call',
                graphMetricLabel: 'CPU Cycles Per Call',
                graphData: [
                    { label: 'Inlined Non-Virtual / Template Method', value: 5, displayValue: '0–1 cycle', note: 'Inlined directly at call site' },
                    { label: 'Direct Static Non-Virtual Call', value: 25, displayValue: '3 cycles', note: 'Direct CALL address' },
                    { label: 'Virtual Method Call (vptr -> vtable)', value: 48, displayValue: '7 cycles', note: 'Pointer indirection + indirect jump' },
                    { label: 'dynamic_cast<Derived*>(basePtr) RTTI', value: 95, displayValue: '35+ cycles', note: 'Runtime type info hierarchy walk' }
                ],
                syntaxSummaryCode: `#include <iostream>
#include <memory>
#include <vector>

class Shape {
public:
    virtual ~Shape() = default;                 // Mandatory virtual destructor!
    virtual double area() const = 0;            // Pure virtual interface method
};

class Circle final : public Shape {
    double r_;
public:
    explicit Circle(double r) : r_(r) {}
    double area() const override { return 3.14159265 * r_ * r_; }
};`,
                syntaxTable: [
                    { construct: 'Virtual Destructor', syntax: 'virtual ~Base() = default;', description: 'Ensures derived destructor runs when deleting via Base*.' },
                    { construct: 'Pure Virtual', syntax: 'virtual void run() = 0;', description: 'Declares abstract interface method with no base requirement.' },
                    { construct: 'Override Specifier', syntax: 'void run() override;', description: 'Compile-time verification that method overrides a virtual base method.' },
                    { construct: 'Final Specifier', syntax: 'class Leaf final : public Base', description: 'Prevents further subclassing (and enables devirtualization).' }
                ],
                examples: [
                    {
                        title: 'Polymorphic Shape Pipeline with std::unique_ptr<Shape>',
                        code: `#include <iostream>
#include <memory>
#include <vector>

struct Codec {
    virtual ~Codec() = default;
    virtual std::string encode(const std::string &s) const = 0;
};

struct UpperCodec : Codec {
    std::string encode(const std::string &s) const override {
        std::string out = s;
        for (char &c : out) c = (char)std::toupper((unsigned char)c);
        return out;
    }
};

int main() {
    std::unique_ptr<Codec> c = std::make_unique<UpperCodec>();
    std::cout << "Encoded: " << c->encode("ethnotech") << '\\n';
    return 0;
}`,
                        output: `Encoded: ETHNOTECH`,
                        explanation: 'c->encode() dispatches dynamically through UpperCodec vtable and cleans up deterministically via virtual ~Codec().'
                    }
                ],
                problems: [
                    {
                        title: 'Diagnose & Fix Missing Virtual Destructor Memory Leak',
                        difficulty: 'Easy',
                        statement: 'A Base class has a non-virtual destructor ~Base(), while Derived allocates an int* buffer in Derived() and frees it in ~Derived(). Explain what happens on Base *p = new Derived(); delete p; and write the fix.',
                        sampleInput: 'Base *p = new Derived(); delete p;',
                        sampleOutput: '~Derived() runs followed by ~Base() (0 bytes leaked)',
                        constraints: 'Standard C++17',
                        hint: 'Mark ~Base() as virtual ~Base() = default; so delete p looks up the derived destructor in the vtable.'
                    },
                    {
                        title: 'Polymorphic Command Pattern Undo/Redo Stack',
                        difficulty: 'Medium',
                        statement: 'Create an abstract Command base class with virtual void execute() = 0 and virtual void undo() = 0, and implement AppendTextCommand to support multi-step undo on a document buffer.',
                        sampleInput: 'Execute("Hello "), Execute("World"), Undo()',
                        sampleOutput: '"Hello "',
                        constraints: 'Use vector<unique_ptr<Command>>',
                        hint: 'Push executed commands onto an undo stack and call cmd->undo() when popping.'
                    }
                ]
            },
            {
                chapterNumber: 8,
                title: 'Templates, Generic Programming, Lambdas & constexpr',
                duration: '15 min read',
                difficulty: 'Intermediate',
                summary: 'Write zero-overhead generic functions and classes with C++ templates, variadic fold expressions, and stateful lambda closures.',
                overview: `C++ Templates are Turing-complete compile-time code generators. When you call a function template max_val<int>(a, b), the compiler instantiates a strongly-typed machine-code specialization for int with zero runtime boxing or vtable indirection.

Modern C++ pairs templates with Lambda Expressions ([capture](params) -> ret { body }). The capture clause controls how surrounding variables enter the closure: [=] captures by value, [&] captures by reference, and [x = std::move(ptr)] uses generalized move capture.`,
                keyPoints: [
                    'Templates are instantiated at compile time (Monomorphization), enabling full compiler inlining.',
                    'if constexpr (condition) evaluates branches at compile time and discards untaken branches.',
                    'Lambda capture [&] captures local variables by reference—never return a [&] lambda that outlives the current stack frame!',
                    'Generic lambdas [](const auto &a, const auto &b) { return a < b; } work seamlessly with any comparable type.'
                ],
                diagramTitle: 'Template Monomorphization & Lambda Closure Generation',
                diagramSteps: [
                    'Template Definition template<typename T>',
                    'Call Sites: fn<int>(), fn<double>()',
                    'Compiler Generates Specialized Machine Code',
                    'Lambda [captures](params) -> Anonymous Functor Struct',
                    'Full Inlining by Optimizer (-O2 / -O3)'
                ],
                graphTitle: 'Sorting 1M Elements: Inlined Lambda vs std::function vs C qsort',
                graphMetricLabel: 'Execution Time in Milliseconds (Lower is faster)',
                graphData: [
                    { label: 'std::sort + Inlined Lambda Comparator', value: 18, displayValue: '42 ms', note: 'Comparator inlined into Introsort' },
                    { label: 'std::sort + Function Pointer', value: 42, displayValue: '88 ms', note: 'Indirect call per comparison' },
                    { label: 'C qsort(void*, cmp) Callback', value: 78, displayValue: '154 ms', note: 'Type-erased void* pointer casts' }
                ],
                syntaxSummaryCode: `#include <iostream>
#include <vector>
#include <algorithm>

// Variadic Fold Expression Template (C++17)
template <typename... Args>
auto sum_all(Args... args) {
    return (args + ... + 0);
}

int main() {
    std::cout << "Variadic sum: " << sum_all(10, 20, 30, 40) << '\\n';

    int threshold = 25;
    std::vector<int> nums = {12, 45, 8, 31, 19};

    // Stateful lambda capturing threshold by value
    int count = (int)std::count_if(nums.begin(), nums.end(),
        [threshold](int x) { return x > threshold; });

    std::cout << "Count > 25: " << count << '\\n';
    return 0;
}`,
                syntaxTable: [
                    { construct: 'Function Template', syntax: 'template <typename T> T myMax(T a, T b)', description: 'Generates type-specialized function at compile time.' },
                    { construct: 'Fold Expression', syntax: '(args + ...)', description: 'Expands variadic parameter pack with a binary operator (C++17).' },
                    { construct: 'Lambda By-Value', syntax: '[x, y](int a) { return a + x + y; }', description: 'Captures copies of x and y into the closure struct.' },
                    { construct: 'Lambda By-Ref', syntax: '[&total](int a) { total += a; }', description: 'Captures reference to total so lambda can mutate it.' }
                ],
                examples: [
                    {
                        title: 'Recursive Lambda DFS Using Self-Reference Parameter',
                        code: `#include <iostream>
#include <vector>

int main() {
    std::vector<std::vector<int>> tree = {{1, 2}, {3}, {}, {}};

    // Fast recursive lambda without std::function heap overhead
    auto dfs = [&](auto &&self, int u) -> int {
        int subtree_size = 1;
        for (int v : tree[u]) {
            subtree_size += self(self, v);
        }
        return subtree_size;
    };

    std::cout << "Total nodes from root 0: " << dfs(dfs, 0) << '\\n';
    return 0;
}`,
                        output: `Total nodes from root 0: 4`,
                        explanation: 'Passing auto &&self to a generic lambda enables recursion with zero std::function heap allocation.'
                    }
                ],
                problems: [
                    {
                        title: 'Custom Sort by Absolute Distance from Target Using Lambda',
                        difficulty: 'Easy',
                        statement: 'Given an integer array nums and a target integer x, sort nums in ascending order of |nums[i] - x|, breaking ties by smaller value first.',
                        sampleInput: 'nums = [10, 5, 3, 9, 2], x = 7',
                        sampleOutput: '[5, 9, 10, 3, 2]',
                        constraints: '1 <= nums.size() <= 10^5',
                        hint: 'Pass [x](int a, int b) { int da = abs(a - x), db = abs(b - x); return da != db ? da < db : a < b; } to std::sort.'
                    },
                    {
                        title: 'Compile-Time Factorial & Binomial Coefficient via constexpr',
                        difficulty: 'Easy',
                        statement: 'Write a constexpr function long long nCr(int n, int r) that computes combinations at compile time.',
                        sampleInput: 'nCr(10, 3)',
                        sampleOutput: '120',
                        constraints: '0 <= r <= n <= 30',
                        hint: 'Multiply res = res * (n - i + 1) / i for i from 1 to r inside a constexpr function.'
                    }
                ]
            },
            {
                chapterNumber: 9,
                title: 'STL Algorithms: Introsort, Binary Search, Bitsets & Permutations',
                duration: '16 min read',
                difficulty: 'Advanced',
                summary: 'Leverage <algorithm> and <numeric> power tools: std::sort (Introsort), nth_element, lower_bound, accumulate, and std::bitset.',
                overview: `The C++ <algorithm> and <numeric> headers provide battle-tested algorithms that operate on iterator ranges [first, last):
- std::sort: Uses Introsort (a hybrid of Quicksort, Heapsort when recursion depth exceeds 2*log2(N), and Insertion Sort for partitions < 16), guaranteeing strict O(N log N) worst-case time!
- std::nth_element: Uses Introselect (Quickselect) to place the k-th smallest element in its exact sorted position in O(N) average time.
- std::lower_bound / std::upper_bound: Binary search in O(log N) on sorted random-access ranges.
- std::bitset<N>: Packs N bits into 64-bit machine words, accelerating boolean set operations by 64x.`,
                keyPoints: [
                    'std::sort comparator MUST implement a Strict Weak Ordering: comp(x, x) must ALWAYS return false (never use <= or >=)!',
                    'Count elements equal to x in a sorted vector in O(log N): std::upper_bound(...) - std::lower_bound(...).',
                    'Remove duplicates from a vector: sort(v.begin(), v.end()); v.erase(unique(v.begin(), v.end()), v.end());',
                    'Always pass 0LL (not 0) to std::accumulate(v.begin(), v.end(), 0LL) when summing into a 64-bit integer!'
                ],
                diagramTitle: 'STL Introsort & Coordinate Compression Pipeline',
                diagramSteps: [
                    'std::sort (Quicksort -> Heapsort Fallback -> Insertion Sort)',
                    'std::unique Moves Duplicates to Tail',
                    'v.erase(new_end, v.end()) Shrinks Logical Size',
                    'std::lower_bound(v.begin(), v.end(), x) - v.begin() Rank'
                ],
                graphTitle: 'Finding K-th Element in 1,000,000 Integers: nth_element vs Full Sort',
                graphMetricLabel: 'Execution Time in Milliseconds',
                graphData: [
                    { label: 'std::nth_element (O(N) Quickselect)', value: 18, displayValue: '7.5 ms (O(N))', note: 'Partitions only active side' },
                    { label: 'std::partial_sort (Top-100)', value: 26, displayValue: '11.2 ms (O(N log K))', note: 'Heap-selects top K sorted' },
                    { label: 'std::sort (Full Introsort)', value: 92, displayValue: '42.0 ms (O(N log N))', note: 'Sorts all 1M elements' }
                ],
                syntaxSummaryCode: `#include <iostream>
#include <vector>
#include <algorithm>
#include <numeric>

int main() {
    std::vector<int> v = {40, 10, 20, 20, 30, 10};

    // 1. Sort + Deduplicate (Coordinate Compression Idiom)
    std::sort(v.begin(), v.end());
    v.erase(std::unique(v.begin(), v.end()), v.end()); // {10, 20, 30, 40}

    // 2. O(log N) Binary Search Index
    int rank = (int)(std::lower_bound(v.begin(), v.end(), 30) - v.begin()); // 2

    // 3. 64-Bit Safe Sum
    long long total = std::accumulate(v.begin(), v.end(), 0LL);
    std::cout << "Unique count: " << v.size() << " | Rank(30): " << rank << " | Sum: " << total << '\\n';
    return 0;
}`,
                syntaxTable: [
                    { construct: 'Deduplicate Vector', syntax: 'v.erase(unique(v.begin(), v.end()), v.end());', description: 'Removes consecutive duplicates from a sorted vector.' },
                    { construct: 'Linear Quickselect', syntax: 'nth_element(v.begin(), v.begin() + k, v.end());', description: 'Places k-th smallest element at index k in O(N) average time.' },
                    { construct: '64-Bit Accumulate', syntax: 'accumulate(v.begin(), v.end(), 0LL)', description: 'Sums range using 64-bit long long accumulator.' },
                    { construct: 'Next Permutation', syntax: 'next_permutation(v.begin(), v.end())', description: 'Advances sequence to next lexicographical permutation in-place.' }
                ],
                examples: [
                    {
                        title: 'Next Lexicographical Permutation & Binary Search Frequency Count',
                        code: `#include <iostream>
#include <vector>
#include <algorithm>

int count_occurrences(const std::vector<int> &sorted_v, int target) {
    auto [lo, hi] = std::equal_range(sorted_v.begin(), sorted_v.end(), target);
    return (int)(hi - lo);
}

int main() {
    std::vector<int> a = {1, 2, 2, 2, 5, 9};
    std::cout << "Count of 2: " << count_occurrences(a, 2) << '\\n';
    return 0;
}`,
                        output: `Count of 2: 3`,
                        explanation: 'std::equal_range returns both lower_bound and upper_bound iterators in O(log N) time.'
                    }
                ],
                problems: [
                    {
                        title: 'Coordinate Compression of Large Array Values',
                        difficulty: 'Medium',
                        statement: 'Given an array A of N integers with values up to 10^9, replace each element with its 0-based rank among the distinct values in A in O(N log N) time.',
                        sampleInput: 'A = [40, 10, 20, 30, 20]',
                        sampleOutput: '[3, 0, 1, 2, 1]',
                        constraints: '1 <= N <= 10^5',
                        hint: 'Copy A to vals, sort and erase-unique vals, then replace each A[i] with lower_bound(vals.begin(), vals.end(), A[i]) - vals.begin().'
                    },
                    {
                        title: 'K-th Closest Point to Origin Using std::nth_element',
                        difficulty: 'Medium',
                        statement: 'Given an array of points [x, y] on a 2D plane and an integer k, return the k closest points to the origin (0, 0) in O(N) average time.',
                        sampleInput: 'points = [[3,3],[5,-1],[-2,4]], k = 2',
                        sampleOutput: '[[3,3],[-2,4]]',
                        constraints: '1 <= k <= points.size() <= 10^4',
                        hint: 'Use std::nth_element(pts.begin(), pts.begin() + k, pts.end(), cmp) comparing squared Euclidean distances x*x + y*y.'
                    }
                ]
            },
            {
                chapterNumber: 10,
                title: 'Advanced Graph & Dynamic Programming Patterns in C++',
                duration: '18 min read',
                difficulty: 'Advanced',
                summary: 'Implement Disjoint Set Union (DSU), Dijkstra Shortest Path, and 1D/2D Dynamic Programming in modern C++.',
                overview: `C++ is the premier language for algorithmic problem solving because STL containers combine low-level memory speed with expressive abstractions:
1. Disjoint Set Union (DSU / Union-Find): Tracks connected components dynamically in near-constant O(alpha(N)) time using Path Compression and Union by Size.
2. Dijkstra's Algorithm: Uses an adjacency list vector<vector<pair<int,int>>> and a min-heap priority_queue to find single-source shortest paths in O((V + E) log V).
3. Dynamic Programming (DP): Bottom-up tabulation over contiguous std::vector<int> arrays maximizes CPU cache hits and eliminates recursion stack overhead.`,
                keyPoints: [
                    'In Dijkstra, always skip stale heap entries with if (d > dist[u]) continue; before relaxing outgoing edges.',
                    'DSU with Path Compression + Union by Size achieves O(alpha(N)) <= 4 operations per query.',
                    'Initialize 64-bit infinity as constexpr long long INF = 1e18; so INF + edge_weight never overflows LLONG_MAX.',
                    'Space-optimize 2D DP tables dp[i][j] down to two 1D rows (prev and curr) whenever row i depends only on row i - 1.'
                ],
                diagramTitle: 'C++ DSU Path Compression & Dijkstra Min-Heap Pipeline',
                diagramSteps: [
                    'DSU: find(x) Path Compression + unite(a, b) by Size',
                    'Graph: vector<vector<pair<int, int>>> adj',
                    'Min-Heap: priority_queue<P, vector<P>, greater<P>>',
                    'Skip Stale: if (d > dist[u]) continue;',
                    'Relax Edge: dist[v] = d + w -> pq.emplace(dist[v], v)'
                ],
                graphTitle: 'Shortest Path & Connectivity Algorithm Complexity Comparison',
                graphMetricLabel: 'Execution Time on V=100,000, E=200,000 (ms)',
                graphData: [
                    { label: 'DSU Union-Find (Path Compression)', value: 8, displayValue: '6 ms (O(α(N)))', note: 'Flat contiguous parent/size arrays' },
                    { label: '0-1 BFS with std::deque', value: 18, displayValue: '15 ms (O(V + E))', note: 'Unit/zero weight edges' },
                    { label: 'Dijkstra Min-Heap (Skip Stale)', value: 42, displayValue: '38 ms (O(E log V))', note: 'Non-negative weighted graphs' }
                ],
                syntaxSummaryCode: `#include <vector>
#include <numeric>

struct DSU {
    std::vector<int> parent, sz;
    explicit DSU(int n) : parent(n), sz(n, 1) {
        std::iota(parent.begin(), parent.end(), 0);
    }
    int find(int x) {
        return (parent[x] == x) ? x : (parent[x] = find(parent[x]));
    }
    bool unite(int a, int b) {
        a = find(a); b = find(b);
        if (a == b) return false;
        if (sz[a] < sz[b]) std::swap(a, b);
        parent[b] = a;
        sz[a] += sz[b];
        return true;
    }
};`,
                syntaxTable: [
                    { construct: 'Sequential Fill', syntax: 'std::iota(parent.begin(), parent.end(), 0);', description: 'Fills range with 0, 1, 2, ..., N-1 (<numeric>).' },
                    { construct: 'Path Compression', syntax: 'parent[x] = find(parent[x]);', description: 'Flattens DSU tree height during root lookup.' },
                    { construct: 'Dijkstra Stale Check', syntax: 'if (d > dist[u]) continue;', description: 'Discards outdated distance pairs popped from min-heap.' },
                    { construct: '0/1 Knapsack 1D Loop', syntax: 'for (int w = W; w >= wt; w--)', description: 'Iterates capacity backward so each item is used at most once.' }
                ],
                examples: [
                    {
                        title: '0/1 Knapsack Space-Optimized 1D Dynamic Programming in C++',
                        code: `#include <iostream>
#include <vector>
#include <algorithm>

int knapsack_01(int W, const std::vector<int> &wt, const std::vector<int> &val) {
    std::vector<int> dp(W + 1, 0);
    for (size_t i = 0; i < wt.size(); i++) {
        for (int w = W; w >= wt[i]; w--) {
            dp[w] = std::max(dp[w], dp[w - wt[i]] + val[i]);
        }
    }
    return dp[W];
}

int main() {
    std::cout << "Max Knapsack Value: " << knapsack_01(7, {1, 3, 4, 5}, {1, 4, 5, 7}) << '\\n';
    return 0;
}`,
                        output: `Max Knapsack Value: 9`,
                        explanation: 'Iterating w backward from W down to wt[i] reduces space complexity from O(N * W) to O(W).'
                    }
                ],
                problems: [
                    {
                        title: 'Number of Connected Provinces Using DSU',
                        difficulty: 'Medium',
                        statement: 'Given N nodes and a list of undirected edges, use Disjoint Set Union (DSU) to return the number of connected components and the size of the largest component.',
                        sampleInput: 'N = 5, edges = [[0,1], [1,2], [3,4]]',
                        sampleOutput: 'Components = 2 | Largest = 3',
                        constraints: '1 <= N <= 10^5',
                        hint: 'Start with components = N; every time dsu.unite(u, v) returns true, decrement components.'
                    },
                    {
                        title: 'Network Delay Time (Dijkstra Single-Source Shortest Path)',
                        difficulty: 'Medium',
                        statement: 'Given a directed weighted graph of n nodes and a source node k, return the minimum time it takes for all n nodes to receive a signal, or -1 if unreachable.',
                        sampleInput: 'times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2',
                        sampleOutput: '2',
                        constraints: '1 <= n <= 100, non-negative weights',
                        hint: 'Run Dijkstra from source k and return *max_element(dist.begin() + 1, dist.end()), or -1 if any node remains at INF.'
                    }
                ]
            }
        ]
    },

    /* =========================================================================
       5. JAVASCRIPT (JS) (10 CHAPTERS)
       ========================================================================= */
    {
        slug: 'javascript',
        name: 'JavaScript',
        fullName: 'Modern JavaScript (ES6–ES2025), V8 Engine & Async Runtime',
        badge: 'JS',
        tagline: 'Ubiquitous event-driven language powering interactive web UIs, Node.js backends, and full-stack applications.',
        description:
            'Master JavaScript from V8 execution contexts, lexical scope, closures, and prototypal inheritance to functional array pipelines, the Event Loop, Promises, async/await, and DOM architecture.',
        accentColor: '#CA8A04',
        secondaryColor: '#FEF9C3',
        fileExtension: '.js',
        paradigm: 'Multi-Paradigm (Event-Driven, Functional, Prototype-Based OOP)',
        creatorInfo: 'Created by Brendan Eich • V8 JIT Engine & ECMAScript Standard',
        sortOrder: 5,
        chapters: [
            {
                chapterNumber: 1,
                title: 'V8 Execution Contexts, Hoisting, Temporal Dead Zone & Types',
                duration: '14 min read',
                difficulty: 'Beginner',
                summary: 'Understand how JavaScript engines execute code in two phases (Creation & Execution), let/const TDZ, and strict equality.',
                overview: `JavaScript is a dynamically typed, single-threaded, JIT-compiled language standardized as ECMAScript (ES6+). Every time a script or function runs, the V8 engine creates an Execution Context in two phases:
1. Memory Creation Phase: Hoists function declarations completely and registers variable identifiers. var is initialized to undefined, whereas let and const remain uninitialized in the Temporal Dead Zone (TDZ) until their declaration line is reached.
2. Execution Phase: Executes statements line-by-line on the Call Stack.

JavaScript has 7 primitive types (number, bigint, string, boolean, undefined, symbol, null) compared by value, and Reference types (Object, Array, Function, Map, Set) stored on the heap.`,
                keyPoints: [
                    'Always use const by default and let when reassignment is required; avoid var due to function-scoping bugs.',
                    'Always use strict equality (=== and !==) instead of loose equality (==) to prevent implicit type coercion surprises.',
                    'typeof null returns "object" (a historical JS quirk); check null explicitly with val === null.',
                    'Nullish coalescing (a ?? defaultVal) falls back only on null or undefined, preserving valid 0 and "" values!'
                ],
                diagramTitle: 'V8 Two-Phase Execution Context & Temporal Dead Zone (TDZ)',
                diagramSteps: [
                    'Phase 1: Creation (Hoist fn declarations)',
                    'let / const Placed in Temporal Dead Zone (TDZ)',
                    'Phase 2: Line-by-Line Call Stack Execution',
                    'Declaration Reached -> TDZ Ends & Value Bound'
                ],
                graphTitle: 'Bug Frequency by Variable & Equality Pattern in JS Codebases',
                graphMetricLabel: 'Defect Prevention Score (Higher is safer)',
                graphData: [
                    { label: 'const + Strict === + Nullish ??', value: 98, displayValue: '98% Safe', note: 'Predictable block scope & zero coercion' },
                    { label: 'let + Optional Chaining obj?.prop', value: 94, displayValue: '94% Safe', note: 'Prevents TypeError on nullish chains' },
                    { label: 'var + Loose == + Logical || Fallback', value: 24, displayValue: '24% Fragile', note: 'Coercion bugs (0 || 10 -> 10, "" == 0 -> true)' }
                ],
                syntaxSummaryCode: `// Block-scoped declarations
const MAX_RETRIES = 3;
let attempts = 0;

// Nullish Coalescing (??) vs Logical OR (||)
const userScore = 0;
console.log(userScore || 50);   // 50 (BUG: 0 is falsy!)
console.log(userScore ?? 50);   // 0  (Correct: 0 is not null/undefined)

// Optional Chaining (?.)
const city = student?.address?.city ?? "Bengaluru";

// Strict Equality & Number validation
console.log(Number.isNaN(NaN)); // true
console.log(Number.isInteger(42)); // true`,
                syntaxTable: [
                    { construct: 'Strict Equality', syntax: 'a === b / a !== b', description: 'Compares both type and value without implicit coercion.' },
                    { construct: 'Nullish Coalescing', syntax: 'val ?? fallback', description: 'Returns fallback only if val is null or undefined.' },
                    { construct: 'Optional Chaining', syntax: 'obj?.prop?.method?.()', description: 'Short-circuits to undefined if any link is nullish.' },
                    { construct: 'Template Literal', syntax: '`Score: ${score} / ${total}`', description: 'Interpolates expressions and supports multi-line strings.' }
                ],
                examples: [
                    {
                        title: 'Nullish Coalescing, Optional Chaining & Strict Coercion Guard',
                        code: `function formatConfig(rawConfig) {
    const timeout = rawConfig?.timeoutMs ?? 3000;
    const retries = rawConfig?.maxRetries ?? 2;
    const debug = Boolean(rawConfig?.debug);
    return \`timeout=\${timeout}ms, retries=\${retries}, debug=\${debug}\`;
}

console.log(formatConfig({ timeoutMs: 0, maxRetries: 0 }));
console.log(formatConfig(null));`,
                        output: `timeout=0ms, retries=0, debug=false
timeout=3000ms, retries=2, debug=false`,
                        explanation: 'Using ?? instead of || preserves legitimate 0 values for timeoutMs and maxRetries.'
                    }
                ],
                problems: [
                    {
                        title: 'Safe Deep Property Reader (getByPath)',
                        difficulty: 'Easy',
                        statement: 'Write a function getByPath(obj, pathStr, defaultVal) that reads a dot-separated path like "college.batch.trainer" from a nested object and returns defaultVal if any intermediate property is null or undefined.',
                        sampleInput: 'obj = { college: { batch: { name: "B22" } } }, path = "college.batch.name"',
                        sampleOutput: '"B22"',
                        constraints: '1 <= path depth <= 20',
                        hint: 'Split pathStr by "." and reduce over the keys checking cur != null ? cur[key] : undefined, then apply ?? defaultVal.'
                    },
                    {
                        title: 'FizzBuzz Twist Without Modulo Operator',
                        difficulty: 'Easy',
                        statement: 'Return an array of strings from 1 to N where multiples of 3 are "Fizz", multiples of 5 are "Buzz", and multiples of both are "FizzBuzz" using running counters instead of %.',
                        sampleInput: 'N = 5',
                        sampleOutput: '["1", "2", "Fizz", "4", "Buzz"]',
                        constraints: '1 <= N <= 10^4',
                        hint: 'Increment c3 and c5 counters on each step and reset them to 0 whenever they hit 3 or 5.'
                    }
                ]
            },
            {
                chapterNumber: 2,
                title: 'Functions, Arrow Functions, Lexical this & Closures',
                duration: '15 min read',
                difficulty: 'Beginner',
                summary: 'Master function declarations vs arrow functions, lexical this binding, IIFEs, currying, and private closure state.',
                overview: `In JavaScript, functions are first-class citizens. Standard function declarations (function fn() {}) are fully hoisted and bind their own dynamic this value depending on how they are called (method call obj.fn(), explicit fn.call(ctx), or new constructor).

Arrow functions ((a, b) => a + b), introduced in ES6, are more than syntax sugar: they do NOT have their own this, arguments, or prototype. Instead, an arrow function captures this lexically from its surrounding enclosing scope—making arrow functions ideal for callbacks, timers, and React/event handlers.`,
                keyPoints: [
                    'Arrow functions inherit this lexically from their enclosing scope and cannot be used as constructors with new.',
                    'Rest parameters (...args) collect remaining arguments into a true Array (unlike the legacy arguments object).',
                    'A closure bundles a function together with references to its surrounding lexical environment.',
                    'Use fn.call(thisArg, a, b), fn.apply(thisArg, [a, b]), or fn.bind(thisArg) to control explicit this binding on regular functions.'
                ],
                diagramTitle: 'Lexical Closure Environment & this Binding Resolution',
                diagramSteps: [
                    'Outer Function Creates Lexical Environment',
                    'Inner Function References Outer Variables',
                    'Outer Function Returns Inner Function',
                    'Heap Closure Retains Live Variable Bindings',
                    'Arrow Function Inherits Lexical this'
                ],
                graphTitle: 'Closure Memory & Invocation Speed Comparison',
                graphMetricLabel: 'Operations Per Millisecond (Higher is faster)',
                graphData: [
                    { label: 'Direct Arrow / Function Call', value: 96, displayValue: '980K ops/ms', note: 'V8 TurboFan inlined call' },
                    { label: 'Closure Stateful Invocation', value: 88, displayValue: '890K ops/ms', note: 'Context slot pointer lookup' },
                    { label: 'fn.bind(ctx) Bound Function', value: 64, displayValue: '620K ops/ms', note: 'Exotic bound function wrapper' }
                ],
                syntaxSummaryCode: `// Rest parameters & default values
const sumAll = (multiplier = 1, ...nums) =>
    nums.reduce((acc, n) => acc + n * multiplier, 0);

// Private state via Closure Factory
function createCounter(initial = 0) {
    let count = initial;
    return {
        increment: () => ++count,
        decrement: () => --count,
        value: () => count
    };
}

// Debounce Higher-Order Closure
function debounce(fn, delayMs) {
    let timerId = null;
    return function (...args) {
        clearTimeout(timerId);
        timerId = setTimeout(() => fn.apply(this, args), delayMs);
    };
}`,
                syntaxTable: [
                    { construct: 'Arrow Function', syntax: 'const add = (a, b) => a + b;', description: 'Concise function expression with lexical this binding.' },
                    { construct: 'Return Object Literal', syntax: 'const makeUser = (id) => ({ id });', description: 'Wrap returned object literal in parentheses () inside arrow fn.' },
                    { construct: 'Rest Parameters', syntax: 'function log(tag, ...items)', description: 'Gathers remaining arguments into a real Array.' },
                    { construct: 'Explicit Bind', syntax: 'const boundFn = fn.bind(contextObj);', description: 'Returns a new function with this permanently locked to contextObj.' }
                ],
                examples: [
                    {
                        title: 'Once() & Memoize() Higher-Order Closure Utilities',
                        code: `function once(fn) {
    let called = false;
    let result;
    return (...args) => {
        if (!called) {
            called = true;
            result = fn(...args);
        }
        return result;
    };
}

const initDatabase = once((url) => \`Connected to \${url}\`);
console.log(initDatabase("mongodb://primary"));
console.log(initDatabase("mongodb://secondary")); // Ignored, returns cached 1st result`,
                        output: `Connected to mongodb://primary
Connected to mongodb://primary`,
                        explanation: 'The closure variables called and result persist privately, ensuring fn executes at most once.'
                    }
                ],
                problems: [
                    {
                        title: 'Implement Function Currying (curry(fn))',
                        difficulty: 'Medium',
                        statement: 'Write a higher-order function curry(fn) that transforms a function of N arguments fn(a, b, c) into a callable chain curry(fn)(a)(b)(c) or curry(fn)(a, b)(c).',
                        sampleInput: 'curriedSum(1)(2)(3) and curriedSum(1, 2)(3)',
                        sampleOutput: '6',
                        constraints: 'Check args.length >= fn.length',
                        hint: 'Return a function curried(...args): if args.length >= fn.length, call fn(...args); else return (...next) => curried(...args, ...next).'
                    },
                    {
                        title: 'Classic Loop Closure Trap Fix (var vs let)',
                        difficulty: 'Easy',
                        statement: 'Explain why a loop for (var i = 0; i < 3; i++) pushing () => i prints [3, 3, 3] and write the clean fix so each callback returns its own index [0, 1, 2].',
                        sampleInput: 'n = 3',
                        sampleOutput: '[0, 1, 2]',
                        constraints: 'Use block-scoped let or an IIFE closure',
                        hint: 'Replacing var i with let i creates a fresh lexical binding for i on every loop iteration.'
                    }
                ]
            },
            {
                chapterNumber: 3,
                title: 'Objects, Destructuring, Spread, Prototypes & Immutability',
                duration: '15 min read',
                difficulty: 'Beginner',
                summary: 'Master object shorthand, nested destructuring, spread/rest cloning, Object.freeze, and the Prototype chain.',
                overview: `JavaScript objects are dynamic collections of key-value properties linked to a prototype object ([[Prototype]]). When you read obj.prop, the engine first checks obj's own properties; if not found, it walks up the Prototype Chain until it reaches Object.prototype (or null).

ES6+ makes working with immutable state effortless via Object Destructuring (const { name, role = "student" } = user;), Computed Property Names ({ [fieldKey]: value }), and the Spread Operator ({ ...user, score: 95 }). Note that spread performs a shallow copy; nested objects can be deeply cloned using the built-in structuredClone(obj).`,
                keyPoints: [
                    'Object.keys(o), Object.values(o), and Object.entries(o) iterate over an object own enumerable string keys.',
                    'Object.fromEntries(entries) is the inverse of Object.entries(), turning [key, val] pairs back into an object.',
                    'Spread { ...obj } and Object.assign({}, obj) create a shallow copy; use structuredClone(obj) for deep copies.',
                    'Object.hasOwn(obj, "key") is the modern, safe replacement for obj.hasOwnProperty("key").'
                ],
                diagramTitle: 'JavaScript Prototype Chain Lookup & Shallow vs Deep Clone',
                diagramSteps: [
                    'Property Read: user.toString()',
                    'Check Own Properties on user Instance',
                    'Follow [[Prototype]] -> User.prototype',
                    'Follow [[Prototype]] -> Object.prototype',
                    'structuredClone(obj) -> Deep Independent Graph'
                ],
                graphTitle: 'Object Cloning Strategies: Shallow Spread vs structuredClone vs JSON',
                graphMetricLabel: 'Fidelity & Safety Score',
                graphData: [
                    { label: 'Shallow Spread { ...obj } (Flat State)', value: 95, displayValue: 'Fastest O(K) Shallow', note: 'Ideal for Redux / React state updates' },
                    { label: 'structuredClone(obj) (Native Deep Clone)', value: 92, displayValue: 'Full Deep Clone', note: 'Supports Date, Map, Set & circular refs' },
                    { label: 'JSON.parse(JSON.stringify(obj))', value: 40, displayValue: 'Lossy Workaround', note: 'Strips undefined, functions, Map, Date!' }
                ],
                syntaxSummaryCode: `const student = {
    usn: "4MT22CS001",
    name: "Aarav",
    stats: { cgpa: 9.1, solved: 140 }
};

// Destructuring with aliasing & defaults
const { usn, name: fullName, dept = "CSE", stats: { cgpa } } = student;

// Immutable shallow update (React / Zustand pattern)
const updated = {
    ...student,
    stats: { ...student.stats, solved: student.stats.solved + 1 }
};

// Transform object values via Object.entries + Object.fromEntries
const prices = { py: 100, js: 200 };
const discounted = Object.fromEntries(
    Object.entries(prices).map(([k, v]) => [k, v * 0.9])
);`,
                syntaxTable: [
                    { construct: 'Object Destructuring', syntax: 'const { a, b: alias = 10 } = obj;', description: 'Extracts properties into variables with optional rename and default.' },
                    { construct: 'Shallow Clone/Merge', syntax: 'const next = { ...base, [key]: val };', description: 'Creates new object copying own enumerable properties.' },
                    { construct: 'Own Property Check', syntax: 'Object.hasOwn(obj, key)', description: 'Safely returns true if key is an own property (not inherited).' },
                    { construct: 'Deep Clone', syntax: 'const copy = structuredClone(original);', description: 'Built-in deep copy supporting nested structures, Maps, and Sets.' }
                ],
                examples: [
                    {
                        title: 'Inverting & Filtering an Object Dictionary Cleanly',
                        code: `const roleCodes = {
    super_admin: "SA",
    ops_admin: "OA",
    trainer: "TR",
    student: "ST"
};

const inverted = Object.fromEntries(
    Object.entries(roleCodes).map(([role, code]) => [code, role])
);

console.log("Inverted lookup:", inverted);
console.log("Has own 'OA'?", Object.hasOwn(inverted, "OA"));`,
                        output: `Inverted lookup: { SA: 'super_admin', OA: 'ops_admin', TR: 'trainer', ST: 'student' }
Has own 'OA'? true`,
                        explanation: 'Object.entries paired with Object.fromEntries enables functional map/filter pipelines over plain objects.'
                    }
                ],
                problems: [
                    {
                        title: 'Deep Equality Checker (deepEqual(a, b))',
                        difficulty: 'Medium',
                        statement: 'Write a recursive function deepEqual(a, b) in JavaScript that returns true if two values (primitives, arrays, or plain nested objects) are structurally identical.',
                        sampleInput: 'a = { x: [1, 2], y: 3 }, b = { y: 3, x: [1, 2] }',
                        sampleOutput: 'true',
                        constraints: 'No circular references',
                        hint: 'If a === b return true; check typeof a === "object" && a !== null && b !== null, verify Array.isArray(a) === Array.isArray(b), compare Object.keys lengths, and recurse on every key.'
                    },
                    {
                        title: 'Flatten Nested Object Keys with Dot Notation',
                        difficulty: 'Medium',
                        statement: 'Given a nested object { a: { b: { c: 1 } }, d: 2 }, flatten it into a single-level object { "a.b.c": 1, "d": 2 }.',
                        sampleInput: '{ user: { name: "Diya", address: { pin: 560001 } } }',
                        sampleOutput: '{ "user.name": "Diya", "user.address.pin": 560001 }',
                        constraints: 'Depth <= 15',
                        hint: 'Recursively pass a prefix string and merge leaf key-value pairs into an accumulator object.'
                    }
                ]
            },
            {
                chapterNumber: 4,
                title: 'Arrays & Functional Pipelines: map, filter, reduce, flatMap & sort',
                duration: '16 min read',
                difficulty: 'Beginner',
                summary: 'Master declarative array transformations, numeric sorting comparators, and non-mutating ES2023 methods (toSorted, toReversed).',
                overview: `JavaScript arrays are dynamic, heterogeneous list objects with built-in higher-order functional methods:
- .map(fn) transforms every element 1-to-1 into a new array of equal length.
- .filter(pred) returns a new array containing only elements where pred(el) is truthy.
- .reduce((acc, cur) => nextAcc, initVal) folds an array into any single value (number, object map, or grouped structure).
- .some(pred) and .every(pred) short-circuit on the first match/mismatch.

Critical Pitfall: Calling arr.sort() with no arguments converts numbers into strings and sorts them lexicographically ([10, 2, 1].sort() becomes [1, 10, 2]!). Always pass a numeric comparator: arr.sort((a, b) => a - b).`,
                keyPoints: [
                    'Always provide a comparator to sort numbers: arr.sort((a, b) => a - b) for ascending, (a, b) => b - a for descending.',
                    'ES2023 non-mutating methods (arr.toSorted(), arr.toReversed(), arr.with(i, val)) return a new array without mutating the original!',
                    'Array.from({ length: n }, (_, i) => i) creates and initializes an array of length n cleanly.',
                    'arr.at(-1) reads the last element of an array cleanly without writing arr[arr.length - 1].'
                ],
                diagramTitle: 'Declarative Array Functional Transformation Pipeline',
                diagramSteps: [
                    'Input Array: rawRecords[]',
                    '.filter(r => r.active) -> Subset Array',
                    '.map(r => transform(r)) -> Projected Array',
                    '.toSorted((a, b) => b.score - a.score)',
                    '.reduce((acc, item) => aggregate, init)'
                ],
                graphTitle: 'Array Operation Complexity & Mutation Profile',
                graphMetricLabel: 'Relative Speed for 100,000 Elements',
                graphData: [
                    { label: 'arr.push(x) / arr.pop() / arr.at(-1)', value: 5, displayValue: 'O(1)', note: 'Fast end-of-array operations' },
                    { label: 'Single-pass .reduce() / for..of loop', value: 25, displayValue: 'O(N) 1 Pass', note: 'Zero intermediate array allocations' },
                    { label: 'Chained .filter().map().reduce()', value: 48, displayValue: 'O(N) 3 Passes', note: 'Allocates 2 intermediate arrays' },
                    { label: 'arr.shift() / arr.unshift(x) in loop', value: 100, displayValue: 'O(N) per call!', note: 'Re-indexes all elements' }
                ],
                syntaxSummaryCode: `const scores = [82, 45, 91, 38, 76, 95];

// Numeric sort (non-mutating copy via spread)
const topThree = [...scores]
    .sort((a, b) => b - a)
    .slice(0, 3);                           // [95, 91, 82]

// Group records by key using reduce
const students = [
    { name: "Aarav", batch: "B22", marks: 90 },
    { name: "Diya",  batch: "B21", marks: 85 },
    { name: "Kiran", batch: "B22", marks: 78 }
];

const byBatch = students.reduce((acc, s) => {
    (acc[s.batch] ??= []).push(s);
    return acc;
}, {});

// 2D Grid creation: R x C filled with 0
const grid = Array.from({ length: 3 }, () => Array(4).fill(0));`,
                syntaxTable: [
                    { construct: 'Numeric Sort', syntax: 'arr.sort((a, b) => a - b)', description: 'Sorts numbers in ascending order in-place.' },
                    { construct: 'Fold / Reduce', syntax: 'arr.reduce((acc, item, idx) => next, init)', description: 'Accumulates array elements into a single result.' },
                    { construct: 'Last Element', syntax: 'arr.at(-1)', description: 'Reads the last element using negative index.' },
                    { construct: 'Range Generator', syntax: 'Array.from({ length: n }, (_, i) => i)', description: 'Creates array [0, 1, ..., n-1].' }
                ],
                examples: [
                    {
                        title: 'Pipeline: Filter Passing Candidates, Sort & Compute Stats',
                        code: `const candidates = [
    { name: "Kiran", score: 78, placed: true },
    { name: "Aarav", score: 94, placed: true },
    { name: "Rohit", score: 35, placed: false },
    { name: "Diya",  score: 89, placed: true }
];

const leaderboard = candidates
    .filter((c) => c.score >= 40)
    .sort((a, b) => b.score - a.score)
    .map((c, idx) => \`#\${idx + 1} \${c.name} (\${c.score}%)\`);

console.log(leaderboard.join(" | "));`,
                        output: `#1 Aarav (94%) | #2 Diya (89%) | #3 Kiran (78%)`,
                        explanation: 'Chaining filter, sort, and map builds a readable data transformation pipeline.'
                    }
                ],
                problems: [
                    {
                        title: 'Chunk Array into Fixed-Size Batches',
                        difficulty: 'Easy',
                        statement: 'Write a function chunkArray(arr, size) that splits an array into sub-arrays of maximum length size.',
                        sampleInput: 'arr = [1, 2, 3, 4, 5], size = 2',
                        sampleOutput: '[[1, 2], [3, 4], [5]]',
                        constraints: 'size >= 1',
                        hint: 'Step i by i += size in a loop and push arr.slice(i, i + size).'
                    },
                    {
                        title: 'Custom Array.prototype.myReduce Polyfill',
                        difficulty: 'Medium',
                        statement: 'Implement a function myReduce(arr, callback, initialValue) that replicates Array.prototype.reduce, handling both provided and omitted initialValue.',
                        sampleInput: 'myReduce([1, 2, 3, 4], (a, b) => a + b, 0)',
                        sampleOutput: '10',
                        constraints: 'Throw TypeError on empty array with no initialValue',
                        hint: 'Check arguments.length >= 3 to distinguish an explicit undefined initialValue from an omitted third argument.'
                    }
                ]
            },
            {
                chapterNumber: 5,
                title: 'ES6 Map, Set, WeakMap & Hash Table Algorithms in JS',
                duration: '15 min read',
                difficulty: 'Intermediate',
                summary: 'Use Map and Set for O(1) lookups with arbitrary key types, insertion-order LRU caching, and WeakMap memory-safe metadata.',
                overview: `While plain JavaScript objects {} coerce all keys to strings (or Symbols), ES6 Map allows keys of any type (including objects, functions, and numbers), tracks its count in O(1) via map.size, and guarantees strict insertion-order iteration.

Because Map preserves insertion order and supports O(1) map.keys().next().value to peek at the oldest key, a full O(1) LRU Cache can be implemented in just 15 lines of JavaScript! ES6 Set stores unique values with O(1) .has(), .add(), and .delete().`,
                keyPoints: [
                    'Use Map over plain objects {} when keys are dynamic, non-strings, or frequently added/removed at high volume.',
                    'Deduplicate any array in one expression: const unique = [...new Set(arr)];',
                    'map.keys().next().value returns the oldest inserted key in O(1) time—perfect for LRU eviction.',
                    'WeakMap and WeakSet hold weak object references that allow garbage collection when the key object is no longer referenced elsewhere.'
                ],
                diagramTitle: 'ES6 Map Insertion-Ordered Hash Table & LRU Eviction',
                diagramSteps: [
                    'map.set(key, val) -> O(1) Hash + Append to Order List',
                    'Access Hit -> map.delete(key) then map.set(key, val)',
                    'Moves Accessed Key to Most-Recently-Used Tail',
                    'Capacity Full -> Evict map.keys().next().value (Head)'
                ],
                graphTitle: 'High-Frequency Key Add/Delete Benchmark: ES6 Map vs Object {}',
                graphMetricLabel: 'Operations Per Millisecond (Higher is faster)',
                graphData: [
                    { label: 'ES6 Map (.set / .get / .delete)', value: 94, displayValue: '420K ops/ms', note: 'Optimized hash table for dynamic mutations' },
                    { label: 'ES6 Set (.add / .has / .delete)', value: 98, displayValue: '460K ops/ms', note: 'Fastest membership testing' },
                    { label: 'Plain Object (delete obj[key])', value: 34, displayValue: '110K ops/ms', note: 'delete deoptimizes V8 Hidden Classes!' }
                ],
                syntaxSummaryCode: `// 1. Array deduplication & Set intersection
const unique = [...new Set([1, 2, 2, 3, 1])]; // [1, 2, 3]
const setA = new Set([1, 2, 3]);
const setB = new Set([2, 3, 4]);
const intersection = [...setA].filter((x) => setB.has(x)); // [2, 3]

// 2. Frequency Counter with Map
const freq = new Map();
for (const ch of "abracadabra") {
    freq.set(ch, (freq.get(ch) ?? 0) + 1);
}
console.log("Count of 'a':", freq.get("a") ?? 0); // 5`,
                syntaxTable: [
                    { construct: 'Map Get / Set', syntax: 'map.set(k, v); map.get(k); map.has(k);', description: 'O(1) key-value hash operations with any key type.' },
                    { construct: 'Map Size', syntax: 'map.size / set.size', description: 'O(1) property returning current element count.' },
                    { construct: 'Deduplicate Array', syntax: '[...new Set(array)]', description: 'Removes duplicate primitives in O(N) time.' },
                    { construct: 'Oldest Map Key', syntax: 'map.keys().next().value', description: 'Peeks the earliest inserted key in O(1) time.' }
                ],
                examples: [
                    {
                        title: '15-Line O(1) LRU Cache Using ES6 Map Insertion Order',
                        code: `class LRUCache {
    constructor(capacity) {
        this.cap = capacity;
        this.cache = new Map();
    }
    get(key) {
        if (!this.cache.has(key)) return -1;
        const val = this.cache.get(key);
        this.cache.delete(key);
        this.cache.set(key, val); // Refresh to most-recent end
        return val;
    }
    put(key, val) {
        if (this.cache.has(key)) this.cache.delete(key);
        else if (this.cache.size >= this.cap) {
            const oldestKey = this.cache.keys().next().value;
            this.cache.delete(oldestKey);
        }
        this.cache.set(key, val);
    }
}

const lru = new LRUCache(2);
lru.put("a", 1); lru.put("b", 2);
console.log("get(a):", lru.get("a"));
lru.put("c", 3); // Evicts "b"
console.log("get(b) after eviction:", lru.get("b"));`,
                        output: `get(a): 1
get(b) after eviction: -1`,
                        explanation: 'Deleting and re-inserting a key in an ES6 Map moves it to the back of the insertion queue in O(1) time.'
                    }
                ],
                problems: [
                    {
                        title: 'First Non-Repeating Character in a String',
                        difficulty: 'Easy',
                        statement: 'Given a string s, find the first non-repeating character in it and return its index. If it does not exist, return -1.',
                        sampleInput: 's = "ethnotech"',
                        sampleOutput: '2 ("h")',
                        constraints: '1 <= s.length <= 10^5',
                        hint: 'Build a frequency Map in pass 1, then return the first index i in pass 2 where freq.get(s[i]) === 1.'
                    },
                    {
                        title: 'Longest Subarray with Equal Number of 0s and 1s',
                        difficulty: 'Medium',
                        statement: 'Given a binary array nums, return the maximum length of a contiguous subarray with an equal number of 0 and 1 in O(N) time.',
                        sampleInput: 'nums = [0, 1, 0, 0, 1, 1, 0]',
                        sampleOutput: '6',
                        constraints: '1 <= nums.length <= 10^5',
                        hint: 'Treat 0 as -1 and 1 as +1; store the earliest index of each running prefix sum in a Map initialized with new Map([[0, -1]]).'
                    }
                ]
            },
            {
                chapterNumber: 6,
                title: 'ES6 Classes, Private #Fields, Getters, Inheritance & Modules',
                duration: '15 min read',
                difficulty: 'Intermediate',
                summary: 'Structure modern JavaScript OOP with ES6 class syntax, true hardware-enforced #private fields, static blocks, and ES Modules.',
                overview: `ES6 class syntax provides a clean, declarative layer over JavaScript's prototypal inheritance system. Modern ES2022+ classes support true encapsulated Private Fields and Methods prefixed with a hash symbol (#balance), which are enforced by the JS engine at the syntax level and cannot be accessed or inspected from outside the class.

For code organization, ES Modules (ESM) use static import and export declarations, enabling bundlers like Vite and Rollup to perform Tree-Shaking (eliminating unused dead code at build time).`,
                keyPoints: [
                    'Hash-prefixed fields (#secret) are truly private at runtime—accessing instance.#secret outside the class is a SyntaxError.',
                    'In a subclass constructor (extends), you MUST call super(...) before accessing this.',
                    'Class methods are automatically placed on ClassName.prototype and run in strict mode ("use strict").',
                    'Prefer named exports (export const fn = ...) alongside default exports for clean tree-shaking.'
                ],
                diagramTitle: 'ES6 Class #Private Encapsulation & Prototype Wiring',
                diagramSteps: [
                    'class Derived extends Base',
                    'Private Slot #field Allocated on Instance',
                    'constructor() -> super() Initializes Base',
                    'Methods Attached to Derived.prototype',
                    'ESM export / import -> Vite Tree-Shaking'
                ],
                graphTitle: 'Encapsulation Strength in JavaScript Patterns',
                graphMetricLabel: 'Privacy & Performance Score',
                graphData: [
                    { label: 'ES2022 Class #private Fields', value: 96, displayValue: 'Engine-Enforced + Prototype Methods', note: 'Fastest & syntax-protected' },
                    { label: 'Closure Factory Function', value: 88, displayValue: 'Lexical Privacy', note: 'Duplicates methods per instance' },
                    { label: 'Underscore Convention _field', value: 25, displayValue: 'Public by Runtime', note: 'Convention only, easily mutated' }
                ],
                syntaxSummaryCode: `export class Wallet {
    #balance = 0; // True private field (ES2022)

    constructor(owner, initial = 0) {
        this.owner = owner;
        this.#balance = Math.max(0, initial);
    }

    get balance() {
        return this.#balance;
    }

    deposit(amount) {
        if (amount <= 0) throw new RangeError("Amount must be positive");
        this.#balance += amount;
        return this.#balance;
    }

    static fromJSON(jsonStr) {
        const data = JSON.parse(jsonStr);
        return new Wallet(data.owner, data.balance);
    }
}`,
                syntaxTable: [
                    { construct: 'Private Field', syntax: '#token = "";', description: 'Declares class-private field inaccessible outside class body.' },
                    { construct: 'Subclass Super', syntax: 'super(arg1, arg2);', description: 'Calls parent constructor before using this in a derived class.' },
                    { construct: 'Getter / Setter', syntax: 'get total() { ... } / set total(v) { ... }', description: 'Exposes computed property accessed like a regular field.' },
                    { construct: 'ES Module Import', syntax: 'import { Wallet } from "./Wallet.js";', description: 'Statically imports named binding from an ES module.' }
                ],
                examples: [
                    {
                        title: 'EventEmitter Pub-Sub Class Implementation in ES6',
                        code: `class EventEmitter {
    #listeners = new Map();

    on(event, listener) {
        if (!this.#listeners.has(event)) this.#listeners.set(event, new Set());
        this.#listeners.get(event).add(listener);
        return () => this.off(event, listener); // Returns unsubscribe fn
    }

    off(event, listener) {
        this.#listeners.get(event)?.delete(listener);
    }

    emit(event, ...args) {
        for (const fn of this.#listeners.get(event) ?? []) {
            fn(...args);
        }
    }
}

const bus = new EventEmitter();
const unsub = bus.on("score", (usn, pts) => console.log(\`\${usn} scored \${pts}\`));
bus.emit("score", "4MT22CS001", 95);
unsub();
bus.emit("score", "4MT22CS001", 100); // Unsubscribed, does not fire`,
                        output: `4MT22CS001 scored 95`,
                        explanation: 'Returning an unsubscribe closure from .on() makes cleanup in React useEffect hooks effortless.'
                    }
                ],
                problems: [
                    {
                        title: 'Implement a Queue Using Two Stacks in an ES6 Class',
                        difficulty: 'Easy',
                        statement: 'Implement a FIFO Queue class MyQueue using only two LIFO arrays (inStack and outStack) such that push, pop, and peek run in amortized O(1) time.',
                        sampleInput: 'push(10), push(20), peek(), pop(), peek()',
                        sampleOutput: 'peek -> 10, pop -> 10, peek -> 20',
                        constraints: 'Amortized O(1) per operation',
                        hint: 'Push new items onto #inStack. On pop/peek, if #outStack is empty, pop all items from #inStack and push them onto #outStack.'
                    },
                    {
                        title: 'Chainable Calculator Class with Fluent API',
                        difficulty: 'Easy',
                        statement: 'Create a Calculator(initial) class supporting fluent method chaining: new Calculator(10).add(5).multiply(2).subtract(3).Result() -> 27.',
                        sampleInput: 'new Calculator(10).add(5).multiply(2).subtract(3).Result()',
                        sampleOutput: '27',
                        constraints: 'Throw Error on division by zero',
                        hint: 'Mutate private #value in each arithmetic method and return this.'
                    }
                ]
            },
            {
                chapterNumber: 7,
                title: 'Event Loop, Call Stack, Microtask Queue & Macrotasks',
                duration: '16 min read',
                difficulty: 'Intermediate',
                summary: 'Master JavaScript single-threaded concurrency: Call Stack, Web APIs, Microtask Queue (Promises), and Macrotask Queue (setTimeout).',
                overview: `Although JavaScript executes code on a single main thread, it achieves non-blocking concurrency via the Event Loop. Long-running operations (network fetch, timers, DOM events) are delegated to browser Web APIs or Node.js libuv background threads.

When asynchronous callbacks finish, they enter two prioritized queues:
1. Microtask Queue (Highest Priority): Promise .then/.catch/.finally callbacks, await continuations, and queueMicrotask().
2. Macrotask (Task) Queue: setTimeout, setInterval, I/O callbacks, and UI events.

Crucial Rule of the Event Loop: After the synchronous Call Stack becomes empty, the Event Loop drains the ENTIRE Microtask Queue to completion (including newly enqueued microtasks) before picking up a single Macrotask!`,
                keyPoints: [
                    'Synchronous Call Stack code ALWAYS runs first before any Promise microtask or setTimeout macrotask.',
                    'All pending Promise microtasks execute before the next setTimeout(..., 0) macrotask.',
                    'Note that the executor function passed to new Promise((resolve) => { /* THIS RUNS SYNCHRONOUSLY! */ }) runs immediately on the Call Stack!',
                    'Heavy synchronous loops block the Event Loop and freeze browser UI rendering (60 FPS = 16.6ms frame budget).'
                ],
                diagramTitle: 'JavaScript Event Loop: Call Stack -> Microtasks -> Render -> Macrotask',
                diagramSteps: [
                    '1. Execute Synchronous Call Stack to Empty',
                    '2. Drain ALL Microtasks (Promises / await)',
                    '3. Browser Repaint / requestAnimationFrame (if due)',
                    '4. Dequeue ONE Macrotask (setTimeout / I/O)',
                    '5. Repeat Loop (Drain Microtasks Again)'
                ],
                graphTitle: 'Execution Priority Order in the JavaScript Event Loop',
                graphMetricLabel: 'Dispatch Priority Rank (Higher runs earlier)',
                graphData: [
                    { label: '1. Synchronous Call Stack & Promise Executor', value: 100, displayValue: 'Priority #1 (Immediate)', note: 'Runs before yielding to Event Loop' },
                    { label: '2. Microtask Queue (Promise.then / await)', value: 78, displayValue: 'Priority #2 (Drained Completely)', note: 'Runs immediately after stack clears' },
                    { label: '3. requestAnimationFrame (Pre-Paint Hook)', value: 52, displayValue: 'Priority #3 (~16.6ms Frame)', note: 'Synced with display refresh rate' },
                    { label: '4. Macrotask Queue (setTimeout / setInterval)', value: 26, displayValue: 'Priority #4 (One per tick)', note: 'Minimum 0–4ms clamping delay' }
                ],
                syntaxSummaryCode: `console.log("1: Sync Start");

setTimeout(() => {
    console.log("5: Macrotask (setTimeout 0)");
}, 0);

Promise.resolve()
    .then(() => {
        console.log("3: Microtask #1 (Promise.then)");
    })
    .then(() => {
        console.log("4: Microtask #2 (Chained Promise.then)");
    });

console.log("2: Sync End");
// Exact Output Order: 1 -> 2 -> 3 -> 4 -> 5`,
                syntaxTable: [
                    { construct: 'Schedule Microtask', syntax: 'queueMicrotask(() => { ... });', description: 'Enqueues callback directly into the high-priority Microtask Queue.' },
                    { construct: 'Schedule Macrotask', syntax: 'const id = setTimeout(fn, delayMs);', description: 'Enqueues callback into Macrotask Queue after delayMs.' },
                    { construct: 'Cancel Timer', syntax: 'clearTimeout(id) / clearInterval(id)', description: 'Cancels a pending timer macrotask.' },
                    { construct: 'Animation Frame', syntax: 'requestAnimationFrame((timestamp) => ...)', description: 'Schedules visual update right before the next browser repaint.' }
                ],
                examples: [
                    {
                        title: 'Tracing Synchronous Executor vs Microtask vs Macrotask Order',
                        code: `const order = [];
order.push("A: Sync Top");

setTimeout(() => order.push("E: setTimeout"), 0);

new Promise((resolve) => {
    order.push("B: Inside Promise Executor (Sync!)");
    resolve();
}).then(() => {
    order.push("D: Promise.then Microtask");
});

order.push("C: Sync Bottom");

setTimeout(() => {
    console.log(order.join(" -> "));
}, 10);`,
                        output: `A: Sync Top -> B: Inside Promise Executor (Sync!) -> C: Sync Bottom -> D: Promise.then Microtask -> E: setTimeout`,
                        explanation: 'The Promise constructor callback runs synchronously ("B"), while its .then() handler ("D") runs in the microtask phase before setTimeout ("E").'
                    }
                ],
                problems: [
                    {
                        title: 'Implement a Cancellable Interval With Immediate First Tick',
                        difficulty: 'Easy',
                        statement: 'Write a function startHeartbeat(fn, intervalMs) that invokes fn() immediately on call, then repeatedly every intervalMs, and returns a stop() cleanup function.',
                        sampleInput: 'startHeartbeat(tick, 1000) -> stop() after 2500ms',
                        sampleOutput: 'tick called 3 times (at 0ms, 1000ms, 2000ms)',
                        constraints: 'Must clean up interval timer on stop()',
                        hint: 'Call fn() synchronously once, start const id = setInterval(fn, intervalMs), and return () => clearInterval(id).'
                    },
                    {
                        title: 'Yielding Heavy Loops to Keep UI Responsive (Chunked Runner)',
                        difficulty: 'Medium',
                        statement: 'Given an array of 100,000 items and a processor function, process them in chunks of 2,500 items yielding back to the Macrotask Queue between chunks via setTimeout(..., 0).',
                        sampleInput: '10,000 items, chunkSize = 2,500',
                        sampleOutput: 'Processed in 4 non-blocking macrotask slices',
                        constraints: 'Return a Promise that resolves when all chunks finish',
                        hint: 'Process slice [i, i + chunkSize], then await new Promise(r => setTimeout(r, 0)) before the next chunk.'
                    }
                ]
            },
            {
                chapterNumber: 8,
                title: 'Promises, async/await, Concurrency Combinators & Fetch API',
                duration: '16 min read',
                difficulty: 'Intermediate',
                summary: 'Write resilient asynchronous code using Promises, async/await, Promise.all, Promise.allSettled, and AbortController.',
                overview: `A Promise represents the eventual completion (fulfilled) or failure (rejected) of an asynchronous operation. An async function always returns a Promise, and the await keyword pauses execution of that async function (yielding control back to the Event Loop without blocking the thread) until the awaited Promise settles.

When running multiple independent async requests (like fetching profile, exams, and attendance simultaneously), awaiting them sequentially one-by-one wastes network latency. Instead, launch them in parallel using await Promise.all([req1, req2, req3])!`,
                keyPoints: [
                    'Promise.all([...]) runs promises concurrently and short-circuits immediately if ANY promise rejects.',
                    'Promise.allSettled([...]) waits for ALL promises to finish regardless of rejections, returning [{ status: "fulfilled", value }, { status: "rejected", reason }].',
                    'Promise.race([...]) settles as soon as the FIRST promise settles (ideal for request timeouts).',
                    'Note that fetch() only rejects on network failures—HTTP 404 or 500 still resolves, so always check if (!res.ok) throw new Error(...)!'
                ],
                diagramTitle: 'Promise State Machine & Parallel Promise.all Execution',
                diagramSteps: [
                    'Pending State -> Async I/O Launched',
                    'Parallel Fan-Out: Promise.all([p1, p2, p3])',
                    'Resolved -> Fulfilled(value) via await',
                    'Rejected -> Caught by try / catch(err)',
                    'finally {} Cleanup Always Runs'
                ],
                graphTitle: '3 Independent 200ms API Calls: Sequential await vs Promise.all',
                graphMetricLabel: 'Total Wall-Clock Latency (ms)',
                graphData: [
                    { label: 'Parallel await Promise.all([a(), b(), c()])', value: 33, displayValue: '205 ms', note: 'All 3 requests in flight concurrently' },
                    { label: 'Parallel await Promise.allSettled([...])', value: 34, displayValue: '208 ms', note: 'Fault-tolerant parallel batch' },
                    { label: 'Sequential await a(); await b(); await c();', value: 100, displayValue: '615 ms (3x Slower!)', note: 'Waterfall serial bottleneck' }
                ],
                syntaxSummaryCode: `// Parallel API fetch with timeout guard
async function fetchWithTimeout(url, timeoutMs = 5000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
        return await res.json();
    } finally {
        clearTimeout(timer);
    }
}

// Parallel dashboard loader
async function loadDashboard(userId) {
    const [profile, exams] = await Promise.all([
        fetchWithTimeout(\`/api/users/\${userId}\`),
        fetchWithTimeout(\`/api/exams/active\`)
    ]);
    return { profile, exams };
}`,
                syntaxTable: [
                    { construct: 'All Fail-Fast', syntax: 'const [a, b] = await Promise.all([p1, p2]);', description: 'Resolves when all succeed; rejects immediately if any fails.' },
                    { construct: 'All Fault-Tolerant', syntax: 'const results = await Promise.allSettled([p1, p2]);', description: 'Waits for all promises and reports per-item status.' },
                    { construct: 'First Settled', syntax: 'const winner = await Promise.race([task, timeout]);', description: 'Settles with the outcome of the fastest promise.' },
                    { construct: 'First Fulfilled', syntax: 'const firstOk = await Promise.any([m1, m2]);', description: 'Resolves with first successful promise, ignoring single rejections.' }
                ],
                examples: [
                    {
                        title: 'Auto-Retry Async Wrapper with Exponential Backoff',
                        code: `const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function retryWithBackoff(taskFn, retries = 3, baseDelay = 10) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await taskFn(attempt);
        } catch (err) {
            if (attempt === retries) throw err;
            await sleep(baseDelay * (2 ** (attempt - 1)));
        }
    }
}

let tries = 0;
retryWithBackoff(async (n) => {
    tries = n;
    if (n < 3) throw new Error("Transient 503");
    return "200 OK on attempt #" + n;
}).then(console.log);`,
                        output: `200 OK on attempt #3`,
                        explanation: 'Exponential backoff waits 10ms, 20ms, 40ms between transient failures before succeeding or surfacing the final error.'
                    }
                ],
                problems: [
                    {
                        title: 'Implement Custom Promise.all Polyfill (myPromiseAll)',
                        difficulty: 'Medium',
                        statement: 'Write a function myPromiseAll(promises) that takes an array of Promises (or values) and returns a new Promise that resolves with an array of results in the exact input order, or rejects immediately when any input promise rejects.',
                        sampleInput: '[Promise.resolve(10), 20, Promise.resolve(30)]',
                        sampleOutput: '[10, 20, 30]',
                        constraints: 'Handle empty array [] immediately',
                        hint: 'Track completedCount = 0 and results = new Array(n); wrap each item with Promise.resolve(p).then(val => { results[i] = val; if (++completedCount === n) resolve(results); }, reject).'
                    },
                    {
                        title: 'Async Concurrency Pool Limiter (pLimit)',
                        difficulty: 'Hard',
                        statement: 'Given an array of 20 async task functions() => Promise and a concurrency limit of K = 3, execute all tasks such that at most K promises are in-flight at any given moment.',
                        sampleInput: '6 tasks, concurrency K = 2',
                        sampleOutput: 'All 6 tasks resolved in order with max 2 active workers',
                        constraints: '1 <= K <= tasks.length',
                        hint: 'Spawn K worker coroutines that share an index cursor let idx = 0 and loop while (idx < tasks.length) { const i = idx++; res[i] = await tasks[i](); }.'
                    }
                ]
            },
            {
                chapterNumber: 9,
                title: 'DOM Manipulation, Event Delegation, Storage & Browser APIs',
                duration: '15 min read',
                difficulty: 'Intermediate',
                summary: 'Build fast, secure browser UIs with DOM selectors, Event Bubbling Delegation, XSS-safe textContent, and Web Storage.',
                overview: `In the browser, the HTML document is parsed into the Document Object Model (DOM) tree. Directly mutating the DOM inside a loop triggers repeated style recalculations and layout reflows. Batching insertions via DocumentFragment or declarative state updates minimizes layout thrashing.

DOM events travel in three phases: Capturing (window down to target), Target, and Bubbling (target up to window). Event Delegation attaches a single listener to a parent container (e.g., ul.addEventListener("click", e => ...)) and inspects e.target.closest("li")—saving memory and automatically handling dynamically added child items!`,
                keyPoints: [
                    'Always use el.textContent = userStr instead of el.innerHTML = userStr when rendering untrusted user text to prevent Cross-Site Scripting (XSS)!',
                    'Event Delegation uses 1 parent event listener instead of N child listeners via e.target.closest(selector).',
                    'e.preventDefault() stops default browser action (like form page reload); e.stopPropagation() stops event bubbling upward.',
                    'localStorage persists across browser restarts (per origin); sessionStorage is scoped to a single browser tab.'
                ],
                diagramTitle: 'DOM Event Capture, Target & Bubbling Delegation Architecture',
                diagramSteps: [
                    'Phase 1: Capture (document -> parent -> target)',
                    'Phase 2: Target Element Reached',
                    'Phase 3: Bubble Up (target -> parent -> document)',
                    'Parent Delegation: e.target.closest("[data-id]")',
                    'Batch DOM Update -> Single Layout & Paint'
                ],
                graphTitle: 'Memory & Setup Time for 5,000 Interactive List Rows',
                graphMetricLabel: 'Listener Memory & Attach Time (Lower is better)',
                graphData: [
                    { label: '1 Delegated Parent Listener (e.target.closest)', value: 4, displayValue: '0.05 ms (1 Listener)', note: 'Handles dynamic rows automatically' },
                    { label: 'DocumentFragment Batched Insert + Delegation', value: 12, displayValue: '1.8 ms (Single Reflow)', note: 'Zero layout thrashing' },
                    { label: '5,000 Individual Row .addEventListener() Calls', value: 96, displayValue: '42.0 ms (5,000 Closures)', note: 'High heap & GC pressure' }
                ],
                syntaxSummaryCode: `// 1. Event Delegation on Parent Container
const listEl = document.querySelector("#task-list");
listEl?.addEventListener("click", (event) => {
    const deleteBtn = event.target.closest("[data-action='delete']");
    if (!deleteBtn) return;
    const itemId = deleteBtn.dataset.id;
    console.log("Delete task:", itemId);
});

// 2. Safe JSON LocalStorage Helper
const storage = {
    get(key, fallback = null) {
        try {
            const raw = localStorage.getItem(key);
            return raw !== null ? JSON.parse(raw) : fallback;
        } catch {
            return fallback;
        }
    },
    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }
};`,
                syntaxTable: [
                    { construct: 'Query Selector', syntax: 'document.querySelector(".card")', description: 'Returns first matching Element for any CSS selector.' },
                    { construct: 'XSS-Safe Text', syntax: 'el.textContent = untrustedInput;', description: 'Escapes HTML characters safely as plain text.' },
                    { construct: 'Delegation Match', syntax: 'e.target.closest("[data-id]")', description: 'Finds nearest ancestor (or self) matching selector.' },
                    { construct: 'Class Toggle', syntax: 'el.classList.toggle("active", isActive);', description: 'Adds or removes CSS class cleanly.' }
                ],
                examples: [
                    {
                        title: 'Throttle Event Handler for 60fps Scroll / Resize Telemetry',
                        code: `function throttle(fn, intervalMs) {
    let lastTime = 0;
    return function (...args) {
        const now = Date.now();
        if (now - lastTime >= intervalMs) {
            lastTime = now;
            fn.apply(this, args);
        }
    };
}

const logScroll = throttle((y) => console.log("Scroll Y:", y), 100);
logScroll(120); // Fires immediately
logScroll(180); // Throttled (within 100ms window)`,
                        output: `Scroll Y: 120`,
                        explanation: 'While debounce waits for a pause at the end of a burst, throttle guarantees execution at most once every intervalMs.'
                    }
                ],
                problems: [
                    {
                        title: 'Implement Debounce with Leading & Cancel Support',
                        difficulty: 'Medium',
                        statement: 'Write a function debounce(fn, waitMs) that delays invoking fn until after waitMs have elapsed since the last call, and attaches a .cancel() method to abort any pending execution.',
                        sampleInput: 'debounced("a"), debounced("ab"), debounced.cancel()',
                        sampleOutput: 'Pending timer cancelled cleanly',
                        constraints: 'Preserve this context and arguments',
                        hint: 'Attach wrapper.cancel = () => { clearTimeout(timerId); timerId = null; } to the returned function.'
                    },
                    {
                        title: 'HTML Entity Escaper to Prevent XSS Injection',
                        difficulty: 'Easy',
                        statement: 'Write a function escapeHtml(str) that replaces &, <, >, ", and \' with their corresponding safe HTML entities (&amp;, &lt;, &gt;, &quot;, &#39;).',
                        sampleInput: '\'<script>alert("xss")</script>\'',
                        sampleOutput: '\'&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;\'',
                        constraints: 'Single regex pass O(N)',
                        hint: 'Use str.replace(/[&<>"\']/g, ch => entityMap[ch]).'
                    }
                ]
            },
            {
                chapterNumber: 10,
                title: 'Algorithmic Problem Solving & Design Patterns in JavaScript',
                duration: '16 min read',
                difficulty: 'Advanced',
                summary: 'Solve coding interview problems in JavaScript using Sliding Windows, Two Pointers, Memoized DP, and Graph BFS/DFS.',
                overview: `In Code2Career and technical JavaScript interviews, understanding V8 engine performance characteristics prevents Time Limit Exceeded (TLE) verdicts:
1. Queue in BFS: Array.prototype.shift() is O(N) on large arrays. For BFS over >10,000 nodes, use a head-pointer index (let head = 0; const cur = queue[head++];) to achieve strict O(1) dequeue!
2. TypedArrays: Int32Array and Uint8Array allocate flat, unboxed C-style contiguous byte buffers for high-speed DP tables and bitsets.
3. Recursion & Memoization: Map or fixed Array DP caches eliminate redundant subproblem evaluations.`,
                keyPoints: [
                    'Use an index pointer let head = 0; const node = q[head++]; instead of q.shift() in JavaScript BFS queues!',
                    'new Int32Array(n) is pre-zeroed and contiguous in memory—up to 4x faster than new Array(n).fill(0) for numeric DP.',
                    'Use String.prototype.charCodeAt(i) - 97 to map lowercase "a"–"z" directly to 0–25 array indices.',
                    'JSON.stringify([a, b]) is slow for DP keys; pack 2D coordinates into a single integer key: r * COLS + c.'
                ],
                diagramTitle: 'V8 High-Performance JS DSA Patterns',
                diagramSteps: [
                    'BFS Queue: queue[head++] O(1) Pointer Dequeue',
                    'DP Table: new Int32Array(N + 1) Contiguous Buffer',
                    '2D Grid Key: const key = r * COLS + c',
                    'Char Index: s.charCodeAt(i) - 97'
                ],
                graphTitle: 'JavaScript BFS Queue Dequeue Speed (200,000 Nodes)',
                graphMetricLabel: 'Total Execution Time in Milliseconds',
                graphData: [
                    { label: 'Index Pointer Dequeue (q[head++])', value: 4, displayValue: '3.2 ms (O(N))', note: 'Zero element shifting' },
                    { label: 'Circular Ring Buffer Int32Array', value: 3, displayValue: '2.4 ms (O(N))', note: 'Fixed-size L1 cache buffer' },
                    { label: 'Array.prototype.shift() Naive Queue', value: 100, displayValue: '1,920.0 ms (O(N²))', note: '600x slower due to re-indexing!' }
                ],
                syntaxSummaryCode: `// 1. O(V + E) Fast BFS with Head Pointer Index
function shortestPathBfs(adj, start, target) {
    const queue = [[start, 0]];
    const visited = new Set([start]);
    let head = 0;

    while (head < queue.length) {
        const [node, dist] = queue[head++]; // O(1) dequeue!
        if (node === target) return dist;
        for (const nei of adj[node] ?? []) {
            if (!visited.has(nei)) {
                visited.add(nei);
                queue.push([nei, dist + 1]);
            }
        }
    }
    return -1;
}

// 2. Fast Unboxed 1D DP with Int32Array
function coinChangeMin(coins, amount) {
    const INF = amount + 1;
    const dp = new Int32Array(amount + 1).fill(INF);
    dp[0] = 0;
    for (const c of coins) {
        for (let a = c; a <= amount; a++) {
            if (dp[a - c] + 1 < dp[a]) dp[a] = dp[a - c] + 1;
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}`,
                syntaxTable: [
                    { construct: 'O(1) BFS Dequeue', syntax: 'let head = 0; const cur = q[head++];', description: 'Avoids O(N) array shift() overhead in large BFS queues.' },
                    { construct: 'Typed Int Buffer', syntax: 'const dp = new Int32Array(n);', description: 'Allocates contiguous 32-bit zero-filled integer array.' },
                    { construct: 'ASCII Offset', syntax: 's.charCodeAt(i) - 97', description: 'Maps "a".."z" to 0..25 in O(1).' },
                    { construct: 'Coordinate Key', syntax: 'const id = r * numCols + c;', description: 'Encodes (r, c) into a single collision-free integer.' }
                ],
                examples: [
                    {
                        title: 'Binary Search on Answer: Minimum Capacity to Ship Packages in D Days',
                        code: `function shipWithinDays(weights, days) {
    let lo = Math.max(...weights);
    let hi = weights.reduce((a, b) => a + b, 0);

    const canShip = (cap) => {
        let usedDays = 1, curLoad = 0;
        for (const w of weights) {
            if (curLoad + w > cap) {
                usedDays++;
                curLoad = 0;
            }
            curLoad += w;
        }
        return usedDays <= days;
    };

    while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (canShip(mid)) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}

console.log("Min Ship Capacity:", shipWithinDays([1,2,3,4,5,6,7,8,9,10], 5));`,
                        output: `Min Ship Capacity: 15`,
                        explanation: 'Because the feasibility predicate canShip(cap) is monotonic, binary searching the capacity range runs in O(N log(Sum)).'
                    }
                ],
                problems: [
                    {
                        title: 'Valid Parentheses & Bracket Matcher',
                        difficulty: 'Easy',
                        statement: 'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid and properly nested.',
                        sampleInput: 's = "{[]()}"',
                        sampleOutput: 'true',
                        constraints: '1 <= s.length <= 10^4',
                        hint: 'Push expected closing brackets onto a stack array when seeing an opener, and verify stack.pop() === ch on a closer.'
                    },
                    {
                        title: 'Clone an Undirected Connected Graph (Deep Copy)',
                        difficulty: 'Medium',
                        statement: 'Given a reference to a node in a connected undirected graph where each node has val and neighbors[], return a deep copy (clone) of the graph.',
                        sampleInput: 'adjList = [[2,4],[1,3],[2,4],[1,3]]',
                        sampleOutput: 'Deep cloned graph with identical adjacency links',
                        constraints: 'Nodes <= 100',
                        hint: 'Maintain a Map<OriginalNode, ClonedNode> visited map during DFS/BFS so shared neighbors and cycles link to the existing clone.'
                    }
                ]
            }
        ]
    }
];
