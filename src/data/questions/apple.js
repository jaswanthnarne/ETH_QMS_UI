export const APPLE_QUESTIONS = [
    {
        id: 'appl-1',
        company: 'apple',
        category: 'product',
        number: 1,
        title: 'Three Sum Zero Triplets Count',
        difficulty: 'Medium',
        topic: 'Two Pointers',
        frequency: '95% in Apple SWE Interview',
        context: 'Balancing zero-net audio frequency offsets',
        fnName: 'solve',
        params: [{ name: 'nums', type: 'int[]' }],
        returnType: 'int[][]',
        description: 'Given an integer array `nums`, return all unique triplets `[nums[i], nums[j], nums[k]]` sorted in ascending order such that `i != j != k` and `nums[i] + nums[j] + nums[k] == 0`.',
        constraints: ['3 <= nums.length <= 3000'],
        hint: 'Sort the array, fix nums[i], and use two pointers on the suffix while skipping duplicate values.',
        starter: {
            python: 'def solve(nums):\n    # Write your logic here\n    return []',
            javascript: 'function solve(nums) {\n    // Write your logic here\n    return [];\n}'
        },
        solution: {
            python: 'def solve(nums):\n    a = sorted(nums)\n    res = []\n    for i in range(len(a) - 2):\n        if i > 0 and a[i] == a[i - 1]: continue\n        l, r = i + 1, len(a) - 1\n        while l < r:\n            s = a[i] + a[l] + a[r]\n            if s == 0:\n                res.append([a[i], a[l], a[r]])\n                l += 1; r -= 1\n                while l < r and a[l] == a[l - 1]: l += 1\n                while l < r and a[r] == a[r + 1]: r -= 1\n            elif s < 0: l += 1\n            else: r -= 1\n    return res',
            javascript: 'function solve(nums) {\n    const a = [...nums].sort((x, y) => x - y);\n    const res = [];\n    for (let i = 0; i < a.length - 2; i++) {\n        if (i > 0 && a[i] === a[i - 1]) continue;\n        let l = i + 1, r = a.length - 1;\n        while (l < r) {\n            const s = a[i] + a[l] + a[r];\n            if (s === 0) {\n                res.push([a[i], a[l], a[r]]);\n                l++; r--;\n                while (l < r && a[l] === a[l - 1]) l++;\n                while (l < r && a[r] === a[r + 1]) r--;\n            } else if (s < 0) l++;\n            else r--;\n        }\n    }\n    return res;\n}'
        },
        testCases: [
            { args: [[-1, 0, 1, 2, -1, -4]], expected: [[-1, -1, 2], [-1, 0, 1]], isHidden: false },
            { args: [[0, 1, 1]], expected: [], isHidden: false },
            { args: [[0, 0, 0]], expected: [[0, 0, 0]], isHidden: true }
        ]
    },
    {
        id: 'appl-2',
        company: 'apple',
        category: 'product',
        number: 2,
        title: 'Best Time to Buy and Sell Stock II (Multi-Trade)',
        difficulty: 'Medium',
        topic: 'Greedy',
        frequency: '92% in Apple Core OS Round',
        context: 'Optimizing multi-cycle power-state switching gains',
        fnName: 'solve',
        params: [{ name: 'prices', type: 'int[]' }],
        returnType: 'int',
        description: 'Given an array `prices` where `prices[i]` is the price on day `i`, you may complete as many buy/sell transactions as you like (holding at most 1 share at a time). Return the maximum total profit.',
        constraints: ['1 <= prices.length <= 3 * 10^4'],
        hint: 'Sum every positive day-over-day increase: max(0, prices[i] - prices[i - 1]).',
        starter: {
            python: 'def solve(prices):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(prices) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(prices):\n    return sum(max(0, prices[i] - prices[i - 1]) for i in range(1, len(prices)))',
            javascript: 'function solve(prices) {\n    let profit = 0;\n    for (let i = 1; i < prices.length; i++) {\n        if (prices[i] > prices[i - 1]) profit += prices[i] - prices[i - 1];\n    }\n    return profit;\n}'
        },
        testCases: [
            { args: [[7, 1, 5, 3, 6, 4]], expected: 7, isHidden: false },
            { args: [[1, 2, 3, 4, 5]], expected: 4, isHidden: false },
            { args: [[7, 6, 4, 3, 1]], expected: 0, isHidden: true }
        ]
    },
    {
        id: 'appl-3',
        company: 'apple',
        category: 'product',
        number: 3,
        title: 'Search a 2D Sorted Matrix',
        difficulty: 'Medium',
        topic: 'Binary Search',
        frequency: '91% in Apple iOS Systems Round',
        context: 'Lookup in sorted Metal shader texture tables',
        fnName: 'solve',
        params: [{ name: 'matrix', type: 'int[][]' }, { name: 'target', type: 'int' }],
        returnType: 'boolean',
        description: 'Each row of the `m x n` `matrix` is sorted in non-decreasing order, and the first integer of each row is greater than the last integer of the previous row. Return `true` if `target` is in `matrix`.',
        constraints: ['1 <= m, n <= 100'],
        hint: 'Treat the m x n matrix as a flattened sorted array of length m * n and run binary search.',
        starter: {
            python: 'def solve(matrix, target):\n    # Write your logic here\n    return False',
            javascript: 'function solve(matrix, target) {\n    // Write your logic here\n    return false;\n}'
        },
        solution: {
            python: 'def solve(matrix, target):\n    m, n = len(matrix), len(matrix[0])\n    lo, hi = 0, m * n - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        val = matrix[mid // n][mid % n]\n        if val == target: return True\n        if val < target: lo = mid + 1\n        else: hi = mid - 1\n    return False',
            javascript: 'function solve(matrix, target) {\n    const m = matrix.length, n = matrix[0].length;\n    let lo = 0, hi = m * n - 1;\n    while (lo <= hi) {\n        const mid = (lo + hi) >> 1;\n        const val = matrix[Math.floor(mid / n)][mid % n];\n        if (val === target) return true;\n        if (val < target) lo = mid + 1;\n        else hi = mid - 1;\n    }\n    return false;\n}'
        },
        testCases: [
            { args: [[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 3], expected: true, isHidden: false },
            { args: [[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 13], expected: false, isHidden: false },
            { args: [[[1]], 1], expected: true, isHidden: true }
        ]
    },
    {
        id: 'appl-4',
        company: 'apple',
        category: 'product',
        number: 4,
        title: 'Happy Number Cycle Detection',
        difficulty: 'Easy',
        topic: 'Hash Set & Math',
        frequency: '89% in Apple Screening',
        context: 'Detecting termination vs infinite cycle in state hashes',
        fnName: 'solve',
        params: [{ name: 'n', type: 'int' }],
        returnType: 'boolean',
        description: 'A happy number is defined by replacing the number by the sum of the squares of its digits repeatedly until it equals 1, or loops endlessly in a cycle not including 1. Return `true` if `n` is happy.',
        constraints: ['1 <= n <= 2^31 - 1'],
        hint: 'Use a seen set (or Floyd fast/slow cycle detection) on the digit-square-sum transition.',
        starter: {
            python: 'def solve(n):\n    # Write your logic here\n    return False',
            javascript: 'function solve(n) {\n    // Write your logic here\n    return false;\n}'
        },
        solution: {
            python: 'def solve(n):\n    seen = set()\n    while n != 1 and n not in seen:\n        seen.add(n)\n        n = sum(int(d) ** 2 for d in str(n))\n    return n == 1',
            javascript: 'function solve(n) {\n    const seen = new Set();\n    while (n !== 1 && !seen.has(n)) {\n        seen.add(n);\n        let next = 0;\n        while (n > 0) { const d = n % 10; next += d * d; n = Math.floor(n / 10); }\n        n = next;\n    }\n    return n === 1;\n}'
        },
        testCases: [
            { args: [19], expected: true, isHidden: false },
            { args: [2], expected: false, isHidden: false },
            { args: [7], expected: true, isHidden: true }
        ]
    },
    {
        id: 'appl-5',
        company: 'apple',
        category: 'product',
        number: 5,
        title: 'Reverse Words in a String Cleanly',
        difficulty: 'Medium',
        topic: 'Strings',
        frequency: '88% in Apple Phone Screen',
        context: 'Normalizing Siri natural language token order',
        fnName: 'solve',
        params: [{ name: 's', type: 'string' }],
        returnType: 'string',
        description: 'Given an input string `s` containing words separated by one or more spaces, return a string of the words in reverse order concatenated by a single space with no leading or trailing spaces.',
        constraints: ['1 <= s.length <= 10^4'],
        hint: 'Trim, split on whitespace filtering empty tokens, reverse, and join with a single space.',
        starter: {
            python: 'def solve(s):\n    # Write your logic here\n    return ""',
            javascript: 'function solve(s) {\n    // Write your logic here\n    return "";\n}'
        },
        solution: {
            python: 'def solve(s):\n    return " ".join(reversed(s.split()))',
            javascript: 'function solve(s) {\n    return s.trim().split(/\\s+/).reverse().join(" ");\n}'
        },
        testCases: [
            { args: ['the sky is blue'], expected: 'blue is sky the', isHidden: false },
            { args: ['  hello world  '], expected: 'world hello', isHidden: false },
            { args: ['a good   example'], expected: 'example good a', isHidden: true }
        ]
    },
    {
        id: 'appl-6',
        company: 'apple',
        category: 'product',
        number: 6,
        title: 'Combination Sum Target',
        difficulty: 'Medium',
        topic: 'Backtracking',
        frequency: '90% in Apple SWE Onsite',
        context: 'Finding distinct memory block combinations for allocation',
        fnName: 'solve',
        params: [{ name: 'candidates', type: 'int[]' }, { name: 'target', type: 'int' }],
        returnType: 'int',
        description: 'Given an array of distinct positive integers `candidates` and a `target` integer, return the total number of unique combinations of `candidates` (each number may be chosen unlimited times) where the chosen numbers sum to `target`.',
        constraints: ['1 <= candidates.length <= 30', '1 <= target <= 40'],
        hint: 'Use DP where outer loop iterates over each candidate c, and inner loop adds dp[t - c] to dp[t] for t from c to target.',
        starter: {
            python: 'def solve(candidates, target):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(candidates, target) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(candidates, target):\n    dp = [0] * (target + 1)\n    dp[0] = 1\n    for c in candidates:\n        for t in range(c, target + 1):\n            dp[t] += dp[t - c]\n    return dp[target]',
            javascript: 'function solve(candidates, target) {\n    const dp = new Array(target + 1).fill(0);\n    dp[0] = 1;\n    for (const c of candidates) {\n        for (let t = c; t <= target; t++) dp[t] += dp[t - c];\n    }\n    return dp[target];\n}'
        },
        testCases: [
            { args: [[2, 3, 6, 7], 7], expected: 2, isHidden: false },
            { args: [[2, 3, 5], 8], expected: 3, isHidden: false },
            { args: [[2], 1], expected: 0, isHidden: true }
        ]
    },
    {
        id: 'appl-7',
        company: 'apple',
        category: 'product',
        number: 7,
        title: 'Jump Game Reachability',
        difficulty: 'Medium',
        topic: 'Greedy',
        frequency: '91% in Apple Screening',
        context: 'Checking buffer jump reachability across memory segments',
        fnName: 'solve',
        params: [{ name: 'nums', type: 'int[]' }],
        returnType: 'boolean',
        description: 'You are given an integer array `nums` where `nums[i]` represents your maximum jump length from index `i`. Starting at index `0`, return `true` if you can reach the last index.',
        constraints: ['1 <= nums.length <= 10^4'],
        hint: 'Maintain the farthest reachable index as you scan left to right.',
        starter: {
            python: 'def solve(nums):\n    # Write your logic here\n    return False',
            javascript: 'function solve(nums) {\n    // Write your logic here\n    return false;\n}'
        },
        solution: {
            python: 'def solve(nums):\n    reach = 0\n    for i, jump in enumerate(nums):\n        if i > reach: return False\n        reach = max(reach, i + jump)\n    return True',
            javascript: 'function solve(nums) {\n    let reach = 0;\n    for (let i = 0; i < nums.length; i++) {\n        if (i > reach) return false;\n        reach = Math.max(reach, i + nums[i]);\n    }\n    return true;\n}'
        },
        testCases: [
            { args: [[2, 3, 1, 1, 4]], expected: true, isHidden: false },
            { args: [[3, 2, 1, 0, 4]], expected: false, isHidden: false },
            { args: [[0]], expected: true, isHidden: true }
        ]
    },
    {
        id: 'appl-8',
        company: 'apple',
        category: 'product',
        number: 8,
        title: 'Integer to Roman Numeral',
        difficulty: 'Medium',
        topic: 'Greedy & Math',
        frequency: '87% in Apple Coding Round',
        context: 'Formatting version numbers and chapter markers',
        fnName: 'solve',
        params: [{ name: 'num', type: 'int' }],
        returnType: 'string',
        description: 'Given an integer `num` between 1 and 3999, convert it to a Roman numeral string.',
        constraints: ['1 <= num <= 3999'],
        hint: 'Greedily subtract the largest matching (value, symbol) pair including subtractive forms like 900 ("CM") and 4 ("IV").',
        starter: {
            python: 'def solve(num):\n    # Write your logic here\n    return ""',
            javascript: 'function solve(num) {\n    // Write your logic here\n    return "";\n}'
        },
        solution: {
            python: 'def solve(num):\n    vals = [(1000,"M"),(900,"CM"),(500,"D"),(400,"CD"),(100,"C"),(90,"XC"),(50,"L"),(40,"XL"),(10,"X"),(9,"IX"),(5,"V"),(4,"IV"),(1,"I")]\n    res = []\n    for v, sym in vals:\n        while num >= v:\n            res.append(sym)\n            num -= v\n    return "".join(res)',
            javascript: 'function solve(num) {\n    const vals = [[1000,"M"],[900,"CM"],[500,"D"],[400,"CD"],[100,"C"],[90,"XC"],[50,"L"],[40,"XL"],[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"]];\n    let res = "";\n    for (const [v, sym] of vals) {\n        while (num >= v) { res += sym; num -= v; }\n    }\n    return res;\n}'
        },
        testCases: [
            { args: [3749], expected: 'MMMDCCXLIX', isHidden: false },
            { args: [58], expected: 'LVIII', isHidden: false },
            { args: [1994], expected: 'MCMXCIV', isHidden: true }
        ]
    },
    {
        id: 'appl-9',
        company: 'apple',
        category: 'product',
        number: 9,
        title: 'Spiral Matrix Generator N x N',
        difficulty: 'Medium',
        topic: 'Matrix Simulation',
        frequency: '89% in Apple Core Graphics',
        context: 'Generating spiral pixel traversal lookup tables',
        fnName: 'solve',
        params: [{ name: 'n', type: 'int' }],
        returnType: 'int[][]',
        description: 'Given a positive integer `n`, generate an `n x n` matrix filled with elements from `1` to `n^2` in clockwise spiral order.',
        constraints: ['1 <= n <= 20'],
        hint: 'Maintain top, bottom, left, right boundaries and shrink each boundary after filling that edge.',
        starter: {
            python: 'def solve(n):\n    # Write your logic here\n    return []',
            javascript: 'function solve(n) {\n    // Write your logic here\n    return [];\n}'
        },
        solution: {
            python: 'def solve(n):\n    mat = [[0] * n for _ in range(n)]\n    top, bot, left, right = 0, n - 1, 0, n - 1\n    num = 1\n    while top <= bot and left <= right:\n        for c in range(left, right + 1): mat[top][c] = num; num += 1\n        top += 1\n        for r in range(top, bot + 1): mat[r][right] = num; num += 1\n        right -= 1\n        if top <= bot:\n            for c in range(right, left - 1, -1): mat[bot][c] = num; num += 1\n            bot -= 1\n        if left <= right:\n            for r in range(bot, top - 1, -1): mat[r][left] = num; num += 1\n            left += 1\n    return mat',
            javascript: 'function solve(n) {\n    const mat = Array.from({ length: n }, () => new Array(n).fill(0));\n    let top = 0, bot = n - 1, left = 0, right = n - 1, num = 1;\n    while (top <= bot && left <= right) {\n        for (let c = left; c <= right; c++) mat[top][c] = num++;\n        top++;\n        for (let r = top; r <= bot; r++) mat[r][right] = num++;\n        right--;\n        if (top <= bot) { for (let c = right; c >= left; c--) mat[bot][c] = num++; bot--; }\n        if (left <= right) { for (let r = bot; r >= top; r--) mat[r][left] = num++; left++; }\n    }\n    return mat;\n}'
        },
        testCases: [
            { args: [3], expected: [[1, 2, 3], [8, 9, 4], [7, 6, 5]], isHidden: false },
            { args: [1], expected: [[1]], isHidden: false },
            { args: [2], expected: [[1, 2], [4, 3]], isHidden: true }
        ]
    },
    {
        id: 'appl-10',
        company: 'apple',
        category: 'product',
        number: 10,
        title: 'Counting Bits for 0 to N',
        difficulty: 'Easy',
        topic: 'Bit Manipulation & DP',
        frequency: '86% in Apple Silicon Firmware',
        context: 'Precomputing popcount masks for hardware registers',
        fnName: 'solve',
        params: [{ name: 'n', type: 'int' }],
        returnType: 'int[]',
        description: 'Given an integer `n`, return an array `ans` of length `n + 1` such that `ans[i]` is the number of `1`s in the binary representation of `i`.',
        constraints: ['0 <= n <= 10^5'],
        hint: 'Use DP relation: dp[i] = dp[i >> 1] + (i & 1).',
        starter: {
            python: 'def solve(n):\n    # Write your logic here\n    return []',
            javascript: 'function solve(n) {\n    // Write your logic here\n    return [];\n}'
        },
        solution: {
            python: 'def solve(n):\n    dp = [0] * (n + 1)\n    for i in range(1, n + 1):\n        dp[i] = dp[i >> 1] + (i & 1)\n    return dp',
            javascript: 'function solve(n) {\n    const dp = new Array(n + 1).fill(0);\n    for (let i = 1; i <= n; i++) dp[i] = dp[i >> 1] + (i & 1);\n    return dp;\n}'
        },
        testCases: [
            { args: [2], expected: [0, 1, 1], isHidden: false },
            { args: [5], expected: [0, 1, 1, 2, 1, 2], isHidden: false },
            { args: [0], expected: [0], isHidden: true }
        ]
    },
    {
        id: 'appl-11',
        company: 'apple',
        category: 'product',
        number: 11,
        title: 'Minimum Path Sum in Grid',
        difficulty: 'Medium',
        topic: 'Dynamic Programming',
        frequency: '90% in Apple SWE Interview',
        context: 'Minimizing thermal energy cost across chip layout grid',
        fnName: 'solve',
        params: [{ name: 'grid', type: 'int[][]' }],
        returnType: 'int',
        description: 'Given an `m x n` `grid` filled with non-negative numbers, find a path from top-left to bottom-right (moving only down or right) that minimizes the sum of all numbers along its path.',
        constraints: ['1 <= m, n <= 200'],
        hint: 'dp[r][c] = grid[r][c] + min(dp[r-1][c], dp[r][c-1]).',
        starter: {
            python: 'def solve(grid):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(grid) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(grid):\n    m, n = len(grid), len(grid[0])\n    dp = [row[:] for row in grid]\n    for r in range(m):\n        for c in range(n):\n            if r == 0 and c == 0: continue\n            up = dp[r - 1][c] if r > 0 else float("inf")\n            left = dp[r][c - 1] if c > 0 else float("inf")\n            dp[r][c] += min(up, left)\n    return dp[-1][-1]',
            javascript: 'function solve(grid) {\n    const m = grid.length, n = grid[0].length;\n    const dp = grid.map(r => [...r]);\n    for (let r = 0; r < m; r++) {\n        for (let c = 0; c < n; c++) {\n            if (r === 0 && c === 0) continue;\n            const up = r > 0 ? dp[r - 1][c] : Infinity;\n            const left = c > 0 ? dp[r][c - 1] : Infinity;\n            dp[r][c] += Math.min(up, left);\n        }\n    }\n    return dp[m - 1][n - 1];\n}'
        },
        testCases: [
            { args: [[[1, 3, 1], [1, 5, 1], [4, 2, 1]]], expected: 7, isHidden: false },
            { args: [[[1, 2, 3], [4, 5, 6]]], expected: 12, isHidden: false },
            { args: [[[5]]], expected: 5, isHidden: true }
        ]
    },
    {
        id: 'appl-12',
        company: 'apple',
        category: 'product',
        number: 12,
        title: 'Valid Triangle Number',
        difficulty: 'Medium',
        topic: 'Two Pointers & Sorting',
        frequency: '86% in Apple Geometry Round',
        context: 'Counting valid mesh triangle edge triplets',
        fnName: 'solve',
        params: [{ name: 'nums', type: 'int[]' }],
        returnType: 'int',
        description: 'Given an integer array `nums`, return the number of triplets chosen from the array that can form triangles if we take them as side lengths.',
        constraints: ['1 <= nums.length <= 1000'],
        hint: 'Sort nums. Fix largest side k from n-1 down to 2, then use two pointers l=0, r=k-1: if nums[l]+nums[r] > nums[k], add (r - l) and r--.',
        starter: {
            python: 'def solve(nums):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(nums) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(nums):\n    a = sorted(nums)\n    ans = 0\n    for k in range(len(a) - 1, 1, -1):\n        l, r = 0, k - 1\n        while l < r:\n            if a[l] + a[r] > a[k]:\n                ans += r - l\n                r -= 1\n            else:\n                l += 1\n    return ans',
            javascript: 'function solve(nums) {\n    const a = [...nums].sort((x, y) => x - y);\n    let ans = 0;\n    for (let k = a.length - 1; k >= 2; k--) {\n        let l = 0, r = k - 1;\n        while (l < r) {\n            if (a[l] + a[r] > a[k]) { ans += r - l; r--; }\n            else l++;\n        }\n    }\n    return ans;\n}'
        },
        testCases: [
            { args: [[2, 2, 3, 4]], expected: 3, isHidden: false },
            { args: [[4, 2, 3, 4]], expected: 4, isHidden: false },
            { args: [[0, 0, 0]], expected: 0, isHidden: true }
        ]
    },
    {
        id: 'appl-13',
        company: 'apple',
        category: 'product',
        number: 13,
        title: 'Isomorphic Strings Check',
        difficulty: 'Easy',
        topic: 'Hash Map',
        frequency: '85% in Apple Phone Screen',
        context: 'Verifying bijection between UI localization keys',
        fnName: 'solve',
        params: [{ name: 's', type: 'string' }, { name: 't', type: 'string' }],
        returnType: 'boolean',
        description: 'Given two strings `s` and `t`, return `true` if they are isomorphic (characters in `s` can be replaced one-to-one with characters in `t` preserving order).',
        constraints: ['1 <= s.length == t.length <= 5 * 10^4'],
        hint: 'Maintain two maps: s->t and t->s to enforce a strict bijection.',
        starter: {
            python: 'def solve(s, t):\n    # Write your logic here\n    return False',
            javascript: 'function solve(s, t) {\n    // Write your logic here\n    return false;\n}'
        },
        solution: {
            python: 'def solve(s, t):\n    if len(s) != len(t): return False\n    m1, m2 = {}, {}\n    for a, b in zip(s, t):\n        if m1.get(a, b) != b or m2.get(b, a) != a:\n            return False\n        m1[a] = b\n        m2[b] = a\n    return True',
            javascript: 'function solve(s, t) {\n    if (s.length !== t.length) return false;\n    const m1 = new Map(), m2 = new Map();\n    for (let i = 0; i < s.length; i++) {\n        if ((m1.has(s[i]) && m1.get(s[i]) !== t[i]) || (m2.has(t[i]) && m2.get(t[i]) !== s[i])) return false;\n        m1.set(s[i], t[i]);\n        m2.set(t[i], s[i]);\n    }\n    return true;\n}'
        },
        testCases: [
            { args: ['egg', 'add'], expected: true, isHidden: false },
            { args: ['foo', 'bar'], expected: false, isHidden: false },
            { args: ['paper', 'title'], expected: true, isHidden: true }
        ]
    },
    {
        id: 'appl-14',
        company: 'apple',
        category: 'product',
        number: 14,
        title: 'Task Scheduler Minimum Intervals',
        difficulty: 'Medium',
        topic: 'Greedy & Counting',
        frequency: '93% in Apple Kernel Scheduling',
        context: 'CPU task cooldown scheduling without idle waste',
        fnName: 'solve',
        params: [{ name: 'tasks', type: 'string[]' }, { name: 'n', type: 'int' }],
        returnType: 'int',
        description: 'Given a list of CPU `tasks` and a cooldown `n` between two identical tasks, return the minimum number of intervals required to finish all tasks.',
        constraints: ['1 <= tasks.length <= 10^4', '0 <= n <= 100'],
        hint: 'Formula: max(len(tasks), (maxFreq - 1) * (n + 1) + countOfMaxFreq).',
        starter: {
            python: 'def solve(tasks, n):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(tasks, n) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(tasks, n):\n    from collections import Counter\n    counts = Counter(tasks).values()\n    max_f = max(counts)\n    max_cnt = sum(1 for c in counts if c == max_f)\n    return max(len(tasks), (max_f - 1) * (n + 1) + max_cnt)',
            javascript: 'function solve(tasks, n) {\n    const map = new Map();\n    for (const t of tasks) map.set(t, (map.get(t) || 0) + 1);\n    const counts = [...map.values()];\n    const maxF = Math.max(...counts);\n    const maxCnt = counts.filter(c => c === maxF).length;\n    return Math.max(tasks.length, (maxF - 1) * (n + 1) + maxCnt);\n}'
        },
        testCases: [
            { args: [['A', 'A', 'A', 'B', 'B', 'B'], 2], expected: 8, isHidden: false },
            { args: [['A', 'C', 'A', 'B', 'D', 'B'], 1], expected: 6, isHidden: false },
            { args: [['A', 'A', 'A', 'B', 'B', 'B'], 0], expected: 6, isHidden: true }
        ]
    },
    {
        id: 'appl-15',
        company: 'apple',
        category: 'product',
        number: 15,
        title: 'Single Number II (Appears Thrice Except One)',
        difficulty: 'Medium',
        topic: 'Bit Manipulation',
        frequency: '86% in Apple Embedded Systems',
        context: 'Hardware ECC triple-redundancy error detection',
        fnName: 'solve',
        params: [{ name: 'nums', type: 'int[]' }],
        returnType: 'int',
        description: 'Given an integer array `nums` where every element appears three times except for one element which appears exactly once, find and return that single element.',
        constraints: ['1 <= nums.length <= 3 * 10^4'],
        hint: 'Track bits seen once and twice using bitmasks: ones = (ones ^ x) & ~twos; twos = (twos ^ x) & ~ones.',
        starter: {
            python: 'def solve(nums):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(nums) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(nums):\n    ones = twos = 0\n    for x in nums:\n        ones = (ones ^ x) & ~twos\n        twos = (twos ^ x) & ~ones\n    return ones',
            javascript: 'function solve(nums) {\n    let ones = 0, twos = 0;\n    for (const x of nums) {\n        ones = (ones ^ x) & ~twos;\n        twos = (twos ^ x) & ~ones;\n    }\n    return ones;\n}'
        },
        testCases: [
            { args: [[2, 2, 3, 2]], expected: 3, isHidden: false },
            { args: [[0, 1, 0, 1, 0, 1, 99]], expected: 99, isHidden: false },
            { args: [[-2, -2, 1, -2]], expected: 1, isHidden: true }
        ]
    },
    {
        id: 'appl-16',
        company: 'apple',
        category: 'product',
        number: 16,
        title: 'Minimum Genetic Mutation Steps',
        difficulty: 'Medium',
        topic: 'BFS Graph',
        frequency: '84% in Apple HealthKit Team',
        context: 'Shortest mutation path between two DNA sequence strings',
        fnName: 'solve',
        params: [{ name: 'startGene', type: 'string' }, { name: 'endGene', type: 'string' }, { name: 'bank', type: 'string[]' }],
        returnType: 'int',
        description: 'Each gene string has length 8 with characters from `A`, `C`, `G`, `T`. One mutation changes a single character and the resulting string must be in `bank`. Return the minimum mutations needed to transform `startGene` into `endGene`, or `-1` if impossible.',
        constraints: ['0 <= bank.length <= 10'],
        hint: 'Run BFS from startGene trying single-character substitutions that exist in the bank set.',
        starter: {
            python: 'def solve(startGene, endGene, bank):\n    # Write your logic here\n    return -1',
            javascript: 'function solve(startGene, endGene, bank) {\n    // Write your logic here\n    return -1;\n}'
        },
        solution: {
            python: 'def solve(startGene, endGene, bank):\n    from collections import deque\n    bset = set(bank)\n    if endGene not in bset: return -1\n    q = deque([(startGene, 0)])\n    vis = {startGene}\n    while q:\n        curr, steps = q.popleft()\n        if curr == endGene: return steps\n        for i in range(8):\n            for ch in "ACGT":\n                nxt = curr[:i] + ch + curr[i+1:]\n                if nxt in bset and nxt not in vis:\n                    vis.add(nxt)\n                    q.append((nxt, steps + 1))\n    return -1',
            javascript: 'function solve(startGene, endGene, bank) {\n    const bset = new Set(bank);\n    if (!bset.has(endGene)) return -1;\n    const q = [[startGene, 0]], vis = new Set([startGene]);\n    while (q.length) {\n        const [curr, steps] = q.shift();\n        if (curr === endGene) return steps;\n        for (let i = 0; i < 8; i++) {\n            for (const ch of "ACGT") {\n                const nxt = curr.slice(0, i) + ch + curr.slice(i + 1);\n                if (bset.has(nxt) && !vis.has(nxt)) { vis.add(nxt); q.push([nxt, steps + 1]); }\n            }\n        }\n    }\n    return -1;\n}'
        },
        testCases: [
            { args: ['AACCGGTT', 'AACCGGTA', ['AACCGGTA']], expected: 1, isHidden: false },
            { args: ['AACCGGTT', 'AAACGGTA', ['AACCGGTA', 'AACCGCTA', 'AAACGGTA']], expected: 2, isHidden: false },
            { args: ['AACCGGTT', 'AACCGGTA', []], expected: -1, isHidden: true }
        ]
    },
    {
        id: 'appl-17',
        company: 'apple',
        category: 'product',
        number: 17,
        title: 'Summary Ranges Formatting',
        difficulty: 'Easy',
        topic: 'Arrays & Intervals',
        frequency: '87% in Apple Screening',
        context: 'Compressing sorted page indices into range strings',
        fnName: 'solve',
        params: [{ name: 'nums', type: 'int[]' }],
        returnType: 'string[]',
        description: 'Given a sorted unique integer array `nums`, return the smallest sorted list of ranges that cover all numbers exactly (`"a->b"` if `a != b`, or `"a"` if `a == b`).',
        constraints: ['0 <= nums.length <= 20'],
        hint: 'Track the start of each consecutive run and close it when nums[i+1] != nums[i] + 1.',
        starter: {
            python: 'def solve(nums):\n    # Write your logic here\n    return []',
            javascript: 'function solve(nums) {\n    // Write your logic here\n    return [];\n}'
        },
        solution: {
            python: 'def solve(nums):\n    res = []\n    i = 0\n    while i < len(nums):\n        start = nums[i]\n        while i + 1 < len(nums) and nums[i + 1] == nums[i] + 1:\n            i += 1\n        res.append(str(start) if start == nums[i] else f"{start}->{nums[i]}")\n        i += 1\n    return res',
            javascript: 'function solve(nums) {\n    const res = [];\n    for (let i = 0; i < nums.length; i++) {\n        const start = nums[i];\n        while (i + 1 < nums.length && nums[i + 1] === nums[i] + 1) i++;\n        res.push(start === nums[i] ? `${start}` : `${start}->${nums[i]}`);\n    }\n    return res;\n}'
        },
        testCases: [
            { args: [[0, 1, 2, 4, 5, 7]], expected: ['0->2', '4->5', '7'], isHidden: false },
            { args: [[0, 2, 3, 4, 6, 8, 9]], expected: ['0', '2->4', '6', '8->9'], isHidden: false },
            { args: [[]], expected: [], isHidden: true }
        ]
    },
    {
        id: 'appl-18',
        company: 'apple',
        category: 'product',
        number: 18,
        title: 'Longest Palindrome Buildable from Letters',
        difficulty: 'Easy',
        topic: 'Hash Map & Greedy',
        frequency: '85% in Apple Screening',
        context: 'Computing max symmetric key length from character pool',
        fnName: 'solve',
        params: [{ name: 's', type: 'string' }],
        returnType: 'int',
        description: 'Given a case-sensitive string `s`, return the length of the longest palindrome that can be built using those letters.',
        constraints: ['1 <= s.length <= 2000'],
        hint: 'Add (count // 2) * 2 for every character, plus 1 if any character has an odd count.',
        starter: {
            python: 'def solve(s):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(s) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(s):\n    from collections import Counter\n    cnt = Counter(s)\n    length = sum((v // 2) * 2 for v in cnt.values())\n    return length + 1 if any(v % 2 == 1 for v in cnt.values()) else length',
            javascript: 'function solve(s) {\n    const cnt = new Map();\n    for (const ch of s) cnt.set(ch, (cnt.get(ch) || 0) + 1);\n    let len = 0, hasOdd = false;\n    for (const v of cnt.values()) {\n        len += Math.floor(v / 2) * 2;\n        if (v % 2 === 1) hasOdd = true;\n    }\n    return hasOdd ? len + 1 : len;\n}'
        },
        testCases: [
            { args: ['abccccdd'], expected: 7, isHidden: false },
            { args: ['a'], expected: 1, isHidden: false },
            { args: ['bb'], expected: 2, isHidden: true }
        ]
    },
    {
        id: 'appl-19',
        company: 'apple',
        category: 'product',
        number: 19,
        title: 'Degree of an Array Shortest Subarray',
        difficulty: 'Easy',
        topic: 'Hash Map',
        frequency: '88% in Apple OA',
        context: 'Finding tightest frame slice preserving peak frequency',
        fnName: 'solve',
        params: [{ name: 'nums', type: 'int[]' }],
        returnType: 'int',
        description: 'The degree of an array is the maximum frequency of any of its elements. Return the smallest possible length of a contiguous subarray of `nums` that has the same degree as `nums`.',
        constraints: ['1 <= nums.length <= 50000'],
        hint: 'Record first index, last index, and count for each value. Answer is min(last - first + 1) among elements with count == degree.',
        starter: {
            python: 'def solve(nums):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(nums) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(nums):\n    first, last, count = {}, {}, {}\n    for i, x in enumerate(nums):\n        if x not in first: first[x] = i\n        last[x] = i\n        count[x] = count.get(x, 0) + 1\n    deg = max(count.values())\n    return min(last[x] - first[x] + 1 for x, c in count.items() if c == deg)',
            javascript: 'function solve(nums) {\n    const first = new Map(), last = new Map(), count = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const x = nums[i];\n        if (!first.has(x)) first.set(x, i);\n        last.set(x, i);\n        count.set(x, (count.get(x) || 0) + 1);\n    }\n    const deg = Math.max(...count.values());\n    let best = nums.length;\n    for (const [x, c] of count.entries()) {\n        if (c === deg) best = Math.min(best, last.get(x) - first.get(x) + 1);\n    }\n    return best;\n}'
        },
        testCases: [
            { args: [[1, 2, 2, 3, 1]], expected: 2, isHidden: false },
            { args: [[1, 2, 2, 3, 1, 4, 2]], expected: 6, isHidden: false },
            { args: [[1]], expected: 1, isHidden: true }
        ]
    },
    {
        id: 'appl-20',
        company: 'apple',
        category: 'product',
        number: 20,
        title: 'Minimum Time Difference Between Clocks',
        difficulty: 'Medium',
        topic: 'Sorting & Strings',
        frequency: '87% in Apple WatchOS Round',
        context: 'Computing shortest gap between scheduled alarm timestamps',
        fnName: 'solve',
        params: [{ name: 'timePoints', type: 'string[]' }],
        returnType: 'int',
        description: 'Given a list of 24-hour clock time points in `"HH:MM"` format, return the minimum minutes difference between any two time-points in the list (accounting for midnight wrap-around).',
        constraints: ['2 <= timePoints.length <= 2 * 10^4'],
        hint: 'Convert each HH:MM to minutes [0, 1439], sort them, check adjacent diffs and wrap-around (1440 + mins[0] - mins[-1]).',
        starter: {
            python: 'def solve(timePoints):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(timePoints) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(timePoints):\n    mins = sorted(int(t[:2]) * 60 + int(t[3:]) for t in timePoints)\n    best = 1440 + mins[0] - mins[-1]\n    for i in range(1, len(mins)):\n        best = min(best, mins[i] - mins[i - 1])\n    return best',
            javascript: 'function solve(timePoints) {\n    const mins = timePoints.map(t => Number(t.slice(0, 2)) * 60 + Number(t.slice(3))).sort((a, b) => a - b);\n    let best = 1440 + mins[0] - mins[mins.length - 1];\n    for (let i = 1; i < mins.length; i++) best = Math.min(best, mins[i] - mins[i - 1]);\n    return best;\n}'
        },
        testCases: [
            { args: [['23:59', '00:00']], expected: 1, isHidden: false },
            { args: [['00:00', '23:59', '00:00']], expected: 0, isHidden: false },
            { args: [['01:01', '02:01', '03:00']], expected: 59, isHidden: true }
        ]
    }
];

