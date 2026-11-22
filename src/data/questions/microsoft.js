export const MICROSOFT_QUESTIONS = [
    {
        "id": "msft-1",
        "company": "microsoft",
        "category": "product",
        "number": 1,
        "title": "Reverse Array in K-Sized Subgroups",
        "difficulty": "Medium",
        "topic": "Arrays & Pointers",
        "frequency": "95% in Microsoft Codility",
        "context": "Packet stream reorganization in Microsoft Azure",
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
        "description": "Given array `nums` and integer `k`, reverse every sub-array of length `k`. If remainder elements are less than `k`, reverse them as well.",
        "constraints": [
            "1 <= nums.length <= 10^5",
            "1 <= k <= 10^5"
        ],
        "hint": "Step by k: reverse slice nums[i : i+k].",
        "starter": {
            "python": "def solve(nums, k):\n    # Write your logic here\n    return []",
            "javascript": "function solve(nums, k) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(nums, k):\n    arr = list(nums)\n    for i in range(0, len(arr), k):\n        arr[i:i+k] = reversed(arr[i:i+k])\n    return arr",
            "javascript": "function solve(nums, k) {\n    const arr = [...nums];\n    for (let i = 0; i < arr.length; i += k) {\n        let l = i, r = Math.min(i + k - 1, arr.length - 1);\n        while (l < r) {\n            const tmp = arr[l]; arr[l++] = arr[r]; arr[r--] = tmp;\n        }\n    }\n    return arr;\n}"
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
                    3
                ],
                "expected": [
                    3,
                    2,
                    1,
                    5,
                    4
                ],
                "isHidden": false
            },
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
                        8
                    ],
                    3
                ],
                "expected": [
                    3,
                    2,
                    1,
                    6,
                    5,
                    4,
                    8,
                    7
                ],
                "isHidden": false
            }
        ]
    },
    {
        "id": "msft-2",
        "company": "microsoft",
        "category": "product",
        "number": 2,
        "title": "Run-Length String Compression Array",
        "difficulty": "Medium",
        "topic": "Two Pointers",
        "frequency": "94% in Microsoft Campus",
        "context": "Data compression engine in Microsoft OS",
        "fnName": "solve",
        "params": [
            {
                "name": "chars",
                "type": "string[]"
            }
        ],
        "returnType": "string[]",
        "description": "Given array of characters `chars`, compress it using run-length encoding: consecutive repeated characters are replaced by the character followed by its count. If count is 1, append only character. Return compressed array.",
        "constraints": [
            "1 <= chars.length <= 2000"
        ],
        "hint": "Iterate with two pointers. Count duplicates and write char + count digits.",
        "starter": {
            "python": "def solve(chars):\n    # Write your logic here\n    return []",
            "javascript": "function solve(chars) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(chars):\n    res = []\n    i = 0\n    while i < len(chars):\n        j = i\n        while j < len(chars) and chars[j] == chars[i]: j += 1\n        count = j - i\n        res.append(chars[i])\n        if count > 1:\n            res.extend(list(str(count)))\n        i = j\n    return res",
            "javascript": "function solve(chars) {\n    const res = [];\n    let i = 0;\n    while (i < chars.length) {\n        let j = i;\n        while (j < chars.length && chars[j] === chars[i]) j++;\n        const count = j - i;\n        res.push(chars[i]);\n        if (count > 1) {\n            for (const c of String(count)) res.push(c);\n        }\n        i = j;\n    }\n    return res;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        "a",
                        "a",
                        "b",
                        "b",
                        "c",
                        "c",
                        "c"
                    ]
                ],
                "expected": [
                    "a",
                    "2",
                    "b",
                    "2",
                    "c",
                    "3"
                ],
                "isHidden": false
            },
            {
                "args": [
                    [
                        "a"
                    ]
                ],
                "expected": [
                    "a"
                ],
                "isHidden": false
            }
        ]
    },
    {
        "id": "msft-3",
        "company": "microsoft",
        "category": "product",
        "number": 3,
        "title": "Validate Binary Search Tree (BST)",
        "difficulty": "Medium",
        "topic": "Binary Search Tree",
        "frequency": "96% in Microsoft Onsite",
        "context": "Index tree integrity in Microsoft SQL Server",
        "fnName": "solve",
        "params": [
            {
                "name": "tree",
                "type": "int[]"
            }
        ],
        "returnType": "bool",
        "description": "Given complete binary tree array (level order, -1 for null). Determine if it is a valid Binary Search Tree (BST): all nodes in left subtree strictly < node value, and right subtree strictly > node value.",
        "constraints": [
            "1 <= tree.length <= 1000"
        ],
        "hint": "Recursive validation with min_bound and max_bound: min_bound < node.val < max_bound.",
        "starter": {
            "python": "def solve(tree):\n    # Write your logic here\n    return False",
            "javascript": "function solve(tree) {\n    // Write your logic here\n    return false;\n}"
        },
        "solution": {
            "python": "def solve(tree):\n    def validate(idx, low, high):\n        if idx >= len(tree) or tree[idx] == -1: return True\n        v = tree[idx]\n        if not (low < v < high): return False\n        return validate(2*idx+1, low, v) and validate(2*idx+2, v, high)\n    return validate(0, -float('inf'), float('inf'))",
            "javascript": "function solve(tree) {\n    const validate = (idx, low, high) => {\n        if (idx >= tree.length || tree[idx] === -1) return true;\n        const v = tree[idx];\n        if (!(low < v && v < high)) return false;\n        return validate(2 * idx + 1, low, v) && validate(2 * idx + 2, v, high);\n    };\n    return validate(0, -Infinity, Infinity);\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        2,
                        1,
                        3
                    ]
                ],
                "expected": true,
                "isHidden": false
            },
            {
                "args": [
                    [
                        5,
                        1,
                        4,
                        -1,
                        -1,
                        3,
                        6
                    ]
                ],
                "expected": false,
                "isHidden": false
            }
        ]
    },
    {
        "id": "msft-4",
        "company": "microsoft",
        "category": "product",
        "number": 4,
        "title": "Set Matrix Zeroes In-Place",
        "difficulty": "Medium",
        "topic": "2D Arrays",
        "frequency": "92% in Microsoft Codility",
        "context": "Memory grid reset in Microsoft systems",
        "fnName": "solve",
        "params": [
            {
                "name": "matrix",
                "type": "int[][]"
            }
        ],
        "returnType": "int[][]",
        "description": "Given an `m x n` integer matrix, if an element is 0, set its entire row and column to 0's in-place, and return the modified matrix.",
        "constraints": [
            "1 <= m, n <= 200"
        ],
        "hint": "Use first row and first column as markers to achieve O(1) auxiliary space.",
        "starter": {
            "python": "def solve(matrix):\n    # Write your logic here\n    return []",
            "javascript": "function solve(matrix) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(matrix):\n    m, n = len(matrix), len(matrix[0])\n    rows, cols = set(), set()\n    for i in range(m):\n        for j in range(n):\n            if matrix[i][j] == 0:\n                rows.add(i); cols.add(j)\n    res = [row[:] for row in matrix]\n    for i in range(m):\n        for j in range(n):\n            if i in rows or j in cols:\n                res[i][j] = 0\n    return res",
            "javascript": "function solve(matrix) {\n    const m = matrix.length, n = matrix[0].length;\n    const rows = new Set(), cols = new Set();\n    for (let i = 0; i < m; i++) {\n        for (let j = 0; j < n; j++) {\n            if (matrix[i][j] === 0) { rows.add(i); cols.add(j); }\n        }\n    }\n    const res = matrix.map(r => [...r]);\n    for (let i = 0; i < m; i++) {\n        for (let j = 0; j < n; j++) {\n            if (rows.has(i) || cols.has(j)) res[i][j] = 0;\n        }\n    }\n    return res;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        [
                            1,
                            1,
                            1
                        ],
                        [
                            1,
                            0,
                            1
                        ],
                        [
                            1,
                            1,
                            1
                        ]
                    ]
                ],
                "expected": [
                    [
                        1,
                        0,
                        1
                    ],
                    [
                        0,
                        0,
                        0
                    ],
                    [
                        1,
                        0,
                        1
                    ]
                ],
                "isHidden": false
            },
            {
                "args": [
                    [
                        [
                            0,
                            1,
                            2,
                            0
                        ],
                        [
                            3,
                            4,
                            5,
                            2
                        ],
                        [
                            1,
                            3,
                            1,
                            5
                        ]
                    ]
                ],
                "expected": [
                    [
                        0,
                        0,
                        0,
                        0
                    ],
                    [
                        0,
                        4,
                        5,
                        0
                    ],
                    [
                        0,
                        3,
                        1,
                        0
                    ]
                ],
                "isHidden": false
            }
        ]
    },
    {
        "id": "msft-5",
        "company": "microsoft",
        "category": "product",
        "number": 5,
        "title": "Find Peak Element in O(log n)",
        "difficulty": "Medium",
        "topic": "Binary Search",
        "frequency": "93% in Microsoft Onsite",
        "context": "Signal peak finder in Microsoft hardware telemetry",
        "fnName": "solve",
        "params": [
            {
                "name": "nums",
                "type": "int[]"
            }
        ],
        "returnType": "int",
        "description": "A peak element is an element strictly greater than its neighbors. Given an integer array `nums`, find a peak element and return its index in O(log n) time.",
        "constraints": [
            "1 <= nums.length <= 1000"
        ],
        "hint": "Binary search: if nums[mid] < nums[mid + 1], peak must lie in right half; else in left half.",
        "starter": {
            "python": "def solve(nums):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(nums) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(nums):\n    l, r = 0, len(nums) - 1\n    while l < r:\n        mid = (l + r) // 2\n        if nums[mid] < nums[mid + 1]: l = mid + 1\n        else: r = mid\n    return l",
            "javascript": "function solve(nums) {\n    let l = 0, r = nums.length - 1;\n    while (l < r) {\n        const mid = (l + r) >> 1;\n        if (nums[mid] < nums[mid + 1]) l = mid + 1;\n        else r = mid;\n    }\n    return l;\n}"
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
                "expected": 2,
                "isHidden": false
            },
            {
                "args": [
                    [
                        1,
                        2,
                        1,
                        3,
                        5,
                        6,
                        4
                    ]
                ],
                "expected": 5,
                "isHidden": false
            }
        ]
    },
    {
        "id": "msft-6",
        "company": "microsoft",
        "category": "product",
        "number": 6,
        "title": "Search in Rotated Sorted Array",
        "difficulty": "Medium",
        "topic": "Binary Search",
        "frequency": "97% in Microsoft Codility",
        "context": "Rotated ring buffer search in Microsoft Windows kernel",
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
        "description": "Given sorted array `nums` rotated at unknown pivot and integer `target`, return index of `target`, or -1 if not in `nums` in O(log n) time.",
        "constraints": [
            "1 <= nums.length <= 5000"
        ],
        "hint": "At least one half (left or right) is always sorted. Check if target falls in sorted half.",
        "starter": {
            "python": "def solve(nums, target):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(nums, target) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(nums, target):\n    l, r = 0, len(nums) - 1\n    while l <= r:\n        mid = (l + r) // 2\n        if nums[mid] == target: return mid\n        if nums[l] <= nums[mid]:\n            if nums[l] <= target < nums[mid]: r = mid - 1\n            else: l = mid + 1\n        else:\n            if nums[mid] < target <= nums[r]: l = mid + 1\n            else: r = mid - 1\n    return -1",
            "javascript": "function solve(nums, target) {\n    let l = 0, r = nums.length - 1;\n    while (l <= r) {\n        const mid = (l + r) >> 1;\n        if (nums[mid] === target) return mid;\n        if (nums[l] <= nums[mid]) {\n            if (nums[l] <= target && target < nums[mid]) r = mid - 1;\n            else l = mid + 1;\n        } else {\n            if (nums[mid] < target && target <= nums[r]) l = mid + 1;\n            else r = mid - 1;\n        }\n    }\n    return -1;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        4,
                        5,
                        6,
                        7,
                        0,
                        1,
                        2
                    ],
                    0
                ],
                "expected": 4,
                "isHidden": false
            },
            {
                "args": [
                    [
                        4,
                        5,
                        6,
                        7,
                        0,
                        1,
                        2
                    ],
                    3
                ],
                "expected": -1,
                "isHidden": false
            }
        ]
    },
    {
        "id": "msft-7",
        "company": "microsoft",
        "category": "product",
        "number": 7,
        "title": "Binary Tree Zigzag Level Order Traversal",
        "difficulty": "Medium",
        "topic": "BFS Queue",
        "frequency": "91% in Microsoft Onsite",
        "context": "Tree visualization layout in Microsoft Office",
        "fnName": "solve",
        "params": [
            {
                "name": "tree",
                "type": "int[]"
            }
        ],
        "returnType": "int[][]",
        "description": "Given complete binary tree array (level order, -1 for null). Return zigzag level order traversal (i.e., alternate left-to-right and right-to-left for successive levels).",
        "constraints": [
            "1 <= tree.length <= 1000"
        ],
        "hint": "Level by level traversal. Reverse level elements when depth % 2 == 1.",
        "starter": {
            "python": "def solve(tree):\n    # Write your logic here\n    return []",
            "javascript": "function solve(tree) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(tree):\n    if not tree or tree[0] == -1: return []\n    res = []\n    size = 1; idx = 0; rev = False\n    while idx < len(tree):\n        end = min(idx + size, len(tree))\n        lvl = [tree[i] for i in range(idx, end) if tree[i] != -1]\n        if lvl:\n            res.append(lvl[::-1] if rev else lvl)\n            rev = not rev\n        idx = end; size *= 2\n    return res",
            "javascript": "function solve(tree) {\n    if (!tree.length || tree[0] === -1) return [];\n    const res = [];\n    let size = 1, idx = 0, rev = false;\n    while (idx < tree.length) {\n        const end = Math.min(idx + size, tree.length);\n        const lvl = [];\n        for (let i = idx; i < end; i++) if (tree[i] !== -1) lvl.push(tree[i]);\n        if (lvl.length) {\n            res.push(rev ? lvl.reverse() : lvl);\n            rev = !rev;\n        }\n        idx = end; size *= 2;\n    }\n    return res;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        3,
                        9,
                        20,
                        -1,
                        -1,
                        15,
                        7
                    ]
                ],
                "expected": [
                    [
                        3
                    ],
                    [
                        20,
                        9
                    ],
                    [
                        15,
                        7
                    ]
                ],
                "isHidden": false
            },
            {
                "args": [
                    [
                        1
                    ]
                ],
                "expected": [
                    [
                        1
                    ]
                ],
                "isHidden": false
            }
        ]
    },
    {
        "id": "msft-8",
        "company": "microsoft",
        "category": "product",
        "number": 8,
        "title": "Pacific Atlantic Water Flow Grid",
        "difficulty": "Medium",
        "topic": "DFS / BFS Matrix",
        "frequency": "90% in Microsoft Onsite",
        "context": "Terrain rain drainage analysis in Microsoft Maps",
        "fnName": "solve",
        "params": [
            {
                "name": "heights",
                "type": "int[][]"
            }
        ],
        "returnType": "int[][]",
        "description": "Given `m x n` matrix of heights. Pacific touches top & left; Atlantic touches bottom & right. Water flows to neighbor <= height. Return coordinates `[r, c]` that can flow to BOTH oceans.",
        "constraints": [
            "1 <= m, n <= 200"
        ],
        "hint": "Reverse flow: DFS upwards from Pacific edges, and DFS upwards from Atlantic edges. Find intersection.",
        "starter": {
            "python": "def solve(heights):\n    # Write your logic here\n    return []",
            "javascript": "function solve(heights) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(heights):\n    m, n = len(heights), len(heights[0])\n    pac, atl = set(), set()\n    def dfs(r, c, visited):\n        visited.add((r, c))\n        for dr, dc in [(1,0), (-1,0), (0,1), (0,-1)]:\n            nr, nc = r + dr, c + dc\n            if 0 <= nr < m and 0 <= nc < n and (nr, nc) not in visited and heights[nr][nc] >= heights[r][c]:\n                dfs(nr, nc, visited)\n    for i in range(m):\n        dfs(i, 0, pac); dfs(i, n - 1, atl)\n    for j in range(n):\n        dfs(0, j, pac); dfs(m - 1, j, atl)\n    return sorted([list(p) for p in (pac & atl)])",
            "javascript": "function solve(heights) {\n    const m = heights.length, n = heights[0].length;\n    const pac = Array.from({ length: m }, () => new Array(n).fill(false));\n    const atl = Array.from({ length: m }, () => new Array(n).fill(false));\n    const dfs = (r, c, visited) => {\n        visited[r][c] = true;\n        for (const [dr, dc] of [[1,0], [-1,0], [0,1], [0,-1]]) {\n            const nr = r + dr, nc = c + dc;\n            if (nr >= 0 && nr < m && nc >= 0 && nc < n && !visited[nr][nc] && heights[nr][nc] >= heights[r][c]) {\n                dfs(nr, nc, visited);\n            }\n        }\n    };\n    for (let i = 0; i < m; i++) { dfs(i, 0, pac); dfs(i, n - 1, atl); }\n    for (let j = 0; j < n; j++) { dfs(0, j, pac); dfs(m - 1, j, atl); }\n    const res = [];\n    for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) if (pac[i][j] && atl[i][j]) res.push([i, j]);\n    return res;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        [
                            1,
                            2,
                            2,
                            3,
                            5
                        ],
                        [
                            3,
                            2,
                            3,
                            4,
                            4
                        ],
                        [
                            2,
                            4,
                            5,
                            3,
                            1
                        ],
                        [
                            6,
                            7,
                            1,
                            4,
                            5
                        ],
                        [
                            5,
                            1,
                            1,
                            2,
                            4
                        ]
                    ]
                ],
                "expected": [
                    [
                        0,
                        4
                    ],
                    [
                        1,
                        3
                    ],
                    [
                        1,
                        4
                    ],
                    [
                        2,
                        2
                    ],
                    [
                        3,
                        0
                    ],
                    [
                        3,
                        1
                    ],
                    [
                        4,
                        0
                    ]
                ],
                "isHidden": false
            }
        ]
    },
    {
        "id": "msft-9",
        "company": "microsoft",
        "category": "product",
        "number": 9,
        "title": "Count Good Nodes in Binary Tree",
        "difficulty": "Medium",
        "topic": "DFS Trees",
        "frequency": "93% in Microsoft Campus",
        "context": "Peak telemetry sensor validation in Microsoft Azure",
        "fnName": "solve",
        "params": [
            {
                "name": "tree",
                "type": "int[]"
            }
        ],
        "returnType": "int",
        "description": "Given a binary tree in level order (-1 for null), a node `X` in the tree is named good if in the path from root to `X` there are no nodes with a value greater than `X`. Return number of good nodes.",
        "constraints": [
            "1 <= tree.length <= 10^4"
        ],
        "hint": "DFS tracking max_val_along_path. Increment if node.val >= max_val_along_path.",
        "starter": {
            "python": "def solve(tree):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(tree) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(tree):\n    if not tree or tree[0] == -1: return 0\n    def dfs(idx, max_so_far):\n        if idx >= len(tree) or tree[idx] == -1: return 0\n        val = tree[idx]\n        good = 1 if val >= max_so_far else 0\n        new_max = max(max_so_far, val)\n        return good + dfs(2*idx+1, new_max) + dfs(2*idx+2, new_max)\n    return dfs(0, tree[0])",
            "javascript": "function solve(tree) {\n    if (!tree.length || tree[0] === -1) return 0;\n    const dfs = (idx, maxSoFar) => {\n        if (idx >= tree.length || tree[idx] === -1) return 0;\n        const v = tree[idx];\n        const good = v >= maxSoFar ? 1 : 0;\n        const newMax = Math.max(maxSoFar, v);\n        return good + dfs(2 * idx + 1, newMax) + dfs(2 * idx + 2, newMax);\n    };\n    return dfs(0, tree[0]);\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        3,
                        1,
                        4,
                        3,
                        -1,
                        1,
                        5
                    ]
                ],
                "expected": 4,
                "isHidden": false
            },
            {
                "args": [
                    [
                        3,
                        3,
                        -1,
                        4,
                        2
                    ]
                ],
                "expected": 3,
                "isHidden": false
            }
        ]
    },
    {
        "id": "msft-10",
        "company": "microsoft",
        "category": "product",
        "number": 10,
        "title": "Sum Root to Leaf Numbers",
        "difficulty": "Medium",
        "topic": "DFS Trees",
        "frequency": "90% in Microsoft Onsite",
        "context": "Tree path integer accumulation in Microsoft Office",
        "fnName": "solve",
        "params": [
            {
                "name": "tree",
                "type": "int[]"
            }
        ],
        "returnType": "int",
        "description": "Given complete binary tree array (level order, -1 for null). Each node has digit 0-9. Each root-to-leaf path represents a number. Return the total sum of all root-to-leaf numbers.",
        "constraints": [
            "1 <= tree.length <= 1000"
        ],
        "hint": "At each node: cur = cur * 10 + val. If leaf (no children), return cur.",
        "starter": {
            "python": "def solve(tree):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(tree) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(tree):\n    if not tree or tree[0] == -1: return 0\n    def dfs(idx, cur):\n        if idx >= len(tree) or tree[idx] == -1: return 0\n        cur = cur * 10 + tree[idx]\n        l = 2 * idx + 1\n        r = 2 * idx + 2\n        is_leaf = (l >= len(tree) or tree[l] == -1) and (r >= len(tree) or tree[r] == -1)\n        if is_leaf: return cur\n        return dfs(l, cur) + dfs(r, cur)\n    return dfs(0, 0)",
            "javascript": "function solve(tree) {\n    if (!tree.length || tree[0] === -1) return 0;\n    const dfs = (idx, cur) => {\n        if (idx >= tree.length || tree[idx] === -1) return 0;\n        cur = cur * 10 + tree[idx];\n        const l = 2 * idx + 1, r = 2 * idx + 2;\n        const isLeaf = (l >= tree.length || tree[l] === -1) && (r >= tree.length || tree[r] === -1);\n        if (isLeaf) return cur;\n        return dfs(l, cur) + dfs(r, cur);\n    };\n    return dfs(0, 0);\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        1,
                        2,
                        3
                    ]
                ],
                "expected": 25,
                "isHidden": false
            },
            {
                "args": [
                    [
                        4,
                        9,
                        0,
                        5,
                        1
                    ]
                ],
                "expected": 1026,
                "isHidden": false
            }
        ]
    },
    {
        "id": "msft-11",
        "company": "microsoft",
        "category": "product",
        "number": 11,
        "title": "Max Subarray Sum with One Deletion",
        "difficulty": "Medium",
        "topic": "Dynamic Programming",
        "frequency": "89% in Microsoft Codility",
        "context": "Fault-tolerant telemetry signal peak in Microsoft Azure",
        "fnName": "solve",
        "params": [
            {
                "name": "arr",
                "type": "int[]"
            }
        ],
        "returnType": "int",
        "description": "Given an array of integers `arr`, return maximum sum of a non-empty subarray with at most one element deleted.",
        "constraints": [
            "1 <= arr.length <= 10^5",
            "-10^4 <= arr[i] <= 10^4"
        ],
        "hint": "Two states: no_del (standard Kadane) and one_del = max(no_del_prev, one_del_prev + x).",
        "starter": {
            "python": "def solve(arr):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(arr) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(arr):\n    no_del = one_del = ans = arr[0]\n    for x in arr[1:]:\n        one_del = max(one_del + x, no_del, x)\n        no_del = max(no_del + x, x)\n        ans = max(ans, no_del, one_del)\n    return ans",
            "javascript": "function solve(arr) {\n    let noDel = arr[0], oneDel = arr[0], ans = arr[0];\n    for (let i = 1; i < arr.length; i++) {\n        const x = arr[i];\n        oneDel = Math.max(oneDel + x, noDel, x);\n        noDel = Math.max(noDel + x, x);\n        ans = Math.max(ans, noDel, oneDel);\n    }\n    return ans;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        1,
                        -2,
                        0,
                        3
                    ]
                ],
                "expected": 4,
                "isHidden": false
            },
            {
                "args": [
                    [
                        1,
                        -2,
                        -3,
                        4
                    ]
                ],
                "expected": 4,
                "isHidden": false
            },
            {
                "args": [
                    [
                        -1,
                        -1,
                        -1,
                        -1
                    ]
                ],
                "expected": -1,
                "isHidden": true
            }
        ]
    },
    {
        "id": "msft-12",
        "company": "microsoft",
        "category": "product",
        "number": 12,
        "title": "Anti-Clockwise Boundary Traversal of Binary Tree",
        "difficulty": "Medium",
        "topic": "Trees",
        "frequency": "92% in Microsoft Onsite",
        "context": "Boundary perimeter scanning in Microsoft HoloLens",
        "fnName": "solve",
        "params": [
            {
                "name": "tree",
                "type": "int[]"
            }
        ],
        "returnType": "int[]",
        "description": "Given binary tree in level order (-1 for null). Return anti-clockwise boundary traversal: root, left boundary (top to bottom), all leaf nodes (left to right), and right boundary (bottom to top).",
        "constraints": [
            "1 <= tree.length <= 1000"
        ],
        "hint": "Collect root -> left boundary non-leaves -> leaves in-order -> right boundary reversed non-leaves.",
        "starter": {
            "python": "def solve(tree):\n    # Write your logic here\n    return []",
            "javascript": "function solve(tree) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(tree):\n    if not tree or tree[0] == -1: return []\n    res = [tree[0]]\n    def is_leaf(i):\n        l, r = 2*i+1, 2*i+2\n        return (l >= len(tree) or tree[l] == -1) and (r >= len(tree) or tree[r] == -1)\n    curr = 1\n    while curr < len(tree) and tree[curr] != -1:\n        if not is_leaf(curr): res.append(tree[curr])\n        l, r = 2*curr+1, 2*curr+2\n        curr = l if (l < len(tree) and tree[l] != -1) else r\n    def add_leaves(i):\n        if i >= len(tree) or tree[i] == -1: return\n        if is_leaf(i) and i != 0: res.append(tree[i])\n        add_leaves(2*i+1); add_leaves(2*i+2)\n    add_leaves(0)\n    rb = []\n    curr = 2\n    while curr < len(tree) and tree[curr] != -1:\n        if not is_leaf(curr): rb.append(tree[curr])\n        l, r = 2*curr+1, 2*curr+2\n        curr = r if (r < len(tree) and tree[r] != -1) else l\n    res.extend(reversed(rb))\n    return res",
            "javascript": "function solve(tree) {\n    if (!tree.length || tree[0] === -1) return [];\n    const res = [tree[0]];\n    const isLeaf = (i) => {\n        const l = 2*i+1, r = 2*i+2;\n        return (l >= tree.length || tree[l] === -1) && (r >= tree.length || tree[r] === -1);\n    };\n    let cur = 1;\n    while (cur < tree.length && tree[cur] !== -1) {\n        if (!isLeaf(cur)) res.push(tree[cur]);\n        const l = 2*cur+1, r = 2*cur+2;\n        cur = (l < tree.length && tree[l] !== -1) ? l : r;\n    }\n    const addLeaves = (i) => {\n        if (i >= tree.length || tree[i] === -1) return;\n        if (isLeaf(i) && i !== 0) res.push(tree[i]);\n        addLeaves(2*i+1); addLeaves(2*i+2);\n    };\n    addLeaves(0);\n    const rb = [];\n    cur = 2;\n    while (cur < tree.length && tree[cur] !== -1) {\n        if (!isLeaf(cur)) rb.push(tree[cur]);\n        const l = 2*cur+1, r = 2*cur+2;\n        cur = (r < tree.length && tree[r] !== -1) ? r : l;\n    }\n    return res.concat(rb.reverse());\n}"
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
                        7
                    ]
                ],
                "expected": [
                    1,
                    2,
                    4,
                    5,
                    6,
                    7,
                    3
                ],
                "isHidden": false
            }
        ]
    },
    {
        "id": "msft-13",
        "company": "microsoft",
        "category": "product",
        "number": 13,
        "title": "Find First and Last Position of Element in Sorted Array",
        "difficulty": "Medium",
        "topic": "Binary Search",
        "frequency": "95% in Microsoft Codility",
        "context": "Target bound index range in Microsoft SQL database",
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
        "description": "Given sorted array of integers `nums`, find starting and ending position of `target` in O(log n) time. If not found, return `[-1, -1]`.",
        "constraints": [
            "0 <= nums.length <= 10^5"
        ],
        "hint": "Two binary searches: one for lower bound (first occurrence) and one for upper bound (last occurrence).",
        "starter": {
            "python": "def solve(nums, target):\n    # Write your logic here\n    return []",
            "javascript": "function solve(nums, target) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(nums, target):\n    import bisect\n    l = bisect.bisect_left(nums, target)\n    r = bisect.bisect_right(nums, target) - 1\n    if l <= r and l < len(nums) and nums[l] == target:\n        return [l, r]\n    return [-1, -1]",
            "javascript": "function solve(nums, target) {\n    const find = (isLeft) => {\n        let l = 0, r = nums.length - 1, res = -1;\n        while (l <= r) {\n            const m = (l + r) >> 1;\n            if (nums[m] === target) {\n                res = m;\n                if (isLeft) r = m - 1; else l = m + 1;\n            } else if (nums[m] < target) l = m + 1;\n            else r = m - 1;\n        }\n        return res;\n    };\n    return [find(true), find(false)];\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        5,
                        7,
                        7,
                        8,
                        8,
                        10
                    ],
                    8
                ],
                "expected": [
                    3,
                    4
                ],
                "isHidden": false
            },
            {
                "args": [
                    [
                        5,
                        7,
                        7,
                        8,
                        8,
                        10
                    ],
                    6
                ],
                "expected": [
                    -1,
                    -1
                ],
                "isHidden": false
            }
        ]
    },
    {
        "id": "msft-14",
        "company": "microsoft",
        "category": "product",
        "number": 14,
        "title": "Longest Valid Parentheses Substring",
        "difficulty": "Hard",
        "topic": "Stack & DP",
        "frequency": "91% in Microsoft Onsite",
        "context": "Compiler syntax parser in Microsoft Visual Studio",
        "fnName": "solve",
        "params": [
            {
                "name": "s",
                "type": "string"
            }
        ],
        "returnType": "int",
        "description": "Given a string containing just '(' and ')', return the length of the longest valid (well-formed) parentheses substring.",
        "constraints": [
            "0 <= s.length <= 3 * 10^4"
        ],
        "hint": "Maintain stack of indices with initial -1. Push '(' indices. On ')' pop, then len = i - stack[-1].",
        "starter": {
            "python": "def solve(s):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(s) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(s):\n    stack = [-1]\n    max_len = 0\n    for i, c in enumerate(s):\n        if c == '(': stack.append(i)\n        else:\n            stack.pop()\n            if not stack: stack.append(i)\n            else: max_len = max(max_len, i - stack[-1])\n    return max_len",
            "javascript": "function solve(s) {\n    const stack = [-1];\n    let maxLen = 0;\n    for (let i = 0; i < s.length; i++) {\n        if (s[i] === '(') stack.push(i);\n        else {\n            stack.pop();\n            if (!stack.length) stack.push(i);\n            else maxLen = Math.max(maxLen, i - stack[stack.length - 1]);\n        }\n    }\n    return maxLen;\n}"
        },
        "testCases": [
            {
                "args": [
                    "(()"
                ],
                "expected": 2,
                "isHidden": false
            },
            {
                "args": [
                    ")()())"
                ],
                "expected": 4,
                "isHidden": false
            },
            {
                "args": [
                    ""
                ],
                "expected": 0,
                "isHidden": true
            }
        ]
    },
    {
        "id": "msft-15",
        "company": "microsoft",
        "category": "product",
        "number": 15,
        "title": "Flatten 2D Vector Iterator",
        "difficulty": "Medium",
        "topic": "Design & Arrays",
        "frequency": "88% in Microsoft Onsite",
        "context": "Vector serialization in Microsoft DirectX",
        "fnName": "solve",
        "params": [
            {
                "name": "vec",
                "type": "int[][]"
            }
        ],
        "returnType": "int[]",
        "description": "Given 2D vector array `vec`, flatten it into a 1D array by returning all elements sequentially row by row.",
        "constraints": [
            "0 <= vec.length <= 1000"
        ],
        "hint": "Iterate rows and columns, append non-empty row items.",
        "starter": {
            "python": "def solve(vec):\n    # Write your logic here\n    return []",
            "javascript": "function solve(vec) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(vec):\n    res = []\n    for row in vec: res.extend(row)\n    return res",
            "javascript": "function solve(vec) {\n    return vec.flat();\n}"
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
                            3
                        ],
                        [
                            4,
                            5,
                            6
                        ]
                    ]
                ],
                "expected": [
                    1,
                    2,
                    3,
                    4,
                    5,
                    6
                ],
                "isHidden": false
            },
            {
                "args": [
                    [
                        [],
                        [
                            1
                        ],
                        []
                    ]
                ],
                "expected": [
                    1
                ],
                "isHidden": false
            }
        ]
    },
    {
        "id": "msft-16",
        "company": "microsoft",
        "category": "product",
        "number": 16,
        "title": "Minimum Operations to Reduce X to Zero",
        "difficulty": "Medium",
        "topic": "Prefix Sum & Two Pointers",
        "frequency": "92% in Microsoft Codility",
        "context": "Endpoint buffer reduction in Microsoft Azure",
        "fnName": "solve",
        "params": [
            {
                "name": "nums",
                "type": "int[]"
            },
            {
                "name": "x",
                "type": "int"
            }
        ],
        "returnType": "int",
        "description": "You can remove either the leftmost or rightmost element from array `nums` and subtract its value from `x`. Return minimum operations to reduce `x` to exactly 0, or -1 if impossible.",
        "constraints": [
            "1 <= nums.length <= 10^5",
            "1 <= x <= 10^9"
        ],
        "hint": "Equivalent to finding longest contiguous subarray with sum == sum(nums) - x.",
        "starter": {
            "python": "def solve(nums, x):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(nums, x) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(nums, x):\n    target = sum(nums) - x\n    if target == 0: return len(nums)\n    if target < 0: return -1\n    max_len = -1\n    cur = l = 0\n    for r, v in enumerate(nums):\n        cur += v\n        while cur > target and l <= r:\n            cur -= nums[l]; l += 1\n        if cur == target:\n            max_len = max(max_len, r - l + 1)\n    return len(nums) - max_len if max_len != -1 else -1",
            "javascript": "function solve(nums, x) {\n    const target = nums.reduce((a, b) => a + b, 0) - x;\n    if (target === 0) return nums.length;\n    if (target < 0) return -1;\n    let maxLen = -1, cur = 0, l = 0;\n    for (let r = 0; r < nums.length; r++) {\n        cur += nums[r];\n        while (cur > target && l <= r) cur -= nums[l++];\n        if (cur === target) maxLen = Math.max(maxLen, r - l + 1);\n    }\n    return maxLen !== -1 ? nums.length - maxLen : -1;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        1,
                        1,
                        4,
                        2,
                        3
                    ],
                    5
                ],
                "expected": 2,
                "isHidden": false
            },
            {
                "args": [
                    [
                        5,
                        6,
                        7,
                        8,
                        9
                    ],
                    4
                ],
                "expected": -1,
                "isHidden": false
            }
        ]
    },
    {
        "id": "msft-17",
        "company": "microsoft",
        "category": "product",
        "number": 17,
        "title": "Find All Anagram Start Indices in String",
        "difficulty": "Medium",
        "topic": "Sliding Window",
        "frequency": "94% in Microsoft Campus",
        "context": "Search substring matching in Microsoft Bing",
        "fnName": "solve",
        "params": [
            {
                "name": "s",
                "type": "string"
            },
            {
                "name": "p",
                "type": "string"
            }
        ],
        "returnType": "int[]",
        "description": "Given strings `s` and `p`, return an array of all the start indices of `p`'s anagrams in `s`.",
        "constraints": [
            "1 <= s.length, p.length <= 3 * 10^4"
        ],
        "hint": "Sliding window of length len(p). Maintain character frequency map count.",
        "starter": {
            "python": "def solve(s, p):\n    # Write your logic here\n    return []",
            "javascript": "function solve(s, p) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(s, p):\n    if len(s) < len(p): return []\n    cp, cs = [0] * 26, [0] * 26\n    for i in range(len(p)):\n        cp[ord(p[i]) - 97] += 1\n        cs[ord(s[i]) - 97] += 1\n    res = []\n    if cp == cs: res.append(0)\n    for i in range(len(p), len(s)):\n        cs[ord(s[i]) - 97] += 1\n        cs[ord(s[i - len(p)]) - 97] -= 1\n        if cp == cs: res.append(i - len(p) + 1)\n    return res",
            "javascript": "function solve(s, p) {\n    if (s.length < p.length) return [];\n    const cp = new Array(26).fill(0), cs = new Array(26).fill(0);\n    for (let i = 0; i < p.length; i++) {\n        cp[p.charCodeAt(i) - 97]++;\n        cs[s.charCodeAt(i) - 97]++;\n    }\n    const res = [];\n    const match = () => cp.every((v, i) => v === cs[i]);\n    if (match()) res.push(0);\n    for (let i = p.length; i < s.length; i++) {\n        cs[s.charCodeAt(i) - 97]++;\n        cs[s.charCodeAt(i - p.length) - 97]--;\n        if (match()) res.push(i - p.length + 1);\n    }\n    return res;\n}"
        },
        "testCases": [
            {
                "args": [
                    "cbaebabacd",
                    "abc"
                ],
                "expected": [
                    0,
                    6
                ],
                "isHidden": false
            },
            {
                "args": [
                    "abab",
                    "ab"
                ],
                "expected": [
                    0,
                    1,
                    2
                ],
                "isHidden": false
            }
        ]
    },
    {
        "id": "msft-18",
        "company": "microsoft",
        "category": "product",
        "number": 18,
        "title": "Clone Graph Node Adjacency List",
        "difficulty": "Medium",
        "topic": "Graph BFS",
        "frequency": "91% in Microsoft Onsite",
        "context": "Graph serialization in Microsoft Graph API",
        "fnName": "solve",
        "params": [
            {
                "name": "adjList",
                "type": "int[][]"
            }
        ],
        "returnType": "int[][]",
        "description": "Given adjacency list of connected undirected graph (1-indexed where index 0 is node 1's neighbors), return a deep copy representation of the graph adjacency list.",
        "constraints": [
            "0 <= adjList.length <= 100"
        ],
        "hint": "Clone each node and copy neighbor connections.",
        "starter": {
            "python": "def solve(adjList):\n    # Write your logic here\n    return []",
            "javascript": "function solve(adjList) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(adjList):\n    return [row[:] for row in adjList]",
            "javascript": "function solve(adjList) {\n    return adjList.map(r => [...r]);\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        [
                            2,
                            4
                        ],
                        [
                            1,
                            3
                        ],
                        [
                            2,
                            4
                        ],
                        [
                            1,
                            3
                        ]
                    ]
                ],
                "expected": [
                    [
                        2,
                        4
                    ],
                    [
                        1,
                        3
                    ],
                    [
                        2,
                        4
                    ],
                    [
                        1,
                        3
                    ]
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
        "id": "msft-19",
        "company": "microsoft",
        "category": "product",
        "number": 19,
        "title": "Count Complete Binary Tree Nodes in Less Than O(n)",
        "difficulty": "Medium",
        "topic": "Binary Search & Trees",
        "frequency": "90% in Microsoft Onsite",
        "context": "B-Tree node calculation in Microsoft SQL Server",
        "fnName": "solve",
        "params": [
            {
                "name": "tree",
                "type": "int[]"
            }
        ],
        "returnType": "int",
        "description": "Given complete binary tree array (level order, -1 for null). Return total number of valid nodes.",
        "constraints": [
            "1 <= tree.length <= 10^5"
        ],
        "hint": "Filter non-(-1) nodes, or use tree depth comparison to count in O((log n)^2).",
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
                    [
                        1
                    ]
                ],
                "expected": 1,
                "isHidden": false
            }
        ]
    },
    {
        "id": "msft-20",
        "company": "microsoft",
        "category": "product",
        "number": 20,
        "title": "Surrounded Regions (Capture X and O)",
        "difficulty": "Medium",
        "topic": "DFS & Matrix",
        "frequency": "93% in Microsoft Onsite",
        "context": "Flood fill territory capture in Microsoft Games Studio",
        "fnName": "solve",
        "params": [
            {
                "name": "board",
                "type": "string[][]"
            }
        ],
        "returnType": "string[][]",
        "description": "Given `m x n` matrix containing 'X' and 'O', capture all regions that are surrounded by 'X'. (A cell 'O' is captured by flipping it to 'X' if it cannot connect to boundary 'O').",
        "constraints": [
            "1 <= m, n <= 200"
        ],
        "hint": "DFS from all border 'O's and mark them safe. Then flip remaining 'O's to 'X'.",
        "starter": {
            "python": "def solve(board):\n    # Write your logic here\n    return []",
            "javascript": "function solve(board) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(board):\n    m, n = len(board), len(board[0])\n    b = [r[:] for r in board]\n    def dfs(r, c):\n        if r < 0 or r >= m or c < 0 or c >= n or b[r][c] != 'O': return\n        b[r][c] = 'S'\n        dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1)\n    for i in range(m):\n        if b[i][0] == 'O': dfs(i, 0)\n        if b[i][n-1] == 'O': dfs(i, n - 1)\n    for j in range(n):\n        if b[0][j] == 'O': dfs(0, j)\n        if b[m-1][j] == 'O': dfs(m - 1, j)\n    for i in range(m):\n        for j in range(n):\n            if b[i][j] == 'O': b[i][j] = 'X'\n            elif b[i][j] == 'S': b[i][j] = 'O'\n    return b",
            "javascript": "function solve(board) {\n    const m = board.length, n = board[0].length;\n    const b = board.map(r => [...r]);\n    const dfs = (r, c) => {\n        if (r < 0 || r >= m || c < 0 || c >= n || b[r][c] !== 'O') return;\n        b[r][c] = 'S';\n        dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1);\n    };\n    for (let i = 0; i < m; i++) {\n        if (b[i][0] === 'O') dfs(i, 0);\n        if (b[i][n - 1] === 'O') dfs(i, n - 1);\n    }\n    for (let j = 0; j < n; j++) {\n        if (b[0][j] === 'O') dfs(0, j);\n        if (b[m - 1][j] === 'O') dfs(m - 1, j);\n    }\n    for (let i = 0; i < m; i++) {\n        for (let j = 0; j < n; j++) {\n            if (b[i][j] === 'O') b[i][j] = 'X';\n            else if (b[i][j] === 'S') b[i][j] = 'O';\n        }\n    }\n    return b;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        [
                            "X",
                            "X",
                            "X",
                            "X"
                        ],
                        [
                            "X",
                            "O",
                            "O",
                            "X"
                        ],
                        [
                            "X",
                            "X",
                            "O",
                            "X"
                        ],
                        [
                            "X",
                            "O",
                            "X",
                            "X"
                        ]
                    ]
                ],
                "expected": [
                    [
                        "X",
                        "X",
                        "X",
                        "X"
                    ],
                    [
                        "X",
                        "X",
                        "X",
                        "X"
                    ],
                    [
                        "X",
                        "X",
                        "X",
                        "X"
                    ],
                    [
                        "X",
                        "O",
                        "X",
                        "X"
                    ]
                ],
                "isHidden": false
            }
        ]
    }
];
