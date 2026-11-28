export const C_AND_JAVA_TRACKS = [
    /* =========================================================================
       2. C PROGRAMMING (10 CHAPTERS)
       ========================================================================= */
    {
        slug: 'c',
        name: 'C',
        fullName: 'ANSI C & Systems Memory Programming',
        badge: 'C',
        tagline: 'Foundational systems language offering direct hardware memory access, pointers, and deterministic speed.',
        description:
            'Master low-level computer architecture through C: compilation pipelines, bitwise registers, pointer arithmetic, contiguous arrays, stack vs heap allocation, structs, and file descriptors.',
        accentColor: '#0284C7',
        secondaryColor: '#E0F2FE',
        fileExtension: '.c',
        paradigm: 'Procedural, Imperative, Structured Systems',
        creatorInfo: 'Created by Dennis Ritchie at Bell Labs • Direct Native Machine Code',
        sortOrder: 2,
        chapters: [
            {
                chapterNumber: 1,
                title: 'C Compilation Pipeline, Process Memory Layout & Data Types',
                duration: '15 min read',
                difficulty: 'Beginner',
                summary: 'Trace how GCC transforms .c source code through Preprocessing, Compilation, Assembly, and Linking into a native executable binary.',
                overview: `C is a compiled, statically typed systems programming language that maps closely to hardware instructions. When you compile a file with gcc main.c -o app, four distinct stages run:
1. Preprocessor (cpp): Expands #include headers, #define macros, and strips comments (.i file).
2. Compiler (cc1): Translates preprocessed C code into target-architecture assembly instructions (.s file).
3. Assembler (as): Converts assembly mnemonics into relocatable machine-code object files (.o file).
4. Linker (ld): Resolves external symbols (like printf from libc) and produces the final executable binary.

In memory, a running C process is divided into five segments: Text/Code (read-only machine instructions), Data (initialized global/static variables), BSS (zero-initialized globals), Heap (grows upward via malloc), and Stack (grows downward for local function call frames).`,
                keyPoints: [
                    'sizeof(type) is evaluated at compile time and returns size in bytes (e.g., char=1, int=4, double=8, 64-bit pointer=8).',
                    'Local variables on the stack contain garbage values until explicitly initialized; global and static variables default to 0 in BSS.',
                    'Signed integer overflow is Undefined Behavior (UB) in C; unsigned integers wrap modulo 2^N.',
                    'Use stdint.h fixed-width types (int32_t, int64_t, uint8_t) when exact bit widths are required.'
                ],
                diagramTitle: 'GCC 4-Stage Compilation & 5-Segment RAM Layout',
                diagramSteps: [
                    'Preprocessor (#include -> main.i)',
                    'Compiler (AST -> Assembly main.s)',
                    'Assembler (Object Code main.o)',
                    'Linker (ld + libc -> ELF/PE Binary)',
                    'RAM: [Text | Data | BSS | Heap ↑ | ↓ Stack]'
                ],
                graphTitle: 'C Primitive Data Type Memory Sizes (64-Bit ABI)',
                graphMetricLabel: 'Size in Bytes (1 Byte = 8 Bits)',
                graphData: [
                    { label: 'char / uint8_t', value: 12, displayValue: '1 Byte (8 bits)', note: '-128 to 127 or 0 to 255' },
                    { label: 'short / int16_t', value: 25, displayValue: '2 Bytes (16 bits)', note: '-32,768 to 32,767' },
                    { label: 'int / float', value: 50, displayValue: '4 Bytes (32 bits)', note: '±2.14 Billion / IEEE-754 Single' },
                    { label: 'long long / double / void*', value: 100, displayValue: '8 Bytes (64 bits)', note: '64-bit integer, double, or pointer' }
                ],
                syntaxSummaryCode: `#include <stdio.h>
#include <stdint.h>

int global_counter = 100;       // Stored in Initialized Data segment
static int bss_default;         // Stored in BSS segment (auto-zeroed)

int main(void) {
    int32_t score = 95;         // Stack frame variable (4 bytes)
    double gpa = 9.15;          // IEEE-754 double precision (8 bytes)
    char grade = 'A';           // Single ASCII byte (1 byte)

    printf("Score: %d | GPA: %.2f | Grade: %c\\n", score, gpa, grade);
    printf("Sizes -> int:%zu, double:%zu, ptr:%zu\\n",
           sizeof(int), sizeof(double), sizeof(void *));
    return 0;
}`,
                syntaxTable: [
                    { construct: 'Format Specifiers', syntax: '%d, %lld, %u, %zu, %.2f, %c, %s, %p', description: 'int, long long, unsigned, size_t, float/double, char, string, pointer.' },
                    { construct: 'Compile-Time Size', syntax: 'sizeof(expression)', description: 'Returns byte width as size_t at compile time.' },
                    { construct: 'Fixed-Width Ints', syntax: 'int32_t, int64_t, uint32_t', description: 'Portable exact-width types from <stdint.h>.' },
                    { construct: 'Constant Qualifier', syntax: 'const int MAX_N = 1000;', description: 'Enforces read-only variable access at compile time.' }
                ],
                examples: [
                    {
                        title: 'Inspecting Stack vs Data/BSS Memory Addresses',
                        code: `#include <stdio.h>

int init_global = 42;
int uninit_global;

int main(void) {
    int stack_local = 7;
    printf("Data Segment (&init_global):   %p\\n", (void*)&init_global);
    printf("BSS Segment  (&uninit_global): %p (val=%d)\\n", (void*)&uninit_global, uninit_global);
    printf("Stack Frame  (&stack_local):   %p\\n", (void*)&stack_local);
    return 0;
}`,
                        output: `Data Segment (&init_global):   0x55a8c1204010
BSS Segment  (&uninit_global): 0x55a8c1204018 (val=0)
Stack Frame  (&stack_local):   0x7ffd9b41e8bc`,
                        explanation: 'Globals reside in low virtual memory addresses (Data/BSS), whereas stack variables reside near the top of user-space virtual memory.'
                    }
                ],
                problems: [
                    {
                        title: 'Safe 64-Bit Multiplication Without 32-Bit Overflow',
                        difficulty: 'Easy',
                        statement: 'Given two 32-bit signed integers A and B (up to 10^9 each), compute their exact product and sum in C without triggering 32-bit signed integer overflow.',
                        sampleInput: 'A = 1000000000, B = 1000000000',
                        sampleOutput: 'Product = 1000000000000000000, Sum = 2000000000',
                        constraints: '-10^9 <= A, B <= 10^9',
                        hint: 'Cast at least one operand to (long long) before multiplying: long long prod = (long long)A * B; and print with %lld.'
                    },
                    {
                        title: 'Reverse Digits of a 32-Bit Signed Integer',
                        difficulty: 'Medium',
                        statement: 'Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside [-2^31, 2^31 - 1], return 0.',
                        sampleInput: 'x = -12340',
                        sampleOutput: '-4321',
                        constraints: 'INT_MIN <= x <= INT_MAX',
                        hint: 'Before executing rev = rev * 10 + digit, check if rev > INT_MAX / 10 or rev < INT_MIN / 10 using <limits.h>.'
                    }
                ]
            },
            {
                chapterNumber: 2,
                title: 'Bitwise Registers, Operators & Control Flow Loops',
                duration: '15 min read',
                difficulty: 'Beginner',
                summary: 'Master C operator precedence, hardware register bit masking, switch jump tables, and loop invariants.',
                overview: `C was designed to write the UNIX kernel and device drivers, making bitwise manipulation a first-class feature. Bitwise AND (&) clears or tests bits, OR (|) sets bits, XOR (^) toggles bits, and shifts (<<, >>) multiply or divide by powers of two.

For branching, C compilers optimize dense switch(val) statements into O(1) assembly jump tables. However, omitting a break statement causes execution to fall through into the next case label—useful when grouping cases intentionally, but a classic bug if forgotten.`,
                keyPoints: [
                    'Set bit k: reg |= (1U << k); Clear bit k: reg &= ~(1U << k); Toggle bit k: reg ^= (1U << k).',
                    'Check if positive integer n is a power of two in O(1): (n > 0) && ((n & (n - 1)) == 0).',
                    'Never confuse bitwise & / | with short-circuit logical && / ||.',
                    'Always use unsigned shifts (1U << k) to avoid undefined behavior when shifting into the sign bit.'
                ],
                diagramTitle: 'Bit-Register Masking & Switch Jump Table Flow',
                diagramSteps: [
                    '32-Bit Register State',
                    'Set Bit: reg |= (1U << k)',
                    'Clear Bit: reg &= ~(1U << k)',
                    'Read Bit: (reg >> k) & 1U',
                    'Switch Jump Table -> O(1) Branch'
                ],
                graphTitle: 'Branch Dispatch Latency: Switch Jump Table vs If-Else Ladder',
                graphMetricLabel: 'CPU Cycles for 16 Branch Cases',
                graphData: [
                    { label: 'Dense switch() Jump Table', value: 15, displayValue: '3 cycles (O(1))', note: 'Direct indexed address jump' },
                    { label: 'Bitmask Lookup Table', value: 12, displayValue: '2 cycles (O(1))', note: 'Branchless register mask' },
                    { label: 'Binary Search Branching', value: 38, displayValue: '9 cycles (O(log K))', note: '4 conditional jumps' },
                    { label: '16-Deep if / else if Ladder', value: 95, displayValue: '28 cycles (O(K))', note: 'Branch misprediction penalty' }
                ],
                syntaxSummaryCode: `#include <stdio.h>
#include <stdbool.h>

// Bit Manipulation Macros
#define SET_BIT(x, k)    ((x) |=  (1U << (k)))
#define CLEAR_BIT(x, k)  ((x) &= ~(1U << (k)))
#define TOGGLE_BIT(x, k) ((x) ^=  (1U << (k)))
#define CHECK_BIT(x, k)  (((x) >> (k)) & 1U)

bool is_power_of_two(unsigned int n) {
    return (n > 0) && ((n & (n - 1)) == 0);
}`,
                syntaxTable: [
                    { construct: 'Set Bit k', syntax: 'x |= (1U << k)', description: 'Forces the k-th bit of x to 1 while preserving other bits.' },
                    { construct: 'Clear Bit k', syntax: 'x &= ~(1U << k)', description: 'Forces the k-th bit of x to 0 using inverted mask.' },
                    { construct: 'Toggle Bit k', syntax: 'x ^= (1U << k)', description: 'Flips the k-th bit (0->1 or 1->0).' },
                    { construct: 'Isolate Lowest 1', syntax: 'lowbit = x & (-x)', description: 'Extracts the lowest set bit (used in Fenwick Trees / BIT).' }
                ],
                examples: [
                    {
                        title: 'Bitwise Flag Register & Power-of-Two Check',
                        code: `#include <stdio.h>

int main(void) {
    unsigned int flags = 0;
    flags |= (1U << 0); // Enable READ (bit 0)
    flags |= (1U << 2); // Enable EXEC (bit 2)
    printf("Flags after setting bit 0 & 2: %u\\n", flags);

    flags ^= (1U << 0); // Toggle READ off
    printf("Bit 0 active? %u | Bit 2 active? %u\\n",
           (flags >> 0) & 1U, (flags >> 2) & 1U);
    return 0;
}`,
                        output: `Flags after setting bit 0 & 2: 5
Bit 0 active? 0 | Bit 2 active? 1`,
                        explanation: 'Bitmasks pack 32 boolean permission flags into a single 4-byte unsigned integer with zero heap overhead.'
                    }
                ],
                problems: [
                    {
                        title: 'Count Set Bits (Hamming Weight) of an Unsigned Integer',
                        difficulty: 'Easy',
                        statement: 'Write a C function int countSetBits(unsigned int n) that returns the number of 1-bits in the binary representation of n.',
                        sampleInput: 'n = 29 (binary 11101)',
                        sampleOutput: '4',
                        constraints: '0 <= n <= 2^32 - 1',
                        hint: 'Loop while (n > 0) { n &= (n - 1); count++; } which runs in as many iterations as there are set bits.'
                    },
                    {
                        title: 'Swap Odd and Even Bits in 32-Bit Integer',
                        difficulty: 'Medium',
                        statement: 'Given an unsigned 32-bit integer n, swap all odd-positioned bits with adjacent even-positioned bits in O(1) operations.',
                        sampleInput: 'n = 23 (00010111_2)',
                        sampleOutput: '43 (00101011_2)',
                        constraints: 'O(1) bitwise masks',
                        hint: 'Mask even bits with 0xAAAAAAAA and shift right by 1; mask odd bits with 0x55555555 and shift left by 1; combine with |.'
                    }
                ]
            },
            {
                chapterNumber: 3,
                title: 'Functions, Stack Frames, Recursion & Storage Classes',
                duration: '15 min read',
                difficulty: 'Beginner',
                summary: 'Explore call stack activation records, pass-by-value semantics, recursion depth, and C storage classes (auto, static, extern, register).',
                overview: `Every time a function is called in C, a new Stack Frame (Activation Record) is pushed onto the call stack containing the function's arguments, local variables, saved frame pointer (RBP), and return address (RIP). When the function executes return, the stack pointer is restored in O(1) time, destroying all local variables in that frame.

C passes all arguments strictly by value: a callee receives a copy of the argument. To mutate a caller's variable, you must pass its memory address (a pointer). C also defines four storage classes: auto (default stack local), static (persists across calls in Data/BSS or restricts symbol visibility to the current file), extern (declares a global defined in another translation unit), and register.`,
                keyPoints: [
                    'A static local variable inside a function is initialized only once and retains its value across subsequent function calls.',
                    'A static global variable or function has internal linkage (private to that .c file).',
                    'Never return the address of a non-static local stack variable—the frame is destroyed upon return!',
                    'Deep unbounded recursion overflows the fixed process stack (typically 1–8 MB), causing a Segmentation Fault.'
                ],
                diagramTitle: 'Call Stack Activation Frame Push & Pop Lifecycle',
                diagramSteps: [
                    'Caller Pushes Arguments / Registers',
                    'CALL Instruction Pushes Return RIP',
                    'Callee Allocates Local Stack Frame',
                    'Execute Body / Recursive Calls',
                    'RET Pops Frame & Restores Caller'
                ],
                graphTitle: 'Storage Class Lifetime & Scope Matrix',
                graphMetricLabel: 'Persistence Duration Score',
                graphData: [
                    { label: 'auto (Default Local Stack)', value: 20, displayValue: 'Block Scope / Stack Frame', note: 'Created on entry, popped on return' },
                    { label: 'register (CPU Register Hint)', value: 20, displayValue: 'Block Scope / Fast Register', note: 'Cannot take address with &' },
                    { label: 'static Local Variable', value: 100, displayValue: 'Block Scope / Process Lifetime', note: 'Persists in Data/BSS segment' },
                    { label: 'extern Global Symbol', value: 100, displayValue: 'Cross-File / Process Lifetime', note: 'Shared across .c files' }
                ],
                syntaxSummaryCode: `#include <stdio.h>

// Static local retains state across calls
int next_ticket_id(void) {
    static int counter = 1000;
    return ++counter;
}

// Tail-recursive Euclidean GCD
long long gcd(long long a, long long b) {
    return (b == 0) ? a : gcd(b, a % b);
}`,
                syntaxTable: [
                    { construct: 'Function Prototype', syntax: 'int compute(int a, double b);', description: 'Declares function signature before use so compiler validates types.' },
                    { construct: 'Static Local', syntax: 'static int calls = 0;', description: 'Allocated in Data/BSS; preserves value between invocations.' },
                    { construct: 'Internal Linkage', syntax: 'static void helper(void) {}', description: 'Makes function private to the current .c translation unit.' },
                    { construct: 'External Symbol', syntax: 'extern int shared_config;', description: 'References a global variable defined in another .c file.' }
                ],
                examples: [
                    {
                        title: 'Static Call Counter & Recursive Tower of Hanoi Trace',
                        code: `#include <stdio.h>

void move_disks(int n, char from, char to, char aux) {
    static int step = 0;
    if (n == 0) return;
    move_disks(n - 1, from, aux, to);
    printf("Step #%d: Move disk %d from %c -> %c\\n", ++step, n, from, to);
    move_disks(n - 1, aux, to, from);
}

int main(void) {
    move_disks(2, 'A', 'C', 'B');
    return 0;
}`,
                        output: `Step #1: Move disk 1 from A -> B
Step #2: Move disk 2 from A -> C
Step #3: Move disk 1 from B -> C`,
                        explanation: 'The static variable step persists across all recursive stack frames, numbering each move sequentially.'
                    }
                ],
                problems: [
                    {
                        title: 'Recursive Binary Exponentiation in C',
                        difficulty: 'Easy',
                        statement: 'Write a recursive C function long long fastPow(long long base, int exp) that computes base^exp in O(log exp) stack frames.',
                        sampleInput: 'base = 2, exp = 10',
                        sampleOutput: '1024',
                        constraints: '0 <= exp <= 60',
                        hint: 'Compute half = fastPow(base, exp / 2); return (exp % 2 == 0) ? half * half : half * half * base;'
                    },
                    {
                        title: 'LCM & GCD of Array of Numbers',
                        difficulty: 'Easy',
                        statement: 'Given an array of N positive integers, compute the Greatest Common Divisor (GCD) and Least Common Multiple (LCM) of the entire array using Euclidean recursion.',
                        sampleInput: 'arr = [12, 18, 24]',
                        sampleOutput: 'GCD = 6, LCM = 72',
                        constraints: '1 <= N <= 1000',
                        hint: 'Use lcm(a, b) = (a / gcd(a, b)) * b (divide before multiplying to avoid overflow).'
                    }
                ]
            },
            {
                chapterNumber: 4,
                title: 'Arrays, Multi-Dimensional Matrices & Row-Major Memory',
                duration: '15 min read',
                difficulty: 'Beginner',
                summary: 'Understand contiguous array memory layout, row-major 2D matrix indexing formulas, cache locality, and array decay.',
                overview: `An array in C is a contiguous block of homogeneous elements allocated in memory with zero per-element metadata overhead. Given base address B and element size S, the address of arr[i] is calculated in a single CPU instruction as B + i * S.

Two-dimensional arrays like int mat[R][C] are stored in Row-Major Order: row 0 is laid out completely in memory, followed immediately by row 1. Consequently, iterating row-by-row (outer loop r, inner loop c) reads memory sequentially and achieves near-100% CPU L1 cache hits, whereas iterating column-by-column jumps across memory strides and triggers cache misses.`,
                keyPoints: [
                    'Address of mat[r][c] in an R x C matrix is Base + ((r * C) + c) * sizeof(Element).',
                    'When passed to a function, an array decays into a pointer to its first element (int arr[] becomes int *arr), losing sizeof length info.',
                    'Always pass the array length n explicitly alongside the array pointer: void process(const int *arr, size_t n).',
                    'Designated initializers int a[5] = {[0] = 10, [4] = 99}; zero-fill all unspecified indices automatically.'
                ],
                diagramTitle: 'Row-Major Contiguous Memory Layout of 2D Matrix',
                diagramSteps: [
                    'Base Address &arr[0][0]',
                    'Row 0: [0][0], [0][1], [0][2]',
                    'Row 1: [1][0], [1][1], [1][2]',
                    'Formula: Base + (r * Cols + c) * 4B',
                    'Sequential L1 Cache Line Prefetch'
                ],
                graphTitle: '2D Matrix Traversal: Row-Major vs Column-Major (4096 x 4096)',
                graphMetricLabel: 'Traversal Time in Milliseconds (Lower is faster)',
                graphData: [
                    { label: 'Row-Major Loop (for r, for c)', value: 14, displayValue: '11 ms', note: 'Sequential 64B cache-line hits' },
                    { label: '1D Flattened Pointer Scan', value: 12, displayValue: '9.5 ms', note: 'Single linear pointer increment' },
                    { label: 'Blocked / Tiled Matrix Loop', value: 18, displayValue: '14 ms', note: 'L1 cache-friendly sub-blocks' },
                    { label: 'Column-Major Loop (for c, for r)', value: 96, displayValue: '84 ms', note: '7.6x slower due to cache misses' }
                ],
                syntaxSummaryCode: `#include <stdio.h>

// Array length macro (ONLY valid on true array in local scope, NOT decayed pointers!)
#define ARRAY_LEN(a) (sizeof(a) / sizeof((a)[0]))

void rotate_matrix_90(int n, int mat[n][n]) {
    // 1. Transpose in-place
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            int tmp = mat[i][j];
            mat[i][j] = mat[j][i];
            mat[j][i] = tmp;
        }
    }
    // 2. Reverse each row
    for (int i = 0; i < n; i++) {
        for (int l = 0, r = n - 1; l < r; l++, r--) {
            int tmp = mat[i][l];
            mat[i][l] = mat[i][r];
            mat[i][r] = tmp;
        }
    }
}`,
                syntaxTable: [
                    { construct: 'Zero-Initialize Array', syntax: 'int arr[100] = {0};', description: 'Initializes all 100 elements to zero on the stack.' },
                    { construct: 'Array Length Macro', syntax: 'sizeof(arr) / sizeof(arr[0])', description: 'Computes element count of a stack/static array at compile time.' },
                    { construct: '2D Parameter', syntax: 'void fn(int rows, int cols, int m[rows][cols])', description: 'C99 VLA parameter syntax preserving row stride.' },
                    { construct: 'Fast Memory Set', syntax: 'memset(arr, 0, sizeof(arr));', description: 'Fills contiguous bytes with 0 or -1 via <string.h>.' }
                ],
                examples: [
                    {
                        title: 'Kadane Maximum Subarray & Prefix Sum Range Query',
                        code: `#include <stdio.h>

int max_subarray_sum(const int *arr, int n) {
    int best = arr[0], current = arr[0];
    for (int i = 1; i < n; i++) {
        current = (arr[i] > current + arr[i]) ? arr[i] : (current + arr[i]);
        if (current > best) best = current;
    }
    return best;
}

int main(void) {
    int nums[] = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
    int n = (int)(sizeof(nums) / sizeof(nums[0]));
    printf("Max Subarray Sum: %d\\n", max_subarray_sum(nums, n));
    return 0;
}`,
                        output: `Max Subarray Sum: 6`,
                        explanation: 'Kadane algorithm scans the contiguous array once in O(N) time and O(1) space.'
                    }
                ],
                problems: [
                    {
                        title: 'Spiral Order Traversal of an M x N Matrix',
                        difficulty: 'Medium',
                        statement: 'Given an M x N 2D integer matrix, print all elements of the matrix in clockwise spiral order.',
                        sampleInput: 'mat = [[1,2,3],[4,5,6],[7,8,9]]',
                        sampleOutput: '1 2 3 6 9 8 7 4 5',
                        constraints: '1 <= M, N <= 100',
                        hint: 'Maintain four boundary pointers top=0, bottom=M-1, left=0, right=N-1 and shrink each boundary after traversing its edge.'
                    },
                    {
                        title: 'Find Equilibrium Index of an Array',
                        difficulty: 'Easy',
                        statement: 'Find the leftmost index i in an array of N integers such that the sum of elements to the left of i equals the sum of elements to the right of i.',
                        sampleInput: 'arr = [-7, 1, 5, 2, -4, 3, 0]',
                        sampleOutput: '3',
                        constraints: '1 <= N <= 10^5',
                        hint: 'Compute total_sum first, then maintain left_sum = 0 in a single pass where right_sum = total_sum - left_sum - arr[i].'
                    }
                ]
            },
            {
                chapterNumber: 5,
                title: 'Pointers, Pointer Arithmetic & Function Pointers',
                duration: '18 min read',
                difficulty: 'Intermediate',
                summary: 'Demystify memory addresses, dereferencing, pointer scaling arithmetic, const pointer qualifiers, and callback function pointers.',
                overview: `A pointer is a variable that stores a virtual memory address. On a 64-bit architecture, every pointer (int*, char*, void*, struct Node**) occupies exactly 8 bytes, regardless of the size of the pointee type. The pointee type tells the compiler how many bytes to read/write when dereferencing (*ptr) and how many bytes to scale during pointer arithmetic (ptr + 1 advances the address by sizeof(*ptr) bytes).

C also allows pointers to executable code—Function Pointers—which enable callbacks, custom comparators in qsort(), and polymorphic dispatch tables in systems software.`,
                keyPoints: [
                    '*(arr + i) is 100% identical to arr[i] in the C standard.',
                    'Adding 1 to an int* advances the raw address by 4 bytes; adding 1 to a double* advances it by 8 bytes.',
                    'const int *p means the pointed-to integer is read-only; int *const p means the pointer address itself cannot be reassigned.',
                    'Always initialize unused pointers to NULL and check if (ptr != NULL) before dereferencing.'
                ],
                diagramTitle: 'Pointer Dereferencing & Scaled Arithmetic Pipeline',
                diagramSteps: [
                    'int x = 42 at 0x1000',
                    'int *p = &x (holds 0x1000)',
                    '*p -> Reads 4 Bytes at 0x1000',
                    'p + 1 -> Scales by sizeof(int) to 0x1004',
                    'int **pp = &p (Double Pointer)'
                ],
                graphTitle: 'Pointer Arithmetic Stride Step by Pointee Type',
                graphMetricLabel: 'Address Increment in Bytes for (ptr + 1)',
                graphData: [
                    { label: 'char *ptr + 1', value: 12, displayValue: '+1 Byte', note: 'Byte-level buffer stepping' },
                    { label: 'short *ptr + 1', value: 25, displayValue: '+2 Bytes', note: '16-bit audio/UTF-16 stride' },
                    { label: 'int *ptr + 1', value: 50, displayValue: '+4 Bytes', note: '32-bit integer array stride' },
                    { label: 'double *ptr + 1', value: 100, displayValue: '+8 Bytes', note: '64-bit floating-point stride' }
                ],
                syntaxSummaryCode: `#include <stdio.h>
#include <stdlib.h>

// Pass-by-pointer swap
void swap_ints(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

// Comparator callback for stdlib qsort()
int cmp_asc(const void *a, const void *b) {
    int x = *(const int *)a;
    int y = *(const int *)b;
    return (x > y) - (x < y); // Overflow-safe comparison!
}

// Function pointer typedef
typedef int (*MathOp)(int, int);`,
                syntaxTable: [
                    { construct: 'Address-Of / Deref', syntax: 'p = &x; val = *p;', description: 'Takes memory address of x; reads/writes value at address p.' },
                    { construct: 'Pointer to Const', syntax: 'const int *p;', description: 'Data cannot be modified through p, but p can point elsewhere.' },
                    { construct: 'Const Pointer', syntax: 'int *const p = &x;', description: 'Pointer address is locked to &x, but *p can be modified.' },
                    { construct: 'Function Pointer', syntax: 'int (*fn)(int, int) = &add;', description: 'Stores address of executable function for dynamic callbacks.' }
                ],
                examples: [
                    {
                        title: 'In-Place Array Reversal with Two Pointers & qsort Callback',
                        code: `#include <stdio.h>
#include <stdlib.h>

int cmp_desc(const void *a, const void *b) {
    int va = *(const int *)a, vb = *(const int *)b;
    return (vb > va) - (vb < va);
}

int main(void) {
    int arr[] = {15, 3, 42, 8, 27};
    size_t n = sizeof(arr) / sizeof(arr[0]);

    qsort(arr, n, sizeof(int), cmp_desc);

    for (const int *p = arr; p < arr + n; p++) {
        printf("%d ", *p);
    }
    printf("\\n");
    return 0;
}`,
                        output: `42 27 15 8 3`,
                        explanation: 'qsort uses a function pointer comparator to sort any data type in-place, and pointer iteration scans from arr to arr + n.'
                    }
                ],
                problems: [
                    {
                        title: 'Reverse an Array Using Only Pointer Arithmetic',
                        difficulty: 'Easy',
                        statement: 'Write a function void reverseArray(int *arr, int n) that reverses an integer array in-place using two pointers left and right without using bracket indexing [].',
                        sampleInput: 'arr = [10, 20, 30, 40, 50]',
                        sampleOutput: '[50, 40, 30, 20, 10]',
                        constraints: '1 <= n <= 10^5',
                        hint: 'Initialize int *left = arr; int *right = arr + n - 1; and swap *left++ with *right-- while left < right.'
                    },
                    {
                        title: 'Three-Way Partition / Sort 0s, 1s, and 2s via Pointers',
                        difficulty: 'Medium',
                        statement: 'Given an array containing only 0, 1, and 2, sort the array in-place in a single pass using low, mid, and high pointers.',
                        sampleInput: 'arr = [2, 0, 2, 1, 1, 0]',
                        sampleOutput: '[0, 0, 1, 1, 2, 2]',
                        constraints: 'Single pass O(N) time, O(1) space',
                        hint: 'Swap *low and *mid when *mid == 0 (advance both); advance mid when *mid == 1; swap *mid and *high when *mid == 2 (decrement high).'
                    }
                ]
            },
            {
                chapterNumber: 6,
                title: 'C-Strings, Null Terminators & Buffer-Safe Memory Functions',
                duration: '15 min read',
                difficulty: 'Intermediate',
                summary: 'Master null-terminated char arrays, string literals vs stack buffers, <string.h> routines, and preventing buffer overflows.',
                overview: `C does not have a built-in string primitive. Instead, a C-string is a contiguous char array terminated by the null byte '\\0' (ASCII 0). Therefore, storing a 10-character word requires at least 11 bytes of allocated memory.

There is a critical memory distinction between char s[] = "hello"; and const char *p = "hello";: the array declaration copies 6 bytes onto the mutable stack frame, whereas the pointer declaration points directly to the read-only String Literal Pool in the .rodata segment (attempting p[0] = 'H' causes an immediate Segmentation Fault!).`,
                keyPoints: [
                    'strlen(s) scans until it hits \\0 in O(N) time—never call strlen(s) inside a for-loop condition (for (int i=0; i<strlen(s); i++) is O(N^2)!).',
                    'Never use unsafe gets() or unbounded strcpy(); use fgets(buf, sizeof(buf), stdin) and snprintf(buf, sizeof(buf), ...).',
                    'strcmp(a, b) returns 0 when strings are equal, < 0 if a < b lexicographically, and > 0 if a > b.',
                    'memcpy() is fast for non-overlapping buffers; memmove() safely handles overlapping source and destination regions.'
                ],
                diagramTitle: 'Stack Char Buffer vs Read-Only .rodata String Literal',
                diagramSteps: [
                    'char buf[6] = "ETH"; -> Mutable Stack [E][T][H][\\0][0][0]',
                    'const char *lit = "ETH"; -> Read-Only .rodata Segment',
                    'snprintf(buf, sizeof(buf), ...) -> Bounds-Checked Write',
                    'Terminating Null Byte \'\\0\' (0x00) Guard'
                ],
                graphTitle: 'Loop Condition Trap: Cached len vs Repeated strlen(s) (N = 25,000)',
                graphMetricLabel: 'Character Comparisons Performed',
                graphData: [
                    { label: 'size_t n = strlen(s); for(i < n)', value: 4, displayValue: '25,000 ops (O(N))', note: 'Single linear scan' },
                    { label: 'Pointer Scan for(p=s; *p; p++)', value: 3, displayValue: '25,000 ops (O(N))', note: 'Zero pre-scan needed!' },
                    { label: 'memchr / strchr C library', value: 2, displayValue: 'SIMD Vectorized O(N)', note: '16-byte register checks' },
                    { label: 'for(i = 0; i < strlen(s); i++)', value: 100, displayValue: '312,500,000 ops (O(N²))', note: '12,500x slower bug!' }
                ],
                syntaxSummaryCode: `#include <stdio.h>
#include <string.h>

int main(void) {
    char dest[32];
    const char *course = "Code2Career";
    int year = 2026;

    // Bounds-safe formatted string builder
    snprintf(dest, sizeof(dest), "%s-%d", course, year);

    // Safe token scanning without strlen() in loop
    for (const char *p = dest; *p != '\\0'; p++) {
        putchar(*p);
    }
    putchar('\\n');
    return 0;
}`,
                syntaxTable: [
                    { construct: 'Safe Format Write', syntax: 'snprintf(buf, sizeof(buf), fmt, ...)', description: 'Writes at most sizeof(buf)-1 chars and always appends \\0.' },
                    { construct: 'Safe Line Input', syntax: 'fgets(buf, sizeof(buf), stdin)', description: 'Reads a line safely without overflowing buf.' },
                    { construct: 'Lexicographic Compare', syntax: 'strcmp(s1, s2) / strncmp(s1, s2, n)', description: 'Returns 0 if strings are identical.' },
                    { construct: 'Overlap-Safe Copy', syntax: 'memmove(dst, src, byte_count)', description: 'Copies raw bytes safely even when dst and src overlap.' }
                ],
                examples: [
                    {
                        title: 'In-Place Word Reversal in a C-String Buffer',
                        code: `#include <stdio.h>
#include <string.h>

void rev_range(char *l, char *r) {
    while (l < r) {
        char tmp = *l;
        *l++ = *r;
        *r-- = tmp;
    }
}

int main(void) {
    char sentence[] = "C pointers are fast";
    size_t n = strlen(sentence);
    rev_range(sentence, sentence + n - 1);

    char *start = sentence;
    for (char *p = sentence; ; p++) {
        if (*p == ' ' || *p == '\\0') {
            rev_range(start, p - 1);
            if (*p == '\\0') break;
            start = p + 1;
        }
    }
    printf("Reversed words: %s\\n", sentence);
    return 0;
}`,
                        output: `Reversed words: fast are pointers C`,
                        explanation: 'Reversing the entire char array and then reversing each space-delimited word achieves in-place O(N) reversal with 0 extra bytes.'
                    }
                ],
                problems: [
                    {
                        title: 'Implement Custom strstr() (First Substring Occurrence)',
                        difficulty: 'Easy',
                        statement: 'Write a function int strStr(const char *haystack, const char *needle) that returns the index of the first occurrence of needle in haystack, or -1 if needle is not part of haystack.',
                        sampleInput: 'haystack = "ethnotechacademy", needle = "tech"',
                        sampleOutput: '5',
                        constraints: '1 <= strlen(haystack), strlen(needle) <= 10^4',
                        hint: 'Advance a pointer over haystack and match characters against needle (or use KMP prefix table for strict O(N+M)).'
                    },
                    {
                        title: 'Check if Two C-Strings Are Valid Anagrams in O(N)',
                        difficulty: 'Easy',
                        statement: 'Given two null-terminated lowercase strings s and t, return 1 if t is an anagram of s, and 0 otherwise, using O(1) space.',
                        sampleInput: 's = "listen", t = "silent"',
                        sampleOutput: '1 (True)',
                        constraints: 'Only lowercase ASCII a-z',
                        hint: 'Maintain a single int freq[26] = {0}; increment freq[s[i]-"a"] and decrement freq[t[i]-"a"], then verify all 26 entries are 0.'
                    }
                ]
            },
            {
                chapterNumber: 7,
                title: 'Dynamic Memory Allocation: Heap, malloc, realloc & Leak Prevention',
                duration: '16 min read',
                difficulty: 'Intermediate',
                summary: 'Manage runtime heap allocations with malloc, calloc, realloc, and free while eliminating memory leaks and dangling pointers.',
                overview: `Stack memory is fast and automatic, but its size is fixed at compile time and local frames vanish when a function returns. When data must outlive the creating function or scale dynamically at runtime, C provides four heap allocator functions in <stdlib.h>: malloc (uninitialized bytes), calloc (zero-initialized array allocation with overflow check), realloc (resizes an existing block), and free (returns memory to the heap).

Because C has no garbage collector, every heap block allocated must be paired with exactly one free(ptr). Failing to free causes a Memory Leak; accessing memory after free(ptr) causes a Use-After-Free security vulnerability; freeing the same pointer twice causes a Double-Free heap corruption.`,
                keyPoints: [
                    'Always use sizeof(*ptr) inside malloc: int *arr = malloc(n * sizeof(*arr)); so type changes never break byte calculations.',
                    'Never assign ptr = realloc(ptr, new_size) directly—if realloc fails and returns NULL, you lose the original pointer and leak memory!',
                    'After calling free(ptr), immediately set ptr = NULL; to prevent dangling pointer dereferences.',
                    'calloc(n, sizeof(*ptr)) both zeros memory and checks for n * size integer multiplication overflow.'
                ],
                diagramTitle: 'Safe Heap Allocation, Reallocation & Deallocation Lifecycle',
                diagramSteps: [
                    'p = calloc(n, sizeof(*p))',
                    'Check if (p == NULL) -> Handle OOM',
                    'Resize: tmp = realloc(p, new_bytes)',
                    'if (tmp) p = tmp;',
                    'free(p); p = NULL;'
                ],
                graphTitle: 'Stack vs Heap Allocation Latency & Characteristics',
                graphMetricLabel: 'Allocation Cost in CPU Cycles',
                graphData: [
                    { label: 'Stack Frame Allocation (sub rsp)', value: 4, displayValue: '1 cycle', note: 'Instant stack pointer decrement' },
                    { label: 'Static / BSS Allocation', value: 2, displayValue: '0 runtime cycles', note: 'Pre-mapped by OS loader' },
                    { label: 'malloc() Thread-Cache Hit', value: 42, displayValue: '~35 cycles', note: 'ptmalloc / tcache bin pop' },
                    { label: 'calloc() / OS brk/mmap Fault', value: 95, displayValue: '~120+ cycles', note: 'Allocation + zero page fill' }
                ],
                syntaxSummaryCode: `#include <stdio.h>
#include <stdlib.h>

int *create_resized_buffer(size_t initial_n, size_t expanded_n) {
    // 1. Allocate zeroed array
    int *buf = calloc(initial_n, sizeof(*buf));
    if (!buf) return NULL;

    // 2. Safe realloc pattern using temporary pointer
    int *tmp = realloc(buf, expanded_n * sizeof(*buf));
    if (!tmp) {
        free(buf);  // Original block still valid here; clean up!
        return NULL;
    }
    buf = tmp;
    return buf;     // Caller takes ownership and must call free()
}`,
                syntaxTable: [
                    { construct: 'Raw Heap Alloc', syntax: 'ptr = malloc(n * sizeof(*ptr));', description: 'Allocates n uninitialized elements on the heap.' },
                    { construct: 'Zeroed Heap Alloc', syntax: 'ptr = calloc(n, sizeof(*ptr));', description: 'Allocates and zero-initializes n elements safely.' },
                    { construct: 'Resize Block', syntax: 'tmp = realloc(ptr, new_n * sizeof(*ptr));', description: 'Expands or shrinks existing block, copying contents if moved.' },
                    { construct: 'Release & Nullify', syntax: 'free(ptr); ptr = NULL;', description: 'Returns block to heap and clears dangling pointer.' }
                ],
                examples: [
                    {
                        title: 'Dynamic Vector (Auto-Growing Array) in Pure C',
                        code: `#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int *data;
    size_t size;
    size_t capacity;
} IntVec;

void vec_push(IntVec *v, int val) {
    if (v->size == v->capacity) {
        size_t next_cap = (v->capacity == 0) ? 4 : v->capacity * 2;
        int *tmp = realloc(v->data, next_cap * sizeof(*v->data));
        if (!tmp) return;
        v->data = tmp;
        v->capacity = next_cap;
    }
    v->data[v->size++] = val;
}

int main(void) {
    IntVec v = {NULL, 0, 0};
    for (int i = 1; i <= 5; i++) vec_push(&v, i * 10);
    printf("Size: %zu | Capacity: %zu | Last: %d\\n", v.size, v.capacity, v.data[v.size - 1]);
    free(v.data);
    return 0;
}`,
                        output: `Size: 5 | Capacity: 8 | Last: 50`,
                        explanation: 'Doubling capacity geometrically via realloc gives O(1) amortized push while keeping elements contiguous.'
                    }
                ],
                problems: [
                    {
                        title: 'Allocate and Free a Dynamic 2D Matrix (R x C)',
                        difficulty: 'Medium',
                        statement: 'Write functions int **allocMatrix(int R, int C) and void freeMatrix(int **mat, int R) that dynamically allocate an R x C matrix on the heap, fill mat[r][c] = r + c, and release all memory with zero leaks.',
                        sampleInput: 'R = 2, C = 3',
                        sampleOutput: 'Row 0: 0 1 2 | Row 1: 1 2 3 (0 bytes leaked)',
                        constraints: '1 <= R, C <= 1000',
                        hint: 'Allocate an array of R row pointers int **mat = malloc(R * sizeof(*mat)), then allocate each row mat[r] = calloc(C, sizeof(**mat)), and free in reverse order.'
                    },
                    {
                        title: 'Dynamic String Concatenation (strdup_join)',
                        difficulty: 'Easy',
                        statement: 'Write a function char *joinStrings(const char *a, const char *b, char sep) that allocates a new heap string of exact required length and formats "a<sep>b".',
                        sampleInput: 'a = "Ethnotech", b = "2026", sep = \'-\'',
                        sampleOutput: '"Ethnotech-2026"',
                        constraints: 'Caller must free() returned buffer',
                        hint: 'Allocate strlen(a) + strlen(b) + 2 bytes (1 for sep, 1 for null terminator).'
                    }
                ]
            },
            {
                chapterNumber: 8,
                title: 'Structs, Unions, Bit-Fields & CPU Memory Alignment Padding',
                duration: '16 min read',
                difficulty: 'Intermediate',
                summary: 'Design composite data types with struct, understand CPU word alignment and member padding, and use union and enum.',
                overview: `A struct aggregates heterogeneous fields under a single contiguous memory block, whereas a union overlays all its members at the exact same memory offset (so sizeof(union) equals the size of its largest member).

Modern CPUs read memory most efficiently when an N-byte primitive is stored at a memory address divisible by N (natural alignment). Consequently, the C compiler automatically inserts invisible padding bytes between struct members. Ordering struct fields from largest to smallest (e.g., double and pointers first, int second, char and bool last) minimizes wasted padding bytes!`,
                keyPoints: [
                    'Use the arrow operator ptr->field as shorthand for (*ptr).field when accessing a struct via pointer.',
                    'Reordering struct fields by descending size can reduce struct memory footprint by 25%–35% without changing behavior.',
                    'A union shares the same memory bytes across all fields—ideal for tagged variants and hardware protocol packets.',
                    'Bit-fields (unsigned int flag : 1;) pack sub-byte integer fields into a single machine word.'
                ],
                diagramTitle: 'Struct Memory Alignment & Field Ordering Optimization',
                diagramSteps: [
                    'Unordered: {char a; [3B pad]; int b; char c; [3B pad]} = 12 Bytes',
                    'Sorted by Size: {int b; char a; char c; [2B pad]} = 8 Bytes',
                    'offsetof(struct S, field) Inspects Exact Byte Offset',
                    'Union Overlays All Members at Offset 0'
                ],
                graphTitle: 'Struct Size Comparison for 1 Million Records (Bytes)',
                graphMetricLabel: 'Total Memory Consumed (MB)',
                graphData: [
                    { label: 'Poorly Ordered Struct (char, double, int, char)', value: 100, displayValue: '24 Bytes (24 MB)', note: '10 bytes lost to alignment padding' },
                    { label: 'Size-Sorted Struct (double, int, char, char)', value: 66, displayValue: '16 Bytes (16 MB)', note: 'Saves 33% RAM with zero speed loss' },
                    { label: 'Bit-Field Packed Header Struct', value: 33, displayValue: '8 Bytes (8 MB)', note: 'Sub-byte bit-width packing' },
                    { label: 'Shared Union Variant (8B max field)', value: 33, displayValue: '8 Bytes (8 MB)', note: 'Single shared 8-byte slot' }
                ],
                syntaxSummaryCode: `#include <stdio.h>
#include <stddef.h>

// Poor ordering: 12 bytes due to padding
struct Unoptimized {
    char a;         // 1B + 3B padding
    int b;          // 4B
    char c;         // 1B + 3B padding
};

// Optimal descending-size ordering: 8 bytes!
typedef struct {
    int b;          // 4B (offset 0)
    char a;         // 1B (offset 4)
    char c;         // 1B (offset 5) + 2B trailing pad
} Optimized;`,
                syntaxTable: [
                    { construct: 'Typedef Struct', syntax: 'typedef struct { ... } Student;', description: 'Defines a clean type alias without repeating struct keyword.' },
                    { construct: 'Designated Init', syntax: 'Student s = {.usn = "101", .cgpa = 9.1};', description: 'Initializes named fields explicitly in any order.' },
                    { construct: 'Pointer Member Access', syntax: 'ptr->cgpa', description: 'Dereferences struct pointer and accesses member (*(ptr)).cgpa.' },
                    { construct: 'Byte Offset Macro', syntax: 'offsetof(Student, cgpa)', description: 'Compile-time byte offset of a field inside a struct (<stddef.h>).' }
                ],
                examples: [
                    {
                        title: 'Verifying Struct Alignment Padding & Tagged Union',
                        code: `#include <stdio.h>
#include <stddef.h>

struct BadLayout  { char c1; double d; char c2; };
struct GoodLayout { double d; char c1; char c2; };

int main(void) {
    printf("sizeof(BadLayout)  = %zu bytes (d offset=%zu)\\n",
           sizeof(struct BadLayout), offsetof(struct BadLayout, d));
    printf("sizeof(GoodLayout) = %zu bytes (d offset=%zu)\\n",
           sizeof(struct GoodLayout), offsetof(struct GoodLayout, d));
    return 0;
}`,
                        output: `sizeof(BadLayout)  = 24 bytes (d offset=8)
sizeof(GoodLayout) = 16 bytes (d offset=0)`,
                        explanation: 'Placing the 8-byte double first eliminates 8 bytes of internal padding per struct instance.'
                    }
                ],
                problems: [
                    {
                        title: 'Sort Student Struct Records by CGPA & USN',
                        difficulty: 'Easy',
                        statement: 'Define a Student struct with fields usn[16], name[32], and float cgpa. Sort an array of N students in descending order of CGPA (breaking ties alphabetically by USN) using qsort.',
                        sampleInput: '3 students: (CS02, 8.5), (CS01, 9.2), (CS03, 8.5)',
                        sampleOutput: 'CS01 (9.20), CS02 (8.50), CS03 (8.50)',
                        constraints: '1 <= N <= 10^4',
                        hint: 'In the comparator, compare s2->cgpa and s1->cgpa first; if equal within 1e-6, return strcmp(s1->usn, s2->usn).'
                    },
                    {
                        title: 'Inspect Endianness Using a Union',
                        difficulty: 'Easy',
                        statement: 'Write a C function using a union of uint32_t val and uint8_t bytes[4] initialized to 0x01020304 to determine whether the host CPU is Little-Endian or Big-Endian.',
                        sampleInput: '0x01020304',
                        sampleOutput: 'First byte = 0x04 -> Little-Endian',
                        constraints: 'Portable C99',
                        hint: 'Assign u.val = 0x01020304; if u.bytes[0] == 0x04, the least-significant byte is at the lowest address (Little-Endian).'
                    }
                ]
            },
            {
                chapterNumber: 9,
                title: 'File I/O Streams, Binary Serialization & Preprocessor Macros',
                duration: '14 min read',
                difficulty: 'Intermediate',
                summary: 'Read and write text and binary files using FILE* streams, random-access fseek/ftell, and write safe parenthesized preprocessor macros.',
                overview: `C abstracts file and console operations through buffered FILE* streams in <stdio.h>. Standard streams stdin, stdout, and stderr are opened automatically at process startup. Files can be opened in text mode ("r", "w", "a") or raw binary mode ("rb", "wb", "r+b") using fopen(). Binary I/O with fread() and fwrite() copies raw struct bytes directly between RAM and disk without text formatting overhead.

The C Preprocessor (#define, #ifdef, #ifndef, #pragma once) performs textual substitution before compilation. When writing function-like macros, every parameter and the entire macro body must be wrapped in parentheses—e.g., #define SQR(x) ((x) * (x))—to prevent operator precedence bugs like SQR(2 + 3) expanding to 2 + 3 * 2 + 3 = 11!`,
                keyPoints: [
                    'Always check if (fp == NULL) after fopen() and call fclose(fp) when finished to flush buffered output.',
                    'Wrap macro arguments and full expressions in parentheses: #define MAX(a, b) (((a) > (b)) ? (a) : (b)).',
                    'Never pass expressions with side effects like MAX(i++, j++) to a macro, as the argument is evaluated twice.',
                    'Use header include guards (#ifndef HEADER_H / #define HEADER_H / #endif) in every .h file.'
                ],
                diagramTitle: 'Buffered FILE* Stream & Binary Disk Serialization',
                diagramSteps: [
                    'FILE *fp = fopen("data.bin", "wb")',
                    'fwrite(records, sizeof(Rec), n, fp)',
                    'fseek(fp, offset, SEEK_SET) Random Seek',
                    'fread(&rec, sizeof(Rec), 1, fp)',
                    'fclose(fp) Flushes Kernel Buffer'
                ],
                graphTitle: 'Disk I/O Throughput: Binary fwrite vs Formatted fprintf (1M ints)',
                graphMetricLabel: 'Time to Write 1,000,000 Integers (ms)',
                graphData: [
                    { label: 'Batched Binary fwrite() block', value: 8, displayValue: '12 ms', note: 'Single 4MB DMA buffer write' },
                    { label: 'Per-record Binary fwrite()', value: 26, displayValue: '38 ms', note: 'Buffered libc stream copy' },
                    { label: 'Formatted fprintf(fp, "%d\\n")', value: 95, displayValue: '240 ms', note: 'ASCII conversion overhead' }
                ],
                syntaxSummaryCode: `#ifndef UTILS_H
#define UTILS_H

#include <stdio.h>

// Fully parenthesized macro
#define CLAMP(val, lo, hi) (((val) < (lo)) ? (lo) : (((val) > (hi)) ? (hi) : (val)))

// Determining file size in bytes
long get_file_size(const char *path) {
    FILE *fp = fopen(path, "rb");
    if (!fp) return -1;
    fseek(fp, 0, SEEK_END);
    long bytes = ftell(fp);
    fclose(fp);
    return bytes;
}

#endif`,
                syntaxTable: [
                    { construct: 'Open / Close Stream', syntax: 'FILE *fp = fopen(path, "rb"); fclose(fp);', description: 'Opens buffered file stream and flushes/closes descriptor.' },
                    { construct: 'Binary Read / Write', syntax: 'fread(ptr, size, count, fp) / fwrite(...)', description: 'Reads or writes count items of size bytes directly.' },
                    { construct: 'Random Seek', syntax: 'fseek(fp, offset, SEEK_SET); ftell(fp);', description: 'Moves file position indicator and queries current byte offset.' },
                    { construct: 'Include Guard', syntax: '#ifndef FOO_H / #define FOO_H ... #endif', description: 'Prevents duplicate header inclusion in a translation unit.' }
                ],
                examples: [
                    {
                        title: 'Safe Macro Expansion vs Precedence Bug Demonstration',
                        code: `#include <stdio.h>

#define BAD_SQUARE(x)  x * x
#define SAFE_SQUARE(x) ((x) * (x))

int main(void) {
    int a = 3;
    printf("BAD_SQUARE(a + 2)  = %d  (expands to 3 + 2 * 3 + 2)\\n", BAD_SQUARE(a + 2));
    printf("SAFE_SQUARE(a + 2) = %d (expands to ((3 + 2) * (3 + 2)))\\n", SAFE_SQUARE(a + 2));
    return 0;
}`,
                        output: `BAD_SQUARE(a + 2)  = 11  (expands to 3 + 2 * 3 + 2)
SAFE_SQUARE(a + 2) = 25 (expands to ((3 + 2) * (3 + 2)))`,
                        explanation: 'Without outer and inner parentheses, multiplication binds tighter than addition during textual macro replacement.'
                    }
                ],
                problems: [
                    {
                        title: 'Write a Multi-Statement Swap Macro Using do-while(0)',
                        difficulty: 'Medium',
                        statement: 'Write a type-generic macro SWAP(type, a, b) in C that safely swaps two variables of any given type inside an unbraced if-else statement without causing a syntax error.',
                        sampleInput: 'if (x > y) SWAP(int, x, y); else ...',
                        sampleOutput: 'x and y swapped safely',
                        constraints: 'Must compile cleanly inside unbraced if (...) SWAP(...); else ...',
                        hint: 'Wrap the block in do { type _tmp = (a); (a) = (b); (b) = _tmp; } while (0) without a trailing semicolon.'
                    },
                    {
                        title: 'Count Lines, Words, and Bytes in a Stream (wc Utility)',
                        difficulty: 'Easy',
                        statement: 'Given a character buffer representing a file stream, count the exact number of bytes, newline characters, and whitespace-separated words in a single pass.',
                        sampleInput: '"Hello world\\nEthnotech C Lab\\n"',
                        sampleOutput: 'Lines: 2 | Words: 5 | Bytes: 28',
                        constraints: 'Single pass O(N), O(1) memory',
                        hint: 'Track an in_word state flag: transition from whitespace to non-whitespace increments word_count.'
                    }
                ]
            },
            {
                chapterNumber: 10,
                title: 'Linked Lists, Stacks, Queues & Binary Trees in C',
                duration: '18 min read',
                difficulty: 'Advanced',
                summary: 'Build self-referential pointer data structures in C: singly/doubly linked lists, cycle detection, stacks, and binary search trees.',
                overview: `In C, dynamic data structures are built using self-referential structs—a struct that contains a pointer to its own type (struct Node *next;). Unlike arrays, linked list nodes are allocated individually on the heap and wired together via pointers, allowing O(1) insertion and deletion at known node pointers without shifting contiguous memory.

Mastering pointer manipulation on linked lists and binary trees—such as three-pointer in-place reversal (prev, curr, next), Floyd's Tortoise and Hare cycle detection (slow and fast pointers), and recursive post-order tree deallocation—is a cornerstone of technical interviews.`,
                keyPoints: [
                    'Always save Node *next = curr->next; before modifying curr->next or calling free(curr)!',
                    'Using a stack-allocated dummy head node (Node dummy = {0, head};) eliminates special-case edge checks for empty lists or head deletions.',
                    'Floyd Cycle Detection advances slow by 1 step and fast by 2 steps; if they meet, a cycle exists in O(N) time and O(1) space.',
                    'When freeing a linked list or binary tree, free child/next nodes before freeing the parent node.'
                ],
                diagramTitle: 'In-Place 3-Pointer Linked List Reversal Architecture',
                diagramSteps: [
                    'Init: prev = NULL, curr = head',
                    'Save: next = curr->next',
                    'Reverse Link: curr->next = prev',
                    'Advance: prev = curr; curr = next',
                    'Done (curr == NULL) -> New Head is prev'
                ],
                graphTitle: 'Data Structure Operation Complexity Comparison (N Nodes)',
                graphMetricLabel: 'Relative Time Cost',
                graphData: [
                    { label: 'Linked List Insert/Delete at Head', value: 6, displayValue: 'O(1)', note: '2 pointer assignments' },
                    { label: 'Balanced BST Search / Insert', value: 28, displayValue: 'O(log N)', note: 'Tree height comparisons' },
                    { label: 'Floyd Fast/Slow Middle or Cycle', value: 55, displayValue: 'O(N) Time, O(1) Space', note: 'Single pointer traversal' },
                    { label: 'Linked List Random Index Access', value: 90, displayValue: 'O(N)', note: 'Must follow next pointers sequentially' }
                ],
                syntaxSummaryCode: `#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int val;
    struct Node *next;
} Node;

// O(N) Time, O(1) Space In-Place Reversal
Node *reverse_list(Node *head) {
    Node *prev = NULL, *curr = head;
    while (curr != NULL) {
        Node *next_temp = curr->next;
        curr->next = prev;
        prev = curr;
        curr = next_temp;
    }
    return prev;
}

// Floyd's Tortoise & Hare Middle Node Finder
Node *find_middle(Node *head) {
    Node *slow = head, *fast = head;
    while (fast != NULL && fast->next != NULL) {
        slow = slow->next;
        fast = fast->next->next;
    }
    return slow;
}`,
                syntaxTable: [
                    { construct: 'Self-Referential Struct', syntax: 'typedef struct Node { int v; struct Node *next; } Node;', description: 'Defines linked node holding payload and next-node pointer.' },
                    { construct: 'Dummy Head Trick', syntax: 'Node dummy = {0, head}; Node *tail = &dummy;', description: 'Simplifies list construction and head-removal edge cases.' },
                    { construct: 'Fast/Slow Pointers', syntax: 'slow = slow->next; fast = fast->next->next;', description: 'Finds list midpoint or detects cycles in O(1) extra space.' },
                    { construct: 'Safe List Teardown', syntax: 'while (head) { Node *t = head; head = head->next; free(t); }', description: 'Frees every node without dereferencing freed memory.' }
                ],
                examples: [
                    {
                        title: 'Building, Reversing & Freeing a Singly Linked List in C',
                        code: `#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int val;
    struct Node *next;
} Node;

Node *push_front(Node *head, int val) {
    Node *n = malloc(sizeof(*n));
    n->val = val;
    n->next = head;
    return n;
}

int main(void) {
    Node *head = NULL;
    for (int i = 3; i >= 1; i--) head = push_front(head, i * 10);

    // Reverse in-place
    Node *prev = NULL, *curr = head;
    while (curr) {
        Node *nxt = curr->next;
        curr->next = prev;
        prev = curr;
        curr = nxt;
    }
    head = prev;

    for (Node *p = head; p; p = p->next) printf("%d -> ", p->val);
    printf("NULL\\n");

    while (head) { Node *t = head; head = head->next; free(t); }
    return 0;
}`,
                        output: `30 -> 20 -> 10 -> NULL`,
                        explanation: 'Each node is allocated on the heap, reversed in-place by flipping curr->next pointers, and cleanly freed before exit.'
                    }
                ],
                problems: [
                    {
                        title: 'Detect Cycle in a Singly Linked List (Floyd Cycle)',
                        difficulty: 'Easy',
                        statement: 'Given the head pointer of a singly linked list in C, return 1 if the linked list contains a cycle, or 0 otherwise, using O(1) extra memory.',
                        sampleInput: '10 -> 20 -> 30 -> 40 -> (points back to 20)',
                        sampleOutput: '1 (Cycle Detected)',
                        constraints: '0 <= Nodes <= 10^4, O(1) space',
                        hint: 'Advance slow = slow->next and fast = fast->next->next while (fast && fast->next). If slow == fast, return 1.'
                    },
                    {
                        title: 'Merge Two Sorted Linked Lists In-Place',
                        difficulty: 'Medium',
                        statement: 'Given the heads of two sorted linked lists l1 and l2, merge them into a single sorted linked list by splicing together the existing nodes without calling malloc.',
                        sampleInput: 'l1 = 1->3->5, l2 = 2->4->6',
                        sampleOutput: '1->2->3->4->5->6',
                        constraints: 'O(N + M) time, O(1) auxiliary space',
                        hint: 'Create a stack-allocated Node dummy = {0, NULL}; Node *tail = &dummy; and attach the smaller of l1 and l2 at each step.'
                    }
                ]
            }
        ]
    },

    /* =========================================================================
       3. JAVA (10 CHAPTERS)
       ========================================================================= */
    {
        slug: 'java',
        name: 'Java',
        fullName: 'Java SE & Enterprise Object-Oriented Engineering',
        badge: 'JV',
        tagline: 'Write once, run anywhere: strongly typed, JIT-compiled enterprise language powering scalable backend systems.',
        description:
            'Master Java from JVM architecture, bytecode JIT compilation, and garbage collection to Object-Oriented design, Generics, the Collections Framework, Streams, Lambdas, and Concurrency.',
        accentColor: '#D97706',
        secondaryColor: '#FEF3C7',
        fileExtension: '.java',
        paradigm: 'Object-Oriented, Class-Based, Concurrent, Functional Streams',
        creatorInfo: 'Created by James Gosling • HotSpot JVM & JIT Compiler',
        sortOrder: 3,
        chapters: [
            {
                chapterNumber: 1,
                title: 'JVM Architecture, Bytecode JIT Compilation & Memory Areas',
                duration: '15 min read',
                difficulty: 'Beginner',
                summary: 'Explore the JDK/JRE/JVM hierarchy, ClassLoader verification, HotSpot Just-In-Time (JIT) compilation, and Stack vs Heap memory.',
                overview: `Java achieves platform independence through a two-stage execution model. First, javac compiles .java source files into platform-neutral bytecode (.class files). At runtime, the Java Virtual Machine (JVM) loads these classes via the ClassLoader subsystem, verifies bytecode safety, and executes them using a hybrid Interpreter + Just-In-Time (JIT) Compiler. When the HotSpot profiler detects "hot" loops executed thousands of times, the C2 JIT compiler translates that bytecode directly into optimized native machine code.

JVM memory is partitioned into Thread-Private areas (JVM Stack frames holding primitive local variables and object references, Program Counter, Native Stack) and Thread-Shared areas (Heap where all Object instances and arrays live, and Metaspace holding class metadata and static definitions).`,
                keyPoints: [
                    'Java has 8 primitive types (byte, short, int, long, float, double, char, boolean) stored directly by value on the stack or inline in objects.',
                    'All objects and arrays are allocated on the Heap and accessed via references.',
                    '== compares primitive values or reference memory addresses; .equals() compares logical object content.',
                    'Integer caching pools boxed Integer.valueOf(x) objects in the range [-128, 127].'
                ],
                diagramTitle: 'Java javac Compilation & HotSpot JVM Runtime Architecture',
                diagramSteps: [
                    'Source (Main.java) -> javac -> Bytecode (Main.class)',
                    'ClassLoader & Bytecode Verifier',
                    'Interpreter + HotSpot JIT Native Compiler',
                    'JVM Stack (Primitives & Refs) + Heap (Objects)',
                    'G1 Garbage Collector (Young/Old Gen)'
                ],
                graphTitle: 'Throughput After Warmup: Interpreter vs C1/C2 JIT Native Code',
                graphMetricLabel: 'Relative Execution Speed (Higher is faster)',
                graphData: [
                    { label: 'Cold Bytecode Interpreter', value: 12, displayValue: '1.0x Baseline', note: 'Initial startup execution' },
                    { label: 'C1 Client JIT Tiered Compile', value: 48, displayValue: '4.2x Faster', note: 'Fast compilation with basic inlining' },
                    { label: 'C2 Server JIT + Escape Analysis', value: 96, displayValue: '9.5x Faster', note: 'Loop unrolling, SIMD & stack allocation' }
                ],
                syntaxSummaryCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        // 8 Primitive types vs Reference types
        int count = 42;
        long population = 1_400_000_000L;
        double rate = 9.81;
        boolean isActive = true;

        // Autoboxing & Integer Cache [-128, 127]
        Integer a = 127, b = 127;
        Integer c = 200, d = 200;
        System.out.println(a == b);        // true  (cached singleton)
        System.out.println(c == d);        // false (distinct heap objects)
        System.out.println(c.equals(d));   // true  (value equality!)
    }
}`,
                syntaxTable: [
                    { construct: 'Entry Point', syntax: 'public static void main(String[] args)', description: 'Standard JVM entry method invoked without instantiating class.' },
                    { construct: 'Value Equality', syntax: 'Objects.equals(a, b)', description: 'Null-safe logical equality check between two object references.' },
                    { construct: 'Type Casting', syntax: 'int x = (int) 9.99; / long y = x;', description: 'Explicit narrowing cast vs implicit widening conversion.' },
                    { construct: 'Fast Console I/O', syntax: 'BufferedReader + StringTokenizer', description: 'High-throughput input parsing for large competitive programming inputs.' }
                ],
                examples: [
                    {
                        title: 'Primitive vs Reference Equality & Autoboxing Pool Trace',
                        code: `import java.util.Objects;

public class JvmMemoryDemo {
    public static void main(String[] args) {
        Integer x = Integer.valueOf(100);
        Integer y = Integer.valueOf(100);
        Integer p = Integer.valueOf(500);
        Integer q = Integer.valueOf(500);

        System.out.println("100 == 100 (Cached): " + (x == y));
        System.out.println("500 == 500 (New Heap): " + (p == q));
        System.out.println("Objects.equals(500, 500): " + Objects.equals(p, q));
    }
}`,
                        output: `100 == 100 (Cached): true
500 == 500 (New Heap): false
Objects.equals(500, 500): true`,
                        explanation: 'Always use .equals() or Objects.equals(a, b) when comparing boxed wrapper objects (Integer, Long, String) in Java.'
                    }
                ],
                problems: [
                    {
                        title: 'Palindrome Number Without String Conversion',
                        difficulty: 'Easy',
                        statement: 'Given an integer x, return true if x is a palindrome integer without converting the integer into a String.',
                        sampleInput: 'x = 12321',
                        sampleOutput: 'true',
                        constraints: '-2^31 <= x <= 2^31 - 1',
                        hint: 'Negative numbers and numbers ending in 0 (except 0 itself) are false. Reverse only the second half of digits until x <= reversedHalf.'
                    },
                    {
                        title: 'Roman Numeral to Integer Converter',
                        difficulty: 'Easy',
                        statement: 'Given a valid Roman numeral string s (I, V, X, L, C, D, M), convert it into an integer.',
                        sampleInput: 's = "MCMXCIV"',
                        sampleOutput: '1994',
                        constraints: '1 <= s.length() <= 15',
                        hint: 'If the current symbol value is less than the next symbol value (e.g., IV or CM), subtract it; otherwise add it.'
                    }
                ]
            },
            {
                chapterNumber: 2,
                title: 'Control Flow, Enhanced Switch Expressions & Arrays',
                duration: '14 min read',
                difficulty: 'Beginner',
                summary: 'Use modern Java arrow switch expressions, labeled break/continue, and java.util.Arrays utility algorithms.',
                overview: `Modern Java (Java 14–21) upgrades the traditional switch statement into an expression using arrow labels (case X -> result;) that eliminate accidental fall-through bugs and can return a value directly.

Java arrays (int[], String[]) are fixed-length objects allocated on the heap with a built-in final .length field and runtime bounds checking (throwing ArrayIndexOutOfBoundsException on invalid indices). The java.util.Arrays utility class provides optimized sorting (Dual-Pivot Quicksort for primitives, Timsort for objects), binary search, and deep equality comparison.`,
                keyPoints: [
                    'Use array.length (field) for arrays, str.length() (method) for Strings, and list.size() (method) for Collections.',
                    'Arrow switch (case 1, 2 -> "Valid";) never falls through and can be assigned directly to a variable.',
                    'Arrays.sort(int[]) uses Dual-Pivot Quicksort (O(N log N)); Arrays.sort(Object[]) uses stable Timsort.',
                    '2D arrays in Java are arrays of object references (jagged arrays are supported).'
                ],
                diagramTitle: 'Java Heap Array Bounds Check & Dual-Pivot Sort',
                diagramSteps: [
                    'Stack Reference int[] arr',
                    'Heap Array Header (Class Word + length=5)',
                    'Runtime Check: 0 <= idx < arr.length',
                    'Arrays.sort(arr) -> Dual-Pivot Quicksort',
                    'Arrays.binarySearch(arr, key) -> O(log N)'
                ],
                graphTitle: 'Java Sorting Algorithms on 1,000,000 Elements',
                graphMetricLabel: 'Execution Time in Milliseconds',
                graphData: [
                    { label: 'Arrays.parallelSort(int[])', value: 22, displayValue: '24 ms', note: 'ForkJoinPool multi-core sort' },
                    { label: 'Arrays.sort(int[] primitive)', value: 48, displayValue: '54 ms', note: 'Dual-Pivot Quicksort in-place' },
                    { label: 'Arrays.sort(Integer[] boxed)', value: 95, displayValue: '165 ms', note: 'Pointer indirection + Timsort' }
                ],
                syntaxSummaryCode: `import java.util.Arrays;

public class ArraySwitchDemo {
    public static String gradeTier(int score) {
        return switch (score / 10) {
            case 10, 9 -> "Distinction";
            case 8, 7  -> "First Class";
            case 6, 5  -> "Pass";
            default    -> "Needs Improvement";
        };
    }

    public static void main(String[] args) {
        int[] nums = {42, 15, 8, 99, 23};
        Arrays.sort(nums);                          // [8, 15, 23, 42, 99]
        int idx = Arrays.binarySearch(nums, 23);    // 2
        int[] copy = Arrays.copyOfRange(nums, 1, 4);// [15, 23, 42]
        System.out.println(Arrays.toString(copy) + " idx=" + idx);
    }
}`,
                syntaxTable: [
                    { construct: 'Arrow Switch', syntax: 'String s = switch(k) { case 1 -> "One"; default -> "Other"; };', description: 'Fall-through-safe switch expression returning a value.' },
                    { construct: 'Sort Array', syntax: 'Arrays.sort(arr);', description: 'Sorts primitive or object array in O(N log N) time.' },
                    { construct: 'Print Array', syntax: 'Arrays.toString(arr) / Arrays.deepToString(mat)', description: 'Formats 1D or 2D array elements into a readable string.' },
                    { construct: 'Fill Array', syntax: 'Arrays.fill(dp, -1);', description: 'Initializes all slots of a 1D array to a constant value.' }
                ],
                examples: [
                    {
                        title: 'Product of Array Except Self in O(N) Time Without Division',
                        code: `import java.util.Arrays;

public class ProductExceptSelf {
    public static int[] solve(int[] nums) {
        int n = nums.length;
        int[] res = new int[n];
        int prefix = 1;
        for (int i = 0; i < n; i++) {
            res[i] = prefix;
            prefix *= nums[i];
        }
        int suffix = 1;
        for (int i = n - 1; i >= 0; i--) {
            res[i] *= suffix;
            suffix *= nums[i];
        }
        return res;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(solve(new int[]{1, 2, 3, 4})));
    }
}`,
                        output: `[24, 12, 8, 6]`,
                        explanation: 'Two linear passes accumulate prefix products from left-to-right and suffix products from right-to-left in O(1) extra space.'
                    }
                ],
                problems: [
                    {
                        title: 'Container With Most Water (Two Pointers)',
                        difficulty: 'Medium',
                        statement: 'Given an integer array height of length n representing vertical lines, find two lines that together with the x-axis form a container that holds the maximum amount of water.',
                        sampleInput: 'height = [1,8,6,2,5,4,8,3,7]',
                        sampleOutput: '49',
                        constraints: '2 <= n <= 10^5',
                        hint: 'Start pointers at left=0, right=n-1; compute area = Math.min(h[left], h[right]) * (right - left), and move the pointer with the shorter height inward.'
                    },
                    {
                        title: 'Search in Rotated Sorted Array',
                        difficulty: 'Medium',
                        statement: 'Given a sorted array of distinct integers that has been rotated at an unknown pivot, find the index of target in O(log N) time.',
                        sampleInput: 'nums = [4,5,6,7,0,1,2], target = 0',
                        sampleOutput: '4',
                        constraints: '1 <= nums.length <= 5000',
                        hint: 'In each binary search step, at least one half (low..mid or mid..high) is strictly sorted. Check if target lies within the sorted half.'
                    }
                ]
            },
            {
                chapterNumber: 3,
                title: 'Strings, String Pool Interning & StringBuilder Performance',
                duration: '15 min read',
                difficulty: 'Beginner',
                summary: 'Understand Java String immutability, the Heap String Constant Pool, Compact Strings, and mutable StringBuilder.',
                overview: `In Java, String objects are strictly immutable and thread-safe. Since Java 9, Compact Strings store Latin-1 strings using a single byte[] array (1 byte per char instead of 2-byte UTF-16) automatically, cutting string memory consumption in half.

String literals like "Ethnotech" are stored in the String Constant Pool on the heap so identical literals share the same object reference. However, concatenating strings inside a loop with += creates a new String object on every iteration in O(N^2) time. Always use StringBuilder (single-threaded, fast) or StringBuffer (synchronized) for O(N) mutable string assembly.`,
                keyPoints: [
                    'String literals are automatically interned in the String Pool; new String("abc") forces a fresh heap allocation.',
                    'Always compare strings with str1.equals(str2) or str1.equalsIgnoreCase(str2), never with ==.',
                    'StringBuilder.append() mutates an internal char/byte buffer in amortized O(1) time.',
                    'str.toCharArray() converts a String into a mutable char[] array for fast in-place algorithms.'
                ],
                diagramTitle: 'Java String Pool Interning vs StringBuilder Mutable Buffer',
                diagramSteps: [
                    'Literal "Java" -> Checks String Constant Pool',
                    'Reuses Existing Pool Reference',
                    'Loop Mutation -> Use StringBuilder(capacity)',
                    'sb.append(chunk) -> Amortized O(1) Buffer Write',
                    'sb.toString() -> Final Immutable String'
                ],
                graphTitle: 'Appending 50,000 Words in Java: StringBuilder vs String +=',
                graphMetricLabel: 'Execution Time in Milliseconds',
                graphData: [
                    { label: 'Pre-sized StringBuilder(cap)', value: 3, displayValue: '1.1 ms (O(N))', note: 'Zero buffer reallocations' },
                    { label: 'Default StringBuilder()', value: 5, displayValue: '1.8 ms (O(N))', note: 'Amortized 2x buffer growth' },
                    { label: 'Synchronized StringBuffer', value: 9, displayValue: '3.2 ms (O(N))', note: 'Thread-safe lock overhead' },
                    { label: 'String s += word in loop', value: 100, displayValue: '310.0 ms (O(N²))', note: '50,000 intermediate heap objects' }
                ],
                syntaxSummaryCode: `public class StringMastery {
    public static void main(String[] args) {
        String s = "  Ethnotech Code2Career  ";
        String trimmed = s.strip();                 // Unicode-aware trim
        String[] tokens = trimmed.split("\\\\s+");

        // O(N) StringBuilder construction
        StringBuilder sb = new StringBuilder(64);
        for (int i = 0; i < tokens.length; i++) {
            if (i > 0) sb.append('-');
            sb.append(tokens[i].toLowerCase());
        }
        String slug = sb.toString();                // "ethnotech-code2career"
        String reversed = new StringBuilder(slug).reverse().toString();
        System.out.println(slug + " | " + reversed);
    }
}`,
                syntaxTable: [
                    { construct: 'Char At Index', syntax: 'char c = s.charAt(i);', description: 'Returns character at 0-based index i in O(1) time.' },
                    { construct: 'Substring', syntax: 's.substring(start, end)', description: 'Extracts characters from start (inclusive) to end (exclusive).' },
                    { construct: 'Mutable Builder', syntax: 'new StringBuilder().append(x).reverse()', description: 'Fast mutable string buffer with in-place reverse and delete.' },
                    { construct: 'Char Classification', syntax: 'Character.isLetterOrDigit(c)', description: 'Built-in utility methods on Character wrapper class.' }
                ],
                examples: [
                    {
                        title: 'Expand-Around-Center Longest Palindromic Substring',
                        code: `public class LongestPalindrome {
    private static int expand(String s, int l, int r) {
        while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) {
            l--;
            r++;
        }
        return r - l - 1;
    }

    public static String longestPalindrome(String s) {
        if (s == null || s.isEmpty()) return "";
        int start = 0, end = 0;
        for (int i = 0; i < s.length(); i++) {
            int len = Math.max(expand(s, i, i), expand(s, i, i + 1));
            if (len > end - start + 1) {
                start = i - (len - 1) / 2;
                end = i + len / 2;
            }
        }
        return s.substring(start, end + 1);
    }

    public static void main(String[] args) {
        System.out.println("Longest Palindrome: " + longestPalindrome("babad"));
    }
}`,
                        output: `Longest Palindrome: bab`,
                        explanation: 'Expanding around all 2N - 1 centers finds the longest palindrome in O(N^2) time and O(1) space.'
                    }
                ],
                problems: [
                    {
                        title: 'Decode Encoded Bracket String (3[a2[c]])',
                        difficulty: 'Medium',
                        statement: 'Given an encoded string like "3[a2[c]]", return its decoded string "accaccacc" using a stack of StringBuilders and repeat counts.',
                        sampleInput: 's = "3[a2[c]]"',
                        sampleOutput: '"accaccacc"',
                        constraints: '1 <= s.length() <= 30',
                        hint: 'Maintain an ArrayDeque<Integer> for multipliers and ArrayDeque<StringBuilder> for previous string contexts.'
                    },
                    {
                        title: 'Minimum Window Substring',
                        difficulty: 'Hard',
                        statement: 'Given two strings s and t, return the minimum window substring of s such that every character in t (including duplicates) is included in the window.',
                        sampleInput: 's = "ADOBECODEBANC", t = "ABC"',
                        sampleOutput: '"BANC"',
                        constraints: '1 <= s.length(), t.length() <= 10^5',
                        hint: 'Use a 128-element int[] frequency array and expand right pointer until all required characters are matched, then shrink left.'
                    }
                ]
            },
            {
                chapterNumber: 4,
                title: 'Classes, Objects, Constructors, Encapsulation & Records',
                duration: '15 min read',
                difficulty: 'Beginner',
                summary: 'Build well-encapsulated Java classes using constructors, access modifiers, static members, final immutability, and Java Records.',
                overview: `Every Java program is structured around classes and objects. Encapsulation hides internal state by marking fields private and exposing controlled access through methods or immutable constructors. Constructor overloading allows multiple initialization signatures, chaining via this(...).

