export const AMAZON_QUESTIONS = [
    {
        "id": "amz-1",
        "company": "amazon",
        "category": "product",
        "number": 1,
        "title": "Koko Eating Bananas (Speed Optimizer)",
        "difficulty": "Medium",
        "topic": "Binary Search",
        "frequency": "96% in Amazon SDE-1 OA",
        "context": "Amazon warehouse processing rate optimization",
        "fnName": "solve",
        "params": [
            {
                "name": "piles",
                "type": "int[]"
            },
            {
                "name": "h",
                "type": "int"
            }
        ],
        "returnType": "int",
        "description": "Given `n` piles of bananas and `h` hours. In hour `i`, Koko eats at most `k` bananas from pile. If pile has less than `k`, she finishes and waits for next hour. Return the minimum integer `k` such that she can eat all bananas within `h` hours.",
        "constraints": [
            "1 <= piles.length <= 10^4",
            "piles.length <= h <= 10^9"
        ],
        "hint": "Binary search on speed k from 1 to max(piles). Calculate hours required using math.ceil(p / k).",
        "starter": {
            "python": "def solve(piles, h):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(piles, h) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(piles, h):\n    low, high = 1, max(piles)\n    ans = high\n    while low <= high:\n        mid = (low + high) // 2\n        hours = sum((p + mid - 1) // mid for p in piles)\n        if hours <= h:\n            ans = mid\n            high = mid - 1\n        else:\n            low = mid + 1\n    return ans",
            "javascript": "function solve(piles, h) {\n    let low = 1, high = Math.max(...piles), ans = high;\n    while (low <= high) {\n        const mid = Math.floor((low + high) / 2);\n        let hours = 0;\n        for (const p of piles) hours += Math.ceil(p / mid);\n        if (hours <= h) { ans = mid; high = mid - 1; }\n        else low = mid + 1;\n    }\n    return ans;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        3,
                        6,
                        7,
                        11
                    ],
                    8
                ],
                "expected": 4,
                "isHidden": false
            },
            {
                "args": [
                    [
                        30,
                        11,
                        23,
                        4,
                        20
                    ],
                    5
                ],
                "expected": 30,
                "isHidden": false
            },
            {
                "args": [
                    [
                        30,
                        11,
                        23,
                        4,
                        20
                    ],
                    6
                ],
                "expected": 23,
                "isHidden": true
            }
        ]
    },
    {
        "id": "amz-2",
        "company": "amazon",
        "category": "product",
        "number": 2,
        "title": "K Closest Package Locations to Fulfillment Hub",
        "difficulty": "Medium",
        "topic": "Heap & Geometry",
        "frequency": "95% in Amazon SDE-1",
        "context": "Amazon logistics drone dispatch challenge",
        "fnName": "solve",
        "params": [
            {
                "name": "points",
                "type": "int[][]"
            },
            {
                "name": "k",
                "type": "int"
            }
        ],
        "returnType": "int[][]",
        "description": "Given an array of `points` where `points[i] = [xi, yi]` represents package location on X-Y plane and integer `k`, return the `k` closest points to the fulfillment hub `(0, 0)` sorted by distance.",
        "constraints": [
            "1 <= k <= points.length <= 10^4"
        ],
        "hint": "Euclidean squared distance = x*x + y*y. Sort by distance or maintain max-heap of size k.",
        "starter": {
            "python": "def solve(points, k):\n    # Write your logic here\n    return []",
            "javascript": "function solve(points, k) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(points, k):\n    return sorted(points, key=lambda p: p[0]**2 + p[1]**2)[:k]",
            "javascript": "function solve(points, k) {\n    return [...points].sort((a, b) => (a[0]**2 + a[1]**2) - (b[0]**2 + b[1]**2)).slice(0, k);\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        [
                            1,
                            3
                        ],
                        [
                            -2,
                            2
                        ]
                    ],
                    1
                ],
                "expected": [
                    [
                        -2,
                        2
                    ]
                ],
                "isHidden": false
            },
            {
                "args": [
                    [
                        [
                            3,
                            3
                        ],
                        [
                            5,
                            -1
                        ],
                        [
                            -2,
                            4
                        ]
                    ],
                    2
                ],
                "expected": [
                    [
                        3,
                        3
                    ],
                    [
                        -2,
                        4
                    ]
                ],
                "isHidden": false
            }
        ]
    },
    {
        "id": "amz-3",
        "company": "amazon",
        "category": "product",
        "number": 3,
        "title": "Reorder Server Log Files",
        "difficulty": "Medium",
        "topic": "Custom Sorting",
        "frequency": "94% in Amazon SDE-1 OA",
        "context": "Amazon cloud audit log reordering",
        "fnName": "solve",
        "params": [
            {
                "name": "logs",
                "type": "string[]"
            }
        ],
        "returnType": "string[]",
        "description": "Reorder logs: 1) Letter-logs (words after identifier) come before all digit-logs. 2) Letter-logs are sorted lexicographically by content; if contents tie, sort by identifier. 3) Digit-logs maintain their original relative order.",
        "constraints": [
            "1 <= logs.length <= 1000"
        ],
        "hint": "Split each log on first space into identifier and content. Separate letter-logs and digit-logs.",
        "starter": {
            "python": "def solve(logs):\n    # Write your logic here\n    return []",
            "javascript": "function solve(logs) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(logs):\n    letters, digits = [], []\n    for log in logs:\n        idx, content = log.split(' ', 1)\n        if content[0].isalpha(): letters.append((content, idx, log))\n        else: digits.append(log)\n    letters.sort(key=lambda x: (x[0], x[1]))\n    return [item[2] for item in letters] + digits",
            "javascript": "function solve(logs) {\n    const letters = [], digits = [];\n    for (const log of logs) {\n        const space = log.indexOf(' ');\n        const id = log.slice(0, space), body = log.slice(space + 1);\n        if (body[0] >= 'a' && body[0] <= 'z') letters.push({ id, body, log });\n        else digits.push(log);\n    }\n    letters.sort((a, b) => a.body === b.body ? a.id.localeCompare(b.id) : a.body.localeCompare(b.body));\n    return [...letters.map(x => x.log), ...digits];\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        "dig1 8 1 5 1",
                        "let1 art can",
                        "dig2 3 6",
                        "let2 own kit dig",
                        "let3 art zero"
                    ]
                ],
                "expected": [
                    "let1 art can",
                    "let3 art zero",
                    "let2 own kit dig",
                    "dig1 8 1 5 1",
                    "dig2 3 6"
                ],
                "isHidden": false
            },
            {
                "args": [
                    [
                        "a1 9 2 3 1",
                        "g1 act car",
                        "zo4 4 7",
                        "ab1 off key dog",
                        "a8 act zoo"
                    ]
                ],
                "expected": [
                    "g1 act car",
                    "a8 act zoo",
                    "ab1 off key dog",
                    "a1 9 2 3 1",
                    "zo4 4 7"
                ],
                "isHidden": false
            }
        ]
    },
    {
        "id": "amz-4",
        "company": "amazon",
        "category": "product",
        "number": 4,
        "title": "LRU Cache Operations Simulator",
        "difficulty": "Medium",
        "topic": "Hash Map & Linked List",
        "frequency": "98% in Amazon SDE-1 & SDE-2",
        "context": "Amazon product catalog memory cache",
        "fnName": "solve",
        "params": [
            {
                "name": "capacity",
                "type": "int"
            },
            {
                "name": "operations",
                "type": "string[]"
            },
            {
                "name": "argsList",
                "type": "int[][]"
            }
        ],
        "returnType": "int[]",
        "description": "Simulate an LRU (Least Recently Used) cache with `capacity`. Operations can be 'put(key, val)' or 'get(key)'. For each 'get', output its value (or -1 if not found). For 'put', output -2. Return array of outputs.",
        "constraints": [
            "1 <= capacity <= 3000"
        ],
        "hint": "Use OrderedDict or Doubly Linked List + Map.",
        "starter": {
            "python": "def solve(capacity, operations, argsList):\n    # Write your logic here\n    return []",
            "javascript": "function solve(capacity, operations, argsList) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(capacity, operations, argsList):\n    from collections import OrderedDict\n    cache = OrderedDict()\n    out = []\n    for op, args in zip(operations, argsList):\n        if op == 'put':\n            k, v = args[0], args[1]\n            if k in cache: cache.move_to_end(k)\n            cache[k] = v\n            if len(cache) > capacity: cache.popitem(last=False)\n            out.append(-2)\n        elif op == 'get':\n            k = args[0]\n            if k not in cache: out.append(-1)\n            else:\n                cache.move_to_end(k)\n                out.append(cache[k])\n    return out",
            "javascript": "function solve(capacity, operations, argsList) {\n    const map = new Map();\n    const out = [];\n    for (let i = 0; i < operations.length; i++) {\n        const op = operations[i], args = argsList[i];\n        if (op === 'put') {\n            const [k, v] = args;\n            if (map.has(k)) map.delete(k);\n            else if (map.size >= capacity) map.delete(map.keys().next().value);\n            map.set(k, v);\n            out.push(-2);\n        } else if (op === 'get') {\n            const [k] = args;\n            if (!map.has(k)) out.push(-1);\n            else {\n                const val = map.get(k);\n                map.delete(k);\n                map.set(k, val);\n                out.push(val);\n            }\n        }\n    }\n    return out;\n}"
        },
        "testCases": [
            {
                "args": [
                    2,
                    [
                        "put",
                        "put",
                        "get",
                        "put",
                        "get",
                        "put",
                        "get",
                        "get",
                        "get"
                    ],
                    [
                        [
                            1,
                            1
                        ],
                        [
                            2,
                            2
                        ],
                        [
                            1
                        ],
                        [
                            3,
                            3
                        ],
                        [
                            2
                        ],
                        [
                            4,
                            4
                        ],
                        [
                            1
                        ],
                        [
                            3
                        ],
                        [
                            4
                        ]
                    ]
                ],
                "expected": [
                    -2,
                    -2,
                    1,
                    -2,
                    -1,
                    -2,
                    -1,
                    3,
                    4
                ],
                "isHidden": false
            }
        ]
    },
    {
        "id": "amz-5",
        "company": "amazon",
        "category": "product",
        "number": 5,
        "title": "Number of Islands in Warehouse Grid",
        "difficulty": "Medium",
        "topic": "DFS / BFS",
        "frequency": "97% in Amazon SDE-1",
        "context": "Amazon automated guided vehicle zone clustering",
        "fnName": "solve",
        "params": [
            {
                "name": "grid",
                "type": "int[][]"
            }
        ],
        "returnType": "int",
        "description": "Given an `m x n` 2D binary grid where 1 represents land/storage cluster and 0 represents water/empty aisle. An island is surrounded by 0's and formed by connecting adjacent lands horizontally or vertically. Return number of islands.",
        "constraints": [
            "1 <= m, n <= 300"
        ],
        "hint": "DFS/BFS from each unvisited 1, sinking all connected 1's to 0.",
        "starter": {
            "python": "def solve(grid):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(grid) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(grid):\n    if not grid: return 0\n    m, n = len(grid), len(grid[0])\n    g = [row[:] for row in grid]\n    def dfs(r, c):\n        if r < 0 or r >= m or c < 0 or c >= n or g[r][c] != 1: return\n        g[r][c] = 0\n        dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1)\n    islands = 0\n    for i in range(m):\n        for j in range(n):\n            if g[i][j] == 1:\n                islands += 1\n                dfs(i, j)\n    return islands",
            "javascript": "function solve(grid) {\n    if (!grid.length) return 0;\n    const m = grid.length, n = grid[0].length;\n    const g = grid.map(r => [...r]);\n    const dfs = (r, c) => {\n        if (r < 0 || r >= m || c < 0 || c >= n || g[r][c] !== 1) return;\n        g[r][c] = 0;\n        dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1);\n    };\n    let count = 0;\n    for (let i = 0; i < m; i++) {\n        for (let j = 0; j < n; j++) {\n            if (g[i][j] === 1) { count++; dfs(i, j); }\n        }\n    }\n    return count;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        [
                            1,
                            1,
                            1,
                            1,
                            0
                        ],
                        [
                            1,
                            1,
                            0,
                            1,
                            0
                        ],
                        [
                            1,
                            1,
                            0,
                            0,
                            0
                        ],
                        [
                            0,
                            0,
                            0,
                            0,
                            0
                        ]
                    ]
                ],
                "expected": 1,
                "isHidden": false
            },
            {
                "args": [
                    [
                        [
                            1,
                            1,
                            0,
                            0,
                            0
                        ],
                        [
                            1,
                            1,
                            0,
                            0,
                            0
                        ],
                        [
                            0,
                            0,
                            1,
                            0,
                            0
                        ],
                        [
                            0,
                            0,
                            0,
                            1,
                            1
                        ]
                    ]
                ],
                "expected": 3,
                "isHidden": false
            }
        ]
    },
    {
        "id": "amz-6",
        "company": "amazon",
        "category": "product",
        "number": 6,
        "title": "Course Schedule Prerequisite Cycle Check",
        "difficulty": "Medium",
        "topic": "Topological Sort",
        "frequency": "93% in Amazon SDE-1",
        "context": "Amazon onboarding module dependency resolver",
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
        "returnType": "bool",
        "description": "Given `numCourses` and array `prerequisites` where `[a, b]` means course `b` must be taken before course `a`. Return `true` if you can finish all courses (no cyclic dependency), else `false`.",
        "constraints": [
            "1 <= numCourses <= 2000"
        ],
        "hint": "Kahn's Algorithm with in-degrees or 3-state DFS cycle detection.",
        "starter": {
            "python": "def solve(numCourses, prerequisites):\n    # Write your logic here\n    return False",
            "javascript": "function solve(numCourses, prerequisites) {\n    // Write your logic here\n    return false;\n}"
        },
        "solution": {
            "python": "def solve(numCourses, prerequisites):\n    from collections import deque, defaultdict\n    graph = defaultdict(list)\n    in_degree = [0] * numCourses\n    for dest, src in prerequisites:\n        graph[src].append(dest)\n        in_degree[dest] += 1\n    q = deque([i for i in range(numCourses) if in_degree[i] == 0])\n    visited = 0\n    while q:\n        node = q.popleft()\n        visited += 1\n        for nxt in graph[node]:\n            in_degree[nxt] -= 1\n            if in_degree[nxt] == 0: q.append(nxt)\n    return visited == numCourses",
            "javascript": "function solve(numCourses, prerequisites) {\n    const inDegree = new Array(numCourses).fill(0);\n    const adj = Array.from({ length: numCourses }, () => []);\n    for (const [dest, src] of prerequisites) {\n        adj[src].push(dest);\n        inDegree[dest]++;\n    }\n    const queue = [];\n    for (let i = 0; i < numCourses; i++) if (inDegree[i] === 0) queue.push(i);\n    let count = 0;\n    while (queue.length) {\n        const u = queue.shift();\n        count++;\n        for (const v of adj[u]) {\n            if (--inDegree[v] === 0) queue.push(v);\n        }\n    }\n    return count === numCourses;\n}"
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
                "expected": true,
                "isHidden": false
            },
            {
                "args": [
                    2,
                    [
                        [
                            1,
                            0
                        ],
                        [
                            0,
                            1
                        ]
                    ]
                ],
                "expected": false,
                "isHidden": false
            }
        ]
    },
    {
        "id": "amz-7",
        "company": "amazon",
        "category": "product",
        "number": 7,
        "title": "Rotting Oranges Spoilage Countdown",
        "difficulty": "Medium",
        "topic": "Multi-Source BFS",
        "frequency": "95% in Amazon SDE-1",
        "context": "Amazon Fresh inventory spoilage rate",
        "fnName": "solve",
        "params": [
            {
                "name": "grid",
                "type": "int[][]"
            }
        ],
        "returnType": "int",
        "description": "Given `m x n` grid where 0=empty cell, 1=fresh orange, 2=rotten orange. Every minute, any fresh orange 4-directionally adjacent to rotten orange becomes rotten. Return minimum minutes until no cell has fresh orange. If impossible, return -1.",
        "constraints": [
            "1 <= m, n <= 10"
        ],
        "hint": "Multi-source BFS starting with all initial rotten oranges in queue.",
        "starter": {
            "python": "def solve(grid):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(grid) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(grid):\n    from collections import deque\n    m, n = len(grid), len(grid[0])\n    q = deque()\n    fresh = 0\n    for i in range(m):\n        for j in range(n):\n            if grid[i][j] == 2: q.append((i, j, 0))\n            elif grid[i][j] == 1: fresh += 1\n    minutes = 0\n    while q:\n        r, c, d = q.popleft()\n        minutes = max(minutes, d)\n        for dr, dc in [(1, 0), (-1, 0), (0, 1), (0, -1)]:\n            nr, nc = r + dr, c + dc\n            if 0 <= nr < m and 0 <= nc < n and grid[nr][nc] == 1:\n                grid[nr][nc] = 2\n                fresh -= 1\n                q.append((nr, nc, d + 1))\n    return minutes if fresh == 0 else -1",
            "javascript": "function solve(grid) {\n    const m = grid.length, n = grid[0].length;\n    const g = grid.map(r => [...r]);\n    const q = [];\n    let fresh = 0;\n    for (let i = 0; i < m; i++) {\n        for (let j = 0; j < n; j++) {\n            if (g[i][j] === 2) q.push([i, j, 0]);\n            else if (g[i][j] === 1) fresh++;\n        }\n    }\n    let mins = 0;\n    while (q.length) {\n        const [r, c, d] = q.shift();\n        mins = Math.max(mins, d);\n        for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {\n            const nr = r + dr, nc = c + dc;\n            if (nr >= 0 && nr < m && nc >= 0 && nc < n && g[nr][nc] === 1) {\n                g[nr][nc] = 2;\n                fresh--;\n                q.push([nr, nc, d + 1]);\n            }\n        }\n    }\n    return fresh === 0 ? mins : -1;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        [
                            2,
                            1,
                            1
                        ],
                        [
                            1,
                            1,
                            0
                        ],
                        [
                            0,
                            1,
                            1
                        ]
                    ]
                ],
                "expected": 4,
                "isHidden": false
            },
            {
                "args": [
                    [
                        [
                            2,
                            1,
                            1
                        ],
                        [
                            0,
                            1,
                            1
                        ],
                        [
                            1,
                            0,
                            1
                        ]
                    ]
                ],
                "expected": -1,
                "isHidden": false
            },
            {
                "args": [
                    [
                        [
                            0,
                            2
                        ]
                    ]
                ],
                "expected": 0,
                "isHidden": true
            }
        ]
    },
    {
        "id": "amz-8",
        "company": "amazon",
        "category": "product",
        "number": 8,
        "title": "Word Ladder Shortest Transformation Sequence",
        "difficulty": "Hard",
        "topic": "BFS & Word Graphs",
        "frequency": "90% in Amazon SDE-1 & SDE-2",
        "context": "Amazon search query path transform",
        "fnName": "solve",
        "params": [
            {
                "name": "beginWord",
                "type": "string"
            },
            {
                "name": "endWord",
                "type": "string"
            },
            {
                "name": "wordList",
                "type": "string[]"
            }
        ],
        "returnType": "int",
        "description": "Given `beginWord`, `endWord`, and `wordList`, return the number of words in the shortest transformation sequence from `beginWord` to `endWord` (where adjacent words differ by 1 letter and exist in wordList). Return 0 if no sequence exists.",
        "constraints": [
            "1 <= beginWord.length <= 10",
            "1 <= wordList.length <= 5000"
        ],
        "hint": "BFS level by level. Change each char from 'a' to 'z' to find valid neighbors in word set.",
        "starter": {
            "python": "def solve(beginWord, endWord, wordList):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(beginWord, endWord, wordList) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(beginWord, endWord, wordList):\n    from collections import deque\n    words = set(wordList)\n    if endWord not in words: return 0\n    q = deque([(beginWord, 1)])\n    visited = {beginWord}\n    while q:\n        word, steps = q.popleft()\n        if word == endWord: return steps\n        for i in range(len(word)):\n            for c in 'abcdefghijklmnopqrstuvwxyz':\n                nxt = word[:i] + c + word[i+1:]\n                if nxt in words and nxt not in visited:\n                    visited.add(nxt)\n                    q.append((nxt, steps + 1))\n    return 0",
            "javascript": "function solve(beginWord, endWord, wordList) {\n    const words = new Set(wordList);\n    if (!words.has(endWord)) return 0;\n    const q = [[beginWord, 1]];\n    const visited = new Set([beginWord]);\n    while (q.length) {\n        const [word, steps] = q.shift();\n        if (word === endWord) return steps;\n        for (let i = 0; i < word.length; i++) {\n            for (let code = 97; code <= 122; code++) {\n                const c = String.fromCharCode(code);\n                const nxt = word.slice(0, i) + c + word.slice(i + 1);\n                if (words.has(nxt) && !visited.has(nxt)) {\n                    visited.add(nxt);\n                    q.push([nxt, steps + 1]);\n                }\n            }\n        }\n    }\n    return 0;\n}"
        },
        "testCases": [
            {
                "args": [
                    "hit",
                    "cog",
                    [
                        "hot",
                        "dot",
                        "dog",
                        "lot",
                        "log",
                        "cog"
                    ]
                ],
                "expected": 5,
                "isHidden": false
            },
            {
                "args": [
                    "hit",
                    "cog",
                    [
                        "hot",
                        "dot",
                        "dog",
                        "lot",
                        "log"
                    ]
                ],
                "expected": 0,
                "isHidden": false
            }
        ]
    },
    {
        "id": "amz-9",
        "company": "amazon",
        "category": "product",
        "number": 9,
        "title": "Meeting Rooms II (Min Conference Rooms)",
        "difficulty": "Medium",
        "topic": "Intervals & Min-Heap",
        "frequency": "96% in Amazon SDE-1",
        "context": "Amazon corporate meeting room scheduler",
        "fnName": "solve",
        "params": [
            {
                "name": "intervals",
                "type": "int[][]"
            }
        ],
        "returnType": "int",
        "description": "Given an array of meeting time intervals where `intervals[i] = [starti, endi]`, return the minimum number of conference rooms required.",
        "constraints": [
            "1 <= intervals.length <= 10^4"
        ],
        "hint": "Sort start times and end times separately. If start < end[p], allocate room. Else p++.",
        "starter": {
            "python": "def solve(intervals):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(intervals) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(intervals):\n    starts = sorted(i[0] for i in intervals)\n    ends = sorted(i[1] for i in intervals)\n    s_ptr = e_ptr = rooms = max_rooms = 0\n    while s_ptr < len(intervals):\n        if starts[s_ptr] < ends[e_ptr]:\n            rooms += 1\n            s_ptr += 1\n        else:\n            rooms -= 1\n            e_ptr += 1\n        max_rooms = max(max_rooms, rooms)\n    return max_rooms",
            "javascript": "function solve(intervals) {\n    const starts = intervals.map(x => x[0]).sort((a, b) => a - b);\n    const ends = intervals.map(x => x[1]).sort((a, b) => a - b);\n    let s = 0, e = 0, rooms = 0, maxRooms = 0;\n    while (s < intervals.length) {\n        if (starts[s] < ends[e]) { rooms++; s++; }\n        else { rooms--; e++; }\n        maxRooms = Math.max(maxRooms, rooms);\n    }\n    return maxRooms;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        [
                            0,
                            30
                        ],
                        [
                            5,
                            10
                        ],
                        [
                            15,
                            20
                        ]
                    ]
                ],
                "expected": 2,
                "isHidden": false
            },
            {
                "args": [
                    [
                        [
                            7,
                            10
                        ],
                        [
                            2,
                            4
                        ]
                    ]
                ],
                "expected": 1,
                "isHidden": false
            }
        ]
    },
    {
        "id": "amz-10",
        "company": "amazon",
        "category": "product",
        "number": 10,
        "title": "Kth Largest Element in an Array",
        "difficulty": "Medium",
        "topic": "QuickSelect / Heap",
        "frequency": "94% in Amazon SDE-1",
        "context": "Amazon product rank percentile",
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
        "description": "Given an integer array `nums` and integer `k`, return the `k`th largest element in the array.",
        "constraints": [
            "1 <= k <= nums.length <= 10^5",
            "-10^4 <= nums[i] <= 10^4"
        ],
        "hint": "Sort descending and return index k-1, or use a min-heap of size k.",
        "starter": {
            "python": "def solve(nums, k):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(nums, k) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(nums, k):\n    return sorted(nums, reverse=True)[k - 1]",
            "javascript": "function solve(nums, k) {\n    return [...nums].sort((a, b) => b - a)[k - 1];\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        3,
                        2,
                        1,
                        5,
                        6,
                        4
                    ],
                    2
                ],
                "expected": 5,
                "isHidden": false
            },
            {
                "args": [
                    [
                        3,
                        2,
                        3,
                        1,
                        2,
                        4,
                        5,
                        5,
                        6
                    ],
                    4
                ],
                "expected": 4,
                "isHidden": false
            }
        ]
    },
    {
        "id": "amz-11",
        "company": "amazon",
        "category": "product",
        "number": 11,
        "title": "Find Median from Unsorted Data Stream Simulation",
        "difficulty": "Hard",
        "topic": "Two Heaps",
        "frequency": "91% in Amazon SDE-1",
        "context": "Amazon dynamic pricing median",
        "fnName": "solve",
        "params": [
            {
                "name": "nums",
                "type": "int[]"
            }
        ],
        "returnType": "int",
        "description": "Given array `nums`, compute the running median after all elements have been inserted. If even length, return Math.floor((mid1 + mid2) / 2).",
        "constraints": [
            "1 <= nums.length <= 10^4"
        ],
        "hint": "Sort the array. If length is odd return middle element; if even return floor of average of two middle elements.",
        "starter": {
            "python": "def solve(nums):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(nums) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(nums):\n    s = sorted(nums)\n    n = len(s)\n    if n % 2 == 1: return s[n // 2]\n    return (s[n // 2 - 1] + s[n // 2]) // 2",
            "javascript": "function solve(nums) {\n    const s = [...nums].sort((a, b) => a - b);\n    const n = s.length;\n    if (n % 2 === 1) return s[Math.floor(n / 2)];\n    return Math.floor((s[n / 2 - 1] + s[n / 2]) / 2);\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        2,
                        3,
                        4
                    ]
                ],
                "expected": 3,
                "isHidden": false
            },
            {
                "args": [
                    [
                        2,
                        3
                    ]
                ],
                "expected": 2,
                "isHidden": false
            }
        ]
    },
    {
        "id": "amz-12",
        "company": "amazon",
        "category": "product",
        "number": 12,
        "title": "Lowest Common Ancestor in Binary Tree Array Representation",
        "difficulty": "Medium",
        "topic": "Trees",
        "frequency": "93% in Amazon SDE-1",
        "context": "Amazon organizational reporting hierarchy",
        "fnName": "solve",
        "params": [
            {
                "name": "tree",
                "type": "int[]"
            },
            {
                "name": "p",
                "type": "int"
            },
            {
                "name": "q",
                "type": "int"
            }
        ],
        "returnType": "int",
        "description": "Given complete binary tree in array level order (index 0 is root, left child 2*i+1, right child 2*i+2, -1 is null). Find the value of the Lowest Common Ancestor (LCA) of nodes with values `p` and `q`.",
        "constraints": [
            "1 <= tree.length <= 1000",
            "p, q exist in tree"
        ],
        "hint": "Find path from root to p, and path from root to q. Return last common element on both paths.",
        "starter": {
            "python": "def solve(tree, p, q):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(tree, p, q) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(tree, p, q):\n    def get_path(target):\n        if target not in tree: return []\n        idx = tree.index(target)\n        path = []\n        while idx >= 0:\n            path.append(tree[idx])\n            if idx == 0: break\n            idx = (idx - 1) // 2\n        return path[::-1]\n    p1, p2 = get_path(p), get_path(q)\n    lca = tree[0]\n    for a, b in zip(p1, p2):\n        if a == b: lca = a\n        else: break\n    return lca",
            "javascript": "function solve(tree, p, q) {\n    const getPath = (target) => {\n        let idx = tree.indexOf(target);\n        const path = [];\n        while (idx >= 0) {\n            path.push(tree[idx]);\n            if (idx === 0) break;\n            idx = Math.floor((idx - 1) / 2);\n        }\n        return path.reverse();\n    };\n    const p1 = getPath(p), p2 = getPath(q);\n    let lca = tree[0];\n    for (let i = 0; i < Math.min(p1.length, p2.length); i++) {\n        if (p1[i] === p2[i]) lca = p1[i];\n        else break;\n    }\n    return lca;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        3,
                        5,
                        1,
                        6,
                        2,
                        0,
                        8,
                        -1,
                        -1,
                        7,
                        4
                    ],
                    5,
                    1
                ],
                "expected": 3,
                "isHidden": false
            },
            {
                "args": [
                    [
                        3,
                        5,
                        1,
                        6,
                        2,
                        0,
                        8,
                        -1,
                        -1,
                        7,
                        4
                    ],
                    5,
                    4
                ],
                "expected": 5,
                "isHidden": false
            }
        ]
    },
    {
        "id": "amz-13",
        "company": "amazon",
        "category": "product",
        "number": 13,
        "title": "Binary Tree Right Side Visible Nodes",
        "difficulty": "Medium",
        "topic": "BFS Level Order",
        "frequency": "90% in Amazon SDE-1",
        "context": "Amazon warehouse shelf camera perspective",
        "fnName": "solve",
        "params": [
            {
                "name": "tree",
                "type": "int[]"
            }
        ],
        "returnType": "int[]",
        "description": "Given complete binary tree array (level order, -1 for null). Return values of nodes visible from right side (last node of each level).",
        "constraints": [
            "1 <= tree.length <= 1000"
        ],
        "hint": "BFS level by level. Append the rightmost non-(-1) node of each level.",
        "starter": {
            "python": "def solve(tree):\n    # Write your logic here\n    return []",
            "javascript": "function solve(tree) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(tree):\n    if not tree or tree[0] == -1: return []\n    res = []\n    level_size = 1\n    idx = 0\n    while idx < len(tree):\n        end = min(idx + level_size, len(tree))\n        level = [tree[i] for i in range(idx, end) if tree[i] != -1]\n        if level: res.append(level[-1])\n        idx = end\n        level_size *= 2\n    return res",
            "javascript": "function solve(tree) {\n    if (!tree.length || tree[0] === -1) return [];\n    const res = [];\n    let levelSize = 1, idx = 0;\n    while (idx < tree.length) {\n        const end = Math.min(idx + levelSize, tree.length);\n        let last = -1;\n        for (let i = idx; i < end; i++) if (tree[i] !== -1) last = tree[i];\n        if (last !== -1) res.push(last);\n        idx = end;\n        levelSize *= 2;\n    }\n    return res;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        1,
                        2,
                        3,
                        -1,
                        5,
                        -1,
                        4
                    ]
                ],
                "expected": [
                    1,
                    3,
                    4
                ],
                "isHidden": false
            },
            {
                "args": [
                    [
                        1,
                        -1,
                        3
                    ]
                ],
                "expected": [
                    1,
                    3
                ],
                "isHidden": false
            }
        ]
    },
    {
        "id": "amz-14",
        "company": "amazon",
        "category": "product",
        "number": 14,
        "title": "Word Search in Character Grid (Backtracking)",
        "difficulty": "Medium",
        "topic": "DFS & Backtracking",
        "frequency": "93% in Amazon SDE-1",
        "context": "Amazon text grid search",
        "fnName": "solve",
        "params": [
            {
                "name": "board",
                "type": "string[][]"
            },
            {
                "name": "word",
                "type": "string"
            }
        ],
        "returnType": "bool",
        "description": "Given an `m x n` grid of characters and a string `word`, return `true` if `word` exists in the grid (formed from horizontally or vertically adjacent cells without reusing a cell in the same word).",
        "constraints": [
            "1 <= m, n <= 6",
            "1 <= word.length <= 15"
        ],
        "hint": "Backtracking DFS: match board[r][c] with word[k]. Mark cell visited temporarily.",
        "starter": {
            "python": "def solve(board, word):\n    # Write your logic here\n    return False",
            "javascript": "function solve(board, word) {\n    // Write your logic here\n    return false;\n}"
        },
        "solution": {
            "python": "def solve(board, word):\n    m, n = len(board), len(board[0])\n    def dfs(r, c, k):\n        if k == len(word): return True\n        if r < 0 or r >= m or c < 0 or c >= n or board[r][c] != word[k]: return False\n        tmp, board[r][c] = board[r][c], '#'\n        res = dfs(r+1, c, k+1) or dfs(r-1, c, k+1) or dfs(r, c+1, k+1) or dfs(r, c-1, k+1)\n        board[r][c] = tmp\n        return res\n    for i in range(m):\n        for j in range(n):\n            if dfs(i, j, 0): return True\n    return False",
            "javascript": "function solve(board, word) {\n    const m = board.length, n = board[0].length;\n    const dfs = (r, c, k) => {\n        if (k === word.length) return true;\n        if (r < 0 || r >= m || c < 0 || c >= n || board[r][c] !== word[k]) return false;\n        const tmp = board[r][c];\n        board[r][c] = '#';\n        const res = dfs(r + 1, c, k + 1) || dfs(r - 1, c, k + 1) || dfs(r, c + 1, k + 1) || dfs(r, c - 1, k + 1);\n        board[r][c] = tmp;\n        return res;\n    };\n    for (let i = 0; i < m; i++) {\n        for (let j = 0; j < n; j++) if (dfs(i, j, 0)) return true;\n    }\n    return false;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        [
                            "A",
                            "B",
                            "C",
                            "E"
                        ],
                        [
                            "S",
                            "F",
                            "C",
                            "S"
                        ],
                        [
                            "A",
                            "D",
                            "E",
                            "E"
                        ]
                    ],
                    "ABCCED"
                ],
                "expected": true,
                "isHidden": false
            },
            {
                "args": [
                    [
                        [
                            "A",
                            "B",
                            "C",
                            "E"
                        ],
                        [
                            "S",
                            "F",
                            "C",
                            "S"
                        ],
                        [
                            "A",
                            "D",
                            "E",
                            "E"
                        ]
                    ],
                    "SEE"
                ],
                "expected": true,
                "isHidden": false
            },
            {
                "args": [
                    [
                        [
                            "A",
                            "B",
                            "C",
                            "E"
                        ],
                        [
                            "S",
                            "F",
                            "C",
                            "S"
                        ],
                        [
                            "A",
                            "D",
                            "E",
                            "E"
                        ]
                    ],
                    "ABCB"
                ],
                "expected": false,
                "isHidden": true
            }
        ]
    },
    {
        "id": "amz-15",
        "company": "amazon",
        "category": "product",
        "number": 15,
        "title": "Merge K Sorted Lists into One Unified List",
        "difficulty": "Hard",
        "topic": "Min-Heap",
        "frequency": "95% in Amazon SDE-1 & SDE-2",
        "context": "Amazon distributed stream merger",
        "fnName": "solve",
        "params": [
            {
                "name": "lists",
                "type": "int[][]"
            }
        ],
        "returnType": "int[]",
        "description": "You are given an array of `k` linked-lists / arrays, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted list and return it.",
        "constraints": [
            "0 <= k <= 10^4",
            "0 <= lists[i].length <= 500"
        ],
        "hint": "Flatten and sort, or use a min-heap containing head of each list.",
        "starter": {
            "python": "def solve(lists):\n    # Write your logic here\n    return []",
            "javascript": "function solve(lists) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(lists):\n    import heapq\n    res = []\n    for l in lists: res.extend(l)\n    return sorted(res)",
            "javascript": "function solve(lists) {\n    const res = [];\n    for (const l of lists) res.push(...l);\n    return res.sort((a, b) => a - b);\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        [
                            1,
                            4,
                            5
                        ],
                        [
                            1,
                            3,
                            4
                        ],
                        [
                            2,
                            6
                        ]
                    ]
                ],
                "expected": [
                    1,
                    1,
                    2,
                    3,
                    4,
                    4,
                    5,
                    6
                ],
                "isHidden": false
            },
            {
                "args": [
                    []
                ],
                "expected": [],
                "isHidden": false
            }
        ]
    },
    {
        "id": "amz-16",
        "company": "amazon",
        "category": "product",
        "number": 16,
        "title": "Asteroid Collision Direction Simulation",
        "difficulty": "Medium",
        "topic": "Stack",
        "frequency": "92% in Amazon SDE-1",
        "context": "Amazon routing path collision detector",
        "fnName": "solve",
        "params": [
            {
                "name": "asteroids",
                "type": "int[]"
            }
        ],
        "returnType": "int[]",
        "description": "Given array `asteroids` where positive means moving right, negative moving left, absolute value is size. When moving towards each other, smaller explodes. If equal, both explode. If moving same direction, they never meet. Return state of asteroids after all collisions.",
        "constraints": [
            "2 <= asteroids.length <= 10^4"
        ],
        "hint": "Use stack. Only collide when top > 0 and current < 0.",
        "starter": {
            "python": "def solve(asteroids):\n    # Write your logic here\n    return []",
            "javascript": "function solve(asteroids) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(asteroids):\n    stack = []\n    for a in asteroids:\n        alive = True\n        while alive and a < 0 and stack and stack[-1] > 0:\n            if stack[-1] < -a:\n                stack.pop()\n            elif stack[-1] == -a:\n                stack.pop()\n                alive = False\n            else:\n                alive = False\n        if alive: stack.append(a)\n    return stack",
            "javascript": "function solve(asteroids) {\n    const stack = [];\n    for (const a of asteroids) {\n        let alive = true;\n        while (alive && a < 0 && stack.length && stack[stack.length - 1] > 0) {\n            if (stack[stack.length - 1] < -a) stack.pop();\n            else if (stack[stack.length - 1] === -a) { stack.pop(); alive = false; }\n            else alive = false;\n        }\n        if (alive) stack.push(a);\n    }\n    return stack;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        5,
                        10,
                        -5
                    ]
                ],
                "expected": [
                    5,
                    10
                ],
                "isHidden": false
            },
            {
                "args": [
                    [
                        8,
                        -8
                    ]
                ],
                "expected": [],
                "isHidden": false
            },
            {
                "args": [
                    [
                        10,
                        2,
                        -5
                    ]
                ],
                "expected": [
                    10
                ],
                "isHidden": true
            }
        ]
    },
    {
        "id": "amz-17",
        "company": "amazon",
        "category": "product",
        "number": 17,
        "title": "Subarrays with K Distinct Integers",
        "difficulty": "Hard",
        "topic": "Sliding Window",
        "frequency": "89% in Amazon SDE-1",
        "context": "Amazon customer purchase pattern tracking",
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
        "description": "Given integer array `nums` and integer `k`, return the number of good subarrays (subarrays with exactly `k` distinct integers).",
        "constraints": [
            "1 <= nums.length <= 2 * 10^4",
            "1 <= k <= nums.length"
        ],
        "hint": "exact(k) = atMost(k) - atMost(k - 1).",
        "starter": {
            "python": "def solve(nums, k):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(nums, k) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(nums, k):\n    def atMost(m):\n        from collections import defaultdict\n        counts = defaultdict(int)\n        l = ans = 0\n        for r, x in enumerate(nums):\n            if counts[x] == 0: m -= 1\n            counts[x] += 1\n            while m < 0:\n                counts[nums[l]] -= 1\n                if counts[nums[l]] == 0: m += 1\n                l += 1\n            ans += r - l + 1\n        return ans\n    return atMost(k) - atMost(k - 1)",
            "javascript": "function solve(nums, k) {\n    const atMost = (m) => {\n        const counts = new Map();\n        let l = 0, ans = 0;\n        for (let r = 0; r < nums.length; r++) {\n            const x = nums[r];\n            if (!counts.get(x)) m--;\n            counts.set(x, (counts.get(x) || 0) + 1);\n            while (m < 0) {\n                counts.set(nums[l], counts.get(nums[l]) - 1);\n                if (counts.get(nums[l]) === 0) m++;\n                l++;\n            }\n            ans += r - l + 1;\n        }\n        return ans;\n    };\n    return atMost(k) - atMost(k - 1);\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        1,
                        2,
                        1,
                        2,
                        3
                    ],
                    2
                ],
                "expected": 7,
                "isHidden": false
            },
            {
                "args": [
                    [
                        1,
                        2,
                        1,
                        3,
                        4
                    ],
                    3
                ],
                "expected": 3,
                "isHidden": false
            }
        ]
    },
    {
        "id": "amz-18",
        "company": "amazon",
        "category": "product",
        "number": 18,
        "title": "Network Delay Time (Dijkstra Shortest Path)",
        "difficulty": "Medium",
        "topic": "Dijkstra Graph",
        "frequency": "91% in Amazon SDE-1",
        "context": "Amazon AWS datacenter latency router",
        "fnName": "solve",
        "params": [
            {
                "name": "times",
                "type": "int[][]"
            },
            {
                "name": "n",
                "type": "int"
            },
            {
                "name": "k",
                "type": "int"
            }
        ],
        "returnType": "int",
        "description": "Given `times[i] = [ui, vi, wi]` meaning signal takes time `wi` from node `ui` to `vi`. We send a signal from node `k`. Return minimum time for all `n` nodes to receive the signal. If impossible, return -1.",
        "constraints": [
            "1 <= k <= n <= 100"
        ],
        "hint": "Dijkstra algorithm using priority queue to find shortest path from k to all nodes.",
        "starter": {
            "python": "def solve(times, n, k):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(times, n, k) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(times, n, k):\n    import heapq, collections\n    graph = collections.defaultdict(list)\n    for u, v, w in times: graph[u].append((v, w))\n    dist = {}\n    pq = [(0, k)]\n    while pq:\n        d, u = heapq.heappop(pq)\n        if u in dist: continue\n        dist[u] = d\n        for v, w in graph[u]:\n            if v not in dist: heapq.heappush(pq, (d + w, v))\n    return max(dist.values()) if len(dist) == n else -1",
            "javascript": "function solve(times, n, k) {\n    const dist = new Array(n + 1).fill(Infinity);\n    dist[k] = 0;\n    for (let i = 1; i <= n - 1; i++) {\n        for (const [u, v, w] of times) {\n            if (dist[u] !== Infinity && dist[u] + w < dist[v]) {\n                dist[v] = dist[u] + w;\n            }\n        }\n    }\n    let maxTime = 0;\n    for (let i = 1; i <= n; i++) {\n        if (dist[i] === Infinity) return -1;\n        maxTime = Math.max(maxTime, dist[i]);\n    }\n    return maxTime;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        [
                            2,
                            1,
                            1
                        ],
                        [
                            2,
                            3,
                            1
                        ],
                        [
                            3,
                            4,
                            1
                        ]
                    ],
                    4,
                    2
                ],
                "expected": 2,
                "isHidden": false
            },
            {
                "args": [
                    [
                        [
                            1,
                            2,
                            1
                        ]
                    ],
                    2,
                    1
                ],
                "expected": 1,
                "isHidden": false
            },
            {
                "args": [
                    [
                        [
                            1,
                            2,
                            1
                        ]
                    ],
                    2,
                    2
                ],
                "expected": -1,
                "isHidden": true
            }
        ]
    },
    {
        "id": "amz-19",
        "company": "amazon",
        "category": "product",
        "number": 19,
        "title": "Longest Palindromic Substring",
        "difficulty": "Medium",
        "topic": "String Expansion",
        "frequency": "95% in Amazon SDE-1",
        "context": "Amazon SKU palindrome validation",
        "fnName": "solve",
        "params": [
            {
                "name": "s",
                "type": "string"
            }
        ],
        "returnType": "string",
        "description": "Given a string `s`, return the longest palindromic substring in `s`.",
        "constraints": [
            "1 <= s.length <= 1000"
        ],
        "hint": "Expand around each center (odd and even). Track longest window.",
        "starter": {
            "python": "def solve(s):\n    # Write your logic here\n    return ''",
            "javascript": "function solve(s) {\n    // Write your logic here\n    return '';\n}"
        },
        "solution": {
            "python": "def solve(s):\n    res = ''\n    for i in range(len(s)):\n        for l, r in [(i, i), (i, i+1)]:\n            while l >= 0 and r < len(s) and s[l] == s[r]:\n                if (r - l + 1) > len(res):\n                    res = s[l:r+1]\n                l -= 1; r += 1\n    return res",
            "javascript": "function solve(s) {\n    let res = '';\n    for (let i = 0; i < s.length; i++) {\n        for (const [startL, startR] of [[i, i], [i, i + 1]]) {\n            let l = startL, r = startR;\n            while (l >= 0 && r < s.length && s[l] === s[r]) {\n                if (r - l + 1 > res.length) res = s.slice(l, r + 1);\n                l--; r++;\n            }\n        }\n    }\n    return res;\n}"
        },
        "testCases": [
            {
                "args": [
                    "babad"
                ],
                "expected": "bab",
                "isHidden": false
            },
            {
                "args": [
                    "cbbd"
                ],
                "expected": "bb",
                "isHidden": false
            }
        ]
    },
    {
        "id": "amz-20",
        "company": "amazon",
        "category": "product",
        "number": 20,
        "title": "Optimal Two Sum Index Pairs",
        "difficulty": "Easy",
        "topic": "Hash Map",
        "frequency": "99% in Amazon SDE-1",
        "context": "Package weight pairing in Amazon warehouse",
        "fnName": "solve",
        "params": [
            {
                "name": "nums",
                "type": "int[]"
            },
            {
                "name": "target",
                "type": "int"
            }
        ],
        "returnType": "int[]",
        "description": "Given an array of integers `nums` and an integer `target`, return indices `[i, j]` (`i < j`) of the two numbers such that they add up to `target`. Return `[-1, -1]` if none exists.",
        "constraints": [
            "2 <= nums.length <= 10^4",
            "-10^9 <= nums[i] <= 10^9"
        ],
        "hint": "Use a hash map storing value -> index for O(n) lookup.",
        "starter": {
            "python": "def solve(nums, target):\n    # Write your logic here\n    return []",
            "javascript": "function solve(nums, target) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(nums, target):\n    seen = {}\n    for i, x in enumerate(nums):\n        if target - x in seen: return [seen[target - x], i]\n        seen[x] = i\n    return [-1, -1]",
            "javascript": "function solve(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const diff = target - nums[i];\n        if (map.has(diff)) return [map.get(diff), i];\n        map.set(nums[i], i);\n    }\n    return [-1, -1];\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        2,
                        7,
                        11,
                        15
                    ],
                    9
                ],
                "expected": [
                    0,
                    1
                ],
                "isHidden": false
            },
            {
                "args": [
                    [
                        3,
                        2,
                        4
                    ],
                    6
                ],
                "expected": [
                    1,
                    2
                ],
                "isHidden": false
            },
            {
                "args": [
                    [
                        3,
                        3
                    ],
                    6
                ],
                "expected": [
                    0,
                    1
                ],
                "isHidden": true
            }
        ]
    }
];
