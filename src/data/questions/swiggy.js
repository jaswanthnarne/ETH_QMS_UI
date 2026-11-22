export const SWIGGY_QUESTIONS = [
    {
        "id": "swig-1",
        "company": "swiggy",
        "category": "startup",
        "number": 1,
        "title": "Delivery Executive Order Batching",
        "difficulty": "Medium",
        "topic": "Greedy & Interval Scheduling",
        "frequency": "95% in Swiggy Core",
        "context": "Swiggy automated rider batching engine",
        "fnName": "solve",
        "params": [
            {
                "name": "orders",
                "type": "int[][]"
            },
            {
                "name": "capacity",
                "type": "int"
            }
        ],
        "returnType": "bool",
        "description": "A delivery partner can carry at most `capacity` food bags. Given trips `orders[i] = [numBags, startKm, endKm]`, determine if the rider can fulfill all deliveries without exceeding bag capacity at any kilometer point.",
        "constraints": [
            "1 <= orders.length <= 1000",
            "1 <= capacity <= 100",
            "0 <= startKm < endKm <= 1000"
        ],
        "hint": "Difference array / coordinate line sweep tracking cumulative bag load.",
        "starter": {
            "python": "def solve(orders, capacity):\n    # Write your logic here\n    return False",
            "javascript": "function solve(orders, capacity) {\n    // Write your logic here\n    return false;\n}"
        },
        "solution": {
            "python": "def solve(orders, capacity):\n    diff = [0] * 1002\n    for bags, s, e in orders:\n        diff[s] += bags\n        diff[e] -= bags\n    curr = 0\n    for load in diff:\n        curr += load\n        if curr > capacity: return False\n    return True",
            "javascript": "function solve(orders, capacity) {\n    const diff = new Array(1005).fill(0);\n    for (const [bags, s, e] of orders) {\n        diff[s] += bags;\n        diff[e] -= bags;\n    }\n    let curr = 0;\n    for (const load of diff) {\n        curr += load;\n        if (curr > capacity) return false;\n    }\n    return true;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        [
                            2,
                            1,
                            5
                        ],
                        [
                            3,
                            3,
                            7
                        ]
                    ],
                    4
                ],
                "expected": false,
                "isHidden": false
            },
            {
                "args": [
                    [
                        [
                            2,
                            1,
                            5
                        ],
                        [
                            3,
                            3,
                            7
                        ]
                    ],
                    5
                ],
                "expected": true,
                "isHidden": false
            }
        ]
    },
    {
        "id": "swig-2",
        "company": "swiggy",
        "category": "startup",
        "number": 2,
        "title": "Nearest Cloud Kitchen Distance (Multi-Source BFS)",
        "difficulty": "Medium",
        "topic": "Multi-Source BFS",
        "frequency": "92% in Swiggy Logistics",
        "context": "Instamart dark store distance mapping",
        "fnName": "solve",
        "params": [
            {
                "name": "grid",
                "type": "int[][]"
            }
        ],
        "returnType": "int[][]",
        "description": "Given `m x n` grid where `0` is a customer home and `1` is a Swiggy cloud kitchen, calculate distance from each cell to nearest kitchen. Distance between `(r1, c1)` and `(r2, c2)` is `|r1 - r2| + |c1 - c2|`.",
        "constraints": [
            "1 <= m, n <= 100",
            "At least one 1 exists"
        ],
        "hint": "Initialize multi-source BFS queue with all cloud kitchens (cells with 1).",
        "starter": {
            "python": "def solve(grid):\n    # Write your logic here\n    return []",
            "javascript": "function solve(grid) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(grid):\n    from collections import deque\n    R, C = len(grid), len(grid[0])\n    dist = [[-1] * C for _ in range(R)]\n    q = deque()\n    for r in range(R):\n        for c in range(C):\n            if grid[r][c] == 1:\n                dist[r][c] = 0\n                q.append((r, c))\n    while q:\n        r, c = q.popleft()\n        for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:\n            nr, nc = r + dr, c + dc\n            if 0 <= nr < R and 0 <= nc < C and dist[nr][nc] == -1:\n                dist[nr][nc] = dist[r][c] + 1\n                q.append((nr, nc))\n    return dist",
            "javascript": "function solve(grid) {\n    const R = grid.length, C = grid[0].length;\n    const dist = Array.from({ length: R }, () => new Array(C).fill(-1));\n    const q = [];\n    for (let r = 0; r < R; r++) {\n        for (let c = 0; c < C; c++) {\n            if (grid[r][c] === 1) {\n                dist[r][c] = 0;\n                q.push([r, c]);\n            }\n        }\n    }\n    let head = 0;\n    while (head < q.length) {\n        const [r, c] = q[head++];\n        const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];\n        for (const [dr, dc] of dirs) {\n            const nr = r + dr, nc = c + dc;\n            if (nr >= 0 && nr < R && nc >= 0 && nc < C && dist[nr][nc] === -1) {\n                dist[nr][nc] = dist[r][c] + 1;\n                q.push([nr, nc]);\n            }\n        }\n    }\n    return dist;\n}"
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
                            0,
                            1,
                            0
                        ],
                        [
                            0,
                            0,
                            0
                        ]
                    ]
                ],
                "expected": [
                    [
                        2,
                        1,
                        2
                    ],
                    [
                        1,
                        0,
                        1
                    ],
                    [
                        2,
                        1,
                        2
                    ]
                ],
                "isHidden": false
            }
        ]
    },
    {
        "id": "swig-3",
        "company": "swiggy",
        "category": "startup",
        "number": 3,
        "title": "Dynamic Surge Price Multiplier",
        "difficulty": "Easy",
        "topic": "Sliding Window",
        "frequency": "90% in Swiggy Pricing",
        "context": "Rain and peak dinner hour surge engine",
        "fnName": "solve",
        "params": [
            {
                "name": "orderCounts",
                "type": "int[]"
            },
            {
                "name": "windowSize",
                "type": "int"
            },
            {
                "name": "threshold",
                "type": "int"
            }
        ],
        "returnType": "int[]",
        "description": "Given minute-by-minute orders array `orderCounts`. For each sliding window of size `windowSize`, if average orders >= `threshold`, mark surge flag as `1`, otherwise `0`.",
        "constraints": [
            "1 <= orderCounts.length <= 10^5",
            "1 <= windowSize <= orderCounts.length"
        ],
        "hint": "Maintain running sum of windowSize. Compute average = sum / windowSize.",
        "starter": {
            "python": "def solve(orderCounts, windowSize, threshold):\n    # Write your logic here\n    return []",
            "javascript": "function solve(orderCounts, windowSize, threshold) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(orderCounts, windowSize, threshold):\n    res = []\n    curr_sum = sum(orderCounts[:windowSize])\n    res.append(1 if curr_sum / windowSize >= threshold else 0)\n    for i in range(windowSize, len(orderCounts)):\n        curr_sum += orderCounts[i] - orderCounts[i - windowSize]\n        res.append(1 if curr_sum / windowSize >= threshold else 0)\n    return res",
            "javascript": "function solve(orderCounts, windowSize, threshold) {\n    const res = [];\n    let currSum = 0;\n    for (let i = 0; i < windowSize; i++) currSum += orderCounts[i];\n    res.push(currSum / windowSize >= threshold ? 1 : 0);\n    for (let i = windowSize; i < orderCounts.length; i++) {\n        currSum += orderCounts[i] - orderCounts[i - windowSize];\n        res.push(currSum / windowSize >= threshold ? 1 : 0);\n    }\n    return res;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        10,
                        20,
                        30,
                        40,
                        50
                    ],
                    3,
                    30
                ],
                "expected": [
                    0,
                    1,
                    1
                ],
                "isHidden": false
            }
        ]
    },
    {
        "id": "swig-4",
        "company": "swiggy",
        "category": "startup",
        "number": 4,
        "title": "Delivery Slot Overlap Conflict Resolver",
        "difficulty": "Medium",
        "topic": "Intervals",
        "frequency": "93% in Swiggy Dineout",
        "context": "Table booking conflict prevention",
        "fnName": "solve",
        "params": [
            {
                "name": "intervals",
                "type": "int[][]"
            }
        ],
        "returnType": "int",
        "description": "Given a collection of reservation intervals `[start, end]`, find minimum number of intervals to remove to make the rest non-overlapping.",
        "constraints": [
            "1 <= intervals.length <= 10^5",
            "intervals[i].length == 2"
        ],
        "hint": "Greedy: sort by end time. Always keep interval that finishes earliest.",
        "starter": {
            "python": "def solve(intervals):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(intervals) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(intervals):\n    if not intervals: return 0\n    intervals.sort(key=lambda x: x[1])\n    removals = 0\n    last_end = -float('inf')\n    for s, e in intervals:\n        if s < last_end:\n            removals += 1\n        else:\n            last_end = e\n    return removals",
            "javascript": "function solve(intervals) {\n    if (intervals.length === 0) return 0;\n    const sorted = [...intervals].sort((a, b) => a[1] - b[1]);\n    let removals = 0;\n    let lastEnd = -Infinity;\n    for (const [s, e] of sorted) {\n        if (s < lastEnd) removals++;\n        else lastEnd = e;\n    }\n    return removals;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        [
                            1,
                            2
                        ],
                        [
                            2,
                            3
                        ],
                        [
                            3,
                            4
                        ],
                        [
                            1,
                            3
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
                            2
                        ],
                        [
                            1,
                            2
                        ],
                        [
                            1,
                            2
                        ]
                    ]
                ],
                "expected": 2,
                "isHidden": false
            }
        ]
    },
    {
        "id": "swig-5",
        "company": "swiggy",
        "category": "startup",
        "number": 5,
        "title": "Minimum Total Manhattan Distance for Food Delivery",
        "difficulty": "Hard",
        "topic": "Median & Convex Optimization",
        "frequency": "90% in Swiggy Logistics",
        "context": "Optimal dark store location placement in Bangalore",
        "fnName": "solve",
        "params": [
            {
                "name": "grid",
                "type": "int[][]"
            }
        ],
        "returnType": "int",
        "description": "Given `m x n` grid where `1` represents an active delivery customer and `0` empty. Find an optimal point to build a new delivery hub that minimizes sum of Manhattan distances to all customers. Return minimum total distance.",
        "constraints": [
            "1 <= m, n <= 100"
        ],
        "hint": "Total distance decomposes into X and Y independently. The optimum is the median coordinate.",
        "starter": {
            "python": "def solve(grid):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(grid) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(grid):\n    R, C = len(grid), len(grid[0])\n    rows = [r for r in range(R) for c in range(C) if grid[r][c] == 1]\n    cols = sorted([c for r in range(R) for c in range(C) if grid[r][c] == 1])\n    if not rows: return 0\n    mid_r = rows[len(rows) // 2]\n    mid_c = cols[len(cols) // 2]\n    return sum(abs(r - mid_r) for r in rows) + sum(abs(c - mid_c) for c in cols)",
            "javascript": "function solve(grid) {\n    const R = grid.length, C = grid[0].length;\n    const rows = [];\n    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) if (grid[r][c] === 1) rows.push(r);\n    const cols = [];\n    for (let c = 0; c < C; c++) for (let r = 0; r < R; r++) if (grid[r][c] === 1) cols.push(c);\n    if (rows.length === 0) return 0;\n    const midR = rows[Math.floor(rows.length / 2)];\n    const midC = cols[Math.floor(cols.length / 2)];\n    const distR = rows.reduce((acc, r) => acc + Math.abs(r - midR), 0);\n    const distC = cols.reduce((acc, c) => acc + Math.abs(c - midC), 0);\n    return distR + distC;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        [
                            1,
                            0,
                            0,
                            0,
                            1
                        ],
                        [
                            0,
                            0,
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
                        ]
                    ]
                ],
                "expected": 6,
                "isHidden": false
            }
        ]
    },
    {
        "id": "swig-6",
        "company": "swiggy",
        "category": "startup",
        "number": 6,
        "title": "Food Prep Time + Travel ETA Min-Heap Dispatch",
        "difficulty": "Medium",
        "topic": "Priority Queue",
        "frequency": "94% in Swiggy Driver App",
        "context": "Dispatcher queue prioritization",
        "fnName": "solve",
        "params": [
            {
                "name": "prepTimes",
                "type": "int[]"
            },
            {
                "name": "transitTimes",
                "type": "int[]"
            },
            {
                "name": "k",
                "type": "int"
            }
        ],
        "returnType": "int[]",
        "description": "Given `prepTimes` and `transitTimes` for orders (total time = `prepTimes[i] + transitTimes[i]`). Return IDs (0-indexed) of top `k` quickest orders ready to be dispatched first. If total time ties, break tie by lower order ID.",
        "constraints": [
            "1 <= k <= prepTimes.length <= 10^5"
        ],
        "hint": "Pair (prep + transit, id) and sort or use min-heap.",
        "starter": {
            "python": "def solve(prepTimes, transitTimes, k):\n    # Write your logic here\n    return []",
            "javascript": "function solve(prepTimes, transitTimes, k) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(prepTimes, transitTimes, k):\n    orders = [(prepTimes[i] + transitTimes[i], i) for i in range(len(prepTimes))]\n    orders.sort()\n    return [idx for _, idx in orders[:k]]",
            "javascript": "function solve(prepTimes, transitTimes, k) {\n    const orders = prepTimes.map((p, i) => ({ total: p + transitTimes[i], idx: i }));\n    orders.sort((a, b) => a.total !== b.total ? a.total - b.total : a.idx - b.idx);\n    return orders.slice(0, k).map(o => o.idx);\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        15,
                        20,
                        5
                    ],
                    [
                        10,
                        5,
                        25
                    ],
                    2
                ],
                "expected": [
                    0,
                    1
                ],
                "isHidden": false
            }
        ]
    },
    {
        "id": "swig-7",
        "company": "swiggy",
        "category": "startup",
        "number": 7,
        "title": "Swiggy Instamart Shelf Packing (Knapsack)",
        "difficulty": "Medium",
        "topic": "Dynamic Programming",
        "frequency": "93% in Instamart Supply Chain",
        "context": "Maximizing retail profit on warehouse shelf space",
        "fnName": "solve",
        "params": [
            {
                "name": "weights",
                "type": "int[]"
            },
            {
                "name": "profits",
                "type": "int[]"
            },
            {
                "name": "maxWeight",
                "type": "int"
            }
        ],
        "returnType": "int",
        "description": "Instamart shelf has weight capacity `maxWeight`. Given items with `weights[i]` and `profits[i]`, choose a subset of items to maximize shelf profit without exceeding capacity.",
        "constraints": [
            "1 <= weights.length <= 500",
            "1 <= maxWeight <= 2000"
        ],
        "hint": "Standard 0/1 knapsack dynamic programming.",
        "starter": {
            "python": "def solve(weights, profits, maxWeight):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(weights, profits, maxWeight) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(weights, profits, maxWeight):\n    dp = [0] * (maxWeight + 1)\n    for w, p in zip(weights, profits):\n        for cap in range(maxWeight, w - 1, -1):\n            dp[cap] = max(dp[cap], dp[cap - w] + p)\n    return dp[maxWeight]",
            "javascript": "function solve(weights, profits, maxWeight) {\n    const dp = new Array(maxWeight + 1).fill(0);\n    for (let i = 0; i < weights.length; i++) {\n        const w = weights[i], p = profits[i];\n        for (let cap = maxWeight; cap >= w; cap--) {\n            dp[cap] = Math.max(dp[cap], dp[cap - w] + p);\n        }\n    }\n    return dp[maxWeight];\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        2,
                        3,
                        4,
                        5
                    ],
                    [
                        3,
                        4,
                        5,
                        6
                    ],
                    5
                ],
                "expected": 7,
                "isHidden": false
            }
        ]
    },
    {
        "id": "swig-8",
        "company": "swiggy",
        "category": "startup",
        "number": 8,
        "title": "Restaurant Rating Exponential Moving Average (EMA)",
        "difficulty": "Easy",
        "topic": "Math & Simulation",
        "frequency": "88% in Swiggy Food",
        "context": "Dynamic restaurant review score update",
        "fnName": "solve",
        "params": [
            {
                "name": "ratings",
                "type": "float[]"
            },
            {
                "name": "alpha",
                "type": "float"
            }
        ],
        "returnType": "float",
        "description": "Calculate Exponential Moving Average (EMA) of ratings: `EMA_0 = ratings[0]`, `EMA_t = alpha * ratings[t] + (1 - alpha) * EMA_{t-1}`. Return final rating rounded to 2 decimal places.",
        "constraints": [
            "1 <= ratings.length <= 1000",
            "0 < alpha <= 1.0"
        ],
        "hint": "Loop sequentially updating the running EMA variable.",
        "starter": {
            "python": "def solve(ratings, alpha):\n    # Write your logic here\n    return 0.0",
            "javascript": "function solve(ratings, alpha) {\n    // Write your logic here\n    return 0.0;\n}"
        },
        "solution": {
            "python": "def solve(ratings, alpha):\n    ema = ratings[0]\n    for r in ratings[1:]:\n        ema = alpha * r + (1.0 - alpha) * ema\n    return round(float(ema), 2)",
            "javascript": "function solve(ratings, alpha) {\n    let ema = ratings[0];\n    for (let i = 1; i < ratings.length; i++) {\n        ema = alpha * ratings[i] + (1 - alpha) * ema;\n    }\n    return Math.round(ema * 100) / 100;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        4,
                        4.5,
                        5,
                        3.5
                    ],
                    0.3
                ],
                "expected": 4.14,
                "isHidden": false
            }
        ]
    },
    {
        "id": "swig-9",
        "company": "swiggy",
        "category": "startup",
        "number": 9,
        "title": "Delivery Partner Tip Fair Redistribution",
        "difficulty": "Medium",
        "topic": "Two Pointers",
        "frequency": "91% in Swiggy Fintech",
        "context": "Evening pool tip redistribution",
        "fnName": "solve",
        "params": [
            {
                "name": "tips",
                "type": "int[]"
            },
            {
                "name": "target",
                "type": "int"
            }
        ],
        "returnType": "int",
        "description": "Given daily tips earned by riders `tips`. Pair up riders such that their combined tips equal `target`. Return count of unique non-overlapping pairs.",
        "constraints": [
            "1 <= tips.length <= 10^5"
        ],
        "hint": "Sort and use two pointers, or use hash map frequency counter.",
        "starter": {
            "python": "def solve(tips, target):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(tips, target) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(tips, target):\n    tips.sort()\n    l, r = 0, len(tips) - 1\n    pairs = 0\n    while l < r:\n        s = tips[l] + tips[r]\n        if s == target:\n            pairs += 1; l += 1; r -= 1\n        elif s < target: l += 1\n        else: r -= 1\n    return pairs",
            "javascript": "function solve(tips, target) {\n    const sorted = [...tips].sort((a, b) => a - b);\n    let l = 0, r = sorted.length - 1, pairs = 0;\n    while (l < r) {\n        const s = sorted[l] + sorted[r];\n        if (s === target) { pairs++; l++; r--; } else if (s < target) l++; else r--;\n    }\n    return pairs;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        10,
                        20,
                        30,
                        40,
                        50
                    ],
                    50
                ],
                "expected": 2,
                "isHidden": false
            }
        ]
    },
    {
        "id": "swig-10",
        "company": "swiggy",
        "category": "startup",
        "number": 10,
        "title": "Rider Idle Time Minimization",
        "difficulty": "Medium",
        "topic": "Greedy Interval Scheduling",
        "frequency": "90% in Swiggy Fleets",
        "context": "Fleet utilization optimizer",
        "fnName": "solve",
        "params": [
            {
                "name": "shifts",
                "type": "int[][]"
            }
        ],
        "returnType": "int",
        "description": "Given delivery shifts `[start, end]`, determine the minimum number of delivery partners required so that every shift is covered without overlap.",
        "constraints": [
            "1 <= shifts.length <= 10^4"
        ],
        "hint": "Line sweep on start (+1) and end (-1) points. Peak concurrent count is the answer.",
        "starter": {
            "python": "def solve(shifts):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(shifts) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(shifts):\n    events = []\n    for s, e in shifts:\n        events.append((s, 1))\n        events.append((e, -1))\n    events.sort(key=lambda x: (x[0], x[1]))\n    curr, max_riders = 0, 0\n    for t, delta in events:\n        curr += delta\n        max_riders = max(max_riders, curr)\n    return max_riders",
            "javascript": "function solve(shifts) {\n    const events = [];\n    for (const [s, e] of shifts) {\n        events.push([s, 1]);\n        events.push([e, -1]);\n    }\n    events.sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]);\n    let curr = 0, maxR = 0;\n    for (const [, delta] of events) {\n        curr += delta;\n        maxR = Math.max(maxR, curr);\n    }\n    return maxR;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        [
                            9,
                            11
                        ],
                        [
                            10,
                            12
                        ],
                        [
                            11,
                            13
                        ]
                    ]
                ],
                "expected": 2,
                "isHidden": false
            }
        ]
    },
    {
        "id": "swig-11",
        "company": "swiggy",
        "category": "startup",
        "number": 11,
        "title": "Geo-Hash Cluster Density Detection",
        "difficulty": "Medium",
        "topic": "Hash Map Sliding Window",
        "frequency": "92% in Swiggy Maps",
        "context": "Delivery area demand zoning",
        "fnName": "solve",
        "params": [
            {
                "name": "geoHashes",
                "type": "string[]"
            },
            {
                "name": "minCount",
                "type": "int"
            }
        ],
        "returnType": "string[]",
        "description": "Given a list of customer geo-hash prefixes, return sorted list of unique geo-hashes that have at least `minCount` active orders.",
        "constraints": [
            "1 <= geoHashes.length <= 10^5",
            "1 <= minCount <= 1000"
        ],
        "hint": "Count frequencies with hash map. Filter entries where count >= minCount.",
        "starter": {
            "python": "def solve(geoHashes, minCount):\n    # Write your logic here\n    return []",
            "javascript": "function solve(geoHashes, minCount) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(geoHashes, minCount):\n    from collections import Counter\n    freq = Counter(geoHashes)\n    return sorted([k for k, v in freq.items() if v >= minCount])",
            "javascript": "function solve(geoHashes, minCount) {\n    const freq = {};\n    for (const g of geoHashes) freq[g] = (freq[g] || 0) + 1;\n    return Object.keys(freq).filter(k => freq[k] >= minCount).sort();\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        "tdr1",
                        "tdr1",
                        "tdr2",
                        "tdr1",
                        "tdr3",
                        "tdr2"
                    ],
                    2
                ],
                "expected": [
                    "tdr1",
                    "tdr2"
                ],
                "isHidden": false
            }
        ]
    },
    {
        "id": "swig-12",
        "company": "swiggy",
        "category": "startup",
        "number": 12,
        "title": "Customer Cart Coupon Discount Maximizer",
        "difficulty": "Medium",
        "topic": "Greedy Strategy",
        "frequency": "91% in Swiggy Checkout",
        "context": "Promotional coupon application logic",
        "fnName": "solve",
        "params": [
            {
                "name": "prices",
                "type": "int[]"
            },
            {
                "name": "flatOff",
                "type": "int"
            },
            {
                "name": "pctOff",
                "type": "int"
            },
            {
                "name": "maxCap",
                "type": "int"
            }
        ],
        "returnType": "int",
        "description": "Total cart value is sum of `prices`. A user can choose either Coupon A (Flat `flatOff` discount) or Coupon B (`pctOff` % discount capped at `maxCap`). Return minimum final cart amount the customer has to pay.",
        "constraints": [
            "1 <= prices.length <= 100",
            "0 <= flatOff, maxCap <= 10000",
            "0 <= pctOff <= 100"
        ],
        "hint": "Compute total sum. Apply Coupon A and Coupon B independently, take minimum payable amount.",
        "starter": {
            "python": "def solve(prices, flatOff, pctOff, maxCap):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(prices, flatOff, pctOff, maxCap) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(prices, flatOff, pctOff, maxCap):\n    total = sum(prices)\n    disc_flat = min(total, flatOff)\n    disc_pct = min(total * pctOff // 100, maxCap)\n    return total - max(disc_flat, disc_pct)",
            "javascript": "function solve(prices, flatOff, pctOff, maxCap) {\n    const total = prices.reduce((a, b) => a + b, 0);\n    const discFlat = Math.min(total, flatOff);\n    const discPct = Math.min(Math.floor((total * pctOff) / 100), maxCap);\n    return total - Math.max(discFlat, discPct);\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        100,
                        250,
                        150
                    ],
                    80,
                    20,
                    120
                ],
                "expected": 400,
                "isHidden": false
            }
        ]
    },
    {
        "id": "swig-13",
        "company": "swiggy",
        "category": "startup",
        "number": 13,
        "title": "Order State Transition FSM Validator",
        "difficulty": "Easy",
        "topic": "Finite State Machine",
        "frequency": "89% in Swiggy Backend",
        "context": "Order life cycle verification: PLACED -> CONFIRMED -> PREPARING -> PICKED_UP -> DELIVERED",
        "fnName": "solve",
        "params": [
            {
                "name": "events",
                "type": "string[]"
            }
        ],
        "returnType": "bool",
        "description": "Given sequence of order status strings. Valid transitions: `PLACED` -> `CONFIRMED` -> `PREPARING` -> `PICKED_UP` -> `DELIVERED`. Any event can also transition directly to `CANCELLED` except from `DELIVERED`. Return `true` if valid lifecycle.",
        "constraints": [
            "1 <= events.length <= 10"
        ],
        "hint": "Track current state and check if next event is in allowed adjacent set.",
        "starter": {
            "python": "def solve(events):\n    # Write your logic here\n    return False",
            "javascript": "function solve(events) {\n    // Write your logic here\n    return false;\n}"
        },
        "solution": {
            "python": "def solve(events):\n    transitions = {\n        'START': ['PLACED'],\n        'PLACED': ['CONFIRMED', 'CANCELLED'],\n        'CONFIRMED': ['PREPARING', 'CANCELLED'],\n        'PREPARING': ['PICKED_UP', 'CANCELLED'],\n        'PICKED_UP': ['DELIVERED'],\n        'DELIVERED': [],\n        'CANCELLED': []\n    }\n    curr = 'START'\n    for ev in events:\n        if ev not in transitions.get(curr, []): return False\n        curr = ev\n    return True",
            "javascript": "function solve(events) {\n    const transitions = {\n        'START': ['PLACED'],\n        'PLACED': ['CONFIRMED', 'CANCELLED'],\n        'CONFIRMED': ['PREPARING', 'CANCELLED'],\n        'PREPARING': ['PICKED_UP', 'CANCELLED'],\n        'PICKED_UP': ['DELIVERED'],\n        'DELIVERED': [],\n        'CANCELLED': []\n    };\n    let curr = 'START';\n    for (const ev of events) {\n        if (!transitions[curr] || !transitions[curr].includes(ev)) return false;\n        curr = ev;\n    }\n    return true;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        "PLACED",
                        "CONFIRMED",
                        "PREPARING",
                        "PICKED_UP",
                        "DELIVERED"
                    ]
                ],
                "expected": true,
                "isHidden": false
            },
            {
                "args": [
                    [
                        "PLACED",
                        "DELIVERED"
                    ]
                ],
                "expected": false,
                "isHidden": false
            }
        ]
    },
    {
        "id": "swig-14",
        "company": "swiggy",
        "category": "startup",
        "number": 14,
        "title": "Spill-Proof Bag Weight Balancing (Equal Sum Partition)",
        "difficulty": "Medium",
        "topic": "Dynamic Programming",
        "frequency": "93% in Swiggy Hardware",
        "context": "Bicycle delivery pannier weight balancing",
        "fnName": "solve",
        "params": [
            {
                "name": "weights",
                "type": "int[]"
            }
        ],
        "returnType": "bool",
        "description": "Given container food packet `weights`. Can they be partitioned into two delivery bags with equal total weight to prevent balance issues while driving?",
        "constraints": [
            "1 <= weights.length <= 200",
            "1 <= weights[i] <= 100"
        ],
        "hint": "Subset sum DP target = sum(weights) / 2.",
        "starter": {
            "python": "def solve(weights):\n    # Write your logic here\n    return False",
            "javascript": "function solve(weights) {\n    // Write your logic here\n    return false;\n}"
        },
        "solution": {
            "python": "def solve(weights):\n    total = sum(weights)\n    if total % 2 != 0: return False\n    target = total // 2\n    dp = [False] * (target + 1)\n    dp[0] = True\n    for w in weights:\n        for j in range(target, w - 1, -1):\n            dp[j] = dp[j] or dp[j - w]\n    return dp[target]",
            "javascript": "function solve(weights) {\n    const total = weights.reduce((a, b) => a + b, 0);\n    if (total % 2 !== 0) return false;\n    const target = total / 2;\n    const dp = new Array(target + 1).fill(false);\n    dp[0] = true;\n    for (const w of weights) {\n        for (let j = target; j >= w; j--) {\n            dp[j] = dp[j] || dp[j - w];\n        }\n    }\n    return dp[target];\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        1,
                        5,
                        11,
                        5
                    ]
                ],
                "expected": true,
                "isHidden": false
            },
            {
                "args": [
                    [
                        1,
                        2,
                        3,
                        5
                    ]
                ],
                "expected": false,
                "isHidden": false
            }
        ]
    },
    {
        "id": "swig-15",
        "company": "swiggy",
        "category": "startup",
        "number": 15,
        "title": "Peak Hour Traffic Congestion Delay Calculator",
        "difficulty": "Easy",
        "topic": "Arrays & Simulation",
        "frequency": "88% in Swiggy Routing",
        "context": "Predicting total delivery trip latency",
        "fnName": "solve",
        "params": [
            {
                "name": "baseTimes",
                "type": "int[]"
            },
            {
                "name": "trafficMultipliers",
                "type": "float[]"
            }
        ],
        "returnType": "int",
        "description": "Each road segment has a base transit time `baseTimes[i]` and a traffic multiplier `trafficMultipliers[i]`. Total segment time = `ceil(baseTimes[i] * trafficMultipliers[i])`. Return total travel time.",
        "constraints": [
            "1 <= baseTimes.length <= 1000",
            "trafficMultipliers.length == baseTimes.length"
        ],
        "hint": "Compute ceil(base * mult) for each segment and sum them up.",
        "starter": {
            "python": "def solve(baseTimes, trafficMultipliers):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(baseTimes, trafficMultipliers) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(baseTimes, trafficMultipliers):\n    import math\n    return sum(math.ceil(b * m) for b, m in zip(baseTimes, trafficMultipliers))",
            "javascript": "function solve(baseTimes, trafficMultipliers) {\n    return baseTimes.reduce((acc, b, i) => acc + Math.ceil(b * trafficMultipliers[i]), 0);\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        10,
                        20,
                        15
                    ],
                    [
                        1.2,
                        1.5,
                        1
                    ]
                ],
                "expected": 57,
                "isHidden": false
            }
        ]
    },
    {
        "id": "swig-16",
        "company": "swiggy",
        "category": "startup",
        "number": 16,
        "title": "Swiggy One Membership Loyalty Point Expiry",
        "difficulty": "Medium",
        "topic": "Queue & Monotonic Simulation",
        "frequency": "90% in Swiggy Subscriptions",
        "context": "Point expiration queue",
        "fnName": "solve",
        "params": [
            {
                "name": "points",
                "type": "int[][]"
            },
            {
                "name": "currentDay",
                "type": "int"
            }
        ],
        "returnType": "int",
        "description": "Given points records `[amount, expiryDay]`. Calculate the total points that have NOT yet expired on `currentDay` (i.e. `expiryDay >= currentDay`).",
        "constraints": [
            "1 <= points.length <= 10^5"
        ],
        "hint": "Filter records where expiryDay >= currentDay and sum amount.",
        "starter": {
            "python": "def solve(points, currentDay):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(points, currentDay) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(points, currentDay):\n    return sum(amt for amt, exp in points if exp >= currentDay)",
            "javascript": "function solve(points, currentDay) {\n    return points.reduce((acc, [amt, exp]) => exp >= currentDay ? acc + amt : acc, 0);\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        [
                            100,
                            10
                        ],
                        [
                            50,
                            15
                        ],
                        [
                            200,
                            8
                        ]
                    ],
                    10
                ],
                "expected": 150,
                "isHidden": false
            }
        ]
    },
    {
        "id": "swig-17",
        "company": "swiggy",
        "category": "startup",
        "number": 17,
        "title": "GPS Breadcrumb Path Point Thinning",
        "difficulty": "Medium",
        "topic": "Two Pointers Geometry",
        "frequency": "91% in Swiggy Telemetry",
        "context": "Compressing high-frequency GPS ping streams to save battery & data",
        "fnName": "solve",
        "params": [
            {
                "name": "pings",
                "type": "int[][]"
            },
            {
                "name": "minDist",
                "type": "int"
            }
        ],
        "returnType": "int[][]",
        "description": "Given GPS points `[x, y]`. A point is kept only if its Euclidean distance from the previously retained point is `>= minDist`. The first point is always retained. Return retained coordinates.",
        "constraints": [
            "1 <= pings.length <= 10^4",
            "minDist >= 1"
        ],
        "hint": "Keep track of last retained point. Check (x - lx)^2 + (y - ly)^2 >= minDist^2.",
        "starter": {
            "python": "def solve(pings, minDist):\n    # Write your logic here\n    return []",
            "javascript": "function solve(pings, minDist) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(pings, minDist):\n    if not pings: return []\n    retained = [pings[0]]\n    d_sq = minDist * minDist\n    for x, y in pings[1:]:\n        lx, ly = retained[-1]\n        if (x - lx)**2 + (y - ly)**2 >= d_sq:\n            retained.append([x, y])\n    return retained",
            "javascript": "function solve(pings, minDist) {\n    if (pings.length === 0) return [];\n    const retained = [pings[0]];\n    const dSq = minDist * minDist;\n    for (let i = 1; i < pings.length; i++) {\n        const [x, y] = pings[i];\n        const [lx, ly] = retained[retained.length - 1];\n        if ((x - lx) ** 2 + (y - ly) ** 2 >= dSq) {\n            retained.push([x, y]);\n        }\n    }\n    return retained;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        [
                            0,
                            0
                        ],
                        [
                            1,
                            1
                        ],
                        [
                            3,
                            4
                        ],
                        [
                            3,
                            5
                        ],
                        [
                            6,
                            8
                        ]
                    ],
                    5
                ],
                "expected": [
                    [
                        0,
                        0
                    ],
                    [
                        3,
                        4
                    ],
                    [
                        6,
                        8
                    ]
                ],
                "isHidden": false
            }
        ]
    },
    {
        "id": "swig-18",
        "company": "swiggy",
        "category": "startup",
        "number": 18,
        "title": "Top-K Trending Dishes in Area",
        "difficulty": "Medium",
        "topic": "Heap & Hash Map",
        "frequency": "93% in Swiggy Feed",
        "context": "Discover trending food recommendations",
        "fnName": "solve",
        "params": [
            {
                "name": "orders",
                "type": "string[]"
            },
            {
                "name": "k",
                "type": "int"
            }
        ],
        "returnType": "string[]",
        "description": "Given a list of dish names ordered in a locality, return the `k` most frequently ordered dishes sorted by count descending. If frequencies match, sort alphabetically.",
        "constraints": [
            "1 <= orders.length <= 10^5",
            "1 <= k <= 100"
        ],
        "hint": "Counter followed by custom sort with (-count, dishName).",
        "starter": {
            "python": "def solve(orders, k):\n    # Write your logic here\n    return []",
            "javascript": "function solve(orders, k) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(orders, k):\n    from collections import Counter\n    counts = Counter(orders)\n    sorted_dishes = sorted(counts.keys(), key=lambda x: (-counts[x], x))\n    return sorted_dishes[:k]",
            "javascript": "function solve(orders, k) {\n    const counts = {};\n    for (const d of orders) counts[d] = (counts[d] || 0) + 1;\n    return Object.keys(counts).sort((a, b) => counts[b] !== counts[a] ? counts[b] - counts[a] : a.localeCompare(b)).slice(0, k);\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        "biryani",
                        "pizza",
                        "biryani",
                        "burger",
                        "pizza",
                        "biryani"
                    ],
                    2
                ],
                "expected": [
                    "biryani",
                    "pizza"
                ],
                "isHidden": false
            }
        ]
    },
    {
        "id": "swig-19",
        "company": "swiggy",
        "category": "startup",
        "number": 19,
        "title": "Rain Surge Delivery Fee Estimator",
        "difficulty": "Easy",
        "topic": "Conditionals & Math",
        "frequency": "89% in Swiggy Payments",
        "context": "Weather-triggered extra compensation for riders",
        "fnName": "solve",
        "params": [
            {
                "name": "baseFee",
                "type": "int"
            },
            {
                "name": "rainLevelMm",
                "type": "int"
            },
            {
                "name": "isMidnight",
                "type": "bool"
            }
        ],
        "returnType": "int",
        "description": "Rain surcharge: if `rainLevelMm > 20`, add 30; if `10 < rainLevelMm <= 20`, add 15; otherwise add 0. If `isMidnight` is true, add an additional 20. Return total fee.",
        "constraints": [
            "baseFee >= 0",
            "rainLevelMm >= 0"
        ],
        "hint": "Straightforward branching on rain ranges and midnight boolean.",
        "starter": {
            "python": "def solve(baseFee, rainLevelMm, isMidnight):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(baseFee, rainLevelMm, isMidnight) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(baseFee, rainLevelMm, isMidnight):\n    fee = baseFee\n    if rainLevelMm > 20: fee += 30\n    elif rainLevelMm > 10: fee += 15\n    if isMidnight: fee += 20\n    return fee",
            "javascript": "function solve(baseFee, rainLevelMm, isMidnight) {\n    let fee = baseFee;\n    if (rainLevelMm > 20) fee += 30;\n    else if (rainLevelMm > 10) fee += 15;\n    if (isMidnight) fee += 20;\n    return fee;\n}"
        },
        "testCases": [
            {
                "args": [
                    40,
                    25,
                    true
                ],
                "expected": 90,
                "isHidden": false
            },
            {
                "args": [
                    35,
                    5,
                    false
                ],
                "expected": 35,
                "isHidden": false
            }
        ]
    },
    {
        "id": "swig-20",
        "company": "swiggy",
        "category": "startup",
        "number": 20,
        "title": "Delivery Bag Maximum Volume Packing",
        "difficulty": "Medium",
        "topic": "Binary Search Greedy",
        "frequency": "90% in Swiggy Hardware",
        "context": "Modular delivery box capacity assignment",
        "fnName": "solve",
        "params": [
            {
                "name": "itemSizes",
                "type": "int[]"
            },
            {
                "name": "bagCapacity",
                "type": "int"
            }
        ],
        "returnType": "int",
        "description": "Given sizes of grocery boxes `itemSizes`. You can pack items into the bag sequentially as long as cumulative size does not exceed `bagCapacity`. Return maximum number of consecutive items packed from start.",
        "constraints": [
            "1 <= itemSizes.length <= 10^5"
        ],
        "hint": "Iterate while keeping running total. Stop when total > bagCapacity.",
        "starter": {
            "python": "def solve(itemSizes, bagCapacity):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(itemSizes, bagCapacity) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(itemSizes, bagCapacity):\n    curr, count = 0, 0\n    for s in itemSizes:\n        if curr + s <= bagCapacity:\n            curr += s\n            count += 1\n        else: break\n    return count",
            "javascript": "function solve(itemSizes, bagCapacity) {\n    let curr = 0, count = 0;\n    for (const s of itemSizes) {\n        if (curr + s <= bagCapacity) { curr += s; count++; } else break;\n    }\n    return count;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        10,
                        15,
                        20,
                        30
                    ],
                    40
                ],
                "expected": 2,
                "isHidden": false
            },
            {
                "args": [
                    [
                        5,
                        5,
                        5,
                        5,
                        5
                    ],
                    20
                ],
                "expected": 4,
                "isHidden": false
            }
        ]
    }
];