Java 16+ introduced the record keyword (public record Point(int x, int y) {}) which concisely declares an immutable data carrier class with auto-generated private final fields, canonical constructor, accessors (x(), y()), equals(), hashCode(), and toString().`,
                keyPoints: [
                    'Access modifiers from most restrictive to least: private -> package-private (default) -> protected -> public.',
                    'The final keyword on a variable prevents reassignment; on a method prevents overriding; on a class prevents subclassing.',
                    'Whenever you override equals(Object o), you MUST also override hashCode() so HashMap and HashSet work properly.',
                    'Java record classes eliminate 50+ lines of boilerplate for immutable DTOs and value tuples.'
                ],
                diagramTitle: 'Java Class Encapsulation & Immutable Record Lifecycle',
                diagramSteps: [
                    'private final Fields (State Hidden)',
                    'Constructor Validation & this(...) Chaining',
                    'Public Accessors / Domain Methods',
                    'equals() + hashCode() Contract',
                    'Java record -> Auto Immutable Value Type'
                ],
                graphTitle: 'Code Boilerplate Lines: Traditional POJO vs Java Record',
                graphMetricLabel: 'Lines of Source Code Required',
                graphData: [
                    { label: 'Java 16+ record Candidate(String usn, double cgpa)', value: 6, displayValue: '3 lines', note: 'Auto equals, hashCode, toString, getters' },
                    { label: 'Hand-Written Immutable Class with equals/hashCode', value: 95, displayValue: '58 lines', note: 'Manual boilerplate fields & methods' }
                ],
                syntaxSummaryCode: `import java.util.Objects;

