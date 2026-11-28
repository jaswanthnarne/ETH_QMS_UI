/**
 * Comprehensive 8-Language x 10-Chapter Curriculum Dataset (80 Chapters Total)
 * Languages: Python, C, Java, C++ (CPP), JavaScript (JS), HTML, CSS, OOPs
 * Every chapter contains:
 *  - Concept overview & multi-paragraph explanation
 *  - Key architectural takeaways
 *  - Visual execution/architecture flowchart steps (rendered as interactive SVG flowcharts)
 *  - Performance / Complexity / Memory benchmark graph data (rendered as visual bar/metric charts)
 *  - Syntax reference table + complete syntax cheat-sheet block
 *  - Annotated code examples with step-by-step trace & output
 *  - 2-3 related problem statements with sample I/O, constraints, and algorithmic hints
 */

import { C_AND_JAVA_TRACKS } from './languageTracksCAndJava.js';
import { CPP_AND_JS_TRACKS } from './languageTracksCppAndJs.js';
import { HTML_CSS_OOPS_TRACKS } from './languageTracksHtmlCssOops.js';

export const INITIAL_LANGUAGE_TRACKS = [
    /* =========================================================================
       1. PYTHON (10 CHAPTERS)
       ========================================================================= */
    {
        slug: 'python',
        name: 'Python',
        fullName: 'Python 3 Core & Data Structures',
        badge: 'PY',
        tagline: 'High-level, dynamically typed language powering AI, backend engineering & rapid algorithmic problem solving.',
        description:
            'Master Python from bytecode execution and dynamic object references to list comprehensions, generators, decorators, object-oriented design, and algorithmic problem patterns.',
        accentColor: '#2563EB',
        secondaryColor: '#DBEAFE',
        fileExtension: '.py',
        paradigm: 'Multi-Paradigm (Object-Oriented, Imperative, Functional)',
        creatorInfo: 'Created by Guido van Rossum • PVM Bytecode Engine',
        sortOrder: 1,
        chapters: [
            {
                chapterNumber: 1,
                title: 'Python Architecture, Memory Model & Dynamic Typing',
                duration: '14 min read',
                difficulty: 'Beginner',
                summary: 'Understand how Python compiles source code to bytecode, executes inside the Python Virtual Machine (PVM), and manages object references on the heap.',
                overview: `Python is an interpreted, high-level, dynamically typed language, but under the hood it performs a distinct compilation step before execution. When you run a script, the CPython compiler first parses your source code into an Abstract Syntax Tree (AST) and compiles it into platform-independent bytecode (.pyc). This bytecode is then executed instruction-by-instruction by the Python Virtual Machine (PVM).

Unlike C or Java where variables act as fixed-size memory boxes, variables in Python are strictly references (labels) pointing to PyObject structures allocated on the heap. Every PyObject stores three fundamental fields: a reference count (ob_refcnt) used by the garbage collector, a type pointer (ob_type), and the actual value payload. Because types are attached to objects rather than variable names, a single identifier can be rebound to an integer, a string, or a custom class instance at runtime.`,
                keyPoints: [
                    'Everything in Python is an object living on the heap; variables are lightweight name bindings (references).',
                    'Small integers (-5 to 256) and short interned strings are cached in memory for O(1) reuse.',
                    'id(obj) returns the memory address of the underlying PyObject, while is compares identity and == compares value equality.',
                    'Automatic memory management combines Reference Counting with a Generational Cyclic Garbage Collector.'
                ],
                diagramTitle: 'CPython Compilation & PVM Execution Pipeline',
                diagramSteps: [
                    'Source Code (main.py)',
                    'Lexer & AST Parser',
                    'Bytecode Compiler (.pyc)',
                    'Python Virtual Machine (PVM)',
                    'Heap PyObject & RefCount GC'
                ],
                graphTitle: 'Object Allocation & Lookup Latency (ns)',
                graphMetricLabel: 'Nanoseconds per operation (Lower is faster)',
                graphData: [
                    { label: 'Cached Small Int (-5..256)', value: 18, displayValue: '18 ns', note: 'Pre-allocated singleton pool' },
                    { label: 'Local Variable Lookup (LOAD_FAST)', value: 24, displayValue: '24 ns', note: 'Direct stack array index' },
                    { label: 'Global Variable Lookup (LOAD_GLOBAL)', value: 62, displayValue: '62 ns', note: 'Dictionary hash lookup' },
                    { label: 'New Heap Object Allocation', value: 115, displayValue: '115 ns', note: 'PyObject malloc + refcount init' }
                ],
                syntaxSummaryCode: `# Dynamic Typing, Type Introspection & Memory Identity
count: int = 42                 # Optional type hint (not enforced at runtime)
pi_val: float = 3.14159
label: str = "Ethnotech"
is_ready: bool = True

# Multiple assignment & tuple unpacking
x, y, z = 10, 20, 30
x, y = y, x                     # In-place reference swap in O(1)

# Identity vs Equality
a = [1, 2, 3]
b = [1, 2, 3]
print(a == b)                   # True  (values match)
print(a is b)                   # False (distinct heap objects)
print(type(a), id(a))           # <class 'list'> 1402348912`,
                syntaxTable: [
                    { construct: 'Variable Binding', syntax: 'name = expression', description: 'Binds identifier to a heap-allocated PyObject reference.' },
                    { construct: 'Type Check', syntax: 'isinstance(obj, (int, float))', description: 'Returns True if obj is an instance of the specified type(s).' },
                    { construct: 'Memory Identity', syntax: 'id(obj) / a is b', description: 'Inspects or compares the exact memory address of two references.' },
                    { construct: 'Formatted I/O', syntax: 'print(f"Value: {val:.2f}")', description: 'Evaluates expressions inline using fast f-string interpolation.' }
                ],
                examples: [
                    {
                        title: 'Reference Binding, Interning & Aliasing Trace',
                        code: `a = 256
b = 256
print("Small int cached:", a is b)

list_one = [10, 20]
list_two = list_one          # Aliasing: both names point to same list
list_two.append(30)
print("list_one after alias mutation:", list_one)

# Creating an independent shallow copy
list_three = list_one.copy()
list_three.append(40)
print("list_one unchanged:", list_one)
print("list_three independent:", list_three)`,
                        output: `Small int cached: True
list_one after alias mutation: [10, 20, 30]
list_one unchanged: [10, 20, 30]
list_three independent: [10, 20, 30, 40]`,
                        explanation: 'Assigning list_two = list_one copies the reference, not the underlying array. Calling .copy() or slicing [:] allocates a new list container.'
                    }
                ],
                problems: [
                    {
                        title: 'Swap & Format Telemetry ValuesWithout Temp Buffer',
                        difficulty: 'Easy',
                        statement: 'Given two numeric readings A and B as strings, parse them into floats, swap their bindings using tuple unpacking, and print their sum and product rounded to 2 decimal places.',
                        sampleInput: 'A = "12.5", B = "4.2"',
                        sampleOutput: 'A=4.20, B=12.50 | Sum=16.70 | Product=52.50',
                        constraints: '-10^6 <= A, B <= 10^6',
                        hint: 'Convert using float(A) and float(B), swap with a, b = b, a, and format with f"{val:.2f}".'
                    },
                    {
                        title: 'Detect Shared Reference Mutation Bug',
                        difficulty: 'Medium',
                        statement: 'A developer initializes a 2D grid using grid = [[0] * 3] * 3 and modifies grid[0][1] = 9. Explain why all three rows change and write the correct list comprehension to create 3 independent rows.',
                        sampleInput: 'n = 3, m = 3, update (0, 1) -> 9',
                        sampleOutput: '[[0, 9, 0], [0, 0, 0], [0, 0, 0]]',
                        constraints: '1 <= n, m <= 500',
                        hint: 'Multiplying a outer list duplicates references to the exact same inner list. Use [[0 for _ in range(m)] for _ in range(n)] instead.'
                    }
                ]
            },
            {
                chapterNumber: 2,
                title: 'Operators, Bitwise Manipulation & Control Flow',
                duration: '15 min read',
                difficulty: 'Beginner',
                summary: 'Master arithmetic, short-circuit boolean logic, bitwise operators, structural pattern matching, and loop else clauses.',
                overview: `Python provides a rich set of operators ranging from exact floor division (//) and arbitrary-precision exponentiation (**) to low-level bitwise operators (&, |, ^, ~, <<, >>). Because Python integers have arbitrary precision, bitwise shifts never overflow a 32-bit boundary unless explicitly masked with 0xFFFFFFFF.

Control flow in Python uses indentation blocks rather than braces. In addition to if/elif/else ladders and Python 3.10+ match-case structural pattern matching, Python loops (for and while) support a unique else clause: the else block executes only if the loop terminates naturally without hitting a break statement—making it ideal for search algorithms.`,
                keyPoints: [
                    'Floor division (a // b) always rounds toward negative infinity (-7 // 2 == -4). Use int(a / b) to truncate toward zero.',
                    'Boolean operators (and, or) short-circuit and return the actual operand value that determined the outcome.',
                    'Chained comparisons like 0 <= index < n evaluate the middle operand only once.',
                    'The for...else construct eliminates flag variables when searching for an element.'
                ],
                diagramTitle: 'Loop Control & Short-Circuit Evaluation Flow',
                diagramSteps: [
                    'Initialize Iterator / Condition',
                    'Check Loop Guard (True/False)',
                    'Execute Body (break / continue)',
                    'Natural Exit -> Run else: Block',
                    'Break Exit -> Skip else: Block'
                ],
                graphTitle: 'Bitwise vs Arithmetic Operation Throughput',
                graphMetricLabel: 'Relative CPU Cost (Lower is faster)',
                graphData: [
                    { label: 'Bitwise AND / XOR (x & 1, x ^ y)', value: 12, displayValue: '1.0x', note: 'Single ALU cycle' },
                    { label: 'Bit Shift (x << 1, x >> 1)', value: 15, displayValue: '1.2x', note: 'Fast power-of-two multiply/divide' },
                    { label: 'Floor Division & Modulo (x // y)', value: 42, displayValue: '3.5x', note: 'Multi-cycle division unit' },
                    { label: 'Large Power without Modulo (x ** y)', value: 95, displayValue: '8.0x', note: 'Use pow(x, y, mod) for O(log y)' }
                ],
                syntaxSummaryCode: `# Short-circuit fallback & Chained comparisons
username = input_name or "Anonymous"
if 18 <= age < 60:
    status = "Eligible"

# Structural Pattern Matching (Python 3.10+)
match http_code:
    case 200 | 201:
        msg = "Success"
    case 404:
        msg = "Not Found"
    case _:
        msg = "Unhandled Status"

# For-Else Prime Check
for d in range(2, int(n ** 0.5) + 1):
    if n % d == 0:
        print("Composite")
        break
else:
    print("Prime")`,
                syntaxTable: [
                    { construct: 'Floor & Modulo', syntax: 'q, r = divmod(a, b)', description: 'Computes (a // b, a % b) simultaneously in one C call.' },
                    { construct: 'Modular Power', syntax: 'pow(base, exp, mod)', description: 'Computes (base ** exp) % mod in O(log exp) binary exponentiation.' },
                    { construct: 'Ternary Expression', syntax: 'val = x if cond else y', description: 'Inline conditional expression evaluated lazily.' },
                    { construct: 'Bit Clear Lowest 1', syntax: 'n = n & (n - 1)', description: 'Brian Kernighan trick to clear the lowest set bit in O(1).' }
                ],
                examples: [
                    {
                        title: 'Bitwise Parity & For-Else Target Search',
                        code: `def analyze_numbers(nums, target):
    # Count set bits using Kernighan's bit trick
    bit_counts = []
    for x in nums:
         temp, cnt = x, 0
         while temp:
             temp &= (temp - 1)
             cnt += 1
         bit_counts.append((x, cnt))
    print("Set bits:", bit_counts)

    # Search with for-else
    for idx, val in enumerate(nums):
        if val == target:
            print(f"Found {target} at index {idx}")
            break
    else:
        print(f"{target} not present in array")

analyze_numbers([7, 8, 15], 15)`,
                        output: `Set bits: [(7, 3), (8, 1), (15, 4)]
Found 15 at index 2`,
                        explanation: 'n & (n - 1) strips the rightmost set bit in each iteration, running in O(k) where k is the number of 1-bits.'
                    }
                ],
                problems: [
                    {
                        title: 'Single Non-Duplicate Element via XOR',
                        difficulty: 'Easy',
                        statement: 'Given an array of integers where every element appears exactly twice except for one unique element, find that single element in O(N) time and O(1) extra space.',
                        sampleInput: 'nums = [4, 1, 2, 1, 2]',
                        sampleOutput: '4',
                        constraints: '1 <= len(nums) <= 10^5',
                        hint: 'XOR of a number with itself is 0 (a ^ a = 0), and XOR with 0 is the number itself (a ^ 0 = a).'
                    },
                    {
                        title: 'Fast Modular Exponentiation',
                        difficulty: 'Medium',
                        statement: 'Given three integers base, exp, and mod, compute (base^exp) % mod without overflowing memory when exp is up to 10^18.',
                        sampleInput: 'base = 3, exp = 200, mod = 1000000007',
                        sampleOutput: '75164984',
                        constraints: '1 <= base, exp <= 10^18, 2 <= mod <= 10^9 + 7',
                        hint: 'Square the base and halve exp at each step, or use Python built-in pow(base, exp, mod).'
                    }
                ]
            },
            {
                chapterNumber: 3,
                title: 'Strings, Unicode Internals & Text Processing',
                duration: '15 min read',
                difficulty: 'Beginner',
                summary: 'Explore immutable Unicode strings, slicing stride mechanics, O(N) string building, and core string methods.',
                overview: `Python strings (str) are immutable sequences of Unicode code points. Because strings are immutable, every concatenation using + inside a loop allocates a brand-new string and copies all existing characters, leading to O(N^2) quadratic time complexity. To build strings efficiently in O(N) time, collect fragments in a list and merge them once using "".join(parts).

Slicing a string s[start:stop:step] extracts a substring using half-open intervals [start, stop). Negative indices count backward from the end (-1 is the last character), and a negative step reverses the traversal direction (s[::-1]).`,
                keyPoints: [
                    'Strings are immutable; s[0] = "A" raises a TypeError.',
                    'Always use "".join(list_of_strings) instead of repeated += concatenation in loops.',
                    'ord(ch) converts a character to its Unicode integer code point; chr(code) converts it back.',
                    's.split() with no arguments splits on any whitespace run and automatically strips leading/trailing spaces.'
                ],
                diagramTitle: 'String Immutability vs O(N) Join Buffer Pipeline',
                diagramSteps: [
                    'Input Token Stream',
                    'Append Pieces to Mutable list[]',
                    'Single Pre-Sized Memory Allocation',
                    '"".join(pieces) -> Final Immutable str'
                ],
                graphTitle: 'Concatenating 50,000 String Fragments (Time)',
                graphMetricLabel: 'Execution Time in Milliseconds (Lower is faster)',
                graphData: [
                    { label: '"".join(list_buffer)', value: 8, displayValue: '1.2 ms', note: 'Single O(N) allocation pass' },
                    { label: 'f-string / format batch', value: 14, displayValue: '2.1 ms', note: 'Pre-calculated buffer size' },
                    { label: 'io.StringIO stream', value: 22, displayValue: '3.4 ms', note: 'Amortized stream buffer' },
                    { label: 'Naive loop s = s + chunk', value: 98, displayValue: '48.0 ms', note: 'Quadratic O(N²) reallocations' }
                ],
                syntaxSummaryCode: `s = "  Ethnotech Code2Career 2026  "
clean = s.strip()                       # "Ethnotech Code2Career 2026"
words = clean.split()                   # ['Ethnotech', 'Code2Career', '2026']
reversed_s = clean[::-1]                # Reverse string via stride -1

# Character classification & ASCII conversion
ch = 'A'
code = ord(ch)                          # 65
next_ch = chr(code + 1)                 # 'B'
print(ch.isalpha(), "42".isdigit())     # True True

# O(N) String Assembly
chars = [c.lower() for c in clean if c.isalnum()]
slug = "-".join(words).lower()          # "ethnotech-code2career-2026"`,
                syntaxTable: [
                    { construct: 'Slice Stride', syntax: 's[start:stop:step]', description: 'Extracts characters from start up to stop-1 with stride step.' },
                    { construct: 'Join Iterable', syntax: 'sep.join(iterable)', description: 'Concatenates an iterable of strings in linear O(N) time.' },
                    { construct: 'Substring Search', syntax: 's.find(sub) / sub in s', description: 'Returns lowest index of sub (or -1 if not found).' },
                    { construct: 'Replace All', syntax: 's.replace(old, new, count)', description: 'Returns a new string with occurrences of old replaced by new.' }
                ],
                examples: [
                    {
                        title: 'Two-Pointer Alphanumeric Palindrome & Frequency Map',
                        code: `def is_clean_palindrome(text: str) -> bool:
    filtered = "".join(ch.lower() for ch in text if ch.isalnum())
    return filtered == filtered[::-1]

def compress_run_length(s: str) -> str:
    if not s:
        return ""
    out = []
    count = 1
    for i in range(1, len(s)):
        if s[i] == s[i - 1]:
            count += 1
        else:
            out.append(f"{s[i-1]}{count}")
            count = 1
    out.append(f"{s[-1]}{count}")
    return "".join(out)

print("Palindrome:", is_clean_palindrome("A man, a plan, a canal: Panama"))
print("RLE:", compress_run_length("aaabbcdddd"))`,
                        output: `Palindrome: True
RLE: a3b2c1d4`,
                        explanation: 'Both functions avoid quadratic string concatenation by accumulating results in a list or generator and joining once.'
                    }
                ],
                problems: [
                    {
                        title: 'Reverse Words in a Sentence Preserving Single Spaces',
                        difficulty: 'Easy',
                        statement: 'Given a string s that may contain leading, trailing, or multiple spaces between words, return a string with the words in reverse order joined by a single space.',
                        sampleInput: 's = "  the   sky is  blue  "',
                        sampleOutput: '"blue is sky the"',
                        constraints: '1 <= len(s) <= 10^4',
                        hint: 'Use s.split() to tokenize on arbitrary whitespace, reverse the list with [::-1], and join with " ".join().'
                    },
                    {
                        title: 'Longest Substring Without Repeating Characters',
                        difficulty: 'Medium',
                        statement: 'Given a string s, find the length of the longest contiguous substring that contains no duplicate characters.',
                        sampleInput: 's = "abcabcbb"',
                        sampleOutput: '3 ("abc")',
                        constraints: '0 <= len(s) <= 5 * 10^4',
                        hint: 'Maintain a sliding window [left, right] and a dictionary mapping each character to its most recent index.'
                    }
                ]
            },
            {
                chapterNumber: 4,
                title: 'Lists, Tuples & Dynamic Array Amortized Growth',
                duration: '16 min read',
                difficulty: 'Beginner',
                summary: 'Analyze how Python lists over-allocate contiguous pointer arrays for O(1) amortized appends, and compare them with immutable tuples.',
                overview: `A Python list is not a linked list—it is a dynamic array of PyObject* pointers stored in contiguous memory. Because the block is contiguous, random indexing arr[i] takes strict O(1) time. When you call arr.append(x) and the underlying capacity is full, CPython allocates a larger array (growing by roughly 12.5% plus a small constant) and copies the pointers over, achieving O(1) amortized append time.

Conversely, inserting or deleting at the beginning of a list (arr.insert(0, x) or arr.pop(0)) shifts all N elements by one position, costing O(N) time. Tuples (tuple) are fixed-size, immutable pointer sequences that consume less memory than lists and can be used as dictionary keys if their elements are hashable.`,
                keyPoints: [
                    'Indexing arr[i], len(arr), append(x), and pop() at the end are all O(1) operations.',
                    'pop(0) and insert(0, x) are O(N) on a list; use collections.deque for O(1) double-ended pops.',
                    'arr.sort() sorts in-place using Timsort in O(N log N) time; sorted(arr) returns a new sorted list.',
                    'Tuples are immutable and slightly faster to allocate than lists.'
                ],
                diagramTitle: 'CPython Dynamic Array Over-Allocation & Timsort',
                diagramSteps: [
                    'List Header (ob_size, allocated)',
                    'Contiguous PyObject* Pointer Array',
                    'append() -> Amortized O(1) Resize',
                    'Timsort (Merge + Insertion Runs) O(N log N)'
                ],
                graphTitle: 'List Operation Time Complexity Comparison (N = 100,000)',
                graphMetricLabel: 'Relative Execution Cost (Lower is faster)',
                graphData: [
                    { label: 'Random Access / pop() at end', value: 5, displayValue: 'O(1)', note: 'Direct pointer offset' },
                    { label: 'append(x) (Amortized)', value: 8, displayValue: 'O(1)*', note: 'Occasional 1.125x geometric resize' },
                    { label: 'Timsort arr.sort()', value: 45, displayValue: 'O(N log N)', note: 'Exploits natural sorted runs' },
                    { label: 'insert(0, x) / pop(0) at head', value: 95, displayValue: 'O(N)', note: 'Memmove shifts all N pointers' }
                ],
                syntaxSummaryCode: `# List creation, slicing & comprehensions
nums = [10, 20, 30, 40, 50]
nums.append(60)                         # O(1) amortized
last = nums.pop()                       # O(1) -> 60
sub = nums[1:4]                         # [20, 30, 40]

# Custom Sorting with Key Lambda
students = [("Aarav", 88), ("Diya", 95), ("Kiran", 88)]
# Sort by score descending, then name ascending
students.sort(key=lambda item: (-item[1], item[0]))

# List Comprehension with Filtering
squares = [x * x for x in range(1, 11) if x % 2 == 0]

# Tuple unpacking with star expression
first, *middle, tail = (1, 2, 3, 4, 5)  # middle = [2, 3, 4]`,
                syntaxTable: [
                    { construct: 'Append / Pop End', syntax: 'arr.append(x) / arr.pop()', description: 'Adds or removes the last element in amortized O(1) time.' },
                    { construct: 'Extend List', syntax: 'arr.extend(iterable)', description: 'Appends all elements from iterable in O(K) time.' },
                    { construct: 'In-Place Sort', syntax: 'arr.sort(key=fn, reverse=False)', description: 'Stable Timsort in O(N log N) time and O(N) auxiliary space.' },
                    { construct: 'Bisect Search', syntax: 'bisect.bisect_left(arr, target)', description: 'Binary searches a sorted list in O(log N) time.' }
                ],
                examples: [
                    {
                        title: 'In-Place Dutch National Flag / Two-Pointer Partition',
                        code: `def move_zeros_in_place(nums: list[int]) -> list[int]:
    write_idx = 0
    for read_idx in range(len(nums)):
        if nums[read_idx] != 0:
            nums[write_idx], nums[read_idx] = nums[read_idx], nums[write_idx]
            write_idx += 1
    return nums

sample = [0, 1, 0, 3, 12]
print("Compacted:", move_zeros_in_place(sample))`,
                        output: `Compacted: [1, 3, 12, 0, 0]`,
                        explanation: 'Two pointers partition non-zero elements to the front in a single O(N) pass with O(1) memory.'
                    }
                ],
                problems: [
                    {
                        title: 'Rotate Array Right by K Steps In-Place',
                        difficulty: 'Medium',
                        statement: 'Given an integer list nums, rotate the array to the right by k steps in-place with O(1) extra space.',
                        sampleInput: 'nums = [1, 2, 3, 4, 5, 6, 7], k = 3',
                        sampleOutput: '[5, 6, 7, 1, 2, 3, 4]',
                        constraints: '1 <= len(nums) <= 10^5, 0 <= k <= 10^5',
                        hint: 'Normalize k %= len(nums), reverse the entire array, then reverse the first k elements and the remaining n-k elements.'
                    },
                    {
                        title: 'Merge Overlapping Intervals',
                        difficulty: 'Medium',
                        statement: 'Given an array of intervals where intervals[i] = [start_i, end_i], merge all overlapping intervals and return an array of the non-overlapping intervals.',
                        sampleInput: 'intervals = [[1,3],[2,6],[8,10],[15,18]]',
                        sampleOutput: '[[1,6],[8,10],[15,18]]',
                        constraints: '1 <= len(intervals) <= 10^4',
                        hint: 'Sort intervals by start time: intervals.sort(key=lambda x: x[0]), then merge if current.start <= prev.end.'
                    }
                ]
            },
            {
                chapterNumber: 5,
                title: 'Dictionaries, Hash Sets & Open-Addressing Internals',
                duration: '15 min read',
                difficulty: 'Intermediate',
                summary: 'Master O(1) hash tables in Python, compact insertion-ordered dictionaries, sets, Counter, and defaultdict.',
                overview: `Python dictionaries (dict) and sets (set) are implemented as open-addressing hash tables using pseudo-random probing for collision resolution. Since Python 3.7+, dictionaries guarantee insertion-order preservation by splitting storage into a compact sparse index table and a dense entries array—reducing memory overhead by 25% while speeding up iteration.

Because lookup, insertion, and deletion rely on hash(key), dictionary keys and set elements must be immutable (hashable) types such as int, str, or tuple of immutables. Average-case lookup key in d runs in O(1) time, making dicts and sets the primary weapon for eliminating nested O(N^2) loops.`,
                keyPoints: [
                    'Average lookup, insert, and delete in dict and set is O(1); worst-case hash collision is O(N).',
                    'Lists and dicts are unhashable and cannot be used as dict keys; convert lists to tuple(arr) or frozenset(arr).',
                    'collections.Counter tallies frequencies in one line; collections.defaultdict auto-initializes missing keys.',
                    'Set algebra (a | b, a & b, a - b, a ^ b) computes union, intersection, difference, and symmetric difference.'
                ],
                diagramTitle: 'Compact Dict Hash Table Lookup & Collision Probing',
                diagramSteps: [
                    'Key Object -> hash(key)',
                    'Mask Index (hash & mask)',
                    'Sparse Index Array Lookup',
                    'Dense Entries Table (hash, key, val)',
                    'Match or Open-Address Probe'
                ],
                graphTitle: 'Membership Lookup: Set/Dict vs List (100,000 items)',
                graphMetricLabel: 'Average Lookup Time (Log Scale Visual)',
                graphData: [
                    { label: 'dict[key] / key in set', value: 4, displayValue: '0.04 µs (O(1))', note: 'Direct hash index probe' },
                    { label: 'defaultdict / Counter increment', value: 7, displayValue: '0.07 µs (O(1))', note: 'Single hash + C factory' },
                    { label: 'Binary Search on Sorted List', value: 28, displayValue: '1.10 µs (O(log N))', note: '~17 comparisons' },
                    { label: 'Linear Scan (target in list)', value: 100, displayValue: '1,450 µs (O(N))', note: '36,000x slower than set' }
                ],
                syntaxSummaryCode: `from collections import defaultdict, Counter

# Dictionary comprehension & safe access
prices = {"python": 499, "java": 599, "cpp": 549}
val = prices.get("rust", 0)             # Returns 0 instead of KeyError
prices.setdefault("rust", 649)

# Frequency counting & top-K elements
freq = Counter("mississippi")           # Counter({'i': 4, 's': 4, 'p': 2, 'm': 1})
top_two = freq.most_common(2)           # [('i', 4), ('s', 4)]

# Grouping with defaultdict
groups = defaultdict(list)
for word in ["eat", "tea", "tan", "ate", "nat", "bat"]:
    signature = "".join(sorted(word))
    groups[signature].append(word)`,
                syntaxTable: [
                    { construct: 'Safe Lookup', syntax: 'd.get(key, default)', description: 'Returns value for key if present, else default in O(1).' },
                    { construct: 'Frequency Map', syntax: 'Counter(iterable)', description: 'Builds a hash map of element counts with .most_common(k).' },
                    { construct: 'Default Factory', syntax: 'defaultdict(list / int / set)', description: 'Automatically creates default value on first access of a missing key.' },
                    { construct: 'Set Operations', syntax: 's1 & s2 / s1 | s2 / s1 - s2', description: 'Computes intersection, union, and difference of two hash sets.' }
                ],
                examples: [
                    {
                        title: 'O(N) Two-Sum & Longest Consecutive Sequence via Hash Set',
                        code: `def two_sum_indices(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

def longest_consecutive(nums: list[int]) -> int:
    num_set = set(nums)
    best = 0
    for n in num_set:
        if (n - 1) not in num_set:  # Only start counting from sequence head
            length = 1
            while (n + length) in num_set:
                length += 1
            best = max(best, length)
    return best

print("Two sum:", two_sum_indices([2, 7, 11, 15], 9))
print("Longest consecutive run:", longest_consecutive([100, 4, 200, 1, 3, 2]))`,
                        output: `Two sum: [0, 1]
Longest consecutive run: 4`,
                        explanation: 'Checking (n - 1) not in num_set ensures each consecutive chain is traversed only once from its minimum value, achieving strict O(N) time.'
                    }
                ],
                problems: [
                    {
                        title: 'Subarray Sum Equals K',
                        difficulty: 'Medium',
                        statement: 'Given an array of integers nums and an integer k, return the total number of contiguous subarrays whose sum equals k in O(N) time.',
                        sampleInput: 'nums = [1, 2, 3, -1, 1, 2], k = 3',
                        sampleOutput: '4',
                        constraints: '1 <= len(nums) <= 2 * 10^4, -1000 <= nums[i] <= 1000',
                        hint: 'Maintain a running prefix_sum and a hash map of prefix sum frequencies initialized with {0: 1}. Check if (prefix_sum - k) is in the map.'
                    },
                    {
                        title: 'Group Anagrams Together',
                        difficulty: 'Medium',
                        statement: 'Given an array of strings strs, group the anagrams together in O(N * K) time where K is the maximum string length.',
                        sampleInput: 'strs = ["eat","tea","tan","ate","nat","bat"]',
                        sampleOutput: '[["eat","tea","ate"],["tan","nat"],["bat"]]',
                        constraints: '1 <= len(strs) <= 10^4, lowercase English letters',
                        hint: 'Use a 26-element tuple of character counts tuple(counts) as the defaultdict(list) key.'
                    }
                ]
            },
            {
                chapterNumber: 6,
                title: 'Functions, Closures, Decorators & LEGB Scope',
                duration: '15 min read',
                difficulty: 'Intermediate',
                summary: 'Understand first-class functions, *args/**kwargs unpacking, the LEGB scope resolution rule, closures, and higher-order decorators.',
                overview: `In Python, functions are first-class objects: they can be assigned to variables, passed as arguments, returned from other functions, and stored in data structures. Name resolution follows the LEGB rule: Local -> Enclosing (closure) -> Global (module) -> Built-in.

A closure occurs when an inner function remembers variables from its enclosing lexical scope even after the outer function has finished executing. Decorators (@decorator) build on closures to wrap a function with pre/post logic—such as memoization (@lru_cache), timing telemetry, authentication checks, or retry handlers—without modifying the function's core body.`,
                keyPoints: [
                    'Never use a mutable object (like def fn(items=[]):) as a default parameter; default values are evaluated only once at function definition time!',
                    'Use nonlocal to rebind an enclosing closure variable, and global to rebind a module-level variable.',
                    'functools.lru_cache(None) turns recursive exponential functions into O(N) dynamic programming memoized solutions.',
                    'Always wrap custom decorators with @functools.wraps(fn) to preserve the original function name and docstring.'
                ],
                diagramTitle: 'LEGB Scope Lookup & Decorator Wrapping Pipeline',
                diagramSteps: [
                    'Local Frame (L)',
                    'Enclosing Closure Cell (E)',
                    'Module Global Dict (G)',
                    'Builtins Namespace (B)',
                    '@decorator -> wrapper(*args, **kwargs)'
                ],
                graphTitle: 'Fibonacci(35): Naive Recursion vs @lru_cache Memoization',
                graphMetricLabel: 'Function Calls Executed (Logarithmic comparison)',
                graphData: [
                    { label: '@lru_cache Memoized Recursion', value: 4, displayValue: '36 calls (0.02 ms)', note: 'O(N) cached lookup' },
                    { label: 'Iterative Tuple Unpacking', value: 3, displayValue: '35 steps (0.01 ms)', note: 'O(N) time, O(1) space' },
                    { label: 'Naive Uncached fib(25)', value: 48, displayValue: '242,785 calls (32 ms)', note: 'O(2^N) branching tree' },
                    { label: 'Naive Uncached fib(35)', value: 100, displayValue: '29,860,703 calls (3,900 ms)', note: 'Exponential explosion' }
                ],
                syntaxSummaryCode: `from functools import wraps, lru_cache
import time

# Safe default parameter pattern
def append_tag(tag: str, bucket: list | None = None) -> list:
    if bucket is None:
        bucket = []
    bucket.append(tag)
    return bucket

# Custom Execution Timer Decorator
def trace_time(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        t0 = time.perf_counter()
        result = fn(*args, **kwargs)
        elapsed = (time.perf_counter() - t0) * 1000
        print(f"[{fn.__name__}] completed in {elapsed:.3f} ms")
        return result
    return wrapper

@lru_cache(maxsize=None)
def climb_stairs(n: int) -> int:
    if n <= 2:
        return n
    return climb_stairs(n - 1) + climb_stairs(n - 2)`,
                syntaxTable: [
                    { construct: 'Variadic Positional', syntax: 'def fn(*args):', description: 'Collects extra positional arguments into a tuple.' },
                    { construct: 'Variadic Keyword', syntax: 'def fn(**kwargs):', description: 'Collects extra keyword arguments into a dictionary.' },
                    { construct: 'Closure Rebinding', syntax: 'nonlocal count', description: 'Allows inner function to modify variable in enclosing scope.' },
                    { construct: 'Memoization Cache', syntax: '@lru_cache(maxsize=None)', description: 'Caches function return values keyed by argument tuple.' }
                ],
                examples: [
                    {
                        title: 'Stateful Closure Counter & Retry Decorator',
                        code: `from functools import wraps

def make_rate_limiter(limit: int):
    calls = 0
    def check(action: str) -> str:
        nonlocal calls
        calls += 1
        if calls > limit:
            return f"BLOCKED '{action}' (call #{calls} exceeds limit {limit})"
        return f"ALLOWED '{action}' (call #{calls}/{limit})"
    return check

limiter = make_rate_limiter(2)
print(limiter("fetch_profile"))
print(limiter("submit_code"))
print(limiter("export_report"))`,
                        output: `ALLOWED 'fetch_profile' (call #1/2)
ALLOWED 'submit_code' (call #2/2)
BLOCKED 'export_report' (call #3 exceeds limit 2)`,
                        explanation: 'The inner function check retains a live reference to calls in its closure cell across invocations.'
                    }
                ],
                problems: [
                    {
                        title: 'Implement a Custom Memoize Decorator',
                        difficulty: 'Medium',
                        statement: 'Write a decorator @memoize that caches the return value of any function taking hashable positional arguments, and tracks cache_hits on the wrapper function.',
                        sampleInput: 'fib(10) called twice',
                        sampleOutput: 'Result: 55 | Cache Hits: 9',
                        constraints: 'Arguments are hashable primitives or tuples',
                        hint: 'Store cache = {} in the decorator closure, check if args in cache, increment wrapper.cache_hits, and return cache[args].'
                    },
                    {
                        title: 'Decode Ways with Top-Down Memoization',
                        difficulty: 'Medium',
                        statement: 'A message containing letters A-Z is encoded to numbers "1" to "26". Given a digit string s, return the number of ways to decode it using recursion + @lru_cache.',
                        sampleInput: 's = "226"',
                        sampleOutput: '3 ("BZ", "VF", "BBF")',
                        constraints: '1 <= len(s) <= 100',
                        hint: 'Define dfs(i) returning ways to decode s[i:]. Base case: i == len(s) returns 1; s[i] == "0" returns 0.'
                    }
                ]
            },
            {
                chapterNumber: 7,
                title: 'Object-Oriented Python, Dunder Methods & @dataclass',
                duration: '16 min read',
                difficulty: 'Intermediate',
                summary: 'Design clean Python classes using __init__, magic dunder protocols, @property encapsulation, inheritance MRO, and @dataclass.',
                overview: `Python supports full Object-Oriented Programming where classes themselves are instances of type. Special double-underscore ("dunder") methods let your custom objects integrate seamlessly with built-in syntax: __init__ initializes attributes, __repr__ provides an unambiguous developer string, __lt__ enables sorting with <, and __len__ / __getitem__ make objects behave like sequences.

For classes that primarily hold state, Python's @dataclass decorator automatically generates __init__, __repr__, and __eq__, while __slots__ replaces the per-instance __dict__ hash table with a fixed-size C array—cutting memory usage by up to 50% when instantiating millions of objects.`,
                keyPoints: [
                    'Always pass self explicitly as the first parameter of instance methods.',
                    'Use @property and @attr.setter to expose computed attributes with validation while keeping clean dot access.',
                    'Define __lt__(self, other) to allow custom objects to be pushed directly into a heapq priority queue or sorted.',
                    'Declare __slots__ = ("x", "y") on high-volume node classes (like TrieNode or TreeNode) to save RAM.'
                ],
                diagramTitle: 'Python Class Instantiation & MRO Lookup Chain',
                diagramSteps: [
                    'Class Call Node(val)',
                    '__new__(cls) Allocates Object',
                    '__init__(self, val) Populates State',
                    'Dunder Protocol (__repr__, __lt__, __eq__)',
                    'C3 Linearization MRO Method Lookup'
                ],
                graphTitle: 'Memory Footprint for 1,000,000 Point(x, y) Instances',
                graphMetricLabel: 'RAM Consumed in Megabytes (Lower is better)',
                graphData: [
                    { label: 'Class with __slots__ = ("x", "y")', value: 32, displayValue: '48 MB', note: 'Compact C descriptor array' },
                    { label: 'collections.namedtuple', value: 38, displayValue: '56 MB', note: 'Immutable tuple subclass' },
                    { label: '@dataclass(slots=True)', value: 32, displayValue: '48 MB', note: 'Auto-methods + slot storage' },
                    { label: 'Standard Class with __dict__', value: 96, displayValue: '152 MB', note: 'Per-instance hash table overhead' }
                ],
                syntaxSummaryCode: `from dataclasses import dataclass

@dataclass(order=True, slots=True)
class JobCandidate:
    score: int
    name: str
    usn: str

class BankVault:
    __slots__ = ("owner", "_balance")

    def __init__(self, owner: str, balance: float = 0.0):
        self.owner = owner
        self._balance = balance

    @property
    def balance(self) -> float:
        return self._balance

    def deposit(self, amount: float) -> None:
        if amount <= 0:
            raise ValueError("Deposit must be positive")
        self._balance += amount

    def __repr__(self) -> str:
        return f"BankVault(owner={self.owner!r}, balance={self._balance:.2f})"`,
                syntaxTable: [
                    { construct: 'Constructor', syntax: 'def __init__(self, ...):', description: 'Initializes instance attributes after object allocation.' },
                    { construct: 'Developer String', syntax: 'def __repr__(self) -> str:', description: 'Unambiguous string representation used in logs and REPL.' },
                    { construct: 'Comparison Hook', syntax: 'def __lt__(self, other):', description: 'Enables < comparison for sorting and heapq priority queues.' },
                    { construct: 'Class / Static', syntax: '@classmethod / @staticmethod', description: 'Methods receiving cls (factory) or no implicit first argument.' }
                ],
                examples: [
                    {
                        title: 'Custom Priority Task with __lt__ and @dataclass',
                        code: `import heapq
from dataclasses import dataclass, field

@dataclass(order=True)
class Task:
    priority: int
    title: str = field(compare=False)

pq = []
heapq.heappush(pq, Task(3, "Write unit tests"))
heapq.heappush(pq, Task(1, "Fix production auth bug"))
heapq.heappush(pq, Task(2, "Deploy staging build"))

while pq:
    task = heapq.heappop(pq)
    print(f"P{task.priority}: {task.title}")`,
                        output: `P1: Fix production auth bug
P2: Deploy staging build
P3: Write unit tests`,
                        explanation: 'With order=True and field(compare=False) on title, heapq compares Task instances strictly by priority.'
                    }
                ],
                problems: [
                    {
                        title: 'Design an LRU Cache Class',
                        difficulty: 'Medium',
                        statement: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache with O(1) get(key) and O(1) put(key, value) operations.',
                        sampleInput: 'LRUCache(2) -> put(1,1), put(2,2), get(1), put(3,3), get(2)',
                        sampleOutput: 'get(1) -> 1, get(2) -> -1 (evicted)',
                        constraints: '1 <= capacity <= 3000',
                        hint: 'Use collections.OrderedDict (with move_to_end and popitem(last=False)) or a doubly linked list paired with a hash map.'
                    },
                    {
                        title: 'Implement a Fraction Class with Operator Overloading',
                        difficulty: 'Easy',
                        statement: 'Create a Fraction(num, den) class that automatically simplifies itself using math.gcd and implements __add__, __mul__, and __str__.',
                        sampleInput: 'Fraction(1, 4) + Fraction(1, 2)',
                        sampleOutput: '3/4',
                        constraints: 'den != 0',
                        hint: 'In __init__, divide both num and den by math.gcd(num, den) and normalize the sign so den > 0.'
                    }
                ]
            },
            {
                chapterNumber: 8,
                title: 'Iterators, Generators, Context Managers & File I/O',
                duration: '15 min read',
                difficulty: 'Intermediate',
                summary: 'Process massive data streams in O(1) memory using lazy yield generators, itertools, and deterministic with context managers.',
                overview: `When processing a 10 GB log file or a billion-row stream, loading all records into a list exhausts system RAM. Python generators solve this through lazy evaluation: any function containing the yield keyword returns a generator iterator that produces one item at a time on demand, pausing and resuming its local stack frame between next() calls in O(1) auxiliary memory.

Resource management in Python relies on the Context Manager protocol (__enter__ and __exit__) invoked via the with statement. Whether a block completes normally or raises an exception, __exit__ is guaranteed to run—automatically closing file descriptors, database transactions, or thread locks.`,
                keyPoints: [
                    'Generator expressions (x*x for x in range(N)) use parentheses and consume O(1) memory regardless of N.',
                    'yield suspends function execution and preserves all local variables until the next item is requested.',
                    'Always open files with with open(path, "r", encoding="utf-8") as f: to prevent file-handle leaks.',
                    'itertools (chain, islice, groupby, permutations, combinations, accumulate) provides C-speed lazy stream combinators.'
                ],
                diagramTitle: 'Lazy Generator State Suspension vs Eager List Allocation',
                diagramSteps: [
                    'Caller requests next(gen)',
                    'Generator Frame Resumes Execution',
                    'yield value -> Returns Item to Caller',
                    'Frame Pauses (O(1) Memory Retained)',
                    'Exhausted -> Raises StopIteration'
                ],
                graphTitle: 'Memory Usage Streaming 10,000,000 Records',
                graphMetricLabel: 'Peak Memory Footprint (MB)',
                graphData: [
                    { label: 'Generator Function (yield)', value: 2, displayValue: '0.12 MB (O(1))', note: 'Single active stack frame' },
                    { label: 'Generator Expression (x for x in ...)', value: 2, displayValue: '0.12 MB (O(1))', note: 'Lazy iterator pipeline' },
                    { label: 'Eager List Comprehension [...]', value: 85, displayValue: '385 MB (O(N))', note: 'Allocates 10M objects upfront' },
                    { label: 'readlines() on Large Log File', value: 100, displayValue: '510 MB (O(N))', note: 'Loads entire file into RAM' }
                ],
                syntaxSummaryCode: `from contextlib import contextmanager
import itertools

# Lazy Infinite / Stream Generator
def fibonacci_stream(limit: int):
    a, b = 0, 1
    for _ in range(limit):
        yield a
        a, b = b, a + b

# Memory-efficient sum using generator expression
total = sum(x * x for x in range(1_000_000))

# Custom Context Manager
@contextmanager
def managed_transaction(db_name: str):
    print(f"BEGIN transaction on {db_name}")
    try:
        yield db_name
        print("COMMIT")
    except Exception as exc:
        print(f"ROLLBACK due to {exc}")
        raise`,
                syntaxTable: [
                    { construct: 'Generator Yield', syntax: 'yield expression', description: 'Produces a value lazily and suspends the function frame.' },
                    { construct: 'Delegate Generator', syntax: 'yield from sub_iterable', description: 'Yields all items directly from a nested generator or iterable.' },
                    { construct: 'Context Manager', syntax: 'with open(file, "r") as f:', description: 'Guarantees deterministic cleanup via __enter__ and __exit__.' },
                    { construct: 'Prefix Sums', syntax: 'itertools.accumulate(nums)', description: 'Lazily yields running totals in O(N) time.' }
                ],
                examples: [
                    {
                        title: 'Chunked Batch Stream Processor with yield',
                        code: `from itertools import islice

def batch_stream(iterable, batch_size: int):
    iterator = iter(iterable)
    while chunk := list(islice(iterator, batch_size)):
        yield chunk

records = range(1, 11)
for idx, batch in enumerate(batch_stream(records, 4), start=1):
    print(f"Batch #{idx}: {batch}")`,
                        output: `Batch #1: [1, 2, 3, 4]
Batch #2: [5, 6, 7, 8]
Batch #3: [9, 10]`,
                        explanation: 'islice pulls at most batch_size items at a time from any iterator without materializing the rest of the stream.'
                    }
                ],
                problems: [
                    {
                        title: 'Flatten Arbitrarily Nested List Using yield from',
                        difficulty: 'Medium',
                        statement: 'Given a deeply nested list of integers such as [1, [2, [3, 4], 5], 6], write a recursive generator flatten(nested) that yields all integers in order.',
                        sampleInput: 'nested = [1, [2, [3, 4], 5], [], 6]',
                        sampleOutput: '[1, 2, 3, 4, 5, 6]',
                        constraints: 'Nesting depth <= 500',
                        hint: 'Loop over each item: if isinstance(item, list), use yield from flatten(item); otherwise yield item.'
                    },
                    {
                        title: 'Sliding Window Moving Average Stream',
                        difficulty: 'Easy',
                        statement: 'Write a generator moving_average(stream, k) that accepts an iterable of numbers and yields the average of each sliding window of size k in O(K) space.',
                        sampleInput: 'stream = [10, 20, 30, 40, 50], k = 3',
                        sampleOutput: '[20.0, 30.0, 40.0]',
                        constraints: '1 <= k <= len(stream) <= 10^6',
                        hint: 'Maintain a collections.deque(maxlen=k) and a running window sum.'
                    }
                ]
            },
            {
                chapterNumber: 9,
                title: 'Exception Handling, Modules, Typing & Testing',
                duration: '14 min read',
                difficulty: 'Intermediate',
                summary: 'Build resilient production software with structured exception hierarchies, custom errors, static type annotations, and unit tests.',
                overview: `Python follows the EAFP principle ("Easier to Ask for Forgiveness than Permission"), using structured try / except / else / finally blocks to handle runtime faults cleanly. Every exception must inherit from Exception (not BaseException, which is reserved for SystemExit and KeyboardInterrupt).

In multi-file engineering projects, code is organized into modules (.py files) and packages (directories). Guarding entry-point scripts with if __name__ == "__main__": ensures that importing a module for unit testing does not accidentally execute its CLI runner.`,
                keyPoints: [
                    'Catch specific exception subclasses (e.g., except (ValueError, KeyError) as err:) rather than a bare except:.',
                    'The else block in a try statement runs only if no exception was raised inside try.',
                    'The finally block always executes, even if the function returns early or re-raises an exception.',
                    'Use raise CustomError("context") from original_err to preserve exception chaining tracebacks.'
                ],
                diagramTitle: 'Structured Exception Handling Lifecycle',
                diagramSteps: [
                    'try: Execute Protected Code',
                    'Exception Raised? -> Match except: Clause',
                    'No Exception? -> Run else: Block',
                    'Always Execute finally: Cleanup'
                ],
                graphTitle: 'Bug Detection Phase Cost Multiplier in Software Engineering',
                graphMetricLabel: 'Relative Cost to Diagnose & Fix',
                graphData: [
                    { label: 'Static Type Hints + IDE Check', value: 8, displayValue: '1x (Instant)', note: 'Caught before execution' },
                    { label: 'Automated Unit Test (pytest)', value: 18, displayValue: '2.5x (Seconds)', note: 'Isolated assertion failure' },
                    { label: 'Integration / Staging QA', value: 52, displayValue: '12x (Hours)', note: 'Cross-service debugging' },
                    { label: 'Unhandled Production Crash', value: 100, displayValue: '50x (Critical)', note: 'Downtime & data recovery' }
                ],
                syntaxSummaryCode: `class InsufficientBalanceError(Exception):
    """Raised when withdrawal exceeds available account funds."""
    def __init__(self, balance: float, requested: float):
        super().__init__(f"Balance {balance:.2f} < requested {requested:.2f}")
        self.balance = balance
        self.requested = requested

def parse_and_divide(raw_num: str, raw_den: str) -> float:
    try:
        num = float(raw_num)
        den = float(raw_den)
        result = num / den
    except ValueError as err:
        raise ValueError("Inputs must be valid numbers") from err
    except ZeroDivisionError:
        return float("inf")
    else:
        return round(result, 4)
    finally:
        pass  # Always runs`,
                syntaxTable: [
                    { construct: 'Catch Specific', syntax: 'except ValueError as e:', description: 'Catches ValueError and binds the exception instance to e.' },
                    { construct: 'Try-Else', syntax: 'else:', description: 'Runs only when the try block succeeds without any exception.' },
                    { construct: 'Guaranteed Cleanup', syntax: 'finally:', description: 'Executes unconditionally before leaving the try statement.' },
                    { construct: 'Module Entry Guard', syntax: 'if __name__ == "__main__":', description: 'Runs block only when file is executed directly, not imported.' }
                ],
                examples: [
                    {
                        title: 'Domain Validation with Custom Exception Hierarchy',
                        code: `class ValidationError(Exception):
    pass

def validate_exam_score(usn: str, marks: int) -> dict:
    if not usn or len(usn.strip()) < 5:
        raise ValidationError(f"Invalid USN '{usn}'")
    if not (0 <= marks <= 100):
        raise ValidationError(f"Marks {marks} out of [0, 100] range")
    return {"usn": usn.strip().upper(), "marks": marks, "grade": "PASS" if marks >= 40 else "FAIL"}

for sample in [("4MT22CS001", 86), ("4MT22CS002", 140)]:
    try:
        record = validate_exam_score(*sample)
    except ValidationError as exc:
        print("Validation rejected:", exc)
    else:
        print("Validated record:", record)`,
                        output: `Validated record: {'usn': '4MT22CS001', 'marks': 86, 'grade': 'PASS'}
Validation rejected: Marks 140 out of [0, 100] range`,
                        explanation: 'Separating domain validation errors from unexpected crashes keeps API controllers predictable and testable.'
                    }
                ],
                problems: [
                    {
                        title: 'Safe JSON Configuration Loader with Fallback Defaults',
                        difficulty: 'Easy',
                        statement: 'Write a function load_config(json_str, required_keys) that parses a JSON string using json.loads, verifies all required_keys exist, and returns (True, data) or (False, error_message) without crashing.',
                        sampleInput: 'json_str = \'{"host": "localhost"}\', required_keys = ["host", "port"]',
                        sampleOutput: '(False, "Missing required key: port")',
                        constraints: 'len(json_str) <= 10^4',
                        hint: 'Catch json.JSONDecodeError for malformed JSON and check missing keys using set difference.'
                    },
                    {
                        title: 'String to 32-Bit Signed Integer (myAtoi) with Overflow Guard',
                        difficulty: 'Medium',
                        statement: 'Convert a string with optional leading spaces and +/- sign into a 32-bit signed integer clamped to [-2^31, 2^31 - 1].',
                        sampleInput: 's = "   -42 with words"',
                        sampleOutput: '-42',
                        constraints: 'Clamp result to [-2147483648, 2147483647]',
                        hint: 'Strip leading spaces, parse sign, accumulate digits while ch.isdigit(), and clamp with max(-2**31, min(2**31 - 1, val)).'
                    }
                ]
            },
            {
                chapterNumber: 10,
                title: 'Algorithmic Patterns: Heaps, Deques, Bisect & Graphs in Python',
                duration: '18 min read',
                difficulty: 'Advanced',
                summary: 'Master Python standard-library algorithmic workhorses: collections.deque, heapq priority queues, bisect binary search, and BFS/DFS graph traversal.',
                overview: `In technical coding rounds and Code2Career assessments, writing optimal solutions requires choosing the right standard-library data structure:
1. collections.deque: Double-ended queue backed by a doubly-linked block list supporting strict O(1) appendleft() and popleft()—essential for BFS and monotonic sliding windows.
2. heapq: Binary min-heap operations on a standard list (heappush, heappop, heapify in O(N)). To simulate a max-heap, negate numeric priorities (-val).
3. bisect: C-accelerated binary search (bisect_left, bisect_right) on sorted lists for O(log N) range queries and Longest Increasing Subsequence (LIS).`,
                keyPoints: [
                    'Never use list.pop(0) in BFS—always use deque.popleft() to guarantee O(V + E) graph traversal.',
                    'heapq.heapify(arr) converts an unsorted list into a valid min-heap in linear O(N) time.',
                    'To find the K largest elements in O(N log K), maintain a min-heap of size K or call heapq.nlargest(k, arr).',
                    'bisect_left(arr, x) returns the leftmost insertion index where all elements to the left are strictly < x.'
                ],
                diagramTitle: 'Python Competitive DSA Toolkit Architecture',
                diagramSteps: [
                    'BFS / Sliding Window -> collections.deque O(1)',
                    'Top-K / Dijkstra -> heapq Min-Heap O(log N)',
                    'Sorted Lower/Upper Bound -> bisect_left O(log N)',
                    'Graph Adjacency -> defaultdict(list)'
                ],
                graphTitle: 'BFS Queue Benchmark: deque.popleft() vs list.pop(0) (200K ops)',
                graphMetricLabel: 'Total Execution Time (ms)',
                graphData: [
                    { label: 'collections.deque.popleft()', value: 4, displayValue: '6.5 ms (O(N))', note: 'Pointer unlink in O(1)' },
                    { label: 'heapq.heappop() priority queue', value: 18, displayValue: '42.0 ms (O(N log N))', note: 'Logarithmic sift-down' },
                    { label: 'bisect_left binary search', value: 10, displayValue: '19.0 ms (O(N log N))', note: 'C binary search loop' },
                    { label: 'list.pop(0) naive queue', value: 100, displayValue: '2,850.0 ms (O(N²))', note: 'Time Limit Exceeded (TLE)' }
                ],
                syntaxSummaryCode: `from collections import deque, defaultdict
import heapq
import bisect

# 1. O(V + E) Breadth-First Search with deque
def shortest_path_bfs(graph: dict, start: int, goal: int) -> int:
    queue = deque([(start, 0)])
    visited = {start}
    while queue:
        node, dist = queue.popleft()
        if node == goal:
            return dist
        for nei in graph[node]:
            if nei not in visited:
                visited.add(nei)
                queue.append((nei, dist + 1))
    return -1

# 2. Top-K Frequent / Largest with Min-Heap
def kth_largest(nums: list[int], k: int) -> int:
    min_heap = nums[:k]
    heapq.heapify(min_heap)
    for x in nums[k:]:
        if x > min_heap[0]:
            heapq.heapreplace(min_heap, x)
    return min_heap[0]

# 3. Binary Search Lower Bound with bisect
idx = bisect.bisect_left([10, 20, 20, 30], 20)  # idx = 1`,
                syntaxTable: [
                    { construct: 'Deque O(1) Queue', syntax: 'q = deque([start]); q.popleft()', description: 'Removes front element in strict O(1) time.' },
                    { construct: 'Min-Heap Push/Pop', syntax: 'heappush(h, x) / heappop(h)', description: 'Inserts or extracts minimum element in O(log N) time.' },
                    { construct: 'Linear Heapify', syntax: 'heapq.heapify(arr)', description: 'Transforms list into a valid min-heap in-place in O(N) time.' },
                    { construct: 'Lower Bound', syntax: 'bisect.bisect_left(arr, target)', description: 'First index i where arr[i] >= target in O(log N).' }
                ],
                examples: [
                    {
                        title: 'Dijkstra Shortest Path & Longest Increasing Subsequence (O(N log N))',
                        code: `import heapq, bisect

def length_of_lis(nums: list[int]) -> int:
    tails = []
    for x in nums:
        idx = bisect.bisect_left(tails, x)
        if idx == len(tails):
            tails.append(x)
        else:
            tails[idx] = x
    return len(tails)

print("LIS length:", length_of_lis([10, 9, 2, 5, 3, 7, 101, 18]))`,
                        output: `LIS length: 4`,
                        explanation: 'Maintaining the minimal tail of increasing subsequences via bisect_left reduces LIS from O(N^2) to O(N log N).'
                    }
                ],
                problems: [
                    {
                        title: 'Sliding Window Maximum in O(N) Time',
                        difficulty: 'Hard',
                        statement: 'Given an array of integers nums and a sliding window of size k moving from left to right, return the maximum value in each window in O(N) time.',
                        sampleInput: 'nums = [1,3,-1,-3,5,3,6,7], k = 3',
                        sampleOutput: '[3,3,5,5,6,7]',
                        constraints: '1 <= k <= len(nums) <= 10^5',
                        hint: 'Maintain a monotonic decreasing deque of indices: pop smaller elements from the right before appending i, and pop expired indices (<= i - k) from the left.'
                    },
                    {
                        title: 'Merge K Sorted Lists Using a Min-Heap',
                        difficulty: 'Hard',
                        statement: 'Given k sorted integer arrays, merge them into one single sorted array in O(N log K) time.',
                        sampleInput: 'lists = [[1,4,5],[1,3,4],[2,6]]',
                        sampleOutput: '[1,1,2,3,4,4,5,6]',
                        constraints: 'Total elements N <= 10^5',
                        hint: 'Push (lists[i][0], i, 0) into a min-heap for each non-empty list, then repeatedly pop the smallest and push the next element from that same list.'
                    }
                ]
            }
        ]
    }
];

export const ALL_LANGUAGE_TRACKS = [
    ...INITIAL_LANGUAGE_TRACKS,
    ...C_AND_JAVA_TRACKS,
    ...CPP_AND_JS_TRACKS,
    ...HTML_CSS_OOPS_TRACKS
];

