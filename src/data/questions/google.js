export const GOOGLE_QUESTIONS = [
    {
        "id": "goog-1",
        "company": "google",
        "category": "product",
        "number": 1,
        "title": "Split Array Largest Sum (Page Allocation)",
        "difficulty": "Hard",
        "topic": "Binary Search on Answer",
        "frequency": "98% in Google Onsite",
        "context": "Distributed shards in Google Bigtable",
        "fnName": "solve",
        "params": [
            {
                "name": "nums",
                "type": "int[]"
            },
            {
                "name": "k",
                "type": "int"
            }
        ],
        "returnType": "int",
        "description": "Given integer array `nums` and integer `k`, split `nums` into `k` non-empty contiguous subarrays such that the largest sum among any subarray is minimized. Return the minimized largest sum.",
        "constraints": [
            "1 <= nums.length <= 10^5",
            "1 <= k <= min(50, nums.length)",
            "0 <= nums[i] <= 10^6"
        ],
        "hint": "Binary search on range [max(nums), sum(nums)]. Verify feasibility greedily.",
        "starter": {
            "python": "def solve(nums, k):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(nums, k) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(nums, k):\n    low, high = max(nums), sum(nums)\n    def canSplit(max_sum):\n        count, current = 1, 0\n        for x in nums:\n            if current + x > max_sum:\n                count += 1\n                current = x\n            else:\n                current += x\n        return count <= k\n    while low < high:\n        mid = (low + high) // 2\n        if canSplit(mid):\n            high = mid\n        else:\n            low = mid + 1\n    return low",
            "javascript": "function solve(nums, k) {\n    let low = Math.max(...nums), high = nums.reduce((a, b) => a + b, 0);\n    const canSplit = (maxSum) => {\n        let count = 1, current = 0;\n        for (const x of nums) {\n            if (current + x > maxSum) {\n                count++;\n                current = x;\n            } else {\n                current += x;\n            }\n        }\n        return count <= k;\n    };\n    while (low < high) {\n        const mid = Math.floor((low + high) / 2);\n        if (canSplit(mid)) high = mid;\n        else low = mid + 1;\n    }\n    return low;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        7,
                        2,
                        5,
                        10,
                        8
                    ],
                    2
                ],
                "expected": 18,
                "isHidden": false
            },
            {
                "args": [
                    [
                        1,
                        2,
                        3,
                        4,
                        5
                    ],
                    2
                ],
                "expected": 9,
                "isHidden": false
            },
            {
                "args": [
                    [
                        1,
                        4,
                        4
                    ],
                    3
                ],
                "expected": 4,
                "isHidden": true
            }
        ]
    },
    {
        "id": "goog-2",
        "company": "google",
        "category": "product",
        "number": 2,
        "title": "Burst Balloons for Maximum Coins",
        "difficulty": "Hard",
        "topic": "Dynamic Programming",
        "frequency": "95% in Google Interviews",
        "context": "Optimal ad-auction revenue sequencing",
        "fnName": "solve",
        "params": [
            {
                "name": "nums",
                "type": "int[]"
            }
        ],
        "returnType": "int",
        "description": "You are given `n` balloons indexed `0` to `n-1`, each with coins `nums[i]`. If you burst balloon `i`, you get `nums[i-1] * nums[i] * nums[i+1]` coins. Out of bounds values are treated as `1`. Find maximum coins by bursting all balloons wisely.",
        "constraints": [
            "1 <= nums.length <= 300",
            "0 <= nums[i] <= 100"
        ],
        "hint": "Think in reverse: pick which balloon to burst LAST in range (left, right).",
        "starter": {
            "python": "def solve(nums):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(nums) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(nums):\n    arr = [1] + [x for x in nums if x > 0] + [1]\n    n = len(arr)\n    dp = [[0] * n for _ in range(n)]\n    for length in range(1, n - 1):\n        for left in range(0, n - length - 1):\n            right = left + length + 1\n            for k in range(left + 1, right):\n                dp[left][right] = max(dp[left][right], dp[left][k] + dp[k][right] + arr[left] * arr[k] * arr[right])\n    return dp[0][n - 1]",
            "javascript": "function solve(nums) {\n    const arr = [1, ...nums.filter(x => x > 0), 1];\n    const n = arr.length;\n    const dp = Array.from({ length: n }, () => new Array(n).fill(0));\n    for (let len = 1; len < n - 1; len++) {\n        for (let left = 0; left < n - len - 1; left++) {\n            const right = left + len + 1;\n            for (let k = left + 1; k < right; k++) {\n                dp[left][right] = Math.max(dp[left][right], dp[left][k] + dp[k][right] + arr[left] * arr[k] * arr[right]);\n            }\n        }\n    }\n    return dp[0][n - 1];\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        3,
                        1,
                        5,
                        8
                    ]
                ],
                "expected": 167,
                "isHidden": false
            },
            {
                "args": [
                    [
                        1,
                        5
                    ]
                ],
                "expected": 10,
                "isHidden": false
            }
        ]
    },
    {
        "id": "goog-3",
        "company": "google",
        "category": "product",
        "number": 3,
        "title": "Alien Dictionary Character Order",
        "difficulty": "Hard",
        "topic": "Topological Sort",
        "frequency": "97% in Google Campus",
        "context": "Google Translate multilingual lexical ordering",
        "fnName": "solve",
        "params": [
            {
                "name": "words",
                "type": "string[]"
            }
        ],
        "returnType": "string",
        "description": "Given a list of words from an alien language sorted lexicographically according to its secret alphabet rules, derive the unique character order as a string. If the order is invalid or cyclic, return `\"\"`.",
        "constraints": [
            "1 <= words.length <= 100",
            "1 <= words[i].length <= 20"
        ],
        "hint": "Build directed graph from first character mismatches between adjacent words. Run topological sort.",
        "starter": {
            "python": "def solve(words):\n    # Write your logic here\n    return \"\"",
            "javascript": "function solve(words) {\n    // Write your logic here\n    return \"\";\n}"
        },
        "solution": {
            "python": "def solve(words):\n    from collections import defaultdict, deque\n    adj = {c: set() for w in words for c in w}\n    in_deg = {c: 0 for c in adj}\n    for i in range(len(words) - 1):\n        w1, w2 = words[i], words[i + 1]\n        if len(w1) > len(w2) and w1.startswith(w2): return \"\"\n        for c1, c2 in zip(w1, w2):\n            if c1 != c2:\n                if c2 not in adj[c1]:\n                    adj[c1].add(c2)\n                    in_deg[c2] += 1\n                break\n    queue = deque([c for c in in_deg if in_deg[c] == 0])\n    res = []\n    while queue:\n        u = queue.popleft()\n        res.append(u)\n        for v in sorted(adj[u]):\n            in_deg[v] -= 1\n            if in_deg[v] == 0: queue.append(v)\n    return \"\".join(res) if len(res) == len(in_deg) else \"\"",
            "javascript": "function solve(words) {\n    const adj = {};\n    const inDeg = {};\n    for (const w of words) for (const c of w) { adj[c] = new Set(); inDeg[c] = 0; }\n    for (let i = 0; i < words.length - 1; i++) {\n        const w1 = words[i], w2 = words[i + 1];\n        if (w1.length > w2.length && w1.startsWith(w2)) return '';\n        for (let j = 0; j < Math.min(w1.length, w2.length); j++) {\n            if (w1[j] !== w2[j]) {\n                if (!adj[w1[j]].has(w2[j])) {\n                    adj[w1[j]].add(w2[j]);\n                    inDeg[w2[j]]++;\n                }\n                break;\n            }\n        }\n    }\n    const q = Object.keys(inDeg).filter(k => inDeg[k] === 0);\n    const res = [];\n    while (q.length > 0) {\n        const u = q.shift();\n        res.push(u);\n        for (const v of adj[u]) {\n            inDeg[v]--;\n            if (inDeg[v] === 0) q.push(v);\n        }\n    }\n    return res.length === Object.keys(inDeg).length ? res.join('') : '';\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        "wrt",
                        "wrf",
                        "er",
                        "ett",
                        "rftt"
                    ]
                ],
                "expected": "wertf",
                "isHidden": false
            },
            {
                "args": [
                    [
                        "z",
                        "x"
                    ]
                ],
                "expected": "zx",
                "isHidden": false
            },
            {
                "args": [
                    [
                        "z",
                        "x",
                        "z"
                    ]
                ],
                "expected": "",
                "isHidden": true
            }
        ]
    },
    {
        "id": "goog-4",
        "company": "google",
        "category": "product",
        "number": 4,
        "title": "2D Range Sum Query (Prefix Matrix)",
        "difficulty": "Medium",
        "topic": "Prefix Sum",
        "frequency": "93% in Google Cloud",
        "context": "Google Maps bounding-box telemetry",
        "fnName": "solve",
        "params": [
            {
                "name": "matrix",
                "type": "int[][]"
            },
            {
                "name": "queries",
                "type": "int[][]"
            }
        ],
        "returnType": "int[]",
        "description": "Given a 2D integer `matrix` and a list of `queries` where each query is `[row1, col1, row2, col2]`, calculate sum of elements inside the rectangle defined by top-left `(row1, col1)` and bottom-right `(row2, col2)`.",
        "constraints": [
            "1 <= matrix.length, matrix[0].length <= 200",
            "1 <= queries.length <= 1000"
        ],
        "hint": "Construct 2D prefix sum array P[r+1][c+1] = P[r][c+1] + P[r+1][c] - P[r][c] + M[r][c]. Query in O(1).",
        "starter": {
            "python": "def solve(matrix, queries):\n    # Write your logic here\n    return []",
            "javascript": "function solve(matrix, queries) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(matrix, queries):\n    R, C = len(matrix), len(matrix[0])\n    P = [[0] * (C + 1) for _ in range(R + 1)]\n    for r in range(R):\n        for c in range(C):\n            P[r + 1][c + 1] = P[r][c + 1] + P[r + 1][c] - P[r][c] + matrix[r][c]\n    res = []\n    for r1, c1, r2, c2 in queries:\n        total = P[r2 + 1][c2 + 1] - P[r1][c2 + 1] - P[r2 + 1][c1] + P[r1][c1]\n        res.append(total)\n    return res",
            "javascript": "function solve(matrix, queries) {\n    const R = matrix.length, C = matrix[0].length;\n    const P = Array.from({ length: R + 1 }, () => new Array(C + 1).fill(0));\n    for (let r = 0; r < R; r++) {\n        for (let c = 0; c < C; c++) {\n            P[r + 1][c + 1] = P[r][c + 1] + P[r + 1][c] - P[r][c] + matrix[r][c];\n        }\n    }\n    return queries.map(([r1, c1, r2, c2]) => {\n        return P[r2 + 1][c2 + 1] - P[r1][c2 + 1] - P[r2 + 1][c1] + P[r1][c1];\n    });\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        [
                            3,
                            0,
                            1,
                            4,
                            2
                        ],
                        [
                            5,
                            6,
                            3,
                            2,
                            1
                        ],
                        [
                            1,
                            2,
                            0,
                            1,
                            5
                        ],
                        [
                            4,
                            1,
                            0,
                            1,
                            7
                        ],
                        [
                            1,
                            0,
                            3,
                            0,
                            5
                        ]
                    ],
                    [
                        [
                            2,
                            1,
                            4,
                            3
                        ],
                        [
                            1,
                            1,
                            2,
                            2
                        ]
                    ]
                ],
                "expected": [
                    8,
                    11
                ],
                "isHidden": false
            }
        ]
    },
    {
        "id": "goog-5",
        "company": "google",
        "category": "product",
        "number": 5,
        "title": "Russian Doll Envelopes",
        "difficulty": "Hard",
        "topic": "Dynamic Programming & LIS",
        "frequency": "94% in Google Code Jam",
        "context": "Nested virtual container packaging in Google Borg",
        "fnName": "solve",
        "params": [
            {
                "name": "envelopes",
                "type": "int[][]"
            }
        ],
        "returnType": "int",
        "description": "You have a 2D array of integers `envelopes` where `envelopes[i] = [wi, hi]`. An envelope can fit inside another if and only if both width and height are strictly greater. Return maximum number of envelopes you can Russian doll.",
        "constraints": [
            "1 <= envelopes.length <= 10^5",
            "envelopes[i].length == 2"
        ],
        "hint": "Sort envelopes by width ascending; for equal widths, sort height DESCENDING. Then run LIS on heights.",
        "starter": {
            "python": "def solve(envelopes):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(envelopes) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(envelopes):\n    import bisect\n    # Sort width asc, height desc\n    envs = sorted(envelopes, key=lambda x: (x[0], -x[1]))\n    lis = []\n    for _, h in envs:\n        idx = bisect.bisect_left(lis, h)\n        if idx == len(lis):\n            lis.append(h)\n        else:\n            lis[idx] = h\n    return len(lis)",
            "javascript": "function solve(envelopes) {\n    const envs = [...envelopes].sort((a, b) => a[0] === b[0] ? b[1] - a[1] : a[0] - b[0]);\n    const lis = [];\n    for (const [, h] of envs) {\n        let l = 0, r = lis.length;\n        while (l < r) {\n            const mid = Math.floor((l + r) / 2);\n            if (lis[mid] < h) l = mid + 1;\n            else r = mid;\n        }\n        if (l === lis.length) lis.push(h);\n        else lis[l] = h;\n    }\n    return lis.length;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        [
                            5,
                            4
                        ],
                        [
                            6,
                            4
                        ],
                        [
                            6,
                            7
                        ],
                        [
                            2,
                            3
                        ]
                    ]
                ],
                "expected": 3,
                "isHidden": false
            },
            {
                "args": [
                    [
                        [
                            1,
                            1
                        ],
                        [
                            1,
                            1
                        ],
                        [
                            1,
                            1
                        ]
                    ]
                ],
                "expected": 1,
                "isHidden": false
            }
        ]
    },
    {
        "id": "goog-6",
        "company": "google",
        "category": "product",
        "number": 6,
        "title": "Word Search in Grid with Prefix Trie",
        "difficulty": "Hard",
        "topic": "Trie & Backtracking",
        "frequency": "96% in Google Onsite",
        "context": "OCR word recognition in Google Lens",
        "fnName": "solve",
        "params": [
            {
                "name": "board",
                "type": "string[][]"
            },
            {
                "name": "words",
                "type": "string[]"
            }
        ],
        "returnType": "string[]",
        "description": "Given an `m x n` character `board` and a list of `words`, find all words from the list that exist in the grid. Words can be constructed from sequentially adjacent cells horizontally or vertically, without reusing cells in a single word.",
        "constraints": [
            "1 <= board.length, board[0].length <= 12",
            "1 <= words.length <= 100"
        ],
        "hint": "Store words into a Trie. Traverse matrix via DFS and prune immediately if prefix not in Trie.",
        "starter": {
            "python": "def solve(board, words):\n    # Write your logic here\n    return []",
            "javascript": "function solve(board, words) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(board, words):\n    trie = {}\n    for w in words:\n        node = trie\n        for c in w:\n            node = node.setdefault(c, {})\n        node['$'] = w\n    R, C = len(board), len(board[0])\n    found = set()\n    def dfs(r, c, parent):\n        char = board[r][c]\n        curr = parent[char]\n        if '$' in curr: found.add(curr['$'])\n        board[r][c] = '#'\n        for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:\n            nr, nc = r + dr, c + dc\n            if 0 <= nr < R and 0 <= nc < C and board[nr][nc] in curr:\n                dfs(nr, nc, curr)\n        board[r][c] = char\n    for r in range(R):\n        for c in range(C):\n            if board[r][c] in trie: dfs(r, c, trie)\n    return sorted(list(found))",
            "javascript": "function solve(board, words) {\n    const trie = {};\n    for (const w of words) {\n        let node = trie;\n        for (const c of w) { if (!node[c]) node[c] = {}; node = node[c]; }\n        node['$'] = w;\n    }\n    const R = board.length, C = board[0].length;\n    const found = new Set();\n    const dfs = (r, c, parent) => {\n        const char = board[r][c];\n        const curr = parent[char];\n        if (curr['$']) found.add(curr['$']);\n        board[r][c] = '#';\n        const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];\n        for (const [dr, dc] of dirs) {\n            const nr = r + dr, nc = c + dc;\n            if (nr >= 0 && nr < R && nc >= 0 && nc < C && board[nr][nc] in curr) dfs(nr, nc, curr);\n        }\n        board[r][c] = char;\n    };\n    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) if (board[r][c] in trie) dfs(r, c, trie);\n    return Array.from(found).sort();\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        [
                            "o",
                            "a",
                            "a",
                            "n"
                        ],
                        [
                            "e",
                            "t",
                            "a",
                            "e"
                        ],
                        [
                            "i",
                            "h",
                            "k",
                            "r"
                        ],
                        [
                            "i",
                            "f",
                            "l",
                            "v"
                        ]
                    ],
                    [
                        "oath",
                        "pea",
                        "eat",
                        "rain"
                    ]
                ],
                "expected": [
                    "eat",
                    "oath"
                ],
                "isHidden": false
            }
        ]
    },
    {
        "id": "goog-7",
        "company": "google",
        "category": "product",
        "number": 7,
        "title": "Capacity to Ship Packages within D Days",
        "difficulty": "Medium",
        "topic": "Binary Search",
        "frequency": "95% in Google Interviews",
        "context": "Google Express / Shopping warehouse logistics",
        "fnName": "solve",
        "params": [
            {
                "name": "weights",
                "type": "int[]"
            },
            {
                "name": "days",
                "type": "int"
            }
        ],
        "returnType": "int",
        "description": "A conveyor belt has packages with `weights[i]`. Ship packages within `days` days. Cargo must be loaded in order of given weights. Return minimum ship capacity needed.",
        "constraints": [
            "1 <= days <= weights.length <= 5 * 10^4",
            "1 <= weights[i] <= 500"
        ],
        "hint": "Binary search capacity between max(weights) and sum(weights).",
        "starter": {
            "python": "def solve(weights, days):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(weights, days) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(weights, days):\n    low, high = max(weights), sum(weights)\n    while low < high:\n        mid = (low + high) // 2\n        d_needed = 1\n        current = 0\n        for w in weights:\n            if current + w > mid:\n                d_needed += 1\n                current = w\n            else:\n                current += w\n        if d_needed <= days: high = mid\n        else: low = mid + 1\n    return low",
            "javascript": "function solve(weights, days) {\n    let low = Math.max(...weights), high = weights.reduce((a, b) => a + b, 0);\n    while (low < high) {\n        const mid = Math.floor((low + high) / 2);\n        let dNeeded = 1, current = 0;\n        for (const w of weights) {\n            if (current + w > mid) { dNeeded++; current = w; } else { current += w; }\n        }\n        if (dNeeded <= days) high = mid; else low = mid + 1;\n    }\n    return low;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8,
                        9,
                        10
                    ],
                    5
                ],
                "expected": 15,
                "isHidden": false
            },
            {
                "args": [
                    [
                        3,
                        2,
                        2,
                        4,
                        1,
                        4
                    ],
                    3
                ],
                "expected": 6,
                "isHidden": false
            }
        ]
    },
    {
        "id": "goog-8",
        "company": "google",
        "category": "product",
        "number": 8,
        "title": "Shortest Path in Grid with Obstacles Elimination",
        "difficulty": "Hard",
        "topic": "BFS & State Space",
        "frequency": "93% in Google Autonomous Vehicles",
        "context": "Waymo path-planning around dynamic barricades",
        "fnName": "solve",
        "params": [
            {
                "name": "grid",
                "type": "int[][]"
            },
            {
                "name": "k",
                "type": "int"
            }
        ],
        "returnType": "int",
        "description": "Given `m x n` grid where `0` is empty and `1` is obstacle. You can eliminate at most `k` obstacles. Return minimum steps to walk from `(0, 0)` to `(m-1, n-1)`. If impossible, return `-1`.",
        "constraints": [
            "1 <= m, n <= 40",
            "1 <= k <= m * n"
        ],
        "hint": "BFS tracking state (row, col, remaining_k). Visit node only if you arrive with strictly higher k.",
        "starter": {
            "python": "def solve(grid, k):\n    # Write your logic here\n    return -1",
            "javascript": "function solve(grid, k) {\n    // Write your logic here\n    return -1;\n}"
        },
        "solution": {
            "python": "def solve(grid, k):\n    from collections import deque\n    R, C = len(grid), len(grid[0])\n    if R == 1 and C == 1: return 0\n    if k >= R + C - 2: return R + C - 2\n    q = deque([(0, 0, k, 0)])\n    visited = {(0, 0): k}\n    while q:\n        r, c, rem, steps = q.popleft()\n        for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:\n            nr, nc = r + dr, c + dc\n            if 0 <= nr < R and 0 <= nc < C:\n                new_rem = rem - grid[nr][nc]\n                if new_rem >= 0:\n                    if nr == R - 1 and nc == C - 1: return steps + 1\n                    if visited.get((nr, nc), -1) < new_rem:\n                        visited[(nr, nc)] = new_rem\n                        q.append((nr, nc, new_rem, steps + 1))\n    return -1",
            "javascript": "function solve(grid, k) {\n    const R = grid.length, C = grid[0].length;\n    if (R === 1 && C === 1) return 0;\n    if (k >= R + C - 2) return R + C - 2;\n    const q = [[0, 0, k, 0]];\n    const visited = new Map();\n    visited.set('0,0', k);\n    let head = 0;\n    while (head < q.length) {\n        const [r, c, rem, steps] = q[head++];\n        const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];\n        for (const [dr, dc] of dirs) {\n            const nr = r + dr, nc = c + dc;\n            if (nr >= 0 && nr < R && nc >= 0 && nc < C) {\n                const nrem = rem - grid[nr][nc];\n                if (nrem >= 0) {\n                    if (nr === R - 1 && nc === C - 1) return steps + 1;\n                    const key = `${nr},${nc}`;\n                    if ((visited.get(key) ?? -1) < nrem) {\n                        visited.set(key, nrem);\n                        q.push([nr, nc, nrem, steps + 1]);\n                    }\n                }\n            }\n        }\n    }\n    return -1;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        [
                            0,
                            0,
                            0
                        ],
                        [
                            1,
                            1,
                            0
                        ],
                        [
                            0,
                            0,
                            0
                        ],
                        [
                            0,
                            1,
                            1
                        ],
                        [
                            0,
                            0,
                            0
                        ]
                    ],
                    1
                ],
                "expected": 6,
                "isHidden": false
            },
            {
                "args": [
                    [
                        [
                            0,
                            1,
                            1
                        ],
                        [
                            1,
                            1,
                            1
                        ],
                        [
                            1,
                            0,
                            0
                        ]
                    ],
                    1
                ],
                "expected": -1,
                "isHidden": false
            }
        ]
    },
    {
        "id": "goog-9",
        "company": "google",
        "category": "product",
        "number": 9,
        "title": "Swim in Rising Water",
        "difficulty": "Hard",
        "topic": "Dijkstra & Min-Heap",
        "frequency": "92% in Google Software Intern",
        "context": "Elevation network hydrology simulation",
        "fnName": "solve",
        "params": [
            {
                "name": "grid",
                "type": "int[][]"
            }
        ],
        "returnType": "int",
        "description": "In an `n x n` grid, each cell `(i, j)` has elevation `grid[i][j]`. At time `t`, depth is `t`. You can swim to adjacent cells if their elevation is `<= t`. Return least time to reach bottom-right from top-left.",
        "constraints": [
            "1 <= n <= 50",
            "0 <= grid[i][j] < n^2"
        ],
        "hint": "Min-heap Dijkstra or Binary Search on answer in range [grid[0][0], n*n - 1].",
        "starter": {
            "python": "def solve(grid):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(grid) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(grid):\n    import heapq\n    N = len(grid)\n    pq = [(grid[0][0], 0, 0)]\n    visited = {(0, 0)}\n    while pq:\n        time, r, c = heapq.heappop(pq)\n        if r == N - 1 and c == N - 1: return time\n        for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:\n            nr, nc = r + dr, c + dc\n            if 0 <= nr < N and 0 <= nc < N and (nr, nc) not in visited:\n                visited.add((nr, nc))\n                heapq.heappush(pq, (max(time, grid[nr][nc]), nr, nc))\n    return 0",
            "javascript": "function solve(grid) {\n    const N = grid.length;\n    let low = Math.max(grid[0][0], grid[N-1][N-1]), high = N * N - 1;\n    const canReach = (t) => {\n        const visited = Array.from({ length: N }, () => new Array(N).fill(false));\n        const q = [[0, 0]];\n        visited[0][0] = true;\n        let head = 0;\n        while (head < q.length) {\n            const [r, c] = q[head++];\n            if (r === N - 1 && c === N - 1) return true;\n            for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {\n                const nr = r + dr, nc = c + dc;\n                if (nr >= 0 && nr < N && nc >= 0 && nc < N && !visited[nr][nc] && grid[nr][nc] <= t) {\n                    visited[nr][nc] = true;\n                    q.push([nr, nc]);\n                }\n            }\n        }\n        return false;\n    };\n    while (low < high) {\n        const mid = Math.floor((low + high) / 2);\n        if (canReach(mid)) high = mid;\n        else low = mid + 1;\n    }\n    return low;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        [
                            0,
                            2
                        ],
                        [
                            1,
                            3
                        ]
                    ]
                ],
                "expected": 3,
                "isHidden": false
            },
            {
                "args": [
                    [
                        [
                            0,
                            1,
                            2,
                            3,
                            4
                        ],
                        [
                            24,
                            23,
                            22,
                            21,
                            5
                        ],
                        [
                            12,
                            13,
                            14,
                            15,
                            16
                        ],
                        [
                            11,
                            17,
                            18,
                            19,
                            20
                        ],
                        [
                            10,
                            9,
                            8,
                            7,
                            6
                        ]
                    ]
                ],
                "expected": 16,
                "isHidden": false
            }
        ]
    },
    {
        "id": "goog-10",
        "company": "google",
        "category": "product",
        "number": 10,
        "title": "Minimum Cost to Hire K Workers",
        "difficulty": "Hard",
        "topic": "Greedy & Max-Heap",
        "frequency": "91% in Google HQ",
        "context": "Optimal contractor bidding engine",
        "fnName": "solve",
        "params": [
            {
                "name": "quality",
                "type": "int[]"
            },
            {
                "name": "wage",
                "type": "int[]"
            },
            {
                "name": "k",
                "type": "int"
            }
        ],
        "returnType": "float",
        "description": "Given `quality` and minimum `wage` for workers, hire `k` workers such that each worker is paid proportionally to their quality and at least their minimum wage. Return the minimum total salary rounded to 2 decimal places.",
        "constraints": [
            "1 <= k <= quality.length <= 10^4",
            "1 <= quality[i], wage[i] <= 10^4"
        ],
        "hint": "Sort workers by wage/quality ratio ascending. Maintain max-heap of qualities of size k.",
        "starter": {
            "python": "def solve(quality, wage, k):\n    # Write your logic here\n    return 0.0",
            "javascript": "function solve(quality, wage, k) {\n    // Write your logic here\n    return 0.0;\n}"
        },
        "solution": {
            "python": "def solve(quality, wage, k):\n    import heapq\n    workers = sorted([(w / q, q) for w, q in zip(wage, quality)])\n    max_heap = []\n    q_sum = 0\n    min_cost = float('inf')\n    for ratio, q in workers:\n        heapq.heappush(max_heap, -q)\n        q_sum += q\n        if len(max_heap) > k:\n            q_sum += heapq.heappop(max_heap)\n        if len(max_heap) == k:\n            min_cost = min(min_cost, ratio * q_sum)\n    return round(float(min_cost), 2)",
            "javascript": "function solve(quality, wage, k) {\n    const workers = quality.map((q, i) => ({ ratio: wage[i] / q, q })).sort((a, b) => a.ratio - b.ratio);\n    const heap = [];\n    let qSum = 0, minCost = Infinity;\n    for (const w of workers) {\n        heap.push(w.q);\n        heap.sort((a, b) => b - a);\n        qSum += w.q;\n        if (heap.length > k) {\n            qSum -= heap.shift();\n        }\n        if (heap.length === k) {\n            minCost = Math.min(minCost, w.ratio * qSum);\n        }\n    }\n    return Math.round(minCost * 100) / 100;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        10,
                        20,
                        5
                    ],
                    [
                        70,
                        50,
                        30
                    ],
                    2
                ],
                "expected": 105,
                "isHidden": false
            },
            {
                "args": [
                    [
                        3,
                        1,
                        10,
                        10,
                        1
                    ],
                    [
                        4,
                        8,
                        2,
                        2,
                        7
                    ],
                    3
                ],
                "expected": 30.67,
                "isHidden": false
            }
        ]
    },
    {
        "id": "goog-11",
        "company": "google",
        "category": "product",
        "number": 11,
        "title": "Course Schedule II (Build Order Dependency)",
        "difficulty": "Medium",
        "topic": "Topological Sort",
        "frequency": "95% in Google SRE",
        "context": "Google Blaze/Bazel build target resolution",
        "fnName": "solve",
        "params": [
            {
                "name": "numCourses",
                "type": "int"
            },
            {
                "name": "prerequisites",
                "type": "int[][]"
            }
        ],
        "returnType": "int[]",
        "description": "There are `numCourses` courses labeled `0` to `numCourses - 1`. Given prerequisites `[a, b]` meaning you must take `b` before `a`. Return topological ordering of courses to finish all, or empty array if impossible.",
        "constraints": [
            "1 <= numCourses <= 2000",
            "0 <= prerequisites.length <= numCourses * (numCourses - 1)"
        ],
        "hint": "Kahn's BFS with in-degrees.",
        "starter": {
            "python": "def solve(numCourses, prerequisites):\n    # Write your logic here\n    return []",
            "javascript": "function solve(numCourses, prerequisites) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(numCourses, prerequisites):\n    from collections import deque\n    adj = [[] for _ in range(numCourses)]\n    in_deg = [0] * numCourses\n    for dest, src in prerequisites:\n        adj[src].append(dest)\n        in_deg[dest] += 1\n    q = deque([i for i in range(numCourses) if in_deg[i] == 0])\n    res = []\n    while q:\n        u = q.popleft()\n        res.append(u)\n        for v in adj[u]:\n            in_deg[v] -= 1\n            if in_deg[v] == 0: q.append(v)\n    return res if len(res) == numCourses else []",
            "javascript": "function solve(numCourses, prerequisites) {\n    const adj = Array.from({ length: numCourses }, () => []);\n    const inDeg = new Array(numCourses).fill(0);\n    for (const [dest, src] of prerequisites) {\n        adj[src].push(dest);\n        inDeg[dest]++;\n    }\n    const q = [];\n    for (let i = 0; i < numCourses; i++) if (inDeg[i] === 0) q.push(i);\n    const res = [];\n    while (q.length > 0) {\n        const u = q.shift();\n        res.push(u);\n        for (const v of adj[u]) {\n            inDeg[v]--;\n            if (inDeg[v] === 0) q.push(v);\n        }\n    }\n    return res.length === numCourses ? res : [];\n}"
        },
        "testCases": [
            {
                "args": [
                    2,
                    [
                        [
                            1,
                            0
                        ]
                    ]
                ],
                "expected": [
                    0,
                    1
                ],
                "isHidden": false
            },
            {
                "args": [
                    4,
                    [
                        [
                            1,
                            0
                        ],
                        [
                            2,
                            0
                        ],
                        [
                            3,
                            1
                        ],
                        [
                            3,
                            2
                        ]
                    ]
                ],
                "expected": [
                    0,
                    1,
                    2,
                    3
                ],
                "isHidden": false
            }
        ]
    },
    {
        "id": "goog-12",
        "company": "google",
        "category": "product",
        "number": 12,
        "title": "Expressive Words Stretchy Groups",
        "difficulty": "Medium",
        "topic": "Two Pointers",
        "frequency": "90% in Google Search",
        "context": "Query spelling correction for elongated repeated letters (e.g., 'heeeellooo')",
        "fnName": "solve",
        "params": [
            {
                "name": "s",
                "type": "string"
            },
            {
                "name": "words",
                "type": "string[]"
            }
        ],
        "returnType": "int",
        "description": "A query string `s` is stretchy if words can be extended by adding letters to make consecutive groups of length >= 3. Count how many words in `words` can be stretched into `s`.",
        "constraints": [
            "1 <= s.length, words.length <= 100"
        ],
        "hint": "Run-length encode s and query word. Compare matching characters and lengths.",
        "starter": {
            "python": "def solve(s, words):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(s, words) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(s, words):\n    def rle(text):\n        res = []\n        i = 0\n        while i < len(text):\n            j = i\n            while j < len(text) and text[j] == text[i]: j += 1\n            res.append((text[i], j - i))\n            i = j\n        return res\n    rle_s = rle(s)\n    count = 0\n    for w in words:\n        rle_w = rle(w)\n        if len(rle_s) != len(rle_w): continue\n        match = True\n        for (c1, l1), (c2, l2) in zip(rle_s, rle_w):\n            if c1 != c2 or l1 < l2 or (l1 > l2 and l1 < 3):\n                match = False; break\n        if match: count += 1\n    return count",
            "javascript": "function solve(s, words) {\n    const rle = (str) => {\n        const res = [];\n        let i = 0;\n        while (i < str.length) {\n            let j = i;\n            while (j < str.length && str[j] === str[i]) j++;\n            res.push([str[i], j - i]);\n            i = j;\n        }\n        return res;\n    };\n    const rleS = rle(s);\n    let count = 0;\n    for (const w of words) {\n        const rleW = rle(w);\n        if (rleS.length !== rleW.length) continue;\n        let ok = true;\n        for (let i = 0; i < rleS.length; i++) {\n            const [c1, l1] = rleS[i], [c2, l2] = rleW[i];\n            if (c1 !== c2 || l1 < l2 || (l1 > l2 && l1 < 3)) { ok = false; break; }\n        }\n        if (ok) count++;\n    }\n    return count;\n}"
        },
        "testCases": [
            {
                "args": [
                    "heeellooo",
                    [
                        "hello",
                        "hi",
                        "helo"
                    ]
                ],
                "expected": 1,
                "isHidden": false
            },
            {
                "args": [
                    "zzzzzyyyyy",
                    [
                        "zzyy",
                        "zy",
                        "zyy"
                    ]
                ],
                "expected": 3,
                "isHidden": false
            }
        ]
    },
    {
        "id": "goog-13",
        "company": "google",
        "category": "product",
        "number": 13,
        "title": "Longest Absolute File Path",
        "difficulty": "Medium",
        "topic": "Stack & String Parsing",
        "frequency": "91% in Google Drive",
        "context": "Virtual hierarchical file system serialization",
        "fnName": "solve",
        "params": [
            {
                "name": "input",
                "type": "string"
            }
        ],
        "returnType": "int",
        "description": "Given a string `input` representing the file system where subdirectories are tab-indented (`\\t`), find the length of the longest absolute path to a file. A file contains a `.` delimiter. If no file exists, return 0.",
        "constraints": [
            "1 <= input.length <= 10^4"
        ],
        "hint": "Split by newline. Count tabs to determine depth. Maintain current path lengths in a stack or dictionary.",
        "starter": {
            "python": "def solve(input):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(input) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(input):\n    depth_len = {0: 0}\n    max_len = 0\n    for line in input.split('\\n'):\n        depth = line.count('\\t')\n        name = line.replace('\\t', '')\n        if '.' in name:\n            max_len = max(max_len, depth_len[depth] + len(name))\n        else:\n            depth_len[depth + 1] = depth_len[depth] + len(name) + 1\n    return max_len",
            "javascript": "function solve(input) {\n    const depthLen = { 0: 0 };\n    let maxLen = 0;\n    for (const line of input.split('\\n')) {\n        let depth = 0;\n        while (line[depth] === '\\t') depth++;\n        const name = line.substring(depth);\n        if (name.includes('.')) {\n            maxLen = Math.max(maxLen, (depthLen[depth] || 0) + name.length);\n        } else {\n            depthLen[depth + 1] = (depthLen[depth] || 0) + name.length + 1;\n        }\n    }\n    return maxLen;\n}"
        },
        "testCases": [
            {
                "args": [
                    "dir\n\tsubdir1\n\tsubdir2\n\t\tfile.ext"
                ],
                "expected": 20,
                "isHidden": false
            },
            {
                "args": [
                    "dir\n\tsubdir1\n\t\tfile1.ext\n\t\tsubsubdir1\n\tsubdir2\n\t\tsubsubdir2\n\t\t\tfile2.ext"
                ],
                "expected": 32,
                "isHidden": false
            }
        ]
    },
    {
        "id": "goog-14",
        "company": "google",
        "category": "product",
        "number": 14,
        "title": "Cracking the Safe (De Bruijn Sequence)",
        "difficulty": "Hard",
        "topic": "Eulerian Circuit",
        "frequency": "90% in Google Security",
        "context": "Cryptographic PIN cracker test suite",
        "fnName": "solve",
        "params": [
            {
                "name": "n",
                "type": "int"
            },
            {
                "name": "k",
                "type": "int"
            }
        ],
        "returnType": "string",
        "description": "A safe has an `n` digit password using digits from `0` to `k-1`. Any subsequence of `n` consecutive digits unlocks it. Return shortest string that unlocks the safe.",
        "constraints": [
            "1 <= n <= 4",
            "1 <= k <= 10",
            "k^n <= 4096"
        ],
        "hint": "Hierholzer's algorithm on De Bruijn graph where nodes are prefixes of length n-1.",
        "starter": {
            "python": "def solve(n, k):\n    # Write your logic here\n    return \"\"",
            "javascript": "function solve(n, k) {\n    // Write your logic here\n    return \"\";\n}"
        },
        "solution": {
            "python": "def solve(n, k):\n    if n == 1: return \"\".join(str(i) for i in range(k))\n    visited = set()\n    res = []\n    def dfs(node):\n        for x in range(k):\n            edge = node + str(x)\n            if edge not in visited:\n                visited.add(edge)\n                dfs(edge[1:])\n                res.append(str(x))\n    start = \"0\" * (n - 1)\n    dfs(start)\n    return \"\".join(res) + start",
            "javascript": "function solve(n, k) {\n    if (n === 1) return Array.from({ length: k }, (_, i) => i).join('');\n    const visited = new Set();\n    const res = [];\n    const dfs = (node) => {\n        for (let x = 0; x < k; x++) {\n            const edge = node + x;\n            if (!visited.has(edge)) {\n                visited.add(edge);\n                dfs(edge.slice(1));\n                res.push(x);\n            }\n        }\n    };\n    const start = '0'.repeat(n - 1);\n    dfs(start);\n    return res.join('') + start;\n}"
        },
        "testCases": [
            {
                "args": [
                    1,
                    2
                ],
                "expected": "01",
                "isHidden": false
            },
            {
                "args": [
                    2,
                    2
                ],
                "expected": "01100",
                "isHidden": false
            }
        ]
    },
    {
        "id": "goog-15",
        "company": "google",
        "category": "product",
        "number": 15,
        "title": "Sliding Window Maximum (Monotonic Queue)",
        "difficulty": "Hard",
        "topic": "Monotonic Queue",
        "frequency": "97% in Google Streaming",
        "context": "YouTube real-time video bit-rate smoothing",
        "fnName": "solve",
        "params": [
            {
                "name": "nums",
                "type": "int[]"
            },
            {
                "name": "k",
                "type": "int"
            }
        ],
        "returnType": "int[]",
        "description": "Given array `nums` and sliding window of size `k` moving from left to right. Return maximum element in each window.",
        "constraints": [
            "1 <= nums.length <= 10^5",
            "1 <= k <= nums.length"
        ],
        "hint": "Maintain a monotonic decreasing deque of indices in O(N) total time.",
        "starter": {
            "python": "def solve(nums, k):\n    # Write your logic here\n    return []",
            "javascript": "function solve(nums, k) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(nums, k):\n    from collections import deque\n    dq = deque()\n    res = []\n    for i, x in enumerate(nums):\n        if dq and dq[0] <= i - k:\n            dq.popleft()\n        while dq and nums[dq[-1]] <= x:\n            dq.pop()\n        dq.append(i)\n        if i >= k - 1:\n            res.append(nums[dq[0]])\n    return res",
            "javascript": "function solve(nums, k) {\n    const dq = [];\n    const res = [];\n    for (let i = 0; i < nums.length; i++) {\n        if (dq.length && dq[0] <= i - k) dq.shift();\n        while (dq.length && nums[dq[dq.length - 1]] <= nums[i]) dq.pop();\n        dq.push(i);\n        if (i >= k - 1) res.push(nums[dq[0]]);\n    }\n    return res;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        1,
                        3,
                        -1,
                        -3,
                        5,
                        3,
                        6,
                        7
                    ],
                    3
                ],
                "expected": [
                    3,
                    3,
                    5,
                    5,
                    6,
                    7
                ],
                "isHidden": false
            },
            {
                "args": [
                    [
                        1
                    ],
                    1
                ],
                "expected": [
                    1
                ],
                "isHidden": false
            }
        ]
    },
    {
        "id": "goog-16",
        "company": "google",
        "category": "product",
        "number": 16,
        "title": "Accounts Merge (Email Disjoint Set)",
        "difficulty": "Medium",
        "topic": "Union-Find",
        "frequency": "95% in Google Contacts",
        "context": "Consolidating duplicate user profiles across Gmail",
        "fnName": "solve",
        "params": [
            {
                "name": "accounts",
                "type": "string[][]"
            }
        ],
        "returnType": "string[][]",
        "description": "Given a list of `accounts` where `accounts[i] = [name, email1, email2, ...]`. Merge accounts that share at least one email. Return merged accounts with sorted emails.",
        "constraints": [
            "1 <= accounts.length <= 1000",
            "2 <= accounts[i].length <= 10"
        ],
        "hint": "Union-Find linking emails that belong to the same account. Map root email to account name.",
        "starter": {
            "python": "def solve(accounts):\n    # Write your logic here\n    return []",
            "javascript": "function solve(accounts) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(accounts):\n    parent = {}\n    email_to_name = {}\n    def find(x):\n        if parent[x] != x:\n            parent[x] = find(parent[x])\n        return parent[x]\n    def union(x, y):\n        parent.setdefault(x, x); parent.setdefault(y, y)\n        rx, ry = find(x), find(y)\n        if rx != ry: parent[rx] = ry\n    for acc in accounts:\n        name = acc[0]\n        first = acc[1]\n        for email in acc[1:]:\n            email_to_name[email] = name\n            union(first, email)\n    from collections import defaultdict\n    groups = defaultdict(list)\n    for email in email_to_name:\n        groups[find(email)].append(email)\n    res = []\n    for root, emails in sorted(groups.items()):\n        res.append([email_to_name[root]] + sorted(emails))\n    return sorted(res)",
            "javascript": "function solve(accounts) {\n    const parent = {};\n    const emailToName = {};\n    const find = (x) => {\n        if (parent[x] !== x) parent[x] = find(parent[x]);\n        return parent[x];\n    };\n    const union = (x, y) => {\n        if (!parent[x]) parent[x] = x;\n        if (!parent[y]) parent[y] = y;\n        const rx = find(x), ry = find(y);\n        if (rx !== ry) parent[rx] = ry;\n    };\n    for (const acc of accounts) {\n        const name = acc[0];\n        const first = acc[1];\n        for (let i = 1; i < acc.length; i++) {\n            emailToName[acc[i]] = name;\n            union(first, acc[i]);\n        }\n    }\n    const groups = {};\n    for (const email of Object.keys(emailToName)) {\n        const root = find(email);\n        if (!groups[root]) groups[root] = [];\n        groups[root].push(email);\n    }\n    const res = Object.entries(groups).map(([root, emails]) => [emailToName[root], ...emails.sort()]);\n    return res.sort((a, b) => a[0].localeCompare(b[0]));\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        [
                            "John",
                            "johnsmith@mail.com",
                            "john_newyork@mail.com"
                        ],
                        [
                            "John",
                            "johnsmith@mail.com",
                            "john00@mail.com"
                        ],
                        [
                            "Mary",
                            "mary@mail.com"
                        ],
                        [
                            "John",
                            "johnnybravo@mail.com"
                        ]
                    ]
                ],
                "expected": [
                    [
                        "John",
                        "john00@mail.com",
                        "john_newyork@mail.com",
                        "johnsmith@mail.com"
                    ],
                    [
                        "John",
                        "johnnybravo@mail.com"
                    ],
                    [
                        "Mary",
                        "mary@mail.com"
                    ]
                ],
                "isHidden": false
            }
        ]
    },
    {
        "id": "goog-17",
        "company": "google",
        "category": "product",
        "number": 17,
        "title": "Number of Matching Subsequences",
        "difficulty": "Medium",
        "topic": "Binary Search & Bucketing",
        "frequency": "93% in Google Query Match",
        "context": "High throughput keyword token filtering",
        "fnName": "solve",
        "params": [
            {
                "name": "s",
                "type": "string"
            },
            {
                "name": "words",
                "type": "string[]"
            }
        ],
        "returnType": "int",
        "description": "Given a string `s` and array of string `words`, return the number of `words[i]` that are subsequences of `s`.",
        "constraints": [
            "1 <= s.length <= 5 * 10^4",
            "1 <= words.length <= 5000",
            "1 <= words[i].length <= 50"
        ],
        "hint": "Bucket words by their next expected character. Advance bucket pointers as you iterate over s.",
        "starter": {
            "python": "def solve(s, words):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(s, words) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(s, words):\n    from collections import defaultdict\n    heads = defaultdict(list)\n    for w in words:\n        heads[w[0]].append((w, 0))\n    count = 0\n    for c in s:\n        if c in heads:\n            batch = heads[c]\n            heads[c] = []\n            for w, idx in batch:\n                if idx + 1 == len(w):\n                    count += 1\n                else:\n                    heads[w[idx + 1]].append((w, idx + 1))\n    return count",
            "javascript": "function solve(s, words) {\n    const heads = {};\n    for (const w of words) {\n        if (!heads[w[0]]) heads[w[0]] = [];\n        heads[w[0]].push({ word: w, idx: 0 });\n    }\n    let count = 0;\n    for (const c of s) {\n        if (heads[c]) {\n            const batch = heads[c];\n            heads[c] = [];\n            for (const item of batch) {\n                if (item.idx + 1 === item.word.length) {\n                    count++;\n                } else {\n                    const nextChar = item.word[item.idx + 1];\n                    if (!heads[nextChar]) heads[nextChar] = [];\n                    heads[nextChar].push({ word: item.word, idx: item.idx + 1 });\n                }\n            }\n        }\n    }\n    return count;\n}"
        },
        "testCases": [
            {
                "args": [
                    "abcde",
                    [
                        "a",
                        "bb",
                        "acd",
                        "ace"
                    ]
                ],
                "expected": 3,
                "isHidden": false
            },
            {
                "args": [
                    "dsahjpjauf",
                    [
                        "ahjpjau",
                        "ja",
                        "ahbwzgqnuk",
                        "tnmlanowax"
                    ]
                ],
                "expected": 2,
                "isHidden": false
            }
        ]
    },
    {
        "id": "goog-18",
        "company": "google",
        "category": "product",
        "number": 18,
        "title": "Find and Replace Pattern (Isomorphic Words)",
        "difficulty": "Medium",
        "topic": "Hash Map Bijection",
        "frequency": "90% in Google Search NLP",
        "context": "Grammar schema mapping in Google Assistant",
        "fnName": "solve",
        "params": [
            {
                "name": "words",
                "type": "string[]"
            },
            {
                "name": "pattern",
                "type": "string"
            }
        ],
        "returnType": "string[]",
        "description": "Given a list of `words` and a string `pattern`, return all words that match the pattern. A word matches if there exists a bijection between characters in word and characters in pattern.",
        "constraints": [
            "1 <= words.length <= 100",
            "pattern.length <= 20"
        ],
        "hint": "Check bijection: map w->p and p->w.",
        "starter": {
            "python": "def solve(words, pattern):\n    # Write your logic here\n    return []",
            "javascript": "function solve(words, pattern) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(words, pattern):\n    def match(w):\n        if len(w) != len(pattern): return False\n        m1, m2 = {}, {}\n        for c1, c2 in zip(w, pattern):\n            if m1.setdefault(c1, c2) != c2 or m2.setdefault(c2, c1) != c1: return False\n        return True\n    return [w for w in words if match(w)]",
            "javascript": "function solve(words, pattern) {\n    const match = (w) => {\n        if (w.length !== pattern.length) return false;\n        const m1 = {}, m2 = {};\n        for (let i = 0; i < w.length; i++) {\n            const c1 = w[i], c2 = pattern[i];\n            if (m1[c1] && m1[c1] !== c2) return false;\n            if (m2[c2] && m2[c2] !== c1) return false;\n            m1[c1] = c2;\n            m2[c2] = c1;\n        }\n        return true;\n    };\n    return words.filter(match);\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        "abc",
                        "deq",
                        "mee",
                        "aqq",
                        "dkd",
                        "ccc"
                    ],
                    "abb"
                ],
                "expected": [
                    "mee",
                    "aqq"
                ],
                "isHidden": false
            },
            {
                "args": [
                    [
                        "a",
                        "b",
                        "c"
                    ],
                    "a"
                ],
                "expected": [
                    "a",
                    "b",
                    "c"
                ],
                "isHidden": false
            }
        ]
    },
    {
        "id": "goog-19",
        "company": "google",
        "category": "product",
        "number": 19,
        "title": "Evaluate Division Equations (Graph Paths)",
        "difficulty": "Medium",
        "topic": "Graph & DFS",
        "frequency": "96% in Google Finance",
        "context": "Currency & unit ratio conversions in Google Calculator",
        "fnName": "solve",
        "params": [
            {
                "name": "equations",
                "type": "string[][]"
            },
            {
                "name": "values",
                "type": "float[]"
            },
            {
                "name": "queries",
                "type": "string[][]"
            }
        ],
        "returnType": "float[]",
        "description": "Given equations `[Ai, Bi]` with `Ai / Bi = values[i]`, and queries `[Cj, Dj]`. Compute each `Cj / Dj`. Return `-1.0` if variable is unknown or no path exists.",
        "constraints": [
            "1 <= equations.length <= 20",
            "values.length == equations.length",
            "1 <= queries.length <= 20"
        ],
        "hint": "Construct weighted directed graph. Find path product using DFS or BFS.",
        "starter": {
            "python": "def solve(equations, values, queries):\n    # Write your logic here\n    return []",
            "javascript": "function solve(equations, values, queries) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(equations, values, queries):\n    from collections import defaultdict\n    graph = defaultdict(dict)\n    for (u, v), val in zip(equations, values):\n        graph[u][v] = val\n        graph[v][u] = 1.0 / val\n    def dfs(src, target, visited):\n        if src not in graph or target not in graph: return -1.0\n        if target in graph[src]: return graph[src][target]\n        visited.add(src)\n        for neighbor, weight in graph[src].items():\n            if neighbor not in visited:\n                sub = dfs(neighbor, target, visited)\n                if sub != -1.0: return weight * sub\n        return -1.0\n    return [round(dfs(c, d, set()), 5) for c, d in queries]",
            "javascript": "function solve(equations, values, queries) {\n    const graph = {};\n    for (let i = 0; i < equations.length; i++) {\n        const [u, v] = equations[i], val = values[i];\n        if (!graph[u]) graph[u] = {};\n        if (!graph[v]) graph[v] = {};\n        graph[u][v] = val;\n        graph[v][u] = 1.0 / val;\n    }\n    const dfs = (src, target, visited) => {\n        if (!graph[src] || !graph[target]) return -1.0;\n        if (graph[src][target] !== undefined) return graph[src][target];\n        visited.add(src);\n        for (const [neighbor, weight] of Object.entries(graph[src])) {\n            if (!visited.has(neighbor)) {\n                const sub = dfs(neighbor, target, visited);\n                if (sub !== -1.0) return weight * sub;\n            }\n        }\n        return -1.0;\n    };\n    return queries.map(([c, d]) => {\n        const ans = dfs(c, d, new Set());\n        return ans === -1.0 ? -1.0 : Math.round(ans * 100000) / 100000;\n    });\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        [
                            "a",
                            "b"
                        ],
                        [
                            "b",
                            "c"
                        ]
                    ],
                    [
                        2,
                        3
                    ],
                    [
                        [
                            "a",
                            "c"
                        ],
                        [
                            "b",
                            "a"
                        ],
                        [
                            "a",
                            "e"
                        ],
                        [
                            "a",
                            "a"
                        ],
                        [
                            "x",
                            "x"
                        ]
                    ]
                ],
                "expected": [
                    6,
                    0.5,
                    -1,
                    1,
                    -1
                ],
                "isHidden": false
            }
        ]
    },
    {
        "id": "goog-20",
        "company": "google",
        "category": "product",
        "number": 20,
        "title": "Count Complete Tree Nodes in Sublinear Time",
        "difficulty": "Medium",
        "topic": "Binary Tree Search",
        "frequency": "94% in Google Core",
        "context": "Tree sizing in Google indexing structures",
        "fnName": "solve",
        "params": [
            {
                "name": "tree",
                "type": "int[]"
            }
        ],
        "returnType": "int",
        "description": "Given a complete binary tree represented as level-order array where missing nodes are marked `-1`. Return total count of valid nodes without traversing all empty positions.",
        "constraints": [
            "0 <= tree.length <= 10^5"
        ],
        "hint": "A complete binary tree has valid values up to its last leaf. Count elements != -1.",
        "starter": {
            "python": "def solve(tree):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(tree) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(tree):\n    return sum(1 for x in tree if x != -1)",
            "javascript": "function solve(tree) {\n    return tree.filter(x => x !== -1).length;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6
                    ]
                ],
                "expected": 6,
                "isHidden": false
            },
            {
                "args": [
                    []
                ],
                "expected": 0,
                "isHidden": false
            }
        ]
    }
];