// Concise Immutable Java Record (Java 16+)
public record StudentRecord(String usn, String name, double cgpa) {
    public StudentRecord {
        if (cgpa < 0.0 || cgpa > 10.0) {
            throw new IllegalArgumentException("Invalid CGPA: " + cgpa);
        }
    }
}

// Traditional Encapsulated Class
class Counter {
    private static int totalInstances = 0;
    private int count;

    public Counter(int initial) {
        this.count = initial;
        totalInstances++;
    }
    public int increment() { return ++this.count; }
    public static int getTotalInstances() { return totalInstances; }
}`,
                syntaxTable: [
                    { construct: 'Constructor Chain', syntax: 'public Foo() { this(0); }', description: 'Delegates to another constructor in the same class (must be 1st line).' },
                    { construct: 'Immutable Record', syntax: 'public record Pair(int first, int second) {}', description: 'Declares immutable value class with equals/hashCode/toString.' },
                    { construct: 'Hash Contract', syntax: '@Override public int hashCode() { return Objects.hash(a, b); }', description: 'Generates consistent hash code matching equals() fields.' },
                    { construct: 'Static Initializer', syntax: 'static { /* one-time setup */ }', description: 'Executes once when the class is first loaded into Metaspace.' }
                ],
                examples: [
                    {
                        title: 'Immutable Java Record with Compact Constructor Validation',
                        code: `public class RecordDemo {
    public record ExamScore(String usn, int marks) {
        public ExamScore {
            usn = usn.strip().toUpperCase();
            if (marks < 0 || marks > 100) {
                throw new IllegalArgumentException("Marks out of range");
            }
        }
        public boolean isPass() { return marks >= 40; }
    }

    public static void main(String[] args) {
        ExamScore s1 = new ExamScore(" 4mt22cs001 ", 88);
        ExamScore s2 = new ExamScore("4MT22CS001", 88);
        System.out.println(s1 + " | pass=" + s1.isPass());
        System.out.println("Value equality: " + s1.equals(s2));
    }
}`,
                        output: `ExamScore[usn=4MT22CS001, marks=88] | pass=true
