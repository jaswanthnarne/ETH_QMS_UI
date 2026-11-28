import {
    ALGOPLAY_CATEGORIES,
    BIG_O_REFERENCE_TABLE,
    SORTING_COMPARISON_TABLE,
    PART_ONE_TOPICS,
    PART_TWO_TOPICS
} from './algoPlayCatalogPart2.js';

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
        question: `What is the worst-case time complexity of ${name}?`,
        difficulty: 'Easy',
        options: [worst, best === worst ? 'O(1)' : best, 'O(2ⁿ)', 'O(n!)'],
        correctIndex: 0,
        explanation: `In the worst-case scenario, ${name} runs in ${worst} time and ${space} auxiliary space.`
    },
    {
        question: `What is the auxiliary space complexity of ${name} during execution?`,
        difficulty: 'Medium',
        options: [space, space === 'O(1)' ? 'O(V + E)' : 'O(1)', 'O(n³)', 'O(n!)'],
        correctIndex: 0,
        explanation: `${name} requires ${space} auxiliary memory overhead.`
    },
    {
        question: `When stepping through ${name} in AlgoPlay, what happens when the Previous Step button is clicked?`,
        difficulty: 'Hard',
        options: [
            `Restores the exact deterministic snapshot of ${name} (visited nodes, active pointers, and metrics) at step k - 1`,
            'Clears the data structure to empty',
            'Re-randomizes the graph edge weights',
            'Skips forward to the final result'
        ],
        correctIndex: 0,
        explanation: `AlgoPlay stores every execution frame as an immutable snapshot so Previous Step restores step k - 1 deterministically.`
    }
];

