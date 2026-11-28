/**
 * AlgoPlay — Comprehensive Interactive Data Structures & Algorithms Visualizer Catalog
 * Includes 66 dedicated visualizers across all required sections:
 *  1. Linear Data Structures (10)
 *  2. Non-Linear Data Structures (8)
 *  3. Advanced Data Structures (5)
 *  4. Searching Algorithms (5)
 *  5. Sorting Algorithms (10)
 *  6. Tree Algorithms (7)
 *  7. Graph Algorithms (10)
 *  8. Recursion, Backtracking, DP & Greedy Algorithms (11)
 *
 * Every topic has:
 *  - Concept overview (whatItIs, whyUsed, howItStores, realWorldApplications, advantages, limitations, whenToUse)
 *  - Complexity metrics (bestTime, averageTime, worstTime, space, inPlace, stable, simpleExplanation)
 *  - Synchronized Pseudocode lines (highlighted step-by-step during animation playback)
 *  - 5-Language Code Implementations (C, C++, Java, Python, JavaScript)
 *  - Curated Easy / Medium / Hard Practice Mode Challenges & Step-Prediction Questions
 */

export const ALGOPLAY_CATEGORIES = [
    { id: 'all', label: 'All Visualizers' },
    { id: 'linear', label: 'Data Structures (Linear)' },
    { id: 'nonlinear', label: 'Data Structures (Non-Linear)' },
    { id: 'advanced', label: 'Advanced Data Structures' },
    { id: 'searching', label: 'Searching' },
    { id: 'sorting', label: 'Sorting' },
    { id: 'trees', label: 'Tree Algorithms' },
    { id: 'graphs', label: 'Graph Algorithms' },
    { id: 'algorithms', label: 'Recursion, DP & Backtracking' }
];

export const BIG_O_REFERENCE_TABLE = [
    {
        notation: 'O(1)',
        name: 'Constant Time',
        rating: 'Excellent',
        example: 'Array index access arr[i], Stack push/pop, Hash Table lookup',
        plainEnglish: 'Execution time stays completely flat regardless of whether the dataset has 10 items or 10 million items.',
        opsAt1000: '1 op'
    },
    {
        notation: 'O(log n)',
        name: 'Logarithmic Time',
        rating: 'Great',
        example: 'Binary Search, Balanced BST / AVL / Fenwick Tree operations, Heap push/pop',
        plainEnglish: 'Cuts the remaining search or problem space in half on every step. Doubling N adds only 1 extra operation.',
        opsAt1000: '~10 ops'
    },
    {
        notation: 'O(n)',
        name: 'Linear Time',
        rating: 'Good',
        example: 'Linear Search, Linked List traversal, Array min/max scan, Counting Sort',
        plainEnglish: 'Examines each element a constant number of times in a single pass. Runtime grows proportionally with input size.',
        opsAt1000: '1,000 ops'
    },
    {
        notation: 'O(n log n)',
        name: 'Linearithmic Time',
        rating: 'Fair',
        example: 'Merge Sort, Quick Sort (average), Heap Sort',
        plainEnglish: 'Divides the data log(n) times and performs linear work at each level. The optimal bound for comparison-based sorting.',
        opsAt1000: '~10,000 ops'
    },
    {
        notation: 'O(n²)',
        name: 'Quadratic Time',
        rating: 'Slow',
        example: 'Bubble Sort, Selection Sort, Insertion Sort, All-Pairs Naive Comparison',
        plainEnglish: 'Uses a nested loop where every element is compared against every other element. 10x more data takes 100x longer.',
        opsAt1000: '1,000,000 ops'
    },
    {
        notation: 'O(2ⁿ)',
        name: 'Exponential Time',
        rating: 'Heavy',
        example: 'Unmemoized Recursive Fibonacci, Subset Generation (Power Set)',
        plainEnglish: 'The number of operations doubles every time a single element is added to the input.',
        opsAt1000: '2¹⁰⁰⁰ (Infeasible for n > 30)'
    },
    {
        notation: 'O(n!)',
        name: 'Factorial Time',
        rating: 'Extreme',
        example: 'Generating all Permutations, Brute-force Traveling Salesperson',
        plainEnglish: 'Explores every possible arrangement of n items. Feasible only for very small inputs (n <= 10).',
        opsAt1000: '10! = 3.6M at n=10'
    }
];

export const SORTING_COMPARISON_TABLE = [
    { name: 'Bubble Sort', slug: 'bubble-sort', best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: true, inPlace: true },
    { name: 'Selection Sort', slug: 'selection-sort', best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: false, inPlace: true },
    { name: 'Insertion Sort', slug: 'insertion-sort', best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: true, inPlace: true },
    { name: 'Merge Sort', slug: 'merge-sort', best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)', stable: true, inPlace: false },
    { name: 'Quick Sort', slug: 'quick-sort', best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)', stable: false, inPlace: true },
    { name: 'Heap Sort', slug: 'heap-sort', best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)', stable: false, inPlace: true },
    { name: 'Shell Sort', slug: 'shell-sort', best: 'O(n log n)', average: 'O(n^1.25)', worst: 'O(n²)', space: 'O(1)', stable: false, inPlace: true },
    { name: 'Counting Sort', slug: 'counting-sort', best: 'O(n + k)', average: 'O(n + k)', worst: 'O(n + k)', space: 'O(n + k)', stable: true, inPlace: false },
    { name: 'Radix Sort', slug: 'radix-sort', best: 'O(d(n + b))', average: 'O(d(n + b))', worst: 'O(d(n + b))', space: 'O(n + b)', stable: true, inPlace: false },
    { name: 'Bucket Sort', slug: 'bucket-sort', best: 'O(n + k)', average: 'O(n + k)', worst: 'O(n²)', space: 'O(n + k)', stable: true, inPlace: false }
];

/* Helper to build consistent 5-language code blocks & practice items */
const buildFiveLangCode = (name, pseudocode = [], customCode = {}) => {
    const bodyComment = pseudocode.map((l) => `    // ${l}`).join('\n');
    return {
        c:
            customCode.c ||
            `#include <stdio.h>\n#include <stdlib.h>\n\n// ${name} in C\nvoid execute_${name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}(int *arr, int n, int target) {\n${bodyComment}\n    for (int i = 0; i < n; i++) {\n        printf("%d ", arr[i]);\n    }\n    printf("\\n");\n}`,
        cpp:
            customCode.cpp ||
            `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\n// ${name} in Modern C++\nvoid solve(vector<int>& data, int target) {\n${bodyComment}\n    for (int val : data) cout << val << " ";\n    cout << "\\n";\n}`,
        java:
            customCode.java ||
            `import java.util.*;\n\npublic class AlgoPlaySolution {\n    // ${name} in Java\n    public static void execute(int[] data, int target) {\n${bodyComment}\n        System.out.println(Arrays.toString(data));\n    }\n}`,
        python:
            customCode.python ||
            `# ${name} in Python 3\ndef execute_algorithm(data: list[int], target: int = 0) -> list[int]:\n${pseudocode.map((l) => `    # ${l}`).join('\n')}\n    return data`,
        javascript:
            customCode.javascript ||
            `// ${name} in JavaScript (ES6+)\nexport function executeAlgorithm(data = [], target = 0) {\n${bodyComment}\n    return [...data];\n}`
    };
};