Value equality: true`,
                        explanation: 'Records normalize and validate fields in the compact constructor and compare equal by value automatically.'
                    }
                ],
                problems: [
                    {
                        title: 'Design a MinStack Supporting getMin() in O(1) Time',
                        difficulty: 'Medium',
                        statement: 'Design a stack class MinStack that supports push(val), pop(), top(), and retrieving the minimum element getMin() in constant O(1) time.',
                        sampleInput: 'push(-2), push(0), push(-3), getMin(), pop(), top(), getMin()',
                        sampleOutput: 'getMin -> -3, top -> 0, getMin -> -2',
                        constraints: 'All operations must run in O(1) time',
                        hint: 'Store immutable Node(int val, int currentMin, Node next) objects or pairs where each entry records the minimum seen up to that depth.'
                    },
                    {
                        title: 'Implement Builder Pattern for HTTP Request Config',
                        difficulty: 'Easy',
                        statement: 'Create an immutable HttpRequest class with a nested static Builder class supporting fluent method chaining (.url(...).method(...).timeout(...).build()).',
                        sampleInput: 'new HttpRequest.Builder("https://api.ethnotech.in").method("POST").timeout(5000).build()',
                        sampleOutput: 'POST https://api.ethnotech.in (timeout=5000ms)',
                        constraints: 'url is required; method defaults to GET',
                        hint: 'Have each setter on Builder return this, and have build() invoke a private HttpRequest(Builder b) constructor.'
                    }
                ]
            },
            {
                chapterNumber: 5,
                title: 'Inheritance, Polymorphism, Abstract Classes & Interfaces',
                duration: '16 min read',
                difficulty: 'Intermediate',
                summary: 'Master dynamic method dispatch, super chaining, abstract base classes vs functional interfaces, and sealed classes.',
                overview: `Java supports single class inheritance (extends) and multiple interface implementation (implements). Runtime Polymorphism (Dynamic Method Dispatch) resolves overridden instance methods based on the actual heap object type at runtime rather than the declared reference type—enabling open-closed, extensible architectures.