const PART_THREE_RAW = [
    /* =========================================================================
       6. TREE ALGORITHMS (7)
       ========================================================================= */
    {
        slug: 'tree-traversals',
        name: 'Tree Traversals (Inorder, Preorder, Postorder)',
        category: 'trees',
        categoryLabel: 'Tree Algorithms',
        engineType: 'tree',
        subVariant: 'traversals',
        difficulty: 'Beginner',
        sequenceOrder: 39,
        isRecommended: true,
        shortDescription: 'Depth-First recursive visits: Inorder (L-Root-R), Preorder (Root-L-R), and Postorder (L-R-Root).',
        overview: {
            whatItIs: 'Depth-First Tree Traversals visit every node of a binary tree in a deterministic recursive order: Inorder (Left, Root, Right), Preorder (Root, Left, Right), or Postorder (Left, Right, Root).',
            whyUsed: 'Inorder traversal on a BST yields keys in sorted order; Preorder clones/serializes tree structure; Postorder evaluates bottom-up expressions and deallocates subtrees.',
            howItStores: 'Uses the recursive call stack (height O(h)) to backtrack from leaves to ancestors.',
            realWorldApplications: ['Expression tree evaluation (Postorder)', 'AST serialization (Preorder)', 'Sorted BST iteration (Inorder)'],
            advantages: ['Visits every node in strict O(n) time', 'Three natural visit orders from the same recursive skeleton'],
            limitations: ['Requires O(h) recursion stack space (unless Morris Traversal is used)'],
            whenToUse: 'Use whenever every node in a tree must be processed systematically.'
        },
        complexity: {
            bestTime: 'O(n)',
            averageTime: 'O(n)',
            worstTime: 'O(n)',
            space: 'O(h) Stack',
            inPlace: false,
            stable: true,
            simpleExplanation: 'Visits every node exactly once, taking O(n) time and O(h) call stack frames.'
        },
        pseudocode: [
            '1. If node == NULL -> return to parent frame',
            '2. PREORDER: visit(node) before recursing Left and Right',
            '3. Recurse on Left Subtree: traverse(node.left)',
            '4. INORDER: visit(node) between Left and Right subtrees',
            '5. Recurse on Right Subtree: traverse(node.right); POSTORDER: visit(node)'
        ]
    },
    {
        slug: 'bst-insertion-deletion',
        name: 'BST Insertion & Deletion',
        category: 'trees',
        categoryLabel: 'Tree Algorithms',
        engineType: 'tree',
        subVariant: 'bst',
        difficulty: 'Intermediate',
        sequenceOrder: 40,
        isRecommended: true,
        shortDescription: 'Animated Binary Search Tree insertion and 3-case node deletion (Leaf, 1 Child, 2 Children Inorder Successor).',
        overview: {
            whatItIs: 'BST Insertion walks down the tree comparing keys to attach a new leaf, while BST Deletion handles three distinct structural cases (0 children, 1 child, or 2 children replaced by the Inorder Successor).',
            whyUsed: 'Maintains the sorted BST invariant dynamically under arbitrary insertions and removals.',
            howItStores: 'Updates left and right child links in O(h) time.',
            realWorldApplications: ['Dynamic ordered symbol tables', 'Interval scheduling trees'],
            advantages: ['O(log n) average mutation time while preserving sorted Inorder sequence'],
            limitations: ['Unbalanced insertions can increase height h toward O(n)'],
            whenToUse: 'Use to insert and delete ordered keys dynamically.'
        },
        complexity: {
            bestTime: 'O(log n)',
            averageTime: 'O(log n)',
            worstTime: 'O(n)',
            space: 'O(h)',
            inPlace: true,
            stable: true,
            simpleExplanation: 'Follows root-to-leaf comparison path; 2-child deletion swaps with the smallest node in the right subtree.'
        },
        pseudocode: [
            '1. Compare key with node.val to walk Left (<) or Right (>)',
            '2. INSERT: attach new node when NULL link is reached',
            '3. DELETE Case 1 (Leaf): unlink leaf directly',
            '4. DELETE Case 2 (1 Child): bypass node to its single child',
            '5. DELETE Case 3 (2 Children): copy Inorder Successor (min of right) and delete successor'
        ]
    },
    {
        slug: 'avl-rotations',
        name: 'AVL Tree Rotations (LL, RR, LR, RL)',
        category: 'trees',
        categoryLabel: 'Tree Algorithms',
        engineType: 'tree',
        subVariant: 'avl',
        difficulty: 'Advanced',
        sequenceOrder: 41,
        isRecommended: true,
        shortDescription: 'Step-by-step visualization of Balance Factors (BF = hL - hR) and Left, Right, Left-Right, and Right-Left rotations.',
        overview: {
            whatItIs: 'AVL Rotations are local O(1) pointer restructuring operations (Left Rotation, Right Rotation, Left-Right, Right-Left) that restore |Balance Factor| <= 1 while preserving the BST Inorder sequence.',
            whyUsed: 'Prevents a BST from ever becoming skewed, locking tree height at <= 1.44 log2(n).',
            howItStores: 'Rewires 2–3 parent/child links and updates node heights in O(1) per rotation.',
            realWorldApplications: ['Self-balancing database index trees', 'Deterministic real-time lookup engines'],
            advantages: ['O(1) per rotation', 'Guarantees strict O(log n) worst-case height'],
            limitations: ['Requires tracking height on every node'],
            whenToUse: 'Use whenever an unbalanced BST ancestor reaches Balance Factor +2 or -2.'
        },
        complexity: {
            bestTime: 'O(1) Rotation',
            averageTime: 'O(log n) Path',
            worstTime: 'O(log n)',
            space: 'O(log n)',
            inPlace: true,
            stable: true,
            simpleExplanation: 'BF = +2 (Left-Heavy) triggers Right or Left-Right rotation; BF = -2 (Right-Heavy) triggers Left or Right-Left rotation.'
        },
        pseudocode: [
            '1. After insert/delete, unwind recursion stack updating height(u)',
            '2. Compute Balance Factor BF(u) = height(u.left) - height(u.right)',
            '3. LL Case (BF > 1 & key < u.left.val): RightRotate(u)',
            '4. RR Case (BF < -1 & key > u.right.val): LeftRotate(u)',
            '5. LR / RL Cases: rotate child first, then rotate u'
        ]
    },
    {
        slug: 'heap-insertion-deletion',
        name: 'Heap Insertion & Deletion (Sift-Up / Sift-Down)',
        category: 'trees',
        categoryLabel: 'Tree Algorithms',
        engineType: 'tree',
        subVariant: 'heap',
        difficulty: 'Intermediate',
        sequenceOrder: 42,
        isRecommended: false,
        shortDescription: 'Dual Tree + Array visualization of Sift-Up (Insert) and Sift-Down (Extract Min/Max) in a Binary Heap.',
        overview: {
            whatItIs: 'Heap Insertion appends a new leaf at the end of the complete binary tree and Sifts Up; Heap Extraction removes the root, moves the last leaf to the root, and Sifts Down.',
            whyUsed: 'Maintains the Min-Heap or Max-Heap order in O(log n) swaps inside a flat array.',
            howItStores: 'Simultaneously visualized as a binary tree and a contiguous array [0..n-1].',
            realWorldApplications: ['PriorityQueue.offer() and PriorityQueue.poll()', 'Event-driven simulation timers'],
            advantages: ['Strict O(log n) insert and extract', 'Zero dynamic node allocations'],
            limitations: ['Only the root extremal element is accessible in O(1)'],
            whenToUse: 'Use for priority queue push and pop operations.'
        },
        complexity: {
            bestTime: 'O(1)',
            averageTime: 'O(log n)',
            worstTime: 'O(log n)',
            space: 'O(1)',
            inPlace: true,
            stable: false,
            simpleExplanation: 'Swaps along a single root-to-leaf path of length at most log2(n).'
        },
        pseudocode: [
            '1. INSERT(x): place x at leaf index i = size; increment size',
            '2. While i > 0 and heap[i] < heap[parent(i)]: swap(i, parent(i)); i = parent(i)',
            '3. EXTRACT(): save root = heap[0]; move heap[size-1] to heap[0]; decrement size',
            '4. While node i has a smaller child c in {2i+1, 2i+2}: swap(i, c); i = c'
        ]
    },
    {
        slug: 'lowest-common-ancestor',
        name: 'Lowest Common Ancestor (LCA)',
        category: 'trees',
        categoryLabel: 'Tree Algorithms',
        engineType: 'tree',
        subVariant: 'lca',
        difficulty: 'Intermediate',
        sequenceOrder: 43,
        isRecommended: false,
        shortDescription: 'Finds the deepest shared ancestor node of two query nodes (p, q) in a Binary Tree or BST.',
        overview: {
            whatItIs: 'The Lowest Common Ancestor (LCA) of two nodes p and q is the deepest node in the tree that has both p and q as descendants (where a node can be a descendant of itself).',
            whyUsed: 'Computes shortest distance between two tree nodes dist(p, q) = depth(p) + depth(q) - 2*depth(LCA).',
            howItStores: 'Highlights the root-to-p path and root-to-q path until their last shared split node.',
            realWorldApplications: ['Git merge-base commit resolution', 'DOM closest common container lookup', 'Phylogenetic evolutionary trees'],
            advantages: ['O(log n) on a BST using split-point comparison, O(n) on general Binary Trees'],
            limitations: ['Requires both target nodes to exist in the tree'],
            whenToUse: 'Use to find the shared hierarchical ancestor or distance between two tree nodes.'
        },
        complexity: {
            bestTime: 'O(log n) BST',
            averageTime: 'O(log n)',
            worstTime: 'O(n) Binary Tree',
            space: 'O(h)',
            inPlace: true,
            stable: true,
            simpleExplanation: 'In a BST, the first node whose value lies between [min(p,q), max(p,q)] is the Lowest Common Ancestor!'
        },
        pseudocode: [
            '1. Start at cur = root with targets p and q',
            '2. If p < cur.val and q < cur.val -> both lie in Left subtree (cur = cur.left)',
            '3. If p > cur.val and q > cur.val -> both lie in Right subtree (cur = cur.right)',
            '4. Else split point reached -> cur is the Lowest Common Ancestor (LCA)!'
        ]
    },
    {
        slug: 'tree-height-calculation',
        name: 'Tree Height & Depth Calculation',
        category: 'trees',
        categoryLabel: 'Tree Algorithms',
        engineType: 'tree',
        subVariant: 'height',
        difficulty: 'Beginner',
        sequenceOrder: 44,
        isRecommended: false,
        shortDescription: 'Bottom-up postorder recursion computing height(u) = 1 + max(height(u.left), height(u.right)) for every node.',
        overview: {
            whatItIs: 'The height of a tree node is the number of edges (or nodes) on the longest downward path from that node to a leaf.',
            whyUsed: 'Determines tree balance factors, worst-case lookup latency, and tree diameter.',
            howItStores: 'Propagates subtree heights bottom-up from leaves (height 1) to the root.',
            realWorldApplications: ['AVL balance factor verification', 'Tree diameter & maximum depth queries'],
            advantages: ['Computes heights of all n nodes in a single O(n) postorder pass'],
            limitations: ['Uses O(h) recursion stack'],
            whenToUse: 'Use to measure tree depth, balance, or longest root-to-leaf path.'
        },
        complexity: {
            bestTime: 'O(n)',
            averageTime: 'O(n)',
            worstTime: 'O(n)',
            space: 'O(h)',
            inPlace: true,
            stable: true,
            simpleExplanation: 'Every node asks its left and right child for their height, takes the maximum, and adds 1.'
        },
        pseudocode: [
            '1. Base Case: if node == NULL -> return height 0',
            '2. Compute leftH = getHeight(node.left)',
            '3. Compute rightH = getHeight(node.right)',
            '4. Set node.height = 1 + max(leftH, rightH)',
            '5. Return node.height to parent'
        ]
    },
    {
        slug: 'level-order-traversal',
        name: 'Level-Order Traversal (Tree BFS)',
        category: 'trees',
        categoryLabel: 'Tree Algorithms',
        engineType: 'tree',
        subVariant: 'level-order',
        difficulty: 'Beginner',
        sequenceOrder: 45,
        isRecommended: true,
        shortDescription: 'Breadth-First tree traversal using a FIFO Queue to visit nodes level-by-level from top to bottom, left to right.',
        overview: {
            whatItIs: 'Level-Order Traversal visits nodes breadth-first (depth 0 root, then all depth 1 nodes, then depth 2 nodes) using a FIFO Queue.',
            whyUsed: 'Finds minimum depth, right-side tree views, level averages, and serializes complete binary trees.',
            howItStores: 'Pushes root into a FIFO Queue; as each node is dequeued, its non-null left and right children are enqueued.',
            realWorldApplications: ['Tree serialization & deserialization', 'Finding shortest path to nearest leaf', 'Organizational hierarchy level reporting'],
            advantages: ['Visits nodes strictly in increasing order of depth from root', 'Iterative O(n) without recursion stack overflow'],
            limitations: ['Queue holds up to O(w) nodes where w <= n/2 is maximum tree width'],
            whenToUse: 'Use whenever tree nodes must be grouped or processed by horizontal depth level.'
        },
        complexity: {
            bestTime: 'O(n)',
            averageTime: 'O(n)',
            worstTime: 'O(n)',
            space: 'O(w) Queue',
            inPlace: false,
            stable: true,
            simpleExplanation: 'Uses a FIFO Queue: pop front node, record it, and push its left and right children to the back of the queue.'
        },
        pseudocode: [
            '1. Initialize FIFO Queue Q = [root]',
            '2. While Q is not empty:',
            '3.   Dequeue front node u = Q.dequeue()',
            '4.   Visit and highlight u',
            '5.   If u.left != NULL -> Q.enqueue(u.left); if u.right != NULL -> Q.enqueue(u.right)'
        ]
    },

    /* =========================================================================
       7. GRAPH ALGORITHMS (10)
       ========================================================================= */
    {
        slug: 'breadth-first-search',
        name: 'Breadth-First Search (BFS)',
        category: 'graphs',
        categoryLabel: 'Graph Algorithms',
        engineType: 'graph',
        subVariant: 'bfs',
        difficulty: 'Beginner',
        sequenceOrder: 46,
        isRecommended: true,
        shortDescription: 'Explores a graph in concentric ripple layers using a FIFO Queue, finding unweighted shortest paths in O(V + E).',
        overview: {
            whatItIs: 'Breadth-First Search (BFS) explores all neighbor vertices at distance d from the source before moving to vertices at distance d + 1.',
            whyUsed: 'Guarantees finding the shortest path (minimum number of edges) in any unweighted graph in O(V + E) time.',
            howItStores: 'Maintains a visited[] boolean set, a FIFO Queue, and a parent[]/dist[] table.',
            realWorldApplications: ['Shortest path in unweighted mazes & grids', 'Social network 1st/2nd/3rd degree connections', 'Web crawlers', 'Network broadcast routing'],
            advantages: ['Finds guaranteed minimum-hop shortest path', 'Linear O(V + E) time complexity'],
            limitations: ['Does not account for varying positive/negative edge weights (use Dijkstra or Bellman-Ford for weighted graphs)'],
            whenToUse: 'Use for shortest paths on unweighted graphs and level-by-level expansion.'
        },
        complexity: {
            bestTime: 'O(V + E)',
            averageTime: 'O(V + E)',
            worstTime: 'O(V + E)',
            space: 'O(V) Queue',
            inPlace: false,
            stable: true,
            simpleExplanation: 'Enqueues source, marks visited immediately on enqueue, and expands neighbors ring-by-ring.'
        },
        pseudocode: [
            '1. Mark source s as visited; dist[s] = 0; enqueue s into FIFO Queue Q',
            '2. While Q is not empty:',
            '3.   Dequeue u = Q.popFront()',
            '4.   For each neighbor v in adj[u]:',
            '5.     If v is not visited: mark v visited; dist[v] = dist[u] + 1; Q.pushBack(v)'
        ]
    },
    {
        slug: 'depth-first-search',
        name: 'Depth-First Search (DFS)',
        category: 'graphs',
        categoryLabel: 'Graph Algorithms',
        engineType: 'graph',
        subVariant: 'dfs',
        difficulty: 'Beginner',
        sequenceOrder: 47,
        isRecommended: true,
        shortDescription: 'Plunges as deep as possible along each branch using a Stack / Recursion before backtracking in O(V + E).',
        overview: {
            whatItIs: 'Depth-First Search (DFS) explores a branch all the way to a dead end before backtracking to explore alternative branches.',
            whyUsed: 'Foundation for cycle detection, topological sorting, connected components, bridges/articulation points, and maze solving.',
            howItStores: 'Uses a LIFO Stack (or call-stack recursion) and a visited[] set.',
            realWorldApplications: ['Cycle detection & deadlock analysis', 'Topological sorting of build dependencies', 'Strongly Connected Components (Tarjan / Kosaraju)'],
            advantages: ['O(V + E) time', 'Classifies edges into Tree, Back, Forward, and Cross edges'],
            limitations: ['Does not guarantee shortest path between two vertices'],
            whenToUse: 'Use for connectivity, cycle detection, topological ordering, and exhaustive path exploration.'
        },
        complexity: {
            bestTime: 'O(V + E)',
            averageTime: 'O(V + E)',
            worstTime: 'O(V + E)',
            space: 'O(V) Stack',
            inPlace: false,
            stable: true,
            simpleExplanation: 'Pushes vertices onto a LIFO Stack, diving deep into unvisited neighbors and backtracking when all neighbors are visited.'
        },
        pseudocode: [
            '1. Push start vertex s onto LIFO Stack (or invoke recursive DFS(s))',
            '2. Mark current vertex u as visited and record in traversal order',
            '3. For each neighbor v in adj[u]:',
            '4.   If v is unvisited -> recursively explore DFS(v)',
            '5. Backtrack to parent vertex when all neighbors of u are explored'
        ]
    },
    {
        slug: 'dijkstra-algorithm',
        name: "Dijkstra's Shortest Path Algorithm",
        category: 'graphs',
        categoryLabel: 'Graph Algorithms',
        engineType: 'graph',
        subVariant: 'dijkstra',
        difficulty: 'Intermediate',
        sequenceOrder: 48,
        isRecommended: true,
        shortDescription: 'Greedy single-source shortest path algorithm for non-negative weighted graphs using edge relaxation and a Min-Heap.',
        overview: {
            whatItIs: "Dijkstra's Algorithm finds the shortest weighted paths from a starting source vertex to all other vertices in a graph with non-negative edge weights.",
            whyUsed: 'Greedily settles the closest unsettled vertex u from a Min-Heap Priority Queue and relaxes all outgoing edges (u, v, w) via dist[v] = min(dist[v], dist[u] + w).',
            howItStores: 'Maintains dist[] array initialized to ∞ (dist[src] = 0), parent[] tree, and a Min-Priority Queue.',
            realWorldApplications: ['GPS road navigation (Google Maps)', 'OSPF network packet routing protocol', 'Flight itinerary cost minimization'],
            advantages: ['Fast O((V + E) log V) execution with a binary heap', 'Computes optimal shortest-path tree from source'],
            limitations: ['CANNOT be used on graphs with negative edge weights (AlgoPlay blocks negative weights for Dijkstra!)'],
            whenToUse: 'Use for single-source shortest paths when all edge weights are >= 0.'
        },
        complexity: {
            bestTime: 'O(E + V log V)',
            averageTime: 'O((V + E) log V)',
            worstTime: 'O((V + E) log V)',
            space: 'O(V)',
            inPlace: false,
            stable: true,
            simpleExplanation: 'Always picks the unvisited vertex with the smallest known distance from the Min-Heap and relaxes its outgoing edges.'
        },
        pseudocode: [
            '1. Verify all edge weights >= 0; init dist[v] = ∞, dist[src] = 0',
            '2. Push (0, src) into Min-Priority Queue PQ',
            '3. While PQ not empty: pop vertex u with minimum dist[u]',
            '4. For each outgoing edge (u -> v) with weight w:',
            '5.   RELAX: if dist[u] + w < dist[v] -> dist[v] = dist[u] + w; parent[v] = u; push (dist[v], v)'
        ]
    },
    {
        slug: 'bellman-ford-algorithm',
        name: 'Bellman-Ford Algorithm',
        category: 'graphs',
        categoryLabel: 'Graph Algorithms',
        engineType: 'graph',
        subVariant: 'bellman-ford',
        difficulty: 'Intermediate',
        sequenceOrder: 49,
        isRecommended: false,
        shortDescription: 'Relaxes all E edges across V - 1 iterations to compute single-source shortest paths with negative weights and detect negative cycles.',
        overview: {
            whatItIs: 'The Bellman-Ford Algorithm computes single-source shortest paths in weighted graphs that may contain negative edge weights by relaxing all E edges V - 1 times.',
            whyUsed: 'Handles negative edge weights safely and detects reachable Negative-Weight Cycles on the V-th pass.',
            howItStores: 'Maintains dist[0..V-1] and parent[0..V-1] arrays updated across V - 1 relaxation rounds.',
            realWorldApplications: ['Currency arbitrage detection in financial markets', 'RIP (Routing Information Protocol) distance-vector routing'],
            advantages: ['Works with negative edge weights', 'Detects negative-weight cycles deterministically'],
            limitations: ['O(V * E) time is slower than Dijkstra O((V + E) log V)'],
            whenToUse: 'Use when a graph has negative edge weights or when detecting negative cycles.'
        },
        complexity: {
            bestTime: 'O(E)',
            averageTime: 'O(V * E)',
            worstTime: 'O(V * E)',
            space: 'O(V)',
            inPlace: false,
            stable: true,
            simpleExplanation: 'Since any simple shortest path has at most V - 1 edges, relaxing all edges V - 1 times guarantees optimal distances.'
        },
        pseudocode: [
            '1. Initialize dist[v] = ∞ for all vertices; dist[src] = 0',
            '2. Repeat for pass i = 1 to V - 1:',
            '3.   For each edge (u -> v, weight w) in E:',
            '4.     If dist[u] + w < dist[v] -> dist[v] = dist[u] + w; parent[v] = u',
            '5. Pass V Check: if any edge can still be relaxed -> Negative Cycle Detected!'
        ]
    },
    {
        slug: 'floyd-warshall-algorithm',
        name: 'Floyd-Warshall Algorithm',
        category: 'graphs',
        categoryLabel: 'Graph Algorithms',
        engineType: 'graph',
        subVariant: 'floyd-warshall',
        difficulty: 'Advanced',
        sequenceOrder: 50,
        isRecommended: false,
        shortDescription: 'All-Pairs Shortest Path dynamic programming algorithm updating dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]) in O(V³).',
        overview: {
            whatItIs: 'Floyd-Warshall is an All-Pairs Shortest Path (APSP) dynamic programming algorithm that finds the shortest distance between EVERY pair of vertices (i, j) simultaneously.',
            whyUsed: 'Considers each vertex k in 0..V-1 as an intermediate stepping stone between i and j in a concise 3-nested loop.',
            howItStores: 'Updates a V×V distance matrix dist[i][j] in-place.',
            realWorldApplications: ['Transitive closure of directed graphs (Warshall)', 'Dense network routing tables between all data centers'],
            advantages: ['Computes shortest paths between ALL V² vertex pairs in 5 lines of code', 'Handles negative edges'],
            limitations: ['O(V³) cubic time limits it to graphs with V <= 400'],
            whenToUse: 'Use when shortest distances between all pairs of vertices are needed on a dense graph.'
        },
        complexity: {
            bestTime: 'O(V³)',
            averageTime: 'O(V³)',
            worstTime: 'O(V³)',
            space: 'O(V²)',
            inPlace: true,
            stable: true,
            simpleExplanation: 'For each intermediate vertex k, checks if going i -> k -> j is shorter than the current best i -> j distance.'
        },
        pseudocode: [
            '1. Initialize V×V matrix dist[i][j] = weight(i, j) (0 on diagonal, ∞ if no edge)',
            '2. For intermediate vertex k = 0 to V - 1:',
            '3.   For source vertex i = 0 to V - 1:',
            '4.     For destination vertex j = 0 to V - 1:',
            '5.       dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])'
        ]
    },
    {
        slug: 'prims-algorithm',
        name: "Prim's Minimum Spanning Tree (MST)",
        category: 'graphs',
        categoryLabel: 'Graph Algorithms',
        engineType: 'graph',
        subVariant: 'prim',
        difficulty: 'Intermediate',
        sequenceOrder: 51,
        isRecommended: true,
        shortDescription: 'Greedily grows a Minimum Spanning Tree from a starting vertex by always adding the cheapest cross-cut edge.',
        overview: {
            whatItIs: "Prim's Algorithm builds a Minimum Spanning Tree (MST) connecting all V vertices with minimum total edge weight by growing a single tree one vertex at a time.",
            whyUsed: 'At each step, selects the minimum-weight edge connecting a vertex already in the MST to a vertex outside the MST.',
            howItStores: 'Tracks inMST[] visited set, key[] minimum edge costs, and a Min-Priority Queue of frontier edges.',
            realWorldApplications: ['Fiber-optic & electrical power grid layout design', 'Cluster analysis & circuit board wiring'],
            advantages: ['Optimal on dense graphs', 'Grows a single connected tree continuously'],
            limitations: ['Requires a connected undirected graph for a full spanning tree'],
            whenToUse: 'Use to connect all nodes in an undirected weighted network at minimum total cable/edge cost.'
        },
        complexity: {
            bestTime: 'O(E log V)',
            averageTime: 'O(E log V)',
            worstTime: 'O(E log V)',
            space: 'O(V)',
            inPlace: false,
            stable: true,
            simpleExplanation: 'Starts at one vertex and repeatedly annexes the nearest unvisited neighbor via the cheapest connecting edge.'
        },
        pseudocode: [
            '1. Start with MST set = {startVertex}; push all outgoing edges of startVertex into Min-Heap',
            '2. While MST has < V vertices and Min-Heap not empty:',
            '3.   Pop minimum-weight edge (u, v, w) from Min-Heap',
            '4.   If v is already in MST -> skip',
            '5.   Add v to MST, include edge (u, v, w) in MST total cost, and push edges of v'
        ]
    },
    {
        slug: 'kruskals-algorithm',
        name: "Kruskal's Minimum Spanning Tree (MST)",
        category: 'graphs',
        categoryLabel: 'Graph Algorithms',
        engineType: 'graph',
        subVariant: 'kruskal',
        difficulty: 'Intermediate',
        sequenceOrder: 52,
        isRecommended: true,
        shortDescription: 'Sorts all edges by ascending weight and greedily adds edges that do not form a cycle using Disjoint Set Union (DSU).',
        overview: {
            whatItIs: "Kruskal's Algorithm builds a Minimum Spanning Tree (or Minimum Spanning Forest) by sorting all E edges by weight from smallest to largest and adding each edge if its endpoints belong to different DSU components.",
            whyUsed: 'Extremely clean edge-centric greedy algorithm that naturally produces a Minimum Spanning Forest even on disconnected graphs.',
            howItStores: 'Sorts edge list E and uses a Disjoint Set Union (Find + Union) structure to reject cycle-forming edges in O(α(V)).',
            realWorldApplications: ['Telecom network backbone design', 'Single-linkage hierarchical clustering'],
            advantages: ['Fast O(E log E) on sparse graphs', 'Demonstrates Disjoint Set Union in action'],
            limitations: ['Requires sorting all E edges upfront'],
            whenToUse: 'Use for Minimum Spanning Trees on sparse graphs when an edge list is readily available.'
        },
        complexity: {
            bestTime: 'O(E log E)',
            averageTime: 'O(E log E)',
            worstTime: 'O(E log E)',
            space: 'O(V + E)',
            inPlace: false,
            stable: true,
            simpleExplanation: 'Sorts all edges cheapest-first; accepts an edge if Union-Find says its two endpoints are not already connected.'
        },
        pseudocode: [
            '1. Sort all edges E in ascending order of weight w',
            '2. Initialize Disjoint Set Union (DSU) with V isolated vertices',
            '3. For each sorted edge (u, v, w):',
            '4.   If DSU.find(u) != DSU.find(v) (no cycle):',
            '5.     DSU.union(u, v); add edge (u, v, w) to MST'
        ]
    },
    {
        slug: 'topological-sorting',
        name: 'Topological Sorting (Kahn Indegree BFS)',
        category: 'graphs',
        categoryLabel: 'Graph Algorithms',
        engineType: 'graph',
        subVariant: 'topological',
        difficulty: 'Intermediate',
        sequenceOrder: 53,
        isRecommended: true,
        shortDescription: 'Linearly orders vertices of a Directed Acyclic Graph (DAG) such that for every directed edge u -> v, u appears before v.',
        overview: {
            whatItIs: 'Topological Sorting produces a linear dependency ordering of a Directed Acyclic Graph (DAG) where every prerequisite u is scheduled before its dependent v.',
            whyUsed: 'Kahn’s Algorithm computes in-degrees for all vertices, enqueues all vertices with in-degree 0, and peels off dependencies layer by layer.',
            howItStores: 'Maintains an indegree[0..V-1] count array and a FIFO Queue of ready (indegree == 0) vertices.',
            realWorldApplications: ['Course prerequisite scheduling', 'CI/CD & Makefile build task ordering', 'Spreadsheet formula cell recalculation order'],
            advantages: ['O(V + E) linear time', 'Automatically detects directed cycles if output count < V'],
            limitations: ['Only valid on Directed Acyclic Graphs (DAGs)'],
            whenToUse: 'Use whenever tasks with prerequisite dependencies must be scheduled in a valid linear sequence.'
        },
        complexity: {
            bestTime: 'O(V + E)',
            averageTime: 'O(V + E)',
            worstTime: 'O(V + E)',
            space: 'O(V)',
            inPlace: false,
            stable: true,
            simpleExplanation: 'Repeatedly outputs vertices with 0 remaining prerequisites and decrements the in-degree of their outgoing neighbors.'
        },
        pseudocode: [
            '1. Compute indegree[v] for all vertices v in 0..V-1',
            '2. Enqueue all vertices with indegree[v] == 0 into Queue Q',
            '3. While Q not empty: dequeue u and append u to topoOrder[]',
            '4.   For each directed edge (u -> v): decrement indegree[v]--',
            '5.     If indegree[v] == 0 -> enqueue v into Q'
        ]
    },
    {
        slug: 'cycle-detection',
        name: 'Graph Cycle Detection',
        category: 'graphs',
        categoryLabel: 'Graph Algorithms',
        engineType: 'graph',
        subVariant: 'cycle',
        difficulty: 'Intermediate',
        sequenceOrder: 54,
        isRecommended: false,
        shortDescription: 'Detects cycles in Directed graphs (3-color DFS recursion stack) and Undirected graphs (parent check / DSU).',
        overview: {
            whatItIs: 'Cycle Detection determines whether a graph contains a closed loop (a path that starts and ends at the same vertex).',
            whyUsed: 'Verifies whether a dependency graph is a valid DAG (no circular deadlocks) or whether a network contains redundant ring paths.',
            howItStores: 'Tracks 3 node states during DFS: UNVISITED (0), VISITING / ON-PATH (1), and VISITED (2).',
            realWorldApplications: ['OS deadlock detection in resource allocation graphs', 'Compiler circular import detection'],
            advantages: ['Linear O(V + E) time', 'Pinpoints the exact back-edge completing the cycle'],
            limitations: ['Rules differ between directed graphs (back-edge to active stack) and undirected graphs (edge to non-parent visited node)'],
            whenToUse: 'Use to validate acyclicity or detect deadlocks.'
        },
        complexity: {
            bestTime: 'O(V + E)',
            averageTime: 'O(V + E)',
            worstTime: 'O(V + E)',
            space: 'O(V)',
            inPlace: false,
            stable: true,
            simpleExplanation: 'During DFS, encountering an edge to a vertex already on the current active recursion path proves a cycle exists.'
        },
        pseudocode: [
            '1. Initialize state[v] = UNVISITED for all vertices',
            '2. Launch DFS(u, parent): mark state[u] = VISITING (on active path)',
            '3. For each neighbor v of u (ignoring immediate parent in undirected mode):',
            '4.   If state[v] == VISITING -> CYCLE DETECTED on back-edge (u -> v)!',
            '5. Mark state[u] = VISITED upon finishing u subtree'
        ]
    },
    {
        slug: 'connected-components',
        name: 'Connected Components',
        category: 'graphs',
        categoryLabel: 'Graph Algorithms',
        engineType: 'graph',
        subVariant: 'components',
        difficulty: 'Beginner',
        sequenceOrder: 55,
        isRecommended: false,
        shortDescription: 'Partitions a graph into maximal connected islands by launching BFS/DFS from every unvisited vertex in O(V + E).',
        overview: {
            whatItIs: 'Connected Components partitions an undirected graph into disjoint subgraphs (islands) such that every vertex within a component can reach every other vertex in that component.',
            whyUsed: 'Counts isolated network clusters, islands in a 2D grid, or user cohorts.',
            howItStores: 'Assigns a componentId (1, 2, ..., k) to each vertex during outer-loop BFS/DFS sweeps.',
            realWorldApplications: ['Counting islands in satellite imagery', 'Identifying isolated sub-networks after link failure'],
            advantages: ['Visits every vertex and edge once in O(V + E) time'],
            limitations: ['For directed graphs, Kosaraju or Tarjan SCC algorithm is required for strong connectivity'],
            whenToUse: 'Use to count and label all disjoint clusters in a graph.'
        },
        complexity: {
            bestTime: 'O(V + E)',
            averageTime: 'O(V + E)',
            worstTime: 'O(V + E)',
            space: 'O(V)',
            inPlace: false,
            stable: true,
            simpleExplanation: 'Loops through all vertices 0..V-1; whenever an unvisited vertex is found, increments componentCount and floods its entire island.'
        },
        pseudocode: [
            '1. Set componentCount = 0; mark all vertices unvisited',
            '2. For each vertex v in 0 .. V - 1:',
            '3.   If v is not visited:',
            '4.     Increment componentCount++',
            '5.     Run BFS/DFS from v to label all reachable vertices with componentCount'
        ]
    },

    /* =========================================================================
       8. RECURSION, BACKTRACKING, DP & GREEDY ALGORITHMS (11)
       ========================================================================= */
    {
        slug: 'factorial-recursion',
        name: 'Factorial (Call Stack Recursion)',
        category: 'algorithms',
        categoryLabel: 'Recursion, DP & Backtracking',
        engineType: 'recursion',
        subVariant: 'factorial',
        difficulty: 'Beginner',
        sequenceOrder: 56,
        isRecommended: true,
        shortDescription: 'Visualizes theLIFO Call Stack pushing activation frames down to base case fact(0) = 1 and unwinding return products.',
        overview: {
            whatItIs: 'Recursive Factorial computes n! = n * (n - 1)! by pushing activation records onto the call stack until hitting the base case n <= 1.',
            whyUsed: 'Clearly demonstrates the two phases of recursion: the Winding Phase (pushing stack frames) and the Unwinding Phase (multiplying return values back up).',
            howItStores: 'Allocates n + 1 stack frames holding local parameter n and return value.',
            realWorldApplications: ['Combinatorics & permutation counts', 'Taylor series expansions', 'Call stack education'],
            advantages: ['Directly mirrors mathematical recurrence n! = n * (n-1)!'],
            limitations: ['O(n) stack space compared to O(1) iterative loop'],
            whenToUse: 'Use to master call-stack frame winding and return propagation.'
        },
        complexity: {
            bestTime: 'O(n)',
            averageTime: 'O(n)',
            worstTime: 'O(n)',
            space: 'O(n) Stack',
            inPlace: false,
            stable: true,
            simpleExplanation: 'Pushes fact(n), fact(n-1), ..., fact(1) onto the Call Stack, then pops and multiplies 1 * 2 * 3 * ... * n.'
        },
        pseudocode: [
            '1. Push call frame fact(n) onto Call Stack',
            '2. BASE CASE: if n <= 1 -> return 1 and pop frame',
            '3. RECURSIVE CALL: subResult = fact(n - 1)',
            '4. UNWIND: compute result = n * subResult',
            '5. Pop frame and propagate result to caller'
        ]
    },
    {
        slug: 'fibonacci-recursion',
        name: 'Fibonacci (Recursion Tree vs DP Memoization)',
        category: 'algorithms',
        categoryLabel: 'Recursion, DP & Backtracking',
        engineType: 'recursion',
        subVariant: 'fibonacci',
        difficulty: 'Beginner',
        sequenceOrder: 57,
        isRecommended: true,
        shortDescription: 'Visualizes overlapping subproblems in the fib(n) = fib(n-1) + fib(n-2) recursion tree and DP memoization table.',
        overview: {
            whatItIs: 'The Fibonacci sequence F(n) = F(n-1) + F(n-2) (with F(0)=0, F(1)=1) is the canonical bridge between exponential recursion O(2^n) and linear Dynamic Programming O(n).',
            whyUsed: 'Shows why naive recursion recomputes F(3) and F(2) repeatedly, and how a 1D DP memoization table reduces time to O(n).',
            howItStores: 'Displays both the live Call Stack / Recursion Tree and the memo[0..n] lookup table.',
            realWorldApplications: ['Climbing Stairs & combinatorics DP', 'Golden ratio search & Fibonacci heaps'],
            advantages: ['With memoization or tabulation, runs in strict O(n) time'],
            limitations: ['Unmemoized recursion explodes in O(2^n) time'],
            whenToUse: 'Use to understand Overlapping Subproblems and Memoization.'
        },
        complexity: {
            bestTime: 'O(n) Memoized',
            averageTime: 'O(n) DP / O(2ⁿ) Naive',
            worstTime: 'O(2ⁿ) Uncached',
            space: 'O(n)',
            inPlace: false,
            stable: true,
            simpleExplanation: 'Caching fib(k) in memo[k] ensures each subproblem from 0 to n is computed only once.'
        },
        pseudocode: [
            '1. Enter fib(n); check if memo[n] is already computed',
            '2. BASE CASE: if n <= 1 -> return n',
            '3. Compute left = fib(n - 1)',
            '4. Compute right = fib(n - 2)',
            '5. Store memo[n] = left + right and return memo[n]'
        ]
    },
    {
        slug: 'tower-of-hanoi',
        name: 'Tower of Hanoi',
        category: 'algorithms',
        categoryLabel: 'Recursion, DP & Backtracking',
        engineType: 'recursion',
        subVariant: 'hanoi',
        difficulty: 'Intermediate',
        sequenceOrder: 58,
        isRecommended: true,
        shortDescription: 'Animated 3-peg disk transfer solving the recurrence T(n) = 2T(n-1) + 1 in 2ⁿ - 1 optimal moves.',
        overview: {
            whatItIs: 'The Tower of Hanoi puzzle transfers n graduated disks from Source peg A to Target peg C using Auxiliary peg B without ever placing a larger disk on top of a smaller disk.',
            whyUsed: 'Demonstrates how divide-and-conquer recursion decomposes an n-disk problem into two (n-1)-disk subproblems plus 1 base move.',
            howItStores: 'Tracks the 3 peg stacks (Peg A, Peg B, Peg C) and the active recursive call stack.',
            realWorldApplications: ['Backup tape rotation schedules', 'Recursive state-space decomposition'],
            advantages: ['Produces the mathematically minimal 2^n - 1 moves'],
            limitations: ['Exponential O(2^n) move count'],
            whenToUse: 'Use to visualize multi-branch recursive decomposition and state transitions.'
        },
        complexity: {
            bestTime: 'O(2ⁿ)',
            averageTime: 'O(2ⁿ)',
            worstTime: 'O(2ⁿ)',
            space: 'O(n) Stack',
            inPlace: false,
            stable: true,
            simpleExplanation: 'Move top n-1 disks to Aux peg B, move largest disk n to Target peg C, then move n-1 disks from Aux peg B to Target peg C.'
        },
        pseudocode: [
            '1. If n == 0 -> return',
            '2. Move n - 1 disks from Source -> Auxiliary (using Target)',
            '3. Move Disk #n from Source -> Target peg',
            '4. Move n - 1 disks from Auxiliary -> Target (using Source)'
        ]
    },
    {
        slug: 'recursion-tree',
        name: 'Recursion Tree & Call Stack Visualizer',
        category: 'algorithms',
        categoryLabel: 'Recursion, DP & Backtracking',
        engineType: 'recursion',
        subVariant: 'tree',
        difficulty: 'Intermediate',
        sequenceOrder: 59,
        isRecommended: false,
        shortDescription: 'Visualizes how branching recursive calls expand into a hierarchical Recursion Tree while the LIFO Call Stack winds and unwinds.',
        overview: {
            whatItIs: 'The Recursion Tree Visualizer maps every recursive function invocation as a tree node, showing parent-child call relationships, base-case leaves, and bottom-up return value propagation.',
            whyUsed: 'Makes the Master Theorem and recursive time/space complexity intuitive by showing that tree height equals stack space O(h) while total node count equals time complexity.',
            howItStores: 'Synchronizes the 2D Call Tree diagram with the live 1D LIFO Call Stack.',
            realWorldApplications: ['Analyzing Divide-and-Conquer recurrences T(n) = aT(n/b) + f(n)', 'Debugging recursive depth'],
            advantages: ['Exposes duplicate subproblem branches visually'],
            limitations: ['Branching factor >= 2 grows exponentially with depth'],
            whenToUse: 'Use to analyze recursive branching and call-stack depth.'
        },
        complexity: {
            bestTime: 'O(Branches^Depth)',
            averageTime: 'O(2^d)',
            worstTime: 'O(2^d)',
            space: 'O(Depth)',
            inPlace: false,
            stable: true,
            simpleExplanation: 'Notice that while the tree has 2^d nodes in total, the Call Stack only holds at most d active frames at any single moment!'
        },
        pseudocode: [
            '1. Spawn root call node at depth 0 and push onto Call Stack',
            '2. If depth == maxDepth (Base Case) -> return leaf value',
            '3. Branch Left child call (depth + 1) and await return',
            '4. Branch Right child call (depth + 1) and await return',
            '5. Combine child return values and pop current stack frame'
        ]
    },
    {
        slug: 'backtracking',
        name: 'Backtracking (State-Space Search)',
        category: 'algorithms',
        categoryLabel: 'Recursion, DP & Backtracking',
        engineType: 'backtracking',
        subVariant: 'subsets',
        difficulty: 'Intermediate',
        sequenceOrder: 60,
        isRecommended: true,
        shortDescription: 'Choose -> Explore -> Unchoose (Backtrack) state-space search with constraint pruning.',
        overview: {
            whatItIs: 'Backtracking systematically searches for solutions to constraint satisfaction and combinatorial problems by building candidates incrementally and abandoning ("pruning") partial candidates as soon as they violate a constraint.',
            whyUsed: 'Avoids brute-force enumeration of invalid branches by pruning dead ends early.',
            howItStores: 'Maintains a current partial decision path[] and undoes the last choice (path.pop()) upon returning from a branch.',
            realWorldApplications: ['Sudoku & Crossword solvers', 'Combinatorial optimization', 'Constraint satisfaction engines'],
            advantages: ['Prunes entire invalid subtrees early', 'Uses O(n) path memory via in-place undo'],
            limitations: ['Worst-case exponential time if few branches are pruned'],
            whenToUse: 'Use for constraint satisfaction, pathfinding with dead-ends, and combinatorial search.'
        },
        complexity: {
            bestTime: 'O(n)',
            averageTime: 'O(2ⁿ)',
            worstTime: 'O(2ⁿ)',
            space: 'O(n) Stack',
            inPlace: false,
            stable: true,
            simpleExplanation: 'Follows the 3-step mantra: (1) Make a choice, (2) Recurse to explore, (3) Undo the choice (Backtrack).'
        },
        pseudocode: [
            '1. If current candidate satisfies goal -> record valid solution',
            '2. For each available choice at current step:',
            '3.   CHOOSE: append choice to current path',
            '4.   EXPLORE: recursively call backtrack(nextStep)',
            '5.   UNCHOOSE (BACKTRACK): remove choice from path and try next option'
        ]
    },
    {
        slug: 'n-queens',
        name: 'N-Queens Backtracking Visualizer',
        category: 'algorithms',
        categoryLabel: 'Recursion, DP & Backtracking',
        engineType: 'backtracking',
        subVariant: 'nqueens',
        difficulty: 'Advanced',
        sequenceOrder: 61,
        isRecommended: true,
        shortDescription: 'Interactive N×N chessboard visualizer placing N non-attacking Queens row-by-row with live conflict detection and backtracking.',
        overview: {
            whatItIs: 'The N-Queens problem places N chess queens on an N×N chessboard so that no two queens attack each other along any row, column, main diagonal, or anti-diagonal.',
            whyUsed: 'The classic benchmark for constraint-pruned backtracking: placing 1 queen per row reduces 64^8 possibilities down to a small pruned search tree.',
            howItStores: 'Tracks queen column positions board[row] = col and checks column and diagonal conflicts (|r1 - r2| == |c1 - c2|).',
            realWorldApplications: ['VLSI chip layout & non-interfering pin placement', 'Parallel memory bank conflict-free routing'],
            advantages: ['Prunes invalid column/diagonal placements immediately in O(1)'],
            limitations: ['Factorial worst-case growth for large N'],
            whenToUse: 'Use to visualize constraint satisfaction and pruning on a 2D grid.'
        },
        complexity: {
            bestTime: 'O(N!)',
            averageTime: 'O(N!)',
            worstTime: 'O(N!)',
            space: 'O(N²)',
            inPlace: false,
            stable: true,
            simpleExplanation: 'Tries placing a Queen in column 0..N-1 of the current row; if safe, moves to row + 1; if all columns conflict, backtracks to the previous row!'
        },
        pseudocode: [
            '1. If row == N -> All N Queens safely placed! Record board configuration',
            '2. For col = 0 to N - 1 in current row:',
            '3.   Check if (row, col) is safe from earlier Queens (same col or |Δr| == |Δc|)',
            '4.   If SAFE: place Queen at (row, col) and recurse solve(row + 1)',
            '5.   If conflict or recursion returns: remove Queen (Backtrack) and try col + 1'
        ]
    },
    {
        slug: 'rat-in-a-maze',
        name: 'Rat in a Maze (Grid Backtracking)',
        category: 'algorithms',
        categoryLabel: 'Recursion, DP & Backtracking',
        engineType: 'backtracking',
        subVariant: 'maze',
        difficulty: 'Intermediate',
        sequenceOrder: 62,
        isRecommended: true,
        shortDescription: 'Animates a pathfinder exploring open cells (D, R, U, L) from (0,0) to (N-1,N-1), highlighting dead-end backtracking.',
        overview: {
            whatItIs: 'Rat in a Maze searches for a valid path through an N×N grid containing open corridors (0) and blocked walls (1) from top-left (0, 0) to bottom-right (N-1, N-1).',
            whyUsed: 'Visually demonstrates how DFS backtracking marks cells as part of the current path, hits dead-end walls, unmarks dead-end cells, and discovers the exit route.',
            howItStores: 'Maintains the N×N maze grid, a visited/path overlay matrix, and the direction stack.',
            realWorldApplications: ['Robot autonomous path planning', 'PCB trace routing around obstacles'],
            advantages: ['Finds a valid path in O(V + E) grid cells when cyclic revisits are blocked'],
            limitations: ['DFS finds a valid path; use BFS if the shortest path in an unweighted maze is required'],
            whenToUse: 'Use for 2D grid obstacle navigation and dead-end backtracking.'
        },
        complexity: {
            bestTime: 'O(N²)',
            averageTime: 'O(N²)',
            worstTime: 'O(4^(N²)) Unmarked / O(N²) Marked',
            space: 'O(N²)',
            inPlace: false,
            stable: true,
            simpleExplanation: 'Steps into open adjacent cells (Down, Right, Up, Left); if all neighbors are walls or visited, backtracks out of the dead end.'
        },
        pseudocode: [
            '1. Check if current cell (r, c) is out of bounds, a wall (1), or already visited',
            '2. Mark cell (r, c) as part of active path',
            '3. If (r, c) == (N - 1, N - 1) -> Destination Reached! Return true',
            '4. Recursively try neighbors: Down(r+1,c), Right(r,c+1), Up(r-1,c), Left(r,c-1)',
            '5. If all 4 directions fail -> unmark (r, c) as Dead-End (Backtrack) and return false'
        ]
    },
    {
        slug: 'subset-generation',
        name: 'Subset Generation (Power Set)',
        category: 'algorithms',
        categoryLabel: 'Recursion, DP & Backtracking',
        engineType: 'backtracking',
        subVariant: 'subsets',
        difficulty: 'Intermediate',
        sequenceOrder: 63,
        isRecommended: false,
        shortDescription: 'Generates all 2ⁿ subsets of a set by branching on Include(nums[i]) vs Exclude(nums[i]) at every index.',
        overview: {
            whatItIs: 'Subset Generation enumerates the complete Power Set (all 2^n possible subsets) of an array of n elements.',
            whyUsed: 'Models binary include/exclude decision trees used in 0/1 Knapsack, Subset Sum, and feature selection.',
            howItStores: 'Maintains the current subset[] and branches twice at each index i: include nums[i] or skip nums[i].',
            realWorldApplications: ['Subset Sum & Partition problems', 'Feature combination testing'],
            advantages: ['Clean binary decision tree producing all 2^n subsets without duplicates'],
            limitations: ['Output size is 2^n, so practical for n <= 16'],
            whenToUse: 'Use when all combinations or subsets of a collection must be evaluated.'
        },
        complexity: {
            bestTime: 'O(n * 2ⁿ)',
            averageTime: 'O(n * 2ⁿ)',
            worstTime: 'O(n * 2ⁿ)',
            space: 'O(n) Stack',
            inPlace: false,
            stable: true,
            simpleExplanation: 'At each element, makes a binary choice: Include it in the current subset, or Exclude it.'
        },
        pseudocode: [
            '1. Record copy of current subset[] into results list',
            '2. For i = startIndex to n - 1:',
            '3.   INCLUDE: push nums[i] into current subset',
            '4.   EXPLORE: recurse generateSubsets(i + 1)',
            '5.   EXCLUDE (BACKTRACK): pop nums[i] from current subset'
        ]
    },
    {
        slug: 'permutations',
        name: 'Permutations Generator',
        category: 'algorithms',
        categoryLabel: 'Recursion, DP & Backtracking',
        engineType: 'backtracking',
        subVariant: 'permutations',
        difficulty: 'Intermediate',
        sequenceOrder: 64,
        isRecommended: false,
        shortDescription: 'Generates all n! orderings of an array via in-place swap backtracking.',
        overview: {
            whatItIs: 'Permutation Generation produces all n! distinct arrangements of n elements.',
            whyUsed: 'Explores ordering problems such as Traveling Salesperson (TSP), job assignment schedules, and anagram generation.',
            howItStores: 'Swaps element at index idx with every candidate j in [idx..n-1], recurses on idx + 1, and swaps back to restore order.',
            realWorldApplications: ['Route sequence optimization', 'Cryptographic key permutation testing', 'Next lexicographical permutation'],
            advantages: ['In-place swap backtracking avoids allocating boolean used[] arrays'],
            limitations: ['Factorial growth n! (5! = 120, 10! = 3,628,800)'],
            whenToUse: 'Use when every possible ordering of elements must be inspected.'
        },
        complexity: {
            bestTime: 'O(n * n!)',
            averageTime: 'O(n * n!)',
            worstTime: 'O(n * n!)',
            space: 'O(n) Stack',
            inPlace: true,
            stable: false,
            simpleExplanation: 'Fixes position 0 in n ways, position 1 in n-1 ways, ..., producing n! permutations.'
        },
        pseudocode: [
            '1. If fixedIndex == n -> record completed permutation arr[]',
            '2. For j = fixedIndex to n - 1:',
            '3.   SWAP: swap(arr[fixedIndex], arr[j]) to place arr[j] at fixedIndex',
            '4.   EXPLORE: recurse permute(fixedIndex + 1)',
            '5.   BACKTRACK: swap(arr[fixedIndex], arr[j]) back to restore original order'
        ]
    },
    {
        slug: 'dynamic-programming',
        name: 'Dynamic Programming (Tabulation & Memoization)',
        category: 'algorithms',
        categoryLabel: 'Recursion, DP & Backtracking',
        engineType: 'dp',
        subVariant: 'knapsack-lcs',
        difficulty: 'Advanced',
        sequenceOrder: 65,
        isRecommended: true,
        shortDescription: 'Interactive 1D/2D DP Table visualizer showing recurrence relations, cell dependencies, and optimal substructure.',
        overview: {
            whatItIs: 'Dynamic Programming (DP) solves complex problems by breaking them into overlapping subproblems, storing each subproblem solution in a DP table so it is never recomputed.',
            whyUsed: 'Transforms exponential O(2^n) brute-force searches (like 0/1 Knapsack, Coin Change, and Longest Common Subsequence) into polynomial O(n * W) or O(n * m) table lookups!',
            howItStores: 'Displays the live 2D / 1D DP Table, highlights the active cell dp[i][j], and draws arrows from the previously computed cells reused by the recurrence relation.',
            realWorldApplications: ['Git diff & DNA sequence alignment (LCS / Edit Distance)', 'Resource allocation & Knapsack optimization', 'Viterbi speech recognition'],
            advantages: ['Reduces exponential time to polynomial time', 'Supports both Top-Down Memoization and Bottom-Up Tabulation'],
            limitations: ['Requires Optimal Substructure and Overlapping Subproblems'],
            whenToUse: 'Use for optimization or counting problems where subproblems overlap.'
        },
        complexity: {
            bestTime: 'O(n * m)',
            averageTime: 'O(n * m)',
            worstTime: 'O(n * m)',
            space: 'O(n * m) Table',
            inPlace: false,
            stable: true,
            simpleExplanation: 'Fills a table cell-by-cell where each cell reuses already-solved neighbor cells in O(1) time.'
        },
        pseudocode: [
            '1. Initialize DP Table dp[0..rows][0..cols] with base cases (row 0 and col 0)',
            '2. For row i = 1 to rows:',
            '3.   For col w = 1 to cols:',
            '4.     Evaluate Recurrence Relation using previously computed dp cells',
            '5. Return optimal answer at dp[rows][cols] and trace back selected items'
        ]
    },
    {
        slug: 'greedy-algorithms',
        name: 'Greedy Algorithms (Activity Selection & Coin Change)',
        category: 'algorithms',
        categoryLabel: 'Recursion, DP & Backtracking',
        engineType: 'dp',
        subVariant: 'greedy',
        difficulty: 'Intermediate',
        sequenceOrder: 66,
        isRecommended: true,
        shortDescription: 'Makes the locally optimal choice at each step (e.g., earliest finish time interval scheduling) to reach a global optimum.',
        overview: {
            whatItIs: 'A Greedy Algorithm constructs a solution step-by-step by always choosing the option that looks best at the current moment without reconsidering past choices.',
            whyUsed: 'When a problem satisfies the Greedy Choice Property (such as Interval Activity Selection sorted by finish time, Fractional Knapsack, or canonical Coin Change), greedy runs in O(n log n) time with O(1) auxiliary space!',
            howItStores: 'Sorts candidates by the greedy criterion (e.g., earliest finish time) and scans linearly, accepting compatible items.',
            realWorldApplications: ['Meeting room & CPU interval scheduling', 'Huffman data compression', 'Dijkstra & Kruskal greedy graph algorithms'],
            advantages: ['Ultra-fast O(n log n) sorting + O(n) single pass', 'Simpler and more memory-efficient than DP when Greedy Choice Property holds'],
            limitations: ['Does not work on arbitrary non-canonical coin systems where DP is required'],
            whenToUse: 'Use when local optimal choices provably lead to a globally optimal solution.'
        },
        complexity: {
            bestTime: 'O(n log n)',
            averageTime: 'O(n log n)',
            worstTime: 'O(n log n)',
            space: 'O(1)',
            inPlace: true,
            stable: true,
            simpleExplanation: 'Sorts intervals by earliest finish time and greedily picks every interval whose start time >= lastFinishTime.'
        },
        pseudocode: [
            '1. Sort intervals in ascending order of finish time: end_1 <= end_2 <= ... <= end_n',
            '2. Select first activity A[0]; set lastEnd = A[0].end',
            '3. For i = 1 to n - 1: inspect activity A[i]',
            '4.   If A[i].start >= lastEnd (compatible): select A[i]; lastEnd = A[i].end',
            '5.   Else reject A[i] (overlaps with active schedule)'
        ]
    }
];

