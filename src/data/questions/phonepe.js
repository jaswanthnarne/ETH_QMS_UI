export const PHONEPE_QUESTIONS = [
    {
        id: 'phpe-1',
        company: 'phonepe',
        category: 'startup',
        number: 1,
        title: 'Minimum Coin Denominations for UPI Change',
        difficulty: 'Medium',
        topic: 'Greedy & DP',
        frequency: '95% in PhonePe SDE-1 OA',
        context: 'Dispensing exact wallet cashback using fewest voucher denominations',
        fnName: 'solve',
        params: [{ name: 'coins', type: 'int[]' }, { name: 'amount', type: 'int' }],
        returnType: 'int',
        description: 'Given an array of distinct voucher denominations `coins` and a target `amount`, return the fewest number of coins needed to make up that `amount`, or `-1` if impossible.',
        constraints: ['1 <= coins.length <= 12', '0 <= amount <= 10^4'],
        hint: 'Bottom-up DP: dp[a] = min(dp[a], 1 + dp[a - c]) for each coin c.',
        starter: {
            python: 'def solve(coins, amount):\n    # Write your logic here\n    return -1',
            javascript: 'function solve(coins, amount) {\n    // Write your logic here\n    return -1;\n}'
        },
        solution: {
            python: 'def solve(coins, amount):\n    INF = amount + 1\n    dp = [INF] * (amount + 1)\n    dp[0] = 0\n    for a in range(1, amount + 1):\n        for c in coins:\n            if c <= a: dp[a] = min(dp[a], dp[a - c] + 1)\n    return -1 if dp[amount] > amount else dp[amount]',
            javascript: 'function solve(coins, amount) {\n    const INF = amount + 1, dp = new Array(amount + 1).fill(INF);\n    dp[0] = 0;\n    for (let a = 1; a <= amount; a++) {\n        for (const c of coins) if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);\n    }\n    return dp[amount] > amount ? -1 : dp[amount];\n}'
        },
        testCases: [
            { args: [[1, 2, 5], 11], expected: 3, isHidden: false },
            { args: [[2], 3], expected: -1, isHidden: false },
            { args: [[1], 0], expected: 0, isHidden: true }
        ]
    },
    {
        id: 'phpe-2',
        company: 'phonepe',
        category: 'startup',
        number: 2,
        title: 'Target Sum Plus Minus Expressions',
        difficulty: 'Medium',
        topic: 'Dynamic Programming',
        frequency: '92% in PhonePe Backend Round',
        context: 'Counting ledger reconciliation signs yielding net target balance',
        fnName: 'solve',
        params: [{ name: 'nums', type: 'int[]' }, { name: 'target', type: 'int' }],
        returnType: 'int',
        description: 'Given an integer array `nums` and an integer `target`, assign either `+` or `-` before each integer in `nums` and return the number of different expressions that evaluate to `target`.',
        constraints: ['1 <= nums.length <= 20', '0 <= sum(nums) <= 1000'],
        hint: 'Reduce to subset sum: P = (sum(nums) + target) / 2, and count subsets summing to P.',
        starter: {
            python: 'def solve(nums, target):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(nums, target) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(nums, target):\n    s = sum(nums)\n    if abs(target) > s or (s + target) % 2 != 0: return 0\n    p = (s + target) // 2\n    dp = [0] * (p + 1)\n    dp[0] = 1\n    for x in nums:\n        for j in range(p, x - 1, -1): dp[j] += dp[j - x]\n    return dp[p]',
            javascript: 'function solve(nums, target) {\n    const s = nums.reduce((a, b) => a + b, 0);\n    if (Math.abs(target) > s || (s + target) % 2 !== 0) return 0;\n    const p = (s + target) / 2;\n    const dp = new Array(p + 1).fill(0);\n    dp[0] = 1;\n    for (const x of nums) for (let j = p; j >= x; j--) dp[j] += dp[j - x];\n    return dp[p];\n}'
        },
        testCases: [
            { args: [[1, 1, 1, 1, 1], 3], expected: 5, isHidden: false },
            { args: [[1], 1], expected: 1, isHidden: false },
            { args: [[1, 0], 1], expected: 2, isHidden: true }
        ]
    },
    {
        id: 'phpe-3',
        company: 'phonepe',
        category: 'startup',
        number: 3,
        title: 'House Robber II (Circular Street)',
        difficulty: 'Medium',
        topic: 'Dynamic Programming',
        frequency: '90% in PhonePe OA',
        context: 'Maximizing non-adjacent merchant node rewards arranged in a ring',
        fnName: 'solve',
        params: [{ name: 'nums', type: 'int[]' }],
        returnType: 'int',
        description: 'All houses are arranged in a circle (first and last are adjacent). Adjacent houses cannot both be robbed. Given `nums` money in each house, return the maximum amount you can rob.',
        constraints: ['1 <= nums.length <= 100'],
        hint: 'Take the maximum of linear House Robber on nums[:-1] and nums[1:].',
        starter: {
            python: 'def solve(nums):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(nums) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(nums):\n    if len(nums) == 1: return nums[0]\n    def rob(arr):\n        p2 = p1 = 0\n        for x in arr: p2, p1 = p1, max(p1, p2 + x)\n        return p1\n    return max(rob(nums[:-1]), rob(nums[1:]))',
            javascript: 'function solve(nums) {\n    if (nums.length === 1) return nums[0];\n    const rob = (arr) => {\n        let p2 = 0, p1 = 0;\n        for (const x of arr) { const cur = Math.max(p1, p2 + x); p2 = p1; p1 = cur; }\n        return p1;\n    };\n    return Math.max(rob(nums.slice(0, -1)), rob(nums.slice(1)));\n}'
        },
        testCases: [
            { args: [[2, 3, 2]], expected: 3, isHidden: false },
            { args: [[1, 2, 3, 1]], expected: 4, isHidden: false },
            { args: [[1, 2, 3]], expected: 3, isHidden: true }
        ]
    },
    {
        id: 'phpe-4',
        company: 'phonepe',
        category: 'startup',
        number: 4,
        title: 'Minimum Operations to Halve Array Sum',
        difficulty: 'Medium',
        topic: 'Greedy & Max Heap',
        frequency: '89% in PhonePe SDE-1',
        context: 'Halving peak merchant settlement loads to cut total volume by 50%',
        fnName: 'solve',
        params: [{ name: 'nums', type: 'int[]' }],
        returnType: 'int',
        description: 'In one operation you can pick any element in `nums` and replace it with half of its value (floating point). Return the minimum number of operations to reduce the sum of `nums` by at least half.',
        constraints: ['1 <= nums.length <= 10^5'],
        hint: 'Greedily halve the largest current element using a max-heap until total reduction >= sum(nums) / 2.',
        starter: {
            python: 'def solve(nums):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(nums) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(nums):\n    import heapq\n    target = sum(nums) / 2.0\n    pq = [-float(x) for x in nums]\n    heapq.heapify(pq)\n    reduced = 0.0\n    ops = 0\n    while reduced < target:\n        x = -heapq.heappop(pq)\n        half = x / 2.0\n        reduced += half\n        heapq.heappush(pq, -half)\n        ops += 1\n    return ops',
            javascript: 'function solve(nums) {\n    const target = nums.reduce((a, b) => a + b, 0) / 2;\n    const arr = [...nums].map(Number);\n    let reduced = 0, ops = 0;\n    while (reduced < target) {\n        arr.sort((a, b) => a - b);\n        const half = arr.pop() / 2;\n        reduced += half;\n        arr.push(half);\n        ops++;\n    }\n    return ops;\n}'
        },
        testCases: [
            { args: [[5, 19, 8, 1]], expected: 3, isHidden: false },
            { args: [[3, 8, 20]], expected: 3, isHidden: false },
            { args: [[10]], expected: 1, isHidden: true }
        ]
    },
    {
        id: 'phpe-5',
        company: 'phonepe',
        category: 'startup',
        number: 5,
        title: 'Find All Duplicates in an Array',
        difficulty: 'Medium',
        topic: 'In-Place Hashing',
        frequency: '91% in PhonePe Coding Test',
        context: 'Identifying duplicate transaction IDs occurring twice in 1..N batch',
        fnName: 'solve',
        params: [{ name: 'nums', type: 'int[]' }],
        returnType: 'int[]',
        description: 'Given an integer array `nums` of length `n` where all integers are in `[1, n]` and each integer appears once or twice, return an array of all integers that appear twice, sorted ascending.',
        constraints: ['1 <= nums.length <= 10^5'],
        hint: 'Track seen values or negate nums[abs(x) - 1] in-place; if already negative, x is a duplicate.',
        starter: {
            python: 'def solve(nums):\n    # Write your logic here\n    return []',
            javascript: 'function solve(nums) {\n    // Write your logic here\n    return [];\n}'
        },
        solution: {
            python: 'def solve(nums):\n    seen, dup = set(), []\n    for x in nums:\n        if x in seen: dup.append(x)\n        else: seen.add(x)\n    return sorted(dup)',
            javascript: 'function solve(nums) {\n    const seen = new Set(), dup = [];\n    for (const x of nums) { if (seen.has(x)) dup.push(x); else seen.add(x); }\n    return dup.sort((a, b) => a - b);\n}'
        },
        testCases: [
            { args: [[4, 3, 2, 7, 8, 2, 3, 1]], expected: [2, 3], isHidden: false },
            { args: [[1, 1, 2]], expected: [1], isHidden: false },
            { args: [[1]], expected: [], isHidden: true }
        ]
    },
    {
        id: 'phpe-6',
        company: 'phonepe',
        category: 'startup',
        number: 6,
        title: 'Minimum Size Subarray With Sum >= Target (Negative Allowed? No, Positive)',
        difficulty: 'Medium',
        topic: 'Sliding Window',
        frequency: '88% in PhonePe OA',
        context: 'Shortest consecutive UPI transaction burst reaching threshold value',
        fnName: 'solve',
        params: [{ name: 'nums', type: 'int[]' }, { name: 'target', type: 'int' }],
        returnType: 'int',
        description: 'Given an array of positive integers `nums` and a positive integer `target`, return the minimal length of a subarray whose sum is greater than or equal to `target`, or `0` if none exists.',
        constraints: ['1 <= nums.length <= 10^5'],
        hint: 'Use a sliding window: expand right, then shrink left while windowSum >= target.',
        starter: {
            python: 'def solve(nums, target):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(nums, target) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(nums, target):\n    l = cur = 0\n    best = len(nums) + 1\n    for r, x in enumerate(nums):\n        cur += x\n        while cur >= target:\n            best = min(best, r - l + 1)\n            cur -= nums[l]; l += 1\n    return 0 if best > len(nums) else best',
            javascript: 'function solve(nums, target) {\n    let l = 0, cur = 0, best = nums.length + 1;\n    for (let r = 0; r < nums.length; r++) {\n        cur += nums[r];\n        while (cur >= target) { best = Math.min(best, r - l + 1); cur -= nums[l++]; }\n    }\n    return best > nums.length ? 0 : best;\n}'
        },
        testCases: [
            { args: [[2, 3, 1, 2, 4, 3], 7], expected: 2, isHidden: false },
            { args: [[1, 4, 4], 4], expected: 1, isHidden: false },
            { args: [[1, 1, 1, 1, 1], 11], expected: 0, isHidden: true }
        ]
    },
    {
        id: 'phpe-7',
        company: 'phonepe',
        category: 'startup',
        number: 7,
        title: 'Maximum Points You Can Obtain from Cards',
        difficulty: 'Medium',
        topic: 'Sliding Window',
        frequency: '89% in PhonePe Backend',
        context: 'Picking K reward cards from either end of queue for max cashback',
        fnName: 'solve',
        params: [{ name: 'cardPoints', type: 'int[]' }, { name: 'k', type: 'int' }],
        returnType: 'int',
        description: 'Given `cardPoints` and an integer `k`, in one step you can take one card from the beginning or end of the row. Return the maximum score you can obtain by taking exactly `k` cards.',
        constraints: ['1 <= k <= cardPoints.length <= 10^5'],
        hint: 'Find the minimum sum contiguous subarray of length n - k and subtract it from total sum.',
        starter: {
            python: 'def solve(cardPoints, k):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(cardPoints, k) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(cardPoints, k):\n    n = len(cardPoints)\n    w = n - k\n    if w == 0: return sum(cardPoints)\n    cur = sum(cardPoints[:w])\n    min_w = cur\n    for i in range(w, n):\n        cur += cardPoints[i] - cardPoints[i - w]\n        min_w = min(min_w, cur)\n    return sum(cardPoints) - min_w',
            javascript: 'function solve(cardPoints, k) {\n    const n = cardPoints.length, w = n - k;\n    const total = cardPoints.reduce((a, b) => a + b, 0);\n    if (w === 0) return total;\n    let cur = 0;\n    for (let i = 0; i < w; i++) cur += cardPoints[i];\n    let minW = cur;\n    for (let i = w; i < n; i++) { cur += cardPoints[i] - cardPoints[i - w]; minW = Math.min(minW, cur); }\n    return total - minW;\n}'
        },
        testCases: [
            { args: [[1, 2, 3, 4, 5, 6, 1], 3], expected: 12, isHidden: false },
            { args: [[2, 2, 2], 2], expected: 4, isHidden: false },
            { args: [[9, 7, 7, 9, 7, 7, 9], 7], expected: 55, isHidden: true }
        ]
    },
    {
        id: 'phpe-8',
        company: 'phonepe',
        category: 'startup',
        number: 8,
        title: 'Subarray Sums Divisible by K Count',
        difficulty: 'Medium',
        topic: 'Prefix Sum & Modulo',
        frequency: '90% in PhonePe OA',
        context: 'Counting wallet settlement batches divisible by reconciliation factor K',
        fnName: 'solve',
        params: [{ name: 'nums', type: 'int[]' }, { name: 'k', type: 'int' }],
        returnType: 'int',
        description: 'Given an integer array `nums` and an integer `k`, return the number of non-empty subarrays that have a sum divisible by `k`.',
        constraints: ['1 <= nums.length <= 3 * 10^4', '2 <= k <= 10^4'],
        hint: 'Normalize prefix sum mod k to [0, k-1] using ((pref % k) + k) % k and count matching prior remainders.',
        starter: {
            python: 'def solve(nums, k):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(nums, k) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(nums, k):\n    cnt = {0: 1}\n    pref = ans = 0\n    for x in nums:\n        pref = (pref + x) % k\n        ans += cnt.get(pref, 0)\n        cnt[pref] = cnt.get(pref, 0) + 1\n    return ans',
            javascript: 'function solve(nums, k) {\n    const cnt = new Map([[0, 1]]);\n    let pref = 0, ans = 0;\n    for (const x of nums) {\n        pref = ((pref + x) % k + k) % k;\n        ans += cnt.get(pref) || 0;\n        cnt.set(pref, (cnt.get(pref) || 0) + 1);\n    }\n    return ans;\n}'
        },
        testCases: [
            { args: [[4, 5, 0, -2, -3, 1], 5], expected: 7, isHidden: false },
            { args: [[5], 9], expected: 0, isHidden: false },
            { args: [[-1, 2, 9], 2], expected: 2, isHidden: true }
        ]
    },
    {
        id: 'phpe-9',
        company: 'phonepe',
        category: 'startup',
        number: 9,
        title: 'Minimum Difference Between Largest and Smallest in 3 Moves',
        difficulty: 'Medium',
        topic: 'Sorting & Greedy',
        frequency: '85% in PhonePe SDE-1',
        context: 'Smoothing up to 3 outlier transaction latencies to tighten spread',
        fnName: 'solve',
        params: [{ name: 'nums', type: 'int[]' }],
        returnType: 'int',
        description: 'In one move you can change any element of `nums` to any value. Return the minimum difference between the largest and smallest value of `nums` after performing at most 3 moves.',
        constraints: ['1 <= nums.length <= 10^5'],
        hint: 'If n <= 4, answer is 0. Otherwise sort nums and check the 4 ways to remove 3 elements from the two ends.',
        starter: {
            python: 'def solve(nums):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(nums) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(nums):\n    if len(nums) <= 4: return 0\n    a = sorted(nums)\n    n = len(a)\n    return min(a[n - 4 + i] - a[i] for i in range(4))',
            javascript: 'function solve(nums) {\n    if (nums.length <= 4) return 0;\n    const a = [...nums].sort((x, y) => x - y);\n    const n = a.length;\n    let best = Infinity;\n    for (let i = 0; i < 4; i++) best = Math.min(best, a[n - 4 + i] - a[i]);\n    return best;\n}'
        },
        testCases: [
            { args: [[5, 3, 2, 4]], expected: 0, isHidden: false },
            { args: [[1, 5, 0, 10, 14]], expected: 1, isHidden: false },
            { args: [[3, 100, 20]], expected: 0, isHidden: true }
        ]
    },
    {
        id: 'phpe-10',
        company: 'phonepe',
        category: 'startup',
        number: 10,
        title: 'Two City Scheduling Minimum Cost',
        difficulty: 'Medium',
        topic: 'Greedy & Sorting',
        frequency: '87% in PhonePe Operations',
        context: 'Routing 2N field agents evenly between City A and City B at min travel cost',
        fnName: 'solve',
        params: [{ name: 'costs', type: 'int[][]' }],
        returnType: 'int',
        description: 'A company wants to interview `2n` people. `costs[i] = [aCost, bCost]` is the cost to fly person `i` to city A or city B. Return the minimum cost to fly exactly `n` people to city A and `n` people to city B.',
        constraints: ['2 <= costs.length <= 100 (even)'],
        hint: 'Sort by (aCost - bCost) ascending; send first n people to city A and remaining n to city B.',
        starter: {
            python: 'def solve(costs):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(costs) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(costs):\n    s = sorted(costs, key=lambda x: x[0] - x[1])\n    n = len(s) // 2\n    return sum(s[i][0] for i in range(n)) + sum(s[i][1] for i in range(n, 2 * n))',
            javascript: 'function solve(costs) {\n    const s = [...costs].sort((a, b) => (a[0] - a[1]) - (b[0] - b[1]));\n    const n = s.length / 2;\n    let total = 0;\n    for (let i = 0; i < n; i++) total += s[i][0] + s[i + n][1];\n    return total;\n}'
        },
        testCases: [
            { args: [[[10, 20], [30, 200], [400, 50], [30, 20]]], expected: 110, isHidden: false },
            { args: [[[259, 770], [448, 54], [926, 667], [184, 139], [840, 118], [577, 469]]], expected: 1859, isHidden: false },
            { args: [[[10, 100], [100, 10]]], expected: 20, isHidden: true }
        ]
    },
    {
        id: 'phpe-11',
        company: 'phonepe',
        category: 'startup',
        number: 11,
        title: 'Minimum Deletions to Make String Balanced (a before b)',
        difficulty: 'Medium',
        topic: 'DP & Greedy',
        frequency: '86% in PhonePe Coding Round',
        context: 'Ensuring all "a" priority flags precede "b" flags with minimum drops',
        fnName: 'solve',
        params: [{ name: 's', type: 'string' }],
        returnType: 'int',
        description: 'Given a string `s` consisting only of `"a"` and `"b"`, return the minimum number of deletions needed to make `s` balanced (no `"b"` appears before an `"a"`).',
        constraints: ['1 <= s.length <= 10^5'],
        hint: 'Scan left to right tracking bCount and deletions: on "a", deletions = min(deletions + 1, bCount).',
        starter: {
            python: 'def solve(s):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(s) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(s):\n    b_cnt = dels = 0\n    for ch in s:\n        if ch == "b": b_cnt += 1\n        else: dels = min(dels + 1, b_cnt)\n    return dels',
            javascript: 'function solve(s) {\n    let bCnt = 0, dels = 0;\n    for (const ch of s) {\n        if (ch === "b") bCnt++;\n        else dels = Math.min(dels + 1, bCnt);\n    }\n    return dels;\n}'
        },
        testCases: [
            { args: ['aababbab'], expected: 2, isHidden: false },
            { args: ['bbaaaaabb'], expected: 2, isHidden: false },
            { args: ['aaabbb'], expected: 0, isHidden: true }
        ]
    },
    {
        id: 'phpe-12',
        company: 'phonepe',
        category: 'startup',
        number: 12,
        title: 'Maximum Length of Pair Chain',
        difficulty: 'Medium',
        topic: 'Greedy & Sorting',
        frequency: '85% in PhonePe OA',
        context: 'Chaining longest non-overlapping payment reconciliation windows',
        fnName: 'solve',
        params: [{ name: 'pairs', type: 'int[][]' }],
        returnType: 'int',
        description: 'Given `pairs[i] = [left, right]` with `left < right`, a pair `[c, d]` can follow `[a, b]` if `b < c`. Return the length of the longest chain you can form.',
        constraints: ['1 <= pairs.length <= 1000'],
        hint: 'Sort pairs by right endpoint ascending and greedily pick whenever pair[0] > currentEnd.',
        starter: {
            python: 'def solve(pairs):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(pairs) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(pairs):\n    ps = sorted(pairs, key=lambda x: x[1])\n    cur = -10**9\n    ans = 0\n    for l, r in ps:\n        if l > cur: ans += 1; cur = r\n    return ans',
            javascript: 'function solve(pairs) {\n    const ps = [...pairs].sort((a, b) => a[1] - b[1]);\n    let cur = -Infinity, ans = 0;\n    for (const [l, r] of ps) if (l > cur) { ans++; cur = r; }\n    return ans;\n}'
        },
        testCases: [
            { args: [[[1, 2], [2, 3], [3, 4]]], expected: 2, isHidden: false },
            { args: [[[1, 2], [7, 8], [4, 5]]], expected: 3, isHidden: false },
            { args: [[[1, 10]]], expected: 1, isHidden: true }
        ]
    },
    {
        id: 'phpe-13',
        company: 'phonepe',
        category: 'startup',
        number: 13,
        title: 'Minimum Swaps to Group All 1s Together',
        difficulty: 'Medium',
        topic: 'Sliding Window',
        frequency: '86% in PhonePe SDE-1',
        context: 'Compacting scattered active flag bits into one contiguous block',
        fnName: 'solve',
        params: [{ name: 'data', type: 'int[]' }],
        returnType: 'int',
        description: 'Given a binary array `data`, return the minimum number of swaps required to group all `1`s present in the array together in any place in the array.',
        constraints: ['1 <= data.length <= 10^5'],
        hint: 'Let k = sum(data). Find the window of size k with the maximum number of 1s; answer is k - maxOnesInWindow.',
        starter: {
            python: 'def solve(data):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(data) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(data):\n    k = sum(data)\n    if k <= 1: return 0\n    cur = sum(data[:k])\n    best = cur\n    for i in range(k, len(data)):\n        cur += data[i] - data[i - k]\n        best = max(best, cur)\n    return k - best',
            javascript: 'function solve(data) {\n    const k = data.reduce((a, b) => a + b, 0);\n    if (k <= 1) return 0;\n    let cur = 0;\n    for (let i = 0; i < k; i++) cur += data[i];\n    let best = cur;\n    for (let i = k; i < data.length; i++) { cur += data[i] - data[i - k]; best = Math.max(best, cur); }\n    return k - best;\n}'
        },
        testCases: [
            { args: [[1, 0, 1, 0, 1]], expected: 1, isHidden: false },
            { args: [[0, 0, 0, 1, 0]], expected: 0, isHidden: false },
            { args: [[1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1]], expected: 3, isHidden: true }
        ]
    },
    {
        id: 'phpe-14',
        company: 'phonepe',
        category: 'startup',
        number: 14,
        title: 'Minimum Domino / Array Operations to Zero',
        difficulty: 'Easy',
        topic: 'Hash Set',
        frequency: '84% in PhonePe Screening',
        context: 'Counting distinct non-zero debt tiers needed to clear all balances',
        fnName: 'solve',
        params: [{ name: 'nums', type: 'int[]' }],
        returnType: 'int',
        description: 'In one operation you choose a positive integer `x <= min(positive elements)` and subtract `x` from every positive element in `nums`. Return the minimum operations to make every element `0`.',
        constraints: ['1 <= nums.length <= 100'],
        hint: 'The answer is simply the number of distinct positive integers in nums.',
        starter: {
            python: 'def solve(nums):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(nums) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(nums):\n    return len({x for x in nums if x > 0})',
            javascript: 'function solve(nums) {\n    return new Set(nums.filter(x => x > 0)).size;\n}'
        },
        testCases: [
            { args: [[1, 5, 0, 3, 5]], expected: 3, isHidden: false },
            { args: [[0]], expected: 0, isHidden: false },
            { args: [[2, 2, 2]], expected: 1, isHidden: true }
        ]
    },
    {
        id: 'phpe-15',
        company: 'phonepe',
        category: 'startup',
        number: 15,
        title: 'Minimum Number of Frogs Croaking',
        difficulty: 'Medium',
        topic: 'Strings & State Tracking',
        frequency: '87% in PhonePe Coding Test',
        context: 'Tracking minimum concurrent UPI state machines from interleaved event logs',
        fnName: 'solve',
        params: [{ name: 'croakOfFrogs', type: 'string' }],
        returnType: 'int',
        description: 'Given a string `croakOfFrogs` representing interleaved `"croak"` sequences from multiple frogs, return the minimum number of different frogs required to finish all croaks, or `-1` if invalid.',
        constraints: ['1 <= croakOfFrogs.length <= 10^5'],
        hint: 'Track counts of c, r, o, a stages; ensure monotonic non-increasing invariant c >= r >= o >= a and track max active frogs.',
        starter: {
            python: 'def solve(croakOfFrogs):\n    # Write your logic here\n    return -1',
            javascript: 'function solve(croakOfFrogs) {\n    // Write your logic here\n    return -1;\n}'
        },
        solution: {
            python: 'def solve(croakOfFrogs):\n    c = r = o = a = active = max_active = 0\n    for ch in croakOfFrogs:\n        if ch == "c": c += 1; active += 1; max_active = max(max_active, active)\n        elif ch == "r": c -= 1; r += 1\n        elif ch == "o": r -= 1; o += 1\n        elif ch == "a": o -= 1; a += 1\n        elif ch == "k": a -= 1; active -= 1\n        else: return -1\n        if min(c, r, o, a) < 0: return -1\n    return max_active if c == r == o == a == 0 else -1',
            javascript: 'function solve(croakOfFrogs) {\n    let c = 0, r = 0, o = 0, a = 0, active = 0, maxActive = 0;\n    for (const ch of croakOfFrogs) {\n        if (ch === "c") { c++; active++; maxActive = Math.max(maxActive, active); }\n        else if (ch === "r") { c--; r++; }\n        else if (ch === "o") { r--; o++; }\n        else if (ch === "a") { o--; a++; }\n        else if (ch === "k") { a--; active--; }\n        else return -1;\n        if (c < 0 || r < 0 || o < 0 || a < 0) return -1;\n    }\n    return (c === 0 && r === 0 && o === 0 && a === 0) ? maxActive : -1;\n}'
        },
        testCases: [
            { args: ['croakcroak'], expected: 1, isHidden: false },
            { args: ['crcoakroak'], expected: 2, isHidden: false },
            { args: ['croakcrook'], expected: -1, isHidden: true }
        ]
    },
    {
        id: 'phpe-16',
        company: 'phonepe',
        category: 'startup',
        number: 16,
        title: 'Minimum Cost to Move Chips to Same Position',
        difficulty: 'Easy',
        topic: 'Math & Parity',
        frequency: '84% in PhonePe Screening',
        context: 'Consolidating shard tokens to one node when 2-hop moves are free',
        fnName: 'solve',
        params: [{ name: 'position', type: 'int[]' }],
        returnType: 'int',
        description: 'Moving a chip by 2 units costs `0`, and moving by 1 unit costs `1`. Return the minimum cost to move all chips to the same position.',
        constraints: ['1 <= position.length <= 100'],
        hint: 'All even positions can merge for free, and all odd positions can merge for free; answer is min(evenCount, oddCount).',
        starter: {
            python: 'def solve(position):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(position) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(position):\n    odd = sum(p & 1 for p in position)\n    return min(odd, len(position) - odd)',
            javascript: 'function solve(position) {\n    const odd = position.filter(p => p & 1).length;\n    return Math.min(odd, position.length - odd);\n}'
        },
        testCases: [
            { args: [[1, 2, 3]], expected: 1, isHidden: false },
            { args: [[2, 2, 2, 3, 3]], expected: 2, isHidden: false },
            { args: [[1, 1000000000]], expected: 1, isHidden: true }
        ]
    },
    {
        id: 'phpe-17',
        company: 'phonepe',
        category: 'startup',
        number: 17,
        title: 'Number of Laser Beams in a Bank',
        difficulty: 'Medium',
        topic: 'Arrays & Counting',
        frequency: '86% in PhonePe OA',
        context: 'Counting active security links between consecutive non-empty server rows',
        fnName: 'solve',
        params: [{ name: 'bank', type: 'string[]' }],
        returnType: 'int',
        description: 'Each row of `bank` is a binary string (`"1"` = security device). Two devices have a laser beam between them if they are on different rows `r1 < r2` and there are NO devices on any row strictly between `r1` and `r2`. Return total laser beams.',
        constraints: ['1 <= bank.length <= 500'],
        hint: 'Skip rows with 0 devices; multiply previous non-zero row count by current row count and sum.',
        starter: {
            python: 'def solve(bank):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(bank) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(bank):\n    prev = ans = 0\n    for row in bank:\n        c = row.count("1")\n        if c:\n            ans += prev * c\n            prev = c\n    return ans',
            javascript: 'function solve(bank) {\n    let prev = 0, ans = 0;\n    for (const row of bank) {\n        let c = 0;\n        for (const ch of row) if (ch === "1") c++;\n        if (c > 0) { ans += prev * c; prev = c; }\n    }\n    return ans;\n}'
        },
        testCases: [
            { args: [['011001', '000000', '010100', '001000']], expected: 8, isHidden: false },
            { args: [['000', '111', '000']], expected: 0, isHidden: false },
            { args: [['11', '11']], expected: 4, isHidden: true }
        ]
    },
    {
        id: 'phpe-18',
        company: 'phonepe',
        category: 'startup',
        number: 18,
        title: 'Minimum Suffix Flips to Match Target Binary String',
        difficulty: 'Medium',
        topic: 'Greedy',
        frequency: '85% in PhonePe SDE-1',
        context: 'Minimum range-flip operations to configure feature flag bitstring',
        fnName: 'solve',
        params: [{ name: 'target', type: 'string' }],
        returnType: 'int',
        description: 'Starting from `"000...0"` of the same length as `target`, one operation flips all bits from index `i` to the end. Return the minimum operations to reach `target`.',
        constraints: ['1 <= target.length <= 10^5'],
        hint: 'Count transitions from current bit state starting from "0".',
        starter: {
            python: 'def solve(target):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(target) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(target):\n    cur, flips = "0", 0\n    for ch in target:\n        if ch != cur: flips += 1; cur = ch\n    return flips',
            javascript: 'function solve(target) {\n    let cur = "0", flips = 0;\n    for (const ch of target) if (ch !== cur) { flips++; cur = ch; }\n    return flips;\n}'
        },
        testCases: [
            { args: ['10111'], expected: 3, isHidden: false },
            { args: ['101'], expected: 3, isHidden: false },
            { args: ['00000'], expected: 0, isHidden: true }
        ]
    },
    {
        id: 'phpe-19',
        company: 'phonepe',
        category: 'startup',
        number: 19,
        title: 'Maximum Twin Sum of a Linked List Array',
        difficulty: 'Medium',
        topic: 'Two Pointers',
        frequency: '87% in PhonePe Screening',
        context: 'Pairing symmetric front and back transaction pairs for max combined value',
        fnName: 'solve',
        params: [{ name: 'nums', type: 'int[]' }],
        returnType: 'int',
        description: 'Given an even-length integer array `nums` of length `n`, the twin of index `i` is `n - 1 - i`. Return the maximum twin sum `nums[i] + nums[n - 1 - i]`.',
        constraints: ['2 <= nums.length <= 10^5 (even)'],
        hint: 'Use two pointers from left and right moving inward and track max(nums[l] + nums[r]).',
        starter: {
            python: 'def solve(nums):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(nums) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(nums):\n    n = len(nums)\n    return max(nums[i] + nums[n - 1 - i] for i in range(n // 2))',
            javascript: 'function solve(nums) {\n    const n = nums.length;\n    let best = 0;\n    for (let i = 0; i < n / 2; i++) best = Math.max(best, nums[i] + nums[n - 1 - i]);\n    return best;\n}'
        },
        testCases: [
            { args: [[5, 4, 2, 1]], expected: 6, isHidden: false },
            { args: [[4, 2, 2, 3]], expected: 7, isHidden: false },
            { args: [[1, 100000]], expected: 100001, isHidden: true }
        ]
    },
    {
        id: 'phpe-20',
        company: 'phonepe',
        category: 'startup',
        number: 20,
        title: 'Minimum Time to Make Rope Colorful',
        difficulty: 'Medium',
        topic: 'Greedy',
        frequency: '88% in PhonePe OA',
        context: 'Removing consecutive duplicate color banners with minimal removal cost',
        fnName: 'solve',
        params: [{ name: 'colors', type: 'string' }, { name: 'neededTime', type: 'int[]' }],
        returnType: 'int',
        description: 'Given string `colors` and integer array `neededTime` where `neededTime[i]` is the cost to remove `colors[i]`, return the minimum total time to ensure no two adjacent characters are the same.',
        constraints: ['1 <= colors.length <= 10^5'],
        hint: 'For each contiguous run of identical characters, keep the one with max neededTime and remove all others (sum - max).',
        starter: {
            python: 'def solve(colors, neededTime):\n    # Write your logic here\n    return 0',
            javascript: 'function solve(colors, neededTime) {\n    // Write your logic here\n    return 0;\n}'
        },
        solution: {
            python: 'def solve(colors, neededTime):\n    total = 0\n    prev_max = neededTime[0]\n    for i in range(1, len(colors)):\n        if colors[i] == colors[i - 1]:\n            total += min(prev_max, neededTime[i])\n            prev_max = max(prev_max, neededTime[i])\n        else:\n            prev_max = neededTime[i]\n    return total',
            javascript: 'function solve(colors, neededTime) {\n    let total = 0, prevMax = neededTime[0];\n    for (let i = 1; i < colors.length; i++) {\n        if (colors[i] === colors[i - 1]) {\n            total += Math.min(prevMax, neededTime[i]);\n            prevMax = Math.max(prevMax, neededTime[i]);\n        } else prevMax = neededTime[i];\n    }\n    return total;\n}'
        },
        testCases: [
            { args: ['abaac', [1, 2, 3, 4, 5]], expected: 3, isHidden: false },
            { args: ['abc', [1, 2, 3]], expected: 0, isHidden: false },
            { args: ['aabaa', [1, 2, 3, 4, 1]], expected: 2, isHidden: true }
        ]
    }
];