An abstract class can hold instance fields, constructors, and a mix of concrete and abstract methods, modeling an "IS-A" taxonomic hierarchy. An interface defines a behavioral contract ("CAN-DO") and supports default methods, static helpers, and functional lambda targets (@FunctionalInterface with a single abstract method).`,
                keyPoints: [
                    'Instance methods in Java are virtual by default (unless marked final, static, or private).',
                    'A class can extend only one superclass, but can implement any number of interfaces.',
                    'Pattern matching for instanceof (if (shape instanceof Circle c)) checks type and binds the cast variable in one step.',
                    'Prefer Composition ("HAS-A") over deep Inheritance hierarchies when sharing reusable behavior.'
                ],
                diagramTitle: 'Polymorphic vtable Dispatch & Interface Contract Architecture',
                diagramSteps: [
                    'Interface PaymentGateway (pay() contract)',
                    'Concrete Implementations (UpiGateway, CardGateway)',
                    'Caller holds Interface Reference gateway',
                    'JVM vtable Lookup Resolves Concrete Object Type',
                    'Executes Overridden Method at Runtime'
                ],
                graphTitle: 'Flexibility & Coupling Comparison in OOP Design',
                graphMetricLabel: 'Architectural Decoupling Score (Higher is better)',
                graphData: [
                    { label: 'Interface + Dependency Injection', value: 96, displayValue: '96/100', note: 'Zero concrete coupling, easy mocking' },
                    { label: 'Abstract Template Base Class', value: 78, displayValue: '78/100', note: 'Shared state + hook methods' },
                    { label: 'Sealed Hierarchy + Pattern Match', value: 88, displayValue: '88/100', note: 'Exhaustive compile-time safety' },
                    { label: 'Deep Concrete Inheritance (4+ levels)', value: 28, displayValue: '28/100', note: 'Fragile base class problem' }
                ],
                syntaxSummaryCode: `sealed interface Shape permits Circle, Rectangle {
    double area();
}