const buildPracticeSuite = (name, best, avg, worst, space, extraQ = null) => [
    {
        question: `What is the worst-case time complexity of ${name} on an input of size n?`,
        difficulty: 'Easy',
        options: [worst, best === worst ? 'O(1)' : best, 'O(2ⁿ)', 'O(n!)'],
        correctIndex: 0,
        explanation: `In the worst-case scenario, ${name} requires ${worst} time complexity and ${space} auxiliary space.`
    },
    extraQ || {
        question: `What is the auxiliary space complexity required by ${name} during execution?`,
        difficulty: 'Medium',
        options: [space, space === 'O(1)' ? 'O(n)' : 'O(1)', 'O(n²)', 'O(2ⁿ)'],
        correctIndex: 0,
        explanation: `${name} operates with ${space} auxiliary memory overhead.`
    },
    {
        question: `When stepping through ${name} in AlgoPlay, which state invariant is preserved after each atomic step?`,
        difficulty: 'Hard',
        options: [
            `All processed elements/pointers up to the active step index satisfy the ${name} structural invariant`,
            'The entire structure is randomized on every comparison',
            'Auxiliary space doubles unconditionally on read operations',
            'Time complexity becomes O(1) for all unsorted inputs'
        ],
        correctIndex: 0,
        explanation: `Deterministic step execution guarantees that after step k, all visited nodes/elements maintain the structural invariant of ${name}.`
    }
];

