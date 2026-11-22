export const INFOSYS_QUESTIONS = [
    {
        "id": "inf-1",
        "company": "infosys",
        "category": "service",
        "number": 1,
        "title": "RPG Monster Battle Maximizer",
        "difficulty": "Medium",
        "topic": "Greedy & Sorting",
        "frequency": "95% in InfyTQ / SP",
        "context": "Infosys Specialist Programmer (SP) classic round 1",
        "fnName": "solve",
        "params": [
            {
                "name": "initialExp",
                "type": "int"
            },
            {
                "name": "monsters",
                "type": "int[]"
            },
            {
                "name": "bonus",
                "type": "int[]"
            }
        ],
        "returnType": "int",
        "description": "A hero starts with `initialExp` experience. To defeat monster `i`, the hero's experience must be >= `monsters[i]`. Upon defeating monster `i`, the hero's experience increases by `bonus[i]`. Monsters can be fought in any order. Return the maximum number of monsters the hero can defeat.",
        "constraints": [
            "1 <= initialExp <= 10^9",
            "1 <= monsters.length <= 10^4",
            "monsters.length == bonus.length"
        ],
        "hint": "Sort monsters by required experience ascending. Defeat greedily while initialExp >= monster[i].",
        "starter": {
            "python": "def solve(initialExp, monsters, bonus):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(initialExp, monsters, bonus) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(initialExp, monsters, bonus):\n    pairs = sorted(zip(monsters, bonus))\n    exp = initialExp\n    defeated = 0\n    for m, b in pairs:\n        if exp >= m:\n            exp += b\n            defeated += 1\n        else:\n            break\n    return defeated",
            "javascript": "function solve(initialExp, monsters, bonus) {\n    const pairs = monsters.map((m, i) => [m, bonus[i]]).sort((a, b) => a[0] - b[0]);\n    let exp = initialExp, defeated = 0;\n    for (const [m, b] of pairs) {\n        if (exp >= m) { exp += b; defeated++; }\n        else break;\n    }\n    return defeated;\n}"
        },
        "testCases": [
            {
                "args": [
                    123,
                    [
                        78,
                        130
                    ],
                    [
                        10,
                        0
                    ]
                ],
                "expected": 2,
                "isHidden": false
            },
            {
                "args": [
                    100,
                    [
                        101,
                        100,
                        304,
                        450
                    ],
                    [
                        100,
                        1,
                        200,
                        100
                    ]
                ],
                "expected": 2,
                "isHidden": false
            },
            {
                "args": [
                    50,
                    [
                        60,
                        70
                    ],
                    [
                        10,
                        10
                    ]
                ],
                "expected": 0,
                "isHidden": true
            }
        ]
    },
    {
        "id": "inf-2",
        "company": "infosys",
        "category": "service",
        "number": 2,
        "title": "Grid Unique Paths with Obstacles",
        "difficulty": "Medium",
        "topic": "Dynamic Programming",
        "frequency": "90% in Infosys DSE",
        "context": "Grid navigation obstacle question in Infosys DSE",
        "fnName": "solve",
        "params": [
            {
                "name": "obstacleGrid",
                "type": "int[][]"
            }
        ],
        "returnType": "int",
        "description": "Given `m x n` grid where 1 represents an obstacle and 0 is open space, return the number of unique paths from top-left `(0, 0)` to bottom-right `(m-1, n-1)`. You can only move either down or right.",
        "constraints": [
            "1 <= m, n <= 100",
            "obstacleGrid[i][j] in {0, 1}"
        ],
        "hint": "dp[i][j] = dp[i-1][j] + dp[i][j-1] if grid[i][j] == 0 else 0.",
        "starter": {
            "python": "def solve(obstacleGrid):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(obstacleGrid) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(obstacleGrid):\n    m, n = len(obstacleGrid), len(obstacleGrid[0])\n    if obstacleGrid[0][0] == 1 or obstacleGrid[m-1][n-1] == 1: return 0\n    dp = [0] * n\n    dp[0] = 1\n    for i in range(m):\n        for j in range(n):\n            if obstacleGrid[i][j] == 1:\n                dp[j] = 0\n            elif j > 0:\n                dp[j] += dp[j - 1]\n    return dp[-1]",
            "javascript": "function solve(obstacleGrid) {\n    const m = obstacleGrid.length, n = obstacleGrid[0].length;\n    if (obstacleGrid[0][0] === 1 || obstacleGrid[m - 1][n - 1] === 1) return 0;\n    const dp = new Array(n).fill(0);\n    dp[0] = 1;\n    for (let i = 0; i < m; i++) {\n        for (let j = 0; j < n; j++) {\n            if (obstacleGrid[i][j] === 1) dp[j] = 0;\n            else if (j > 0) dp[j] += dp[j - 1];\n        }\n    }\n    return dp[n - 1];\n}"
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
                "expected": 2,
                "isHidden": false
            },
            {
                "args": [
                    [
                        [
                            0,
                            1
                        ],
                        [
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
                            0
                        ]
                    ]
                ],
                "expected": 0,
                "isHidden": true
            }
        ]
    },
    {
        "id": "inf-3",
        "company": "infosys",
        "category": "service",
        "number": 3,
        "title": "Maximum Subarray Sum (Kadane's)",
        "difficulty": "Easy",
        "topic": "Arrays & DP",
        "frequency": "92% in Infosys SP/DSE",
        "context": "Infosys core coding assessment",
        "fnName": "solve",
        "params": [
            {
                "name": "nums",
                "type": "int[]"
            }
        ],
        "returnType": "int",
        "description": "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.",
        "constraints": [
            "1 <= nums.length <= 10^5",
            "-10^4 <= nums[i] <= 10^4"
        ],
        "hint": "Kadane algorithm: cur = max(x, cur + x); max_sum = max(max_sum, cur).",
        "starter": {
            "python": "def solve(nums):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(nums) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(nums):\n    max_sum = cur = nums[0]\n    for x in nums[1:]:\n        cur = max(x, cur + x)\n        max_sum = max(max_sum, cur)\n    return max_sum",
            "javascript": "function solve(nums) {\n    let maxSum = nums[0], cur = nums[0];\n    for (let i = 1; i < nums.length; i++) {\n        cur = Math.max(nums[i], cur + nums[i]);\n        maxSum = Math.max(maxSum, cur);\n    }\n    return maxSum;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        -2,
                        1,
                        -3,
                        4,
                        -1,
                        2,
                        1,
                        -5,
                        4
                    ]
                ],
                "expected": 6,
                "isHidden": false
            },
            {
                "args": [
                    [
                        1
                    ]
                ],
                "expected": 1,
                "isHidden": false
            },
            {
                "args": [
                    [
                        5,
                        4,
                        -1,
                        7,
                        8
                    ]
                ],
                "expected": 23,
                "isHidden": true
            }
        ]
    },
    {
        "id": "inf-4",
        "company": "infosys",
        "category": "service",
        "number": 4,
        "title": "Minimum Jumps to Reach Array End",
        "difficulty": "Medium",
        "topic": "Greedy",
        "frequency": "89% in Infosys SP",
        "context": "Infosys SP Round 1 jump problem",
        "fnName": "solve",
        "params": [
            {
                "name": "nums",
                "type": "int[]"
            }
        ],
        "returnType": "int",
        "description": "Given integer array `nums` where `nums[i]` is max jump length from index `i`. Return minimum jumps to reach `nums[n - 1]`. (Assume you can always reach the end).",
        "constraints": [
            "1 <= nums.length <= 10^4",
            "0 <= nums[i] <= 1000"
        ],
        "hint": "Greedy BFS: track current jump end and farthest reachable index.",
        "starter": {
            "python": "def solve(nums):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(nums) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(nums):\n    jumps = cur_end = farthest = 0\n    for i in range(len(nums) - 1):\n        farthest = max(farthest, i + nums[i])\n        if i == cur_end:\n            jumps += 1\n            cur_end = farthest\n    return jumps",
            "javascript": "function solve(nums) {\n    let jumps = 0, curEnd = 0, farthest = 0;\n    for (let i = 0; i < nums.length - 1; i++) {\n        farthest = Math.max(farthest, i + nums[i]);\n        if (i === curEnd) {\n            jumps++;\n            curEnd = farthest;\n        }\n    }\n    return jumps;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        2,
                        3,
                        1,
                        1,
                        4
                    ]
                ],
                "expected": 2,
                "isHidden": false
            },
            {
                "args": [
                    [
                        2,
                        3,
                        0,
                        1,
                        4
                    ]
                ],
                "expected": 2,
                "isHidden": false
            },
            {
                "args": [
                    [
                        1
                    ]
                ],
                "expected": 0,
                "isHidden": true
            }
        ]
    },
    {
        "id": "inf-5",
        "company": "infosys",
        "category": "service",
        "number": 5,
        "title": "Coin Change Minimum Count",
        "difficulty": "Medium",
        "topic": "Dynamic Programming",
        "frequency": "93% in Infosys DSE",
        "context": "Denomination optimization in Infosys DSE",
        "fnName": "solve",
        "params": [
            {
                "name": "coins",
                "type": "int[]"
            },
            {
                "name": "amount",
                "type": "int"
            }
        ],
        "returnType": "int",
        "description": "Given integer array `coins` and total `amount`, return the fewest number of coins needed to make up that amount. If cannot be made up, return -1.",
        "constraints": [
            "1 <= coins.length <= 12",
            "0 <= amount <= 10^4"
        ],
        "hint": "dp[i] = min(dp[i], dp[i - c] + 1). Initialize dp with infinity.",
        "starter": {
            "python": "def solve(coins, amount):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(coins, amount) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(coins, amount):\n    dp = [float('inf')] * (amount + 1)\n    dp[0] = 0\n    for c in coins:\n        for x in range(c, amount + 1):\n            dp[x] = min(dp[x], dp[x - c] + 1)\n    return dp[amount] if dp[amount] != float('inf') else -1",
            "javascript": "function solve(coins, amount) {\n    const dp = new Array(amount + 1).fill(Infinity);\n    dp[0] = 0;\n    for (const c of coins) {\n        for (let x = c; x <= amount; x++) {\n            dp[x] = Math.min(dp[x], dp[x - c] + 1);\n        }\n    }\n    return dp[amount] === Infinity ? -1 : dp[amount];\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        1,
                        2,
                        5
                    ],
                    11
                ],
                "expected": 3,
                "isHidden": false
            },
            {
                "args": [
                    [
                        2
                    ],
                    3
                ],
                "expected": -1,
                "isHidden": false
            },
            {
                "args": [
                    [
                        1
                    ],
                    0
                ],
                "expected": 0,
                "isHidden": true
            }
        ]
    },
    {
        "id": "inf-6",
        "company": "infosys",
        "category": "service",
        "number": 6,
        "title": "Count All Palindromic Substrings",
        "difficulty": "Medium",
        "topic": "Two Pointers & Strings",
        "frequency": "88% in Infosys SP",
        "context": "Infosys SP String validation round",
        "fnName": "solve",
        "params": [
            {
                "name": "s",
                "type": "string"
            }
        ],
        "returnType": "int",
        "description": "Given a string `s`, return the number of palindromic substrings in it. (A substring is a contiguous sequence of characters).",
        "constraints": [
            "1 <= s.length <= 1000"
        ],
        "hint": "Expand around each center: odd centers (i, i) and even centers (i, i+1).",
        "starter": {
            "python": "def solve(s):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(s) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(s):\n    n = len(s)\n    ans = 0\n    def expand(l, r):\n        c = 0\n        while l >= 0 and r < n and s[l] == s[r]:\n            c += 1; l -= 1; r += 1\n        return c\n    for i in range(n):\n        ans += expand(i, i) + expand(i, i + 1)\n    return ans",
            "javascript": "function solve(s) {\n    let ans = 0;\n    const expand = (l, r) => {\n        let c = 0;\n        while (l >= 0 && r < s.length && s[l] === s[r]) { c++; l--; r++; }\n        return c;\n    };\n    for (let i = 0; i < s.length; i++) ans += expand(i, i) + expand(i, i + 1);\n    return ans;\n}"
        },
        "testCases": [
            {
                "args": [
                    "abc"
                ],
                "expected": 3,
                "isHidden": false
            },
            {
                "args": [
                    "aaa"
                ],
                "expected": 6,
                "isHidden": false
            },
            {
                "args": [
                    "racecar"
                ],
                "expected": 10,
                "isHidden": true
            }
        ]
    },
    {
        "id": "inf-7",
        "company": "infosys",
        "category": "service",
        "number": 7,
        "title": "Longest Increasing Subsequence Length",
        "difficulty": "Medium",
        "topic": "Binary Search & DP",
        "frequency": "94% in Infosys SP",
        "context": "Infosys Specialist Programmer benchmark challenge",
        "fnName": "solve",
        "params": [
            {
                "name": "nums",
                "type": "int[]"
            }
        ],
        "returnType": "int",
        "description": "Given integer array `nums`, return the length of the longest strictly increasing subsequence in O(n log n) time.",
        "constraints": [
            "1 <= nums.length <= 10^4",
            "-10^4 <= nums[i] <= 10^4"
        ],
        "hint": "Maintain an active tails array. Use binary search (bisect_left) to place each element.",
        "starter": {
            "python": "def solve(nums):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(nums) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(nums):\n    import bisect\n    tails = []\n    for x in nums:\n        idx = bisect.bisect_left(tails, x)\n        if idx == len(tails): tails.append(x)\n        else: tails[idx] = x\n    return len(tails)",
            "javascript": "function solve(nums) {\n    const tails = [];\n    for (const x of nums) {\n        let l = 0, r = tails.length;\n        while (l < r) {\n            const m = (l + r) >> 1;\n            if (tails[m] < x) l = m + 1;\n            else r = m;\n        }\n        if (l === tails.length) tails.push(x);\n        else tails[l] = x;\n    }\n    return tails.length;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        10,
                        9,
                        2,
                        5,
                        3,
                        7,
                        101,
                        18
                    ]
                ],
                "expected": 4,
                "isHidden": false
            },
            {
                "args": [
                    [
                        0,
                        1,
                        0,
                        3,
                        2,
                        3
                    ]
                ],
                "expected": 4,
                "isHidden": false
            },
            {
                "args": [
                    [
                        7,
                        7,
                        7,
                        7
                    ]
                ],
                "expected": 1,
                "isHidden": true
            }
        ]
    },
    {
        "id": "inf-8",
        "company": "infosys",
        "category": "service",
        "number": 8,
        "title": "Subset Sum Equal to Target",
        "difficulty": "Medium",
        "topic": "Dynamic Programming",
        "frequency": "87% in Infosys DSE",
        "context": "Infosys DSE resource allocation challenge",
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
        "returnType": "bool",
        "description": "Given non-negative integer array `nums` and integer `target`, return `true` if there exists a subset whose sum equals `target`, else `false`.",
        "constraints": [
            "1 <= nums.length <= 100",
            "1 <= target <= 10^4"
        ],
        "hint": "Boolean DP array of size target + 1. dp[j] = dp[j] or dp[j - num].",
        "starter": {
            "python": "def solve(nums, target):\n    # Write your logic here\n    return False",
            "javascript": "function solve(nums, target) {\n    // Write your logic here\n    return false;\n}"
        },
        "solution": {
            "python": "def solve(nums, target):\n    dp = [False] * (target + 1)\n    dp[0] = True\n    for x in nums:\n        for j in range(target, x - 1, -1):\n            dp[j] = dp[j] or dp[j - x]\n    return dp[target]",
            "javascript": "function solve(nums, target) {\n    const dp = new Array(target + 1).fill(false);\n    dp[0] = true;\n    for (const x of nums) {\n        for (let j = target; j >= x; j--) {\n            dp[j] = dp[j] || dp[j - x];\n        }\n    }\n    return dp[target];\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        3,
                        34,
                        4,
                        12,
                        5,
                        2
                    ],
                    9
                ],
                "expected": true,
                "isHidden": false
            },
            {
                "args": [
                    [
                        3,
                        34,
                        4,
                        12,
                        5,
                        2
                    ],
                    30
                ],
                "expected": false,
                "isHidden": false
            },
            {
                "args": [
                    [
                        1,
                        2,
                        3,
                        7
                    ],
                    6
                ],
                "expected": true,
                "isHidden": true
            }
        ]
    },
    {
        "id": "inf-9",
        "company": "infosys",
        "category": "service",
        "number": 9,
        "title": "Activity Selection Non-Overlapping Max",
        "difficulty": "Easy",
        "topic": "Greedy",
        "frequency": "91% in Infosys DSE",
        "context": "Infosys meeting scheduler challenge",
        "fnName": "solve",
        "params": [
            {
                "name": "start",
                "type": "int[]"
            },
            {
                "name": "end",
                "type": "int[]"
            }
        ],
        "returnType": "int",
        "description": "Given `start` and `end` times of activities, return the maximum number of activities a single person can perform, assuming only one activity can occur at a time.",
        "constraints": [
            "1 <= start.length <= 10^4",
            "start.length == end.length"
        ],
        "hint": "Sort activities by end time ascending. Pick activity if start >= last picked end.",
        "starter": {
            "python": "def solve(start, end):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(start, end) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(start, end):\n    acts = sorted(zip(start, end), key=lambda x: x[1])\n    count = 0\n    last_end = -1\n    for s, e in acts:\n        if s >= last_end:\n            count += 1\n            last_end = e\n    return count",
            "javascript": "function solve(start, end) {\n    const acts = start.map((s, i) => [s, end[i]]).sort((a, b) => a[1] - b[1]);\n    let count = 0, lastEnd = -1;\n    for (const [s, e] of acts) {\n        if (s >= lastEnd) {\n            count++;\n            lastEnd = e;\n        }\n    }\n    return count;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        1,
                        3,
                        2,
                        5
                    ],
                    [
                        2,
                        4,
                        3,
                        6
                    ]
                ],
                "expected": 3,
                "isHidden": false
            },
            {
                "args": [
                    [
                        1,
                        2,
                        3
                    ],
                    [
                        4,
                        5,
                        6
                    ]
                ],
                "expected": 1,
                "isHidden": false
            }
        ]
    },
    {
        "id": "inf-10",
        "company": "infosys",
        "category": "service",
        "number": 10,
        "title": "Decode Ways (A=1 ... Z=26)",
        "difficulty": "Medium",
        "topic": "Dynamic Programming",
        "frequency": "86% in Infosys SP",
        "context": "Message deciphering in Infosys SP",
        "fnName": "solve",
        "params": [
            {
                "name": "s",
                "type": "string"
            }
        ],
        "returnType": "int",
        "description": "A message containing letters A-Z is encoded to numbers using 'A'->'1' ... 'Z'->'26'. Given digit string `s`, return the number of ways to decode it.",
        "constraints": [
            "1 <= s.length <= 100"
        ],
        "hint": "dp[i] = dp[i-1] (if 1-digit valid) + dp[i-2] (if 2-digits 10-26).",
        "starter": {
            "python": "def solve(s):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(s) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(s):\n    if not s or s[0] == '0': return 0\n    n = len(s)\n    dp = [0] * (n + 1)\n    dp[0] = dp[1] = 1\n    for i in range(2, n + 1):\n        one = int(s[i-1:i])\n        two = int(s[i-2:i])\n        if 1 <= one <= 9: dp[i] += dp[i - 1]\n        if 10 <= two <= 26: dp[i] += dp[i - 2]\n    return dp[n]",
            "javascript": "function solve(s) {\n    if (!s || s[0] === '0') return 0;\n    const n = s.length;\n    const dp = new Array(n + 1).fill(0);\n    dp[0] = dp[1] = 1;\n    for (let i = 2; i <= n; i++) {\n        const one = Number(s.substring(i - 1, i));\n        const two = Number(s.substring(i - 2, i));\n        if (one >= 1 && one <= 9) dp[i] += dp[i - 1];\n        if (two >= 10 && two <= 26) dp[i] += dp[i - 2];\n    }\n    return dp[n];\n}"
        },
        "testCases": [
            {
                "args": [
                    "12"
                ],
                "expected": 2,
                "isHidden": false
            },
            {
                "args": [
                    "226"
                ],
                "expected": 3,
                "isHidden": false
            },
            {
                "args": [
                    "06"
                ],
                "expected": 0,
                "isHidden": true
            }
        ]
    },
    {
        "id": "inf-11",
        "company": "infosys",
        "category": "service",
        "number": 11,
        "title": "House Robber (Max Non-Adjacent Loot)",
        "difficulty": "Easy",
        "topic": "Dynamic Programming",
        "frequency": "91% in Infosys DSE",
        "context": "Infosys classic dynamic programming",
        "fnName": "solve",
        "params": [
            {
                "name": "nums",
                "type": "int[]"
            }
        ],
        "returnType": "int",
        "description": "Given integer array `nums` representing cash in houses along a street. You cannot rob two adjacent houses. Return maximum amount of money you can rob tonight.",
        "constraints": [
            "1 <= nums.length <= 100",
            "0 <= nums[i] <= 400"
        ],
        "hint": "rob1, rob2 = 0, 0. For each num: newRob = max(rob1 + n, rob2).",
        "starter": {
            "python": "def solve(nums):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(nums) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(nums):\n    prev1 = prev2 = 0\n    for x in nums:\n        prev1, prev2 = max(prev2 + x, prev1), prev1\n    return prev1",
            "javascript": "function solve(nums) {\n    let prev1 = 0, prev2 = 0;\n    for (const x of nums) {\n        const tmp = Math.max(prev2 + x, prev1);\n        prev2 = prev1;\n        prev1 = tmp;\n    }\n    return prev1;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        1,
                        2,
                        3,
                        1
                    ]
                ],
                "expected": 4,
                "isHidden": false
            },
            {
                "args": [
                    [
                        2,
                        7,
                        9,
                        3,
                        1
                    ]
                ],
                "expected": 12,
                "isHidden": false
            }
        ]
    },
    {
        "id": "inf-12",
        "company": "infosys",
        "category": "service",
        "number": 12,
        "title": "Min Cost Climbing Stairs",
        "difficulty": "Easy",
        "topic": "Dynamic Programming",
        "frequency": "88% in Infosys DSE",
        "context": "Infosys foundational step test",
        "fnName": "solve",
        "params": [
            {
                "name": "cost",
                "type": "int[]"
            }
        ],
        "returnType": "int",
        "description": "Given integer array `cost` where `cost[i]` is cost of step `i`. Once you pay, you can climb 1 or 2 steps. You can start from index 0 or 1. Return minimum cost to reach the top.",
        "constraints": [
            "2 <= cost.length <= 1000",
            "0 <= cost[i] <= 999"
        ],
        "hint": "Work backwards or forward: f[i] = cost[i] + min(f[i+1], f[i+2]).",
        "starter": {
            "python": "def solve(cost):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(cost) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(cost):\n    n = len(cost)\n    a, b = cost[0], cost[1]\n    for i in range(2, n):\n        a, b = b, cost[i] + min(a, b)\n    return min(a, b)",
            "javascript": "function solve(cost) {\n    let a = cost[0], b = cost[1];\n    for (let i = 2; i < cost.length; i++) {\n        const next = cost[i] + Math.min(a, b);\n        a = b;\n        b = next;\n    }\n    return Math.min(a, b);\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        10,
                        15,
                        20
                    ]
                ],
                "expected": 15,
                "isHidden": false
            },
            {
                "args": [
                    [
                        1,
                        100,
                        1,
                        1,
                        1,
                        100,
                        1,
                        1,
                        100,
                        1
                    ]
                ],
                "expected": 6,
                "isHidden": false
            }
        ]
    },
    {
        "id": "inf-13",
        "company": "infosys",
        "category": "service",
        "number": 13,
        "title": "Maximal Square of 1s in Binary Matrix",
        "difficulty": "Medium",
        "topic": "2D DP",
        "frequency": "89% in Infosys SP",
        "context": "Infosys image block analysis challenge",
        "fnName": "solve",
        "params": [
            {
                "name": "matrix",
                "type": "int[][]"
            }
        ],
        "returnType": "int",
        "description": "Given an `m x n` binary matrix filled with 0s and 1s, find the largest square containing only 1s and return its area (side * side).",
        "constraints": [
            "1 <= m, n <= 300",
            "matrix[i][j] in {0, 1}"
        ],
        "hint": "dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) when matrix[i][j] == 1.",
        "starter": {
            "python": "def solve(matrix):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(matrix) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(matrix):\n    if not matrix: return 0\n    m, n = len(matrix), len(matrix[0])\n    dp = [[0] * (n + 1) for _ in range(m + 1)]\n    max_side = 0\n    for i in range(1, m + 1):\n        for j in range(1, n + 1):\n            if matrix[i-1][j-1] == 1:\n                dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])\n                max_side = max(max_side, dp[i][j])\n    return max_side * max_side",
            "javascript": "function solve(matrix) {\n    const m = matrix.length, n = matrix[0].length;\n    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));\n    let maxSide = 0;\n    for (let i = 1; i <= m; i++) {\n        for (let j = 1; j <= n; j++) {\n            if (matrix[i - 1][j - 1] === 1) {\n                dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);\n                maxSide = Math.max(maxSide, dp[i][j]);\n            }\n        }\n    }\n    return maxSide * maxSide;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        [
                            1,
                            0,
                            1,
                            0,
                            0
                        ],
                        [
                            1,
                            0,
                            1,
                            1,
                            1
                        ],
                        [
                            1,
                            1,
                            1,
                            1,
                            1
                        ],
                        [
                            1,
                            0,
                            0,
                            1,
                            0
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
                            0,
                            1
                        ],
                        [
                            1,
                            0
                        ]
                    ]
                ],
                "expected": 1,
                "isHidden": false
            }
        ]
    },
    {
        "id": "inf-14",
        "company": "infosys",
        "category": "service",
        "number": 14,
        "title": "Partition Equal Subset Sum",
        "difficulty": "Medium",
        "topic": "Knapsack DP",
        "frequency": "90% in Infosys SP",
        "context": "Infosys load partitioning assessment",
        "fnName": "solve",
        "params": [
            {
                "name": "nums",
                "type": "int[]"
            }
        ],
        "returnType": "bool",
        "description": "Given an integer array `nums`, return `true` if you can partition the array into two subsets such that the sum of elements in both subsets is equal, else `false`.",
        "constraints": [
            "1 <= nums.length <= 200",
            "1 <= nums[i] <= 100"
        ],
        "hint": "Total sum S must be even. Check if subset sum S / 2 is possible.",
        "starter": {
            "python": "def solve(nums):\n    # Write your logic here\n    return False",
            "javascript": "function solve(nums) {\n    // Write your logic here\n    return false;\n}"
        },
        "solution": {
            "python": "def solve(nums):\n    total = sum(nums)\n    if total % 2 != 0: return False\n    target = total // 2\n    dp = [False] * (target + 1)\n    dp[0] = True\n    for x in nums:\n        for j in range(target, x - 1, -1):\n            dp[j] = dp[j] or dp[j - x]\n    return dp[target]",
            "javascript": "function solve(nums) {\n    const total = nums.reduce((a, b) => a + b, 0);\n    if (total % 2 !== 0) return false;\n    const target = total / 2;\n    const dp = new Array(target + 1).fill(false);\n    dp[0] = true;\n    for (const x of nums) {\n        for (let j = target; j >= x; j--) {\n            dp[j] = dp[j] || dp[j - x];\n        }\n    }\n    return dp[target];\n}"
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
        "id": "inf-15",
        "company": "infosys",
        "category": "service",
        "number": 15,
        "title": "Gas Station Circular Tour",
        "difficulty": "Medium",
        "topic": "Greedy Simulation",
        "frequency": "88% in Infosys SP",
        "context": "Fleet routing challenge in Infosys SP",
        "fnName": "solve",
        "params": [
            {
                "name": "gas",
                "type": "int[]"
            },
            {
                "name": "cost",
                "type": "int[]"
            }
        ],
        "returnType": "int",
        "description": "Given circular route of `n` gas stations with `gas[i]` amount of fuel and `cost[i]` to travel to next station. Return starting gas station's index if you can travel around circuit once clockwise, else -1.",
        "constraints": [
            "1 <= gas.length <= 10^5",
            "gas.length == cost.length"
        ],
        "hint": "If sum(gas) < sum(cost), impossible. Else reset starting station whenever current tank drops below 0.",
        "starter": {
            "python": "def solve(gas, cost):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(gas, cost) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(gas, cost):\n    if sum(gas) < sum(cost): return -1\n    total = start = 0\n    for i in range(len(gas)):\n        total += gas[i] - cost[i]\n        if total < 0:\n            total = 0\n            start = i + 1\n    return start",
            "javascript": "function solve(gas, cost) {\n    let totalGas = 0, totalCost = 0;\n    for (let i = 0; i < gas.length; i++) {\n        totalGas += gas[i];\n        totalCost += cost[i];\n    }\n    if (totalGas < totalCost) return -1;\n    let current = 0, start = 0;\n    for (let i = 0; i < gas.length; i++) {\n        current += gas[i] - cost[i];\n        if (current < 0) {\n            current = 0;\n            start = i + 1;\n        }\n    }\n    return start;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        1,
                        2,
                        3,
                        4,
                        5
                    ],
                    [
                        3,
                        4,
                        5,
                        1,
                        2
                    ]
                ],
                "expected": 3,
                "isHidden": false
            },
            {
                "args": [
                    [
                        2,
                        3,
                        4
                    ],
                    [
                        3,
                        4,
                        3
                    ]
                ],
                "expected": -1,
                "isHidden": false
            }
        ]
    },
    {
        "id": "inf-16",
        "company": "infosys",
        "category": "service",
        "number": 16,
        "title": "Word Break Segmentability",
        "difficulty": "Medium",
        "topic": "DP & Sets",
        "frequency": "86% in Infosys SP",
        "context": "Infosys text analysis search engine",
        "fnName": "solve",
        "params": [
            {
                "name": "s",
                "type": "string"
            },
            {
                "name": "wordDict",
                "type": "string[]"
            }
        ],
        "returnType": "bool",
        "description": "Given string `s` and word dictionary `wordDict`, return `true` if `s` can be segmented into a space-separated sequence of one or more dictionary words.",
        "constraints": [
            "1 <= s.length <= 300",
            "1 <= wordDict.length <= 1000"
        ],
        "hint": "dp[i] is true if dp[j] is true and s[j:i] in wordDict.",
        "starter": {
            "python": "def solve(s, wordDict):\n    # Write your logic here\n    return False",
            "javascript": "function solve(s, wordDict) {\n    // Write your logic here\n    return false;\n}"
        },
        "solution": {
            "python": "def solve(s, wordDict):\n    words = set(wordDict)\n    dp = [False] * (len(s) + 1)\n    dp[0] = True\n    for i in range(1, len(s) + 1):\n        for j in range(i):\n            if dp[j] and s[j:i] in words:\n                dp[i] = True\n                break\n    return dp[len(s)]",
            "javascript": "function solve(s, wordDict) {\n    const set = new Set(wordDict);\n    const dp = new Array(s.length + 1).fill(false);\n    dp[0] = true;\n    for (let i = 1; i <= s.length; i++) {\n        for (let j = 0; j < i; j++) {\n            if (dp[j] && set.has(s.substring(j, i))) {\n                dp[i] = true;\n                break;\n            }\n        }\n    }\n    return dp[s.length];\n}"
        },
        "testCases": [
            {
                "args": [
                    "leetcode",
                    [
                        "leet",
                        "code"
                    ]
                ],
                "expected": true,
                "isHidden": false
            },
            {
                "args": [
                    "applepenapple",
                    [
                        "apple",
                        "pen"
                    ]
                ],
                "expected": true,
                "isHidden": false
            },
            {
                "args": [
                    "catsandog",
                    [
                        "cats",
                        "dog",
                        "sand",
                        "and",
                        "cat"
                    ]
                ],
                "expected": false,
                "isHidden": true
            }
        ]
    },
    {
        "id": "inf-17",
        "company": "infosys",
        "category": "service",
        "number": 17,
        "title": "Longest Common Subsequence Length",
        "difficulty": "Medium",
        "topic": "Dynamic Programming",
        "frequency": "95% in Infosys SP",
        "context": "Version control diff comparator in Infosys SP",
        "fnName": "solve",
        "params": [
            {
                "name": "text1",
                "type": "string"
            },
            {
                "name": "text2",
                "type": "string"
            }
        ],
        "returnType": "int",
        "description": "Given two strings `text1` and `text2`, return the length of their longest common subsequence. If no common subsequence exists, return 0.",
        "constraints": [
            "1 <= text1.length, text2.length <= 1000"
        ],
        "hint": "If t1[i-1] == t2[j-1]: dp[i][j] = dp[i-1][j-1] + 1; else max(dp[i-1][j], dp[i][j-1]).",
        "starter": {
            "python": "def solve(text1, text2):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(text1, text2) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(text1, text2):\n    m, n = len(text1), len(text2)\n    dp = [[0] * (n + 1) for _ in range(m + 1)]\n    for i in range(1, m + 1):\n        for j in range(1, n + 1):\n            if text1[i-1] == text2[j-1]:\n                dp[i][j] = dp[i-1][j-1] + 1\n            else:\n                dp[i][j] = max(dp[i-1][j], dp[i][j-1])\n    return dp[m][n]",
            "javascript": "function solve(text1, text2) {\n    const m = text1.length, n = text2.length;\n    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));\n    for (let i = 1; i <= m; i++) {\n        for (let j = 1; j <= n; j++) {\n            if (text1[i - 1] === text2[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;\n            else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);\n        }\n    }\n    return dp[m][n];\n}"
        },
        "testCases": [
            {
                "args": [
                    "abcde",
                    "ace"
                ],
                "expected": 3,
                "isHidden": false
            },
            {
                "args": [
                    "abc",
                    "abc"
                ],
                "expected": 3,
                "isHidden": false
            },
            {
                "args": [
                    "abc",
                    "def"
                ],
                "expected": 0,
                "isHidden": true
            }
        ]
    },
    {
        "id": "inf-18",
        "company": "infosys",
        "category": "service",
        "number": 18,
        "title": "Rod Cutting Maximum Profit",
        "difficulty": "Medium",
        "topic": "Unbounded Knapsack",
        "frequency": "89% in Infosys SP",
        "context": "Infosys manufacturing optimization problem",
        "fnName": "solve",
        "params": [
            {
                "name": "price",
                "type": "int[]"
            },
            {
                "name": "n",
                "type": "int"
            }
        ],
        "returnType": "int",
        "description": "Given a rod of length `n` and an array of prices where `price[i]` is price of rod of length `i + 1`. Determine maximum value obtainable by cutting up the rod and selling the pieces.",
        "constraints": [
            "1 <= n <= 100",
            "price.length >= n"
        ],
        "hint": "dp[i] = max(dp[i], price[j] + dp[i - j - 1]) for all cut lengths j+1 <= i.",
        "starter": {
            "python": "def solve(price, n):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(price, n) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(price, n):\n    dp = [0] * (n + 1)\n    for i in range(1, n + 1):\n        for j in range(i):\n            dp[i] = max(dp[i], price[j] + dp[i - j - 1])\n    return dp[n]",
            "javascript": "function solve(price, n) {\n    const dp = new Array(n + 1).fill(0);\n    for (let i = 1; i <= n; i++) {\n        for (let j = 0; j < i; j++) {\n            dp[i] = Math.max(dp[i], price[j] + dp[i - j - 1]);\n        }\n    }\n    return dp[n];\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        1,
                        5,
                        8,
                        9,
                        10,
                        17,
                        17,
                        20
                    ],
                    8
                ],
                "expected": 22,
                "isHidden": false
            },
            {
                "args": [
                    [
                        2,
                        5,
                        7,
                        8
                    ],
                    4
                ],
                "expected": 10,
                "isHidden": false
            }
        ]
    },
    {
        "id": "inf-19",
        "company": "infosys",
        "category": "service",
        "number": 19,
        "title": "Edit Distance (Levenshtein Distance)",
        "difficulty": "Hard",
        "topic": "Dynamic Programming",
        "frequency": "90% in Infosys SP Round 2",
        "context": "Fuzzy string matching in Infosys SP",
        "fnName": "solve",
        "params": [
            {
                "name": "word1",
                "type": "string"
            },
            {
                "name": "word2",
                "type": "string"
            }
        ],
        "returnType": "int",
        "description": "Given two strings `word1` and `word2`, return the minimum number of operations (insert, delete, replace) required to convert `word1` to `word2`.",
        "constraints": [
            "0 <= word1.length, word2.length <= 500"
        ],
        "hint": "dp[i][j] = dp[i-1][j-1] if match else 1 + min(insert, delete, replace).",
        "starter": {
            "python": "def solve(word1, word2):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(word1, word2) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(word1, word2):\n    m, n = len(word1), len(word2)\n    dp = [[0] * (n + 1) for _ in range(m + 1)]\n    for i in range(m + 1): dp[i][0] = i\n    for j in range(n + 1): dp[0][j] = j\n    for i in range(1, m + 1):\n        for j in range(1, n + 1):\n            if word1[i-1] == word2[j-1]:\n                dp[i][j] = dp[i-1][j-1]\n            else:\n                dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])\n    return dp[m][n]",
            "javascript": "function solve(word1, word2) {\n    const m = word1.length, n = word2.length;\n    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));\n    for (let i = 0; i <= m; i++) dp[i][0] = i;\n    for (let j = 0; j <= n; j++) dp[0][j] = j;\n    for (let i = 1; i <= m; i++) {\n        for (let j = 1; j <= n; j++) {\n            if (word1[i - 1] === word2[j - 1]) dp[i][j] = dp[i - 1][j - 1];\n            else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);\n        }\n    }\n    return dp[m][n];\n}"
        },
        "testCases": [
            {
                "args": [
                    "horse",
                    "ros"
                ],
                "expected": 3,
                "isHidden": false
            },
            {
                "args": [
                    "intention",
                    "execution"
                ],
                "expected": 5,
                "isHidden": false
            }
        ]
    },
    {
        "id": "inf-20",
        "company": "infosys",
        "category": "service",
        "number": 20,
        "title": "Stock Trading with One-Day Cooldown",
        "difficulty": "Medium",
        "topic": "State Machine DP",
        "frequency": "92% in Infosys SP",
        "context": "Financial simulation in Infosys SP",
        "fnName": "solve",
        "params": [
            {
                "name": "prices",
                "type": "int[]"
            }
        ],
        "returnType": "int",
        "description": "Given prices array where `prices[i]` is price of stock on day `i`. After you sell stock, you cannot buy stock on the next day (cooldown of 1 day). Return maximum profit.",
        "constraints": [
            "1 <= prices.length <= 5000",
            "0 <= prices[i] <= 1000"
        ],
        "hint": "Three states: held, sold, reset. held = max(held, reset - price). sold = held + price. reset = max(reset, prev_sold).",
        "starter": {
            "python": "def solve(prices):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(prices) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(prices):\n    if not prices: return 0\n    held = -float('inf')\n    sold = reset = 0\n    for p in prices:\n        prev_sold = sold\n        sold = held + p\n        held = max(held, reset - p)\n        reset = max(reset, prev_sold)\n    return max(sold, reset)",
            "javascript": "function solve(prices) {\n    let held = -Infinity, sold = 0, reset = 0;\n    for (const p of prices) {\n        const prevSold = sold;\n        sold = held + p;\n        held = Math.max(held, reset - p);\n        reset = Math.max(reset, prevSold);\n    }\n    return Math.max(sold, reset);\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        1,
                        2,
                        3,
                        0,
                        2
                    ]
                ],
                "expected": 3,
                "isHidden": false
            },
            {
                "args": [
                    [
                        1
                    ]
                ],
                "expected": 0,
                "isHidden": false
            }
        ]
    }
];