record Circle(double radius) implements Shape {
    @Override public double area() { return Math.PI * radius * radius; }
}

record Rectangle(double width, double height) implements Shape {
    @Override public double area() { return width * height; }
}

public class PolymorphismDemo {
    public static String describe(Shape s) {
        if (s instanceof Circle c) {
            return String.format("Circle(r=%.1f) Area=%.2f", c.radius(), c.area());
        }
        return String.format("Shape Area=%.2f", s.area());
    }
}`,
                syntaxTable: [
                    { construct: 'Subclass Super Call', syntax: 'super(arg1, arg2);', description: 'Invokes parent class constructor (must be first statement in constructor).' },
                    { construct: 'Method Override', syntax: '@Override public void execute()', description: 'Compiler-checked override of a superclass or interface method.' },
                    { construct: 'Interface Default', syntax: 'default void log() { ... }', description: 'Provides backward-compatible default implementation in an interface.' },
                    { construct: 'Pattern instanceof', syntax: 'if (obj instanceof String s)', description: 'Tests runtime type and binds strongly-typed variable s.' }
                ],
                examples: [
                    {
                        title: 'Strategy Pattern via Functional Interface & Polymorphism',
                        code: `import java.util.List;

interface DiscountPolicy {
    double apply(double amount);
}

public class CheckoutService {
    public static void main(String[] args) {
        List<DiscountPolicy> policies = List.of(
            amt -> amt * 0.90,                      // 10% Student Discount
            amt -> Math.max(0, amt - 150.0)         // Flat Rs. 150 Coupon
        );
        double bill = 1000.0;
        for (DiscountPolicy policy : policies) {
            System.out.printf("Final Payable: Rs. %.2f%n", policy.apply(bill));
        }
    }
}`,
                        output: `Final Payable: Rs. 900.00
Final Payable: Rs. 850.00`,
                        explanation: 'Because DiscountPolicy has a single abstract method, strategies can be passed either as classes or inline lambdas.'
                    }
                ],
                problems: [
                    {
                        title: 'Polymorphic Notification Dispatcher',
                        difficulty: 'Easy',
                        statement: 'Design a NotificationSender interface with method send(String recipient, String msg) and three implementations (EmailSender, SmsSender, PushSender). Process a heterogeneous list of senders polymorphically.',
                        sampleInput: 'Recipient = "student@college.edu", Msg = "Drive Live"',
                        sampleOutput: '[EMAIL] -> student@college.edu: Drive Live | [SMS] -> ...',
                        constraints: 'Zero if/else type checks in the dispatcher loop',
                        hint: 'Iterate over List<NotificationSender> and call sender.send(recipient, msg) directly.'
                    },
                    {
                        title: 'Design an Abstract Expression Tree Evaluator',
                        difficulty: 'Medium',
                        statement: 'Create an abstract ExprNode with int evaluate(), a NumNode(int val) leaf, and an OpNode(char op, ExprNode left, ExprNode right) that evaluates +, -, * expressions recursively.',
                        sampleInput: '(3 + 5) * 2',
                        sampleOutput: '16',
                        constraints: 'Tree depth <= 100',
                        hint: 'OpNode.evaluate() switches on op and recursively evaluates left.evaluate() and right.evaluate().'
                    }
                ]
            },
            {
                chapterNumber: 6,
                title: 'Java Collections Framework: List, Map, Set, Deque & PriorityQueue',
                duration: '18 min read',
                difficulty: 'Intermediate',
                summary: 'Master the internal mechanics and Big-O complexities of ArrayList, ArrayDeque, HashMap (red-black tree bins), TreeMap, and PriorityQueue.',
                overview: `The Java Collections Framework (java.util) provides industrial-grade data structures:
- ArrayList<E>: Resizable Object[] array growing by 50% (oldCap + (oldCap >> 1)) with O(1) random access and amortized O(1) add.
- ArrayDeque<E>: Circular array double-ended queue that is faster and more memory-efficient than both Stack and LinkedList for stacks and BFS queues.
- HashMap<K, V>: Hash table of Node<K,V> buckets (load factor 0.75). Since Java 8, when a single bucket chain exceeds 8 nodes (and table capacity >= 64), it automatically converts the linked list into a balanced Red-Black Tree—improving worst-case collision lookup from O(N) to O(log N)!
- TreeMap<K, V> / TreeSet<E>: Navigable Red-Black Tree supporting O(log N) floorKey, ceilingKey, and sorted range views.`,
                keyPoints: [
                    'Always prefer ArrayDeque over legacy java.util.Stack (which is synchronized on every call) and LinkedList.',
                    'HashMap.computeIfAbsent(k, key -> new ArrayList<>()).add(v) builds adjacency lists in one clean line.',
                    'PriorityQueue<E> is a binary min-heap; pass Comparator.reverseOrder() or (a, b) -> Integer.compare(b, a) for a max-heap.',
                    'Never use (a, b) -> a - b in comparators because a - b can overflow when a is negative; always use Integer.compare(a, b)!'
                ],
                diagramTitle: 'Java 8+ HashMap Bucket Treeification & Collection Hierarchy',
                diagramSteps: [
                    'key.hashCode() ^ (h >>> 16) Spreads High Bits',
                    'Bucket Index = (n - 1) & hash',
                    'Bucket Chain <= 8 Nodes -> Singly Linked List',
                    'Bucket Chain > 8 Nodes -> Red-Black Tree O(log N)',
                    'Load > 0.75 * Capacity -> 2x Power-of-Two Resize'
                ],
                graphTitle: 'Java Collection Operation Complexity & Memory Overhead',
                graphMetricLabel: 'Relative Lookup / Queue Cost (Lower is faster)',
                graphData: [
                    { label: 'ArrayList.get(i) / ArrayDeque.poll()', value: 5, displayValue: 'O(1)', note: 'Contiguous CPU cache locality' },
                    { label: 'HashMap.get(key) / HashSet.contains()', value: 12, displayValue: 'O(1) avg / O(log N) worst', note: 'Treeified bucket protection' },
                    { label: 'TreeMap.ceilingKey() / PriorityQueue.poll()', value: 36, displayValue: 'O(log N)', note: 'Red-Black Tree / Binary Heap' },
                    { label: 'LinkedList.get(i) index traversal', value: 98, displayValue: 'O(N)', note: 'Pointer chasing cache misses' }
                ],
                syntaxSummaryCode: `import java.util.*;

public class CollectionsCheatsheet {
    public static void main(String[] args) {
        // 1. Adjacency List & Frequency Map
        Map<Integer, List<Integer>> graph = new HashMap<>();
        graph.computeIfAbsent(1, k -> new ArrayList<>()).add(2);

        Map<String, Integer> freq = new HashMap<>();
        freq.merge("java", 1, Integer::sum);

        // 2. Stack & BFS Queue via ArrayDeque
        Deque<Integer> stack = new ArrayDeque<>();
        stack.push(10);
        Deque<Integer> queue = new ArrayDeque<>();
        queue.offer(20);

        // 3. Max-Heap PriorityQueue
        PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Comparator.reverseOrder());

        // 4. Navigable Red-Black TreeMap
        TreeMap<Integer, String> timeline = new TreeMap<>();
        timeline.put(10, "Ten");
        Integer floor = timeline.floorKey(12); // 10
    }
}`,
                syntaxTable: [
                    { construct: 'Frequency Increment', syntax: 'map.merge(key, 1, Integer::sum);', description: 'Inserts 1 if key is absent, or adds 1 to existing count.' },
                    { construct: 'Graph Adjacency Init', syntax: 'map.computeIfAbsent(u, k -> new ArrayList<>()).add(v);', description: 'Lazily creates neighbor list and appends v.' },
                    { construct: 'Fast Stack / Queue', syntax: 'Deque<T> dq = new ArrayDeque<>();', description: 'Use push/pop for LIFO stack; offer/poll for FIFO queue.' },
                    { construct: 'Floor / Ceiling Key', syntax: 'treeMap.floorKey(x) / treeMap.ceilingKey(x)', description: 'Finds greatest key <= x or smallest key >= x in O(log N).' }
                ],
                examples: [
                    {
                        title: 'Top-K Frequent Elements Using HashMap & Min-Heap',
                        code: `import java.util.*;

public class TopKFrequent {
    public static int[] topK(int[] nums, int k) {
        Map<Integer, Integer> count = new HashMap<>();
        for (int n : nums) count.merge(n, 1, Integer::sum);

        PriorityQueue<Integer> minHeap = new PriorityQueue<>(
            Comparator.comparingInt(count::get)
        );
        for (int num : count.keySet()) {
            minHeap.offer(num);
            if (minHeap.size() > k) minHeap.poll();
        }
        int[] res = new int[k];
        for (int i = k - 1; i >= 0; i--) res[i] = minHeap.poll();
        return res;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(topK(new int[]{1,1,1,2,2,3}, 2)));
    }
}`,
                        output: `[1, 2]`,
                        explanation: 'Maintaining a min-heap capped at size k keeps complexity at O(N log K) instead of sorting all N elements.'
                    }
                ],
                problems: [
                    {
                        title: 'Next Greater Element Using Monotonic ArrayDeque',
                        difficulty: 'Medium',
                        statement: 'Given a circular array nums, return the next greater number for every element in O(N) time using a monotonic stack (ArrayDeque).',
                        sampleInput: 'nums = [1, 2, 1]',
                        sampleOutput: '[2, -1, 2]',
                        constraints: '1 <= nums.length <= 10^4',
                        hint: 'Loop i from 0 to 2*n - 1, popping indices from the stack while nums[stack.peek()] < nums[i % n].'
                    },
                    {
                        title: 'Time-Based Key-Value Store Using TreeMap',
                        difficulty: 'Medium',
                        statement: 'Design a TimeMap structure supporting set(key, value, timestamp) and get(key, timestamp) which returns the value with the largest timestamp_prev <= timestamp.',
                        sampleInput: 'set("foo", "bar", 1), get("foo", 1), get("foo", 3), set("foo", "bar2", 4), get("foo", 4)',
                        sampleOutput: '"bar", "bar", "bar2"',
                        constraints: 'O(log N) lookup per query',
                        hint: 'Map each key to a TreeMap<Integer, String> and query treeMap.floorEntry(timestamp).'
                    }
                ]
            },
            {
                chapterNumber: 7,
                title: 'Generics, Wildcards (PECS), Comparators & Type Erasure',
                duration: '15 min read',
                difficulty: 'Intermediate',
                summary: 'Write type-safe reusable components with bounded type parameters, PECS wildcards (? extends T, ? super T), and Comparator chaining.',
                overview: `Java Generics provide compile-time type safety and eliminate explicit casts while maintaining binary backward compatibility through Type Erasure: at compile time, the compiler verifies all generic constraints, inserts synthetic casts, and erases raw type parameters T to Object (or their upper bound, such as Comparable).

