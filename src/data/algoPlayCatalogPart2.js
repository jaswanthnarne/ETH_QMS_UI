import {
    ALGOPLAY_CATEGORIES,
    BIG_O_REFERENCE_TABLE,
    SORTING_COMPARISON_TABLE,
    PART_ONE_TOPICS
} from './algoPlayCatalogPart1.js';

const buildFiveLangCode = (name, pseudocode = [], customCode = {}) => {
    const bodyComment = pseudocode.map((l) => `    // ${l}`).join('\n');
    return {
        c:
            customCode.c ||
            `#include <stdio.h>\n#include <stdlib.h>\n\n// ${name} in C\nvoid execute_${name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}(int *arr, int n, int target) {\n${bodyComment}\n    for (int i = 0; i < n; i++) printf("%d ", arr[i]);\n    printf("\\n");\n}`,
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

const buildPracticeSuite = (name, best, avg, worst, space) => [
    {
        question: `What is the worst-case time complexity of ${name} on an input of size n?`,
        difficulty: 'Easy',
        options: [worst, best === worst ? 'O(1)' : best, 'O(2ⁿ)', 'O(n!)'],
        correctIndex: 0,
        explanation: `In the worst-case scenario, ${name} runs in ${worst} time and ${space} auxiliary space.`
    },
    {
        question: `What is the auxiliary space complexity required by ${name}?`,
        difficulty: 'Medium',
        options: [space, space === 'O(1)' ? 'O(n)' : 'O(1)', 'O(n²)', 'O(2ⁿ)'],
        correctIndex: 0,
        explanation: `${name} requires ${space} auxiliary space during execution.`
    },
    {
        question: `During step-by-step execution of ${name}, how does the algorithm guarantee termination and correctness?`,
        difficulty: 'Hard',
        options: [
            `By strictly advancing the invariant boundary / search interval on every comparison step`,
            'By guessing random indices without bounds checking',
            'By copying the entire memory space into a factorial tree',
            'By skipping all elements that are negative or duplicate'
        ],
        correctIndex: 0,
        explanation: `Every step of ${name} deterministically shrinks the remaining problem space or expands the verified prefix.`
    }
];

const PART_TWO_RAW = [
    /* =========================================================================
       4. SEARCHING ALGORITHMS (5)
       ========================================================================= */
    {
        slug: 'linear-search',
        name: 'Linear Search',
        category: 'searching',
        categoryLabel: 'Searching Algorithms',
        engineType: 'searching',
        subVariant: 'linear',
        difficulty: 'Beginner',
        sequenceOrder: 24,
        isRecommended: true,
        shortDescription: 'Sequential index-by-index scan working on both sorted and unsorted arrays in O(n) time.',
        overview: {
            whatItIs: 'Linear Search inspects every element sequentially from index 0 to n-1 until the target value is matched or the array ends.',
            whyUsed: 'Works on unsorted arrays with zero preprocessing cost.',
            howItStores: 'Requires only a single loop cursor index i (O(1) extra space).',
            realWorldApplications: ['Searching small unsorted lists (< 32 items)', 'One-off search on streaming data', 'Finding all occurrences of a predicate'],
            advantages: ['No sorting required', 'O(1) space complexity and cache-friendly sequential scan'],
            limitations: ['O(n) worst-case time is slow for large datasets (N > 10,000)'],
            whenToUse: 'Use when the array is unsorted and only searched once.'
        },
        complexity: {
            bestTime: 'O(1)',
            averageTime: 'O(n)',
            worstTime: 'O(n)',
            space: 'O(1)',
            inPlace: true,
            stable: true,
            simpleExplanation: 'Checks index 0, then 1, then 2... taking at most n comparisons.'
        },
        pseudocode: [
            '1. Set index i = 0, comparisons = 0',
            '2. While i < n:',
            '3.   Increment comparisons; compare arr[i] with target',
            '4.   If arr[i] == target -> return FOUND at index i',
            '5.   Advance i = i + 1; if loop ends -> return NOT FOUND (-1)'
        ]
    },
    {
        slug: 'binary-search',
        name: 'Binary Search',
        category: 'searching',
        categoryLabel: 'Searching Algorithms',
        engineType: 'searching',
        subVariant: 'binary',
        difficulty: 'Beginner',
        sequenceOrder: 25,
        isRecommended: true,
        shortDescription: 'Divide-and-conquer search on a sorted array that halves the active interval [low, high] in O(log n) time.',
        overview: {
            whatItIs: 'Binary Search compares the target against the midpoint mid = low + (high - low)/2 of a sorted array and discards half the search space at every step.',
            whyUsed: 'Finds an element in a sorted array of 1,000,000 items in at most 20 comparisons!',
            howItStores: 'Tracks three pointers: low, high, and mid.',
            realWorldApplications: ['Database B-Tree page binary search', 'Git bisect bug hunting', 'Monotonic search-on-answer optimization problems'],
            advantages: ['Logarithmic O(log n) speed', 'O(1) iterative space'],
            limitations: ['Strictly requires the input array to be sorted first!'],
            whenToUse: 'Use whenever searching a sorted random-access array.'
        },
        complexity: {
            bestTime: 'O(1)',
            averageTime: 'O(log n)',
            worstTime: 'O(log n)',
            space: 'O(1)',
            inPlace: true,
            stable: true,
            simpleExplanation: 'Because the array is sorted, comparing arr[mid] tells us with 100% certainty whether the target lies in the left half or right half.'
        },
        pseudocode: [
            '1. Ensure array is sorted; initialize low = 0, high = n - 1',
            '2. While low <= high:',
            '3.   Compute mid = low + floor((high - low) / 2)',
            '4.   If arr[mid] == target -> return FOUND at mid',
            '5.   If arr[mid] < target -> low = mid + 1; else -> high = mid - 1'
        ]
    },
    {
        slug: 'jump-search',
        name: 'Jump Search',
        category: 'searching',
        categoryLabel: 'Searching Algorithms',
        engineType: 'searching',
        subVariant: 'jump',
        difficulty: 'Beginner',
        sequenceOrder: 26,
        isRecommended: false,
        shortDescription: 'Jumps ahead by fixed block stride m = √n on a sorted array, then runs a linear scan inside the candidate block in O(√n).',
        overview: {
            whatItIs: 'Jump Search steps forward in fixed jumps of size √n until it finds a block [prev, step] containing the target, then performs a linear scan inside that block.',
            whyUsed: 'Requires only forward jumps (never steps backward like Binary Search), which is useful on forward-only tape/skip streams.',
            howItStores: 'Tracks block start prev and block end step = floor(√n).',
            realWorldApplications: ['Forward-only sorted skip streams', 'Disk sequential block skipping'],
            advantages: ['Faster than Linear Search: O(√n) vs O(n)', 'Only jumps forward once before 1 local linear pass'],
            limitations: ['Slower than Binary Search O(log n)'],
            whenToUse: 'Use on sorted structures where jumping backward is costly.'
        },
        complexity: {
            bestTime: 'O(1)',
            averageTime: 'O(√n)',
            worstTime: 'O(√n)',
            space: 'O(1)',
            inPlace: true,
            stable: true,
            simpleExplanation: 'At most √n block jumps plus √n linear comparisons inside the matching block.'
        },
        pseudocode: [
            '1. Set block jump size m = floor(sqrt(n)), prev = 0, step = m',
            '2. While arr[min(step, n) - 1] < target: prev = step; step += m',
            '3. Linearly scan i from prev to min(step, n) - 1',
            '4. If arr[i] == target -> return FOUND at i',
            '5. Else return NOT FOUND (-1)'
        ]
    },
    {
        slug: 'interpolation-search',
        name: 'Interpolation Search',
        category: 'searching',
        categoryLabel: 'Searching Algorithms',
        engineType: 'searching',
        subVariant: 'interpolation',
        difficulty: 'Intermediate',
        sequenceOrder: 27,
        isRecommended: false,
        shortDescription: 'Estimates target position proportionally using linear interpolation formula in O(log(log n)) on uniform distributions.',
        overview: {
            whatItIs: 'Interpolation Search improves on Binary Search for uniformly distributed sorted arrays by estimating the probe index proportionally to how close target is to arr[low] vs arr[high].',
            whyUsed: 'Just like looking up "Zebra" near the back of a dictionary and "Apple" near the front, it achieves O(log(log n)) average comparisons!',
            howItStores: 'Probes pos = low + ((target - arr[low]) * (high - low)) / (arr[high] - arr[low]).',
            realWorldApplications: ['Searching uniformly distributed timestamp logs', 'Telephone directory & numeric ID tables'],
            advantages: ['O(log(log n)) on uniformly distributed numeric arrays'],
            limitations: ['Degrades to O(n) on exponentially skewed value distributions'],
            whenToUse: 'Use on large sorted arrays with roughly uniform numeric spacing.'
        },
        complexity: {
            bestTime: 'O(1)',
            averageTime: 'O(log(log n))',
            worstTime: 'O(n)',
            space: 'O(1)',
            inPlace: true,
            stable: true,
            simpleExplanation: 'Calculates probe position proportionally using value ratios instead of always picking the 50% middle.'
        },
        pseudocode: [
            '1. While low <= high and arr[low] <= target <= arr[high]:',
            '2.   Estimate pos = low + ((target - arr[low]) * (high - low)) / (arr[high] - arr[low])',
            '3.   If arr[pos] == target -> return FOUND at pos',
            '4.   If arr[pos] < target -> low = pos + 1; else -> high = pos - 1',
            '5. Return NOT FOUND (-1)'
        ]
    },
    {
        slug: 'exponential-search',
        name: 'Exponential Search',
        category: 'searching',
        categoryLabel: 'Searching Algorithms',
        engineType: 'searching',
        subVariant: 'exponential',
        difficulty: 'Intermediate',
        sequenceOrder: 28,
        isRecommended: false,
        shortDescription: 'Doubles the bound index (1, 2, 4, 8, 16...) until exceeding target, then runs Binary Search inside [bound/2, bound].',
        overview: {
            whatItIs: 'Exponential Search (Galloping Search) finds a range [2^(k-1), 2^k] containing the target by repeatedly doubling the index bound, then runs Binary Search inside that window.',
            whyUsed: 'Ideal for unbounded/infinite sorted streams or when the target is located near the beginning of the array (runs in O(log i) where i is the target index!).',
            howItStores: 'Tracks doubling bound = 1, 2, 4, 8... and binary search bounds [bound/2, min(bound, n-1)].',
            realWorldApplications: ['Timsort galloping mode in Python & Java', 'Searching unbounded sorted streams', 'Inverted index posting lists'],
            advantages: ['Runs in O(log i) where i is the index of the target', 'Works on unbounded sorted arrays'],
            limitations: ['Requires sorted input'],
            whenToUse: 'Use when target is expected near the start of a sorted array or stream size is unknown.'
        },
        complexity: {
            bestTime: 'O(1)',
            averageTime: 'O(log i)',
            worstTime: 'O(log n)',
            space: 'O(1)',
            inPlace: true,
            stable: true,
            simpleExplanation: 'Doubles bound = 1, 2, 4, 8... in log(i) steps, then binary searches [bound/2, bound] in log(i) steps.'
        },
        pseudocode: [
            '1. If arr[0] == target -> return FOUND at 0',
            '2. Set bound = 1; while bound < n and arr[bound] <= target: bound *= 2',
            '3. Define window low = bound / 2, high = min(bound, n - 1)',
            '4. Execute Binary Search inside [low, high]',
            '5. Return found index or -1'
        ]
    },

    /* =========================================================================
       5. SORTING ALGORITHMS (10)
       ========================================================================= */
    {
        slug: 'bubble-sort',
        name: 'Bubble Sort',
        category: 'sorting',
        categoryLabel: 'Sorting Algorithms',
        engineType: 'sorting',
        subVariant: 'bubble',
        difficulty: 'Beginner',
        sequenceOrder: 29,
        isRecommended: true,
        shortDescription: 'Repeatedly compares and swaps adjacent out-of-order pairs (arr[j], arr[j+1]), bubbling the largest element to the end.',
        overview: {
            whatItIs: 'Bubble Sort steps through the array repeatedly, comparing adjacent pairs and swapping them if they are out of order.',
            whyUsed: 'Simple introductory stable in-place sort with an O(n) early-exit flag when the array is already sorted.',
            howItStores: 'In-place swaps inside the input array with a boolean swapped flag.',
            realWorldApplications: ['Detecting already-sorted arrays in O(n)', 'Fixing single out-of-place adjacent elements'],
            advantages: ['Stable and in-place (O(1) extra space)', 'Terminates in 1 pass O(n) on already-sorted input'],
            limitations: ['O(n²) comparisons and swaps make it slow on large inputs'],
            whenToUse: 'Use for educational visualization or verifying nearly sorted tiny arrays.'
        },
        complexity: {
            bestTime: 'O(n)',
            averageTime: 'O(n²)',
            worstTime: 'O(n²)',
            space: 'O(1)',
            inPlace: true,
            stable: true,
            simpleExplanation: 'After pass i, the i+1 largest elements are locked in their final sorted positions at the right end.'
        },
        pseudocode: [
            '1. For pass i = 0 to n - 2:',
            '2.   Set swapped = false',
            '3.   For j = 0 to n - 2 - i: compare arr[j] and arr[j + 1]',
            '4.     If arr[j] > arr[j + 1]: swap(arr[j], arr[j + 1]); swapped = true',
            '5.   If not swapped -> break early (array is sorted!)'
        ]
    },
    {
        slug: 'selection-sort',
        name: 'Selection Sort',
        category: 'sorting',
        categoryLabel: 'Sorting Algorithms',
        engineType: 'sorting',
        subVariant: 'selection',
        difficulty: 'Beginner',
        sequenceOrder: 30,
        isRecommended: true,
        shortDescription: 'Finds the minimum element in the unsorted suffix [i..n-1] and swaps it into position i (at most n-1 swaps total).',
        overview: {
            whatItIs: 'Selection Sort divides the array into a sorted prefix [0..i-1] and an unsorted suffix [i..n-1], repeatedly selecting the minimum from the suffix.',
            whyUsed: 'Performs at most N - 1 swaps in total—minimizing memory writes when writing to flash/EEPROM is expensive.',
            howItStores: 'Tracks current minimum index minIdx during each scan pass.',
            realWorldApplications: ['Flash memory where writes/swaps are costly', 'Small embedded buffers'],
            advantages: ['At most O(n) swaps (minimum possible among swap sorts)', 'In-place O(1) memory'],
            limitations: ['Always performs O(n²) comparisons even if the array is already sorted', 'Not stable by default'],
            whenToUse: 'Use on small arrays when memory write operations must be minimized.'
        },
        complexity: {
            bestTime: 'O(n²)',
            averageTime: 'O(n²)',
            worstTime: 'O(n²)',
            space: 'O(1)',
            inPlace: true,
            stable: false,
            simpleExplanation: 'Scans the remaining unsorted elements to find the smallest value and swaps it to the front of the unsorted region.'
        },
        pseudocode: [
            '1. For i = 0 to n - 2:',
            '2.   Set minIdx = i',
            '3.   For j = i + 1 to n - 1: if arr[j] < arr[minIdx] -> minIdx = j',
            '4.   If minIdx != i -> swap(arr[i], arr[minIdx])',
            '5. Lock index i as sorted'
        ]
    },
    {
        slug: 'insertion-sort',
        name: 'Insertion Sort',
        category: 'sorting',
        categoryLabel: 'Sorting Algorithms',
        engineType: 'sorting',
        subVariant: 'insertion',
        difficulty: 'Beginner',
        sequenceOrder: 31,
        isRecommended: true,
        shortDescription: 'Inserts each element key = arr[i] into its proper position inside the already-sorted left prefix [0..i-1].',
        overview: {
            whatItIs: 'Insertion Sort works like sorting playing cards in your hand: it picks key = arr[i] and shifts larger elements in the sorted left prefix right by 1 slot before dropping key into place.',
            whyUsed: 'Extremely fast on small arrays (N <= 24) and adaptive O(n + inversions) on nearly sorted data—used inside Timsort and Introsort!',
            howItStores: 'Holds key = arr[i] in a temporary variable while shifting larger prefix items.',
            realWorldApplications: ['Base case inside C++ std::sort (Introsort) and Python/Java Timsort for partitions < 24', 'Online streaming insertion'],
            advantages: ['Stable, in-place O(1), and O(n) on nearly sorted arrays', 'Very low constant overhead'],
            limitations: ['O(n²) on reverse-sorted large arrays'],
            whenToUse: 'Use for small subarrays or nearly sorted data streams.'
        },
        complexity: {
            bestTime: 'O(n)',
            averageTime: 'O(n²)',
            worstTime: 'O(n²)',
            space: 'O(1)',
            inPlace: true,
            stable: true,
            simpleExplanation: 'Picks the next unsorted card and slides it left past any larger sorted cards.'
        },
        pseudocode: [
            '1. For i = 1 to n - 1:',
            '2.   Save key = arr[i] in temporary storage; set j = i - 1',
            '3.   While j >= 0 and arr[j] > key: shift arr[j + 1] = arr[j]; j--',
            '4.   Place arr[j + 1] = key',
            '5. Prefix [0..i] is now sorted'
        ]
    },
    {
        slug: 'merge-sort',
        name: 'Merge Sort',
        category: 'sorting',
        categoryLabel: 'Sorting Algorithms',
        engineType: 'sorting',
        subVariant: 'merge',
        difficulty: 'Intermediate',
        sequenceOrder: 32,
        isRecommended: true,
        shortDescription: 'Stable divide-and-conquer sort that splits the array into halves and merges sorted subarrays in guaranteed O(n log n).',
        overview: {
            whatItIs: 'Merge Sort recursively divides the array into two halves until reaching 1-element base cases, then merges pairs of sorted subarrays using a temporary buffer.',
            whyUsed: 'Guarantees worst-case O(n log n) time complexity AND preserves relative stability of equal elements.',
            howItStores: 'Uses an O(n) auxiliary merge buffer to interleave Left[l..mid] and Right[mid+1..r].',
            realWorldApplications: ['External disk sorting of multi-gigabyte files', 'Sorting Linked Lists in O(n log n)', 'Counting array inversions', 'Foundation of Timsort'],
            advantages: ['Guaranteed O(n log n) worst-case time', 'Stable sort (preserves order of equal keys)'],
            limitations: ['Requires O(n) auxiliary memory buffer for arrays'],
            whenToUse: 'Use when stability and guaranteed worst-case O(n log n) performance are required.'
        },
        complexity: {
            bestTime: 'O(n log n)',
            averageTime: 'O(n log n)',
            worstTime: 'O(n log n)',
            space: 'O(n)',
            inPlace: false,
            stable: true,
            simpleExplanation: 'Splits log2(n) levels deep and performs O(n) linear two-pointer merges at each level.'
        },
        pseudocode: [
            '1. DIVIDE: if left >= right -> return (base case of 1 element)',
            '2. Compute mid = (left + right) / 2',
            '3. Recursively sort Left[left..mid] and Right[mid+1..right]',
            '4. MERGE: compare heads of Left and Right into temporary buffer',
            '5. Copy merged sorted buffer back into arr[left..right]'
        ]
    },
    {
        slug: 'quick-sort',
        name: 'Quick Sort',
        category: 'sorting',
        categoryLabel: 'Sorting Algorithms',
        engineType: 'sorting',
        subVariant: 'quick',
        difficulty: 'Intermediate',
        sequenceOrder: 33,
        isRecommended: true,
        shortDescription: 'In-place divide-and-conquer sort that partitions elements around a Pivot (< pivot on left, > pivot on right).',
        overview: {
            whatItIs: 'Quick Sort selects a Pivot element, partitions the subarray so all smaller elements sit left of the pivot and all larger elements sit right, places the pivot in its final sorted index, and recurses on both sides.',
            whyUsed: 'Fastest general-purpose in-place sort in practice due to sequential L1 cache-friendly partitioning and O(log n) auxiliary stack space.',
            howItStores: 'Maintains partition boundary pointer i and scan pointer j around pivot = arr[high].',
            realWorldApplications: ['C qsort and C++ std::sort (Introsort)', 'Java Arrays.sort for primitives (Dual-Pivot Quicksort)'],
            advantages: ['In-place (O(log n) stack space)', 'Exceptional cache locality and low constant factor'],
            limitations: ['Not stable', 'Worst-case O(n²) if poor pivots are chosen on sorted data without randomization'],
            whenToUse: 'Use as the default fast in-place sort for primitive arrays.'
        },
        complexity: {
            bestTime: 'O(n log n)',
            averageTime: 'O(n log n)',
            worstTime: 'O(n²)',
            space: 'O(log n)',
            inPlace: true,
            stable: false,
            simpleExplanation: 'Partitioning places the Pivot in its exact final sorted position and divides the remaining problem into two independent subarrays.'
        },
        pseudocode: [
            '1. Select pivot = arr[high]; set partition boundary i = low - 1',
            '2. For j = low to high - 1: compare arr[j] with pivot',
            '3.   If arr[j] <= pivot: increment i and swap(arr[i], arr[j])',
            '4. Swap pivot into final position: swap(arr[i + 1], arr[high])',
            '5. Recursively QuickSort Left[low..pivotIdx-1] and Right[pivotIdx+1..high]'
        ]
    },
    {
        slug: 'heap-sort',
        name: 'Heap Sort',
        category: 'sorting',
        categoryLabel: 'Sorting Algorithms',
        engineType: 'sorting',
        subVariant: 'heap',
        difficulty: 'Intermediate',
        sequenceOrder: 34,
        isRecommended: true,
        shortDescription: 'Builds an in-place Max-Heap in O(n) and repeatedly swaps the maximum root with the end of the unsorted prefix in O(n log n).',
        overview: {
            whatItIs: 'Heap Sort first transforms the input array into a Max-Heap in O(n) time, then repeatedly extracts the maximum root element by swapping arr[0] with arr[end] and sifting down.',
            whyUsed: 'Combines Merge Sort’s guaranteed O(n log n) worst-case time with Quick Sort’s strict O(1) auxiliary space!',
            howItStores: 'Treats the array itself as a complete binary tree where left(i) = 2i+1 and right(i) = 2i+2.',
            realWorldApplications: ['Fallback inside C++ std::sort (Introsort) when recursion depth exceeds 2 log n', 'Safety-critical real-time embedded systems with strict O(1) RAM limits'],
            advantages: ['Strict O(n log n) worst-case time AND strict O(1) auxiliary space'],
            limitations: ['Not stable', 'Non-sequential parent-to-child array jumps have more cache misses than Quick Sort'],
            whenToUse: 'Use when both worst-case O(n log n) time and O(1) space are mandatory.'
        },
        complexity: {
            bestTime: 'O(n log n)',
            averageTime: 'O(n log n)',
            worstTime: 'O(n log n)',
            space: 'O(1)',
            inPlace: true,
            stable: false,
            simpleExplanation: 'Phase 1 builds a Max-Heap in O(n); Phase 2 swaps max root to the end and calls heapify n-1 times.'
        },
        pseudocode: [
            '1. BUILD MAX-HEAP: for i = n/2 - 1 down to 0: siftDown(arr, n, i)',
            '2. For end = n - 1 down to 1:',
            '3.   Swap max root arr[0] with arr[end] (locks arr[end] as sorted)',
            '4.   Call siftDown(arr, end, 0) on reduced heap [0..end-1]',
            '5. Array is completely sorted in-place'
        ]
    },
    {
        slug: 'shell-sort',
        name: 'Shell Sort',
        category: 'sorting',
        categoryLabel: 'Sorting Algorithms',
        engineType: 'sorting',
        subVariant: 'shell',
        difficulty: 'Intermediate',
        sequenceOrder: 35,
        isRecommended: false,
        shortDescription: 'Generalized gapped Insertion Sort that sorts elements far apart (gap = n/2, n/4, ..., 1) to eliminate large inversions early.',
        overview: {
            whatItIs: 'Shell Sort generalizes Insertion Sort by comparing and shifting elements separated by a decreasing stride gap (n/2, n/4, ..., 1).',
            whyUsed: 'Moves small elements from the far right to the far left in a few big jumps instead of n individual adjacent shifts.',
            howItStores: 'In-place gapped insertion passes with O(1) extra memory.',
            realWorldApplications: ['Linux kernel uClibc embedded qsort replacement', 'Hardware/firmware sorting with zero stack recursion'],
            advantages: ['Zero recursion stack (strict O(1) space)', '5x–50x faster than standard Insertion Sort on medium arrays'],
            limitations: ['Not stable'],
            whenToUse: 'Use in embedded systems where O(1) stack space and simple code are required.'
        },
        complexity: {
            bestTime: 'O(n log n)',
            averageTime: 'O(n^1.25)',
            worstTime: 'O(n²)',
            space: 'O(1)',
            inPlace: true,
            stable: false,
            simpleExplanation: 'H-sorts the array with shrinking gaps until the final gap = 1 pass finishes on an almost-sorted array in O(n).'
        },
        pseudocode: [
            '1. Initialize gap = floor(n / 2)',
            '2. While gap > 0:',
            '3.   For i = gap to n - 1: save temp = arr[i]; j = i',
            '4.     While j >= gap and arr[j - gap] > temp: arr[j] = arr[j - gap]; j -= gap',
            '5.     arr[j] = temp; reduce gap = floor(gap / 2)'
        ]
    },
    {
        slug: 'counting-sort',
        name: 'Counting Sort',
        category: 'sorting',
        categoryLabel: 'Sorting Algorithms',
        engineType: 'sorting',
        subVariant: 'counting',
        difficulty: 'Intermediate',
        sequenceOrder: 36,
        isRecommended: false,
        shortDescription: 'Non-comparison integer sort that tallies frequencies in a count[] histogram and reconstructs sorted order in O(n + k).',
        overview: {
            whatItIs: 'Counting Sort is a non-comparison sorting algorithm that counts the occurrences of each distinct integer key in a frequency array, computes prefix sums, and places items directly into their output positions.',
            whyUsed: 'Beats the O(n log n) comparison-sort lower bound, running in linear O(n + k) time when the key range k is bounded!',
            howItStores: 'Allocates a frequency histogram count[0..k] and an output[0..n-1] buffer.',
            realWorldApplications: ['Subroutine inside Radix Sort', 'Sorting exam scores (0..100) or age distributions', 'Character frequency sorting'],
            advantages: ['Linear O(n + k) time complexity', 'Stable when prefix sums are scanned right-to-left'],
            limitations: ['Only works on discrete integer keys within a bounded range k'],
            whenToUse: 'Use when sorting integers whose range k = max - min is O(n).'
        },
        complexity: {
            bestTime: 'O(n + k)',
            averageTime: 'O(n + k)',
            worstTime: 'O(n + k)',
            space: 'O(n + k)',
            inPlace: false,
            stable: true,
            simpleExplanation: 'Counts how many times each value appears, computes cumulative positions, and writes sorted output in linear time.'
        },
        pseudocode: [
            '1. Find minVal and maxVal; allocate count[0 .. maxVal - minVal]',
            '2. Tally frequencies: count[arr[i] - minVal]++ for each element',
            '3. Accumulate prefix sums: count[i] += count[i - 1]',
            '4. Place elements into output[] using prefix positions',
            '5. Copy sorted output[] back into arr[]'
        ]
    },
    {
        slug: 'radix-sort',
        name: 'Radix Sort (LSD)',
        category: 'sorting',
        categoryLabel: 'Sorting Algorithms',
        engineType: 'sorting',
        subVariant: 'radix',
        difficulty: 'Intermediate',
        sequenceOrder: 37,
        isRecommended: false,
        shortDescription: 'Non-comparison digit-by-digit sort that applies stable Counting Sort from Least Significant Digit (1s, 10s, 100s) to Most.',
        overview: {
            whatItIs: 'LSD Radix Sort processes integers digit-by-digit from the least significant place value (exp = 1, 10, 100...) to the most significant digit using a stable 10-bucket Counting Sort.',
            whyUsed: 'Sorts large arrays of 32-bit/64-bit integers or fixed-length strings in linear O(d * (n + b)) time without element-to-element comparisons.',
            howItStores: 'Uses 10 digit buckets (0–9) and an O(n) staging buffer per digit pass.',
            realWorldApplications: ['GPU parallel high-speed sorting (thrust::sort)', 'Sorting millions of 64-bit IDs or IPv4 addresses', 'Suffix array construction'],
            advantages: ['Linear O(d * n) time for fixed-width integers', 'Stable across all digit passes'],
            limitations: ['Requires O(n) auxiliary buffer and stable bucket subroutine'],
            whenToUse: 'Use for large arrays of integers or fixed-length strings.'
        },
        complexity: {
            bestTime: 'O(d(n + b))',
            averageTime: 'O(d(n + b))',
            worstTime: 'O(d(n + b))',
            space: 'O(n + b)',
            inPlace: false,
            stable: true,
            simpleExplanation: 'Sorts by the 1s digit first, then stably by the 10s digit, then the 100s digit.'
        },
        pseudocode: [
            '1. Find maximum value maxVal in array',
            '2. For place value exp = 1; maxVal / exp > 0; exp *= 10:',
            '3.   Extract digit d = (arr[i] / exp) % 10 for each element',
            '4.   Stably group elements into digit buckets 0..9',
            '5.   Collect buckets 0..9 back into arr[] for next digit pass'
        ]
    },
    {
        slug: 'bucket-sort',
        name: 'Bucket Sort',
        category: 'sorting',
        categoryLabel: 'Sorting Algorithms',
        engineType: 'sorting',
        subVariant: 'bucket',
        difficulty: 'Intermediate',
        sequenceOrder: 38,
        isRecommended: false,
        shortDescription: 'Distributes elements into range buckets, sorts each small bucket individually, and concatenates the buckets in O(n + k).',
        overview: {
            whatItIs: 'Bucket Sort (Scatter-Gather Sort) partitions the value range [min, max] into k equal-width interval buckets, scatters each element into its corresponding bucket, sorts each bucket with Insertion Sort, and gathers them in order.',
            whyUsed: 'Achieves expected linear O(n + k) time when input values are uniformly distributed across a range.',
            howItStores: 'Allocates k dynamic bucket lists and concatenates them back into the main array.',
            realWorldApplications: ['Sorting uniformly distributed floating-point values in [0.0, 1.0)', 'Histogram-based parallel distributed sorting'],
            advantages: ['O(n) average time on uniform distributions', 'Buckets can be sorted independently in parallel'],
            limitations: ['Degrades to O(n²) if all elements cluster into a single bucket'],
            whenToUse: 'Use when input values are uniformly distributed over a known range.'
        },
        complexity: {
            bestTime: 'O(n + k)',
            averageTime: 'O(n + k)',
            worstTime: 'O(n²)',
            space: 'O(n + k)',
            inPlace: false,
            stable: true,
            simpleExplanation: 'Scatters items into range buckets, sorts each small bucket, and gathers them sequentially.'
        },
        pseudocode: [
            '1. Create k empty range buckets covering [minVal .. maxVal]',
            '2. SCATTER: for each x in arr -> push x into bucket[floor((x - min) / range * k)]',
            '3. SORT: sort each non-empty bucket using Insertion Sort',
            '4. GATHER: concatenate bucket[0], bucket[1], ..., bucket[k-1] into arr[]'
        ]
    }
];

export const PART_TWO_TOPICS = PART_TWO_RAW.map((t) => ({
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

export { ALGOPLAY_CATEGORIES, BIG_O_REFERENCE_TABLE, SORTING_COMPARISON_TABLE, PART_ONE_TOPICS };
