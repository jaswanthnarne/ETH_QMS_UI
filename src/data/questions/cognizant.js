export const COGNIZANT_QUESTIONS = [
    {
        "id": "cog-1",
        "company": "cognizant",
        "category": "service",
        "number": 1,
        "title": "Longest Substring Without Repeating Characters",
        "difficulty": "Medium",
        "topic": "Sliding Window",
        "frequency": "96% in Cognizant GenC Elevate",
        "context": "Cognizant GenC Next benchmark question",
        "fnName": "solve",
        "params": [
            {
                "name": "s",
                "type": "string"
            }
        ],
        "returnType": "int",
        "description": "Given a string `s`, find the length of the longest substring without repeating characters.",
        "constraints": [
            "0 <= s.length <= 5 * 10^4"
        ],
        "hint": "Sliding window with hash map storing last seen index of each character.",
        "starter": {
            "python": "def solve(s):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(s) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(s):\n    seen = {}\n    l = ans = 0\n    for r, c in enumerate(s):\n        if c in seen and seen[c] >= l:\n            l = seen[c] + 1\n        seen[c] = r\n        ans = max(ans, r - l + 1)\n    return ans",
            "javascript": "function solve(s) {\n    const seen = new Map();\n    let l = 0, ans = 0;\n    for (let r = 0; r < s.length; r++) {\n        const c = s[r];\n        if (seen.has(c) && seen.get(c) >= l) {\n            l = seen.get(c) + 1;\n        }\n        seen.set(c, r);\n        ans = Math.max(ans, r - l + 1);\n    }\n    return ans;\n}"
        },
        "testCases": [
            {
                "args": [
                    "abcabcbb"
                ],
                "expected": 3,
                "isHidden": false
            },
            {
                "args": [
                    "bbbbb"
                ],
                "expected": 1,
                "isHidden": false
            },
            {
                "args": [
                    "pwwkew"
                ],
                "expected": 3,
                "isHidden": true
            }
        ]
    },
    {
        "id": "cog-2",
        "company": "cognizant",
        "category": "service",
        "number": 2,
        "title": "Container With Most Water",
        "difficulty": "Medium",
        "topic": "Two Pointers",
        "frequency": "95% in Cognizant GenC Elevate",
        "context": "Optimal volume evaluation in Cognizant",
        "fnName": "solve",
        "params": [
            {
                "name": "height",
                "type": "int[]"
            }
        ],
        "returnType": "int",
        "description": "Given integer array `height` representing vertical lines at each index, find two lines that together with x-axis form a container containing the most water. Return maximum water area.",
        "constraints": [
            "2 <= height.length <= 10^5",
            "0 <= height[i] <= 10^4"
        ],
        "hint": "Two pointers at left and right. Calculate area = (r - l) * min(h[l], h[r]). Move the pointer with smaller height.",
        "starter": {
            "python": "def solve(height):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(height) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(height):\n    l, r = 0, len(height) - 1\n    max_area = 0\n    while l < r:\n        max_area = max(max_area, (r - l) * min(height[l], height[r]))\n        if height[l] < height[r]: l += 1\n        else: r -= 1\n    return max_area",
            "javascript": "function solve(height) {\n    let l = 0, r = height.length - 1, maxArea = 0;\n    while (l < r) {\n        maxArea = Math.max(maxArea, (r - l) * Math.min(height[l], height[r]));\n        if (height[l] < height[r]) l++;\n        else r--;\n    }\n    return maxArea;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        1,
                        8,
                        6,
                        2,
                        5,
                        4,
                        8,
                        3,
                        7
                    ]
                ],
                "expected": 49,
                "isHidden": false
            },
            {
                "args": [
                    [
                        1,
                        1
                    ]
                ],
                "expected": 1,
                "isHidden": false
            }
        ]
    },
    {
        "id": "cog-3",
        "company": "cognizant",
        "category": "service",
        "number": 3,
        "title": "Trapping Rainwater Capacity",
        "difficulty": "Hard",
        "topic": "Two Pointers",
        "frequency": "92% in Cognizant GenC Next",
        "context": "Cognizant elevation trapping simulation",
        "fnName": "solve",
        "params": [
            {
                "name": "height",
                "type": "int[]"
            }
        ],
        "returnType": "int",
        "description": "Given `n` non-negative integers representing an elevation map where width of each bar is 1, compute how much water it can trap after raining.",
        "constraints": [
            "1 <= height.length <= 2 * 10^4",
            "0 <= height[i] <= 10^5"
        ],
        "hint": "Two pointers tracking left_max and right_max.",
        "starter": {
            "python": "def solve(height):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(height) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(height):\n    if not height: return 0\n    l, r = 0, len(height) - 1\n    l_max, r_max = height[l], height[r]\n    water = 0\n    while l < r:\n        if l_max < r_max:\n            l += 1\n            l_max = max(l_max, height[l])\n            water += l_max - height[l]\n        else:\n            r -= 1\n            r_max = max(r_max, height[r])\n            water += r_max - height[r]\n    return water",
            "javascript": "function solve(height) {\n    if (!height.length) return 0;\n    let l = 0, r = height.length - 1;\n    let lMax = height[l], rMax = height[r], water = 0;\n    while (l < r) {\n        if (lMax < rMax) {\n            l++;\n            lMax = Math.max(lMax, height[l]);\n            water += lMax - height[l];\n        } else {\n            r--;\n            rMax = Math.max(rMax, height[r]);\n            water += rMax - height[r];\n        }\n    }\n    return water;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        0,
                        1,
                        0,
                        2,
                        1,
                        0,
                        1,
                        3,
                        2,
                        1,
                        2,
                        1
                    ]
                ],
                "expected": 6,
                "isHidden": false
            },
            {
                "args": [
                    [
                        4,
                        2,
                        0,
                        3,
                        2,
                        5
                    ]
                ],
                "expected": 9,
                "isHidden": false
            }
        ]
    },
    {
        "id": "cog-4",
        "company": "cognizant",
        "category": "service",
        "number": 4,
        "title": "Subarray Sum Equals K",
        "difficulty": "Medium",
        "topic": "Prefix Sum & Hash Map",
        "frequency": "90% in Cognizant GenC Elevate",
        "context": "Subarray target matching in Cognizant",
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
        "description": "Given an array of integers `nums` and an integer `k`, return the total number of subarrays whose sum equals to `k`.",
        "constraints": [
            "1 <= nums.length <= 2 * 10^4",
            "-1000 <= nums[i] <= 1000",
            "-10^7 <= k <= 10^7"
        ],
        "hint": "Hash map storing frequency of prefix sums. At each step check if (current_sum - k) exists in map.",
        "starter": {
            "python": "def solve(nums, k):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(nums, k) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(nums, k):\n    seen = {0: 1}\n    cur = 0\n    ans = 0\n    for x in nums:\n        cur += x\n        ans += seen.get(cur - k, 0)\n        seen[cur] = seen.get(cur, 0) + 1\n    return ans",
            "javascript": "function solve(nums, k) {\n    const seen = new Map([[0, 1]]);\n    let cur = 0, ans = 0;\n    for (const x of nums) {\n        cur += x;\n        ans += seen.get(cur - k) || 0;\n        seen.set(cur, (seen.get(cur) || 0) + 1);\n    }\n    return ans;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        1,
                        1,
                        1
                    ],
                    2
                ],
                "expected": 2,
                "isHidden": false
            },
            {
                "args": [
                    [
                        1,
                        2,
                        3
                    ],
                    3
                ],
                "expected": 2,
                "isHidden": false
            }
        ]
    },
    {
        "id": "cog-5",
        "company": "cognizant",
        "category": "service",
        "number": 5,
        "title": "Sliding Window Maximum Values",
        "difficulty": "Hard",
        "topic": "Monotonic Deque",
        "frequency": "88% in Cognizant GenC Next",
        "context": "Real-time window sensor maximums in Cognizant",
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
        "description": "Given integer array `nums` and sliding window of size `k` moving from left to right, return the max for each sliding window position.",
        "constraints": [
            "1 <= nums.length <= 10^5",
            "1 <= k <= nums.length"
        ],
        "hint": "Use a deque storing indices of elements in decreasing order of value.",
        "starter": {
            "python": "def solve(nums, k):\n    # Write your logic here\n    return []",
            "javascript": "function solve(nums, k) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(nums, k):\n    from collections import deque\n    dq = deque()\n    res = []\n    for i, x in enumerate(nums):\n        while dq and dq[0] < i - k + 1: dq.popleft()\n        while dq and nums[dq[-1]] < x: dq.pop()\n        dq.append(i)\n        if i >= k - 1: res.append(nums[dq[0]])\n    return res",
            "javascript": "function solve(nums, k) {\n    const dq = [], res = [];\n    for (let i = 0; i < nums.length; i++) {\n        if (dq.length && dq[0] < i - k + 1) dq.shift();\n        while (dq.length && nums[dq[dq.length - 1]] < nums[i]) dq.pop();\n        dq.push(i);\n        if (i >= k - 1) res.push(nums[dq[0]]);\n    }\n    return res;\n}"
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
        "id": "cog-6",
        "company": "cognizant",
        "category": "service",
        "number": 6,
        "title": "Next Greater Element to Right",
        "difficulty": "Medium",
        "topic": "Monotonic Stack",
        "frequency": "94% in Cognizant GenC Elevate",
        "context": "Stock trend lookahead in Cognizant",
        "fnName": "solve",
        "params": [
            {
                "name": "nums",
                "type": "int[]"
            }
        ],
        "returnType": "int[]",
        "description": "For each element in `nums`, find the first greater element to its right. If none exists, output -1 for that position.",
        "constraints": [
            "1 <= nums.length <= 10^5"
        ],
        "hint": "Traverse from right to left using a monotonic stack of values.",
        "starter": {
            "python": "def solve(nums):\n    # Write your logic here\n    return []",
            "javascript": "function solve(nums) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(nums):\n    res = [-1] * len(nums)\n    stack = []\n    for i in range(len(nums) - 1, -1, -1):\n        while stack and stack[-1] <= nums[i]: stack.pop()\n        if stack: res[i] = stack[-1]\n        stack.append(nums[i])\n    return res",
            "javascript": "function solve(nums) {\n    const res = new Array(nums.length).fill(-1);\n    const stack = [];\n    for (let i = nums.length - 1; i >= 0; i--) {\n        while (stack.length && stack[stack.length - 1] <= nums[i]) stack.pop();\n        if (stack.length) res[i] = stack[stack.length - 1];\n        stack.push(nums[i]);\n    }\n    return res;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        4,
                        5,
                        2,
                        25
                    ]
                ],
                "expected": [
                    5,
                    25,
                    25,
                    -1
                ],
                "isHidden": false
            },
            {
                "args": [
                    [
                        13,
                        7,
                        6,
                        12
                    ]
                ],
                "expected": [
                    -1,
                    12,
                    12,
                    -1
                ],
                "isHidden": false
            }
        ]
    },
    {
        "id": "cog-7",
        "company": "cognizant",
        "category": "service",
        "number": 7,
        "title": "Valid Palindrome with At Most One Deletion",
        "difficulty": "Easy",
        "topic": "Two Pointers",
        "frequency": "93% in Cognizant GenC",
        "context": "Fuzzy palindrome check in Cognizant",
        "fnName": "solve",
        "params": [
            {
                "name": "s",
                "type": "string"
            }
        ],
        "returnType": "bool",
        "description": "Given a string `s`, return `true` if the `s` can be palindrome after deleting at most one character from it.",
        "constraints": [
            "1 <= s.length <= 10^5"
        ],
        "hint": "When s[l] != s[r], check if either s[l+1:r+1] or s[l:r] is palindrome.",
        "starter": {
            "python": "def solve(s):\n    # Write your logic here\n    return False",
            "javascript": "function solve(s) {\n    // Write your logic here\n    return false;\n}"
        },
        "solution": {
            "python": "def solve(s):\n    l, r = 0, len(s) - 1\n    while l < r:\n        if s[l] != s[r]:\n            one = s[l+1:r+1]\n            two = s[l:r]\n            return one == one[::-1] or two == two[::-1]\n        l += 1; r -= 1\n    return True",
            "javascript": "function solve(s) {\n    let l = 0, r = s.length - 1;\n    const isPal = (sub) => {\n        for (let i = 0, j = sub.length - 1; i < j; i++, j--) if (sub[i] !== sub[j]) return false;\n        return true;\n    };\n    while (l < r) {\n        if (s[l] !== s[r]) {\n            return isPal(s.substring(l + 1, r + 1)) || isPal(s.substring(l, r));\n        }\n        l++; r--;\n    }\n    return true;\n}"
        },
        "testCases": [
            {
                "args": [
                    "aba"
                ],
                "expected": true,
                "isHidden": false
            },
            {
                "args": [
                    "abca"
                ],
                "expected": true,
                "isHidden": false
            },
            {
                "args": [
                    "abc"
                ],
                "expected": false,
                "isHidden": true
            }
        ]
    },
    {
        "id": "cog-8",
        "company": "cognizant",
        "category": "service",
        "number": 8,
        "title": "Merge Overlapping Intervals",
        "difficulty": "Medium",
        "topic": "Intervals & Sorting",
        "frequency": "91% in Cognizant GenC Elevate",
        "context": "Scheduling consolidation in Cognizant",
        "fnName": "solve",
        "params": [
            {
                "name": "intervals",
                "type": "int[][]"
            }
        ],
        "returnType": "int[][]",
        "description": "Given an array of `intervals` where `intervals[i] = [starti, endi]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
        "constraints": [
            "1 <= intervals.length <= 10^4",
            "intervals[i].length == 2"
        ],
        "hint": "Sort intervals by start time. Merge with last interval in result if start <= last.end.",
        "starter": {
            "python": "def solve(intervals):\n    # Write your logic here\n    return []",
            "javascript": "function solve(intervals) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(intervals):\n    intervals.sort(key=lambda x: x[0])\n    merged = []\n    for it in intervals:\n        if not merged or merged[-1][1] < it[0]:\n            merged.append(it)\n        else:\n            merged[-1][1] = max(merged[-1][1], it[1])\n    return merged",
            "javascript": "function solve(intervals) {\n    intervals.sort((a, b) => a[0] - b[0]);\n    const merged = [];\n    for (const it of intervals) {\n        if (!merged.length || merged[merged.length - 1][1] < it[0]) {\n            merged.push(it);\n        } else {\n            merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], it[1]);\n        }\n    }\n    return merged;\n}"
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
                            2,
                            6
                        ],
                        [
                            8,
                            10
                        ],
                        [
                            15,
                            18
                        ]
                    ]
                ],
                "expected": [
                    [
                        1,
                        6
                    ],
                    [
                        8,
                        10
                    ],
                    [
                        15,
                        18
                    ]
                ],
                "isHidden": false
            },
            {
                "args": [
                    [
                        [
                            1,
                            4
                        ],
                        [
                            4,
                            5
                        ]
                    ]
                ],
                "expected": [
                    [
                        1,
                        5
                    ]
                ],
                "isHidden": false
            }
        ]
    },
    {
        "id": "cog-9",
        "company": "cognizant",
        "category": "service",
        "number": 9,
        "title": "Product of Array Except Self Without Division",
        "difficulty": "Medium",
        "topic": "Prefix & Suffix Products",
        "frequency": "95% in Cognizant GenC Next",
        "context": "Array product transformation in Cognizant",
        "fnName": "solve",
        "params": [
            {
                "name": "nums",
                "type": "int[]"
            }
        ],
        "returnType": "int[]",
        "description": "Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`. Solve in O(n) without using division.",
        "constraints": [
            "2 <= nums.length <= 10^5",
            "-30 <= nums[i] <= 30"
        ],
        "hint": "Compute prefix products in first pass, then multiply suffix products backwards in second pass.",
        "starter": {
            "python": "def solve(nums):\n    # Write your logic here\n    return []",
            "javascript": "function solve(nums) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(nums):\n    n = len(nums)\n    res = [1] * n\n    pref = 1\n    for i in range(n):\n        res[i] = pref\n        pref *= nums[i]\n    suff = 1\n    for i in range(n - 1, -1, -1):\n        res[i] *= suff\n        suff *= nums[i]\n    return res",
            "javascript": "function solve(nums) {\n    const n = nums.length, res = new Array(n).fill(1);\n    let pref = 1;\n    for (let i = 0; i < n; i++) {\n        res[i] = pref;\n        pref *= nums[i];\n    }\n    let suff = 1;\n    for (let i = n - 1; i >= 0; i--) {\n        res[i] *= suff;\n        suff *= nums[i];\n    }\n    return res;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        1,
                        2,
                        3,
                        4
                    ]
                ],
                "expected": [
                    24,
                    12,
                    8,
                    6
                ],
                "isHidden": false
            },
            {
                "args": [
                    [
                        -1,
                        1,
                        0,
                        -3,
                        3
                    ]
                ],
                "expected": [
                    0,
                    0,
                    9,
                    0,
                    0
                ],
                "isHidden": false
            }
        ]
    },
    {
        "id": "cog-10",
        "company": "cognizant",
        "category": "service",
        "number": 10,
        "title": "Top K Frequent Elements in Array",
        "difficulty": "Medium",
        "topic": "Bucket Sort & Heap",
        "frequency": "90% in Cognizant GenC Next",
        "context": "Cognizant frequency ranking question",
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
        "description": "Given an integer array `nums` and an integer `k`, return the `k` most frequent elements (sorted descending by frequency).",
        "constraints": [
            "1 <= nums.length <= 10^5",
            "1 <= k <= distinct elements"
        ],
        "hint": "Count frequencies in hash map. Use bucket sort or heap to extract top k.",
        "starter": {
            "python": "def solve(nums, k):\n    # Write your logic here\n    return []",
            "javascript": "function solve(nums, k) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(nums, k):\n    from collections import Counter\n    counts = Counter(nums)\n    return [item[0] for item in counts.most_common(k)]",
            "javascript": "function solve(nums, k) {\n    const map = new Map();\n    for (const x of nums) map.set(x, (map.get(x) || 0) + 1);\n    const sorted = Array.from(map.entries()).sort((a, b) => b[1] - a[1]);\n    return sorted.slice(0, k).map(x => x[0]);\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        1,
                        1,
                        1,
                        2,
                        2,
                        3
                    ],
                    2
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
        "id": "cog-11",
        "company": "cognizant",
        "category": "service",
        "number": 11,
        "title": "Longest Repeating Character Replacement",
        "difficulty": "Medium",
        "topic": "Sliding Window",
        "frequency": "89% in Cognizant GenC Next",
        "context": "Substring mutation in Cognizant",
        "fnName": "solve",
        "params": [
            {
                "name": "s",
                "type": "string"
            },
            {
                "name": "k",
                "type": "int"
            }
        ],
        "returnType": "int",
        "description": "Given string `s` and integer `k`. You can choose any character and change it to any uppercase English letter at most `k` times. Return length of longest substring containing the same letter.",
        "constraints": [
            "1 <= s.length <= 10^5",
            "0 <= k <= s.length"
        ],
        "hint": "Window length - max_frequency <= k. Expand right, shrink left when invalid.",
        "starter": {
            "python": "def solve(s, k):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(s, k) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(s, k):\n    counts = {}\n    l = max_f = ans = 0\n    for r, c in enumerate(s):\n        counts[c] = counts.get(c, 0) + 1\n        max_f = max(max_f, counts[c])\n        if (r - l + 1) - max_f > k:\n            counts[s[l]] -= 1\n            l += 1\n        ans = max(ans, r - l + 1)\n    return ans",
            "javascript": "function solve(s, k) {\n    const counts = {};\n    let l = 0, maxF = 0, ans = 0;\n    for (let r = 0; r < s.length; r++) {\n        const c = s[r];\n        counts[c] = (counts[c] || 0) + 1;\n        maxF = Math.max(maxF, counts[c]);\n        if ((r - l + 1) - maxF > k) {\n            counts[s[l]]--;\n            l++;\n        }\n        ans = Math.max(ans, r - l + 1);\n    }\n    return ans;\n}"
        },
        "testCases": [
            {
                "args": [
                    "ABAB",
                    2
                ],
                "expected": 4,
                "isHidden": false
            },
            {
                "args": [
                    "AABABBA",
                    1
                ],
                "expected": 4,
                "isHidden": false
            }
        ]
    },
    {
        "id": "cog-12",
        "company": "cognizant",
        "category": "service",
        "number": 12,
        "title": "Group Anagram Words Together",
        "difficulty": "Medium",
        "topic": "Hash Map",
        "frequency": "93% in Cognizant GenC",
        "context": "Dictionary anagram grouping in Cognizant",
        "fnName": "solve",
        "params": [
            {
                "name": "strs",
                "type": "string[]"
            }
        ],
        "returnType": "string[][]",
        "description": "Given an array of strings `strs`, group the anagrams together. Return the grouped lists (order within groups doesn't matter).",
        "constraints": [
            "1 <= strs.length <= 10^4"
        ],
        "hint": "Key = tuple of sorted characters or char frequency count tuple.",
        "starter": {
            "python": "def solve(strs):\n    # Write your logic here\n    return []",
            "javascript": "function solve(strs) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(strs):\n    from collections import defaultdict\n    groups = defaultdict(list)\n    for s in strs:\n        groups[''.join(sorted(s))].append(s)\n    return list(groups.values())",
            "javascript": "function solve(strs) {\n    const map = new Map();\n    for (const s of strs) {\n        const key = s.split('').sort().join('');\n        if (!map.has(key)) map.set(key, []);\n        map.get(key).push(s);\n    }\n    return Array.from(map.values());\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        "eat",
                        "tea",
                        "tan",
                        "ate",
                        "nat",
                        "bat"
                    ]
                ],
                "expected": [
                    [
                        "eat",
                        "tea",
                        "ate"
                    ],
                    [
                        "tan",
                        "nat"
                    ],
                    [
                        "bat"
                    ]
                ],
                "isHidden": false
            },
            {
                "args": [
                    [
                        ""
                    ]
                ],
                "expected": [
                    [
                        ""
                    ]
                ],
                "isHidden": false
            }
        ]
    },
    {
        "id": "cog-13",
        "company": "cognizant",
        "category": "service",
        "number": 13,
        "title": "Sort Characters By Frequency Descending",
        "difficulty": "Medium",
        "topic": "Strings & Sorting",
        "frequency": "88% in Cognizant GenC Elevate",
        "context": "Text compression character sorting in Cognizant",
        "fnName": "solve",
        "params": [
            {
                "name": "s",
                "type": "string"
            }
        ],
        "returnType": "string",
        "description": "Given a string `s`, sort it in decreasing order based on the frequency of the characters. The frequency of a character is the number of times it appears in the string.",
        "constraints": [
            "1 <= s.length <= 5 * 10^5"
        ],
        "hint": "Count frequency, sort characters descending by frequency, multiply char by count.",
        "starter": {
            "python": "def solve(s):\n    # Write your logic here\n    return ''",
            "javascript": "function solve(s) {\n    // Write your logic here\n    return '';\n}"
        },
        "solution": {
            "python": "def solve(s):\n    from collections import Counter\n    counts = Counter(s)\n    return ''.join(c * freq for c, freq in counts.most_common())",
            "javascript": "function solve(s) {\n    const counts = {};\n    for (const c of s) counts[c] = (counts[c] || 0) + 1;\n    return Object.keys(counts).sort((a, b) => counts[b] - counts[a]).map(c => c.repeat(counts[c])).join('');\n}"
        },
        "testCases": [
            {
                "args": [
                    "tree"
                ],
                "expected": "eert",
                "isHidden": false
            },
            {
                "args": [
                    "cccaaa"
                ],
                "expected": "cccaaa",
                "isHidden": false
            },
            {
                "args": [
                    "Aabb"
                ],
                "expected": "bbAa",
                "isHidden": true
            }
        ]
    },
    {
        "id": "cog-14",
        "company": "cognizant",
        "category": "service",
        "number": 14,
        "title": "Permutation In String Match",
        "difficulty": "Medium",
        "topic": "Sliding Window",
        "frequency": "90% in Cognizant GenC Elevate",
        "context": "Cognizant pattern sliding window test",
        "fnName": "solve",
        "params": [
            {
                "name": "s1",
                "type": "string"
            },
            {
                "name": "s2",
                "type": "string"
            }
        ],
        "returnType": "bool",
        "description": "Given two strings `s1` and `s2`, return `true` if `s2` contains a permutation of `s1`, or `false` otherwise.",
        "constraints": [
            "1 <= s1.length, s2.length <= 10^4"
        ],
        "hint": "Sliding window of length len(s1). Check if frequency array matches s1's frequency array.",
        "starter": {
            "python": "def solve(s1, s2):\n    # Write your logic here\n    return False",
            "javascript": "function solve(s1, s2) {\n    // Write your logic here\n    return false;\n}"
        },
        "solution": {
            "python": "def solve(s1, s2):\n    if len(s1) > len(s2): return False\n    c1 = [0] * 26\n    c2 = [0] * 26\n    for i in range(len(s1)):\n        c1[ord(s1[i]) - 97] += 1\n        c2[ord(s2[i]) - 97] += 1\n    if c1 == c2: return True\n    for i in range(len(s1), len(s2)):\n        c2[ord(s2[i]) - 97] += 1\n        c2[ord(s2[i - len(s1)]) - 97] -= 1\n        if c1 == c2: return True\n    return False",
            "javascript": "function solve(s1, s2) {\n    if (s1.length > s2.length) return false;\n    const c1 = new Array(26).fill(0), c2 = new Array(26).fill(0);\n    for (let i = 0; i < s1.length; i++) {\n        c1[s1.charCodeAt(i) - 97]++;\n        c2[s2.charCodeAt(i) - 97]++;\n    }\n    const match = () => c1.every((v, i) => v === c2[i]);\n    if (match()) return true;\n    for (let i = s1.length; i < s2.length; i++) {\n        c2[s2.charCodeAt(i) - 97]++;\n        c2[s2.charCodeAt(i - s1.length) - 97]--;\n        if (match()) return true;\n    }\n    return false;\n}"
        },
        "testCases": [
            {
                "args": [
                    "ab",
                    "eidbaooo"
                ],
                "expected": true,
                "isHidden": false
            },
            {
                "args": [
                    "ab",
                    "eidboaoo"
                ],
                "expected": false,
                "isHidden": false
            }
        ]
    },
    {
        "id": "cog-15",
        "company": "cognizant",
        "category": "service",
        "number": 15,
        "title": "Three Sum Closest to Target",
        "difficulty": "Medium",
        "topic": "Two Pointers",
        "frequency": "89% in Cognizant GenC",
        "context": "Cognizant optimal trio search",
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
        "returnType": "int",
        "description": "Given an integer array `nums` of length `n` and an integer `target`, find three integers in `nums` such that the sum is closest to `target`. Return the sum of the three integers.",
        "constraints": [
            "3 <= nums.length <= 1000",
            "-1000 <= nums[i] <= 1000"
        ],
        "hint": "Sort nums. For each i, use two pointers j and k. Update closest_sum if abs(sum - target) is smaller.",
        "starter": {
            "python": "def solve(nums, target):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(nums, target) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(nums, target):\n    nums.sort()\n    closest = nums[0] + nums[1] + nums[2]\n    for i in range(len(nums) - 2):\n        l, r = i + 1, len(nums) - 1\n        while l < r:\n            s = nums[i] + nums[l] + nums[r]\n            if abs(s - target) < abs(closest - target):\n                closest = s\n            if s < target: l += 1\n            elif s > target: r -= 1\n            else: return target\n    return closest",
            "javascript": "function solve(nums, target) {\n    nums.sort((a, b) => a - b);\n    let closest = nums[0] + nums[1] + nums[2];\n    for (let i = 0; i < nums.length - 2; i++) {\n        let l = i + 1, r = nums.length - 1;\n        while (l < r) {\n            const s = nums[i] + nums[l] + nums[r];\n            if (Math.abs(s - target) < Math.abs(closest - target)) closest = s;\n            if (s < target) l++;\n            else if (s > target) r--;\n            else return target;\n        }\n    }\n    return closest;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        -1,
                        2,
                        1,
                        -4
                    ],
                    1
                ],
                "expected": 2,
                "isHidden": false
            },
            {
                "args": [
                    [
                        0,
                        0,
                        0
                    ],
                    1
                ],
                "expected": 0,
                "isHidden": false
            }
        ]
    },
    {
        "id": "cog-16",
        "company": "cognizant",
        "category": "service",
        "number": 16,
        "title": "Daily Temperatures Wait Times",
        "difficulty": "Medium",
        "topic": "Monotonic Stack",
        "frequency": "92% in Cognizant GenC Elevate",
        "context": "Weather trend forecasting in Cognizant",
        "fnName": "solve",
        "params": [
            {
                "name": "temperatures",
                "type": "int[]"
            }
        ],
        "returnType": "int[]",
        "description": "Given an array of integers `temperatures` representing the daily temperatures, return an array `answer` such that `answer[i]` is the number of days you have to wait after the `i`th day to get a warmer temperature. If no future day is warmer, `answer[i] == 0`.",
        "constraints": [
            "1 <= temperatures.length <= 10^5"
        ],
        "hint": "Monotonic decreasing stack of indices.",
        "starter": {
            "python": "def solve(temperatures):\n    # Write your logic here\n    return []",
            "javascript": "function solve(temperatures) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(temperatures):\n    res = [0] * len(temperatures)\n    stack = []\n    for i, t in enumerate(temperatures):\n        while stack and temperatures[stack[-1]] < t:\n            prev = stack.pop()\n            res[prev] = i - prev\n        stack.append(i)\n    return res",
            "javascript": "function solve(temperatures) {\n    const res = new Array(temperatures.length).fill(0);\n    const stack = [];\n    for (let i = 0; i < temperatures.length; i++) {\n        while (stack.length && temperatures[stack[stack.length - 1]] < temperatures[i]) {\n            const prev = stack.pop();\n            res[prev] = i - prev;\n        }\n        stack.push(i);\n    }\n    return res;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        73,
                        74,
                        75,
                        71,
                        69,
                        72,
                        76,
                        73
                    ]
                ],
                "expected": [
                    1,
                    1,
                    4,
                    2,
                    1,
                    1,
                    0,
                    0
                ],
                "isHidden": false
            },
            {
                "args": [
                    [
                        30,
                        40,
                        50,
                        60
                    ]
                ],
                "expected": [
                    1,
                    1,
                    1,
                    0
                ],
                "isHidden": false
            }
        ]
    },
    {
        "id": "cog-17",
        "company": "cognizant",
        "category": "service",
        "number": 17,
        "title": "Evaluate Reverse Polish Notation (RPN)",
        "difficulty": "Medium",
        "topic": "Stack",
        "frequency": "88% in Cognizant GenC Elevate",
        "context": "Expression evaluation in Cognizant",
        "fnName": "solve",
        "params": [
            {
                "name": "tokens",
                "type": "string[]"
            }
        ],
        "returnType": "int",
        "description": "Evaluate the value of an arithmetic expression in Reverse Polish Notation. Valid operators are `+`, `-`, `*`, and `/`. Division truncates toward zero.",
        "constraints": [
            "1 <= tokens.length <= 10^4"
        ],
        "hint": "Push numbers onto stack. When operator is found, pop two numbers, apply operation, push result.",
        "starter": {
            "python": "def solve(tokens):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(tokens) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(tokens):\n    stack = []\n    for t in tokens:\n        if t in {'+', '-', '*', '/'}:\n            b = stack.pop()\n            a = stack.pop()\n            if t == '+': stack.append(a + b)\n            elif t == '-': stack.append(a - b)\n            elif t == '*': stack.append(a * b)\n            else: stack.append(int(a / b))\n        else:\n            stack.append(int(t))\n    return stack[0]",
            "javascript": "function solve(tokens) {\n    const stack = [];\n    for (const t of tokens) {\n        if (t === '+' || t === '-' || t === '*' || t === '/') {\n            const b = stack.pop(), a = stack.pop();\n            if (t === '+') stack.push(a + b);\n            else if (t === '-') stack.push(a - b);\n            else if (t === '*') stack.push(a * b);\n            else stack.push(Math.trunc(a / b));\n        } else {\n            stack.push(Number(t));\n        }\n    }\n    return stack[0];\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        "2",
                        "1",
                        "+",
                        "3",
                        "*"
                    ]
                ],
                "expected": 9,
                "isHidden": false
            },
            {
                "args": [
                    [
                        "4",
                        "13",
                        "5",
                        "/",
                        "+"
                    ]
                ],
                "expected": 6,
                "isHidden": false
            }
        ]
    },
    {
        "id": "cog-18",
        "company": "cognizant",
        "category": "service",
        "number": 18,
        "title": "Minimum Size Subarray Sum Exceeding Target",
        "difficulty": "Medium",
        "topic": "Sliding Window",
        "frequency": "91% in Cognizant GenC Next",
        "context": "Threshold window search in Cognizant",
        "fnName": "solve",
        "params": [
            {
                "name": "target",
                "type": "int"
            },
            {
                "name": "nums",
                "type": "int[]"
            }
        ],
        "returnType": "int",
        "description": "Given an array of positive integers `nums` and a positive integer `target`, return the minimal length of a contiguous subarray of which the sum is greater than or equal to `target`. If there is no such subarray, return 0 instead.",
        "constraints": [
            "1 <= target <= 10^9",
            "1 <= nums.length <= 10^5"
        ],
        "hint": "Expand right until sum >= target. Contract left while sum >= target, tracking min length.",
        "starter": {
            "python": "def solve(target, nums):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(target, nums) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(target, nums):\n    l = cur = 0\n    ans = float('inf')\n    for r, x in enumerate(nums):\n        cur += x\n        while cur >= target:\n            ans = min(ans, r - l + 1)\n            cur -= nums[l]\n            l += 1\n    return ans if ans != float('inf') else 0",
            "javascript": "function solve(target, nums) {\n    let l = 0, cur = 0, ans = Infinity;\n    for (let r = 0; r < nums.length; r++) {\n        cur += nums[r];\n        while (cur >= target) {\n            ans = Math.min(ans, r - l + 1);\n            cur -= nums[l++];\n        }\n    }\n    return ans === Infinity ? 0 : ans;\n}"
        },
        "testCases": [
            {
                "args": [
                    7,
                    [
                        2,
                        3,
                        1,
                        2,
                        4,
                        3
                    ]
                ],
                "expected": 2,
                "isHidden": false
            },
            {
                "args": [
                    4,
                    [
                        1,
                        4,
                        4
                    ]
                ],
                "expected": 1,
                "isHidden": false
            },
            {
                "args": [
                    11,
                    [
                        1,
                        1,
                        1,
                        1,
                        1,
                        1,
                        1,
                        1
                    ]
                ],
                "expected": 0,
                "isHidden": true
            }
        ]
    },
    {
        "id": "cog-19",
        "company": "cognizant",
        "category": "service",
        "number": 19,
        "title": "Maximum Sum of Distinct Subarrays With Length K",
        "difficulty": "Medium",
        "topic": "Sliding Window & Sets",
        "frequency": "90% in Cognizant GenC Elevate",
        "context": "Distinct element sliding window in Cognizant",
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
        "description": "Given an integer array `nums` and an integer `k`, find the maximum subarray sum of all the subarrays of `nums` that meet the following conditions: The length of the subarray is `k`, and all elements of the subarray are distinct. Return 0 if none exist.",
        "constraints": [
            "1 <= k <= nums.length <= 10^5"
        ],
        "hint": "Maintain window sum and element frequencies. Valid when window size == k and distinct count == k.",
        "starter": {
            "python": "def solve(nums, k):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(nums, k) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(nums, k):\n    counts = {}\n    cur_sum = max_sum = 0\n    l = 0\n    for r in range(len(nums)):\n        x = nums[r]\n        cur_sum += x\n        counts[x] = counts.get(x, 0) + 1\n        if r - l + 1 > k:\n            left_val = nums[l]\n            cur_sum -= left_val\n            counts[left_val] -= 1\n            if counts[left_val] == 0: del counts[left_val]\n            l += 1\n        if r - l + 1 == k and len(counts) == k:\n            max_sum = max(max_sum, cur_sum)\n    return max_sum",
            "javascript": "function solve(nums, k) {\n    const map = new Map();\n    let curSum = 0, maxSum = 0, l = 0;\n    for (let r = 0; r < nums.length; r++) {\n        const x = nums[r];\n        curSum += x;\n        map.set(x, (map.get(x) || 0) + 1);\n        if (r - l + 1 > k) {\n            const leftVal = nums[l];\n            curSum -= leftVal;\n            const count = map.get(leftVal) - 1;\n            if (count === 0) map.delete(leftVal);\n            else map.set(leftVal, count);\n            l++;\n        }\n        if (r - l + 1 === k && map.size === k) {\n            maxSum = Math.max(maxSum, curSum);\n        }\n    }\n    return maxSum;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        1,
                        5,
                        4,
                        2,
                        9,
                        9,
                        9
                    ],
                    3
                ],
                "expected": 15,
                "isHidden": false
            },
            {
                "args": [
                    [
                        4,
                        4,
                        4
                    ],
                    3
                ],
                "expected": 0,
                "isHidden": false
            }
        ]
    },
    {
        "id": "cog-20",
        "company": "cognizant",
        "category": "service",
        "number": 20,
        "title": "Find Pivot Index in Integer Array",
        "difficulty": "Easy",
        "topic": "Prefix Sum",
        "frequency": "95% in Cognizant GenC",
        "context": "Equilibrium balance in Cognizant",
        "fnName": "solve",
        "params": [
            {
                "name": "nums",
                "type": "int[]"
            }
        ],
        "returnType": "int",
        "description": "Given an array of integers `nums`, calculate the pivot index of this array. The pivot index is the index where the sum of all the numbers strictly to the left of the index is equal to the sum of all the numbers strictly to the index's right. Return leftmost pivot or -1.",
        "constraints": [
            "1 <= nums.length <= 10^4",
            "-1000 <= nums[i] <= 1000"
        ],
        "hint": "left_sum == total_sum - left_sum - nums[i].",
        "starter": {
            "python": "def solve(nums):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(nums) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(nums):\n    total = sum(nums)\n    l = 0\n    for i, x in enumerate(nums):\n        if l == total - l - x: return i\n        l += x\n    return -1",
            "javascript": "function solve(nums) {\n    const total = nums.reduce((a, b) => a + b, 0);\n    let l = 0;\n    for (let i = 0; i < nums.length; i++) {\n        if (l === total - l - nums[i]) return i;\n        l += nums[i];\n    }\n    return -1;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        1,
                        7,
                        3,
                        6,
                        5,
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
                    ]
                ],
                "expected": -1,
                "isHidden": false
            },
            {
                "args": [
                    [
                        2,
                        1,
                        -1
                    ]
                ],
                "expected": 0,
                "isHidden": true
            }
        ]
    }
];