When designing generic APIs, Joshua Bloch's PECS rule ("Producer Extends, Consumer Super") governs wildcard variance: use List<? extends T> when reading items out of a collection (covariance), and List<? super T> when inserting items into a collection (contravariance).`,
                keyPoints: [
                    'Generics cannot use primitive types directly (List<int> is invalid; use List<Integer>).',
                    'PECS Rule: Producer Extends (? extends T for read-only sources), Consumer Super (? super T for write sinks).',
                    'Comparable<T> defines a class natural ordering via compareTo(T o); Comparator<T> defines external sort strategies.',
                    'Comparator.comparingInt(Student::score).reversed().thenComparing(Student::name) chains multi-field sorting cleanly.'
                ],
                diagramTitle: 'Compile-Time Generic Checking & PECS Variance Flow',
                diagramSteps: [
                    'Generic Source List<String>',
                    'javac Type Checker & Bound Validator',
                    'PECS: ? extends Number (Read Producer)',
                    'PECS: ? super Integer (Write Consumer)',
                    'Bytecode Type Erasure + Bridge Casts'
                ],
                graphTitle: 'Comparator Implementation Safety & Readability Comparison',
                graphMetricLabel: 'Overflow Safety & Maintainability Score',
                graphData: [
                    { label: 'Comparator.comparingInt(...).thenComparing(...)', value: 98, displayValue: '98/100 (Recommended)', note: 'Overflow-safe & declarative' },
                    { label: 'Lambda (a, b) -> Integer.compare(a.x, b.x)', value: 92, displayValue: '92/100 (Safe)', note: 'Handles INT_MIN safely' },
                    { label: 'Subtraction Trick (a, b) -> a.x - b.x', value: 18, displayValue: '18/100 (BUGGY!)', note: 'Overflows on (-2B) - (+2B)!' }
                ],
                syntaxSummaryCode: `import java.util.*;

public class GenericsPecsDemo {
    // Producer Extends, Consumer Super (PECS)
    public static <T> void copyElements(List<? extends T> source, List<? super T> dest) {
        for (T item : source) {
            dest.add(item);
        }
    }

    // Bounded Generic Method
    public static <T extends Comparable<? super T>> T findMax(List<T> items) {
        Iterator<T> it = items.iterator();
        T best = it.next();
        while (it.hasNext()) {
            T cur = it.next();
            if (cur.compareTo(best) > 0) best = cur;
        }
        return best;
    }
}`,
                syntaxTable: [
                    { construct: 'Upper Bounded Type', syntax: '<T extends Comparable<T>>', description: 'Restricts T to types that implement Comparable.' },
                    { construct: 'Producer Wildcard', syntax: 'List<? extends Number>', description: 'Read-only covariant view accepting List<Integer>, List<Double>.' },
                    { construct: 'Consumer Wildcard', syntax: 'List<? super Integer>', description: 'Write-friendly contravariant sink accepting List<Number>, List<Object>.' },
                    { construct: 'Chained Comparator', syntax: 'Comparator.comparing(User::role).thenComparingInt(User::age)', description: 'Builds composite multi-key comparator without overflow bugs.' }
                ],
                examples: [
                    {
                        title: 'Multi-Key Candidate Sorting with Chained Comparators',
                        code: `import java.util.*;

public class ComparatorChainDemo {
    record Candidate(String name, int score, int timeSec) {}

    public static void main(String[] args) {
        List<Candidate> list = new ArrayList<>(List.of(
            new Candidate("Kiran", 90, 140),
            new Candidate("Aarav", 95, 180),
            new Candidate("Diya",  90, 115)
        ));

        list.sort(
            Comparator.comparingInt(Candidate::score).reversed()
                      .thenComparingInt(Candidate::timeSec)
                      .thenComparing(Candidate::name)
        );

        list.forEach(System.out::println);
    }
}`,
                        output: `Candidate[name=Aarav, score=95, timeSec=180]
Candidate[name=Diya, score=90, timeSec=115]
Candidate[name=Kiran, score=90, timeSec=140]`,
                        explanation: 'Candidates are sorted by highest score first, fastest completion time second, and alphabetically third.'
                    }
                ],
                problems: [
                    {
                        title: 'Largest Number Formed by Concatenating Array Elements',
                        difficulty: 'Medium',
                        statement: 'Given a list of non-negative integers nums, arrange them such that they form the largest possible number and return it as a string.',
                        sampleInput: 'nums = [3, 30, 34, 5, 9]',
                        sampleOutput: '"9534330"',
                        constraints: '1 <= nums.length <= 100',
                        hint: 'Convert ints to Strings and sort using custom comparator (a, b) -> (b + a).compareTo(a + b). Handle the all-zeros edge case "0".'
                    },
                    {
                        title: 'Generic Pair<K, V> Value Holder with Comparable Ordering',
                        difficulty: 'Easy',
                        statement: 'Implement a generic Pair<K extends Comparable<K>, V extends Comparable<V>> class that compares by key first and by value second.',
                        sampleInput: 'Pair(1, "B") vs Pair(1, "A")',
                        sampleOutput: 'Pair(1, "A") < Pair(1, "B")',
                        constraints: 'Non-null comparable elements',
                        hint: 'In compareTo, compute int cmp = this.key.compareTo(other.key); return (cmp != 0) ? cmp : this.val.compareTo(other.val);'
                    }
                ]
            },
            {
                chapterNumber: 8,
                title: 'Exception Hierarchy, Try-With-Resources & NIO File I/O',
                duration: '14 min read',
                difficulty: 'Intermediate',
                summary: 'Distinguish checked vs unchecked exceptions, guarantee resource cleanup with AutoCloseable try-with-resources, and use java.nio.file.Files.',
                overview: `Java's Throwable hierarchy divides into Error (unrecoverable JVM faults like OutOfMemoryError and StackOverflowError) and Exception. Exceptions further split into Checked Exceptions (subclasses of Exception like IOException and SQLException that the compiler forces you to either catch or declare with throws) and Unchecked RuntimeExceptions (NullPointerException, IllegalArgumentException, IndexOutOfBoundsException).

Introduced in Java 7, try-with-resources (try (var reader = Files.newBufferedReader(path)) { ... }) automatically closes any resource implementing AutoCloseable in reverse declaration order, preserving both primary and suppressed exceptions.`,
                keyPoints: [
                    'Always use try-with-resources for Streams, Readers, JDBC Connections, and Sockets instead of manual finally blocks.',
                    'Never swallow exceptions with an empty catch (Exception e) {} block—either handle, wrap, or log with context.',
                    'java.nio.file.Path and Files.readString() / Files.lines() replace legacy java.io.File for clean modern file operations.',
                    'Optional<T> eliminates NullPointerException chains by making absence explicit in method return types.'
                ],
                diagramTitle: 'Java Throwable Hierarchy & Try-With-Resources AutoCloseable',
                diagramSteps: [
                    'Throwable -> Error (JVM) | Exception (App)',
                    'Checked (IOException) vs Unchecked (RuntimeException)',
                    'try (Resource r = open()) { ... }',
                    'Implicit r.close() via AutoCloseable',
                    'Suppressed Exceptions Preserved'
                ],
                graphTitle: 'Resource Leak Prevention: Try-With-Resources vs Manual Finally',
                graphMetricLabel: 'Safety & Exception Preservation Score',
                graphData: [
                    { label: 'try (var res = ...) AutoCloseable', value: 100, displayValue: '100% Leak-Free', note: 'Handles close() + suppressed exceptions' },
                    { label: 'Files.lines(path) inside try-with-resources', value: 96, displayValue: '96% Lazy Stream', note: 'O(1) memory line streaming' },
                    { label: 'Manual finally { res.close(); }', value: 45, displayValue: '45% Fragile', note: 'close() exception can mask root exception' }
                ],
                syntaxSummaryCode: `import java.io.IOException;
import java.nio.file.*;
import java.util.Optional;
import java.util.stream.Stream;

public class ResourceSafetyDemo {
    public static long countErrorLines(Path logPath) throws IOException {
        try (Stream<String> lines = Files.lines(logPath)) {
            return lines.filter(line -> line.contains("ERROR")).count();
        }
    }

    public static Optional<Integer> tryParseInt(String raw) {
        try {
            return Optional.of(Integer.parseInt(raw.strip()));
        } catch (NumberFormatException ex) {
            return Optional.empty();
        }
    }
}`,
                syntaxTable: [
                    { construct: 'Try-With-Resources', syntax: 'try (BufferedReader br = ...) { ... }', description: 'Automatically calls close() on AutoCloseable resources upon exit.' },
                    { construct: 'Multi-Catch', syntax: 'catch (IOException | SQLException ex)', description: 'Handles multiple distinct exception types in a single catch clause.' },
                    { construct: 'Optional Guard', syntax: 'opt.orElse(defaultVal) / opt.orElseThrow()', description: 'Unwraps Optional value safely or throws when absent.' },
                    { construct: 'NIO Read All', syntax: 'Files.readString(Path.of("config.json"))', description: 'Reads entire UTF-8 text file into a String in one call.' }
                ],
                examples: [
                    {
                        title: 'Custom AutoCloseable Resource & Optional Pipeline',
                        code: `import java.util.Optional;

class ScopedTimer implements AutoCloseable {
    private final String label;
    private final long startNs = System.nanoTime();
    public ScopedTimer(String label) { this.label = label; }
    @Override
    public void close() {
        long ms = (System.nanoTime() - startNs) / 1_000_000;
        System.out.println("Closed [" + label + "] (" + ms + " ms)");
    }
}

public class AutoCloseDemo {
    public static void main(String[] args) {
        try (ScopedTimer timer = new ScopedTimer("BatchScoring")) {
            String raw = Optional.ofNullable("  92  ").map(String::strip).orElse("0");
            System.out.println("Parsed score: " + Integer.parseInt(raw));
        }
    }
}`,
                        output: `Parsed score: 92
Closed [BatchScoring] (0 ms)`,
                        explanation: 'ScopedTimer.close() is invoked deterministically as soon as execution leaves the try block.'
                    }
                ],
                problems: [
                    {
                        title: 'Validate & Sum Integer Tokens from Corrupted Log Lines',
                        difficulty: 'Easy',
                        statement: 'Given an array of strings where some entries are valid integers and others are corrupted tokens (e.g., "42", "ERR", "-15", "N/A"), parse valid integers and return their sum and count of rejected tokens.',
                        sampleInput: 'tokens = ["42", "ERR", "-15", "N/A", "73"]',
                        sampleOutput: 'Valid Sum = 100 | Rejected = 2',
                        constraints: '1 <= tokens.length <= 10^4',
                        hint: 'Catch NumberFormatException per token, increment rejectedCount on failure, and accumulate sum on success.'
                    },
                    {
                        title: 'Simplify Unix File Path',
                        difficulty: 'Medium',
                        statement: 'Given an absolute Unix-style file path (with ".", "..", and multiple slashes "//"), convert it to its simplified canonical path.',
                        sampleInput: 'path = "/home//user/./docs/../code/"',
                        sampleOutput: '"/home/user/code"',
                        constraints: '1 <= path.length() <= 3000',
                        hint: 'Split by "/", push normal directory names onto an ArrayDeque, pop on "..", ignore "" and ".", then join with "/".'
                    }
                ]
            },
            {
                chapterNumber: 9,
                title: 'Lambda Expressions, Functional Interfaces & Stream API',
                duration: '16 min read',
                difficulty: 'Advanced',
                summary: 'Build declarative data-processing pipelines using java.util.function interfaces, Method References, Stream operations, and Collectors.',
                overview: `Java 8+ introduced functional programming primitives via Lambda Expressions ((a, b) -> a + b), Method References (String::toUpperCase), and the Stream API (java.util.stream). A Stream is not a data structure; it is a lazy, non-mutating pipeline of intermediate operations (filter, map, flatMap, sorted, distinct) driven by a terminal operation (collect, reduce, count, findFirst, anyMatch).

Because intermediate operations are lazy, Java fuses filter -> map -> limit stages into a single short-circuiting pass without allocating intermediate collections!`,
                keyPoints: [
                    'Core functional interfaces: Predicate<T> (T -> boolean), Function<T,R> (T -> R), Consumer<T> (T -> void), Supplier<T> (() -> T).',
                    'Use primitive streams (IntStream, LongStream, DoubleStream) via .mapToInt() to avoid autoboxing overhead.',
                    'Collectors.groupingBy() and Collectors.partitioningBy() aggregate streams into multi-level maps in a single pass.',
                    'A Stream can be consumed by only one terminal operation; reusing a closed stream throws IllegalStateException.'
                ],
                diagramTitle: 'Lazy Java Stream Pipeline & Short-Circuit Fusion',
                diagramSteps: [
                    'Source: list.stream() / IntStream.range()',
                    'Lazy Stage 1: .filter(Predicate)',
                    'Lazy Stage 2: .map(Function) / .flatMap()',
                    'Terminal Trigger: .collect(Collectors.toList())',
                    'Single Fused Loop Execution'
                ],
                graphTitle: 'Summing 10M Integers: IntStream vs Boxed Stream<Integer>',
                graphMetricLabel: 'Execution Time in Milliseconds (Lower is faster)',
                graphData: [
                    { label: 'Primitive IntStream.parallel().sum()', value: 12, displayValue: '5 ms', note: 'Unboxed SIMD + multi-core' },
                    { label: 'Primitive IntStream.sum()', value: 24, displayValue: '11 ms', note: 'Zero heap boxing overhead' },
                    { label: 'Boxed Stream<Integer>.reduce(0, Integer::sum)', value: 96, displayValue: '68 ms', note: '6x slower due to Integer boxing' }
                ],
                syntaxSummaryCode: `import java.util.*;
import java.util.stream.*;

public class StreamPipelineDemo {
    record Student(String name, String dept, int score) {}

    public static void main(String[] args) {
        List<Student> roster = List.of(
            new Student("Aarav", "CSE", 92),
            new Student("Diya",  "ECE", 88),
            new Student("Kiran", "CSE", 79)
        );

        // Group average score by department
        Map<String, Double> avgByDept = roster.stream()
            .collect(Collectors.groupingBy(
                Student::dept,
                Collectors.averagingInt(Student::score)
            ));
        System.out.println(avgByDept); // {CSE=85.5, ECE=88.0}
    }
}`,
                syntaxTable: [
                    { construct: 'Filter & Map', syntax: 'stream.filter(x -> x > 0).map(x -> x * 2)', description: 'Lazily filters matching items and transforms each element.' },
                    { construct: 'Flatten Nested', syntax: 'lists.stream().flatMap(Collection::stream)', description: 'Flattens a stream of collections into a single stream.' },
                    { construct: 'Group By Key', syntax: 'Collectors.groupingBy(fn, Collectors.counting())', description: 'Groups elements into a Map with downstream aggregation.' },
                    { construct: 'Primitive Summary', syntax: 'list.stream().mapToInt(Item::price).summaryStatistics()', description: 'Computes count, sum, min, average, and max in one pass.' }
                ],
                examples: [
                    {
                        title: 'Word Frequency Histogram Using Streams & Collectors.groupingBy',
                        code: `import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

public class StreamHistogram {
    public static void main(String[] args) {
        List<String> tags = List.of("java", "dsa", "java", "streams", "dsa", "java");

        Map<String, Long> counts = tags.stream()
            .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));

        System.out.println("Frequency map: " + counts);
    }
}`,
                        output: `Frequency map: {Java=3, dsa=2, streams=1}`,
                        explanation: 'Collectors.groupingBy paired with Collectors.counting() builds a frequency histogram declaratively.'
                    }
                ],
                problems: [
                    {
                        title: 'Partition & Aggregate Orders Using Java Streams',
                        difficulty: 'Easy',
                        statement: 'Given a list of Order(String id, String status, double amount) records, use a Stream pipeline to compute the total revenue of all "COMPLETED" orders.',
                        sampleInput: '3 orders: (COMPLETED, 450.0), (CANCELLED, 200.0), (COMPLETED, 550.0)',
                        sampleOutput: '1000.0',
                        constraints: 'Use mapToDouble().sum()',
                        hint: 'orders.stream().filter(o -> "COMPLETED".equals(o.status())).mapToDouble(Order::amount).sum();'
                    },
                    {
                        title: 'Top 3 Highest-Scoring Students Across Nested Batches',
                        difficulty: 'Medium',
                        statement: 'Given a List<List<Student>> representing multiple batches, use flatMap and sorted to extract the names of the top 3 students with score >= 75.',
                        sampleInput: '2 batches of students',
                        sampleOutput: '["Aarav", "Diya", "Rohan"]',
                        constraints: 'Single stream pipeline',
                        hint: 'batches.stream().flatMap(List::stream).filter(s -> s.score() >= 75).sorted(Comparator.comparingInt(Student::score).reversed()).limit(3).map(Student::name).toList();'
                    }
                ]
            },
            {
                chapterNumber: 10,
                title: 'Multithreading, ExecutorService, CompletableFuture & Graphs',
                duration: '18 min read',
                difficulty: 'Advanced',
                summary: 'Write thread-safe concurrent Java systems using ExecutorService, CompletableFuture, ConcurrentHashMap, AtomicInteger, and Graph BFS/DFS.',
                overview: `Java was built from day one with a formal Memory Model (JMM) for multithreaded concurrency. Instead of spawning raw OS threads manually with new Thread(), production Java systems submit tasks (Runnable or Callable<V>) to a managed thread pool via ExecutorService (or Java 21+ Virtual Threads Executors.newVirtualThreadPerTaskExecutor()).

For thread-safe shared state without heavy synchronized lock contention, java.util.concurrent provides lock-free atomic primitives (AtomicInteger, AtomicLong using CPU CAS instructions), ConcurrentHashMap, and non-blocking async pipelines via CompletableFuture.`,
                keyPoints: [
                    'volatile guarantees visibility of variable writes across CPU caches, but does NOT make compound actions (count++) atomic—use AtomicInteger.incrementAndGet().',
                    'ConcurrentHashMap uses fine-grained bucket-level locking and CAS operations instead of locking the entire table.',
                    'CompletableFuture.supplyAsync(...).thenApply(...).exceptionally(...) composes non-blocking async I/O workflows.',
                    'Always shut down thread pools cleanly using executor.shutdown() (or try-with-resources in Java 19+).'
                ],
                diagramTitle: 'Java Concurrency & CompletableFuture Async Pipeline',
                diagramSteps: [
                    'Task Submission (Callable / Runnable)',
                    'ExecutorService Thread Pool / Virtual Threads',
                    'CompletableFuture.supplyAsync() Non-Blocking',
                    'Shared State: ConcurrentHashMap & CAS Atomics',
                    'thenCombine / allOf -> Result Aggregation'
                ],
                graphTitle: 'Concurrent Map Throughput Under 16-Thread Contention',
                graphMetricLabel: 'Operations Per Microsecond (Higher is faster)',
                graphData: [
                    { label: 'ConcurrentHashMap (Fine-Grained + CAS)', value: 96, displayValue: '48 ops/µs', note: 'Lock-free reads, per-bin locks' },
                    { label: 'ReadWriteLock Guarded Map', value: 54, displayValue: '22 ops/µs', note: 'Concurrent readers, exclusive writer' },
                    { label: 'Collections.synchronizedMap / Hashtable', value: 14, displayValue: '4.5 ops/µs', note: 'Single global mutex bottleneck' }
                ],
                syntaxSummaryCode: `import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

public class ConcurrencyDemo {
    private static final AtomicInteger requestCount = new AtomicInteger(0);

    public static void main(String[] args) throws Exception {
        ExecutorService pool = Executors.newFixedThreadPool(4);
        try {
            CompletableFuture<Integer> f1 = CompletableFuture.supplyAsync(() -> {
                requestCount.incrementAndGet();
                return 40;
            }, pool);

            CompletableFuture<Integer> f2 = CompletableFuture.supplyAsync(() -> {
                requestCount.incrementAndGet();
                return 60;
            }, pool);

            int combined = f1.thenCombine(f2, Integer::sum).get();
            System.out.println("Combined=" + combined + " | Calls=" + requestCount.get());
        } finally {
            pool.shutdown();
        }
    }
}`,
                syntaxTable: [
                    { construct: 'Atomic CAS Increment', syntax: 'atomicInt.incrementAndGet()', description: 'Lock-free hardware Compare-And-Swap increment.' },
                    { construct: 'Async Task Pipeline', syntax: 'CompletableFuture.supplyAsync(() -> compute())', description: 'Runs supplier asynchronously and returns a composable future.' },
                    { construct: 'Combine Futures', syntax: 'f1.thenCombine(f2, (a, b) -> a + b)', description: 'Joins results of two parallel futures when both complete.' },
                    { construct: 'Concurrent Map', syntax: 'new ConcurrentHashMap<K, V>()', description: 'High-concurrency thread-safe hash map.' }
                ],
                examples: [
                    {
                        title: 'Topological Sort (Kahn BFS Algorithm) for Course Prerequisites',
                        code: `import java.util.*;

public class CourseSchedule {
    public static int[] findOrder(int numCourses, int[][] prerequisites) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());
        int[] indegree = new int[numCourses];

        for (int[] pre : prerequisites) {
            adj.get(pre[1]).add(pre[0]);
            indegree[pre[0]]++;
        }

        Deque<Integer> q = new ArrayDeque<>();
        for (int i = 0; i < numCourses; i++) {
            if (indegree[i] == 0) q.offer(i);
        }

        int[] order = new int[numCourses];
        int idx = 0;
        while (!q.isEmpty()) {
            int curr = q.poll();
            order[idx++] = curr;
            for (int next : adj.get(curr)) {
                if (--indegree[next] == 0) q.offer(next);
            }
        }
        return (idx == numCourses) ? order : new int[0];
    }

    public static void main(String[] args) {
        int[][] prereq = {{1,0},{2,0},{3,1},{3,2}};
        System.out.println(Arrays.toString(findOrder(4, prereq)));
    }
}`,
                        output: `[0, 1, 2, 3]`,
                        explanation: 'Kahn BFS processes vertices with in-degree 0 using an ArrayDeque in O(V + E) time and detects dependency cycles if idx < numCourses.'
                    }
                ],
                problems: [
                    {
                        title: 'Number of Islands in a 2D Grid (BFS / DFS)',
                        difficulty: 'Medium',
                        statement: 'Given an m x n 2D binary grid of "1"s (land) and "0"s (water), return the number of connected islands.',
                        sampleInput: 'grid = [["1","1","0"],["1","0","0"],["0","0","1"]]',
                        sampleOutput: '2',
                        constraints: '1 <= m, n <= 300',
                        hint: 'Scan each cell: when grid[r][c] == "1", increment islandCount and run DFS/BFS to sink all connected "1"s to "0".'
                    },
                    {
                        title: 'Thread-Safe Rate Limiter Token Bucket',
                        difficulty: 'Medium',
                        statement: 'Implement a thread-safe TokenBucket class using synchronized or AtomicLong that refills tokens at rate R per second up to capacity C and returns true from tryConsume() if a token is available.',
                        sampleInput: 'Capacity=5, consume 5 times -> true, 6th immediate call -> false',
                        sampleOutput: '5 allowed, 1 throttled',
                        constraints: 'Must be safe under concurrent threads',
                        hint: 'Track availableTokens and lastRefillTimestamp inside a synchronized method, refilling based on elapsed nanoseconds.'
                    }
                ]
            }
        ]
    }
];