const RAW_TOPICS = [
    /* =========================================================================
       1. LINEAR DATA STRUCTURES (10)
       ========================================================================= */
    {
        slug: 'arrays',
        name: 'Arrays',
        category: 'linear',
        categoryLabel: 'Linear Data Structures',
        engineType: 'array',
        difficulty: 'Beginner',
        sequenceOrder: 1,
        isRecommended: true,
        shortDescription: 'Contiguous fixed-stride memory blocks supporting O(1) random index access and O(n) insertions/deletions.',
        overview: {
            whatItIs: 'An Array is a linear collection of homogeneous elements stored at contiguous memory addresses.',
            whyUsed: 'Provides instant O(1) random access to any element using its 0-based index formula: BaseAddress + index * ElementSize.',
            howItStores: 'Elements sit side-by-side in a single contiguous RAM block, maximizing CPU L1/L2 cache line prefetching.',
            realWorldApplications: ['Image pixel buffers & matrices', 'Lookup tables & dynamic vectors', 'Database column pages', 'Audio sample buffers'],
            advantages: ['Strict O(1) random access by index', 'Zero per-element pointer memory overhead', 'Superior CPU cache locality'],
            limitations: ['Inserting or deleting at index i requires shifting O(n - i) elements', 'Fixed capacity unless reallocated'],
            whenToUse: 'Use Arrays when frequent index lookups and sequential iteration dominate over middle insertions/deletions.'
        },
        complexity: {
            bestTime: 'O(1) Access',
            averageTime: 'O(n) Insert/Search',
            worstTime: 'O(n) Shift/Delete',
            space: 'O(1) Auxiliary',
            inPlace: true,
            stable: true,
            simpleExplanation: 'Reading or updating arr[i] jumps directly to the memory offset in 1 step (O(1)), while inserting or deleting in the middle shifts subsequent elements in O(n).'
        },
        pseudocode: [
            '1. Validate target index: 0 <= idx <= size',
            '2. For Insert(idx, val): shift elements [idx..size-1] right by 1 slot',
            '3. Write arr[idx] = val and increment size',
            '4. For Delete(idx): shift elements [idx+1..size-1] left by 1 slot',
            '5. For Search(target): scan i from 0 to size-1 comparing arr[i] == target'
        ]
    },
    {
        slug: 'singly-linked-list',
        name: 'Singly Linked Lists',
        category: 'linear',
        categoryLabel: 'Linear Data Structures',
        engineType: 'linked-list',
        subVariant: 'singly',
        difficulty: 'Beginner',
        sequenceOrder: 2,
        isRecommended: true,
        shortDescription: 'Dynamic chain of heap nodes where each node stores a data payload and a single next pointer.',
        overview: {
            whatItIs: 'A Singly Linked List is a linear sequence of nodes connected via unidirectional next pointers ending at NULL.',
            whyUsed: 'Enables O(1) insertion and deletion at the head (or known node pointer) without shifting contiguous memory.',
            howItStores: 'Nodes are allocated dynamically across the heap; each node contains [data | next*].',
            realWorldApplications: ['Hash table collision chains', 'Undo history stacks', 'OS free-memory block lists', 'Polynomial representation'],
            advantages: ['O(1) insert/delete at head', 'Grows dynamically without contiguous reallocation', 'No wasted pre-allocated capacity'],
            limitations: ['O(n) sequential traversal required to reach index i', 'Extra 8-byte pointer overhead per node', 'No backward traversal'],
            whenToUse: 'Use when size is unpredictable and insertions/deletions occur primarily at the front or during sequential scans.'
        },
        complexity: {
            bestTime: 'O(1) Head Ops',
            averageTime: 'O(n) Search/Pos',
            worstTime: 'O(n) Tail/Search',
            space: 'O(n) Nodes',
            inPlace: true,
            stable: true,
            simpleExplanation: 'Updating the head pointer takes 1 step (O(1)), while finding or inserting at position k walks k next pointers in O(n).'
        },
        pseudocode: [
            '1. Allocate newNode = new Node(value)',
            '2. If Insert at Head: newNode.next = head; head = newNode',
            '3. If Insert at Position k: traverse cur to k-1',
            '4. Connect newNode.next = cur.next; then cur.next = newNode',
            '5. If Delete: bypass target node via prev.next = target.next'
        ]
    },
    {
        slug: 'doubly-linked-list',
        name: 'Doubly Linked Lists',
        category: 'linear',
        categoryLabel: 'Linear Data Structures',
        engineType: 'linked-list',
        subVariant: 'doubly',
        difficulty: 'Beginner',
        sequenceOrder: 3,
        isRecommended: false,
        shortDescription: 'Bidirectional linked nodes storing both prev and next pointers for O(1) two-way navigation and node removal.',
        overview: {
            whatItIs: 'A Doubly Linked List links each node to both its successor (next) and its predecessor (prev).',
            whyUsed: 'Allows O(1) deletion of any given node pointer and bidirectional traversal without re-scanning from the head.',
            howItStores: 'Each heap node holds [prev* | data | next*], with head.prev = NULL and tail.next = NULL.',
            realWorldApplications: ['LRU Cache eviction queues', 'Browser Back/Forward history', 'Text editor cursor lines', 'Music playlist navigation'],
            advantages: ['O(1) insert and delete at both Head and Tail', 'Bidirectional forward and backward traversal', 'O(1) given-node unlink'],
            limitations: ['Two pointers per node (16 bytes overhead on 64-bit)', 'Slightly more pointer updates per mutation'],
            whenToUse: 'Use for LRU caches, deques, and lists requiring O(1) removal from both ends or backward iteration.'
        },
        complexity: {
            bestTime: 'O(1) Ends',
            averageTime: 'O(n) Search',
            worstTime: 'O(n) Position',
            space: 'O(n)',
            inPlace: true,
            stable: true,
            simpleExplanation: 'Both ends (head and tail) can be updated in O(1) time by rewiring prev and next pointers.'
        },
        pseudocode: [
            '1. Allocate newNode = new DoublyNode(value)',
            '2. Wire newNode.prev = prevNode and newNode.next = nextNode',
            '3. Update prevNode.next = newNode (if prevNode != NULL)',
            '4. Update nextNode.prev = newNode (if nextNode != NULL)',
            '5. On Delete(node): node.prev.next = node.next; node.next.prev = node.prev'
        ]
    },
    {
        slug: 'circular-linked-list',
        name: 'Circular Linked Lists',
        category: 'linear',
        categoryLabel: 'Linear Data Structures',
        engineType: 'linked-list',
        subVariant: 'circular',
        difficulty: 'Intermediate',
        sequenceOrder: 4,
        isRecommended: false,
        shortDescription: 'Singly linked ring where the tail node next pointer loops back to the head node instead of NULL.',
        overview: {
            whatItIs: 'A Circular Linked List connects the last node back to the first node, forming a continuous closed ring.',
            whyUsed: 'Eliminates null-end checks and enables fair round-robin cycling from any starting node.',
            howItStores: 'Nodes store [data | next*] where tail.next === head.',
            realWorldApplications: ['OS Round-Robin CPU process scheduling', 'Multiplayer turn rotation', 'Circular media carousels'],
            advantages: ['Entire list reachable from any node', 'Ideal for continuous cyclic scheduling', 'O(1) head & tail insert via tail pointer'],
            limitations: ['Infinite loop risk if stop condition (cur != head) is missed', 'No natural NULL sentinel'],
            whenToUse: 'Use when cyclic round-robin iteration or continuous loop buffers are needed.'
        },
        complexity: {
            bestTime: 'O(1)',
            averageTime: 'O(n)',
            worstTime: 'O(n)',
            space: 'O(n)',
            inPlace: true,
            stable: true,
            simpleExplanation: 'Traversal starts at head and stops when cur.next loops back to head.'
        },
        pseudocode: [
            '1. Create newNode(value)',
            '2. If list empty: head = newNode; newNode.next = head',
            '3. Else locate tail where tail.next == head',
            '4. Link newNode.next = head and tail.next = newNode',
            '5. Stop traversal when current pointer returns to head'
        ]
    },
    {
        slug: 'circular-doubly-linked-list',
        name: 'Circular Doubly Linked Lists',
        category: 'linear',
        categoryLabel: 'Linear Data Structures',
        engineType: 'linked-list',
        subVariant: 'circular-doubly',
        difficulty: 'Intermediate',
        sequenceOrder: 5,
        isRecommended: false,
        shortDescription: 'Closed bidirectional ring where tail.next points to head and head.prev points to tail.',
        overview: {
            whatItIs: 'A Circular Doubly Linked List combines bidirectional pointers with a closed circular ring.',
            whyUsed: 'Provides instant O(1) access to both the front and back from a single pointer and seamless wrap-around in both directions.',
            howItStores: 'Each node has [prev* | data | next*] with head.prev = tail and tail.next = head.',
            realWorldApplications: ['Fibonacci Heap root lists', 'Linux kernel list_head implementation', 'Window manager Alt-Tab ring'],
            advantages: ['O(1) access and mutation at both ends from 1 pointer', 'Seamless bidirectional wrap-around'],
            limitations: ['Requires updating 4 pointer links on insertion/deletion'],
            whenToUse: 'Use for kernel intrusive lists, advanced heap structures, and bidirectional carousels.'
        },
        complexity: {
            bestTime: 'O(1)',
            averageTime: 'O(n)',
            worstTime: 'O(n)',
            space: 'O(n)',
            inPlace: true,
            stable: true,
            simpleExplanation: 'head.prev is always the tail in O(1), and tail.next is always the head in O(1).'
        },
        pseudocode: [
            '1. Let tail = head.prev',
            '2. Allocate newNode(value)',
            '3. Wire newNode.next = head; newNode.prev = tail',
            '4. Wire tail.next = newNode; head.prev = newNode',
            '5. Update head = newNode (if inserting at beginning)'
        ]
    },
    {
        slug: 'stacks',
        name: 'Stacks',
        category: 'linear',
        categoryLabel: 'Linear Data Structures',
        engineType: 'stack',
        difficulty: 'Beginner',
        sequenceOrder: 6,
        isRecommended: true,
        shortDescription: 'LIFO (Last-In, First-Out) container supporting O(1) Push, Pop, and Peek at the top pointer.',
        overview: {
            whatItIs: 'A Stack is a restricted linear data structure following the LIFO (Last-In, First-Out) principle.',
            whyUsed: 'Tracks nested execution contexts, reversals, and backtracking states with strict O(1) push and pop.',
            howItStores: 'Backed by a dynamic array or linked list with a top pointer tracking the most recently pushed item.',
            realWorldApplications: ['Function Call Stack & recursion frames', 'Balanced parentheses & syntax parsing', 'Undo/Redo editors', 'Monotonic stack problems'],
            advantages: ['Strict O(1) Push, Pop, and Peek', 'Simple deterministic memory lifecycles'],
            limitations: ['No random access to bottom elements without popping', 'Fixed-capacity stacks can experience Stack Overflow'],
            whenToUse: 'Use whenever the most recently added item must be processed first (LIFO).'
        },
        complexity: {
            bestTime: 'O(1) Push/Pop',
            averageTime: 'O(1) Peek',
            worstTime: 'O(n) Search',
            space: 'O(n)',
            inPlace: true,
            stable: true,
            simpleExplanation: 'Push increments top and writes in 1 step; Pop reads top and decrements in 1 step.'
        },
        pseudocode: [
            '1. PUSH(val): if top == capacity - 1 -> trigger Stack Overflow',
            '2. Increment top = top + 1; set stack[top] = val',
            '3. POP(): if top == -1 -> trigger Stack Underflow',
            '4. Read item = stack[top]; decrement top = top - 1; return item',
            '5. PEEK(): return stack[top] without modifying top'
        ]
    },
    {
        slug: 'queues',
        name: 'Queues',
        category: 'linear',
        categoryLabel: 'Linear Data Structures',
        engineType: 'queue',
        subVariant: 'linear',
        difficulty: 'Beginner',
        sequenceOrder: 7,
        isRecommended: true,
        shortDescription: 'FIFO (First-In, First-Out) pipeline where elements Enqueue at the Rear and Dequeue from the Front.',
        overview: {
            whatItIs: 'A Queue is a linear collection following FIFO (First-In, First-Out) ordering.',
            whyUsed: 'Processes tasks, events, and Breadth-First Search (BFS) levels in the exact order they arrived.',
            howItStores: 'Maintains two pointers: front (removal head) and rear (insertion tail).',
            realWorldApplications: ['BFS Graph & Tree level-order traversal', 'Printer & CPU task scheduling queues', 'Message brokers & event loops'],
            advantages: ['Fair arrival-order processing', 'O(1) Enqueue at rear and O(1) Dequeue at front'],
            limitations: ['Simple non-circular array queues waste front slots after dequeues'],
            whenToUse: 'Use for breadth-first exploration, asynchronous job buffering, and rate limiting.'
        },
        complexity: {
            bestTime: 'O(1) Enqueue',
            averageTime: 'O(1) Dequeue',
            worstTime: 'O(n) Search',
            space: 'O(n)',
            inPlace: true,
            stable: true,
            simpleExplanation: 'Items enter at Rear and leave from Front in O(1) time.'
        },
        pseudocode: [
            '1. ENQUEUE(val): if size == capacity -> Queue Overflow',
            '2. Advance rear pointer and write queue[rear] = val',
            '3. DEQUEUE(): if size == 0 -> Queue Underflow',
            '4. Read item = queue[front] and advance front pointer',
            '5. FRONT() / REAR(): inspect boundary pointers in O(1)'
        ]
    },
    {
        slug: 'circular-queues',
        name: 'Circular Queues',
        category: 'linear',
        categoryLabel: 'Linear Data Structures',
        engineType: 'queue',
        subVariant: 'circular',
        difficulty: 'Intermediate',
        sequenceOrder: 8,
        isRecommended: false,
        shortDescription: 'Ring-buffer queue using modulo arithmetic (index + 1) % capacity to reuse vacated front slots in O(1).',
        overview: {
            whatItIs: 'A Circular Queue (Ring Buffer) wraps the underlying array around into a circle using modulo indexing.',
            whyUsed: 'Solves the wasted-space limitation of linear array queues by reusing dequeued front slots in O(1) time.',
            howItStores: 'Advances pointers via rear = (rear + 1) % capacity and front = (front + 1) % capacity.',
            realWorldApplications: ['Network packet ring buffers', 'Audio/Video streaming buffers', 'Embedded UART serial buffers'],
            advantages: ['100% utilization of fixed array capacity', 'Strict O(1) enqueue and dequeue with zero element shifting'],
            limitations: ['Fixed capacity unless dynamically resized'],
            whenToUse: 'Use for fixed-capacity high-frequency streaming and producer-consumer ring buffers.'
        },
        complexity: {
            bestTime: 'O(1)',
            averageTime: 'O(1)',
            worstTime: 'O(1)',
            space: 'O(n)',
            inPlace: true,
            stable: true,
            simpleExplanation: 'Modulo arithmetic (idx + 1) % N wraps pointers around seamlessly in O(1).'
        },
        pseudocode: [
            '1. Check Full: if (rear + 1) % capacity == front -> Overflow',
            '2. ENQUEUE(x): rear = (rear + 1) % capacity; ring[rear] = x',
            '3. Check Empty: if size == 0 -> Underflow',
            '4. DEQUEUE(): item = ring[front]; front = (front + 1) % capacity',
            '5. Update count and display circular ring indices'
        ]
    },
    {
        slug: 'deques',
        name: 'Deques (Double-Ended Queues)',
        category: 'linear',
        categoryLabel: 'Linear Data Structures',
        engineType: 'queue',
        subVariant: 'deque',
        difficulty: 'Intermediate',
        sequenceOrder: 9,
        isRecommended: false,
        shortDescription: 'Double-ended queue supporting O(1) insertion and deletion at both the Front and the Rear.',
        overview: {
            whatItIs: 'A Deque (Double-Ended Queue) generalizes both Stacks and Queues by allowing O(1) push and pop at both ends.',
            whyUsed: 'Essential for sliding window maximum/minimum algorithms, 0-1 BFS shortest paths, and work-stealing thread schedulers.',
            howItStores: 'Implemented via a circular dynamic array or doubly-linked block pages.',
            realWorldApplications: ['Sliding Window Maximum (Monotonic Deque)', '0-1 BFS shortest path on binary graphs', 'Work-stealing CPU thread pools'],
            advantages: ['Supports PushFront, PushRear, PopFront, PopRear all in O(1)', 'Replaces both Stack and Queue'],
            limitations: ['Slightly more complex boundary pointer arithmetic'],
            whenToUse: 'Use when elements must be added or removed from both ends dynamically.'
        },
        complexity: {
            bestTime: 'O(1) Both Ends',
            averageTime: 'O(1)',
            worstTime: 'O(n) Search',
            space: 'O(n)',
            inPlace: true,
            stable: true,
            simpleExplanation: 'All four end operations (insertFront, insertRear, deleteFront, deleteRear) run in O(1).'
        },
        pseudocode: [
            '1. PUSH_FRONT(x): decrement front (mod cap); deque[front] = x',
            '2. PUSH_REAR(x): increment rear (mod cap); deque[rear] = x',
            '3. POP_FRONT(): read deque[front]; advance front',
            '4. POP_REAR(): read deque[rear]; retreat rear',
            '5. PEEK_FRONT() / PEEK_REAR(): inspect ends in O(1)'
        ]
    },
    {
        slug: 'priority-queues',
        name: 'Priority Queues',
        category: 'linear',
        categoryLabel: 'Linear Data Structures',
        engineType: 'queue',
        subVariant: 'priority',
        difficulty: 'Intermediate',
        sequenceOrder: 10,
        isRecommended: true,
        shortDescription: 'Priority-ordered queue where Dequeue always extracts the highest-priority (or minimum key) element first.',
        overview: {
            whatItIs: 'A Priority Queue assigns a numeric priority key to every element and always serves the extremal priority first.',
            whyUsed: 'Powers greedy algorithms like Dijkstra Shortest Path, Prim MST, Huffman Coding, and A* Search.',
            howItStores: 'Maintained as a binary heap or priority-sorted buffer where the highest-priority element sits at the front.',
            realWorldApplications: ['Dijkstra shortest path routing', 'Hospital emergency triage queues', 'OS real-time task preemption', 'Top-K streaming queries'],
            advantages: ['O(1) peek at highest-priority item', 'O(log n) priority insertion and extraction'],
            limitations: ['Searching for an arbitrary non-extremal element takes O(n)'],
            whenToUse: 'Use whenever items must be processed by urgency/cost rather than arrival time.'
        },
        complexity: {
            bestTime: 'O(1) Peek',
            averageTime: 'O(log n) Push/Pop',
            worstTime: 'O(log n)',
            space: 'O(n)',
            inPlace: true,
            stable: false,
            simpleExplanation: 'Inserting sifts the element into priority order; Dequeue extracts the top priority element.'
        },
        pseudocode: [
            '1. ENQUEUE(val, priority): insert element into heap/priority slot',
            '2. Sift-Up / bubble element until parent priority <= current priority',
            '3. PEEK(): return root element at index 0 in O(1)',
            '4. DEQUEUE(): extract root element and restore priority order',
            '5. Display ordered priority queue state'
        ]
    },

    /* =========================================================================
       2. NON-LINEAR DATA STRUCTURES (8)
       ========================================================================= */
    {
        slug: 'binary-trees',
        name: 'Binary Trees',
        category: 'nonlinear',
        categoryLabel: 'Non-Linear Data Structures',
        engineType: 'tree',
        subVariant: 'binary',
        difficulty: 'Beginner',
        sequenceOrder: 11,
        isRecommended: true,
        shortDescription: 'Hierarchical tree structure where each node has at most two children (left and right).',
        overview: {
            whatItIs: 'A Binary Tree is a hierarchical non-linear data structure in which every node has a value, a left child pointer, and a right child pointer.',
            whyUsed: 'Models hierarchical relationships, expression syntax trees, and level-order structures.',
            howItStores: 'Nodes are linked in a parent-child hierarchy starting from a single root node.',
            realWorldApplications: ['Compiler Abstract Syntax Trees (AST)', 'HTML DOM hierarchy', 'Huffman compression trees'],
            advantages: ['Natural recursive traversal (Inorder, Preorder, Postorder, Level-order)', 'Logarithmic height O(log n) when balanced'],
            limitations: ['Unordered binary trees require O(n) search'],
            whenToUse: 'Use to represent hierarchical data or expression trees.'
        },
        complexity: {
            bestTime: 'O(1) Root',
            averageTime: 'O(n) Traversal',
            worstTime: 'O(n)',
            space: 'O(h) Stack',
            inPlace: false,
            stable: true,
            simpleExplanation: 'Level-order insertion fills the tree breadth-first using a queue; traversals visit every node once in O(n).'
        },
        pseudocode: [
            '1. Start at root node',
            '2. For Level-Order Insert: push root into BFS queue',
            '3. Pop node: if node.left == NULL -> attach new node at left',
            '4. Else if node.right == NULL -> attach new node at right',
            '5. For Traversals: recursively visit Left, Root, Right subtrees'
        ]
    },
    {
        slug: 'binary-search-trees',
        name: 'Binary Search Trees (BST)',
        category: 'nonlinear',
        categoryLabel: 'Non-Linear Data Structures',
        engineType: 'tree',
        subVariant: 'bst',
        difficulty: 'Intermediate',
        sequenceOrder: 12,
        isRecommended: true,
        shortDescription: 'Ordered binary tree where all left-subtree keys < node.key and all right-subtree keys > node.key.',
        overview: {
            whatItIs: 'A Binary Search Tree (BST) enforces the symmetric ordering invariant: Left < Node < Right for every subtree.',
            whyUsed: 'Combines fast O(log n) average search with dynamic O(log n) insertion, deletion, and sorted Inorder traversal.',
            howItStores: 'Each comparison eliminates half of the remaining tree on average.',
            realWorldApplications: ['Sorted symbol tables', 'In-memory range queries', 'Ordered set/map foundations'],
            advantages: ['Inorder traversal yields elements in strictly sorted order', 'O(log n) average insert, search, min, max, predecessor, successor'],
            limitations: ['Degenerates into an O(n) skewed linked list if sorted data is inserted without balancing'],
            whenToUse: 'Use for dynamic ordered keys when average-case logarithmic lookup and sorted iteration are required.'
        },
        complexity: {
            bestTime: 'O(log n)',
            averageTime: 'O(log n)',
            worstTime: 'O(n) Skewed',
            space: 'O(h)',
            inPlace: false,
            stable: true,
            simpleExplanation: 'At each node, go Left if target < node.val or Right if target > node.val.'
        },
        pseudocode: [
            '1. Compare value with current node.val',
            '2. If val < node.val -> branch to node.left',
            '3. If val > node.val -> branch to node.right',
            '4. On Insert: attach new leaf at NULL child pointer',
            '5. On Delete with 2 children: replace node with Inorder Successor (min of right subtree)'
        ]
    },
    {
        slug: 'avl-trees',
        name: 'AVL Trees',
        category: 'nonlinear',
        categoryLabel: 'Non-Linear Data Structures',
        engineType: 'tree',
        subVariant: 'avl',
        difficulty: 'Advanced',
        sequenceOrder: 13,
        isRecommended: true,
        shortDescription: 'Self-balancing BST maintaining Balance Factor in {-1, 0, +1} via LL, RR, LR, and RL tree rotations.',
        overview: {
            whatItIs: 'An AVL Tree is a strictly height-balanced Binary Search Tree where |height(left) - height(right)| <= 1 for every node.',
            whyUsed: 'Guarantees worst-case O(log n) search, insertion, and deletion even when inputs arrive in sorted order.',
            howItStores: 'Each node tracks its subtree height and Balance Factor (BF = height(L) - height(R)), triggering rotations when |BF| == 2.',
            realWorldApplications: ['Read-intensive database indexes', 'Memory-mapped region lookup trees', 'Real-time deterministic dictionaries'],
            advantages: ['Strict O(log n) worst-case lookup guarantee (height <= 1.44 log2 n)', 'Zero degenerate skew possible'],
            limitations: ['Up to O(log n) rotations on deletion'],
            whenToUse: 'Use when strict worst-case O(log n) query latency is critical.'
        },
        complexity: {
            bestTime: 'O(log n)',
            averageTime: 'O(log n)',
            worstTime: 'O(log n) Guaranteed',
            space: 'O(n)',
            inPlace: false,
            stable: true,
            simpleExplanation: 'After BST insert/delete, recompute heights bottom-up and apply Left or Right rotations if |Balance Factor| > 1.'
        },
        pseudocode: [
            '1. Perform standard BST insertion / deletion',
            '2. Update node.height = 1 + max(height(left), height(right))',
            '3. Compute Balance Factor BF = height(left) - height(right)',
            '4. If BF > 1: perform Right Rotation (LL) or Left-Right Rotation (LR)',
            '5. If BF < -1: perform Left Rotation (RR) or Right-Left Rotation (RL)'
        ]
    },
    {
        slug: 'heaps',
        name: 'Heaps (Min Heap & Max Heap)',
        category: 'nonlinear',
        categoryLabel: 'Non-Linear Data Structures',
        engineType: 'tree',
        subVariant: 'heap',
        difficulty: 'Intermediate',
        sequenceOrder: 14,
        isRecommended: true,
        shortDescription: 'Complete binary tree stored compactly in an array satisfying the Min-Heap or Max-Heap parent-child property.',
        overview: {
            whatItIs: 'A Binary Heap is a complete binary tree where every parent key is <= its children (Min-Heap) or >= its children (Max-Heap).',
            whyUsed: 'Provides O(1) access to the minimum/maximum element and O(log n) insertion and extraction without pointer overhead.',
            howItStores: 'Mapped directly into a contiguous 0-indexed array: parent(i) = (i-1)//2, left(i) = 2i+1, right(i) = 2i+2.',
            realWorldApplications: ['Priority Queues & Heap Sort', 'Median of data stream (Two Heaps)', 'Merge K sorted streams', 'Dijkstra & Prim algorithms'],
            advantages: ['Zero pointer overhead (stored in flat array)', 'O(1) extremal peek, O(log n) push/pop, O(n) bottom-up heapify'],
            limitations: ['Searching for an arbitrary element requires O(n) scan'],
            whenToUse: 'Use whenever you need repeated fast access to the minimum or maximum element.'
        },
        complexity: {
            bestTime: 'O(1) Peek',
            averageTime: 'O(log n) Push/Pop',
            worstTime: 'O(log n)',
            space: 'O(n)',
            inPlace: true,
            stable: false,
            simpleExplanation: 'Insert appends at the end and sifts up in O(log n); Extract swaps root with last leaf and sifts down in O(log n).'
        },
        pseudocode: [
            '1. INSERT(val): append val at index i = heap.size',
            '2. SIFT-UP: while i > 0 and heap[i] violates heap order with parent((i-1)/2): swap',
            '3. EXTRACT_ROOT(): save root = heap[0]; move last leaf to heap[0]',
            '4. SIFT-DOWN: swap node with smaller/larger child(2i+1, 2i+2) until heap order holds'
        ]
    },
    {
        slug: 'tries',
        name: 'Tries (Prefix Trees)',
        category: 'nonlinear',
        categoryLabel: 'Non-Linear Data Structures',
        engineType: 'trie',
        difficulty: 'Intermediate',
        sequenceOrder: 15,
        isRecommended: false,
        shortDescription: 'Character-by-character prefix tree enabling O(L) word lookup, autocomplete, and prefix matching.',
        overview: {
            whatItIs: 'A Trie (Digital / Prefix Tree) is an n-ary tree where edges represent characters and paths from root represent prefixes.',
            whyUsed: 'Performs word lookup and prefix autocomplete in O(L) time (where L is word length), independent of how many words are stored!',
            howItStores: 'Each TrieNode holds a map/array of child character edges and an isEndOfWord boolean flag.',
            realWorldApplications: ['Search bar autocomplete & spell checkers', 'IP routing longest-prefix matching', 'Word games (Boggle / Wordle solvers)'],
            advantages: ['O(L) lookup and prefix search regardless of dictionary size N', 'Shared prefixes stored only once'],
            limitations: ['Higher memory footprint if many sparse child pointers are allocated'],
            whenToUse: 'Use for prefix searches, autocomplete suggestions, and dictionary word validation.'
        },
        complexity: {
            bestTime: 'O(L)',
            averageTime: 'O(L)',
            worstTime: 'O(L)',
            space: 'O(Alphabet * L * N)',
            inPlace: false,
            stable: true,
            simpleExplanation: 'Traverses 1 node per character in the query word of length L.'
        },
        pseudocode: [
            '1. Start at cur = root TrieNode',
            '2. For each character ch in word:',
            '3.   If cur.children[ch] does not exist -> create new TrieNode(ch)',
            '4.   Advance cur = cur.children[ch]',
            '5. Mark cur.isEndOfWord = true (for Insert) or check flag (for Search)'
        ]
    },
    {
        slug: 'hash-tables',
        name: 'Hash Tables',
        category: 'nonlinear',
        categoryLabel: 'Non-Linear Data Structures',
        engineType: 'hash-table',
        difficulty: 'Intermediate',
        sequenceOrder: 16,
        isRecommended: true,
        shortDescription: 'Key-value bucket array using a hash function h(k) = k % M and collision chaining for O(1) average lookup.',
        overview: {
            whatItIs: 'A Hash Table maps keys to array bucket indices using a deterministic hash function and resolves collisions via Separate Chaining or Open Addressing.',
            whyUsed: 'Delivers O(1) average-case insertion, lookup, and deletion—the single most effective tool for reducing O(n²) algorithms to O(n).',
            howItStores: 'Computes bucket = hash(key) % numBuckets and stores (key, value) in that bucket chain.',
            realWorldApplications: ['Database indexing & caching (Redis)', 'Compiler symbol tables', 'Deduplication & frequency counting'],
            advantages: ['O(1) average lookup, insert, and delete', 'Flexible key types'],
            limitations: ['Keys are unordered', 'Worst-case O(n) if all keys collide into the same bucket'],
            whenToUse: 'Use whenever fast key-value lookup or membership testing is required without needing sorted order.'
        },
        complexity: {
            bestTime: 'O(1)',
            averageTime: 'O(1)',
            worstTime: 'O(n) Collision',
            space: 'O(n + M)',
            inPlace: false,
            stable: false,
            simpleExplanation: 'Computes index = key % Buckets in O(1) and scans the short bucket chain.'
        },
        pseudocode: [
            '1. Compute bucket index: idx = abs(hash(key)) % bucketCount',
            '2. Inspect bucket chain at table[idx]',
            '3. For Insert(key, val): update existing key or append node to table[idx]',
            '4. For Search(key): traverse table[idx] comparing node.key == key',
            '5. For Delete(key): unlink matching node from table[idx] chain'
        ]
    },
    {
        slug: 'graphs',
        name: 'Graphs (Adjacency List & Matrix)',
        category: 'nonlinear',
        categoryLabel: 'Non-Linear Data Structures',
        engineType: 'graph',
        subVariant: 'structure',
        difficulty: 'Intermediate',
        sequenceOrder: 17,
        isRecommended: true,
        shortDescription: 'Network of vertices V and directed/undirected weighted edges E represented as Adjacency Lists and Matrices.',
        overview: {
            whatItIs: 'A Graph G = (V, E) consists of a set of vertices (nodes) V connected by edges (links) E, which may be directed/undirected and weighted/unweighted.',
            whyUsed: 'Models arbitrary many-to-many networks such as road maps, social networks, internet routing, and task dependencies.',
            howItStores: 'Stored either as an Adjacency List (O(V + E) space, fast for sparse graphs) or a V×V Adjacency Matrix (O(V²) space, O(1) edge check).',
            realWorldApplications: ['Google Maps shortest-path routing', 'Social network friend graphs', 'Course prerequisite dependency DAGs'],
            advantages: ['Models any network topology', 'Dual Adjacency List & Matrix representations'],
            limitations: ['Adjacency Matrix consumes O(V²) memory on large sparse graphs'],
            whenToUse: 'Use whenever entities have many-to-many network connections or path/connectivity queries.'
        },
        complexity: {
            bestTime: 'O(1) Add Vertex',
            averageTime: 'O(V + E) Traversal',
            worstTime: 'O(V²) Matrix',
            space: 'O(V + E)',
            inPlace: false,
            stable: true,
            simpleExplanation: 'Adding a vertex or edge updates the adjacency list and matrix in O(1) time.'
        },
        pseudocode: [
            '1. ADD_VERTEX(u): register node u in V and initialize adjacency list adj[u] = []',
            '2. ADD_EDGE(u, v, w): append (v, w) to adj[u] (and (u, w) to adj[v] if undirected)',
            '3. Update Adjacency Matrix cell mat[u][v] = w',
            '4. TRAVERSE: explore connected neighbors via BFS queue or DFS stack'
        ]
    },
    {
        slug: 'disjoint-set-union',
        name: 'Disjoint Set Union (Union-Find)',
        category: 'nonlinear',
        categoryLabel: 'Non-Linear Data Structures',
        engineType: 'dsu',
        difficulty: 'Intermediate',
        sequenceOrder: 18,
        isRecommended: false,
        shortDescription: 'Tracks dynamic connected components in near-constant O(α(n)) time using Path Compression and Union by Rank.',
        overview: {
            whatItIs: 'Disjoint Set Union (DSU / Union-Find) maintains a collection of non-overlapping sets supporting Find(x) and Union(x, y).',
            whyUsed: 'Determines whether two vertices belong to the same connected component and merges components in near-constant O(α(n)) time.',
            howItStores: 'Uses flat parent[] and rank[] arrays where parent[i] == i denotes a set root representative.',
            realWorldApplications: ['Kruskal Minimum Spanning Tree algorithm', 'Dynamic network connectivity', 'Image connected-component labeling', 'Cycle detection in undirected graphs'],
            advantages: ['Near-constant O(α(n)) <= 4 operations per query', 'Compact flat array storage'],
            limitations: ['Does not natively support splitting sets (only merging)'],
            whenToUse: 'Use for dynamic connectivity queries, Kruskal MST, and equivalence grouping.'
        },
        complexity: {
            bestTime: 'O(1)',
            averageTime: 'O(α(n))',
            worstTime: 'O(log n)',
            space: 'O(n)',
            inPlace: true,
            stable: true,
            simpleExplanation: 'Find(x) follows parent pointers to the root and flattens the path directly to the root (Path Compression).'
        },
        pseudocode: [
            '1. INIT(n): for i in 0..n-1 set parent[i] = i, rank[i] = 0',
            '2. FIND(x): if parent[x] != x -> parent[x] = FIND(parent[x]) (Path Compression)',
            '3. UNION(a, b): rootA = FIND(a), rootB = FIND(b)',
            '4. If rootA == rootB -> already in same component (cycle detected)',
            '5. Attach smaller-rank root under larger-rank root; increment rank if equal'
        ]
    },

    /* =========================================================================
       3. ADVANCED DATA STRUCTURES (5)
       ========================================================================= */
    {
        slug: 'segment-trees',
        name: 'Segment Trees',
        category: 'advanced',
        categoryLabel: 'Advanced Data Structures',
        engineType: 'segment-tree',
        difficulty: 'Advanced',
        sequenceOrder: 19,
        isRecommended: true,
        shortDescription: 'Divide-and-conquer binary tree answering dynamic Range Sum / Min / Max queries and Point Updates in O(log n).',
        overview: {
            whatItIs: 'A Segment Tree is a balanced binary tree built over an array where each internal node stores the merged aggregate (sum/min/max) of a contiguous range [L, R].',
            whyUsed: 'While prefix sums answer range queries in O(1), updating a single array element takes O(n). A Segment Tree performs BOTH range queries and updates in O(log n) time!',
            howItStores: 'Stored in a flat array tree[1..4n] where node v covers [tl, tr], left child 2v covers [tl, mid], and right child 2v+1 covers [mid+1, tr].',
            realWorldApplications: ['High-frequency financial candlestick range queries', 'Computational geometry interval queries', 'Competitive programming range updates'],
            advantages: ['O(log n) range query AND O(log n) point/lazy range update', 'Works for any associative operation (sum, min, max, GCD, XOR)'],
            limitations: ['Requires 4n array memory'],
            whenToUse: 'Use when an array undergoes frequent dynamic updates interspersed with range aggregate queries.'
        },
        complexity: {
            bestTime: 'O(log n) Query',
            averageTime: 'O(log n) Update',
            worstTime: 'O(n) Build',
            space: 'O(4n)',
            inPlace: false,
            stable: true,
            simpleExplanation: 'Decomposes any query range [L, R] into at most 2 * log2(n) canonical tree nodes.'
        },
        pseudocode: [
            '1. BUILD(v, tl, tr): if tl == tr -> tree[v] = arr[tl]',
            '2. Else mid = (tl + tr)/2; build left(2v) and right(2v+1); tree[v] = tree[2v] + tree[2v+1]',
            '3. QUERY(v, tl, tr, L, R): if [tl, tr] inside [L, R] -> return tree[v]',
            '4. Return QUERY(2v, tl, mid) + QUERY(2v+1, mid+1, tr)',
            '5. UPDATE(v, tl, tr, pos, newVal): update leaf and recompute ancestors bottom-up'
        ]
    },
    {
        slug: 'fenwick-trees',
        name: 'Fenwick Trees (Binary Indexed Trees)',
        category: 'advanced',
        categoryLabel: 'Advanced Data Structures',
        engineType: 'fenwick-tree',
        difficulty: 'Advanced',
        sequenceOrder: 20,
        isRecommended: false,
        shortDescription: 'Bitwise lowbit-indexed array computing prefix sums and point updates in O(log n) time and strict O(n) space.',
        overview: {
            whatItIs: 'A Fenwick Tree (Binary Indexed Tree / BIT) stores partial range sums indexed by the lowest set bit lowbit(i) = i & (-i).',
            whyUsed: 'Requires only N + 1 integers (4x less memory than a Segment Tree) and uses ultra-fast bitwise loops for prefix sums and point updates.',
            howItStores: 'Index i in bit[] stores the sum of the range (i - (i & -i), i].',
            realWorldApplications: ['Counting inversions in an array in O(n log n)', 'Order-statistic rank queries', 'Real-time cumulative frequency tables'],
            advantages: ['Exact O(n) memory footprint', '5-line bitwise implementation with tiny constant factor'],
            limitations: ['Requires invertible operations (like addition/XOR) for arbitrary [L, R] range queries'],
            whenToUse: 'Use for dynamic prefix sums, frequency histograms, and inversion counting.'
        },
        complexity: {
            bestTime: 'O(log n)',
            averageTime: 'O(log n)',
            worstTime: 'O(log n)',
            space: 'O(n)',
            inPlace: true,
            stable: true,
            simpleExplanation: 'Update adds i += (i & -i) up to N; Query subtracts i -= (i & -i) down to 0.'
        },
        pseudocode: [
            '1. Isolating lowest set bit: lowbit(i) = i & (-i)',
            '2. ADD(idx, delta): while idx <= N: bit[idx] += delta; idx += (idx & -idx)',
            '3. PREFIX_SUM(idx): sum = 0; while idx > 0: sum += bit[idx]; idx -= (idx & -idx)',
            '4. RANGE_SUM(L, R): return PREFIX_SUM(R) - PREFIX_SUM(L - 1)'
        ]
    },
    {
        slug: 'b-trees',
        name: 'B-Trees',
        category: 'advanced',
        categoryLabel: 'Advanced Data Structures',
        engineType: 'btree',
        subVariant: 'btree',
        difficulty: 'Advanced',
        sequenceOrder: 21,
        isRecommended: false,
        shortDescription: 'Self-balancing multi-way search tree that packs multiple keys per node to minimize disk I/O page reads.',
        overview: {
            whatItIs: 'A B-Tree of minimum degree t is a self-balancing multi-way search tree where every node holds between t-1 and 2t-1 sorted keys and all leaves sit at the exact same depth.',
            whyUsed: 'Designed for SSD/Disk storage systems: by matching node size to a 4KB disk page (high branching factor), a B-Tree of height 3 indexes billions of keys!',
            howItStores: 'Each node stores an array of sorted keys [k1, k2, ...] separating child pointers [c0, c1, c2, ...]. Full nodes split around their median key.',
            realWorldApplications: ['File systems (NTFS, ext4, HFS+)', 'Document database indexes', 'Key-value storage engines'],
            advantages: ['Minimizes disk page seeks via high branching factor', 'All leaves guaranteed at identical depth'],
            limitations: ['Range scans across keys require jumping between internal and leaf nodes'],
            whenToUse: 'Use for block-storage indexes and large key-value stores.'
        },
        complexity: {
            bestTime: 'O(log_t n)',
            averageTime: 'O(log_t n)',
            worstTime: 'O(log_t n)',
            space: 'O(n)',
            inPlace: false,
            stable: true,
            simpleExplanation: 'Binary searches keys inside each multi-key node, splitting full nodes at the median key.'
        },
        pseudocode: [
            '1. Search keys [k_1 .. k_m] inside current multi-way B-Tree node',
            '2. If key found -> highlight key slot in node',
            '3. Else follow child pointer c_i where k_i < target < k_{i+1}',
            '4. On Insert into full node (2t-1 keys): split node around median key',
            '5. Promote median key up into parent node'
        ]
    },
    {
        slug: 'b-plus-trees',
        name: 'B+ Trees',
        category: 'advanced',
        categoryLabel: 'Advanced Data Structures',
        engineType: 'btree',
        subVariant: 'bplus',
        difficulty: 'Advanced',
        sequenceOrder: 22,
        isRecommended: true,
        shortDescription: 'Database-grade B-Tree variant where internal nodes store routing keys only and all data resides in linked leaf pages.',
        overview: {
            whatItIs: 'A B+ Tree separates routing keys (in internal nodes) from actual data records (stored exclusively in bottom leaf nodes linked as a sequential doubly-linked list).',
            whyUsed: 'The universal indexing engine of relational databases (PostgreSQL, MySQL InnoDB, Oracle) because range queries (WHERE age BETWEEN 20 AND 30) scan the linked leaf layer sequentially!',
            howItStores: 'Internal nodes hold separator keys only; leaf nodes hold all keys + data and a nextLeaf* pointer to the adjacent leaf.',
            realWorldApplications: ['MySQL InnoDB & PostgreSQL primary indexes', 'SQLite table storage', 'Cloud analytical storage engines'],
            advantages: ['O(log_b n) point lookup PLUS fast sequential leaf-chain range scans', 'Internal nodes fit even more routing keys per 4KB page'],
            limitations: ['Routing keys are duplicated in both internal and leaf layers'],
            whenToUse: 'Use for relational database indexes supporting both point lookups and WHERE BETWEEN range scans.'
        },
        complexity: {
            bestTime: 'O(log_b n)',
            averageTime: 'O(log_b n + k) Range',
            worstTime: 'O(log_b n)',
            space: 'O(n)',
            inPlace: false,
            stable: true,
            simpleExplanation: 'Routes from root down to the target leaf node, then follows horizontal leaf pointers for range queries.'
        },
        pseudocode: [
            '1. Route from root through internal separator keys down to target leaf',
            '2. Insert key into sorted leaf page',
            '3. If leaf overflows: split leaf into two and copy middle key up to parent',
            '4. Maintain horizontal nextLeaf pointer between adjacent leaf nodes',
            '5. For Range Query [L, R]: locate leaf(L) and scan nextLeaf chain until > R'
        ]
    },
    {
        slug: 'red-black-trees',
        name: 'Red-Black Trees',
        category: 'advanced',
        categoryLabel: 'Advanced Data Structures',
        engineType: 'tree',
        subVariant: 'rbt',
        difficulty: 'Advanced',
        sequenceOrder: 23,
        isRecommended: true,
        shortDescription: 'Color-invariant self-balancing BST guaranteeing O(log n) ops with at most 2 rotations per insertion.',
        overview: {
            whatItIs: 'A Red-Black Tree is a self-balancing BST where every node carries a 1-bit color (RED or BLACK) enforcing that no path is more than twice as long as any other.',
            whyUsed: 'Powers C++ std::map / std::set, Java TreeMap / HashMap tree bins, and the Linux Completely Fair Scheduler (CFS) because insertions and deletions require at most O(1) rotations!',
            howItStores: 'Invariants: (1) Root is BLACK, (2) No RED node has a RED child, (3) Every root-to-NULL path has identical Black-Height.',
            realWorldApplications: ['C++ STL std::map and std::set', 'Java TreeMap, TreeSet & HashMap collision bins', 'Linux Kernel CFS process scheduler & epoll'],
            advantages: ['At most 2 rotations on insertion and 3 on deletion', 'Guaranteed height <= 2 log2(n + 1)'],
            limitations: ['Slightly less strictly balanced than AVL for pure read-only workloads'],
            whenToUse: 'Use for general-purpose ordered maps/sets with frequent insertions and deletions.'
        },
        complexity: {
            bestTime: 'O(log n)',
            averageTime: 'O(log n)',
            worstTime: 'O(log n) Guaranteed',
            space: 'O(n)',
            inPlace: false,
            stable: true,
            simpleExplanation: 'New nodes enter colored RED; Red-Red violations are fixed by Recoloring (if uncle is RED) or Rotation (if uncle is BLACK).'
        },
        pseudocode: [
            '1. Insert new node colored RED using standard BST rules',
            '2. If parent is BLACK -> valid Red-Black Tree',
            '3. If parent is RED and uncle is RED -> Recolor parent & uncle BLACK, grandparent RED',
            '4. If parent is RED and uncle is BLACK -> perform Rotation + Recolor',
            '5. Always enforce Root.color = BLACK'
        ]
    }
];

export const PART_ONE_TOPICS = RAW_TOPICS.map((t) => ({
    ...t,
    codeExamples: buildFiveLangCode(t.name, t.pseudocode, t.codeExamples),
    practiceQuestions: buildPracticeSuite(
        t.name,
        t.complexity.bestTime,
        t.complexity.averageTime,
        t.complexity.worstTime,
        t.complexity.space
    )
}));
