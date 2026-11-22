export const ADOBE_QUESTIONS = [
    {
        id: 'adbe-1',
        company: 'adobe',
        category: 'product',
        number: 1,
        title: 'Minimum Platforms Required for Railway Station',
        difficulty: 'Medium',
        topic: 'Sorting & Two Pointers',
        frequency: '97% in Adobe India MTS/SDE OA',
        context: 'Allocating minimum render nodes for overlapping job schedules',
        fnName: 'solve',
        params: [{ name: 'arr', type: 'int[]' }, { name: 'dep', type: 'int[]' }],
        returnType: 'int',
        description: 'Given arrival and departure times of all trains (in 24h integer format like `900`, `940`), find the minimum number of platforms required at the station so that no train waits.',
        constraints: ['1 <= arr.length == dep.length <= 5 * 10^4'],
        hint: 'Sort arrivals and departures separately, then use two pointers to track concurrent trains.',
        starter: {
            python: 'def solve(arr, dep):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(arr, dep) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(arr, dep):\n    a = sorted(arr)\n    d = sorted(dep)\n    i = j = cur = ans = 0\n    while i < len(a):\n        if a[i] <= d[j]:\n            cur += 1; ans = max(ans, cur); i += 1\n        else:\n            cur -= 1; j += 1\n    return ans',
            javascript: 'function solve(arr, dep) {\n    const a = [...arr].sort((x, y) => x - y);\n    const d = [...dep].sort((x, y) => x - y);\n    let i = 0, j = 0, cur = 0, ans = 0;\n    while (i < a.length) {\n        if (a[i] <= d[j]) { cur++; ans = Math.max(ans, cur); i++; }\n        else { cur--; j++; }\n    }\n    return ans;\n}'
        },
        testCases: [
            { args: [[900, 940, 950, 1100, 1500, 1800], [910, 1200, 1120, 1130, 1900, 2000]], expected: 3, isHidden: false },
            { args: [[900, 1100, 1235], [1000, 1200, 1240]], expected: 1, isHidden: false },
            { args: [[900, 900], [910, 910]], expected: 2, isHidden: true }
        ]
    },
    {
        id: 'adbe-2',
        company: 'adobe',
        category: 'product',
        number: 2,
        title: 'Find Missing and Repeating Number',
        difficulty: 'Medium',
        topic: 'Math & Bitwise',
        frequency: '95% in Adobe Campus Drive',
        context: 'Detecting corrupted duplicate and dropped frame ID in 1..N sequence',
        fnName: 'solve',
        params: [{ name: 'nums', type: 'int[]' }],
        returnType: 'int[]',
        description: 'Given an unsorted array of size `n` containing integers from `1` to `n`, one number `A` occurs twice and one number `B` is missing. Return `[repeating, missing]`.',
        constraints: ['2 <= nums.length <= 10^5'],
        hint: 'Use difference of expected sum and sum of squares, or mark visited indices negative.',
        starter: {
            python: 'def solve(nums):\n    # Write your logic here\n    return []',
            javascript: 'function solve(nums) {\n    // Write your logic here\n    return [];\n}'
        },
        solution: {
            python: 'def solve(nums):\n    n = len(nums)\n    s = sum(nums) - n * (n + 1) // 2\n    sq = sum(x * x for x in nums) - n * (n + 1) * (2 * n + 1) // 6\n    add = sq // s\n    rep = (s + add) // 2\n    mis = rep - s\n    return [rep, mis]',
            javascript: 'function solve(nums) {\n    const seen = new Set();\n    let rep = 0, sum = 0;\n    for (const x of nums) {\n        if (seen.has(x)) rep = x;\n        seen.add(x);\n        sum += x;\n    }\n    const n = nums.length;\n    const mis = (n * (n + 1)) / 2 - (sum - rep);\n    return [rep, mis];\n}'
        },
        testCases: [
            { args: [[3, 1, 2, 5, 3]], expected: [3, 4], isHidden: false },
            { args: [[2, 2]], expected: [2, 1], isHidden: false },
            { args: [[4, 3, 6, 2, 1, 1]], expected: [1, 5], isHidden: true }
        ]
    },
    {
        id: 'adbe-3',
        company: 'adobe',
        category: 'product',
        number: 3,
        title: 'Count Primes Strictly Less Than N',
        difficulty: 'Medium',
        topic: 'Number Theory (Sieve)',
        frequency: '92% in Adobe MTS Coding',
        context: 'Generating prime hash table capacities below threshold N',
        fnName: 'solve',
        params: [{ name: 'n', type: 'int' }],
        returnType: 'int',
        description: 'Given an integer `n`, return the number of prime numbers that are strictly less than `n`.',
        constraints: ['0 <= n <= 5 * 10^6'],
        hint: 'Use the Sieve of Eratosthenes up to sqrt(n).',
        starter: {
            python: 'def solve(n):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(n) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(n):\n    if n <= 2: return 0\n    is_p = [True] * n\n    is_p[0] = is_p[1] = False\n    i = 2\n    while i * i < n:\n        if is_p[i]:\n            for j in range(i * i, n, i): is_p[j] = False\n        i += 1\n    return sum(is_p)',
            javascript: 'function solve(n) {\n    if (n <= 2) return 0;\n    const isP = new Uint8Array(n).fill(1);\n    isP[0] = 0; isP[1] = 0;\n    for (let i = 2; i * i < n; i++) {\n        if (isP[i]) for (let j = i * i; j < n; j += i) isP[j] = 0;\n    }\n    let cnt = 0;\n    for (let i = 2; i < n; i++) cnt += isP[i];\n    return cnt;\n}'
        },
        testCases: [
            { args: [10], expected: 4, isHidden: false },
            { args: [0], expected: 0, isHidden: false },
            { args: [100], expected: 25, isHidden: true }
        ]
    },
    {
        id: 'adbe-4',
        company: 'adobe',
        category: 'product',
        number: 4,
        title: 'Celebrity Problem in Party Matrix',
        difficulty: 'Medium',
        topic: 'Two Pointers / Graph',
        frequency: '94% in Adobe Technical Interview',
        context: 'Identifying a universal root service known by all but calling none',
        fnName: 'solve',
        params: [{ name: 'mat', type: 'int[][]' }],
        returnType: 'int',
        description: 'In a matrix `mat` of size `n x n`, `mat[i][j] == 1` means person `i` knows person `j`. A celebrity is known by everyone else (`n - 1` people) and knows nobody (`0` people). Return the celebrity index, or `-1` if none exists.',
        constraints: ['1 <= n <= 1000'],
        hint: 'Use two pointers a = 0, b = n - 1: if a knows b, a cannot be celebrity (a++); else b--. Verify the final candidate.',
        starter: {
            python: 'def solve(mat):\n    # Write your logic here\n    return -1',
            javascript: 'function solve(mat) {\n    // Write your logic here\n    return -1;\n}'
        },
        solution: {
            python: 'def solve(mat):\n    n = len(mat)\n    a, b = 0, n - 1\n    while a < b:\n        if mat[a][b] == 1: a += 1\n        else: b -= 1\n    for i in range(n):\n        if i != a and (mat[a][i] == 1 or mat[i][a] == 0):\n            return -1\n    return a',
            javascript: 'function solve(mat) {\n    const n = mat.length;\n    let a = 0, b = n - 1;\n    while (a < b) {\n        if (mat[a][b] === 1) a++;\n        else b--;\n    }\n    for (let i = 0; i < n; i++) {\n        if (i !== a && (mat[a][i] === 1 || mat[i][a] === 0)) return -1;\n    }\n    return a;\n}'
        },
        testCases: [
            { args: [[[0, 1, 0], [0, 0, 0], [0, 1, 0]]], expected: 1, isHidden: false },
            { args: [[[0, 1], [1, 0]]], expected: -1, isHidden: false },
            { args: [[[0]]], expected: 0, isHidden: true }
        ]
    },
    {
        id: 'adbe-5',
        company: 'adobe',
        category: 'product',
        number: 5,
        title: 'N-Queens Distinct Solutions Count',
        difficulty: 'Hard',
        topic: 'Backtracking',
        frequency: '91% in Adobe Onsite',
        context: 'Counting non-interfering shader tile placements on N x N canvas',
        fnName: 'solve',
        params: [{ name: 'n', type: 'int' }],
        returnType: 'int',
        description: 'Given an integer `n`, return the total number of distinct solutions to the `n`-queens puzzle where no two queens attack each other.',
        constraints: ['1 <= n <= 10'],
        hint: 'Backtrack row by row tracking occupied columns, (row - col) diagonals, and (row + col) anti-diagonals.',
        starter: {
            python: 'def solve(n):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(n) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(n):\n    cols, d1, d2 = set(), set(), set()\n    def dfs(r):\n        if r == n: return 1\n        ans = 0\n        for c in range(n):\n            if c in cols or (r - c) in d1 or (r + c) in d2: continue\n            cols.add(c); d1.add(r - c); d2.add(r + c)\n            ans += dfs(r + 1)\n            cols.remove(c); d1.remove(r - c); d2.remove(r + c)\n        return ans\n    return dfs(0)',
            javascript: 'function solve(n) {\n    const cols = new Set(), d1 = new Set(), d2 = new Set();\n    const dfs = (r) => {\n        if (r === n) return 1;\n        let ans = 0;\n        for (let c = 0; c < n; c++) {\n            if (cols.has(c) || d1.has(r - c) || d2.has(r + c)) continue;\n            cols.add(c); d1.add(r - c); d2.add(r + c);\n            ans += dfs(r + 1);\n            cols.delete(c); d1.delete(r - c); d2.delete(r + c);\n        }\n        return ans;\n    };\n    return dfs(0);\n}'
        },
        testCases: [
            { args: [4], expected: 2, isHidden: false },
            { args: [1], expected: 1, isHidden: false },
            { args: [8], expected: 92, isHidden: true }
        ]
    },
    {
        id: 'adbe-6',
        company: 'adobe',
        category: 'product',
        number: 6,
        title: 'Coin Change Total Number of Ways',
        difficulty: 'Medium',
        topic: 'Dynamic Programming',
        frequency: '90% in Adobe SDE-1',
        context: 'Counting ways to compose a canvas width from preset brush sizes',
        fnName: 'solve',
        params: [{ name: 'amount', type: 'int' }, { name: 'coins', type: 'int[]' }],
        returnType: 'int',
        description: 'Given an integer `amount` and an array `coins` of distinct coin denominations, return the number of combinations that make up that `amount` (infinite supply of each coin).',
        constraints: ['1 <= coins.length <= 300', '0 <= amount <= 5000'],
        hint: 'Iterate coins in the outer loop and amount from coin to target in the inner loop.',
        starter: {
            python: 'def solve(amount, coins):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(amount, coins) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(amount, coins):\n    dp = [0] * (amount + 1)\n    dp[0] = 1\n    for c in coins:\n        for a in range(c, amount + 1):\n            dp[a] += dp[a - c]\n    return dp[amount]',
            javascript: 'function solve(amount, coins) {\n    const dp = new Array(amount + 1).fill(0);\n    dp[0] = 1;\n    for (const c of coins) {\n        for (let a = c; a <= amount; a++) dp[a] += dp[a - c];\n    }\n    return dp[amount];\n}'
        },
        testCases: [
            { args: [5, [1, 2, 5]], expected: 4, isHidden: false },
            { args: [3, [2]], expected: 0, isHidden: false },
            { args: [10, [10]], expected: 1, isHidden: true }
        ]
    },
    {
        id: 'adbe-7',
        company: 'adobe',
        category: 'product',
        number: 7,
        title: 'Best Time to Buy and Sell Stock (Single Trade)',
        difficulty: 'Easy',
        topic: 'Arrays & Greedy',
        frequency: '93% in Adobe Screening',
        context: 'Maximum single-day gain over historical asset price feed',
        fnName: 'solve',
        params: [{ name: 'prices', type: 'int[]' }],
        returnType: 'int',
        description: 'Given an array `prices` where `prices[i]` is the price on day `i`, return the maximum profit you can achieve from a single buy followed by a future sell (or `0` if no profit is possible).',
        constraints: ['1 <= prices.length <= 10^5'],
        hint: 'Track the minimum price seen so far and update maxProfit = max(maxProfit, price - minPrice).',
        starter: {
            python: 'def solve(prices):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(prices) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(prices):\n    min_p = float("inf")\n    best = 0\n    for p in prices:\n        min_p = min(min_p, p)\n        best = max(best, p - min_p)\n    return best',
            javascript: 'function solve(prices) {\n    let minP = Infinity, best = 0;\n    for (const p of prices) {\n        if (p < minP) minP = p;\n        else if (p - minP > best) best = p - minP;\n    }\n    return best;\n}'
        },
        testCases: [
            { args: [[7, 1, 5, 3, 6, 4]], expected: 5, isHidden: false },
            { args: [[7, 6, 4, 3, 1]], expected: 0, isHidden: false },
            { args: [[2, 4, 1]], expected: 2, isHidden: true }
        ]
    },
    {
        id: 'adbe-8',
        company: 'adobe',
        category: 'product',
        number: 8,
        title: 'Kth Smallest Element in a Sorted Matrix',
        difficulty: 'Medium',
        topic: 'Binary Search',
        frequency: '88% in Adobe Photoshop Core',
        context: 'Finding k-th percentile pixel luminance in row/col sorted matrix',
        fnName: 'solve',
        params: [{ name: 'matrix', type: 'int[][]' }, { name: 'k', type: 'int' }],
        returnType: 'int',
        description: 'Given an `n x n` `matrix` where each of the rows and columns is sorted in ascending order, return the `k`-th smallest element in the matrix.',
        constraints: ['1 <= n <= 300', '1 <= k <= n^2'],
        hint: 'Binary search on the value range [matrix[0][0], matrix[n-1][n-1]] counting elements <= mid in O(n) per step.',
        starter: {
            python: 'def solve(matrix, k):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(matrix, k) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(matrix, k):\n    n = len(matrix)\n    def count_le(mid):\n        r, c, cnt = n - 1, 0, 0\n        while r >= 0 and c < n:\n            if matrix[r][c] <= mid: cnt += r + 1; c += 1\n            else: r -= 1\n        return cnt\n    lo, hi = matrix[0][0], matrix[-1][-1]\n    while lo < hi:\n        mid = (lo + hi) // 2\n        if count_le(mid) < k: lo = mid + 1\n        else: hi = mid\n    return lo',
            javascript: 'function solve(matrix, k) {\n    const n = matrix.length;\n    const countLE = (mid) => {\n        let r = n - 1, c = 0, cnt = 0;\n        while (r >= 0 && c < n) {\n            if (matrix[r][c] <= mid) { cnt += r + 1; c++; }\n            else r--;\n        }\n        return cnt;\n    };\n    let lo = matrix[0][0], hi = matrix[n - 1][n - 1];\n    while (lo < hi) {\n        const mid = Math.floor((lo + hi) / 2);\n        if (countLE(mid) < k) lo = mid + 1;\n        else hi = mid;\n    }\n    return lo;\n}'
        },
        testCases: [
            { args: [[[1, 5, 9], [10, 11, 13], [12, 13, 15]], 8], expected: 13, isHidden: false },
            { args: [[[-5]], 1], expected: -5, isHidden: false },
            { args: [[[1, 2], [1, 3]], 2], expected: 1, isHidden: true }
        ]
    },
    {
        id: 'adbe-9',
        company: 'adobe',
        category: 'product',
        number: 9,
        title: 'Rightmost Set Bit Position (1-Indexed)',
        difficulty: 'Easy',
        topic: 'Bit Manipulation',
        frequency: '86% in Adobe Systems Round',
        context: 'Isolating lowest active bit flag in graphics mask',
        fnName: 'solve',
        params: [{ name: 'n', type: 'int' }],
        returnType: 'int',
        description: 'Given a non-negative integer `n`, return the 1-based position of the rightmost set bit in its binary representation, or `0` if `n == 0`.',
        constraints: ['0 <= n <= 10^9'],
        hint: 'Isolate lowest set bit via n & -n, then find its 1-based bit index.',
        starter: {
            python: 'def solve(n):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(n) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(n):\n    if n == 0: return 0\n    return (n & -n).bit_length()',
            javascript: 'function solve(n) {\n    if (n === 0) return 0;\n    return Math.log2(n & -n) + 1;\n}'
        },
        testCases: [
            { args: [18], expected: 2, isHidden: false },
            { args: [12], expected: 3, isHidden: false },
            { args: [0], expected: 0, isHidden: true }
        ]
    },
    {
        id: 'adbe-10',
        company: 'adobe',
        category: 'product',
        number: 10,
        title: 'Check Mirror Symmetry of Binary Tree Array',
        difficulty: 'Easy',
        topic: 'Trees',
        frequency: '91% in Adobe Campus Drive',
        context: 'Verifying horizontal symmetry of vector path tree',
        fnName: 'solve',
        params: [{ name: 'tree', type: 'int[]' }],
        returnType: 'boolean',
        description: 'Given a binary tree in level-order array representation where `-1` denotes `null`, return `true` if the tree is a mirror of itself (symmetric around its center).',
        constraints: ['1 <= tree.length <= 1000'],
        hint: 'Recursively compare left and right subtrees: mirror(i, j) checks tree[i] == tree[j] and mirror(2i+1, 2j+2) and mirror(2i+2, 2j+1).',
        starter: {
            python: 'def solve(tree):\n    # Write your logic here\n    return False',
            javascript: 'function solve(tree) {\n    // Write your logic here\n    return false;\n}'
        },
        solution: {
            python: 'def solve(tree):\n    n = len(tree)\n    def is_sym(i, j):\n        vi = -1 if i >= n else tree[i]\n        vj = -1 if j >= n else tree[j]\n        if vi == -1 and vj == -1: return True\n        if vi != vj: return False\n        return is_sym(2 * i + 1, 2 * j + 2) and is_sym(2 * i + 2, 2 * j + 1)\n    return is_sym(1, 2)',
            javascript: 'function solve(tree) {\n    const n = tree.length;\n    const isSym = (i, j) => {\n        const vi = i >= n ? -1 : tree[i];\n        const vj = j >= n ? -1 : tree[j];\n        if (vi === -1 && vj === -1) return true;\n        if (vi !== vj) return false;\n        return isSym(2 * i + 1, 2 * j + 2) && isSym(2 * i + 2, 2 * j + 1);\n    };\n    return isSym(1, 2);\n}'
        },
        testCases: [
            { args: [[1, 2, 2, 3, 4, 4, 3]], expected: true, isHidden: false },
            { args: [[1, 2, 2, -1, 3, -1, 3]], expected: false, isHidden: false },
            { args: [[1]], expected: true, isHidden: true }
        ]
    },
    {
        id: 'adbe-11',
        company: 'adobe',
        category: 'product',
        number: 11,
        title: 'Minimum Deletions to Make Character Frequencies Unique',
        difficulty: 'Medium',
        topic: 'Greedy & Sorting',
        frequency: '87% in Adobe OA',
        context: 'Deduplicating font glyph frequency buckets',
        fnName: 'solve',
        params: [{ name: 's', type: 'string' }],
        returnType: 'int',
        description: 'A string `s` is good if there are no two different characters in `s` that have the same frequency. Return the minimum number of characters you need to delete to make `s` good.',
        constraints: ['1 <= s.length <= 10^5'],
        hint: 'Sort frequencies descending and decrement each duplicate frequency until it is strictly less than the previous (or 0).',
        starter: {
            python: 'def solve(s):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(s) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(s):\n    from collections import Counter\n    freqs = sorted(Counter(s).values(), reverse=True)\n    used = set()\n    dels = 0\n    for f in freqs:\n        while f > 0 and f in used:\n            f -= 1\n            dels += 1\n        if f > 0: used.add(f)\n    return dels',
            javascript: 'function solve(s) {\n    const cnt = new Map();\n    for (const ch of s) cnt.set(ch, (cnt.get(ch) || 0) + 1);\n    const used = new Set();\n    let dels = 0;\n    for (let f of cnt.values()) {\n        while (f > 0 && used.has(f)) { f--; dels++; }\n        if (f > 0) used.add(f);\n    }\n    return dels;\n}'
        },
        testCases: [
            { args: ['aab'], expected: 0, isHidden: false },
            { args: ['aaabbbcc'], expected: 2, isHidden: false },
            { args: ['ceabaacb'], expected: 2, isHidden: true }
        ]
    },
    {
        id: 'adbe-12',
        company: 'adobe',
        category: 'product',
        number: 12,
        title: 'Minimum Cost to Cut a Stick',
        difficulty: 'Hard',
        topic: 'Interval DP',
        frequency: '85% in Adobe Document Cloud',
        context: 'Optimal PDF page-slice splitting cost minimization',
        fnName: 'solve',
        params: [{ name: 'n', type: 'int' }, { name: 'cuts', type: 'int[]' }],
        returnType: 'int',
        description: 'Given a wooden stick of length `n` and an array `cuts` of positions where you must cut, the cost of a cut is the length of the stick being cut. Return the minimum total cost of the cuts.',
        constraints: ['2 <= n <= 10^6', '1 <= cuts.length <= 100'],
        hint: 'Add 0 and n to cuts, sort it, and run interval DP dp[l][r] = (c[r] - c[l]) + min(dp[l][k] + dp[k][r]).',
        starter: {
            python: 'def solve(n, cuts):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(n, cuts) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(n, cuts):\n    c = [0] + sorted(cuts) + [n]\n    m = len(c)\n    dp = [[0] * m for _ in range(m)]\n    for length in range(2, m):\n        for l in range(m - length):\n            r = l + length\n            dp[l][r] = c[r] - c[l] + min(dp[l][k] + dp[k][r] for k in range(l + 1, r))\n    return dp[0][m - 1]',
            javascript: 'function solve(n, cuts) {\n    const c = [0, ...[...cuts].sort((a, b) => a - b), n];\n    const m = c.length;\n    const dp = Array.from({ length: m }, () => new Array(m).fill(0));\n    for (let len = 2; len < m; len++) {\n        for (let l = 0; l + len < m; l++) {\n            const r = l + len;\n            let best = Infinity;\n            for (let k = l + 1; k < r; k++) best = Math.min(best, dp[l][k] + dp[k][r]);\n            dp[l][r] = c[r] - c[l] + best;\n        }\n    }\n    return dp[0][m - 1];\n}'
        },
        testCases: [
            { args: [7, [1, 3, 4, 5]], expected: 16, isHidden: false },
            { args: [9, [5, 6, 1, 4, 2]], expected: 22, isHidden: false },
            { args: [4, [2]], expected: 4, isHidden: true }
        ]
    },
    {
        id: 'adbe-13',
        company: 'adobe',
        category: 'product',
        number: 13,
        title: 'Minimum Number of Swaps to Make String Balanced',
        difficulty: 'Medium',
        topic: 'Greedy & Stack',
        frequency: '86% in Adobe SDE-1',
        context: 'Balancing SVG path group brackets with minimum swaps',
        fnName: 'solve',
        params: [{ name: 's', type: 'string' }],
        returnType: 'int',
        description: 'Given a 0-indexed string `s` of even length containing equal numbers of `[` and `]`, return the minimum number of swaps to make `s` balanced.',
        constraints: ['2 <= s.length <= 10^6'],
        hint: 'Track the maximum unmatched closing bracket depth; answer is (maxUnmatched + 1) // 2.',
        starter: {
            python: 'def solve(s):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(s) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(s):\n    bal = max_un = 0\n    for ch in s:\n        bal += 1 if ch == "]" else -1\n        max_un = max(max_un, bal)\n    return (max_un + 1) // 2',
            javascript: 'function solve(s) {\n    let bal = 0, maxUn = 0;\n    for (const ch of s) {\n        bal += ch === "]" ? 1 : -1;\n        if (bal > maxUn) maxUn = bal;\n    }\n    return Math.floor((maxUn + 1) / 2);\n}'
        },
        testCases: [
            { args: ['][]['], expected: 1, isHidden: false },
            { args: [']]]][[[ '], expected: 2, isHidden: false },
            { args: ['[]'], expected: 0, isHidden: true }
        ]
    },
    {
        id: 'adbe-14',
        company: 'adobe',
        category: 'product',
        number: 14,
        title: 'Egg Drop Problem (2 Eggs Minimum Moves)',
        difficulty: 'Medium',
        topic: 'Math & DP',
        frequency: '89% in Adobe Analytical Round',
        context: 'Finding critical failure threshold in N-step build pipeline with 2 builds',
        fnName: 'solve',
        params: [{ name: 'n', type: 'int' }],
        returnType: 'int',
        description: 'You are given 2 identical eggs and a building with `n` floors. Find the minimum number of drops required in the worst case to determine with certainty the highest floor from which an egg does not break.',
        constraints: ['1 <= n <= 1000'],
        hint: 'With k moves, 2 eggs can cover at most k*(k+1)/2 floors. Find smallest k with k*(k+1)/2 >= n.',
        starter: {
            python: 'def solve(n):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(n) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(n):\n    k = 1\n    while k * (k + 1) // 2 < n:\n        k += 1\n    return k',
            javascript: 'function solve(n) {\n    let k = 1;\n    while ((k * (k + 1)) / 2 < n) k++;\n    return k;\n}'
        },
        testCases: [
            { args: [2], expected: 2, isHidden: false },
            { args: [100], expected: 14, isHidden: false },
            { args: [10], expected: 4, isHidden: true }
        ]
    },
    {
        id: 'adbe-15',
        company: 'adobe',
        category: 'product',
        number: 15,
        title: 'Chocolate Distribution Minimum Difference',
        difficulty: 'Easy',
        topic: 'Sorting & Sliding Window',
        frequency: '90% in Adobe Campus Coding',
        context: 'Minimizing pixel brightness spread across K-sized sample batches',
        fnName: 'solve',
        params: [{ name: 'packets', type: 'int[]' }, { name: 'm', type: 'int' }],
        returnType: 'int',
        description: 'Given an array `packets` of chocolate counts and `m` students, distribute one packet to each of `m` students such that the difference between the maximum and minimum chocolates given is minimized.',
        constraints: ['1 <= m <= packets.length <= 10^5'],
        hint: 'Sort the array and find the minimum of packets[i + m - 1] - packets[i] over all windows of size m.',
        starter: {
            python: 'def solve(packets, m):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(packets, m) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(packets, m):\n    a = sorted(packets)\n    return min(a[i + m - 1] - a[i] for i in range(len(a) - m + 1))',
            javascript: 'function solve(packets, m) {\n    const a = [...packets].sort((x, y) => x - y);\n    let best = Infinity;\n    for (let i = 0; i + m - 1 < a.length; i++) best = Math.min(best, a[i + m - 1] - a[i]);\n    return best;\n}'
        },
        testCases: [
            { args: [[3, 4, 1, 9, 56, 7, 9, 12], 5], expected: 6, isHidden: false },
            { args: [[7, 3, 2, 4, 9, 12, 56], 3], expected: 2, isHidden: false },
            { args: [[10, 10, 10], 2], expected: 0, isHidden: true }
        ]
    },
    {
        id: 'adbe-16',
        company: 'adobe',
        category: 'product',
        number: 16,
        title: 'Count Pairs With Given Sum in Array',
        difficulty: 'Easy',
        topic: 'Hash Map',
        frequency: '88% in Adobe Screening',
        context: 'Matching complementary color channel pairs summing to target',
        fnName: 'solve',
        params: [{ name: 'arr', type: 'int[]' }, { name: 'target', type: 'int' }],
        returnType: 'int',
        description: 'Given an array of integers `arr` and an integer `target`, return the total number of pairs `(i, j)` with `i < j` such that `arr[i] + arr[j] == target`.',
        constraints: ['1 <= arr.length <= 10^5'],
        hint: 'Maintain a frequency map of previously seen elements and add freq[target - x] before incrementing freq[x].',
        starter: {
            python: 'def solve(arr, target):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(arr, target) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(arr, target):\n    seen = {}\n    ans = 0\n    for x in arr:\n        ans += seen.get(target - x, 0)\n        seen[x] = seen.get(x, 0) + 1\n    return ans',
            javascript: 'function solve(arr, target) {\n    const seen = new Map();\n    let ans = 0;\n    for (const x of arr) {\n        ans += seen.get(target - x) || 0;\n        seen.set(x, (seen.get(x) || 0) + 1);\n    }\n    return ans;\n}'
        },
        testCases: [
            { args: [[1, 5, 7, -1, 5], 6], expected: 3, isHidden: false },
            { args: [[1, 1, 1, 1], 2], expected: 6, isHidden: false },
            { args: [[10, 20, 30], 100], expected: 0, isHidden: true }
        ]
    },
    {
        id: 'adbe-17',
        company: 'adobe',
        category: 'product',
        number: 17,
        title: 'Maximum Area of a Piece of Cake After Cuts',
        difficulty: 'Medium',
        topic: 'Greedy & Sorting',
        frequency: '85% in Adobe Creative Cloud',
        context: 'Finding largest uncropped rectangle after horizontal & vertical guides',
        fnName: 'solve',
        params: [{ name: 'h', type: 'int' }, { name: 'w', type: 'int' }, { name: 'horizontalCuts', type: 'int[]' }, { name: 'verticalCuts', type: 'int[]' }],
        returnType: 'int',
        description: 'Given a rectangle of height `h` and width `w`, plus arrays of horizontal and vertical cuts, return the maximum area of a piece modulo `10^9 + 7`.',
        constraints: ['2 <= h, w <= 10^9'],
        hint: 'Find the maximum gap between consecutive sorted horizontal cuts (including 0 and h) and vertical cuts (including 0 and w), then multiply.',
        starter: {
            python: 'def solve(h, w, horizontalCuts, verticalCuts):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(h, w, horizontalCuts, verticalCuts) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(h, w, horizontalCuts, verticalCuts):\n    hc = [0] + sorted(horizontalCuts) + [h]\n    vc = [0] + sorted(verticalCuts) + [w]\n    mh = max(hc[i] - hc[i - 1] for i in range(1, len(hc)))\n    mw = max(vc[i] - vc[i - 1] for i in range(1, len(vc)))\n    return (mh * mw) % (10**9 + 7)',
            javascript: 'function solve(h, w, horizontalCuts, verticalCuts) {\n    const MOD = 1000000007n;\n    const hc = [0, ...[...horizontalCuts].sort((a, b) => a - b), h];\n    const vc = [0, ...[...verticalCuts].sort((a, b) => a - b), w];\n    let mh = 0, mw = 0;\n    for (let i = 1; i < hc.length; i++) mh = Math.max(mh, hc[i] - hc[i - 1]);\n    for (let i = 1; i < vc.length; i++) mw = Math.max(mw, vc[i] - vc[i - 1]);\n    return Number((BigInt(mh) * BigInt(mw)) % MOD);\n}'
        },
        testCases: [
            { args: [5, 4, [1, 2, 4], [1, 3]], expected: 4, isHidden: false },
            { args: [5, 4, [3, 1], [1]], expected: 6, isHidden: false },
            { args: [5, 4, [3], [3]], expected: 9, isHidden: true }
        ]
    },
    {
        id: 'adbe-18',
        company: 'adobe',
        category: 'product',
        number: 18,
        title: 'Minimum Flips to Make Binary String Alternating',
        difficulty: 'Medium',
        topic: 'Strings',
        frequency: '84% in Adobe MTS',
        context: 'Computing min bit flips to achieve checkerboard pattern',
        fnName: 'solve',
        params: [{ name: 's', type: 'string' }],
        returnType: 'int',
        description: 'Given a binary string `s`, return the minimum number of character flips (`0`->`1` or `1`->`0`) required to make `s` alternating (either `"0101..."` or `"1010..."`).',
        constraints: ['1 <= s.length <= 10^5'],
        hint: 'Count mismatches against "0101..." (c0) and against "1010..." (len(s) - c0); return min.',
        starter: {
            python: 'def solve(s):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(s) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(s):\n    c0 = sum(1 for i, ch in enumerate(s) if int(ch) != (i % 2))\n    return min(c0, len(s) - c0)',
            javascript: 'function solve(s) {\n    let c0 = 0;\n    for (let i = 0; i < s.length; i++) if (Number(s[i]) !== (i % 2)) c0++;\n    return Math.min(c0, s.length - c0);\n}'
        },
        testCases: [
            { args: ['0100'], expected: 1, isHidden: false },
            { args: ['10'], expected: 0, isHidden: false },
            { args: ['1111'], expected: 2, isHidden: true }
        ]
    },
    {
        id: 'adbe-19',
        company: 'adobe',
        category: 'product',
        number: 19,
        title: 'Jump Game II (Minimum Jumps to End)',
        difficulty: 'Medium',
        topic: 'Greedy',
        frequency: '92% in Adobe SDE-1',
        context: 'Minimum frame skips to reach end of timeline',
        fnName: 'solve',
        params: [{ name: 'nums', type: 'int[]' }],
        returnType: 'int',
        description: 'Given a 0-indexed array `nums` where `nums[i]` is the maximum jump length from `i`, return the minimum number of jumps to reach `nums.length - 1`. Assume the last index is always reachable.',
        constraints: ['1 <= nums.length <= 10^4'],
        hint: 'Use greedy BFS window: track currentEnd and farthest; increment jumps whenever i reaches currentEnd.',
        starter: {
            python: 'def solve(nums):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(nums) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(nums):\n    jumps = cur_end = farthest = 0\n    for i in range(len(nums) - 1):\n        farthest = max(farthest, i + nums[i])\n        if i == cur_end:\n            jumps += 1\n            cur_end = farthest\n    return jumps',
            javascript: 'function solve(nums) {\n    let jumps = 0, curEnd = 0, farthest = 0;\n    for (let i = 0; i < nums.length - 1; i++) {\n        farthest = Math.max(farthest, i + nums[i]);\n        if (i === curEnd) { jumps++; curEnd = farthest; }\n    }\n    return jumps;\n}'
        },
        testCases: [
            { args: [[2, 3, 1, 1, 4]], expected: 2, isHidden: false },
            { args: [[2, 3, 0, 1, 4]], expected: 2, isHidden: false },
            { args: [[0]], expected: 0, isHidden: true }
        ]
    },
    {
        id: 'adbe-20',
        company: 'adobe',
        category: 'product',
        number: 20,
        title: 'Count Square Submatrices with All Ones',
        difficulty: 'Medium',
        topic: 'Dynamic Programming',
        frequency: '87% in Adobe Photoshop / Illustrator',
        context: 'Counting uniform opaque square regions in alpha mask',
        fnName: 'solve',
        params: [{ name: 'matrix', type: 'int[][]' }],
        returnType: 'int',
        description: 'Given an `m x n` binary `matrix` of `0`s and `1`s, return how many square submatrices have all `1`s.',
        constraints: ['1 <= m, n <= 300'],
        hint: 'dp[r][c] = 1 + min(dp[r-1][c], dp[r][c-1], dp[r-1][c-1]) if matrix[r][c] == 1; sum all dp[r][c].',
        starter: {
            python: 'def solve(matrix):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(matrix) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(matrix):\n    m, n = len(matrix), len(matrix[0])\n    dp = [row[:] for row in matrix]\n    total = 0\n    for r in range(m):\n        for c in range(n):\n            if r > 0 and c > 0 and dp[r][c] == 1:\n                dp[r][c] += min(dp[r - 1][c], dp[r][c - 1], dp[r - 1][c - 1])\n            total += dp[r][c]\n    return total',
            javascript: 'function solve(matrix) {\n    const m = matrix.length, n = matrix[0].length;\n    const dp = matrix.map(r => [...r]);\n    let total = 0;\n    for (let r = 0; r < m; r++) {\n        for (let c = 0; c < n; c++) {\n            if (r > 0 && c > 0 && dp[r][c] === 1) dp[r][c] += Math.min(dp[r - 1][c], dp[r][c - 1], dp[r - 1][c - 1]);\n            total += dp[r][c];\n        }\n    }\n    return total;\n}'
        },
        testCases: [
            { args: [[[0, 1, 1, 1], [1, 1, 1, 1], [0, 1, 1, 1]]], expected: 15, isHidden: false },
            { args: [[[1, 0, 1], [1, 1, 0], [1, 1, 0]]], expected: 7, isHidden: false },
            { args: [[[1]]], expected: 1, isHidden: true }
        ]
    }
];