export const PART_THREE_TOPICS = PART_THREE_RAW.map((t) => ({
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

const normalizeTopicSchema = (t) => ({
    ...t,
    title: t.title || t.name || 'Algorithm Visualizer',
    name: t.name || t.title || 'Algorithm Visualizer',
    shortDesc: t.shortDesc || t.shortDescription || t.overview?.whatItIs || '',
    shortDescription: t.shortDescription || t.shortDesc || t.overview?.whatItIs || '',
    overview: {
        ...(t.overview || {}),
        what: t.overview?.what || t.overview?.whatItIs || t.shortDescription || t.shortDesc || '',
        whatItIs: t.overview?.whatItIs || t.overview?.what || t.shortDescription || t.shortDesc || '',
        why: t.overview?.why || t.overview?.whyUsed || '',
        whyUsed: t.overview?.whyUsed || t.overview?.why || '',
        howItStores: t.overview?.howItStores || '',
        realWorld: t.overview?.realWorld || t.overview?.realWorldApplications || [],
        realWorldApplications: t.overview?.realWorldApplications || t.overview?.realWorld || [],
        advantages: t.overview?.advantages || [],
        limitations: t.overview?.limitations || [],
        whenToUse: t.overview?.whenToUse || ''
    },
    complexity: {
        ...(t.complexity || {}),
        timeBest: t.complexity?.timeBest || t.complexity?.bestTime || 'O(1)',
        bestTime: t.complexity?.bestTime || t.complexity?.timeBest || 'O(1)',
        timeAvg: t.complexity?.timeAvg || t.complexity?.averageTime || 'O(n)',
        averageTime: t.complexity?.averageTime || t.complexity?.timeAvg || 'O(n)',
        timeWorst: t.complexity?.timeWorst || t.complexity?.worstTime || 'O(n)',
        worstTime: t.complexity?.worstTime || t.complexity?.timeWorst || 'O(n)',
        space: t.complexity?.space || 'O(1)',
        explanation: t.complexity?.explanation || t.complexity?.simpleExplanation || ''
    },
    practiceQuestions: (t.practiceQuestions || []).map((q) => ({
        ...q,
        level: q.level || q.difficulty || 'Easy',
        difficulty: q.difficulty || q.level || 'Easy',
        answerIndex: q.answerIndex !== undefined ? q.answerIndex : (q.correctIndex ?? 0),
        correctIndex: q.correctIndex !== undefined ? q.correctIndex : (q.answerIndex ?? 0)
    }))
});

export const ALL_ALGOPLAY_TOPICS = [
    ...PART_ONE_TOPICS,
    ...PART_TWO_TOPICS,
    ...PART_THREE_TOPICS
].map(normalizeTopicSchema);

export { ALGOPLAY_CATEGORIES, BIG_O_REFERENCE_TABLE, SORTING_COMPARISON_TABLE, normalizeTopicSchema };
