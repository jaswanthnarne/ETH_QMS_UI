export const GOLDMAN_SACHS_QUESTIONS = [
    {
        "id": "gs-1",
        "company": "goldmansachs",
        "category": "fintech",
        "number": 1,
        "title": "Stock Span Problem (Monotonic Stack)",
        "difficulty": "Medium",
        "topic": "Monotonic Stack",
        "frequency": "98% in Goldman Sachs Tech",
        "context": "Trading desk stock volatility indicator",
        "fnName": "solve",
        "params": [
            {
                "name": "prices",
                "type": "int[]"
            }
        ],
        "returnType": "int[]",
        "description": "Given daily stock `prices`. The span of the stock's price on day `i` is the maximum number of consecutive days (ending today) for which price was less than or equal to `prices[i]`. Return spans array.",
        "constraints": [
            "1 <= prices.length <= 10^5"
        ],
        "hint": "Monotonic decreasing stack storing indices. Pop while stack top price <= current price.",
        "starter": {
            "python": "def solve(prices):\n    # Write your logic here\n    return []",
            "javascript": "function solve(prices) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(prices):\n    stack = []\n    spans = []\n    for i, p in enumerate(prices):\n        while stack and prices[stack[-1]] <= p:\n            stack.pop()\n        spans.append(i + 1 if not stack else i - stack[-1])\n        stack.append(i)\n    return spans",
            "javascript": "function solve(prices) {\n    const stack = [];\n    const spans = [];\n    for (let i = 0; i < prices.length; i++) {\n        while (stack.length > 0 && prices[stack[stack.length - 1]] <= prices[i]) {\n            stack.pop();\n        }\n        spans.push(stack.length === 0 ? i + 1 : i - stack[stack.length - 1]);\n        stack.push(i);\n    }\n    return spans;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        100,
                        80,
                        60,
                        70,
                        60,
                        75,
                        85
                    ]
                ],
                "expected": [
                    1,
                    1,
                    1,
                    2,
                    1,
                    4,
                    6
                ],
                "isHidden": false
            },
            {
                "args": [
                    [
                        10,
                        20,
                        30
                    ]
                ],
                "expected": [
                    1,
                    2,
                    3
                ],
                "isHidden": false
            }
        ]
    },
    {
        "id": "gs-2",
        "company": "goldmansachs",
        "category": "fintech",
        "number": 2,
        "title": "Fraction to Recurring Decimal",
        "difficulty": "Medium",
        "topic": "Math & Hash Map",
        "frequency": "96% in Goldman Sachs CoderPad",
        "context": "High precision bond yield computation",
        "fnName": "solve",
        "params": [
            {
                "name": "numerator",
                "type": "int"
            },
            {
                "name": "denominator",
                "type": "int"
            }
        ],
        "returnType": "string",
        "description": "Given two integers representing numerator and denominator, return fraction in string format. If fractional part is repeating, enclose repeating digits in parentheses.",
        "constraints": [
            "-2^31 <= numerator, denominator <= 2^31 - 1",
            "denominator != 0"
        ],
        "hint": "Store remainder indices in a map. When remainder repeats, insert parentheses.",
        "starter": {
            "python": "def solve(numerator, denominator):\n    # Write your logic here\n    return \"\"",
            "javascript": "function solve(numerator, denominator) {\n    // Write your logic here\n    return \"\";\n}"
        },
        "solution": {
            "python": "def solve(numerator, denominator):\n    if numerator == 0: return '0'\n    res = []\n    if (numerator < 0) ^ (denominator < 0): res.append('-')\n    num, den = abs(numerator), abs(denominator)\n    res.append(str(num // den))\n    rem = num % den\n    if rem == 0: return ''.join(res)\n    res.append('.')\n    seen = {}\n    while rem != 0:\n        if rem in seen:\n            res.insert(seen[rem], '(')\n            res.append(')')\n            break\n        seen[rem] = len(res)\n        rem *= 10\n        res.append(str(rem // den))\n        rem %= den\n    return ''.join(res)",
            "javascript": "function solve(numerator, denominator) {\n    if (numerator === 0) return '0';\n    let res = '';\n    if ((numerator < 0) ^ (denominator < 0)) res += '-';\n    let num = Math.abs(numerator);\n    const den = Math.abs(denominator);\n    res += Math.floor(num / den);\n    let rem = num % den;\n    if (rem === 0) return res;\n    res += '.';\n    const seen = new Map();\n    while (rem !== 0) {\n        if (seen.has(rem)) {\n            const idx = seen.get(rem);\n            return res.slice(0, idx) + '(' + res.slice(idx) + ')';\n        }\n        seen.set(rem, res.length);\n        rem *= 10;\n        res += Math.floor(rem / den);\n        rem %= den;\n    }\n    return res;\n}"
        },
        "testCases": [
            {
                "args": [
                    1,
                    2
                ],
                "expected": "0.5",
                "isHidden": false
            },
            {
                "args": [
                    2,
                    3
                ],
                "expected": "0.(6)",
                "isHidden": false
            },
            {
                "args": [
                    4,
                    333
                ],
                "expected": "0.(012)",
                "isHidden": true
            }
        ]
    },
    {
        "id": "gs-3",
        "company": "goldmansachs",
        "category": "fintech",
        "number": 3,
        "title": "Knight Probability in Chessboard (Monte Carlo DP)",
        "difficulty": "Medium",
        "topic": "Dynamic Programming",
        "frequency": "94% in Goldman Sachs Quant",
        "context": "Random walk risk diffusion models",
        "fnName": "solve",
        "params": [
            {
                "name": "n",
                "type": "int"
            },
            {
                "name": "k",
                "type": "int"
            },
            {
                "name": "row",
                "type": "int"
            },
            {
                "name": "column",
                "type": "int"
            }
        ],
        "returnType": "float",
        "description": "On an `n x n` chessboard, knight starts at `(row, column)`. Makes `k` random moves (1/8 prob each). Return probability that knight remains on board after `k` moves, rounded to 5 decimal places.",
        "constraints": [
            "1 <= n <= 25",
            "0 <= k <= 100"
        ],
        "hint": "DP[r][c] is probability of staying on board from cell (r, c).",
        "starter": {
            "python": "def solve(n, k, row, column):\n    # Write your logic here\n    return 0.0",
            "javascript": "function solve(n, k, row, column) {\n    // Write your logic here\n    return 0.0;\n}"
        },
        "solution": {
            "python": "def solve(n, k, row, column):\n    moves = [(-2, -1), (-2, 1), (-1, -2), (-1, 2), (1, -2), (1, 2), (2, -1), (2, 1)]\n    dp = [[1.0] * n for _ in range(n)]\n    for step in range(k):\n        new_dp = [[0.0] * n for _ in range(n)]\n        for r in range(n):\n            for c in range(n):\n                for dr, dc in moves:\n                    nr, nc = r + dr, c + dc\n                    if 0 <= nr < n and 0 <= nc < n:\n                        new_dp[r][c] += dp[nr][nc] / 8.0\n        dp = new_dp\n    return round(float(dp[row][column]), 5)",
            "javascript": "function solve(n, k, row, column) {\n    const moves = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];\n    let dp = Array.from({ length: n }, () => new Array(n).fill(1));\n    for (let step = 0; step < k; step++) {\n        const newDp = Array.from({ length: n }, () => new Array(n).fill(0));\n        for (let r = 0; r < n; r++) {\n            for (let c = 0; c < n; c++) {\n                for (const [dr, dc] of moves) {\n                    const nr = r + dr, nc = c + dc;\n                    if (nr >= 0 && nr < n && nc >= 0 && nc < n) {\n                        newDp[r][c] += dp[nr][nc] / 8;\n                    }\n                }\n            }\n        }\n        dp = newDp;\n    }\n    return Math.round(dp[row][column] * 100000) / 100000;\n}"
        },
        "testCases": [
            {
                "args": [
                    3,
                    2,
                    0,
                    0
                ],
                "expected": 0.0625,
                "isHidden": false
            },
            {
                "args": [
                    1,
                    0,
                    0,
                    0
                ],
                "expected": 1,
                "isHidden": false
            }
        ]
    },
    {
        "id": "gs-4",
        "company": "goldmansachs",
        "category": "fintech",
        "number": 4,
        "title": "High-Frequency Order Book Level-2 Matching",
        "difficulty": "Hard",
        "topic": "Priority Queue",
        "frequency": "95% in GS Electronic Trading",
        "context": "Matching buy bids and sell asks in Goldman Sachs HFT engines",
        "fnName": "solve",
        "params": [
            {
                "name": "orders",
                "type": "int[][]"
            }
        ],
        "returnType": "int",
        "description": "Given orders `[price, amount, orderType]` where `orderType = 0` is BUY and `1` is SELL. When a BUY arrives, it matches with existing SELL of price <= BUY price. When a SELL arrives, it matches with BUY of price >= SELL price. Return total amount of unfulfilled orders left in the book.",
        "constraints": [
            "1 <= orders.length <= 10^4"
        ],
        "hint": "Use max-heap for BUY and min-heap for SELL.",
        "starter": {
            "python": "def solve(orders):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(orders) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(orders):\n    import heapq\n    buy_pq = [] # max heap (-price, amount)\n    sell_pq = [] # min heap (price, amount)\n    for price, amount, otype in orders:\n        if otype == 0: # BUY\n            while amount > 0 and sell_pq and sell_pq[0][0] <= price:\n                s_price, s_amt = heapq.heappop(sell_pq)\n                matched = min(amount, s_amt)\n                amount -= matched\n                s_amt -= matched\n                if s_amt > 0: heapq.heappush(sell_pq, (s_price, s_amt))\n            if amount > 0: heapq.heappush(buy_pq, (-price, amount))\n        else: # SELL\n            while amount > 0 and buy_pq and -buy_pq[0][0] >= price:\n                b_price, b_amt = heapq.heappop(buy_pq)\n                matched = min(amount, b_amt)\n                amount -= matched\n                b_amt -= matched\n                if b_amt > 0: heapq.heappush(buy_pq, (b_price, b_amt))\n            if amount > 0: heapq.heappush(sell_pq, (price, amount))\n    total = sum(amt for _, amt in buy_pq) + sum(amt for _, amt in sell_pq)\n    return total % (10**9 + 7)",
            "javascript": "function solve(orders) {\n    const buy = [];\n    const sell = [];\n    for (const [price, amount, otype] of orders) {\n        let rem = amount;\n        if (otype === 0) {\n            sell.sort((a, b) => a[0] - b[0]);\n            while (rem > 0 && sell.length > 0 && sell[0][0] <= price) {\n                const matched = Math.min(rem, sell[0][1]);\n                rem -= matched;\n                sell[0][1] -= matched;\n                if (sell[0][1] === 0) sell.shift();\n            }\n            if (rem > 0) buy.push([price, rem]);\n        } else {\n            buy.sort((a, b) => b[0] - a[0]);\n            while (rem > 0 && buy.length > 0 && buy[0][0] >= price) {\n                const matched = Math.min(rem, buy[0][1]);\n                rem -= matched;\n                buy[0][1] -= matched;\n                if (buy[0][1] === 0) buy.shift();\n            }\n            if (rem > 0) sell.push([price, rem]);\n        }\n    }\n    const total = buy.reduce((a, b) => a + b[1], 0) + sell.reduce((a, b) => a + b[1], 0);\n    return total % 1000000007;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        [
                            10,
                            5,
                            0
                        ],
                        [
                            15,
                            2,
                            1
                        ],
                        [
                            25,
                            1,
                            1
                        ],
                        [
                            30,
                            4,
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
        "id": "gs-5",
        "company": "goldmansachs",
        "category": "fintech",
        "number": 5,
        "title": "Subarray Sum Divisible by K",
        "difficulty": "Medium",
        "topic": "Prefix Sum & Modulo",
        "frequency": "96% in Goldman Sachs Interviews",
        "context": "Cash-flow batch reconciliation divisibility",
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
        "description": "Given integer array `nums` and integer `k`, return the number of non-empty continuous subarrays that have a sum divisible by `k`.",
        "constraints": [
            "1 <= nums.length <= 3 * 10^4",
            "2 <= k <= 10^4"
        ],
        "hint": "Store prefix sum modulo k counts. Normalize negative mod: (prefix % k + k) % k.",
        "starter": {
            "python": "def solve(nums, k):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(nums, k) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(nums, k):\n    from collections import defaultdict\n    counts = defaultdict(int)\n    counts[0] = 1\n    prefix = 0\n    ans = 0\n    for x in nums:\n        prefix = (prefix + x) % k\n        ans += counts[prefix]\n        counts[prefix] += 1\n    return ans",
            "javascript": "function solve(nums, k) {\n    const counts = { 0: 1 };\n    let prefix = 0, ans = 0;\n    for (const x of nums) {\n        prefix = ((prefix + x) % k + k) % k;\n        ans += counts[prefix] || 0;\n        counts[prefix] = (counts[prefix] || 0) + 1;\n    }\n    return ans;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        4,
                        5,
                        0,
                        -2,
                        -3,
                        1
                    ],
                    5
                ],
                "expected": 7,
                "isHidden": false
            },
            {
                "args": [
                    [
                        5
                    ],
                    9
                ],
                "expected": 0,
                "isHidden": false
            }
        ]
    },
    {
        "id": "gs-6",
        "company": "goldmansachs",
        "category": "fintech",
        "number": 6,
        "title": "Maximum Submatrix Sum (2D Kadane)",
        "difficulty": "Hard",
        "topic": "2D Kadane DP",
        "frequency": "93% in Goldman Sachs Risk",
        "context": "Cross-asset correlated exposure matrix optimization",
        "fnName": "solve",
        "params": [
            {
                "name": "matrix",
                "type": "int[][]"
            }
        ],
        "returnType": "int",
        "description": "Given `m x n` matrix of integers (can contain negative values), find the maximum sum of any contiguous rectangular submatrix.",
        "constraints": [
            "1 <= matrix.length, matrix[0].length <= 200"
        ],
        "hint": "Fix top and bottom row bounds. Condense columns into 1D array and run 1D Kadane.",
        "starter": {
            "python": "def solve(matrix):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(matrix) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(matrix):\n    R, C = len(matrix), len(matrix[0])\n    max_sum = -float('inf')\n    for top in range(R):\n        col_sums = [0] * C\n        for bot in range(top, R):\n            for c in range(C):\n                col_sums[c] += matrix[bot][c]\n            # Kadane on col_sums\n            curr = 0\n            for x in col_sums:\n                curr = max(x, curr + x)\n                max_sum = max(max_sum, curr)\n    return max_sum",
            "javascript": "function solve(matrix) {\n    const R = matrix.length, C = matrix[0].length;\n    let maxSum = -Infinity;\n    for (let top = 0; top < R; top++) {\n        const colSums = new Array(C).fill(0);\n        for (let bot = top; bot < R; bot++) {\n            for (let c = 0; c < C; c++) colSums[c] += matrix[bot][c];\n            let curr = 0;\n            for (const x of colSums) {\n                curr = Math.max(x, curr + x);\n                maxSum = Math.max(maxSum, curr);\n            }\n        }\n    }\n    return maxSum;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        [
                            1,
                            2,
                            -1
                        ],
                        [
                            -8,
                            -3,
                            4
                        ],
                        [
                            3,
                            8,
                            10
                        ]
                    ]
                ],
                "expected": 25,
                "isHidden": false
            }
        ]
    },
    {
        "id": "gs-7",
        "company": "goldmansachs",
        "category": "fintech",
        "number": 7,
        "title": "Trailing Zeroes in N! Factorial",
        "difficulty": "Easy",
        "topic": "Math & Number Theory",
        "frequency": "95% in Goldman Sachs Screening",
        "context": "Prime factorization in financial cryptography",
        "fnName": "solve",
        "params": [
            {
                "name": "n",
                "type": "int"
            }
        ],
        "returnType": "int",
        "description": "Given integer `n`, return the number of trailing zeroes in `n!`.",
        "constraints": [
            "0 <= n <= 10^9"
        ],
        "hint": "Count factors of 5: floor(n/5) + floor(n/25) + floor(n/125) ...",
        "starter": {
            "python": "def solve(n):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(n) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(n):\n    count = 0\n    while n >= 5:\n        count += n // 5\n        n //= 5\n    return count",
            "javascript": "function solve(n) {\n    let count = 0;\n    while (n >= 5) {\n        count += Math.floor(n / 5);\n        n = Math.floor(n / 5);\n    }\n    return count;\n}"
        },
        "testCases": [
            {
                "args": [
                    5
                ],
                "expected": 1,
                "isHidden": false
            },
            {
                "args": [
                    25
                ],
                "expected": 6,
                "isHidden": false
            }
        ]
    },
    {
        "id": "gs-8",
        "company": "goldmansachs",
        "category": "fintech",
        "number": 8,
        "title": "Find Running Median in Financial Data Stream",
        "difficulty": "Hard",
        "topic": "Dual Heaps",
        "frequency": "97% in GS Quantitative Research",
        "context": "Streaming median bid-ask spread estimator",
        "fnName": "solve",
        "params": [
            {
                "name": "stream",
                "type": "int[]"
            }
        ],
        "returnType": "float[]",
        "description": "For every incoming integer in `stream`, output the median of numbers read so far rounded to 1 decimal place.",
        "constraints": [
            "1 <= stream.length <= 10^4"
        ],
        "hint": "Two heaps: Max-heap for lower half, Min-heap for upper half.",
        "starter": {
            "python": "def solve(stream):\n    # Write your logic here\n    return []",
            "javascript": "function solve(stream) {\n    // Write your logic here\n    return [];\n}"
        },
        "solution": {
            "python": "def solve(stream):\n    import heapq\n    small = [] # max heap (-x)\n    large = [] # min heap (x)\n    res = []\n    for num in stream:\n        heapq.heappush(small, -num)\n        heapq.heappush(large, -heapq.heappop(small))\n        if len(large) > len(small):\n            heapq.heappush(small, -heapq.heappop(large))\n        if len(small) > len(large):\n            med = float(-small[0])\n        else:\n            med = (-small[0] + large[0]) / 2.0\n        res.append(round(med, 1))\n    return res",
            "javascript": "function solve(stream) {\n    const arr = [];\n    const res = [];\n    for (const x of stream) {\n        // binary search insertion\n        let l = 0, r = arr.length;\n        while (l < r) {\n            const mid = Math.floor((l + r) / 2);\n            if (arr[mid] < x) l = mid + 1; else r = mid;\n        }\n        arr.splice(l, 0, x);\n        const n = arr.length;\n        const med = n % 2 === 1 ? arr[Math.floor(n / 2)] : (arr[n / 2 - 1] + arr[n / 2]) / 2;\n        res.push(Math.round(med * 10) / 10);\n    }\n    return res;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        5,
                        15,
                        1,
                        3
                    ]
                ],
                "expected": [
                    5,
                    10,
                    5,
                    4
                ],
                "isHidden": false
            }
        ]
    },
    {
        "id": "gs-9",
        "company": "goldmansachs",
        "category": "fintech",
        "number": 9,
        "title": "Continuous Maximum Product Subarray",
        "difficulty": "Medium",
        "topic": "Dynamic Programming",
        "frequency": "94% in Goldman Sachs Trading",
        "context": "Compounded investment returns optimization",
        "fnName": "solve",
        "params": [
            {
                "name": "nums",
                "type": "int[]"
            }
        ],
        "returnType": "int",
        "description": "Given an integer array `nums`, find a subarray that has the largest product, and return the product.",
        "constraints": [
            "1 <= nums.length <= 2 * 10^4",
            "-10 <= nums[i] <= 10"
        ],
        "hint": "Track both max_prod and min_prod because negative numbers can flip signs.",
        "starter": {
            "python": "def solve(nums):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(nums) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(nums):\n    max_p = min_p = ans = nums[0]\n    for x in nums[1:]:\n        if x < 0: max_p, min_p = min_p, max_p\n        max_p = max(x, max_p * x)\n        min_p = min(x, min_p * x)\n        ans = max(ans, max_p)\n    return ans",
            "javascript": "function solve(nums) {\n    let maxP = nums[0], minP = nums[0], ans = nums[0];\n    for (let i = 1; i < nums.length; i++) {\n        const x = nums[i];\n        if (x < 0) {\n            const tmp = maxP; maxP = minP; minP = tmp;\n        }\n        maxP = Math.max(x, maxP * x);\n        minP = Math.min(x, minP * x);\n        ans = Math.max(ans, maxP);\n    }\n    return ans;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        2,
                        3,
                        -2,
                        4
                    ]
                ],
                "expected": 6,
                "isHidden": false
            },
            {
                "args": [
                    [
                        -2,
                        0,
                        -1
                    ]
                ],
                "expected": 0,
                "isHidden": false
            }
        ]
    },
    {
        "id": "gs-10",
        "company": "goldmansachs",
        "category": "fintech",
        "number": 10,
        "title": "Maximum Sum Circular Subarray (Wrap-Around Kadane)",
        "difficulty": "Medium",
        "topic": "Kadane & Circular Array",
        "frequency": "95% in GS Quant Research",
        "context": "Cyclic seasonal portfolio volatility bounds",
        "fnName": "solve",
        "params": [
            {
                "name": "nums",
                "type": "int[]"
            }
        ],
        "returnType": "int",
        "description": "Given circular integer array nums of length n, find maximum possible sum of a non-empty subarray of nums. A circular array means the end connects to the beginning.",
        "constraints": [
            "1 <= nums.length <= 3 * 10^4",
            "-3 * 10^4 <= nums[i] <= 3 * 10^4"
        ],
        "hint": "Max circular sum is max(max_kadane, total_sum - min_kadane). If all elements negative, return max_kadane.",
        "starter": {
            "python": "def solve(nums):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(nums) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(nums):\n    total = sum(nums)\n    max_sum = curr_max = nums[0]\n    min_sum = curr_min = nums[0]\n    for x in nums[1:]:\n        curr_max = max(x, curr_max + x)\n        max_sum = max(max_sum, curr_max)\n        curr_min = min(x, curr_min + x)\n        min_sum = min(min_sum, curr_min)\n    if max_sum < 0: return max_sum\n    return max(max_sum, total - min_sum)",
            "javascript": "function solve(nums) {\n    const total = nums.reduce((a, b) => a + b, 0);\n    let maxSum = nums[0], currMax = nums[0];\n    let minSum = nums[0], currMin = nums[0];\n    for (let i = 1; i < nums.length; i++) {\n        const x = nums[i];\n        currMax = Math.max(x, currMax + x);\n        maxSum = Math.max(maxSum, currMax);\n        currMin = Math.min(x, currMin + x);\n        minSum = Math.min(minSum, currMin);\n    }\n    if (maxSum < 0) return maxSum;\n    return Math.max(maxSum, total - minSum);\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        1,
                        -2,
                        3,
                        -2
                    ]
                ],
                "expected": 3,
                "isHidden": false
            },
            {
                "args": [
                    [
                        5,
                        -3,
                        5
                    ]
                ],
                "expected": 10,
                "isHidden": false
            },
            {
                "args": [
                    [
                        -3,
                        -2,
                        -3
                    ]
                ],
                "expected": -2,
                "isHidden": true
            }
        ]
    },
    {
        "id": "gs-11",
        "company": "goldmansachs",
        "category": "fintech",
        "number": 11,
        "title": "Triangular Currency Arbitrage Opportunity",
        "difficulty": "Hard",
        "topic": "Graph Bellman-Ford",
        "frequency": "93% in GS Forex Trading",
        "context": "Exploiting triangular exchange discrepancies (EUR/USD/GBP)",
        "fnName": "solve",
        "params": [
            {
                "name": "rates",
                "type": "float[][]"
            }
        ],
        "returnType": "bool",
        "description": "Given `n x n` conversion rate matrix `rates[i][j]`. An arbitrage opportunity exists if you start with 1 unit of currency `i`, convert through a cycle, and end with strictly `> 1.0001` units. Return `true` if arbitrage cycle exists.",
        "constraints": [
            "2 <= n <= 10",
            "rates[i][j] > 0"
        ],
        "hint": "Transform weights with -log(rates). Arbitrage corresponds to negative weight cycle.",
        "starter": {
            "python": "def solve(rates):\n    # Write your logic here\n    return False",
            "javascript": "function solve(rates) {\n    // Write your logic here\n    return false;\n}"
        },
        "solution": {
            "python": "def solve(rates):\n    import math\n    N = len(rates)\n    # Floyd-Warshall for max product path\n    dist = [[rates[i][j] for j in range(N)] for i in range(N)]\n    for k in range(N):\n        for i in range(N):\n            for j in range(N):\n                dist[i][j] = max(dist[i][j], dist[i][k] * dist[k][j])\n    for i in range(N):\n        if dist[i][i] > 1.0001: return True\n    return False",
            "javascript": "function solve(rates) {\n    const N = rates.length;\n    const dist = rates.map(row => [...row]);\n    for (let k = 0; k < N; k++) {\n        for (let i = 0; i < N; i++) {\n            for (let j = 0; j < N; j++) {\n                dist[i][j] = Math.max(dist[i][j], dist[i][k] * dist[k][j]);\n            }\n        }\n    }\n    for (let i = 0; i < N; i++) if (dist[i][i] > 1.0001) return true;\n    return false;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        [
                            1,
                            0.8,
                            0.5
                        ],
                        [
                            1.25,
                            1,
                            0.65
                        ],
                        [
                            2.1,
                            1.55,
                            1
                        ]
                    ]
                ],
                "expected": true,
                "isHidden": false
            },
            {
                "args": [
                    [
                        [
                            1,
                            0.5
                        ],
                        [
                            2,
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
        "id": "gs-12",
        "company": "goldmansachs",
        "category": "fintech",
        "number": 12,
        "title": "Find Overlapping Intervals Length",
        "difficulty": "Medium",
        "topic": "Interval Sweep",
        "frequency": "90% in Goldman Sachs Analytics",
        "context": "Total trading hours active coverage",
        "fnName": "solve",
        "params": [
            {
                "name": "intervals",
                "type": "int[][]"
            }
        ],
        "returnType": "int",
        "description": "Given a collection of intervals `[start, end]`. Return total coverage length of the union of all intervals.",
        "constraints": [
            "1 <= intervals.length <= 10^4"
        ],
        "hint": "Sort by start time. Merge overlapping intervals and sum lengths (end - start).",
        "starter": {
            "python": "def solve(intervals):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(intervals) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(intervals):\n    if not intervals: return 0\n    intervals.sort()\n    merged = [intervals[0]]\n    for s, e in intervals[1:]:\n        if s <= merged[-1][1]:\n            merged[-1][1] = max(merged[-1][1], e)\n        else:\n            merged.append([s, e])\n    return sum(e - s for s, e in merged)",
            "javascript": "function solve(intervals) {\n    if (intervals.length === 0) return 0;\n    const sorted = [...intervals].sort((a, b) => a[0] - b[0]);\n    const merged = [sorted[0]];\n    for (let i = 1; i < sorted.length; i++) {\n        const [s, e] = sorted[i];\n        if (s <= merged[merged.length - 1][1]) {\n            merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], e);\n        } else {\n            merged.push([s, e]);\n        }\n    }\n    return merged.reduce((acc, [s, e]) => acc + (e - s), 0);\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        [
                            1,
                            4
                        ],
                        [
                            3,
                            6
                        ],
                        [
                            8,
                            10
                        ]
                    ]
                ],
                "expected": 7,
                "isHidden": false
            }
        ]
    },
    {
        "id": "gs-13",
        "company": "goldmansachs",
        "category": "fintech",
        "number": 13,
        "title": "Decode String Encodings k[encoded_string]",
        "difficulty": "Medium",
        "topic": "Stack",
        "frequency": "95% in Goldman Sachs Core",
        "context": "Decompressing financial FIX protocol message structures",
        "fnName": "solve",
        "params": [
            {
                "name": "s",
                "type": "string"
            }
        ],
        "returnType": "string",
        "description": "Given an encoded string where `k[encoded_string]` means `encoded_string` is repeated `k` times. Return decoded string.",
        "constraints": [
            "1 <= s.length <= 30"
        ],
        "hint": "Use two stacks: one for repeat counts k and one for string buffers.",
        "starter": {
            "python": "def solve(s):\n    # Write your logic here\n    return \"\"",
            "javascript": "function solve(s) {\n    // Write your logic here\n    return \"\";\n}"
        },
        "solution": {
            "python": "def solve(s):\n    num_stack, str_stack = [], []\n    curr_str, curr_num = \"\", 0\n    for c in s:\n        if c.isdigit():\n            curr_num = curr_num * 10 + int(c)\n        elif c == '[':\n            num_stack.append(curr_num)\n            str_stack.append(curr_str)\n            curr_num, curr_str = 0, \"\"\n        elif c == ']':\n            k = num_stack.pop()\n            prev = str_stack.pop()\n            curr_str = prev + curr_str * k\n        else:\n            curr_str += c\n    return curr_str",
            "javascript": "function solve(s) {\n    const numStack = [], strStack = [];\n    let currStr = '', currNum = 0;\n    for (const c of s) {\n        if (c >= '0' && c <= '9') {\n            currNum = currNum * 10 + parseInt(c, 10);\n        } else if (c === '[') {\n            numStack.push(currNum);\n            strStack.push(currStr);\n            currNum = 0; currStr = '';\n        } else if (c === ']') {\n            const k = numStack.pop();\n            const prev = strStack.pop();\n            currStr = prev + currStr.repeat(k);\n        } else {\n            currStr += c;\n        }\n    }\n    return currStr;\n}"
        },
        "testCases": [
            {
                "args": [
                    "3[a]2[bc]"
                ],
                "expected": "aaabcbc",
                "isHidden": false
            },
            {
                "args": [
                    "3[a2[c]]"
                ],
                "expected": "accaccacc",
                "isHidden": false
            }
        ]
    },
    {
        "id": "gs-14",
        "company": "goldmansachs",
        "category": "fintech",
        "number": 14,
        "title": "Count Anagram Pairs in Word List",
        "difficulty": "Medium",
        "topic": "Hash Map & Combinatorics",
        "frequency": "93% in Goldman Sachs Coding",
        "context": "Ticker anagram signature matching",
        "fnName": "solve",
        "params": [
            {
                "name": "words",
                "type": "string[]"
            }
        ],
        "returnType": "int",
        "description": "Given a list of strings, count the number of unordered pairs `(i, j)` where `i < j` and `words[i]` is an anagram of `words[j]`.",
        "constraints": [
            "1 <= words.length <= 10^4"
        ],
        "hint": "Sort each word's characters as hash key. For key with count c, add c * (c - 1) / 2.",
        "starter": {
            "python": "def solve(words):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(words) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(words):\n    from collections import Counter\n    keys = [''.join(sorted(w)) for w in words]\n    freq = Counter(keys)\n    return sum(c * (c - 1) // 2 for c in freq.values())",
            "javascript": "function solve(words) {\n    const freq = {};\n    for (const w of words) {\n        const k = w.split('').sort().join('');\n        freq[k] = (freq[k] || 0) + 1;\n    }\n    return Object.values(freq).reduce((acc, c) => acc + (c * (c - 1)) / 2, 0);\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        "listen",
                        "silent",
                        "enlist",
                        "apple"
                    ]
                ],
                "expected": 3,
                "isHidden": false
            }
        ]
    },
    {
        "id": "gs-15",
        "company": "goldmansachs",
        "category": "fintech",
        "number": 15,
        "title": "Max Profit with K Transactions",
        "difficulty": "Hard",
        "topic": "Dynamic Programming",
        "frequency": "96% in GS Asset Management",
        "context": "Fixed-turnover portfolio rebalancing limit",
        "fnName": "solve",
        "params": [
            {
                "name": "k",
                "type": "int"
            },
            {
                "name": "prices",
                "type": "int[]"
            }
        ],
        "returnType": "int",
        "description": "You may complete at most `k` buy-and-sell stock transactions. You cannot engage in multiple transactions simultaneously. Return maximum profit.",
        "constraints": [
            "0 <= k <= 100",
            "0 <= prices.length <= 1000"
        ],
        "hint": "DP state: dp[t][d] max profit at day d with at most t transactions.",
        "starter": {
            "python": "def solve(k, prices):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(k, prices) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(k, prices):\n    if not prices or k == 0: return 0\n    n = len(prices)\n    if k >= n // 2: return sum(max(0, prices[i] - prices[i - 1]) for i in range(1, n))\n    dp = [[0] * n for _ in range(k + 1)]\n    for t in range(1, k + 1):\n        max_diff = -prices[0]\n        for d in range(1, n):\n            dp[t][d] = max(dp[t][d - 1], prices[d] + max_diff)\n            max_diff = max(max_diff, dp[t - 1][d] - prices[d])\n    return dp[k][n - 1]",
            "javascript": "function solve(k, prices) {\n    if (prices.length === 0 || k === 0) return 0;\n    const n = prices.length;\n    if (k >= Math.floor(n / 2)) {\n        let p = 0;\n        for (let i = 1; i < n; i++) if (prices[i] > prices[i - 1]) p += prices[i] - prices[i - 1];\n        return p;\n    }\n    const dp = Array.from({ length: k + 1 }, () => new Array(n).fill(0));\n    for (let t = 1; t <= k; t++) {\n        let maxDiff = -prices[0];\n        for (let d = 1; d < n; d++) {\n            dp[t][d] = Math.max(dp[t][d - 1], prices[d] + maxDiff);\n            maxDiff = Math.max(maxDiff, dp[t - 1][d] - prices[d]);\n        }\n    }\n    return dp[k][n - 1];\n}"
        },
        "testCases": [
            {
                "args": [
                    2,
                    [
                        2,
                        4,
                        1
                    ]
                ],
                "expected": 2,
                "isHidden": false
            },
            {
                "args": [
                    2,
                    [
                        3,
                        2,
                        6,
                        5,
                        0,
                        3
                    ]
                ],
                "expected": 7,
                "isHidden": false
            }
        ]
    },
    {
        "id": "gs-16",
        "company": "goldmansachs",
        "category": "fintech",
        "number": 16,
        "title": "Validate Sudoku Matrix Configuration",
        "difficulty": "Medium",
        "topic": "Hash Set & Matrix",
        "frequency": "90% in GS Logical Puzzles",
        "context": "Constraint satisfaction grid validation",
        "fnName": "solve",
        "params": [
            {
                "name": "board",
                "type": "string[][]"
            }
        ],
        "returnType": "bool",
        "description": "Determine if a 9x9 Sudoku board is valid (digits 1-9 without repetition in each row, column, and 3x3 sub-box). Empty cells are '.'",
        "constraints": [
            "board.length == 9",
            "board[i].length == 9"
        ],
        "hint": "Track row, col, and box sets: '(d) in row r', '(d) in col c', '(d) in box b'.",
        "starter": {
            "python": "def solve(board):\n    # Write your logic here\n    return False",
            "javascript": "function solve(board) {\n    // Write your logic here\n    return false;\n}"
        },
        "solution": {
            "python": "def solve(board):\n    seen = set()\n    for r in range(9):\n        for c in range(9):\n            val = board[r][c]\n            if val != '.':\n                r_tag = f\"{val} in r {r}\"\n                c_tag = f\"{val} in c {c}\"\n                b_tag = f\"{val} in b {r//3}-{c//3}\"\n                if r_tag in seen or c_tag in seen or b_tag in seen:\n                    return False\n                seen.add(r_tag); seen.add(c_tag); seen.add(b_tag)\n    return True",
            "javascript": "function solve(board) {\n    const seen = new Set();\n    for (let r = 0; r < 9; r++) {\n        for (let c = 0; c < 9; c++) {\n            const val = board[r][c];\n            if (val !== '.') {\n                const rTag = `${val} in r ${r}`;\n                const cTag = `${val} in c ${c}`;\n                const bTag = `${val} in b ${Math.floor(r / 3)}-${Math.floor(c / 3)}`;\n                if (seen.has(rTag) || seen.has(cTag) || seen.has(bTag)) return false;\n                seen.add(rTag); seen.add(cTag); seen.add(bTag);\n            }\n        }\n    }\n    return true;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        [
                            "5",
                            "3",
                            ".",
                            ".",
                            "7",
                            ".",
                            ".",
                            ".",
                            "."
                        ],
                        [
                            "6",
                            ".",
                            ".",
                            "1",
                            "9",
                            "5",
                            ".",
                            ".",
                            "."
                        ],
                        [
                            ".",
                            "9",
                            "8",
                            ".",
                            ".",
                            ".",
                            ".",
                            "6",
                            "."
                        ],
                        [
                            "8",
                            ".",
                            ".",
                            ".",
                            "6",
                            ".",
                            ".",
                            ".",
                            "3"
                        ],
                        [
                            "4",
                            ".",
                            ".",
                            "8",
                            ".",
                            "3",
                            ".",
                            ".",
                            "1"
                        ],
                        [
                            "7",
                            ".",
                            ".",
                            ".",
                            "2",
                            ".",
                            ".",
                            ".",
                            "6"
                        ],
                        [
                            ".",
                            "6",
                            ".",
                            ".",
                            ".",
                            ".",
                            "2",
                            "8",
                            "."
                        ],
                        [
                            ".",
                            ".",
                            ".",
                            "4",
                            "1",
                            "9",
                            ".",
                            ".",
                            "5"
                        ],
                        [
                            ".",
                            ".",
                            ".",
                            ".",
                            "8",
                            ".",
                            ".",
                            "7",
                            "9"
                        ]
                    ]
                ],
                "expected": true,
                "isHidden": false
            }
        ]
    },
    {
        "id": "gs-17",
        "company": "goldmansachs",
        "category": "fintech",
        "number": 17,
        "title": "First Unique Character in Trade Feed",
        "difficulty": "Easy",
        "topic": "Hash Map",
        "frequency": "91% in GS CoderPad",
        "context": "Message stream idempotency key checking",
        "fnName": "solve",
        "params": [
            {
                "name": "s",
                "type": "string"
            }
        ],
        "returnType": "int",
        "description": "Given a string `s`, find the first non-repeating character and return its 0-based index. If it does not exist, return -1.",
        "constraints": [
            "1 <= s.length <= 10^5"
        ],
        "hint": "Count character frequencies, then find first character with count 1.",
        "starter": {
            "python": "def solve(s):\n    # Write your logic here\n    return -1",
            "javascript": "function solve(s) {\n    // Write your logic here\n    return -1;\n}"
        },
        "solution": {
            "python": "def solve(s):\n    from collections import Counter\n    freq = Counter(s)\n    for i, c in enumerate(s):\n        if freq[c] == 1: return i\n    return -1",
            "javascript": "function solve(s) {\n    const freq = {};\n    for (const c of s) freq[c] = (freq[c] || 0) + 1;\n    for (let i = 0; i < s.length; i++) if (freq[s[i]] === 1) return i;\n    return -1;\n}"
        },
        "testCases": [
            {
                "args": [
                    "goldmansachs"
                ],
                "expected": 0,
                "isHidden": false
            },
            {
                "args": [
                    "loveleetcode"
                ],
                "expected": 2,
                "isHidden": false
            }
        ]
    },
    {
        "id": "gs-18",
        "company": "goldmansachs",
        "category": "fintech",
        "number": 18,
        "title": "Minimum Swaps to Sort Array",
        "difficulty": "Medium",
        "topic": "Cycles in Graph",
        "frequency": "93% in Goldman Sachs Rounds",
        "context": "Minimizing sequence rearrangement steps in memory",
        "fnName": "solve",
        "params": [
            {
                "name": "nums",
                "type": "int[]"
            }
        ],
        "returnType": "int",
        "description": "Given an array of `n` distinct elements, find minimum number of swaps required to sort the array in ascending order.",
        "constraints": [
            "1 <= nums.length <= 10^5"
        ],
        "hint": "Disjoint cycle decomposition: total swaps = sum(cycle_size - 1).",
        "starter": {
            "python": "def solve(nums):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(nums) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(nums):\n    arr = sorted([(val, i) for i, val in enumerate(nums)])\n    visited = [False] * len(nums)\n    swaps = 0\n    for i in range(len(nums)):\n        if visited[i] or arr[i][1] == i: continue\n        cycle_size = 0\n        j = i\n        while not visited[j]:\n            visited[j] = True\n            j = arr[j][1]\n            cycle_size += 1\n        if cycle_size > 1: swaps += cycle_size - 1\n    return swaps",
            "javascript": "function solve(nums) {\n    const arr = nums.map((val, i) => ({ val, i })).sort((a, b) => a.val - b.val);\n    const visited = new Array(nums.length).fill(false);\n    let swaps = 0;\n    for (let i = 0; i < nums.length; i++) {\n        if (visited[i] || arr[i].i === i) continue;\n        let cycle = 0, j = i;\n        while (!visited[j]) {\n            visited[j] = true;\n            j = arr[j].i;\n            cycle++;\n        }\n        if (cycle > 1) swaps += cycle - 1;\n    }\n    return swaps;\n}"
        },
        "testCases": [
            {
                "args": [
                    [
                        4,
                        3,
                        2,
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
                        5,
                        4,
                        3,
                        2
                    ]
                ],
                "expected": 2,
                "isHidden": false
            }
        ]
    },
    {
        "id": "gs-19",
        "company": "goldmansachs",
        "category": "fintech",
        "number": 19,
        "title": "Find the Number of Closed Islands",
        "difficulty": "Medium",
        "topic": "DFS & Matrix",
        "frequency": "90% in GS Engineering",
        "context": "Isolated network risk partitions",
        "fnName": "solve",
        "params": [
            {
                "name": "grid",
                "type": "int[][]"
            }
        ],
        "returnType": "int",
        "description": "Given a 2D grid of 0s (land) and 1s (water). An island is surrounded by water. A closed island is completely surrounded by water (cannot touch boundary). Return number of closed islands.",
        "constraints": [
            "1 <= grid.length, grid[0].length <= 100"
        ],
        "hint": "Flood fill boundaries first to eliminate islands that touch perimeter, then count remaining.",
        "starter": {
            "python": "def solve(grid):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(grid) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(grid):\n    R, C = len(grid), len(grid[0])\n    def dfs(r, c):\n        if r < 0 or r >= R or c < 0 or c >= C or grid[r][c] == 1: return\n        grid[r][c] = 1\n        for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:\n            dfs(r + dr, c + dc)\n    # Eliminate edge connected land\n    for r in range(R):\n        dfs(r, 0); dfs(r, C - 1)\n    for c in range(C):\n        dfs(0, c); dfs(R - 1, c)\n    closed = 0\n    for r in range(1, R - 1):\n        for c in range(1, C - 1):\n            if grid[r][c] == 0:\n                closed += 1\n                dfs(r, c)\n    return closed",
            "javascript": "function solve(grid) {\n    const R = grid.length, C = grid[0].length;\n    const g = grid.map(r => [...r]);\n    const dfs = (r, c) => {\n        if (r < 0 || r >= R || c < 0 || c >= C || g[r][c] === 1) return;\n        g[r][c] = 1;\n        dfs(r - 1, c); dfs(r + 1, c); dfs(r, c - 1); dfs(r, c + 1);\n    };\n    for (let r = 0; r < R; r++) { dfs(r, 0); dfs(r, C - 1); }\n    for (let c = 0; c < C; c++) { dfs(0, c); dfs(R - 1, c); }\n    let closed = 0;\n    for (let r = 1; r < R - 1; r++) {\n        for (let c = 1; c < C - 1; c++) {\n            if (g[r][c] === 0) {\n                closed++;\n                dfs(r, c);\n            }\n        }\n    }\n    return closed;\n}"
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
                            1,
                            1,
                            1,
                            0
                        ],
                        [
                            1,
                            0,
                            0,
                            0,
                            0,
                            1,
                            1,
                            0
                        ],
                        [
                            1,
                            0,
                            1,
                            0,
                            1,
                            1,
                            1,
                            0
                        ],
                        [
                            1,
                            0,
                            0,
                            0,
                            0,
                            1,
                            0,
                            1
                        ],
                        [
                            1,
                            1,
                            1,
                            1,
                            1,
                            1,
                            1,
                            0
                        ]
                    ]
                ],
                "expected": 2,
                "isHidden": false
            }
        ]
    },
    {
        "id": "gs-20",
        "company": "goldmansachs",
        "category": "fintech",
        "number": 20,
        "title": "Ugly Numbers II (N-th Super Ugly Prime)",
        "difficulty": "Medium",
        "topic": "Pointers & Heap DP",
        "frequency": "94% in Goldman Sachs Screening",
        "context": "Prime factor decomposition sequencing",
        "fnName": "solve",
        "params": [
            {
                "name": "n",
                "type": "int"
            }
        ],
        "returnType": "int",
        "description": "An ugly number is a positive integer whose prime factors are limited to 2, 3, and 5. Return the `n`-th ugly number (1 is the first ugly number).",
        "constraints": [
            "1 <= n <= 1690"
        ],
        "hint": "Three pointers p2, p3, p5 multiplying ugly sequence.",
        "starter": {
            "python": "def solve(n):\n    # Write your logic here\n    return 0",
            "javascript": "function solve(n) {\n    // Write your logic here\n    return 0;\n}"
        },
        "solution": {
            "python": "def solve(n):\n    ugly = [1] * n\n    i2 = i3 = i5 = 0\n    for i in range(1, n):\n        next_val = min(ugly[i2] * 2, ugly[i3] * 3, ugly[i5] * 5)\n        ugly[i] = next_val\n        if next_val == ugly[i2] * 2: i2 += 1\n        if next_val == ugly[i3] * 3: i3 += 1\n        if next_val == ugly[i5] * 5: i5 += 1\n    return ugly[-1]",
            "javascript": "function solve(n) {\n    const ugly = new Array(n).fill(1);\n    let i2 = 0, i3 = 0, i5 = 0;\n    for (let i = 1; i < n; i++) {\n        const nextVal = Math.min(ugly[i2] * 2, ugly[i3] * 3, ugly[i5] * 5);\n        ugly[i] = nextVal;\n        if (nextVal === ugly[i2] * 2) i2++;\n        if (nextVal === ugly[i3] * 3) i3++;\n        if (nextVal === ugly[i5] * 5) i5++;\n    }\n    return ugly[n - 1];\n}"
        },
        "testCases": [
            {
                "args": [
                    10
                ],
                "expected": 12,
                "isHidden": false
            },
            {
                "args": [
                    1
                ],
                "expected": 1,
                "isHidden": false
            }
        ]
    }
];
